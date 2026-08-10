import {
  HISTORICAL_ANALYSIS_DATASET_VERSION,
  buildHistoricalAnalysisDataset,
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
  type HistoricalLifecycleOutcomeRow,
  type HistoricalReleaseCycleRow,
} from "./historical-analysis-dataset";
import type { PublishedHistoricalReleaseSource } from "./historical-release-source";
import { adaptReleaseObservations } from "./release-observation-adapter";

/**
 * A deterministic, storage-independent capacity envelope for the daily shadow
 * forecast runtime. It deliberately does not change forecast artifact schemas.
 */
export const FORECAST_RUNTIME_COHORT_SELECTION_VERSION =
  "forecast-runtime-cohort-selection/v1";

export const FORECAST_RUNTIME_COHORT_CONFIG = {
  maxActiveReleaseCycles: 12,
  maxActivePlatforms: 6,
  mandatoryCompletedCyclesPerPlatform: 8,
  maxAdditionalCompletedCyclesPerPlatform: 4,
  maxSelectedObservations: 768,
  observationUnit:
    "raw-event-or-compatibility-milestone-or-public-lifecycle-outcome/v1",
  completedCycleRanking:
    "public-outcome-occurred-desc-observed-desc-release-id-asc/v1",
  additionalCycleAllocation:
    "rank-then-platform-id-round-robin-with-whole-cycle-cap/v1",
} as const;

export type ForecastRuntimeCohortConfig =
  typeof FORECAST_RUNTIME_COHORT_CONFIG;

export type ForecastRuntimeCohortSelectionRole =
  | "active"
  | "mandatory-training"
  | "additional-training";

export type ForecastRuntimeCohortExclusionReason =
  | "cycle-not-included"
  | "inactive-platform"
  | "lifecycle-not-completed"
  | "chronology-coverage-unknown"
  | "missing-public-outcome"
  | "no-canonical-events"
  | "per-platform-history-limit"
  | "selected-observation-cap";

export interface ForecastRuntimeCohortSelectedCycleV1 {
  releaseId: string;
  platformId: string;
  role: ForecastRuntimeCohortSelectionRole;
  /** Null for active cycles; 1 is the most-recent completed cycle. */
  rankWithinPlatformHistory: number | null;
  /**
   * Counts every raw event and compatibility milestone plus a known public
   * lifecycle outcome. No source record inside a selected cycle is truncated.
   */
  observationCount: number;
  publicOutcome: {
    occurredOn: string;
    firstObservedOn: string;
  } | null;
}

export interface ForecastRuntimeCohortPlatformCountV1 {
  platformId: string;
  activeReleaseCount: number;
  mandatoryCompletedCount: number;
  additionalCompletedCount: number;
  selectedReleaseCount: number;
  selectedObservationCount: number;
}

export interface ForecastRuntimeCohortExclusionV1 {
  releaseId: string;
  platformId: string;
  reason: ForecastRuntimeCohortExclusionReason;
}

export interface ForecastRuntimeCohortSelectionV1 {
  selectionVersion: typeof FORECAST_RUNTIME_COHORT_SELECTION_VERSION;
  config: ForecastRuntimeCohortConfig;
  sourceDataset: {
    version: typeof HISTORICAL_ANALYSIS_DATASET_VERSION;
    fingerprint: string;
    asOfDate: string;
    issuedAt: string;
  };
  selectedReleaseIds: readonly string[];
  activePlatformIds: readonly string[];
  selectedCycles: readonly ForecastRuntimeCohortSelectedCycleV1[];
  perPlatformCounts: readonly ForecastRuntimeCohortPlatformCountV1[];
  selectedObservationCount: number;
  exclusions: readonly ForecastRuntimeCohortExclusionV1[];
  fingerprints: {
    codeFingerprint: string;
    configFingerprint: string;
    resultFingerprint: string;
  };
}

export type ForecastRuntimeCohortErrorCode =
  | "invalid-dataset"
  | "invalid-source-join"
  | "source-dataset-mismatch"
  | "active-release-limit"
  | "active-platform-limit"
  | "mandatory-history-underflow"
  | "selected-observation-limit";

export class ForecastRuntimeCohortError extends Error {
  constructor(public readonly code: ForecastRuntimeCohortErrorCode) {
    super(`Forecast runtime cohort selection failed: ${code}.`);
    this.name = "ForecastRuntimeCohortError";
  }
}

export type ForecastRuntimeCohortValidationCode =
  | "invalid-input"
  | "unexpected-property"
  | "invalid-version"
  | "invalid-config"
  | "invalid-source-dataset"
  | "invalid-selected-cycle"
  | "invalid-exclusion"
  | "invalid-count"
  | "invalid-order"
  | "invalid-fingerprint";

export interface ForecastRuntimeCohortValidationIssue {
  code: ForecastRuntimeCohortValidationCode;
  path: string;
  message: string;
}

interface EligibleCompletedCycle {
  cycle: HistoricalReleaseCycleRow;
  outcome: HistoricalLifecycleOutcomeRow;
  observationCount: number;
}

const SHA_256 = /^[a-f0-9]{64}$/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_INSTANT =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const encoder = new TextEncoder();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareTextDescending(left: string, right: string): number {
  return compareText(right, left);
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareText);
}

