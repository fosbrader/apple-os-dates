# Apple 26.4 prerelease archive research batch

## Result

`apple-26-4-prerelease.json` enriches four existing prerelease routes whose Apple DocC states are durably bounded by CDX-confirmed raw payload captures.

- The exact seed contains 6 versions, 39 milestones, 6 Public routes, and 33 prerelease routes.
- There are no Public Beta milestones in this cohort.
- 4 prerelease routes are included: iOS Beta 1, iPadOS Beta 1, macOS Beta 1, and macOS Beta 2.
- 29 prerelease routes remain unsupported because no adjacent raw payload boundary isolates their milestone.
- The four event overlays contain 43 documented and confirmed change occurrences.
- 3 archived first-party Apple sources are declared, with Apple retained as original publisher and `archive` as the source class.
- No version overlay, Public route, build page, or route creation is included. The four supported event articles were independently approved and published after review.

## Exact seed closure

| Platform  | Seed milestones | Prerelease routes | Selected | Unsupported |
| --------- | --------------: | ----------------: | -------: | ----------: |
| iOS       |               7 |                 6 |        1 |           5 |
| iPadOS    |               7 |                 6 |        1 |           5 |
| macOS     |               6 |                 5 |        2 |           3 |
| tvOS      |               6 |                 5 |        0 |           5 |
| visionOS  |               6 |                 5 |        0 |           5 |
| watchOS   |               7 |                 6 |        0 |           6 |
| **Total** |          **39** |            **33** |    **4** |      **29** |

Every seed signature is asserted by label, date, order, and revision flag. iOS, iPadOS, and watchOS include a March 5 Beta 3 v2 revision; macOS Beta 3 is dated March 3 while the other tracks use March 2. All Public overlays are already approved in `scripts/apple-launch-content-2026.json` and are excluded.

## Archive method

Wayback replay timestamps and raw-payload capture timestamps are not interchangeable. A URL of the form `/web/<requested-time>id_/...` can silently return the nearest archived payload even when CDX has no capture at that requested time. Structured changes in this batch therefore use only exact raw JSON timestamps returned by the Internet Archive CDX index.

Reader-facing citations point to archived human Apple Developer pages. The exact raw DocC URLs used for research are listed below for reproducibility. Apple is the original publisher; Internet Archive supplies the timestamped preservation layer. Snapshot prose is paraphrased and Apple issue identifiers are used only as factual locators.

Two attribution types are kept separate:

1. **Initial snapshot state** — the first retained 26.4 raw payload follows Beta 1 and precedes Beta 2, so Beta 1 is the only possible 26.4 milestone. This shows the documented state during Beta 1; it does not prove the exact hour each item first appeared.
2. **Sequential snapshot delta** — two retained raw payloads bracket one and only one milestone. Only the addition found in that diff is assigned to the intervening milestone.

## Exact supported snapshot alignment

### iOS and iPadOS Beta 1

