# Apple iOS and iPadOS 13 prerelease archive batch

## Result

`apple-ios-ipados-13-prerelease.json` publishes a primary-source-backed archive for 16
existing iOS and iPadOS 13.0 routes: Beta 1 through Beta 5, Beta 3 v2,
Beta 7, and Beta 8 on each platform.

- 16 substantive event overlays and no release-version overlays
- 178 change occurrences across 92
  stable, collision-checked definitions
- 10 declared and used sources with 638 citation
  references
- zero builds, build-number claims, route creation, Beta 6 changes, GM changes,
  Public-route changes, or administrative identity changes
- every event is `editoriallyVerified`, approved at `2026-07-30T09:04:52Z`, and
  indexable

## Published route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               13 |
| iOS      | Beta 2    | `beta-2`       |               13 |
| iOS      | Beta 3    | `beta-3`       |               15 |
| iOS      | Beta 3 v2 | `beta-3-v2`    |                2 |
| iOS      | Beta 4    | `beta-4`       |               19 |
| iOS      | Beta 5    | `beta-5`       |               18 |
| iOS      | Beta 7    | `beta-7`       |                6 |
| iOS      | Beta 8    | `beta-8`       |                8 |
| iPadOS   | Beta 1    | `beta-1`       |               13 |
| iPadOS   | Beta 2    | `beta-2`       |               13 |
| iPadOS   | Beta 3    | `beta-3`       |               11 |
| iPadOS   | Beta 3 v2 | `beta-3-v2`    |                1 |
| iPadOS   | Beta 4    | `beta-4`       |               16 |
| iPadOS   | Beta 5    | `beta-5`       |               17 |
| iPadOS   | Beta 7    | `beta-7`       |                6 |
| iPadOS   | Beta 8    | `beta-8`       |                7 |

The local seed contains 20 iOS/iPadOS 13.0 milestones. Beta 6 on both
platforms, iOS GM, and iOS Public remain outside this prerelease archive pass.
Public is already owned by `apple-ios-ipados-13.json`.

## Archive method

1. Exact Internet Archive CDX inventories were queried for each legacy Apple
   Developer milestone slug rather than a broad prefix.
2. The preserved Apple pages are server-rendered human documents. Each state
   was parsed by component, status heading, list record, and retained issue ID.
3. Beta 1 is a representative New Features baseline. Beta 2, Beta 3, Beta 3
   v2, Beta 4, Beta 5, and Beta 8 use adjacent retained states; exact additions
   and status transitions are preferred over wording edits.
4. Beta 7 has an exact self-identifying Apple page, but its previous retained
   page is Beta 5. To avoid crossing Beta 6, only Beta 7's own Resolved Issues
   records are used and no page-to-page delta is claimed.
5. Explicit iPhone, CarPlay, Health, Apple Watch, cellular, iPhone Storage,
   iPad, Split View, Slide Over, and Apple Pencil language controls route scope.

## Raw snapshot audit ledger

Canonical SHA-256 values below cover the ordered parsed object
`{title, records:[{component,status,issueIds,text}]}` after collapsing DOM
whitespace in title, component, status, and text, serialized with
`JSON.stringify`.

