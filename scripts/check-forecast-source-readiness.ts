/**
 * Read the published Sanity source and report forecast readiness. This command
 * does not use a token and has no CMS, Blob, cron, or deployment write path.
 */

import { assessForecastSourceReadiness } from "../src/lib/forecast-source-readiness";
import {
  PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
  boundedForecastShadowSourceQuery,
  extractBoundedForecastShadowSource,
} from "../src/lib/historical-release-source";
import { client } from "../src/sanity/client";

const sourceClient = client.withConfig({
  useCdn: true,
  timeout: 8_000,
  maxRetries: 1,
  retryDelay: () => 250,
});

async function main(): Promise<void> {
  const issuedAt = new Date().toISOString();
  const envelope = await sourceClient.fetch<unknown>(
    boundedForecastShadowSourceQuery,
    {},
    PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
  );
  const report = assessForecastSourceReadiness(
    extractBoundedForecastShadowSource(envelope),
    issuedAt,
  );
  console.log(JSON.stringify(report, null, 2));
  if (report.historicalAnalysis.status !== "ready") {
    process.exitCode = 2;
  }
}

void main().catch(() => {
  console.error("Forecast source readiness check failed.");
  process.exitCode = 1;
});
