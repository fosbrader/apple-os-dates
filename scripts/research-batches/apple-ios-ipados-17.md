# iOS and iPadOS 17 research batch

This companion note documents the evidence, scope, and review posture for [`apple-ios-ipados-17.json`](./apple-ios-ipados-17.json). It is a research batch for the audited records that currently exist in this repository; it is not a claim that the local dataset contains every iOS or iPadOS 17 release Apple shipped.

## Batch summary

- Accessed: 2026-07-29
- Target guard: `lh3yswzu/production`
- Audited release-version records covered: 25
  - iOS: 18
  - iPadOS: 7
- Durable public event targets: 25, all selected by `{releaseVersionId, routeAlias: "public"}`
- Structured, source-backed change occurrences: 72
- Declared first-party sources: 16
- Builds added: 0
- Beta, release-candidate, and other prerelease events enriched: 0
- Editorial posture after root review: `editoriallyVerified`, `approved`, and
  `isIndexable: true`

The JSON contains original synthesis, not copied release-note text. Each factual prose block and every structured change has an inline citation with a human-readable locator.

## Scope and identity rules

Only the audited local records listed below are in scope. A version overview and a full public-event article are provided for every record. Public-event content uses the migration tool's durable route identity rather than a milestone array key or positional `m` key.

Apple's rolling “About … Updates” pages describe versions, not individual beta builds. This batch therefore never attaches a cumulative version note to a beta. The public event receives the cumulative public-release description; prerelease appearances remain untouched until beta-specific evidence is available.

## Coverage

| Record                | Public date | Structured changes | Primary release-date evidence  |
| --------------------- | ----------- | -----------------: | ------------------------------ |
| `version-ios-17-0`    | 2023-09-18  |                  5 | Apple security advisory        |
| `version-ios-17-0-1`  | 2023-09-21  |                  1 | Apple security advisory        |
| `version-ios-17-0-2`  | 2023-09-26  |                  2 | Apple 2022–2023 security index |
| `version-ios-17-0-3`  | 2023-10-04  |                  2 | Apple security advisory        |
| `version-ios-17-1`    | 2023-10-25  |                  4 | Apple security advisory        |
| `version-ios-17-1-1`  | 2023-11-07  |                  2 | Apple 2022–2023 security index |
| `version-ios-17-1-2`  | 2023-11-30  |                  1 | Apple security advisory        |
| `version-ios-17-2`    | 2023-12-11  |                  5 | Apple security advisory        |
| `version-ios-17-2-1`  | 2023-12-19  |                  1 | Apple 2022–2023 security index |
| `version-ios-17-3`    | 2024-01-22  |                  3 | Apple security advisory        |
| `version-ios-17-3-1`  | 2024-02-08  |                  1 | Apple security index           |
| `version-ios-17-4`    | 2024-03-05  |                  5 | Apple security advisory        |
| `version-ios-17-4-1`  | 2024-03-21  |                  1 | Apple security advisory        |
| `version-ios-17-5`    | 2024-05-13  |                  4 | Apple security advisory        |
| `version-ios-17-5-1`  | 2024-05-20  |                  1 | Apple security index           |
| `version-ios-17-6`    | 2024-07-29  |                  2 | Apple security advisory        |
| `version-ios-17-6-1`  | 2024-08-07  |                  1 | Apple security index           |
| `version-ios-17-7`    | 2024-09-16  |                  1 | Apple security advisory        |
| `version-ipados-17-0` | 2023-09-18  |                  6 | Apple security advisory        |
| `version-ipados-17-1` | 2023-10-25  |                  4 | Apple security advisory        |
| `version-ipados-17-2` | 2023-12-11  |                  5 | Apple security advisory        |
| `version-ipados-17-3` | 2024-01-22  |                  4 | Apple security advisory        |
| `version-ipados-17-4` | 2024-03-05  |                  5 | Apple security advisory        |
| `version-ipados-17-5` | 2024-05-13  |                  4 | Apple security advisory        |
| `version-ipados-17-6` | 2024-07-29  |                  2 | Apple security advisory        |

## Verified first-party sources

All URLs below were opened and checked on 2026-07-29. The author recorded in the manifest is the corporate author, Apple. Apple Support displays a day-level “Published Date”; the manifest normalizes that day to midnight UTC because the ingestion schema requires a datetime. That normalization does not claim Apple published at midnight.

