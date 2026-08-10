import {
  RELEASE_DATE_CANDIDATES_VERSION,
  predictReleaseDateForAnchor,
  validateReleaseDateCandidates,
  type ReleaseDateCandidatePredictionV1,
  type ReleaseDateCandidatesV1,
  type ReleaseDateForecastV1,
  type ReleaseDateTargetV1,
} from "./release-date-candidates";
import {
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
} from "./historical-analysis-dataset";

/** A pure, downstream conformal-style calibration of FR-009 point forecasts. */
export const RELEASE_DATE_INTERVAL_CALIBRATION_VERSION = "release-date-interval-calibration/v1";
export const RELEASE_DATE_INTERVAL_LEVELS = [0.5, 0.8] as const;
export const RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS = 8;
export const RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE = "outward-floor-half-up-ceil/v1";

export interface ReleaseDateIntervalCalibrationConfigV1 {
  calibrationVersion: typeof RELEASE_DATE_INTERVAL_CALIBRATION_VERSION;
  levels: readonly [0.5, 0.8];
  minimumResiduals: typeof RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS;
  dateRoundingRule: typeof RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE;
}

export const DEFAULT_RELEASE_DATE_INTERVAL_CALIBRATION_CONFIG: ReleaseDateIntervalCalibrationConfigV1 = {
  calibrationVersion: RELEASE_DATE_INTERVAL_CALIBRATION_VERSION,
  levels: RELEASE_DATE_INTERVAL_LEVELS,
  minimumResiduals: RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS,
  dateRoundingRule: RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE,
};

type SelectedPrediction = Extract<ReleaseDateCandidatePredictionV1, { available: true }>;
export type ReleaseDateResidualExclusionReason =
  | "target-never-residual"
  | "inner-origin-not-before-outer-origin"
  | "inner-outcome-not-visible-at-outer-origin"
  | "inner-self-trained"
  | "foreign-platform"
  | "selected-candidate-mismatch";

export interface ReleaseDateCalibrationResidualV1 {
  residualId: string;
  innerFoldId: string;
  innerTargetId: string;
  targetKind: "public-release";
  platformId: string;
  productFamilyId: string;
  releaseClass: ReleaseDateTargetV1["releaseClass"];
  releasePosition: number;
  stage: string;
  candidateId: string;
  cohortPathId: string;
  innerOriginOn: string;
  outcomeFirstObservedOn: string;
  pointDays: number;
  actualDays: number;
  residualDays: number;
}

export type ReleaseDateResidualLedgerEntryV1 =
  | ({ outerFoldId: string; included: true; poolMembership: "exact" | "platform" } & ReleaseDateCalibrationResidualV1)
  | {
      outerFoldId: string;
      innerFoldId: string;
      innerTargetId: string;
      included: false;
      reason: ReleaseDateResidualExclusionReason;
    };

export interface ReleaseDateResidualPoolV1 {
  exactCount: number;
  platformCount: number;
  selectedPool: "exact" | "platform-fallback" | "unavailable";
  selectedResiduals: readonly ReleaseDateCalibrationResidualV1[];
}

export type ReleaseDateCalibratedIntervalV1 =
  | {
      level: 0.5 | 0.8;
      available: true;
      residualCount: number;
      rank: number;
      quantileResidualDays: number;
      lowerDays: number;
      pointDays: number;
      upperDays: number;
      calendarDates: { lower: string; point: string; upper: string; roundingRule: typeof RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE };
    }
  | {
      level: 0.5 | 0.8;
      available: false;
      reason: "minimum-residuals";
      residualCount: number;
    };

export interface ReleaseDateCalibratedFoldV1 {
  foldId: string;
  targetId: string;
  targetKind: "public-release";
  platformId: string;
  productFamilyId: string;
  releaseClass: ReleaseDateTargetV1["releaseClass"];
  releasePosition: number;
  stage: string;
  horizonBucket: ReleaseDateHorizonBucket;
  originOn: string;
  anchorOccurredOn: string;
  outcomeFirstObservedOn: string;
  actualDays: number;
  candidateId: string;
  cohortPathId: string;
  pointDays: number;
  pointPublicReleaseDate: string;
  residualPool: ReleaseDateResidualPoolV1;
  intervals: readonly ReleaseDateCalibratedIntervalV1[];
}

