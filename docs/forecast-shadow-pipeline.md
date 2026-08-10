# Daily private forecast pipeline

FR-014 builds and activates one private shadow forecast candidate for each UTC
day. The route is implemented at `/api/cron/forecast-shadow/`, but the Vercel
cron schedule remains intentionally absent until the historical metadata
migration and dedicated private Blob configuration pass their separate gates.
The route has no public forecast response.

## Input and model execution

After `CRON_SECRET` authentication, the route reads one uncached Sanity
snapshot with the published perspective. The source read has an eight-second
attempt timeout and at most one bounded retry. It supplies the scheduled UTC
day and request instant explicitly to the pure observation adapter. The
pipeline then builds and validates, in order:

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
inside the contract's 1 MiB hard limit. This keeps expected storage comfortably
within the existing shared free-plan allocation and fails closed if source
growth exceeds the operational budget. Raw source arrays are also bounded at
2,048 releases, 8,192 events or compatibility milestones, and 2,048 metadata
sidecars before model execution.

## Idempotency and overlap

The mutable pointer is the cross-instance lock. The pipeline uses only exact
reads, immutable content-addressed writes, and generation plus fingerprint CAS:

1. initialize the pointer if it does not exist;
2. write an immutable candidate and point to it;
3. atomically activate the candidate; and
4. retain the prior active artifact as rollback.

A same-day retry returns the already-active artifact without fetching Sanity or
writing Blob data. An interrupted run resumes a same-day candidate. A stale
candidate can be replaced, but a future-dated active or candidate artifact is a
storage-integrity failure. A local in-process guard rejects duplicate work in
one function instance; CAS resolves overlap across instances. Any build, write,
or activation failure leaves the prior active pointer and immutable artifacts
readable.

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

The eventual Hobby cron may run within Vercel's documented hourly window. The
08:43 UTC schedule keeps that window on the same UTC day. The function duration
is capped at 55 seconds.

Focused local validation does not consume GitHub Actions minutes:

```sh
npx tsx --test tests/forecast-shadow-route.test.ts tests/forecast-shadow-pipeline.test.ts
npx tsc --noEmit
```
