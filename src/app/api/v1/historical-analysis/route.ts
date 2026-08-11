import { getPublicHistoricalAnalysisReport } from "@/lib/public-historical-analysis";
import { publicApiOptions } from "@/lib/public-api";

import { createHistoricalAnalysisHandler } from "./handler";

export const revalidate = 300;

export const GET = createHistoricalAnalysisHandler({
  loadHistoricalAnalysisReport: getPublicHistoricalAnalysisReport,
});

export function OPTIONS(): Response {
  return publicApiOptions();
}
