import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  applyChronologyMetadataPlanToSnapshotForTest,
  assertValidChronologyMetadataPlan,
  buildChronologyMetadataPlan,
  validateChronologyMetadataPlan,
} from "../scripts/lib/chronology-metadata-migration";
import { validateStatusEffectiveDate } from "../src/sanity/schemas/schemaValidation";

function snapshot() {
  return JSON.parse(
    readFileSync(
      path.join(process.cwd(), "tests", "fixtures", "chronology-metadata-snapshot.json"),
      "utf8",
    ),
  ) as { documents: Array<Record<string, unknown>> };
}

const terminalDates = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "tests", "fixtures", "chronology-terminal-dates.json"),
    "utf8",
  ),
) as unknown;

test("chronology metadata plan is deterministic, revision-guarded, and rollback-complete", () => {
  const first = buildChronologyMetadataPlan(snapshot(), terminalDates);
  const second = buildChronologyMetadataPlan(snapshot(), terminalDates);

  assert.deepEqual(first, second);
  assert.equal(first.plan.patches.length, 4);
  assert.deepEqual(
    first.plan.patches.map((patch) => patch.id),
    [
      "event-ios-27-beta-1",
      "version-ios-27-0",
      "version-ipados-13-0",
      "version-ipados-16-0",
    ],
  );
  assert.deepEqual(
    first.plan.skippedSupersededWithoutSourcedTerminalDateIds,
    ["version-ipados-13-0"],
  );
  assert.equal(first.plan.summary.firstObservedAtDefaults, 1);
  assert.equal(first.plan.summary.chronologyCoverageDefaults, 3);
  assert.equal(first.plan.summary.releasedStatusEffectiveDates, 1);
  assert.equal(first.plan.summary.supersededStatusEffectiveDates, 1);
  assert.equal(first.plan.summary.supersededEvidenceCitationsAdded, 1);
  assert.ok(first.plan.patches.every((patch) => patch.ifRevisionId));
  assert.ok(
    first.plan.patches.every(
      (patch) =>
        JSON.stringify(Object.keys(patch.set).sort()) ===
        JSON.stringify(Object.keys(patch.previousValues).sort()),
    ),
  );
  assert.deepEqual(validateChronologyMetadataPlan(first.plan, first.rollback), []);
  assert.doesNotThrow(() =>
    assertValidChronologyMetadataPlan(first.plan, first.rollback),
  );
  assert.equal(first.rollback.restorePatches.length, first.plan.patches.length);
});

test("defaults preserve existing metadata and use only conservative evidence", () => {
  const { plan } = buildChronologyMetadataPlan(snapshot(), terminalDates);
  const byId = new Map(plan.patches.map((patch) => [patch.id, patch]));

  assert.deepEqual(byId.get("event-ios-27-beta-1")?.set, {
    firstObservedAt: "2026-06-08T17:00:00.000Z",
  });
  assert.deepEqual(byId.get("version-ios-27-0")?.set, {
    chronologyCoverage: { status: "unknown" },
    statusEffectiveDate: "2026-09-14",
  });
  assert.deepEqual(byId.get("version-ipados-16-0")?.set, {
    citations: [
      {
        _key: "terminal-1bdae7f3e87595c09156",
        _type: "citation",
        note: "Supports the recorded terminal lifecycle date.",
        source: {
          _ref: "source-terminal-ipados-16",
          _type: "reference",
        },
      },
    ],
    chronologyCoverage: { status: "unknown" },
    statusEffectiveDate: "2022-09-12",
  });
  assert.deepEqual(byId.get("version-ipados-13-0")?.set, {
    chronologyCoverage: { status: "unknown" },
  });
  assert.equal(byId.get("version-ipados-13-0")?.set.statusEffectiveDate, undefined);
  assert.equal(byId.get("version-watchos-27-0"), undefined);
  assert.deepEqual(
    byId.get("event-ios-27-beta-1")?.previousValues.firstObservedAt,
    { _migrationPreviousValue: "missing" },
  );
  assert.deepEqual(
    plan.patches.map((patch) => patch.set).some((set) =>
      Object.hasOwn(set, "_migrationPreviousValue"),
    ),
    false,
  );
});

