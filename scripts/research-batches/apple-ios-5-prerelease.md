# Apple iOS 5 prerelease archive batch

## Result

`apple-ios-5-prerelease.json` is the editorially approved archive overlay for eight
historically defensible iOS 5.0 prerelease routes. It does not alter the
hardcoded seed timeline or any existing Public route.

- 8 identity-backed event creates and no release-version overlays
- 137 source-backed change occurrences across
  101 canonical definitions
- 15 Beta 1 feature definitions deliberately reused from
  the approved Public owner with byte-for-byte definition equality
- 20 declared and used sources with 536 citation
  references
- zero builds, build-number claims, seed edits, or Public-route changes
- every event is `editoriallyVerified`, approved at `2026-07-30T12:08:22Z`, and
  explicitly `isIndexable: true`

## New historical route closure

| Milestone | New alias | Appearance date | Selected changes | Fixed | Current known |
| --------- | --------- | --------------- | ---------------: | ----: | ------------: |
| Beta 1    | `beta-1`  | 2011-06-06      |               15 |     0 |             0 |
| Beta 2    | `beta-2`  | 2011-06-24      |               25 |    10 |            12 |
| Beta 3    | `beta-3`  | 2011-07-11      |               16 |     7 |             8 |
| Beta 4    | `beta-4`  | 2011-07-22      |               17 |     4 |            11 |
| Beta 5    | `beta-5`  | 2011-08-06      |               26 |    12 |            12 |
| Beta 6    | `beta-6`  | 2011-08-19      |               22 |    14 |             4 |
| Beta 7    | `beta-7`  | 2011-08-31      |               14 |     6 |             4 |
| GM        | `gm`      | 2011-10-04      |                2 |     2 |             0 |

The local iOS 5 seed currently contains only Public milestones. These eight
identities are carried in the ingestion manifest itself with deterministic
`stableEventId` values, `platform-ios`, `version-ios-5-0`, exact aliases,
dates, channels, and sequence numbers. The generator refuses route or stable-ID
ownership collisions.

## Evidence method

1. Beta 1 uses two first-party Apple pages. Apple Developer confirms immediate
   beta availability on June 6, and Apple Newsroom supplies a public feature
   preview. The structured baseline reuses the approved Public page’s canonical
   feature definitions and does not claim that each feature was complete.
2. Beta 2–4 use contemporaneous release reporting for exact identity and
   preserved reproductions of Apple’s developer notes for detailed records.
   Only explicit `NEW` or `FIXED` markers are promoted, apart from narrowly
   identified current state needed to connect a later fix.
3. Beta 5 has the strongest retained artifact: an eight-page Apple-authored PDF
   created on August 6, 2011 and independently reproduced by Cult of Mac. The
   PDF was opened through PDFKit, checked page by page for title and locators,
   and hashed over the exact downloaded bytes.
4. Beta 6 and Beta 7 use full contemporaneous developer-note reproductions.
   Entries already marked fixed in Beta 5 or repeated without a defensible new
   boundary are excluded. Repeated known conditions are labeled as state rather
   than first appearance. Seven Cocoa Auto Layout / AppKit records embedded in
   the combined tool notes are excluded because they concern macOS Interface
   Builder behavior rather than the iOS release.
5. GM is limited to two isolatable fixes in the retained GM transcript. Public
   remains separately owned by the approved `apple-ios-5.json` batch.

## Raw-source audit ledger

The HTML and PDF bodies were downloaded on 2026-07-30 to a temporary,
uncommitted audit directory. Hashes below cover the exact response bytes.

