# Apple iOS and iPadOS 18 research batch

## Result

The companion manifest covers every audited iOS 18.x and iPadOS 18.x `releaseVersion` record currently present in `scripts/seed-data.json`.

- 21 of 21 local version records have source-linked overview articles.
- 21 of 21 local public appearances have release-specific summaries and changes.
- 42 cited overview paragraphs provide the version-level articles.
- 91 structured change occurrences are attached to public appearances.
- 22 source records are included: 22 first-party Apple sources and no secondary sources.
- 0 build records are included; see the evidence gaps below.
- Every event uses the durable `{releaseVersionId, routeAlias: "public"}` selector.
- After root editorial review, all records are `approved`,
  `editoriallyVerified`, and indexable.
- No beta or release-candidate event was modified, and no Sanity write was performed.

## Exact coverage

| Release     | Public date in local audit | Changes | Article blocks | Durable public target            |
| ----------- | -------------------------- | ------: | -------------: | -------------------------------- |
| iOS 18.0    | 2024-09-16                 |       6 |              2 | `version-ios-18-0` + `public`    |
| iPadOS 18.0 | 2024-09-16                 |       6 |              2 | `version-ipados-18-0` + `public` |
| iOS 18.0.1  | 2024-10-03                 |       6 |              2 | `version-ios-18-0-1` + `public`  |
| iOS 18.1    | 2024-10-28                 |       6 |              2 | `version-ios-18-1` + `public`    |
| iPadOS 18.1 | 2024-10-28                 |       6 |              2 | `version-ipados-18-1` + `public` |
| iOS 18.1.1  | 2024-11-19                 |       2 |              2 | `version-ios-18-1-1` + `public`  |
| iOS 18.2    | 2024-12-11                 |       6 |              2 | `version-ios-18-2` + `public`    |
| iPadOS 18.2 | 2024-12-11                 |       6 |              2 | `version-ipados-18-2` + `public` |
| iOS 18.2.1  | 2025-01-06                 |       1 |              2 | `version-ios-18-2-1` + `public`  |
| iOS 18.3    | 2025-01-27                 |       5 |              2 | `version-ios-18-3` + `public`    |
| iPadOS 18.3 | 2025-01-27                 |       3 |              2 | `version-ipados-18-3` + `public` |
| iOS 18.3.1  | 2025-02-10                 |       2 |              2 | `version-ios-18-3-1` + `public`  |
| iOS 18.3.2  | 2025-03-11                 |       2 |              2 | `version-ios-18-3-2` + `public`  |
| iOS 18.4    | 2025-03-31                 |       6 |              2 | `version-ios-18-4` + `public`    |
| iPadOS 18.4 | 2025-03-31                 |       6 |              2 | `version-ipados-18-4` + `public` |
| iOS 18.4.1  | 2025-04-16                 |       3 |              2 | `version-ios-18-4-1` + `public`  |
| iOS 18.5    | 2025-05-12                 |       5 |              2 | `version-ios-18-5` + `public`    |
| iPadOS 18.5 | 2025-05-12                 |       3 |              2 | `version-ipados-18-5` + `public` |
| iOS 18.6    | 2025-07-29                 |       4 |              2 | `version-ios-18-6` + `public`    |
| iPadOS 18.6 | 2025-07-29                 |       4 |              2 | `version-ipados-18-6` + `public` |
| iOS 18.7    | 2025-09-15                 |       3 |              2 | `version-ios-18-7` + `public`    |

## Verified source set

All 22 URLs resolved to the named first-party Apple page during research on 2026-07-29. Apple Developer documentation is JavaScript-rendered, but each human-readable URL resolved with the expected release-note title. The manifest never exposes Apple’s DocC transport JSON as a citation.

### Consumer release notes

