# Version Record

Version Record is an independent, source-backed software release archive. It
records release families, versions, channel appearances, verified builds,
release notes, community-observed changes, citations, corrections, and
historical release data.

Apple operating systems are the first and only implemented catalog. Public
URLs are vendor-qualified now so Apple links remain stable when another
catalog is added. Supporting a future Tesla, Rivian, or other software track
will still require a vendor-specific schema/normalization adapter and public
route implementation; it is not enabled by adding Sanity records alone.

Intended production URL: <https://www.versionrecord.com/>

## How the site is built

The application is Next.js 16 with Sanity as its editorial CMS and Vercel as
its intended host.

- Sanity owns editable release content: platforms, release families, versions,
  release events, builds, changes, articles, sources, audits, and corrections.
  The current informational and policy pages remain code-backed; their reserved
  schemas are hidden from Studio until a frontend renderer is connected.
- The audited local chronology remains the regression oracle for the historical
  Apple timeline and forecast engine.
- Existing `releaseVersion.milestones` remain readable during migration.
  First-class `releaseEvent` documents replace only the linked legacy
  milestone; unmatched history stays visible throughout a partial migration.
  New releases use events as their sole chronology source.
- A release appearance and a build are different records. Developer beta,
  public beta, RC, and public availability stay separate even when evidence
  shows that they share a build.
- Forecasts and timeline analytics are supporting views; the source-backed
  release record is the primary product.

The editor is available at `/studio/` in local and deployed environments.
Routine release articles and citations can be added there without opening a
code editor after the schemas have been deployed.

## Local development

Use Node.js 24:

```sh
npm ci
cp .env.local.example .env.local
npm run dev
```

The site runs at <http://localhost:3000/> and Studio at
<http://localhost:3000/studio/>.

Required public Sanity settings are:

```sh
NEXT_PUBLIC_SANITY_PROJECT_ID=lh3yswzu
NEXT_PUBLIC_SANITY_DATASET=production
CANONICAL_SITE_URL=https://www.versionrecord.com
```

## Public URL hierarchy

```text
/apple/                                      vendor catalog
/apple/ios/                                  platform archive
/apple/ios/26/                               release-family index
/apple/ios/26.3                              version overview
/apple/ios/27.0/beta-4/                      appearance alias
/apple/ios/26.3/build/23d123/                 canonical build record
```

Old Apple routes such as `/ios/26.3` permanently redirect to the
vendor-qualified URL. Legacy production hosts redirect directly to the new
canonical domain.

An appearance and its verified build remain separate public records: a beta or
release candidate can carry event-specific notes while the build page records
the binary identity and every channel in which it appeared. Citation-pending
build and event pages remain `noindex`; they enter the sitemap only after the
Sanity review, provenance, citation, and substantive-content gates all pass.
Version and release-family pages are deliberately always indexable: they
publish the audited first-party chronology with a visible provenance state
even before editorial layers are complete, and they are the primary landing
surface for release-date queries.

## Adding a release in Sanity

The normal editorial workflow is:

1. Create or select the platform, release train, and `releaseVersion`.
2. Add each channel appearance as a `releaseEvent`, including its date,
   audience/applicability, availability state, and sources.
3. Create a `releaseBuild` only when source evidence verifies the build number.
   Link one or more events to it.
4. Add reusable changes to the change library, then attach a release-specific
   occurrence to the event or build. Mark it as delta, inherited, or cumulative
   and as documented, partially documented, undocumented, or unknown.
5. Write an original overview or article. Add citations to material claims and
   page-level sources. Do not paste a publisher’s article or full release notes.
6. Move the editorial review to Approved. Enable indexing only when the schema
   accepts the source and content gates.

Do not duplicate new appearances in `releaseVersion.milestones`. That field is
an optional compatibility container for the audited pre-event chronology; the
read layer automatically projects first-class events into forecasts, timeline
statistics, family summaries, and calendar exports.

Version pages work before all editorial layers are complete: the audited
chronology is shown with a visible legacy provenance state until first-class
events and citations are published.

## Sources, citations, and reuse

`source` documents store a canonical URL, publisher, author, source class,
publication/access dates, archive URL, link status, and reuse basis. Portable
Text supports inline source annotations that render as numbered superscripts
with an accessible reference ledger.

The archive publishes an original synthesis of facts. Brief quotations are
allowed only when exact wording matters and remain attributed. Licensed or
owned editorial images require alt text, a rights basis, a rights holder, and
an internal rights note before Sanity accepts them.

Structured factual exports are CC0. Editorial prose, third-party prose, images,
logos, and trademarks are not included in that license.

## Parallel release research

