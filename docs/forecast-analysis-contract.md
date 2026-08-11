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

Release lifecycle observations follow the same knowledge-time boundary.
`releaseVersion.statusFirstObservedAt` is projected when present; otherwise
the adapter's `issuedAt` fallback cannot prove historical availability before
the current snapshot. FR-021's
[`historical-release-metadata.md`](historical-release-metadata.md) workflow
adds that optional timestamp only through a revision-guarded explicit-evidence
or conservative immutable-`_createdAt` plan. `_updatedAt` is forbidden because
later editorial changes would leak future knowledge into older backtests.
An explicit timestamp must be on or after every cited source publication/access
day or audit verification day, so newly collected evidence cannot support a
retroactively earlier knowledge claim.

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

- `platform-stage-median` tries same-platform, same-stage outcomes, then
  same-platform pooled outcomes when that stage has fewer than eight samples.
- `seasonal-median` tries same-platform exact **anchor occurrence** calendar
  month and stage (never the first-observed/fold-origin month),
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

Historical analysis v1 intentionally revision-collapses each canonical stage
to its effective appearance before this evaluator receives it. Consequently an
evaluation source snapshot cannot reconstruct hypothetical earlier folds based
on a revision state that was later replaced; such folds remain out of scope
rather than being inferred from revision labels or current knowledge.

## Release-date candidates v1 (FR-009)

`src/lib/release-date-candidates.ts` is a separate pure timing/cadence module.
It consumes a validated, embedded `historical-analysis-dataset/v1` and never
uses the legacy forecast display model, storage, APIs, UI, Sanity, a clock, or
network. Each eligible canonical event is joined to that release's one
source-linked `public-release` lifecycle outcome. Golden Master and next-stage
events are never closure substitutes. The anchor-to-public interval must be
forward, chronology complete, non-superseded/included, and have the public
outcome fact first observed strictly after the anchor fact.

At an anchor's `firstObservedOn` origin, training contains only other targets
whose anchors were known and whose public occurrence and public-outcome fact
were both known by that day. The held-out target is always excluded. The
artifact records source-derived exclusions rather than parsing presentation
labels. It preserves developer and public beta stage identities.

Historical folds use that anchor-observation origin. A production prediction
is available only for a release cycle whose snapshot lifecycle is exactly
`active`; its origin and training cutoff are the embedded source dataset's
`sourceAsOfDate`, provided the anchor itself was known by that cutoff. Released,
superseded, closed, future-observed, and incomplete-chronology anchors fail
closed.

The fixed candidates are same-platform only: an empirical stage median (with
an explicit same-platform pooled fallback) and a hierarchical same-platform
cadence model. Both require at least eight root outcomes. Hierarchy is stage,
then product family, release class, and numeric release position. A nonempty
child posterior is `(n * childMedian + 4 * parentPosterior) / (n + 4)`;
empty children retain the parent and record a fallback. Four is the exported,
fixed prior strength, not a tuned/calibrated parameter. Point days remain
unrounded; `half-up-positive-days/v1` is applied once only to resolve a public
release date.

Candidate selection considers only same-platform historical scores whose
public outcome fact was known by the current origin. Each available candidate
needs eight such prior scores; rank is MAE, median absolute error, absolute
bias, then candidate ID. Sparse comparisons explicitly retain the empirical
baseline as `baseline-default-insufficient-comparison`; they do not claim a
winner. This includes a baseline-only prediction when hierarchy is unavailable.
Insufficient metric rows retain their real score count and `null` metrics;
zero is never fabricated. Without an empirical baseline, no forecast is emitted.
The standalone validator recomputes source linkage, exclusions, folds, models,
selection, scores, dates, ordering, and bound source/config/code/result
fingerprints.

```sh
npm run release-date:validate -- path/to/release-date-candidates.json
```

## Release-date interval calibration v1 (FR-010)

`src/lib/release-date-interval-calibration.ts` is a second, separate pure
artifact. It consumes an already validated `release-date-candidates/v1`
artifact and revalidates/rederives that artifact before using a point forecast.
It does not change storage, APIs, UI, Sanity, or public forecast behavior.

For each historical selected FR-009 forecast, an inner residual is admissible
only if the inner origin is strictly earlier than the outer origin, the inner
public outcome fact was first observed by the outer origin, and the inner
prediction was not trained on its own target. The outer target is never a
residual. A residual is `abs(actualDays - selectedPointDays)` and may retain a
deterministic finite fractional day from the hierarchical point model. No
target result is consulted when selecting its point model or residual pool.

Pools are platform-partitioned. The module prefers the same platform,
public-release target kind, canonical anchor stage, selected candidate, and
resolved cohort/fallback path. A matched hierarchical path binds the actual
held-out product family, release class, and numeric release-position values;
a fallback tier records only fallback and never invents a child value.
Otherwise pooling uses same platform, target kind, and selected candidate.
Both 50% and 80% intervals use precisely the same
selected residual pool. Fewer than eight residuals leaves the point forecast
available and emits typed unavailable intervals; a foreign platform never
rescues a pool.

For confidence `c` in `[.5, .8]`, with `m` sorted residuals, the selected rank
is `min(m, max(1, ceil(c * (m + 1))))`. The rank residual `q` gives numeric
bounds `[pointDays - q, pointDays + q]`. Bounds are inclusive, nested, and
contain the point. Numeric bounds are kept as-is. When exposing calendar
dates, rounding happens once from the anchor: lower is `floor`, the point uses
the FR-009 positive half-up rule, and upper is `ceil`; this is explicitly
outward so no numeric uncertainty is silently narrowed.

