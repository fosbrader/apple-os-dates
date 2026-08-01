# Apple 2023-era non-iPhone research batch

## Result

`apple-other-2023.json` is the reviewed, production-applied source-backed content bundle for every macOS 14.x, watchOS 10.x, tvOS 17.x, and visionOS 1.x release-version document in the audited local dataset.

The bundle contains original synthesis, not copied release-note prose. Every factual article paragraph and every change occurrence has at least one claim-level citation to a declared source.

## Exact local coverage

| Platform family | Local release versions covered | Public appearances covered | Event changes |
| --- | --- | ---: | ---: |
| macOS 14.x | 14.0 | 1 | 6 |
| watchOS 10.x | 10.0 | 1 | 6 |
| tvOS 17.x | 17.0 | 1 | 6 |
| visionOS 1.x | 1.0, 1.1, 1.2, 1.3 | 4 | 25 |
| **Total** | **7 version articles** | **7** | **43** |

The exact local public dates are:

| Version document | Public date | Local milestones |
| --- | --- | ---: |
| `version-macos-14-0` | 2023-09-26 | 10 |
| `version-watchos-10-0` | 2023-09-18 | 10 |
| `version-tvos-17-0` | 2023-09-18 | 11 |
| `version-visionos-1-0` | 2024-02-02 | 8 |
| `version-visionos-1-1` | 2024-03-07 | 6 |
| `version-visionos-1-2` | 2024-06-10 | 6 |
| `version-visionos-1-3` | 2024-07-29 | 5 |

The seven versions contain 56 local timeline milestones in total. This bundle enriches the seven public appearances only; the other 49 beta, release-candidate, revision, and related timeline milestones remain timeline records without release-note claims.

Each public appearance is selected through the durable pair:

```json
{
  "releaseVersionId": "version-…",
  "routeAlias": "public"
}
```

No array position, `mN` key, or mutable display label is used as event identity.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Every version and event passed final editorial review and is `editoriallyVerified` plus `approved`, with the review recorded at `2026-07-30T03:57:58Z`.
- All seven public articles became indexable as part of that explicit approval.
- All 43 occurrences are `documented`, `confirmed`, and `delta` changes assigned to the public release by Apple.
- Cumulative Apple Support pages are cited only at an explicitly labeled version section.
- No cumulative release-note claim is projected backward onto a beta.
- Apple marked NameDrop, additional Smart Stack media suggestions, and Fitness+ Audio Focus for later watchOS 10 updates; they are excluded from the watchOS 10.0 occurrence set.
- Apple marked Webex and Zoom television apps for later in 2023; they are excluded from the tvOS 17.0 occurrence set.
- visionOS 1.2 is described as adding language and regional readiness for later international hardware availability. The bundle does not imply that all of those market launches occurred on June 10.
- visionOS 1.3 has no invented consumer or SDK feature list. Its occurrence set stays within Apple's version-specific security advisory because Apple says there were no new developer release notes for that update.
- Security entries summarize affected surfaces and remediation classes. They do not reproduce advisory prose or imply exploitation where Apple did not make that statement.
- Apple product and platform names are used nominatively to identify the historical releases. No Apple artwork, screenshots, logos, or protected release-note body copy is included.

## Source ledger

All 20 human-readable URLs below were verified as live Apple pages or indexed Apple Developer documentation on 2026-07-29.

### macOS

- <https://support.apple.com/en-us/109035> — consumer release notes for macOS Sonoma 14
- <https://www.apple.com/newsroom/2023/09/macos-sonoma-is-available-today/> — dated public-availability announcement
- <https://developer.apple.com/documentation/macos-release-notes/macos-14-release-notes> — macOS Sonoma 14 developer release notes
- <https://support.apple.com/en-us/109030> — enterprise release notes for macOS Sonoma

### watchOS

- <https://support.apple.com/en-us/119065> — watchOS 10 update notes
- <https://www.apple.com/newsroom/2023/09/watchos-10-is-available-today/> — dated public-availability announcement
- <https://developer.apple.com/documentation/watchos-release-notes/watchos-10-release-notes> — watchOS 10 developer release notes

### tvOS

