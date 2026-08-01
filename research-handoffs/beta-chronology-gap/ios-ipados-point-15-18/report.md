# iOS/iPadOS point-release Public Beta chronology, 15–18

Research cutoff: 2026-07-31

This research-only packet audits all 75 remaining iOS/iPadOS point-release rows in the current coverage matrix from 15.1 through 18.7. It proposes 159 observed public-beta identities across 41 positive cycles. 153 pass the two-independent-lineage selected-evidence gate; 6 iPadOS 16.1 observations are retained as blocked conflicts rather than normalized into false certainty.

## Production reconciliation

The fresh Sanity query used the published perspective with `useCdn: false` at 2026-07-31T07:02:36.823Z. It observed 2068 total release events, 301 events under the 75 scoped parents, zero scoped public-beta events, zero route matches, zero full identity matches, and zero missing parents.

## Evidence and sequence coverage

All 147 selected sources and their matching raw captures succeeded and are frozen with byte counts and SHA-256 hashes. The sequence audit covers all 41 positive cycles, explicit ordinal skips, terminal stable boundaries, next-ordinal negatives, local-calendar normalization, withdrawn seeds, and conflicting labels. The separate not-proposed register contains 38 reversible dispositions: 34 no-positive coverage rows and 4 platform-specific skipped-ordinal identities.

## Mandatory qualification

iPadOS 16.1 crossed an unusual iPadOS 16 campaign-to-16.1 transition. Retained publishers disagree about whether the first 16.1 payload continued the iPadOS 16 public campaign and about later exact public ordinals. All six observations remain `needsEvidenceReview`; none is eligible for integration.

## Safety

This packet performs research only. It creates no Sanity document, stable event ID, release page, publication, or deployment. An independent reviewer must verify the exact platform, public audience, ordinal, Pacific date, source independence, sequence boundary, and conflicts before any integration proposal.
