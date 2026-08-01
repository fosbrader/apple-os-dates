# Apple 2024 non-iOS prerelease archive batch

## Result

`apple-nonios-2024-prerelease.json` publishes eight source-backed event overlays on existing routes:
macOS 15 Betas 1–7 and visionOS 2 Beta 1.

- 8 event overlays, 74 structured occurrences, and
  74 stable change definitions
- 8 declared and used reader-facing sources with
  260 citation references
- zero version overlays, build pages, route creation, Public-route changes, or
  administrative identity changes
- all events are `editoriallyVerified`, approved at `2026-07-30T09:19:14Z`, and
  indexable

| Version          | Milestone | Existing alias | Selected changes |
| ---------------- | --------- | -------------- | ---------------: |
| macOS Sequoia 15 | Beta 1    | `beta-1`       |               12 |
| macOS Sequoia 15 | Beta 2    | `beta-2`       |               12 |
| macOS Sequoia 15 | Beta 3    | `beta-3`       |               12 |
| macOS Sequoia 15 | Beta 4    | `beta-4`       |               12 |
| macOS Sequoia 15 | Beta 5    | `beta-5`       |                7 |
| macOS Sequoia 15 | Beta 6    | `beta-6`       |                1 |
| macOS Sequoia 15 | Beta 7    | `beta-7`       |                6 |
| visionOS 2       | Beta 1    | `beta-1`       |               12 |

## Archive method

Reader-facing citations use preserved human Apple Developer pages. Exact raw
DocC JSON is research transport only. Every selected sequential occurrence was
matched by component, status heading, and issue identifier across two
CDX-confirmed payloads whose interval crosses one and only one local milestone.

The macOS and visionOS Beta 1 pages are representative initial states. They
select high-signal entries without implying an exhaustive list. Later
cumulative first captures for watchOS, tvOS, and visionOS are not projected
backward.

Normalized comparison counts include text changes. Only explicit additions and
status transitions are promoted. A removal without a replacement is not labeled
as fixed, and a title-only state is not manufactured into a release change.

## Selected findings

### macOS Beta 1

The representative baseline covers focused window sharing, identity plug-in and
Quick Look transitions, MapKit place identity, RealityKit rendering, capture
privacy, StoreKit, Swift Charts, sheet sizing, app-group protection, and
translation.

### macOS Betas 2–7

- Beta 2: 10 additions, 2 removals, and 36 changed normalized records,
  including 27 status transitions. Selected entries cover App Store storage,
  firewall configuration, FSKit, iPhone Mirroring, backup, iCloud, Photos,
  power, Charts, navigation, virtualization, and VoiceOver.
- Beta 3: 9 additions, 1 removal, and 9 changed records, including 7 status
  transitions. Selected entries cover Finder automation, iPhone Mirroring,
  Screen Time, StoreKit, SwiftUI, virtualization, Core ML, Maps, and Object
  Tracker.
- Beta 4: 10 additions and 5 changed records; all 5 changes are status
  transitions. Selected entries cover Create ML, Foundation ordering, iPhone
  Mirroring, Maps, StoreKit, SwiftUI, app-group access, virtualization, App
  Intents, and FSKit.
- Beta 5: 4 additions and 5 changed records, including 3 status transitions.
  The selected delta covers compatible mobile-app crashes, app-group prompts,
  iPhone Mirroring, notifications, and Reality files.
- Beta 6: no additions or removals and one status transition, resolving Rosetta
  execution inside the specified virtual-machine environment.
- Beta 7: exactly six added resolved records, all selected; four concern
  framework or view compatibility for mobile apps on Apple-silicon Macs.

### visionOS Beta 1

The representative baseline covers spatial placement, compatible-app
organization, controllers, Home View, environment storage, Mac Virtual Display,
reclined playback, scene restoration, progressive immersion, ornaments, and
volume resizing.

## Seventeen raw states

