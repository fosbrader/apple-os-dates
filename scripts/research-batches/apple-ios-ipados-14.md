# Apple iOS and iPadOS 14 research batch

## Result

The companion manifest covers every audited iOS 14.x and iPadOS 14.x
`releaseVersion` record currently present in `scripts/seed-data.json`.

- 19 of 19 local version records have source-linked overview articles.
- 19 of 19 local public appearances have release-specific summaries and
  structured changes.
- 38 cited overview paragraphs provide the version-level articles.
- 100 structured change occurrences are attached to public appearances.
- 25 source records are included, all from first-party Apple documentation or
  announcements.
- The local validator counted 264 claim-level or page-level citations.
- 0 build records are included; see the evidence gaps below.
- Every event uses the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- All records passed final editorial review and are `editoriallyVerified`,
  `approved`, and indexable, with the review recorded at
  `2026-07-30T04:00:42Z`.
- No beta or release-candidate event was modified, and no Sanity write was
  performed.

## Exact coverage

| Release     | Public date in local audit | Changes | Article blocks | Durable public target            |
| ----------- | -------------------------- | ------: | -------------: | -------------------------------- |
| iOS 14.0    | 2020-09-16                 |       6 |              2 | `version-ios-14-0` + `public`    |
| iPadOS 14.0 | 2020-09-16                 |       6 |              2 | `version-ipados-14-0` + `public` |
| iOS 14.0.1  | 2020-09-24                 |       5 |              2 | `version-ios-14-0-1` + `public`  |
| iOS 14.1    | 2020-10-20                 |       6 |              2 | `version-ios-14-1` + `public`    |
| iPadOS 14.1 | 2020-10-20                 |       6 |              2 | `version-ipados-14-1` + `public` |
| iOS 14.2    | 2020-11-05                 |       6 |              2 | `version-ios-14-2` + `public`    |
| iPadOS 14.2 | 2020-11-05                 |       6 |              2 | `version-ipados-14-2` + `public` |
| iOS 14.3    | 2020-12-14                 |       6 |              2 | `version-ios-14-3` + `public`    |
| iPadOS 14.3 | 2020-12-14                 |       6 |              2 | `version-ipados-14-3` + `public` |
| iOS 14.4    | 2021-01-26                 |       6 |              2 | `version-ios-14-4` + `public`    |
| iPadOS 14.4 | 2021-01-26                 |       4 |              2 | `version-ipados-14-4` + `public` |
| iOS 14.5    | 2021-04-26                 |       6 |              2 | `version-ios-14-5` + `public`    |
| iPadOS 14.5 | 2021-04-26                 |       6 |              2 | `version-ipados-14-5` + `public` |
| iOS 14.5.1  | 2021-05-03                 |       3 |              2 | `version-ios-14-5-1` + `public`  |
| iOS 14.6    | 2021-05-24                 |       7 |              2 | `version-ios-14-6` + `public`    |
| iPadOS 14.6 | 2021-05-24                 |       5 |              2 | `version-ipados-14-6` + `public` |
| iOS 14.7    | 2021-07-19                 |       6 |              2 | `version-ios-14-7` + `public`    |
| iOS 14.7.1  | 2021-07-26                 |       2 |              2 | `version-ios-14-7-1` + `public`  |
| iOS 14.8    | 2021-09-13                 |       2 |              2 | `version-ios-14-8` + `public`    |

## Verified source set

All 25 URLs resolved to the named first-party Apple page during research on
2026-07-29. Apple Developer documentation is JavaScript-rendered, but each
human-readable URL resolved with the expected release-note title. The manifest
does not expose Apple’s DocC transport JSON as a reader-facing citation.

### Consumer release notes

