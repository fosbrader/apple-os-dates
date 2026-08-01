# Apple OS 27 prerelease research batch

## Result

`apple-os-27-prerelease.json` publishes substantive overlays for 10 Apple OS 27 prerelease
routes and exact build records across the 22-route pre-Beta-4 audit scope.
Twelve route overlays are deliberately omitted where the retained evidence
does not support a substantive, non-duplicative structured delta. The six
approved Beta 4 routes and builds remain owned by
`scripts/apple-launch-content-2026.json`.

- 10 source-backed event articles with at least one substantive
  behavior or API change
- 20 exact build overlays; shared developer/public build relationships are
  represented with multiple durable event targets rather than duplicate builds
- 87 structured behavior/API change occurrences across
  53 collision-checked definitions; seed identity
  and TestFlight administration are retained only in prose or removed
- 30 declared and used sources; 375 claim-level or
  page-level citation references
- 0 release-version overlays, 0 route creations, and 0 Beta 4 mutations
- every event and build is `editoriallyVerified`, approved at
  `2026-07-30T07:28:01Z`, and `isIndexable: true`

## Exact route audit closure

| Platform | Existing route | Date       | Build      | Batch treatment          | Structured behavior/API deltas |
| -------- | -------------- | ---------- | ---------- | ------------------------ | -----------------------------: |
| iOS      | Beta 1         | 2026-06-08 | `24A5355q` | event overlay            |                             11 |
| iOS      | Beta 2         | 2026-06-22 | `24A5370h` | event overlay            |                             18 |
| iOS      | Beta 3         | 2026-07-06 | `24A5380h` | event overlay            |                             16 |
| iOS      | Public Beta 1  | 2026-07-13 | `24A5380h` | build only; evidence gap |                              0 |
| iPadOS   | Beta 1         | 2026-06-08 | `24A5355q` | event overlay            |                             11 |
| iPadOS   | Beta 2         | 2026-06-22 | `24A5370h` | event overlay            |                             13 |
| iPadOS   | Beta 3         | 2026-07-06 | `24A5380h` | event overlay            |                             12 |
| iPadOS   | Beta 3 v2      | 2026-07-13 | `24A5380l` | build only; evidence gap |                              0 |
| iPadOS   | Public Beta 1  | 2026-07-13 | `24A5380l` | build only; evidence gap |                              0 |
| macOS    | Beta 1         | 2026-06-08 | `26A5353q` | build only; evidence gap |                              0 |
| macOS    | Beta 2         | 2026-06-22 | `26A5368g` | event overlay            |                              2 |
| macOS    | Beta 3         | 2026-07-06 | `26A5378j` | event overlay            |                              1 |
| macOS    | Beta 3 v2      | 2026-07-13 | `26A5378n` | build only; evidence gap |                              0 |
| tvOS     | Beta 1         | 2026-06-08 | `24J5289o` | build only; evidence gap |                              0 |
| tvOS     | Beta 2         | 2026-06-22 | `24J5305f` | event overlay            |                              1 |
| tvOS     | Beta 3         | 2026-07-06 | `24J5315i` | build only; evidence gap |                              0 |
| visionOS | Beta 1         | 2026-06-08 | `24M5291p` | build only; evidence gap |                              0 |
| visionOS | Beta 2         | 2026-06-22 | `24M5306i` | build only; evidence gap |                              0 |
| visionOS | Beta 3         | 2026-07-06 | `24M5316k` | build only; evidence gap |                              0 |
| watchOS  | Beta 1         | 2026-06-08 | `24R5289n` | build only; evidence gap |                              0 |
| watchOS  | Beta 2         | 2026-06-23 | `24R5305g` | event overlay            |                              2 |
| watchOS  | Beta 3         | 2026-07-06 | `24R5315i` | build only; evidence gap |                              0 |

The local seed contains 28 Apple OS 27 milestones. This audit covers the 22
routes before Beta 4: iOS 4, iPadOS 5, macOS 4, tvOS 3, visionOS 3, and
watchOS 3. It publishes 10 event overlays and keeps build/channel evidence for
all 22 routes in 20 deduplicated build records. The remaining six milestones
are the already-approved Beta 4 routes.

