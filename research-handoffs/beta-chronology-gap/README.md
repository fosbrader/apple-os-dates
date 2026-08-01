# Apple beta chronology gap program

Status: active research; no production mutation

Prepared: 2026-07-30 (America/New_York)

Sanity writes authorized: **no**

## Purpose

This program closes missing Apple prerelease appearances without confusing
research with publication. It covers the six Apple platforms already modeled by
the site:

- iOS
- iPadOS
- macOS
- watchOS
- tvOS
- visionOS

The target is a historical record of every externally identifiable developer
beta and public beta appearance for every applicable major, point, and patch
release. A candidate is not a Sanity document. Research agents produce evidence
and proposed identities here; a later chronology review decides whether any
candidate should become a `releaseEvent`.

This package follows [`docs/research-agent-handoff.md`](../../docs/research-agent-handoff.md).
When this guide and the repository-wide handoff disagree, the repository-wide
handoff controls.

## What the baseline proved

The production chronology contained 2,068 `releaseEvent` documents at the
2026-07-30 audit. Only 20 used the `publicBeta` channel: 10 iOS and 10 iPadOS.
macOS, watchOS, tvOS, and visionOS had zero.

That absence is not historically correct:

- Apple's recurring public OS X seed program began with OS X 10.9.3 in April 2014. El Capitan was not the beginning of Mac public testing.
- iOS public testing began with iOS 8.3 in March 2015.
- tvOS public testing began with tvOS 11 in June 2017.
- iPadOS entered public testing with iPadOS 13 in June 2019.
- watchOS public testing began with watchOS 7 in August 2020.
- visionOS has no established public-beta boundary. A completed OS 27 packet
  rejected apparent visionOS 27 Public Beta 1 and 2 identities through the
  research cutoff because Apple's program surfaces omit visionOS and stronger
  contemporary evidence identifies developer-only distribution.

The local research corpus also exposed a reconciliation defect. One prior
handoff treated 28 iOS 11.1–11.4.1 public-beta candidates as “already applied,”
but exact production identity checks show that none exists. “Absent from an
incomplete export” is not proof that a candidate exists in production.

See [`baseline.json`](baseline.json) for the counted snapshot and
[`eligibility-matrix.json`](eligibility-matrix.json) for platform boundaries.

## Non-negotiable modeling rules

1. An appearance is not a build.
   `releaseEvent` records an audience/channel appearance. `releaseBuild`
   records a build identity. Never invent or merge a build to make an event
   easier to model.
2. Developer and public appearances remain distinct.
   If both audiences received the same build on the same day, preserve two
   events. Link them only when a source supports the relationship.
3. Do not infer one channel from another.
   A developer beta does not prove a public beta appeared. A generic “beta”
   mention does not establish the audience.
4. Do not infer public numbering from developer numbering.
   Preserve the publisher's displayed public label. If reports disagree, record
   both labels and the conflict; do not silently normalize it away.
5. A release candidate stays a release candidate.
   Public testers receiving an RC does not create a `publicBeta` event unless
   Apple or reliable contemporary evidence separately identifies a public-beta
   appearance.
6. Invitation-only AppleSeed is not automatically a public beta.
   Distinguish Apple Beta Software Program distribution from AppleSeed for IT,
   private partner seeds, employee seeds, carrier seeds, and leaks.
7. Public-beta pages may be timeline-only.
   If a public seed shares the paired developer seed's product changes, the
   public event can cite the distribution evidence and point to the developer
   route. It must not duplicate unsupported product deltas.
8. Research never creates production IDs.
   Use `candidateId` locally. A retained `priorProposedStableEventId` is
   provenance from an older manifest, not an authorized Sanity identity.
9. No research agent may mutate Sanity.
   No create, patch, delete, transaction, import, or “dry run” with an accidental
   mutation path is allowed from this program.

## Required research grain

Audit at the event-appearance grain, not only the version grain. For every
eligible platform and version:

- enumerate developer beta 1 through the final developer beta;
- enumerate public beta 1 through the final public beta;
- check major, point, and patch cycles;
- preserve same-day developer/public appearances separately;
- investigate respins, re-releases, withdrawals, paused distributions, and
  replacements;
- record an exact date, channel, displayed label, and sequence only when the
  evidence supports each field;
- leave `build` absent unless a source directly establishes it for that
  appearance.

