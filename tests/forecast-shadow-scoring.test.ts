import assert from "node:assert/strict";
import test from "node:test";

import {
  FORECAST_ARTIFACT_MAX_BYTES,
  CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
  FORECAST_ORIGIN_BENCHMARK_VERSION,
  FORECAST_POINTER_PATH,
  buildForecastArtifact,
  forecastArtifactPath,
  initializeForecastPointer,
  reconciliationRootArtifactPath,
  rawArtifactDigest,
  serializeForecastArtifact,
  serializeForecastPointer,
  type AtomicCasResult,
  type ForecastArtifactDraftV1,
  type ForecastArtifactBenchmarkV1,
  type ForecastArtifactTargetV1,
  type ForecastContractStorage,
  type ForecastPointerV1,
  type ImmutablePutResult,
} from "../src/lib/forecast-artifact-contracts";
import { NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT } from "../src/lib/next-eligible-prerelease-event";
import {
  FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
  FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
} from "../src/lib/forecast-runtime-cohort";
import {
  buildHistoricalAnalysisDataset,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
  type HistoricalReleaseMetadataV1,
} from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";
import {
  FORECAST_HEALTH_MIN_REPORTABLE_SCORES,
  FORECAST_RECONCILIATION_INDEX_MAX_BYTES,
  FORECAST_RECONCILIATION_MAX_ROWS,
  FORECAST_SCORE_MAX_BYTES,
  FORECAST_SHADOW_HEALTH_MAX_BYTES,
  ForecastScoringContractError,
  buildForecastShadowEvaluationEpoch,
  buildForecastShadowHealthReport,
  commitForecastScoreReconciliation,
  forecastArtifactIdsRequiredForReconciliation,
  forecastReconciliationIndexArtifactId,
  forecastScoreArtifactId,
  isValidForecastReconciliationRoot,
  parseForecastReconciliationIndex,
  parseForecastScoreArtifact,
  parseForecastShadowHealthReport,
  reconcileForecastScores,
  renderForecastShadowHealthReport,
  serializeForecastReconciliationIndex,
  serializeForecastScoreArtifact,
  serializeForecastShadowHealthReport,
  validateForecastReconciliationIndex,
  validateForecastScoreArtifact,
  validateForecastShadowEvaluationEpoch,
  validateForecastShadowHealthReport,
  type ForecastOutcomeInstantBindingV1,
  type ForecastReconciliationIndexV1,
  type ForecastScoreArtifactV1,
  type ReconcileForecastScoresArgs,
} from "../src/lib/forecast-shadow-scoring";

const encoder = new TextEncoder();
const EPOCH = buildForecastShadowEvaluationEpoch("2026-08-01", "2026-11-28");

function sha(character: string): string { return character.repeat(64); }
function addDays(day: string, amount: number): string { return new Date(Date.parse(`${day}T00:00:00.000Z`) + amount * 86_400_000).toISOString().slice(0, 10); }
function scoreOutcomeFingerprint(
  value: Pick<
    ForecastScoreArtifactV1,
    | "targetId"
    | "targetKind"
    | "releaseId"
    | "platformId"
    | "anchorEventId"
    | "anchorStage"
    | "anchorOccurredOn"
    | "outcomeEventId"
    | "outcomeStage"
    | "outcomeOccurredOn"
    | "outcomeFirstObservedOn"
    | "outcomeFirstObservedAt"
    | "outcomeSourceEvidenceIds"
  >,
): string {
  return historicalAnalysisFingerprint({
    targetId: value.targetId,
    targetKind: value.targetKind,
    releaseId: value.releaseId,
    platformId: value.platformId,
    anchorEventId: value.anchorEventId,
    anchorStage: value.anchorStage,
    anchorOccurredOn: value.anchorOccurredOn,
    targetEventId: value.outcomeEventId,
    targetStage: value.outcomeStage,
    occurredOn: value.outcomeOccurredOn,
    firstObservedOn: value.outcomeFirstObservedOn,
    firstObservedAt: value.outcomeFirstObservedAt,
    sourceEvidenceIds: value.outcomeSourceEvidenceIds,
  });
}
function withIndexFingerprint(
  value: Omit<ForecastReconciliationIndexV1, "indexFingerprint">,
): ForecastReconciliationIndexV1 {
  return {
    ...value,
    indexFingerprint: historicalAnalysisFingerprint(value),
  };
}
function withoutIndexFingerprint(
  value: ForecastReconciliationIndexV1,
): Omit<ForecastReconciliationIndexV1, "indexFingerprint"> {
  const copy: Partial<ForecastReconciliationIndexV1> = { ...value };
  delete copy.indexFingerprint;
  return copy as Omit<ForecastReconciliationIndexV1, "indexFingerprint">;
}
function interval(anchor: string, point: number, level: 0.5 | 0.8, residual: number) {
  const lower = point - residual;
  const upper = point + residual;
  return {
    level,
    residualCount: 8,
    rank: level === 0.5 ? 5 : 8,
    quantileResidualDays: residual,
    lowerDays: lower,
    pointDays: point,
    upperDays: upper,
    lowerCalendarDate: addDays(anchor, Math.floor(lower)),
    pointCalendarDate: addDays(anchor, Math.floor(point + 0.5)),
    upperCalendarDate: addDays(anchor, Math.ceil(upper)),
  } as const;
}

interface ReleaseSpec {
  suffix: string;
  lifecycle?: "active" | "released" | "superseded";
  publicDate?: string;
  publicObservedAt?: string;
  includeTargetEvent?: boolean;
  targetEventId?: string;
  targetDate?: string;
  targetObservedAt?: string;
  targetSequence?: number;
}

function releaseId(suffix: string): string { return `ios-27-${suffix}`; }

