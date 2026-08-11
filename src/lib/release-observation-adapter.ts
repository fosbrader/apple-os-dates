import {
  FORECAST_ANALYSIS_CONTRACT_VERSION,
  forecastEventEligibility,
  type CanonicalForecastStage,
  type ForecastAnalysisAvailability,
  type ForecastAnalysisChannel,
  type ForecastAnalysisDatasetV1,
  type ForecastAnalysisEventV1,
  type ForecastAnalysisReleaseLifecycle,
  type ForecastAnalysisReleaseV1,
} from "./forecast-analysis-contracts";

/** A pure, storage-independent projection for forecast and historical inputs. */
export const RELEASE_OBSERVATION_ADAPTER_VERSION =
  "release-observation-adapter/v1";

export type ReleaseObservationInputErrorCode =
  | "invalid-as-of-date"
  | "invalid-issued-at";

/** Invalid global cutoffs cannot produce a contract-valid result. */
export class ReleaseObservationInputError extends Error {
  constructor(public readonly code: ReleaseObservationInputErrorCode) {
    super(`Release observation input is invalid: ${code}.`);
    this.name = "ReleaseObservationInputError";
  }
}

export interface ReleaseObservationVersionInput {
  /** Stable release-cycle identity, never a display version. */
  id: string;
  lifecycle?: ForecastAnalysisReleaseLifecycle;
  /** A released legacy version may supply its verified public-release date. */
  publicReleaseDate?: string;
  statusEffectiveOn?: string;
  /** First observation of the lifecycle fact, when separately known. */
  statusFirstObservedAt?: string | null;
}

export interface CompatibilityMilestoneInput {
  /** Stable legacy array key or migration identity. */
  id: string;
  releaseId: string;
  occurredOn: string;
  /**
   * Compatibility projections must already carry a canonical channel. Labels
   * are audit context only and are never parsed to establish identity.
   */
  channel?: ForecastAnalysisChannel;
  sequence?: number;
  sameDayOrder?: number;
  availability?: ForecastAnalysisAvailability;
  isRevision?: boolean;
  firstObservedAt?: string | null;
  displayLabel?: string;
  note?: string;
}

export interface FirstClassReleaseEventInput {
  /** Stable first-class event identity; it is preferred over document id. */
  stableEventId?: string;
  /** Stable source-document identity, used when stableEventId is unavailable. */
  id: string;
  releaseId: string;
  occurredOn: string;
  firstObservedAt?: string | null;
  channel: ForecastAnalysisChannel;
  sequence?: number;
  sameDayOrder?: number;
  availability?: ForecastAnalysisAvailability;
  isRevision?: boolean;
  /** Direct predecessor identity for a revision. */
  revisionOfId?: string;
  /** Schema-compatible replacement relation; resolved without label parsing. */
  replacesEventId?: string;
  replacedByEventId?: string;
  /** A verified GM may close a cycle before a public-release record exists. */
  closesReleaseCycle?: boolean;
  /** Stable compatibility identity explicitly represented by this event. */
  legacySourceId?: string;
  displayLabel?: string;
  note?: string;
}

export interface ReleaseObservationAdapterInput {
  asOfDate: string;
  /** Snapshot issuance time; a conservative fallback for missing observation time. */
  issuedAt: string;
  releases: readonly ReleaseObservationVersionInput[];
  events: readonly FirstClassReleaseEventInput[];
  compatibilityMilestones: readonly CompatibilityMilestoneInput[];
}

export type ReleaseObservationSource = "first-class" | "compatibility" | "release";

export type ReleaseObservationExclusionCode =
  | "invalid-as-of-date"
  | "invalid-issued-at"
  | "missing-evidence-id"
  | "duplicate-evidence-id"
  | "missing-release-id"
  | "duplicate-release-id"
  | "unknown-release-cycle"
  | "invalid-occurrence-date"
  | "invalid-first-observed-at"
  | "first-observed-before-occurrence"
  | "invalid-same-day-order"
  | "duplicate-same-day-order"
  | "unexpected-stage-sequence"
  | "future-occurrence"
  | "not-observed-by-cutoff"
  | "invalid-channel"
  | "invalid-availability"
  | "descriptive-channel"
  | "missing-canonical-stage"
  | "overlaid-by-first-class-event"
  | "unknown-replacement-target"
  | "multiple-replacement-targets"
  | "cross-stage-replacement"
  | "replaced-by-event"
  | "ambiguous-effective-stage"
  | "withdrawn"
  | "replaced"
  | "superseded"
  | "superseded-cycle"
  | "release-lifecycle-date-unknown"
  | "invalid-release-lifecycle"
  | "release-status-date-mismatch"
  | "invalid-release-outcome"
  | "not-released-by-cutoff";

