# Apple iOS 5 point-release prerelease archive batch

## Result

`apple-ios-5-point-prerelease.json` is the approved archive batch for the iOS 5.0.1 and 5.1
prerelease cycles. It is isolated from the completed iOS 5.0 archive batch
and does not alter the hardcoded seed timeline or any existing Public event
record. Shared change-definition citation unions are disclosed separately in
the production plan below.

- 5 identity-backed event creates and no release-version overlays
- 29 selected change occurrences across
  25 canonical definitions
- 9 definitions reused byte-for-byte from their existing
  approved or completed owners; 16
  new definitions use the `ios5-point-prerelease-` namespace
- 15 declared and used sources with 126 citation
  references
- zero builds, build guesses, seed edits, or Public event records
- every event is `editoriallyVerified`, `approved`, and
  `isIndexable: true`

## New historical route closure

| Milestone        | New route                  | Appearance date | Selected changes | Fixed | Current known |
| ---------------- | -------------------------- | --------------- | ---------------: | ----: | ------------: |
| iOS 5.0.1 Beta 1 | `version-ios-5-0-1/beta-1` | 2011-11-02      |                6 |     3 |             0 |
| iOS 5.0.1 Beta 2 | `version-ios-5-0-1/beta-2` | 2011-11-04      |                1 |     1 |             0 |
| iOS 5.1 Beta 1   | `version-ios-5-1/beta-1`   | 2011-11-28      |               12 |     1 |             9 |
| iOS 5.1 Beta 2   | `version-ios-5-1/beta-2`   | 2011-12-12      |                8 |     4 |             2 |
| iOS 5.1 Beta 3   | `version-ios-5-1/beta-3`   | 2012-01-09      |                2 |     0 |             0 |

Only exact source-defensible identities are represented. The generator rejects
Public, GM, and every 5.1.1 prerelease route.

## Evidence method

1. iOS 5.0.1 Beta 1 uses contemporaneous release-day reporting for its
   November 2 identity and preserves the surviving Apple Developer page's
   November 3 display date as an explicit one-day ambiguity. Four maintenance
   items reuse approved Public definitions; a later contemporary recap
   identifies the Smart Cover repair, and Apple directly documents the storage
   retention API.
2. Beta 2 has no retained public changelog. Only an activation repair reported
   against the prior seed is structured, with `reported` evidence state and
   `undocumented` documentation status.
3. iOS 5.1 Beta 1 uses a three-page, Apple-authored PDF preserved by a document
   mirror. PDFKit checks its title, metadata date, pages, and every selected
   locator. Twelve records describe selected milestone state rather than a
   copied changelog. Three Xcode and developer-tools records are labeled as
   host-tool context rather than on-device iOS behavior.
4. Beta 2 uses eight explicit `NEW` or `FIXED` entries in a contemporaneous
   developer-note reproduction. The raw audit requires exactly four of each
   marker in the article body. Its four Xcode records remain explicitly scoped
   to the accompanying host toolchain.
5. Beta 3 is limited to a documented backup-exclusion API and a reported 3G
   setting observation. Later sources show continued beta tooling, internal
   partner GM testing, and no final developer build before Public.

## Raw-source audit ledger

The HTML and PDF bodies were downloaded on 2026-07-30 to a temporary,
uncommitted audit directory. Hashes cover the exact response bytes.

