import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  assertHistoricalAnalyticalSnapshotMatchesPlan,
  buildHistoricalReleaseMetadataPlan,
  HistoricalReleaseMetadataNoopPlanError,
  historicalReleaseEvidenceReference,
  historicalReleaseMetadataId,
  parseCuratedHistoricalMetadataManifest,
  validateHistoricalReleaseMetadataPlan,
} from "../scripts/lib/historical-release-metadata-migration";
import {
  projectHistoricalAnalyticalSourceFromSnapshot,
} from "../scripts/lib/historical-analytical-source-binding";
import {
  assertHistoricalAnalyticalSourceMatchesPlan,
  assertExactHistoricalManifestCohortCoverage,
  buildValidatedHistoricalPostPlanDataset,
} from "../scripts/lib/historical-release-metadata-apply-preflight";
import type { PublishedHistoricalReleaseSource } from "../src/lib/historical-release-source";

const versionId = "version-testos-27-0";
const metadataId = historicalReleaseMetadataId(versionId);

function snapshot(
  extra: Record<string, unknown>[] = [],
  releaseVersionOverrides: Record<string, unknown> = {},
  evidenceOverrides: {
    sourceFamily?: Record<string, unknown>;
    sourceCycle?: Record<string, unknown>;
    auditChronology?: Record<string, unknown>;
  } = {},
) {
  return {
    documents: [
      { _id: "platform-testos", _type: "platform", _rev: "platform-rev-1" },
      {
        _id: "train-testos-27",
        _type: "releaseTrain",
        _rev: "train-rev-1",
        platform: { _type: "reference", _ref: "platform-testos" },
      },
      {
        _id: versionId,
        _type: "releaseVersion",
        _rev: "version-rev-1",
        releaseTrain: { _type: "reference", _ref: "train-testos-27" },
        ...releaseVersionOverrides,
      },
      {
        _id: "source-family",
        _type: "source",
        _rev: "source-rev-1",
        accessedAt: "2026-09-14",
        ...evidenceOverrides.sourceFamily,
      },
      {
        _id: "source-cycle",
        _type: "source",
        _rev: "source-rev-2",
        accessedAt: "2026-09-14",
        ...evidenceOverrides.sourceCycle,
      },
      {
        _id: "audit-chronology",
        _type: "auditBatch",
        _rev: "audit-rev-1",
        verifiedAt: "2026-09-14T12:00:00.000Z",
        ...evidenceOverrides.auditChronology,
      },
      ...extra,
    ],
  };
}

