# iOS and iPadOS 13 research batch

This companion note documents the evidence, platform-scope decisions, and review posture for [`apple-ios-ipados-13.json`](./apple-ios-ipados-13.json). It covers the audited iOS and iPadOS 13 records that currently exist in this repository; it does not claim the local catalog contains every release Apple shipped.

## Batch summary

- Accessed: 2026-07-29
- Target guard: `lh3yswzu/production`
- Audited release-version records covered: 22
  - iOS: 14
  - iPadOS: 8
- Actual public-event overlays: 21
  - iOS: 14
  - iPadOS: 7
- Superseded version records intentionally receiving no event overlay: 1 (`version-ipados-13-0`)
- Structured, source-backed change occurrences: 63
- Declared first-party sources: 16
- Builds added: 0
- Beta, release-candidate, and other prerelease events enriched: 0
- Editorial posture: `editoriallyVerified`, `approved`, and indexable after
  final review at `2026-07-30T04:02:46Z`

The JSON is original synthesis, not copied publisher prose. Every factual prose block and structured change has claim-level citations with human-readable locators.

## The iPadOS 13.0 boundary

The local `version-ipados-13-0` record is preserved as a superseded prerelease record. It has no Public milestone locally, and this batch creates no event overlay for it. Apple previewed the newly named iPadOS platform in June 2019, then announced iPadOS as publicly available on September 24; Apple’s security advisory identifies that public release as iPadOS 13.1.

Accordingly:

- iPadOS 13.0 receives a sourced version overview explaining the boundary.
- iPadOS 13.0 receives no `routeAlias: "public"` target.
- iPadOS 13.1 receives the public-launch article and launch changes.
- No 13.0 cumulative note is assigned to a beta or moved onto an invented public event.

## Coverage

| Record | Public date | Structured changes | Route disposition |
| --- | --- | ---: | --- |
| `version-ios-13-0` | 2019-09-19 | 5 | public |
| `version-ios-13-1` | 2019-09-24 | 4 | public |
| `version-ios-13-1-1` | 2019-09-27 | 3 | public |
| `version-ios-13-1-2` | 2019-09-30 | 2 | public |
| `version-ios-13-1-3` | 2019-10-15 | 3 | public |
| `version-ios-13-2` | 2019-10-28 | 5 | public |
| `version-ios-13-3` | 2019-12-10 | 4 | public |
| `version-ios-13-3-1` | 2020-01-28 | 4 | public |
| `version-ios-13-4` | 2020-03-24 | 5 | public |
| `version-ios-13-4-1` | 2020-04-07 | 2 | public |
| `version-ios-13-5` | 2020-05-20 | 5 | public |
| `version-ios-13-5-1` | 2020-06-01 | 1 | public |
| `version-ios-13-6` | 2020-07-15 | 5 | public |
| `version-ios-13-7` | 2020-09-01 | 2 | public |
| `version-ipados-13-0` | — | — | superseded; no public event |
| `version-ipados-13-1` | 2019-09-24 | 5 | public |
| `version-ipados-13-2` | 2019-10-28 | 1 | public |
| `version-ipados-13-3` | 2019-12-10 | 1 | public |
| `version-ipados-13-4` | 2020-03-24 | 3 | public |
| `version-ipados-13-5` | 2020-05-20 | 1 | public |
| `version-ipados-13-6` | 2020-07-15 | 1 | public |
| `version-ipados-13-7` | 2020-09-01 | 1 | public |

## Verified first-party sources

All URLs below were opened and checked on 2026-07-29. Apple Support displays a day-level “Published Date”; the manifest normalizes that day to midnight UTC because the ingestion schema requires a datetime. This does not claim Apple published at midnight.

