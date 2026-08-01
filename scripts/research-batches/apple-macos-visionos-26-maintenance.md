# Apple macOS and visionOS 26 maintenance research batch

## Result

This source-backed bundle covers the six existing local macOS Tahoe and
visionOS 26.1–26.3 release-version records and their durable public
appearances. It contains original synthesis rather than copied release-note
prose.

- 6 version articles and 6 public-release articles
- 42 structured, documented, confirmed changes
- 8 first-party Apple sources
- 128 source declarations and citation references
- 0 builds and 0 prerelease-event enrichments
- All records are `editoriallyVerified`, `approved`, and indexable after
  review at `2026-07-30T04:29:07Z`

## Exact local coverage

| Platform | Versions         |
| -------- | ---------------- |
| macOS    | 26.1, 26.2, 26.3 |
| visionOS | 26.1, 26.2, 26.3 |

Every target exists in `scripts/seed-data.json` with one same-date Public
milestone. The bundle uses only
`{releaseVersionId, routeAlias: "public"}` selectors and leaves all beta and
release-candidate events untouched.

## Evidence policy

- Consumer features come from Apple's version-labeled macOS Tahoe or visionOS
  update history.
- Release dates and security claims come from Apple's version-specific
  security advisories.
- Security occurrences group related surfaces for reader navigation; they do
  not claim to replace the complete CVE bulletin.
- Apple's exploitation language in the 26.2 WebKit and 26.3 dyld advisories is
  preserved precisely: it concerns extremely targeted attacks on versions of
  iOS before iOS 26. The articles do not imply that macOS 26.2/26.3 or
  visionOS 26.2/26.3 were observed being exploited.
- Generic maintenance notes remain generic. No unnamed bug is invented for
  either 26.3 release.
- No undocumented or community claim was promoted during this first-party
  pass.

## Source ledger

- <https://support.apple.com/en-us/122868> — What's new in the updates for macOS Tahoe 26
- <https://support.apple.com/en-us/125634> — About the security content of macOS Tahoe 26.1
- <https://support.apple.com/en-us/125886> — About the security content of macOS Tahoe 26.2
- <https://support.apple.com/en-us/126348> — About the security content of macOS Tahoe 26.3
- <https://support.apple.com/en-us/123024> — About visionOS 26 Updates
- <https://support.apple.com/en-us/125638> — About the security content of visionOS 26.1
- <https://support.apple.com/en-us/125891> — About the security content of visionOS 26.2
- <https://support.apple.com/en-us/126353> — About the security content of visionOS 26.3

All pages were checked on 2026-07-30. Apple Support pages are living
documents, so the archive stores the access date and uses section-level
locators rather than treating the current page-revision date as the original
publication time.

## Known gaps

1. The audited local catalog stops this cohort at 26.3 even though Apple's
   living update histories now list later 26.x maintenance releases. Those
   missing version records require the separately guarded version-creation
   workflow and are not silently invented here.
2. Apple does not enumerate the consumer bug fixes in macOS 26.3 or visionOS
   26.3. Those pages remain intentionally narrower than 26.1 and 26.2.
3. No complete, release-by-release first-party build-number set was established,
   so this batch creates no build documents.

## Validation

Run:

```sh
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-macos-visionos-26-maintenance.json
```

## Guarded production apply

- 48 creates: 6 sources and 42 release changes
- 14 revision-guarded patches: 6 release versions, 6 public events, and
  metadata on 2 reused sources
- 0 version, event, or build creates
- 112,595-byte mutation payload, 2.9% of the guarded limit
- Exact applied plan SHA:
  `ac8033fc4441c9c3f83d683f3ffec6a5fee8263642c58907f5cc5c99d43ebeba`
- Transaction: `tt1fSB5HY9GAB0YLyxpn5A`
- The ingestion pipeline committed the transaction and verified zero residual
  mutations.