function manifest(overrides: Record<string, unknown> = {}) {
  return {
    formatVersion: 1,
    entries: [
      {
        metadataId,
        releaseVersionId: versionId,
        expectedReleaseVersionRevision: "version-rev-1",
        expectedReleaseTrainRevision: "train-rev-1",
        platformId: "platform-testos",
        expectedPlatformRevision: "platform-rev-1",
        expectedMetadataRevision: null,
        productFamilyId: "test-device-os",
        releaseClass: "major",
        releasePosition: 27,
        releaseCycleId: "testos-cycle-27",
        metadataEvidence: {
          productFamily: [
            { id: "source-family", expectedRevision: "source-rev-1" },
          ],
          releaseClass: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
          releasePosition: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
          releaseCycle: [
            { id: "source-family", expectedRevision: "source-rev-1" },
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
        },
        chronologyCoverage: {
          state: "unknown",
          reason: "not-reviewed",
          evidence: [
            { id: "audit-chronology", expectedRevision: "audit-rev-1" },
          ],
        },
        ...overrides,
      },
    ],
  };
}

function plannedSidecar() {
  return {
    _id: metadataId,
    _type: "historicalReleaseMetadata",
    releaseVersion: { _type: "reference", _ref: versionId },
    productFamilyId: "test-device-os",
    releaseClass: "major",
    releasePosition: 27,
    releaseCycleId: "testos-cycle-27",
    metadataEvidence: {
      productFamily: [
        historicalReleaseEvidenceReference(
          "source-family",
          "metadataEvidence.productFamily",
        ),
      ],
      releaseClass: [
        historicalReleaseEvidenceReference(
          "source-cycle",
          "metadataEvidence.releaseClass",
        ),
      ],
      releasePosition: [
        historicalReleaseEvidenceReference(
          "source-cycle",
          "metadataEvidence.releasePosition",
        ),
      ],
      releaseCycle: [
        historicalReleaseEvidenceReference(
          "source-cycle",
          "metadataEvidence.releaseCycle",
        ),
        historicalReleaseEvidenceReference(
          "source-family",
          "metadataEvidence.releaseCycle",
        ),
      ],
    },
    chronologyCoverage: {
      state: "unknown",
      reason: "not-reviewed",
      evidence: [
        historicalReleaseEvidenceReference(
          "audit-chronology",
          "chronologyCoverage.evidence",
        ),
      ],
    },
  };
}

function publishedSource(
  releases: PublishedHistoricalReleaseSource["releases"] = [
    { id: versionId },
  ],
): PublishedHistoricalReleaseSource {
  return {
    releases,
    events: [],
    compatibilityMilestones: [],
    releaseMetadata: [],
  };
}

test("builds a deterministic create with exact evidence revisions and delete rollback", () => {
  const first = buildHistoricalReleaseMetadataPlan(snapshot(), manifest());
  const second = buildHistoricalReleaseMetadataPlan(
    { documents: [...snapshot().documents].reverse() },
    manifest({
      metadataEvidence: {
        productFamily: [
          { id: "source-family", expectedRevision: "source-rev-1" },
        ],
        releaseClass: [
          { id: "source-cycle", expectedRevision: "source-rev-2" },
        ],
        releasePosition: [
          { id: "source-cycle", expectedRevision: "source-rev-2" },
        ],
        releaseCycle: [
          { id: "source-cycle", expectedRevision: "source-rev-2" },
          { id: "source-family", expectedRevision: "source-rev-1" },
        ],
      },
    }),
  );

  assert.equal(first.plan.planDigest, second.plan.planDigest);
  assert.equal(first.plan.summary.creates, 1);
  assert.equal(first.plan.summary.patches, 0);
  assert.deepEqual(first.plan.mutations[0]?.after, plannedSidecar());
  assert.deepEqual(first.plan.mutations[0]?.metadataEvidence, {
    productFamily: [
      { id: "source-family", expectedRevision: "source-rev-1" },
    ],
    releaseClass: [
      { id: "source-cycle", expectedRevision: "source-rev-2" },
    ],
    releasePosition: [
      { id: "source-cycle", expectedRevision: "source-rev-2" },
    ],
    releaseCycle: [
      { id: "source-cycle", expectedRevision: "source-rev-2" },
      { id: "source-family", expectedRevision: "source-rev-1" },
    ],
  });
  assert.deepEqual(first.rollback.restoreMutations, [
    {
      action: "delete-created",
      id: metadataId,
      requireCurrentPostApplyRevision: true,
      set: {},
      unset: [],
    },
  ]);
  assert.deepEqual(
    validateHistoricalReleaseMetadataPlan(first.plan, first.rollback),
    [],
  );
});

test("pre-commit FR-007 validation uses the exact complete manifest cohort", () => {
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([
          {
            _id: "version-testos-27-1",
            _type: "releaseVersion",
            _rev: "version-other-rev-1",
            releaseTrain: { _type: "reference", _ref: "train-testos-27" },
          },
        ]),
        manifest(),
      ),
    /exactly cover every releaseVersion in the complete analytical snapshot/,
  );

  const result = buildHistoricalReleaseMetadataPlan(snapshot(), manifest());
  const dataset = buildValidatedHistoricalPostPlanDataset({
    source: publishedSource(),
    manifest: parseCuratedHistoricalMetadataManifest(manifest()),
    plan: result.plan,
    issuedAt: "2026-09-15T12:00:00.000Z",
  });
  assert.equal(dataset.releaseCycles.length, 1);
  assert.equal(dataset.releaseCycles[0]?.releaseId, versionId);

  const partialSource = publishedSource([
    { id: versionId },
    { id: "version-testos-27-1" },
  ]);
  assert.throws(
    () =>
      assertExactHistoricalManifestCohortCoverage(
        parseCuratedHistoricalMetadataManifest(manifest()),
        result.plan,
        partialSource,
      ),
    /exactly cover the complete published analytical release cohort/,
  );
  assert.throws(
    () =>
      buildValidatedHistoricalPostPlanDataset({
        source: partialSource,
        manifest: parseCuratedHistoricalMetadataManifest(manifest()),
        plan: result.plan,
        issuedAt: "2026-09-15T12:00:00.000Z",
      }),
    /exactly cover the complete published analytical release cohort/,
  );
});

