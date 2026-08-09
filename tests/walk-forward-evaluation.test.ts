import assert from "node:assert/strict";
import test from "node:test";

import { buildHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";
import {
  DEFAULT_WALK_FORWARD_EVALUATION_CONFIG,
  buildWalkForwardEvaluation,
  validateWalkForwardEvaluation,
} from "../src/lib/walk-forward-evaluation";

function day(index: number): string {
  const value = new Date(Date.UTC(2024, 0, 1 + index * 20));
  return value.toISOString().slice(0, 10);
}

function dataset(reverse = false) {
  const count = 20;
  const releases = Array.from({ length: count }, (_, index) => ({ id: `ios-${index + 1}`, lifecycle: "active" as const }));
  const events = Array.from({ length: count }, (_, index) => [
    { id: `anchor-${index + 1}`, releaseId: `ios-${index + 1}`, occurredOn: day(index * 2), firstObservedAt: `${day(index * 2)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
    { id: `end-${index + 1}`, releaseId: `ios-${index + 1}`, occurredOn: day(index * 2 + 1), firstObservedAt: `${day(index * 2 + 1)}T12:00:00.000Z`, channel: "publicBeta" as const, sequence: 1, availability: "available" as const },
  ]).flat();
  const releaseMetadata = Array.from({ length: count }, (_, index) => ({
    releaseId: `ios-${index + 1}`,
    platformId: "ios",
    productFamilyId: "iphone-os",
    releaseClass: "major" as const,
    releasePosition: index + 1,
    releaseCycleId: `ios-cycle-${index + 1}`,
    chronologyCoverage: { state: "complete" as const, sourceEvidenceIds: [`coverage-${index + 1}`] },
    sourceEvidenceIds: [`metadata-${index + 1}`],
  }));
  const adapterResult = adaptReleaseObservations({
    asOfDate: "2026-08-01",
    issuedAt: "2026-08-01T12:00:00.000Z",
    releases: reverse ? releases.reverse() : releases,
    compatibilityMilestones: [],
    events: reverse ? events.reverse() : events,
  });
  return buildHistoricalAnalysisDataset({
    adapterResult,
    releaseMetadata: reverse ? releaseMetadata.reverse() : releaseMetadata,
  });
}

interface SourceCycleFixture {
  id: string;
  anchorOn: string;
  anchorObservedOn?: string;
  endpointOn?: string;
  endpointObservedOn?: string;
  platformId?: string;
  productFamilyId?: string;
  anchorSequence?: number;
  lifecycle?: "active" | "superseded";
  chronologyUnknown?: boolean;
  revision?: boolean;
}

function sourceBackedDataset(
  cycles: readonly SourceCycleFixture[],
  asOfDate = "2026-08-01",
) {
  const releases = cycles.map((cycle) => cycle.lifecycle === "superseded"
    ? { id: cycle.id, lifecycle: "superseded" as const, statusEffectiveOn: cycle.anchorOn, statusFirstObservedAt: `${cycle.anchorOn}T12:00:00.000Z` }
    : { id: cycle.id, lifecycle: "active" as const });
  const events = cycles.flatMap((cycle) => {
    const anchorObservedOn = cycle.anchorObservedOn ?? cycle.anchorOn;
    const anchor = {
      id: `${cycle.id}-anchor`, releaseId: cycle.id, occurredOn: cycle.anchorOn,
      firstObservedAt: `${anchorObservedOn}T12:00:00.000Z`, channel: "developerBeta" as const,
      sequence: cycle.anchorSequence ?? 1, availability: "available" as const,
    };
    const revision = cycle.revision ? [{
      ...anchor, id: `${cycle.id}-anchor-original`,
    }, {
      ...anchor, id: `${cycle.id}-anchor`, occurredOn: cycle.anchorOn,
      isRevision: true, revisionOfId: `${cycle.id}-anchor-original`,
    }] : [anchor];
    if (!cycle.endpointOn) return revision;
    return [...revision, {
      id: `${cycle.id}-endpoint`, releaseId: cycle.id, occurredOn: cycle.endpointOn,
      firstObservedAt: `${cycle.endpointObservedOn ?? cycle.endpointOn}T12:00:00.000Z`,
      channel: "publicBeta" as const, sequence: 1, availability: "available" as const,
    }];
  });
  return buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations({
      asOfDate, issuedAt: `${asOfDate}T12:00:00.000Z`, releases, events,
      compatibilityMilestones: [],
    }),
    releaseMetadata: cycles.map((cycle, index) => ({
      releaseId: cycle.id, platformId: cycle.platformId ?? "ios",
      productFamilyId: cycle.productFamilyId ?? "iphone-os", releaseClass: "major" as const,
      releasePosition: index + 1, releaseCycleId: `${cycle.id}-cycle`,
      chronologyCoverage: cycle.chronologyUnknown
        ? { state: "unknown" as const, reason: "source-coverage-incomplete" as const, sourceEvidenceIds: [`coverage-${cycle.id}`] }
        : { state: "complete" as const, sourceEvidenceIds: [`coverage-${cycle.id}`] },
      sourceEvidenceIds: [`metadata-${cycle.id}`],
    })),
  });
}

function prediction(result: ReturnType<typeof buildWalkForwardEvaluation>, targetId: string, baseline: "platform-stage-median" | "seasonal-median") {
  return result.predictions.find((row) => row.heldoutTargetId === targetId && row.baseline === baseline)!;
}

test("walk-forward v1 is source-ordered, known-at-origin, platform-only, and order invariant", () => {
  const source = dataset();
  const result = buildWalkForwardEvaluation(source);
  assert.deepEqual(validateWalkForwardEvaluation(result), []);
  assert.equal(result.targets.length, 20);
  const last = [...result.folds].sort((left, right) => left.originOn.localeCompare(right.originOn)).at(-1)!;
  assert.equal(last.originOn, [...result.targets].sort((left, right) => left.originOn.localeCompare(right.originOn)).at(-1)!.originOn);
  assert.equal(last.trainingTargetIds.length, 19);
  assert.ok(result.predictions.filter((prediction) => prediction.foldId === last.foldId).every((prediction) => prediction.available));
  assert.ok(result.folds.every((fold) => !fold.trainingTargetIds.includes(fold.heldoutTargetId)));
  assert.ok(result.folds.every((fold) => fold.trainingTargetIds.every((id) => result.targets.find((target) => target.targetId === id)!.endpoint.firstObservedOn <= fold.originOn)));
  assert.ok(result.predictions.every((prediction) => prediction.available === false || prediction.trainingTargetIds.every((id) => result.targets.find((target) => target.targetId === id)!.platformId === "ios")));
  assert.deepEqual(buildWalkForwardEvaluation(dataset(true)), result);
});

test("seasonal selection falls back deterministically and metrics support inclusive coverage", () => {
  const source = dataset();
  const result = buildWalkForwardEvaluation(source, { ...DEFAULT_WALK_FORWARD_EVALUATION_CONFIG, includeEmpiricalIntervals: true });
  const latest = [...result.folds].sort((left, right) => left.originOn.localeCompare(right.originOn)).at(-1)!;
  const last = result.predictions.filter((prediction) => prediction.foldId === latest.foldId && prediction.baseline === "seasonal-median")[0]!;
  assert.equal(last.available, true);
  if (last.available) assert.equal(last.cohort, "stage");
  assert.ok(result.scores.some((score) => score.covered50 !== null && score.covered80 !== null));
  assert.ok(result.aggregateMetrics.some((metric) => metric.group === "overall" && metric.reportable && metric.inclusiveCoverage50 !== null));
});

test("seasonal cohorts use anchor occurrence month despite delayed observations", () => {
  const training = Array.from({ length: 8 }, (_, index) => ({
    id: `march-${index + 1}`, anchorOn: `2025-03-${String(index + 1).padStart(2, "0")}`,
    anchorObservedOn: `2025-04-${String(index + 1).padStart(2, "0")}`,
    endpointOn: `2025-03-${String(index + 11).padStart(2, "0")}`,
    endpointObservedOn: `2025-04-${String(index + 11).padStart(2, "0")}`,
  }));
  const heldout = { id: "march-heldout", anchorOn: "2025-03-25", anchorObservedOn: "2025-05-20", endpointOn: "2025-04-04", endpointObservedOn: "2025-05-25" };
  const result = buildWalkForwardEvaluation(sourceBackedDataset([...training, heldout]));
  const target = result.targets.find((row) => row.releaseId === heldout.id)!;
  const seasonal = prediction(result, target.targetId, "seasonal-median");
  assert.equal(target.anchorOccurredOn, "2025-03-25");
  assert.equal(seasonal.available, true);
  if (seasonal.available) {
    assert.equal(seasonal.cohort, "exact-seasonal");
    assert.equal(seasonal.trainingTargetIds.length, 8);
  }
});

test("held-out date changes do not alter its fold training cohort or prediction", () => {
  const training = Array.from({ length: 8 }, (_, index) => ({
    id: `train-${index + 1}`, anchorOn: `2025-01-${String(index + 1).padStart(2, "0")}`,
    endpointOn: `2025-01-${String(index + 11).padStart(2, "0")}`,
  }));
  const common = { id: "heldout", anchorOn: "2025-03-01", anchorObservedOn: "2025-05-01", endpointObservedOn: "2025-05-10" };
  const first = buildWalkForwardEvaluation(sourceBackedDataset([...training, { ...common, endpointOn: "2025-03-11" }]));
  const second = buildWalkForwardEvaluation(sourceBackedDataset([...training, { ...common, endpointOn: "2025-03-12" }]));
  const firstTarget = first.targets.find((row) => row.releaseId === common.id)!;
  const secondTarget = second.targets.find((row) => row.releaseId === common.id)!;
  assert.notEqual(firstTarget.actualDays, secondTarget.actualDays);
  assert.deepEqual(first.folds.find((row) => row.heldoutTargetId === firstTarget.targetId), second.folds.find((row) => row.heldoutTargetId === secondTarget.targetId));
  for (const baseline of ["platform-stage-median", "seasonal-median"] as const) {
    assert.deepEqual(prediction(first, firstTarget.targetId, baseline), prediction(second, secondTarget.targetId, baseline));
  }
});

test("platform-stage falls back only within its platform and foreign histories cannot create a forecast", () => {
  const iosHistory = Array.from({ length: 8 }, (_, index) => ({
    id: `ios-history-${index + 1}`, anchorOn: `2025-01-${String(index + 1).padStart(2, "0")}`,
    endpointOn: `2025-01-${String(index + 11).padStart(2, "0")}`,
  }));
  const macHistory = Array.from({ length: 12 }, (_, index) => ({
    id: `mac-history-${index + 1}`, platformId: "macos", productFamilyId: "mac", anchorOn: `2025-02-${String(index + 1).padStart(2, "0")}`,
    endpointOn: `2025-02-${String(index + 11).padStart(2, "0")}`, anchorSequence: 2,
  }));
  const source = sourceBackedDataset([
    ...iosHistory, ...macHistory,
    { id: "ios-heldout", anchorOn: "2025-04-01", endpointOn: "2025-04-11", anchorSequence: 2 },
    { id: "tvos-heldout", platformId: "tvos", productFamilyId: "tv", anchorOn: "2025-05-01", endpointOn: "2025-05-11", anchorSequence: 2 },
  ]);
  const result = buildWalkForwardEvaluation(source);
  const iosTarget = result.targets.find((row) => row.releaseId === "ios-heldout")!;
  const iosPrediction = prediction(result, iosTarget.targetId, "platform-stage-median");
  assert.equal(iosPrediction.available, true);
  if (iosPrediction.available) {
    assert.equal(iosPrediction.cohort, "platform-pooled");
    assert.ok(iosPrediction.trainingTargetIds.every((id) => result.targets.find((target) => target.targetId === id)!.platformId === "ios"));
  }
  const tvosTarget = result.targets.find((row) => row.releaseId === "tvos-heldout")!;
  const tvosPrediction = prediction(result, tvosTarget.targetId, "platform-stage-median");
  assert.deepEqual(tvosPrediction, {
    foldId: `fold:${tvosTarget.targetId}`, heldoutTargetId: tvosTarget.targetId,
    baseline: "platform-stage-median", trainingTargetIds: [], available: false,
    reason: "minimum-training-outcomes", cohort: "no-forecast",
  });
  assert.ok(result.folds.every((fold) => !fold.trainingTargetIds.includes(fold.heldoutTargetId)));
});

test("adapter-built future, late, same-day, unknown, superseded, and revision evidence fail closed", () => {
  const source = sourceBackedDataset([
    { id: "future", anchorOn: "2026-07-01", endpointOn: "2026-08-02" },
    { id: "late", anchorOn: "2026-07-01", endpointOn: "2026-07-03", endpointObservedOn: "2026-08-02" },
    { id: "same-day", anchorOn: "2026-07-04", endpointOn: "2026-07-04" },
    { id: "unknown", anchorOn: "2026-07-05", endpointOn: "2026-07-06", chronologyUnknown: true },
    { id: "superseded", anchorOn: "2026-07-07", endpointOn: "2026-07-08", lifecycle: "superseded" },
    { id: "revision", anchorOn: "2026-07-09", endpointOn: "2026-07-11", revision: true },
  ]);
  const result = buildWalkForwardEvaluation(source);
  for (const id of ["future", "late", "same-day", "unknown", "superseded"]) assert.equal(result.targets.some((target) => target.releaseId === id), false);
  assert.ok(result.exclusionLedger.filter((row) => ["future", "late", "same-day", "unknown"].some((id) => row.startEventId.includes(id))).every((row) => row.reason === "invalid-or-unavailable-interval"));
  assert.equal(source.releaseCycles.find((row) => row.releaseId === "superseded")?.included, false);
  assert.ok(source.canonicalEvents.some((event) => event.eventId.includes("revision-anchor")));
  assert.equal(source.canonicalEvents.some((event) => event.eventId.includes("revision-anchor-original")), false);
  const revisionTarget = result.targets.find((target) => target.releaseId === "revision")!;
  assert.ok(revisionTarget.anchorEventId.includes("revision-anchor"));
  assert.equal(revisionTarget.anchorEventId.includes("original"), false);
});

test("strict validation catches forged rows, scores, metrics, fingerprints, evidence, and primitive input without throwing", () => {
  const result = buildWalkForwardEvaluation(dataset());
  const forgedScore = { ...result, scores: result.scores.map((score, index) => index ? score : { ...score, absoluteErrorDays: 999 }) };
  const forgedMetric = { ...result, aggregateMetrics: result.aggregateMetrics.map((metric, index) => index ? metric : { ...metric, maeDays: 999 }) };
  const forgedEvidence = { ...result, targets: result.targets.map((target, index) => index ? target : { ...target, sourceEvidenceIds: ["forged"] }) };
  const forgedFingerprint = { ...result, fingerprints: { ...result.fingerprints, evaluationFingerprint: "0".repeat(64) } };
  for (const value of [forgedScore, forgedMetric, forgedEvidence, forgedFingerprint, null, 4, "nope"]) assert.ok(validateWalkForwardEvaluation(value).length > 0);
});

test("late observations, same-day endpoints, unknown coverage, and unavailable stages stay excluded", () => {
  const source = dataset();
  const altered = {
    ...source,
    stageIntervals: source.stageIntervals.map((row, index) => index === 0 ? { ...row, interval: { available: false as const, reason: "same-calendar-day" as const }, end: null } : row),
  };
  // Historical validation prevents a forged input from becoming a target.
  assert.throws(() => buildWalkForwardEvaluation(altered));
  const result = buildWalkForwardEvaluation(source);
  assert.ok(result.predictions.some((prediction) => !prediction.available && prediction.cohort === "no-forecast"));
});
