# Apple iOS 6 point-release prerelease archive batch

## Result

`apple-ios-6-point-prerelease.json` is the approved archive batch for the iOS 6 point-release
developer cycles after 6.0. It is isolated from the completed iOS 6.0
prerelease batch and does not alter the hardcoded seed timeline or any existing
Public page.

- 7 exact identity-backed event creates and no release-version
  overlays
- 31 selected change occurrences across 25
  canonical definitions
- 5 definitions reused byte-for-byte from the approved
  Public owner; 20 new definitions
  use the `ios6-point-prerelease-` namespace
- 25 declared and used sources with 189 citation
  references
- zero builds, guessed build scope, release-version overlays, or seed edits
- every event is `editoriallyVerified`, `approved`, and explicitly
  `isIndexable: true`

## New historical route closure

| Milestone        | New route                  | Appearance date | Selected changes | Fixed | Current known |
| ---------------- | -------------------------- | --------------- | ---------------: | ----: | ------------: |
| iOS 6.1 Beta 1   | `version-ios-6-1/beta-1`   | 2012-11-01      |                5 |     0 |             1 |
| iOS 6.1 Beta 2   | `version-ios-6-1/beta-2`   | 2012-11-12      |                7 |     2 |             3 |
| iOS 6.1 Beta 3   | `version-ios-6-1/beta-3`   | 2012-12-03      |                9 |     3 |             1 |
| iOS 6.1 Beta 4   | `version-ios-6-1/beta-4`   | 2012-12-17      |                4 |     2 |             1 |
| iOS 6.1 Beta 5   | `version-ios-6-1/beta-5`   | 2013-01-26      |                1 |     0 |             0 |
| iOS 6.1.1 Beta 1 | `version-ios-6-1-1/beta-1` | 2013-02-06      |                2 |     0 |             1 |
| iOS 6.1.3 Beta 2 | `version-ios-6-1-3/beta-2` | 2013-02-21      |                3 |     1 |             0 |

Only exact source-defensible developer identities are represented. The
generator rejects Public, GM, and the existing 6.0 major-cycle routes.

## Lineage and evidence method

1. The 6.1 cycle is represented by five explicitly numbered betas. Beta 1
   introduces the selected developer interfaces and early observed features;
   Betas 2 through 4 distinguish source-defensible deltas from cumulative state
   found in preserved developer-note copies.
2. The detailed Beta 3 notes survive in two independent archive pages. The
   iPhone-Ticker copy is a user comment by Robo.Term, not publisher-authored
   release notes. Beta 4's only detailed retained copy is likewise a user
   comment by MichiBoa, so all four detailed Beta 4 records stay
   `reported`.
3. Beta 5 remains Beta 5. Reporting moved directly from that named seed to the
   Public release, and no separately distributed GM identity was recovered.
4. The February 6 seed retains its historical `6.1.1 Beta 1` identity.
   Apple's later statement said that beta would be renamed because the Public
   6.1.1 emergency update was unrelated. Reports explicitly connect it to
   `6.1.3 Beta 2`.
5. Maps for Japan is a delta on 6.1.1 Beta 1 and a cumulative occurrence on
   6.1.3 Beta 2. The passcode repair is a Beta 2 delta. The evasi0n record says
   only that the tested jailbreak path changed when at least its time-zone flaw
   was patched; it does not claim every exploit was repaired.

## Build evidence without build documents

| Milestone    | Retained evidence                                                                       | Decision                                         |
| ------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 6.1 Beta 1   | `10B5095f`                                                                              | No device-specific first-party artifact retained |
| 6.1 Beta 2   | Narrative `10B5105c`; embedded post `10B105c`                                           | Conflict retained; no build                      |
| 6.1 Beta 3   | `10B5117b`, identified retrospectively by Beta 4 coverage                               | No retained device download                      |
| 6.1 Beta 4   | `10B5126b`                                                                              | No retained device download                      |
| 6.1 Beta 5   | Public-equivalent builds vary by device in later archives                               | No single build or inferred GM                   |
| 6.1.1 Beta 1 | `10B311`                                                                                | No retained device download                      |
| 6.1.3 Beta 2 | Later archives report `10B318`; identity pages do not preserve a complete device matrix | No build                                         |