test("the approved plan binds every analytical document revision including release events", () => {
  const event = {
    _id: "event-testos-27-beta-1",
    _type: "releaseEvent",
    _rev: "event-rev-1",
    stableEventId: "testos-27-beta-1",
    releaseVersion: { _type: "reference", _ref: versionId },
    appearanceDate: "2026-09-01",
    channel: "developer-beta",
  };
  const plannedSnapshot = snapshot([event]);
  const result = buildHistoricalReleaseMetadataPlan(
    plannedSnapshot,
    manifest(),
  );
  assert.doesNotThrow(() =>
    assertHistoricalAnalyticalSnapshotMatchesPlan(result.plan, plannedSnapshot),
  );
  const projectedSource = projectHistoricalAnalyticalSourceFromSnapshot(
    plannedSnapshot.documents,
  );
  assert.doesNotThrow(() =>
    assertHistoricalAnalyticalSourceMatchesPlan(result.plan, projectedSource),
  );
  assert.throws(
    () =>
      assertHistoricalAnalyticalSourceMatchesPlan(result.plan, {
        ...projectedSource,
        events: [],
      }),
    /exact projected analytical source changed or is incomplete/,
  );
  assert.throws(
    () =>
      assertHistoricalAnalyticalSourceMatchesPlan(result.plan, {
        ...projectedSource,
        events: projectedSource.events.map((sourceEvent) => ({
          ...sourceEvent,
          channel: "publicBeta",
        })),
      }),
    /exact projected analytical source changed or is incomplete/,
  );

  const changedRevision = structuredClone(plannedSnapshot);
  const changedEvent = changedRevision.documents.find(
    ({ _id }) => _id === event._id,
  );
  assert.ok(changedEvent);
  changedEvent._rev = "event-rev-2";
  assert.throws(
    () =>
      assertHistoricalAnalyticalSnapshotMatchesPlan(
        result.plan,
        changedRevision,
      ),
    /complete live analytical document revision set changed/,
  );

  const changedBytes = structuredClone(plannedSnapshot);
  const changedEventBytes = changedBytes.documents.find(
    ({ _id }) => _id === event._id,
  );
  assert.ok(changedEventBytes);
  changedEventBytes.channel = "public-beta";
  assert.throws(
    () =>
      assertHistoricalAnalyticalSnapshotMatchesPlan(result.plan, changedBytes),
    /complete live analytical snapshot changed/,
  );
});

test("the approved projected source also binds every compatibility milestone", () => {
  const plannedSnapshot = snapshot([], {
    milestones: [
      {
        _key: "legacy-beta-1",
        date: "2026-09-02",
        channel: "developerBeta",
        sequence: 1,
        firstObservedAt: "2026-09-02T18:00:00.000Z",
      },
    ],
  });
  const result = buildHistoricalReleaseMetadataPlan(
    plannedSnapshot,
    manifest(),
  );
  const projectedSource = projectHistoricalAnalyticalSourceFromSnapshot(
    plannedSnapshot.documents,
  );
  assert.equal(projectedSource.compatibilityMilestones.length, 1);
  assert.throws(
    () =>
      assertHistoricalAnalyticalSourceMatchesPlan(result.plan, {
        ...projectedSource,
        compatibilityMilestones: [],
      }),
    /exact projected analytical source changed or is incomplete/,
  );
});

