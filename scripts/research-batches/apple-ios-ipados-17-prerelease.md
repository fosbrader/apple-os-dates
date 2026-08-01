# Apple iOS and iPadOS 17 prerelease archive batch

## Result

`apple-ios-ipados-17-prerelease.json` records the published source-backed archival articles on six
existing iOS and iPadOS 17.0 prerelease routes: Beta 1, Beta 2, and Beta 3 on each
platform.

- 6 substantive event overlays and no release-version overlays
- 119 change occurrences across 71
  stable, collision-checked definitions
- 4 declared and used sources with 395 citation
  references
- no build records, build-number claims, route creation, public-route changes,
  or administrative identity changes
- every event is `editoriallyVerified`, `approved`, and
  `isIndexable: true`, with review timestamp `2026-07-30T08:09:31Z`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               23 |
| iOS      | Beta 2    | `beta-2`       |               17 |
| iOS      | Beta 3    | `beta-3`       |               23 |
| iPadOS   | Beta 1    | `beta-1`       |               21 |
| iPadOS   | Beta 2    | `beta-2`       |               17 |
| iPadOS   | Beta 3    | `beta-3`       |               18 |

The local seed contains 26 iOS/iPadOS 17.0 milestones. This batch publishes only
the six routes above. Beta 3 v2, Public Beta 1, Beta 4, Beta 4 v2, Beta 5,
Beta 6, Beta 7, Beta 8, RC, and Public remain outside this archive pass unless
they have a separately reproducible milestone boundary.

## Archive method

1. Reader-facing citations point to preserved Apple Developer documentation,
   never to raw DocC JSON.
2. Raw DocC states were parsed by component, status heading, issue ID, and
   normalized text. Beta 2 and Beta 3 selections require an exact addition or
   status transition against the immediately preceding retained state.
3. Beta 1 is intentionally representative. Its selected items are present in
   the first 187-record state, but this batch does not imply that the selection
   exhausts the initial notes.
4. The July 5 raw capture still identifies itself as Beta 2 and has no issue
   record differences from the June 24 Beta 2 state. The next raw capture,
   taken July 10 before the seed's July 11 Beta 3 v2 date, identifies itself as
   Beta 3 and provides the clean Beta 2-to-Beta 3 comparison used here.
5. The shared Apple document is not treated as blanket cross-platform proof.
   Records that expressly name iPhone, iPad, iOS, or a device family are scoped
   to the supported route.
6. All published wording is original synthesis. Necessary platform, framework,
   API, and feature names are nominative references; no Apple list text,
   screenshot, or marketing paragraph is reproduced.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers third-party passkeys, authentication settings,
Foundation grammar agreement, managed media, stickers, wired 802.1X, resumable
uploads, EAP-TLS 1.3, App Transport Security, NewsstandKit removal, Photos
editing output, StoreKit views and subscription state, Swift Charts, SwiftUI
animation behavior, and Lock Screen widgets. The iOS route adds Assistive
Access, Check In, Live Voicemail, Lockdown Mode, MetalFX, StandBy, and an
iPhone wallpaper issue. The iPadOS route adds older-device AirPlay and cellular
issues, Stage Manager, iPad wallpaper, and trackpad widget placement.

### Beta 2 selected delta

The shared delta includes AirPlay discovery, an App Intents-related Shortcuts
failure, Freeform cross-beta drawings, Home widgets, ImageIO, suggested event
and reminder titles, Screen Time, SwiftData, SwiftUI, UIKit, and Vision. In-car
SharePlay is retained only on iOS, while the 2017-model software-update failure
is retained only on iPadOS.

### Beta 3 selected delta

The shared delta covers MP3 metadata, FaceTime handoff and Apple TV calling,
Health medications, Mail, Notes, privacy-state propagation, passcode settings,
Freeform stickers, StoreKit, ShazamKit, SKAdNetwork, and Vision. iOS carries
Assistive Access calling, Android-shared car keys, CarPlay, Home widget
migration, Android device migration, and StandBy. iPadOS carries Classroom
AirDrop and the explicitly scoped Center Stage issue.