The content model can represent builds, but this candidate does not turn
article text into globally scoped build documents.

## Exact evidence gaps

- No developer-distributed 6.0.1 beta identity was recovered. Contemporaneous
  evidence describes carrier testing before Public.
- No exact 6.0.2, 6.1.2, or 6.1.4 developer beta identity was recovered.
- No 6.1 GM route is created. Beta 5 is retained under the label used by the
  release report.
- No 6.1.3 Beta 3 or other later prerelease identity was recovered.
- The Beta 2 build typo is preserved as a conflict, not silently corrected.
- Beta 4's Simulator line carries a fixed marker while repeating the earlier
  restriction. Its occurrence is partially documented and explains the
  ambiguity.
- The selections contain milestone deltas plus six explicit cumulative
  occurrences, not copied or exhaustive changelogs.

## Raw-source audit ledger

The HTML bodies were downloaded on 2026-07-30 to a temporary, uncommitted
audit directory. Hashes cover the exact response bytes.

| Raw artifact                |   Bytes | SHA-256                                                            | Use                                             |
| --------------------------- | ------: | ------------------------------------------------------------------ | ----------------------------------------------- |
| macrumors-601-carrier.html  | 126,640 | `f2c8dc092b878d032bafdad8511f5421c9eb087e569af7d622fee4707b7fd537` | 6.0.1 carrier-only boundary                     |
| macrumors-61-beta1.html     | 123,665 | `70eaee005f9c9366296e816e1bd428bde42478818009ae34db7f1ac8004b7f97` | 6.1 Beta 1 identity and build                   |
| idownloadblog-61-beta1.html | 211,106 | `0073de900255008021d05f8ad59e2f678d52e38144a675291470a5c8365a2e47` | Beta 1 developer changes                        |
| 9to5-61-fandango.html       | 144,834 | `b5a30f1db481946a7d41f36e2bf806399256a4afbf0398ba756ecc31e8e0ba1d` | Beta 1 Siri observation                         |
| macrumors-61-fandango.html  | 123,540 | `2b7241aa389bc7da0c84b5d741579985f5b2205ec238e4a028624bfe091aee9e` | Siri report mirror                              |
| macrumors-61-beta2.html     | 124,762 | `6eae07c543692c9c826127773fb86e1fa0159352f937a9a6a3f6a83cd7a105e0` | Beta 2 identity and build                       |
| idownloadblog-61-beta2.html | 218,432 | `5cc5fa82c6b024ceebc6fa849d604f4f375d1f74a30394343646aba2b442e746` | Beta 2 observations, transcript, and build typo |
| 9to5-61-beta2.html          | 142,307 | `c0ff7bb305b3b38fa10943217fa07d71bccacdd8087056d387f69dfd95a499a5` | Beta 2 observed changes                         |
| 9to5-61-beta3.html          | 142,447 | `cd285e88b3e8b5d474d5aef61a4b38bb0825b66d8c67a1f50e912a394709383c` | Beta 3 identity                                 |
| iphone-ticker-61-beta3.html | 276,317 | `856b876602523b7011daeea60ff559fdc72d07adfa861b6184fe000a2932198c` | Beta 3 community transcript                     |
| iphonote-61-beta3.html      | 204,141 | `b87a0ad035110a96493ced2bd00734b9f0a0455f007932439b84c2247ba129ff` | Beta 3 article transcript                       |
| cultofmac-61-beta3.html     | 289,271 | `636a8a2a9da14feedebb3a03765e931af1e7865ef0886bbed1a9ba41625bd5b6` | Beta 3 observed changes                         |
| macrumors-61-beta4.html     | 122,747 | `6aefdd254d479b6cb61d7fb9015ea0f7242da7a7dcafc8e592fb04e0503c0378` | Beta 4 identity and builds 3/4                  |
| iphone-ticker-61-beta4.html | 271,684 | `d7255f9e31b916554660d9112e96a203efe31f8d4599a83ef74b2821ec608b3b` | Beta 4 community transcript                     |
| macrumors-61-beta5.html     | 123,786 | `54bf3f80231995eb8dc0df7495247b3cb06ad9394b67cb3c457ae0c2c6c6cd86` | Beta 5 identity                                 |
| macrumors-61-128gb.html     | 123,766 | `954ef1eaac4eb17a208da0bf9e209bd8b083362c1563645756aaeac977d22bd1` | Beta 5 manifest observation                     |
| macrumors-61-public.html    | 124,375 | `82cb2e140e8284812b7ac23abc4dd0859ec2571fad24ea6e114d8baf9cab3d26` | direct Beta 5-to-Public boundary                |
| macrumors-611-beta1.html    | 124,379 | `7d0dd933d71c4b8d7428a4ea1ee6db29a0d1fd81988ce98d1d0d044f12a4b8fa` | 6.1.1 Beta 1 identity and build                 |
| 9to5-611-beta1.html         | 145,117 | `79d38bf44f7374e9d7417df6ecde0d38ee73e323b1bd75bb4d427356b244b3e4` | Maps notes and no-expiry report                 |
| 9to5-611-public-rename.html | 144,436 | `633a50ee585d0d8aa864d3046d6c84012806c5ab23683b0d024ff5d02536397a` | Public 6.1.1 and beta-rename boundary           |
| 9to5-611-evasi0n.html       | 144,466 | `397440fef1a8326158bad62b9471ab3b4d1eb767a6fc09f61725a7433bf80160` | Beta 1 evasi0n observation                      |
| 9to5-613-beta2.html         | 144,205 | `98d5c5342dcbf0c0ed5c071c514187159ab31b13a1c8fe62bd5e2be514b7ba9f` | 6.1.3 Beta 2 identity, rename, and changes      |
| macrumors-613-beta2.html    | 126,540 | `57a1a324fda9de4de653114ea9bf49adfa12e16427d1121f28ab295da3e10767` | Beta 2 corroboration                            |
| 9to5-613-evasi0n.html       | 146,394 | `3691b20f74873d63ba9616b20921b358cc10cdaf7b0f1a5eda30f103c6e575ad` | time-zone exploit report                        |
| macrumors-613-evasi0n.html  | 126,309 | `2b535d8578eba5eaf71de02649db7351d15ac6d2ba9bd1aa85431be7d63808b2` | time-zone exploit corroboration                 |

