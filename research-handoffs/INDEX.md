# Version Record — Apple release research program index

Generated: 2026-07-30T18:00:00Z
Coordinator: coordinator-orchestrator

## 1. Backlog reconciliation (read-only, live production)

- Production releaseEvent documents (total, any status): 2,068
- Production releaseVersion documents: 410 (410 fullArticle, 0 sourceLinked, 0 timelineOnly — version-level overview coverage is complete and out of scope for this program)
- Incomplete releaseEvent appearances as of this snapshot: **1,553** (256 sourceLinked + 1,297 timelineOnly). This matches the coordinator brief exactly — no drift.
- Local unpublished candidates found under `scripts/research-batches/` (73 checked-in bundles, validated via `npm run research:validate` — 0 structural errors, 4,214 globally consistent change keys): 703 event overlays total.
  - **160** of those 703 target currently-incomplete production events → reserved, do not re-research (see §2).
  - **543** of those 703 target events that are now already `fullArticle`/`approved` in production (verified by direct field spot-check, e.g. iOS 8.0 Beta 1: `reviewStatus=approved`, `provenanceStatus=editoriallyVerified`, 1,003-char article, 34 citations). These were evidently applied to Sanity by a prior session via the guarded `ingest-launch-content.ts` pipeline; the checked-in JSON/MD files are now stale artifacts for those specific targets, not a duplication risk.
  - Collisions between local batches on the same still-incomplete target: **0**.
  - `research-handoffs/` had no pre-existing content (this is the first batch created under that contract).
- **True new-research backlog after subtracting reserved local candidates: 1,393 events.**

Reconciliation method and full per-target detail: `tmp/backlog-reconciliation.json` (gitignored; not committed). Regenerate with `npx sanity exec tmp/export-and-reconcile.ts --with-user-token` if the snapshot needs refreshing — re-run before trusting these numbers if significant time has passed.

## 2. Local candidates reserved (not re-researched)

`scripts/research-batches/*.json` batches with at least one event still matching a currently-incomplete production target. These targets are considered **fully researched and reserved**; they are excluded from the master register below and must not be reassigned. They still need the normal guarded `ingest-launch-content.ts` dry-run review and explicit human `--apply` approval before they leave the backlog for real — that is a publication decision outside this research program's scope.

| Local batch file | Total events | Reserved (matches incomplete) | Already applied (no longer incomplete) |
| --- | ---: | ---: | ---: |
| apple-ios-11-point-prerelease.json | 57 | 29 | 28 |
| apple-ios-ipados-16.json | 23 | 23 | 0 |
| apple-ios-ipados-18.json | 21 | 21 | 0 |
| apple-ios-ipados-14.json | 19 | 19 | 0 |
| apple-other-2024.json | 13 | 13 | 0 |
| apple-ios-12.json | 11 | 11 | 0 |
| apple-ios-8.json | 11 | 11 | 0 |
| apple-ios-9.json | 11 | 11 | 0 |
| apple-ios-10-point-prerelease.json | 10 | 10 | 0 |
| apple-ios-ipados-26-maintenance.json | 8 | 8 | 0 |
| apple-ios-5.json | 4 | 4 | 0 |

**Local batches that are now fully superseded by production** (every event already applied; nothing to reserve, nothing to re-research — listed for audit completeness only):

<details><summary>62 fully-applied local batch files</summary>

