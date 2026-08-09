import {
  HISTORICAL_ANALYSIS_DATASET_VERSION,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
} from "./historical-analysis-dataset";

/** A deterministic, offline backtest for the historical-analysis v1 product. */
export const WALK_FORWARD_EVALUATION_VERSION = "walk-forward-evaluation/v1";
export const WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES = 8;

export const WALK_FORWARD_BASELINES = [
  "platform-stage-median",
  "seasonal-median",
] as const;
export type WalkForwardBaseline = (typeof WALK_FORWARD_BASELINES)[number];

export interface WalkForwardEvaluationConfigV1 {
  evaluationVersion: typeof WALK_FORWARD_EVALUATION_VERSION;
  /** Reporting buckets only; they never affect cohort selection or prediction. */
  horizons: readonly {
    id: string;
    minDays: number;
    maxDays?: number;
  }[];
  /** Optional empirical, inclusive 50/80 coverage summaries. */
  includeEmpiricalIntervals?: boolean;
}

export const DEFAULT_WALK_FORWARD_EVALUATION_CONFIG: WalkForwardEvaluationConfigV1 = {
  evaluationVersion: WALK_FORWARD_EVALUATION_VERSION,
  horizons: [
    { id: "0-6", minDays: 0, maxDays: 6 },
    { id: "7-13", minDays: 7, maxDays: 13 },
    { id: "14-27", minDays: 14, maxDays: 27 },
    { id: "28+", minDays: 28 },
  ],
};

type Endpoint =
  | { kind: "event"; id: string; occurredOn: string; firstObservedOn: string; sourceEvidenceIds: readonly string[] }
  | { kind: "lifecycle-outcome"; id: string; occurredOn: string; firstObservedOn: string; sourceEvidenceIds: readonly string[] };

export interface WalkForwardTimingTargetV1 {
  targetId: string;
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  stage: string;
  anchorEventId: string;
  originOn: string;
  endpoint: Endpoint;
  /** Verified elapsed occurrence days; origin is the anchor fact-known day. */
  actualDays: number;
  horizonId: string;
  sourceEvidenceIds: readonly string[];
}

export type WalkForwardExclusionReason =
  | "invalid-or-unavailable-interval"
  | "missing-anchor"
  | "missing-endpoint"
  | "endpoint-not-after-origin"
  | "unknown-horizon";

export interface WalkForwardExclusionLedgerEntryV1 {
  intervalReleaseId: string;
  startEventId: string;
  included: boolean;
  targetId?: string;
  reason?: WalkForwardExclusionReason;
  sourceEvidenceIds: readonly string[];
}

export interface WalkForwardFoldV1 {
  foldId: string;
  heldoutTargetId: string;
  originOn: string;
  /** IDs only: makes the no-future/no-self training cohort auditable. */
  trainingTargetIds: readonly string[];
}

export type WalkForwardPredictionV1 = {
  foldId: string;
  heldoutTargetId: string;
  baseline: WalkForwardBaseline;
  trainingTargetIds: readonly string[];
} & (
  | {
      available: true;
      cohort: "exact-seasonal" | "stage" | "platform-pooled";
      predictionDays: number;
      intervals?: {
        inclusive50: readonly [number, number];
        inclusive80: readonly [number, number];
      };
    }
  | {
      available: false;
      reason: "minimum-training-outcomes";
      cohort: "no-forecast";
    }
);

export interface WalkForwardScoreV1 {
  foldId: string;
  heldoutTargetId: string;
  baseline: WalkForwardBaseline;
  platformId: string;
  productFamilyId: string;
  stage: string;
  horizonId: string;
  actualDays: number;
  predictionDays: number;
  signedErrorDays: number;
  absoluteErrorDays: number;
  /** null means the prediction did not carry empirical intervals. */
  covered50: boolean | null;
  covered80: boolean | null;
}

export type WalkForwardMetricGroup =
  | "overall"
  | "family"
  | "stage"
  | "horizon"
  | "family-stage-horizon";

export interface WalkForwardAggregateMetricV1 {
  baseline: WalkForwardBaseline;
  group: WalkForwardMetricGroup;
  familyId?: string;
  stage?: string;
  horizonId?: string;
  scoreCount: number;
  reportable: boolean;
  reason?: "minimum-score-count";
  maeDays: number | null;
  medianAbsoluteErrorDays: number | null;
  signedBiasDays: number | null;
  /** null when no scored prediction contains the corresponding interval. */
  inclusiveCoverage50: number | null;
  inclusiveCoverage80: number | null;
}

