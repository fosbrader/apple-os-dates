# Reusable iOS 8 and iOS 11 public-beta evidence review

Status: needsEvidenceReview  
Research basis: retained iOS 8 and iOS 11 archive batches  
Evidence reviewer: codex-review-reusable-public-betas  
Findings SHA-256: `d085e859a08c0a6aa2684bccea0256f43d3767298c424a36dad9b353b8a607a0`  
Evidence directory: `tmp/research-evidence/beta-chronology-gap/reusable-ios8-ios11/`

## Outcome

All 33 proposed routes are absent from the 2,068-event production identity
export. None is a production duplicate, and no retained page disproves a
candidate's public distribution date.

The review does **not** advance any candidate to chronology-ready:

- 24 candidates have an explicit public ordinal in the retained contemporary
  page, but this packet hash-verifies only one publisher lineage.
- 9 candidates explicitly establish public distribution while deriving the
  proposed public ordinal from a paired developer seed. That normalization is
  prohibited by the new program rules.
- All 33 therefore remain `needsEvidenceReview`. No publication or Sanity
  mutation is recommended by this packet.

## Scope closure

| Candidate            | Date       | Public ordinal | Current source | Disposition   |
| -------------------- | ---------- | -------------- | -------------- | ------------- |
| 8.3 Public Beta 1    | 2015-03-12 | explicit       | MacRumors      | needsEvidence |
| 8.3 Public Beta 2    | 2015-03-24 | explicit       | MacRumors      | needsEvidence |
| 8.4 Public Beta 1    | 2015-04-27 | explicit       | 9to5Mac        | needsEvidence |
| 8.4 Public Beta 2    | 2015-05-11 | explicit       | 9to5Mac        | needsEvidence |
| 8.4 Public Beta 3    | 2015-06-09 | explicit       | MacRumors      | needsEvidence |
| 11.1 Public Beta 1   | 2017-09-28 | explicit       | MacRumors      | needsEvidence |
| 11.1 Public Beta 2   | 2017-10-09 | explicit       | MacRumors      | needsEvidence |
| 11.1 Public Beta 3   | 2017-10-16 | inferred       | MacRumors      | needsEvidence |
| 11.1 Public Beta 4   | 2017-10-20 | inferred       | MacRumors      | needsEvidence |
| 11.1 Public Beta 5   | 2017-10-23 | explicit       | MacRumors      | needsEvidence |
| 11.2 Public Beta 1   | 2017-11-01 | explicit       | MacRumors      | needsEvidence |
| 11.2 Public Beta 2   | 2017-11-07 | explicit       | MacRumors      | needsEvidence |
| 11.2 Public Beta 3   | 2017-11-13 | inferred       | MacRumors      | needsEvidence |
| 11.2 Public Beta 4   | 2017-11-17 | inferred       | MacRumors      | needsEvidence |
| 11.2 Public Beta 5   | 2017-11-28 | inferred       | MacRumors      | needsEvidence |
| 11.2 Public Beta 6   | 2017-12-01 | explicit       | MacRumors      | needsEvidence |
| 11.3 Public Beta 1   | 2018-01-25 | explicit       | MacRumors      | needsEvidence |
| 11.3 Public Beta 2   | 2018-02-07 | explicit       | MacRumors      | needsEvidence |
| 11.3 Public Beta 3   | 2018-02-21 | explicit       | MacRumors      | needsEvidence |
| 11.3 Public Beta 4   | 2018-03-05 | explicit       | MacRumors      | needsEvidence |
| 11.3 Public Beta 5   | 2018-03-12 | inferred       | MacRumors      | needsEvidence |
| 11.3 Public Beta 6   | 2018-03-16 | explicit       | MacRumors      | needsEvidence |
| 11.4 Public Beta 1   | 2018-04-03 | explicit       | MacRumors      | needsEvidence |
| 11.4 Public Beta 2   | 2018-04-17 | explicit       | MacRumors      | needsEvidence |
| 11.4 Public Beta 3   | 2018-05-01 | inferred       | MacRumors      | needsEvidence |
| 11.4 Public Beta 4   | 2018-05-07 | inferred       | MacRumors      | needsEvidence |
| 11.4 Public Beta 5   | 2018-05-14 | inferred       | MacRumors      | needsEvidence |
| 11.4 Public Beta 6   | 2018-05-17 | explicit       | MacRumors      | needsEvidence |
| 11.4.1 Public Beta 1 | 2018-05-31 | explicit       | MacRumors      | needsEvidence |
| 11.4.1 Public Beta 2 | 2018-06-12 | explicit       | MacRumors      | needsEvidence |
| 11.4.1 Public Beta 3 | 2018-06-18 | explicit       | MacRumors      | needsEvidence |
| 11.4.1 Public Beta 4 | 2018-06-25 | explicit       | MacRumors      | needsEvidence |
| 11.4.1 Public Beta 5 | 2018-07-02 | explicit       | MacRumors      | needsEvidence |

