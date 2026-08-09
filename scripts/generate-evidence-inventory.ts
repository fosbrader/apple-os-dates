/**
 * Generates the checked-in, offline evidence inventory and bounded research
 * batch manifest. This command has no network or Sanity dependency.
 *
 *   npm run evidence:inventory
 *   npm run evidence:inventory:check
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  assertValidEvidenceInventory,
  buildEvidenceInventory,
  generatedArtifactContent,
  staleGeneratedArtifactKeys,
} from "./lib/evidence-inventory";

const repositoryRoot = path.join(__dirname, "..");
const inputPath = path.join(repositoryRoot, "scripts", "seed-data.json");
const outputDirectory = path.join(repositoryRoot, "research-handoffs");
const outputPaths = {
  inventory: path.join(outputDirectory, "evidence-inventory.json"),
  manifest: path.join(outputDirectory, "evidence-inventory-batches.json"),
  summary: path.join(outputDirectory, "evidence-inventory.md"),
};

const argumentsAfterNode = process.argv.slice(2);
const allowedFlags = new Set(["--check", "--write"]);
for (const argument of argumentsAfterNode) {
  if (!allowedFlags.has(argument)) {
    throw new Error(`Unsupported argument ${argument}. Use --check or --write.`);
  }
}
if (argumentsAfterNode.includes("--check") && argumentsAfterNode.includes("--write")) {
  throw new Error("Use either --check or --write, not both.");
}

const sourceInput = JSON.parse(fs.readFileSync(inputPath, "utf8")) as unknown;
const artifacts = buildEvidenceInventory(sourceInput);
assertValidEvidenceInventory(artifacts, sourceInput);
const content = generatedArtifactContent(artifacts);
const changed = staleGeneratedArtifactKeys(
  content,
  Object.fromEntries(
    Object.entries(outputPaths).flatMap(([key, outputPath]) =>
      fs.existsSync(outputPath)
        ? [[key, fs.readFileSync(outputPath, "utf8")]]
        : [],
    ),
  ),
);

if (argumentsAfterNode.includes("--check")) {
  if (changed.length) {
    throw new Error(`Generated evidence inventory is stale: ${changed.join(", ")}. Run npm run evidence:inventory.`);
  }
  console.log(`OK: evidence inventory is current. versions=${artifacts.inventory.counts.releaseVersions}; events=${artifacts.inventory.counts.eventRecords}; sources=${artifacts.inventory.counts.sources}; quarantined-events=${artifacts.inventory.counts.quarantinedEvents}; batches=${artifacts.manifest.counts.batches}.`);
  process.exit(0);
}

fs.mkdirSync(outputDirectory, { recursive: true });
for (const [key, outputPath] of Object.entries(outputPaths)) {
  fs.writeFileSync(outputPath, content[key as keyof typeof content]);
}
console.log(`Wrote offline evidence inventory. versions=${artifacts.inventory.counts.releaseVersions}; events=${artifacts.inventory.counts.eventRecords}; sources=${artifacts.inventory.counts.sources}; linked-events=${artifacts.inventory.counts.linkedEvents}; quarantined-events=${artifacts.inventory.counts.quarantinedEvents}; conflicts=${artifacts.inventory.counts.conflicts}; batches=${artifacts.manifest.counts.batches}.`);
