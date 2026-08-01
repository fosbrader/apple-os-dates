# Apple iOS 12 prerelease archive batch

## Result

`apple-ios-12-prerelease.json` is the reviewed overlay for the existing iOS 12.0 Beta 3
route. The batch is intentionally narrower than the 14-route local prerelease
timeline because only Beta 3 has a complete, publicly inspectable Apple-authored
document with exact milestone identity, component headings, status headings, and
issue identifiers.

- 1 substantive event overlay and no release-version overlays
- 37 milestone-specific change occurrences across
  37 stable, collision-checked definitions
- 3 declared and used sources with 121 citation
  references
- zero builds, build-number claims, route creation, Public-route changes,
  community-observation changes, or administrative identity changes
- the event is `editoriallyVerified`, approved at `2026-07-30T09:30:44Z`, and
  `isIndexable: true`

## Reviewed route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 3    | `beta-3`       |               37 |

The other 13 iOS 12.0 timeline milestones remain outside this batch.

## Evidence method

1. Apple's migrated DocC page and raw JSON were audited. The current payload is
   titled “iOS 12 Release Notes,” contains 28 list records and 17 distinct
   eight-digit issue identifiers, and represents the final SDK state rather than
   a Beta 3 revision.
2. Internet Archive's uncollapsed CDX index for that raw DocC URL begins in
   2022 and contains eight captures through 2025. It therefore cannot establish
   any 2018 prerelease boundary.
3. A complete public text rendering of the Apple-authored Beta 3 PDF retains the
   “iOS 12 beta 3 Release Notes” title, Apple Developer identity, July 3, 2018
   footer, component headings, exact New Issues and Resolved Issues headings, and
   issue identifiers.
4. A contemporaneous July 3 MacRumors thread independently lists the matching
   `iOS_12_beta_3_Release_Notes.pdf` attachment and its 162.8 KB size. The
   thread is used only for document identity and timing. None of its user-authored
   feature, build, modem, carrier, or bug observations enter the manifest.
5. Selection is limited to records with a retained issue identifier under an
   exact New Issues or Resolved Issues heading. Generic Known Issues, generic New
   Features, deprecations, and issue-less bullets are excluded.

## Selected findings

The retained Beta 3 delta covers older-device update recovery, the Weather widget,
Universal Links, several third-party compatibility fixes, notification contrast,
AirPods pause behavior, ARKit data migration, Safari USDZ previews,
authentication cookies, Calendar, CallKit, CarPlay, iWork collaboration, phone
and FaceTime behavior, Screen Time, Siri integrations, Spotlight ranking, and
Wallet stability.

The page is a structured historical index of Apple's developer-facing changes,
not a claim that these 37 records exhaust every user-visible difference in the
build.

## Raw and mirror audit ledger

| State                                    | Capture or publication | Title                       |                       Records |               Issue IDs | SHA-256                                                            | Use                                                             |
| ---------------------------------------- | ---------------------- | --------------------------- | ----------------------------: | ----------------------: | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| First retained Apple raw DocC state      | `20220202204600`       | iOS 12 Release Notes        |                            28 |                      17 | `27cc83e8c2e6d0a907d7ba46b069ebb367a73b57f41cf4af6a8ae8d214b7277e` | Boundary audit only; postdates Public by more than three years  |
| Retained Apple raw DocC comparison state | `20250609134847`       | iOS 12 Release Notes        |                            28 |                      17 | `1343675a9b752fff27df76b731c7ea5361ab0a12731686278e7152411faed7d2` | Boundary audit only; same issue-ID inventory as the first state |
| Current Apple raw DocC state             | accessed 2026-07-30    | iOS 12 Release Notes        |                            28 |                      17 | `7032c9792bbdea9049fea25424f8a7ce1cac48f2c31b31bc7acf94ba5c08681e` | Boundary audit only; final SDK state                            |
| Beta 3 public PDF transcript page        | accessed 2026-07-30    | iOS 12 beta 3 Release Notes | 37 selected milestone records | 38 asserted identifiers | `0990fc16278d8389741d89b1b577f53bbbb23861c80690addd3ee561e69a59d0` | Exact Beta 3 evidence; normalized transcript text               |

