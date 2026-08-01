# Apple iOS 2 research batch

## Result

The companion manifest covers every iOS 2.x `releaseVersion` record and its
same-date Public milestone currently present in `scripts/seed-data.json`.

- 6 of 6 local version records have source-linked overview articles.
- 6 of 6 local Public appearances have release-specific summaries and article
  bodies.
- 52 structured change occurrences are attached to Public appearances: 21
  security corrections, 10 bug fixes, 10 enhancements, 9 features, 1
  compatibility change, and 1 developer-platform change.
- 12 source records are included: 4 Apple Support documents, 3 Apple Newsroom
  announcements, and 5 contemporaneous MacRumors reports.
- The repository citation audit counted 129 claim-level or page-level
  citations.
- Every event uses only the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  2026-07-30T05:31:12Z. Public events are indexable after editorial approval.
- Of the 52 structured changes, 31 are `confirmed` from first-party Apple
  evidence and 21 are `reported` from contemporaneous journalism preserving
  update notices whose first-party consumer pages no longer survive.
- No build record, prerelease article, or missing-version identity was created;
  the reviewed overlays were applied only to existing durable routes.

## Exact local coverage

| Record              | Seed Public date | Best release-date evidence                                                            | Changes | Article blocks |
| ------------------- | ---------------- | ------------------------------------------------------------------------------------- | ------: | -------------: |
| `version-ios-2-0`   | 2008-07-11       | Apple Newsroom and security index: 2008-07-11                                         |      15 |              2 |
| `version-ios-2-0-1` | 2008-08-04       | Contemporaneous report: 2008-08-04; no Apple security-index entry                     |       1 |              2 |
| `version-ios-2-0-2` | 2008-08-18       | Contemporaneous report: 2008-08-18; no Apple security-index entry                     |       1 |              2 |
| `version-ios-2-1`   | 2008-09-12       | Apple security index and contemporaneous release report: 2008-09-12                   |      16 |              2 |
| `version-ios-2-2`   | 2008-11-21       | Apple index: 2008-11-20; late-night reporting and conventional route date: 2008-11-21 |      17 |              2 |
| `version-ios-2-2-1` | 2009-01-27       | Contemporaneous report: 2009-01-27; no Apple security-index entry                     |       2 |              2 |

Every listed local record has exactly one Public milestone, and that milestone
matches its local `publicReleaseDate`.

## Timeline, naming, and source-boundary audit

Six points need explicit human attention before this cohort is approved:

1. Contemporary Apple material calls these releases **iPhone software**,
   **iPhone v2.x**, or **iPhone OS**, while the current local catalog groups
   them under the modern `iOS` platform identity. Apple’s migrated 2.2 security
   page itself now uses “iOS 2.2.” The batch preserves the local route names
   while using period-correct naming in the historical prose where useful.
2. Apple’s surviving security chronology has no entries for 2.0.1 or 2.0.2.
   Contemporaneous MacRumors reports preserve Apple’s entire public description
   of each as generic bug fixes. Each route consequently has one deliberately
   broad maintenance occurrence rather than speculative component-level notes.
3. The 2.0.1 report labels faster backups and typing as early claims, separate
   from Apple’s terse description. Those observations are not encoded as
   release changes.
4. The 2.0.2 report explicitly says that a rumored 3G connectivity correction
   was not confirmed and that early reports had no consensus. The manifest does
   not attribute a cellular fix to 2.0.2.
5. Apple’s archived security index dates iOS 2.2 to November 20, 2008, while
   the seed and conventional release history use November 21. The
   contemporaneous MacRumors article was published late on November 20 Pacific
   time with a November 21 URL and describes a just-after-midnight release.
   This looks like a late-night or time-zone boundary, but the batch does not
   resolve that inference as fact; it keeps the local route and discloses both
   dates.
6. Apple’s security index has no separate 2.2.1 entry. The two consumer fixes
   and January 27 date come from a contemporaneous report preserving the update
   notice. The report also names a build and modem firmware, but neither is
   emitted because the cohort requires no builds and lacks a first-party
   release-specific build record.

The absence of 2.0.1, 2.0.2, and 2.2.1 from Apple’s security index is not
treated as evidence that those releases did not exist. The index catalogs
updates accompanied by security advisories rather than every maintenance
package.

