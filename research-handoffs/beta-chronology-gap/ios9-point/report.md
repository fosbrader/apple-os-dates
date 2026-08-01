# iOS 9 point-release public-beta chronology handoff

Status: **corroborated; independent review pending for the new evidence**

Research cutoff: 2026-07-30  
Fresh production snapshot: `2026-07-31T04:02:59.835Z`  
Frozen prior independent review: preserved byte-for-byte  
Evidence directory: `tmp/ios9-point-evidence/`

## Outcome

All **27 public-beta appearances** across iOS 9.1, 9.2, 9.2.1, 9.3,
9.3.2, and 9.3.3 now have two independent contemporary publisher lineages.
This wave added one corroborator for each of the 25 identities that the frozen
independent review had left at one lineage. The other two identities retain
their previously reviewed MacRumors + 9to5Mac evidence.

A fresh read-only production query found **zero** scoped `publicBeta`
events. All 27 proposed identities therefore remain confirmed missing as of
the snapshot above. No Sanity mutation, stable ID assignment, page build,
publication, or deployment occurred.

## Exact chronology

| Version | Public label | Appearance | Evidence | Independent-review state | Paired developer route |
| --- | --- | --- | --- | --- | --- |
| 9.1 | Public Beta 1 | 2015-09-10 | corroborated | new corroboration pending review | existing |
| 9.1 | Public Beta 2 | 2015-09-24 | corroborated | new corroboration pending review | existing |
| 9.1 | Public Beta 3 | 2015-09-30 | corroborated | prior independent evidence review | missing |
| 9.1 | Public Beta 4 | 2015-10-06 | corroborated | new corroboration pending review | missing |
| 9.1 | Public Beta 5 | 2015-10-12 | corroborated | new corroboration pending review | missing |
| 9.2 | Public Beta 1 | 2015-10-29 | corroborated | new corroboration pending review | existing |
| 9.2 | Public Beta 2 | 2015-11-04 | corroborated | new corroboration pending review | existing |
| 9.2 | Public Beta 3 | 2015-11-10 | corroborated | new corroboration pending review | missing |
| 9.2 | Public Beta 4 | 2015-11-18 | corroborated | new corroboration pending review | missing |
| 9.2.1 | Public Beta 1 | 2015-12-17 | corroborated | new corroboration pending review | missing |
| 9.2.1 | Public Beta 2 | 2016-01-04 | corroborated | prior independent evidence review | missing |
| 9.3 | Public Beta 1 | 2016-01-14 | corroborated | new corroboration pending review | existing |
| 9.3 | Public Beta 2 | 2016-01-27 | corroborated | new corroboration pending review | existing |
| 9.3 | Public Beta 3 | 2016-02-10 | corroborated | new corroboration pending review | existing |
| 9.3 | Public Beta 4 | 2016-02-23 | corroborated | new corroboration pending review | existing |
| 9.3 | Public Beta 5 | 2016-03-01 | corroborated | new corroboration pending review | existing |
| 9.3 | Public Beta 6 | 2016-03-07 | corroborated | new corroboration pending review | missing |
| 9.3 | Public Beta 7 | 2016-03-14 | corroborated | new corroboration pending review | missing |
| 9.3.2 | Public Beta 1 | 2016-04-07 | corroborated | new corroboration pending review | existing |
| 9.3.2 | Public Beta 2 | 2016-04-21 | corroborated | new corroboration pending review | existing |
| 9.3.2 | Public Beta 3 | 2016-04-27 | corroborated | new corroboration pending review | missing |
| 9.3.2 | Public Beta 4 | 2016-05-03 | corroborated | new corroboration pending review | missing |
| 9.3.3 | Public Beta 1 | 2016-05-24 | corroborated | new corroboration pending review | existing |
| 9.3.3 | Public Beta 2 | 2016-06-07 | corroborated | new corroboration pending review | existing |
| 9.3.3 | Public Beta 3 | 2016-06-21 | corroborated | new corroboration pending review | missing |
| 9.3.3 | Public Beta 4 | 2016-06-29 | corroborated | new corroboration pending review | missing |
| 9.3.3 | Public Beta 5 | 2016-07-06 | corroborated | new corroboration pending review | missing |

## Scope closure

| Cycle | Assigned | Corroborated | Exact production matches | Unresolved identities |
| --- | ---: | ---: | ---: | ---: |
| iOS 9.1 | 5 | 5 | 0 | 0 |
| iOS 9.2 | 4 | 4 | 0 | 0 |
| iOS 9.2.1 | 2 | 2 | 0 | 0 |
| iOS 9.3 | 7 | 7 | 0 | 0 |
| iOS 9.3.2 | 4 | 4 | 0 | 0 |
| iOS 9.3.3 | 5 | 5 | 0 | 0 |
| **Total** | **27** | **27** | **0** | **0** |

## Evidence and copyright boundary

The packet keeps URLs, metadata, reproducible locators, byte counts, SHA-256
hashes, and short source-identification fragments. Every newly stored fragment
is at most 20 words. Raw publisher pages remain in the ignored local evidence
directory and are not reproduced in this handoff. Later articles should
paraphrase facts, cite the source adjacent to the claim, and avoid copying
publisher prose.

The 25 added sources span iCulture, AppleInsider, and 9to5Mac, each independent
from the candidate's retained MacRumors source. The source ledger explicitly
records publisher lineage, the exact candidate supported, and date basis.

## Conflicts and boundaries

- iOS 9.3.2 Public Beta 1 uses the explicitly dated April 7 public update,
  not the April 6 developer-article publication date.
- Two iCulture iOS 9.2 URLs or page sections retain developer-focused wording;
  the rendered public-specific headlines control, and the mismatch is retained.
- The iOS 9.3.3 Public Beta 1 and Public Beta 3 pages contain stale pre-update
  paragraphs alongside same-day revised public-specific headlines or leads.
  Both positions are documented rather than silently harmonized.
- The frozen exclusions remain in force: no iOS 9.2.1 Public Beta 3 was
  invented from an aggregate count, no developer Beta 1.1 was converted to a
  public event, no build was attached, and no public release was relabeled.

Full reasoning and reversal evidence are in [conflicts.json](./conflicts.json).

## Review boundary

The existing [review.json](./review.json) remains byte-identical and is not
rewritten to imply that its reviewer saw this later evidence. It independently
reviewed two candidates. The 25 new corroborations have only a mechanical
self-check in [corroboration-self-review.json](./corroboration-self-review.json);
a different reviewer must inspect them before promotion or ingestion.

## Recommended next action

An independent reviewer should reproduce the 25 new raw hashes, read every
bounded locator in context (especially the three documented source-text
conflicts), confirm the fresh production reconciliation, and issue a separate
review artifact. A coordinator can then decide whether to promote the 27
candidates. Publication and Sanity mutation remain separately unauthorized.

## Validation

- [x] Exact 27-target assignment closure
- [x] Two independent contemporary publisher lineages per identity
- [x] Raw byte counts and SHA-256 hashes reproduced
- [x] Added source-identification fragments bounded to 20 words
- [x] Fresh exact published-production reconciliation recorded
- [x] Misleading slugs, dated updates, and stale copy preserved explicitly
- [x] Prior independent review preserved byte-for-byte
- [x] No build inferred or attached
- [x] No Sanity write, stable ID, page build, publication, or deployment
- [ ] Independent review of the 25 newly added corroborators completed