function datasetFor(specs: readonly ReleaseSpec[], options: { asOfDate?: string; issuedAt?: string } = {}): HistoricalAnalysisDatasetV1 {
  const asOfDate = options.asOfDate ?? "2026-08-14";
  const issuedAt = options.issuedAt ?? `${asOfDate}T19:00:00.000Z`;
  const releases = specs.map((spec) => {
    const lifecycle = spec.lifecycle ?? "released";
    if (lifecycle === "released") return {
      id: releaseId(spec.suffix),
      lifecycle,
      publicReleaseDate: spec.publicDate ?? "2026-08-14",
      statusEffectiveOn: spec.publicDate ?? "2026-08-14",
      statusFirstObservedAt: spec.publicObservedAt ?? `${spec.publicDate ?? "2026-08-14"}T17:00:00.000Z`,
    } as const;
    if (lifecycle === "superseded") return { id: releaseId(spec.suffix), lifecycle, statusEffectiveOn: "2026-08-14", statusFirstObservedAt: "2026-08-14T17:00:00.000Z" } as const;
    return { id: releaseId(spec.suffix), lifecycle } as const;
  });
  const events = specs.flatMap((spec) => {
    const id = releaseId(spec.suffix);
    const anchors = [
      { id: `${id}-db1-source`, stableEventId: `${id}-db1`, releaseId: id, occurredOn: "2026-08-01", firstObservedAt: "2026-08-01T12:00:00.000Z", channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
      { id: `${id}-db2-source`, stableEventId: `${id}-db2`, releaseId: id, occurredOn: "2026-08-07", firstObservedAt: "2026-08-07T12:00:00.000Z", channel: "developerBeta" as const, sequence: 2, availability: "available" as const },
    ];
    if (spec.includeTargetEvent === false) return anchors;
    return [...anchors, {
      id: `${id}-pb-source`,
      stableEventId: spec.targetEventId ?? `${id}-pb1`,
      releaseId: id,
      occurredOn: spec.targetDate ?? "2026-08-12",
      firstObservedAt: spec.targetObservedAt ?? `${spec.targetDate ?? "2026-08-12"}T17:05:00.000Z`,
      channel: "publicBeta" as const,
      sequence: spec.targetSequence ?? 1,
      availability: "available" as const,
    }];
  });
  const metadata: HistoricalReleaseMetadataV1[] = specs.map((spec, index) => ({
    releaseId: releaseId(spec.suffix),
    platformId: "ios",
    productFamilyId: "iphone-os",
    releaseClass: "major",
    releasePosition: index + 1,
    releaseCycleId: `cycle-${spec.suffix}`,
    chronologyCoverage: { state: "complete", sourceEvidenceIds: [`metadata:${spec.suffix}:chronology`] },
    sourceEvidenceIds: [`metadata:${spec.suffix}:cycle`],
  }));
  return buildHistoricalAnalysisDataset({ adapterResult: adaptReleaseObservations({ asOfDate, issuedAt, releases, events, compatibilityMilestones: [] }), releaseMetadata: metadata });
}

function refingerprintDataset(dataset: HistoricalAnalysisDatasetV1, changes: Partial<Omit<HistoricalAnalysisDatasetV1, "fingerprints">>): HistoricalAnalysisDatasetV1 {
  const { fingerprints, ...originalCore } = dataset;
  const core = { ...originalCore, ...changes };
  const next = {
    ...core,
    fingerprints: {
      ...fingerprints,
      datasetFingerprint: historicalAnalysisFingerprint({ core, inputFingerprint: fingerprints.inputFingerprint, codeFingerprint: fingerprints.codeFingerprint }),
    },
  };
  assert.deepEqual(validateHistoricalAnalysisDataset(next), []);
  return next;
}

function datasetWithCorrectedEvidence(dataset: HistoricalAnalysisDatasetV1, suffix: string): HistoricalAnalysisDatasetV1 {
  const outcome = dataset.lifecycleOutcomes.find((row) => row.releaseId === releaseId(suffix))!;
  const evidence = [...outcome.sourceEvidenceIds, `source:${suffix}:correction`].sort();
  return refingerprintDataset(dataset, {
    lifecycleOutcomes: dataset.lifecycleOutcomes.map((row) => row.outcomeEvidenceId === outcome.outcomeEvidenceId ? { ...row, sourceEvidenceIds: evidence } : row),
    stageIntervals: dataset.stageIntervals.map((row) => row.end?.kind === "lifecycle-outcome" && row.end.outcomeEvidenceId === outcome.outcomeEvidenceId
      ? { ...row, end: { ...row.end, sourceEvidenceIds: evidence }, sourceEvidenceIds: [...new Set([...row.sourceEvidenceIds, ...evidence])].sort() }
      : row),
  });
}

function datasetWithCorrectedNextStage(dataset: HistoricalAnalysisDatasetV1, suffix: string): HistoricalAnalysisDatasetV1 {
  const target = dataset.stageIntervals.find((row) => row.releaseId === releaseId(suffix) && row.startStage === "developer-beta:2")!.end!;
  assert.equal(target.kind, "event");
  const eventId = target.kind === "event" ? target.eventId : "";
  return refingerprintDataset(dataset, {
    canonicalEvents: dataset.canonicalEvents.map((row) => row.eventId === eventId ? { ...row, stage: "public-beta:2" as const, sequence: 2 } : row),
    stageIntervals: dataset.stageIntervals.map((row) => ({
      ...row,
      ...(row.startEventId === eventId ? { startStage: "public-beta:2" as const } : {}),
      ...(row.end?.kind === "event" && row.end.eventId === eventId ? { end: { ...row.end, stage: "public-beta:2" as const } } : {}),
    })),
  });
}

function datasetWithMismatchedNextStage(dataset: HistoricalAnalysisDatasetV1, suffix: string): HistoricalAnalysisDatasetV1 {
  const target = dataset.stageIntervals.find((row) => row.releaseId === releaseId(suffix) && row.startStage === "developer-beta:2")!.end!;
  assert.equal(target.kind, "event");
  const eventId = target.kind === "event" ? target.eventId : "";
  return refingerprintDataset(dataset, {
    canonicalEvents: dataset.canonicalEvents.map((row) => row.eventId === eventId ? { ...row, stage: "release-candidate:1" as const, channel: "releaseCandidate" as const, sequence: 1 } : row),
    stageIntervals: dataset.stageIntervals.map((row) => ({
      ...row,
      ...(row.startEventId === eventId ? { startStage: "release-candidate:1" as const } : {}),
      ...(row.end?.kind === "event" && row.end.eventId === eventId ? { end: { ...row.end, stage: "release-candidate:1" as const } } : {}),
    })),
  });
}

function outcomeBindings(dataset: HistoricalAnalysisDatasetV1, overrides: ReadonlyMap<string, string> = new Map()): ForecastOutcomeInstantBindingV1[] {
  const ids = new Set(dataset.lifecycleOutcomes.map((row) => row.outcomeEvidenceId));
  for (const intervalRow of dataset.stageIntervals) if (intervalRow.startStage === "developer-beta:2" && intervalRow.end?.kind === "event") ids.add(intervalRow.end.eventId);
  const rows = new Map<string, HistoricalAnalysisDatasetV1["canonicalEvents"][number] | HistoricalAnalysisDatasetV1["lifecycleOutcomes"][number]>([
    ...dataset.canonicalEvents.map((row) => [row.eventId, row] as const),
    ...dataset.lifecycleOutcomes.map((row) => [row.outcomeEvidenceId, row] as const),
  ]);
  return [...ids].sort().map((evidenceId) => {
    const row = rows.get(evidenceId)!;
    return {
      bindingVersion: "forecast-outcome-instant-binding/v1",
      evidenceId,
      firstObservedAt: overrides.get(evidenceId) ?? `${row.firstObservedOn}${row.rowType === "canonical-event" ? "T17:05:00.000Z" : "T17:00:00.000Z"}`,
    };
  });
}

function originBenchmarks(args: {
  targetKind: "public-release" | "next-eligible-prerelease-event";
  datasetFingerprint: string;
  modelFingerprint: string;
  calibrationFingerprint: string;
  currentSourceFingerprint: string;
  modelComponents: readonly { role: "model-training" | "stage-training" | "timing-training"; cohortId: string; memberIds: readonly string[] }[];
  calibrationPoolId: string;
  calibrationResidualIds: readonly string[];
  pointDays: number;
  pointCalendarDate: string;
  fifty: ReturnType<typeof interval>;
  predictedEligibleStage?: "public-beta";
}): readonly ForecastArtifactBenchmarkV1[] {
  return [
    {
      benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
      benchmarkId: "selected-private-model" as const,
      modelVersion: args.targetKind === "public-release" ? "release-date-candidates/v1" as const : "next-eligible-prerelease-event/v1" as const,
      sourceFingerprint: args.datasetFingerprint,
      modelFingerprint: args.modelFingerprint,
      calibrationFingerprint: args.calibrationFingerprint,
      cohorts: [
        { binding: "target" as const, role: "calibration-residual" as const, cohortId: args.calibrationPoolId, memberCount: args.calibrationResidualIds.length },
        ...args.modelComponents.map((component) => ({ binding: "target" as const, role: component.role, cohortId: component.cohortId, memberCount: component.memberIds.length })),
      ],
      availability: "available" as const,
      prediction: args.targetKind === "next-eligible-prerelease-event"
        ? { targetKind: args.targetKind, pointDays: args.pointDays, pointCalendarDate: args.pointCalendarDate, roundingRule: "outward-floor-half-up-ceil/v1" as const, empiricalRange: { level: 0.5 as const, lowerDays: args.fifty.lowerDays, upperDays: args.fifty.upperDays, lowerCalendarDate: args.fifty.lowerCalendarDate, upperCalendarDate: args.fifty.upperCalendarDate }, predictedEligibleStage: args.predictedEligibleStage! }
        : { targetKind: args.targetKind, pointDays: args.pointDays, pointCalendarDate: args.pointCalendarDate, roundingRule: "outward-floor-half-up-ceil/v1" as const, empiricalRange: { level: 0.5 as const, lowerDays: args.fifty.lowerDays, upperDays: args.fifty.upperDays, lowerCalendarDate: args.fifty.lowerCalendarDate, upperCalendarDate: args.fifty.upperCalendarDate } },
    },
    {
      benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
      benchmarkId: "current-public-heuristic" as const,
      modelVersion: "current-public-heuristic/v1" as const,
      sourceFingerprint: args.currentSourceFingerprint,
      modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
      calibrationFingerprint: null,
      cohorts: [],
      availability: "unavailable" as const,
      reason: args.targetKind === "public-release" ? "heuristic-paused" as const : "incomparable-target-definition" as const,
    },
    {
      benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
      benchmarkId: "simple-baseline" as const,
      modelVersion: args.targetKind === "public-release" ? "release-date-candidates/v1" as const : "next-event-simple-baseline/v1" as const,
      sourceFingerprint: args.datasetFingerprint,
      modelFingerprint: args.targetKind === "public-release" ? sha("3") : NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT,
      calibrationFingerprint: null,
      cohorts: [],
      availability: "unavailable" as const,
      reason: "minimum-training-examples" as const,
    },
  ];
}

function withAvailableComparators(
  benchmarks: readonly ForecastArtifactBenchmarkV1[],
  args: {
    targetKind: "public-release" | "next-eligible-prerelease-event";
    anchorOn: string;
  },
): ForecastArtifactBenchmarkV1[] {
  return benchmarks.map((benchmark) => {
    if (benchmark.benchmarkId === "current-public-heuristic") {
      if (args.targetKind !== "public-release" || benchmark.availability !== "unavailable") {
        return benchmark;
      }
      const { reason, ...base } = benchmark;
      void reason;
      const currentRange = interval(args.anchorOn, 9, 0.5, 3);
      return {
        ...base,
        availability: "available",
        cohorts: [{ binding: "inline", role: "model-training", cohortId: "current-public-model", memberIds: ["current-01", "current-02", "current-03"], memberCount: 3 }],
        prediction: {
          targetKind: "public-release",
          pointDays: 9,
          pointCalendarDate: addDays(args.anchorOn, 9),
          roundingRule: "outward-floor-half-up-ceil/v1",
          empiricalRange: { level: 0.5, lowerDays: currentRange.lowerDays, upperDays: currentRange.upperDays, lowerCalendarDate: currentRange.lowerCalendarDate, upperCalendarDate: currentRange.upperCalendarDate },
        },
      };
    }
    if (benchmark.benchmarkId !== "simple-baseline" || benchmark.availability !== "unavailable") {
      return benchmark;
    }
    const { reason, ...base } = benchmark;
    void reason;
    if (args.targetKind === "public-release") {
      return {
        ...base,
        availability: "available",
        cohorts: [{ binding: "inline", role: "model-training", cohortId: "simple-public-model", memberIds: Array.from({ length: 8 }, (_, index) => `simple-public-${String(index).padStart(2, "0")}`), memberCount: 8 }],
        prediction: {
          targetKind: "public-release",
          pointDays: 8,
          pointCalendarDate: addDays(args.anchorOn, 8),
          roundingRule: "outward-floor-half-up-ceil/v1",
        },
      };
    }
    return {
      ...base,
      availability: "available",
      cohorts: [
        { binding: "inline", role: "stage-training", cohortId: "simple-next-stage", memberIds: Array.from({ length: 8 }, (_, index) => `simple-stage-${String(index).padStart(2, "0")}`), memberCount: 8 },
        { binding: "inline", role: "timing-training", cohortId: "simple-next-timing", memberIds: Array.from({ length: 8 }, (_, index) => `simple-timing-${String(index).padStart(2, "0")}`), memberCount: 8 },
      ],
      prediction: {
        targetKind: "next-eligible-prerelease-event",
        pointDays: 6,
        pointCalendarDate: addDays(args.anchorOn, 6),
        roundingRule: "outward-floor-half-up-ceil/v1",
        predictedEligibleStage: "public-beta",
      },
    };
  });
}

function forecastDraft(dataset: HistoricalAnalysisDatasetV1, suffixes: string | readonly string[] = "a", options: { scheduledFor?: string; generatedAt?: string; includeNext?: boolean; sameTargetId?: boolean; includeAvailableComparators?: boolean } = {}): ForecastArtifactDraftV1 {
  const selected = typeof suffixes === "string" ? [suffixes] : [...suffixes];
  const scheduledFor = options.scheduledFor ?? "2026-08-09";
  const generatedAt = options.generatedAt ?? `${scheduledFor}T20:00:00.000Z`;
  const includeNext = options.includeNext ?? true;
  const includeAvailableComparators = options.includeAvailableComparators ?? false;
  const targets: ForecastArtifactTargetV1[] = [];
  const currentSourceFingerprint = sha("8");
  for (const suffix of selected) {
    const id = releaseId(suffix);
    const publicAnchor = dataset.canonicalEvents.find((row) => row.releaseId === id && row.stage === "developer-beta:1")!;
    const nextAnchor = dataset.canonicalEvents.find((row) => row.releaseId === id && row.stage === "developer-beta:2")!;
    const sharedId = `shared:${id}`;
    const publicModelTrainingIds = Array.from({ length: 12 }, (_, index) => `public-model-${String(index).padStart(2, "0")}`);
    const publicCalibrationIds = Array.from({ length: 8 }, (_, index) => `public-residual-${String(index).padStart(2, "0")}`);
    const publicFifty = interval(publicAnchor.occurredOn, 10.5, 0.5, 2.5);
    const publicPrediction = { pointEstimator: "hierarchical-platform-cadence" as const, pointDays: 10.5, pointCalendarDate: addDays(publicAnchor.occurredOn, 11), roundingRule: "outward-floor-half-up-ceil/v1" as const, intervals: [publicFifty, interval(publicAnchor.occurredOn, 10.5, 0.8, 4.5)] as const };
    targets.push({
      targetId: options.sameTargetId ? sharedId : `public:${id}`,
      targetKind: "public-release",
      availability: "available",
      releaseId: id,
      platformId: "ios",
      productFamilyId: "iphone-os",
      anchorEventId: publicAnchor.eventId,
      anchorStage: publicAnchor.stage,
      anchorOccurredOn: publicAnchor.occurredOn,
      originOn: scheduledFor,
      sourceEvidenceIds: publicAnchor.sourceEvidenceIds,
      modelFingerprint: sha("3"),
      calibrationFingerprint: sha("4"),
      cohort: { modelCohortId: "ios-public-hierarchical", modelTrainingCohorts: [{ role: "model-training", cohortId: "ios-public-hierarchical", memberIds: publicModelTrainingIds, memberCount: 12 }], modelTrainingCount: 12, calibrationPoolId: "ios-public", calibrationResidualIds: publicCalibrationIds, calibrationResidualCount: 8 },
      prediction: publicPrediction,
      benchmarks: includeAvailableComparators
        ? withAvailableComparators(originBenchmarks({ targetKind: "public-release", datasetFingerprint: dataset.fingerprints.datasetFingerprint, modelFingerprint: sha("3"), calibrationFingerprint: sha("4"), currentSourceFingerprint, modelComponents: [{ role: "model-training", cohortId: "ios-public-hierarchical", memberIds: publicModelTrainingIds }], calibrationPoolId: "ios-public", calibrationResidualIds: publicCalibrationIds, pointDays: publicPrediction.pointDays, pointCalendarDate: publicPrediction.pointCalendarDate, fifty: publicFifty }), { targetKind: "public-release", anchorOn: publicAnchor.occurredOn })
        : originBenchmarks({ targetKind: "public-release", datasetFingerprint: dataset.fingerprints.datasetFingerprint, modelFingerprint: sha("3"), calibrationFingerprint: sha("4"), currentSourceFingerprint, modelComponents: [{ role: "model-training", cohortId: "ios-public-hierarchical", memberIds: publicModelTrainingIds }], calibrationPoolId: "ios-public", calibrationResidualIds: publicCalibrationIds, pointDays: publicPrediction.pointDays, pointCalendarDate: publicPrediction.pointCalendarDate, fifty: publicFifty }),
    });
    const nextModelTrainingIds = Array.from({ length: 10 }, (_, index) => `next-model-${String(index).padStart(2, "0")}`);
    const nextCalibrationIds = Array.from({ length: 8 }, (_, index) => `next-residual-${String(index).padStart(2, "0")}`);
    const nextFifty = interval(nextAnchor.occurredOn, 7, 0.5, 1);
    const nextPrediction = { pointEstimator: "next-event-timing-median" as const, pointDays: 7, pointCalendarDate: addDays(nextAnchor.occurredOn, 7), roundingRule: "outward-floor-half-up-ceil/v1" as const, intervals: [nextFifty, interval(nextAnchor.occurredOn, 7, 0.8, 2)] as const };
    if (includeNext) targets.push({
      targetId: options.sameTargetId ? sharedId : `next:${id}`,
      targetKind: "next-eligible-prerelease-event",
      availability: "available",
      predictedEligibleStage: "public-beta",
      releaseId: id,
      platformId: "ios",
      productFamilyId: "iphone-os",
      anchorEventId: nextAnchor.eventId,
      anchorStage: nextAnchor.stage,
      anchorOccurredOn: nextAnchor.occurredOn,
      originOn: scheduledFor,
      sourceEvidenceIds: nextAnchor.sourceEvidenceIds,
      modelFingerprint: sha("5"),
      calibrationFingerprint: sha("6"),
      cohort: { modelCohortId: "ios-next-stage", modelTrainingCohorts: [{ role: "stage-training", cohortId: "ios-next-stage-mode", memberIds: nextModelTrainingIds, memberCount: 10 }, { role: "timing-training", cohortId: "ios-next-stage-timing", memberIds: nextModelTrainingIds, memberCount: 10 }], modelTrainingCount: 10, calibrationPoolId: "ios-next-stage", calibrationResidualIds: nextCalibrationIds, calibrationResidualCount: 8 },
      prediction: nextPrediction,
      benchmarks: [
        ...(includeAvailableComparators
          ? withAvailableComparators(originBenchmarks({ targetKind: "next-eligible-prerelease-event", datasetFingerprint: dataset.fingerprints.datasetFingerprint, modelFingerprint: sha("5"), calibrationFingerprint: sha("6"), currentSourceFingerprint, modelComponents: [{ role: "stage-training", cohortId: "ios-next-stage-mode", memberIds: nextModelTrainingIds }, { role: "timing-training", cohortId: "ios-next-stage-timing", memberIds: nextModelTrainingIds }], calibrationPoolId: "ios-next-stage", calibrationResidualIds: nextCalibrationIds, pointDays: nextPrediction.pointDays, pointCalendarDate: nextPrediction.pointCalendarDate, fifty: nextFifty, predictedEligibleStage: "public-beta" }), { targetKind: "next-eligible-prerelease-event", anchorOn: nextAnchor.occurredOn })
          : originBenchmarks({ targetKind: "next-eligible-prerelease-event", datasetFingerprint: dataset.fingerprints.datasetFingerprint, modelFingerprint: sha("5"), calibrationFingerprint: sha("6"), currentSourceFingerprint, modelComponents: [{ role: "stage-training", cohortId: "ios-next-stage-mode", memberIds: nextModelTrainingIds }, { role: "timing-training", cohortId: "ios-next-stage-timing", memberIds: nextModelTrainingIds }], calibrationPoolId: "ios-next-stage", calibrationResidualIds: nextCalibrationIds, pointDays: nextPrediction.pointDays, pointCalendarDate: nextPrediction.pointCalendarDate, fifty: nextFifty, predictedEligibleStage: "public-beta" })),
      ],
    });
  }
  const sourceEvidenceIds = [...new Set(targets.flatMap((target) => target.sourceEvidenceIds))].sort();
  return {
    generatedAt,
    runIdentity: { version: "forecast-run-identity/v1", pipeline: "daily-shadow", scheduledFor },
    provenance: {
      sourceAsOfDate: scheduledFor,
      sourceIssuedAt: `${scheduledFor}T19:55:00.000Z`,
      sourceEvidenceIds,
      historicalDataset: { version: "historical-analysis-dataset/v1", fingerprint: dataset.fingerprints.datasetFingerprint },
      runtimeCohort: {
        selectionVersion: "forecast-runtime-cohort-selection/v1",
        selectionFingerprint: sha("9"),
        selectionCodeFingerprint: FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
        selectionConfigFingerprint: FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
        fullHistoricalDataset: {
          version: "historical-analysis-dataset/v1",
          fingerprint: dataset.fingerprints.datasetFingerprint,
        },
        fullRawSourceFingerprint: sha("a"),
        projectedRawSourceFingerprint: sha("b"),
        selectedReleaseCount: selected.length,
        selectedObservationCount: 24,
      },
      evaluation: { version: "walk-forward-evaluation/v1", fingerprint: sha("2") },
      publicReleaseModel: { version: "release-date-candidates/v1", fingerprint: sha("3") },
      publicReleaseCalibration: { version: "release-date-interval-calibration/v1", fingerprint: sha("4") },
      nextEventModel: { version: "next-eligible-prerelease-event/v1", fingerprint: sha("5") },
      nextEventCalibration: { version: "next-eligible-prerelease-event/v1", fingerprint: sha("6") },
      currentPublicHeuristic: { version: "current-public-heuristic/v1", sourceFingerprint: currentSourceFingerprint, modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT },
      codeFingerprint: sha("7"),
    },
    targets,
    metrics: [],
    exclusions: [],
  };
}

function reconciliationArgs(dataset: HistoricalAnalysisDatasetV1, forecastArtifacts: ReconcileForecastScoresArgs["forecastArtifacts"], overrides: Partial<ReconcileForecastScoresArgs> = {}): ReconcileForecastScoresArgs {
  return {
    reconciliationCutoffAt: `${dataset.provenance.sourceAsOfDate}T19:30:00.000Z`,
    evaluationEpoch: EPOCH,
    forecastArtifacts,
    sourceDataset: dataset,
    outcomeInstantBindings: outcomeBindings(dataset),
    ...overrides,
  };
}

test("FR-015 derives and scores exact outcomes only from validated historical rows", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const result = reconcileForecastScores(reconciliationArgs(dataset, [forecast]));
  assert.equal(result.index.reconciliationCutoffAt, "2026-08-14T19:30:00.000Z");
  assert.equal(result.index.reconciliationCutoffDate, "2026-08-14");
  assert.equal(result.index.scores.length, 2);
  assert.equal(result.index.pending.length, 0);
  assert.equal(result.index.dataGaps.length, 0);
  assert.equal(result.index.unavailableBenchmarks.length, 4);
  assert.equal(
    result.index.unavailableBenchmarks.find(
      (entry) =>
        entry.targetKind === "next-eligible-prerelease-event" &&
        entry.benchmarkId === "current-public-heuristic",
    )?.reason,
    "incomparable-target-definition",
  );
  const publicScore = result.scoreArtifacts.find((record) => record.artifact.targetKind === "public-release")!;
  assert.equal(publicScore.artifact.pointEstimator, "hierarchical-platform-cadence");
  assert.equal(publicScore.artifact.actualDays, 13);
  assert.equal(publicScore.artifact.signedErrorDays, 2.5);
  assert.deepEqual(publicScore.artifact.intervals.map((entry) => entry.covered), [true, true]);
  const nextScore = result.scoreArtifacts.find((record) => record.artifact.targetKind === "next-eligible-prerelease-event")!;
  assert.equal(nextScore.artifact.pointEstimator, "next-event-timing-median");
  assert.equal(nextScore.artifact.actualDays, 5);
  assert.deepEqual(nextScore.artifact.intervals.map((entry) => entry.covered), [false, true]);
  assert.equal(forecastScoreArtifactId(publicScore.artifact), publicScore.artifactId);
  assert.equal(validateForecastScoreArtifact(publicScore.artifact).length, 0);
  const scoreMap = new Map(result.scoreArtifacts.map((record) => [record.artifactId, record.artifact]));
  assert.deepEqual(validateForecastReconciliationIndex(result.index, scoreMap, new Map([[forecast.artifactId, forecast]])), []);
});

