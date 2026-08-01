# Apple iOS 12 research batch

## Result

The companion manifest covers every audited iOS 12.x `releaseVersion` record
currently present in `scripts/seed-data.json`.

- 11 of 11 local version records have source-linked overview articles.
- 11 of 11 local public appearances have release-specific summaries and
  structured changes.
- 22 cited overview paragraphs provide the version-level articles.
- 63 structured change occurrences are attached to public appearances.
- 22 source records are included, all from first-party Apple documentation or
  announcements.
- The local validator counted 184 claim-level or page-level citations.
- 0 build records are included; see the evidence gaps below.
- Every event uses the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` after the
  editorial pass. Public events are indexable.
- No beta or release-candidate event was modified, no missing release record
  was invented, and no Sanity write was performed.

## Exact coverage

| Release    | Public date in local audit | Changes | Article blocks | Durable public target           |
| ---------- | -------------------------- | ------: | -------------: | ------------------------------- |
| iOS 12.0   | 2018-09-17                 |      10 |              2 | `version-ios-12-0` + `public`   |
| iOS 12.0.1 | 2018-10-08                 |       6 |              2 | `version-ios-12-0-1` + `public` |
| iOS 12.1   | 2018-10-30                 |       7 |              2 | `version-ios-12-1` + `public`   |
| iOS 12.1.1 | 2018-12-05                 |       7 |              2 | `version-ios-12-1-1` + `public` |
| iOS 12.1.2 | 2018-12-17                 |       2 |              2 | `version-ios-12-1-2` + `public` |
| iOS 12.1.3 | 2019-01-22                 |       6 |              2 | `version-ios-12-1-3` + `public` |
| iOS 12.2   | 2019-03-25                 |       9 |              2 | `version-ios-12-2` + `public`   |
| iOS 12.3   | 2019-05-13                 |       6 |              2 | `version-ios-12-3` + `public`   |
| iOS 12.3.1 | 2019-05-24                 |       3 |              2 | `version-ios-12-3-1` + `public` |
| iOS 12.4   | 2019-07-22                 |       6 |              2 | `version-ios-12-4` + `public`   |
| iOS 12.4.1 | 2019-08-26                 |       1 |              2 | `version-ios-12-4-1` + `public` |

## Verified source set

All 22 URLs resolved to the named first-party Apple page during research on
2026-07-29. Apple Developer documentation is JavaScript-rendered, but each
human-readable URL resolved with the expected release-note title. The manifest
does not expose Apple’s DocC transport JSON as a reader-facing citation.

### Consumer release notes

- [About iOS 12 Updates](https://support.apple.com/en-us/118387)

### Apple Developer release notes

- [iOS 12 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12-release-notes)
- [iOS 12.1 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12_1-release-notes)
- [iOS 12.1.1 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12_1_1-release-notes)
- [iOS 12.1.3 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12_1_3-release-notes)
- [iOS 12.2 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12_2-release-notes)
- [iOS 12.3 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12_3-release-notes)
- [iOS 12.4 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-12_4-release-notes)

### Apple security documentation

- [Apple Security Updates (2018 to 2019)](https://support.apple.com/en-us/103179)
- [iOS 12](https://support.apple.com/en-us/103695)
- [iOS 12.0.1](https://support.apple.com/en-us/103699)
- [iOS 12.1](https://support.apple.com/en-us/103089)
- [iOS 12.1.1](https://support.apple.com/en-us/103704)
- [iOS 12.1.3](https://support.apple.com/en-us/103090)
- [iOS 12.2](https://support.apple.com/en-us/103820)
- [iOS 12.3](https://support.apple.com/en-us/103101)
- [iOS 12.4](https://support.apple.com/en-us/103020)
- [iOS 12.4.1](https://support.apple.com/en-us/103771)

### Apple Newsroom

- [iOS 12 Is Available Today](https://www.apple.com/newsroom/2018/09/ios-12-is-available-today/)
- [iOS 12.1 Brings Group FaceTime and New Emoji to iPhone and iPad](https://www.apple.com/newsroom/2018/10/ios-12-1-brings-group-facetime-and-new-emoji-to-iphone-and-ipad/)
- [Apple Launches Apple News+](https://www.apple.com/newsroom/2019/03/apple-launches-apple-news-plus-an-immersive-magazine-and-news-reading-experience/)
- [All-New Apple TV App Available in Over 100 Countries](https://www.apple.com/newsroom/2019/05/all-new-apple-tv-app-available-in-over-100-countries-starting-today/)

## Editorial and copyright method

The manifest contains original synthesis rather than copied release-note
paragraphs. Every factual overview paragraph, event summary, and structured
change is tied to an explicit Apple citation and locator. Closely related Apple
bullets are sometimes grouped into one reader-facing change when they describe
one coherent feature area; those groupings use new prose rather than reproducing
Apple’s wording.

The batch does not label ordinary Apple documentation as “undocumented.” It
also does not assign cumulative public notes to beta events. A claim is attached
only to the modeled public appearance for which the cited source supports it.

Trademarked product and feature names are used only as needed to identify the
software, device, or feature being documented. The content does not imply
affiliation with or endorsement by Apple.

## Evidence gaps and deliberate limits

- Apple’s live cumulative article contains 19 later or device-specific iOS 12
  releases absent from the audited local dataset: 12.1.4, 12.3.2, 12.4.2
  through 12.4.9, and 12.5 through 12.5.8. This batch does not silently create
  them.
- Apple’s security index explicitly says iOS 12.1.2 and iOS 12.3.1 have no
  published CVE entries. Their consumer fixes are documented without inferring
  undisclosed security work.
- No dedicated first-party developer release-note page was found for iOS
  12.0.1, 12.1.2, 12.3.1, or 12.4.1. Their consumer notes are cited without
  inventing SDK detail.
- Apple’s security bulletins are living documents and can gain or revise
  entries after release. Precise section or CVE locators and the `accessedAt`
  date preserve the reviewed context.
- The 63 structured entries are a reader-oriented synthesis of the documented
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
- Repository research validation: passed across all 12 checked-in batches;
  this cohort contains 11 versions, 11 events, 63 changes, 22 sources, and 184
  counted citations.
- Seed comparison: 11 local records, 11 version overlays, and 11 public-event
  overlays, with no missing or extra IDs.
- Target check: all 11 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`; no
  declared source is unused.
- Change identity check: 63 unique local keys and no conflicts across the 12
  research batches.
- Article check: every version has two cited prose blocks; the shortest article
  is 319 characters.
- Focused tests:
  `node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts`
  passed all 12 tests.
- Placeholder scan: no placeholder, lorem, TODO, TBD, “coming soon,” “details
  forthcoming,” or “additional information” text was found.

## Guarded Sanity apply

The production snapshot was read to resolve durable routes and generate a
guarded plan. After editorial approval at `2026-07-30T04:16:06Z`, the exact
reviewed plan was applied.

- 21 source creates and 1 revision-guarded update to a reused source
- 63 `releaseChange` creates
- 11 revision-guarded `releaseVersion` patches
- 11 revision-guarded existing public `releaseEvent` patches
- 0 event creates
- 0 build creates
- 2,071 unchanged documents
- 153,519-byte mutation payload, 3.9% of the guarded limit

Exact applied plan SHA:
`39844bc27bbbae685e6a9f257e77fae93c17b6754e0533e403fa80366047d252`.
Sanity committed transaction `eOgq1Ovu5XNUv1qNFUWryJ`, and the ingestion
pipeline verified zero residual mutations.
