# Next developer-beta gap research plan

Status: valid, planning-only, and frozen to the checked-in inventory. No web
research, live production query, Sanity read/write, page build, publication, or
deployment was performed.

## Counted scope

The developer applicability inventory reconciles at the version-row grain:

```text
119 versions with no production developerBeta event
  − 4 version parents already represented by the separate priority packet
  = 115 remaining version rows assigned here
```

The separate
[`developer-gap-priority/`](../developer-gap-priority/) packet contains 17
chronology-approved developer-beta event identities across those four parents.
Those 17 event candidates are not added to the 115-version denominator and
overlap none of this plan’s release-version IDs. They remain ineligible for
publication or mutation.

| Order | Wave | Frozen rows |
| ---: | --- | ---: |
| 1 | Modern high-priority point/compatibility releases | 10 |
| 2 | Legacy major/point terminology and modeling | 14 |
| 3 | iPhone OS/iOS 1–4 patch/hotfix applicability | 20 |
| 4 | iOS 5–9 patch/hotfix applicability | 22 |
| 5 | iOS 10–13 patch/hotfix applicability | 15 |
| 6 | iOS 14–16 patch/hotfix applicability | 16 |
| 7 | iOS 17–26 patch/hotfix applicability | 18 |
|  | **Total** | **115** |

Category totals are 10 modern high-priority rows, 14 legacy
terminology/modeling rows, and 91 iOS patch/hotfix rows. Platform totals are
105 iOS, 2 iPadOS, 6 macOS, and 2 watchOS.

## Frozen assignment

[`plan.json`](plan.json) embeds every exact `releaseVersionId` and its current
inventory facts, including the public release date/status, zero-production
developer-beta basis, public-beta inventory, structured-candidate inventory,
priority, and source queue position. Later regeneration of the shared coverage
matrix must not silently retarget an active wave.

The pinned final public-beta matrix contains 855 structured candidates, 666
ready for chronology review, and zero active unfrozen waves. Its three approved
public-beta candidates move iOS 13.3.1 into the modern
`highestPublicBetaEvidence` developer-audit cohort alongside iOS 14.7; the
exact 115-parent set itself is unchanged.

- Coverage input SHA-256:
  `011c7f59be5191ac567ead01c704a5ee506a9aeb59bd630c104a2afb8114ced8`
- Exact sorted 115-ID set SHA-256:
  `10d9147a3e4970916b4e35726c61617fa55197d3f310f9ffbe94d120fd740e12`
- `plan.json` SHA-256:
  `ecd4942b0bcd448aba0e2acd2c28dece7f388dd394528ac9a4cfcb6564c6a1a8`

[`build-plan.mjs`](build-plan.mjs) pins all source hashes and refuses to rebuild
from drifted inputs. Later wave assignments copy from `plan.json`, not from a
new aggregate.

## Research and modeling gates

A positive candidate must establish the exact developer audience, displayed
label, ordinal when numbered, appearance date, version, route identity, and
availability state through a direct first-party artifact or two genuinely
independent contemporary publisher lineages. Every applicable cycle is audited
from Beta 1 through the last supported ordinal, including missing or duplicate
ordinals, respins, withdrawals, replacements, and a bounded next-ordinal test.

Developer Preview is not automatically Developer Beta. RC remains
`releaseCandidate`; GM remains `goldenMaster`; public beta remains a separate
`publicBeta` event. Internal, employee, carrier, leaked, partner, and
invitation-only AppleSeed material does not establish `developerBeta` without
explicit registered-developer distribution evidence. A build stays absent
unless a source directly ties it to the exact appearance.

Rows without a positive identity receive explicit, reversible negative or
applicability findings. “No result found” is not proof of non-applicability, and
a next-ordinal do-not-create decision is bounded to the packet cutoff.

Each completed wave must run a fresh read-only production reconciliation using
the published perspective with `useCdn: false`, checking both exact
`{releaseVersionId, channel, routeAlias}` and
`{releaseVersionId, channel, sequence, appearanceDate}` identities. That check
must be repeated immediately before any separately authorized future mutation.

Two independent stages are mandatory:

1. an evidence-and-chronology reviewer, different from the researcher; and
2. an integration-and-freshness reviewer, different from both the researcher
   and the first reviewer.

Neither review stage authorizes stable IDs, Sanity changes, page builds,
publication, or deployment. Those remain separate owner-authorized work.

## Mechanical validation

[`validation.json`](validation.json) reports 7 waves, 115 rows, 115 unique
release-version IDs, zero overlap with the four priority-packet parents, zero
errors, and zero warnings. The validator reads only the packet-local frozen
plan, so later shared-aggregate drift cannot change its result.