Hashes are SHA-256 values of the decompressed raw DocC JSON bytes. “Normalized”
counts top-level unordered-list records using the repository audit parser;
“issue-backed” is the subset containing a retained Apple or Feedback issue ID.

| Platform | Raw capture      | Raw Apple title                       | Normalized | Issue-backed | SHA-256                                                            |
| -------- | ---------------- | ------------------------------------- | ---------: | -----------: | ------------------------------------------------------------------ |
| macOS    | `20240619212721` | macOS Sequoia 15 Beta Release Notes   |        144 |          142 | `c2cd17b6d4abc6f785a1bb430eab7352a6dbfab9594dc8893b6b07f0129e2fb9` |
| macOS    | `20240628225332` | macOS Sequoia 15 Beta 2 Release Notes |        152 |          150 | `69960ecb060d96b3e0c5871b5cd32dbef2a8b65849d579f33574398071be7b18` |
| macOS    | `20240711120834` | macOS Sequoia 15 Beta 3 Release Notes |        160 |          158 | `e82ebc5a2c8280208cf1ef4db1ffb5ac4ef7eacf2eaf60f88fe44757f684eb69` |
| macOS    | `20240723180119` | macOS Sequoia 15 Beta 4 Release Notes |        170 |          168 | `cdfa1068580c7c28a30ede2bcdd17288c44719d68d5c064ae8fd5e15182b52ee` |
| macOS    | `20240731043153` | macOS Sequoia 15 Beta 4 Release Notes |        170 |          168 | `dbb93be92da0da3ea440b428fc138bd5b2fafe134607fed709fa5bd5ad6bfaf4` |
| macOS    | `20240807153441` | macOS Sequoia 15 Beta 5 Release Notes |        174 |          172 | `305131902a43ffb8695c3d588aa2b8c0d854c651e9540298be5ca6f62a4e6dc9` |
| macOS    | `20240813023550` | macOS Sequoia 15 Beta 6 Release Notes |        174 |          172 | `ef84b9fe891ec993aceab6f6b3b4da4e7730acd7de3acbbf4d92e8f5a8c7075f` |
| macOS    | `20240821000143` | macOS Sequoia 15 Beta 7 Release Notes |        180 |          178 | `1b267115e9f0d916d181aa19db7f36b24f040b795100862256345f50bb1a11f4` |
| macOS    | `20240829040652` | macOS Sequoia 15 Beta 8 Release Notes |        180 |          178 | `1b4dd3bc36a0df9bd43ebc3db249c5c0f65b3d5604575fdfcc32db4b901ac445` |
| macOS    | `20240917210234` | macOS Sequoia 15 Release Notes        |        180 |          178 | `f7d0f81e6d82637c33b481e42fb6025ef3538f4fbbf9e6b9500b8a3ff4e078b9` |
| tvOS     | `20240724054203` | tvOS 18 Beta 4 Release Notes          |         52 |           52 | `2a6dda8076f644f688fd1b928e014f9ea3297ce9800b4d5828369bebcb7c3546` |
| tvOS     | `20240823054229` | tvOS 18 Beta 7 Release Notes          |         52 |           52 | `78ec460cfcc1a358e5fea66a36ed7c1c543264e11311b320f69ad36d238f536d` |
| visionOS | `20240611002742` | visionOS 2 Beta Release Notes         |        131 |          128 | `bc9b0875d286d76b4007aef56c0e511cfc05852cbbcee7e9fc98b67a72a94dfb` |
| visionOS | `20240724054225` | visionOS 2 Beta 4 Release Notes       |        170 |          168 | `884ec2ca23dff52d0b3ad906650f8aea61d1fb837b22c4a875ec3018e7d531de` |
| visionOS | `20240916171844` | visionOS 2 RC Release Notes           |        183 |          181 | `9bd5b051110193c70a65cb84c8b7fa1e8f9f6d5f805c51febbba0d455a73529b` |
| watchOS  | `20240806143749` | watchOS 11 Beta 5 Release Notes       |         70 |           70 | `78da7e665022c62c575754989b2d1435d9e8b02dbe062dfb7ddad505d5163414` |
| watchOS  | `20240928030208` | watchOS 11 Release Notes              |         71 |           71 | `375885e0e54bdccfa5a9e9b2a579aa70ded037a0549661f04f3921c04814a84f` |

