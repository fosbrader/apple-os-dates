/**
 * Corrects the recorded release date for iOS and iPadOS 18.7.7.
 *
 * Apple's security releases index lists 18.7.7 on TWO dates with two different
 * supported-device lists, both linking the same advisory. The backfill that
 * created these records deduplicated by (platform, version) and kept the later
 * row, which stored 2026-04-01.
 *
 * Apple's own advisory settles it. https://support.apple.com/en-us/126793 reads
 * "Released March 24, 2026" and then notes that availability was enabled for
 * more devices on April 1, 2026. So March 24 is the release date and April 1 is
 * an expansion of availability, not a second release.
 *
 * This command sets publicReleaseDate and the public event's appearanceDate to
 * 2026-03-24 and records the April 1 expansion in the event summary, where it
 * belongs as a fact about the appearance rather than as the release date.
 *
 * Dry run (default):
 *   npx sanity exec scripts/fix-ios-18-7-7-release-date.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/fix-ios-18-7-7-release-date.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";

const CORRECT_DATE = "2026-03-24";
const WRONG_DATE = "2026-04-01";

function compactHash(v: string): string {
  return createHash("sha256").update(v).digest("hex").slice(0, 24);
}
function eventDocumentId(stableEventId: string): string {
  return `release-event-${compactHash(stableEventId)}`;
}

const TARGETS = [
  { versionId: "version-ios-18-7-7", platform: "iOS", stableEventId: "event:apple:ios:18.7.10:public" },
  { versionId: "version-ipados-18-7-7", platform: "iPadOS", stableEventId: "event:apple:ipados:18.7.10:public" },
].map((t) => ({
  ...t,
  // stableEventId is derived from the version, not hard-coded above.
  stableEventId: `event:apple:${t.platform.toLowerCase()}:18.7.7:public`,
}));

function summary(platform: string): string {
  return (
    `Apple released ${platform} 18.7.7 to the public on March 24, 2026. Apple's advisory notes ` +
    `that availability was enabled for additional devices on April 1, 2026, so the security ` +
    `releases index lists the version on both dates. The March date is the release; the April ` +
    `date is an expansion of the supported-device list. No build number is recorded because ` +
    `neither the index nor the advisory carries one.`
  );
}

interface Doc {
  _id: string;
  _rev: string;
  _type: string;
  publicReleaseDate?: string;
  appearanceDate?: string;
  summary?: string;
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const confirmed = argv.includes("--confirm-production");

  const client = getCliClient({ apiVersion });
  const { projectId, dataset } = client.config();
  if (projectId !== expectedProjectId || dataset !== expectedDataset) {
    throw new Error(
      `Refusing to run against ${projectId}/${dataset}; expected ${expectedProjectId}/${expectedDataset}.`,
    );
  }
  if (apply && !confirmed) {
    throw new Error("--apply also requires --confirm-production.");
  }

  const ids = TARGETS.flatMap((t) => {
    const eventId = eventDocumentId(t.stableEventId);
    return [t.versionId, `drafts.${t.versionId}`, eventId, `drafts.${eventId}`];
  });
  const docs: Doc[] = await client.fetch(
    "*[_id in $ids]{_id, _rev, _type, publicReleaseDate, appearanceDate, summary}",
    { ids },
  );
  const byId = new Map(docs.map((d) => [d._id, d]));

  const mutations: unknown[] = [];
  const planned: string[] = [];

  for (const target of TARGETS) {
    const eventId = eventDocumentId(target.stableEventId);

    for (const id of [target.versionId, `drafts.${target.versionId}`]) {
      const doc = byId.get(id);
      if (!doc) continue;
      if (doc.publicReleaseDate === CORRECT_DATE) continue;
      if (doc.publicReleaseDate !== WRONG_DATE) {
        throw new Error(
          `${id}.publicReleaseDate is ${doc.publicReleaseDate}, expected ${WRONG_DATE} or ${CORRECT_DATE}.`,
        );
      }
      mutations.push({
        patch: { id, ifRevisionID: doc._rev, set: { publicReleaseDate: CORRECT_DATE } },
      });
      planned.push(`version  ${id.padEnd(26)} ${WRONG_DATE} -> ${CORRECT_DATE}`);
    }

    for (const id of [eventId, `drafts.${eventId}`]) {
      const doc = byId.get(id);
      if (!doc) continue;
      if (doc.appearanceDate === CORRECT_DATE && doc.summary === summary(target.platform)) continue;
      if (doc.appearanceDate !== WRONG_DATE && doc.appearanceDate !== CORRECT_DATE) {
        throw new Error(
          `${id}.appearanceDate is ${doc.appearanceDate}, expected ${WRONG_DATE} or ${CORRECT_DATE}.`,
        );
      }
      mutations.push({
        patch: {
          id,
          ifRevisionID: doc._rev,
          set: { appearanceDate: CORRECT_DATE, summary: summary(target.platform) },
        },
      });
      planned.push(`event    ${id.padEnd(46)} ${target.platform} 18.7.7 -> ${CORRECT_DATE}`);
    }
  }

  console.log(planned.join("\n") || "(nothing to change)");
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} revision-guarded patch.`);

  if (!apply) {
    console.log("No Sanity data changed. Rerun with --apply --confirm-production.");
    return;
  }
  if (mutations.length === 0) return;

  const result = await client.mutate(mutations as never, { visibility: "sync" });
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
