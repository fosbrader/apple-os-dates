import { readFileSync } from "node:fs";

import { validateReleaseDateIntervalCalibration } from "../src/lib/release-date-interval-calibration";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run release-date:interval-calibration:validate -- path/to/release-date-interval-calibration.json");
  process.exitCode = 2;
} else {
  try {
    const issues = validateReleaseDateIntervalCalibration(JSON.parse(readFileSync(path, "utf8")) as unknown);
    if (issues.length) { console.error(JSON.stringify(issues, null, 2)); process.exitCode = 1; }
    else console.log("Release-date interval calibration is valid.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
