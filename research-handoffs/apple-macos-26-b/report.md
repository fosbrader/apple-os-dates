# macOS 26.4 / 26.5 / 26.6 point-release research handoff

Status: needsEvidenceReview
Researcher: research-agent-macos26-b
Evidence reviewer: pending
Assignment SHA-256: 0ec8d3c00e7f569ff33b86dcbcb484fd1012032153b3677a7c62e6a464673ebb
Findings SHA-256: a0f5a619e92ca3fc2b6de2b2c5774fa9b09cf19881b803347693e05fd50340be
Evidence directory: tmp/research-evidence/apple-macos-26-b/

## Scope closure

| Target | Outcome | Recommendation | Sources | Claims | Occurrences | Material gaps |
| ------ | ------- | -------------- | ------: | -----: | ----------: | ------------- |
| `version-macos-26-4/beta-3` | complete | fullArticle | 7 | 3 | 2 | macos-26-4-beta-3-seed-delta |
| `version-macos-26-4/beta-4` | complete | fullArticle | 5 | 3 | 1 | none |
| `version-macos-26-4/rc` | complete | fullArticle | 9 | 3 | 3 | none |
| `version-macos-26-4/public` | complete | fullArticle | 11 | 3 | 20 | none |
| `version-macos-26-5/beta-1` | complete | fullArticle | 6 | 3 | 0 | none |
| `version-macos-26-5/beta-2` | noSubstantiveNotesFound | sourceLinked | 7 | 2 | 0 | none |
| `version-macos-26-5/beta-3` | noSubstantiveNotesFound | sourceLinked | 6 | 1 | 0 | none |
| `version-macos-26-5/beta-4` | noSubstantiveNotesFound | sourceLinked | 6 | 2 | 0 | none |
| `version-macos-26-5/rc` | complete | fullArticle | 6 | 3 | 0 | macos-26-5-rc-shared-build-risk |
| `version-macos-26-5/public` | complete | fullArticle | 11 | 3 | 7 | none |
| `version-macos-26-6/beta-1` | complete | fullArticle | 6 | 3 | 1 | macos-26-6-beta-1-beta1-notes-capture |
| `version-macos-26-6/beta-2` | noSubstantiveNotesFound | sourceLinked | 7 | 2 | 0 | none |
| `version-macos-26-6/beta-3` | noSubstantiveNotesFound | sourceLinked | 6 | 2 | 0 | none |
| `version-macos-26-6/beta-4` | noSubstantiveNotesFound | sourceLinked | 7 | 3 | 0 | none |
| `version-macos-26-6/beta-5` | noSubstantiveNotesFound | sourceLinked | 8 | 3 | 0 | none |
| `version-macos-26-6/public` | complete | fullArticle | 10 | 3 | 7 | macos-26-6-public-rc-not-in-chronology |

Totals: 56 declared sources, 33 concepts, 42 claims, 41 occurrences, 16 confirmed build findings.

## What page builders can safely say

- Every one of the sixteen assigned appearances has its date and build confirmed against a dated capture of Apple's own release listing, and the assigned date matches Apple's listing in all sixteen cases. No identity conflict was found.
- Confirmed builds, in assignment order: 26.4 Beta 3 = 25E5223i; 26.4 Beta 4 = 25E5233c; 26.4 RC = 25E243; 26.4 Public = 25E246; 26.5 Beta 1 = 25F5042g; 26.5 Beta 2 = 25F5053d; 26.5 Beta 3 = 25F5058e; 26.5 Beta 4 = 25F5068a; 26.5 RC = 25F71; 26.5 Public = 25F71; 26.6 Beta 1 = 25G5028f; 26.6 Beta 2 = 25G5043d; 26.6 Beta 3 = 25G5052e; 26.6 Beta 4 = 25G5057c; 26.6 Beta 5 = 25G5065a; 26.6 Public = 25G72.
- The macOS 26.5 release candidate and the macOS 26.5 public release carry the same build, 25F71. They remain two separate appearances; the shared build is a fact about the build, not a reason to merge them (`claim-macos-26-5-rc-same-build-shipped`).
- The macOS 26.4 and macOS 26.6 cycles both revised their build after the release candidate: 25E243 became 25E246, and 25G70 became 25G72 (`claim-macos-26-4-rc-build-differs`, `claim-macos-26-6-public-build-changed-after-rc`).
- Apple's first seed in a cycle carries no ordinal in Apple's own listing. Both 26.5 and 26.6 begin with a seed Apple simply calls "beta" (`claim-macos-26-5-beta-1-apple-label`, `claim-macos-26-6-beta-1-apple-label`).
- macOS 26.4 is the substantive consumer release of the three. Apple itemises seven user-facing enhancements for it and none for 26.5 or 26.6 (`macos-26-4-public-occurrence-charge-limit` and siblings; `claim-macos-26-5-public-thin-user-summary`).
- Exactly one prerelease occurrence in this batch is a delta: the deprecation-alert fix reported for the first 26.6 seed (`macos-26-6-beta-1-occurrence-intel-misid`, evidence state `reported`, resting on one outlet's description of that seed's notes). All six other prerelease occurrences are cumulative, because Apple's surviving notes are version-scoped and cannot show which seed first carried an item.
- Beyond that single reported item, no feature or fix may be presented as new in a beta or release candidate in this batch.
- Three Apple document families independently agree on each public release date: the archived release listing, the per-version security document, and the security release index.

## Recurring concepts and histories

- `concept-smb-dns-srv-discovery`: introduced in macOS 26.5 (delta, `macos-26-5-public-occurrence-smb-srv`) then shipped disabled by default in macOS 26.6 (delta, `macos-26-6-public-occurrence-smb-srv-default`). Apple's own 26.6 entry names 26.5 as the introducing release, so the continuity is first-party, not inferred.
- `concept-intel-only-plugin-misidentification`: reported in the first 26.6 seed's notes (delta, reported, `macos-26-6-beta-1-occurrence-intel-misid`) and present in the shipped 26.6 notes (cumulative, confirmed, `macos-26-6-public-occurrence-intel-misid`).
- `concept-rosetta-usage-awareness`: carried by the 26.4 cycle at the third seed, the fourth seed, and the release candidate (all cumulative), and established as a delta at the 26.4 public release where Apple documents it in both the developer and enterprise notes.
- `concept-battery-charge-limit`: cumulative at the 26.4 third seed and release candidate; delta at the 26.4 public release, where Apple's requirements page names the version floor.
- `concept-window-resize-pointer-corner-shape`: cumulative at the 26.4 release candidate, delta at the 26.4 public release. Reporting records that the previous point release had listed it as fixed and then reclassified it as open, so this is a reopened defect rather than a first sighting.

## Source ledger

