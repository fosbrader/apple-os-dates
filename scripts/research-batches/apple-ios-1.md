# Apple iOS 1 research batch

## Result

The companion manifest covers every iOS 1.x `releaseVersion` record and its
same-date Public milestone currently present in `scripts/seed-data.json`.

- 9 of 9 local version records have source-linked overview articles.
- 9 of 9 local Public appearances have release-specific summaries and article
  bodies.
- 56 structured change occurrences are attached to Public appearances: 25
  features, 15 security corrections, 7 enhancements, 4 compatibility changes,
  2 bug-fix records, 2 behavior changes, and 1 developer-platform change.
- 21 source records are included: 8 Apple Newsroom announcements, 5 surviving
  Apple Support documents, 1 archived Apple Support bulletin, and 7
  contemporaneous journalism records.
- The repository citation audit counted 197 claim-level or page-level
  citations.
- Every event uses only the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  `2026-07-30T05:55:48Z`; all Public events are indexable.
- No build record, prerelease article, or missing-version identity is included.

## Exact local coverage

| Record              | Seed Public date | Best release-date evidence                                                          | Changes | Article blocks |
| ------------------- | ---------------- | ----------------------------------------------------------------------------------- | ------: | -------------: |
| `version-ios-1-0`   | 2007-06-29       | Apple Newsroom public-retail announcement: 2007-06-29                               |      13 |              2 |
| `version-ios-1-0-1` | 2007-07-31       | Apple security index: 2007-07-31                                                    |       5 |              2 |
| `version-ios-1-0-2` | 2007-08-21       | Contemporaneous release report: 2007-08-21; no Apple security-index entry           |       1 |              2 |
| `version-ios-1-1`   | 2007-09-14       | Apple announced “later this month”; contemporaneous retail availability: 2007-09-14 |       5 |              2 |
| `version-ios-1-1-1` | 2007-09-27       | Apple security index and contemporaneous release report: 2007-09-27                 |      16 |              2 |
| `version-ios-1-1-2` | 2007-11-12       | Apple security index, Apple bulletin, and contemporaneous reporting: 2007-11-12     |       4 |              2 |
| `version-ios-1-1-3` | 2008-01-15       | Apple announcements and security index: 2008-01-15                                  |      10 |              2 |
| `version-ios-1-1-4` | 2008-02-26       | Contemporaneous preservation of Apple’s update notice: 2008-02-26                   |       1 |              2 |
| `version-ios-1-1-5` | 2008-07-15       | Contemporaneous iPod touch release report: 2008-07-15                               |       1 |              2 |

Every listed local record has exactly one Public milestone, and that milestone
matches its local `publicReleaseDate`.

## Timeline, naming, and source-boundary audit

Eleven points need explicit human attention before this cohort is approved:

1. The current catalog uses the retrospective `iOS 1.x` identity. Apple’s 2007
   material called the product’s system simply iPhone software or described it
   as new software; the `iPhone OS` name appears in Apple’s 2008 SDK-era
   material, and `iOS` came later. Reader-facing prose uses period-correct
   device and software names without changing local routes.
2. Version 1.0 is a platform launch rather than a conventional update.
   Structured changes describe software capabilities documented for the
   shipping iPhone, not every hardware specification or marketing claim.
3. Version 1.1 was the initial first-generation iPod touch software branch and
   was not released for the original iPhone. The event article states that
   scope explicitly.
4. Apple’s September 5 iPod touch announcement promised availability later in
   the month but did not name September 14. A contemporaneous TechCrunch report
   documented retail units on September 14, matching the seed. The manifest
   does not present that day as a surviving first-party release statement.
5. Apple’s surviving security chronology contains no 1.0.2 entry. The only
   preserved update description says the package contained unspecified bug
   fixes, so it receives one broad `partiallyDocumented` maintenance occurrence
   and no inferred component claims.
6. For 1.1.1, Apple’s current support page fully documents security changes and
   its Newsroom announcement documents the iTunes Wi-Fi Music Store.
   MacRumors preserves the larger consumer list once presented through Apple’s
   September update page; those consumer occurrences are marked
   `partiallyDocumented` and `reported`, not elevated to surviving first-party
   documentation.
