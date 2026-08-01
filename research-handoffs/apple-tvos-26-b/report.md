# tvOS 26 point-release research handoff (apple-tvos-26-b)

Status: returned
Researcher: research-agent-tvos26-b
Evidence reviewer: evidence-reviewer-tvos26-b
Assignment SHA-256: 99e99d4c6593976e7e0d76a357a9ec5edd9b1cf4ed14cfe3285d84e4fc5b8831
Findings SHA-256 (as reviewed): 9a6135f9891e284983e4285f5f162d4ee83965a4ede04fdb24272f225abed732
Findings SHA-256 (after review fields were written): 1753f9b629f74e75a7e4e59ce1b1b27860b66afadf65e99fb9c404dff30ec889
Evidence directory: tmp/research-evidence/apple-tvos-26-b/

Fourteen consecutive tvOS appearances from 2026-03-18 to 2026-07-27, covering the
tail of the 26.4 cycle, all of 26.5, and all of 26.6. Every target was already
`sourceLinked` in production; this packet verifies what production cites, adds a
confirmed build number to all fourteen, and states plainly where the evidence
ceiling sits.

## Scope closure

| Target | Outcome | Recommendation | Sources | Claims | Occurrences | Material gaps |
| ------ | ------- | -------------- | ------: | -----: | ----------: | ------------- |
| version-tvos-26-4/rc | partial | sourceLinked | 6 | 6 | 2 | none |
| version-tvos-26-4/public | complete | fullArticle | 9 | 6 | 15 | gap-2604-pub-subtitle-controls-single-source; gap-2604-pub-audio-labelling-single-source |
| version-tvos-26-5/beta-1 | noSubstantiveNotesFound | sourceLinked | 4 | 5 | 0 | gap-2605-b1-no-seed-level-changes |
| version-tvos-26-5/beta-2 | noSubstantiveNotesFound | sourceLinked | 4 | 5 | 0 | gap-2605-b2-no-seed-level-changes |
| version-tvos-26-5/beta-3 | noSubstantiveNotesFound | sourceLinked | 4 | 5 | 0 | gap-2605-b3-no-seed-level-changes |
| version-tvos-26-5/beta-4 | noSubstantiveNotesFound | sourceLinked | 4 | 5 | 0 | gap-2605-b4-no-seed-level-changes |
| version-tvos-26-5/rc | partial | sourceLinked | 5 | 6 | 0 | gap-2605-rc-no-seed-level-changes |
| version-tvos-26-5/public | complete | fullArticle | 7 | 5 | 7 | none |
| version-tvos-26-6/beta-1 | noSubstantiveNotesFound | sourceLinked | 4 | 5 | 0 | gap-2606-b1-no-seed-level-changes |
| version-tvos-26-6/beta-2 | noSubstantiveNotesFound | sourceLinked | 4 | 4 | 0 | gap-2606-b2-no-seed-level-changes |
| version-tvos-26-6/beta-3 | noSubstantiveNotesFound | sourceLinked | 4 | 4 | 0 | gap-2606-b3-no-seed-level-changes |
| version-tvos-26-6/beta-4 | noSubstantiveNotesFound | sourceLinked | 4 | 4 | 0 | gap-2606-b4-no-seed-level-changes |
| version-tvos-26-6/beta-5 | partial | sourceLinked | 5 | 6 | 0 | gap-2606-b5-no-seed-level-changes |
| version-tvos-26-6/public | complete | fullArticle | 12 | 7 | 4 | gap-2606-pub-missing-rc-target |

Totals: 44 sources, 22 concepts, 73 claims, 28 occurrences, 220 citations.

## What page builders can safely say

- Every one of the fourteen appearances now has a build number confirmed against
  an Apple-authored listing, matched to the exact date the assignment records.
  In order: 23L240, 23L243, 23L5443g, 23L5455c, 23L5460d, 23L5469a, 23L471,
  23L471, 23L5729e, 23L5744d, 23L5753c, 23L5758b, 23L5766a, 23L773.
- The tvOS 26.5 candidate and the tvOS 26.5 general release carry the same build
  identifier, and no revised tvOS candidate was ever posted in that cycle, so the
  candidate is the build that reached everyone.
- The tvOS 26.4 candidate and the tvOS 26.6 candidate each carry a different
  identifier from the build that shipped, so both were revised before general
  availability. Nothing in the evidence explains why, and pages must not guess.
- Apple describes tvOS 26.4 as fixing a playback problem on Apple TV 4K that
  arose when a soundtrack's encoding changed mid-stream, and as retiring the two
  standalone film and television storefront applications in favour of the single
  Apple TV application. Both are documented by Apple and reported independently.
- Apple describes both tvOS 26.5 and tvOS 26.6 to consumers as responsiveness and
  reliability work only, naming no viewer-facing addition. Two publishers reached
  the same assessment for 26.6 and one for 26.5.
- Apple's advisories scope all three releases to Apple TV HD and every Apple TV 4K
  model. Some reporting narrows this to Apple TV 4K; follow Apple.
- The advisory for tvOS 26.6 is far larger than its predecessors. Counted as
  entries / components / distinct vulnerability identifiers: 26.6 is 84 / 34 / 100,
  26.5 is 37 / 20 / 46, and 26.4 is 18 / 14 / 18.
- The developer release notes carry real, citable SDK changes for 26.4 (asset
  delivery, proxy networking, the store framework, the interface framework) and
  for 26.5 (a monthly-with-annual-commitment billing plan plus three corrections),
  and only two corrections for 26.6.
- Nothing can be said about what changed in any individual beta or candidate.
  Apple keeps one release-notes document per point release and links every seed in
  the cycle to it.

## Recurring concepts and histories

