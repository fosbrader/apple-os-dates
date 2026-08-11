# Daily private forecast pipeline

FR-014/FR-015 can build or reuse one private shadow forecast candidate for each
UTC day, then reconcile prior immutable forecasts against newly observed,
source-backed outcomes. The route is implemented at
`/api/cron/forecast-shadow/`. It is default-off. The server must set
`FORECAST_SHADOW_ENABLED=true` before the route reads its evaluation-epoch
configuration, Sanity, or Blob storage. The Vercel cron schedule remains absent
until the historical metadata migration and dedicated private Blob configuration
pass their separate gates. The route has no public forecast response.

## Input and model execution

After the feature gate and `CRON_SECRET` authentication, the route reads one
uncached Sanity snapshot with the published perspective. The source read has
an eight-second attempt timeout and at most one bounded retry. The route query
returns bounded arrays, exact source counts, and overflow sentinels. The route
rejects a count mismatch or any overflow. It does not accept a truncated
snapshot.

The pipeline rejects a provided `statusFirstObservedAt` or `firstObservedAt`
unless it is a canonical ISO instant at or before the exact request instant.
This check happens before the adapter truncates data to a UTC day. An event
first observed later on the same day cannot enter an earlier run.

The pipeline supplies the scheduled UTC day and request instant explicitly to
the pure observation adapter. It then builds and validates, in order:

1. the complete source-backed historical-analysis dataset;
2. the exact whole-cycle runtime cohort and its independently verified source
   projection;
3. the projected source-backed dataset used by private model work;
4. leakage-safe walk-forward evaluation;
5. public-release candidate comparison;
6. calibrated 50% and 80% public-release intervals;
7. the calibrated next-eligible-prerelease-event model; and
8. a frozen current-public-heuristic snapshot from the complete bounded
   compatibility projection;
9. exact origin-time selected, current-heuristic, and simple-baseline
   benchmark rows; and
10. one canonical `forecast-artifact/v1` document.

Only included, active cycles with explicit complete chronology can produce a
target. The latest known canonical event is always used. A later GM or public
event is never skipped to reuse an older beta. Each public point records the
exact selected candidate (`platform-stage-median` or
`hierarchical-platform-cadence`). Each next-event point records
`next-event-timing-median`. Unavailable targets and excluded cycles retain typed
reasons; the pipeline does not invent missing dates or chronology.

The artifact binds the exact full source/dataset, authoritative runtime
selection, projected model source/dataset, evaluation, model, calibration,
frozen-current-heuristic, and pipeline fingerprints. Private and simple
benchmark model work uses only the projection. The current-public-heuristic
benchmark deliberately uses the full already-bounded legacy projection so it
continues to represent the existing site behavior; it has its own distinct
source fingerprint. Each target also retains
its exact product family, model-training components, calibration-residual IDs,
and three origin-time benchmark rows. The selected row is cross-bound to the
target prediction and fingerprints. The current heuristic is comparable only
to a public-release target; its next-event row is explicitly unavailable. The
simple public baseline is the upstream platform-stage median candidate. The
simple next-event baseline uses the pooled same-platform stage mode and median
timing for that predicted stage.

The runtime and contract cap are both 262,144 bytes (256 KiB) per daily
artifact. The artifact can contain at most 32 targets. This keeps expected
storage within the existing shared free-plan allocation and fails closed if
source growth exceeds the operational budget.

The runtime source contract applies these limits before model execution:

- 512 releases;
- 2,304 first-class events;
- 2,304 compatibility milestones;
- 4,608 combined events and milestones;
- 512 metadata sidecars;
- 512 legacy-heuristic release rows;
- 2,304 legacy-heuristic milestone rows;
- 2 MiB of canonical source JSON;
- 512 UTF-8 bytes per string;
- 128 evidence IDs per evidence field; and
- 256 UTF-8 bytes per evidence ID.

The full, unsliced Sanity query remains available for migration and offline
planning. The production route uses only the bounded query. The compatibility
rows are a narrow, flat projection for the frozen comparator; they do not
replace the canonical analytical source.

## Release-day readiness check

After publishing release records, run this local command:

```sh
npm run forecast:source:readiness
```

