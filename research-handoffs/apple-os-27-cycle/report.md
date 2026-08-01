# Apple 27.0 cross-platform prerelease cycle research handoff

Status: readyForEditorialReview
Researcher: research-agent-os27-cycle
Evidence reviewer: evidence-reviewer-os27-cycle
Assignment SHA-256: 890d2b4228d30b92682f32732197b75bbae92cbaf89c04611bd408d6a1ffecf4
Findings SHA-256: 23d8fef0be84f7fc66ff21cffa76d231834fd0c3895c0acde8d28efc1ddceab0 (was 4942d4b81cb065c4334e9a428d752fab1c5efff171342a115fa27b8580b578ef before evidence review; the reviewer changed only `batch.status`, `batch.evidenceReviewer`, `batch.completedAt` and `qualityChecks`, leaving all target content, claims, occurrences, citations and sources untouched)
Evidence directory: tmp/research-evidence/apple-os-27-cycle/

The first developer and public beta cycle of Apple 27.0 across all six platforms (iOS, iPadOS, macOS Golden Gate, watchOS, tvOS, visionOS), covering 18 assigned appearances dated 2026-06-08 through 2026-07-20. Deliberate cross-platform grouping: these appearances share one WWDC announcement cycle and overlapping contemporaneous sources.

## Scope closure

| Target | Outcome | Recommendation | Claims | Occurrences | Gaps |
| ------ | ------- | --------------- | -----: | ----------: | ---- |
| iOS 27.0 Public Beta 1 (2026-07-13) | complete | fullArticle | 6 | 1 | 2 |
| iOS 27.0 Beta 4 (2026-07-20) | complete | fullArticle | 6 | 10 | 2 |
| iPadOS 27.0 Public Beta 1 (2026-07-13) | partial | sourceLinked | 4 | 1 | 1 |
| iPadOS 27.0 Beta 3 v2 (2026-07-13) | complete | fullArticle | 3 | 1 | 2 |
| iPadOS 27.0 Beta 4 (2026-07-20) | complete | fullArticle | 3 | 5 | 1 |
| macOS 27.0 Beta 1 (2026-06-08) | complete | fullArticle | 4 | 2 | 1 |
| macOS 27.0 Beta 3 v2 (2026-07-13) | complete | fullArticle | 3 | 1 | 2 |
| macOS 27.0 Beta 4 (2026-07-20) | complete | fullArticle | 2 | 6 | 2 |
| watchOS 27.0 Beta 1 (2026-06-08) | complete | fullArticle | 3 | 1 | 1 |
| watchOS 27.0 Beta 3 (2026-07-06) | partial | sourceLinked | 4 | 0 | 2 |
| watchOS 27.0 Beta 4 (2026-07-20) | complete | fullArticle | 2 | 5 | 1 |
| tvOS 27.0 Beta 1 (2026-06-08) | partial | sourceLinked | 3 | 0 | 1 |
| tvOS 27.0 Beta 3 (2026-07-06) | partial | sourceLinked | 3 | 0 | 2 |
| tvOS 27.0 Beta 4 (2026-07-20) | complete | fullArticle | 2 | 6 | 1 |
| visionOS 27.0 Beta 1 (2026-06-08) | complete | fullArticle | 2 | 2 | 1 |
| visionOS 27.0 Beta 2 (2026-06-22) | complete | fullArticle | 2 | 2 | 1 |
| visionOS 27.0 Beta 3 (2026-07-06) | partial | sourceLinked | 3 | 0 | 2 |
| visionOS 27.0 Beta 4 (2026-07-20) | complete | fullArticle | 3 | 6 | 1 |

Totals: 13 complete, 5 partial, 0 noSubstantiveNotesFound, 0 blocked. 28 sources, 23 concepts.

## What page builders can safely say

Representative high-confidence, cited facts across the batch (see findings.json for the complete set):

- **iOS 27.0 Public Beta 1**: iOS 27 left developer-only distribution on this date and became installable by anyone enrolled in Apple's public beta programme. The change was to who could obtain the release, not to what the release contained.
- **iOS 27.0 Beta 4**: A setting appeared in the television app that downloads the next couple of episodes of a series the viewer is working through, then clears them once they have been watched, so playback continues without waiting on a connection.
- **iPadOS 27.0 Beta 3 v2**: The third iPadOS 27 developer beta was replaced by a higher build one week after the original, keeping the same beta number. Apple gave no reason, and no difference in behaviour between the two builds has been established.
- **iPadOS 27.0 Beta 4**: The health framework at this seed records support for heart rate and cycling power training zones, alongside a revised permissions flow offering limited or full history access and new sample types covering menopausal state.
- **macOS 27.0 Beta 1**: Machines set to a relaxed startup security policy could not install this first seed. The vendor's release notes name this beta specifically when recording the condition, and by the time the notes were reviewed it had been resolved.
- **macOS 27.0 Beta 3 v2**: The third macOS 27 Golden Gate developer beta was replaced by a higher build a week after the original, keeping the same beta number. The reissue covered only this platform and iPadOS, and no reason was published.
- **macOS 27.0 Beta 4**: At this seed the notes record that the Intel translation layer is no longer reinstated automatically after upgrading, that applications previously forced through translation now launch natively, that installer packages without an architecture declaration default to the native one, and that system settings surfaces Intel software which will not run on the following major release. All Intel software except legacy games is stated to be incompatible with that next release.
- **watchOS 27.0 Beta 1**: The cycle's headline assistant was not in this first watch seed. On the day of the announcement Apple named four other systems as having it available for developer testing and said the watch would receive it in a later beta of the same cycle. The assistant did arrive on the watch before the fourth beta, where the release notes record fixes to it.
- **watchOS 27.0 Beta 4**: By this seed the rebuilt assistant was present on the watch, closing the deferral Apple had announced at the start of the cycle. The release notes record assistant fixes specific to this platform, including one about actions failing for English speakers outside the United States, and another about announcements during workouts when the assistant is enabled on the paired phone.
- **tvOS 27.0 Beta 4**: The notes at this seed record that management, enrollment, profile, application installation and update processes require servers to meet a raised transport-security floor.

## Recurring concepts and histories

- **concept-network-security-tls-hardening** (security, 6 occurrences): Stricter transport security for system management processes
- **concept-siri-ai-assistant** (feature, 5 occurrences): Siri AI assistant
- **concept-siri-ai-developer-testing-scope** (behavior, 4 occurrences): Siri AI developer-testing availability by platform
- **concept-storekit-volume-purchase-and-bundles** (developerApi, 4 occurrences): Commerce API support for volume purchases and subscription bundles
- **concept-swiftui-document-protocols** (developerApi, 4 occurrences): Asynchronous document protocols replace the older file-document protocol
- **concept-on-demand-resources-deprecated** (removal, 3 occurrences): On Demand Resources deprecated in favour of Background Assets
- **concept-background-assets-localized-packs** (developerApi, 2 occurrences): Localized asset packs for on-demand app content
- **concept-uikit-scene-lifecycle-required** (compatibility, 2 occurrences): Scene-based application lifecycle becomes mandatory
- **concept-visionos-gaze-siri-activation** (feature, 2 occurrences): Activating the assistant by looking at its orb
- **concept-visionos-mesh-compression-incompatibility** (compatibility, 2 occurrences): Mesh compression incompatibility across an early seed boundary
- **concept-healthkit-heart-rate-and-cycling-power-zones** (developerApi, 2 occurrences): Heart rate and cycling power training zones in the health store
- **concept-public-beta-channel-opens** (other, 2 occurrences): Public beta channel opens for a release cycle
- **concept-beta-respin** (other, 2 occurrences): Revised build replacing an earlier same-numbered seed