- `concept-appletv-itunes-store-app-consolidation`: tvOS 26.4 RC → removed/cumulative; tvOS 26.4 → removed/delta
- `concept-appletv-continuous-audio-connection-hdmi`: tvOS 26.4 RC → introduced/cumulative; tvOS 26.4 → introduced/cumulative
- `concept-tvos-maintenance-performance-and-stability`: tvOS 26.4 → changed/cumulative; tvOS 26.5 → changed/cumulative; tvOS 26.6 → changed/cumulative
- `concept-tvos-security-advisory-published`: tvOS 26.4 → fixed/delta; tvOS 26.5 → fixed/delta; tvOS 26.6 → fixed/delta

Concepts appearing once in this batch:

- `concept-appletv-audio-format-transition-playback`: tvOS 26.4 → fixed/delta
- `concept-appletv-genius-browse-recommendations`: tvOS 26.4 → introduced/cumulative
- `concept-backgroundassets-offline-asset-pack-status`: tvOS 26.4 → introduced/delta
- `concept-backgroundassets-force-latest-local-copy`: tvOS 26.4 → introduced/delta
- `concept-backgroundassets-asset-pack-download-crash`: tvOS 26.4 → fixed/delta
- `concept-cfnetwork-proxy-autoconfig-runloopsource-leak`: tvOS 26.4 → fixed/delta
- `concept-storekit-transaction-revocation-detail`: tvOS 26.4 → introduced/delta
- `concept-storekit-purchase-intent-background-launch`: tvOS 26.4 → fixed/delta
- `concept-swiftui-current-user-activity-staleness`: tvOS 26.4 → fixed/delta
- `concept-swiftui-realitykit-implicit-animation-merging`: tvOS 26.4 → knownIssue/cumulative
- `concept-sanitizer-hang-with-older-toolchain`: tvOS 26.4 → knownIssue/cumulative
- `concept-storekit-annual-commitment-monthly-billing-plan`: tvOS 26.5 → introduced/delta
- `concept-storekit-receipt-app-version-null-string`: tvOS 26.5 → fixed/delta
- `concept-storekit-entitlements-non-gregorian-calendar`: tvOS 26.5 → fixed/delta
- `concept-storekittest-configuration-selection-failure`: tvOS 26.5 → fixed/delta
- `concept-storekit-testing-subscription-price-change-blindness`: tvOS 26.5 → knownIssue/cumulative
- `concept-healthkit-time-weighted-average-overlap`: tvOS 26.6 → fixed/delta
- `concept-storekit-test-session-simulator-connection`: tvOS 26.6 → fixed/delta

## Source ledger

