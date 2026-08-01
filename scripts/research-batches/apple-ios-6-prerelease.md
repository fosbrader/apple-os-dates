# Apple iOS 6 prerelease archive batch

## Result

`apple-ios-6-prerelease.json` is the editorially approved archive overlay for four
historically defensible iOS 6.0 prerelease routes missing from the local seed.

- 4 identity-backed event creations and no release-version overlays
- 79 milestone-specific occurrences across
  64 stable, collision-checked definitions
- 10 declared and used sources with 426 citation references
- zero builds, build-number claims, or Public-route changes
- every route is `editoriallyVerified`, approved at `2026-07-30T11:45:36Z`, and
  explicitly `isIndexable: true`

## Approved route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| -------- | --------- | --------- | --------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`  | 2012-06-11      |               31 |
| iOS      | Beta 2    | `beta-2`  | 2012-06-25      |               16 |
| iOS      | Beta 3    | `beta-3`  | 2012-07-16      |               15 |
| iOS      | Beta 4    | `beta-4`  | 2012-08-06      |               17 |

The local seed contains only Public on 2012-09-19. Public is already owned by
`apple-ios-6.json` and remains untouched.

## Evidence method

1. Apple’s June 11 announcement establishes Beta 1 availability. Two complete,
   independently hosted transcriptions preserve the Apple-authored developer
   notes. Thirty-one narrow records form a first-document baseline; they are not
   represented as changes first introduced on that date unless the note itself
   supports that status.
2. The Beta 2 transcript contains 20 explicit fixed headings. Sixteen are
   retained: two Apple TV records are outside this batch, and two contradictory
   bodies are excluded rather than being converted into false deltas.
3. The Beta 3 transcript contains 18 explicit fixed headings. Fourteen
   non-Apple-TV, non-carry-forward entries become 15 atomic records because the
   two distinct Reminders failures are kept separate.
4. Beta 4 has two complete developer-note transcriptions. Eight non-Apple-TV,
   non-carry-forward fixed records and nine atomic records from six current
   developer-note change groups are retained. A built-in YouTube application
   removal reported independently by MacRumors and Engadget is the only item
   labeled `undocumented`.
5. Two contemporaneous reports establish the September 12 GM, and Apple’s
   surviving public notes establish the later public-release boundary. No
   complete GM-specific release-note artifact was located. The manifest
   validator requires a structured change set for every content route, so GM
   remains an explicit evidence gap rather than receiving a synthetic record.

## Byte and transcript audit ledger

| State  | Public artifact             | Raw bytes | Raw SHA-256                                                        | Normalized or parsed assertion                                                                           |
| ------ | --------------------------- | --------: | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Beta 1 | Apple Newsroom announcement |   133,084 | `96e5c6abce88bd369076b6c9355e1f771df74f734d70b9363e6d82c4be84343e` | 6,598-byte normalized article; `a93a0bd11405c67b8cecfd0ef81ae0ccfa2578bee8c07b8f4c52c3c97760e210`        |
| Beta 1 | 9to5Mac transcript          |   161,340 | `6cb1a0a665d4d0f78c372016707a8504ef99e6361a1e8141988e1c56bcb066d3` | 15,060-byte normalized transcript; `5c8b8d94e0bd6b488bce89c7bda0dbc1a7066f39f12b465a2380de4dbf1f515f`    |
| Beta 1 | BGR transcript              |    61,138 | `9177fd68c9a021c046065ea5842be545e94295e4f4fc97c829f8d2a76321b702` | 14,924-byte normalized transcript; `3c37ed9faf5616003401560974d0952b83a3d960e5f61b12df3cedf6d5de1a0a`    |
| Beta 2 | 9to5Mac transcript          |   184,265 | `22eadb48648de41279bbb5b08f61736e57d84385d4ac90f2ddf855f639925406` | 20 fixed records; canonical inventory `73135cc523362992aa3c879814a2073a738e8d9817450197124d4fc95358e92c` |
| Beta 3 | 9to5Mac transcript          |   201,190 | `5b76d69bbe5f51b07f68812cbac9889309fcbd07613cad70d590239dd5e29ada` | 18 fixed records; canonical inventory `48f090b1cb60b30abc91f8d9f284b54dc5f27639ae9b3d56e7ed6455f737fd99` |
| Beta 4 | 9to5Mac transcript          |   199,138 | `8f6b5e05a75100ae769a654202a10ef1e49e4186fea1b78655200f04358408f9` | 13 fixed records; canonical inventory `9bad162630b465dec17a2e68620b1945e13b2dd1ce4366675d5e0b21b0b96a0c` |
| Beta 4 | Engadget transcript         |    87,771 | `7d16b463ffc85e4ffd05407a75f2769d771c2f2351952b0d5cf28303575b7d14` | 28,783-byte normalized transcript; `51b157ed0e67c4542882a185126da15ec07f3eae928c8d786fb96e60145dd55d`    |
| GM     | MacRumors report            |   124,047 | `355a8cad524b705fde118d367b9bfffde6aa7d868dcedf8571afdeaefd65b258` | 640-byte normalized article; `a8d78c23d13d36dae7ecc8f24009e268958c5f1ac40c8527a8b3387b169aae69`          |
| GM     | Engadget report             |    56,703 | `538728e1d292dc1430f1dfa8f2d07bf10a25dbc684b9b9b553010f0af3438991` | 694-byte normalized article; `8584f77e5481d253bf2cb06569c2dedabdd0d58d0fb3c4b4bdbc3c98091ff04b`          |