The retained source set contains 25 files and
3,995,666 bytes. Two additional exploratory
downloads remain in the temporary directory but are explicitly excluded:

| Excluded raw artifact   |     Bytes | SHA-256                                                            | Reason                                                                                               |
| ----------------------- | --------: | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| apple-support-ios6.html | 1,169,945 | `7f8423a8084cd970d7eb20e96a1b370c7b95e546399575e05013b9677a366fba` | exploratory Apple Public-release cumulative notes; not evidence for a selected prerelease occurrence |
| mactrast-61-beta4.html  |   148,993 | `ca276ea87f58be8b2eafe6fc8546873f389707efbee67df6397478e8058e1ee2` | exploratory duplicate Beta 4 identity coverage; excluded from the declared source set                |

The audit closes the directory over all 27
files (5,314,604 total
bytes), verifies every byte count and hash, page marker and publication
timestamp, the exact community-comment containers for both transcript sources,
every citation locator, route and recurrence history, source use, and
reader-facing copyright overlap.

## Copyright and editorial method

Every event summary, article paragraph, occurrence title, canonical summary,
occurrence summary, and verification method is scanned against each retained
source independently. The candidate uses original synthesis and keeps exact
source language only inside citation locators.

Third-party release-note reproductions are credited as archive or journalism
sources, never as Apple-hosted documents. The pages select claims and link to
their provenance; they do not republish the source lists.

## Source ledger

All sources were accessed on 2026-07-30.

