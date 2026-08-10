import {
  FORECAST_INTERVAL_ROUNDING_RULE,
  FORECAST_NEXT_EVENT_POINT_ESTIMATOR,
  FORECAST_POINTER_PATH,
  activateForecastPointer,
  buildForecastArtifact,
  commitForecastArtifactTransition,
  forecastPointerWithCandidate,
  initializeForecastPointer,
  parseForecastArtifact,
  parseForecastPointer,
  rawArtifactDigest,
  reconciliationRootArtifactPath,
  serializeForecastArtifact,
  type ForecastArtifactAvailabilityReason,
  type ForecastArtifactDraftV1,
  type ForecastArtifactCohortV1,
  type ForecastArtifactIntervalV1,
  type ForecastArtifactTargetV1,
  type ForecastArtifactV1,
  type ForecastContractStorage,
  type ForecastPointerV1,
  type ReconciliationRootValidator,
} from "./forecast-artifact-contracts";
import {
  buildHistoricalAnalysisDataset,
  historicalAnalysisFingerprint,
  type HistoricalAnalysisDatasetV1,
  type HistoricalCanonicalEventRow,
  type HistoricalReleaseCycleRow,
} from "./historical-analysis-dataset";
import {
  buildNextEligiblePrereleaseEventModel,
  eligiblePrereleaseStage,
  predictNextEligiblePrereleaseEvent,
  type NextEligiblePrereleaseEventModelV1,
} from "./next-eligible-prerelease-event";
import {
  RELEASE_DATE_CANDIDATES,
  buildReleaseDateCandidates,
  type ReleaseDateCandidateId,
  type ReleaseDateCandidatesV1,
} from "./release-date-candidates";
import {
  buildReleaseDateIntervalCalibration,
  calibrateActiveReleaseDateForecast,
  type ReleaseDateCalibratedIntervalV1,
  type ReleaseDateIntervalCalibrationV1,
} from "./release-date-interval-calibration";
import { adaptReleaseObservations } from "./release-observation-adapter";
import {
  FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
  FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS,
  FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_METADATA,
  FORECAST_SHADOW_MAX_SOURCE_NODES,
  FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS,
  FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES,
  validatePublishedHistoricalReleaseSource,
  type PublishedHistoricalReleaseSource,
} from "./historical-release-source";
import { buildWalkForwardEvaluation } from "./walk-forward-evaluation";

export {
  FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
  FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS,
  FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_METADATA,
  FORECAST_SHADOW_MAX_SOURCE_NODES,
  FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS,
  FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES,
};

export const FORECAST_SHADOW_PIPELINE_VERSION = "forecast-shadow-pipeline/v1";
export const FORECAST_SHADOW_OPERATIONAL_MAX_BYTES = 262_144;
export const FORECAST_SHADOW_MAX_POINTER_TRANSITIONS = 12;

const pipelineCodeManifest = {
  version: FORECAST_SHADOW_PIPELINE_VERSION,
  algorithm:
    "published-snapshot;exact-request-instant-cutoff;bounded-runtime-source;explicit-sidecar;latest-complete-active-anchor;public-and-next-event-models;exact-estimator;immutable-first;full-pointer-preflight;generation-and-fingerprint-cas;prior-active-preserved",
  operationalArtifactMaxBytes: FORECAST_SHADOW_OPERATIONAL_MAX_BYTES,
  sourceContract: {
    canonicalMaxBytes: FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
    compatibilityMilestones:
      FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
    evidenceIdMaxBytes: FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES,
    evidenceIdsPerField: FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS,
    events: FORECAST_SHADOW_MAX_SOURCE_EVENTS,
    metadata: FORECAST_SHADOW_MAX_SOURCE_METADATA,
    nodes: FORECAST_SHADOW_MAX_SOURCE_NODES,
    observations: FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS,
    releases: FORECAST_SHADOW_MAX_SOURCE_RELEASES,
    stringMaxBytes: FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES,
  },
} as const;

export const FORECAST_SHADOW_PIPELINE_CODE_FINGERPRINT =
  historicalAnalysisFingerprint(pipelineCodeManifest);

const encoder = new TextEncoder();
const isoDay = /^\d{4}-\d{2}-\d{2}$/;