| ID  | Class | Publisher | Published | Raw bytes | SHA-256 | Role |
| --- | ----- | --------- | --------- | --------: | ------- | ---- |
| source-001 | firstPartyDocumentation | Apple Developer | not stated | 12980 | f009406e24ef5e1f… | releaseNotes, developerApiChanges |
| source-002 | firstPartyDocumentation | Apple Developer | not stated | 9183 | fe72582b873a4b7f… | releaseNotes, developerApiChanges |
| source-003 | firstPartyDocumentation | Apple Developer | not stated | 6730 | d197e2bdabf7e236… | releaseNotes, developerApiChanges |
| source-004 | firstPartyDocumentation | Apple Support | not stated | 1251253 | 1e1fa0eceef421bd… | releaseNotes, userFacingChangeSummary |
| source-005 | firstPartyDocumentation | Apple Support | 2026-03-24 | 1178048 | 68668cd29fdc6549… | securityNotes, releaseIdentity, deviceApplicability |
| source-006 | firstPartyDocumentation | Apple Support | 2026-05-11 | 1194527 | c1e4a77ad1b5f226… | securityNotes, releaseIdentity, deviceApplicability |
| source-007 | firstPartyDocumentation | Apple Support | 2026-07-27 | 1247512 | 17c7d23ed2eba6a9… | securityNotes, releaseIdentity, deviceApplicability |
| source-008 | firstPartyDocumentation | Apple Support | not stated | 1292096 | 2b7c875cd2d7af4b… | releaseIdentity, deviceApplicability |
| source-009 | firstPartyAnnouncement | Apple Developer | not stated | 249739 | 67c7ca3d01115e8c… | releaseIdentity, buildNumber |
| source-010 | archive | Internet Archive Wayback Machine | 2026-03-19 | 218321 | 92498547e04ef6a5… | releaseIdentity, buildNumber |
| source-011 | archive | Internet Archive Wayback Machine | 2026-03-24 | 218321 | b7b5efad2b4e977c… | releaseIdentity, buildNumber |
| source-012 | archive | Internet Archive Wayback Machine | 2026-03-31 | 226548 | eb3ca4dfeebc2ab9… | releaseIdentity, buildNumber |
| source-013 | archive | Internet Archive Wayback Machine | 2026-04-14 | 226593 | 7aaca81423cb2b3e… | releaseIdentity, buildNumber |
| source-014 | archive | Internet Archive Wayback Machine | 2026-04-22 | 169608 | 697dc09bf25bbacc… | releaseIdentity, buildNumber |
| source-015 | archive | Internet Archive Wayback Machine | 2026-04-28 | 169608 | f092010b888ff3ef… | releaseIdentity, buildNumber |
| source-016 | archive | Internet Archive Wayback Machine | 2026-05-06 | 169483 | 9b71eef9bd5dee01… | releaseIdentity, buildNumber |
| source-044 | archive | Internet Archive Wayback Machine | 2026-05-09 | 169491 | f2afcabe04e34864… | releaseIdentity, buildNumber |
| source-017 | archive | Internet Archive Wayback Machine | 2026-05-13 | 182896 | 92ff8e01170e5923… | releaseIdentity, buildNumber |
| source-018 | archive | Internet Archive Wayback Machine | 2026-05-27 | 198990 | 227bff0f46932fe0… | releaseIdentity, buildNumber |
| source-019 | archive | Internet Archive Wayback Machine | 2026-06-16 | 233357 | 98bf4e3bbd9ee8e9… | releaseIdentity, buildNumber |
| source-020 | archive | Internet Archive Wayback Machine | 2026-07-03 | 248781 | fa60319d89921988… | releaseIdentity, buildNumber |
| source-021 | archive | Internet Archive Wayback Machine | 2026-07-07 | 248769 | dd58d38087263232… | releaseIdentity, buildNumber |
| source-022 | archive | Internet Archive Wayback Machine | 2026-07-14 | 249568 | f748b7e5e0c1cda1… | releaseIdentity, buildNumber |
| source-023 | archive | Internet Archive Wayback Machine | 2026-07-23 | 249481 | de029881b45cd3d7… | releaseIdentity, buildNumber |
| source-024 | journalism | MacRumors | 2026-03-18T10:17:57-07:00 | 116727 | a938d1dfd0935523… | contemporaneousReporting |
| source-025 | journalism | 9to5Mac | 2026-03-18T17:18:39+00:00 | 148813 | 5a79f0f21e478f21… | contemporaneousReporting |
| source-026 | journalism | AppleInsider | 2026-03-24T17:05:31+00:00 | 129293 | 4ad48516c8b3dc2b… | contemporaneousReporting |
| source-027 | journalism | MacRumors | 2026-03-25T15:33:00-07:00 | 130212 | 6d2691aad07130fd… | contemporaneousReporting |
| source-028 | journalism | MacRumors | 2026-03-18T16:17:12-07:00 | 130780 | 933eeabe1af8ac33… | contemporaneousReporting |
| source-029 | journalism | 9to5Mac | 2026-03-17T18:53:42+00:00 | 165796 | aea22afccc9ec2b4… | contemporaneousReporting |
| source-030 | journalism | 9to5Mac | 2026-03-30T17:44:43+00:00 | 150874 | e47d9ae866762ec9… | contemporaneousReporting |
| source-031 | journalism | MacRumors | 2026-04-13T10:06:00-07:00 | 120276 | 84dbbef7880cae55… | contemporaneousReporting |
| source-032 | journalism | MacRumors | 2026-04-20T10:03:00-07:00 | 113367 | 4c8ec3003bd6edd9… | contemporaneousReporting |
| source-033 | journalism | MacRumors | 2026-04-27T10:01:00-07:00 | 115838 | 105119e3d5124a31… | contemporaneousReporting |
| source-034 | journalism | MacRumors | 2026-05-04T10:11:00-07:00 | 123317 | 971c5014f21b78b8… | contemporaneousReporting |
| source-035 | journalism | MacRumors | 2026-05-11T10:02:00-07:00 | 123622 | f2cc57d21522fde8… | contemporaneousReporting |
| source-036 | journalism | MacRumors | 2026-05-26T10:03:00-07:00 | 119193 | 3db472e926c25ce1… | contemporaneousReporting |
| source-037 | journalism | MacRumors | 2026-06-15T10:06:00-07:00 | 122760 | 736e72a5cf389a4c… | contemporaneousReporting |
| source-038 | journalism | MacRumors | 2026-06-29T10:08:00-07:00 | 115485 | 26936ae67f0914ce… | contemporaneousReporting |
| source-039 | journalism | MacRumors | 2026-07-06T10:16:00-07:00 | 113067 | c723714f2d52f95c… | contemporaneousReporting |
| source-040 | journalism | 9to5Mac | 2026-07-13T17:37:30+00:00 | 152233 | 062d523c14389f43… | contemporaneousReporting |
| source-041 | journalism | MacRumors | 2026-07-27T10:24:20-07:00 | 114353 | 68ffec5de69148cb… | contemporaneousReporting |
| source-042 | journalism | 9to5Mac | 2026-07-27T17:26:36+00:00 | 160140 | 6f6274c06997644a… | contemporaneousReporting |
| source-043 | journalism | MacRumors | 2026-07-20T10:00:00-07:00 | 109415 | 59d0a5cfbccef053… | contemporaneousReporting |

Lineage notes that matter to a reviewer:

- `source-010` through `source-023` and `source-044` are archived captures of one
  Apple page (`source-009`). They share a single evidence lineage with each other
  and with the live capture, and must not be stacked to manufacture corroboration.
- `source-008` indexes the same advisories as `source-005`–`source-007`; it is not
  independent of them.
- MacRumors supplies eleven of the twenty journalism sources. Multiple MacRumors
  articles are one publisher, not several, and the corroboration checks in this
  packet count publishers rather than URLs.

## Conflicts and decisions

### disagreement-tvos-device-scope-reporting

Which Apple TV models the tvOS 26.5 and 26.6 general releases reach.

- Apple's advisories and its release index both scope the release to the Apple TV HD alongside every Apple TV 4K generation. (source-006, source-007, source-008)
- Release-day reporting frames each update as an Apple TV 4K release, without naming the older set-top box. (source-035, source-041)

Recommendation: Follow the vendor. Both Apple surfaces name the two hardware families explicitly, while the narrower press phrasing reads as shorthand for the current model rather than a contrary assertion. A page should therefore name the Apple TV HD alongside every Apple TV 4K generation.

### disagreement-2604-consumer-page-subheading-locators

Whether Apple's consumer update page contains per-topic subheadings beneath tvOS 26.4.

- Production currently cites locators of the form 'tvOS 26.4 — Audio' and 'tvOS 26.4 — TV app', which imply subheadings beneath the version. (production state; no source object)
- The page as captured gives tvOS 26.4 a single level-2 heading followed by one paragraph of three sentences, with no subheadings. (source-004)

Recommendation: The underlying facts are sound; only the locator shape is wrong. Re-point the two existing citations to sentence positions within the single paragraph, for example 'Heading tvOS 26.4 > first sentence of the section paragraph' for the audio fix and '> second sentence' for the storefront consolidation. No factual correction is needed and no citation should be dropped.

### disagreement-2605-storekit-testing-heading-locators

The exact heading names in the tvOS 26.5 developer release notes for the store testing sections.

