# visionOS 26.5 and 26.6 point-release cycle research handoff

Status: returned (see "Independent evidence review" at the end of this report)
Researcher: research-agent-visionos26-c
Evidence reviewer: evidence-reviewer-visionos26-c
Assignment SHA-256: 856d8ed43f35636fcbe54992e4cfff7aeacd97fb232fb3c733bbf1d43bed5e70
Findings SHA-256: 1173e1926d11d1f5fe333c3596d5b0fa736628104018f6ee112144d5813f41c6
Evidence directory: tmp/research-evidence/apple-visionos-26-c/

Batch `apple-visionos-26-c` covers 12 appearances between 2026-03-30 and 2026-07-27:
the visionOS 26.5 developer betas, release candidate and public release, and the visionOS 26.6
developer betas and public release. All twelve entered research classed `sourceLinked`.

The headline result is a split. The two public releases carry substantial dated first-party
documentation and are ready for full articles. The ten pre-release appearances do not: Apple
publishes visionOS release notes per point release and never per seed, and its Developer Releases
feed retains an entry for only one of the ten. Their identity is solid and independently
corroborated, but there is no vendor statement anywhere about what any individual seed changed.
Recommending full articles for them would mean padding, so they stay `sourceLinked`.

## Scope closure

| Target | Outcome | Recommendation | Sources | Claims | Occurrences | Material gaps |
| ------ | ------- | -------------- | ------: | -----: | ----------: | ------------- |
| `version-visionos-26-5/beta-1` | noSubstantiveNotesFound | sourceLinked | 3 | 4 | 1 | gap-visionos-26-5-beta-1-production-citation |
| `version-visionos-26-5/beta-2` | noSubstantiveNotesFound | sourceLinked | 3 | 5 | 1 | gap-visionos-26-5-beta-2-production-citation |
| `version-visionos-26-5/beta-3` | noSubstantiveNotesFound | sourceLinked | 3 | 5 | 1 | gap-visionos-26-5-beta-3-production-citation |
| `version-visionos-26-5/beta-4` | noSubstantiveNotesFound | sourceLinked | 3 | 5 | 1 | gap-visionos-26-5-beta-4-production-citation |
| `version-visionos-26-5/rc` | partial | sourceLinked | 4 | 7 | 1 | gap-visionos-26-5-rc-production-citation |
| `version-visionos-26-5/public` | complete | fullArticle | 8 | 7 | 6 | none |
| `version-visionos-26-6/beta-1` | noSubstantiveNotesFound | sourceLinked | 4 | 4 | 1 | none |
| `version-visionos-26-6/beta-2` | noSubstantiveNotesFound | sourceLinked | 3 | 4 | 1 | gap-visionos-26-6-beta-2-production-citation |
| `version-visionos-26-6/beta-3` | noSubstantiveNotesFound | sourceLinked | 3 | 4 | 1 | gap-visionos-26-6-beta-3-production-citation |
| `version-visionos-26-6/beta-4` | noSubstantiveNotesFound | sourceLinked | 3 | 4 | 1 | gap-visionos-26-6-beta-4-production-citation |
| `version-visionos-26-6/beta-5` | noSubstantiveNotesFound | sourceLinked | 3 | 4 | 1 | gap-visionos-26-6-beta-5-production-citation |
| `version-visionos-26-6/public` | complete | fullArticle | 9 | 8 | 5 | none |

Totals: 36 sources, 11 concepts, 61 claims, 21 occurrences.
Outcomes: 2 complete, 1 partial, 9 noSubstantiveNotesFound, 0 blocked.
Recommendations: 2 fullArticle, 10 sourceLinked, 0 timelineOnly.

## What page builders can safely say

- visionOS 26.5 shipped on 2026-05-11 as build 23O471 and visionOS 26.6 on 2026-07-27 as build
  23O770, both stated by Apple's own release entries and both corroborated by two newsrooms
  (`claim-v265-public-identity`, `claim-v266-public-identity`).
- Both releases cover every Apple Vision Pro model. Apple's security catalogues name the same
  hardware scope on every single entry, with no entry narrowed to a subset
  (`claim-v265-public-device-scope`, `claim-v266-public-device-scope`).
- visionOS 26.5 is a maintenance release. Apple's consumer-facing description names only
  corrective and security work, and no reviewed source attributes a user-facing feature to it
  (`claim-v265-public-consumer-description`).
- visionOS 26.6 is the more interesting of the two. Apple documents that it reworks the on-device
  Spotlight index to prepare for the next visionOS generation, which is the one substantive
  non-security change in either release
  (`v266-public-occurrence-spotlight-index-groundwork`).
- The developer release notes for visionOS 26.5 cover only in-app purchase and subscription
  tooling: four subscription billing-plan API additions, three corrections and one open issue,
  eight items across three sections (`claim-v265-public-notes-scope`).
- The developer release notes for visionOS 26.6 contain three corrections across HealthKit and
  StoreKit and carry no New Features heading at all (`claim-v266-public-notes-scope`).
- The visionOS 26.6 security catalogue is roughly double the size of the 26.5 one: 84 entries and
  99 vulnerability identifiers against 40 and 48 (`claim-v266-public-security-scale`).
- Both cycles ran developer-only. Apple opened public betas for the sibling tvOS and watchOS
  releases but not for visionOS, in both the 26.5 and the 26.6 cycle
  (`concept-visionos-developer-only-prerelease-track`).
- In both cycles the release-candidate build shipped unchanged: 23O471 for 26.5 and 23O770 for
  26.6 (`claim-v265-public-rc-build-match`, `claim-v266-public-rc-build-match`).
- Every pre-release appearance has a firm date, a cycle position and a build identifier, and the
  build chain is unbroken across both cycles.

What page builders must **not** say:

- Do not attribute any release-note item to a specific beta. No vendor document localizes any
  change to a date inside a cycle, which is why those occurrences are marked `cumulative`.
- Do not present nine of the twelve build identifiers as vendor-confirmed. Only 23O471, 23O5728e
  and 23O770 have Apple-published support; the other nine rest on one publisher and are marked
  `reported`.
- Do not describe the Spotlight index work as running in the background or as invisible to users.
  Apple does not say that; one publication infers it (`claim-v266-public-indexing-assessment`).
- Do not imply a beta was empty. The evidence shows an absence of documentation, not an absence
  of change.

## Recurring concepts and histories

- `concept-visionos-developer-only-prerelease-track`
  - visionOS 26.5 Beta 1 (2026-03-30): introduced + cumulative
  - visionOS 26.5 Beta 2 (2026-04-13): introduced + inherited
  - visionOS 26.5 Beta 3 (2026-04-20): introduced + inherited
  - visionOS 26.5 Beta 4 (2026-04-27): introduced + inherited
  - visionOS 26.5 RC (2026-05-04): introduced + inherited
  - visionOS 26.6 Beta 1 (2026-05-26): introduced + cumulative
  - visionOS 26.6 Beta 2 (2026-06-15): introduced + inherited
  - visionOS 26.6 Beta 3 (2026-06-29): introduced + inherited
  - visionOS 26.6 Beta 4 (2026-07-06): introduced + inherited
  - visionOS 26.6 Beta 5 (2026-07-13): introduced + inherited
