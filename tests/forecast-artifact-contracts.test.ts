import assert from "node:assert/strict";
import test from "node:test";

import {
  FORECAST_ARTIFACT_MAX_BYTES,
  FORECAST_ARTIFACT_MAX_TARGETS,
  CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
  FORECAST_ORIGIN_BENCHMARK_VERSION,
  FORECAST_POINTER_PATH,
  activateForecastPointer,
  buildForecastArtifact,
  commitForecastArtifactTransition,
  commitReconciliationRoot,
  forecastArtifactPath,
  forecastPointerWithCandidate,
  initializeForecastPointer,
  parseForecastArtifact,
  parseForecastPointer,
  rawArtifactDigest,
  reconciliationRootArtifactPath,
  rollbackForecastPointer,
  serializeForecastArtifact,
  serializeForecastPointer,
  validateForecastArtifact,
  validateForecastPointer,
  validateForecastPointerTransition,
  type AtomicCasResult,
  type ForecastArtifactDraftV1,
  type ForecastArtifactTargetV1,
  type ForecastContractStorage,
  type ForecastPointerV1,
  type ImmutablePutResult,
} from "../src/lib/forecast-artifact-contracts";
import { NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT } from "../src/lib/next-eligible-prerelease-event";

const encoder = new TextEncoder();
function sha(char: string): string { return char.repeat(64); }
function interval(level: 0.5 | 0.8, q: number) {
  return {
    level,
    residualCount: 8,
    rank: level === 0.5 ? 5 : 8,
    quantileResidualDays: q,
    lowerDays: 10.5 - q,
    pointDays: 10.5,
    upperDays: 10.5 + q,
    lowerCalendarDate: level === 0.5 ? "2026-08-09" : "2026-08-07",
    pointCalendarDate: "2026-08-12",
    upperCalendarDate: level === 0.5 ? "2026-08-14" : "2026-08-16",
  } as const;
}

