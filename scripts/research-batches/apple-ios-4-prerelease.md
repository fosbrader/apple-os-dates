# Apple iOS 4 prerelease archive batch

## Result

`apple-ios-4-prerelease.json` is the editorially approved archive overlay for five
historically defensible iOS 4.0 prerelease routes absent from the local seed.

- 5 identity-backed event creates and no release-version overlays
- 71 milestone occurrences across 67
  stable, collision-checked definitions
- 19 declared and used sources with 382 citation references
- zero builds, build-number claims, or Public-route changes
- every route is `editoriallyVerified`, approved at `2026-07-30T12:29:13Z`, and
  explicitly `isIndexable: true`

## Published route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| -------- | --------- | --------- | --------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`  | 2010-04-08      |               20 |
| iOS      | Beta 2    | `beta-2`  | 2010-04-20      |               20 |
| iOS      | Beta 3    | `beta-3`  | 2010-05-04      |               14 |
| iOS      | Beta 4    | `beta-4`  | 2010-05-18      |               14 |
| iOS      | GM        | `gm`      | 2010-06-07      |                3 |

The local seed contains only Public on 2010-06-21. Its existing route is
approved and indexable in `apple-ios-4.json`; this batch does not patch it.

## Evidence method

1. Beta 1 is backed by Apple’s launch-day announcement, the next-day Apple
   Developer notice, and a contemporaneous API inventory. Its 20 records are a
   representative first-document baseline rather than a predecessor diff.
2. Beta 2 uses a same-day copy of Apple’s known-issues section. Fourteen
   explicit NEW or FIXED entries are deltas; six unmarked current-state records
   are labeled `cumulative` so their first appearance is not overstated. One
   Interface Builder entry is presented as an internal source contradiction:
   the retained marker says FIXED while its sentence still calls the workflow
   unsupported.
3. Beta 3 uses a complete participant-posted copy of Apple’s May 3-dated
   document. Selection is restricted to seed-specific upgrade, removal,
   new-issue, fixed, and simulator statements. Independent reports add the
   temporary withdrawal and two user-visible controls.
4. Beta 4 is semantically compared with Beta 3. Ten newly resolved, newly
   stated, or changed developer entries survive; repeated cumulative lines do
   not. Four observed interface/settings records remain explicitly
   undocumented, including one single-source item at `reported` evidence.
5. GM has no recovered complete developer-note body. Three bounded records are
   supported by the naming announcement, independent GM reports, and the
   iTunes compatibility observation rather than synthetic release notes.

## Raw evidence audit

`audit-ios4-prerelease.mjs` verifies the exact ignored research downloads,
their byte counts and SHA-256 hashes, 18 normalized article/transcript hashes,
publication identity metadata, and a short probe for every selected fact
family.

