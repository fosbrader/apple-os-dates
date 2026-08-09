# Forecast and historical-analysis contract v1

`src/lib/forecast-analysis-contracts.ts` defines a storage-independent input
contract for future forecast and historical-analysis adapters. Its version is
`forecast-analysis/v1`. It does not change the current forecast UI, Sanity
schema, legacy milestone projection, or persistence model.

## Canonical stage

An adapter must supply a normalized `channel` and, for developer beta, public
beta, and release candidate appearances, a positive channel-local `sequence`.
The canonical stage is derived only from those values:

- `developerBeta` + `2` becomes `developer-beta:2`.
- `publicBeta` + `2` becomes `public-beta:2`; it is never the developer-beta
  stage, even if both appearances share a date or build.
- A revision has the same stage as its original channel and sequence.
- A revision names its direct predecessor with `revisionOfId`. A valid chain
  resolves to one effective appearance for that release and stage.
- Golden Master and public release have their own terminal stages.

`displayLabel` and `note` are descriptive fields. They must not establish a
stage, supply a missing sequence, or break ties. Security response, recovery,
and `other` events remain descriptive timeline metadata and never form
forecast observations.

## Ordering and eligibility

`sameDayOrder` is optional evidence. If it is absent for either event, their
same-day relative order is unknown. Consumers must not invent that order from
labels, channels, sequences, or source array position. Even when identity
precedence is verified, two date-only same-day appearances do not form a
measurable timing outcome. `forecastIntervalOutcome` returns
`same-calendar-day` instead of zero days.

Every event references one declared release cycle. The release lifecycle is
part of the contract, not inferred from event text. A superseded cycle never
enters a shipped-release cohort after that transition was both effective and
known. For an earlier cutoff, a later released or superseded transition
resolves to the pre-transition `active` state. A non-active lifecycle without
both `statusEffectiveOn` and `statusFirstObservedOn` fails closed instead of
leaking current knowledge into an older backtest.

`dataCutoff` is inclusive. An event is eligible only when both `occurredOn`
and `firstObservedOn` are on or before the cutoff, its availability is
`available`, and it has a canonical forecast stage. This excludes future
events and facts learned after a historical as-of date, preventing later
corrections from leaking into a backtest. Withdrawn, replaced, and superseded
events are also excluded from forecast and historical-analysis samples.

`eligibleForecastEvents` collapses valid revision chains and returns a stable
serialization order. Its same-day tie-breakers do not establish chronology.

Validate every adapter output with `validateForecastAnalysisDataset` before
analysis, then use `eligibleForecastEvents` rather than filtering on display
text or raw dates directly.

## Canonical release-observation adapter

`src/lib/release-observation-adapter.ts` is the sole pure projection boundary
for forecast and historical-analysis inputs. It accepts release-cycle records,
first-class events, compatibility milestones, and explicit `asOfDate` and
`issuedAt` values. It has no Sanity client, UI, network, clock, or persistence
dependency.

The adapter returns a validated, revision-collapsed v1 dataset; effective
canonical events; released outcomes; a deterministic inclusion ledger; and
machine-readable exclusions. Evidence IDs use stable event identities or
legacy source keys. Display labels and notes are retained only as descriptive
context and never establish an ID, channel, sequence, stage, overlay, or tie.

Only an eligible, effective first-class event can overlay an explicitly
matching `legacySourceId`. Future, unobserved, unavailable, invalid, ambiguous,
or replacement-invalid events cannot suppress good compatibility evidence. An
unlinked duplicate stage is excluded as ambiguous rather than guessed. A
revision or replacement must name exactly one unique same-release, same-stage
predecessor. The terminal event is retained and predecessors are ledgered as
replaced. A verified `closesReleaseCycle` Golden Master can form a closure
outcome when a public-release outcome is not yet available.

`firstObservedAt` is converted to a UTC calendar day and must be on or before
the inclusive `asOfDate`, independently of the appearance date. Only when a
legacy or older first-class record omits that field does the adapter use the
explicit `issuedAt` day as a conservative lower bound; a malformed supplied
timestamp is excluded. Invalid record dates, missing or duplicate stable IDs,
ambiguous stages, contradictory release-status dates, and insufficient
replacement evidence all fail closed with a ledger exclusion. Invalid global
`asOfDate` or `issuedAt` values throw `ReleaseObservationInputError` before any
result is produced, preserving the result type's validated-dataset guarantee.

## Historical-analysis dataset v1

