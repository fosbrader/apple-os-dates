import { defineArrayMember, defineField, defineType } from "sanity";
import type { StringRule, ValidationContext } from "sanity";
import {
  HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE,
  historicalReleaseMetadataDocumentId,
} from "../../lib/historical-release-metadata-id";

export {
  HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE,
  HISTORICAL_RELEASE_METADATA_ID_PREFIX,
  historicalReleaseMetadataDocumentId,
} from "../../lib/historical-release-metadata-id";

const apiVersion = "2024-01-01";

const HISTORICAL_COVERAGE_REASONS = [
  "not-reviewed",
  "source-coverage-incomplete",
  "same-day-order-unknown",
] as const;

interface ReferenceValue {
  _ref?: string;
}

export interface HistoricalChronologyCoverageValue {
  state?: string;
  reason?: string;
  evidence?: ReferenceValue[];
}

export interface HistoricalMetadataEvidenceValue {
  productFamily?: ReferenceValue[];
  releaseClass?: ReferenceValue[];
  releasePosition?: ReferenceValue[];
  releaseCycle?: ReferenceValue[];
}

function normalizeDocumentId(value: string | undefined): string | undefined {
  const normalized = value?.replace(/^drafts\./, "").trim();
  return normalized || undefined;
}

export async function validateHistoricalReleaseMetadataReleaseVersion(
  value: ReferenceValue | undefined,
  context: ValidationContext,
) {
  const releaseVersionId = normalizeDocumentId(value?._ref);
  if (!releaseVersionId) return true;

  const expectedDocumentId = historicalReleaseMetadataDocumentId(
    releaseVersionId,
  );
  if (!expectedDocumentId) {
    return "The release version identity cannot form a safe historical metadata document ID.";
  }

  const currentDocumentId = normalizeDocumentId(context.document?._id);
  if (currentDocumentId && currentDocumentId !== expectedDocumentId) {
    return `Historical metadata for this release must use document ID ${expectedDocumentId}.`;
  }

  const documentIds = currentDocumentId
    ? [currentDocumentId, `drafts.${currentDocumentId}`]
    : [];
  const duplicateCount = await context
    .getClient({ apiVersion })
    .fetch<number>(
      `count(*[
        _type == $documentType &&
        releaseVersion._ref in $releaseVersionIds &&
        !(_id in $documentIds)
      ])`,
      {
        documentType: HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE,
        releaseVersionIds: [
          releaseVersionId,
          `drafts.${releaseVersionId}`,
        ],
        documentIds,
      },
    );

  return duplicateCount === 0
    ? true
    : "This release version already has a historical metadata sidecar.";
}

export function validateHistoricalChronologyCoverage(
  value: HistoricalChronologyCoverageValue | undefined,
) {
  if (!value) return true;

  if (value.state !== "complete" && value.state !== "unknown") {
    return "Choose Complete or Unknown chronology coverage.";
  }

  const evidenceIds = (value.evidence ?? [])
    .map((reference) => reference?._ref?.trim())
    .filter((reference): reference is string => Boolean(reference));
  if (evidenceIds.length === 0) {
    return "Chronology coverage requires at least one source or audit-batch reference.";
  }
  if (new Set(evidenceIds).size !== evidenceIds.length) {
    return "Chronology coverage evidence references must be unique.";
  }

  if (value.state === "complete") {
    return value.reason
      ? "Complete chronology coverage cannot include an unknown-coverage reason."
      : true;
  }

  return HISTORICAL_COVERAGE_REASONS.includes(
    value.reason as (typeof HISTORICAL_COVERAGE_REASONS)[number],
  )
    ? true
    : "Unknown chronology coverage requires a supported reason.";
}

export function validateHistoricalMetadataEvidence(
  value: HistoricalMetadataEvidenceValue | undefined,
) {
  if (!value) return true;

  for (const [scope, references] of Object.entries(value) as Array<
    [string, ReferenceValue[]]
  >) {
    const evidenceIds = (references ?? [])
      .map((reference) => reference?._ref?.trim())
      .filter((reference): reference is string => Boolean(reference));
    if (evidenceIds.length === 0) {
      return `${scope} requires at least one source or audit-batch reference.`;
    }
    if (new Set(evidenceIds).size !== evidenceIds.length) {
      return `${scope} evidence references must be unique.`;
    }
  }

  return ["productFamily", "releaseClass", "releasePosition", "releaseCycle"]
    .every((scope) => Object.hasOwn(value, scope))
    ? true
    : "Every cohort assertion requires separately scoped evidence.";
}

const stableIdentityValidation = (rule: StringRule) =>
  rule
    .required()
    .min(1)
    .max(220)
    .regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/, {
      name: "stable identity",
    });

const evidenceReference = defineArrayMember({
  type: "reference",
  to: [{ type: "source" }, { type: "auditBatch" }],
});

