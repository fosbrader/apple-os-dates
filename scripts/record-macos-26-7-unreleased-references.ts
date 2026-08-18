/**
 * Records what the macOS Tahoe 26.7 release candidate contains beyond its
 * security fixes: identifiers and assets for hardware Apple has not announced.
 *
 * This is a fact about the shipped build, not a rumour. The strings are in a
 * build Apple seeded, two outlets examined the same build on the same day, and
 * one of them quotes the code directly. The archive records what a build
 * contains; it does not forecast what Apple will ship, and the prose here is
 * careful to stay on the first side of that line.
 *
 * The chronology is the part only this archive can supply: the B790 identifier
 * did not first appear here. It surfaced in iOS 27 developer beta 2 on
 * 2026-07-03, six weeks earlier. That is recorded as a separate occurrence on
 * the beta 2 event so the two sightings are linked by the same change document.
 *
 * Dry run (default):
 *   npx sanity exec scripts/record-macos-26-7-unreleased-references.ts --with-user-token
 *
 * Apply:
 *   npx sanity exec scripts/record-macos-26-7-unreleased-references.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const accessedAt = "2026-08-17";
const reviewedAt = "2026-08-17T00:00:00Z";

function compactHash(v: string): string {
  return createHash("sha256").update(v).digest("hex").slice(0, 24);
}
function sourceDocumentId(url: string): string {
  const u = new URL(url);
  u.hash = "";
  return `source-${compactHash(u.toString())}`;
}
function eventDocumentId(stableEventId: string): string {
  return `release-event-${compactHash(stableEventId)}`;
}
function changeDocumentId(key: string): string {
  if (!/^[a-z0-9]+(?:[._-][a-z0-9]+)*$/.test(key)) {
    throw new Error(`Change key ${key} is not a valid slug.`);
  }
  return `release-change-${compactHash(key)}`;
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

const MR_REFERENCES = "https://www.macrumors.com/2026/08/17/macos-26-7-unreleased-apple-devices/";
const MR_AIRPODS = "https://www.macrumors.com/2026/08/17/camera-equipped-airpods-macos-26-7/";
const MR_BETA2 = "https://www.macrumors.com/2026/07/03/ios-27-beta-hints-at-new-apple-product/";

const SOURCES = [
  {
    canonicalUrl: MR_REFERENCES,
    title: "macOS Tahoe 26.7 is Full of References to Unreleased Apple Products",
    publisher: "MacRumors",
    sourceClass: "journalism",
    publishedAt: "2026-08-17T00:00:00Z",
    topics: ["macOS", "26.7", "unreleased hardware", "codenames"],
  },
  {
    canonicalUrl: MR_AIRPODS,
    title: "Apple's Camera-Equipped AirPods Confirmed: See Them in Action",
    publisher: "MacRumors",
    sourceClass: "journalism",
    publishedAt: "2026-08-17T00:00:00Z",
    topics: ["AirPods", "B790", "macOS", "26.7"],
  },
  {
    canonicalUrl: MR_BETA2,
    title: "iOS 27 Beta Hints at New Apple Product Such as 'AirPods Ultra'",
    publisher: "MacRumors",
    sourceClass: "journalism",
    publishedAt: "2026-07-03T00:00:00Z",
    topics: ["iOS 27", "beta 2", "B790", "AirPods"],
  },
];

const CHANGE_KEY = "apple-b790-camera-airpods-references-in-shipped-builds";

/** Occurrence on the macOS 26.7 RC, and the earlier one it descends from. */
const OCCURRENCES = [
  {
    stableEventId: "event:apple:macos:26.7:rc",
    summary:
      "The macOS Tahoe 26.7 release candidate carries identifiers and assets for hardware Apple has " +
      "not announced, including a device codenamed B790 described as camera-equipped AirPods. One " +
      "outlet reports a demonstration video in the build showing the earbuds used with Visual " +
      "Intelligence, and quotes the string \"B790 start image stream failed for left bud.\" The same " +
      "build is reported to reference roughly twenty unannounced products across home accessories, " +
      "headphones, iPhones, Macs, iPad, and a headset variant. Version Record records the presence " +
      "of these strings in the shipped build and makes no claim about what Apple will release.",
    evidence: [
      [MR_REFERENCES, "Article body enumerating unreleased product codenames found in the macOS Tahoe 26.7 release candidate, including B790, V62, V63, V64, V67, V68, B525, J490, J491"],
      [MR_AIRPODS, "Article body quoting the string \"B790 start image stream failed for left bud.\" and describing a demonstration video found in the macOS Tahoe 26.7 release candidate"],
    ] as [string, string][],
  },
  {
    // Betas 1-4 of this cycle still carry the legacy milestone stable IDs from
    // the release-event migration; only beta 5 onward uses the event:apple: form.
    stableEventId: "version-ios-27-0:m1",
    summary:
      "The second iOS 27 developer beta, seeded June 22, 2026, contained the first reported sighting " +
      "of the B790 identifier, described at the time as a dual-camera device likely to be " +
      "camera-equipped AirPods. This is the earliest appearance of the identifier in a build Apple " +
      "seeded, six weeks before the macOS Tahoe 26.7 release candidate carried a working demonstration.",
    evidence: [
      [MR_BETA2, "Article dated July 3, 2026 reporting the B790 codename with dual cameras found in the second iOS 27 developer beta"],
    ] as [string, string][],
  },
];

