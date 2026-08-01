# Apple iOS and iPadOS 26 prerelease research batch

## Result

`apple-ios-ipados-26-prerelease.json` publishes substantive, independently reviewed articles for every existing
iOS 26.0 and iPadOS 26.0 prerelease route. It does not mutate either approved
public event, either approved version article, or either public build.

- 27 exact event overlays: 14 iOS and 13 iPadOS
- 26 exact build records, including revised builds and the unlinked
  iPhone 11 corrective build `23A5297n`
- 113 structured change occurrences across
  74 globally collision-checked definitions
- 36 declared and used sources with 512
  claim-level or page-level citation references
- 0 release-version overlays, 0 route creations, and 0 `public` event targets
- every event and build is `editoriallyVerified`, approved at
  `2026-07-30T07:02:33Z`, and `isIndexable: true`

## Exact route closure

| Platform | Existing route | Date       | Primary build | Milestone deltas beyond identity |
| -------- | -------------- | ---------- | ------------- | -------------------------------: |
| iOS      | Beta 1         | 2025-06-09 | `23A5260n`    |                                8 |
| iOS      | Beta 1 v2      | 2025-06-13 | `23A5260u`    |                                1 |
| iOS      | Beta 2         | 2025-06-23 | `23A5276f`    |                                7 |
| iOS      | Beta 3         | 2025-07-07 | `23A5287g`    |                                5 |
| iOS      | Beta 4         | 2025-07-22 | `23A5297i`    |                                4 |
| iOS      | Beta 4 v2      | 2025-07-24 | `23A5297m`    |                                0 |
| iOS      | Public Beta 1  | 2025-07-24 | `23A5297m`    |                                1 |
| iOS      | Beta 5         | 2025-08-05 | `23A5308g`    |                                9 |
| iOS      | Beta 6         | 2025-08-11 | `23A5318c`    |                                5 |
| iOS      | Beta 6 v2      | 2025-08-14 | `23A5318f`    |                                0 |
| iOS      | Beta 7         | 2025-08-18 | `23A5326a`    |                                0 |
| iOS      | Beta 8         | 2025-08-25 | `23A5330a`    |                                0 |
| iOS      | Beta 9         | 2025-09-02 | `23A5336a`    |                                2 |
| iOS      | RC             | 2025-09-09 | `23A340`      |                                2 |
| iPadOS   | Beta 1         | 2025-06-09 | `23A5260n`    |                                8 |
| iPadOS   | Beta 2         | 2025-06-23 | `23A5276f`    |                                7 |
| iPadOS   | Beta 3         | 2025-07-07 | `23A5287g`    |                                5 |
| iPadOS   | Beta 4         | 2025-07-22 | `23A5297i`    |                                3 |
| iPadOS   | Beta 4 v2      | 2025-07-24 | `23A5297m`    |                                0 |
| iPadOS   | Public Beta 1  | 2025-07-24 | `23A5297m`    |                                0 |
| iPadOS   | Beta 5         | 2025-08-05 | `23A5308g`    |                               10 |
| iPadOS   | Beta 6         | 2025-08-11 | `23A5318c`    |                                5 |
| iPadOS   | Beta 6 v2      | 2025-08-14 | `23A5318f`    |                                0 |
| iPadOS   | Beta 7         | 2025-08-18 | `23A5326a`    |                                0 |
| iPadOS   | Beta 8         | 2025-08-25 | `23A5330a`    |                                0 |
| iPadOS   | Beta 9         | 2025-09-02 | `23A5336a`    |                                2 |
| iPadOS   | RC             | 2025-09-09 | `23A340`      |                                2 |

## Research and attribution method

1. Exact labels, dates, revision flags, notes, and device/build scope come from
   the audited local seed inventory.
2. Apple Developer release cards establish the ordinary developer-seed build
   numbers. Their canonical URLs are retained with dated Internet Archive
   captures.
3. Preserved snapshots of Apple’s iOS and iPadOS 26 developer notes are
   compared sequentially. A behavior, API, fix, regression, or known issue is
   attached only where the retained snapshots support that milestone.
4. The first beta uses a representative initial inventory rather than
   pretending every version-wide feature was discovered in Beta 1.
5. Revised builds do not inherit speculative fixes. Public Beta 1 widens the
   channel and does not duplicate Beta 4’s developer-note payload.
6. All prose is original synthesis. Product names are nominative references;
   no article body, screenshot, logo, or marketing passage is reproduced.

## Preserved build and device scope

- iOS Beta 1 v2 is build `23A5260u`, limited by the audited milestone to
  the iPhone 15 and iPhone 16 product families. Apple’s preserved note ties
  the update to a startup/restore problem on some of those models.
- iOS and iPadOS Beta 4 v2 use build `23A5297m`; the same build is the
  primary build for Public Beta 1. No revision-only fix is inferred.
