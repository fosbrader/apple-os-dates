import {
  FORECAST_OUTCOME_BINDING_MAX_ROWS,
  validateForecastOutcomeInstantBinding,
  type ForecastOutcomeInstantBindingV1,
} from "./forecast-shadow-scoring";
import {
  buildHistoricalAnalysisDataset,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
} from "./historical-analysis-dataset";
import {
  PublishedHistoricalReleaseSourceValidationError,
  validatePublishedHistoricalReleaseSource,
  type PublishedHistoricalReleaseSource,
} from "./historical-release-source";
import {
  adaptReleaseObservations,
  compatibilityEvidenceId,
  firstClassEvidenceId,
} from "./release-observation-adapter";

export type ForecastOutcomeBindingErrorCode =
  | "invalid-dataset"
  | "invalid-source"
  | "source-dataset-mismatch"
  | "ambiguous-evidence"
  | "missing-evidence"
  | "chronology-mismatch"
  | "row-limit";

export class ForecastOutcomeBindingError extends Error {
  constructor(public readonly code: ForecastOutcomeBindingErrorCode) {
    super(`Forecast outcome binding failed: ${code}.`);
    this.name = "ForecastOutcomeBindingError";
  }
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function observationInstant(
  value: unknown,
  fallback: string,
): string {
  // Sanity projections represent an absent optional scalar as null. Treat
  // null and undefined as the same conservative snapshot-time fallback.
  if (value === undefined || value === null) return fallback;
  if (!canonicalInstant(value)) {
    throw new ForecastOutcomeBindingError("invalid-source");
  }
  return value;
}

function addBinding(
  bindings: Map<string, string>,
  ambiguous: Set<string>,
  evidenceId: string | null,
  firstObservedAt: string,
): void {
  if (!evidenceId) return;
  if (bindings.has(evidenceId)) {
    ambiguous.add(evidenceId);
    return;
  }
  bindings.set(evidenceId, firstObservedAt);
}

function validatedSource(
  source: PublishedHistoricalReleaseSource,
  issuedAt: string,
): PublishedHistoricalReleaseSource {
  try {
    return validatePublishedHistoricalReleaseSource(source, issuedAt);
  } catch (error) {
    if (error instanceof PublishedHistoricalReleaseSourceValidationError) {
      throw new ForecastOutcomeBindingError(error.code);
    }
    throw new ForecastOutcomeBindingError("invalid-source");
  }
}

function assertDatasetBuiltFromSource(
  source: PublishedHistoricalReleaseSource,
  dataset: HistoricalAnalysisDatasetV1,
): void {
  let rebuilt: HistoricalAnalysisDatasetV1;
  try {
    rebuilt = buildHistoricalAnalysisDataset({
      adapterResult: adaptReleaseObservations({
        asOfDate: dataset.provenance.sourceAsOfDate,
        issuedAt: dataset.provenance.sourceIssuedAt,
        releases: source.releases,
        events: source.events,
        compatibilityMilestones: source.compatibilityMilestones,
      }),
      releaseMetadata: source.releaseMetadata,
    });
  } catch {
    throw new ForecastOutcomeBindingError("invalid-source");
  }

  if (
    rebuilt.fingerprints.inputFingerprint !==
      dataset.fingerprints.inputFingerprint ||
    rebuilt.fingerprints.datasetFingerprint !==
      dataset.fingerprints.datasetFingerprint ||
    stableSerializeHistoricalAnalysis(rebuilt) !==
      stableSerializeHistoricalAnalysis(dataset)
  ) {
    throw new ForecastOutcomeBindingError("source-dataset-mismatch");
  }
}

/**
 * Derive exact score-outcome observation instants from the same bounded raw
 * source used to build a validated historical dataset. This function never
 * accepts caller-authored outcome IDs or timestamps.
 */
export function buildForecastOutcomeInstantBindings(
  source: PublishedHistoricalReleaseSource,
  dataset: HistoricalAnalysisDatasetV1,
): readonly ForecastOutcomeInstantBindingV1[] {
  if (validateHistoricalAnalysisDataset(dataset).length > 0) {
    throw new ForecastOutcomeBindingError("invalid-dataset");
  }
  const issuedAt = dataset.provenance.sourceIssuedAt;
  if (!canonicalInstant(issuedAt)) {
    throw new ForecastOutcomeBindingError("invalid-dataset");
  }
  const boundedSource = validatedSource(source, issuedAt);

  const sourceBindings = new Map<string, string>();
  const ambiguous = new Set<string>();
  for (const event of boundedSource.events) {
    if (
      typeof event.id !== "string" ||
      typeof event.releaseId !== "string" ||
      (event.stableEventId !== undefined &&
        event.stableEventId !== null &&
        typeof event.stableEventId !== "string")
    ) {
      throw new ForecastOutcomeBindingError("invalid-source");
    }
    const observedAt = observationInstant(event.firstObservedAt, issuedAt);
    if (observedAt > issuedAt) {
      throw new ForecastOutcomeBindingError("chronology-mismatch");
    }
    addBinding(
      sourceBindings,
      ambiguous,
      firstClassEvidenceId(event),
      observedAt,
    );
  }
  for (const milestone of boundedSource.compatibilityMilestones) {
    if (
      typeof milestone.id !== "string" ||
      typeof milestone.releaseId !== "string"
    ) {
      throw new ForecastOutcomeBindingError("invalid-source");
    }
    const observedAt = observationInstant(milestone.firstObservedAt, issuedAt);
    if (observedAt > issuedAt) {
      throw new ForecastOutcomeBindingError("chronology-mismatch");
    }
    const evidenceId = compatibilityEvidenceId(
      milestone.releaseId,
      milestone.id,
    );
    addBinding(sourceBindings, ambiguous, evidenceId, observedAt);
  }

  const releases = new Map<
    string,
    (typeof boundedSource.releases)[number]
  >();
  for (const release of boundedSource.releases) {
    if (typeof release.id !== "string" || releases.has(release.id)) {
      throw new ForecastOutcomeBindingError("ambiguous-evidence");
    }
    if (release.statusFirstObservedAt !== undefined) {
      const observedAt = observationInstant(
        release.statusFirstObservedAt,
        issuedAt,
      );
      if (observedAt > issuedAt) {
        throw new ForecastOutcomeBindingError("chronology-mismatch");
      }
    }
    releases.set(release.id, release);
  }
  if (ambiguous.size > 0) {
    throw new ForecastOutcomeBindingError("ambiguous-evidence");
  }
  assertDatasetBuiltFromSource(boundedSource, dataset);

  const required = new Map<string, string>();
  for (const event of dataset.canonicalEvents) {
    required.set(event.eventId, event.firstObservedOn);
  }
  for (const outcome of dataset.lifecycleOutcomes) {
    const release = releases.get(outcome.releaseId);
    if (!release || outcome.outcomeEvidenceId !== `release:${outcome.releaseId}:outcome`) {
      throw new ForecastOutcomeBindingError("missing-evidence");
    }
    const observedAt = observationInstant(
      release.statusFirstObservedAt,
      issuedAt,
    );
    sourceBindings.set(outcome.outcomeEvidenceId, observedAt);
    required.set(outcome.outcomeEvidenceId, outcome.firstObservedOn);
  }

  if (required.size > FORECAST_OUTCOME_BINDING_MAX_ROWS) {
    throw new ForecastOutcomeBindingError("row-limit");
  }
  const result = [...required.entries()]
    .sort(([left], [right]) => compareText(left, right))
    .map(([evidenceId, firstObservedOn]) => {
      const firstObservedAt = sourceBindings.get(evidenceId);
      if (!firstObservedAt) {
        throw new ForecastOutcomeBindingError("missing-evidence");
      }
      if (
        firstObservedAt.slice(0, 10) !== firstObservedOn ||
        firstObservedAt > issuedAt
      ) {
        throw new ForecastOutcomeBindingError("chronology-mismatch");
      }
      const binding = {
        bindingVersion: "forecast-outcome-instant-binding/v1" as const,
        evidenceId,
        firstObservedAt,
      };
      if (validateForecastOutcomeInstantBinding(binding).length > 0) {
        throw new ForecastOutcomeBindingError("invalid-source");
      }
      return binding;
    });
  return result;
}