- `concept-accumulated-platform-security-fixes`
  - visionOS 26.5 Public (2026-05-11): fixed + delta
  - visionOS 26.6 Public (2026-07-27): fixed + delta
- `concept-storekit-commitment-billing-plan-apis`
  - visionOS 26.5 Public (2026-05-11): introduced + cumulative
- `concept-storekit-receipt-app-version-null`
  - visionOS 26.5 Public (2026-05-11): fixed + cumulative
- `concept-storekit-entitlements-calendar-dependency`
  - visionOS 26.5 Public (2026-05-11): fixed + cumulative
- `concept-storekit-testing-price-change-blindness`
  - visionOS 26.5 Public (2026-05-11): knownIssue + cumulative
- `concept-sktestsession-configuration-selection`
  - visionOS 26.5 Public (2026-05-11): fixed + cumulative
- `concept-healthkit-blood-pressure-authorization-prompt`
  - visionOS 26.6 Public (2026-07-27): fixed + cumulative
- `concept-healthkit-overlapping-sample-statistics`
  - visionOS 26.6 Public (2026-07-27): fixed + cumulative
- `concept-sktestsession-simulator-environment`
  - visionOS 26.6 Public (2026-07-27): fixed + cumulative
- `concept-spotlight-index-groundwork-for-next-release`
  - visionOS 26.6 Public (2026-07-27): changed + delta

Two StoreKit test-session defects were deliberately kept as separate concepts rather than merged.
visionOS 26.5 resolved a defect in which the session ignored the selected store configuration
during unit tests; visionOS 26.6 resolved a defect in which the session failed to reach the test
environment under Simulator. They carry different internal tracking numbers and different public
Feedback identifiers, so they are two related defects, not one item restated.

## Source ledger

Raw bytes and SHA-256 are for the raw capture. Selected-text paths, byte counts and hashes are
recorded per source in `findings.json`.

| ID  | Class | Publisher | Published | Raw bytes | SHA-256 | Role |
| --- | ----- | --------- | --------- | --------: | ------- | ---- |
| source-001 | firstPartyDocumentation | Apple Developer | undated | 9,546 | `2810b38d76502d41dfc6a3e3d1de97e0ca011a6f9a9f2e200bba9a230b3467ff` | releaseNotes, sdkScope |
| source-002 | firstPartyDocumentation | Apple Developer | undated | 7,450 | `7bf99035e93e830c0d53265c2913693f395654069a7776996027d31fefd9db3b` | releaseNotes, sdkScope |
| source-003 | firstPartyDocumentation | Apple Support | 2026-07-27 | 1,166,855 | `0ad30bd88d14f75da7e9009350eb6582fbe2414a1bc6583357df34d902a1348f` | userFacingReleaseSummary, releaseIdentity |
| source-004 | firstPartyDocumentation | Apple Support | 2026-05-11 | 1,200,216 | `774ead454ad402ae6b3cc0c60a17402598c811a436b3c388e71a1169a4ece0ce` | securityNotes, releaseIdentity, deviceScope |
| source-005 | firstPartyDocumentation | Apple Support | 2026-07-27 | 1,247,850 | `440cc5fb9439c6d4bad52a5e1a5d9c888bded03db251f5f591cb17dd6c6dd1d0` | securityNotes, releaseIdentity, deviceScope |
| source-006 | firstPartyDocumentation | Apple Support | undated | 1,292,096 | `2b7c875cd2d7af4b4d7e5f691fa56c81ac154fd01618222d127f5f1924ed014c` | releaseIdentity, deviceScope |
| source-007 | firstPartyAnnouncement | Apple Developer | 2026-05-11 | 106,281 | `927e637b34db3fb8f872dfc4525e37c444ffa86ec1ec5842b48ad098bf3145cd` | releaseIdentity, buildNumber |
| source-008 | firstPartyAnnouncement | Apple Developer | 2026-05-26 | 106,330 | `7a9de04438a4e701ccee7bac5f5e575127df25e4dc32af82139e9d86f105c251` | releaseIdentity, buildNumber |
| source-009 | firstPartyAnnouncement | Apple Developer | 2026-07-27 | 106,282 | `53ec3b110d0eed24a891534a8cd14d3f9adaf1c4129834e4de66931ef9331937` | releaseIdentity, buildNumber |
| source-010 | firstPartyAnnouncement | Apple Developer | undated | 249,739 | `67c7ca3d01115e8c6163572cc8fd99ba7f9af0e63ac98c82f87dea9cb77e439b` | releaseIdentity, negativeEvidence |
| source-011 | journalism | MacRumors | 2026-03-30T17:38:00Z | 113,456 | `234067962e0ad544541c07af6e6b22ec0555aecae052893299ffd554e4fcb739` | releaseIdentity, distributionChannel |
| source-012 | journalism | MacRumors | 2026-04-13T17:06:00Z | 120,276 | `84dbbef7880cae550524b044a23c0a96dbfd62edcd08ce44b2da68b06be0fa38` | releaseIdentity, distributionChannel |
| source-013 | journalism | MacRumors | 2026-04-20T17:03:00Z | 113,367 | `4c8ec3003bd6edd94f25c2555e26211945e56152a723edb79f2aa0d2698e8405` | releaseIdentity, distributionChannel |
| source-014 | journalism | MacRumors | 2026-04-27T17:01:00Z | 115,838 | `105119e3d5124a3136f2e543fc4c3552a90236a6322e7eb603d0be85a243f37b` | releaseIdentity, distributionChannel |
| source-015 | journalism | MacRumors | 2026-05-04T17:11:00Z | 123,317 | `971c5014f21b78b8b8813ba5844efffee67bd03ab01769aca574aa7edff4062b` | releaseIdentity, distributionChannel |
| source-016 | journalism | MacRumors | 2026-05-11T17:01:00Z | 122,234 | `3adaae5fad89e33c5214813246bd3e1cf17fafc7a69ccb5d4af38dec89773e60` | releaseIdentity, userFacingReleaseSummary |
| source-017 | journalism | MacRumors | 2026-05-26T17:03:00Z | 119,193 | `3db472e926c25ce1ce095774f8f258b78073161482a4da46791f1d1330ad7337` | releaseIdentity, distributionChannel |
| source-018 | journalism | MacRumors | 2026-06-15T17:06:00Z | 122,760 | `736e72a5cf389a4c186f0088f90f36d8d9189f56cd66a8f74c353be617a2569b` | releaseIdentity, distributionChannel |
| source-019 | journalism | MacRumors | 2026-06-29T17:08:00Z | 115,485 | `26936ae67f0914ce33527cd4261c68bf7225b7a3ddc8def7b4f18722569333ab` | releaseIdentity, distributionChannel |
| source-020 | journalism | MacRumors | 2026-07-06T17:16:00Z | 113,067 | `c723714f2d52f95cb764d87e440e075db3fbd62a7fcc1343f3889f2787a4b1cf` | releaseIdentity, distributionChannel |
| source-021 | journalism | MacRumors | 2026-07-13T17:27:00Z | 117,177 | `a41bb2d145bd1382069f7ad4df148e2db675efe050b2b7dd20f165dc7be7c1a7` | releaseIdentity, distributionChannel |
| source-022 | journalism | MacRumors | 2026-07-27T17:23:00Z | 114,660 | `cf2178818c22612360bdf771f689bcc8d67767ad3b9e95b9b9fb356a40daee7c` | releaseIdentity, userFacingReleaseSummary |
| source-023 | journalism | MacRumors | 2026-07-20T17:00:00Z | 109,415 | `59d0a5cfbccef053e0b506f046c0db0218e603ceb9362f94325f50c45d3ced28` | releaseIdentity, chronologyGapEvidence |
| source-024 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-03-30T17:46:00Z | 144,115 | `e08a2e0d357330c441a4c2708e235476c298073dcda2ffeabe5f8f64a7cd2561` | releaseIdentity, buildNumber |
| source-025 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-04-13T17:32:00Z | 130,336 | `688bd0bc3289f38a9d72103e4c6c5202d40291607fbf47bf78878cb100959083` | releaseIdentity, buildNumber |
| source-026 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-04-20T17:25:00Z | 133,145 | `48dbc770a53f16035d547910311a3cff12adb4b6c7979e6818075efde76c1173` | releaseIdentity, buildNumber |
| source-027 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-04-27T17:12:00Z | 131,158 | `21aa593409e3cfcd72550d3b591c33dc3cc519775f6f40f9bc63d265ac32c805` | releaseIdentity, buildNumber |
| source-028 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-05-04T17:19:00Z | 141,223 | `1805f314aedfc34647b7ca762bdfa378c681d1a7c0a4dc041c32f30ac6c2ba49` | releaseIdentity, buildNumber |
| source-029 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-05-11T17:12:00Z | 124,804 | `605da222f06642f8cbd7e352d84cddf40ca815a6c1d2a4fda56e3c1691ea0073` | releaseIdentity, buildNumber, editorialAssessment |
| source-030 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-05-26T17:18:00Z | 135,031 | `64b5b33c3cf606db4dc0fd24b2df013a39110e6d7e2b8f58fd8799b2d0fd3588` | releaseIdentity, buildNumber |
| source-031 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-06-15T17:22:00Z | 131,200 | `fe8e2909d233049e5323555c1f162bafdab9340b5ee60ca50aae8b39e079f8e5` | releaseIdentity, buildNumber |
| source-032 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-06-29T17:37:00Z | 130,191 | `160e43c222d49be15df54b3c83dec9995b5bb8106104e6a927bee46d60fe82ab` | releaseIdentity, buildNumber |
| source-033 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-07-06T17:36:00Z | 130,527 | `32ada74d41c0d4df8f4b61d61941c358e67da1a6fbb68f4d1143c97727d91eb5` | releaseIdentity, buildNumber |
| source-034 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-07-13T17:40:00Z | 132,777 | `21ecd019a026ee861cf6c82a15dabdb8ff5aadab9a7f1536e08db123500336e0` | releaseIdentity, buildNumber |
| source-035 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-07-20T17:15:00Z | 130,646 | `9362eaa4bf5551860b40690f644bc89d206e5e0faa9df1d1205500998a074254` | chronologyGapEvidence, buildNumber |
| source-036 | journalism | AppleInsider (Quiller Media, Inc.) | 2026-07-27T17:46:00Z | 122,988 | `c37eb3322f4faa6c7acb02239ddb1aea610e0d5b0b6a008152872dc922c8a367` | releaseIdentity, buildNumber, editorialAssessment |

