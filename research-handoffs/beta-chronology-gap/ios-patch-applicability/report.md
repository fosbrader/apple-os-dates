# iOS patch public-beta applicability audit

Batch: `ios-patch-applicability-2026-07-31`  
Research cutoff: 2026-07-31  
Scope: exactly 27 production iOS parents

## Outcome

- **Three proposed identities:** iOS 13.3.1 Public Beta 1 (2019-12-18), Public Beta 2 (2020-01-14), and Public Beta 3 (2020-01-22).
- **Evidence-backed not applicable:** iOS 14.8. Two independent contemporary publisher families explicitly report that it arrived without beta testing.
- **Not established because evidence conflicts:** iOS 8.4.1. Developer-only reporting is strong, but combined-product public-program wording and ambiguous approved-tester wording make a no-public-beta conclusion unsafe.
- **Audited with no positive identity located, still reversible (24):** `9.0.1`, `9.0.2`, `9.3.1`, `9.3.5`, `10.3.1`, `11.0.1`, `11.0.2`, `11.0.3`, `11.1.1`, `11.1.2`, `11.2.1`, `12.0.1`, `12.3.1`, `12.4.1`, `13.1.1`, `13.1.2`, `13.1.3`, `13.4.1`, `13.5.1`, `14.0.1`, `14.5.1`, `14.7.1`, `26.0.1`, `26.2.1`.

## Evidence and chronology rules

Each proposed identity has two independent publisher families supporting the exact iOS version, public audience, displayed public ordinal, and Pacific-normalized appearance date. No developer ordinal, build number, or paired-platform event was used to manufacture a public identity.

The 24 reversible rows are deliberately not described as “no beta.” A scoped search that finds no qualifying source, a stable release note, and the absence of a production developer-beta event do not prove historical absence.

For iOS 13.3.1, the two source lineages for each appearance are:

| Public identity | Pacific date | Independent publisher families |
| --- | --- | --- |
| Public Beta 1 | 2019-12-18 | BGR; Cult of Mac |
| Public Beta 2 | 2020-01-14 | 9to5Mac; Forbes |
| Public Beta 3 | 2020-01-22 | 9to5Mac; Kobonemi |

Kobonemi reports Public Beta 3 on January 23 in Japan; 9to5Mac's contemporaneous Pacific timestamp and same-day release statement establish January 22 in `America/Los_Angeles`.

## Production reconciliation

The fresh Sanity query used `perspective: "published"` and `useCdn: false` at 2026-07-31T08:05:56.018Z. All 27 parent releaseVersion documents exist. Production contained 2068 release events overall, 27 scoped events, and zero scoped public-beta events. All three proposed route and full identities had zero matches.

## Integrity and handoff

Raw pages and mechanically selected locators are frozen under `tmp/research-evidence/beta-chronology-gap/ios-patch-applicability`; committed hashes are in `raw-evidence-locks.json`. The exact 27 source coverage rows are copied into `scoped-coverage-snapshot.json`, so this packet does not depend on later shared-matrix edits.

The packet is research-only. A separate reviewer must author `independent-review.json`. No IDs were created, no Sanity mutation occurred, no pages were built, and nothing was published or deployed.