Negative research matters. If no public beta existed for a cycle, record the
queries and sources checked. “No result found” is not the same as “not
applicable.”

## Evidence standard

Prefer evidence in this order:

1. Apple release notes, Beta Software Program pages, developer releases,
   Newsroom announcements, or archived Apple pages.
2. Two independent contemporary publishers that explicitly identify the
   platform, version, audience, label, and date.
3. One reputable contemporary publisher when it is the best surviving record;
   classify the identity as `reported` and seek corroboration.
4. Later retrospective reporting only as context, never as the sole source for
   an exact historical appearance when contemporary evidence is available.

Every source reference needs:

- canonical URL;
- publisher and title;
- publication date when known;
- accessed/verified date;
- source class;
- a bounded locator;
- the exact claim it supports;
- any archive URL or local evidence pointer;
- conflict notes.

Use original synthesis. Do not copy release-note prose, articles, screenshots,
or long quotations. Claim-level attribution and a References section are
required for any later reader-facing page.

## Candidate workflow

1. **Choose an eligibility cell.** Start from
   [`eligibility-matrix.json`](eligibility-matrix.json). Do not research a
   platform/version outside an eligible interval without first documenting why
   it may apply.
2. **Inventory production.** Query the exact
   `{releaseVersionId, channel, routeAlias}` identity and capture the query time.
   Never use an incomplete export as proof.
3. **Inventory reusable evidence.** Search `scripts/research-batches/`,
   `research-handoffs/`, and bounded `tmp/*-evidence` directories before
   re-researching.
4. **Freeze mutable aggregate inputs locally.** Files such as
   `coverage-matrix.json` are regenerated as other reviewed packets land. A new
   packet must copy its exact scoped rows into a packet-local snapshot (or embed
   them completely in the assignment) and lock that immutable packet artifact.
   Do not rely on a checksum of the shared aggregate path as the only
   reproducibility record.
5. **Research the full cycle.** Build a developer/public sequence table so a
   missing middle ordinal is visible.
6. **Create or update a candidate.** Conform to
   [`proposed-event-candidate.schema.json`](proposed-event-candidate.schema.json).
7. **Run conflict checks.** Compare dates, labels, ordinals, audience, build
   claims, and paired developer routes across sources.
8. **Submit for chronology review.** Research agents stop before Sanity
   mutation.

### Production reconciliation states

| State                           | Meaning                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| `exactExistingMatch`            | The exact production version, channel, and route alias exists.                              |
| `existingIdentityConflict`      | A likely production record exists but one or more identity fields disagree.                 |
| `confirmedMissing`              | A current exact production query found no matching event.                                   |
| `plausibleInsufficientEvidence` | Production has no match, but the proposed historical identity is not yet adequately proven. |
| `evidenceBackedNotApplicable`   | Evidence establishes that the channel/event did not apply.                                  |

### Candidate states

| State                      | Meaning                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `discovered`               | A potential gap has been found but not researched.                                     |
| `reuseReviewPending`       | Older local evidence exists and must be re-reconciled and reviewed under this program. |
| `researching`              | Evidence collection is active.                                                         |
| `needsEvidenceReview`      | Sources exist, but the identity or conflict gate is incomplete.                        |
| `readyForChronologyReview` | Research gates are satisfied; an independent reviewer may decide publication.          |
| `rejected`                 | Evidence disproved the proposed identity.                                              |
| `deferred`                 | Deliberately postponed with a documented reason.                                       |

## Ready-for-chronology-review gate

A candidate may enter `readyForChronologyReview` only when all are true:

- an exact live production check is recorded;
- platform/channel eligibility is established;
- version, date, channel, displayed label, normalized route alias, and sequence
  are explicit;
- identity evidence is first-party or independently corroborated by two
  contemporary sources;
- source locators support the identity rather than merely mentioning the
  release family;
- build remains absent unless directly supported;
- no unresolved material conflict remains;
- a reviewer other than the researcher has checked the evidence;
- `sanityMutationAllowed` and `publicationEligible` remain `false`.

Chronology approval and publication authorization are separate later decisions.

## Current public-beta research state

[`coverage-matrix.json`](coverage-matrix.json) is the authoritative counted
register. Its read-only production snapshot and all finalized packets currently
reconcile to:

