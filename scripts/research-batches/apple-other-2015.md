# Apple 2015 non-iPhone research batch

## Result

`apple-other-2015.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in calendar 2015. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.11 | 1 | 17 |
| watchOS | 1.0, 2.0, 2.1 | 3 | 41 |
| tvOS | 9.0, 9.1 | 2 | 20 |
| **Total** | **6 version articles** | **6** | **78** |

The six versions contain 18 existing local timeline milestones: 6 public appearances and 12 beta, golden-master, and other non-public milestones. This bundle enriches only the six durable public routes through `releaseVersionId` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- All 12 version/event records are `editoriallyVerified` and `approved` as of 2026-07-30T05:35:52Z.
- All public events are indexable after editorial approval.
- Every change is `documented`, `confirmed`, and a public-release `delta`.
- No undocumented-change claim is included.
- No beta note or later cumulative change is projected backward.
- No build record is included; no build number is inferred.
- Security changes summarize attack surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory, date, and hardware boundaries

1. Seed closure is exact: macOS 10.11; watchOS 1.0, 2.0, and 2.1; and tvOS 9.0 and 9.1 are the only existing non-iOS/iPadOS records with audited public dates in 2015.
2. The watchOS 1.0 route uses April 24 because the local audit maps the preinstalled launch software to original Apple Watch availability. Apple's launch material describes an integrated hardware-and-software product rather than a separately downloadable 1.0 update.
3. Apple's 2015 security index starts watch software coverage at Watch OS 1.0.1 on May 19. The bundle therefore makes no security-repair claim for watchOS 1.0.
4. Apple announced September 16 as the planned watchOS 2 date. Its surviving dated security record places the actual release on September 21, matching the audited seed; September 16 is documented only as a superseded plan.
5. The tvOS 9.0 route uses the seed's October 29 software date. Apple announced the new Apple TV for the end of October and said on October 27 that shipping would begin that week, but did not publish a retained page proving October 29 as a separate OTA or universal retail date.
6. tvOS 9.0 is therefore represented as the preinstalled launch platform for fourth-generation Apple TV. Apple's 2015 security index begins tvOS coverage with 9.1, so no 9.0 security repair set is inferred.
7. The existing-record-only catalog omits Apple-documented 2015 version identities including Watch OS 1.0.1, watchOS 2.0.1, OS X 10.11.1, and OS X 10.11.2. This bundle creates none of them.

## Source ledger

All 14 declared sources are human-readable first-party Apple pages checked on 2026-07-30.

### Cross-platform chronology

- <https://support.apple.com/en-us/103813> — Apple's dated 2015 security-release index, including actual dates and locally absent point releases

### macOS

- <https://www.apple.com/newsroom/2015/09/29OS-X-El-Capitan-Available-as-a-Free-Update-Tomorrow/> — El Capitan availability, features, compatibility, and performance qualifications
- <https://support.apple.com/en-us/103562> — detailed El Capitan 10.11 security content

### watchOS

- <https://www.apple.com/newsroom/2015/03/09Apple-Watch-Available-in-Nine-Countries-on-April-24/> — original Apple Watch availability and launch software-visible capabilities
- <https://support.apple.com/en-us/106617> — retained watchOS 2.0 and 2.1 consumer notes
- <https://www.apple.com/newsroom/2015/06/08Apple-Previews-New-Apple-Watch-Software/> — watchOS 2 feature and WatchKit context
- <https://www.apple.com/newsroom/2015/09/09Apple-Introduces-watchOS-2-with-Native-Apps-and-New-Gold-Rose-Gold-Aluminum-Apple-Watch-Sport-Models/> — the superseded September 16 availability plan
- <https://support.apple.com/en-us/103306> — watchOS 2 security content
- <https://support.apple.com/en-us/103565> — watchOS 2.1 security content

### tvOS

- <https://www.apple.com/newsroom/2015/09/09Apple-Brings-Innovation-Back-to-Television-with-The-All-New-Apple-TV/> — all-new Apple TV, tvOS, Siri Remote, App Store, and SDK launch context
- <https://www.apple.com/newsroom/2015/10/27Apple-Reports-Record-Fourth-Quarter-Results/> — Apple's October 27 statement that the new Apple TV would begin shipping that week
- <https://developer.apple.com/library/archive/releasenotes/General/RN-tvOSSDK-9.0/> — archived final tvOS 9.0 SDK notes
- <https://developer.apple.com/library/archive/releasenotes/General/RN-tvOSSDK-9.1/> — archived final tvOS 9.1 SDK notes
- <https://support.apple.com/en-us/103509> — tvOS 9.1 security content

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section and the dated security index; archived SDK documents retain their original update dates.

## Known gaps

1. The four named Apple-documented 2015 point-version identities absent from the local catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. No retained Apple security record was found for the watchOS 1.0 or tvOS 9.0 launch baselines, so neither page claims a security delta.
3. No retained version-labeled Apple consumer narrative was found for tvOS 9.1. Its page intentionally stays limited to final SDK notes and the security advisory rather than repeating user features remembered from third-party histories.
4. The 12 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for a release, not proof that every advisory entry appeared on launch day.
7. Hardware mechanisms are included only when they define software interaction, sensing, setup, or compatibility boundaries; hardware colors, capacities, pricing, and industrial-design claims are excluded.

## Validation

- Research-batch validation passed with 6 versions, 6 public events, 78 globally consistent change keys, 14 sources, and 186 citation references for this file.
- Inventory closure passed and is enforced inside the generator: six eligible local versions, 18 milestones, 6 public appearances, 12 non-public milestones, 14 of 14 declared sources cited, and zero build records.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 90 creates, 14 revision-guarded patches, and 2,076 unchanged documents.
- Creates: 12 source documents and 78 change documents; zero version, event, or build creates. The plan included six version patches, six existing durable public-event patches, and two source metadata patches.
- Mutation payload: 186,206 bytes, reported as 4.8% of the guarded limit.
- Applied production plan SHA: `4f6d06e4446a0daf7623618857986a4131d5a8190c166680dd306be64117a90e`.
- Production transaction `F0eE6eK5XyVXtlnaoxy5kW` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: `0340f2899dea4ad080fb30a7abd0e4c7bd5ccd8104994293db3628cb91bdf66e`.
- Post-apply zero-residual plan SHA: `c7461db5c74beb5a0462bcb5fdd1a7dd5c918a7bcbc860fe0fe20172892d90bd`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for `/apple/macos/10.11`, `/apple/watchos/1.0`, and `/apple/tvos/9.1`.
