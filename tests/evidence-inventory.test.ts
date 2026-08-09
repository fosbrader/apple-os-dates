import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  assertValidEvidenceInventory,
  buildEvidenceInventory,
  buildEvidenceInventoryFromVersionsForTest,
  generatedArtifactContent,
  staleGeneratedArtifactKeys,
} from "../scripts/lib/evidence-inventory";
import { stableStringify, type LegacyReleaseVersion } from "../scripts/lib/release-event-migration";

function seed(): unknown {
  return JSON.parse(readFileSync(path.join(process.cwd(), "scripts", "seed-data.json"), "utf8")) as unknown;
}

type InventoryLegacyVersion = LegacyReleaseVersion & { releaseNotesUrl?: string };

function version(overrides: Partial<InventoryLegacyVersion> = {}): InventoryLegacyVersion {
  return {
    _id: "version-ios-27-0",
    platformId: "platform-ios",
    platform: "iOS",
    version: "27.0",
    releaseStatus: "active",
    milestones: [
      { _key: "beta-1", label: "Beta 1", date: "2026-06-08", isRevision: false },
      { _key: "beta-2", label: "Beta 2", date: "2026-06-22", isRevision: false },
    ],
    ...overrides,
  };
}

test("the offline seed inventory is deterministic and records exact local counts", () => {
  const first = buildEvidenceInventory(seed());
  const second = buildEvidenceInventory(seed());

  assert.deepEqual(first, second);
  assert.equal(first.inventory.counts.releaseVersions, 410);
  assert.equal(first.inventory.counts.eventRecords, 1_979);
  assert.equal(first.inventory.counts.legacyMilestones, 1_979);
  assert.equal(first.inventory.counts.sources, 107);
  assert.equal(first.inventory.counts.conflicts, 0);
  assert.doesNotThrow(() => assertValidEvidenceInventory(first, seed()));
  assert.equal(stableStringify(first), stableStringify(second));
});

test("batches are bounded, non-overlapping, and use stable event IDs", () => {
  const artifacts = buildEvidenceInventory(seed());
  const targets = artifacts.manifest.batches.flatMap((batch) => batch.targetRecordIds);

  assert.ok(artifacts.manifest.batches.length > 0);
  assert.ok(artifacts.manifest.batches.every((batch) => batch.targetRecordIds.length <= 12));
  assert.equal(new Set(targets).size, targets.length);
  assert.deepEqual(
    [...targets].sort(),
    artifacts.inventory.releaseEvents
      .filter((event) => event.sourceCoverage !== "linked")
      .map((event) => event.recordId)
      .sort(),
  );
});

test("observed source URLs receive stable IDs and stay linked to their records", () => {
  const artifacts = buildEvidenceInventoryFromVersionsForTest([
    version({
      releaseNotesUrl: "https://support.apple.example/release-notes",
      milestones: [
        {
          _key: "beta-1",
          label: "Beta 1",
          date: "2026-06-08",
          isRevision: false,
          sourceUrl: "https://developer.apple.example/beta-1",
          sourceLabel: "Apple Developer",
        },
      ],
    }),
  ]);
  const [event] = artifacts.inventory.releaseEvents;
  const source = artifacts.inventory.sourceEvidence.find((candidate) =>
    candidate.url === "https://developer.apple.example/beta-1",
  );

  assert.equal(event.sourceCoverage, "linked");
  assert.ok(source);
  assert.deepEqual(event.evidenceIds, [source.evidenceId]);
  assert.ok(source.linkedRecordIds.includes(`event:${event.recordId}`));
  assert.deepEqual(source.sourceDate, { state: "unknown", reason: "not-present-in-local-seed" });
  assert.deepEqual(source.accessDate, { state: "unknown", reason: "not-present-in-local-seed" });
  assert.ok(artifacts.inventory.releaseVersions[0].evidenceIds.includes(source.evidenceId));
});

