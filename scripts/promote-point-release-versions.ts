/**
 * Promotes point-release versions from prerelease to generally available.
 *
 * `scripts/lib/launch-content-ingestion.ts` cannot do this. When a manifest
 * carries an `identity` for a version that already exists,
 * `assertIdentityMatchesExistingVersion` requires the stored `releaseStatus`
 * and `publicReleaseDate` to equal the manifest's values and throws otherwise.
 * That is deliberate: a manifest may never silently rewrite the identity of a
 * version already in the archive. So a version seeded as a release candidate
 * cannot be flipped to `released` there, and shipping day needs this command.
 *
 * Scope is exactly the version document: `releaseStatus`, `publicReleaseDate`,
 * and `versionNote`. Events and builds for the same day are owned by the
 * launch-content manifest, and event prose is owned by the editorial pass, so
 * the three never contend for the same key.
 *
 * Every patch is revision-guarded and applied to both the published document
 * and any `drafts.` copy, because publishing a draft in Sanity is a whole
 * document swap that would otherwise discard this write.
 *
 * Dry run (default):
 *   npx sanity exec scripts/promote-point-release-versions.ts --with-user-token
 *
 * Apply requires both gates:
 *   npx sanity exec scripts/promote-point-release-versions.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";

const APPLE_RELEASES = "https://developer.apple.com/news/releases/";

function compactHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}
function sourceDocumentId(url: string): string {
  const normalized = new URL(url);
  normalized.hash = "";
  return `source-${compactHash(normalized.toString())}`;
}
function citation(sourceId: string, locator: string) {
  return {
    _key: `citation-${compactHash(`${sourceId}\0${locator}`)}`,
    _type: "citation" as const,
    locator,
    source: { _type: "reference" as const, _ref: sourceId },
  };
}

interface PromotionInput {
  versionId: string;
  platformName: string;
  version: string;
  publicReleaseDate: string;
  /** Guard: refuse unless the stored status is exactly this. */
  expectedCurrentStatus: string;
  versionNote: string;
  /** Build string Apple shipped publicly, for the releases-page locator. */
  publicBuildNumber: string;
  /** Security advisory URL and its in-document locator. */
  advisoryUrl: string;
  advisoryLocator: string;
}

const PROMOTIONS: PromotionInput[] = [
  {
    versionId: "version-ios-26-6-1",
    publicBuildNumber: "23G83",
    advisoryUrl: "https://support.apple.com/en-us/148282",
    advisoryLocator: "iOS 26.6.1 and iPadOS 26.6.1; Released August 17, 2026",
    platformName: "iOS",
    version: "26.6.1",
    publicReleaseDate: "2026-08-17",
    expectedCurrentStatus: "active",
    versionNote:
      "iOS 26.6.1 is a security-focused point release. It entered release-candidate testing on August 10, 2026 and reached general availability seven days later, on August 17, 2026, as a build one increment above the candidate.",
  },
  {
    versionId: "version-ipados-26-6-1",
    publicBuildNumber: "23G83",
    advisoryUrl: "https://support.apple.com/en-us/148282",
    advisoryLocator: "iOS 26.6.1 and iPadOS 26.6.1; Released August 17, 2026",
    platformName: "iPadOS",
    version: "26.6.1",
    publicReleaseDate: "2026-08-17",
    expectedCurrentStatus: "active",
    versionNote:
      "iPadOS 26.6.1 is a security-focused point release. It entered release-candidate testing on August 10, 2026 and reached general availability seven days later, on August 17, 2026, as a build one increment above the candidate.",
  },
  {
    versionId: "version-macos-26-6-2",
    publicBuildNumber: "25G83",
    advisoryUrl: "https://support.apple.com/en-us/148281",
    advisoryLocator: "macOS Tahoe 26.6.2; Released August 17, 2026",
    platformName: "macOS",
    version: "26.6.2",
    publicReleaseDate: "2026-08-17",
    expectedCurrentStatus: "active",
    versionNote:
      "macOS 26.6.2 is a security-focused point release that entered beta testing on August 10, 2026 and shipped publicly on August 17, 2026. Its number advances past 26.6.1, which had reached general availability only eleven days earlier, on August 6, 2026.",
  },
  {
    versionId: "version-ios-18-7-10",
    publicBuildNumber: "22H374",
    advisoryUrl: "https://support.apple.com/en-us/148287",
    advisoryLocator: "iOS 18.7.10 and iPadOS 18.7.10; Released August 17, 2026",
    platformName: "iOS",
    version: "18.7.10",
    publicReleaseDate: "2026-08-17",
    expectedCurrentStatus: "active",
    versionNote:
      "iOS 18.7.10 is a security-focused point release on the legacy iOS 18 train. It entered release-candidate testing on August 10, 2026 and shipped publicly on August 17, 2026, continuing security maintenance for devices that have not moved to iOS 26.",
  },
  {
    versionId: "version-ipados-18-7-10",
    publicBuildNumber: "22H374",
    advisoryUrl: "https://support.apple.com/en-us/148287",
    advisoryLocator: "iOS 18.7.10 and iPadOS 18.7.10; Released August 17, 2026",
    platformName: "iPadOS",
    version: "18.7.10",
    publicReleaseDate: "2026-08-17",
    expectedCurrentStatus: "active",
    versionNote:
      "iPadOS 18.7.10 is a security-focused point release on the legacy iPadOS 18 train. It entered release-candidate testing on August 10, 2026 and shipped publicly on August 17, 2026, continuing security maintenance for devices that have not moved to iPadOS 26.",
  },
];

