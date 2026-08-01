# Apple iOS 6 research batch

## Result

The companion manifest covers every iOS 6.x `releaseVersion` record and its
same-date Public milestone currently present in `scripts/seed-data.json`.

- 8 of 8 local version records have source-linked overview articles.
- 8 of 8 local Public appearances have release-specific summaries, articles,
  and structured changes.
- 36 structured change occurrences are attached to Public appearances: 12
  security corrections, 8 enhancements, 8 features, 7 bug fixes, and 1
  compatibility change.
- 9 source records are included: 7 Apple Support documents and 2 Apple
  Newsroom announcements.
- The local research validator counted 123 claim-level or page-level
  citations.
- Every event uses only the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  `2026-07-30T04:57:14Z`; every public event is indexable.
- No build record, beta or GM article, absent release record, production
  mutation, or Sanity command is included.

## Exact local coverage

| Record              | Seed Public date | First-party date evidence     | Changes | Overview blocks |
| ------------------- | ---------------- | ----------------------------- | ------: | --------------: |
| `version-ios-6-0`   | 2012-09-19       | 2012-09-19                    |      14 |               2 |
| `version-ios-6-0-1` | 2012-11-01       | 2012-11-01                    |       6 |               2 |
| `version-ios-6-0-2` | 2012-12-18       | No dated Apple source located |       1 |               1 |
| `version-ios-6-1`   | 2013-01-28       | 2013-01-28                    |       7 |               2 |
| `version-ios-6-1-1` | 2013-02-11       | No dated Apple source located |       1 |               1 |
| `version-ios-6-1-2` | 2013-02-19       | No dated Apple source located |       1 |               1 |
| `version-ios-6-1-3` | 2013-03-19       | 2013-03-19                    |       5 |               2 |
| `version-ios-6-1-4` | 2013-05-02       | No dated Apple source located |       1 |               1 |

Every listed local record has exactly one Public milestone, and that milestone
matches its local `publicReleaseDate`.

## Timeline-audit follow-up

Three chronology points need explicit human attention before this cohort is
approved:

1. The reviewed Apple security indexes independently date iOS 6.0, 6.0.1, 6.1,
   and 6.1.3, but they do not date the local iOS 6.0.2, 6.1.1, 6.1.2, or 6.1.4
   records. Apple's cumulative history confirms those four packages and their
   contents without giving historical release dates. The manifest therefore
   makes no prose claim that independently verifies their seed dates and
   contains no version or event identity fields that could overwrite them.
2. Apple's cumulative history includes **iOS 6.1.5** and **iOS 6.1.6**, both
   limited to iPod touch (4th generation), after the local 6.1.4 record. Neither
   version exists in the local catalog, so this batch does not create or
   redirect either release.
3. Apple's archived security indexes and release-specific advisories do not
   provide a new security bulletin for every small patch. The absence of a
   release-specific entry is not treated as proof that a release had no
   security effect; it only limits what this batch can attribute as a newly
   documented security delta.

## Release change inventory

| Version | Reader-facing scope                                                                                                                                                                                            |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 6.0     | Maps, Siri, Facebook, Shared Photo Streams, Passbook, FaceTime, call handling, Mail, Safari, stores, Game Center, accessibility, privacy, regional capabilities, and representative security repairs           |
| 6.0.1   | iPhone 5 over-the-air updates, keyboard and camera flash fixes, Wi-Fi and cellular reliability, iTunes Match, Exchange, Passbook lock-screen protection, kernel information exposure, and WebKit memory safety |
| 6.0.2   | Wi-Fi reliability                                                                                                                                                                                              |
| 6.1     | LTE carrier expansion, Siri movie-ticket purchasing, iTunes Match downloads, Advertising Identifier reset, certificate and identity validation, StoreKit, Wi-Fi parsing, kernel, and WebKit security           |
| 6.1.1   | iPhone 4S cellular reliability                                                                                                                                                                                 |
| 6.1.2   | Exchange calendar network activity and battery use                                                                                                                                                             |
| 6.1.3   | Phone passcode bypass, Maps in Japan, executable and backup-restore boundaries, kernel information exposure, USB driver handling, and WebKit SVG type safety                                                   |
| 6.1.4   | Speakerphone audio profile                                                                                                                                                                                     |

## Verified source set

All 9 URLs resolved to the named first-party Apple page during research on
2026-07-30.

### Consumer release history and release indexes