function isIsoDay(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DAY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isIsoInstant(value: unknown): value is string {
  return (
    typeof value === "string" &&
    ISO_INSTANT.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function isNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function hasExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  return (
    stableSerializeHistoricalAnalysis(Object.keys(value).sort(compareText)) ===
    stableSerializeHistoricalAnalysis([...expected].sort(compareText))
  );
}

function isCanonicalTextArray(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every(isNonEmptyText) &&
    value.every(
      (entry, index, all) => index === 0 || all[index - 1] < entry,
    )
  );
}

function runtimeCodeManifest() {
  return {
    algorithm:
      "exact-source-rebuild;all-active;outcome-ranked-eight-mandatory;four-round-robin;whole-cycle-raw-observation-cap;strict-v1",
    historicalDatasetVersion: HISTORICAL_ANALYSIS_DATASET_VERSION,
    selectionVersion: FORECAST_RUNTIME_COHORT_SELECTION_VERSION,
  } as const;
}

export const FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT =
  historicalAnalysisFingerprint(runtimeCodeManifest());

export const FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT =
  historicalAnalysisFingerprint(FORECAST_RUNTIME_COHORT_CONFIG);

function buildDatasetFromSource(
  source: PublishedHistoricalReleaseSource,
  cutoff: { asOfDate: string; issuedAt: string },
): HistoricalAnalysisDatasetV1 {
  return buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations({
      asOfDate: cutoff.asOfDate,
      issuedAt: cutoff.issuedAt,
      releases: source.releases,
      events: source.events,
      compatibilityMilestones: source.compatibilityMilestones,
    }),
    releaseMetadata: source.releaseMetadata,
  });
}

/** Rebuild helper used by projection verification and local capacity tooling. */
export function buildHistoricalAnalysisDatasetFromPublishedSource(
  source: PublishedHistoricalReleaseSource,
  cutoff: { asOfDate: string; issuedAt: string },
): HistoricalAnalysisDatasetV1 {
  return buildDatasetFromSource(source, cutoff);
}

function assertSourceJoins(
  source: PublishedHistoricalReleaseSource,
): Map<string, number> {
  if (
    !isRecord(source) ||
    !Array.isArray(source.releases) ||
    !Array.isArray(source.events) ||
    !Array.isArray(source.compatibilityMilestones) ||
    !Array.isArray(source.releaseMetadata)
  ) {
    throw new ForecastRuntimeCohortError("invalid-source-join");
  }

  const releaseIds = new Set<string>();
  for (const release of source.releases) {
    if (!isNonEmptyText(release?.id) || releaseIds.has(release.id)) {
      throw new ForecastRuntimeCohortError("invalid-source-join");
    }
    releaseIds.add(release.id);
  }

  const metadataIds = new Set<string>();
  for (const metadata of source.releaseMetadata) {
    if (
      !isNonEmptyText(metadata?.releaseId) ||
      metadataIds.has(metadata.releaseId) ||
      !releaseIds.has(metadata.releaseId)
    ) {
      throw new ForecastRuntimeCohortError("invalid-source-join");
    }
    metadataIds.add(metadata.releaseId);
  }
  if (
    releaseIds.size !== metadataIds.size ||
    [...releaseIds].some((releaseId) => !metadataIds.has(releaseId))
  ) {
    throw new ForecastRuntimeCohortError("invalid-source-join");
  }

  const rawObservationCounts = new Map<string, number>(
    [...releaseIds].map((releaseId) => [releaseId, 0]),
  );
  for (const observation of [
    ...source.events,
    ...source.compatibilityMilestones,
  ]) {
    if (
      !isNonEmptyText(observation?.releaseId) ||
      !releaseIds.has(observation.releaseId)
    ) {
      throw new ForecastRuntimeCohortError("invalid-source-join");
    }
    rawObservationCounts.set(
      observation.releaseId,
      (rawObservationCounts.get(observation.releaseId) ?? 0) + 1,
    );
  }
  return rawObservationCounts;
}

function assertExactSource(
  dataset: HistoricalAnalysisDatasetV1,
  source: PublishedHistoricalReleaseSource,
): Map<string, number> {
  let datasetIssues;
  try {
    datasetIssues = validateHistoricalAnalysisDataset(dataset);
  } catch {
    throw new ForecastRuntimeCohortError("invalid-dataset");
  }
  if (datasetIssues.length > 0) {
    throw new ForecastRuntimeCohortError("invalid-dataset");
  }

  const rawObservationCounts = assertSourceJoins(source);
  const sourceIds = sortedUnique(source.releases.map((release) => release.id));
  const datasetIds = dataset.releaseCycles.map((cycle) => cycle.releaseId);
  if (
    stableSerializeHistoricalAnalysis(sourceIds) !==
    stableSerializeHistoricalAnalysis(datasetIds)
  ) {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }

  let rebuilt: HistoricalAnalysisDatasetV1;
  try {
    rebuilt = buildDatasetFromSource(source, {
      asOfDate: dataset.provenance.sourceAsOfDate,
      issuedAt: dataset.provenance.sourceIssuedAt,
    });
  } catch {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }
  if (
    stableSerializeHistoricalAnalysis(rebuilt) !==
    stableSerializeHistoricalAnalysis(dataset)
  ) {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }
  return rawObservationCounts;
}

