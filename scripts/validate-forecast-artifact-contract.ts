import { readFileSync } from "node:fs";

import { parseForecastArtifact, parseForecastPointer } from "../src/lib/forecast-artifact-contracts";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run forecast:contracts:validate -- path/to/forecast-artifact-or-pointer.json");
  process.exitCode = 2;
} else {
  try {
    const bytes = readFileSync(path);
    const header = JSON.parse(bytes.toString("utf8")) as Record<string, unknown>;
    if (header.artifactVersion !== undefined) parseForecastArtifact(bytes);
    else if (header.pointerVersion !== undefined) parseForecastPointer(bytes);
    else throw new Error("Document is neither a forecast artifact nor a forecast pointer.");
    console.log("Forecast artifact contract is valid and canonical.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
