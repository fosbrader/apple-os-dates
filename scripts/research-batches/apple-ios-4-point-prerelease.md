# Apple iOS 4 point-release prerelease archive batch

## Result

`apple-ios-4-point-prerelease.json` is the approved archive batch for exact prerelease
identities attached to the existing iOS 4.1, 4.2.1, and 4.3 public parents.
The completed iOS 4.0 prerelease batch remains byte-for-byte unchanged.

- 12 editorially verified, approved, indexable archive routes
- 2 exact identities retained only as timeline
  history because they lack a verified route-specific delta
- 70 milestone occurrences across
  62 stable definitions
- 28 content-bundle sources, 31 retained
  research sources, and 211 content citation references
- zero release overlays, builds, or Public route events
- every route is `editoriallyVerified`, `approved`, and
  `isIndexable: true`

## Exact route closure

| Release   | Historical milestone     | Route alias          | Appearance | Fresh records | Disposition                                                                                                                          |
| --------- | ------------------------ | -------------------- | ---------- | ------------: | ------------------------------------------------------------------------------------------------------------------------------------ |
| iOS 4.1   | Beta 1                   | `beta-1`             | 2010-07-14 |             8 | Approved archive                                                                                                                     |
| iOS 4.1   | Beta 2                   | `beta-2`             | 2010-07-27 |             1 | Approved archive                                                                                                                     |
| iOS 4.1   | Beta 3                   | `beta-3`             | 2010-08-03 |             1 | Approved archive                                                                                                                     |
| iOS 4.1   | GM                       | `gm`                 | 2010-09-01 |             7 | Approved archive                                                                                                                     |
| iOS 4.2.1 | iOS 4.2 Beta 1           | `beta-1`             | 2010-09-15 |            17 | Approved archive                                                                                                                     |
| iOS 4.2.1 | iOS 4.2 Beta 2           | `beta-2`             | 2010-09-28 |             7 | Approved archive                                                                                                                     |
| iOS 4.2.1 | iOS 4.2 Beta 3           | `beta-3`             | 2010-10-12 |             3 | Approved archive                                                                                                                     |
| iOS 4.2.1 | iOS 4.2 GM               | `4-2-gm`             | 2010-11-01 |             8 | Approved archive                                                                                                                     |
| iOS 4.2.1 | iOS 4.2 GM Seed 2 (iPad) | `4-2-gm-seed-2-ipad` | 2010-11-12 |             0 | Timeline ledger only; the exact iPad revision is supported, but its possible Wi-Fi rationale is not a verified route-specific delta. |
| iOS 4.2.1 | GM                       | `gm`                 | 2010-11-18 |             2 | Approved archive                                                                                                                     |
| iOS 4.3   | Beta 1                   | `beta-1`             | 2011-01-12 |             8 | Approved archive                                                                                                                     |
| iOS 4.3   | Beta 2                   | `beta-2`             | 2011-01-19 |             1 | Approved archive                                                                                                                     |
| iOS 4.3   | Beta 3                   | `beta-3`             | 2011-02-01 |             0 | Timeline ledger only; the reported download-cancel behavior explicitly predates Beta 3.                                              |
| iOS 4.3   | GM                       | `gm`                 | 2011-03-03 |             7 | Approved archive                                                                                                                     |

The 4.2 cycle is attached to the local 4.2.1 public parent because the first
three betas and two initial GM states were branded **iOS 4.2**, while Apple
renamed the all-device candidate **iOS 4.2.1 GM** on November 18 and marketed
the November 22 public package as iOS 4.2. The original labels remain visible.

## Evidence method

1. iOS 4.1 retains three Betas and the Apple-confirmed GM. Beta 1 uses a
   bounded observed-change inventory; Beta 2 and Beta 3 remain sparse because
   no complete note bodies survive.
2. iOS 4.2 retains content pages for Beta 1–3, the November 1 GM, and the
   separately named 4.2.1 GM. The iPad-only November 12 revision remains an
   exact timeline identity, but its possible Wi-Fi rationale is not treated as
   a verified revision delta. A credited copy of Apple’s GM developer notes
   supplies cumulative SDK state plus two proven transitions.
