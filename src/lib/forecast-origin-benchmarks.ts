import {
  FORECAST_CURRENT_PUBLIC_HEURISTIC_VERSION,
  CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
  FORECAST_INTERVAL_ROUNDING_RULE,
  FORECAST_ORIGIN_BENCHMARK_VERSION,
  type ForecastArtifactBenchmarkV1,
} from "./forecast-artifact-contracts";
import { buildReleaseForecasts, type ReleaseForecast } from "./forecasts";
import {
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
  type HistoricalAnalysisDatasetV1,
  type HistoricalCanonicalEventRow,
  type HistoricalReleaseCycleRow,
} from "./historical-analysis-dataset";
import type {
  LegacyForecastMilestoneInput,
  LegacyForecastReleaseInput,
  PublishedForecastShadowSource,
} from "./historical-release-source";
import {
  compatibilityEvidenceId,
  firstClassEvidenceId,
} from "./release-observation-adapter";
import type { BetaMilestone, ReleaseVersion } from "./types";

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactKeys(
  value: Record<string, unknown>,
  required: readonly string[],
  optional: readonly string[] = [],
): boolean {
  const allowed = new Set([...required, ...optional]);
  return (
    required.every((key) => Object.hasOwn(value, key)) &&
    Object.keys(value).every((key) => allowed.has(key))
  );
}

function validDay(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DAY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function normalizedLifecycle(
  value: LegacyForecastReleaseInput["lifecycle"] | null | undefined,
  publicReleaseDate: string | null | undefined,
): "active" | "released" | "superseded" {
  if (value === "active" || value === "released" || value === "superseded") {
    return value;
  }
  return publicReleaseDate ? "released" : "active";
}

function validLegacyRelease(value: unknown): value is LegacyForecastReleaseInput {
  if (!isRecord(value) || !exactKeys(value, ["id", "version", "platform"], ["lifecycle", "publicReleaseDate"])) return false;
  if (
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.version !== "string" ||
    !value.version.trim() ||
    !isRecord(value.platform) ||
    !exactKeys(value.platform, ["id", "name", "slug", "sortOrder"]) ||
    typeof value.platform.id !== "string" ||
    !value.platform.id.trim() ||
    typeof value.platform.name !== "string" ||
    !value.platform.name.trim() ||
    typeof value.platform.slug !== "string" ||
    !value.platform.slug.trim() ||
    !Number.isSafeInteger(value.platform.sortOrder)
  ) {
    return false;
  }
  if (
    value.lifecycle !== undefined &&
    value.lifecycle !== null &&
    !["active", "released", "superseded"].includes(value.lifecycle as string)
  ) {
    return false;
  }
  return value.publicReleaseDate === undefined || value.publicReleaseDate === null || validDay(value.publicReleaseDate);
}

function validLegacyMilestone(value: unknown): value is LegacyForecastMilestoneInput {
  return (
    isRecord(value) &&
    exactKeys(value, ["id", "releaseId", "label", "occurredOn"]) &&
    typeof value.id === "string" &&
    Boolean(value.id.trim()) &&
    typeof value.releaseId === "string" &&
    Boolean(value.releaseId.trim()) &&
    typeof value.label === "string" &&
    Boolean(value.label.trim()) &&
    validDay(value.occurredOn)
  );
}

function addDays(value: string, days: number): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days))
    .toISOString()
    .slice(0, 10);
}

function unavailableCurrentBenchmark(
  snapshot: FrozenCurrentPublicHeuristicSnapshotV1,
  reason:
    | "release-mapping-unproven"
    | "anchor-mapping-unproven"
    | "heuristic-unavailable"
    | "heuristic-paused"
    | "incomparable-target-definition",
): ForecastArtifactBenchmarkV1 {
  return {
    benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
    benchmarkId: "current-public-heuristic",
    modelVersion: FORECAST_CURRENT_PUBLIC_HEURISTIC_VERSION,
    sourceFingerprint: snapshot.sourceFingerprint,
    modelFingerprint: snapshot.modelFingerprint,
    calibrationFingerprint: null,
    cohorts: [],
    availability: "unavailable",
    reason,
  };
}