`src/lib/historical-analysis-dataset.ts` builds the versioned
`historical-analysis-dataset/v1` product from a validated
`ReleaseObservationAdapterResult` plus a separately sourced `releaseId` metadata
sidecar. The sidecar requires stable `platformId`, `productFamilyId`, closed v1
`releaseClass` (`major`, `minor`, or `patch`), `releasePosition`, and
`releaseCycleId`. The builder never parses display versions, labels, notes, or
source-array order to supply them.

Each metadata assertion and every derived row retains non-empty stable evidence
IDs. Output includes release-cycle rows, adapter-collapsed canonical-event rows,
lifecycle outcomes, stage intervals, the inclusion/exclusion ledger, provenance,
and SHA-256 input/code/dataset fingerprints. The dataset fingerprint binds the
canonical row body and the input/code fingerprints, so changing any of the
three cannot be masked by recomputing only a body hash. Input normalization
removes presentation-only fields and sorts logical arrays, so equivalent input
ordering produces identical serialized output and fingerprints.

Chronology coverage is an explicit sourced `complete` or `unknown` state. The
unknown reasons are `not-reviewed`, `source-coverage-incomplete`, and
`same-day-order-unknown`. The builder only reduces coverage: same-day entries
without independently verified unique `sameDayOrder` values result in unknown
coverage. A public-release event and its matching same-day lifecycle outcome
are one closure observation, not unordered duplicate timeline facts. Golden
Master closure is deliberately fail-closed in historical-analysis dataset v1:
the current adapter projection does not carry source-bound closure proof, so GM
outcomes are not analytically admitted until a future contract preserves it.
Intervals are unavailable with machine-readable reasons rather than inferred;
same-calendar-day intervals are never zero days. Canonical-event rows must
include their exact `eventId` in `sourceEvidenceIds`, not an unrelated non-empty
evidence reference.

Superseded cycles remain only as excluded release-cycle and ledger rows. Future,
withdrawn, replaced, superseded, and revision-predecessor observations stay
excluded through the adapter ledger and cannot re-enter the dataset. Developer
and public betas remain separate because the builder uses canonical `stage` and
`channel`, never descriptive text.

Validate a serialized dataset without rebuilding it:

```sh
npm run historical:validate -- path/to/historical-analysis-dataset.json
```

`validateHistoricalAnalysisInput` rejects stale adapter/forecast contracts,
extra or missing metadata, malformed ISO issuance instants, invalid sidecar
values, and incomplete or extra lifecycle outcomes before a build.
`validateHistoricalAnalysisDataset` validates every row, ordering,
endpoint/interval relation, source linkage, and fingerprint.

## Walk-forward evaluation v1

`src/lib/walk-forward-evaluation.ts` is a separate, pure
`walk-forward-evaluation/v1` artifact builder. It consumes only a validated
`historical-analysis-dataset/v1`; it does not read storage, use the clock,
make network requests, or change the forecast UI/API.

Each eligible stage interval becomes a timing target. A fold origin is exactly
the anchor event's `firstObservedOn`, while the timing target remains the
verified interval days. The endpoint must be source-linked and first observed
strictly after that origin. Training samples must have an anchor known at the
fold origin, an endpoint that occurred by it, and an endpoint fact first
observed by it. The held-out target is always excluded.

The two v1 baselines never cross platforms:

- `platform-stage-median` uses same-platform, same-stage outcomes.
- `seasonal-median` tries same-platform exact anchor calendar month and stage,
  then same-platform stage, then same-platform pooled outcomes.

Every selected cohort needs at least eight outcomes. Otherwise the artifact
records a typed `no-forecast`, never an invented fallback. Horizon buckets are
reporting labels only and cannot influence training or predictions. The output
records every target/exclusion, fold cohort IDs, prediction, score, group
metrics, and fingerprints. Group metrics are reportable only at eight scores;
MAE, median absolute error, signed bias, and optional inclusive 50/80 empirical
coverage are emitted deterministically. Empirical intervals are opt-in on the
config and are evaluation rows only, not a calibration artifact or service.

The evaluation artifact embeds its historical source dataset so the standalone
validator can recompute folds, leakage rules, cohort selection, scores,
metrics, source evidence, and fingerprints from one file:

```sh
npm run walk-forward:validate -- path/to/walk-forward-evaluation.json
```

This FR-008 contract deliberately does not introduce a hierarchical candidate
model, calibration generation/storage, API, or UI.
