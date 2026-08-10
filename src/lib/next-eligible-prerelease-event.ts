import {
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisDataset,
  type HistoricalAnalysisDatasetV1,
  type HistoricalCanonicalEventRow,
} from "./historical-analysis-dataset";

/**
 * A private, pure next-event model. This is deliberately separate from the
 * public-release-date candidates: its outcome is the next verified
 * prerelease appearance, never GM or a public release.
 */
export const NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION = "next-eligible-prerelease-event/v1";
export const NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES = 8;
export const NEXT_ELIGIBLE_PRERELEASE_EVENT_MODE_THRESHOLD = 0.6;
export const NEXT_ELIGIBLE_PRERELEASE_EVENT_INTERVAL_LEVELS = [0.5, 0.8] as const;

export type EligiblePrereleaseStage = "developer-beta" | "public-beta" | "release-candidate";
export type NextEventTargetKind = "next-eligible-prerelease-event";

export interface NextEligiblePrereleaseEventConfigV1 {
  modelVersion: typeof NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION;
  minimumExamples: typeof NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES;
  modeThreshold: typeof NEXT_ELIGIBLE_PRERELEASE_EVENT_MODE_THRESHOLD;
  intervalLevels: readonly [0.5, 0.8];
}

export const DEFAULT_NEXT_ELIGIBLE_PRERELEASE_EVENT_CONFIG: NextEligiblePrereleaseEventConfigV1 = {
  modelVersion: NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION,
  minimumExamples: NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES,
  modeThreshold: NEXT_ELIGIBLE_PRERELEASE_EVENT_MODE_THRESHOLD,
  intervalLevels: NEXT_ELIGIBLE_PRERELEASE_EVENT_INTERVAL_LEVELS,
};

export interface NextEligiblePrereleaseEventTargetV1 {
  targetId: string;
  targetKind: NextEventTargetKind;
  releaseId: string;
  platformId: string;
  productFamilyId: string;
  anchorEventId: string;
  anchorStage: string;
  anchorOccurredOn: string;
  originOn: string;
  endpointEventId: string;
  endpointStage: string;
  endpointEligibleStage: EligiblePrereleaseStage;
  endpointOccurredOn: string;
  endpointFirstObservedOn: string;
  actualDays: number;
  sourceEvidenceIds: readonly string[];
}

export type NextEligiblePrereleaseEventExclusionReason =
  | "release-not-included"
  | "chronology-incomplete"
  | "same-day-ambiguity"
  | "no-subsequent-event"
  | "terminal-or-ineligible-next-event"
  | "same-calendar-day"
  | "non-forward-interval"
  | "endpoint-not-after-anchor-observed";

export interface NextEligiblePrereleaseEventLedgerEntryV1 {
  releaseId: string;
  anchorEventId: string;
  included: boolean;
  targetId?: string;
  reason?: NextEligiblePrereleaseEventExclusionReason;
  sourceEvidenceIds: readonly string[];
}

export interface NextEligiblePrereleaseEventFoldV1 {
  foldId: string;
  heldoutTargetId: string;
  originOn: string;
  trainingTargetIds: readonly string[];
}

export type NextEligiblePrereleaseStagePredictionV1 =
  | {
      available: true;
      predictedEligibleStage: EligiblePrereleaseStage;
      cohort: "platform-anchor-stage" | "platform-pooled";
      fallback: boolean;
      trainingTargetIds: readonly string[];
      modalCount: number;
      modalShare: number;
    }
  | {
      available: false;
      reason: "minimum-training-examples" | "nonunique-or-weak-mode";
      cohort: "platform-anchor-stage" | "platform-pooled";
      fallback: boolean;
      trainingTargetIds: readonly string[];
      modalCount: number | null;
      modalShare: number | null;
    };

export type NextEligiblePrereleaseTimingPredictionV1 =
  | {
      available: true;
      pointDays: number;
      cohort: "platform-anchor-stage-and-next-stage" | "platform-next-stage-pooled";
      fallback: boolean;
      trainingTargetIds: readonly string[];
    }
  | {
      available: false;
      reason: "stage-unavailable" | "minimum-training-examples";
      cohort: "platform-anchor-stage-and-next-stage" | "platform-next-stage-pooled" | null;
      fallback: boolean;
      trainingTargetIds: readonly string[];
    };

