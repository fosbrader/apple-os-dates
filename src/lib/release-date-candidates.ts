import {
  HISTORICAL_ANALYSIS_DATASET_VERSION,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
  type HistoricalCanonicalEventRow,
  type HistoricalLifecycleOutcomeRow,
} from "./historical-analysis-dataset";
import type { CanonicalForecastStage } from "./forecast-analysis-contracts";

/** Pure, timing/cadence-only public-release date candidate artifact. */
export const RELEASE_DATE_CANDIDATES_VERSION = "release-date-candidates/v1";
export const RELEASE_DATE_MINIMUM_OUTCOMES = 8;
/** Fixed, documented smoothing weight; it is not fitted or calibrated. */
export const RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH = 4;
export const RELEASE_DATE_ROUNDING_RULE = "half-up-positive-days/v1";

export const RELEASE_DATE_CANDIDATES = [
  "platform-stage-median",
  "hierarchical-platform-cadence",
] as const;
export type ReleaseDateCandidateId = (typeof RELEASE_DATE_CANDIDATES)[number];

export interface ReleaseDateCandidateConfigV1 {
  candidatesVersion: typeof RELEASE_DATE_CANDIDATES_VERSION;
  minimumOutcomes: typeof RELEASE_DATE_MINIMUM_OUTCOMES;
  hierarchicalPriorStrength: typeof RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH;
  roundingRule: typeof RELEASE_DATE_ROUNDING_RULE;
}

export const DEFAULT_RELEASE_DATE_CANDIDATE_CONFIG: ReleaseDateCandidateConfigV1 = {
  candidatesVersion: RELEASE_DATE_CANDIDATES_VERSION,
  minimumOutcomes: RELEASE_DATE_MINIMUM_OUTCOMES,
  hierarchicalPriorStrength: RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH,
  roundingRule: RELEASE_DATE_ROUNDING_RULE,
};

export interface ReleaseDateTargetV1 {
  targetId: string;
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  releaseClass: "major" | "minor" | "patch";
  releasePosition: number;
  stage: CanonicalForecastStage;
  anchorEventId: string;
  anchorOccurredOn: string;
  originOn: string;
  publicOutcomeEvidenceId: string;
  publicOccurredOn: string;
  publicFirstObservedOn: string;
  actualDays: number;
  sourceEvidenceIds: readonly string[];
}

export type ReleaseDateExclusionReason =
  | "release-not-included"
  | "chronology-incomplete"
  | "missing-public-release-outcome"
  | "ambiguous-public-release-outcome"
  | "outcome-not-after-anchor-observed"
  | "same-calendar-day"
  | "non-forward-interval";

export interface ReleaseDateExclusionLedgerEntryV1 {
  releaseId: string;
  anchorEventId: string;
  included: boolean;
  targetId?: string;
  reason?: ReleaseDateExclusionReason;
  sourceEvidenceIds: readonly string[];
}

export interface ReleaseDateFoldV1 {
  foldId: string;
  heldoutTargetId: string;
  originOn: string;
  trainingTargetIds: readonly string[];
}

export interface ReleaseDateTierV1 {
  tier: "platform-stage" | "product-family" | "release-class" | "release-position";
  count: number;
  trainingTargetIds: readonly string[];
  rawMedianDays: number | null;
  posteriorDays: number;
  /** An empty child does not alter the parent posterior. */
  fallback: boolean;
}

export interface ReleaseDateCandidateExplanationV1 {
  sourceDatasetFingerprint: string;
  originOn: string;
  platformId: string;
  trainingTargetIds: readonly string[];
  /** Baseline records its stage-to-platform fallback; hierarchy records tiers. */
  cohort: "platform-stage" | "platform-pooled" | "hierarchical";
  fallback: boolean;
  tiers?: readonly ReleaseDateTierV1[];
}

export type ReleaseDateCandidatePredictionV1 = {
  candidateId: ReleaseDateCandidateId;
  foldId: string;
  heldoutTargetId: string;
  trainingTargetIds: readonly string[];
} & (
  | {
      available: true;
      pointDays: number;
      explanation: ReleaseDateCandidateExplanationV1;
    }
  | {
      available: false;
      reason: "minimum-training-outcomes";
      explanation: ReleaseDateCandidateExplanationV1;
    }
);

