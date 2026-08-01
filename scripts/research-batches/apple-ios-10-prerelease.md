# Apple iOS 10 prerelease archive batch

## Result

`apple-ios-10-prerelease.json` is the reviewed overlay for two existing iOS 10.0 routes:
Beta 1 and Beta 3.

- 2 substantive event overlays and no release-version overlays
- 67 milestone-specific change occurrences across
  67 stable, collision-checked definitions
- 5 declared and used sources with 217 citation
  references
- zero builds, build-number claims, route creation, GM changes, Public-route
  changes, community-observation changes, or administrative identity changes
- both events are `editoriallyVerified`, approved at `2026-07-30T09:44:24Z`, and
  `isIndexable: true`

## Reviewed route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |               30 |
| iOS      | Beta 3    | `beta-3`       |               37 |

The local iOS 10.0 seed contains ten milestones. Beta 2, Beta 4 through Beta 8,
GM, and Public remain outside this prerelease batch.

## Evidence method

1. Internet Archive preserves a complete Apple-authored PDF titled “iOS SDK
   Release Notes for iOS 10 Beta.” Its introduction identifies iOS SDK 10.0
   beta 1, its PDF page tree contains 20
   physical pages, and its numbered document body runs through page 18. All
   30 selected page-and-component locators
   were checked against the PDF.
2. A WWDC link ledger created on June 14, 2016 independently identifies the
   original Apple CDN path
   `WWDC_2016/iOS_10_beta/iOS_10_beta_Release_Notes.pdf`. It is used only
   for artifact identity and timing. The GitHub Gist API supplies the exact
   creation timestamp, and its raw payload reproduces the ledger hash below.
3. Scribd exposes a complete bot-readable transcript titled “iOS 10 Beta 3 -
   Release Notes.” The body identifies iOS SDK 10.0 beta 3, runs through
   document page 15, and retains the exact “Fixed in this Release” section at
   normalized lines 94–188. All
   37 fixed records were reconciled to their
   component groups and locators.
4. A contemporaneous July 19 AEST Whirlpool post links a Dropbox file named
   `iOS 10 beta 3 Release Notes.pdf`. The raw archived page retains post 355,
   author `NeonVoid777`, the exact encoded filename, and its
   2016-07-18T18:24:54Z timestamp. It is used only to corroborate the document
   identity and timing.
5. Beta 1 is treated as a first-document baseline. Beta 3 selection is limited
   to the explicit fixed section on pages 4–6. Generic cumulative notes,
   community observations, and unsupported builds are excluded.

## Selected findings

The Beta 1 baseline covers 30 documented availability constraints, features,
developer-facing behavior changes, compatibility boundaries, and known issues.
The Beta 3 delta covers all 37 independently checked records beneath Apple’s
fixed-section heading, spanning commerce, peripherals, audio, CarPlay, backup,
Messages, telephony, Photos, privacy, Siri, SiriKit, and UIKit.

These pages are structured historical indexes of Apple’s developer-facing
records. They do not claim to exhaust every user-visible change in either build.

## Raw and mirror audit ledger

