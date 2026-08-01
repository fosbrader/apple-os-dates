# Apple 2020 non-iPhone research batch

## Result

`apple-other-2020.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2020. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered              | Public appearances | Structured changes |
| --------------- | -------------------------------------- | -----------------: | -----------------: |
| macOS           | 11.0                                   |                  1 |                 12 |
| watchOS         | 6.1.2, 6.2, 7.0, 7.1, 7.2              |                  5 |                 32 |
| tvOS            | 13.3.1, 13.4, 13.4.5, 14.0, 14.2, 14.3 |                  6 |                 21 |
| **Total**       | **12 version articles**                |             **12** |             **65** |

The 12 versions contain 80 existing local timeline milestones: 12 public appearances and 68 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 12 durable public routes through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 24 version/event records are `editoriallyVerified` plus `approved` as of 2026-07-30T04:46:40Z.
- All public events are indexable after completed editorial review.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The existing local `version-macos-11-0` route represents the November 12, 2020 Big Sur launch. Apple shipped and documents that public release as macOS Big Sur 11.0.1. The route is preserved and the label mismatch is disclosed.
2. The existing local `version-tvos-13-4-5` public milestone is dated May 20, 2020. Apple's cumulative update page confirms the version without a date, while its security advisory says tvOS 13.4.5 was released May 26. This bundle preserves the local event target, records the six-day conflict, and does not decide a replacement date.

## Source ledger

All 18 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

### macOS

- <https://www.apple.com/newsroom/2020/11/macos-big-sur-is-here/> — dated Big Sur public availability and launch features
- <https://developer.apple.com/documentation/macos-release-notes/macos-big-sur-11_0_1-release-notes> — macOS Big Sur 11.0.1 developer release notes
- <https://support.apple.com/en-us/102846> — detailed Big Sur 11.0.1 security content and release date

### watchOS

- <https://support.apple.com/en-us/118388> — watchOS 6 consumer update notes
- <https://support.apple.com/en-us/118391> — watchOS 7 consumer update notes
- <https://www.apple.com/newsroom/2020/09/apple-watch-series-6-delivers-breakthrough-wellness-and-fitness-capabilities/> — first-party September 16 watchOS 7 availability statement
- <https://support.apple.com/en-us/103220>
- <https://support.apple.com/en-us/103829>
- <https://support.apple.com/en-us/103118>
- <https://support.apple.com/en-us/103039>
- <https://support.apple.com/en-us/102760>

### tvOS

- <https://support.apple.com/en-us/106336> — Apple TV software-update notes
- <https://support.apple.com/en-us/103219>
- <https://support.apple.com/en-us/103827>
- <https://support.apple.com/en-us/102845>
- <https://support.apple.com/en-us/103117>
- <https://support.apple.com/en-us/103040>
- <https://support.apple.com/en-us/102881>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses the explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's consumer notes for tvOS 13.3.1, 13.4, and 13.4.5 enumerate no named feature or ordinary fix beyond general performance and stability work. Their entries retain that limitation and use version-specific security advisories for technical detail.
2. The two label/date discrepancies above remain explicit review issues rather than silent data mutations.
3. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
4. The 68 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
5. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for the release, not proof that every advisory entry appeared on launch day.
6. Apple's Big Sur launch story said App Store privacy summaries were coming later in 2020, so this batch does not attribute that later rollout to the November 12 launch.
7. Apple's tvOS 14.2 note described Fitness+ as coming later in 2020; Fitness+ is therefore assigned to tvOS 14.3, where Apple's update history documents it.

## Validation

- Research-batch validation passed with 12 versions, 12 public events, 65 globally consistent change keys, 18 sources, and 220 citation references for this file.
- Inventory closure passed: 12 eligible local versions, 80 milestones, 12 public appearances, 68 non-public milestones, 18 of 18 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint passed for the deterministic generator.
- Reviewed production plan: 80 creates, 24 revision-guarded patches, and 2,073 unchanged documents.
- Planned creates: 15 source documents, zero version documents, zero event documents, zero build documents, and 65 change documents; the plan includes 12 version patches. Existing durable public events are updated through the revision-guarded patch set.
- Mutation payload: 194,055 bytes, reported as 5.0% of the guarded limit.
- Applied production plan SHA: `e69686be4478db801c88447d9ece510a9b7ca3b46a7df3ac928d3421fe2bcc71`.
- Guarded production transaction: `tt1fSB5HY9GAB0YLyxrMCb`.
- A post-apply read-only dry-run reported zero residual mutations.
