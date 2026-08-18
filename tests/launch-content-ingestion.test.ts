import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  applyLaunchPlanToSnapshotForTest,
  assertLaunchTarget,
  assertValidLaunchContentPlan,
  buildLaunchContentPlan,
  deterministicLaunchIdsForTest,
  type LaunchContentBundle,
  type SanityDocument,
} from "../scripts/lib/launch-content-ingestion";

const releaseId = "version-ios-27-0";
const platformId = "platform-ios";
const trainId = "train-ios-27";
const betaSourceUrl = "https://developer.apple.com/news/releases/?id=06082026a";
const documentationUrl =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes";
const documentationTransportUrl =
  "https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json";
const missingReleaseId = "version-ios-27-1";

function snapshot(): SanityDocument[] {
  return [
    {
      _id: platformId,
      _rev: "platform-rev-1",
      _type: "platform",
      name: "iOS",
      slug: { _type: "slug", current: "ios" },
      color: "#007AFF",
      sortOrder: 1,
    },
    {
      _id: trainId,
      _rev: "train-rev-1",
      _type: "releaseTrain",
      platform: { _type: "reference", _ref: platformId },
      majorVersion: 27,
      displayName: "iOS 27",
      releaseYear: 2026,
    },
    {
      _id: releaseId,
      _rev: "release-rev-1",
      _type: "releaseVersion",
      releaseTrain: { _type: "reference", _ref: trainId },
      version: "27.0",
      releaseStatus: "active",
      provenanceStatus: "legacyImported",
      editorialReview: {
        _type: "editorialReview",
        status: "draft",
      },
      milestones: [
        {
          _key: "beta-1",
          _type: "betaMilestone",
          label: "Beta 1",
          date: "2026-06-08",
          sourceUrl: betaSourceUrl,
          sourceLabel: "Apple Developer",
          isRevision: false,
        },
        {
          _key: "beta-2",
          _type: "betaMilestone",
          label: "Beta 2",
          date: "2026-06-22",
          isRevision: false,
        },
      ],
    },
  ];
}

function emptyBundle(): LaunchContentBundle {
  return {
    formatVersion: 1,
    target: {
      projectId: "lh3yswzu",
      dataset: "production",
    },
    accessedAt: "2026-07-29",
    sources: [],
    versions: [],
    events: [],
    builds: [],
  };
}

function parentOnlySnapshot(): SanityDocument[] {
  return snapshot().filter((document) => document._type !== "releaseVersion");
}

function missingReleaseBundle(): LaunchContentBundle {
  return {
    ...emptyBundle(),
    versions: [
      {
        releaseVersionId: missingReleaseId,
        identity: {
          releaseTrainId: trainId,
          platformId,
          version: "27.1",
          releaseStatus: "released",
          publicReleaseDate: "2026-10-01",
        },
        authorship: "originalSynthesis",
        releaseNotesUrl: documentationUrl,
      },
    ],
    events: [
      {
        target: {
          releaseVersionId: missingReleaseId,
          routeAlias: "public",
        },
        identity: {
          releaseVersionId: missingReleaseId,
          platformId,
          stableEventId: "event:apple:ios:27.1:public",
          label: "Public",
          routeAlias: "public",
          channel: "public",
          appearanceDate: "2026-10-01",
          closesReleaseCycle: true,
        },
        authorship: "originalSynthesis",
      },
    ],
  };
}