## Identity boundary

The retained pages support the iOS version, calendar date, and public-beta
audience for every candidate. Publisher `datePublished` metadata matches each
proposed date, and every raw capture reproduced its pinned SHA-256.

The nine ordinal-specific gaps are: `version-ios-11-1/public-beta-3`, `version-ios-11-1/public-beta-4`, `version-ios-11-2/public-beta-3`, `version-ios-11-2/public-beta-4`, `version-ios-11-2/public-beta-5`, `version-ios-11-3/public-beta-5`, `version-ios-11-4/public-beta-3`, `version-ios-11-4/public-beta-4`, `version-ios-11-4/public-beta-5`.

For those routes, the page headline names a developer ordinal and an update
records public distribution, but the page does not display a public ordinal.
The future researcher must find ordinal-specific public-channel evidence rather
than assuming both channels used the same sequence number.

## Production reconciliation

The exact `releaseVersionId/routeAlias` keys for all 33 candidates were
compared with `tmp/all-event-identities.json`. That export contains 2,068
events and matches the live total recorded by the program baseline. The result
was 33 confirmed missing keys, zero exact matches, and zero duplicate local
candidate keys.

This check proves the canonical proposed route is absent. It does not authorize
creation, and it must be refreshed immediately before any later chronology
decision.

## Source ledger

