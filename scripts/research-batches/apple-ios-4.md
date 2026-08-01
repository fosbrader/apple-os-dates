# Apple iOS 4 research batch

## Result

The companion manifest covers every iOS 4.x `releaseVersion` record and its
same-date Public milestone currently present in `scripts/seed-data.json`.

- 11 of 11 local version records have source-linked overview articles.
- 11 of 11 local Public appearances have release-specific summaries and
  article bodies.
- 56 structured change occurrences are attached to Public appearances: 32
  security corrections, 8 features, 6 enhancements, 6 bug fixes, 2
  compatibility changes, 1 behavior change, and 1 developer-platform change.
- 18 source records are included: 10 Apple Support documents, 7 Apple
  Newsroom announcements or statements, and 1 contemporaneous MacRumors report
  preserving the otherwise unavailable iOS 4.3.1 update notice.
- The repository citation audit counted 203 claim-level or page-level
  citations.
- Every event uses only the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  `2026-07-30T05:16:29Z`. Public events are indexable after editorial review.
- No build record, beta or GM article, absent release record, production
  mutation, or Sanity command is included.

## Exact local coverage

| Record              | Seed Public date | First-party date evidence                                     | Changes | Article blocks |
| ------------------- | ---------------- | ------------------------------------------------------------- | ------: | -------------: |
| `version-ios-4-0`   | 2010-06-21       | 2010-06-21                                                    |      12 |              2 |
| `version-ios-4-0-1` | 2010-07-15       | No dated Apple release page located                           |       1 |              2 |
| `version-ios-4-0-2` | 2010-08-11       | 2010-08-11                                                    |       2 |              2 |
| `version-ios-4-1`   | 2010-09-08       | 2010-09-08                                                    |       6 |              2 |
| `version-ios-4-2-1` | 2010-11-22       | 2010-11-22, but contemporary Apple pages label it **iOS 4.2** |      11 |              2 |
| `version-ios-4-3`   | 2011-03-09       | 2011-03-09; Newsroom originally announced **2011-03-11**      |      10 |              2 |
| `version-ios-4-3-1` | 2011-03-25       | Contemporary report dated 2011-03-25; no Apple page located   |       4 |              2 |
| `version-ios-4-3-2` | 2011-04-14       | 2011-04-14                                                    |       5 |              2 |
| `version-ios-4-3-3` | 2011-05-04       | No Apple page explicitly naming the package and date located  |       1 |              2 |
| `version-ios-4-3-4` | 2011-07-15       | 2011-07-15                                                    |       3 |              2 |
| `version-ios-4-3-5` | 2011-07-25       | 2011-07-25                                                    |       1 |              2 |

Every listed local record has exactly one Public milestone, and that milestone
matches its local `publicReleaseDate`.

## Timeline and naming audit

Five chronology or source-boundary points need explicit human attention before
this cohort is approved:

1. Apple’s July 2, 2010 signal letter defines a forthcoming software correction
   for the displayed signal-bar calculation, and Apple’s iOS 4.0.2 advisory
   later identifies iOS 4.0.1 as an affected predecessor. The letter does not
   name iOS 4.0.1, and the archived 2010 security index does not list the
   package. The single 4.0.1 occurrence is therefore
   `partiallyDocumented`/`corroborated`, and the article does not present the
   July 15 seed date as independently verified by Apple.
2. Apple’s November 22 announcement and dedicated security bulletin call the
   public package **iOS 4.2**, while the local catalog calls it **4.2.1**.
   Apple’s later iOS 4.3 advisory explicitly covers systems through iOS 4.2.1,
   providing first-party confirmation of the installed version number. The
   batch preserves the local 4.2.1 identity and explains the contemporary
   naming difference instead of creating a second 4.2 record.
3. Apple Newsroom originally announced that iOS 4.3 would become available on
   March 11, 2011. Apple’s archived security index records March 9, matching the
   seed. The batch keeps the existing route and discloses both first-party
   dates.
4. The reviewed first-party corpus confirms iOS 4.3.1 as the predecessor range
   for iOS 4.3.2, but no surviving Apple page with its consumer release notes
   or March 25 date was located. A contemporaneous MacRumors report dated March
   25 preserves the four-item update notice. The page and source registry
   identify that evidence as journalism rather than presenting it as a
   surviving first-party page.
5. Apple’s April 27 location-data statement promised an imminent update that
   would reduce, stop backing up, and conditionally delete the location-assist
   cache. The later iOS 4.3.4 advisory confirms 4.3.3 as a predecessor, but
   neither page explicitly says the promised work shipped as iOS 4.3.3 or
   verifies the May 4 seed date. Its single occurrence is consequently
   `partiallyDocumented`/`corroborated` and describes the incomplete version
   linkage.