test("legacy milestones become deterministic source-backed events without mutating chronology", () => {
  const first = buildLaunchContentPlan(snapshot(), emptyBundle());
  const second = buildLaunchContentPlan(snapshot(), emptyBundle());

  assert.deepEqual(first, second);
  assert.equal(first.plan.summary.sourceCreates, 1);
  assert.equal(first.plan.summary.eventCreates, 2);
  assert.equal(first.plan.summary.versionPatches, 0);
  assert.equal(
    first.plan.patches.some((patch) => Object.hasOwn(patch.set, "milestones")),
    false,
  );

  const sourceCreate = first.plan.creates.find(
    ({ document }) => document._type === "source",
  )?.document;
  assert.equal(sourceCreate?.canonicalUrl, betaSourceUrl);
  assert.equal(sourceCreate?.reuseBasis, "linkedFactsOnly");

  const citedEvent = first.plan.creates.find(
    ({ document }) =>
      document._type === "releaseEvent" &&
      document.legacySourceId === `${releaseId}:beta-1`,
  )?.document;
  assert.equal(citedEvent?.provenanceStatus, "sourceLinked");
  assert.equal(
    (
      citedEvent?.citations as Array<{
        source: { _ref: string };
      }>
    )[0].source._ref,
    sourceCreate?._id,
  );
  assert.equal(citedEvent?.isIndexable, false);
  assert.equal(
    (citedEvent?.editorialReview as { status: string }).status,
    "draft",
  );
  assert.doesNotThrow(() =>
    assertValidLaunchContentPlan(first.plan, first.rollback),
  );
  assert.deepEqual(
    first.rollback.createdDocumentIds.sort(),
    [...first.plan.creates.map(({ document }) => document._id)].sort(),
  );
  assert.deepEqual(first.rollback.restoreDocuments, []);
});

test("legacy source documents are reused and only missing provenance metadata is filled", () => {
  const documents = snapshot();
  documents.push({
    _id: "source-existing-apple-beta",
    _rev: "source-rev-1",
    _type: "source",
    canonicalUrl: betaSourceUrl,
  });

  const result = buildLaunchContentPlan(documents, emptyBundle());
  assert.equal(result.plan.summary.sourceCreates, 0);
  const sourcePatch = result.plan.patches.find(
    (patch) => patch.id === "source-existing-apple-beta",
  );
  assert.deepEqual(sourcePatch?.set, {
    accessedAt: "2026-07-29",
    publisher: "Apple Developer",
    reuseBasis: "linkedFactsOnly",
    sourceClass: "firstPartyDocumentation",
    status: "active",
    title: "Apple Developer",
  });
  const citedEvent = result.plan.creates.find(
    ({ document }) =>
      document._type === "releaseEvent" &&
      document.legacySourceId === `${releaseId}:beta-1`,
  )?.document;
  assert.equal(
    (
      citedEvent?.citations as Array<{
        source: { _ref: string };
      }>
    )[0].source._ref,
    "source-existing-apple-beta",
  );
  assert.equal(
    result.plan.patches.some((patch) => Object.hasOwn(patch.set, "milestones")),
    false,
  );

  const applied = applyLaunchPlanToSnapshotForTest(documents, result.plan);
  const residual = buildLaunchContentPlan(applied, emptyBundle());
  assert.equal(residual.plan.creates.length, 0);
  assert.equal(residual.plan.patches.length, 0);
});

test("the launch plan is idempotent and retains pre-existing editorial fields", () => {
  const initial = buildLaunchContentPlan(snapshot(), emptyBundle());
  const applied = applyLaunchPlanToSnapshotForTest(snapshot(), initial.plan);
  const migratedEvent = applied.find(
    (document) =>
      document._type === "releaseEvent" &&
      document.legacySourceId === `${releaseId}:beta-1`,
  )!;
  migratedEvent.summary = "A manually reviewed summary remains intact.";
  migratedEvent.articleBody = [
    {
      _key: "existing-block",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: "existing-span",
          _type: "span",
          text: "Existing editorial prose.",
          marks: [],
        },
      ],
    },
  ];
  migratedEvent._rev = "manual-editorial-rev";

  const residual = buildLaunchContentPlan(applied, emptyBundle());
  assert.equal(residual.plan.creates.length, 0);
  assert.equal(residual.plan.patches.length, 0);
});