- Production currently cites 'StoreKit Testing — Known Issues' and 'StoreKit Testing — Resolved Issues'. (production state; no source object)
- The document as captured contains a section headed 'StoreKit Testing in Xcode' carrying the known issue, and a separate section headed 'StoreKitTest' carrying the resolved issue. (source-002)

Recommendation: Keep both citations and correct the heading names to the two distinct sections actually present. The two items belong to different sections, so collapsing them under one name would misstate the document's structure.

### disagreement-2606-missing-rc-appearance

Whether a tvOS 26.6 release candidate appearance exists between the fifth beta and the general release.

- The assignment moves directly from the fifth developer beta on 2026-07-13 to the general release on 2026-07-27, with no candidate target. (production state; no source object)
- Apple published a tvOS 26.6 release candidate carrying build 23L772 on 2026-07-20, and contemporaneous reporting describes the same candidate wave. (source-023, source-043)

Recommendation: The assigned identities were left untouched and no target was added. The coordinator should decide whether to open a target for the 2026-07-20 candidate; the evidence needed for its date and build is already retained in this batch. The build difference between 23L772 and 23L773 is recorded on the general-release target as a build claim, not as a correction to any assigned identity.

**Requires chronology review by the coordinator.**

### disagreement-2604-rc-build-versus-shipped-build

Whether the tvOS 26.4 release candidate build is the build that shipped.

- The candidate published on 2026-03-18 carried build 23L240. (source-010)
- The general release published on 2026-03-24 carried build 23L243, and no second candidate was ever listed. (source-011, source-012)

Recommendation: State both identifiers and that they differ. The evidence supports saying that the published candidate was not the shipping build and that no revised candidate appeared on Apple's releases page; it does not support any statement about why, or about a withdrawal.

## Negative findings

- Apple publishes one developer release-notes document per tvOS point release.
  Every beta and candidate entry in all three cycles resolves to that same
  version-level document. This establishes that no seed-scoped vendor document was
  published; it does not establish that any seed was unchanged.
- A capture of Apple's releases page taken at 08:39 UTC on 2026-03-24, before the
  general release was posted, shows the 2026-03-18 candidate as the most recent
  tvOS entry. No second tvOS 26.4 candidate was listed.
- A capture taken 2026-05-09 shows that the revised candidates issued on
  2026-05-08 covered only Apple's phone and tablet systems. tvOS received none.
- Apple's consumer update page gives tvOS 26.4 one heading and one three-sentence
  paragraph, with no per-topic subheadings. The facts production cites are in that
  paragraph; only the locator shape is unsupported.
- Neither the tvOS 26.4 developer release notes nor Apple's consumer page names
  Genius Browse, the HDMI continuous-connection option, or in-playback subtitle
  controls. These are undocumented within the reviewed vendor corpus, which is not
  the same as absent from the software.
- The tvOS 26.6 developer release notes contain no "New Features" heading at all,
  only two "Resolved Issues" lists.

## Evidence gaps

- **batch-gap-version-level-release-notes-only** (material): Apple publishes one developer release-notes document per tvOS point release and links every seed in that cycle to it. No seed-scoped vendor document exists for any of the nine beta appearances or either release candidate in this batch. Impact: The ceiling for the beta and candidate targets is sourceLinked. Their pages can carry identity, build, cycle position, and an explicit evidence statement, but no change list. Any page builder tempted to move a version-level change onto a beta page would be making an unsupported attribution.
- **batch-gap-single-archive-lineage-for-pre-july-identity** (material): Apple's live developer releases listing is a rolling window that had dropped every tvOS entry before 2026-07-27 by the time of research. All identity and build evidence for the other thirteen targets therefore comes from Internet Archive captures of that one Apple page, which is a single evidence lineage. Impact: Build numbers for twelve of the fourteen targets rest on one archived Apple surface plus independent reporting that in most cases does not repeat the build. Where a build matters to a published claim, it should be presented as Apple's published identifier at that date rather than as independently corroborated.
- **batch-gap-public-testing-appearances-out-of-scope** (nonMaterial): Several public-testing appearances sit inside this date range but are not assigned targets, including the tvOS 26.5 public beta wave in mid-April, the first tvOS 26.6 public beta in late May, and the public build issued the same day as the fifth 26.6 developer beta. Impact: Beta pages must not blur the developer seed with its public-testing counterpart. The packet records the boundary on the affected targets rather than absorbing the public appearances.
- **batch-gap-apple-support-publication-dates-unavailable** (nonMaterial): Apple Support pages populate their published and modified dates on the client, so those fields are absent from the fetched HTML. Publication precision for the four Apple Support sources is recorded as unknown except where a document states its own release date in the body. Impact: Do not attribute a publication or revision date to an Apple Support page beyond the release date written in its text.
- **batch-gap-evidence-capture-method** (nonMaterial): All captures in this batch were obtained by automated HTTPS fetch of rendered text or of a documentation data endpoint, not by saving a fully rendered browser snapshot. Client-rendered page furniture is therefore absent from the retained evidence. Impact: Every locator used in this packet resolves against the retained text, and the reviewer can reproduce each one. Locators that would depend on client-rendered content were not used.

Target-level material gaps:

- **gap-2604-pub-subtitle-controls-single-source** (version-tvos-26-4/public): The in-playback subtitle controls rest on one publisher and appear in no vendor document.
- **gap-2604-pub-audio-labelling-single-source** (version-tvos-26-4/public): The reported relabelling of the audio format setting rests on one publisher and is not corroborated by the other retained reporting.
- **gap-2605-b1-no-seed-level-changes** (version-tvos-26-5/beta-1): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2605-b2-no-seed-level-changes** (version-tvos-26-5/beta-2): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2605-b3-no-seed-level-changes** (version-tvos-26-5/beta-3): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2605-b4-no-seed-level-changes** (version-tvos-26-5/beta-4): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2605-rc-no-seed-level-changes** (version-tvos-26-5/rc): No vendor or independent source attributes a specific change to this candidate.
- **gap-2606-b1-no-seed-level-changes** (version-tvos-26-6/beta-1): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2606-b2-no-seed-level-changes** (version-tvos-26-6/beta-2): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2606-b3-no-seed-level-changes** (version-tvos-26-6/beta-3): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2606-b4-no-seed-level-changes** (version-tvos-26-6/beta-4): No vendor or independent source attributes any specific change to this individual seed.
- **gap-2606-b5-no-seed-level-changes** (version-tvos-26-6/beta-5): No vendor or independent source attributes a specific change to this seed.
- **gap-2606-pub-missing-rc-target** (version-tvos-26-6/public): The 2026-07-20 tvOS 26.6 release candidate is a real appearance with a confirmed build but has no target in this assignment, so this batch cannot deliver a page for it.

## Excluded sources

- https://developer.apple.com/news/releases/rss/releases.rss — Same rolling window and same underlying feed as the developer releases listing already declared as source-009; adds no independent evidence and covers none of the pre-July tvOS appearances.
- https://forums.macrumors.com/threads/apple-releases-second-watchos-26-5-tvos-26-5-and-visionos-26-5-betas.2480863/ — Forum thread attached to an article already declared; one evidence lineage with the article and mostly reader commentary.
- https://forums.appleinsider.com/discussion/243809 — Forum thread attached to an article already declared; one evidence lineage with the article.
- https://macdailynews.com/2026/07/29/whats-new-in-tvos-26-6-and-homepod-26-6/ — Recap of coverage already declared; not an independent lineage.
- https://machash.com/mac-daily-news/405371/end-era-apples-tvos-26-4-removes-standalone-itunes-movies/ — Syndicated copy of another outlet's article; one evidence lineage with the original.
- https://blog.dynasage.com/2026/07/apple-seeds-watchos-266-tvos-266-and.html — Syndicated copy of a MacRumors article already declared; one evidence lineage with the original.
- https://www.mactech.com/2026/06/15/apple-seeds-second-developer-betas-of-macos-26-6-ios-26-6-ipados-26-6-tvos-26-6-watchos-26-6-visionos-26-6/ — Wire-style recap of the same seeding event already covered by a declared source; adds no tvOS-specific detail.
- https://appleworld.today/2026/07/apple-releases-fourth-developer-betas-of-macos-26-6-ios-26-6-ipados-26-6-watchos-26-6-tvos-26-6-and-visionos-26-6/ — Wire-style recap of the same seeding event already covered by a declared source.
- https://thestreamable.com/apple-tvos-26-4-launch-genius-browse — Surfaced during the corroboration search for the recommendation surface but not retrieved or read in full, so it is not relied upon; two publishers already carry that item.
- https://www.idropnews.com/news/tvos-26-4-genius-browse-features/261563/ — Surfaced during the corroboration search but not retrieved or read in full; not relied upon.
- https://www.macobserver.com/news/tvos-26-5-beta-4-now-available-for-apple-tv-developers/ — Surfaced in search but not retrieved or read in full; the same seed is already covered by a declared contemporaneous source.
- https://appleosophy.com/2026/02/22/tvos-26-4-beta-removes-itunes-movies-and-itunes-tv-shows-apps/ — Concerns a February 2026 beta appearance that is outside this assignment.
- https://support.apple.com/guide/tv/update-apple-tv-4k-software-atvb7e0a4ea5/tvos — User-guide instructions for installing updates; carries no release-specific change or date information.

## Verification of what production already cites

Every citation named in the assignment's `assignmentNotes` was checked against a
fresh capture. All of the underlying facts hold. Three locator corrections are
recommended, recorded as disagreements above and summarised here:

- tvOS 26.4 general release: the two "About Apple TV 4K and Apple TV HD software
  updates" citations point at "Audio" and "TV app" subheadings that do not exist.
  Re-point them at sentence positions inside the single paragraph. Keep both.
- tvOS 26.5 general release: "StoreKit Testing — Resolved Issues" should be
  "StoreKitTest > Resolved Issues", and "StoreKit Testing — Known Issues" should be
  "StoreKit Testing in Xcode > Known Issues". They are two different sections.
- The eleven targets whose only production citation is a bare "Apple Developer"
  link now have a specific, dated, build-bearing archived entry to cite instead.

No production citation was dropped or contradicted on the facts.

## Validation

- [x] Exact target closure — 14 assigned, 14 delivered, identities copied verbatim
- [x] Every claim and occurrence cited — 73 claims, 28 occurrences, 220 citations
- [x] Every locator independently resolved against retained text
- [x] Source metadata and timestamps checked — bylines and publication times read
      from embedded article metadata; Apple Support dates taken from in-document
      "Released" lines because the page's date fields render client-side
- [x] Raw and selected-text hashes reproduced — 88 files, byte counts and SHA-256
      re-verified after the packet was written
- [x] Recurrence and inheritance reviewed — "New Features" and "Resolved Issues"
      headings treated as deltas, general "Known Issues" sections as cumulative
- [x] Copyright similarity passed — longest run of consecutive normalised words
      shared with any retained source is four, all product names or function words
- [x] JSON parsed and controlled values validated
- [x] No Sanity write, apply, approval, or deployment performed

Status is `needsEvidenceReview`. An independent evidence reviewer has not run;
only the coordinator or that reviewer may move this packet to
`readyForEditorialReview`.

## Independent evidence review

Reviewer: evidence-reviewer-tvos26-b (did not author this packet)
Reviewed at: 2026-07-30T18:30:00Z
Packet SHA-256 at review: `9a6135f9891e284983e4285f5f162d4ee83965a4ede04fdb24272f225abed732`
Verdict: **returned** — 12 of 13 checklist items pass. Two findings block
`readyForEditorialReview`, one of which concerns an assertion about existing
production data that does not hold.

