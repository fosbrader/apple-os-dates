import assert from "node:assert/strict";
import test from "node:test";
import {
  adaptReleaseObservations,
  compatibilityEvidenceId,
  firstClassEvidenceId,
  ReleaseObservationInputError,
} from "../src/lib/release-observation-adapter";
import { validateForecastAnalysisDataset } from "../src/lib/forecast-analysis-contracts";
import { releaseObservationFixture } from "./fixtures/release-observation-adapter";

test("explicit stable identities, never display labels, control evidence IDs", () => {
  const fixture = releaseObservationFixture();
  const result = adaptReleaseObservations(fixture);

  assert.equal(
    firstClassEvidenceId(fixture.events[0]),
    "event:event:ios:27:developer-beta-2-revision",
  );
  assert.equal(
    compatibilityEvidenceId("release.ios.27", "beta-2"),
    "legacy:release.ios.27:beta-2",
  );
  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId, stage, displayLabel }) => ({
      evidenceId,
      stage,
      displayLabel,
    })),
    [
      {
        evidenceId: "legacy:release.ios.27:public-beta-2",
        stage: "public-beta:2",
        displayLabel: "Public Beta 2",
      },
      {
        evidenceId: "event:event:ios:27:developer-beta-2-revision",
        stage: "developer-beta:2",
        displayLabel: "Developer seed (edited display copy)",
      },
    ],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "legacy:release.ios.27:beta-2",
    )?.code,
    "overlaid-by-first-class-event",
  );
  assert.deepEqual(validateForecastAnalysisDataset(result.dataset), []);
});

test("revisions and replacements collapse to one deterministic effective stage", () => {
  const fixture = releaseObservationFixture();
  fixture.events = [
    {
      id: "event.beta-2",
      stableEventId: "event:ios:27:beta-2",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T10:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      isRevision: false,
      legacySourceId: "beta-2",
    },
    {
      id: "event.beta-2-revision",
      stableEventId: "event:ios:27:beta-2-revision",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T11:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      sameDayOrder: 2,
      availability: "available",
      isRevision: true,
      revisionOfId: "event:ios:27:beta-2",
      legacySourceId: "beta-2",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents
      .filter(({ stage }) => stage === "developer-beta:2")
      .map(({ evidenceId, occurredOn }) => ({ evidenceId, occurredOn })),
    [
      {
        evidenceId: "event:event:ios:27:beta-2-revision",
        occurredOn: "2026-07-20",
      },
    ],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "event:event:ios:27:beta-2",
    )?.code,
    "replaced-by-event",
  );
});

test("both replacement-link directions retain the successor", () => {
  const fixture = releaseObservationFixture();
  fixture.compatibilityMilestones = [];
  fixture.events = [
    {
      id: "event.original",
      stableEventId: "event:ios:27:original",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T10:00:00.000Z",
      channel: "developerBeta",
      sequence: 4,
      availability: "available",
      replacedByEventId: "event:ios:27:replacement",
    },
    {
      id: "event.replacement",
      stableEventId: "event:ios:27:replacement",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T10:00:00.000Z",
      channel: "developerBeta",
      sequence: 4,
      availability: "available",
      replacesEventId: "event:ios:27:original",
    },
  ];

  assert.deepEqual(
    adaptReleaseObservations(fixture).effectiveEvents.map(({ evidenceId }) =>
      evidenceId,
    ),
    ["event:event:ios:27:replacement"],
  );
});

