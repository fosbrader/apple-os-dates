# Priority developer-beta gap research leads

Status: research leads only; no candidate is chronology-approved  
Prepared: 2026-07-31 UTC  
Sanity writes authorized: **no**

## Exact scope

Audit the complete developer-beta sequences for the four modeled iOS versions
that currently have evidence-backed public-beta appearances but zero
`developerBeta` events in the production snapshot:

- iOS 9.2.1
- iOS 10.2.1
- iOS 10.3.2
- iOS 10.3.3

This is an exact-identity audit. Do not derive developer dates or ordinals from
the public sequence. Same-day developer and public appearances remain separate
events. A public article may corroborate an earlier developer appearance only
when its text explicitly says when that developer appearance occurred.

## Sequence leads to verify

These are search leads, not authorized event identities:

| Version | Possible developer sequence |
| --- | --- |
| iOS 9.2.1 | Beta 1 — 2015-12-16; Beta 2 — 2016-01-04 |
| iOS 10.2.1 | Beta 1 — 2016-12-14; Beta 2 — 2016-12-20; Beta 3 — 2017-01-09; Beta 4 — 2017-01-12 |
| iOS 10.3.2 | Beta 1 — 2017-03-28; Beta 2 — 2017-04-10; Beta 3 — 2017-04-17; Beta 4 — 2017-04-24; Beta 5 — 2017-04-27 |
| iOS 10.3.3 | Beta 1 — 2017-05-16; Beta 2 — 2017-05-30; Beta 3 — 2017-06-13; Beta 4 — 2017-06-22; Beta 5 — 2017-06-28; Beta 6 — 2017-07-05 |

Research must test for skipped ordinals, respins, withdrawals, and later betas
rather than treating these rows as complete by default.

## Reusable contemporary source leads

The existing public-beta packets already retain several pages whose text also
explicitly describes the paired developer appearance. Reuse their captured
evidence only after rechecking locators and hashes:

- iOS 9.2.1:
  - [MacRumors Public Beta 1](https://www.macrumors.com/2015/12/17/apple-seeds-first-9-2-1-public-beta/)
  - [MacRumors Beta 2](https://www.macrumors.com/2016/01/04/apple-seeds-second-beta-of-ios-9-2-1/)
  - [9to5Mac Beta 2](https://9to5mac.com/2016/01/04/apple-releases-ios-9-2-1-beta-for-developers/)
- iOS 10.2.1:
  - [MacRumors Public Beta 1](https://www.macrumors.com/2016/12/15/ios-10-12-1-sierra-10-12-3-public-betas/)
  - [MacRumors Public Beta 2](https://www.macrumors.com/2016/12/21/apple-releases-ios-10-2-1-public-beta-2/)
  - [MacRumors Beta 3](https://www.macrumors.com/2017/01/09/apple-seeds-ios-10-2-1-beta-3-to-developers/)
  - [OS X Daily Beta 3](https://osxdaily.com/2017/01/09/beta-3-of-ios-10-2-1-macos-10-12-3-watchos-3-1-3-tvos-10-1-1/)
  - [MacRumors Beta 4](https://www.macrumors.com/2017/01/12/apple-seeds-ios-10-2-1-beta-4-to-developers/)
  - [AppleInsider Beta 4](https://appleinsider.com/articles/17/01/12/apple-seeds-ios-1021-beta-to-developers-and-public-testers)
- iOS 10.3.2:
  - [MacRumors Beta 3](https://www.macrumors.com/2017/04/17/apple-seeds-ios-10-3-2-beta-3-to-developers/)
  - [MacRumors Beta 4](https://www.macrumors.com/2017/04/24/apple-seeds-ios-10-3-2-beta-4-to-developers/)
  - [MacRumors Beta 5](https://www.macrumors.com/2017/04/27/apple-seeds-ios-10-3-2-beta-5-to-developers/)
  - The Public Beta 1 and 2 reports in
    `ios10-point-public/sources.json` identify their immediately preceding
    developer appearances and should be checked as secondary evidence.
- iOS 10.3.3:
  - [MacRumors Beta 2](https://www.macrumors.com/2017/05/30/apple-seeds-ios-10-3-3-beta-2-to-developers/)
  - [MacRumors Beta 3](https://www.macrumors.com/2017/06/13/apple-seeds-ios-10-3-3-beta-3-to-developers/)
  - [MacRumors Beta 4](https://www.macrumors.com/2017/06/22/apple-seeds-ios-10-3-3-beta-4-to-developers/)
  - [MacRumors Beta 5](https://www.macrumors.com/2017/06/28/apple-seeds-ios-10-3-3-beta-5-to-developers/)
  - [MacRumors Beta 6](https://www.macrumors.com/2017/07/05/apple-seeds-ios-10-3-3-beta-6/)
  - [The Mac Observer Beta 6](https://www.macobserver.com/news/ios-10-3-3-beta-6-available/)
  - The Public Beta 1 report in
    `ios10-point-public/sources.json` identifies the prior developer
    appearance and should be checked as secondary evidence.

MacRumors pages from one publisher lineage do not independently corroborate
one another. Seek a second contemporary publisher lineage for every candidate,
especially Beta 1 appearances currently supported through a next-day public
report.

## Required output

Create a separate frozen packet under
`research-handoffs/beta-chronology-gap/developer-gap-priority/` with:

- assignment and exact production snapshot;
- full positive and negative sequence tables;
- captured source ledger with bytes and SHA-256;
- proposed developer-beta candidates only when each exact identity is proven;
- conflicts and exclusions;
- a validator and recorded validation result; and
- a self-review that explicitly leaves independent chronology approval
  pending.

The program's current root candidate schema intentionally hard-codes
`publicBeta`; do not mislabel developer appearances to make them validate.
Supply a packet-local developer-candidate schema or validator that preserves
the same evidence, production-reconciliation, and safety gates while requiring
`channel: "developerBeta"` and `beta-N` routes.

Do not edit production data, create stable event IDs, modify the public-beta
packets, or authorize publication.