export const historicalReleaseMetadata = defineType({
  name: HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE,
  title: "Historical Release Metadata",
  type: "document",
  groups: [
    { name: "identity", title: "Cohort Identity", default: true },
    { name: "evidence", title: "Evidence" },
    { name: "coverage", title: "Chronology Coverage" },
  ],
  initialValue: {
    chronologyCoverage: {
      state: "unknown",
      reason: "not-reviewed",
    },
  },
  fields: [
    defineField({
      name: "releaseVersion",
      title: "Release Version",
      type: "reference",
      group: "identity",
      description:
        "Stable release-cycle identity. The document ID is deterministically keyed to this reference.",
      to: [{ type: "releaseVersion" }],
      options: { disableNew: true },
      validation: (rule) =>
        rule
          .required()
          .custom(validateHistoricalReleaseMetadataReleaseVersion),
    }),
    defineField({
      name: "productFamilyId",
      title: "Product Family Identity",
      type: "string",
      group: "identity",
      description:
        "Explicit stable cohort identity. Do not derive it from a platform name or display version.",
      validation: stableIdentityValidation,
    }),
    defineField({
      name: "releaseClass",
      title: "Release Class",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Major", value: "major" },
          { title: "Minor", value: "minor" },
          { title: "Patch", value: "patch" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.required().custom((value) =>
          value === "major" || value === "minor" || value === "patch"
            ? true
            : "Release class must be Major, Minor, or Patch.",
        ),
    }),
    defineField({
      name: "releasePosition",
      title: "Release Position",
      type: "number",
      group: "identity",
      description:
        "Explicit positive ordinal within the declared release cycle.",
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: "releaseCycleId",
      title: "Release Cycle Identity",
      type: "string",
      group: "identity",
      description:
        "Explicit stable cohort identity. Do not parse it from a display version.",
      validation: stableIdentityValidation,
    }),
    defineField({
      name: "metadataEvidence",
      title: "Metadata Evidence",
      type: "object",
      group: "evidence",
      description:
        "Sources or audit batches scoped to each explicit cohort assertion.",
      fields: [
        defineField({
          name: "productFamily",
          title: "Product Family Evidence",
          type: "array",
          of: [evidenceReference],
          validation: (rule) => rule.required().min(1).unique(),
        }),
        defineField({
          name: "releaseClass",
          title: "Release Class Evidence",
          type: "array",
          of: [evidenceReference],
          validation: (rule) => rule.required().min(1).unique(),
        }),
        defineField({
          name: "releasePosition",
          title: "Release Position Evidence",
          type: "array",
          of: [evidenceReference],
          validation: (rule) => rule.required().min(1).unique(),
        }),
        defineField({
          name: "releaseCycle",
          title: "Release Cycle Evidence",
          type: "array",
          of: [evidenceReference],
          validation: (rule) => rule.required().min(1).unique(),
        }),
      ],
      validation: (rule) =>
        rule.required().custom(validateHistoricalMetadataEvidence),
    }),
    defineField({
      name: "chronologyCoverage",
      title: "Chronology Coverage",
      type: "object",
      group: "coverage",
      description:
        "A separate, sourced FR-007 coverage assertion. Unknown is the safe default.",
      fields: [
        defineField({
          name: "state",
          title: "Coverage State",
          type: "string",
          options: {
            list: [
              { title: "Complete", value: "complete" },
              { title: "Unknown", value: "unknown" },
            ],
            layout: "radio",
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "reason",
          title: "Unknown-Coverage Reason",
          type: "string",
          hidden: ({ parent }) => parent?.state !== "unknown",
          options: {
            list: [
              { title: "Not reviewed", value: "not-reviewed" },
              {
                title: "Source coverage incomplete",
                value: "source-coverage-incomplete",
              },
              {
                title: "Same-day order unknown",
                value: "same-day-order-unknown",
              },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "evidence",
          title: "Coverage Evidence",
          type: "array",
          description:
            "Sources or audit batches supporting this coverage assertion, scoped separately from cohort metadata.",
          of: [evidenceReference],
          validation: (rule) => rule.required().min(1).unique(),
        }),
      ],
      validation: (rule) =>
        rule.required().custom(validateHistoricalChronologyCoverage),
    }),
  ],
  preview: {
    select: {
      version: "releaseVersion.version",
      platform: "releaseVersion.releaseTrain.platform.name",
      releaseClass: "releaseClass",
      releasePosition: "releasePosition",
    },
    prepare({ version, platform, releaseClass, releasePosition }) {
      return {
        title: [platform, version].filter(Boolean).join(" ") ||
          "Historical release metadata",
        subtitle: [releaseClass, releasePosition]
          .filter((value) => value !== undefined)
          .join(" · "),
      };
    },
  },
});
