# Apple 2023 non-iOS prerelease archive batch

## Result

`apple-nonios-2023-prerelease.json` publishes six source-backed event overlays on existing routes:
macOS 14 Betas 1–5 and watchOS 10 RC.

- 6 event overlays, 54 structured occurrences, and
  54 stable change definitions
- 7 declared and used reader-facing sources with
  199 citation references
- zero version overlays, build pages, route creation, Public-route changes, or
  administrative identity changes
- all events are `editoriallyVerified`, approved at `2026-07-30T08:50:57Z`, and
  indexable; the production apply remains separately guarded

| Version      | Milestone | Existing alias | Selected changes |
| ------------ | --------- | -------------- | ---------------: |
| macOS 14.0   | Beta 1    | `beta-1`       |               12 |
| macOS 14.0   | Beta 2    | `beta-2`       |               12 |
| macOS 14.0   | Beta 3    | `beta-3`       |               13 |
| macOS 14.0   | Beta 4    | `beta-4`       |                4 |
| macOS 14.0   | Beta 5    | `beta-5`       |               12 |
| watchOS 10.0 | RC        | `rc`           |                1 |

## Archive method

Reader-facing citations use preserved human Apple Developer pages. Exact raw
DocC JSON is research transport only. Every selected sequential occurrence was
matched by component, status heading, and issue identifier across two
CDX-confirmed payloads whose interval crosses one and only one local milestone.

Beta 1 is the only representative initial state. It contains 161 issue-backed
records after Beta 1 and before Beta 2; this batch selects twelve high-signal
items without implying an exhaustive list. Later cumulative first captures are
not treated the same way.

The normalized comparison counts below include text changes. Only explicit
additions and status transitions are promoted. A removal without a replacement
is not labeled as fixed, and a title-only RC state is not manufactured into a
release change.

## Selected findings

### macOS Beta 1

The representative baseline covers adaptive AirPods listening, passkeys,
localized grammar, resumable uploads, EAP-TLS 1.3, Photos editing output,
PostScript/EPS removal, StoreKit merchandising, pie and donut charts, trusted
execution tooling, AppKit-hosted SwiftUI navigation, and iPhone-widget refresh.

### macOS Betas 2–5

- Beta 2: 24 additions, 1 removal, and 9 changed records, including 2 status
  transitions. Selected changes cover legacy text APIs, iCloud, iPhone widgets,
  suggested titles, Rosetta, SwiftData, Catalyst, SwiftUI, Gatekeeper, Vision,
  and web apps.
- Beta 3: 22 additions, 2 removals, and 3 changed records; all 3 changes are
  status transitions. Selected changes cover media, Xcode documentation,
  FaceTime, filesystems, Freeform, widgets, screen sharing, ShazamKit, StoreKit,
  and Vision.
- Beta 4: 2 additions, 3 removals, and 30 changed records, including 2 status
  transitions. Only the two additions and two explicit resolutions are
  promoted.
- Beta 5: 15 additions and 6 changed records, including 5 status transitions.
  The selected delta emphasizes iCloud, StoreKit, Swift Charts, SwiftData,
  SwiftUI, and installed web apps. A newly listed iPhone-camera issue is not
  assigned to macOS merely because it appears in the shared document.

### watchOS RC

The Beta 8-to-RC comparison adds exactly one issue record: a Compass limitation
affecting Cellular and SOS waypoint visibility. No earlier watchOS beta receives
content from the cumulative Beta 4 or Beta 8 captures.

## Twenty raw states

Hashes are SHA-256 values of the decompressed raw DocC JSON bytes.