- [About iOS 14 Updates](https://support.apple.com/en-us/118390)
- [About iPadOS 14 Updates](https://support.apple.com/en-us/108057)

### Apple Developer release notes

- [iOS & iPadOS 14 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14-release-notes)
- [iOS & iPadOS 14.2 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_2-release-notes)
- [iOS & iPadOS 14.3 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_3-release-notes)
- [iOS & iPadOS 14.4 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_4-release-notes)
- [iOS & iPadOS 14.5 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_5-release-notes)
- [iOS & iPadOS 14.5.1 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_5_1-release-notes)
- [iOS & iPadOS 14.6 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_6-release-notes)
- [iOS & iPadOS 14.7 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-14_7-release-notes)

### Apple security bulletins

- [iOS 14.0 and iPadOS 14.0](https://support.apple.com/en-us/103198)
- [iOS 14.2 and iPadOS 14.2](https://support.apple.com/en-us/103121)
- [iOS 14.3 and iPadOS 14.3](https://support.apple.com/en-us/102844)
- [iOS 14.4 and iPadOS 14.4](https://support.apple.com/en-us/103123)
- [iOS 14.5 and iPadOS 14.5](https://support.apple.com/en-us/103125)
- [iOS 14.5.1 and iPadOS 14.5.1](https://support.apple.com/en-us/103067)
- [iOS 14.6 and iPadOS 14.6](https://support.apple.com/en-us/103130)
- [iOS 14.7 and iPadOS 14.7](https://support.apple.com/en-us/103139)
- [iOS 14.7.1 and iPadOS 14.7.1](https://support.apple.com/en-us/103145)
- [iOS 14.8 and iPadOS 14.8](https://support.apple.com/en-us/103150)

### Apple Newsroom

- [iOS 14 Is Available Today](https://www.apple.com/newsroom/2020/09/ios-14-is-available-today/)
- [iPadOS 14 Introduces New Features Designed Specifically for iPad](https://www.apple.com/newsroom/2020/06/ipados-14-introduces-new-features-designed-specifically-for-ipad/)
- [Apple Fitness+: The Future of Fitness Launches December 14](https://www.apple.com/newsroom/2020/12/apple-fitness-plus-the-future-of-fitness-launches-december-14/)
- [iOS 14.5 Delivers Unlock iPhone with Apple Watch, More Diverse Siri Voice Options, and New Privacy Controls](https://www.apple.com/newsroom/2021/04/ios-14-5-offers-unlock-iphone-with-apple-watch-diverse-siri-voices-and-more/)
- [Apple Introduces AirTag](https://www.apple.com/newsroom/2021/04/apple-introduces-airtag/)

## Editorial and copyright method

The manifest contains original synthesis rather than copied release-note
paragraphs. Each factual overview paragraph, event summary, and structured
change is tied to an explicit Apple citation and locator. Closely related Apple
bullets are sometimes grouped into one reader-facing change when they describe
one coherent feature area; the grouping is written in new prose rather than
reproducing Apple’s wording.

The batch does not label ordinary Apple documentation as “undocumented.” It
also does not assign cumulative public notes to beta events. A claim is attached
only to the modeled public appearance for which the cited source supports it.

Trademarked product and feature names are used only as necessary to identify
the software, device, or feature being documented. The content does not imply
affiliation with or endorsement by Apple.

## Evidence gaps and deliberate limits

- Apple’s live cumulative iOS article contains iOS 14.2.1, 14.4.1, 14.4.2,
  and 14.8.1, but those releases are absent from the audited local dataset.
  This batch does not silently create them.
- Apple’s live cumulative iPadOS article contains iPadOS 14.0.1, 14.4.1,
  14.4.2, 14.5.1, 14.7, 14.7.1, 14.8, and 14.8.1, but those releases are
  absent locally and are therefore outside this batch.
- Apple’s security page dates iOS 14.7 to July 19, 2021 and iPadOS 14.7 to
  July 21, 2021. The local audit has no iPadOS 14.7 record, so the iOS entry
  is not duplicated onto iPadOS.
- No dedicated first-party security or developer release-note page was found
  for the local iOS 14.0.1 or iOS/iPadOS 14.1 records. Their consumer notes
  are cited without inventing additional security or SDK detail.
- Apple’s security bulletins are living documents and can gain or revise
  entries after release. Precise section or CVE locators and the
  `accessedAt` date preserve the reviewed context.
- iOS 14.5.1, 14.7.1, and 14.8 include specific vulnerabilities that Apple
  said may have been actively exploited. The synthesis preserves Apple’s
  qualified wording rather than converting it into a broader claim.
- The 100 structured entries are a reader-oriented synthesis of the documented
  feature, compatibility, developer, repair, and representative security
  record. They are not an assertion that every CVE or every line of Apple’s
  cumulative notes has become a separate database row.
- No community-sourced undocumented claim was added merely to increase volume.
  A later undocumented-change pass should require a release-specific,
  independently verifiable observation and record publisher, author when
  available, publication date, and either corroboration or an explicit
  verification method.
- Build records are intentionally empty. This pass did not find a complete,
  release-by-release first-party build-number source set, and a partial or
  inferred table would make the archive appear more complete than its evidence.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Repository research validation: passed across all seven checked-in batches;
  this cohort contains 19 versions, 19 events, 100 changes, 25 sources, and
  264 counted citations.
- Seed comparison: 19 local records, 19 version overlays, and 19 public-event
  overlays, with no missing or extra IDs.
- Target check: all 19 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`; no
  declared source is unused.
- Change identity check: 100 unique local keys and no conflicts across the
  seven research batches.
- Article check: every version has two cited prose blocks; the shortest article
  is 323 characters.
- Focused tests:
  `node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts`
  passed all 12 tests.

## Guarded Sanity apply

The production snapshot was read to resolve durable routes and create a guarded
plan. The exact reviewed plan was then applied and zero-residual verified.

- 25 source creates
- 100 `releaseChange` creates
- 19 revision-guarded `releaseVersion` patches
- 19 revision-guarded existing public `releaseEvent` patches
- 0 event creates
- 0 build creates
- 2,063 unchanged documents
- 233,559-byte mutation payload, 6.0% of the guarded limit

Exact applied plan SHA:
`72ca1bc9a66b8be69ea83a5fc6d3cb1e60103fa434d1741aa5ed88322e242968`.

Zero-residual transaction: `F0eE6eK5XyVXtlnaoxrcEz`.
