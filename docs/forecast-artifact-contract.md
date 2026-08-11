# Forecast artifact and pointer contract v1

FR-012 adds a storage-neutral boundary for private shadow forecasts. It does
not connect Vercel Blob, a cron job, an API, Sanity, or the public UI.

## Immutable artifact

`forecast-artifact/v1` has one fixed mode: `private-shadow`. Its provenance
binds the source cutoff and evidence, the projected historical dataset used by
private model work, the full historical dataset and raw source that produced
the authoritative runtime cohort, the projected raw source, walk-forward
evaluation, public-release model and calibration, next-event model and
calibration, the frozen current public heuristic, and the artifact-builder
code. Component versions must be exact v1 versions. Fingerprints are SHA-256
digests. The current-heuristic provenance binds both its exact bounded legacy
source snapshot and its frozen algorithm fingerprint; it is intentionally
separate from the projected private-model cohort so it continues to represent
the existing site heuristic.

Targets use the `public-release` or `next-eligible-prerelease-event` tag. An
available target identifies the exact upstream point estimator and has a finite
point plus calibrated 50% and 80% intervals. Public-release points name either
`platform-stage-median` or `hierarchical-platform-cadence`; next-event points
name `next-event-timing-median`. This prevents a hierarchical shrinkage estimate
from being mislabeled as a raw median. Both intervals use one residual count and
the fixed finite-sample rank. The 50% bounds must be inside the 80% bounds.
Calendar bounds round outward from the source-linked anchor. An unavailable
target has a typed reason and no prediction or date fields.

Every target also persists the exact product family, model-training members,
and calibration-residual members used at the declared origin. Public-release
targets have one `model-training` component. Next-event targets preserve
separate `stage-training` and `timing-training` components. Their aggregate
model count is the size of the union, so a member that appears in both
components is counted once. Available targets require at least eight members
in every required model component and at least eight calibration residuals.

Each target contains exactly three immutable `forecast-origin-benchmark/v1`
rows in this order:

1. `selected-private-model` duplicates the target prediction and binds the
   target's exact model and calibration fingerprints. Its cohorts reference
   the target cohort instead of repeating the same member IDs.
2. `current-public-heuristic` runs the frozen legacy public-release heuristic
   against only facts known at the target origin. It includes exact inline
   cohort members when available. The legacy heuristic has no comparable
   next-eligible-event target, so that row is explicitly unavailable with
   `incomparable-target-definition`.
3. `simple-baseline` uses the exact upstream platform-stage median candidate
   for public-release targets. For next-event targets it uses a same-platform
   pooled eligible-stage mode and the median timing for that predicted stage.
   Available comparator cohorts are exact, non-empty, and meet the algorithm's
   minimum sample size.

Benchmark availability, prediction values, target kind, cohort bindings, and
source/model/calibration fingerprints are cross-validated against the target
and provenance. A run cannot reconstruct a comparator after the outcome is
known or silently substitute a different cohort.

This example uses the checked contract builder. It is preferable to assembling
JSON by hand because the builder orders targets, metrics, exclusions, and
evidence IDs before it computes hashes:

```ts
const artifact = buildForecastArtifact({
  generatedAt: "2026-08-09T20:00:00.000Z",
  runIdentity: {
    version: "forecast-run-identity/v1",
    pipeline: "daily-shadow",
    scheduledFor: "2026-08-09",
  },
  provenance,
  targets: [nextEventTarget, publicReleaseTarget],
  metrics,
  exclusions,
});

const bytes = new TextEncoder().encode(serializeForecastArtifact(artifact));
const path = forecastArtifactPath(artifact.artifactId);
```

The contract has three distinct identities:

- `runKey` identifies the declared `daily-shadow` scheduled day for idempotent
  execution. A retry keeps this key even if fetch or issuance timestamps move.
- `semanticFingerprint` binds the forecast content but excludes `generatedAt`.
- `artifactId` binds the full artifact, including `generatedAt`.

Changing only `generatedAt` keeps the first two values and changes
`artifactId`. A provenance change can change semantic content while retaining
the same scheduled-run key. Changing `scheduledFor` changes the run key even
when forecast semantics are otherwise equal. Artifact paths contain only that digest:
`forecast/artifacts/<sha256>.json`. Canonical JSON is at most 262,144 bytes
(256 KiB). An artifact has at most 32 targets, including at most 32 available
targets. Targets, metrics, exclusions, cohort members, and evidence IDs also
have explicit row bounds. Cohort-member limits follow the bounded source
observation capacity; the byte limit is the stricter operational constraint.

## Mutable pointer

`forecast-pointer/v1` is at most 16 KiB and always has
`publicReadEnabled: false`. It has a positive generation and a fingerprint of
the complete pointer. Every update binds the previous generation and pointer
fingerprint. This pair prevents lost updates and ABA replacement.

| Transition | Required state change |
| --- | --- |
| `initialize` | Create generation 1. Set every artifact ID and the reconciliation root to `null`. |
| `candidate-written` | Change only the candidate ID and transition metadata. Preserve active, rollback, and reconciliation root. |
| `activate-shadow` | Move candidate to active. Move the prior active ID to rollback. Clear candidate. Preserve the reconciliation root. |
| `rollback-shadow` | Swap active and rollback. Preserve candidate and reconciliation root. |
| `reconciliation-committed` | Change only the reconciliation root and transition metadata. Preserve all forecast IDs and the public flag. |

For example, if artifact A is active and artifact B is the candidate,
activation produces `active=B` and `rollback=A`. A rollback then produces
`active=A` and `rollback=B`. It does not edit or delete either artifact.

The reconciliation root is `null` at initialization. A non-null value is the
raw SHA-256 digest of a compatible immutable reconciliation-index artifact.
The adapter reads it by the exact digest path only. FR-012 has no list
operation. FR-015 defines the index rows and scoring meaning.

## Storage transaction

`commitForecastArtifactTransition` accepts a small pure storage interface:
exact read, immutable put, and atomic pointer compare-and-swap. For a candidate
write, it validates and writes the immutable artifact before pointer CAS. If
the path exists, its bytes must be identical. Different bytes at the same
digest fail as an immutable collision.

Before CAS, the function reads every candidate, active, rollback, and optional
reconciliation reference by exact digest. Each forecast artifact must be valid
canonical v1 content and compatible with the other references. A rollback
therefore cannot point to missing, corrupt, public, or incompatible content.
Adapters without atomic CAS fail closed. Put failures, collisions, stale
fingerprints, lost updates, and ABA generations leave the prior pointer as the
committed state.

The Production-only Vercel implementation and its provisioning gate are in
[`forecast-blob-storage.md`](./forecast-blob-storage.md). The adapter uses a
dedicated private store and short-lived OIDC. It is not enabled by this
contract alone.

Validate stored canonical artifact or pointer bytes with:

```sh
npm run forecast:contracts:validate -- path/to/document.json
```