| Source | Displayed date | Use |
| --- | --- | --- |
| [About iOS 13 Updates](https://support.apple.com/en-us/118392) | 2024-02-26 | iPhone-only consumer release notes |
| [Apple security updates (2018 to 2019)](https://support.apple.com/en-us/103179) | 2023-11-06 | 2019 dates and no-published-CVE rows |
| [Apple security updates (2020 to 2021)](https://support.apple.com/en-us/120989) | 2026-07-22 | 2020 dates, platform availability, and no-published-CVE rows |
| [The new iPadOS powers unique experiences designed for iPad](https://www.apple.com/newsroom/2019/06/the-new-ipados-powers-unique-experiences-designed-for-ipad/) | 2019-06-03 | iPad-specific platform features and prerelease status |
| [New version of the most popular iPad starts shipping tomorrow](https://www.apple.com/newsroom/2019/09/new-version-of-the-most-popular-ipad-starts-shipping-tomorrow/) | 2019-09-24 | First public iPadOS availability |
| [Apple unveils new iPad Pro with breakthrough LiDAR Scanner and brings trackpad support to iPadOS](https://www.apple.com/newsroom/2020/03/apple-unveils-new-ipad-pro-with-lidar-scanner-and-trackpad-support-in-ipados/) | 2020-03-18 | iPadOS 13.4 pointer, trackpad, folder-sharing, and release-date evidence |
| [Security content of iOS 13](https://support.apple.com/en-us/103106) | 2023-11-06 | iOS 13.0 date and iPhone security evidence |
| [Security content of iOS 13.1 and iPadOS 13.1](https://support.apple.com/en-us/103821) | 2023-11-06 | 13.1 date, first iPadOS public version, and security evidence |
| [Security content of iOS 13.1.1 and iPadOS 13.1.1](https://support.apple.com/en-us/103727) | 2023-11-06 | 13.1.1 date and CVE-2019-8779 |
| [Security content of iOS 13.2 and iPadOS 13.2](https://support.apple.com/en-us/103831) | 2023-11-06 | 13.2 date and security evidence |
| [Security content of iOS 13.3 and iPadOS 13.3](https://support.apple.com/en-us/103211) | 2023-11-03 | 13.3 date and security evidence |
| [Security content of iOS 13.3.1 and iPadOS 13.3.1](https://support.apple.com/en-us/103218) | 2023-11-03 | 13.3.1 date and security evidence |
| [Security content of iOS 13.4 and iPadOS 13.4](https://support.apple.com/en-us/103828) | 2023-11-06 | 13.4 date and security evidence |
| [Security content of iOS 13.5 and iPadOS 13.5](https://support.apple.com/en-us/103029) | 2023-11-02 | 13.5 date and security evidence |
| [Security content of iOS 13.5.1 and iPadOS 13.5.1](https://support.apple.com/en-us/103795) | 2023-11-06 | 13.5.1 date and CVE-2020-9859 |
| [Security content of iOS 13.6 and iPadOS 13.6](https://support.apple.com/en-us/103112) | 2023-11-03 | 13.6 date and security evidence |

No independent reporting was needed. The included claims are documented by Apple.

## Platform-scope decisions

### The iOS update page is not an iPadOS release-note page

Apple’s “About iOS 13 Updates” page repeatedly frames its notes around iPhone. It is therefore used only for iOS records. The batch does not copy Deep Fusion, Face ID mask fallback, digital car keys, Health symptom logging, app-less Exposure Notifications, or other iPhone-scoped claims onto iPadOS events.

### Shared security advisories have explicit iPad scope

From iOS/iPadOS 13.1 onward, the selected advisories list supported iPad models in their availability statements. Those advisories support shared security changes and public dates. The iOS 13.0 advisory is iPhone-only and is never used as evidence for iPadOS 13.0.

### Sparse iPad events remain conservative

Where no surviving platform-specific consumer note was verified, an iPadOS event includes only the public appearance and shared advisory-backed security content. iPadOS 13.4 is richer because Apple’s Newsroom announcement explicitly names the version, its March 24 date, pointer and trackpad behavior, and iCloud collaboration.

### No published CVE entries is not a security-fix list

Apple’s indexes say iOS 13.1.2, 13.1.3, 13.4.1, and 13.7 have no published CVE entries. The batch does not transform that statement into a claim that nothing changed or that undisclosed security fixes existed. For the sparse iPadOS 13.7 record, the structured occurrence records only the maintenance appearance and Apple’s absence-of-published-CVEs statement.

## Gaps and local-catalog omissions

- **iPadOS 13.0 did not ship publicly.** It remains a version-only, superseded record; public iPadOS content begins at 13.1.
- **The local iOS track omits documented releases.** Apple’s pages and indexes include iOS 13.2.2, 13.2.3, and 13.6.1, but no matching local release-version records exist. This batch does not create or merge them.
- **The local iPadOS track is much sparser than Apple’s release history.** It omits patch releases including 13.1.1, 13.1.2, 13.1.3, 13.2.2, 13.2.3, 13.3.1, 13.4.1, 13.5.1, and 13.6.1. Shared advisories do not authorize invented local records.
- **Apple’s 2020 index labels the September 1 row “iOS 13.7.”** Its supported-device column explicitly includes iPads. This batch uses that row to anchor the audited local iPadOS 13.7 appearance and its no-published-CVE status, but does not attach the iPhone Exposure Notifications feature to iPad.
- **Apple Support pages are living documents.** Their current publication dates are not treated as the original posting date for every historical section.
- **No beta-specific claims are included.** Cumulative product notes cannot establish which beta first carried a change.
- **No build records are inferred.** Build numbers require a separate first-party build source and audited event mapping.

## Review and guarded-apply procedure

The batch passed human editorial review before indexing.

Local shape validation:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-ipados-13.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
```

Production-snapshot dry run, with no `--apply` flag:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-13.json
```

The production guard, plan digest, rollback artifact, draft checks, and explicit confirmation remain owned by the shared ingestion pipeline.

## Validation result

The commands above were run on 2026-07-29. Local bundle validation passed,
the 22 version IDs matched the local inventory exactly, and the 21 event
targets matched only the local records with an actual Public milestone.
All 22 public-date or no-public dispositions matched, including the absence of
an iPadOS 13.0 event. The focused ingestion tests passed 12 of 12, and the
repository-wide research validator accepted all 63 release-scoped change keys.

The final production-snapshot plan resolved all 21 targets to existing public
release events and applied:

- 15 source creates and one revision-guarded metadata patch to an existing
  source
- 63 release-change creates
- 22 release-version patches
- 21 release-event patches
- 0 release-event creates
- 0 release-build creates
- 219,323 bytes of guarded mutation payload, 5.6% of the pipeline limit

The exact applied plan SHA is
`4cd9d92778c2970fbb64aeff5cda040a89ec027df5008b515d468347f2d58cb0`.
The production transaction `tt1fSB5HY9GAB0YLyxknUL` committed and passed the
pipeline's zero-residual verification.
