# Apple Release Tracker

Static Next.js site for browsing Apple operating-system beta, release
candidate, and public release dates.

Production: <https://fosbrader.github.io/apple-os-dates/>

## Local development

Use Node.js 24, then install dependencies and start the development server:

```sh
npm ci
npm run dev
```

## GitHub Pages deployment

The site is exported to `out/` and deployed by
`.github/workflows/deploy-pages.yml` whenever `main` changes. The workflow gets
the configured Pages URL and base path from GitHub, so it works with both the
default project URL and a future custom domain.

To reproduce the project-site build locally:

```sh
NEXT_PUBLIC_BASE_PATH=/apple-os-dates \
NEXT_PUBLIC_SITE_URL=https://fosbrader.github.io/apple-os-dates \
npm run build
```
