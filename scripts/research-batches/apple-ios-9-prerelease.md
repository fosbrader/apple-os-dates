# Apple iOS 9 prerelease archive batch

## Result

`apple-ios-9-prerelease.json` is the reviewed overlay for four existing iOS 9.0 routes:
Beta 1, Beta 3, Beta 4, and Beta 5.

- 4 substantive event overlays and no release-version overlays
- 138 source-backed change occurrences across
  102 stable, collision-checked definitions
- 7 declared and used sources with 488 citation
  references
- zero builds, build-number claims, route creation, Beta 2 changes, GM changes,
  Public-route changes, or community-observation changes
- every event is `editoriallyVerified`, approved at `2026-07-30T10:22:45Z`, and
  `isIndexable: true`

## Reviewed route closure

| Milestone | Existing alias | Selected changes | Fixed | Current known |
| --------- | -------------- | ---------------: | ----: | ------------: |
| Beta 1    | `beta-1`       |               34 |     0 |            28 |
| Beta 3    | `beta-3`       |               43 |    23 |            19 |
| Beta 4    | `beta-4`       |               37 |    23 |            12 |
| Beta 5    | `beta-5`       |               24 |    21 |             1 |

The local iOS 9.0 seed contains seven milestones. Beta 2 and GM remain
timeline-only evidence gaps. Public is already owned by `apple-ios-9.json` and
is untouched.

## Evidence method

1. A fixed Internet Archive snapshot of BGR’s June 8, 2015 article reproduces
   Apple’s complete nine-page Beta 1 developer document. The transcript carries
   the original Apple Developer URL, document page markers 1/9 through 9/9, and
   Apple’s June 8 footer. Apple Newsroom independently confirms that the iOS 9
   beta software and SDK became immediately available that day.
2. A contemporaneous June 23 V2EX post labels the same Apple Developer URL as
   the iOS 9 Beta 2 notes. The Apple URL was cumulative and later overwritten,
   and no complete Beta 2 body survives in the audited source set. The link
   proves document identity and timing only; it does not support a Beta 2 page.
3. Internet Archive preserves intact Apple Developer HTML states titled for
   Beta 3, Beta 4, and Beta 5. Their metadata and footer dates are July 8,
   July 21, and August 7, 2015.
4. Beta 3 uses Apple’s explicit fixed headings, the self-dating two-factor note,
   and a limited set of current issues that later retained pages resolve.
   Because the Beta 2 body is absent, no Beta 2-to-Beta 3 addition diff is
   claimed.
5. Beta 4 and Beta 5 use their explicit fixed headings. Added notes and known
   issues are included only when a conservative exact-state comparison supports
   the boundary.

## Raw-source audit ledger

| State                     | Source identity                                           | Inventory                                                      | SHA-256                                                            | Use                              |
| ------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------- |
| Archived BGR Beta 1 HTML  | published 2015-06-08; archive replay 2026-01-16           | Complete Apple transcript; pages 1/9–9/9; 34 selected records  | `d3d2c355259b6930f0ae5c0dc3c262cdecdf59c038c34822dcfe9f3bc523596c` | Beta 1 baseline                  |
| Apple iOS 9 preview HTML  | published 2015-06-08; accessed twice on 2026-07-30        | Explicit immediate developer-beta availability                 | `39399aad2d33a68c272a3d24ac2f60c1ace33adceefee9665320660cfbb8db35` | Beta 1 timing corroboration      |
| V2EX Beta 2 context HTML  | posted 2015-06-23 19:02:40Z; accessed twice on 2026-07-30 | One exact Apple Developer release-note URL                     | `a28b2b8e14259c55e2737076437c373df41e4b98f606f3d743a5f633ef9bc5d2` | Beta 2 evidence-gap boundary     |
| Apple Beta 3 archive HTML | document updated 2015-07-08; captured 2015-07-15          | 46 components; 56 status groups; 100 leaf records; 43 selected | `9ffd758bb0b527afb5b77e9fabb8fa561ab9b0e4f57dc7eab579b0384891d500` | Beta 3 evidence                  |
| Apple Beta 4 archive HTML | document updated and captured 2015-07-21                  | 39 components; 49 status groups; 91 leaf records; 37 selected  | `74aabce5f36a06fcd275b269d076d760a2ac90e3ae501dd5e7e51675da74cd40` | Beta 4 evidence                  |
| Apple Beta 5 archive HTML | document updated 2015-08-07; captured 2015-08-14          | 29 components; 38 status groups; 70 leaf records; 24 selected  | `19f2abb4787e751c7d1a6b0585739337bcc6311b2c711f7932431c64a51e6b80` | Beta 5 evidence                  |
| Apple final archive HTML  | document updated 2015-09-11; captured 2015-09-19          | 19 components; 21 status groups; 40 leaf records               | `8f9a9b3455640420f7153ae816a922bceacab81ee9996994760ccb8e63d66676` | Final-state and GM boundary only |