function publicOutcomeByRelease(
  dataset: HistoricalAnalysisDatasetV1,
): Map<string, HistoricalLifecycleOutcomeRow> {
  const result = new Map<string, HistoricalLifecycleOutcomeRow>();
  for (const outcome of dataset.lifecycleOutcomes) {
    if (outcome.closure !== "public-release" || result.has(outcome.releaseId)) {
      throw new ForecastRuntimeCohortError("invalid-dataset");
    }
    result.set(outcome.releaseId, outcome);
  }
  return result;
}

function observationCountForCycle(
  releaseId: string,
  rawObservationCounts: ReadonlyMap<string, number>,
  outcomes: ReadonlyMap<string, HistoricalLifecycleOutcomeRow>,
): number {
  return (rawObservationCounts.get(releaseId) ?? 0) +
    (outcomes.has(releaseId) ? 1 : 0);
}

function completedCycleSort(
  left: EligibleCompletedCycle,
  right: EligibleCompletedCycle,
): number {
  return (
    compareTextDescending(left.outcome.occurredOn, right.outcome.occurredOn) ||
    compareTextDescending(
      left.outcome.firstObservedOn,
      right.outcome.firstObservedOn,
    ) ||
    compareText(left.cycle.releaseId, right.cycle.releaseId)
  );
}

function eligibilityReason(
  cycle: HistoricalReleaseCycleRow,
  activePlatforms: ReadonlySet<string>,
  outcomes: ReadonlyMap<string, HistoricalLifecycleOutcomeRow>,
  eventCounts: ReadonlyMap<string, number>,
): ForecastRuntimeCohortExclusionReason | null {
  if (!cycle.included) return "cycle-not-included";
  if (!activePlatforms.has(cycle.platformId)) return "inactive-platform";
  if (cycle.lifecycle !== "released") return "lifecycle-not-completed";
  if (cycle.chronologyCoverage.state !== "complete") {
    return "chronology-coverage-unknown";
  }
  if (!outcomes.has(cycle.releaseId)) return "missing-public-outcome";
  if ((eventCounts.get(cycle.releaseId) ?? 0) === 0) {
    return "no-canonical-events";
  }
  return null;
}

function selectionCore(
  artifact: Omit<ForecastRuntimeCohortSelectionV1, "fingerprints">,
): Omit<ForecastRuntimeCohortSelectionV1, "fingerprints"> {
  return artifact;
}

function resultFingerprint(
  core: Omit<ForecastRuntimeCohortSelectionV1, "fingerprints">,
): string {
  return historicalAnalysisFingerprint({
    core,
    codeFingerprint: FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
    configFingerprint: FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
  });
}

/**
 * Select an all-or-nothing runtime cohort. The selector validates that the raw
 * source reconstructs the exact supplied historical dataset before ranking.
 */