| Raw artifact                           |    Bytes / pages | SHA-256                                                            | Use                                            |
| -------------------------------------- | ---------------: | ------------------------------------------------------------------ | ---------------------------------------------- |
| Apple Developer 5.0.1 Beta 1 HTML      |          106,041 | `b063eaa5628be42315031ce3d46b99efda129266e7b434743814e3bda2ede5ec` | Beta 1 API and date ambiguity                  |
| MacRumors 5.0.1 Beta 1 HTML            |          123,486 | `1078b75d13f6783a8ac4c8bd252f0815224c853538ddd2fd9d3010d69a090ad0` | Beta 1 identity and maintenance items          |
| 9to5Mac 5.0.1 Beta 2 HTML              |          146,642 | `a87cd740fba1409cbbc32eb1719fb730cbeddd196c00e1a127cc65fa318422f7` | Smart Cover recap and no-changelog boundary    |
| MacRumors 5.0.1 Beta 2 HTML            |          129,309 | `da125c56d0c432112027ee2511c56d298df40f5c771cc812cd843afb90bfb3e8` | Beta 2 identity                                |
| MacStories 5.0.1 Beta 2 HTML           |           43,121 | `c58bf1792768f43d08665e6c67b76500865b8d09fcf20c014182084cb55a43d5` | Activation report and scope boundary           |
| Apple Developer 5.0.1 Public HTML      |          105,974 | `f14c8c0fed165becd8e07ec9684577ca9c69392be45c7ff1dadd06ad445df815` | Public boundary                                |
| MacRumors 5.1 Beta 1 HTML              |          123,935 | `1997bc042703af9c2237f0054158f1e5c68e64d0d9b110217eb950d9dadd7a82` | Beta 1 identity                                |
| Apple-authored 5.1 Beta 1 PDF mirror   | 76,179 / 3 pages | `75160cd989483602688931401a452898064d03bbbbdd4fbf99b67bfd2652b35e` | Beta 1 developer notes                         |
| MacRumors 5.1 Beta 2 HTML              |          124,416 | `f676e78a8318e42872e17548a6722b25cedc29fff7824229c74068457ad25f8f` | Beta 2 identity, Photo Stream, build ambiguity |
| Cult of Mac 5.1 Beta 2 HTML            |          296,196 | `98e912d8c92fbfcb83298e39c447edf88e36df68024fbe56c93433fa1d96719a` | Beta 2 marker transcript                       |
| MacRumors 5.1 Beta 3 HTML              |          129,987 | `e3c2f37ccba06be3979c05f8fe7ffc34f34a90bbc1da9bc7e26e3ad89f72680b` | Beta 3 identity, changes, build ambiguity      |
| Apple Developer 5.1 beta-boundary HTML |          107,554 | `87164502a0966d56eb00825555bda27b0fad1b8e910b552b5b93f6b6f7bde659` | February beta state                            |
| MacRumors internal-GM HTML             |          124,090 | `ac31f2de3beea6d23e65e3d118461132440e8dadaede02adac5459349a6d75b8` | Partner-only GM boundary                       |
| iMore Public walkthrough HTML          |        1,094,911 | `208c0865c36c514dc014327c2bda53298ef12ce6f3c5a908535b502d4583124a` | No developer-final-build boundary              |
| Apple Support iOS 5 HTML               |        1,164,087 | `5d61d349285f4629cb30e476c63cc2c0e3977ff2288694e8046aa4d784ee4a71` | Consumer 5.1 / 5.1.1 boundary                  |

Raw evidence is not committed. The HTML audit verifies bytes, hashes, page
markers, every non-PDF citation locator, event counts, and copyright overlap.
The PDFKit audit separately validates the retained PDF and its citation
locators.

## Copyright and editorial method

Every event summary, heading, article paragraph, occurrence title, canonical
summary, occurrence summary, and verification method is scanned against each
retained source independently. The batch uses original synthesis and
retains product or API identifiers only where they are necessary to identify a
claim. The automated ceiling is five contiguous words.

Third-party reproductions are credited as preservation or journalism, never as
first-party hosting. The structured pages select claims and link to sources;
they do not republish source prose or full release-note lists.

## Exact evidence gaps

- The first iOS 5.0.1 seed appeared in release-day reporting on November 2,
  while Apple's surviving developer-news page displays November 3. The event
  uses November 2 and records the mismatch instead of silently blending dates.
- No public Beta 2 changelog for 5.0.1 was retained. The single structured
  repair remains reported and undocumented.
- The detailed 5.1 Beta 1 artifact is an Apple-authored PDF preserved by a
  third-party mirror, not a live first-party download.
- Two contemporaneous pages identify the 5.1 Beta 2 build with different final
  characters: `9B5127c` and `9B5127a`. No build document is created.
- No developer-distributed iOS 5.1 GM identity was recovered. Internal carrier
  and partner testing is not promoted into a public developer route.
- No exact iOS 5.1.1 prerelease identity was recovered. The batch creates no
  beta, GM, or inferred route for 5.1.1.
- The selections are not exhaustive copies of cumulative release notes.
  iOS 5.1 Beta 1 retains ten unmarked or explicitly older states as labeled
  cumulative context; only its defensible milestone changes remain deltas.

## Source ledger

All sources were accessed on 2026-07-30.