It reads the published Sanity CDN and checks the bounded source envelope,
canonical byte budget, source shape, and complete sidecar coverage. It does
not use a token or write to Sanity, Blob, Vercel, GitHub, or a cron schedule.
It exits nonzero when historical analysis is not ready. Until the reviewed
sidecar migration is complete, `metadata-coverage-incomplete` is expected.
This check is not an activation approval; use the full gate below before any
private forecast run.

Every comparator is built during the scheduled run with the same exact source
date and request instant as the selected forecast. Release states, milestones,
and observation metadata later than that origin are excluded. The current
heuristic additionally requires an exact proof that its latest compatibility
milestone maps to the canonical analytical anchor. If release or anchor mapping
cannot be proved, its benchmark is unavailable with a typed reason. No later
run backfills a historical comparator from current Sanity state.

After activation or a same-day artifact reuse, the reconciliation runner uses
that same bounded source snapshot to rebuild the complete historical dataset
and evidence-keyed observation-instant bindings. It then atomically reconciles
prior pending forecasts against newly known outcomes. The full validated source
is intentionally used for this step: the current runtime cohort may no longer
contain an older forecasted release, but its outcome must remain scoreable.
When the snapshot has no included active cycle, the runner does not invent an
empty forecast artifact. It skips generation and reconciles the last active
private artifact; a missing prior artifact fails closed instead of recording an
empty state.

## Idempotency and overlap

The mutable pointer is the cross-instance lock. The pipeline uses only exact
reads, immutable content-addressed writes, and generation plus fingerprint CAS:

1. initialize the pointer if it does not exist;
2. write an immutable candidate and point to it;
3. atomically activate the candidate; and
4. retain the prior active artifact as rollback.

Before a same-day return or candidate activation, the pipeline reads and
validates every active, candidate, and rollback artifact in the pointer. It
also validates a reconciliation root when one is present. Missing, corrupt,
incompatible, oversized, or future references are storage-integrity failures.
A non-null reconciliation root requires its exact validator. The pipeline
checks the root path, content digest, and validator result.

A valid same-day retry returns the already-active artifact without fetching
Sanity or writing Blob data. An interrupted run resumes a valid same-day
candidate. A stale candidate can be replaced. A local in-process guard rejects
duplicate work in one function instance; CAS resolves overlap across
instances. Any build, write, or activation failure leaves the prior active
pointer and immutable artifacts readable.

Historical replay is not supported by this daily route. A truthful replay
needs an immutable source snapshot captured at the historical request instant.
The current Sanity document state is not a substitute for that snapshot.

## Activation gate

Do not add the `43 8 * * *` Vercel schedule until all of these are complete:

- the sidecar schema is deployed;
- a complete source-backed metadata manifest has passed dry-run review;
- the user has approved the exact migration plan SHA and rollback artifact;
- the approved migration has passed post-commit replay and validation;
- the dedicated private forecast Blob store is linked to Production only;
- `FORECAST_BLOB_STORE_ID`, rotating Vercel OIDC, and `CRON_SECRET` have been
  verified without a long-lived Blob-token fallback; and
- `FORECAST_SHADOW_EPOCH_STARTS_ON` and `FORECAST_SHADOW_EPOCH_ENDS_ON` define
  one reviewed, immutable UTC evaluation window no longer than 120 days; and
- a guarded manual invocation has verified private write, activation, retry,
  rollback, and outcome reconciliation behavior.

Keep `FORECAST_SHADOW_ENABLED` unset or set to `false` until those checks pass.
Set it to exactly `true` only in the environment that is ready to run the
private pipeline. The epoch variables are required only after that gate is
enabled. Do not expose any of these variables with a `NEXT_PUBLIC_` prefix.

The eventual Hobby cron may run within Vercel's documented hourly window. The
08:43 UTC schedule keeps that window on the same UTC day. The function duration
is capped at 55 seconds.

Focused local validation does not consume GitHub Actions minutes:

```sh
npx tsx --test tests/forecast-shadow-route.test.ts tests/forecast-shadow-source.test.ts tests/forecast-shadow-pipeline.test.ts
npx tsc --noEmit
```
