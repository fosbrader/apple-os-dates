# iOS developer-beta priority gap packet

Status: frozen research candidate set pending independent chronology review.

## Result

The packet proposes 17 exact missing `developerBeta` identities using `beta-N` routes:

| Version | Consecutive developer sequence | Appearance dates | Next ordinal tested |
| --- | --- | --- | --- |
| iOS 9.2.1 | Beta 1–2 | 2015-12-16; 2016-01-04 | Beta 3 not supported |
| iOS 10.2.1 | Beta 1–4 | 2016-12-14; 2016-12-20; 2017-01-09; 2017-01-12 | Beta 5 not supported |
| iOS 10.3.2 | Beta 1–5 | 2017-03-28; 2017-04-10; 2017-04-17; 2017-04-24; 2017-04-27 | Beta 6 not supported |
| iOS 10.3.3 | Beta 1–6 | 2017-05-16; 2017-05-30; 2017-06-13; 2017-06-22; 2017-06-28; 2017-07-05 | Beta 7 not supported |

Every exact identity has at least two independent contemporary publisher lineages. No skipped ordinals, duplicate ordinals, withdrawals, replacements, returns, or same-ordinal respins were observed in the inspected evidence.

## Production reconciliation

The fresh query used the published perspective with CDN disabled and made no mutation. All four release-version parents exist. Production contains zero scoped developer-beta events and zero matches for the 17 exact `{releaseVersionId, channel: "developerBeta", routeAlias: "beta-N"}` identities.

## Preserved conflicts

- iOS 9.2.1: one final-release article says developers and public testers received “three betas,” while AppleInsider explicitly counts two developer betas. The ambiguous aggregate cannot establish developer Beta 3.
- iOS 10.3.2: one MacRumors final-release lead says four betas, but MacRumors’ own Beta 5 article plus independent Macerkopf and iDownloadBlog reports explicitly identify Beta 5; Forbes also counts five. Beta 5 remains proposed and the four-beta aggregate is preserved as an error.

## Evidence and safety

The packet contains 42 source records: 28 retained sources reverified byte-for-byte and at their candidate locators, plus 14 newly captured raw/selected pages. Candidate build evidence is deliberately absent, and content is timeline-only.

No stable IDs were allocated. No Sanity writes, publication, page builds, or deployment occurred. The packet does not self-approve; a different reviewer must inspect the chronology and preserved conflicts.
