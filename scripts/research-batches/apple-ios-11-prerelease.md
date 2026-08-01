# Apple iOS 11 prerelease archive batch

## Result

`apple-ios-11-prerelease.json` is the reviewed overlay for seven existing iOS 11.0
prerelease routes. It combines a preserved Apple-authored Beta 1 image, a
complete Apple-authored Beta 2 transcript, and byte-verifiable Apple Developer
PDFs for Beta 3 through Beta 7.

- 7 substantive event overlays and no release-version overlays
- 85 milestone-specific occurrences across
  85 stable, collision-checked definitions
- 8 declared and used sources with 522 citation
  references
- zero builds, build-number claims, route creation, Public-route changes, or
  community-observation changes
- every event is `editoriallyVerified`, approved at `2026-07-30T10:06:46Z`, and
  `isIndexable: true`

## Reviewed route closure

| Platform | Milestone | Existing alias | Selected changes |
| -------- | --------- | -------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`       |                7 |
| iOS      | Beta 2    | `beta-2`       |                4 |
| iOS      | Beta 3    | `beta-3`       |               16 |
| iOS      | Beta 4    | `beta-4`       |               22 |
| iOS      | Beta 5    | `beta-5`       |               18 |
| iOS      | Beta 6    | `beta-6`       |               15 |
| iOS      | Beta 7    | `beta-7`       |                3 |

The seven other iOS 11.0 milestones remain outside the manifest.

## Evidence method

1. Beta 1 is an Apple-authored composite image retained by Redmond Pie. Selection
   is limited to seven issue-bearing records beneath exact New Features headings.
2. Beta 2 survives as a complete Apple-authored transcript beneath a clearly
   bounded release-note heading on 9to5Mac. Only four records that explicitly
   identify Beta 2 or compare it with Beta 1 are retained. Publisher-authored
   discoveries are excluded.
3. Beta 3 has 183 distinct issue identifiers versus 182 in the Beta 2 transcript.
   Sixteen identifiers occur in Beta 3 but not Beta 2; those exact component and
   status records form the Beta 3 selection.
4. Beta 4 through Beta 7 use adjacent-state comparisons over normalized record
   text, component, Apple status heading, and issue identifier. Carried records,
   line-wrap changes, and grammar-only edits are excluded.
5. Beta 8 and Beta 10 PDFs were also audited. Beta 8 is semantically identical to
   Beta 7 after pagination normalization, while the complete Beta 10 note body is
   byte-for-byte text-identical to Beta 8. Those routes therefore receive no
   invented structured change.

## Raw evidence ledger

| State         | Public artifact                                        | Pages or dimensions |      Bullets | Distinct issue IDs | SHA-256                                                            | Use                                               |
| ------------- | ------------------------------------------------------ | ------------------: | -----------: | -----------------: | ------------------------------------------------------------------ | ------------------------------------------------- |
| Beta 1        | Redmond Pie composite of Apple notes                   |        600×9,426 px | not asserted |       not asserted | `b6264488634bfdaec3f23183e565db8fe3fabf4565e8df9609b95a4d0f115d90` | Seven exact New Features records                  |
| Beta 2        | 9to5Mac Apple-note transcript HTML                     | complete transcript | not asserted |                182 | `7f3e2620a52821f050e5a53c5f9560b025276f54cce8e81464580f1777826a67` | Four self-identifying records and Beta 3 boundary |
| Beta 3        | Apple Developer PDF mirror                             |                  21 |          196 |                183 | `757a79972d5ca81528320de73da8e60e2ec56c705968619948aed197699cb02e` | 16 identifier additions                           |
| Beta 4        | Apple Developer PDF mirror                             |                  22 |          206 |                192 | `91621db35343b59c3c9f2ad51d4267cdd884445d00f98ef032e8f79adcf6d494` | 22 semantic additions or transitions              |
| Beta 5        | Apple Developer PDF mirror                             |                  23 |          215 |                200 | `21af50f7fcc3e382af83d20dd6a02dedca0813aacb0281ad0096b22664f159fe` | 18 semantic additions or transitions              |
| Beta 6        | Apple Developer PDF mirror                             |                  23 |          218 |                203 | `d3ea6612d158e723e97afd5f8c2bb580d683da4c0a65cb0f2aeabed9572a44f2` | 15 semantic additions or transitions              |
| Beta 7        | Apple Developer PDF mirror                             |                  23 |          221 |                204 | `8480a2c5f33f8e365ce6ebf67c0f66d618565df550a24f3f392f3e0e0123251c` | Three semantic additions or transitions           |
| Beta 8        | Apple Developer PDF mirror; two byte-identical mirrors |                  23 |          221 |                204 | `5a8dcf0a477f175b793cc5210dc47e50cfc5f8cf987f413e798c34a94e5c181b` | Evidence gap: no semantic note delta from Beta 7  |
| Beta 10       | Apple Developer PDF mirror                             |                  23 |          221 |                204 | `1bcab8180b5bc7200058b57195ed1a9c7b0d253132bcc91aeeb2c9ba7807c5e0` | Evidence gap: note body identical to Beta 8       |
| Final archive | Apple iOS 11 SDK archive, revision `iOS1100 - IRN1`    |                HTML | not asserted |       not asserted | `b7e9368fc21e3e0f5c53a3f2c7052ad984dddee9fb6647743881eb0943074512` | Final-state boundary only                         |

The Beta 5 current MacRumors attachment and its Internet Archive replay are
byte-identical. Beta 8’s MacRumors attachment and iPhoneTricks archive replay are
also byte-identical. PDF hashes cover the complete original bytes downloaded on
2026-07-30; the Beta 1 and Beta 2 hashes cover the retained image and fetched
HTML response respectively.

## Exact evidence gaps

- Beta 2 Update and Public Beta 1 share the June 26 seed/build identity in the
  local timeline, but no separate Apple-authored note state isolates either
  route. Both remain timeline-only.
- Beta 8 has a titled Apple PDF, but its semantic note body repeats Beta 7.
- No complete Beta 9 Apple note state was found. The route remains timeline-only.
- Beta 10 has a titled Apple PDF, but its note body is identical to Beta 8. The
  missing Beta 9 state prevents an adjacent-state claim beyond that exact
  equality.
- No separate GM Apple note document was found. Apple’s final archive is dated
  Public release day and is not back-attributed to GM.
- Public is already owned by `apple-ios-11.json` and is untouched.
- No build number is taken from publisher prose, forum posts, or unavailable
  Apple download pages.
- Apple’s Beta 7 document assigns issue `30567424` to both the new Classroom
  record and a carried CloudKit record. The Classroom occurrence is retained
  with an exact component locator; no global uniqueness is claimed for Apple’s
  internal identifiers.

## Copyright and attribution controls

- All article, title, summary, and canonical-summary fields are original
  synthesis.
- Apple-authored source documents are linked, titled, and credited; no PDF,
  transcript, screenshot, or long source excerpt is checked into the repository.
- Publisher-written feature lists and forum observations are excluded.
- The raw documents are used as factual evidence for component, status, issue ID,
  and milestone boundaries, not republished as substitute copies.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [iOS 11 beta 1 Release Notes (Apple-authored composite image)](https://www.redmondpie.com/ios-11-beta-1-release-notes-changes-and-known-issues-according-to-apple/) — Redmond Pie document image; archive.
- [iOS 11 beta 2 Release Notes (Apple-authored transcript)](https://9to5mac.com/2017/06/21/apple-ios-11-beta-2/) — 9to5Mac transcript; archive.
- [iOS 11 beta 3 Release Notes](https://forums.macrumors.com/attachments/ios_11_beta_3_release_notes-pdf.707997/) — MacRumors Forums document mirror; archive.
- [iOS 11 beta 4 Release Notes](https://forums.macrumors.com/attachments/ios_11_beta_4_release_notes-pdf.709879/) — MacRumors Forums document mirror; archive.
- [iOS 11 beta 5 Release Notes](https://forums.macrumors.com/attachments/beta-5-release-notes-pdf.711935/) — MacRumors Forums document mirror; archive.
- [iOS 11 beta 6 Release Notes](https://forums.macrumors.com/attachments/ios_11_beta_6_release_notes-pdf.712922/) — MacRumors Forums document mirror; archive.
- [iOS 11 beta 7 Release Notes](https://forums.macrumors.com/attachments/ios_11_beta_7_release_notes-pdf.713953/) — MacRumors Forums document mirror; archive.
- [iOS 11 SDK Release Notes](https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-11/) — Apple Developer; firstPartyDocumentation.

Additional audited but non-manifest evidence:

- [iOS 11 beta 8 Release Notes](https://forums.macrumors.com/attachments/ios_11_beta_8_release_notes-pdf.714880/) — Apple Developer PDF mirrored by
  MacRumors Forums.
- [iOS 11 beta 10 Release Notes](https://forums.macrumors.com/attachments/ios_11_beta_10_release_notes-pdf.716168/) — Apple Developer PDF mirrored by
  MacRumors Forums.

## Closure guards

- Exact comparison against the local iOS 11.0 seed record and all 14 milestones
- Exact seven-route allowlist with Public and every unsupported prerelease route
  excluded
- Zero versions, zero builds, and zero unsupported route mutations
- Collision scan across every other research-batch JSON plus
  `apple-launch-content-2026.json`
- 85 occurrences resolve to exactly
  85 stable local definitions
- 84 issue-bearing occurrences plus one exact, issue-less Beta 5 Messages
  removal
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `3eea0a2fdd98f076b1edbc054499c0986bfedf7d750795ec83c327d0b3cbb523`

## Publication and validation record

The generator's route, collision, review-state, evidence-boundary, source, and
citation guards pass before either artifact is written.

Independent editorial and evidence review:

- all seven event articles and all 85 occurrences are
  `editoriallyVerified`, were approved at `2026-07-30T10:06:46Z`, and are indexable
- the 600×9,426 Beta 1 image reproduced its recorded SHA-256 and all
  7 selected component, status, and issue
  locators were checked against the visible Apple-authored document
- the 189,281-byte Beta 2 HTML
  response reproduced its recorded SHA-256, contains
  182 distinct issue identifiers, and all
  4 milestone-specific selections
  reconciled
- the Beta 3 through Beta 8 and Beta 10 downloads reproduced every PDF hash in
  the raw ledger; all 74 selected Beta 3–7
  delta records matched their exact component, status, and issue entries
- adjacent-state parsing returned 24 candidate Beta 4 rows and 20 candidate
  Beta 5 rows; the four excluded records are the documented carried or
  wording-only edits, leaving 22 and 18 substantive selections
- Beta 8 produced zero semantic rows against Beta 7, and Beta 10 produced zero
  against Beta 8
- Apple's final archive reproduced its recorded SHA-256 and exact
  `iOS1100 - IRN1` revision marker
- the independent copyright scan found a maximum contiguous reader-facing
  overlap of 5 words

Publication receipt:

- applied production plan: `9348884dffedd100b754ae2aa1688eddbbccb325ae9cb7b57ec58f383f742975`
- reviewed plan artifact SHA-256: `c8ef8a845da9d6d7617cdbe958dc0e6614a82adc1fd96ffd6a47172fd8606dc5`
- rollback artifact SHA-256: `e7a25ab76092af7aa0fff868ceb1489de7b414a41c46ab8335e595b84b20aba1`
- applied plan contents: 93 creates,
  7 revision-guarded patches,
  2,075 unchanged documents, and a
  310,129-byte mutation payload
- create split: 8 sources and
  85 stable change documents; zero versions, events, or
  builds were created
- all seven patches targeted the exact existing Beta 1–7 route documents and
  set only article, change, citation, approved review, provenance, summary, and
  indexability fields
- Sanity transaction: `F0eE6eK5XyVXtlnaoyKD0d`
- receipt SHA-256: `b97ae2fc5913632fb002ce3012817f13a4ab37fb52c3a4a2588e1942c47a4c1a`
- immediate post-publication zero plan:
  `a4d6ec1f7602de124baac3e0e2be37cf84a7b7b947ae9d8d5a4ae0d58f2d559c`;
  0 creates,
  0 patches,
  2,175 unchanged
  documents, and a 16-byte mutation
  payload
- zero-plan artifact SHA-256:
  `596b55d1b900adbbca23cd01db5f874a80ac8f74497e2abbfc2f31c4b2213283`
- zero-plan rollback artifact SHA-256:
  `2d4def4cb9bba5d5ffd56f216b5b5bc6b647c0b01e64ed0296f69514e731864e`

Production coverage after publication:

- 410 of
  410 release versions have full
  version-level coverage
- 1,979
  appearances: 409 full articles,
  256 source-linked records, and
  1,314
  timeline-only records
- 560 appearances have
  approved structured changes

## Settled canonical route verification

All seven published routes were fetched independently from the running local
site. Every response returned its full archival article, all expected structured
change titles, References, and its primary source. No response returned
placeholder copy or a `noindex` directive.

| Canonical route           | HTTP | Full article | Expected changes | References | Primary source | Placeholder | Noindex |
| ------------------------- | ---: | ------------ | ---------------- | ---------- | -------------- | ----------- | ------- |
| `/apple/ios/11.0/beta-1/` |  200 | yes          | 7/7              | yes        | yes            | no          | no      |
| `/apple/ios/11.0/beta-2/` |  200 | yes          | 4/4              | yes        | yes            | no          | no      |
| `/apple/ios/11.0/beta-3/` |  200 | yes          | 16/16            | yes        | yes            | no          | no      |
| `/apple/ios/11.0/beta-4/` |  200 | yes          | 22/22            | yes        | yes            | no          | no      |
| `/apple/ios/11.0/beta-5/` |  200 | yes          | 18/18            | yes        | yes            | no          | no      |
| `/apple/ios/11.0/beta-6/` |  200 | yes          | 15/15            | yes        | yes            | no          | no      |
| `/apple/ios/11.0/beta-7/` |  200 | yes          | 3/3              | yes        | yes            | no          | no      |

Final verification on 2026-07-30:

- `npm run research:validate`:
  60 batches validated; this batch reports
  7 events, 85 change occurrences,
  8 sources, and 522 citation references;
  3,540 change keys remain
  globally consistent
- full repository suite: 131 tests passed
- focused ingestion and manifest suite: 19 tests
  passed
- all 85 selected source locators and adjacent-state assertions
  reconciled
- independent copyright-similarity scan: maximum contiguous overlap of
  5 words
- ESLint, Prettier check, and focused `git diff --check`: passed
- deterministic regeneration: the formatted JSON SHA-256 remained
  `3eea0a2fdd98f076b1edbc054499c0986bfedf7d750795ec83c327d0b3cbb523`
- final production dry run reproduced
  0 creates,
  0 patches,
  2,175 unchanged
  documents, the 16-byte payload, and
  plan SHA `a4d6ec1f7602de124baac3e0e2be37cf84a7b7b947ae9d8d5a4ae0d58f2d559c`
- the final planner reported “No Sanity data changed”

Reproduce with:

```sh
node scripts/research-batches/build-apple-ios-11-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-11-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-11-prerelease.mjs scripts/research-batches/apple-ios-11-prerelease.json scripts/research-batches/apple-ios-11-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-11-prerelease.json
```

The final command is intentionally a post-publication dry run and must
reproduce the zero plan above. Do not add `--apply`.