| State                                   | Publication or access                           | Title                                              |                                                               Count | SHA-256                                                            | Use                                         |
| --------------------------------------- | ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------: | ------------------------------------------------------------------ | ------------------------------------------- |
| Preserved Beta 1 PDF bytes              | Beta 1, 2016-06-13                              | iOS SDK Release Notes for iOS 10 Beta              | 265,117 bytes; 20 physical PDF pages; numbered body through page 18 | `bb57b2b8b876cc40fd1874d5f1ae085f885fc776da3906da91604bbdfbc8b46e` | Exact Beta 1 evidence                       |
| Internet Archive Beta 1 text derivative | accessed 2026-07-30                             | iOS SDK Release Notes for iOS 10 Beta              |                   37,501 bytes; 166 OCR bullet records; 30 selected | `62ff46f46e197f5dd00a34afa611aee2da9bf8c5d5d66b9e2eb1ea024305feb1` | Independent text-level audit of PDF         |
| WWDC link-ledger API raw text           | created 2016-06-14 14:13:28Z                    | All the Apple Developer links you need from WWDC16 |  1 exact `WWDC_2016/iOS_10_beta/iOS_10_beta_Release_Notes.pdf` path | `e7b5aac7bf7aed153a580579e8618b3208a45bafc31c4107b24cf2b1929cef70` | Beta 1 identity corroboration               |
| Normalized Beta 3 transcript text       | accessed 2026-07-30                             | iOS SDK Release Notes for iOS 10 beta 3            |               39,717 bytes; fixed boundary lines 94–188; 37 records | `b20309f0c6eb719b6a3d2d16ed97a2bcc0c49979badbbcea3049a794a94233e0` | Exact Beta 3 transcript and component audit |
| Contemporaneous Beta 3 context page     | post 355 by NeonVoid777 at 2016-07-18 18:24:54Z | iOS 10 General Discussion                          |     1 encoded exact `iOS 10 beta 3 Release Notes.pdf` filename link | `9227aa89f9e1e56d882ad2789acede823ac2cf9617c56862be5f647bbc19e8a5` | Beta 3 identity corroboration               |
| Current Apple final archive HTML        | accessed 2026-07-30                             | iOS 10.0 Release Notes                             |                            22 rendered headings; updated 2016-09-13 | `b080c29354c91ffad187a1a2780cbf21238b1957e69ae8dc3c2b3ec81fc1e0ab` | Final-state boundary only                   |

The Internet Archive item metadata declares Apple as creator and records the
preserved PDF at 265,117 bytes, SHA-1
`9c88e9686f0cc60e8b2862c80b43715a7bbff096`, and MD5
`06d58fd6e4cff4ea4126804bfa0feaf2`. The SHA-256 above was independently
computed from the downloaded bytes.

The PDF metadata values and the independently downloaded byte count match. The
37,501-byte OCR derivative contains
166 parsed bullet records. Every one of the
30 selected Beta 1 occurrences was checked against
both its physical page and component heading.

The Scribd response contains a bot-readable transcription rather than the
original PDF bytes. Its HTML metadata reports 16 host pages while Apple’s
document footers and body run through page 15; this ledger uses the document
count and records that host-container discrepancy explicitly. Scribd’s
surrounding HTML changes between requests, so the transcript hash covers
39,717 bytes of normalized text
from the document title through the `Page 15 of 15` footer, after decoding HTML
entities, converting document line breaks, removing tags, trimming lines, and
joining them with LF. Two independent fetches produced the same normalized hash
while their raw HTML hashes differed. No claim is made that the mirror preserves
Apple’s original PDF byte sequence.

The fixed-section boundary is exact at normalized lines 94–188.
Its component groups contain 37 records in total: App Store 1, Apple Pay 1,
Apple Pencil 1, Audio 1, Binary Compatibility 1, CarPlay 2, CoreImage 1,
Exchange 1, iBooks 1, iCloud Backup and Restore 1, Keyboards 1, Lock Screen 1,
Messages 8, Music 1, Notes 1, Phone 6, Photos 1, Privacy 1, Siri 2, SiriKit 3,
and UIKit 1. All 37 selected Beta 3
occurrences reconcile to those groups and exact locators.

## Exact evidence gaps

- No complete, publicly inspectable Apple-authored milestone document was
  retained in this audit for Beta 2, Beta 4, Beta 5, Beta 6, Beta 7, Beta 8,
  or GM. Those routes remain timeline-only.
- Public is already owned by `apple-ios-10.json` and is untouched.
- Apple’s prerelease documentation root resolves only to a later archived
  final state. The Wayback CDX index returned no usable 2016 capture for the
  exact prerelease root or article.
- No complete first-party build-number set was independently retained. This
  batch creates no build documents and makes no build assertion.
- Beta 1 has no earlier state against which to compute a diff. Its entries are
  explicitly labeled a first-document baseline.
- Beta 3 generic known issues and functionality exclusions may be cumulative.
  Only the exact fixed section is attached to that route.