| Raw artifact                     |     Bytes / pages | SHA-256                                                            | Use                             |
| -------------------------------- | ----------------: | ------------------------------------------------------------------ | ------------------------------- |
| Apple Developer Beta 1 HTML      |           107,467 | `7a4894caa3a5a13f00607355bb78ab2712c58e3c2e1c466fed1506a504534e1e` | Beta 1 identity                 |
| Apple Newsroom Beta 1 HTML       |           133,524 | `d444d3a73e3875822844ff5c7adaacad729daaf2ceb0a2e91416811b4aa8ed6a` | Beta 1 feature baseline         |
| MacRumors Beta 2 HTML            |           131,075 | `11f7574fa3220294dc2ed7a288f443392fd928282823efa1164b32b66941dd8b` | Beta 2 identity                 |
| iPhone Forums Beta 2 HTML        |           200,050 | `853f3101a891ecf2680c0312232595b422efa50d8675c435009b145a1423cdba` | Beta 2 body                     |
| MacRumors Beta 3 HTML            |           124,873 | `cd6d752ffe8cca2609eef8fd26baa19d665ab8898c0c539d348d23736aa13dd6` | Beta 3 identity                 |
| TheUnlockr Beta 3 HTML           |           182,064 | `db9b2ea58b0504e6f6965501c1b7f75523268f36d9c5cfdb2a23680f5233ce12` | Beta 3 body                     |
| MacStories Beta 3 HTML           |            55,292 | `fb952d0eb835ff2d78b5bfee4e1699106b01e4db1f6f0c8ce54d7d37e4575daa` | Beta 3 corroboration            |
| MacRumors Beta 4 HTML            |           123,356 | `aca9dfb57e7390e9aa50cb9755336e4d4acb12a7cb840aa2d0384755c187b945` | Beta 4 identity                 |
| iPhone Forums Beta 4 HTML        |           133,913 | `42bb811112e3e8c1d5ed61f2672496336165076ebec3667bfbca8f65cbf7a5e4` | Beta 4 body                     |
| MacRumors Beta 5 HTML            |           130,067 | `54b6af58a5437960224c432e19ae13df15da62b2c497f64f7bcf28377e824b64` | Beta 5 identity                 |
| Apple-authored Beta 5 PDF mirror | 155,665 / 8 pages | `786c027c85024d5da0295a16587dec1e86a4c86705c9c8ae9f7842b557c87416` | Beta 5 body                     |
| Cult of Mac Beta 5 HTML          |           310,399 | `29861fafc314e0063e95f95c96272eab7ffbe823bfe24c593cb7398ed29b42f3` | Beta 5 body corroboration       |
| MacRumors Beta 6 HTML            |           125,748 | `e2a15fc9f5bf6804e63068994349ace5925424f8e8d3b3107d63e66fe4f492f0` | Beta 6 identity                 |
| TheUnlockr Beta 6 HTML           |           193,088 | `27c5982ec6d8ac0ba6638f38f7974eea0c91926ddd968f57b11280edfe96ce54` | Beta 6 body                     |
| MacRumors Beta 7 HTML            |           124,584 | `2f184c64e63f95d5ad037356f72fabe8645acc9fa2e06b8de2abcc96e7d664c2` | Beta 7 identity                 |
| iDownloadBlog Beta 7 HTML        |           251,968 | `260d42b34df10d5667232b0c3b82cbcd1964187a6e1a16d38f5779db76afacfc` | Beta 7 body                     |
| MacRumors GM HTML                |           123,614 | `196ca3ee8d31e2f60ef7e1dff692627f3817cf36b158913ecdcc8195f3bc59c1` | GM identity                     |
| Wirefly GM HTML                  |           105,820 | `eca3875107a5b408f9c55ace9d29d41a7e0ec942a400a205c6fe159014af436c` | GM body                         |
| TechCrunch Public-boundary HTML  |           226,779 | `86c94ed5e6e5e2144ca3533315e3acaa0043ce118092b707e0f9b6da8efb405e` | Seven-beta / one-GM boundary    |
| MacRumors iTunes Beta 8 HTML     |           126,577 | `c3a75ae1dd3a2b22fdb116baa31fe0582b5fa6579db171350ca5c6040d3d3b3d` | Product-sequence disambiguation |

The HTML audit verifies all selected citation locators against the exact raw
pages, route counts, marker inventories, file sizes, and hashes. The PDFKit
audit separately verifies the Beta 5 title, page count, creation metadata, and
every selected PDF locator. Raw third-party reproductions are not committed.

An independent live re-fetch downloaded all
20 public evidence artifacts again.
13 complete payloads remained byte-identical,
and 14 whole normalized bodies remained
identical; the remaining wrapper differences were dynamic counters,
timestamps, challenge IDs, or current-page modules. All
137 selected HTML locators, all seven
`NEW`/`FIXED` marker inventories, and the exact Beta 5 PDF bytes reproduced.

## Copyright and editorial method

Every event summary, article paragraph, occurrence title, canonical summary,
occurrence summary, and verification method is original synthesis. Technical
identifiers and product names are retained only where necessary to identify an
API, framework, setting, or affected feature.