test("point-in-time cutoff requires occurrence and observation knowledge", () => {
  const fixture = releaseObservationFixture();
  fixture.asOfDate = "2026-07-20";
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.events = [
    {
      id: "event.visible-later",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 3,
      availability: "available",
    },
    {
      id: "event.future",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 4,
      availability: "available",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(result.effectiveEvents, []);
  assert.deepEqual(
    result.exclusions.map(({ evidenceId, code }) => ({ evidenceId, code })),
    [
      {
        evidenceId: "release:release.ios.27:outcome",
        code: "not-released-by-cutoff",
      },
      {
        evidenceId: "event:event.visible-later",
        code: "not-observed-by-cutoff",
      },
      {
        evidenceId: "legacy:release.ios.27:beta-2",
        code: "not-observed-by-cutoff",
      },
      {
        evidenceId: "legacy:release.ios.27:public-beta-2",
        code: "not-observed-by-cutoff",
      },
      {
        evidenceId: "event:event.future",
        code: "future-occurrence",
      },
    ],
  );
});

test("availability states exclude evidence and a verified GM closure creates an outcome", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [];
  fixture.events = [
    {
      id: "event.withdrawn",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "withdrawn",
    },
    {
      id: "event.replaced",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 3,
      availability: "replaced",
    },
    {
      id: "event.superseded",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 4,
      availability: "superseded",
    },
    {
      id: "event.gm",
      releaseId: "release.ios.27",
      occurredOn: "2026-09-10",
      firstObservedAt: "2026-09-10T00:00:00.000Z",
      channel: "goldenMaster",
      availability: "available",
      closesReleaseCycle: true,
    },
  ];
  fixture.asOfDate = "2026-09-10";
  fixture.issuedAt = "2026-09-10T12:00:00.000Z";
  const result = adaptReleaseObservations(fixture);

  assert.equal(
    result.exclusions.find(({ evidenceId }) => evidenceId === "event:event.withdrawn")
      ?.code,
    "withdrawn",
  );
  assert.deepEqual(
    result.exclusions
      .filter(({ evidenceId }) => evidenceId.startsWith("event:event."))
      .map(({ evidenceId, code }) => ({ evidenceId, code })),
    [
      { evidenceId: "event:event.replaced", code: "replaced" },
      { evidenceId: "event:event.superseded", code: "superseded" },
      { evidenceId: "event:event.withdrawn", code: "withdrawn" },
    ],
  );
  assert.deepEqual(result.releasedOutcomes, [
    {
      evidenceId: "release:release.ios.27:outcome",
      releaseId: "release.ios.27",
      occurredOn: "2026-09-10",
      firstObservedOn: "2026-09-10",
      closure: "golden-master",
    },
  ]);
});

test("tied dates retain no invented chronology and output is input-order invariant", () => {
  const fixture = releaseObservationFixture();
  fixture.compatibilityMilestones = [];
  fixture.events = [
    {
      id: "event.public-beta",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T10:00:00.000Z",
      channel: "publicBeta",
      sequence: 1,
      availability: "available",
      displayLabel: "Developer Beta 99",
    },
    {
      id: "event.developer-beta",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T10:00:00.000Z",
      channel: "developerBeta",
      sequence: 1,
      availability: "available",
      displayLabel: "Public beta copy",
    },
  ];
  const forward = adaptReleaseObservations(fixture);
  const reversed = adaptReleaseObservations({
    ...fixture,
    events: [...fixture.events].reverse(),
  });

  assert.deepEqual(reversed, forward);
  assert.deepEqual(
    forward.effectiveEvents.map(({ stage, sameDayOrder }) => ({ stage, sameDayOrder })),
    [
      { stage: "developer-beta:1", sameDayOrder: undefined },
      { stage: "public-beta:1", sameDayOrder: undefined },
    ],
  );
});

test("invalid release identities fail closed without returning an invalid dataset", () => {
  const fixture = releaseObservationFixture();
  fixture.compatibilityMilestones = [];
  fixture.releases = [
    { id: "release.ios.27", lifecycle: "active" },
    { id: "release.ios.27", lifecycle: "active" },
    { id: "", lifecycle: "active" },
    { id: "release.invalid", lifecycle: "retired" as "active" },
  ];
  fixture.events = [
    {
      id: "event.valid",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 1,
      availability: "available",
    },
    {
      id: "event.unknown-release",
      releaseId: "release.missing",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
    },
  ];
  const result = adaptReleaseObservations(fixture);
  const reversed = adaptReleaseObservations({
    ...fixture,
    releases: [...fixture.releases].reverse(),
  });

  assert.deepEqual(reversed, result);
  assert.deepEqual(result.dataset.releases, []);
  assert.deepEqual(validateForecastAnalysisDataset(result.dataset), []);
  assert.deepEqual(
    result.exclusions.map(({ evidenceId, code }) => ({ evidenceId, code })),
    [
      { evidenceId: "input:release:missing-id", code: "missing-release-id" },
      {
        evidenceId: "release:release.invalid:input",
        code: "invalid-release-lifecycle",
      },
      {
        evidenceId: "release:release.ios.27:input",
        code: "duplicate-release-id",
      },
      {
        evidenceId: "event:event.valid",
        code: "unknown-release-cycle",
      },
      { evidenceId: "event:event.unknown-release", code: "unknown-release-cycle" },
    ],
  );
});

test("only an effective eligible first-class event overlays legacy evidence", () => {
  const cases = [
    {
      name: "future",
      overrides: {
        occurredOn: "2026-08-10",
        firstObservedAt: "2026-08-10T00:00:00.000Z",
      },
      reason: "future-occurrence",
    },
    {
      name: "unobserved",
      overrides: { firstObservedAt: "2026-08-10T00:00:00.000Z" },
      reason: "not-observed-by-cutoff",
    },
    {
      name: "withdrawn",
      overrides: { availability: "withdrawn" as const },
      reason: "withdrawn",
    },
    {
      name: "malformed-observation",
      overrides: { firstObservedAt: "not-a-timestamp" },
      reason: "invalid-first-observed-at",
    },
    {
      name: "invalid-channel",
      overrides: { channel: "display-copy" as "developerBeta" },
      reason: "invalid-channel",
    },
    {
      name: "invalid-replacement",
      overrides: {
        isRevision: true,
        revisionOfId: "event:missing",
      },
      reason: "unknown-replacement-target",
    },
  ];

  for (const { name, overrides, reason } of cases) {
    const fixture = releaseObservationFixture();
    fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
    fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
    fixture.events = [
      {
        id: `event.${name}`,
        releaseId: "release.ios.27",
        occurredOn: "2026-07-20",
        firstObservedAt: "2026-07-20T00:00:00.000Z",
        channel: "developerBeta",
        sequence: 2,
        availability: "available",
        legacySourceId: "beta-2",
        ...overrides,
      },
    ];
    const result = adaptReleaseObservations(fixture);

    assert.deepEqual(
      result.effectiveEvents.map(({ evidenceId }) => evidenceId),
      ["legacy:release.ios.27:beta-2"],
      name,
    );
    assert.equal(
      result.exclusions.find(({ evidenceId }) => evidenceId === `event:event.${name}`)
        ?.code,
      reason,
      name,
    );
  }
});

test("a same-day ordering conflict prevents a first-class overlay", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [
    fixture.compatibilityMilestones[0],
    {
      ...fixture.compatibilityMilestones[1],
      sameDayOrder: 1,
    },
  ];
  fixture.events = [
    {
      id: "event.order-conflict",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      sameDayOrder: 1,
      availability: "available",
      legacySourceId: "beta-2",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["legacy:release.ios.27:beta-2"],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "legacy:release.ios.27:beta-2",
    ),
    undefined,
  );
});

