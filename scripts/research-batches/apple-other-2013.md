# Apple 2013 non-iPhone research batch

## Result

`apple-other-2013.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2013. The exact cohort is one data-rich OS X Mavericks 10.9 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.9 (Mavericks) | 2 | 1 | 23 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **23** |

The local Mavericks record contains a June 10 milestone labeled `Beta 1` and an October 22 public milestone. Apple's June announcement precisely identifies the June 10 software as a developer preview for Mac Developer Program members. This bundle enriches only the durable public route through `releaseVersionId: "version-macos-10-9"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:42:52Z.
- The public event is indexable after editorial approval.
- All 23 changes are `documented`, `confirmed`, and public-release `delta` entries.
- No undocumented-change claim is included.
- No June-only preview feature is silently promoted into the October public release.
- No 10.9.1 or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's performance and efficiency descriptions remain attributed first-party claims rather than independent benchmark findings.
- Security entries group related remediation surfaces without reproducing Apple's advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2013 public appearance: macOS-family record 10.9, named Mavericks, with two local milestones.
2. Apple's June 10 announcement confirms a same-day developer preview. The batch does not attach event content to that non-public milestone.
3. The launch announcement's URL contains `/2013/10/23`, but its visible press-release date and dateline both say October 22. Apple's separate security index also dates Mavericks 10.9 to October 22, so the local October 22 public date is retained.
4. The product was named OS X Mavericks in Apple's 2013 material. The local information architecture groups the historical release under the `macOS` platform family; editorial copy retains the historical OS X name.
5. Apple's archived index separately lists OS X Mavericks 10.9.1 on December 16, 2013. The local catalog has no 10.9.1 releaseVersion record, so this existing-record-only batch does not create or merge that point release.
6. Apple's 2013 index also lists releases under the historical Apple TV software naming scheme. The local catalog has no corresponding 2013 tvOS version routes, and this batch does not relabel or manufacture them.

## Source ledger

All 5 declared sources are human-readable first-party Apple materials checked on 2026-07-30; all 5 are cited by the bundle.

- <https://support.apple.com/en-us/100502> — archived 2013 release chronology, Mavericks 10.9 availability, and the missing 10.9.1 boundary
- <https://www.apple.com/newsroom/2013/06/10Apple-Releases-Developer-Preview-of-OS-X-Mavericks-With-More-Than-200-New-Features/> — June 10 developer-preview availability and launch-season feature context
- <https://www.apple.com/newsroom/2013/10/23OS-X-Mavericks-Available-Today-Free-from-the-Mac-App-Store/> — October 22 public availability, confirmed launch features, compatibility, and the URL/date anomaly
- <https://www.apple.com/media/us/osx/2013/docs/OSX_Power_Efficiency_Technology_Overview.pdf> — October 2013 technical detail for Mavericks power technologies, user diagnostics, tools, and APIs
- <https://support.apple.com/en-us/103373> — version-specific Mavericks 10.9 security content

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses the explicitly labeled version and release line, not the page's current revision timestamp.

## Known gaps

1. OS X Mavericks 10.9.1 is an Apple-documented 2013 release absent from the scoped local catalog. It remains out of scope until an inventory expansion creates a durable version and event record.
2. The Newsroom launch page's path says October 23 while its own visible date and a separate first-party index say October 22. No one-day shift is made from the URL path.
3. The seed's June 10 `Beta 1` label is broader than Apple's precise `developer preview` wording. This batch does not alter the seed or attach beta-specific release notes.
4. Preview-only details that Apple did not repeat in the October launch announcement or launch-era technical record are not structured as confirmed public deltas.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. The security advisory is a retained document that can receive later editorial revisions. These summaries describe Apple's currently published record for 10.9, not proof that every line appeared in its present wording on launch day.
7. The power-efficiency paper is Apple-authored technical material. Its qualitative and quantitative performance characterizations are vendor claims, not independent test results.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 23 globally consistent change keys, 5 sources, and 69 citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, 5 of 5 declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 27 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 4 source documents and 23 change documents; zero version, event, or build creates. The plan included the existing Mavericks version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 66,203 bytes, reported as 1.7% of the guarded limit.
- Applied production plan SHA: `a81de2d38eb227bc9dc20169abadd26fc72adcf5f692981a7ea9a4af22603c87`.
- Production transaction `eOgq1Ovu5XNUv1qNFUdiMZ` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `99d1271b3e8b1d6f332455d4f88c2c5cd469bb8f7de36e0e7393e65ac45f9265`.
- Post-apply zero-residual plan SHA: `16618b525036d9c980c615260da688abdc297f8c75b7f610f64757f655a36c00`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.9`.
