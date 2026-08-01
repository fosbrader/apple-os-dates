# SEO Audit: versionrecord.com

**Date:** 2026-07-31
**Scope:** Recommended (full audit) — Technical SEO, On-Page SEO, Content Quality
**Baseline:** None (first audit on record; snapshot)
**Prioritization:** Impact/Effort matrix

## Health Score: 76/100

Foundations are unusually strong for a site at this stage: complete unique metadata on
all 20 routes, self-referencing canonicals everywhere, a citation-gated sitemap whose
1,206 URLs were verified to exactly match page-level robots directives (zero
mismatches across ~3,000 prerendered pages), linked structured-data graphs
(WebSite + SearchAction, Organization, BreadcrumbList, SoftwareApplication, Dataset),
single-H1 templates, no web fonts, and server-rendered crawlable links to all 410
versions. The score is held down by concentrated performance liabilities on
nav-linked pages (2.2 MB `/timeline/` HTML, 2.6 s TTFB on `/search/`), a fully
prerendered-but-unreachable legacy route tree, and several indexing-polish gaps.

## Data Sources

- ✅ Codebase static analysis (2 parallel auditors; findings cross-checked against `.next/` build output — sitemap/robots gate verified across all 1,206 sitemap URLs)
- ✅ Live production checks (headers, redirect chains, rendered meta/JSON-LD, TTFB/page-weight measurements, apex + legacy-domain behavior)
- ⚠️ Google Search Console / Semrush MCP not connected — rankings, impressions, backlinks, and field Core Web Vitals **not audited**
- ⚠️ PageSpeed Insights API keyless quota exhausted — no lab Lighthouse scores this run; TTFB/page-weight used as proxies

---

## Critical / High Issues

| # | Issue | Impact | Evidence | Fix |
|---|-------|--------|----------|-----|
| H1 | `/timeline/` ships 2.2 MB HTML (143 KB gz); `/analytics/` 1.5 MB. Full dataset serialized twice (HTML + RSC flight) into client components | High — worst CWV liability; scales linearly with archive | `src/app/timeline/page.tsx:77` → `TimelineView` client component; same pattern in `AnalyticsDashboard`. Live: 2,279,110 B and 1,521,403 B. Version pages also inflated (e.g. `/apple/ios/8.0` = 715 KB, 442 KB RSC) via `getHistoricalContext` (`src/lib/sanity.fetch.ts:322-346`) | Compute view models server-side; pass derived/paginated slices to client components |
| H2 | `/search/` rebuilds the entire search index on every request; only sitemap URL with no prerender | High — 2.56 s TTFB measured live; sitemap priority 0.8, primary-nav link; crawled facet variants each trigger full rebuild | `src/app/search/page.tsx:42-46` (searchParams → dynamic; `revalidate = 300` at line 13 inert), `src/lib/research/search.ts:106-117` (no memoization) | Cache the built index (module-level keyed on snapshot, or `unstable_cache`) — pure win |
| H3 | Legacy `src/app/[platform]/**` tree fully prerendered (417 pages) but 100 % unreachable behind 308s; redirect source list is hardcoded and will drift | High — doubles build/ISR surface; a new Sanity platform (e.g. `audioos`) would create a live duplicate URL tree with no redirect | `src/app/[platform]/page.tsx:58-61`, `[version]/page.tsx:125-128` vs. literal `applePlatforms` array at `next.config.ts:6-13`; `/apple/**` is a 3-line re-export | Move implementations under `/apple/`, delete legacy tree (or return `[]` from legacy `generateStaticParams` as the one-line interim fix); derive redirect list from the platform source of truth |
| H4 | Indexable event/build pages drop root `googleBot` directives (`max-snippet:-1`, `max-image-preview:large`) — Next.js replaces, not merges, the `robots` object | High — truncated snippets/small previews on exactly the citation-backed article pages you most want rich results for | `[event]/page.tsx:153-155`, `build/[build]/page.tsx:89-94` vs. `src/app/layout.tsx:108-118` | Restore the `googleBot` block in the `index: true` branch |
| H5 | `next/image` used while `images.unoptimized: true` — no srcset, no WebP/AVIF; full-res Sanity originals to every viewport | High on article pages where an editorial image is the LCP element | `next.config.ts:45` vs. `PortableArticle.tsx:254-259` (`sizes` attr is inert); `remotePatterns` is dead config | Enable optimization (confirm Vercel image-op cost model first) or size via Sanity CDN params |

## Medium Issues

