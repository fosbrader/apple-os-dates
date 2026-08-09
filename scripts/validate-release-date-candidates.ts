import { readFileSync } from "node:fs";

import { validateReleaseDateCandidates } from "../src/lib/release-date-candidates";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run release-date:validate -- path/to/release-date-candidates.json");
  process.exitCode = 2;
} else {
  try {
    const issues = validateReleaseDateCandidates(JSON.parse(readFileSync(path, "utf8")) as unknown);
    if (issues.length) { console.error(JSON.stringify(issues, null, 2)); process.exitCode = 1; }
    else console.log("Release-date candidates are valid.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
