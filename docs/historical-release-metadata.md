# Historical release metadata sidecar

FR-021 adds the storage and planning boundary needed to construct
`HistoricalReleaseMetadataV1` from published Sanity documents. It does not add
production metadata, query Production, deploy a schema, or authorize a write.

## Data boundary

Each `historicalReleaseMetadata` document is keyed to exactly one
`releaseVersion`. Its document ID must be
`historicalReleaseMetadata.<releaseVersion._id>`; unsafe or overlong release
IDs fail closed instead of being rewritten.

The sidecar stores these values explicitly:

- `productFamilyId`;
- `releaseClass` (`major`, `minor`, or `patch`);
- positive integer `releasePosition`;
- `releaseCycleId`;
- separate source or audit-batch references for each of those four assertions;
- chronology coverage as sourced `complete` or sourced `unknown`, with one of
  the three FR-007 unknown reasons when applicable.

The published projection in `src/lib/historical-release-source.ts` emits the
raw version lifecycle, compatibility milestones, first-class events, and
sidecars required by the observation adapter and FR-007 builder. It excludes
draft IDs and must be fetched with the published perspective. It resolves
event relationships through `stableEventId`. It does not inspect display
versions, labels, notes, `_updatedAt`, or array order.

The optional `releaseVersion.statusFirstObservedAt` records when Version Record
first observed a released or superseded lifecycle state. It is distinct from
the effective date and prevents the observation adapter from substituting a
new plan's `issuedAt` day during historical backtests. Active releases cannot
carry it. The planner can set it only from either an explicitly reviewed,
sourced timestamp or the document's immutable Sanity `_createdAt` as a
conservative lower bound on availability. `_updatedAt` is never an input. A
candidate whose UTC day predates the lifecycle effective date fails closed.
The Studio field is read-only so ordinary editorial entry cannot bypass this
reviewed planner path.

Missing event `firstObservedAt` or `sameDayOrder` remains missing. Existing
adapter and dataset rules then use their documented conservative fallback or
fail-closed coverage behavior.

## Curated manifest

Planning requires a human-reviewed JSON manifest and a fresh published-only
snapshot. No cohort assertion, evidence identity, or explicit observation
timestamp is invented by the planner; it only copies a reviewed timestamp or
immutable `_createdAt` and derives the reviewable availability day of
explicitly cited evidence. The manifest must contain exactly one entry for
every published `releaseVersion` in the analytical source. Partial migration
cohorts are not eligible for apply because they cannot prove that FR-007
remains complete. Unknown properties are rejected at every manifest contract
level, including nested coverage, evidence, and lifecycle-observation objects.
Each entry must name:

- the deterministic metadata ID and release-version ID;
- exact current revisions for the release version, its release train, and its
  platform;
- the expected current metadata revision, or `null` only when the sidecar is
  confirmed absent;
- all four explicit cohort values;
- assertion-scoped evidence IDs and exact evidence revisions;
- FR-007 coverage, reason when unknown, and exact coverage-evidence revisions.

Every released or superseded release in the manifest must also already have a
valid `statusFirstObservedAt`, or provide one of these reviewed instructions:

- `{"strategy":"explicit","value":"<ISO timestamp>","evidence":[...]}`
  with one or more exact source/audit-batch revisions; or
- `{"strategy":"sanity-created-at"}` only when the snapshot's immutable
  `_createdAt` is a valid timestamp on or after the lifecycle effective day.

The second strategy is intentionally conservative. It proves no availability
before the Sanity document existed; it does not claim `_createdAt` is the real
historical transition or first editorial observation.

Explicit evidence is also bound in time. For every cited `source`, the planner
uses its valid `publishedAt` UTC day, or its valid `accessedAt` day only when
`publishedAt` is absent. For every cited `auditBatch`, it uses the valid
`verifiedAt` UTC day. The plan records that derived day and basis, and rejects
an observation day earlier than any cited evidence's availability. A missing
or malformed evidence time stops planning; a later `accessedAt` cannot override
an existing `publishedAt`, and `_updatedAt` is never a fallback.

Shape only (angle-bracket values must be replaced by reviewed facts; this is
not an ingestible manifest):