| Local batch file | Total events |
| --- | ---: |
| apple-26-1-26-3-prerelease-archive.json | 14 |
| apple-26-4-prerelease.json | 4 |
| apple-26-5-26-6-prerelease.json | 6 |
| apple-ios-1.json | 9 |
| apple-ios-10-prerelease.json | 2 |
| apple-ios-10.json | 8 |
| apple-ios-11-prerelease.json | 7 |
| apple-ios-11.json | 12 |
| apple-ios-12-prerelease.json | 1 |
| apple-ios-2-prerelease.json | 8 |
| apple-ios-2.json | 6 |
| apple-ios-3-prerelease.json | 6 |
| apple-ios-3.json | 6 |
| apple-ios-4-point-prerelease.json | 12 |
| apple-ios-4-prerelease.json | 5 |
| apple-ios-4.json | 11 |
| apple-ios-5-point-prerelease.json | 5 |
| apple-ios-5-prerelease.json | 8 |
| apple-ios-6-point-prerelease.json | 7 |
| apple-ios-6-prerelease.json | 4 |
| apple-ios-6.json | 8 |
| apple-ios-7-point-prerelease.json | 5 |
| apple-ios-7-prerelease.json | 7 |
| apple-ios-7.json | 9 |
| apple-ios-8-point-prerelease.json | 16 |
| apple-ios-8-prerelease.json | 6 |
| apple-ios-9-point-prerelease.json | 13 |
| apple-ios-9-prerelease.json | 4 |
| apple-ios-ipados-13-prerelease.json | 16 |
| apple-ios-ipados-13.json | 21 |
| apple-ios-ipados-14-prerelease.json | 8 |
| apple-ios-ipados-15-prerelease.json | 16 |
| apple-ios-ipados-15.json | 20 |
| apple-ios-ipados-16-prerelease.json | 6 |
| apple-ios-ipados-17-prerelease.json | 6 |
| apple-ios-ipados-17.json | 25 |
| apple-ios-ipados-18-prerelease.json | 8 |
| apple-ios-ipados-26-prerelease.json | 27 |
| apple-macos-10-4.json | 1 |
| apple-macos-2001.json | 2 |
| apple-macos-visionos-26-maintenance.json | 6 |
| apple-nonios-2023-prerelease.json | 6 |
| apple-nonios-2024-prerelease.json | 8 |
| apple-nonios-26-0-prerelease.json | 7 |
| apple-os-27-prerelease.json | 10 |
| apple-other-2002.json | 1 |
| apple-other-2003.json | 1 |
| apple-other-2007.json | 1 |
| apple-other-2009.json | 1 |
| apple-other-2011.json | 1 |
| apple-other-2012.json | 1 |
| apple-other-2013.json | 1 |
| apple-other-2014.json | 1 |
| apple-other-2015.json | 6 |
| apple-other-2016.json | 12 |
| apple-other-2017.json | 14 |
| apple-other-2018.json | 13 |
| apple-other-2019.json | 13 |
| apple-other-2020.json | 12 |
| apple-other-2021.json | 15 |
| apple-other-2022.json | 13 |
| apple-other-2023.json | 7 |

</details>

## 3. Master assignment register

Every one of the **1,393** true-backlog targets is represented in exactly one batch below (integrity-checked: 1,393 placed, 1,393 unique). Full per-target identity data lives in `research-handoffs/MASTER_REGISTER.json`. Batches are grouped by platform + coherent version family (classic Mac OS X 10.x is split by its actual named release train — e.g. Sierra/High Sierra/Mojave/Catalina — not by the constant "10" major component). Priority order favors the most recent, most source-linked, most reusable-source-cluster families first; oldest archival material (2008–2016) sorts last per the coordinator brief.

Total batches: **112** (4 closed in Wave 1, 108 queued for future waves).

### Wave 1 — closed (readyForEditorialReview)

