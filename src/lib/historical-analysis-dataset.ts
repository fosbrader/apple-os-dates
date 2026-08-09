import { createHash } from "node:crypto";

import {
  FORECAST_ANALYSIS_CONTRACT_VERSION,
  canonicalForecastStage,
  eligibleForecastEvents,
  forecastEventEligibility,
  forecastIntervalOutcome,
  type CanonicalForecastStage,
  type ForecastAnalysisReleaseLifecycle,
  validateForecastAnalysisDataset,
} from "./forecast-analysis-contracts";
import {
  RELEASE_OBSERVATION_ADAPTER_VERSION,
  type CanonicalReleaseObservation,
  type ReleaseObservationAdapterResult,
  type ReleaseObservationExclusionCode,
  type ReleaseObservationLedgerEntry,
  type ReleasedOutcome,
} from "./release-observation-adapter";

/** A deterministic, storage-independent historical analysis product. */
export const HISTORICAL_ANALYSIS_DATASET_VERSION =
  "historical-analysis-dataset/v1";

export type HistoricalChronologyCoverageReason =
  | "not-reviewed"
  | "source-coverage-incomplete"
  | "same-day-order-unknown";

export const HISTORICAL_RELEASE_CLASSES = ["major", "minor", "patch"] as const;
export type HistoricalReleaseClass = (typeof HISTORICAL_RELEASE_CLASSES)[number];

/**
 * Coverage is an explicit editorial/source assertion. The builder can only
 * reduce it to unknown; it never upgrades unknown chronology from dates,
 * labels, array order, or stage identity.
 */
export type HistoricalChronologyCoverage =
  | {
      state: "complete";
      sourceEvidenceIds: readonly string[];
    }
  | {
      state: "unknown";
      reason: HistoricalChronologyCoverageReason;
      sourceEvidenceIds: readonly string[];
    };

/** Metadata is deliberately explicit: neither product family nor cycle is parsed. */
export interface HistoricalReleaseMetadataV1 {
  releaseId: string;
  /** Stable platform identity; never derived from a display version. */
  platformId: string;
  productFamilyId: string;
  /** Closed v1 cohort class; no display-version parsing is permitted. */
  releaseClass: HistoricalReleaseClass;
  /** Stable ordinal within the declared release cycle. */
  releasePosition: number;
  releaseCycleId: string;
  chronologyCoverage: HistoricalChronologyCoverage;
  /** Stable evidence IDs for the family/cycle and coverage assertions. */
  sourceEvidenceIds: readonly string[];
}

export interface HistoricalAnalysisDatasetInputV1 {
  adapterResult: ReleaseObservationAdapterResult;
  releaseMetadata: readonly HistoricalReleaseMetadataV1[];
}

export type HistoricalAnalysisLedgerReason =
  | ReleaseObservationExclusionCode
  | "missing-release-metadata"
  | "invalid-release-metadata"
  | "superseded-cycle";

export interface HistoricalAnalysisLedgerEntry {
  entryId: string;
  releaseId: string;
  scope: "adapter-observation" | "release-metadata" | "release-cycle";
  sourceEvidenceIds: readonly string[];
  included: boolean;
  reason?: HistoricalAnalysisLedgerReason;
}

export interface HistoricalReleaseCycleRow {
  rowType: "release-cycle";
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  releaseClass: HistoricalReleaseClass;
  releasePosition: number;
  releaseCycleId: string;
  lifecycle: ForecastAnalysisReleaseLifecycle;
  included: boolean;
  chronologyCoverage: HistoricalChronologyCoverage;
  sourceEvidenceIds: readonly string[];
}

export interface HistoricalCanonicalEventRow {
  rowType: "canonical-event";
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  releaseClass: HistoricalReleaseClass;
  releasePosition: number;
  releaseCycleId: string;
  eventId: string;
  stage: CanonicalForecastStage;
  channel: CanonicalReleaseObservation["channel"];
  sequence?: number;
  occurredOn: string;
  firstObservedOn: string;
  sameDayOrder?: number;
  sourceEvidenceIds: readonly string[];
}

export type HistoricalStageIntervalUnavailableReason =
  | "chronology-coverage-unknown"
  | "same-calendar-day"
  | "no-subsequent-stage-or-outcome";

export interface HistoricalStageIntervalRow {
  rowType: "stage-interval";
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  releaseClass: HistoricalReleaseClass;
  releasePosition: number;
  releaseCycleId: string;
  startEventId: string;
  startStage: CanonicalForecastStage;
  end:
    | {
        kind: "event";
        eventId: string;
        stage: CanonicalForecastStage;
        occurredOn: string;
        sourceEvidenceIds: readonly string[];
      }
    | {
        kind: "lifecycle-outcome";
        outcomeEvidenceId: string;
        occurredOn: string;
        sourceEvidenceIds: readonly string[];
      }
    | null;
  interval:
    | { available: true; days: number }
    | { available: false; reason: HistoricalStageIntervalUnavailableReason };
  sourceEvidenceIds: readonly string[];
}

export interface HistoricalLifecycleOutcomeRow {
  rowType: "lifecycle-outcome";
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  releaseClass: HistoricalReleaseClass;
  releasePosition: number;
  releaseCycleId: string;
  outcomeEvidenceId: string;
  closure: ReleasedOutcome["closure"];
  occurredOn: string;
  firstObservedOn: string;
  sourceEvidenceIds: readonly string[];
}

export interface HistoricalAnalysisProvenance {
  adapterVersion: typeof RELEASE_OBSERVATION_ADAPTER_VERSION;
  sourceContractVersion: typeof FORECAST_ANALYSIS_CONTRACT_VERSION;
  sourceAsOfDate: string;
  sourceIssuedAt: string;
}

export interface HistoricalAnalysisFingerprints {
  /** SHA-256 over the normalized analytical input, excluding presentation text. */
  inputFingerprint: string;
  /** SHA-256 over the versioned pure-builder dependency manifest. */
  codeFingerprint: string;
  /** SHA-256 over this dataset excluding the fingerprint object itself. */
  datasetFingerprint: string;
}