The absence of 4.0.1, 4.3.1, and 4.3.3 from Apple’s archived security indexes
is not treated as evidence that those releases did not exist. Those indexes
catalog security advisories, not every consumer maintenance release.

## Release change inventory

| Version | Reader-facing scope                                                                                                                                                                                                                                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.0     | Multitasking, folders, Mail, iBooks, enterprise management and data protection, iAd, privacy boundaries, device locking, image parsing, Safari, and representative WebKit repairs                                                                    |
| 4.0.1   | Signal-bar formula and presentation context, with the missing first-party version linkage made explicit                                                                                                                                              |
| 4.0.2   | Crafted-PDF FreeType bounds checking and IOSurface privilege protection                                                                                                                                                                              |
| 4.1     | Game Center, FaceTime on the new iPod touch, VoiceOver location cues, FaceTime certificate handling, image parsing, and WebKit                                                                                                                       |
| 4.2.1   | iOS 4 features on iPad, AirPlay, AirPrint, free Find My device access on qualifying hardware, Safari and enterprise expansion, configuration profiles, fonts and images, iAd call confirmation, Mail privacy, networking, passcode state, and WebKit |
| 4.3     | Nitro Safari, iTunes Home Sharing, expanded AirPlay, Personal Hotspot, the iPad side switch, parser safety, IPv6 privacy, Safari, WebKit, and Wi-Fi                                                                                                  |
| 4.3.1   | iPod touch graphics, cellular activation and connectivity, Digital AV Adapter flicker, and enterprise web-service authentication, sourced to a contemporaneous report preserving the update notice                                                   |
| 4.3.2   | Fraudulent certificate rejection, libxslt address disclosure, QuickLook Office parsing, and two WebKit memory defects                                                                                                                                |
| 4.3.3   | Location-cache maintenance context with explicit incomplete version linkage                                                                                                                                                                          |
| 4.3.4   | Two crafted-PDF font corrections and an IOMobileFrameBuffer privilege boundary                                                                                                                                                                       |
| 4.3.5   | X.509 certificate-chain validation                                                                                                                                                                                                                   |

## Verified source set

All 18 URLs resolved to the named page during research on 2026-07-30.

### Release indexes

