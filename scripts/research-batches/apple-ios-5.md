# Apple iOS 5 research batch

## Result

The companion manifest covers every audited iOS 5.x `releaseVersion` record
currently present in `scripts/seed-data.json`.

- 4 of 4 local version records have source-linked overview articles.
- 4 of 4 local Public appearances have release-specific summaries and
  structured changes.
- 8 cited overview paragraphs provide the version-level articles.
- 53 structured change occurrences are attached to Public appearances: 14
  features, 9 enhancements, 9 bug fixes, 19 security corrections, 1 behavior
  change, and 1 developer API change.
- 10 first-party Apple source records are included.
- The manifest contains 112 claim-level or page-level citations.
- 0 build records and 0 undocumented claims are included.
- Every event uses the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  `2026-07-30T04:59:01Z`. Public events are indexable.
- No release, event, or build record was created.

## Exact local coverage

| Record              | Local Public date | Apple security index | Changes | Article blocks |
| ------------------- | ----------------- | -------------------- | ------: | -------------: |
| `version-ios-5-0`   | 2011-10-12        | 2011-10-12           |      19 |              2 |
| `version-ios-5-0-1` | 2011-11-10        | 2011-11-10           |       9 |              2 |
| `version-ios-5-1`   | 2012-03-07        | 2012-03-07           |      17 |              2 |
| `version-ios-5-1-1` | 2012-05-07        | 2012-05-07           |       8 |              2 |

Each local release has exactly one Public milestone, and all four milestone
dates match the corresponding `publicReleaseDate`. Apple’s archived 2011–2012
security index independently publishes the same four dates.

## Verified source set

Research was performed on 2026-07-30. All ten URLs below resolved to Apple
properties. Apple Support pages are living documents unless Apple labels them
archived; their stored `publishedAt` values reflect the dates Apple currently
displays, not the original publication date of each historic note.

### Consumer history and release index

- [About iOS 5](https://support.apple.com/en-us/102998)
- [Apple security updates (2011 to 2012)](https://support.apple.com/en-us/101444)

### Release-specific security bulletins

- [iOS 5 Software Update](https://support.apple.com/en-us/103815)
- [iOS 5.0.1 Software Update](https://support.apple.com/en-us/103595)
- [iOS 5.1 Software Update](https://support.apple.com/en-us/103596)
- [iOS 5.1.1 Software Update](https://support.apple.com/en-us/103597)

### Apple Newsroom and Developer

- [iOS 5 feature
  preview](https://www.apple.com/newsroom/2011/06/06New-Version-of-iOS-Includes-Notification-Center-iMessage-Newsstand-Twitter-Integration-Among-200-New-Features/)
- [Apple to Launch iCloud on October
  12](https://www.apple.com/newsroom/2011/10/04Apple-to-Launch-iCloud-on-October-12/)
- [Download iOS 5 and iOS 5 SDK Beta
  Today](https://developer.apple.com/news/?id=06062011a)
- [iOS 5 and TLS 1.2 Interoperability
  Issues](https://developer.apple.com/library/archive/technotes/tn2287/_index.html)

## Editorial and copyright method

Every overview paragraph, event summary, canonical summary, and occurrence
summary is original synthesis. The manifest groups related Apple bullets into
reader-facing subjects and paraphrases their meaning instead of reproducing
Apple’s release-note prose. Claim-level citations retain a version, component,
feature, or CVE locator.

Security coverage is deliberately representative. The iOS 5 and iOS 5.1
bulletins contain large WebKit and lower-level component lists; the manifest
does not turn every CVE into a separate reader-facing change or imply that its
selection is an exhaustive vulnerability database. Summaries stay within the
impact and remedy Apple documents.

Trademarked names identify Apple software, services, devices, and features.
The content does not imply affiliation with or endorsement by Apple.

## Inventory, naming, date, and evidence boundaries

- **Missing shipped releases:** none were identified. Apple’s cumulative
  consumer page and archived security index both enumerate the same four
  public iOS 5 releases present locally. This batch creates no
  `releaseVersion` document.
- Apple labels the first consumer section **iOS 5**, while the local
  deterministic identity is `version-ios-5-0`. The batch maps those to the same
  launch and does not create a separate “5.0.0” record.
- **Date discrepancies:** none were found. The local dates match Apple’s
  security index exactly, and Apple’s October 4, 2011 Newsroom announcement
  independently places iOS 5 availability alongside iCloud on October 12.
- Apple’s cumulative consumer page supplies version-specific features and
  fixes but no historical release dates. Dates remain sourced to the archived
  2011–2012 security index rather than inferred from page order or current
  Apple Support publication metadata.
- Apple’s iOS 5.1.1 security index explicitly lists first-, second-, and
  third-generation iPads, while the current version-specific bulletin uses the
  older generic “iPad, iPad 2” wording. The manifest does not normalize that
  wording into a new compatibility claim; the consumer note independently
  documents a fix for the “new iPad.”
- The iOS 5 security bulletin describes upgrade eligibility primarily in
  terms of devices running older iOS versions and therefore is not treated as
  a complete launch-device compatibility list.
- No build documents are included. The reviewed consumer, security, Newsroom,
  and Developer sources do not establish a complete public-build mapping for
  all four releases, and no build number was inferred.
- No community-sourced, undocumented, beta-only, or screenshot-derived claim
  was added to increase volume. A later undocumented-change pass should
  require release-specific evidence, source metadata, and independent
  corroboration or a reproducible verification method.

## Regeneration and validation

The JSON is generated deterministically:

```sh
node scripts/research-batches/build-apple-ios-5.mjs
```

Regenerating the file preserved SHA-256
`e07d21f0f557c9116bfdea1b55d84acc407d7e7221a79171fbed1dece5c6bfd3`.

The focused ingestion and manifest suites passed all 19 tests:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-5.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npm run research:validate
```

At validation time, the repository-wide validator accepted all 23 present
research batches and reported 1,402 globally consistent change keys. For this
cohort it reported 4 versions, 4 events, 53 changes, 10 sources, and 112
citations.

The exact reviewed production plan was applied with the guarded ingestion
command:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-5.json --apply --confirm-production --plan-sha 371a7b23aacc7fee6447b6473f70a0091fe78e48bc212fe9e636cfb17dc3e050
```

The reviewed and applied plan contained:

- 62 creates: 9 new source documents and 53 new change documents;
- 9 revision-guarded patches: 4 existing versions, 4 existing Public events,
  and 1 existing source document;
- 0 version, event, or build creates;
- 2,078 unchanged documents;
- a 114,935-byte mutation payload, 2.9% of the guarded limit; and
- applied plan SHA
  `371a7b23aacc7fee6447b6473f70a0091fe78e48bc212fe9e636cfb17dc3e050`.

Production transaction `eOgq1Ovu5XNUv1qNFUaoT1` committed successfully and
the guarded apply completed with zero residual mutations.
