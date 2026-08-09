import { readFileSync } from "node:fs";

import { validateWalkForwardEvaluation } from "../src/lib/walk-forward-evaluation";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npm run walk-forward:validate -- path/to/walk-forward-evaluation.json");
  process.exitCode = 2;
} else {
  try {
    const issues = validateWalkForwardEvaluation(JSON.parse(readFileSync(path, "utf8")) as unknown);
    if (issues.length) { console.error(JSON.stringify(issues, null, 2)); process.exitCode = 1; }
    else console.log("Walk-forward evaluation is valid.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
  }
}