| Platform | Raw capture      | Raw Apple title                      | Issue records | SHA-256                                                            |
| -------- | ---------------- | ------------------------------------ | ------------: | ------------------------------------------------------------------ |
| macOS    | `20230607235811` | macOS Sonoma 14 Beta Release Notes   |           161 | `90abefd3711aabaa48fc757af14b638c3be61391dd9bbacd5dd33bb3305af966` |
| macOS    | `20230622113903` | macOS Sonoma 14 Beta 2 Release Notes |           185 | `1615a125da6cb59f4936edf83f5859e1cb4df32f12b8349e1dc8d25d180e38f8` |
| macOS    | `20230702124053` | macOS Sonoma 14 Beta 2 Release Notes |           184 | `046c069e9b0ae3f8bca5e74a6eed358944e838cf4d604b5539a42b55ef9faec6` |
| macOS    | `20230707224225` | macOS Sonoma 14 Beta 3 Release Notes |           204 | `371a2ecad5bd03553b2817d4fd44c2516326933cb276ea47f591997d3aa4b8e5` |
| macOS    | `20230711060054` | macOS Sonoma 14 Beta 3 Release Notes |           204 | `b83b2dbdda9331e00da7275c351bf03067d349259544b232ea9249140ad38c1c` |
| macOS    | `20230717163745` | macOS Sonoma 14 Beta 3 Release Notes |           204 | `0024946c7b6b0574b99a24154621cc96286c2f8979480a8ff18e3c88e37a3004` |
| macOS    | `20230725213920` | macOS Sonoma 14 Beta 4 Release Notes |           203 | `f3ce4c12c78867ab832296e96957d8e6617b1d242a1e115a37bfe191659a693d` |
| macOS    | `20230727164800` | macOS Sonoma 14 Beta 4 Release Notes |           203 | `0b421a6b6b4b39a0a6227d3d69d5c9e9f9f87524d164676f23da48f4b580c2c6` |
| macOS    | `20230816192546` | macOS Sonoma 14 Beta 5 Release Notes |           218 | `4da78817f33619d01c75933aaee3f76c0cf5e62af1eb55a39ad1b95f21c69338` |
| macOS    | `20230907135515` | macOS Sonoma 14 Beta 7 Release Notes |           225 | `71be0cd114c50b4ea0ac66de4507349bc56ea9506c5ec9ea76753c0abb562c23` |
| macOS    | `20230912200740` | macOS Sonoma 14 RC Release Notes     |           225 | `1502565104287f308ff007aaa9e73d3734a4b8eebb5df8fa57bedbbaa93ac3cf` |
| macOS    | `20230928003224` | macOS Sonoma 14 Release Notes        |           225 | `76897a477b0ffb859d2db6e0e4b5dbe6776b06f0402c311a668518ef5a65ee01` |
| tvOS     | `20230705224039` | tvOS 17 Beta 3 Release Notes         |            97 | `94273808d2d980982350ee52a5e925f67d97e888bb8a3a6fb915726d83997a4b` |
| tvOS     | `20230905215723` | tvOS 17 Beta 9 Release Notes         |           113 | `550e00e12a9ff3ca9300edea07d8a47beb23843c447d2306e58c3e22ebc7eeff` |
| tvOS     | `20230913072611` | tvOS 17 RC Release Notes             |           113 | `bd1eb5772deb3fd28ea42bb6467a9c9067cd44263783f80d13bcb47ce2b4405c` |
| visionOS | `20230725213159` | visionOS Beta 2 Release Notes        |           150 | `7b7a5b0336878a5f47e7c64b6ecc55a9c19fbf2dfecc014d9701350c57963fd2` |
| visionOS | `20240214065855` | visionOS Release Notes               |           179 | `53f2ae07cdb25506bd94732d0b6600acaec3cdff1fb88cb448e49be9b3b72ebd` |
| watchOS  | `20230726003307` | watchOS 10 Beta 4 Release Notes      |           105 | `b9aeaf46b43ea35122141c40f15e33812495ef4028e736692fc3a9fbf134b042` |
| watchOS  | `20230907135458` | watchOS 10 Beta 8 Release Notes      |           118 | `26bd5b91f7a09de20b43d122cd5723a891b0f9d152639b2351944e9576378c23` |
| watchOS  | `20230912200535` | watchOS 10 RC Release Notes          |           119 | `2222254780aa30a6912e29340c128c468fac7ad4e2804e84b93c0505289702d1` |

Exact consecutive comparisons:

- macOS: Beta 1→Beta 2 first state +25/−1/~9; Beta 2 first→revision +0/−1/~0;
  revision→Beta 3 +22/−2/~3; both later Beta 3 captures +0/−0/~0; Beta 3→Beta 4
  +2/−3/~30; Beta 4 revision +0/−0/~0; Beta 4→Beta 5 +15/−0/~6; Beta 5→Beta 7
  +10/−3/~80; Beta 7→RC +0/−0/~0; RC→Public +1/−1/~11.
- watchOS: cumulative Beta 4→Beta 8 +16/−3/~41; Beta 8→RC +1/−0/~0.
- tvOS: cumulative Beta 3→Beta 9 +17/−1/~38; Beta 9→RC +0/−0/~0.
- visionOS: cumulative Beta 2→post-Public +37/−8/~68.

The symbols mean added, removed, and changed issue records. Counts are evidence
audit facts, not a claim that every changed line belongs to one release.

## Thirty-five-route isolation audit