- The iPhone 11 family received `23A5297n` on July 25. It remains a separate,
  unlinked build because an event can have only one primary build reference.
  The sourced change was a Home Screen folder-display correction.
- iOS and iPadOS Beta 6 v2 use build `23A5318f`; the audited milestone also
  associates it with Public Beta 3. No unlisted revision payload is inferred.
- RC is build `23A340`. The approved public build `23A341` remains
  untouched.

## Exact evidence gaps

1. No clean retained structured snapshot isolates Beta 7 from Beta 8. Both
   routes therefore preserve real release-card/build metadata and an explicit
   evidence boundary without assigning cumulative notes backward.
2. Apple’s public release index did not retain separate cards for
   `23A5297m`, `23A5318f`, or `23A5297n`. Those build identities are
   preserved from the audited seed and corroborated with contemporaneous
   reporting; their articles are marked `partiallyDocumented`/
   `corroborated`, not first-party-confirmed.
3. Public Beta 1 has no duplicated Beta 4 change list. The only additional
   structured iOS item is the separately sourced iPhone 11 correction.
4. Beta 4 v2 and Beta 6 v2 have no sourced revision-only release-note payload,
   so neither page labels the reissue as a bug fix or security update.

## Deferred six-platform gap

The requested six-platform 26.0 prerelease inventory is too broad for one
source-accurate batch. This cohort closes all 27 iOS/iPadOS routes. The exact
remaining gap is 40 non-public routes:

- macOS 26.0: 10
- watchOS 26.0: 10
- tvOS 26.0: 10
- visionOS 26.0: 10

Those four platforms require their own historical developer-note snapshot
audits before content should be prepared.

## Source ledger

All sources were accessed on 2026-07-30. Apple developer-note pages are
living documents, so historical claims cite preserved captures and exact
component/radar locators.

