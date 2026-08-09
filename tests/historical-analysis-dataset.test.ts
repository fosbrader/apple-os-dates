import assert from "node:assert/strict";
import test from "node:test";

import {
  HISTORICAL_ANALYSIS_DATASET_VERSION,
  HistoricalAnalysisInputError,
  buildHistoricalAnalysisDataset,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisInput,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetInputV1,
  type HistoricalReleaseMetadataV1,
} from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";

function metadata(
  overrides: Partial<HistoricalReleaseMetadataV1> = {},
): HistoricalReleaseMetadataV1 {
  return {
    releaseId: "release.ios.27",
    platformId: "ios",
    productFamilyId: "iphone-os",
    releaseClass: "major",
    releasePosition: 27,
    releaseCycleId: "ios-27",
    chronologyCoverage: {
      state: "complete",
      sourceEvidenceIds: ["metadata:ios-27:chronology"],
    },
    sourceEvidenceIds: ["metadata:ios-27:cycle"],
    ...overrides,
  };
}

function input(
  overrides: Partial<HistoricalAnalysisDatasetInputV1> = {},
): HistoricalAnalysisDatasetInputV1 {
  const adapterResult = adaptReleaseObservations({
    asOfDate: "2026-07-10",
    issuedAt: "2026-07-10T12:00:00.000Z",
    releases: [
      {
        id: "release.ios.27",
        lifecycle: "released",
        publicReleaseDate: "2026-07-10",
        statusEffectiveOn: "2026-07-10",
        statusFirstObservedAt: "2026-07-10T12:00:00.000Z",
      },
    ],
    compatibilityMilestones: [],
    events: [
      {
        id: "beta-original",
        stableEventId: "ios27-db1-original",
        releaseId: "release.ios.27",
        occurredOn: "2026-07-01",
        firstObservedAt: "2026-07-01T12:00:00.000Z",
        channel: "developerBeta",
        sequence: 1,
        availability: "available",
      },
      {
        id: "beta-revision",
        stableEventId: "ios27-db1-revision",
        releaseId: "release.ios.27",
        occurredOn: "2026-07-02",
        firstObservedAt: "2026-07-02T12:00:00.000Z",
        channel: "developerBeta",
        sequence: 1,
        availability: "available",
        isRevision: true,
        revisionOfId: "ios27-db1-original",
      },
      {
        id: "public-beta",
        stableEventId: "ios27-pb1",
        releaseId: "release.ios.27",
        occurredOn: "2026-07-04",
        firstObservedAt: "2026-07-04T12:00:00.000Z",
        channel: "publicBeta",
        sequence: 1,
        availability: "available",
      },
    ],
  });
  return { adapterResult, releaseMetadata: [metadata()], ...overrides };
}

test("builds a sourced, revision-collapsed v1 dataset without conflating beta channels", () => {
  const result = buildHistoricalAnalysisDataset(input());

  assert.equal(result.datasetVersion, HISTORICAL_ANALYSIS_DATASET_VERSION);
  assert.deepEqual(
    result.canonicalEvents.map(({ eventId, stage, sourceEvidenceIds }) => ({
      eventId,
      stage,
      sourceEvidenceIds,
    })),
    [
      {
        eventId: "event:ios27-db1-revision",
        stage: "developer-beta:1",
        sourceEvidenceIds: ["event:ios27-db1-revision"],
      },
      {
        eventId: "event:ios27-pb1",
        stage: "public-beta:1",
        sourceEvidenceIds: ["event:ios27-pb1"],
      },
    ],
  );
  assert.equal(result.lifecycleOutcomes[0]?.outcomeEvidenceId, "release:release.ios.27:outcome");
  assert.deepEqual(validateHistoricalAnalysisDataset(result), []);
  assert.ok(result.inclusionLedger.some(({ entryId, reason }) => entryId === "adapter:event:ios27-db1-original" && reason === "replaced-by-event"));
});

