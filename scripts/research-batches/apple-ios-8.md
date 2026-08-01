# Apple iOS 8 research batch

## Result

The companion manifest covers every audited iOS 8.x `releaseVersion` record
currently present in `scripts/seed-data.json`.

- 11 of 11 local version records have source-linked overview articles.
- 11 of 11 local Public appearances have release-specific summaries and
  structured changes.
- 22 cited overview paragraphs provide the version-level articles.
- 62 structured change occurrences are attached to Public appearances: 16
  features, 16 bug fixes, 17 security corrections, 11 enhancements, 1
  developer API change, and 1 regression.
- 18 source records are included. Seventeen are live first-party Apple pages;
  one is a retired first-party Apple Support article with an exact preservation
  snapshot.
- The repository validator counted 182 claim-level or page-level citations.
- 0 build records are included; see the evidence limits below.
- Every event uses the durable
  `{releaseVersionId, routeAlias: "public"}` selector.
- Every version and event is `editoriallyVerified` and `approved` as of
  `2026-07-30T04:53:39Z`. Public events are indexable.
- No beta, GM, or other prerelease event was enriched, no release record was
  created, and no build record was added.

## Exact local coverage

| Record              | Public date | Changes | Article blocks | Route  |
| ------------------- | ----------- | ------: | -------------: | ------ |
| `version-ios-8-0`   | 2014-09-17  |      10 |              2 | public |
| `version-ios-8-0-1` | 2014-09-24  |       1 |              2 | public |
| `version-ios-8-0-2` | 2014-09-25  |       1 |              2 | public |
| `version-ios-8-1`   | 2014-10-20  |       8 |              2 | public |
| `version-ios-8-1-1` | 2014-11-17  |       4 |              2 | public |
| `version-ios-8-1-2` | 2014-12-09  |       1 |              2 | public |
| `version-ios-8-1-3` | 2015-01-27  |       6 |              2 | public |
| `version-ios-8-2`   | 2015-03-09  |       8 |              2 | public |
| `version-ios-8-3`   | 2015-04-08  |      10 |              2 | public |
| `version-ios-8-4`   | 2015-06-30  |       8 |              2 | public |
| `version-ios-8-4-1` | 2015-08-13  |       5 |              2 | public |

Every local record has exactly one Public milestone whose date matches its
`publicReleaseDate`.

## Verified source set

Research was performed on 2026-07-30. The live URLs below resolved to the named
Apple page. Apple Support pages are living documents; the dates stored in
source metadata are their currently displayed publication dates, not claims
about the original day on which Apple first posted each note.

### Consumer history and release indexes