| Platform | Milestone | Alias    | Exact boundary or gap                               | Decision    |
| -------- | --------- | -------- | --------------------------------------------------- | ----------- |
| macOS    | Beta 1    | `beta-1` | Initial state before Beta 2                         | Included    |
| macOS    | Beta 2    | `beta-2` | 20230607235811 → 20230702124053 crosses only Beta 2 | Included    |
| macOS    | Beta 3    | `beta-3` | 20230702124053 → 20230717163745 crosses only Beta 3 | Included    |
| macOS    | Beta 4    | `beta-4` | 20230717163745 → 20230727164800 crosses only Beta 4 | Included    |
| macOS    | Beta 5    | `beta-5` | 20230727164800 → 20230816192546 crosses only Beta 5 | Included    |
| macOS    | Beta 6    | `beta-6` | Next retained state crosses Betas 6 and 7           | Ledger only |
| macOS    | Beta 7    | `beta-7` | Previous retained state predates Beta 6             | Ledger only |
| macOS    | RC        | `rc`     | Exact RC title but zero issue-record changes        | Ledger only |
| macOS    | RC 2      | `rc-2`   | Next state crosses RC 2 and Public                  | Ledger only |
| tvOS     | Beta 1    | `beta-1` | No raw state                                        | Ledger only |
| tvOS     | Beta 2    | `beta-2` | No raw state                                        | Ledger only |
| tvOS     | Beta 3    | `beta-3` | First retained state is cumulative Beta 3           | Ledger only |
| tvOS     | Beta 4    | `beta-4` | No isolated raw boundary                            | Ledger only |
| tvOS     | Beta 5    | `beta-5` | No isolated raw boundary                            | Ledger only |
| tvOS     | Beta 6    | `beta-6` | No isolated raw boundary                            | Ledger only |
| tvOS     | Beta 7    | `beta-7` | No isolated raw boundary                            | Ledger only |
| tvOS     | Beta 8    | `beta-8` | No isolated raw boundary                            | Ledger only |
| tvOS     | Beta 9    | `beta-9` | Previous retained state is Beta 3                   | Ledger only |
| tvOS     | RC        | `rc`     | Exact RC title but zero issue-record changes        | Ledger only |
| visionOS | Beta 1    | `beta-1` | No raw state                                        | Ledger only |
| visionOS | Beta 2    | `beta-2` | First retained state is cumulative Beta 2           | Ledger only |
| visionOS | Beta 3    | `beta-3` | No isolated raw boundary                            | Ledger only |
| visionOS | Beta 4    | `beta-4` | No isolated raw boundary                            | Ledger only |
| visionOS | Beta 5    | `beta-5` | No isolated raw boundary                            | Ledger only |
| visionOS | Beta 6    | `beta-6` | No isolated raw boundary                            | Ledger only |
| visionOS | Beta 7    | `beta-7` | Next retained state is after Public                 | Ledger only |
| watchOS  | Beta 1    | `beta-1` | No raw state                                        | Ledger only |
| watchOS  | Beta 2    | `beta-2` | No raw state                                        | Ledger only |
| watchOS  | Beta 3    | `beta-3` | No raw state                                        | Ledger only |
| watchOS  | Beta 4    | `beta-4` | First retained state is cumulative Beta 4           | Ledger only |
| watchOS  | Beta 5    | `beta-5` | No isolated raw boundary                            | Ledger only |
| watchOS  | Beta 6    | `beta-6` | No isolated raw boundary                            | Ledger only |
| watchOS  | Beta 7    | `beta-7` | No isolated raw boundary                            | Ledger only |
| watchOS  | Beta 8    | `beta-8` | Previous retained state is Beta 4                   | Ledger only |
| watchOS  | RC        | `rc`     | 20230907135458 → 20230912200535 crosses only RC     | Included    |

The 29 ledger-only routes remain honest gaps. In particular:

- macOS Beta 6 and Beta 7 share one crossed boundary; the exact RC payload has
  no substantive issue-record difference; the next state crosses RC 2 and
  Public.
- tvOS begins at a cumulative Beta 3 state and next appears at Beta 9. Its RC
  state changes only document metadata.
- visionOS begins at cumulative Beta 2 and has no other retained state until
  after Public.
- watchOS begins at cumulative Beta 4. The next state is Beta 8, so only the
  subsequent clean RC addition is attributable.

## Source ledger

