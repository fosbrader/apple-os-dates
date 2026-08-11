import assert from "node:assert/strict";
import test from "node:test";
import type { ObjectDefinition, SchemaTypeDefinition } from "sanity";

import {
  buildHistoricalAnalysisDataset,
  stableSerializeHistoricalAnalysis,
} from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";

import {
  PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
  publishedHistoricalReleaseSourceQuery,
} from "../src/lib/historical-release-source";
import {
  HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE,
  historicalReleaseMetadata,
  historicalReleaseMetadataDocumentId,
  validateHistoricalChronologyCoverage,
  validateHistoricalMetadataEvidence,
  validateHistoricalReleaseMetadataReleaseVersion,
} from "../src/sanity/schemas/historicalReleaseMetadata";

interface FieldShape {
  name: string;
  type: string;
  fields?: FieldShape[];
  of?: Array<{
    type?: string;
    to?: Array<{ type?: string }>;
  }>;
  options?: {
    list?: Array<{ value?: string }>;
  };
}

function fieldsFor(schema: SchemaTypeDefinition): FieldShape[] {
  return ((schema as ObjectDefinition).fields ?? []) as FieldShape[];
}

function referencedTypes(field: FieldShape | undefined): string[] {
  return (field?.of?.[0]?.to ?? [])
    .map(({ type }) => type)
    .filter((type): type is string => Boolean(type));
}

test("historical metadata is a separate, explicitly sourced sidecar", () => {
  assert.equal(historicalReleaseMetadata.name, HISTORICAL_RELEASE_METADATA_DOCUMENT_TYPE);
  assert.equal(historicalReleaseMetadata.type, "document");

  const fields = fieldsFor(historicalReleaseMetadata);
  assert.deepEqual(
    fields.map(({ name }) => name),
    [
      "releaseVersion",
      "productFamilyId",
      "releaseClass",
      "releasePosition",
      "releaseCycleId",
      "metadataEvidence",
      "chronologyCoverage",
    ],
  );

  assert.deepEqual(
    fields
      .find(({ name }) => name === "releaseClass")
      ?.options?.list?.map(({ value }) => value),
    ["major", "minor", "patch"],
  );
  const metadataEvidence = fields.find(
    ({ name }) => name === "metadataEvidence",
  );
  assert.deepEqual(
    metadataEvidence?.fields?.map(({ name }) => name),
    ["productFamily", "releaseClass", "releasePosition", "releaseCycle"],
  );
  for (const evidenceField of metadataEvidence?.fields ?? []) {
    assert.deepEqual(referencedTypes(evidenceField), ["source", "auditBatch"]);
  }

  const coverage = fields.find(({ name }) => name === "chronologyCoverage");
  assert.deepEqual(
    coverage?.fields?.map(({ name }) => name),
    ["state", "reason", "evidence"],
  );
  assert.deepEqual(
    coverage?.fields
      ?.find(({ name }) => name === "state")
      ?.options?.list?.map(({ value }) => value),
    ["complete", "unknown"],
  );
  assert.deepEqual(
    coverage?.fields
      ?.find(({ name }) => name === "reason")
      ?.options?.list?.map(({ value }) => value),
    [
      "not-reviewed",
      "source-coverage-incomplete",
      "same-day-order-unknown",
    ],
  );
  assert.deepEqual(
    referencedTypes(
      coverage?.fields?.find(({ name }) => name === "evidence"),
    ),
    ["source", "auditBatch"],
  );
  assert.deepEqual(historicalReleaseMetadata.initialValue, {
    chronologyCoverage: {
      state: "unknown",
      reason: "not-reviewed",
    },
  });
});

test("sidecar IDs are deterministic and fail closed for unsafe release IDs", () => {
  assert.equal(
    historicalReleaseMetadataDocumentId("release.ios.27"),
    "historicalReleaseMetadata.release.ios.27",
  );
  assert.equal(
    historicalReleaseMetadataDocumentId("drafts.release.ios.27"),
    "historicalReleaseMetadata.release.ios.27",
  );
  assert.equal(historicalReleaseMetadataDocumentId("release/ios/27"), null);
  assert.equal(historicalReleaseMetadataDocumentId("x".repeat(128)), null);
});

