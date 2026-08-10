import assert from "node:assert/strict";
import test from "node:test";

import {
  FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
  FORECAST_RUNTIME_COHORT_CONFIG,
  FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
  ForecastRuntimeCohortError,
  buildForecastRuntimeCohortSelection,
  buildHistoricalAnalysisDatasetFromPublishedSource,
  projectPublishedHistoricalReleaseSourceForRuntimeCohort,
  validateForecastRuntimeCohortSelection,
  type ForecastRuntimeCohortSelectionV1,
} from "../src/lib/forecast-runtime-cohort";
import {
  historicalAnalysisFingerprint,
  validateHistoricalAnalysisDataset,
} from "../src/lib/historical-analysis-dataset";
import type { PublishedHistoricalReleaseSource } from "../src/lib/historical-release-source";

const AS_OF_DATE = "2026-08-09";
const ISSUED_AT = "2026-08-09T12:43:00.000Z";

function day(index: number): string {
  return new Date(Date.UTC(2020, 0, 1 + index)).toISOString().slice(0, 10);
}

interface SourceOptions {
  platforms?: readonly string[];
  activePerPlatform?: number;
  completedPerPlatform?: number;
  reverse?: boolean;
  tiedOutcomes?: boolean;
  inactivePlatform?: boolean;
  noiseByRelease?: Readonly<Record<string, number>>;
}

function buildSource(options: SourceOptions = {}): PublishedHistoricalReleaseSource {
  const platforms = options.platforms ?? ["ios", "macos"];
  const activePerPlatform = options.activePerPlatform ?? 1;
  const completedPerPlatform = options.completedPerPlatform ?? 12;
  const releases: PublishedHistoricalReleaseSource["releases"][number][] = [];
  const events: PublishedHistoricalReleaseSource["events"][number][] = [];
  const releaseMetadata: PublishedHistoricalReleaseSource["releaseMetadata"][number][] = [];
  let globalIndex = 0;

  const addMetadata = (releaseId: string, platformId: string, position: number) => {
    releaseMetadata.push({
      releaseId,
      platformId,
      productFamilyId: `${platformId}-family`,
      releaseClass: "major",
      releasePosition: position + 1,
      releaseCycleId: `${releaseId}-cycle`,
      chronologyCoverage: {
        state: "complete",
        sourceEvidenceIds: [`coverage:${releaseId}`],
      },
      sourceEvidenceIds: [`metadata:${releaseId}`],
    });
  };

  const addNoise = (releaseId: string, occurredOn: string) => {
    const count = options.noiseByRelease?.[releaseId] ?? 0;
    for (let index = 0; index < count; index += 1) {
      events.push({
        id: `${releaseId}-withdrawn-${String(index).padStart(4, "0")}`,
        releaseId,
        occurredOn,
        firstObservedAt: `${occurredOn}T11:00:00.000Z`,
        channel: "developerBeta",
        sequence: index + 100,
        availability: "withdrawn",
      });
    }
  };

  for (const platformId of platforms) {
    for (let index = 0; index < completedPerPlatform; index += 1) {
      const releaseId = `${platformId}-history-${String(index).padStart(2, "0")}`;
      const anchorDay = options.tiedOutcomes ? day(100) : day(globalIndex * 12);
      const outcomeDay = options.tiedOutcomes ? day(105) : day(globalIndex * 12 + 5);
      releases.push({
        id: releaseId,
        lifecycle: "released",
        publicReleaseDate: outcomeDay,
        statusEffectiveOn: outcomeDay,
        statusFirstObservedAt: `${outcomeDay}T12:00:00.000Z`,
      });
      events.push({
        id: `${releaseId}-developer-1`,
        releaseId,
        occurredOn: anchorDay,
        firstObservedAt: `${anchorDay}T10:00:00.000Z`,
        channel: "developerBeta",
        sequence: 1,
        availability: "available",
      });
      addNoise(releaseId, anchorDay);
      addMetadata(releaseId, platformId, index);
      globalIndex += 1;
    }
    for (let index = 0; index < activePerPlatform; index += 1) {
      const releaseId = `${platformId}-active-${index}`;
      const activeDay = day(2_000 + globalIndex);
      releases.push({ id: releaseId, lifecycle: "active" });
      events.push({
        id: `${releaseId}-developer-1`,
        releaseId,
        occurredOn: activeDay,
        firstObservedAt: `${activeDay}T10:00:00.000Z`,
        channel: "developerBeta",
        sequence: 1,
        availability: "available",
      });
      addNoise(releaseId, activeDay);
      addMetadata(releaseId, platformId, completedPerPlatform + index);
      globalIndex += 1;
    }
  }

  if (options.inactivePlatform) {
    const releaseId = "tvos-history-inactive";
    const anchorDay = day(10);
    const outcomeDay = day(15);
    releases.push({
      id: releaseId,
      lifecycle: "released",
      publicReleaseDate: outcomeDay,
      statusEffectiveOn: outcomeDay,
      statusFirstObservedAt: `${outcomeDay}T12:00:00.000Z`,
    });
    events.push({
      id: `${releaseId}-developer-1`,
      releaseId,
      occurredOn: anchorDay,
      firstObservedAt: `${anchorDay}T10:00:00.000Z`,
      channel: "developerBeta",
      sequence: 1,
      availability: "available",
    });
    addMetadata(releaseId, "tvos", 1);
  }

  const source = {
    releases,
    events,
    compatibilityMilestones: [],
    releaseMetadata,
  } satisfies PublishedHistoricalReleaseSource;
  if (!options.reverse) return source;
  return {
    releases: [...source.releases].reverse(),
    events: [...source.events].reverse(),
    compatibilityMilestones: [...source.compatibilityMilestones].reverse(),
    releaseMetadata: [...source.releaseMetadata].reverse(),
  };
}

