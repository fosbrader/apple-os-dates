# Apple 2003 non-iPhone research batch

## Result

`apple-other-2003.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2003. The exact cohort is one data-rich Mac OS X Panther 10.3 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.3 (Panther) | 1 | 1 | 28 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **1** | **1** | **28** |

The local Panther record contains only the October 24 public milestone. Apple's October 8 and October 23 announcements identify availability at 8:00 p.m. on October 24. This bundle enriches only that durable route through `releaseVersionId: "version-macos-10-3"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved`
  as of `2026-07-30T06:09:36Z`.
- The public event is indexable.
- All 28 changes are `documented`, `confirmed`, and initial-public-release `delta` entries.
- Twenty-one entries cover the public feature, enhancement, compatibility, developer, automatic-networking, and retail-baseline package, including FileVault as an introduced security feature.
- Seven readable vulnerability-correction entries synthesize the fourteen CAN/CVE identifiers Apple explicitly lists under Mac OS X 10.3 Panther.
- Preview-only claims are used only when retained October or final support material confirms the shipped surface.
- No October 28, November 4, 10.3.1, or later cumulative change is projected backward.
- No undocumented claim or build record is included, and no point version, date, or build number is inferred.
- Apple's up-to-six-times-faster Finder comparison is labeled as a vendor performance claim rather than an independent benchmark.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2003 public appearance: macOS-family record 10.3, named Panther, with one public milestone.
2. Apple's June 23 announcement is explicitly a preview with an end-of-year target. The local seed has no June beta milestone, and this batch does not create one.
3. Apple's October 8 announcement sets October 24 availability; the October 23 notice says the product would go on sale the following evening. The seed's October 24 date is retained without a separate announcement event.
4. The product was named Mac OS X Panther in Apple's 2003 material. The local information architecture groups it under the `macOS` platform family; editorial copy retains the historical Mac OS X name.
5. Apple's archived security chronology says updates are listed by the software release in which they first appeared and has a dedicated Mac OS X 10.3 Panther section. Its fourteen identifiers are therefore in scope for the initial route.
6. That archive separately lists Security Update 2003-10-28 for QuickTime Java, Security Update 2003-11-04 for Terminal, and Security Update 2003-11-19 for Panther 10.3.1. These later changes are excluded.
7. The local catalog has no 10.3.1 releaseVersion record. This existing-record-only batch does not create it or infer its exact general-release date.
8. Mac OS X Server 10.3 had a separate launch package, but the scoped local record is the client OS. No Server route or Server-only feature is created.

## Source ledger

All 6 declared sources are human-readable first-party Apple materials checked on 2026-07-30; all 6 are cited by the bundle.

- <https://support.apple.com/en-us/101682> — archived security chronology, explicit initial 10.3 Panther security section, and later-update boundaries
- <https://www.apple.com/newsroom/2003/06/23Apple-Previews-Mac-OS-X-Panther/> — June 23 feature context, explicitly treated as pre-release and used only where final evidence confirms the surface
- <https://www.apple.com/newsroom/2003/10/08Apple-Announces-Mac-OS-X-Panther/> — October 24 public availability, confirmed launch features, pricing, and compatibility
- <https://www.apple.com/newsroom/2003/10/22Apple-Unveils-New-Generation-G4-iBooks-Starting-at-Just-1-099/> — October 22 final Panther automatic-networking description on systems sold with 10.3 preinstalled
- <https://www.apple.com/newsroom/2003/10/23-Night-of-the-Panther-Kicks-Off-at-8-00-p-m-Tomorrow/> — October 23 corroboration of the next-day public sale, pricing, and hardware requirements
- <https://support.apple.com/en-us/106454> — final X11 1.0 components and optional installation from the third Panther CD

Apple Support pages are living or archived documents and can display publication or revision dates much later than the historical release. Historical mapping therefore uses explicitly labeled versions, dated chronology entries, and the described Panther media rather than current page revision timestamps.

## Known gaps

1. Panther 10.3.1 is absent from the scoped local catalog. Apple's archive labels a November 19 security update for 10.3.1 but does not establish the point version's exact general-release date, so the batch neither creates it nor merges its OpenSSL and zlib changes into 10.3.
2. Preview-only claims without retained final confirmation—including colored Finder labels, Pixlet, the ports manager, Python-to-Quartz access, and specific Active Directory, SMB home-directory, and VPN details—are excluded from structured initial-release deltas.
3. The initial security archive contains fourteen identifiers across fourteen listed entries, but it does not assign modern severity scores. The batch groups related components for readability and does not invent severities or exploit status.
4. Apple's archive says the zlib and gm4 changes were preventive or had limited default exposure; the summaries preserve those qualifications.
5. X11 was an optional installation on Panther media, not a claim that every default installation contained an active X11 environment.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. The launch announcement documents eligible Mac families and minimum memory but does not guarantee every third-party peripheral or application. No broad compatibility promise is inferred.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 28 globally consistent change keys, 6 sources, and 83 citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 1 public milestone, 6 of 6 declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 34 creates, 2 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 6 source documents, zero version documents, zero event documents, zero build documents, and 28 change documents.
- The two guarded patches target the existing Panther public event and the existing Panther version article. No chronology or identity field is changed.
- Mutation payload: 88,231 bytes, reported as 2.3% of the guarded limit.
- Approved production plan SHA:
  `78fffa95670e5635d01c1da29b5be5b8759e2e9fc27ce39dd82417429f9c7edc`.
- Bundle JSON SHA-256: `81036de8997197bc3bc2baa09e26bdbba7e784e8370362a92eaee47d16a030c1`.
- Production apply committed and zero-residual verified in transaction
  `tt1fSB5HY9GAB0YLyy3pbj`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,117 unchanged
  documents. Its plan SHA is
  `32a1be45b10416588b3475545065c941d14c4ac59976fd9211bdeeed080da0dc`.
- The representative local route `/apple/macos/10.3` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at `2026-07-30T06:09:36Z`.
