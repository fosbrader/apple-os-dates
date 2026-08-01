# Apple iOS and iPadOS 14 prerelease archive batch

## Result

`apple-ios-ipados-14-prerelease.json` publishes primary-source-backed archival articles for eight
existing iOS and iPadOS 14.0 routes: Beta 1 through Beta 4 on each platform.

- 8 substantive event overlays and no release-version overlays
- 137 change occurrences across 76
  stable, collision-checked definitions
- 4 declared and used sources with 604 citation
  references
- zero builds, build-number claims, route creation, GM changes, Public-route
  changes, or administrative identity changes
- every event is `editoriallyVerified`, `approved`, and
  `isIndexable: true`, with review timestamp `2026-07-30T08:31:50Z`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               15 |
| iOS      | Beta 2    | `beta-2`       |               18 |
| iOS      | Beta 3    | `beta-3`       |               17 |
| iOS      | Beta 4    | `beta-4`       |               21 |
| iPadOS   | Beta 1    | `beta-1`       |               12 |
| iPadOS   | Beta 2    | `beta-2`       |               18 |
| iPadOS   | Beta 3    | `beta-3`       |               15 |
| iPadOS   | Beta 4    | `beta-4`       |               21 |

The local seed contains 20 iOS/iPadOS 14.0 milestones. This batch publishes
only the eight routes above. Beta 5, Beta 6, Beta 7, Beta 8, GM, and Public
remain outside this prerelease archive pass.

## Archive method

1. An uncollapsed Internet Archive CDX query was run over the Apple Developer
   iOS/iPadOS release-note DocC prefix for calendar year 2020.
2. That inventory returns one raw 14.0 beta payload:
   `20200810155919`, captured after Beta 4 and before Beta 5. Its decoded title
   is “iOS & iPadOS 14 Beta 4 Release Notes.”
3. The cumulative payload explicitly separates “Updates in iOS & iPadOS 14
   beta,” beta 2, and beta 3, while its leading section is the Beta 4 state.
   Records were parsed by component, exact milestone-named status heading, and
   issue ID.
4. Because no adjacent raw states survive, no diff is claimed. Attribution is
   limited to records under exact “New Features in … beta N” or “Resolved in …
   beta N” headings.
5. Generic known issues, unlabeled cumulative records, bounty administration,
   records without issue IDs, and milestones after Beta 4 were excluded.
6. Shared Apple documentation was not treated as blanket cross-platform proof.
   Explicit iPhone, cellular, HealthKit, CarPlay, 3D Touch, Exposure
   Notification, App Library, PencilKit, and iPad hardware language determines
   route scope.

## Selected findings

### Beta 1 baseline

The representative initial set covers StoreKit installation and sandbox
controls, stereo audio input, multilingual keyboards, Swift-native logging,
HTTP/3 testing, Safari translation, SwiftUI alignment, and Voice Control.
iOS additionally retains HealthKit, ECG, and CarPlay records.

### Beta 2 milestone headings

The exact Beta 2 headings support accessibility, ARKit, haptics, location
privacy, Maps, Messages, Screen Time, Siri, SwiftUI, Weather, and widget
changes. HealthKit and carrier calling remain iOS-only; PencilKit and the
explicit iPad calling workflow remain iPadOS-only.

### Beta 3 milestone headings

The exact Beta 3 headings cover AVFoundation, Low-Latency HLS, location
contracts, Apple Music sharing, HTTP/3 compatibility, RealityKit, tracking
privacy, Shortcuts, SwiftUI, Translate, and widgets. Compact-banner calling and
carrier junk-call filtering remain iOS-only.

### Beta 4 milestone headings

The self-identifying Beta 4 state covers App Store, DeviceCheck, HomeKit, Mail,
networking, FaceTime, Software Update, SwiftUI, and widget repairs. iOS carries
3D Touch, Exposure Notification, and App Library records; iPadOS carries
LiDAR measurement, Notes keyboard interaction, and pointer-hover records.

## Raw snapshot audit ledger

The decoded SHA-256 is calculated over the payload serialized by
`JSON.stringify`, matching `audit-docc-snapshots.mjs`.