test("revision-guarded patches preserve unknown fields and rollback set versus unset", () => {
  const current = {
    ...plannedSidecar(),
    _rev: "metadata-rev-1",
    productFamilyId: "old-family",
    chronologyCoverage: {
      state: "unknown",
      reason: "source-coverage-incomplete",
      evidence: [{ _type: "reference", _ref: "audit-chronology" }],
    },
    privateFutureField: { keep: true },
  };
  delete (current as Record<string, unknown>).releaseCycleId;
  const result = buildHistoricalReleaseMetadataPlan(
    snapshot([current]),
    manifest({ expectedMetadataRevision: "metadata-rev-1" }),
  );
  const mutation = result.plan.mutations[0];

  assert.equal(mutation?.action, "patch");
  assert.equal(mutation?.ifRevisionId, "metadata-rev-1");
  assert.deepEqual(Object.keys(mutation?.set ?? {}).sort(), [
    "chronologyCoverage",
    "productFamilyId",
    "releaseCycleId",
  ]);
  assert.deepEqual(mutation?.after.privateFutureField, { keep: true });
  assert.deepEqual(result.rollback.restoreMutations[0], {
    action: "restore-patch",
    id: metadataId,
    requireCurrentPostApplyRevision: true,
    set: {
      chronologyCoverage: current.chronologyCoverage,
      productFamilyId: "old-family",
    },
    unset: ["releaseCycleId"],
  });
});

test("plans a conservative revision-guarded lifecycle observation from immutable _createdAt", () => {
  const result = buildHistoricalReleaseMetadataPlan(
    snapshot([], {
      _createdAt: "2026-09-15T12:30:00.000Z",
      _updatedAt: "2026-10-01T09:00:00.000Z",
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
      statusEffectiveDate: "2026-09-14",
    }),
    manifest({ statusFirstObservedAt: { strategy: "sanity-created-at" } }),
  );

  assert.equal(result.plan.summary.lifecycleObservationPatches, 1);
  assert.equal(result.plan.summary.statusObservationEvidenceReferences, 0);
  assert.deepEqual(result.plan.lifecycleObservationPatches[0], {
    id: versionId,
    ifRevisionId: "version-rev-1",
    basis: "sanity-created-at",
    evidence: [],
    before: {
      _id: versionId,
      _type: "releaseVersion",
      _rev: "version-rev-1",
      _createdAt: "2026-09-15T12:30:00.000Z",
      _updatedAt: "2026-10-01T09:00:00.000Z",
      releaseTrain: { _type: "reference", _ref: "train-testos-27" },
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
      statusEffectiveDate: "2026-09-14",
    },
    after: {
      _id: versionId,
      _type: "releaseVersion",
      releaseTrain: { _type: "reference", _ref: "train-testos-27" },
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
      statusEffectiveDate: "2026-09-14",
      statusFirstObservedAt: "2026-09-15T12:30:00.000Z",
    },
    set: { statusFirstObservedAt: "2026-09-15T12:30:00.000Z" },
    unset: [],
  });
  assert.deepEqual(result.rollback.restoreMutations, [
    {
      action: "delete-created",
      id: metadataId,
      requireCurrentPostApplyRevision: true,
      set: {},
      unset: [],
    },
    {
      action: "restore-patch",
      id: versionId,
      requireCurrentPostApplyRevision: true,
      set: {},
      unset: ["statusFirstObservedAt"],
    },
  ]);
  assert.deepEqual(
    validateHistoricalReleaseMetadataPlan(result.plan, result.rollback),
    [],
  );
});

