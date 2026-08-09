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

Plan chronology metadata from a published local snapshot only:

```sh
npm run migration:chronology-metadata:plan -- \
  --input snapshot.json \
  --terminal-dates reviewed-terminal-dates.json \
  --write-artifacts
```

This dry-run-only planner has no Sanity client or apply mode. It emits exact
revision-guarded patch IDs, a deterministic plan hash, and a rollback artifact.
It defaults event `firstObservedAt` only from Sanity `_createdAt`, gives released
versions their `publicReleaseDate`, and requires a local cited terminal-date
record before it gives a superseded version a status-effective date. Supplied
terminal sources become deterministic version citations. Rollback entries
separate fields to restore from fields to unset, so a missing old value is
never written as data.

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

The public API gives paged, filtered JSON records. It has no API key:

```text
/api/
/api/v1/
/api/v1/openapi.json
/api/v1/releases/
/api/v1/events/
/api/v1/builds/
/api/v1/changes/
/api/v1/occurrences/
/api/v1/citations/
/api/v1/provenance/
/api/v1/search/?q=ios
```

The API only reads the same explicitly allowlisted public fields as the bulk
exports. Search returns derived matching metadata only; it does not return full
editorial text and gives a canonical `record.api_path` for the factual record.
The API sets public CORS headers, uses a stable application-error envelope, and
limits each page to 100 records. Collection and search paths must use the
trailing slash shown above. For a detail request, follow the returned
`links.self` value because the canonical form depends on the record ID.

The API reference uses ASD-STE100 writing principles. Its OpenAPI contract
documents field types, nullability, error behavior, ordering, pagination, and
the v1 compatibility policy.

### API production protection

Production uses one Vercel Firewall fixed-window rule for
`POST /api/submissions/`: five requests per IP per 15 minutes. This uses the
single rate-limit rule included with the Hobby plan without spending it on
read-only API traffic. Submission intake also uses free Vercel BotID Basic and
an in-process limit with the same five-attempt, 15-minute ceiling. BotID is initialized in
`src/instrumentation-client.ts`, enforced again in the server route, and fails
closed before a report can reach private storage. Do not remove the distributed
rule or BotID when changing the application limiter.

The optional `@vercel/firewall` integration remains available for a future
application-specific rate-limit ID. If it is enabled, set
`VERCEL_API_RATE_LIMIT_ID` and
`VERCEL_API_RATE_LIMIT_WINDOW_SECONDS=60`. See [Vercel's rate-limit guide](https://vercel.com/kb/guide/add-rate-limiting-vercel)
for the current dashboard flow and plan limits.

Versioned structured exports are also available as JSON and CSV:

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

## Private submissions

Community reports are accepted at `/submit/`. Valid reports are stored as
immutable JSON objects in the private `version-record-moderation` Vercel Blob
store. Blob paths contain only a date and random UUID; they never contain a
name, email address, URL, or submission text. Turnstile tokens and honeypot
values are never stored.

The store must be private and linked to the Vercel Production environment.
Vercel supplies short-lived OIDC credentials to Production functions; do not
add a long-lived `BLOB_READ_WRITE_TOKEN`. Preview intentionally has no queue
credentials and must fail closed. Development is also disconnected from the
private store. These separate Production secrets are required:

```sh
CRON_SECRET=...
SUBMISSION_MONITOR_SECRET=...
SUBMISSION_OPERATOR_SECRET=...
```

`CRON_SECRET` protects the daily `/api/cron/submission-retention/` job.
`SUBMISSION_MONITOR_SECRET` protects `/api/submissions/status/` and must have the
same value in the repository Actions secret of the same name. The status route
returns only `{"pending": boolean}`. It never returns a count, object path,
contact field, source, or submission text. `SUBMISSION_OPERATOR_SECRET`
protects the Production-only `/api/submissions/operator/` route. Provision or
rotate it from an authorized Mac with
`npm run submissions:operator:provision`, then redeploy Production. The
provisioner stores the matching local credential in the macOS login keychain
and configures it as a Sensitive Production-only Vercel variable without
printing it. macOS can require one operator-approved Keychain access dialog
after provisioning or rotation. Keep the three values independent.

Submission intake is JSON-only and includes streaming size limits, validation,
same-origin checks, a honeypot, rate limiting, Vercel BotID Basic, optional
Turnstile as a second check, privacy attestations, and automatic deletion within
180 days unless a legal, fraud, or security hold requires longer retention.
Nothing is published automatically. The public Sanity dataset does not register
moderation schemas, so submission records cannot be created accidentally
through the public Studio.

The scheduled GitHub Action polls only that Boolean status and manages one
generic public issue when review is needed. Submission contents and counts
never leave the private store. Use `npm run submissions:moderate -- list` to see
PII-safe queue metadata, then use the explicit-ID operator commands in the
moderation runbook. Routine moderation reads the operator credential from the
macOS login keychain and calls the fixed Production HTTPS route. It does not
download the Production environment, invoke Vercel CLI, or access Blob through
local OIDC. Resolving a record deletes that exact object; the daily retention
job is the backstop. A legal hold moves the immutable object to a private hold
prefix that automatic retention does not scan.

See `docs/operations/submission-moderation.md` for the queue workflow, failure
handling, and security boundaries.

The older feed-candidate worker is intentionally not scheduled. It requires a
genuinely private moderation database and remains disabled while the project
uses only free plans. If it is activated later, it additionally requires:

```sh
SANITY_MODERATION_PROJECT_ID=...
SANITY_MODERATION_DATASET=...
SANITY_MODERATION_WRITE_TOKEN=...
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