function wantedKeys(promotion: PromotionInput): string[] {
  return [
    citation(
      sourceDocumentId(APPLE_RELEASES),
      `${promotion.platformName} ${promotion.version} (${promotion.publicBuildNumber}); August 17, 2026`,
    )._key,
    citation(sourceDocumentId(promotion.advisoryUrl), promotion.advisoryLocator)._key,
  ];
}

interface VersionDocument {
  _id: string;
  _rev: string;
  _type: string;
  version?: string;
  releaseStatus?: string;
  publicReleaseDate?: string;
  versionNote?: string;
  citations?: { _key: string }[];
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
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
  for (const promotion of PROMOTIONS) {
    if (!isIsoDate(promotion.publicReleaseDate)) {
      throw new Error(
        `${promotion.versionId}.publicReleaseDate is not a valid ISO date.`,
      );
    }
  }

  // Read every live copy. A draft that is later published would otherwise
  // overwrite the published copy and silently undo this promotion.
  const ids = PROMOTIONS.flatMap((p) => [p.versionId, `drafts.${p.versionId}`]);
  const documents: VersionDocument[] = await client.fetch(
    "*[_id in $ids]{_id, _rev, _type, version, releaseStatus, publicReleaseDate, versionNote, citations}",
    { ids },
  );
  const byId = new Map(documents.map((d) => [d._id, d]));

  const mutations: unknown[] = [];
  const planned: string[] = [];
  let alreadyCorrect = 0;

