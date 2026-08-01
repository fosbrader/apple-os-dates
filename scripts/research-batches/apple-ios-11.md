# iOS 11 research batch

This companion note records the evidence and conservative editorial choices for [`apple-ios-11.json`](./apple-ios-11.json). It covers every iOS 11 release-version record and Public milestone currently present in the repository. It does not claim that the local catalog contains every iOS 11 release Apple shipped.

## Batch summary

- Accessed: 2026-07-30
- Target guard: `lh3yswzu/production`
- Audited local release-version records: 12
- Public-event overlays: 12
- Structured, source-backed change occurrences: 39
- Declared first-party sources: 17
- Builds added: 0
- Prerelease events enriched: 0
- Editorial posture after review: `editoriallyVerified`, `approved`, and
  indexable

All article text is original synthesis. It paraphrases the cited Apple material, keeps product and regional qualifications where relevant, and attaches claim-level citations rather than reproducing publisher prose.

## Exact local coverage

| Record               | Public date | Structured changes | Route  |
| -------------------- | ----------- | -----------------: | ------ |
| `version-ios-11-0`   | 2017-09-19  |                  6 | public |
| `version-ios-11-0-1` | 2017-09-26  |                  1 | public |
| `version-ios-11-0-2` | 2017-10-03  |                  3 | public |
| `version-ios-11-0-3` | 2017-10-11  |                  2 | public |
| `version-ios-11-1`   | 2017-10-31  |                  4 | public |
| `version-ios-11-1-1` | 2017-11-09  |                  2 | public |
| `version-ios-11-1-2` | 2017-11-16  |                  2 | public |
| `version-ios-11-2`   | 2017-12-02  |                  5 | public |
| `version-ios-11-2-1` | 2017-12-13  |                  1 | public |
| `version-ios-11-3`   | 2018-03-29  |                  6 | public |
| `version-ios-11-4`   | 2018-05-29  |                  4 | public |
| `version-ios-11-4-1` | 2018-07-09  |                  3 | public |

The dates above were reconciled against `scripts/seed-data.json`. Every local record has exactly one Public milestone on the same date as its `publicReleaseDate`, so every event target uses only `releaseVersionId` plus `routeAlias: "public"`.

## Verified first-party sources

All URLs below were opened and checked on 2026-07-30. Apple Support displays a current day-level “Published Date” for these living historical pages; the manifest normalizes that displayed day to midnight UTC because the ingestion schema requires a datetime. This is not a claim that Apple originally published the historical material at midnight or on the current page-update date.