- Both Apple-authored prerelease artifacts survive through third-party mirrors.
  Their occurrences remain explicitly marked as corroborated and preserve the
  mirror provenance after editorial approval.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS SDK Release Notes for iOS 10 Beta (preserved PDF)](https://archive.org/download/ios-10-beta-release-notes/315770725-IOS-10-Beta-Release-Notes.pdf) — Internet Archive document preservation; archive.
- [All the Apple Developer links you need from WWDC16](https://gist.github.com/vdt/79891de1b602ab284e3d8f81ef59b8d3) — GitHub Gist; community.
- [iOS 10 Beta 3 Release Notes (Apple-authored transcript)](https://www.scribd.com/document/318576354/iOS-10-Beta-3-Release-Notes) — Scribd document mirror; archive.
- [Contemporaneous iOS 10 Beta 3 release-note link](https://forums.whirlpool.net.au/archive/2539505?p=-1) — Whirlpool Forums; community.
- [iOS 10.0 Release Notes](https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-10.0/) — Apple Developer Documentation Archive; firstPartyDocumentation.

## Closure guards

- Exact comparison against the local iOS 10.0 seed record and all ten milestones
- Exact two-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 67 occurrences resolve to exactly
  67 stable local definitions
- Explicit rejection of identity, build, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `0bca32410fa5aa5bae7b149d10485209d70f543de7967fba053989b1df84bd19`

## Publication and validation record

The generator's seed, route, collision, review-state, evidence-boundary, source,
and citation guards pass before either artifact is written.

Independent editorial and evidence review:

- both event articles and all 67 occurrences are
  `editoriallyVerified`, were approved at `2026-07-30T09:44:24Z`, and are indexable
- the exact 265,117-byte Beta 1
  PDF reproduced SHA-256
  `bb57b2b8b876cc40fd1874d5f1ae085f885fc776da3906da91604bbdfbc8b46e`;
  its 20-page tree and Internet Archive SHA-1
  and MD5 metadata match
- the 37,501-byte OCR artifact
  reproduced SHA-256
  `62ff46f46e197f5dd00a34afa611aee2da9bf8c5d5d66b9e2eb1ea024305feb1`
  and all 30 selected Beta 1
  page-and-component locators passed
- the Gist API preserves the exact 2016-06-14T14:13:28Z timestamp and Apple PDF
  path; its raw payload reproduced SHA-256
  `e7b5aac7bf7aed153a580579e8618b3208a45bafc31c4107b24cf2b1929cef70`
- the 39,717-byte
  normalized Beta 3 transcript reproduced SHA-256
  `b20309f0c6eb719b6a3d2d16ed97a2bcc0c49979badbbcea3049a794a94233e0`
  across raw-wrapper changes; its exact fixed boundary is lines
  94–188, its
  component groups total 37 records, and
  all 37 locators reconciled
- the Whirlpool raw page reproduced SHA-256
  `9227aa89f9e1e56d882ad2789acede823ac2cf9617c56862be5f647bbc19e8a5`;
  post 355 by `NeonVoid777` retains the exact encoded PDF filename and
  2016-07-18T18:24:54Z timestamp
- Apple's final-state archive reproduced SHA-256
  `b080c29354c91ffad187a1a2780cbf21238b1957e69ae8dc3c2b3ec81fc1e0ab`
- the independent copyright scan found a maximum contiguous reader-facing
  overlap of 5 words

Publication receipt:

- applied production plan: `ef165550f3ff58c6bc71371557bf155acf6620e0b1594ee1a0f43bcb3c671797`
- reviewed plan artifact SHA-256: `9b9b8d76b7edaad820009571eb233c3100b78a8ceb3024bbbb1a8cf8609b6f27`
- rollback artifact SHA-256: `41e398670535d097c4368b254fd9aebcddc13c074c9d950064fc5cebf1afd15c`
- applied plan contents: 72 creates,
  2 revision-guarded patches,
  2,080 unchanged documents, and a
  179,219-byte mutation payload
- create split: 5 sources and
  67 stable change documents; zero versions, events, or
  builds were created
- Sanity transaction: `tt1fSB5HY9GAB0YLyyeXd3`
- receipt SHA-256: `37705622accf420385670bca4cd3e4a28f7e886bc8d00e278317f23e0e7709ff`
- immediate post-publication zero plan:
  `8117047a945819022cca59319fd4e3cadcc345bb819a3efb4515c2ea43dc4d7f`;
  0 creates,
  0 patches,
  2,154 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `1d277424d33259e00a0eb8d0cc753628fcc82c5f282397ce10ba15a9572961b5`
- zero-plan rollback artifact SHA-256:
  `c6ccf91beeb974b50a05264dfa9df2edac368fa1750e9ff85fd1a989e3f16681`

Production coverage after publication:

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 402 full articles,
  256 source-linked records, and
  1,321
  timeline-only records
- 553 appearances have
  approved structured changes

### First-document baseline correction

A focused production correction was reviewed at
`2026-07-30T14:12:29Z`. It relabeled all
30 Beta 1 occurrences from
`delta` to `cumulative`, matching the already-published explanation that
Beta 1 is the first retained document rather than a comparison with an earlier
state. It also replaced one shortened Beta 3 Notes locator with the exact
source wording. The audit proved that no reader-facing article text or release
fact changed.

- correction plan: `dc7bcfab95249527a8dfcd2e9d82cd3c84387434842a50cf889bf590d069e08d`
- reviewed plan artifact SHA-256:
  `5453bac50c3a09babeed6cfe207e6a533d78d9f2e60db50a65d97b6cfccfb87a`
- rollback artifact SHA-256:
  `28a8654b6c9379a2a3bce5d9387e9feccd1b3206cc121545cd2b66b3ac383904`
- exact plan contents: 0 creates,
  3 revision-guarded patches,
  2,240 unchanged documents,
  and a
  97,477-byte
  mutation payload
- Sanity transaction: `eOgq1Ovu5XNUv1qNFVRqhz`
- receipt SHA-256: `a3281d11d6ec58fd5a3b6d006b291f4958b0dc6b0854426df70f128591bb30cc`
- immediate zero-residual plan: `50cae7d69ddbdef8edb1bb079209865da10eee5923f6555b845666c1ec08008f`;
  0 creates, 0 patches,
  2,243 unchanged
  documents, and a 16-byte payload
- zero-plan artifact SHA-256:
  `6e7e5bf3ea8c1803bdafb13f0e75abaad2155ba32093e0d5f4bfb55ccbe66d34`
- zero-plan rollback artifact SHA-256:
  `bbe0896065684fe48733eefb9630ad02e8bc27b8c80759fbb3b168b3ca27bd8a`
- post-correction coverage:
  410 of
  410 full versions and
  515 full,
  256 source-linked, and
  1,297
  timeline-only appearances; 666
  appearances have approved structured changes

## Settled canonical route verification

Both published routes were fetched independently from the running local site.
Each response returned the full archival article, structured change index,
References, and its primary source. Neither response returned placeholder copy
or a `noindex` directive.

| Canonical route           | HTTP | Full article | Changes | References | Primary source | Placeholder | Noindex |
| ------------------------- | ---: | ------------ | ------- | ---------- | -------------- | ----------- | ------- |
| `/apple/ios/10.0/beta-1/` |  200 | yes          | yes     | yes        | yes            | no          | no      |
| `/apple/ios/10.0/beta-3/` |  200 | yes          | yes     | yes        | yes            | no          | no      |

Final verification on 2026-07-30:

- `npm run research:validate`:
  73 batches validated; this batch reports
  2 events, 67 change occurrences,
  5 sources, and 217 citation references;
  4,214 change keys remain
  globally consistent
- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests
  passed
- all 30 Beta 1 page-and-component checks
  and 37 Beta 3 fixed-section locator
  reconciliations passed
- independent copyright-similarity scan: maximum contiguous overlap of
  5 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  `0bca32410fa5aa5bae7b149d10485209d70f543de7967fba053989b1df84bd19`
- final production dry run after the baseline correction reproduced 0 creates,
  0 patches,
  2,243 unchanged
  documents, the 16-byte payload, and plan
  SHA `50cae7d69ddbdef8edb1bb079209865da10eee5923f6555b845666c1ec08008f`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-10-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-10-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-10-prerelease.mjs scripts/research-batches/apple-ios-10-prerelease.json scripts/research-batches/apple-ios-10-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-10-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