function draft(generatedAt = "2026-08-09T20:00:00.000Z"): ForecastArtifactDraftV1 {
  const modelTrainingIds = Array.from({ length: 8 }, (_, index) => `model-${index}`);
  const calibrationResidualIds = Array.from({ length: 8 }, (_, index) => `residual-${index}`);
  const provenance = {
    sourceAsOfDate: "2026-08-09",
    sourceIssuedAt: "2026-08-09T19:55:00.000Z",
    sourceEvidenceIds: ["evidence-a", "evidence-b"],
    historicalDataset: { version: "historical-analysis-dataset/v1" as const, fingerprint: sha("1") },
    evaluation: { version: "walk-forward-evaluation/v1" as const, fingerprint: sha("2") },
    publicReleaseModel: { version: "release-date-candidates/v1" as const, fingerprint: sha("3") },
    publicReleaseCalibration: { version: "release-date-interval-calibration/v1" as const, fingerprint: sha("4") },
    nextEventModel: { version: "next-eligible-prerelease-event/v1" as const, fingerprint: sha("5") },
    nextEventCalibration: { version: "next-eligible-prerelease-event/v1" as const, fingerprint: sha("6") },
    currentPublicHeuristic: {
      version: "current-public-heuristic/v1" as const,
      sourceFingerprint: sha("8"),
      modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
    },
    codeFingerprint: sha("7"),
  };
  const publicTarget: ForecastArtifactTargetV1 = {
    targetId: "public:ios-27",
    targetKind: "public-release",
    availability: "available",
    releaseId: "ios-27",
    platformId: "ios",
    productFamilyId: "iphone",
    anchorEventId: "ios-27-beta-1",
    anchorStage: "developer-beta:1",
    anchorOccurredOn: "2026-08-01",
    originOn: "2026-08-09",
    sourceEvidenceIds: ["evidence-a"],
    modelFingerprint: provenance.publicReleaseModel.fingerprint,
    calibrationFingerprint: provenance.publicReleaseCalibration.fingerprint,
    cohort: { modelCohortId: "ios-stage", modelTrainingCohorts: [{ role: "model-training", cohortId: "ios-stage", memberIds: modelTrainingIds, memberCount: 8 }], modelTrainingCount: 8, calibrationPoolId: "ios-stage-candidate", calibrationResidualIds, calibrationResidualCount: 8 },
    prediction: { pointEstimator: "platform-stage-median", pointDays: 10.5, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1", intervals: [interval(0.5, 2), interval(0.8, 4)] },
    benchmarks: [
      {
        benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
        benchmarkId: "selected-private-model",
        modelVersion: "release-date-candidates/v1",
        sourceFingerprint: provenance.historicalDataset.fingerprint,
        modelFingerprint: provenance.publicReleaseModel.fingerprint,
        calibrationFingerprint: provenance.publicReleaseCalibration.fingerprint,
        cohorts: [
          { binding: "target", role: "calibration-residual", cohortId: "ios-stage-candidate", memberCount: 8 },
          { binding: "target", role: "model-training", cohortId: "ios-stage", memberCount: 8 },
        ],
        availability: "available",
        prediction: { targetKind: "public-release", pointDays: 10.5, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1", empiricalRange: { level: 0.5, lowerDays: 8.5, upperDays: 12.5, lowerCalendarDate: "2026-08-09", upperCalendarDate: "2026-08-14" } },
      },
      {
        benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
        benchmarkId: "current-public-heuristic",
        modelVersion: "current-public-heuristic/v1",
        sourceFingerprint: provenance.currentPublicHeuristic.sourceFingerprint,
        modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
        calibrationFingerprint: null,
        cohorts: [],
        availability: "unavailable",
        reason: "heuristic-paused",
      },
      {
        benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
        benchmarkId: "simple-baseline",
        modelVersion: "release-date-candidates/v1",
        sourceFingerprint: provenance.historicalDataset.fingerprint,
        modelFingerprint: provenance.publicReleaseModel.fingerprint,
        calibrationFingerprint: null,
        cohorts: [{ binding: "inline", role: "model-training", cohortId: "platform-stage", memberIds: modelTrainingIds, memberCount: 8 }],
        availability: "available",
        prediction: { targetKind: "public-release", pointDays: 11, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1" },
      },
    ],
  };
  const nextUnavailable: ForecastArtifactTargetV1 = {
    targetId: "next:ios-27",
    targetKind: "next-eligible-prerelease-event",
    availability: "unavailable",
    reason: "weak-next-stage-mode",
    releaseId: "ios-27",
    platformId: "ios",
    productFamilyId: "iphone",
    anchorEventId: "ios-27-beta-1",
    anchorStage: "developer-beta:1",
    anchorOccurredOn: "2026-08-01",
    originOn: "2026-08-09",
    sourceEvidenceIds: ["evidence-b"],
    modelFingerprint: provenance.nextEventModel.fingerprint,
    calibrationFingerprint: provenance.nextEventCalibration.fingerprint,
    cohort: { modelCohortId: "ios-stage", modelTrainingCohorts: [{ role: "stage-training", cohortId: "ios-stage", memberIds: modelTrainingIds, memberCount: 8 }, { role: "timing-training", cohortId: "unavailable", memberIds: [], memberCount: 0 }], modelTrainingCount: 8, calibrationPoolId: "unavailable", calibrationResidualIds: [], calibrationResidualCount: 0 },
    benchmarks: [
      {
        benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
        benchmarkId: "selected-private-model",
        modelVersion: "next-eligible-prerelease-event/v1",
        sourceFingerprint: provenance.historicalDataset.fingerprint,
        modelFingerprint: provenance.nextEventModel.fingerprint,
        calibrationFingerprint: provenance.nextEventCalibration.fingerprint,
        cohorts: [
          { binding: "target", role: "calibration-residual", cohortId: "unavailable", memberCount: 0 },
          { binding: "target", role: "stage-training", cohortId: "ios-stage", memberCount: 8 },
          { binding: "target", role: "timing-training", cohortId: "unavailable", memberCount: 0 },
        ],
        availability: "unavailable",
        reason: "selected-target-unavailable",
      },
      {
        benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
        benchmarkId: "current-public-heuristic",
        modelVersion: "current-public-heuristic/v1",
        sourceFingerprint: provenance.currentPublicHeuristic.sourceFingerprint,
        modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
        calibrationFingerprint: null,
        cohorts: [],
        availability: "unavailable",
        reason: "incomparable-target-definition",
      },
      {
        benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
        benchmarkId: "simple-baseline",
        modelVersion: "next-event-simple-baseline/v1",
        sourceFingerprint: provenance.historicalDataset.fingerprint,
        modelFingerprint: NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT,
        calibrationFingerprint: null,
        cohorts: [],
        availability: "unavailable",
        reason: "minimum-training-examples",
      },
    ],
  };
  return {
    generatedAt,
    runIdentity: { version: "forecast-run-identity/v1", pipeline: "daily-shadow", scheduledFor: "2026-08-09" },
    provenance,
    // Deliberately reversed; the builder canonicalizes logical input order.
    targets: [publicTarget, nextUnavailable],
    metrics: [
      { metricId: "overall-public", targetKind: "public-release", groupId: "overall", scoreCount: 8, availability: "available", maeDays: 2, medianAbsoluteErrorDays: 1.5, signedBiasDays: 0.25, coverage50: 0.5, coverage80: 0.875 },
      { metricId: "overall-next", targetKind: "next-eligible-prerelease-event", groupId: "overall", scoreCount: 4, availability: "unavailable", reason: "minimum-score-count" },
    ],
    exclusions: [{ exclusionId: "excluded-next", targetKind: "next-eligible-prerelease-event", targetId: null, reason: "same-day-ambiguity", sourceEvidenceIds: ["evidence-b"] }],
  };
}

test("FR-012 separates run, semantic, and runtime content identity and emits canonical exact JSON", () => {
  const first = buildForecastArtifact(draft());
  const reordered = draft();
  reordered.targets = [...reordered.targets].reverse();
  reordered.provenance = { ...reordered.provenance, sourceEvidenceIds: [...reordered.provenance.sourceEvidenceIds].reverse() };
  assert.deepEqual(first, buildForecastArtifact(reordered));
  const later = buildForecastArtifact(draft("2026-08-09T20:01:00.000Z"));
  assert.equal(first.runKey, later.runKey);
  assert.equal(first.semanticFingerprint, later.semanticFingerprint);
  assert.notEqual(first.artifactId, later.artifactId);
  const retry = draft("2026-08-09T20:02:00.000Z");
  retry.provenance = { ...retry.provenance, sourceIssuedAt: "2026-08-09T20:01:00.000Z" };
  const retriedArtifact = buildForecastArtifact(retry);
  assert.equal(first.runKey, retriedArtifact.runKey);
  assert.notEqual(first.semanticFingerprint, retriedArtifact.semanticFingerprint);
  const nextScheduledDay = draft();
  nextScheduledDay.runIdentity = { ...nextScheduledDay.runIdentity, scheduledFor: "2026-08-08" };
  const nextRun = buildForecastArtifact(nextScheduledDay);
  assert.notEqual(first.runKey, nextRun.runKey);
  assert.equal(first.semanticFingerprint, nextRun.semanticFingerprint);
  assert.match(forecastArtifactPath(first.artifactId), new RegExp(`${first.artifactId}\\.json$`));
  assert.throws(() => forecastArtifactPath("release/ios-27"));
  const canonical = serializeForecastArtifact(first);
  assert.deepEqual(parseForecastArtifact(encoder.encode(canonical)), first);
  assert.throws(() => parseForecastArtifact(encoder.encode(JSON.stringify(first, null, 2))));
  assert.throws(() => parseForecastArtifact(Uint8Array.from([0xef, 0xbb, 0xbf, ...encoder.encode(canonical)])));
  assert.ok(encoder.encode(canonical).byteLength < FORECAST_ARTIFACT_MAX_BYTES);
});

test("FR-012 binds evidence, models, calibration, intervals, metrics, rows, sizes, and exact properties", () => {
  const artifact = buildForecastArtifact(draft());
  const publicIndex = artifact.targets.findIndex((target) => target.targetKind === "public-release");
  const publicTarget = artifact.targets[publicIndex]!;
  assert.equal(validateForecastArtifact(artifact).length, 0);
  const tampered = (target: unknown) => ({ ...artifact, targets: artifact.targets.map((row, index) => index === publicIndex ? target : row) });
  assert.ok(validateForecastArtifact(tampered({ ...publicTarget, calibrationFingerprint: sha("9") })).length > 0);
  assert.ok(validateForecastArtifact(tampered({ ...publicTarget, sourceEvidenceIds: ["not-in-provenance"] })).length > 0);
  assert.ok(validateForecastArtifact({ ...artifact, provenance: { ...artifact.provenance, publicReleaseModel: { ...artifact.provenance.publicReleaseModel, version: "release-date-candidates/v2" } } }).length > 0);
  if (publicTarget.availability === "available") {
    const hierarchical = draft();
    const hierarchicalTarget = hierarchical.targets.find((target) => target.targetKind === "public-release" && target.availability === "available")!;
    hierarchical.targets = hierarchical.targets.map((target) => target === hierarchicalTarget ? { ...hierarchicalTarget, prediction: { ...hierarchicalTarget.prediction, pointEstimator: "hierarchical-platform-cadence" } } : target);
    assert.doesNotThrow(() => buildForecastArtifact(hierarchical));
    assert.ok(validateForecastArtifact(tampered({ ...publicTarget, prediction: { ...publicTarget.prediction, pointEstimator: "next-event-timing-median" } })).some((issue) => issue.path.endsWith(".pointEstimator")));
    const malformed = { ...publicTarget, prediction: { ...publicTarget.prediction, intervals: [{ ...publicTarget.prediction.intervals[0], lowerDays: 5 }, publicTarget.prediction.intervals[1]] } };
    assert.ok(validateForecastArtifact(tampered(malformed)).some((issue) => issue.code === "invalid-interval"));
    const selected = publicTarget.benchmarks[0]!;
    assert.ok(validateForecastArtifact(tampered({ ...publicTarget, benchmarks: [{ ...selected, calibrationFingerprint: sha("f") }, ...publicTarget.benchmarks.slice(1)] })).some((issue) => issue.path.endsWith("benchmarks[0]") && issue.code === "incompatible-artifact"));
    assert.ok(validateForecastArtifact(tampered({ ...publicTarget, benchmarks: [{ ...selected, prediction: { ...(selected.availability === "available" ? selected.prediction : {}), pointDays: 99 } }, ...publicTarget.benchmarks.slice(1)] })).some((issue) => issue.path.endsWith("benchmarks[0].prediction") && issue.code === "incompatible-artifact"));
    const selectedUnavailable = { ...selected, availability: "unavailable", reason: "selected-target-unavailable" } as Record<string, unknown>;
    delete selectedUnavailable.prediction;
    assert.ok(validateForecastArtifact(tampered({ ...publicTarget, benchmarks: [selectedUnavailable, ...publicTarget.benchmarks.slice(1)] })).some((issue) => issue.path.endsWith("benchmarks[0].availability") && issue.code === "incompatible-artifact"));
    assert.ok(validateForecastArtifact(tampered({ ...publicTarget, benchmarks: [selected, { ...publicTarget.benchmarks[1]!, sourceFingerprint: sha("f") }, publicTarget.benchmarks[2]!] })).some((issue) => issue.path.endsWith("benchmarks[1]") && issue.code === "incompatible-artifact"));
    const simple = publicTarget.benchmarks[2]!;
    assert.ok(simple.availability === "available");
    if (simple.availability === "available") {
      const short = { ...simple.cohorts[0]!, memberIds: ["one"], memberCount: 1 };
      assert.ok(validateForecastArtifact(tampered({ ...publicTarget, benchmarks: [selected, publicTarget.benchmarks[1]!, { ...simple, cohorts: [short] }] })).some((issue) => issue.path.endsWith("benchmarks[2].cohorts") && issue.code === "invalid-row"));
    }
    assert.ok(validateForecastArtifact(tampered({ ...publicTarget, cohort: { ...publicTarget.cohort, calibrationResidualCount: 7 } })).some((issue) => issue.path.endsWith("calibrationResidualCount")));
  }
  const unavailableIndex = artifact.targets.findIndex((target) => target.availability === "unavailable");
  const unavailable = artifact.targets[unavailableIndex]!;
  const unavailableSelected = unavailable.benchmarks[0]!;
  assert.equal(unavailableSelected.availability, "unavailable");
  assert.ok(validateForecastArtifact({
    ...artifact,
    targets: artifact.targets.map((target, index) => index === unavailableIndex
      ? { ...unavailable, benchmarks: [{ ...unavailableSelected, reason: "heuristic-unavailable" }, ...unavailable.benchmarks.slice(1)] }
      : target),
  }).some((issue) => issue.path.endsWith("benchmarks[0].reason") && issue.code === "incompatible-artifact"));
  assert.ok(validateForecastArtifact(tampered({ ...unavailable, prediction: (publicTarget as Extract<ForecastArtifactTargetV1, { availability: "available" }>).prediction })).some((issue) => issue.code === "unknown-property"));
  assert.ok(validateForecastArtifact({ ...artifact, surprise: true }).some((issue) => issue.code === "unknown-property"));
  assert.ok(validateForecastArtifact({ ...artifact, targets: [...artifact.targets].reverse() }).some((issue) => issue.code === "invalid-order"));
  assert.ok(validateForecastArtifact({ ...artifact, metrics: artifact.metrics.map((metric) => metric.availability === "unavailable" ? { ...metric, scoreCount: 8 } : metric) }).length > 0);
  const tooMany = draft();
  tooMany.targets = Array.from({ length: FORECAST_ARTIFACT_MAX_TARGETS + 1 }, (_, index) => ({ ...publicTarget, targetId: `public:${String(index).padStart(4, "0")}` } as ForecastArtifactTargetV1));
  assert.throws(() => buildForecastArtifact(tooMany), (error: unknown) => error instanceof Error && error.message.includes("row-limit"));
  const tooLarge = draft();
  tooLarge.exclusions = [{ ...tooLarge.exclusions[0]!, reason: "x".repeat(FORECAST_ARTIFACT_MAX_BYTES) }];
  assert.throws(() => buildForecastArtifact(tooLarge));
});

test("FR-012 keeps twelve active cycles with both targets inside the 262 KiB operational contract", () => {
  const value = draft();
  const publicTemplate = value.targets.find((target) => target.targetKind === "public-release" && target.availability === "available")!;
  assert.equal(publicTemplate.availability, "available");
  if (publicTemplate.availability !== "available") return;
  const members = Array.from({ length: 24 }, (_, index) => `training-target-${String(index).padStart(2, "0")}-${"x".repeat(36)}`);
  const residuals = Array.from({ length: 16 }, (_, index) => `calibration-residual-${String(index).padStart(2, "0")}-${"y".repeat(28)}`);
  const currentMembers = members.slice(0, 12);
  const targets: ForecastArtifactTargetV1[] = [];
  const capacityInterval = (level: 0.5 | 0.8, q: number) => ({
    ...interval(level, q),
    residualCount: residuals.length,
    rank: level === 0.5 ? 9 : 14,
  });

  for (let cycle = 0; cycle < 12; cycle += 1) {
    const suffix = String(cycle).padStart(2, "0");
    const publicCohort = {
      modelCohortId: "ios-public-model",
      modelTrainingCohorts: [{ role: "model-training" as const, cohortId: "ios-public-model", memberIds: members, memberCount: members.length }],
      modelTrainingCount: members.length,
      calibrationPoolId: "ios-public-calibration",
      calibrationResidualIds: residuals,
      calibrationResidualCount: residuals.length,
    };
    const publicPrediction = {
      ...publicTemplate.prediction,
      intervals: [capacityInterval(0.5, 2), capacityInterval(0.8, 4)] as const,
    };
    targets.push({
      ...publicTemplate,
      targetId: `public:active-${suffix}`,
      releaseId: `active-${suffix}`,
      anchorEventId: `event:active-${suffix}:developer-beta:1`,
      cohort: publicCohort,
      prediction: publicPrediction,
      benchmarks: [
        {
          benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
          benchmarkId: "selected-private-model",
          modelVersion: "release-date-candidates/v1",
          sourceFingerprint: value.provenance.historicalDataset.fingerprint,
          modelFingerprint: value.provenance.publicReleaseModel.fingerprint,
          calibrationFingerprint: value.provenance.publicReleaseCalibration.fingerprint,
          cohorts: [
            { binding: "target", role: "calibration-residual", cohortId: publicCohort.calibrationPoolId, memberCount: residuals.length },
            { binding: "target", role: "model-training", cohortId: publicCohort.modelCohortId, memberCount: members.length },
          ],
          availability: "available",
          prediction: { targetKind: "public-release", pointDays: 10.5, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1", empiricalRange: { level: 0.5, lowerDays: 8.5, upperDays: 12.5, lowerCalendarDate: "2026-08-09", upperCalendarDate: "2026-08-14" } },
        },
        {
          benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
          benchmarkId: "current-public-heuristic",
          modelVersion: "current-public-heuristic/v1",
          sourceFingerprint: value.provenance.currentPublicHeuristic.sourceFingerprint,
          modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
          calibrationFingerprint: null,
          cohorts: [{ binding: "inline", role: "model-training", cohortId: "legacy:release-position:ios", memberIds: currentMembers, memberCount: currentMembers.length }],
          availability: "available",
          prediction: { targetKind: "public-release", pointDays: 10.5, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1", empiricalRange: { level: 0.5, lowerDays: 8.5, upperDays: 12.5, lowerCalendarDate: "2026-08-09", upperCalendarDate: "2026-08-14" } },
        },
        {
          benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
          benchmarkId: "simple-baseline",
          modelVersion: "release-date-candidates/v1",
          sourceFingerprint: value.provenance.historicalDataset.fingerprint,
          modelFingerprint: value.provenance.publicReleaseModel.fingerprint,
          calibrationFingerprint: null,
          cohorts: [{ binding: "inline", role: "model-training", cohortId: "platform-stage:ios", memberIds: members, memberCount: members.length }],
          availability: "available",
          prediction: { targetKind: "public-release", pointDays: 11, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1" },
        },
      ],
    });

    const nextPrediction = { pointEstimator: "next-event-timing-median" as const, pointDays: 10.5, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1" as const, intervals: [capacityInterval(0.5, 2), capacityInterval(0.8, 4)] as const };
    const nextCohort = {
      modelCohortId: "ios-next-model",
      modelTrainingCohorts: [
        { role: "stage-training" as const, cohortId: "ios-next-stage", memberIds: members, memberCount: members.length },
        { role: "timing-training" as const, cohortId: "ios-next-timing", memberIds: members, memberCount: members.length },
      ],
      modelTrainingCount: members.length,
      calibrationPoolId: "ios-next-calibration",
      calibrationResidualIds: residuals,
      calibrationResidualCount: residuals.length,
    };
    targets.push({
      targetId: `next:active-${suffix}`,
      targetKind: "next-eligible-prerelease-event",
      availability: "available",
      predictedEligibleStage: "developer-beta",
      releaseId: `active-${suffix}`,
      platformId: "ios",
      productFamilyId: "iphone",
      anchorEventId: `event:active-${suffix}:developer-beta:1`,
      anchorStage: "developer-beta:1",
      anchorOccurredOn: "2026-08-01",
      originOn: "2026-08-09",
      sourceEvidenceIds: ["evidence-a"],
      modelFingerprint: value.provenance.nextEventModel.fingerprint,
      calibrationFingerprint: value.provenance.nextEventCalibration.fingerprint,
      cohort: nextCohort,
      prediction: nextPrediction,
      benchmarks: [
        {
          benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
          benchmarkId: "selected-private-model",
          modelVersion: "next-eligible-prerelease-event/v1",
          sourceFingerprint: value.provenance.historicalDataset.fingerprint,
          modelFingerprint: value.provenance.nextEventModel.fingerprint,
          calibrationFingerprint: value.provenance.nextEventCalibration.fingerprint,
          cohorts: [
            { binding: "target", role: "calibration-residual", cohortId: nextCohort.calibrationPoolId, memberCount: residuals.length },
            { binding: "target", role: "stage-training", cohortId: "ios-next-stage", memberCount: members.length },
            { binding: "target", role: "timing-training", cohortId: "ios-next-timing", memberCount: members.length },
          ],
          availability: "available",
          prediction: { targetKind: "next-eligible-prerelease-event", pointDays: 10.5, pointCalendarDate: "2026-08-12", roundingRule: "outward-floor-half-up-ceil/v1", empiricalRange: { level: 0.5, lowerDays: 8.5, upperDays: 12.5, lowerCalendarDate: "2026-08-09", upperCalendarDate: "2026-08-14" }, predictedEligibleStage: "developer-beta" },
        },
        {
          benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
          benchmarkId: "current-public-heuristic",
          modelVersion: "current-public-heuristic/v1",
          sourceFingerprint: value.provenance.currentPublicHeuristic.sourceFingerprint,
          modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
          calibrationFingerprint: null,
          cohorts: [],
          availability: "unavailable",
          reason: "incomparable-target-definition",
        },
        {
          benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
          benchmarkId: "simple-baseline",
          modelVersion: "next-event-simple-baseline/v1",
          sourceFingerprint: value.provenance.historicalDataset.fingerprint,
          modelFingerprint: NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT,
          calibrationFingerprint: null,
          cohorts: [
            { binding: "inline", role: "stage-training", cohortId: "simple-next-stage", memberIds: members, memberCount: members.length },
            { binding: "inline", role: "timing-training", cohortId: "simple-next-timing", memberIds: members, memberCount: members.length },
          ],
          availability: "available",
          prediction: { targetKind: "next-eligible-prerelease-event", pointDays: 10, pointCalendarDate: "2026-08-11", roundingRule: "outward-floor-half-up-ceil/v1", predictedEligibleStage: "developer-beta" },
        },
      ],
    });
  }

  value.targets = targets;
  value.metrics = [];
  const artifact = buildForecastArtifact(value);
  assert.equal(artifact.targets.length, 24);
  assert.equal(artifact.targets.filter((target) => target.availability === "available").length, 24);
  assert.ok(encoder.encode(serializeForecastArtifact(artifact)).byteLength < FORECAST_ARTIFACT_MAX_BYTES);
});

test("FR-012 pointer transitions preserve roots and forecast IDs exactly", () => {
  const a = buildForecastArtifact(draft());
  const b = buildForecastArtifact(draft("2026-08-09T20:01:00.000Z"));
  const init = initializeForecastPointer("2026-08-09T20:02:00.000Z");
  assert.deepEqual([init.generation, init.reconciliationRootArtifactId, init.publicReadEnabled], [1, null, false]);
  const candidateA = forecastPointerWithCandidate(init, a.artifactId, "2026-08-09T20:03:00.000Z");
  const activeA = activateForecastPointer(candidateA, "2026-08-09T20:04:00.000Z");
  const rooted = commitReconciliationRoot(activeA, sha("a"), "2026-08-09T20:05:00.000Z");
  const candidateB = forecastPointerWithCandidate(rooted, b.artifactId, "2026-08-09T20:06:00.000Z");
  const activeB = activateForecastPointer(candidateB, "2026-08-09T20:07:00.000Z");
  const rolledBack = rollbackForecastPointer(activeB, "2026-08-09T20:08:00.000Z");
  for (const [previous, next] of [[null, init], [init, candidateA], [candidateA, activeA], [activeA, rooted], [rooted, candidateB], [candidateB, activeB], [activeB, rolledBack]] as const) assert.deepEqual(validateForecastPointerTransition(previous, next), []);
  assert.equal(candidateB.reconciliationRootArtifactId, rooted.reconciliationRootArtifactId);
  assert.equal(activeB.reconciliationRootArtifactId, rooted.reconciliationRootArtifactId);
  assert.equal(rolledBack.reconciliationRootArtifactId, rooted.reconciliationRootArtifactId);
  assert.deepEqual([activeB.activeArtifactId, activeB.rollbackArtifactId], [b.artifactId, a.artifactId]);
  assert.deepEqual([rolledBack.activeArtifactId, rolledBack.rollbackArtifactId], [a.artifactId, b.artifactId]);
  assert.throws(() => forecastPointerWithCandidate(activeA, a.artifactId, "2026-08-09T20:05:00.000Z"));
  const exhausted = { ...init, generation: Number.MAX_SAFE_INTEGER };
  assert.throws(() => forecastPointerWithCandidate(exhausted, a.artifactId, "2026-08-09T20:03:00.000Z"));
  assert.ok(validateForecastPointer({ ...init, generation: 2 ** 53 }).some((issue) => issue.path === "pointer"));
  assert.throws(() => commitReconciliationRoot(rooted, rooted.reconciliationRootArtifactId, "2026-08-09T20:06:00.000Z"));
  assert.ok(validateForecastPointer({ ...rooted, publicReadEnabled: true }).some((issue) => issue.code === "public-mode"));
  assert.ok(validateForecastPointer({ ...rooted, pointerFingerprint: "x".repeat(20_000) }).some((issue) => issue.code === "size-limit"));
  assert.ok(validateForecastPointerTransition(rooted, candidateB).length > 0 === false);
  assert.ok(serializeForecastPointer(rooted).length < 16_384);
  assert.throws(() => {
    const canonical = encoder.encode(serializeForecastPointer(rooted));
    const prefixed = Uint8Array.from([0xef, 0xbb, 0xbf, ...canonical]);
    // Imported parsers must reject alternate byte representations.
    return parseForecastPointer(prefixed);
  });
});

class MemoryStorage implements ForecastContractStorage {
  atomicPointerCas = true;
  readonly files = new Map<string, Uint8Array>();
  readonly operations: string[] = [];
  failPut = false;
  forceMismatch = false;
  forcedObservedGeneration: number | null = null;
  async readExact(path: string): Promise<Uint8Array | null> { const value = this.files.get(path); return value ? value.slice() : null; }
  async putImmutable(path: string, bytes: Uint8Array): Promise<ImmutablePutResult> { this.operations.push("put"); if (this.failPut) throw new Error("put failed"); if (this.files.has(path)) return { status: "exists" }; this.files.set(path, bytes.slice()); return { status: "created" }; }
  async compareAndSwapPointer(path: typeof FORECAST_POINTER_PATH, expected: { fingerprint: string | null; generation: number }, nextBytes: Uint8Array): Promise<AtomicCasResult> {
    this.operations.push("cas");
    const currentBytes = this.files.get(path);
    const current = currentBytes ? JSON.parse(new TextDecoder().decode(currentBytes)) as ForecastPointerV1 : null;
    const observedPreviousFingerprint = current?.pointerFingerprint ?? null;
    const observedPreviousGeneration = this.forcedObservedGeneration ?? current?.generation ?? 0;
    if (this.forceMismatch || observedPreviousFingerprint !== expected.fingerprint || observedPreviousGeneration !== expected.generation) return { status: "mismatch", atomic: true, observedPreviousFingerprint, observedPreviousGeneration };
    this.files.set(path, nextBytes.slice());
    return { status: "applied", atomic: true, observedPreviousFingerprint, observedPreviousGeneration };
  }
}

test("FR-012 immutable-first CAS fails closed for collisions, write failures, non-atomic, stale, lost, and ABA updates", async () => {
  const artifact = buildForecastArtifact(draft());
  const init = initializeForecastPointer("2026-08-09T20:02:00.000Z");
  const candidate = forecastPointerWithCandidate(init, artifact.artifactId, "2026-08-09T20:03:00.000Z");
  const storage = new MemoryStorage();
  assert.equal((await commitForecastArtifactTransition({ storage, previous: null, next: init })).committed, true);
  const committed = await commitForecastArtifactTransition({ storage, previous: init, next: candidate, artifact });
  assert.equal(committed.committed, true);
  assert.deepEqual(storage.operations.slice(-2), ["put", "cas"]);

  const collisionStore = new MemoryStorage();
  collisionStore.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(init)));
  collisionStore.files.set(forecastArtifactPath(artifact.artifactId), encoder.encode("different"));
  const beforeCollision = collisionStore.files.get(FORECAST_POINTER_PATH)!.slice();
  assert.deepEqual(await commitForecastArtifactTransition({ storage: collisionStore, previous: init, next: candidate, artifact }), { committed: false, reason: "immutable-collision" });
  assert.deepEqual(collisionStore.files.get(FORECAST_POINTER_PATH), beforeCollision);

  const failedStore = new MemoryStorage();
  failedStore.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(init)));
  failedStore.failPut = true;
  const beforeFailed = failedStore.files.get(FORECAST_POINTER_PATH)!.slice();
  assert.deepEqual(await commitForecastArtifactTransition({ storage: failedStore, previous: init, next: candidate, artifact }), { committed: false, reason: "storage-failure" });
  assert.deepEqual(failedStore.files.get(FORECAST_POINTER_PATH), beforeFailed);

  const nonAtomic = new MemoryStorage(); nonAtomic.atomicPointerCas = false;
  assert.deepEqual(await commitForecastArtifactTransition({ storage: nonAtomic, previous: null, next: init }), { committed: false, reason: "non-atomic-adapter" });

  for (const mode of ["lost", "aba"] as const) {
    const stale = new MemoryStorage();
    stale.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(init)));
    stale.files.set(forecastArtifactPath(artifact.artifactId), encoder.encode(serializeForecastArtifact(artifact)));
    if (mode === "lost") stale.forceMismatch = true;
    else stale.forcedObservedGeneration = init.generation + 2;
    const before = stale.files.get(FORECAST_POINTER_PATH)!.slice();
    assert.deepEqual(await commitForecastArtifactTransition({ storage: stale, previous: init, next: candidate }), { committed: false, reason: "stale-cas" });
    assert.deepEqual(stale.files.get(FORECAST_POINTER_PATH), before);
  }
});

test("FR-012 validates rollback artifacts and reconciliation roots by exact digest without listing", async () => {
  const a = buildForecastArtifact(draft());
  const b = buildForecastArtifact(draft("2026-08-09T20:01:00.000Z"));
  const init = initializeForecastPointer("2026-08-09T20:02:00.000Z");
  const candidateA = forecastPointerWithCandidate(init, a.artifactId, "2026-08-09T20:03:00.000Z");
  const activeA = activateForecastPointer(candidateA, "2026-08-09T20:04:00.000Z");
  const candidateB = forecastPointerWithCandidate(activeA, b.artifactId, "2026-08-09T20:05:00.000Z");
  const activeB = activateForecastPointer(candidateB, "2026-08-09T20:06:00.000Z");
  const rollback = rollbackForecastPointer(activeB, "2026-08-09T20:07:00.000Z");
  const storage = new MemoryStorage();
  storage.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(activeB)));
  storage.files.set(forecastArtifactPath(a.artifactId), encoder.encode(serializeForecastArtifact(a)));
  storage.files.set(forecastArtifactPath(b.artifactId), encoder.encode(serializeForecastArtifact(b)));
  assert.equal((await commitForecastArtifactTransition({ storage, previous: activeB, next: rollback })).committed, true);

  const rootBytes = encoder.encode('{"indexVersion":"reconciliation-index/v1"}');
  const rootId = rawArtifactDigest(rootBytes);
  storage.files.set(reconciliationRootArtifactPath(rootId), rootBytes);
  const rooted = commitReconciliationRoot(rollback, rootId, "2026-08-09T20:08:00.000Z");
  assert.equal((await commitForecastArtifactTransition({ storage, previous: rollback, next: rooted, validateReconciliationRoot: (bytes, id) => rawArtifactDigest(bytes) === id })).committed, true);
  const alternateRootBytes = encoder.encode('{"indexVersion":"reconciliation-index/v1","sequence":2}');
  const alternateRootId = rawArtifactDigest(alternateRootBytes);
  storage.files.set(reconciliationRootArtifactPath(alternateRootId), alternateRootBytes);
  const staleRoot = commitReconciliationRoot(rollback, alternateRootId, "2026-08-09T20:08:00.000Z");
  const rootedBytes = storage.files.get(FORECAST_POINTER_PATH)!.slice();
  assert.deepEqual(await commitForecastArtifactTransition({ storage, previous: rollback, next: staleRoot, validateReconciliationRoot: (bytes, id) => rawArtifactDigest(bytes) === id }), { committed: false, reason: "stale-cas" });
  assert.deepEqual(storage.files.get(FORECAST_POINTER_PATH), rootedBytes);

  const abaRoot = new MemoryStorage();
  abaRoot.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(rollback)));
  abaRoot.files.set(forecastArtifactPath(a.artifactId), encoder.encode(serializeForecastArtifact(a)));
  abaRoot.files.set(forecastArtifactPath(b.artifactId), encoder.encode(serializeForecastArtifact(b)));
  abaRoot.files.set(reconciliationRootArtifactPath(rootId), rootBytes);
  abaRoot.forcedObservedGeneration = rollback.generation + 2;
  assert.deepEqual(await commitForecastArtifactTransition({ storage: abaRoot, previous: rollback, next: rooted, validateReconciliationRoot: (bytes, id) => rawArtifactDigest(bytes) === id }), { committed: false, reason: "stale-cas" });

  const corruptRollback = new MemoryStorage();
  corruptRollback.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(activeB)));
  corruptRollback.files.set(forecastArtifactPath(a.artifactId), encoder.encode("corrupt"));
  corruptRollback.files.set(forecastArtifactPath(b.artifactId), encoder.encode(serializeForecastArtifact(b)));
  assert.deepEqual(await commitForecastArtifactTransition({ storage: corruptRollback, previous: activeB, next: rollback }), { committed: false, reason: "missing-artifact" });
});