## Release change inventory

| Version | Reader-facing scope                                                                                                                                                                                                                                                                                                                     |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.0     | App Store and native apps, the supported SDK, Exchange ActiveSync, enterprise networking and management, expanded Mail, GPS-aware mapping on compatible hardware, contact search and Calculator, parental controls, image saving, MobileMe push, secure-proxy and packet handling, browser identity, and web-content memory protections |
| 2.0.1   | Generic Apple-described bug-fix maintenance; no conversion of early user claims into release facts                                                                                                                                                                                                                                      |
| 2.0.2   | Generic Apple-described bug-fix maintenance; no unverified 3G connectivity claim                                                                                                                                                                                                                                                        |
| 2.1     | Calls, battery life, backups, mail, third-party apps, messaging, contacts, the 3G indicator, passcode erasure, Genius playlists, application isolation, font parsing, DNS, TCP, passcode enforcement, and WebKit                                                                                                                        |
| 2.2     | Maps, podcast downloads, Mail, Safari, calls, Visual Voicemail, Home-screen navigation, automatic correction, graphics and TIFF processing, VPN encryption, Office documents, passcode and message privacy, Safari, and WebKit                                                                                                          |
| 2.2.1   | Safari stability and correct Camera Roll display for some images saved from Mail                                                                                                                                                                                                                                                        |

## Verified source set

All 12 URLs resolved to the named page during research on 2026-07-30.

### Apple release chronology and security advisories