| # | Issue | Evidence | Fix |
|---|-------|----------|-----|
| M1 | `/exports/v1/*` JSON/CSV/README indexable — missing the `X-Robots-Tag: noindex, noarchive` its sibling API route has; discoverable via crawlable anchor on `/search/` | `exports/v1/[file]/route.ts:19-26` vs. `api/search-index/route.ts:14` | Add header to `commonHeaders()` |
| M2 | `/exports` invisible to search the *right* way: no HTML landing page (URL 404s), no `Dataset.distribution`/`DataDownload` in any JSON-LD, one inbound link total | `ls src/app/exports` → only `v1/[file]/route.ts`; `factualDataset()` in `src/lib/structured-data.ts` omits `distribution` | Build `/exports/` landing page with Dataset + `distribution: [{DataDownload…}]` — only page class eligible for Google Dataset Search; highest-leverage single addition |
| M3 | Version pages have **no indexing gate**, contradicting stated policy ("citation-pending pages remain noindex"); timeline-only versions are fully indexable and unconditionally in sitemap. Largest page class on site | `[version]/page.tsx:129-176` (no `robots` on any success path), `sitemap.ts:190-195` (no `indexEligible` filter, unlike builds/events); `releaseVersion` schema has no `isIndexable`/`seo` fields | Make an explicit decision; if intentional (pages always carry factual chronology), document it — the metadata already computes `hasFullArticle` |
| M4 | 3-hop redirect chain on non-dotted legacy URLs: `/ios/26` → `/ios/26/` → `/apple/ios/26` → `/apple/ios/26/` (measured live) | Trailing-slash normalization runs before custom redirects; custom destination omits trailing slash | Emit trailing-slash destinations for non-dotted paths in `next.config.ts` redirects |
| M5 | One static 798 KB OG image (`/og.png`) shared by all 20 routes; two byte-identical, unreferenced OG-generator routes are dead code | `src/lib/site.ts:8`; `opengraph-image.png/route.ts` ≡ `social-preview-v2.png/route.ts`, zero references | Compress og.png (< 200 KB); wire the existing `ImageResponse` generator into per-page OG images for version/event/build pages (platform + version + date); delete one duplicate route |
| M6 | Event-page breadcrumb (JSON-LD and visible nav) skips Apple-catalog and platform levels — 3 items vs. the build page's correct 5; SERP breadcrumb won't match URL hierarchy | `[event]/page.tsx:221-246, 254-264` vs. `build/[build]/page.tsx:167-203` | Add the two missing `ListItem`s + visible crumbs |
| M7 | `openGraph.type: "website"` on every route including editorial articles (no `article` type / `publishedTime`); indexing-gate formula duplicated in GROQ (×2) and TS (×2) — agree today, can silently drift | `src/lib/site.ts:117`; `src/lib/queries.ts:1039,1057` vs. event/build `generateMetadata` | Use `type: "article"` on article-bearing pages; single-source the gate |

## Low Issues

- **About/Privacy titles are generic** (`"About"`, `"Privacy"` — `about/page.tsx:19`, `privacy/page.tsx:20`); every other static page has a substantive keyword-bearing title.
- **Version pages don't link up to their release-family index** — breadcrumb jumps platform → version, skipping the `/apple/ios/26/` level in their own URL; family pages reachable from only one parent page.
- **Structured-data polish:** home `CollectionPage` lacks `mainEntity` linking to the dataset graph; `/apple/` node missing `isPartOf: #website` (only page without it); build `WebPage.description` undefined on unapproved builds despite a good fallback existing; no FAQPage anywhere (`/methodology/` and `/sources/` are natural candidates); `/search/` lacks breadcrumbs.
- **Root-layout canonical is a trap:** `layout.tsx:77-79` sets canonical `/`, inherited by any page that forgets its own (currently only noindexed routes — latent, not live).
- **Faceted `/search/` params crawlable** — mitigated by hardcoded `/search/` canonical; watch in GSC (cost is server time per H2, not index bloat).
- **Dead weight:** `framer-motion` installed but its only importer (`PageTransition.tsx`) is itself unimported; `robots.ts` emits Yandex-only `Host:` directive (harmless).
- **Event-page canonical built from requested slug, not resolved slug** (`[event]/page.tsx:205-207` vs. `:147-151`) — nothing leaks today thanks to the alias `permanentRedirect`, but the two should share a value.

## Verified Correct (no action)

- Sitemap ↔ robots gate: **0 mismatches** across 1,206 sitemap URLs / ~3,000 prerendered pages (666/2,068 events and 46/76 builds correctly index-eligible).
- All 20 routes have unique titles + descriptions (100–157 chars); self-referencing canonicals; single H1 per template with coherent H2/H3 trees.
- WebSite + SearchAction (valid `EntryPoint`), Organization + logo on home; BreadcrumbList on catalog/platform/family/version/build pages.
- ISR uniform at 60 s across 3,048 routes; `generateStaticParams` on all dynamic families; no web fonts; CSS 24 KB gz; homepage 8 KB gz HTML, ~172 KB gz JS.
- Live: apex → www 308; `CANONICAL_SITE_URL` correct in production (www canonicals + www sitemap host verified); legacy `/ios/*` → `/apple/ios/*` 308s work; dotted version URLs resolve in a single hop; 404s return real 404s; `/studio/` noindexed + robots-disallowed; `/api/search-index` correctly noindexed; `ads.txt` correctly 404s when unconfigured; manifest valid; no orphan pages.
- Content depth: event pages ~2,500 rendered words; build pages ~425 (acceptable for record pages, and thin ones are gated from the sitemap). Bare-integer version/family URL collision impossible (schema regex).