## Research and attribution method

1. Apple’s individual Beta 1 and July 13 revision entries establish those
   developer-seed dates and builds directly. Human-readable Apple Releases
   captures from June 22, June 24, and July 7 establish every Beta 2 and Beta 3
   row; the mutable live category page is not used as durable exact-build
   evidence.
2. Human-readable Internet Archive copies of Apple’s iOS and iPadOS 27
   developer notes are public citation targets. Matching raw DocC JSON captures
   were used only to compare component headings, issue IDs, text, and status
   transitions.
3. Beta 1 is a representative baseline selected from 203 captured entries.
   Beta 2 and Beta 3 use adjacent-state diffs: 236 versus 203 items, then 251
   versus 236. An item is assigned to a later beta only when its issue ID was
   added or its status changed in that captured state.
4. A third-party interface observation is `corroborated` only when two
   independent contemporaneous publications describe the same behavior.
   Single-source Home behavior is retained as `reported` and
   `undocumented`.
5. Public Beta 1 is treated as a channel expansion. It does not inherit or
   duplicate developer Beta 3 feature notes, and its build linkage is described
   as reported rather than first-party-confirmed.
6. All prose is original synthesis. Product names are nominative references;
   no publisher paragraph, screenshot, trademark artwork, or marketing copy
   is reproduced.

## Archived iOS and iPadOS findings

- Beta 1: localized Background Assets, advanced on-device Dictation, PlayStation
  Access controller support, new HealthKit reproductive-health samples, Home
  video descriptions/search, media-sharing extensions, Swift-first MetricKit,
  stricter managed-service TLS, On Demand Resources deprecation, launch-screen
  requirements, and the scene-lifecycle requirement.
- Beta 2 additions: App Intents schema changes, HealthKit training zones,
  SwiftUI’s new document model, Trust Insights, and expanded VideoToolbox frame
  interpolation. Status transitions confirm Core AI, Channel Sounding,
  Foundation Models, Metal, SwiftData, and related fixes. iOS also retains the
  explicit AirPods Max 2 Beta 1-to-Beta 2 firmware-support boundary and
  contemporaneously observed interface changes.
- Beta 3 additions: background Neural Engine entitlement requirements,
  limited/full HealthKit history permissions, Shortcuts and notification known
  issues, SwiftUI/UIKit API changes, and platform-specific status-bar/Siri
  issues. Status transitions confirm Foundation Models, StoreKit Testing, and
  Swift System fixes. Contemporaneous iOS interface observations remain
  separately labeled corroborated.

## Preserved other-platform findings

- macOS Beta 2: AirPods Max 2 firmware-beta update support and an explicit
  USDKit compressed-mesh incompatibility between Beta 1 and Beta 2.
- tvOS Beta 2: a single-source report that Beta 2 corrected Home accessory
  responsiveness after the initial iOS/tvOS 27 installs.
- watchOS Beta 2: Apple-documented Verizon calling/Text-to-911 and Foundation
  Models import regressions tied explicitly to Beta 2.
- iOS Beta 3: corroborated Siri voice controls, Reminders icon, Shortcuts
  editor choice, and Control Center cellular-status observations.
- macOS Beta 3: corroborated Golden Gate wallpapers and motion screen savers.
- visionOS Beta 2 and watchOS Beta 3 preserve important first-appearance facts
  in narrative form without creating duplicate reusable changes already owned
  cumulatively by the approved Beta 4 launch content.

## Exact evidence gaps

1. The July 17 raw capture contains 263 items and still identifies itself as
   “iOS & iPadOS 27 Beta 3 Release Notes.” It postdates the July 13 iPadOS Beta
   3 v2 event, but it is a shared iOS/iPadOS document and does not name the
   revision. Its additions and resolutions are therefore not assigned to Beta
   3 v2.
2. No reliable route-specific behavior delta was established for macOS Beta 1,
   tvOS Beta 1 or Beta 3, visionOS Beta 1 or Beta 3, or watchOS Beta 1. Those
   six event overlays are omitted; their exact build records remain.
3. tvOS Beta 2’s Home fix has one contemporaneous source and remains
   `reported`, not corroborated.