test("plans an explicit sourced lifecycle observation and binds evidence revisions", () => {
  const result = buildHistoricalReleaseMetadataPlan(
    snapshot([], {
      _createdAt: "2026-10-20T00:00:00.000Z",
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
      statusEffectiveDate: "2026-09-14",
    }),
    manifest({
      statusFirstObservedAt: {
        strategy: "explicit",
        value: "2026-09-14T18:00:00.000Z",
        evidence: [
          { id: "audit-chronology", expectedRevision: "audit-rev-1" },
        ],
      },
    }),
  );

  assert.deepEqual(result.plan.lifecycleObservationPatches[0]?.set, {
    statusFirstObservedAt: "2026-09-14T18:00:00.000Z",
  });
  assert.equal(result.plan.lifecycleObservationPatches[0]?.basis, "explicit");
  assert.deepEqual(result.plan.lifecycleObservationPatches[0]?.evidence, [
    {
      id: "audit-chronology",
      expectedRevision: "audit-rev-1",
      documentType: "auditBatch",
      availableAt: "2026-09-14T12:00:00.000Z",
      availabilityBasis: "verifiedAt",
    },
  ]);
  assert.equal(result.plan.summary.statusObservationEvidenceReferences, 1);

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([], {
          releaseStatus: "released",
          publicReleaseDate: "2026-09-14",
        }),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-14T18:00:00.000Z",
            evidence: [
              { id: "audit-chronology", expectedRevision: "stale-revision" },
            ],
          },
        }),
      ),
    /evidence audit-chronology is stale/,
  );

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot(
          [],
          {
            releaseStatus: "released",
            publicReleaseDate: "2026-09-14",
          },
          {
            auditChronology: {
              verifiedAt: "2026-10-01T12:00:00.000Z",
            },
          },
        ),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-14T18:00:00.000Z",
            evidence: [
              { id: "audit-chronology", expectedRevision: "audit-rev-1" },
            ],
          },
        }),
      ),
    /explicit observation 2026-09-14T18:00:00\.000Z predates audit-chronology availability 2026-10-01T12:00:00\.000Z/,
  );

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot(
          [],
          {
            releaseStatus: "released",
            publicReleaseDate: "2026-09-14",
          },
          {
            sourceFamily: {
              accessedAt: "2020-01-01",
              publishedAt: "2026-10-02T12:00:00.000Z",
            },
          },
        ),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-14T18:00:00.000Z",
            evidence: [
              { id: "source-family", expectedRevision: "source-rev-1" },
            ],
          },
        }),
      ),
    /explicit observation 2026-09-14T18:00:00\.000Z predates source-family availability 2026-10-02T12:00:00\.000Z/,
  );

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot(
          [],
          {
            releaseStatus: "released",
            publicReleaseDate: "2026-09-14",
          },
          { auditChronology: { verifiedAt: null } },
        ),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-14T18:00:00.000Z",
            evidence: [
              { id: "audit-chronology", expectedRevision: "audit-rev-1" },
            ],
          },
        }),
      ),
    /needs a valid verifiedAt evidence time/,
  );

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot(
          [],
          {
            releaseStatus: "released",
            publicReleaseDate: "2026-09-14",
          },
          {
            auditChronology: {
              verifiedAt: "2026-09-14T23:59:00.000Z",
            },
          },
        ),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-14T00:01:00.000Z",
            evidence: [
              { id: "audit-chronology", expectedRevision: "audit-rev-1" },
            ],
          },
        }),
      ),
    /explicit observation 2026-09-14T00:01:00\.000Z predates audit-chronology availability 2026-09-14T23:59:00\.000Z/,
  );

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([], {
          releaseStatus: "released",
          publicReleaseDate: "2026-09-14",
        }),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-14T23:59:59.998Z",
            evidence: [
              { id: "source-family", expectedRevision: "source-rev-1" },
            ],
          },
        }),
      ),
    /predates source-family availability 2026-09-14T23:59:59\.999Z/,
  );

  const accessedAtBoundary = buildHistoricalReleaseMetadataPlan(
    snapshot([], {
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
    }),
    manifest({
      statusFirstObservedAt: {
        strategy: "explicit",
        value: "2026-09-14T23:59:59.999Z",
        evidence: [
          { id: "source-family", expectedRevision: "source-rev-1" },
        ],
      },
    }),
  );
  assert.deepEqual(
    accessedAtBoundary.plan.lifecycleObservationPatches[0]?.evidence[0],
    {
      id: "source-family",
      expectedRevision: "source-rev-1",
      documentType: "source",
      availableAt: "2026-09-14T23:59:59.999Z",
      availabilityBasis: "accessedAt",
    },
  );
});

test("lifecycle observations fail closed without a safe explicit or conservative basis", () => {
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([], {
          _updatedAt: "2026-09-20T00:00:00.000Z",
          releaseStatus: "released",
          publicReleaseDate: "2026-09-14",
        }),
        manifest(),
      ),
    /_updatedAt is forbidden/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([], {
          _createdAt: "2026-09-13T23:59:59.000Z",
          releaseStatus: "released",
          publicReleaseDate: "2026-09-14",
        }),
        manifest({ statusFirstObservedAt: { strategy: "sanity-created-at" } }),
      ),
    /predates lifecycle effective date/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot(),
        manifest({ statusFirstObservedAt: { strategy: "sanity-created-at" } }),
    ),
    /active and cannot record/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([], {
          releaseStatus: "released",
          publicReleaseDate: "2026-09-14",
          statusEffectiveDate: "2026-09-15",
        }),
        manifest({
          statusFirstObservedAt: {
            strategy: "explicit",
            value: "2026-09-15T12:00:00.000Z",
            evidence: [
              { id: "audit-chronology", expectedRevision: "audit-rev-1" },
            ],
          },
        }),
      ),
    /lifecycle dates inconsistent/,
  );
});

