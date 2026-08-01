# Apple iOS 8 prerelease archive batch

## Result

`apple-ios-8-prerelease.json` is the editorially approved overlay for all six existing
iOS 8.0 prerelease routes. It combines three preserved first-party Apple page
states, two integrity-checked Apple-authored transcripts, and a byte-verifiable
Apple Developer PDF.

- 6 substantive event overlays and no release-version overlays
- 202 milestone-specific occurrences across
  190 stable, collision-checked definitions
- 6 declared and used sources with 746 citation
  references
- zero builds, build-number claims, route creation, Public-route changes,
  or community-observation changes
- every event is `editoriallyVerified`, approved at `2026-07-30T10:48:59Z`, and
  indexable

## Approved route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               30 |
| iOS      | Beta 2    | `beta-2`       |               74 |
| iOS      | Beta 3    | `beta-3`       |               38 |
| iOS      | Beta 4    | `beta-4`       |               29 |
| iOS      | Beta 5    | `beta-5`       |               21 |
| iOS      | GM        | `gm`           |               10 |

Public is already owned by `apple-ios-8.json` and is untouched.

## Evidence method

1. Beta 1, Beta 2, and GM are exact captures of Apple’s original
   `RN-iOSSDK-8.0` page. Their titles and update footers identify June 2,
   June 16, and September 9 document states.
2. Beta 1 is a conservative first-document baseline of 30 exact Note or Known
   Issue records. Boilerplate and workaround text are excluded.
3. Beta 2 includes all 74 non-workaround records under exact “Fixed in beta 2”
   headings.
4. Beta 3’s transcript contains 42 fixed records. Thirty-eight are retained
   because the same component and normalized issue occur in Apple’s archived
   Beta 2 Known Issue state. Three transcript-only records and one record Apple
   had already labeled fixed in Beta 2 are excluded.
5. Beta 4 includes all 29 fixed records in a transcript captured the next day.
   Its normalized fixed inventory is identical on the current page.
6. Beta 5 includes all 21 substantive fixed records from an Apple PDF whose
   current mirror and Internet Archive replay are byte-identical.
7. GM includes all ten records beneath Apple’s exact “Fixed in GM Seed”
   headings.
8. Eleven exact Beta 1-to-Beta 2 transitions reuse one canonical identity
   across their known and fixed occurrences. The matching HomeKit/Siri record
   also retains that identity in GM.

## Raw evidence ledger

| State  | Public artifact                                              |                                               Count | SHA-256                                                                                                                                     | Use                                 |
| ------ | ------------------------------------------------------------ | --------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Beta 1 | Apple HTML replay; captured 2014-06-03                       |       17 Note records; 30 selected baseline records | `c46f99da95ebdef730c6891cf5c366fd08224eaab7dea3514cfce90f404261fe`                                                                          | Exact first-document state          |
| Beta 2 | Apple HTML replay; captured 2014-06-25                       |                     74 non-workaround fixed records | `1ff69e7c4941df3eac813e40559c63e68cde6c410a9321c79a24a2a2e92c4531`                                                                          | Complete explicit Beta 2 fixed set  |
| Beta 3 | Live transcript HTML; two-fetch stable wrapper on 2026-07-30 |        42 non-workaround fixed records; 38 selected | `7a4d620948a0642e677e457b49c33c59180091320d0a8869801ab9eb9ee8e5e2`                                                                          | Current transcript cross-check      |
| Beta 3 | Earliest archive replay; captured 2019-07-23                 |                      normalized 42-record inventory | `5584690965d6b06bd5b13ec9ca0405623704ccc7529e7ccdc02c74fc9424c336`                                                                          | Inventory integrity check           |
| Beta 4 | Next-day archive replay; captured 2014-07-22                 |                     29 non-workaround fixed records | `b204cb8c9de06fbe45d691d477de3496fddf32d8b76ba1bf87fcedc317d68f79`                                                                          | Complete explicit Beta 4 fixed set  |
| Beta 4 | Live transcript HTML; dynamic wrapper on 2026-07-30          |                      normalized 29-record inventory | `49aeb7b1e22adafc009cf71afa0333eef11af7a3c30212e362507988003c3547`, then `675a923e32d06f76fa6fcc2fa584136ee15ffc4b6b686fd182bdf693d1565a2c` | Current transcript cross-check only |
| Beta 5 | Apple Developer PDF mirror and byte-identical archive replay | 11 PDFKit-readable pages; 21 selected fixed records | `9a318824510c9eaa717d721585d805cc223f8ebb0b3bc713d6a492013d2bcfb8`                                                                          | Complete explicit Beta 5 fixed set  |
| GM     | Apple HTML replay; captured 2014-09-10                       |                                    10 fixed records | `edc931c85c2a9455bd215b9cd801b380348edf36cc254c2ee03426ba0150ffc4`                                                                          | Complete explicit GM fixed set      |