interface FrozenCurrentPublicHeuristicReleaseV1 {
  id: string;
  version: string;
  lifecycle: "active" | "released" | "superseded";
  publicReleaseDate: string | null;
  platform: LegacyForecastReleaseInput["platform"];
  milestones: readonly LegacyForecastMilestoneInput[];
}

export interface FrozenCurrentPublicHeuristicSnapshotV1 {
  sourceFingerprint: string;
  modelFingerprint: string;
  releases: readonly FrozenCurrentPublicHeuristicReleaseV1[];
  forecasts: readonly ReleaseForecast[];
  rawSource: PublishedForecastShadowSource;
}

/**
 * Build the frozen current-site comparator from a separate, bounded legacy
 * projection. Every admitted lifecycle and milestone fact must match the
 * analytical projection and be visible at the exact requested cutoff.
 */
export function buildFrozenCurrentPublicHeuristicSnapshot(args: {
  source: PublishedForecastShadowSource;
  dataset: HistoricalAnalysisDatasetV1;
  requestedAt: string;
  scheduledFor: string;
}): FrozenCurrentPublicHeuristicSnapshotV1 {
  const { source, dataset, requestedAt, scheduledFor } = args;
  if (
    dataset.provenance.sourceAsOfDate !== scheduledFor ||
    dataset.provenance.sourceIssuedAt !== requestedAt ||
    !Array.isArray(source.legacyForecastReleases) ||
    !Array.isArray(source.legacyForecastMilestones) ||
    source.legacyForecastReleases.some((row) => !validLegacyRelease(row)) ||
    source.legacyForecastMilestones.some((row) => !validLegacyMilestone(row))
  ) {
    throw new TypeError("Invalid frozen public heuristic source.");
  }

  const analyticalReleases = new Map<string, PublishedForecastShadowSource["releases"][number]>();
  for (const release of source.releases) {
    if (!release?.id || analyticalReleases.has(release.id)) throw new TypeError("Invalid frozen public heuristic source.");
    analyticalReleases.set(release.id, release);
  }
  const analyticalMilestones = new Map<string, PublishedForecastShadowSource["compatibilityMilestones"][number]>();
  for (const milestone of source.compatibilityMilestones) {
    const key = `${milestone.releaseId}\u0000${milestone.id}`;
    if (analyticalMilestones.has(key)) throw new TypeError("Invalid frozen public heuristic source.");
    analyticalMilestones.set(key, milestone);
  }

  const seenReleases = new Set<string>();
  const seenMilestones = new Set<string>();
  const releases = [...source.legacyForecastReleases]
    .sort((left, right) => compareText(left.id, right.id))
    .flatMap((legacy): FrozenCurrentPublicHeuristicReleaseV1[] => {
      if (seenReleases.has(legacy.id)) throw new TypeError("Invalid frozen public heuristic source.");
      seenReleases.add(legacy.id);
      const analytical = analyticalReleases.get(legacy.id);
      if (!analytical) throw new TypeError("Invalid frozen public heuristic source.");
      const legacyLifecycle = normalizedLifecycle(legacy.lifecycle, legacy.publicReleaseDate);
      const analyticalLifecycle = normalizedLifecycle(
        analytical.lifecycle,
        analytical.publicReleaseDate,
      );
      if (
        legacyLifecycle !== analyticalLifecycle ||
        (legacy.publicReleaseDate ?? null) !==
          (analytical.publicReleaseDate ?? null)
      ) {
        throw new TypeError("Invalid frozen public heuristic source.");
      }
      if (
        analytical.statusFirstObservedAt &&
        analytical.statusFirstObservedAt > requestedAt
      ) {
        return [];
      }
      if (
        analytical.statusEffectiveOn &&
        analytical.statusEffectiveOn > scheduledFor
      ) {
        return [];
      }
      if (
        legacyLifecycle === "released" &&
        (!validDay(legacy.publicReleaseDate) ||
          legacy.publicReleaseDate > scheduledFor)
      ) {
        return [];
      }

      const milestones = source.legacyForecastMilestones
        .filter((row) => row.releaseId === legacy.id)
        .sort(
          (left, right) =>
            compareText(left.occurredOn, right.occurredOn) ||
            compareText(left.id, right.id),
        )
        .flatMap((milestone): LegacyForecastMilestoneInput[] => {
          const milestoneKey = `${milestone.releaseId}\u0000${milestone.id}`;
          if (seenMilestones.has(milestoneKey)) {
            throw new TypeError("Invalid frozen public heuristic source.");
          }
          seenMilestones.add(milestoneKey);
          const analyticalMilestone = analyticalMilestones.get(
            milestoneKey,
          );
          if (
            !analyticalMilestone ||
            analyticalMilestone.occurredOn !== milestone.occurredOn ||
            analyticalMilestone.displayLabel !== milestone.label
          ) {
            throw new TypeError("Invalid frozen public heuristic source.");
          }
          if (
            milestone.occurredOn > scheduledFor ||
            (analyticalMilestone.firstObservedAt &&
              analyticalMilestone.firstObservedAt > requestedAt)
          ) {
            return [];
          }
          return [milestone];
        });
      return [{
        id: legacy.id,
        version: legacy.version,
        lifecycle: legacyLifecycle,
        publicReleaseDate: legacy.publicReleaseDate ?? null,
        platform: { ...legacy.platform },
        milestones,
      }];
    });
  if (
    source.legacyForecastMilestones.some(
      (milestone) => !seenReleases.has(milestone.releaseId),
    )
  ) {
    throw new TypeError("Invalid frozen public heuristic source.");
  }

  const canonicalSource = {
    version: FORECAST_CURRENT_PUBLIC_HEURISTIC_VERSION,
    sourceAsOfDate: scheduledFor,
    sourceIssuedAt: requestedAt,
    releases,
  } as const;
  const sourceFingerprint = historicalAnalysisFingerprint(canonicalSource);
  const forecastInput: ReleaseVersion[] = releases.map((release) => ({
    _id: release.id,
    version: release.version,
    releaseStatus: release.lifecycle,
    ...(release.publicReleaseDate
      ? { publicReleaseDate: release.publicReleaseDate }
      : {}),
    milestones: release.milestones.map(
      (milestone): BetaMilestone => ({
        _key: milestone.id,
        label: milestone.label,
        date: milestone.occurredOn,
        isRevision: false,
      }),
    ),
    releaseTrain: {
      _id: `legacy-train:${release.platform.id}`,
      displayName: release.platform.name,
      majorVersion: 0,
      releaseYear: 0,
      platform: {
        _id: release.platform.id,
        name: release.platform.name,
        slug: { current: release.platform.slug },
        color: "",
        sortOrder: release.platform.sortOrder,
      },
    },
  }));
  return {
    sourceFingerprint,
    modelFingerprint: CURRENT_PUBLIC_HEURISTIC_CODE_FINGERPRINT,
    releases,
    forecasts: buildReleaseForecasts(forecastInput, new Date(requestedAt)),
    rawSource: source,
  };
}

