# Apple iPhone OS 2.0 prerelease archive batch

## Result

`apple-ios-2-prerelease.json` is the approved archive batch for eight historically defensible
iPhone OS 2.0 prerelease routes that are absent from the local seed.

- 8 identity-backed, approved, indexable archive routes and no release-version overlays
- 51 milestone-specific occurrences across 45 stable definitions
- 5 definitions are exact, SHA-guarded reuses of the existing Public owner; 40 are new and locally namespaced
- 20 declared and used sources with 310 citation references
- zero build documents, unsupported build identities, or Public-event changes
- every route is `editoriallyVerified`, `approved`, and explicitly `isIndexable: true`

## Approved route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| -------- | --------- | --------- | --------------- | ---------------: |
| iOS      | Beta 1    | `beta-1`  | 2008-03-06      |               17 |
| iOS      | Beta 2    | `beta-2`  | 2008-03-27      |                4 |
| iOS      | Beta 3    | `beta-3`  | 2008-04-08      |                5 |
| iOS      | Beta 4    | `beta-4`  | 2008-04-23      |               10 |
| iOS      | Beta 5    | `beta-5`  | 2008-05-06      |                2 |
| iOS      | Beta 6    | `beta-6`  | 2008-05-28      |                4 |
| iOS      | Beta 7    | `beta-7`  | 2008-06-09      |                3 |
| iOS      | Beta 8    | `beta-8`  | 2008-06-26      |                6 |

The local seed contains only Public on 2008-07-11. Its event remains owned by
`apple-ios-2.json` and untouched; five exact shared definition documents
receive citation unions without semantic-definition changes.

## Evidence method

1. Apple's March 6 announcement establishes the first retained enterprise, SDK, and developer-tool baseline. It does not prove that each documented behavior originated that day. Two contemporaneous hands-on reports preserve visible user-interface behavior and limitations with weaker evidence labels. Future-tense App Store distribution promises are excluded.
2. Beta 2 uses the explicit March 27 SDK milestone. The March 28 firmware report calls its subject only a new iPhone 2.0 beta firmware, so its observations retain their one-day and numbering uncertainty.
3. Beta 3 has one explicit contemporaneous firmware-and-SDK report. Only its four Exchange changes and opening-seed expiration state are retained.
4. Beta 4 separates release-note-backed simulator and signing changes from developer-discovered framework observations. Future-tense SDK entries are excluded.
5. Beta 5 remains intentionally narrow because the surviving evidence explicitly names SDK Beta 5 but no separately numbered firmware seed.
6. Beta 6 contains four independently bounded provisioning, host, and sample-package states from the May 28 package. Four location and Camera observations from a May 22 private build are excluded because build 5A292g cannot be assigned to the later Beta 6 firmware 5A308.
7. Beta 7 is an SDK-sequence milestone with maintenance, current-target support, and a cumulative Mac OS X 10.5.3 host requirement. Uncorroborated forum observations are excluded.
8. Beta 8 retains signing, developer installation, submission, and final-target states. MobileMe, bookmark, and Applications-pane text is excluded as iTunes-only behavior; anonymous stability commentary is also excluded. The route is not duplicated as a separate GM.

## Raw evidence ledger