| Evidence artifact                  | Raw bytes | Raw SHA-256                                                        | Normalized text audit                                                            |
| ---------------------------------- | --------: | ------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Apple Beta 1 Newsroom              |   129,252 | `2fd9f6fb5a58aca6140cd6081bf122ded5d66149a66630c2653c98685f6ba537` | 6,575 bytes; `fab107449b253b409e5f397e8320e57c8154ffa378f03a4bafa138a548096d85`  |
| Apple Beta 1 developer notice      |   107,336 | `b680a1148ed48ee3f280b0775b5f1350e9b14b25a3ae7a6149a480ad42666a49` | 474 bytes; `a54477bce23d5440dab43ed35e41a90003e0b09f88e3d7c08f98d826d73f01be`    |
| Beta 1 API report                  |   113,135 | `3d55301761116226c85dfa593d889b6788f22bc6e772beb6f6be8bdced148d86` | 1,355 bytes; `02a881a212874ac2578a284e0a264f6903a29d0f97d332c29d316028d6db73e2`  |
| Beta 2 identity report             |   112,791 | `7d9dbedec9b125f255f55c2de501a74b193a3a2c39d2ca96ed1d3d097ae53d17` | 1,178 bytes; `bcd1255d37694f3ecbe5583fc7edd7788327c9bb889804a4f1bd0587f67e930d`  |
| Beta 2 known-issues transcript     |   301,490 | `f76396ba9d11ac657beb0f84a5cb8e3839f88b9ae584372c3f3203a41c976aa7` | 4,417 bytes; `55faac079578a5ef7b7ae22096b40b8993d90e2fdd2ad02485b7845550309e2c`  |
| Beta 3 developer-note transcript   |   465,638 | `2aec9b9d9d1d9e12d2027fca470ade03e9c000bb18b21c08217f79498cf21fd3` | 10,227 bytes; `00fb6ed2c007399078c93543e2379231693ad236c3700b893fddce1395bdf6ec` |
| Beta 3 identity report             |   222,652 | `c5d130a93419f42e030638de65b3f9100226c7a9929e7f68dc071bd00d70296e` | JSON-LD identity audit                                                           |
| Beta 3 withdrawal report           |   199,358 | `a5e2ef55e9c1bd2d3313577c0e85b1fe7da051a778e2bf9b203f6ffa664150ed` | 2,762 bytes; `57cc79558a1eb9c769ead009d9c8f3913061c73643e85469038a4216e9d1d2fe`  |
| Beta 3 feature report, MacRumors   |   113,628 | `935e908d9929ebabeb51ddf0a13b7266f321f3d9cee1a8412e204d120ac2bd27` | 1,315 bytes; `aae3f66e4dc4804b9a0d4912eba989d16f065a93cbb2407da51b2c63063f9ad2`  |
| Beta 3 feature report, Engadget    |    60,004 | `c9927c3692aecc4c6e5b756dd784d672b8cc22538aec1d26747924797e249316` | 1,193 bytes; `9f5bf758262d34f7bd99ccfbd1d4d4b2b391ef4d20c6f97fd8ba76e0f9b29338`  |
| Beta 4 identity report             |   113,309 | `89186c716a3514db91c4419ec680378ae8d6850036813bc650103b889e4f74c7` | 1,351 bytes; `39c7095c5f70280010cd6bcd66ead03fecda3a53cc8d866d52d7ae6875731e3b`  |
| Beta 4 known-issues transcript     |   297,226 | `e40b7642b3c30617901a487f67b9cfd63c8a381fff04ba92cfd17035d40596f0` | 9,189 bytes; `3e24ad90ed6e1c7285f6467108b350904075465c6de8e40c721e5eb9e9356cbb`  |
| Beta 4 feature report, PCWorld     |   250,790 | `a5772819538499251061c187d6268374577740e1a44429053f150e7d2378a774` | 1,894 bytes; `6fb84cbc26fb208dff606587279f107568669abb84fda51abf4adebe3005d8c0`  |
| Beta 4 feature report, Gizmodo     |   214,805 | `f74630ef6c0984bc4cfbf762b28581669cacfb73476ad3643306ca212139687f` | 2,098 bytes; `91d4ce01112994b9e1020a4112c5de6f15296c6531799c21d918064e29d55642`  |
| GM identity report                 |   111,894 | `3ddffd6622354be3b8493e2b166f340fe01fb1e378d66f2ad0137c2c2756620b` | 565 bytes; `92cbb2c728b81e648f599be19b8424af1b55f3adf195a399787a00022cfca056`    |
| GM installation report             |    58,314 | `d752489c9012a5bcad5169b7004a8b7f5db33e09f446cc6d36a61a27bde037a3` | 958 bytes; `efb7c6eeaeacb77d9a0f5db84bec2b96681f9b6719c792850281059cd5a66de0`    |
| GM naming report, MacRumors        |   112,220 | `6feec295ff5002ff92602ae3815fa409b378ad974dc207030a14d94884a4b84c` | 900 bytes; `a94b8fe6dc9ba2d24950323e07d46c3135d075821a2ef983f2434dbf108523a5`    |
| GM naming report, Engadget         |    62,436 | `eb814da4f87b1bba5642ff965b471e63519fde678fd39cb6affff654413ef610` | 1,742 bytes; `cd63ee38ca53b0619f1fb146292d1a57b27cd1b548e221b0c2ffc1847048726d`  |
| Apple public-boundary announcement |   131,796 | `d11f98321de46f691c329d8bb9b8abe90b28be49b8011e553e2189c8dc14832d` | 8,779 bytes; `ddf9b0b76318c28b3154b0dcf20ea406eccafd9df8a5f27cf9ed84b131fc701c`  |

The 19 raw files total 3,178,074 bytes. Publisher text remains only in the
ignored evidence directory and is not committed in the manifest.

An independent live re-fetch reached all
19 sources. The complete response
bytes remained identical for 7; the
selected normalized body remained identical for 17. The two dynamically rendered
exceptions reproduced their exact publication identity or retained fact
probes, so all 19 evidence
boundaries were independently reproduced.

## Exact gaps and exclusions

- The local seed has no prerelease identities. All five candidates therefore
  carry complete deterministic event identities.
- No defensible Beta 5 milestone was found in the audited chronology. No route
  is created for one.