test("an exact lifecycle and sidecar application makes the guarded rerun a zero-residual no-op", () => {
  const release = {
    ...snapshot().documents.find(({ _id }) => _id === versionId),
    _rev: "version-rev-2",
    _createdAt: "2026-09-15T12:30:00.000Z",
    releaseStatus: "released",
    publicReleaseDate: "2026-09-14",
    statusEffectiveDate: "2026-09-14",
    statusFirstObservedAt: "2026-09-15T12:30:00.000Z",
  } as Record<string, unknown>;
  const base = snapshot().documents.filter(({ _id }) => _id !== versionId);
  const after = {
    documents: [
      ...base,
      release,
      { ...plannedSidecar(), _rev: "metadata-rev-1" },
    ],
  };

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        after,
        manifest({
          expectedReleaseVersionRevision: "version-rev-2",
          expectedMetadataRevision: "metadata-rev-1",
          statusFirstObservedAt: { strategy: "sanity-created-at" },
        }),
        { allowNoopEntries: true },
      ),
    HistoricalReleaseMetadataNoopPlanError,
  );
});

test("drafts, duplicate sidecars, identity conflicts, and no-op entries stop planning", () => {
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([{ _id: `drafts.${metadataId}`, _type: "historicalReleaseMetadata" }]),
        manifest(),
      ),
    /contains draft/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([
          { ...plannedSidecar(), _id: "sidecar-one", _rev: "m1" },
          { ...plannedSidecar(), _id: "sidecar-two", _rev: "m2" },
        ]),
        manifest(),
      ),
    /duplicate historical metadata/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([{ _id: metadataId, _type: "source", _rev: "collision-rev" }]),
        manifest(),
      ),
    /stable identity is unavailable/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([{ ...plannedSidecar(), _rev: "metadata-rev-1" }]),
        manifest({ expectedMetadataRevision: "metadata-rev-1" }),
      ),
    /no-op plans are blocked/,
  );
  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot([{ ...plannedSidecar(), _rev: "metadata-rev-1" }]),
        manifest({ expectedMetadataRevision: "metadata-rev-1" }),
        { allowNoopEntries: true },
      ),
    HistoricalReleaseMetadataNoopPlanError,
  );
});

test("stale or missing release, graph, evidence, and target revisions fail closed", () => {
  for (const [override, pattern] of [
    [{ expectedReleaseVersionRevision: "old" }, /version-testos-27-0 is stale/],
    [{ expectedReleaseTrainRevision: "old" }, /train-testos-27 is stale/],
    [{ expectedPlatformRevision: "old" }, /platform-testos is stale/],
    [
      {
        metadataEvidence: {
          productFamily: [{ id: "source-family", expectedRevision: "old" }],
          releaseClass: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
          releasePosition: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
          releaseCycle: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
        },
      },
      /evidence source-family is stale/,
    ],
    [
      {
        metadataEvidence: {
          productFamily: [
            { id: "source-missing", expectedRevision: "missing-rev" },
          ],
          releaseClass: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
          releasePosition: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
          releaseCycle: [
            { id: "source-cycle", expectedRevision: "source-rev-2" },
          ],
        },
      },
      /missing published evidence/,
    ],
    [{ expectedMetadataRevision: "old" }, /is missing; manifest expected revision old/],
    [{ platformId: "platform-other" }, /resolves to platform/],
  ] as const) {
    assert.throws(
      () => buildHistoricalReleaseMetadataPlan(snapshot(), manifest(override)),
      pattern,
    );
  }
});

