# Forecast runtime cohort

FR-014 defines a standalone, deterministic capacity boundary for the private
daily shadow forecast. It is not wired into the forecast pipeline yet.

## Fixed v1 limits

The selector in `src/lib/forecast-runtime-cohort.ts` uses one non-configurable
v1 envelope:

- Select every included active release, up to 12.
- Permit active releases from at most six platforms.
- Require the eight most-recent eligible completed releases for each active
  platform.
- Consider up to four additional completed releases per active platform by
  rank, then platform ID, in deterministic round-robin order.
- Select at most 768 observations. An observation is one raw first-class
  event, one raw compatibility milestone, or one known public lifecycle
  outcome.

Raw events that the observation adapter later excludes still count. This keeps
withdrawals, revisions, and other source work inside the capacity envelope.
The selector never removes individual records from a selected release. If the
active releases and mandatory history exceed 768, selection stops with an
error. An optional release that does not fit is excluded as a whole and gets a
machine-readable `selected-observation-cap` reason.

## Historical truth boundary

The selector accepts a validated `HistoricalAnalysisDatasetV1` and the exact
`PublishedHistoricalReleaseSource` used to build it. Before selection, it:

1. validates the historical dataset;
2. requires one release and metadata join for every release ID;
3. requires every raw event and compatibility milestone to join a release;
4. rebuilds the historical dataset from the source at the dataset's declared
   cutoff and issuance instant; and
5. requires exact deterministic equality with the supplied dataset.

Completed cycles are eligible only when they are included, released, have
complete chronology coverage, retain at least one canonical event, and have a
public lifecycle outcome. Ranking uses only public outcome occurrence date,
public outcome observation date, and stable release ID. Metadata position,
display versions, labels, array order, and inferred history never rank cycles.

## Selection artifact and projection

`forecast-runtime-cohort-selection/v1` records the fixed config, source dataset
fingerprint, selected release IDs, selected cycle roles and history ranks,
active platforms, per-platform counts, observation count, exclusions, and
code/config/result fingerprints. Its runtime validator rejects unexpected
properties and recomputes all internal counts and fingerprints.

`projectPublishedHistoricalReleaseSourceForRuntimeCohort` rebuilds the full
dataset, rederives the authoritative selection, and requires exact equality
with the supplied selection artifact, including its result fingerprint. A
structurally valid or correctly re-signed artifact cannot select different
active or historical releases.

The helper then filters releases, raw events, compatibility milestones, and
metadata by the exact selected release IDs. A selected release is projected as
a whole. It rebuilds and validates the projected historical dataset, then
requires its analytical rows and inclusion ledger to equal the selected subset
of the full dataset. This rejects cross-boundary identity, replacement, or
deduplication changes that would make an excluded raw event canonical after its
conflicting release was removed. Active cycles and their original adapter
exclusions remain present.

## Local verification

Run the focused tests:

```sh
npx tsx --test tests/forecast-runtime-cohort.test.ts
```

Run the observational capacity benchmark:

```sh
npx tsx scripts/benchmark-forecast-runtime-cohort.ts
```

The benchmark reports phase elapsed times, selected observations, and artifact
size. It intentionally has no wall-clock pass/fail threshold because developer
machines and hosted runtimes differ.

Pipeline integration remains a separate reviewed change. It must apply the
projection before walk-forward evaluation and model fitting, preserve the exact
instant observation cutoff, and measure the full daily route within the Vercel
function budget.
