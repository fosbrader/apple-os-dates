/**
 * Records the two macOS release candidates seeded on 2026-08-17.
 *
 * These were missed by the release-day pass, and the reason matters: neither
 * appears on https://developer.apple.com/news/releases/. That feed carried
 * exactly twelve OS entries for the day, all of which were captured. Apple
 * seeds point-release candidates for shipping macOS trains outside that feed,
 * so the feed is NOT a complete record of a release day and must not be treated
 * as one. Coverage has to be cross-checked against reporting as well.
 *
 * `scripts/lib/launch-content-ingestion.ts` cannot express these. Its version
 * identity block is typed `releaseStatus: "released"` with a required
 * `publicReleaseDate`, so a version that exists only as a release candidate
 * cannot be created there. This follows the pattern of
 * `scripts/ingest-prerelease-point-releases.ts`.
 *
 * Dry run (default):
 *   npx sanity exec scripts/ingest-macos-rc-2026-08-17.ts --with-user-token
 *
 * Apply requires both gates:
 *   npx sanity exec scripts/ingest-macos-rc-2026-08-17.ts --with-user-token -- \
 *     --apply --confirm-production
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const accessedAt = "2026-08-17";

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
function normalizedBuildNumber(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^\d+[A-Z]\d+[A-Z]?$/.test(normalized)) {
    throw new Error(`Build number ${value} is not a valid Apple build number.`);
  }
  return normalized;
}
function buildDocumentId(versionId: string, buildNumber: string): string {
  return `release-build-${compactHash(`${versionId}\0${normalizedBuildNumber(buildNumber)}`)}`;
}
function reference(id: string) {
  return { _type: "reference" as const, _ref: id };
}
function citation(sourceId: string, locator: string) {
  return {
    _key: `citation-${compactHash(`${sourceId}\0${locator}`)}`,
    _type: "citation" as const,
    locator,
    source: reference(sourceId),
  };
}

const SOURCES = [
  {
    canonicalUrl:
      "https://9to5mac.com/2026/08/17/apple-rolls-out-release-candidates-for-macos-tahoe-26-7-and-macos-sequoia-15-8/",
    title: "Apple rolls out macOS Tahoe 26.7 and macOS Sequoia 15.8 RCs",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    publishedAt: "2026-08-17T00:00:00Z",
    topics: ["macOS", "Tahoe", "Sequoia", "release candidate", "build numbers"],
  },
  {
    canonicalUrl:
      "https://www.iclarified.com/101800/apple-releases-macos-27-beta-6-plus-release-candidates-for-tahoe-and-sequoia-download",
    title:
      "Apple Releases macOS 27 Beta 6, Plus Release Candidates for Tahoe and Sequoia [Download]",
    publisher: "iClarified",
    sourceClass: "journalism",
    publishedAt: "2026-08-17T00:00:00Z",
    topics: ["macOS", "release candidate", "build numbers"],
  },
];

const NINE_TO_FIVE = sourceDocumentId(SOURCES[0].canonicalUrl);
const ICLARIFIED = sourceDocumentId(SOURCES[1].canonicalUrl);

interface RecordInput {
  versionId: string;
  version: string;
  marketingName: string;
  trainId: string;
  buildNumber: string;
  versionNote: string;
  eventSummary: string;
  buildSummary: string;
}

const RECORDS: RecordInput[] = [
  {
    versionId: "version-macos-26-7",
    version: "26.7",
    marketingName: "Tahoe",
    trainId: "train-macos-26",
    buildNumber: "25G220",
    versionNote:
      "macOS Tahoe 26.7 is a point release on the macOS 26 train. It entered release-candidate testing on August 17, 2026 and had not reached general availability on that date. Apple's release notes describe it as providing security fixes.",
    eventSummary:
      "Apple seeded the macOS Tahoe 26.7 release candidate on August 17, 2026, the same day it shipped macOS 26.6.2 publicly and seeded macOS 27 developer beta 6. Reporting notes that a public release candidate followed the developer seed the same day, carrying the same build. The appearance is absent from Apple's developer releases feed, so it is recorded from independent reporting.",
    buildSummary:
      "Release-candidate macOS Tahoe 26.7 build seeded on August 17, 2026. The build number is recorded from two independent outlets because Apple's developer releases feed did not list this appearance.",
  },
  {
    versionId: "version-macos-15-8",
    version: "15.8",
    marketingName: "Sequoia",
    trainId: "train-macos-15",
    buildNumber: "24H16",
    versionNote:
      "macOS Sequoia 15.8 is a point release on the legacy macOS 15 train. It entered release-candidate testing on August 17, 2026 and had not reached general availability on that date. Apple's release notes describe it as providing important security fixes recommended for all users.",
    eventSummary:
      "Apple seeded the macOS Sequoia 15.8 release candidate on August 17, 2026, alongside the macOS Tahoe 26.7 candidate. It is the first 15.8 appearance on the legacy Sequoia train, which had previously reached 15.7.9. The appearance is absent from Apple's developer releases feed, so it is recorded from independent reporting.",
    buildSummary:
      "Release-candidate macOS Sequoia 15.8 build seeded on August 17, 2026. The build number is recorded from two independent outlets because Apple's developer releases feed did not list this appearance.",
  },
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

  // Parents must already exist. This command never creates a train or platform.
  const parentIds = ["platform-macos", ...RECORDS.map((r) => r.trainId)];
  const parents: { _id: string }[] = await client.fetch("*[_id in $ids]{_id}", {
    ids: parentIds,
  });
  const found = new Set(parents.map((p) => p._id));
  const missingParents = parentIds.filter((id) => !found.has(id));
  if (missingParents.length > 0) {
    throw new Error(`Missing required parents: ${missingParents.join(", ")}`);
  }

  const plannedIds = new Set<string>();
  for (const s of SOURCES) plannedIds.add(sourceDocumentId(s.canonicalUrl));
  for (const r of RECORDS) {
    plannedIds.add(r.versionId);
    plannedIds.add(eventDocumentId(`event:apple:macos:${r.version}:rc`));
    plannedIds.add(buildDocumentId(r.versionId, r.buildNumber));
  }
  const existingDocs: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: Array.from(plannedIds) },
  );
  const existing = new Set(existingDocs.map((d) => d._id));

  // A build number is platform-scoped and must be unique. Refuse rather than
  // create a second document for a build the archive already knows.
  const clashes: { _id: string; buildNumber: string }[] = await client.fetch(
    `*[_type=="releaseBuild" && platform._ref=="platform-macos" && buildNumber in $builds]{_id, buildNumber}`,
    { builds: RECORDS.map((r) => normalizedBuildNumber(r.buildNumber)) },
  );
  for (const clash of clashes) {
    const owner = RECORDS.find(
      (r) => buildDocumentId(r.versionId, r.buildNumber) === clash._id,
    );
    if (!owner) {
      throw new Error(
        `Build ${clash.buildNumber} already exists as ${clash._id} under a different version.`,
      );
    }
  }

  const mutations: unknown[] = [];
  const planned: string[] = [];
  let skipped = 0;

  for (const source of SOURCES) {
    const id = sourceDocumentId(source.canonicalUrl);
    if (existing.has(id)) {
      skipped += 1;
      continue;
    }
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

  for (const record of RECORDS) {
    const stableEventId = `event:apple:macos:${record.version}:rc`;
    const eventId = eventDocumentId(stableEventId);
    const buildId = buildDocumentId(record.versionId, record.buildNumber);
    const locator = `macOS ${record.marketingName} ${record.version} (${record.buildNumber}); release candidate, August 17, 2026`;
    const cites = [
      citation(NINE_TO_FIVE, locator),
      citation(ICLARIFIED, locator),
    ];

    if (!existing.has(record.versionId)) {
      mutations.push({
        createIfNotExists: {
          _id: record.versionId,
          _type: "releaseVersion",
          releaseTrain: reference(record.trainId),
          version: record.version,
          releaseStatus: "active",
          milestones: [],
          versionNote: record.versionNote,
          provenanceStatus: "sourceLinked",
          editorialReview: { _type: "editorialReview", status: "readyForReview" },
          citations: cites,
        },
      });
      planned.push(
        `version  ${record.versionId}  macOS ${record.marketingName} ${record.version}`,
      );
    } else skipped += 1;

    if (!existing.has(eventId)) {
      mutations.push({
        createIfNotExists: {
          _id: eventId,
          _type: "releaseEvent",
          releaseVersion: reference(record.versionId),
          platform: reference("platform-macos"),
          stableEventId,
          label: "RC",
          routeAlias: { _type: "slug", current: "rc" },
          channel: "releaseCandidate",
          appearanceDate: "2026-08-17",
          isRevision: false,
          availabilityState: "available",
          closesReleaseCycle: false,
          summary: record.eventSummary,
          provenanceStatus: "sourceLinked",
          editorialReview: { _type: "editorialReview", status: "readyForReview" },
          isIndexable: false,
          citations: cites,
          build: reference(buildId),
        },
      });
      planned.push(`event    ${eventId}  ${stableEventId}`);
    } else skipped += 1;

    if (!existing.has(buildId)) {
      mutations.push({
        createIfNotExists: {
          _id: buildId,
          _type: "releaseBuild",
          releaseVersion: reference(record.versionId),
          platform: reference("platform-macos"),
          buildNumber: normalizedBuildNumber(record.buildNumber),
          summary: record.buildSummary,
          provenanceStatus: "sourceLinked",
          editorialReview: { _type: "editorialReview", status: "readyForReview" },
          isIndexable: false,
          citations: cites,
        },
      });
      planned.push(
        `build    ${buildId}  ${normalizedBuildNumber(record.buildNumber)}`,
      );
    } else skipped += 1;
  }

  console.log(planned.join("\n") || "(nothing to create)");
  console.log(
    `\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} create, ${skipped} already present.`,
  );

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
