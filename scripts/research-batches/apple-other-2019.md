# Apple 2019 non-iPhone research batch

## Result

`apple-other-2019.json` is a source-backed launch-content bundle for every existing local macOS, watchOS, and tvOS release version whose audited public appearance falls in 2019. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform  | Version                 | Public date               | Structured changes |
| --------- | ----------------------- | ------------------------- | -----------------: |
| macOS     | 10.15                   | 2019-10-07                |                 12 |
| watchOS   | 5.1.3                   | 2019-01-22                |                  2 |
| watchOS   | 5.2                     | 2019-03-27                |                  5 |
| watchOS   | 5.2.1                   | 2019-05-13                |                  6 |
| watchOS   | 6.0                     | 2019-09-19                |                 11 |
| watchOS   | 6.1                     | 2019-10-29                |                  4 |
| watchOS   | 6.1.1                   | 2019-12-10                |                  1 |
| tvOS      | 12.1.2                  | 2019-01-22                |                  2 |
| tvOS      | 12.2                    | 2019-03-25                |                  4 |
| tvOS      | 12.3                    | 2019-05-13                |                  3 |
| tvOS      | 13.0                    | 2019-09-24                |                  8 |
| tvOS      | 13.2                    | 2019-10-28                |                  2 |
| tvOS      | 13.3                    | 2019-12-10                |                  2 |
| **Total** | **13 version articles** | **13 public appearances** |             **62** |

The 13 versions contain 88 existing local timeline milestones. This bundle enriches only their 13 public appearances through `releaseVersionId` plus `routeAlias: "public"`; beta and release-candidate appearances remain timeline-only.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Current state: editorially verified and approved at `2026-07-30T04:43:47Z`.
- Every structured occurrence is `documented`, `confirmed`, and scoped to the public-release delta.
- Generic Apple descriptions such as performance and stability work remain generic; no missing detail is invented.
- Health and service availability constraints remain explicit.
- Security entries summarize component and impact classes without reproducing advisory prose.
- No undocumented-change claim or build record is included.

## Source ledger

All 18 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

- <https://www.apple.com/newsroom/2019/10/macos-catalina-is-available-today/> — macOS Catalina is available today
- <https://developer.apple.com/documentation/macos-release-notes/macos-catalina-10_15-release-notes> — macOS Catalina 10.15 Release Notes
- <https://support.apple.com/en-us/103107> — About the security content of macOS Catalina 10.15
- <https://support.apple.com/en-us/118393> — About watchOS 5 Updates
- <https://support.apple.com/en-us/103093> — About the security content of watchOS 5.1.3
- <https://support.apple.com/en-us/103664> — About the security content of watchOS 5.2
- <https://support.apple.com/en-us/103019> — About the security content of watchOS 5.2.1
- <https://support.apple.com/en-us/118388> — About watchOS 6 Updates
- <https://support.apple.com/en-us/103210> — About the security content of watchOS 6
- <https://support.apple.com/en-us/103826> — About the security content of watchOS 6.1
- <https://support.apple.com/en-us/103212> — About the security content of watchOS 6.1.1
- <https://support.apple.com/en-us/106336> — About Apple TV 4K and Apple TV HD software updates
- <https://support.apple.com/en-us/103092> — About the security content of tvOS 12.1.2
- <https://support.apple.com/en-us/103566> — About the security content of tvOS 12.2
- <https://support.apple.com/en-us/103768> — About the security content of tvOS 12.3
- <https://support.apple.com/en-us/103022> — About the security content of tvOS 13
- <https://support.apple.com/en-us/103772> — About the security content of tvOS 13.2
- <https://support.apple.com/en-us/103213> — About the security content of tvOS 13.3

Apple Support pages are living documents and may display revision dates later than the historical release. Mapping uses each explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's public notes for watchOS 5.1.3 and tvOS 12.1.2, 13.2, and 13.3 provide no itemized consumer fix list; those records stay honest about that limitation.
2. No community-sourced undocumented claim was added. Such claims require a separate reproducible or independently corroborated evidence pass.
3. The 75 non-public milestones remain timeline-only until beta-specific sources support event-level claims.
4. Security advisories can receive later-added entries. Summaries describe Apple's current version-labeled record, not proof that every advisory entry appeared on launch day.

## Validation

- Deterministic generator: `build-apple-other-2019.mjs`.
- Expected inventory: 13 versions, 13 public events, 62 structured changes, 18 first-party sources, zero builds.
- Guarded production apply: 79 creates, 26 revision-guarded patches, and 2,070 unchanged documents.
- Planned creates: 17 source documents, zero version documents, zero event documents, zero build documents, and 62 change documents; 13 existing release versions and their durable public events were patched.
- Mutation payload: 189,605 bytes, reported as 4.9% of the guarded limit.
- Exact applied plan SHA: `2dfe1522522798facc0a4eb65eaee52601a54ea8985998b44c59cbc2dd34a667`.
- Transaction: `F0eE6eK5XyVXtlnaoxv9Zp`.
- The ingestion pipeline committed the transaction and verified zero residual mutations.
