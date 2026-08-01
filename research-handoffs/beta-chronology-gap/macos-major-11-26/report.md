# macOS major public-beta chronology: 11.0 through 26.0

Status: **research packet frozen for independent review; no mutation or publication is authorized.**

## Result

The bounded scope contains **41 unique numbered public-beta routes** and **two additional same-label lifecycle reappearances**, for **43 observed public appearances**. Production contains no macOS `publicBeta` events and no exact identity matches for these routes.

| macOS | Unique routes | Pacific-normalized numbered appearances |
|---|---:|---|
| 11.0 | 6 | PB1 2020-08-06; PB2 2020-08-20; PB3 2020-09-08; PB4 2020-09-22; PB5 2020-09-30; PB6 2020-10-15 |
| 12.0 | 9 | PB1 2021-07-01; PB2 2021-07-16; PB4 2021-07-28; PB5 2021-08-12; PB6 2021-08-31; PB7 2021-09-22; PB8 2021-09-29; PB9 2021-10-07; PB10 2021-10-13 |
| 13.0 | 9 | PB1 2022-07-11; PB2 2022-07-28; PB3 2022-08-09; PB4 2022-08-26; PB5 2022-09-09; PB6 2022-09-21; PB7 2022-09-28; PB8 2022-10-05; PB9 2022-10-11 |
| 14.0 | 5 | PB1 2023-07-12; PB2 2023-07-31; PB3 2023-08-09; PB4 2023-08-22; PB5 2023-08-30 |
| 15.0 | 6 | PB1 2024-07-15; PB2 2024-07-24; PB3 2024-08-06; PB4 2024-08-12; PB5 2024-08-20; PB6 2024-08-28 |
| 26.0 | 6 | PB1 2025-07-21; PB2 2025-08-07; PB3 2025-08-14; PB4 2025-08-18; PB5 2025-08-25; PB6 2025-09-02 |

The non-contiguous Monterey sequence is intentional: Public Beta 3 was skipped. No macOS Sonoma Public Beta 6 is proposed.

## Same-label lifecycle appearances

- **macOS 13.0 Public Beta 5:** appeared September 9, 2022, was reported released then pulled, and returned under the same label on September 10. The unique route candidate uses September 9 with `availabilityState=replaced`; the return is preserved separately.
- **macOS 26.0 Public Beta 1:** appeared accidentally July 21, 2025, was pulled, and was officially released under the same label July 24. The unique route candidate uses July 21 with `availabilityState=replaced`; the official return is preserved separately.

Neither return creates a duplicate route, and neither is asserted to be an `isRevision` event without a defined lifecycle model.

## Important conflicts

- **Big Sur PB4–PB6:** retained public appearances exist on September 22, September 30, and October 15. Apple Wiki maps these to PB4, PB5, and PB6, and Cisco independently maps the September payload to PB5. A living iCulture chronology omits September 22 and calls September 30 PB4. All three late routes remain conflict-tagged.
- **Big Sur PB6 date:** the contemporary MacRumors update explicitly says October 15; Apple Wiki records October 16.
- **Monterey:** PB3 was skipped. PB10 is supported by 9to5Mac public-tester wording and an explicit Kobonemi PB10 label, while iCulture's chronology ends at PB9.
- **Ventura PB5:** September 9 release/pull and September 10 same-label return are modeled as one route plus one exceptional appearance.
- **Sonoma:** cross-platform reports carried the mobile fifth-public-beta count onto the August 22/23 Mac release. Mac-specific sources identify it as PB4 and the August 30/31 release as PB5; no PB6 is created.
- **Tahoe PB1:** the accidental July 21 release and official July 24 return share one identity.
- **Time zones:** Pacific newsroom dates are canonical when available; European-local next-day dates remain recorded conflicts, notably Sonoma PB4/PB5 and Tahoe PB5.

## Evidence and provenance

`sources.json` records 65 source entries. Every entry has retained raw bytes, byte count, SHA-256, a bounded source-identification fragment, a claim-specific locator, and publisher-lineage metadata. Candidate evidence references resolve only to packet sources. Each candidate has at least two independent publisher families; repeated pages from one publisher never count as additional independence.

Apple first-party public-seed archives do not expose a durable candidate-by-candidate chronology for this historical span. The packet therefore uses multiple contemporary editorial lineages, with vendor release notes and a retrospective release table only where they materially clarify a documented conflict.

No build is proposed. Developer seed ordinals and shared payloads are not used to manufacture public ordinals.

## Production reconciliation

The read-only published production query captured at `2026-07-31T04:24:01.340Z` found:

- 2068 total release events;
- 0 macOS public-beta events across all versions;
- 68 release events under the six target parents;
- 0 scoped public-beta events;
- zero exact matches for all 41 proposed identities.

All six target `releaseVersion` parents exist. No Sanity mutation was performed.

## Review boundary

The included review is a researcher self-check only. It is explicitly non-independent and grants no approval. An independent human reviewer must adjudicate every route, especially the eight conflict-tagged identities, before any mutation proposal is prepared.