test("FR-015 scores each frozen available benchmark and records incomparable rows separately", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(
    forecastDraft(dataset, "a", { includeAvailableComparators: true }),
  );
  const result = reconcileForecastScores(reconciliationArgs(dataset, [forecast]));
  assert.equal(result.index.scores.length, 5);
  assert.equal(result.index.pending.length, 0);
  assert.equal(result.index.dataGaps.length, 0);
  assert.equal(result.index.unavailableBenchmarks.length, 1);
  assert.deepEqual(result.index.unavailableBenchmarks[0] && {
    targetKind: result.index.unavailableBenchmarks[0].targetKind,
    benchmarkId: result.index.unavailableBenchmarks[0].benchmarkId,
    reason: result.index.unavailableBenchmarks[0].reason,
  }, {
    targetKind: "next-eligible-prerelease-event",
    benchmarkId: "current-public-heuristic",
    reason: "incomparable-target-definition",
  });

  const publicScores = result.scoreArtifacts
    .map((record) => record.artifact)
    .filter((score) => score.targetKind === "public-release")
    .sort((left, right) => left.benchmarkId.localeCompare(right.benchmarkId));
  assert.deepEqual(
    publicScores.map((score) => score.benchmarkId),
    ["current-public-heuristic", "selected-private-model", "simple-baseline"],
  );
  const publicByBenchmark = new Map(publicScores.map((score) => [score.benchmarkId, score]));
  assert.equal(
    publicByBenchmark.get("current-public-heuristic")?.pointEstimator,
    "current-public-heuristic",
  );
  assert.equal(
    publicByBenchmark.get("current-public-heuristic")
      ?.forecastBenchmarkSourceFingerprint,
    sha("8"),
  );
  assert.deepEqual(
    publicByBenchmark
      .get("selected-private-model")
      ?.intervals.map((interval) => interval.level),
    [0.5, 0.8],
  );
  assert.deepEqual(
    publicByBenchmark
      .get("current-public-heuristic")
      ?.intervals.map((interval) => interval.level),
    [0.5],
  );
  assert.deepEqual(
    publicByBenchmark.get("simple-baseline")?.intervals,
    [],
  );
  const selectedScore = publicByBenchmark.get("selected-private-model")!;
  const currentScore = publicByBenchmark.get("current-public-heuristic")!;
  assert.ok(
    validateForecastScoreArtifact({
      ...selectedScore,
      intervals: selectedScore.intervals.filter((interval) => interval.level === 0.5),
    }).some((issue) => issue.path === "score.intervals"),
  );
  assert.ok(
    validateForecastScoreArtifact({
      ...currentScore,
      calibrationFingerprint: sha("f"),
    }).some((issue) => issue.path === "score"),
  );
  const nextScores = result.scoreArtifacts
    .map((record) => record.artifact)
    .filter((score) => score.targetKind === "next-eligible-prerelease-event")
    .sort((left, right) => left.benchmarkId.localeCompare(right.benchmarkId));
  assert.deepEqual(
    nextScores.map((score) => [score.benchmarkId, score.pointEstimator]),
    [
      ["selected-private-model", "next-event-timing-median"],
      ["simple-baseline", "next-event-simple-baseline"],
    ],
  );
  assert.ok(
    new Set(result.scoreArtifacts.map((record) => record.artifactId)).size ===
      result.scoreArtifacts.length,
  );
  const scoreMap = new Map(
    result.scoreArtifacts.map((record) => [record.artifactId, record.artifact]),
  );
  assert.deepEqual(
    validateForecastReconciliationIndex(
      result.index,
      scoreMap,
      new Map([[forecast.artifactId, forecast]]),
    ),
    [],
  );
  const indexBody = withoutIndexFingerprint(result.index);
  const orphanUnavailable = {
    ...result.index.unavailableBenchmarks[0]!,
    targetId: "orphan:benchmark-row",
  };
  const withOrphanUnavailable = withIndexFingerprint({
    ...indexBody,
    unavailableBenchmarks: [
      ...indexBody.unavailableBenchmarks,
      orphanUnavailable,
    ],
  });
  assert.ok(
    validateForecastReconciliationIndex(
      withOrphanUnavailable,
      scoreMap,
      new Map([[forecast.artifactId, forecast]]),
    ).some((issue) => issue.code === "incompatible-artifact"),
  );
});

