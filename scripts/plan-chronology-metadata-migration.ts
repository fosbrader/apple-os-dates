/**
 * Builds a local, dry-run-only chronology metadata migration plan.
 *
 * This script never imports a Sanity client and rejects every apply flag.
 *
 *   npm run migration:chronology-metadata:plan -- --input snapshot.ndjson
 *   npm run migration:chronology-metadata:plan -- --input snapshot.json \
 *     --terminal-dates reviewed-terminal-dates.json --write-artifacts
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  applyChronologyMetadataPlanToSnapshotForTest,
  buildChronologyMetadataPlan,
} from "./lib/chronology-metadata-migration";
import { stableStringify } from "./lib/release-event-migration";

const repositoryRoot = path.join(__dirname, "..");
const artifactDirectory = path.join(repositoryRoot, ".migration-artifacts");
const forbiddenFlags = new Set([
  "--apply",
  "--commit",
  "--confirm-production",
  "--mutate",
  "--write-production",
  "--with-user-token",
]);

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseJsonOrNdjson(content: string, inputPath: string): unknown {
  const trimmed = content.trim();
  if (!trimmed) throw new Error(`${inputPath} is empty.`);
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    try {
      return { documents: trimmed.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line) as unknown) };
    } catch {
      throw new Error(`${inputPath} is neither JSON nor valid NDJSON.`);
    }
  }
}

function localPath(value: string): string {
  const resolved = path.resolve(value);
  const relative = path.relative(repositoryRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Local input must stay inside the repository: ${resolved}`);
  }
  return resolved;
}

function writeArtifact(filename: string, value: unknown): string {
  fs.mkdirSync(artifactDirectory, { recursive: true, mode: 0o700 });
  const artifactPath = path.join(artifactDirectory, filename);
  const content = `${stableStringify(value, 2)}\n`;
  if (fs.existsSync(artifactPath)) {
    if (fs.readFileSync(artifactPath, "utf8") !== content) {
      throw new Error(`${artifactPath} already exists with different contents.`);
    }
    return artifactPath;
  }
  fs.writeFileSync(artifactPath, content, { encoding: "utf8", flag: "wx", mode: 0o600 });
  return artifactPath;
}

for (const argument of process.argv.slice(2)) {
  if (forbiddenFlags.has(argument)) {
    throw new Error(`${argument} is intentionally unsupported. This command only creates an offline dry-run plan.`);
  }
}

const inputArgument = argumentValue("--input");
if (!inputArgument) throw new Error("--input <published snapshot.json|ndjson> is required.");
const inputPath = localPath(inputArgument);
const terminalDatesArgument = argumentValue("--terminal-dates");
const snapshot = parseJsonOrNdjson(fs.readFileSync(inputPath, "utf8"), inputPath);
const terminalDates = terminalDatesArgument
  ? parseJsonOrNdjson(fs.readFileSync(localPath(terminalDatesArgument), "utf8"), localPath(terminalDatesArgument))
  : [];
const result = buildChronologyMetadataPlan(snapshot, terminalDates);
const postApplySnapshot = applyChronologyMetadataPlanToSnapshotForTest(snapshot, result.plan);
const residual = buildChronologyMetadataPlan(postApplySnapshot, terminalDates);
if (residual.plan.patches.length !== 0) {
  throw new Error("In-memory no-op rerun proof failed; do not review or apply this plan.");
}

let planPath: string | undefined;
let rollbackPath: string | undefined;
if (process.argv.includes("--write-artifacts")) {
  planPath = writeArtifact(`chronology-metadata-plan-${result.plan.planDigest}.json`, result.plan);
  rollbackPath = writeArtifact(`chronology-metadata-rollback-${result.plan.planDigest}.json`, result.rollback);
}

if (process.argv.includes("--json")) {
  console.log(stableStringify({ mode: "dry-run", ...result, residualPlanDigest: residual.plan.planDigest }, 2));
} else {
  console.log([
    "OK: chronology metadata migration is an offline dry run only.",
    `Input: ${inputPath}`,
    `PLAN SHA-256: ${result.plan.planDigest}`,
    `ROLLBACK SHA-256: ${result.rollback.rollbackDigest}`,
    `PATCH IDS (${result.plan.patches.length}): ${result.plan.patches.map((patch) => patch.id).join(", ") || "none"}`,
    `UNCHANGED IDS (${result.plan.unchangedDocumentIds.length}): ${result.plan.unchangedDocumentIds.join(", ") || "none"}`,
    `COUNTS: events=${result.plan.summary.releaseEvents}; versions=${result.plan.summary.releaseVersions}; patches=${result.plan.summary.patches}; unchanged=${result.plan.summary.unchanged}`,
    `DEFAULTS: firstObservedAt=${result.plan.summary.firstObservedAtDefaults}; chronologyCoverage=${result.plan.summary.chronologyCoverageDefaults}; released status dates=${result.plan.summary.releasedStatusEffectiveDates}; sourced superseded status dates=${result.plan.summary.supersededStatusEffectiveDates}; superseded evidence citations added=${result.plan.summary.supersededEvidenceCitationsAdded}`,
    `SUPERSEDED WITHOUT SOURCED TERMINAL DATE (${result.plan.skippedSupersededWithoutSourcedTerminalDateIds.length}): ${result.plan.skippedSupersededWithoutSourcedTerminalDateIds.join(", ") || "none"}`,
    "NO-OP RERUN: applying this exact overlay to the local fixture leaves 0 residual patches.",
    `ROLLBACK: ${rollbackPath || `not written; pass --write-artifacts to save chronology-metadata-rollback-${result.plan.planDigest}.json`}`,
    ...(planPath ? [`PLAN ARTIFACT: ${planPath}`] : []),
    "No Sanity access or mutation was attempted.",
  ].join("\n"));
}