## Raw snapshot audit ledger

Raw transports are research provenance only:

| State                  | Raw capture      | Records | SHA-256                                                            | Public citation                                                                                                                                         |
| ---------------------- | ---------------- | ------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta 1                 | `20230605212152` |     187 | `b1ce041f65d8c76cfe6dcc16cb3e9685c495534f711d1aedad07d8e07396e062` | [Apple page](https://web.archive.org/web/20230605212151/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
| Beta 2                 | `20230624091109` |     212 | `32d713cca1becdbfc688727761acf7db5a61f4e80d226f2c9df53655e8bc7de3` | [Apple page](https://web.archive.org/web/20230624091108/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
| July 5 unchanged state | `20230705210800` |     212 | `5e5b735e61e22f9dccfb3f4dcfb38d3d6b689abdfb672fe59b6c5ff6f48c9178` | [Apple page](https://web.archive.org/web/20230705210759/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
| Beta 3                 | `20230710001130` |     244 | `102140dc50b249809a2c8bff184e904bb6eed10272b85eada575d84ac81c24a0` | [Apple page](https://web.archive.org/web/20230710001128/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
| Beta 8 audit           | `20230901004211` |     282 | `f6eb9f657d4115922c0835c731bd2602143228e567b9d31d044f45d43cd684fc` | [Apple page](https://web.archive.org/web/20230901004210/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |
| RC audit               | `20230912200640` |     282 | `f91cf1eac71864508ef2b2ac9ce1d70609ff808c6312bd34f107ab35829bbcb6` | [Apple page](https://web.archive.org/web/20230912200639/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) |

Exact parsed comparisons:

- Beta 1 to Beta 2: 30 additions, 5 removals, and 14 changed issue records.
- June 24 Beta 2 to July 5 capture: zero additions, removals, or changed issue
  records; the document title also remains Beta 2.
- July 5 Beta 2 to July 10 Beta 3: 32 additions, zero removals, and 2 changed
  issue records.
- Beta 3 to Beta 8: 45 additions, 7 removals, and 140 changed issue records
  across several unretained milestones; this interval is audit-only.
- Beta 8 to RC: zero additions, removals, or changed issue records. The raw
  payload hash changes because the document metadata identifies RC, not because
  a substantive issue record changes.

## Unsupported archive boundary

No retained raw states isolate Beta 3 v2, Public Beta 1, Beta 4, Beta 4 v2,
Beta 5, Beta 6, or Beta 7. The Beta 3-to-Beta 8 comparison crosses every one of
those boundaries, so none of its additions or status changes is assigned to an
individual route.

The RC capture is a 282-record state with no issue-record differences from the
retained Beta 8 state. This batch does not manufacture a release-identity
change merely from the document title. Beta 8 and RC therefore remain
ledger-only in this pass.

## Exact evidence gaps

- No complete first-party build-number set was independently retained, so this
  batch creates no build records and makes no build claims.
- The local seed notes a shared build on Beta 3 v2 and Public Beta 1. Those seed
  annotations do not substitute for a retained release-note boundary.
- The existing Public route is already owned by the approved
  `apple-ios-ipados-17.json` batch and is not modified.
- The July 10 capture is assigned to Beta 3 because it identifies itself as
  Beta 3 and predates the seed's July 11 Beta 3 v2 event. No content is
  projected into the later revision or public-beta route.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS & iPadOS 17 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20230605212151/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 17 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20230624091108/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 17 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20230710001128/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-17-release-notes) — Apple Developer via Internet Archive; archive.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against both local 17.0 seed records and all 26 milestones
- Exact six-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 119 occurrences resolve to exactly 71
  stable local definitions
- Explicit rejection of identity, build, and TestFlight administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `c2411889fc4b2b0bb708487a78251292af9e9cf2d0ff68a18881fdc90c46b7e2`

## Publication and validation record

The generator's seed, route, collision, review-state, and citation guards pass
before either artifact is written.

Editorial and publication record:

- all 6 event articles and all 119 occurrences were approved at
  `2026-07-30T08:09:31Z`
- applied production plan:
  `bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655`
- plan artifact:
  `launch-content-plan-bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655.json`;
  SHA-256
  `9ac408a472263a3e694925d406d9a927765b6ba847b2d2ee71aa7f1c7ecbd56e`
- rollback artifact:
  `launch-content-rollback-bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655.json`;
  SHA-256
  `e669dd95a55e8167371dcf719d2daf645124d6b289601f680fb5cca668bca364`
- Sanity transaction: `F0eE6eK5XyVXtlnaoyBct9`
- receipt:
  `launch-content-receipt-bd0ac4ffdb8dfc7c576df603554c4832a9146ecf9fb50f3f526b3f6ed541f655.json`;
  SHA-256
  `1edc8f56235ba997899d06ed914ba17c2f26e415f4ec70d93070b3991a98ddc0`
- immediate post-publication zero plan:
  `bf68f0604d5a514ebc5e976d2e82b74f690afeb7bafd57cf87dfdebef4990e98`;
  0 mutations and 2,157 unchanged documents
- zero-plan artifact:
  `launch-content-plan-bf68f0604d5a514ebc5e976d2e82b74f690afeb7bafd57cf87dfdebef4990e98.json`;
  SHA-256
  `25f9b904902a18cecdaadba2fbd0e107222923c57f7c9f8109b906fbecd13a5c`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 339 full articles, 256 source-linked records, and 1,384
  timeline-only records
- 490 appearances have approved structured changes

## Canonical route verification

Root verification fetched all six canonical local routes after publication:

| Canonical route              | HTTP | Article                      | References | Robots        |
| ---------------------------- | ---: | ---------------------------- | ---------- | ------------- |
| `/apple/ios/17.0/beta-1/`    |  200 | Preserved release-note state | yes        | index, follow |
| `/apple/ios/17.0/beta-2/`    |  200 | Preserved release-note state | yes        | index, follow |
| `/apple/ios/17.0/beta-3/`    |  200 | Preserved release-note state | yes        | index, follow |
| `/apple/ipados/17.0/beta-1/` |  200 | Preserved release-note state | yes        | index, follow |
| `/apple/ipados/17.0/beta-2/` |  200 | Preserved release-note state | yes        | index, follow |
| `/apple/ipados/17.0/beta-3/` |  200 | Preserved release-note state | yes        | index, follow |

All 6 routes rendered the archival article and References section with
`index, follow`; none rendered the timeline-only placeholder or `noindex`.

Verification on 2026-07-30:

- `npm run research:validate`: 50 batches validated; this batch reports 6
  events, 119 change occurrences, 4 sources, and
  395 citation references
- focused ingestion/manifest suite: 19 tests passed
- 92 issue-ID locator, status-heading, and adjacent-boundary checks against the
  three retained raw snapshots: passed
- copyright-similarity scan: the longest contiguous overlap between editorial
  fields and Apple list records was 8 words
- ESLint, Prettier check, and `git diff --check`: passed
- deterministic regeneration: SHA-256 remained `c2411889fc4b2b0bb708487a78251292af9e9cf2d0ff68a18881fdc90c46b7e2`
- final production dry run: the same
  `bf68f0604d5a514ebc5e976d2e82b74f690afeb7bafd57cf87dfdebef4990e98`
  zero plan, with 0 mutations, 2,157 unchanged documents, and a 16-byte
  mutation payload

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-ipados-17-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-17-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-17-prerelease.mjs scripts/research-batches/apple-ios-ipados-17-prerelease.json scripts/research-batches/apple-ios-ipados-17-prerelease.md
```

This finalization records an already completed publication. It does not perform
or request another Sanity mutation.