- [iOS & iPadOS 26 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer Documentation; firstPartyDocumentation.
- [iOS 26.0 beta 1 (23A5260n)](https://developer.apple.com/news/releases/?id=06092025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 1 (23A5260n)](https://developer.apple.com/news/releases/?id=06092025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 2 (23A5276f)](https://developer.apple.com/news/releases/?id=06232025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 2 (23A5276f)](https://developer.apple.com/news/releases/?id=06232025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 3 (23A5287g)](https://developer.apple.com/news/releases/?id=07072025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 3 (23A5287g)](https://developer.apple.com/news/releases/?id=07072025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 4 (23A5297i)](https://developer.apple.com/news/releases/?id=07222025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 4 (23A5297i)](https://developer.apple.com/news/releases/?id=07222025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 5 (23A5308g)](https://developer.apple.com/news/releases/?id=08052025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 5 (23A5308g)](https://developer.apple.com/news/releases/?id=08052025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 6 (23A5318c)](https://developer.apple.com/news/releases/?id=08112025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 6 (23A5318c)](https://developer.apple.com/news/releases/?id=08112025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 7 (23A5326a)](https://developer.apple.com/news/releases/?id=08182025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 7 (23A5326a)](https://developer.apple.com/news/releases/?id=08182025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 8 (23A5330a)](https://developer.apple.com/news/releases/?id=08252025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 8 (23A5330a)](https://developer.apple.com/news/releases/?id=08252025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 beta 9 (23A5336a)](https://developer.apple.com/news/releases/?id=09022025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 beta 9 (23A5336a)](https://developer.apple.com/news/releases/?id=09022025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26.0 RC (23A340)](https://developer.apple.com/news/releases/?id=09092025a) — Apple Developer; firstPartyDocumentation.
- [iPadOS 26.0 RC (23A340)](https://developer.apple.com/news/releases/?id=09092025b) — Apple Developer; firstPartyDocumentation.
- [iOS 26 beta (23A5260n | 23A5260u)](https://developer.apple.com/news/releases/?id=06132025a) — Apple Developer; firstPartyDocumentation.
- [iOS & iPadOS 26 Release Notes — beta-1 snapshot](https://web.archive.org/web/20250610085647/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-1-v2 snapshot](https://web.archive.org/web/20250614143610/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-2 snapshot](https://web.archive.org/web/20250623180044/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-3 snapshot](https://web.archive.org/web/20250707180920/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-4 snapshot](https://web.archive.org/web/20250722200644/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-5 snapshot](https://web.archive.org/web/20250806095944/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-6 snapshot](https://web.archive.org/web/20250812161651/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-8 snapshot](https://web.archive.org/web/20250827123336/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — beta-9 snapshot](https://web.archive.org/web/20250902225803/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 26 Release Notes — rc snapshot](https://web.archive.org/web/20250910061549/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26-release-notes) — Apple Developer via Internet Archive; archive.
- [Apple Releases First iOS 26 and iPadOS 26 Public Betas](https://www.macrumors.com/2025/07/24/apple-seeds-ios-26-public-beta/) — MacRumors; journalism.
- [Apple releases revised iOS 26 and iPadOS 26 Beta 4 for iPhone and iPad](https://www.apfeltalk.de/community/threads/apple-veroeffentlicht-ueberarbeitete-ios-26-und-ipados-26-beta-4-fuer-iphone-und-ipad.585980/) — Apfeltalk; journalism.
- [Apple Releases Third iOS 26 and iPadOS 26 Public Betas, New Developer Beta](https://www.macrumors.com/2025/08/14/apple-releases-ios-26-public-beta-3/) — MacRumors; journalism.
- [Apple Seeds iOS 26 Public Beta for iPhone 11 Users](https://www.macrumors.com/2025/07/25/apple-seeds-ios-26-public-beta-iphone-11/) — MacRumors; journalism.

## Closure guards

- Exact comparison against both full local 26.0 seed records, including the
  two Public milestones that this batch explicitly excludes
- Exact 27-route selector allowlist using only
  `{releaseVersionId, routeAlias}`
- Explicit rejection of every `public` selector and every version overlay
- Exact 26-build allowlist and exact event-target closure
- Explicit guard that the approved launch manifest still owns both public
  events and both version articles
- Collision scan across every other research-batch JSON and the approved
  launch manifest for route, build, and change-key ownership
- Full citation declaration/use closure
- Deterministic formatted JSON SHA-256: `0f1eac963081529c408dc48c26f9ad080c69676bac21e0bb4347deda23f80678`

## Validation and dry run

Validation completed on 2026-07-30:

- The generator’s seed, selector, build, collision, review-state, and citation
  guards passed.
- Repository-wide research validation accepted 44 batches and 2,287 globally
  consistent change keys.
- The focused launch-content ingestion and manifest suites passed 19 of 19
  tests.
- ESLint and Prettier passed for the generator, manifest, and ledger;
  `git diff --check` passed.
- A second generator run reproduced the JSON byte for byte at SHA-256
  `0f1eac963081529c408dc48c26f9ad080c69676bac21e0bb4347deda23f80678`.
- The reviewed production dry run reported 135 creates, 28
  revision-guarded patches, and 2,055 unchanged documents. The mutation
  payload was 340,006 bytes, 8.7% of the guarded limit.
- Creates are exactly 35 sources, 26 builds, and 74 release changes. Patches
  are exactly the 27 intended draft prerelease events plus one reused source.
- Every event patch sets only article, build reference, changes, citations,
  review state, provenance, and summary. There are no event or version creates,
  no version patches, no `public` route, no unsets, and no deletion.
- Production plan SHA:
  `3cb1c9cb56def732f3e1bdea37571e8495539a83b39dd2289e2884d46f9cc3b9`.

## Editorial approval and production receipt

The primary agent independently reviewed the route closure, source ledger,
claim locators, representative raw Apple DocC snapshots, and the exact
revision-guarded production plan. Seventy cited Apple issue identifiers sampled
across Beta 1, Beta 2, Beta 5, and RC were present in the corresponding raw
archived payloads with no misses. Build records were also given short,
source-linked original-synthesis articles so they pass the same substantive
editorial gate as event records.

- Editorial approval recorded at `2026-07-30T07:02:33Z`
- Approved manifest SHA-256: `0f1eac963081529c408dc48c26f9ad080c69676bac21e0bb4347deda23f80678`
- Generator SHA-256: `e43c7abbfc84a0e15583ae5f31e3b9fd76de2f0cfa2c0905acb3675fda353a80`
- Applied production plan:
  `3cb1c9cb56def732f3e1bdea37571e8495539a83b39dd2289e2884d46f9cc3b9`
- Plan artifact SHA-256:
  `9497ba0e154591303ad612e69077d9cc05d9e1b7ed16988b28c1cae0ffc5e24d`
- Rollback artifact SHA-256:
  `c9f5da64b7ffc2528e6d5c10d5e267bb6b17ecdaaace5a3600801cc797575ac5`
- Apply receipt SHA-256:
  `f8a4114b94cef93d3826b8a97674542161eab7ca78372d4be96681f4cf3adddc`
- Sanity transaction: `F0eE6eK5XyVXtlnaoy7kuE`
- Post-apply residual plan:
  `2829c1c5ad29a44c0f106ea67d60b48cf23d13ddbdb4221f501800a3b8d7f429`
  with 0 creates, 0 patches, and 2,218 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles;
  appearances are 290 full, 270 source-linked, and 1,419 timeline-only; 441
  appearances have approved structured changes
- Local cache-busted verification passed for representative Beta 1, Beta 5,
  RC, and corrective-build routes; each rendered its article, references, and
  `index, follow` metadata