All 23 concepts are defined in findings.json.concepts with full canonical summaries and citations.

## Source ledger

| ID | Class | Publisher | Published | Selected-text bytes | Role |
| --- | ----- | --------- | --------- | -------------------: | ---- |
| source-001 | firstPartyDocumentation | Apple Developer | unknown | 2302 | releaseIdentity, buildNumbers |
| source-002 | firstPartyDocumentation | Apple Developer | unknown | 2569 | releaseIdentity, buildNumbers, publicationTiming |
| source-003 | firstPartyDocumentation | Apple Developer Documentation | unknown | 14392 | releaseNotes, knownIssues, deprecations |
| source-004 | firstPartyDocumentation | Apple Developer Documentation | unknown | 16009 | releaseNotes, knownIssues, deprecations, productNaming |
| source-005 | firstPartyDocumentation | Apple Developer Documentation | unknown | 6862 | releaseNotes, knownIssues, deprecations |
| source-006 | firstPartyDocumentation | Apple Developer Documentation | unknown | 12570 | releaseNotes, knownIssues, deprecations, betaBoundaryEvidence |
| source-007 | firstPartyDocumentation | Apple Developer Documentation | unknown | 7980 | releaseNotes, knownIssues, deprecations, betaBoundaryEvidence |
| source-008 | firstPartyAnnouncement | Apple Newsroom | 2026-06-08 | 5278 | announcement, availabilityQualifications, deviceAndRegionScope |
| source-009 | firstPartyAnnouncement | Apple | unknown | 5227 | versionPreview, availabilityQualifications |
| source-010 | firstPartyAnnouncement | Apple | unknown | 5961 | versionPreview, availabilityQualifications |
| source-011 | firstPartyAnnouncement | Apple | unknown | 4904 | versionPreview, availabilityQualifications, productNaming |
| source-012 | firstPartyAnnouncement | Apple | unknown | 4317 | versionPreview, availabilityQualifications, deviceCompatibility |
| source-013 | firstPartyAnnouncement | Apple | unknown | 4823 | versionPreview, availabilityQualifications |
| source-014 | journalism | MacRumors | 2026-06-08 | 1280 | releaseIdentity |
| source-015 | journalism | MacRumors | 2026-06-22 | 1592 | releaseIdentity |
| source-016 | journalism | MacRumors | 2026-06-22 | 1478 | cadenceContext |
| source-017 | journalism | MacRumors | 2026-07-06 | 2112 | releaseIdentity |
| source-018 | journalism | MacRumors | 2026-07-06 | 1404 | releaseIdentity, versionContext |
| source-019 | journalism | MacRumors | 2026-07-06 | 1663 | releaseIdentity, versionContext |
| source-020 | journalism | 9to5Mac | 2026-07-06 | 1508 | releaseIdentity |
| source-021 | journalism | 9to5Mac | 2026-07-06 | 1959 | predecessorBuildContext |
| source-022 | journalism | MacRumors | 2026-07-13 | 1829 | releaseIdentity, channelEvidence, payloadEquivalence |
| source-023 | journalism | MacRumors | 2026-07-13 | 1730 | cadenceContext |
| source-024 | journalism | 9to5Mac | 2026-07-13 | 1765 | releaseIdentity, buildNumbers, revisionEvidence |
| source-025 | journalism | AppleInsider | 2026-07-13 | 2328 | releaseIdentity, buildNumbers, revisionEvidence, supersededBuilds |
| source-026 | journalism | 9to5Mac | 2026-07-20 | 2252 | betaDeltas |
| source-027 | journalism | MacRumors | 2026-07-20 | 2731 | betaDeltas, removalEvidence |
| source-028 | journalism | 9to5Mac | 2026-07-20 | 1859 | releaseIdentity, buildNumbers, negativeEvidence |

All captures were automated HTTPS fetches of rendered text (or, for the five Apple Developer Documentation release-notes pages, of the public documentation JSON endpoint those client-rendered pages consume) rather than browser-saved HTML snapshots. No raw HTML was retained for any source in this batch — see batch-gap-capture-method below and `qualityChecks.rawHashesReproduced: false` in findings.json, which is by design, not a defect: only selected-text paths, byte counts, and SHA-256 hashes exist.

## Conflicts and decisions

### disagreement-001

**Topic:** The build number of iOS 27 beta 4, released 2026-07-20.

- The build is 24A5390f. (source-001, source-002)
- The build is 23G71. (source-026)

**Recommended boundary:** Use 24A5390f. Apple's own release listing and feed both carry it for this appearance, and the same feed assigns 23G71 to iOS 26.6 released 2026-07-27, so the secondary value belongs to a different release in a different version line. Do not publish 23G71 for this appearance, and do not present the discrepancy as a genuine open question.

**Requires chronology review:** false

### disagreement-002

**Topic:** Which Apple Vision Pro hardware supports the intelligence features in visionOS 27.

- Apple Vision Pro, with no chip qualifier. (source-008)
- Apple Vision Pro with M2 and later. (source-009, source-011, source-012, source-013)

**Recommended boundary:** Prefer the narrower wording naming the M2 chip and later. Both are first-party, but the version preview pages state the qualifier explicitly and four of them agree, while the announcement's list is more compact. Note that the shared footnote across the preview pages is one lineage and should not be counted as four independent sources; it is preferred for specificity, not for weight of numbers.

**Requires chronology review:** false

### disagreement-003

**Topic:** Whether watchOS 27 beta 3 was available for the newest Apple Watch Ultra model.

- The seed was available for all compatible models except the newest Ultra. (source-017)
- The seed was available for that model; Apple lists it among supported devices for the version. (source-017, source-012)

**Recommended boundary:** Do not publish the exclusion. The claim and its contradiction sit on the same page, where the top-rated reader comments say the statement is outdated, and Apple's own compatibility list includes the model among those supported by the version. The narrow permitted conclusion is that one article briefly stated an exclusion that was contested at the time. Apple's list is version-level and does not by itself prove per-seed availability.

**Requires chronology review:** false

### disagreement-004

**Topic:** The build number of the original macOS 27 beta 3 that the 2026-07-13 revision replaced.

- The original build was 26A5378j. (source-021)
- The revision replaced 26A5368g. (source-025)

**Recommended boundary:** State no predecessor build, or state that contemporaneous reports conflict. Both sources are secondary, neither string appeared in Apple's listing at access time, and the two values differ in a way that cannot be reconciled as a typographic slip. This does not affect the revised build itself, which two independent sources agree is 26A5378n. The original macOS beta 3 is not an assigned target, so this conflict is context rather than a blocker.

**Requires chronology review:** false

### disagreement-005

**Topic:** The trailing character of the iPadOS 27 beta 3 revised build identifier.

- The build ends in a lowercase letter L: 24A5380l. (source-024)
- The build ends in a capital letter I: 24A5380I. (source-025)

