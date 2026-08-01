# Apple 2021 non-iPhone research batch

## Result

`apple-other-2021.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2021. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered                | Public appearances | Structured changes |
| --------------- | ---------------------------------------- | -----------------: | -----------------: |
| macOS           | 12.0                                     |                  1 |                 10 |
| watchOS         | 7.3, 7.4, 7.5, 7.6, 8.0, 8.1, 8.3        |                  7 |                 40 |
| tvOS            | 14.4, 14.5, 14.6, 14.7, 15.0, 15.1, 15.2 |                  7 |                 30 |
| **Total**       | **15 version articles**                  |             **15** |             **80** |

The 15 versions contain 104 existing local timeline milestones: 15 public appearances and 89 beta, release-candidate, and related non-public milestones. This bundle enriches only the 15 public appearances through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 30 version/event records are `editoriallyVerified` plus `approved`
  after review at `2026-07-30T04:31:06Z`.
- All public events are indexable.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory boundary

The existing local `version-macos-12-0` route represents the October 25, 2021 Monterey launch. Apple publicly shipped and documents that release as macOS Monterey 12.0.1. This bundle preserves the audited local route and explicitly cites Apple's 12.0.1 release notes and advisory; it does not create or rename a release-version record.

## Source ledger

All 22 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

### macOS

- <https://www.apple.com/newsroom/2021/10/macos-monterey-is-now-available/> — dated Monterey availability and launch features
- <https://developer.apple.com/documentation/macos-release-notes/macos-12_0_1-release-notes> — macOS Monterey 12.0.1 developer notes
- <https://support.apple.com/en-us/103271> — Monterey 12.0.1 enterprise changes
- <https://support.apple.com/en-us/103236> — Monterey 12.0.1 security content and release date

### watchOS

- <https://support.apple.com/en-us/118391> — watchOS 7 update notes
- <https://support.apple.com/en-us/118389> — watchOS 8 update notes
- <https://www.apple.com/newsroom/2021/09/watchos-8-is-available-today/> — dated watchOS 8 launch article
- <https://support.apple.com/en-us/103054>
- <https://support.apple.com/en-us/119598>
- <https://support.apple.com/en-us/103135>
- <https://support.apple.com/en-us/102763>
- <https://support.apple.com/en-us/103156>
- <https://support.apple.com/en-us/103165>
- <https://support.apple.com/en-us/102761>

### tvOS

- <https://support.apple.com/en-us/106336> — Apple TV software-update notes
- <https://support.apple.com/en-us/103055>
- <https://support.apple.com/en-us/103064>
- <https://support.apple.com/en-us/103134>
- <https://support.apple.com/en-us/102884>
- <https://support.apple.com/en-us/103153>
- <https://support.apple.com/en-us/103167>
- <https://support.apple.com/en-us/102885>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses the explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's consumer notes for tvOS 14.4, 14.6, and 14.7 do not enumerate named feature changes. Those entries state the limitation and use the version-specific security advisory for substantive detail.
2. The local macOS route/version-label mismatch is preserved rather than silently rewritten.
3. No community-sourced undocumented claim was added; this bounded cohort requires a separate reproducible or independently corroborated evidence pass.
4. The 89 non-public milestones remain timeline-only records until beta-specific sources support event-level claims.
5. Security advisories can receive later-added entries. Summaries describe Apple's current documented record for the release, not proof that every advisory entry appeared on launch day.

## Validation

- Research-batch validation passed with 15 versions, 15 public events, 80 globally consistent change keys, 22 sources, and 279 citation references for this file.
- Inventory closure passed: 15 eligible local versions, 104 milestones, 15 public appearances, 89 non-public milestones, 22 of 22 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 16 of 16.
- ESLint passed for the deterministic generator.
- Guarded production apply: 100 creates, 30 revision-guarded patches, and 2,069 unchanged documents.
- Planned creates: 20 source documents, zero event documents, zero build documents, and 80 change documents; the plan includes 15 version patches. Existing durable public events are updated through the revision-guarded patch set.
- Mutation payload: 238,050 bytes, reported as 6.1% of the guarded limit.
- Exact applied plan SHA:
  `8193ac155ca47c8cb1ef061a4f4ff69ae4ca38f44f051fcd9271b78b8ba9a675`.
- Transaction: `eOgq1Ovu5XNUv1qNFUYgGt`.
- The ingestion pipeline committed the transaction and verified zero residual
  mutations.