The detailed third-party pages reproduce Apple-authored developer material.
They are credited as preservation or journalistic hosts, never represented as
first-party hosting, and never copied into the manifest as a list. The Beta 5
PDF is likewise identified as an Apple-authored document preserved by a mirror.

The Beta 1 page reuses fifteen definitions from the approved Public batch
instead of creating duplicate canonical concepts. The generator permits those
keys only when title, summary, category, and owning file all match exactly.

## Exact evidence gaps

- No direct first-party download for Beta 2–GM remains in the audited public
  source set. Those identities rely on contemporaneous release reporting, and
  detailed bodies rely on credited third-party preservation.
- Beta 5 is the only complete byte-verifiable PDF recovered. Other developer
  bodies are HTML reproductions and remain `corroborated`, not
  `confirmed`.
- No iOS 5 Beta 8 route is created. A September 9 source identifies iTunes
  10.5 Beta 8 and iWork Beta 3, while final-release coverage counts seven iOS
  betas and one GM. Any later timeline that says otherwise remains
  ledger-only.
- No complete first-party build-number set was recovered. The batch creates no
  build documents and makes no build assertion, even where journalism displays
  a build string.
- The structured selections are milestone deltas, not exhaustive copies of
  cumulative release notes. Repeated fixed text and unmarked carry-forward are
  excluded.
- Cocoa Auto Layout and `NSSegmentedControl` entries in the Beta 6 and Beta 7
  tool-note reproductions are macOS/AppKit records and are deliberately
  excluded from this iOS archive.
- This cohort covers the iOS 5.0 prerelease cycle only. Prerelease histories
  for 5.0.1 and 5.1 are researched in a separate review-only cohort rather than
  inferred here.