| Batch ID | Family | Targets | Complete/Partial/NSNF | Researcher | Evidence reviewer | Status | Findings | Report |
| --- | --- | ---: | --- | --- | --- | --- | --- | --- |
| `apple-os-27-cycle` | iOS/iPadOS/macOS/watchOS/tvOS/visionOS 27 (cross-platform cycle) | 18 | 13/5/0 | research-agent-os27-cycle | evidence-reviewer-os27-cycle | readyForEditorialReview | research-handoffs/apple-os-27-cycle/findings.json | research-handoffs/apple-os-27-cycle/report.md |
| `apple-macos-26-b` | macOS 26 | 16 | 7/1/8 | research-agent-macos26-b | evidence-reviewer-macos26-b | readyForEditorialReview | research-handoffs/apple-macos-26-b/findings.json | research-handoffs/apple-macos-26-b/report.md |
| `apple-tvos-26-b` | tvOS 26 | 14 | 3/3/8 | research-agent-tvos26-b | evidence-reviewer-tvos26-b | readyForEditorialReview | research-handoffs/apple-tvos-26-b/findings.json | research-handoffs/apple-tvos-26-b/report.md |
| `apple-visionos-26-c` | visionOS 26 | 12 | 2/1/9 | research-agent-visionos26-c | evidence-reviewer-visionos26-c | readyForEditorialReview | research-handoffs/apple-visionos-26-c/findings.json | research-handoffs/apple-visionos-26-c/report.md |

**Wave 1 totals:** 60 targets, 164 sources, 89 concepts, 234 claims, 139 occurrences. Coverage recommendation: 26 fullArticle, 34 sourceLinked, 0 timelineOnly. All four packets independently reviewed by a different agent than the one that researched them; every packet required at least one coordinator- or reviewer-applied correction before reaching readyForEditorialReview (see §4).

`apple-os-27-cycle`'s `report.md` was synthesized by the coordinator, not the original researcher, after three follow-up requests went unanswered on that one deliverable (findings.json itself was complete and correct throughout). The independent reviewer verified the synthesis against findings.json for transcription accuracy in addition to the normal review and found one minor undercount (see §4); everything else checked out.

### Queued — future waves (priority order)

Not yet assigned. No researcher has been locked to these targets; they remain available for the next wave.

