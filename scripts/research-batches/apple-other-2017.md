# Apple 2017 non-iPhone research batch

## Result

`apple-other-2017.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in calendar 2017. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.13 | 1 | 14 |
| watchOS | 3.1.3, 3.2, 3.2.2, 3.2.3, 4.0, 4.1, 4.2 | 7 | 43 |
| tvOS | 10.2, 10.2.1, 10.2.2, 11.0, 11.1, 11.2 | 6 | 32 |
| **Total** | **14 version articles** | **14** | **89** |

The 14 versions contain 96 existing local timeline milestones: 14 public appearances and 82 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 14 durable public routes through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 28 version/event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:22:32Z.
- All public events are indexable after editorial approval.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The 14 local public dates match Apple's version-specific advisory and security-index dates.
2. Apple's current Apple TV consumer history begins at tvOS 11. The local tvOS 10.2, 10.2.1, and 10.2.2 routes therefore contain security-advisory detail without inferred features, stability changes, or ordinary fixes.
3. Apple's watchOS 3 consumer history describes 3.1.3, 3.2.2, and 3.2.3 only as improvements-and-bug-fixes updates. Those broad maintenance entries are kept generic; specific technical claims come from the matching advisories.
4. Apple's High Sierra 10.13 security page now notes that new downloads can include the later Supplemental Update. This batch excludes the October 5 Supplemental Update from the September 25 launch delta.
5. Apple's watchOS 4 preview discussed GymKit and person-to-person payments before launch, but the final version history assigns them to 4.1 and 4.2 respectively. They are not projected backward into 4.0.
6. Apple TV 4K hardware became available September 22, three days after tvOS 11's September 19 public date. The 4K and HDR entry retains its Apple TV 4K hardware qualification.
7. The existing-record-only catalog omits Apple-documented 2017 version identities: macOS 10.13.1 and 10.13.2; watchOS 4.0.1; and tvOS 10.1.1 and 11.2.1. The High Sierra Supplemental Update and Security Update 2017-001 are separately named update packages rather than new semantic-version identities. This batch creates none of them.

## Source ledger

All 21 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

### Cross-platform chronology

- <https://support.apple.com/en-us/103178> — Apple's dated 2016–2017 security-release index, including the eligible routes and locally absent point releases

### macOS

- <https://www.apple.com/newsroom/2017/09/macos-high-sierra-now-available-as-a-free-update/> — dated High Sierra availability, compatibility, launch features, and hardware qualifications
- <https://support.apple.com/en-us/103806> — detailed High Sierra 10.13 security content and release date

### watchOS

- <https://support.apple.com/en-us/106644> — watchOS 3 consumer update notes
- <https://support.apple.com/en-us/111739> — watchOS 4 consumer update notes and final version boundaries
- <https://www.apple.com/newsroom/2017/06/watchos-4-brings-more-intelligence-and-fitness-features-to-apple-watch/> — first-party watchOS 4 preview and feature context
- <https://support.apple.com/en-us/103531>
- <https://support.apple.com/en-us/103532>
- <https://support.apple.com/en-us/103534>
- <https://support.apple.com/en-us/103535>
- <https://support.apple.com/en-us/103678>
- <https://support.apple.com/en-us/103540>
- <https://support.apple.com/en-us/103682>

### tvOS

- <https://support.apple.com/en-us/106336> — retained Apple TV software-update notes beginning at tvOS 11
- <https://www.apple.com/newsroom/2017/09/apple-tv-4k-brings-home-the-magic-of-cinema-with-4k-and-hdr/> — Apple TV 4K feature, qualification, and hardware-availability context
- <https://support.apple.com/en-us/103074>
- <https://support.apple.com/en-us/103451>
- <https://support.apple.com/en-us/103457>
- <https://support.apple.com/en-us/103568>
- <https://support.apple.com/en-us/103467>
- <https://support.apple.com/en-us/103683>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section and advisory release line.

## Known gaps

1. The five Apple-documented 2017 point-version identities absent from the local catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. No surviving version-labeled consumer narrative was found on Apple's current site for tvOS 10.2, 10.2.1, or 10.2.2; their pages intentionally remain security-specific.
3. Apple's broad ordinary-maintenance statements do not identify individual fixes for watchOS 3.1.3, 3.2.2, or 3.2.3 and therefore are not expanded.
4. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
5. The 82 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
6. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for a release, not proof that every advisory entry appeared on launch day.
7. Later High Sierra supplemental, security, and point-release changes are not projected backward to the initial 10.13 event.
8. Regional, hardware, subscription, and service qualifications remain attached to Apple Pay Cash, music streaming, fitness, 4K/HDR, Apple TV app, sports, and playback-matching claims.

## Validation

- Research-batch validation passed with 14 versions, 14 public events, 89 globally consistent change keys, 21 sources, and 317 citation references for this file.
- Inventory closure passed: 14 eligible local versions, 96 milestones, 14 public appearances, 82 non-public milestones, 21 of 21 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 19 of 19.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON byte-for-byte.
- Reviewed production plan: 107 creates, 29 revision-guarded patches, and 2,070 unchanged documents.
- Creates: 18 source documents and 89 change documents; zero version, event, or build creates. The plan included 14 version patches and 14 existing durable public-event patches.
- Mutation payload: 253,779 bytes, reported as 6.5% of the guarded limit.
- Applied production plan SHA: `e6421d989983e1ef94925f607d12f16d1180f7ee9fd0d337fb416143c505ffbd`.
- Production transaction `F0eE6eK5XyVXtlnaoxwzIe` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `85cb297ffa07694fd4163ccd892759bad9efb0634022afd5f34b63e6703ccd19`.
- Post-apply zero-residual plan SHA: `4a3a319cf5a40b5671b042c16ef7816e00ec147f27548e971fec786989e9de25`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.13`, `/apple/watchos/4.2`, and `/apple/tvos/11.2`.
