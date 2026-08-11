import {
  buildHistoricalAnalysisDataset,
  validateHistoricalAnalysisDataset,
} from "./historical-analysis-dataset";
import {
  buildHistoricalAnalysisReport,
  validateHistoricalAnalysisReport,
  HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
  type HistoricalAnalysisReportV1,
} from "./historical-analysis-report";
import {
  PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
  boundedForecastShadowSourceQuery,
  extractBoundedForecastShadowSource,
  validatePublishedHistoricalReleaseSource,
  type PublishedHistoricalReleaseSource,
} from "./historical-release-source";
import { adaptReleaseObservations } from "./release-observation-adapter";
import {
  DEFAULT_WALK_FORWARD_EVALUATION_CONFIG,
  buildWalkForwardEvaluation,
  validateWalkForwardEvaluation,
} from "./walk-forward-evaluation";
import { client } from "@/sanity/client";
import { unstable_cache } from "next/cache";

export const PUBLIC_HISTORICAL_ANALYSIS_REVALIDATE_SECONDS = 300;
export const PUBLIC_HISTORICAL_ANALYSIS_CACHE_TAG =
  "public-historical-analysis-report";

/**
 * Build the public historical report from the same complete, bounded source
 * contract used by offline evaluation. This path imports no forecast artifact,
 * pointer, candidate, reconciliation, or shadow-storage module.
 */
export function buildPublicHistoricalAnalysisReport(
  rawSource: PublishedHistoricalReleaseSource,
  issuedAt: string,
): HistoricalAnalysisReportV1 {
  const source = validatePublishedHistoricalReleaseSource(rawSource, issuedAt);
  const dataset = buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations({
      asOfDate: issuedAt.slice(0, 10),
      issuedAt,
      releases: source.releases,
      events: source.events,
      compatibilityMilestones: source.compatibilityMilestones,
    }),
    releaseMetadata: source.releaseMetadata,
  });
  if (validateHistoricalAnalysisDataset(dataset).length > 0) {
    throw new TypeError("The public historical dataset is invalid.");
  }
  const evaluation = buildWalkForwardEvaluation(dataset, {
    ...DEFAULT_WALK_FORWARD_EVALUATION_CONFIG,
    includeEmpiricalIntervals: true,
  });
  if (validateWalkForwardEvaluation(evaluation).length > 0) {
    throw new TypeError("The public walk-forward evaluation is invalid.");
  }
  const report = buildHistoricalAnalysisReport(evaluation);
  if (validateHistoricalAnalysisReport(report).length > 0) {
    throw new TypeError("The public historical analysis report is invalid.");
  }
  return report;
}

const publicHistoricalSourceClient = client.withConfig({
  useCdn: true,
  timeout: 8_000,
  maxRetries: 1,
  retryDelay: () => 250,
});

async function loadPublicHistoricalAnalysisReport(): Promise<HistoricalAnalysisReportV1> {
  const issuedAt = new Date().toISOString();
  const envelope = await publicHistoricalSourceClient.fetch<unknown>(
    boundedForecastShadowSourceQuery,
    {},
    {
      ...PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
      next: { revalidate: PUBLIC_HISTORICAL_ANALYSIS_REVALIDATE_SECONDS },
    },
  );
  return buildPublicHistoricalAnalysisReport(
    extractBoundedForecastShadowSource(envelope),
    issuedAt,
  );
}

/**
 * Reuse a bounded, complete report for five minutes across the public API and
 * analytics page. The existing Next data cache needs no new hosted service.
 */
const getCachedPublicHistoricalAnalysisReport = unstable_cache(
  loadPublicHistoricalAnalysisReport,
  [
    "public-historical-analysis-report/v1",
    HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
  ],
  {
    revalidate: PUBLIC_HISTORICAL_ANALYSIS_REVALIDATE_SECONDS,
    tags: [PUBLIC_HISTORICAL_ANALYSIS_CACHE_TAG],
  },
);

/** Fetch only published historical source rows and return a validated report. */
export async function getPublicHistoricalAnalysisReport(): Promise<HistoricalAnalysisReportV1> {
  return getCachedPublicHistoricalAnalysisReport();
}