7. For 1.1.2, Apple’s surviving bulletin documents the TIFF security repair.
   International language and keyboard support is independently reported by
   Macworld and MacRumors and is marked `corroborated`. The iTunes battery
   indicator and ringtone categories are single-publication observations and
   are explicitly `undocumented` and `reported`.
8. Apple’s live security index links the 1.1.3 bulletin to a retired
   `docs.info.apple.com` page. The manifest cites an Internet Archive capture
   made two days after release and classifies it as `archive`, even though the
   preserved text is Apple’s first-party bulletin.
9. The iPod touch 1.1.3 package added Mail, Maps, Stocks, Weather, and Notes and
   cost existing owners $19.99, while new units included it. That unusual
   device-and-purchase boundary remains visible rather than being generalized
   to all devices.
10. The preserved 1.1.4 description identifies only bug fixes. Early claims
    about SMS ordering, camera behavior, Bluetooth, unofficial applications,
    and SDK preparation are excluded.
11. Version 1.1.5 arrived for iPod touch after the separate 2.0 line had
    launched. It is represented as a free 1.x maintenance path, not as an
    iPhone release. Tentative reports of speed or stability changes and
    speculation that it inherited 2.0 security fixes are excluded.

The absence of 1.0.2, 1.1.4, and 1.1.5 from Apple’s security indexes is not
treated as evidence that those releases did not exist. Those indexes catalog
updates accompanied by security advisories rather than every maintenance
package.

## Release change inventory

| Version | Reader-facing scope                                                                                                                                                                                                                                               |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | Multi-Touch, Phone and contacts, Visual Voicemail, SMS and keyboard, synchronization, camera and photos, widescreen media and Cover Flow, Mail, Safari, Maps, sensor-aware behavior, YouTube, and third-party web applications                                    |
| 1.0.1   | Safari redirected-window isolation, regular-expression validation, XMLHttpRequest headers, internationalized-domain validation, and frameset memory safety                                                                                                        |
| 1.0.2   | Generic bug-fix maintenance only; no speculative component attribution                                                                                                                                                                                            |
| 1.1     | Initial iPod touch software, the iTunes Wi-Fi Music Store, Safari and YouTube over Wi-Fi, widescreen media and Cover Flow, and orientation or brightness behavior                                                                                                 |
| 1.1.1   | iTunes Wi-Fi purchases, audio and interaction refinements, attachment rotation, app-list ordering, accessory status, TV output, roaming and passcode settings, Bluetooth, Mail, telephone-link, cross-origin, JavaScript-preference, and secure-frame protections |
| 1.1.2   | International languages and keyboards, two labeled secondary observations involving iTunes and ringtones, and TIFF image validation                                                                                                                               |
| 1.1.3   | Maps positioning and hybrid view, Web Clips and Home screens, group SMS, Movie Rentals, iPod touch applications and Mail, URL validation, Passcode Lock, and Safari frame navigation                                                                              |
| 1.1.4   | Generic bug-fix maintenance only                                                                                                                                                                                                                                  |
| 1.1.5   | iPod touch-only 1.x maintenance and upgrade-path availability; no unverified performance or security detail                                                                                                                                                       |

## Verified source set

All 21 URLs resolved to the named page or preserved capture during research on
2026-07-30.

### Apple launch and feature announcements