  for (const promotion of PROMOTIONS) {
    const published = byId.get(promotion.versionId);
    if (!published) {
      throw new Error(
        `${promotion.versionId} does not exist. This command promotes existing versions; it never creates one.`,
      );
    }
    if (published._type !== "releaseVersion") {
      throw new Error(
        `${promotion.versionId} is a ${published._type}, not a releaseVersion.`,
      );
    }
    if (published.version !== promotion.version) {
      throw new Error(
        `${promotion.versionId}.version is ${published.version}, expected ${promotion.version}.`,
      );
    }

    for (const id of [promotion.versionId, `drafts.${promotion.versionId}`]) {
      const document = byId.get(id);
      if (!document) continue;

      const isPromoted =
        document.releaseStatus === "released" &&
        document.publicReleaseDate === promotion.publicReleaseDate;

      // Refuse to touch a document that is neither in the expected prerelease
      // state nor already promoted to exactly the intended values. A different
      // stored publicReleaseDate means someone else has a different view of
      // this release and that disagreement must be resolved by a human.
      if (!isPromoted && document.releaseStatus !== promotion.expectedCurrentStatus) {
        throw new Error(
          `${id}.releaseStatus is ${document.releaseStatus}, expected ${promotion.expectedCurrentStatus} or an already-correct promotion.`,
        );
      }
      // GROQ projects an absent field as null, not undefined, so both spellings
      // of "no public date yet" have to count as unset.
      const storedPublicDate = document.publicReleaseDate ?? undefined;
      if (
        !isPromoted &&
        storedPublicDate !== undefined &&
        storedPublicDate !== promotion.publicReleaseDate
      ) {
        throw new Error(
          `${id}.publicReleaseDate is already ${document.publicReleaseDate}, not ${promotion.publicReleaseDate}.`,
        );
      }

      const citationsPresent = wantedKeys(promotion).every((key) =>
        (document.citations ?? []).some((c) => c._key === key),
      );
      if (
        isPromoted &&
        document.versionNote === promotion.versionNote &&
        citationsPresent
      ) {
        alreadyCorrect += 1;
        continue;
      }

      // The stored citation supports only the August 10 prerelease build. The
      // public date needs its own evidence, so merge in the releases-page entry
      // for the shipping build and the security advisory. Merge, never replace:
      // the prerelease citation stays, because it still supports the RC record.
      const wanted = [
        citation(
          sourceDocumentId(APPLE_RELEASES),
          `${promotion.platformName} ${promotion.version} (${promotion.publicBuildNumber}); August 17, 2026`,
        ),
        citation(
          sourceDocumentId(promotion.advisoryUrl),
          promotion.advisoryLocator,
        ),
      ];
      const existingCitations = document.citations ?? [];
      const seen = new Set(existingCitations.map((c) => c._key));
      const mergedCitations = [...existingCitations];
      for (const c of wanted) {
        if (!seen.has(c._key)) {
          seen.add(c._key);
          mergedCitations.push(c);
        }
      }

      mutations.push({
        patch: {
          id,
          ifRevisionID: document._rev,
          set: {
            releaseStatus: "released",
            publicReleaseDate: promotion.publicReleaseDate,
            versionNote: promotion.versionNote,
            citations: mergedCitations,
          },
        },
      });
      planned.push(
        `promote  ${id.padEnd(32)} ${promotion.platformName} ${promotion.version} -> released ${promotion.publicReleaseDate}`,
      );
    }
  }

  for (const line of planned) console.log(line);
  console.log(
    `\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} revision-guarded patch, ${alreadyCorrect} already correct.`,
  );

  if (!apply) {
    console.log(
      "No Sanity data changed. Rerun with --apply --confirm-production to write.",
    );
    return;
  }
  if (mutations.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  await client.request({
    uri: `/data/mutate/${dataset}`,
    method: "POST",
    body: { mutations },
    query: { returnIds: "true" },
  });

  // Idempotency check: a correct apply leaves nothing for a second run.
  const after: VersionDocument[] = await client.fetch(
    "*[_id in $ids]{_id, releaseStatus, publicReleaseDate, versionNote, citations}",
    { ids },
  );
  const unresolved = after.filter((document) => {
    const promotion = PROMOTIONS.find(
      (p) => p.versionId === document._id.replace(/^drafts\./, ""),
    )!;
    const keys = new Set((document.citations ?? []).map((c) => c._key));
    return (
      document.releaseStatus !== "released" ||
      document.publicReleaseDate !== promotion.publicReleaseDate ||
      document.versionNote !== promotion.versionNote ||
      !wantedKeys(promotion).every((key) => keys.has(key))
    );
  });
  if (unresolved.length > 0) {
    throw new Error(
      `Applied, but these documents did not reach the intended state: ${unresolved
        .map((d) => d._id)
        .join(", ")}`,
    );
  }

  console.log(`APPLIED: ${mutations.length} patch. Verified idempotent.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