| ID                                                     | Publisher | Published                 | Raw bytes | Raw SHA-256                                                        |
| ------------------------------------------------------ | --------- | ------------------------- | --------: | ------------------------------------------------------------------ |
| source-review-candidate-apple-ios-8-3-public-beta-1    | MacRumors | 2015-03-12T11:48:11-07:00 |    126719 | `8ac01cb0d8de9b91b920216631b8ec179a551ee839e9dae45292ab692c0cd441` |
| source-review-candidate-apple-ios-8-3-public-beta-2    | MacRumors | 2015-03-24T09:57:33-07:00 |    127346 | `c3fca532d48ffde8c3dafb420d524ffeab1c40af88eb815e9a7a45edb293f9ae` |
| source-review-candidate-apple-ios-8-4-public-beta-1    | 9to5Mac   | 2015-04-27T16:49:11+00:00 |    185939 | `7ee4fd32b8293b3b6f716b8ee831d4f8316dbc702cfa61855690569af22b332c` |
| source-review-candidate-apple-ios-8-4-public-beta-2    | 9to5Mac   | 2015-05-11T16:50:23+00:00 |    176141 | `8cad1f0db4394dbc045912143cc32565e298a42897ef97f88c80d6f34a2134db` |
| source-review-candidate-apple-ios-8-4-public-beta-3    | MacRumors | 2015-06-09T09:56:55-07:00 |    127395 | `23ec705d33fbdd1cf60f8a00dea264db0b94f297adf781d866d4886527d08d30` |
| source-review-candidate-apple-ios-11-1-public-beta-1   | MacRumors | 2017-09-28T17:05:00.000Z  |    127569 | `cd0e56b38b9c2633aa35209101db1a20ca76b377519d39dd5662cebfb359ddab` |
| source-review-candidate-apple-ios-11-1-public-beta-2   | MacRumors | 2017-10-09T17:06:00.000Z  |    132169 | `fb638b17bf7a1dd2739fbbb027b54a4bf5d0c367d57acf8212a2f7463909f92e` |
| source-review-candidate-apple-ios-11-1-public-beta-3   | MacRumors | 2017-10-16T17:06:00.000Z  |    128050 | `9294625b6a4a6b4530b2168ec837b51b31802d590dc60e60f54696de507efff1` |
| source-review-candidate-apple-ios-11-1-public-beta-4   | MacRumors | 2017-10-20T17:07:00.000Z  |    131420 | `53d6550d09a56dc74cfdf308a8d065358e28f6910746789e3039995d93279678` |
| source-review-candidate-apple-ios-11-1-public-beta-5   | MacRumors | 2017-10-23T17:11:00.000Z  |    131616 | `9fb35c80f2a345fdb0d553003d70fb808a0bc93ac58040533f5d21721fcfa83b` |
| source-review-candidate-apple-ios-11-2-public-beta-1   | MacRumors | 2017-11-01T17:10:00.000Z  |    127682 | `235a60dc5190ec52c6aaee09ffa9a3712d3304f5746c5065dee212d9edc07e4f` |
| source-review-candidate-apple-ios-11-2-public-beta-2   | MacRumors | 2017-11-07T18:05:00.000Z  |    129332 | `e25db5e70858780b0385895f118e7732c86f986ece2000349a4560e1a965113d` |
| source-review-candidate-apple-ios-11-2-public-beta-3   | MacRumors | 2017-11-13T18:07:00.000Z  |    126321 | `2c80a36ed0d8595d89bbb338f48436dfb0655ea152c4bf61126b4a424215faa8` |
| source-review-candidate-apple-ios-11-2-public-beta-4   | MacRumors | 2017-11-17T18:16:00.000Z  |    129342 | `151d55c3b5717f98eb9cbb91e172ee4e569ff0d94321ede26034e9d62cfcb005` |
| source-review-candidate-apple-ios-11-2-public-beta-5   | MacRumors | 2017-11-28T18:00:00.000Z  |    130629 | `7bbcb78336d652854877f28343a71dc9b9a9f5fe98add80d299ae7b789fea51f` |
| source-review-candidate-apple-ios-11-2-public-beta-6   | MacRumors | 2017-12-01T18:05:00.000Z  |    128598 | `8a64c19bbb4a326e0bca65188b63f075417311bc570b6999b146f8d2467e5089` |
| source-review-candidate-apple-ios-11-3-public-beta-1   | MacRumors | 2018-01-25T18:09:00.000Z  |    128896 | `63bfe9195dc88d747fef21b83602784ad369f3b2e4945ce1ccede829c3b32659` |
| source-review-candidate-apple-ios-11-3-public-beta-2   | MacRumors | 2018-02-07T18:08:00.000Z  |    128222 | `962aed1335f504bf39a4dd3d5dfe81876c44a62f8779c30436f41c0d334fb2f9` |
| source-review-candidate-apple-ios-11-3-public-beta-3   | MacRumors | 2018-02-21T18:08:00.000Z  |    128906 | `ea1360dc49a45197ce1ac1a0c801513d6db147e5192f6fcad53e3e2815b9c00a` |
| source-review-candidate-apple-ios-11-3-public-beta-4   | MacRumors | 2018-03-05T18:03:00.000Z  |    132789 | `e054b33cb89da4ae1a954a1d28b857bf0904c19a565fc8b8bbddd589b7a04f61` |
| source-review-candidate-apple-ios-11-3-public-beta-5   | MacRumors | 2018-03-12T17:04:00.000Z  |    133105 | `78ac60030da3603345f964146762d281bf2cc38814210aa0b88e532b35c5e2eb` |
| source-review-candidate-apple-ios-11-3-public-beta-6   | MacRumors | 2018-03-16T17:02:00.000Z  |    131357 | `6fa3ebe094ced9db178fbe570e1067e7bae2e3e82bc02987fb698494379b9b7c` |
| source-review-candidate-apple-ios-11-4-public-beta-1   | MacRumors | 2018-04-03T17:07:00.000Z  |    127057 | `0b50104e0352e99aa1daac5249e4e3330cae0c82b21099ffa2d717238eadaec8` |
| source-review-candidate-apple-ios-11-4-public-beta-2   | MacRumors | 2018-04-17T17:17:00.000Z  |    126239 | `e36a5b6cce30ed9fc1782f6975a2df65133e6fb7b33d5dcda281e7046ca22039` |
| source-review-candidate-apple-ios-11-4-public-beta-3   | MacRumors | 2018-05-01T17:04:00.000Z  |    128477 | `f1d816bce532c839b36a5b6de1a778d9b31f9158768408ad8546cea8b0a06136` |
| source-review-candidate-apple-ios-11-4-public-beta-4   | MacRumors | 2018-05-07T17:00:00.000Z  |    126788 | `6222d3001c2d33876fff35e28c32e50863e03d9057e3eb822912fa45b167f0c5` |
| source-review-candidate-apple-ios-11-4-public-beta-5   | MacRumors | 2018-05-14T17:01:00.000Z  |    136910 | `49f367e371f15cb337ebefc512c46a29db7aae1db61833aa7621e5b4da9aca3c` |
| source-review-candidate-apple-ios-11-4-public-beta-6   | MacRumors | 2018-05-17T17:04:00.000Z  |    127238 | `63940813570e9994d60a3804a3baf11fff53d88322e05ac275fcd3ce07bb2e18` |
| source-review-candidate-apple-ios-11-4-1-public-beta-1 | MacRumors | 2018-05-31T17:04:00.000Z  |    124565 | `b2434ccb34d026cb18379bfe01a81030686a9db41c9c1d7577f2d230822c1fab` |
| source-review-candidate-apple-ios-11-4-1-public-beta-2 | MacRumors | 2018-06-12T17:14:00.000Z  |    124172 | `1059c2f2cb75e1b9205e2b16085f5550ef6431872b8c310677fe969cf858145b` |
| source-review-candidate-apple-ios-11-4-1-public-beta-3 | MacRumors | 2018-06-18T17:07:00.000Z  |    127179 | `4694a956386ac3baf90fa60945ef5cccd02ca5f80a89153610a3c7f1304d23d7` |
| source-review-candidate-apple-ios-11-4-1-public-beta-4 | MacRumors | 2018-06-25T17:04:00.000Z  |    125449 | `4fe66ba282271907c8e47a44e49822295e26660ada7e6bc09911c1f124369913` |
| source-review-candidate-apple-ios-11-4-1-public-beta-5 | MacRumors | 2018-07-02T17:06:00.000Z  |    126407 | `785391629d2a79b10274f09d272e162010cc1a127b39790be9e73fd3203b46f6` |