function dataset(source: PublishedHistoricalReleaseSource) {
  return buildHistoricalAnalysisDatasetFromPublishedSource(source, {
    asOfDate: AS_OF_DATE,
    issuedAt: ISSUED_AT,
  });
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function resignSelection(
  selection: ForecastRuntimeCohortSelectionV1,
): ForecastRuntimeCohortSelectionV1 {
  const core: Record<string, unknown> = { ...selection };
  delete core.fingerprints;
  selection.fingerprints = {
    codeFingerprint: FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
    configFingerprint: FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
    resultFingerprint: historicalAnalysisFingerprint({
      core,
      codeFingerprint: FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
      configFingerprint: FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
    }),
  };
  return selection;
}

test("selects all active cycles plus deterministic 8+4 source-ranked training history", () => {
  const forwardSource = buildSource({ inactivePlatform: true });
  const reverseSource = buildSource({ inactivePlatform: true, reverse: true });
  const forward = buildForecastRuntimeCohortSelection(
    dataset(forwardSource),
    forwardSource,
  );
  const reverse = buildForecastRuntimeCohortSelection(
    dataset(reverseSource),
    reverseSource,
  );

  assert.deepEqual(reverse, forward);
  assert.deepEqual(validateForecastRuntimeCohortSelection(forward), []);
  assert.deepEqual(forward.activePlatformIds, ["ios", "macos"]);
  assert.deepEqual(
    forward.perPlatformCounts.map((count) => ({
      platformId: count.platformId,
      active: count.activeReleaseCount,
      mandatory: count.mandatoryCompletedCount,
      additional: count.additionalCompletedCount,
    })),
    [
      { platformId: "ios", active: 1, mandatory: 8, additional: 4 },
      { platformId: "macos", active: 1, mandatory: 8, additional: 4 },
    ],
  );
  const iosTraining = forward.selectedCycles
    .filter((cycle) => cycle.platformId === "ios" && cycle.role !== "active")
    .sort(
      (left, right) =>
        (left.rankWithinPlatformHistory ?? 0) -
        (right.rankWithinPlatformHistory ?? 0),
    );
  assert.deepEqual(
    iosTraining.map((cycle) => cycle.releaseId),
    Array.from({ length: 12 }, (_, index) =>
      `ios-history-${String(11 - index).padStart(2, "0")}`,
    ),
  );
  assert.deepEqual(
    forward.exclusions.find(({ releaseId }) => releaseId === "tvos-history-inactive"),
    {
      releaseId: "tvos-history-inactive",
      platformId: "tvos",
      reason: "inactive-platform",
    },
  );
});

test("public outcome ties use stable release IDs and never input array order", () => {
  const firstSource = buildSource({
    platforms: ["ios"],
    completedPerPlatform: 12,
    tiedOutcomes: true,
  });
  const reversedSource = buildSource({
    platforms: ["ios"],
    completedPerPlatform: 12,
    tiedOutcomes: true,
    reverse: true,
  });
  const first = buildForecastRuntimeCohortSelection(
    dataset(firstSource),
    firstSource,
  );
  const reversed = buildForecastRuntimeCohortSelection(
    dataset(reversedSource),
    reversedSource,
  );

  assert.deepEqual(reversed, first);
  assert.deepEqual(
    first.selectedCycles
      .filter((cycle) => cycle.role !== "active")
      .sort(
        (left, right) =>
          (left.rankWithinPlatformHistory ?? 0) -
          (right.rankWithinPlatformHistory ?? 0),
      )
      .map((cycle) => cycle.releaseId),
    Array.from({ length: 12 }, (_, index) =>
      `ios-history-${String(index).padStart(2, "0")}`,
    ),
  );
});

test("whole-cycle round robin respects 768 and records every capacity exclusion", () => {
  const source = buildSource({
    noiseByRelease: { "ios-active-0": 730 },
  });
  const selection = buildForecastRuntimeCohortSelection(dataset(source), source);

  assert.equal(
    selection.selectedObservationCount,
    FORECAST_RUNTIME_COHORT_CONFIG.maxSelectedObservations,
  );
  assert.deepEqual(
    selection.perPlatformCounts.map((count) => count.additionalCompletedCount),
    [1, 1],
  );
  assert.equal(
    selection.exclusions.filter(
      (exclusion) => exclusion.reason === "selected-observation-cap",
    ).length,
    6,
  );
  const projected = projectPublishedHistoricalReleaseSourceForRuntimeCohort(
    source,
    selection,
  );
  const selectedIds = new Set(selection.selectedReleaseIds);
  assert.equal(
    projected.events.length,
    source.events.filter((event) => selectedIds.has(event.releaseId)).length,
  );
  assert.equal(
    projected.compatibilityMilestones.length,
    source.compatibilityMilestones.filter((event) =>
      selectedIds.has(event.releaseId),
    ).length,
  );
});

test("projection rebuilds a valid selected dataset and preserves active exclusions", () => {
  const baseSource = buildSource({
    platforms: ["ios"],
    noiseByRelease: { "ios-active-0": 2 },
  });
  const compatibilityDay = day(2_013);
  const source: PublishedHistoricalReleaseSource = {
    ...baseSource,
    compatibilityMilestones: [
      {
        id: "active-public-beta-1",
        releaseId: "ios-active-0",
        occurredOn: compatibilityDay,
        firstObservedAt: `${compatibilityDay}T10:00:00.000Z`,
        channel: "publicBeta",
        sequence: 1,
        availability: "available",
      },
    ],
    releaseMetadata: baseSource.releaseMetadata.map((metadata) =>
      metadata.releaseId === "ios-active-0"
        ? {
            ...metadata,
            chronologyCoverage: {
              state: "unknown" as const,
              reason: "source-coverage-incomplete" as const,
              sourceEvidenceIds: ["coverage:ios-active-0:incomplete"],
            },
          }
        : metadata,
    ),
  };
  const original = dataset(source);
  const selection = buildForecastRuntimeCohortSelection(original, source);
  const projectedSource = projectPublishedHistoricalReleaseSourceForRuntimeCohort(
    source,
    selection,
  );
  const projectedDataset = dataset(projectedSource);
  const selectedIds = new Set(selection.selectedReleaseIds);

  assert.deepEqual(validateHistoricalAnalysisDataset(projectedDataset), []);
  assert.deepEqual(
    projectedDataset.releaseCycles.map((cycle) => cycle.releaseId),
    selection.selectedReleaseIds,
  );
  assert.deepEqual(
    projectedDataset.inclusionLedger,
    original.inclusionLedger.filter((entry) => selectedIds.has(entry.releaseId)),
  );
  assert.ok(
    projectedDataset.inclusionLedger.some(
      (entry) =>
        entry.releaseId === "ios-active-0" && entry.reason === "withdrawn",
    ),
  );
  assert.ok(
    projectedDataset.releaseCycles.some(
      (cycle) =>
        cycle.releaseId === "ios-active-0" &&
        cycle.lifecycle === "active" &&
        cycle.chronologyCoverage.state === "unknown",
    ),
  );
  assert.deepEqual(
    projectedSource.compatibilityMilestones.map((milestone) => milestone.id),
    ["active-public-beta-1"],
  );
  assert.ok(
    projectedDataset.canonicalEvents.some(
      (event) => event.eventId === "legacy:ios-active-0:active-public-beta-1",
    ),
  );
});

test("active release, active platform, and mandatory cohort bounds fail closed", () => {
  const tooManyActive = buildSource({
    platforms: ["ios"],
    activePerPlatform: 13,
    completedPerPlatform: 8,
  });
  assert.throws(
    () => buildForecastRuntimeCohortSelection(dataset(tooManyActive), tooManyActive),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "active-release-limit",
  );

  const tooManyPlatforms = buildSource({
    platforms: ["ios", "ipados", "macos", "tvos", "watchos", "visionos", "xros"],
    activePerPlatform: 1,
    completedPerPlatform: 8,
  });
  assert.throws(
    () =>
      buildForecastRuntimeCohortSelection(
        dataset(tooManyPlatforms),
        tooManyPlatforms,
      ),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "active-platform-limit",
  );

  const underflow = buildSource({
    platforms: ["ios"],
    completedPerPlatform: 7,
  });
  assert.throws(
    () => buildForecastRuntimeCohortSelection(dataset(underflow), underflow),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "mandatory-history-underflow",
  );
});

test("active plus mandatory observations over 768 fail instead of truncating", () => {
  const source = buildSource({
    platforms: ["ios"],
    completedPerPlatform: 8,
    noiseByRelease: { "ios-history-07": 760 },
  });
  assert.throws(
    () => buildForecastRuntimeCohortSelection(dataset(source), source),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "selected-observation-limit",
  );
});

test("missing joins and non-exact sources fail before selection or projection", () => {
  const exactSource = buildSource({ platforms: ["ios"] });
  const exactDataset = dataset(exactSource);
  const missingEventJoin = clone(exactSource);
  missingEventJoin.events = [
    ...missingEventJoin.events,
    {
      id: "orphan-event",
      releaseId: "missing-release",
      occurredOn: day(1),
      firstObservedAt: `${day(1)}T10:00:00.000Z`,
      channel: "developerBeta",
      sequence: 1,
      availability: "available",
    },
  ];
  assert.throws(
    () => buildForecastRuntimeCohortSelection(exactDataset, missingEventJoin),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "invalid-source-join",
  );

  const missingMetadataJoin = clone(exactSource);
  missingMetadataJoin.releaseMetadata = missingMetadataJoin.releaseMetadata.slice(1);
  assert.throws(
    () => buildForecastRuntimeCohortSelection(exactDataset, missingMetadataJoin),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "invalid-source-join",
  );

  const driftedSource = clone(exactSource);
  driftedSource.events = driftedSource.events.map((event, index) =>
    index === 0 ? { ...event, id: `${event.id}-drift` } : event,
  );
  assert.throws(
    () => buildForecastRuntimeCohortSelection(exactDataset, driftedSource),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "source-dataset-mismatch",
  );

  const selection = buildForecastRuntimeCohortSelection(exactDataset, exactSource);
  assert.throws(
    () =>
      projectPublishedHistoricalReleaseSourceForRuntimeCohort(
        driftedSource,
        selection,
      ),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "source-dataset-mismatch",
  );
});

test("projection rejects a structurally valid, re-signed active/inactive forgery", () => {
  const source = buildSource({
    platforms: ["ios"],
    completedPerPlatform: 13,
  });
  const fullDataset = dataset(source);
  const authoritative = buildForecastRuntimeCohortSelection(fullDataset, source);
  const forged = clone(authoritative);
  const active = forged.selectedCycles.find(
    (cycle) => cycle.releaseId === "ios-active-0",
  );
  assert.ok(active);
  const inactiveReleaseId = "ios-history-00";
  assert.ok(
    forged.exclusions.some(
      (exclusion) => exclusion.releaseId === inactiveReleaseId,
    ),
  );

  active.releaseId = inactiveReleaseId;
  active.observationCount = 2;
  forged.selectedCycles = [...forged.selectedCycles].sort((left, right) =>
    left.releaseId.localeCompare(right.releaseId),
  );
  forged.selectedReleaseIds = forged.selectedCycles.map(
    (cycle) => cycle.releaseId,
  );
  forged.exclusions = [
    ...forged.exclusions.filter(
      (exclusion) => exclusion.releaseId !== inactiveReleaseId,
    ),
    {
      releaseId: "ios-active-0",
      platformId: "ios",
      reason: "lifecycle-not-completed" as const,
    },
  ].sort((left, right) => left.releaseId.localeCompare(right.releaseId));
  forged.selectedObservationCount += 1;
  forged.perPlatformCounts[0].selectedObservationCount += 1;
  resignSelection(forged);

  assert.deepEqual(validateForecastRuntimeCohortSelection(forged), []);
  assert.throws(
    () =>
      projectPublishedHistoricalReleaseSourceForRuntimeCohort(source, forged),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "source-dataset-mismatch",
  );
});

test("projection rejects cross-boundary duplicate identity recanonicalization", () => {
  const baseSource = buildSource({
    platforms: ["ios"],
    inactivePlatform: true,
  });
  const sharedStableEventId = "cross-boundary-shared-event";
  const source: PublishedHistoricalReleaseSource = {
    ...baseSource,
    events: baseSource.events.map((event) =>
      event.id === "ios-active-0-developer-1" ||
      event.id === "tvos-history-inactive-developer-1"
        ? { ...event, stableEventId: sharedStableEventId }
        : event,
    ),
  };
  const fullDataset = dataset(source);
  const selection = buildForecastRuntimeCohortSelection(fullDataset, source);
  const selectedIds = new Set(selection.selectedReleaseIds);

  assert.ok(selectedIds.has("ios-active-0"));
  assert.ok(!selectedIds.has("tvos-history-inactive"));
  assert.ok(
    !fullDataset.canonicalEvents.some(
      (event) => event.eventId === `event:${sharedStableEventId}`,
    ),
  );

  const unsafeProjection: PublishedHistoricalReleaseSource = {
    releases: source.releases.filter((release) => selectedIds.has(release.id)),
    events: source.events.filter((event) => selectedIds.has(event.releaseId)),
    compatibilityMilestones: source.compatibilityMilestones.filter((milestone) =>
      selectedIds.has(milestone.releaseId),
    ),
    releaseMetadata: source.releaseMetadata.filter((metadata) =>
      selectedIds.has(metadata.releaseId),
    ),
  };
  const unsafeDataset = dataset(unsafeProjection);
  assert.ok(
    unsafeDataset.canonicalEvents.some(
      (event) => event.eventId === `event:${sharedStableEventId}`,
    ),
  );
  assert.throws(
    () =>
      projectPublishedHistoricalReleaseSourceForRuntimeCohort(source, selection),
    (error: unknown) =>
      error instanceof ForecastRuntimeCohortError &&
      error.code === "source-dataset-mismatch",
  );
});

test("strict validator detects top-level, nested, count, rank, and fingerprint tampering", () => {
  const source = buildSource({ platforms: ["ios"] });
  const selection = buildForecastRuntimeCohortSelection(dataset(source), source);

  const extra = { ...clone(selection), unexpected: true };
  assert.ok(
    validateForecastRuntimeCohortSelection(extra).some(
      (issue) => issue.code === "unexpected-property" && issue.path === "selection",
    ),
  );

  const nested = clone(selection) as typeof selection & {
    selectedCycles: Array<(typeof selection.selectedCycles)[number] & { extra?: true }>;
  };
  nested.selectedCycles[0].extra = true;
  assert.ok(
    validateForecastRuntimeCohortSelection(nested).some(
      (issue) => issue.code === "unexpected-property",
    ),
  );

  const count = clone(selection);
  count.selectedObservationCount += 1;
  assert.ok(
    validateForecastRuntimeCohortSelection(count).some(
      (issue) => issue.code === "invalid-count",
    ),
  );

  const rank = clone(selection);
  const mandatory = rank.selectedCycles.find(
    (cycle) => cycle.role === "mandatory-training" && cycle.rankWithinPlatformHistory === 8,
  );
  assert.ok(mandatory);
  mandatory.rankWithinPlatformHistory = 9;
  mandatory.role = "additional-training";
  assert.ok(
    validateForecastRuntimeCohortSelection(rank).some(
      (issue) => issue.code === "invalid-count",
    ),
  );

  const fingerprint = clone(selection);
  fingerprint.fingerprints.resultFingerprint = "0".repeat(64);
  assert.ok(
    validateForecastRuntimeCohortSelection(fingerprint).some(
      (issue) => issue.code === "invalid-fingerprint",
    ),
  );

  const roguePlatform = clone(selection);
  const rogueTraining = roguePlatform.selectedCycles.find(
    (cycle) => cycle.role === "mandatory-training",
  );
  assert.ok(rogueTraining);
  rogueTraining.platformId = "not-active";
  assert.ok(
    validateForecastRuntimeCohortSelection(roguePlatform).some(
      (issue) =>
        issue.code === "invalid-selected-cycle" &&
        issue.message.includes("active platform"),
    ),
  );

  const malformed = { ...clone(selection), exclusions: [null] };
  assert.doesNotThrow(() => validateForecastRuntimeCohortSelection(malformed));
  assert.ok(
    validateForecastRuntimeCohortSelection(malformed).some(
      (issue) =>
        issue.path.startsWith("exclusions") &&
        ["invalid-input", "invalid-order"].includes(issue.code),
    ),
  );
});