export interface ReleaseObservationLedgerEntry {
  evidenceId: string;
  source: ReleaseObservationSource;
  releaseId: string;
  occurredOn?: string;
  stage?: CanonicalForecastStage;
  included: boolean;
  reason?: ReleaseObservationExclusionCode;
}

export interface ReleaseObservationExclusion {
  evidenceId: string;
  source: ReleaseObservationSource;
  releaseId: string;
  code: ReleaseObservationExclusionCode;
}

export interface CanonicalReleaseObservation extends ForecastAnalysisEventV1 {
  evidenceId: string;
  source: "first-class" | "compatibility";
  sourceEvidenceIds: readonly string[];
  stage: CanonicalForecastStage;
}

export interface ReleasedOutcome {
  evidenceId: string;
  releaseId: string;
  occurredOn: string;
  firstObservedOn: string;
  closure: "public-release" | "golden-master";
}

export interface ReleaseObservationAdapterResult {
  adapterVersion: typeof RELEASE_OBSERVATION_ADAPTER_VERSION;
  asOfDate: string;
  issuedAt: string;
  /** Validated, revision-collapsed input suitable for the v1 analysis contract. */
  dataset: ForecastAnalysisDatasetV1;
  effectiveEvents: readonly CanonicalReleaseObservation[];
  releasedOutcomes: readonly ReleasedOutcome[];
  inclusionLedger: readonly ReleaseObservationLedgerEntry[];
  exclusions: readonly ReleaseObservationExclusion[];
}

