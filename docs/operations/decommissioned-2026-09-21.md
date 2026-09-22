# Service retirement — September 21, 2026

Version Record was retired at the owner's request. Application source and
Git history are preserved locally and on GitHub.

## Removed services

- Deleted Vercel project `apple-os-dates`
  (`prj_0qwngAfJQWNOI9AeOpcFoPCbT7tZ`), including its deployments,
  project domain bindings, environment variables, cron, and deployment integration.
- Deleted the dedicated private Vercel Blob store `version-record-moderation`
  (`store_bCwWE4zmzbPHSlDj`). It had no stored objects.
- Deleted Sanity project `Apple OS Release Dates` (`lh3yswzu`), including its
  production dataset. No separate Studio host was configured.
- Disabled GitHub Actions repository-wide and the quality-check and submission
  monitor workflows. Removed `SUBMISSION_MONITOR_SECRET`. GitHub Pages was
  already inactive; its historical system workflow cannot be individually
  disabled, but repository-wide Actions are disabled.
- Disabled Cloudflare Registrar auto-renewal for `versionrecord.com`.
  The existing registration expires July 31, 2027. The Cloudflare zone is on
  the free plan and has no connected Workers.

## Preservation

- The latest pre-retirement checkout is preserved on GitHub at
  `codex/archive-2026-09-21` (commit `306a417`).
- All 25 local branches were copied to GitHub under
  `codex/history-2026-09-21/` without rewriting existing branches.
- A verified complete Git bundle, CMS document export (9,568 records), all ten
  downloadable CMS images, service inventories, and DNS settings are retained
  privately in `.local-archive/decommission-2026-09-21/` on the original machine.
  Five image downloads match their original Sanity SHA-1; five are the CDN-served
  image representations and differ from original upload hashes. The document
  export preserves the original image metadata.
- Private backups and service configuration are intentionally excluded from Git.

## Verification

- Vercel and Sanity project lookups both return 404.
- The Vercel storage inventory no longer contains the site's store.
- Both custom-domain URLs and the main Vercel alias return 404.
- All 20 inventoried historical Vercel deployment URLs return 410.
- Sanity's public API, API CDN, and a sampled image asset return 404.
- GitHub reports repository Actions as disabled and no remaining Actions secrets.

Search-engine listings and independent third-party caches may outlast the
service. They do not indicate that the original hosting remains active.