**Recommended boundary:** Use the lowercase form. Apple build identifiers use lowercase suffix letters, the assignment and current production both use the lowercase form, and the two renderings are visually near-identical in most typefaces. Treat this as glyph confusion in one publication rather than a genuine build conflict, and do not surface it to readers.

**Requires chronology review:** false

### disagreement-006

**Topic:** Which iPadOS build the first public beta of 2026-07-13 carried.

- The public beta was identical to the third developer beta. (source-022)
- Every OS other than iPadOS and macOS kept its beta 3 build for the public beta, implying iPadOS did not. (source-025)

**Recommended boundary:** Leave unresolved on the iPadOS public beta page and publish no build for it. The two statements are not flatly contradictory, since the revised build is still a beta 3 build, but together they leave it genuinely unclear whether public testers received the original or the revision on iPadOS. This ambiguity is specific to iPadOS and macOS; it does not affect the iOS public beta, where both sources agree the beta 3 build was retained. This is the reason the iPadOS public beta target is recommended as source-linked rather than a full article.

**Requires chronology review:** false

### disagreement-007-missing-public-beta-appearances

**Topic:** Whether the 27.0 cycle is missing public beta appearances for macOS, watchOS and tvOS on 2026-07-13.

- Contemporaneous reporting establishes that macOS 27 Golden Gate entered public beta on 2026-07-13, under a dedicated article headlined on that release, and that watchOS 27 and tvOS 27 public betas were issued the same day carrying their existing beta 3 builds. (source-023, source-025)
- Apple announced that a public beta would open through the Apple Beta Software Program in the month after the developer release, without limiting that programme to the phone and tablet platforms. (source-008)
- The assignment and the master register contain publicBeta targets for 2026-07-13 on iOS and iPadOS only. No publicBeta appearance exists anywhere in the register for macOS, watchOS or tvOS in the 27.0 cycle, and none was added by this batch.

**Recommended boundary:** Every assigned identity was left exactly as assigned and no target was added, renamed or moved. Three observations should guide the coordinator. First, the project already models a same-day public beta as its own event rather than folding it into the developer seed: iOS and iPadOS each hold a separate 2026-07-13 publicBeta event under a hash-suffixed stable event identifier, alongside a developer seed for the same date in the iPadOS case. Second, the 27.0 stable event identifiers are otherwise wave-indexed, with m0 for 2026-06-08, m1 for 2026-06-22, m2 for 2026-07-06, m3 for 2026-07-13 and m4 for 2026-07-20; on macOS and iPadOS the m3 slot is already occupied by the revised developer beta, so a macOS public beta could not occupy it and would need its own event exactly as iPadOS does. Third, the register is the incomplete backlog rather than the full chronology, so absence from it is not proof that production lacks these events, since they could exist and already be complete. That caveat is weaker than usual here because all eighteen 27.0 events in the register are incomplete, which makes it unlikely that sibling public beta events for the same cycle are already finished. The coordinator should confirm against production whether macOS, watchOS and tvOS 27.0 public beta appearances exist, and open targets only if they do not. No page in this batch claims these appearances, and the 27.0 cycle should not be described as a complete chronology until the coordinator rules. A related question worth settling at the same time is whether public betas are modelled for non-phone platforms at all: across all 1393 backlog targets spanning 2017 to 2026, the publicBeta channel appears only on iOS and iPadOS, which may be a deliberate editorial convention rather than an omission.

**Requires chronology review:** true

## Negative findings