- Seed milestone: Beta 1 on 2026-02-16.
- Same-day human shell: [20260216202312 Apple DocC capture](https://web.archive.org/web/20260216202312/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes).
- Reader-facing evidence: [20260219170414 Apple DocC capture](https://web.archive.org/web/20260219170414/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes).
- Exact raw payload: [20260219063222 Apple DocC JSON](https://web.archive.org/web/20260219063222id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes.json).
- Raw title: `iOS & iPadOS 26.4 Beta Release Notes`.
- Boundary: captured after Beta 1 and before Beta 2 on February 23; classified as an initial snapshot state.
- Result: 12 structured occurrences for each platform. The shared Apple page is not used to infer tvOS, visionOS, watchOS, or macOS state.

### macOS Beta 1

- Seed milestone: Beta 1 on 2026-02-16.
- Reader-facing evidence: [20260216203520 Apple DocC capture](https://web.archive.org/web/20260216203520/https://developer.apple.com/documentation/macos-release-notes/macos-26_4-release-notes).
- Exact raw payload: [20260217150536 Apple DocC JSON](https://web.archive.org/web/20260217150536id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26_4-release-notes.json).
- Raw title: `macOS Tahoe 26.4 Beta Release Notes`.
- Boundary: captured after Beta 1 and before Beta 2 on February 23; classified as an initial snapshot state.
- Result: 18 structured occurrences.

### macOS Beta 2

- Seed milestone: Beta 2 on 2026-02-23.
- Before-state raw payload: [20260217150536 Apple DocC JSON](https://web.archive.org/web/20260217150536id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26_4-release-notes.json).
- Reader-facing after-state: [20260225122433 Apple DocC capture](https://web.archive.org/web/20260225122433/https://developer.apple.com/documentation/macos-release-notes/macos-26_4-release-notes).
- Exact after-state raw payload: [20260225122435 Apple DocC JSON](https://web.archive.org/web/20260225122435id_/https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26_4-release-notes.json).
- Raw title: `macOS Tahoe 26.4 Beta 2 Release Notes`.
- Boundary: the two raw payloads cross Beta 2 and no other macOS 26.4 milestone.
- Result: one added StoreKit resolved issue; all earlier items remain initial-state material and are not duplicated as Beta 2 deltas.

## Unsupported snapshot alignment

### iOS and iPadOS

| Milestone              | Human archive state                                                                                                                                                                     | Raw-payload result                                                                                                                                                                                                                           | Decision                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Beta 2 · 2026-02-23    | [20260224205256 shell titled Beta 2](https://web.archive.org/web/20260224205256/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes/)      | No CDX-confirmed raw payload near Beta 2                                                                                                                                                                                                     | Unsupported; a replayed older payload cannot prove the Beta 2 note state                                   |
| Beta 3 · 2026-03-02    | [20260302145239 shell titled Beta 3](https://web.archive.org/web/20260302145239/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes)       | Raw payload [20260303083220](https://web.archive.org/web/20260303083220id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes.json) exists, but the prior raw payload is Beta 1 | Snapshot state observed, but three apparent additions cannot be assigned across the intervening Beta 2 gap |
| Beta 3 v2 · 2026-03-05 | No aligned human or raw payload                                                                                                                                                         | No isolated boundary                                                                                                                                                                                                                         | Unsupported; no corrective delta is inferred                                                               |
| Beta 4 · 2026-03-09    | [20260313112417 shell still titled Beta 3](https://web.archive.org/web/20260313112417/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes) | No contemporaneous raw payload                                                                                                                                                                                                               | Unsupported; shell metadata cannot establish item-level state                                              |
| RC · 2026-03-18        | [20260318205246 human shell](https://web.archive.org/web/20260318205246/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_4-release-notes)               | Next CDX-confirmed raw payload is after Public on March 25                                                                                                                                                                                   | Unsupported; later cumulative items are not copied to RC                                                   |

The Beta 3 raw snapshot contains observable state changes relative to the Beta 1 payload, including a Feedback status change, expanded RCS test wording, and a StoreKit resolved issue. Because the raw sequence crosses Beta 2, these are recorded only as snapshot-state observations in this ledger and are not emitted as Beta 3 deltas.

### macOS

| Milestone           | Archive coverage                                                              | Decision    |
| ------------------- | ----------------------------------------------------------------------------- | ----------- |
| Beta 3 · 2026-03-03 | No raw payload after Beta 2 and before Beta 4                                 | Unsupported |
| Beta 4 · 2026-03-09 | Human shell captured 20260316222424, but no contemporaneous raw payload       | Unsupported |
| RC · 2026-03-18     | Human shell captured 20260319202028, but the next raw payload is after Public | Unsupported |

### tvOS, visionOS, and watchOS

- tvOS has a human shell capture on 20260320120652, after RC, but its first CDX-confirmed raw 26.4 payload is 20260325182944, after Public.
- visionOS has a human shell capture on 20260314103605, after Beta 4, but its first CDX-confirmed raw payload is 20260325184240, after Public.
- watchOS has no retained prerelease human or raw 26.4 state in the audited CDX results; its first confirmed pair is 20260325184839/40, after Public.
- Consequently, all 16 tvOS, visionOS, and watchOS prerelease routes are unsupported. The March 5 watchOS Beta 3 v2 revision receives no inferred change.

## Structured inventory

The iOS and iPadOS Beta 1 pages each preserve 12 separately labeled items spanning Background Assets, external media, Feedback, Memory Integrity Enforcement, Messages, networking, Reality Composer, StoreKit, SwiftUI, and UIKit.

The macOS Beta 1 page preserves 18 items spanning AppKit, Background Assets, CoreMIDI, external boot and media, Internet Accounts, login, Recovery, networking, resource forks, Rosetta, StoreKit, SwiftUI, and virtualization. Three exact approved Public change identities are reused only because the initial Beta 1 snapshot independently contains the same Network MIDI, Rosetta-notice, and virtual-machine display facts.

The macOS Beta 2 page contains one true sequential delta: the archived Beta 2 payload adds a StoreKit resolved issue for background-launch purchase intents. No cumulative Public item is assigned backward.

## Copyright and attribution method

All titles, summaries, verification notes, and article paragraphs are original synthesis. The manifest does not reproduce Apple's paragraphs, lists, workaround wording, or interface assets. Framework names, API identifiers, platform names, status headings, and issue numbers are factual nominative references. Every occurrence links to an archived human Apple page and carries a section-and-issue locator; the ledger separately exposes the exact raw payload used for verification.

## Closure guards

- Exact comparison against all six local 26.4 seed records, including every date, label, revision flag, and platform-specific Beta 3 date.
- Exact four-route allowlist and explicit exclusion of all six Public routes.
- Approved-launch ownership assertion for all six 26.4 versions and Public events.
- Collision scan across every other research-batch JSON.
- Exact 43-occurrence inventory with unique or approved reusable definitions.
- Reader-facing archive provenance, exact raw URL assertions, and full source/citation closure.
- All four events are `editoriallyVerified`, approved at `2026-07-30T07:11:05Z`, and `isIndexable: true`.
- Deterministic formatted JSON SHA-256: `592587057683ed4d5abe487537abbbe12db6dd55395e9e3c48699fd113bc3be5`.

## Validation

- Repository research validation accepted all 44 current batches and 2,287 globally consistent change keys; this batch contributes 3 sources, 4 events, 43 change occurrences, and 63 citations.
- Focused launch-content ingestion and manifest tests passed 19 of 19.
- ESLint passed for the generator, and Prettier passed for the generator, JSON, and ledger.
- A second generator run reproduced the JSON and ledger byte for byte.
- The reviewed production dry run reported 43 creates, 7 revision-guarded patches, and 2,078 unchanged documents.
- Creates are exactly 3 archived Apple source records and 40 new granular release-change records. There are no version, event, or build creates.
- Four patches enrich the exact existing Beta 1/Beta 2 event routes with article body, changes, citations, review state, and summary. Three citation-only patches add the independent archived Beta 1 evidence to the existing approved Network MIDI, Rosetta notice, and virtual-machine display changes.
- No version, Public event, build, or unsupported prerelease route is patched. No field is unset and no document is deleted.
- Production plan SHA-256: `594835aed6f04d9c563b592582246368f49d175290b3f70203aafac8d8223ab5`; mutation payload: 93,010 bytes (2.4% of the guarded limit).
- Serialized plan artifact SHA-256: `ff9bbc8c08c050cb352ad1c95ddf00031a0d033d1bb9c0890daaae1c8a942fc6`; rollback artifact SHA-256: `468ea38acd44dfbded42ce01e6edb3fa6daf6348d340f8d017a173388763e333`.

## Human approval checklist

- [x] Accepted initial-snapshot attribution for iOS, iPadOS, and macOS Beta 1.
- [x] Accepted the macOS Beta 2 StoreKit item as the only sequentially isolated delta.
- [x] Kept the iOS/iPadOS Beta 3 observations out of structured changes because the raw-payload gap crosses Beta 2.
- [x] Accepted all remaining 29 prerelease routes as unsupported.
- [x] Approved every emitted event for indexing at `2026-07-30T07:11:05Z`.

## Production receipt

The primary agent downloaded and independently checked all three exact raw Apple payloads. All 46 issue identifiers cited by emitted changes appeared in their assigned payloads, the two macOS snapshots added only StoreKit issues `168958783` and `FB21767675`, and no identifier was removed.

- Approved manifest SHA-256: `592587057683ed4d5abe487537abbbe12db6dd55395e9e3c48699fd113bc3be5`
- Generator SHA-256: `80bc6dcf3fad9b7319f497a9974bc97091d34907b4da2af5a1eaff7c48640441`
- Sanity transaction: `F0eE6eK5XyVXtlnaoy8AeI`
- Apply receipt SHA-256: `9f9ecf865628c45ee16d91131132334c93626c8f42bc5a40f2ec2d416f694211`
- Post-apply zero-plan SHA:
  `dec0cea498ef2cf180778c03d1972bbd21412a97cc83e4a4caa209c7a97c75c3`
  with 0 creates, 0 patches, and 2,128 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles; appearances are 294 full, 266 source-linked, and 1,419 timeline-only; 445 appearances have approved structured changes
- All four local routes rendered their archived-state or sequential-diff article, references, and `index, follow` metadata

## Reproduction

```bash
node scripts/research-batches/build-apple-26-4-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-26-4-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-26-4-prerelease.mjs scripts/research-batches/apple-26-4-prerelease.json scripts/research-batches/apple-26-4-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-26-4-prerelease.json
```

The final command is a dry run only. Do not add `--apply` or any approval flags in this research pass.