| Milestone            | Public artifact           | Raw bytes | Raw SHA-256                                                        |
| -------------------- | ------------------------- | --------: | ------------------------------------------------------------------ |
| Beta 1               | Apple Newsroom HTML       |   134,048 | `ca6b6ff640589367f560f412afce9b3eca06b68dfbffbd7ca7716caf9b90068a` |
| Beta 1               | AppleInsider HTML         |   137,066 | `3f13d450a731853b75bef27b89729bcc19edbf263aabf44b666c6168eaa8e55c` |
| Beta 1               | Engadget HTML             |    63,567 | `c427d9d4dad7ec382c613db6b1823055f017fce930a117e33b4bfee46c17ad5e` |
| Beta 2               | iClarified HTML           |   183,327 | `22067d9943ca4ec6451c354988f29f93082e7c9eea16ddc52387ec0dfd118548` |
| Beta 2               | Macworld HTML             |   194,221 | `0cef58ec7fd793ce5230aa64ec0d583e9dcb93d5844237f1bc98f8e0db7a5051` |
| Beta 3               | MacRumors HTML            |   109,402 | `5c222d0719c77fcc3afaa0f77dc9a1e764df5de83e5af17ea8b91cb6e9b688bd` |
| Beta 4               | Ars Technica HTML         |   133,810 | `bcd6f4945d16e6ea2a3d1a6217c2b84c1801085e57a048556ed75e9285881817` |
| Beta 4               | iClarified HTML           |   180,284 | `a8221fcf523ce8049a6967ac6e6f70429c8cb9b61b5acc6e7612bbbbab7d9bf4` |
| Beta 5               | MacRumors HTML            |   107,971 | `0065d35b53e09c2160c0a992914e5b6aa66289fbe4261029f95dd6deb69bc9a7` |
| May 22 private build | AppleInsider HTML         |   133,145 | `edc1a8c6ddf96a3a18f7bc7a0e626ac0a039fbf3abb0adf4f8445586de139f14` |
| Beta 6               | Ars Technica HTML         |   133,062 | `ecf3ffc680d259011e8c9d30540e3b1404d3afe5b08bde582a543c22a08061bd` |
| Beta 6               | Engadget HTML             |    55,675 | `9af30679f22f0c00c03a520e488da6e862c0c44d8b97881c9fd53e1f34ef8f29` |
| May 22 private build | Engadget location HTML    |    57,151 | `03c64efa86b950b1e7b80bd77fd054bb76e51978aa0130f1cf703b24a88f06bc` |
| Beta 7               | Ars Technica HTML         |   130,963 | `19db44c531951fffccd27ba0ec6cc857ba2e07324d6adf4260845af0c1bef3af` |
| Beta 7               | iCulture HTML             |   513,689 | `786a3f74e03e2fd540baa74c752b596dd5d337e0600d14922b8f6d05bab71196` |
| Beta 7               | MacRumors HTML            |   110,735 | `7d48e5a259f3b94abc3006ccc78d441a1d5c622e284942c4ebc8726a7d70657c` |
| Beta 8               | MacRumors submission HTML |   111,975 | `671e95bf61bbeaba3eda3212ba51581a433236a1fae23ca487fa32738ebe51e4` |
| Beta 8               | Engadget HTML             |    59,975 | `d309f2e04b507e821cbcde1c74bf2bbe54f94f922b409174e2d196abd08de5a0` |
| Beta 8               | MacRumors seed HTML       |   111,930 | `96de4edf82ba48f526b2b92cc278bd94716b15190db0cf351420bd3c415d72b3` |
| Beta 8               | Macworld HTML             |   193,557 | `f7db6d1a587a4fcff149d90fe5b25bcb177376ce44333c55b42fbb3b83c6d446` |

The 20 selected raw artifacts total
2,855,553 bytes. The committed
audit helper also locks 20 bounded text
artifacts and verifies short metadata and subject probes. Raw publisher files
remain only in the ignored temporary evidence directory.

## Exact evidence gaps and exclusions

- No defensible build-number documents are created. Build strings in publisher reporting are not promoted to archive identities.
- Beta 2 uses March 27 for SDK Beta 2, while the selected firmware observation is dated March 28 and does not explicitly use the Beta 2 number.
- Beta 4 notes described several API changes as coming soon. Future work is not represented as completed Beta 4 behavior.
- Beta 5 has only a broad Apple-authored description preserved by contemporaneous reporting; no component-level fixes are invented.
- Beta 6's official May 28 evidence names firmware 5A308. The May 22 location reports describe an unnumbered private state, one naming build 5A292g; they are retained only as exclusion evidence and are not attached to Beta 6 changes.
- Beta 7 forum reports about performance, App Store messaging, Exchange, ringtones, and Interface Builder are excluded because this pass did not find independent corroboration.
- Beta 5 and Beta 7 are explicitly SDK-sequence milestones; the retained sources do not establish separately numbered firmware seeds.
- Beta 8 MobileMe, bookmark, and application-sync text describes the companion iTunes preview rather than an iPhone OS change. An anonymous stability impression is excluded.
- June 26 sources name Beta 8, while later reports sometimes call the same firmware lineage a golden master. A separate GM identity is not created.
- Public remains owned by the existing iOS 2 public batch.

## Copyright and attribution controls

- All reader-facing article, title, summary, and canonical-summary text is original synthesis.
- Every factual record carries source citations whose exact-phrase locator resolves inside a SHA-locked, bounded source artifact.
- First-party claims preserved by journalism are labeled as such rather than presented as surviving Apple-hosted documentation.
- No article, transcript, screenshot, source HTML, confidential SDK material, or long excerpt is committed.
- Publisher commentary, rumors, unsupported build identities, and uncorroborated community claims are excluded.

## Source ledger

All declared sources were accessed on 2026-07-30.

