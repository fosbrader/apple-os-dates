# Version Record — Project Handoff

Last updated: 2026-07-31

This document is the working handoff for development, editorial data work, and
deployment. Update it whenever a milestone, release, decision, or issue
changes. Keep source research in the research handoff and batch files; this
document tracks project state rather than reproducing evidence.

## Product

Version Record is a source-backed historical archive of software releases. It
starts with Apple operating systems and is designed to add other vendor tracks
later (for example Tesla and Rivian). A release version has a durable overview;
each appearance (developer beta, public beta, RC, public release, security
response, or recovery) can have its own notes, sources, and changes.

Editorial rules:

- Write original synthesis; never paste publisher release-note prose.
- Cite every factual article block and material change.
- Keep source publisher, URL, access date, archive URL, and reuse basis.
- Mark undocumented/community claims as reported or corroborated until
  independently confirmed.
- Do not index citation-pending or unreviewed pages.

## Current architecture

- Next.js 16 application with Sanity as the editorial CMS.
- Vercel is the existing hosting target (`.vercel/project.json`).
- Canonical domain configured in code: `https://www.versionrecord.com`.
- Apple routes are vendor-qualified under `/apple/...`; legacy Apple routes and
  old hosts redirect to the canonical hierarchy.
- Sanity Studio is available at `/studio/`.
- First-class `releaseEvent`, `releaseBuild`, `releaseChange`, and `source`
  records are the preferred model. Legacy `milestones` remain readable for
  compatibility.

## Content status (production)

| Area | Current state |
| --- | ---: |
| Release versions | 410 total; 410 full cited articles |
| Release appearances | 2,068 total |
| Approved rich appearances | 666 with cited notes and structured changes |
| Source-linked but not rich | 256 |
| Timeline-only appearances | 1,297 |
| Public-beta events | 20 (iOS/iPadOS represented) |
| Approved chronology handoff candidates | 666 across 186 versions |
| Open chronology follow-up queue | 76 |
| Developer-beta audit queue | 115 parent targets |

The 666 rich appearances are already published. The 1,297 timeline-only
appearances must not receive invented filler; they need source research,
editorial review, and a guarded Sanity manifest before publication.

## Completed milestones

- [x] Reframed the site from a date tracker into a cited release archive/wiki.
- [x] Added vendor-qualified Apple information architecture and redirects.
- [x] Added Sanity schemas for versions, events, builds, changes, sources,
  editorial review, moderation, and corrections.
- [x] Added inline source annotations and accessible source ledgers.
- [x] Published the approved 410 version articles and 666 rich appearances.
- [x] Completed the public-beta chronology audit and custody/integrity checks.
- [x] Added guarded, revision-aware launch-content ingestion with dry-run,
  rollback, draft-conflict, payload-size, and zero-residual checks.
- [x] Repaired Dataset structured data: typed Organization creator/publisher,
  CC0 license URL, and URL-valued `isPartOf`.
- [x] Verified 135 tests pass, lint has zero errors, and the production build
  completes. Build warnings are limited to Sanity responses exceeding the
  Next.js cache-size threshold.

## Immediate milestones

1. **Deploy current validated build.** Complete; the cleaned production build is
   live on the existing Vercel project.
2. **Connect the custom domain.** Complete; `versionrecord.com` and
   `www.versionrecord.com` are attached in Vercel, with the apex redirecting to
   the canonical `www` hostname.
3. **Finish high-priority research.** Start with the 22 high-priority approved
   chronology targets and the two public-beta evidence targets in
   `research-handoffs/beta-chronology-gap/developer-gap-next/`.
4. **Publish in reviewed waves.** Each wave needs a checked-in manifest,
   deterministic plan SHA, rollback artifact, explicit production apply, and a
   post-apply zero-mutation rerun.
5. **Expand vendors.** Add a vendor adapter, schemas/routes, and source policy
   before adding Tesla, Rivian, or another catalog.

## Versioning and release process

Application releases use normal Git history and deployment previews. Editorial
releases are Sanity documents and should not require code changes.

For a new release:

1. Create/select the platform, release train, and release version.
2. Add each channel appearance with date, audience/applicability, state, and
   citations.
3. Add a build only when the build number is independently verified.
4. Add reusable changes and a release-specific occurrence state.
5. Write original cited overview/article content.
6. Set editorial review to Approved and enable indexing only after validation.

For batch publication, use `scripts/ingest-launch-content.ts` in dry-run mode,
review the generated plan and rollback snapshot, then apply only the exact
reviewed plan SHA. Never use a research manifest as an automatic production
write.

## Idea bank

- Vendor landing pages with consistent release-track navigation.
- “What changed” comparison between adjacent versions and builds.
- Community-sourced undocumented changes with evidence levels and moderation.
- Source-ledger view showing first-party, journalism, community, and archive
  evidence separately.
- Corrections history and article revision diffs.
- Search facets for vendor, platform, version, channel, date, build, and source
  class.
- Exportable, CC0 factual datasets with editorial prose kept separately
  licensed.
- Coverage dashboard showing which versions are timeline-only, source-linked,
  or fully reviewed.
- Later catalog adapters for Tesla, Rivian, and other popular software tracks.

## Issue tracker

| ID | Priority | Status | Issue / next action |
| --- | --- | --- | --- |
| DEP-001 | P0 | Complete | Deploy the validated current build to Vercel. |
| DEP-002 | P0 | Complete | Attach `versionrecord.com` and `www.versionrecord.com` in Vercel; apex redirects to `www`. |
| SEO-001 | P1 | Monitoring | After deployment, validate GSC Dataset fixes and request recrawl. |
| DATA-001 | P1 | Open | Research and publish the 1,297 timeline-only appearances in reviewed waves. |
| DATA-002 | P1 | Open | Complete 115-target developer-beta audit queue. |
| DATA-003 | P1 | Open | Resolve macOS public-beta historical coverage; confirm watchOS/tvOS policy. |
| PERF-001 | P2 | Open | Reduce oversized Sanity queries/cache responses before scale-up. |
| VENDOR-001 | P2 | Backlog | Define the first non-Apple vendor adapter and route contract. |

## Deployment checklist

- [x] Production build passes locally.
- [x] Tests and lint pass.
- [x] Deploy the current source to the existing Vercel project.
- [x] Smoke-test homepage, Apple archive, version, event, sitemap, redirects,
  and structured data on the production hostname.
- [x] Owner purchased the final domain and attached both apex and `www` in
  Vercel; `www.versionrecord.com` is canonical.
- [ ] Add `https://www.versionrecord.com` to Sanity CORS with credentials
  enabled, then verify HTTPS, robots, sitemap, and Search Console recrawl.

## Key files

- `README.md` — contributor/editorial workflow.
- `docs/research-agent-handoff.md` — research-agent contract.
- `scripts/LAUNCH_CONTENT_INGESTION.md` — guarded Sanity publication workflow.
- `scripts/research-batches/` — source-backed research manifests and receipts.
- `research-handoffs/beta-chronology-gap/` — public-beta audit register and
  developer follow-up plan.
- `src/sanity/schemas/` — CMS schema definitions.