test("manifest values stay explicit, closed, sourced, unique, and release keyed", () => {
  for (const [override, pattern] of [
    [{ metadataId: "free-form-id" }, /sidecar identity is release-version keyed/],
    [{ releasePosition: 0 }, /positive safe integer/],
    [{ releaseClass: "point" }, /major, minor, or patch/],
    [{ productFamilyId: "guessed family" }, /stable identity/],
    [{ releaseCycleId: "derived/cycle" }, /stable identity/],
    [
      {
        metadataEvidence: {
          productFamily: [],
          releaseClass: [],
          releasePosition: [],
          releaseCycle: [],
        },
      },
      /one or more explicit evidence/,
    ],
    [
      { chronologyCoverage: { state: "partial", evidence: [] } },
      /state must be complete or unknown/,
    ],
    [
      {
        chronologyCoverage: {
          state: "unknown",
          reason: "guessed",
          evidence: [{ id: "audit-chronology", expectedRevision: "audit-rev-1" }],
        },
      },
      /not supported by FR-007/,
    ],
  ] as const) {
    assert.throws(
      () => buildHistoricalReleaseMetadataPlan(snapshot(), manifest(override)),
      pattern,
    );
  }

  const duplicated = manifest();
  duplicated.entries.push(structuredClone(duplicated.entries[0]));
  assert.throws(
    () => buildHistoricalReleaseMetadataPlan(snapshot(), duplicated),
    /repeats a metadata document ID/,
  );

  assert.throws(
    () =>
      buildHistoricalReleaseMetadataPlan(
        snapshot(),
        manifest({
          metadataEvidence: {
            productFamily: [
              { id: "source-family", expectedRevision: "source-rev-1" },
            ],
            releaseClass: [
              { id: "source-family", expectedRevision: "conflicting-rev" },
            ],
            releasePosition: [
              { id: "source-cycle", expectedRevision: "source-rev-2" },
            ],
            releaseCycle: [
              { id: "source-cycle", expectedRevision: "source-rev-2" },
            ],
          },
        }),
      ),
    /conflicting curated evidence revisions/,
  );
});

test("manifest, plan, and rollback artifacts reject unknown properties recursively", () => {
  const unknownManifestRoot = manifest() as Record<string, unknown>;
  unknownManifestRoot.unreviewed = true;
  assert.throws(
    () => parseCuratedHistoricalMetadataManifest(unknownManifestRoot),
    /Curated manifest contains unknown property: unreviewed/,
  );

  const unknownManifestEvidence = manifest();
  const evidence = unknownManifestEvidence.entries[0].metadataEvidence
    .productFamily[0] as Record<string, unknown>;
  evidence.note = "not part of the reviewed contract";
  assert.throws(
    () => parseCuratedHistoricalMetadataManifest(unknownManifestEvidence),
    /metadataEvidence\.productFamily\[0\] contains unknown property: note/,
  );

  const result = buildHistoricalReleaseMetadataPlan(snapshot(), manifest());
  const unknownPlan = structuredClone(result.plan) as typeof result.plan & {
    mutations: Array<
      (typeof result.plan.mutations)[number] & { unreviewed?: boolean }
    >;
  };
  unknownPlan.mutations[0].unreviewed = true;
  assert.ok(
    validateHistoricalReleaseMetadataPlan(unknownPlan, result.rollback).some(
      (failure) =>
        failure.includes("plan.mutations[0] contains unknown properties: unreviewed"),
    ),
  );

  const unknownNestedPlan = structuredClone(result.plan);
  const projectedReference = (
    unknownNestedPlan.mutations[0].set.metadataEvidence as {
      productFamily: Array<Record<string, unknown>>;
    }
  ).productFamily[0];
  projectedReference.unreviewed = true;
  assert.ok(
    validateHistoricalReleaseMetadataPlan(
      unknownNestedPlan,
      result.rollback,
    ).some((failure) =>
      failure.includes(
        "plan.mutations[0].set.metadataEvidence.productFamily[0] contains unknown properties: unreviewed",
      ),
    ),
  );

  const unknownRollback = structuredClone(result.rollback) as typeof result.rollback & {
    restoreMutations: Array<
      (typeof result.rollback.restoreMutations)[number] & { unreviewed?: boolean }
    >;
  };
  unknownRollback.restoreMutations[0].unreviewed = true;
  assert.ok(
    validateHistoricalReleaseMetadataPlan(result.plan, unknownRollback).some(
      (failure) =>
        failure.includes(
          "rollback.restoreMutations[0] contains unknown properties: unreviewed",
      ),
    ),
  );

  const lifecycleResult = buildHistoricalReleaseMetadataPlan(
    snapshot([], {
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
    }),
    manifest({
      statusFirstObservedAt: {
        strategy: "explicit",
        value: "2026-09-14T18:00:00.000Z",
        evidence: [
          { id: "audit-chronology", expectedRevision: "audit-rev-1" },
        ],
      },
    }),
  );
  const unknownTemporalPlan = structuredClone(lifecycleResult.plan);
  const temporalEvidence = unknownTemporalPlan.lifecycleObservationPatches[0]
    .evidence[0] as unknown as Record<string, unknown>;
  temporalEvidence.availableOn = "2026-09-14";
  assert.ok(
    validateHistoricalReleaseMetadataPlan(
      unknownTemporalPlan,
      lifecycleResult.rollback,
    ).some((failure) =>
      failure.includes(
        "plan.lifecycleObservationPatches[0].evidence[0] contains unknown properties: availableOn",
      ),
    ),
  );
});

