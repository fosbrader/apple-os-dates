# iOS 10 research batch

This companion note records the evidence and conservative editorial choices for [`apple-ios-10.json`](./apple-ios-10.json). It covers every iOS 10 release-version record and Public milestone currently present in the repository. It does not claim that the local catalog contains every iOS 10 release Apple shipped.

## Batch summary

- Accessed: 2026-07-30
- Target guard: `lh3yswzu/production`
- Audited local release-version records: 8
- Public-event overlays: 8
- Structured, source-backed change occurrences: 31
- Declared first-party sources: 14
- Builds added: 0
- Prerelease events enriched: 0
- Editorial posture after review: `editoriallyVerified`, `approved`, and
  indexable

All article text is original synthesis. It paraphrases the cited Apple material, retains product and regional qualifications where relevant, and attaches claim-level citations rather than reproducing publisher prose.

## Exact local coverage

| Record               | Public date | Structured changes | Route  |
| -------------------- | ----------- | -----------------: | ------ |
| `version-ios-10-0`   | 2016-09-13  |                  7 | public |
| `version-ios-10-1`   | 2016-10-24  |                  5 | public |
| `version-ios-10-2`   | 2016-12-12  |                  5 | public |
| `version-ios-10-2-1` | 2017-01-23  |                  2 | public |
| `version-ios-10-3`   | 2017-03-27  |                  6 | public |
| `version-ios-10-3-1` | 2017-04-03  |                  2 | public |
| `version-ios-10-3-2` | 2017-05-15  |                  2 | public |
| `version-ios-10-3-3` | 2017-07-19  |                  2 | public |

The dates above were reconciled against `scripts/seed-data.json`. Every local record has exactly one Public milestone on the same date as its `publicReleaseDate`, so every event target uses only `releaseVersionId` plus `routeAlias: "public"`.

## Verified first-party sources

All URLs below were opened and checked on 2026-07-30. Apple Support displays a current day-level “Published Date” for these living historical pages; the manifest normalizes that displayed day to midnight UTC because the ingestion schema requires a datetime. Newsroom and Developer rows retain the dated first-party publication. These metadata dates are not presented as original release-note publication times.