Uncollapsed CDX inventory for Apple's raw DocC URL:

| Raw timestamp UTC | CDX digest                         | CDX length |
| ----------------- | ---------------------------------- | ---------: |
| `20220202204600`  | `KLDN3OCTWXRPZSSFO3VBN2L2BH5FMYMA` |      6,019 |
| `20220505170809`  | `SXUENRAVAG5NFO7BHAYA4FY5ASL36OLU` |      6,378 |
| `20230331155447`  | `JV56OIGTOMDRCADNF6IKZ4JC3SIXBDU6` |      6,493 |
| `20231019131244`  | `HLQFFQ3UT2HXIKF7LQNMLI3CGPHG7AXG` |      6,570 |
| `20240421153618`  | `GFKL7SQNX73LRGUCHQTM42RC6GCTTQHZ` |      6,670 |
| `20250609134847`  | `UQ2F7W44MLWI2EXY6DH42GVF5Q4JA2LX` |      7,120 |
| `20250812121101`  | `6SUTEYBXRYBW5YCXGBNV3YFKS6Y4YWZP` |      7,431 |
| `20251023065421`  | `ARNDLRX53KQUFO2O6AKROJBHHKO4NWYX` |      7,407 |

The first and June 2025 raw replays each contain 28 list records and the same
17 issue identifiers. A structural comparison found zero issue-ID additions or
removals and one render-only change: the later payload inserts a DocC reference
identifier before `INUIAddVoiceShortcutButton`; the surrounding note and issue
`43251696` are unchanged. None of the 38 Beta 3 identifiers selected here
survives in the 17-identifier final payload, which is why the final document is
not used for Beta 3 attribution.

Scribd's surrounding HTML changes between requests. The transcript hash therefore
covers 16,484 bytes of normalized text from the document title through the
`Page 9 of 9` footer, after decoding HTML entities, converting document line
breaks, removing tags, trimming lines, and joining them with LF. Two independent
fetches produced the same normalized hash while their raw HTML hashes differed.
The original PDF file is not checked into the repository and no claim is made
that the mirror preserves Apple's original byte sequence.

## Exact evidence gaps

- Beta 1, Beta 2, Beta 4 through Beta 12, and GM lack a complete,
  publicly inspectable Apple-hosted or archived state in this audit. Their
  existing routes remain timeline-only.
- The Apple download CDN is authentication-gated and the Wayback CDX index has no
  retained raw 2018 state for the migrated DocC URL.
- Public is already owned by `apple-ios-12.json` and is untouched.
- No complete first-party build-number set was independently retained. This batch
  creates no build documents and makes no build assertion.
- Generic Known Issues can describe carried state instead of a Beta 3 delta, so
  they are not assigned to this route.