The Beta 3 current and archived normalized fixed-record inventories share
SHA-256 `f4eacc3262dc5fb67e579ab2d3fa28c12cdaa938c407889b02316e9845820f36`.
The Beta 4 pair share normalized inventory SHA-256
`412064498155ea6e5490746b487c33568a5679dfeb35e683846d211ffe1572f1`.
The live page wrappers are not treated as immutable evidence: Beta 3 was stable
across two immediate fetches, while Beta 4 changed between two immediate
fetches even though both produced the exact locked 29-record inventory.
Raw artifacts remain in a temporary research directory and are not committed.

## Exact evidence gaps and exclusions

- Beta 1 has no predecessor document. Its 30 records are explicitly labeled a
  first-document baseline, not a claim that Apple introduced every behavior on
  June 2.
- The Beta 3 transcript’s earliest public archive capture is from 2019. This
  batch therefore requires a matching Beta 2 first-party Known Issue for every
  selected Beta 3 record.
- Three Beta 3 fixed records have no exact Beta 2 predecessor match: family
  push notifications, newly added iCloud Drive files, and Simulator profile
  drag-and-drop. They remain timeline-only.
- A fourth Beta 3 record says Ask to Buy was fixed, but Apple had already placed
  the same record under “Fixed in beta 2.” It is excluded rather than assigned
  twice.
- Beta 4 is a third-party transcript, but a next-day Internet Archive capture
  preserves its Apple anchors and its complete fixed inventory remains stable.
- Beta 5 is a mirrored Apple PDF; the original prerelease URL is not publicly
  navigable. The mirror and archive replay are byte-identical.
- No community-discovered changes or publisher feature lists are imported.
- Public is already owned by `apple-ios-8.json` and remains untouched.
- No build number is inferred from publisher prose or unavailable downloads.

## Copyright and attribution controls

- All article, title, summary, and canonical-summary fields are original
  synthesis.
- Apple-authored documents and transcripts are linked, titled, and credited;
  no PDF, transcript, screenshot, or long source excerpt is checked into the
  repository.