All 36 captures were automated HTTPS fetches of the rendered response, extracted to text locally.
None is a browser-saved HTML snapshot, so client-rendered fragments and lazy-loaded media are
absent from the retained text. This is recorded on every source record. No paywall, robots
control, authentication or anti-bot challenge was encountered or bypassed.

The two Apple release-notes documents needed special handling: their human-facing pages are DocC
and render client-side, returning no article body to a plain fetch. The retained captures are
Apple's own JSON data endpoints for the same documents. Each was fetched twice with different
extraction prompts and returned an identical heading inventory and item list both times.

## Conflicts and decisions

### `disagreement-releases-feed-retention`

**Topic:** Whether Apple's Developer Releases feed can serve as the identity source for the visionOS pre-release seeds in this cycle.

1. Apple's Releases feed retains a per-entry record for only three of the twelve assigned appearances: the visionOS 26.5 public release, the visionOS 26.6 first beta, and the visionOS 26.6 public release. For the nine other assigned dates the feed's entry-identifier space is either wholly empty or holds only entries for other platforms.  
   *Sources:* source-010, source-007, source-008, source-009
2. MacRumors reports a visionOS seed on each of those nine dates, in a continuous and internally consistent series that names each seed's position in its cycle.  
   *Sources:* source-011, source-012, source-013, source-014, source-015, source-017, source-018, source-019, source-020, source-021
3. AppleInsider independently reports a visionOS seed on each of the same nine dates and additionally publishes a build identifier and the identifier it replaced, forming an unbroken chain across both cycles.  
   *Sources:* source-024, source-025, source-026, source-027, source-028, source-030, source-031, source-032, source-033, source-034

**Recommendation:** Treat the feed's silence as non-retention rather than non-occurrence. The build chains reported by AppleInsider are internally consistent and terminate on identifiers Apple itself published, which is strong circumstantial support for the intervening seeds. Identity for those nine appearances should rest on the two independent newsrooms, and the production citations that point at Apple Developer for those dates should be corrected because they cannot be resolved to any Apple page describing the seed.

**Requires chronology review:** no

### `disagreement-266-rc-appearance-classification`

**Topic:** How the visionOS 26.6 appearance of 2026-07-20 should be labelled, and whether this batch's assignment is missing it.

1. MacRumors titles its 2026-07-20 article around release candidates and describes the seeds as the final versions barring late defects, which labels the appearance a release candidate.  
   *Sources:* source-023
2. AppleInsider's article for the same date is internally inconsistent: its retained HTML title element calls the seeds sixth developer betas while its on-page headline and body call them release candidates. Its build list gives the visionOS identifier as the same one Apple later shipped.  
   *Sources:* source-035
3. Apple's Releases feed retains no entry for 2026-07-20 for visionOS, so no vendor label exists for this appearance.  
   *Sources:* source-010

