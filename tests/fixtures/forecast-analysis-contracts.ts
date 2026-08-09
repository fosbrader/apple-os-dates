import {
  FORECAST_ANALYSIS_CONTRACT_VERSION,
  type ForecastAnalysisDatasetV1,
} from "../../src/lib/forecast-analysis-contracts";

export function canonicalForecastFixture(): ForecastAnalysisDatasetV1 {
  return {
    contractVersion: FORECAST_ANALYSIS_CONTRACT_VERSION,
    dataCutoff: "2026-08-09",
    releases: [{ id: "ios-27.0", lifecycle: "active" }],
    events: [
      {
        id: "ios-27-developer-beta-2",
        releaseId: "ios-27.0",
        occurredOn: "2026-07-20",
        firstObservedOn: "2026-07-20",
        channel: "developerBeta",
        sequence: 2,
        availability: "available",
        isRevision: false,
        displayLabel: "Developer Beta Two",
      },
      {
        id: "ios-27-public-beta-2",
        releaseId: "ios-27.0",
        occurredOn: "2026-07-20",
        firstObservedOn: "2026-07-20",
        channel: "publicBeta",
        sequence: 2,
        availability: "available",
        isRevision: false,
        displayLabel: "Public Preview",
      },
    ],
  };
}
