/**
 * Publishes the corrections-ledger entry for the 2026-08-17 release-day article.
 *
 * The article originally said twelve Apple releases landed that day. Fourteen
 * did. Apple seeded release candidates for macOS Tahoe 26.7 (25G220) and macOS
 * Sequoia 15.8 (24H16) without listing either on
 * https://developer.apple.com/news/releases/, which carried exactly twelve OS
 * entries for the day. Every check that day, including an adversarial
 * verification pass, read that feed and concluded the list was complete.
 *
 * The article has been updated and the two appearances recorded. This publishes
 * the public record of what changed and why.
 *
 * Dry run (default):
 *   npx sanity exec scripts/publish-correction-2026-08-17-release-count.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/publish-correction-2026-08-17-release-count.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";

const ARTICLE_ID = "sitePage.apple-release-day-2026-08-17";
const CORRECTION_ID = "correction.2026-08-17-release-day-count";
const CORRECTION_DATE = "2026-08-17";
const PUBLISHED_AT = "2026-08-18T01:45:00Z";

const NINE_TO_FIVE =
  "https://9to5mac.com/2026/08/17/apple-rolls-out-release-candidates-for-macos-tahoe-26-7-and-macos-sequoia-15-8/";
const ICLARIFIED =
  "https://www.iclarified.com/101800/apple-releases-macos-27-beta-6-plus-release-candidates-for-tahoe-and-sequoia-download";

function compactHash(v: string): string {
  return createHash("sha256").update(v).digest("hex").slice(0, 24);
}
function sourceDocumentId(url: string): string {
  const u = new URL(url);
  u.hash = "";
  return `source-${compactHash(u.toString())}`;
}
function reference(id: string) {
  return { _type: "reference" as const, _ref: id };
}
function citation(url: string, locator: string) {
  const sourceId = sourceDocumentId(url);
  return {
    _key: `citation-${compactHash(`${sourceId}\0${locator}`)}`,
    _type: "citation" as const,
    locator,
    source: reference(sourceId),
  };
}

const CITATIONS = [
  citation(
    NINE_TO_FIVE,
    "Article body giving macOS Tahoe 26.7 as build 25G220 and macOS Sequoia 15.8 as build 24H16, seeded August 17, 2026",
  ),
  citation(
    ICLARIFIED,
    'Article body: "Apple also provided the Release Candidate for macOS Tahoe 26.7 (build 25G220) and macOS Sequoia 15.8 (build 24H16)."',
  ),
];

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

  // Every referenced document must exist, or the ledger entry points at nothing.
  const required = [ARTICLE_ID, ...CITATIONS.map((c) => c.source._ref)];
  const present: { _id: string }[] = await client.fetch("*[_id in $ids]{_id}", {
    ids: required,
  });
  const found = new Set(present.map((p) => p._id));
  const missing = required.filter((id) => !found.has(id));
  if (missing.length > 0) {
    throw new Error(`Missing referenced documents: ${missing.join(", ")}`);
  }

  const document = {
    _id: CORRECTION_ID,
    _type: "correction" as const,
    title: "Release-day article undercounted the August 17, 2026 releases",
    slug: { _type: "slug" as const, current: "2026-08-17-release-day-count" },
    correctionDate: CORRECTION_DATE,
    reasonCategory: "factual",
    publicSummary:
      "Our August 17, 2026 release-day article said twelve Apple releases landed that day. Fourteen did. " +
      "Apple seeded release candidates for macOS Tahoe 26.7 and macOS Sequoia 15.8 the same day and listed " +
      "neither on its developer releases feed, which carried exactly twelve entries. We built the article " +
      "from that feed and treated it as the complete record for the day, so both appearances were missed. " +
      "The article now says fourteen and names both candidates with their build numbers, and both have been " +
      "added to the archive. The lesson we are carrying forward is that Apple's developer releases feed is " +
      "not a complete record of a release day: it omits release candidates for shipping point-release trains, " +
      "so coverage has to be cross-checked against independent reporting rather than the feed alone.",
    affectedClaims: [
      {
        _key: `claim-${compactHash(`${ARTICLE_ID}\0release-count`)}`,
        _type: "correctionClaim" as const,
        affectedDocument: reference(ARTICLE_ID),
        claim: "The number of Apple releases recorded for August 17, 2026.",
        previousValue: "Twelve Apple releases landed on August 17, 2026.",
        correctedValue: "Fourteen Apple releases landed on August 17, 2026.",
        resolution:
          "Apple seeded release candidates for macOS Tahoe 26.7 (build 25G220) and macOS Sequoia 15.8 " +
          "(build 24H16) on August 17, 2026. Neither appeared on Apple's developer releases feed, which was " +
          "the source used to enumerate the day. Both build numbers were confirmed against two independent " +
          "outlets before the count was corrected and the appearances recorded.",
        citations: CITATIONS,
      },
    ],
    status: "published",
    publishedAt: PUBLISHED_AT,
    // Required: the corrections query selects on status == "published" AND
    // editorialReview.status == "approved", and the schema refuses to publish a
    // correction that is not approved.
    editorialReview: {
      _type: "editorialReview" as const,
      status: "approved",
      reviewedAt: PUBLISHED_AT,
      reviewNotes:
        "Both build numbers confirmed against 9to5Mac and iClarified before the count was corrected. "
        + "The two appearances were recorded in the archive in the same pass.",
    },
    citations: CITATIONS,
  };

  console.log(`correction  ${CORRECTION_ID}`);
  console.log(`  title:   ${document.title}`);
  console.log(`  claims:  ${document.affectedClaims.length}`);
  console.log(`  cites:   ${document.citations.length}`);
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: 1 createOrReplace.`);

  if (!apply) {
    console.log("No Sanity data changed. Rerun with --apply --confirm-production.");
    return;
  }

  const result = await client.mutate(
    [{ createOrReplace: document }] as never,
    { visibility: "sync" },
  );
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