- [About iOS 18 Updates](https://support.apple.com/en-us/121161)
- [About iPadOS 18 Updates](https://support.apple.com/en-us/121162)

### Apple Developer release notes

- [iOS & iPadOS 18 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18-release-notes)
- [iOS & iPadOS 18.1 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18_1-release-notes)
- [iOS & iPadOS 18.2 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18_2-release-notes)
- [iOS & iPadOS 18.3 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18_3-release-notes)
- [iOS & iPadOS 18.4 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18_4-release-notes)
- [iOS & iPadOS 18.5 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18_5-release-notes)
- [iOS & iPadOS 18.6 Release Notes](https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-18_6-release-notes)

### Apple security bulletins

- [iOS 18 and iPadOS 18](https://support.apple.com/en-us/121250)
- [iOS 18.0.1 and iPadOS 18.0.1](https://support.apple.com/en-us/121373)
- [iOS 18.1 and iPadOS 18.1](https://support.apple.com/en-us/121563)
- [iOS 18.1.1 and iPadOS 18.1.1](https://support.apple.com/en-us/121752)
- [iOS 18.2 and iPadOS 18.2](https://support.apple.com/en-us/121837)
- [iOS 18.3 and iPadOS 18.3](https://support.apple.com/en-us/122066)
- [iOS 18.3.1 and iPadOS 18.3.1](https://support.apple.com/en-us/122174)
- [iOS 18.3.2 and iPadOS 18.3.2](https://support.apple.com/en-us/122281)
- [iOS 18.4 and iPadOS 18.4](https://support.apple.com/en-us/122371)
- [iOS 18.4.1 and iPadOS 18.4.1](https://support.apple.com/en-us/122282)
- [iOS 18.5 and iPadOS 18.5](https://support.apple.com/en-us/122404)
- [iOS 18.6 and iPadOS 18.6](https://support.apple.com/en-us/124147)
- [iOS 18.7 and iPadOS 18.7](https://support.apple.com/en-us/125109)

No independent source was needed for a unique fact in this batch. That keeps all 91 structured claims confirmed by first-party documentation and avoids adding a secondary-source paraphrase where Apple’s own evidence was sufficient.

## Editorial and copyright method

The manifest contains original synthesis rather than copied release-note paragraphs. Each factual overview paragraph, event summary, and structured change is tied to an explicit Apple citation and locator. Closely related Apple bullets are sometimes grouped into one reader-facing change when they form a coherent feature area; the grouping is described in new prose rather than reproducing Apple’s wording.

The batch does not label ordinary Apple documentation as “undocumented.” It also does not attach cumulative notes to beta events. A claim is assigned only to the public appearance for which Apple documented it, and uncertain patch notes stay visibly uncertain.

Trademarked product and feature names are used only as necessary to identify the Apple software, devices, and features being documented. The content does not imply affiliation with or endorsement by Apple.

## Evidence gaps and deliberate limits

- The local audit contains no iPadOS records for 18.0.1, 18.1.1, 18.2.1, 18.3.1, 18.3.2, or 18.4.1, even though some Apple bulletins cover both platforms. This batch does not create versions that are absent from the audited local dataset.
- The local audit stops at iOS 18.7 and iPadOS 18.6. Apple’s live cumulative articles now list later 18.x maintenance releases, but they are outside this batch because they are not local audited records.
- Apple’s iOS 18.2.1 note says only that important bug fixes were included. It has one `partiallyDocumented` aggregate change and no invented component details.
- Apple’s iOS 18.1.1 exploitation qualification names Intel-based Mac systems. The article explicitly avoids converting that statement into a claim of active exploitation on iPhone.
- Apple added the Messages item to the iOS 18.3.1 security bulletin in June 2025. The later addition is explicitly labeled in the version article and change verification note.
- Apple describes the iOS 18.3.2 WebKit item as a supplementary fix and places the targeted-exploitation report on versions before iOS 17.2. The article preserves that scope.
- The iOS and iPadOS 18.6 developer page documents a HealthKit known issue. It is categorized as `knownIssue`; it is not presented as a fix shipped in 18.6.
- iOS 18.7’s consumer note does not itemize its bug fixes. The manifest uses one `partiallyDocumented` aggregate entry and only representative, explicitly documented security changes.
- Apple security bulletins can gain or revise entries after the release date. Locators and later-entry notes are preserved where material; the `accessedAt` date records when the live pages were reviewed.
- Build records are intentionally empty. This pass did not capture a complete, release-by-release first-party Apple build-number source set, and a partial or inferred build table would make the archive look more complete than the evidence supports.
- Secondary reporting and community observations were not added merely to increase volume. A future undocumented-change pass should require an independently verifiable, release-specific fact and record publisher, author when available, publication date, and a second source or explicit verification method.

## Validation

- JSON parsing: passed.
- Launch-content schema validation through `assertLaunchContentBundle`: passed.
- Seed comparison: 21 local records, 21 version overlays, 21 public-event overlays, no missing or extra IDs.
- Target check: all 21 event selectors use exactly `releaseVersionId` plus `routeAlias: "public"`.
- Migration-plan resolution check: the existing local migration plan contains one matching `public` route for each of the 21 targets.
- Citation registry check: no citation URL is missing from `sources`; no declared source is unused.
- Change identity check: 91 unique change keys; no duplicates.
- Article check: every version has two cited normal blocks; shortest article is 377 characters.
- Focused tests: `node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts` passed all 12 tests.

## Publication review

The root review checked all 21 overview articles, 21 public-event summaries,
91 structured changes, platform-specific scope, sparse-note disclosures, and
the source ledger before recording approval.

The approved production dry run proposed 22 source creates, 91
`releaseChange` creates, 21 version patches, and 21 existing public-event
patches. It created no event or build records and produced a 217,588-byte
guarded mutation payload.

Exact plan SHA:
`a6079bdbca657b9c305a4e96729eacbc4dc1ce8b4afbfdfcf9d264484642cc32`.
The plan was applied with revision guards and zero-residual verification in
Sanity transaction `eOgq1Ovu5XNUv1qNFUUmjP`.
