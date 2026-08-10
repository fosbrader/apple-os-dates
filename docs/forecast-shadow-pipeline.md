# Daily private forecast pipeline

FR-014 can build and activate one private shadow forecast candidate for each
UTC day. The route is implemented at `/api/cron/forecast-shadow/`. It is
default-off. The server must set `FORECAST_SHADOW_ENABLED=true` before the
route reads configuration, Sanity, or Blob storage. The Vercel cron schedule
remains absent until the historical metadata migration and dedicated private
Blob configuration pass their separate gates. The route has no public forecast
response.

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

1. the source-backed historical-analysis dataset;
2. leakage-safe walk-forward evaluation;
3. public-release candidate comparison;
4. calibrated 50% and 80% public-release intervals;
5. the calibrated next-eligible-prerelease-event model; and
6. one canonical `forecast-artifact/v1` document.

Only included, active cycles with explicit complete chronology can produce a
target. The latest known canonical event is always used. A later GM or public
event is never skipped to reuse an older beta. Each public point records the
exact selected candidate (`platform-stage-median` or
`hierarchical-platform-cadence`). Each next-event point records
`next-event-timing-median`. Unavailable targets and excluded cycles retain typed
reasons; the pipeline does not invent missing dates or chronology.

The artifact binds the exact source, dataset, evaluation, model, calibration,
and pipeline fingerprints. The runtime cap is 256 KiB per daily artifact,
inside the contract's 1 MiB hard limit. This keeps expected storage within the
existing shared free-plan allocation and fails closed if source growth exceeds
the operational budget.

The runtime source contract applies these limits before model execution:

- 512 releases;
- 2,048 first-class events;
- 2,048 compatibility milestones;
- 4,096 combined events and milestones;
- 512 metadata sidecars;
- 2 MiB of canonical source JSON;
- 512 UTF-8 bytes per string;
- 128 evidence IDs per evidence field; and
- 256 UTF-8 bytes per evidence ID.

The full, unsliced Sanity query remains available for migration and offline
planning. The production route uses only the bounded query.

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
- a guarded manual invocation has verified private write, activation, retry,
  and rollback behavior.

Keep `FORECAST_SHADOW_ENABLED` unset or set to `false` until those checks pass.
Set it to exactly `true` only in the environment that is ready to run the
private pipeline. Do not expose this variable with a `NEXT_PUBLIC_` prefix.

The eventual Hobby cron may run within Vercel's documented hourly window. The
08:43 UTC schedule keeps that window on the same UTC day. The function duration
is capped at 55 seconds.

Focused local validation does not consume GitHub Actions minutes:

```sh
npx tsx --test tests/forecast-shadow-route.test.ts tests/forecast-shadow-source.test.ts tests/forecast-shadow-pipeline.test.ts
npx tsc --noEmit
```