export interface ForecastShadowPipelineRequest {
  requestedAt: string;
  scheduledFor: string;
}

export interface ForecastShadowPipelineDependencies {
  storage: ForecastContractStorage;
  fetchPublishedSource: () => Promise<PublishedHistoricalReleaseSource>;
  validateReconciliationRoot?: ReconciliationRootValidator;
}

export interface ForecastShadowPipelineResult {
  status: "activated" | "already-active";
  scheduledFor: string;
  artifactId: string;
  runKey: string;
  targetCount: number;
  availableTargetCount: number;
}

export class ForecastShadowPipelineError extends Error {
  constructor(
    public readonly code:
      | "invalid-request"
      | "invalid-source"
      | "invalid-storage"
      | "artifact-too-large"
      | "transition-conflict",
  ) {
    super(`Forecast shadow pipeline failed: ${code}.`);
    this.name = "ForecastShadowPipelineError";
  }
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareText);
}

function validInstant(value: string): boolean {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function validDay(value: string): boolean {
  if (!isoDay.test(value)) return false;
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
    !validInstant(request.requestedAt) ||
    !validDay(request.scheduledFor) ||
    request.requestedAt.slice(0, 10) !== request.scheduledFor
  ) {
    throw new ForecastShadowPipelineError("invalid-request");
  }
}

function assertSource(
  source: PublishedHistoricalReleaseSource,
  requestedAt: string,
): PublishedHistoricalReleaseSource {
  try {
    return validatePublishedHistoricalReleaseSource(source, requestedAt);
  } catch {
    throw new ForecastShadowPipelineError("invalid-source");
  }
}

function addDays(value: string, days: number): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

function evidenceForDataset(dataset: HistoricalAnalysisDatasetV1): string[] {
  return uniqueSorted([
    ...dataset.releaseCycles.flatMap((row) => row.sourceEvidenceIds),
    ...dataset.canonicalEvents.flatMap((row) => row.sourceEvidenceIds),
    ...dataset.lifecycleOutcomes.flatMap((row) => row.sourceEvidenceIds),
    ...dataset.inclusionLedger.flatMap((row) => row.sourceEvidenceIds),
  ]);
}

function evidenceForTarget(
  cycle: HistoricalReleaseCycleRow,
  anchor: HistoricalCanonicalEventRow,
): string[] {
  return uniqueSorted([...cycle.sourceEvidenceIds, ...anchor.sourceEvidenceIds]);
}

function orderedCycleEvents(
  dataset: HistoricalAnalysisDatasetV1,
  releaseId: string,
): HistoricalCanonicalEventRow[] {
  return dataset.canonicalEvents
    .filter(
      (event) =>
        event.releaseId === releaseId &&
        event.occurredOn <= dataset.provenance.sourceAsOfDate &&
        event.firstObservedOn <= dataset.provenance.sourceAsOfDate,
    )
    .sort(
      (left, right) =>
        compareText(left.occurredOn, right.occurredOn) ||
        (left.sameDayOrder ?? Number.MAX_SAFE_INTEGER) -
          (right.sameDayOrder ?? Number.MAX_SAFE_INTEGER) ||
        compareText(left.eventId, right.eventId),
    );
}

function unavailableCohort() {
  return {
    modelCohortId: "unavailable",
    modelTrainingCount: 0,
    calibrationPoolId: "unavailable",
    calibrationResidualCount: 0,
  } as const;
}

function targetBase(
  targetKind: "public-release" | "next-eligible-prerelease-event",
  cycle: HistoricalReleaseCycleRow,
  anchor: HistoricalCanonicalEventRow,
  dataset: HistoricalAnalysisDatasetV1,
  modelFingerprint: string,
  calibrationFingerprint: string,
) {
  return {
    targetId: `${targetKind}:${cycle.releaseId}:${anchor.eventId}:${dataset.provenance.sourceAsOfDate}`,
    releaseId: cycle.releaseId,
    platformId: cycle.platformId,
    anchorEventId: anchor.eventId,
    anchorStage: anchor.stage,
    anchorOccurredOn: anchor.occurredOn,
    originOn: dataset.provenance.sourceAsOfDate,
    sourceEvidenceIds: evidenceForTarget(cycle, anchor),
    modelFingerprint,
    calibrationFingerprint,
  } as const;
}

