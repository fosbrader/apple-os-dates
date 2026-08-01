# Apple iOS 7 research batch

## Result

The companion manifest covers every iOS 7.x `releaseVersion` record and its
same-date Public milestone currently present in `scripts/seed-data.json`.

- 9 of 9 local version records have source-linked overview articles.
- 9 of 9 local Public appearances have release-specific summaries, articles,
  and structured changes.
- 47 structured change occurrences are attached to Public appearances: 17
  security corrections, 13 enhancements, 7 bug fixes, 6 features, 2 behavior
  changes, and 2 compatibility changes.
- 13 source records are included: 11 Apple Support documents and 2 Apple
  Newsroom announcements.
- The local research validator counted 165 claim-level or page-level
  citations.
- Every event uses only the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  `2026-07-30T04:50:50Z`; every public event is indexable.
- No build record, beta or GM article, absent release record, production
  mutation, or Sanity command is included.

## Exact local coverage

| Record              | Seed Public date | First-party date evidence     | Changes | Overview blocks |
| ------------------- | ---------------- | ----------------------------- | ------: | --------------: |
| `version-ios-7-0`   | 2013-09-18       | 2013-09-18                    |      11 |               2 |
| `version-ios-7-0-1` | 2013-09-20       | No dated Apple source located |       1 |               1 |
| `version-ios-7-0-2` | 2013-09-26       | 2013-09-26                    |       3 |               2 |
| `version-ios-7-0-3` | 2013-10-23       | **2013-10-22 — conflict**     |       7 |               2 |
| `version-ios-7-0-4` | 2013-11-14       | 2013-11-14                    |       2 |               2 |
| `version-ios-7-0-6` | 2014-02-21       | 2014-02-21                    |       1 |               2 |
| `version-ios-7-1`   | 2014-03-10       | 2014-03-10                    |      10 |               2 |
| `version-ios-7-1-1` | 2014-04-22       | 2014-04-22                    |       5 |               2 |
| `version-ios-7-1-2` | 2014-06-30       | 2014-06-30                    |       7 |               2 |

Every listed local record has exactly one Public milestone, and that milestone
matches its local `publicReleaseDate`.

## Timeline-audit follow-up

Three chronology points need explicit human attention before this cohort is
approved:

1. The seed records iOS 7.0.3 on **October 23, 2013**, while Apple’s archived
   2013 security index records **October 22, 2013**. The batch does not contain
   version or event identity fields and therefore does not overwrite either
   date; it only targets the existing Public route.
2. Apple’s cumulative history confirms that iOS 7.0.1 existed and was limited
   to iPhone 5c and iPhone 5s, but the reviewed Apple security index does not
   list it and no dated first-party release page was located. The manifest
   makes no prose claim about its September 20 seed date.
3. Apple’s cumulative iOS 7 history includes **iOS 7.0.5**, between 7.0.4 and
   7.0.6, for network provisioning on certain iPhone 5s and iPhone 5c models
   sold in China mainland. No 7.0.5 record exists in the local catalog, so this
   batch does not create or redirect that release.

## Release change inventory

| Version | Reader-facing scope                                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 7.0     | Redesign, Control and Notification Centers, multitasking, Camera and Photos, AirDrop, Safari, Siri, iTunes Radio, App Store, Activation Lock, accessibility, administration, and representative security repairs |
| 7.0.1   | Device-limited maintenance only; individual fixes are not documented                                                                                                                                             |
| 7.0.2   | Two lock-screen protections and restored Greek passcode input                                                                                                                                                    |
| 7.0.3   | iCloud Keychain, password generation, Spotlight, iMessage, reliability, accessibility, supervision, Touch ID presentation, and lock-screen security                                                              |
| 7.0.4   | FaceTime reliability and App Store purchase authorization                                                                                                                                                        |
| 7.0.6   | Secure Transport SSL/TLS validation                                                                                                                                                                              |
| 7.1     | CarPlay, Siri, iTunes Radio, Calendar, accessibility, Camera, Keychain, FaceTime, Touch ID, performance, reliability, and representative security repairs                                                        |
| 7.1.1   | Touch ID, keyboard and VoiceOver maintenance, HTTP/SSL session security, kernel information exposure, and WebKit memory safety                                                                                   |
| 7.1.2   | iBeacon, accessories, Mail attachment protection, device/account boundaries, launchd, Safari/WebKit, trust policy, and kernel validation                                                                         |

## Verified source set

All 13 URLs resolved to the named first-party Apple page during research on
2026-07-30.

### Consumer release history and release indexes

