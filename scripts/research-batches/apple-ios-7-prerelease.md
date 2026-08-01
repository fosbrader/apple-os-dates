# Apple iOS 7 prerelease archive batch

## Result

`apple-ios-7-prerelease.json` is the independently reviewed editorial overlay for all seven
existing iOS 7.0 prerelease routes.

- 7 substantive event overlays and no release-version overlays
- 126 source-backed change occurrences across
  105 stable, collision-checked definitions
- 17 declared and used sources with 709 citation
  references
- zero builds, build-number claims, route creation, or Public-route changes
- every event is `editoriallyVerified`, approved at `2026-07-30T11:22:57Z`, and
  `isIndexable: true`

## Approved route closure

| Milestone | Existing alias | Selected changes | Fixed | Current known |
| --------- | -------------- | ---------------: | ----: | ------------: |
| Beta 1    | `beta-1`       |               33 |     0 |            31 |
| Beta 2    | `beta-2`       |                6 |     0 |             0 |
| Beta 3    | `beta-3`       |               26 |    21 |             1 |
| Beta 4    | `beta-4`       |               38 |    22 |             6 |
| Beta 5    | `beta-5`       |               12 |     8 |             0 |
| Beta 6    | `beta-6`       |                1 |     1 |             0 |
| GM        | `gm`           |               10 |     2 |             5 |

The local iOS 7.0 seed contains eight milestones. Public is already owned by the
approved `apple-ios-7.json` batch and is untouched.

## Evidence method

1. Beta 1 uses a clean June 15, 2013 Internet Archive snapshot of a complete
   Apple Developer transcript. Apple Newsroom confirms immediate beta
   availability, and an MIT-hosted one-page PDF independently retains the
   Apple document identity. The PDF is explicitly partial and supports no
   individual change claim.
2. Beta 2 is intentionally narrow. Three records rely on Seed 2-specific
   language preserved independently by the Seed 3 PDF and fixed BGR Seed 3
   transcript. Three visible additions use two contemporaneous publishers and
   remain `partiallyDocumented`. The fixed BGR Beta 2 page establishes the
   release boundary only; stale cumulative text is not treated as a full
   milestone delta.
3. Beta 3 uses a byte-verifiable twelve-page PDF plus a fixed BGR snapshot.
   Twenty-one records come from explicit fixed sections; five additional
   records use self-identifying Seed 3 or clear milestone-state language.
4. Beta 4 and Beta 5 use fixed BGR archive states with independently retained
   reproductions. Explicit fixed headings are attached directly. Additions are
   limited to self-dating notes or conservative comparison with the exact
   preceding retained state.
5. Beta 6 is limited to the independently reproduced iTunes in the Cloud
   correction. The cumulative body is not presented as a fresh change set.
6. GM uses two matching reproductions for its two explicit fixes and eight
   GM-specific compatibility or known-issue records. General carry-forward is
   excluded, and Public remains a separate event.

## Raw-source audit ledger