- [Apple security updates (2010)](https://support.apple.com/en-us/104188)
- [Apple security updates (2011 to 2012)](https://support.apple.com/en-us/101444)

### Release-specific security advisories

- [About the security content of iOS 4](https://support.apple.com/en-us/104167)
- [About the security content of the iOS 4.0.2 Update for iPhone and iPod touch](https://support.apple.com/en-us/103586)
- [About the security content of iOS 4.1 for iPhone and iPod touch](https://support.apple.com/en-us/103587)
- [About the security content of iOS 4.2](https://support.apple.com/en-us/103588)
- [About the security content of iOS 4.3](https://support.apple.com/en-us/103764)
- [About the security content of iOS 4.3.2 Software Update](https://support.apple.com/en-us/103590)
- [About the security content of iOS 4.3.4 Software Update](https://support.apple.com/en-us/103591)
- [About the security content of iOS 4.3.5 Software Update for iPhone](https://support.apple.com/en-us/103594)

### Apple announcements and statements

- [Apple Previews iPhone OS 4](https://www.apple.com/newsroom/2010/04/08Apple-Previews-iPhone-OS-4/)
- [Apple Presents iPhone 4](https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/)
- [Letter from Apple Regarding iPhone 4](https://www.apple.com/newsroom/2010/07/02Letter-from-Apple-Regarding-iPhone-4/)
- [Apple Introduces New iPod touch](https://www.apple.com/newsroom/2010/09/01Apple-Introduces-New-iPod-touch/)
- [Apple’s iOS 4.2 Available Today for iPad, iPhone & iPod touch](https://www.apple.com/newsroom/2010/11/22Apples-iOS-4-2-Available-Today-for-iPad-iPhone-iPod-touch/)
- [Apple Introduces iOS 4.3](https://www.apple.com/newsroom/2011/03/02Apple-Introduces-iOS-4-3/)
- [Apple Q&A on Location Data](https://www.apple.com/newsroom/2011/04/27Apple-Q-A-on-Location-Data/)

### Contemporaneous reporting

- [Apple Releases iOS 4.3.1](https://www.macrumors.com/2011/03/25/apple-releases-ios-4-3-1/)
  — MacRumors, Eric Slivka, March 25, 2011. This source preserves the
  four-item update notice and is registered as `journalism`, not first-party
  documentation.

## Editorial and copyright method

The manifest contains original summaries rather than copied release-note
paragraphs. Every factual overview paragraph, event article paragraph, page
summary, and structured change is tied to a declared citation with a release,
component, CVE, announcement section, update-notice item, or chronology
locator.

Closely related upstream security entries are grouped only when they describe
one coherent reader-facing boundary, such as image parsing or WebKit memory
safety. Specific attack prerequisites are retained: physical access, code
already running as the user, a malicious document or site, a neighboring Wi-Fi
attacker, or a privileged network position are not collapsed into broader
claims.

The 4.0.1 and 4.3.3 occurrences preserve the useful contemporary Apple context
but are visibly `partiallyDocumented` and `corroborated`; their summaries state
that the reviewed source does not name the package. iOS 4.3.1 receives four
structured entries synthesized from the cited contemporary reproduction of
the update notice, with the lack of a surviving Apple page disclosed in the
article.

Apple product and feature names are used nominatively to identify historical
software. The articles do not imply affiliation, endorsement, or ownership of
Apple’s release notes.

## Evidence limits

- The 56 changes are a reader-oriented synthesis, not a claim that every
  consumer sentence or every CVE has been converted into an individual record.
  Large security bulletins use representative, coherently grouped entries.
- The iOS 4.3.1 entries rely on a stable, contemporaneous MacRumors article
  because no surviving first-party release-note page was located. The manifest
  records the publisher, author, publication time, and item-level locators and
  uses original synthesis rather than reproducing the notice.
- The iOS 4.3.2 article limits itself to Apple’s surviving security advisory;
  it does not import commonly reproduced FaceTime or iPad connectivity bullets
  without a primary page.
- No community report or undocumented change was added merely to increase
  coverage. A later community-evidence pass should require stable publication
  metadata, a precise claim locator, and corroboration or a reproducible
  verification method.
- `builds` is intentionally empty. No complete first-party, release-specific
  build-number mapping was established for all eleven local records.
- Beta and GM milestones remain untouched because this cohort is scoped to
  existing Public routes.
- Apple Support pages are living or archived documents. The manifest’s
  `accessedAt` value and detailed locators preserve the reviewed context even
  if Apple later revises a page.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Seed comparison: 11 local iOS 4.x records, 11 version overlays, and 11
  Public-event overlays, with no missing or extra IDs.
- Target check: all 11 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`, and every
  one of the 18 declared sources is used.
- Change identity check: all 56 local keys are unique.
- Review-state check: all 22 records are `editoriallyVerified` and `approved`;
  all 11 events have `isIndexable: true`.
- Repository research validation: passed across 24 checked-in batches and
  1,458 globally consistent change keys.
- Focused launch-content ingestion and manifest tests: 19 passed, 0 failed
  using `node --import tsx --test`.
- Generator parity check: rerunning `build-apple-ios-4.mjs` reproduced the JSON
  byte-for-byte; SHA-256
  `ac847515e145f084883e9d54344030b844a844f1c96ecabd21f87cd2279c9d3f`.
- Focused ESLint check for the generator: passed with no findings.
- Reviewed production plan: 73 creates, 22 revision-guarded patches, and 2,072
  unchanged documents.
- Creates: 17 source documents and 56 change documents; zero version, event, or
  build creates. The plan patched 11 existing versions and 11 existing public
  events.
- Mutation payload: 155,134 bytes, 4.0% of the guarded limit.
- Applied production plan SHA:
  `1f37da72f3bb87080188537ca4ce1ffd1b765877af7f2d6058da550ef18a968c`.
- Production transaction `tt1fSB5HY9GAB0YLyxupXE` committed successfully and
  the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256:
  `1a2ca3482ef118c462655accb3495c1f88711a8381143e87f63e1d9212091b5d`.
- Post-apply zero-residual plan SHA:
  `8d96b18b95cba85748248c005e68c154fd88b20ffb743d214a3252e7b0b6160d`.
- Local smoke checks returned HTTP 200 and rendered the expected sourced
  content for `/apple/ios/4.0`, `/apple/ios/4.3.1`, and `/apple/ios/4.3.5`.

## Human approval checklist

- [x] Accept the explicitly partial 4.0.1 signal-display linkage, or remove the
      occurrence while retaining the source-gap article.
- [x] Accept the mapping of Apple’s November 22 “iOS 4.2” material to the
      existing 4.2.1 route.
- [x] Preserve the March 9/March 11 iOS 4.3 date disclosure without changing
      local chronology.
- [x] Accept the explicitly disclosed MacRumors preservation of the iOS 4.3.1
      update notice, or replace it if a stable first-party artifact is found.
- [x] Accept the explicitly partial 4.3.3 location-cache linkage, or remove the
      occurrence while retaining the Apple Q&A as historical context.
- [x] Review and accept the representative grouping of large security
      bulletins.
- [x] Approve the original synthesis, provenance, review, and indexing state.
