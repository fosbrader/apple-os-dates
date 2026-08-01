# Apple 2024-era non-iPhone research batch

## Result

`apple-other-2024.json` is a local-only, source-backed launch-content bundle for every macOS 15.x, watchOS 11.x, tvOS 18.x, and visionOS 2.x release-version document currently present in the audited local dataset.

The batch contains original synthesis rather than copied release-note prose. Every factual article paragraph and every change occurrence has at least one inline citation to an explicit source record.

## Exact coverage

| Platform family |           Local release versions covered | Public appearances covered | Event changes |
| --------------- | ---------------------------------------: | -------------------------: | ------------: |
| macOS 15.x      | 15.0, 15.1, 15.2, 15.3, 15.4, 15.5, 15.6 |                          7 |            42 |
| watchOS 11.x    |                                     11.0 |                          1 |             6 |
| tvOS 18.x       |                               18.0, 18.1 |                          2 |            11 |
| visionOS 2.x    |                            2.0, 2.1, 2.2 |                          3 |            17 |
| **Total**       |                  **13 version articles** |  **13 public appearances** |        **76** |

The local timeline includes later point releases in the real Apple product families, but they are not release-version documents in the audited seed scope for this batch. This file does not invent absent release versions.

Each public appearance uses the durable pair:

```json
{
  "releaseVersionId": "version-…",
  "routeAlias": "public"
}
```

No positional milestone key, `mN` identifier, or array offset is used.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 76 occurrences are `documented` and `confirmed`.
- Major-release occurrences and point-release occurrences use `delta` inheritance because every item is explicitly assigned to that public release by Apple.
- Cumulative Apple pages were used only for the version section they explicitly label. No beta-specific change was inferred from a cumulative page.
- Security claims summarize affected areas and remediation classes. They do not reproduce advisory prose or imply exploitation when Apple did not say so.
- Hardware, language, subscription, and regional qualifications are preserved where they materially limit a claim.
- The batch contains no publisher prose copied as an article and no third-party logos, marks, screenshots, or protected artwork.

## Source ledger

All 24 canonical URLs below were verified as live Apple pages or indexed Apple Developer documentation on 2026-07-29.

### macOS

- <https://support.apple.com/en-us/120283> — consumer release notes for macOS Sequoia 15
- <https://support.apple.com/en-us/121011> — enterprise release notes for macOS Sequoia
- <https://developer.apple.com/documentation/macos-release-notes/macos-15-release-notes>
- <https://developer.apple.com/documentation/macos-release-notes/macos-15_1-release-notes>
- <https://developer.apple.com/documentation/macos-release-notes/macos-15_2-release-notes>
- <https://developer.apple.com/documentation/macos-release-notes/macos-15_3-release-notes>
- <https://developer.apple.com/documentation/macos-release-notes/macos-15_4-release-notes>
- <https://developer.apple.com/documentation/macos-release-notes/macos-15_5-release-notes>
- <https://developer.apple.com/documentation/macos-release-notes/macos-15_6-release-notes>

### watchOS

- <https://support.apple.com/en-us/121163> — watchOS 11 update notes
- <https://www.apple.com/newsroom/2024/09/watchos-11-is-available-today/> — dated availability announcement
- <https://developer.apple.com/documentation/watchos-release-notes/watchos-11-release-notes>

### tvOS

- <https://support.apple.com/en-us/106336> — Apple TV software-update notes
- <https://www.apple.com/newsroom/2024/09/tvos-18-is-now-available/> — dated availability announcement
- <https://developer.apple.com/documentation/tvos-release-notes/tvos-18-release-notes>
- <https://developer.apple.com/documentation/tvos-release-notes/tvos-18_1-release-notes>
- <https://support.apple.com/en-us/121569> — tvOS 18.1 security content

### visionOS

- <https://support.apple.com/en-us/121164> — visionOS 2 update notes
- <https://www.apple.com/newsroom/2024/09/visionos-2-for-apple-vision-pro-is-available-today/> — dated availability announcement
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-2-release-notes>
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-2_1-release-notes>
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-2_2-release-notes>
- <https://support.apple.com/en-us/121566> — visionOS 2.1 security content
- <https://support.apple.com/en-us/121845> — visionOS 2.2 security content

Apple Support pages are living documents and can show a later “Published Date” after Apple revises them. The event assignments in this bundle are anchored to the explicitly labeled version sections, not the page-level revision date.

## Validation performed

- JSON parse: passed.
- Launch-content bundle assertion: passed.
- Source ledger check: all 157 citation and release-note URL references resolve to one of the 24 declared source records.
- Release-version identity check: all 13 IDs occur in the successful local migration-plan artifact.
- Event-target check: all 13 event targets use `routeAlias: "public"`.
- Change-key uniqueness check: passed for all 76 keys.
- Root editorial review: passed for all 13 overview articles, 13 public-event
  summaries, 76 structured changes, platform scope, and source locators.
- Final read-only Sanity dry run: passed against `lh3yswzu/production`.
  - 99 creates: 23 sources and 76 release changes
  - 27 revision-guarded patches: 13 public events, 13 release versions, and one existing source
  - 2,069 unchanged documents
  - 171,797-byte mutation payload, 4.4% of the guarded limit
  - Plan SHA: `5974cad3c4162da4173d31bc7f7d46911c7ad12343fcd83230ba47fe83ff6d3b`
- Production apply: revision-guarded and zero-residual verified in transaction
  `eOgq1Ovu5XNUv1qNFUUzGB`.
- Builds: intentionally empty; this research pass did not have a complete first-party build-number source set for every covered public appearance.

## Known gaps and uncertainty

1. **No undocumented-change claims are included.** The Apple-first record is rich enough for a documented launch set, but this pass did not identify a distinct public-release fact with sufficiently strong independent sourcing to label `undocumented` or `partiallyDocumented`. Adding such claims should require at least two independent sources or a reproducible verification method.
2. **No beta-event articles are included.** The scope covers every local version article and each public-release appearance. Beta milestones remain timeline records only, and no cumulative release note was projected backward onto a beta.
3. **No build records are included.** Build ingestion should wait for a complete, version-specific source ledger rather than mixing remembered or secondary build numbers into an otherwise first-party batch.
4. **tvOS 18.1 and visionOS 2.1 are maintenance-heavy.** Their articles intentionally distinguish Apple's general maintenance description from the smaller set of concrete developer and security fixes Apple published.
5. **Source pages may continue to change.** The batch records `accessedAt: 2026-07-29`; later editorial passes should re-check mutable Apple Support pages before materially revising a claim.

There are no uncertain event mappings in this batch: every event is selected by release-version document ID plus the stable `public` route alias.