| ID | Class | Publisher | Published | Raw bytes | SHA-256 | Role |
| --- | ----- | --------- | --------- | --------: | ------- | ---- |
| `source-001` | developerDocs | Apple Developer | unknown | 20873 | `36711b13229e288b…` | releaseNotes, knownIssues, deprecations |
| `source-002` | developerDocs | Apple Developer | unknown | 9306 | `bfd939961634856b…` | releaseNotes |
| `source-003` | developerDocs | Apple Developer | unknown | 7703 | `3ce058f7fa172790…` | releaseNotes, deprecations |
| `source-010` | firstPartyDocumentation | Apple Support | 2026-07-27 | 1163272 | `204d746fed2174a2…` | userFacingChanges |
| `source-011` | firstPartyDocumentation | Apple Support | 2026-07-27 | 1157578 | `a1c55ab4f52bdaef…` | enterpriseChanges |
| `source-012` | firstPartyDocumentation | Apple Support | 2026-04-06 | 1151182 | `57f90c464586d610…` | featureRequirements |
| `source-013` | firstPartyDocumentation | Apple Support | 2026-06-15 | 1143449 | `535b4259ad2db57f…` | featureRequirements |
| `source-014` | firstPartyDocumentation | Apple Support | 2026-02-04 | 1142875 | `32abf61e7d30f94d…` | negativeEvidence |
| `source-015` | firstPartyDocumentation | Apple Support | 2026-07-30 | 1292096 | `2b7c875cd2d7af4b…` | releaseIdentity |
| `source-016` | firstPartyDocumentation | Apple Support | 2026-03-24 | 1255375 | `0b250559bcffb6d4…` | securityContent, releaseIdentity |
| `source-017` | firstPartyDocumentation | Apple Support | 2026-05-11 | 1237515 | `0af9c6597e09d295…` | securityContent, releaseIdentity |
| `source-018` | firstPartyDocumentation | Apple Support | 2026-07-27 | 1310401 | `3655024382682240…` | securityContent, releaseIdentity |
| `source-arc-whatsnew-20260514` | archive | Internet Archive (Wayback Machine) | 2026-05-14 | 143802 | `d94bac467a2707ca…` | negativeEvidence |
| `source-arc-20260306174503` | archive | Internet Archive (Wayback Machine) | 2026-03-06 | 218389 | `943a8fc4e94667b0…` | releaseIdentity, buildNumber |
| `source-arc-20260311030511` | archive | Internet Archive (Wayback Machine) | 2026-03-11 | 218356 | `0e84f79426e541f6…` | releaseIdentity, buildNumber |
| `source-arc-20260317163634` | archive | Internet Archive (Wayback Machine) | 2026-03-17 | 218360 | `99920e33aea19edc…` | negativeEvidence |
| `source-arc-20260320172902` | archive | Internet Archive (Wayback Machine) | 2026-03-20 | 218321 | `2effc310e9552b72…` | releaseIdentity, buildNumber |
| `source-arc-20260325125905` | archive | Internet Archive (Wayback Machine) | 2026-03-25 | 218237 | `bc879d637aad7ba4…` | releaseIdentity, buildNumber |
| `source-arc-20260331151719` | archive | Internet Archive (Wayback Machine) | 2026-03-31 | 226548 | `eb3ca4dfeebc2ab9…` | releaseIdentity, buildNumber |
| `source-arc-20260409192906` | archive | Internet Archive (Wayback Machine) | 2026-04-09 | 226591 | `8fad6875b025f9cd…` | negativeEvidence |
| `source-arc-20260414185650` | archive | Internet Archive (Wayback Machine) | 2026-04-14 | 226593 | `7aaca81423cb2b3e…` | releaseIdentity, buildNumber |
| `source-arc-20260422184949` | archive | Internet Archive (Wayback Machine) | 2026-04-22 | 169608 | `697dc09bf25bbacc…` | releaseIdentity, buildNumber |
| `source-arc-20260428013929` | archive | Internet Archive (Wayback Machine) | 2026-04-28 | 169608 | `f092010b888ff3ef…` | releaseIdentity, buildNumber |
| `source-arc-20260506151117` | archive | Internet Archive (Wayback Machine) | 2026-05-06 | 169483 | `9b71eef9bd5dee01…` | releaseIdentity, buildNumber |
| `source-arc-20260509090833` | archive | Internet Archive (Wayback Machine) | 2026-05-09 | 169491 | `f2afcabe04e34864…` | negativeEvidence |
| `source-arc-20260513203510` | archive | Internet Archive (Wayback Machine) | 2026-05-13 | 182896 | `92ff8e01170e5923…` | releaseIdentity, buildNumber |
| `source-arc-20260527214942` | archive | Internet Archive (Wayback Machine) | 2026-05-27 | 198990 | `227bff0f46932fe0…` | releaseIdentity, buildNumber |
| `source-arc-20260611082610` | archive | Internet Archive (Wayback Machine) | 2026-06-11 | 233438 | `d28c11e80bb45420…` | negativeEvidence |
| `source-arc-20260616043608` | archive | Internet Archive (Wayback Machine) | 2026-06-16 | 233357 | `98bf4e3bbd9ee8e9…` | releaseIdentity, buildNumber |
| `source-arc-20260703144124` | archive | Internet Archive (Wayback Machine) | 2026-07-03 | 248781 | `fa60319d89921988…` | releaseIdentity, buildNumber |
| `source-arc-20260707070803` | archive | Internet Archive (Wayback Machine) | 2026-07-07 | 248769 | `dd58d38087263232…` | releaseIdentity, buildNumber |
| `source-arc-20260714150742` | archive | Internet Archive (Wayback Machine) | 2026-07-14 | 249568 | `f748b7e5e0c1cda1…` | releaseIdentity, buildNumber |
| `source-arc-20260723141013` | archive | Internet Archive (Wayback Machine) | 2026-07-23 | 249481 | `de029881b45cd3d7…` | chronologyConflict, buildNumber |
| `source-arc-20260730114858` | archive | Internet Archive (Wayback Machine) | 2026-07-30 | 249739 | `1ffefc3827f9393c…` | releaseIdentity, buildNumber |
| `source-mr-macos-26-4-beta-3` | journalism | MacRumors | 2026-03-03T18:12:00Z | 121700 | `804765f6a3a16ce1…` | releaseTiming, cycleContext |
| `source-mr-26-4-beta-4` | journalism | MacRumors | 2026-03-09T17:10:00Z | 127292 | `0274f4426ac4a1ae…` | releaseTiming, channelBoundary |
| `source-mr-26-4-rc` | journalism | MacRumors | 2026-03-18T17:15:00Z | 124715 | `2ffa79b228c058f0…` | releaseTiming, channelBoundary |
| `source-mr-26-4-public` | journalism | MacRumors | 2026-03-24T17:08:00Z | 125349 | `b481bf81cf00821b…` | releaseTiming, userFacingChanges |
| `source-mr-26-5-beta-1` | journalism | MacRumors | 2026-03-30T17:43:00Z | 129811 | `9c9f0ed2ae969ce8…` | releaseTiming, channelBoundary |
| `source-mr-26-5-beta-2` | journalism | MacRumors | 2026-04-13T17:07:00Z | 119328 | `657ee8a770d8caf2…` | releaseTiming, negativeEvidence |
| `source-mr-26-5-beta-3` | journalism | MacRumors | 2026-04-20T17:11:00Z | 124175 | `e111bb24ee582a35…` | releaseTiming, negativeEvidence |
| `source-mr-26-5-beta-4` | journalism | MacRumors | 2026-04-27T17:07:00Z | 125154 | `a5ba9931de0e7b7f…` | releaseTiming, channelBoundary, negativeEvidence |
| `source-mr-26-5-rc` | journalism | MacRumors | 2026-05-04T17:14:00Z | 127655 | `2601a00ee1a2cf9a…` | releaseTiming, channelBoundary, negativeEvidence |
| `source-mr-26-5-public` | journalism | MacRumors | 2026-05-11T17:04:00Z | 124051 | `9c9ee3eed6934622…` | releaseTiming, userFacingChanges |
| `source-mr-26-6-beta-1` | journalism | MacRumors | 2026-05-26T17:09:00Z | 124180 | `45a39ae3cdc3f016…` | releaseTiming, channelBoundary |
| `source-mr-26-6-beta-2` | journalism | MacRumors | 2026-06-15T17:09:00Z | 120470 | `baacd1fb806bf968…` | releaseTiming, negativeEvidence |
| `source-mr-26-6-beta-3` | journalism | MacRumors | 2026-06-29T17:09:00Z | 116594 | `efd2d5bad5b6dac6…` | releaseTiming, negativeEvidence |
| `source-mr-26-6-beta-4` | journalism | MacRumors | 2026-07-06T17:18:00Z | 110702 | `f2fda8c533d3c880…` | releaseTiming, negativeEvidence |
| `source-mr-26-6-beta-5` | journalism | MacRumors | 2026-07-13T17:28:00Z | 117175 | `c55624813aa7f714…` | releaseTiming, channelBoundary, negativeEvidence |
| `source-mr-26-6-rc-notinbatch` | journalism | MacRumors | 2026-07-20T17:04:00Z | 114386 | `cfaa2b615740fe7a…` | chronologyConflict |
| `source-mr-26-6-public` | journalism | MacRumors | 2026-07-27T17:48:00Z | 124019 | `22e954402a862dea…` | releaseTiming, userFacingChanges |
| `source-9to5-26-4-beta-3` | journalism | 9to5Mac | 2026-03-03T18:11:54Z | 151795 | `79ddbc9cab8a1e2c…` | buildNumber, cycleContext |
| `source-9to5-26-4-rc` | journalism | 9to5Mac | 2026-03-18T17:14:33Z | 152461 | `cdb263ac32f474df…` | cycleContext |
| `source-9to5-26-5-beta-2` | journalism | 9to5Mac | 2026-04-13T17:07:12Z | 152781 | `d7992a735def4f29…` | cycleContext, channelBoundary |
| `source-9to5-26-6-beta-1` | journalism | 9to5Mac | 2026-05-26T17:07:35Z | 152343 | `55145d50e12c54dc…` | buildNumber, cycleContext |
| `source-9to5-26-6-beta-4` | journalism | 9to5Mac | 2026-07-06T17:21:06Z | 152432 | `fbf7e943a18dc4cf…` | buildNumber, betaAttribution |

