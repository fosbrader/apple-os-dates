/**
 * Canonical, storage-independent inputs for forecast and historical-analysis
 * work. This contract deliberately does not project Sanity documents or the
 * legacy milestone read model; an adapter must make that mapping explicitly.
 */
export const FORECAST_ANALYSIS_CONTRACT_VERSION = "forecast-analysis/v1";

const FORECAST_ANALYSIS_CHANNELS = [
  "developerBeta",
  "publicBeta",
  "releaseCandidate",
  "goldenMaster",
  "public",
  "securityResponse",
  "recovery",
  "other",
] as const;

const FORECAST_ANALYSIS_AVAILABILITY = [
  "available",
  "withdrawn",
  "replaced",
  "superseded",
] as const;

const FORECAST_ANALYSIS_RELEASE_LIFECYCLES = [
  "active",
  "released",
  "superseded",
] as const;

export type ForecastAnalysisChannel =
  (typeof FORECAST_ANALYSIS_CHANNELS)[number];
export type ForecastAnalysisAvailability =
  (typeof FORECAST_ANALYSIS_AVAILABILITY)[number];
export type ForecastAnalysisReleaseLifecycle =
  (typeof FORECAST_ANALYSIS_RELEASE_LIFECYCLES)[number];

export type CanonicalForecastStage =
  | `developer-beta:${number}`
  | `public-beta:${number}`
  | `release-candidate:${number}`
  | "golden-master"
  | "public-release";

export interface ForecastAnalysisReleaseV1 {
  /** Stable identity for one release cycle. */
  id: string;
  /** Lifecycle is explicit so superseded cycles cannot enter shipped cohorts. */
  lifecycle: ForecastAnalysisReleaseLifecycle;
  /** Calendar day on which the lifecycle state became effective, when known. */
  statusEffectiveOn?: string;
  /** First day on which the lifecycle fact was available to this corpus. */
  statusFirstObservedOn?: string;
}

export interface ForecastAnalysisEventV1 {
  /** Stable event identity within the adapter's source system. */
  id: string;
  /** Stable release-cycle identity; it scopes stages and ordering. */
  releaseId: string;
  /** The verified calendar day on which the appearance occurred. */
  occurredOn: string;
  /**
   * The first calendar day on which this event fact was available to the
   * analysis corpus. It is independent of the occurrence date so historical
   * backtests cannot use a correction that was learned later.
   */
  firstObservedOn: string;
  channel: ForecastAnalysisChannel;
  /** Channel-local ordinal. Required for beta and RC forecast stages. */
  sequence?: number;
  /**
   * Optional verified ordering among appearances on the same release/day.
   * This can resolve identity precedence, but it does not create a measurable
   * date interval for timing analysis.
   */
  sameDayOrder?: number;
  availability: ForecastAnalysisAvailability;
  /** A revision has the same canonical stage as its original. */
  isRevision: boolean;
  /** Stable event ID directly revised by this event. */
  revisionOfId?: string;
  /** Non-analytic text retained for display and audit context only. */
  displayLabel?: string;
  note?: string;
}

export interface ForecastAnalysisDatasetV1 {
  contractVersion: typeof FORECAST_ANALYSIS_CONTRACT_VERSION;
  /** Inclusive UTC calendar-day cutoff for an as-of analysis. */
  dataCutoff: string;
  releases: readonly ForecastAnalysisReleaseV1[];
  events: readonly ForecastAnalysisEventV1[];
}

export type ForecastAnalysisValidationCode =
  | "unsupported-contract-version"
  | "invalid-data-cutoff"
  | "duplicate-release-id"
  | "missing-release-id"
  | "invalid-release-lifecycle"
  | "missing-release-lifecycle-dates"
  | "invalid-status-effective-on"
  | "invalid-status-first-observed-on"
  | "status-observed-before-effective"
  | "duplicate-event-id"
  | "missing-event-id"
  | "unknown-event-release"
  | "invalid-channel"
  | "invalid-availability"
  | "invalid-occurred-on"
  | "invalid-first-observed-on"
  | "first-observed-before-occurrence"
  | "invalid-sequence"
  | "missing-stage-sequence"
  | "unexpected-stage-sequence"
  | "invalid-same-day-order"
  | "duplicate-same-day-order"
  | "missing-revision-link"
  | "unexpected-revision-link"
  | "unknown-revision-target"
  | "cross-release-revision"
  | "cross-stage-revision"
  | "ambiguous-effective-stage";

export interface ForecastAnalysisValidationIssue {
  code: ForecastAnalysisValidationCode;
  path: string;
  message: string;
}