export type NextEligiblePrereleaseIntervalV1 =
  | {
      level: 0.5 | 0.8;
      available: true;
      residualCount: number;
      rank: number;
      quantileResidualDays: number;
      lowerDays: number;
      pointDays: number;
      upperDays: number;
    }
  | { level: 0.5 | 0.8; available: false; reason: "minimum-residuals"; residualCount: number };

export interface NextEligiblePrereleaseEventForecastV1 {
  fold: NextEligiblePrereleaseEventFoldV1;
  target: Pick<NextEligiblePrereleaseEventTargetV1, "releaseId" | "platformId" | "productFamilyId" | "anchorEventId" | "anchorStage" | "anchorOccurredOn" | "endpointEligibleStage" | "endpointOccurredOn" | "endpointFirstObservedOn" | "actualDays">;
  stage: NextEligiblePrereleaseStagePredictionV1;
  timing: NextEligiblePrereleaseTimingPredictionV1;
  residualPool: {
    exactCount: number;
    platformTargetCount: number;
    selectedPool: "exact" | "platform-target-fallback" | "unavailable";
    residualTargetIds: readonly string[];
  };
  intervals: readonly NextEligiblePrereleaseIntervalV1[];
}

export interface NextEligiblePrereleaseEventResidualV1 {
  outerFoldId: string;
  innerFoldId: string;
  innerTargetId: string;
  included: boolean;
  reason?: "target-never-residual" | "inner-origin-not-before-outer-origin" | "inner-endpoint-not-visible-at-outer-origin" | "foreign-platform" | "target-definition-mismatch" | "inner-self-trained";
  residualDays?: number;
}

export interface NextEligiblePrereleaseEventFingerprintsV1 {
  sourceDatasetFingerprint: string;
  configFingerprint: string;
  codeFingerprint: string;
  resultFingerprint: string;
}

export interface NextEligiblePrereleaseEventModelV1 {
  modelVersion: typeof NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION;
  config: NextEligiblePrereleaseEventConfigV1;
  sourceDataset: HistoricalAnalysisDatasetV1;
  targets: readonly NextEligiblePrereleaseEventTargetV1[];
  exclusionLedger: readonly NextEligiblePrereleaseEventLedgerEntryV1[];
  folds: readonly NextEligiblePrereleaseEventFoldV1[];
  forecasts: readonly NextEligiblePrereleaseEventForecastV1[];
  residualLedger: readonly NextEligiblePrereleaseEventResidualV1[];
  fingerprints: NextEligiblePrereleaseEventFingerprintsV1;
}

