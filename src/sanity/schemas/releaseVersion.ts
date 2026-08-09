import { defineArrayMember, defineField, defineType } from "sanity";
import { uniqueReleaseVersion } from "../validation";
import {
  citationsRequiredWhenApproved,
  validateChronologyCoverage,
  validateProvenanceStatus,
  validateStatusEffectiveDate,
} from "./schemaValidation";

interface MilestoneValue {
  label?: string;
  date?: string;
}

type ReleaseStatusValue = "active" | "released" | "superseded";

export const releaseVersion = defineType({
  name: "releaseVersion",
  title: "Release Version",
  type: "document",
  initialValue: {
    milestones: [],
    releaseStatus: "active",
    chronologyCoverage: { status: "unknown" },
    provenanceStatus: "legacyImported",
    editorialReview: { status: "draft" },
  },
  fields: [
    defineField({
      name: "releaseTrain",
      title: "Release Train",
      type: "reference",
      to: [{ type: "releaseTrain" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: 'e.g., "18.4", "26.0"',
      validation: (rule) =>
        rule
          .required()
          .regex(/^\d+\.\d+(?:\.\d+)?[a-z]?$/i, {
            name: "Apple release version",
          })
          .custom(uniqueReleaseVersion),
    }),
    defineField({
      name: "releaseStatus",
      title: "Release Status",
      type: "string",
      description:
        "Lifecycle state. Superseded cycles ended without a public release.",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Released", value: "released" },
          { title: "Superseded", value: "superseded" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.custom((value, context) => {
          const publicReleaseDate = context.document?.publicReleaseDate as
            | string
            | undefined;

          // Existing documents infer their state until explicitly migrated.
          if (!value) return true;
          if (!["active", "released", "superseded"].includes(value)) {
            return "Choose Active, Released, or Superseded.";
          }
          if (value === "released" && !publicReleaseDate) {
            return "Released versions require a public release date.";
          }
          if (value !== "released" && publicReleaseDate) {
            return `${value === "active" ? "Active" : "Superseded"} versions cannot have a public release date.`;
          }

          return true;
        }),
    }),
    defineField({
      name: "statusEffectiveDate",
      title: "Status Effective Date",
      type: "date",
      description:
        "Date when the recorded lifecycle status became effective. Leave it empty when the date is not supported by source evidence.",
      validation: (rule) => rule.custom(validateStatusEffectiveDate),
    }),
    defineField({
      name: "chronologyCoverage",
      title: "Chronology Coverage",
      type: "object",
      description:
        "Private evidence boundary for the recorded event chronology. Unknown is the safe default until coverage is reviewed.",
      fields: [
        defineField({
          name: "status",
          title: "Coverage Status",
          type: "string",
          options: {
            list: [
              { title: "Unknown", value: "unknown" },
              { title: "Partial", value: "partial" },
              { title: "Complete", value: "complete" },
            ],
            layout: "radio",
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "auditedChannels",
          title: "Audited Channels",
          type: "array",
          of: [
            defineArrayMember({
              type: "string",
              options: {
                list: [
                  { title: "Developer Beta", value: "developerBeta" },
                  { title: "Public Beta", value: "publicBeta" },
                  {
                    title: "Release Candidate",
                    value: "releaseCandidate",
                  },
                  { title: "Golden Master", value: "goldenMaster" },
                  { title: "Public Release", value: "public" },
                  {
                    title: "Security Response",
                    value: "securityResponse",
                  },
                  { title: "Recovery / Re-release", value: "recovery" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
          ],
          validation: (rule) => rule.unique(),
        }),
        defineField({
          name: "coverageThrough",
          title: "Coverage Through",
          type: "date",
          description:
            "Last appearance date included in the audit. This date is not a prediction cutoff.",
        }),
        defineField({
          name: "knownGapNote",
          title: "Known-Gap Note",
          type: "text",
          rows: 4,
          description:
            "Private editorial note. State known gaps and evidence limits without inferring missing events.",
          validation: (rule) => rule.max(3000),
        }),
        defineField({
          name: "verifiedAt",
          title: "Verified At",
          type: "datetime",
        }),
        defineField({
          name: "auditBatch",
          title: "Audit Batch",
          type: "reference",
          to: [{ type: "auditBatch" }],
        }),
      ],
      validation: (rule) => rule.custom(validateChronologyCoverage),
    }),
    defineField({
      name: "releaseNotesUrl",
      title: "Release Notes URL",
      type: "url",
      validation: (rule) =>
        rule.uri({ scheme: ["https"] }).warning("Use an HTTPS URL."),
    }),
    defineField({
      name: "keyFeatures",
      title: "Key Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "AI/ML", value: "ai" },
                  { title: "UI/UX", value: "ui" },
                  { title: "Performance", value: "performance" },
                  { title: "Privacy", value: "privacy" },
                  { title: "Accessibility", value: "accessibility" },
                  { title: "Developer", value: "developer" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "category" },
          },
        },
      ],
    }),
    defineField({
      name: "publicReleaseDate",
      title: "Public Release Date",
      type: "date",
      description:
        "Date of the closing Public or qualifying GM release event. Leave empty if still in beta.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const milestones =
            (context.document?.milestones as MilestoneValue[] | undefined) ||
            [];
          const explicitStatus = context.document
            ?.releaseStatus as ReleaseStatusValue | undefined;
          const releaseStatus =
            explicitStatus || (value ? "released" : "active");
          const publicMilestone = milestones.find(
            (milestone) => milestone.label?.trim().toLowerCase() === "public"
          );
          const gmMilestone = milestones.find(
            (milestone) => milestone.label?.trim().toLowerCase() === "gm"
          );
          const releaseMilestone = publicMilestone || gmMilestone;

          if (releaseStatus === "superseded") {
            if (value) {
              return "Superseded versions cannot have a public release date.";
            }
            if (releaseMilestone?.date) {
              return `Remove the ${releaseMilestone.label} milestone from this superseded cycle.`;
            }
            return true;
          }
          if (releaseStatus === "active") {
            if (value) {
              return "Active versions cannot have a public release date.";
            }
            if (releaseMilestone?.date) {
              return `Remove the ${releaseMilestone.label} milestone or mark this version Released.`;
            }
            return true;
          }
          if (!value && releaseMilestone?.date) {
            return `Enter ${releaseMilestone.date} here so this release is no longer shown as Active.`;
          }
          if (
            value &&
            releaseMilestone?.date &&
            releaseMilestone.date !== value
          ) {
            return `This date must match the ${releaseMilestone?.label} milestone (${releaseMilestone?.date}).`;
          }

          return true;
        }),
    }),
    defineField({
      name: "versionNote",
      title: "Version Note",
      type: "string",
      description:
        'Optional note about this version (e.g., "Apple Intelligence Release")',
    }),
    defineField({
      name: "overview",
      title: "Sourced Version Overview",
      type: "blockContent",
      description:
        "Optional editorial overview. Build/event changes are aggregated automatically and must not be duplicated here.",
    }),
    defineField({
      name: "citations",
      title: "Version Sources",
      type: "array",
      of: [defineArrayMember({ type: "citation" })],
      description:
        "Sources supporting the overview or version-level claims. Timeline event sources live on release events.",
      validation: (rule) => rule.custom(citationsRequiredWhenApproved),
    }),
    defineField({
      name: "provenanceStatus",
      title: "Provenance Status",
      type: "string",
      description:
        "Describes the verification state of this version-level record, not every child event.",
      options: {
        list: [
          { title: "Legacy imported", value: "legacyImported" },
          { title: "Audit verified", value: "auditVerified" },
          { title: "Source linked", value: "sourceLinked" },
          { title: "Editorially verified", value: "editoriallyVerified" },
        ],
        layout: "radio",
      },
      validation: (rule) =>
        rule.required().custom(validateProvenanceStatus),
    }),
    defineField({
      name: "auditBatches",
      title: "Audit Batches",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "auditBatch" }],
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "editorialReview",
      title: "Editorial Review",
      type: "editorialReview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "milestones",
      title: "Legacy Milestones",
      type: "array",
      of: [{ type: "betaMilestone" }],
      description:
        "Compatibility data for the audited pre-event chronology. New releases use Release Event documents and do not duplicate entries here.",
      validation: (rule) =>
        rule
          .custom((value?: MilestoneValue[]) => {
            if (!value || value.length < 2) return true;

            for (let index = 1; index < value.length; index += 1) {
              const previous = value[index - 1];
              const current = value[index];
              if (
                previous.date &&
                current.date &&
                current.date < previous.date
              ) {
                return `${current.label || `Milestone ${index + 1}`} is dated before ${previous.label || `milestone ${index}`}. Keep milestones oldest to newest.`;
              }
            }

            return true;
          }),
    }),
  ],
  preview: {
    select: {
      version: "version",
      trainName: "releaseTrain.displayName",
      releaseStatus: "releaseStatus",
      publicDate: "publicReleaseDate",
    },
    prepare({ version, trainName, releaseStatus, publicDate }) {
      const effectiveStatus =
        releaseStatus || (publicDate ? "released" : "active");
      const status =
        effectiveStatus === "superseded"
          ? "Superseded"
          : effectiveStatus === "released"
            ? `Released ${publicDate}`
            : "In Beta";
      return {
        title: `${trainName || "?"} ${version || ""}`.trim(),
        subtitle: status,
      };
    },
  },
  orderings: [
    {
      title: "Version (Descending)",
      name: "versionDesc",
      by: [{ field: "version", direction: "desc" }],
    },
  ],
});