- <https://support.apple.com/en-us/106336> — Apple TV software-update notes
- <https://www.apple.com/newsroom/2023/09/tvos-17-available-now-bringing-facetime-to-apple-tv-4k/> — dated public-availability announcement
- <https://developer.apple.com/documentation/tvos-release-notes/tvos-17-release-notes> — tvOS 17 developer release notes

### visionOS

- <https://support.apple.com/en-us/118202> — visionOS 1 update notes
- <https://www.apple.com/newsroom/2024/01/apple-vision-pro-available-in-the-us-on-february-2/> — dated U.S. availability announcement for Vision Pro and visionOS 1.0
- <https://www.apple.com/newsroom/2024/06/apple-vision-pro-arrives-in-new-countries-and-regions-beginning-june-28/> — international availability and visionOS 1.2 language support
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-release-notes> — visionOS 1.0-era developer release notes
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-1_1-release-notes>
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-1_2-release-notes>
- <https://developer.apple.com/documentation/visionos-release-notes/visionos-1_3-release-notes>
- <https://support.apple.com/en-us/120883> — visionOS 1.1 security content
- <https://support.apple.com/en-us/120906> — visionOS 1.2 security content
- <https://support.apple.com/en-us/120915> — visionOS 1.3 security content

The older Apple Support paths `HT214087` and `HT214108` redirect to canonical documents `120883` and `120906`; the bundle stores the canonical URLs.

Apple Support pages are living documents and can show a later page-level publication date after revision. Historical event mapping in this bundle uses the dated release line or an explicitly labeled release section, not the page's latest revision date. The source ledger records `accessedAt: 2026-07-29`.

## Validation performed

- JSON parse: passed.
- Launch-content bundle assertion: passed.
- Exact inventory reconciliation: passed for all seven local version IDs, dates, and public appearances.
- Source ledger closure: all 156 citation and release-note URL references resolve to the 20 declared sources; all 20 sources are used.
- Article citation check: every factual version and event article paragraph is cited.
- Event identity check: all seven targets contain only `releaseVersionId` plus `routeAlias: "public"`.
- Editorial-state check: all 14 version/event records are `sourceLinked` plus `readyForReview`; all seven events are non-indexable.
- Change validation: all 43 keys are unique, and every occurrence is cited, documented, confirmed, and assigned as a public-release delta.
- Release-version identity check: all seven IDs occur in the successful local migration artifact.
- Guarded Sanity plan: reviewed and applied against `lh3yswzu/production`.
  - 62 creates: 19 sources and 43 release changes
  - 14 revision-guarded patches: seven existing public events and seven release versions
  - 0 event creates, 0 build creates, and 2,076 unchanged documents
  - The twentieth source, Apple TV software-update notes, already exists and is reused by canonical URL
  - 138,259-byte mutation payload, 3.5% of the guarded limit
  - Exact applied plan SHA: `0eef2078686fba78b84f79ef9d301382a6c5fa4a168c1250c8e9c82ff8efd0ec`
  - Zero-residual transaction: `eOgq1Ovu5XNUv1qNFUVY11`
- Production apply: complete and zero-residual verified.

The guarded workflow wrote the deterministic plan, rollback snapshot, and apply receipt under `.migration-artifacts/`.

## Known gaps and uncertainty

1. **No undocumented-change claims are included.** This Apple-first pass did not find a distinct claim with enough independent, durable evidence to label `undocumented` or `partiallyDocumented`. Community discoveries should be added in a later pass only with reproducible verification or multiple independent sources.
2. **No beta-event articles are included.** The 49 non-public milestones remain timeline-only records. Enriching them requires beta-specific notes or archived first-party documentation, not Apple's cumulative public-release pages.
3. **No build records are included.** Build ingestion is intentionally deferred until a complete first-party build-number ledger can cover every public appearance in this cohort.
4. **visionOS 1.2 and 1.3 are maintenance-heavy.** Their articles are intentionally narrower than the major releases because Apple's own release notes are sparse. The security advisories provide most of the concrete technical detail.
5. **Security advisories can be revised after release.** Several Apple advisories include later-added or later-updated entries. The bundle presents them as the current documented security record for that release, not as proof that every entry appeared on launch day.
6. **Editorial approval is explicit.** The records were promoted to `editoriallyVerified` and `approved` only after the final source, claim, event-mapping, and mutation-plan review.

There are no uncertain public-event mappings in this batch.
