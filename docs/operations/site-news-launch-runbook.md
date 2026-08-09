# Site News launch runbook

This runbook keeps the launch article private until the Site News application
code is deployed and the rendered draft has been approved. Publication is a
separate, final action. Deploying the code does not publish the article.

## Hard gates

- Public byline is `Version Record`; do not add a personal name or account.
- Never expose Sanity or preview tokens through a `NEXT_PUBLIC_` variable.
- Do not publish the launch article until both Preview and Production checks
  below pass and the user explicitly approves publication.
- Do not send the X launch post as part of article publication.
- The production article URL must remain a 404 for anonymous visitors until the
  Sanity document is published.

## Current content record

- Draft ID: `drafts.sitePage.launching-version-record`
- Public path after publication: `/news/launching-version-record/`
- Public byline: `Version Record`
- `publishedAt` and `updatedAt` remain empty while the document is a draft.

## Launch media inventory

- The staged Sanity hero is the 2400x1260 PNG social master.
- The staged SEO/rich-link image is the 1200x630 PNG rendition.
- All artwork uses the platform-neutral headline `When did that beta ship?`;
  the word `Apple` does not appear in the image copy.
- The local archival set in `docs/marketing/launch-assets/` includes the 4K
  3840x2160 master plus HD, square, portrait, story, thumbnail, JPEG, WebP, and
  AVIF renditions. That set remains locally uncommitted in the source worktree;
  archive it deliberately before cleaning that worktree, and do not silently
  replace or discard it.
- Keep the 4K master as an archive/downloadable source asset. Use the 1200x630
  rendition for Open Graph delivery so social crawlers receive a sharp image
  without an unnecessarily large payload.

## Integration state

- Integration branch: `feat/site-news-launch-integration`
- Deployed base: `origin/main` at `8f0d334`
- Site News commits were reapplied as `2867702` and `eb6b2fd`.
- The Sanity Studio merge keeps retired moderation document types inactive,
  keeps `siteSettings` inactive, and enables only `sitePage` for Site News.
- The sitemap keeps the deployed `/api/` entry, keeps `/search/` out, and adds
  News URLs only when an approved, timestamped article actually exists.
- The deployed page-specific social-image support in `src/lib/site.ts` is
  compatible with the article route and remains intact.
- The private preview variable names are documented in `.env.local.example`.
- The existing header keeps its deployed API link. A News link is intentionally
  deferred while `/news/` returns 404 before the first publication; do not add a
  navigation link that points anonymous visitors to an empty section.
- The user's main worktree and its unrelated local files were not modified.

## Server-only deployment configuration

Set these in both Vercel Preview and Production environments:

- `SANITY_API_READ_TOKEN`: a read-only Sanity token that can fetch drafts.
- `ARTICLE_PREVIEW_SECRET`: at least 32 random characters, shared only with the
  operator generating preview links.

Vercel supplies `VERCEL_ENV`. The readiness endpoint reports publication-ready
only when it is running in Production and both private-preview variables are
configured.

## Local validation

Run from the integrated worktree:

```sh
npm test
npm run lint
npx tsc --noEmit --incremental false
npx sanity schema validate
npm run build -- --webpack
```

Verify the article draft is still the only matching Sanity document and that
its timestamps are null before any deployment.

## Preview deployment

1. Deploy the integrated branch to a protected Vercel Preview deployment.
2. Confirm `/api/news-readiness/` returns the expected Site News feature version,
   `production: false`, and `previewConfigured: true`.
3. Generate a ten-minute signed link without printing or embedding the raw
   preview secret:

```sh
ARTICLE_PREVIEW_SECRET='<same server-only secret>' \
  npx tsx scripts/create-article-preview-url.ts \
  --slug launching-version-record \
  --origin https://<protected-preview-host>
```

4. Open the signed link. It should redirect to a clean article URL with the
   Draft Mode cookie set; the signed token must not remain in the address bar.
5. Inspect desktop and mobile layouts, the exact lead image, the visible
   organization byline, the unpublished-preview notice, and the on-page rich
   link approximation.
6. Verify `noindex`, `nofollow`, canonical URL, Open Graph article metadata,
   Twitter summary-card metadata, and Organization JSON-LD.
7. Confirm no personal name, email address, or personal social account is
   present in visible content or public metadata.
8. Use the Exit Private Preview control and confirm anonymous access returns a
   404.

## Production deployment before publication

1. Deploy the integrated, validated code to Production without publishing the
   Sanity document.
2. Confirm `https://www.versionrecord.com/api/news-readiness/` reports the
   expected feature version, `production: true`, and `previewConfigured: true`.
3. Confirm an anonymous request to the article URL still returns 404.
4. Generate a short-lived signed link for
   `https://www.versionrecord.com` and repeat the full article and rich-link
   review in Production Draft Mode.
5. Confirm `/news/` still returns 404 while there are no published Site News
   articles. It will become the public index after the first article is
   published.

## Publication

Only after explicit user approval, generate a fresh dry-run plan:

```sh
npx sanity exec scripts/publish-site-article.ts --with-user-token -- \
  --id sitePage.launching-version-record
```

Review the exact revision, byline, title, slug, timestamps, and plan SHA. Apply
that exact plan only with the timestamp and SHA printed by the dry run:

```sh
npx sanity exec scripts/publish-site-article.ts --with-user-token -- \
  --id sitePage.launching-version-record \
  --at '<DRY_RUN_TIMESTAMP>' \
  --deployment-url https://www.versionrecord.com \
  --apply --confirm-production --plan-sha '<DRY_RUN_PLAN_SHA>'
```

The command refuses the write unless the canonical production readiness
endpoint proves that the Site News code and private preview are deployed.

## Post-publication checks

1. Verify the article and `/news/` return 200 anonymously.
2. Verify the visible `Published` time, organization byline, canonical URL,
   indexable robots metadata, Open Graph image, and Article JSON-LD.
3. Wait beyond the independent page and sitemap revalidation windows; then
   confirm both `/news/` and the article URL appear in `sitemap.xml`.
4. Inspect the production rich-link result before asking for X-post approval.
5. Keep the X post as a draft until the user separately approves sending it.

## If publication must be reversed

Unpublish the Sanity document, verify the article and News index stop resolving
for anonymous visitors after revalidation, and do not reuse an old publication
plan SHA. Preserve the original publication timestamp if the same article is
later republished as an update.
