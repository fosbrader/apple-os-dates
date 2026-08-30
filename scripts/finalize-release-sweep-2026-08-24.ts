/**
 * Finalizes field-scoped release-sweep metadata after both August 24 manifests
 * have been ingested.
 *
 * This script owns only releaseVersion.chronologyCoverage and the replacement
 * relationships for the revised macOS 27 Public Beta 4 event and builds. It
 * never replaces whole documents or touches editorial prose, citations,
 * review state, or indexability.
 *
 * Dry run:
 *   npx sanity exec scripts/finalize-release-sweep-2026-08-24.ts --with-user-token
 *
 * Apply the exact reviewed plan:
 *   npx sanity exec scripts/finalize-release-sweep-2026-08-24.ts --with-user-token -- \
 *     --apply --confirm-production --plan-sha <PLAN_SHA>
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";
import { stableStringify } from "./lib/release-event-migration";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const verifiedAt = "2026-08-29T16:00:00Z";

interface DocumentSnapshot {
  _id: string;
  _rev: string;
  _type: string;
  chronologyCoverage?: unknown;
  availabilityState?: string;
  replaces?: { _ref?: string };
  replacedBy?: { _ref?: string };
  revisionOf?: { _ref?: string };
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
    through: "2026-08-24",
    note:
      "Developer and public beta chronology was audited through August 24, 2026. The release cycle is active, so later prerelease or public appearances remain outside this coverage window.",
  },
  {
    id: "version-ipados-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-24",
    note:
      "Developer and public beta chronology was audited through August 24, 2026. The release cycle is active, so later prerelease or public appearances remain outside this coverage window.",
  },
  {
    id: "version-macos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-24",
    note:
      "Developer and public beta chronology was audited through August 24, 2026, including the August 18 Public Beta 4 revision. The active cycle may receive later prerelease or public appearances.",
  },
  {
    id: "version-tvos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-24",
    note:
      "Developer and public beta chronology was audited through August 24, 2026. The release cycle is active, so later prerelease or public appearances remain outside this coverage window.",
  },
  {
    id: "version-watchos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-25",
    note:
      "Developer beta chronology was audited through August 24, 2026 and public beta chronology through August 25. The active cycle may receive later prerelease or public appearances.",
  },
  {
    id: "version-visionos-27-0",
    channels: ["developerBeta", "publicBeta"],
    through: "2026-08-24",
    note:
      "Developer beta chronology was audited through August 24, 2026. The reviewed beta-program reporting states that visionOS 27 has no public beta track. The active cycle may receive later developer or public appearances.",
  },
  {
    id: "version-macos-26-7",
    channels: ["releaseCandidate", "public"],
    through: "2026-08-24",
    note:
      "Release-candidate and Apple public-release sources were audited through August 24, 2026. No public macOS Tahoe 26.7 release was present in Apple's security index at the August 29 review.",
  },
  {
    id: "version-macos-15-8",
    channels: ["releaseCandidate", "public"],
    through: "2026-08-24",
    note:
      "Release-candidate and Apple public-release sources were audited through August 24, 2026. No public macOS Sequoia 15.8 release was present in Apple's security index at the August 29 review.",
  },
] as const;

function compactHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function eventDocumentId(stableEventId: string): string {
  return `release-event-${compactHash(stableEventId)}`;
}

function buildDocumentId(releaseVersionId: string, buildNumber: string): string {
  return `release-build-${compactHash(
    `${releaseVersionId}\0${buildNumber.trim().toUpperCase()}`,
  )}`;
}

function reference(id: string) {
  return { _type: "reference" as const, _ref: id };
}

function argumentValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function equal(left: unknown, right: unknown): boolean {
  return stableStringify(left) === stableStringify(right);
}

function assertReferenceAvailable(
  document: DocumentSnapshot,
  field: "replaces" | "replacedBy" | "revisionOf",
  expectedId: string,
): void {
  const current = document[field]?._ref;
  if (current && current !== expectedId) {
    throw new Error(
      `${document._id}.${field} already points to ${current}; refusing to replace it with ${expectedId}.`,
    );
  }
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

  const oldEventId = eventDocumentId(
    "event:apple:macos:27.0:public-beta-4",
  );
  const revisedEventId = eventDocumentId(
    "event:apple:macos:27.0:public-beta-4-v2",
  );
  const oldBuildId = buildDocumentId("version-macos-27-0", "26A5416a");
  const revisedBuildId = buildDocumentId("version-macos-27-0", "26A5416b");
  const baseIds = [
    ...coverageTargets.map((target) => target.id),
    oldEventId,
    revisedEventId,
    oldBuildId,
    revisedBuildId,
  ];
  const ids = [...baseIds, ...baseIds.map((id) => `drafts.${id}`)];
  const documents = await client.fetch<DocumentSnapshot[]>(
    `*[_id in $ids]{
      _id,
      _rev,
      _type,
      chronologyCoverage,
      availabilityState,
      replaces,
      replacedBy,
      revisionOf
    }`,
    { ids },
  );
  const byId = new Map(documents.map((document) => [document._id, document]));

  for (const id of baseIds) {
    if (!byId.has(id)) {
      throw new Error(
        `Missing ${id}. Apply both release-sweep manifests before finalizing metadata.`,
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

  const relationUpdates: Array<{
    id: string;
    fields: Record<string, unknown>;
    refs: Array<["replaces" | "replacedBy" | "revisionOf", string]>;
    description: string;
  }> = [
    {
      id: oldEventId,
      fields: { availabilityState: "replaced", replacedBy: reference(revisedEventId) },
      refs: [["replacedBy", revisedEventId]],
      description: "mark macOS 27 Public Beta 4 event replaced",
    },
    {
      id: revisedEventId,
      fields: { replaces: reference(oldEventId) },
      refs: [["replaces", oldEventId]],
      description: "link macOS 27 Public Beta 4 revision to original event",
    },
    {
      id: oldBuildId,
      fields: { availabilityState: "replaced", replacedBy: reference(revisedBuildId) },
      refs: [["replacedBy", revisedBuildId]],
      description: "mark macOS build 26A5416a replaced",
    },
    {
      id: revisedBuildId,
      fields: {
        revisionOf: reference(oldBuildId),
        replaces: reference(oldBuildId),
      },
      refs: [
        ["revisionOf", oldBuildId],
        ["replaces", oldBuildId],
      ],
      description: "link macOS build 26A5416b to replaced build",
    },
  ];

  for (const update of relationUpdates) {
    for (const id of [update.id, `drafts.${update.id}`]) {
      const document = byId.get(id);
      if (!document) continue;
      for (const [field, expectedId] of update.refs) {
        assertReferenceAvailable(document, field, expectedId);
      }
      const changed = Object.fromEntries(
        Object.entries(update.fields).filter(
          ([field, value]) =>
            !equal(document[field as keyof DocumentSnapshot], value),
        ),
      );
      if (Object.keys(changed).length > 0) {
        patches.push({
          id,
          revision: document._rev,
          description: update.description,
          set: changed,
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