- [About iOS 8 Updates](https://support.apple.com/en-us/102782)
- [Apple security updates (2014)](https://support.apple.com/en-us/101445)
- [Apple security updates (2015)](https://support.apple.com/en-us/103813)

### Release-specific Apple security bulletins

- [iOS 8](https://support.apple.com/en-us/103819)
- [iOS 8.1](https://support.apple.com/en-us/103611)
- [iOS 8.1.1](https://support.apple.com/en-us/103651)
- [iOS 8.1.2](https://support.apple.com/en-us/103584)
- [iOS 8.1.3](https://support.apple.com/en-us/103583)
- [iOS 8.2](https://support.apple.com/en-us/103585)
- [iOS 8.3](https://support.apple.com/en-us/103652)
- [iOS 8.4](https://support.apple.com/en-us/103814)
- [iOS 8.4.1](https://support.apple.com/en-us/103656)

### Apple Newsroom and Developer

- [Apple Announces iOS 8 Available September
  17](https://www.apple.com/newsroom/2014/09/09Apple-Announces-iOS-8-Available-September-17/)
- [Apple Pay Set to Transform Mobile Payments Starting October
  20](https://www.apple.com/newsroom/2014/10/16Apple-Pay-Set-to-Transform-Mobile-Payments-Starting-October-20/)
- [Introducing Apple
  Music](https://www.apple.com/newsroom/2015/06/08Introducing-Apple-Music-All-The-Ways-You-Love-Music-All-in-One-Place-/)
- [Start Developing for iOS
  8](https://developer.apple.com/news/?id=06022014b)
- [Xcode 6 Release
  Notes](https://developer.apple.com/library/archive/documentation/Xcode/Conceptual/RN-Xcode-Archive/Chapters/xc6_release_notes.html)

### Preserved Apple Support evidence for 8.0.1 and 8.0.2

Apple retired `https://support.apple.com/kb/HT6487`, titled “Loss of cellular
service or ability to use Touch ID after updating to iOS 8.0.1 on iPhone 6 or
iPhone 6 Plus.” Its [September 27, 2014 preservation
snapshot](https://web.archive.org/web/20140927070839/http://support.apple.com/kb/HT6487)
retains the Apple-hosted page after its September 26 update.

The preserved article confirms:

- the cellular-service and Touch ID regression affecting some iPhone 6 and
  iPhone 6 Plus devices after iOS 8.0.1;
- that iOS 8.0.2 was available and fixed that regression; and
- that 8.0.2 included improvements and bug fixes originally in 8.0.1.

It does not itemize those carried-forward improvements. The manifest therefore
records one confirmed regression for 8.0.1 and one confirmed remedy for 8.0.2,
without importing a broader list from later reporting or screenshots.

## Editorial and copyright method

Every article paragraph, event summary, and structured change is original
synthesis. The manifest paraphrases the cited Apple material rather than
copying its release-note prose. Related bullets are grouped only when they form
one coherent reader-facing area, and claim-level citations retain a release,
component, or CVE locator.

Security summaries stay within Apple’s described impact and remedy. The batch
selects representative, reader-relevant entries from large bulletins; it does
not imply that every CVE in those bulletins is represented by a separate
change. Product, device, country, and beta qualifications remain visible where
they materially constrain a claim.

Trademarked names identify Apple software, services, devices, and features.
The content does not imply affiliation with or endorsement by Apple.

## Inventory, naming, date, and source boundaries

- **Missing shipped releases:** none were identified. The 11 local records
  cover the nine versions in Apple’s current cumulative iOS 8 history plus the
  8.0.1 and 8.0.2 versions confirmed by the preserved Apple Support article.
  This batch creates no `releaseVersion` document.
- Apple labels the first consumer section simply **iOS 8**, while the local
  deterministic record is `version-ios-8-0`. The batch treats those as the same
  launch and does not create a separate “8.0.0” identity.
- Apple’s current cumulative page omits **8.0.1** and **8.0.2**, and Apple’s
  archived 2014 security index also omits both. The retired HT6487 page
  establishes their relationship and the 8.0.2 remedy but does not state their
  original release dates. The existing local September 24 and September 25
  dates are therefore preserved, not reasserted as newly verified by this
  content batch.
- No surviving first-party itemized 8.0.1 patch list was found. The corpus does
  not use third-party reconstructions to fill that gap.
- Apple’s iOS 8.1.2 security page says that release includes the security
  content of iOS 8.1.1. It is not modeled as a new 8.1.2 security delta.
- Apple gives only a general performance-and-stability description for the
  consumer side of iOS 8.1.1 and only one itemized consumer repair for 8.1.2.
  Those pages intentionally remain less dense than major releases.
- No build documents are included. The reviewed consumer, security, Newsroom,
  Developer, and preserved Support material does not establish a complete
  public-build mapping for all 11 versions.
- No community-sourced or undocumented claim was added merely to increase
  volume. A later undocumented-change pass should require release-specific
  evidence, publisher and author metadata where available, publication date,
  and either independent corroboration or a reproducible verification method.

## Validation

The final manifest SHA-256 is
`ec57007b8ac7315f2476129f8391a049a84dfed12746f1cf9b3a5631e36f28dc`.

The focused ingestion and manifest suites passed all 19 tests:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-8.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npm run research:validate
```

The repository-wide validator accepted all 23 present research batches and
reported 1,402 globally consistent change keys. For this cohort it reported 11
versions, 11 events, 62 changes, 18 sources, and 182 citations.

The exact reviewed production plan was applied with the guarded ingestion
command:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-8.json --apply --confirm-production --plan-sha 31ca9a21a612bb88a12342581036ad5529c151fc185942023184722570c68828
```

The reviewed and applied plan contained:

- 78 creates: 16 new source documents and 62 new change documents;
- 24 revision-guarded patches: 11 existing versions, 11 existing Public
  events, and 2 existing source documents;
- 0 version, event, or build creates;
- 2,071 unchanged documents;
- a 147,345-byte mutation payload, 3.8% of the guarded limit; and
- applied plan SHA
  `31ca9a21a612bb88a12342581036ad5529c151fc185942023184722570c68828`.

Production transaction `tt1fSB5HY9GAB0YLyxsDfV` committed successfully and
the guarded apply completed with zero residual mutations.
