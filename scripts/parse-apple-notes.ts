/**
 * Parses the human-maintained release chronology into a structured review
 * artifact. This command never writes to seed-data.json or Sanity.
 *
 * Usage:
 *   npm run data:parse-note
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  buildParsedSeedData,
  parseAppleNote,
} from "./lib/apple-note-parser";

const filePath = path.join(__dirname, "..", "original-apple-note");
const content = fs.readFileSync(filePath, "utf8");
const { versions, diagnostics } = parseAppleNote(content);
const unclassified = diagnostics.filter(
  (diagnostic) => diagnostic.reason === "unclassified-line",
);

if (unclassified.length) {
  for (const diagnostic of unclassified) {
    console.error(
      `Unclassified line ${diagnostic.line}: ${diagnostic.text}`,
    );
  }
  throw new Error(
    `Refusing to emit data with ${unclassified.length} unclassified line(s).`,
  );
}

const seedData = buildParsedSeedData(versions);
console.log(JSON.stringify(seedData, null, 2));

const totalMilestones = versions.reduce(
  (sum, version) => sum + version.milestones.length,
  0,
);
console.error("\nParsed:");
console.error(`  ${seedData.platforms.length} platforms`);
console.error(`  ${seedData.releaseTrains.length} release trains`);
console.error(`  ${versions.length} release versions`);
console.error(`  ${totalMilestones} milestones`);
console.error(
  `  ${diagnostics.length} explicitly classified excluded/attribution lines`,
);