test("FR-015 matches candidates by target kind plus target ID", () => {
  const dataset = datasetFor([{ suffix: "same" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset, "same", { sameTargetId: true }));
  const result = reconcileForecastScores(reconciliationArgs(dataset, [forecast]));
  assert.equal(new Set(result.index.scores.map((entry) => entry.targetId)).size, 1);
  assert.deepEqual(result.index.scores.map((entry) => entry.targetKind), ["next-eligible-prerelease-event", "public-release"]);
});

test("FR-015 rejects arbitrary evidence, mismatched observation days, and source snapshots after cutoff", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const bindings = outcomeBindings(dataset);
  assert.throws(() => reconcileForecastScores(reconciliationArgs(dataset, [forecast], { outcomeInstantBindings: [...bindings, { bindingVersion: "forecast-outcome-instant-binding/v1", evidenceId: "arbitrary", firstObservedAt: "2026-08-14T18:00:00.000Z" }] })), ForecastScoringContractError);
  assert.throws(() => reconcileForecastScores(reconciliationArgs(dataset, [forecast], { outcomeInstantBindings: bindings.map((binding, index) => index ? binding : { ...binding, firstObservedAt: "2026-08-13T18:00:00.000Z" }) })), ForecastScoringContractError);
  assert.throws(() => reconcileForecastScores(reconciliationArgs(dataset, [forecast], { reconciliationCutoffAt: "2026-08-14T18:59:59.000Z" })), ForecastScoringContractError);
});

