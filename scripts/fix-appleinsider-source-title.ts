/**
 * Corrects a fabricated source title.
 *
 * `scripts/ingest-prerelease-point-releases.ts` created the AppleInsider source
 * for 2026-08-10 with a hand-written title, "Apple releases betas for iOS
 * 18.7.10, iOS 26.6.1, and macOS 26.6.2". That is not the article's headline.
 * The real headline is "Apple preps beta security updates for iOS 18, iOS 26,
 * and macOS 26", and the invented one also mischaracterizes the iPhone and iPad
 * builds: the article describes them as release candidates, not betas.
 *
 * The URL is real and the facts cited from it are correct, so no claim changes.
 * What was wrong is the attribution: a citation displayed a title the publisher
 * never used. On an archive whose value is that a reader can follow a citation
 * to its source, that is worth fixing rather than leaving.
 *
 * Every other hand-authored source title from the 2026-08 release days was
 * checked against the live page in the same pass; this was the only mismatch.
 *
 * Dry run (default):
 *   npx sanity exec scripts/fix-appleinsider-source-title.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/fix-appleinsider-source-title.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";

const SOURCE_ID = "source-16367166568223ce14a4f786";
const EXPECTED_URL =
  "https://appleinsider.com/articles/26/08/10/apple-preps-beta-security-updates-for-ios-18-ios-26-and-macos-26";
const WRONG_TITLE =
  "Apple releases betas for iOS 18.7.10, iOS 26.6.1, and macOS 26.6.2";
const CORRECT_TITLE =
  "Apple preps beta security updates for iOS 18, iOS 26, and macOS 26";

interface SourceDoc {
  _id: string;
  _rev: string;
  canonicalUrl?: string;
  title?: string;
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

  const docs: SourceDoc[] = await client.fetch(
    "*[_id in $ids]{_id, _rev, canonicalUrl, title}",
    { ids: [SOURCE_ID, `drafts.${SOURCE_ID}`] },
  );
  const published = docs.find((d) => d._id === SOURCE_ID);
  if (!published) throw new Error(`${SOURCE_ID} does not exist.`);
  if (published.canonicalUrl !== EXPECTED_URL) {
    throw new Error(
      `${SOURCE_ID}.canonicalUrl is ${published.canonicalUrl}, not the expected AppleInsider article.`,
    );
  }

  const mutations: unknown[] = [];
  for (const doc of docs) {
    if (doc.title === CORRECT_TITLE) continue;
    if (doc.title !== WRONG_TITLE) {
      throw new Error(
        `${doc._id}.title is ${JSON.stringify(doc.title)}, expected the known-wrong title or the corrected one.`,
      );
    }
    mutations.push({
      patch: { id: doc._id, ifRevisionID: doc._rev, set: { title: CORRECT_TITLE } },
    });
    console.log(`title  ${doc._id}`);
    console.log(`   was: ${WRONG_TITLE}`);
    console.log(`   now: ${CORRECT_TITLE}`);
  }

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