- [New File Attribute for Managing Data Backups](https://developer.apple.com/news/?id=11032011a) — Apple Developer; developerDocs.
- [Apple Seeds iOS 5.0.1 Beta: Multitasking Gestures for iPad 1, Battery Life Improvements](https://www.macrumors.com/2011/11/02/apple-posts-ios-5-0-1-beta-for-developers/) — MacRumors; journalism.
- [Apple Issues iOS 5.0.1 Beta 2](https://9to5mac.com/2011/11/04/apple-seeds-ios-5-beta-2/) — 9to5Mac; journalism.
- [Apple Seeds iOS 5.0.1 Beta 2 to Developers](https://www.macrumors.com/2011/11/04/apple-seeds-ios-5-0-1-beta-2-to-developers/) — MacRumors; journalism.
- [Apple Releases iOS 5.0.1 Beta 2](https://www.macstories.net/news/apple-releases-ios-5-0-1-beta-2/) — MacStories; journalism.
- [iOS 5.0.1 Now Available to Customers](https://developer.apple.com/news/?id=11102011a) — Apple Developer; firstPartyAnnouncement.
- [Apple Begins Seeding of iOS 5.1 Beta, Xcode 4.3 to Developers](https://www.macrumors.com/2011/11/28/apple-begins-seeding-of-ios-5-1-beta-xcode-4-3-to-developers/) — MacRumors; journalism.
- [iOS SDK Release Notes for iOS 5.1 Beta 1 (preserved PDF)](https://iszene.com/uploads/9ul0quu9psp8mp6ewa3.pdf) — iSzene document mirror; archive.
- [Apple Seeds iOS 5.1 Beta 2 to Developers, Enables Photo Stream Photo Deletion](https://www.macrumors.com/2011/12/12/apple-seeds-ios-5-1-beta-2-to-developers-enables-photo-stream-photo-deletion/) — MacRumors; journalism.
- [Apple Releases iOS 5.1 Beta 2 to Developers](https://www.cultofmac.com/news/apple-releases-ios-5-1-beta-2-to-developers) — Cult of Mac; journalism.
- [Apple Seeds iOS 5.1 Beta 3 to Developers, Restores 'Enable 3G' Toggle](https://www.macrumors.com/2012/01/09/apple-seeds-ios-5-1-beta-3-to-developers/) — MacRumors; journalism.
- [Xcode 4.3 Now Available on the Mac App Store](https://developer.apple.com/news/?id=02162012b) — Apple Developer; developerDocs.
- [Testing on iOS 5.1 Golden Master Reportedly Complete Ahead of iPad 3 Launch](https://www.macrumors.com/2012/03/06/testing-on-ios-5-1-golden-master-reportedly-complete-ahead-of-ipad-3-launch/) — MacRumors; journalism.
- [iOS 5.1 for iPhone and iPad Walkthrough](https://www.imore.com/ios-5-1-review) — iMore; journalism.
- [About iOS 5](https://support.apple.com/en-us/102998) — Apple Support; firstPartyDocumentation.

## Closure guards

- exact comparison against the four local iOS 5 seed records
- immutable SHA check for the completed iOS 5.0 prerelease archive:
  `f045f59eb1f8d159cb9c24892821d43e4050e57c3e0b516c238cb0d006bcde66`
- exact five-event route, identity, date, channel, sequence, and count allowlist
- explicit rejection of Public, GM, and 5.1.1 prerelease events
- approved/indexable ownership checks for the existing 5.0.1, 5.1, and 5.1.1
  Public pages
- zero release-version overlays and zero builds
- route and stable-ID collision scan across all other research-batch JSON plus
  `apple-launch-content-2026.json`
- strict owner and byte-equality guards for 9 shared
  definitions; every new key is collision-free and cohort-prefixed
- exact ten-record iOS 5.1 Beta 1 cumulative-context allowlist
- exact four-history Beta 1 known-issue to Beta 2 fix transition allowlist
- exact seven-occurrence Xcode host-tool context allowlist
- complete unique source declaration/use closure
- deterministic formatted JSON SHA-256: `971161fb1de8c872a033053242e9360a14ee2951c16e064579dc9c5e3f987104`

## Editorial approval and validation record

- provenance: `editoriallyVerified`
- editorial status: `approved`
- indexing: enabled
- reviewed at: `2026-07-30T13:22:09Z`
- independent substantive review: clean after cumulative-state,
  known-to-fixed-history, host-tool-scope, evidence-label, and source-custody
  corrections

- repository validation: 73 batches;
  4214 globally consistent change keys
- focused ingestion/manifest tests:
  19
- full repository suite: 131
- HTML locator assertions: 88
- PDF locator assertions: 38
- longest citation-locator excerpt:
  16 words
- copyright scan:
  151 reader-facing fields;
  maximum overlap 5 words
- independent live re-fetch: all
  15 declared sources available;
  9 raw artifacts matched byte-for-byte,
  12 selected article boundaries
  matched exactly, 14 marker sets
  reproduced, and all 15 evidence
  boundaries passed

## Production dry plan

- status: applied and zero-residual verified on 2026-07-30
- production dry plan: 35 creates,
  9 patches,
  2131 unchanged
- create split: 5 events,
  14 sources,
  16 change documents
- patch boundary: nine existing approved change documents receive citation unions plus refreshed approved-review timestamps; all semantic definitions remain unchanged, and there are zero source, version, event, or build patches
- mutation payload: 88309 bytes
- production plan SHA: `3424cdf842efcb532a0ff1931541bc0c9c3ba7f858fd37a57c8eb2d87831fc23`
- plan artifact SHA-256: `2fdf9270704c150d7a9d70e19eea2618fc825665a550d49d800831a3ea3f4fab`
- rollback artifact SHA-256: `217fd55027e485f534632ba5a685b64f50cf994e9722cfbb186189b98d4eea60`
- rollback coverage: all 35 create IDs and all
  9 full restore documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: `F0eE6eK5XyVXtlnaoycGEX`
- applied plan SHA: `3424cdf842efcb532a0ff1931541bc0c9c3ba7f858fd37a57c8eb2d87831fc23`
- receipt SHA-256: `ea1165b5bb47762c4ecda93efbb5051e071f5295bb261a4c8b65d6e095bac058`
- immediate post-publication zero plan:
  `95f67c223eeeaa329e42b8669c814df4f248ffdfb07c378529cfcd141a4523b4`; zero creates, zero patches,
  2,175 unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `33c5a108227a0e873312e5fc9513fd95bc6d390869e84541d77dc4d0496b9f7f`
- zero-plan rollback artifact SHA-256:
  `9e7fb02147b39f6097b57d4c36906e0535cba34725bdc7a9ac3b02e211b679b6`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 2,032
  appearances:
  479 full articles,
  256 source-linked records,
  and
  1,297
  timeline-only records
- 630 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all three archival article sections, every expected structured
change title, References, its first cited source, and an `index, follow`
directive. No route returned placeholder copy or a `noindex` directive.

| Canonical route            | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots        |
| -------------------------- | ---: | ---------------: | ---------------: | ---------- | ------------ | ----------- | ------------- |
| `/apple/ios/5.0.1/beta-1/` |  200 |              3/3 |              6/6 | yes        | yes          | no          | index, follow |
| `/apple/ios/5.0.1/beta-2/` |  200 |              3/3 |              1/1 | yes        | yes          | no          | index, follow |
| `/apple/ios/5.1/beta-1/`   |  200 |              3/3 |            12/12 | yes        | yes          | no          | index, follow |
| `/apple/ios/5.1/beta-2/`   |  200 |              3/3 |              8/8 | yes        | yes          | no          | index, follow |
| `/apple/ios/5.1/beta-3/`   |  200 |              3/3 |              2/2 | yes        | yes          | no          | index, follow |

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-5-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-5-point-prerelease.mjs scripts/research-batches/audit-ios5-point-prerelease-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-5-point-prerelease.mjs scripts/research-batches/apple-ios-5-point-prerelease.json scripts/research-batches/apple-ios-5-point-prerelease.md scripts/research-batches/audit-ios5-point-prerelease-html-states.mjs
node scripts/research-batches/audit-ios5-point-prerelease-html-states.mjs scripts/research-batches/apple-ios-5-point-prerelease.json /private/tmp/apple-ios5-point-prerelease.RdCHUu
osascript -l JavaScript scripts/research-batches/audit-ios5-point-prerelease-pdf-state.jxa scripts/research-batches/apple-ios-5-point-prerelease.json /private/tmp/apple-ios5-point-prerelease.RdCHUu
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-5-point-prerelease.json
```