All hashes were independently computed over the exact fetched response bodies.
Internet Archive replay URLs in the manifest identify the same fixed timestamped
states; the raw audit used `id_` replay to avoid toolbar rewriting. The Apple
Newsroom and V2EX pages are live wrappers rather than fixed captures; two
independent fetches produced the recorded body hashes, but only their narrowly
identified availability sentence, timestamp, label, and Apple URL are used.

## Copyright and editorial method

Every title, canonical summary, article paragraph, and occurrence summary is
original synthesis. Technical identifiers and product names are retained only
when needed to identify an API, framework, setting, or affected feature. The
manifest does not republish Apple’s lists, BGR’s prose, or community comments.

Repeated defects retain one canonical identity as Apple moves them from a
current known issue to a later fixed section. This supports a wiki-style history
without presenting cumulative documentation as a fresh release delta.

## Exact evidence gaps

- Beta 2 has a contemporaneous link to the correct Apple page but no retained
  milestone body. The cumulative URL now exposes a later state, so Beta 2
  remains timeline-only.
- The September 11 Apple document identifies the final iOS 9 SDK state, not the
  September 9 GM milestone. It is used only as an archive boundary; GM remains
  timeline-only.
- Beta 1 survives through a third-party reproduction. Its evidence remains
  explicitly corroborated and preserves the mirror provenance after editorial
  approval.
- Beta 3 is the first intact Apple-hosted archive state. Current known issues on
  that route describe state, not first appearance; only explicit fixed headings
  and self-dating language are treated as milestone deltas.
- The structured selection is deliberately high-signal rather than a claim that
  every source paragraph is a separate reader-facing change.
- No complete first-party build-number set was retained. The batch creates no
  build documents and makes no build assertion.
