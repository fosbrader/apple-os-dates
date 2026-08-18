import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  assertValidReleaseEventMigration,
  buildReleaseEventMigrationPlan,
  extractLegacyReleaseVersions,
  projectEventsToLegacyMilestones,
  projectSchemaReadyMigration,
  stableStringify,
  validateLegacyProjection,
  validateReleaseEventMigrationPlan,
  validateSchemaReadyMigration,
  type LegacyReleaseVersion,
} from "../scripts/lib/release-event-migration";

function liveVersion(
  overrides: Partial<LegacyReleaseVersion> = {},
): LegacyReleaseVersion {
  return {
    _id: "version-ios-27-0",
    _rev: "rev-1",
    _type: "releaseVersion",
    platformId: "platform-ios",
    platform: "iOS",
    version: "27.0",
    releaseStatus: "active",
    milestones: [
      {
        _key: "beta-1",
        _type: "betaMilestone",
        label: "Beta 1",
        date: "2026-06-08",
        isRevision: false,
      },
    ],
    ...overrides,
  };
}

test("the audited seed produces a deterministic, lossless candidate plan", () => {
  const input = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "scripts", "seed-data.json"),
      "utf8",
    ),
  ) as unknown;
  const versions = extractLegacyReleaseVersions(input);
  const first = buildReleaseEventMigrationPlan(versions);
  const second = buildReleaseEventMigrationPlan(versions);

  assert.equal(versions.length, 410);
  assert.equal(first.summary.releaseVersions, 410);
  assert.equal(first.summary.releaseEvents, 1_991);
  assert.equal(
    first.versionStates.filter(
      (state) => state.normalizedReleaseStatus === "superseded",
    ).length,
    2,
  );
  assert.equal(
    first.summary.syntheticEventIdentities,
    first.summary.releaseEvents,
    "seed milestones have no live Sanity keys, so their identities are explicitly synthetic",
  );
  assert.equal(
    first.builds.length,
    0,
    "build numbers embedded in legacy notes are review candidates, not automatic merges",
  );
  assert.ok(first.summary.reviewCandidates > 0);
  assert.ok(
    first.events
      .flatMap((event) => event.metadataReview)
      .every((candidate) => candidate.reviewRequired),
  );
  assert.deepEqual(first, second);
  assert.equal(stableStringify(first), stableStringify(second));
  assert.deepEqual(validateReleaseEventMigrationPlan(first), []);
  assert.deepEqual(validateLegacyProjection(versions, first), []);
  assert.doesNotThrow(() =>
    assertValidReleaseEventMigration(versions, first),
  );
});

test("the audited seed projects to required schema-ready event fields", () => {
  const input = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "scripts", "seed-data.json"),
      "utf8",
    ),
  ) as unknown;
  const versions = extractLegacyReleaseVersions(input);
  const plan = buildReleaseEventMigrationPlan(versions);
  const projection = projectSchemaReadyMigration(plan);

  assert.equal(projection.releaseEvents.length, 1_991);
  assert.equal(projection.releaseBuilds.length, 0);
  assert.equal(projection.withheldBuildCandidates.length, 0);
  assert.ok(
    projection.releaseEvents.every(
      (event) =>
        event.releaseVersion._type === "reference" &&
        event.platform._type === "reference" &&
        event.stableEventId === event.legacySourceId &&
        event.routeAlias._type === "slug" &&
        event.routeAlias.current.length > 0 &&
        event.appearanceDate.length === 10 &&
        event.editorialReview.status === "draft" &&
        event.provenanceStatus === "legacyImported" &&
        event.isIndexable === false,
    ),
  );
  assert.deepEqual(
    validateSchemaReadyMigration(plan, projection),
    [],
  );
  assert.deepEqual(
    projectSchemaReadyMigration(plan),
    projection,
    "schema projection must be deterministic",
  );
});

test("live version and milestone IDs form stable event identities", () => {
  const source = liveVersion();
  const plan = buildReleaseEventMigrationPlan([source]);
  const changedContent = liveVersion({
    milestones: [
      {
        ...source.milestones[0],
        note: "Editorial detail added after the initial import",
      },
    ],
  });
  const changedPlan = buildReleaseEventMigrationPlan([changedContent]);

  assert.equal(plan.events[0].identitySource, "liveMilestoneKey");
  assert.equal(plan.events[0].legacyMilestoneKey, "beta-1");
  assert.equal(
    plan.events[0].legacySourceId,
    "version-ios-27-0:beta-1",
  );
  assert.equal(
    plan.events[0]._id,
    changedPlan.events[0]._id,
    "event identity must not change when a keyed milestone is edited",
  );
  assert.notEqual(plan.sourceDigest, changedPlan.sourceDigest);
});

