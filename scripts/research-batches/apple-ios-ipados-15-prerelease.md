# Apple iOS and iPadOS 15 prerelease archive batch

## Result

`apple-ios-ipados-15-prerelease.json` publishes source-backed archival articles for sixteen existing
iOS and iPadOS 15.0 prerelease routes: Beta 1 through Beta 8 on each platform.

- 16 substantive event overlays and no release-version overlays
- 154 change occurrences across 88
  stable, collision-checked definitions
- 7 declared and used sources with 570 citation
  references
- no build records, build-number claims, route creation, public-route changes,
  TestFlight changes, or administrative identity changes
- every event is `editoriallyVerified`, `approved`, and
  `isIndexable: true`, with review timestamp `2026-07-30T08:22:43Z`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               16 |
| iOS      | Beta 2    | `beta-2`       |               15 |
| iOS      | Beta 3    | `beta-3`       |               15 |
| iOS      | Beta 4    | `beta-4`       |               13 |
| iOS      | Beta 5    | `beta-5`       |                6 |
| iOS      | Beta 6    | `beta-6`       |                5 |
| iOS      | Beta 7    | `beta-7`       |                6 |
| iOS      | Beta 8    | `beta-8`       |                2 |
| iPadOS   | Beta 1    | `beta-1`       |               15 |
| iPadOS   | Beta 2    | `beta-2`       |               17 |
| iPadOS   | Beta 3    | `beta-3`       |               14 |
| iPadOS   | Beta 4    | `beta-4`       |               11 |
| iPadOS   | Beta 5    | `beta-5`       |                7 |
| iPadOS   | Beta 6    | `beta-6`       |                4 |
| iPadOS   | Beta 7    | `beta-7`       |                6 |
| iPadOS   | Beta 8    | `beta-8`       |                2 |

The local seed contains 24 iOS/iPadOS 15.0 milestones. This batch publishes the
sixteen developer-beta routes above. Beta 2 Update, Public Beta 1, RC, and
Public remain outside this archive pass.

## Archive method

1. Reader-facing citations point to preserved Apple Developer documentation,
   never to raw DocC JSON.
2. Raw DocC states were parsed by component, status heading, issue ID, and
   normalized text. Every later-beta occurrence must sit beneath a heading that
   explicitly names that beta. Generic Known Issues, generic Deprecations, and
   broad cumulative additions are excluded.
3. Beta 1 is intentionally representative. Its selected items are present
   beneath the initial beta heading in the first 146-record state, but this
   batch does not imply that the selection exhausts the initial notes.
4. The preserved states skip some adjacent releases. Where an interval crosses
   two milestones, the diff is audit context only; exact beta-named headings,
   not the crossed-gap comparison, provide the occurrence-level attribution.
5. The shared Apple document is not treated as blanket cross-platform proof.
   Records expressly naming iPhone, iPad, Phone, CarPlay, Health, Workout,
   multiwindow, or hardware-keyboard behavior are scoped to the supported
   route.
6. All published wording is original synthesis. Necessary platform, framework,
   API, and feature names are nominative references; no Apple list text,
   screenshot, or marketing paragraph is reproduced.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers StoreKit 2, Create ML, Foundation grammar and
formatting, JSON5, Swift signposting, request-language fallback, Record App
Activity, SKAdNetwork, attributed strings, asynchronous notifications,
Markdown in SwiftUI, animation threading, TabularData, and UIKit keyboard
behavior. The iOS route also retains Apple's iOS-scoped Audio Unit interface.

### Beta 2 exact-heading selection

The shared Beta 2 set covers StoreKit renewal status, FaceTime, Focus, iCloud
Private Relay and account recovery, Record App Activity, Safari, Shortcuts,
third-party microphone modes, and UIKit Markdown. iOS adds Health Sharing and
CarPlay fixes. iPadOS adds widget layout, keyboard shortcuts, Quick Note
sharing, and Schoolwork.

### Beta 3 and Beta 4 retained headings

Beta 3 includes StoreKit, passkey simulation, Live Text, Find My, PDF text,
Thread accessories, widgets, Private Relay, privacy logs, Safari viewport
units, low-storage updates, translation privacy, and SharePlay. Platform-only
items cover Health and Workout on iOS and pinned-widget migration on iPadOS.