- Public is already covered by the approved iOS 9 public-release batch and is
  not patched here.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Apple Just Released iOS 9 Beta 1 — archived reproduction of Apple’s release notes](https://web.archive.org/web/20260116162733/https://www.bgr.com/general/ios-9-beta-download-link-how-to-install/) — BGR via Internet Archive; archive.
- [Apple Previews iOS 9](https://www.apple.com/newsroom/2015/06/08Apple-Previews-iOS-9/) — Apple Newsroom; firstPartyAnnouncement.
- [Contemporaneous iOS 9 Beta 2 release-note link](https://www.v2ex.com/t/200680) — V2EX; community.
- [iOS SDK Release Notes for iOS 9 Beta 3 (preserved snapshot)](https://web.archive.org/web/20150715110247/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-9.0/index.html) — Apple Developer via Internet Archive; archive.
- [iOS SDK Release Notes for iOS 9 Beta 4 (preserved snapshot)](https://web.archive.org/web/20150722023232/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-9.0/) — Apple Developer via Internet Archive; archive.
- [iOS SDK Release Notes for iOS 9 Beta 5 (preserved snapshot)](https://web.archive.org/web/20150814002045/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-9.0/index.html) — Apple Developer via Internet Archive; archive.
- [iOS SDK Release Notes for iOS 9 (preserved final snapshot)](https://web.archive.org/web/20150919124943/https://developer.apple.com/library/prerelease/ios/releasenotes/General/RN-iOSSDK-9.0/index.html) — Apple Developer via Internet Archive; archive.

## Closure guards

- Exact comparison against the local iOS 9.0 seed record and all seven
  milestones
- Exact four-route allowlist with explicit exclusion of Beta 2, GM, and Public
- Zero versions and zero builds
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 138 occurrences resolve to exactly
  102 stable local definitions
- Explicit rejection of identity, build, community-observation, and
  administrative keys
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `e805843aa1bed3a9bf21cfc3978da129493fe3d5bdc773e50ac7c84ce0837701`

## Publication and validation record

The generator's route, collision, review-state, evidence-boundary, source, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all four event articles and all 138 occurrences are
  `editoriallyVerified`, were approved at `2026-07-30T10:22:45Z`, and are indexable
- all five fixed Internet Archive response bodies reproduced the exact hashes in
  the raw ledger; two independent Apple Newsroom fetches and two independent
  V2EX fetches reproduced their updated live-wrapper hashes
- the Beta 1 reproduction contains the original Apple Developer URL, all nine
  page markers from 1/9 through 9/9, and Apple’s June 8 document date
- the durable HTML audit passed 419 component,
  status, and locator-fragment assertions across all 138
  occurrences; the three direct Apple pages account for
  315 DOM-bounded assertions
- all 18 fragments used for conservative Beta 4
  or Beta 5 additions occur in the current retained state and are absent from
  the exact preceding state
- the copyright scan checked 586 reader-facing
  fields against 7 source bodies; the longest
  contiguous overlap was 5 words

Publication receipt:

- applied production plan: `1df66086e116ab4a9a7c17720409403d16cd1e5296893b202b4592a83b371bb2`
- reviewed plan artifact SHA-256: `8438d3c77c975f74adee008223b4ad32ba09b18cd76ff33de953dd96de3d1c24`
- rollback artifact SHA-256: `cedb66305c5a9ee1dd2180e759c3960018386d8ba2b2e3b91d6af012fc6528fb`
- applied plan contents: 109 creates,
  4 revision-guarded patches,
  2,078 unchanged documents, and a
  324,254-byte mutation payload
- create split: 7 sources and
  102 stable change documents; zero versions, events, or
  builds were created
- all four patches targeted the exact existing Beta 1, Beta 3, Beta 4, and
  Beta 5 route documents and set only article, change, citation, approved
  review, provenance, summary, and indexability fields
- Sanity transaction: `tt1fSB5HY9GAB0YLyyj5s6`
- receipt SHA-256: `d7e336f49688c4c1395624e35e1f5346b918dd2a96988ea96f893d12b536a571`
- immediate post-publication zero plan:
  `226adaf93c0b2e26ebd86dd139896a0b693b37ea0461ea3e9cb8a114fc968d3c`;
  0 creates,
  0 patches,
  2,191 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `13908a0ca471e3db2bd04d7390feca5f611a4071d9de774d2f2d3b52d00937ed`
- zero-plan rollback artifact SHA-256:
  `495923a2fcb109ef375104b399b8c7f99f3dbd2ffa893a60b9fe865ec1878802`

Production coverage after publication:

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 413 full articles,
  256 source-linked records, and
  1,310
  timeline-only records
- 564 appearances have
  approved structured changes

## Settled canonical route verification

All four published routes were fetched independently from the running local
site. Every response returned its full archival article, all expected structured
change titles, References, and its primary source. No response returned
placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Full article | Expected changes | References | Primary source | Placeholder | Noindex |
| ------------------------ | ---: | ------------ | ---------------- | ---------- | -------------- | ----------- | ------- |
| `/apple/ios/9.0/beta-1/` |  200 | yes          | 34/34            | yes        | yes            | no          | no      |
| `/apple/ios/9.0/beta-3/` |  200 | yes          | 43/43            | yes        | yes            | no          | no      |
| `/apple/ios/9.0/beta-4/` |  200 | yes          | 37/37            | yes        | yes            | no          | no      |
| `/apple/ios/9.0/beta-5/` |  200 | yes          | 24/24            | yes        | yes            | no          | no      |

Final verification on 2026-07-30:

- `npm run research:validate`:
  61 batches validated; this batch reports
  4 events, 138 change occurrences,
  7 sources, and 488 citation references;
  3,619 change keys remain
  globally consistent
- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests
  passed
- the checked-in HTML audit reproduced all
  419 locator assertions and all
  18 transition boundaries with zero failures
- independent copyright-similarity scan: maximum contiguous overlap of
  5 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  `e805843aa1bed3a9bf21cfc3978da129493fe3d5bdc773e50ac7c84ce0837701`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,191 unchanged
  documents, the 16-byte payload, and
  plan SHA `226adaf93c0b2e26ebd86dd139896a0b693b37ea0461ea3e9cb8a114fc968d3c`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-9-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-9-prerelease.mjs scripts/research-batches/audit-ios9-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-9-prerelease.mjs scripts/research-batches/apple-ios-9-prerelease.json scripts/research-batches/apple-ios-9-prerelease.md scripts/research-batches/audit-ios9-html-states.mjs
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-9-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