| Milestone state    | Capture          | CDX digest                         | CDX length | Records | Issue IDs | Canonical SHA-256                                                  |
| ------------------ | ---------------- | ---------------------------------- | ---------: | ------: | --------: | ------------------------------------------------------------------ |
| Beta 1             | `20190605224338` | `HZFWPQVOBZIMBKLLOFSWHAFHP3H2EQMR` |     33,678 |     155 |       161 | `f120b70d949ff43576028421b447c617cfe16122dd2439c9f79d8317af853b9e` |
| Beta 2             | `20190617182129` | `HDJTBLMD4DHXRBAS2QMV7IA5UBPNPV4X` |     37,138 |     190 |       198 | `0962ae88525ff8c3314c78978d5f0ffcec3b864899d065cbbf65f8aba0c83392` |
| Beta 2 comparison  | `20190701210440` | `AFPXWYFZYEHTVVOH5DBEJQK4Q5NHPWMV` |     36,995 |     190 |       198 | `491f000d699ed72537f960aa48f14475e04bd2e8238471d8700dfff4d8a25560` |
| Beta 3             | `20190704121813` | `C7IR2M27SHNVR4MK5XWLUNQX5Z6RT56Y` |     30,982 |     124 |       131 | `b851589ec4ff4e36a0569e5312c5c1b4d6332bf09fbdcf4651c5e800f1b0d94d` |
| Beta 3 v2 boundary | `20190711171915` | `G2NVUTMNB7L674IQD33Z6FTWGXW7DNUE` |     30,994 |     124 |       131 | `ac9f8911ba79292f39431a5e6624d0db0b456633e762eb8762c7ad5ec2c87dcc` |
| Beta 4             | `20190718064136` | `6UZX6FMWEIULIW7OSRNCXCYKBIEGQBX5` |     34,405 |     137 |       144 | `41bc7a643b6be7c663403b44411a51dfc55afe36f7c2c57a3965435be2eaf5bb` |
| Beta 5             | `20190730072345` | `DLIXBWHMGFWLW3WS5ZSVU32V2FGZQFXA` |     34,160 |     100 |       103 | `ec80e95a46c1872e24797ac3f9b92d681f976d5ae1d2a64735993f3b94c821ab` |
| Beta 7             | `20190815184709` | `JKFXPKWZ7LQJC4MCJVMQVSR5XNBHZE6K` |     32,473 |      88 |        91 | `df3624bd3b2dd21997103028f37b33ac307f1c39b823ce8d399f07a04b7b66be` |
| Beta 8             | `20190822104335` | `2WA4DIFYEU2W3RFAAFGZUWE4ZFO7DNRY` |     32,580 |      86 |        88 | `6d1434545a8451375e39eb0843a029457c63a5561de02248c51168cd93fae8dc` |

## Exact evidence gaps

- The exact Beta 6 Apple slug has no CDX capture. Beta 5-to-Beta 7 crosses that
  milestone, so it is never used as a Beta 7 delta.
- Beta 3 v2 retains the Beta 3 document title, but its two status transitions
  explicitly say they apply starting in build 17A5522g and the capture falls
  after the July 8 revision and before Beta 4.
