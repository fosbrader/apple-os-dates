/**
 * Ingests prerelease point-release appearances that the launch-content
 * pipeline deliberately refuses.
 *
 * `scripts/lib/launch-content-ingestion.ts` only creates a `releaseVersion`
 * whose identity is already `released` with a public date, and forces any
 * same-bundle event onto the durable public route. That guardrail keeps a
 * historical missing-version repair from becoming an implicit prerelease
 * backfill. It also means a version that currently exists *only* as a release
 * candidate or beta cannot be expressed there at all.
 *
 * This command covers exactly that case. It is dry-run by default:
 *
 *   npx sanity exec scripts/ingest-prerelease-point-releases.ts --with-user-token
 *
 * Apply requires both gates:
 *
 *   npx sanity exec scripts/ingest-prerelease-point-releases.ts --with-user-token -- \
 *     --apply --confirm-production
 *
 * Every document ID is derived with the same deterministic rules as the launch
 * pipeline, so re-running is a no-op rather than a duplicate.
 */

import { createHash } from "node:crypto";
import { getCliClient } from "sanity/cli";

const apiVersion = "2024-01-01";
const expectedProjectId = "lh3yswzu";
const expectedDataset = "production";
const accessedAt = "2026-08-10";

type SourceInput = {
  canonicalUrl: string;
  title: string;
  publisher: string;
  sourceClass: string;
  publishedAt?: string;
  topics: string[];
};

type RecordInput = {
  versionId: string;
  version: string;
  trainId: string;
  platformId: string;
  platformName: string;
  /** Omitted when the version document already exists. */
  createVersion: boolean;
  channel: "releaseCandidate" | "developerBeta";
  label: string;
  routeAlias: string;
  sequence?: number;
  appearanceDate: string;
  buildNumber: string;
  versionSummary: string;
  eventSummary: string;
  buildSummary: string;
  /** Event document ID to attach the build to, when the event already exists. */
  existingEventId?: string;
};

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function compactHash(value: string): string {
  return sha256(value).slice(0, 24);
}

function normalizeSourceUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  return url.toString();
}