test("same-day observations cannot create an invented chronology or measurable interval", () => {
  const source = input();
  source.adapterResult = adaptReleaseObservations({
    asOfDate: "2026-07-02",
    issuedAt: "2026-07-02T12:00:00.000Z",
    releases: [{ id: "release.ios.27", lifecycle: "active" }],
    compatibilityMilestones: [],
    events: [
      { id: "developer", releaseId: "release.ios.27", occurredOn: "2026-07-01", firstObservedAt: "2026-07-01T12:00:00.000Z", channel: "developerBeta", sequence: 1, availability: "available" },
      { id: "public", releaseId: "release.ios.27", occurredOn: "2026-07-01", firstObservedAt: "2026-07-01T12:00:00.000Z", channel: "publicBeta", sequence: 1, availability: "available" },
    ],
  });
  const result = buildHistoricalAnalysisDataset(source);

  assert.deepEqual(result.releaseCycles[0]?.chronologyCoverage.state, "unknown");
  assert.equal(result.releaseCycles[0]?.chronologyCoverage.reason, "same-day-order-unknown");
  assert.deepEqual(
    result.stageIntervals.map(({ interval }) => interval),
    [
      { available: false, reason: "chronology-coverage-unknown" },
      { available: false, reason: "chronology-coverage-unknown" },
    ],
  );
});

test("explicit unknown coverage remains machine-readable and source-linked", () => {
  const result = buildHistoricalAnalysisDataset(
    input({
      releaseMetadata: [
        metadata({
          chronologyCoverage: {
            state: "unknown",
            reason: "source-coverage-incomplete",
            sourceEvidenceIds: ["metadata:coverage-gap"],
          },
        }),
      ],
    }),
  );
  assert.deepEqual(result.releaseCycles[0]?.chronologyCoverage, {
    state: "unknown",
    reason: "source-coverage-incomplete",
    sourceEvidenceIds: ["metadata:coverage-gap"],
  });
  assert.ok(result.stageIntervals.every(({ sourceEvidenceIds }) => sourceEvidenceIds.includes("metadata:coverage-gap")));
});

test("future observations and superseded cycles fail closed in the adapter ledger and dataset cohort", () => {
  const adapterResult = adaptReleaseObservations({
    asOfDate: "2026-07-02",
    issuedAt: "2026-07-02T12:00:00.000Z",
    releases: [{ id: "release.ios.27", lifecycle: "superseded", statusEffectiveOn: "2026-07-01", statusFirstObservedAt: "2026-07-01T12:00:00.000Z" }],
    compatibilityMilestones: [],
    events: [{ id: "future", releaseId: "release.ios.27", occurredOn: "2026-07-03", firstObservedAt: "2026-07-03T12:00:00.000Z", channel: "developerBeta", sequence: 1, availability: "available" }],
  });
  const result = buildHistoricalAnalysisDataset({ adapterResult, releaseMetadata: [metadata()] });

  assert.equal(result.releaseCycles[0]?.included, false);
  assert.deepEqual(result.canonicalEvents, []);
  assert.ok(result.inclusionLedger.some(({ reason }) => reason === "future-occurrence"));
  assert.ok(result.inclusionLedger.some(({ reason }) => reason === "superseded-cycle"));
});

test("serialization and fingerprints are invariant to logical input array order", () => {
  const forward = input();
  const reversed: HistoricalAnalysisDatasetInputV1 = {
    adapterResult: {
      ...forward.adapterResult,
      effectiveEvents: [...forward.adapterResult.effectiveEvents].reverse(),
      releasedOutcomes: [...forward.adapterResult.releasedOutcomes].reverse(),
      inclusionLedger: [...forward.adapterResult.inclusionLedger].reverse(),
      exclusions: [...forward.adapterResult.exclusions].reverse(),
      dataset: {
        ...forward.adapterResult.dataset,
        releases: [...forward.adapterResult.dataset.releases].reverse(),
        events: [...forward.adapterResult.dataset.events].reverse(),
      },
    },
    releaseMetadata: [...forward.releaseMetadata].reverse(),
  };
  const first = buildHistoricalAnalysisDataset(forward);
  const second = buildHistoricalAnalysisDataset(reversed);
  assert.equal(stableSerializeHistoricalAnalysis(second), stableSerializeHistoricalAnalysis(first));
  assert.deepEqual(second.fingerprints, first.fingerprints);
});