| # | Batch ID | Family | Targets | SourceLinked / TimelineOnly | Date range |
| ---: | --- | --- | ---: | --- | --- |
| 1 | `apple-ios-26-a` | iOS 26 | 15 | 6 / 0 | 2025-09-15 .. 2026-03-18 |
| 2 | `apple-ios-26-b` | iOS 26 | 15 | 15 / 0 | 2026-03-24 .. 2026-07-27 |
| 3 | `apple-ipados-26-a` | iPadOS 26 | 15 | 6 / 0 | 2025-09-15 .. 2026-03-18 |
| 4 | `apple-ipados-26-b` | iPadOS 26 | 15 | 15 / 0 | 2026-03-24 .. 2026-07-27 |
| 5 | `apple-macos-26-a` | macOS 26 | 17 | 1 / 0 | 2025-08-11 .. 2026-02-04 |
| 7 | `apple-watchos-26-a` | watchOS 26 | 15 | 5 / 0 | 2025-06-09 .. 2026-03-05 |
| 8 | `apple-watchos-26-b` | watchOS 26 | 15 | 15 / 0 | 2026-03-09 .. 2026-07-27 |
| 9 | `apple-tvos-26-a` | tvOS 26 | 14 | 5 / 0 | 2025-06-23 .. 2026-03-09 |
| 11 | `apple-visionos-26-a` | visionOS 26 | 13 | 1 / 0 | 2025-06-23 .. 2025-10-20 |
| 12 | `apple-visionos-26-b` | visionOS 26 | 13 | 6 / 0 | 2025-10-28 .. 2026-03-24 |
| 20 | `apple-ios-18-a` | iOS 18 | 14 | 0 / 0 | 2024-07-23 .. 2024-10-07 |
| 21 | `apple-ios-18-b` | iOS 18 | 14 | 0 / 0 | 2024-10-14 .. 2025-03-03 |
| 22 | `apple-ios-18-c` | iOS 18 | 14 | 0 / 0 | 2025-03-10 .. 2025-07-21 |
| 23 | `apple-ipados-18-a` | iPadOS 18 | 14 | 0 / 0 | 2024-07-23 .. 2024-10-14 |
| 24 | `apple-ipados-18-b` | iPadOS 18 | 14 | 0 / 0 | 2024-10-21 .. 2025-03-10 |
| 25 | `apple-ipados-18-c` | iPadOS 18 | 13 | 0 / 0 | 2025-03-17 .. 2025-07-21 |
| 26 | `apple-macos-15-a` | macOS 15 | 17 | 0 / 0 | 2024-07-29 .. 2025-01-07 |
| 27 | `apple-macos-15-b` | macOS 15 | 17 | 0 / 0 | 2025-01-16 .. 2025-07-21 |
| 28 | `apple-visionos-2-a` | visionOS 2 | 12 | 0 / 0 | 2024-06-24 .. 2024-10-01 |
| 29 | `apple-visionos-2-b` | visionOS 2 | 11 | 0 / 0 | 2024-10-07 .. 2024-12-09 |
| 30 | `apple-tvos-18` | tvOS 18 | 14 | 0 / 0 | 2024-06-10 .. 2024-10-14 |
| 31 | `apple-watchos-11` | watchOS 11 | 8 | 0 / 0 | 2024-06-10 .. 2024-09-09 |
| 32 | `apple-ios-17-a` | iOS 17 | 14 | 0 / 0 | 2023-07-11 .. 2023-10-17 |
| 33 | `apple-ios-17-b` | iOS 17 | 14 | 0 / 0 | 2023-10-20 .. 2024-02-13 |
| 34 | `apple-ios-17-c` | iOS 17 | 12 | 0 / 0 | 2024-02-20 .. 2024-07-23 |
| 35 | `apple-ipados-17-a` | iPadOS 17 | 13 | 0 / 0 | 2023-07-11 .. 2023-10-10 |
| 36 | `apple-ipados-17-b` | iPadOS 17 | 13 | 0 / 0 | 2023-10-17 .. 2024-02-06 |
| 37 | `apple-ipados-17-c` | iPadOS 17 | 13 | 0 / 0 | 2024-02-13 .. 2024-07-23 |
| 38 | `apple-visionos-1-a` | visionOS 1 | 11 | 0 / 0 | 2023-06-21 .. 2024-02-27 |
| 39 | `apple-visionos-1-b` | visionOS 1 | 10 | 0 / 0 | 2024-03-04 .. 2024-07-23 |
| 40 | `apple-macos-14` | macOS 14 | 4 | 0 / 0 | 2023-08-22 .. 2023-09-21 |
| 41 | `apple-tvos-17` | tvOS 17 | 10 | 0 / 0 | 2023-06-05 .. 2023-09-12 |
| 42 | `apple-watchos-10` | watchOS 10 | 8 | 0 / 0 | 2023-06-05 .. 2023-08-29 |
| 43 | `apple-ios-16-a` | iOS 16 | 14 | 0 / 0 | 2022-07-11 .. 2022-10-18 |
| 44 | `apple-ios-16-b` | iOS 16 | 14 | 0 / 0 | 2022-10-25 .. 2023-03-21 |
| 45 | `apple-ios-16-c` | iOS 16 | 12 | 0 / 0 | 2023-03-28 .. 2023-07-18 |
| 46 | `apple-ipados-16-a` | iPadOS 16 | 13 | 0 / 0 | 2022-07-11 .. 2022-10-25 |
| 47 | `apple-ipados-16-b` | iPadOS 16 | 13 | 0 / 0 | 2022-11-08 .. 2023-03-21 |
| 48 | `apple-ipados-16-c` | iPadOS 16 | 12 | 0 / 0 | 2023-03-28 .. 2023-07-18 |
| 49 | `apple-macos-13` | macOS 13 | 13 | 0 / 0 | 2022-06-06 .. 2022-10-20 |
| 50 | `apple-watchos-9` | watchOS 9 | 14 | 0 / 0 | 2022-06-06 .. 2022-10-18 |
| 51 | `apple-tvos-16` | tvOS 16 | 14 | 0 / 0 | 2022-06-06 .. 2022-10-18 |
| 52 | `apple-ios-15-a` | iOS 15 | 18 | 0 / 0 | 2021-06-30 .. 2022-01-27 |
| 53 | `apple-ios-15-b` | iOS 15 | 18 | 0 / 0 | 2022-02-08 .. 2022-09-07 |
| 54 | `apple-ipados-15-a` | iPadOS 15 | 18 | 0 / 0 | 2021-06-30 .. 2022-01-27 |
| 55 | `apple-ipados-15-b` | iPadOS 15 | 18 | 0 / 0 | 2022-02-08 .. 2022-09-07 |
| 56 | `apple-watchos-8-a` | watchOS 8 | 14 | 0 / 0 | 2021-06-07 .. 2021-10-18 |
| 57 | `apple-watchos-8-b` | watchOS 8 | 14 | 0 / 0 | 2021-10-21 .. 2022-03-01 |
| 58 | `apple-watchos-8-c` | watchOS 8 | 12 | 0 / 0 | 2022-03-08 .. 2022-07-12 |
| 59 | `apple-tvos-15-a` | tvOS 15 | 13 | 0 / 0 | 2021-06-07 .. 2021-10-13 |
| 60 | `apple-tvos-15-b` | tvOS 15 | 13 | 0 / 0 | 2021-10-18 .. 2022-02-22 |
| 61 | `apple-tvos-15-c` | tvOS 15 | 13 | 0 / 0 | 2022-03-01 .. 2022-07-12 |
| 62 | `apple-macos-12` | macOS 12 | 12 | 0 / 0 | 2021-06-07 .. 2021-10-21 |
| 63 | `apple-watchos-7-a` | watchOS 7 | 18 | 0 / 0 | 2020-06-22 .. 2020-12-16 |
| 64 | `apple-watchos-7-b` | watchOS 7 | 18 | 0 / 0 | 2021-01-13 .. 2021-07-13 |
| 65 | `apple-tvos-14-a` | tvOS 14 | 13 | 0 / 0 | 2020-06-22 .. 2020-10-20 |
| 66 | `apple-tvos-14-b` | tvOS 14 | 13 | 0 / 0 | 2020-10-30 .. 2021-03-23 |
| 67 | `apple-tvos-14-c` | tvOS 14 | 12 | 0 / 0 | 2021-03-31 .. 2021-07-13 |
| 68 | `apple-ios-14-a` | iOS 14 | 18 | 0 / 0 | 2020-08-18 .. 2021-01-13 |
| 69 | `apple-ios-14-b` | iOS 14 | 17 | 0 / 0 | 2021-01-21 .. 2021-05-21 |
| 70 | `apple-ipados-14-a` | iPadOS 14 | 18 | 0 / 0 | 2020-08-18 .. 2021-01-13 |
| 71 | `apple-ipados-14-b` | iPadOS 14 | 17 | 0 / 0 | 2021-01-21 .. 2021-05-21 |
| 72 | `apple-macos-11` | macOS 11 | 10 | 0 / 0 | 2020-06-22 .. 2020-10-14 |
| 73 | `apple-ios-13-a` | iOS 13 | 15 | 0 / 0 | 2019-08-07 .. 2020-02-05 |
| 74 | `apple-ios-13-b` | iOS 13 | 15 | 0 / 0 | 2020-02-19 .. 2020-08-26 |
| 75 | `apple-ipados-13-a` | iPadOS 13 | 15 | 0 / 0 | 2019-08-07 .. 2020-02-19 |
| 76 | `apple-ipados-13-b` | iPadOS 13 | 14 | 0 / 0 | 2020-02-26 .. 2020-08-26 |
| 77 | `apple-tvos-13-a` | tvOS 13 | 16 | 0 / 0 | 2019-06-03 .. 2019-11-12 |
| 78 | `apple-tvos-13-b` | tvOS 13 | 15 | 0 / 0 | 2019-11-20 .. 2020-05-06 |
| 79 | `apple-watchos-6-a` | watchOS 6 | 15 | 0 / 0 | 2019-06-03 .. 2019-10-16 |
| 80 | `apple-watchos-6-b` | watchOS 6 | 14 | 0 / 0 | 2019-10-23 .. 2020-03-18 |
| 81 | `apple-macos-10-15` | macOS 10.15 | 11 | 0 / 0 | 2019-06-03 .. 2019-10-03 |
| 82 | `apple-ios-12-a` | iOS 12 | 15 | 0 / 0 | 2018-06-04 .. 2018-10-09 |
| 83 | `apple-ios-12-b` | iOS 12 | 15 | 0 / 0 | 2018-10-15 .. 2019-03-18 |
| 84 | `apple-ios-12-c` | iOS 12 | 13 | 0 / 0 | 2019-03-27 .. 2019-07-16 |
| 85 | `apple-watchos-5-a` | watchOS 5 | 16 | 0 / 0 | 2018-06-04 .. 2018-10-22 |
| 86 | `apple-watchos-5-b` | watchOS 5 | 15 | 0 / 0 | 2018-11-07 .. 2019-04-30 |
| 87 | `apple-tvos-12-a` | tvOS 12 | 17 | 0 / 0 | 2018-06-04 .. 2018-10-31 |
| 88 | `apple-tvos-12-b` | tvOS 12 | 16 | 0 / 0 | 2018-11-07 .. 2019-04-30 |
| 89 | `apple-macos-10-14` | macOS 10.14 | 11 | 0 / 0 | 2018-06-04 .. 2018-09-12 |
| 90 | `apple-tvos-11-a` | tvOS 11 | 13 | 0 / 0 | 2017-06-05 .. 2017-10-09 |
| 91 | `apple-tvos-11-b` | tvOS 11 | 13 | 0 / 0 | 2017-10-16 .. 2018-01-12 |
| 92 | `apple-tvos-11-c` | tvOS 11 | 13 | 0 / 0 | 2018-01-17 .. 2018-05-17 |
| 93 | `apple-watchos-4-a` | watchOS 4 | 17 | 0 / 0 | 2017-06-05 .. 2017-11-17 |
| 94 | `apple-watchos-4-b` | watchOS 4 | 16 | 0 / 0 | 2017-12-13 .. 2018-05-14 |
| 95 | `apple-macos-10-13` | macOS 10.13 | 10 | 0 / 0 | 2017-06-05 .. 2017-09-14 |
| 96 | `apple-ios-11` | iOS 11 | 6 | 0 / 0 | 2017-06-26 .. 2017-09-12 |
| 97 | `apple-tvos-10-a` | tvOS 10 | 15 | 0 / 0 | 2016-06-13 .. 2017-02-06 |
| 98 | `apple-tvos-10-b` | tvOS 10 | 15 | 0 / 0 | 2017-02-20 .. 2017-07-06 |
| 99 | `apple-watchos-3-a` | watchOS 3 | 16 | 0 / 0 | 2016-06-13 .. 2016-12-21 |
| 100 | `apple-watchos-3-b` | watchOS 3 | 16 | 0 / 0 | 2017-01-09 .. 2017-06-26 |
| 101 | `apple-ios-10` | iOS 10 | 16 | 0 / 0 | 2016-07-05 .. 2017-03-16 |
| 102 | `apple-macos-10-12` | macOS 10.12 | 9 | 0 / 0 | 2016-06-13 .. 2016-09-07 |
| 103 | `apple-tvos-9-a` | tvOS 9 | 10 | 0 / 0 | 2015-09-09 .. 2016-03-01 |
| 104 | `apple-tvos-9-b` | tvOS 9 | 10 | 0 / 0 | 2016-03-14 .. 2016-07-06 |
| 105 | `apple-watchos-2` | watchOS 2 | 15 | 0 / 0 | 2015-06-08 .. 2016-06-06 |
| 106 | `apple-ios-9` | iOS 9 | 2 | 0 / 0 | 2015-06-23 .. 2015-09-09 |
| 107 | `apple-macos-10-11` | macOS 10.11 | 1 | 0 / 0 | 2015-06-08 .. 2015-06-08 |
| 108 | `apple-macos-10-10` | macOS 10.10 | 1 | 0 / 0 | 2014-06-02 .. 2014-06-02 |
| 109 | `apple-macos-10-9` | macOS 10.9 | 1 | 0 / 0 | 2013-06-10 .. 2013-06-10 |
| 110 | `apple-macos-10-8` | macOS 10.8 | 1 | 0 / 0 | 2012-02-16 .. 2012-02-16 |
| 111 | `apple-macos-10-7` | macOS 10.7 | 1 | 0 / 0 | 2011-02-24 .. 2011-02-24 |
| 112 | `apple-macos-10-6` | macOS 10.6 | 1 | 0 / 0 | 2008-06-09 .. 2008-06-09 |