Full 64-character hashes for both the raw capture and the extracted text are in `findings.json` under each source's `evidence` object. Selected-text captures live beside the raw captures in the evidence directory.

## Conflicts and decisions

- **disagreement-266-release-candidate-missing** — Whether the macOS 26.6 cycle included a release-candidate appearance between the fifth developer seed and the public release.
  - Apple's dated release listing records a macOS 26.6 release candidate, build 25G70, on 20 July 2026, and an independent outlet reported the same candidate that day. (`source-arc-20260723141013`, `source-mr-26-6-rc-notinbatch`)
  - The assignment's macOS 26.6 sequence runs from the fifth developer seed on 13 July 2026 directly to the public release on 27 July 2026, with no release-candidate target. (production state; no packet source)
  - Recommendation: Keep every assigned target exactly as assigned. Record the candidate as a chronology gap for the coordinator to resolve outside this batch. No page in this batch may claim the candidate appearance, and the 26.6 cycle should not be described as a complete chronology until the coordinator rules. **Requires chronology review.**
- **disagreement-whatsnew-fixes-locator** — Whether production's cited locators for a fixes sub-section under macOS Tahoe 26.5 and 26.6 on Apple's consumer what's-new page resolve.
  - Production records citations to that page with locators naming a fixes sub-section for both versions. (production state; no packet source)
  - Both the live page and a retained capture taken three days after the 26.5 release show a single generic sentence under each of those version headings, with no sub-heading of any kind. (`source-010`, `source-arc-whatsnew-20260514`)
  - Recommendation: Do not drop the underlying facts. Re-point those citations to the enterprise page, which does itemise fixes for both versions, or to the version heading itself on the consumer page. The existing citations should be corrected rather than deleted.
- **disagreement-source-titles-drift** — Whether two Apple support sources cited in production carry the titles production recorded for them.
  - Production records the sources as titled for setting a charge limit and for managing automatic startup. (production state; no packet source)
  - The pages that carry the cited facts display different titles: the battery page covers optimised charging together with the charge ceiling, and the start-up page is phrased around turning on a desktop Mac without its power button. The underlying requirement statements do resolve on both pages. (`source-012`, `source-013`)
  - Recommendation: Keep both citations and correct the recorded titles and locators to the displayed headings. The cited facts are sound; only the source metadata drifted.
- **disagreement-264-relnote-locators** — Whether production's locators into Apple's macOS 26.4 developer notes match the document's headings.
  - Production records locators for that document naming a file systems and storage area and a MIDI area. (production state; no packet source)
  - The retained document has no heading by either name. The equivalent content sits under a resource-fork heading and a CoreMIDI heading. (`source-001`)
  - Recommendation: Re-point the two locators to the document's actual headings. The cited content exists; only the heading names were paraphrased.
- **disagreement-265-power-control-framing** — How the macOS 26.5 desktop power change should be described.
  - One outlet describes it as letting desktop Mac owners power off or restart through assistive accessories. (`source-9to5-26-6-beta-1`)
  - Apple's own support page describes an energy setting that starts an eligible desktop Mac when power is connected or restored, and names the qualifying model years. (`source-013`)
  - Recommendation: Use Apple's description and its model qualifications. Do not repeat the accessory framing, which no first-party document in this packet supports.
