# iOS and iPadOS 15 research batch

This companion note documents the evidence, scope, and review posture for [`apple-ios-ipados-15.json`](./apple-ios-ipados-15.json). It is a research batch for the audited records that currently exist in this repository; it is not a claim that the local dataset contains every iOS or iPadOS 15 release Apple shipped.

## Batch summary

- Accessed: 2026-07-29
- Target guard: `lh3yswzu/production`
- Audited release-version records covered: 20
  - iOS: 12
  - iPadOS: 8
- Durable public event targets: 20, all selected by `{releaseVersionId, routeAlias: "public"}`
- Structured, source-backed change occurrences: 69
- Declared first-party sources: 16
- Builds added: 0
- Beta, release-candidate, and other prerelease events enriched: 0
- Editorial posture after root review: `editoriallyVerified`, `approved`, and
  `isIndexable: true`

The JSON contains original synthesis, not copied release-note text. Each factual prose block and every structured change has an inline citation with a human-readable locator.

## Scope and identity rules

Only the audited local records listed below are in scope. A version overview and a full public-event article are provided for every record. Public-event content uses the ingestion tool’s durable route identity rather than a milestone array key or positional `m` key.

Apple’s rolling “About … Updates” pages describe completed versions, not individual beta builds. This batch therefore never attaches a cumulative version note to a beta. The public event receives the cumulative public-release description; prerelease appearances remain untouched until beta-specific evidence is available.

## Coverage

| Record | Public date | Structured changes | Primary release-date evidence |
| --- | --- | ---: | --- |
| `version-ios-15-0` | 2021-09-20 | 5 | Apple security advisory |
| `version-ios-15-1` | 2021-10-25 | 4 | Apple security advisory |
| `version-ios-15-2` | 2021-12-13 | 6 | Apple security advisory |
| `version-ios-15-2-1` | 2022-01-12 | 3 | Apple security advisory |
| `version-ios-15-3` | 2022-01-26 | 2 | Apple security advisory |
| `version-ios-15-3-1` | 2022-02-10 | 2 | Apple security advisory |
| `version-ios-15-4` | 2022-03-14 | 5 | Apple security advisory |
| `version-ios-15-4-1` | 2022-03-31 | 3 | Apple security advisory |
| `version-ios-15-5` | 2022-05-16 | 4 | Apple security advisory |
| `version-ios-15-6` | 2022-07-20 | 4 | Apple security advisory |
| `version-ios-15-6-1` | 2022-08-17 | 1 | Apple security advisory |
| `version-ios-15-7` | 2022-09-12 | 1 | Apple security advisory |
| `version-ipados-15-0` | 2021-09-20 | 6 | Apple security advisory |
| `version-ipados-15-1` | 2021-10-25 | 4 | Apple security advisory |
| `version-ipados-15-2` | 2021-12-13 | 6 | Apple security advisory |
| `version-ipados-15-3` | 2022-01-26 | 2 | Apple security advisory |
| `version-ipados-15-4` | 2022-03-14 | 4 | Apple security advisory |
| `version-ipados-15-5` | 2022-05-16 | 2 | Apple security advisory |
| `version-ipados-15-6` | 2022-07-20 | 4 | Apple security advisory |
| `version-ipados-15-7` | 2022-09-12 | 1 | Apple security advisory |

## Verified first-party sources

All URLs below were opened and checked on 2026-07-29. The manifest records Apple as the corporate author and Apple Support as publisher. Apple Support displays a day-level “Published Date”; the manifest normalizes that day to midnight UTC because the ingestion schema requires a datetime. This does not claim Apple published at midnight.