test("a curated manifest writes version notes, inline citations, event changes, and a verified build", () => {
  const bundle: LaunchContentBundle = {
    ...emptyBundle(),
    sources: [
      {
        url: documentationUrl,
        transportUrl: documentationTransportUrl,
        title: "iOS & iPadOS 27 Release Notes",
        publisher: "Apple Developer",
        sourceClass: "firstPartyDocumentation",
      },
    ],
    versions: [
      {
        releaseVersionId: releaseId,
        authorship: "originalSynthesis",
        releaseNotesUrl: documentationUrl,
        overview: {
          authorship: "originalSynthesis",
          blocks: [
            {
              style: "h2",
              text: "Release overview",
            },
            {
              style: "normal",
              spans: [
                {
                  text: "The release introduces a revised system capability. ",
                  citations: [{ url: documentationUrl }],
                },
                {
                  text: "The first beta appeared in June.",
                  citations: [{ url: betaSourceUrl }],
                },
              ],
            },
          ],
        },
        provenanceStatus: "editoriallyVerified",
        editorialReview: {
          status: "approved",
          reviewedAt: "2026-07-29T15:00:00.000Z",
        },
      },
    ],
    events: [
      {
        target: {
          legacySourceId: `${releaseId}:beta-1`,
        },
        authorship: "originalSynthesis",
        summary:
          "The first developer beta established the initial public testing baseline.",
        article: {
          authorship: "originalSynthesis",
          blocks: [
            {
              text: "Apple documented the initial beta for registered developers.",
              citations: [{ url: documentationUrl }],
            },
          ],
        },
        changes: [
          {
            key: "example-system-capability",
            title: "Example system capability",
            canonicalSummary:
              "A system capability that changes how supported software behaves.",
            category: "enhancement",
            action: "introduced",
            summary:
              "The first beta introduced the capability for supported test devices.",
            documentedStatus: "documented",
            evidenceState: "confirmed",
            citations: [{ url: documentationUrl }],
          },
        ],
        provenanceStatus: "editoriallyVerified",
        editorialReview: {
          status: "approved",
          reviewedAt: "2026-07-29T15:00:00.000Z",
        },
        isIndexable: true,
      },
    ],
    builds: [
      {
        releaseVersionId: releaseId,
        platformId,
        buildNumber: "24A123",
        eventTargets: [
          {
            legacySourceId: `${releaseId}:beta-1`,
          },
        ],
        authorship: "originalSynthesis",
        summary: "Verified build associated with the first developer beta.",
        article: {
          authorship: "originalSynthesis",
          blocks: [
            {
              text: "The cited documentation identifies this build for the beta.",
              citations: [{ url: documentationUrl }],
            },
          ],
        },
        citations: [{ url: documentationUrl }],
        editorialReview: {
          status: "approved",
          reviewedAt: "2026-07-29T15:00:00.000Z",
        },
        isIndexable: true,
      },
    ],
  };

  const result = buildLaunchContentPlan(snapshot(), bundle);
  const versionPatch = result.plan.patches.find(
    (patch) => patch.id === releaseId,
  );
  assert.ok(versionPatch);
  assert.equal(versionPatch.set.releaseNotesUrl, documentationUrl);
  assert.equal(Object.hasOwn(versionPatch.set, "milestones"), false);
  assert.ok(Array.isArray(versionPatch.set.overview));

  const overview = versionPatch.set.overview as Array<{
    children: Array<{ marks: string[] }>;
    markDefs: Array<{
      _key: string;
      _type: string;
      source: { _ref: string };
    }>;
  }>;
  const claimBlock = overview[1];
  assert.equal(claimBlock.children.length, 2);
  assert.equal(claimBlock.children[0].marks.length, 1);
  assert.equal(claimBlock.children[1].marks.length, 1);
  assert.notEqual(
    claimBlock.children[0].marks[0],
    claimBlock.children[1].marks[0],
  );
  assert.ok(
    claimBlock.markDefs.every((mark) =>
      claimBlock.children.some((span) => span.marks.includes(mark._key)),
    ),
  );

  const build = result.plan.creates.find(
    ({ document }) => document._type === "releaseBuild",
  )?.document;
  const change = result.plan.creates.find(
    ({ document }) => document._type === "releaseChange",
  )?.document;
  const event = result.plan.creates.find(
    ({ document }) =>
      document._type === "releaseEvent" &&
      document.legacySourceId === `${releaseId}:beta-1`,
  )?.document;
  assert.equal(build?.buildNumber, "24A123");
  assert.ok(Array.isArray(build?.citations));
  assert.equal(
    (build?.editorialReview as { status: string }).status,
    "approved",
  );
  assert.equal(build?.isIndexable, true);
  assert.ok(change);
  assert.equal(
    (change?.editorialReview as { status: string }).status,
    "approved",
  );
  assert.equal(change?.provenanceStatus, "editoriallyVerified");
  assert.equal((event?.build as { _ref: string })._ref, build?._id);
  assert.equal(
    (event?.editorialReview as { status: string }).status,
    "approved",
  );
  assert.equal(event?.isIndexable, true);
  assert.doesNotMatch(
    JSON.stringify(result.plan),
    /tutorials\/data\/documentation/,
    "DocC transport URLs must not enter public Sanity documents or mutations",
  );

  const applied = applyLaunchPlanToSnapshotForTest(snapshot(), result.plan);
  const residual = buildLaunchContentPlan(applied, bundle);
  assert.equal(residual.plan.creates.length, 0);
  assert.equal(residual.plan.patches.length, 0);
});