- The Apple-authored PDF survives through third-party mirrors. That provenance is
  represented as corroborated evidence and must be reviewed before indexing.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS 12 beta 3 Release Notes (Apple-authored PDF transcript)](https://www.scribd.com/document/383131499/IOS-12-Beta-3-Release-Notes) — Scribd document mirror; archive.
- [Contemporaneous attachment listing for Apple iOS 12 Beta 3 notes](https://forums.macrumors.com/threads/ios-12-beta-3-bug-fixes-changes-and-improvements.2125961/) — MacRumors Forums; community.
- [iOS 12 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12-release-notes) — Apple Developer; firstPartyDocumentation.

## Closure guards

- Exact comparison against the local iOS 12.0 seed record and all 14 milestones
- Exact one-route allowlist with explicit exclusion of Public and every
  unsupported prerelease route
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 37 occurrences resolve to exactly
  37 stable local definitions
- Every selected occurrence carries one or two eight-digit Apple issue IDs
- Explicit rejection of identity, build, TestFlight, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `0b04d1a3acce7ea0cb5354336eb77ae4037bc7b8df21a1cceba34be2d8f2f87a`

## Publication and validation record

The generator's seed, route, collision, review-state, issue-locator, source, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- the 16,484-byte
  normalized Beta 3 transcript reproduced SHA-256
  `0990fc16278d8389741d89b1b577f53bbbb23861c80690addd3ee561e69a59d0` across independent fetches
- all 37 occurrences resolved across
  38 unique Apple issue IDs; all
  38 exact component, status-heading, and
  issue-ID assertions passed with zero failures
- the independent reader-facing copyright scan found a maximum contiguous
  overlap of 4 words between
  editorial fields and the Apple-authored transcript
- the article and all 37 occurrences were approved at
  `2026-07-30T09:30:44Z`

Publication receipt:

- applied production plan: `f3734ba564d3fe2c016e2df0193d75cefbf91479d103319060f67c81791ea33b`
- reviewed plan artifact SHA-256: `6abf05ce1cd88c85005e96238772c735abf8cbf18a52b3790bdcf6f916d1ea4b`
- rollback artifact SHA-256: `838d71541958eba1d481f496d06a43cdd31127b31fa23c4024c3bb9e240e00d1`
- applied plan contents: 39 creates,
  2 revision-guarded patches,
  2,081 unchanged documents, and a
  98,506-byte mutation payload
- create split: 2 sources and
  37 stable change documents; zero versions, events, or
  builds were created
- Sanity transaction: `eOgq1Ovu5XNUv1qNFUzqON`
- receipt SHA-256: `07bad5e118845e37c8a65f9c3bd097edff5c57b986bb4c60015db3d211714953`
- immediate post-publication zero plan:
  `78ec2263431a2277d14e54508e2feb28bf279a66ea4065f086281923e397ce31`;
  0 creates,
  0 patches,
  2,122 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `edc0d925c6f764c24f18fc9e6a221e79b4dbe4da0c3518d1a3357956e0738844`
- zero-plan rollback artifact SHA-256:
  `e1b9dca10477413e910c7c9f55d8f2dfd4ea422850ab677e8b9dd50b5ea93c10`

Production coverage after publication:

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 400 full articles,
  256 source-linked records, and
  1,323
  timeline-only records
- 551 appearances have
  approved structured changes

## Settled canonical route verification

The published route was fetched independently from the running local site. Its
response returned the full archival article, evidence and change sections,
References with the Scribd transcript source, and `index, follow`; it returned
neither a timeline placeholder nor `noindex`.

| Canonical route           | HTTP | Full article | Evidence | Changes | References | Scribd | Index |
| ------------------------- | ---: | ------------ | -------- | ------- | ---------- | ------ | ----- |
| `/apple/ios/12.0/beta-3/` |  200 | yes          | yes      | yes     | yes        | yes    | yes   |

Final verification on 2026-07-30:

- `npm run research:validate`:
  57 batches validated; this batch reports
  1 event, 37 change occurrences,
  3 sources, and 121 citation references;
  3,130 change keys remain
  globally consistent
- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests
  passed
- all 38 exact evidence assertions passed with
  zero failures
- independent copyright-similarity scan: maximum contiguous overlap of
  4 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 is `0b04d1a3acce7ea0cb5354336eb77ae4037bc7b8df21a1cceba34be2d8f2f87a`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,122 unchanged
  documents, the 16-byte payload, and
  plan SHA `78ec2263431a2277d14e54508e2feb28bf279a66ea4065f086281923e397ce31`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-12-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-12-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-12-prerelease.mjs scripts/research-batches/apple-ios-12-prerelease.json scripts/research-batches/apple-ios-12-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-12-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