## 4. Evidence review status

All four Wave 1 packets were independently reviewed by an agent other than the one that researched them, per the handoff contract. Every packet needed at least one correction; none was rubber-stamped. Corrections were applied by the coordinator after independently re-verifying the reviewer's claim against retained evidence or a direct production query — never applied on the reviewer's word alone.

| Batch | Reviewer | Corrections required | Applied by | Independently re-verified by coordinator? |
| --- | --- | --- | --- | --- |
| `apple-visionos-26-c` | evidence-reviewer-visionos26-c | 1 material: two fields wrongly attributed a security fix to Siri/Mail/Notes, which appear in Apple's document only in an unrelated researcher-acknowledgements section | Coordinator | Yes — re-read the raw evidence directly before editing |
| `apple-macos-26-b` | evidence-reviewer-macos26-b | 6 (see below): 2 outcome misclassifications, 1 gap-severity correction, 1 disagreement extended with a second instance, 1 coverageSummary recompute, 1 report.md typo; plus a later superseding correction (see row below) | Coordinator | Yes — re-verified the highest-impact reclassification directly against findings.json |
| `apple-tvos-26-b` | evidence-reviewer-tvos26-b | 2 required + 1 optional: a false "missing chronology" alarm (see below) and one occurrence's device scope/wording corrected against the primary source | Coordinator | Yes — direct Sanity query, see below |
| `apple-os-27-cycle` | evidence-reviewer-os27-cycle | Metadata-only: one copyright word-count correction (5→6, all nominative product/programme names, not a real violation) and one undercount in the coordinator-synthesized report.md (said "one quotation," there are two citation instances of the same 14-word quote) | Evidence reviewer (self, on qualityChecks metadata only — no target content touched) | N/A — cosmetic, no target-level claim was at stake |