function unavailablePublicTarget(
  base: ReturnType<typeof targetBase>,
  reason: ForecastArtifactAvailabilityReason,
  cohort: ForecastArtifactCohortV1 = unavailableCohort(),
): ForecastArtifactTargetV1 {
  return {
    ...base,
    targetKind: "public-release",
    availability: "unavailable",
    reason,
    cohort,
  };
}

function publicInterval(
  interval: Extract<ReleaseDateCalibratedIntervalV1, { available: true }>,
): ForecastArtifactIntervalV1 {
  return {
    level: interval.level,
    residualCount: interval.residualCount,
    rank: interval.rank,
    quantileResidualDays: interval.quantileResidualDays,
    lowerDays: interval.lowerDays,
    pointDays: interval.pointDays,
    upperDays: interval.upperDays,
    lowerCalendarDate: interval.calendarDates.lower,
    pointCalendarDate: interval.calendarDates.point,
    upperCalendarDate: interval.calendarDates.upper,
  };
}

function buildPublicTarget(
  cycle: HistoricalReleaseCycleRow,
  anchor: HistoricalCanonicalEventRow,
  dataset: HistoricalAnalysisDatasetV1,
  candidates: ReleaseDateCandidatesV1,
  calibration: ReleaseDateIntervalCalibrationV1,
): ForecastArtifactTargetV1 {
  const base = targetBase(
    "public-release",
    cycle,
    anchor,
    dataset,
    candidates.fingerprints.resultFingerprint,
    calibration.fingerprints.resultFingerprint,
  );
  const calibrated = calibrateActiveReleaseDateForecast(
    dataset,
    anchor.eventId,
    candidates,
    calibration,
  );
  if (!calibrated?.forecast.selection.available || !calibrated.forecast.resolved) {
    return unavailablePublicTarget(base, "insufficient-model-history");
  }
  const selected = calibrated.forecast.candidates.find(
    (candidate) =>
      candidate.candidateId === calibrated.candidateId && candidate.available,
  );
  if (!selected?.available) {
    return unavailablePublicTarget(base, "insufficient-model-history");
  }
  const pointEstimator = RELEASE_DATE_CANDIDATES.includes(
    calibrated.candidateId as ReleaseDateCandidateId,
  )
    ? (calibrated.candidateId as ReleaseDateCandidateId)
    : null;
  if (!pointEstimator) {
    return unavailablePublicTarget(base, "invalid-source-evidence");
  }
  const fifty = calibrated.intervals.find(
    (interval) => interval.level === 0.5,
  );
  const eighty = calibrated.intervals.find(
    (interval) => interval.level === 0.8,
  );
  const cohort = {
    modelCohortId: calibrated.cohortPathId,
    modelTrainingCount: selected.trainingTargetIds.length,
    calibrationPoolId: `${pointEstimator}:${calibrated.residualPool.selectedPool}:${calibrated.cohortPathId}`,
    calibrationResidualCount: calibrated.residualPool.selectedResiduals.length,
  };
  if (!fifty?.available || !eighty?.available) {
    return unavailablePublicTarget(
      base,
      "insufficient-calibration-history",
      cohort,
    );
  }
  return {
    ...base,
    targetKind: "public-release",
    availability: "available",
    cohort,
    prediction: {
      pointEstimator,
      pointDays: calibrated.forecast.resolved.pointDays,
      pointCalendarDate: calibrated.forecast.resolved.publicReleaseDate,
      roundingRule: FORECAST_INTERVAL_ROUNDING_RULE,
      intervals: [publicInterval(fifty), publicInterval(eighty)],
    },
  };
}

type ActiveNextForecast = NonNullable<
  ReturnType<typeof predictNextEligiblePrereleaseEvent>
>;

function nextUnavailableReason(
  forecast: ActiveNextForecast | null,
): ForecastArtifactAvailabilityReason {
  if (!forecast) return "ambiguous-chronology";
  if (!forecast.stage.available) {
    return forecast.stage.reason === "nonunique-or-weak-mode"
      ? "weak-next-stage-mode"
      : "insufficient-model-history";
  }
  if (!forecast.timing.available) return "insufficient-model-history";
  return "insufficient-calibration-history";
}