- [About iOS 7 Updates](https://support.apple.com/en-us/102996)
- [Apple security updates (2013)](https://support.apple.com/en-us/100502)
- [Apple security updates (2014)](https://support.apple.com/en-us/101445)

### Apple announcements

- [iOS 7 With Completely Redesigned User Interface & Great New Features Available September 18](https://www.apple.com/newsroom/2013/09/10iOS-7-With-Completely-Redesigned-User-Interface-Great-New-Features-Available-September-18/)
- [Apple Rolls Out CarPlay Giving Drivers a Smarter, Safer & More Fun Way to Use iPhone in the Car](https://www.apple.com/newsroom/2014/03/03Apple-Rolls-Out-CarPlay-Giving-Drivers-a-Smarter-Safer-More-Fun-Way-to-Use-iPhone-in-the-Car/)

### Release-specific security advisories

- [iOS 7](https://support.apple.com/en-us/103603)
- [iOS 7.0.2](https://support.apple.com/en-us/103604)
- [iOS 7.0.3](https://support.apple.com/en-us/103605)
- [iOS 7.0.4](https://support.apple.com/en-us/103606)
- [iOS 7.0.6](https://support.apple.com/en-us/103608)
- [iOS 7.1](https://support.apple.com/en-us/103662)
- [iOS 7.1.1](https://support.apple.com/en-us/103609)
- [iOS 7.1.2](https://support.apple.com/en-us/103610)

## Editorial and copyright method

The manifest contains original summaries rather than copied release-note
paragraphs. Every factual overview paragraph, article paragraph, page summary,
and structured change is tied to an Apple citation with a release, component,
or CVE locator.

Closely related upstream bullets are grouped into reader-facing topics only
where they describe one coherent capability or security boundary. Security
language preserves Apple’s qualifications about access and impact and does not
turn a possible outcome into a claim of observed exploitation.

The iOS 7.0.1 maintenance occurrence is marked `partiallyDocumented` because
Apple confirms the package and device scope but not its individual fixes. All
other occurrences are `documented` and `confirmed`.

Apple product and feature names are used nominatively to identify the
historical software. The articles do not imply affiliation, endorsement, or
ownership of Apple’s release notes.

## Evidence limits

- The 47 changes are a reader-oriented synthesis, not a claim that every
  consumer bullet or every CVE has been converted into a separate record.
  Large security bulletins use representative, coherently grouped entries.
- No security delta is attributed to iOS 7.0.1 because no release-specific
  Apple security advisory or security-index entry was found.
- No community report or undocumented change was added merely to increase
  coverage. A later community-evidence pass should require a stable source,
  publication metadata, a precise claim locator, and corroboration or a
  reproducible verification method.
- `builds` is intentionally empty. The reviewed sources do not establish a
  complete, release-specific build-number mapping for all nine local records.
- Beta and GM milestones remain untouched because this cohort was scoped to
  existing Public routes.
- Apple Support pages are living documents. The manifest’s `accessedAt` value
  and detailed locators preserve the reviewed context even if Apple later
  revises a page.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Repository research validation: passed across all 20 checked-in batches;
  this cohort contains 9 versions, 9 events, 47 changes, 13 sources, and 165
  counted citations.
- Focused ingestion and manifest tests: 19 of 19 passed.
- Seed comparison: 9 local iOS 7.x records, 9 version overlays, and 9
  Public-event overlays, with no missing or extra IDs.
- Target check: all 9 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`, and every
  declared source is used.
- Change identity check: all 47 local keys are unique and the repository
  validator found no conflict with another batch.
- Review-state check: all 18 records are `editoriallyVerified` and `approved`;
  all 9 events have `isIndexable: true`.
- Guarded production apply: 60 creates and 18 revision-guarded patches, with 13
  source creates, 47 change creates, 9 version patches, and zero version,
  event, or build creates.
- Applied production plan SHA:
  `5a5e1a1fddeaf3ee571fb3a3f0247246d6ec22a2024972db8be00b9c6779efc2`.
- Production transaction: `tt1fSB5HY9GAB0YLyxrt2U`.
- The apply completed with a zero-residual verification.

## Human approval checklist

- [x] Preserve and explicitly disclose the iOS 7.0.3 October 22/23 date
      conflict without mutating chronology.
- [x] Preserve the September 20, 2013 seed date for iOS 7.0.1 without
      presenting it as first-party-verified in the article.
- [x] Leave iOS 7.0.5 to a separate chronology addition because no local
      release record exists.
- [x] Review and accept the representative grouping of large security
      bulletins.
- [x] Approve the original synthesis, provenance, review, and indexing state.
