/**
 * Writes version-level `overview` prose for the 2026-08-17 point releases.
 *
 * `scripts/report-content-coverage.ts` grades a `releaseVersion` as
 * `fullArticle` only when its review is `approved`, it carries at least one
 * citation, and `pt::text(overview)` is 80 characters or more. The six versions
 * that shipped on 2026-08-17 arrived with citations and a `versionNote` but no
 * `overview`, so they sat at `sourceLinked` and showed up in the coverage
 * report as families still needing a full article.
 *
 * The `overview` describes the version as a whole. It is deliberately distinct
 * from the `articleBody` on each `releaseEvent`, which describes one appearance
 * on one date. Citations already on the version documents support these claims;
 * this command adds prose and the approval, and never touches identity fields.
 *
 * Dry run (default):
 *   npx sanity exec scripts/write-point-release-overviews.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/write-point-release-overviews.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const reviewedAt = "2026-08-17T00:00:00Z";

function compactHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function block(text: string, key: string) {
  return {
    _key: `block-${compactHash(key)}`,
    _type: "block" as const,
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: `span-${compactHash(key)}`,
        _type: "span" as const,
        marks: [],
        text,
      },
    ],
  };
}

interface OverviewInput {
  versionId: string;
  label: string;
  paragraphs: string[];
}

const OVERVIEWS: OverviewInput[] = [
  {
    versionId: "version-ios-26-6-1",
    label: "iOS 26.6.1",
    paragraphs: [
      "iOS 26.6.1 is a security-only point release on the iOS 26 train. Apple seeded it as a release candidate, build 23G82, on August 10, 2026, and shipped build 23G83 to the public seven days later on August 17. The candidate did not ship unchanged.",
      "Its security advisory covers 21 vulnerability entries carrying 29 distinct CVE identifiers across eight components: Audio, ImageIO, IOGPUFamily, Kernel, Telephony, WebKit, WebKit History, and WebKit Storage. Nineteen of the 29 sit under WebKit alone. One entry, the Telephony fix CVE-2026-65329, is scoped to iPhone and does not reach iPad. Apple states that the fixes were first made available in the iOS 27 and iPadOS 27 betas. No entry describes an exploited vulnerability.",
    ],
  },
  {
    versionId: "version-ipados-26-6-1",
    label: "iPadOS 26.6.1",
    paragraphs: [
      "iPadOS 26.6.1 is a security-only point release on the iPadOS 26 train. Apple seeded build 23G82 as a release candidate on August 10, 2026 and shipped build 23G83 publicly on August 17, one increment higher.",
      "It shares a security advisory with iOS 26.6.1. Of the 29 CVE identifiers in that document, 28 carry availability lines that include iPad hardware; the Telephony entry CVE-2026-65329 is scoped to iPhone alone. Apple states that the fixes were first made available in the iOS 27 and iPadOS 27 betas, and no entry describes an exploited vulnerability.",
    ],
  },
  {
    versionId: "version-macos-26-6-2",
    label: "macOS Tahoe 26.6.2",
    paragraphs: [
      "macOS Tahoe 26.6.2 is a security-only point release on the macOS 26 train. Apple seeded build 25G82 as a beta on August 10, 2026 and shipped build 25G83 publicly on August 17.",
      "Its advisory carries 20 vulnerability entries covering 28 distinct CVE identifiers across seven components, every one scoped simply to macOS Tahoe. That set is exactly the iOS 26.6.1 set minus the iPhone-only Telephony entry. The release arrived 11 days after macOS Tahoe 26.6.1, which had carried a single CVE, a Screen Sharing authentication flaw. Apple states that the fixes were first made available in the macOS Golden Gate 27 beta.",
    ],
  },
  {
    versionId: "version-ios-18-7-10",
    label: "iOS 18.7.10",
    paragraphs: [
      "iOS 18.7.10 is a security update on the legacy iOS 18 train, which Apple continues to maintain for devices that cannot run iOS 26. Apple seeded build 22H373 as a release candidate on August 10, 2026 and shipped build 22H374 publicly on August 17.",
      "It is the largest security document Apple published that day. The advisory carries 97 vulnerability entries covering 122 distinct CVE identifiers across 44 components, more than four times the 29 in the same day's iOS 26.6.1. WebKit accounts for 38 identifiers and the WebKit family 42, with Kernel next at 18 and 33 components carrying a single identifier each. Every availability line in the document is identical: iPhone XS, iPhone XS Max, iPhone XR, and the seventh-generation iPad. Apple states that the fixes were first made available in the iOS 26.6 and 27 and iPadOS 26.6 and 27 betas, naming two beta generations where the current-train advisory names one.",
    ],
  },
  {
    versionId: "version-ipados-18-7-10",
    label: "iPadOS 18.7.10",
    paragraphs: [
      "iPadOS 18.7.10 is a security update on the legacy iPadOS 18 train. Apple seeded build 22H373 as a release candidate on August 10, 2026 and shipped build 22H374 publicly on August 17.",
      "It shares one advisory with iOS 18.7.10, so its 122 CVE identifiers across 44 components are the same set and should be counted once rather than twice in any aggregate. On the iPad side the document names a single supported model, the seventh-generation iPad. Apple states that the fixes were first made available in the iOS 26.6 and 27 and iPadOS 26.6 and 27 betas.",
    ],
  },
  {
    versionId: "version-visionos-26-6-1",
    label: "visionOS 26.6.1",
    paragraphs: [
      "visionOS 26.6.1 shipped publicly on August 17, 2026 as build 23O780. It is the only one of the six Apple point releases dated that day that had no prerelease behind it, stepping directly from visionOS 26.6 without an intervening beta or release candidate.",
      "Its security content was not published alongside it. Apple's security releases index lists the version under the August 17 date with no linked support document, and the cell that normally names supported devices reads that details are coming. That wording appears once on the index, and it is distinct from the note Apple uses elsewhere for an update with no published CVE entries. Version Record therefore records no CVE count or fix description for this version, and will add one if Apple publishes an advisory.",
    ],
  },
];

interface VersionDocument {
  _id: string;
  _rev: string;
  _type: string;
  overview?: unknown[];
  citations?: unknown[];
  editorialReview?: { status?: string };
}

function assertNoDashes(value: string, where: string): void {
  if (/[—–]/.test(value)) {
    throw new Error(`${where} contains an em-dash or en-dash: ${value}`);
  }
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

  for (const overview of OVERVIEWS) {
    overview.paragraphs.forEach((p, i) =>
      assertNoDashes(p, `${overview.versionId} paragraph ${i}`),
    );
  }

  const ids = OVERVIEWS.flatMap((o) => [o.versionId, `drafts.${o.versionId}`]);
  const documents: VersionDocument[] = await client.fetch(
    "*[_id in $ids]{_id, _rev, _type, overview, citations, editorialReview}",
    { ids },
  );
  const byId = new Map(documents.map((d) => [d._id, d]));

  const mutations: unknown[] = [];
  const planned: string[] = [];

  for (const overview of OVERVIEWS) {
    const published = byId.get(overview.versionId);
    if (!published) {
      throw new Error(`${overview.versionId} does not exist.`);
    }
    // The coverage grade needs a citation as well as prose. Refuse rather than
    // write an approved article onto a version with nothing supporting it.
    if ((published.citations?.length ?? 0) === 0) {
      throw new Error(
        `${overview.versionId} has no citations; refusing to mark it approved.`,
      );
    }

    for (const id of [overview.versionId, `drafts.${overview.versionId}`]) {
      const document = byId.get(id);
      if (!document) continue;

      const body = overview.paragraphs.map((text, index) =>
        block(text, `${id}\0${index}\0${text.slice(0, 80)}`),
      );
      const characters = overview.paragraphs.join(" ").length;
      if (characters < 80) {
        throw new Error(
          `${id} overview is ${characters} characters; the coverage grade needs 80.`,
        );
      }

      mutations.push({
        patch: {
          id,
          ifRevisionID: document._rev,
          set: {
            overview: body,
            editorialReview: {
              _type: "editorialReview",
              status: "approved",
              reviewedAt,
            },
          },
        },
      });
      planned.push(
        `overview ${id.padEnd(30)} ${overview.label.padEnd(19)} ${body.length} blocks, ${characters} chars`,
      );
    }
  }

  console.log(planned.join("\n"));
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} mutations.`);

  if (!apply) {
    console.log(
      "No Sanity data changed. Rerun with --apply --confirm-production.",
    );
    return;
  }

  const result = await client.mutate(mutations as never, {
    visibility: "sync",
  });
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