- **disagreement-265-rc-article-slug** — A publisher URL that names a different version from the article it serves.
  - The MacRumors article covering the macOS 26.5 release candidate has a URL slug naming 26.4. (`source-mr-26-5-rc`)
  - The article's headline, body, and publication date all describe the macOS 26.5 release candidate of 4 May 2026, matching Apple's listing for that date. (`source-mr-26-5-rc`, `source-arc-20260506151117`)
  - Recommendation: Treat the slug as a publisher error. Cite the article for the 26.5 candidate and note the slug so a later reviewer does not read it as a version conflict.

## Negative findings

- **version-macos-26-4/beta-3** — Did Apple publish a release-note document specific to the macOS 26.4 third developer seed?
  - Checked: `source-001`, `source-010`, `source-011`
  - Result: Apple's surviving 26.4 documents are version-scoped: the developer release notes, the user-facing what's-new entry, and the enterprise entry each describe macOS 26.4 as a whole, with no seed-level subdivision.
  - Boundary: Limited to the three Apple documents named. It does not establish that Apple never posted seed-level notes behind the developer download page, only that none survives in the reviewed corpus.
- **version-macos-26-4/beta-4** — Was any macOS 26.4 change attributed specifically to the fourth developer seed?
  - Checked: `source-mr-26-4-beta-4`, `source-001`, `source-010`
  - Result: The seed-day report repeats the cycle summary used for the previous seed and adds no seed-specific finding; Apple's version-scoped documents make no seed-level attribution.
  - Boundary: Limited to the reviewed report and Apple documents. It does not establish that nothing changed in the build.
- **version-macos-26-4/rc** — Did Apple document what changed between the release candidate and the public release?
  - Checked: `source-001`, `source-010`, `source-011`, `source-016`
  - Result: None of the reviewed Apple documents describes a difference between the candidate and the public build; the developer notes, user-facing list, enterprise list, and security document all describe macOS 26.4 as one version.
  - Boundary: Limited to the four Apple documents reviewed. The differing build numbers show a change occurred but not what it was.
- **version-macos-26-4/public** — Does Apple's user-facing what's-new entry for this version mention the battery charge ceiling?
  - Checked: `source-010`, `source-012`
  - Result: The seven enhancement items under the 26.4 heading do not name the feature; the requirement statement appears only on the dedicated battery support page.
  - Boundary: Limited to these two Apple pages as captured on 30 July 2026. Apple edits both documents over time.
- **version-macos-26-4/public** — Did the 26.4 cycle produce any macOS-specific release candidate beyond the one on 18 March 2026?
  - Checked: `source-arc-20260320172902`, `source-arc-20260325125905`
  - Result: The listing shows one 26.4 candidate followed by the public release; no second candidate row appears for macOS in either snapshot.
  - Boundary: The listing retains only the most recent prerelease per track, so this shows no candidate superseded the first one before the public release.
- **version-macos-26-5/beta-1** — Did any contemporaneous source identify a user-facing change introduced by this seed?
  - Checked: `source-mr-26-5-beta-1`, `source-mr-26-5-beta-2`, `source-9to5-26-5-beta-2`, `source-002`
  - Result: The seed-day report offered only expectations about future capability, and the two following-seed reports state that no new feature was found in this seed. Apple's developer notes for the version cover only store-related frameworks and make no seed-level attribution.
  - Boundary: Limited to the reviewed reports and Apple's retained 26.5 developer notes. It does not establish that the build contained no changes.
- **version-macos-26-5/beta-2** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-5-beta-2`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-5/beta-3** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-5-beta-3`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-5/beta-4** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-5-beta-4`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-5/rc** — Was any macOS 26.5 change attributed specifically to the release candidate?
  - Checked: `source-mr-26-5-rc`, `source-002`, `source-011`
  - Result: The candidate-day report repeats that no new feature had been found across the cycle's seeds, and Apple's version-scoped documents make no candidate-level attribution.
  - Boundary: Limited to the reviewed report and Apple documents.
- **version-macos-26-5/public** — Does Apple's user-facing what's-new page contain a fixes sub-section for this update?
  - Checked: `source-010`, `source-arc-whatsnew-20260514`
  - Result: Both the live page and a capture taken three days after release show a single generic sentence under the 26.5 heading with no sub-heading of any kind.
  - Boundary: Limited to this Apple page. Other Apple documents do itemise fixes for this update, and the enterprise page is where they appear.
- **version-macos-26-5/public** — Does the Apple page about preventing laptop start-up support a change specific to this version?
  - Checked: `source-014`
  - Result: That page ties its behaviour to an earlier macOS generation and names no 26.5 requirement; the desktop start-up page is the one that names this version.
  - Boundary: Limited to these two Apple pages; it resolves which page supports a 26.5 claim, not whether other start-up behaviour changed.
- **version-macos-26-6/beta-1** — Is there a retained capture of the macOS 26.6 developer release notes as they stood at the first seed?
  - Checked: `source-003`
  - Result: Only the shipped version of the notes was retrievable; the live document reflects the released 26.6 SDK and carries no seed history or revision marker.
  - Boundary: Limited to the live Apple document. A Wayback capture of the notes page from late May 2026 was not located during this batch and remains a concrete next step.
- **version-macos-26-6/beta-2** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-6-beta-2`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-6/beta-3** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-6-beta-3`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-6/beta-4** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-6-beta-4`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-6/beta-5** — Did Apple or a contemporaneous outlet attribute any change to this seed?
  - Checked: `source-mr-26-6-beta-5`, `source-002`, `source-003`, `source-010`, `source-011`
  - Result: The seed-day report repeats the cycle-level observation that no new feature had been found in the preceding seeds. Apple's version-scoped documents for this cycle make no seed-level attribution.
  - Boundary: Limited to the named report and Apple documents. It does not establish that the build was unchanged from its predecessor.
- **version-macos-26-6/public** — Did Apple publish an itemised consumer change list for this update?
  - Checked: `source-010`
  - Result: The 26.6 heading carries one sentence covering fixes, security, and search-index preparation, with no enumerated list.
  - Boundary: Limited to this Apple page as captured on 30 July 2026.
- **version-macos-26-6/public** — Does production's cited locator for a fixes sub-section under this version resolve?
  - Checked: `source-010`, `source-011`
  - Result: No sub-heading exists beneath the 26.6 entry on the consumer page; the itemised fixes for this version appear on the enterprise page instead.
  - Boundary: Limited to these two Apple pages; the underlying facts are available, but under a different document and heading.

## Evidence gaps

### Batch level

