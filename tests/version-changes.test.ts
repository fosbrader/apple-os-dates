import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeVersionChanges,
  type VersionChangeTargets,
} from "../src/lib/sanity.fetch";
import type { ChangeOccurrence } from "../src/lib/types";

function occurrence(key: string): ChangeOccurrence {
  return {
    _key: key,
    change: {
      _id: `change-${key}`,
      title: `Change ${key}`,
      category: "enhancement",
    },
    action: "changed",
    inheritance: "delta",
    summary: "An original description of the recorded release change.",
    documentedStatus: "documented",
    evidenceState: "confirmed",
  };
}

test("version changes combine event and build occurrences with target context", () => {
  const targets: VersionChangeTargets = {
    eventTargets: [
      {
        _id: "event-1",
        label: "Beta 4",
        date: "2026-07-20",
        slug: { current: "beta-4" },
        changes: [occurrence("shared-key")],
      },
    ],
    buildTargets: [
      {
        _id: "build-1",
        buildNumber: "24A5390F",
        slug: { current: "24a5390f" },
        changes: [occurrence("shared-key")],
      },
    ],
  };

  const changes = normalizeVersionChanges(targets);

  assert.equal(changes.length, 2);
  assert.equal(new Set(changes.map((change) => change._key)).size, 2);
  assert.deepEqual(changes[0].targetEvent, {
    _id: "event-1",
    label: "Beta 4",
    date: "2026-07-20",
    slug: { current: "beta-4" },
  });
  assert.equal(changes[1].targetBuild?.buildNumber, "24A5390F");
});