test("an event overlay can target a durable version-scoped public route", () => {
  const migrated = buildLaunchContentPlan(snapshot(), emptyBundle());
  const migratedSnapshot = applyLaunchPlanToSnapshotForTest(
    snapshot(),
    migrated.plan,
  );
  const bundle: LaunchContentBundle = {
    ...emptyBundle(),
    sources: [
      {
        url: documentationUrl,
        title: "iOS & iPadOS 27 Release Notes",
        publisher: "Apple Developer",
        sourceClass: "firstPartyDocumentation",
      },
    ],
    events: [
      {
        target: {
          releaseVersionId: releaseId,
          routeAlias: "beta-1",
        },
        authorship: "originalSynthesis",
        summary:
          "The route-scoped event received a reviewed editorial overlay.",
        citations: [{ url: documentationUrl }],
        provenanceStatus: "sourceLinked",
        editorialReview: {
          status: "readyForReview",
        },
      },
    ],
  };

  const result = buildLaunchContentPlan(migratedSnapshot, bundle);
  const eventPatch = result.plan.patches.find((patch) => {
    const document = migratedSnapshot.find(
      (candidate) => candidate._id === patch.id,
    );
    return (
      document?._type === "releaseEvent" &&
      (
        document.routeAlias as {
          current?: string;
        }
      )?.current === "beta-1"
    );
  });

  assert.ok(eventPatch);
  assert.equal(
    eventPatch.set.summary,
    "The route-scoped event received a reviewed editorial overlay.",
  );
});

test("a missing released version and its durable public event are created idempotently", () => {
  const documents = parentOnlySnapshot();
  const bundle = missingReleaseBundle();
  const result = buildLaunchContentPlan(documents, bundle);

  assert.equal(result.plan.summary.versionCreates, 1);
  assert.equal(result.plan.summary.eventCreates, 1);
  assert.equal(result.plan.summary.versionPatches, 0);

  const version = result.plan.creates.find(
    ({ document }) => document._id === missingReleaseId,
  )?.document;
  assert.deepEqual(version, {
    _id: missingReleaseId,
    _type: "releaseVersion",
    releaseTrain: {
      _type: "reference",
      _ref: trainId,
    },
    version: "27.1",
    releaseStatus: "released",
    publicReleaseDate: "2026-10-01",
    releaseNotesUrl: documentationUrl,
    milestones: [],
    provenanceStatus: "legacyImported",
    editorialReview: {
      _type: "editorialReview",
      status: "draft",
    },
  });

  const event = result.plan.creates.find(
    ({ document }) =>
      document._type === "releaseEvent" &&
      document.stableEventId === "event:apple:ios:27.1:public",
  )?.document;
  assert.equal(
    (event?.releaseVersion as { _ref: string })._ref,
    missingReleaseId,
  );
  assert.equal((event?.platform as { _ref: string })._ref, platformId);
  assert.equal((event?.routeAlias as { current: string }).current, "public");
  assert.equal(event?.appearanceDate, "2026-10-01");
  assert.equal(event?.closesReleaseCycle, true);
  assert.doesNotThrow(() =>
    assertValidLaunchContentPlan(result.plan, result.rollback),
  );

  const applied = applyLaunchPlanToSnapshotForTest(documents, result.plan);
  const residual = buildLaunchContentPlan(applied, bundle);
  assert.equal(residual.plan.summary.versionCreates, 0);
  assert.equal(residual.plan.creates.length, 0);
  assert.equal(residual.plan.patches.length, 0);
});