Raw evidence is retained only in the ignored temporary research directory.
The committed audit helper accepts that directory as input and verifies the
hashes, publication metadata, fixed-record counts, component splits, and short
selection probes without committing publisher text.

An independent live re-fetch reproduced all eight reviewed normalized article
and transcript bodies exactly. Seven complete wrapper payloads also reproduced
byte-for-byte; Engadget’s wrapper changed by four bytes while its scoped article
hash remained identical.

## Exact evidence gaps and exclusions

- The local seed has no prerelease milestones for iOS 6.0. These four events
  therefore carry complete deterministic identities rather than pretending to
  patch pre-existing routes.
- No complete first-party-hosted prerelease artifact was found for Beta 2, Beta
  3, Beta 4, or GM. The retained developer-note bodies are explicitly credited
  as third-party transcriptions; editorial approval does not convert their
  corroborated provenance into first-party confirmation.
- Beta 1 is a baseline, not a computed predecessor delta.
- Apple TV fixed records are excluded because this batch targets iOS, not the
  separate Apple TV software track.
- Beta 2’s Game Center timeout body still promises a future fix despite its
  “FIXED” prefix. Its Smart App Banner body likewise says launching remains
  unavailable. Neither contradictory entry is represented as a release delta.
- Beta 3’s Single-Tap and attributed-string fixed records and Beta 4’s
  Single-Tap fixed record are cumulative carry-forward from an earlier resolved
  state, so they are not presented as newly fixed.
- The Beta 3 Passbook database entry sits under a fixed heading, but its body
  describes a one-time prerelease database reset. It is conservatively modeled
  as a changed state rather than a bug-fix claim.
- GM is not created by this batch. Its date is defensible, but no inspectable
  GM-specific note set survived this research pass and the content contract
  correctly rejects empty or synthetic change sets.
- No build number is inferred from publisher prose, download filenames, or
  unavailable developer artifacts.
- Public remains owned by the existing iOS 6 public batch.

## Copyright and attribution controls

- All reader-facing article, title, summary, and canonical-summary text is
  original synthesis.
- Every retained factual record carries source citations and a short locator.
- Apple is credited as the author of the underlying developer-note text in the
  editorial method; each preserving page’s publisher and byline are retained so
  hosting and authorship provenance remain explicit.
