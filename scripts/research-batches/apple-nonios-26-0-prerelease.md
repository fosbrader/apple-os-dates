# Apple non-iOS 26.0 prerelease archive research batch

## Result

`apple-nonios-26-0-prerelease.json` enriches seven existing macOS, tvOS, and visionOS prerelease routes whose Apple DocC states are isolated by exact CDX-confirmed raw payload captures.

- The exact seed contains 4 versions, 44 milestones, 4 Public routes, and 40 prerelease routes.
- 7 prerelease routes are included: macOS Betas 1–5, tvOS Beta 1, and visionOS Beta 1.
- 33 prerelease routes remain explicitly unsupported, including all ten watchOS routes.
- The event overlays contain 64 documented and confirmed change occurrences.
- 7 archived Apple sources are declared with Apple Developer as original publisher and `archive` as the preservation class.
- Beta 1 pages use representative initial-state items. Later macOS pages group issue-ID and status transitions only across clean adjacent raw boundaries.
- No version overlay, Public route, build page, route creation, or administrative identity-only change is included. This generator records the completed approval and indexing state but performs no Sanity or application write.

## Exact seed closure

All four seed records contain Beta 1 through Beta 9, RC, and Public. macOS, visionOS, and watchOS Beta 3 are dated July 7, 2025; tvOS Beta 3 is dated July 8. All Public releases are September 15 and are already approved in `scripts/apple-launch-content-2026.json`.

## Archive method

A requested Wayback replay timestamp is not treated as a capture. Only timestamps returned by the Internet Archive CDX index for the raw Apple DocC JSON URL establish a note state. Reader-facing citations use archived human Apple Developer pages; the exact raw `id_` payload URLs are listed below.

Initial Beta 1 pages use the first retained raw 26.0 payload only when it falls after Beta 1 and before Beta 2. These are representative snapshot-state inventories, not exhaustive reproductions of Apple's notes.

Later pages require two exact raw payloads whose interval crosses one and only one seed milestone. Status transitions are matched by Apple issue ID. A disappearance without an explicit replacement is not labeled as fixed. Diffs are grouped into copyright-safe editorial occurrences rather than copying Apple paragraphs.

## Exact reader/raw source alignment