- [Apple Testing iOS 6.0.1 with Fixes for Keyboard Screen Glitch, Camera Flash Issues, and More](https://www.macrumors.com/2012/10/22/apple-testing-ios-6-0-1-with-fixes-for-keyboard-screen-glitch-camera-flash-issues-and-more/) — MacRumors; journalism.
- [Apple Seeds First iOS 6.1 Beta to Developers](https://www.macrumors.com/2012/11/01/apple-seeds-first-ios-6-1-beta-to-developers/) — MacRumors; journalism.
- [Apple seeds iOS 6.1 Beta to developers with Maps Kit improvements](https://www.idownloadblog.com/2012/11/01/ios-6-1-beta/) — iDownloadBlog; journalism.
- [Apple to bring movie ticket purchasing to Siri with upcoming iOS 6.1 update](https://9to5mac.com/2012/11/04/apple-to-bring-movie-ticket-purchasing-to-siri-with-upcoming-ios-6-1-update/) — 9to5Mac; journalism.
- [iOS 6.1 to Add Siri-Based Movie Ticket Purchases via Fandango](https://www.macrumors.com/2012/11/05/ios-6-1-to-add-siri-based-movie-ticket-purchases-via-fandango/) — MacRumors; journalism.
- [Apple Seeds Second iOS 6.1 Beta to Developers](https://www.macrumors.com/2012/11/12/apple-seeds-second-ios-6-1-beta-to-developers/) — MacRumors; journalism.
- [Apple posts iOS 6.1 Beta 2, new Apple TV beta](https://www.idownloadblog.com/2012/11/12/ios-6-1-beta-2-is-out/) — iDownloadBlog; journalism.
- [Apple releases iOS 6.1 beta 2 for iPhone, iPod, iPad, updated Apple TV software to developers](https://9to5mac.com/2012/11/12/apple-releases-ios-6-1-beta-2-to-developers/) — 9to5Mac; journalism.
- [Apple seeds iOS 6.1 beta 3 to developers](https://9to5mac.com/2012/12/03/apple-seeds-ios-6-1-beta-3-to-developers/) — 9to5Mac; journalism.
- [iOS 6.1: Apple veröffentlicht dritte Vorabversion (developer-note transcript in community comment)](https://www.iphone-ticker.de/ios-6-1-apple-veroffentlicht-dritte-vorabversion-41043/) — iPhone-Ticker; archive.
- [iOS 6.1 bêta 3 : Toutes les améliorations et corrections de bugs listées](https://www.iphonote.com/actu/36369/ios-6-1-beta-3-toutes-les-ameliorations-et-corrections-de-bugs-listees) — iPhonote; archive.
- [Here's What's New In Apple's Latest iOS 6.1 Beta](https://www.cultofmac.com/news/heres-whats-new-in-apples-latest-ios-6-1-beta) — Cult of Mac; journalism.
- [Apple Seeds Fourth iOS 6.1 Beta to Developers](https://www.macrumors.com/2012/12/17/apple-seeds-fourth-ios-6-1-beta-to-developers/) — MacRumors; journalism.
- [iOS 6.1 Apple veröffentlicht vierte Vorabversion (developer-note transcript in community comment)](https://www.iphone-ticker.de/ios-6-1-apple-veroffentlicht-vierte-vorabversion-41721/) — iPhone-Ticker; archive.
- [Apple Seeds iOS 6.1 Beta 5 to Developers](https://www.macrumors.com/2013/01/26/apple-seeds-ios-6-1-beta-5-to-developers/) — MacRumors; journalism.
- [iOS 6.1 Beta 5 Code Hints at Upcoming 128 GB Devices](https://www.macrumors.com/2013/01/27/ios-6-1-beta-5-code-hints-at-upcoming-128-gb-devices/) — MacRumors; journalism.
- [Apple Releases iOS 6.1 with New LTE Carriers and Fandango Siri Integration](https://www.macrumors.com/2013/01/28/apple-releases-ios-6-1-with-new-lte-carriers-and-fandango-siri-integration/) — MacRumors; journalism.
- [Apple Seeds First Beta of iOS 6.1.1 to Developers](https://www.macrumors.com/2013/02/06/apple-seeds-first-beta-of-ios-6-1-1-to-developers/) — MacRumors; journalism.
- [Apple releases iOS 6.1.1 beta to developers with major enhancements to Maps for Japan](https://9to5mac.com/2013/02/06/apple-releases-ios-6-1-1-beta-to-developers-for-iphone-ipad-and-ipod-touch/) — 9to5Mac; journalism.
- [iOS 6.1.1 for iPhone 4S released to address cellular performance and reliability bugs](https://9to5mac.com/2013/02/11/apple-releases-ios-6-1-1-for-iphone-4s-to-address-bugs/) — 9to5Mac; journalism.
- [First iOS 6.1.1 beta does not break recently released evasi0n jailbreak](https://9to5mac.com/2013/02/07/first-ios-6-1-1-beta-does-not-break-recently-released-evasi0n-jailbreak/) — 9to5Mac; journalism.
- [Apple releases iOS 6.1.3 beta 2 to developers with Lock Screen security flaw fix](https://9to5mac.com/2013/02/21/apple-releases-ios-6-1-3-beta-2-to-developers-for-ipad-iphone-and-ipod-touch/) — 9to5Mac; journalism.
- [Apple Seeds iOS 6.1.3 Beta 2 to Developers with Fix for Passcode Lock Bug](https://www.macrumors.com/2013/02/21/apple-seeds-ios-6-1-3-beta-2-to-developers/) — MacRumors; journalism.
- [Apple patches exploits in iOS 6.1.3 beta 2 that break evasi0n jailbreak](https://9to5mac.com/2013/02/25/apple-patches-exploits-in-ios-6-1-3-beta-2-that-break-evasi0n-jailbreak/) — 9to5Mac; journalism.
- [iOS 6.1.3 Beta 2 Fixes Exploits Used for Evasi0n Jailbreak](https://www.macrumors.com/2013/02/25/ios-6-1-3-beta-2-fixes-exploits-used-for-evasi0n-jailbreak/) — MacRumors; journalism.

## Closure guards

- exact comparison against all eight local iOS 6 seed records
- immutable SHA for the approved Public owner: `90a268731788d73204b9e77d5176fd5aa55c8fe0f506b2597b16a3bc1ed385b7`
- immutable SHAs for all four structurally isolated iOS 6.0 prerelease sibling
  artifacts, including candidate JSON `28bcb3df23cb2642088f763490b213da38d34bd51ec933df7d235eb157047421`
- exact seven-event route, identity, date, channel, sequence, and count
  allowlist
- explicit rejection of Public, GM, and iOS 6.0 major-cycle events
- approved/indexable ownership checks for every existing local Public page
- zero release-version overlays and zero builds
- route and stable-ID collision scan across every other research-batch JSON
  plus `apple-launch-content-2026.json`
- strict owner and byte-equality guards for 5 reused
  definitions; every new key is collision-free and cohort-prefixed
- complete unique source declaration/use closure
- complete retained/evidence-directory closure with two named exclusions
- deterministic formatted JSON SHA-256: `b297ac8c7e1a5c12dd6e7ff422db6514df9bcb5ec32470bdda936c83d7a9213f`

## Editorial approval and validation record

- provenance: `editoriallyVerified`
- editorial status: `approved`
- indexing: enabled
- reviewed at: `2026-07-30T13:38:37Z`
- independent substantive review: clean after cumulative-state, source-custody,
  route-lineage, action-scope, evidence-label, and copyright corrections

- repository validation: 73 batches;
  4214 globally consistent change keys
- focused ingestion/manifest tests: 19
- full repository suite: 131
- HTML locator assertions: 189
- minimum exact-locator/editorial semantic-token overlap:
  2
- copyright scan: 162 reader-facing fields;
  maximum overlap 5 words
- independent live re-fetch: all
  25 declared sources available;
  13 raw artifacts matched byte-for-byte,
  24 normalized article boundaries
  matched exactly, all 25 titles and
  all 25 citation-boundary sets
  reproduced, and all 25 evidence
  boundaries passed

## Production dry plan

- status: applied and zero-residual verified on 2026-07-30
- production dry plan: 52 creates, 5 patches,
  and 2143 unchanged
- create split: 7 events, 25 sources,
  and 20 change documents
- patch boundary: five existing approved change documents receive citation unions plus refreshed approved-review timestamps; every prior citation is preserved, all semantic definitions remain unchanged, and there are zero source, version, event, or build patches
- mutation payload: 114100 bytes
- manifest content digest: `0a1cb2786376a49edb4a9ccd0fa70be42e5d3484e8954beb6556217a5b1cd9d5`
- production snapshot digest: `a17bd51fedb0dcef1cb6c723e48ed9b61d551fc6369ac6982dbd28ebf6f85db5`
- production plan SHA: `5b084b4ac4201a60b04235542f240aa5289dae5b4560cfa87122178fa344af94`
- plan artifact SHA-256: `6011fb1ea1d371ec91444588c24df74ce5fd88f3930bf3ede0ae249c33ec9d2f`
- rollback artifact SHA-256: `ac585e3644187bfc8427f8a469c555690f757af2493870dfd6e6cdf20b3b1f33`
- rollback coverage: all 52 create IDs and all
  5 full restore documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: `F0eE6eK5XyVXtlnaoydbIq`
- applied plan SHA: `5b084b4ac4201a60b04235542f240aa5289dae5b4560cfa87122178fa344af94`
- receipt SHA-256: `4dc67fb89f80cd52374574cb8574e982bfcf0b255a903f10f21211a435518f12`
- immediate post-publication zero plan:
  `f66a811b39762ab15bfecc98547e7156093311d40ba8ce5edf6ff25509ae5214`; zero creates, zero patches,
  2,200 unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `df7c21737eb6d2534a83b120a1248304c3d8fe39b52d56a55eba5ccc1e07c942`
- zero-plan rollback artifact SHA-256:
  `a132f6b8221f799b64839d9e520a0ecd141b996f47857b0f20be6af11c3b3793`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 2,047
  appearances:
  494 full articles,
  256 source-linked records,
  and
  1,297
  timeline-only records
- 645 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned both archival article sections, every expected structured change
title, References, its first cited source, and an `index, follow` directive.
No route returned placeholder copy or a `noindex` directive.

| Canonical route            | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots        |
| -------------------------- | ---: | ---------------: | ---------------: | ---------- | ------------ | ----------- | ------------- |
| `/apple/ios/6.1/beta-1/`   |  200 |              2/2 |              5/5 | yes        | yes          | no          | index, follow |
| `/apple/ios/6.1/beta-2/`   |  200 |              2/2 |              7/7 | yes        | yes          | no          | index, follow |
| `/apple/ios/6.1/beta-3/`   |  200 |              2/2 |              9/9 | yes        | yes          | no          | index, follow |
| `/apple/ios/6.1/beta-4/`   |  200 |              2/2 |              4/4 | yes        | yes          | no          | index, follow |
| `/apple/ios/6.1/beta-5/`   |  200 |              2/2 |              1/1 | yes        | yes          | no          | index, follow |
| `/apple/ios/6.1.1/beta-1/` |  200 |              2/2 |              2/2 | yes        | yes          | no          | index, follow |
| `/apple/ios/6.1.3/beta-2/` |  200 |              2/2 |              3/3 | yes        | yes          | no          | index, follow |

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-6-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
node --import tsx --test tests/*.test.ts
npx eslint scripts/research-batches/build-apple-ios-6-point-prerelease.mjs scripts/research-batches/audit-ios6-point-prerelease-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-6-point-prerelease.mjs scripts/research-batches/apple-ios-6-point-prerelease.json scripts/research-batches/apple-ios-6-point-prerelease.md scripts/research-batches/audit-ios6-point-prerelease-html-states.mjs
node scripts/research-batches/audit-ios6-point-prerelease-html-states.mjs scripts/research-batches/apple-ios-6-point-prerelease.json /private/tmp/apple-ios6-point-prerelease.lILAsH
```