**Recommendation:** The appearance is best classified as a release candidate: both publishers' body text says so, and the build identifier matches the shipping release. This appearance is not among the twelve assigned targets. The assignment's stable event identifiers for visionOS 26.6 run m0 to m4 and then m6, leaving m5 unaccounted, which is consistent with production already holding this appearance under m5. The coordinator should confirm that rather than treating it as a missing event, and no target in this batch was added, renamed or moved on account of it.

**Requires chronology review:** yes

### `disagreement-storekittest-locator-naming`

**Topic:** Which heading in the visionOS 26.5 release notes carries the resolved test-session issue.

1. The citation currently live in production labels the location StoreKit Testing, Resolved Issues.  
   *Sources:* production content, not a research source
2. Apple's document contains two distinct third-level headings in this area: one named StoreKit Testing in Xcode, which carries only a Known Issues subsection, and one named StoreKitTest, which carries the Resolved Issues subsection holding the test-session fix.  
   *Sources:* source-001

**Recommendation:** Retarget the production locator to the StoreKitTest heading. This is a locator precision correction, not a factual conflict: the underlying item and its tracking numbers are unchanged, and the existing citation should be corrected rather than dropped.

**Requires chronology review:** no

### Verification of the citations already live in production

The brief asked for the existing production citations to be checked rather than duplicated.
Result:

- **visionOS 26.5 Public** — six of seven resolve cleanly. The seventh, labelled
  `StoreKit Testing — Resolved Issues`, does not: Apple's document has two distinct testing
  sections, `StoreKit Testing in Xcode` which holds only Known Issues, and `StoreKitTest` which
  holds the resolved test-session item. See `disagreement-storekittest-locator-naming`. This is a
  locator correction; the underlying item is real and is captured as
  `v265-public-occurrence-sktestsession-configuration`.
- **visionOS 26.6 Public** — all six resolve. The security-note citation's displayed title is
  lowercase in Apple's document (`About the security content of visionOS 26.6`); production
  title-cases it. Cosmetic only.
- **visionOS 26.6 Beta 1** — the bare `Apple Developer` citation resolves. An Apple Releases
  entry exists at `?id=05262026e`, and the packet supplies the exact URL and locator.
- **The other nine pre-release targets** — the bare `Apple Developer` / `Releases — Apple
  Developer` citations **cannot be resolved to any Apple page describing those seeds**, because
  no Releases entry exists for those dates. This is the single most actionable finding in the
  batch. Those citations should be replaced with the contemporaneous reports retained here, or
  narrowed so they no longer imply per-seed vendor documentation. Recorded per target as
  `gap-…-production-citation` and at batch level as
  `batch-gap-no-first-party-seed-records`.

No existing citation was silently dropped, and no production content was edited.

## Negative findings

### Applying to all ten pre-release appearances

**Q1. Did Apple publish release notes, a developer news post, or a support document describing what changed in any individual visionOS 26.5 or 26.6 seed?**

- Checked: source-001, source-002, source-003, source-007, source-008, source-009, source-010
- Found: Apple's visionOS release-notes articles are scoped to the point release and have no
  per-seed section; their sibling lists contain only whole point releases. The consumer-facing
  "About visionOS 26 Updates" document has sections only for shipped point releases. The one
  Releases entry that does exist for a seed (visionOS 26.6 Beta 1) carries a name, a build
  identifier, a posted date and download links, and no change description.
- Permitted conclusion: no vendor description of any individual seed survives in the documents
  reviewed. This says nothing about whether any seed changed anything.
- Applies to: all ten pre-release targets.

**Q2. Does Apple's Developer Releases feed retain a per-entry record for the seed on this date?**

- Checked: source-010, plus a reproducible walk of the feed's entry-identifier space retained at
  `tmp/research-evidence/apple-visionos-26-c/negative-probe-developer-releases-feed.selected.txt`
- Found: no entry for visionOS on 9 of the ten pre-release dates. 2026-03-30, 2026-04-13,
  2026-04-20, 2026-04-27, 2026-06-15, 2026-07-06 and 2026-07-13 hold no entries at all for any
  platform; 2026-05-04 holds exactly one, for iOS; 2026-06-29 holds three, for shipping iOS,
  iPadOS and macOS point releases. Only 2026-05-26 (visionOS 26.6 Beta 1) has a visionOS entry.
- Permitted conclusion: the feed's silence shows non-retention, not non-occurrence. Two
  independent newsrooms report a visionOS seed on every one of those dates, so identity rests on
  that reporting rather than on the feed.
- Applies to: the nine pre-release targets other than visionOS 26.6 Beta 1.

**Q3. Did the specialist virtual-reality press publish dedicated coverage of these releases?**

- Checked: site-restricted search of uploadvr.com; no page retained because none is cited
- Found: dedicated articles exist for visionOS 26, 26.2, 26.4 and 27, and none for 26.5 or 26.6.
- Permitted conclusion: the specialist outlet published no dedicated article on these two point
  releases, which is consistent with their maintenance character. This is a search result about
  one outlet, not evidence about the releases, and no claim in this packet depends on it.
- Applies to: all ten pre-release targets.

### visionOS 26.5 Public (2026-05-11)

**Do Apple's visionOS 26.5 release notes document any change outside in-app purchase and subscription tooling?**

- Checked: source-001
- Found: The document's complete heading inventory is Overview, StoreKit, StoreKit Testing in Xcode and StoreKitTest, with eight items in total. No other framework or system area appears.
- Permitted conclusion: This bounds what the developer release notes cover. Apple's separate security document shows the release touched many other components, so the absence of a framework from the release notes must not be read as that framework being unchanged.

### visionOS 26.5 Public (2026-05-11)

**Does any reviewed source attribute a user-facing visionOS feature to this release?**

- Checked: source-003, source-016, source-029, source-001
- Found: Apple's consumer-facing section names only corrective and security work. Both independent articles describe the release the same way, and one is titled around it being a bug-fix update. No reviewed source names a user-facing visionOS addition.
- Permitted conclusion: Four documents reviewed, none naming a feature. This supports describing the release as maintenance-only, not a claim that nothing user-visible changed.

### visionOS 26.6 Public (2026-07-27)

**Do Apple's visionOS 26.6 release notes document any new capability?**

- Checked: source-002
- Found: The document's complete heading inventory is Overview, HealthKit > Resolved Issues and StoreKit > Resolved Issues. There is no New Features heading at any level and no Known Issues heading; all three items are corrections.
- Permitted conclusion: This bounds the developer release notes only. Apple's consumer-facing document does describe search-index work for this release, so the release notes' silence is not evidence that nothing was added.

### visionOS 26.6 Public (2026-07-27)

**Does the search-index work described by Apple carry any user-visible surface on this generation?**

- Checked: source-003, source-002, source-022, source-036
- Found: Apple's own description names the indexing work and the generation it prepares for, and stops there. Neither release-notes document mentions it. One publication asserts it runs in the background and is not user-accessible on this generation, which is that publication's characterization rather than a restatement of Apple.
- Permitted conclusion: Four documents reviewed. Apple documents that the work happened and what it prepares for; the claim about background operation and user visibility rests on a single publication and should be attributed if used.