export interface WalkForwardEvaluationFingerprintsV1 {
  sourceDatasetFingerprint: string;
  configFingerprint: string;
  codeFingerprint: string;
  evaluationFingerprint: string;
}

export interface WalkForwardEvaluationV1 {
  evaluationVersion: typeof WALK_FORWARD_EVALUATION_VERSION;
  config: WalkForwardEvaluationConfigV1;
  /** Retained to make standalone artifact validation capable of recomputation. */
  sourceDataset: HistoricalAnalysisDatasetV1;
  targets: readonly WalkForwardTimingTargetV1[];
  exclusionLedger: readonly WalkForwardExclusionLedgerEntryV1[];
  folds: readonly WalkForwardFoldV1[];
  predictions: readonly WalkForwardPredictionV1[];
  scores: readonly WalkForwardScoreV1[];
  aggregateMetrics: readonly WalkForwardAggregateMetricV1[];
  fingerprints: WalkForwardEvaluationFingerprintsV1;
}

export type WalkForwardEvaluationValidationCode =
  | "invalid-input"
  | "unsupported-evaluation-version"
  | "invalid-config"
  | "invalid-source-dataset"
  | "invalid-row"
  | "invalid-fingerprint";

export interface WalkForwardEvaluationValidationIssue {
  code: WalkForwardEvaluationValidationCode;
  path: string;
  message: string;
}

