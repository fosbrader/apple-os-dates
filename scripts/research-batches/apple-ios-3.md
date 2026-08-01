# Apple iOS 3 research batch

## Result

`apple-ios-3.json` is a source-backed launch-content bundle for every existing local iOS 3 release version and its durable public route. It contains copyright-safe original synthesis, claim-level citations, structured change records, and no copied release-note body text.

## Exact local coverage

| Version | Existing public date | Structured changes | Durable target |
| --- | --- | ---: | --- |
| iPhone OS 3.0 | 2009-06-17 | 15 | `version-ios-3-0` + `public` |
| iPhone OS 3.0.1 | 2009-07-31 | 1 | `version-ios-3-0-1` + `public` |
| iPhone OS 3.1 | 2009-09-09 | 14 | `version-ios-3-1` + `public` |
| iPhone OS 3.1.2 | 2009-10-08 | 3 | `version-ios-3-1-2` + `public` |
| iPhone OS 3.1.3 | 2010-02-02 | 7 | `version-ios-3-1-3` + `public` |
| iPhone OS 3.2 | 2010-04-03 | 8 | `version-ios-3-2` + `public` |
| **Total** |  | **48** | **6 versions / 6 events** |

Each local version has exactly one same-date Public milestone and no non-public milestone. The batch overlays only those six existing versions and six existing durable public events. It creates no version, event, or build identity.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 12 version/event records are `editoriallyVerified` and `approved` as of
  `2026-07-30T05:18:42Z`.
- All public events are indexable after editorial approval.
- Every structured change is a public-release `delta` with at least one claim citation.
- First-party Apple documentation is used wherever it survives.
- Three iPhone OS 3.1.2 maintenance items and three ordinary 3.1.3 fixes are explicitly attributed to contemporaneous journalism rather than presented as first-party confirmation.
- No beta, build, undocumented-change, or retroactive cumulative-note claim is included.
- Security entries summarize affected surfaces and remediation classes without reproducing advisory prose.
- Historical Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Source ledger

All 13 declared sources were human-reviewed on 2026-07-30 and all 13 are cited by the bundle.

### Apple primary sources

- <https://support.apple.com/en-us/104189> — Apple’s archived 2008–2009 security release index; explicitly dates 3.0, 3.0.1, and 3.1.
- <https://support.apple.com/en-us/104188> — Apple’s archived 2010 security release index; explicitly dates 3.1.3 and bounds the absence of an initial 3.2 advisory.
- <https://support.apple.com/en-us/104138> — detailed iPhone OS 3.0 security content.
- <https://support.apple.com/en-us/104140> — focused iPhone OS 3.0.1 SMS security content.
- <https://support.apple.com/en-us/104146> — detailed iPhone OS 3.1 security content.
- <https://support.apple.com/en-us/104157> — detailed iPhone OS 3.1.3 security content.
- <https://www.apple.com/newsroom/2009/03/17Apple-Previews-Developer-Beta-of-iPhone-OS-3-0/> — Apple’s feature and developer-API description for 3.0.
- <https://www.apple.com/newsroom/2009/06/08Apple-Announces-the-New-iPhone-3GS-The-Fastest-Most-Powerful-iPhone-Yet/> — June 17 availability, principal 3.0 features, and hardware/service qualifications.
- <https://www.apple.com/newsroom/2009/09/09Apple-Introduces-New-iPod-touch-Lineup/> — 3.1 features and device-specific qualifications.
- <https://www.apple.com/newsroom/2009/09/09Apple-Premieres-iTunes-9/> — 3.1 organization, synchronization, Genius Mixes, and ringtone integration.
- <https://www.apple.com/newsroom/2010/03/05iPad-Available-in-US-on-April-3/> — April 3 availability and the original iPad/iPhone OS 3.2 software experience.

### Contemporaneous journalism

- <https://www.macrumors.com/2009/10/08/apple-releases-iphone-os-3-1-2/> — same-day preservation of the three displayed iPhone OS 3.1.2 maintenance notes.
- <https://www.macworld.com/article/202388/iphone_313.html> — same-day preservation of three ordinary iPhone OS 3.1.3 fixes, separately corroborated for date and security scope by Apple.

## Chronology and evidence boundaries

1. The local dates for 3.0, 3.0.1, 3.1, and 3.1.3 match Apple’s dated security indexes. Apple’s iPad availability announcement independently establishes April 3 for 3.2.
2. Apple’s retained 2009 security index has no 3.1.2 entry, and no surviving first-party 3.1.2 feature page was found in the reviewed source set. The local audited October 8 date and three ordinary fixes therefore remain attributed to MacRumors’ contemporaneous preservation; no security claim is inferred from the index omission.
3. Apple’s 3.1.3 advisory documents security content but not the three ordinary fixes preserved by Macworld. Those ordinary entries remain `reported`; the date and security entries are Apple-confirmed.
4. The project groups the original iPad’s 3.2 software under its existing iOS release train, while the historical article explains that this was the iPad-only branch of the then-named iPhone OS.
5. Apple’s reviewed 2010 security index does not list an advisory for the initial 3.2 release. That absence is treated only as a source boundary, never as proof that no security changes existed.
6. MMS, MobileMe, remote-lock, store, regional, hardware, and carrier claims retain Apple’s historical applicability limits.
7. Apple later shipped 3.2.1 and 3.2.2 for iPad, but those identities are absent from the local iOS 3 catalog and are not created by this existing-record-only batch.

## Validation

- Exact seed closure passed: 6 eligible local versions, 6 same-date Public milestones, and 0 non-public milestones.
- Durable-route closure passed: 6 of 6 version overlays and 6 of 6 `releaseVersionId` + `public` event overlays.
- Source closure passed: 13 of 13 declared sources cited.
- Research-batch validation passed with 6 versions, 6 public events, 48 globally consistent change keys, 13 sources, and 135 citation references.
- Generator ESLint and Prettier checks passed.
- Deterministic generator output SHA-256: `c0ca18b92db709fac052798caf14c9d254f8479ea8229fca0d0097708b4b24a6`.
- No build records are included.
- Reviewed production plan: 60 creates, 12 revision-guarded patches, and 2,077
  unchanged documents.
- Creates: 12 source documents and 48 change documents; zero version, event, or
  build creates. The plan patched 6 existing versions and 6 existing public
  events.
- Mutation payload: 123,932 bytes, 3.2% of the guarded limit.
- Applied production plan SHA:
  `76e5e2edc15d032cd4b0a6a91d7e20006ab0a84e5c7151177dd5d0baf9af57f6`.
- Production transaction `F0eE6eK5XyVXtlnaoxwn68` committed successfully
  and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256:
  `ff95719dc0240b97351f815cc180e33eb9a160b94f159d6d427d83078ea98870`.
- Post-apply zero-residual plan SHA:
  `a66177cf62188a75bf19c84a8b73ec07b75ffe298d2baca8b349bfddbf7a4551`.
- Local smoke checks returned HTTP 200 and rendered the expected sourced
  content for `/apple/ios/3.0`, `/apple/ios/3.1.2`, and `/apple/ios/3.2`.