- **batch-gap-no-seed-scoped-notes** (material) — Apple's surviving release-note documents for 26.4, 26.5, and 26.6 are version-scoped. No capture of any of those documents as they stood during a beta period was located, so per-seed first appearance is unresolved across all thirteen prerelease targets in this batch.
  - Effect on page building: No beta or release-candidate page may claim a feature or fix as its own delta. Cycle state must be labelled as inherited or cumulative.
  - Next step: Query the Internet Archive for captures of the three macOS release-notes documentation pages dated inside each beta window.
- **batch-gap-266-release-candidate** (material) — A macOS 26.6 release candidate, build 25G70, appeared on 20 July 2026 and has no target in this assignment.
  - Effect on page building: The 26.6 cycle cannot be presented as a complete chronology until the coordinator rules on the missing appearance.
  - Next step: Coordinator decision on whether to add the appearance; supporting evidence is already retained in this batch.
- **batch-gap-interleaved-point-releases** (nonMaterial) — Four macOS point releases fall between assigned targets and are outside this batch: 26.4.1 on 9 April 2026, 26.4.2 in the same window, 26.5.1 on 1 June 2026, and 26.5.2 on 29 June 2026. The last of these shipped on the same day as an assigned seed.
  - Effect on page building: Timeline copy must not fold these into an assigned appearance, particularly for the third 26.6 seed which shares its date with 26.5.2.
  - Next step: Confirm these are assigned to another batch before the family is presented as complete.
- **batch-gap-consumer-summaries-thin** (nonMaterial) — Apple's consumer what's-new page gives 26.5 and 26.6 one generic sentence each, so consumer-facing detail for those two releases is far thinner than for 26.4.
  - Effect on page building: Do not compensate by importing enterprise or developer wording into consumer-facing prose without attributing it to the document that carries it.
  - Next step: None; this reflects what Apple published.

### Target level

