# Beta Cadence

Next.js site for browsing Apple operating-system beta, release candidate, and
public release dates, plus history-based forecast ranges. Release data is
managed in Sanity Studio and rendered on Vercel with incremental static
regeneration.

Production: <https://www.betacadence.com/>

## Local development

Use Node.js 24, then install dependencies and start the development server:

```sh
npm ci
npm run dev
```

The public site runs at <http://localhost:3000/> and the authenticated editor
runs at <http://localhost:3000/studio/>.

Copy `.env.local.example` to `.env.local` when you need a Sanity write token,
dormant GA4 testing, ad-account verification, a public contact address, or a
different deployment URL. Vercel Web Analytics does not require a local
environment variable.

## Content updates

```sh
npm run sanity:seed
```

After `npx sanity login`, the seed command adds missing records from
`scripts/seed-data.json`. It never overwrites records that friends have edited
in Studio and never deletes CMS-only records. Routine updates should be made
through `/studio`; published changes are reflected on the public site within
about 60 seconds.

The launch-only 2026 reconciliation is guarded and dry-run-first:

```sh
npm run sanity:backfill:2026:check
npm run sanity:backfill:2026:apply -- --confirm-production
```

It adds the official 26.4–26.6 cycles and active 27.0 records. The apply
command will update only the known one-milestone 26.4 placeholders; it stops
instead of overwriting later Studio edits. Do not use it for routine updates.

## Deployment

Pushing `main` deploys the application through the connected Vercel project.
GitHub Pages is intentionally not used, so the Vercel production URL remains
the single canonical host.

Set `CANONICAL_SITE_URL` to the custom production domain before attaching
one, and add that exact origin to Sanity CORS with credentials enabled.
Optional Google and Bing verification values are documented in
`.env.local.example`.

## Search Console and analytics

Prefer a Google Search Console **Domain property** for `betacadence.com`.
Verify it by adding Google's TXT record in Cloudflare DNS; that covers the apex,
`www`, and any future subdomains. The optional
`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` value supports a URL-prefix property if
needed. After verification, submit
`https://www.betacadence.com/sitemap.xml`.

Vercel Web Analytics is the active primary traffic measurement service. It
collects cookieless, aggregated page views on public routes and requires no
analytics environment variable. The `/studio` editor is excluded. The
`beforeSend` hook also strips URL query strings and fragments before an
analytics event is sent, so those values do not appear in the Web Analytics
payload.

The Google Analytics 4 implementation remains in the codebase for possible
future use, but production should leave `NEXT_PUBLIC_GA_MEASUREMENT_ID` unset.
In that state, no Google tag or Google consent interface loads and no site data
is sent to Google Analytics.

If GA4 is deliberately reactivated later, create a web data stream for the
canonical production domain and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to its `G-`
measurement ID. Google Consent Mode v2 defaults analytics and advertising
storage to denied, the Google tag is not loaded until a visitor explicitly
accepts analytics, and the visitor's choice is stored locally.
Advertising-related consent remains denied even after analytics is accepted.
Direct Studio loads never initialize the tag or show the consent prompt. The
public site does not link into Studio, and an unexpected client-side transition
to `/studio` forces a full reload into a tag-free editor page.

Before adding the measurement ID, configure GA4 user-level event retention to
two months and set `SITE_CONTACT_EMAIL` plus `SITE_OPERATOR_NAME`. Production
builds intentionally fail if analytics is enabled without that public contact
and controller information.

Client components can import `sendAnalyticsEvent` from `@/lib/analytics` to
send one of the typed product events. Event parameters must never contain
names, email addresses, free-form user text, or other personal data.

The dormant GA4 integration has typed product events wired for release views,
forecast views, calendar exports, release-notes clicks, and timeline platform
filters. Those events are sent only if GA4 is reactivated and the visitor
accepts analytics. Standard GA4 page-view and engagement measurement would
likewise begin only after consent.

## Forecast validation

Run the deterministic forecast checks after changing cohort selection,
percentiles, confidence rules, or freshness safeguards:

```sh
npm run forecast:validate
```

The public methodology is at `/methodology/`. Forecasts automatically pause
when source data is stale or a historical window has already elapsed.

## Advertising readiness

Advertising is intentionally inactive. About, methodology, sources/editorial
policy, privacy, contact/corrections, and the unofficial-Apple disclosure must
remain accessible before applying to AdSense.

When AdSense issues a publisher ID and the site is being added for review, set
`GOOGLE_ADSENSE_PUBLISHER_ID` to `pub-` (or `ca-pub-`) followed by the
16-digit ID. That publishes the AdSense account-verification meta tag and a
valid `/ads.txt`; it does not load advertising scripts or render ad units.
`SITE_CONTACT_EMAIL` and `SITE_OPERATOR_NAME` must also be configured. Ads
must remain disabled until site approval and the consent/privacy work below are
complete.

Before ads are enabled:

- confirm the Vercel plan permits commercial use;
- use a Google-certified consent management platform where required;
- update `/privacy/` with the live advertising behavior;
- keep ad storage and personalization disabled until the applicable consent;
- label placements and avoid layouts that could be mistaken for navigation or
  editorial content.

The custom analytics preference panel is not an advertising CMP and must not be
treated as one.
