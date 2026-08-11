import {
  FORECAST_POINTER_PATH,
  forecastArtifactPath,
  parseForecastArtifact,
  parseForecastPointer,
  type ForecastArtifactV1,
  type ForecastContractStorage,
  type ForecastPointerV1,
  type ReconciliationRootValidator,
} from "./forecast-artifact-contracts";
import { buildForecastOutcomeInstantBindings } from "./forecast-outcome-bindings";
import {
  buildForecastShadowHealthReport,
  commitForecastScoreReconciliation,
  validateForecastShadowEvaluationEpoch,
  type ForecastShadowEvaluationEpochV1,
  type ForecastShadowHealthReportV1,
} from "./forecast-shadow-scoring";
import {
  runForecastShadowPipeline,
  type ForecastShadowPipelineRequest,
  type ForecastShadowPipelineResult,
} from "./forecast-shadow-pipeline";
import {
  validatePublishedForecastShadowSource,
  type PublishedForecastShadowSource,
} from "./historical-release-source";
import { buildHistoricalAnalysisDatasetFromPublishedSource } from "./forecast-runtime-cohort";

/** A lost pointer race may safely retry the immutable reconciliation write. */
export const FORECAST_SHADOW_RECONCILIATION_MAX_POINTER_RETRIES = 3;

export type ForecastShadowReconciledRunErrorCode =
  | "invalid-evaluation-epoch"
  | "invalid-request"
  | "invalid-source"
  | "invalid-storage"
  | "pointer-conflict"
  | "reconciliation-failed";

export class ForecastShadowReconciledRunError extends Error {
  constructor(public readonly code: ForecastShadowReconciledRunErrorCode) {
    super(`Forecast shadow reconciliation run failed: ${code}.`);
  }
}

export interface ForecastShadowReconciledRunDependencies {
  storage: ForecastContractStorage;
  fetchPublishedSource: () => Promise<PublishedForecastShadowSource>;
  evaluationEpoch: ForecastShadowEvaluationEpochV1;
  validateReconciliationRoot?: ReconciliationRootValidator;
}

/** A truthfully empty generation day still reconciles prior forecast outcomes. */
export interface ForecastShadowGenerationSkippedResult {
  status: "skipped-no-active-cycles";
  scheduledFor: string;
  artifactId: null;
  runKey: null;
  targetCount: 0;
  availableTargetCount: 0;
}

export interface ForecastShadowReconciledRunResult {
  pipeline:
    ForecastShadowPipelineResult | ForecastShadowGenerationSkippedResult;
  reconciliation: {
    changed: boolean;
    reconciliationRootArtifactId: string;
    newScoreArtifactIds: readonly string[];
  };
  health: ForecastShadowHealthReportV1;
}

function canonicalInstant(value: string): boolean {
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString() === value;
}

