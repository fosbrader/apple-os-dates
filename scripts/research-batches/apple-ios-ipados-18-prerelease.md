# Apple iOS and iPadOS 18 prerelease archive batch

## Result

`apple-ios-ipados-18-prerelease.json` records the published source-backed archival articles on
eight existing iOS and iPadOS 18.0 prerelease routes: Beta 1, Beta 2, Beta 3,
and Beta 3 v2 for each platform.

- 8 substantive event overlays and no release-version overlays
- 80 change occurrences across 48
  stable, collision-checked definitions
- 5 declared and used sources with 292 citation
  references
- no build records, build-number claims, route creation, public-route changes,
  or administrative identity changes
- every event is `editoriallyVerified`, `approved`, and
  `isIndexable: true`, with review timestamp `2026-07-30T07:45:17Z`

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               14 |
| iOS      | Beta 2    | `beta-2`       |               13 |
| iOS      | Beta 3    | `beta-3`       |               12 |
| iOS      | Beta 3 v2 | `beta-3-v2`    |                2 |
| iPadOS   | Beta 1    | `beta-1`       |               12 |
| iPadOS   | Beta 2    | `beta-2`       |               13 |
| iPadOS   | Beta 3    | `beta-3`       |               13 |
| iPadOS   | Beta 3 v2 | `beta-3-v2`    |                1 |

The local seed contains 24 iOS/iPadOS 18.0 milestones. This batch publishes
only the eight routes above. Beta 4, Beta 4 v2, Beta 5, Beta 6, Beta 7, Beta
8, RC, and Public remain outside this prerelease archive pass unless they have
separately reproducible milestone evidence.

## Archive method

1. Reader-facing citations point to preserved Apple Developer documentation,
   never to raw DocC JSON.
2. Raw DocC states were parsed by component, status heading, issue ID, and
   normalized text. Beta 2 and Beta 3 selections require either a newly added
   issue ID or an exact status transition against the immediately preceding
   retained state.
3. Beta 1 is intentionally representative. Its selected items are present in
   the first 196-record state, but this batch does not imply that the selection
   exhausts the initial notes.
4. The July 15 state contains exactly two additions against the earlier Beta 3
   state. RCS is limited to iOS; the mixed-beta Home Utility-account issue is
   retained on both routes.
5. The shared Apple document is not treated as blanket cross-platform proof.
   Items naming iPhone, iPad, iOS, or a device family are scoped accordingly.
6. All published wording is original synthesis. Necessary platform, framework,
   and feature names are nominative references; no Apple list text, screenshot,
   or marketing paragraph is reproduced.

## Selected findings

### Beta 1 representative baseline

The shared baseline covers AdAttributionKit re-engagement, MapKit place APIs,
allocator compatibility, RealityKit rendering, StoreKit subscription metadata
and deprecation, Swift Charts plotting, SwiftUI sizing/isolation/value APIs,
and Translation. iOS additionally carries Messages via satellite, Siri vehicle
audio, and Today View extension removal. iPadOS carries its explicitly scoped
top-tab-bar behavior.

### Beta 2 selected delta

The shared delta includes higher on-demand resource limits, Bluetooth audio and
container fixes, iPhone/iPad camera startup, HealthKit workout routes, iCloud
Drive data use, Photos syncing, SwiftUI sheet sizing, and direct timer-register
compatibility. The platform-specific selections keep iPhone Files, Wallet,
Always-On display, and RCS items off iPadOS while keeping iPad tab, scanning,
Math Notes, and RealityKit issues off iOS.

### Beta 3 selected delta

The shared delta covers FaceTime, keyboard settings, storage reporting,
Shortcuts, Swift Charts, SwiftUI, StoreKit accessibility, Photos services, and
RealityKit. The RCS status transition, iPhone Mirroring, and Wi-Fi Calling
remain iOS-only. The right-to-left tab transition, M4 Sound Recognition,
handwriting, and Math Notes remain iPadOS-only.

### July 15 Beta 3 v2 state

The July 15 comparison is exhaustive at this boundary: issue `130850945`
adds the mixed-beta Home Utility-account known issue, and issue `131499640`
adds RCS carrier availability. No issue records were removed or otherwise
changed.

## Raw snapshot audit ledger

Raw transports are research provenance only:

| State         | Raw capture      | Records | SHA-256                                                            | Public citation                                                                                                                                         |
| ------------- | ---------------- | ------: | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Beta 1        | `20240612190904` |     196 | `473ade4c3c4f8dbdd46fa0bb027728c6f0878418788c4cadce5a97e13e3f49bb` | [Apple page](https://web.archive.org/web/20240613151040/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) |
| Beta 2        | `20240630111940` |     219 | `a566f5a628da551d31c4e1c765a18f0fb051c6fc578169e04d7fa31598a59149` | [Apple page](https://web.archive.org/web/20240630111940/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) |
| Beta 3        | `20240709144845` |     227 | `d4ff2cdbaabf341f1bcff684bba70421b52640f0eb15c476cd982cceef5a5f0c` | [Apple page](https://web.archive.org/web/20240710002802/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) |
| July 15 state | `20240715174636` |     229 | `26f9be3b9af1b3695a0b93514c30cbc4c6a582c719a8e49a01976c1784b0a25a` | [Apple page](https://web.archive.org/web/20240715174626/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) |

## Unsupported archive boundary

The human capture at [`20240815005927`](https://web.archive.org/web/20240815005927/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) identifies itself as
Beta 6, and CDX still advertises a distinct raw capture at
`20240815005934`. The current raw replay, however, redirects to
`20240823034057` and returns the same 254-record Beta 7 payload with SHA-256
`f14bc3d63e25ac8e2530f71e97586a02b2a33f319f292a84dfe019fbf3e8976f`.
The retained Beta 6 payload is therefore unavailable for reproducible
comparison.

The Beta 3-to-Beta 6 interval also crosses Beta 4, Beta 4 v2, Beta 5, and Beta 6. No addition or status change across that gap is assigned to one of those
routes. Beta 7 is omitted as well: remembered issue IDs are not substituted for
the missing before-state.

## Exact evidence gaps

- No complete first-party build-number set was independently retained, so this
  batch creates no build records and makes no build claims.
- Beta 4, Beta 4 v2, Beta 5, Beta 6, Beta 7, Beta 8, and RC lack a clean
  adjacent-state comparison in this audit and receive no overlay.
- The existing Public route is already owned by the approved
  `apple-ios-ipados-18.json` batch and is not modified.
- The July 15 Apple document title remains “Beta 3 Release Notes.” Its two-item
  delta is assigned to the existing Beta 3 v2 route by the captured state
  boundary, without inferring a revision build or public-beta payload.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS & iPadOS 18 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20240613151040/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 18 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20240630111940/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 18 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20240710002802/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 18 Beta 3 Release Notes — July 15 state (preserved snapshot)](https://web.archive.org/web/20240715174626/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes) — Apple Developer via Internet Archive; archive.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against both local 18.0 seed records and all 24 milestones
- Exact eight-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 80 occurrences resolve to exactly
  48 stable local definitions
- Explicit rejection of identity, build, and TestFlight administrative change
  keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `fb88bd42aa5e5fd896872748e0c1836f3c3ec2426f3cde7998f66e073bb99d0a`

## Publication and validation record

The generator’s seed, route, collision, review-state, and citation guards pass
before either artifact is written.

Editorial and publication record:

- all 8 event articles and all 80 occurrences were approved at
  `2026-07-30T07:45:17Z`
- reviewed production plan:
  `8db88f461ef9e5eb0c77c63fe2ec1cb3f9297004efc8a67d6908852d680c5562`
- reviewed plan artifact SHA-256:
  `5803407ef7c50c38b04f59c0c3170a9420b354d54695e76f80d4b7311ec7859a`
- rollback artifact SHA-256:
  `e3bd3a071b06f60a5bc5b57db675d3fe1adcd72e68a9e8a6b55ebbe83103fdf8`
- Sanity transaction: `F0eE6eK5XyVXtlnaoy9yHx`
- receipt SHA-256:
  `c64a7e2fcf0a899950775af0ea5c0ffe406e821282ba8ea5d10860910672fe21`
- post-publication zero plan:
  `a76c5e748bac368028ec3d3844e6cca902ce8f987301077a3c576450dc1722de`;
  0 mutations and 2,135 unchanged documents

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 319 full articles, 256 source-linked records, and 1,404
  timeline-only records
- 470 appearances have approved structured changes

## Settled canonical route verification

After the 60-second Next.js/Sanity cache window, every canonical local route
was fetched independently from the running site. Each response contained the
expected production canonical URL, `index, follow` robots metadata, Full
article mode, the What changed article, the References section, and the
Editorially verified marker.

| Canonical route                 | HTTP |   Bytes | Full | Index | References | Article | Verified |
| ------------------------------- | ---: | ------: | ---- | ----- | ---------- | ------- | -------- |
| `/apple/ios/18.0/beta-1/`       |  200 | 387,477 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ios/18.0/beta-2/`       |  200 | 381,647 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ios/18.0/beta-3/`       |  200 | 365,276 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ios/18.0/beta-3-v2/`    |  200 | 194,459 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ipados/18.0/beta-1/`    |  200 | 353,462 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ipados/18.0/beta-2/`    |  200 | 381,861 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ipados/18.0/beta-3/`    |  200 | 382,398 | yes  | yes   | yes        | yes     | yes      |
| `/apple/ipados/18.0/beta-3-v2/` |  200 | 177,697 | yes  | yes   | yes        | yes     | yes      |

Verification on 2026-07-30:

- `npm run research:validate`: 47 batches validated; this batch reports 8
  events, 80 change occurrences, 5 sources, and 292 citation references
- focused ingestion/manifest suite: 19 tests passed
- 94 issue-ID locator checks against the four retained raw snapshots: passed
- retained snapshot closure: 196, 219, 227, and 229 records with SHA-256 values
  exactly matching the raw snapshot ledger above
- ESLint, Prettier check, and `git diff --check`: passed
- deterministic regeneration: SHA-256 remained `fb88bd42aa5e5fd896872748e0c1836f3c3ec2426f3cde7998f66e073bb99d0a`

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-ipados-18-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-18-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-18-prerelease.mjs scripts/research-batches/apple-ios-ipados-18-prerelease.json scripts/research-batches/apple-ios-ipados-18-prerelease.md
```

This finalization records an already completed publication. It does not perform
or request another Sanity mutation.