test("FR-015 stored scores reject impossible observation chronology", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const result = reconcileForecastScores(reconciliationArgs(dataset, [forecast]));
  const score = result.scoreArtifacts[0]!.artifact;
  const impossibleDraft = {
    ...score,
    outcomeFirstObservedOn: addDays(score.outcomeOccurredOn, -1),
    outcomeFirstObservedAt: `${addDays(score.outcomeOccurredOn, -1)}T17:00:00.000Z`,
  };
  const sourceOutcomeFingerprint = scoreOutcomeFingerprint(impossibleDraft);
  const impossible = {
    ...impossibleDraft,
    sourceOutcomeFingerprint,
    outcomeId: sourceOutcomeFingerprint,
  };
  assert.ok(
    validateForecastScoreArtifact(impossible).some(
      (issue) => issue.code === "invalid-chronology",
    ),
  );
});

test("FR-015 persisted roots reject outcomes learned after reconciliation cutoff", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const result = reconcileForecastScores(reconciliationArgs(dataset, [forecast]));
  const original = result.index.scores[0]!;
  const afterCutoffDraft = {
    ...original,
    outcomeFirstObservedAt: "2026-08-14T20:00:00.000Z",
  };
  const outcomeId = historicalAnalysisFingerprint({
    targetId: afterCutoffDraft.targetId,
    targetKind: afterCutoffDraft.targetKind,
    releaseId: afterCutoffDraft.releaseId,
    platformId: afterCutoffDraft.platformId,
    anchorEventId: afterCutoffDraft.targetSnapshot.anchorEventId,
    anchorStage: afterCutoffDraft.targetSnapshot.anchorStage,
    anchorOccurredOn: afterCutoffDraft.targetSnapshot.anchorOccurredOn,
    targetEventId: afterCutoffDraft.outcomeEventId,
    targetStage: afterCutoffDraft.outcomeStage,
    occurredOn: afterCutoffDraft.outcomeOccurredOn,
    firstObservedOn: afterCutoffDraft.outcomeFirstObservedOn,
    firstObservedAt: afterCutoffDraft.outcomeFirstObservedAt,
    sourceEvidenceIds: afterCutoffDraft.outcomeSourceEvidenceIds,
  });
  const indexBody = withoutIndexFingerprint(result.index);
  const tampered = withIndexFingerprint({
    ...indexBody,
    scores: result.index.scores.map((entry) =>
      entry === original ? { ...afterCutoffDraft, outcomeId } : entry,
    ),
  });
  assert.ok(
    validateForecastReconciliationIndex(tampered).some(
      (issue) => issue.code === "invalid-chronology",
    ),
  );
  const bytes = encoder.encode(stableSerializeHistoricalAnalysis(tampered));
  assert.equal(
    isValidForecastReconciliationRoot(bytes, rawArtifactDigest(bytes)),
    false,
  );
});

