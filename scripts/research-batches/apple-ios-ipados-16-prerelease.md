# Apple iOS and iPadOS 16 prerelease archive batch

## Result

`apple-ios-ipados-16-prerelease.json` records the published, source-backed archival articles for
six existing iOS and iPadOS 16.0 routes: Beta 1, Beta 2, and Beta 3 on each
platform.

- 6 substantive event overlays and no release-version overlays
- 82 change occurrences across 56
  stable, collision-checked definitions
- 5 declared and used sources with 284 citation
  references
- zero builds, build-number claims, route creation, Public-route changes, or
  administrative identity changes
- every event is `editoriallyVerified`, approved at `2026-07-30T08:15:41Z`, and
  `isIndexable: true`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               16 |
| iOS      | Beta 2    | `beta-2`       |               19 |
| iOS      | Beta 3    | `beta-3`       |               10 |
| iPadOS   | Beta 1    | `beta-1`       |               16 |
| iPadOS   | Beta 2    | `beta-2`       |               12 |
| iPadOS   | Beta 3    | `beta-3`       |                9 |

The local seed contains 20 iOS/iPadOS 16.0 milestones. This batch publishes
only the six routes above. Beta 3 v2, Public Beta 1, Beta 4, Beta 5, Beta 6,
iOS Beta 7, iOS Beta 8, iOS RC, and Public remain outside this archive pass.

## Archive method

1. An uncollapsed CDX query was run for both the reader path and the raw DocC
   transport path, limited to calendar year 2022 and HTTP 200 captures.
2. Reader-facing citations point to archived Apple Developer pages. Raw JSON
   transport URLs are retained only as source provenance and are never used as
   public citations.
3. DocC payloads were decoded, parsed by component and status heading, keyed by
   issue ID, and compared as adjacent retained states.
4. Beta 1 is representative. Beta 2 uses the first title-identified Beta 2
   state against Beta 1. Beta 3 uses the June 28 Beta 2 document revision as
   its immediate before-state.
5. Wording-only changes, duplicate section moves, TestFlight administration,
   and records without a defensible product or developer meaning were excluded.
6. Shared Apple documentation was not treated as blanket cross-platform proof.
   Explicit iPhone, iPad, telephony, Lock Screen, HealthKit user-interface,
   Stage Manager, and hardware language determined route scope.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers StoreKit purchase provenance and environment
metadata, RoomPlan, SwiftUI presentation and interaction behavior, StoreKit
concurrency annotations, App Intents build compatibility, and Matter pairing.
iOS carries the explicitly iPhone-oriented HealthKit, controller, Lock Screen,
Siri, and voicemail records. iPadOS carries Stage Manager, external-display,
cellular-activation, table, timer, and M1 iPad records.

### Beta 2 clean milestone

The shared delta includes stricter CoreGraphics input validation, StoreKit
formatting and deprecation changes, RealityKit and MetalFX limitations, three
resolved developer issues, and a CloudKit Simulator failure. iOS adds LTE
backup, HealthKit workout data, carrier and dual-SIM Messages features,
Lock Screen widget previews, and wallpaper restoration. iPadOS adds older-iPad
Maps, Stage Manager input, and external-display sizing issues.

### Beta 3 clean milestone

The Beta 3 comparison isolates two SwiftUI APIs, a StoreKit testing fix,
WeatherKit failures, a parameterized Siri shortcut issue, and Maps
localization. Telephony and poster records remain iOS-only; external-display
camera access and the attached-keyboard Mail workflow remain iPadOS-only.

## Raw snapshot audit ledger

The SHA-256 values below are calculated over the decoded JSON payload serialized
by `JSON.stringify`, matching the repository audit helper.

