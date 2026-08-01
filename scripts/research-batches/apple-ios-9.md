# Apple iOS 9 research batch

## Result

The companion manifest covers every audited iOS 9.x `releaseVersion` record
currently present in `scripts/seed-data.json`.

- 11 of 11 local version records have source-linked overview articles.
- 11 of 11 local public appearances have release-specific summaries and
  structured changes.
- 22 cited overview paragraphs provide the version-level articles.
- 64 structured change occurrences are attached to public appearances: 23 bug
  fixes, 17 security corrections, 14 enhancements, 9 features, and 1
  compatibility change.
- 13 source records are included, all from first-party Apple Support.
- The local validator counted 153 claim-level or page-level citations.
- 0 build records are included; see the evidence limits below.
- Every event uses the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` after the
  editorial pass. Public events are indexable.
- No beta or release-candidate event was enriched, no absent release record was
  created, and no Sanity write was performed.

## Exact local coverage

| Record              | Public date | Changes | Article blocks | Route  |
| ------------------- | ----------- | ------: | -------------: | ------ |
| `version-ios-9-0`   | 2015-09-16  |      10 |              2 | public |
| `version-ios-9-0-1` | 2015-09-23  |       4 |              2 | public |
| `version-ios-9-0-2` | 2015-09-30  |       6 |              2 | public |
| `version-ios-9-1`   | 2015-10-21  |       7 |              2 | public |
| `version-ios-9-2`   | 2015-12-08  |       8 |              2 | public |
| `version-ios-9-2-1` | 2016-01-19  |       2 |              2 | public |
| `version-ios-9-3`   | 2016-03-21  |      11 |              2 | public |
| `version-ios-9-3-1` | 2016-03-31  |       1 |              2 | public |
| `version-ios-9-3-2` | 2016-05-16  |       7 |              2 | public |
| `version-ios-9-3-3` | 2016-07-18  |       5 |              2 | public |
| `version-ios-9-3-5` | 2016-08-25  |       3 |              2 | public |

Every local record has exactly one Public milestone whose date matches its
`publicReleaseDate`.

## Verified source set

All 13 URLs resolved to the named first-party Apple page during research on
2026-07-30.

### Consumer release notes

- [About iOS 9 Updates](https://support.apple.com/en-us/103834)

### Apple security release indexes

- [Apple Security Updates (2015)](https://support.apple.com/en-us/103813)
- [Apple Security Updates (2016 to 2017)](https://support.apple.com/en-us/103178)

### Release-specific Apple security bulletins

- [iOS 9](https://support.apple.com/en-us/103713)
- [iOS 9.0.2](https://support.apple.com/en-us/103659)
- [iOS 9.1](https://support.apple.com/en-us/103660)
- [iOS 9.2](https://support.apple.com/en-us/103661)
- [iOS 9.2.1](https://support.apple.com/en-us/103620)
- [iOS 9.3](https://support.apple.com/en-us/103622)
- [iOS 9.3.1](https://support.apple.com/en-us/103623)
- [iOS 9.3.2](https://support.apple.com/en-us/103625)
- [iOS 9.3.3](https://support.apple.com/en-us/103627)
- [iOS 9.3.5](https://support.apple.com/en-us/103628)

## Editorial and copyright method

The manifest uses original synthesis rather than copied release-note
paragraphs. Every factual overview paragraph, event summary, and structured
change has a claim-level Apple citation and a release or component locator.
Related Apple bullets are grouped only when they form one coherent
reader-facing feature area, and those groupings are rewritten in new prose.

Consumer features are attached only to the corresponding existing Public
appearance. Security entries describe the documented impact and remedy
conservatively; they do not expand Apple’s qualified language into a broader
claim. A representative subset of large security bulletins is structured for
readability, while all three entries in the unusually small iOS 9.3.5 bulletin
are represented.

Trademarked names are used only to identify the documented software, devices,
services, and features. The content does not imply affiliation with or
endorsement by Apple.

## Local inventory gaps and source limitations

- Apple’s cumulative iOS 9 history contains two shipped versions absent from
  the local dataset: **iOS 9.3.4** and **iOS 9.3.6**. This batch does not create
  those `releaseVersion` records or redirect their content onto another
  release.
- Apple’s 2015 security index does not list iOS 9.0.1 and no dedicated
  release-specific security bulletin was found. Its article and four
  structured changes therefore stay within Apple’s itemized consumer notes.
- Apple’s iOS 9.3.1 security page says that release includes the security
  content of iOS 9.3. It is not converted into a new security delta.
- Apple describes iOS 9.3.3 generically as a bug-fix and security update but
  does not itemize the general bug fixes. Its structured entries are limited
  to specific claims in Apple’s security bulletin.
- The 64 changes are a reader-oriented synthesis, not a claim that every line
  of the cumulative notes or every CVE has become a separate row.
- Apple Support pages are living documents. Their `accessedAt` date and
  component or CVE locators preserve the reviewed context even if Apple later
  revises an entry.
- No community-sourced or undocumented claim was added merely to increase
  volume. A future undocumented-change pass should require release-specific
  evidence, publisher and author metadata where available, publication date,
  and either independent corroboration or a reproducible verification method.
- Build records are intentionally empty. The reviewed first-party support and
  security pages do not establish a complete public-build mapping for all 11
  local releases, and a partial or inferred table would overstate the archive’s
  evidence.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Repository research validation: passed across all 14 checked-in batches;
  this cohort contains 11 versions, 11 events, 64 changes, 13 sources, and 153
  counted citations.
- Seed comparison: 11 local records, 11 version overlays, and 11 public-event
  overlays, with no missing or extra IDs.
- Public-date check: every local iOS 9 record has exactly one same-date Public
  milestone.
- Target check: all 11 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`; no
  declared source is unused.
- Change identity check: 64 unique local keys and no conflicts across the 14
  research batches.
- Article check: every version has two cited prose blocks; the shortest article
  is 290 characters.
- Focused tests:
  `node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts`
  passed all 12 tests.
- Placeholder scan: no placeholder, lorem, TODO, TBD, “coming soon,” “details
  forthcoming,” or “additional information” text was found.

## Guarded Sanity apply

The production snapshot was read to resolve durable public routes and generate
a guarded plan. After editorial approval at `2026-07-30T04:31:06Z`, the exact
reviewed plan was applied.

- 13 source creates
- 64 `releaseChange` creates
- 11 revision-guarded `releaseVersion` patches
- 11 revision-guarded existing public `releaseEvent` patches
- 0 event creates
- 0 build creates
- 2,071 unchanged documents
- 135,661-byte mutation payload, 3.5% of the guarded limit

Exact applied plan SHA:
`b156c20f7162cc94f1d679c1c1e6e77e62cb8a5d97a40203de8d861bd5732f68`.
Sanity committed transaction `eOgq1Ovu5XNUv1qNFUYaZL`, and the ingestion
pipeline verified zero residual mutations.