| Source                                                                                     | Displayed publication date | Use                                                             |
| ------------------------------------------------------------------------------------------ | -------------------------- | --------------------------------------------------------------- |
| [About iOS 17 Updates](https://support.apple.com/en-us/118723)                             | 2025-05-13                 | iOS version sections and consumer-facing deltas                 |
| [About iPadOS 17 Updates](https://support.apple.com/en-us/118702)                          | 2026-05-11                 | iPadOS version sections and consumer-facing deltas              |
| [Apple security releases](https://support.apple.com/en-us/100100)                          | 2026-07-27                 | 2024 dates, advisory links, and “no published CVE entries” rows |
| [Apple security updates (2022 to 2023)](https://support.apple.com/en-us/121012)            | 2026-06-04                 | 2023 dates, advisory links, and “no published CVE entries” rows |
| [Security content of iOS 17 and iPadOS 17](https://support.apple.com/en-us/120949)         | 2025-04-07                 | 17.0 release date and CVE-level security evidence               |
| [Security content of iOS 17.0.1 and iPadOS 17.0.1](https://support.apple.com/en-us/106369) | 2023-11-15                 | 17.0.1 release date and three disclosed issues                  |
| [Security content of iOS 17.0.3 and iPadOS 17.0.3](https://support.apple.com/en-us/106367) | 2023-11-15                 | 17.0.3 release date and disclosed issues                        |
| [Security content of iOS 17.1 and iPadOS 17.1](https://support.apple.com/en-us/109052)     | 2024-08-12                 | 17.1 release date and security evidence                         |
| [Security content of iOS 17.1.2 and iPadOS 17.1.2](https://support.apple.com/en-us/120296) | 2024-06-12                 | 17.1.2 release date and two WebKit issues                       |
| [Security content of iOS 17.2 and iPadOS 17.2](https://support.apple.com/en-us/120877)     | 2026-03-11                 | 17.2 release date and security evidence                         |
| [Security content of iOS 17.3 and iPadOS 17.3](https://support.apple.com/en-us/120304)     | 2024-06-12                 | 17.3 release date and security evidence                         |
| [Security content of iOS 17.4 and iPadOS 17.4](https://support.apple.com/en-us/120893)     | 2025-02-05                 | 17.4 release date and security evidence                         |
| [Security content of iOS 17.4.1 and iPadOS 17.4.1](https://support.apple.com/en-us/120890) | 2024-08-13                 | 17.4.1 release date and CVE-2024-1580                           |
| [Security content of iOS 17.5 and iPadOS 17.5](https://support.apple.com/en-us/120905)     | 2025-01-15                 | 17.5 release date and security evidence                         |
| [Security content of iOS 17.6 and iPadOS 17.6](https://support.apple.com/en-us/120909)     | 2025-03-20                 | 17.6 release date and security evidence                         |
| [Security content of iOS 17.7 and iPadOS 17.7](https://support.apple.com/en-us/121246)     | 2025-03-03                 | 17.7 release date and security evidence                         |

No independent reporting was needed for this batch. The included claims are all documented by Apple. Future community-sourced or undocumented claims should use journalism or community sources only for facts those sources independently establish, with named author, publication date, locator, and a `reported` or `corroborated` evidence state as appropriate.

## Evidence decisions

### Product notes versus security notes

The rolling product-note pages establish Apple’s public feature and bug-fix descriptions. Security advisories and security indexes establish dates and disclosed security content. A version-specific security advisory may have been revised months or years after the release; the batch records the page’s current displayed publication date and uses its explicit “Released …” line as the historical release-date locator.

### “No published CVE entries” is not “no security changes”

Apple’s indexes say there were no published CVE entries for these audited iOS patches:

- iOS 17.1.1
- iOS 17.2.1
- iOS 17.3.1
- iOS 17.5.1
- iOS 17.6.1

The general September 26 release of iOS/iPadOS 17.0.2 also has no published CVE entries, even though the iOS consumer note describes the release as including security updates. The JSON preserves both facts and does not infer a private vulnerability list.

### Patch releases with limited notes

Apple did not identify the individual fixes in iOS 17.2.1 beyond a general bug-fix description. The batch keeps one coarse maintenance change rather than inventing a list. Likewise, iOS 17.6.1 is limited to the documented Advanced Data Protection control fix, and iOS 17.5.1 is limited to the documented Photos database issue.

## Gaps and uncertain mappings

- **iOS 17.0.2 has two Apple index rows.** Apple lists an iPhone 15-only iOS 17.0.2 release on 2023-09-21 and a general iOS/iPadOS 17.0.2 release on 2023-09-26. The audited local record is dated 2023-09-26, so this batch maps it to the general release. It does not merge the earlier device-specific appearance into the public event.
- **The local iPadOS track is sparse.** It contains only 17.0 through 17.6. Apple’s own page documents additional iPadOS 17 patch releases and later 17.7.x maintenance releases, but this batch does not create missing release-version records.
- **The local iOS track ends at 17.7.** Later 17.7.x maintenance releases shown by Apple are outside this batch because no matching audited release-version records exist locally.
- **Apple’s product pages are living documents.** Their current publication dates are not treated as the original posting dates for every section.
- **No beta-specific research is included.** Cumulative notes cannot establish which beta first contained a change. Every event target in this batch is `routeAlias: "public"`.
- **No build records are inferred.** Build numbers need a separate first-party release or developer source and an audited event mapping.
- **No unsupported absence claims are made.** A missing CVE entry, missing note, or missing local record is recorded as a gap, not proof that nothing changed.

## Review and dry-run procedure

The root editorial review checked the prose, source locators, platform scope,
and the iOS 17.0.2 mapping before recording approval. The guarded dry run was
then repeated because approval changes the content and plan digests.

Local shape validation:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-ipados-17.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
```

Production-snapshot dry run, with no `--apply` flag:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-17.json
```

The production guard, exact-plan digest, rollback artifact, draft checks, and explicit apply confirmation remain owned by the shared ingestion pipeline. This research batch does not relax or bypass any of those safeguards.

## Validation result

The commands above were run on 2026-07-29. Local bundle validation passed, the 25 manifest IDs matched the 25 audited local records exactly, and the focused ingestion tests passed 12 of 12.

The approved production-snapshot dry run resolved all 25 targets to existing
release events and proposed:

- 15 source creates
- 72 release-change creates
- 25 release-version patches
- 25 release-event patches
- 1 existing-source metadata patch
- 0 release-event creates
- 0 release-build creates
- 251,032 bytes of guarded mutation payload, 6.4% of the pipeline limit

The exact reviewed plan SHA was
`7b95fbf3e0e590a3e713e7d9c390552742e689cfa0ca74e7b029a762b315a2e2`.
It was applied with revision guards and zero-residual verification in Sanity
transaction `eOgq1Ovu5XNUv1qNFUUf1z`.
