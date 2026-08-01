# Apple 2009 non-iPhone research batch

## Result

`apple-other-2009.json` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2009. The exact cohort is one data-rich Mac OS X Snow Leopard 10.6 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.6 (Snow Leopard) | 2 | 1 | 19 |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **19** |

The local Snow Leopard record contains a June 9, 2008 milestone labeled `Beta 1` and an August 28, 2009 public milestone. Apple's June 2008 announcement precisely describes the first date as a developer preview. This bundle enriches only the existing public route through `releaseVersionId: "version-macos-10-6"` plus `routeAlias: "public"`.

## Editorial and evidence policy

- Authorship is `originalSynthesis` throughout.
- Both version and event records are `editoriallyVerified` and `approved`
  as of `2026-07-30T05:59:50Z`.
- The public event is indexable.
- All 19 changes are `documented`, `confirmed`, and public-release `delta` entries.
- Structured claims cite Apple's final public-launch announcement or contemporaneous 10.6 documentation. The VoiceOver trackpad entry is supported by Apple's June new-feature announcement plus its August 2009 10.6 accessibility record.
- No undocumented-change claim is included.
- No developer-preview article, beta change set, or preview build is created.
- No 10.6.1, 10.6.2, or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's performance and disk-space statements remain attributed vendor claims, not independent measurements.
- Apple and Microsoft product names are used nominatively; no logos, screenshots, publisher artwork, or copied body text is included.

## Inventory, preview, and chronology boundaries

1. Seed closure is exact: macOS-family version 10.6, named Snow Leopard, is the only non-iOS/iPadOS record with a 2009 public appearance. It has exactly two local milestones.
2. No other checked-in research batch owns `version-macos-10-6`; the generator verifies sole ownership before writing this bundle.
3. Apple's June 9, 2008 page is explicitly a developer preview. It documents the development trail but does not establish a beta build, beta release-notes page, or public event.
4. Apple's June 8, 2009 page planned a September release. The August 24 page supersedes that schedule and establishes August 28 as the public-sale date.
5. Snow Leopard launched through retail, authorized-reseller, and online-preorder channels with DVD installation media. The record does not mischaracterize this as a modern phased or over-the-air rollout.
6. The June and August pages state different Mail, Time Machine, and recovered-space figures. Structured changes use the final August values and preserve June's figures only as superseded context.
7. Apple's June page announced VoiceOver trackpad integration plus wireless and multiple braille-display support. The August 2009 VPAT supports the VoiceOver/gesture record but does not repeat the specific braille statements, so only the former becomes a structured change.
8. The historical product name is Mac OS X Snow Leopard. The local information architecture groups the release under the `macOS` platform family while preserving Apple's contemporaneous naming in editorial prose.

## Source ledger

All 6 declared sources are human-readable first-party Apple materials checked on 2026-07-30; all 6 are cited by the bundle.

- <https://support.apple.com/en-us/104189> — archived 2008–2009 security chronology and the later 10.6.1/10.6.2 boundary
- <https://www.apple.com/newsroom/2008/06/09Apple-Previews-Mac-OS-X-Snow-Leopard-to-Developers/> — June 2008 developer preview and planned technical direction
- <https://www.apple.com/newsroom/2009/06/08Apple-Unveils-Mac-OS-X-Snow-Leopard/> — June 2009 planned availability, pre-release figures, and accessibility announcement
- <https://www.apple.com/newsroom/2009/08/24Apple-to-Ship-Mac-OS-X-Snow-Leopard-on-August-28/> — August 2009 public availability, shipped scope, distribution, compatibility, and final performance figures
- <https://support.apple.com/en-us/112591> — retained 10.6 general, hardware, service, and feature-specific requirements
- <https://www.apple.com/accessibility/pdf/Mac_OS_X_10.6_Snow_Leopard_VPAT.pdf> — August 2009 10.6 accessibility record for VoiceOver and supported trackpad gestures

Apple Support pages are archived or living documents and can display revision dates much later than the historical release. Mapping therefore uses the explicitly labeled version and release lines plus dated Newsroom pages, not a current page-revision timestamp.

## Known gaps and anomalies

1. Apple's archived security index does not list Mac OS X 10.6 as an August 28 security release. It first lists 10.6.1 on September 10 and 10.6.2 on November 2.
2. No surviving first-party, launch-specific 10.6 CVE advisory was found, so no launch security-fix group is inferred.
3. The security index documents 10.6.1 and 10.6.2, but neither point version has an existing local `releaseVersion` route. This bundle creates neither and imports no later change.
4. Apple's launch performance figures come from prerelease vendor testing with stated variability. They remain qualified Apple claims rather than independent benchmarks or guarantees.
5. The general 10.6 installation baseline did not guarantee every feature. OpenCL, 64-bit support, GCD, QuickTime capture and acceleration, Time Machine, and Exchange each had narrower hardware, peripheral, storage, or server requirements.
6. Apple's June accessibility announcement says Snow Leopard introduced wireless Bluetooth braille-display support and multiple braille-display connections, but the retained August VPAT does not repeat those specifics. They remain attributed context, not a structured launch delta.
7. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
8. Mac OS X Server Snow Leopard went on sale the same day as a separate product. Its server-only features are excluded from this client 10.6 route.

## Validation

- Research-batch validation passed with 1 version, 1 public event, 19 globally consistent change keys, 6 sources, and 79 citation references for this file. The full validator passed 37 batches with 1,995 globally consistent keys.
- Inventory closure passed and is enforced inside the generator: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, 6 of 6 declared sources cited, sole batch ownership, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 24 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 5 source documents, zero version documents, zero event documents, zero build documents, and 19 change documents.
- The guarded patches target the existing Snow Leopard public event, the existing Snow Leopard version article, and author/topics on the already-present 2008–2009 security-index source. No chronology or identity field is changed.
- Mutation payload: 76,284 bytes, reported as 2.0% of the guarded limit.
- Approved production plan SHA:
  `7d6dccc56765b16fdd862600de1c0d309246135f782b993753d627ae0673c349`.
- Bundle JSON SHA-256: `16ce1c8ccb9fe1876711ceb7029da31dd140c74cb2b82389204c7450e4604aa8`.
- Production apply committed and zero-residual verified in transaction
  `F0eE6eK5XyVXtlnaoxz88z`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,108 unchanged
  documents. Its plan SHA is
  `f4f46e4c860a532d8a1f13613c3b5fd9ec57558ccede65dfd12ce03d2122c37f`.
- The representative local route `/apple/macos/10.6` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at `2026-07-30T05:59:50Z`.