test("plan and rollback hashes bind every exact operation", () => {
  const result = buildHistoricalReleaseMetadataPlan(snapshot(), manifest());
  const tamperedPlan = structuredClone(result.plan);
  tamperedPlan.mutations[0].after.productFamilyId = "tampered";
  assert.ok(
    validateHistoricalReleaseMetadataPlan(tamperedPlan, result.rollback).includes(
      "plan identity or SHA-256 digest is invalid",
    ),
  );
  const tamperedRollback = structuredClone(result.rollback);
  tamperedRollback.restoreMutations[0].unset.push("productFamilyId");
  assert.ok(
    validateHistoricalReleaseMetadataPlan(result.plan, tamperedRollback).includes(
      "rollback does not exactly cover this plan",
    ),
  );
  const tamperedSourceBinding = structuredClone(result.plan);
  tamperedSourceBinding.analyticalSnapshot.projectedSourceDigest = "0".repeat(64);
  assert.ok(
    validateHistoricalReleaseMetadataPlan(
      tamperedSourceBinding,
      result.rollback,
    ).includes("plan identity or SHA-256 digest is invalid"),
  );

  const lifecycleResult = buildHistoricalReleaseMetadataPlan(
    snapshot([], {
      _createdAt: "2026-09-15T12:30:00.000Z",
      releaseStatus: "released",
      publicReleaseDate: "2026-09-14",
    }),
    manifest({ statusFirstObservedAt: { strategy: "sanity-created-at" } }),
  );
  const tamperedLifecyclePlan = structuredClone(lifecycleResult.plan);
  tamperedLifecyclePlan.lifecycleObservationPatches[0].set.statusFirstObservedAt =
    "2026-10-01T00:00:00.000Z";
  assert.ok(
    validateHistoricalReleaseMetadataPlan(
      tamperedLifecyclePlan,
      lifecycleResult.rollback,
    ).includes("plan identity or SHA-256 digest is invalid"),
  );
});

test("the apply command retains all independent production gates", () => {
  const source = readFileSync(
    path.join(
      process.cwd(),
      "scripts",
      "apply-historical-release-metadata-migration.ts",
    ),
    "utf8",
  );
  for (const required of [
    'process.argv.includes("--apply")',
    'process.argv.includes("--confirm-production")',
    'argumentValue("--plan-sha")',
    'argumentValue("--manifest")',
    "acknowledgedPlanSha !== plan.planDigest",
    "assertPlanMatchesManifest(plan, manifest)",
    "patch.ifRevisionId",
    "plan.lifecycleObservationPatches",
    "exactEqual(writableBody(current), mutation.after)",
    "historicalLifecycleObservationEvidence(",
    "assertHistoricalAnalyticalSnapshotMatchesPlan(plan",
    "HISTORICAL_ANALYTICAL_SNAPSHOT_TYPES",
    "buildValidatedHistoricalPostPlanDataset({",
    "expectedPostPlanDataset",
    'perspective: "raw"',
    'perspective: "published"',
    "buildHistoricalAnalysisDataset",
    "validateHistoricalAnalysisDataset",
    "allowNoopEntries: true",
  ]) {
    assert.ok(source.includes(required), `missing apply guard: ${required}`);
  }
  assert.ok(
    source.indexOf("buildValidatedHistoricalPostPlanDataset({") <
      source.indexOf("let transaction = client.transaction()"),
    "FR-007 in-memory overlay validation must finish before a transaction exists",
  );
});