| State                            | Integrity model                                               |            Bytes / pages | SHA-256                                                            | Use                                         |
| -------------------------------- | ------------------------------------------------------------- | -----------------------: | ------------------------------------------------------------------ | ------------------------------------------- |
| Apple Beta 1 announcement        | normalized live `article`; identical across two fetches       |              8,888 bytes | `919076459f09771267960439625dd4efd996aad9fb418f0cfe7a54c0665d2d5b` | Beta 1 timing                               |
| Phones Review Beta 1 archive     | exact fixed replay body                                       |             54,740 bytes | `68a334e90baefee0cc7bfeb2246bc7208cb674aee337973f816dddd642aa097a` | Beta 1 body                                 |
| MIT Beta 1 partial PDF           | exact file; every page visually checked                       |    71,768 bytes / 1 page | `55f499340bc8f22d183055da470e51fba14b91a7cc2154035e067cf67ef2e039` | Identity only                               |
| BGR Beta 2 archive               | exact fixed replay body                                       |             89,809 bytes | `44be434cf3663f7cd8cc12e5f5bd92d0f210c6daac39e37a7f88864ecab8860b` | Seed 2 release boundary                     |
| iDownloadBlog Beta 2             | normalized live article; identical across two fetches         |              2,091 bytes | `a86212f017c3981eacf2ff944d1ac44e3dde05c9096786c9178ff40dc5e77529` | Visible changes                             |
| 9to5Mac Beta 2                   | normalized live article; identical across two fetches         |              2,971 bytes | `0db0868c37c13afee382d4f43faeef11904083486206eae15218dd4c2e64230b` | Visible-change corroboration                |
| Apple-authored Beta 3 PDF mirror | exact file; every page visually checked                       | 151,476 bytes / 12 pages | `7006fff69aef3ab6ac3203cce5788be9a774d93247da8c8c7b7499061047060e` | Beta 3 body and Beta 2 retrospective labels |
| BGR Beta 3 archive               | exact fixed replay body                                       |             88,140 bytes | `663519c5b94206956a8a9121374c59b0e5b88a0b339a327164b37b1f9972a617` | Beta 3 corroboration                        |
| BGR Beta 4 archive               | exact fixed replay body                                       |             85,231 bytes | `421f4a660769db44bc2822ce3c4c3b08b18f5aa687024c4b8c97f1f49ca49042` | Beta 4 body                                 |
| Wccftech Beta 4                  | normalized live article; identical across two fetches         |             22,576 bytes | `ddc4a6c4e5072f1daaa713d807da3c0c5914e8e69c3d6f968c138a6d2f064365` | Beta 4 corroboration                        |
| BGR Beta 5 archive               | exact fixed replay body                                       |             81,678 bytes | `b1ac7ad90ecde73581f676cc3ca889db53cb349259f4be0d3b4f54af0d31a6df` | Beta 5 body                                 |
| iDevice.ro Beta 5                | normalized live changelog block; identical across two fetches |             26,705 bytes | `b26bfcbb2272ea9ceff7de5a04755b1c15683565d19099e19f4df616b3b46916` | Beta 5 corroboration                        |
| iDevice.ro Beta 6                | normalized live article; identical across two fetches         |             19,197 bytes | `b3f4f52636de53be15de8ba92d5d60e7ca8743e6585a5d720b98c421ac99fa73` | Beta 6 notice                               |
| iDownloadBlog Beta 6             | normalized live article; identical across two fetches         |              1,336 bytes | `c7ed5e41aca1dc3536c0b46e5e02a437def2ab0aac9d1645f6afdefc1438eb62` | Beta 6 corroboration                        |
| BGR GM archive                   | exact fixed replay body                                       |             83,440 bytes | `ffe6720847b96f0349b358de1f1a10f9e88535bc27b827e677d9e588d6efe3e2` | GM body                                     |
| IntoMobile GM                    | normalized live article; identical across two fetches         |             16,422 bytes | `3e1397ad025f1e9d8773d703bf15bfd0d8a11e581a1aa16c6d274d1e2faf0ee4` | GM corroboration                            |
| Apple final notes                | normalized live support body; identical across two fetches    |             11,100 bytes | `d02b2881d61fe9b6a7741dc71b2834dfff3a4fe4fa8fdc2957d7ce3b36818a0d` | Public boundary only                        |

Fixed Internet Archive citations use timestamped `id_` replays without toolbar
rewriting. Live pages were independently fetched twice: wrapper bytes were
allowed to vary, while each scoped article or changelog body reproduced the
same normalized hash. Both PDFs were rendered and checked page by page. The
executable audits assert 190 HTML locators, 29 PDF-backed citations, 30
distinctive PDF probes, route closure, and canonical recurrence.

## Copyright and editorial method

Every title, canonical summary, article paragraph, and occurrence summary is
original synthesis. Technical identifiers and product names are retained only
where needed to identify an API, framework, setting, or affected feature. The
manifest does not republish Apple’s lists or publisher prose.

Third-party hosts are credited as preservation or journalistic sources, while
Apple is identified as the author of the reproduced developer material. No
mirror is described as first-party hosting. Community-observed Beta 2 features
are explicitly separated from developer-note evidence.

Repeated defects retain one canonical identity as they move from a current
known issue to a later fixed section. This supports a wiki-style history without
presenting cumulative documentation as a fresh release delta.

## Exact evidence gaps

- No complete first-party-hosted Beta 1 document remains in the audited public
  set. The detailed body comes from a fixed publisher transcript; the
  institutional PDF retains only its opening page.
- No byte-verifiable first-party Beta 2 body was recovered. The surviving
  Beta 2 transcript establishes the date but does not support the three
  retrospective Seed 2 claims; those are included only because both retained
  Seed 3 reproductions explicitly date them. The other three records use two
  independent release-day reports.
- The Beta 3 PDF and the later milestone bodies are preserved by third parties.
  All occurrences therefore remain corroborated rather than confirmed.
- Beta 4 and Beta 5 selections are high-signal, not claims that every paragraph
  in a cumulative developer document was newly introduced.
- A photo-thumbnail note found in the retained Beta 5 material is not
  backdated to Beta 4 or presented as a fresh Beta 5 delta.
- Beta 6 supports one isolated correction. Other milestone changes remain an
  explicit evidence gap.
- No complete first-party build-number set was retained. The batch creates no
  build documents and makes no build assertion.