export function buildForecastRuntimeCohortSelection(
  dataset: HistoricalAnalysisDatasetV1,
  source: PublishedHistoricalReleaseSource,
): ForecastRuntimeCohortSelectionV1 {
  const rawObservationCounts = assertExactSource(dataset, source);
  const outcomes = publicOutcomeByRelease(dataset);
  const eventCounts = new Map<string, number>();
  for (const event of dataset.canonicalEvents) {
    eventCounts.set(event.releaseId, (eventCounts.get(event.releaseId) ?? 0) + 1);
  }

  const activeCycles = dataset.releaseCycles
    .filter((cycle) => cycle.included && cycle.lifecycle === "active")
    .sort((left, right) => compareText(left.releaseId, right.releaseId));
  if (activeCycles.length > FORECAST_RUNTIME_COHORT_CONFIG.maxActiveReleaseCycles) {
    throw new ForecastRuntimeCohortError("active-release-limit");
  }
  const activePlatformIds = sortedUnique(
    activeCycles.map((cycle) => cycle.platformId),
  );
  if (activePlatformIds.length > FORECAST_RUNTIME_COHORT_CONFIG.maxActivePlatforms) {
    throw new ForecastRuntimeCohortError("active-platform-limit");
  }
  const activePlatforms = new Set(activePlatformIds);

  const eligibleByPlatform = new Map<string, EligibleCompletedCycle[]>();
  for (const platformId of activePlatformIds) {
    const eligible = dataset.releaseCycles
      .filter(
        (cycle) =>
          cycle.platformId === platformId &&
          eligibilityReason(cycle, activePlatforms, outcomes, eventCounts) === null,
      )
      .map((cycle) => ({
        cycle,
        outcome: outcomes.get(cycle.releaseId)!,
        observationCount: observationCountForCycle(
          cycle.releaseId,
          rawObservationCounts,
          outcomes,
        ),
      }))
      .sort(completedCycleSort);
    if (
      eligible.length <
      FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform
    ) {
      throw new ForecastRuntimeCohortError("mandatory-history-underflow");
    }
    eligibleByPlatform.set(platformId, eligible);
  }

  const selected = new Map<string, ForecastRuntimeCohortSelectedCycleV1>();
  for (const cycle of activeCycles) {
    selected.set(cycle.releaseId, {
      releaseId: cycle.releaseId,
      platformId: cycle.platformId,
      role: "active",
      rankWithinPlatformHistory: null,
      observationCount: observationCountForCycle(
        cycle.releaseId,
        rawObservationCounts,
        outcomes,
      ),
      publicOutcome: null,
    });
  }

  for (const platformId of activePlatformIds) {
    const eligible = eligibleByPlatform.get(platformId)!;
    for (
      let index = 0;
      index <
      FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform;
      index += 1
    ) {
      const candidate = eligible[index];
      selected.set(candidate.cycle.releaseId, {
        releaseId: candidate.cycle.releaseId,
        platformId,
        role: "mandatory-training",
        rankWithinPlatformHistory: index + 1,
        observationCount: candidate.observationCount,
        publicOutcome: {
          occurredOn: candidate.outcome.occurredOn,
          firstObservedOn: candidate.outcome.firstObservedOn,
        },
      });
    }
  }

  let selectedObservationCount = [...selected.values()].reduce(
    (total, cycle) => total + cycle.observationCount,
    0,
  );
  if (
    selectedObservationCount >
    FORECAST_RUNTIME_COHORT_CONFIG.maxSelectedObservations
  ) {
    throw new ForecastRuntimeCohortError("selected-observation-limit");
  }

  const capacityExcluded = new Set<string>();
  for (
    let additionalOffset = 0;
    additionalOffset <
    FORECAST_RUNTIME_COHORT_CONFIG.maxAdditionalCompletedCyclesPerPlatform;
    additionalOffset += 1
  ) {
    for (const platformId of activePlatformIds) {
      const candidate = eligibleByPlatform.get(platformId)?.[
        FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform +
          additionalOffset
      ];
      if (!candidate) continue;
      if (
        selectedObservationCount + candidate.observationCount >
        FORECAST_RUNTIME_COHORT_CONFIG.maxSelectedObservations
      ) {
        capacityExcluded.add(candidate.cycle.releaseId);
        continue;
      }
      selected.set(candidate.cycle.releaseId, {
        releaseId: candidate.cycle.releaseId,
        platformId,
        role: "additional-training",
        rankWithinPlatformHistory:
          FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform +
          additionalOffset +
          1,
        observationCount: candidate.observationCount,
        publicOutcome: {
          occurredOn: candidate.outcome.occurredOn,
          firstObservedOn: candidate.outcome.firstObservedOn,
        },
      });
      selectedObservationCount += candidate.observationCount;
    }
  }

  const exclusions: ForecastRuntimeCohortExclusionV1[] = [];
  for (const cycle of dataset.releaseCycles) {
    if (selected.has(cycle.releaseId)) continue;
    const eligibility = eligibilityReason(
      cycle,
      activePlatforms,
      outcomes,
      eventCounts,
    );
    let reason = eligibility;
    if (!reason) {
      reason = capacityExcluded.has(cycle.releaseId)
        ? "selected-observation-cap"
        : "per-platform-history-limit";
    }
    exclusions.push({
      releaseId: cycle.releaseId,
      platformId: cycle.platformId,
      reason,
    });
  }

  const selectedCycles = [...selected.values()].sort((left, right) =>
    compareText(left.releaseId, right.releaseId),
  );
  const perPlatformCounts = activePlatformIds.map((platformId) => {
    const platformCycles = selectedCycles.filter(
      (cycle) => cycle.platformId === platformId,
    );
    return {
      platformId,
      activeReleaseCount: platformCycles.filter(
        (cycle) => cycle.role === "active",
      ).length,
      mandatoryCompletedCount: platformCycles.filter(
        (cycle) => cycle.role === "mandatory-training",
      ).length,
      additionalCompletedCount: platformCycles.filter(
        (cycle) => cycle.role === "additional-training",
      ).length,
      selectedReleaseCount: platformCycles.length,
      selectedObservationCount: platformCycles.reduce(
        (total, cycle) => total + cycle.observationCount,
        0,
      ),
    };
  });
  const core = selectionCore({
    selectionVersion: FORECAST_RUNTIME_COHORT_SELECTION_VERSION,
    config: FORECAST_RUNTIME_COHORT_CONFIG,
    sourceDataset: {
      version: dataset.datasetVersion,
      fingerprint: dataset.fingerprints.datasetFingerprint,
      asOfDate: dataset.provenance.sourceAsOfDate,
      issuedAt: dataset.provenance.sourceIssuedAt,
    },
    selectedReleaseIds: selectedCycles.map((cycle) => cycle.releaseId),
    activePlatformIds,
    selectedCycles,
    perPlatformCounts,
    selectedObservationCount,
    exclusions: exclusions.sort((left, right) =>
      compareText(left.releaseId, right.releaseId),
    ),
  });
  const artifact: ForecastRuntimeCohortSelectionV1 = {
    ...core,
    fingerprints: {
      codeFingerprint: FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT,
      configFingerprint: FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT,
      resultFingerprint: resultFingerprint(core),
    },
  };
  const issues = validateForecastRuntimeCohortSelection(artifact);
  if (issues.length > 0) {
    throw new ForecastRuntimeCohortError("invalid-dataset");
  }
  return artifact;
}