- No transcript, screenshot, source HTML, or long source excerpt is committed.
- Publisher commentary and workaround prose are not republished.
- The undocumented YouTube item is separately labeled and requires two
  independent contemporaneous reports.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Apple Previews iOS 6 With All New Maps, Siri Features, Facebook Integration, Shared Photo Streams & New Passbook App](https://www.apple.com/newsroom/2012/06/11Apple-Previews-iOS-6-With-All-New-Maps-Siri-Features-Facebook-Integration-Shared-Photo-Streams-New-Passbook-App/) — Apple Newsroom; by Apple; firstPartyAnnouncement.
- [iOS 6 Beta 1 developer release-note transcript](https://9to5mac.com/2012/06/14/apple-now-requires-user-permission-in-ios-6-before-apps-can-access-private-data/) — 9to5Mac; by Élyse Betters; archive.
- [iOS 6 Beta 1 developer release-note mirror](https://www.bgr.com/general/ios-6-beta-download-link-iphone-ipad-ipod-touch-release/) — BGR; by Zach Epstein; archive.
- [iOS 6 Beta 2 developer release-note transcript](https://9to5mac.com/2012/06/25/apple-pushes-ios-6-0-update-to-devs/) — 9to5Mac; by 9to5 Staff; archive.
- [iOS 6 Beta 2 Released](https://osxdaily.com/2012/06/25/ios-6-beta-2-released/) — OS X Daily; by Matt Chan; journalism.
- [iOS 6 Beta 3 developer release-note transcript](https://9to5mac.com/2012/07/16/apple-seeds-ios-6-beta-3-to-developers/) — 9to5Mac; by Mark Gurman; archive.
- [Apple Releases iOS 6 Beta 3 to Developers](https://www.iclarified.com/23212/apple-releases-ios-6-beta-3-to-developers) — iClarified; by Shalom Levytam; journalism.
- [iOS 6 Beta 4 developer release-note transcript](https://9to5mac.com/2012/08/06/ios-6-beta-4-released-to-developers/) — 9to5Mac; by Mark Gurman; archive.
- [iOS 6 Beta 4 developer release-note mirror](https://www.engadget.com/2012-08-06-apple-seeds-ios-6-beta-4-to-developers-changelog.html) — Engadget; by Darren Murph; archive.
- [Apple Seeds iOS 6 Beta 4 to Developers](https://www.macrumors.com/2012/08/06/apple-seeds-ios-6-beta-4-to-developers/) — MacRumors; by Eric Slivka; journalism.

Evidence-gap sources audited but deliberately not declared in the manifest:

- [Apple Releases iOS 6 Golden Master to Developers](https://www.macrumors.com/2012/09/12/apple-releases-ios-6-golden-master-to-developers/) —
  MacRumors; contemporaneous GM identity report.
- [iOS 6 seeded to developers ahead of official launch](https://www.engadget.com/2012-09-12-ios-6-seeded-to-developers-ahead-of-official-launch.html) —
  Engadget; independent contemporaneous GM identity report.
- [About iOS 6 Updates](https://support.apple.com/en-us/102995) — Apple Support; final public-state
  boundary only.

## Closure guards

- Exact comparison against the local iOS 6.0 seed record and its sole Public
  milestone
- Exact four-route identity and date allowlist, with GM and Public excluded
- Zero versions and zero builds; exact approved review, provenance, and
  indexability closure for all four events
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 79 occurrences resolve to exactly
  64 stable local definitions
- Fifteen known-state → fixed-state occurrences retain one canonical identity
- Explicit rejection of the contradictory Smart App Banner entry and all three
  already-resolved carry-forward entries
- Exactly one undocumented allowlisted record
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `28bcb3df23cb2642088f763490b213da38d34bd51ec933df7d235eb157047421`

## Editorial approval and validation record

The independently re-fetched and audited event creations are approved:

- provenance: `editoriallyVerified`
- editorial status: `approved` at `2026-07-30T11:45:36Z`
- indexability: `true`

Verified on 2026-07-30:

- evidence audit: 13 exact raw artifacts totaling
  2,928,299 bytes,
  9 normalized text locks,
  62 Beta 1 cross-mirror probes, exact
  Beta 2/Beta 3/Beta 4 fixed inventories, contradiction and carry-forward
  exclusions, publication metadata for Beta 1–4 and GM, and an independent
  eight-body live re-fetch
- `npm run research:validate`:
  70 batches and
  4,131 globally consistent
  change keys; this batch reports 4 events,
  79 changes, 10 sources, and
  426 citations
- focused ingestion/manifest suite:
  19 of 19 passed
- full repository suite:
  131 of 131 passed
- independent copyright-similarity scan: maximum contiguous reader-facing
  overlap of 5 words across
  352 editorial fields
- ESLint, Prettier check, deterministic regeneration, and
  `git diff --check`: passed
- production dry plan: 77 creates,
  1 revision-guarded patch, and
  2,082 unchanged documents
- create split: 9 new sources,
  4 new deterministic events, and
  64 stable change definitions
- the one planned patch is revision-guarded and adds only `author: "Apple"`
  to the exact reused Apple Newsroom source
- mutation payload:
  258,206 bytes
- production plan SHA: `1341577a1f95912bd982f406130e75b36cff7392e93d0d3c8c4f7e25c960fdc7`
- two consecutive production dry runs reproduced the same plan SHA, counts,
  payload size, plan artifact, and rollback artifact
- plan artifact SHA-256: `b7c43f2f3fd48c41edeaf7e95bf4f9051c7af084b7a7d65051b9d6a3bdd18db3`
- rollback artifact SHA-256: `9a6f73b3a33d6dbbd94492c232d7766eafc9a73dbe9eea106b660b6db56db73a`
- all four event creations preserve the exact editorially verified, approved,
  and indexable identities in this manifest

## Publication receipt

- applied plan SHA: `1341577a1f95912bd982f406130e75b36cff7392e93d0d3c8c4f7e25c960fdc7`
- reviewed plan artifact SHA-256: `b7c43f2f3fd48c41edeaf7e95bf4f9051c7af084b7a7d65051b9d6a3bdd18db3`
- rollback artifact SHA-256: `9a6f73b3a33d6dbbd94492c232d7766eafc9a73dbe9eea106b660b6db56db73a`
- Sanity transaction: `F0eE6eK5XyVXtlnaoyRcBA`
- receipt SHA-256: `e404483da64c5ca2b1921f048fa05fd8bc045a6f84c00acdc64bdec9f38c0737`
- immediate post-publication zero plan:
  `c416da356ae1af476bc13ac3856d0547fe15df7b8750640de4370f839f35abce`;
  0 creates,
  0 patches,
  2,160 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `52482b40e38d9de295927c0e2a993bc93e86e7d79afb6d6bd61b1c6bbc58daa4`
- zero-plan rollback artifact SHA-256:
  `04bbac72906f0a3e48c582b1822709baf710573bc74a96a9eb3dd1953d8bc332`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 1,983
  appearances: 430 full articles,
  256 source-linked records, and
  1,297
  timeline-only records
- 581 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each response returned all eight archival article blocks, every expected
structured change title, References, and its primary source. No response
returned placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Article blocks | Expected changes | References | Primary source | Placeholder | Noindex |
| ------------------------ | ---: | -------------: | ---------------: | ---------- | -------------- | ----------- | ------- |
| `/apple/ios/6.0/beta-1/` |  200 |            8/8 |            31/31 | yes        | yes            | no          | no      |
| `/apple/ios/6.0/beta-2/` |  200 |            8/8 |            16/16 | yes        | yes            | no          | no      |
| `/apple/ios/6.0/beta-3/` |  200 |            8/8 |            15/15 | yes        | yes            | no          | no      |
| `/apple/ios/6.0/beta-4/` |  200 |            8/8 |            17/17 | yes        | yes            | no          | no      |

Final verification on 2026-07-30:

- full repository suite: 131 tests passed
- focused ingestion and manifest suite:
  19 tests passed
- deterministic regeneration preserved JSON SHA-256 `28bcb3df23cb2642088f763490b213da38d34bd51ec933df7d235eb157047421`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,160 unchanged
  documents, the 16-byte payload, and
  plan SHA `c416da356ae1af476bc13ac3856d0547fe15df7b8750640de4370f839f35abce`
- the final planner reported “No Sanity data changed”

Reproduce and verify the published batch with:

```sh
node scripts/research-batches/audit-ios6-prerelease.mjs tmp/ios6-evidence scripts/research-batches/apple-ios-6-prerelease.json
node scripts/research-batches/build-apple-ios-6-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-6-prerelease.mjs scripts/research-batches/audit-ios6-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-6-prerelease.mjs scripts/research-batches/audit-ios6-prerelease.mjs scripts/research-batches/apple-ios-6-prerelease.json scripts/research-batches/apple-ios-6-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-6-prerelease.json
```

The final Sanity command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
