# Apple 2012 non-iPhone research batch

## Result

`apple-other-2012.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2012. The exact cohort is one data-rich OS X Mountain Lion 10.8 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.8 (Mountain Lion) | 2 | 1 | 17 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **17** |

The local Mountain Lion record contains a February 16 milestone labeled `Beta 1` and a July 25 public milestone. Apple's February announcement precisely describes the first date as a developer preview for Mac Developer Program members. This bundle enriches only the existing public route through `releaseVersionId: "version-macos-10-8"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:46:31Z.
- The public event is indexable after editorial approval.
- All 17 changes are `documented`, `confirmed`, and public-release `delta` entries.
- Every structured change cites Apple's July 25 public-availability announcement; earlier sources can add context but never substitute for final confirmation.
- No undocumented-change claim is included.
- No preview-only API or behavior is promoted into the July public release.
- No 10.8.1, 10.8.2, or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's browser-performance statement and download total remain attributed vendor claims, not independent measurements.
- Apple product and service names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory, preview, and chronology boundaries

1. Seed closure is exact: macOS-family version 10.8, named Mountain Lion, is the only non-iOS/iPadOS record with a 2012 public appearance. It has exactly two local milestones.
2. No other checked-in research batch owns `version-macos-10-8`; the generator verifies sole ownership before writing this bundle.
3. Apple's February 16 page is explicitly a developer preview. It documents the development trail, but the bundle attaches no article or change set to the non-public milestone.
4. Apple's June 11 page promised July availability. It provides pre-release context for features later named at launch but is not treated as proof of the exact public date.
5. Apple's July 25 page controls the public date and every structured launch change. Apple's July 30 follow-up supplies post-launch confirmation and reports more than three million downloads over four days.
6. Facebook integration appears in the July feature list but is explicitly deferred by the same page to an upcoming software update. It is excluded from the 10.8 launch delta.
7. The February preview described AirPlay Mirroring as 720p; the final July page says up to 1080p. The launch record uses the final specification and documents the preview number only as superseded context.
8. The historical product name is OS X Mountain Lion. The local information architecture groups the release under the `macOS` platform family while preserving Apple's contemporaneous naming in editorial prose.

## Source ledger

All 5 declared sources are human-readable first-party Apple pages checked on 2026-07-30; all 5 are cited by the bundle.

- <https://support.apple.com/en-us/101444> — archived 2011–2012 security chronology and the later 10.8.2 boundary
- <https://www.apple.com/newsroom/2012/02/16Apple-Releases-OS-X-Mountain-Lion-Developer-Preview-with-Over-100-New-Features/> — February 16 developer-preview availability and preview-only claims
- <https://www.apple.com/newsroom/2012/06/11Mountain-Lion-Available-in-July-From-Mac-App-Store/> — planned July availability and pre-release feature detail
- <https://www.apple.com/newsroom/2012/07/25Mountain-Lion-Available-Today-From-the-Mac-App-Store/> — July 25 public availability, confirmed shipped scope, compatibility, and the Facebook deferral
- <https://www.apple.com/newsroom/2012/07/30Mountain-Lion-Downloads-Top-Three-Million/> — July 30 post-launch confirmation and Apple-reported download count

Apple Support pages are archived or living documents and can display revision dates much later than the historical release. Mapping therefore uses the explicitly labeled release lines and dated Newsroom pages, not the current page-revision timestamp.

## Known gaps and anomalies

1. Apple's archived 2011–2012 security index does not list OS X Mountain Lion 10.8 as a July 25 security release. It lists Xcode 4.4 and Safari 6.0 that day, then Mountain Lion 10.8.2 on September 19.
2. No surviving first-party, launch-specific Mountain Lion 10.8 security advisory was found. Gatekeeper is therefore recorded as a launch feature, while no CVE repair group is inferred.
3. The security index documents 10.8.2 and names 10.8.1 as an eligible predecessor. Neither point version has an existing local `releaseVersion` route, so this batch creates neither and imports no later change.
4. Apple's launch announcement confirms a faster Safari but does not provide a reproducible benchmark in the retained page. The structured entry preserves the statement as an attributed vendor claim.
5. The February and June pages contain more detailed developer, security, Safari, Messages, and Power Nap descriptions than the July launch page. Only details tied to an explicitly launch-confirmed feature are used, and preview-only developer APIs remain outside the structured change set.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. The public article does not treat Apple's more-than-200-features headline as 200 independently verified changes. It records 17 distinct claims supported by the retained public announcement.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 17 globally consistent change keys, 5 sources, and 63 citation references for this file.
- Inventory closure passed and is enforced inside the generator: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, 5 of 5 declared sources cited, sole batch ownership, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 21 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 4 source documents and 17 change documents; zero version, event, or build creates. The plan included the existing Mountain Lion version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 60,442 bytes, reported as 1.5% of the guarded limit.
- Applied production plan SHA: `1f7aa762abffe8cd65360edee97a80b8612ce43171270f3ba59adc8e547001d9`.
- Production transaction `eOgq1Ovu5XNUv1qNFUdpwF` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `e734249c345488a3eac5823f5ccdf73ea8e639964d03ad5c1b59b803d6367fa6`.
- Post-apply zero-residual plan SHA: `530b79e829b677ac060fabd44b771cd9b62551f649ec46925ab1197a1af7f044`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.8`.
