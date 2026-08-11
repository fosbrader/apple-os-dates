import {
  stableSerializeHistoricalAnalysis,
  validateHistoricalAnalysisInput,
} from "./historical-analysis-dataset";
import {
  FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
  FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  FORECAST_SHADOW_MAX_SOURCE_METADATA,
  FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS,
  FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  validatePublishedHistoricalReleaseSource,
  type PublishedHistoricalReleaseSource,
} from "./historical-release-source";
import { adaptReleaseObservations } from "./release-observation-adapter";

export const FORECAST_SOURCE_READINESS_VERSION = "forecast-source-readiness/v1";

type SourceCapacityName =
  | "releases"
  | "events"
  | "compatibilityMilestones"
  | "observations"
  | "releaseMetadata";

export interface ForecastSourceCapacity {
  name: SourceCapacityName;
  count: number;
  limit: number;
  remaining: number;
}

export type HistoricalAnalysisReadinessReason =
  "metadata-coverage-incomplete" | "historical-input-invalid";

export interface ForecastSourceReadinessReport {
  readinessVersion: typeof FORECAST_SOURCE_READINESS_VERSION;
  issuedAt: string;
  source: {
    canonicalBytes: number;
    canonicalByteLimit: number;
    canonicalBytesRemaining: number;
    capacities: readonly ForecastSourceCapacity[];
  };
  historicalAnalysis:
    | {
        status: "ready";
        missingMetadataCount: 0;
        unexpectedMetadataCount: 0;
        duplicateMetadataCount: 0;
        inputIssueCount: 0;
      }
    | {
        status: "blocked";
        reason: HistoricalAnalysisReadinessReason;
        missingMetadataCount: number;
        unexpectedMetadataCount: number;
        duplicateMetadataCount: number;
        inputIssueCount: number;
      };
}

const encoder = new TextEncoder();

function capacity(
  name: SourceCapacityName,
  count: number,
  limit: number,
): ForecastSourceCapacity {
  return { name, count, limit, remaining: limit - count };
}

function metadataCoverage(source: PublishedHistoricalReleaseSource) {
  const releaseIds = new Set(source.releases.map(({ id }) => id));
  const metadataCounts = new Map<string, number>();
  for (const { releaseId } of source.releaseMetadata) {
    metadataCounts.set(releaseId, (metadataCounts.get(releaseId) ?? 0) + 1);
  }

  const missingMetadataCount = [...releaseIds].filter(
    (releaseId) => !metadataCounts.has(releaseId),
  ).length;
  const unexpectedMetadataCount = [...metadataCounts.keys()].filter(
    (releaseId) => !releaseIds.has(releaseId),
  ).length;
  const duplicateMetadataCount = [...metadataCounts.values()].filter(
    (count) => count > 1,
  ).length;

  return {
    missingMetadataCount,
    unexpectedMetadataCount,
    duplicateMetadataCount,
  };
}

/**
 * Inspect one complete published historical source without any CMS or storage
 * write. Invalid source input throws instead of reporting a false ready state.
 */
export function assessForecastSourceReadiness(
  value: unknown,
  issuedAt: string,
): ForecastSourceReadinessReport {
  const source = validatePublishedHistoricalReleaseSource(value, issuedAt);
  const canonicalBytes = encoder.encode(
    stableSerializeHistoricalAnalysis(value),
  ).byteLength;
  const capacities = [
    capacity(
      "releases",
      source.releases.length,
      FORECAST_SHADOW_MAX_SOURCE_RELEASES,
    ),
    capacity("events", source.events.length, FORECAST_SHADOW_MAX_SOURCE_EVENTS),
    capacity(
      "compatibilityMilestones",
      source.compatibilityMilestones.length,
      FORECAST_SHADOW_MAX_SOURCE_COMPATIBILITY_MILESTONES,
    ),
    capacity(
      "observations",
      source.events.length + source.compatibilityMilestones.length,
      FORECAST_SHADOW_MAX_SOURCE_OBSERVATIONS,
    ),
    capacity(
      "releaseMetadata",
      source.releaseMetadata.length,
      FORECAST_SHADOW_MAX_SOURCE_METADATA,
    ),
  ] as const;
  const coverage = metadataCoverage(source);
  const adapterResult = adaptReleaseObservations({
    asOfDate: issuedAt.slice(0, 10),
    issuedAt,
    releases: source.releases,
    events: source.events,
    compatibilityMilestones: source.compatibilityMilestones,
  });
  const inputIssues = validateHistoricalAnalysisInput({
    adapterResult,
    releaseMetadata: source.releaseMetadata,
  });
  const metadataIncomplete =
    coverage.missingMetadataCount > 0 ||
    coverage.unexpectedMetadataCount > 0 ||
    coverage.duplicateMetadataCount > 0;

  const report = {
    readinessVersion: FORECAST_SOURCE_READINESS_VERSION,
    issuedAt,
    source: {
      canonicalBytes,
      canonicalByteLimit: FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
      canonicalBytesRemaining:
        FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES - canonicalBytes,
      capacities,
    },
  } as const;

  if (!metadataIncomplete && inputIssues.length === 0) {
    return {
      ...report,
      historicalAnalysis: {
        status: "ready",
        missingMetadataCount: 0,
        unexpectedMetadataCount: 0,
        duplicateMetadataCount: 0,
        inputIssueCount: 0,
      },
    };
  }

  return {
    ...report,
    historicalAnalysis: {
      status: "blocked",
      reason: metadataIncomplete
        ? "metadata-coverage-incomplete"
        : "historical-input-invalid",
      ...coverage,
      inputIssueCount: inputIssues.length,
    },
  };
}