test("stale and malformed contracts are rejected before a dataset is emitted", () => {
  const stale = input();
  stale.adapterResult = { ...stale.adapterResult, adapterVersion: "release-observation-adapter/v0" as typeof stale.adapterResult.adapterVersion };
  assert.throws(() => buildHistoricalAnalysisDataset(stale), HistoricalAnalysisInputError);

  const result = buildHistoricalAnalysisDataset(input());
  const malformed = { ...result, datasetVersion: "historical-analysis-dataset/v0" };
  assert.ok(validateHistoricalAnalysisDataset(malformed).some(({ code }) => code === "unsupported-dataset-version"));
  const untampered = { ...result, fingerprints: { ...result.fingerprints, datasetFingerprint: "not-a-hash" } };
  assert.ok(validateHistoricalAnalysisDataset(untampered).some(({ code }) => code === "invalid-fingerprint"));
});

test("fingerprint integrity binds analytical input and canonical event evidence", () => {
  const result = buildHistoricalAnalysisDataset(input());
  const fingerprintFor = (
    dataset: Omit<typeof result, "fingerprints">,
    inputFingerprint: string,
    codeFingerprint = result.fingerprints.codeFingerprint,
  ) => historicalAnalysisFingerprint({ core: dataset, inputFingerprint, codeFingerprint });

  const core = Object.fromEntries(
    Object.entries(result).filter(([key]) => key !== "fingerprints"),
  ) as unknown as Omit<typeof result, "fingerprints">;
  const zeroInputFingerprint = "0".repeat(64);
  const inputTampered = {
    ...result,
    fingerprints: {
      ...result.fingerprints,
      inputFingerprint: zeroInputFingerprint,
      datasetFingerprint: fingerprintFor(core, zeroInputFingerprint),
    },
  };
  assert.ok(validateHistoricalAnalysisDataset(inputTampered).some(({ code }) => code === "invalid-fingerprint"));

  const unrelatedEvidence = {
    ...result,
    canonicalEvents: result.canonicalEvents.map((event, index) =>
      index === 0 ? { ...event, sourceEvidenceIds: ["event:unrelated"] } : event,
    ),
  };
  const unrelatedCore = Object.fromEntries(
    Object.entries(unrelatedEvidence).filter(([key]) => key !== "fingerprints"),
  ) as unknown as Omit<typeof result, "fingerprints">;
  const evidenceTampered = {
    ...unrelatedEvidence,
    fingerprints: {
      ...result.fingerprints,
      datasetFingerprint: fingerprintFor(unrelatedCore, result.fingerprints.inputFingerprint),
    },
  };
  assert.ok(validateHistoricalAnalysisDataset(evidenceTampered).some(({ code }) => code === "invalid-row"));
});

test("a matching public event and lifecycle outcome remain one complete closure observation", () => {
  const source = input();
  source.adapterResult = adaptReleaseObservations({
    asOfDate: "2026-07-10",
    issuedAt: "2026-07-10T12:00:00.000Z",
    releases: [{ id: "release.ios.27", lifecycle: "released", publicReleaseDate: "2026-07-10", statusEffectiveOn: "2026-07-10", statusFirstObservedAt: "2026-07-10T12:00:00.000Z" }],
    compatibilityMilestones: [],
    events: [{ id: "public", releaseId: "release.ios.27", occurredOn: "2026-07-10", firstObservedAt: "2026-07-10T12:00:00.000Z", channel: "public", availability: "available" }],
  });
  const result = buildHistoricalAnalysisDataset(source);
  assert.equal(result.releaseCycles[0]?.chronologyCoverage.state, "complete");
  assert.deepEqual(result.stageIntervals[0]?.interval, {
    available: false,
    reason: "no-subsequent-stage-or-outcome",
  });
});