test("FR-015 canonical parsers reject alternate bytes, tampering, and oversized inputs before decode", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const result = reconcileForecastScores(reconciliationArgs(dataset, [forecast]));
  const score = result.scoreArtifacts[0]!.artifact;
  const scoreText = serializeForecastScoreArtifact(score);
  assert.deepEqual(parseForecastScoreArtifact(encoder.encode(scoreText)), score);
  assert.throws(() => parseForecastScoreArtifact(encoder.encode(JSON.stringify(score, null, 2))));
  assert.throws(() => parseForecastScoreArtifact(new Uint8Array(FORECAST_SCORE_MAX_BYTES + 1)), ForecastScoringContractError);
  assert.ok(validateForecastScoreArtifact({ ...score, surprise: true }).some((issue) => issue.code === "unknown-property"));
  const indexText = serializeForecastReconciliationIndex(result.index);
  assert.deepEqual(parseForecastReconciliationIndex(encoder.encode(indexText)), result.index);
  assert.equal(
    isValidForecastReconciliationRoot(
      encoder.encode(indexText),
      forecastReconciliationIndexArtifactId(result.index),
    ),
    true,
  );
  assert.equal(
    isValidForecastReconciliationRoot(encoder.encode(indexText), sha("f")),
    false,
  );
  assert.throws(() => parseForecastReconciliationIndex(new Uint8Array(FORECAST_RECONCILIATION_INDEX_MAX_BYTES + 1)), ForecastScoringContractError);
  assert.throws(() => parseForecastShadowHealthReport(new Uint8Array(FORECAST_SHADOW_HEALTH_MAX_BYTES + 1)), ForecastScoringContractError);
  assert.ok(validateForecastReconciliationIndex({ ...result.index, indexFingerprint: sha("f") }).some((issue) => issue.code === "invalid-fingerprint"));
  assert.ok(validateForecastReconciliationIndex({ ...result.index, scores: [...result.index.scores].reverse() }).some((issue) => issue.code === "invalid-order"));
  const scoreEntry = result.index.scores[0]!;
  const pendingEntry = {
    forecastArtifactId: scoreEntry.forecastArtifactId,
    forecastGeneratedAt: scoreEntry.forecastGeneratedAt,
    targetId: scoreEntry.targetId,
    targetKind: scoreEntry.targetKind,
    releaseId: scoreEntry.releaseId,
    platformId: scoreEntry.platformId,
    modelCohortId: scoreEntry.modelCohortId,
    targetSnapshot: scoreEntry.targetSnapshot,
    reason: "outcome-not-yet-known" as const,
  };
  const overflow = { ...result.index, scores: [], pending: Array.from({ length: FORECAST_RECONCILIATION_MAX_ROWS + 1 }, () => pendingEntry) };
  assert.ok(validateForecastReconciliationIndex(overflow).some((issue) => issue.code === "row-limit"));
  assert.ok(encoder.encode(scoreText).byteLength < FORECAST_SCORE_MAX_BYTES);
  assert.ok(encoder.encode(indexText).byteLength < FORECAST_ARTIFACT_MAX_BYTES);
});

test("FR-015 reuses the exact prior root and unions only newly supplied forecasts", () => {
  const dataset = datasetFor([{ suffix: "a" }, { suffix: "b" }]);
  const firstForecast = buildForecastArtifact(forecastDraft(dataset, "a", { scheduledFor: "2026-08-09" }));
  const secondForecast = buildForecastArtifact(forecastDraft(dataset, "b", { scheduledFor: "2026-08-10" }));
  const first = reconcileForecastScores(reconciliationArgs(dataset, [firstForecast]));
  const unchangedArgs = reconciliationArgs(dataset, [], { previousIndex: first.index });
  assert.deepEqual(forecastArtifactIdsRequiredForReconciliation(unchangedArgs), []);
  const unchanged = reconcileForecastScores(unchangedArgs);
  assert.equal(unchanged.indexArtifactId, first.indexArtifactId);
  assert.deepEqual(unchanged.newScoreArtifactIds, []);
  const union = reconcileForecastScores(reconciliationArgs(dataset, [secondForecast], { previousIndex: first.index }));
  assert.deepEqual(union.index.sourceForecastArtifactIds, [firstForecast.artifactId, secondForecast.artifactId].sort());
  assert.equal(union.index.scores.length, 4);
  assert.equal(union.scoreArtifacts.length, 2, "only the newly scored forecast emits score writes");
  const fullForecastMap = new Map([[firstForecast.artifactId, firstForecast], [secondForecast.artifactId, secondForecast]]);
  const missingState = { ...union.index, scores: union.index.scores.slice(1) };
  assert.ok(validateForecastReconciliationIndex(missingState, undefined, fullForecastMap).some((issue) => issue.code === "incompatible-artifact"));
});

test("FR-015 replaces corrected outcomes, retains immutable audit rows, and removes obsolete active scores", () => {
  const baseDataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(baseDataset));
  const first = reconcileForecastScores(reconciliationArgs(baseDataset, [forecast]));
  const forecastMap = new Map([[forecast.artifactId, forecast]]);

  const corrections: Array<[string, HistoricalAnalysisDatasetV1, ForecastOutcomeInstantBindingV1[]]> = [];
  const dateDataset = datasetFor([{ suffix: "a", publicDate: "2026-08-15", publicObservedAt: "2026-08-15T17:00:00.000Z" }], { asOfDate: "2026-08-15" });
  corrections.push(["outcome-date-corrected", dateDataset, outcomeBindings(dateDataset)]);
  const evidenceDataset = datasetWithCorrectedEvidence(baseDataset, "a");
  corrections.push(["outcome-evidence-corrected", evidenceDataset, outcomeBindings(evidenceDataset)]);
  const stageDataset = datasetWithCorrectedNextStage(baseDataset, "a");
  corrections.push(["outcome-stage-corrected", stageDataset, outcomeBindings(stageDataset)]);
  const identityDataset = datasetFor([{ suffix: "a", targetEventId: "ios-27-a-pb1-corrected" }]);
  corrections.push(["outcome-identity-corrected", identityDataset, outcomeBindings(identityDataset)]);
  const publicEvidenceId = baseDataset.lifecycleOutcomes[0]!.outcomeEvidenceId;
  corrections.push(["outcome-observation-time-corrected", baseDataset, outcomeBindings(baseDataset, new Map([[publicEvidenceId, "2026-08-14T18:00:00.000Z"]]))]);

  for (const [reason, dataset, bindings] of corrections) {
    const unresolved = reconciliationArgs(dataset, [], { previousIndex: first.index, outcomeInstantBindings: bindings });
    assert.deepEqual(forecastArtifactIdsRequiredForReconciliation(unresolved), [forecast.artifactId], reason);
    assert.throws(() => reconcileForecastScores(unresolved), ForecastScoringContractError);
    const corrected = reconcileForecastScores({ ...unresolved, previousForecastArtifacts: forecastMap });
    assert.ok(corrected.index.audit.some((entry) => entry.reason === reason), reason);
    const audited = corrected.index.audit.find((entry) => entry.reason === reason)!;
    assert.equal(corrected.index.scores.some((entry) => entry.scoreArtifactId === audited.previousScoreArtifactId), false, reason);
    assert.ok(audited.replacementScoreArtifactId, reason);
  }
});