function validationContext(
  document: Record<string, unknown>,
  duplicateCount = 0,
  onFetch?: (query: string, params: Record<string, unknown>) => void,
) {
  return {
    document,
    getClient: () => ({
      fetch: async (query: string, params: Record<string, unknown>) => {
        onFetch?.(query, params);
        return duplicateCount;
      },
    }),
  } as never;
}

test("release references enforce stable local identity and schema uniqueness", async () => {
  const releaseVersion = { _ref: "release.ios.27" };
  const documentId = "historicalReleaseMetadata.release.ios.27";
  let fetched = false;
  assert.equal(
    await validateHistoricalReleaseMetadataReleaseVersion(
      releaseVersion,
      validationContext(
        { _id: `drafts.${documentId}` },
        0,
        (query, params) => {
          fetched = true;
          assert.match(query, /releaseVersion\._ref in \$releaseVersionIds/);
          assert.deepEqual(params.releaseVersionIds, [
            "release.ios.27",
            "drafts.release.ios.27",
          ]);
          assert.deepEqual(params.documentIds, [
            documentId,
            `drafts.${documentId}`,
          ]);
        },
      ),
    ),
    true,
  );
  assert.equal(fetched, true);

  assert.match(
    String(
      await validateHistoricalReleaseMetadataReleaseVersion(
        releaseVersion,
        validationContext({ _id: "random-sidecar-id" }),
      ),
    ),
    /must use document ID/,
  );
  assert.match(
    String(
      await validateHistoricalReleaseMetadataReleaseVersion(
        releaseVersion,
        validationContext({ _id: documentId }, 1),
      ),
    ),
    /already has a historical metadata sidecar/,
  );
  assert.match(
    String(
      await validateHistoricalReleaseMetadataReleaseVersion(
        { _ref: "release/ios/27" },
        validationContext({}),
      ),
    ),
    /safe historical metadata document ID/,
  );
});

test("FR-007 chronology coverage stays closed, explicit, and evidence-backed", () => {
  const evidence = [{ _ref: "source.apple.release-notes" }];

  assert.equal(
    validateHistoricalChronologyCoverage({
      state: "complete",
      evidence,
    }),
    true,
  );
  assert.equal(
    validateHistoricalChronologyCoverage({
      state: "unknown",
      reason: "source-coverage-incomplete",
      evidence,
    }),
    true,
  );
  assert.match(
    String(
      validateHistoricalChronologyCoverage({
        state: "partial",
        evidence,
      }),
    ),
    /Complete or Unknown/,
  );
  assert.match(
    String(
      validateHistoricalChronologyCoverage({
        state: "unknown",
        evidence,
      }),
    ),
    /requires a supported reason/,
  );
  assert.match(
    String(
      validateHistoricalChronologyCoverage({
        state: "complete",
        reason: "not-reviewed",
        evidence,
      }),
    ),
    /cannot include an unknown-coverage reason/,
  );
  assert.match(
    String(
      validateHistoricalChronologyCoverage({
        state: "complete",
        evidence: [],
      }),
    ),
    /requires at least one source or audit-batch reference/,
  );
});

test("each cohort assertion retains separately scoped evidence", () => {
  const source = [{ _ref: "source.apple.release-notes" }];
  assert.equal(
    validateHistoricalMetadataEvidence({
      productFamily: source,
      releaseClass: source,
      releasePosition: source,
      releaseCycle: source,
    }),
    true,
  );
  assert.match(
    String(
      validateHistoricalMetadataEvidence({
        productFamily: source,
        releaseClass: source,
        releasePosition: source,
      }),
    ),
    /Every cohort assertion/,
  );
  assert.match(
    String(
      validateHistoricalMetadataEvidence({
        productFamily: [],
        releaseClass: source,
        releasePosition: source,
        releaseCycle: source,
      }),
    ),
    /productFamily requires at least one/,
  );
});