4. Apple explicitly dates gaze-to-activate Siri to visionOS Beta 2, but the
   approved Beta 4 manifest already owns
   `visionos-27-gaze-orb-activation` as a cumulative change. This batch
   preserves the Beta 2 first-appearance fact in the cited build summary and
   ledger, omits the route overlay, and leaves structured ownership for
   editorial reconciliation.
5. Two publications place Siri AI and the standalone Siri app in watchOS Beta
   3 after absence from the first two seeds. The approved Beta 4 manifest
   already owns `watchos-27-siri-ai`; this batch preserves the chronology in
   the cited build summary and ledger while omitting the route overlay.
6. Apple publishes revised iPadOS and macOS Beta 3 build identities, but no
   retained source itemizes what changed in either v2 seed. Both event overlays
   are omitted; the build records do not speculate about bug or security fixes.
7. The iOS Public Beta 1 build relationship depends on contemporaneous
   reporting that the public beta retained the Beta 3 build. Build and event
   targeting explicitly label that linkage as reported.
8. No public-beta-only feature delta was found for iOS or iPadOS. The two
   public-beta event overlays are therefore omitted rather than copying
   developer Beta 3 notes; their channel/build relationships remain in the
   deduplicated build records.

## Raw snapshot audit ledger

Raw transport URLs are validation provenance only and are never used as public
citations:

| State              | Capture timestamp | Items | Raw SHA-256                                                        | Raw transport                                                                                                                                                                 |
| ------------------ | ----------------- | ----: | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta 1             | `20260608214924`  |   203 | `fc7dc28e89c9c9604df8c602cf0060d61bbcbaac276ed16e38f7c0cee6406569` | [DocC JSON](https://web.archive.org/web/20260608214924id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json) |
| Beta 2             | `20260627125300`  |   236 | `d453c67bcf14f31724a01adb45cda3c86cafa4806254070c75fc924b2143d75e` | [DocC JSON](https://web.archive.org/web/20260627125300id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json) |
| Beta 3             | `20260707041111`  |   251 | `14076acbf5648516cc88342412fb617642bfabcfce0bee4c9c2f6e0c9c393de9` | [DocC JSON](https://web.archive.org/web/20260707041111id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json) |
| July 17 audit only | `20260717024434`  |   263 | `ee08f78b8d42fbc03e861366971f53a5dcd37eb0e504661196cdb1632ddb1998` | [DocC JSON](https://web.archive.org/web/20260717024434id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json) |

## Archived build-index evidence

The following reader-facing Apple Releases captures were downloaded and their
visible rows checked before citation:

| Capture timestamp                                                                                         | Verified rows                                                                                                 |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`20260622193409`](https://web.archive.org/web/20260622193409/https://developer.apple.com/news/releases/) | iOS `24A5370h`, iPadOS `24A5370h`, macOS `26A5368g`, tvOS `24J5305f`, visionOS `24M5306i`                     |
| [`20260624173559`](https://web.archive.org/web/20260624173559/https://developer.apple.com/news/releases/) | watchOS `24R5305g`                                                                                            |
| [`20260707070803`](https://web.archive.org/web/20260707070803/https://developer.apple.com/news/releases/) | iOS `24A5380h`, iPadOS `24A5380h`, macOS `26A5378j`, tvOS `24J5315i`, visionOS `24M5316k`, watchOS `24R5315i` |

## Source ledger

All sources were accessed on 2026-07-30. Exact Beta 2/3 build claims cite
the verified archived Apple Releases pages above, while living developer-note
pages are limited to explicit cross-beta facts. Historical iOS/iPadOS claims
cite human-readable preserved Apple pages with component, status, and retained
issue-ID locators.

- [Apple Developer Releases — June 22, 2026 capture](https://web.archive.org/web/20260622193409/https://developer.apple.com/news/releases/) — Apple Developer via Internet Archive; archive.
- [Apple Developer Releases — June 24, 2026 capture](https://web.archive.org/web/20260624173559/https://developer.apple.com/news/releases/) — Apple Developer via Internet Archive; archive.
- [Apple Developer Releases — July 7, 2026 capture](https://web.archive.org/web/20260707070803/https://developer.apple.com/news/releases/) — Apple Developer via Internet Archive; archive.
- [iOS 27.0 beta (24A5355q)](https://developer.apple.com/news/releases/?id=06082026b) — Apple Developer; firstPartyDocumentation.
- [iPadOS 27.0 beta (24A5355q)](https://developer.apple.com/news/releases/?id=06082026c) — Apple Developer; firstPartyDocumentation.
- [macOS 27.0 beta (26A5353q)](https://developer.apple.com/news/releases/?id=06082026d) — Apple Developer; firstPartyDocumentation.
- [tvOS 27.0 beta (24J5289o)](https://developer.apple.com/news/releases/?id=06082026e) — Apple Developer; firstPartyDocumentation.
- [visionOS 27.0 beta (24M5291p)](https://developer.apple.com/news/releases/?id=06082026f) — Apple Developer; firstPartyDocumentation.
- [watchOS 27.0 beta (24R5289n)](https://developer.apple.com/news/releases/?id=06082026g) — Apple Developer; firstPartyDocumentation.
- [iPadOS 27.0 beta 3 v.2 (24A5380l)](https://developer.apple.com/news/releases/?id=07132026a) — Apple Developer; firstPartyDocumentation.
- [macOS 27.0 beta 3 v.2 (26A5378n)](https://developer.apple.com/news/releases/?id=07132026b) — Apple Developer; firstPartyDocumentation.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.
- [Apple unveils next generation of Apple Intelligence, Siri AI, and more](https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/) — Apple Newsroom; firstPartyAnnouncement.
- [macOS 27 Golden Gate Release Notes (living beta document)](https://developer.apple.com/documentation/macos-release-notes/macos-27-release-notes) — Apple Developer Documentation; firstPartyDocumentation.
- [tvOS 27 Release Notes (living beta document)](https://developer.apple.com/documentation/tvos-release-notes/tvos-27-release-notes) — Apple Developer Documentation; firstPartyDocumentation.
- [visionOS 27 Release Notes (living beta document)](https://developer.apple.com/documentation/visionos-release-notes/visionos-27-release-notes) — Apple Developer Documentation; firstPartyDocumentation.
- [watchOS 27 Release Notes (living beta document)](https://developer.apple.com/documentation/watchos-release-notes/watchos-27-release-notes) — Apple Developer Documentation; firstPartyDocumentation.
- [iOS & iPadOS 27 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20260608214924/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 27 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20260627125300/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 27 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20260707041111/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes) — Apple Developer via Internet Archive; archive.
- [Everything New in iOS 27 Beta 2](https://www.macrumors.com/guide/ios-27-features/) — MacRumors; journalism.
- [Here's what's new with iOS 27 beta 2](https://9to5mac.com/2026/06/22/heres-whats-new-with-ios-27-beta-2/) — 9to5Mac; journalism.
- [Everything New in iOS 27 Beta 3](https://www.macrumors.com/2026/07/06/ios-27-beta-3-features/) — MacRumors; journalism.
- [Here's what's new with iOS 27 beta 3](https://9to5mac.com/2026/07/06/heres-whats-new-with-ios-27-beta-3/) — 9to5Mac; journalism.
- [macOS 27 Golden Gate adds these new wallpapers and screen savers to your Mac](https://9to5mac.com/2026/07/06/macos-27-golden-gate-adds-these-new-wallpapers-and-screen-savers-to-your-mac/) — 9to5Mac; journalism.
- [Golden Gate Bridge Wallpaper Added to macOS 27 Developer Beta 3](https://512pixels.net/2026/07/golden-gate-bridge-wallpaper/) — 512 Pixels; journalism.
- [watchOS 27 beta 3 includes upgraded Siri AI experience and dedicated Siri app](https://9to5mac.com/2026/07/06/watchos-27-beta-3-includes-upgraded-siri-ai-experience-and-dedicated-siri-app/) — 9to5Mac; journalism.
- [Apple just made Siri on the Apple Watch much more useful — and finally fixed one of its oldest frustrations](https://www.t3.com/tech/smartwatches/watchos-27-beta-3-siri-ai-features) — T3; journalism.
- [iPadOS 27 and macOS 27 beta 3 get a version 2 update as public betas drop](https://appleinsider.com/articles/26/07/13/ipados-27-macos-27-beta-3-get-a-version-2-update-as-public-betas-drop) — AppleInsider; journalism.
- [How to Install iOS 27 Public Beta on Your iPhone](https://www.macrumors.com/how-to/install-ios-27-public-beta-iphone-ipad/) — MacRumors; journalism.

## Closure guards

- Exact comparison against all six local 27.0 seed records, including every
  label, date, revision flag, and retained note
- Exact 22-route build-target allowlist, exact 10-event substantive allowlist,
  and explicit Beta 4 rejection
- Exact 20-build allowlist and event-target closure
- Hard-coded assertion that the launch manifest still owns exactly its six
  known OS 27 Beta 4 legacy targets
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 87 structured change occurrences resolve to exactly
  53 stable local definitions
- Explicit rejection of every seed-identity and TestFlight-administration
  structured change key
- Full citation declaration/use closure
- Deterministic formatted JSON SHA-256: `ef05da4130c6a1422244ee539e5becba6f8056a36b751d205eeda3af8d7d086b`

## Validation and reviewed production plan

The generator’s seed, route, build, protected-Beta-4, collision, review-state,
and citation guards pass before writing either artifact.

Verified on 2026-07-30:

- `npm run research:validate`: this batch reports 10
  events, 87 change occurrences, 30 sources, and 375 citation references
- focused ingestion/manifest suite: 19 tests passed
- ESLint, Prettier check, and `git diff --check`: passed
- deterministic regeneration: SHA-256 remained `ef05da4130c6a1422244ee539e5becba6f8056a36b751d205eeda3af8d7d086b`
- reviewed production dry run: 90 creates, 35 revision-guarded patches, and
  2,052 unchanged documents
- create split: 17 sources, 20 builds, and 53 stable change documents; no
  versions or events are created
- patch split: 10 substantive event-content/build patches, 12 build-link-only
  event patches for the explicit evidence-gap routes, and 13 source-metadata
  patches
- all 20 build creates contain cited original-synthesis articles
- mutation payload: 254,030 bytes (6.5% of the guarded limit)
- production plan SHA:
  `3fd042f1348fd3afd3d004f500c1723fa974cafbc80f9066e8118f9b17c26f01`

## Editorial approval and production receipt

The primary agent independently reviewed the exact route/build closure,
source ledger, archived Apple Releases captures, representative prose, and the
revision-guarded mutation plan. All 92 cited Apple issue identifiers were
checked against the corresponding raw archived DocC payloads with no misses.
The 20 build records contain short, cited original-synthesis articles and pass
the same substantive editorial gate as the 10 event records.

- Editorial approval recorded at `2026-07-30T07:28:01Z`
- Approved manifest SHA-256: `ef05da4130c6a1422244ee539e5becba6f8056a36b751d205eeda3af8d7d086b`
- Generator SHA-256: `82b0a63b91d0b7a3c5919eccebb59e2e980efc5035439d33519d93790a715497`
- Applied production plan:
  `3fd042f1348fd3afd3d004f500c1723fa974cafbc80f9066e8118f9b17c26f01`
- Sanity transaction: `tt1fSB5HY9GAB0YLyyK26i`
- Post-apply zero-plan SHA:
  `043a85d1ab99f05981077699935e73002f86955400c729a5d19f85d6f9a9bd86`
  with 0 mutations and 2,177 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles;
  appearances are 1,979 total, including 304 full, 256 source-linked, and
  1,419 timeline-only records; 455 approved structured changes are published
- Local verification passed for all 10 event pages and all 20 build pages;
  every route rendered its full article and `index, follow` metadata. Five
  initially delayed iOS/macOS routes settled after the documented 60-second
  cache/CDN propagation lag.

Reproduce with:

```sh
node scripts/research-batches/build-apple-os-27-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-os-27-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-os-27-prerelease.mjs scripts/research-batches/apple-os-27-prerelease.json scripts/research-batches/apple-os-27-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-os-27-prerelease.json
```

The last command is intentionally a post-apply dry run and must reproduce the
zero residual plan recorded above. The cumulative Beta 4 ownership boundaries
remain deliberate and unchanged.
