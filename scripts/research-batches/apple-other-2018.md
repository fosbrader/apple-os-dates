# Apple 2018 non-iPhone research batch

## Result

`apple-other-2018.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2018. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.14 | 1 | 14 |
| watchOS | 4.2.2, 4.3, 4.3.1, 5.0, 5.1, 5.1.2 | 6 | 31 |
| tvOS | 11.2.5, 11.3, 11.4, 12.0, 12.1, 12.1.1 | 6 | 18 |
| **Total** | **13 version articles** | **13** | **63** |

The 13 versions contain 96 existing local timeline milestones: 13 public appearances and 83 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 13 durable public routes through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 26 version/event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:03:57Z.
- All public events are indexable after editorial approval.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. All 13 local public dates match the explicitly dated release line in Apple's corresponding security advisory.
2. Apple's current watchOS 5 consumer history has no 5.1 section, moving from 5.0.1 to 5.1.1, while Apple's dedicated watchOS 5.1 security advisory confirms an October 30, 2018 release. The local 5.1 route is retained with security-only structured content and an explicit evidence boundary.
3. The existing-record-only catalog omits Apple-documented 2018 point releases: macOS 10.14.1 and 10.14.2; watchOS 4.2.3, 4.3.2, 5.0.1, and 5.1.1; and tvOS 11.2.6, 11.4.1, and 12.0.1. This batch does not create those missing releaseVersion records.

## Source ledger

All 20 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

### macOS

- <https://www.apple.com/newsroom/2018/09/macos-mojave-is-available-today/> — dated Mojave public availability and launch features
- <https://developer.apple.com/documentation/macos-release-notes/macos-mojave-10_14-release-notes> — Mojave 10.14 developer changes, deprecations, known issues, and the explicit Group FaceTime deferral
- <https://support.apple.com/en-us/103758> — detailed Mojave 10.14 security content and release date

### watchOS

- <https://support.apple.com/en-us/111739> — watchOS 4 consumer update notes
- <https://support.apple.com/en-us/118393> — watchOS 5 consumer update notes, including the retained-history gap around 5.1
- <https://www.apple.com/newsroom/2018/06/watchos-5-adds-powerful-activity-and-communications-features-to-apple-watch/> — first-party watchOS 5 feature and compatibility framing
- <https://www.apple.com/newsroom/2018/12/ecg-app-and-irregular-heart-rhythm-notification-available-today-on-apple-watch/> — dated ECG and irregular-rhythm feature availability
- <https://support.apple.com/en-us/103686>
- <https://support.apple.com/en-us/103079>
- <https://support.apple.com/en-us/103084>
- <https://support.apple.com/en-us/103696>
- <https://support.apple.com/en-us/103812>
- <https://support.apple.com/en-us/103705>

### tvOS

- <https://support.apple.com/en-us/106336> — Apple TV software-update notes
- <https://support.apple.com/en-us/103684>
- <https://support.apple.com/en-us/103081>
- <https://support.apple.com/en-us/103083>
- <https://support.apple.com/en-us/103569>
- <https://support.apple.com/en-us/103561>
- <https://support.apple.com/en-us/103570>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section and advisory release line.

## Known gaps

1. The nine Apple-documented 2018 point releases absent from the local catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. Apple's current consumer history gives no retained feature or ordinary-maintenance narrative for watchOS 5.1. The dedicated advisory confirms the release and security changes but does not explain the consumer-page omission; this batch does not infer a reason.
3. Apple's consumer notes enumerate no specific ordinary change for watchOS 4.2.2 or tvOS 11.2.5, 12.1, and 12.1.1 beyond broad maintenance descriptions.
4. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
5. The 83 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
6. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for the release, not proof that every advisory entry appeared on launch day.
7. Apple's developer notes explicitly defer Group FaceTime beyond the initial Mojave release, so it is excluded from the 10.14 launch record.
8. ECG and irregular-rhythm claims retain Apple's hardware, regional, and regulatory qualifications and are presented as historical product capabilities, not medical guidance.

## Validation

- Research-batch validation passed with 13 versions, 13 public events, 63 globally consistent change keys, 20 sources, and 234 citation references for this file.
- Inventory closure passed: 13 eligible local versions, 96 milestones, 13 public appearances, 83 non-public milestones, 20 of 20 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON byte-for-byte.
- Reviewed production plan: 81 creates, 26 revision-guarded patches, and 2,071 unchanged documents.
- Creates: 18 source documents and 63 change documents; zero version, event, or build creates. The plan included 13 version patches and 13 existing durable public-event patches.
- Mutation payload: 195,819 bytes, reported as 5.0% of the guarded limit.
- Applied production plan SHA: `27830f41e366d996f8fa89ca6c4433c021c6c2cea5e6266273682da2c05b9f3c`.
- Production transaction `eOgq1Ovu5XNUv1qNFUbFZ1` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `52f9e9289f9e028b029ca2149a75f907d939aaf9f31ff62d7d5bfe0e3608300e`.
- Post-apply zero-residual plan SHA: `e97ea0661ba2b9e61cac367dc36c849f14c0a334c1698636f49f7bc32a0d88d7`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.14`, `/apple/watchos/5.1.2`, and `/apple/tvos/12.1.1`.