Exact consecutive comparisons:

- macOS: Beta 1→Beta 2 +10/−2/~36; Beta 2→Beta 3 +9/−1/~9; Beta 3→Beta 4
  +10/−0/~5; Beta 4 retained revision +0/−0/~0; revision→Beta 5 +4/−0/~5;
  Beta 5→Beta 6 +0/−0/~1; Beta 6→Beta 7 +6/−0/~0; Beta 7→archived Beta 8
  +0/−0/~0; Beta 8→Public +0/−0/~2.
- tvOS: cumulative Beta 4→Beta 7 +0/−0/~2.
- visionOS: Beta 1→cumulative Beta 4 +49/−10/~48; Beta 4→RC
  +14/−1/~20.
- watchOS: cumulative Beta 5→post-Public +1/−0/~1.

The symbols mean added, removed, and changed normalized records. Counts are
evidence-audit facts, not a claim that every changed line belongs to one
release.

## Thirty-five-route isolation audit

| Platform | Milestone | Alias    | Exact boundary or gap                                               | Decision    |
| -------- | --------- | -------- | ------------------------------------------------------------------- | ----------- |
| macOS    | Beta 1    | `beta-1` | Initial state before Beta 2                                         | Included    |
| macOS    | Beta 2    | `beta-2` | 20240619212721 → 20240628225332 crosses only Beta 2                 | Included    |
| macOS    | Beta 3    | `beta-3` | 20240628225332 → 20240711120834 crosses only Beta 3                 | Included    |
| macOS    | Beta 4    | `beta-4` | 20240711120834 → 20240723180119 crosses only Beta 4                 | Included    |
| macOS    | Beta 5    | `beta-5` | Beta 4 revision has zero record changes; next state isolates Beta 5 | Included    |
| macOS    | Beta 6    | `beta-6` | 20240807153441 → 20240813023550 crosses only Beta 6                 | Included    |
| macOS    | Beta 7    | `beta-7` | 20240813023550 → 20240821000143 crosses only Beta 7                 | Included    |
| macOS    | RC        | `rc`     | No exact RC state; next retained seeded state crosses RC and Public | Ledger only |
| tvOS     | Beta 1    | `beta-1` | No raw state                                                        | Ledger only |
| tvOS     | Beta 2    | `beta-2` | No raw state                                                        | Ledger only |
| tvOS     | Beta 3    | `beta-3` | No raw state                                                        | Ledger only |
| tvOS     | Beta 4    | `beta-4` | First retained state is cumulative Beta 4                           | Ledger only |
| tvOS     | Beta 5    | `beta-5` | No isolated raw boundary                                            | Ledger only |
| tvOS     | Beta 6    | `beta-6` | No isolated raw boundary                                            | Ledger only |
| tvOS     | Beta 7    | `beta-7` | Previous retained state is cumulative Beta 4                        | Ledger only |
| tvOS     | Beta 8    | `beta-8` | No raw state                                                        | Ledger only |
| tvOS     | RC        | `rc`     | No raw state                                                        | Ledger only |
| visionOS | Beta 1    | `beta-1` | Initial state before Beta 2                                         | Included    |
| visionOS | Beta 2    | `beta-2` | No isolated raw boundary                                            | Ledger only |
| visionOS | Beta 3    | `beta-3` | No isolated raw boundary                                            | Ledger only |
| visionOS | Beta 4    | `beta-4` | Previous retained state predates Betas 2 and 3                      | Ledger only |
| visionOS | Beta 5    | `beta-5` | No isolated raw boundary                                            | Ledger only |
| visionOS | Beta 6    | `beta-6` | No isolated raw boundary                                            | Ledger only |
| visionOS | Beta 7    | `beta-7` | No isolated raw boundary                                            | Ledger only |
| visionOS | Beta 8    | `beta-8` | No isolated raw boundary                                            | Ledger only |
| visionOS | Beta 9    | `beta-9` | No isolated raw boundary                                            | Ledger only |
| visionOS | RC        | `rc`     | Previous retained state predates Betas 5–9 and RC                   | Ledger only |
| watchOS  | Beta 1    | `beta-1` | No raw state                                                        | Ledger only |
| watchOS  | Beta 2    | `beta-2` | No raw state                                                        | Ledger only |
| watchOS  | Beta 3    | `beta-3` | No raw state                                                        | Ledger only |
| watchOS  | Beta 4    | `beta-4` | No raw state                                                        | Ledger only |
| watchOS  | Beta 5    | `beta-5` | First retained state is cumulative Beta 5                           | Ledger only |
| watchOS  | Beta 6    | `beta-6` | No isolated raw boundary                                            | Ledger only |
| watchOS  | Beta 7    | `beta-7` | No isolated raw boundary                                            | Ledger only |
| watchOS  | RC        | `rc`     | Next retained state is after RC and Public                          | Ledger only |

