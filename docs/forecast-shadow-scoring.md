# Prospective forecast scoring and private shadow health v1

`src/lib/forecast-shadow-scoring.ts` is the storage-neutral FR-015 core. It
defines canonical contracts for outcome-time bindings, immutable scores,
reconciliation indexes, correction audits, bounded evaluation epochs, and
private health reports. It does not add a public route, Sanity write, scheduled
job, or production storage adapter.

## Source and time rules

The scorer does not accept caller-authored outcome records. It derives each
candidate from a fully validated `historical-analysis-dataset/v1` row. It binds
the dataset fingerprint, canonical row fingerprint, exact evidence identity,
occurrence day, first-observed day, and an evidence-keyed exact observation
instant.

The observation-instant sidecar must match one canonical event or lifecycle
outcome in the dataset. Its UTC day must equal the dataset row's
`firstObservedOn`. Its instant must be no later than dataset issuance and the
exact reconciliation cutoff. The dataset snapshot must also be issued no later
than that cutoff. The index stores the exact cutoff instant and derives its UTC
date. A commit requires `reconciliationCutoffAt <= updatedAt`.

An outcome must occur and become known strictly after the forecast origin,
forecast data cutoff, and forecast generation instant. The scorer does not
invent same-day order. A public-release target can use only the source-backed
public lifecycle outcome. A next-event target uses the exact canonical event at
the end of its anchor interval and requires the forecast's predicted stage
family. Targets are matched by both `targetKind` and `targetId`.

## Scores and corrections

FR-015 scores the exact selected point and calibrated intervals stored in the
source `forecast-artifact/v1`. It does not recompute a point or change its
estimator identity. Score artifacts retain the source forecast, model,
calibration, cohort, anchor evidence, outcome evidence, and complete immutable
outcome projection.

Every available forecast target has exactly one active state: score, pending,
or data gap. A changed outcome date, evidence set, stage, identity, or
observation instant creates a replacement score and an immutable audit row. A
retracted or superseded outcome removes the obsolete active score and creates a
retraction or supersession audit row. Old score artifacts remain immutable for
audit use.

Canonical parsers enforce byte limits before UTF-8 decode or JSON parse. Score,
index, and health writers reject unknown properties, noncanonical order,
invalid fingerprints, and unbounded rows.

## Bounded evaluation epoch

The shadow evaluator uses a predeclared epoch so daily immutable roots cannot
grow without limit on the free hosting plan. The v1 epoch fixes these limits:

- 120 calendar days and at most 120 sampled forecast artifacts.
- One canonical `daily-shadow` run key per scheduled day. A retry cannot become
  an extra statistical sample.
- At most 32 available targets in one sampled forecast and 512 target states in
  the epoch.
- At most 512 correction audit rows, 128 evidence IDs in one state row, and a
  768 KiB soft index budget below the 1 MiB parser limit.

The index persists the first applicable stop reason: forecast limit, target
limit, audit limit, byte budget, or epoch end. A closed epoch continues to
reconcile its existing pending outcomes and corrections, subject to its hard
audit and byte safety limits. It rejects new forecast samples.

Rollover is an operator gate. Do not create a new epoch automatically. First,
retain the old root and its referenced immutable objects, verify its final
health report, record the stop reason, and review storage usage. Then create and
approve a new epoch identity. This prevents silent retention changes and
cherry-picked sampling.

## Incremental daily storage path

The reconciliation root carries a canonical target snapshot and the outcome
and metric projection needed for each state. A normal daily run reads and
validates the exact prior content-addressed root once. It does not reread every
historical forecast or score object.

The planner requests an old forecast artifact only when a prior pending or gap
state becomes scoreable, or when a corrected outcome needs a replacement
score. Retractions and unchanged scores need no historical artifact read. A
commit writes only new scores, one new immutable root, and the FR-012 pointer
CAS. If the target states, audits, sampled forecasts, and epoch stop state did
not change, reconciliation reuses the prior root; it does not write a new root
only to advance a cutoff. An exact replay also returns before the nonadvancing
pointer timestamp check and does not perform a CAS.

This keeps Blob operations bounded by new work instead of cumulative history.
The root still has explicit row and byte limits. Treat any limit result as an
operator event, not as a reason to discard older samples.

## Private health semantics

Operational health and statistical reportability are separate. Operational
health covers freshness, run failures, pending targets, data gaps, and audit
activity. Statistical metrics never count those states as model errors.

Forecast coverage counts forecast states. Model performance gives equal weight
to each unique realized source event. If daily forecast origins point to the
same realized event, the report averages their errors and coverage within that
event first. It then aggregates the event-level values. MAE, median absolute
error, signed bias, and 50%/80% coverage remain unavailable until the group has
eight unique realized events. Platform and model-cohort forecast-state counts
must partition their target-kind totals exactly.

Run failures accept only closed codes and fixed safe summaries. The report does
not retain raw error messages.

## Schedule-enablement blocker

FR-015 can score only immutable predictions present at forecast origin. The
current source artifact stores the selected model prediction. It does not yet
store the origin-time current-heuristic and simple-baseline predictions needed
for the full FR-014/FR-015 benchmark comparison.

Do not enable the daily production schedule or claim forecast-quality readiness
until the forecast artifact and runtime emit all three immutable origin-time
predictions: selected model, current heuristic, and simple baseline. Never
reconstruct those benchmark values after the outcome is known.

## Runtime integration order

1. Build and validate the historical dataset and exact observation bindings.
2. Load and digest-check the prior reconciliation root, if one exists.
3. Call `forecastArtifactIdsRequiredForReconciliation`.
4. Load only the returned prior forecast artifacts by exact digest.
5. Call `reconcileForecastScores` and write only `newScoreArtifactIds`.
6. Write the new immutable root and advance the private pointer with CAS.
7. Build private health from the self-contained index. Use complete artifact
   maps only for an offline deep audit.
8. Keep the schedule disabled until benchmark origin snapshots and the epoch
   rollover runbook are integrated and reviewed.

Validate stored canonical score, index, or health JSON with:

```sh
npm run forecast:scoring:validate -- path/to/document.json
```