- Beta 3’s temporary removal and return do not establish a separately named
  revision; one Beta 3 route records the distribution incident.
- Beta 2 and Beta 4 are host-preserved known-issues sections, not complete
  first-party-hosted documents.
- No complete GM note body survives in the audited public material.
- No build number is inferred from screenshots, download labels, filenames, or
  publisher prose.
- Tethering, speed, and hardware-dependent claims are excluded from Beta 4.
- Public remains owned by the approved iOS 4 batch.

## Copyright and attribution controls

- Titles, canonical summaries, occurrence summaries, and article prose are
  original synthesis.
- Every factual record carries source citations and a short locator.
- Apple is credited as author of the two mirrored developer-note bodies, and
  each host is named so custody of the surviving copy is explicit.
- No transcript, screenshot, article body, or long quotation is committed.
- The independent phrase-similarity scan checked
  329 reader-facing fields against all 19
  retained raw artifacts. Its longest contiguous overlap was
  5 words:
  “securely host and wirelessly distribute,” a short factual capability phrase.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Apple Previews iPhone OS 4](https://www.apple.com/newsroom/2010/04/08Apple-Previews-iPhone-OS-4/) — Apple Newsroom; firstPartyAnnouncement.
- [Download the New iPhone SDK and iPhone OS 4 beta Today](https://developer.apple.com/news/?id=04092010a) — Apple Developer; developerDocs.
- [Apple Releases iPhone SDK 4 Beta to Developers](https://www.macrumors.com/2010/04/08/apple-releases-iphone-sdk-4-beta-to-developers/) — MacRumors; journalism.
- [Apple Releases iPhone OS 4 Beta 2 and SDK to Developers](https://www.macrumors.com/2010/04/20/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers/) — MacRumors; journalism.
- [iPhone OS 4 Beta 2 developer known-issues transcript](https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers.901243/page-2) — MacRumors Forums; archive.
- [iPhone SDK Release Notes for iPhone OS 4.0 Beta 3 transcript](https://forum.donanimhaber.com/apple-iphone-os-4-0-in-3-beta-surumunu-ve-sdk-i-yayinladi-g--39542933) — DonanımHaber Forum; archive.
- [iPhone OS 4 Beta 3 released to developers](https://techcrunch.com/2010/05/04/iphone-os-4-beta-3-released-to-developers/) — TechCrunch; journalism.
- [iPhone OS 4.0 beta reveals latest Apple goodies](https://www.macworld.com/article/205244/iphoneos4.html) — Macworld; journalism.
- [Latest iPhone OS 4 Beta Gains Orientation Lock and iPod Controls in Multitasking Interface](https://www.macrumors.com/2010/05/04/latest-iphone-os-4-beta-gains-orientation-lock-and-ipod-controls-in-multitasking-interface/) — MacRumors; journalism.
- [iPhone OS 4 beta 3 adds orientation lock, iPod controls to multitasking bar](https://www.engadget.com/2010-05-04-iphone-os-4-beta-3-adds-orientation-lock-ipod-controls-to-multi.html) — Engadget; journalism.
- [Apple Releases iPhone OS 4 Beta 4 and SDK to Developers](https://www.macrumors.com/2010/05/18/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers/) — MacRumors; journalism.
- [iPhone OS 4 Beta 4 developer known-issues transcript](https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers.918718/page-2) — MacRumors Forums; archive.
- [iPhone OS 4.0 Beta 4: New Features Breakdown](https://www.pcworld.com/article/512877/iphone_os_4_beta_4_new_features_breakdown.html) — PCWorld; journalism.
- [Here’s What’s New In iPhone OS 4.0 Beta 4](https://gizmodo.com/heres-whats-new-in-iphone-os-4-0-beta-4-5542143) — Gizmodo; journalism.
- [iOS 4.0 Golden Master and iTunes 9.2 Seeded to Developers](https://www.macrumors.com/2010/06/07/ios-4-0-golden-master-and-itunes-9-2-seeded-to-developers/) — MacRumors; journalism.
- [iOS 4 gold build now available to iPhone Developer Program members](https://www.engadget.com/2010-06-07-ios-4-gold-build-now-available-to-iphone-developer-program-membe.html/) — Engadget; journalism.
- [iPhone OS 4 Becomes iOS 4, Available June 21 for Free](https://www.macrumors.com/2010/06/07/iphone-os-4-becomes-ios-4-available-june-21-for-free/) — MacRumors; journalism.
- [iPhone OS 4 renamed iOS 4, launching June 21](https://www.engadget.com/2010-06-07-iphone-os-4-renamed-ios-gets-1500-new-features.html) — Engadget; journalism.
- [Apple Presents iPhone 4](https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/) — Apple Newsroom; firstPartyAnnouncement.

## Closure guards

- Exact comparison against the local iOS 4.0 seed and its sole Public milestone
- Approved/indexable Public ownership assertion against `apple-ios-4.json`
- Exact five-route identity, date, and count allowlist
- Explicit no-Beta-5, no-build, no-version-overlay, and no-Public-patch boundary
- Collision scan across every other batch plus
  `apple-launch-content-2026.json`
- 71 occurrences resolve to exactly
  67 stable local definitions
- 4 known-to-fixed histories
  retain one canonical definition across milestones
- 41 transcript locators and
  29 explicit NEW/FIXED markers
  align with their selected records
- Eight undocumented and two partially documented keys on exact allowlists
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `552baa65718aafb20e8c22586663d4a6ba95ba39a1a043c34b5c10475cc38010`

## Editorial approval and validation record

- Raw-evidence byte, hash, normalized-text, publication-identity, fact-family,
  and copyright audits passed
- independent live re-fetch: all
  19 sources available and all
  19 selected evidence
  boundaries reproduced
- Repository validation passed across 73
  batches and
  4,266 globally
  consistent change keys
- 19 focused ingestion/manifest tests and
  131 full repository tests passed
- ESLint, Prettier, JavaScript syntax checks, and `git diff --check` passed

## Production dry plan

- Status: Applied and zero-residual verified on 2026-07-30
- 89 creates:
  17 sources, 5 events,
  and 67 stable change documents
- 2 revision-guarded source-metadata patches: the reused
  Apple Beta 1 announcement and Public-boundary announcement; no release,
  event, build, or change document is patched
- 2,094 production documents
  remain unchanged
- Mutation payload:
  236,122 bytes
- Plan SHA: `c1a8b5a8aa13cfa065f4e81b770249332046c7ad1e73670ce5dcce109ae9bc8a`
- Plan artifact SHA-256: `1b23e7b8d0657b41fe7c87c286af40692fcc09ae0b51b1e2d0fbed5f8ef662ce`
- Rollback artifact SHA-256: `30aef00fb552199d41b65d05595064163eaf1b3f2bb080c5789335578668708a`

Three consecutive production dry runs reproduced the same plan SHA, counts,
payload size, plan artifact, and rollback artifact.

## Publication receipt

- Sanity transaction: `eOgq1Ovu5XNUv1qNFVET79`
- applied plan SHA: `c1a8b5a8aa13cfa065f4e81b770249332046c7ad1e73670ce5dcce109ae9bc8a`
- receipt SHA-256: `ef7ec4898c43624703ae9a76eedc81014b9459d467a74b5bb1c2930b925f7995`
- immediate post-publication zero plan:
  `81a0bd31f6cfa604f7aaeeb4188ba887ab77031810483f682ad4b1f485546bd3`;
  0 creates,
  0 patches,
  2,185 unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `2cab193b6e9a23fd50e887de157c29e3d9ef36fbdb03613a2ce3734caf1a8bb3`
- zero-plan rollback artifact SHA-256:
  `dc4d3f7e2b78e27508dde144ba47bbeafaaa83c36704bd8ad106a4a444e55289`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 1,996
  appearances: 443 full articles,
  256 source-linked records,
  and
  1,297
  timeline-only records
- 594 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all four archival article sections, every expected structured
change title, References, its first cited source, and an `index, follow`
directive. No route returned placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots        |
| ------------------------ | ---: | ---------------: | ---------------: | ---------- | ------------ | ----------- | ------------- |
| `/apple/ios/4.0/beta-1/` |  200 |              4/4 |            20/20 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.0/beta-2/` |  200 |              4/4 |            20/20 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.0/beta-3/` |  200 |              4/4 |            14/14 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.0/beta-4/` |  200 |              4/4 |            14/14 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.0/gm/`     |  200 |              4/4 |              3/3 | yes        | yes          | no          | index, follow |

No deployment was performed; domain and deployment work remains scheduled
separately.

## Reproduction

```sh
node scripts/research-batches/audit-ios4-prerelease.mjs tmp/ios4-evidence
node scripts/research-batches/build-apple-ios-4-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-4-prerelease.mjs scripts/research-batches/audit-ios4-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-4-prerelease.mjs scripts/research-batches/audit-ios4-prerelease.mjs scripts/research-batches/apple-ios-4-prerelease.json scripts/research-batches/apple-ios-4-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-4-prerelease.json
```