test("missing-version identities reject absent, cross-platform, and wrong-major parents", () => {
  const missingTrain = missingReleaseBundle();
  missingTrain.versions![0].identity!.releaseTrainId = "train-ios-27-missing";
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), missingTrain),
    /train-ios-27-missing must exist as releaseTrain/,
  );

  const missingPlatform = missingReleaseBundle();
  missingPlatform.versions![0].identity!.platformId = "platform-ios-missing";
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), missingPlatform),
    /platform-ios-missing must exist as platform/,
  );

  const crossPlatformDocuments = parentOnlySnapshot();
  crossPlatformDocuments.push({
    _id: "platform-macos",
    _rev: "platform-macos-rev-1",
    _type: "platform",
    name: "macOS",
    slug: { _type: "slug", current: "macos" },
    color: "#8E8E93",
    sortOrder: 2,
  });
  const crossPlatform = missingReleaseBundle();
  crossPlatform.versions![0].identity!.platformId = "platform-macos";
  assert.throws(
    () => buildLaunchContentPlan(crossPlatformDocuments, crossPlatform),
    /train-ios-27 belongs to platform-ios, not platform-macos/,
  );

  const wrongMajor = missingReleaseBundle();
  wrongMajor.versions![0].releaseVersionId = "version-ios-28-1";
  wrongMajor.versions![0].identity!.version = "28.1";
  wrongMajor.events = [];
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), wrongMajor),
    /train-ios-27 is major version 27, not 28 for 28.1/,
  );
});

test("missing-version identities reject platform-version collisions", () => {
  const documents = parentOnlySnapshot();
  documents.push({
    _id: "legacy-ios-27-1",
    _rev: "legacy-release-rev-1",
    _type: "releaseVersion",
    releaseTrain: {
      _type: "reference",
      _ref: trainId,
    },
    version: "27.1",
    releaseStatus: "released",
    publicReleaseDate: "2026-10-01",
    milestones: [],
  });

  assert.throws(
    () => buildLaunchContentPlan(documents, missingReleaseBundle()),
    /platform-ios version 27\.1 already exists as legacy-ios-27-1/,
  );
});

test("version IDs and existing identities must match exactly", () => {
  const wrongId = missingReleaseBundle();
  wrongId.versions![0].releaseVersionId = "version-ios-27-2";
  wrongId.events = [];
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), wrongId),
    /version-ios-27-2 does not match deterministic releaseVersion ID version-ios-27-1/,
  );

  const initial = buildLaunchContentPlan(
    parentOnlySnapshot(),
    missingReleaseBundle(),
  );
  const applied = applyLaunchPlanToSnapshotForTest(
    parentOnlySnapshot(),
    initial.plan,
  );
  const mismatchedIdentity = missingReleaseBundle();
  mismatchedIdentity.versions![0].identity!.publicReleaseDate = "2026-10-02";
  mismatchedIdentity.events = [];
  assert.throws(
    () => buildLaunchContentPlan(applied, mismatchedIdentity),
    /version-ios-27-1\.publicReleaseDate does not match the manifest identity/,
  );
});

test("missing-version identity version, status, and date formats are validated", () => {
  const invalidVersion = missingReleaseBundle();
  invalidVersion.versions![0].identity!.version = "27";
  invalidVersion.events = [];
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), invalidVersion),
    /version must be a dotted release version/,
  );

  const invalidDate = missingReleaseBundle();
  invalidDate.versions![0].identity!.publicReleaseDate = "2026-02-30";
  invalidDate.events = [];
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), invalidDate),
    /publicReleaseDate is not a valid ISO date/,
  );

  const invalidStatus = missingReleaseBundle() as unknown as {
    versions: Array<{
      identity: {
        releaseStatus: string;
      };
    }>;
  };
  invalidStatus.versions[0].identity.releaseStatus = "active";
  assert.throws(
    () =>
      buildLaunchContentPlan(
        parentOnlySnapshot(),
        invalidStatus as unknown as LaunchContentBundle,
      ),
    /releaseStatus must be released/,
  );
});

