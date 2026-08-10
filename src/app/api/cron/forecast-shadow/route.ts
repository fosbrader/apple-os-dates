import { createForecastBlobStorage } from "@/lib/forecast-blob-storage";
import { runForecastShadowPipeline } from "@/lib/forecast-shadow-pipeline";
import { isValidForecastReconciliationRoot } from "@/lib/forecast-shadow-scoring";
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

export const GET = createForecastShadowHandler({
  runForecastShadow: async (request) => {
    await runForecastShadowPipeline(request, {
      storage: createForecastBlobStorage({
        reconciliationRootValidator: isValidForecastReconciliationRoot,
      }),
      fetchPublishedSource,
      validateReconciliationRoot: isValidForecastReconciliationRoot,
    });
  },
});
