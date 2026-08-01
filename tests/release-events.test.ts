import assert from "node:assert/strict";
import test from "node:test";
import {
  legacyEventsForVersion,
  milestoneChannel,
  milestonesForVersion,
  releaseEventForLegacySource,
  releaseEventsForVersion,
  versionWithReleaseEvents,
} from "../src/lib/release-events";
import {
  releaseBuildDetailQuery,
  releaseEventDetailQuery,
  releaseEventsForVersionsQuery,
  versionEventsQuery,
} from "../src/lib/queries";
import type {
  BetaMilestone,
  ReleaseEvent,
  ReleaseVersion,
} from "../src/lib/types";

function releaseVersion(
  milestones: BetaMilestone[] = [],
): ReleaseVersion {
  return {
    _id: "release.ios.27.0",
    version: "27.0",
    releaseStatus: "active",
    milestones,
    releaseTrain: {
      _id: "train.ios.27",
      majorVersion: 27,
      displayName: "iOS 27",
      releaseYear: 2026,
      platform: {
        _id: "platform.ios",
        name: "iOS",
        slug: { current: "ios" },
        color: "#007AFF",
        sortOrder: 1,
      },
    },
  };
}

function milestone(
  key: string,
  label: string,
  date: string,
): BetaMilestone {
  return {
    _key: key,
    label,
    date,
    isRevision: false,
  };
}

function event(
  overrides: Partial<ReleaseEvent> = {},
): ReleaseEvent {
  return {
    _id: "event.ios.27.0.beta-2",
    slug: { current: "beta-2" },
    label: "Beta 2",
    normalizedChannel: "developer",
    date: "2026-07-06",
    availabilityState: "available",
    isRevision: false,
    ...overrides,
  };
}

test("legacy-only versions retain their exact milestone array", () => {
  const milestones = [
    milestone("beta-1", "Beta 1", "2026-06-22"),
    milestone("beta-2", "Beta 2", "2026-07-06"),
  ];
  const version = releaseVersion(milestones);

  assert.equal(milestonesForVersion(version), milestones);
  assert.equal(versionWithReleaseEvents(version), version);
});

test("a partial migration replaces only its identified legacy milestone", () => {
  const legacySecond = {
    ...milestone("beta-2", "Beta 2", "2026-07-06"),
    note: "Audited legacy context",
    sourceUrl: "https://support.apple.com/example",
    sourceLabel: "Apple release notes",
  };
  const version = releaseVersion([
    milestone("beta-1", "Beta 1", "2026-06-22"),
    legacySecond,
    milestone("beta-3", "Beta 3", "2026-07-20"),
  ]);
  const migrated = event({
    legacySourceId: `${version._id}:beta-2`,
    label: "Developer Beta 2",
  });

  const milestones = milestonesForVersion(version, [migrated]);
  assert.deepEqual(
    milestones.map(({ _key, label }) => ({ _key, label })),
    [
      { _key: "beta-1", label: "Beta 1" },
      { _key: "beta-2", label: "Developer Beta 2" },
      { _key: "beta-3", label: "Beta 3" },
    ],
  );

  const publicEvents = releaseEventsForVersion(version, [migrated]);
  assert.deepEqual(
    publicEvents.map(({ label }) => label),
    ["Beta 1", "Developer Beta 2", "Beta 3"],
  );
  assert.equal(
    publicEvents.find(({ label }) => label === "Beta 1")?.slug?.current,
    "beta-1",
  );
  const replacement = publicEvents.find(
    ({ _id }) => _id === migrated._id,
  );
  assert.equal(replacement?.note, legacySecond.note);
  assert.equal(
    replacement?.citations?.[0]?.source.canonicalUrl,
    legacySecond.sourceUrl,
  );
});

test("event-only versions feed the milestone compatibility read model", () => {
  const version = releaseVersion();
  const first = event({
    _id: "event.ios.27.0.beta-1",
    slug: { current: "beta-1" },
    label: "Beta 1",
    date: "2026-06-22",
  });
  const second = event();

  const normalized = versionWithReleaseEvents(version, [first, second]);
  assert.deepEqual(
    normalized.milestones.map(({ label, date }) => ({ label, date })),
    [
      { label: "Beta 1", date: "2026-06-22" },
      { label: "Beta 2", date: "2026-07-06" },
    ],
  );

  assert.deepEqual(
    releaseEventsForVersion(normalized, [first, second]).map(
      ({ _id }) => _id,
    ),
    [first._id, second._id],
  );
});

test("normalized versions retain legacy aliases for migration redirects", () => {
  const version = releaseVersion([
    milestone("legacy-revision", "Beta 2 v2", "2026-07-07"),
  ]);
  const migrated = event({
    _id: "event.ios.27.0.beta-2-revised",
    slug: { current: "beta-2-revised" },
    label: "Developer Beta 2 revised",
    date: "2026-07-07",
    legacySourceId: `${version._id}:legacy-revision`,
  });
  const normalized = versionWithReleaseEvents(version, [migrated]);
  const legacyAlias = legacyEventsForVersion(normalized)[0];

  assert.equal(legacyAlias.slug?.current, "beta-2-v2");
  assert.equal(
    releaseEventForLegacySource(
      normalized,
      legacyAlias.legacySourceId ?? "",
      [migrated],
    )?._id,
    migrated._id,
  );
});

test("security and recovery channels remain first-class", () => {
  assert.equal(
    milestoneChannel("Rapid Security Response"),
    "securityResponse",
  );
  assert.equal(milestoneChannel("Recovery re-release"), "recovery");

  for (const query of [
    versionEventsQuery,
    releaseEventDetailQuery,
    releaseEventsForVersionsQuery,
    releaseBuildDetailQuery,
  ]) {
    assert.match(query, /securityResponse/);
    assert.match(query, /recovery/);
  }
});