test("unknown evidence remains quarantined and factual identity/date conflicts are never guessed", () => {
  const missing = buildEvidenceInventoryFromVersionsForTest([version()]);
  assert.ok(missing.inventory.releaseEvents.every((event) => event.sourceCoverage === "missing"));
  assert.ok(missing.inventory.releaseEvents.every((event) => event.quarantineReasons.includes("missing-observed-source-link")));

  const conflictInput = {
    releaseVersions: [
      version({
        milestones: [
          {
            _key: "beta-1",
            label: "Beta 1",
            date: "2026-06-08",
            isRevision: false,
            sourceUrl: "https://developer.apple.example/shared",
            sourceLabel: "Apple Developer",
          },
        ],
      }),
    ],
    evidenceInventoryConflicts: [
      {
        recordId: "version-ios-27-0:beta-1",
        field: "appearanceDate",
        observedValues: ["2026-06-08", "2026-06-09"],
        evidenceUrls: ["https://developer.apple.example/shared"],
      },
    ],
  };
  const conflict = buildEvidenceInventory(conflictInput);
  assert.equal(conflict.inventory.counts.conflicts, 1);
  assert.ok(conflict.inventory.releaseEvents.every((event) => event.sourceCoverage === "conflict"));
  assert.ok(conflict.inventory.releaseEvents.every((event) => event.quarantineReasons.includes("conflicting-observed-chronology-evidence")));
});

test("conflicting observed source and access dates preserve every value and quarantine all linked records", () => {
  const input = {
    releaseVersions: [
      {
        _id: "version-ios-27-0",
        platformId: "platform-ios",
        platform: "iOS",
        version: "27.0",
        milestones: [
          {
            _key: "beta-1",
            label: "Beta 1",
            date: "2026-06-08",
            isRevision: false,
            sourceUrl: "https://developer.apple.example/shared",
            sourceLabel: "Apple Developer",
            sourcePublishedAt: "2026-06-08",
            sourceAccessedAt: "2026-06-09",
          },
          {
            _key: "beta-2",
            label: "Beta 2",
            date: "2026-06-22",
            isRevision: false,
            sourceUrl: "https://developer.apple.example/shared",
            sourceLabel: "Apple Developer",
            sourcePublishedAt: "2026-06-10",
            sourceAccessedAt: "2026-06-11",
          },
        ],
      },
    ],
  };
  const artifacts = buildEvidenceInventory(input);
  const [source] = artifacts.inventory.sourceEvidence;

  assert.deepEqual(source.sourceDate, {
    state: "conflict",
    values: ["2026-06-08", "2026-06-10"],
  });
  assert.deepEqual(source.accessDate, {
    state: "conflict",
    values: ["2026-06-09", "2026-06-11"],
  });
  assert.equal(source.coverage, "conflict");
  assert.equal(artifacts.inventory.counts.conflicts, 2);
  assert.ok(artifacts.inventory.releaseEvents.every((event) => event.sourceCoverage === "conflict"));
  assert.equal(artifacts.inventory.releaseVersions[0].sourceCoverage, "conflict");
  assert.equal(artifacts.manifest.counts.conflictingEvidenceTargets, 2);
});

test("explicit conflicts require source URLs already linked to their exact record", () => {
  const input = {
    releaseVersions: [
      {
        _id: "version-ios-27-0",
        platformId: "platform-ios",
        platform: "iOS",
        version: "27.0",
        milestones: [
          {
            _key: "beta-1",
            label: "Beta 1",
            date: "2026-06-08",
            isRevision: false,
            sourceUrl: "https://developer.apple.example/beta-1",
            sourceLabel: "Apple Developer",
          },
          {
            _key: "beta-2",
            label: "Beta 2",
            date: "2026-06-22",
            isRevision: false,
            sourceUrl: "https://developer.apple.example/beta-2",
            sourceLabel: "Apple Developer",
          },
        ],
      },
    ],
  };
  const conflict = {
    recordId: "version-ios-27-0:beta-1",
    field: "appearanceDate",
    observedValues: ["2026-06-08", "2026-06-09"],
  };

  assert.throws(
    () => buildEvidenceInventory({ ...input, evidenceInventoryConflicts: [{ ...conflict, evidenceUrls: [] }] }),
    /one or more linked source URLs/,
  );
  assert.throws(
    () => buildEvidenceInventory({ ...input, evidenceInventoryConflicts: [{ ...conflict, evidenceUrls: ["https://developer.apple.example/beta-2"] }] }),
    /not linked to that exact event record/,
  );
});

test("generated output check detects stale artifact content", () => {
  const artifacts = buildEvidenceInventoryFromVersionsForTest([version()]);
  const content = generatedArtifactContent(artifacts);
  assert.deepEqual(
    staleGeneratedArtifactKeys(content, {
      inventory: `${content.inventory}\n`,
      manifest: content.manifest,
      summary: content.summary,
    }),
    ["inventory"],
  );
  assert.match(content.summary, /quarantined/i);
});
