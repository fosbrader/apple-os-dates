# Apple Release Tracker

Next.js site for browsing Apple operating-system beta, release candidate, and
public release dates. Release data is managed in Sanity Studio and rendered on
Vercel with incremental static regeneration.

Production: <https://apple-os-dates.vercel.app/>

## Local development

Use Node.js 24, then install dependencies and start the development server:

```sh
npm ci
npm run dev
```

The public site runs at <http://localhost:3000/> and the authenticated editor
runs at <http://localhost:3000/studio/>.

Copy `.env.local.example` to `.env.local` when you need a Sanity write token,
Search Console verification, or a different deployment URL.

## Content updates

```sh
npm run sanity:seed
```

After `npx sanity login`, the seed command adds missing records from
`scripts/seed-data.json`. It never overwrites records that friends have edited
in Studio and never deletes CMS-only records. Routine updates should be made
through `/studio`; published changes are reflected on the public site within
about 60 seconds.

## Deployment

Pushing `main` deploys the application through the connected Vercel project.
GitHub Pages is intentionally not used, so the Vercel production URL remains
the single canonical host.

Set `CANONICAL_SITE_URL` to the custom production domain before attaching
one, and add that exact origin to Sanity CORS with credentials enabled.
Optional Google and Bing verification values are documented in
`.env.local.example`.