| State             | Raw capture      | CDX digest                         | CDX length | DocC title                           | Records | Decoded SHA-256                                                    | Public citation                                                                                                                                              |
| ----------------- | ---------------- | ---------------------------------- | ---------: | ------------------------------------ | ------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Beta 4 cumulative | `20200810155919` | `U7B55MEXFADXH6ECPNFWD4L4QZP7JZK3` |     21,469 | iOS & iPadOS 14 Beta 4 Release Notes |     172 | `6c1f155a00def504d5ff7b01852570f598a6457aa19cecad35e196198f9923fc` | [Apple page](https://web.archive.org/web/20200807235724/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes) |

Exact raw replay: [Apple DocC transport payload](https://web.archive.org/web/20200810155919id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes.json).

Sequential calendar checks:

- Beta 1 (June 22) precedes the retained July 3 human shell, which precedes
  Beta 2 (July 7).
- Beta 3 (July 22) precedes the retained July 26 human shell, which precedes
  Beta 4 (August 4).
- Beta 4 precedes both the August 7 human shell and August 10 raw payload; the
  raw payload precedes Beta 5 (August 18).
- The sole raw state crosses earlier milestones, so exact milestone headings,
  not capture chronology or a synthetic diff, are the attribution boundary.

## Exact evidence gaps

- CDX returns no raw 14.0 beta state before August 10 and no later 14.0 beta
  state. Earlier human shells do not expose an independently retained payload.
- Beta 2 is not isolated by adjacent captures. Its entries are used only when
  the retained body names Beta 2 in the exact status heading.
- Beta 5 through Beta 8 and GM have no retained milestone-labeled raw state in
  the audited prefix inventory, so they remain ledger-only gaps.
- Public is already owned by `apple-ios-ipados-14.json` and is untouched.
- No complete first-party build-number set was independently retained. The
  batch creates no build documents and makes no build assertions.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS & iPadOS 14 beta documentation — July 3 shell (preserved snapshot)](https://web.archive.org/web/20200703101020/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 14 beta documentation — July 26 shell (preserved snapshot)](https://web.archive.org/web/20200726024530/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 14 Beta 4 Release Notes (preserved cumulative snapshot)](https://web.archive.org/web/20200807235724/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14-beta-release-notes) — Apple Developer via Internet Archive; archive.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against both local 14.0 seed records and all 20 milestones
- Exact eight-route allowlist with explicit exclusion of Public and every
  unsupported later prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 137 occurrences resolve to exactly
  76 stable local definitions
- Explicit rejection of identity, build, TestFlight, and administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `8ee14b2e9d89fa55f0b47184deb2d4f0b676c521c40c21253939adb9e9166238`

## Publication and validation record

The generator's seed, route, collision, review-state, exact-heading, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- the sole retained raw payload was independently replayed; its title,
  172-record count, and decoded SHA-256 matched this ledger exactly
- all 137 occurrence checks and 139 issue-ID assertions matched the
  exact component and milestone-named status heading in the retained raw state
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 6 words between editorial fields and Apple's retained records
- all eight event articles and all 137 occurrences were approved at
  `2026-07-30T08:31:50Z`

Publication receipt:

- applied production plan: `6568a87ef30747ff7c8ce7d37c8b3702acc43789b5703338e12b4c605b405175`
- reviewed plan artifact SHA-256: `62b448d15984ab58aef46cf55b1b76eebd603b5562b99b283e42313133c91e58`
- rollback artifact SHA-256: `85fe2095f06e8ab9bcc2e51dfc6e7cff74e8eb8f756e0aa4ebed831db123f81a`
- Sanity transaction: `F0eE6eK5XyVXtlnaoyCuQL`
- receipt SHA-256: `a85ed5a38e38f63966338cf85ae757e99e176dd136b8b179e0dccbdf2070225e`
- immediate post-publication zero plan:
  `01f956496c29c3cf8abae9e057787363f929df174e5793c32082121a924d9634`; zero mutations,
  2,162 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `3f661cbc3102357fc5539e9b20fd139828b9d65ab101cf7151cb0aa1070ae533`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 369 full articles, 256 source-linked records, and 1,354
  timeline-only records
- 520 appearances have approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, the “Preserved milestone
section,” References, and `index, follow`; none returned a timeline
placeholder or `noindex`.

| Canonical route              | HTTP | Full article | Evidence | References | Index |
| ---------------------------- | ---: | ------------ | -------- | ---------- | ----- |
| `/apple/ios/14.0/beta-1/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/14.0/beta-2/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/14.0/beta-3/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/14.0/beta-4/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/14.0/beta-1/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/14.0/beta-2/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/14.0/beta-3/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/14.0/beta-4/` |  200 | yes          | yes      | yes        | yes   |

Final verification on 2026-07-30:

- `npm run research:validate`: 52 batches validated; this batch reports 8
  events, 137 change occurrences, 4 sources, and
  604 citation references; 2,775 change keys remain globally
  consistent
- full repository suite: 131 tests passed
- all 137 occurrence-level heading checks and 139 issue-ID assertions passed
- independent copyright-similarity scan: maximum contiguous overlap of 6 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 is `8ee14b2e9d89fa55f0b47184deb2d4f0b676c521c40c21253939adb9e9166238`
- final production dry run reproduced zero mutations,
  2,162 unchanged
  documents, the 16-byte payload, and
  plan SHA `01f956496c29c3cf8abae9e057787363f929df174e5793c32082121a924d9634`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-ipados-14-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-14-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-14-prerelease.mjs scripts/research-batches/apple-ios-ipados-14-prerelease.json scripts/research-batches/apple-ios-ipados-14-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-14-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