- **iOS 27.0 Public Beta 1** — Does Apple's developer release index or its feed record an iOS 27 public beta entry, or any entry at all, dated 13 July 2026? Neither the index nor the feed contained any entry dated 13 July 2026 at access time on 2026-07-30. The index held 43 entries spanning 6 October 2025 to 27 July 2026, and the feed jumped from 29 June to 15 July to 20 July. *(This describes the two Apple listings as they stood on one day. It does not establish that Apple never published such an entry, and it is unsurprising for a developer-channel listing not to carry public beta seeds. Identity for this appearance rests on contemporaneous reporting.)*
- **iOS 27.0 Public Beta 1** — Do the iOS and iPadOS 27 release notes document anything specific to the public beta? The document is a living developer release-notes page whose title had advanced to Beta 4 by access time. It is organised by framework and contains no public beta section and no entry naming the public beta. *(Establishes only that this vendor document does not separately describe the public beta appearance. It says nothing about what the public beta contained beyond the payload equivalence established by reporting.)*
- **iOS 27.0 Beta 4** — Do the vendor's iOS and iPadOS 27 release notes attribute any of the separately reported beta 4 behaviours, such as the television download setting or the photo zoom setting, to this seed? The reviewed document contains framework sections covering Photos and related areas, but none of the reviewed entries describe the television app download setting or a photo zoom-to-fill setting, and the document does not attribute changes to individual betas except in a small number of entries that name a beta explicitly. *(Establishes that these behaviours are undocumented within this specific vendor document as it stood on 2026-07-30. It does not establish that Apple never documented them elsewhere, nor does it weaken the two independent reports.)*
- **iPadOS 27.0 Public Beta 1** — Is there a source that states the build number of the iPadOS 27 public beta, or that resolves whether it carried the original or the revised third beta? None of the reviewed sources states a public beta build for iPadOS. The two articles covering the revised builds discuss the developer channel only. Apple's developer index and feed carry no entry for this date. *(Establishes that the reviewed evidence does not settle the question. It does not establish that the two builds differed in content, nor that Apple never published the answer.)*
- **iPadOS 27.0 Beta 3 v2** — Does Apple's developer release index, feed, or the iOS and iPadOS 27 release notes record this revised build or explain the reissue? Neither the index nor the feed contained the string 24A5380l or any entry dated 13 July 2026 at access time. The release-notes document, reviewed at its beta 4 state, contains no entry describing a revised third beta. *(Describes three Apple surfaces as they stood on 2026-07-30. It does not establish that Apple never listed the build, and it is consistent with the two publishers' independent statement that the documentation did not explain the reissue.)*
- **iPadOS 27.0 Beta 4** — Is there contemporaneous reporting describing changes specific to iPadOS in the fourth beta? The two detailed fourth-beta change articles are written about iPhone, and one states outright that iPadOS beta 4 is not covered. No iPad-specific fourth-beta change article was located. *(Establishes that this batch located no iPad-specific change reporting for this seed. It does not establish that iPadOS received no changes, only that none are evidenced here.)*
- **macOS 27.0 Beta 1** — Do the macOS 27 release notes establish which features were new in the first beta? The document had advanced to its fourth-beta title by access time and is organised by framework rather than by seed. Only one reviewed entry, under Software Update, names the first beta at all. *(Establishes that this document cannot be used as a first-beta changelog, and identifies the single entry that can be scoped to this seed. It says nothing about what the first beta contained beyond that entry.)*
- **macOS 27.0 Beta 1** — Does the contemporaneous first-beta reporting attribute any specific feature to macOS at this seed? The article names the six platforms and describes the wave in general terms, stating that detailed coverage would follow. It attributes no distinct feature to macOS. *(Establishes only that this article is an announcement rather than a change list.)*
- **macOS 27.0 Beta 3 v2** — Does Apple's developer release index, feed, or the macOS 27 release notes record this revised build or explain the reissue? Neither the index nor the feed contained the string 26A5378n, nor either disputed predecessor string, nor any entry dated 13 July 2026 at access time. The release notes, reviewed at their beta 4 state, contain no entry describing a revised third beta. *(Describes three Apple surfaces on a single day. It does not establish that Apple never listed the build, and it matches both publishers' independent statement that the documentation did not explain the reissue.)*
- **macOS 27.0 Beta 4** — Did any contemporaneous article identify a change specific to the fourth macOS beta? The one article located for this seed states the correct build and date, but attributes no change to beta 4. Its body recaps version-level features and discusses what the previous seed had done. It contains nothing about photo handling, visual intelligence, displays or performance in this seed. *(Establishes that no beta-4-specific macOS change was reported in this article. It does not establish that the seed contained no changes, only that none are evidenced here.)*
- **macOS 27.0 Beta 4** — Do production's macOS preview citations for Photos and for performance and displays resolve to headings on the vendor's version page? Neither exists as a top-level heading. Photo editing appears within the Apple Intelligence in apps section, performance within OS improvements, and ultrawide display support within the closing feature list. *(The underlying facts are supportable from the page; only the locators are wrong. This is a citation-precision finding, not a factual contradiction.)*
- **watchOS 27.0 Beta 1** — Do the watchOS 27 release notes establish what was new in the first beta? The document had advanced to its fourth-beta title by access time and is organised by framework. The only entries naming an early seed refer to the second beta, not the first. *(Establishes that this document cannot serve as a first-beta changelog and that no reviewed entry is scoped to the first seed.)*
- **watchOS 27.0 Beta 3** — Is there a second independent source for a watchOS 27 beta 3 on 6 July 2026? The independent article covering that day's beta 3 wave names iPadOS, tvOS and visionOS, with iOS and macOS in context, but does not name watchOS. Apple's developer index and feed carry no entry for the date. *(Establishes that this batch located only one source naming a watchOS beta 3 on that date. It does not establish that the seed did not ship; the single source is a bylined article from an established publisher.)*
- **watchOS 27.0 Beta 4** — Did production previously cite any watch developer release-notes document for this or any other watchOS 27 target? The assignment's record of existing citations for all three watchOS targets lists only the version preview page, the announcement post and the developer release index. No watch release-notes document appears. *(Establishes a coverage gap in the existing citations that this batch fills. It says nothing about whether the document existed earlier.)*
- **tvOS 27.0 Beta 1** — Do the tvOS 27 release notes contain any entry scoped to an individual beta, as the visionOS, watchOS, macOS and combined phone and tablet documents do? No reviewed section of the television release notes names a specific beta. This is the only one of the five platform release-notes documents reviewed in this batch that carries no beta-specific marker at all. *(Establishes that this document provides no basis for dating any entry to a particular seed on this platform. It says nothing about what the first seed contained.)*
- **tvOS 27.0 Beta 1** — Does the announcement extend the assistant or the wider intelligence features to the television platform? The television system is named among the announced releases, but every availability bullet covering the assistant, supported devices, supported languages and regional exclusions enumerates only the other five systems. *(Establishes what the announcement's availability text does and does not cover. It is not evidence that the features were technically absent, only that Apple did not claim them for this platform.)*
- **tvOS 27.0 Beta 3** — Does either article covering the 6 July 2026 beta 3 wave attribute a change to the television seed? Neither does. The platform-specific article lists version-level television features and characterises the release as modest overall; the wave article explicitly describes no feature changes and offers only general commentary about third betas. *(Establishes that no change was reported for this seed in the two articles read. It does not establish that the seed changed nothing.)*
- **tvOS 27.0 Beta 4** — Does the television release notes document name any specific beta anywhere, allowing a change to be dated to a seed? No reviewed section names a beta. Of the five platform release-notes documents read in this batch, this is the only one with no beta-specific entry. *(Establishes that this document supports only accumulated state for this platform, never a per-seed delta.)*
- **visionOS 27.0 Beta 1** — Beyond the mesh compression entry, do the headset release notes contain any other entry scoped to the first beta? The only reviewed entries naming an early seed are the mesh compression deprecation, which names the first and second betas, and an assistant entry that names the second beta. No other reviewed entry is scoped to the first seed. *(Establishes which entries in this document can be dated to this seed. It says nothing about the seed's wider contents.)*
- **visionOS 27.0 Beta 2** — Does the contemporaneous article covering this seed attribute any feature or change to the second beta specifically? It does not. Every feature it names, including the assistant, curved windows, panorama environments, the new Icelandic environment, browser environments, control centre changes, the smaller widget size and automatic notification expansion, is presented as a feature of the version rather than as an addition in this seed. *(Establishes that no seed-scoped change comes from this article, which is why both occurrences on this target are drawn from first-party documentation instead. It does not establish that the seed changed nothing else.)*
- **visionOS 27.0 Beta 3** — Do the headset release notes name the third beta anywhere, as they do the first and second? No reviewed entry names the third beta. The only beta-scoped entries name the first and second. *(Establishes that this document offers no basis for dating a change to the third seed, in contrast to the second.)*
- **visionOS 27.0 Beta 3** — Does either article covering the 6 July 2026 wave attribute a change to the headset seed? Neither does. The platform article lists version-level features and explicitly contains no mention of visual intelligence or a three-dimensional assistant visualisation beyond the orb placement it describes at version level. The wave article describes no feature changes at all. *(Establishes that no seed-scoped change was reported in the two articles read.)*
- **visionOS 27.0 Beta 4** — Do the headset release notes contain a section named for the spatial Mac capability that production cites for this target? No section of that name exists in the release notes; the nearest related sections are a spatial preview section and a virtual display section. The phrase does appear on the vendor's version preview page, in its overview list, with the underlying capability described in the spatial experiences section. *(Establishes where that citation can and cannot resolve. Production cites the preview page for it, which is correct; it must not be re-pointed at the release notes.)*

## Evidence gaps

### Batch level

- **batch-gap-mid-cycle-absent-from-vendor-listing** [material]: Apple's developer release index and its feed, checked on 2026-07-30, contained no entries at all for 2026-06-22, 2026-07-06 or 2026-07-13. The index held 43 entries spanning 6 October 2025 to 27 July 2026 and jumped from the 8 June wave straight to later June items and then to 20 July. Targeted queries for seven candidate mid-cycle build strings all returned no match. Consequently eight of the eighteen targets have no first-party identity source and rest on contemporaneous reporting.
- **batch-gap-living-documents-cannot-date-changes** [material]: All five platform release-notes documents are living pages whose titles had advanced to the fourth beta by the time they were read, and all five platform preview pages are living marketing pages describing the version's shipping intent. Neither class can establish what a particular earlier seed contained. Only nine entries across the whole batch name a specific beta, and they are concentrated in the headset, watch, desktop and combined phone and tablet documents; the television document names none.
- **batch-gap-capture-method** [nonMaterial]: Every source in this batch was captured by automated fetch of rendered text rather than as a browser-saved page. For the five developer documentation pages the text was read from the public documentation JSON that each page's own renderer consumes, because those pages are client-rendered single-page applications that return only a title to a plain fetch. No raw HTML snapshots were retained, so only selected-text paths, byte counts and hashes are recorded, and the raw fields are null throughout.
- **batch-gap-production-locator-precision** [nonMaterial]: Several citations already live in production point at headings that do not exist on the pages they name. The macOS preview page has no Photos heading and no performance and displays heading; the iPadOS preview page has no standalone Visual Intelligence heading; the television release notes use HomeKit rather than Home and Network Security rather than a combined networking and security heading. In each case the underlying fact is supportable from the page, only the locator is imprecise.
- **batch-gap-cross-platform-concept-reconciliation** [nonMaterial]: Because this batch spans six platforms in one release cycle, several concepts recur across many targets, notably the transport-security hardening, the document protocols, the resource deprecation, the commerce additions and the assistant itself. These are modelled as single shared concepts rather than per-platform duplicates.
- **batch-gap-public-beta-appearances-not-modelled** [material]: Evidence retained in this batch shows macOS 27 entered public beta on 2026-07-13, and that watchOS 27 and tvOS 27 public betas were issued the same day, but no publicBeta target exists for those three platforms in the 27.0 cycle. Only iOS and iPadOS hold public beta events for that date.

### Target level

- **iOS 27.0 Public Beta 1 / gap-ios-pb1-build** [nonMaterial]: No build number was located for the iOS 27 public beta. Both articles read for this date state none, and Apple's developer listing does not carry the appearance.
- **iOS 27.0 Public Beta 1 / gap-ios-pb1-wallpaper-animation-single-sourced** [nonMaterial]: The Notification Centre wallpaper animation is attested by one publisher only and is absent from the vendor release notes, so it does not meet the packet's bar for an undocumented change occurrence.
- **iOS 27.0 Beta 4 / gap-ios-b4-conflicting-build-in-secondary-source** [nonMaterial]: One of the two beta 4 articles states a build string for this seed that belongs to a different release in a different version line.
- **iOS 27.0 Beta 4 / gap-ios-b4-single-sourced-items** [nonMaterial]: Several reported beta 4 behaviours, including the assistant transcription accessibility setting, a per-network connectivity toggle and the wallpaper animation removal, appear in only one of the two articles.
- **iPadOS 27.0 Public Beta 1 / gap-ipados-pb1-which-build** [material]: It is not established whether the iPadOS public beta carried the original third developer beta or the revised build issued the same day.
- **iPadOS 27.0 Beta 3 v2 / gap-ipados-b3v2-no-first-party-record** [material]: No first-party record of this appearance was located, so both the identity and the build rest entirely on secondary reporting. Production currently cites Apple Developer as the source for this build, and that locator did not resolve at access time.
- **iPadOS 27.0 Beta 3 v2 / gap-ipados-b3v2-no-content-difference** [nonMaterial]: No source establishes any behavioural difference between the original third beta and its revision.
- **iPadOS 27.0 Beta 4 / gap-ipados-b4-no-ipad-deltas** [nonMaterial]: No change can be attributed specifically to iPadOS in this seed; all substantive content is accumulated release-notes state.
- **macOS 27.0 Beta 1 / gap-macos-b1-no-per-seed-changelog** [nonMaterial]: No per-seed change list exists for the first macOS beta; the vendor documentation is accumulated and the contemporaneous reporting is an announcement.
- **macOS 27.0 Beta 3 v2 / gap-macos-b3v2-no-first-party-record** [material]: No first-party record of this appearance was located, so identity and build rest entirely on secondary reporting. Production currently cites Apple Developer for this build and that locator did not resolve at access time.
- **macOS 27.0 Beta 3 v2 / gap-macos-b3v2-predecessor-build-conflict** [nonMaterial]: Two outlets give different builds for the original third beta that this reissue replaced.
- **macOS 27.0 Beta 4 / gap-macos-b4-no-seed-specific-changes** [nonMaterial]: No change was attributable specifically to this seed from any located source.
- **macOS 27.0 Beta 4 / gap-macos-b4-preview-locators** [nonMaterial]: Two of production's existing macOS preview citations point at headings that do not exist on the page.
- **watchOS 27.0 Beta 1 / gap-watchos-b1-no-per-seed-content** [nonMaterial]: Beyond the assistant deferral, no content is attributable to this seed.
- **watchOS 27.0 Beta 3 / gap-watchos-b3-single-source-identity** [material]: Identity for this appearance rests on one article, with no first-party listing entry and no corroborating independent report.
- **watchOS 27.0 Beta 3 / gap-watchos-b3-no-build** [material]: No build number was located for this seed from any source that was actually read.
- **watchOS 27.0 Beta 4 / gap-watchos-b4-fix-seed-attribution** [nonMaterial]: The carrier calling entry names the seed on which the failure occurred but not the seed on which it was fixed, so the fix cannot be pinned to this appearance rather than the third beta.
- **tvOS 27.0 Beta 1 / gap-tvos-b1-no-seed-content** [material]: Beyond confirmed identity and build, no content is attributable to this appearance from any located source.
- **tvOS 27.0 Beta 3 / gap-tvos-b3-no-build** [material]: No build number was located for this seed from any source read in full.
- **tvOS 27.0 Beta 3 / gap-tvos-b3-no-seed-content** [material]: No content is attributable to this seed, only to the version.
- **tvOS 27.0 Beta 4 / gap-tvos-b4-no-seed-specific-changes** [nonMaterial]: No change is attributable specifically to this seed; all content is accumulated state.
- **visionOS 27.0 Beta 1 / gap-visionos-b1-limited-seed-content** [nonMaterial]: Only two facts are scoped to this seed; everything else in the release notes is accumulated state at a later beta.
- **visionOS 27.0 Beta 2 / gap-visionos-b2-no-build** [nonMaterial]: No build number was located for this seed from any source read in full.
- **visionOS 27.0 Beta 3 / gap-visionos-b3-no-build** [material]: No build number was located for this seed from any source read in full.
- **visionOS 27.0 Beta 3 / gap-visionos-b3-no-seed-content** [material]: No content is attributable to this seed, only to the version.
- **visionOS 27.0 Beta 4 / gap-visionos-b4-no-seed-specific-changes** [nonMaterial]: No change is attributable specifically to this seed; all content is accumulated state, and no contemporaneous headset article for this date was located.

## Excluded sources

- https://en.wikipedia.org/wiki/IOS_27 — Encyclopaedia entry. Excluded by the handoff rules, which bar Wikipedia as evidence. Appeared in search results only and was not read or relied on.
- https://en.wikipedia.org/wiki/MacOS_Golden_Gate — Encyclopaedia entry, excluded on the same basis. Apple's own release-notes title and version page title were used for the product name instead.
- https://betawiki.net/wiki/MacOS_Golden_Gate_build_26A5378n — Unsourced community build database. The handoff rules bar unsourced release databases as evidence. The build it names is instead carried from two independent bylined articles.
- https://www.iclarified.com/101388/apple-seeds-third-betas-of-watchos-27-visionos-27-and-tvos-27-to-developers-download — Surfaced in search results carrying build strings for the 6 July 2026 watch, headset and television seeds. Not opened or read in full, so under the handoff rule against creating build findings from search snippets those strings are excluded rather than recorded. This is the single most promising next step for closing the mid-cycle build gaps.
- https://x.com/CocoaDevBlogs/status/2076769733777433033 — Single social post reproducing a release title. Fails the community-source bar in the handoff rules and adds nothing beyond the two independent articles already used for that build.
- https://forums.macrumors.com/threads/macos-golden-gate-27-0-beta-3-release-2-whats-new.2485346/ — Discussion thread. Community speculation about what a revised build changed, with no reproducible verification. Both publisher sources state Apple gave no reason, and the packet records that rather than a forum inference.
- https://www.geeky-gadgets.com/ios-27-beta-4-features-6/ — Recap article without clear original reporting, appearing to restate other outlets' beta 4 change lists. Excluded as duplicate lineage that would inflate corroboration.
- https://tech.yahoo.com/ai/apple-intelligence/articles/ios-27-beta-4-now-103144974.html — Syndicated copy of another outlet's beta 4 coverage. One lineage with its origin publication; using it would double-count a single source.
- https://www.ithinkdiff.com/visionos-27-developer-beta-2/ — Aggregator coverage of the second headset beta without distinct original reporting. The packet uses the bylined contemporaneous article and first-party documentation instead.
- https://ecorpit.com/ios-27-date-timeline-refresh/ — Unsourced aggregated release timeline of exactly the kind the handoff rules exclude. Dates in this packet come from Apple's own listing and bylined contemporaneous reporting.
- https://9to5mac.com/2026/07/20/heres-whats-new-with-ios-27-beta-4/#dual-battery-references — Not a separate source but a deliberately excluded item within source-026 and source-027: inferences about an unreleased folding iPhone drawn from code strings. This is unreleased-hardware speculation, not a software release fact, and it fails the bar for undocumented claims. Recorded here so a reviewer can see the omission was deliberate.

## Validation

- [x] Exact target closure
- [x] Every claim and occurrence cited; all local IDs unique
- [x] Every locator independently resolved
- [x] Source metadata and timestamps checked
- [ ] Raw hashes reproduced — false by design; no raw HTML was retained for any source in this batch (see capture-method gap above), only selected-text hashes exist and those are true
- [x] Recurrence and inheritance reviewed
- [x] Copyright similarity passed (max unquoted overlap: 6 words, corrected from the researcher's recorded 5 by the evidence reviewer; the six-word runs are product, programme and device names used nominatively. The attributed 14-word short quotation appears in two citation objects, not one: on `concept-siri-ai-developer-testing-scope` and on `watchos-27-beta-1-occurrence-siri-ai-deferred`. See the independent evidence review below.)
- [x] JSON parsed and controlled values validated
- [x] No Sanity write, apply, approval, or deployment performed

Researcher self-report only (`qualityChecks.reviewNotes`): "Status is deliberately needsEvidenceReview, not readyForEditorialReview; only an independent evidence reviewer or the coordinator may raise it. Two gates warrant a reviewer's attention. First, rawHashesReproduced is false by design: no raw page snapshots were retained, so raw fields are null throughout and only selected-text paths, byte counts and SHA-256 values exist. Second, undocumentedClaimsMeetHigherEvidenceBar is true only because single-sourced undocumented observations were deliberately kept as claims rather than promoted to occurrences. Three such items were demoted this way: the Notification Centre wallpaper animation on the iOS public beta and beta 4 targets, the assistant transcription accessibility setting, and the disputed watch device-scope statement. Every occurrence marked corroborated has two genuinely independent sources; sources declared non-independent in their lineage notes, namely the release feed against the release index, the two same-author articles of 22 June, and the two same-author articles of 13 July, were never counted twice. The maximum unquoted overlap with source text in reader-facing fields is five normalised words, occurring only in proper nouns and API identifiers such as framework and type names, which cannot be paraphrased without losing accuracy. One deliberate short quotation of fourteen words appears, on the watch beta 1 assistant deferral occurrence, and is attributed to the vendor announcement. Verbatim vendor footnote text is retained only in the ignored evidence directory and is not reproduced in this packet."

Status raised to `readyForEditorialReview` by `evidence-reviewer-os27-cycle` on 2026-07-30 after the independent adversarial review recorded below.

## Note on report authorship

This report.md was synthesized by the coordinator directly from the researcher's completed and self-consistent findings.json (verified: 18/18 target closure, valid JSON, all quality-check gates the researcher could self-certify are true) after the researcher produced findings.json correctly but did not deliver this file across three follow-up requests. No new research, claims, occurrences, or citations were added or altered in findings.json to produce this report — it is a mechanical derivation of what the researcher already recorded. An independent evidence reviewer should still perform the full adversarial review described in docs/research-agent-handoff.md before this packet can be marked readyForEditorialReview.

## Independent evidence review

Reviewer: `evidence-reviewer-os27-cycle` (did not author this packet)
Date: 2026-07-30
Verdict: **PASS — status raised to `readyForEditorialReview`**
Checklist: **13 of 13 applicable gates pass.** Three self-description inaccuracies were found and corrected in `qualityChecks`; none affects a claim, occurrence, citation, source or target.

### Verdict per checklist item

| # | Gate | Result | Evidence |
| -: | ---- | ------ | -------- |
| 1 | Exact target closure | PASS | 18/18 target IDs match `assignment.json` exactly; no additions, drops, renames or moves. All 14 identity fields (platform, version, stableEventId, label, routeAlias, channel, appearanceDate, sequence, isRevision, availabilityState, closesReleaseCycle, releaseVersionId, platformId, platformSlug) compared field-by-field against the assignment: **zero drift**. |
| 2 | All local IDs unique | PASS | 215 IDs across all namespaces (28 sources, 23 concepts, 18 targets, 58 claims, 49 occurrences, 7 disagreements, 32 gaps). No duplicate within a namespace and no cross-namespace collision. |
| 3 | Every citation resolves to a declared source | PASS | 257 citation objects; 0 unresolved `sourceId`; 0 weak or missing locators; 0 missing `supports` notes. Every claim and every occurrence carries at least one citation. All `conceptId` and `disagreementIds` references resolve. |
| 4 | Every declared source used or explained | PASS | 28/28 sources cited at least once (usage range 1–37). No unused source needing explanation. |
| 5 | Every locator resolves against retained evidence | PASS | See locator spot-check below — well past the required minimum, across all six platforms. |
| 6 | Corroborated items have two independent sources | PASS | All 6 `corroborated` occurrences rest on two or more publishers with distinct bylines (MacRumors/Juli Clover, 9to5Mac/Zac Hall, 9to5Mac/Marcus Mendes, AppleInsider/Wesley Hilliard, Apple Newsroom). Lineages declared non-independent — the release feed against the release index, and the same-author article pairs of 22 June and 13 July — are never counted twice. |
| 7 | Confirmed items have direct primary support | PASS | All 42 `confirmed` occurrences cite a first-party or primary artifact. |
| 8 | Undocumented claims meet the stricter bar | PASS | All 5 `undocumented` occurrences carry two genuinely independent contemporaneous outlets. Consistent with the researcher's note, three single-sourced undocumented observations were deliberately held as low-confidence claims rather than promoted to occurrences. |
| 9 | Recurrence and inheritance reviewed | PASS | 13 recurring concepts. 33 `cumulative` vs 15 `delta` vs 1 `inherited` — deltas confined to cases where a vendor document names the seed or contemporaneous reporting attributes the change to it. The single `inherited` occurrence states explicitly that it exists to keep the delta on the beta-2 page and avoid double-counting. |
| 10 | Build/region/device/language qualifications preserved | PASS | Builds sourced only from secondary reporting are marked `reported`, not `confirmed`, and are explicitly declared ineligible for a build document. Carrier, region, emergency-messaging, audience and device-family qualifications are preserved throughout. |
| 11 | Five-word source-overlap limit | PASS in substance; recorded value corrected | See copyright findings below. |
| 12 | No placeholder, secret or raw copyrighted evidence committed | PASS | No secrets, credentials, cookies, tokens, emails or placeholder prose in the committed packet. Evidence directory is git-ignored (`.gitignore:59`) with **0 tracked files under `tmp/`**. |
| 13 | No Sanity write or deployment | PASS | Every script under `tmp/` is a read-only fetch: no `create`, `createOrReplace`, `createIfNotExists`, `patch`, `delete`, `commit`, `transaction` or `mutate` call anywhere. No `scripts/research-batches` manifest added or altered. No commit made. |

### Hashes recomputed

All **28 of 28** selected-text SHA-256 hashes and byte counts were recomputed from disk and reproduce **exactly** — well beyond the 8 required. Sample: `source-001` 2302 B `407342c3…`, `source-003` 14392 B `11e40791…`, `source-004` 16009 B `98076ea0…`, `source-006` 12570 B `401cd632…`, `source-007` 7980 B `6ac2681f…`, `source-008` 5278 B `75d9625a…`, `source-012` 4317 B `2d22477b…`, `source-022` 1829 B `f6ab1ca3…`, `source-023` 1730 B `e36554ef…`, `source-024` 1765 B `8f8e2d99…`, `source-025` 2328 B `c5784c2a…`, `source-026` 2252 B `82da9e5b…`. Zero failures.

**No source declares a raw capture** (`rawPath`, `rawBytes`, `rawSha256` are null throughout), consistent with `rawHashesReproduced: false`. `batch-gap-capture-method` is a **genuine and candid disclosure, not a cover for sloppy evidence handling**: it names the cause (client-rendered documentation pages returning only a title to a plain fetch, read instead from the public documentation JSON the renderer itself consumes), and it states the correct consequence — that locators resolve against the retained extracts rather than live page markup. The extracts were inspected and are structured, provenance-headed condensations of the cited documents, not fabrications: release-notes extracts preserve framework sections in document order with subsection labels, each file carries URL/title/publisher/byline/timestamp/capture-method headers, and marked verbatim blocks are retained only in the ignored evidence directory with an explicit copyright note. The honest limitation, which the gap itself states, is that locator verification is against a researcher-produced extract rather than original markup.

### Locator spot-check

Checked across **six** platforms (requirement: 10–12 across ≥4). All resolved.

- **iOS** (`source-003`): `Network Security > New Features` L119 · `On Demand Resources > Deprecations` L125 · `Background Assets > New Features` L37 · `StoreKit > New Features` L172 · `AirPods Max 2 > Resolved Issues` L23 · `Siri > Resolved Issues` L154 · `SwiftUI > New Features` L186
- **macOS** (`source-004`): `Rosetta > New Features` L145 · `EcosystemUI > New Features` L75 · `Disk Images > New Features` L66 · `DVDPlayback > Deprecations` L73 · `Software Update > Resolved Issues` naming `macOS 27 beta 1` L176–177
- **watchOS** (`source-007`): `Cellular > Resolved Issues` naming the carrier and `watchOS 27.0 beta 2` L19–21 · `HealthKit > New Features` L44 · `Workout Alerts and Workout Buddy > Resolved Issues` L106 · `Network Security > New Features` L45
- **tvOS** (`source-005`): `Background Assets > New Features` L21 · `HomeKit > New Features` L27 · `StoreKit > New Features` L48 · `UIKit > New Features` L86
- **visionOS** (`source-006`): `Siri > New Features` gaze activation naming `Beta 2` L91/L17–18 · `USDKit > Deprecations` mesh compression naming `Beta 1`/`Beta 2` L162/L19–20 · `RealityKit > Resolved Issues` L75
- **iPadOS / cross-platform journalism**: `source-022` headline + `1:39 pm PDT` timestamp · `source-024` `24A5380l` and `26A5378n` paragraphs, `1:53 pm PT` · `source-025` superseded-build paragraph, `5:07 PM EDT` · `source-021` `26A5378j` · `source-017` Ultra 3 exclusion · `source-001`/`source-002` build-listing rows for the six 2026-07-20 beta 4 entries

Independent corroboration of the packet's own arithmetic: the claim in `batch-gap-living-documents-cannot-date-changes` that **exactly nine** entries across the batch name a specific beta reproduces exactly — 1 (iOS/iPadOS) + 0 (tvOS) + 2 (macOS) + 3 (visionOS) + 3 (watchOS) = 9, with the television document naming none, precisely as stated. `batch-gap-production-locator-precision` also verifies: the tvOS document uses `HomeKit` and `Network Security`, not `Home` and a combined networking heading.

### Copyright findings

- **Short quotations.** Exactly **two** citation objects carry a non-null `shortQuote`, both the same attributed 14-word vendor sentence, on `concept-siri-ai-developer-testing-scope` and `watchos-27-beta-1-occurrence-siri-ai-deferred`. Both are within the 15-word limit, both attributed to `source-008` (Apple Newsroom), and the wording was confirmed **verbatim** against the retained extract. The researcher's note that "one deliberate short quotation ... appears" understates the count by describing the quotation rather than its occurrences; corrected in `qualityChecks.evidenceReviewNotes`. No other `shortQuote` field in the packet is populated, and nothing exceeds the limits.
- **Word-overlap limit.** Recomputed against a corpus restricted to the explicitly-marked verbatim blocks (sources 008–013). Found **five six-word runs**, so `maximumUnquotedSourceOverlapWords` is corrected from **5 to 6**: "through the Apple Beta Software Program" (×2), "Apple Vision Pro with M2 and later" (×2, inside a `disagreement-002` position field whose whole purpose is to compare the competing source wordings), and "requires an Apple Intelligence enabled device". All five are product names, programme names and device qualifiers used nominatively — not expressive prose — and the handoff expressly contemplates vendor and product names being used for factual identification. The gate passes in substance; the recorded number was simply one word low.

### Scrutiny of the 13 `complete` targets

The high completion rate is **justified, not padded**. Five `complete` targets were examined in full, including **two** that `batch-gap-mid-cycle-absent-from-vendor-listing` covers:

1. **`version-ipados-27-0/beta-3-v2`** (no first-party identity source) — Holds up. 3 claims, 1 occurrence, but the occurrence is a genuine corroborated respin fact from two independent outlets. Build `24A5380l` correctly marked `reported`, not `confirmed`, and explicitly declared ineligible for a build document. Material gap declared for the absent first-party record. Not padded.
2. **`version-macos-27-0/beta-3-v2`** (no first-party identity source) — Holds up. Same structure; additionally the disputed predecessor build is demoted to `confidence: low` with the outline instructing the builder to "either omit the predecessor build or present both reported values as unresolved. Do not pick one silently."
3. **`version-ios-27-0/public-beta-1`** — Holds up. Only 1 occurrence, but 6 claims give real material, and the `scopeBoundary` explicitly warns "Nothing here should be written as a feature that first appeared on 2026-07-13." The load-bearing payload-equivalence claim (public beta = developer beta 3) is double-sourced. The single-sourced wallpaper-animation observation is correctly held as a `confidence: low` claim rather than promoted to an occurrence.
4. **`version-visionos-27-0/beta-2`** — Holds up, and is unusually strong for a mid-cycle beta: two `confirmed`/`delta` occurrences because the vendor's own notes name Beta 2 explicitly. Verified in the extract.
5. **`version-macos-27-0/beta-1`** — Holds up. First-party identity and build with exact `pubDate`, plus two `delta`/`confirmed` occurrences, one resting on a notes entry naming `macOS 27 beta 1` directly.

Corroborating signals that the outcome split is honest rather than inflated: the five `partial`/`sourceLinked` targets are exactly the thin mid-cycle ones and carry **zero** occurrences apiece — the researcher did not manufacture occurrences to lift them; and `version-ipados-27-0/public-beta-1` was held at `partial` specifically because `disagreement-006` leaves its build genuinely unresolved, which is a decision against the researcher's own completion rate.

One automated flag was raised and **adjudicated as a false positive**: `concept-visionos-mesh-compression-incompatibility` is marked `delta` twice within one platform (beta 1 `knownIssue`, beta 2 `regression`). This is correct modelling of a single vendor entry that names a boundary *between* two seeds, recorded once from each side with different actions and an explicit cross-reference, not a double-count.

A second potential over-reach was checked and found already handled: `watchos-27-beta-4-occurrence-cellular-carrier-regression` is `fixed`/`delta` at beta 4 from a living document that only proves the fix had landed *by* the beta-4 state. The packet anticipates this exactly — `confidence: medium`, a verification method conceding "the entry does not, however, prove this exact seed carried the fix rather than an earlier one", and a dedicated gap `gap-watchos-b4-fix-seed-attribution`.

### Flagged item 1 — public beta appearances: CONFIRMED, with a stratification caveat

The underlying claim is **solid for macOS and materially weaker for watchOS and tvOS**, and the packet's hedging is correct.

- **macOS — strong.** `source-023` is a *dedicated headline article*, "First macOS Golden Gate Public Beta Now Available" (MacRumors, Juli Clover, Monday July 13 2026 1:41 pm PDT), corroborated by `source-025`, whose own title reports public betas dropping the same day. This is sound evidence that macOS 27 entered public beta on 2026-07-13.
- **watchOS and tvOS — single-sourced and inferential.** Verified directly: **`source-023` does not mention watchOS or tvOS at all.** The claim rests entirely on one sentence in `source-025` stating that every other OS 27 beta retained its beta 3 build numbers for the public beta, from which the researcher infers those public betas were issued. That is a reasonable reading, but it is an inference from a statement about build numbers, from one outlet.

`disagreement-007` and `batch-gap-public-beta-appearances-not-modelled` cite `source-023` and `source-025` together for a position bundling all three platforms, which gives watchOS and tvOS more apparent support than they have. The researcher's *conduct* is nonetheless correct and notably better than the sibling wave-1 batch precedent: nothing is asserted as fact, `requiresChronologyReview` is `true`, no target was added, renamed or moved, and the recommendation is that the coordinator confirm against production and "open targets only if they do not". The observation that the `m3` slot is already occupied on macOS and iPadOS, and that `publicBeta` appears only on iOS and iPadOS across all 1393 backlog targets from 2017 to 2026 — raising the possibility of a deliberate editorial convention rather than an omission — is genuinely useful framing.

**Recommendation to the human acting on this:** treat the macOS public beta as well-evidenced and the watchOS and tvOS public betas as requiring one more contemporaneous source before opening chronology targets. They should not be opened on equal footing with macOS. The coordinator's independent production query (`tmp/verify-270-publicbeta.ts`, read-only, no mutation calls) confirms no `publicBeta` event exists for any of the three platforms, so the gap is real in all three cases; what differs is the strength of the evidence that the appearances themselves occurred.

### Flagged item 2 — the six numbered disagreements: ALL CHECK OUT

All **six** were verified against retained evidence, not the three required.

- **`disagreement-001`** (iOS 27 beta 4 build) — **Confirmed.** `source-001` L14 and `source-002` L16 both carry `iOS 27.0 beta 4 (24A5390f)` for 2026-07-20, and `source-002` L30 assigns `23G71` to `iOS 26.6` on 2026-07-27. `source-026` states `23G71`. The boundary — use `24A5390f`, and do not present this as a genuine open question — is correct: the secondary value provably belongs to a different release line.
- **`disagreement-002`** (Vision Pro chip scope) — **Confirmed.** `source-008`'s retained verbatim availability block lists "Apple Vision Pro" with no chip qualifier; `source-012` footnote [4] reads "Apple Vision Pro with M2 and later". The boundary correctly prefers the narrower wording *and* explicitly warns that the shared footnote across preview pages is **one lineage, not four independent sources** — exactly the right independence discipline.
- **`disagreement-003`** (watchOS Ultra 3) — **Confirmed.** `source-017` states the Ultra 3 exclusion; `source-012`'s verbatim compatibility list includes `Ultra 3`. The boundary correctly declines to publish the exclusion while noting that Apple's list is version-level and does not by itself prove per-seed availability.
- **`disagreement-004`** (superseded macOS beta 3 build) — **Confirmed.** `source-021` states `26A5378j`; `source-025` states `26A5368g`. Boundary: state no predecessor or state that reports conflict. Correct — these cannot be reconciled as a typographic slip, and neither is first-party.
- **`disagreement-005`** (iPadOS build trailing glyph) — **Confirmed.** `source-024` renders `24A5380l` (lowercase L), `source-025` renders `24A5380I` (capital I). Boundary correctly prefers the lowercase form on Apple's build conventions and declines to surface it to readers.
- **`disagreement-006`** (iPadOS public beta payload) — **Confirmed.** `source-022` states the public beta is identical to developer beta 3; `source-025` states every other OS retained its beta 3 build, implying iPadOS did not. Boundary correctly leaves it unresolved, publishes no build, and notes this is precisely why the iPadOS public beta is `sourceLinked` rather than `fullArticle`.

### Corrections applied by the reviewer

Confined to `batch.status`, `batch.evidenceReviewer`, `batch.completedAt` and `qualityChecks`. **No target content, claim, occurrence, citation or source was altered** (verified after edit: 18 targets, 58 claims, 49 occurrences, 257 citations, 28 sources, 23 concepts — all unchanged).

1. `qualityChecks.maximumUnquotedSourceOverlapWords`: `5` → `6`, with the five instances enumerated above.
2. `qualityChecks.evidenceReviewNotes` added, recording the short-quotation count correction, the overlap correction, and the public-beta stratification caveat. The researcher's original `reviewNotes` was left intact for provenance.
3. Noted but **not** edited, to preserve researcher authorship: `batch-gap-mid-cycle-absent-from-vendor-listing` states that eight of eighteen targets have no first-party identity source. Three of those eight — the iOS and iPadOS public betas and visionOS beta 2 — do carry a first-party identity citation, but in each case the first-party document establishes only that the channel or the seed exists, never the appearance date. The gap is therefore accurate in substance and loose only in wording; the target-level `scopeBoundary` text is precise on exactly this point.
4. Minor deviations from the `report.md` template, left as-is because the substance is present and the underlying data is correct: the scope-closure table omits the template's `Sources` column and reports total rather than material gaps, and the source ledger substitutes selected-text bytes for raw bytes and omits the SHA-256 column. The hashes are recorded in `findings.json` and were independently reproduced above.
