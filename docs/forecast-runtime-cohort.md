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
- Serialize the complete selection artifact in at most 128 KiB, including all
  cycle exclusions and reasons.
- Limit every serialized release and platform identity to 512 UTF-8 bytes.
  Identities cannot have leading or trailing whitespace, C0/C1 controls,
  Unicode line separators, or bidirectional-formatting controls.

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
2. calculates an order-invariant SHA-256 fingerprint over every raw field that
   the runtime projection can retain;
3. requires every provided lifecycle, event, and milestone observation instant
   to be canonical UTC and no later than the dataset issuance instant;
4. requires one release and metadata join for every release ID;
5. requires every raw event and compatibility milestone to join a release;
6. rebuilds the historical dataset from the source at the dataset's declared
   cutoff and issuance instant; and
7. requires exact deterministic equality with the supplied dataset.

The raw fingerprint and instant checks happen before the adapter reduces an
instant to a calendar day. A source change from an 08:00 observation to a 23:59
observation cannot retain the same selection when the declared issuance was
12:43, even though both values have the same UTC day.

Sanity returns `null` for some absent optional scalar fields while typed local
fixtures can omit the same field. Raw fingerprint canonicalization treats
`null` and omission as the same absence for object properties. Every non-null
projected value remains fingerprint-bound. The historical dataset fingerprint
continues to bind the adapter's analytical interpretation independently.

The selection validator independently requires `sourceDataset.issuedAt` to be
canonical UTC: parsing it and applying `Date.toISOString()` must return the
exact original value. Equivalent offset spellings are rejected.

Completed cycles are eligible only when they are included, released, have
complete chronology coverage, retain at least one canonical event, and have a
public lifecycle outcome. Ranking uses only public outcome occurrence date,
public outcome observation date, and stable release ID. Metadata position,
display versions, labels, array order, and inferred history never rank cycles.

## Selection artifact and projection

`forecast-runtime-cohort-selection/v1` records the fixed config, source dataset
and raw-source fingerprints, selected release IDs, selected cycle roles and
history ranks, active platforms, per-platform counts, observation count,
exclusions, and code/config/result fingerprints. Its runtime validator rejects
unexpected properties, recomputes all internal counts and fingerprints, and
rejects a serialized artifact larger than 128 KiB.

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

The 768-observation cap is a downstream model-work cap only. It does not replace
the pipeline's existing upstream limits: 512 releases, 2,048 raw events and
milestones, 2 MiB of serialized source input, and the exact issuance-instant
cutoff. Integration must retain all of those stricter fetch and normalization
guards before it calls this selector.

Integration also has an explicit source-boundary dependency. Call the shared
`validatePublishedHistoricalReleaseSource` normalizer before building the full
dataset and before selection or projection. That shared boundary owns broad
array limits, field limits, null handling, and source-shape validation. This
standalone cohort module intentionally does not duplicate that complete
normalizer; its checks protect the selection and projection contracts after the
shared source boundary has accepted the input.