test("adversarial adapter results and serialized row tampering fail closed without validator throws", () => {
  const forgedEvent = input();
  forgedEvent.adapterResult = {
    ...forgedEvent.adapterResult,
    effectiveEvents: forgedEvent.adapterResult.effectiveEvents.map((event) => ({
      ...event,
      occurredOn: "2026-07-09",
    })),
  };
  assert.throws(() => buildHistoricalAnalysisDataset(forgedEvent), HistoricalAnalysisInputError);

  const duplicatedOutcome = input();
  duplicatedOutcome.adapterResult = {
    ...duplicatedOutcome.adapterResult,
    releasedOutcomes: [
      ...duplicatedOutcome.adapterResult.releasedOutcomes,
      duplicatedOutcome.adapterResult.releasedOutcomes[0]!,
    ],
  };
  assert.throws(() => buildHistoricalAnalysisDataset(duplicatedOutcome), HistoricalAnalysisInputError);

  const omittedOutcome = input();
  omittedOutcome.adapterResult = {
    ...omittedOutcome.adapterResult,
    releasedOutcomes: [],
  };
  assert.throws(() => buildHistoricalAnalysisDataset(omittedOutcome), HistoricalAnalysisInputError);

  const unknownOutcome = input();
  unknownOutcome.adapterResult = {
    ...unknownOutcome.adapterResult,
    releasedOutcomes: unknownOutcome.adapterResult.releasedOutcomes.map((outcome) => ({
      ...outcome,
      releaseId: "release.unknown",
    })),
  };
  assert.throws(() => buildHistoricalAnalysisDataset(unknownOutcome), HistoricalAnalysisInputError);

  const result = buildHistoricalAnalysisDataset(input());
  for (const malformed of [
    { ...result, releaseCycles: [null] },
    { ...result, canonicalEvents: [42] },
    { ...result, lifecycleOutcomes: ["bad"] },
    { ...result, stageIntervals: [null] },
    { ...result, inclusionLedger: [false] },
    { ...result, canonicalEvents: [{ ...result.canonicalEvents[0]!, eventId: 123 }] },
    { ...result, lifecycleOutcomes: [{ ...result.lifecycleOutcomes[0]!, outcomeEvidenceId: 123 }] },
  ]) {
    assert.doesNotThrow(() => validateHistoricalAnalysisDataset(malformed));
    assert.ok(validateHistoricalAnalysisDataset(malformed).length > 0);
  }

  const malformedMetadata = input({
    releaseMetadata: [
      {
        ...metadata(),
        releaseId: 123 as unknown as string,
      },
    ],
  });
  assert.doesNotThrow(() => validateHistoricalAnalysisInput(malformedMetadata));
  assert.throws(() => buildHistoricalAnalysisDataset(malformedMetadata), HistoricalAnalysisInputError);
});

test("interval validator rejects cross-release endpoints and missing endpoint evidence", () => {
  const result = buildHistoricalAnalysisDataset(input());
  const sourceEvent = result.canonicalEvents[0]!;
  const otherCycle = {
    ...result.releaseCycles[0]!,
    releaseId: "release.other",
    releaseCycleId: "ios-other",
    sourceEvidenceIds: ["metadata:other"],
  };
  const otherEvent = {
    ...sourceEvent,
    releaseId: "release.other",
    releaseCycleId: "ios-other",
    eventId: "event:other",
    sourceEvidenceIds: ["event:other"],
  };
  const firstInterval = result.stageIntervals[0]!;
  const crossRelease = {
    ...result,
    releaseCycles: [...result.releaseCycles, otherCycle],
    canonicalEvents: [...result.canonicalEvents, otherEvent],
    stageIntervals: [
      {
        ...firstInterval,
        end: {
          kind: "event" as const,
          eventId: "event:other",
          stage: otherEvent.stage,
          occurredOn: otherEvent.occurredOn,
          sourceEvidenceIds: otherEvent.sourceEvidenceIds,
        },
        sourceEvidenceIds: [...firstInterval.sourceEvidenceIds, ...otherEvent.sourceEvidenceIds],
      },
      ...result.stageIntervals.slice(1),
    ],
  };
  assert.ok(validateHistoricalAnalysisDataset(crossRelease).some(({ code }) => code === "invalid-row"));

  const missingEndEvidence = {
    ...result,
    stageIntervals: result.stageIntervals.map((row, index) =>
      index === 0 ? { ...row, sourceEvidenceIds: row.sourceEvidenceIds.slice(0, 1) } : row,
    ),
  };
  assert.ok(validateHistoricalAnalysisDataset(missingEndEvidence).some(({ code }) => code === "invalid-row"));
});