function nextInterval(
  anchorOccurredOn: string,
  interval: Extract<ActiveNextForecast["intervals"][number], { available: true }>,
): ForecastArtifactIntervalV1 {
  return {
    level: interval.level,
    residualCount: interval.residualCount,
    rank: interval.rank,
    quantileResidualDays: interval.quantileResidualDays,
    lowerDays: interval.lowerDays,
    pointDays: interval.pointDays,
    upperDays: interval.upperDays,
    lowerCalendarDate: addDays(anchorOccurredOn, Math.floor(interval.lowerDays)),
    pointCalendarDate: addDays(
      anchorOccurredOn,
      Math.floor(interval.pointDays + 0.5),
    ),
    upperCalendarDate: addDays(anchorOccurredOn, Math.ceil(interval.upperDays)),
  };
}

function buildNextTarget(
  cycle: HistoricalReleaseCycleRow,
  anchor: HistoricalCanonicalEventRow,
  dataset: HistoricalAnalysisDatasetV1,
  model: NextEligiblePrereleaseEventModelV1,
): ForecastArtifactTargetV1 {
  const base = targetBase(
    "next-eligible-prerelease-event",
    cycle,
    anchor,
    dataset,
    model.fingerprints.resultFingerprint,
    model.fingerprints.resultFingerprint,
  );
  const forecast = predictNextEligiblePrereleaseEvent(
    dataset,
    cycle.releaseId,
    model,
  );
  const cohort =
    forecast?.timing.available && forecast.stage.available
      ? {
          modelCohortId: forecast.timing.cohort,
          modelTrainingCount: forecast.timing.trainingTargetIds.length,
          calibrationPoolId: forecast.residualPool.selectedPool,
          calibrationResidualCount: forecast.residualPool.residualTargetIds.length,
        }
      : unavailableCohort();
  const fifty = forecast?.intervals.find((interval) => interval.level === 0.5);
  const eighty = forecast?.intervals.find((interval) => interval.level === 0.8);
  if (
    !forecast?.stage.available ||
    !forecast.timing.available ||
    !fifty?.available ||
    !eighty?.available
  ) {
    return {
      ...base,
      targetKind: "next-eligible-prerelease-event",
      availability: "unavailable",
      reason: nextUnavailableReason(forecast),
      cohort,
    };
  }
  return {
    ...base,
    targetKind: "next-eligible-prerelease-event",
    availability: "available",
    predictedEligibleStage: forecast.stage.predictedEligibleStage,
    cohort,
    prediction: {
      pointEstimator: FORECAST_NEXT_EVENT_POINT_ESTIMATOR,
      pointDays: forecast.timing.pointDays,
      pointCalendarDate: addDays(
        anchor.occurredOn,
        Math.floor(forecast.timing.pointDays + 0.5),
      ),
      roundingRule: FORECAST_INTERVAL_ROUNDING_RULE,
      intervals: [
        nextInterval(anchor.occurredOn, fifty),
        nextInterval(anchor.occurredOn, eighty),
      ],
    },
  };
}