- iOS GM has no audited milestone page in this pass.
- Public is already represented by the public-release batch and is untouched.
- No complete first-party build-number set was independently retained. This
  batch creates no build documents.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS & iPadOS 13 Beta Release Notes (preserved snapshot)](https://web.archive.org/web/20190605224338/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 2 Release Notes (preserved snapshot)](https://web.archive.org/web/20190617182129/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_2_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 2 Release Notes — July 1 state (preserved snapshot)](https://web.archive.org/web/20190701210440/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_2_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 3 Release Notes (preserved snapshot)](https://web.archive.org/web/20190704121813/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_3_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 3 Release Notes — July 11 state (preserved snapshot)](https://web.archive.org/web/20190711171915/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_3_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 4 Release Notes (preserved snapshot)](https://web.archive.org/web/20190718064136/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_4_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 5 Release Notes (preserved snapshot)](https://web.archive.org/web/20190730072345/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_5_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 7 Release Notes (preserved snapshot)](https://web.archive.org/web/20190815184709/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_7_release_notes) — Apple Developer via Internet Archive; archive.
- [iOS & iPadOS 13 Beta 8 Release Notes (preserved snapshot)](https://web.archive.org/web/20190822104335/https://developer.apple.com/documentation/ios_ipados_release_notes/ios_ipados_13_beta_8_release_notes) — Apple Developer via Internet Archive; archive.
- [Installing and using Apple beta software](https://developer.apple.com/support/install-beta) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against both local 13.0 seed records and all 20 milestones
- Exact 16-route allowlist with explicit exclusion of Beta 6, GM, and Public
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 178 occurrences resolve to exactly
  92 stable local definitions
- Explicit rejection of identity, build, TestFlight, and administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `1d67813a955e9ee0c9fb5440cf75f28c11386c273dc44504843ffc948830e468`

## Publication and validation record

The generator's seed, route, collision, review-state, evidence-boundary, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all nine retained Apple states were independently replayed; every document
  title, record count, unique issue-ID count, and canonical parsed-state
  SHA-256 matched this ledger exactly
- all 178 occurrence checks and 187 issue-ID assertions matched the
  exact component and status heading in the cited Apple state
- all 148 adjacent-boundary assertions passed; Beta 1 and Beta 7 retained their
  explicitly documented baseline methods
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 6 words, limited to the factual iPhone 7 device sequence
- all 16 event articles and all 178 occurrences were approved at
  `2026-07-30T09:04:52Z`

Publication receipt:

- applied production plan: `04161943c522d1799a35c5ee7fc93edd66b183ffa295ecf2c21a84b8da2af75d`
- reviewed plan artifact SHA-256: `6174a0c4483d162269ea819228abd51b9706a3522699bdd616aeac83bd09307a`
- rollback artifact SHA-256: `0efef1669a3f673d13dc04244a7f4c32fd68bff42d38f8a46711e8f20e237645`
- Sanity transaction: `eOgq1Ovu5XNUv1qNFUxq3z`
- receipt SHA-256: `6e37467c042bae2cdf9957e2b3c43321d22772c4bbf58aefc10fedd735b96356`
- immediate post-publication zero plan:
  `fe252148f4c0213341051acffad64f6c41f0eda4de2f5c451367124467adec34`; zero creates, zero patches,
  2,184 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `27f6298b778c8f21e4203b6ce899d0b57128c7d3360c8ec8bb43d530eaf6a699`
- zero-plan rollback artifact SHA-256:
  `fbe91930673227f8c3c14a342b92ab3a80c42410a325a08f6295f986d0792dad`

Production coverage after publication:

- 410 of 410 release versions have full version-level coverage
- 1,979 appearances: 391 full articles, 256 source-linked records, and 1,332
  timeline-only records
- 542 appearances have approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, release-note evidence,
References, and `index, follow`; none returned a timeline placeholder,
placeholder copy, or `noindex`.

| Canonical route                 | HTTP | Full article | Evidence | References | Index |
| ------------------------------- | ---: | ------------ | -------- | ---------- | ----- |
| `/apple/ios/13.0/beta-1/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-2/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-3/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-3-v2/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-4/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-5/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-7/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ios/13.0/beta-8/`       |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-1/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-2/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-3/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-3-v2/` |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-4/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-5/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-7/`    |  200 | yes          | yes      | yes        | yes   |
| `/apple/ipados/13.0/beta-8/`    |  200 | yes          | yes      | yes        | yes   |

Final verification on 2026-07-30:

- `npm run research:validate`: 55 batches validated; this batch reports 16
  events, 178 change occurrences, 10 sources, and
  638 citation references; 2,978 change keys remain globally
  consistent
- full repository suite: 131 tests passed
- focused ingestion/manifest suite: 19 tests passed
- all 178 occurrence checks, 187 issue-ID assertions, and 148
  adjacent-boundary assertions passed
- independent copyright-similarity scan: maximum contiguous overlap of 6 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  `1d67813a955e9ee0c9fb5440cf75f28c11386c273dc44504843ffc948830e468`
- final production dry run reproduced zero creates, zero patches,
  2,184 unchanged
  documents, the 16-byte payload, and
  plan SHA `fe252148f4c0213341051acffad64f6c41f0eda4de2f5c451367124467adec34`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-ipados-13-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-ipados-13-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-ipados-13-prerelease.mjs scripts/research-batches/apple-ios-ipados-13-prerelease.json scripts/research-batches/apple-ios-ipados-13-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-13-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
