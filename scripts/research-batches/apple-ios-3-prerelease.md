# Apple iPhone OS 3.0 prerelease archive batch

## Result

`apple-ios-3-prerelease.json` is the approved archive batch for six historically defensible
iPhone OS 3.0 prerelease routes that were absent from the local seed.

- 6 identity-backed event pages and no release-version overlays
- 76 milestone-specific occurrences across
  71 stable, collision-checked definitions
- 22 declared and used sources with 370 citation references
- zero builds, build-number claims, or Public-route changes
- every route is `editoriallyVerified`, `approved`, and explicitly
  `isIndexable: true`

## Approved route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| -------- | --------- | --------- | --------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`  | 2009-03-17      |               18 |
| iOS      | Beta 2    | `beta-2`  | 2009-03-31      |                7 |
| iOS      | Beta 3    | `beta-3`  | 2009-04-14      |               18 |
| iOS      | Beta 4    | `beta-4`  | 2009-04-28      |               15 |
| iOS      | Beta 5    | `beta-5`  | 2009-05-06      |               12 |
| iOS      | GM        | `gm`      | 2009-06-08      |                6 |

The local seed contains only Public on 2009-06-17. Public is already owned by
`apple-ios-3.json` and remains untouched.

## Evidence method

1. Apple's March 17 announcement establishes Beta 1 and provides a first-party
   feature and developer-API baseline. The 18 selected records are a
   first-document baseline, not a blanket claim that every capability first
   appeared in that day's binary.
2. Three contemporaneous reports establish Beta 2 and retain six narrow
   service, interface, performance, and availability records. Observations are
   labeled separately from documented developer-service facts.
3. Four contemporaneous artifacts establish Beta 3. A World of Apple archive
   retains an Apple-authored SDK summary with exactly 10 Xcode, five Interface
   Builder, and one Dashcode entry. The selected baseline excludes two
   compilers whose notes explicitly require the Mac OS X SDK and a macOS-only
   Carbon-controls item. Four observed behaviors remain explicitly
   undocumented.
4. Apple's two-page Beta 4 installation advisory survives through a third-party
   PDF mirror. Nine operational records are confirmed from that document, and
   six tool or interface observations are kept with weaker labels.
5. Beta 5 combines a preserved Apple developer-compatibility message with
   contemporaneous reporting. The StoreKit entry is intentionally high level:
   the report says the API changed, but its member-level delta did not survive.
6. Four contemporaneous reports establish GM and retain six specific final-seed
   states. The later Public notes are not copied into this milestone.

## Raw evidence ledger

| Milestone | Public artifact              | Raw bytes | Raw SHA-256                                                        |
| --------- | ---------------------------- | --------: | ------------------------------------------------------------------ |
| Beta 1    | Apple Newsroom HTML          |   128,423 | `223b0e2b4ec426ce7f1180bd8e67f5518fc00502aff1f7372b431eff275beb8a` |
| Beta 2    | AppleInsider HTML            |   132,421 | `06ffccb346b84ac1777712d899032be7ff8d4031354311c374a959e596d1d005` |
| Beta 2    | iLounge archived HTML        |    44,115 | `b4a6dd355f54fe96b4d349e14ac4bcd74375fcc0f46bf82adb6383f2e01f7824` |
| Beta 2    | World of Apple archived HTML |    23,498 | `64d69a932a8473384cc402d0d70eaa584d23d73f95bbf9316d444e3380183721` |
| Beta 3    | AppleInsider HTML            |   130,728 | `9b81f8a1b71bb70704bdcc85b0286ab5e8d4ae0284c87d2a50973528a7472b96` |
| Beta 3    | Ars Technica HTML            |   138,757 | `d05cdd01b6a4305c186ec9d5f3c5038d47bdf79c5c05f35f2444d8c0cab7f2bf` |
| Beta 3    | MacRumors HTML               |   112,892 | `5129656eee21ae6033df367ac58560b5c217831ff8f51341e5736f29af778807` |
| Beta 3    | World of Apple archived HTML |    32,219 | `0d5dd0cfa0a60a3f091aa20cfbf75a9ada9a96d0072002f77249682e3bf6b537` |
| Beta 4    | Apple advisory PDF           |    49,405 | `1900ed272a1888ee6faf6a48a1ce507d5b108584814df17582f55a4988d6026f` |
| Beta 4    | Ars Technica HTML            |   140,285 | `9771cd26140a03b340a1b6dab55bceef725f0dfff0bfd6ca98793f81d82577bd` |
| Beta 4    | iClarified HTML              |   179,832 | `caa0c0eddc7dcb6ad7e443100789a619ce4233578e0e49d12387b2ec6da1de0a` |
| Beta 4    | MacRumors HTML               |   114,598 | `35725ef5a340776222e857eb46648bb06c0630c12dc91b248b26679521d5c978` |
| Beta 5    | MacRumors compatibility HTML |   111,510 | `3a8ea71ec6d8bb40bfc6b62f013b959e6eeebea36914f1625be8f761395e9c95` |
| Beta 5    | Gizmodo HTML                 |   211,768 | `4fbd760e7d9e8bf9832f5e81871eb934778d5a6afdbe2e16b569f382654a65b0` |
| Beta 5    | Google Groups archive HTML   | 1,018,438 | `b62cb932eb019fa9b7c862a9a3b6111442b607788ab0b9d83a27302a4bdae31a` |
| Beta 5    | MacRumors HTML               |   112,495 | `add117b9fbee8425846d3c2c9796cdab95272f27d38ca8cd7c43ea8015c51b80` |
| Beta 5    | SlashGear HTML               |    51,061 | `0a6c21153e7eb9204cb188a87add6010960305fe9706b4c2aeb948cc3ed4fd31` |
| Beta 5    | Engadget HTML                |    57,779 | `d6871d0bb3d78252d9e1a7f3aa5fef50a8ed93e7ac7c15218f90b581f6f57d6d` |
| GM        | AppleInsider HTML            |   139,020 | `7b508d0b66cf0d559f60063c8c205b4e5f619c44d437700ea8ef626a4c5e1eb5` |
| GM        | Engadget HTML                |    59,332 | `297c00016afe87ba4ecddb111f775d2a211683ce226f41c9d7427d162615ffec` |
| GM        | iClarified HTML              |   178,778 | `926a00c814b36fe4bf84f55ce3ba2120d3434cb7df4b32157ecf3bf929e8ce59` |
| GM        | Macworld HTML                |   201,449 | `40808dc8efff90c6bc44f2c75a0d69f5e4b3a0ffd651ffd8abcf468edcd26672` |

