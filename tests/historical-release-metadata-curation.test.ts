import assert from "node:assert/strict";
import test from "node:test";

import { buildHistoricalMetadataCurationQueue } from "../scripts/lib/historical-release-metadata-curation";

function snapshot(releaseVersion: Record<string, unknown> = {}): {
  documents: Record<string, unknown>[];
} {
  return {
    documents: [
      {
        _id: "platform-testos",
        _type: "platform",
        _rev: "platform-rev-1",
        name: "TestOS",
        slug: { current: "testos" },
      },
      {
        _id: "train-testos-27",
        _type: "releaseTrain",
        _rev: "train-rev-1",
        displayName: "TestOS 27",
        majorVersion: 27,
        platform: { _type: "reference", _ref: "platform-testos" },
      },
      {
        _id: "version-testos-27-0",
        _type: "releaseVersion",
        _rev: "version-rev-1",
        _createdAt: "2026-09-15T00:00:00.000Z",
        version: "27.0",
        releaseStatus: "released",
        publicReleaseDate: "2026-09-14",
        releaseTrain: { _type: "reference", _ref: "train-testos-27" },
        citations: [
          {
            _key: "citation-version",
            _type: "citation",
            source: { _type: "reference", _ref: "source-version" },
          },
        ],
        ...releaseVersion,
      },
      {
        _id: "event-testos-27-0-public",
        _type: "releaseEvent",
        _rev: "event-rev-1",
        stableEventId: "testos-27-public",
        releaseVersion: { _type: "reference", _ref: "version-testos-27-0" },
        appearanceDate: "2026-09-14",
        channel: "public",
        citations: [
          {
            _key: "citation-event",
            _type: "citation",
            source: { _type: "reference", _ref: "source-event" },
          },
        ],
      },
      {
        _id: "source-event",
        _type: "source",
        _rev: "source-event-rev-1",
        title: "Event source",
        canonicalUrl: "https://example.com/event",
        publishedAt: "2026-09-14T12:00:00.000Z",
        accessedAt: "2026-09-14",
      },
      {
        _id: "source-version",
        _type: "source",
        _rev: "source-version-rev-1",
        title: "Version source",
        canonicalUrl: "https://example.com/version",
        accessedAt: "2026-09-14",
      },
    ],
  };
}

test("historical metadata curation queue is deterministic and leaves assertions blank", () => {
  const first = buildHistoricalMetadataCurationQueue(snapshot());
  const second = buildHistoricalMetadataCurationQueue({
    documents: [...snapshot().documents].reverse(),
  });

  assert.deepEqual(first, second);
  assert.equal(
    first.curationVersion,
    "historical-release-metadata-curation/v1",
  );
  assert.deepEqual(first.summary, {
    releaseVersions: 1,
    existingMetadata: 0,
    missingMetadata: 1,
    activeReleaseVersions: 0,
    releaseVersionsRequiringLifecycleReview: 1,
    releaseVersionsRequiringLifecycleRepair: 0,
    releaseVersionsWithoutEvidenceCandidates: 0,
  });
  assert.deepEqual(
    first.entries[0]?.evidenceCandidates.map(({ id }) => id),
    ["source-event", "source-version"],
  );
  assert.deepEqual(first.entries[0]?.reviewFields, {
    productFamilyId: null,
    releaseClass: null,
    releasePosition: null,
    releaseCycleId: null,
    metadataEvidence: null,
    chronologyCoverage: null,
    statusFirstObservedAt: null,
  });
  assert.deepEqual(first.entries[0]?.lifecycleReview, {
    state: "candidate-sanity-created-at",
    lifecycle: "released",
    effectiveDate: "2026-09-14",
  });
});

test("historical metadata curation queue flags lifecycle gaps without inventing repairs", () => {
  const queue = buildHistoricalMetadataCurationQueue(
    snapshot({
      releaseStatus: "superseded",
      publicReleaseDate: undefined,
      statusEffectiveDate: undefined,
    }),
  );

  assert.equal(
    queue.entries[0]?.lifecycleReview.state,
    "requires-effective-date-repair",
  );
  assert.deepEqual(queue.entries[0]?.blockers, ["lifecycle-repair-required"]);
  assert.equal(queue.summary.releaseVersionsRequiringLifecycleRepair, 1);
});