function projectionEventSort(
  left: PublishedHistoricalReleaseSource["events"][number],
  right: PublishedHistoricalReleaseSource["events"][number],
): number {
  return (
    compareText(left.releaseId, right.releaseId) ||
    compareText(left.occurredOn, right.occurredOn) ||
    compareText(left.stableEventId ?? left.id, right.stableEventId ?? right.id) ||
    compareText(left.id, right.id)
  );
}

function projectedAnalyticalCore(
  dataset: HistoricalAnalysisDatasetV1,
  selectedIds?: ReadonlySet<string>,
) {
  const included = (releaseId: string) =>
    selectedIds === undefined || selectedIds.has(releaseId);
  return {
    datasetVersion: dataset.datasetVersion,
    provenance: dataset.provenance,
    releaseCycles: dataset.releaseCycles.filter((row) =>
      included(row.releaseId),
    ),
    canonicalEvents: dataset.canonicalEvents.filter((row) =>
      included(row.releaseId),
    ),
    stageIntervals: dataset.stageIntervals.filter((row) =>
      included(row.releaseId),
    ),
    lifecycleOutcomes: dataset.lifecycleOutcomes.filter((row) =>
      included(row.releaseId),
    ),
    inclusionLedger: dataset.inclusionLedger.filter((row) =>
      included(row.releaseId),
    ),
  };
}

/**
 * Filter the exact source to whole selected cycles. The full source is rebound
 * to the selection fingerprint first, and no event inside a selected release
 * is dropped.
 */
export function projectPublishedHistoricalReleaseSourceForRuntimeCohort(
  source: PublishedHistoricalReleaseSource,
  selection: ForecastRuntimeCohortSelectionV1,
): PublishedHistoricalReleaseSource {
  if (validateForecastRuntimeCohortSelection(selection).length > 0) {
    throw new ForecastRuntimeCohortError("invalid-dataset");
  }
  let rebuilt: HistoricalAnalysisDatasetV1;
  try {
    assertSourceJoins(source);
    rebuilt = buildDatasetFromSource(source, {
      asOfDate: selection.sourceDataset.asOfDate,
      issuedAt: selection.sourceDataset.issuedAt,
    });
  } catch (error) {
    if (error instanceof ForecastRuntimeCohortError) throw error;
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }
  if (
    rebuilt.fingerprints.datasetFingerprint !==
    selection.sourceDataset.fingerprint
  ) {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }

  let authoritativeSelection: ForecastRuntimeCohortSelectionV1;
  try {
    authoritativeSelection = buildForecastRuntimeCohortSelection(rebuilt, source);
  } catch {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }
  if (
    stableSerializeHistoricalAnalysis(authoritativeSelection) !==
    stableSerializeHistoricalAnalysis(selection)
  ) {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }

  const selectedIds = new Set(selection.selectedReleaseIds);
  const projected: PublishedHistoricalReleaseSource = {
    releases: source.releases
      .filter((release) => selectedIds.has(release.id))
      .slice()
      .sort((left, right) => compareText(left.id, right.id)),
    events: source.events
      .filter((event) => selectedIds.has(event.releaseId))
      .slice()
      .sort(projectionEventSort),
    compatibilityMilestones: source.compatibilityMilestones
      .filter((milestone) => selectedIds.has(milestone.releaseId))
      .slice()
      .sort(
        (left, right) =>
          compareText(left.releaseId, right.releaseId) ||
          compareText(left.occurredOn, right.occurredOn) ||
          compareText(left.id, right.id),
      ),
    releaseMetadata: source.releaseMetadata
      .filter((metadata) => selectedIds.has(metadata.releaseId))
      .slice()
      .sort((left, right) => compareText(left.releaseId, right.releaseId)),
  };
  const projectedCounts = assertSourceJoins(projected);
  const projectedObservationCount = selection.selectedCycles.reduce(
    (total, cycle) =>
      total +
      (projectedCounts.get(cycle.releaseId) ?? 0) +
      (cycle.publicOutcome === null ? 0 : 1),
    0,
  );
  if (projectedObservationCount !== selection.selectedObservationCount) {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }

  let projectedDataset: HistoricalAnalysisDatasetV1;
  try {
    projectedDataset = buildDatasetFromSource(projected, {
      asOfDate: selection.sourceDataset.asOfDate,
      issuedAt: selection.sourceDataset.issuedAt,
    });
    if (validateHistoricalAnalysisDataset(projectedDataset).length > 0) {
      throw new ForecastRuntimeCohortError("source-dataset-mismatch");
    }
  } catch {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }
  if (
    stableSerializeHistoricalAnalysis(
      projectedAnalyticalCore(projectedDataset),
    ) !==
    stableSerializeHistoricalAnalysis(
      projectedAnalyticalCore(rebuilt, selectedIds),
    )
  ) {
    throw new ForecastRuntimeCohortError("source-dataset-mismatch");
  }
  return projected;
}