### Cross-batch finding: two independent "missing RC" false alarms, now corrected

Both `apple-tvos-26-b` and `apple-macos-26-b` independently reported what looked like a genuine chronology gap: a 26.6 release-candidate appearance their own research confirmed Apple shipped, with no matching target in their assignment. Both researchers correctly refused to fabricate a target and recorded it as a disagreement instead — but both wrongly inferred "not in my assignment" meant "no record exists in production," when the real reason was that both RC events are already `approved`/complete and therefore correctly never entered the incomplete-events backlog these assignments were built from. The tvOS evidence reviewer caught it first (direct evidence: an approved releaseEvent with a 874-character article); the coordinator independently re-verified via direct Sanity query for both platforms before correcting either packet's `findings.json`. **Root cause, not researcher error:** a research-only agent has no Sanity access and cannot distinguish "out of scope because complete" from "doesn't exist." Future wave kickoff prompts should state this boundary explicitly to prevent recurrence.

## 5. Material gaps

Aggregated from all four Wave 1 `findings.json.batchGaps` (20 total) and `disagreements` (21 total). Full detail in each batch's own files; below are the items that need a human decision outside this research program's authority (no Sanity write occurred for any of them):

- **Real, confirmed gap — no `publicBeta` channel event exists for macOS, watchOS, or tvOS 27.0** (only iOS/iPadOS do), independently confirmed by direct production query (`tmp/verify-270-publicbeta.ts`). Evidence strength differs by platform: **macOS is well-evidenced** (a dedicated MacRumors headline article plus corroboration) that a public beta shipped 2026-07-13; **watchOS and tvOS rest on a single inferential source** (one sentence about retained build numbers) and should get one more corroborating source before any chronology target is opened on equal footing with macOS. This may also reflect a deliberate editorial convention — `publicBeta` appears only on iOS/iPadOS across all 1,393 backlog targets from 2017–2026 — rather than an omission; worth confirming either way. (`apple-os-27-cycle`, disagreement-007 / batch-gap-public-beta-appearances-not-modelled)
- **Correction candidates on already-published citations** (facts hold, only locators/titles are wrong — see each batch's report.md "Conflicts and decisions" for exact current-vs-corrected text): 3 on `apple-tvos-26-b` (two subheading locators that don't exist on Apple's 26.4 support page; a StoreKit-testing heading conflation) and 4 on `apple-macos-26-b` (two developer-notes heading names, two support-article title paraphrases, one publisher URL slug naming the wrong version). None require a chronology decision, only an editorial locator fix.
- **Coverage ceiling is real, not a shortfall, on point-release batches**: Apple publishes one release-notes document per point release with no per-seed attribution, so most individual betas within `apple-macos-26-b` and `apple-tvos-26-b` cannot exceed `sourceLinked` even with a confirmed, dated build number. This is evidence-driven and expected, not something a future wave can fix by trying harder.
- **`apple-os-27-cycle` mid-cycle gap**: Apple's developer release index had no entries for three of the five weeks in this cycle when checked; 8 of 18 targets rest on contemporaneous journalism alone rather than a first-party identity source. Independently spot-checked by the evidence reviewer on 5 targets (2 with no first-party source) — held up as genuinely supported, not padded.

## 6. Final page-build queue

All 60 Wave 1 targets, across 4 packets, are `readyForEditorialReview` and available for the page-building phase (still out of scope for this research program — no Sanity write has occurred for any of them):

- `research-handoffs/apple-visionos-26-c/findings.json` — 12 targets (2 fullArticle, 10 sourceLinked)
- `research-handoffs/apple-macos-26-b/findings.json` — 16 targets (8 fullArticle, 8 sourceLinked)
- `research-handoffs/apple-tvos-26-b/findings.json` — 14 targets (3 fullArticle, 11 sourceLinked)
- `research-handoffs/apple-os-27-cycle/findings.json` — 18 targets (13 fullArticle, 5 sourceLinked)

## 7. Program totals (running)

- Targets in reconciled backlog: 1,393
- Targets assigned: 60 (Wave 1, closed)
- Targets queued/unassigned: 1,333 (108 batches)
- Packets ready (readyForEditorialReview): **4 of 4 assigned**
- Sources: 164 · Concepts: 89 · Claims: 234 · Occurrences: 139
- Target-level outcomes: 25 complete · 10 partial · 25 noSubstantiveNotesFound · 0 blocked
- Coverage recommendations: 26 fullArticle · 34 sourceLinked · 0 timelineOnly
- Material gaps requiring a human decision: 1 confirmed chronology question (§5), 7 correction candidates on existing citations (§5)
- False alarms caught and corrected before reaching the user as open questions: 2 (the RC "missing chronology" pattern, §4)