This is a strong packet. Twelve of its fourteen targets need no change, its
hashes reproduce completely, its copyright discipline is the cleanest measured
so far, and two of the three items the researcher escalated check out exactly as
described. It is returned for two specific defects, not for its overall quality.

### Verdict per checklist item

| # | Check | Result | How it was established |
| - | ----- | ------ | ---------------------- |
| 1 | Exact target closure | pass | 14 assigned, 14 delivered, no additions or drops. All 14 identity blocks compared field by field against `assignment.json` across platform, version, release-version ID, stable event ID, label, route alias, channel, appearance date, sequence, revision status and availability: zero mismatches. |
| 2 | All local IDs unique | pass | 210 registered IDs across sources, concepts, targets, claims, occurrences, gaps, disagreements and batch gaps: zero duplicates. |
| 3 | Every citation's `sourceId` exists | pass | 220 citation objects (188 in `citations`, 32 in `identityCitations`) walked; zero unknown source references; zero empty or missing locators; zero missing `supports` notes. |
| 4 | Every declared source used or explained | pass | 43 of 44 sources carry at least one citation. `source-043` is referenced only through `disagreements[].positions[].sourceIds`, which is a declared use, and its role is stated in its lineage note. |
| 5 | Every locator resolves | pass | 20 locators independently resolved against retained evidence (see below), spanning archived Apple listings, DocC release-note JSON, Apple Support advisories, the consumer update page, MacRumors and 9to5Mac. All 20 landed exactly. |
| 6 | Corroborated items have two independent sources or a reproducible method | pass | Both `corroborated` occurrences pair two genuinely different publishers (MacRumors + AppleInsider; MacRumors + 9to5Mac). The three security-volume claims use a written derivation that the reviewer reproduced independently. |
| 7 | Confirmed items have direct primary support | pass | All 24 `confirmed` occurrences trace to Apple-authored release notes, Apple Support advisories, or Apple's own developer listing. |
| 8 | Undocumented claims meet the stricter bar | pass | Three `undocumented` occurrences. Two carry two independent publishers. The third is `reported` and `cumulative` on a `sourceLinked` target, with retained evidence and a written verification method, satisfying the single-source branch of the rule. Two further single-source reports were correctly held back as claims with material gaps instead of being promoted to occurrences. |
| 9 | Recurrence and inheritance | pass | Four recurring concepts, each with a coherent history. Zero broken concept references, zero dangling outline references, zero orphan concepts. The 26.4 storefront concept reading `cumulative` at the candidate and `delta` at the general release is a defensible judgement, since Apple documents the removal at version level and the general release is that version's shipping appearance. |
| 10 | Build, region, device, language and audience qualifications retained | **fail** | One occurrence over-broadens a device scope. See blocking finding 2. All fourteen build findings themselves are correctly qualified and verification-stated. |
| 11 | Five-word source-overlap limit | pass | 561 reader-facing fields normalised and compared against an n-gram index built from all 44 retained selected-text files. Zero six-word runs outside `sources[].title`. Longest genuine run is five words, always a product or document name. The single six-word hit sits in `batchGaps[4].description` and matches the researcher's own capture-method header, not publisher prose. No `shortQuote` fields are present anywhere, so the 15-word rule is not engaged. |
| 12 | No placeholder, secret, credential, private data, or raw copyrighted document committed | pass | No tokens, cookies, authorization headers or email addresses in the packet. `tmp/research-evidence/` is matched by `.gitignore:59` and zero files under `tmp/` are tracked by git. |
| 13 | No Sanity write, apply, approval, or deployment | pass | Only `research-handoffs/apple-tvos-26-b/` and the ignored evidence directory were written during the batch window. Every modified file under `src/` and `scripts/` predates the batch by a day. No apply, publish or deploy artefact exists. The reviewer's own production checks were read-only GROQ queries against the public dataset. |

### Hashes recomputed

All 88 declared evidence files (44 raw plus 44 selected-text) were rehashed and
their byte counts recompared: **88 of 88 verified, zero failures**. Nine were
additionally re-run through `shasum -a 256` as a second implementation:

| File | SHA-256 | Result |
| ---- | ------- | ------ |
| `wayback-releases-20260723141013.raw.html` | `de029881b45cd3d7…` | matches |
| `wayback-releases-20260723141013.selected.txt` | `c8d32e02edbb7500…` | matches |
| `j-mr-2606-rc-outofscope.raw.html` | `59d0a5cfbccef053…` | matches |
| `j-mr-2606-rc-outofscope.selected.txt` | `8ec2ae6e03d242ff…` | matches |
| `tvos-26_4-release-notes.raw.json` | `f009406e24ef5e1f…` | matches |
| `apple-tv-software-updates.selected.txt` | `ea9b86c71cb48f5d…` | matches |
| `tvos-26_5-release-notes.selected.txt` | `e79b7dc4b7a4298e…` | matches |
| `tvos-26-6-security.selected.txt` | `86e963b184466f36…` | matches |
| `apple-developer-releases-page1.selected.txt` | `09047054ebbcf518…` | matches |

The assignment file rehashes to
`99e99d4c6593976e7e0d76a357a9ec5edd9b1cf4ed14cfe3285d84e4fc5b8831`, matching
`batch.assignmentSha256`.

### Locators independently resolved

