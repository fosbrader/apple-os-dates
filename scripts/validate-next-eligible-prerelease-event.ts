import { readFileSync } from "node:fs";

import { validateNextEligiblePrereleaseEventModel } from "../src/lib/next-eligible-prerelease-event";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run next-prerelease:validate -- path/to/next-eligible-prerelease-event.json");
  process.exitCode = 2;
} else {
  try {
    const issues = validateNextEligiblePrereleaseEventModel(JSON.parse(readFileSync(path, "utf8")) as unknown);
    if (issues.length) { console.error(JSON.stringify(issues, null, 2)); process.exitCode = 1; }
    else console.log("Next eligible prerelease event model is valid.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