| Source | Displayed publication date | Use |
| --- | --- | --- |
| [About iOS 15 Updates](https://support.apple.com/en-us/108051) | 2026-05-28 | iOS version sections and consumer-facing deltas |
| [About iPadOS 15 Updates](https://support.apple.com/en-us/108049) | 2026-05-28 | iPadOS version sections and consumer-facing deltas |
| [Apple security updates (2020 to 2021)](https://support.apple.com/en-us/120989) | 2026-07-22 | 2021 release-date cross-check |
| [Apple security updates (2022 to 2023)](https://support.apple.com/en-us/121012) | 2026-06-04 | 2022 release-date cross-check |
| [Security content of iOS 15 and iPadOS 15](https://support.apple.com/en-us/103235) | 2023-11-03 | 15.0 release date and security evidence |
| [Security content of iOS 15.1 and iPadOS 15.1](https://support.apple.com/en-us/103161) | 2023-11-02 | 15.1 release date and security evidence |
| [Security content of iOS 15.2 and iPadOS 15.2](https://support.apple.com/en-us/102875) | 2023-10-31 | 15.2 release date and security evidence |
| [Security content of iOS 15.2.1 and iPadOS 15.2.1](https://support.apple.com/en-us/103171) | 2023-11-03 | 15.2.1 release date and HomeKit issue |
| [Security content of iOS 15.3 and iPadOS 15.3](https://support.apple.com/en-us/103172) | 2023-11-03 | 15.3 release date and security evidence |
| [Security content of iOS 15.3.1 and iPadOS 15.3.1](https://support.apple.com/en-us/103182) | 2023-11-02 | 15.3.1 date and CVE-2022-22620 |
| [Security content of iOS 15.4 and iPadOS 15.4](https://support.apple.com/en-us/102850) | 2023-10-31 | 15.4 release date and security evidence |
| [Security content of iOS 15.4.1 and iPadOS 15.4.1](https://support.apple.com/en-us/102999) | 2023-10-31 | 15.4.1 date and CVE-2022-22675 |
| [Security content of iOS 15.5 and iPadOS 15.5](https://support.apple.com/en-us/120323) | 2024-06-13 | 15.5 release date and security evidence |
| [Security content of iOS 15.6 and iPadOS 15.6](https://support.apple.com/en-us/102892) | 2023-10-31 | 15.6 release date and security evidence |
| [Security content of iOS 15.6.1 and iPadOS 15.6.1](https://support.apple.com/en-us/103005) | 2023-11-02 | 15.6.1 date and exploited-issue evidence |
| [Security content of iOS 15.7 and iPadOS 15.7](https://support.apple.com/en-us/102837) | 2024-06-04 | 15.7 release date and security evidence |

No independent reporting was needed for this batch. The included claims are documented by Apple. Future community-sourced or undocumented claims should use journalism or community sources only for facts those sources independently establish, with a named author, publication date, locator, and a `reported` or `corroborated` evidence state as appropriate.

## Evidence decisions

### Product notes versus security notes

The rolling product-note pages establish Apple’s public feature and bug-fix descriptions. Security advisories establish dates and disclosed security content; the security indexes provide a separate date cross-check. A version-specific advisory may have been revised months or years after release, so the batch records the page’s current displayed publication date and uses its explicit “Released …” line as the historical date locator.

### Living pages are not contemporaneous snapshots

Apple’s current “About iOS 15 Updates” and “About iPadOS 15 Updates” pages were revised in 2026. Their displayed publication dates are not treated as the original posting dates for every historical section. The claims in this batch are limited to the version-specific content now presented by Apple and the historical dates stated by Apple’s advisories and indexes.

### Coarse notes remain coarse

Apple’s consumer notes for iOS 15.3 and iPadOS 15.3 say only that the releases include bug fixes and security updates. The JSON preserves that limited granularity rather than inventing feature-level detail. Likewise, the 15.7 product notes identify important security updates without claiming a new feature set.

### Exploitation language is attributed precisely

The 15.3.1, 15.4.1, and 15.6.1 advisories use Apple’s qualified language that it was aware of reports that specified issues may have been actively exploited. The synthesis retains that attribution and uncertainty; it does not convert those statements into broader claims about campaign scope or affected users.

## Gaps and uncertain mappings

- **The local iOS 15 track is incomplete.** Apple documents iOS 15.0.1, 15.0.2, and 15.1.1, but no matching audited release-version records exist locally. They are not created or merged into adjacent versions here.
- **The local iPadOS 15 track is especially sparse.** It lacks matching local records for documented patch releases including 15.0.1, 15.0.2, 15.2.1, 15.3.1, 15.4.1, and 15.6.1. This batch enriches only the eight audited iPadOS records.
- **Both local tracks end at 15.7.** Apple documents later iOS/iPadOS 15.7.x and 15.8.x maintenance releases; those remain outside scope because no matching audited records exist locally.
- **A shared advisory does not create a missing local record.** Several advisories cover both iOS and iPadOS even where the local catalog has only an iOS patch record. The batch uses the advisory as evidence for the in-scope record and does not infer the missing counterpart.
- **No beta-specific research is included.** Cumulative product notes cannot establish which beta first contained a change. Every event target in this batch is `routeAlias: "public"`.
- **No build records are inferred.** Build numbers need a separate first-party release or developer source and an audited event mapping.
- **No unsupported absence claims are made.** A missing note or missing local record is recorded as a gap, not proof that nothing changed.

## Review and dry-run procedure

The root editorial review checked all prose, source locators, platform scope,
security language, and local-catalog omissions before recording approval. The
guarded dry run was then repeated because approval and two neutral wording
edits changed the content digest.

Local shape validation:

```sh
node --import tsx -e 'import fs from "node:fs"; import mod from "./scripts/lib/launch-content-ingestion.ts"; const value = JSON.parse(fs.readFileSync("scripts/research-batches/apple-ios-ipados-15.json", "utf8")); mod.assertLaunchContentBundle(value); console.log("bundle valid")'
```

Production-snapshot dry run, with no `--apply` flag:

```sh
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-ipados-15.json
```

The production guard, exact-plan digest, rollback artifact, draft checks, and explicit apply confirmation remain owned by the shared ingestion pipeline. This research batch does not relax or bypass any of those safeguards.

## Validation result

The commands above were run on 2026-07-29. Local bundle validation
passed, the 20 manifest IDs and public-event targets matched the 20 audited
local records exactly, the focused ingestion tests passed 12 of 12, and the
repository-wide research validator accepted all 69 release-scoped change keys.

The production-snapshot dry run resolved all 20 targets to existing public
release events and proposed:

- 15 source creates and one revision-guarded metadata patch to an existing
  source
- 69 release-change creates
- 20 release-version patches
- 20 release-event patches
- 0 release-event creates
- 0 release-build creates
- 210,526 bytes of guarded mutation payload, 5.4% of the pipeline limit

The exact reviewed plan SHA was
`0b8fe578eb2d60d911fefc6a2a6b3d884f22895490ef500a86d8587de102a4cc`.
The approved plan contained 84 creates, 41 revision-guarded patches, and a
215,532-byte payload. It was applied with zero-residual verification in Sanity
transaction `tt1fSB5HY9GAB0YLyxjYXB`.