- Public is already covered by the approved iOS 5 batch and is neither
  duplicated nor patched.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Download iOS 5 and iOS 5 SDK Beta Today](https://developer.apple.com/news/?id=06062011a) — Apple Developer; by Apple; firstPartyAnnouncement.
- [New Version of iOS Includes Notification Center, iMessage, Newsstand, Twitter Integration Among 200 New Features](https://www.apple.com/newsroom/2011/06/06New-Version-of-iOS-Includes-Notification-Center-iMessage-Newsstand-Twitter-Integration-Among-200-New-Features/) — Apple Newsroom; by Apple; firstPartyAnnouncement.
- [Apple Releases iOS 5 Beta 2 to Developers, Now with Wi-Fi Sync](https://www.macrumors.com/2011/06/24/apple-releases-ios-5-beta-2-to-developers/) — MacRumors; by Arnold Kim; journalism.
- [iOS SDK Release Notes for iOS 5.0 Beta 2 (forum preservation)](https://www.iphoneforums.net/threads/differences-in-the-new-ios-5-betas.15506/) — iPhone Forums; by Apple; preserved by forum member Gregoris; community.
- [Apple Releases iOS 5 Beta 3 to Developers](https://www.macrumors.com/2011/07/11/apple-releases-ios-5-beta-3-to-developers/) — MacRumors; by Eric Slivka; journalism.
- [Apple iOS 5 Beta 3 Released with Full Change Log](https://theunlockr.com/apple-ios-5-beta-3-alongside-itunes-10-5-released-with-full-change-log/) — TheUnlockr; by Amy Eichelberg; journalism.
- [Apple Releases iOS 5 Beta 3](https://www.macstories.net/news/apple-releases-ios-5-beta-3/) — MacStories; by Federico Viticci; journalism.
- [Apple Seeds iOS 5 Beta 4 to Developers, Over-The-Air Updating Going Live](https://www.macrumors.com/2011/07/22/apple-seeds-ios-5-beta-4-to-developers/) — MacRumors; by Eric Slivka; journalism.
- [iOS SDK Release Notes for iOS 5.0 Beta 4 (forum preservation)](https://www.iphoneforums.net/threads/ios-sdk-release-notes-for-ios-5-0-beta-4.17424/) — iPhone Forums; by Apple; preserved by forum member Gregoris; community.
- [Apple Releases iOS 5 Beta 5 to Developers](https://www.macrumors.com/2011/08/06/apple-releases-ios-5-beta-5-to-developers/) — MacRumors; by Arnold Kim; journalism.
- [iOS SDK Release Notes for iOS 5.0 Beta 5 (preserved PDF)](https://iszene.com/uploads/5nvaddy7eqkbt355afs.pdf) — iSzene document mirror; by Apple; archive.
- [Apple Releases iOS 5 Beta 5 and iTunes 10.5 Beta 5 to Developers](https://www.cultofmac.com/news/apple-releases-ios-5-beta-5-and-itunes-10-5-beta-5-to-developers) — Cult of Mac; by Alex Heath; journalism.
- [iOS 5 Beta 6 Seeded to Developers](https://www.macrumors.com/2011/08/19/ios-5-beta-6-seeded-to-developers/) — MacRumors; by Eric Slivka; journalism.
- [iOS 5 Beta 6 Released to Developers, Full Change Log Included](https://theunlockr.com/ios-5-beta-6-released-to-developers-full-change-log-included/) — TheUnlockr; by Amy Eichelberg; journalism.
- [Apple Posts iOS 5 Beta 7 for Developers](https://www.macrumors.com/2011/08/31/apple-posts-ios-5-beta-7-for-developers/) — MacRumors; by Jordan Golson; journalism.
- [Apple Releases iOS 5 Beta 7](https://www.idownloadblog.com/2011/08/31/ios-5-beta-7/) — iDownloadBlog; by Alex Heath; journalism.
- [Apple Posts iOS 5 Golden Master Seed for Developers](https://www.macrumors.com/2011/10/04/apple-posts-ios-5-golden-master-seed-for-developers/) — MacRumors; by Jordan Golson; journalism.
- [Apple Makes iOS 5 GM Available to Registered Developers](https://news.wirefly.com/2011/10/04/apple-makes-ios-5-gm-available-to-registered-developers) — Wirefly; by Alex Wagner; journalism.
- [Apple’s iOS 5 Update Now Available for iPhone, iPad, and iPod Touch](https://techcrunch.com/2011/10/12/apples-ios-5-update-now-available-for-iphone-ipad-and-ipod-touch/) — TechCrunch; by Greg Kumparak; journalism.
- [Apple Seeds New iTunes 10.5 and iWork for iOS Betas to Developers](https://www.macrumors.com/2011/09/09/apple-seeds-new-itunes-10-5-and-iwork-for-ios-betas-to-developers/) — MacRumors; by Eric Slivka; journalism.

## Closure guards

- Exact comparison against all four local iOS 5 seed records, which still carry
  only Public milestones
- Exact eight-event identity allowlist for Beta 1–7 and GM, including stable
  IDs, aliases, labels, channels, dates, sequences, platform, and parent version
- Explicit rejection of Public and Beta 8
- Approved/indexable ownership check for the existing iOS 5.0 Public route
- Zero release-version overlays and zero builds
- Route and stable-ID collision scan across every other research-batch JSON
  plus `apple-launch-content-2026.json`
- 137 occurrences resolve to exactly
  101 canonical definitions
- Strict allowlist for 15 approved Public definition reuses;
  every other key must be collision-free
- Complete unique source declaration/use closure
- 71 selected non-state records align
  with the nearest explicit `NEW` or `FIXED` source marker
- 34 repeated canonical identities preserve
  36 known/changed-to-fixed or
  continuing-known transitions without definition drift
- Exact exclusion guard for seven macOS-only Cocoa Auto Layout definitions
- Deterministic formatted JSON SHA-256: `f045f59eb1f8d159cb9c24892821d43e4050e57c3e0b516c238cb0d006bcde66`

## Editorial approval and validation record

The independently re-fetched and audited event creations are approved:

- provenance: `editoriallyVerified`
- editorial status: `approved` at `2026-07-30T12:08:22Z`
- indexing: enabled

- repository validation: 71 batches validated;
  this cohort reports 8 events, 137 changes,
  20 sources, and 536 citations;
  4,170 change keys are
  globally consistent
- focused ingestion/manifest tests:
  19 passed
- full repository suite: 131 passed
- raw HTML locator assertions: 137
- raw PDF locator assertions: 26
- explicit source-marker alignment assertions:
  71
- independent live source re-fetch: all
  20 artifacts available, every selected
  locator and marker inventory reproduced, and the Beta 5 PDF remained
  byte-identical
- copyright-similarity scan:
  604 reader-facing fields
  checked against the retained evidence; the longest contiguous overlap was
  5 words
- ESLint, Prettier check, and `git diff --check`: passed
- applied production plan: 112 creates,
  17 patches, 2086 unchanged
- create split: 8 events, 18 sources,
  and 86 stable change documents
- patch boundary: 15 reused Public change documents receive citation union and
  the approved review timestamp only; two reused source documents receive topic
  or source-class metadata only; zero versions or existing events are patched
- mutation payload: 341,448 bytes
- production plan SHA: `e320d0b62fb8b49372380363eb03f21665198e53c0817d8da59117e2324318d9`
- plan artifact SHA-256: `5132294bb51b402c8a13ad8b859e79029db3870de3b8748dda90547d0d0395f8`
- rollback artifact SHA-256: `f6094ea56eb7afdf41b4dfe60c4f632346dca75cacce70a12c95a17e66dba9d2`
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload size, plan artifact, and rollback artifact

## Publication receipt

- applied plan SHA: `e320d0b62fb8b49372380363eb03f21665198e53c0817d8da59117e2324318d9`
- reviewed plan artifact SHA-256: `5132294bb51b402c8a13ad8b859e79029db3870de3b8748dda90547d0d0395f8`
- rollback artifact SHA-256: `f6094ea56eb7afdf41b4dfe60c4f632346dca75cacce70a12c95a17e66dba9d2`
- Sanity transaction: `F0eE6eK5XyVXtlnaoyTjQK`
- receipt SHA-256: `4dec48cb0c9a7b0c6558097d9744ae9f20014393f53e7fb4a83468f95b148cbe`
- immediate post-publication zero plan:
  `abf460f81e84f0e6190a168ac7bb858c6e7034c1d5d563e5ef0bba5778a0c3e0`;
  0 creates,
  0 patches,
  2,215 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `8abe53d94ce803512ad58e2f6f71626046a3b67b70aed9d75d3e4c28d0669eb1`
- zero-plan rollback artifact SHA-256:
  `28814a9a2165a282b8833c44b56f70f05ad701553dfd77967dfd9d00a2249ddb`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 1,991
  appearances: 438 full articles,
  256 source-linked records, and
  1,297
  timeline-only records
- 589 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned all six archival article blocks, every expected
structured change title, References, and its primary source. No response
returned placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Article blocks | Expected changes | References | Primary source | Placeholder | Noindex |
| ------------------------ | ---: | -------------: | ---------------: | ---------- | -------------- | ----------- | ------- |
| `/apple/ios/5.0/beta-1/` |  200 |            6/6 |            15/15 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/beta-2/` |  200 |            6/6 |            25/25 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/beta-3/` |  200 |            6/6 |            16/16 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/beta-4/` |  200 |            6/6 |            17/17 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/beta-5/` |  200 |            6/6 |            26/26 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/beta-6/` |  200 |            6/6 |            22/22 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/beta-7/` |  200 |            6/6 |            14/14 | yes        | yes            | no          | no      |
| `/apple/ios/5.0/gm/`     |  200 |            6/6 |              2/2 | yes        | yes            | no          | no      |

Final verification on 2026-07-30:

- full repository suite: 131 tests passed
- focused ingestion and manifest suite:
  19 tests passed
- deterministic regeneration preserved JSON SHA-256 `f045f59eb1f8d159cb9c24892821d43e4050e57c3e0b516c238cb0d006bcde66`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,215 unchanged
  documents, the 16-byte payload, and
  plan SHA `abf460f81e84f0e6190a168ac7bb858c6e7034c1d5d563e5ef0bba5778a0c3e0`
- the final planner reported “No Sanity data changed”

Reproduce and verify the published batch with:

```sh
node scripts/research-batches/build-apple-ios-5-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-5-prerelease.mjs scripts/research-batches/audit-ios5-prerelease-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-5-prerelease.mjs scripts/research-batches/apple-ios-5-prerelease.json scripts/research-batches/apple-ios-5-prerelease.md scripts/research-batches/audit-ios5-prerelease-html-states.mjs
node scripts/research-batches/audit-ios5-prerelease-html-states.mjs scripts/research-batches/apple-ios-5-prerelease.json /private/tmp/apple-ios5-prerelease.ELLID3
osascript -l JavaScript scripts/research-batches/audit-ios5-prerelease-pdf-state.jxa scripts/research-batches/apple-ios-5-prerelease.json /private/tmp/apple-ios5-prerelease.ELLID3
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-5-prerelease.json
```

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