| Measure                                           | Count |
| ------------------------------------------------- | ----: |
| Eligible modeled public-beta versions             |   284 |
| Production public-beta events                     |    20 |
| Structured public-beta candidates                 |   855 |
| Ready for chronology review                       |   666 |
| Evidence- or modeling-blocked                     |   187 |
| Correction-only, pending separate authorization   |     2 |
| Versions represented by production or a candidate |   216 |

Production still has only 20 `publicBeta` events: 10 iOS and 10 iPadOS. None of
the 855 structured records has been published by this research program.

The guarded
[`reviewed-chronology-handoff.json`](reviewed-chronology-handoff.json) contains
the 666 independently approved, confirmed-missing identities across 186 version
parents. It resolves 1,439 claim-level evidence references to 750 unique
canonical source URLs. It is chronology evidence only: it contains no
executable mutation plan, stable production IDs, page-build authority, or
publication authority.

## Finalized packet map

The aggregate incorporates the foundation register and reviewed packet families
for early iOS, modern iOS/iPadOS major and point cycles, macOS major and point
cycles, and major watchOS/tvOS cycles. The detailed packet reports preserve
their source locks, conflicts, mandatory qualifications, and independent-review
decisions:

- Foundation and early iOS:
  [`candidate-register.json`](candidate-register.json),
  [`reusable-ios8-ios11/`](reusable-ios8-ios11/report.md),
  [`ios9-point/`](ios9-point/report.md),
  [`ios9-10-major/`](ios9-10-major/report.md), and
  [`ios10-point-public/`](ios10-point-public/report.md), with
  [`ios10-point-public-followup/`](ios10-point-public-followup/report.md).
- Modern iOS and iPadOS:
  [`mobile26-public/`](mobile26-public/report.md),
  [`ios-major-12-18/`](ios-major-12-18/report.md),
  [`ios-major-12-18-followup/`](ios-major-12-18-followup/report.md),
  [`ios-ipados-point-12-14/`](ios-ipados-point-12-14/report.md),
  [`ios-ipados-point-12-14-followup/`](ios-ipados-point-12-14-followup/report.md),
  [`ios-ipados-point-15-18/`](ios-ipados-point-15-18/report.md), and
  [`ipados-major-13-26/`](ipados-major-13-26/report.md), with
  [`ipados-major-13-26-second-lineage/`](ipados-major-13-26-second-lineage/report.md).
- macOS:
  [`macos-2014-2019/`](macos-2014-2019/report.md),
  [`macos-major-11-26/`](macos-major-11-26/report.md), and
  [`macos-point-15-26/`](macos-point-15-26/report.md), with
  [`macos-point-15-26-followup/`](macos-point-15-26-followup/report.md).
- Major watchOS/tvOS and OS 27:
  [`watchos-major-7-26/`](watchos-major-7-26/report.md),
  [`tvos-major-11-26/`](tvos-major-11-26/report.md), and
  [`os27/`](os27/report.md).

Three later packets complete the initial patch/point applicability pass:

- [`ios-patch-applicability/`](ios-patch-applicability/report.md): all three
  iOS 13.3.1 public-beta identities passed review; iOS 14.8 is an
  evidence-backed no-public-beta cycle; iOS 8.4.1 remains conflicted and not
  established; the other 24 audited parents remain reversible no-positive
  findings.
- [`watchos-point-7-26/`](watchos-point-7-26/report.md): 25 of 55 researched
  identities passed review, 30 remain blocked, eight exact no-positive identity
  findings remain reversible, and five parents without an approved appearance
  remain open.
- [`tvos-point-11-26/`](tvos-point-11-26/report.md): 37 of 116 researched
  identities passed review, 79 remain blocked, all 15 skipped or negative
  sequence findings remain reversible, and 12 parents without an approved
  appearance remain open.

Blocked, reversible, excluded, and correction-only records stay in their
separate ledgers. They cannot enter the creation handoff by inference.

## Coverage and remaining public-beta audit

The finalized applicability inventory records:

| Finding                                           | Versions |
| ------------------------------------------------- | -------: |
| Evidence-backed no public beta                    |        3 |
| Audited no positive identity, reversible          |       75 |
| Applicability conflict, not established           |        1 |
| Not yet given an initial audit                    |        0 |
| Still sequence-, evidence-, or applicability-open |       76 |