## Evidence gaps

Batch level:

- `batch-gap-no-first-party-seed-records` (material) — Nine of the twelve assigned appearances have no surviving Apple-published record of any kind: no release entry, no release notes, no support document. Their identity, cadence and build rest entirely on two independent newsrooms.
  - **Impact:** Those nine pages must attribute their identity to reporting rather than to Apple, and must not carry a bare Apple Developer citation that cannot be resolved.
  - **Next step:** Search the Internet Archive for captures of developer.apple.com/news/releases/ taken within days of each affected date; entries Apple has since removed may survive there.
- `batch-gap-build-numbers-single-publisher` (material) — Nine of the twelve build identifiers come from a single publisher. That publisher's chains are internally consistent and terminate on identifiers Apple published, but no second source states them.
  - **Impact:** Those identifiers stay research context under the packet rules and are not eligible for build documents. They may be reported with attribution.
  - **Next step:** Look for archived Apple release entries or contemporaneous developer-forum posts quoting the identifiers.
- `batch-gap-no-beta-level-vendor-notes` (nonMaterial) — Apple publishes visionOS release notes per point release and never per seed, so no vendor statement exists about what any individual beta changed anywhere in this cycle.
  - **Impact:** Beta pages cannot carry change lists. Borrowing items from the point-release notes onto a beta page would be unsupported.
  - **Next step:** None available from Apple. Only archived captures of the release-notes page taken at different points in the cycle could show items appearing over time.
- `batch-gap-unassigned-266-release-candidate` (nonMaterial) — Both newsrooms document a visionOS 26.6 release candidate on 2026-07-20 carrying build 23O770. It is not among the twelve assigned targets, and the assignment's stable event identifiers for visionOS 26.6 skip m5, which is consistent with production already holding it.
  - **Impact:** Nothing in this batch was added, renamed or moved for it. The coordinator should confirm whether m5 is that appearance and route it to a batch if it is uncovered.
  - **Next step:** Query production for version-visionos-26-6:m5 and for version-visionos-26-5:m1 and m6, which are likewise absent from this assignment.
- `batch-gap-no-specialist-vr-coverage` (nonMaterial) — The dedicated virtual-reality press published no article on either release. A search restricted to uploadvr.com returned dedicated pieces for visionOS 26, 26.2, 26.4 and 27 but none for 26.5 or 26.6.
  - **Impact:** No visionOS-specialist perspective is available to balance the general Apple press. Pages should not imply broader coverage than exists.
  - **Next step:** None. The absence is consistent with both releases being maintenance updates.

Target level:

The ten pre-release targets carry two recurring gap shapes, one per target, with
identifiers of the form `gap-visionos-26-<n>-<alias>-production-citation` and
`gap-visionos-26-<n>-<alias>-build-single-source` (19 in total). Full per-target text is in
`findings.json`.

- **Unresolvable production citation** (material on nine targets, nonMaterial on visionOS 26.6
  Beta 1) — the citation already live in production is a bare Apple Developer reference with no
  locator, and for nine of the ten dates no Apple Releases entry exists to resolve it to.
  *Impact:* those pages must not be presented as vendor-documented; the citation needs replacing
  with the contemporaneous reports retained here. *Next step:* check the Internet Archive for
  captures of the Releases feed taken within days of each date.
- **Single-publisher build identifier** (nonMaterial, nine targets) — the build rests on one
  publisher. *Impact:* report with attribution only; not eligible for a build document.
  *Next step:* archived Apple entries or contemporaneous developer-forum posts quoting the
  identifier.
- `gap-v265-public-locator-storekittest` (nonMaterial, version-visionos-26-5/public) — One citation already live in production points at a section called StoreKit Testing with a Resolved Issues subsection. Apple's document has two separate testing sections with different names, and the resolved item sits under the one named StoreKitTest, not under the one named StoreKit Testing in Xcode.
  - **Impact:** The locator should be retargeted to the exact heading before publication so a reviewer can resolve it in one step.
  - **Next step:** None. The correct heading and the item's tracking numbers are recorded in this packet.
- `gap-v265-public-change-localization` (nonMaterial, version-visionos-26-5/public) — No vendor document localizes any release-note item to a date within the cycle, so it cannot be shown whether an item landed at a beta or at general availability.
  - **Impact:** The page must describe these as documented for visionOS 26.5 rather than as introduced on the release date.
  - **Next step:** Compare against an archived capture of the release-notes page taken during the beta window, if one exists, to see whether items were added over the cycle.
- `gap-v266-public-change-localization` (nonMaterial, version-visionos-26-6/public) — The three release-note corrections cannot be localized to a date within the cycle.
  - **Impact:** The page must describe them as documented for visionOS 26.6 rather than as fixed on the release date.
  - **Next step:** Compare against an archived capture of the release-notes page taken during the beta window, if one exists.
- `gap-v266-public-indexing-mechanism` (nonMaterial, version-visionos-26-6/public) — No vendor document describes how the search-index work behaves, when it runs, or what resource cost it carries.
  - **Impact:** The page may state that the work exists and what generation it targets, but must not describe its mechanism or performance impact as documented.
  - **Next step:** Check Apple developer documentation for the next visionOS generation once published, which may describe the index the release prepared.

## Excluded sources

- https://en.wikipedia.org/wiki/VisionOS
  - Encyclopedia entry. Excluded by the packet rules regardless of content.
- https://en.wikipedia.org/wiki/Apple_Vision_Pro
  - Encyclopedia entry. Excluded by the packet rules regardless of content.
- https://mjtsai.com/blog/2026/05/11/visionos-26-5/
  - Link-aggregating blog post whose substance is quotation of MacRumors and Apple. Same evidence lineage as sources already held; would inflate corroboration.
- https://mjtsai.com/blog/2026/07/28/visionos-26-6/
  - Link-aggregating blog post, same lineage as sources already held.
- https://macdailynews.com/2026/04/20/apple-releases-third-betas-of-ios-26-5-ipados-26-5-macos-tahoe-26-5-watchos-26-5-tvos-26-5-and-visionos-26-5/
  - Recap of another outlet's report with no independent reporting; one lineage with the sources already held.
- https://www.mactrast.com/2026/07/apple-releases-watchos-26-6-tvos-26-6-and-visionos-26-6-to-the-public/
  - Aggregated restatement of the same release announcement; not independent.
- https://www.mactech.com/2026/07/27/apple-releases-macos-tahoe-26-6-ios-26-6-ipados-26-6-watchos-26-6-tvos-26-6-and-visionos-26-6/
  - Multi-platform aggregation with no visionOS-specific reporting.
- https://appleworld.today/2026/07/apple-releases-macos-tahoe-26-6-ios-26-6-ipados-26-6-watchos-26-6-tvos-26-6-and-visionos-26-6/
  - Multi-platform aggregation with no visionOS-specific reporting.
