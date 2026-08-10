# Private forecast Blob storage

FR-013 connects the storage-neutral `forecast-artifact/v1` contract to one
dedicated private Vercel Blob store. It does not provision a store, change
Vercel configuration, run a forecast, or publish forecast data.

## Runtime boundary

The adapter starts only when all these conditions are true:

- `VERCEL_ENV` is exactly `production`.
- `FORECAST_BLOB_STORE_ID` identifies the dedicated forecast store.
- Vercel supplies OIDC in the current Function request context or environment.

The adapter calls `getVercelOidcToken()` for every SDK request. It does not
cache that rotating value. It then explicitly passes both the returned token
and `FORECAST_BLOB_STORE_ID`. A missing or invalid OIDC value fails before the
Blob SDK runs, even if `BLOB_READ_WRITE_TOKEN` exists. The adapter does not
read `BLOB_STORE_ID`, and it does not import submission or moderation storage.
Preview and local calls fail before a Blob request. Provisioning must keep the
store private and Production-only. The store uses the project's existing Blob
plan allocation; FR-013 adds no paid service.

## Runtime budget and SDK behavior

Create one adapter per forecast Function invocation, close to the start of its
storage work. The instance has one 45-second wall-clock budget. Each OIDC plus
Blob request receives an abort signal capped at 8 seconds and by the remaining
instance budget. Adapter read and list retries are limited to three attempts
inside that same budget. This leaves at least 10 seconds in the planned
55-second Function for response handling and shutdown.

The locked SDK behavior was checked directly before this adapter was written:

- [`@vercel/oidc` 3.8 documents](https://github.com/vercel/vercel/blob/main/packages/oidc/src/get-vercel-oidc-token-with-refresh.ts)
  that the Function token can come from request context and must not be cached.
- [`@vercel/blob` 2.7 command options](https://github.com/vercel/storage/blob/main/packages/blob/src/helpers.ts)
  accept explicit `oidcToken`, `storeId`, and `abortSignal` values.
- [`@vercel/blob` 2.7 control-plane requests](https://github.com/vercel/storage/blob/main/packages/blob/src/api.ts)
  use internal `async-retry` attempts. All of those attempts share the one
  adapter abort signal, so their combined time stays inside the 8-second cap.
  The adapter does not change the SDK's process-wide retry environment because
  that would also change unrelated submission storage behavior.
- [`get()` in `@vercel/blob` 2.7](https://github.com/vercel/storage/blob/main/packages/blob/src/get.ts)
  returns generic `BlobError` HTTP messages rather than the control-plane error
  subclasses. The adapter treats 401/403 as authorization failures, 408/425/
  429/5xx as transient, and only recognized network `TypeError` shapes as
  transient. Other `TypeError` values fail immediately. Authorization,
  timeout, and retry-exhaustion errors do not include OIDC values, credential-
  provider details, or Blob paths.

## Exact objects

The adapter accepts only these paths:

```text
forecast/artifacts/<sha256>.json
forecast/reconciliation/<sha256>.json
forecast/scores/<sha256>.json
forecast/pointers/private-shadow.json
```

Artifact writes validate canonical `forecast-artifact/v1` JSON, its content
identity, and the 1 MiB limit before upload. Reconciliation objects bind their
raw bytes to the path digest. Score objects use the same raw digest binding and
a separate 64 KiB cap. The adapter does not list score objects; FR-015 must read
an exact score digest referenced by its typed reconciliation index. Immutable
writes set `allowOverwrite: false`. A collision is successful only when one
uncached exact read returns identical bytes; different bytes fail without
changing the stored object.

Pointer reads are private, uncached, exact, and limited to 16 KiB. Initial
creation uses `allowOverwrite: false`. An update first validates the current
pointer generation and fingerprint, then writes with the freshly read Blob
ETag in `ifMatch`. After a precondition response, one uncached exact read first
checks whether the intended bytes were committed despite a lost response. It
reports a mismatch only when different bytes won the race. The typed retry
helper sends every attempt through `commitForecastArtifactTransition`. That
FR-012 gate validates every exact candidate, active, rollback, and optional
reconciliation reference before CAS. Missing, corrupt, or incompatible
references fail without pointer mutation. The helper retries only a proven
stale CAS and never searches by a mutable label.

Explicit transient read and list failures use at most three adapter attempts
with bounded backoff. Authorization, validation, size, timeout, mutable write,
and immutable-collision errors are not blindly retried. If a write response is
ambiguous, the adapter reads the exact object once. It reports success only
when the stored bytes equal the intended conditional write; otherwise it
returns a mismatch or fails closed. Only a proven precondition conflict enters
the bounded read, full FR-012 validation, rebuild, and CAS helper.

Artifact listing is a constrained, paginated helper fixed to the immutable
artifact prefix. The storage contract and transition path use exact reads and
never list.

## Provisioning gate

Provisioning remains an operator action after code review. Before enabling a
forecast job:

1. Create or select a dedicated private Blob store within the existing plan.
2. Link it only to the Production environment.
3. Set `FORECAST_BLOB_STORE_ID` as a sensitive Production-only variable.
4. Confirm the runtime receives Vercel OIDC and no long-lived Blob token.
5. Run one guarded shadow write and verify private access, immutable collision,
   pointer CAS, and rollback behavior.

Do not provision or change Production while validating this module locally.