test("published projection is adapter-shaped without descriptive inference", () => {
  const query = String(publishedHistoricalReleaseSourceQuery);

  assert.deepEqual(PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS, {
    perspective: "published",
  });
  assert.equal(
    query.match(/!\(_id in path\("drafts\.\*\*"\)\)/g)?.length,
    4,
  );

  for (const requiredProjection of [
    '"lifecycle": releaseStatus',
    '"statusEffectiveOn": statusEffectiveDate',
    "statusFirstObservedAt",
    '"occurredOn": appearanceDate',
    '"availability": availabilityState',
    '"revisionOfId": select(',
    '"replacesEventId": replaces->stableEventId',
    '"replacedByEventId": replacedBy->stableEventId',
    '"releaseId": releaseVersion->_id',
    '"platformId": releaseVersion->releaseTrain->platform->_id',
    '"sourceEvidenceIds": array::unique(',
    "metadataEvidence.productFamily[]->_id",
    "metadataEvidence.releaseClass[]->_id",
    "metadataEvidence.releasePosition[]->_id",
    "metadataEvidence.releaseCycle[]->_id",
    '"sourceEvidenceIds": chronologyCoverage.evidence[]->_id',
  ]) {
    assert.ok(query.includes(requiredProjection), requiredProjection);
  }

  assert.doesNotMatch(query, /\b(label|note)\b/);
  assert.doesNotMatch(query, /_updatedAt|coalesce\s*\(|order\s*\(/);
  assert.doesNotMatch(query, /^\s*version\s*,?$/m);
});

test("adapter plus FR-007 rows ignore display versions, labels, notes, and input order", () => {
  const input = {
    asOfDate: "2026-06-10",
    issuedAt: "2026-06-10T12:00:00.000Z",
    releases: [
      {
        id: "release.explicit",
        lifecycle: "active" as const,
        version: "999.999 presentation only",
      },
    ],
    compatibilityMilestones: [],
    events: [
      {
        id: "event-two-document",
        stableEventId: "stable-event-two",
        releaseId: "release.explicit",
        occurredOn: "2026-06-08",
        firstObservedAt: "2026-06-08T12:00:00.000Z",
        channel: "developerBeta" as const,
        sequence: 2,
        availability: "available" as const,
        displayLabel: "Misleading public beta label",
        note: "Pretend this is a release candidate",
      },
      {
        id: "event-one-document",
        stableEventId: "stable-event-one",
        releaseId: "release.explicit",
        occurredOn: "2026-06-01",
        firstObservedAt: "2026-06-01T12:00:00.000Z",
        channel: "developerBeta" as const,
        sequence: 1,
        availability: "available" as const,
        displayLabel: "Arbitrary presentation",
        note: "Arbitrary note",
      },
    ],
  };
  const metadata = [
    {
      releaseId: "release.explicit",
      platformId: "platform.explicit",
      productFamilyId: "family.explicit",
      releaseClass: "minor" as const,
      releasePosition: 4,
      releaseCycleId: "cycle.explicit",
      sourceEvidenceIds: ["source.explicit.metadata"],
      chronologyCoverage: {
        state: "complete" as const,
        sourceEvidenceIds: ["source.explicit.chronology"],
      },
    },
  ];
  const first = buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations(input),
    releaseMetadata: metadata,
  });
  const second = buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations({
      ...input,
      releases: [
        { ...input.releases[0], version: "1.0 changed display" },
      ] as typeof input.releases,
      events: [...input.events]
        .reverse()
        .map((event) => ({ ...event, displayLabel: "changed", note: "changed" })),
    }),
    releaseMetadata: metadata,
  });

  assert.equal(
    stableSerializeHistoricalAnalysis(second),
    stableSerializeHistoricalAnalysis(first),
  );
  assert.deepEqual(
    first.canonicalEvents.map(({ eventId, stage }) => ({ eventId, stage })),
    [
      { eventId: "event:stable-event-one", stage: "developer-beta:1" },
      { eventId: "event:stable-event-two", stage: "developer-beta:2" },
    ],
  );
  assert.deepEqual(
    first.releaseCycles.map(
      ({ productFamilyId, releaseClass, releasePosition, releaseCycleId }) => ({
        productFamilyId,
        releaseClass,
        releasePosition,
        releaseCycleId,
      }),
    ),
    [
      {
        productFamilyId: "family.explicit",
        releaseClass: "minor",
        releasePosition: 4,
        releaseCycleId: "cycle.explicit",
      },
    ],
  );
});
