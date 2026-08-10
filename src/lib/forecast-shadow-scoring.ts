import {
  FORECAST_ARTIFACT_MODE,
  FORECAST_ARTIFACT_VERSION,
  commitForecastArtifactTransition,
  commitReconciliationRoot,
  forecastArtifactPath,
  parseForecastArtifact,
  rawArtifactDigest,
  reconciliationRootArtifactPath,
  serializeForecastArtifact,
  validateForecastArtifact,
  validateForecastPointer,
  type ForecastArtifactTargetV1,
  type ForecastArtifactV1,
  type ForecastContractStorage,
  type ForecastPointerV1,
  type ForecastPointEstimatorV1,
  type ForecastTargetKind,
} from "./forecast-artifact-contracts";
import {
  HISTORICAL_ANALYSIS_DATASET_VERSION,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
  type HistoricalCanonicalEventRow,
  type HistoricalLifecycleOutcomeRow,
} from "./historical-analysis-dataset";

export const FORECAST_OUTCOME_OBSERVATION_VERSION = "forecast-outcome-observation/v1";
export const FORECAST_SCORE_VERSION = "forecast-score/v1";
export const FORECAST_RECONCILIATION_INDEX_VERSION = "reconciliation-index/v1";
export const FORECAST_SHADOW_HEALTH_VERSION = "forecast-shadow-health/v1";
export const FORECAST_SCORE_MAX_BYTES = 65_536;
export const FORECAST_RECONCILIATION_INDEX_MAX_BYTES = 1_048_576;
export const FORECAST_SHADOW_HEALTH_MAX_BYTES = 524_288;
export const FORECAST_RECONCILIATION_MAX_ROWS = 4_096;
export const FORECAST_HEALTH_MAX_GROUPS = 512;
export const FORECAST_HEALTH_MAX_FAILURES = 128;
export const FORECAST_HEALTH_MIN_REPORTABLE_SCORES = 8;
export const FORECAST_OUTCOME_BINDING_MAX_ROWS = 8_192;
export const FORECAST_SHADOW_EPOCH_MAX_FORECASTS = 120;
export const FORECAST_SHADOW_EPOCH_MAX_TARGETS = 512;
export const FORECAST_SHADOW_EPOCH_MAX_AUDITS = 512;
export const FORECAST_SHADOW_EPOCH_MAX_TARGETS_PER_FORECAST = 32;
export const FORECAST_SHADOW_EPOCH_MAX_EVIDENCE_IDS_PER_ROW = 128;
export const FORECAST_SHADOW_EPOCH_INDEX_BYTE_BUDGET = 786_432;
export const FORECAST_SHADOW_EPOCH_MAX_DAYS = 120;

export type ForecastDataGapReason =
  | "ambiguous-outcome"
  | "identity-mismatch"
  | "next-event-stage-mismatch"
  | "ambiguous-chronology"
  | "missing-anchor-row"
  | "missing-observation-instant"
  | "outcome-retracted"
  | "outcome-superseded"
  | "source-dataset-mismatch"
  | "terminal-or-ineligible-next-event";

export type ForecastOutcomeAuditReason =
  | "outcome-date-corrected"
  | "outcome-evidence-corrected"
  | "outcome-stage-corrected"
  | "outcome-observation-time-corrected"
  | "outcome-identity-corrected"
  | "outcome-retracted"
  | "outcome-superseded";

export interface ForecastOutcomeInstantBindingV1 {
  bindingVersion: "forecast-outcome-instant-binding/v1";
  evidenceId: string;
  firstObservedAt: string;
}

export interface ForecastOutcomeObservationV1 {
  observationVersion: typeof FORECAST_OUTCOME_OBSERVATION_VERSION;
  sourceDatasetVersion: typeof HISTORICAL_ANALYSIS_DATASET_VERSION;
  sourceDatasetFingerprint: string;
  sourceRowFingerprint: string;
  outcomeFingerprint: string;
  outcomeId: string;
  targetId: string;
  targetKind: ForecastTargetKind;
  releaseId: string;
  platformId: string;
  anchorEventId: string;
  anchorStage: string;
  anchorOccurredOn: string;
  targetEventId: string;
  targetStage: string;
  occurredOn: string;
  firstObservedOn: string;
  firstObservedAt: string;
  sourceEvidenceIds: readonly string[];
}

export interface ForecastScoreIntervalV1 {
  level: 0.5 | 0.8;
  lowerDays: number;
  upperDays: number;
  covered: boolean;
}

export interface ForecastScoreArtifactV1 {
  scoreVersion: typeof FORECAST_SCORE_VERSION;
  mode: typeof FORECAST_ARTIFACT_MODE;
  forecastArtifactId: string;
  forecastRunKey: string;
  forecastSemanticFingerprint: string;
  forecastGeneratedAt: string;
  forecastDataCutoff: string;
  sourceDatasetVersion: typeof HISTORICAL_ANALYSIS_DATASET_VERSION;
  sourceDatasetFingerprint: string;
  sourceOutcomeFingerprint: string;
  targetId: string;
  targetKind: ForecastTargetKind;
  releaseId: string;
  platformId: string;
  anchorEventId: string;
  anchorStage: string;
  anchorOccurredOn: string;
  originOn: string;
  modelFingerprint: string;
  calibrationFingerprint: string;
  modelCohortId: string;
  predictedEligibleStage: string | null;
  outcomeId: string;
  outcomeEventId: string;
  outcomeStage: string;
  outcomeOccurredOn: string;
  outcomeFirstObservedOn: string;
  outcomeFirstObservedAt: string;
  anchorSourceEvidenceIds: readonly string[];
  outcomeSourceEvidenceIds: readonly string[];
  actualDays: number;
  pointEstimator: ForecastPointEstimatorV1;
  pointDays: number;
  signedErrorDays: number;
  absoluteErrorDays: number;
  intervals: readonly [ForecastScoreIntervalV1, ForecastScoreIntervalV1];
}

export interface ForecastReconciliationTargetSnapshotV1 {
  forecastTargetFingerprint: string;
  forecastDataCutoff: string;
  anchorEventId: string;
  anchorStage: string;
  anchorOccurredOn: string;
  originOn: string;
  anchorSourceEvidenceIds: readonly string[];
  predictedEligibleStage: "developer-beta" | "public-beta" | "release-candidate" | null;
}

interface ForecastReconciliationEntryBaseV1 {
  forecastArtifactId: string;
  forecastGeneratedAt: string;
  targetId: string;
  targetKind: ForecastTargetKind;
  releaseId: string;
  platformId: string;
  modelCohortId: string;
  targetSnapshot: ForecastReconciliationTargetSnapshotV1;
}

export interface ForecastShadowEvaluationEpochV1 {
  epochVersion: "forecast-shadow-evaluation-epoch/v1";
  epochId: string;
  startsOn: string;
  endsOn: string;
  maxForecastArtifacts: typeof FORECAST_SHADOW_EPOCH_MAX_FORECASTS;
  maxAvailableTargets: typeof FORECAST_SHADOW_EPOCH_MAX_TARGETS;
  maxAuditRows: typeof FORECAST_SHADOW_EPOCH_MAX_AUDITS;
  maxTargetsPerForecast: typeof FORECAST_SHADOW_EPOCH_MAX_TARGETS_PER_FORECAST;
  indexByteBudget: typeof FORECAST_SHADOW_EPOCH_INDEX_BYTE_BUDGET;
  samplingPolicy: "one-canonical-run-per-scheduled-day";
  reportingUnit: "unique-realized-event-equal-weight";
}

export type ForecastShadowEpochStopReason = "epoch-end-reached" | "forecast-artifact-limit-reached" | "target-row-limit-reached" | "audit-row-limit-reached" | "index-byte-budget-reached";

export interface ForecastReconciliationSourceForecastV1 {
  forecastArtifactId: string;
  forecastRunKey: string;
  scheduledFor: string;
  generatedAt: string;
}

export interface ForecastReconciliationScoreEntryV1 extends ForecastReconciliationEntryBaseV1 {
  scoreArtifactId: string;
  outcomeId: string;
  sourceDatasetFingerprint: string;
  sourceRowFingerprint: string;
  outcomeEventId: string;
  outcomeStage: string;
  outcomeOccurredOn: string;
  outcomeFirstObservedOn: string;
  outcomeFirstObservedAt: string;
  outcomeSourceEvidenceIds: readonly string[];
  actualDays: number;
  pointDays: number;
  signedErrorDays: number;
  absoluteErrorDays: number;
  coverage50: boolean;
  coverage80: boolean;
}

export interface ForecastReconciliationPendingEntryV1 extends ForecastReconciliationEntryBaseV1 {
  reason: "outcome-not-yet-known";
}

export interface ForecastReconciliationDataGapEntryV1 extends ForecastReconciliationEntryBaseV1 {
  gapId: string;
  outcomeId: string | null;
  reason: ForecastDataGapReason;
  sourceEvidenceIds: readonly string[];
}

export interface ForecastReconciliationAuditEntryV1 extends ForecastReconciliationEntryBaseV1 {
  auditId: string;
  reason: ForecastOutcomeAuditReason;
  previousScoreArtifactId: string;
  previousOutcomeFingerprint: string;
  replacementScoreArtifactId: string | null;
  replacementOutcomeFingerprint: string | null;
  sourceDatasetFingerprint: string;
  sourceEvidenceIds: readonly string[];
}

export interface ForecastReconciliationIndexV1 {
  indexVersion: typeof FORECAST_RECONCILIATION_INDEX_VERSION;
  mode: typeof FORECAST_ARTIFACT_MODE;
  compatibleForecastArtifactVersion: typeof FORECAST_ARTIFACT_VERSION;
  compatibleScoreVersion: typeof FORECAST_SCORE_VERSION;
  reconciliationCutoffAt: string;
  reconciliationCutoffDate: string;
  evaluationEpoch: ForecastShadowEvaluationEpochV1;
  epochStopReason: ForecastShadowEpochStopReason | null;
  sourceForecastArtifactIds: readonly string[];
  sourceForecasts: readonly ForecastReconciliationSourceForecastV1[];
  scores: readonly ForecastReconciliationScoreEntryV1[];
  pending: readonly ForecastReconciliationPendingEntryV1[];
  dataGaps: readonly ForecastReconciliationDataGapEntryV1[];
  audit: readonly ForecastReconciliationAuditEntryV1[];
  indexFingerprint: string;
}

export type ForecastShadowFailureCode = "source-unavailable" | "source-invalid" | "storage-read-failed" | "storage-write-failed" | "pointer-conflict" | "reconciliation-invalid" | "run-timeout";
export interface ForecastShadowRunFailureInputV1 { runId: string; failedAt: string; code: ForecastShadowFailureCode; }
export interface ForecastShadowRunFailureV1 {
  runId: string;
  failedAt: string;
  code: ForecastShadowFailureCode;
  safeSummary: string;
}

export interface ForecastShadowHealthMetricV1Base {
  targetKind: ForecastTargetKind;
  groupKind: "overall" | "platform" | "model-cohort";
  groupId: string;
  forecastCount: number;
  scoredCount: number;
  realizedEventCount: number;
  pendingCount: number;
  dataGapCount: number;
  scoreCoverage: number;
}

export type ForecastShadowHealthMetricV1 =
  | (ForecastShadowHealthMetricV1Base & {
      availability: "available";
      meanAbsoluteErrorDays: number;
      medianAbsoluteErrorDays: number;
      signedBiasDays: number;
      coverage50: number;
      coverage80: number;
    })
  | (ForecastShadowHealthMetricV1Base & { availability: "unavailable"; reason: "minimum-score-count" });

export interface ForecastShadowHealthGapCountV1 {
  reason: ForecastDataGapReason;
  count: number;
}

export interface ForecastShadowHealthReportV1 {
  reportVersion: typeof FORECAST_SHADOW_HEALTH_VERSION;
  mode: typeof FORECAST_ARTIFACT_MODE;
  generatedAt: string;
  reconciliationRootArtifactId: string;
  reconciliationCutoffAt: string;
  reconciliationCutoffDate: string;
  operations: {
    status: "healthy" | "degraded" | "no-data";
    freshness: { latestForecastGeneratedAt: string | null; ageHours: number | null; thresholdHours: number; status: "fresh" | "stale" | "no-data" };
    runFailures: readonly ForecastShadowRunFailureV1[];
    pendingCount: number;
    dataGapCount: number;
    auditCount: number;
  };
  statistics: { status: "reportable" | "insufficient-sample" | "no-scores"; minimumRealizedEventCount: typeof FORECAST_HEALTH_MIN_REPORTABLE_SCORES };
  summary: { forecastCount: number; scoredCount: number; pendingCount: number; dataGapCount: number; runFailureCount: number };
  dataGapCounts: readonly ForecastShadowHealthGapCountV1[];
  metrics: readonly ForecastShadowHealthMetricV1[];
  reportFingerprint: string;
}

export type ForecastScoringValidationCode =
  | "invalid-input"
  | "unsupported-version"
  | "unknown-property"
  | "invalid-row"
  | "invalid-order"
  | "invalid-fingerprint"
  | "invalid-evidence"
  | "invalid-chronology"
  | "incompatible-artifact"
  | "size-limit"
  | "row-limit"
  | "public-mode";

export interface ForecastScoringValidationIssue {
  code: ForecastScoringValidationCode;
  path: string;
  message: string;
}