These categories are research states, not a claim that every open version had a
public beta, and they are not all mutually exclusive with candidate
representation. A represented version may still need sequence completion or a
conflict resolved. The remaining 76-version follow-up queue consists of 17
versions with a developer sequence, five other major or point versions, and 54
routine patch-applicability checks.

## Active unfrozen waves

There are no active unfrozen public-beta research waves. All candidate totals
above come from finalized, locked, independently reviewed packet inputs.

The frozen macOS work also records that OS X 10.9.3 has no production
`releaseVersion` parent, even though it is the established recurring-program
boundary. That is a version-modeling decision, not an event the research
program may silently create.

## Developer-beta inventory and next research

Production contains 1,427 `developerBeta` events across 291 of 410 modeled
versions. A separate reviewed packet contains 17 approved, confirmed-missing
developer-beta candidates across four version parents. The other 115 parents
without production developer-beta coverage are applicability audits, not 115
assumed missing events.

[`developer-gap-next/plan.json`](developer-gap-next/plan.json) freezes those 115
parents into seven disjoint, planning-only waves:

| Order | Wave                                              | Parents |
| ----: | ------------------------------------------------- | ------: |
|     1 | Modern high-priority point/compatibility releases |      10 |
|     2 | Legacy major/point terminology and modeling       |      14 |
|     3 | iPhone OS/iOS 1–4 patch/hotfix applicability      |      20 |
|     4 | iOS 5–9 patch/hotfix applicability                |      22 |
|     5 | iOS 10–13 patch/hotfix applicability              |      15 |
|     6 | iOS 14–16 patch/hotfix applicability              |      16 |
|     7 | iOS 17–26 patch/hotfix applicability              |      18 |
|       | **Total**                                         | **115** |

The audit priorities are 22 high major/point versions, two versions with
public-beta evidence, and 91 routine patch-applicability checks. The plan
assigns research scope only. It authorizes no CMS write, stable ID, page build,
publication, or deployment.

## Future platform observations

Apple's current Beta Software Program pages include HomePod software and
AirPods firmware. They are not among the six platform documents currently in
scope. Preserve them as catalog-expansion observations; do not invent platform,
version, or event documents in this program.

## Handoff deliverables

- [`baseline.json`](baseline.json): counted live/local snapshot and known
  reconciliation defect.
- [`eligibility-matrix.json`](eligibility-matrix.json): developer/public
  applicability boundaries for the six modeled platforms.
- [`sources.json`](sources.json): foundation source ledger.
- [`proposed-event-candidate.schema.json`](proposed-event-candidate.schema.json):
  machine-readable register contract.
- [`candidate-register.json`](candidate-register.json): foundation proposed
  identities and review states; retained as provenance rather than the current
  aggregate count.
- [`coverage-matrix.json`](coverage-matrix.json) and
  [`coverage-matrix.md`](coverage-matrix.md): authoritative public/developer
  production inventory, structured readiness, reviewed applicability findings,
  and remaining version-level audit queues.
- [`build-coverage-matrix.mjs`](build-coverage-matrix.mjs): reproducibly rebuilds
  both coverage artifacts and fails on duplicate identities, production
  overlaps, or unsafe candidate flags.
- [`reviewed-chronology-handoff.json`](reviewed-chronology-handoff.json):
  chronology-only evidence for independently approved, confirmed-missing
  identities. It is explicitly non-executable and excludes correction-blocked
  or evidence-blocked candidates.
- [`build-reviewed-chronology-handoff.mjs`](build-reviewed-chronology-handoff.mjs):
  rebuilds that guarded handoff from the coverage matrix, resolves every source
  reference, and fails if a candidate is not a zero-match confirmed-missing
  identity with safe flags.
- The finalized packet reports linked under **Finalized packet map**:
  packet-local candidates, evidence ledgers, production snapshots, conflict
  records, reviews, validations, and integrity locks.
- [`developer-gap-priority/`](developer-gap-priority/report.md): 17 reviewed
  developer-beta candidates across four version parents, still without
  publication or mutation authority.
- [`developer-gap-next/`](developer-gap-next/report.md): frozen seven-wave
  research plan for all 115 remaining developer applicability parents.
- [`validate.mjs`](validate.mjs): repeatable schema, count, path, source-reference,
  and packet-drift checks.
- [`validation-status.json`](validation-status.json): last recorded validation
  result.
