# Apple iOS and iPadOS 26 maintenance research batch

## Result

`apple-ios-ipados-26-maintenance.json` is a source-backed enrichment batch for
the eight thin iOS/iPadOS 26 maintenance records that were already present in
the audited catalog but did not yet qualify as full release articles:

- iOS 26.0.1, 26.1, 26.2, 26.2.1, and 26.3
- iPadOS 26.1, 26.2, and 26.3

The bundle contains eight original-synthesis version articles, eight
public-event summaries, 46 documented structured changes, seven first-party
Apple sources, and 102 counted citations. It does not change release identity,
dates, or chronology.

## Editorial method

- All prose is original synthesis rather than copied release-note text.
- Every factual overview paragraph and change occurrence has a claim-level
  citation and locator.
- Consumer changes remain platform-specific; iPhone-only corrections are not
  projected onto iPadOS.
- Security entries group related advisory surfaces into reader-facing topics
  rather than reproducing every CVE description.
- Apple’s iOS 26.3 dyld language is preserved narrowly: the advisory describes
  an attack against versions before iOS 26, so this batch does not claim that
  iOS 26.3 itself was exploited.
- All records passed final review and are `editoriallyVerified`, `approved`,
  and indexable, with the review recorded at `2026-07-30T04:12:05Z`.
- No undocumented claim, build number, or beta attribution was invented.

## Verified Apple sources

The following human-readable first-party pages were checked on 2026-07-29:

- [About iOS 26 Updates](https://support.apple.com/en-us/123075)
- [About iPadOS 26 Updates](https://support.apple.com/en-us/123074)
- [Security content of iOS 26.0.1 and iPadOS 26.0.1](https://support.apple.com/en-us/125326)
- [Security content of iOS 26.1 and iPadOS 26.1](https://support.apple.com/en-us/125632)
- [Security content of iOS 26.2 and iPadOS 26.2](https://support.apple.com/en-us/125884)
- [Security content of iOS 26.3 and iPadOS 26.3](https://support.apple.com/en-us/126346)
- [Apple introduces new AirTag with expanded range and improved findability](https://www.apple.com/newsroom/2026/01/apple-introduces-new-airtag-with-expanded-range-and-improved-findability/)

The cumulative Apple Support pages are living documents. Version locators tie
claims to the relevant section; page-level publication dates are not treated
as the historical date of every section.

## Coverage and evidence boundaries

| Record | Public date in audited data | Structured changes |
| --- | --- | ---: |
| iOS 26.0.1 | 2025-09-29 | 6 |
| iOS 26.1 | 2025-11-03 | 7 |
| iPadOS 26.1 | 2025-11-03 | 6 |
| iOS 26.2 | 2025-12-12 | 8 |
| iPadOS 26.2 | 2025-12-12 | 7 |
| iOS 26.2.1 | 2026-01-26 | 1 |
| iOS 26.3 | 2026-02-11 | 6 |
| iPadOS 26.3 | 2026-02-11 | 5 |

Apple’s current cumulative notes also contain maintenance versions absent from
the audited local catalog, including iPadOS 26.0.1 and 26.2.1 and later 26.x
patches on both platforms. This enrichment batch intentionally does not create
missing release-version identities; those require the separately guarded
missing-version ingestion path.

iOS and iPadOS 26.3 have no itemized consumer feature list. Their pages remain
data-rich through the first-party security record without inventing consumer
changes. iOS 26.2.1 likewise records the only itemized software delta Apple
published—second-generation AirTag compatibility—and labels the remaining bug
fixes as unspecified.

## Validation state

- JSON generation: passed.
- Repository research validation: passed.
- Durable event targeting: all eight events use
  `{releaseVersionId, routeAlias: "public"}`.
- Change identity: 46 locally unique keys, with shared iOS/iPadOS definitions
  kept exactly consistent.
- Builds: none.
- Guarded production plan:
  - 44 creates: five sources and 39 reusable release changes
  - 18 revision-guarded patches: eight versions, eight public events, and two
    existing source metadata records
  - 81,587-byte mutation payload, 2.1% of the guarded limit
  - exact plan SHA:
    `3685f15bc4e69c4246502b1fade308e1780ceb450a3bf5af40f0f831de4153d0`
  - zero-residual transaction: `F0eE6eK5XyVXtlnaoxs7NU`
- Production apply: complete and zero-residual verified.

The generated JSON was promoted only after final source, prose, event-mapping,
and mutation-plan review.