| Source                                                                                                                                                           | Displayed or original date | Use                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------- |
| [About iOS 11 Updates](https://support.apple.com/en-us/102991)                                                                                                   | 2023-11-15                 | iOS, 11, consumer release notes |
| [About the security content of iOS 11](https://support.apple.com/en-us/103804)                                                                                   | 2023-11-06                 | iOS, 11.0, security             |
| [About the security content of iOS 11.0.1](https://support.apple.com/en-us/103465)                                                                               | 2023-11-03                 | iOS, 11.0.1, security           |
| [About the security content of iOS 11.0.2](https://support.apple.com/en-us/103642)                                                                               | 2023-11-06                 | iOS, 11.0.2, security           |
| [About the security content of iOS 11.0.3](https://support.apple.com/en-us/103643)                                                                               | 2023-11-06                 | iOS, 11.0.3, security           |
| [About the security content of iOS 11.1](https://support.apple.com/en-us/103681)                                                                                 | 2023-11-03                 | iOS, 11.1, security             |
| [About the security content of iOS 11.1.1](https://support.apple.com/en-us/103645)                                                                               | 2023-11-06                 | iOS, 11.1.1, security           |
| [About the security content of iOS 11.1.2](https://support.apple.com/en-us/103646)                                                                               | 2023-11-06                 | iOS, 11.1.2, security           |
| [About the security content of iOS 11.2](https://support.apple.com/en-us/103808)                                                                                 | 2023-11-06                 | iOS, 11.2, security             |
| [About the security content of iOS 11.2.1](https://support.apple.com/en-us/103647)                                                                               | 2023-11-03                 | iOS, 11.2.1, security           |
| [About the security content of iOS 11.3](https://support.apple.com/en-us/103809)                                                                                 | 2023-11-06                 | iOS, 11.3, security             |
| [About the security content of iOS 11.4](https://support.apple.com/en-us/103082)                                                                                 | 2023-11-02                 | iOS, 11.4, security             |
| [About the security content of iOS 11.4.1](https://support.apple.com/en-us/103694)                                                                               | 2023-11-03                 | iOS, 11.4.1, security           |
| [iOS 11 is available tomorrow](https://www.apple.com/newsroom/2017/09/ios-11-available-tomorrow/)                                                                | 2017-09-18                 | iOS, 11.0, public availability  |
| [Apple Pay Cash and person to person payments now available](https://www.apple.com/newsroom/2017/12/apple-pay-cash-and-person-to-person-payments-now-available/) | 2017-12-05                 | iOS, 11.2, Apple Pay Cash       |
| [iOS 11.3 is available today](https://www.apple.com/newsroom/2018/03/ios-11-3-is-available-today/)                                                               | 2018-03-29                 | iOS, 11.3, public availability  |
| [ARKit 1.5 Now Available](https://developer.apple.com/news/?id=01242018b)                                                                                        | 2018-01-24                 | iOS, 11.3, ARKit 1.5            |

No independent reporting was needed for the included claims. Apple’s consumer notes supply the user-facing changes; its security advisories anchor release dates and narrowly support the structured security entries; Newsroom clarifies major-release availability and the delayed service activation of Apple Pay Cash; Apple Developer corroborates the ARKit 1.5 developer-facing scope.

## Editorial boundaries

### Cumulative notes are attached only to Public events

The local seed contains developer betas, public betas, and golden-master milestones for several iOS 11 versions. Apple’s surviving consumer pages are cumulative release notes, not beta-by-beta changelogs. This batch therefore enriches only the existing Public route and does not assign a feature to a particular beta.

### Sparse patches stay sparse

Apple does not itemize the user-facing fixes in iOS 11.0.1. The record says only that Apple classified it as a bug-fix and improvement update and that its security advisory inherited the iOS 11 security content. It does not import Exchange or other claims from third-party summaries. Similarly, security advisories that merely say a patch inherited an earlier security baseline are not converted into invented new security fixes.

### Service activation is distinct from software delivery

iOS 11.2 shipped on December 2, 2017, but Apple’s Newsroom says eligible U.S. customers could begin using Apple Pay Cash on December 5 after restarting an iOS 11.2 device. The batch describes 11.2 as adding the required system support and records the later service activation instead of implying the service was usable everywhere at the instant the binary appeared.

### No build or unsupported beta inference

No build documents are included. The available consumer and security pages do not establish a complete, audited mapping of build numbers to the local Public events. Developer material describing ARKit 1.5 in the 11.3 beta is used only to corroborate the developer-facing feature scope later documented in the public 11.3 release; it is not used to create a beta article.

## Local-catalog and source gaps

- Apple’s consumer history lists four shipped iOS 11 releases without matching local release-version records: **11.2.2**, **11.2.5**, **11.2.6**, and **11.3.1**. This batch does not create, merge, or redirect those missing records.
- The local track ends at 11.4.1, matching Apple’s final listed iOS 11 release.
- Apple’s consumer page is substantially more detailed for 11.0, 11.1, 11.2, 11.3, and 11.4 than for most patch releases. Patch articles intentionally reflect that evidence imbalance.
- Apple Support pages are living documents. Their displayed 2023 publication dates are treated as source-metadata dates, not the original release-note publication times.
- No community-sourced or undocumented change is promoted to confirmed status in this cohort.

## Validation and guarded dry run

Local shape validation:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-11.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
```

Focused tests:

```sh
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npm run research:validate
```

Production-snapshot read-only plan, intentionally without `--apply`:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-11.json
```

The target guard, plan digest, draft checks, rollback artifact, and any later human approval remain owned by the shared ingestion pipeline.

## Validation result

The commands above were run on 2026-07-30. Bundle validation passed, the 12
version IDs matched the local iOS 11 inventory exactly, and all 12 event
targets matched records with one same-date Public milestone. The focused
ingestion tests passed 12 of 12, and the repository-wide research validator
accepted all 39 release-scoped change keys.

The final production-snapshot plan resolved every target to an existing public
release event and applied:

- 17 source creates
- 39 release-change creates
- 12 release-version patches
- 12 release-event patches
- 0 release-event creates
- 0 release-build creates
- 145,047 bytes of guarded mutation payload, 3.7% of the pipeline limit

The batch was editorially approved at `2026-07-30T04:16:06Z`. The exact applied
plan SHA was
`61551994d2d9c739ee4d87cc8ceee0d8210495ad25c0c1eb415fe99baf82bd3c`.
Sanity committed transaction `tt1fSB5HY9GAB0YLyxmEnx`, and the ingestion
pipeline verified zero residual mutations.
