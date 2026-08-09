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
