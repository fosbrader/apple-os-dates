import type { HistoricalAnalysisReportV1 } from "@/lib/historical-analysis-report";
import {
  PublicApiRequestError,
  createPublicApiHistoricalAnalysisResponse,
  enforcePublicApiRateLimit,
  publicApiErrorResponse,
  publicApiJson,
  validatePublicApiHistoricalAnalysisRequest,
} from "@/lib/public-api";

interface HistoricalAnalysisHandlerOptions {
  loadHistoricalAnalysisReport: () => Promise<HistoricalAnalysisReportV1>;
  enforceRateLimit?: (request: Request) => Promise<void>;
}

function unavailable(): PublicApiRequestError {
  return new PublicApiRequestError(
    503,
    "HISTORICAL_ANALYSIS_UNAVAILABLE",
    "Historical analysis is temporarily unavailable.",
  );
}

export function createHistoricalAnalysisHandler({
  loadHistoricalAnalysisReport,
  enforceRateLimit = enforcePublicApiRateLimit,
}: HistoricalAnalysisHandlerOptions) {
  return async function GET(request: Request): Promise<Response> {
    try {
      await enforceRateLimit(request);
      validatePublicApiHistoricalAnalysisRequest(request.url);

      let report: HistoricalAnalysisReportV1;
      try {
        report = await loadHistoricalAnalysisReport();
      } catch {
        console.error("historical-analysis-api-failure", "report-unavailable");
        throw unavailable();
      }

      return publicApiJson(
        createPublicApiHistoricalAnalysisResponse(report, request.url),
      );
    } catch (error) {
      return publicApiErrorResponse(error);
    }
  };
}