Beta 4 includes StoreKit sandbox repairs, Matter hub support, Private Relay,
Maps, Record App Activity, Safari, SharePlay privacy, and SwiftUI
compatibility. CarPlay, Weather, the phone Safari tab bar, and paired-watch
stability stay on iOS; widget-gallery and Safari scrolling fixes stay on
iPadOS.

### Beta 5 through Beta 8 retained headings

The later headings cover SwiftUI animation, interaction shapes, URL handling,
tasks, text layout, and iPad sidebar behavior in Beta 5; StoreKit, SwiftUI
safe-area behavior, and the phone Safari layout in Beta 6; Private Relay,
Focus, Maps, VPN compatibility, telephony, Safari, Files, and keyboard fixes
in Beta 7; and two Custom Email Domain repairs in Beta 8.

## Raw snapshot audit ledger

Raw transports are research provenance only:

| State               | Raw capture      | CDX digest                         | CDX length | Records | Decoded SHA-256                                                    | Public citation                                                                                                                                              |
| ------------------- | ---------------- | ---------------------------------- | ---------: | ------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Beta 1              | `20210612230308` | `NJIVSFUOZQ6RAKNHIO4OUOBF23F4BFAH` |     26,798 |     146 | `94496d23c566c468bbab4624a37be27bf710bdfd04c5aa97883bffc591a08096` | [Apple page](https://web.archive.org/web/20210612230307/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) |
| Beta 2 title state  | `20210714160642` | `OPVEDTDAGLQJHVEFWUVDBAAXWANO5QOG` |     32,317 |     195 | `5c1b9a202a192c70e40ae6a471f2e95c48bcc78bc45cde2f7512a2e0502e2a1f` | [Apple page](https://web.archive.org/web/20210714160635/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) |
| Beta 4              | `20210727223431` | `CUJ73NSJCGFMETJGS6LAISCZUQOL2V6Z` |     36,745 |     238 | `09d9c17c4172e5f7453acc9e1b54853b1e68cd4c97a7f68382d5903d8cbed996` | [Apple page](https://web.archive.org/web/20210727223431/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) |
| Beta 4 August state | `20210804024502` | `OPXP4T4KXYRV2PMID6ZR6SLHKN5UJ7NE` |     37,023 |     238 | `dbea5b7c11d4f9ee343f6f52c2c5351400d0fef580f088519fa605893e18fd3d` | [Apple page](https://web.archive.org/web/20210804024501/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) |
| Beta 6              | `20210822111415` | `JZDQLWEYSX5P3W7EG7D42SCOPF7B4DOW` |     39,261 |     242 | `ccc83c4a2b258099a23191df7ad111cf5ee1b59d265abc067bff145d362fe763` | [Apple page](https://web.archive.org/web/20210822111412/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) |
| Beta 8 title state  | `20210914131936` | `3QM3GXF26ONGBBJZDMFJHL2E6QVQ4WHL` |     39,439 |     250 | `0a78a9f0af9c7052197093bb9097efa747ec7bd453192680315e831900d37af7` | [Apple page](https://web.archive.org/web/20210914131935/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) |

Exact parsed comparisons:

- Beta 1 to the retained Beta 2 title state: 53 additions, 5 removals, and 84
  changed issue records.
- Beta 2 title state to Beta 4: 46 additions, 3 removals, and 73 changed issue
  records. This interval crosses Beta 3 and Beta 4 and is not used as a broad
  milestone delta.
- July 27 Beta 4 to August 4 Beta 4: zero additions, zero removals, and 3
  changed issue records. Issue `79729460` moves beneath the exact Beta 4
  resolved heading.
- August 4 Beta 4 to Beta 6: 18 additions, 14 removals, and 9 changed issue
  records. This interval crosses Beta 5 and Beta 6.
- Beta 6 to the retained Beta 8 title state: 8 additions, zero removals, and 11
  changed issue records. This interval crosses Beta 7 and Beta 8.

## Exact evidence gaps

- The June 30 Beta 2 Update and Public Beta 1 seed routes share a seed build
  annotation, but no retained Apple note state isolates either route. Neither
  receives an overlay, and the annotation is not promoted into a build record.
- The July 14 raw capture still identifies itself as Beta 2 even though its
  capture date matches the local Beta 3 date. Beta 2 attribution relies on its
  exact Beta 2 status headings, not on the capture date.
- No retained state identifies itself as RC. The September 14 raw capture
  still carries the Beta 8 title, so it is not projected onto the RC route.
- No complete independently retained first-party build set was found. This
  batch creates no build records and makes no build-number claims.
- The existing Public routes are already owned by the approved
  `apple-ios-ipados-15.json` batch and are not modified.
- Generic Known Issues, unqualified Deprecations, and the explicitly
  TestFlight-related Beta 6 item are ledger-only even when retained in a raw
  state.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS & iPadOS 15 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20210612230307/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 15 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20210714160635/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 15 Beta 4 Release Notes (preserved snapshot)](https://web.archive.org/web/20210727223431/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 15 Beta 4 Release Notes — August 4 state (preserved snapshot)](https://web.archive.org/web/20210804024501/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 15 Beta 6 Release Notes (preserved snapshot)](https://web.archive.org/web/20210822111412/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 15 Beta 8 Release Notes (preserved snapshot)](https://web.archive.org/web/20210914131935/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-15-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against both local 15.0 seed records and all 24 milestones
- Exact sixteen-route allowlist with explicit exclusion of Beta 2 Update,
  Public Beta 1, RC, and Public
- Exact beta-named heading required in every occurrence locator and
  verification method
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 154 occurrences resolve to exactly 88
  stable local definitions
- Explicit rejection of identity, build, and TestFlight administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `fda90b1758c5ac6361a8965fd996e40a69f6f2c960560799e1b28263ffbf485b`

## Publication and validation record

The generator's seed, route, collision, review-state, exact-heading, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all six archived payloads were independently replayed; their document titles,
  record counts, decoded SHA-256 values, and all five adjacent comparisons
  matched this ledger exactly
- all 154 occurrence checks and 170 issue-ID references matched the
  exact component and beta-named status heading in the six retained raw
  snapshots
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 7 words between editorial fields and Apple's retained records
- all 16 event articles and all 154 occurrences were approved at
  `2026-07-30T08:22:43Z`

Publication receipt:

- applied production plan:
  `3d5260bf9e826a65f2f6d8d6676f246de83eba2c99ed22fbce2d16e9824fa751`
- reviewed plan artifact SHA-256:
  `ebafd98b855897bb8b2e5766cbdd1169af6d6ef2589267ae658e55ae2b7c6f5a`
- rollback artifact SHA-256:
  `f5b5b87011ab454c19fd574df15447f131572b0b5382a7879d47353406f31c60`
- Sanity transaction: `tt1fSB5HY9GAB0YLyyR0TM`
- receipt SHA-256:
  `5024dec35275e9248a4c8b7db557d8f5bf452c3ff3e647fba2270471474b19b6`
- immediate post-publication zero plan:
  `fc031038072cac58608247df7968c28e5e92f726082731c8719241ad2e58f2d5`;
  zero mutations, 2,177 unchanged documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `14576b5cfc77f5a1b60d6456dc71690b4b4312ed6541d9f5b34d44d18dfad2bd`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 361 full articles, 256 source-linked records, and 1,362
  timeline-only records
- 512 appearances have approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, the “Preserved release-note
evidence” section, References, and `index, follow`; none returned a timeline
placeholder or `noindex`.

| Canonical route              | HTTP | Full article | Evidence | References | Index |
| ---------------------------- | ---: | ------------ | -------- | ---------- | ----- |
| `/apple/ios/15.0/beta-1/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-2/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-3/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-4/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-5/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-6/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-7/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/15.0/beta-8/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-1/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-2/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-3/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-4/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-5/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-6/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-7/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/15.0/beta-8/` |  200 | yes          | yes      | yes        | yes   |

Final verification on 2026-07-30:

- `npm run research:validate`: 51 batches validated; this batch reports 16
  events, 154 change occurrences, 7 sources, and
  570 citation references; 2,721 change keys remain globally
  consistent
- focused ingestion/manifest suite: 19 tests passed
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: SHA-256 remained `fda90b1758c5ac6361a8965fd996e40a69f6f2c960560799e1b28263ffbf485b`
- final production dry run reproduced zero mutations, 2,177 unchanged
  documents, the 16-byte payload, and plan SHA
  `fc031038072cac58608247df7968c28e5e92f726082731c8719241ad2e58f2d5`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-ipados-15-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-15-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-15-prerelease.mjs scripts/research-batches/apple-ios-ipados-15-prerelease.json scripts/research-batches/apple-ios-ipados-15-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-15-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