export class WalkForwardEvaluationInputError extends Error {
  constructor(public readonly issues: readonly WalkForwardEvaluationValidationIssue[]) {
    super(`Walk-forward evaluation input is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "WalkForwardEvaluationInputError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function compareText(left: string, right: string): number { return left < right ? -1 : left > right ? 1 : 0; }
function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}
/** Nearest-rank quantile, deliberately deterministic for short cohorts. */
function quantile(values: readonly number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.max(0, Math.ceil(percentile * sorted.length) - 1)]!;
}
function sorted<T>(rows: readonly T[], key: (row: T) => string): T[] { return [...rows].sort((a, b) => compareText(key(a), key(b))); }
function uniqueSorted(values: readonly string[]): string[] { return [...new Set(values)].sort(compareText); }

function normalizeConfig(config: WalkForwardEvaluationConfigV1): WalkForwardEvaluationConfigV1 {
  return {
    evaluationVersion: config.evaluationVersion,
    horizons: sorted(config.horizons.map((horizon) => ({ ...horizon })), (horizon) => `${String(horizon.minDays).padStart(12, "0")}\u0000${horizon.id}`),
    ...(config.includeEmpiricalIntervals ? { includeEmpiricalIntervals: true } : {}),
  };
}

function configIssues(config: unknown): WalkForwardEvaluationValidationIssue[] {
  if (!isRecord(config) || config.evaluationVersion !== WALK_FORWARD_EVALUATION_VERSION || !Array.isArray(config.horizons) || (config.includeEmpiricalIntervals !== undefined && typeof config.includeEmpiricalIntervals !== "boolean")) return [{ code: "invalid-config", path: "config", message: "Config must pin v1 and provide horizons." }];
  const ids = new Set<string>();
  const ranges: { min: number; max?: number }[] = [];
  const issues: WalkForwardEvaluationValidationIssue[] = [];
  for (const [index, horizon] of config.horizons.entries()) {
    if (!isRecord(horizon) || typeof horizon.id !== "string" || !horizon.id.trim() || typeof horizon.minDays !== "number" || !Number.isSafeInteger(horizon.minDays) || horizon.minDays < 0 || (horizon.maxDays !== undefined && (typeof horizon.maxDays !== "number" || !Number.isSafeInteger(horizon.maxDays) || horizon.maxDays < horizon.minDays)) || ids.has(horizon.id)) issues.push({ code: "invalid-config", path: `config.horizons[${index}]`, message: "Horizons require unique IDs and valid non-overlapping integer day ranges." });
    else { ids.add(horizon.id); ranges.push({ min: horizon.minDays, ...(horizon.maxDays === undefined ? {} : { max: horizon.maxDays }) }); }
  }
  const ordered = [...ranges].sort((a, b) => a.min - b.min);
  if (!ordered.length || ordered[0]!.min !== 0 || ordered.some((row, index) => index > 0 && (ordered[index - 1]!.max === undefined || row.min !== ordered[index - 1]!.max! + 1)) || ordered.at(-1)!.max !== undefined) issues.push({ code: "invalid-config", path: "config.horizons", message: "Horizons must partition all non-negative days starting at zero." });
  return issues;
}

function horizonFor(days: number, config: WalkForwardEvaluationConfigV1): string | null {
  return config.horizons.find((horizon) => days >= horizon.minDays && (horizon.maxDays === undefined || days <= horizon.maxDays))?.id ?? null;
}

function targetId(releaseId: string, anchorId: string, endpoint: Endpoint): string {
  return `${releaseId}:interval:${anchorId}:${endpoint.kind}:${endpoint.id}`;
}

function deriveTargets(sourceDataset: HistoricalAnalysisDatasetV1, config: WalkForwardEvaluationConfigV1) {
  const events = new Map(sourceDataset.canonicalEvents.map((event) => [event.eventId, event]));
  const outcomes = new Map(sourceDataset.lifecycleOutcomes.map((outcome) => [outcome.outcomeEvidenceId, outcome]));
  const targets: WalkForwardTimingTargetV1[] = [];
  const exclusionLedger: WalkForwardExclusionLedgerEntryV1[] = [];
  for (const interval of sourceDataset.stageIntervals) {
    const anchor = events.get(interval.startEventId);
    const base = { intervalReleaseId: interval.releaseId, startEventId: interval.startEventId, sourceEvidenceIds: uniqueSorted(interval.sourceEvidenceIds) };
    if (!interval.interval.available) { exclusionLedger.push({ ...base, included: false, reason: "invalid-or-unavailable-interval" }); continue; }
    if (!anchor || anchor.releaseId !== interval.releaseId) { exclusionLedger.push({ ...base, included: false, reason: "missing-anchor" }); continue; }
    let endpoint: Endpoint | null = null;
    if (interval.end?.kind === "event") {
      const event = events.get(interval.end.eventId);
      if (event) endpoint = { kind: "event", id: event.eventId, occurredOn: event.occurredOn, firstObservedOn: event.firstObservedOn, sourceEvidenceIds: uniqueSorted(event.sourceEvidenceIds) };
    } else if (interval.end?.kind === "lifecycle-outcome") {
      const outcome = outcomes.get(interval.end.outcomeEvidenceId);
      if (outcome) endpoint = { kind: "lifecycle-outcome", id: outcome.outcomeEvidenceId, occurredOn: outcome.occurredOn, firstObservedOn: outcome.firstObservedOn, sourceEvidenceIds: uniqueSorted(outcome.sourceEvidenceIds) };
    }
    if (!endpoint) { exclusionLedger.push({ ...base, included: false, reason: "missing-endpoint" }); continue; }
    if (endpoint.firstObservedOn <= anchor.firstObservedOn) { exclusionLedger.push({ ...base, included: false, reason: "endpoint-not-after-origin" }); continue; }
    const horizonId = horizonFor(interval.interval.days, config);
    if (!horizonId) { exclusionLedger.push({ ...base, included: false, reason: "unknown-horizon" }); continue; }
    const id = targetId(interval.releaseId, anchor.eventId, endpoint);
    targets.push({ targetId: id, releaseId: interval.releaseId, platformId: anchor.platformId, productFamilyId: anchor.productFamilyId, stage: anchor.stage, anchorEventId: anchor.eventId, originOn: anchor.firstObservedOn, endpoint, actualDays: interval.interval.days, horizonId, sourceEvidenceIds: uniqueSorted([...interval.sourceEvidenceIds, ...anchor.sourceEvidenceIds, ...endpoint.sourceEvidenceIds]) });
    exclusionLedger.push({ ...base, included: true, targetId: id });
  }
  return { targets: sorted(targets, (target) => target.targetId), exclusionLedger: sorted(exclusionLedger, (row) => `${row.intervalReleaseId}\u0000${row.startEventId}`) };
}

function eligibleTrainingTargets(heldout: WalkForwardTimingTargetV1, targets: readonly WalkForwardTimingTargetV1[]): WalkForwardTimingTargetV1[] {
  return targets.filter((target) => target.targetId !== heldout.targetId && target.originOn <= heldout.originOn && target.endpoint.occurredOn <= heldout.originOn && target.endpoint.firstObservedOn <= heldout.originOn);
}

function cohortFor(baseline: WalkForwardBaseline, heldout: WalkForwardTimingTargetV1, training: readonly WalkForwardTimingTargetV1[]) {
  const platform = training.filter((target) => target.platformId === heldout.platformId);
  const stage = platform.filter((target) => target.stage === heldout.stage);
  if (baseline === "platform-stage-median") return { name: "stage" as const, targets: stage };
  const exactSeasonal = stage.filter((target) => target.originOn.slice(5, 7) === heldout.originOn.slice(5, 7));
  if (exactSeasonal.length >= WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES) return { name: "exact-seasonal" as const, targets: exactSeasonal };
  if (stage.length >= WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES) return { name: "stage" as const, targets: stage };
  return { name: "platform-pooled" as const, targets: platform };
}

function predictionFor(fold: WalkForwardFoldV1, heldout: WalkForwardTimingTargetV1, training: readonly WalkForwardTimingTargetV1[], baseline: WalkForwardBaseline, includeIntervals: boolean): WalkForwardPredictionV1 {
  const cohort = cohortFor(baseline, heldout, training);
  const ids = sorted(cohort.targets, (target) => target.targetId).map((target) => target.targetId);
  if (cohort.targets.length < WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES) return { foldId: fold.foldId, heldoutTargetId: heldout.targetId, baseline, trainingTargetIds: ids, available: false, reason: "minimum-training-outcomes", cohort: "no-forecast" };
  const outcomes = cohort.targets.map((target) => target.actualDays);
  return {
    foldId: fold.foldId, heldoutTargetId: heldout.targetId, baseline, trainingTargetIds: ids, available: true, cohort: cohort.name, predictionDays: median(outcomes),
    ...(includeIntervals ? { intervals: { inclusive50: [quantile(outcomes, 0.25), quantile(outcomes, 0.75)] as const, inclusive80: [quantile(outcomes, 0.1), quantile(outcomes, 0.9)] as const } } : {}),
  };
}

function metricFor(baseline: WalkForwardBaseline, group: WalkForwardMetricGroup, scores: readonly WalkForwardScoreV1[], dimensions: Pick<WalkForwardAggregateMetricV1, "familyId" | "stage" | "horizonId">): WalkForwardAggregateMetricV1 {
  const reportable = scores.length >= WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES;
  const coverage = (field: "covered50" | "covered80"): number | null => {
    const available = scores.map((score) => score[field]).filter((value): value is boolean => value !== null);
    return available.length ? available.filter(Boolean).length / available.length : null;
  };
  return { baseline, group, ...dimensions, scoreCount: scores.length, reportable, ...(reportable ? {} : { reason: "minimum-score-count" as const }), maeDays: reportable ? scores.reduce((sum, score) => sum + score.absoluteErrorDays, 0) / scores.length : null, medianAbsoluteErrorDays: reportable ? median(scores.map((score) => score.absoluteErrorDays)) : null, signedBiasDays: reportable ? scores.reduce((sum, score) => sum + score.signedErrorDays, 0) / scores.length : null, inclusiveCoverage50: reportable ? coverage("covered50") : null, inclusiveCoverage80: reportable ? coverage("covered80") : null };
}

function aggregate(scores: readonly WalkForwardScoreV1[]): WalkForwardAggregateMetricV1[] {
  const metrics: WalkForwardAggregateMetricV1[] = [];
  for (const baseline of WALK_FORWARD_BASELINES) {
    const baselineScores = scores.filter((score) => score.baseline === baseline);
    metrics.push(metricFor(baseline, "overall", baselineScores, {}));
    for (const familyId of uniqueSorted(baselineScores.map((score) => score.productFamilyId))) metrics.push(metricFor(baseline, "family", baselineScores.filter((score) => score.productFamilyId === familyId), { familyId }));
    for (const stage of uniqueSorted(baselineScores.map((score) => score.stage))) metrics.push(metricFor(baseline, "stage", baselineScores.filter((score) => score.stage === stage), { stage }));
    for (const horizonId of uniqueSorted(baselineScores.map((score) => score.horizonId))) metrics.push(metricFor(baseline, "horizon", baselineScores.filter((score) => score.horizonId === horizonId), { horizonId }));
    for (const key of uniqueSorted(baselineScores.map((score) => `${score.productFamilyId}\u0000${score.stage}\u0000${score.horizonId}`))) {
      const [familyId, stage, horizonId] = key.split("\u0000");
      metrics.push(metricFor(baseline, "family-stage-horizon", baselineScores.filter((score) => score.productFamilyId === familyId && score.stage === stage && score.horizonId === horizonId), { familyId, stage, horizonId }));
    }
  }
  return sorted(metrics, (metric) => `${metric.baseline}\u0000${metric.group}\u0000${metric.familyId ?? ""}\u0000${metric.stage ?? ""}\u0000${metric.horizonId ?? ""}`);
}

function deriveCore(sourceDataset: HistoricalAnalysisDatasetV1, config: WalkForwardEvaluationConfigV1) {
  const { targets, exclusionLedger } = deriveTargets(sourceDataset, config);
  const folds = targets.map((target) => ({ foldId: `fold:${target.targetId}`, heldoutTargetId: target.targetId, originOn: target.originOn, trainingTargetIds: sorted(eligibleTrainingTargets(target, targets), (entry) => entry.targetId).map((entry) => entry.targetId) }));
  const predictions: WalkForwardPredictionV1[] = [];
  for (const fold of folds) {
    const heldout = targets.find((target) => target.targetId === fold.heldoutTargetId)!;
    const training = eligibleTrainingTargets(heldout, targets);
    for (const baseline of WALK_FORWARD_BASELINES) predictions.push(predictionFor(fold, heldout, training, baseline, config.includeEmpiricalIntervals === true));
  }
  const scores: WalkForwardScoreV1[] = sorted(predictions.filter((prediction): prediction is Extract<WalkForwardPredictionV1, { available: true }> => prediction.available).map((prediction) => {
    const target = targets.find((candidate) => candidate.targetId === prediction.heldoutTargetId)!;
    const covered = (interval: readonly [number, number]) => target.actualDays >= interval[0] && target.actualDays <= interval[1];
    return { foldId: prediction.foldId, heldoutTargetId: target.targetId, baseline: prediction.baseline, platformId: target.platformId, productFamilyId: target.productFamilyId, stage: target.stage, horizonId: target.horizonId, actualDays: target.actualDays, predictionDays: prediction.predictionDays, signedErrorDays: prediction.predictionDays - target.actualDays, absoluteErrorDays: Math.abs(prediction.predictionDays - target.actualDays), covered50: prediction.intervals ? covered(prediction.intervals.inclusive50) : null, covered80: prediction.intervals ? covered(prediction.intervals.inclusive80) : null };
  }), (score) => `${score.baseline}\u0000${score.foldId}`);
  return { evaluationVersion: WALK_FORWARD_EVALUATION_VERSION, config: normalizeConfig(config), sourceDataset, targets, exclusionLedger, folds: sorted(folds, (fold) => fold.foldId), predictions: sorted(predictions, (prediction) => `${prediction.baseline}\u0000${prediction.foldId}`), scores, aggregateMetrics: aggregate(scores) } as const;
}

const CODE_MANIFEST = { algorithm: "walk-forward-v1;known-at-origin;platform-only;median;nearest-rank-intervals", historicalDatasetVersion: HISTORICAL_ANALYSIS_DATASET_VERSION, evaluationVersion: WALK_FORWARD_EVALUATION_VERSION, minimumTrainingOutcomes: WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES } as const;
export const WALK_FORWARD_EVALUATION_CODE_FINGERPRINT = historicalAnalysisFingerprint(CODE_MANIFEST);

/** Build a deterministic artifact; it uses neither a clock, network, nor randomness. */
export function buildWalkForwardEvaluation(sourceDataset: HistoricalAnalysisDatasetV1, config: WalkForwardEvaluationConfigV1 = DEFAULT_WALK_FORWARD_EVALUATION_CONFIG): WalkForwardEvaluationV1 {
  const issues = [
    ...validateHistoricalAnalysisDataset(sourceDataset).map((issue) => ({ code: "invalid-source-dataset" as const, path: `sourceDataset.${issue.path}`, message: issue.message })),
    ...configIssues(config),
  ];
  if (issues.length) throw new WalkForwardEvaluationInputError(issues);
  const normalized = normalizeConfig(config);
  const core = deriveCore(sourceDataset, normalized);
  const sourceDatasetFingerprint = sourceDataset.fingerprints.datasetFingerprint;
  const configFingerprint = historicalAnalysisFingerprint(normalized);
  const codeFingerprint = WALK_FORWARD_EVALUATION_CODE_FINGERPRINT;
  const fingerprints = { sourceDatasetFingerprint, configFingerprint, codeFingerprint, evaluationFingerprint: historicalAnalysisFingerprint({ core, sourceDatasetFingerprint, configFingerprint, codeFingerprint }) };
  const result = { ...core, fingerprints };
  const outputIssues = validateWalkForwardEvaluation(result);
  if (outputIssues.length) throw new WalkForwardEvaluationInputError(outputIssues);
  return result;
}

/** Strict, no-throw validation for an exported standalone evaluation artifact. */
export function validateWalkForwardEvaluation(value: unknown): WalkForwardEvaluationValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "evaluation", message: "Evaluation must be an object." }];
    const issues: WalkForwardEvaluationValidationIssue[] = [];
    if (value.evaluationVersion !== WALK_FORWARD_EVALUATION_VERSION) issues.push({ code: "unsupported-evaluation-version", path: "evaluationVersion", message: `Expected ${WALK_FORWARD_EVALUATION_VERSION}.` });
    issues.push(...configIssues(value.config));
    if (!isRecord(value.sourceDataset)) issues.push({ code: "invalid-source-dataset", path: "sourceDataset", message: "A historical-analysis dataset is required." });
    else for (const issue of validateHistoricalAnalysisDataset(value.sourceDataset)) issues.push({ code: "invalid-source-dataset", path: `sourceDataset.${issue.path}`, message: issue.message });
    const rows = ["targets", "exclusionLedger", "folds", "predictions", "scores", "aggregateMetrics"] as const;
    for (const row of rows) if (!Array.isArray(value[row])) issues.push({ code: "invalid-row", path: row, message: `${row} must be an array.` });
    if (!isRecord(value.fingerprints)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Fingerprints are required." });
    if (issues.length) return issues;
    const fingerprints = value.fingerprints as Record<string, unknown>;
    if (fingerprints.sourceDatasetFingerprint !== (value.sourceDataset as HistoricalAnalysisDatasetV1).fingerprints.datasetFingerprint || typeof fingerprints.configFingerprint !== "string" || !SHA_256.test(fingerprints.configFingerprint) || fingerprints.configFingerprint !== historicalAnalysisFingerprint(normalizeConfig(value.config as WalkForwardEvaluationConfigV1)) || fingerprints.codeFingerprint !== WALK_FORWARD_EVALUATION_CODE_FINGERPRINT || typeof fingerprints.evaluationFingerprint !== "string" || !SHA_256.test(fingerprints.evaluationFingerprint)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Source, config, code, or evaluation fingerprints are invalid." });
    const core = deriveCore(value.sourceDataset as HistoricalAnalysisDatasetV1, normalizeConfig(value.config as WalkForwardEvaluationConfigV1));
    for (const field of ["evaluationVersion", "config", "sourceDataset", "targets", "exclusionLedger", "folds", "predictions", "scores", "aggregateMetrics"] as const) if (stableSerializeHistoricalAnalysis(value[field]) !== stableSerializeHistoricalAnalysis(core[field])) issues.push({ code: "invalid-row", path: field, message: "Evaluation rows do not match deterministic walk-forward semantics." });
    if (fingerprints.evaluationFingerprint !== historicalAnalysisFingerprint({ core, sourceDatasetFingerprint: fingerprints.sourceDatasetFingerprint, configFingerprint: fingerprints.configFingerprint, codeFingerprint: fingerprints.codeFingerprint })) issues.push({ code: "invalid-fingerprint", path: "fingerprints.evaluationFingerprint", message: "Evaluation fingerprint does not bind source, config, code, and output." });
    return issues;
  } catch {
    return [{ code: "invalid-input", path: "evaluation", message: "Evaluation could not be validated safely." }];
  }
}