interface EventDoc {
  _id: string;
  _rev: string;
  citations?: { _key: string }[];
  changes?: { _key: string }[];
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
  for (const o of OCCURRENCES) {
    if (/[—–]/.test(o.summary)) throw new Error(`Dash in summary for ${o.stableEventId}`);
  }

  const mutations: unknown[] = [];
  const planned: string[] = [];

  const sourceIds = SOURCES.map((s) => sourceDocumentId(s.canonicalUrl));
  const changeId = changeDocumentId(CHANGE_KEY);
  const eventIds = OCCURRENCES.flatMap((o) => {
    const id = eventDocumentId(o.stableEventId);
    return [id, `drafts.${id}`];
  });

  const existing: { _id: string }[] = await client.fetch("*[_id in $ids]{_id}", {
    ids: [...sourceIds, changeId],
  });
  const have = new Set(existing.map((d) => d._id));

  for (const source of SOURCES) {
    const id = sourceDocumentId(source.canonicalUrl);
    if (have.has(id)) continue;
    mutations.push({
      createIfNotExists: {
        _id: id,
        _type: "source",
        title: source.title,
        canonicalUrl: source.canonicalUrl,
        publisher: source.publisher,
        sourceClass: source.sourceClass,
        publishedAt: source.publishedAt,
        accessedAt,
        status: "active",
        reuseBasis: "linkedFactsOnly",
        topics: source.topics,
      },
    });
    planned.push(`source   ${id}  ${source.publisher}`);
  }

  if (!have.has(changeId)) {
    mutations.push({
      createIfNotExists: {
        _id: changeId,
        _type: "releaseChange",
        title: "Shipped builds reference unannounced camera-equipped AirPods (B790)",
        slug: { _type: "slug", current: CHANGE_KEY },
        canonicalSummary:
          "Builds Apple seeded carry the identifier B790, reported as camera-equipped AirPods, alongside identifiers for other unannounced hardware.",
        category: "other",
        status: "active",
        provenanceStatus: "sourceLinked",
        editorialReview: { _type: "editorialReview", status: "approved", reviewedAt },
        citations: [
          citation(MR_REFERENCES, "Enumeration of unreleased product codenames in the macOS Tahoe 26.7 release candidate"),
          citation(MR_BETA2, "First reported sighting of the B790 codename, in the second iOS 27 developer beta"),
        ],
      },
    });
    planned.push(`change   ${changeId}  B790 references`);
  }

  const events: EventDoc[] = await client.fetch(
    "*[_id in $ids]{_id, _rev, citations, changes}",
    { ids: eventIds },
  );
  const byId = new Map(events.map((e) => [e._id, e]));

  for (const occurrence of OCCURRENCES) {
    const baseId = eventDocumentId(occurrence.stableEventId);
    for (const id of [baseId, `drafts.${baseId}`]) {
      const event = byId.get(id);
      if (!event) {
        if (id === baseId) throw new Error(`Missing event ${id} (${occurrence.stableEventId}).`);
        continue;
      }

      const occurrenceEntry = {
        _key: `occurrence-${compactHash(`${id}\0${CHANGE_KEY}`)}`,
        _type: "changeOccurrence",
        change: reference(changeId),
        action: "introduced",
        inheritance: "delta",
        summary: occurrence.summary,
        documentedStatus: "undocumented",
        evidenceState: occurrence.evidence.length > 1 ? "corroborated" : "reported",
        verificationMethod:
          "Reporting from MacRumors examining the shipped build directly, with the code string quoted in the article.",
        citations: occurrence.evidence.map(([url, locator]) => citation(url, locator)),
      };

      // Merge, never replace: these events already carry changes and citations.
      const priorChanges = (event.changes ?? []).filter(
        (c) => c._key !== occurrenceEntry._key,
      );
      const mergedChanges = [...priorChanges, occurrenceEntry];

      const priorCitations = event.citations ?? [];
      const seen = new Set(priorCitations.map((c) => c._key));
      const mergedCitations = [...priorCitations];
      for (const [url, locator] of occurrence.evidence) {
        const c = citation(url, locator);
        if (!seen.has(c._key)) {
          seen.add(c._key);
          mergedCitations.push(c);
        }
      }

      mutations.push({
        patch: {
          id,
          ifRevisionID: event._rev,
          set: {
            changes: mergedChanges,
            citations: mergedCitations,
            isIndexable: true,
          },
        },
      });
      planned.push(
        `occurrence ${id.padEnd(46)} ${occurrence.stableEventId}  ${mergedChanges.length} changes, ${mergedCitations.length} citations`,
      );
    }
  }

  console.log(planned.join("\n"));
  console.log(`\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} mutations.`);

  if (!apply) {
    console.log("No Sanity data changed. Rerun with --apply --confirm-production.");
    return;
  }

  const result = await client.mutate(mutations as never, { visibility: "sync" });
  console.log(`Committed transaction ${result.transactionId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