function canonicalUtcDay(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function assertRequest(request: ForecastShadowPipelineRequest): void {
  if (
    !canonicalInstant(request.requestedAt) ||
    !canonicalUtcDay(request.scheduledFor) ||
    request.requestedAt.slice(0, 10) !== request.scheduledFor
  ) {
    throw new ForecastShadowReconciledRunError("invalid-request");
  }
}

function nextPointerInstant(
  requestedAt: string,
  pointer: ForecastPointerV1,
): string {
  const requested = new Date(requestedAt).getTime();
  const prior = new Date(pointer.updatedAt).getTime();
  if (!Number.isFinite(requested) || !Number.isFinite(prior)) {
    throw new ForecastShadowReconciledRunError("invalid-storage");
  }
  return new Date(Math.max(requested, prior + 1)).toISOString();
}

async function readActiveForecast(
  storage: ForecastContractStorage,
): Promise<{ pointer: ForecastPointerV1; artifact: ForecastArtifactV1 }> {
  const pointerBytes = await storage.readExact(FORECAST_POINTER_PATH);
  if (!pointerBytes) {
    throw new ForecastShadowReconciledRunError("invalid-storage");
  }

  let pointer: ForecastPointerV1;
  try {
    pointer = parseForecastPointer(pointerBytes);
  } catch {
    throw new ForecastShadowReconciledRunError("invalid-storage");
  }
  if (!pointer.activeArtifactId) {
    throw new ForecastShadowReconciledRunError("invalid-storage");
  }

  const artifactBytes = await storage.readExact(
    forecastArtifactPath(pointer.activeArtifactId),
  );
  if (!artifactBytes) {
    throw new ForecastShadowReconciledRunError("invalid-storage");
  }
  try {
    const artifact = parseForecastArtifact(artifactBytes);
    if (artifact.artifactId !== pointer.activeArtifactId) {
      throw new ForecastShadowReconciledRunError("invalid-storage");
    }
    return { pointer, artifact };
  } catch (error) {
    if (error instanceof ForecastShadowReconciledRunError) throw error;
    throw new ForecastShadowReconciledRunError("invalid-storage");
  }
}

/**
 * Run the default-off private forecast pipeline and then reconcile its active
 * immutable forecast against the same bounded, source-backed snapshot. The
 * source promise is shared so a new forecast requires one Sanity read, while a
 * same-day retry still fetches one current snapshot for outcome reconciliation.
 */
export async function runForecastShadowWithReconciliation(
  request: ForecastShadowPipelineRequest,
  dependencies: ForecastShadowReconciledRunDependencies,
): Promise<ForecastShadowReconciledRunResult> {
  if (
    validateForecastShadowEvaluationEpoch(dependencies.evaluationEpoch).length
  ) {
    throw new ForecastShadowReconciledRunError("invalid-evaluation-epoch");
  }
  assertRequest(request);

  let sourcePromise: Promise<PublishedForecastShadowSource> | null = null;
  const fetchSource = (): Promise<PublishedForecastShadowSource> => {
    sourcePromise ??= dependencies.fetchPublishedSource().then((source) => {
      try {
        return validatePublishedForecastShadowSource(
          source,
          request.requestedAt,
        );
      } catch {
        throw new ForecastShadowReconciledRunError("invalid-source");
      }
    });
    return sourcePromise;
  };

  let source: PublishedForecastShadowSource;
  let sourceDataset: ReturnType<
    typeof buildHistoricalAnalysisDatasetFromPublishedSource
  >;
  let outcomeInstantBindings: ReturnType<
    typeof buildForecastOutcomeInstantBindings
  >;
  try {
    source = await fetchSource();
    sourceDataset = buildHistoricalAnalysisDatasetFromPublishedSource(source, {
      asOfDate: request.scheduledFor,
      issuedAt: request.requestedAt,
    });
    outcomeInstantBindings = buildForecastOutcomeInstantBindings(
      source,
      sourceDataset,
    );
  } catch {
    throw new ForecastShadowReconciledRunError("invalid-source");
  }

  const hasIncludedActiveCycle = sourceDataset.releaseCycles.some(
    (cycle) => cycle.included && cycle.lifecycle === "active",
  );
  const pipeline = hasIncludedActiveCycle
    ? await runForecastShadowPipeline(request, {
        storage: dependencies.storage,
        fetchPublishedSource: fetchSource,
        ...(dependencies.validateReconciliationRoot
          ? {
              validateReconciliationRoot:
                dependencies.validateReconciliationRoot,
            }
          : {}),
      })
    : {
        status: "skipped-no-active-cycles" as const,
        scheduledFor: request.scheduledFor,
        artifactId: null,
        runKey: null,
        targetCount: 0 as const,
        availableTargetCount: 0 as const,
      };

  for (
    let attempt = 0;
    attempt < FORECAST_SHADOW_RECONCILIATION_MAX_POINTER_RETRIES;
    attempt += 1
  ) {
    const { pointer, artifact } = await readActiveForecast(
      dependencies.storage,
    );
    if (
      artifact.generatedAt > request.requestedAt ||
      (pipeline.status === "skipped-no-active-cycles"
        ? artifact.runIdentity.scheduledFor > request.scheduledFor
        : artifact.runIdentity.scheduledFor !== request.scheduledFor)
    ) {
      throw new ForecastShadowReconciledRunError("pointer-conflict");
    }

    const updatedAt = nextPointerInstant(request.requestedAt, pointer);
    const committed = await commitForecastScoreReconciliation({
      storage: dependencies.storage,
      previousPointer: pointer,
      reconciliationCutoffAt: request.requestedAt,
      evaluationEpoch: dependencies.evaluationEpoch,
      updatedAt,
      forecastArtifacts: [artifact],
      sourceDataset,
      outcomeInstantBindings,
    });
    if (committed.committed) {
      const health = buildForecastShadowHealthReport({
        index: committed.reconciliation.index,
        reconciliationRootArtifactId: committed.reconciliation.indexArtifactId,
        generatedAt: committed.changed ? updatedAt : request.requestedAt,
      });
      return {
        pipeline,
        reconciliation: {
          changed: committed.changed,
          reconciliationRootArtifactId:
            committed.reconciliation.indexArtifactId,
          newScoreArtifactIds: committed.reconciliation.newScoreArtifactIds,
        },
        health,
      };
    }
    if (committed.reason === "stale-cas") continue;
    if (
      committed.reason === "missing-prior-root" ||
      committed.reason === "corrupt-prior-root" ||
      committed.reason === "missing-forecast-artifact" ||
      committed.reason === "corrupt-forecast-artifact" ||
      committed.reason === "incompatible-pointer" ||
      committed.reason === "storage-failure"
    ) {
      throw new ForecastShadowReconciledRunError("invalid-storage");
    }
    throw new ForecastShadowReconciledRunError("reconciliation-failed");
  }

  throw new ForecastShadowReconciledRunError("pointer-conflict");
}