function sourceDocumentId(url: string): string {
  return `source-${compactHash(normalizeSourceUrl(url))}`;
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
  return `release-build-${compactHash(
    `${versionId}\0${normalizedBuildNumber(buildNumber)}`,
  )}`;
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

const SOURCES: SourceInput[] = [
  {
    canonicalUrl: "https://developer.apple.com/news/releases/",
    title: "Releases - Apple Developer",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    topics: ["build numbers", "developer beta", "release candidate"],
  },
  {
    canonicalUrl:
      "https://appleinsider.com/articles/26/08/10/apple-preps-beta-security-updates-for-ios-18-ios-26-and-macos-26",
    // The article's own headline. An earlier hand-written title here invented
    // one the publisher never used, and also called the iPhone and iPad builds
    // betas when the article describes them as release candidates. Source
    // titles must come from the page, not from memory.
    title: "Apple preps beta security updates for iOS 18, iOS 26, and macOS 26",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    publishedAt: "2026-08-10T00:00:00Z",
    topics: ["iOS", "iPadOS", "macOS", "release candidate", "security update"],
  },
  {
    canonicalUrl:
      "https://mrmacintosh.com/macos-tahoe-26-6-1-update-everything-you-need-to-know/",
    title: "macOS Tahoe 26.6.1 UPDATE NOW!",
    publisher: "Mr. Macintosh",
    sourceClass: "community",
    publishedAt: "2026-08-06T00:00:00Z",
    topics: ["macOS", "Tahoe", "26.6.1", "build numbers"],
  },
];

const APPLE_RELEASES = sourceDocumentId(
  "https://developer.apple.com/news/releases/",
);
const APPLE_INSIDER = sourceDocumentId(
  "https://appleinsider.com/articles/26/08/10/apple-preps-beta-security-updates-for-ios-18-ios-26-and-macos-26",
);
const MR_MACINTOSH = sourceDocumentId(
  "https://mrmacintosh.com/macos-tahoe-26-6-1-update-everything-you-need-to-know/",
);

const RECORDS: RecordInput[] = [
  {
    versionId: "version-ios-26-6-1",
    version: "26.6.1",
    trainId: "train-ios-26",
    platformId: "platform-ios",
    platformName: "iOS",
    createVersion: true,
    channel: "releaseCandidate",
    label: "RC",
    routeAlias: "rc",
    appearanceDate: "2026-08-10",
    buildNumber: "23G82",
    versionSummary:
      "iOS 26.6.1 is a security-focused point release that entered release-candidate testing on August 10, 2026 and had not reached general availability on that date.",
    eventSummary:
      "Apple seeded the iOS 26.6.1 release candidate to developers and public beta testers on August 10, 2026. The build was not available as a general public update on that date.",
    buildSummary:
      "Release-candidate iOS 26.6.1 build seeded on August 10, 2026. The identifier is platform-scoped even though iPadOS 26.6.1 carries the same characters.",
  },
  {
    versionId: "version-ipados-26-6-1",
    version: "26.6.1",
    trainId: "train-ipados-26",
    platformId: "platform-ipados",
    platformName: "iPadOS",
    createVersion: true,
    channel: "releaseCandidate",
    label: "RC",
    routeAlias: "rc",
    appearanceDate: "2026-08-10",
    buildNumber: "23G82",
    versionSummary:
      "iPadOS 26.6.1 is a security-focused point release that entered release-candidate testing on August 10, 2026 and had not reached general availability on that date.",
    eventSummary:
      "Apple seeded the iPadOS 26.6.1 release candidate to developers and public beta testers on August 10, 2026. The build was not available as a general public update on that date.",
    buildSummary:
      "Release-candidate iPadOS 26.6.1 build seeded on August 10, 2026. The identifier is platform-scoped even though iOS 26.6.1 carries the same characters.",
  },
  {
    versionId: "version-macos-26-6-2",
    version: "26.6.2",
    trainId: "train-macos-26",
    platformId: "platform-macos",
    platformName: "macOS",
    createVersion: true,
    channel: "developerBeta",
    label: "Beta 1",
    routeAlias: "beta-1",
    sequence: 1,
    appearanceDate: "2026-08-10",
    buildNumber: "25G82",
    versionSummary:
      "macOS 26.6.2 is a security-focused point release that entered beta testing on August 10, 2026 and had not reached general availability on that date. Its number advances past 26.6.1, which shipped publicly on August 6, 2026.",
    eventSummary:
      "Apple seeded the first macOS 26.6.2 beta on August 10, 2026. Unlike the iPhone and iPad point releases distributed the same day, this appearance was reported as a beta rather than a release candidate.",
    buildSummary:
      "Prerelease macOS 26.6.2 build seeded for beta testing on August 10, 2026.",
  },
  {
    versionId: "version-ios-18-7-10",
    version: "18.7.10",
    trainId: "train-ios-18",
    platformId: "platform-ios",
    platformName: "iOS",
    createVersion: true,
    channel: "releaseCandidate",
    label: "RC",
    routeAlias: "rc",
    appearanceDate: "2026-08-10",
    buildNumber: "22H373",
    versionSummary:
      "iOS 18.7.10 is a security-focused point release on the legacy iOS 18 train. It entered release-candidate testing on August 10, 2026 and had not reached general availability on that date.",
    eventSummary:
      "Apple seeded the iOS 18.7.10 release candidate on August 10, 2026, continuing security maintenance for devices held on the iOS 18 train.",
    buildSummary:
      "Release-candidate iOS 18.7.10 build seeded on August 10, 2026. The identifier is platform-scoped even though iPadOS 18.7.10 carries the same characters.",
  },
  {
    versionId: "version-ipados-18-7-10",
    version: "18.7.10",
    trainId: "train-ipados-18",
    platformId: "platform-ipados",
    platformName: "iPadOS",
    createVersion: true,
    channel: "releaseCandidate",
    label: "RC",
    routeAlias: "rc",
    appearanceDate: "2026-08-10",
    buildNumber: "22H373",
    versionSummary:
      "iPadOS 18.7.10 is a security-focused point release on the legacy iPadOS 18 train. It entered release-candidate testing on August 10, 2026 and had not reached general availability on that date.",
    eventSummary:
      "Apple seeded the iPadOS 18.7.10 release candidate on August 10, 2026, continuing security maintenance for devices held on the iPadOS 18 train.",
    buildSummary:
      "Release-candidate iPadOS 18.7.10 build seeded on August 10, 2026. The identifier is platform-scoped even though iOS 18.7.10 carries the same characters.",
  },
];

/** macOS 26.6.1 already has its version and public event; only the build is absent. */
const MACOS_2661_BUILD = {
  versionId: "version-macos-26-6-1",
  platformId: "platform-macos",
  buildNumber: "25G76",
  existingEventId: "release-event-ecc60c9a6f29b864c5398eb4",
  summary:
    "Public macOS Tahoe 26.6.1 build released August 6, 2026. It addressed a Screen Sharing authentication issue tracked as CVE-2026-65400.",
};

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

  // Parents must already exist. This command never creates a platform or train.
  const parentIds = Array.from(
    new Set(RECORDS.flatMap((r) => [r.trainId, r.platformId])),
  );
  const parents: { _id: string }[] = await client.fetch(
    "*[_id in $ids]{_id}",
    { ids: parentIds },
  );
  const foundParents = new Set(parents.map((p) => p._id));
  const missingParents = parentIds.filter((id) => !foundParents.has(id));
  if (missingParents.length > 0) {
    throw new Error(
      `Missing required parent documents: ${missingParents.join(", ")}`,
    );
  }

  // Only plan what is actually absent or different. `createIfNotExists` alone
  // would make every rerun report a full write set, and a blind build-link
  // patch would churn a revision even when the value is already correct.
  const plannedIds = new Set<string>();
  for (const source of SOURCES) plannedIds.add(sourceDocumentId(source.canonicalUrl));
  for (const record of RECORDS) {
    plannedIds.add(record.versionId);
    plannedIds.add(
      eventDocumentId(
        `event:apple:${record.platformName.toLowerCase()}:${record.version}:${record.routeAlias}`,
      ),
    );
    plannedIds.add(buildDocumentId(record.versionId, record.buildNumber));
  }
  plannedIds.add(MACOS_2661_BUILD.existingEventId);
  plannedIds.add(
    buildDocumentId(MACOS_2661_BUILD.versionId, MACOS_2661_BUILD.buildNumber),
  );

  const existingDocs: { _id: string; build?: { _ref?: string } }[] =
    await client.fetch("*[_id in $ids]{_id, build}", {
      ids: Array.from(plannedIds),
    });
  const existing = new Map(existingDocs.map((d) => [d._id, d]));
  const buildRefOf = (id: string): string | undefined =>
    existing.get(id)?.build?._ref;

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
        ...(source.publishedAt ? { publishedAt: source.publishedAt } : {}),
        accessedAt,
        status: "active",
        reuseBasis: "linkedFactsOnly",
        topics: source.topics,
      },
    });
    planned.push(`source        ${id}  ${source.publisher}`);
  }

  for (const record of RECORDS) {
    const stableEventId = `event:apple:${record.platformName.toLowerCase()}:${record.version}:${record.routeAlias}`;
    const eventId = eventDocumentId(stableEventId);
    const buildId = buildDocumentId(record.versionId, record.buildNumber);
    const channelLocator = `${record.platformName} ${record.version} (${record.buildNumber}); August 10, 2026`;

    if (record.createVersion && !existing.has(record.versionId)) {
      mutations.push({
        createIfNotExists: {
          _id: record.versionId,
          _type: "releaseVersion",
          releaseTrain: reference(record.trainId),
          version: record.version,
          releaseStatus: "active",
          milestones: [],
          versionNote: record.versionSummary,
          provenanceStatus: "sourceLinked",
          editorialReview: { _type: "editorialReview", status: "readyForReview" },
          citations: [citation(APPLE_RELEASES, channelLocator)],
        },
      });
      planned.push(
        `version       ${record.versionId}  ${record.platformName} ${record.version}`,
      );
    } else if (record.createVersion) {
      skipped += 1;
    }

    if (!existing.has(eventId)) {
    mutations.push({
      createIfNotExists: {
        _id: eventId,
        _type: "releaseEvent",
        releaseVersion: reference(record.versionId),
        platform: reference(record.platformId),
        stableEventId,
        label: record.label,
        routeAlias: { _type: "slug", current: record.routeAlias },
        channel: record.channel,
        appearanceDate: record.appearanceDate,
        ...(record.sequence === undefined ? {} : { sequence: record.sequence }),
        isRevision: false,
        availabilityState: "available",
        closesReleaseCycle: false,
        summary: record.eventSummary,
        provenanceStatus: "sourceLinked",
        editorialReview: { _type: "editorialReview", status: "readyForReview" },
        isIndexable: false,
        citations: [
          citation(APPLE_RELEASES, channelLocator),
          citation(
            APPLE_INSIDER,
            `${record.platformName} ${record.version}; prerelease distribution on August 10, 2026`,
          ),
        ],
      },
    });
    planned.push(
      `event         ${eventId}  ${record.platformName} ${record.version} ${record.label}`,
    );
    } else {
      skipped += 1;
    }

    if (!existing.has(buildId)) {
    mutations.push({
      createIfNotExists: {
        _id: buildId,
        _type: "releaseBuild",
        releaseVersion: reference(record.versionId),
        platform: reference(record.platformId),
        buildNumber: normalizedBuildNumber(record.buildNumber),
        summary: record.buildSummary,
        provenanceStatus: "sourceLinked",
        editorialReview: { _type: "editorialReview", status: "readyForReview" },
        isIndexable: false,
        citations: [citation(APPLE_RELEASES, channelLocator)],
      },
    });
    planned.push(
      `build         ${buildId}  ${record.platformName} ${record.version} ${normalizedBuildNumber(record.buildNumber)}`,
    );
    } else {
      skipped += 1;
    }

    // Link the appearance to its verified build, unless it already points there.
    if (buildRefOf(eventId) !== buildId) {
      mutations.push({
        patch: { id: eventId, set: { build: reference(buildId) } },
      });
      planned.push(`link          ${eventId} -> ${buildId}`);
    } else {
      skipped += 1;
    }
  }

  // macOS 26.6.1: version and public event exist; add the missing build only.
  const macBuildId = buildDocumentId(
    MACOS_2661_BUILD.versionId,
    MACOS_2661_BUILD.buildNumber,
  );
  if (!existing.has(macBuildId)) {
  mutations.push({
    createIfNotExists: {
      _id: macBuildId,
      _type: "releaseBuild",
      releaseVersion: reference(MACOS_2661_BUILD.versionId),
      platform: reference(MACOS_2661_BUILD.platformId),
      buildNumber: normalizedBuildNumber(MACOS_2661_BUILD.buildNumber),
      summary: MACOS_2661_BUILD.summary,
      provenanceStatus: "sourceLinked",
      editorialReview: { _type: "editorialReview", status: "readyForReview" },
      isIndexable: false,
      citations: [
        citation(
          MR_MACINTOSH,
          "macOS Tahoe 26.6.1; build 25G76; released August 6, 2026",
        ),
      ],
    },
  });
  planned.push(
    `build         ${macBuildId}  macOS 26.6.1 ${normalizedBuildNumber(MACOS_2661_BUILD.buildNumber)}`,
  );
  } else {
    skipped += 1;
  }

  if (buildRefOf(MACOS_2661_BUILD.existingEventId) !== macBuildId) {
    mutations.push({
      patch: {
        id: MACOS_2661_BUILD.existingEventId,
        set: { build: reference(macBuildId) },
      },
    });
    planned.push(
      `link          ${MACOS_2661_BUILD.existingEventId} -> ${macBuildId}`,
    );
  } else {
    skipped += 1;
  }

  console.log(planned.length > 0 ? planned.join("\n") : "(nothing to do)");
  console.log(
    `\n${apply ? "APPLY" : "DRY RUN"}: ${mutations.length} mutations, ${skipped} already correct.`,
  );

  if (mutations.length === 0) {
    console.log("Dataset already matches this manifest. Nothing to apply.");
    return;
  }

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
