import { createHash } from "node:crypto";

import {
  HISTORICAL_ANALYSIS_DATASET_VERSION,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
} from "./historical-analysis-dataset";
import { NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION, type EligiblePrereleaseStage } from "./next-eligible-prerelease-event";
import {
  RELEASE_DATE_CANDIDATES,
  RELEASE_DATE_CANDIDATES_VERSION,
  type ReleaseDateCandidateId,
} from "./release-date-candidates";
import { RELEASE_DATE_INTERVAL_CALIBRATION_VERSION } from "./release-date-interval-calibration";
import { WALK_FORWARD_EVALUATION_VERSION } from "./walk-forward-evaluation";

export const FORECAST_ARTIFACT_VERSION = "forecast-artifact/v1";
export const FORECAST_POINTER_VERSION = "forecast-pointer/v1";
export const FORECAST_ARTIFACT_MODE = "private-shadow";
export const FORECAST_INTERVAL_ROUNDING_RULE = "outward-floor-half-up-ceil/v1";
export const FORECAST_ARTIFACT_MAX_BYTES = 1_048_576;
export const FORECAST_POINTER_MAX_BYTES = 16_384;
export const FORECAST_ARTIFACT_MAX_TARGETS = 512;
export const FORECAST_ARTIFACT_MAX_METRICS = 512;
export const FORECAST_ARTIFACT_MAX_EXCLUSIONS = 2_048;
export const FORECAST_ARTIFACT_MAX_EVIDENCE_IDS = 4_096;
export const FORECAST_POINTER_PATH = "forecast/pointers/private-shadow.json";
export const FORECAST_RUN_IDENTITY_VERSION = "forecast-run-identity/v1";
export const FORECAST_NEXT_EVENT_POINT_ESTIMATOR = "next-event-timing-median";

export type ForecastTargetKind = "public-release" | "next-eligible-prerelease-event";
export type ForecastPointEstimatorV1 = ReleaseDateCandidateId | typeof FORECAST_NEXT_EVENT_POINT_ESTIMATOR;
export type ForecastArtifactAvailabilityReason = "insufficient-model-history" | "insufficient-calibration-history" | "ambiguous-chronology" | "weak-next-stage-mode" | "inactive-release" | "invalid-source-evidence";

export interface ForecastArtifactProvenanceV1 {
  sourceAsOfDate: string;
  sourceIssuedAt: string;
  sourceEvidenceIds: readonly string[];
  historicalDataset: { version: typeof HISTORICAL_ANALYSIS_DATASET_VERSION; fingerprint: string };
  evaluation: { version: typeof WALK_FORWARD_EVALUATION_VERSION; fingerprint: string };
  publicReleaseModel: { version: typeof RELEASE_DATE_CANDIDATES_VERSION; fingerprint: string };
  publicReleaseCalibration: { version: typeof RELEASE_DATE_INTERVAL_CALIBRATION_VERSION; fingerprint: string };
  nextEventModel: { version: typeof NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION; fingerprint: string };
  /** FR-011 owns its calibration internally, so this binds that same exact contract independently. */
  nextEventCalibration: { version: typeof NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION; fingerprint: string };
  codeFingerprint: string;
}

export interface ForecastArtifactRunIdentityV1 {
  version: typeof FORECAST_RUN_IDENTITY_VERSION;
  pipeline: "daily-shadow";
  /** Stable scheduled UTC day; retries of this logical run retain this value. */
  scheduledFor: string;
}

export interface ForecastArtifactCohortV1 {
  modelCohortId: string;
  modelTrainingCount: number;
  calibrationPoolId: string;
  calibrationResidualCount: number;
}

export interface ForecastArtifactIntervalV1 {
  level: 0.5 | 0.8;
  residualCount: number;
  rank: number;
  quantileResidualDays: number;
  lowerDays: number;
  pointDays: number;
  upperDays: number;
  lowerCalendarDate: string;
  pointCalendarDate: string;
  upperCalendarDate: string;
}

export interface ForecastArtifactPredictionV1 {
  /** Exact upstream algorithm that produced pointDays. */
  pointEstimator: ForecastPointEstimatorV1;
  pointDays: number;
  pointCalendarDate: string;
  roundingRule: typeof FORECAST_INTERVAL_ROUNDING_RULE;
  intervals: readonly [ForecastArtifactIntervalV1, ForecastArtifactIntervalV1];
}

interface ForecastArtifactTargetBaseV1 {
  targetId: string;
  releaseId: string;
  platformId: string;
  anchorEventId: string;
  anchorStage: string;
  anchorOccurredOn: string;
  originOn: string;
  sourceEvidenceIds: readonly string[];
  modelFingerprint: string;
  calibrationFingerprint: string;
  cohort: ForecastArtifactCohortV1;
}

export type ForecastArtifactTargetV1 =
  | (ForecastArtifactTargetBaseV1 & { targetKind: "public-release"; availability: "available"; prediction: ForecastArtifactPredictionV1 })
  | (ForecastArtifactTargetBaseV1 & { targetKind: "public-release"; availability: "unavailable"; reason: ForecastArtifactAvailabilityReason })
  | (ForecastArtifactTargetBaseV1 & { targetKind: "next-eligible-prerelease-event"; availability: "available"; predictedEligibleStage: EligiblePrereleaseStage; prediction: ForecastArtifactPredictionV1 })
  | (ForecastArtifactTargetBaseV1 & { targetKind: "next-eligible-prerelease-event"; availability: "unavailable"; reason: ForecastArtifactAvailabilityReason });

export type ForecastArtifactMetricV1 =
  | { metricId: string; targetKind: ForecastTargetKind; groupId: string; scoreCount: number; availability: "available"; maeDays: number; medianAbsoluteErrorDays: number; signedBiasDays: number; coverage50: number; coverage80: number }
  | { metricId: string; targetKind: ForecastTargetKind; groupId: string; scoreCount: number; availability: "unavailable"; reason: "minimum-score-count" };

export interface ForecastArtifactExclusionV1 {
  exclusionId: string;
  targetKind: ForecastTargetKind;
  targetId: string | null;
  reason: string;
  sourceEvidenceIds: readonly string[];
}

export interface ForecastArtifactV1 {
  artifactVersion: typeof FORECAST_ARTIFACT_VERSION;
  mode: typeof FORECAST_ARTIFACT_MODE;
  generatedAt: string;
  runIdentity: ForecastArtifactRunIdentityV1;
  runKey: string;
  semanticFingerprint: string;
  artifactId: string;
  provenance: ForecastArtifactProvenanceV1;
  targets: readonly ForecastArtifactTargetV1[];
  metrics: readonly ForecastArtifactMetricV1[];
  exclusions: readonly ForecastArtifactExclusionV1[];
}

