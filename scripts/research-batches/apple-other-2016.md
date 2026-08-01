# Apple 2016 non-iPhone research batch

## Result

`apple-other-2016.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2016. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.12 | 1 | 13 |
| watchOS | 2.2, 2.2.1, 2.2.2, 3.0, 3.1, 3.1.1 | 6 | 42 |
| tvOS | 9.2, 9.2.1, 9.2.2, 10.0, 10.1 | 5 | 21 |
| **Total** | **12 version articles** | **12** | **76** |

The 12 versions contain 73 existing local timeline milestones: 12 public appearances and 61 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 12 durable public routes through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 24 version/event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:26:52Z.
- All public events are indexable after editorial approval.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included.
- No beta note or later cumulative change is projected backward.
- No build record is included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. Eleven of the 12 local public dates are confirmed by Apple's dated security index or a version-specific security advisory.
2. watchOS 3.1.1 is absent from Apple's retained 2016 security-update index, but Apple published the version's consumer notes and a December 12 Newsroom item that names watchOS 3.1.1 as the Apple Watch software carrying the new emoji. The existing December 12 local date is therefore retained, while no version-specific security claim is made.
3. Apple's current Apple TV consumer-update history begins at tvOS 11. The tvOS 9.2, 9.2.1, and 9.2.2 pages are therefore limited to release chronology and their retained version-specific security advisories.
4. Apple's retained watchOS 3.0 consumer section opens with a sentence that repeats the watchOS 2.2 pairing, Maps, and language description. The batch excludes that apparent archival mismatch and uses the detailed, version-labeled watchOS 3.0 subsections.
5. Apple's June tvOS preview associated features with the new tvOS package but separately timed YouTube search, the Apple TV Remote app, and single sign-on. Apple's October announcement also marks Siri live tune-in available on October 27. Those separately delivered items are not assigned to tvOS 10.0; single sign-on is attached to 10.1 using Apple's December-availability announcement, while live tune-in remains outside either version delta.
6. The existing-record-only catalog omits Apple-documented 2016 releases including tvOS 9.1.1 and 10.0.1, plus macOS Sierra 10.12.1 and 10.12.2. This batch does not create missing releaseVersion records.

## Source ledger

All 18 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

### Cross-platform chronology

- <https://support.apple.com/en-us/103178> — Apple's retained 2016 release-date index and the basis for identifying missing local point releases

### macOS

- <https://www.apple.com/newsroom/2016/09/macos-sierra-now-available-as-a-free-update/> — dated Sierra availability, launch features, qualifications, and hardware baseline
- <https://support.apple.com/en-us/103424> — detailed Sierra 10.12 security content and release date

### watchOS

- <https://support.apple.com/en-us/106617> — watchOS 2 consumer update notes
- <https://support.apple.com/en-us/106644> — watchOS 3 consumer update notes
- <https://www.apple.com/newsroom/2016/12/apple-adds-hundreds-of-new-and-redesigned-emoji-in-ios-102/> — dated watchOS 3.1.1 emoji availability
- <https://support.apple.com/en-us/103523>
- <https://support.apple.com/en-us/103524>
- <https://support.apple.com/en-us/103527>
- <https://support.apple.com/en-us/103800>
- <https://support.apple.com/en-us/103529>

### tvOS

- <https://www.apple.com/newsroom/2016/06/apple-tv-gets-new-siri-capabilities-and-single-sign-on/> — the new-tvOS feature package, developer APIs, timing language, and feature qualifications
- <https://www.apple.com/newsroom/2016/10/apple-unveils-new-tv-app-for-apple-tv-iphone-and-ipad.html> — December TV app and single-sign-on availability
- <https://support.apple.com/en-us/103408>
- <https://support.apple.com/en-us/103414>
- <https://support.apple.com/en-us/103418>
- <https://support.apple.com/en-us/103071>
- <https://support.apple.com/en-us/103435>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section, dated announcement, and advisory or index release line.

## Known gaps

1. The four Apple-documented 2016 point releases absent from the scoped local macOS/watchOS/tvOS catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. Apple does not retain consumer release-note pages for tvOS 9.2 through 9.2.2, so this batch does not reproduce commonly reported user-interface additions from secondary sources.
3. Apple's retained security index omits watchOS 3.1.1. The consumer history and dated Newsroom item support the release and its ordinary changes, but no dedicated advisory was found and no security change is inferred.
4. Apple's retained watchOS 3.0 introductory sentence appears to repeat 2.2 material. It is treated as an archival source defect rather than as a watchOS 3 change.
5. The tvOS 10 launch-season feature source is a preview that says features were subject to change. The batch includes only the package's clearly described fall tvOS features and excludes items with separate timing or delivery paths.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. The 61 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
8. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for the release, not proof that every advisory entry appeared on launch day.
9. Feature availability remains subject to Apple's original hardware, country, language, service, subscription, and participating-app qualifications.

## Validation

- Research-batch validation passed with 12 versions, 12 public events, 76 globally consistent change keys, 18 sources, and 229 citation references for this file.
- Inventory closure passed: 12 eligible local versions, 73 milestones, 12 public appearances, 61 non-public milestones, 18 of 18 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON byte-for-byte.
- Reviewed production plan: 91 creates, 26 revision-guarded patches, and 2,071 unchanged documents.
- Creates: 15 source documents and 76 change documents; zero version, event, or build creates. The plan included 12 version patches, 12 existing durable public-event patches, and 2 source metadata patches.
- Mutation payload: 204,206 bytes, reported as 5.2% of the guarded limit.
- Applied production plan SHA: `dc6f6d359a3c2468ebc5394776ab68ae3402282bf854a27525eb759baafa1332`.
- Production transaction `eOgq1Ovu5XNUv1qNFUcxN1` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `b9b83a9dbf3568b2067806b160d89e6889618d8fdf9292d0a73043ab3a41acc5`.
- Post-apply zero-residual plan SHA: `a20813c0f570504a9539d3cc6399f2c36cf24b160e8d574143163e57a6cf9fef`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.12`, `/apple/watchos/3.1.1`, and `/apple/tvos/10.1`.