function pushUnexpectedProperties(
  issues: ForecastRuntimeCohortValidationIssue[],
  value: unknown,
  path: string,
  keys: readonly string[],
): value is Record<string, unknown> {
  if (!isRecord(value)) {
    issues.push({
      code: "invalid-input",
      path,
      message: `${path} must be an object.`,
    });
    return false;
  }
  if (!hasExactKeys(value, keys)) {
    issues.push({
      code: "unexpected-property",
      path,
      message: `${path} must contain only the v1 properties.`,
    });
  }
  return true;
}

/** Strict, exact-property validator for serialized selection artifacts. */
export function validateForecastRuntimeCohortSelection(
  value: unknown,
): ForecastRuntimeCohortValidationIssue[] {
  const issues: ForecastRuntimeCohortValidationIssue[] = [];
  if (
    !pushUnexpectedProperties(issues, value, "selection", [
      "selectionVersion",
      "config",
      "sourceDataset",
      "selectedReleaseIds",
      "activePlatformIds",
      "selectedCycles",
      "perPlatformCounts",
      "selectedObservationCount",
      "exclusions",
      "fingerprints",
    ])
  ) {
    return issues;
  }
  if (value.selectionVersion !== FORECAST_RUNTIME_COHORT_SELECTION_VERSION) {
    issues.push({
      code: "invalid-version",
      path: "selectionVersion",
      message: `Expected ${FORECAST_RUNTIME_COHORT_SELECTION_VERSION}.`,
    });
  }
  if (
    !isRecord(value.config) ||
    !hasExactKeys(value.config, Object.keys(FORECAST_RUNTIME_COHORT_CONFIG)) ||
    stableSerializeHistoricalAnalysis(value.config) !==
      stableSerializeHistoricalAnalysis(FORECAST_RUNTIME_COHORT_CONFIG)
  ) {
    issues.push({
      code: "invalid-config",
      path: "config",
      message: "The fixed v1 capacity config is required.",
    });
  }

  if (
    pushUnexpectedProperties(issues, value.sourceDataset, "sourceDataset", [
      "version",
      "fingerprint",
      "asOfDate",
      "issuedAt",
    ])
  ) {
    if (
      value.sourceDataset.version !== HISTORICAL_ANALYSIS_DATASET_VERSION ||
      typeof value.sourceDataset.fingerprint !== "string" ||
      !SHA_256.test(value.sourceDataset.fingerprint) ||
      !isIsoDay(value.sourceDataset.asOfDate) ||
      !isIsoInstant(value.sourceDataset.issuedAt)
    ) {
      issues.push({
        code: "invalid-source-dataset",
        path: "sourceDataset",
        message: "Source dataset version, cutoff, issuance, or fingerprint is invalid.",
      });
    }
  }

  if (!isCanonicalTextArray(value.selectedReleaseIds)) {
    issues.push({
      code: "invalid-order",
      path: "selectedReleaseIds",
      message: "Selected release IDs must be unique and canonically sorted.",
    });
  }
  if (!isCanonicalTextArray(value.activePlatformIds)) {
    issues.push({
      code: "invalid-order",
      path: "activePlatformIds",
      message: "Active platform IDs must be unique and canonically sorted.",
    });
  }

  const selectedCycles: ForecastRuntimeCohortSelectedCycleV1[] = [];
  if (!Array.isArray(value.selectedCycles)) {
    issues.push({
      code: "invalid-selected-cycle",
      path: "selectedCycles",
      message: "Selected cycles must be an array.",
    });
  } else {
    const ids = new Set<string>();
    for (const [index, candidate] of value.selectedCycles.entries()) {
      const path = `selectedCycles[${index}]`;
      if (
        !pushUnexpectedProperties(issues, candidate, path, [
          "releaseId",
          "platformId",
          "role",
          "rankWithinPlatformHistory",
          "observationCount",
          "publicOutcome",
        ])
      ) {
        continue;
      }
      const role = candidate.role;
      const rank = candidate.rankWithinPlatformHistory;
      const activeShape =
        role === "active" && rank === null && candidate.publicOutcome === null;
      const trainingShape =
        (role === "mandatory-training" || role === "additional-training") &&
        Number.isSafeInteger(rank) &&
        (rank as number) >= 1 &&
        (rank as number) <=
          FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform +
            FORECAST_RUNTIME_COHORT_CONFIG.maxAdditionalCompletedCyclesPerPlatform &&
        isRecord(candidate.publicOutcome) &&
        hasExactKeys(candidate.publicOutcome, ["occurredOn", "firstObservedOn"]) &&
        isIsoDay(candidate.publicOutcome.occurredOn) &&
        isIsoDay(candidate.publicOutcome.firstObservedOn) &&
        candidate.publicOutcome.firstObservedOn >=
          candidate.publicOutcome.occurredOn;
      const roleMatchesRank =
        activeShape ||
        (trainingShape &&
          ((role === "mandatory-training" &&
            (rank as number) <=
              FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform) ||
            (role === "additional-training" &&
              (rank as number) >
                FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform)));
      if (
        !isNonEmptyText(candidate.releaseId) ||
        !isNonEmptyText(candidate.platformId) ||
        !isNonNegativeSafeInteger(candidate.observationCount) ||
        !roleMatchesRank ||
        ids.has(candidate.releaseId)
      ) {
        issues.push({
          code: "invalid-selected-cycle",
          path,
          message: "Selected cycle identity, role, rank, outcome, or count is invalid.",
        });
      }
      if (isNonEmptyText(candidate.releaseId)) ids.add(candidate.releaseId);
      selectedCycles.push(candidate as unknown as ForecastRuntimeCohortSelectedCycleV1);
    }
    if (
      !selectedCycles.every(
        (cycle, index) =>
          index === 0 || selectedCycles[index - 1].releaseId < cycle.releaseId,
      )
    ) {
      issues.push({
        code: "invalid-order",
        path: "selectedCycles",
        message: "Selected cycles must be canonically ordered by release ID.",
      });
    }
  }

  const derivedSelectedReleaseIds = selectedCycles.map((cycle) => cycle.releaseId);
  if (
    stableSerializeHistoricalAnalysis(value.selectedReleaseIds) !==
    stableSerializeHistoricalAnalysis(derivedSelectedReleaseIds)
  ) {
    issues.push({
      code: "invalid-count",
      path: "selectedReleaseIds",
      message: "Selected release IDs must exactly match selected cycles.",
    });
  }
  const derivedActivePlatformIds = sortedUnique(
    selectedCycles
      .filter((cycle) => cycle.role === "active")
      .map((cycle) => cycle.platformId),
  );
  if (
    stableSerializeHistoricalAnalysis(value.activePlatformIds) !==
    stableSerializeHistoricalAnalysis(derivedActivePlatformIds) ||
    derivedActivePlatformIds.length >
      FORECAST_RUNTIME_COHORT_CONFIG.maxActivePlatforms ||
    selectedCycles.filter((cycle) => cycle.role === "active").length >
      FORECAST_RUNTIME_COHORT_CONFIG.maxActiveReleaseCycles
  ) {
    issues.push({
      code: "invalid-count",
      path: "activePlatformIds",
      message: "Active platform or release counts violate the v1 limits.",
    });
  }
  const activePlatformSet = new Set(derivedActivePlatformIds);
  if (
    selectedCycles.some(
      (cycle) =>
        cycle.role !== "active" && !activePlatformSet.has(cycle.platformId),
    )
  ) {
    issues.push({
      code: "invalid-selected-cycle",
      path: "selectedCycles",
      message: "Training cycles must belong to an active platform.",
    });
  }
  const sourceAsOfDate = isRecord(value.sourceDataset)
    ? value.sourceDataset.asOfDate
    : null;
  if (
    typeof sourceAsOfDate === "string" &&
    selectedCycles.some(
      (cycle) =>
        cycle.publicOutcome !== null &&
        (cycle.publicOutcome.occurredOn > sourceAsOfDate ||
          cycle.publicOutcome.firstObservedOn > sourceAsOfDate),
    )
  ) {
    issues.push({
      code: "invalid-selected-cycle",
      path: "selectedCycles.publicOutcome",
      message: "Selected public outcomes must be known by the source cutoff.",
    });
  }

  const expectedPlatformCounts = derivedActivePlatformIds.map((platformId) => {
    const cycles = selectedCycles.filter((cycle) => cycle.platformId === platformId);
    const mandatory = cycles.filter(
      (cycle) => cycle.role === "mandatory-training",
    );
    const mandatoryRanks = mandatory
      .map((cycle) => cycle.rankWithinPlatformHistory)
      .sort((left, right) => (left ?? 0) - (right ?? 0));
    const requiredRanks = Array.from(
      {
        length:
          FORECAST_RUNTIME_COHORT_CONFIG.mandatoryCompletedCyclesPerPlatform,
      },
      (_, index) => index + 1,
    );
    if (
      stableSerializeHistoricalAnalysis(mandatoryRanks) !==
      stableSerializeHistoricalAnalysis(requiredRanks)
    ) {
      issues.push({
        code: "invalid-count",
        path: `perPlatformCounts.${platformId}.mandatoryCompletedCount`,
        message: "Every active platform requires the eight most-recent completed cycles.",
      });
    }
    const ranks = cycles
      .filter((cycle) => cycle.role !== "active")
      .map((cycle) => cycle.rankWithinPlatformHistory);
    if (new Set(ranks).size !== ranks.length) {
      issues.push({
        code: "invalid-selected-cycle",
        path: `selectedCycles.${platformId}`,
        message: "Training ranks must be unique within a platform.",
      });
    }
    return {
      platformId,
      activeReleaseCount: cycles.filter((cycle) => cycle.role === "active").length,
      mandatoryCompletedCount: mandatory.length,
      additionalCompletedCount: cycles.filter(
        (cycle) => cycle.role === "additional-training",
      ).length,
      selectedReleaseCount: cycles.length,
      selectedObservationCount: cycles.reduce(
        (total, cycle) => total + cycle.observationCount,
        0,
      ),
    };
  });
  if (
    !Array.isArray(value.perPlatformCounts) ||
    stableSerializeHistoricalAnalysis(value.perPlatformCounts) !==
      stableSerializeHistoricalAnalysis(expectedPlatformCounts)
  ) {
    issues.push({
      code: "invalid-count",
      path: "perPlatformCounts",
      message: "Per-platform counts must exactly match selected cycles.",
    });
  } else {
    for (const [index, count] of value.perPlatformCounts.entries()) {
      if (
        !isRecord(count) ||
        !hasExactKeys(count, [
          "platformId",
          "activeReleaseCount",
          "mandatoryCompletedCount",
          "additionalCompletedCount",
          "selectedReleaseCount",
          "selectedObservationCount",
        ])
      ) {
        issues.push({
          code: "unexpected-property",
          path: `perPlatformCounts[${index}]`,
          message: "Per-platform count has unexpected properties.",
        });
      }
    }
  }

  const derivedObservationCount = selectedCycles.reduce(
    (total, cycle) => total + cycle.observationCount,
    0,
  );
  if (
    value.selectedObservationCount !== derivedObservationCount ||
    !isNonNegativeSafeInteger(value.selectedObservationCount) ||
    derivedObservationCount >
      FORECAST_RUNTIME_COHORT_CONFIG.maxSelectedObservations
  ) {
    issues.push({
      code: "invalid-count",
      path: "selectedObservationCount",
      message: "Selected observations must match cycle counts and stay within 768.",
    });
  }

  if (!Array.isArray(value.exclusions)) {
    issues.push({
      code: "invalid-exclusion",
      path: "exclusions",
      message: "Exclusions must be an array.",
    });
  } else {
    const selectedIds = new Set(derivedSelectedReleaseIds);
    const exclusionIds = new Set<string>();
    const reasons = new Set<ForecastRuntimeCohortExclusionReason>([
      "cycle-not-included",
      "inactive-platform",
      "lifecycle-not-completed",
      "chronology-coverage-unknown",
      "missing-public-outcome",
      "no-canonical-events",
      "per-platform-history-limit",
      "selected-observation-cap",
    ]);
    for (const [index, exclusion] of value.exclusions.entries()) {
      const path = `exclusions[${index}]`;
      if (
        !pushUnexpectedProperties(issues, exclusion, path, [
          "releaseId",
          "platformId",
          "reason",
        ])
      ) {
        continue;
      }
      if (
        !isNonEmptyText(exclusion.releaseId) ||
        !isNonEmptyText(exclusion.platformId) ||
        !reasons.has(exclusion.reason as ForecastRuntimeCohortExclusionReason) ||
        selectedIds.has(exclusion.releaseId) ||
        exclusionIds.has(exclusion.releaseId)
      ) {
        issues.push({
          code: "invalid-exclusion",
          path,
          message: "Exclusion identity or reason is invalid or overlaps selection.",
        });
      }
      if (isNonEmptyText(exclusion.releaseId)) {
        exclusionIds.add(exclusion.releaseId);
      }
    }
    const exclusionOrderValid = value.exclusions.every(
      (exclusion, index, all) => {
        if (!isRecord(exclusion) || !isNonEmptyText(exclusion.releaseId)) {
          return false;
        }
        if (index === 0) return true;
        const previous = all[index - 1];
        return (
          isRecord(previous) &&
          isNonEmptyText(previous.releaseId) &&
          previous.releaseId < exclusion.releaseId
        );
      },
    );
    if (!exclusionOrderValid) {
      issues.push({
        code: "invalid-order",
        path: "exclusions",
        message: "Exclusions must be canonically ordered by release ID.",
      });
    }
  }

  if (
    pushUnexpectedProperties(issues, value.fingerprints, "fingerprints", [
      "codeFingerprint",
      "configFingerprint",
      "resultFingerprint",
    ])
  ) {
    const fingerprints = value.fingerprints;
    const core = {
      selectionVersion: value.selectionVersion,
      config: value.config,
      sourceDataset: value.sourceDataset,
      selectedReleaseIds: value.selectedReleaseIds,
      activePlatformIds: value.activePlatformIds,
      selectedCycles: value.selectedCycles,
      perPlatformCounts: value.perPlatformCounts,
      selectedObservationCount: value.selectedObservationCount,
      exclusions: value.exclusions,
    } as Omit<ForecastRuntimeCohortSelectionV1, "fingerprints">;
    if (
      fingerprints.codeFingerprint !==
        FORECAST_RUNTIME_COHORT_CODE_FINGERPRINT ||
      fingerprints.configFingerprint !==
        FORECAST_RUNTIME_COHORT_CONFIG_FINGERPRINT ||
      typeof fingerprints.resultFingerprint !== "string" ||
      !SHA_256.test(fingerprints.resultFingerprint) ||
      fingerprints.resultFingerprint !== resultFingerprint(core)
    ) {
      issues.push({
        code: "invalid-fingerprint",
        path: "fingerprints",
        message: "Code, config, or result fingerprint is invalid.",
      });
    }
  }
  return issues;
}

/** Byte count helper for local benchmark reports; not a runtime acceptance gate. */
export function forecastRuntimeCohortSelectionBytes(
  selection: ForecastRuntimeCohortSelectionV1,
): number {
  return encoder.encode(stableSerializeHistoricalAnalysis(selection)).byteLength;
}