export type NextEligiblePrereleaseEventValidationCode = "invalid-input" | "unsupported-version" | "invalid-config" | "invalid-source-dataset" | "invalid-row" | "invalid-fingerprint";
export interface NextEligiblePrereleaseEventValidationIssue { code: NextEligiblePrereleaseEventValidationCode; path: string; message: string; }
export class NextEligiblePrereleaseEventInputError extends Error {
  constructor(public readonly issues: readonly NextEligiblePrereleaseEventValidationIssue[]) {
    super(`Next eligible prerelease event input is invalid: ${issues[0]?.code ?? "unknown"}.`);
    this.name = "NextEligiblePrereleaseEventInputError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function textOrder(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function sorted<T>(rows: readonly T[], key: (row: T) => string): T[] { return [...rows].sort((a, b) => textOrder(key(a), key(b))); }
function uniqueSorted(values: readonly string[]): string[] { return [...new Set(values)].sort(textOrder); }
function median(values: readonly number[]): number { const rows = [...values].sort((a, b) => a - b); const i = Math.floor(rows.length / 2); return rows.length % 2 ? rows[i]! : (rows[i - 1]! + rows[i]!) / 2; }
function dayNumber(value: string): number { const [y, m, d] = value.split("-").map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000); }

/** Never infer this from presentation text or beta numbering. */
export function eligiblePrereleaseStage(stage: string): EligiblePrereleaseStage | null {
  if (/^developer-beta:[1-9]\d*$/.test(stage)) return "developer-beta";
  if (/^public-beta:[1-9]\d*$/.test(stage)) return "public-beta";
  if (/^release-candidate:[1-9]\d*$/.test(stage)) return "release-candidate";
  return null;
}

function configIssues(value: unknown): NextEligiblePrereleaseEventValidationIssue[] {
  if (!isRecord(value) || value.modelVersion !== NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION || value.minimumExamples !== NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES || value.modeThreshold !== NEXT_ELIGIBLE_PRERELEASE_EVENT_MODE_THRESHOLD || !Array.isArray(value.intervalLevels) || value.intervalLevels.length !== 2 || value.intervalLevels[0] !== 0.5 || value.intervalLevels[1] !== 0.8) return [{ code: "invalid-config", path: "config", message: "Config must use the fixed v1 minimum, mode threshold, and [0.5, 0.8] levels." }];
  return [];
}

interface OrderedCycle { events: readonly HistoricalCanonicalEventRow[]; ambiguousEventIds: ReadonlySet<string>; ambiguousFollowingEventIds: ReadonlySet<string>; }
function orderCycle(events: readonly HistoricalCanonicalEventRow[]): OrderedCycle {
  const byDay = new Map<string, HistoricalCanonicalEventRow[]>();
  for (const event of events) byDay.set(event.occurredOn, [...(byDay.get(event.occurredOn) ?? []), event]);
  const days = [...byDay.keys()].sort(textOrder);
  const ordered: HistoricalCanonicalEventRow[] = [];
  const ambiguous = new Set<string>();
  const following = new Set<string>();
  let prior: HistoricalCanonicalEventRow | undefined;
  for (const day of days) {
    const group = byDay.get(day)!;
    const verified = group.length === 1 || (group.every((event) => Number.isInteger(event.sameDayOrder) && (event.sameDayOrder ?? 0) > 0) && new Set(group.map((event) => event.sameDayOrder)).size === group.length);
    if (!verified) {
      for (const event of group) ambiguous.add(event.eventId);
      if (prior) following.add(prior.eventId);
      // Preserve a deterministic serialization only; these entries never form
      // an outcome or a predecessor edge while their day order is unknown.
      ordered.push(...sorted(group, (event) => event.eventId));
    } else {
      ordered.push(...sorted(group, (event) => `${String(event.sameDayOrder ?? 0).padStart(12, "0")}\u0000${event.eventId}`));
    }
    prior = ordered[ordered.length - 1];
  }
  return { events: ordered, ambiguousEventIds: ambiguous, ambiguousFollowingEventIds: following };
}

function trainingFor(heldoutId: string | null, originOn: string, targets: readonly NextEligiblePrereleaseEventTargetV1[]) {
  return targets.filter((target) => target.targetId !== heldoutId && target.originOn <= originOn && target.endpointOccurredOn <= originOn && target.endpointFirstObservedOn <= originOn);
}

function deriveTargets(sourceDataset: HistoricalAnalysisDatasetV1) {
  const targets: NextEligiblePrereleaseEventTargetV1[] = [];
  const ledger: NextEligiblePrereleaseEventLedgerEntryV1[] = [];
  const cycles = new Map(sourceDataset.releaseCycles.map((cycle) => [cycle.releaseId, cycle]));
  const byRelease = new Map<string, HistoricalCanonicalEventRow[]>();
  for (const event of sourceDataset.canonicalEvents) byRelease.set(event.releaseId, [...(byRelease.get(event.releaseId) ?? []), event]);
  for (const [releaseId, events] of [...byRelease.entries()].sort(([a], [b]) => textOrder(a, b))) {
    const cycle = cycles.get(releaseId);
    for (const anchor of events.filter((event) => eligiblePrereleaseStage(event.stage))) {
      const base = { releaseId, anchorEventId: anchor.eventId, sourceEvidenceIds: anchor.sourceEvidenceIds };
      if (!cycle?.included) { ledger.push({ ...base, included: false, reason: "release-not-included" }); continue; }
      if (cycle.chronologyCoverage.state !== "complete") { ledger.push({ ...base, included: false, reason: "chronology-incomplete" }); continue; }
      const ordered = orderCycle(events);
      const index = ordered.events.findIndex((event) => event.eventId === anchor.eventId);
      const successor = ordered.events[index + 1];
      if (ordered.ambiguousEventIds.has(anchor.eventId) || ordered.ambiguousFollowingEventIds.has(anchor.eventId) || (successor && ordered.ambiguousEventIds.has(successor.eventId))) { ledger.push({ ...base, included: false, reason: "same-day-ambiguity" }); continue; }
      if (!successor) { ledger.push({ ...base, included: false, reason: "no-subsequent-event" }); continue; }
      const endpointEligibleStage = eligiblePrereleaseStage(successor.stage);
      const evidence = uniqueSorted([...anchor.sourceEvidenceIds, ...successor.sourceEvidenceIds]);
      if (!endpointEligibleStage) { ledger.push({ ...base, sourceEvidenceIds: evidence, included: false, reason: "terminal-or-ineligible-next-event" }); continue; }
      const days = dayNumber(successor.occurredOn) - dayNumber(anchor.occurredOn);
      if (days === 0) { ledger.push({ ...base, sourceEvidenceIds: evidence, included: false, reason: "same-calendar-day" }); continue; }
      if (days < 0) { ledger.push({ ...base, sourceEvidenceIds: evidence, included: false, reason: "non-forward-interval" }); continue; }
      if (successor.firstObservedOn <= anchor.firstObservedOn) { ledger.push({ ...base, sourceEvidenceIds: evidence, included: false, reason: "endpoint-not-after-anchor-observed" }); continue; }
      const targetId = `next-prerelease:${anchor.eventId}:${successor.eventId}`;
      targets.push({ targetId, targetKind: "next-eligible-prerelease-event", releaseId, platformId: anchor.platformId, productFamilyId: anchor.productFamilyId, anchorEventId: anchor.eventId, anchorStage: anchor.stage, anchorOccurredOn: anchor.occurredOn, originOn: anchor.firstObservedOn, endpointEventId: successor.eventId, endpointStage: successor.stage, endpointEligibleStage, endpointOccurredOn: successor.occurredOn, endpointFirstObservedOn: successor.firstObservedOn, actualDays: days, sourceEvidenceIds: evidence });
      ledger.push({ ...base, sourceEvidenceIds: evidence, included: true, targetId });
    }
  }
  return { targets: sorted(targets, (target) => target.targetId), ledger: sorted(ledger, (entry) => `${entry.releaseId}\u0000${entry.anchorEventId}`) };
}

function stagePrediction(heldout: Pick<NextEligiblePrereleaseEventTargetV1, "platformId" | "anchorStage">, training: readonly NextEligiblePrereleaseEventTargetV1[]): NextEligiblePrereleaseStagePredictionV1 {
  const platform = training.filter((row) => row.platformId === heldout.platformId);
  const exact = platform.filter((row) => row.anchorStage === heldout.anchorStage);
  const cohort = exact.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? exact : platform;
  const fallback = cohort !== exact;
  const cohortName = fallback ? "platform-pooled" : "platform-anchor-stage";
  const ids = sorted(cohort, (row) => row.targetId).map((row) => row.targetId);
  if (cohort.length < NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES) return { available: false, reason: "minimum-training-examples", cohort: cohortName, fallback, trainingTargetIds: ids, modalCount: null, modalShare: null };
  const counts = new Map<EligiblePrereleaseStage, number>();
  for (const row of cohort) counts.set(row.endpointEligibleStage, (counts.get(row.endpointEligibleStage) ?? 0) + 1);
  const ranked = [...counts.entries()].sort(([a, aCount], [b, bCount]) => bCount - aCount || textOrder(a, b));
  const [stage, count] = ranked[0]!;
  const tied = ranked.length > 1 && ranked[1]![1] === count;
  const share = count / cohort.length;
  if (tied || share < NEXT_ELIGIBLE_PRERELEASE_EVENT_MODE_THRESHOLD) return { available: false, reason: "nonunique-or-weak-mode", cohort: cohortName, fallback, trainingTargetIds: ids, modalCount: count, modalShare: share };
  return { available: true, predictedEligibleStage: stage, cohort: cohortName, fallback, trainingTargetIds: ids, modalCount: count, modalShare: share };
}

function timingPrediction(heldout: Pick<NextEligiblePrereleaseEventTargetV1, "platformId" | "anchorStage">, stage: NextEligiblePrereleaseStagePredictionV1, training: readonly NextEligiblePrereleaseEventTargetV1[]): NextEligiblePrereleaseTimingPredictionV1 {
  if (!stage.available) return { available: false, reason: "stage-unavailable", cohort: null, fallback: false, trainingTargetIds: [] };
  const platformTarget = training.filter((row) => row.platformId === heldout.platformId && row.endpointEligibleStage === stage.predictedEligibleStage);
  const exact = platformTarget.filter((row) => row.anchorStage === heldout.anchorStage);
  const cohort = exact.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? exact : platformTarget;
  const fallback = cohort !== exact;
  const cohortName = fallback ? "platform-next-stage-pooled" : "platform-anchor-stage-and-next-stage";
  const ids = sorted(cohort, (row) => row.targetId).map((row) => row.targetId);
  if (cohort.length < NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES) return { available: false, reason: "minimum-training-examples", cohort: cohortName, fallback, trainingTargetIds: ids };
  return { available: true, pointDays: median(cohort.map((row) => row.actualDays)), cohort: cohortName, fallback, trainingTargetIds: ids };
}

type AvailableForecast = NextEligiblePrereleaseEventForecastV1 & { stage: Extract<NextEligiblePrereleaseStagePredictionV1, { available: true }>; timing: Extract<NextEligiblePrereleaseTimingPredictionV1, { available: true }>; };
function residualRowsFor(outer: AvailableForecast, forecasts: readonly NextEligiblePrereleaseEventForecastV1[]) {
  const ledger: NextEligiblePrereleaseEventResidualV1[] = [];
  const exact: { targetId: string; residual: number }[] = [];
  const platformTarget: { targetId: string; residual: number }[] = [];
  for (const inner of forecasts) {
    const base = { outerFoldId: outer.fold.foldId, innerFoldId: inner.fold.foldId, innerTargetId: inner.fold.heldoutTargetId };
    if (inner.fold.heldoutTargetId === outer.fold.heldoutTargetId) { ledger.push({ ...base, included: false, reason: "target-never-residual" }); continue; }
    if (inner.fold.originOn >= outer.fold.originOn) { ledger.push({ ...base, included: false, reason: "inner-origin-not-before-outer-origin" }); continue; }
    if (inner.target.endpointFirstObservedOn > outer.fold.originOn) { ledger.push({ ...base, included: false, reason: "inner-endpoint-not-visible-at-outer-origin" }); continue; }
    if (inner.fold.trainingTargetIds.includes(inner.fold.heldoutTargetId)) { ledger.push({ ...base, included: false, reason: "inner-self-trained" }); continue; }
    if (inner.target.platformId !== outer.target.platformId) { ledger.push({ ...base, included: false, reason: "foreign-platform" }); continue; }
    // A stage miss has no elapsed-time residual for the model's predicted
    // target definition. For example, a forecast of developer beta whose
    // realized immediate event was public beta must not calibrate the
    // developer-beta timing interval with public-beta timing.
    if (!inner.stage.available || !inner.timing.available || inner.stage.predictedEligibleStage !== outer.stage.predictedEligibleStage || inner.target.endpointEligibleStage !== inner.stage.predictedEligibleStage) { ledger.push({ ...base, included: false, reason: "target-definition-mismatch" }); continue; }
    const residual = Math.abs(inner.target.actualDays - inner.timing.pointDays);
    ledger.push({ ...base, included: true, residualDays: residual });
    platformTarget.push({ targetId: inner.fold.heldoutTargetId, residual });
    if (inner.target.anchorStage === outer.target.anchorStage && inner.timing.cohort === outer.timing.cohort) exact.push({ targetId: inner.fold.heldoutTargetId, residual });
  }
  const order = (rows: readonly { targetId: string; residual: number }[]) => [...rows].sort((a, b) => a.residual - b.residual || textOrder(a.targetId, b.targetId));
  return { ledger, exact: order(exact), platformTarget: order(platformTarget) };
}

function intervals(pointDays: number, pool: readonly { targetId: string; residual: number }[]): NextEligiblePrereleaseIntervalV1[] {
  return NEXT_ELIGIBLE_PRERELEASE_EVENT_INTERVAL_LEVELS.map((level) => {
    if (pool.length < NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES) return { level, available: false, reason: "minimum-residuals", residualCount: pool.length };
    const rank = Math.min(pool.length, Math.max(1, Math.ceil(level * (pool.length + 1))));
    const quantileResidualDays = pool[rank - 1]!.residual;
    return { level, available: true, residualCount: pool.length, rank, quantileResidualDays, lowerDays: pointDays - quantileResidualDays, pointDays, upperDays: pointDays + quantileResidualDays };
  });
}

function deriveCore(sourceDataset: HistoricalAnalysisDatasetV1, config: NextEligiblePrereleaseEventConfigV1) {
  const { targets, ledger } = deriveTargets(sourceDataset);
  const folds = targets.map((target) => ({ foldId: `fold:${target.targetId}`, heldoutTargetId: target.targetId, originOn: target.originOn, trainingTargetIds: sorted(trainingFor(target.targetId, target.originOn, targets), (row) => row.targetId).map((row) => row.targetId) }));
  const provisional = folds.map((fold) => {
    const target = targets.find((row) => row.targetId === fold.heldoutTargetId)!;
    const training = trainingFor(target.targetId, fold.originOn, targets);
    return { fold, target, stage: stagePrediction(target, training), timing: timingPrediction(target, stagePrediction(target, training), training) };
  });
  const baseForecasts = provisional.map((row): NextEligiblePrereleaseEventForecastV1 => ({ fold: row.fold, target: { releaseId: row.target.releaseId, platformId: row.target.platformId, productFamilyId: row.target.productFamilyId, anchorEventId: row.target.anchorEventId, anchorStage: row.target.anchorStage, anchorOccurredOn: row.target.anchorOccurredOn, endpointEligibleStage: row.target.endpointEligibleStage, endpointOccurredOn: row.target.endpointOccurredOn, endpointFirstObservedOn: row.target.endpointFirstObservedOn, actualDays: row.target.actualDays }, stage: row.stage, timing: row.timing, residualPool: { exactCount: 0, platformTargetCount: 0, selectedPool: "unavailable", residualTargetIds: [] }, intervals: intervals(row.timing.available ? row.timing.pointDays : 0, []) }));
  const residualLedger: NextEligiblePrereleaseEventResidualV1[] = [];
  const forecasts = baseForecasts.map((forecast) => {
    if (!forecast.stage.available || !forecast.timing.available) return forecast;
    const pools = residualRowsFor(forecast as AvailableForecast, baseForecasts);
    residualLedger.push(...pools.ledger);
    const selected = pools.exact.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? pools.exact : pools.platformTarget.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? pools.platformTarget : [];
    const selectedPool = pools.exact.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? "exact" as const : pools.platformTarget.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? "platform-target-fallback" as const : "unavailable" as const;
    return { ...forecast, residualPool: { exactCount: pools.exact.length, platformTargetCount: pools.platformTarget.length, selectedPool, residualTargetIds: selected.map((row) => row.targetId) }, intervals: intervals(forecast.timing.pointDays, selected) };
  });
  return { modelVersion: NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION, config, sourceDataset, targets, exclusionLedger: ledger, folds: sorted(folds, (row) => row.foldId), forecasts: sorted(forecasts, (row) => row.fold.foldId), residualLedger: sorted(residualLedger, (row) => `${row.outerFoldId}\u0000${row.innerFoldId}`) } as const;
}

const CODE_MANIFEST = { algorithm: "next-eligible-prerelease-event-v1;immediate-verified-prerelease-only;historical-anchor-origin;active-latest-known-event-must-be-prerelease;known-at-origin-training;platform-only;unique-mode-60-percent;median;strict-earlier-origin-target-definition-calibration", version: NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION, minimumExamples: NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES, modeThreshold: NEXT_ELIGIBLE_PRERELEASE_EVENT_MODE_THRESHOLD, levels: NEXT_ELIGIBLE_PRERELEASE_EVENT_INTERVAL_LEVELS } as const;
export const NEXT_ELIGIBLE_PRERELEASE_EVENT_CODE_FINGERPRINT = historicalAnalysisFingerprint(CODE_MANIFEST);

export function buildNextEligiblePrereleaseEventModel(sourceDataset: HistoricalAnalysisDatasetV1, config: NextEligiblePrereleaseEventConfigV1 = DEFAULT_NEXT_ELIGIBLE_PRERELEASE_EVENT_CONFIG): NextEligiblePrereleaseEventModelV1 {
  const issues = [...validateHistoricalAnalysisDataset(sourceDataset).map((issue) => ({ code: "invalid-source-dataset" as const, path: `sourceDataset.${issue.path}`, message: issue.message })), ...configIssues(config)];
  if (issues.length) throw new NextEligiblePrereleaseEventInputError(issues);
  const core = deriveCore(sourceDataset, config);
  const sourceDatasetFingerprint = sourceDataset.fingerprints.datasetFingerprint;
  const configFingerprint = historicalAnalysisFingerprint(config);
  const codeFingerprint = NEXT_ELIGIBLE_PRERELEASE_EVENT_CODE_FINGERPRINT;
  const fingerprints = { sourceDatasetFingerprint, configFingerprint, codeFingerprint, resultFingerprint: historicalAnalysisFingerprint({ core, sourceDatasetFingerprint, configFingerprint, codeFingerprint }) };
  const result = { ...core, fingerprints };
  const outputIssues = validateNextEligiblePrereleaseEventModel(result);
  if (outputIssues.length) throw new NextEligiblePrereleaseEventInputError(outputIssues);
  return result;
}

/** Select the latest verified event for an active cycle, then require it to be prerelease. */
export function predictNextEligiblePrereleaseEvent(sourceDataset: HistoricalAnalysisDatasetV1, releaseId: string, artifact: NextEligiblePrereleaseEventModelV1 = buildNextEligiblePrereleaseEventModel(sourceDataset)) {
  try {
    if (validateHistoricalAnalysisDataset(sourceDataset).length || validateNextEligiblePrereleaseEventModel(artifact).length || artifact.fingerprints.sourceDatasetFingerprint !== sourceDataset.fingerprints.datasetFingerprint) return null;
    const cycle = sourceDataset.releaseCycles.find((row) => row.releaseId === releaseId);
    const cutoff = sourceDataset.provenance.sourceAsOfDate;
    if (!cycle?.included || cycle.lifecycle !== "active" || cycle.chronologyCoverage.state !== "complete") return null;
    const knownEvents = sourceDataset.canonicalEvents.filter((row) => row.releaseId === releaseId && row.firstObservedOn <= cutoff && row.occurredOn <= cutoff);
    if (!knownEvents.length) return null;
    const ordering = orderCycle(knownEvents);
    const anchor = ordering.events[ordering.events.length - 1];
    // Never skip a later GM, public release, descriptive appearance, or an
    // ambiguously ordered event to reuse an older beta as the active anchor.
    if (!anchor || !eligiblePrereleaseStage(anchor.stage) || ordering.ambiguousEventIds.has(anchor.eventId) || ordering.ambiguousFollowingEventIds.has(anchor.eventId)) return null;
    const target = { platformId: anchor.platformId, anchorStage: anchor.stage };
    const training = trainingFor(null, cutoff, artifact.targets);
    const stage = stagePrediction(target, training);
    const timing = timingPrediction(target, stage, training);
    if (!stage.available || !timing.available) return { anchorEventId: anchor.eventId, anchorStage: anchor.stage, originOn: cutoff, stage, timing, residualPool: { exactCount: 0, platformTargetCount: 0, selectedPool: "unavailable" as const, residualTargetIds: [] }, intervals: intervals(0, []) };
    const historic = artifact.forecasts.filter((forecast) => forecast.stage.available && forecast.timing.available && forecast.fold.originOn < cutoff && forecast.target.endpointFirstObservedOn <= cutoff);
    const synthetic: AvailableForecast = { fold: { foldId: `active:${anchor.eventId}`, heldoutTargetId: `active:${anchor.eventId}`, originOn: cutoff, trainingTargetIds: sorted(training, (row) => row.targetId).map((row) => row.targetId) }, target: { releaseId, platformId: anchor.platformId, productFamilyId: anchor.productFamilyId, anchorEventId: anchor.eventId, anchorStage: anchor.stage, anchorOccurredOn: anchor.occurredOn, endpointEligibleStage: stage.predictedEligibleStage, endpointOccurredOn: "", endpointFirstObservedOn: "", actualDays: 0 }, stage, timing, residualPool: { exactCount: 0, platformTargetCount: 0, selectedPool: "unavailable", residualTargetIds: [] }, intervals: [] };
    const pools = residualRowsFor(synthetic, historic);
    const selected = pools.exact.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? pools.exact : pools.platformTarget.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? pools.platformTarget : [];
    const selectedPool = pools.exact.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? "exact" as const : pools.platformTarget.length >= NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES ? "platform-target-fallback" as const : "unavailable" as const;
    return { anchorEventId: anchor.eventId, anchorStage: anchor.stage, originOn: cutoff, stage, timing, residualPool: { exactCount: pools.exact.length, platformTargetCount: pools.platformTarget.length, selectedPool, residualTargetIds: selected.map((row) => row.targetId) }, intervals: intervals(timing.pointDays, selected) };
  } catch { return null; }
}

/** Strict no-throw validator that recomputes the entire private model. */
export function validateNextEligiblePrereleaseEventModel(value: unknown): NextEligiblePrereleaseEventValidationIssue[] {
  try {
    if (!isRecord(value)) return [{ code: "invalid-input", path: "model", message: "Model must be an object." }];
    const issues: NextEligiblePrereleaseEventValidationIssue[] = [];
    if (value.modelVersion !== NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION) issues.push({ code: "unsupported-version", path: "modelVersion", message: `Expected ${NEXT_ELIGIBLE_PRERELEASE_EVENT_VERSION}.` });
    issues.push(...configIssues(value.config));
    if (!isRecord(value.sourceDataset)) issues.push({ code: "invalid-source-dataset", path: "sourceDataset", message: "A historical dataset is required." });
    else for (const issue of validateHistoricalAnalysisDataset(value.sourceDataset)) issues.push({ code: "invalid-source-dataset", path: `sourceDataset.${issue.path}`, message: issue.message });
    for (const field of ["targets", "exclusionLedger", "folds", "forecasts", "residualLedger"] as const) if (!Array.isArray(value[field])) issues.push({ code: "invalid-row", path: field, message: `${field} must be an array.` });
    if (!isRecord(value.fingerprints)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Fingerprints are required." });
    if (issues.length) return issues;
    const sourceDataset = value.sourceDataset as HistoricalAnalysisDatasetV1;
    const config = value.config as NextEligiblePrereleaseEventConfigV1;
    const fingerprints = value.fingerprints as Record<string, unknown>;
    if (fingerprints.sourceDatasetFingerprint !== sourceDataset.fingerprints.datasetFingerprint || fingerprints.configFingerprint !== historicalAnalysisFingerprint(config) || fingerprints.codeFingerprint !== NEXT_ELIGIBLE_PRERELEASE_EVENT_CODE_FINGERPRINT || typeof fingerprints.resultFingerprint !== "string" || !SHA_256.test(fingerprints.resultFingerprint)) issues.push({ code: "invalid-fingerprint", path: "fingerprints", message: "Source, config, code, or result fingerprints are invalid." });
    const core = deriveCore(sourceDataset, config);
    for (const field of ["modelVersion", "config", "sourceDataset", "targets", "exclusionLedger", "folds", "forecasts", "residualLedger"] as const) if (stableSerializeHistoricalAnalysis(value[field]) !== stableSerializeHistoricalAnalysis(core[field])) issues.push({ code: "invalid-row", path: field, message: "Rows do not match deterministic next-event semantics." });
    if (fingerprints.resultFingerprint !== historicalAnalysisFingerprint({ core, sourceDatasetFingerprint: fingerprints.sourceDatasetFingerprint, configFingerprint: fingerprints.configFingerprint, codeFingerprint: fingerprints.codeFingerprint })) issues.push({ code: "invalid-fingerprint", path: "fingerprints.resultFingerprint", message: "Result fingerprint does not bind source, config, code, and output." });
    return issues;
  } catch { return [{ code: "invalid-input", path: "model", message: "Model could not be validated safely." }]; }
}