interface Candidate {
  evidenceId: string;
  source: "first-class" | "compatibility";
  sourceId: string;
  releaseId: string;
  occurredOn: string;
  firstObservedOn: string;
  channel: ForecastAnalysisChannel;
  sequence?: number;
  sameDayOrder?: number;
  availability: ForecastAnalysisAvailability;
  isRevision: boolean;
  replacesIds: string[];
  replacedByIds: string[];
  legacySourceId?: string;
  closesReleaseCycle: boolean;
  displayLabel?: string;
  note?: string;
  stage?: CanonicalForecastStage;
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const ISO_INSTANT =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;

function isIsoDay(value: string | undefined): value is string {
  if (!value || !ISO_DAY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function utcDay(value: string | null | undefined): string | null {
  if (
    !value ||
    !ISO_INSTANT.test(value) ||
    !isIsoDay(value.slice(0, 10))
  ) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function observedDay(
  value: string | null | undefined,
  issuedDay: string,
): string {
  return value === undefined || value === null
    ? issuedDay
    : (utcDay(value) ?? "");
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function candidateSort(left: Candidate, right: Candidate): number {
  return (
    compareText(left.releaseId, right.releaseId) ||
    compareText(left.occurredOn, right.occurredOn) ||
    compareText(left.evidenceId, right.evidenceId)
  );
}

/** Stable compatibility evidence identity; no display field participates. */
export function compatibilityEvidenceId(releaseId: string, id: string): string {
  return `legacy:${releaseId}:${id}`;
}

/** Stable first-class evidence identity; no display field participates. */
export function firstClassEvidenceId(
  event: Pick<FirstClassReleaseEventInput, "id" | "stableEventId">,
): string | null {
  const id = event.stableEventId?.trim() || event.id.trim();
  return id ? `event:${id}` : null;
}

function legacyIdMatches(
  releaseId: string,
  legacyId: string | undefined,
  milestoneId: string,
): boolean {
  if (!legacyId) return false;
  return (
    legacyId === milestoneId ||
    legacyId === `${releaseId}:${milestoneId}` ||
    legacyId === compatibilityEvidenceId(releaseId, milestoneId)
  );
}

function normalizedLifecycle(
  release: ReleaseObservationVersionInput,
): ForecastAnalysisReleaseLifecycle {
  if (release.lifecycle) return release.lifecycle;
  return release.publicReleaseDate ? "released" : "active";
}

function asForecastRelease(
  release: ReleaseObservationVersionInput,
  issuedDay: string,
): ForecastAnalysisReleaseV1 {
  const lifecycle = normalizedLifecycle(release);
  if (lifecycle === "active") return { id: release.id, lifecycle };
  return {
    id: release.id,
    lifecycle,
    statusEffectiveOn: release.statusEffectiveOn ?? release.publicReleaseDate,
    statusFirstObservedOn: utcDay(release.statusFirstObservedAt) ?? issuedDay,
  };
}

function candidateToForecastEvent(candidate: Candidate): ForecastAnalysisEventV1 {
  return {
    id: candidate.evidenceId,
    releaseId: candidate.releaseId,
    occurredOn: candidate.occurredOn,
    firstObservedOn: candidate.firstObservedOn,
    channel: candidate.channel,
    sequence: candidate.sequence,
    sameDayOrder: candidate.sameDayOrder,
    availability: candidate.availability,
    // Effective records are intentionally collapsed, so they have no missing
    // predecessor outside the output dataset.
    isRevision: false,
    displayLabel: candidate.displayLabel,
    note: candidate.note,
  };
}

function effectiveEventToDataset(
  event: CanonicalReleaseObservation,
): ForecastAnalysisEventV1 {
  return {
    id: event.id,
    releaseId: event.releaseId,
    occurredOn: event.occurredOn,
    firstObservedOn: event.firstObservedOn,
    channel: event.channel,
    sequence: event.sequence,
    sameDayOrder: event.sameDayOrder,
    availability: event.availability,
    isRevision: event.isRevision,
    displayLabel: event.displayLabel,
    note: event.note,
  };
}

function exclusionFromEligibility(
  reason: string,
): ReleaseObservationExclusionCode {
  switch (reason) {
    case "future-occurrence":
    case "not-observed-by-cutoff":
    case "withdrawn":
    case "replaced":
    case "superseded":
    case "superseded-cycle":
    case "invalid-channel":
    case "invalid-availability":
    case "descriptive-channel":
    case "missing-canonical-stage":
    case "release-lifecycle-date-unknown":
    case "invalid-release-lifecycle":
      return reason;
    default:
      return "unknown-release-cycle";
  }
}

function canonicalCandidate(
  candidate: Candidate,
  release: ForecastAnalysisReleaseV1 | undefined,
  asOfDate: string,
): ReleaseObservationExclusionCode | null {
  if (!isIsoDay(candidate.occurredOn)) return "invalid-occurrence-date";
  if (!isIsoDay(candidate.firstObservedOn)) return "invalid-first-observed-at";
  if (candidate.firstObservedOn < candidate.occurredOn) {
    return "first-observed-before-occurrence";
  }
  if (
    candidate.sameDayOrder !== undefined &&
    (!Number.isInteger(candidate.sameDayOrder) || candidate.sameDayOrder <= 0)
  ) {
    return "invalid-same-day-order";
  }
  if (
    candidate.sequence !== undefined &&
    (candidate.channel === "goldenMaster" || candidate.channel === "public")
  ) {
    return "unexpected-stage-sequence";
  }
  const eligibility = forecastEventEligibility(
    candidateToForecastEvent(candidate),
    asOfDate,
    release,
  );
  if (!eligibility.eligible) return exclusionFromEligibility(eligibility.reason);
  candidate.stage = eligibility.stage;
  return null;
}

function ledgerSort(
  left: ReleaseObservationLedgerEntry,
  right: ReleaseObservationLedgerEntry,
): number {
  return (
    compareText(left.releaseId, right.releaseId) ||
    compareText(left.occurredOn ?? "", right.occurredOn ?? "") ||
    compareText(left.evidenceId, right.evidenceId)
  );
}

/**
 * Build one deterministic, point-in-time-safe canonical observation set.
 * It performs no storage, network, or clock access; callers must pass both
 * `asOfDate` and the conservative snapshot `issuedAt` explicitly.
 */
export function adaptReleaseObservations(
  input: ReleaseObservationAdapterInput,
): ReleaseObservationAdapterResult {
  if (!isIsoDay(input.asOfDate)) {
    throw new ReleaseObservationInputError("invalid-as-of-date");
  }
  const issuedDay = utcDay(input.issuedAt);
  if (!issuedDay) {
    throw new ReleaseObservationInputError("invalid-issued-at");
  }
  const releaseInputLedger: ReleaseObservationLedgerEntry[] = [];
  const validReleaseInputs: ReleaseObservationVersionInput[] = [];
  const releaseIdCounts = new Map<string, number>();
  for (const release of input.releases) {
    if (!release.id.trim()) continue;
    releaseIdCounts.set(
      release.id,
      (releaseIdCounts.get(release.id) ?? 0) + 1,
    );
  }
  const validLifecycles = new Set<ForecastAnalysisReleaseLifecycle>([
    "active",
    "released",
    "superseded",
  ]);
  for (const release of input.releases) {
    const inputEvidenceId = release.id
      ? `release:${release.id}:input`
      : "input:release:missing-id";
    if (!release.id.trim()) {
      releaseInputLedger.push({
        evidenceId: inputEvidenceId,
        source: "release",
        releaseId: release.id,
        included: false,
        reason: "missing-release-id",
      });
      continue;
    }
    if ((releaseIdCounts.get(release.id) ?? 0) > 1) {
      releaseInputLedger.push({
        evidenceId: inputEvidenceId,
        source: "release",
        releaseId: release.id,
        included: false,
        reason: "duplicate-release-id",
      });
      continue;
    }
    const lifecycle = normalizedLifecycle(release);
    const effectiveOn = release.statusEffectiveOn ?? release.publicReleaseDate;
    const firstObservedOn =
      utcDay(release.statusFirstObservedAt) ?? issuedDay;
    if (!validLifecycles.has(lifecycle)) {
      releaseInputLedger.push({
        evidenceId: inputEvidenceId,
        source: "release",
        releaseId: release.id,
        included: false,
        reason: "invalid-release-lifecycle",
      });
      continue;
    }
    if (
      lifecycle === "released" &&
      (!isIsoDay(release.publicReleaseDate) ||
        (release.statusEffectiveOn !== undefined &&
          release.statusEffectiveOn !== release.publicReleaseDate))
    ) {
      releaseInputLedger.push({
        evidenceId: inputEvidenceId,
        source: "release",
        releaseId: release.id,
        included: false,
        reason: "release-status-date-mismatch",
      });
      continue;
    }
    if (
      lifecycle !== "active" &&
      (!isIsoDay(effectiveOn) ||
        (release.statusFirstObservedAt !== undefined &&
          release.statusFirstObservedAt !== null &&
          !utcDay(release.statusFirstObservedAt)) ||
        (firstObservedOn !== null && firstObservedOn < effectiveOn))
    ) {
      releaseInputLedger.push({
        evidenceId: inputEvidenceId,
        source: "release",
        releaseId: release.id,
        included: false,
        reason: "release-lifecycle-date-unknown",
      });
      continue;
    }
    releaseInputLedger.push({
      evidenceId: inputEvidenceId,
      source: "release",
      releaseId: release.id,
      included: true,
    });
    validReleaseInputs.push(release);
  }
  validReleaseInputs.sort((left, right) => compareText(left.id, right.id));
  const releases = validReleaseInputs.map((release) =>
    asForecastRelease(release, issuedDay),
  );
  const releaseById = new Map(releases.map((release) => [release.id, release]));
  const candidates: Candidate[] = [];
  const ledger = new Map<string, ReleaseObservationLedgerEntry>();
  for (const entry of releaseInputLedger) ledger.set(entry.evidenceId, entry);

  const exclude = (candidate: Candidate, reason: ReleaseObservationExclusionCode) => {
    ledger.set(candidate.evidenceId, {
      evidenceId: candidate.evidenceId,
      source: candidate.source,
      releaseId: candidate.releaseId,
      occurredOn: candidate.occurredOn,
      ...(candidate.stage ? { stage: candidate.stage } : {}),
      included: false,
      reason,
    });
  };
  const include = (candidate: Candidate) => {
    ledger.set(candidate.evidenceId, {
      evidenceId: candidate.evidenceId,
      source: candidate.source,
      releaseId: candidate.releaseId,
      occurredOn: candidate.occurredOn,
      stage: candidate.stage,
      included: true,
    });
  };

  for (const milestone of input.compatibilityMilestones) {
    const evidenceId = milestone.id.trim()
      ? compatibilityEvidenceId(milestone.releaseId, milestone.id)
      : "input:compatibility:missing-id";
    candidates.push({
      evidenceId,
      source: "compatibility",
      sourceId: milestone.id,
      releaseId: milestone.releaseId,
      occurredOn: milestone.occurredOn,
      firstObservedOn: observedDay(milestone.firstObservedAt, issuedDay),
      channel: milestone.channel ?? ("other" as ForecastAnalysisChannel),
      sequence: milestone.sequence,
      sameDayOrder: milestone.sameDayOrder,
      availability: milestone.availability ?? ("available" as ForecastAnalysisAvailability),
      isRevision: milestone.isRevision ?? false,
      replacesIds: [],
      replacedByIds: [],
      closesReleaseCycle: false,
      displayLabel: milestone.displayLabel,
      note: milestone.note,
    });
  }
  for (const event of input.events) {
    const evidenceId = firstClassEvidenceId(event) ?? "input:event:missing-id";
    candidates.push({
      evidenceId,
      source: "first-class",
      sourceId: event.stableEventId?.trim() || event.id,
      releaseId: event.releaseId,
      occurredOn: event.occurredOn,
      firstObservedOn: observedDay(event.firstObservedAt, issuedDay),
      channel: event.channel,
      sequence: event.sequence,
      sameDayOrder: event.sameDayOrder,
      availability: event.availability ?? ("available" as ForecastAnalysisAvailability),
      isRevision: event.isRevision ?? false,
      replacesIds: [event.revisionOfId, event.replacesEventId].filter(
        (value): value is string => Boolean(value?.trim()),
      ).map((value) => value.trim()),
      replacedByIds: [event.replacedByEventId].filter(
        (value): value is string => Boolean(value?.trim()),
      ).map((value) => value.trim()),
      legacySourceId: event.legacySourceId,
      closesReleaseCycle: event.closesReleaseCycle ?? false,
      displayLabel: event.displayLabel,
      note: event.note,
    });
  }

  const evidenceCounts = new Map<string, number>();
  for (const candidate of candidates) {
    evidenceCounts.set(
      candidate.evidenceId,
      (evidenceCounts.get(candidate.evidenceId) ?? 0) + 1,
    );
  }
  const eligibleCandidates: Candidate[] = [];
  for (const candidate of candidates.sort(candidateSort)) {
    if (candidate.evidenceId.includes(":missing-id")) {
      exclude(candidate, "missing-evidence-id");
      continue;
    }
    if ((evidenceCounts.get(candidate.evidenceId) ?? 0) > 1) {
      exclude(candidate, "duplicate-evidence-id");
      continue;
    }
    const reason = canonicalCandidate(
      candidate,
      releaseById.get(candidate.releaseId),
      input.asOfDate,
    );
    if (reason) {
      exclude(candidate, reason);
      continue;
    }
    eligibleCandidates.push(candidate);
  }

  const candidateBySourceId = new Map<string, Candidate[]>();
  for (const candidate of eligibleCandidates.filter(
    (entry) => entry.source === "first-class",
  )) {
    for (const identity of new Set([
      candidate.sourceId,
      candidate.evidenceId.replace(/^event:/, ""),
    ])) {
      if (!identity) continue;
      const existing = candidateBySourceId.get(identity) ?? [];
      if (!existing.some((entry) => entry.evidenceId === candidate.evidenceId)) {
        candidateBySourceId.set(identity, [...existing, candidate]);
      }
    }
  }
  const replaced = new Set<string>();
  const invalidLinks = new Map<string, ReleaseObservationExclusionCode>();
  const replacementEdges: Array<{
    predecessor: Candidate;
    successor: Candidate;
  }> = [];
  const targetFor = (candidate: Candidate, targetId: string): Candidate | null => {
    const targets = (candidateBySourceId.get(targetId) ?? []).filter(
      (target) => target.evidenceId !== candidate.evidenceId,
    );
    if (targets.length !== 1) {
      invalidLinks.set(candidate.evidenceId, "unknown-replacement-target");
      return null;
    }
    const target = targets[0];
    if (target.releaseId !== candidate.releaseId || target.stage !== candidate.stage) {
      invalidLinks.set(candidate.evidenceId, "cross-stage-replacement");
      return null;
    }
    return target;
  };
  for (const candidate of eligibleCandidates) {
    const predecessorIds = [...new Set(candidate.replacesIds)];
    if (predecessorIds.length > 1) {
      invalidLinks.set(candidate.evidenceId, "multiple-replacement-targets");
      continue;
    }
    const pendingEdges: Array<{
      predecessor: Candidate;
      successor: Candidate;
    }> = [];
    for (const targetId of predecessorIds) {
      const target = targetFor(candidate, targetId);
      if (target) {
        pendingEdges.push({ predecessor: target, successor: candidate });
      }
    }
    for (const successorId of candidate.replacedByIds) {
      const successor = targetFor(candidate, successorId);
      if (successor) {
        pendingEdges.push({ predecessor: candidate, successor });
      }
    }
    if (!invalidLinks.has(candidate.evidenceId)) {
      replacementEdges.push(...pendingEdges);
    }
  }
  const edgesBySuccessor = new Map<string, typeof replacementEdges>();
  for (const edge of replacementEdges) {
    edgesBySuccessor.set(edge.successor.evidenceId, [
      ...(edgesBySuccessor.get(edge.successor.evidenceId) ?? []),
      edge,
    ]);
  }
  for (const candidate of eligibleCandidates) {
    if (invalidLinks.has(candidate.evidenceId)) continue;
    const incoming = edgesBySuccessor.get(candidate.evidenceId) ?? [];
    const predecessors = new Map(
      incoming.map((edge) => [edge.predecessor.evidenceId, edge.predecessor]),
    );
    if (predecessors.size > 1) {
      invalidLinks.set(candidate.evidenceId, "multiple-replacement-targets");
      for (const predecessor of predecessors.values()) {
        invalidLinks.set(
          predecessor.evidenceId,
          "multiple-replacement-targets",
        );
      }
      continue;
    }
    if (candidate.isRevision && predecessors.size !== 1) {
      invalidLinks.set(candidate.evidenceId, "unknown-replacement-target");
      continue;
    }
  }
  let invalidatedRevision = true;
  while (invalidatedRevision) {
    invalidatedRevision = false;
    const currentlyValidEdges = replacementEdges.filter(
      ({ predecessor, successor }) =>
        !invalidLinks.has(predecessor.evidenceId) &&
        !invalidLinks.has(successor.evidenceId),
    );
    for (const candidate of eligibleCandidates) {
      const requiresPredecessor =
        candidate.isRevision || candidate.replacesIds.length > 0;
      if (!requiresPredecessor || invalidLinks.has(candidate.evidenceId)) {
        continue;
      }
      const validPredecessors = new Set(
        currentlyValidEdges
          .filter(({ successor }) => successor.evidenceId === candidate.evidenceId)
          .map(({ predecessor }) => predecessor.evidenceId),
      );
      if (validPredecessors.size !== 1) {
        invalidLinks.set(candidate.evidenceId, "unknown-replacement-target");
        invalidatedRevision = true;
      }
    }
  }
  const validReplacementEdges = replacementEdges.filter(
    ({ predecessor, successor }) =>
      !invalidLinks.has(predecessor.evidenceId) &&
      !invalidLinks.has(successor.evidenceId),
  );
  const replacementGroups = new Map<string, Candidate[]>();
  for (const candidate of eligibleCandidates) {
    if (candidate.source !== "first-class" || invalidLinks.has(candidate.evidenceId)) {
      continue;
    }
    const key = `${candidate.releaseId}\u0000${candidate.stage}`;
    replacementGroups.set(key, [
      ...(replacementGroups.get(key) ?? []),
      candidate,
    ]);
  }
  for (const candidatesForStage of replacementGroups.values()) {
    const candidateIds = new Set(
      candidatesForStage.map((candidate) => candidate.evidenceId),
    );
    const edges = validReplacementEdges.filter(
      ({ predecessor, successor }) =>
        candidateIds.has(predecessor.evidenceId) &&
        candidateIds.has(successor.evidenceId),
    );
    const successorsByPredecessor = new Map<string, Set<string>>();
    for (const { predecessor, successor } of edges) {
      const successors =
        successorsByPredecessor.get(predecessor.evidenceId) ?? new Set<string>();
      successors.add(successor.evidenceId);
      successorsByPredecessor.set(predecessor.evidenceId, successors);
    }
    const terminals = candidatesForStage.filter(
      (candidate) => !successorsByPredecessor.has(candidate.evidenceId),
    );
    if (terminals.length !== 1) continue;
    const terminalId = terminals[0].evidenceId;
    const reachesTerminal = (startId: string): boolean => {
      const seen = new Set<string>();
      let currentId = startId;
      while (currentId !== terminalId) {
        if (seen.has(currentId)) return false;
        seen.add(currentId);
        const successors = successorsByPredecessor.get(currentId);
        if (!successors || successors.size !== 1) return false;
        currentId = [...successors][0];
      }
      return true;
    };
    if (
      candidatesForStage.every((candidate) =>
        reachesTerminal(candidate.evidenceId),
      )
    ) {
      for (const candidate of candidatesForStage) {
        if (candidate.evidenceId !== terminalId) {
          replaced.add(candidate.evidenceId);
        }
      }
    }
  }
  const unresolved = eligibleCandidates.filter((candidate) => {
    const invalidLink = invalidLinks.get(candidate.evidenceId);
    if (invalidLink) {
      exclude(candidate, invalidLink);
      return false;
    }
    if (replaced.has(candidate.evidenceId)) {
      exclude(candidate, "replaced-by-event");
      return false;
    }
    return true;
  });

  const duplicateSameDayOrderIdsFor = (
    sourceCandidates: readonly Candidate[],
  ): Set<string> => {
    const sameDayOrders = new Map<string, Candidate[]>();
    for (const candidate of sourceCandidates) {
      if (candidate.sameDayOrder === undefined) continue;
      const key = `${candidate.releaseId}\u0000${candidate.occurredOn}\u0000${candidate.sameDayOrder}`;
      sameDayOrders.set(key, [...(sameDayOrders.get(key) ?? []), candidate]);
    }
    const duplicates = new Set<string>();
    for (const candidatesWithOrder of sameDayOrders.values()) {
      if (candidatesWithOrder.length < 2) continue;
      for (const candidate of candidatesWithOrder) {
        duplicates.add(candidate.evidenceId);
        exclude(candidate, "duplicate-same-day-order");
      }
    }
    return duplicates;
  };

  const firstClassCandidates = unresolved.filter(
    (candidate) => candidate.source === "first-class",
  );
  const firstClassDuplicateOrderIds =
    duplicateSameDayOrderIdsFor(firstClassCandidates);
  const firstClassGroups = new Map<string, Candidate[]>();
  for (const candidate of firstClassCandidates) {
    if (firstClassDuplicateOrderIds.has(candidate.evidenceId)) continue;
    const key = `${candidate.releaseId}\u0000${candidate.stage}`;
    firstClassGroups.set(key, [
      ...(firstClassGroups.get(key) ?? []),
      candidate,
    ]);
  }
  const ambiguousFirstClassIds = new Set<string>();
  const preliminaryFirstClassEvents: Candidate[] = [];
  for (const candidatesForStage of firstClassGroups.values()) {
    if (candidatesForStage.length === 1) {
      preliminaryFirstClassEvents.push(candidatesForStage[0]);
      continue;
    }
    for (const candidate of candidatesForStage) {
      ambiguousFirstClassIds.add(candidate.evidenceId);
      exclude(candidate, "ambiguous-effective-stage");
    }
  }

  const preOverlayPool = unresolved.filter(
    (candidate) =>
      !firstClassDuplicateOrderIds.has(candidate.evidenceId) &&
      !ambiguousFirstClassIds.has(candidate.evidenceId),
  );
  const overlays = new Set<string>();
  for (const event of preliminaryFirstClassEvents) {
    const sameStageOthers = preOverlayPool.filter(
      (candidate) =>
        candidate.evidenceId !== event.evidenceId &&
        candidate.releaseId === event.releaseId &&
        candidate.stage === event.stage,
    );
    const linkedLegacy = sameStageOthers.filter(
      (candidate) =>
        candidate.source === "compatibility" &&
        legacyIdMatches(event.releaseId, event.legacySourceId, candidate.sourceId),
    );
    if (linkedLegacy.length !== sameStageOthers.length) continue;
    const linkedLegacyIds = new Set(
      linkedLegacy.map((candidate) => candidate.evidenceId),
    );
    const hasUnresolvedOrderConflict =
      event.sameDayOrder !== undefined &&
      preOverlayPool.some(
        (candidate) =>
          candidate.evidenceId !== event.evidenceId &&
          !linkedLegacyIds.has(candidate.evidenceId) &&
          candidate.releaseId === event.releaseId &&
          candidate.occurredOn === event.occurredOn &&
          candidate.sameDayOrder === event.sameDayOrder,
      );
    if (hasUnresolvedOrderConflict) continue;
    for (const milestone of linkedLegacy) {
      overlays.add(milestone.evidenceId);
      exclude(milestone, "overlaid-by-first-class-event");
    }
  }

  const postOverlayCandidates = preOverlayPool.filter(
    (candidate) => !overlays.has(candidate.evidenceId),
  );
  const sameDayOrders = new Map<string, Candidate[]>();
  for (const candidate of postOverlayCandidates) {
    if (candidate.sameDayOrder === undefined) continue;
    const key = `${candidate.releaseId}\u0000${candidate.occurredOn}\u0000${candidate.sameDayOrder}`;
    sameDayOrders.set(key, [...(sameDayOrders.get(key) ?? []), candidate]);
  }
  const duplicateSameDayOrderIds = new Set<string>();
  for (const candidatesWithOrder of sameDayOrders.values()) {
    if (candidatesWithOrder.length > 1) {
      for (const candidate of candidatesWithOrder) {
        duplicateSameDayOrderIds.add(candidate.evidenceId);
        exclude(candidate, "duplicate-same-day-order");
      }
    }
  }

  const groups = new Map<string, Candidate[]>();
  for (const candidate of postOverlayCandidates) {
    if (duplicateSameDayOrderIds.has(candidate.evidenceId)) continue;
    const key = `${candidate.releaseId}\u0000${candidate.stage}`;
    groups.set(key, [...(groups.get(key) ?? []), candidate]);
  }
  const effectiveCandidates: Candidate[] = [];
  for (const candidatesForStage of groups.values()) {
    if (candidatesForStage.length === 1) {
      effectiveCandidates.push(candidatesForStage[0]);
      continue;
    }
    for (const candidate of candidatesForStage) {
      exclude(candidate, "ambiguous-effective-stage");
    }
  }

  for (const candidate of effectiveCandidates) include(candidate);
  const effectiveEvents = effectiveCandidates
    .sort(candidateSort)
    .map((candidate): CanonicalReleaseObservation => ({
      ...candidateToForecastEvent(candidate),
      evidenceId: candidate.evidenceId,
      source: candidate.source,
      sourceEvidenceIds: [candidate.evidenceId],
      stage: candidate.stage as CanonicalForecastStage,
    }));

  const releasedOutcomes: ReleasedOutcome[] = [];
  {
    const effectiveByRelease = new Map<string, CanonicalReleaseObservation[]>();
    for (const event of effectiveEvents) {
      effectiveByRelease.set(event.releaseId, [
        ...(effectiveByRelease.get(event.releaseId) ?? []),
        event,
      ]);
    }
    for (const release of validReleaseInputs) {
      const evidenceId = `release:${release.id}:outcome`;
      const lifecycle = normalizedLifecycle(release);
      const publicReleaseDate = release.publicReleaseDate;
      const statusObservedOn = utcDay(release.statusFirstObservedAt) ?? issuedDay;
      if (
        lifecycle === "released" &&
        isIsoDay(publicReleaseDate) &&
        publicReleaseDate <= input.asOfDate &&
        statusObservedOn <= input.asOfDate
      ) {
        releasedOutcomes.push({
          evidenceId,
          releaseId: release.id,
          occurredOn: publicReleaseDate,
          firstObservedOn: statusObservedOn,
          closure: "public-release",
        });
        ledger.set(evidenceId, {
          evidenceId,
          source: "release",
          releaseId: release.id,
          occurredOn: publicReleaseDate,
          included: true,
        });
        continue;
      }
      const closingGm = (effectiveByRelease.get(release.id) ?? [])
        .filter(
          (event) =>
            event.stage === "golden-master" &&
            candidates.find((candidate) => candidate.evidenceId === event.evidenceId)
              ?.closesReleaseCycle,
        )
        .sort((left, right) =>
          compareText(left.occurredOn, right.occurredOn) ||
          compareText(left.evidenceId, right.evidenceId),
        )[0];
      if (closingGm) {
        releasedOutcomes.push({
          evidenceId,
          releaseId: release.id,
          occurredOn: closingGm.occurredOn,
          firstObservedOn: closingGm.firstObservedOn,
          closure: "golden-master",
        });
        ledger.set(evidenceId, {
          evidenceId,
          source: "release",
          releaseId: release.id,
          occurredOn: closingGm.occurredOn,
          included: true,
        });
      } else {
        ledger.set(evidenceId, {
          evidenceId,
          source: "release",
          releaseId: release.id,
          occurredOn: publicReleaseDate,
          included: false,
          reason:
            lifecycle === "released" && !isIsoDay(publicReleaseDate)
              ? "invalid-release-outcome"
              : "not-released-by-cutoff",
        });
      }
    }
  }

  const inclusionLedger = [...ledger.values()].sort(ledgerSort);
  const exclusions = inclusionLedger
    .filter((entry): entry is ReleaseObservationLedgerEntry & { reason: ReleaseObservationExclusionCode } =>
      !entry.included && Boolean(entry.reason),
    )
    .map(({ evidenceId, source, releaseId, reason }) => ({
      evidenceId,
      source,
      releaseId,
      code: reason,
    }));
  return {
    adapterVersion: RELEASE_OBSERVATION_ADAPTER_VERSION,
    asOfDate: input.asOfDate,
    issuedAt: input.issuedAt,
    dataset: {
      contractVersion: FORECAST_ANALYSIS_CONTRACT_VERSION,
      dataCutoff: input.asOfDate,
      releases,
      events: effectiveEvents.map(effectiveEventToDataset),
    },
    effectiveEvents,
    releasedOutcomes: releasedOutcomes.sort(
      (left, right) =>
        compareText(left.releaseId, right.releaseId) ||
        compareText(left.occurredOn, right.occurredOn) ||
        compareText(left.evidenceId, right.evidenceId),
    ),
    inclusionLedger,
    exclusions,
  };
}