- **gap-macos-26-4-beta-3-seed-delta** (material, affects `version-macos-26-4/beta-3`) — No evidence separates what changed in this seed from the state of the preceding seed. Effect: The page must not claim any feature or fix as new in this appearance. Next step: Check whether an archived capture of the macOS 26.4 developer release-notes page exists dated between 3 and 9 March 2026, which would show the note body as it stood at this seed.
- **gap-macos-26-4-beta-4-build-single-source** (nonMaterial, affects `version-macos-26-4/beta-4`) — The build for this seed rests on Apple's preserved listing alone; no second lineage restates it. Effect: Present the build as Apple-stated rather than independently corroborated. Next step: Check the 9to5Mac seed-day article for 9 March 2026, which for other seeds in this cycle restates the build.
- **gap-macos-26-4-rc-rc-to-public-delta** (nonMaterial, affects `version-macos-26-4/rc`) — The substance of the change between build 25E243 and build 25E246 is unknown. Effect: The page may note that the builds differ but must not characterise the difference. Next step: Compare Apple's security document for 26.4 against any candidate-period security note, if one is ever published.
- **gap-macos-26-4-public-seed-attribution** (nonMaterial, affects `version-macos-26-4/public`) — Apple's documents attribute every 26.4 item to the version, not to a seed, so per-seed first appearance is unresolved for the whole cycle. Effect: Beta pages in this cycle must not claim these items as their own deltas. Next step: Look for archived captures of the 26.4 developer release-notes page taken during the beta period.
- **gap-macos-26-5-beta-1-speculation-excluded** (nonMaterial, affects `version-macos-26-5/beta-1`) — The seed-day report speculates about assistant capability that later reporting did not confirm for this cycle. Effect: The page must not repeat the speculation; only the dated, confirmed identity facts may be used. Next step: None required; the speculative passage was deliberately not carried into any claim.
- **gap-macos-26-5-beta-2-no-seed-notes** (nonMaterial, affects `version-macos-26-5/beta-2`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-5-beta-3-no-seed-notes** (nonMaterial, affects `version-macos-26-5/beta-3`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-5-beta-4-no-seed-notes** (nonMaterial, affects `version-macos-26-5/beta-4`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-5-rc-shared-build-risk** (material, affects `version-macos-26-5/rc`) — The candidate and the public release share build 25F71, which invites an incorrect merge of the two appearances. Effect: The page builder must keep the two events separate and must not treat the shared build as evidence that they are one release. Next step: None; the distinction is already established by two dated listing snapshots.
- **gap-macos-26-5-public-rcs-and-live-activities** (nonMaterial, affects `version-macos-26-5/public`) — One outlet attributes encrypted messaging interoperability and third-party accessory activities in Europe to this version, but no second source and no Apple document in the reviewed corpus supports either for the Mac. Effect: Neither may be stated on the page. Next step: Check Apple's feature-availability pages and European regulatory notices for a Mac-scoped statement.
- **gap-macos-26-5-public-power-control-framing** (nonMaterial, affects `version-macos-26-5/public`) — The same outlet describes the desktop power change as operating through assistive accessories, which is not how Apple's support page frames it. Effect: Use Apple's framing only; do not repeat the accessory description. Next step: None; Apple's page is the better-supported description.
- **gap-macos-26-6-beta-1-beta1-notes-capture** (material, affects `version-macos-26-6/beta-1`) — The seed-level attribution of the deprecation-notice fix rests on one outlet's description of the first seed's notes. Effect: State the attribution as reported rather than confirmed, and do not claim the seed introduced anything else. Next step: Query the Internet Archive for captures of Apple's macOS 26.6 developer release-notes page dated between 26 May and 15 June 2026.
- **gap-macos-26-6-beta-2-no-seed-notes** (nonMaterial, affects `version-macos-26-6/beta-2`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-6-beta-3-no-seed-notes** (nonMaterial, affects `version-macos-26-6/beta-3`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-6-beta-4-no-seed-notes** (nonMaterial, affects `version-macos-26-6/beta-4`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-6-beta-5-no-seed-notes** (nonMaterial, affects `version-macos-26-6/beta-5`) — No seed-scoped release-note document survives for this appearance. Effect: The page should stay at identity depth and must not borrow a later release's notes. Next step: Check the Internet Archive for a capture of the cycle's developer release-notes page dated within this seed's window.
- **gap-macos-26-6-public-rc-not-in-chronology** (material, affects `version-macos-26-6/public`) — Apple issued a macOS 26.6 release candidate, build 25G70, on 20 July 2026, and the assignment's 26.6 sequence goes straight from the fifth seed to this public release. Effect: This page should not absorb the candidate. The gap needs a coordinator decision before the cycle is presented as complete. Next step: Escalate to the coordinator to decide whether a release-candidate appearance should be added to the 26.6 chronology outside this batch.

## Excluded sources

- https://developer.apple.com/news/releases/rss/releases.rss — Apple's release feed was consulted while locating material, but it carries only a filtered slice of recent items and omitted every macOS entry needed for this batch, including all six 26.6 developer seeds. The dated listing captures were used instead and no evidence file was retained for the feed.
- https://www.macrumors.com/2026/03/04/apple-releases-macos-tahoe-26-4-public-beta-3/ — Covers the public beta that followed the assigned developer seed by a day. That is a different appearance and is not an assigned target.
- https://www.macrumors.com/2026/05/28/apple-seeds-ios-26-6-public-beta-1/ — Covers the first public beta of the 26.6 cycle, which is a different appearance from the assigned developer seed.
- https://forums.macrumors.com/threads/macos-tahoe-26-4-bug-fixes-changes-and-more.2479854/ — Reader forum thread. Individual observations without bylines or verification do not meet the bar for an undocumented change.
- https://techpp.com/2025/02/04/how-to-stop-macbook-from-turning-on-automatically-when-lid-is-open/ — Third-party how-to predating this batch's window and unrelated to any assigned appearance.
- https://iboysoft.com/howto/disable-macbook-boot-on-lid-open.html — Undated third-party how-to with no contemporaneous relationship to any assigned appearance.
- https://www.macrumors.com/roundup/macos-26/ — Continuously edited roundup page with no fixed publication date; unsuitable for dating an appearance or attributing a change.

## Method notes for the reviewer

- Apple's developer release-notes pages render on the client, so the three release-note sources were captured from Apple's public documentation data endpoint and rendered to headings and list items. The canonical URL recorded for each is the human-readable page.
- Apple's release news pages resolve only while an entry stays in the current listing window; requesting an older identifier silently returns the current index. Historical dates and builds therefore come from dated Internet Archive captures of Apple's listing, with Apple as author and the archive as retaining host.
- That listing keeps only the most recent prerelease per OS track. An entry's absence from a later snapshot means it was superseded, not that it never existed. Three snapshots were captured specifically to support negative findings about intervals between seeds.
- All captures were automated HTTPS fetches of rendered text rather than browser-saved HTML sessions. Several Apple support documents are edited in place, so a reviewer re-fetching them may see different bytes; the archived listing captures are byte-stable and are the better verification target.
- The longest normalised word run shared between any reader-facing text in this packet and any retained source capture is 5 words, measured across all 56 selected-text captures. No marked short quotations were used anywhere in the packet.
- All 222 citations were machine-checked so that each locator resolves to a literal anchor — a heading, a byline line, a build number, an Apple issue identifier, or a listing row — present in the cited source's retained text.

## Validation

- [x] Exact target closure
- [x] Every claim and occurrence cited
- [x] Every locator independently resolved
- [x] Source metadata and timestamps checked
- [x] Raw and selected-text hashes reproduced
- [x] Recurrence and inheritance reviewed
- [x] Copyright similarity passed
- [x] JSON parsed and controlled values validated
- [x] No Sanity write, apply, approval, or deployment performed

Packet status is held at `needsEvidenceReview`. Only an independent evidence reviewer or the coordinator may raise it to `readyForEditorialReview`.

## Independent evidence review

Reviewer: `evidence-reviewer-macos26-b`
Reviewed: 2026-07-30
Verdict: **returned** — 12 of 13 reviewer checks pass. The evidence layer is sound and needs no rework; two targets carry an outcome or coverage recommendation the packet's own evidence does not support.
Assignment SHA-256 at review: `0ec8d3c00e7f569ff33b86dcbcb484fd1012032153b3677a7c62e6a464673ebb`
Findings SHA-256 after this review section was recorded: `221a9428477c9c88c134dd95d6abe8108358939da58495f79536109922e85733`
(The findings hash quoted at the top of this report, `a0f5a619…`, was verified as correct for the packet as delivered, before the reviewer wrote `batch` and `qualityChecks`.)

This review was performed without relying on the packet's self-reported `qualityChecks`. Every figure below was recomputed.

### Checklist verdict

| # | Reviewer check (handoff "Validation before delivery") | Result |
| - | ----------------------------------------------------- | ------ |
| 1 | Assignment target IDs equal findings target IDs exactly | pass |
| 2 | All local IDs unique | pass |
| 3 | Every citation's `sourceId` exists | pass |
| 4 | Every declared source used, or non-use explained | pass |
| 5 | Every exact locator resolves in retained evidence | pass |
| 6 | Every `corroborated` item has two independent sources or a reproducible method | pass |
| 7 | Every `confirmed` item has direct primary support | pass |
| 8 | Every undocumented claim passes the stricter community rule | pass |
| 9 | Repeated concepts have recurrence history and correct inheritance | pass |
| 10 | Build, region, device, language and audience qualifications retained | pass |
| 11 | Reader-facing text within the five-word source-overlap limit | pass |
| 12 | No placeholder, secret, credential, private datum or raw copyrighted document | pass |
| 13 | No production Sanity write or deployment | pass |
| — | Final research outcome for each target (handoff §8, reviewer duty) | **fail** |

### What was recomputed

- **Target closure.** 16 assignment IDs versus 16 findings IDs, set-equal, no additions, removals, renames or moves. All 14 identity fields per target (`platformId`, `platform`, `platformSlug`, `releaseVersionId`, `version`, `stableEventId`, `label`, `routeAlias`, `channel`, `appearanceDate`, `sequence`, `isRevision`, `availabilityState`, `closesReleaseCycle`) compared field-by-field against `assignment.json`: zero mismatches.
- **Local IDs.** 198 IDs across sources, concepts, targets, claims, occurrences, disagreements and gaps; 198 distinct. No collisions.
- **Citation integrity.** 222 citations. Zero unresolvable `sourceId`s, zero missing or stub locators, zero missing `supports` notes, zero `shortQuote` values (so the 15-word quotation cap is not engaged anywhere). All 56 declared sources are cited; all 33 concepts are referenced by at least one occurrence.
- **Evidence hashes.** All 112 retained files (56 raw, 56 selected text) recomputed: **112/112 SHA-256 and byte counts match**, zero mismatches, zero missing files. Ten were additionally re-checked with the `shasum -a 256` binary rather than a reimplementation: `source-macos-26-4-relnotes.raw.json`, `source-macos-26-4-relnotes.selected.txt`, `source-support-whatsnew-macos26.selected.txt`, `source-devreleases-20260723141013.selected.txt`, `source-mr-26-6-rc-notinbatch.raw.html`, `source-mr-26-6-rc-notinbatch.selected.txt`, `source-9to5-26-4-rc.selected.txt`, `source-arc-support-122868-20260514233708.selected.txt`, `source-support-charge-limit.selected.txt`, `source-security-macos-26-6.selected.txt`. All ten matched.
- **Locators.** All 222 were machine-checked against the cited source's retained text; 219 resolved automatically and 3 were confirmed by hand. The three are the `source-015` security-index rows, whose locators use a pipe separator for what the capture renders as three consecutive lines — they resolve at lines 126–128 (26.4), 85–87 (26.5) and 26–28 (26.6). **222/222 resolve.**
- **Locator spot-checks against document structure.** Every heading-and-issue-number locator into `source-001` was read against the retained text and all ten resolve exactly: Address Sanitizer 171762808, AppKit 149726089, Background Assets 164498466, CoreMIDI 118728162, External Boot 170263142, Internet Accounts 168082477, Resource fork 156896699, Rosetta 169228455, StoreKit 148858551, Virtualization 169654019. Twelve archived listing-row locators were verified line-by-line, including the negative-check snapshots for 17 March, 9 April, 9 May and 11 June 2026.
- **Researcher-computed counts.** The security-scope claims are independently reproducible: 26.4 gives 83 distinct CVE identifiers across 120 component entries (claim says 83 / roughly 120), 26.5 gives 79 across 95 (claim says 79 / roughly 95), 26.6 gives 153 across 167 (claim says 153 / roughly 167). `claim-macos-26-4-public-enterprise-scope` says eleven enterprise items for 26.4; the retained capture carries exactly eleven.
- **Copyright.** A 5-gram index was built over all 56 selected-text captures and every reader-facing string in the packet was tested. Twelve runs reach exactly five normalised words, which the handoff permits; all are unavoidable factual or nominative phrasings such as "developers and public beta testers" and "for platform single sign on". One run reaches six tokens — "apple released macos tahoe 26 6" — but only because normalisation splits the version number; read naturally it is the five-token nominative phrase "Apple released macOS Tahoe 26.6". No marked short quotations exist anywhere in the packet. Treated as pass.
- **Secrets and committed evidence.** No API key, token, cookie, credential or private contact datum in the packet; the only match for a secret-like pattern is the `containsNoSecretsOrPrivateData` field name. Longest string value in `findings.json` is 474 characters and is the researcher's own reviewer note, so no raw source body was pasted in. `tmp/research-evidence/` is gitignored (`.gitignore:59`) with zero tracked files.
- **No Sanity write or deployment.** No file outside `tmp/` and `research-handoffs/` was modified during the batch window of 17:01–17:42 apart from Next.js dev-cache artifacts. The modified `scripts/` and `src/sanity/` files in the working tree all date from 29 July, a day before this batch. No file anywhere in the repository references `apple-macos-26-b`, so no ingestion manifest, Sanity plan or publication artifact was produced.

### The nine "complete" targets under extra scrutiny

Seven hold up. `version-macos-26-4/public` (20 occurrences), `version-macos-26-5/public` (7) and `version-macos-26-6/public` (7) are carried almost entirely by Apple first-party documents with exact heading-and-issue-number locators, and every `delta`/`confirmed` label traces to an Apple document that states the fact for that version. `version-macos-26-4/rc` and `version-macos-26-4/beta-3` are honest: their occurrences are all `cumulative`, and each `scopeBoundary` forbids the page from claiming novelty. `version-macos-26-4/beta-4` and `version-macos-26-5/rc` are thinner but carry genuine cited context beyond identity — for the 26.5 candidate, the shared build 25F71 and the first-party negative check that iOS and iPadOS received a second candidate on 8 May 2026 while macOS did not.

Two do not hold up, and both inflate the completion rate:

- **`version-macos-26-5/beta-1` — `complete`/`fullArticle` is not supportable.** Zero occurrences. All three claims are release identity or context about the appearance itself: the date, Apple's unnumbered label for the first seed, and the public beta's shared build. Its own negative finding records that the two following-seed reports state no new feature was found in this seed. This is the same evidence profile as the seven targets the packet classifies as `noSubstantiveNotesFound`/`sourceLinked`, and it is exactly the case the handoff names: "Do not recommend a full article simply because an identity source exists." Should be `noSubstantiveNotesFound`/`sourceLinked`.
- **`version-macos-26-6/beta-1` — `complete` should be `partial`.** Its single occurrence is the batch's only prerelease `delta`; the evidence state is `reported`, it rests on one outlet's description of a release-notes document nobody retained, and `gap-macos-26-6-beta-1-beta1-notes-capture` is severity `material` with an unperformed next research step. That is the handoff definition of `partial`. The `fullArticle` recommendation may stand.

Two other `material` gaps were examined and do **not** warrant a downgrade. `gap-macos-26-4-beta-3-seed-delta` describes a boundary the packet resolves as unknowable and then handles, by labelling everything `cumulative` and forbidding novelty claims. `gap-macos-26-6-public-rc-not-in-chronology` is a production chronology issue, not an evidence gap in the target.

### The six disagreements, verified independently

1. **`disagreement-266-release-candidate-missing` — confirmed, and the packet does not overstate it.** `assignment.json` independently confirmed to contain no 26.6 release-candidate `targetId`: the 26.6 family runs beta-1, beta-2, beta-3, beta-4, beta-5, public. The retained evidence supports the stronger claim, not merely "no RC was assigned to me". Apple's own listing archived on 23 July 2026 carries the row `July 20, 2026 | macOS 26.6 RC (25G70) | article-07202026c`, and MacRumors published "Apple Seeds macOS Tahoe 26.6 Release Candidate" on Monday 20 July 2026 at 10:04 am PDT, describing a candidate issued to developers a week after the fifth beta. Two lineages, first-party and independent, agree on date and build. The packet states this correctly as a chronology gap for the coordinator and explicitly refuses to add the target itself, which is the right boundary. The same 20 July listing snapshot also shows sibling `tvOS 26.6 RC (23L772)`, consistent with the separate tvOS batch, but the macOS finding stands on its own two sources.
2. **`disagreement-whatsnew-fixes-locator` — confirmed, both halves.** Production records locators `macOS Tahoe 26.5 — Fixes` and `macOS Tahoe 26.6 — Fixes` against Apple's consumer what's-new page. In the live capture, the `macOS Tahoe 26.5` heading is followed by one sentence and the `macOS Tahoe 26.6` heading by one sentence, with no sub-heading beneath either. The page demonstrably does use sub-headings where they exist — the 26.2 entry has four. The archived 14 May 2026 capture, taken three days after 26.5 shipped, shows the same single sentence, so the locator was not correct-then-edited-away. The proposed replacement is accurate: the enterprise page does itemise fixes for both versions, eight items under 26.5 and five under 26.6.
3. **`disagreement-264-relnote-locators` — confirmed, both halves.** Production records locators naming a "File systems and storage" area and a "MIDI" area in Apple's macOS 26.4 developer notes. The retained document's complete heading list is Address Sanitizer, AppKit, Background Assets, CoreMIDI, External Boot, External Media, FSKit, Installation, Internet Accounts, Login, macOS Recovery, Networking, Printing, Resource fork, Rosetta, StoreKit, SwiftUI, Virtualization. Neither production heading exists. The proposed replacements are correct: the storage content sits under `Resource fork`, whose item opens by naming file systems without native extended-attribute support, and the MIDI content under `CoreMIDI`.
4. **`disagreement-source-titles-drift` — confirmed, both halves.** Production records "Set a Charge Limit on Mac"; the page's displayed title is "About Optimized Battery Charging and Charge Limit on Mac". Production records "Manage Automatic Startup on Mac"; the displayed title is "Turn on a Mac mini, Mac Studio, or iMac without pressing its power button". Both production locators are paraphrases rather than displayed headings. The underlying facts do resolve, exactly where the packet says: the requirement line under the `Charge Limit` heading, and `System requirements` plus `Set your Mac to start up when power is connected` on the start-up page. Correcting rather than deleting is the right call.
5. **`disagreement-265-rc-article-slug` — confirmed.** The MacRumors article is served from `.../2026/05/04/macos-tahoe-26-4-rc/` while its headline, byline of Monday 4 May 2026, and body all describe the macOS Tahoe 26.5 release candidate, matching Apple's listing row `May 4, 2026 | macOS 26.5 RC (25F71)`. Publisher slug error, correctly diagnosed. Note that this disagreement concerns one of the packet's own new sources rather than an existing production citation.
6. **`disagreement-265-power-control-framing` — confirmed; the rejected framing really is unsupported.** The rejected source is `source-9to5-26-6-beta-1`, which says the setting "lets Mac mini, Mac Studio, and iMac users power off or restart their devices via assistive accessories". Apple's own page describes the opposite action by a different mechanism: an Energy setting named "Start up when power is connected" that turns the computer **on** when power is connected or restored, with no accessory involved, qualified to macOS 26.5 or later on Mac mini 2024 or later, Mac Studio 2025 or later, and iMac 2024 or later. This is a substantive contradiction in both direction and mechanism, not a preference for a more convenient source. The rejection is also proportionate: the packet still uses that same article for the maintenance-cycle expectation and as one of the two independent attributions for Suggested Places in Maps, rejecting only the one framing.

### Corrections required before this packet can be raised to `readyForEditorialReview`

1. `version-macos-26-5/beta-1`: `researchOutcome` → `noSubstantiveNotesFound`, `coverageRecommendation` → `sourceLinked`.
2. `version-macos-26-6/beta-1`: `researchOutcome` → `partial`. `fullArticle` may stand.
3. `coverageSummary` → complete 7, partial 1, noSubstantiveNotesFound 8, blocked 0, recommendedFullArticle 8, recommendedSourceLinked 8. Update the scope-closure table above to match.
4. `gap-macos-26-5-rc-shared-build-risk`: severity `material` → `nonMaterial`. Its own next step is "None", so it is a page-building caution, not an unresolved gap. The 26.5 candidate's `complete`/`fullArticle` outcome is supported and should not change.
5. `disagreement-265-rc-article-slug`: add the second instance. `source-mr-26-6-rc-notinbatch` is served from a slug ending `apple-seeds-macos-tahoe-26-6-beta-6` while the article is the 26.6 release candidate. Recording only the 26.5 case leaves this one readable as a version conflict by a later reviewer — which matters, because that source is one of the two pillars of the missing-RC finding.
6. Method note above: the packet has 56 selected-text captures, not 55.

None of these requires new research. Items 1–4 are field edits, item 5 adds a position to an existing disagreement, item 6 is a typo.

### Observation outside this batch

`.gitignore` covers only six named `tmp/` subdirectories. `tmp/ios4-evidence/`, `tmp/ios4-point-evidence/`, `tmp/ios7-point-evidence/`, `tmp/ios9-point-evidence/` and `tmp/pdfs/` hold raw publisher captures and page images and are **not** ignored, so a broad `git add` would commit raw copyrighted evidence. This batch's own evidence directory is correctly ignored and nothing from it is staged; the ignore rule should still be widened.

## Coordinator resolution

Status: **readyForEditorialReview** (2026-07-30T22:45:00Z)

Independently re-verified the most consequential correction (`version-macos-26-5/beta-1`) against
`findings.json` before applying anything: confirmed zero occurrences, three identity/context-only
claims, and a `negativeFindings` entry stating two following-seed reports found no new feature in
this seed — the same evidence profile as the batch's other seven `noSubstantiveNotesFound` targets.

Applied all six `requiredCorrections` from the independent review verbatim, nothing more:

1. `version-macos-26-5/beta-1`: `complete`/`fullArticle` → `noSubstantiveNotesFound`/`sourceLinked`.
2. `version-macos-26-6/beta-1`: `complete` → `partial` (`fullArticle` recommendation unchanged).
3. `coverageSummary` recomputed: complete 7, partial 1, noSubstantiveNotesFound 8, recommendedFullArticle 8, recommendedSourceLinked 8.
4. `gap-macos-26-5-rc-shared-build-risk`: severity `material` → `nonMaterial`.
5. `disagreement-265-rc-article-slug`: added the `source-mr-26-6-rc-notinbatch` position and widened `recommendedBoundary` to cover both slugs.
6. This report's capture-count typo (55 → 56) fixed above.

`qualityChecks.outcomeClassificationConsistent` set to `true`; full rationale in
`findings.json.qualityChecks.coordinatorResolutionNote`. No other target, claim, occurrence,
citation, or source was touched.

**Left open by design:** the macOS 26.6 release-candidate chronology gap
(`disagreement-266-release-candidate-missing` / `batch-gap-266-release-candidate`, build 25G70,
20 July 2026) is not resolved here. No `releaseEvent` target exists for it and none was fabricated,
consistent with the handoff's boundary on chronology problems. It does not block this packet, since
every *assigned* target is correctly closed — it needs a coordinator/user decision outside this
research program's authority. Reported to the user alongside the matching tvOS 26.6 finding.

### Superseding update (2026-07-30T22:20:00Z) — the chronology gap above was a false alarm

The sibling `apple-tvos-26-b` batch's independent evidence reviewer found the analogous tvOS 26.6
RC already published in production, which prompted the coordinator to directly query Sanity for
the macOS equivalent rather than assume the same held. It does: a `releaseEvent` for macOS 26.6 RC
already exists (`routeAlias: rc` under `version-macos-26-6`), `reviewStatus: approved`, with a
917-character article and 6 citations.

`disagreement-266-release-candidate-missing` and `batch-gap-266-release-candidate` were rewritten
to record this as resolved rather than an open chronology question, `requiresChronologyReview` set
to `false`, and the gap downgraded to `nonMaterial`. The only residual, non-blocking observation is
whether a separate `releaseBuild` document exists for build 25G70 specifically — unrelated to page
completeness.

Root cause, for future waves: a research-only agent cannot distinguish "not in my assignment
because it's out of scope" from "not in my assignment because it doesn't exist" without direct
Sanity access, which it correctly does not have. This is a process-boundary lesson, not a
researcher error — kickoff prompts should say this explicitly going forward.

This packet is now queued for the page-build stage.