export interface ReleaseDateIntervalScoreV1 {
  scoreId: string;
  foldId: string;
  targetId: string;
  targetKind: "public-release";
  level: 0.5 | 0.8;
  platformId: string;
  productFamilyId: string;
  stage: string;
  horizonBucket: ReleaseDateHorizonBucket;
  actualDays: number;
  pointDays: number;
  lowerDays: number;
  upperDays: number;
  covered: boolean;
  widthDays: number;
  pointSignedErrorDays: number;
  pointAbsoluteErrorDays: number;
}

export type ReleaseDateHorizonBucket = "0-14" | "15-30" | "31-60" | "61+";
export type ReleaseDateIntervalMetricV1 =
  | {
      level: 0.5 | 0.8;
      scoreCount: number;
      reportable: true;
      coverage: number;
      meanWidthDays: number;
      medianWidthDays: number;
      pointMaeDays: number;
      pointMedianAbsoluteErrorDays: number;
      pointBiasDays: number;
    }
  | {
      level: 0.5 | 0.8;
      scoreCount: number;
      reportable: false;
      reason: "minimum-score-count";
      coverage: null;
      meanWidthDays: null;
      medianWidthDays: null;
      pointMaeDays: null;
      pointMedianAbsoluteErrorDays: null;
      pointBiasDays: null;
    };

export interface ReleaseDateIntervalMetricGroupV1 {
  groupId: string;
  metrics: readonly ReleaseDateIntervalMetricV1[];
}

export interface ReleaseDateIntervalMetricsV1 {
  overall: readonly ReleaseDateIntervalMetricV1[];
  platform: readonly ReleaseDateIntervalMetricGroupV1[];
  productFamily: readonly ReleaseDateIntervalMetricGroupV1[];
  stage: readonly ReleaseDateIntervalMetricGroupV1[];
  horizon: readonly ReleaseDateIntervalMetricGroupV1[];
}

export interface ReleaseDateIntervalCalibrationFingerprintsV1 {
  sourceDatasetFingerprint: string;
  upstreamCandidatesFingerprint: string;
  configFingerprint: string;
  codeFingerprint: string;
  resultFingerprint: string;
}

export interface ReleaseDateIntervalCalibrationV1 {
  calibrationVersion: typeof RELEASE_DATE_INTERVAL_CALIBRATION_VERSION;
  config: ReleaseDateIntervalCalibrationConfigV1;
  /** The exact, fully validated FR-009 artifact consumed by this module. */
  candidates: ReleaseDateCandidatesV1;
  calibratedFolds: readonly ReleaseDateCalibratedFoldV1[];
  residualLedger: readonly ReleaseDateResidualLedgerEntryV1[];
  intervalScores: readonly ReleaseDateIntervalScoreV1[];
  metrics: ReleaseDateIntervalMetricsV1;
  fingerprints: ReleaseDateIntervalCalibrationFingerprintsV1;
}

export type ReleaseDateIntervalCalibrationValidationCode =
  | "invalid-input" | "unsupported-version" | "invalid-config" | "invalid-upstream" | "invalid-row" | "invalid-fingerprint";