3. iOS 4.3 retains content pages for Beta 1–2 and GM. Beta 3 remains in the
   timeline ledger because its only reported behavior explicitly predates that
   seed. Short Apple developer excerpts are distinguished from publisher
   observations, and the GM uses first-party Apple Developer and Newsroom
   material.
4. Cumulative GM occurrences do not move a feature’s first observed seed.
   Rumor-only subscription, unreleased resource-file, and inferred fix claims
   are excluded.

## Exact gaps and exclusions

- No defensible iOS 4.1 Beta 4, iOS 4.2 Beta 4, or iOS 4.3 Beta 4 identity was
  found; no such route is created.
- No complete Apple-hosted note body survives for any 4.1 beta, the sparse
  4.2.1 GM, or the 4.3 betas.
- The November 12 iOS 4.2 revision is iPad-only. Its identity remains
  timeline-only because the Wi-Fi report presents the revision as just one
  possible reason, not a verified change.
- iOS 4.3 Beta 3 remains timeline-only because its reported download-cancel
  behavior was already present in earlier iOS 4.3 betas.
- A companion Apple TV software seed is not an iOS change and is excluded from
  the iOS 4.3 Beta 2 page.
- Unspecified iOS 4.2 Beta 3 visual changes are not structured as a generic
  filler record.
- The November 18 report does not establish whether the cited VoIP ringer
  issue was repaired; the structured record preserves that uncertainty.
- Build numbers in journalism support source identity but are not converted
  into release-build documents.
- Public routes remain owned by the approved `apple-ios-4.json` batch.

## Copyright and attribution controls

- Titles, canonical summaries, occurrence summaries, and article prose are
  original synthesis.
- Every factual record has a claim-level citation and locator.
- The iThinkDifferent GM copy and MacStories Beta 2 excerpt identify Apple as
  author while naming the preserving publisher, making source custody clear.
- No article body, screenshot, transcript, or long quotation is committed.
- The separate evidence audit verifies raw and normalized hashes and enforces
  a maximum five-word contiguous overlap target for reader-facing prose.
- The audited maximum is four words across 364 reader-facing fields.

## Bounded recurrence model

- The iPhone 4 proximity-sensor issue is one immutable definition: a reported
  Beta 2 known issue followed by cumulative release-state corroboration at the
  iOS 4.1 GM boundary.
- The shared-printer AirPrint path is introduced in Beta 1, gains explicit host
  requirements in Beta 2, and is removed from the documented GM state.
- The iPad multitouch preview is introduced in iOS 4.3 Beta 1 and clarified in
  Beta 2 as a developer evaluation that would not ship enabled for customers.
- Device support, Personal Hotspot, third-party AirPlay video, and the
  configurable iPad side switch retain their Beta 1 first-observed state; GM
  occurrences are cumulative confirmation rather than second introductions.

## Source ledger

All 31 retained research sources were accessed on
2026-07-30. Only the 28 sources cited by archive routes
are declared in the JSON bundle; the three timeline-only identity sources
remain in this ledger and the pinned evidence corpus.