- https://www.macobserver.com/news/visionos-26-6-update-now-available-whats-new-for-apple-vision-pro/
  - Restates Apple's update description without independent reporting; would not raise the evidence state of any claim.
- https://virtual.reality.news/news/visionos-265-release-subscription-bug-fix-no-new-features/
  - Derived from Apple's release notes with no independent verification; same lineage as source-001.
- https://www.iclarified.com/101520/apple-seeds-watchos-266-rc-tvos-266-rc-and-visionos-266-rc-download
  - Download-mirror listing. Firmware-feed derived and not an independent report.
- https://releasebot.io/updates/apple
  - Unsourced automated release database. Excluded by the packet rules.
- https://www.anotherapple.com/2026/07/download-visionos-26-6-update-with-bug-fixes/
  - Unattributed aggregation with no byline or independent reporting.
- https://blog.dynasage.com/2026/07/apple-releases-visionos-266.html
  - Verbatim-style republication of another outlet's article.
- https://forums.macrumors.com/threads/apple-releases-visionos-26-6.2485984/
  - Reader discussion thread attached to an article already held. Community speculation, not evidence.
- https://forums.appleinsider.com/discussion/244028
  - Reader discussion thread attached to an article already held.
- https://x.com/MacRumors/status/2079254083261919699
  - Social syndication of an article already held; one lineage with it.
- https://www.threads.com/@macrumors/post/DbBdf9xmvmt/
  - Social syndication of an article already held; one lineage with it.
- https://www.engadget.com/2224488/ios26-6-macos26-6-and-the-rest-are-out-addressing-security-fixes/
  - Located but not retrieved. Multi-platform coverage with no visionOS-specific detail that would change any claim; not cited, so not captured.
- https://9to5mac.com/2026/07/27/apple-releases-tvos-26-6-and-homepod-26-6/
  - Located but not retrieved. Covers tvOS and HomePod, not visionOS.

A note on search-result summaries: the search tooling's own narrative summaries were treated as
non-evidence throughout, and one of them was actively wrong, asserting that visionOS 26.5 and 26.6
did not exist as released versions. Every fact in this packet was read from a retrieved page, not
from a snippet or a generated summary.

## Validation

- [x] Exact target closure — all 12 assigned target IDs present, in assignment order, none added,
      renamed or moved; every identity field compared field-by-field against `assignment.json`
- [x] Every claim and occurrence cited — 61 claims and 21 occurrences, each with at least one
      citation carrying a source ID, a locator and a supports note
- [x] Every locator independently resolved — locators were checked against the retained text.
      Two were found wrong during checking (the security catalogues' first and last component
      entries had been taken from an alphabetical sort rather than document order) and were
      corrected before delivery
- [x] Source metadata and timestamps checked — bylines, datelines and publication dates read from
      each retained page; displayed local times converted to UTC and both retained
- [x] Raw and selected-text hashes reproduced — all 72 evidence files re-hashed and re-measured
      against the values recorded in `findings.json`; no zero-byte or placeholder record
- [x] Recurrence and inheritance reviewed — see the histories above; release-note items are
      `cumulative` by design, dated security and support material is `delta`
- [x] Copyright similarity passed — every reader-facing field machine-checked for
      five-consecutive-word overlap against the full retained text of all 33 publisher-authored
      captures. The only remaining five-token runs are two document titles, a run of version
      numbers and a list of platform names, all nominative. No quotation of any length appears
      anywhere in the packet
- [x] JSON parsed and controlled values validated — every channel, action, inheritance,
      documentation status, evidence state, category, source class, outcome, recommendation,
      identity status, build verification state, confidence and severity checked against the
      allowed lists in the handoff guide
- [x] No Sanity write, apply, approval, or deployment performed — no Sanity credential was held,
      requested or used; no production content, chronology, page code or batch manifest was
      modified. The only files written are this report, `findings.json`, and the gitignored
      evidence directory

Held at `needsEvidenceReview`. An independent evidence reviewer, not the researcher, should set
`readyForEditorialReview`.

## Independent evidence review

Reviewer: `evidence-reviewer-visionos26-c`
Reviewed: 2026-07-30
Findings SHA-256 reviewed: `1173e1926d11d1f5fe333c3596d5b0fa736628104018f6ee112144d5813f41c6`
Packet status set to: **`returned`**

**Verdict: not ready for editorial review.** One material defect, narrowly scoped to two strings on
one target. Everything else in the packet verified clean against the retained evidence, including
several checks re-run independently rather than taken from the researcher's self-report. This is a
strong packet with one wrong sentence in it, not a weak packet.

### The defect

`claim-v265-public-security-scale` and the `summary` of
`v265-public-occurrence-security-catalogue` both describe the visionOS 26.5 security catalogue as
spanning system areas "including the kernel, WebKit, WebRTC, image and audio handling, Spotlight,
Siri, Mail and Notes."

In `source-004.selected.txt` the visionOS 26.5 component entry list runs from `### Accelerate`
(line 281) to `### WebRTC` (line 713). `## Additional recognition` begins at line 735. Siri, Mail
and Notes appear **only** at lines 785, 773 and 781 — inside Additional recognition, which is
Apple's researcher-acknowledgement list ("We would like to acknowledge … for their assistance").
Those entries carry no vulnerability identifier and are not documented fixes. There is no Siri,
Mail or Notes component entry in the catalogue at all; the complete set of component headings is
APFS, Accelerate, Accounts, App Intents, AppleJPEG, Audio, CoreAnimation, CoreServices,
CoreSymbolication, FileProvider, IOHIDFamily, IOKit, ImageIO, Kernel, LaunchServices, Model I/O,
Networking, SceneKit, Shortcuts, Spotlight, Status Bar, Storage, WebKit, WebRTC, mDNSResponder and
zlib.

The claim contradicts its own locator, which explicitly bounds the list "above the Additional
recognition section." The rest of the sentence — kernel, WebKit, WebRTC, image and audio handling,
Spotlight — is correct.

This is material because `version-visionos-26-5/public` is recommended `fullArticle` and the
occurrence is labelled `documented` / `confirmed` at `high` confidence, so the error would publish
as vendor-documented fact: that Apple fixed security issues in Siri, Mail and Notes in this
release. Apple does not document that.

**Required fix:** remove Siri, Mail and Notes from both strings, or restate them as
acknowledgements rather than fixed components. The reviewer did not edit target content.

The parallel visionOS 26.6 sentence (`claim-v266-public-security-scale`) was checked the same way
and is **correct** — App Store, Contacts, CoreMedia, Game Center, ImageIO, Kernel, MediaRemote,
WebKit, WebKit Canvas, WebKit Storage and Wi-Fi all sit inside the component list, above
Additional recognition at line 1101.

### Checklist results