The 22 selected raw artifacts total
3,368,803 bytes. The committed
audit helper also locks 23 bounded text
artifacts, including both PDF pages, and verifies short metadata and subject
probes. Raw publisher files remain only in the ignored temporary evidence
directory.

An independent live re-fetch reached all
22 declared sources. It reproduced
8 raw artifacts byte-for-byte and all
21 selected HTML evidence boundaries;
the PDF reproduced byte-for-byte, so all
22 source boundaries were
independently reproduced.

## Exact evidence gaps and exclusions

- No defensible build-number documents are created. Build strings present in
  publisher reporting are not promoted to archive identities.
- No complete first-party developer release-note set was found for Beta 2,
  Beta 3, Beta 5, or GM. Documentation state reflects that limit.
- Beta 3's 13 selected toolchain entries are a retained seed-note baseline;
  this batch does not infer that every item first appeared in Beta 3. The two
  Mac OS X SDK-only compilers and the Carbon-controls item remain outside the
  iPhone OS archive.
- Beta 4's advisory is Apple-authored but hosted by a third-party mirror. Its
  raw and extracted-page hashes are locked in the evidence audit.
- Beta 5's StoreKit report does not retain the detailed API delta. The record
  says only that a revision occurred and leaves member-level specifics as an
  explicit gap.
- Public remains owned by the existing iOS 3 public batch.

## Copyright and attribution controls

- All reader-facing article, title, summary, and canonical-summary text is
  original synthesis.
- Every factual record carries source citations and a short locator.
- Apple-authored material on third-party hosts is credited as such; the host is
  named in the source ledger.
- No article, transcript, PDF, screenshot, source HTML, or long excerpt is
  committed.