MacRumors supplies 31 candidate identity pages and 9to5Mac supplies 2. Each
candidate has only one publisher lineage with appearance-level custody in this
packet; other pages from the same publisher cannot satisfy independent
corroboration. Source titles, URLs,
bylines, timestamps, custody paths, and selected-text hashes are recorded in
`findings.json`.

## Source anomalies and decisions

- The iOS 11.4 Public Beta 1 page has an iOS 11.3 typo in a later installation
  sentence. Its headline and lead identify iOS 11.4, so the typo is retained as
  a nonmaterial caveat and must not be repeated.
- The canonical URL slug used for the May 1, 2018 iOS 11.4 article says beta 4,
  while its displayed headline and lead identify Developer Beta 3. The review
  follows displayed article content, not the slug; the proposed public ordinal
  remains unverified.
- iOS 8.3 Public Beta 1 was distributed through Apple's public program to a
  limited participant group. That access boundary is preserved and does not
  reclassify the appearance as developer-only.
- The foundation ledger links an independent Engadget report for the iOS 8.3
  program launch. It supports the same date, version, and nondeveloper audience,
  but this packet does not have its raw capture and therefore does not count it
  as a completed appearance-level custody record.
- Builds mentioned in the retained reporting were not promoted into this
  chronology packet. A public appearance and a build remain separate facts.

## Copyright, attribution, and trademark boundary

The committed packet contains original synthesis, source metadata, bounded
locators, and hashes. Raw publisher pages and selected identity text remain in
ignored evidence storage. No publisher article body, screenshot, logo, or long
quotation is committed. Apple and product names are used only for factual,
nominative identification; this packet implies no affiliation or endorsement.

## Evidence gaps

- Every candidate needs retained, independently reviewed corroboration at the
  exact appearance grain; a foundation-level link alone is not evidence
  custody.
- The nine listed routes additionally need public-ordinal evidence.
- A new live exact-identity query is required immediately before any later
  chronology or publication review.

## Validation

- [x] Exact 33-candidate closure
- [x] Every retained identity locator independently resolved
- [x] Canonical URLs and publication dates checked
- [x] Raw and selected-text hashes reproduced
- [x] Exact production route keys reconciled
- [x] Copyright and evidence-custody boundary documented
- [x] JSON parsed and controlled review states checked
- [x] No Sanity write, apply, approval, publication, or deployment performed
- [ ] Independent-source gate passed
- [ ] Public ordinal directly supported for all candidates