export interface ReleaseDateScoreV1 {
  candidateId: ReleaseDateCandidateId;
  foldId: string;
  heldoutTargetId: string;
  platformId: string;
  outcomeFirstObservedOn: string;
  actualDays: number;
  predictionDays: number;
  signedErrorDays: number;
  absoluteErrorDays: number;
}

export type ReleaseDateCandidateMetricsV1 = {
  candidateId: ReleaseDateCandidateId;
  scoreCount: number;
} & (
  | {
      reportable: true;
      maeDays: number;
      medianAbsoluteErrorDays: number;
      signedBiasDays: number;
    }
  | {
      reportable: false;
      reason: "minimum-score-count";
      maeDays: null;
      medianAbsoluteErrorDays: null;
      signedBiasDays: null;
    }
);

export type ReleaseDateSelectionV1 =
  | {
      available: true;
      status: "winner" | "baseline-default-insufficient-comparison";
      selectedCandidateId: ReleaseDateCandidateId;
      comparedScores: readonly ReleaseDateCandidateMetricsV1[];
    }
  | {
      available: false;
      status: "no-forecast-baseline-unavailable";
      comparedScores: readonly ReleaseDateCandidateMetricsV1[];
    };

export interface ReleaseDateForecastV1 {
  fold: ReleaseDateFoldV1;
  candidates: readonly ReleaseDateCandidatePredictionV1[];
  selection: ReleaseDateSelectionV1;
  /** Present only after a candidate has been selected. */
  resolved?: {
    pointDays: number;
    roundedDays: number;
    roundingRule: typeof RELEASE_DATE_ROUNDING_RULE;
    publicReleaseDate: string;
  };
}

export interface ReleaseDateCandidateFingerprintsV1 {
  sourceDatasetFingerprint: string;
  configFingerprint: string;
  codeFingerprint: string;
  resultFingerprint: string;
}

export interface ReleaseDateCandidatesV1 {
  candidatesVersion: typeof RELEASE_DATE_CANDIDATES_VERSION;
  config: ReleaseDateCandidateConfigV1;
  sourceDataset: HistoricalAnalysisDatasetV1;
  targets: readonly ReleaseDateTargetV1[];
  exclusionLedger: readonly ReleaseDateExclusionLedgerEntryV1[];
  folds: readonly ReleaseDateFoldV1[];
  predictions: readonly ReleaseDateCandidatePredictionV1[];
  scores: readonly ReleaseDateScoreV1[];
  forecasts: readonly ReleaseDateForecastV1[];
  fingerprints: ReleaseDateCandidateFingerprintsV1;
}

export type ReleaseDateCandidateValidationCode =
  | "invalid-input"
  | "unsupported-version"
  | "invalid-config"
  | "invalid-source-dataset"
  | "invalid-row"
  | "invalid-fingerprint";

export interface ReleaseDateCandidateValidationIssue {
  code: ReleaseDateCandidateValidationCode;
  path: string;
  message: string;
}