- [Apple Reinvents the Phone with iPhone](https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/)
- [iPhone Premieres This Friday Night at Apple Retail Stores](https://www.apple.com/newsroom/2007/06/28iPhone-Premieres-This-Friday-Night-at-Apple-Retail-Stores/)
- [iPhone to Support Third-Party Web 2.0 Applications](https://www.apple.com/newsroom/2007/06/11iPhone-to-Support-Third-Party-Web-2-0-Applications/)
- [YouTube Live on Apple TV Today; Coming to iPhone on June 29](https://www.apple.com/newsroom/2007/06/20YouTube-Live-on-Apple-TV-Today-Coming-to-iPhone-on-June-29/)
- [Apple Unveils iPod touch](https://www.apple.com/newsroom/2007/09/05Apple-Unveils-iPod-touch/)
- [Apple Unveils the iTunes Wi-Fi Music Store](https://www.apple.com/newsroom/2007/09/05Apple-Unveils-the-iTunes-Wi-Fi-Music-Store/)
- [Apple Enhances Revolutionary iPhone with Software Update](https://www.apple.com/newsroom/2008/01/15Apple-Enhances-Revolutionary-iPhone-with-Software-Update/)
- [Apple Announces Major Software Upgrade for iPod touch](https://www.apple.com/newsroom/2008/01/15Apple-Announces-Major-Software-Upgrade-for-iPod-touch/)

### Apple security chronology and bulletins

- [Apple security updates (25-Jan-2005 to 21-Dec-2007)](https://support.apple.com/en-us/104190)
- [About the security content of iPhone v1.0.1 Update](https://support.apple.com/en-us/102579)
- [About the security content of the iPhone 1.1.1 Update](https://support.apple.com/en-us/101680)
- [About the security content of iPhone v1.1.2 and iPod touch v1.1.2 Updates](https://support.apple.com/en-us/102687)
- [Apple security updates (15-Jan-2008 to 03-Dec-2009)](https://support.apple.com/en-us/104189)

### Archived first-party material

- [Archived Apple Support: About the security content of iPhone v1.1.3 and iPod touch v1.1.3](https://web.archive.org/web/20080117062508/http://docs.info.apple.com/article.html?artnum=307302)

The 1.1.3 capture is an Apple document preserved by the Internet Archive. It is
classified as `archive` because the live Apple destination no longer resolves
to the bulletin.

### Contemporaneous reporting

These records are deliberately classified as `journalism`, not first-party
documentation. They preserve terse update notices, availability observations,
or consumer details that Apple no longer hosts as stable text pages.

- [Apple Releases iPhone 1.0.2 Update](https://www.macrumors.com/2007/08/21/apple-releases-iphone-1-0-2-update/)
- [Lookin’ For Some (iPod) Touch? Best Buy Just Got Them](https://techcrunch.com/2007/09/14/lookin-for-some-ipod-touch-best-buy-just-got-them/)
- [Apple Releases iPhone 1.1.1 Update](https://www.macrumors.com/2007/09/27/apple-releases-iphone-1-1-1-update/)
- [Apple releases iPhone update 1.1.2](https://www.macworld.com/article/188116/iphoneupdate-5.html)
- [iPhone/iPod touch 1.1.2 Firmware Officially Released in U.S.](https://www.macrumors.com/2007/11/12/iphone-1-1-2-firmware-officially-released-in-u-s/)
- [Apple releases software v1.1.4 for iPhone and iPod touch](https://appleinsider.com/articles/08/02/26/apple_releases_iphone_software_version_1_1_4)
- [Apple Releases iPod Touch 1.1.5 Firmware](https://www.macrumors.com/2008/07/15/apple-releases-ipod-touch-1-1-5-firmware/)

## Editorial and copyright method

The manifest contains original summaries rather than copied release-note or
press-release paragraphs. Every factual overview paragraph, event article
paragraph, page summary, and structured change is tied to a declared citation
with a feature section, component, CVE, release-note item, observation, or
chronology locator.

Closely related upstream security entries are grouped only where they form a
coherent reader-facing boundary, such as telephone-link confirmation and
Safari cross-origin frame controls in 1.1.1. Conditions remain visible:
physical access for the 1.1.3 Passcode Lock issue, Bluetooth range for the
1.1.1 service-discovery issue, malicious web or image input for memory-safety
repairs, and device-specific iPhone or iPod touch scope.

Secondary reports are used as historical evidence, not as permission to
reproduce their prose. Their short lists are reorganized and paraphrased.
Jailbreak instructions and consequences, unlocked-device warnings, forum
claims, speculative SDK support, build numbers, tentative performance reports,
and unsupported security inferences are excluded.

Apple product and feature names are used nominatively to identify historical
software. The articles do not imply affiliation, endorsement, or ownership of
Apple’s source material.

## Evidence limits

- The 56 changes are a reader-oriented synthesis, not a claim that every
  consumer sentence or every CVE is a separate database record.
- Version 1.0 combines software and device-launch documentation because Apple
  did not publish a conventional versioned consumer changelog for the first
  shipping system.
- Versions 1.0.2 and 1.1.4 cannot identify individual corrected components
  because their preserved official descriptions are generic.
- Version 1.1.5 cannot identify an individual feature, fix, or security change;
  its one occurrence records only the documented maintenance path for iPod
  touch owners remaining on 1.x.
- The two `undocumented` 1.1.2 observations remain single-publication reports.
  They should be retained only if the project accepts labeled contemporary
  observation as sufficient historical evidence.
- No community or forum claim was added merely to increase coverage.
- `builds` is intentionally empty even where Apple’s verification instructions
  or secondary pages mention a build.
- Prerelease milestones remain untouched because the cohort is scoped to
  existing Public routes.
- Apple Support pages are living or archived documents. The manifest’s
  `accessedAt` value and detailed locators preserve the reviewed context even
  if Apple later revises a page.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Seed comparison: 9 local iOS 1.x records, 9 version overlays, and 9
  Public-event overlays, with no missing or extra IDs.
- Target check: all 9 event selectors contain only `releaseVersionId` and
  `routeAlias: "public"`.
- Citation registry check: no citation URL is missing from `sources`, and every
  declared source is used.
- Change identity check: all 56 local keys are unique.
- Review-state check: all 18 records are `editoriallyVerified` and `approved`
  at `2026-07-30T05:55:48Z`; all 9 events have `isIndexable: true`.
- Focused launch-content ingestion and manifest tests: 19 passed, 0 failed.
- Generator lint and Prettier checks: passed. A clean generator rerun reproduced
  the manifest byte for byte at SHA-256
  `418521e4770ea963b9342b3f8b5fe52a046fc87199970f89934313d706e2bfa1`.
- Repository research validation: passed across 37 discovered batches and
  1,995 globally consistent change keys.
- Approved Sanity dry run: 76 creates, 18 revision-guarded patches, and 2,074
  unchanged documents. The creates are exactly 56 release-change documents and
  20 source documents; the shared 2008–2009 Apple security chronology already
  exists and is reused unchanged. The patches are exactly the 9 existing
  version records and their 9 existing Public release events. No deletes were
  planned.
- Approved plan SHA:
  `bd50e0ceae0b496cf9e31963098b3da0148e2f673fb7cb51b8f7eee1aa15b1c1`;
  mutation payload: 163,816 bytes (4.2% of the guarded limit).
- Production apply committed and zero-residual verified in transaction
  `eOgq1Ovu5XNUv1qNFUeEN5`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,168 unchanged
  documents. Its plan SHA is
  `fe4b22c0d97d715d6c5be0fad445a3f738337be0037a1124a6a03fe8ebf7c904`.
- Representative local routes `/apple/ios/1.0`, `/apple/ios/1.1.2`, and
  `/apple/ios/1.1.5` returned HTTP 200 with release content, references, and
  indexable metadata.

## Human approval checklist

- [x] Accept the retrospective local `iOS 1.x` route naming while retaining
      period-correct iPhone software and iPod touch context.
- [x] Accept the 1.1 route as an iPod touch-only initial release and the
      contemporaneously observed September 14 date boundary.
- [x] Accept generic-only 1.0.2 and 1.1.4 maintenance records.
- [x] Accept the archived Apple 1.1.3 security bulletin as an `archive` source.
- [x] Accept the two clearly labeled, single-source 1.1.2 observations as
      meeting the project’s bar for `undocumented` historical changes.
- [x] Preserve the device-specific and paid-upgrade context of iPod touch
      1.1.3.
- [x] Keep tentative 1.1.4 and 1.1.5 component claims and all build records out
      of the cohort.
- [x] Approve the original synthesis, provenance, review, and indexing state.

Root editorial review completed on `2026-07-30T05:55:48Z`; the reviewed
manifest was applied to production with the receipt above.
