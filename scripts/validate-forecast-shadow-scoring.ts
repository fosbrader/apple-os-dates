import { readFileSync, statSync } from "node:fs";

import {
  FORECAST_RECONCILIATION_INDEX_MAX_BYTES,
  parseForecastReconciliationIndex,
  parseForecastScoreArtifact,
  parseForecastShadowHealthReport,
} from "../src/lib/forecast-shadow-scoring";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run forecast:scoring:validate -- path/to/score-index-or-health.json");
  process.exitCode = 2;
} else {
  try {
    if (statSync(path).size > FORECAST_RECONCILIATION_INDEX_MAX_BYTES) throw new Error("Document exceeds the largest forecast-scoring contract before read or parse.");
    const bytes = readFileSync(path);
    if (bytes.includes(Buffer.from('"scoreVersion"'))) parseForecastScoreArtifact(bytes);
    else if (bytes.includes(Buffer.from('"indexVersion"'))) parseForecastReconciliationIndex(bytes);
    else if (bytes.includes(Buffer.from('"reportVersion"'))) parseForecastShadowHealthReport(bytes);
    else throw new Error("Document is not a forecast score, reconciliation index, or private health report.");
    console.log("Forecast shadow scoring document is valid and canonical.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
