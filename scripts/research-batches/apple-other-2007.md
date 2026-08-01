# Apple 2007 non-iPhone research batch

## Result

`apple-other-2007.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2007. The exact cohort is one data-rich Mac OS X Leopard 10.5 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.5 (Leopard) | 1 | 1 | 25 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **1** | **1** | **25** |

The local Leopard record contains only the October 26 public milestone. Apple's October 16 announcement identifies a 6:00 p.m. October 26 retail release. This bundle enriches only that durable route through `releaseVersionId: "version-macos-10-5"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved`
  as of `2026-07-30T06:02:26Z`.
- The public event is indexable.
- All 25 changes are `documented`, `confirmed`, and public-release `delta` entries.
- No undocumented-change or initial-security claim is included.
- June near-final detail is used only where the October ship announcement or final 10.5 documentation confirms the shipped surface.
- No 10.5.1 or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's first-weekend figure is explicitly labeled a vendor-reported sales and delivery claim, not an independent adoption measurement.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2007 public appearance: macOS-family record 10.5, named Leopard, with one public milestone.
2. Apple's June 11 announcement calls the demonstrated software `near final` and promises an October ship date. The local seed has no June beta milestone, and this batch does not create one.
3. Apple's October 16 announcement sets availability for October 26 at 6:00 p.m. The seed's October 26 date is retained without a separate announcement event.
4. The product was named Mac OS X Leopard in Apple's 2007 material. The local information architecture groups it under the `macOS` platform family; editorial copy retains the historical Mac OS X name.
5. Apple's archived security index omits an initial Leopard 10.5 release line and separately lists Mac OS X 10.5.1 on November 15.
6. The local catalog has no 10.5.1 releaseVersion record. This existing-record-only batch does not create it, attach its firewall repairs to 10.5, or infer any later point release or build.
7. Mac OS X Server 10.5 had a separate Apple launch package, but the scoped local record is the client OS. No Server route or Server-only feature is created.

## Source ledger

All 7 declared sources are human-readable first-party Apple materials checked on 2026-07-30; all 7 are cited by the bundle.

- <https://support.apple.com/en-us/104190> — archived 2005–2007 security chronology and the missing-initial-10.5/10.5.1 boundary
- <https://www.apple.com/newsroom/2007/06/11Apple-Unveils-Near-Final-Mac-OS-X-Leopard/> — June 11 near-final feature and developer context, explicitly treated as pre-release
- <https://www.apple.com/newsroom/2007/10/16Apple-to-Ship-Mac-OS-X-Leopard-on-October-26/> — October 26 public availability, confirmed launch features, pricing, and compatibility
- <https://www.apple.com/newsroom/2007/10/30Apple-Sells-Two-Million-Copies-of-Mac-OS-X-Leopard-in-First-Weekend/> — Apple's October 30 first-weekend sales/delivery report, retained as an attributed vendor claim
- <https://support.apple.com/en-us/112593> — final 10.5 requirements, applications, technologies, and developer-tool inventory
- <https://cdsassets.apple.com/live/6GJYWVAV/misc/ma348_leopard_install-setup.pdf> — October 2007 DVD installation, setup, and migration workflows
- <https://support.apple.com/en-us/102685> — version-specific 10.5.1 security content used only to enforce the later-release boundary

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses explicitly labeled versions, dated document footers, and release lines rather than current page revision timestamps.

## Known gaps

1. Leopard 10.5.1 is absent from the scoped local catalog. Apple's archive dates it to November 15, 2007, but this batch does not create the missing route or merge its changes into 10.5.
2. Apple's retained 2005–2007 security index does not list initial Leopard 10.5, and exact first-party searches did not surface a retained dedicated initial 10.5 security advisory. The bundle therefore contains zero initial-security deltas.
3. Apple's June near-final announcement described Time Machine backup to a hard drive attached to an AirPort Extreme base station. The October ship announcement and final technical specification only confirm the additional-drive requirement, so the wireless AirPort-disk claim is excluded from the structured public delta.
4. The June announcement used the name `Xray` for a performance tool, while the final 10.5 specification lists `Instruments`. Final-version copy uses Instruments and records the naming mismatch only as an evidence boundary.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. Apple's first-weekend count combines sales with maintenance-agreement deliveries and includes multiple distribution channels. It is preserved with those qualifications rather than converted into an independent user or install count.
7. The installation guide documents available workflows but does not establish that every third-party application or peripheral remained compatible. No broad compatibility guarantee is inferred.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 25 globally consistent change keys, 7 sources, and 85 citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 1 public milestone, 7 of 7 declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 31 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 6 source documents, zero version documents, zero event documents, zero build documents, and 25 change documents.
- The guarded patches target the existing Leopard public event, the existing Leopard version article, and author/topics on the already-present 2005–2007 Apple security-index source. No chronology or identity field is changed.
- Mutation payload: 80,796 bytes, reported as 2.1% of the guarded limit.
- Approved production plan SHA:
  `ed6adcbbad30d984ee0f0965d6b4354f35cacde10a9c73ccd0626c38de74387b`.
- Bundle JSON SHA-256: `8a36096faeda2f0a32d7918d39fda9e004661b898100233f3371aff2a08edc73`.
- Production apply committed and zero-residual verified in transaction
  `F0eE6eK5XyVXtlnaoxzawB`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,115 unchanged
  documents. Its plan SHA is
  `32a2ab5ee5269022c41bce2c52cb0de63b3394d470082b8f79486113a56ae2af`.
- The representative local route `/apple/macos/10.5` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at `2026-07-30T06:02:26Z`.