The 27 ledger-only routes remain honest gaps. In particular:

- watchOS begins at a cumulative Beta 5 state, then does not reappear until
  after RC and Public.
- tvOS begins at cumulative Beta 4 and next appears at Beta 7, crossing two
  intervening milestones.
- visionOS begins with a clean Beta 1 state, but its next state is cumulative
  Beta 4 and its following state crosses Betas 5–9 and RC.
- macOS has clean seeded boundaries through Beta 7, no exact RC state, and no
  attributable issue-record change in its archived Beta 8 state.

## Seed/source divergence

The preserved Apple payload captured on 2024-08-29 identifies itself as
“macOS Sequoia 15 Beta 8 Release Notes.” The audited local seed has macOS 15
Betas 1–7 followed by RC, so this batch does not create a Beta 8 route or alter
the timeline. The Beta 8 payload has zero normalized issue-record delta from
Beta 7. This discrepancy should be resolved by the timeline owner independently
of this content batch.

## Source ledger

- [macOS Sequoia 15 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20240610230634/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sequoia 15 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20240628225332/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sequoia 15 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20240711120823/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sequoia 15 Beta 4 Release Notes (preserved snapshot)](https://web.archive.org/web/20240723174620/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sequoia 15 Beta 5 Release Notes (preserved snapshot)](https://web.archive.org/web/20240807153431/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sequoia 15 Beta 6 Release Notes (preserved snapshot)](https://web.archive.org/web/20240813023546/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sequoia 15 Beta 7 Release Notes (preserved snapshot)](https://web.archive.org/web/20240821000141/https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [visionOS 2 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20240611002731/https://developer.apple.com/documentation/visionos-release-notes/visionos-2-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.

## Copyright and attribution boundary

Article prose, titles, summaries, and grouping are original synthesis.
Framework, API, product, and issue names are used only as factual locators. The
batch does not reproduce Apple's paragraphs, workaround instructions, complete
lists, screenshots, artwork, or marketing copy. Every structured occurrence
links to a preserved Apple page, while the exact raw URL remains available for
independent verification.

## Closure guards

- exact comparison against four local seed records and all 39 milestones
- exact 35-route prerelease audit with an eight-route allowlist and 27 gaps
- approved Public ownership remains in `apple-other-2024.json`
- zero versions and zero builds
- collision scan across every other batch and the launch manifest
- complete 74-occurrence, 74-definition,
  source, and citation closure
- deterministic formatted JSON SHA-256: `0eab29e48688c31f6fcc2c8d4b7f5ab34c92956b65afc18ade6ac8fbfdf17365`

## Publication and validation record

The generator's seed, route, collision, review-state, raw-inventory, source,
and citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all 17 retained raw payloads independently reproduced the exact Apple title,
  decompressed SHA-256, normalized-record count, and issue-backed-record count
  recorded in this ledger
- all 74 occurrences resolved across 86 after-state issue IDs; the
  57 later-beta boundary decisions comprise 20 explicit status transitions and
  37 additions
- 315 total raw-inventory, exact-diff,
  occurrence, issue-ID, component, status-heading, and boundary assertions
  passed with zero failures
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 5 words between
  editorial fields and Apple's retained records
- all eight event articles and all 74 occurrences were approved at
  `2026-07-30T09:19:14Z`

Publication receipt:

- applied production plan: `7ca4d274f624b20b1ebaab34808b51c532a75a47017816fb708b6761c870b856`
- reviewed plan artifact SHA-256: `8e93fa61b6a081a50e507abd2f3f9bf4cdd4e082d12928edde79f89a21eab6ca`
- rollback artifact SHA-256: `5784656b2e46aa4e4a5736979464b08f35ed659745e05aa17b5d92e4a16e47e5`
- applied plan contents: 82 creates, 8
  revision-guarded patches, 2,074
  unchanged documents, and a 189,188-byte
  mutation payload
- Sanity transaction: `eOgq1Ovu5XNUv1qNFUyuf1`
- receipt SHA-256: `88733e373a4bf391aca3b1dc7583ece7987426de7a5c50886bdfd4090960d218`
- immediate post-publication zero plan:
  `771a5e85f51b239e15a329b1e0e3794c56a12c104fda1c05a5889876e0dc3d0e`;
  0 creates,
  0 patches,
  2,164 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `f4203382ff15887a3d59fca1367bac9678ca09f161875eb6bc1ad9b73be442cc`
- zero-plan rollback artifact SHA-256:
  `b1521477c01940e9c06194a8922498a7415ac51034682647e32d0b171667d68d`

Production coverage after publication:

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 399 full articles,
  256 source-linked records, and
  1,324
  timeline-only records
- 550 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, preserved evidence,
References, and `index, follow`; none returned a timeline placeholder or
`noindex`.

| Canonical route               | HTTP | Full article | Evidence | References | Index |
| ----------------------------- | ---: | ------------ | -------- | ---------- | ----- |
| `/apple/macos/15.0/beta-1/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/macos/15.0/beta-2/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/macos/15.0/beta-3/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/macos/15.0/beta-4/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/macos/15.0/beta-5/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/macos/15.0/beta-6/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/macos/15.0/beta-7/`   |  200 | yes          | yes      | yes        | yes   |
| `/apple/visionos/2.0/beta-1/` |  200 | yes          | yes      | yes        | yes   |

Final verification on 2026-07-30:

- `npm run research:validate`:
  56 batches validated; this batch reports
  8 events, 74 change occurrences,
  8 sources, and 260 citation references;
  3,045 change keys remain
  globally consistent
- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests
  passed
- independent evidence replay: 315 assertions
  passed with zero failures
- independent copyright-similarity scan: maximum contiguous overlap of
  5 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 is `0eab29e48688c31f6fcc2c8d4b7f5ab34c92956b65afc18ade6ac8fbfdf17365`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,164 unchanged
  documents, the 16-byte payload, and
  plan SHA `771a5e85f51b239e15a329b1e0e3794c56a12c104fda1c05a5889876e0dc3d0e`
- the final planner reported “No Sanity data changed”

Reproduce the local checks with:

```sh
node scripts/research-batches/build-apple-nonios-2024-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-nonios-2024-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-nonios-2024-prerelease.mjs scripts/research-batches/apple-nonios-2024-prerelease.json scripts/research-batches/apple-nonios-2024-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-nonios-2024-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