export interface ForecastArtifactDraftV1 {
  generatedAt: string;
  runIdentity: ForecastArtifactRunIdentityV1;
  provenance: ForecastArtifactProvenanceV1;
  targets: readonly ForecastArtifactTargetV1[];
  metrics: readonly ForecastArtifactMetricV1[];
  exclusions: readonly ForecastArtifactExclusionV1[];
}

export type ForecastPointerTransition = "initialize" | "candidate-written" | "activate-shadow" | "rollback-shadow" | "reconciliation-committed";
export interface ForecastPointerV1 {
  pointerVersion: typeof FORECAST_POINTER_VERSION;
  compatibleArtifactVersion: typeof FORECAST_ARTIFACT_VERSION;
  mode: typeof FORECAST_ARTIFACT_MODE;
  generation: number;
  previousPointerFingerprint: string | null;
  pointerFingerprint: string;
  transition: ForecastPointerTransition;
  updatedAt: string;
  candidateArtifactId: string | null;
  activeArtifactId: string | null;
  rollbackArtifactId: string | null;
  reconciliationRootArtifactId: string | null;
  publicReadEnabled: false;
}

export type ForecastContractValidationCode = "invalid-input" | "unsupported-version" | "unknown-property" | "invalid-provenance" | "invalid-evidence" | "invalid-row" | "invalid-interval" | "invalid-order" | "invalid-fingerprint" | "size-limit" | "row-limit" | "public-mode" | "invalid-transition" | "incompatible-artifact";
export interface ForecastContractValidationIssue { code: ForecastContractValidationCode; path: string; message: string; }
export class ForecastContractError extends Error {
  constructor(public readonly issues: readonly ForecastContractValidationIssue[]) {
    super(`Forecast contract is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "ForecastContractError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const TRANSITIONS = new Set<ForecastPointerTransition>(["initialize", "candidate-written", "activate-shadow", "rollback-shadow", "reconciliation-committed"]);
const TARGET_KINDS = new Set<ForecastTargetKind>(["public-release", "next-eligible-prerelease-event"]);
const encoder = new TextEncoder();
// Keep a UTF-8 BOM visible so JSON parsing rejects it. Canonical stored bytes
// have exactly one representation and never silently normalize a prefix.
const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function textOrder(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function isSha(value: unknown): value is string { return typeof value === "string" && SHA_256.test(value); }
function isText(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
function isCount(value: unknown): value is number { return Number.isSafeInteger(value) && (value as number) >= 0; }
function isFiniteNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
function isCanonicalStage(value: unknown): value is string { return typeof value === "string" && (/^(?:developer-beta|public-beta|release-candidate):[1-9]\d*$/.test(value) || value === "golden-master" || value === "public-release"); }
function isDay(value: unknown): value is string { if (typeof value !== "string" || !ISO_DAY.test(value)) return false; const [y, m, d] = value.split("-").map(Number); const parsed = new Date(Date.UTC(y, m - 1, d)); return parsed.getUTCFullYear() === y && parsed.getUTCMonth() === m - 1 && parsed.getUTCDate() === d; }
function isInstant(value: unknown): value is string { if (typeof value !== "string") return false; const time = new Date(value); return !Number.isNaN(time.getTime()) && time.toISOString() === value; }
function dayNumber(value: string): number { const [y, m, d] = value.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000); }
function addDays(value: string, days: number): string { return new Date((dayNumber(value) + days) * 86_400_000).toISOString().slice(0, 10); }
function byteLength(value: string): number { return encoder.encode(value).byteLength; }
function exactKeys(value: Record<string, unknown>, allowed: readonly string[], path: string, issues: ForecastContractValidationIssue[]): void { const set = new Set(allowed); for (const key of Object.keys(value)) if (!set.has(key)) issues.push({ code: "unknown-property", path: `${path}.${key}`, message: "Unknown properties are not compatible with v1." }); for (const key of allowed) if (!Object.hasOwn(value, key)) issues.push({ code: "invalid-row", path: `${path}.${key}`, message: "Required property is missing." }); }
function sortedUnique(values: readonly string[]): string[] { return [...new Set(values)].sort(textOrder); }
function evidenceIssues(value: unknown, path: string, required = true): ForecastContractValidationIssue[] { if (!Array.isArray(value) || (required && value.length === 0) || value.some((id) => !isText(id))) return [{ code: "invalid-evidence", path, message: required ? "At least one non-empty evidence ID is required." : "Evidence IDs must be non-empty strings." }]; if (value.length > FORECAST_ARTIFACT_MAX_EVIDENCE_IDS) return [{ code: "row-limit", path, message: "Evidence ID count exceeds the v1 bound." }]; if (stableSerializeHistoricalAnalysis(value) !== stableSerializeHistoricalAnalysis(sortedUnique(value as string[]))) return [{ code: "invalid-order", path, message: "Evidence IDs must be unique and sorted." }]; return []; }
function sha256Bytes(bytes: Uint8Array): string { return createHash("sha256").update(bytes).digest("hex"); }

function canonicalTargetKey(target: ForecastArtifactTargetV1): string { return `${target.targetKind}\u0000${target.targetId}`; }
function canonicalMetricKey(metric: ForecastArtifactMetricV1): string { return `${metric.targetKind}\u0000${metric.metricId}`; }
function canonicalExclusionKey(exclusion: ForecastArtifactExclusionV1): string { return `${exclusion.targetKind}\u0000${exclusion.exclusionId}`; }
function canonicalizeProvenance(value: ForecastArtifactProvenanceV1): ForecastArtifactProvenanceV1 { return { ...value, sourceEvidenceIds: sortedUnique(value.sourceEvidenceIds) }; }
function canonicalizeTarget(value: ForecastArtifactTargetV1): ForecastArtifactTargetV1 { return { ...value, sourceEvidenceIds: sortedUnique(value.sourceEvidenceIds) }; }
function canonicalizeExclusion(value: ForecastArtifactExclusionV1): ForecastArtifactExclusionV1 { return { ...value, sourceEvidenceIds: sortedUnique(value.sourceEvidenceIds) }; }
function semanticBody(provenance: ForecastArtifactProvenanceV1, targets: readonly ForecastArtifactTargetV1[], metrics: readonly ForecastArtifactMetricV1[], exclusions: readonly ForecastArtifactExclusionV1[]) { return { artifactVersion: FORECAST_ARTIFACT_VERSION, mode: FORECAST_ARTIFACT_MODE, provenance, targets, metrics, exclusions }; }
function runKeyBody(identity: ForecastArtifactRunIdentityV1) { return { runKeyVersion: "forecast-run-key/v1", artifactVersion: FORECAST_ARTIFACT_VERSION, mode: FORECAST_ARTIFACT_MODE, runIdentity: identity }; }
function artifactIdentity(value: Omit<ForecastArtifactV1, "artifactId">) { return value; }

function componentIssues(value: unknown, path: string, version: string): ForecastContractValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-provenance", path, message: "A versioned fingerprint component is required." }];
  const issues: ForecastContractValidationIssue[] = [];
  exactKeys(value, ["version", "fingerprint"], path, issues);
  if (value.version !== version || !isSha(value.fingerprint)) issues.push({ code: "invalid-provenance", path, message: `Expected exact ${version} with a SHA-256 fingerprint.` });
  return issues;
}

function provenanceIssues(value: unknown): ForecastContractValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-provenance", path: "provenance", message: "Provenance is required." }];
  const issues: ForecastContractValidationIssue[] = [];
  exactKeys(value, ["sourceAsOfDate", "sourceIssuedAt", "sourceEvidenceIds", "historicalDataset", "evaluation", "publicReleaseModel", "publicReleaseCalibration", "nextEventModel", "nextEventCalibration", "codeFingerprint"], "provenance", issues);
  if (!isDay(value.sourceAsOfDate) || !isInstant(value.sourceIssuedAt)) issues.push({ code: "invalid-provenance", path: "provenance", message: "A valid source cutoff and canonical issuance timestamp are required." });
  issues.push(...evidenceIssues(value.sourceEvidenceIds, "provenance.sourceEvidenceIds"));
  issues.push(...componentIssues(value.historicalDataset, "provenance.historicalDataset", HISTORICAL_ANALYSIS_DATASET_VERSION));
  issues.push(...componentIssues(value.evaluation, "provenance.evaluation", WALK_FORWARD_EVALUATION_VERSION));
  issues.push(...componentIssues(value.publicReleaseModel, "provenance.publicReleaseModel", RELEASE_DATE_CANDIDATES_VERSION));
  issues.push(...componentIssues(value.publicReleaseCalibration, "provenance.publicReleaseCalibration", RELEASE_DATE_INTERVAL_CALIBRATION_VERSION));
  issues.push(...componentIssues(value.nextEventModel, "provenance.nextEventModel", NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION));
  issues.push(...componentIssues(value.nextEventCalibration, "provenance.nextEventCalibration", NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION));
  if (!isSha(value.codeFingerprint)) issues.push({ code: "invalid-provenance", path: "provenance.codeFingerprint", message: "A code fingerprint is required." });
  return issues;
}

function cohortIssues(value: unknown, path: string): ForecastContractValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Cohort provenance is required." }];
  const issues: ForecastContractValidationIssue[] = [];
  exactKeys(value, ["modelCohortId", "modelTrainingCount", "calibrationPoolId", "calibrationResidualCount"], path, issues);
  if (!isText(value.modelCohortId) || !isCount(value.modelTrainingCount) || !isText(value.calibrationPoolId) || !isCount(value.calibrationResidualCount)) issues.push({ code: "invalid-row", path, message: "Cohort IDs and non-negative counts are required." });
  return issues;
}

function intervalIssues(value: unknown, path: string, expectedLevel: 0.5 | 0.8, anchorOn: string, pointDays: number, pointDate: string, residualCount: number): ForecastContractValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-interval", path, message: "A calibrated interval is required." }];
  const issues: ForecastContractValidationIssue[] = [];
  exactKeys(value, ["level", "residualCount", "rank", "quantileResidualDays", "lowerDays", "pointDays", "upperDays", "lowerCalendarDate", "pointCalendarDate", "upperCalendarDate"], path, issues);
  const numeric = [value.quantileResidualDays, value.lowerDays, value.pointDays, value.upperDays].every(isFiniteNumber);
  if (value.level !== expectedLevel || !isCount(value.residualCount) || value.residualCount !== residualCount || residualCount < 8 || !Number.isSafeInteger(value.rank) || (value.rank as number) < 1 || !numeric) issues.push({ code: "invalid-interval", path, message: "Interval level, residual count, rank, and finite bounds are required." });
  if (numeric) {
    const q = value.quantileResidualDays as number;
    const lower = value.lowerDays as number;
    const upper = value.upperDays as number;
    const expectedRank = Math.min(residualCount, Math.max(1, Math.ceil(expectedLevel * (residualCount + 1))));
    if (q < 0 || value.pointDays !== pointDays || lower !== pointDays - q || upper !== pointDays + q || value.rank !== expectedRank || lower > pointDays || upper < pointDays) issues.push({ code: "invalid-interval", path, message: "Interval must be symmetric, contain the point, and use the v1 finite-sample rank." });
    if (!isDay(value.lowerCalendarDate) || value.lowerCalendarDate !== addDays(anchorOn, Math.floor(lower)) || value.pointCalendarDate !== pointDate || !isDay(value.upperCalendarDate) || value.upperCalendarDate !== addDays(anchorOn, Math.ceil(upper))) issues.push({ code: "invalid-interval", path, message: "Calendar bounds must be rounded outward exactly once from the anchor." });
  }
  return issues;
}

function predictionIssues(value: unknown, path: string, targetKind: ForecastTargetKind, anchorOn: string, cohort: ForecastArtifactCohortV1): ForecastContractValidationIssue[] {
  if (!isRecord(value)) return [{ code: "invalid-interval", path, message: "An available target requires a calibrated prediction." }];
  const issues: ForecastContractValidationIssue[] = [];
  exactKeys(value, ["pointEstimator", "pointDays", "pointCalendarDate", "roundingRule", "intervals"], path, issues);
  const estimatorIsValid = targetKind === "public-release"
    ? RELEASE_DATE_CANDIDATES.includes(value.pointEstimator as ReleaseDateCandidateId)
    : value.pointEstimator === FORECAST_NEXT_EVENT_POINT_ESTIMATOR;
  if (!estimatorIsValid) issues.push({ code: "invalid-row", path: `${path}.pointEstimator`, message: "The point estimator must identify an exact upstream algorithm for the target kind." });
  if (!isFiniteNumber(value.pointDays) || (value.pointDays as number) < 0 || value.roundingRule !== FORECAST_INTERVAL_ROUNDING_RULE || !isDay(value.pointCalendarDate) || (isFiniteNumber(value.pointDays) && value.pointCalendarDate !== addDays(anchorOn, Math.floor((value.pointDays as number) + 0.5)))) issues.push({ code: "invalid-interval", path, message: "A finite non-negative point estimate and its half-up point date are required." });
  if (!Array.isArray(value.intervals) || value.intervals.length !== 2 || !isFiniteNumber(value.pointDays) || !isDay(value.pointCalendarDate)) return [...issues, { code: "invalid-interval", path: `${path}.intervals`, message: "Exactly calibrated 50% and 80% intervals are required." }];
  issues.push(...intervalIssues(value.intervals[0], `${path}.intervals[0]`, 0.5, anchorOn, value.pointDays, value.pointCalendarDate, cohort.calibrationResidualCount));
  issues.push(...intervalIssues(value.intervals[1], `${path}.intervals[1]`, 0.8, anchorOn, value.pointDays, value.pointCalendarDate, cohort.calibrationResidualCount));
  const fifty = value.intervals[0]; const eighty = value.intervals[1];
  if (isRecord(fifty) && isRecord(eighty) && isFiniteNumber(fifty.lowerDays) && isFiniteNumber(fifty.upperDays) && isFiniteNumber(eighty.lowerDays) && isFiniteNumber(eighty.upperDays) && (fifty.lowerDays < eighty.lowerDays || fifty.upperDays > eighty.upperDays)) issues.push({ code: "invalid-interval", path: `${path}.intervals`, message: "The 50% interval must be nested within the 80% interval." });
  return issues;
}

function targetIssues(value: unknown, index: number, provenance: ForecastArtifactProvenanceV1): ForecastContractValidationIssue[] {
  const path = `targets[${index}]`;
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Target must be an object." }];
  const issues: ForecastContractValidationIssue[] = [];
  const common = ["targetId", "targetKind", "availability", "releaseId", "platformId", "anchorEventId", "anchorStage", "anchorOccurredOn", "originOn", "sourceEvidenceIds", "modelFingerprint", "calibrationFingerprint", "cohort"];
  const available = value.availability === "available";
  const next = value.targetKind === "next-eligible-prerelease-event";
  exactKeys(value, [...common, ...(available ? ["prediction", ...(next ? ["predictedEligibleStage"] : [])] : ["reason"])], path, issues);
  if (!isText(value.targetId) || !TARGET_KINDS.has(value.targetKind as ForecastTargetKind) || !["available", "unavailable"].includes(value.availability as string) || !isText(value.releaseId) || !isText(value.platformId) || !isText(value.anchorEventId) || !isCanonicalStage(value.anchorStage) || !isDay(value.anchorOccurredOn) || !isDay(value.originOn) || (isDay(value.anchorOccurredOn) && isDay(value.originOn) && value.anchorOccurredOn > value.originOn) || (isDay(value.anchorOccurredOn) && value.anchorOccurredOn > provenance.sourceAsOfDate) || (isDay(value.originOn) && value.originOn > provenance.sourceAsOfDate) || (next && !/^(?:developer-beta|public-beta|release-candidate):[1-9]\d*$/.test(value.anchorStage as string))) issues.push({ code: "invalid-row", path, message: "Stable target identity, canonical stage, and source-cutoff-bounded anchor/origin are required." });
  issues.push(...evidenceIssues(value.sourceEvidenceIds, `${path}.sourceEvidenceIds`));
  if (Array.isArray(value.sourceEvidenceIds) && value.sourceEvidenceIds.some((id) => !provenance.sourceEvidenceIds.includes(id as string))) issues.push({ code: "invalid-evidence", path: `${path}.sourceEvidenceIds`, message: "Target evidence must be bound by artifact provenance." });
  const expectedModel = next ? provenance.nextEventModel.fingerprint : provenance.publicReleaseModel.fingerprint;
  const expectedCalibration = next ? provenance.nextEventCalibration.fingerprint : provenance.publicReleaseCalibration.fingerprint;
  if (value.modelFingerprint !== expectedModel || value.calibrationFingerprint !== expectedCalibration) issues.push({ code: "invalid-provenance", path, message: "Target model and calibration fingerprints must match the tagged artifact provenance." });
  issues.push(...cohortIssues(value.cohort, `${path}.cohort`));
  if (available && isRecord(value.cohort) && isCount(value.cohort.modelTrainingCount) && isCount(value.cohort.calibrationResidualCount)) {
    if (value.cohort.modelTrainingCount < 8 || value.cohort.calibrationResidualCount < 8) issues.push({ code: "invalid-row", path: `${path}.cohort`, message: "Available targets require at least eight model and calibration examples." });
    if (isDay(value.anchorOccurredOn)) issues.push(...predictionIssues(value.prediction, `${path}.prediction`, value.targetKind as ForecastTargetKind, value.anchorOccurredOn, value.cohort as unknown as ForecastArtifactCohortV1));
    if (next && !["developer-beta", "public-beta", "release-candidate"].includes(value.predictedEligibleStage as string)) issues.push({ code: "invalid-row", path: `${path}.predictedEligibleStage`, message: "Next-event target stage must be one of the three eligible prerelease classes." });
  } else if (!available && !(isText(value.reason) && ["insufficient-model-history", "insufficient-calibration-history", "ambiguous-chronology", "weak-next-stage-mode", "inactive-release", "invalid-source-evidence"].includes(value.reason))) issues.push({ code: "invalid-row", path: `${path}.reason`, message: "Unavailable targets require one v1 reason and no prediction dates." });
  return issues;
}

function metricIssues(value: unknown, index: number): ForecastContractValidationIssue[] {
  const path = `metrics[${index}]`;
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Metric must be an object." }];
  const issues: ForecastContractValidationIssue[] = [];
  const available = value.availability === "available";
  exactKeys(value, available ? ["metricId", "targetKind", "groupId", "scoreCount", "availability", "maeDays", "medianAbsoluteErrorDays", "signedBiasDays", "coverage50", "coverage80"] : ["metricId", "targetKind", "groupId", "scoreCount", "availability", "reason"], path, issues);
  if (!isText(value.metricId) || !TARGET_KINDS.has(value.targetKind as ForecastTargetKind) || !isText(value.groupId) || !isCount(value.scoreCount) || !["available", "unavailable"].includes(value.availability as string)) issues.push({ code: "invalid-row", path, message: "Metric identity, target, count, and availability are required." });
  if (available) {
    if ((value.scoreCount as number) < 8 || ![value.maeDays, value.medianAbsoluteErrorDays, value.signedBiasDays, value.coverage50, value.coverage80].every(isFiniteNumber) || (value.maeDays as number) < 0 || (value.medianAbsoluteErrorDays as number) < 0 || (value.coverage50 as number) < 0 || (value.coverage50 as number) > 1 || (value.coverage80 as number) < 0 || (value.coverage80 as number) > 1 || (value.coverage50 as number) > (value.coverage80 as number)) issues.push({ code: "invalid-row", path, message: "Available metrics require eight scores, non-negative errors, and nested finite coverage values." });
  } else if (value.reason !== "minimum-score-count" || (isCount(value.scoreCount) && value.scoreCount >= 8)) issues.push({ code: "invalid-row", path, message: "Unavailable metrics must truthfully have fewer than eight scores." });
  return issues;
}

function exclusionIssues(value: unknown, index: number, provenance: ForecastArtifactProvenanceV1): ForecastContractValidationIssue[] {
  const path = `exclusions[${index}]`;
  if (!isRecord(value)) return [{ code: "invalid-row", path, message: "Exclusion must be an object." }];
  const issues: ForecastContractValidationIssue[] = [];
  exactKeys(value, ["exclusionId", "targetKind", "targetId", "reason", "sourceEvidenceIds"], path, issues);
  if (!isText(value.exclusionId) || !TARGET_KINDS.has(value.targetKind as ForecastTargetKind) || !(value.targetId === null || isText(value.targetId)) || !isText(value.reason)) issues.push({ code: "invalid-row", path, message: "Exclusion identity, kind, nullable target, and reason are required." });
  issues.push(...evidenceIssues(value.sourceEvidenceIds, `${path}.sourceEvidenceIds`));
  if (Array.isArray(value.sourceEvidenceIds) && value.sourceEvidenceIds.some((id) => !provenance.sourceEvidenceIds.includes(id as string))) issues.push({ code: "invalid-evidence", path: `${path}.sourceEvidenceIds`, message: "Exclusion evidence must be bound by artifact provenance." });
  return issues;
}

export function validateForecastArtifact(value: unknown): ForecastContractValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "artifact", message: "Artifact must be an object." }];
    const issues: ForecastContractValidationIssue[] = [];
    exactKeys(value, ["artifactVersion", "mode", "generatedAt", "runIdentity", "runKey", "semanticFingerprint", "artifactId", "provenance", "targets", "metrics", "exclusions"], "artifact", issues);
    if (value.artifactVersion !== FORECAST_ARTIFACT_VERSION) issues.push({ code: "unsupported-version", path: "artifact.artifactVersion", message: `Expected ${FORECAST_ARTIFACT_VERSION}.` });
    if (value.mode !== FORECAST_ARTIFACT_MODE) issues.push({ code: "public-mode", path: "artifact.mode", message: "v1 artifacts are private shadow only." });
    if (!isInstant(value.generatedAt)) issues.push({ code: "invalid-row", path: "artifact.generatedAt", message: "generatedAt must be a canonical UTC instant." });
    if (!isRecord(value.runIdentity)) issues.push({ code: "invalid-row", path: "artifact.runIdentity", message: "A stable scheduled run identity is required." });
    else {
      exactKeys(value.runIdentity, ["version", "pipeline", "scheduledFor"], "artifact.runIdentity", issues);
      if (value.runIdentity.version !== FORECAST_RUN_IDENTITY_VERSION || value.runIdentity.pipeline !== "daily-shadow" || !isDay(value.runIdentity.scheduledFor)) issues.push({ code: "invalid-row", path: "artifact.runIdentity", message: "Run identity must use the daily-shadow v1 scheduled day." });
      if (isInstant(value.generatedAt) && isDay(value.runIdentity.scheduledFor) && value.runIdentity.scheduledFor > value.generatedAt.slice(0, 10)) issues.push({ code: "invalid-row", path: "artifact.runIdentity.scheduledFor", message: "The scheduled run day cannot be after artifact generation." });
    }
    issues.push(...provenanceIssues(value.provenance));
    if (isInstant(value.generatedAt) && isRecord(value.provenance) && isInstant(value.provenance.sourceIssuedAt) && value.generatedAt < value.provenance.sourceIssuedAt) issues.push({ code: "invalid-provenance", path: "artifact.generatedAt", message: "Artifact generation cannot precede source issuance." });
    if (isInstant(value.generatedAt) && isRecord(value.provenance) && isDay(value.provenance.sourceAsOfDate) && value.generatedAt.slice(0, 10) < value.provenance.sourceAsOfDate) issues.push({ code: "invalid-provenance", path: "artifact.generatedAt", message: "Artifact generation cannot precede its source cutoff day." });
    if (!Array.isArray(value.targets) || !Array.isArray(value.metrics) || !Array.isArray(value.exclusions)) return [...issues, { code: "invalid-row", path: "artifact", message: "Target, metric, and exclusion arrays are required." }];
    if (value.targets.length > FORECAST_ARTIFACT_MAX_TARGETS || value.metrics.length > FORECAST_ARTIFACT_MAX_METRICS || value.exclusions.length > FORECAST_ARTIFACT_MAX_EXCLUSIONS) issues.push({ code: "row-limit", path: "artifact", message: "One or more artifact row bounds are exceeded." });
    if (isRecord(value.provenance)) {
      value.targets.forEach((row, index) => issues.push(...targetIssues(row, index, value.provenance as unknown as ForecastArtifactProvenanceV1)));
      value.metrics.forEach((row, index) => issues.push(...metricIssues(row, index)));
      value.exclusions.forEach((row, index) => issues.push(...exclusionIssues(row, index, value.provenance as unknown as ForecastArtifactProvenanceV1)));
    }
    const targets = value.targets as ForecastArtifactTargetV1[]; const metrics = value.metrics as ForecastArtifactMetricV1[]; const exclusions = value.exclusions as ForecastArtifactExclusionV1[];
    if (stableSerializeHistoricalAnalysis(targets) !== stableSerializeHistoricalAnalysis([...targets].sort((a, b) => textOrder(canonicalTargetKey(a), canonicalTargetKey(b)))) || new Set(targets.map(canonicalTargetKey)).size !== targets.length) issues.push({ code: "invalid-order", path: "artifact.targets", message: "Targets must be unique and in canonical order." });
    if (stableSerializeHistoricalAnalysis(metrics) !== stableSerializeHistoricalAnalysis([...metrics].sort((a, b) => textOrder(canonicalMetricKey(a), canonicalMetricKey(b)))) || new Set(metrics.map(canonicalMetricKey)).size !== metrics.length) issues.push({ code: "invalid-order", path: "artifact.metrics", message: "Metrics must be unique and in canonical order." });
    if (stableSerializeHistoricalAnalysis(exclusions) !== stableSerializeHistoricalAnalysis([...exclusions].sort((a, b) => textOrder(canonicalExclusionKey(a), canonicalExclusionKey(b)))) || new Set(exclusions.map(canonicalExclusionKey)).size !== exclusions.length) issues.push({ code: "invalid-order", path: "artifact.exclusions", message: "Exclusions must be unique and in canonical order." });
    if (isRecord(value.provenance)) {
      const body = semanticBody(value.provenance as unknown as ForecastArtifactProvenanceV1, targets, metrics, exclusions);
      const expectedSemantic = historicalAnalysisFingerprint(body);
      const expectedRunKey = isRecord(value.runIdentity) ? historicalAnalysisFingerprint(runKeyBody(value.runIdentity as unknown as ForecastArtifactRunIdentityV1)) : "";
      const withoutId = { artifactVersion: value.artifactVersion, mode: value.mode, generatedAt: value.generatedAt, runIdentity: value.runIdentity, runKey: value.runKey, semanticFingerprint: value.semanticFingerprint, provenance: value.provenance, targets, metrics, exclusions } as unknown as Omit<ForecastArtifactV1, "artifactId">;
      if (value.semanticFingerprint !== expectedSemantic || value.runKey !== expectedRunKey || value.artifactId !== historicalAnalysisFingerprint(artifactIdentity(withoutId)) || !isSha(value.semanticFingerprint) || !isSha(value.runKey) || !isSha(value.artifactId)) issues.push({ code: "invalid-fingerprint", path: "artifact", message: "Run, semantic, or full content fingerprint is invalid." });
    }
    const serialized = stableSerializeHistoricalAnalysis(value);
    if (byteLength(serialized) > FORECAST_ARTIFACT_MAX_BYTES) issues.push({ code: "size-limit", path: "artifact", message: "Artifact exceeds 1 MiB canonical JSON." });
    return issues;
  } catch { return [{ code: "invalid-input", path: "artifact", message: "Artifact could not be validated safely." }]; }
}

export function buildForecastArtifact(draft: ForecastArtifactDraftV1): ForecastArtifactV1 {
  const provenance = canonicalizeProvenance(draft.provenance);
  const runIdentity = { ...draft.runIdentity };
  const targets = draft.targets.map(canonicalizeTarget).sort((a, b) => textOrder(canonicalTargetKey(a), canonicalTargetKey(b)));
  const metrics = [...draft.metrics].sort((a, b) => textOrder(canonicalMetricKey(a), canonicalMetricKey(b)));
  const exclusions = draft.exclusions.map(canonicalizeExclusion).sort((a, b) => textOrder(canonicalExclusionKey(a), canonicalExclusionKey(b)));
  const semantic = semanticBody(provenance, targets, metrics, exclusions);
  const runKey = historicalAnalysisFingerprint(runKeyBody(runIdentity));
  const semanticFingerprint = historicalAnalysisFingerprint(semantic);
  const withoutId: Omit<ForecastArtifactV1, "artifactId"> = { artifactVersion: FORECAST_ARTIFACT_VERSION, mode: FORECAST_ARTIFACT_MODE, generatedAt: draft.generatedAt, runIdentity, runKey, semanticFingerprint, provenance, targets, metrics, exclusions };
  const artifact = { ...withoutId, artifactId: historicalAnalysisFingerprint(artifactIdentity(withoutId)) };
  const issues = validateForecastArtifact(artifact);
  if (issues.length) throw new ForecastContractError(issues);
  return artifact;
}

export function serializeForecastArtifact(value: ForecastArtifactV1): string { const issues = validateForecastArtifact(value); if (issues.length) throw new ForecastContractError(issues); return stableSerializeHistoricalAnalysis(value); }
export function parseForecastArtifact(bytes: Uint8Array): ForecastArtifactV1 { try { const text = decoder.decode(bytes); const value = JSON.parse(text) as unknown; const issues = validateForecastArtifact(value); if (issues.length) throw new ForecastContractError(issues); if (stableSerializeHistoricalAnalysis(value) !== text) throw new ForecastContractError([{ code: "invalid-order", path: "artifact", message: "Stored artifact bytes are not canonical JSON." }]); return value as ForecastArtifactV1; } catch (error) { if (error instanceof ForecastContractError) throw error; throw new ForecastContractError([{ code: "invalid-input", path: "artifact", message: "Stored artifact is not valid canonical UTF-8 JSON." }]); } }
export function forecastArtifactPath(artifactId: string): string { if (!isSha(artifactId)) throw new ForecastContractError([{ code: "invalid-fingerprint", path: "artifactId", message: "Artifact path requires an exact SHA-256 digest." }]); return `forecast/artifacts/${artifactId}.json`; }
export function reconciliationRootArtifactPath(artifactId: string): string { if (!isSha(artifactId)) throw new ForecastContractError([{ code: "invalid-fingerprint", path: "reconciliationRootArtifactId", message: "Reconciliation path requires an exact SHA-256 digest." }]); return `forecast/reconciliation/${artifactId}.json`; }

function pointerWithoutFingerprint(value: Omit<ForecastPointerV1, "pointerFingerprint">) { return value; }
function pointerCore(value: ForecastPointerV1): Omit<ForecastPointerV1, "pointerFingerprint"> { return { pointerVersion: value.pointerVersion, compatibleArtifactVersion: value.compatibleArtifactVersion, mode: value.mode, generation: value.generation, previousPointerFingerprint: value.previousPointerFingerprint, transition: value.transition, updatedAt: value.updatedAt, candidateArtifactId: value.candidateArtifactId, activeArtifactId: value.activeArtifactId, rollbackArtifactId: value.rollbackArtifactId, reconciliationRootArtifactId: value.reconciliationRootArtifactId, publicReadEnabled: value.publicReadEnabled }; }
function makePointer(core: Omit<ForecastPointerV1, "pointerFingerprint">): ForecastPointerV1 { const pointer = { ...core, pointerFingerprint: historicalAnalysisFingerprint(pointerWithoutFingerprint(core)) }; const issues = validateForecastPointer(pointer); if (issues.length) throw new ForecastContractError(issues); return pointer; }
function basePointer(transition: ForecastPointerTransition, generation: number, previousPointerFingerprint: string | null, updatedAt: string, ids: Pick<ForecastPointerV1, "candidateArtifactId" | "activeArtifactId" | "rollbackArtifactId" | "reconciliationRootArtifactId">): Omit<ForecastPointerV1, "pointerFingerprint"> { return { pointerVersion: FORECAST_POINTER_VERSION, compatibleArtifactVersion: FORECAST_ARTIFACT_VERSION, mode: FORECAST_ARTIFACT_MODE, generation, previousPointerFingerprint, transition, updatedAt, ...ids, publicReadEnabled: false }; }
function nextPointerGeneration(previous: ForecastPointerV1): number { if (!Number.isSafeInteger(previous.generation) || previous.generation < 1 || previous.generation >= Number.MAX_SAFE_INTEGER) throw new ForecastContractError([{ code: "invalid-transition", path: "pointer.generation", message: "Pointer generation is invalid or exhausted." }]); return previous.generation + 1; }

export function initializeForecastPointer(updatedAt: string): ForecastPointerV1 { return makePointer(basePointer("initialize", 1, null, updatedAt, { candidateArtifactId: null, activeArtifactId: null, rollbackArtifactId: null, reconciliationRootArtifactId: null })); }
export function forecastPointerWithCandidate(previous: ForecastPointerV1, candidateArtifactId: string, updatedAt: string): ForecastPointerV1 { return makePointer(basePointer("candidate-written", nextPointerGeneration(previous), previous.pointerFingerprint, updatedAt, { candidateArtifactId, activeArtifactId: previous.activeArtifactId, rollbackArtifactId: previous.rollbackArtifactId, reconciliationRootArtifactId: previous.reconciliationRootArtifactId })); }
export function activateForecastPointer(previous: ForecastPointerV1, updatedAt: string): ForecastPointerV1 { if (!previous.candidateArtifactId) throw new ForecastContractError([{ code: "invalid-transition", path: "pointer", message: "Activation requires a candidate artifact." }]); return makePointer(basePointer("activate-shadow", nextPointerGeneration(previous), previous.pointerFingerprint, updatedAt, { candidateArtifactId: null, activeArtifactId: previous.candidateArtifactId, rollbackArtifactId: previous.activeArtifactId, reconciliationRootArtifactId: previous.reconciliationRootArtifactId })); }
export function rollbackForecastPointer(previous: ForecastPointerV1, updatedAt: string): ForecastPointerV1 { if (!previous.rollbackArtifactId) throw new ForecastContractError([{ code: "invalid-transition", path: "pointer", message: "Rollback requires a prior active artifact." }]); return makePointer(basePointer("rollback-shadow", nextPointerGeneration(previous), previous.pointerFingerprint, updatedAt, { candidateArtifactId: previous.candidateArtifactId, activeArtifactId: previous.rollbackArtifactId, rollbackArtifactId: previous.activeArtifactId, reconciliationRootArtifactId: previous.reconciliationRootArtifactId })); }
export function commitReconciliationRoot(previous: ForecastPointerV1, reconciliationRootArtifactId: string | null, updatedAt: string): ForecastPointerV1 { if (reconciliationRootArtifactId === previous.reconciliationRootArtifactId) throw new ForecastContractError([{ code: "invalid-transition", path: "pointer.reconciliationRootArtifactId", message: "Reconciliation commit must change the root." }]); return makePointer(basePointer("reconciliation-committed", nextPointerGeneration(previous), previous.pointerFingerprint, updatedAt, { candidateArtifactId: previous.candidateArtifactId, activeArtifactId: previous.activeArtifactId, rollbackArtifactId: previous.rollbackArtifactId, reconciliationRootArtifactId })); }

export function validateForecastPointer(value: unknown): ForecastContractValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "pointer", message: "Pointer must be an object." }];
    const issues: ForecastContractValidationIssue[] = [];
    exactKeys(value, ["pointerVersion", "compatibleArtifactVersion", "mode", "generation", "previousPointerFingerprint", "pointerFingerprint", "transition", "updatedAt", "candidateArtifactId", "activeArtifactId", "rollbackArtifactId", "reconciliationRootArtifactId", "publicReadEnabled"], "pointer", issues);
    if (value.pointerVersion !== FORECAST_POINTER_VERSION || value.compatibleArtifactVersion !== FORECAST_ARTIFACT_VERSION) issues.push({ code: "unsupported-version", path: "pointer", message: "Pointer and compatible artifact versions must be exact v1." });
    if (value.mode !== FORECAST_ARTIFACT_MODE || value.publicReadEnabled !== false) issues.push({ code: "public-mode", path: "pointer", message: "v1 pointers are private shadow only." });
    if (!Number.isSafeInteger(value.generation) || (value.generation as number) < 1 || !TRANSITIONS.has(value.transition as ForecastPointerTransition) || !isInstant(value.updatedAt)) issues.push({ code: "invalid-row", path: "pointer", message: "A positive safe-integer generation, known transition, and canonical update instant are required." });
    if (!(value.previousPointerFingerprint === null || isSha(value.previousPointerFingerprint))) issues.push({ code: "invalid-fingerprint", path: "pointer.previousPointerFingerprint", message: "Previous pointer fingerprint must be SHA-256 or null." });
    for (const field of ["candidateArtifactId", "activeArtifactId", "rollbackArtifactId", "reconciliationRootArtifactId"] as const) if (!(value[field] === null || isSha(value[field]))) issues.push({ code: "invalid-fingerprint", path: `pointer.${field}`, message: "Artifact references must be digest IDs or null." });
    const forecastIds = [value.candidateArtifactId, value.activeArtifactId, value.rollbackArtifactId].filter((id): id is string => typeof id === "string");
    if (new Set(forecastIds).size !== forecastIds.length) issues.push({ code: "invalid-transition", path: "pointer", message: "Candidate, active, and rollback artifact IDs must be distinct." });
    if (value.transition === "initialize" && (value.generation !== 1 || value.previousPointerFingerprint !== null || value.candidateArtifactId !== null || value.activeArtifactId !== null || value.rollbackArtifactId !== null || value.reconciliationRootArtifactId !== null)) issues.push({ code: "invalid-transition", path: "pointer", message: "Initialization is generation one with all references and previous fingerprint null." });
    if (!isSha(value.pointerFingerprint) || value.pointerFingerprint !== historicalAnalysisFingerprint(pointerWithoutFingerprint(pointerCore(value as unknown as ForecastPointerV1)))) issues.push({ code: "invalid-fingerprint", path: "pointer.pointerFingerprint", message: "Pointer fingerprint does not bind the complete pointer state." });
    if (byteLength(stableSerializeHistoricalAnalysis(value)) > FORECAST_POINTER_MAX_BYTES) issues.push({ code: "size-limit", path: "pointer", message: "Pointer exceeds 16 KiB canonical JSON." });
    return issues;
  } catch { return [{ code: "invalid-input", path: "pointer", message: "Pointer could not be validated safely." }]; }
}

export function validateForecastPointerTransition(previous: ForecastPointerV1 | null, next: ForecastPointerV1): ForecastContractValidationIssue[] {
  const issues = [...(previous ? validateForecastPointer(previous) : []), ...validateForecastPointer(next)];
  if (issues.length) return issues;
  if (!previous) return next.transition === "initialize" ? [] : [{ code: "invalid-transition", path: "pointer.transition", message: "The first pointer transition must initialize." }];
  if (next.transition === "initialize" || next.generation !== previous.generation + 1 || next.previousPointerFingerprint !== previous.pointerFingerprint || next.updatedAt <= previous.updatedAt) return [{ code: "invalid-transition", path: "pointer", message: "Transition must advance one generation, bind the exact previous pointer, and advance time." }];
  const rootPreserved = next.reconciliationRootArtifactId === previous.reconciliationRootArtifactId;
  switch (next.transition) {
    case "candidate-written":
      if (!next.candidateArtifactId || next.candidateArtifactId === previous.candidateArtifactId || next.activeArtifactId !== previous.activeArtifactId || next.rollbackArtifactId !== previous.rollbackArtifactId || !rootPreserved) issues.push({ code: "invalid-transition", path: "pointer", message: "Candidate write may change only candidate plus transition metadata." });
      break;
    case "activate-shadow":
      if (!previous.candidateArtifactId || next.candidateArtifactId !== null || next.activeArtifactId !== previous.candidateArtifactId || next.rollbackArtifactId !== previous.activeArtifactId || !rootPreserved) issues.push({ code: "invalid-transition", path: "pointer", message: "Activation moves candidate to active and prior active to rollback." });
      break;
    case "rollback-shadow":
      if (!previous.rollbackArtifactId || next.candidateArtifactId !== previous.candidateArtifactId || next.activeArtifactId !== previous.rollbackArtifactId || next.rollbackArtifactId !== previous.activeArtifactId || !rootPreserved) issues.push({ code: "invalid-transition", path: "pointer", message: "Rollback swaps only active and rollback artifacts." });
      break;
    case "reconciliation-committed":
      if (next.reconciliationRootArtifactId === previous.reconciliationRootArtifactId || next.candidateArtifactId !== previous.candidateArtifactId || next.activeArtifactId !== previous.activeArtifactId || next.rollbackArtifactId !== previous.rollbackArtifactId || next.publicReadEnabled !== previous.publicReadEnabled) issues.push({ code: "invalid-transition", path: "pointer", message: "Reconciliation may change only its root plus transition metadata." });
      break;
  }
  return issues;
}

export function serializeForecastPointer(value: ForecastPointerV1): string { const issues = validateForecastPointer(value); if (issues.length) throw new ForecastContractError(issues); return stableSerializeHistoricalAnalysis(value); }
export function parseForecastPointer(bytes: Uint8Array): ForecastPointerV1 { try { const text = decoder.decode(bytes); const value = JSON.parse(text) as unknown; const issues = validateForecastPointer(value); if (issues.length) throw new ForecastContractError(issues); if (stableSerializeHistoricalAnalysis(value) !== text) throw new ForecastContractError([{ code: "invalid-order", path: "pointer", message: "Stored pointer bytes are not canonical JSON." }]); return value as ForecastPointerV1; } catch (error) { if (error instanceof ForecastContractError) throw error; throw new ForecastContractError([{ code: "invalid-input", path: "pointer", message: "Stored pointer is not valid canonical UTF-8 JSON." }]); } }

export type ImmutablePutResult = { status: "created" } | { status: "exists" };
export type AtomicCasResult = { status: "applied" | "mismatch"; atomic: true; observedPreviousFingerprint: string | null; observedPreviousGeneration: number };
export interface ForecastContractStorage {
  readonly atomicPointerCas: boolean;
  readExact(path: string): Promise<Uint8Array | null>;
  putImmutable(path: string, bytes: Uint8Array): Promise<ImmutablePutResult>;
  compareAndSwapPointer(path: typeof FORECAST_POINTER_PATH, expected: { fingerprint: string | null; generation: number }, nextBytes: Uint8Array): Promise<AtomicCasResult>;
}
export type ReconciliationRootValidator = (bytes: Uint8Array, expectedArtifactId: string) => boolean;
export type ForecastCommitResult = { committed: true; pointer: ForecastPointerV1 } | { committed: false; reason: "invalid" | "immutable-collision" | "missing-artifact" | "incompatible-artifact" | "non-atomic-adapter" | "stale-cas" | "storage-failure" };

function compatibleArtifact(left: ForecastArtifactV1, right: ForecastArtifactV1): boolean {
  return left.artifactVersion === right.artifactVersion && left.mode === right.mode && left.provenance.historicalDataset.version === right.provenance.historicalDataset.version && left.provenance.evaluation.version === right.provenance.evaluation.version && left.provenance.publicReleaseModel.version === right.provenance.publicReleaseModel.version && left.provenance.publicReleaseCalibration.version === right.provenance.publicReleaseCalibration.version && left.provenance.nextEventModel.version === right.provenance.nextEventModel.version && left.provenance.nextEventCalibration.version === right.provenance.nextEventCalibration.version;
}

async function loadArtifact(storage: ForecastContractStorage, artifactId: string): Promise<ForecastArtifactV1 | null> { const bytes = await storage.readExact(forecastArtifactPath(artifactId)); if (!bytes) return null; try { const artifact = parseForecastArtifact(bytes); return artifact.artifactId === artifactId ? artifact : null; } catch { return null; } }

/**
 * Write an immutable artifact first, validate every exact digest reference,
 * then attempt one generation+fingerprint CAS. The function never lists.
 */
export async function commitForecastArtifactTransition(args: { storage: ForecastContractStorage; previous: ForecastPointerV1 | null; next: ForecastPointerV1; artifact?: ForecastArtifactV1; validateReconciliationRoot?: ReconciliationRootValidator }): Promise<ForecastCommitResult> {
  try {
    if (!args.storage.atomicPointerCas) return { committed: false, reason: "non-atomic-adapter" };
    if (validateForecastPointerTransition(args.previous, args.next).length) return { committed: false, reason: "invalid" };
    if (args.artifact) {
      const artifactIssues = validateForecastArtifact(args.artifact);
      if (artifactIssues.length || args.next.transition !== "candidate-written" || args.next.candidateArtifactId !== args.artifact.artifactId) return { committed: false, reason: "invalid" };
      const bytes = encoder.encode(serializeForecastArtifact(args.artifact));
      const put = await args.storage.putImmutable(forecastArtifactPath(args.artifact.artifactId), bytes);
      if (put.status === "exists") {
        const existing = await args.storage.readExact(forecastArtifactPath(args.artifact.artifactId));
        if (!existing || existing.byteLength !== bytes.byteLength || !existing.every((byte, index) => byte === bytes[index])) return { committed: false, reason: "immutable-collision" };
      }
    }
    const ids = sortedUnique([args.next.candidateArtifactId, args.next.activeArtifactId, args.next.rollbackArtifactId].filter((id): id is string => id !== null));
    const artifacts: ForecastArtifactV1[] = [];
    for (const id of ids) { const artifact = await loadArtifact(args.storage, id); if (!artifact) return { committed: false, reason: "missing-artifact" }; artifacts.push(artifact); }
    for (let index = 1; index < artifacts.length; index += 1) if (!compatibleArtifact(artifacts[0]!, artifacts[index]!)) return { committed: false, reason: "incompatible-artifact" };
    if (args.next.reconciliationRootArtifactId) {
      const rootBytes = await args.storage.readExact(reconciliationRootArtifactPath(args.next.reconciliationRootArtifactId));
      if (!rootBytes || rawArtifactDigest(rootBytes) !== args.next.reconciliationRootArtifactId || !args.validateReconciliationRoot?.(rootBytes, args.next.reconciliationRootArtifactId)) return { committed: false, reason: "incompatible-artifact" };
    }
    const expected = { fingerprint: args.previous?.pointerFingerprint ?? null, generation: args.previous?.generation ?? 0 };
    const result = await args.storage.compareAndSwapPointer(FORECAST_POINTER_PATH, expected, encoder.encode(serializeForecastPointer(args.next)));
    if (result.atomic !== true || result.status !== "applied" || result.observedPreviousFingerprint !== expected.fingerprint || result.observedPreviousGeneration !== expected.generation) return { committed: false, reason: "stale-cas" };
    return { committed: true, pointer: args.next };
  } catch { return { committed: false, reason: "storage-failure" }; }
}

/** Exposed only for reconciliation-index validators that content-address raw canonical bytes. */
export function rawArtifactDigest(bytes: Uint8Array): string { return sha256Bytes(bytes); }