test("issuedAt fallback applies only when firstObservedAt is absent", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.events = [];
  fixture.compatibilityMilestones = [
    {
      id: "beta-1",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-01",
      channel: "developerBeta",
      sequence: 1,
      availability: "available",
    },
    {
      id: "public-beta-1",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-02",
      firstObservedAt: "not-a-timestamp",
      channel: "publicBeta",
      sequence: 1,
      availability: "available",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId, firstObservedOn }) => ({
      evidenceId,
      firstObservedOn,
    })),
    [
      {
        evidenceId: "legacy:release.ios.27:beta-1",
        firstObservedOn: "2026-08-09",
      },
    ],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "legacy:release.ios.27:public-beta-1",
    )?.code,
    "invalid-first-observed-at",
  );
});

test("revision and replacement identity names exactly one unique predecessor", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
  fixture.events = [
    {
      id: "event.multiple-targets",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      isRevision: true,
      revisionOfId: "event:first",
      replacesEventId: "event:second",
      legacySourceId: "beta-2",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["legacy:release.ios.27:beta-2"],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "event:event.multiple-targets",
    )?.code,
    "multiple-replacement-targets",
  );
});

test("conflicting reverse links cannot give one successor two predecessors", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
  fixture.events = [
    {
      id: "event.predecessor-a",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-19",
      firstObservedAt: "2026-07-19T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      replacedByEventId: "event.successor",
    },
    {
      id: "event.predecessor-c",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      replacedByEventId: "event.successor",
    },
    {
      id: "event.successor",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      legacySourceId: "beta-2",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["legacy:release.ios.27:beta-2"],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "event:event.successor",
    )?.code,
    "multiple-replacement-targets",
  );
  for (const evidenceId of [
    "event:event.predecessor-a",
    "event:event.predecessor-c",
  ]) {
    assert.equal(
      result.exclusions.find((exclusion) => exclusion.evidenceId === evidenceId)
        ?.code,
      "multiple-replacement-targets",
    );
  }
});

test("an invalid successor cannot remove its otherwise valid predecessor", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
  fixture.events = [
    {
      id: "event.predecessor",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      replacedByEventId: "event.invalid-successor",
      legacySourceId: "beta-2",
    },
    {
      id: "event.invalid-successor",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      isRevision: true,
      revisionOfId: "event:missing",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["event:event.predecessor"],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "event:event.invalid-successor",
    )?.code,
    "unknown-replacement-target",
  );
});

