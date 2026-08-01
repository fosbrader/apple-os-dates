# Apple 2011 non-iPhone research batch

## Result

`apple-other-2011.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2011. The exact cohort is one data-rich Mac OS X Lion 10.7 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.7 (Lion) | 2 | 1 | 12 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **12** |

The local Lion record contains a February 24 milestone labeled `Beta 1` and a July 20 public milestone. Apple's February announcement precisely identifies the earlier software as a developer preview for Mac Developer Program members. This bundle enriches only the durable public route through `releaseVersionId: "version-macos-10-7"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:49:02Z.
- The public event is indexable after editorial approval.
- All 12 changes are `documented`, `confirmed`, and public-release `delta` entries.
- No undocumented-change or initial-security claim is included.
- Detailed pre-release descriptions are used only when Apple's July launch independently confirms the named feature shipped.
- Preview-only FileVault and Lion Server descriptions are not promoted into the consumer 10.7 public delta list.
- No 10.7.1, 10.7.2, or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's first-day sales/download figure is explicitly labeled a vendor-reported claim, not an independent measurement.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2011 public appearance: macOS-family record 10.7, named Lion, with two local milestones.
2. Apple's February 24 announcement confirms a same-day developer preview. The batch does not attach event content to that non-public milestone.
3. Apple's June 6 announcement narrowed final availability to July, and the July 20 Newsroom page records the public release. The local July 20 date therefore remains unchanged.
4. The product was named Mac OS X Lion in Apple's 2011 material. The local information architecture groups the historical release under the `macOS` platform family; editorial copy retains the historical Mac OS X name.
5. Apple's archived security index does not contain an initial Lion 10.7 line or a Lion 10.7.1 release line. It lists a September 9 security update for systems already on 10.7.1 and separately lists Lion 10.7.2 on October 12.
6. The local catalog has no 10.7.1 or 10.7.2 releaseVersion record. This existing-record-only batch does not create those versions, infer a 10.7.1 date, or merge their changes into 10.7.
7. Apple TV software appears elsewhere in Apple's 2011 archive under its historical naming scheme, but the local catalog has no corresponding 2011 tvOS version route. This batch does not relabel or manufacture one.

## Source ledger

All 6 declared sources are human-readable first-party Apple materials checked on 2026-07-30; all 6 are cited by the bundle.

- <https://support.apple.com/en-us/101444> — archived 2011–2012 security chronology and its initial-Lion/10.7.1 omissions
- <https://www.apple.com/newsroom/2011/02/24Apple-Releases-Developer-Preview-of-Mac-OS-X-Lion/> — February 24 developer-preview availability and clearly bounded preview detail
- <https://www.apple.com/newsroom/2011/06/06Mac-OS-X-Lion-With-250-New-Features-Available-in-July-From-Mac-App-Store/> — June 6 launch-season feature descriptions, requirements, and July availability
- <https://www.apple.com/newsroom/2011/07/20Mac-OS-X-Lion-Available-Today-From-the-Mac-App-Store/> — July 20 public availability, confirmed launch features, compatibility, and distribution
- <https://www.apple.com/newsroom/2011/07/21Lion-Downloads-Top-One-Million-in-First-Day/> — Apple's July 21 first-day sales/download report, retained as an attributed vendor claim
- <https://support.apple.com/en-us/103345> — version-specific 10.7.2 security content used only to enforce the later-release boundary

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses explicitly labeled versions and release lines, not current page revision timestamps.

## Known gaps

1. Lion 10.7.1 and 10.7.2 are absent from the scoped local catalog. Apple's archive establishes the existence of 10.7.1 by September 9 and dates 10.7.2 to October 12, but this batch neither invents the missing 10.7.1 date nor creates either route.
2. Apple's retained 2011–2012 security index lists Safari and iWork entries for July 20 but no initial Lion 10.7 security entry, and exact first-party searches did not surface a retained dedicated 10.7 advisory. The bundle therefore contains zero initial-security deltas.
3. The seed's February 24 `Beta 1` label is broader than Apple's precise `developer preview` wording. This batch does not alter the seed or attach beta-specific release notes.
4. FileVault and Lion Server appear in the February preview but are not repeated in the July public-launch feature list. They are recorded only as an exclusion boundary, not structured as confirmed public deltas.
5. June feature detail is pre-release material. Structured entries pair it with the July launch confirmation for the same named feature and label June-only detail as pre-release context.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. Apple's first-day figure is a vendor-issued report. No independent sales, market-share, or adoption dataset was found or implied in this first-party-only cohort.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 12 globally consistent change keys, 6 sources, and 60 citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, 6 of 6 declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 17 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 5 source documents and 12 change documents; zero version, event, or build creates. The plan included the existing Lion version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 51,283 bytes, reported as 1.3% of the guarded limit.
- Applied production plan SHA: `b73ead74f5fa39a540b63a296cf989692902b299281a2ee58390e69088bac8b2`.
- Production transaction `tt1fSB5HY9GAB0YLyxycxL` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `d9461abe0eb00630bc36f49285549066b4c7a950557be221d69c3568f9fddb91`.
- Post-apply zero-residual plan SHA: `adf6a80cb8b005e1855bc3773b3a5712c2a863bcfb1c30c8e754b1c956e1bc80`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.7`.