- [Apple Announces iPhone 2.0 Software Beta](https://www.apple.com/newsroom/2008/03/06Apple-Announces-iPhone-2-0-Software-Beta/) - Apple Newsroom; firstPartyAnnouncement.
- [iPhone firmware 2.0 hands-on](https://www.engadget.com/2008-03-18-iphone-firmware-2-0-hands-on.html/) - Engadget; journalism.
- [iTunes strike refunds; iPhone 2.0 beta; iPhone app signing](https://appleinsider.com/articles/08/03/18/itunes_strike_refunds_iphone_2_0_beta_iphone_app_signing) - AppleInsider; journalism.
- [Apple releases iPhone SDK beta 2](https://www.macworld.com/article/189903/iphonesdk-4.html) - Macworld; journalism.
- [New Version of iPhone 2.0 Beta Firmware!](https://www.iclarified.com/866/new-version-of-iphone-20-beta-firmware) - iClarified; journalism.
- [Apple Seeds New iPhone OS 2.0 Beta (5A240d), SDK Update (Beta 3)](https://www.macrumors.com/2008/04/08/apple-seeds-new-iphone-os-2-0-beta-5a240d-sdk-update/) - MacRumors; journalism.
- [Apple releases 4th iPhone SDK and beta 2.0 firmware](https://arstechnica.com/gadgets/2008/04/apple-releases-4th-iphone-sdk-and-beta-2-0-firmware/) - Ars Technica; journalism.
- [iPhone 2.0 Beta 4 (5A258f) Firmware Released](https://www.iclarified.com/989/iphone-20-beta-4-5a258f-firmware-released) - iClarified; journalism.
- [iPhone SDK Beta 5 Released](https://www.macrumors.com/2008/05/06/iphone-sdk-beta-5-released/) - MacRumors; journalism.
- [iPhone SDK beta 6 is here](https://www.engadget.com/2008-05-28-iphone-sdk-beta-6-is-here.html) - Engadget; journalism.
- [iPhone SDK beta 6 released, includes 3G iPhone tidbits](https://arstechnica.com/gadgets/2008/05/iphone-sdk-beta-6-released-includes-3g-iphone-tidbits/) - Ars Technica; journalism.
- [Latest iPhone 2.0 beta adds geo-tagging to Camera photos](https://appleinsider.com/articles/08/05/22/latest_iphone_2_0_beta_adds_geo_tagging_to_camera_photos.html) - AppleInsider; journalism.
- [iPhone 2.0 beta gets geotagging?](https://www.engadget.com/2008-05-22-iphone-2-0-beta-gets-geotagging.html) - Engadget; journalism.
- [Apple Releases iPhone SDK Beta 7](https://www.macrumors.com/2008/06/09/apple-releases-iphone-sdk-beta-7/) - MacRumors; journalism.
- [iPhone SDK Beta 7 now available](https://arstechnica.com/gadgets/2008/06/iphone-sdk-beta-7-now-available/) - Ars Technica; journalism.
- [Kort iPhone-nieuws: 12 EK-songs voor Band, iPhone 3G gratis bij O2, iPhone SDK beta 7](https://www.iculture.nl/nieuws/kort-iphone-nieuws-12-ek-songs-voor-band-iphone-3g-gratis-bij-o2-iphone-sdk-beta-7/) - iCulture; journalism.
- [Apple Seeds iPhone 2.0 5A345, iTunes 7.7 Beta, SDK 8](https://www.macrumors.com/2008/06/26/apple-seeds-iphone-2-0-5a345-itunes-7-7-beta-sdk-8/) - MacRumors; journalism.
- [iPhone SDK Beta 8 Released](https://www.engadget.com/2008-06-26-iphone-sdk-beta-8-coming-soon.html) - Engadget; journalism.
- [Apple Accepting iPhone Apps Into App Store](https://www.macrumors.com/2008/06/26/apple-accepting-iphone-apps-into-app-store/) - MacRumors; journalism.
- [iPhone SDK beta eight is great](https://www.macworld.com/article/191231/iphone_sdk_beta8.html) - Macworld; journalism.

## Closure guards

- Exact comparison against the local iPhone OS 2.0 seed record and its sole Public milestone
- Exact eight-route identity, date, channel, and change-count allowlist
- Zero versions, zero builds, exact approval timestamps, and explicit true indexability
- Collision scan across every other research-batch JSON plus `apple-launch-content-2026.json`
- 51 occurrences resolve to exactly 45 stable definitions
- five shared definitions exactly match the SHA-guarded `apple-ios-2.json` Public owner; every other key uses the iPhone OS 2.0 namespace
- recurring Exchange, signing, SDK maintenance, target support, and host-requirement histories are asserted across seeds
- every declared source title exactly matches the captured H1 and every citation locator resolves to pinned text
- evidence labels are enforced: confirmed records include first-party Apple evidence and corroborated records have at least two independent sources
- May 22 private-build sources are prohibited from change records and retained only in the Beta 6 selection boundary
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: `2356e335d0387a0a9b0735c3044872276de94dab25ebd76da1b3dc608927956e`

## Editorial approval and validation record

- provenance: `editoriallyVerified`
- editorial status: `approved`
- indexability: `true`
- reviewed at: `2026-07-30T13:29:37Z`
- independent substantive review: clean after route-scope, future-state,
  private-build, recurrence, evidence-label, and source-custody corrections

Verified on 2026-07-30:

- evidence audit: 20 exact raw artifacts totaling 2,855,553 bytes and 20 normalized text locks
- `npm run research:validate`: 73 batches and 4214 globally consistent change keys
- focused ingestion/manifest suite: 19 passed
- full repository suite: 131 passed
- independent copyright-similarity scan: 276 reader-facing fields; maximum contiguous overlap of 5 words
- independent live re-fetch: all
  20 declared sources available;
  6 raw artifacts matched byte-for-byte,
  all 20 normalized article boundaries
  matched exactly, all 20 source
  titles reproduced, and all
  20 evidence boundaries passed
- ESLint, Prettier check, deterministic regeneration, and `git diff --check`: passed

## Production dry plan

- status: applied and zero-residual verified on 2026-07-30
- production dry plan: 67 creates, 5 patches, and 2136 unchanged documents
- create split: 19 new sources, 8 events, and 40 change definitions
- the five patches are revision-guarded citation unions plus refreshed approved review timestamps on the exact shared Public definitions; every prior citation is preserved and no semantic definition field or version is changed
- the existing Apple Newsroom Beta 1 source is reused unchanged
- mutation payload: 225001 bytes
- production plan SHA: `fcca348e4fd675657065b9f10c315b9210307cb6d8f0941639c97cf46067142b`
- plan artifact SHA-256: `0650a464aa0dac8164eaac02ad96a09d99db8e4e7f91f58b8266727f9bdc23df`
- rollback artifact SHA-256: `5b1102d06d39735a777ce296ddaa567853607a4ed6e6bda0c9afd705700bdfa9`
- rollback coverage: all 67 create IDs and all
  5 full restore documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: `eOgq1Ovu5XNUv1qNFVN2lj`
- applied plan SHA: `fcca348e4fd675657065b9f10c315b9210307cb6d8f0941639c97cf46067142b`
- receipt SHA-256: `25442c35b4ebbee73045df8b4f9240314b9aa2eb8487a7999ed40b8723200015`
- immediate post-publication zero plan:
  `79d25a5886c646862ee0922bc7ea99401f806a2b4b9a687d8841016b5f2084d9`; zero creates, zero patches,
  2,208 unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  `a0e1a5608de97adbfcab55c435a1bd123e1d5df5268705fb41ff0d3613717365`
- zero-plan rollback artifact SHA-256:
  `372c49b6fc8f6e9b7105aa16583eea0aa5178f41581b76258e2c8a69390f487a`

## Production coverage after publication

- 410 of
  410 release versions have full
  version-level coverage
- 2,040
  appearances:
  487 full articles,
  256 source-linked records,
  and
  1,297
  timeline-only records
- 638 appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all four archival article sections, every expected structured
change title, References, its first cited source, and an `index, follow`
directive. No route returned placeholder copy or a `noindex` directive.

| Canonical route          | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots        |
| ------------------------ | ---: | ---------------: | ---------------: | ---------- | ------------ | ----------- | ------------- |
| `/apple/ios/2.0/beta-1/` |  200 |              4/4 |            17/17 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-2/` |  200 |              4/4 |              4/4 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-3/` |  200 |              4/4 |              5/5 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-4/` |  200 |              4/4 |            10/10 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-5/` |  200 |              4/4 |              2/2 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-6/` |  200 |              4/4 |              4/4 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-7/` |  200 |              4/4 |              3/3 | yes        | yes          | no          | index, follow |
| `/apple/ios/2.0/beta-8/` |  200 |              4/4 |              6/6 | yes        | yes          | no          | index, follow |

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce the approved batch with:

```sh
node scripts/research-batches/build-apple-ios-2-prerelease.mjs
node scripts/research-batches/audit-ios2-prerelease.mjs tmp/ios2-evidence
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-2-prerelease.mjs scripts/research-batches/audit-ios2-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-2-prerelease.mjs scripts/research-batches/audit-ios2-prerelease.mjs scripts/research-batches/apple-ios-2-prerelease.json scripts/research-batches/apple-ios-2-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-2-prerelease.json
```