export interface HistoricalAnalysisDatasetV1 {
  datasetVersion: typeof HISTORICAL_ANALYSIS_DATASET_VERSION;
  provenance: HistoricalAnalysisProvenance;
  releaseCycles: readonly HistoricalReleaseCycleRow[];
  canonicalEvents: readonly HistoricalCanonicalEventRow[];
  stageIntervals: readonly HistoricalStageIntervalRow[];
  lifecycleOutcomes: readonly HistoricalLifecycleOutcomeRow[];
  inclusionLedger: readonly HistoricalAnalysisLedgerEntry[];
  fingerprints: HistoricalAnalysisFingerprints;
}

export type HistoricalAnalysisValidationCode =
  | "invalid-input"
  | "unsupported-dataset-version"
  | "unsupported-adapter-version"
  | "invalid-source-contract"
  | "invalid-adapter-result"
  | "invalid-release-metadata"
  | "duplicate-release-metadata"
  | "missing-release-metadata"
  | "invalid-chronology-coverage"
  | "invalid-source-evidence-id"
  | "missing-source-linkage"
  | "invalid-row"
  | "invalid-fingerprint";

export interface HistoricalAnalysisValidationIssue {
  code: HistoricalAnalysisValidationCode;
  path: string;
  message: string;
}

export class HistoricalAnalysisInputError extends Error {
  constructor(public readonly issues: readonly HistoricalAnalysisValidationIssue[]) {
    super(`Historical analysis input is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "HistoricalAnalysisInputError";
  }
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const SHA_256 = /^[a-f0-9]{64}$/;
const RELEASE_CLASS_SET = new Set<string>(HISTORICAL_RELEASE_CLASSES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDay(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DAY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

function isIsoInstant(value: unknown): value is string {
  return typeof value === "string" && ISO_INSTANT.test(value) && !Number.isNaN(new Date(value).getTime());
}

function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareText);
}

function validEvidenceIds(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.length > 0 && value.every((id) => typeof id === "string" && id.trim().length > 0);
}

/** Stable JSON with recursively sorted object keys. Arrays must be normalized by callers. */
export function stableSerializeHistoricalAnalysis(value: unknown): string {
  if (value === undefined) return "null";
  if (value === null || typeof value === "boolean" || typeof value === "number" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(stableSerializeHistoricalAnalysis).join(",")}]`;
  if (!isRecord(value)) throw new TypeError("Historical analysis serialization accepts JSON-compatible values only.");
  return `{${Object.keys(value).filter((key) => value[key] !== undefined).sort(compareText).map((key) => `${JSON.stringify(key)}:${stableSerializeHistoricalAnalysis(value[key])}`).join(",")}}`;
}

/** SHA-256 helper kept public so exported datasets can be verified without a builder run. */
export function historicalAnalysisFingerprint(value: unknown): string {
  return createHash("sha256").update(stableSerializeHistoricalAnalysis(value)).digest("hex");
}

const CODE_MANIFEST = {
  algorithm: "canonical-rows-v1;coverage-reduces-only;public-closure-deduplicated;sha256-stable-json",
  adapterVersion: RELEASE_OBSERVATION_ADAPTER_VERSION,
  datasetVersion: HISTORICAL_ANALYSIS_DATASET_VERSION,
  forecastAnalysisContractVersion: FORECAST_ANALYSIS_CONTRACT_VERSION,
} as const;

export const HISTORICAL_ANALYSIS_CODE_FINGERPRINT = historicalAnalysisFingerprint(CODE_MANIFEST);

function normalizedMetadata(metadata: readonly HistoricalReleaseMetadataV1[]) {
  return [...metadata]
    .map((entry) => ({
      ...entry,
      sourceEvidenceIds: uniqueSorted(entry.sourceEvidenceIds),
      chronologyCoverage: {
        ...entry.chronologyCoverage,
        sourceEvidenceIds: uniqueSorted(entry.chronologyCoverage.sourceEvidenceIds),
      },
    }))
    .sort((left, right) => compareText(left.releaseId, right.releaseId));
}

function normalizedAdapterForFingerprint(result: ReleaseObservationAdapterResult) {
  const event = (entry: CanonicalReleaseObservation) => ({
    evidenceId: entry.evidenceId,
    source: entry.source,
    sourceEvidenceIds: uniqueSorted(entry.sourceEvidenceIds),
    id: entry.id,
    releaseId: entry.releaseId,
    occurredOn: entry.occurredOn,
    firstObservedOn: entry.firstObservedOn,
    channel: entry.channel,
    ...(entry.sequence === undefined ? {} : { sequence: entry.sequence }),
    ...(entry.sameDayOrder === undefined ? {} : { sameDayOrder: entry.sameDayOrder }),
    availability: entry.availability,
    isRevision: entry.isRevision,
    stage: entry.stage,
  });
  const datasetEvent = (entry: ReleaseObservationAdapterResult["dataset"]["events"][number]) => ({
    id: entry.id, releaseId: entry.releaseId, occurredOn: entry.occurredOn,
    firstObservedOn: entry.firstObservedOn, channel: entry.channel,
    ...(entry.sequence === undefined ? {} : { sequence: entry.sequence }),
    ...(entry.sameDayOrder === undefined ? {} : { sameDayOrder: entry.sameDayOrder }),
    availability: entry.availability, isRevision: entry.isRevision,
    ...(entry.revisionOfId === undefined ? {} : { revisionOfId: entry.revisionOfId }),
  });
  return {
    adapterVersion: result.adapterVersion,
    asOfDate: result.asOfDate,
    issuedAt: result.issuedAt,
    dataset: {
      contractVersion: result.dataset.contractVersion,
      dataCutoff: result.dataset.dataCutoff,
      releases: [...result.dataset.releases].map((entry) => ({ ...entry })).sort((left, right) => compareText(left.id, right.id)),
      events: [...result.dataset.events].map(datasetEvent).sort((left, right) => compareText(left.releaseId, right.releaseId) || compareText(left.occurredOn, right.occurredOn) || compareText(left.id, right.id)),
    },
    effectiveEvents: [...result.effectiveEvents].map(event).sort((left, right) => compareText(left.releaseId, right.releaseId) || compareText(left.occurredOn, right.occurredOn) || compareText(left.evidenceId, right.evidenceId)),
    releasedOutcomes: [...result.releasedOutcomes].map((entry) => ({ ...entry })).sort((left, right) => compareText(left.releaseId, right.releaseId) || compareText(left.occurredOn, right.occurredOn) || compareText(left.evidenceId, right.evidenceId)),
    inclusionLedger: [...result.inclusionLedger].map((entry) => ({ ...entry })).sort((left, right) => compareText(left.releaseId, right.releaseId) || compareText(left.occurredOn ?? "", right.occurredOn ?? "") || compareText(left.evidenceId, right.evidenceId)),
    exclusions: [...result.exclusions].map((entry) => ({ ...entry })).sort((left, right) => compareText(left.releaseId, right.releaseId) || compareText(left.evidenceId, right.evidenceId)),
  };
}

function adapterIssues(result: unknown): HistoricalAnalysisValidationIssue[] {
  const issues: HistoricalAnalysisValidationIssue[] = [];
  if (!isRecord(result)) return [{ code: "invalid-adapter-result", path: "adapterResult", message: "adapterResult must be an object." }];
  if (result.adapterVersion !== RELEASE_OBSERVATION_ADAPTER_VERSION) issues.push({ code: "unsupported-adapter-version", path: "adapterResult.adapterVersion", message: `Expected ${RELEASE_OBSERVATION_ADAPTER_VERSION}.` });
  if (!isRecord(result.dataset)) {
    issues.push({ code: "invalid-source-contract", path: "adapterResult.dataset", message: "A canonical forecast dataset is required." });
    return issues;
  }
  const forecastDataset = result.dataset as unknown as ReleaseObservationAdapterResult["dataset"];
  let datasetIssues;
  try {
    datasetIssues = validateForecastAnalysisDataset(forecastDataset);
  } catch {
    issues.push({ code: "invalid-source-contract", path: "adapterResult.dataset", message: "Canonical forecast dataset is malformed." });
    return issues;
  }
  for (const issue of datasetIssues) issues.push({ code: "invalid-source-contract", path: `adapterResult.dataset.${issue.path}`, message: issue.message });
  if (datasetIssues.length) return issues;
  if (result.asOfDate !== result.dataset.dataCutoff || !isIsoDay(result.asOfDate)) issues.push({ code: "invalid-adapter-result", path: "adapterResult.asOfDate", message: "asOfDate must match the validated dataset cutoff." });
  if (!isIsoInstant(result.issuedAt)) issues.push({ code: "invalid-adapter-result", path: "adapterResult.issuedAt", message: "issuedAt must be an ISO instant." });
  if (!Array.isArray(result.effectiveEvents) || !Array.isArray(result.releasedOutcomes) || !Array.isArray(result.inclusionLedger) || !Array.isArray(result.exclusions)) {
    issues.push({ code: "invalid-adapter-result", path: "adapterResult", message: "Adapter result arrays are required." });
    return issues;
  }
  const expected = eligibleForecastEvents(forecastDataset);
  const actual = result.effectiveEvents as CanonicalReleaseObservation[];
  const expectedKeys = new Set(expected.map((entry) => `${entry.id}\u0000${entry.stage}`));
  const actualKeys = actual.map((entry) => `${entry?.id}\u0000${entry?.stage}`);
  if (actual.length !== expected.length || new Set(actualKeys).size !== actualKeys.length || actualKeys.some((key) => !expectedKeys.has(key))) {
    issues.push({ code: "invalid-adapter-result", path: "adapterResult.effectiveEvents", message: "effectiveEvents must exactly be the eligible canonical dataset events." });
  }
  for (const [index, entry] of actual.entries()) {
    if (!isRecord(entry)) {
      issues.push({ code: "invalid-adapter-result", path: `adapterResult.effectiveEvents[${index}]`, message: "Effective event must be an object." });
      continue;
    }
    const expectedEntry = expected.find((candidate) => candidate.id === entry.id && canonicalForecastStage(entry as CanonicalReleaseObservation) === candidate.stage);
    const analyticFields = ["id", "releaseId", "occurredOn", "firstObservedOn", "channel", "sequence", "sameDayOrder", "availability", "isRevision", "revisionOfId"] as const;
    if (!expectedEntry || analyticFields.some((field) => entry[field] !== expectedEntry[field])) issues.push({ code: "invalid-adapter-result", path: `adapterResult.effectiveEvents[${index}]`, message: "Effective event differs from its canonical analytic fields." });
    if (!validEvidenceIds(entry.sourceEvidenceIds) || !entry.sourceEvidenceIds.includes(entry.evidenceId)) issues.push({ code: "missing-source-linkage", path: `adapterResult.effectiveEvents[${index}].sourceEvidenceIds`, message: "Every effective event must retain its evidence ID." });
    const eligibility = forecastEventEligibility(entry, forecastDataset.dataCutoff, forecastDataset.releases.find((release) => release.id === entry.releaseId));
    if (!eligibility.eligible || eligibility.stage !== entry.stage) issues.push({ code: "invalid-adapter-result", path: `adapterResult.effectiveEvents[${index}]`, message: "Effective event is not eligible at the adapter cutoff." });
  }
  const outcomeIds = new Set<string>();
  const outcomeReleaseIds = new Set<string>();
  for (const [index, outcome] of (result.releasedOutcomes as ReleasedOutcome[]).entries()) {
    if (!isRecord(outcome)) {
      issues.push({ code: "invalid-adapter-result", path: `adapterResult.releasedOutcomes[${index}]`, message: "Lifecycle outcome must be an object." });
      continue;
    }
    const release = forecastDataset.releases.find((entry) => entry.id === outcome.releaseId);
    const ledger = (result.inclusionLedger as ReleaseObservationLedgerEntry[]).find((entry) => isRecord(entry) && entry.evidenceId === outcome.evidenceId && entry.included === true);
    const publicOutcomeMatches = outcome.closure !== "public-release" || (release?.lifecycle === "released" && release.statusEffectiveOn === outcome.occurredOn);
    const gmOutcomeMatches = outcome.closure !== "golden-master" || actual.some((event) => isRecord(event) && event.releaseId === outcome.releaseId && event.stage === "golden-master" && event.occurredOn === outcome.occurredOn);
    if (!isNonEmptyText(outcome.evidenceId) || !release || !["public-release", "golden-master"].includes(outcome.closure) || !isIsoDay(outcome.occurredOn) || !isIsoDay(outcome.firstObservedOn) || outcome.firstObservedOn < outcome.occurredOn || outcome.occurredOn > forecastDataset.dataCutoff || outcome.firstObservedOn > forecastDataset.dataCutoff || !ledger || ledger.releaseId !== outcome.releaseId || ledger.occurredOn !== outcome.occurredOn || !publicOutcomeMatches || !gmOutcomeMatches || outcomeIds.has(outcome.evidenceId) || outcomeReleaseIds.has(outcome.releaseId)) issues.push({ code: "invalid-adapter-result", path: `adapterResult.releasedOutcomes[${index}]`, message: "Lifecycle outcome must be unique, release-consistent, ledger-linked, and point-in-time valid." });
    outcomeIds.add(outcome.evidenceId);
    outcomeReleaseIds.add(outcome.releaseId);
  }
  const expectedOutcomeLedger = (result.inclusionLedger as ReleaseObservationLedgerEntry[])
    .filter(
      (entry): entry is ReleaseObservationLedgerEntry =>
        isRecord(entry) &&
        entry.source === "release" &&
        entry.evidenceId === `release:${entry.releaseId}:outcome`,
    );
  const expectedOutcomeByRelease = new Map<string, ReleaseObservationLedgerEntry>();
  for (const entry of expectedOutcomeLedger) {
    if (expectedOutcomeByRelease.has(entry.releaseId)) {
      issues.push({ code: "invalid-adapter-result", path: "adapterResult.inclusionLedger", message: `Release outcome ledger is duplicated for ${entry.releaseId}.` });
    }
    expectedOutcomeByRelease.set(entry.releaseId, entry);
  }
  for (const release of forecastDataset.releases) {
    const expectedLedger = expectedOutcomeByRelease.get(release.id);
    const actualOutcome = (result.releasedOutcomes as ReleasedOutcome[]).find(
      (outcome) => isRecord(outcome) && outcome.releaseId === release.id,
    );
    if (!expectedLedger || expectedLedger.included !== Boolean(actualOutcome)) {
      issues.push({ code: "invalid-adapter-result", path: "adapterResult.releasedOutcomes", message: `Release outcome is incomplete for ${release.id}.` });
      continue;
    }
    if (actualOutcome && (actualOutcome.evidenceId !== expectedLedger.evidenceId || actualOutcome.occurredOn !== expectedLedger.occurredOn)) {
      issues.push({ code: "invalid-adapter-result", path: "adapterResult.releasedOutcomes", message: `Release outcome does not match its included ledger entry for ${release.id}.` });
    }
    if (release.lifecycle === "released") {
      if (!actualOutcome || actualOutcome.closure !== "public-release" || actualOutcome.occurredOn !== release.statusEffectiveOn || actualOutcome.firstObservedOn !== release.statusFirstObservedOn) {
        issues.push({ code: "invalid-adapter-result", path: "adapterResult.releasedOutcomes", message: `Released cycle ${release.id} requires its canonical public-release outcome.` });
      }
    }
  }
  if (expectedOutcomeLedger.length !== forecastDataset.releases.length) {
    issues.push({ code: "invalid-adapter-result", path: "adapterResult.inclusionLedger", message: "Every canonical release requires exactly one outcome ledger entry." });
  }
  return issues;
}

/** Validate build input before deriving rows; malformed or stale contracts never partially build. */
export function validateHistoricalAnalysisInput(input: unknown): HistoricalAnalysisValidationIssue[] {
  if (!isRecord(input)) return [{ code: "invalid-input", path: "input", message: "Input must be an object." }];
  const issues = adapterIssues(input.adapterResult);
  if (!Array.isArray(input.releaseMetadata)) return [...issues, { code: "invalid-release-metadata", path: "releaseMetadata", message: "releaseMetadata must be an array." }];
  const metadata = input.releaseMetadata as HistoricalReleaseMetadataV1[];
  const seen = new Set<string>();
  const adapterReleaseIds = new Set(isRecord(input.adapterResult) && isRecord(input.adapterResult.dataset) && Array.isArray(input.adapterResult.dataset.releases) ? input.adapterResult.dataset.releases.map((release) => isRecord(release) ? release.id : "") : []);
  for (const [index, entry] of metadata.entries()) {
    const path = `releaseMetadata[${index}]`;
    if (!isRecord(entry)) {
      issues.push({ code: "invalid-release-metadata", path, message: "Metadata must be an object." });
      continue;
    }
    const typedEntry = entry as HistoricalReleaseMetadataV1;
    if (!isNonEmptyText(typedEntry.releaseId) || !isNonEmptyText(typedEntry.platformId) || !isNonEmptyText(typedEntry.productFamilyId) || !RELEASE_CLASS_SET.has(typedEntry.releaseClass) || !Number.isSafeInteger(typedEntry.releasePosition) || typedEntry.releasePosition < 1 || !isNonEmptyText(typedEntry.releaseCycleId) || !validEvidenceIds(typedEntry.sourceEvidenceIds)) issues.push({ code: "invalid-release-metadata", path, message: "Metadata requires stable release, platform, family, closed class, position, cycle, and evidence identities." });
    if (seen.has(typedEntry.releaseId)) issues.push({ code: "duplicate-release-metadata", path: `${path}.releaseId`, message: `Release metadata is duplicated for ${typedEntry.releaseId}.` });
    seen.add(typedEntry.releaseId);
    const coverage = typedEntry.chronologyCoverage;
    if (!coverage || (coverage.state !== "complete" && coverage.state !== "unknown") || !validEvidenceIds(coverage?.sourceEvidenceIds) || (coverage.state === "unknown" && !["not-reviewed", "source-coverage-incomplete", "same-day-order-unknown"].includes(coverage.reason))) issues.push({ code: "invalid-chronology-coverage", path: `${path}.chronologyCoverage`, message: "Coverage must be a sourced complete or explicit unknown state." });
  }
  for (const releaseId of adapterReleaseIds) if (typeof releaseId === "string" && releaseId && !seen.has(releaseId)) issues.push({ code: "missing-release-metadata", path: "releaseMetadata", message: `No explicit metadata exists for ${releaseId}.` });
  for (const releaseId of seen) if (!adapterReleaseIds.has(releaseId)) issues.push({ code: "invalid-release-metadata", path: "releaseMetadata", message: `Metadata has no adapter release for ${releaseId}.` });
  return issues;
}

function isClosureDuplicate(outcome: ReleasedOutcome, events: readonly CanonicalReleaseObservation[]): boolean {
  return events.some((event) => event.occurredOn === outcome.occurredOn && ((outcome.closure === "public-release" && event.stage === "public-release") || (outcome.closure === "golden-master" && event.stage === "golden-master")));
}

function coverageForRelease(metadata: HistoricalReleaseMetadataV1, events: readonly CanonicalReleaseObservation[], outcomes: readonly ReleasedOutcome[]): HistoricalChronologyCoverage {
  if (metadata.chronologyCoverage.state === "unknown") return { ...metadata.chronologyCoverage, sourceEvidenceIds: uniqueSorted(metadata.chronologyCoverage.sourceEvidenceIds) };
  const entries = [...events.map((event) => ({ occurredOn: event.occurredOn, order: event.sameDayOrder, evidenceIds: event.sourceEvidenceIds })), ...outcomes.filter((outcome) => !isClosureDuplicate(outcome, events)).map((outcome) => ({ occurredOn: outcome.occurredOn, order: undefined, evidenceIds: [outcome.evidenceId] }))];
  const sameDay = new Map<string, typeof entries>();
  for (const entry of entries) sameDay.set(entry.occurredOn, [...(sameDay.get(entry.occurredOn) ?? []), entry]);
  for (const dayEntries of sameDay.values()) {
    if (dayEntries.length > 1 && (dayEntries.some((entry) => !Number.isInteger(entry.order) || (entry.order ?? 0) <= 0) || new Set(dayEntries.map((entry) => entry.order)).size !== dayEntries.length)) return { state: "unknown", reason: "same-day-order-unknown", sourceEvidenceIds: uniqueSorted([...metadata.chronologyCoverage.sourceEvidenceIds, ...dayEntries.flatMap((entry) => entry.evidenceIds)]) };
  }
  return { state: "complete", sourceEvidenceIds: uniqueSorted(metadata.chronologyCoverage.sourceEvidenceIds) };
}

function ledgerRows(entries: readonly ReleaseObservationLedgerEntry[]): HistoricalAnalysisLedgerEntry[] {
  return entries.map((entry) => ({ entryId: `adapter:${entry.evidenceId}`, releaseId: entry.releaseId, scope: "adapter-observation" as const, sourceEvidenceIds: [entry.evidenceId], included: entry.included, ...(entry.reason ? { reason: entry.reason } : {}) }));
}

function endpointForEvent(event: HistoricalCanonicalEventRow): Exclude<HistoricalStageIntervalRow["end"], null> {
  return { kind: "event", eventId: event.eventId, stage: event.stage, occurredOn: event.occurredOn, sourceEvidenceIds: event.sourceEvidenceIds };
}

/**
 * Build v1 from an adapter result and explicitly sourced cycle metadata.
 * This is pure: no persistence, UI, network, clock, or display-label parsing.
 */
export function buildHistoricalAnalysisDataset(input: HistoricalAnalysisDatasetInputV1): HistoricalAnalysisDatasetV1 {
  const inputIssues = validateHistoricalAnalysisInput(input);
  if (inputIssues.length) throw new HistoricalAnalysisInputError(inputIssues);
  const adapter = input.adapterResult;
  const metadataByRelease = new Map(normalizedMetadata(input.releaseMetadata).map((entry) => [entry.releaseId, entry]));
  const releaseCycles: HistoricalReleaseCycleRow[] = [];
  const canonicalEvents: HistoricalCanonicalEventRow[] = [];
  const lifecycleOutcomes: HistoricalLifecycleOutcomeRow[] = [];
  const stageIntervals: HistoricalStageIntervalRow[] = [];
  const inclusionLedger = ledgerRows(adapter.inclusionLedger);

  for (const release of [...adapter.dataset.releases].sort((left, right) => compareText(left.id, right.id))) {
    const metadata = metadataByRelease.get(release.id)!;
    const cycleEvents = adapter.effectiveEvents.filter((event) => event.releaseId === release.id).sort((left, right) => compareText(left.occurredOn, right.occurredOn) || compareText(left.evidenceId, right.evidenceId));
    const cycleOutcomes = adapter.releasedOutcomes.filter((outcome) => outcome.releaseId === release.id).sort((left, right) => compareText(left.occurredOn, right.occurredOn) || compareText(left.evidenceId, right.evidenceId));
    const included = release.lifecycle !== "superseded";
    const coverage = coverageForRelease(metadata, cycleEvents, cycleOutcomes);
    const sourceEvidenceIds = uniqueSorted([...metadata.sourceEvidenceIds, ...coverage.sourceEvidenceIds, ...cycleEvents.flatMap((event) => event.sourceEvidenceIds), ...cycleOutcomes.map((outcome) => outcome.evidenceId)]);
    releaseCycles.push({ rowType: "release-cycle", releaseId: release.id, platformId: metadata.platformId, productFamilyId: metadata.productFamilyId, releaseClass: metadata.releaseClass, releasePosition: metadata.releasePosition, releaseCycleId: metadata.releaseCycleId, lifecycle: release.lifecycle, included, chronologyCoverage: coverage, sourceEvidenceIds });
    inclusionLedger.push({ entryId: `metadata:${release.id}`, releaseId: release.id, scope: "release-metadata", sourceEvidenceIds: uniqueSorted([...metadata.sourceEvidenceIds, ...metadata.chronologyCoverage.sourceEvidenceIds]), included: true });
    if (!included) {
      inclusionLedger.push({ entryId: `cycle:${release.id}`, releaseId: release.id, scope: "release-cycle", sourceEvidenceIds, included: false, reason: "superseded-cycle" });
      continue;
    }
    const cycleRows = cycleEvents.map((event): HistoricalCanonicalEventRow => ({ rowType: "canonical-event", releaseId: release.id, platformId: metadata.platformId, productFamilyId: metadata.productFamilyId, releaseClass: metadata.releaseClass, releasePosition: metadata.releasePosition, releaseCycleId: metadata.releaseCycleId, eventId: event.id, stage: event.stage, channel: event.channel, ...(event.sequence === undefined ? {} : { sequence: event.sequence }), occurredOn: event.occurredOn, firstObservedOn: event.firstObservedOn, ...(event.sameDayOrder === undefined ? {} : { sameDayOrder: event.sameDayOrder }), sourceEvidenceIds: uniqueSorted(event.sourceEvidenceIds) }));
    canonicalEvents.push(...cycleRows);
    lifecycleOutcomes.push(...cycleOutcomes.map((outcome) => ({ rowType: "lifecycle-outcome" as const, releaseId: release.id, platformId: metadata.platformId, productFamilyId: metadata.productFamilyId, releaseClass: metadata.releaseClass, releasePosition: metadata.releasePosition, releaseCycleId: metadata.releaseCycleId, outcomeEvidenceId: outcome.evidenceId, closure: outcome.closure, occurredOn: outcome.occurredOn, firstObservedOn: outcome.firstObservedOn, sourceEvidenceIds: [outcome.evidenceId] })));
    if (coverage.state === "unknown") {
      stageIntervals.push(...cycleRows.map((event) => ({ rowType: "stage-interval" as const, releaseId: release.id, platformId: metadata.platformId, productFamilyId: metadata.productFamilyId, releaseClass: metadata.releaseClass, releasePosition: metadata.releasePosition, releaseCycleId: metadata.releaseCycleId, startEventId: event.eventId, startStage: event.stage, end: null, interval: { available: false as const, reason: "chronology-coverage-unknown" as const }, sourceEvidenceIds: uniqueSorted([...event.sourceEvidenceIds, ...coverage.sourceEvidenceIds]) })));
      continue;
    }
    const timeline = [
      ...cycleRows.map((event) => ({ kind: "event" as const, occurredOn: event.occurredOn, order: event.sameDayOrder!, event })),
      ...cycleOutcomes.filter((outcome) => !isClosureDuplicate(outcome, cycleEvents)).map((outcome) => ({ kind: "outcome" as const, occurredOn: outcome.occurredOn, order: Number.MAX_SAFE_INTEGER, outcome })),
    ].sort((left, right) => compareText(left.occurredOn, right.occurredOn) || left.order - right.order || compareText(left.kind === "event" ? left.event.eventId : left.outcome.evidenceId, right.kind === "event" ? right.event.eventId : right.outcome.evidenceId));
    for (const [index, entry] of timeline.entries()) {
      if (entry.kind !== "event") continue;
      const next = timeline[index + 1];
      if (!next) {
        stageIntervals.push({ rowType: "stage-interval", releaseId: release.id, platformId: metadata.platformId, productFamilyId: metadata.productFamilyId, releaseClass: metadata.releaseClass, releasePosition: metadata.releasePosition, releaseCycleId: metadata.releaseCycleId, startEventId: entry.event.eventId, startStage: entry.event.stage, end: null, interval: { available: false, reason: "no-subsequent-stage-or-outcome" }, sourceEvidenceIds: entry.event.sourceEvidenceIds });
        continue;
      }
      const end: Exclude<HistoricalStageIntervalRow["end"], null> = next.kind === "event" ? endpointForEvent(next.event) : { kind: "lifecycle-outcome" as const, outcomeEvidenceId: next.outcome.evidenceId, occurredOn: next.outcome.occurredOn, sourceEvidenceIds: [next.outcome.evidenceId] };
      const outcome = forecastIntervalOutcome({ releaseId: release.id, occurredOn: entry.event.occurredOn }, { releaseId: release.id, occurredOn: end.occurredOn });
      stageIntervals.push({ rowType: "stage-interval", releaseId: release.id, platformId: metadata.platformId, productFamilyId: metadata.productFamilyId, releaseClass: metadata.releaseClass, releasePosition: metadata.releasePosition, releaseCycleId: metadata.releaseCycleId, startEventId: entry.event.eventId, startStage: entry.event.stage, end, interval: outcome.available ? outcome : { available: false, reason: outcome.reason === "same-calendar-day" ? "same-calendar-day" : "no-subsequent-stage-or-outcome" }, sourceEvidenceIds: uniqueSorted([...entry.event.sourceEvidenceIds, ...end.sourceEvidenceIds]) });
    }
  }
  const sorted = <T>(rows: readonly T[], key: (row: T) => string): T[] => [...rows].sort((left, right) => compareText(key(left), key(right)));
  const core = {
    datasetVersion: HISTORICAL_ANALYSIS_DATASET_VERSION,
    provenance: { adapterVersion: RELEASE_OBSERVATION_ADAPTER_VERSION, sourceContractVersion: FORECAST_ANALYSIS_CONTRACT_VERSION, sourceAsOfDate: adapter.asOfDate, sourceIssuedAt: adapter.issuedAt },
    releaseCycles: sorted(releaseCycles, (row) => row.releaseId),
    canonicalEvents: sorted(canonicalEvents, (row) => `${row.releaseId}\u0000${row.occurredOn}\u0000${row.stage}\u0000${row.eventId}`),
    stageIntervals: sorted(stageIntervals, (row) => `${row.releaseId}\u0000${row.startEventId}`),
    lifecycleOutcomes: sorted(lifecycleOutcomes, (row) => `${row.releaseId}\u0000${row.occurredOn}\u0000${row.outcomeEvidenceId}`),
    inclusionLedger: sorted(inclusionLedger, (row) => `${row.releaseId}\u0000${row.entryId}`),
  } as const;
  const inputFingerprint = historicalAnalysisFingerprint({ adapterResult: normalizedAdapterForFingerprint(adapter), releaseMetadata: normalizedMetadata(input.releaseMetadata) });
  const codeFingerprint = HISTORICAL_ANALYSIS_CODE_FINGERPRINT;
  const fingerprints = {
    inputFingerprint,
    codeFingerprint,
    datasetFingerprint: historicalAnalysisFingerprint({ core, inputFingerprint, codeFingerprint }),
  };
  const output = { ...core, fingerprints };
  const outputIssues = validateHistoricalAnalysisDataset(output);
  if (outputIssues.length) throw new HistoricalAnalysisInputError(outputIssues);
  return output;
}

function sortedBy<T>(rows: readonly T[], key: (row: T) => string): boolean {
  try {
    return rows.every((row, index) => index === 0 || key(rows[index - 1]) <= key(row));
  } catch {
    return false;
  }
}

function validSortedEvidenceIds(value: unknown): value is readonly string[] {
  return validEvidenceIds(value) && value.every((id, index, all) => index === 0 || all[index - 1] < id);
}

function validCycleFields(row: unknown): row is Pick<HistoricalReleaseCycleRow, "releaseId" | "platformId" | "productFamilyId" | "releaseClass" | "releasePosition" | "releaseCycleId"> {
  return isRecord(row) && typeof row.releaseId === "string" && row.releaseId.trim().length > 0 && typeof row.platformId === "string" && row.platformId.trim().length > 0 && typeof row.productFamilyId === "string" && row.productFamilyId.trim().length > 0 && typeof row.releaseClass === "string" && RELEASE_CLASS_SET.has(row.releaseClass) && Number.isSafeInteger(row.releasePosition) && (row.releasePosition as number) > 0 && typeof row.releaseCycleId === "string" && row.releaseCycleId.trim().length > 0;
}

function sameCycleFields(row: Record<string, unknown>, cycle: HistoricalReleaseCycleRow): boolean {
  return row.platformId === cycle.platformId && row.productFamilyId === cycle.productFamilyId && row.releaseClass === cycle.releaseClass && row.releasePosition === cycle.releasePosition && row.releaseCycleId === cycle.releaseCycleId;
}

/** Strict runtime validation for serialized v1 output. */
export function validateHistoricalAnalysisDataset(dataset: unknown): HistoricalAnalysisValidationIssue[] {
  if (!isRecord(dataset)) return [{ code: "invalid-input", path: "dataset", message: "Dataset must be an object." }];
  const issues: HistoricalAnalysisValidationIssue[] = [];
  if (dataset.datasetVersion !== HISTORICAL_ANALYSIS_DATASET_VERSION) issues.push({ code: "unsupported-dataset-version", path: "datasetVersion", message: `Expected ${HISTORICAL_ANALYSIS_DATASET_VERSION}.` });
  if (!isRecord(dataset.provenance) || dataset.provenance.adapterVersion !== RELEASE_OBSERVATION_ADAPTER_VERSION || dataset.provenance.sourceContractVersion !== FORECAST_ANALYSIS_CONTRACT_VERSION || !isIsoDay(dataset.provenance.sourceAsOfDate) || !isIsoInstant(dataset.provenance.sourceIssuedAt)) issues.push({ code: "invalid-source-contract", path: "provenance", message: "Provenance must pin the current adapter, contract, cutoff, and ISO issuance instant." });
  const arrays = ["releaseCycles", "canonicalEvents", "stageIntervals", "lifecycleOutcomes", "inclusionLedger"] as const;
  for (const name of arrays) if (!Array.isArray(dataset[name])) issues.push({ code: "invalid-row", path: name, message: `${name} must be an array.` });
  if (issues.length) return issues;
  const cycles = dataset.releaseCycles as HistoricalReleaseCycleRow[];
  const cycleIds = new Set<string>();
  const cycleById = new Map<string, HistoricalReleaseCycleRow>();
  for (const [index, row] of cycles.entries()) {
    if (!isRecord(row)) {
      issues.push({ code: "invalid-row", path: `releaseCycles[${index}]`, message: "Release-cycle row must be an object." });
      continue;
    }
    if (!row || row.rowType !== "release-cycle" || !validCycleFields(row) || !["active", "released", "superseded"].includes(row.lifecycle) || row.included !== (row.lifecycle !== "superseded") || !validSortedEvidenceIds(row.sourceEvidenceIds)) issues.push({ code: "invalid-row", path: `releaseCycles[${index}]`, message: "Release-cycle row is malformed, unsourced, or has inconsistent lifecycle inclusion." });
    if (cycleIds.has(row.releaseId)) issues.push({ code: "invalid-row", path: `releaseCycles[${index}].releaseId`, message: "Release-cycle rows must be unique." });
    cycleIds.add(row.releaseId);
    cycleById.set(row.releaseId, row);
    const coverage = row.chronologyCoverage;
    if (!coverage || !validSortedEvidenceIds(coverage.sourceEvidenceIds) || (coverage.state !== "complete" && (coverage.state !== "unknown" || !["not-reviewed", "source-coverage-incomplete", "same-day-order-unknown"].includes(coverage.reason)))) issues.push({ code: "invalid-chronology-coverage", path: `releaseCycles[${index}].chronologyCoverage`, message: "Coverage must be explicit, sourced, and use a v1 reason." });
  }
  if (!sortedBy(cycles, (row) => row.releaseId)) issues.push({ code: "invalid-row", path: "releaseCycles", message: "Release-cycle rows are not in canonical order." });
  const events = dataset.canonicalEvents as HistoricalCanonicalEventRow[];
  const eventsById = new Map<string, HistoricalCanonicalEventRow>();
  for (const [index, row] of events.entries()) {
    if (!isRecord(row)) {
      issues.push({ code: "invalid-row", path: `canonicalEvents[${index}]`, message: "Canonical event must be an object." });
      continue;
    }
    const cycle = cycleById.get(row?.releaseId);
    const validStage = row && canonicalForecastStage(row) === row.stage;
    if (!row || row.rowType !== "canonical-event" || !cycle || !cycle.included || !sameCycleFields(row as unknown as Record<string, unknown>, cycle) || !isNonEmptyText(row.eventId) || !validStage || !isIsoDay(row.occurredOn) || !isIsoDay(row.firstObservedOn) || row.firstObservedOn < row.occurredOn || (row.sameDayOrder !== undefined && (!Number.isSafeInteger(row.sameDayOrder) || row.sameDayOrder < 1)) || !validSortedEvidenceIds(row.sourceEvidenceIds) || !row.sourceEvidenceIds.includes(row.eventId)) issues.push({ code: "invalid-row", path: `canonicalEvents[${index}]`, message: "Canonical event is malformed, excluded, or lacks its exact event evidence ID." });
    if (eventsById.has(row.eventId)) issues.push({ code: "invalid-row", path: `canonicalEvents[${index}].eventId`, message: "Canonical event IDs must be unique." });
    eventsById.set(row.eventId, row);
  }
  if (!sortedBy(events, (row) => `${row.releaseId}\u0000${row.occurredOn}\u0000${row.stage}\u0000${row.eventId}`)) issues.push({ code: "invalid-row", path: "canonicalEvents", message: "Canonical events are not in canonical order." });
  const outcomes = dataset.lifecycleOutcomes as HistoricalLifecycleOutcomeRow[];
  const outcomeById = new Map<string, HistoricalLifecycleOutcomeRow>();
  for (const [index, row] of outcomes.entries()) {
    if (!isRecord(row)) {
      issues.push({ code: "invalid-row", path: `lifecycleOutcomes[${index}]`, message: "Lifecycle outcome must be an object." });
      continue;
    }
    const cycle = cycleById.get(row?.releaseId);
    if (!row || row.rowType !== "lifecycle-outcome" || !cycle || !cycle.included || !sameCycleFields(row as unknown as Record<string, unknown>, cycle) || !isNonEmptyText(row.outcomeEvidenceId) || !["public-release", "golden-master"].includes(row.closure) || !isIsoDay(row.occurredOn) || !isIsoDay(row.firstObservedOn) || row.firstObservedOn < row.occurredOn || !validSortedEvidenceIds(row.sourceEvidenceIds) || !row.sourceEvidenceIds.includes(row.outcomeEvidenceId)) issues.push({ code: "invalid-row", path: `lifecycleOutcomes[${index}]`, message: "Lifecycle outcome is malformed, excluded, or lacks its outcome evidence ID." });
    if (outcomeById.has(row.outcomeEvidenceId)) issues.push({ code: "invalid-row", path: `lifecycleOutcomes[${index}].outcomeEvidenceId`, message: "Lifecycle outcome IDs must be unique." });
    outcomeById.set(row.outcomeEvidenceId, row);
  }
  if (!sortedBy(outcomes, (row) => `${row.releaseId}\u0000${row.occurredOn}\u0000${row.outcomeEvidenceId}`)) issues.push({ code: "invalid-row", path: "lifecycleOutcomes", message: "Lifecycle outcomes are not in canonical order." });
  const intervals = dataset.stageIntervals as HistoricalStageIntervalRow[];
  for (const [index, row] of intervals.entries()) {
    if (!isRecord(row)) {
      issues.push({ code: "invalid-row", path: `stageIntervals[${index}]`, message: "Stage interval must be an object." });
      continue;
    }
    const cycle = cycleById.get(row?.releaseId);
    const start = eventsById.get(row?.startEventId);
    const end = row?.end;
    let validEnd = end === null;
    if (end && end.kind === "event") {
      const endEvent = eventsById.get(end.eventId);
      validEnd = Boolean(endEvent) && endEvent?.releaseId === row.releaseId && validSortedEvidenceIds(end.sourceEvidenceIds) && end.sourceEvidenceIds.length === endEvent?.sourceEvidenceIds.length && end.sourceEvidenceIds.every((id) => endEvent?.sourceEvidenceIds.includes(id)) && end.occurredOn === endEvent?.occurredOn && end.stage === endEvent?.stage;
    }
    if (end && end.kind === "lifecycle-outcome") {
      const endOutcome = outcomeById.get(end.outcomeEvidenceId);
      validEnd = Boolean(endOutcome) && endOutcome?.releaseId === row.releaseId && validSortedEvidenceIds(end.sourceEvidenceIds) && end.sourceEvidenceIds.length === endOutcome?.sourceEvidenceIds.length && end.sourceEvidenceIds.every((id) => endOutcome?.sourceEvidenceIds.includes(id)) && end.sourceEvidenceIds.includes(end.outcomeEvidenceId) && end.occurredOn === endOutcome?.occurredOn;
    }
    const expectedInterval = start && end ? forecastIntervalOutcome({ releaseId: row.releaseId, occurredOn: start.occurredOn }, { releaseId: row.releaseId, occurredOn: end.occurredOn }) : null;
    const intervalValid = row?.interval?.available === true ? Boolean(expectedInterval?.available && row.interval.days === expectedInterval.days) : row?.interval?.available === false && ["chronology-coverage-unknown", "same-calendar-day", "no-subsequent-stage-or-outcome"].includes(row.interval.reason) && ((row.interval.reason === "chronology-coverage-unknown" && cycle?.chronologyCoverage.state === "unknown" && end === null) || (row.interval.reason === "same-calendar-day" && expectedInterval?.available === false && expectedInterval.reason === "same-calendar-day") || (row.interval.reason === "no-subsequent-stage-or-outcome" && end === null));
    const requiredEvidenceIds = uniqueSorted([...start?.sourceEvidenceIds ?? [], ...(end?.sourceEvidenceIds ?? [])]);
    if (!row || row.rowType !== "stage-interval" || !cycle || !cycle.included || !start || start.releaseId !== row.releaseId || !sameCycleFields(row as unknown as Record<string, unknown>, cycle) || row.startStage !== start.stage || !validEnd || !intervalValid || !validSortedEvidenceIds(row.sourceEvidenceIds) || !requiredEvidenceIds.every((id) => row.sourceEvidenceIds.includes(id))) issues.push({ code: "invalid-row", path: `stageIntervals[${index}]`, message: "Stage interval is malformed, noncanonical, or lacks exact endpoint linkage." });
  }
  if (!sortedBy(intervals, (row) => `${row.releaseId}\u0000${row.startEventId}`)) issues.push({ code: "invalid-row", path: "stageIntervals", message: "Stage intervals are not in canonical order." });
  const ledger = dataset.inclusionLedger as HistoricalAnalysisLedgerEntry[];
  for (const [index, row] of ledger.entries()) {
    if (!isRecord(row) || !isNonEmptyText(row.entryId) || !cycleById.has(row.releaseId as string) || !["adapter-observation", "release-metadata", "release-cycle"].includes(row.scope as string) || typeof row.included !== "boolean" || !validSortedEvidenceIds(row.sourceEvidenceIds) || (!row.included && !row.reason)) issues.push({ code: "invalid-row", path: `inclusionLedger[${index}]`, message: "Ledger entry is malformed or lacks source linkage." });
  }
  if (!sortedBy(ledger, (row) => `${row.releaseId}\u0000${row.entryId}`)) issues.push({ code: "invalid-row", path: "inclusionLedger", message: "Ledger is not in canonical order." });
  if (!isRecord(dataset.fingerprints) || typeof dataset.fingerprints.inputFingerprint !== "string" || !SHA_256.test(dataset.fingerprints.inputFingerprint) || /^0{64}$/.test(dataset.fingerprints.inputFingerprint) || dataset.fingerprints.codeFingerprint !== HISTORICAL_ANALYSIS_CODE_FINGERPRINT || !SHA_256.test(dataset.fingerprints.datasetFingerprint as string)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Fingerprint metadata is missing, malformed, all-zero, or code fingerprint is stale." });
  else {
    const core = Object.fromEntries(
      Object.entries(dataset).filter(([key]) => key !== "fingerprints"),
    );
    if (historicalAnalysisFingerprint({ core, inputFingerprint: dataset.fingerprints.inputFingerprint, codeFingerprint: dataset.fingerprints.codeFingerprint }) !== dataset.fingerprints.datasetFingerprint) issues.push({ code: "invalid-fingerprint", path: "fingerprints.datasetFingerprint", message: "Dataset fingerprint does not bind the dataset body and input/code fingerprints." });
  }
  return issues;
}
