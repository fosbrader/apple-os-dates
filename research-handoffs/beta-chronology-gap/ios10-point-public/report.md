# iOS 10 point-release public-beta chronology packet

## Outcome

This research-only packet freezes 34 proposed public-beta identities across iOS 10.1, 10.2, 10.2.1, 10.3, 10.3.2, and 10.3.3. Published production contains zero publicBeta events in these six releaseVersion documents, and every exact candidate identity is absent.

Thirty-three candidates have at least two independent contemporary editorial publisher lineages and are marked `corroborated`. iOS 10.2.1 Public Beta 3 has one explicit editorial report plus an independent contemporary first-hand video witness; it remains `reported` / `unverified` until a second editorial lineage is found. No candidate is approved for publication or Sanity mutation.

## Frozen chronology

| Version | Candidate count | Proposed public appearance dates | Production developer betas |
| --- | ---: | --- | ---: |
| 10.1 | 5 | 2016-09-22, 2016-10-05, 2016-10-10, 2016-10-17, 2016-10-19 | 5 |
| 10.2 | 7 | 2016-11-01, 2016-11-08, 2016-11-15, 2016-11-28, 2016-12-02, 2016-12-05, 2016-12-07 | 7 |
| 10.2.1 | 4 | 2016-12-15, 2016-12-21, 2017-01-09, 2017-01-12 | 0 — audit gap |
| 10.3 | 7 | 2017-01-26, 2017-02-07, 2017-02-21, 2017-02-28, 2017-03-08, 2017-03-13, 2017-03-16 | 7 |
| 10.3.2 | 5 | 2017-03-29, 2017-04-11, 2017-04-18, 2017-04-24, 2017-04-27 | 0 — audit gap |
| 10.3.3 | 6 | 2017-05-17, 2017-05-30, 2017-06-13, 2017-06-22, 2017-06-28, 2017-07-05 | 0 — audit gap |

All ordinals are explicit in retained source evidence. None was inferred from a developer sequence or build.

## Corrections to the supplied leads

| Candidate | Supplied lead | Packet proposal | Reason |
| --- | --- | --- | --- |
| iOS 10.2 Public Beta 3 | 2016-11-14 | 2016-11-15 | November 14 is the original developer-article date; its public update is untimestamped. Multiple standalone public reports are dated November 15. |
| iOS 10.3 Public Beta 4 | 2017-02-27 | 2017-02-28 | February 27 is the developer seed. Two standalone public reports place the public seed on February 28. |
| iOS 10.3.2 Public Beta 3 | 2017-04-17 | 2017-04-18 | April 17 is the developer seed. Two standalone public reports place the public seed on April 18. |

These are proposed resolutions, not silent rewrites. The competing evidence and required reviewer handling are preserved in `conflicts.json`.

## Applicability qualifications

- iOS 10.1 Public Beta 5 was limited to iPhone 7 and iPhone 7 Plus.
- iOS 10.3.2 Public Beta 1 initially lacked 32-bit-device binaries, including iPhone 5, iPhone 5c, and iPad 4.

Any eventual page must show those limitations rather than presenting each seed as universally available across the release's nominal device set.

## Production reconciliation and developer-audit boundary

The read-only production snapshot was captured at 2026-07-31T03:55:00.732Z with the published perspective and CDN disabled. It found:

- 2068 total releaseEvent documents;
- 25 events in the six scoped releaseVersion documents;
- 0 scoped publicBeta events;
- 19 scoped developerBeta events; and
- zero exact, alias, or channel-sequence-date matches for all 34 candidates.

Production contains no developerBeta events for iOS 10.2.1, 10.3.2, or 10.3.3. Those are separate developer-chronology audit gaps. This public-beta assignment does not propose developer events for them.

## Evidence capture

The source pass attempted 83 contemporary URLs and captured 77. Six failed direct capture: five Neowin pages returned HTTP 403 and one iPhoneTricks page has a currently unusable host/certificate path. None of those six is used as candidate evidence; independently captured alternates cover every affected candidate.

Each retained source record includes canonical URL, publisher metadata, source class, pinpoint locator, raw and selected-text paths, byte counts, and SHA-256 hashes. Source pages are evidence, not article copy: future public writing must paraphrase, cite every sourced claim, and use only short quotations when genuinely necessary.

## Review gates

Before any separately authorized Sanity write:

1. An independent reviewer must reproduce hashes and inspect every candidate locator.
2. The reviewer must adjudicate the three corrected date conflicts.
3. iOS 10.2.1 Public Beta 3 needs a second independent contemporary editorial publisher, or an explicit exception decision.
4. The two device-applicability qualifications must be preserved in any downstream model or page.
5. Production must be queried again immediately before mutation.

This packet contains no Sanity mutation, stableEventId creation, deployment, build assertion, or substantive release-note claim.