export class ReleaseDateCandidateInputError extends Error {
  constructor(public readonly issues: readonly ReleaseDateCandidateValidationIssue[]) {
    super(`Release-date candidate input is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "ReleaseDateCandidateInputError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function compareText(left: string, right: string): number { return left < right ? -1 : left > right ? 1 : 0; }
function sorted<T>(values: readonly T[], key: (value: T) => string): T[] { return [...values].sort((a, b) => compareText(key(a), key(b))); }
function uniqueSorted(values: readonly string[]): string[] { return [...new Set(values)].sort(compareText); }
function median(values: readonly number[]): number { const ordered = [...values].sort((a, b) => a - b); const middle = Math.floor(ordered.length / 2); return ordered.length % 2 ? ordered[middle]! : (ordered[middle - 1]! + ordered[middle]!) / 2; }
function dayNumber(value: string): number { const [year, month, day] = value.split("-").map(Number); return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000); }
function addDays(value: string, days: number): string { return new Date((dayNumber(value) + days) * 86_400_000).toISOString().slice(0, 10); }
/** Applies exactly once, only when turning a point estimate into a calendar day. */
export function roundReleaseDatePointDays(pointDays: number): number { return Math.floor(pointDays + 0.5); }

function configIssues(value: unknown): ReleaseDateCandidateValidationIssue[] {
  if (!isRecord(value) || value.candidatesVersion !== RELEASE_DATE_CANDIDATES_VERSION || value.minimumOutcomes !== RELEASE_DATE_MINIMUM_OUTCOMES || value.hierarchicalPriorStrength !== RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH || value.roundingRule !== RELEASE_DATE_ROUNDING_RULE) return [{ code: "invalid-config", path: "config", message: "Config must use the fixed v1 candidates, minimum, prior, and rounding rule." }];
  return [];
}

function targetId(event: HistoricalCanonicalEventRow, outcome: HistoricalLifecycleOutcomeRow): string { return `${event.releaseId}:public-release:${event.eventId}:${outcome.outcomeEvidenceId}`; }

function deriveTargets(sourceDataset: HistoricalAnalysisDatasetV1) {
  const cycles = new Map(sourceDataset.releaseCycles.map((row) => [row.releaseId, row]));
  const outcomes = new Map<string, HistoricalLifecycleOutcomeRow[]>();
  for (const outcome of sourceDataset.lifecycleOutcomes) {
    if (outcome.closure !== "public-release") continue;
    outcomes.set(outcome.releaseId, [...(outcomes.get(outcome.releaseId) ?? []), outcome]);
  }
  const targets: ReleaseDateTargetV1[] = [];
  const exclusionLedger: ReleaseDateExclusionLedgerEntryV1[] = [];
  for (const event of sorted(sourceDataset.canonicalEvents, (row) => row.eventId)) {
    const cycle = cycles.get(event.releaseId);
    const base = { releaseId: event.releaseId, anchorEventId: event.eventId, sourceEvidenceIds: uniqueSorted(event.sourceEvidenceIds) };
    if (!cycle?.included || cycle.lifecycle === "superseded") { exclusionLedger.push({ ...base, included: false, reason: "release-not-included" }); continue; }
    if (cycle.chronologyCoverage.state !== "complete") { exclusionLedger.push({ ...base, included: false, reason: "chronology-incomplete" }); continue; }
    const publicOutcomes = outcomes.get(event.releaseId) ?? [];
    if (!publicOutcomes.length) { exclusionLedger.push({ ...base, included: false, reason: "missing-public-release-outcome" }); continue; }
    if (publicOutcomes.length !== 1) { exclusionLedger.push({ ...base, included: false, reason: "ambiguous-public-release-outcome" }); continue; }
    const outcome = publicOutcomes[0]!;
    const sourceEvidenceIds = uniqueSorted([...event.sourceEvidenceIds, ...outcome.sourceEvidenceIds]);
    if (outcome.firstObservedOn <= event.firstObservedOn) { exclusionLedger.push({ ...base, sourceEvidenceIds, included: false, reason: "outcome-not-after-anchor-observed" }); continue; }
    const days = dayNumber(outcome.occurredOn) - dayNumber(event.occurredOn);
    if (days === 0) { exclusionLedger.push({ ...base, sourceEvidenceIds, included: false, reason: "same-calendar-day" }); continue; }
    if (days < 0) { exclusionLedger.push({ ...base, sourceEvidenceIds, included: false, reason: "non-forward-interval" }); continue; }
    const id = targetId(event, outcome);
    targets.push({ targetId: id, releaseId: event.releaseId, platformId: event.platformId, productFamilyId: event.productFamilyId, releaseClass: event.releaseClass, releasePosition: event.releasePosition, stage: event.stage, anchorEventId: event.eventId, anchorOccurredOn: event.occurredOn, originOn: event.firstObservedOn, publicOutcomeEvidenceId: outcome.outcomeEvidenceId, publicOccurredOn: outcome.occurredOn, publicFirstObservedOn: outcome.firstObservedOn, actualDays: days, sourceEvidenceIds });
    exclusionLedger.push({ ...base, sourceEvidenceIds, included: true, targetId: id });
  }
  return { targets: sorted(targets, (row) => row.targetId), exclusionLedger: sorted(exclusionLedger, (row) => `${row.releaseId}\u0000${row.anchorEventId}`) };
}

function trainingFor(heldoutTargetId: string | null, originOn: string, targets: readonly ReleaseDateTargetV1[]): ReleaseDateTargetV1[] {
  return targets.filter((target) => target.targetId !== heldoutTargetId && target.originOn <= originOn && target.publicOccurredOn <= originOn && target.publicFirstObservedOn <= originOn);
}

function explanation(sourceDatasetFingerprint: string, originOn: string, platformId: string, rows: readonly ReleaseDateTargetV1[], cohort: ReleaseDateCandidateExplanationV1["cohort"], fallback: boolean, tiers?: readonly ReleaseDateTierV1[]): ReleaseDateCandidateExplanationV1 {
  return { sourceDatasetFingerprint, originOn, platformId, trainingTargetIds: sorted(rows, (row) => row.targetId).map((row) => row.targetId), cohort, fallback, ...(tiers ? { tiers } : {}) };
}

function baselinePrediction(fold: ReleaseDateFoldV1, heldout: Pick<ReleaseDateTargetV1, "platformId" | "stage" | "originOn">, training: readonly ReleaseDateTargetV1[], sourceDatasetFingerprint: string): ReleaseDateCandidatePredictionV1 {
  const platform = training.filter((row) => row.platformId === heldout.platformId);
  const stage = platform.filter((row) => row.stage === heldout.stage);
  const cohort = stage.length >= RELEASE_DATE_MINIMUM_OUTCOMES ? stage : platform;
  const fallback = cohort !== stage;
  const detail = explanation(sourceDatasetFingerprint, heldout.originOn, heldout.platformId, cohort, fallback ? "platform-pooled" : "platform-stage", fallback);
  const ids = detail.trainingTargetIds;
  if (cohort.length < RELEASE_DATE_MINIMUM_OUTCOMES) return { candidateId: "platform-stage-median", foldId: fold.foldId, heldoutTargetId: fold.heldoutTargetId, trainingTargetIds: ids, available: false, reason: "minimum-training-outcomes", explanation: detail };
  return { candidateId: "platform-stage-median", foldId: fold.foldId, heldoutTargetId: fold.heldoutTargetId, trainingTargetIds: ids, available: true, pointDays: median(cohort.map((row) => row.actualDays)), explanation: detail };
}

function hierarchicalPrediction(fold: ReleaseDateFoldV1, heldout: Pick<ReleaseDateTargetV1, "platformId" | "productFamilyId" | "releaseClass" | "releasePosition" | "stage" | "originOn">, training: readonly ReleaseDateTargetV1[], sourceDatasetFingerprint: string): ReleaseDateCandidatePredictionV1 {
  const root = training.filter((row) => row.platformId === heldout.platformId && row.stage === heldout.stage);
  const initial = explanation(sourceDatasetFingerprint, heldout.originOn, heldout.platformId, root, "hierarchical", false, []);
  if (root.length < RELEASE_DATE_MINIMUM_OUTCOMES) return { candidateId: "hierarchical-platform-cadence", foldId: fold.foldId, heldoutTargetId: fold.heldoutTargetId, trainingTargetIds: initial.trainingTargetIds, available: false, reason: "minimum-training-outcomes", explanation: initial };
  let parent = median(root.map((row) => row.actualDays));
  let current = root;
  const tiers: ReleaseDateTierV1[] = [{ tier: "platform-stage", count: root.length, trainingTargetIds: sorted(root, (row) => row.targetId).map((row) => row.targetId), rawMedianDays: parent, posteriorDays: parent, fallback: false }];
  const refinements: readonly [ReleaseDateTierV1["tier"], (row: ReleaseDateTargetV1) => boolean][] = [
    ["product-family", (row) => row.productFamilyId === heldout.productFamilyId],
    ["release-class", (row) => row.releaseClass === heldout.releaseClass],
    ["release-position", (row) => row.releasePosition === heldout.releasePosition],
  ];
  for (const [tier, match] of refinements) {
    const child = current.filter(match);
    if (!child.length) { tiers.push({ tier, count: 0, trainingTargetIds: [], rawMedianDays: null, posteriorDays: parent, fallback: true }); continue; }
    const rawMedianDays = median(child.map((row) => row.actualDays));
    parent = (child.length * rawMedianDays + RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH * parent) / (child.length + RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH);
    current = child;
    tiers.push({ tier, count: child.length, trainingTargetIds: sorted(child, (row) => row.targetId).map((row) => row.targetId), rawMedianDays, posteriorDays: parent, fallback: false });
  }
  const detail = explanation(sourceDatasetFingerprint, heldout.originOn, heldout.platformId, root, "hierarchical", tiers.some((tier) => tier.fallback), tiers);
  return { candidateId: "hierarchical-platform-cadence", foldId: fold.foldId, heldoutTargetId: fold.heldoutTargetId, trainingTargetIds: detail.trainingTargetIds, available: true, pointDays: parent, explanation: detail };
}

function predictionsFor(fold: ReleaseDateFoldV1, heldout: Pick<ReleaseDateTargetV1, "platformId" | "productFamilyId" | "releaseClass" | "releasePosition" | "stage" | "originOn">, training: readonly ReleaseDateTargetV1[], sourceDatasetFingerprint: string): ReleaseDateCandidatePredictionV1[] {
  return [baselinePrediction(fold, heldout, training, sourceDatasetFingerprint), hierarchicalPrediction(fold, heldout, training, sourceDatasetFingerprint)];
}

function metrics(candidateId: ReleaseDateCandidateId, scores: readonly ReleaseDateScoreV1[]): ReleaseDateCandidateMetricsV1 {
  if (scores.length < RELEASE_DATE_MINIMUM_OUTCOMES) return { candidateId, scoreCount: scores.length, reportable: false, reason: "minimum-score-count", maeDays: null, medianAbsoluteErrorDays: null, signedBiasDays: null };
  return { candidateId, scoreCount: scores.length, reportable: true, maeDays: scores.reduce((sum, score) => sum + score.absoluteErrorDays, 0) / scores.length, medianAbsoluteErrorDays: median(scores.map((score) => score.absoluteErrorDays)), signedBiasDays: scores.reduce((sum, score) => sum + score.signedErrorDays, 0) / scores.length };
}

function selectionFor(fold: ReleaseDateFoldV1, candidates: readonly ReleaseDateCandidatePredictionV1[], scores: readonly ReleaseDateScoreV1[]): ReleaseDateSelectionV1 {
  const baseline = candidates.find((row) => row.candidateId === "platform-stage-median")!;
  const heldout = candidates[0]!;
  const comparison = RELEASE_DATE_CANDIDATES.map((candidateId) => {
    const rows = scores.filter((score) => score.candidateId === candidateId && score.platformId === heldout.explanation.platformId && score.outcomeFirstObservedOn <= fold.originOn);
    return metrics(candidateId, rows);
  });
  if (!baseline.available) return { available: false, status: "no-forecast-baseline-unavailable", comparedScores: comparison };
  const allCandidatesAvailable = RELEASE_DATE_CANDIDATES.every((candidateId) => candidates.some((row) => row.candidateId === candidateId && row.available));
  if (!allCandidatesAvailable || comparison.some((row) => !row.reportable)) return { available: true, status: "baseline-default-insufficient-comparison", selectedCandidateId: "platform-stage-median", comparedScores: comparison };
  const ranked = comparison.filter((row): row is Extract<ReleaseDateCandidateMetricsV1, { reportable: true }> => row.reportable).sort((left, right) => left.maeDays - right.maeDays || left.medianAbsoluteErrorDays - right.medianAbsoluteErrorDays || Math.abs(left.signedBiasDays) - Math.abs(right.signedBiasDays) || compareText(left.candidateId, right.candidateId));
  return { available: true, status: "winner", selectedCandidateId: ranked[0]!.candidateId, comparedScores: ranked };
}

function resolved(forecast: ReleaseDateForecastV1, anchorOccurredOn: string): ReleaseDateForecastV1 {
  const selection = forecast.selection;
  if (!selection.available) return forecast;
  const candidate = forecast.candidates.find((row) => row.candidateId === selection.selectedCandidateId && row.available) as Extract<ReleaseDateCandidatePredictionV1, { available: true }>;
  const roundedDays = roundReleaseDatePointDays(candidate.pointDays);
  return { ...forecast, resolved: { pointDays: candidate.pointDays, roundedDays, roundingRule: RELEASE_DATE_ROUNDING_RULE, publicReleaseDate: addDays(anchorOccurredOn, roundedDays) } };
}

function deriveCore(sourceDataset: HistoricalAnalysisDatasetV1, config: ReleaseDateCandidateConfigV1) {
  const sourceDatasetFingerprint = sourceDataset.fingerprints.datasetFingerprint;
  const { targets, exclusionLedger } = deriveTargets(sourceDataset);
  const folds = targets.map((target) => ({ foldId: `fold:${target.targetId}`, heldoutTargetId: target.targetId, originOn: target.originOn, trainingTargetIds: sorted(trainingFor(target.targetId, target.originOn, targets), (row) => row.targetId).map((row) => row.targetId) }));
  const predictions: ReleaseDateCandidatePredictionV1[] = [];
  for (const fold of folds) { const heldout = targets.find((target) => target.targetId === fold.heldoutTargetId)!; predictions.push(...predictionsFor(fold, heldout, trainingFor(heldout.targetId, fold.originOn, targets), sourceDatasetFingerprint)); }
  const scores = sorted(predictions.filter((row): row is Extract<ReleaseDateCandidatePredictionV1, { available: true }> => row.available).map((prediction) => { const target = targets.find((row) => row.targetId === prediction.heldoutTargetId)!; return { candidateId: prediction.candidateId, foldId: prediction.foldId, heldoutTargetId: target.targetId, platformId: target.platformId, outcomeFirstObservedOn: target.publicFirstObservedOn, actualDays: target.actualDays, predictionDays: prediction.pointDays, signedErrorDays: prediction.pointDays - target.actualDays, absoluteErrorDays: Math.abs(prediction.pointDays - target.actualDays) }; }), (row) => `${row.candidateId}\u0000${row.foldId}`);
  const forecasts = sorted(folds.map((fold) => { const target = targets.find((row) => row.targetId === fold.heldoutTargetId)!; const candidates = sorted(predictions.filter((row) => row.foldId === fold.foldId), (row) => row.candidateId); return resolved({ fold, candidates, selection: selectionFor(fold, candidates, scores) }, target.anchorOccurredOn); }), (row) => row.fold.foldId);
  return { candidatesVersion: RELEASE_DATE_CANDIDATES_VERSION, config, sourceDataset, targets, exclusionLedger, folds: sorted(folds, (row) => row.foldId), predictions: sorted(predictions, (row) => `${row.candidateId}\u0000${row.foldId}`), scores, forecasts } as const;
}

const CODE_MANIFEST = { algorithm: "release-date-candidates-v1;public-release-only;historical-anchor-origin;active-source-as-of-origin;platform-only;median;hierarchical-strength-4;two-candidate-reportable-selection;half-up-positive-days", historicalDatasetVersion: HISTORICAL_ANALYSIS_DATASET_VERSION, candidatesVersion: RELEASE_DATE_CANDIDATES_VERSION, minimumOutcomes: RELEASE_DATE_MINIMUM_OUTCOMES, hierarchicalPriorStrength: RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH, roundingRule: RELEASE_DATE_ROUNDING_RULE } as const;
export const RELEASE_DATE_CANDIDATE_CODE_FINGERPRINT = historicalAnalysisFingerprint(CODE_MANIFEST);

/** Builds a standalone, deterministic candidate-comparison artifact. */
export function buildReleaseDateCandidates(sourceDataset: HistoricalAnalysisDatasetV1, config: ReleaseDateCandidateConfigV1 = DEFAULT_RELEASE_DATE_CANDIDATE_CONFIG): ReleaseDateCandidatesV1 {
  const issues = [...validateHistoricalAnalysisDataset(sourceDataset).map((issue) => ({ code: "invalid-source-dataset" as const, path: `sourceDataset.${issue.path}`, message: issue.message })), ...configIssues(config)];
  if (issues.length) throw new ReleaseDateCandidateInputError(issues);
  const core = deriveCore(sourceDataset, config);
  const sourceDatasetFingerprint = sourceDataset.fingerprints.datasetFingerprint;
  const configFingerprint = historicalAnalysisFingerprint(config);
  const codeFingerprint = RELEASE_DATE_CANDIDATE_CODE_FINGERPRINT;
  const fingerprints = { sourceDatasetFingerprint, configFingerprint, codeFingerprint, resultFingerprint: historicalAnalysisFingerprint({ core, sourceDatasetFingerprint, configFingerprint, codeFingerprint }) };
  const result = { ...core, fingerprints };
  const outputIssues = validateReleaseDateCandidates(result);
  if (outputIssues.length) throw new ReleaseDateCandidateInputError(outputIssues);
  return result;
}

/** Predicts an active canonical anchor using facts admitted by the source snapshot cutoff. */
export function predictReleaseDateForAnchor(sourceDataset: HistoricalAnalysisDatasetV1, anchorEventId: string, artifact: ReleaseDateCandidatesV1 = buildReleaseDateCandidates(sourceDataset)): ReleaseDateForecastV1 | null {
  if (validateHistoricalAnalysisDataset(sourceDataset).length || validateReleaseDateCandidates(artifact).length || artifact.fingerprints.sourceDatasetFingerprint !== sourceDataset.fingerprints.datasetFingerprint) return null;
  const anchor = sourceDataset.canonicalEvents.find((row) => row.eventId === anchorEventId);
  const cycle = anchor && sourceDataset.releaseCycles.find((row) => row.releaseId === anchor.releaseId);
  const originOn = sourceDataset.provenance.sourceAsOfDate;
  if (!anchor || !cycle?.included || cycle.lifecycle !== "active" || cycle.chronologyCoverage.state !== "complete" || anchor.firstObservedOn > originOn) return null;
  const fold: ReleaseDateFoldV1 = { foldId: `active:${anchor.eventId}`, heldoutTargetId: `active:${anchor.eventId}`, originOn, trainingTargetIds: sorted(trainingFor(null, originOn, artifact.targets), (row) => row.targetId).map((row) => row.targetId) };
  const heldout = { platformId: anchor.platformId, productFamilyId: anchor.productFamilyId, releaseClass: anchor.releaseClass, releasePosition: anchor.releasePosition, stage: anchor.stage, originOn };
  const candidates = sorted(predictionsFor(fold, heldout, trainingFor(null, fold.originOn, artifact.targets), artifact.fingerprints.sourceDatasetFingerprint), (row) => row.candidateId);
  return resolved({ fold, candidates, selection: selectionFor(fold, candidates, artifact.scores) }, anchor.occurredOn);
}

/** Strict no-throw validator that recomputes all math and bound fingerprints. */
export function validateReleaseDateCandidates(value: unknown): ReleaseDateCandidateValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "candidates", message: "Candidates must be an object." }];
    const issues: ReleaseDateCandidateValidationIssue[] = [];
    if (value.candidatesVersion !== RELEASE_DATE_CANDIDATES_VERSION) issues.push({ code: "unsupported-version", path: "candidatesVersion", message: `Expected ${RELEASE_DATE_CANDIDATES_VERSION}.` });
    issues.push(...configIssues(value.config));
    if (!isRecord(value.sourceDataset)) issues.push({ code: "invalid-source-dataset", path: "sourceDataset", message: "A historical analysis dataset is required." });
    else for (const issue of validateHistoricalAnalysisDataset(value.sourceDataset)) issues.push({ code: "invalid-source-dataset", path: `sourceDataset.${issue.path}`, message: issue.message });
    for (const field of ["targets", "exclusionLedger", "folds", "predictions", "scores", "forecasts"] as const) if (!Array.isArray(value[field])) issues.push({ code: "invalid-row", path: field, message: `${field} must be an array.` });
    if (!isRecord(value.fingerprints)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Fingerprints are required." });
    if (issues.length) return issues;
    const fingerprints = value.fingerprints as Record<string, unknown>;
    const source = value.sourceDataset as HistoricalAnalysisDatasetV1;
    const config = value.config as ReleaseDateCandidateConfigV1;
    if (fingerprints.sourceDatasetFingerprint !== source.fingerprints.datasetFingerprint || fingerprints.configFingerprint !== historicalAnalysisFingerprint(config) || fingerprints.codeFingerprint !== RELEASE_DATE_CANDIDATE_CODE_FINGERPRINT || typeof fingerprints.resultFingerprint !== "string" || !SHA_256.test(fingerprints.resultFingerprint)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Source, config, code, or result fingerprints are invalid." });
    const core = deriveCore(source, config);
    for (const field of ["candidatesVersion", "config", "sourceDataset", "targets", "exclusionLedger", "folds", "predictions", "scores", "forecasts"] as const) if (stableSerializeHistoricalAnalysis(value[field]) !== stableSerializeHistoricalAnalysis(core[field])) issues.push({ code: "invalid-row", path: field, message: "Rows do not match deterministic release-date candidate semantics." });
    if (fingerprints.resultFingerprint !== historicalAnalysisFingerprint({ core, sourceDatasetFingerprint: fingerprints.sourceDatasetFingerprint, configFingerprint: fingerprints.configFingerprint, codeFingerprint: fingerprints.codeFingerprint })) issues.push({ code: "invalid-fingerprint", path: "fingerprints.resultFingerprint", message: "Result fingerprint does not bind source, config, code, and output." });
    return issues;
  } catch { return [{ code: "invalid-input", path: "candidates", message: "Candidates could not be validated safely." }]; }
}
