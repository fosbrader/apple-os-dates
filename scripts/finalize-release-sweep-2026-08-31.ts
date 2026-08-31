/**
 * Finalizes field-scoped chronology metadata after the August 31 release
 * manifest has been ingested.
 *
 * This script owns only releaseVersion.chronologyCoverage. It never replaces
 * whole documents or touches editorial prose, citations, review state, or
 * indexability.
 *
 * Dry run:
 *   npx sanity exec scripts/finalize-release-sweep-2026-08-31.ts --with-user-token
 *
 * Apply the exact reviewed plan:
 *   npx sanity exec scripts/finalize-release-sweep-2026-08-31.ts --with-user-token -- \
 *     --apply --confirm-production --plan-sha <PLAN_SHA>
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";
import { stableStringify } from "./lib/release-event-migration";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const verifiedAt = "2026-08-31T22:45:17Z";

interface DocumentSnapshot {
  _id: string;
  _rev: string;
  _type: string;
  chronologyCoverage?: unknown;
}

interface PlannedPatch {
  id: string;
  revision: string;
  description: string;
  set: Record<string, unknown>;
}

const coverageTargets = [
  {
    id: "version-ios-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-31",
    note:
      "Developer Beta 8 and Public Beta 6 chronology was audited through August 31, 2026. The release cycle is active, so later prerelease or public appearances remain outside this coverage window.",
  },
  {
    id: "version-ipados-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-31",
    note:
      "Developer Beta 8 and Public Beta 6 chronology was audited through August 31, 2026. The release cycle is active, so later prerelease or public appearances remain outside this coverage window.",
  },
  {
    id: "version-macos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-31",
    note:
      "Developer Beta 8 and Public Beta 6 chronology was audited through August 31, 2026. The active cycle may receive later prerelease or public appearances.",
  },
  {
    id: "version-tvos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-31",
    note:
      "Developer Beta 8 and Public Beta 6 chronology was audited through August 31, 2026. The release cycle is active, so later prerelease or public appearances remain outside this coverage window.",
  },
  {
    id: "version-watchos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-31",
    note:
      "Developer Beta 8 chronology was audited through August 31, 2026. The latest supported public event remains Public Beta 5 on August 25; reviewed August 31 sources did not support Public Beta 6. The active cycle may receive later appearances.",
  },
  {
    id: "version-visionos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-31",
    note:
      "Developer Beta 8 chronology was audited through August 31, 2026. Reviewed beta-program reporting does not establish a visionOS 27 public-beta track. The active cycle may receive later developer appearances.",
  },
] as const;

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function equal(left: unknown, right: unknown): boolean {
  return stableStringify(left) === stableStringify(right);
}

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const confirmed = process.argv.includes("--confirm-production");
  const acknowledgedSha = argumentValue("--plan-sha");

  if (apply && !confirmed) {
    throw new Error("Apply mode requires --confirm-production.");
  }
  if (!apply && (confirmed || acknowledgedSha)) {
    throw new Error(
      "--confirm-production and --plan-sha are accepted only with --apply.",
    );
  }

  const client = getCliClient({ apiVersion }).withConfig({
    perspective: "raw",
    useCdn: false,
  });
  const { projectId, dataset } = client.config();
  if (projectId !== expectedProjectId || dataset !== expectedDataset) {
    throw new Error(
      `Refusing to run against ${projectId}/${dataset}; expected ${expectedProjectId}/${expectedDataset}.`,
    );
  }

  const baseIds = coverageTargets.map((target) => target.id);
  const ids = [...baseIds, ...baseIds.map((id) => `drafts.${id}`)];
  const documents = await client.fetch<DocumentSnapshot[]>(
    `*[_id in $ids]{_id, _rev, _type, chronologyCoverage}`,
    { ids },
  );
  const byId = new Map(documents.map((document) => [document._id, document]));

  for (const id of baseIds) {
    if (!byId.has(id)) {
      throw new Error(
        `Missing ${id}. Apply the August 31 release manifest before finalizing metadata.`,
      );
    }
  }

  const patches: PlannedPatch[] = [];
  for (const target of coverageTargets) {
    for (const id of [target.id, `drafts.${target.id}`]) {
      const document = byId.get(id);
      if (!document) continue;
      const chronologyCoverage = {
        _type: "chronologyCoverage",
        status: "partial",
        auditedChannels: [...target.channels],
        coverageThrough: target.through,
        knownGapNote: target.note,
        verifiedAt,
      };
      if (!equal(document.chronologyCoverage, chronologyCoverage)) {
        patches.push({
          id,
          revision: document._rev,
          description: `chronology coverage through ${target.through}`,
          set: { chronologyCoverage },
        });
      }
    }
  }

  patches.sort((left, right) => left.id.localeCompare(right.id));
  const plan = {
    projectId: expectedProjectId,
    dataset: expectedDataset,
    verifiedAt,
    patches,
  };
  const sha = createHash("sha256")
    .update(JSON.stringify(plan))
    .digest("hex");

  console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", plan }, null, 2));
  console.log(`PLAN_SHA=${sha}`);

  if (!apply) {
    console.log("No Sanity data changed.");
    return;
  }
  if (acknowledgedSha !== sha) {
    throw new Error(
      `Plan SHA mismatch. Expected --plan-sha ${sha} for current revisions.`,
    );
  }
  if (patches.length === 0) {
    console.log("The reviewed plan is already applied; no transaction was created.");
    return;
  }

  let transaction = client.transaction();
  for (const patch of patches) {
    transaction = transaction.patch(patch.id, (builder) =>
      builder.ifRevisionId(patch.revision).set(patch.set),
    );
  }
  const result = await transaction.commit({
    visibility: "sync",
    tag: "version-record.release-sweep-finalize",
  });
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
