# Private forecast Blob storage

FR-013 connects the storage-neutral `forecast-artifact/v1` contract to one
dedicated private Vercel Blob store. It does not provision a store, change
Vercel configuration, run a forecast, or publish forecast data.

## Runtime boundary

The adapter starts only when all these conditions are true:

- `VERCEL_ENV` is exactly `production`.
- `FORECAST_BLOB_STORE_ID` identifies the dedicated forecast store.
- Vercel supplied `VERCEL_OIDC_TOKEN` for the running function.

The adapter passes the forecast store ID and OIDC token on every operation. It
does not read `BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN`, and it does not import
submission or moderation storage. Preview and local calls fail before a Blob
request. Provisioning must keep the store private and Production-only. The
store uses the project's existing Blob plan allocation; FR-013 adds no paid
service.

## Exact objects

The adapter accepts only these paths:

```text
forecast/artifacts/<sha256>.json
forecast/reconciliation/<sha256>.json
forecast/pointers/private-shadow.json
```

Artifact writes validate canonical `forecast-artifact/v1` JSON, its content
identity, and the 1 MiB limit before upload. Reconciliation objects bind their
raw bytes to the path digest. Immutable writes set `allowOverwrite: false`. A
collision is successful only when one uncached exact read returns identical
bytes; different bytes fail without changing the stored object.

Pointer reads are private, uncached, exact, and limited to 16 KiB. Initial
creation uses `allowOverwrite: false`. An update first validates the current
pointer generation and fingerprint, then writes with the freshly read Blob
ETag in `ifMatch`. A precondition failure is a mismatch, never a successful
write. The typed retry helper can rebuild a transition after at most three
real conflicts. A rollback validates the exact artifact named by the pointer
before it attempts CAS; it never searches by a mutable label.

Explicit transient read and list failures use at most three adapter attempts
with bounded backoff. Authorization, validation, size, transport, mutable
write, and immutable-collision errors are not blindly retried. If a write
response is ambiguous, the adapter reads the exact object once. It reports
success only when the stored bytes equal the intended conditional write;
otherwise it returns a mismatch or fails closed. Only a proven precondition
conflict enters the bounded read, rebuild, and CAS helper.

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