test("an exact in-memory application makes the next dry run a no-op", () => {
  const first = buildChronologyMetadataPlan(snapshot(), terminalDates);
  const after = applyChronologyMetadataPlanToSnapshotForTest(snapshot(), first.plan);
  const second = buildChronologyMetadataPlan({ documents: after }, terminalDates);

  assert.equal(second.plan.patches.length, 0);
  assert.equal(second.plan.summary.unchanged, 5);
  assert.deepEqual(second.plan.skippedSupersededWithoutSourcedTerminalDateIds, [
    "version-ipados-13-0",
  ]);
});

test("planned lifecycle metadata satisfies the release-version schema validator", () => {
  const first = buildChronologyMetadataPlan(snapshot(), terminalDates);
  const documents = applyChronologyMetadataPlanToSnapshotForTest(
    snapshot(),
    first.plan,
  );
  const released = documents.find(
    (document) => document._id === "version-ios-27-0",
  );
  const superseded = documents.find(
    (document) => document._id === "version-ipados-16-0",
  );
  const event = documents.find(
    (document) => document._id === "event-ios-27-beta-1",
  );

  assert.ok(released);
  assert.ok(superseded);
  assert.ok(event);
  assert.equal(
    validateStatusEffectiveDate(
      released.statusEffectiveDate as string,
      { document: released } as never,
    ),
    true,
  );
  assert.equal(
    validateStatusEffectiveDate(
      superseded.statusEffectiveDate as string,
      { document: superseded } as never,
    ),
    true,
  );
  assert.equal(event.firstObservedAt, event._createdAt);
  assert.equal(event.chronologyCoverage, undefined);
});

test("a superseded terminal date must be explicitly sourced in the snapshot", () => {
  assert.throws(
    () =>
      buildChronologyMetadataPlan(snapshot(), {
        terminalDates: [
          {
            releaseVersionId: "version-ipados-16-0",
            date: "2022-09-12",
            sourceIds: ["source-not-present"],
          },
        ],
      }),
    /without a source document/,
  );
});

test("terminal-date targets must be exact superseded versions", () => {
  assert.throws(
    () =>
      buildChronologyMetadataPlan(snapshot(), {
        terminalDates: [
          {
            releaseVersionId: "version-missing",
            date: "2022-09-12",
            sourceIds: ["source-terminal-ipados-16"],
          },
        ],
      }),
    /not a releaseVersion/,
  );
  assert.throws(
    () =>
      buildChronologyMetadataPlan(snapshot(), {
        terminalDates: [
          {
            releaseVersionId: "version-ios-27-0",
            date: "2026-09-14",
            sourceIds: ["source-terminal-ipados-16"],
          },
        ],
      }),
    /not an explicitly superseded release version/,
  );
});

test("malformed terminal-date containers fail closed", () => {
  assert.throws(
    () => buildChronologyMetadataPlan(snapshot(), { terminalDate: [] }),
    /must be an array or an object with a terminalDates array/,
  );
});

test("rollback distinguishes restored values from fields that must be unset", () => {
  const result = buildChronologyMetadataPlan(snapshot(), terminalDates);
  const eventRollback = result.rollback.restorePatches.find(
    (patch) => patch.id === "event-ios-27-beta-1",
  );
  assert.deepEqual(eventRollback?.set, {});
  assert.deepEqual(eventRollback?.unset, ["firstObservedAt"]);

  const tampered = structuredClone(result.rollback);
  tampered.restorePatches[0].unset = [];
  assert.ok(
    validateChronologyMetadataPlan(result.plan, tampered).includes(
      "rollback artifact does not cover the exact plan",
    ),
  );
});

test("any draft in the supplied snapshot stops planning", () => {
  const invalid = snapshot();
  invalid.documents.push({
    _id: "drafts.unrelated-document",
    _type: "sitePage",
  });
  assert.throws(
    () => buildChronologyMetadataPlan(invalid, terminalDates),
    /Snapshot contains draft/,
  );
});

test("events without a valid Sanity creation timestamp cannot receive an inferred first observation", () => {
  const invalid = snapshot();
  (invalid.documents[1] as Record<string, unknown>)._createdAt = "not-a-timestamp";
  assert.throws(
    () => buildChronologyMetadataPlan(invalid, terminalDates),
    /valid Sanity _createdAt/,
  );
});