Research-only agents should follow
[`docs/research-agent-handoff.md`](docs/research-agent-handoff.md). It defines
disjoint assignment files, evidence custody, source and copyright standards,
and the machine-readable findings packet expected by later page-building
agents. Research agents must not write to production Sanity.

## Audited chronology and migration

Build and validate the frozen chronology with:

```sh
npm run data:build:check
npm run data:validate
npm test
```

Plan the milestone-to-event migration locally:

```sh
npm run migration:events:plan
npm run migration:events:plan -- --input snapshot.ndjson --json
```

The planner:

- has no Sanity client and no production write path;
- rejects production/apply flags and snapshots containing drafts;
- preserves exact milestone projection and unknown CMS fields;
- emits stable event identities and a separately validated schema-ready
  projection;
- never infers builds from free-text notes;
- places note-derived build, device, withdrawal, channel, and rename facts in
  a human-review queue.

The audited seed currently projects to 410 versions and 1,979 events with exact
legacy parity. No event/build migration is applied automatically.

The historical reconciler remains available as a guarded chronology tool:

```sh
npm run sanity:history:check
```

Its apply command remains intentionally explicit and revision-guarded. Do not
run it as part of ordinary editorial work.

The checked-in launch cohort has its own source-backed ingestion plan:

```sh
npm run sanity:launch:check
```

That command is read-only against Sanity. It produces an exact plan hash and
private rollback snapshot under `.migration-artifacts/`, validates the
serialized transaction against the Content Lake payload ceiling, and prints
the manual production-apply command. See
[`scripts/LAUNCH_CONTENT_INGESTION.md`](scripts/LAUNCH_CONTENT_INGESTION.md)
for the guarded review and apply workflow.

The old general seed and launch-only 2026 backfill are retired. Their scripts
now fail loudly because they omit current lifecycle/provenance fields or target
obsolete placeholder records.

## Search and research exports

The public search page uses a generated, allowlisted index of releases, events,
builds, and changes:

```text
/search/
/api/search-index/
```

Versioned structured exports are available as JSON and CSV:

```text
/exports/v1/manifest.json
/exports/v1/README.txt
/exports/v1/releases.{json,csv}
/exports/v1/events.{json,csv}
/exports/v1/builds.{json,csv}
/exports/v1/changes.{json,csv}
/exports/v1/occurrences.{json,csv}
/exports/v1/citations.{json,csv}
/exports/v1/provenance.{json,csv}
```

Private moderation records and internal editorial fields are excluded by
explicit allowlists.

## Private submissions and feed candidates

Community reports are accepted at `/submit/`. The API refuses to write unless
all of these are configured:

```sh
SANITY_MODERATION_PROJECT_ID=lh3yswzu
SANITY_MODERATION_DATASET=moderation
SANITY_MODERATION_WRITE_TOKEN=...
```

The moderation dataset must be private and must not be the public content
dataset. Use a dedicated least-privilege token. The public Studio intentionally
hides and disables moderation documents; reviewers need a separate Studio
workspace pointed at the private dataset and reusing the moderation schemas.

Submission intake is JSON-only and includes size limits, validation,
same-origin checks, a honeypot, rate limiting, optional Turnstile, privacy
attestations, and a 180-day deletion/anonymization date. Nothing is published
automatically.

The daily feed-candidate cron additionally requires:

```sh
CRON_SECRET=...
FEED_INGEST_ALLOWED_HOSTS=developer.apple.com,support.apple.com
```

A feed must be enabled in the private Sanity dataset and its exact hostname
must appear in the server allowlist. The worker rejects private/reserved network
destinations and redirects, bounds responses, stores metadata only, and creates
`publicationBlocked: true` candidates for human review.

## Verification

Before deployment:

```sh
npm run lint
npm test
npm run data:build:check
npm run data:validate
npm run forecast:validate
npm run build
```

Sanity schema validation:

```sh
npx sanity schema validate
```

## Deployment and domain cutover

Pushing the connected branch deploys through Vercel. Set
`CANONICAL_SITE_URL=https://www.versionrecord.com`, attach the domain, add the exact
origin to Sanity CORS with credentials enabled, and submit
`https://www.versionrecord.com/sitemap.xml` to search engines only after the domain
is serving the new build.

The implementation does not itself create datasets, change DNS, attach the
domain, run production migrations, or deploy. Those operational steps are
separate and should follow a reviewed dry run. The retired domain is
intentionally not part of the public redirect set.

Vercel Web Analytics remains the active cookieless traffic service. Google
Analytics and advertising remain disabled unless their documented environment,
consent, privacy, and operator-identity requirements are deliberately enabled.

Version Record is independent and is not affiliated with or endorsed by Apple
Inc. Apple product and platform names are trademarks of Apple Inc.