- Public is already covered by the approved iOS 7 batch and is neither
  duplicated nor patched here.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Apple Unveils iOS 7](https://www.apple.com/newsroom/2013/06/10Apple-Unveils-iOS-7/) — Apple Newsroom; firstPartyAnnouncement.
- [iOS 7 Beta 1 release notes live with developer download](https://web.archive.org/web/20130615040305/http://www.phonesreview.co.uk/2013/06/10/ios-7-beta-1-release-notes-live-with-dev-download/) — Phones Review via Internet Archive; archive.
- [iOS SDK Release Notes for iOS 7.0 (preserved opening page)](https://wikis.mit.edu/confluence/download/attachments/100208014/iOS.7.Release.Notes.11A4372q%20.pdf?api=v2) — MIT Wiki document attachment; archive.
- [iOS 7 Beta 2 change log and iPad release](https://web.archive.org/web/20130624222434/http://bgr.com/2013/06/24/ios-7-beta-2-change-log-ipad/) — BGR via Internet Archive; archive.
- [iOS 7 Beta 2 is out with iPad support and other features](https://www.idownloadblog.com/2013/06/24/ios-7-beta-2-is-out/) — iDownloadBlog; journalism.
- [Apple seeds iOS 7 Beta 2 to developers with Voice Memos and Siri updates](https://9to5mac.com/2013/06/24/apple-seeds-ios-7-beta-2-to-developers/) — 9to5Mac; journalism.
- [iOS SDK Release Notes for iOS 7 Seed 3 (preserved PDF)](https://www.ipod.info.pl/wp-content/uploads/2013/07/iOS-7-beta-3-lista-zmian.pdf) — iPod.info.pl document mirror; archive.
- [iOS 7 Beta 3 full change log](https://web.archive.org/web/20130709213122/http://bgr.com/2013/07/08/ios-7-beta-3-change-log/) — BGR via Internet Archive; archive.
- [iOS 7 Beta 4 full change log](https://web.archive.org/web/20130801011005/http://bgr.com/2013/07/29/ios-7-beta-4-full-change-log-changelog/) — BGR via Internet Archive; archive.
- [Full iOS 7 Beta 4 changelog posted](https://wccftech.com/full-ios-7-beta-4-changelog-posted/) — Wccftech; journalism.
- [iOS 7 Beta 5 full change log](https://web.archive.org/web/20130809040933/http://bgr.com/2013/08/06/ios-7-beta-5-change-log/) — BGR via Internet Archive; archive.
- [iOS 7 Beta 5 complete changelog](https://www.idevice.ro/2013/08/06/ios-7-beta-5-iata-intregul-changelog/) — iDevice.ro; journalism.
- [iOS 7 Beta 6 changelog](https://www.idevice.ro/2013/08/16/ios-7-beta-6-changelog/) — iDevice.ro; journalism.
- [Apple seeds iOS 7 Beta 6 with iTunes in the Cloud fix](https://www.idownloadblog.com/2013/08/15/apple-seeds-ios-7-beta-6/) — iDownloadBlog; journalism.
- [iOS 7 GM change log and release notes](https://web.archive.org/web/20130912223457/http://bgr.com/2013/09/10/ios-7-gm-change-log-release-notes/) — BGR via Internet Archive; archive.
- [iOS 7 Gold Master available for developers with change log](https://www.intomobile.com/2013/09/10/ios-7-gold-master-available-developers-change-log-detailed/) — IntoMobile; journalism.
- [About iOS 7 Updates](https://support.apple.com/en-us/102996) — Apple Support; firstPartyDocumentation.

## Closure guards

- Exact comparison against the local iOS 7.0 seed record and all eight
  milestones
- Exact seven-route allowlist with explicit exclusion of Public
- Approved/indexable ownership check for the existing Public route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 126 occurrences resolve to exactly
  105 stable local definitions
- Raw-state audits resolve 190 HTML citations and delegate 29 PDF citations to
  30 exact text probes across the complete rendered PDF states
- Canonical-history guard preserves 20 repeated definitions, including the
  Beta 3 → Beta 4 → Beta 5 phone-validation transition
- Explicit rejection of identity, build, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `49d86511bdc71f23c44a3b3d2e547e47e557012541b56be51bb46070b269f9b9`

## Editorial approval and validation record

The independently re-fetched and audited event overlays are approved:

- provenance: `editoriallyVerified`
- editorial status: `approved` at `2026-07-30T11:22:57Z`
- indexability: `true`

Verified on 2026-07-30:

- `npm run research:validate`: 68 batches
  validated;
  this cohort reports 7 events, 126 changes,
  17 sources, and 709 citations;
  4,052 change keys are
  globally consistent
- focused ingestion/manifest suite: 19 tests passed
- HTML-state audit: 8 exact fixed snapshots and 15 normalized live-source
  states, with 190 locator assertions and all 29 PDF-backed citations
  delegated to the PDF audit
- PDF audit: the one-page Beta 1 identity fragment and all 12 Beta 3 pages were
  rendered and reviewed; 30 distinctive probes close 26 selected Beta 3
  occurrences and the three retrospective Seed 2 claims
- canonical recurrence audit: 20 repeated definitions retain one stable
  identity across milestones, including the Beta 3 → Beta 4 → Beta 5
  phone-validation sequence
- copyright-similarity scan:
  553 reader-facing fields
  checked against the retained raw evidence; the longest contiguous overlap was
  5 words
- full repository suite: 131 tests passed
- ESLint, Prettier check, and `git diff --check`: passed
- applied production plan: 121 creates,
  8 revision-guarded patches, and 2075 unchanged
  documents
- create split: 16 sources and
  105 stable change documents
- mutation payload: 415,929 bytes
- production plan SHA: `dda56cdd3c72b73090e110308791c8bebf9afae2da6db29ae9ab77d4081f92f5`
- plan artifact SHA-256: `44600d5197a0aadb2c84e16b2db7070a2e73dd19f1a5261dd7fe734559f31b2e`
- rollback artifact SHA-256: `1894efd27bc3853c1003812ec3f79dd465d29ca105c8ab51e026ec21c6c684cc`
- seven planned patches target the exact existing Beta 1–6 and GM event
  documents; each sets only article body, changes, citations, editorial
  review, indexability, provenance, and summary
- one planned patch targets the exact reused Apple Support source and fills
  only author, publication date, and topics

## Publication receipt

- applied plan SHA: `dda56cdd3c72b73090e110308791c8bebf9afae2da6db29ae9ab77d4081f92f5`
- reviewed plan artifact SHA-256: `44600d5197a0aadb2c84e16b2db7070a2e73dd19f1a5261dd7fe734559f31b2e`
- rollback artifact SHA-256: `1894efd27bc3853c1003812ec3f79dd465d29ca105c8ab51e026ec21c6c684cc`
- Sanity transaction: `tt1fSB5HY9GAB0YLyysuOg`
- receipt SHA-256: `e3f48dc7b76ea9d101a55e6bc3f92857ed9847e8f05bbdb4065eccfc438b5abf`
- immediate post-publication zero plan:
  `3e56faf5e5f8aee40ac92d33e4ecb1a1a843fbc6ed1af987e32722ecfa6fd0bc`;
  0 creates,
  0 patches,
  2,204 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `faa85fb0b308c00fe105186553cb64c0e6fa7009b8b61e8e7d723619b7fff3f4`
- zero-plan rollback artifact SHA-256:
  `01468e86384a6d237b68950f10261b113e7d0e7fa775d0b3dc31a1c2e2111be4`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 426 full articles,
  256 source-linked records, and
  1,297
  timeline-only records
- 577 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned the complete archival article, every expected structured
change title, and References. No response returned placeholder copy or a
`noindex` directive.

| Canonical route          | HTTP | Full article | Expected changes | References | Placeholder | Noindex |
| ------------------------ | ---: | ------------ | ---------------- | ---------- | ----------- | ------- |
| `/apple/ios/7.0/beta-1/` |  200 | yes          | 33/33            | yes        | no          | no      |
| `/apple/ios/7.0/beta-2/` |  200 | yes          | 6/6              | yes        | no          | no      |
| `/apple/ios/7.0/beta-3/` |  200 | yes          | 26/26            | yes        | no          | no      |
| `/apple/ios/7.0/beta-4/` |  200 | yes          | 38/38            | yes        | no          | no      |
| `/apple/ios/7.0/beta-5/` |  200 | yes          | 12/12            | yes        | no          | no      |
| `/apple/ios/7.0/beta-6/` |  200 | yes          | 1/1              | yes        | no          | no      |
| `/apple/ios/7.0/gm/`     |  200 | yes          | 10/10            | yes        | no          | no      |

Final verification on 2026-07-30:

- full repository suite: 131 tests passed
- focused ingestion and manifest suite:
  19 tests passed
- deterministic regeneration preserved JSON SHA-256 `49d86511bdc71f23c44a3b3d2e547e47e557012541b56be51bb46070b269f9b9`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,204 unchanged
  documents, the 16-byte payload, and
  plan SHA `3e56faf5e5f8aee40ac92d33e4ecb1a1a843fbc6ed1af987e32722ecfa6fd0bc`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-7-prerelease.mjs
node scripts/research-batches/audit-ios7-prerelease-html-states.mjs scripts/research-batches/apple-ios-7-prerelease.json EVIDENCE_DIRECTORY
swift -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX15.4.sdk -module-cache-path tmp/pdfs/swift-module-cache scripts/research-batches/audit-ios7-prerelease-pdf-state.swift EVIDENCE_DIRECTORY/beta1-partial.pdf EVIDENCE_DIRECTORY/beta3.pdf
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-7-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-7-prerelease.mjs scripts/research-batches/apple-ios-7-prerelease.json scripts/research-batches/apple-ios-7-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-7-prerelease.json
```

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
