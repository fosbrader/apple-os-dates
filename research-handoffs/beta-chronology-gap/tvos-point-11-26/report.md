# tvOS point-release public-beta chronology audit

Batch: `beta-chronology-gap-tvos-point-11-26`  
Research cutoff: 2026-07-31  
Scope: exactly 32 production tvOS parents

## Outcome

- **116 exact publisher-displayed appearances enumerated.**
- **73 supportable candidates** have two independent publisher families and a resolved `America/Los_Angeles` date.
- **43 exact appearances remain blocked** for one lineage or an unresolved date conflict and are retained as reversible not-proposed records.
- **15 explicit skipped/unqualified-ordinal findings** prevent developer cadence or paired-platform releases from filling gaps.
- **5 source conflicts** are preserved rather than silently normalized.

| tvOS version | Exact appearances | Supportable | Blocked | Publisher-displayed public ordinals |
| --- | ---: | ---: | ---: | --- |
| 11.1 | 4 | 4 | 0 | 1, 2, 3, 4 |
| 11.2 | 5 | 5 | 0 | 1, 2, 3, 4, 5 |
| 11.2.5 | 5 | 3 | 2 | 1, 2, 3, 4, 6 |
| 11.3 | 6 | 5 | 1 | 1, 2, 3, 4, 5, 6 |
| 11.4 | 5 | 5 | 0 | 1, 2, 3, 4, 5 |
| 12.1 | 5 | 3 | 2 | 1, 2, 3, 4, 5 |
| 12.1.1 | 4 | 3 | 1 | 1, 2, 3, 4 |
| 12.1.2 | 3 | 2 | 1 | 1, 2, 3 |
| 12.2 | 6 | 6 | 0 | 1, 2, 3, 4, 5, 6 |
| 12.3 | 5 | 5 | 0 | 1, 2, 3, 4, 5 |
| 13.2 | 3 | 0 | 3 | 1, 2, 4 |
| 13.3 | 4 | 2 | 2 | 1, 2, 3, 4 |
| 13.3.1 | 3 | 1 | 2 | 1, 2, 3 |
| 13.4 | 6 | 1 | 5 | 1, 2, 3, 4, 5, 6 |
| 13.4.5 | 1 | 1 | 0 | 4 |
| 14.2 | 4 | 1 | 3 | 1, 2, 3, 4 |
| 14.3 | 2 | 2 | 0 | 2, 3 |
| 14.4 | 1 | 1 | 0 | 2 |
| 14.5 | 6 | 3 | 3 | 2, 3, 4, 5, 6, 7 |
| 14.6 | 1 | 1 | 0 | 1 |
| 14.7 | 3 | 3 | 0 | 1, 4, 5 |
| 15.1 | 1 | 0 | 1 | 3 |
| 15.2 | 4 | 1 | 3 | 1, 2, 3, 4 |
| 15.3 | 1 | 0 | 1 | 2 |
| 15.4 | 4 | 4 | 0 | 1, 2, 3, 4 |
| 15.5 | 4 | 0 | 4 | 1, 2, 3, 4 |
| 15.6 | 5 | 3 | 2 | 1, 2, 3, 4, 5 |
| 16.1 | 2 | 0 | 2 | 2, 3 |
| 18.1 | 1 | 0 | 1 | 3 |
| 26.4 | 3 | 2 | 1 | 1, 2, 4 |
| 26.5 | 4 | 3 | 1 | 1, 2, 3, 4 |
| 26.6 | 5 | 3 | 2 | 1, 2, 3, 4, 5 |

## Method

tvOS joined Apple's public beta program with tvOS 11. For each scoped point release, research required the exact tvOS version, a public-tester audience, a publisher-displayed public ordinal, and a date normalized to `America/Los_Angeles`. Developer ordinals, build alignment, generic public-program wording, and iOS/iPadOS/watchOS/macOS pairing were not used to invent identities. Release candidates and golden masters were kept separate.

Sources are retained as metadata, bounded claim previews, and hashes; source prose is not republished as site copy. Multiple pages from one publisher count as one lineage.

## Production reconciliation

The fresh Sanity query used `perspective: "published"` and `useCdn: false` at 2026-07-31T08:21:10.805Z. All 32 parent releaseVersion documents exist. Production contained 2068 release events overall, 189 scoped events, and zero scoped public-beta events. Every researched route and full identity had zero matches.

## Integrity and handoff

The exact assignment rows are frozen in `scoped-coverage-snapshot.json`. Raw pages and mechanically selected evidence are frozen under `tmp/research-evidence/beta-chronology-gap/tvos-point-11-26`, with committed hashes in `raw-evidence-locks.json`. Shared coverage and candidate aggregates were not modified.

The packet is research-only. A separate reviewer must author `independent-review.json`; that file is intentionally absent. No stable IDs were created, no Sanity mutation occurred, no pages were built, and nothing was published or deployed.