test("a local Sanity document snapshot resolves platform references without network access", () => {
  const versions = extractLegacyReleaseVersions({
    documents: [
      {
        _id: "platform-ios",
        _type: "platform",
        name: "iOS",
      },
      {
        _id: "train-ios-27",
        _type: "releaseTrain",
        platform: {
          _type: "reference",
          _ref: "platform-ios",
        },
      },
      {
        _id: "version-ios-27-0",
        _rev: "snapshot-rev",
        _type: "releaseVersion",
        releaseTrain: {
          _type: "reference",
          _ref: "train-ios-27",
        },
        version: "27.0",
        releaseStatus: "active",
        milestones: [
          {
            _key: "live-beta-1",
            _type: "betaMilestone",
            label: "Beta 1",
            date: "2026-06-08",
            isRevision: false,
          },
        ],
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan(versions);

  assert.equal(versions.length, 1);
  assert.equal(versions[0].platform, "iOS");
  assert.equal(versions[0].platformId, "platform-ios");
  assert.equal(versions[0]._rev, "snapshot-rev");
  assert.equal(plan.events[0].identitySource, "liveMilestoneKey");
  assert.equal(plan.events[0].legacyMilestoneKey, "live-beta-1");
});

test("a Sanity snapshot containing drafts is rejected before planning", () => {
  assert.throws(
    () =>
      extractLegacyReleaseVersions({
        documents: [
          {
            _id: "drafts.version-ios-27-0",
            _type: "releaseVersion",
            platform: "iOS",
            version: "27.0",
            milestones: [
              {
                _key: "beta-1",
                label: "Beta 1",
                date: "2026-06-08",
                isRevision: false,
              },
            ],
          },
        ],
      }),
    /Export published releaseVersion documents only/,
  );
});

test("schema-ready aliases match the public legacy collision rule", () => {
  const source = liveVersion({
    milestones: [
      {
        _key: "beta-1",
        label: "Beta 1",
        date: "2026-06-08",
        isRevision: false,
      },
      {
        _key: "beta-1-revision",
        label: "Beta 1",
        date: "2026-06-10",
        isRevision: true,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);
  const projection = projectSchemaReadyMigration(plan);

  assert.deepEqual(
    projection.releaseEvents.map(
      (event) => event.routeAlias.current,
    ),
    ["beta-1-2026-06-08", "beta-1-2026-06-10"],
  );
});

test("identical explicit build fields group multiple channel appearances", () => {
  const source = liveVersion({
    milestones: [
      {
        _key: "developer-beta-3-v2",
        _type: "betaMilestone",
        label: "Beta 3 v2",
        date: "2026-07-13",
        build: "24A5380l",
        channel: "Developer Beta",
        isRevision: true,
      },
      {
        _key: "public-beta-1",
        _type: "betaMilestone",
        label: "Public Beta 1",
        date: "2026-07-13",
        build: "24A5380l",
        channel: "Public Beta",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);

  assert.equal(plan.builds.length, 1);
  assert.equal(plan.builds[0].normalizedBuildNumber, "24A5380L");
  assert.equal(plan.builds[0].eventRefs.length, 2);
  assert.equal(
    new Set(plan.events.map((event) => event.proposedBuildRef)).size,
    1,
  );
  assert.deepEqual(
    plan.events.map((event) => event.channel),
    ["developerBeta", "publicBeta"],
  );
  assert.equal(plan.builds[0].reviewRequired, true);
  assert.doesNotThrow(() =>
    assertValidReleaseEventMigration([source], plan),
  );
});

test("schema-ready builds require approved citation refs and preserve display casing", () => {
  const source = liveVersion({
    milestones: [
      {
        _key: "developer-beta-3-v2",
        label: "Beta 3 v2",
        date: "2026-07-13",
        build: "24A5380l",
        channel: "Developer Beta",
        deviceScope: "iPhone 17 family",
        isRevision: true,
      },
      {
        _key: "public-beta-1",
        label: "Public Beta 1",
        date: "2026-07-13",
        build: "24A5380l",
        channel: "Public Beta",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);
  const candidateId = plan.builds[0]._id;
  const withheld = projectSchemaReadyMigration(plan);

  assert.equal(withheld.releaseBuilds.length, 0);
  assert.deepEqual(withheld.withheldBuildCandidates, [
    {
      candidateId,
      reason: "missing-approved-citation-source-refs",
    },
  ]);
  assert.ok(
    withheld.releaseEvents.every((event) => !event.build),
  );
  assert.deepEqual(
    validateSchemaReadyMigration(plan, withheld),
    [],
  );

  const emitted = projectSchemaReadyMigration(plan, {
    approvedBuildCitationSourceIds: {
      [candidateId]: ["source-apple-developer-release"],
    },
  });
  const build = emitted.releaseBuilds[0];

  assert.equal(build.releaseVersion._ref, source._id);
  assert.equal(build.platform._ref, source.platformId);
  assert.equal(build.buildNumber, "24A5380l");
  assert.equal(build.slug.current, "24a5380l");
  assert.equal(build.citations.length, 1);
  assert.equal(
    build.citations[0].source._ref,
    "source-apple-developer-release",
  );
  assert.equal(build.provenanceStatus, "sourceLinked");
  assert.equal(build.editorialReview.status, "draft");
  assert.equal(build.isIndexable, false);
  assert.equal(
    build.applicability?.notes,
    "iPhone 17 family",
  );
  assert.ok(
    emitted.releaseEvents.every(
      (event) => event.build?._ref === candidateId,
    ),
  );
  assert.deepEqual(
    validateSchemaReadyMigration(plan, emitted),
    [],
  );
});

test("schema projection uses every finalized channel value and guards cycle closure", () => {
  const publicRelease = liveVersion({
    _id: "version-ios-27-1",
    version: "27.1",
    releaseStatus: "released",
    publicReleaseDate: "2026-09-15",
    milestones: [
      {
        _key: "public",
        label: "Public",
        date: "2026-09-15",
        isRevision: false,
      },
    ],
  });
  const gmRelease = liveVersion({
    _id: "version-ios-27-2",
    version: "27.2",
    releaseStatus: "released",
    publicReleaseDate: "2026-10-01",
    milestones: [
      {
        _key: "gm",
        label: "GM",
        date: "2026-10-01",
        isRevision: false,
      },
    ],
  });
  const specialChannels = liveVersion({
    _id: "version-ios-27-3",
    version: "27.3",
    milestones: [
      {
        _key: "security",
        label: "Rapid Security Response",
        date: "2026-11-01",
        isRevision: false,
      },
      {
        _key: "recovery",
        label: "Recovery Re-release",
        date: "2026-11-02",
        isRevision: true,
      },
      {
        _key: "other",
        label: "Carrier Preview",
        date: "2026-11-03",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([
    publicRelease,
    gmRelease,
    specialChannels,
  ]);
  const projection = projectSchemaReadyMigration(plan);
  const byLabel = new Map(
    projection.releaseEvents.map((event) => [event.label, event]),
  );

  assert.equal(byLabel.get("Public")?.channel, "public");
  assert.equal(
    byLabel.get("Public")?.closesReleaseCycle,
    true,
  );
  assert.equal(byLabel.get("GM")?.channel, "goldenMaster");
  assert.equal(byLabel.get("GM")?.closesReleaseCycle, true);
  assert.equal(
    byLabel.get("Rapid Security Response")?.channel,
    "securityResponse",
  );
  assert.equal(
    byLabel.get("Recovery Re-release")?.channel,
    "recovery",
  );
  assert.equal(byLabel.get("Carrier Preview")?.channel, "other");
  assert.equal(
    byLabel.get("Rapid Security Response")?.closesReleaseCycle,
    false,
  );
  assert.deepEqual(
    validateSchemaReadyMigration(plan, projection),
    [],
  );
});

test("matching build numbers found only in notes never merge automatically", () => {
  const source = liveVersion({
    milestones: [
      {
        _key: "developer",
        label: "Beta 1",
        date: "2026-06-08",
        note: "Build 24A123a; also released as Public Beta 1",
        isRevision: false,
      },
      {
        _key: "public",
        label: "Public Beta 1",
        date: "2026-06-08",
        note: "Build 24A123a",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);

  assert.equal(plan.builds.length, 0);
  assert.ok(
    plan.events.every((event) => !event.proposedBuildRef),
  );
  assert.deepEqual(
    plan.events.map((event) =>
      event.metadataReview
        .filter((candidate) => candidate.kind === "buildNumber")
        .map((candidate) => candidate.value),
    ),
    [["24A123a"], ["24A123a"]],
  );
  assert.ok(
    plan.events[0].metadataReview.some(
      (candidate) => candidate.kind === "channelAppearance",
    ),
  );
});

test("an identical build number across version records is flagged instead of merged", () => {
  const first = liveVersion({
    milestones: [
      {
        _key: "beta",
        label: "Beta 1",
        date: "2026-06-08",
        build: "24A100a",
        isRevision: false,
      },
    ],
  });
  const second = liveVersion({
    _id: "version-ios-27-1",
    version: "27.1",
    milestones: [
      {
        _key: "beta",
        label: "Beta 1",
        date: "2026-08-01",
        build: "24A100a",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([first, second]);

  assert.equal(plan.builds.length, 2);
  assert.ok(
    validateReleaseEventMigrationPlan(plan).some(
      (issue) =>
        issue.code === "cross-version-build-identity-conflict",
    ),
  );
});

test("pulled, corrective, device-limited, and renamed-cycle notes remain review-only", () => {
  const source = liveVersion({
    _id: "version-ipados-13-6",
    platformId: "platform-ipados",
    platform: "iPadOS",
    version: "13.6",
    milestones: [
      {
        _key: "legacy-beta-1",
        _type: "betaMilestone",
        label: "13.5.5 Beta 1",
        date: "2020-06-01",
        note: "Build 17G5035d; cycle renamed to 13.6 at Beta 2; iPad mini 6 only; pulled; corrective build",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);
  const event = plan.events[0];
  const kinds = new Set(
    event.metadataReview.map((candidate) => candidate.kind),
  );

  assert.equal(event.versionLabelAtAppearance, "13.5.5");
  assert.equal(event.availabilityState, "available");
  assert.equal(event.proposedBuildRef, undefined);
  assert.deepEqual(
    kinds,
    new Set([
      "availabilityState",
      "buildNumber",
      "deviceScope",
      "renamedCycle",
      "revisionOrCorrective",
    ]),
  );
  assert.ok(
    event.metadataReview.every(
      (candidate) =>
        candidate.evidenceField === "note" &&
        candidate.reviewRequired,
    ),
  );
  assert.deepEqual(validateLegacyProjection([source], plan), []);
});

test("revised and device-limited sibling builds remain distinct", () => {
  const source = liveVersion({
    releaseStatus: "released",
    publicReleaseDate: "2025-10-01",
    milestones: [
      {
        _key: "public-main",
        label: "Public",
        date: "2025-10-01",
        build: "23A100",
        isRevision: false,
      },
      {
        _key: "public-corrective",
        label: "Public Update",
        date: "2025-10-01",
        build: "23A101",
        deviceScope: "iPad mini 6 only",
        isRevision: true,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);

  assert.equal(plan.builds.length, 2);
  assert.notEqual(
    plan.events[0].proposedBuildRef,
    plan.events[1].proposedBuildRef,
  );
  assert.equal(
    plan.events[1].applicabilityLabel,
    "iPad mini 6 only",
  );
  assert.equal(plan.events[1].isRevision, true);
});

test("superseded lifecycle is preserved and Public Beta does not imply released", () => {
  const superseded = liveVersion({
    _id: "version-ipados-16-0",
    platformId: "platform-ipados",
    platform: "iPadOS",
    version: "16.0",
    releaseStatus: "superseded",
    milestones: [
      {
        _key: "public-beta",
        label: "Public Beta 1",
        date: "2022-07-11",
        isRevision: false,
      },
    ],
  });
  const legacyPublicBeta = liveVersion({
    _id: "version-ios-28-0",
    version: "28.0",
    releaseStatus: undefined,
    milestones: [
      {
        _key: "public-beta",
        label: "Public Beta 1",
        date: "2027-07-12",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([
    superseded,
    legacyPublicBeta,
  ]);

  assert.equal(
    plan.versionStates.find(
      (state) =>
        state.releaseVersionId === "version-ipados-16-0",
    )?.normalizedReleaseStatus,
    "superseded",
  );
  assert.equal(
    plan.versionStates.find(
      (state) => state.releaseVersionId === "version-ios-28-0",
    )?.normalizedReleaseStatus,
    "active",
  );
  assert.equal(
    plan.events.find(
      (event) =>
        event.releaseVersion._ref === "version-ios-28-0",
    )?.channel,
    "publicBeta",
  );
  assert.deepEqual(
    plan.releaseStatusNormalizations.map((candidate) => ({
      id: candidate.releaseVersionId,
      to: candidate.to,
    })),
    [{ id: "version-ios-28-0", to: "active" }],
  );
});

test("the compatibility projection preserves arbitrary CMS-only milestone fields", () => {
  const source = liveVersion({
    milestones: [
      {
        _key: "beta-1",
        _type: "betaMilestone",
        label: "Beta 1",
        date: "2026-06-08",
        isRevision: false,
        editorialFlag: "keep-me",
        nestedCmsField: { approved: true },
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);
  const projected = projectEventsToLegacyMilestones(plan);

  assert.deepEqual(projected[source._id], source.milestones);
});

test("conflicting structured and note build evidence fails validation", () => {
  const source = liveVersion({
    milestones: [
      {
        _key: "beta-1",
        label: "Beta 1",
        date: "2026-06-08",
        build: "24A100a",
        note: "Build 24A101a",
        isRevision: false,
      },
    ],
  });
  const plan = buildReleaseEventMigrationPlan([source]);

  assert.ok(
    validateReleaseEventMigrationPlan(plan).some(
      (issue) =>
        issue.code === "structured-build-note-conflict" &&
        issue.severity === "error",
    ),
  );
  assert.throws(
    () => assertValidReleaseEventMigration([source], plan),
    /structured-build-note-conflict/,
  );
});
