# iOS 12–18 major-cycle public-beta follow-up

## Outcome

This research-only supplement resolves all 12 records sent back by the independent review, but it does **not** approve implementation.

- Seven candidate identities remain unchanged and now have an additional exact contemporary lineage: iOS 12 Public Betas 1–5, iOS 17 Public Beta 6, and iOS 18 Public Beta 5.
- Two blocked candidate identities should be superseded: iOS 14's July 9 first public appearance displayed **Public Beta 2**, and iOS 15's July 16 second public appearance displayed **Public Beta 3**.
- The iOS 14 PB2 negative must be narrowed: PB2 existed on July 9, while no separate July 22 PB2 distribution is corroborated.
- The iOS 15 PB3 negative should be withdrawn because PB3 was the July 16 payload.
- Production's June 30 iOS 15 PB1 record is the same historical appearance that two sources identify as **Public Beta 2**. It is a correction target, never a duplicate-event creation target.

## Identity rule applied

The public label displayed to enrolled devices controls the ordinal. “First public beta” and “second public beta” may describe appearance order and cannot override direct Software Update wording or exact contemporary publisher labels.

This explains the apparently skipped early ordinals:

| Cycle | Appearance order | Date (Pacific) | Displayed / exact reported label |
| --- | ---: | --- | --- |
| iOS 14 | first | 2020-07-09 | Public Beta 2 |
| iOS 15 | first | 2021-06-30 | Public Beta 2 |
| iOS 15 | second | 2021-07-16 | Public Beta 3 |

## Evidence gate

Every proposed identity has two independent contemporary publisher families at the exact version, public ordinal, and Pacific appearance-date grain. For the seven unchanged candidates, the frozen parent packet supplies one lineage and this supplement supplies the missing second exact lineage. The corrected iOS 14/15 identities have two exact lineages in this supplement.

The raw source bytes, selected fragments, locators, SHA-256 hashes, and publisher-family independence declarations are frozen in `sources.json` and `raw-evidence-locks.json`. Selected excerpts are capped at 20 words; no release-note prose is copied.

## Production recheck

A fresh read-only Sanity query used the published perspective with `useCdn: false` at `2026-07-31T05:42:15.296Z`.

- All five exact release-version parents still exist.
- All unchanged or corrected missing targets remain absent.
- Production still has one June 30, 2021 iOS 15 public-beta event: `release-event-50da2e4e5ec3bdd8fa582ce1`, stored as Public Beta 1.
- The proposed Public Beta 2 correction matches that event's date, so duplicate creation is explicitly forbidden.

No Sanity mutation, stable event ID creation, page work, publication, or deployment occurred.

## Source-role corrections

`source-role-corrections.json` narrows ten overclaimed parent-source roles without editing the frozen parent packet. In particular, developer-beta numerals and appearance-count wording are not used as public-ordinal evidence.

## Required next step

A different agent must independently review this frozen supplement. Only a later, separately authorized implementation phase may update production, and it must correct the existing iOS 15 event in place rather than create a duplicate.