- [macOS Sonoma 14 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20230607235810/https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sonoma 14 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20230622113903/https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sonoma 14 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20230707224219/https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sonoma 14 Beta 4 Release Notes (preserved snapshot)](https://web.archive.org/web/20230727164800/https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [macOS Sonoma 14 Beta 5 Release Notes (preserved snapshot)](https://web.archive.org/web/20230816192544/https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [watchOS 10 Beta 8 Release Notes (preserved snapshot)](https://web.archive.org/web/20230907135458/https://developer.apple.com/documentation/watchos-release-notes/watchos-10-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.
- [watchOS 10 RC Release Notes (preserved snapshot)](https://web.archive.org/web/20230912200534/https://developer.apple.com/documentation/watchos-release-notes/watchos-10-release-notes) — Apple Developer via Internet Archive; raw transport retained separately for verification.

## Copyright and attribution boundary

Article prose, titles, summaries, and grouping are original synthesis.
Framework, API, product, and issue names are used only as factual locators. The
batch does not reproduce Apple's paragraphs, workaround instructions, complete
lists, screenshots, artwork, or marketing copy. Every structured occurrence
links to a preserved Apple page, while the exact raw URL remains available for
independent verification.

## Closure guards

- exact comparison against four local seed records and all 39 milestones
- exact 35-route prerelease audit with a six-route allowlist and 29 gaps
- approved Public ownership remains in `apple-other-2023.json`
- zero versions and zero builds
- collision scan across every other batch and the launch manifest
- complete 54-occurrence, 54-definition,
  source, and citation closure
- deterministic formatted JSON SHA-256: `912daa8596cb4d8ce4b32629774e816e0eb6b1e0ec97f6bd557e35e306e3d755`

## Validation and production plan

Independent editorial and evidence review approved all six articles and all
54 occurrences at `2026-07-30T08:50:57Z`:

- repository validation: 53 batches and
  2867 globally consistent change keys
- focused ingestion and manifest suite: 19 tests
- exact raw replay: 132 issue-ID, component,
  status-heading, and boundary assertions
- copyright-similarity scan: the longest contiguous overlap between editorial
  fields and Apple list records was
  4 words
- ESLint, Prettier, `git diff --check`, and deterministic regeneration: pass

Reviewed production plan:

- plan SHA-256: `c552ffebb28cd71c673fb3e49d7f334c91537517717e2dc5f8a1a8d6ea65ece4`
- 61 creates: 7 sources and 54 release changes
- 6 revision-guarded patches on exactly the six allowlisted
  existing events; zero version, event, or build creates and zero version
  patches
- event patches add the article, summary, citations, change references,
  `editoriallyVerified` provenance, approved review state, and indexability
- 2076 unchanged documents and a
  141,878-byte mutation payload
- plan artifact SHA-256: `feea19857e0b4a1d9bcc75664ee9a86bc008eda3fe3562b4885af99d208fe2dc`
- rollback artifact SHA-256: `68c7978f31910ca0c69a7f009d8dafa2aee7f0338636bb49e6b03ed3c43731b0`

Publication receipt:

- guarded Sanity transaction: `tt1fSB5HY9GAB0YLyyVsnt`
- apply receipt SHA-256: `b943198ddd77e429a240c9276ba2e38772102ae6602c04a87c5ca01d044b5f1d`
- immediate independent dry run: zero creates, zero patches,
  2,143 unchanged
  documents, and a 16-byte payload
- zero-plan SHA-256: `98d4d1fc3a204cc719975332c99a6a0b6e5c64fe9805ff1084e561008fb11d62`
- zero-plan artifact SHA-256:
  `bfc7454d65a2a456c5f3c423a0cc89da30a041de700ca673759b8c58646fdd2d`
- zero-plan rollback artifact SHA-256:
  `0d49d8de38c10b73a1c72e50346443549a0a2e7995812771a819ce31ebe164a6`

Production coverage after publication:

- 410 of 410
  release versions have full version-level articles
- 1979 appearances:
  375 full articles,
  256 source-linked records, and
  1348 timeline-only records
- 526 appearances have approved
  structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned HTTP 200, the full article, References, and `index, follow`;
none returned a timeline placeholder or `noindex`.

| Canonical route             | HTTP | Full article | References | Index |
| --------------------------- | ---: | ------------ | ---------- | ----- |
| `/apple/macos/14.0/beta-1/` |  200 | yes          | yes        | yes   |
| `/apple/macos/14.0/beta-2/` |  200 | yes          | yes        | yes   |
| `/apple/macos/14.0/beta-3/` |  200 | yes          | yes        | yes   |
| `/apple/macos/14.0/beta-4/` |  200 | yes          | yes        | yes   |
| `/apple/macos/14.0/beta-5/` |  200 | yes          | yes        | yes   |
| `/apple/watchos/10.0/rc/`   |  200 | yes          | yes        | yes   |

Final verification on 2026-07-30:

- `npm run research:validate`: 53 batches and
  2867 globally consistent change keys
- full repository suite: 131 tests passed; focused ingestion and manifest
  suite: 19 tests passed
- independent raw replay: 132 evidence
  assertions passed
- independent copyright-similarity scan: maximum non-identifier overlap of
  4 words
- ESLint, Prettier, focused `git diff --check`, and deterministic
  regeneration: passed
- the final planner reported “No Sanity data changed”

Reproduce the local checks with:

```sh
node scripts/research-batches/build-apple-nonios-2023-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-nonios-2023-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-nonios-2023-prerelease.mjs scripts/research-batches/apple-nonios-2023-prerelease.json scripts/research-batches/apple-nonios-2023-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-nonios-2023-prerelease.json
```

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