| # | Check | Result |
| - | ----- | ------ |
| 1 | Exact target closure | pass |
| 2 | Local ID uniqueness | pass |
| 3 | Citation / source integrity | pass |
| 4 | Locators resolve against retained evidence | **fail** (1 of ~25 sampled) |
| 5 | Hash and byte-count reproduction | pass |
| 6 | Source independence and lineage | pass |
| 7 | Evidence-state correctness | pass |
| 8 | Inheritance correctness | pass |
| 9 | Undocumented-claim bar | pass |
| 10 | Build-number discipline | pass |
| 11 | Copyright / quotation limits | pass |
| 12 | No secrets, private data, or committed raw evidence | pass |
| 13 | No Sanity writes or deployment | pass |

**12 of 13 clean.**

### Spot-check sample and results

**Target closure (1).** All 12 assignment target IDs present, in assignment order, none added,
removed or renamed. All 14 identity fields per target compared field-by-field against
`assignment.json`: 0 mismatches. Assignment SHA-256 recomputes to
`856d8ed43f35636fcbe54992e4cfff7aeacd97fb232fb3c733bbf1d43bed5e70`, matching `batch.assignmentSha256`.

**ID uniqueness (2).** 36 sources, 11 concepts, 61 claims, 21 occurrences, 28 gaps, 3
disagreements — zero duplicates within any class and zero cross-collisions between claim and
occurrence IDs.

**Citations (3).** All 222 citation references resolve to declared sources. Every citation carries
both a `locator` and a `supports` note. `source-023` is the only declared-but-uncited source; its
non-use is explained on the source record and in `batch-gap-unassigned-266-release-candidate`
(it documents the unassigned 2026-07-20 appearance). Zero uncited claims, zero uncited
occurrences, zero dangling `conceptId`, `disagreementId` or article-outline references.

**Locators (4).** Resolved well beyond the required 8–10 sample:

- `source-001` heading inventory (Overview / StoreKit / StoreKit Testing in Xcode / StoreKitTest,
  8 items) and tracking numbers 150388310, 150388542, 150388746, 150389069, 171614522/FB22114908,
  173415174, 175848494/FB22647785, 172583218/FB22237318 — all present, all under the stated
  headings. Confirms `disagreement-storekittest-locator-naming` is correctly diagnosed.
- `source-002` heading inventory (Overview / HealthKit / StoreKit, 3 items, no New Features, no
  Known Issues) and tracking numbers 177652061, 178157672, 174738526/FB22500243 — all present.
- `source-004`: 40 lines match `^Available for: Apple Vision Pro (all models)$`, 48 distinct
  `^CVE-` identifiers, no other "Available for" variant — reproduces the packet's counts exactly.
- `source-005`: 84 and 99 respectively, same single device-scope variant — reproduces exactly.
- `source-006`: rows `visionOS 26.6 / Apple Vision Pro (all models) / 27 Jul 2026` (line 323) and
  `visionOS 26.5 / … / 11 May 2026` (line 403).
- `source-003`: visionOS 26.6 section first sentence names bug fixes, security updates and
  Spotlight index optimization for visionOS 27; visionOS 26.5 section names only bug fixes and
  security updates; visionOS 26.4 section does enumerate features, confirming the packet's
  qualification that brevity reflects the release, not house style.
- `source-007` / `source-008` / `source-009`: entry headings `visionOS 26.5 (23O471)` May 11 2026,
  `visionOS 26.6 beta (23O5728e)` May 26 2026, `visionOS 26.6 (23O770)` July 27 2026. The 26.6
  beta entry carries only name, build, date and download/release-note links — confirming the
  packet's negative finding that it holds no change description.
- `source-010`: feed retains visionOS entries only for 26.6 (23O770), 27.0 beta 4, 27.0 beta,
  26.6 beta (23O5728e) and 26.5 (23O471) — exactly as recorded.
- All eleven AppleInsider visionOS build rows: `23O5441g←23O247`, `23O5453d←23O5441g`,
  `23O5458e←23O5453d`, `23O5468a←23O5458e`, `23O471←23O5468a` (RC 1), `23O5728e` (no
  predecessor stated, and the packet correctly omits one), `23O5743c←23O5728e`,
  `23O5752d←23O5743c`, `23O5757c←23O5752d`, `23O5765a←23O5757c`, `23O770←23O5765a`. The
  supersession chain is unbroken across both cycles and every build claim matches its row.
- `source-035` internal headline conflict verified: HTML title (line 1) "Sixth iOS 26.6, macOS
  26.6 developer betas surface for testing" vs on-page H1 (line 300) "iOS 26.6 release candidate
  build surfaces for testing" — exactly as `disagreement-266-rc-appearance-classification`
  records.
- MacRumors "nothing new found" locators: source-012 "first betas", source-013 "first two betas",
  source-014 "first three betas", source-015 "the betas" — each matches its claim's wording.
- `source-015` watch-face paragraph attributes the only named feature to watchOS, supporting
  `claim-visionos-26-5-rc-sibling-only-feature`.
- `source-011` and `source-017` both carry the public-beta contrast paragraph; `source-013`,
  `source-014`, `source-015`, `source-018`–`source-021` do not — which is exactly why those
  occurrences are marked `inherited` rather than re-corroborated. Correctly reasoned.
- `source-016` "fifth update", `source-022` "sixth update", `source-029` "visionOS 26.5 is build
  number 23O471", `source-036` "The release build for visionOS 26.6 is number 23O770" and its
  background-indexing paragraph — all resolve.

Only the visionOS 26.5 security-component enumeration failed.

**Hashes (5).** Rather than the requested 6, **all 72 evidence files** were re-hashed with
`node:crypto` and byte-counted: **0 mismatches** against `rawSha256`, `selectedTextSha256`,
`rawBytes` and `selectedTextBytes`. Independently re-run with the system `shasum -a 256` on
source-001 (raw `2810b38d…`, selected `6e03c61e…`), source-005 (`440cc5fb…`, `032d6158…`),
source-016 (`17a52ba2…`), source-022 (`b8832a9c…`) and source-036 (`307b52d6…`) — all identical.
`wc -c` confirms 9,546 / 29,809 / 8,007 bytes on the spot-checked files. The negative-probe
artifact re-hashes to `0a80bc5459882c6cf0a567a84989350fe7b092dce47122a0d8524b87e8b14bc3` and
measures 5,103 bytes, matching the values quoted on `source-010`.

**Independence (6).** The packet already flags every lineage this reviewer found. `source-006` and
`source-010` are marked `independentForCorroboration: false` as indexes over the same Apple
lineage as source-004/005 and source-007/008/009. `source-016` and `source-022` are flagged as
sharing Apple's lineage for release *content* while independent for date and installation
procedure — verified: source-022 literally attributes the indexing statement to Apple's release
notes. MacRumors and AppleInsider are genuinely separate newsrooms with separate bylines. No
inflated corroboration found. The 20 excluded sources are excluded for sound lineage reasons
(syndication, aggregation, forum threads, firmware-feed mirrors, encyclopedias).