- [Apple security updates (15-Jan-2008 to 03-Dec-2009)](https://support.apple.com/en-us/104189)
- [About the security content of iPhone v2.0 and iPod touch v2.0](https://support.apple.com/en-us/104025)
- [About the security content of iPhone v2.1](https://support.apple.com/en-us/104112)
- [About the security content of iOS 2.2 and iOS for iPod touch 2.2](https://support.apple.com/en-us/104121)

### Apple announcements

- [Apple Announces iPhone 2.0 Software Beta](https://www.apple.com/newsroom/2008/03/06Apple-Announces-iPhone-2-0-Software-Beta/)
- [Apple Introduces the New iPhone 3G](https://www.apple.com/newsroom/2008/06/09Apple-Introduces-the-New-iPhone-3G/)
- [Apple Introduces New iPod touch](https://www.apple.com/newsroom/2008/09/09Apple-Introduces-New-iPod-touch/)

### Contemporaneous reporting

These five records are deliberately classified as `journalism`, not
first-party documentation. They preserve update notices that Apple no longer
hosts as stable consumer release-note pages.

- [Apple Releases iPhone Firmware 2.0.1](https://www.macrumors.com/2008/08/04/apple-releases-iphone-firmware-2-0-1/)
- [iPhone Firmware 2.0.2 Released](https://www.macrumors.com/2008/08/18/iphone-firmware-2-0-2-released/)
- [iPhone 2.1 Firmware Now Available](https://www.macrumors.com/2008/09/12/iphone-2-1-firmware-now-available/)
- [Apple Releases iPhone 2.2 Firmware with Street View, Emoji and More](https://www.macrumors.com/2008/11/21/apple-releases-iphone-2-2-firmware/)
- [Apple Releases iPhone and iPod Touch 2.2.1 Firmware](https://www.macrumors.com/2009/01/27/apple-releases-iphone-2-2-1-firmware/)

## Editorial and copyright method

The manifest contains original summaries rather than copied release-note
paragraphs. Every factual overview paragraph, event article paragraph, page
summary, and structured change is tied to a declared citation with a
release-note item, feature section, component, CVE, or chronology locator.

Closely related upstream items are grouped only where they form a coherent
reader-facing boundary, such as iPhone 2.0’s script memory protections or iPhone
2.2’s Safari call and HTML controls. Technical prerequisites and scope remain
visible: hardware-dependent GPS support, physical-access requirements,
malicious proxy or packet conditions, and crafted web, font, image, or document
inputs are not broadened into universal claims.

The secondary reports are used as evidence that a contemporaneous Apple update
notice said something, not as permission to reproduce the notice. Their short
lists are paraphrased and reorganized into original summaries. Reporters’
observations, user anecdotes, rumors, build numbers, modem firmware, jailbreak
behavior, and linked community “undocumented changes” are excluded.

Changes supported only by those reports are labeled `reported`, with a
verification note explaining the surviving evidence path. First-party Apple
announcements, release indexes, and security advisories retain the stronger
`confirmed` state.

Apple product and feature names are used nominatively to identify historical
software. The articles do not imply affiliation, endorsement, or ownership of
Apple’s release notes.

## Evidence limits

- The 52 changes are a reader-oriented synthesis, not a claim that every
  consumer sentence or every CVE has been converted into a separate record.
  Related security entries are grouped where that produces a clearer article.
- The 2.0.1 and 2.0.2 records cannot identify individual corrected components
  because the surviving update descriptions say only that each package
  contained bug fixes.
- The 2.1 and 2.2 consumer lists depend on a stable, contemporaneous MacRumors
  preservation of Apple’s changelog. Apple’s own surviving security pages
  independently support their security sections and release chronology.
- The 2.2.1 consumer list likewise depends on contemporaneous reporting because
  no stable first-party release-note or security page was located.
- No community report or undocumented change was added merely to increase
  coverage. A later community-evidence pass should require stable publication
  metadata, precise claim locators, and corroboration or a reproducible
  verification method.
- `builds` is intentionally empty even where a report mentions a build.
- Prerelease milestones remain untouched because the cohort is scoped to
  existing Public routes.
- Apple Support pages are living or archived documents. The manifest’s
  `accessedAt` value and detailed locators preserve the reviewed context even
  if Apple later revises a page.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Seed comparison: 6 local iOS 2.x records, 6 version overlays, and 6
  Public-event overlays, with no missing or extra IDs.
- Target check: all 6 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`, and every
  declared source is used.
- Change identity check: all 52 local keys are unique.
- Review-state check: all 12 records are `editoriallyVerified` and `approved`;
  all 6 events have `isIndexable: true`.
- Evidence-state check: 31 changes are `confirmed`, 21 are `reported`, and all
  52 include an explicit verification method.
- Repository research validation: passed across 31 discovered batches and
  1,846 globally consistent change keys.
- Focused launch-content ingestion and manifest tests: 19 passed, 0 failed.
- Generator lint and Prettier checks: passed. The approved generator reproduces
  the manifest byte for byte at SHA-256
  `351a5f3485fcbc560ab54a6b9968c3ca2640665c2c3029c50786518f9060f0a0`.
- Reviewed Sanity plan: 63 creates, 12 revision-guarded patches, and 2,077
  unchanged documents. The creates are exactly 52 release-change documents and
  11 source documents; the shared Apple security chronology already exists and
  is reused. The patches are exactly the 6 existing version records and their 6
  existing Public release events. No deletes were planned.
- Applied plan SHA:
  `ac41ace0d2da3408f16ab2f2178bd651fc21a07af1e8ddaae30ac956c5e6b6c3`;
  mutation payload: 128,968 bytes (3.3% of the guarded limit).
- Production transaction `F0eE6eK5XyVXtlnaoxxsgx` committed successfully.
- Post-apply comparison returned zero creates and zero patches across 2,152
  unchanged documents; zero-residual plan SHA:
  `494fba36936c5e320713c1c441848478f70d2e9263d9ec412ffef073a36f4e03`.
- Local smoke checks returned HTTP 200 and rendered sourced article content for
  `/apple/ios/2.0`, `/apple/ios/2.1`, and `/apple/ios/2.2.1`.

## Human approval checklist

- [x] Accept the modern local `iOS 2.x` route naming while retaining
      period-correct “iPhone software” and “iPhone OS” context in the article.
- [x] Accept generic-only 2.0.1 and 2.0.2 change records and keep early or
      rumored observations out of structured data.
- [x] Preserve the disclosed November 20/November 21 iOS 2.2 date boundary
      without changing the local chronology.
- [x] Accept the five clearly labeled contemporaneous MacRumors records where
      stable Apple consumer pages no longer survive.
- [x] Keep build and modem-firmware claims out of the cohort.
- [x] Review and accept representative grouping of the larger security
      advisories.
- [x] Approve the original synthesis, provenance, review, and indexing state.
