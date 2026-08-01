# Apple 2014 non-iPhone research batch

## Result

`apple-other-2014.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2014. The exact cohort is one data-rich OS X Yosemite 10.10 article and its durable public event, written as original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.10 (Yosemite) | 2 | 1 | 22 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **22** |

The local Yosemite record contains a June 2 milestone labeled `Beta 1` and an October 16 public milestone. Apple's June announcement calls the June 2 software a developer preview and says a separate customer beta program would follow during the summer. This bundle enriches only the durable public route through `releaseVersionId: "version-macos-10-10"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:38:23Z.
- The public event is indexable after editorial approval.
- All 22 changes are `documented`, `confirmed`, and public-release `delta` entries.
- No undocumented-change claim is included.
- No June-only preview feature is silently promoted into the October public release.
- No 10.10.1 or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's comparative Safari statements are identified as Apple claims, not independent benchmark findings.
- Security entries group related remediation surfaces without reproducing Apple's advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2014 public appearance: macOS-family record 10.10, named Yosemite, with two local milestones.
2. Apple's June 2 announcement confirms a developer preview on the local beta date and announces a later customer beta program. Because the local seed has no separate public-beta route, this batch creates no beta event content and makes no claim about the later beta's exact date.
3. Apple's October launch announcement and archived 2014 security index both support the existing October 16 public date.
4. The product was named OS X Yosemite in Apple's 2014 material. The local information architecture groups the historical release under the `macOS` platform family; the editorial copy retains the historical OS X name.
5. Apple's archived index separately lists OS X Yosemite 10.10.1 on November 17, 2014. The local catalog has no 10.10.1 releaseVersion record, so this existing-record-only batch does not create or merge that point release.
6. Apple's 2014 index also lists several releases under the historical Apple TV software naming scheme. The local catalog has no corresponding 2014 tvOS version routes, and this batch does not relabel or manufacture them.

## Source ledger

All 4 declared sources are human-readable first-party Apple pages checked on 2026-07-30; all 4 are cited by the bundle.

- <https://support.apple.com/en-us/101445> — archived 2014 release chronology, Yosemite 10.10 availability, and the missing 10.10.1 boundary
- <https://www.apple.com/newsroom/2014/06/02Apple-Announces-OS-X-Yosemite/> — June 2 announcement, same-day developer preview, later customer-beta plan, and launch-season feature context
- <https://www.apple.com/newsroom/2014/10/16OS-X-Yosemite-Available-Today-as-a-Free-Upgrade/> — October 16 public availability, confirmed launch features, compatibility, and qualifications
- <https://support.apple.com/en-us/103394> — version-specific Yosemite 10.10 security content

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses the explicitly labeled version and release line, not the page's current revision timestamp.

## Known gaps

1. OS X Yosemite 10.10.1 is an Apple-documented 2014 release absent from the scoped local catalog. It remains out of scope until an inventory expansion creates a durable version and event record.
2. The seed's June 2 `Beta 1` label is broader than Apple's precise `developer preview` wording. The date is supported, but this batch does not alter the seed or attach beta-specific release notes.
3. The customer OS X Beta Program announced for later in summer 2014 has no separate local event route and is not created here.
4. Preview-only details that Apple did not repeat in its October public-launch material are not structured as confirmed public deltas.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. The security advisory is a retained document that can receive later editorial revisions. These summaries describe Apple's currently published record for 10.10, not proof that every line appeared in its present wording on launch day.
7. Feature availability remains subject to Apple's original hardware, operating-system, service, carrier, and network qualifications.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 22 globally consistent change keys, 4 sources, and 60 citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, 4 of 4 declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 25 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Creates: 3 source documents and 22 change documents; zero version, event, or build creates. The plan included the existing Yosemite version patch, the existing durable public-event patch, and one source metadata patch.
- Mutation payload: 61,912 bytes, reported as 1.6% of the guarded limit.
- Applied production plan SHA: `00daa7a4f0383830ba911953a9441c3980f255814b9620331f544d5e486aa49c`.
- Production transaction `eOgq1Ovu5XNUv1qNFUdZPj` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `cf0ea24a942d8aebcd45274f9720759235178292a145aa043c17d6dd415066f0`.
- Post-apply zero-residual plan SHA: `11359cc4b14e0393c1295e6886c24c0bb003e5cc5a91ba7262c3d93e44189fb5`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.10`.
