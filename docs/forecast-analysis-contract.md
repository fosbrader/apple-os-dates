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