export type ForecastEventExclusionReason =
  | "future-occurrence"
  | "not-observed-by-cutoff"
  | "withdrawn"
  | "replaced"
  | "superseded"
  | "superseded-cycle"
  | "missing-release-cycle"
  | "invalid-release-lifecycle"
  | "release-lifecycle-date-unknown"
  | "invalid-channel"
  | "invalid-availability"
  | "descriptive-channel"
  | "missing-canonical-stage"
  | "ambiguous-stage-revision";

export type ForecastEventEligibility =
  | { eligible: true; stage: CanonicalForecastStage }
  | { eligible: false; reason: ForecastEventExclusionReason };

export type ForecastReleaseLifecycleAtCutoff =
  | { available: true; lifecycle: ForecastAnalysisReleaseLifecycle }
  | {
      available: false;
      reason:
        | "invalid-release-lifecycle"
        | "release-lifecycle-date-unknown";
    };

export type ForecastIntervalOutcome =
  | { available: true; days: number }
  | {
      available: false;
      reason:
        | "different-release-cycle"
        | "invalid-calendar-day"
        | "same-calendar-day"
        | "non-forward-interval";
    };

const CHANNEL_SET = new Set<string>(FORECAST_ANALYSIS_CHANNELS);
const AVAILABILITY_SET = new Set<string>(FORECAST_ANALYSIS_AVAILABILITY);
const RELEASE_LIFECYCLE_SET = new Set<string>(
  FORECAST_ANALYSIS_RELEASE_LIFECYCLES,
);

const STAGED_CHANNELS = new Set<ForecastAnalysisChannel>([
  "developerBeta",
  "publicBeta",
  "releaseCandidate",
]);

const DESCRIPTIVE_CHANNELS = new Set<ForecastAnalysisChannel>([
  "securityResponse",
  "recovery",
  "other",
]);