## Prioritized Roadmap (Impact / Effort)

**Quick wins — ✅ ALL APPLIED 2026-07-31 (same day as audit; 136/136 tests pass, redirects verified against a local dev server)**
1. ✅ Memoize the search index (H2) — snapshot normalization cached 300 s (`src/lib/research/data.ts`), documents memoized per snapshot (`src/lib/research/search.ts`). Local: repeat search render 0.11 s.
2. ✅ Legacy `generateStaticParams` return `[]` (H3 interim) — `/apple/[platform]/page.tsx` now declares its own params so the canonical tree stays prerendered.
3. ✅ `googleBot` block restored on indexable event/build pages (H4).
4. ✅ `X-Robots-Tag: noindex, noarchive` added to exports `commonHeaders()` (M1).
5. ✅ `og.png` compressed 798 KB → 194 KB (sharp palette PNG, visually verified); duplicate `social-preview-v2.png` route deleted (M5a).
6. ✅ Redirect destinations now emit canonical slash shapes via dotted-leaf + catch-all rule pairs (M4); `tests/redirects.test.ts` updated to pin the new shapes and rule ordering. Un-slashed non-dotted legacy URLs retain one unavoidable Next normalization hop (3 → 2); all other forms are single-hop.
7. ✅ Titles: About → "About the Independent Release Archive", Privacy → "Privacy Policy" (Low).

**Medium effort, high leverage**
8. ✅ **DONE 2026-07-31** — `/exports/` landing page (M2): Dataset + 14 DataDownload distributions, CC0 license section, dataset table; added to sitemap + footer; `distribution` also added to the `/apple/` Dataset node. Verified rendering locally.
9. ✅ **DONE 2026-07-31** — Event-page breadcrumbs (M6): full 5-level trail in JSON-LD and visible nav, matching the build-page pattern.
10. ✅ **DONE 2026-07-31** — Per-page OG images (M5b): operator-approved template (dark editorial, Source Serif 4 + IBM Plex Mono vendored under OFL in `src/assets/fonts/`, 2400×1260) wired via file-convention `opengraph-image.tsx`/`twitter-image.tsx` on version, event, and build routes, fed by live release data (status, build, dot-sampled beta→RC→public cycle with event highlighting). `createPageMetadata` gained `socialImage: false` so the generated images outrank the static og.png on those routes; all other pages keep og.png. Verified live in dev: correct metas on version/event pages, home fallback intact, real-data renders for iOS 26.0 / 11.0 Beta 6 / iPadOS build.
11. ✅ **DONE 2026-07-31** — Version-page indexing policy (M3): documented as deliberate (README updated); noindex gate scoped to citation-pending event/build pages.
12. ✅ PARTLY DONE 2026-07-31 — `og:type: article` + timestamps on indexable event/build pages; home `mainEntity`, `/apple/` `isPartOf`, build `WebPage.description` fallback all fixed. Remaining: single-source the index-gate formula (GROQ×2 + TS×2).

**Larger engineering (the real CWV payoff)**
13. ✅ **DONE 2026-07-31** — Timeline/analytics view models (H1): client props cut 785.5 KB → 126.2 KB (timeline, −83.9 %) and → 51.1 KB (analytics, −93.5 %), measured against the live dataset; document totals estimated ~2.28 MB → ~1.6 MB and ~1.52 MB → ~0.79 MB. Interactivity unchanged; also fixed a latent timezone hydration divergence. `getHistoricalContext` deliberately not trimmed (server component — props never enter the flight payload). **Follow-up ticket:** the remaining `/timeline/` weight is 410 server-rendered rows × ~2,000 milestone markers — needs pagination/virtualization (visible-behavior change).
14. Consolidate legacy route tree into `/apple/` and derive the redirect platform list from data (H3 full fix).
15. Decide `images.unoptimized` (H5) after checking Vercel image-optimization pricing.

**Operational (no code)**
16. ✅ **DONE 2026-07-31** — Google Search Console connected as a Domain property (versionrecord.com). Data processing began same day; Performance/Indexing reports expected within ~1–2 days, CWV field data after ~28 days. Sitemap submitted 2026-07-31: **Success, 1,206 discovered pages** (exact match to the verified sitemap count). Optionally request indexing for `/`, `/apple/`, `/exports/` after the next deploy. The next audit can use GSC for rankings, crawl stats, and field CWV.
17. Re-run PageSpeed Insights (quota was exhausted today) for lab Core Web Vitals on `/`, `/timeline/`, `/apple/ios/26.0`.

## Unresolved Questions

- ~~Is version-page always-indexable behavior (M3) a deliberate policy choice?~~ **Resolved 2026-07-31:** yes — version/family pages carry the audited first-party chronology and are the primary landing surface for release-date queries; the noindex gate is scoped to citation-pending event/build editorial pages. README wording updated to state this explicitly.
- Is betacadence.com link equity worth preserving? Live check: it serves 404 (no duplicate-host risk); README says its exclusion from the redirect set is intentional.
- Vercel image-optimization cost tolerance (gates H5).
