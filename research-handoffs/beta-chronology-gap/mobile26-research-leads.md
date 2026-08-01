# iOS and iPadOS 26.1–26.6 public-beta research leads

Status: discovery notes only; not a frozen candidate packet  
Prepared: 2026-07-30 (America/New_York)  
Sanity writes authorized: **no**

These notes identify a bounded next wave and source traps discovered while
triaging the remaining coverage matrix. They are not sufficient evidence for
event creation. A research agent must capture the pages, find a second
independent contemporary publisher lineage for every identity, reconcile exact
production identities again, and submit a frozen packet for independent review.

## Candidate lead sequence

| Version | Public-beta appearance leads for both iOS and iPadOS |
| --- | --- |
| 26.1 | PB1 2025-09-24; PB2 2025-10-07; PB3 2025-10-14; PB4 2025-10-20 |
| 26.2 | PB1 2025-11-06; PB2 2025-11-18 |
| 26.3 | PB1 2025-12-17; PB2 2026-01-13; PB3 2026-01-27 |
| 26.4 | PB1 2026-02-17; no later public ordinal is established by this discovery pass |
| 26.5 | PB1 2026-04-03; PB2 2026-04-14; PB3 2026-04-21; PB4 2026-04-27 |
| 26.6 | PB1 2026-05-28; PB2 2026-06-16; PB3 2026-06-29; PB4 2026-07-07; PB5 2026-07-13 |

If all identities survive source and production review, this lead set represents
19 appearances per platform and 38 candidates total. Do not assume iOS evidence
automatically establishes iPadOS; each retained locator must explicitly name
both platforms or the relevant platform separately.

## Lead pages

- iCulture, “iOS 26.1 Release Candidate beschikbaar: dit zit in de update”  
  <https://www.iculture.nl/nieuws/ios-26-1-beta/>
- iCulture, “iOS 26.2 beta beschikbaar: dit zit in de update”  
  <https://www.iculture.nl/nieuws/ios-26-2-beta/>
- iCulture, “iOS 26.3 beta beschikbaar: dit zit in de update”  
  <https://www.iculture.nl/nieuws/ios-26-3-beta/>
- iCulture, “iOS 26.4 beta beschikbaar: dit zit er in de nieuwste beta”  
  <https://www.iculture.nl/nieuws/ios-26-4-beta/>
- iCulture, “iOS 26.5 beta beschikbaar: dit is er nieuw in deze versie”  
  <https://www.iculture.nl/nieuws/ios-26-5-beta/>
- iCulture, “iOS 26.6 beta beschikbaar: alles over de nieuwe beta voor iPhone”  
  <https://www.iculture.nl/nieuws/ios-26-6-beta/>

Useful independent-source starting point:

- 9to5Mac, “iOS 26.1 public beta now available, here’s everything new”  
  <https://9to5mac.com/2025/09/24/ios-26-1-public-beta-now-available-heres-everything-new/>

Search the MacRumors and 9to5Mac contemporary archives for the remaining
ordinals. Reuse relevant captured evidence in existing `research-handoffs/`
packets when its exact locator supports the public appearance, but do not count
two articles from one publisher family as independent lineages.

## Mandatory conflict checks

1. **iPadOS 26.1 PB1 labeling error.** The iCulture iPadOS timeline labels the
   2025-09-24 row “Public Beta 2,” while the same page's revision history
   identifies iOS 26.1 and iPadOS 26.1 Public Beta 1 on that date. Treat the
   timeline row as a publisher error; require independent explicit PB1 evidence
   before proposing the iPadOS identity.
2. **iOS/iPadOS 26.2 sequence is not developer-parallel.** The page records
   Public Beta 1 on 2025-11-06 and Public Beta 2 on 2025-11-18, while developer
   Beta 2 appeared between them and developer Beta 3 shares the second public
   payload. Do not invent a public appearance for developer Beta 2.
3. **iOS/iPadOS 26.4 appears to have only PB1.** The lead page lists developer
   Betas 2–4 but no later public ordinal. Absence from one rolling page is not
   proof of non-release. Run explicit searches and preserve negative research;
   do not infer PB2–PB4 from developer numbering.
4. **iOS/iPadOS 26.5 year typo.** The rolling iCulture timeline displays 2025
   for the April PB2–PB4 and RC rows, even though the article, cycle, revision
   history, and chronology place them in 2026. Do not silently inherit those
   displayed years. Each date needs an independent 2026 source and the conflict
   must remain in the packet.
5. **Same-day does not mean same event.** Several 26.1, 26.5, and 26.6 public
   appearances share a date and possibly a build with the developer seed.
   Preserve separate `developerBeta` and `publicBeta` appearances.
6. **RC is not a numbered public beta.** Do not create a `publicBeta` event from
   an RC merely because public testers received it.

## Required output

Create a separate frozen packet under
`research-handoffs/beta-chronology-gap/mobile26-public/` using the shared
candidate schema and the evidence rules in the program README. It must include:

- exact iOS and iPadOS release-version parent reconciliation;
- complete positive and negative sequence tables for 26.1 through 26.6;
- two independent contemporary publisher lineages per proposed identity;
- raw-byte hashes and bounded locators;
- explicit conflict records for every issue above;
- zero production IDs, mutations, page builds, or deployments; and
- a self-check that leaves independent review pending.