| Evidence state  | Reader-facing archived Apple page                                                                                                                       | Exact raw DocC payload                                                                                                                                                         | Raw Apple title                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| macOS Beta 1    | [20250609212701](https://web.archive.org/web/20250609212701/https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes)       | [20250609212708](https://web.archive.org/web/20250609212708id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26-release-notes.json)       | `macOS Tahoe 26 Beta Release Notes`   |
| macOS Beta 2    | [20250703030442](https://web.archive.org/web/20250703030442/https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes)       | [20250703030443](https://web.archive.org/web/20250703030443id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26-release-notes.json)       | `macOS Tahoe 26 Beta 2 Release Notes` |
| macOS Beta 3    | [20250709070218](https://web.archive.org/web/20250709070218/https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes)       | [20250713024323](https://web.archive.org/web/20250713024323id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26-release-notes.json)       | `macOS Tahoe 26 Beta 3 Release Notes` |
| macOS Beta 4    | [20250726224626](https://web.archive.org/web/20250726224626/https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes)       | [20250727152747](https://web.archive.org/web/20250727152747id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26-release-notes.json)       | `macOS Tahoe 26 Beta 4 Release Notes` |
| macOS Beta 5    | [20250806092738](https://web.archive.org/web/20250806092738/https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes)       | [20250806092740](https://web.archive.org/web/20250806092740id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26-release-notes.json)       | `macOS Tahoe 26 Beta 5 Release Notes` |
| tvOS Beta 1     | [20250616183649](https://web.archive.org/web/20250616183649/https://developer.apple.com/documentation/tvos-release-notes/tvos-26-release-notes)         | [20250616183650](https://web.archive.org/web/20250616183650id_/https://developer.apple.com/tutorials/data/documentation/tvos-release-notes/tvos-26-release-notes.json)         | `tvOS 26 Beta Release Notes`          |
| visionOS Beta 1 | [20250609220322](https://web.archive.org/web/20250609220322/https://developer.apple.com/documentation/visionos-release-notes/visionos-26-release-notes) | [20250609220324](https://web.archive.org/web/20250609220324id_/https://developer.apple.com/tutorials/data/documentation/visionos-release-notes/visionos-26-release-notes.json) | `visionOS 26 Beta Release Notes`      |

## CDX-confirmed raw capture inventory

| Platform | Exact raw timestamps audited                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| macOS    | `20250609212708`, `20250703030443`, `20250713024323`, `20250722192519`, `20250727152747`, `20250806092740`, `20250830132723`, `20250910061613` |
| tvOS     | `20250616183650`, `20250722210758`                                                                                                             |
| visionOS | `20250609220324`, `20250722192518`                                                                                                             |
| watchOS  | `20250722192724`, `20250728022906`, `20250910061618`                                                                                           |

The macOS Beta 4 evidence uses the later July 27 raw state. An intermediate July 22 raw capture falls in the same Beta 4 interval; its only later difference is removal of workaround text from the Xcode Previews issue, which is not promoted as a separate change.

## Forty-route milestone isolation audit

| Platform | Milestone | Alias    | Exact raw boundary or gap                                 | Decision    |
| -------- | --------- | -------- | --------------------------------------------------------- | ----------- |
| macOS    | Beta 1    | `beta-1` | 20250609212708 initial state before Beta 2                | Included    |
| macOS    | Beta 2    | `beta-2` | 20250609212708 → 20250703030443; crosses only Beta 2      | Included    |
| macOS    | Beta 3    | `beta-3` | 20250703030443 → 20250713024323; crosses only Beta 3      | Included    |
| macOS    | Beta 4    | `beta-4` | 20250713024323 → 20250727152747; crosses only Beta 4      | Included    |
| macOS    | Beta 5    | `beta-5` | 20250727152747 → 20250806092740; crosses only Beta 5      | Included    |
| macOS    | Beta 6    | `beta-6` | No raw payload between Beta 5 and Beta 7                  | Unsupported |
| macOS    | Beta 7    | `beta-7` | No raw payload between Beta 6 and Beta 8                  | Unsupported |
| macOS    | Beta 8    | `beta-8` | 20250806092740 → 20250830132723 crosses Betas 6, 7, and 8 | Unsupported |
| macOS    | Beta 9    | `beta-9` | 20250830132723 → 20250910061613 crosses Beta 9 and RC     | Unsupported |
| macOS    | RC        | `rc`     | 20250830132723 → 20250910061613 crosses Beta 9 and RC     | Unsupported |
| tvOS     | Beta 1    | `beta-1` | 20250616183650 initial state before Beta 2                | Included    |
| tvOS     | Beta 2    | `beta-2` | No adjacent raw payload                                   | Unsupported |
| tvOS     | Beta 3    | `beta-3` | No adjacent raw payload                                   | Unsupported |
| tvOS     | Beta 4    | `beta-4` | 20250616183650 → 20250722210758 crosses Betas 2, 3, and 4 | Unsupported |
| tvOS     | Beta 5    | `beta-5` | No later prerelease raw payload                           | Unsupported |
| tvOS     | Beta 6    | `beta-6` | No later prerelease raw payload                           | Unsupported |
| tvOS     | Beta 7    | `beta-7` | No later prerelease raw payload                           | Unsupported |
| tvOS     | Beta 8    | `beta-8` | No later prerelease raw payload                           | Unsupported |
| tvOS     | Beta 9    | `beta-9` | No later prerelease raw payload                           | Unsupported |
| tvOS     | RC        | `rc`     | No later prerelease raw payload                           | Unsupported |
| visionOS | Beta 1    | `beta-1` | 20250609220324 initial state before Beta 2                | Included    |
| visionOS | Beta 2    | `beta-2` | No adjacent raw payload                                   | Unsupported |
| visionOS | Beta 3    | `beta-3` | No adjacent raw payload                                   | Unsupported |
| visionOS | Beta 4    | `beta-4` | 20250609220324 → 20250722192518 crosses Betas 2, 3, and 4 | Unsupported |
| visionOS | Beta 5    | `beta-5` | No later prerelease raw payload                           | Unsupported |
| visionOS | Beta 6    | `beta-6` | No later prerelease raw payload                           | Unsupported |
| visionOS | Beta 7    | `beta-7` | No later prerelease raw payload                           | Unsupported |
| visionOS | Beta 8    | `beta-8` | No later prerelease raw payload                           | Unsupported |
| visionOS | Beta 9    | `beta-9` | No later prerelease raw payload                           | Unsupported |
| visionOS | RC        | `rc`     | No later prerelease raw payload                           | Unsupported |
| watchOS  | Beta 1    | `beta-1` | No raw payload before Beta 2                              | Unsupported |
| watchOS  | Beta 2    | `beta-2` | No raw payload before Beta 3                              | Unsupported |
| watchOS  | Beta 3    | `beta-3` | No raw payload before Beta 4                              | Unsupported |
| watchOS  | Beta 4    | `beta-4` | First raw payload 20250722192724 crosses Betas 1–4        | Unsupported |
| watchOS  | Beta 5    | `beta-5` | No adjacent raw payload                                   | Unsupported |
| watchOS  | Beta 6    | `beta-6` | No adjacent raw payload                                   | Unsupported |
| watchOS  | Beta 7    | `beta-7` | No adjacent raw payload                                   | Unsupported |
| watchOS  | Beta 8    | `beta-8` | No adjacent raw payload                                   | Unsupported |
| watchOS  | Beta 9    | `beta-9` | No adjacent raw payload                                   | Unsupported |
| watchOS  | RC        | `rc`     | 20250728022906 → 20250910061618 crosses Betas 5–9 and RC  | Unsupported |

## Selected content scope

### macOS Beta 1

The first raw state contains 113 Apple note items. Ten representative entries preserve App Store accessibility metadata, Foundation Models access, sparse disk images, Metal 4, IKEv2 cryptographic removals, NSLog privacy behavior, inline audio attachments, StoreKit offers, the higher TLS default, and SwiftUI Find controls.

### macOS Betas 2–5

- Beta 2: the clean diff contains 43 added or status-changed lines and 25 removed or superseded lines, grouped into 10 occurrences. Major areas include Recovery Assistant, AGL removal, passkeys, Background Assets, Foundation Models, Rosetta testing, TextKit, and confirmed system-app status transitions.
- Beta 3: 24 added/status-changed and 16 removed/superseded lines, grouped into 8 occurrences across App Store updates, Background Assets, Foundation Models, Metal, Object Capture, Chart3D, HEVC, and Game Mode.
- Beta 4: 26 added/status-changed and 9 removed/superseded lines, grouped into 8 occurrences across AirPlay, Foundation Models, system apps, StoreKit, Swift Charts, WebKit, and Xcode Previews.
- Beta 5: 21 added/status-changed and 5 removed/superseded lines, grouped into 10 occurrences across Core Data, Foundation Models, controllers, Quick Look, Search, SwiftUI, and TextKit.

The August 30 Beta 8 raw state cannot be assigned because the previous raw state is Beta 5 and the interval crosses Betas 6, 7, and 8. The September 10 RC state cannot be assigned because the previous raw state precedes both Beta 9 and RC. Even though the RC payload changes two issues to Resolved, this batch does not guess which intervening route owns them.

### tvOS Beta 1

The first raw state contains 54 items. Eight representative occurrences cover App Store accessibility metadata, Background Assets, Metal 4, AirPlay stereo-pair playback, RealityKit lookup, StoreKit offers, SwiftUI control sizing, and the hardware boundary for the new tvOS design.

The next raw payload is on July 22 and crosses Betas 2, 3, and 4. It is retained as a gap marker only.

### visionOS Beta 1

The first raw state contains 142 items. Ten representative occurrences cover Foundation Models, ARKit accessory tracking, Background Assets, remote immersive sessions, StoreKit, Chart3D, SwiftUI breakthrough effects, TabletopKit, MV-HEVC decoding, and WidgetKit.

The next raw payload is on July 22 and crosses Betas 2, 3, and 4. It is retained as a gap marker only.

### watchOS

The first raw payload appears on July 22 after Beta 4, and the next July 28 payload remains in the Beta 4 interval. Neither can assign an initial Beta 1 state. The following raw payload is the September 10 RC page, but that boundary crosses Betas 5–9 and RC. All ten watchOS prerelease routes remain unsupported.

## Build and identity boundary

This is an event-page content batch. It does not create build pages or administrative identity-only changes. The archived DocC payloads establish release-note state, not durable build numbers. Existing release-card dates remain untouched; no build/date assertion is introduced into article prose without a separately archived first-party release record.

## Copyright and attribution method

All article text, titles, summaries, and grouped change descriptions are original synthesis. Apple issue identifiers, framework names, API names, and status headings are factual locators. The batch does not reproduce Apple's paragraphs, full item list, workaround wording, screenshots, artwork, or trademark boilerplate. Every structured claim links to an archived human Apple page, and this ledger exposes the exact raw payload used for reproducibility.

## Closure guards

- Exact comparison against all four local 26.0 seed records, including the tvOS-specific Beta 3 date.
- Exact 40-route audit with a seven-route allowlist and 33 explicit gaps.
- Approved-launch ownership assertion for all four Public routes and versions.
- Exact raw timestamp inventory and reader/raw archive URL assertions.
- Collision scan across every other research-batch JSON.
- Exact 64-key structured occurrence inventory and full source/citation closure.
- All seven events remain `editoriallyVerified`, approved at `2026-07-30T07:35:34Z`, and `isIndexable: true`.
- Deterministic formatted JSON SHA-256: `a4f46110fbe8cdd276fa011a6c155401ad5d0dbfbbfa0de6d4b0a72a5dc80837`.

## Validation

- Repository validation passes; this batch contributes 0 versions, 7 events, 64 changes, 7 sources, and 144 citations.
- Focused launch-content ingestion and manifest tests pass. ESLint passes for this generator, and Prettier passes for all three batch artifacts.
- The formatted JSON is deterministic across consecutive generator runs.

## Publication receipt

- Editorial review completed at `2026-07-30T07:35:34Z`.
- Reviewed plan SHA-256: `c471f97198121aa37e415bd6a7cad23e774b8cb2b2c4d0d8a865243183edc210`.
- Plan artifact SHA-256: `acd9c5073707412c529d8a1eec087fa9c51662dcd3ea6596582edfd974cf7bb9`.
- Rollback snapshot SHA-256: `f3e6c6fdc25da8620f09d66896330c6f694a86c7ad617c0fbb18f77a79801e14`.
- Sanity transaction: `F0eE6eK5XyVXtlnaoy9OAO`.
- Publication receipt SHA-256: `54132f88aa673a287b0fdb6dd4233e684699899772acf6a189ba30cf17d0f831`.
- Post-publication zero plan SHA-256: `041be249b29c71ee390194eb701759d4bb3f9b4af7cb7b8b662db9c2535c5f9f`; 0 mutations and 2,153 unchanged documents.
- Production coverage: 410/410 versions are full. The 1,979 appearances comprise 311 full, 256 source-linked, and 1,412 timeline-only appearances; 462 appearances have approved structured changes.
- All seven canonical local pages report full content, indexable state, and rendered references.

## Independent raw replay

- Exact archived Apple titles and item counts match the ledger.
- macOS diff arithmetic matches all four ledger boundaries.
- All 139 cited issue-ID checks pass.

## Reproduction

```bash
node scripts/research-batches/build-apple-nonios-26-0-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-nonios-26-0-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-nonios-26-0-prerelease.mjs scripts/research-batches/apple-nonios-26-0-prerelease.json scripts/research-batches/apple-nonios-26-0-prerelease.md
```

These reproduction commands are local and read-only except for regenerating the two batch artifacts. They do not contact or modify Sanity and do not change application code.
