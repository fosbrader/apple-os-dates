# Apple 2022 non-iPhone research batch

## Result

`apple-other-2022.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2022. It contains original synthesis with claim-level citations and does not copy publisher prose.

## Exact local coverage

| Platform family | Existing versions covered          | Public appearances | Structured changes |
| --------------- | ---------------------------------- | -----------------: | -----------------: |
| macOS           | 13.0                               |                  1 |                  9 |
| watchOS         | 8.4, 8.5, 8.6, 8.7, 9.0, 9.1       |                  6 |                 28 |
| tvOS            | 15.3, 15.4, 15.5, 15.6, 16.0, 16.1 |                  6 |                 21 |
| **Total**       | **13 version articles**            |             **13** |             **58** |

The 13 versions contain 94 existing local timeline milestones: 13 public appearances and 81 beta, release-candidate, and related non-public milestones. This bundle enriches only the 13 public appearances, selected through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 26 version/event records are `editoriallyVerified` and carry the
  recorded approval timestamp `2026-07-30T04:16:06Z`.
- All public events are indexable after editorial approval.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included because this bounded first-party pass did not establish one with durable evidence.
- No beta notes or cumulative later-release claims are projected backward onto public releases.
- No build records are included; a complete first-party build ledger was outside this cohort.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple names are used nominatively; the bundle contains no Apple artwork, logos, screenshots, or copied release-note body text.

## Source ledger

All 20 declared sources are human-readable first-party Apple pages checked on 2026-07-29.

### macOS

- <https://www.apple.com/newsroom/2022/10/macos-ventura-is-now-available/> — dated public availability and launch features
- <https://developer.apple.com/documentation/macos-release-notes/macos-13-release-notes> — version-specific developer notes and Accessory Security
- <https://support.apple.com/en-us/101570> — Ventura 13.0 enterprise and device-management changes
- <https://support.apple.com/en-us/102853> — Ventura 13 security content and release date

### watchOS

- <https://support.apple.com/en-us/118389> — watchOS 8 consumer update notes
- <https://support.apple.com/en-us/117792> — watchOS 9 consumer update notes
- <https://www.apple.com/newsroom/2022/09/watchOS-9-is-available-today/> — dated watchOS 9 public-availability announcement
- <https://support.apple.com/en-us/103177>
- <https://support.apple.com/en-us/102762>
- <https://support.apple.com/en-us/102759>
- <https://support.apple.com/en-us/102879>
- <https://support.apple.com/en-us/102824>
- <https://support.apple.com/en-us/102740>

### tvOS

- <https://support.apple.com/en-us/106336> — Apple TV software-update notes
- <https://support.apple.com/en-us/103175>
- <https://support.apple.com/en-us/102886>
- <https://support.apple.com/en-us/102877>
- <https://support.apple.com/en-us/102878>
- <https://support.apple.com/en-us/102834>
- <https://support.apple.com/en-us/102835>

Apple Support pages are living documents and may show page-level revision dates later than the historical release. Mapping uses the explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's consumer notes for watchOS 8.7 and tvOS 15.3, 15.5, and 15.6 do not enumerate named feature changes. Those records say so directly and use the version-specific security advisory for substantive detail.
2. No community-sourced undocumented change met the evidence bar during this first-party cohort. Such claims should be added later only with reproducible verification or multiple independent durable sources.
3. The local dataset has no macOS 13.1 version document even though that release occurred in 2022. Per scope, this batch does not create missing version records.
4. The 81 non-public milestones remain timeline-only records until beta-specific sources can support event-level claims.
5. Security advisories can receive later-added entries. The summaries describe Apple's current documented record for each release, not proof that every advisory entry appeared on launch day.

## Validation

- JSON parse and launch-content bundle assertion: passed.
- Repository-wide research-batch validation: passed.
- Exact inventory reconciliation: passed for 13 existing version IDs, 13 public appearances, and 94 local milestones.
- Source-ledger closure: all 228 citation references resolve to the 20 declared sources, and all 20 sources are used.
- Editorial-state check: all 26 version/event records are
  `editoriallyVerified` plus `approved`; all 13 events are indexable.
- Change check: all 58 keys are unique, and every occurrence is cited, documented, confirmed, and a public-release delta.
- Generator lint and whitespace checks: passed.
- Guarded production Sanity apply against `lh3yswzu/production`: passed.
  - 77 creates: 19 sources and 58 release changes
  - 27 revision-guarded patches: 13 existing public events, 13 release
    versions, and metadata on one reused source
  - 0 event creates, 0 build creates, and 2,069 unchanged documents
  - 190,258-byte mutation payload, 4.9% of the guarded limit
  - Exact applied plan SHA:
    `cc683141dd679ea68d2d15354aedef22d320baa5a7b6fab13fc310692ff957fa`
  - Transaction: `tt1fSB5HY9GAB0YLyxmSdQ`
  - The ingestion pipeline committed the transaction and verified zero
    residual mutations.
