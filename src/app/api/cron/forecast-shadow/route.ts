import { createForecastBlobStorage } from "@/lib/forecast-blob-storage";
import { runForecastShadowWithReconciliation } from "@/lib/forecast-shadow-reconciliation-run";
import {
  buildForecastShadowEvaluationEpoch,
  isValidForecastReconciliationRoot,
} from "@/lib/forecast-shadow-scoring";
import {
  PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
  boundedForecastShadowSourceQuery,
  extractBoundedForecastShadowSource,
  type PublishedForecastShadowSource,
} from "@/lib/historical-release-source";
import { client } from "@/sanity/client";

import { createForecastShadowHandler } from "./handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 55;

const forecastSourceClient = client.withConfig({
  useCdn: false,
  timeout: 8_000,
  maxRetries: 1,
  retryDelay: () => 250,
});

async function fetchPublishedSource(): Promise<PublishedForecastShadowSource> {
  const envelope = await forecastSourceClient.fetch<unknown>(
    boundedForecastShadowSourceQuery,
    {},
    {
      ...PUBLISHED_HISTORICAL_RELEASE_FETCH_OPTIONS,
      cache: "no-store",
    },
  );
  return extractBoundedForecastShadowSource(envelope);
}

function configuredEvaluationEpoch() {
  const startsOn = process.env.FORECAST_SHADOW_EPOCH_STARTS_ON?.trim();
  const endsOn = process.env.FORECAST_SHADOW_EPOCH_ENDS_ON?.trim();
  if (!startsOn || !endsOn) {
    throw new Error("Forecast evaluation epoch is not configured.");
  }
  return buildForecastShadowEvaluationEpoch(startsOn, endsOn);
}

export const GET = createForecastShadowHandler({
  runForecastShadow: async (request) => {
    const evaluationEpoch = configuredEvaluationEpoch();
    const storage = createForecastBlobStorage({
      reconciliationRootValidator: isValidForecastReconciliationRoot,
    });
    await runForecastShadowWithReconciliation(request, {
      storage,
      fetchPublishedSource,
      evaluationEpoch,
      validateReconciliationRoot: isValidForecastReconciliationRoot,
    });
  },
});