function buildTargetsAndExclusions(
  dataset: HistoricalAnalysisDatasetV1,
  candidates: ReleaseDateCandidatesV1,
  calibration: ReleaseDateIntervalCalibrationV1,
  nextModel: NextEligiblePrereleaseEventModelV1,
): Pick<ForecastArtifactDraftV1, "targets" | "exclusions"> {
  const targets: ForecastArtifactTargetV1[] = [];
  const exclusions: ForecastArtifactDraftV1["exclusions"][number][] = [];
  const active = dataset.releaseCycles
    .filter((cycle) => cycle.included && cycle.lifecycle === "active")
    .sort((left, right) => compareText(left.releaseId, right.releaseId));

  const exclude = (
    cycle: HistoricalReleaseCycleRow,
    targetKind: "public-release" | "next-eligible-prerelease-event",
    reason: string,
  ) => {
    exclusions.push({
      exclusionId: `${targetKind}:${cycle.releaseId}:${dataset.provenance.sourceAsOfDate}`,
      targetKind,
      targetId: null,
      reason,
      sourceEvidenceIds: uniqueSorted(cycle.sourceEvidenceIds),
    });
  };

  for (const cycle of active) {
    if (cycle.chronologyCoverage.state !== "complete") {
      exclude(cycle, "public-release", "chronology-coverage-unknown");
      exclude(
        cycle,
        "next-eligible-prerelease-event",
        "chronology-coverage-unknown",
      );
      continue;
    }
    const anchor = orderedCycleEvents(dataset, cycle.releaseId).at(-1);
    if (!anchor) {
      exclude(cycle, "public-release", "no-canonical-anchor");
      exclude(
        cycle,
        "next-eligible-prerelease-event",
        "no-canonical-anchor",
      );
      continue;
    }
    if (anchor.stage === "public-release") {
      exclude(cycle, "public-release", "public-release-already-observed");
    } else {
      targets.push(
        buildPublicTarget(cycle, anchor, dataset, candidates, calibration),
      );
    }
    if (eligiblePrereleaseStage(anchor.stage)) {
      targets.push(buildNextTarget(cycle, anchor, dataset, nextModel));
    } else {
      exclude(
        cycle,
        "next-eligible-prerelease-event",
        "terminal-or-ineligible-latest-event",
      );
    }
  }
  return { targets, exclusions };
}

export function buildForecastShadowArtifact(
  request: ForecastShadowPipelineRequest,
  rawSource: PublishedHistoricalReleaseSource,
): ForecastArtifactV1 {
  assertRequest(request);
  const source = assertSource(rawSource, request.requestedAt);
  const adapterResult = adaptReleaseObservations({
    asOfDate: request.scheduledFor,
    issuedAt: request.requestedAt,
    releases: source.releases,
    events: source.events,
    compatibilityMilestones: source.compatibilityMilestones,
  });
  const dataset = buildHistoricalAnalysisDataset({
    adapterResult,
    releaseMetadata: source.releaseMetadata,
  });
  const evaluation = buildWalkForwardEvaluation(dataset);
  const candidates = buildReleaseDateCandidates(dataset);
  const calibration = buildReleaseDateIntervalCalibration(candidates);
  const nextModel = buildNextEligiblePrereleaseEventModel(dataset);
  const { targets, exclusions } = buildTargetsAndExclusions(
    dataset,
    candidates,
    calibration,
    nextModel,
  );
  const artifact = buildForecastArtifact({
    generatedAt: request.requestedAt,
    runIdentity: {
      version: "forecast-run-identity/v1",
      pipeline: "daily-shadow",
      scheduledFor: request.scheduledFor,
    },
    provenance: {
      sourceAsOfDate: dataset.provenance.sourceAsOfDate,
      sourceIssuedAt: dataset.provenance.sourceIssuedAt,
      sourceEvidenceIds: evidenceForDataset(dataset),
      historicalDataset: {
        version: dataset.datasetVersion,
        fingerprint: dataset.fingerprints.datasetFingerprint,
      },
      evaluation: {
        version: evaluation.evaluationVersion,
        fingerprint: evaluation.fingerprints.evaluationFingerprint,
      },
      publicReleaseModel: {
        version: candidates.candidatesVersion,
        fingerprint: candidates.fingerprints.resultFingerprint,
      },
      publicReleaseCalibration: {
        version: calibration.calibrationVersion,
        fingerprint: calibration.fingerprints.resultFingerprint,
      },
      nextEventModel: {
        version: nextModel.modelVersion,
        fingerprint: nextModel.fingerprints.resultFingerprint,
      },
      nextEventCalibration: {
        version: nextModel.modelVersion,
        fingerprint: nextModel.fingerprints.resultFingerprint,
      },
      codeFingerprint: FORECAST_SHADOW_PIPELINE_CODE_FINGERPRINT,
    },
    targets,
    metrics: [],
    exclusions,
  });
  if (
    encoder.encode(serializeForecastArtifact(artifact)).byteLength >
    FORECAST_SHADOW_OPERATIONAL_MAX_BYTES
  ) {
    throw new ForecastShadowPipelineError("artifact-too-large");
  }
  return artifact;
}

