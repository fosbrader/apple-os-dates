# Apple OS 27 public-beta chronology gap

Status: **research complete; independent evidence review passed**

Research cutoff: **2026-07-30**

Scope: macOS 27.0, watchOS 27.0, tvOS 27.0, and visionOS 27.0 public-beta appearances only. A read-only live-production reconciliation was performed; no Sanity document was written, and no production mutation is authorized by this packet.

## Outcome

Six public-beta appearances are ready for independent evidence review. A read-only query of `lh3yswzu/production` at `2026-07-31T02:40:40Z` confirmed that all six are missing from the published `releaseEvent` corpus:

| Platform | Public label | Actual availability | Build | Payload relationship |
| --- | --- | --- | --- | --- |
| macOS 27.0 | Public Beta 1 | 2026-07-13 | 26A5378n | developer beta 3 v2 |
| macOS 27.0 | Public Beta 2 | 2026-07-22 | 26A5388g | developer beta 4 |
| watchOS 27.0 | Public Beta 1 | 2026-07-13 | 24R5315i | developer beta 3 |
| watchOS 27.0 | Public Beta 2 | 2026-07-22 | 24R5325h | developer beta 4 |
| tvOS 27.0 | Public Beta 1 | 2026-07-13 | 24J5315i | developer beta 3 |
| tvOS 27.0 | Public Beta 2 | 2026-07-22 | 24J5325d | developer beta 4 |

The public appearance identities, dates, and sequences are high-confidence. macOS Public Beta 1's build is medium-confidence because the public release is directly documented but the preserved build evidence is an indirect same-day payload report. All other listed builds are corroborated by a dedicated public report or chronology plus the corresponding developer payload.

Production contains no `publicBeta` event for any of the four scoped 27.0 versions. It already contains the six matching developer-payload `releaseBuild` documents, so approved public appearances should reference those existing build IDs rather than create duplicate builds:

| Candidate | Existing build document |
| --- | --- |
| macOS Public Beta 1 | `release-build-b6325b76ecd8703365811fdc` |
| macOS Public Beta 2 | `release-build-f73dd012ff20b92b591c2317` |
| watchOS Public Beta 1 | `release-build-8bd7c137d9e3e99ff4f06649` |
| watchOS Public Beta 2 | `release-build-fdf843582d3e0d40a26604a7` |
| tvOS Public Beta 1 | `release-build-3ff0f0bb8f4ff8f43f6a9a7d` |
| tvOS Public Beta 2 | `release-build-554bcf80b312c7bdd103d4b1` |

The exact live event/build references and zero-match counts are recorded under `productionReconciliation` in [candidates.json](./candidates.json).

No credible Public Beta 3 appearance was found for these platforms by July 30. That is only a cutoff observation; later betas should be added when they actually ship.

## visionOS decision

Do **not** create visionOS 27 Public Beta 1 or Public Beta 2 events from the currently available evidence.

Several roundups mechanically treated the July 6 developer beta 3 payload (`24M5316k`) as Public Beta 1 on July 13. One living chronology also treated the July 20 developer beta 4 payload (`24M5326g`) as Public Beta 2 on July 22. Those are real published claims, so they are preserved in [conflicts.json](./conflicts.json), but they do not establish public distribution:

- Apple's [Beta Software Program](https://beta.apple.com/) includes macOS 27, tvOS 27, and watchOS 27 but omits visionOS 27.
- Apple's [public-program FAQ](https://beta.apple.com/en/faq) lists enrollable devices and does not include Apple Vision Pro.
- Apple's [visionOS beta installation instructions](https://developer.apple.com/support/install-beta) tell Vision Pro users to choose the **developer beta** and require the Apple Account used with the Apple Developer website.
- A [MacStories visionOS 27 hands-on](https://www.macstories.net/stories/visionos-27-the-macstories-beta-preview/) published the evening of July 13 explicitly says visionOS was not included in the public program and calls the tested release a developer beta.
- A [Gadgets Now launch audit](https://gadgetsnow.indiatimes.com/tech-news/apples-ios-27-public-beta-is-live-in-india-how-to-install-it-and-why-you-may-want-to-wait/articleshow/132381180.cms) published July 14 reaches the same conclusion after comparing Apple's program surfaces.
- iCulture's claimed Public Beta 2 page is internally inconsistent: the same page provides only a developer-account installation route and warns that the betas are developer-only.

The correct historical state through the cutoff is therefore `publicDistributionNotEstablished`, not a speculative public-beta event. This is deliberately narrower than claiming Apple could never add visionOS to the public program later.

## Important source error

Do not reuse AppleInsider's `23U5062b` value for watchOS 27 Public Beta 1. The supported build is `24R5315i`. MacRumors states that Public Beta 1 used the developer beta 3 payload, and iCulture identifies that paired payload as `24R5315i`. Apple's search-indexed release listing observed during research identifies `23U5062b` as watchOS **26.6** beta 5, although the rolling live Apple index no longer retained that row in the downloaded HTML.

This cross-version error also lowers the evidentiary weight of the same AppleInsider article's visionOS line.

## Files

- [assignment.json](./assignment.json) — scope, cutoff, and constraints
- [sources.json](./sources.json) — source metadata, locators, raw paths, byte counts, and SHA-256 hashes
- [candidates.json](./candidates.json) — six event candidates, two rejected visionOS appearances, and the cutoff checkpoint
- [conflicts.json](./conflicts.json) — competing claims, analysis, decisions, and reversal evidence

Raw evidence is preserved under `tmp/research-evidence/beta-chronology-gap/os27/`. The raw captures are intentionally not publishing copy. Use only release facts and short source locators; write any eventual release-page prose as original synthesis with citations.

## Independent review

An independent root-agent review passed on 2026-07-30. The reviewer:

- reproduced all 16 documented raw or selected-text SHA-256 hashes and byte
  counts;
- confirmed that all source IDs are unique and every candidate/conflict
  reference resolves;
- checked the dedicated July 13 and July 22 availability locators for all six
  proposed appearances;
- confirmed that all six candidate identities align one-for-one with the
  read-only production reconciliation and remain absent in that captured
  snapshot;
- confirmed the conservative `publicDistributionNotEstablished` disposition
  for both apparent visionOS appearances; and
- retained medium confidence for the macOS Public Beta 1 build without
  downgrading the independently established event identity.

The machine-readable review record is in [review.json](./review.json).

## Pre-mutation checklist

1. Recalculate each raw file's SHA-256 and byte count against `sources.json`.
2. Verify the July 13 macOS/watchOS/tvOS Public Beta 1 identities and the July 22 Public Beta 2 identities from the cited dedicated reports.
3. Verify build sharing independently from channel identity. Never infer a public event solely because a build equals a developer build.
4. Re-run the production query immediately before mutation. They were all absent at `2026-07-31T02:40:40Z`, but another agent may add them after this packet was completed.
5. Reuse existing `releaseBuild` and `source` documents where canonical identity matches.
6. Seek a July 13 archived Apple Beta page or a dated Vision Pro Beta Updates screenshot. If it clearly shows a `visionOS 27 Public Beta` choice, reopen the visionOS conflict before approving.
7. Re-run every mutable-state check immediately before any approved write; this
   review does not authorize a Sanity mutation.

## Recommended production action after review

If all six candidates pass review and remain absent immediately before mutation, add them as `publicBeta` release events with `availabilityState: available`, sequences 1 and 2, and `closesReleaseCycle: false`. Link each to the exact reused build document recorded in `candidates.json`.

Do not create visionOS public-beta events, and do not create speculative Public Beta 3 events.