- Publisher commentary and unsupported inference are excluded.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Apple Previews Developer Beta of iPhone OS 3.0](https://www.apple.com/newsroom/2009/03/17Apple-Previews-Developer-Beta-of-iPhone-OS-3-0/) - Apple Newsroom; firstPartyAnnouncement.
- [Apple releases second beta of iPhone 3.0 Software to developers](https://appleinsider.com/articles/09/03/31/apple_releases_second_beta_of_iphone_3_0_software_to_developers) - AppleInsider; journalism.
- [Apple releases iPhone OS 3.0 Beta 2 with push notifications](https://web.archive.org/web/20090402150947id_/http://www.ilounge.com:80/index.php/news/comments/apple-releases-iphone-os-30-beta-2-with-push-calendar-updates/) - iLounge; archive.
- [iPhone OS 3.0 Beta 2 Released](https://web.archive.org/web/20090403075532id_/http://news.worldofapple.com:80/archives/2009/03/31/iphone-os-30-beta-2-released/) - World of Apple; archive.
- [iPhone Software 3.0 beta 3 delivers gradual improvements](https://appleinsider.com/articles/09/04/15/iphone_software_3_0_beta_3_delivers_gradual_improvements) - AppleInsider; journalism.
- [Apple posts third iPhone OS 3.0 beta with minor API changes](https://arstechnica.com/gadgets/2009/04/apple-posts-third-iphone-os-30-beta-with-minor-api-changes/) - Ars Technica; journalism.
- [Apple Seeds iPhone OS 3.0 Beta 3 and New SDK to Developers](https://www.macrumors.com/2009/04/14/apple-seeds-iphone-os-3-0-beta-3-and-new-sdk-to-developers/) - MacRumors; journalism.
- [iPhone Developers Receive Third Beta of iPhone OS 3.0](https://web.archive.org/web/20090417052932id_/http://news.worldofapple.com:80/archives/2009/04/14/iphone-developers-receive-third-beta-of-iphone-os-30/) - World of Apple; archive.
- [iPhone OS 3.0 beta 4 software release - Pre-Installation Advisory](https://s3.cloud.cmctelecom.vn/tinhte1/2009/04/2755045_iphone_os_3.0_beta_4_preinstallation_advisory.pdf) - Apple Developer (third-party PDF mirror); archive.
- [Details about iPhone OS 3.0 beta 4 and prerelease iTunes 8.2](https://arstechnica.com/gadgets/2009/04/details-about-iphone-os-30-beta-4-and-prerelease-itunes-82/) - Ars Technica; journalism.
- [iPhone OS 3.0 Beta 4 Supports Multiple iTunes Accounts](https://www.iclarified.com/3724/iphone-os-30-beta-4-supports-multiple-itunes-accounts) - iClarified; journalism.
- [iPhone OS 3.0 Beta 4 and iTunes 8.2 Pre-Release to Developers [Blu-Ray Evidence?]](https://www.macrumors.com/2009/04/28/apple-seeds-iphone-os-3-0-beta-4-and-itunes-8-2-pre-release-to-developers/) - MacRumors; journalism.
- [App Store Submissions Now Being Reviewed for iPhone OS 3.0 Compatibility](https://www.macrumors.com/2009/05/07/app-store-submissions-now-being-reviewed-for-iphone-os-3-0-compatibility/) - MacRumors; journalism.
- [iPhone OS 3.0 beta 5 now available](https://www.engadget.com/2009-05-06-iphone-os-3-0-beta-5-now-available.html) - Engadget; journalism.
- [iPhone OS 3.0 Beta 5 Is Out Now](https://gizmodo.com/iphone-os-3-0-beta-5-is-out-now-5243450) - Gizmodo; journalism.
- [Apple developer compatibility message preserved in 3.0 Features thread](https://groups.google.com/g/phonegap/c/obseCVn6_po) - PhoneGap Google Group; archive.
- [Apple Releases iPhone OS 3.0 Beta 5 and New iTunes 8.2 Pre-Release to Developers](https://www.macrumors.com/2009/05/06/apple-releases-iphone-os-3-0-beta-5-and-new-itunes-8-2-pre-release-to-developers/) - MacRumors; journalism.
- [Apple iPhone OS 3.0 Beta 5 Released: MMS Hole Closed](https://www.slashgear.com/apple-iphone-os-30-beta-5-released-mms-hole-closed-0743063/) - SlashGear; journalism.
- [Apple unveils new iPhone 3.0 features, sets release for June 17th](https://appleinsider.com/articles/09/06/08/apple_unveils_new_iphone_3_0_features_sets_release_for_june_17th) - AppleInsider; journalism.
- [iPhone OS 3.0 gold release in pictures](https://www.engadget.com/2009-06-08-iphone-os-3-0-gold-release-in-pictures.html) - Engadget; journalism.
- [Apple Seeds iPhone 3.0 Gold Master to Developers With WARNING](https://www.iclarified.com/4151/apple-seeds-iphone-30-gold-master-to-developers-with-warning) - iClarified; journalism.
- [iPhone OS 3.0 coming on June 17](https://www.macworld.com/article/198495/iphone30release.html) - Macworld; journalism.

## Closure guards

- Exact comparison against the local iOS 3.0 seed record and its sole Public
  milestone
- Exact six-route identity, date, channel, and change-count allowlist
- Zero versions, zero builds, exact approval timestamps, and explicit true
  indexability
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 76 occurrences resolve to exactly
  71 stable local definitions
- 5 repeated cross-milestone histories and the exact
  cumulative-context inventory are locked
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `c8104a629156ffd1dc1633505a79d70eb3b58beec7784ffd3f996a21057dc6db`

## Editorial approval and validation record

- provenance: `editoriallyVerified`
- editorial status: `approved`
- indexability: `true`
- reviewed at: `2026-07-30T12:50:04Z`
- independent substantive review: clean after platform-scope,
  cumulative-context, claim-boundary, and stable-history corrections

Verified on 2026-07-30:

- evidence audit: 22 exact raw artifacts totaling
  3,368,803 bytes and
  23 normalized text locks
- independent live re-fetch: all
  22 sources available and all
  22 selected evidence boundaries
  reproduced
- `npm run research:validate`:
  73 batches and
  4,258 globally consistent
  change keys
- focused ingestion/manifest suite:
  19 of 19 passed
- full repository suite:
  131 of 131 passed
- independent copyright-similarity scan: maximum contiguous reader-facing
  overlap of 5 words
- ESLint, Prettier check, deterministic regeneration, and
  `git diff --check`: passed

## Production dry plan

- Status: Applied and zero-residual verified on 2026-07-30
- 98 creates:
  21 sources,
  6 events, and
  71 stable change documents
- 0 patches; no existing release, event, build, source, or
  change document was mutated
- 2,100 production documents remained
  unchanged
- The existing Apple Newsroom Beta 1 source was reused unchanged
- Mutation payload:
  258,206 bytes
- Plan SHA: `37b31e20fd1004113b7f31c19f18b5777d7718fd801a3f546bb63f66acfeb457`
- Plan artifact SHA-256: `bf9214ddda9a7f449e43a4263b4abe834b9fd46fa433fc1c93aba8d52c78167a`
- Rollback artifact SHA-256: `52da9046e911963eaeca113c34c61afaf2963b910e135abbb542c15ec85a4806`

Three consecutive production dry runs reproduced the same plan SHA, counts,
payload size, plan artifact, and rollback artifact.

## Publication receipt

- Sanity transaction: `F0eE6eK5XyVXtlnaoyYMQb`
- applied plan SHA: `37b31e20fd1004113b7f31c19f18b5777d7718fd801a3f546bb63f66acfeb457`
- receipt SHA-256: `9343e4bf7a64746adf7632f0bca9ac70f24a2b162caaa95bea8e9fc5cf5f4ca0`
- immediate post-publication zero plan:
  `6fe54f9fbd270e7e3793481cebf322e85f3e60249df10438b44ab27a75fc0701`;
  0 creates,
  0 patches,
  2,198 unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `df7acaeaa1b243bc46ce6551cab373ca5ce0d70314531550c00fdca9ade2c0a7`
- zero-plan rollback artifact SHA-256:
  `9a9c7242d882a6b3677963538174264f6499d8a1aa8a1aa5095d7dc1a95760f0`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 2,002
  appearances:
  449 full articles,
  256 source-linked records,
  and
  1,297
  timeline-only records
- 600 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all four archival article sections, every expected structured
change title, References, its first cited source, and an `index, follow`
directive. No route returned placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots        |
| ------------------------ | ---: | ---------------: | ---------------: | ---------- | ------------ | ----------- | ------------- |
| `/apple/ios/3.0/beta-1/` |  200 |              4/4 |            18/18 | yes        | yes          | no          | index, follow |
| `/apple/ios/3.0/beta-2/` |  200 |              4/4 |              7/7 | yes        | yes          | no          | index, follow |
| `/apple/ios/3.0/beta-3/` |  200 |              4/4 |            18/18 | yes        | yes          | no          | index, follow |
| `/apple/ios/3.0/beta-4/` |  200 |              4/4 |            15/15 | yes        | yes          | no          | index, follow |
| `/apple/ios/3.0/beta-5/` |  200 |              4/4 |            12/12 | yes        | yes          | no          | index, follow |
| `/apple/ios/3.0/gm/`     |  200 |              4/4 |              6/6 | yes        | yes          | no          | index, follow |

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce the approved batch with:

```sh
node scripts/research-batches/build-apple-ios-3-prerelease.mjs
node scripts/research-batches/audit-ios3-prerelease.mjs tmp/ios3-evidence
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-3-prerelease.mjs scripts/research-batches/audit-ios3-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-3-prerelease.mjs scripts/research-batches/audit-ios3-prerelease.mjs scripts/research-batches/apple-ios-3-prerelease.json scripts/research-batches/apple-ios-3-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-3-prerelease.json
```