- [About iOS 6](https://support.apple.com/en-us/102995)
- [Apple security updates (2011 to 2012)](https://support.apple.com/en-us/101444)
- [Apple security updates (2013)](https://support.apple.com/en-us/100502)

### Apple announcements

- [Apple Previews iOS 6 With All New Maps, Siri Features, Facebook Integration, Shared Photo Streams & New Passbook App](https://www.apple.com/newsroom/2012/06/11Apple-Previews-iOS-6-With-All-New-Maps-Siri-Features-Facebook-Integration-Shared-Photo-Streams-New-Passbook-App/)
- [Apple Updates iOS to 6.1](https://www.apple.com/newsroom/2013/01/28Apple-Updates-iOS-to-6-1/)

### Release-specific security advisories

- [About the security content of iOS 6](https://support.apple.com/en-us/103599)
- [About the security content of iOS 6.0.1 Software Update](https://support.apple.com/en-us/103398)
- [About the security content of iOS 6.1 Software Update](https://support.apple.com/en-us/103817)
- [About the security content of iOS 6.1.3](https://support.apple.com/en-us/103600)

## Editorial and copyright method

The manifest contains original summaries rather than copied release-note
paragraphs. Every factual overview paragraph, article paragraph, page summary,
and structured change is tied to an Apple citation with a release, component,
or feature locator.

Closely related upstream bullets are grouped into reader-facing topics only
where they describe one coherent capability or security boundary. Security
language preserves Apple's qualifications about access and impact and does not
turn a possible outcome into a claim of observed exploitation.

Sparse consumer notes for iOS 6.0.2, 6.1.1, and 6.1.4, plus the Maps portion of
iOS 6.1.3, are marked `partiallyDocumented` because Apple names the affected
area without itemizing the underlying technical changes. All other
occurrences are `documented` and `confirmed`.

Apple product and feature names are used nominatively to identify the
historical software. The articles do not imply affiliation, endorsement, or
ownership of Apple's release notes.

## Evidence limits

- The 36 changes are a reader-oriented synthesis, not a claim that every
  consumer bullet or every CVE has been converted into a separate record.
  Large security bulletins use representative, coherently grouped entries.
- The cumulative iOS 6 history says the 6.1.4 package includes security content
  from previous updates. The batch records only its newly described
  speakerphone change and does not re-label inherited repairs as 6.1.4 deltas.
- No community report or undocumented change was added merely to increase
  coverage. A later community-evidence pass should require a stable source,
  publication metadata, a precise claim locator, and corroboration or a
  reproducible verification method.
- `builds` is intentionally empty. The reviewed sources do not establish a
  complete, release-specific build-number mapping for all eight local records.
- Beta and GM milestones remain untouched because this cohort was scoped to
  existing Public routes.
- Apple Support pages are living documents. The manifest's `accessedAt` value
  and detailed locators preserve the reviewed context even if Apple later
  revises a page.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Repository research validation: passed; at validation time it checked 22
  batches, including this cohort's 8 versions, 8 events, 36 changes, 9 sources,
  and 123 counted citations.
- Seed comparison: 8 local iOS 6.x records, 8 version overlays, and 8
  Public-event overlays, with no missing or extra IDs.
- Target check: all 8 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`, and every
  declared source is used.
- Change identity check: all 36 local keys are unique and the repository
  validator found no conflict with another batch.
- Review-state check: all 16 records are `editoriallyVerified` and `approved`;
  all 8 events have `isIndexable: true`.
- Guarded production apply: 44 creates and 16 revision-guarded patches, with 8
  source creates, 36 change creates, 8 version patches, and zero version,
  event, or build creates.
- Applied production plan SHA:
  `04a1cdc38caae970d8d6cecafcd1688929fe5dfbdacec322213b2fe87ba939ea`.
- Production transaction: `eOgq1Ovu5XNUv1qNFUaggR`.
- The apply completed with a zero-residual verification.

## Human approval checklist

- [x] Explicitly retain the seed dates for iOS 6.0.2, 6.1.1, 6.1.2, and 6.1.4
      as locally sourced chronology without claiming first-party date
      verification.
- [x] Leave iOS 6.1.5 and 6.1.6 to a separate chronology addition because no
      local release records exist.
- [x] Review and accept the representative grouping of large security
      bulletins.
- [x] Approve the original synthesis, provenance, review, and indexing state.