| Source                                                                                                                                                      | Displayed or original date | Use                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------- |
| [About iOS 10 Updates](https://support.apple.com/en-us/102990)                                                                                              | 2024-01-10                 | iOS 10 consumer release notes          |
| [About the security content of iOS 10](https://support.apple.com/en-us/103677)                                                                              | 2023-11-03                 | iOS 10 launch security                 |
| [About the security content of iOS 10.0.1](https://support.apple.com/en-us/103630)                                                                          | 2023-11-03                 | iOS 10.0.1 security and date           |
| [About the security content of iOS 10.1](https://support.apple.com/en-us/103634)                                                                            | 2023-11-03                 | iOS 10.1 security and date             |
| [About the security content of iOS 10.2](https://support.apple.com/en-us/103636)                                                                            | 2023-11-03                 | iOS 10.2 security and date             |
| [About the security content of iOS 10.2.1](https://support.apple.com/en-us/103802)                                                                          | 2023-11-06                 | iOS 10.2.1 security and date           |
| [About the security content of iOS 10.3](https://support.apple.com/en-us/103075)                                                                            | 2023-11-03                 | iOS 10.3 security and date             |
| [About the security content of iOS 10.3.1](https://support.apple.com/en-us/103640)                                                                          | 2023-11-06                 | iOS 10.3.1 security and date           |
| [About the security content of iOS 10.3.2](https://support.apple.com/en-us/103641)                                                                          | 2023-11-06                 | iOS 10.3.2 security and date           |
| [About the security content of iOS 10.3.3](https://support.apple.com/en-us/103803)                                                                          | 2023-11-06                 | iOS 10.3.3 security and date           |
| [What’s new in iOS 10](https://www.apple.com/newsroom/2016/09/whats-new-in-ios-10/)                                                                         | 2016-09-13                 | iOS 10 public launch and features      |
| [Apple unveils new TV app for Apple TV, iPhone and iPad](https://www.apple.com/newsroom/2016/10/apple-unveils-new-tv-app-for-apple-tv-iphone-and-ipad.html) | 2016-10-27                 | TV app scope and December availability |
| [Get Your iMessage Apps Ready](https://developer.apple.com/news/?id=08232016a)                                                                              | 2016-08-23                 | iMessage apps and sticker packs        |
| [Allow Users to Provide Ratings From Within Your App](https://developer.apple.com/news/?id=01242017c)                                                       | 2017-01-24                 | iOS 10.3 in-app ratings API            |

No independent reporting was needed for the included claims. Apple’s consumer notes supply the user-facing changes; its security advisories anchor release dates and narrowly support the structured security entries; Newsroom corroborates the public launch and TV-app scope; Apple Developer supports the two developer-facing entries.

## Editorial boundaries

### The local 10.0 record represents the shipped 10.0.1 launch software

The repository names its first iOS 10 release version `10.0`, while both its GM and Public milestones explicitly note “iOS 10.0.1 build 14A403.” Apple’s consumer history groups the launch section as iOS 10 through iOS 10.0.1, and Apple’s security page dates iOS 10.0.1 to September 13, 2016. This batch preserves the existing `version-ios-10-0` identity and public route, explains the modeling boundary in the article, and does not create a duplicate 10.0.1 version or build document.

### Cumulative notes are attached only to Public events

The local seed contains developer betas and a golden-master milestone for iOS 10.0. Apple’s surviving consumer page is a cumulative public-release history, not a beta-by-beta changelog. This batch therefore enriches only the existing Public route and does not assign a feature to a particular beta or GM.

### Sparse patches stay sparse

Apple describes 10.3.1, 10.3.2, and 10.3.3 generically as bug-fix and security updates. Their maintenance entries retain that documented classification without inventing individual consumer defects. Separate security entries summarize only the components and vulnerability classes Apple’s advisories document.

### Product and region limits stay visible

Portrait Camera remains labeled as a beta feature limited to iPhone 7 Plus. The TV app remains identified as U.S.-only at its iOS 10.2 introduction. The corpus does not turn limited availability into a universal claim.

### No build or unsupported beta inference

No build documents are included. The seed’s 10.0 milestone note is enough to explain the local identity edge, but this cohort was not asked to establish a complete, audited build mapping. Consumer, Newsroom, and Developer material is used only for the public release in which Apple documents the feature.

## Local-catalog and source gaps

- Apple’s consumer history lists four shipped iOS 10 releases without matching local release-version records: **10.0.2**, **10.0.3**, **10.1.1**, and **10.3.4**. This batch does not create, merge, or redirect those missing records.
- Apple’s shipped 10.0.1 software is represented by the local 10.0 record and milestone note, so it is treated as a naming boundary rather than a fifth missing record.
- Apple’s consumer page is substantially more detailed for 10.0/10.0.1, 10.1, 10.2, and 10.3 than for the later patch releases. Patch articles intentionally reflect that evidence imbalance.
- Apple Support pages are living documents. Their displayed 2023 or 2024 publication dates are treated as source-metadata dates, not the original release-note publication times.
- No community-sourced or undocumented change is promoted to confirmed status in this cohort.

## Validation and guarded dry run

Local shape validation:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-10.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
```

Focused tests:

```sh
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npm run research:validate
```

Production-snapshot read-only plan, intentionally without `--apply`:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-10.json
```

The target guard, plan digest, draft checks, rollback artifact, and any later human approval remain owned by the shared ingestion pipeline.

## Validation result

The commands above were run on 2026-07-30. Bundle validation passed, the eight
version IDs matched the local iOS 10 inventory exactly, and all eight event
targets matched records with one same-date Public milestone. The focused
ingestion tests passed 12 of 12, and the repository-wide research validator
accepted all 31 release-scoped change keys.

The final production-snapshot plan resolved every target to an existing public
release event and applied:

- 14 source creates
- 31 release-change creates
- 8 release-version patches
- 8 release-event patches
- 0 release-event creates
- 0 release-build creates
- 108,439 bytes of guarded mutation payload, 2.8% of the pipeline limit

The batch was editorially approved at `2026-07-30T04:22:54Z`. The exact applied
plan SHA was
`9f7e4ae1f92e2bc559ddacad0efaf6d20ba173b39db97797d4b167ff7d4e56a8`.
Sanity committed transaction `F0eE6eK5XyVXtlnaoxtY44`, and the ingestion
pipeline verified zero residual mutations.