test("FR-015 records explicit retraction and supersession without fetching old scores or forecasts", () => {
  const baseDataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(baseDataset));
  const first = reconcileForecastScores(reconciliationArgs(baseDataset, [forecast]));
  const activeDataset = datasetFor([{ suffix: "a", lifecycle: "active" }]);
  const retractionArgs = reconciliationArgs(activeDataset, [], { previousIndex: first.index });
  assert.deepEqual(forecastArtifactIdsRequiredForReconciliation(retractionArgs), []);
  const retracted = reconcileForecastScores(retractionArgs);
  assert.ok(retracted.index.audit.some((entry) => entry.reason === "outcome-retracted"));
  assert.equal(retracted.index.scores.some((entry) => entry.targetKind === "public-release"), false);
  assert.equal(retracted.index.dataGaps.find((entry) => entry.targetKind === "public-release")?.reason, "outcome-retracted");
  const retractedReplay = reconcileForecastScores(
    reconciliationArgs(activeDataset, [], { previousIndex: retracted.index }),
  );
  assert.equal(retractedReplay.indexArtifactId, retracted.indexArtifactId);
  assert.equal(
    retractedReplay.index.dataGaps.find(
      (entry) => entry.targetKind === "public-release",
    )?.reason,
    "outcome-retracted",
  );
  assert.equal(
    retractedReplay.index.pending.some(
      (entry) => entry.targetKind === "public-release",
    ),
    false,
  );

  const publicOutcomeId = baseDataset.lifecycleOutcomes.find(
    (row) => row.releaseId === releaseId("a"),
  )!.outcomeEvidenceId;
  const missingBindingArgs = reconciliationArgs(baseDataset, [], {
    previousIndex: first.index,
    outcomeInstantBindings: outcomeBindings(baseDataset).filter(
      (binding) => binding.evidenceId !== publicOutcomeId,
    ),
  });
  const missingBindingRetraction = reconcileForecastScores(missingBindingArgs);
  assert.equal(
    missingBindingRetraction.index.dataGaps.find(
      (entry) => entry.targetKind === "public-release",
    )?.reason,
    "outcome-retracted",
  );
  const missingBindingReplay = reconcileForecastScores({
    ...missingBindingArgs,
    previousIndex: missingBindingRetraction.index,
  });
  assert.equal(
    missingBindingReplay.indexArtifactId,
    missingBindingRetraction.indexArtifactId,
  );

  const supersededDataset = datasetFor([{ suffix: "a", lifecycle: "superseded" }]);
  const superseded = reconcileForecastScores(reconciliationArgs(supersededDataset, [], { previousIndex: first.index, outcomeInstantBindings: [] }));
  assert.ok(superseded.index.audit.some((entry) => entry.reason === "outcome-superseded"));
  assert.equal(superseded.index.scores.length, 0);
  const supersededReplay = reconcileForecastScores(
    reconciliationArgs(supersededDataset, [], {
      previousIndex: superseded.index,
      outcomeInstantBindings: [],
    }),
  );
  assert.equal(supersededReplay.indexArtifactId, superseded.indexArtifactId);
  assert.equal(
    supersededReplay.index.dataGaps[0]?.reason,
    "outcome-superseded",
  );
});

test("FR-015 keeps a source-backed next-stage mismatch out of model scores", () => {
  const baseDataset = datasetFor([{ suffix: "a" }]);
  const mismatchDataset = datasetWithMismatchedNextStage(baseDataset, "a");
  const forecast = buildForecastArtifact(forecastDraft(baseDataset));
  const result = reconcileForecastScores(reconciliationArgs(mismatchDataset, [forecast]));
  assert.equal(result.index.scores.some((entry) => entry.targetKind === "next-eligible-prerelease-event"), false);
  assert.equal(result.index.dataGaps.find((entry) => entry.targetKind === "next-eligible-prerelease-event")?.reason, "next-event-stage-mismatch");
});

test("FR-015 closes a next-event target when public release is the terminal endpoint", () => {
  const dataset = datasetFor([{ suffix: "terminal", includeTargetEvent: false }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset, "terminal"));
  const result = reconcileForecastScores(
    reconciliationArgs(dataset, [forecast]),
  );
  assert.equal(
    result.index.pending.some(
      (entry) => entry.targetKind === "next-eligible-prerelease-event",
    ),
    false,
  );
  assert.equal(
    result.index.dataGaps.find(
      (entry) => entry.targetKind === "next-eligible-prerelease-event",
    )?.reason,
    "terminal-or-ineligible-next-event",
  );
});

test("FR-015 bounded epoch rejects duplicate daily runs and persists a rollover stop reason", () => {
  assert.deepEqual(validateForecastShadowEvaluationEpoch(EPOCH), []);
  assert.ok(validateForecastShadowEvaluationEpoch({ ...EPOCH, maxForecastArtifacts: 999 }).length > 0);
  const dataset = datasetFor([{ suffix: "a" }, { suffix: "b" }]);
  const first = buildForecastArtifact(forecastDraft(dataset, "a", { scheduledFor: "2026-08-09" }));
  const retryAsSample = buildForecastArtifact(forecastDraft(dataset, "b", { scheduledFor: "2026-08-09", generatedAt: "2026-08-09T20:01:00.000Z" }));
  assert.throws(() => reconcileForecastScores(reconciliationArgs(dataset, [first, retryAsSample])), ForecastScoringContractError);
  const open = reconcileForecastScores(reconciliationArgs(dataset, [first]));
  const closed = reconcileForecastScores(reconciliationArgs(dataset, [], { previousIndex: open.index, reconciliationCutoffAt: "2026-11-29T19:30:00.000Z" }));
  assert.equal(closed.index.epochStopReason, "epoch-end-reached");
  const late = buildForecastArtifact(forecastDraft(dataset, "b", { scheduledFor: "2026-11-28" }));
  assert.throws(() => reconcileForecastScores(reconciliationArgs(dataset, [late], { previousIndex: closed.index, reconciliationCutoffAt: "2026-11-29T19:30:00.000Z" })), ForecastScoringContractError);
});

class MemoryStorage implements ForecastContractStorage {
  atomicPointerCas = true;
  readonly files = new Map<string, Uint8Array>();
  readonly operations: string[] = [];
  forceMismatch = false;
  async readExact(path: string): Promise<Uint8Array | null> { this.operations.push(`read:${path}`); const bytes = this.files.get(path); return bytes ? bytes.slice() : null; }
  async putImmutable(path: string, bytes: Uint8Array): Promise<ImmutablePutResult> { this.operations.push(`put:${path}`); if (this.files.has(path)) return { status: "exists" }; this.files.set(path, bytes.slice()); return { status: "created" }; }
  async compareAndSwapPointer(path: typeof FORECAST_POINTER_PATH, expected: { fingerprint: string | null; generation: number }, nextBytes: Uint8Array): Promise<AtomicCasResult> {
    this.operations.push("cas");
    const currentBytes = this.files.get(path);
    const current = currentBytes ? JSON.parse(new TextDecoder().decode(currentBytes)) as ForecastPointerV1 : null;
    const observedPreviousFingerprint = current?.pointerFingerprint ?? null;
    const observedPreviousGeneration = current?.generation ?? 0;
    if (this.forceMismatch || observedPreviousFingerprint !== expected.fingerprint || observedPreviousGeneration !== expected.generation) return { status: "mismatch", atomic: true, observedPreviousFingerprint, observedPreviousGeneration };
    this.files.set(path, nextBytes.slice());
    return { status: "applied", atomic: true, observedPreviousFingerprint, observedPreviousGeneration };
  }
}

function preparedStorage(forecast: ReturnType<typeof buildForecastArtifact>): { storage: MemoryStorage; pointer: ForecastPointerV1 } {
  const storage = new MemoryStorage();
  const pointer = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  storage.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(pointer)));
  storage.files.set(forecastArtifactPath(forecast.artifactId), encoder.encode(serializeForecastArtifact(forecast)));
  return { storage, pointer };
}