function isIsoDay(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isoDayNumber(value: string): number {
  const [year, month, day] = value.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

function isPositiveInteger(value: number | undefined): value is number {
  return Number.isInteger(value) && (value ?? 0) > 0;
}

function isChannel(value: unknown): value is ForecastAnalysisChannel {
  return typeof value === "string" && CHANNEL_SET.has(value);
}

function isAvailability(
  value: unknown,
): value is ForecastAnalysisAvailability {
  return typeof value === "string" && AVAILABILITY_SET.has(value);
}

function isReleaseLifecycle(
  value: unknown,
): value is ForecastAnalysisReleaseLifecycle {
  return typeof value === "string" && RELEASE_LIFECYCLE_SET.has(value);
}

function compareText(left: string, right: string): -1 | 0 | 1 {
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Derive the analysis stage only from normalized channel and channel-local
 * sequence. Display labels are deliberately not an input to this function.
 */
export function canonicalForecastStage(
  event: Pick<ForecastAnalysisEventV1, "channel" | "sequence">,
): CanonicalForecastStage | null {
  if (!isChannel(event.channel)) return null;
  if (event.channel === "goldenMaster") return "golden-master";
  if (event.channel === "public") return "public-release";
  if (!STAGED_CHANNELS.has(event.channel) || !isPositiveInteger(event.sequence)) {
    return null;
  }

  switch (event.channel) {
    case "developerBeta":
      return `developer-beta:${event.sequence}` as CanonicalForecastStage;
    case "publicBeta":
      return `public-beta:${event.sequence}` as CanonicalForecastStage;
    case "releaseCandidate":
      return `release-candidate:${event.sequence}` as CanonicalForecastStage;
  }

  return null;
}

/**
 * Return verified relative identity order for two same-day appearances. This
 * must not be used as a timing interval: a date-only same-day interval is
 * always unavailable through forecastIntervalOutcome.
 */
export function compareVerifiedSameDayOrder(
  left: Pick<
    ForecastAnalysisEventV1,
    "releaseId" | "occurredOn" | "sameDayOrder"
  >,
  right: Pick<
    ForecastAnalysisEventV1,
    "releaseId" | "occurredOn" | "sameDayOrder"
  >,
): -1 | 0 | 1 | null {
  if (
    left.releaseId !== right.releaseId ||
    left.occurredOn !== right.occurredOn ||
    !isPositiveInteger(left.sameDayOrder) ||
    !isPositiveInteger(right.sameDayOrder)
  ) {
    return null;
  }

  return left.sameDayOrder === right.sameDayOrder
    ? 0
    : left.sameDayOrder < right.sameDayOrder
      ? -1
      : 1;
}

/** Return a measurable forward calendar-day interval or an explicit reason. */
export function forecastIntervalOutcome(
  start: Pick<ForecastAnalysisEventV1, "releaseId" | "occurredOn">,
  end: Pick<ForecastAnalysisEventV1, "releaseId" | "occurredOn">,
): ForecastIntervalOutcome {
  if (start.releaseId !== end.releaseId) {
    return { available: false, reason: "different-release-cycle" };
  }
  if (!isIsoDay(start.occurredOn) || !isIsoDay(end.occurredOn)) {
    return { available: false, reason: "invalid-calendar-day" };
  }
  if (start.occurredOn === end.occurredOn) {
    return { available: false, reason: "same-calendar-day" };
  }

  const days = isoDayNumber(end.occurredOn) - isoDayNumber(start.occurredOn);
  return days > 0
    ? { available: true, days }
    : { available: false, reason: "non-forward-interval" };
}

/**
 * Resolve lifecycle state without using a transition learned after the
 * analysis cutoff. Active is the pre-transition state for a later released or
 * superseded outcome. Non-active records without both dates fail closed.
 */
export function forecastReleaseLifecycleAtCutoff(
  release: ForecastAnalysisReleaseV1,
  dataCutoff: string,
): ForecastReleaseLifecycleAtCutoff {
  if (!isReleaseLifecycle(release.lifecycle)) {
    return { available: false, reason: "invalid-release-lifecycle" };
  }
  if (release.lifecycle === "active") {
    return { available: true, lifecycle: "active" };
  }
  if (!release.statusEffectiveOn || !release.statusFirstObservedOn) {
    return {
      available: false,
      reason: "release-lifecycle-date-unknown",
    };
  }

  return release.statusEffectiveOn <= dataCutoff &&
    release.statusFirstObservedOn <= dataCutoff
    ? { available: true, lifecycle: release.lifecycle }
    : { available: true, lifecycle: "active" };
}

/** Apply the inclusive cutoff and analytic eligibility rules to one event. */
export function forecastEventEligibility(
  event: ForecastAnalysisEventV1,
  dataCutoff: string,
  release?: ForecastAnalysisReleaseV1,
): ForecastEventEligibility {
  if (event.occurredOn > dataCutoff) {
    return { eligible: false, reason: "future-occurrence" };
  }
  if (event.firstObservedOn > dataCutoff) {
    return { eligible: false, reason: "not-observed-by-cutoff" };
  }
  if (!isAvailability(event.availability)) {
    return { eligible: false, reason: "invalid-availability" };
  }
  if (event.availability !== "available") {
    return { eligible: false, reason: event.availability };
  }
  if (!release) {
    return { eligible: false, reason: "missing-release-cycle" };
  }
  const lifecycle = forecastReleaseLifecycleAtCutoff(release, dataCutoff);
  if (!lifecycle.available) {
    return { eligible: false, reason: lifecycle.reason };
  }
  if (lifecycle.lifecycle === "superseded") {
    return { eligible: false, reason: "superseded-cycle" };
  }
  if (!isChannel(event.channel)) {
    return { eligible: false, reason: "invalid-channel" };
  }
  if (DESCRIPTIVE_CHANNELS.has(event.channel)) {
    return { eligible: false, reason: "descriptive-channel" };
  }

  const stage = canonicalForecastStage(event);
  return stage
    ? { eligible: true, stage }
    : { eligible: false, reason: "missing-canonical-stage" };
}

function effectiveStageEvent(
  events: Array<ForecastAnalysisEventV1 & { stage: CanonicalForecastStage }>,
): (ForecastAnalysisEventV1 & { stage: CanonicalForecastStage }) | null {
  if (events.length === 1) return events[0];

  const revisedIds = new Set(
    events.map((event) => event.revisionOfId).filter(Boolean),
  );
  const terminals = events.filter((event) => !revisedIds.has(event.id));
  return terminals.length === 1 ? terminals[0] : null;
}

/**
 * Resolve one effective event per release/stage and return a deterministic
 * serialization order. The stable tie-breakers do not assert chronological
 * order among same-day events.
 */
export function eligibleForecastEvents(
  dataset: ForecastAnalysisDatasetV1,
): Array<ForecastAnalysisEventV1 & { stage: CanonicalForecastStage }> {
  const releaseById = new Map(
    dataset.releases.map((release) => [release.id, release]),
  );
  const grouped = new Map<
    string,
    Array<ForecastAnalysisEventV1 & { stage: CanonicalForecastStage }>
  >();

  for (const event of dataset.events) {
    const eligibility = forecastEventEligibility(
      event,
      dataset.dataCutoff,
      releaseById.get(event.releaseId),
    );
    if (!eligibility.eligible) continue;

    const resolved = { ...event, stage: eligibility.stage };
    const key = `${event.releaseId}|${eligibility.stage}`;
    grouped.set(key, [...(grouped.get(key) ?? []), resolved]);
  }

  return [...grouped.values()]
    .map(effectiveStageEvent)
    .filter(
      (
        event,
      ): event is ForecastAnalysisEventV1 & {
        stage: CanonicalForecastStage;
      } => event !== null,
    )
    .sort(
      (left, right) =>
        compareText(left.releaseId, right.releaseId) ||
        compareText(left.occurredOn, right.occurredOn) ||
        compareText(left.stage, right.stage) ||
        compareText(left.id, right.id),
    );
}

export function validateForecastAnalysisDataset(
  dataset: ForecastAnalysisDatasetV1,
): ForecastAnalysisValidationIssue[] {
  const issues: ForecastAnalysisValidationIssue[] = [];

  if (dataset.contractVersion !== FORECAST_ANALYSIS_CONTRACT_VERSION) {
    issues.push({
      code: "unsupported-contract-version",
      path: "contractVersion",
      message: `Expected ${FORECAST_ANALYSIS_CONTRACT_VERSION}.`,
    });
  }
  if (!isIsoDay(dataset.dataCutoff)) {
    issues.push({
      code: "invalid-data-cutoff",
      path: "dataCutoff",
      message: "dataCutoff must be an ISO UTC calendar day (YYYY-MM-DD).",
    });
  }

  const releaseIds = new Set<string>();
  for (const [index, release] of dataset.releases.entries()) {
    const path = `releases[${index}]`;
    if (!release.id.trim()) {
      issues.push({
        code: "missing-release-id",
        path: `${path}.id`,
        message: "Release id is required.",
      });
    } else if (releaseIds.has(release.id)) {
      issues.push({
        code: "duplicate-release-id",
        path: `${path}.id`,
        message: `Release id ${release.id} is duplicated.`,
      });
    }
    releaseIds.add(release.id);

    if (!isReleaseLifecycle(release.lifecycle)) {
      issues.push({
        code: "invalid-release-lifecycle",
        path: `${path}.lifecycle`,
        message: "Release lifecycle is not canonical.",
      });
    } else if (
      release.lifecycle !== "active" &&
      (!release.statusEffectiveOn || !release.statusFirstObservedOn)
    ) {
      issues.push({
        code: "missing-release-lifecycle-dates",
        path,
        message:
          "Released and superseded lifecycles require effective and first-observed dates.",
      });
    }
    if (
      release.statusEffectiveOn !== undefined &&
      !isIsoDay(release.statusEffectiveOn)
    ) {
      issues.push({
        code: "invalid-status-effective-on",
        path: `${path}.statusEffectiveOn`,
        message: "statusEffectiveOn must be an ISO UTC calendar day.",
      });
    }
    if (
      release.statusFirstObservedOn !== undefined &&
      !isIsoDay(release.statusFirstObservedOn)
    ) {
      issues.push({
        code: "invalid-status-first-observed-on",
        path: `${path}.statusFirstObservedOn`,
        message: "statusFirstObservedOn must be an ISO UTC calendar day.",
      });
    } else if (
      release.statusEffectiveOn &&
      release.statusFirstObservedOn &&
      release.statusFirstObservedOn < release.statusEffectiveOn
    ) {
      issues.push({
        code: "status-observed-before-effective",
        path: `${path}.statusFirstObservedOn`,
        message: "statusFirstObservedOn cannot precede statusEffectiveOn.",
      });
    }
  }

  const eventById = new Map<string, ForecastAnalysisEventV1>();
  const sameDayOrders = new Set<string>();
  for (const [index, event] of dataset.events.entries()) {
    const path = `events[${index}]`;
    if (!event.id.trim()) {
      issues.push({
        code: "missing-event-id",
        path: `${path}.id`,
        message: "Event id is required.",
      });
    } else if (eventById.has(event.id)) {
      issues.push({
        code: "duplicate-event-id",
        path: `${path}.id`,
        message: `Event id ${event.id} is duplicated.`,
      });
    }
    eventById.set(event.id, event);

    if (!event.releaseId.trim()) {
      issues.push({
        code: "missing-release-id",
        path: `${path}.releaseId`,
        message: "releaseId is required to scope stages and ordering.",
      });
    } else if (!releaseIds.has(event.releaseId)) {
      issues.push({
        code: "unknown-event-release",
        path: `${path}.releaseId`,
        message: `Release ${event.releaseId} is not declared in releases.`,
      });
    }
    if (!isChannel(event.channel)) {
      issues.push({
        code: "invalid-channel",
        path: `${path}.channel`,
        message: "Event channel is not canonical.",
      });
    }
    if (!isAvailability(event.availability)) {
      issues.push({
        code: "invalid-availability",
        path: `${path}.availability`,
        message: "Event availability is not canonical.",
      });
    }
    if (!isIsoDay(event.occurredOn)) {
      issues.push({
        code: "invalid-occurred-on",
        path: `${path}.occurredOn`,
        message: "occurredOn must be an ISO UTC calendar day (YYYY-MM-DD).",
      });
    }
    if (!isIsoDay(event.firstObservedOn)) {
      issues.push({
        code: "invalid-first-observed-on",
        path: `${path}.firstObservedOn`,
        message:
          "firstObservedOn must be an ISO UTC calendar day (YYYY-MM-DD).",
      });
    } else if (
      isIsoDay(event.occurredOn) &&
      event.firstObservedOn < event.occurredOn
    ) {
      issues.push({
        code: "first-observed-before-occurrence",
        path: `${path}.firstObservedOn`,
        message: "firstObservedOn cannot precede occurredOn.",
      });
    }

    if (isChannel(event.channel) && STAGED_CHANNELS.has(event.channel)) {
      if (!isPositiveInteger(event.sequence)) {
        issues.push({
          code:
            event.sequence === undefined
              ? "missing-stage-sequence"
              : "invalid-sequence",
          path: `${path}.sequence`,
          message: `${event.channel} requires a positive integer sequence.`,
        });
      }
    } else if (isChannel(event.channel) && event.sequence !== undefined) {
      issues.push({
        code: "unexpected-stage-sequence",
        path: `${path}.sequence`,
        message: `${event.channel} does not define a forecast stage sequence.`,
      });
    }

    if (event.sameDayOrder !== undefined) {
      if (!isPositiveInteger(event.sameDayOrder)) {
        issues.push({
          code: "invalid-same-day-order",
          path: `${path}.sameDayOrder`,
          message: "sameDayOrder must be a positive integer when known.",
        });
      } else {
        const key = `${event.releaseId}|${event.occurredOn}|${event.sameDayOrder}`;
        if (sameDayOrders.has(key)) {
          issues.push({
            code: "duplicate-same-day-order",
            path: `${path}.sameDayOrder`,
            message:
              "sameDayOrder must be unique within a release and calendar day.",
          });
        }
        sameDayOrders.add(key);
      }
    }

    if (event.isRevision && !event.revisionOfId?.trim()) {
      issues.push({
        code: "missing-revision-link",
        path: `${path}.revisionOfId`,
        message: "A revision must identify the event it revises.",
      });
    } else if (!event.isRevision && event.revisionOfId !== undefined) {
      issues.push({
        code: "unexpected-revision-link",
        path: `${path}.revisionOfId`,
        message: "Only revisions can identify a revised event.",
      });
    }
  }

  for (const [index, event] of dataset.events.entries()) {
    if (!event.revisionOfId) continue;

    const path = `events[${index}].revisionOfId`;
    const target = eventById.get(event.revisionOfId);
    if (!target) {
      issues.push({
        code: "unknown-revision-target",
        path,
        message: `Revision target ${event.revisionOfId} is not in the dataset.`,
      });
      continue;
    }
    if (target.releaseId !== event.releaseId) {
      issues.push({
        code: "cross-release-revision",
        path,
        message: "A revision target must belong to the same release cycle.",
      });
    }
    if (canonicalForecastStage(target) !== canonicalForecastStage(event)) {
      issues.push({
        code: "cross-stage-revision",
        path,
        message: "A revision target must have the same canonical stage.",
      });
    }
  }

  const stageGroups = new Map<string, ForecastAnalysisEventV1[]>();
  for (const event of dataset.events) {
    if (event.availability !== "available") continue;
    const stage = canonicalForecastStage(event);
    if (!stage) continue;
    const key = `${event.releaseId}|${stage}`;
    stageGroups.set(key, [...(stageGroups.get(key) ?? []), event]);
  }
  for (const [key, events] of stageGroups) {
    if (events.length < 2) continue;
    const revisedIds = new Set(
      events.map((event) => event.revisionOfId).filter(Boolean),
    );
    const terminals = events.filter((event) => !revisedIds.has(event.id));
    if (terminals.length !== 1) {
      issues.push({
        code: "ambiguous-effective-stage",
        path: "events",
        message: `${key} has ${terminals.length} effective events; revision linkage must resolve one.`,
      });
    }
  }

  return issues;
}
