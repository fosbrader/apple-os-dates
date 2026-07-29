import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  buildParsedSeedData,
  parseAppleNote,
} from "../scripts/lib/apple-note-parser";
import {
  validateReleaseData,
  type ReleaseData,
} from "../scripts/lib/release-data-validation";

test("the complete corrected source note produces internally valid audited data", () => {
  const source = readFileSync(
    path.join(process.cwd(), "original-apple-note"),
    "utf8",
  );
  const parsed = parseAppleNote(source);
  const seed = buildParsedSeedData(parsed.versions);
  const issues = validateReleaseData(seed as ReleaseData).filter(
    (issue) => issue.severity === "error",
  );

  assert.deepEqual(issues, []);
});