export interface ReleaseDateIntervalCalibrationValidationIssue {
  code: ReleaseDateIntervalCalibrationValidationCode;
  path: string;
  message: string;
}
export class ReleaseDateIntervalCalibrationInputError extends Error {
  constructor(public readonly issues: readonly ReleaseDateIntervalCalibrationValidationIssue[]) {
    super(`Release-date interval calibration input is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "ReleaseDateIntervalCalibrationInputError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function textOrder(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function sorted<T>(rows: readonly T[], key: (row: T) => string): T[] { return [...rows].sort((a, b) => textOrder(key(a), key(b))); }
function median(values: readonly number[]): number { const rows = [...values].sort((a, b) => a - b); const middle = Math.floor(rows.length / 2); return rows.length % 2 ? rows[middle]! : (rows[middle - 1]! + rows[middle]!) / 2; }
function dayNumber(value: string): number { const [year, month, day] = value.split("-").map(Number); return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000); }
function addDays(value: string, days: number): string { return new Date((dayNumber(value) + days) * 86_400_000).toISOString().slice(0, 10); }
function horizonBucket(pointDays: number): ReleaseDateHorizonBucket { return pointDays <= 14 ? "0-14" : pointDays <= 30 ? "15-30" : pointDays <= 60 ? "31-60" : "61+"; }
function sortResiduals(rows: readonly ReleaseDateCalibrationResidualV1[]): ReleaseDateCalibrationResidualV1[] { return [...rows].sort((left, right) => left.residualDays - right.residualDays || textOrder(left.residualId, right.residualId)); }

function configIssues(value: unknown): ReleaseDateIntervalCalibrationValidationIssue[] {
  if (!isRecord(value) || value.calibrationVersion !== RELEASE_DATE_INTERVAL_CALIBRATION_VERSION || !Array.isArray(value.levels) || value.levels.length !== 2 || value.levels[0] !== 0.5 || value.levels[1] !== 0.8 || value.minimumResiduals !== RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS || value.dateRoundingRule !== RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE) return [{ code: "invalid-config", path: "config", message: "Config must use exactly v1 levels [0.5, 0.8], minimum 8, and outward date rounding." }];
  return [];
}

export type ReleaseDateCohortConditioningV1 = Pick<ReleaseDateTargetV1, "platformId" | "stage" | "productFamilyId" | "releaseClass" | "releasePosition">;

/** Stable selected-model identity, including every held-out value a matched hierarchical tier conditioned on. */
export function releaseDateResolvedCohortPathId(prediction: SelectedPrediction, conditioning: ReleaseDateCohortConditioningV1): string {
  const explanation = prediction.explanation;
  if (prediction.candidateId === "platform-stage-median") return stableSerializeHistoricalAnalysis({ candidateId: prediction.candidateId, cohort: explanation.cohort });
  const tiers = explanation.tiers ?? [];
  return stableSerializeHistoricalAnalysis({
    candidateId: prediction.candidateId,
    cohort: explanation.cohort,
    tiers: tiers.map((tier) => {
      if (tier.fallback) return { tier: tier.tier, resolution: "fallback" };
      if (tier.tier === "platform-stage") return { tier: tier.tier, resolution: "matched", platformId: conditioning.platformId, stage: conditioning.stage };
      if (tier.tier === "product-family") return { tier: tier.tier, resolution: "matched", value: conditioning.productFamilyId };
      if (tier.tier === "release-class") return { tier: tier.tier, resolution: "matched", value: conditioning.releaseClass };
      return { tier: tier.tier, resolution: "matched", value: conditioning.releasePosition };
    }),
  });
}

interface SelectedHistorical { forecast: ReleaseDateForecastV1; target: ReleaseDateTargetV1; prediction: SelectedPrediction; cohortPathId: string; residual: ReleaseDateCalibrationResidualV1; }
function selectedHistorical(candidates: ReleaseDateCandidatesV1): SelectedHistorical[] {
  const targets = new Map(candidates.targets.map((target) => [target.targetId, target]));
  const output: SelectedHistorical[] = [];
  for (const forecast of candidates.forecasts) {
    if (!forecast.selection.available || !forecast.resolved) continue;
    const selectedCandidateId = forecast.selection.selectedCandidateId;
    const target = targets.get(forecast.fold.heldoutTargetId);
    const prediction = forecast.candidates.find((row): row is SelectedPrediction => row.candidateId === selectedCandidateId && row.available);
    if (!target || !prediction || prediction.pointDays !== forecast.resolved.pointDays) continue;
    const cohortPathId = releaseDateResolvedCohortPathId(prediction, target);
    output.push({ forecast, target, prediction, cohortPathId, residual: {
      residualId: `residual:${forecast.fold.foldId}:${prediction.candidateId}`,
      innerFoldId: forecast.fold.foldId,
      innerTargetId: target.targetId,
      targetKind: "public-release",
      platformId: target.platformId,
      productFamilyId: target.productFamilyId,
      releaseClass: target.releaseClass,
      releasePosition: target.releasePosition,
      stage: target.stage,
      candidateId: prediction.candidateId,
      cohortPathId,
      innerOriginOn: forecast.fold.originOn,
      outcomeFirstObservedOn: target.publicFirstObservedOn,
      pointDays: prediction.pointDays,
      actualDays: target.actualDays,
      residualDays: Math.abs(target.actualDays - prediction.pointDays),
    } });
  }
  return sorted(output, (row) => row.forecast.fold.foldId);
}

function classifyResidual(outer: SelectedHistorical, inner: SelectedHistorical): ReleaseDateResidualExclusionReason | null {
  if (inner.target.targetId === outer.target.targetId) return "target-never-residual";
  if (inner.forecast.fold.originOn >= outer.forecast.fold.originOn) return "inner-origin-not-before-outer-origin";
  if (inner.target.publicFirstObservedOn > outer.forecast.fold.originOn) return "inner-outcome-not-visible-at-outer-origin";
  if (inner.prediction.trainingTargetIds.includes(inner.target.targetId)) return "inner-self-trained";
  if (inner.target.platformId !== outer.target.platformId) return "foreign-platform";
  if (inner.prediction.candidateId !== outer.prediction.candidateId) return "selected-candidate-mismatch";
  return null;
}

function residualRowsFor(outer: SelectedHistorical, selected: readonly SelectedHistorical[]) {
  const ledger: ReleaseDateResidualLedgerEntryV1[] = [];
  const poolable: ReleaseDateCalibrationResidualV1[] = [];
  for (const inner of selected) {
    const reason = classifyResidual(outer, inner);
    if (reason) { ledger.push({ outerFoldId: outer.forecast.fold.foldId, innerFoldId: inner.forecast.fold.foldId, innerTargetId: inner.target.targetId, included: false, reason }); continue; }
    const membership = inner.target.stage === outer.target.stage && inner.cohortPathId === outer.cohortPathId ? "exact" : "platform";
    ledger.push({ outerFoldId: outer.forecast.fold.foldId, ...inner.residual, included: true, poolMembership: membership });
    poolable.push(inner.residual);
  }
  const exact = sortResiduals(poolable.filter((row) => row.stage === outer.target.stage && row.cohortPathId === outer.cohortPathId));
  const platform = sortResiduals(poolable);
  const selectedPool: ReleaseDateResidualPoolV1["selectedPool"] = exact.length >= RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS ? "exact" : platform.length >= RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS ? "platform-fallback" : "unavailable";
  return { ledger, exact, platform, selectedPool };
}

function interval(anchorOccurredOn: string, pointDays: number, level: 0.5 | 0.8, selectedResiduals: readonly ReleaseDateCalibrationResidualV1[]): ReleaseDateCalibratedIntervalV1 {
  if (selectedResiduals.length < RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS) return { level, available: false, reason: "minimum-residuals", residualCount: selectedResiduals.length };
  const rank = Math.min(selectedResiduals.length, Math.max(1, Math.ceil(level * (selectedResiduals.length + 1))));
  const quantileResidualDays = selectedResiduals[rank - 1]!.residualDays;
  const lowerDays = pointDays - quantileResidualDays;
  const upperDays = pointDays + quantileResidualDays;
  return { level, available: true, residualCount: selectedResiduals.length, rank, quantileResidualDays, lowerDays, pointDays, upperDays, calendarDates: {
    lower: addDays(anchorOccurredOn, Math.floor(lowerDays)),
    point: addDays(anchorOccurredOn, Math.floor(pointDays + 0.5)),
    upper: addDays(anchorOccurredOn, Math.ceil(upperDays)),
    roundingRule: RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE,
  } };
}

function metric(level: 0.5 | 0.8, scores: readonly ReleaseDateIntervalScoreV1[]): ReleaseDateIntervalMetricV1 {
  if (scores.length < RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS) return { level, scoreCount: scores.length, reportable: false, reason: "minimum-score-count", coverage: null, meanWidthDays: null, medianWidthDays: null, pointMaeDays: null, pointMedianAbsoluteErrorDays: null, pointBiasDays: null };
  return { level, scoreCount: scores.length, reportable: true, coverage: scores.filter((score) => score.covered).length / scores.length, meanWidthDays: scores.reduce((sum, score) => sum + score.widthDays, 0) / scores.length, medianWidthDays: median(scores.map((score) => score.widthDays)), pointMaeDays: scores.reduce((sum, score) => sum + score.pointAbsoluteErrorDays, 0) / scores.length, pointMedianAbsoluteErrorDays: median(scores.map((score) => score.pointAbsoluteErrorDays)), pointBiasDays: scores.reduce((sum, score) => sum + score.pointSignedErrorDays, 0) / scores.length };
}
function metricsFor(scores: readonly ReleaseDateIntervalScoreV1[]): readonly ReleaseDateIntervalMetricV1[] { return RELEASE_DATE_INTERVAL_LEVELS.map((level) => metric(level, scores.filter((score) => score.level === level))); }
function groupedMetrics(scores: readonly ReleaseDateIntervalScoreV1[], ids: readonly string[], key: (score: ReleaseDateIntervalScoreV1) => string): ReleaseDateIntervalMetricGroupV1[] {
  return ids.map((groupId) => ({ groupId, metrics: metricsFor(scores.filter((score) => key(score) === groupId)) }));
}

function deriveCore(candidates: ReleaseDateCandidatesV1, config: ReleaseDateIntervalCalibrationConfigV1) {
  const selected = selectedHistorical(candidates);
  const residualLedger: ReleaseDateResidualLedgerEntryV1[] = [];
  const calibratedFolds: ReleaseDateCalibratedFoldV1[] = [];
  const intervalScores: ReleaseDateIntervalScoreV1[] = [];
  for (const outer of selected) {
    const pools = residualRowsFor(outer, selected);
    residualLedger.push(...pools.ledger);
    const selectedResiduals = pools.selectedPool === "exact" ? pools.exact : pools.selectedPool === "platform-fallback" ? pools.platform : [];
    const intervals = RELEASE_DATE_INTERVAL_LEVELS.map((level) => interval(outer.target.anchorOccurredOn, outer.prediction.pointDays, level, selectedResiduals));
    const fold: ReleaseDateCalibratedFoldV1 = { foldId: outer.forecast.fold.foldId, targetId: outer.target.targetId, targetKind: "public-release", platformId: outer.target.platformId, productFamilyId: outer.target.productFamilyId, releaseClass: outer.target.releaseClass, releasePosition: outer.target.releasePosition, stage: outer.target.stage, horizonBucket: horizonBucket(outer.prediction.pointDays), originOn: outer.forecast.fold.originOn, anchorOccurredOn: outer.target.anchorOccurredOn, outcomeFirstObservedOn: outer.target.publicFirstObservedOn, actualDays: outer.target.actualDays, candidateId: outer.prediction.candidateId, cohortPathId: outer.cohortPathId, pointDays: outer.prediction.pointDays, pointPublicReleaseDate: outer.forecast.resolved!.publicReleaseDate, residualPool: { exactCount: pools.exact.length, platformCount: pools.platform.length, selectedPool: pools.selectedPool, selectedResiduals }, intervals };
    calibratedFolds.push(fold);
    for (const current of intervals) if (current.available) intervalScores.push({ scoreId: `score:${fold.foldId}:${current.level}`, foldId: fold.foldId, targetId: fold.targetId, targetKind: "public-release", level: current.level, platformId: fold.platformId, productFamilyId: fold.productFamilyId, stage: fold.stage, horizonBucket: fold.horizonBucket, actualDays: fold.actualDays, pointDays: fold.pointDays, lowerDays: current.lowerDays, upperDays: current.upperDays, covered: fold.actualDays >= current.lowerDays && fold.actualDays <= current.upperDays, widthDays: current.upperDays - current.lowerDays, pointSignedErrorDays: fold.pointDays - fold.actualDays, pointAbsoluteErrorDays: Math.abs(fold.pointDays - fold.actualDays) });
  }
  const orderedScores = sorted(intervalScores, (score) => score.scoreId);
  const orderedFolds = sorted(calibratedFolds, (fold) => fold.foldId);
  return { calibrationVersion: RELEASE_DATE_INTERVAL_CALIBRATION_VERSION, config, candidates, calibratedFolds: orderedFolds, residualLedger: sorted(residualLedger, (row) => `${row.outerFoldId}\u0000${row.innerFoldId}`), intervalScores: orderedScores, metrics: { overall: metricsFor(orderedScores), platform: groupedMetrics(orderedScores, [...new Set(orderedFolds.map((fold) => fold.platformId))].sort(textOrder), (score) => score.platformId), productFamily: groupedMetrics(orderedScores, [...new Set(orderedFolds.map((fold) => fold.productFamilyId))].sort(textOrder), (score) => score.productFamilyId), stage: groupedMetrics(orderedScores, [...new Set(orderedFolds.map((fold) => fold.stage))].sort(textOrder), (score) => score.stage), horizon: groupedMetrics(orderedScores, [...new Set(orderedFolds.map((fold) => fold.horizonBucket))].sort(textOrder), (score) => score.horizonBucket) } } as const;
}

const CODE_MANIFEST = { algorithm: "release-date-interval-calibration-v1;strict-inner-walk-forward;selected-fr009-only;platform-only;exact-stage-candidate-resolved-heldout-cohort-values-then-platform-candidate;absolute-finite-residual;levels-50-80;rank-ceil-c-m-plus-one;outward-floor-half-up-ceil", upstreamVersion: RELEASE_DATE_CANDIDATES_VERSION, version: RELEASE_DATE_INTERVAL_CALIBRATION_VERSION, levels: RELEASE_DATE_INTERVAL_LEVELS, minimumResiduals: RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS, dateRoundingRule: RELEASE_DATE_INTERVAL_DATE_ROUNDING_RULE } as const;
export const RELEASE_DATE_INTERVAL_CALIBRATION_CODE_FINGERPRINT = historicalAnalysisFingerprint(CODE_MANIFEST);

/** Builds a deterministic calibration artifact from one fully validated FR-009 candidate artifact. */
export function buildReleaseDateIntervalCalibration(candidates: ReleaseDateCandidatesV1, config: ReleaseDateIntervalCalibrationConfigV1 = DEFAULT_RELEASE_DATE_INTERVAL_CALIBRATION_CONFIG): ReleaseDateIntervalCalibrationV1 {
  const issues = [...validateReleaseDateCandidates(candidates).map((issue) => ({ code: "invalid-upstream" as const, path: `candidates.${issue.path}`, message: issue.message })), ...configIssues(config)];
  if (issues.length) throw new ReleaseDateIntervalCalibrationInputError(issues);
  const core = deriveCore(candidates, config);
  const sourceDatasetFingerprint = candidates.fingerprints.sourceDatasetFingerprint;
  const upstreamCandidatesFingerprint = candidates.fingerprints.resultFingerprint;
  const configFingerprint = historicalAnalysisFingerprint(config);
  const codeFingerprint = RELEASE_DATE_INTERVAL_CALIBRATION_CODE_FINGERPRINT;
  const fingerprints = { sourceDatasetFingerprint, upstreamCandidatesFingerprint, configFingerprint, codeFingerprint, resultFingerprint: historicalAnalysisFingerprint({ core, sourceDatasetFingerprint, upstreamCandidatesFingerprint, configFingerprint, codeFingerprint }) };
  const result = { ...core, fingerprints };
  const outputIssues = validateReleaseDateIntervalCalibration(result);
  if (outputIssues.length) throw new ReleaseDateIntervalCalibrationInputError(outputIssues);
  return result;
}

export interface CalibratedActiveReleaseDateForecastV1 {
  forecast: ReleaseDateForecastV1;
  candidateId: string;
  cohortPathId: string;
  residualPool: ReleaseDateResidualPoolV1;
  intervals: readonly ReleaseDateCalibratedIntervalV1[];
}

/** Calibrates a validated active FR-009 forecast using only historical residuals visible at sourceAsOfDate. */
export function calibrateActiveReleaseDateForecast(sourceDataset: HistoricalAnalysisDatasetV1, anchorEventId: string, candidates: ReleaseDateCandidatesV1, calibration: ReleaseDateIntervalCalibrationV1): CalibratedActiveReleaseDateForecastV1 | null {
  try {
    if (validateHistoricalAnalysisDataset(sourceDataset).length || validateReleaseDateCandidates(candidates).length || validateReleaseDateIntervalCalibration(calibration).length) return null;
    if (candidates.fingerprints.sourceDatasetFingerprint !== sourceDataset.fingerprints.datasetFingerprint || calibration.fingerprints.sourceDatasetFingerprint !== sourceDataset.fingerprints.datasetFingerprint || calibration.fingerprints.upstreamCandidatesFingerprint !== candidates.fingerprints.resultFingerprint) return null;
    const forecast = predictReleaseDateForAnchor(sourceDataset, anchorEventId, candidates);
    if (!forecast?.selection.available || !forecast.resolved) return null;
    const selectedCandidateId = forecast.selection.selectedCandidateId;
    const prediction = forecast.candidates.find((row): row is SelectedPrediction => row.candidateId === selectedCandidateId && row.available);
    const anchor = sourceDataset.canonicalEvents.find((event) => event.eventId === anchorEventId);
    if (!prediction || !anchor) return null;
    const cohortPathId = releaseDateResolvedCohortPathId(prediction, anchor);
    const cutoff = sourceDataset.provenance.sourceAsOfDate;
    const residuals = selectedHistorical(candidates).filter((inner) => inner.forecast.fold.originOn < cutoff && inner.target.publicFirstObservedOn <= cutoff && inner.target.platformId === anchor.platformId && inner.prediction.candidateId === prediction.candidateId).map((inner) => inner.residual);
    const exact = sortResiduals(residuals.filter((row) => row.stage === anchor.stage && row.cohortPathId === cohortPathId));
    const platform = sortResiduals(residuals);
    const selectedPool: ReleaseDateResidualPoolV1["selectedPool"] = exact.length >= RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS ? "exact" : platform.length >= RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS ? "platform-fallback" : "unavailable";
    const selectedResiduals = selectedPool === "exact" ? exact : selectedPool === "platform-fallback" ? platform : [];
    return { forecast, candidateId: prediction.candidateId, cohortPathId, residualPool: { exactCount: exact.length, platformCount: platform.length, selectedPool, selectedResiduals }, intervals: RELEASE_DATE_INTERVAL_LEVELS.map((level) => interval(anchor.occurredOn, prediction.pointDays, level, selectedResiduals)) };
  } catch { return null; }
}

/** Strict no-throw validator: upstream validation and every derived calibration field are re-derived. */
export function validateReleaseDateIntervalCalibration(value: unknown): ReleaseDateIntervalCalibrationValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "calibration", message: "Calibration must be an object." }];
    const issues: ReleaseDateIntervalCalibrationValidationIssue[] = [];
    if (value.calibrationVersion !== RELEASE_DATE_INTERVAL_CALIBRATION_VERSION) issues.push({ code: "unsupported-version", path: "calibrationVersion", message: `Expected ${RELEASE_DATE_INTERVAL_CALIBRATION_VERSION}.` });
    issues.push(...configIssues(value.config));
    if (!isRecord(value.candidates)) issues.push({ code: "invalid-upstream", path: "candidates", message: "A FR-009 candidate artifact is required." });
    else for (const issue of validateReleaseDateCandidates(value.candidates)) issues.push({ code: "invalid-upstream", path: `candidates.${issue.path}`, message: issue.message });
    for (const field of ["calibratedFolds", "residualLedger", "intervalScores"] as const) if (!Array.isArray(value[field])) issues.push({ code: "invalid-row", path: field, message: `${field} must be an array.` });
    if (!isRecord(value.metrics)) issues.push({ code: "invalid-row", path: "metrics", message: "Metrics are required." });
    if (!isRecord(value.fingerprints)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Fingerprints are required." });
    if (issues.length) return issues;
    const candidates = value.candidates as ReleaseDateCandidatesV1;
    const config = value.config as ReleaseDateIntervalCalibrationConfigV1;
    const fingerprints = value.fingerprints as Record<string, unknown>;
    if (fingerprints.sourceDatasetFingerprint !== candidates.fingerprints.sourceDatasetFingerprint || fingerprints.upstreamCandidatesFingerprint !== candidates.fingerprints.resultFingerprint || fingerprints.configFingerprint !== historicalAnalysisFingerprint(config) || fingerprints.codeFingerprint !== RELEASE_DATE_INTERVAL_CALIBRATION_CODE_FINGERPRINT || typeof fingerprints.resultFingerprint !== "string" || !SHA_256.test(fingerprints.resultFingerprint)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Source, upstream, config, code, or result fingerprints are invalid." });
    const core = deriveCore(candidates, config);
    for (const field of ["calibrationVersion", "config", "candidates", "calibratedFolds", "residualLedger", "intervalScores", "metrics"] as const) if (stableSerializeHistoricalAnalysis(value[field]) !== stableSerializeHistoricalAnalysis(core[field])) issues.push({ code: "invalid-row", path: field, message: "Rows do not match deterministic interval calibration semantics." });
    if (fingerprints.resultFingerprint !== historicalAnalysisFingerprint({ core, sourceDatasetFingerprint: fingerprints.sourceDatasetFingerprint, upstreamCandidatesFingerprint: fingerprints.upstreamCandidatesFingerprint, configFingerprint: fingerprints.configFingerprint, codeFingerprint: fingerprints.codeFingerprint })) issues.push({ code: "invalid-fingerprint", path: "fingerprints.resultFingerprint", message: "Result fingerprint does not bind upstream, config, code, and output." });
    return issues;
  } catch { return [{ code: "invalid-input", path: "calibration", message: "Calibration could not be validated safely." }]; }
}