| State           | Raw capture      | DocC title                           | Records | SHA-256                                                            | Public citation                                                                                                                                         |
| --------------- | ---------------- | ------------------------------------ | ------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta 1          | `20220608015846` | iOS & iPadOS 16 Beta Release Notes   |     143 | `fcb5607ceda361187b782a1d35e994eb27e7578adfecdbbedac16fadd53644cd` | [Apple page](https://web.archive.org/web/20220610044940/https://developer.apple.com/documentation/iOS-iPadOS-Release-Notes/ios-ipados-16-release-notes) |
| Beta 2          | `20220622231823` | iOS & iPadOS 16 Beta 2 Release Notes |     175 | `637c863f20b7b3986914ceb096f30aaa10769c39e964e1048b79b9abd155d5b3` | [Apple page](https://web.archive.org/web/20220623235135/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) |
| Beta 2 revision | `20220628053943` | iOS & iPadOS 16 Beta 2 Release Notes |     180 | `56ea71abca299bce6ac30f6290733a90933448967668ef95d56d716cdc8ca304` | [Apple page](https://web.archive.org/web/20220628053941/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) |
| Beta 3          | `20220706194549` | iOS & iPadOS 16 Beta 3 Release Notes |     192 | `69b60f65d00d142dbbc754d122cdf4bfbeb9ca2d1c8128e504f5e81e403192b4` | [Apple page](https://web.archive.org/web/20220706210814/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) |
| Beta 7 audit    | `20220823230920` | iOS & iPadOS 16 Beta 7 Release Notes |     203 | `f5433b299af07811ecfb844b11a65439aebd77fc9d0e81b41cb5bb664b0c99bd` | [Apple page](https://web.archive.org/web/20220823230919/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) |

Adjacent parser results:

- Beta 1 → initial Beta 2: 31 additions, 0 removals, 35 changed records
- initial Beta 2 → June 28 Beta 2 revision: 8 additions, 1 removal, 7
  changed records
- June 28 Beta 2 revision → Beta 3: 11 additions, 0 removals, 5 changed
  records
- Beta 3 → Beta 7: 14 additions, 3 removals, 127 changed records

## Exact evidence gaps

- The June 28 payload still identifies itself as Beta 2. It is used only as
  the before-state for Beta 3; its eight additions are not assigned to Beta 3
  v2, Public Beta 1, or any invented route.
- No retained raw state isolates the July 11 Beta 3 v2 or same-day Public Beta
  1 seed.
- The next raw snapshot after Beta 3 is Beta 7 on August 23. That interval
  crosses Beta 4, Beta 5, Beta 6, and Beta 7, so none of its additions or 127
  changed records are attributed to a route.
- The archive returned no raw Beta 8 or RC state in the audited 2022 CDX
  inventory.
- No complete first-party build-number set was independently retained, so the
  batch creates no build records and makes no build claims.
- Public is already owned by `apple-ios-ipados-16.json` and is untouched.
  iPadOS 16.0 was superseded without a Public milestone in the exact local seed.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS & iPadOS 16 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20220610044940/https://developer.apple.com/documentation/iOS-iPadOS-Release-Notes/ios-ipados-16-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 16 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20220623235135/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 16 Beta 2 Release Notes — June 28 state (preserved snapshot)](https://web.archive.org/web/20220628053941/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 16 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20220706210814/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-16-release-notes) — Apple Developer via Internet Archive; archive.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against both local 16.0 seed records and all 20 milestones
- Exact six-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 82 occurrences resolve to exactly
  56 stable local definitions
- Explicit rejection of identity, build, TestFlight, and administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `8b958e4202b3edb1de7f0cccc027ea6d6d8534e179eec913cef28d1aaf958163`

## Publication and validation record

Root editorial review approved all six event articles and all
82 change occurrences at `2026-07-30T08:15:41Z`.

Publication record:

- reviewed production plan: `39e7a493aa964b3dbf85a33641b1b759112b3fb659e0682728ac672261bee6dc`
- reviewed plan artifact SHA-256:
  `ff6869a3a21e4690279dc9afa5db35bb253d0102c98a798133a12b1270521033`
- rollback artifact SHA-256:
  `e670892e5cb9388cbeec6688eedf6927fc0525fa3167a573ccd706aeb37218cd`
- Sanity transaction: `eOgq1Ovu5XNUv1qNFUsndf`
- receipt SHA-256: `6a11d231c9fa25c3ca9764f1179b7257834dbdfad0c19e25df5984c3c9bef27c`
- immediate post-publication zero plan:
  `0de0d100f1069ab764b3a327351e13546f7306e3a69dbf913c8acb4d16781efd`
- zero-plan artifact SHA-256:
  `ca219c134d78d8a6862c0718f84a43f080fdc0563fb0d0056dc0249c61f56efd`
- zero-plan rollback artifact SHA-256:
  `a92f4f8885d2c5006ca9c12f15294d7be96420e8322d53e44ed2d1bda95db07d`
- zero mutations, 2,143
  unchanged documents, and
  16 mutation-payload
  bytes
- the final deterministic regeneration dry run reproduced this exact zero plan

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 345 full articles, 256 source-linked records, and 1,378
  timeline-only records
- 496 appearances have approved structured changes

Settled local route verification:

- every iOS and iPadOS Beta 1, Beta 2, and Beta 3 route returned HTTP 200
- all six responses contained Full article mode, the “Preserved release-note
  state” article, References, and `index, follow`
- no route contained placeholder text or `noindex`

Validation on 2026-07-30:

- `npm run research:validate`: 50 batches validated; this batch reports 6
  events, 82 change occurrences, 5 sources, and
  284 citation references
- focused ingestion/manifest suite: 19 tests passed
- 82 issue-ID locator, component-heading, and status-heading checks against
  the exact Beta 1, Beta 2, and Beta 3 raw snapshots: passed
- copyright-similarity scan: the longest contiguous overlap between editorial
  fields and Apple list records was 7 words
- ESLint, Prettier check, and `git diff --check`: passed
- deterministic regeneration preserved the approved JSON exactly
- the post-publication planner reported no Sanity changes

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-ipados-16-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-16-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-16-prerelease.mjs scripts/research-batches/apple-ios-ipados-16-prerelease.json scripts/research-batches/apple-ios-ipados-16-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-16-prerelease.json
```

This finalization records an already completed publication. It does not perform
or request another Sanity mutation.
