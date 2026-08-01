# watchOS major-cycle public-beta chronology, watchOS 7–26

## Outcome

This packet identifies **33 defensible public-beta appearance candidates** across the assigned watchOS major cycles:

| Major cycle | Defensible appearances | Proposed public labels |
| --- | ---: | --- |
| watchOS 7.0 | 5 | 1–5 |
| watchOS 8.0 | 6 | 1, 2, 4, 6, 7, 8 |
| watchOS 9.0 | 5 | 1–5 |
| watchOS 10.0 | 6 | 1–6 |
| watchOS 11.0 | 5 | 1–5 |
| watchOS 26.0 | 6 | 1–6 |

The total is **33, not the initially expected 34**. The removed row is the claimed watchOS 8 Public Beta 5 appearance on August 12, 2021.

## Why the watchOS 8 count changed

A later iCulture timeline lists Public Beta 5 on August 12. Contemporary evidence does not support it:

- MacRumors’ August archive records the August 11 public wave as iOS/iPadOS-only and next records a watchOS public update on August 18.
- 9to5Mac’s August 11 watchOS Beta 5 report says public testers still had to wait.
- The same cycle’s surviving public labels are inconsistent across publishers, so developer numbers were not transferred into public identities.

The August 12 row is retained in `conflicts.json` as `notProposed`, together with the exact evidence needed to reverse that decision.

## Applicability boundary

Apple’s watchOS 7 announcement says this was the first watchOS release offered through the public beta program. That makes pre-watchOS 7 zeros historically correct rather than missing data. This packet therefore begins at watchOS 7.0 and does not manufacture earlier public-beta events.

## Evidence quality

All 33 proposed appearances have two publisher lineages supporting that a public-channel appearance occurred. Exact ordinal quality is narrower:

- Most labels are explicit in at least two retained lineages.
- watchOS 26 Public Beta 6 has one explicit-ordinal lineage plus a second lineage that confirms the public appearance/date without assigning the public ordinal.
- watchOS 8 Public Beta 4 and watchOS 26 Public Betas 4 and 5 remain conflict-blocked.

No build was copied from a developer seed or inferred through payload equivalence. Source pages may report builds, but this candidate packet intentionally leaves build fields absent.

## Production reconciliation

The read-only published-production snapshot was captured at 2026-07-31T03:05:12.717Z.

- Total published `releaseEvent` documents: 2068
- Published watchOS `publicBeta` events across all versions: 0
- Published events in the six scoped release versions: 59
- Published scoped `publicBeta` events: 0
- Exact route checks run: 34
- Exact candidate matches found: 0

The snapshot checked the original 34 expected aliases, including the now-rejected watchOS 8 Public Beta 5 route. Production absence is confirmed; absence alone never proves an event existed.

## Promotion gates

This is a research handoff, not an ingestion manifest.

1. An independent reviewer must reproduce the evidence locators and adjudicate the material conflicts.
2. The one remaining one-lineage ordinal case needs another exact-ordinal source or an explicit evidence-gate decision.
3. Exact production queries must be rerun immediately before any separately authorized write.
4. No candidate may be published merely because its proposed route is empty.

## Safety and copyright

No Sanity mutation, stable event-ID creation, code deployment, or publication occurred. The report is original synthesis. Source pages are referenced with publisher credit and retained locally only as evidence captures; no article text is republished as release-note copy.