test("FR-015 commit reads one prior root, avoids historical score reads, and exact replay is a no-op before timestamp rejection", async () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const { storage, pointer } = preparedStorage(forecast);
  const common = { storage, evaluationEpoch: EPOCH, forecastArtifacts: [forecast], sourceDataset: dataset, outcomeInstantBindings: outcomeBindings(dataset) };
  const first = await commitForecastScoreReconciliation({ ...common, previousPointer: pointer, reconciliationCutoffAt: "2026-08-14T19:30:00.000Z", updatedAt: "2026-08-14T19:35:00.000Z" });
  assert.equal(first.committed, true);
  if (!first.committed) return;
  assert.equal(first.changed, true);
  const operationCount = storage.operations.length;
  const retry = await commitForecastScoreReconciliation({ ...common, previousPointer: first.pointer, reconciliationCutoffAt: "2026-08-14T19:30:00.000Z", updatedAt: "2026-08-14T19:30:00.000Z" });
  assert.equal(retry.committed, true);
  if (retry.committed) assert.equal(retry.changed, false);
  assert.equal(storage.operations.slice(operationCount).filter((operation) => operation === "cas").length, 0);

  const beforeIncremental = storage.operations.length;
  const incremental = await commitForecastScoreReconciliation({ storage, evaluationEpoch: EPOCH, forecastArtifacts: [], sourceDataset: dataset, outcomeInstantBindings: outcomeBindings(dataset), previousPointer: first.pointer, reconciliationCutoffAt: "2026-08-14T19:31:00.000Z", updatedAt: "2026-08-14T19:36:00.000Z" });
  assert.equal(incremental.committed, true);
  if (incremental.committed) {
    assert.equal(incremental.changed, false, "an unchanged state does not write a cutoff-only immutable root");
    assert.equal(incremental.reconciliation.index.reconciliationCutoffAt, "2026-08-14T19:30:00.000Z", "the reused root keeps its truthful last persisted cutoff");
  }
  const reads = storage.operations.slice(beforeIncremental).filter((operation) => operation.startsWith("read:"));
  assert.equal(reads.length, 1, "unchanged history requires only the prior content-addressed root read");
  assert.ok(reads.every((operation) => /^read:forecast\/reconciliation\//.test(operation)));
  assert.equal(reads.some((operation) => operation.includes("/scores/") || operation.includes("/artifacts/")), false);
});

test("FR-015 commit fails closed for root corruption, transition forecast loss, and stale CAS", async () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const forecast = buildForecastArtifact(forecastDraft(dataset));
  const prepared = preparedStorage(forecast);
  const common = { evaluationEpoch: EPOCH, forecastArtifacts: [forecast], sourceDataset: dataset, outcomeInstantBindings: outcomeBindings(dataset), reconciliationCutoffAt: "2026-08-14T19:30:00.000Z", updatedAt: "2026-08-14T19:35:00.000Z" };
  const first = await commitForecastScoreReconciliation({ ...common, storage: prepared.storage, previousPointer: prepared.pointer });
  assert.equal(first.committed, true);
  if (!first.committed) return;
  const rootPath = reconciliationRootArtifactPath(first.reconciliation.indexArtifactId);

  const missingRoot = preparedStorage(forecast);
  missingRoot.storage.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(first.pointer)));
  assert.deepEqual(await commitForecastScoreReconciliation({ ...common, storage: missingRoot.storage, previousPointer: first.pointer, forecastArtifacts: [], updatedAt: "2026-08-14T19:36:00.000Z" }), { committed: false, reason: "missing-prior-root" });

  const corruptRoot = preparedStorage(forecast);
  corruptRoot.storage.files.set(FORECAST_POINTER_PATH, encoder.encode(serializeForecastPointer(first.pointer)));
  corruptRoot.storage.files.set(rootPath, encoder.encode("corrupt"));
  assert.deepEqual(await commitForecastScoreReconciliation({ ...common, storage: corruptRoot.storage, previousPointer: first.pointer, forecastArtifacts: [], updatedAt: "2026-08-14T19:36:00.000Z" }), { committed: false, reason: "corrupt-prior-root" });

  const correctedDataset = datasetFor([{ suffix: "a", publicDate: "2026-08-15", publicObservedAt: "2026-08-15T17:00:00.000Z" }], { asOfDate: "2026-08-15" });
  const transitionMissing = new MemoryStorage();
  for (const [path, bytes] of prepared.storage.files) if (path !== forecastArtifactPath(forecast.artifactId)) transitionMissing.files.set(path, bytes.slice());
  assert.deepEqual(await commitForecastScoreReconciliation({ storage: transitionMissing, previousPointer: first.pointer, evaluationEpoch: EPOCH, forecastArtifacts: [], sourceDataset: correctedDataset, outcomeInstantBindings: outcomeBindings(correctedDataset), reconciliationCutoffAt: "2026-08-15T19:30:00.000Z", updatedAt: "2026-08-15T19:35:00.000Z" }), { committed: false, reason: "missing-forecast-artifact" });

  const stale = preparedStorage(forecast);
  stale.storage.forceMismatch = true;
  assert.deepEqual(await commitForecastScoreReconciliation({ ...common, storage: stale.storage, previousPointer: stale.pointer }), { committed: false, reason: "stale-cas" });
});

test("FR-015 health separates operations from statistics and weights unique realized events equally", () => {
  const specs = [...Array.from({ length: FORECAST_HEALTH_MIN_REPORTABLE_SCORES }, (_, index) => ({ suffix: `h${index}` })), { suffix: "gap" }];
  const dataset = datasetFor(specs);
  const forecast = buildForecastArtifact(forecastDraft(dataset, specs.map((spec) => spec.suffix), { includeNext: false }));
  const gapOutcomeId = dataset.lifecycleOutcomes.find((row) => row.releaseId === releaseId("gap"))!.outcomeEvidenceId;
  const bindings = outcomeBindings(dataset).filter((binding) => binding.evidenceId !== gapOutcomeId);
  const reconciliation = reconcileForecastScores(reconciliationArgs(dataset, [forecast], { outcomeInstantBindings: bindings }));
  const scoreMap = new Map(reconciliation.scoreArtifacts.map((record) => [record.artifactId, record.artifact]));
  const report = buildForecastShadowHealthReport({
    index: reconciliation.index,
    scoreArtifacts: scoreMap,
    forecastArtifacts: new Map([[forecast.artifactId, forecast]]),
    reconciliationRootArtifactId: reconciliation.indexArtifactId,
    generatedAt: "2026-08-15T20:00:00.000Z",
    freshnessThresholdHours: 48,
    runFailures: [{ runId: "run-failed-1", failedAt: "2026-08-15T19:00:00.000Z", code: "run-timeout" }],
  });
  assert.equal(report.operations.status, "degraded");
  assert.equal(report.statistics.status, "reportable");
  assert.deepEqual(report.summary, { forecastCount: 9, unavailableBenchmarkCount: 18, scoredCount: 8, pendingCount: 0, dataGapCount: 1, runFailureCount: 1 });
  const overall = report.metrics.find((metric) => metric.targetKind === "public-release" && metric.benchmarkId === "selected-private-model" && metric.groupKind === "overall")!;
  assert.equal(overall.availability, "available");
  assert.equal(overall.realizedEventCount, 8);
  assert.equal(overall.coverage50EventCount, 8);
  assert.equal(overall.coverage80EventCount, 8);
  assert.equal(report.operations.runFailures[0]?.safeSummary, "The private forecast run exceeded its time limit.");
  assert.equal(report.dataGapCounts[0]?.reason, "missing-observation-instant");
  assert.match(renderForecastShadowHealthReport(report), /unique events=8/);
  const text = serializeForecastShadowHealthReport(report);
  assert.deepEqual(parseForecastShadowHealthReport(encoder.encode(text)), report);
  assert.deepEqual(validateForecastShadowHealthReport(report), []);
  const unsafe = { ...report, operations: { ...report.operations, runFailures: [{ ...report.operations.runFailures[0]!, message: "raw secret" }] } };
  assert.ok(validateForecastShadowHealthReport(unsafe).some((issue) => issue.code === "unknown-property"));
  const nonNested = { ...report, metrics: report.metrics.map((metric, index) => index === 0 && metric.availability === "available" ? { ...metric, coverage50: 1, coverage80: 0 } : metric) };
  assert.ok(validateForecastShadowHealthReport(nonNested).some((issue) => issue.path.includes("metrics")));
});

test("FR-015 unique-event reporting prevents repeated daily origins from overweighting one outcome", () => {
  const dataset = datasetFor([{ suffix: "a" }]);
  const dayOne = buildForecastArtifact(forecastDraft(dataset, "a", { scheduledFor: "2026-08-09", includeNext: false }));
  const dayTwo = buildForecastArtifact(forecastDraft(dataset, "a", { scheduledFor: "2026-08-10", includeNext: false }));
  const reconciliation = reconcileForecastScores(reconciliationArgs(dataset, [dayOne, dayTwo]));
  const report = buildForecastShadowHealthReport({ index: reconciliation.index, reconciliationRootArtifactId: reconciliation.indexArtifactId, generatedAt: "2026-08-15T20:00:00.000Z" });
  const overall = report.metrics.find((metric) => metric.groupKind === "overall")!;
  assert.equal(overall.scoredCount, 2);
  assert.equal(overall.realizedEventCount, 1);
  assert.equal(overall.availability, "unavailable");
  assert.equal(report.statistics.status, "insufficient-sample");
});
