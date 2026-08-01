# Apple 26.5–26.6 prerelease RC research batch

## Result

`apple-26-5-26-6-prerelease.json` enriches only the six existing 26.6 Release Candidate routes whose current first-party Apple Developer notes still identify the RC and enumerate its changes.

- The exact seed contains 12 versions, 82 milestones, 12 Public routes, and 70 beta/RC routes.
- There are no Public Beta milestones in the 26.5 or 26.6 seed.
- 6 RC routes have durable release-specific evidence and are included.
- 64 prerelease routes remain intentionally unsupported: all 34 routes from 26.5 and the 30 pre-RC beta routes from 26.6.
- The six event overlays contain 22 confirmed, documented, platform-scoped delta occurrences.
- 5 first-party Apple sources are used: the canonical RC release-note pages (iOS and iPadOS share one page).
- No version overlay, Public route, build page, new identity, public support note, security advisory, or apply operation is included.
- Root editorial review approved the six RC articles and their indexing state at `2026-07-30T06:44:12Z`.

## Exact seed closure

| Platform  | Version | Seed milestones | Beta/RC routes | Selected | Unsupported |
| --------- | ------: | --------------: | -------------: | -------: | ----------: |
| iOS       |    26.5 |               8 |              7 |        0 |           7 |
| iOS       |    26.6 |               7 |              6 |        1 |           5 |
| iPadOS    |    26.5 |               8 |              7 |        0 |           7 |
| iPadOS    |    26.6 |               7 |              6 |        1 |           5 |
| macOS     |    26.5 |               6 |              5 |        0 |           5 |
| macOS     |    26.6 |               7 |              6 |        1 |           5 |
| tvOS      |    26.5 |               6 |              5 |        0 |           5 |
| tvOS      |    26.6 |               7 |              6 |        1 |           5 |
| visionOS  |    26.5 |               6 |              5 |        0 |           5 |
| visionOS  |    26.6 |               7 |              6 |        1 |           5 |
| watchOS   |    26.5 |               6 |              5 |        0 |           5 |
| watchOS   |    26.6 |               7 |              6 |        1 |           5 |
| **Total** |         |          **82** |         **70** |    **6** |      **64** |

Every seed signature is asserted by label, date, order, and revision flag. iOS and iPadOS 26.5 each include the April 3 Beta 1 v2 revision and May 8 RC 2. The other four 26.5 platforms do not. All six 26.6 tracks include five developer betas and one RC before Public.

Production inspection found all 70 prerelease routes as source-linked drafts with zero article text and `isIndexable: false`. The six selected RC routes become `editoriallyVerified`, approved, and indexable after review; the other 64 remain unchanged. The 12 Public routes are already approved and indexable; their version and Public-event content is owned by the approved launch manifest and is excluded here.

## Selected route inventory

| Platform  | Durable selector           | RC deltas |
| --------- | -------------------------- | --------: |
| iOS       | `version-ios-26-6/rc`      |         5 |
| iPadOS    | `version-ipados-26-6/rc`   |         5 |
| macOS     | `version-macos-26-6/rc`    |         4 |
| tvOS      | `version-tvos-26-6/rc`     |         2 |
| visionOS  | `version-visionos-26-6/rc` |         3 |
| watchOS   | `version-watchos-26-6/rc`  |         3 |
| **Total** |                            |    **22** |

The current canonical developer pages explicitly use “RC” in both their titles and SDK overview, which establishes the event-specific evidence boundary for the 22 enumerated items. They do not durably establish the historical RC date or build number, so those facts are excluded from this batch.

## Unsupported-route audit

### Version 26.5

Apple's current canonical 26.5 developer pages are final cumulative release notes. Apple does not retain a durable, independently resolving per-seed note snapshot on those canonical pages. Timeline metadata alone does not establish when a feature, fix, known issue, or removal entered the cycle.

Accordingly, no 26.5 item is copied backward to Beta 1, Beta 1 v2, Beta 2, Beta 3, Beta 4, RC, or RC 2. The April 3 iOS/iPadOS revised build is recorded by the timeline but Apple does not publicly state its corrective delta, so this batch does not invent one.

### Version 26.6 before RC

The current 26.6 pages identify the Release Candidate, not Beta 1 through Beta 5. Search indexes and mutable category pages showed earlier beta titles during research, but they are not durable primary snapshots suitable for claim-level publication. The 30 developer-beta routes therefore remain timeline-only.

### Public Beta

No Public Beta route exists in the audited seed or production cohort. No event is created to fill that absence.

## Delta and reuse method

The RC items reuse the exact approved release-change identities already defined for the corresponding Public pages, but only when Apple's RC-titled developer note independently contains the same item. Public-only Spotlight preparation, enterprise fixes, general security language, and maintenance summaries are excluded.

The resulting RC inventory is:

- iOS and iPadOS: HealthKit authorization and overlapping-sample statistics, Messages HDR screenshots, sticker-data recovery, and the grouped Object Capture / StoreKit Simulator corrections.
- macOS: encrypted-HFS+ CoreStorage deprecation, false Intel-only notices, overlapping-sample HealthKit statistics, and Messages HDR screenshots.
- tvOS: overlapping-sample HealthKit statistics and StoreKit Simulator session connectivity.
- visionOS and watchOS: HealthKit authorization, overlapping-sample statistics, and StoreKit Simulator session connectivity.

Every occurrence uses `inheritance: "delta"`, `documentedStatus: "documented"`, and `evidenceState: "confirmed"`. No cumulative public item is inherited.

## Artifact-metadata boundary

The event articles intentionally make no claim about the historical RC build numbers or release dates. During closure review, the six dated Apple News URLs initially considered for this purpose were found to be mutable category views that no longer expose the asserted July 20 RC entries. They were removed as sources and are not cited.

This remains deliberately an event-page-only batch, so `builds` is empty. A later build-metadata cohort would require durable first-party evidence independently proving the exact RC artifacts; this batch does not infer them from the timeline, mutable Apple News category pages, or later Public build records.

## Sources and copyright method

All summaries, article paragraphs, and occurrence descriptions are new synthesis. Apple issue identifiers, build numbers, platform names, framework names, and API identifiers are factual nominative references. The manifest does not copy Apple paragraphs, developer-note lists, marketing language, or trademark boilerplate.

DocC JSON URLs are declared only as `transportUrl` research metadata. Reader-facing citations use the human-readable Apple Developer pages. Each claim has a section-level locator.

The Apple Developer pages are mutable. This batch records their state as accessed on 2026-07-30: each 26.6 page still identified the Release Candidate. A later title change must not be treated as evidence for earlier betas.

## Validation

- JSON parsing and launch-content schema validation passed. The repository validator accepted every concurrent research batch and all globally consistent change keys at the final validation checkpoint; this batch contributes 46 citations.
- Seed closure: 12 exact versions, 82 exact milestones, 70 beta/RC routes, 12 Public routes, and no Public Beta route.
- Ownership closure: 6 new durable RC selectors, no overlap with another research batch, and no overlap with the approved Public routes.
- Change closure: 22 unique platform-scoped keys exactly match their approved reusable definitions.
- Citation closure: every citation URL has one declared source and every declared source is used.
- Review state: all 6 events are `editoriallyVerified`, approved at `2026-07-30T06:44:12Z`, and indexable.
- Deterministic bundle SHA-256: `db1db1adcdd9b25cb2f5996bc63654218729ae88b6814bba1883a50009bcd4b2`.
- A second generator run reproduced the JSON byte for byte at the same SHA-256.
- Focused launch-content ingestion and manifest tests passed 19 of 19.
- ESLint passed for the generator, and Prettier passed for the generator, JSON, and ledger.
- The reviewed production dry run reported 0 creates, 28 revision-guarded patches, and 2,081 unchanged documents. No source, version, event, build, or change document was created.
- Six patches enriched the exact existing RC events with article body, changes, citations, approval state, indexing state, and summary. Twenty-two release-change patches recorded the same editorial review timestamp; one of those also added the independent RC developer-note citation to the existing approved macOS Messages HDR change.
- No version, Public event, build, or other route was patched. No field was unset and no document was deleted.
- Reviewed production plan SHA-256: `d1eff761fb0f90b55b7fa941f25614ae542c2c88487585ca3f77be12b24c0da2`; mutation payload: 47,054 bytes (1.2% of the guarded limit).
- Serialized plan artifact SHA-256: `a58475785d2d82b2de6b00eb980361d1434fc62d70188b33b4124db1411984e6`; rollback artifact SHA-256: `6852d31118ab3deac3c5ce42d10c41837611af375e5d59d3bef3cc9cfd4ac347`.
- The exact reviewed plan committed as Sanity transaction `tt1fSB5HY9GAB0YLyyFYZs`; receipt SHA-256: `6d2934c104cf269132566fe7cbe3f54d22336d837f2575eaff4b181689973903`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,109 unchanged documents with zero-plan SHA `bf2d29ea07045ba55fa5590ff8c270145e69bd819c2bbe0d4fe8deb91fb261be`.
- All six local routes returned HTTP 200 with article copy, structured changes, references, and `index, follow`.

## Human approval checklist

- [x] Accepted the evidence-based omission of all 26.5 prerelease pages.
- [x] Accepted the omission of 26.6 Beta 1–5 because no durable per-beta primary snapshot remains.
- [x] Accepted the six RC-titled developer-note pages as exact 26.6 RC evidence.
- [x] Accepted reuse of approved change identities only where the RC page independently repeats the item.
- [x] Approved the six substantive RC events for indexing at `2026-07-30T06:44:12Z`.

## Reproduction

```bash
node scripts/research-batches/build-apple-26-5-26-6-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-26-5-26-6-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-26-5-26-6-prerelease.mjs scripts/research-batches/apple-26-5-26-6-prerelease.json scripts/research-batches/apple-26-5-26-6-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-26-5-26-6-prerelease.json
```

The final command is a dry run only. Do not add `--apply` or any approval flags in this research pass.