test("same-bundle events for new versions require the matching durable public identity", () => {
  const notClosing = missingReleaseBundle();
  notClosing.events![0].identity!.closesReleaseCycle = false;
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), notClosing),
    /must use the durable public route, public channel, matching publicReleaseDate, and closesReleaseCycle=true/,
  );

  const mismatchedTarget = missingReleaseBundle();
  mismatchedTarget.events![0].target.releaseVersionId = "version-ios-27-2";
  assert.throws(
    () => buildLaunchContentPlan(parentOnlySnapshot(), mismatchedTarget),
    /target releaseVersionId must match identity.releaseVersionId/,
  );
});

test("unsafe targets, copied prose fields, transport citations, and uncited approval are rejected", () => {
  assert.throws(
    () =>
      assertLaunchTarget({
        projectId: "wrong",
        dataset: "production",
      }),
    /restricted to lh3yswzu\/production/,
  );

  const transportBundle: LaunchContentBundle = {
    ...emptyBundle(),
    sources: [
      {
        url: documentationTransportUrl,
        title: "Transport",
        publisher: "Apple",
        sourceClass: "firstPartyDocumentation",
      },
    ],
  };
  assert.throws(
    () => buildLaunchContentPlan(snapshot(), transportBundle),
    /human-readable documentation page/,
  );

  const copiedBundle = {
    ...emptyBundle(),
    versions: [
      {
        releaseVersionId: releaseId,
        authorship: "originalSynthesis",
        publisherText: "Copied upstream prose",
      },
    ],
  } as unknown as LaunchContentBundle;
  assert.throws(
    () => buildLaunchContentPlan(snapshot(), copiedBundle),
    /forbidden.*original synthesis/i,
  );

  const uncitedApproval: LaunchContentBundle = {
    ...emptyBundle(),
    versions: [
      {
        releaseVersionId: releaseId,
        authorship: "originalSynthesis",
        editorialReview: {
          status: "approved",
          reviewedAt: "2026-07-29T15:00:00.000Z",
        },
      },
    ],
  };
  assert.throws(
    () => buildLaunchContentPlan(snapshot(), uncitedApproval),
    /cannot be approved without citations/,
  );
});

test("new events cannot attach a release version to the wrong platform", () => {
  const documents = snapshot();
  documents.push({
    _id: "platform-macos",
    _rev: "platform-macos-rev-1",
    _type: "platform",
    name: "macOS",
    slug: { _type: "slug", current: "macos" },
    color: "#8E8E93",
    sortOrder: 2,
  });
  const mismatchedBundle: LaunchContentBundle = {
    ...emptyBundle(),
    events: [
      {
        target: {
          stableEventId: "event:apple:macos:27.0:beta-3",
        },
        identity: {
          releaseVersionId: releaseId,
          platformId: "platform-macos",
          stableEventId: "event:apple:macos:27.0:beta-3",
          label: "Beta 3",
          routeAlias: "beta-3",
          channel: "developerBeta",
          appearanceDate: "2026-07-06",
        },
        authorship: "originalSynthesis",
      },
    ],
  };

  assert.throws(
    () => buildLaunchContentPlan(documents, mismatchedBundle),
    /belongs to platform-ios, not platform-macos/,
  );
});