| Source | Locator | Result |
| ------ | ------- | ------ |
| source-013 | Entry 04132026d — 'View release notes' destination | resolves (tvOS 26.5 beta 2, 23L5455c, April 13, 2026) |
| source-012 | Entry 03242026d — build identifier in the entry title | resolves (23L243) |
| source-016 | Entry 05042026d — build identifier in the entry title | resolves (23L471) |
| source-022 | Entry 07132026d — 'View release notes' destination | resolves (tvOS 26.6 beta 5, 23L5766a) |
| source-020 | Entry 06292026g — 'View release notes' destination | resolves (tvOS 26.6 beta 3, 23L5753c) |
| source-001 | Networking > Resolved Issues > list item (166839810) (FB21376045) | resolves |
| source-001 | StoreKit > Resolved Issues > list item (168958783) (FB21767675) | resolves |
| source-003 | StoreKit > Resolved Issues > list item (174738526) (FB22500243) | resolves |
| source-002 | StoreKitTest > Resolved Issues > list item (172583218) (FB22237318) | resolves |
| source-002 | StoreKit > New Features > four list items | resolves (all four IDs present) |
| source-036 | Paragraph beginning 'Apple will likely provide public beta testers' | resolves |
| source-033 | Opening paragraph beginning 'Apple today provided developers with the fourth betas' | resolves (article body, distinct from the related-article teaser lower on the page) |
| source-007 | Heading 'tvOS 26.6' > the 'Released July 27, 2026' line | resolves |
| source-008 | Row 'tvOS 26.6 \| Apple TV HD and Apple TV 4K (all models) \| 27 Jul 2026' | resolves verbatim |
| source-009 | Entry 07272026d — displayed date | resolves (tvOS 26.6, 23L773, July 27, 2026) |
| source-040 | Paragraph beginning 'They are now available alongside iOS 26.6 and macOS 26.6 beta 5' | resolves |
| source-040 | Update line timestamped 5:36 p.m. ET | resolves |
| source-041 | Third paragraph beginning 'No new features were found in tvOS 26.6' | resolves |
| source-042 | Closing note beginning 'Note: tvOS 27 drops support' | resolves |
| source-024 | Second paragraph, sentence distinguishing which platforms reached public beta testers | resolves |

The three security-volume derivations were also recomputed from the retained
selected text rather than trusting the declared `DERIVED-COUNTS` header. All
three reproduce exactly: tvOS 26.4 gives 18 identifiers / 18 entries /
14 components, tvOS 26.5 gives 46 / 37 / 20, and tvOS 26.6 gives 100 / 84 / 34.

### The three flagged items

#### 1. `disagreement-2606-missing-rc-appearance` — evidence confirmed, conclusion refuted

**The facts are right.** The reviewer opened the raw archived markup rather than
the derived extract. `wayback-releases-20260723141013.raw.html` contains
`<article id="article-07202026d">` carrying `<h2>tvOS 26.6 RC (23L772)</h2>` and
the date line `July 20, 2026`, in Apple's own page as captured on 2026-07-23.
`j-mr-2606-rc-outofscope.raw.html` is a MacRumors article published 2026-07-20
that reports the same candidate wave, though it gives no build number, so 23L772
rests on Apple's listing alone. `assignment.json` genuinely contains no tvOS 26.6
candidate: its six 26.6 targets are Beta 1 through Beta 5 and Public, with stable
event IDs `m0`–`m4` and `m6`, leaving `m5` unallocated.

**The conclusion does not hold.** A published `releaseEvent` for this appearance
already exists in the production dataset. A read-only query returns
`release-event-899d78bd5b6c7e22ddbb6d02`, stable event ID
`version-tvos-26-6:m5`, label `RC`, route alias `rc`, channel
`releaseCandidate`, appearance date `2026-07-20`, editorial review status
`approved`, an 874-character article body, four citations and two changes. It is
absent from the assignment because the coordinator's export selects only
*incomplete* events, and this one is complete. Every other tvOS 26.x event has an
empty article body, which is why the sequence gap looked like an absence.

So `gap-2606-pub-missing-rc-target` is not `material`,
`requiresChronologyReview` should be `false`, and the statement that "the 26.6
cycle's page set will have a hole between the fifth beta and the general
release" is incorrect. **No production chronology correction is required and this
should not be escalated as one.**

One genuine residual remains, and it is small: production carries no build
document for 23L772 — the only tvOS 26.6 build record is 23L773 — and the
existing RC article states explicitly that no build number is projected onto that
event. The evidence retained in this batch would support adding it. That is an
enrichment, not a chronology fix.

#### 2. The three production locator corrections — all confirmed

**`disagreement-2604-consumer-page-subheading-locators`: correct.** In the raw
capture of Apple's consumer update page, the element sequence around the version
is `<p>` (26.5 body), `<h2 class="gb-header">tvOS 26.4</h2>`,
`<p class="gb-paragraph">`, `<h2 class="gb-header">tvOS 26.3</h2>`, `<p>`. The
tvOS 26.4 section is one heading and one paragraph of three sentences, with
nothing between them. No heading anywhere on the page reads "Audio" or "TV app".
Bold pseudo-subheadings do exist elsewhere on the page — under tvOS 26.2 and
tvOS 26 — but they are `<p class="gb-paragraph"><b>…</b></p>`, and none appear in
the 26.4 block. Production's two locators therefore point at structure that does
not exist.

The researcher's replacements are accurate as written, and a human editor can act
on them directly:

- audio playback fix → `Heading 'tvOS 26.4' > first sentence of the section paragraph`
- storefront consolidation → `Heading 'tvOS 26.4' > second sentence of the section paragraph`

Both underlying facts hold: sentence one records the Apple TV 4K audio playback
fix when sound transitions between programmes of differing format, and sentence
two records the removal of the iTunes Movies and TV Shows apps with content and
playback consolidated into the Apple TV app.

**`disagreement-2605-storekit-testing-heading-locators`: correct, and the
distinction matters.** Parsing Apple's DocC JSON for the tvOS 26.5 release notes
gives this heading tree: `H2 Overview`; `H3 StoreKit` with `H4 New Features` and
`H4 Resolved Issues`; `H3 StoreKit Testing in Xcode` with `H4 Known Issues`;
`H3 StoreKitTest` with `H4 Resolved Issues`. There is no heading named "StoreKit
Testing" on its own. The two items production groups under that name live in two
different sections:

- known issue 175848494 / FB22647785 (subscription price changes not observed) → `StoreKit Testing in Xcode > Known Issues`
- resolved issue 172583218 / FB22237318 (SKTestSession configuration selection) → `StoreKitTest > Resolved Issues`

