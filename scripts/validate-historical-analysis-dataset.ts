import { readFileSync } from "node:fs";

import { validateHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run historical:validate -- path/to/historical-analysis-dataset.json");
  process.exitCode = 2;
} else {
  try {
    const issues = validateHistoricalAnalysisDataset(
      JSON.parse(readFileSync(path, "utf8")) as unknown,
    );
    if (issues.length) {
      console.error(JSON.stringify(issues, null, 2));
      process.exitCode = 1;
    } else {
      console.log("Historical analysis dataset is valid.");
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
