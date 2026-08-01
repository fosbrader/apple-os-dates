/**
 * Builds and validates a local, non-executable release-event migration plan.
 *
 * This script never imports a Sanity client and has no production write path.
 *
 * Check the audited seed:
 *   npx tsx scripts/plan-release-event-migration.ts
 *
 * Check a local Sanity JSON or NDJSON snapshot:
 *   npx tsx scripts/plan-release-event-migration.ts --input snapshot.ndjson
 *
 * Save a reviewed local artifact:
 *   npx tsx scripts/plan-release-event-migration.ts \
 *     --input snapshot.ndjson \
 *     --output .migration-artifacts/release-event-plan.json
 *
 * Emit reviewed structured-build candidates by mapping them to existing
 * source document IDs:
 *   npx tsx scripts/plan-release-event-migration.ts \
 *     --input snapshot.ndjson \
 *     --build-citations reviewed-build-citations.json \
 *     --output .migration-artifacts/release-event-plan.json
 *
 * Print the guarded plan and clearly named schema-ready projection:
 *   npx tsx scripts/plan-release-event-migration.ts --json
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  assertValidSchemaReadyMigration,
  assertValidReleaseEventMigration,
  buildReleaseEventMigrationPlan,
  extractLegacyReleaseVersions,
  projectSchemaReadyMigration,
  stableStringify,
} from "./lib/release-event-migration";

const repositoryRoot = path.join(__dirname, "..");
const defaultInputPath = path.join(
  repositoryRoot,
  "scripts",
  "seed-data.json",
);
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

function parseInput(content: string, inputPath: string): unknown {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error(`${inputPath} is empty.`);
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch (jsonError) {
    const documents = trimmed
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line, index) => {
        try {
          return JSON.parse(line) as unknown;
        } catch {
          throw new Error(
            `${inputPath} is neither JSON nor valid NDJSON; line ${index + 1} could not be parsed.`,
            { cause: jsonError },
          );
        }
      });
    return { documents };
  }
}

function assertLocalOutputPath(outputPath: string): void {
  const resolved = path.resolve(outputPath);
  const relative = path.relative(repositoryRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `Output must stay inside the repository: ${resolved}`,
    );
  }
  if (fs.existsSync(resolved) && !process.argv.includes("--overwrite")) {
    throw new Error(
      `${resolved} already exists. Pass --overwrite only after reviewing the existing artifact.`,
    );
  }
}

function parseBuildCitationMappings(
  value: unknown,
  inputPath: string,
): Record<string, string[]> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `${inputPath} must contain an object keyed by release-build candidate ID.`,
    );
  }
  const result: Record<string, string[]> = {};
  for (const [candidateId, sourceIds] of Object.entries(value)) {
    if (
      !Array.isArray(sourceIds) ||
      sourceIds.some((sourceId) => typeof sourceId !== "string")
    ) {
      throw new Error(
        `${inputPath} entry ${candidateId} must be an array of existing source document IDs.`,
      );
    }
    result[candidateId] = sourceIds as string[];
  }
  return result;
}

for (const argument of process.argv.slice(2)) {
  if (forbiddenFlags.has(argument)) {
    throw new Error(
      `${argument} is intentionally unsupported. This command only creates and validates local candidate plans.`,
    );
  }
}

const inputPath = path.resolve(
  argumentValue("--input") || defaultInputPath,
);
const outputArgument = argumentValue("--output");
const buildCitationsArgument = argumentValue("--build-citations");
const rawInput = parseInput(
  fs.readFileSync(inputPath, "utf8"),
  inputPath,
);
const versions = extractLegacyReleaseVersions(rawInput);
const plan = buildReleaseEventMigrationPlan(versions);
assertValidReleaseEventMigration(versions, plan);
const approvedBuildCitationSourceIds = buildCitationsArgument
  ? parseBuildCitationMappings(
      parseInput(
        fs.readFileSync(
          path.resolve(buildCitationsArgument),
          "utf8",
        ),
        path.resolve(buildCitationsArgument),
      ),
      path.resolve(buildCitationsArgument),
    )
  : {};
const schemaReadyProjection = projectSchemaReadyMigration(plan, {
  approvedBuildCitationSourceIds,
});
assertValidSchemaReadyMigration(plan, schemaReadyProjection);
const artifact = {
  formatVersion: 1,
  migrationPlan: plan,
  schemaReadyProjection,
};

if (outputArgument) {
  assertLocalOutputPath(outputArgument);
  const outputPath = path.resolve(outputArgument);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${stableStringify(artifact, 2)}\n`, {
    flag: process.argv.includes("--overwrite") ? "w" : "wx",
  });
  console.log(`Wrote guarded local plan ${outputPath}.`);
}

if (process.argv.includes("--json")) {
  console.log(stableStringify(artifact, 2));
} else {
  console.log(
    [
      "OK: release-event migration candidate is deterministic and legacy-compatible.",
      `Input: ${inputPath}`,
      `Source SHA-256: ${plan.sourceDigest}`,
      `Plan SHA-256: ${plan.planDigest}`,
      `Schema projection SHA-256: ${schemaReadyProjection.projectionDigest}`,
      `Versions: ${plan.summary.releaseVersions}`,
      `Events: ${plan.summary.releaseEvents}`,
      `Proposed builds from structured build fields: ${plan.summary.releaseBuildCandidates}`,
      `Schema-ready events: ${schemaReadyProjection.releaseEvents.length}`,
      `Schema-ready cited builds: ${schemaReadyProjection.releaseBuilds.length}`,
      `Withheld uncited build candidates: ${schemaReadyProjection.withheldBuildCandidates.length}`,
      `Note-derived review candidates: ${plan.summary.reviewCandidates}`,
      `Synthetic event identities (seed input without live _keys): ${plan.summary.syntheticEventIdentities}`,
      `Release-status normalizations: ${plan.summary.releaseStatusNormalizations}`,
      "No production mutations were generated or performed.",
    ].join("\n"),
  );
}
