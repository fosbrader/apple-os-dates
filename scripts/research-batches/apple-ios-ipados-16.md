# iOS and iPadOS 16 editorial batch

Prepared and reviewed July 29, 2026.

## Scope

- 17 existing iOS 16.x version records and their public-release appearances.
- 7 existing iPadOS 16.x version records.
- 6 iPadOS public-release appearances. The iPadOS 16.0 article explicitly
  records that the audited beta cycle was superseded and that public iPadOS 16
  availability began at 16.1.
- Consumer-facing release notes, selected developer-facing behavior, and
  source-linked change occurrences. Beta-by-beta notes are outside this batch;
  no cumulative public note is presented as evidence for a specific beta.

## Primary evidence

- Apple Support, [About iOS 16 Updates](https://support.apple.com/en-us/101566)
- Apple Support, [About iPadOS 16 Updates](https://support.apple.com/en-us/108050)
- Apple Support, [Apple security releases](https://support.apple.com/en-us/100100)
- Apple Newsroom, [iOS 16 is available today](https://www.apple.com/newsroom/2022/09/ios-16-is-available-today/)
- Apple Newsroom, [iPadOS 16 is available today](https://www.apple.com/newsroom/2022/10/ipados-16-is-available-today/)
- Apple Developer release notes for iOS 16, iPadOS 16, and shared 16.4–16.6
  SDK releases.

## Editorial decisions

- Every paragraph and structured change is an original synthesis; Apple’s
  publisher prose was not copied into the bundle.
- Generic “bug fixes and security updates” language remains generic when Apple
  did not enumerate consumer-facing fixes. The batch does not infer a
  vulnerability list from the security index.
- Developer-only notes are identified in context rather than blended into the
  consumer feature list.
- Existing chronology remains authoritative for dates, channels, and build
  identity. This batch adds editorial content and citations only.
- Public appearances use durable `{releaseVersionId, routeAlias: "public"}`
  selectors rather than live Sanity document IDs.

The reproducible source table lives in
`build-apple-ios-ipados-16.mjs`; its generated ingestion artifact is
`apple-ios-ipados-16.json`.

## Publication result

The approved production dry run proposed 10 source creates, 84
`releaseChange` creates, 24 version patches, and 23 existing public-event
patches. No event or build records were created. The 184,723-byte mutation
payload was applied from exact plan SHA
`ab3567a2cb6b7b42c8a29c7aa2e0f0034e83cfc29396aa7d129742aafd221468`
with revision guards and zero-residual verification in Sanity transaction
`tt1fSB5HY9GAB0YLyxiMu0`.