function anchorMatchesLegacyMilestone(
  snapshot: FrozenCurrentPublicHeuristicSnapshotV1,
  anchor: HistoricalCanonicalEventRow,
  milestoneId: string,
): boolean {
  if (
    anchor.eventId === compatibilityEvidenceId(anchor.releaseId, milestoneId)
  ) {
    return true;
  }
  const matchingFirstClass = snapshot.rawSource.events.filter(
    (event) =>
      event.releaseId === anchor.releaseId &&
      firstClassEvidenceId(event) === anchor.eventId,
  );
  if (matchingFirstClass.length !== 1) return false;
  const legacySourceId = matchingFirstClass[0]!.legacySourceId;
  return (
    legacySourceId === milestoneId ||
    legacySourceId === `${anchor.releaseId}:${milestoneId}` ||
    legacySourceId ===
      compatibilityEvidenceId(anchor.releaseId, milestoneId)
  );
}

export function buildCurrentPublicReleaseBenchmark(args: {
  snapshot: FrozenCurrentPublicHeuristicSnapshotV1;
  cycle: HistoricalReleaseCycleRow;
  anchor: HistoricalCanonicalEventRow;
}): ForecastArtifactBenchmarkV1 {
  const { snapshot, cycle, anchor } = args;
  const releases = snapshot.releases.filter(
    (release) => release.id === cycle.releaseId,
  );
  const forecasts = snapshot.forecasts.filter(
    (forecast) => forecast.release._id === cycle.releaseId,
  );
  if (
    releases.length !== 1 ||
    releases[0]!.platform.id !== cycle.platformId ||
    forecasts.length !== 1
  ) {
    return unavailableCurrentBenchmark(snapshot, "release-mapping-unproven");
  }
  const forecast = forecasts[0]!;
  if (
    !forecast.latestMilestone ||
    forecast.latestMilestone.date !== anchor.occurredOn ||
    !anchorMatchesLegacyMilestone(
      snapshot,
      anchor,
      forecast.latestMilestone._key,
    )
  ) {
    return unavailableCurrentBenchmark(snapshot, "anchor-mapping-unproven");
  }
  if (forecast.status !== "active") {
    return unavailableCurrentBenchmark(
      snapshot,
      forecast.status.startsWith("paused-")
        ? "heuristic-paused"
        : "heuristic-unavailable",
    );
  }
  if (!forecast.publicReleaseWindow || !forecast.cohort) {
    return unavailableCurrentBenchmark(snapshot, "heuristic-unavailable");
  }
  const memberIds: string[] = [];
  for (const version of forecast.cohort.sampleVersions) {
    const matches = snapshot.releases.filter(
      (release) =>
        release.platform.id === cycle.platformId &&
        release.lifecycle === "released" &&
        release.version === version,
    );
    if (matches.length !== 1) {
      return unavailableCurrentBenchmark(snapshot, "release-mapping-unproven");
    }
    memberIds.push(matches[0]!.id);
  }
  const sortedMemberIds = [...memberIds].sort(compareText);
  if (new Set(sortedMemberIds).size !== sortedMemberIds.length) {
    return unavailableCurrentBenchmark(snapshot, "release-mapping-unproven");
  }
  const window = forecast.publicReleaseWindow;
  return {
    benchmarkVersion: FORECAST_ORIGIN_BENCHMARK_VERSION,
    benchmarkId: "current-public-heuristic",
    modelVersion: FORECAST_CURRENT_PUBLIC_HEURISTIC_VERSION,
    sourceFingerprint: snapshot.sourceFingerprint,
    modelFingerprint: snapshot.modelFingerprint,
    calibrationFingerprint: null,
    cohorts: [{
      binding: "inline",
      role: "model-training",
      cohortId: `legacy:${forecast.cohort.kind}:${cycle.platformId}`,
      memberIds: sortedMemberIds,
      memberCount: sortedMemberIds.length,
    }],
    availability: "available",
    prediction: {
      targetKind: "public-release",
      pointDays: window.medianDays,
      pointCalendarDate: window.medianDate,
      roundingRule: FORECAST_INTERVAL_ROUNDING_RULE,
      empiricalRange: {
        level: 0.5,
        lowerDays: window.p25Days,
        upperDays: window.p75Days,
        lowerCalendarDate: addDays(anchor.occurredOn, window.p25Days),
        upperCalendarDate: addDays(anchor.occurredOn, window.p75Days),
      },
    },
  };
}

export function buildIncomparableCurrentNextEventBenchmark(
  snapshot: FrozenCurrentPublicHeuristicSnapshotV1,
): ForecastArtifactBenchmarkV1 {
  return unavailableCurrentBenchmark(
    snapshot,
    "incomparable-target-definition",
  );
}

/** Stable export for tests and provenance review. */
export function serializeFrozenCurrentPublicHeuristicSource(
  snapshot: FrozenCurrentPublicHeuristicSnapshotV1,
): string {
  return stableSerializeHistoricalAnalysis({
    version: FORECAST_CURRENT_PUBLIC_HEURISTIC_VERSION,
    sourceFingerprint: snapshot.sourceFingerprint,
    releases: snapshot.releases,
  });
}