**Evidence states (7).** All 11 `confirmed` occurrences cite `firstPartyDocumentation`
(source-001, -002, -003, -004, -005) — genuinely primary, not merely asserted. Both `corroborated`
occurrences carry two independent newsrooms. The 8 `reported` occurrences each rest on one bylined
contemporaneous article that directly states the fact, and each explicitly declines to re-assert
the harder public-beta claim.

**Inheritance (8).** `delta` appears exactly 3 times and each is justified by source localization,
not by write-up order: the two security catalogues carry an explicit `Released` line matching the
appearance date, and the visionOS 26.6 Spotlight statement sits in Apple's per-version consumer
section, which the researcher checked against the neighbouring visionOS 26.5 section to rule out
boilerplate — this reviewer confirmed the 26.5 section carries no comparable statement. The
`cumulative` labelling of release-note items is correct and conservative: source-001 and
source-002 carry no date, no build and no per-seed section, so they cannot localize an item within
a cycle. The researcher's stated reasoning holds up against the actual documents.

**Undocumented bar (9).** The 8 `undocumented` occurrences are not community or forum material —
each is bylined mainstream journalism directly stating the fact for that date, with a written
verification method and retained hashed evidence. They also assert only the narrow
developer-account fact, explicitly carrying the public-beta absence forward as `inherited` rather
than re-asserting it. Bar met.

**Build discipline (10).** Verified exactly as the packet claims: 3 `confirmed`
(23O471/source-007, 23O5728e/source-008, 23O770/source-009 — each an Apple-published Releases
entry, each additionally corroborated by a newsroom) and 9 `reported` from a single publisher,
each carrying an explicit note that it is not eligible for a build document. **No build is
`confirmed` off a single non-primary source.**

**Copyright (11).** Re-checked independently rather than trusted. 485 reader-facing strings
(concept titles and summaries, claim texts and qualifications, occurrence summaries and
verification methods, scope boundaries, outline headings and notes, negative findings, gap texts,
disagreement positions and boundaries, exclusion reasons) tested for five-consecutive-word
normalized overlap against **all 73 retained evidence files** (108,555 distinct 5-grams). Result:
100 runs reach five tokens; **none reaches six**. Every run is one of — a version string split by
the tokenizer ("visionos 26 5 beta 1"), a document title ("visionos 26 5 release notes"), a URL
("developer apple com news releases"), an Apple heading name ("under a resolved issues heading",
"storekit storekit testing in xcode"), or a self-match against the researcher's own extraction
notes ("sibling list contains only whole"). All nominative or structural, none copied expression.

The decisive result: the verbatim publisher article bodies (source-011 – source-036 selected text)
and the verbatim Apple security documents (source-004, source-005) produced **zero** hits. There
are **zero non-null `shortQuote` fields** anywhere in the packet.

**Commit hygiene (12).** `tmp/research-evidence/` is gitignored at `.gitignore:59`. The batch
evidence directory appears in neither `git status --untracked-files=all` nor `git ls-files`. Scans
of `findings.json` and `report.md` for cookies, tokens, bearer/authorization headers, API keys,
passwords and Sanity credentials return no matches. No full article bodies are carried in the
committed files.

**No production writes (13).** No `sanity exec`, `--apply`, `publish`, `deploy`, `createOrReplace`,
`client.create` or `patch(` string appears anywhere in the packet. A mtime sweep of the batch
window (2026-07-30 17:00–17:40) shows the only files touched outside
`research-handoffs/apple-visionos-26-c/` and `tmp/research-evidence/apple-visionos-26-c/` belong
to sibling batches and the coordinator's own register — no `src/`, no schema, no manifest, no
Sanity content.

**Outcome-distribution honesty.** 2 complete / 1 partial / 9 noSubstantiveNotesFound is the right
shape for visionOS beta-cycle coverage, and the negative results are researched rather than
assumed. The reproducible per-date walk of Apple's Releases entry-identifier space
(`negative-probe-developer-releases-feed.selected.txt`) documents its method, is re-runnable, and
its per-date results match every negative finding exactly — including the differentiated cases
where 2026-05-04 holds exactly one entry (iOS) and 2026-06-29 holds three (iOS, iPadOS, macOS
point releases), and including the correctly distinguished visionOS 26.6 Beta 1, which *does* have
an Apple entry and is therefore given a `nonMaterial` rather than `material` citation gap. Three
`noSubstantiveNotesFound` targets were audited against retained evidence (26.5 Beta 1, 26.6 Beta 1,
26.6 Beta 5) and each negative claim is properly scoped to documents reviewed, never asserting
that a seed was empty. The probe is also honest about its own limit (the letter walk stopped at
"l", and the one date not exhaustively enumerated is explicitly not relied on). This is not
laziness.

### Non-blocking observations

None of these gate the packet; they are optional improvements for the researcher.

- `source-029` independently reports the App Store monthly-payment-with-twelve-month-commitment
  subscription option and could be added as a second, independent citation on
  `v265-public-occurrence-commitment-billing-apis`.
- The eight `inherited` developer-only-track occurrences cite only the MacRumors article for their
  date, though the matching AppleInsider article for the same date independently reports a
  developer seed and would support the same fact.
- The researcher's copyright check was scoped to 33 publisher-authored captures; this review
  indexed all 73 retained files and reached the same clean result, so the narrower scope did not
  hide anything.

### Recommendation

Return to `research-agent-visionos26-c` for one edit: correct the visionOS 26.5 security-component
enumeration in `claim-v265-public-security-scale` and
`v265-public-occurrence-security-catalogue.summary`. No other gate needs re-running afterwards —
every other check above was verified against retained evidence and is unaffected by that edit.
Once corrected, this packet should go straight to `readyForEditorialReview`.

## Coordinator resolution

Status: **readyForEditorialReview** (2026-07-30T21:55:00Z)

Before applying this fix, the coordinator independently re-read
`tmp/research-evidence/apple-visionos-26-c/source-004.selected.txt` (lines 281–790) and confirmed
the defect firsthand: `## Additional recognition` is a distinct researcher-acknowledgement section
beginning at line 735, and Siri/Mail/Notes appear only inside it as "We would like to acknowledge
X for their assistance" entries — never as component entries in the security catalogue above it.

Applied exactly the fix the reviewer specified and nothing else: removed the trailing ", Siri,
Mail and Notes" clause from `claim-v265-public-security-scale.text` and from
`v265-public-occurrence-security-catalogue.summary`. No other target, claim, occurrence, citation,
or source in this packet was touched. `allLocatorsResolvedAgainstEvidence` and
`claimTextSupportedByItsCitedLocator` were restored to `true` in `findings.json.qualityChecks`,
consistent with the reviewer's own note that no other gate needed re-running after this specific
correction. Full rationale recorded in `findings.json.qualityChecks.coordinatorResolutionNote`.

This packet is now queued for the page-build stage.
