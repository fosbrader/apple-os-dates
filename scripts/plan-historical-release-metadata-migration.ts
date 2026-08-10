/**
 * Builds a deterministic offline plan from a curated manifest and a fresh,
 * published-only Sanity snapshot. This command has no Sanity client or apply
 * path and rejects production/write flags.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { stableStringify } from "./lib/release-event-migration";
import { buildHistoricalReleaseMetadataPlan } from "./lib/historical-release-metadata-migration";

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

function localPath(value: string): string {
  const resolved = path.resolve(value);
  const relative = path.relative(repositoryRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Local input must stay inside the repository: ${resolved}`);
  }
  return resolved;
}

function parseJsonOrNdjson(content: string, inputPath: string): unknown {
  const trimmed = content.trim();
  if (!trimmed) throw new Error(`${inputPath} is empty.`);
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    try {
      return {
        documents: trimmed
          .split(/\r?\n/)
          .filter(Boolean)
          .map((line) => JSON.parse(line) as unknown),
      };
    } catch {
      throw new Error(`${inputPath} is neither JSON nor valid NDJSON.`);
    }
  }
}

function readLocalJsonOrNdjson(value: string): unknown {
  const inputPath = localPath(value);
  return parseJsonOrNdjson(fs.readFileSync(inputPath, "utf8"), inputPath);
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
  fs.writeFileSync(artifactPath, content, {
    encoding: "utf8",
    flag: "wx",
    mode: 0o600,
  });
  return artifactPath;
}

for (const argument of process.argv.slice(2)) {
  if (forbiddenFlags.has(argument)) {
    throw new Error(
      `${argument} is unsupported. This command only creates an offline dry-run plan.`,
    );
  }
}

const snapshotArgument = argumentValue("--snapshot");
const manifestArgument = argumentValue("--manifest");
if (!snapshotArgument || !manifestArgument) {
  throw new Error(
    "Usage: --snapshot <published-snapshot.json|ndjson> --manifest <curated-manifest.json> [--write-artifacts] [--json]",
  );
}

const result = buildHistoricalReleaseMetadataPlan(
  readLocalJsonOrNdjson(snapshotArgument),
  readLocalJsonOrNdjson(manifestArgument),
);

let planPath: string | undefined;
let rollbackPath: string | undefined;
if (process.argv.includes("--write-artifacts")) {
  planPath = writeArtifact(
    `historical-release-metadata-plan-${result.plan.planDigest}.json`,
    result.plan,
  );
  rollbackPath = writeArtifact(
    `historical-release-metadata-rollback-${result.plan.planDigest}.json`,
    result.rollback,
  );
}

if (process.argv.includes("--json")) {
  console.log(stableStringify({ mode: "dry-run", ...result }, 2));
} else {
  console.log(
    [
      "OK: historical metadata sidecar migration is an offline dry run only.",
      `PLAN SHA-256: ${result.plan.planDigest}`,
      `ROLLBACK SHA-256: ${result.rollback.rollbackDigest}`,
      `MUTATIONS: ${result.plan.summary.creates} sidecar create, ${result.plan.summary.patches} sidecar revision-guarded patch, ${result.plan.summary.lifecycleObservationPatches} lifecycle revision-guarded patch.`,
      `EVIDENCE: ${result.plan.summary.metadataEvidenceReferences} metadata, ${result.plan.summary.chronologyEvidenceReferences} chronology, ${result.plan.summary.statusObservationEvidenceReferences} lifecycle-observation references.`,
      `IDS: ${[
        ...result.plan.mutations.map(({ id }) => id),
        ...result.plan.lifecycleObservationPatches.map(({ id }) => id),
      ].join(", ")}`,
      `PLAN: ${planPath ?? "not written; pass --write-artifacts"}`,
      `ROLLBACK: ${rollbackPath ?? "not written; pass --write-artifacts"}`,
      "No Sanity access or mutation was attempted.",
      `A future apply requires fresh approval for exactly --plan-sha ${result.plan.planDigest}.`,
    ].join("\n"),
  );
}