test("a revision cannot rely on an edge from an invalid predecessor", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
  fixture.events = [
    {
      id: "event.invalid-predecessor",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      isRevision: true,
      replacedByEventId: "event.dependent-revision",
    },
    {
      id: "event.dependent-revision",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      isRevision: true,
      legacySourceId: "beta-2",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["legacy:release.ios.27:beta-2"],
  );
  for (const evidenceId of [
    "event:event.invalid-predecessor",
    "event:event.dependent-revision",
  ]) {
    assert.equal(
      result.exclusions.find((exclusion) => exclusion.evidenceId === evidenceId)
        ?.code,
      "unknown-replacement-target",
    );
  }
});

test("a replacement cannot rely on an edge from an invalid predecessor", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
  fixture.events = [
    {
      id: "event.invalid-predecessor",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      isRevision: true,
    },
    {
      id: "event.dependent-replacement",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      replacesEventId: "event.invalid-predecessor",
      legacySourceId: "beta-2",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["legacy:release.ios.27:beta-2"],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "event:event.dependent-replacement",
    )?.code,
    "unknown-replacement-target",
  );
});

test("ambiguous replacement successors cannot remove their predecessor", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [{ id: "release.ios.27", lifecycle: "active" }];
  fixture.compatibilityMilestones = [fixture.compatibilityMilestones[0]];
  fixture.events = [
    {
      id: "event.predecessor",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-20",
      firstObservedAt: "2026-07-20T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      legacySourceId: "beta-2",
    },
    {
      id: "event.successor-b",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-21",
      firstObservedAt: "2026-07-21T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      replacesEventId: "event.predecessor",
    },
    {
      id: "event.successor-c",
      releaseId: "release.ios.27",
      occurredOn: "2026-07-22",
      firstObservedAt: "2026-07-22T00:00:00.000Z",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
      replacesEventId: "event.predecessor",
    },
  ];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(
    result.effectiveEvents.map(({ evidenceId }) => evidenceId),
    ["legacy:release.ios.27:beta-2"],
  );
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "event:event.predecessor",
    )?.code,
    "ambiguous-effective-stage",
  );
});

test("missing release sentinel cannot collide with a legitimate release ID", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [
    { id: "", lifecycle: "active" },
    { id: "missing", lifecycle: "active" },
  ];
  fixture.events = [];
  fixture.compatibilityMilestones = [];
  const forward = adaptReleaseObservations(fixture);
  const reversed = adaptReleaseObservations({
    ...fixture,
    releases: [...fixture.releases].reverse(),
  });

  assert.deepEqual(reversed, forward);
  assert.deepEqual(forward.dataset.releases.map(({ id }) => id), ["missing"]);
  assert.equal(
    forward.exclusions.find(
      ({ evidenceId }) => evidenceId === "input:release:missing-id",
    )?.code,
    "missing-release-id",
  );
  assert.equal(
    forward.inclusionLedger.find(
      ({ evidenceId }) => evidenceId === "release:missing:input",
    )?.included,
    true,
  );
});

test("invalid global cutoffs throw before producing a dataset", () => {
  const empty = {
    asOfDate: "invalid",
    issuedAt: "2026-08-09T12:00:00.000Z",
    releases: [],
    events: [],
    compatibilityMilestones: [],
  };
  const populated = releaseObservationFixture();
  populated.issuedAt = "2026-08-09";

  assert.throws(
    () => adaptReleaseObservations(empty),
    (error) =>
      error instanceof ReleaseObservationInputError &&
      error.code === "invalid-as-of-date" &&
      error.message ===
        "Release observation input is invalid: invalid-as-of-date.",
  );
  assert.throws(
    () => adaptReleaseObservations(populated),
    (error) =>
      error instanceof ReleaseObservationInputError &&
      error.code === "invalid-issued-at" &&
      error.message ===
        "Release observation input is invalid: invalid-issued-at.",
  );
});

test("released lifecycle status date must equal the public outcome date", () => {
  const fixture = releaseObservationFixture();
  fixture.releases = [
    {
      id: "release.ios.26",
      lifecycle: "released",
      publicReleaseDate: "2025-09-15",
      statusEffectiveOn: "2025-09-14",
      statusFirstObservedAt: "2025-09-15T18:00:00.000Z",
    },
  ];
  fixture.events = [];
  fixture.compatibilityMilestones = [];
  const result = adaptReleaseObservations(fixture);

  assert.deepEqual(result.dataset.releases, []);
  assert.deepEqual(result.releasedOutcomes, []);
  assert.deepEqual(validateForecastAnalysisDataset(result.dataset), []);
  assert.equal(
    result.exclusions.find(
      ({ evidenceId }) => evidenceId === "release:release.ios.26:input",
    )?.code,
    "release-status-date-mismatch",
  );
});