```text
{
  "formatVersion": 1,
  "entries": [
    {
      "metadataId": "historicalReleaseMetadata.<release-version-id>",
      "releaseVersionId": "<release-version-id>",
      "expectedReleaseVersionRevision": "<revision>",
      "expectedReleaseTrainRevision": "<revision>",
      "platformId": "<platform-id>",
      "expectedPlatformRevision": "<revision>",
      "expectedMetadataRevision": null,
      "productFamilyId": "<reviewed-stable-family-id>",
      "releaseClass": "<major-minor-or-patch>",
      "releasePosition": <positive-integer>,
      "releaseCycleId": "<reviewed-stable-cycle-id>",
      "metadataEvidence": {
        "productFamily": [{ "id": "<source-or-audit-id>", "expectedRevision": "<revision>" }],
        "releaseClass": [{ "id": "<source-or-audit-id>", "expectedRevision": "<revision>" }],
        "releasePosition": [{ "id": "<source-or-audit-id>", "expectedRevision": "<revision>" }],
        "releaseCycle": [{ "id": "<source-or-audit-id>", "expectedRevision": "<revision>" }]
      },
      "chronologyCoverage": {
        "state": "unknown",
        "reason": "<not-reviewed-source-coverage-incomplete-or-same-day-order-unknown>",
        "evidence": [{ "id": "<source-or-audit-id>", "expectedRevision": "<revision>" }]
      },
      "statusFirstObservedAt": {
        "strategy": "explicit",
        "value": "<reviewed-ISO-timestamp-with-offset>",
        "evidence": [{ "id": "<source-or-audit-id>", "expectedRevision": "<revision>" }]
      }
    }
  ]
}
```

## Offline plan

The planner has no Sanity client and rejects apply, mutation, production, and
user-token flags:

```sh
npm run migration:historical-metadata:plan -- \
  --snapshot path/to/fresh-published-snapshot.json \
  --manifest path/to/reviewed-manifest.json \
  --write-artifacts
```

It stops on drafts, unsafe or duplicate identities, duplicate sidecars,
ambiguous or missing evidence, stale release/graph/evidence/target revisions,
unsupported values, unsafe lifecycle observation bounds, and no-op entries. A
successful plan records exact IDs, old and expected new bodies, dependency
revisions, scoped evidence refs, lifecycle-observation basis, revision-guarded
sets, each explicit lifecycle evidence availability day and derivation basis,
deterministic SHA-256, and exact rollback set/unset or delete-created operations.

The reviewed snapshot must contain the complete full documents for these
analytical types: `auditBatch`, `historicalReleaseMetadata`, `platform`,
`releaseEvent`, `releaseTrain`, `releaseVersion`, and `source`. The plan binds
the sorted ID/type/revision ledger for that entire set and a digest of the exact
snapshot bytes. This includes every first-class release event and every legacy
milestone embedded in a release-version revision. Plan and rollback contract
objects reject unknown properties recursively; opaque Sanity before/after
document bodies remain exact digest-bound payloads so unowned document fields
can be preserved safely.

This workflow is separate from and does not change the chronology metadata
planner introduced for issue #26.

## Guarded apply

The apply command exists for a later, separately authorized production change.
Do not run it merely because a plan exists. After independent review and fresh
approval of one exact plan hash, all gates are required:

```sh
npm run sanity:historical-metadata:apply -- \
  --plan .migration-artifacts/historical-release-metadata-plan-<sha>.json \
  --rollback .migration-artifacts/historical-release-metadata-rollback-<sha>.json \
  --manifest path/to/reviewed-manifest.json \
  --apply \
  --confirm-production \
  --plan-sha <exact-approved-sha>
```

The command is pinned to the existing project and `production` dataset. Before
writing, it rejects drafts; rechecks the complete live analytical
ID/type/revision ledger and exact snapshot digest against the approved plan;
and rechecks every planned target and dependency revision. It also requires the
manifest and plan to cover the complete published release cohort, projects all
reviewed sidecar and lifecycle mutations into the live source in memory, and
builds and validates the resulting FR-007 dataset before a transaction object
exists. The transaction uses creates or per-document revision guards,
including any `releaseVersion.statusFirstObservedAt` patch. After commit it
verifies exact sidecar and release-version bodies, rebuilds and validates the
published FR-007 dataset against the preflight result, and replays the planner
against post-apply revisions to require a zero-residual no-op. It writes a local
receipt with the resulting revisions and historical-dataset fingerprint.

The apply preflight also re-derives every explicit lifecycle evidence
availability day from the still-current evidence revision and requires it to
match the reviewed plan before committing.

Rollback is not automated. Recovery requires fetching current post-apply
revisions, verifying created bodies still match the plan, and applying only the
reviewed rollback artifact's delete or set/unset operation under those current
revision guards.

## Remaining production prerequisite

Before any real plan can exist, an editor must curate and source every sidecar
value for the intended complete adapter cohort. Then a fresh published snapshot
must be captured after the schema/projection code is deployed. The resulting
exact plan and rollback artifact still require independent review and fresh
user approval for that plan SHA.