test("the audited 410-version snapshot keeps its existing migration behavior", () => {
  interface SeedData {
    platforms: Array<{
      name: string;
      slug: string;
      color: string;
      sortOrder: number;
    }>;
    releaseTrains: Array<{
      platform: string;
      majorVersion: number;
      displayName: string;
      releaseYear: number;
    }>;
    releaseVersions: Array<{
      platform: string;
      majorVersion: number;
      version: string;
      releaseStatus?: string;
      publicReleaseDate?: string;
      milestones: unknown[];
    }>;
  }

  const seed = JSON.parse(
    readFileSync(path.join(process.cwd(), "scripts", "seed-data.json"), "utf8"),
  ) as SeedData;
  const platformSlugByName = new Map(
    seed.platforms.map((platform) => [platform.name, platform.slug]),
  );
  const documents: SanityDocument[] = [
    ...seed.platforms.map((platform, index) => ({
      _id: `platform-${platform.slug}`,
      _rev: `platform-seed-rev-${index}`,
      _type: "platform",
      name: platform.name,
      slug: { _type: "slug", current: platform.slug },
      color: platform.color,
      sortOrder: platform.sortOrder,
    })),
    ...seed.releaseTrains.map((train, index) => {
      const slug = platformSlugByName.get(train.platform)!;
      return {
        _id: `train-${slug}-${train.majorVersion}`,
        _rev: `train-seed-rev-${index}`,
        _type: "releaseTrain",
        platform: {
          _type: "reference",
          _ref: `platform-${slug}`,
        },
        majorVersion: train.majorVersion,
        displayName: train.displayName,
        releaseYear: train.releaseYear,
      };
    }),
    ...seed.releaseVersions.map((version, index) => {
      const slug = platformSlugByName.get(version.platform)!;
      return {
        _id: `version-${slug}-${version.version
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}`,
        _rev: `release-seed-rev-${index}`,
        _type: "releaseVersion",
        releaseTrain: {
          _type: "reference",
          _ref: `train-${slug}-${version.majorVersion}`,
        },
        version: version.version,
        ...(version.releaseStatus
          ? { releaseStatus: version.releaseStatus }
          : {}),
        ...(version.publicReleaseDate
          ? { publicReleaseDate: version.publicReleaseDate }
          : {}),
        milestones: version.milestones,
      };
    }),
  ];

  assert.equal(
    documents.filter((document) => document._type === "releaseVersion").length,
    410,
  );
  const result = buildLaunchContentPlan(documents, emptyBundle());
  assert.equal(result.migrationPlan.summary.releaseVersions, 410);
  assert.equal(result.migrationPlan.summary.releaseEvents, 1_991);
  assert.equal(result.plan.summary.versionCreates, 0);
  assert.equal(
    result.plan.creates.filter(
      ({ document }) => document._type === "releaseVersion",
    ).length,
    0,
  );
});

test("rollback snapshots cover exact revision-guarded patches and IDs are stable", () => {
  const bundle: LaunchContentBundle = {
    ...emptyBundle(),
    sources: [
      {
        url: documentationUrl,
        title: "iOS & iPadOS 27 Release Notes",
        publisher: "Apple Developer",
        sourceClass: "firstPartyDocumentation",
      },
    ],
    versions: [
      {
        releaseVersionId: releaseId,
        authorship: "originalSynthesis",
        releaseNotesUrl: documentationUrl,
        citations: [{ url: documentationUrl }],
      },
    ],
  };
  const result = buildLaunchContentPlan(snapshot(), bundle);
  const versionPatch = result.plan.patches.find(
    (patch) => patch.id === releaseId,
  )!;
  const restoredVersion = result.rollback.restoreDocuments.find(
    (document) => document._id === releaseId,
  )!;

  assert.equal(versionPatch.ifRevisionId, "release-rev-1");
  assert.equal(restoredVersion._rev, "release-rev-1");
  assert.deepEqual(
    restoredVersion.milestones,
    snapshot().find((document) => document._id === releaseId)?.milestones,
  );

  const ids = deterministicLaunchIdsForTest({
    sourceUrl: documentationUrl,
    stableEventId: "event:apple:ios:27.0:beta-1",
    releaseVersionId: releaseId,
    buildNumber: "24a123",
    changeKey: "example-system-capability",
  });
  assert.deepEqual(
    ids,
    deterministicLaunchIdsForTest({
      sourceUrl: documentationUrl,
      stableEventId: "event:apple:ios:27.0:beta-1",
      releaseVersionId: releaseId,
      buildNumber: "24A123",
      changeKey: "example-system-capability",
    }),
  );
});