async function readPointer(
  storage: ForecastContractStorage,
): Promise<ForecastPointerV1 | null> {
  const bytes = await storage.readExact(FORECAST_POINTER_PATH);
  if (!bytes) return null;
  try {
    return parseForecastPointer(bytes);
  } catch {
    throw new ForecastShadowPipelineError("invalid-storage");
  }
}

async function readArtifact(
  storage: ForecastContractStorage,
  artifactId: string,
): Promise<ForecastArtifactV1> {
  const bytes = await storage.readExact(`forecast/artifacts/${artifactId}.json`);
  if (!bytes) throw new ForecastShadowPipelineError("invalid-storage");
  try {
    if (bytes.byteLength > FORECAST_SHADOW_OPERATIONAL_MAX_BYTES) {
      throw new ForecastShadowPipelineError("invalid-storage");
    }
    const artifact = parseForecastArtifact(bytes);
    if (artifact.artifactId !== artifactId) {
      throw new ForecastShadowPipelineError("invalid-storage");
    }
    return artifact;
  } catch (error) {
    if (error instanceof ForecastShadowPipelineError) throw error;
    throw new ForecastShadowPipelineError("invalid-storage");
  }
}

function compatibleStoredArtifact(
  left: ForecastArtifactV1,
  right: ForecastArtifactV1,
): boolean {
  return (
    left.artifactVersion === right.artifactVersion &&
    left.mode === right.mode &&
    left.provenance.historicalDataset.version ===
      right.provenance.historicalDataset.version &&
    left.provenance.evaluation.version ===
      right.provenance.evaluation.version &&
    left.provenance.publicReleaseModel.version ===
      right.provenance.publicReleaseModel.version &&
    left.provenance.publicReleaseCalibration.version ===
      right.provenance.publicReleaseCalibration.version &&
    left.provenance.nextEventModel.version ===
      right.provenance.nextEventModel.version &&
    left.provenance.nextEventCalibration.version ===
      right.provenance.nextEventCalibration.version
  );
}

interface ValidatedPointerArtifacts {
  active: ForecastArtifactV1 | null;
  candidate: ForecastArtifactV1 | null;
  rollback: ForecastArtifactV1 | null;
}

async function validatePointerReferences(
  request: ForecastShadowPipelineRequest,
  pointer: ForecastPointerV1,
  dependencies: ForecastShadowPipelineDependencies,
): Promise<ValidatedPointerArtifacts> {
  const artifacts: ValidatedPointerArtifacts = {
    active: null,
    candidate: null,
    rollback: null,
  };
  let compatibilityAnchor: ForecastArtifactV1 | null = null;

  for (const name of ["active", "candidate", "rollback"] as const) {
    const artifactId = pointer[`${name}ArtifactId`];
    if (!artifactId) continue;
    const artifact = await readArtifact(dependencies.storage, artifactId);
    if (
      artifact.runIdentity.scheduledFor > request.scheduledFor ||
      artifact.generatedAt > request.requestedAt ||
      artifact.provenance.sourceIssuedAt > request.requestedAt ||
      artifact.generatedAt.slice(0, 10) !==
        artifact.runIdentity.scheduledFor ||
      artifact.provenance.sourceAsOfDate !==
        artifact.runIdentity.scheduledFor ||
      artifact.provenance.sourceIssuedAt !== artifact.generatedAt ||
      (compatibilityAnchor &&
        !compatibleStoredArtifact(compatibilityAnchor, artifact))
    ) {
      throw new ForecastShadowPipelineError("invalid-storage");
    }
    compatibilityAnchor ??= artifact;
    artifacts[name] = artifact;
  }

  if (pointer.reconciliationRootArtifactId) {
    const rootId = pointer.reconciliationRootArtifactId;
    const validator = dependencies.validateReconciliationRoot;
    if (!validator) throw new ForecastShadowPipelineError("invalid-storage");
    try {
      const bytes = await dependencies.storage.readExact(
        reconciliationRootArtifactPath(rootId),
      );
      if (
        !bytes ||
        rawArtifactDigest(bytes) !== rootId ||
        !validator(bytes, rootId)
      ) {
        throw new ForecastShadowPipelineError("invalid-storage");
      }
    } catch (error) {
      if (error instanceof ForecastShadowPipelineError) throw error;
      throw new ForecastShadowPipelineError("invalid-storage");
    }
  }

  return artifacts;
}