"StoreKitTest" is the framework; "StoreKit Testing in Xcode" is the Xcode
feature. Collapsing them would misstate the document. Both facts hold, and the
packet's own citations already use the corrected forms.

#### 3. The two build changes — confirmed, with no speculation about cause

Every build number was checked in the raw markup rather than the extract:

| Claim | Raw evidence | Result |
| ----- | ------------ | ------ |
| tvOS 26.4 RC 23L240 on 2026-03-18 | source-010, `<h2>tvOS 26.4 RC (23L240)</h2>`, `article-date` "March 18, 2026" | confirmed |
| tvOS 26.4 shipped 23L243 on 2026-03-24 | source-012, `<h2>tvOS 26.4 (23L243)</h2>`, `article-date` "March 24, 2026" | confirmed |
| tvOS 26.6 RC 23L772 on 2026-07-20 | source-023, `<h2>tvOS 26.6 RC (23L772)</h2>`, `article-date` "July 20, 2026" | confirmed |
| tvOS 26.6 shipped 23L773 on 2026-07-27 | source-009, `<h2>tvOS 26.6 (23L773)</h2>`, `article-date` "July 27, 2026" | confirmed |

No "RC 2" entry for either cycle appears in any retained capture, supporting the
"no revised candidate was listed" finding.

**No unsupported reason is asserted anywhere.** A scan of every string in
`findings.json` for causal and speculative language returned 22 hits, all benign:
references to the documented withdrawal of the iTunes storefront apps, explicit
prohibitions ("must not assert a reason, a respin, or a withdrawn candidate"),
and two instances of "likely" that appear inside locators quoting a source
paragraph's opening words rather than in the packet's own voice. The packet says
the identifiers differ and stops there, which is the correct boundary.

One minor citation-precision note: in
`disagreement-2604-rc-build-versus-shipped-build`, position two cites source-011
and source-012 jointly. Source-011, captured 2026-03-24 at 08:39 UTC, supports
only "no revised candidate had been listed"; the 23L243 build appears in
source-012. The pair supports the composite position, but splitting the citations
would be cleaner.

### What needs to change before this packet can be approved

1. Rewrite `gap-2606-pub-missing-rc-target` and
   `disagreement-2606-missing-rc-appearance` to reflect that the tvOS 26.6
   candidate already exists in production as an approved event dated 2026-07-20.
   Downgrade the gap from `material`, set `requiresChronologyReview` to `false`,
   remove the claim that the page set has a hole, and narrow the residual finding
   to the missing 23L772 build document.
2. Correct `tvos-26-4-public-occurrence-audio-format-transition`: scope
   `applicability.models` to Apple TV 4K, matching Apple's sentence, its own
   summary and `concept-appletv-audio-format-transition-playback`; and reword the
   trigger from a soundtrack encoding changing mid-stream to sound transitioning
   between programmes of differing format.

Optionally, update `maximumUnquotedSourceOverlapWords` from 4 to 5 and split the
source-011 / source-012 citation pairing noted above.

Nothing else in the packet needs to change. The other twelve targets, all 44
sources, all 22 concepts and all 220 citations were checked and stand.

### Reviewer validation

- [x] Exact target closure — 14/14, identity fields compared field by field
- [x] Every claim and occurrence cited — 220 citation objects, all resolving
- [x] Locators independently resolved — 20 sampled across every source class
- [x] Source metadata, lineage and timestamps checked
- [x] Raw and selected-text hashes reproduced — 88/88, nine double-checked
- [x] Recurrence and inheritance reviewed — 0 referential errors
- [ ] Source qualifications retained — one device-scope over-broadening
- [x] Copyright similarity passed — 0 six-word runs outside source titles
- [x] JSON parsed and controlled values validated — 0 violations
- [x] No Sanity write, apply, approval, or deployment performed
- [ ] Escalated production findings all hold — two of three hold; the missing-RC
      claim is refuted by the production dataset

## Coordinator resolution

Status: **readyForEditorialReview** (2026-07-30T22:15:00Z)

Independently re-verified the missing-RC claim before touching anything — not by trusting either
the researcher or the reviewer, but by directly querying Sanity (`tmp/verify-266-rc.ts`). Confirmed
a `releaseEvent` for tvOS 26.6 RC already exists (`routeAlias: rc` under `version-tvos-26-6`),
`reviewStatus: approved`, 874-character article, 4 citations.

Applied both required corrections:

1. `disagreement-2606-missing-rc-appearance` and `gap-2606-pub-missing-rc-target` rewritten to
   record the appearance as already published rather than missing. `requiresChronologyReview` set
   to `false`; gap downgraded to `nonMaterial`; residual note narrowed to the separate question of
   whether a `releaseBuild` document exists for build 23L772 specifically.
2. `tvos-26-4-public-occurrence-audio-format-transition`: verified directly against
   `tmp/research-evidence/apple-tvos-26-b/apple-tv-software-updates.selected.txt` line 18
   ("sound transitions between programs with different formats, like Dolby Atmos and stereo").
   Removed Apple TV HD from `applicability.models` (Apple's text names Apple TV 4K only) and
   reworded the trigger to match the source exactly.

Also applied the optional `maximumUnquotedSourceOverlapWords` correction (4 → 5) per the reviewer's
recomputation. No other target, claim, occurrence, citation, or source was touched.

**Process-boundary note for future waves:** the missing-RC claim wasn't a researcher error — a
research-only agent has no way to distinguish "not in my assignment because it's out of scope" from
"not in my assignment because it doesn't exist" without direct Sanity access, which it correctly
does not have. The exact same false alarm was independently raised by the sibling
`apple-macos-26-b` batch (different platform, different sources) and has been corrected there too.
Kickoff prompts for future waves should state this boundary explicitly.

This packet is now queued for the page-build stage.