export class ForecastScoringContractError extends Error {
  constructor(public readonly issues: readonly ForecastScoringValidationIssue[]) {
    super(`Forecast scoring contract is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "ForecastScoringContractError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const CANONICAL_STAGE = /^(?:(?:developer-beta|public-beta|release-candidate):[1-9]\d*|golden-master|public-release)$/;
const NEXT_STAGE = /^(developer-beta|public-beta|release-candidate):[1-9]\d*$/;
const UNSAFE_TEXT = /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/;
const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isText(value: unknown, max = 1_024): value is string { return typeof value === "string" && value.trim().length > 0 && value.length <= max && !UNSAFE_TEXT.test(value); }
function isSha(value: unknown): value is string { return typeof value === "string" && SHA_256.test(value); }
function isFiniteNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function isCount(value: unknown): value is number { return Number.isSafeInteger(value) && (value as number) >= 0; }
function textOrder(left: string, right: string): number { return left < right ? -1 : left > right ? 1 : 0; }
function byteLength(value: string): number { return encoder.encode(value).byteLength; }
function sortedUnique(values: readonly string[]): string[] { return [...new Set(values)].sort(textOrder); }
function isInstant(value: unknown): value is string { if (typeof value !== "string") return false; const parsed = new Date(value); return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value; }
function instantOrder(left: string, right: string): number { return new Date(left).getTime() - new Date(right).getTime(); }
function isDay(value: unknown): value is string { if (typeof value !== "string" || !ISO_DAY.test(value)) return false; const [year, month, day] = value.split("-").map(Number); const parsed = new Date(Date.UTC(year, month - 1, day)); return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day; }
function dayNumber(value: string): number { const [year, month, day] = value.split("-").map(Number); return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000); }
function elapsedDays(from: string, to: string): number { return dayNumber(to) - dayNumber(from); }
function normalizeZero(value: number): number { return Object.is(value, -0) ? 0 : value; }
function exactKeys(value: Record<string, unknown>, allowed: readonly string[], path: string, issues: ForecastScoringValidationIssue[]): void {
  const expected = new Set(allowed);
  for (const key of Object.keys(value)) if (!expected.has(key)) issues.push({ code: "unknown-property", path: `${path}.${key}`, message: "Unknown properties are not compatible with v1." });
  for (const key of allowed) if (!Object.hasOwn(value, key)) issues.push({ code: "invalid-row", path: `${path}.${key}`, message: "Required property is missing." });
}
function evidenceIssues(value: unknown, path: string): ForecastScoringValidationIssue[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((entry) => !isText(entry, 512))) return [{ code: "invalid-evidence", path, message: "One or more bounded evidence IDs are required." }];
  if (value.length > FORECAST_RECONCILIATION_MAX_ROWS) return [{ code: "row-limit", path, message: "Evidence count exceeds the v1 bound." }];
  if (stableSerializeHistoricalAnalysis(value) !== stableSerializeHistoricalAnalysis(sortedUnique(value as string[]))) return [{ code: "invalid-order", path, message: "Evidence IDs must be unique and sorted." }];
  return [];
}
function epochEvidenceIssues(value: unknown, path: string): ForecastScoringValidationIssue[] {
  const issues = evidenceIssues(value, path);
  if (Array.isArray(value) && value.length > FORECAST_SHADOW_EPOCH_MAX_EVIDENCE_IDS_PER_ROW) issues.push({ code: "row-limit", path, message: "Evaluation-epoch state evidence exceeds the fixed per-row bound." });
  return issues;
}
function statusKey(value: Pick<ForecastReconciliationEntryBaseV1, "forecastArtifactId" | "targetKind" | "targetId">): string { return `${value.forecastArtifactId}\u0000${value.targetKind}\u0000${value.targetId}`; }
function scoreEntryKey(value: ForecastReconciliationScoreEntryV1): string { return statusKey(value); }
function pendingEntryKey(value: ForecastReconciliationPendingEntryV1): string { return statusKey(value); }
function gapEntryKey(value: ForecastReconciliationDataGapEntryV1): string { return statusKey(value); }
function metricKey(value: ForecastShadowHealthMetricV1): string { return `${value.targetKind}\u0000${value.groupKind}\u0000${value.groupId}`; }
function failureKey(value: ForecastShadowRunFailureV1): string { return `${value.failedAt}\u0000${value.runId}`; }
function sourceForecastKey(value: ForecastReconciliationSourceForecastV1): string { return `${value.scheduledFor}\u0000${value.forecastRunKey}`; }

function outcomeRowProjection(value: Pick<ForecastOutcomeObservationV1, "releaseId" | "platformId" | "targetEventId" | "targetStage" | "occurredOn" | "firstObservedOn" | "sourceEvidenceIds">) {
  return { releaseId: value.releaseId, platformId: value.platformId, targetEventId: value.targetEventId, targetStage: value.targetStage, occurredOn: value.occurredOn, firstObservedOn: value.firstObservedOn, sourceEvidenceIds: value.sourceEvidenceIds };
}
function outcomeProjection(value: Omit<ForecastOutcomeObservationV1, "observationVersion" | "sourceDatasetVersion" | "sourceDatasetFingerprint" | "sourceRowFingerprint" | "outcomeFingerprint" | "outcomeId">) {
  return { targetId: value.targetId, targetKind: value.targetKind, releaseId: value.releaseId, platformId: value.platformId, anchorEventId: value.anchorEventId, anchorStage: value.anchorStage, anchorOccurredOn: value.anchorOccurredOn, targetEventId: value.targetEventId, targetStage: value.targetStage, occurredOn: value.occurredOn, firstObservedOn: value.firstObservedOn, firstObservedAt: value.firstObservedAt, sourceEvidenceIds: value.sourceEvidenceIds };
}

function evaluationEpochBody(value: Omit<ForecastShadowEvaluationEpochV1, "epochId">) { return value; }

export function buildForecastShadowEvaluationEpoch(startsOn: string, endsOn: string): ForecastShadowEvaluationEpochV1 {
  const withoutId: Omit<ForecastShadowEvaluationEpochV1, "epochId"> = {
    epochVersion: "forecast-shadow-evaluation-epoch/v1",
    startsOn,
    endsOn,
    maxForecastArtifacts: FORECAST_SHADOW_EPOCH_MAX_FORECASTS,
    maxAvailableTargets: FORECAST_SHADOW_EPOCH_MAX_TARGETS,
    maxAuditRows: FORECAST_SHADOW_EPOCH_MAX_AUDITS,
    maxTargetsPerForecast: FORECAST_SHADOW_EPOCH_MAX_TARGETS_PER_FORECAST,
    indexByteBudget: FORECAST_SHADOW_EPOCH_INDEX_BYTE_BUDGET,
    samplingPolicy: "one-canonical-run-per-scheduled-day",
    reportingUnit: "unique-realized-event-equal-weight",
  };
  const epoch = { ...withoutId, epochId: historicalAnalysisFingerprint(evaluationEpochBody(withoutId)) };
  const issues = validateForecastShadowEvaluationEpoch(epoch);
  if (issues.length) throw new ForecastScoringContractError(issues);
  return epoch;
}

export function validateForecastShadowEvaluationEpoch(value: unknown, path = "evaluationEpoch"): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-input", path, message: "A bounded shadow evaluation epoch is required." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["epochVersion", "epochId", "startsOn", "endsOn", "maxForecastArtifacts", "maxAvailableTargets", "maxAuditRows", "maxTargetsPerForecast", "indexByteBudget", "samplingPolicy", "reportingUnit"], path, issues);
  if (value.epochVersion !== "forecast-shadow-evaluation-epoch/v1" || !isSha(value.epochId) || !isDay(value.startsOn) || !isDay(value.endsOn) || (isDay(value.startsOn) && isDay(value.endsOn) && (value.endsOn < value.startsOn || dayNumber(value.endsOn) - dayNumber(value.startsOn) + 1 > FORECAST_SHADOW_EPOCH_MAX_DAYS)) || value.maxForecastArtifacts !== FORECAST_SHADOW_EPOCH_MAX_FORECASTS || value.maxAvailableTargets !== FORECAST_SHADOW_EPOCH_MAX_TARGETS || value.maxAuditRows !== FORECAST_SHADOW_EPOCH_MAX_AUDITS || value.maxTargetsPerForecast !== FORECAST_SHADOW_EPOCH_MAX_TARGETS_PER_FORECAST || value.indexByteBudget !== FORECAST_SHADOW_EPOCH_INDEX_BYTE_BUDGET || value.samplingPolicy !== "one-canonical-run-per-scheduled-day" || value.reportingUnit !== "unique-realized-event-equal-weight") issues.push({ code: "invalid-row", path, message: "Epoch dates, byte/row limits, sampling, and unique-event reporting policy must be exact and bounded." });
  if (isSha(value.epochId)) {
    const withoutId = { epochVersion: value.epochVersion, startsOn: value.startsOn, endsOn: value.endsOn, maxForecastArtifacts: value.maxForecastArtifacts, maxAvailableTargets: value.maxAvailableTargets, maxAuditRows: value.maxAuditRows, maxTargetsPerForecast: value.maxTargetsPerForecast, indexByteBudget: value.indexByteBudget, samplingPolicy: value.samplingPolicy, reportingUnit: value.reportingUnit } as Omit<ForecastShadowEvaluationEpochV1, "epochId">;
    if (value.epochId !== historicalAnalysisFingerprint(evaluationEpochBody(withoutId))) issues.push({ code: "invalid-fingerprint", path: `${path}.epochId`, message: "Epoch ID must bind the complete fixed evaluation policy." });
  }
  return issues;
}

export function validateForecastOutcomeInstantBinding(value: unknown, path = "binding"): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-input", path, message: "Outcome instant binding must be an object." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["bindingVersion", "evidenceId", "firstObservedAt"], path, issues);
  if (value.bindingVersion !== "forecast-outcome-instant-binding/v1" || !isText(value.evidenceId, 512) || !isInstant(value.firstObservedAt)) issues.push({ code: "invalid-row", path, message: "An exact v1 evidence identity and canonical observation instant are required." });
  return issues;
}

export function validateForecastOutcomeObservation(value: unknown, path = "outcome"): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-input", path, message: "Outcome observation must be an object." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["observationVersion", "sourceDatasetVersion", "sourceDatasetFingerprint", "sourceRowFingerprint", "outcomeFingerprint", "outcomeId", "targetId", "targetKind", "releaseId", "platformId", "anchorEventId", "anchorStage", "anchorOccurredOn", "targetEventId", "targetStage", "occurredOn", "firstObservedOn", "firstObservedAt", "sourceEvidenceIds"], path, issues);
  if (value.observationVersion !== FORECAST_OUTCOME_OBSERVATION_VERSION || value.sourceDatasetVersion !== HISTORICAL_ANALYSIS_DATASET_VERSION) issues.push({ code: "unsupported-version", path, message: "Outcome and source dataset versions must be exact v1 contracts." });
  if (!["public-release", "next-eligible-prerelease-event"].includes(value.targetKind as string) || !isSha(value.sourceDatasetFingerprint) || !isSha(value.sourceRowFingerprint) || !isSha(value.outcomeFingerprint) || value.outcomeId !== value.outcomeFingerprint || !isText(value.targetId) || !isText(value.releaseId) || !isText(value.platformId) || !isText(value.anchorEventId) || !isText(value.targetEventId)) issues.push({ code: "invalid-row", path, message: "Stable source, outcome, target, release, platform, anchor, and event identities are required." });
  if (isText(value.anchorEventId) && isText(value.targetEventId) && value.anchorEventId === value.targetEventId) issues.push({ code: "invalid-row", path: `${path}.targetEventId`, message: "The realized target event must be distinct from its forecast anchor." });
  if (typeof value.anchorStage !== "string" || !CANONICAL_STAGE.test(value.anchorStage) || typeof value.targetStage !== "string" || !CANONICAL_STAGE.test(value.targetStage)) issues.push({ code: "invalid-row", path, message: "Canonical anchor and outcome stages are required." });
  if (!isDay(value.anchorOccurredOn) || !isDay(value.occurredOn) || !isDay(value.firstObservedOn) || !isInstant(value.firstObservedAt) || (isDay(value.firstObservedOn) && isInstant(value.firstObservedAt) && value.firstObservedAt.slice(0, 10) !== value.firstObservedOn)) issues.push({ code: "invalid-chronology", path, message: "Valid occurrence/observation days and their exact canonical first-observed instant are required." });
  if (isDay(value.anchorOccurredOn) && isDay(value.occurredOn) && value.occurredOn <= value.anchorOccurredOn) issues.push({ code: "invalid-chronology", path: `${path}.occurredOn`, message: "An outcome must occur after its anchor day." });
  if (isDay(value.occurredOn) && isDay(value.firstObservedOn) && value.firstObservedOn < value.occurredOn) issues.push({ code: "invalid-chronology", path: `${path}.firstObservedAt`, message: "An outcome cannot be observed before it occurs." });
  if (value.targetKind === "public-release" && value.targetStage !== "public-release") issues.push({ code: "invalid-row", path: `${path}.targetStage`, message: "A public-release outcome must use the public-release stage." });
  if (value.targetKind === "next-eligible-prerelease-event" && (typeof value.targetStage !== "string" || !NEXT_STAGE.test(value.targetStage))) issues.push({ code: "invalid-row", path: `${path}.targetStage`, message: "A next-event outcome must use an eligible prerelease stage." });
  issues.push(...evidenceIssues(value.sourceEvidenceIds, `${path}.sourceEvidenceIds`));
  if (isSha(value.sourceRowFingerprint) && value.sourceRowFingerprint !== historicalAnalysisFingerprint(outcomeRowProjection(value as unknown as ForecastOutcomeObservationV1))) issues.push({ code: "invalid-fingerprint", path: `${path}.sourceRowFingerprint`, message: "Source row fingerprint must bind the exact canonical outcome row projection." });
  if (isSha(value.outcomeFingerprint)) {
    const projection = { targetId: value.targetId, targetKind: value.targetKind, releaseId: value.releaseId, platformId: value.platformId, anchorEventId: value.anchorEventId, anchorStage: value.anchorStage, anchorOccurredOn: value.anchorOccurredOn, targetEventId: value.targetEventId, targetStage: value.targetStage, occurredOn: value.occurredOn, firstObservedOn: value.firstObservedOn, firstObservedAt: value.firstObservedAt, sourceEvidenceIds: value.sourceEvidenceIds } as Omit<ForecastOutcomeObservationV1, "observationVersion" | "sourceDatasetVersion" | "sourceDatasetFingerprint" | "sourceRowFingerprint" | "outcomeFingerprint" | "outcomeId">;
    if (value.outcomeFingerprint !== historicalAnalysisFingerprint(outcomeProjection(projection))) issues.push({ code: "invalid-fingerprint", path: `${path}.outcomeFingerprint`, message: "Outcome fingerprint must bind the full immutable outcome projection." });
  }
  return issues;
}

function intervalIssues(value: unknown, path: string, level: 0.5 | 0.8, actualDays: number): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "A scored interval is required." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["level", "lowerDays", "upperDays", "covered"], path, issues);
  if (value.level !== level || !isFiniteNumber(value.lowerDays) || !isFiniteNumber(value.upperDays) || (isFiniteNumber(value.lowerDays) && isFiniteNumber(value.upperDays) && value.lowerDays > value.upperDays) || typeof value.covered !== "boolean") issues.push({ code: "invalid-row", path, message: "A finite ordered interval and inclusive coverage flag are required." });
  if (isFiniteNumber(value.lowerDays) && isFiniteNumber(value.upperDays) && typeof value.covered === "boolean" && value.covered !== (actualDays >= value.lowerDays && actualDays <= value.upperDays)) issues.push({ code: "invalid-row", path: `${path}.covered`, message: "Coverage must include both interval boundaries." });
  return issues;
}

export function validateForecastScoreArtifact(value: unknown): ForecastScoringValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "score", message: "Score artifact must be an object." }];
    const issues: ForecastScoringValidationIssue[] = [];
    exactKeys(value, ["scoreVersion", "mode", "forecastArtifactId", "forecastRunKey", "forecastSemanticFingerprint", "forecastGeneratedAt", "forecastDataCutoff", "sourceDatasetVersion", "sourceDatasetFingerprint", "sourceOutcomeFingerprint", "targetId", "targetKind", "releaseId", "platformId", "anchorEventId", "anchorStage", "anchorOccurredOn", "originOn", "modelFingerprint", "calibrationFingerprint", "modelCohortId", "predictedEligibleStage", "outcomeId", "outcomeEventId", "outcomeStage", "outcomeOccurredOn", "outcomeFirstObservedOn", "outcomeFirstObservedAt", "anchorSourceEvidenceIds", "outcomeSourceEvidenceIds", "actualDays", "pointEstimator", "pointDays", "signedErrorDays", "absoluteErrorDays", "intervals"], "score", issues);
    if (value.scoreVersion !== FORECAST_SCORE_VERSION) issues.push({ code: "unsupported-version", path: "score.scoreVersion", message: `Expected ${FORECAST_SCORE_VERSION}.` });
    if (value.mode !== FORECAST_ARTIFACT_MODE) issues.push({ code: "public-mode", path: "score.mode", message: "Score v1 is private shadow only." });
    for (const field of ["forecastArtifactId", "forecastRunKey", "forecastSemanticFingerprint", "sourceDatasetFingerprint", "sourceOutcomeFingerprint", "modelFingerprint", "calibrationFingerprint"] as const) if (!isSha(value[field])) issues.push({ code: "invalid-fingerprint", path: `score.${field}`, message: "An exact SHA-256 fingerprint is required." });
    if (value.sourceDatasetVersion !== HISTORICAL_ANALYSIS_DATASET_VERSION) issues.push({ code: "unsupported-version", path: "score.sourceDatasetVersion", message: "Score must bind historical-analysis-dataset/v1." });
    if (!isInstant(value.forecastGeneratedAt) || !isDay(value.forecastDataCutoff) || !isDay(value.anchorOccurredOn) || !isDay(value.originOn) || !isDay(value.outcomeOccurredOn) || !isDay(value.outcomeFirstObservedOn) || !isInstant(value.outcomeFirstObservedAt) || (isDay(value.outcomeFirstObservedOn) && isInstant(value.outcomeFirstObservedAt) && value.outcomeFirstObservedAt.slice(0, 10) !== value.outcomeFirstObservedOn) || (isDay(value.outcomeOccurredOn) && isDay(value.outcomeFirstObservedOn) && value.outcomeFirstObservedOn < value.outcomeOccurredOn)) issues.push({ code: "invalid-chronology", path: "score", message: "Canonical forecast and exact outcome chronology is required." });
    if (!["public-release", "next-eligible-prerelease-event"].includes(value.targetKind as string) || !isText(value.targetId) || !isText(value.releaseId) || !isText(value.platformId) || !isText(value.anchorEventId) || !isText(value.modelCohortId) || !isText(value.outcomeId) || !isText(value.outcomeEventId)) issues.push({ code: "invalid-row", path: "score", message: "Stable score identities and cohort are required." });
    if (typeof value.anchorStage !== "string" || !CANONICAL_STAGE.test(value.anchorStage) || typeof value.outcomeStage !== "string" || !CANONICAL_STAGE.test(value.outcomeStage)) issues.push({ code: "invalid-row", path: "score", message: "Canonical anchor and outcome stages are required." });
    if (isText(value.anchorEventId) && isText(value.outcomeEventId) && value.anchorEventId === value.outcomeEventId) issues.push({ code: "invalid-row", path: "score.outcomeEventId", message: "The scored outcome event must be distinct from its anchor." });
    if (value.targetKind === "public-release" && (value.predictedEligibleStage !== null || value.outcomeStage !== "public-release")) issues.push({ code: "invalid-row", path: "score", message: "Public-release scores cannot carry a prerelease stage prediction." });
    if (value.targetKind === "next-eligible-prerelease-event" && (!["developer-beta", "public-beta", "release-candidate"].includes(value.predictedEligibleStage as string) || typeof value.outcomeStage !== "string" || value.outcomeStage.split(":")[0] !== value.predictedEligibleStage)) issues.push({ code: "invalid-row", path: "score", message: "Next-event score stage must match the predicted eligible stage." });
    issues.push(...evidenceIssues(value.anchorSourceEvidenceIds, "score.anchorSourceEvidenceIds"));
    issues.push(...evidenceIssues(value.outcomeSourceEvidenceIds, "score.outcomeSourceEvidenceIds"));
    const estimatorIsValid = value.targetKind === "public-release"
      ? ["platform-stage-median", "hierarchical-platform-cadence"].includes(value.pointEstimator as string)
      : value.pointEstimator === "next-event-timing-median";
    if (!estimatorIsValid || !isFiniteNumber(value.actualDays) || !Number.isSafeInteger(value.actualDays) || value.actualDays < 1 || !isFiniteNumber(value.pointDays) || value.pointDays < 0 || !isFiniteNumber(value.signedErrorDays) || !isFiniteNumber(value.absoluteErrorDays)) issues.push({ code: "invalid-row", path: "score", message: "The exact upstream point estimator, finite timing values, and a positive integer realized interval are required." });
    if (isDay(value.anchorOccurredOn) && isDay(value.outcomeOccurredOn) && value.actualDays !== elapsedDays(value.anchorOccurredOn, value.outcomeOccurredOn)) issues.push({ code: "invalid-row", path: "score.actualDays", message: "Actual days must equal the source-backed calendar interval." });
    if (isFiniteNumber(value.actualDays) && isFiniteNumber(value.pointDays) && (value.signedErrorDays !== normalizeZero(value.actualDays - value.pointDays) || value.absoluteErrorDays !== Math.abs(value.actualDays - value.pointDays))) issues.push({ code: "invalid-row", path: "score", message: "Point error and signed bias contribution must be exact." });
    if (isDay(value.forecastDataCutoff) && isDay(value.originOn) && isDay(value.outcomeOccurredOn) && isInstant(value.outcomeFirstObservedAt)) {
      const cutoff = value.forecastDataCutoff > value.originOn ? value.forecastDataCutoff : value.originOn;
      if (value.outcomeOccurredOn <= cutoff || value.outcomeFirstObservedAt.slice(0, 10) <= cutoff || (isInstant(value.forecastGeneratedAt) && value.outcomeFirstObservedAt <= value.forecastGeneratedAt)) issues.push({ code: "invalid-chronology", path: "score", message: "A score outcome must occur and become known strictly after forecast origin and data cutoff." });
    }
    if (isSha(value.sourceOutcomeFingerprint)) {
      const projection = { targetId: value.targetId, targetKind: value.targetKind, releaseId: value.releaseId, platformId: value.platformId, anchorEventId: value.anchorEventId, anchorStage: value.anchorStage, anchorOccurredOn: value.anchorOccurredOn, targetEventId: value.outcomeEventId, targetStage: value.outcomeStage, occurredOn: value.outcomeOccurredOn, firstObservedOn: value.outcomeFirstObservedOn, firstObservedAt: value.outcomeFirstObservedAt, sourceEvidenceIds: value.outcomeSourceEvidenceIds } as Omit<ForecastOutcomeObservationV1, "observationVersion" | "sourceDatasetVersion" | "sourceDatasetFingerprint" | "sourceRowFingerprint" | "outcomeFingerprint" | "outcomeId">;
      if (value.sourceOutcomeFingerprint !== historicalAnalysisFingerprint(outcomeProjection(projection)) || value.outcomeId !== value.sourceOutcomeFingerprint) issues.push({ code: "invalid-fingerprint", path: "score.sourceOutcomeFingerprint", message: "Score must bind the full immutable outcome projection and exact outcome ID." });
    }
    if (!Array.isArray(value.intervals) || value.intervals.length !== 2 || !isFiniteNumber(value.actualDays)) issues.push({ code: "invalid-row", path: "score.intervals", message: "Exactly 50% and 80% score intervals are required." });
    else {
      issues.push(...intervalIssues(value.intervals[0], "score.intervals[0]", 0.5, value.actualDays));
      issues.push(...intervalIssues(value.intervals[1], "score.intervals[1]", 0.8, value.actualDays));
      const [fifty, eighty] = value.intervals;
      if (isRecord(fifty) && isRecord(eighty) && isFiniteNumber(fifty.lowerDays) && isFiniteNumber(fifty.upperDays) && isFiniteNumber(eighty.lowerDays) && isFiniteNumber(eighty.upperDays) && (fifty.lowerDays < eighty.lowerDays || fifty.upperDays > eighty.upperDays)) issues.push({ code: "invalid-row", path: "score.intervals", message: "The 50% interval must be nested within the 80% interval." });
    }
    if (byteLength(stableSerializeHistoricalAnalysis(value)) > FORECAST_SCORE_MAX_BYTES) issues.push({ code: "size-limit", path: "score", message: "Score artifact exceeds 64 KiB." });
    return issues;
  } catch {
    return [{ code: "invalid-input", path: "score", message: "Score artifact could not be validated safely." }];
  }
}

export function serializeForecastScoreArtifact(value: ForecastScoreArtifactV1): string {
  const issues = validateForecastScoreArtifact(value);
  if (issues.length) throw new ForecastScoringContractError(issues);
  return stableSerializeHistoricalAnalysis(value);
}

export function parseForecastScoreArtifact(bytes: Uint8Array): ForecastScoreArtifactV1 {
  try {
    if (bytes.byteLength > FORECAST_SCORE_MAX_BYTES) throw new ForecastScoringContractError([{ code: "size-limit", path: "score", message: "Score bytes exceed 64 KiB before decoding." }]);
    const text = decoder.decode(bytes);
    const value = JSON.parse(text) as unknown;
    const issues = validateForecastScoreArtifact(value);
    if (issues.length) throw new ForecastScoringContractError(issues);
    if (stableSerializeHistoricalAnalysis(value) !== text) throw new ForecastScoringContractError([{ code: "invalid-order", path: "score", message: "Stored score bytes are not canonical JSON." }]);
    return value as ForecastScoreArtifactV1;
  } catch (error) {
    if (error instanceof ForecastScoringContractError) throw error;
    throw new ForecastScoringContractError([{ code: "invalid-input", path: "score", message: "Stored score is not valid canonical UTF-8 JSON." }]);
  }
}

export function forecastScoreArtifactPath(artifactId: string): string {
  if (!isSha(artifactId)) throw new ForecastScoringContractError([{ code: "invalid-fingerprint", path: "scoreArtifactId", message: "Score path requires an exact raw SHA-256 digest." }]);
  return `forecast/scores/${artifactId}.json`;
}

export function forecastScoreArtifactId(value: ForecastScoreArtifactV1): string { return rawArtifactDigest(encoder.encode(serializeForecastScoreArtifact(value))); }

function entryBaseIssues(value: Record<string, unknown>, path: string, issues: ForecastScoringValidationIssue[]): void {
  if (!isSha(value.forecastArtifactId) || !isInstant(value.forecastGeneratedAt) || !isText(value.targetId) || !["public-release", "next-eligible-prerelease-event"].includes(value.targetKind as string) || !isText(value.releaseId) || !isText(value.platformId) || !isText(value.modelCohortId)) issues.push({ code: "invalid-row", path, message: "A reconciliation entry needs exact forecast, target, release, platform, and cohort identity." });
  if (!isRecord(value.targetSnapshot)) {
    issues.push({ code: "invalid-row", path: `${path}.targetSnapshot`, message: "A self-contained immutable target snapshot is required." });
    return;
  }
  const snapshot = value.targetSnapshot;
  exactKeys(snapshot, ["forecastTargetFingerprint", "forecastDataCutoff", "anchorEventId", "anchorStage", "anchorOccurredOn", "originOn", "anchorSourceEvidenceIds", "predictedEligibleStage"], `${path}.targetSnapshot`, issues);
  if (!isSha(snapshot.forecastTargetFingerprint) || !isDay(snapshot.forecastDataCutoff) || !isText(snapshot.anchorEventId) || typeof snapshot.anchorStage !== "string" || !CANONICAL_STAGE.test(snapshot.anchorStage) || !isDay(snapshot.anchorOccurredOn) || !isDay(snapshot.originOn) || snapshot.anchorOccurredOn > snapshot.originOn || snapshot.originOn > snapshot.forecastDataCutoff) issues.push({ code: "invalid-row", path: `${path}.targetSnapshot`, message: "The target snapshot must bind exact source-cutoff-bounded forecast chronology." });
  issues.push(...epochEvidenceIssues(snapshot.anchorSourceEvidenceIds, `${path}.targetSnapshot.anchorSourceEvidenceIds`));
  if (value.targetKind === "public-release" && snapshot.predictedEligibleStage !== null) issues.push({ code: "invalid-row", path: `${path}.targetSnapshot.predictedEligibleStage`, message: "Public-release targets cannot carry a prerelease stage prediction." });
  if (value.targetKind === "next-eligible-prerelease-event" && !["developer-beta", "public-beta", "release-candidate"].includes(snapshot.predictedEligibleStage as string)) issues.push({ code: "invalid-row", path: `${path}.targetSnapshot.predictedEligibleStage`, message: "Next-event targets require one closed eligible stage family." });
}

function scoreEntryIssues(value: unknown, path: string): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Score index entry must be an object." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["forecastArtifactId", "forecastGeneratedAt", "targetId", "targetKind", "releaseId", "platformId", "modelCohortId", "targetSnapshot", "scoreArtifactId", "outcomeId", "sourceDatasetFingerprint", "sourceRowFingerprint", "outcomeEventId", "outcomeStage", "outcomeOccurredOn", "outcomeFirstObservedOn", "outcomeFirstObservedAt", "outcomeSourceEvidenceIds", "actualDays", "pointDays", "signedErrorDays", "absoluteErrorDays", "coverage50", "coverage80"], path, issues);
  entryBaseIssues(value, path, issues);
  if (!isSha(value.scoreArtifactId) || !isSha(value.outcomeId) || !isSha(value.sourceDatasetFingerprint) || !isSha(value.sourceRowFingerprint) || !isText(value.outcomeEventId) || typeof value.outcomeStage !== "string" || !CANONICAL_STAGE.test(value.outcomeStage) || !isDay(value.outcomeOccurredOn) || !isDay(value.outcomeFirstObservedOn) || !isInstant(value.outcomeFirstObservedAt) || (isDay(value.outcomeFirstObservedOn) && isInstant(value.outcomeFirstObservedAt) && value.outcomeFirstObservedAt.slice(0, 10) !== value.outcomeFirstObservedOn) || !Number.isSafeInteger(value.actualDays) || (value.actualDays as number) < 1 || !isFiniteNumber(value.pointDays) || (value.pointDays as number) < 0 || !isFiniteNumber(value.signedErrorDays) || !isFiniteNumber(value.absoluteErrorDays) || typeof value.coverage50 !== "boolean" || typeof value.coverage80 !== "boolean") issues.push({ code: "invalid-row", path, message: "A score row requires exact source/outcome identity and finite scoring projections." });
  if (isDay(value.outcomeOccurredOn) && isDay(value.outcomeFirstObservedOn) && value.outcomeFirstObservedOn < value.outcomeOccurredOn) issues.push({ code: "invalid-chronology", path: `${path}.outcomeFirstObservedOn`, message: "An outcome cannot be observed before it occurs." });
  issues.push(...epochEvidenceIssues(value.outcomeSourceEvidenceIds, `${path}.outcomeSourceEvidenceIds`));
  const snapshot = isRecord(value.targetSnapshot) ? value.targetSnapshot : null;
  if (snapshot && isDay(snapshot.anchorOccurredOn) && isDay(value.outcomeOccurredOn) && value.actualDays !== elapsedDays(snapshot.anchorOccurredOn, value.outcomeOccurredOn)) issues.push({ code: "invalid-row", path: `${path}.actualDays`, message: "Indexed actual days must match the exact target and outcome days." });
  if (isFiniteNumber(value.actualDays) && isFiniteNumber(value.pointDays) && (value.signedErrorDays !== normalizeZero(value.actualDays - value.pointDays) || value.absoluteErrorDays !== Math.abs(value.actualDays - value.pointDays))) issues.push({ code: "invalid-row", path, message: "Indexed error projections must reconcile exactly." });
  if (value.targetKind === "public-release" && value.outcomeStage !== "public-release") issues.push({ code: "invalid-row", path: `${path}.outcomeStage`, message: "Public-release score rows require the public-release stage." });
  if (value.targetKind === "next-eligible-prerelease-event" && snapshot && typeof value.outcomeStage === "string" && value.outcomeStage.split(":")[0] !== snapshot.predictedEligibleStage) issues.push({ code: "invalid-row", path: `${path}.outcomeStage`, message: "Next-event score rows must match the predicted eligible stage family." });
  if (snapshot && isText(value.outcomeEventId) && isDay(value.outcomeOccurredOn) && isDay(value.outcomeFirstObservedOn) && isInstant(value.outcomeFirstObservedAt) && Array.isArray(value.outcomeSourceEvidenceIds)) {
    const rowProjection = { releaseId: value.releaseId, platformId: value.platformId, targetEventId: value.outcomeEventId, targetStage: value.outcomeStage, occurredOn: value.outcomeOccurredOn, firstObservedOn: value.outcomeFirstObservedOn, sourceEvidenceIds: value.outcomeSourceEvidenceIds } as Pick<ForecastOutcomeObservationV1, "releaseId" | "platformId" | "targetEventId" | "targetStage" | "occurredOn" | "firstObservedOn" | "sourceEvidenceIds">;
    if (isSha(value.sourceRowFingerprint) && value.sourceRowFingerprint !== historicalAnalysisFingerprint(outcomeRowProjection(rowProjection))) issues.push({ code: "invalid-fingerprint", path: `${path}.sourceRowFingerprint`, message: "Indexed source row fingerprint must bind the exact canonical dataset row." });
    const projection = { targetId: value.targetId, targetKind: value.targetKind, releaseId: value.releaseId, platformId: value.platformId, anchorEventId: snapshot.anchorEventId, anchorStage: snapshot.anchorStage, anchorOccurredOn: snapshot.anchorOccurredOn, targetEventId: value.outcomeEventId, targetStage: value.outcomeStage, occurredOn: value.outcomeOccurredOn, firstObservedOn: value.outcomeFirstObservedOn, firstObservedAt: value.outcomeFirstObservedAt, sourceEvidenceIds: value.outcomeSourceEvidenceIds } as Omit<ForecastOutcomeObservationV1, "observationVersion" | "sourceDatasetVersion" | "sourceDatasetFingerprint" | "sourceRowFingerprint" | "outcomeFingerprint" | "outcomeId">;
    if (isSha(value.outcomeId) && value.outcomeId !== historicalAnalysisFingerprint(outcomeProjection(projection))) issues.push({ code: "invalid-fingerprint", path: `${path}.outcomeId`, message: "Indexed outcome ID must bind the full immutable outcome projection." });
  }
  return issues;
}

function pendingEntryIssues(value: unknown, path: string): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Pending index entry must be an object." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["forecastArtifactId", "forecastGeneratedAt", "targetId", "targetKind", "releaseId", "platformId", "modelCohortId", "targetSnapshot", "reason"], path, issues);
  entryBaseIssues(value, path, issues);
  if (value.reason !== "outcome-not-yet-known") issues.push({ code: "invalid-row", path: `${path}.reason`, message: "Pending v1 has one exact reason." });
  return issues;
}

function gapCore(value: Omit<ForecastReconciliationDataGapEntryV1, "gapId">) { return value; }
function gapEntryIssues(value: unknown, path: string): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Data-gap index entry must be an object." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["forecastArtifactId", "forecastGeneratedAt", "targetId", "targetKind", "releaseId", "platformId", "modelCohortId", "targetSnapshot", "gapId", "outcomeId", "reason", "sourceEvidenceIds"], path, issues);
  entryBaseIssues(value, path, issues);
  const reasons: ForecastDataGapReason[] = ["ambiguous-outcome", "identity-mismatch", "next-event-stage-mismatch", "ambiguous-chronology", "missing-anchor-row", "missing-observation-instant", "outcome-retracted", "outcome-superseded", "source-dataset-mismatch", "terminal-or-ineligible-next-event"];
  if (!isSha(value.gapId) || !(value.outcomeId === null || isText(value.outcomeId)) || !reasons.includes(value.reason as ForecastDataGapReason)) issues.push({ code: "invalid-row", path, message: "A deterministic data-gap identity, optional outcome, and closed reason are required." });
  issues.push(...epochEvidenceIssues(value.sourceEvidenceIds, `${path}.sourceEvidenceIds`));
  if (isSha(value.gapId)) {
    const withoutId = { forecastArtifactId: value.forecastArtifactId, forecastGeneratedAt: value.forecastGeneratedAt, targetId: value.targetId, targetKind: value.targetKind, releaseId: value.releaseId, platformId: value.platformId, modelCohortId: value.modelCohortId, targetSnapshot: value.targetSnapshot, outcomeId: value.outcomeId, reason: value.reason, sourceEvidenceIds: value.sourceEvidenceIds } as Omit<ForecastReconciliationDataGapEntryV1, "gapId">;
    if (value.gapId !== historicalAnalysisFingerprint(gapCore(withoutId))) issues.push({ code: "invalid-fingerprint", path: `${path}.gapId`, message: "Gap ID must bind the complete gap row." });
  }
  return issues;
}

function auditCore(value: Omit<ForecastReconciliationAuditEntryV1, "auditId">) { return value; }
function auditEntryKey(value: ForecastReconciliationAuditEntryV1): string { return `${statusKey(value)}\u0000${value.auditId}`; }
function auditEntryIssues(value: unknown, path: string): ForecastScoringValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Outcome audit entry must be an object." }];
  const issues: ForecastScoringValidationIssue[] = [];
  exactKeys(value, ["forecastArtifactId", "forecastGeneratedAt", "targetId", "targetKind", "releaseId", "platformId", "modelCohortId", "targetSnapshot", "auditId", "reason", "previousScoreArtifactId", "previousOutcomeFingerprint", "replacementScoreArtifactId", "replacementOutcomeFingerprint", "sourceDatasetFingerprint", "sourceEvidenceIds"], path, issues);
  entryBaseIssues(value, path, issues);
  const reasons: ForecastOutcomeAuditReason[] = ["outcome-date-corrected", "outcome-evidence-corrected", "outcome-stage-corrected", "outcome-observation-time-corrected", "outcome-identity-corrected", "outcome-retracted", "outcome-superseded"];
  if (!isSha(value.auditId) || !reasons.includes(value.reason as ForecastOutcomeAuditReason) || !isSha(value.previousScoreArtifactId) || !isSha(value.previousOutcomeFingerprint) || !(value.replacementScoreArtifactId === null || isSha(value.replacementScoreArtifactId)) || !(value.replacementOutcomeFingerprint === null || isSha(value.replacementOutcomeFingerprint)) || (value.replacementScoreArtifactId === null) !== (value.replacementOutcomeFingerprint === null) || !isSha(value.sourceDatasetFingerprint)) issues.push({ code: "invalid-row", path, message: "Audit row must bind exact prior/replacement scores, outcome fingerprints, dataset, and a closed correction reason." });
  issues.push(...epochEvidenceIssues(value.sourceEvidenceIds, `${path}.sourceEvidenceIds`));
  if (isSha(value.auditId)) {
    const withoutId = { forecastArtifactId: value.forecastArtifactId, forecastGeneratedAt: value.forecastGeneratedAt, targetId: value.targetId, targetKind: value.targetKind, releaseId: value.releaseId, platformId: value.platformId, modelCohortId: value.modelCohortId, targetSnapshot: value.targetSnapshot, reason: value.reason, previousScoreArtifactId: value.previousScoreArtifactId, previousOutcomeFingerprint: value.previousOutcomeFingerprint, replacementScoreArtifactId: value.replacementScoreArtifactId, replacementOutcomeFingerprint: value.replacementOutcomeFingerprint, sourceDatasetFingerprint: value.sourceDatasetFingerprint, sourceEvidenceIds: value.sourceEvidenceIds } as Omit<ForecastReconciliationAuditEntryV1, "auditId">;
    if (value.auditId !== historicalAnalysisFingerprint(auditCore(withoutId))) issues.push({ code: "invalid-fingerprint", path: `${path}.auditId`, message: "Audit ID must bind the complete correction/retraction row." });
  }
  return issues;
}

function indexBody(value: Omit<ForecastReconciliationIndexV1, "indexFingerprint">) { return value; }
function indexBudgetBody(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== "indexFingerprint" && key !== "epochStopReason"));
}
function indexWithoutFingerprint(value: ForecastReconciliationIndexV1): Omit<ForecastReconciliationIndexV1, "indexFingerprint"> {
  return { indexVersion: value.indexVersion, mode: value.mode, compatibleForecastArtifactVersion: value.compatibleForecastArtifactVersion, compatibleScoreVersion: value.compatibleScoreVersion, reconciliationCutoffAt: value.reconciliationCutoffAt, reconciliationCutoffDate: value.reconciliationCutoffDate, evaluationEpoch: value.evaluationEpoch, epochStopReason: value.epochStopReason, sourceForecastArtifactIds: value.sourceForecastArtifactIds, sourceForecasts: value.sourceForecasts, scores: value.scores, pending: value.pending, dataGaps: value.dataGaps, audit: value.audit };
}

export function validateForecastReconciliationIndex(value: unknown, scoreArtifacts?: ReadonlyMap<string, ForecastScoreArtifactV1>, forecastArtifacts?: ReadonlyMap<string, ForecastArtifactV1>): ForecastScoringValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "index", message: "Reconciliation index must be an object." }];
    const issues: ForecastScoringValidationIssue[] = [];
    exactKeys(value, ["indexVersion", "mode", "compatibleForecastArtifactVersion", "compatibleScoreVersion", "reconciliationCutoffAt", "reconciliationCutoffDate", "evaluationEpoch", "epochStopReason", "sourceForecastArtifactIds", "sourceForecasts", "scores", "pending", "dataGaps", "audit", "indexFingerprint"], "index", issues);
    if (value.indexVersion !== FORECAST_RECONCILIATION_INDEX_VERSION || value.compatibleForecastArtifactVersion !== FORECAST_ARTIFACT_VERSION || value.compatibleScoreVersion !== FORECAST_SCORE_VERSION) issues.push({ code: "unsupported-version", path: "index", message: "Reconciliation index versions must be exact v1 contracts." });
    if (value.mode !== FORECAST_ARTIFACT_MODE) issues.push({ code: "public-mode", path: "index.mode", message: "Reconciliation index v1 is private shadow only." });
    if (!isInstant(value.reconciliationCutoffAt) || !isDay(value.reconciliationCutoffDate) || (isInstant(value.reconciliationCutoffAt) && value.reconciliationCutoffAt.slice(0, 10) !== value.reconciliationCutoffDate)) issues.push({ code: "invalid-chronology", path: "index.reconciliationCutoffAt", message: "A canonical exact cutoff instant and its derived UTC day are required." });
    issues.push(...validateForecastShadowEvaluationEpoch(value.evaluationEpoch, "index.evaluationEpoch"));
    if (!(value.epochStopReason === null || ["epoch-end-reached", "forecast-artifact-limit-reached", "target-row-limit-reached", "audit-row-limit-reached", "index-byte-budget-reached"].includes(value.epochStopReason as string))) issues.push({ code: "invalid-row", path: "index.epochStopReason", message: "Epoch stop reason must be null or one closed bounded reason." });
    if (!Array.isArray(value.sourceForecastArtifactIds) || value.sourceForecastArtifactIds.some((id) => !isSha(id)) || stableSerializeHistoricalAnalysis(value.sourceForecastArtifactIds) !== stableSerializeHistoricalAnalysis(sortedUnique((value.sourceForecastArtifactIds ?? []) as string[]))) issues.push({ code: "invalid-order", path: "index.sourceForecastArtifactIds", message: "Forecast artifact IDs must be unique SHA-256 values in canonical order." });
    if (!Array.isArray(value.sourceForecasts) || !Array.isArray(value.scores) || !Array.isArray(value.pending) || !Array.isArray(value.dataGaps) || !Array.isArray(value.audit)) return [...issues, { code: "invalid-row", path: "index", message: "Source-forecast, score, pending, data-gap, and audit arrays are required." }];
    value.sourceForecasts.forEach((source, index) => {
      const path = `index.sourceForecasts[${index}]`;
      if (!isRecord(source)) { issues.push({ code: "invalid-row", path, message: "Source forecast row must be an object." }); return; }
      exactKeys(source, ["forecastArtifactId", "forecastRunKey", "scheduledFor", "generatedAt"], path, issues);
      if (!isSha(source.forecastArtifactId) || !isSha(source.forecastRunKey) || !isDay(source.scheduledFor) || !isInstant(source.generatedAt) || (isDay(source.scheduledFor) && isInstant(source.generatedAt) && source.scheduledFor > source.generatedAt.slice(0, 10))) issues.push({ code: "invalid-row", path, message: "Source forecast rows require exact artifact, run, schedule, and generation identity." });
    });
    const sourceForecasts = value.sourceForecasts as ForecastReconciliationSourceForecastV1[];
    if (stableSerializeHistoricalAnalysis(sourceForecasts) !== stableSerializeHistoricalAnalysis([...sourceForecasts].sort((left, right) => textOrder(sourceForecastKey(left), sourceForecastKey(right)))) || new Set(sourceForecasts.map((source) => source.forecastRunKey)).size !== sourceForecasts.length || new Set(sourceForecasts.map((source) => source.scheduledFor)).size !== sourceForecasts.length || new Set(sourceForecasts.map((source) => source.forecastArtifactId)).size !== sourceForecasts.length) issues.push({ code: "invalid-order", path: "index.sourceForecasts", message: "The epoch admits one unique canonical run per scheduled day in canonical order." });
    if (stableSerializeHistoricalAnalysis(sortedUnique(sourceForecasts.map((source) => source.forecastArtifactId))) !== stableSerializeHistoricalAnalysis(value.sourceForecastArtifactIds)) issues.push({ code: "invalid-row", path: "index.sourceForecastArtifactIds", message: "Source forecast IDs must derive exactly from the bounded sampled run rows." });
    const epoch = isRecord(value.evaluationEpoch) ? value.evaluationEpoch : {};
    if (sourceForecasts.some((source) => isDay(source.scheduledFor) && isDay(epoch.startsOn) && isDay(epoch.endsOn) && (source.scheduledFor < epoch.startsOn || source.scheduledFor > epoch.endsOn))) issues.push({ code: "invalid-chronology", path: "index.sourceForecasts", message: "Every sampled forecast day must fall inside the declared evaluation epoch." });
    if (sourceForecasts.length > FORECAST_SHADOW_EPOCH_MAX_FORECASTS) issues.push({ code: "row-limit", path: "index.sourceForecasts", message: "The epoch forecast-artifact limit was exceeded." });
    if (value.scores.length > FORECAST_RECONCILIATION_MAX_ROWS || value.pending.length > FORECAST_RECONCILIATION_MAX_ROWS || value.dataGaps.length > FORECAST_RECONCILIATION_MAX_ROWS || value.audit.length > FORECAST_RECONCILIATION_MAX_ROWS || value.audit.length > FORECAST_SHADOW_EPOCH_MAX_AUDITS || value.scores.length + value.pending.length + value.dataGaps.length > FORECAST_RECONCILIATION_MAX_ROWS) issues.push({ code: "row-limit", path: "index", message: "Reconciliation rows exceed the v1 or bounded-epoch limits." });
    value.scores.forEach((entry, index) => issues.push(...scoreEntryIssues(entry, `index.scores[${index}]`)));
    value.pending.forEach((entry, index) => issues.push(...pendingEntryIssues(entry, `index.pending[${index}]`)));
    value.dataGaps.forEach((entry, index) => issues.push(...gapEntryIssues(entry, `index.dataGaps[${index}]`)));
    value.audit.forEach((entry, index) => issues.push(...auditEntryIssues(entry, `index.audit[${index}]`)));
    const scores = value.scores as ForecastReconciliationScoreEntryV1[];
    const pending = value.pending as ForecastReconciliationPendingEntryV1[];
    const gaps = value.dataGaps as ForecastReconciliationDataGapEntryV1[];
    const audit = value.audit as ForecastReconciliationAuditEntryV1[];
    if (stableSerializeHistoricalAnalysis(scores) !== stableSerializeHistoricalAnalysis([...scores].sort((a, b) => textOrder(scoreEntryKey(a), scoreEntryKey(b))))) issues.push({ code: "invalid-order", path: "index.scores", message: "Score entries must be in canonical order." });
    if (stableSerializeHistoricalAnalysis(pending) !== stableSerializeHistoricalAnalysis([...pending].sort((a, b) => textOrder(pendingEntryKey(a), pendingEntryKey(b))))) issues.push({ code: "invalid-order", path: "index.pending", message: "Pending entries must be in canonical order." });
    if (stableSerializeHistoricalAnalysis(gaps) !== stableSerializeHistoricalAnalysis([...gaps].sort((a, b) => textOrder(gapEntryKey(a), gapEntryKey(b))))) issues.push({ code: "invalid-order", path: "index.dataGaps", message: "Data-gap entries must be in canonical order." });
    if (stableSerializeHistoricalAnalysis(audit) !== stableSerializeHistoricalAnalysis([...audit].sort((a, b) => textOrder(auditEntryKey(a), auditEntryKey(b)))) || new Set(audit.map((entry) => entry.auditId)).size !== audit.length) issues.push({ code: "invalid-order", path: "index.audit", message: "Audit entries must be unique and in canonical order." });
    const allKeys = [...scores.map(scoreEntryKey), ...pending.map(pendingEntryKey), ...gaps.map(gapEntryKey)];
    if (new Set(allKeys).size !== allKeys.length) issues.push({ code: "invalid-row", path: "index", message: "Each forecast target can have exactly one reconciliation state." });
    if (allKeys.length > FORECAST_SHADOW_EPOCH_MAX_TARGETS) issues.push({ code: "row-limit", path: "index", message: "The evaluation epoch target-row limit was exceeded." });
    const referencedForecasts = sortedUnique([...scores, ...pending, ...gaps, ...audit].map((entry) => entry.forecastArtifactId));
    if (Array.isArray(value.sourceForecastArtifactIds) && referencedForecasts.some((id) => !(value.sourceForecastArtifactIds as string[]).includes(id))) issues.push({ code: "incompatible-artifact", path: "index.sourceForecastArtifactIds", message: "Every status and audit forecast must be present in the exact source forecast set." });
    const sourceForecastById = new Map(sourceForecasts.map((source) => [source.forecastArtifactId, source]));
    if ([...scores, ...pending, ...gaps, ...audit].some((entry) => sourceForecastById.get(entry.forecastArtifactId)?.generatedAt !== entry.forecastGeneratedAt)) issues.push({ code: "incompatible-artifact", path: "index", message: "Every state and audit row must retain its sampled forecast generation instant." });
    const reconciliationCutoffAt = isInstant(value.reconciliationCutoffAt) ? value.reconciliationCutoffAt : null;
    if (reconciliationCutoffAt && sourceForecasts.some((source) => isInstant(source.generatedAt) && source.generatedAt > reconciliationCutoffAt)) issues.push({ code: "invalid-chronology", path: "index.sourceForecasts", message: "A reconciliation snapshot cannot sample a forecast generated after its exact cutoff." });
    if (reconciliationCutoffAt && [...scores, ...pending, ...gaps].some((entry) => isInstant(entry.forecastGeneratedAt) && entry.forecastGeneratedAt > reconciliationCutoffAt)) issues.push({ code: "invalid-chronology", path: "index", message: "A reconciliation snapshot cannot include a future forecast artifact." });
    if (reconciliationCutoffAt && scores.some((entry) => isInstant(entry.outcomeFirstObservedAt) && entry.outcomeFirstObservedAt > reconciliationCutoffAt)) issues.push({ code: "invalid-chronology", path: "index.scores", message: "A reconciliation snapshot cannot include an outcome observed after its exact cutoff." });
    const indexBudgetBytes = byteLength(stableSerializeHistoricalAnalysis(indexBudgetBody(value)));
    const activeStopReasons = new Set<ForecastShadowEpochStopReason>();
    if (sourceForecasts.length >= FORECAST_SHADOW_EPOCH_MAX_FORECASTS) activeStopReasons.add("forecast-artifact-limit-reached");
    if (allKeys.length >= FORECAST_SHADOW_EPOCH_MAX_TARGETS) activeStopReasons.add("target-row-limit-reached");
    if (audit.length >= FORECAST_SHADOW_EPOCH_MAX_AUDITS) activeStopReasons.add("audit-row-limit-reached");
    if (indexBudgetBytes >= FORECAST_SHADOW_EPOCH_INDEX_BYTE_BUDGET) activeStopReasons.add("index-byte-budget-reached");
    if (isDay(value.reconciliationCutoffDate) && isDay(epoch.endsOn) && value.reconciliationCutoffDate > epoch.endsOn) activeStopReasons.add("epoch-end-reached");
    // A non-null value is historical transition state: the first trigger is
    // immutable even if a later correction makes a soft byte trigger no
    // longer observable from the current root alone. Null is valid only while
    // no fixed stop condition is active. Reconciliation below preserves the
    // prior non-null value and is the contextual transition validator.
    if (value.epochStopReason === null && activeStopReasons.size > 0) {
      issues.push({ code: "invalid-row", path: "index.epochStopReason", message: "The first fixed epoch limit must persist a stop reason." });
    }
    if (scoreArtifacts) {
      for (const entry of scores) {
        const score = scoreArtifacts.get(entry.scoreArtifactId);
        if (!score || validateForecastScoreArtifact(score).length || forecastScoreArtifactId(score) !== entry.scoreArtifactId || stableSerializeHistoricalAnalysis(scoreEntryFromArtifact(entryBase(entry), entry.scoreArtifactId, score)) !== stableSerializeHistoricalAnalysis(entry)) issues.push({ code: "incompatible-artifact", path: "index.scores", message: "Each score entry must bind one exact content-addressed score artifact and complete indexed projection." });
      }
      for (const entry of audit) {
        const previous = scoreArtifacts.get(entry.previousScoreArtifactId);
        const replacement = entry.replacementScoreArtifactId ? scoreArtifacts.get(entry.replacementScoreArtifactId) : null;
        if (!previous || previous.sourceOutcomeFingerprint !== entry.previousOutcomeFingerprint || (entry.replacementScoreArtifactId !== null && (!replacement || replacement.sourceOutcomeFingerprint !== entry.replacementOutcomeFingerprint))) issues.push({ code: "incompatible-artifact", path: "index.audit", message: "Audit rows must retain exact immutable prior and replacement score projections." });
      }
    }
    if (forecastArtifacts && Array.isArray(value.sourceForecastArtifactIds)) {
      const sourceIds = value.sourceForecastArtifactIds as string[];
      for (const id of sourceIds) {
        const forecast = forecastArtifacts.get(id);
        const source = sourceForecastById.get(id);
        if (!forecast || !source || validateForecastArtifact(forecast).length || forecast.artifactId !== id || forecast.runKey !== source.forecastRunKey || forecast.runIdentity.scheduledFor !== source.scheduledFor || forecast.generatedAt !== source.generatedAt) issues.push({ code: "incompatible-artifact", path: "index.sourceForecastArtifactIds", message: "Every source forecast ID must resolve to one exact validated sampled run artifact." });
      }
      const expectedKeys = sortedUnique(sourceIds.flatMap((id) => (forecastArtifacts.get(id)?.targets ?? []).filter((target) => target.availability === "available").map((target) => statusKey({ forecastArtifactId: id, targetKind: target.targetKind, targetId: target.targetId }))));
      const actualKeys = [...scores.map(scoreEntryKey), ...pending.map(pendingEntryKey), ...gaps.map(gapEntryKey)].sort(textOrder);
      if (stableSerializeHistoricalAnalysis(expectedKeys) !== stableSerializeHistoricalAnalysis(actualKeys)) issues.push({ code: "incompatible-artifact", path: "index", message: "Index must contain exactly one state row for every available target in the complete source forecast set." });
      const entriesByKey = new Map([...scores, ...pending, ...gaps].map((entry) => [statusKey(entry), entry]));
      for (const id of sourceIds) for (const target of forecastArtifacts.get(id)?.targets ?? []) {
        if (target.availability !== "available") continue;
        const forecast = forecastArtifacts.get(id)!;
        const expected = targetBase(target, forecast);
        const actual = entriesByKey.get(statusKey(expected));
        if (!actual || stableSerializeHistoricalAnalysis(entryBase(actual)) !== stableSerializeHistoricalAnalysis(expected)) issues.push({ code: "incompatible-artifact", path: "index", message: "Every state row must retain the exact immutable target snapshot from its source forecast." });
      }
    }
    if (!isSha(value.indexFingerprint) || value.indexFingerprint !== historicalAnalysisFingerprint(indexBody(indexWithoutFingerprint(value as unknown as ForecastReconciliationIndexV1)))) issues.push({ code: "invalid-fingerprint", path: "index.indexFingerprint", message: "Index fingerprint must bind the complete reconciliation snapshot." });
    if (byteLength(stableSerializeHistoricalAnalysis(value)) > FORECAST_RECONCILIATION_INDEX_MAX_BYTES) issues.push({ code: "size-limit", path: "index", message: "Reconciliation index exceeds 1 MiB." });
    return issues;
  } catch {
    return [{ code: "invalid-input", path: "index", message: "Reconciliation index could not be validated safely." }];
  }
}

function makeReconciliationIndex(input: Omit<ForecastReconciliationIndexV1, "indexFingerprint">): ForecastReconciliationIndexV1 {
  const index = { ...input, indexFingerprint: historicalAnalysisFingerprint(indexBody(input)) };
  const issues = validateForecastReconciliationIndex(index);
  if (issues.length) throw new ForecastScoringContractError(issues);
  return index;
}

export function serializeForecastReconciliationIndex(value: ForecastReconciliationIndexV1): string {
  const issues = validateForecastReconciliationIndex(value);
  if (issues.length) throw new ForecastScoringContractError(issues);
  return stableSerializeHistoricalAnalysis(value);
}

export function parseForecastReconciliationIndex(bytes: Uint8Array): ForecastReconciliationIndexV1 {
  try {
    if (bytes.byteLength > FORECAST_RECONCILIATION_INDEX_MAX_BYTES) throw new ForecastScoringContractError([{ code: "size-limit", path: "index", message: "Reconciliation bytes exceed 1 MiB before decoding." }]);
    const text = decoder.decode(bytes);
    const value = JSON.parse(text) as unknown;
    const issues = validateForecastReconciliationIndex(value);
    if (issues.length) throw new ForecastScoringContractError(issues);
    if (stableSerializeHistoricalAnalysis(value) !== text) throw new ForecastScoringContractError([{ code: "invalid-order", path: "index", message: "Stored reconciliation bytes are not canonical JSON." }]);
    return value as ForecastReconciliationIndexV1;
  } catch (error) {
    if (error instanceof ForecastScoringContractError) throw error;
    throw new ForecastScoringContractError([{ code: "invalid-input", path: "index", message: "Stored reconciliation index is not valid canonical UTF-8 JSON." }]);
  }
}

export function forecastReconciliationIndexArtifactId(value: ForecastReconciliationIndexV1): string { return rawArtifactDigest(encoder.encode(serializeForecastReconciliationIndex(value))); }

/**
 * Validate a stored reconciliation root by both its raw content address and
 * the complete typed v1 index contract. This is the single validator used at
 * every pointer transition and runtime preflight boundary.
 */
export function isValidForecastReconciliationRoot(
  bytes: Uint8Array,
  expectedArtifactId: string,
): boolean {
  try {
    if (!isSha(expectedArtifactId) || rawArtifactDigest(bytes) !== expectedArtifactId) {
      return false;
    }
    return forecastReconciliationIndexArtifactId(
      parseForecastReconciliationIndex(bytes),
    ) === expectedArtifactId;
  } catch {
    return false;
  }
}

function targetBase(target: Extract<ForecastArtifactTargetV1, { availability: "available" }>, forecast: ForecastArtifactV1): ForecastReconciliationEntryBaseV1 {
  return {
    forecastArtifactId: forecast.artifactId,
    forecastGeneratedAt: forecast.generatedAt,
    targetId: target.targetId,
    targetKind: target.targetKind,
    releaseId: target.releaseId,
    platformId: target.platformId,
    modelCohortId: target.cohort.modelCohortId,
    targetSnapshot: {
      forecastTargetFingerprint: historicalAnalysisFingerprint(target),
      forecastDataCutoff: forecast.provenance.sourceAsOfDate,
      anchorEventId: target.anchorEventId,
      anchorStage: target.anchorStage,
      anchorOccurredOn: target.anchorOccurredOn,
      originOn: target.originOn,
      anchorSourceEvidenceIds: [...target.sourceEvidenceIds],
      predictedEligibleStage: target.targetKind === "next-eligible-prerelease-event" ? target.predictedEligibleStage : null,
    },
  };
}

function entryBase(value: ForecastReconciliationEntryBaseV1): ForecastReconciliationEntryBaseV1 {
  return {
    forecastArtifactId: value.forecastArtifactId,
    forecastGeneratedAt: value.forecastGeneratedAt,
    targetId: value.targetId,
    targetKind: value.targetKind,
    releaseId: value.releaseId,
    platformId: value.platformId,
    modelCohortId: value.modelCohortId,
    targetSnapshot: value.targetSnapshot,
  };
}

function makeGap(base: ForecastReconciliationEntryBaseV1, outcomeId: string | null, reason: ForecastDataGapReason, evidence: readonly string[]): ForecastReconciliationDataGapEntryV1 {
  const withoutId: Omit<ForecastReconciliationDataGapEntryV1, "gapId"> = { ...base, outcomeId, reason, sourceEvidenceIds: sortedUnique(evidence) };
  return { ...withoutId, gapId: historicalAnalysisFingerprint(gapCore(withoutId)) };
}

function makeAudit(base: ForecastReconciliationEntryBaseV1, reason: ForecastOutcomeAuditReason, previousScoreArtifactId: string, previousOutcomeFingerprint: string, replacementScoreArtifactId: string | null, replacementOutcomeFingerprint: string | null, sourceDatasetFingerprint: string, evidence: readonly string[]): ForecastReconciliationAuditEntryV1 {
  const withoutId: Omit<ForecastReconciliationAuditEntryV1, "auditId"> = { ...base, reason, previousScoreArtifactId, previousOutcomeFingerprint, replacementScoreArtifactId, replacementOutcomeFingerprint, sourceDatasetFingerprint, sourceEvidenceIds: sortedUnique(evidence) };
  return { ...withoutId, auditId: historicalAnalysisFingerprint(auditCore(withoutId)) };
}

function exactOutcomeIdentity(base: ForecastReconciliationEntryBaseV1, outcome: ForecastOutcomeObservationV1): boolean {
  return outcome.targetId === base.targetId
    && outcome.targetKind === base.targetKind
    && outcome.releaseId === base.releaseId
    && outcome.platformId === base.platformId
    && outcome.anchorEventId === base.targetSnapshot.anchorEventId
    && outcome.anchorStage === base.targetSnapshot.anchorStage
    && outcome.anchorOccurredOn === base.targetSnapshot.anchorOccurredOn;
}

function scoreFromOutcome(forecast: ForecastArtifactV1, target: Extract<ForecastArtifactTargetV1, { availability: "available" }>, outcome: ForecastOutcomeObservationV1): ForecastScoreArtifactV1 {
  const actualDays = elapsedDays(target.anchorOccurredOn, outcome.occurredOn);
  const signedErrorDays = normalizeZero(actualDays - target.prediction.pointDays);
  const intervals = target.prediction.intervals.map((interval) => ({ level: interval.level, lowerDays: interval.lowerDays, upperDays: interval.upperDays, covered: actualDays >= interval.lowerDays && actualDays <= interval.upperDays })) as unknown as readonly [ForecastScoreIntervalV1, ForecastScoreIntervalV1];
  const score: ForecastScoreArtifactV1 = {
    scoreVersion: FORECAST_SCORE_VERSION,
    mode: FORECAST_ARTIFACT_MODE,
    forecastArtifactId: forecast.artifactId,
    forecastRunKey: forecast.runKey,
    forecastSemanticFingerprint: forecast.semanticFingerprint,
    forecastGeneratedAt: forecast.generatedAt,
    forecastDataCutoff: forecast.provenance.sourceAsOfDate,
    sourceDatasetVersion: outcome.sourceDatasetVersion,
    sourceDatasetFingerprint: outcome.sourceDatasetFingerprint,
    sourceOutcomeFingerprint: outcome.outcomeFingerprint,
    targetId: target.targetId,
    targetKind: target.targetKind,
    releaseId: target.releaseId,
    platformId: target.platformId,
    anchorEventId: target.anchorEventId,
    anchorStage: target.anchorStage,
    anchorOccurredOn: target.anchorOccurredOn,
    originOn: target.originOn,
    modelFingerprint: target.modelFingerprint,
    calibrationFingerprint: target.calibrationFingerprint,
    modelCohortId: target.cohort.modelCohortId,
    predictedEligibleStage: target.targetKind === "next-eligible-prerelease-event" ? target.predictedEligibleStage : null,
    outcomeId: outcome.outcomeId,
    outcomeEventId: outcome.targetEventId,
    outcomeStage: outcome.targetStage,
    outcomeOccurredOn: outcome.occurredOn,
    outcomeFirstObservedOn: outcome.firstObservedOn,
    outcomeFirstObservedAt: outcome.firstObservedAt,
    anchorSourceEvidenceIds: sortedUnique(target.sourceEvidenceIds),
    outcomeSourceEvidenceIds: [...outcome.sourceEvidenceIds],
    actualDays,
    pointEstimator: target.prediction.pointEstimator,
    pointDays: target.prediction.pointDays,
    signedErrorDays,
    absoluteErrorDays: Math.abs(signedErrorDays),
    intervals,
  };
  const issues = validateForecastScoreArtifact(score);
  if (issues.length) throw new ForecastScoringContractError(issues);
  return score;
}

function scoreEntryFromArtifact(base: ForecastReconciliationEntryBaseV1, scoreArtifactId: string, score: ForecastScoreArtifactV1): ForecastReconciliationScoreEntryV1 {
  return {
    ...base,
    scoreArtifactId,
    outcomeId: score.outcomeId,
    sourceDatasetFingerprint: score.sourceDatasetFingerprint,
    sourceRowFingerprint: historicalAnalysisFingerprint(outcomeRowProjection({
      releaseId: score.releaseId,
      platformId: score.platformId,
      targetEventId: score.outcomeEventId,
      targetStage: score.outcomeStage,
      occurredOn: score.outcomeOccurredOn,
      firstObservedOn: score.outcomeFirstObservedOn,
      sourceEvidenceIds: score.outcomeSourceEvidenceIds,
    })),
    outcomeEventId: score.outcomeEventId,
    outcomeStage: score.outcomeStage,
    outcomeOccurredOn: score.outcomeOccurredOn,
    outcomeFirstObservedOn: score.outcomeFirstObservedOn,
    outcomeFirstObservedAt: score.outcomeFirstObservedAt,
    outcomeSourceEvidenceIds: [...score.outcomeSourceEvidenceIds],
    actualDays: score.actualDays,
    pointDays: score.pointDays,
    signedErrorDays: score.signedErrorDays,
    absoluteErrorDays: score.absoluteErrorDays,
    coverage50: score.intervals[0].covered,
    coverage80: score.intervals[1].covered,
  };
}

export function validateForecastScoreAgainstForecast(score: ForecastScoreArtifactV1, forecast: ForecastArtifactV1): ForecastScoringValidationIssue[] {
  const issues = [...validateForecastScoreArtifact(score)];
  if (validateForecastArtifact(forecast).length || score.forecastArtifactId !== forecast.artifactId || score.forecastRunKey !== forecast.runKey || score.forecastSemanticFingerprint !== forecast.semanticFingerprint || score.forecastGeneratedAt !== forecast.generatedAt || score.forecastDataCutoff !== forecast.provenance.sourceAsOfDate) return [...issues, { code: "incompatible-artifact", path: "score.forecastArtifactId", message: "Score does not bind the exact validated forecast artifact." }];
  const target = forecast.targets.find((candidate) => candidate.targetId === score.targetId && candidate.targetKind === score.targetKind);
  if (!target || target.availability !== "available") return [...issues, { code: "incompatible-artifact", path: "score.targetId", message: "Score target is not an available prediction in its forecast artifact." }];
  if (target.releaseId !== score.releaseId || target.platformId !== score.platformId || target.anchorEventId !== score.anchorEventId || target.anchorStage !== score.anchorStage || target.anchorOccurredOn !== score.anchorOccurredOn || target.originOn !== score.originOn || target.modelFingerprint !== score.modelFingerprint || target.calibrationFingerprint !== score.calibrationFingerprint || target.cohort.modelCohortId !== score.modelCohortId || target.prediction.pointEstimator !== score.pointEstimator || target.prediction.pointDays !== score.pointDays) issues.push({ code: "incompatible-artifact", path: "score.targetId", message: "Score target identity, estimator, or prediction differs from the source forecast." });
  if (stableSerializeHistoricalAnalysis(target.sourceEvidenceIds) !== stableSerializeHistoricalAnalysis(score.anchorSourceEvidenceIds)) issues.push({ code: "invalid-evidence", path: "score.anchorSourceEvidenceIds", message: "Score must retain the exact canonical source-forecast anchor evidence." });
  const predictedStage = target.targetKind === "next-eligible-prerelease-event" ? target.predictedEligibleStage : null;
  if (score.predictedEligibleStage !== predictedStage) issues.push({ code: "incompatible-artifact", path: "score.predictedEligibleStage", message: "Score next-stage identity differs from the forecast." });
  for (const [index, interval] of target.prediction.intervals.entries()) {
    const scored = score.intervals[index];
    if (!scored || scored.level !== interval.level || scored.lowerDays !== interval.lowerDays || scored.upperDays !== interval.upperDays) issues.push({ code: "incompatible-artifact", path: `score.intervals[${index}]`, message: "Score interval differs from the forecast interval." });
  }
  return issues;
}

type DerivedOutcomeState = { outcome: ForecastOutcomeObservationV1 } | { pending: true } | { gap: ForecastReconciliationDataGapEntryV1 };

function datasetPrimaryRows(dataset: HistoricalAnalysisDatasetV1): Map<string, HistoricalCanonicalEventRow | HistoricalLifecycleOutcomeRow> {
  return new Map<string, HistoricalCanonicalEventRow | HistoricalLifecycleOutcomeRow>([
    ...dataset.canonicalEvents.map((row) => [row.eventId, row] as const),
    ...dataset.lifecycleOutcomes.map((row) => [row.outcomeEvidenceId, row] as const),
  ]);
}

function buildDerivedOutcome(args: { dataset: HistoricalAnalysisDatasetV1; base: ForecastReconciliationEntryBaseV1; bindingByEvidenceId: ReadonlyMap<string, ForecastOutcomeInstantBindingV1>; reconciliationCutoffAt: string }): DerivedOutcomeState {
  const { dataset, base } = args;
  const snapshot = base.targetSnapshot;
  const cycle = dataset.releaseCycles.find((row) => row.releaseId === base.releaseId && row.platformId === base.platformId);
  if (cycle?.lifecycle === "superseded" || (cycle && !cycle.included)) return { gap: makeGap(base, null, "outcome-superseded", cycle.sourceEvidenceIds) };
  const anchor = dataset.canonicalEvents.find((row) => row.eventId === snapshot.anchorEventId);
  if (!anchor || anchor.releaseId !== base.releaseId || anchor.platformId !== base.platformId || anchor.stage !== snapshot.anchorStage || anchor.occurredOn !== snapshot.anchorOccurredOn || stableSerializeHistoricalAnalysis(anchor.sourceEvidenceIds) !== stableSerializeHistoricalAnalysis(snapshot.anchorSourceEvidenceIds)) return { gap: makeGap(base, null, "missing-anchor-row", snapshot.anchorSourceEvidenceIds) };
  let row: HistoricalCanonicalEventRow | HistoricalLifecycleOutcomeRow | null = null;
  if (base.targetKind === "public-release") {
    const rows = dataset.lifecycleOutcomes.filter((candidate) => candidate.releaseId === base.releaseId && candidate.platformId === base.platformId && candidate.closure === "public-release");
    if (rows.length === 0) return { pending: true };
    if (rows.length !== 1) return { gap: makeGap(base, null, "ambiguous-outcome", sortedUnique(rows.flatMap((candidate) => candidate.sourceEvidenceIds))) };
    row = rows[0]!;
  } else {
    const intervals = dataset.stageIntervals.filter((candidate) => candidate.releaseId === base.releaseId && candidate.startEventId === snapshot.anchorEventId && candidate.startStage === snapshot.anchorStage);
    if (intervals.length === 0 || (intervals.length === 1 && intervals[0]!.end === null)) return { pending: true };
    if (intervals.length !== 1) return { gap: makeGap(base, null, "ambiguous-outcome", snapshot.anchorSourceEvidenceIds) };
    const end = intervals[0]!.end;
    if (!end) return { pending: true };
    if (end.kind === "lifecycle-outcome") {
      return {
        gap: makeGap(
          base,
          end.outcomeEvidenceId,
          "terminal-or-ineligible-next-event",
          end.sourceEvidenceIds,
        ),
      };
    }
    row = dataset.canonicalEvents.find((candidate) => candidate.eventId === end.eventId) ?? null;
    if (!row) return { gap: makeGap(base, null, "source-dataset-mismatch", end.sourceEvidenceIds) };
  }
  const evidenceId = row.rowType === "canonical-event" ? row.eventId : row.outcomeEvidenceId;
  const binding = args.bindingByEvidenceId.get(evidenceId);
  if (!binding) return { gap: makeGap(base, null, "missing-observation-instant", row.sourceEvidenceIds) };
  if (binding.firstObservedAt > args.reconciliationCutoffAt) return { pending: true };
  const targetStage = row.rowType === "canonical-event" ? row.stage : "public-release";
  const firstObservedOn = row.firstObservedOn;
  const projection = { targetId: base.targetId, targetKind: base.targetKind, releaseId: row.releaseId, platformId: row.platformId, anchorEventId: snapshot.anchorEventId, anchorStage: snapshot.anchorStage, anchorOccurredOn: snapshot.anchorOccurredOn, targetEventId: evidenceId, targetStage, occurredOn: row.occurredOn, firstObservedOn, firstObservedAt: binding.firstObservedAt, sourceEvidenceIds: [...row.sourceEvidenceIds] } as const;
  const sourceRowFingerprint = historicalAnalysisFingerprint(outcomeRowProjection(projection));
  const outcomeFingerprint = historicalAnalysisFingerprint(outcomeProjection(projection));
  const outcome: ForecastOutcomeObservationV1 = { observationVersion: FORECAST_OUTCOME_OBSERVATION_VERSION, sourceDatasetVersion: HISTORICAL_ANALYSIS_DATASET_VERSION, sourceDatasetFingerprint: dataset.fingerprints.datasetFingerprint, sourceRowFingerprint, outcomeFingerprint, outcomeId: outcomeFingerprint, ...projection };
  const validation = validateForecastOutcomeObservation(outcome);
  if (validation.length) throw new ForecastScoringContractError(validation);
  const forecastCutoff = snapshot.forecastDataCutoff > snapshot.originOn ? snapshot.forecastDataCutoff : snapshot.originOn;
  if (instantOrder(outcome.firstObservedAt, base.forecastGeneratedAt) <= 0 || outcome.firstObservedOn <= forecastCutoff || outcome.occurredOn <= forecastCutoff) return { gap: makeGap(base, outcome.outcomeId, outcome.occurredOn <= forecastCutoff ? "ambiguous-chronology" : "identity-mismatch", outcome.sourceEvidenceIds) };
  if (base.targetKind === "next-eligible-prerelease-event" && outcome.targetStage.split(":")[0] !== snapshot.predictedEligibleStage) return { gap: makeGap(base, outcome.outcomeId, "next-event-stage-mismatch", outcome.sourceEvidenceIds) };
  return { outcome };
}

function correctionReason(previous: ForecastReconciliationScoreEntryV1, next: ForecastScoreArtifactV1): ForecastOutcomeAuditReason {
  if (previous.outcomeEventId !== next.outcomeEventId) return "outcome-identity-corrected";
  if (previous.outcomeStage !== next.outcomeStage) return "outcome-stage-corrected";
  if (previous.outcomeOccurredOn !== next.outcomeOccurredOn) return "outcome-date-corrected";
  if (stableSerializeHistoricalAnalysis(previous.outcomeSourceEvidenceIds) !== stableSerializeHistoricalAnalysis(next.outcomeSourceEvidenceIds)) return "outcome-evidence-corrected";
  if (previous.outcomeFirstObservedAt !== next.outcomeFirstObservedAt) return "outcome-observation-time-corrected";
  return "outcome-identity-corrected";
}

export interface ReconcileForecastScoresArgs {
  reconciliationCutoffAt: string;
  evaluationEpoch: ForecastShadowEvaluationEpochV1;
  forecastArtifacts: readonly ForecastArtifactV1[];
  sourceDataset: HistoricalAnalysisDatasetV1;
  outcomeInstantBindings: readonly ForecastOutcomeInstantBindingV1[];
  previousIndex?: ForecastReconciliationIndexV1 | null;
  previousScores?: ReadonlyMap<string, ForecastScoreArtifactV1>;
  /** A partial map is sufficient. Prior artifacts are needed only for score-producing transitions. */
  previousForecastArtifacts?: ReadonlyMap<string, ForecastArtifactV1>;
}

export interface ForecastScoreArtifactRecordV1 { artifactId: string; artifact: ForecastScoreArtifactV1; }
export interface ForecastScoreReconciliationResultV1 {
  index: ForecastReconciliationIndexV1;
  indexArtifactId: string;
  scoreArtifacts: readonly ForecastScoreArtifactRecordV1[];
  newScoreArtifactIds: readonly string[];
}

interface ReconciliationTargetContext {
  base: ForecastReconciliationEntryBaseV1;
  forecast?: ForecastArtifactV1;
  target?: Extract<ForecastArtifactTargetV1, { availability: "available" }>;
}

interface PreparedReconciliation {
  previousIndex: ForecastReconciliationIndexV1 | null;
  contexts: readonly ReconciliationTargetContext[];
  derivedByKey: ReadonlyMap<string, DerivedOutcomeState>;
  sourceForecastArtifactIds: readonly string[];
  sourceForecasts: readonly ForecastReconciliationSourceForecastV1[];
  requiredForecastArtifactIds: readonly string[];
}

function prepareForecastScoreReconciliation(args: ReconcileForecastScoresArgs): PreparedReconciliation {
  const issues: ForecastScoringValidationIssue[] = [];
  if (!isInstant(args.reconciliationCutoffAt)) issues.push({ code: "invalid-chronology", path: "reconciliationCutoffAt", message: "A canonical exact reconciliation cutoff instant is required." });
  issues.push(...validateForecastShadowEvaluationEpoch(args.evaluationEpoch));
  if (validateHistoricalAnalysisDataset(args.sourceDataset).length) issues.push({ code: "incompatible-artifact", path: "sourceDataset", message: "Scoring requires a fully validated historical-analysis-dataset/v1." });
  if (!Array.isArray(args.forecastArtifacts) || !Array.isArray(args.outcomeInstantBindings)) issues.push({ code: "invalid-input", path: "reconciliation", message: "Forecast artifacts and observation bindings must be arrays." });
  if (issues.length) throw new ForecastScoringContractError(issues);
  if (isInstant(args.reconciliationCutoffAt) && (instantOrder(args.sourceDataset.provenance.sourceIssuedAt, args.reconciliationCutoffAt) > 0 || args.sourceDataset.provenance.sourceAsOfDate > args.reconciliationCutoffAt.slice(0, 10))) issues.push({ code: "invalid-chronology", path: "sourceDataset.provenance", message: "The source dataset snapshot must be issued no later than the exact reconciliation cutoff." });
  if (args.outcomeInstantBindings.length > FORECAST_OUTCOME_BINDING_MAX_ROWS) issues.push({ code: "row-limit", path: "outcomeInstantBindings", message: "Observation instant bindings exceed the v1 bound." });
  const primaryRows = datasetPrimaryRows(args.sourceDataset);
  const bindings = [...args.outcomeInstantBindings].sort((left, right) => textOrder(left.evidenceId, right.evidenceId));
  bindings.forEach((binding, index) => {
    const bindingIssues = validateForecastOutcomeInstantBinding(binding, `outcomeInstantBindings[${index}]`);
    issues.push(...bindingIssues);
    if (bindingIssues.length) return;
    const row = primaryRows.get(binding.evidenceId);
    if (!row || binding.firstObservedAt.slice(0, 10) !== row.firstObservedOn || instantOrder(binding.firstObservedAt, args.sourceDataset.provenance.sourceIssuedAt) > 0) issues.push({ code: "invalid-evidence", path: `outcomeInstantBindings[${index}]`, message: "Every binding must match one exact validated dataset row, its observed day, and dataset issuance." });
    if (isInstant(args.reconciliationCutoffAt) && isInstant(binding.firstObservedAt) && instantOrder(binding.firstObservedAt, args.reconciliationCutoffAt) > 0) issues.push({ code: "invalid-chronology", path: `outcomeInstantBindings[${index}].firstObservedAt`, message: "Bound observations must be known no later than the exact reconciliation cutoff." });
  });
  if (new Set(bindings.map((binding) => binding.evidenceId)).size !== bindings.length) issues.push({ code: "invalid-row", path: "outcomeInstantBindings", message: "Observation bindings must have unique exact evidence identities." });
  const previousIndex = args.previousIndex ?? null;
  if (previousIndex) {
    issues.push(...validateForecastReconciliationIndex(previousIndex));
    if (isInstant(args.reconciliationCutoffAt) && previousIndex.reconciliationCutoffAt > args.reconciliationCutoffAt) issues.push({ code: "invalid-chronology", path: "reconciliationCutoffAt", message: "Reconciliation cutoff cannot move backward." });
    if (stableSerializeHistoricalAnalysis(previousIndex.evaluationEpoch) !== stableSerializeHistoricalAnalysis(args.evaluationEpoch)) issues.push({ code: "incompatible-artifact", path: "evaluationEpoch", message: "An active evaluation epoch cannot change policy or identity during reconciliation." });
  }
  if (issues.length) throw new ForecastScoringContractError(issues);
  const previousSourceIds = new Set(previousIndex?.sourceForecastArtifactIds ?? []);
  const forecastById = new Map<string, ForecastArtifactV1>();
  for (const [id, forecast] of args.previousForecastArtifacts ?? []) {
    if (!previousSourceIds.has(id) || forecast.artifactId !== id || validateForecastArtifact(forecast).length) issues.push({ code: "incompatible-artifact", path: "previousForecastArtifacts", message: "Resolved prior forecasts must be exact validated artifacts referenced by the prior index." });
    else forecastById.set(id, forecast);
  }
  for (const forecast of args.forecastArtifacts) {
    const existing = forecastById.get(forecast.artifactId);
    if (existing && serializeForecastArtifact(existing) !== serializeForecastArtifact(forecast)) issues.push({ code: "incompatible-artifact", path: "forecastArtifacts", message: "A forecast artifact ID cannot resolve to different canonical bytes." });
    forecastById.set(forecast.artifactId, forecast);
  }
  if (new Set(args.forecastArtifacts.map((artifact) => artifact.artifactId)).size !== args.forecastArtifacts.length) issues.push({ code: "invalid-row", path: "forecastArtifacts", message: "New forecast artifact inputs must be unique." });
  const resolvedForecasts = [...forecastById.values()].sort((left, right) => textOrder(left.artifactId, right.artifactId));
  for (const [index, forecast] of resolvedForecasts.entries()) {
    if (validateForecastArtifact(forecast).length) issues.push({ code: "incompatible-artifact", path: `forecastArtifacts[${index}]`, message: "Every forecast must be a valid exact v1 artifact." });
    if (isInstant(args.reconciliationCutoffAt) && forecast.generatedAt > args.reconciliationCutoffAt) issues.push({ code: "invalid-chronology", path: `forecastArtifacts[${index}].generatedAt`, message: "A future forecast cannot enter an earlier reconciliation snapshot." });
  }
  for (const [id, score] of args.previousScores ?? []) {
    if (forecastScoreArtifactId(score) !== id || validateForecastScoreArtifact(score).length) issues.push({ code: "incompatible-artifact", path: "previousScores", message: "Provided prior scores must be exact content-addressed artifacts." });
  }
  const priorStates = [...(previousIndex?.scores ?? []), ...(previousIndex?.pending ?? []), ...(previousIndex?.dataGaps ?? [])];
  const contexts = new Map<string, ReconciliationTargetContext>(priorStates.map((entry) => [statusKey(entry), { base: entryBase(entry) }]));
  const sourceForecastsById = new Map<string, ForecastReconciliationSourceForecastV1>((previousIndex?.sourceForecasts ?? []).map((source) => [source.forecastArtifactId, source]));
  const runKeys = new Map((previousIndex?.sourceForecasts ?? []).map((source) => [source.forecastRunKey, source.forecastArtifactId]));
  const scheduledDays = new Map((previousIndex?.sourceForecasts ?? []).map((source) => [source.scheduledFor, source.forecastArtifactId]));
  for (const forecast of args.forecastArtifacts) {
    if (forecast.targets.filter((target) => target.availability === "available").length > FORECAST_SHADOW_EPOCH_MAX_TARGETS_PER_FORECAST) issues.push({ code: "row-limit", path: "forecastArtifacts", message: "One sampled forecast exceeds the fixed per-run target bound." });
    const existing = sourceForecastsById.get(forecast.artifactId);
    if (existing) {
      if (existing.forecastRunKey !== forecast.runKey || existing.scheduledFor !== forecast.runIdentity.scheduledFor || existing.generatedAt !== forecast.generatedAt) issues.push({ code: "incompatible-artifact", path: "forecastArtifacts", message: "A sampled forecast identity cannot change within an epoch." });
      continue;
    }
    if (previousIndex?.epochStopReason !== null && previousIndex !== null) issues.push({ code: "row-limit", path: "forecastArtifacts", message: "The evaluation epoch is closed; rollover requires an explicit reviewed new epoch." });
    if (isInstant(args.reconciliationCutoffAt) && args.reconciliationCutoffAt.slice(0, 10) > args.evaluationEpoch.endsOn) issues.push({ code: "invalid-chronology", path: "forecastArtifacts", message: "No new forecast can enter after the evaluation epoch sampling window closes." });
    if (forecast.runIdentity.scheduledFor < args.evaluationEpoch.startsOn || forecast.runIdentity.scheduledFor > args.evaluationEpoch.endsOn) issues.push({ code: "invalid-chronology", path: "forecastArtifacts", message: "Sampled forecast days must fall within the predeclared evaluation epoch." });
    if (runKeys.has(forecast.runKey) || scheduledDays.has(forecast.runIdentity.scheduledFor)) issues.push({ code: "invalid-row", path: "forecastArtifacts", message: "The epoch accepts exactly one immutable canonical forecast run per scheduled day; retries cannot create extra samples." });
    const source = { forecastArtifactId: forecast.artifactId, forecastRunKey: forecast.runKey, scheduledFor: forecast.runIdentity.scheduledFor, generatedAt: forecast.generatedAt };
    sourceForecastsById.set(forecast.artifactId, source);
    runKeys.set(forecast.runKey, forecast.artifactId);
    scheduledDays.set(forecast.runIdentity.scheduledFor, forecast.artifactId);
  }
  const sourceForecasts = [...sourceForecastsById.values()].sort((left, right) => textOrder(sourceForecastKey(left), sourceForecastKey(right)));
  const sourceForecastArtifactIds = sortedUnique(sourceForecasts.map((source) => source.forecastArtifactId));
  if (sourceForecasts.length > FORECAST_SHADOW_EPOCH_MAX_FORECASTS) issues.push({ code: "row-limit", path: "forecastArtifacts", message: "The fixed epoch forecast-artifact limit was exceeded." });
  for (const forecast of resolvedForecasts) {
    const artifactIsPrior = previousSourceIds.has(forecast.artifactId);
    const expectedKeys: string[] = [];
    for (const target of forecast.targets) {
      if (target.availability !== "available") continue;
      const base = targetBase(target, forecast);
      const key = statusKey(base);
      expectedKeys.push(key);
      const existing = contexts.get(key);
      if (artifactIsPrior && (!existing || stableSerializeHistoricalAnalysis(existing.base) !== stableSerializeHistoricalAnalysis(base))) issues.push({ code: "incompatible-artifact", path: "previousForecastArtifacts", message: "A resolved prior forecast must match every immutable target snapshot in the prior index." });
      contexts.set(key, { base, forecast, target });
    }
    if (artifactIsPrior) {
      const actualKeys = priorStates.filter((entry) => entry.forecastArtifactId === forecast.artifactId).map(statusKey).sort(textOrder);
      if (stableSerializeHistoricalAnalysis(expectedKeys.sort(textOrder)) !== stableSerializeHistoricalAnalysis(actualKeys)) issues.push({ code: "incompatible-artifact", path: "previousForecastArtifacts", message: "A resolved prior forecast must have exactly one prior state for every available target." });
    }
  }
  if (contexts.size > FORECAST_RECONCILIATION_MAX_ROWS) issues.push({ code: "row-limit", path: "index", message: "The complete target union exceeds the bounded v1 reconciliation capacity." });
  if (contexts.size > FORECAST_SHADOW_EPOCH_MAX_TARGETS) issues.push({ code: "row-limit", path: "index", message: "The fixed evaluation epoch target-row limit was exceeded." });
  if (issues.length) throw new ForecastScoringContractError(issues);

  const bindingByEvidenceId = new Map(bindings.map((binding) => [binding.evidenceId, binding]));
  const derivedOutcomes = new Map<string, DerivedOutcomeState>();
  const orderedContexts = [...contexts.values()].sort((left, right) => textOrder(statusKey(left.base), statusKey(right.base)));
  for (const context of orderedContexts) derivedOutcomes.set(statusKey(context.base), buildDerivedOutcome({ dataset: args.sourceDataset, base: context.base, bindingByEvidenceId, reconciliationCutoffAt: args.reconciliationCutoffAt }));
  const priorScoresByKey = new Map((previousIndex?.scores ?? []).map((entry) => [scoreEntryKey(entry), entry]));
  const requiredForecastArtifactIds = sortedUnique(orderedContexts.flatMap((context) => {
    if (context.forecast && context.target) return [];
    const derived = derivedOutcomes.get(statusKey(context.base))!;
    if (!("outcome" in derived)) return [];
    const previous = priorScoresByKey.get(statusKey(context.base));
    return previous?.outcomeId === derived.outcome.outcomeId ? [] : [context.base.forecastArtifactId];
  }));
  return { previousIndex, contexts: orderedContexts, derivedByKey: derivedOutcomes, sourceForecastArtifactIds, sourceForecasts, requiredForecastArtifactIds };
}

/**
 * Plan the only old forecast reads needed by a daily run. The prior root is
 * self-contained, so unchanged scored targets and still-pending/gapped targets
 * require no historical forecast or score Blob reads.
 */
export function forecastArtifactIdsRequiredForReconciliation(args: ReconcileForecastScoresArgs): readonly string[] {
  return prepareForecastScoreReconciliation(args).requiredForecastArtifactIds;
}

export function reconcileForecastScores(args: ReconcileForecastScoresArgs): ForecastScoreReconciliationResultV1 {
  const prepared = prepareForecastScoreReconciliation(args);
  if (prepared.requiredForecastArtifactIds.length) throw new ForecastScoringContractError([{ code: "incompatible-artifact", path: "previousForecastArtifacts", message: "Only prior forecasts entering a new or corrected score state must be resolved before reconciliation." }]);
  const previousIndex = prepared.previousIndex;
  const scoreEntries = new Map<string, ForecastReconciliationScoreEntryV1>((previousIndex?.scores ?? []).map((entry) => [scoreEntryKey(entry), entry]));
  const pendingEntries = new Map<string, ForecastReconciliationPendingEntryV1>((previousIndex?.pending ?? []).map((entry) => [pendingEntryKey(entry), entry]));
  const gapEntries = new Map<string, ForecastReconciliationDataGapEntryV1>((previousIndex?.dataGaps ?? []).map((entry) => [gapEntryKey(entry), entry]));
  const auditEntries = new Map<string, ForecastReconciliationAuditEntryV1>((previousIndex?.audit ?? []).map((entry) => [entry.auditId, entry]));
  const newScoreArtifacts = new Map<string, ForecastScoreArtifactV1>();

  for (const context of prepared.contexts) {
      const { base } = context;
      const key = statusKey(base);
      const derived = prepared.derivedByKey.get(key)!;
      const existing = scoreEntries.get(key);
      const existingGap = gapEntries.get(key);
      pendingEntries.delete(key);
      gapEntries.delete(key);
      if ("outcome" in derived) {
        if (!exactOutcomeIdentity(base, derived.outcome)) throw new ForecastScoringContractError([{ code: "incompatible-artifact", path: "sourceDataset", message: "Derived candidate must match target ID and kind plus exact release/anchor identity." }]);
        if (existing?.outcomeId === derived.outcome.outcomeId) continue;
        if (!context.forecast || !context.target) throw new ForecastScoringContractError([{ code: "incompatible-artifact", path: "previousForecastArtifacts", message: "A score-producing transition requires its exact content-addressed forecast artifact." }]);
        const nextScore = scoreFromOutcome(context.forecast, context.target, derived.outcome);
        const artifactId = forecastScoreArtifactId(nextScore);
        newScoreArtifacts.set(artifactId, nextScore);
        scoreEntries.set(key, scoreEntryFromArtifact(base, artifactId, nextScore));
        if (existing) {
          const audit = makeAudit(base, correctionReason(existing, nextScore), existing.scoreArtifactId, existing.outcomeId, artifactId, nextScore.sourceOutcomeFingerprint, args.sourceDataset.fingerprints.datasetFingerprint, sortedUnique([...existing.outcomeSourceEvidenceIds, ...nextScore.outcomeSourceEvidenceIds]));
          auditEntries.set(audit.auditId, audit);
        }
      } else {
        scoreEntries.delete(key);
        if (existing) {
          const superseded = "gap" in derived && derived.gap.reason === "outcome-superseded";
          const gap = "gap" in derived ? derived.gap : makeGap(base, existing.outcomeId, "outcome-retracted", existing.outcomeSourceEvidenceIds);
          const retractedGap = gap.reason === "outcome-superseded" ? gap : makeGap(base, existing.outcomeId, "outcome-retracted", sortedUnique([...existing.outcomeSourceEvidenceIds, ...gap.sourceEvidenceIds]));
          gapEntries.set(key, retractedGap);
          const audit = makeAudit(base, superseded ? "outcome-superseded" : "outcome-retracted", existing.scoreArtifactId, existing.outcomeId, null, null, args.sourceDataset.fingerprints.datasetFingerprint, retractedGap.sourceEvidenceIds);
          auditEntries.set(audit.auditId, audit);
        } else if (
          existingGap &&
          existingGap.reason === "outcome-retracted" &&
          [...auditEntries.values()].some(
            (entry) =>
              statusKey(entry) === key &&
              entry.reason === "outcome-retracted" &&
              entry.previousOutcomeFingerprint === existingGap.outcomeId &&
              entry.sourceDatasetFingerprint ===
                args.sourceDataset.fingerprints.datasetFingerprint,
          )
        ) {
          // A correction gap is sticky until a new source-backed outcome or
          // a new explicit gap replaces it. Do not silently downgrade the
          // audited state to pending on an identical replay.
          gapEntries.set(key, existingGap);
        } else if ("gap" in derived) gapEntries.set(key, derived.gap);
        else pendingEntries.set(key, { ...base, reason: "outcome-not-yet-known" });
      }
  }

  const scores = [...scoreEntries.values()].sort((left, right) => textOrder(scoreEntryKey(left), scoreEntryKey(right)));
  const pending = [...pendingEntries.values()].sort((left, right) => textOrder(pendingEntryKey(left), pendingEntryKey(right)));
  const dataGaps = [...gapEntries.values()].sort((left, right) => textOrder(gapEntryKey(left), gapEntryKey(right)));
  const audit = [...auditEntries.values()].sort((left, right) => textOrder(auditEntryKey(left), auditEntryKey(right)));
  if (audit.length > FORECAST_SHADOW_EPOCH_MAX_AUDITS) throw new ForecastScoringContractError([{ code: "row-limit", path: "index.audit", message: "The fixed evaluation-epoch correction audit capacity was exceeded; reviewed archival/rollover is required." }]);
  const draft = { indexVersion: FORECAST_RECONCILIATION_INDEX_VERSION, mode: FORECAST_ARTIFACT_MODE, compatibleForecastArtifactVersion: FORECAST_ARTIFACT_VERSION, compatibleScoreVersion: FORECAST_SCORE_VERSION, reconciliationCutoffAt: args.reconciliationCutoffAt, reconciliationCutoffDate: args.reconciliationCutoffAt.slice(0, 10), evaluationEpoch: args.evaluationEpoch, epochStopReason: null, sourceForecastArtifactIds: prepared.sourceForecastArtifactIds, sourceForecasts: prepared.sourceForecasts, scores, pending, dataGaps, audit } satisfies Omit<ForecastReconciliationIndexV1, "indexFingerprint">;
  const indexBudgetBytes = byteLength(stableSerializeHistoricalAnalysis(indexBudgetBody(draft as unknown as Record<string, unknown>)));
  const currentStopReason: ForecastShadowEpochStopReason | null = prepared.sourceForecasts.length >= FORECAST_SHADOW_EPOCH_MAX_FORECASTS
    ? "forecast-artifact-limit-reached"
    : prepared.contexts.length >= FORECAST_SHADOW_EPOCH_MAX_TARGETS
      ? "target-row-limit-reached"
      : audit.length >= FORECAST_SHADOW_EPOCH_MAX_AUDITS
        ? "audit-row-limit-reached"
        : indexBudgetBytes >= FORECAST_SHADOW_EPOCH_INDEX_BYTE_BUDGET
          ? "index-byte-budget-reached"
          : args.reconciliationCutoffAt.slice(0, 10) > args.evaluationEpoch.endsOn
            ? "epoch-end-reached"
            : null;
  const epochStopReason = previousIndex?.epochStopReason ?? currentStopReason;
  const stateProjection = { evaluationEpoch: args.evaluationEpoch, epochStopReason, sourceForecastArtifactIds: prepared.sourceForecastArtifactIds, sourceForecasts: prepared.sourceForecasts, scores, pending, dataGaps, audit };
  if (previousIndex && newScoreArtifacts.size === 0 && stableSerializeHistoricalAnalysis(stateProjection) === stableSerializeHistoricalAnalysis({ evaluationEpoch: previousIndex.evaluationEpoch, epochStopReason: previousIndex.epochStopReason, sourceForecastArtifactIds: previousIndex.sourceForecastArtifactIds, sourceForecasts: previousIndex.sourceForecasts, scores: previousIndex.scores, pending: previousIndex.pending, dataGaps: previousIndex.dataGaps, audit: previousIndex.audit })) {
    return { index: previousIndex, indexArtifactId: forecastReconciliationIndexArtifactId(previousIndex), scoreArtifacts: [], newScoreArtifactIds: [] };
  }
  const index = makeReconciliationIndex({ ...draft, epochStopReason });
  const indexIssues = validateForecastReconciliationIndex(index);
  if (indexIssues.length) throw new ForecastScoringContractError(indexIssues);
  const records = [...newScoreArtifacts.entries()].sort(([left], [right]) => textOrder(left, right)).map(([artifactId, artifact]) => ({ artifactId, artifact }));
  return { index, indexArtifactId: forecastReconciliationIndexArtifactId(index), scoreArtifacts: records, newScoreArtifactIds: records.map((record) => record.artifactId) };
}

interface HealthAccumulator {
  targetKind: ForecastTargetKind;
  groupKind: "overall" | "platform" | "model-cohort";
  groupId: string;
  forecastCount: number;
  pendingCount: number;
  dataGapCount: number;
  scores: ForecastReconciliationScoreEntryV1[];
}

function addHealthStatus(groups: Map<string, HealthAccumulator>, entry: ForecastReconciliationEntryBaseV1, status: "score" | "pending" | "gap", score?: ForecastReconciliationScoreEntryV1): void {
  const dimensions = [
    { groupKind: "overall" as const, groupId: "overall" },
    { groupKind: "platform" as const, groupId: entry.platformId },
    { groupKind: "model-cohort" as const, groupId: entry.modelCohortId },
  ];
  for (const dimension of dimensions) {
    if (!isText(dimension.groupId, 256)) throw new ForecastScoringContractError([{ code: "row-limit", path: "health.metrics.groupId", message: "Health group IDs must be non-empty and at most 256 characters." }]);
    const key = `${entry.targetKind}\u0000${dimension.groupKind}\u0000${dimension.groupId}`;
    const accumulator = groups.get(key) ?? { targetKind: entry.targetKind, ...dimension, forecastCount: 0, pendingCount: 0, dataGapCount: 0, scores: [] };
    accumulator.forecastCount += 1;
    if (status === "score" && score) accumulator.scores.push(score);
    else if (status === "pending") accumulator.pendingCount += 1;
    else accumulator.dataGapCount += 1;
    groups.set(key, accumulator);
  }
}

function median(values: readonly number[]): number {
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle]! : (ordered[middle - 1]! + ordered[middle]!) / 2;
}

function metricFromAccumulator(group: HealthAccumulator): ForecastShadowHealthMetricV1 {
  const scoredCount = group.scores.length;
  const eventGroups = new Map<string, ForecastReconciliationScoreEntryV1[]>();
  for (const score of group.scores) {
    const key = `${score.targetKind}\u0000${score.platformId}\u0000${score.outcomeEventId}\u0000${score.outcomeOccurredOn}`;
    eventGroups.set(key, [...(eventGroups.get(key) ?? []), score]);
  }
  const eventSummaries = [...eventGroups.entries()].sort(([left], [right]) => textOrder(left, right)).map(([, scores]) => ({
    absoluteErrorDays: scores.reduce((sum, score) => sum + score.absoluteErrorDays, 0) / scores.length,
    signedErrorDays: normalizeZero(scores.reduce((sum, score) => sum + score.signedErrorDays, 0) / scores.length),
    coverage50: scores.filter((score) => score.coverage50).length / scores.length,
    coverage80: scores.filter((score) => score.coverage80).length / scores.length,
  }));
  const realizedEventCount = eventSummaries.length;
  const base: ForecastShadowHealthMetricV1Base = {
    targetKind: group.targetKind,
    groupKind: group.groupKind,
    groupId: group.groupId,
    forecastCount: group.forecastCount,
    scoredCount,
    realizedEventCount,
    pendingCount: group.pendingCount,
    dataGapCount: group.dataGapCount,
    scoreCoverage: scoredCount / group.forecastCount,
  };
  if (realizedEventCount < FORECAST_HEALTH_MIN_REPORTABLE_SCORES) return { ...base, availability: "unavailable", reason: "minimum-score-count" };
  return {
    ...base,
    availability: "available",
    meanAbsoluteErrorDays: eventSummaries.reduce((sum, event) => sum + event.absoluteErrorDays, 0) / realizedEventCount,
    medianAbsoluteErrorDays: median(eventSummaries.map((event) => event.absoluteErrorDays)),
    signedBiasDays: normalizeZero(eventSummaries.reduce((sum, event) => sum + event.signedErrorDays, 0) / realizedEventCount),
    coverage50: eventSummaries.reduce((sum, event) => sum + event.coverage50, 0) / realizedEventCount,
    coverage80: eventSummaries.reduce((sum, event) => sum + event.coverage80, 0) / realizedEventCount,
  };
}

function reportWithoutFingerprint(value: ForecastShadowHealthReportV1): Omit<ForecastShadowHealthReportV1, "reportFingerprint"> {
  return { reportVersion: value.reportVersion, mode: value.mode, generatedAt: value.generatedAt, reconciliationRootArtifactId: value.reconciliationRootArtifactId, reconciliationCutoffAt: value.reconciliationCutoffAt, reconciliationCutoffDate: value.reconciliationCutoffDate, operations: value.operations, statistics: value.statistics, summary: value.summary, dataGapCounts: value.dataGapCounts, metrics: value.metrics };
}
function reportBody(value: Omit<ForecastShadowHealthReportV1, "reportFingerprint">) { return value; }

const SAFE_FAILURE_SUMMARIES: Record<ForecastShadowFailureCode, string> = {
  "source-unavailable": "The source snapshot was unavailable.",
  "source-invalid": "The source snapshot did not pass validation.",
  "storage-read-failed": "Private forecast storage could not be read.",
  "storage-write-failed": "Private forecast storage could not be written.",
  "pointer-conflict": "Another private forecast update won the pointer race.",
  "reconciliation-invalid": "Forecast reconciliation did not pass validation.",
  "run-timeout": "The private forecast run exceeded its time limit.",
};
const FAILURE_CODES = new Set<ForecastShadowFailureCode>(Object.keys(SAFE_FAILURE_SUMMARIES) as ForecastShadowFailureCode[]);

export function validateForecastShadowHealthReport(value: unknown): ForecastScoringValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "health", message: "Health report must be an object." }];
    const issues: ForecastScoringValidationIssue[] = [];
    exactKeys(value, ["reportVersion", "mode", "generatedAt", "reconciliationRootArtifactId", "reconciliationCutoffAt", "reconciliationCutoffDate", "operations", "statistics", "summary", "dataGapCounts", "metrics", "reportFingerprint"], "health", issues);
    if (value.reportVersion !== FORECAST_SHADOW_HEALTH_VERSION) issues.push({ code: "unsupported-version", path: "health.reportVersion", message: `Expected ${FORECAST_SHADOW_HEALTH_VERSION}.` });
    if (value.mode !== FORECAST_ARTIFACT_MODE) issues.push({ code: "public-mode", path: "health.mode", message: "Health report v1 is private shadow only." });
    if (!isInstant(value.generatedAt) || !isInstant(value.reconciliationCutoffAt) || !isDay(value.reconciliationCutoffDate) || (isInstant(value.reconciliationCutoffAt) && value.reconciliationCutoffAt.slice(0, 10) !== value.reconciliationCutoffDate) || (isInstant(value.generatedAt) && isInstant(value.reconciliationCutoffAt) && value.generatedAt < value.reconciliationCutoffAt)) issues.push({ code: "invalid-chronology", path: "health", message: "Health generation must follow the exact canonical reconciliation cutoff." });
    if (!isSha(value.reconciliationRootArtifactId) || !isSha(value.reportFingerprint)) issues.push({ code: "invalid-fingerprint", path: "health", message: "Health report requires exact root and report fingerprints." });
    if (!isRecord(value.operations)) issues.push({ code: "invalid-row", path: "health.operations", message: "Operational health is required separately from statistics." });
    const operations = isRecord(value.operations) ? value.operations : {};
    exactKeys(operations, ["status", "freshness", "runFailures", "pendingCount", "dataGapCount", "auditCount"], "health.operations", issues);
    if (!["healthy", "degraded", "no-data"].includes(operations.status as string) || ![operations.pendingCount, operations.dataGapCount, operations.auditCount].every(isCount)) issues.push({ code: "invalid-row", path: "health.operations", message: "Operational status and counts are invalid." });
    const freshness = isRecord(operations.freshness) ? operations.freshness : {};
    exactKeys(freshness, ["latestForecastGeneratedAt", "ageHours", "thresholdHours", "status"], "health.operations.freshness", issues);
    if (!(freshness.latestForecastGeneratedAt === null || isInstant(freshness.latestForecastGeneratedAt)) || !(freshness.ageHours === null || (isFiniteNumber(freshness.ageHours) && freshness.ageHours >= 0)) || !isFiniteNumber(freshness.thresholdHours) || freshness.thresholdHours <= 0 || freshness.thresholdHours > 8_760 || !["fresh", "stale", "no-data"].includes(freshness.status as string)) issues.push({ code: "invalid-row", path: "health.operations.freshness", message: "Freshness fields are invalid." });
    if (isInstant(value.generatedAt) && isInstant(freshness.latestForecastGeneratedAt) && isFiniteNumber(freshness.ageHours) && isFiniteNumber(freshness.thresholdHours)) { const age = (new Date(value.generatedAt).getTime() - new Date(freshness.latestForecastGeneratedAt).getTime()) / 3_600_000; if (age < 0 || freshness.ageHours !== age || freshness.status !== (age <= freshness.thresholdHours ? "fresh" : "stale")) issues.push({ code: "invalid-chronology", path: "health.operations.freshness", message: "Freshness must be derived exactly." }); }
    if ((freshness.latestForecastGeneratedAt === null) !== (freshness.ageHours === null) || (freshness.latestForecastGeneratedAt === null) !== (freshness.status === "no-data")) issues.push({ code: "invalid-row", path: "health.operations.freshness", message: "No-data freshness fields must agree." });
    if (!isRecord(value.statistics)) issues.push({ code: "invalid-row", path: "health.statistics", message: "Statistical reportability is required separately from operations." });
    else { exactKeys(value.statistics, ["status", "minimumRealizedEventCount"], "health.statistics", issues); if (!["reportable", "insufficient-sample", "no-scores"].includes(value.statistics.status as string) || value.statistics.minimumRealizedEventCount !== FORECAST_HEALTH_MIN_REPORTABLE_SCORES) issues.push({ code: "invalid-row", path: "health.statistics", message: "Statistical status and unique-event threshold are invalid." }); }
    if (!isRecord(value.summary)) issues.push({ code: "invalid-row", path: "health.summary", message: "Health summary is required." });
    else {
      exactKeys(value.summary, ["forecastCount", "scoredCount", "pendingCount", "dataGapCount", "runFailureCount"], "health.summary", issues);
      if (![value.summary.forecastCount, value.summary.scoredCount, value.summary.pendingCount, value.summary.dataGapCount, value.summary.runFailureCount].every(isCount) || (isCount(value.summary.forecastCount) && isCount(value.summary.scoredCount) && isCount(value.summary.pendingCount) && isCount(value.summary.dataGapCount) && value.summary.forecastCount !== value.summary.scoredCount + value.summary.pendingCount + value.summary.dataGapCount)) issues.push({ code: "invalid-row", path: "health.summary", message: "Summary counts must be non-negative and reconcile exactly." });
    }
    if (!Array.isArray(operations.runFailures) || !Array.isArray(value.dataGapCounts) || !Array.isArray(value.metrics)) return [...issues, { code: "invalid-row", path: "health", message: "Failure, data-gap, and metric arrays are required." }];
    if (operations.runFailures.length > FORECAST_HEALTH_MAX_FAILURES || value.metrics.length > FORECAST_HEALTH_MAX_GROUPS) issues.push({ code: "row-limit", path: "health", message: "Health rows exceed the v1 bound." });
    operations.runFailures.forEach((failure, index) => {
      const path = `health.operations.runFailures[${index}]`;
      if (!isRecord(failure)) { issues.push({ code: "invalid-row", path, message: "Run failure must be an object." }); return; }
      exactKeys(failure, ["runId", "failedAt", "code", "safeSummary"], path, issues);
      if (!isText(failure.runId, 256) || !isInstant(failure.failedAt) || !FAILURE_CODES.has(failure.code as ForecastShadowFailureCode) || failure.safeSummary !== SAFE_FAILURE_SUMMARIES[failure.code as ForecastShadowFailureCode]) issues.push({ code: "invalid-row", path, message: "Run failures accept only closed codes and their fixed safe summaries." });
      if (isInstant(value.generatedAt) && isInstant(failure.failedAt) && failure.failedAt > value.generatedAt) issues.push({ code: "invalid-chronology", path: `${path}.failedAt`, message: "A health report cannot include a future run failure." });
    });
    const failures = operations.runFailures as ForecastShadowRunFailureV1[];
    if (stableSerializeHistoricalAnalysis(failures) !== stableSerializeHistoricalAnalysis([...failures].sort((left, right) => textOrder(failureKey(left), failureKey(right)))) || new Set(failures.map((failure) => failure.runId)).size !== failures.length) issues.push({ code: "invalid-order", path: "health.operations.runFailures", message: "Run failures must be unique and in canonical order." });
    const gapReasons = new Set<ForecastDataGapReason>(["ambiguous-outcome", "identity-mismatch", "next-event-stage-mismatch", "ambiguous-chronology", "missing-anchor-row", "missing-observation-instant", "outcome-retracted", "outcome-superseded", "source-dataset-mismatch", "terminal-or-ineligible-next-event"]);
    value.dataGapCounts.forEach((gap, index) => {
      const path = `health.dataGapCounts[${index}]`;
      if (!isRecord(gap)) { issues.push({ code: "invalid-row", path, message: "Data-gap count must be an object." }); return; }
      exactKeys(gap, ["reason", "count"], path, issues);
      if (!gapReasons.has(gap.reason as ForecastDataGapReason) || !isCount(gap.count) || gap.count < 1) issues.push({ code: "invalid-row", path, message: "A closed data-gap reason and positive count are required." });
    });
    const gapCounts = value.dataGapCounts as ForecastShadowHealthGapCountV1[];
    if (stableSerializeHistoricalAnalysis(gapCounts) !== stableSerializeHistoricalAnalysis([...gapCounts].sort((left, right) => textOrder(left.reason, right.reason))) || new Set(gapCounts.map((gap) => gap.reason)).size !== gapCounts.length) issues.push({ code: "invalid-order", path: "health.dataGapCounts", message: "Data-gap counts must be unique and in canonical order." });
    if (isRecord(value.summary) && isCount(value.summary.runFailureCount) && value.summary.runFailureCount !== failures.length) issues.push({ code: "invalid-row", path: "health.summary.runFailureCount", message: "Run-failure summary must equal the exact failure rows." });
    if (isRecord(value.summary) && isCount(value.summary.dataGapCount) && value.summary.dataGapCount !== gapCounts.reduce((sum, gap) => sum + (isCount(gap.count) ? gap.count : 0), 0)) issues.push({ code: "invalid-row", path: "health.summary.dataGapCount", message: "Data-gap summary must equal the exact reason counts." });
    value.metrics.forEach((metric, index) => {
      const path = `health.metrics[${index}]`;
      if (!isRecord(metric)) { issues.push({ code: "invalid-row", path, message: "Health metric must be an object." }); return; }
      const available = metric.availability === "available";
      exactKeys(metric, available ? ["targetKind", "groupKind", "groupId", "forecastCount", "scoredCount", "realizedEventCount", "pendingCount", "dataGapCount", "scoreCoverage", "availability", "meanAbsoluteErrorDays", "medianAbsoluteErrorDays", "signedBiasDays", "coverage50", "coverage80"] : ["targetKind", "groupKind", "groupId", "forecastCount", "scoredCount", "realizedEventCount", "pendingCount", "dataGapCount", "scoreCoverage", "availability", "reason"], path, issues);
      if (!["public-release", "next-eligible-prerelease-event"].includes(metric.targetKind as string) || !["overall", "platform", "model-cohort"].includes(metric.groupKind as string) || !isText(metric.groupId, 256) || ![metric.forecastCount, metric.scoredCount, metric.realizedEventCount, metric.pendingCount, metric.dataGapCount].every(isCount) || (isCount(metric.realizedEventCount) && isCount(metric.scoredCount) && metric.realizedEventCount > metric.scoredCount) || !isFiniteNumber(metric.scoreCoverage) || metric.scoreCoverage < 0 || metric.scoreCoverage > 1 || (isCount(metric.forecastCount) && isCount(metric.scoredCount) && isCount(metric.pendingCount) && isCount(metric.dataGapCount) && (metric.forecastCount !== metric.scoredCount + metric.pendingCount + metric.dataGapCount || metric.scoreCoverage !== metric.scoredCount / metric.forecastCount))) issues.push({ code: "invalid-row", path, message: "Metric grouping, forecast-state counts, and unique realized-event counts must be exact." });
      if (available) {
        if (!isCount(metric.realizedEventCount) || metric.realizedEventCount < FORECAST_HEALTH_MIN_REPORTABLE_SCORES || ![metric.meanAbsoluteErrorDays, metric.medianAbsoluteErrorDays, metric.signedBiasDays, metric.coverage50, metric.coverage80].every(isFiniteNumber) || (isFiniteNumber(metric.meanAbsoluteErrorDays) && metric.meanAbsoluteErrorDays < 0) || (isFiniteNumber(metric.medianAbsoluteErrorDays) && metric.medianAbsoluteErrorDays < 0) || (isFiniteNumber(metric.coverage50) && (metric.coverage50 < 0 || metric.coverage50 > 1)) || (isFiniteNumber(metric.coverage80) && (metric.coverage80 < 0 || metric.coverage80 > 1)) || (isFiniteNumber(metric.coverage50) && isFiniteNumber(metric.coverage80) && metric.coverage50 > metric.coverage80)) issues.push({ code: "invalid-row", path, message: "Reportable metrics require eight unique realized events and nested finite event-weighted coverage." });
      } else if (metric.availability !== "unavailable" || metric.reason !== "minimum-score-count" || (isCount(metric.realizedEventCount) && metric.realizedEventCount >= FORECAST_HEALTH_MIN_REPORTABLE_SCORES)) issues.push({ code: "invalid-row", path, message: "Unreportable metrics require fewer than eight unique realized events and the exact reason." });
    });
    const metrics = value.metrics as ForecastShadowHealthMetricV1[];
    if (stableSerializeHistoricalAnalysis(metrics) !== stableSerializeHistoricalAnalysis([...metrics].sort((left, right) => textOrder(metricKey(left), metricKey(right)))) || new Set(metrics.map(metricKey)).size !== metrics.length) issues.push({ code: "invalid-order", path: "health.metrics", message: "Metrics must be unique and in canonical order." });
    const overall = metrics.filter((metric) => metric.groupKind === "overall");
    const metricCountFields = ["forecastCount", "scoredCount", "pendingCount", "dataGapCount"] as const;
    for (const kind of ["public-release", "next-eligible-prerelease-event"] as const) {
      const root = overall.find((metric) => metric.targetKind === kind);
      for (const groupKind of ["platform", "model-cohort"] as const) {
        const rows = metrics.filter((metric) => metric.targetKind === kind && metric.groupKind === groupKind);
        if (root && metricCountFields.some((field) => rows.reduce((sum, row) => sum + row[field], 0) !== root[field])) issues.push({ code: "invalid-row", path: "health.metrics", message: "Platform and cohort metrics must each partition their target-kind overall row exactly." });
      }
    }
    const summary = isRecord(value.summary) ? value.summary : {};
    if (metricCountFields.some((field) => !isCount(summary[field]) || overall.reduce((sum, row) => sum + row[field], 0) !== summary[field])) issues.push({ code: "invalid-row", path: "health.metrics", message: "Target-kind overall metrics must partition the report summary exactly." });
    if (isRecord(value.summary) && isRecord(value.statistics)) { const statistical = value.summary.scoredCount === 0 ? "no-scores" : overall.some((metric) => metric.availability === "available") ? "reportable" : "insufficient-sample"; if (value.statistics.status !== statistical) issues.push({ code: "invalid-row", path: "health.statistics.status", message: "Statistical reportability must derive from score counts only." }); }
    if (isCount(summary.forecastCount) && isCount(summary.pendingCount) && isCount(summary.dataGapCount) && isCount(operations.auditCount)) { const operational = summary.forecastCount === 0 ? "no-data" : freshness.status === "stale" || failures.length > 0 || summary.dataGapCount > 0 || operations.auditCount > 0 ? "degraded" : "healthy"; if (operations.status !== operational || operations.pendingCount !== summary.pendingCount || operations.dataGapCount !== summary.dataGapCount) issues.push({ code: "invalid-row", path: "health.operations", message: "Operational health and counts must derive independently from freshness, failures, gaps, and audits." }); }
    if (isSha(value.reportFingerprint) && value.reportFingerprint !== historicalAnalysisFingerprint(reportBody(reportWithoutFingerprint(value as unknown as ForecastShadowHealthReportV1)))) issues.push({ code: "invalid-fingerprint", path: "health.reportFingerprint", message: "Report fingerprint must bind the complete private health report." });
    if (byteLength(stableSerializeHistoricalAnalysis(value)) > FORECAST_SHADOW_HEALTH_MAX_BYTES) issues.push({ code: "size-limit", path: "health", message: "Health report exceeds 512 KiB." });
    return issues;
  } catch {
    return [{ code: "invalid-input", path: "health", message: "Health report could not be validated safely." }];
  }
}

export function buildForecastShadowHealthReport(args: {
  index: ForecastReconciliationIndexV1;
  /** Optional complete artifact maps enable an offline deep audit; daily health needs only the exact root. */
  scoreArtifacts?: ReadonlyMap<string, ForecastScoreArtifactV1>;
  forecastArtifacts?: ReadonlyMap<string, ForecastArtifactV1>;
  reconciliationRootArtifactId: string;
  generatedAt: string;
  freshnessThresholdHours?: number;
  runFailures?: readonly ForecastShadowRunFailureInputV1[];
}): ForecastShadowHealthReportV1 {
  if ((args.scoreArtifacts === undefined) !== (args.forecastArtifacts === undefined)) throw new ForecastScoringContractError([{ code: "invalid-input", path: "health", message: "Deep health audit requires both complete score and forecast artifact maps." }]);
  const indexIssues = args.scoreArtifacts && args.forecastArtifacts
    ? validateForecastReconciliationIndex(args.index, args.scoreArtifacts, args.forecastArtifacts)
    : validateForecastReconciliationIndex(args.index);
  if (indexIssues.length) throw new ForecastScoringContractError(indexIssues);
  if (forecastReconciliationIndexArtifactId(args.index) !== args.reconciliationRootArtifactId) throw new ForecastScoringContractError([{ code: "incompatible-artifact", path: "reconciliationRootArtifactId", message: "Health report root must be the exact raw digest of its index." }]);
  if (!isInstant(args.generatedAt)) throw new ForecastScoringContractError([{ code: "invalid-chronology", path: "generatedAt", message: "Health report generation requires a canonical instant." }]);
  const thresholdHours = args.freshnessThresholdHours ?? 48;
  if (!isFiniteNumber(thresholdHours) || thresholdHours <= 0 || thresholdHours > 8_760) throw new ForecastScoringContractError([{ code: "invalid-row", path: "freshnessThresholdHours", message: "Freshness threshold must be positive and at most one year." }]);
  const runFailures = [...(args.runFailures ?? [])].map((failure) => ({ ...failure, safeSummary: SAFE_FAILURE_SUMMARIES[failure.code] })).sort((left, right) => textOrder(failureKey(left), failureKey(right)));
  if (runFailures.length > FORECAST_HEALTH_MAX_FAILURES || new Set(runFailures.map((failure) => failure.runId)).size !== runFailures.length) throw new ForecastScoringContractError([{ code: "row-limit", path: "runFailures", message: "Run failures must be unique and within the v1 bound." }]);
  const groups = new Map<string, HealthAccumulator>();
  for (const entry of args.index.scores) {
    addHealthStatus(groups, entry, "score", entry);
  }
  for (const entry of args.index.pending) addHealthStatus(groups, entry, "pending");
  for (const entry of args.index.dataGaps) addHealthStatus(groups, entry, "gap");
  if (groups.size > FORECAST_HEALTH_MAX_GROUPS) throw new ForecastScoringContractError([{ code: "row-limit", path: "health.metrics", message: "Health group count exceeds the v1 bound." }]);
  const metrics = [...groups.values()].map(metricFromAccumulator).sort((left, right) => textOrder(metricKey(left), metricKey(right)));
  const forecastTimes = [...args.index.scores.map((entry) => entry.forecastGeneratedAt), ...args.index.pending.map((entry) => entry.forecastGeneratedAt), ...args.index.dataGaps.map((entry) => entry.forecastGeneratedAt)].sort(textOrder);
  const latestForecastGeneratedAt = forecastTimes.at(-1) ?? null;
  let ageHours: number | null = null;
  let freshnessStatus: "fresh" | "stale" | "no-data" = "no-data";
  if (latestForecastGeneratedAt) {
    ageHours = (new Date(args.generatedAt).getTime() - new Date(latestForecastGeneratedAt).getTime()) / 3_600_000;
    if (ageHours < 0) throw new ForecastScoringContractError([{ code: "invalid-chronology", path: "generatedAt", message: "Health report cannot precede its latest forecast." }]);
    freshnessStatus = ageHours <= thresholdHours ? "fresh" : "stale";
  }
  const gapCounts = new Map<ForecastDataGapReason, number>();
  for (const gap of args.index.dataGaps) gapCounts.set(gap.reason, (gapCounts.get(gap.reason) ?? 0) + 1);
  const dataGapCounts = [...gapCounts.entries()].sort(([left], [right]) => textOrder(left, right)).map(([reason, count]) => ({ reason, count }));
  const forecastCount = args.index.scores.length + args.index.pending.length + args.index.dataGaps.length;
  const operationsStatus = forecastCount === 0 ? "no-data" : freshnessStatus === "stale" || runFailures.length > 0 || args.index.dataGaps.length > 0 || args.index.audit.length > 0 ? "degraded" : "healthy";
  const statisticsStatus = args.index.scores.length === 0 ? "no-scores" : metrics.some((metric) => metric.groupKind === "overall" && metric.availability === "available") ? "reportable" : "insufficient-sample";
  const withoutFingerprint: Omit<ForecastShadowHealthReportV1, "reportFingerprint"> = {
    reportVersion: FORECAST_SHADOW_HEALTH_VERSION,
    mode: FORECAST_ARTIFACT_MODE,
    generatedAt: args.generatedAt,
    reconciliationRootArtifactId: args.reconciliationRootArtifactId,
    reconciliationCutoffAt: args.index.reconciliationCutoffAt,
    reconciliationCutoffDate: args.index.reconciliationCutoffDate,
    operations: { status: operationsStatus, freshness: { latestForecastGeneratedAt, ageHours, thresholdHours, status: freshnessStatus }, runFailures, pendingCount: args.index.pending.length, dataGapCount: args.index.dataGaps.length, auditCount: args.index.audit.length },
    statistics: { status: statisticsStatus, minimumRealizedEventCount: FORECAST_HEALTH_MIN_REPORTABLE_SCORES },
    summary: { forecastCount, scoredCount: args.index.scores.length, pendingCount: args.index.pending.length, dataGapCount: args.index.dataGaps.length, runFailureCount: runFailures.length },
    dataGapCounts,
    metrics,
  };
  const report = { ...withoutFingerprint, reportFingerprint: historicalAnalysisFingerprint(reportBody(withoutFingerprint)) };
  const reportIssues = validateForecastShadowHealthReport(report);
  if (reportIssues.length) throw new ForecastScoringContractError(reportIssues);
  return report;
}

export function serializeForecastShadowHealthReport(value: ForecastShadowHealthReportV1): string {
  const issues = validateForecastShadowHealthReport(value);
  if (issues.length) throw new ForecastScoringContractError(issues);
  return stableSerializeHistoricalAnalysis(value);
}

export function parseForecastShadowHealthReport(bytes: Uint8Array): ForecastShadowHealthReportV1 {
  try {
    if (bytes.byteLength > FORECAST_SHADOW_HEALTH_MAX_BYTES) throw new ForecastScoringContractError([{ code: "size-limit", path: "health", message: "Health bytes exceed 512 KiB before decoding." }]);
    const text = decoder.decode(bytes);
    const value = JSON.parse(text) as unknown;
    const issues = validateForecastShadowHealthReport(value);
    if (issues.length) throw new ForecastScoringContractError(issues);
    if (stableSerializeHistoricalAnalysis(value) !== text) throw new ForecastScoringContractError([{ code: "invalid-order", path: "health", message: "Stored health bytes are not canonical JSON." }]);
    return value as ForecastShadowHealthReportV1;
  } catch (error) {
    if (error instanceof ForecastScoringContractError) throw error;
    throw new ForecastScoringContractError([{ code: "invalid-input", path: "health", message: "Stored health report is not valid canonical UTF-8 JSON." }]);
  }
}

export function renderForecastShadowHealthReport(report: ForecastShadowHealthReportV1): string {
  const issues = validateForecastShadowHealthReport(report);
  if (issues.length) throw new ForecastScoringContractError(issues);
  const lines = [
    `Forecast shadow operations: ${report.operations.status.toUpperCase()}`,
    `Statistical reportability: ${report.statistics.status.toUpperCase()}`,
    `Generated: ${report.generatedAt}`,
    `Reconciled through: ${report.reconciliationCutoffAt}`,
    `Freshness: ${report.operations.freshness.status}${report.operations.freshness.ageHours === null ? "" : ` (${report.operations.freshness.ageHours.toFixed(1)} hours; threshold ${report.operations.freshness.thresholdHours} hours)`}`,
    `Forecasts: ${report.summary.forecastCount}; scored: ${report.summary.scoredCount}; pending: ${report.summary.pendingCount}; data gaps: ${report.summary.dataGapCount}; run failures: ${report.summary.runFailureCount}`,
    "",
    "Model performance (data gaps excluded):",
  ];
  for (const metric of report.metrics.filter((entry) => entry.groupKind === "overall")) {
    lines.push(metric.availability === "available"
      ? `- ${metric.targetKind}: forecasts=${metric.scoredCount}, unique events=${metric.realizedEventCount}, event-weighted MAE=${metric.meanAbsoluteErrorDays.toFixed(2)}d, bias=${metric.signedBiasDays.toFixed(2)}d, 50%=${(metric.coverage50 * 100).toFixed(1)}%, 80%=${(metric.coverage80 * 100).toFixed(1)}%`
      : `- ${metric.targetKind}: forecasts=${metric.scoredCount}, unique events=${metric.realizedEventCount}; metrics withheld until ${FORECAST_HEALTH_MIN_REPORTABLE_SCORES} unique events`);
  }
  if (report.dataGapCounts.length) {
    lines.push("", "Data gaps (not model errors):");
    for (const gap of report.dataGapCounts) lines.push(`- ${gap.reason}: ${gap.count}`);
  }
  if (report.operations.runFailures.length) {
    lines.push("", "Run failures:");
    for (const failure of report.operations.runFailures) lines.push(`- ${failure.failedAt} ${failure.code}: ${failure.safeSummary}`);
  }
  return lines.join("\n");
}

export type ForecastReconciliationCommitFailureReason =
  | "invalid-input"
  | "missing-prior-root"
  | "corrupt-prior-root"
  | "missing-forecast-artifact"
  | "corrupt-forecast-artifact"
  | "immutable-collision"
  | "non-atomic-adapter"
  | "stale-cas"
  | "incompatible-pointer"
  | "storage-failure";

export type ForecastReconciliationCommitResultV1 =
  | { committed: true; changed: boolean; pointer: ForecastPointerV1; reconciliation: ForecastScoreReconciliationResultV1 }
  | { committed: false; reason: ForecastReconciliationCommitFailureReason };

function equalBytes(left: Uint8Array, right: Uint8Array): boolean { return left.byteLength === right.byteLength && left.every((byte, index) => byte === right[index]); }

async function loadStoredForecast(storage: ForecastContractStorage, artifactId: string): Promise<{ status: "ok"; artifact: ForecastArtifactV1 } | { status: "missing" } | { status: "corrupt" }> {
  const bytes = await storage.readExact(forecastArtifactPath(artifactId));
  if (!bytes) return { status: "missing" };
  try {
    const artifact = parseForecastArtifact(bytes);
    return artifact.artifactId === artifactId ? { status: "ok", artifact } : { status: "corrupt" };
  } catch { return { status: "corrupt" }; }
}

async function putExactImmutable(storage: ForecastContractStorage, path: string, bytes: Uint8Array): Promise<"ok" | "collision"> {
  const result = await storage.putImmutable(path, bytes);
  if (result.status === "created") return "ok";
  const existing = await storage.readExact(path);
  return existing && equalBytes(existing, bytes) ? "ok" : "collision";
}

/**
 * Append immutable score artifacts and one immutable reconciliation snapshot,
 * then use the FR-012 generation+fingerprint CAS to move only the private root.
 * Orphan immutable writes after a lost CAS are safe and reusable by a retry.
 */
export async function commitForecastScoreReconciliation(args: {
  storage: ForecastContractStorage;
  previousPointer: ForecastPointerV1;
  reconciliationCutoffAt: string;
  evaluationEpoch: ForecastShadowEvaluationEpochV1;
  updatedAt: string;
  forecastArtifacts: readonly ForecastArtifactV1[];
  sourceDataset: HistoricalAnalysisDatasetV1;
  outcomeInstantBindings: readonly ForecastOutcomeInstantBindingV1[];
}): Promise<ForecastReconciliationCommitResultV1> {
  try {
    if (!args.storage.atomicPointerCas) return { committed: false, reason: "non-atomic-adapter" };
    if (validateForecastPointer(args.previousPointer).length || !isInstant(args.reconciliationCutoffAt) || !isInstant(args.updatedAt) || args.reconciliationCutoffAt > args.updatedAt) return { committed: false, reason: "invalid-input" };
    const previousForecasts = new Map<string, ForecastArtifactV1>();
    let previousIndex: ForecastReconciliationIndexV1 | null = null;
    if (args.previousPointer.reconciliationRootArtifactId) {
      const rootId = args.previousPointer.reconciliationRootArtifactId;
      const rootBytes = await args.storage.readExact(reconciliationRootArtifactPath(rootId));
      if (!rootBytes) return { committed: false, reason: "missing-prior-root" };
      try {
        if (rawArtifactDigest(rootBytes) !== rootId) return { committed: false, reason: "corrupt-prior-root" };
        previousIndex = parseForecastReconciliationIndex(rootBytes);
      } catch { return { committed: false, reason: "corrupt-prior-root" }; }
    }
    for (const forecast of args.forecastArtifacts) {
      if (validateForecastArtifact(forecast).length) return { committed: false, reason: "invalid-input" };
      if (previousIndex?.sourceForecastArtifactIds.includes(forecast.artifactId)) continue;
      const loaded = await loadStoredForecast(args.storage, forecast.artifactId);
      if (loaded.status === "missing") return { committed: false, reason: "missing-forecast-artifact" };
      if (loaded.status === "corrupt" || serializeForecastArtifact(loaded.artifact) !== serializeForecastArtifact(forecast)) return { committed: false, reason: "corrupt-forecast-artifact" };
    }
    const reconciliationArgs: ReconcileForecastScoresArgs = { reconciliationCutoffAt: args.reconciliationCutoffAt, evaluationEpoch: args.evaluationEpoch, forecastArtifacts: args.forecastArtifacts, sourceDataset: args.sourceDataset, outcomeInstantBindings: args.outcomeInstantBindings, previousIndex, previousForecastArtifacts: previousForecasts };
    const requiredForecastIds = forecastArtifactIdsRequiredForReconciliation(reconciliationArgs);
    for (const forecastId of requiredForecastIds) {
      const loaded = await loadStoredForecast(args.storage, forecastId);
      if (loaded.status === "missing") return { committed: false, reason: "missing-forecast-artifact" };
      if (loaded.status === "corrupt") return { committed: false, reason: "corrupt-forecast-artifact" };
      previousForecasts.set(forecastId, loaded.artifact);
    }
    const reconciliation = reconcileForecastScores({ ...reconciliationArgs, previousForecastArtifacts: previousForecasts });
    const rootBytes = encoder.encode(serializeForecastReconciliationIndex(reconciliation.index));
    if (rawArtifactDigest(rootBytes) !== reconciliation.indexArtifactId) return { committed: false, reason: "invalid-input" };
    if (args.previousPointer.reconciliationRootArtifactId === reconciliation.indexArtifactId) return { committed: true, changed: false, pointer: args.previousPointer, reconciliation };
    if (args.updatedAt <= args.previousPointer.updatedAt) return { committed: false, reason: "invalid-input" };
    for (const record of reconciliation.scoreArtifacts.filter((candidate) => reconciliation.newScoreArtifactIds.includes(candidate.artifactId))) {
      const bytes = encoder.encode(serializeForecastScoreArtifact(record.artifact));
      if (await putExactImmutable(args.storage, forecastScoreArtifactPath(record.artifactId), bytes) === "collision") return { committed: false, reason: "immutable-collision" };
    }
    if (await putExactImmutable(args.storage, reconciliationRootArtifactPath(reconciliation.indexArtifactId), rootBytes) === "collision") return { committed: false, reason: "immutable-collision" };
    const nextPointer = commitReconciliationRoot(args.previousPointer, reconciliation.indexArtifactId, args.updatedAt);
    const committed = await commitForecastArtifactTransition({
      storage: args.storage,
      previous: args.previousPointer,
      next: nextPointer,
      validateReconciliationRoot: isValidForecastReconciliationRoot,
    });
    if (committed.committed) return { committed: true, changed: true, pointer: committed.pointer, reconciliation };
    if (committed.reason === "stale-cas") return { committed: false, reason: "stale-cas" };
    if (committed.reason === "non-atomic-adapter") return { committed: false, reason: "non-atomic-adapter" };
    if (["missing-artifact", "incompatible-artifact", "invalid"].includes(committed.reason)) return { committed: false, reason: "incompatible-pointer" };
    if (committed.reason === "immutable-collision") return { committed: false, reason: "immutable-collision" };
    return { committed: false, reason: "storage-failure" };
  } catch (error) {
    return { committed: false, reason: error instanceof ForecastScoringContractError ? "invalid-input" : "storage-failure" };
  }
}