- Citation locators retain only short component, status, and record identifiers.
- Publisher commentary and workaround prose are excluded.
- The artifacts are used as factual evidence for component, status, and
  milestone boundaries, not republished as substitute copies.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS SDK Release Notes for iOS 8.0 Beta](https://web.archive.org/web/20140603004241id_/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-8.0/index.html) — Apple Developer document preserved by Internet Archive; archive.
- [iOS SDK Release Notes for iOS 8.0 Beta 2](https://web.archive.org/web/20140625110018id_/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-8.0/index.html) — Apple Developer document preserved by Internet Archive; archive.
- [iOS 8 Beta 3 Release Notes (Apple-authored transcript)](https://bjtechnews.org/2014/07/ios-8-beta-3-release-notes/) — Apple Developer notes preserved by BTNHD; archive.
- [iOS 8 Beta 4 changelog (Apple-authored transcript)](https://www.idevice.ro/2014/07/21/ios-8-beta-4-changelog/) — Apple Developer notes preserved by iDevice.ro; archive.
- [iOS SDK Release Notes for iOS 8.0 Beta 5](https://www.iphonemod.net/wp-content/uploads/2014/08/iOS-8-Beta-5-Release-Notes.pdf) — Apple Developer document mirrored by iPhoneMod; archive.
- [iOS SDK Release Notes for iOS 8.0 GM Seed](https://web.archive.org/web/20140910201412id_/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-8.0/) — Apple Developer document preserved by Internet Archive; archive.

## Closure guards

- Exact comparison against the local iOS 8.0 seed record and all seven
  milestones
- Exact six-route allowlist with Public excluded
- Zero versions and zero builds; exact approved review, provenance, and
  indexability closure for every event
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 202 occurrences resolve to exactly
  190 stable local definitions
- Exact source-state comparison closes 11 selected Beta 1-to-Beta 2
  transitions and the repeated GM HomeKit/Siri record onto shared identities
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `83827579cfe03a6e89a1439143cb13e0cfaf8349415e24960daef43af36db524`

## Editorial approval and validation record

The independently reviewed event overlays are approved:

- provenance: `editoriallyVerified`
- editorial status: `approved` at `2026-07-30T10:48:59Z`
- indexability: `true`

Verified on 2026-07-30:

- `npm run research:validate`: 63 batches validated; this batch reports 6
  events, 202 changes, 6 sources, and 746 citations; 3,771 change keys are
  globally consistent
- focused ingestion/manifest suite: 19 tests passed
- HTML-state audit: 17 Beta 1 Note records, 74 Beta 2 fixed records, 42 Beta 3
  fixed records with an exact 38-known/1-already-fixed/3-unmatched predecessor
  split, 29 Beta 4 fixed records, and 10 GM fixed records
- HTML locator audit: every one of the 181 selected non-PDF records resolves
  uniquely inside its exact component and milestone status through its locator
  and editorial identity terms; all 38 selected Beta 3 records also resolve to
  an exact Beta 2 Known Issue predecessor
- canonical-transition audit: all 11 exact selected Beta 1-to-Beta 2
  transitions share one change identity, including the HomeKit/Siri identity
  that recurs in GM
- Beta 5 PDF audit: 11 readable pages, 15 fixed-section headings, and 21
  selected locator assertions
- copyright-similarity scan: maximum contiguous overlap of 5 words
- ESLint, Prettier check, and `git diff --check`: passed
- applied production plan: 196 creates,
  6 revision-guarded patches, and 2076 unchanged
  documents
- create split: 6 sources and
  190 stable change documents
- mutation payload: 516,404 bytes
- production plan SHA: `5d699b661bf24885e037c16b325612f8ed8a913066f6d5c76b0e58f6092eb630`
- plan artifact SHA-256: `ebe2208d5f68b3ab401da9ce8b78039be7b33f6c607a3f8f74f48b817b1d61f3`
- rollback artifact SHA-256: `8a4788a22ba26767f76547851a97a05ce0bd409b0e3840d14854b5693a091fa2`
- all six planned patches target the exact existing Beta 1–5 and GM event
  documents; each is revision-guarded and sets article, change, citation,
  approved review, provenance, summary, and indexability fields only

## Publication receipt

- applied plan SHA: `5d699b661bf24885e037c16b325612f8ed8a913066f6d5c76b0e58f6092eb630`
- reviewed plan artifact SHA-256: `ebe2208d5f68b3ab401da9ce8b78039be7b33f6c607a3f8f74f48b817b1d61f3`
- rollback artifact SHA-256: `8a4788a22ba26767f76547851a97a05ce0bd409b0e3840d14854b5693a091fa2`
- Sanity transaction: `tt1fSB5HY9GAB0YLyymd4F`
- receipt SHA-256: `45b4c4e1e3ddc26342e4d8001ace13b08bb16ac2ffe25a38678a87885be68ff7`
- immediate post-publication zero plan:
  `5fbc99d019de969c277f1ebe16570ee3ca73e09fc2fd22ed94aa849fd9c0487f`;
  0 creates,
  0 patches,
  2,278 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `0367a9e2e2c1717cb2e902e634ec50f8ab5533b17c8bbcf265c4ed667e610802`
- zero-plan rollback artifact SHA-256:
  `87d4f54d9b88e4ce12936076973bd0d0f2a4f3df0546724a48c746fd655c5d6b`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 419 full articles,
  256 source-linked records, and
  1,304
  timeline-only records
- 570 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the full archival article, every expected structured
change title, References, and its primary source. No response returned
placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Full article | Expected changes | References | Primary source | Placeholder | Noindex |
| ------------------------ | ---: | ------------ | ---------------- | ---------- | -------------- | ----------- | ------- |
| `/apple/ios/8.0/beta-1/` |  200 | yes          | 30/30            | yes        | yes            | no          | no      |
| `/apple/ios/8.0/beta-2/` |  200 | yes          | 74/74            | yes        | yes            | no          | no      |
| `/apple/ios/8.0/beta-3/` |  200 | yes          | 38/38            | yes        | yes            | no          | no      |
| `/apple/ios/8.0/beta-4/` |  200 | yes          | 29/29            | yes        | yes            | no          | no      |
| `/apple/ios/8.0/beta-5/` |  200 | yes          | 21/21            | yes        | yes            | no          | no      |
| `/apple/ios/8.0/gm/`     |  200 | yes          | 10/10            | yes        | yes            | no          | no      |

Final verification on 2026-07-30:

- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests passed
- deterministic regeneration preserved JSON SHA-256 `83827579cfe03a6e89a1439143cb13e0cfaf8349415e24960daef43af36db524`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,278 unchanged
  documents, the 16-byte payload, and
  plan SHA `5fbc99d019de969c277f1ebe16570ee3ca73e09fc2fd22ed94aa849fd9c0487f`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-8-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-8-prerelease.mjs scripts/research-batches/audit-ios8-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-8-prerelease.mjs scripts/research-batches/apple-ios-8-prerelease.json scripts/research-batches/apple-ios-8-prerelease.md scripts/research-batches/audit-ios8-html-states.mjs
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-8-prerelease.json
```

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