- [Apple Releases iOS 4.1 Beta and SDK to Developers](https://www.cultofmac.com/news/apple-releases-ios-4-1-beta-and-sdk-to-developers) — Cult of Mac; journalism.
- [Apple Releases iOS 4.1 Beta to Developers [Update x2]](https://www.iclarified.com/10604/apple-releases-ios-41-beta-to-developers-update-x2) — iClarified; journalism.
- [iOS 4.1 Beta Includes Apple's Announced Signal Bar Changes, New Modem Firmware](https://www.macrumors.com/2010/07/14/ios-4-1-beta-includes-apples-planned-signal-bar-changes/) — MacRumors; journalism.
- [iOS 4.1 Beta 2 now available to developers](https://techcrunch.com/2010/07/27/ios-4-1-beta-2-now-available-to-developers/) — TechCrunch; journalism.
- [Apple Releases iPhone OS 4.1 Beta 2 to Developers](https://www.macrumors.com/2010/07/27/apple-releases-iphone-os-4-1-beta-2-to-developers/) — MacRumors; journalism.
- [Apple Releases iOS 4.1 Beta 3 and Updated SDK to Developers](https://www.macrumors.com/2010/08/03/apple-releases-ios-4-1-beta-3-and-updated-sdk-to-developers/) — MacRumors; journalism.
- [Apple brengt iOS 4.1 beta 3 uit voor ontwikkelaars](https://www.iculture.nl/nieuws/apple-brengt-ios-4-1-beta-3-uit/) — iCulture; journalism.
- [iOS SDK 4.1 GM Seed Now Available](https://developer.apple.com/news/?id=09012010b) — Apple Developer; developerDocs.
- [Apple Announces Pending Release of iOS 4.1, 4.2 Coming in November](https://www.macrumors.com/2010/09/01/apple-announces-pending-release-of-ios-4-1-4-2-coming-in-november/) — MacRumors; journalism.
- [Apple’s AirPrint Wireless Printing for iPad, iPhone & iPod touch Coming to Users in November](https://www.apple.com/newsroom/2010/09/15Apples-AirPrint-Wireless-Printing-for-iPad-iPhone-iPod-touch-Coming-to-Users-in-November/) — Apple Newsroom; firstPartyAnnouncement.
- [Apple Releases First iOS 4.2 Beta for iPad, iPhone, and iPod Touch](https://www.macrumors.com/2010/09/15/apple-releases-first-ios-4-2-beta-for-ipad-iphone-and-ipod-touch/) — MacRumors; journalism.
- [First Look: iOS 4.2 beta 1](https://www.macworld.com/article/207734/firstlook_ios42b1.html) — Macworld; journalism.
- [iOS 4.2 Beta 2 and iTunes 10.1 Beta Seeded to Developers](https://www.macrumors.com/2010/09/28/ios-4-2-beta-2-and-itunes-10-1-beta-seeded-to-developers/) — MacRumors; journalism.
- [Apple Releases iOS 4.2 Beta 2, Here’s What’s New](https://www.macstories.net/news/apple-releases-ios-4-2-beta-2/) — MacStories; journalism.
- [Apple Seeds iOS 4.2 Beta 3 and iTunes 10.1 Beta 2 to Developers](https://www.macrumors.com/2010/10/12/apple-seeds-ios-4-2-beta-3-to-developers/) — MacRumors; journalism.
- [iOS 4.2 Beta 3 Changes: New SMS Tones, iPad Changes, AirPlay Missing?](https://www.macrumors.com/2010/10/12/ios-4-2-beta-changes-new-sms-tones-ipad-changes-airplay-missing/) — MacRumors; journalism.
- [Apple Releases iOS 4.2 Golden Master to Developers](https://www.macrumors.com/2010/11/01/apple-releases-ios-4-2-golden-master-to-developers/) — MacRumors; journalism.
- [Apple Has Released iOS 4.2 GM & iTunes 10.1 Beta 2 To Developers Today!](https://www.ithinkdiff.com/apple-released-ios-42-gm-itunes-101-beta-2-developers-today/) — iThinkDifferent; archive.
- [iOS 4.2 arrival near? All signs point to yes](https://www.macworld.com/article/208988/ios42_waiting.html) — Macworld; journalism.
- [Apple releases iOS 4.2.1 GM to developers](https://www.macworld.com/article/209096/ios_421.html) — Macworld; journalism.
- [Apple’s iOS 4.2 Available Today for iPad, iPhone & iPod touch](https://www.apple.com/newsroom/2010/11/22Apples-iOS-4-2-Available-Today-for-iPad-iPhone-iPod-touch/) — Apple Newsroom; firstPartyAnnouncement.
- [Apple Seeds iOS 4.3 Beta to Developers: Personal Hotspot, AirPlay Video Streaming, New iPad Gestures](https://www.macrumors.com/2011/01/12/apple-seeds-ios-4-3-beta-to-developers/) — MacRumors; journalism.
- [New iOS beta released offering new gestures, Xcode updated with AirPlay services for apps](https://www.engadget.com/2011-01-12-new-ios-beta-released-offering-new-gestures-xcode-updated-with.html) — Engadget; journalism.
- [iOS 4.3 Beta Brings Software Option for Rotation Lock or Mute on iPad](https://www.macrumors.com/2011/01/12/ios-4-3-beta-brings-software-option-for-rotation-lock-or-mute-on-ipad/) — MacRumors; journalism.
- [Apple Releases Second Beta of iOS 4.3 to Developers](https://www.macrumors.com/2011/01/19/apple-releases-second-beta-of-ios-4-3-to-developers/) — MacRumors; journalism.
- [Apple Releases iOS 4.3 Beta 2, Here’s What’s New](https://www.macstories.net/news/apple-releases-ios-4-3-beta-2/) — MacStories; archive.
- [Apple Seeds iOS 4.3 Beta 3 to Developers](https://www.macrumors.com/2011/02/01/apple-seeds-ios-4-3-beta-3-to-developers/) — MacRumors; journalism.
- [Apple releases iOS 4.3 beta 3 for developers](https://www.macworld.com/article/210444/ios_4_3-2.html) — Macworld; journalism.
- [iOS SDK 4.3 GM Seed Now Available](https://developer.apple.com/news/?id=03062011a) — Apple Developer; developerDocs.
- [Apple Seeds iOS 4.3 Golden Master to Developers](https://www.macrumors.com/2011/03/03/apple-seeds-ios-4-3-golden-master-to-developers/) — MacRumors; journalism.
- [Apple Introduces iOS 4.3](https://www.apple.com/newsroom/2011/03/02Apple-Introduces-iOS-4-3/) — Apple Newsroom; firstPartyAnnouncement.

## Closure guards

- Exact comparison against the three local seed records and their sole Public
  milestones
- Approved/indexable Public ownership assertion against `apple-ios-4.json`
- Exact 12-route content allowlist plus two disjoint timeline-only identities,
  closing all 14 named milestones without placeholder records
- Explicit no-Beta-4, no-build, no-version-overlay, and no-Public-patch boundary
- Collision scan across every other research-batch JSON
- 70 occurrences resolve to exactly
  62 stable definitions, including three bounded
  prerelease histories and four Beta 1-to-GM cumulative histories
- Complete unique source declaration/use closure
- Every claim citation resolves to its pinned artifact with at least one
  locator token and two title-or-summary tokens
- Byte-preservation assertion for all four completed iOS 4.0 artifacts
- Deterministic formatted JSON SHA-256: `7f0973674676f42a0857cccf8005277c445760da0d7ff2714e032013d81a13dc`

## Editorial approval and validation record

- provenance: `editoriallyVerified`
- editorial status: `approved`
- indexability: `true`
- reviewed at: `2026-07-30T13:16:42Z`
- independent substantive review: clean after route-specific-delta,
  cumulative-state, recurrence, platform-scope, and source-custody corrections
- evidence audit:
  31 exact raw artifacts totaling
  4,603,107 bytes and
  31 normalized text locks
- independent live re-fetch: all
  31 retained sources available;
  15 raw artifacts matched
  byte-for-byte,
  30 selected article
  boundaries matched exactly, the remaining rotating-script page reproduced
  its audited markers, and all
  31 evidence boundaries
  passed
- `npm run research:validate`:
  73 batches and
  4,214 globally
  consistent change keys
- focused ingestion/manifest suite:
  19 of
  19 passed
- full repository suite:
  131 of 131 passed
- copyright-similarity scan: maximum contiguous reader-facing overlap of
  4 words
- ESLint, Prettier check, deterministic regeneration, and
  `git diff --check`: passed

## Production dry plan

- Status: Applied and zero-residual verified on 2026-07-30
- Each of three pre-apply runs found 98 creates, four revision-guarded additive patches, and 2,118 unchanged documents.
- All three consecutive runs produced plan SHA `cd97dc6aa61d0a31232e5bc5393e637d41fed007264484060070fd1576392b2b`
- Creates: 26 sources, 12 events, and 60 changes; zero versions and zero builds
- Two previously owned Apple sources and two global changes are reused rather than duplicated
- Patches: citation unions and refreshed approved-review timestamps on two global changes plus the missing `author: Apple` field on two Apple Newsroom sources; zero semantic-definition, identity, version, event, or build patches
- Both citation unions preserve every existing citation
- All 12 projected events are `editoriallyVerified`, approved, indexable, and timestamped
- Neither timeline-only identity appears in the create plan
- Mutation payload: 200,034 bytes (5.1% of the guarded limit)
- Plan artifact SHA-256: `5c961e50a196e480b3ff4bed449f64375c991b4a22293259407da8aef779d93d`
- Rollback artifact SHA-256: `bba2490b8f8af70787c65f48bbe626eb503cc5f15f5acfd42f664231b0a434d2`
- Rollback coverage exactly matches all 98 create IDs and all four patch targets

## Publication receipt

- Sanity transaction: `F0eE6eK5XyVXtlnaoybvOv`
- applied plan SHA:
  `cd97dc6aa61d0a31232e5bc5393e637d41fed007264484060070fd1576392b2b`
- receipt SHA-256: `c7237a6c456ec218df6dc14a14087cb2be5c19b9912a9a7870650cb0e4faf0e0`
- immediate post-publication zero plan:
  `07a944462d80535ffeb2b54801968f8241b96a042fca14c2663b53f41fbb71e5`; zero creates, zero patches,
  2,220 unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `c1bbc63358fd3761957f2fb5fb6940bfd43e46cc48b3aae8a80c0f3dded93943`
- zero-plan rollback artifact SHA-256:
  `2445dd392120141dd65187d70f8245a67e843ba31e402e91cb0e55f850e926c9`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 2,027
  appearances:
  474 full articles,
  256 source-linked records,
  and
  1,297
  timeline-only records
- 625 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all three archival article sections, every expected structured
change title, References, its first cited source, and an `index, follow`
directive. No route returned placeholder copy or a `noindex` directive.

| Canonical route            | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots        |
| -------------------------- | ---: | ---------------: | ---------------: | ---------- | ------------ | ----------- | ------------- |
| `/apple/ios/4.1/beta-1/`   |  200 |              3/3 |              8/8 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.1/beta-2/`   |  200 |              3/3 |              1/1 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.1/beta-3/`   |  200 |              3/3 |              1/1 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.1/gm/`       |  200 |              3/3 |              7/7 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.2.1/beta-1/` |  200 |              3/3 |            17/17 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.2.1/beta-2/` |  200 |              3/3 |              7/7 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.2.1/beta-3/` |  200 |              3/3 |              3/3 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.2.1/4-2-gm/` |  200 |              3/3 |              8/8 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.2.1/gm/`     |  200 |              3/3 |              2/2 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.3/beta-1/`   |  200 |              3/3 |              8/8 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.3/beta-2/`   |  200 |              3/3 |              1/1 | yes        | yes          | no          | index, follow |
| `/apple/ios/4.3/gm/`       |  200 |              3/3 |              7/7 | yes        | yes          | no          | index, follow |

No deployment was performed; domain and deployment work remains scheduled
separately.

## Reproduction

```sh
node scripts/research-batches/audit-ios4-point-prerelease.mjs tmp/ios4-point-evidence
node scripts/research-batches/build-apple-ios-4-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-4-point-prerelease.mjs scripts/research-batches/audit-ios4-point-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-4-point-prerelease.mjs scripts/research-batches/audit-ios4-point-prerelease.mjs scripts/research-batches/apple-ios-4-point-prerelease.json scripts/research-batches/apple-ios-4-point-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-4-point-prerelease.json
```