The artifact contains calibrated historical folds, complete residual/exclusion
ledgers, interval scores, and overall/platform/family/stage/point-horizon
metrics. Groups with fewer than eight calibrated scores are typed unreportable
rather than represented as zero coverage. `calibrateActiveReleaseDateForecast`
only accepts matching validated source, FR-009 artifact, and calibration
artifact and uses historical residuals visible at `sourceAsOfDate`.

```sh
npm run release-date:interval-calibration:validate -- path/to/release-date-interval-calibration.json
```

## Next eligible prerelease event v1 (FR-011)

`src/lib/next-eligible-prerelease-event.ts` is a separate, private, pure
model for the immediate next verified prerelease appearance. It neither changes
the public forecast nor reads storage, a clock, a network, Sanity, or UI
state. Its only endpoint classes are developer beta, public beta, and release
candidate. Golden Master and public-release appearances are terminal or
ineligible next events; they can never become a target by fallback.

For every canonical prerelease anchor, the model takes exactly the immediate
subsequent event in verified chronology. It never skips an intervening GM or
public event to find a more convenient beta. A same-day group must have unique
verified `sameDayOrder` values; otherwise any affected predecessor fails closed
with `same-day-ambiguity`. A same-calendar-day transition has no measurable
timing outcome and is excluded. The endpoint fact must have been first
observed strictly after the anchor fact.

Historical fold origins are the anchor's `firstObservedOn`. Training requires
both the prior anchor and endpoint occurrence/fact to have been known by that
origin; held-out targets are excluded. At an explicit snapshot cutoff,
`predictNextEligiblePrereleaseEvent` selects the latest verified prerelease
anchor only from an included, complete, active cycle. It first inspects the
latest known event of every kind; if that event is GM, public release,
descriptive, or ambiguously ordered, it does not skip backward to an older
beta. It returns unavailable
when the latest anchor is same-day ambiguous, the next-stage classifier is
weak, or timing has inadequate evidence.

The next-stage classifier uses the same platform and anchor stage when at
least eight examples exist, otherwise the same-platform pooled cohort. It
requires a unique modal endpoint class with a share of at least 60%; five of
eight passes while four of eight and ties fail. Timing is then conditioned on
that *predicted* endpoint class: same platform plus anchor stage and endpoint
class, with a same-platform/end-class fallback, again requiring eight examples.
Platforms are never mixed.

Intervals are residual-calibrated only from strict earlier-origin forecasts
whose endpoint facts were visible at the outer origin. Their pools preserve the
target definition (platform and predicted endpoint class): a stage miss never
contributes its elapsed days as a residual for the predicted class. Both 50% and
80% levels use the same chosen residual pool. Fewer than eight residuals emits
a typed unavailable interval. The artifact embeds its validated historical
source and rederives every target, fold, prediction, residual, and fingerprint
in the standalone validator:

```sh
npm run next-prerelease:validate -- path/to/next-eligible-prerelease-event.json
```

## Forecast artifact and pointer v1 (FR-012)

`src/lib/forecast-artifact-contracts.ts` defines the private-shadow-only,
storage-neutral `forecast-artifact/v1` and `forecast-pointer/v1` boundary. It
binds the historical, evaluation, model, calibration, evidence, cutoff, and
code provenance required to reproduce or reject a forecast. Available targets
must contain a finite median and nested calibrated 50%/80% numeric and calendar
bounds. Unavailable targets cannot contain invented prediction dates.

Artifacts are canonical, bounded, immutable, and content-addressed. The small
mutable pointer uses generation plus previous-pointer fingerprint CAS and keeps
candidate, active, rollback, and reconciliation-root identities separate.
Every v1 pointer remains private (`publicReadEnabled: false`). See
`docs/forecast-artifact-contract.md` for the example artifact construction,
transition table, reconciliation reservation, and rollback rules.

## Prospective scoring and private shadow health v1 (FR-015)

`src/lib/forecast-shadow-scoring.ts` scores only immutable, available
predictions. It derives outcomes from validated historical dataset rows plus an
exact evidence-keyed observation-time binding. It does not accept arbitrary
caller-authored outcome records. Public-release and next-eligible-event
identity remain separate. Same-day ambiguity, missing evidence, supersession,
retraction, and next-stage mismatches become explicit data gaps rather than
model errors.

The scorer binds and evaluates the exact upstream selected point. It does not
silently call the FR-009 hierarchical smoothed-median candidate a raw median.
Scores and reconciliation snapshots are canonical content-addressed artifacts;
the reconciliation root advances through the FR-012 atomic pointer transition.
Same logical-run retries are byte-idempotent. Outcome corrections replace the
active score and retain an immutable audit row.

The free-plan path reads one self-contained prior root and fetches an old
forecast only for a new or corrected score transition. A fixed 120-day epoch
admits one canonical run per scheduled day and stops at predeclared forecast,
target, audit, or byte limits. Rollover requires operator review.

Private health output separates operations from statistical reportability.
Forecast-state counts partition exactly. Model metrics give equal weight to
each unique realized source event and stay unavailable below eight unique
events. The production schedule must remain disabled until forecast artifacts
also store immutable origin-time current-heuristic and simple-baseline
predictions. See `docs/forecast-shadow-scoring.md` for the complete eligibility,
persistence, rollover, and integration contract.