function updateInstant(requestedAt: string, previous?: ForecastPointerV1): string {
  const previousNext = previous
    ? new Date(previous.updatedAt).getTime() + 1
    : Number.NEGATIVE_INFINITY;
  return new Date(
    Math.max(new Date(requestedAt).getTime(), previousNext),
  ).toISOString();
}

function resultFor(
  status: ForecastShadowPipelineResult["status"],
  artifact: ForecastArtifactV1,
): ForecastShadowPipelineResult {
  return {
    status,
    scheduledFor: artifact.runIdentity.scheduledFor,
    artifactId: artifact.artifactId,
    runKey: artifact.runKey,
    targetCount: artifact.targets.length,
    availableTargetCount: artifact.targets.filter(
      (target) => target.availability === "available",
    ).length,
  };
}

async function commitOrConflict(
  dependencies: ForecastShadowPipelineDependencies,
  previous: ForecastPointerV1 | null,
  next: ForecastPointerV1,
  artifact?: ForecastArtifactV1,
): Promise<"committed" | "conflict"> {
  if (previous?.reconciliationRootArtifactId && !dependencies.validateReconciliationRoot) {
    throw new ForecastShadowPipelineError("invalid-storage");
  }
  const result = await commitForecastArtifactTransition({
    storage: dependencies.storage,
    previous,
    next,
    ...(artifact ? { artifact } : {}),
    ...(dependencies.validateReconciliationRoot
      ? { validateReconciliationRoot: dependencies.validateReconciliationRoot }
      : {}),
  });
  if (result.committed) return "committed";
  if (result.reason === "stale-cas") return "conflict";
  throw new ForecastShadowPipelineError("invalid-storage");
}

/**
 * Run one bounded immutable-first state machine. Exact pointer CAS is the
 * cross-instance overlap lock; an existing active artifact for the scheduled
 * day wins over later retries or source drift.
 */
export async function runForecastShadowPipeline(
  request: ForecastShadowPipelineRequest,
  dependencies: ForecastShadowPipelineDependencies,
): Promise<ForecastShadowPipelineResult> {
  assertRequest(request);
  let builtArtifact: ForecastArtifactV1 | null = null;

  for (
    let transition = 0;
    transition < FORECAST_SHADOW_MAX_POINTER_TRANSITIONS;
    transition += 1
  ) {
    const pointer = await readPointer(dependencies.storage);
    if (!pointer) {
      const initialized = initializeForecastPointer(
        updateInstant(request.requestedAt),
      );
      if (
        (await commitOrConflict(dependencies, null, initialized)) === "conflict"
      ) {
        continue;
      }
      continue;
    }

    const references = await validatePointerReferences(
      request,
      pointer,
      dependencies,
    );

    if (references.active) {
      const active = references.active;
      if (active.runIdentity.scheduledFor === request.scheduledFor) {
        return resultFor("already-active", active);
      }
    }

    if (references.candidate) {
      const candidate = references.candidate;
      if (candidate.runIdentity.scheduledFor === request.scheduledFor) {
        const activated = activateForecastPointer(
          pointer,
          updateInstant(request.requestedAt, pointer),
        );
        if (
          (await commitOrConflict(dependencies, pointer, activated)) ===
          "conflict"
        ) {
          continue;
        }
        return resultFor("activated", candidate);
      }
    }

    if (!builtArtifact) {
      const source = await dependencies.fetchPublishedSource();
      builtArtifact = buildForecastShadowArtifact(request, source);
    }
    const withCandidate = forecastPointerWithCandidate(
      pointer,
      builtArtifact.artifactId,
      updateInstant(request.requestedAt, pointer),
    );
    if (
      (await commitOrConflict(
        dependencies,
        pointer,
        withCandidate,
        builtArtifact,
      )) === "conflict"
    ) {
      continue;
    }
  }
  throw new ForecastShadowPipelineError("transition-conflict");
}
