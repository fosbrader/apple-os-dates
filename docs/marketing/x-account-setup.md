# X Account Setup Kit — Version Record

Prepared 2026-07-31. Everything below is copy-paste ready for account creation.
Handle availability was checked live on 2026-07-31.

## Handle

| Candidate | Status (2026-07-31) | Notes |
|-----------|--------------------|-------|
| `@versionrecordhq` | ✅ **REGISTERED 2026-07-31** | The account |
| `@version_record` | Available as of 2026-07-31 | Unused alternate |
| `@VersionRecord` | ❌ Taken | Inactive personal account (1 post, Sep 2025). After the account is established, an X inactive-username request or trademark route is possible but not worth blocking on |

## Profile fields

- **Display name:** `Version Record`
- **Handle:** `@versionrecordhq`
- **Bio** (137/160 chars):
  > Independent, source-backed archive of Apple OS release history. Every date cited, corrections public, data CC0. 410 versions since 2001.
- **Website:** `https://www.versionrecord.com`
- **Location:** (leave blank, or "The release timeline")
- **Category** (if offered as Professional account): Media & News, or Science & Technology
- **Profile photo:** `docs/marketing/x-assets/avatar-400.png` (rasterized from the site icon — timeline dots on cream)
- **Banner:** `docs/marketing/x-assets/banner-1500x500.png` (1500×500, wordmark + tagline + timeline motif, matches og.png design language)

Note: Version Record is independent and not affiliated with Apple. Keep "independent"
in the bio — it is both the brand position and useful clarity for X impersonation rules.

## Pinned post (post first, pin immediately)

> Every iOS, iPadOS, macOS, watchOS, tvOS, and visionOS release since 2001 — betas, RCs, builds, and public releases — with a citation for every claim and a public corrections ledger.
>
> The structured data is CC0. Take it.
>
> https://www.versionrecord.com

## First-week posts (one per day, any order after the pin)

1. **Forecasts angle:**
   > iOS 27 beta cycles don't have to be a guessing game. We model the next beta drop and the public release window from 25 years of Apple's actual release cadence — and show our work.
   >
   > https://www.versionrecord.com/forecasts/

2. **Corrections-ledger angle (the trust wedge):**
   > Every release archive gets dates wrong sometimes. We're the only one that publishes its own mistakes: every correction, what changed, and why, in a public ledger.
   >
   > https://www.versionrecord.com/corrections/

3. **Open-data angle:**
   > 410 Apple OS versions. ~2,000 release events. Verified build numbers. Citations for all of it. Free as in CC0 — JSON and CSV, no API key, no scraping needed.
   >
   > https://www.versionrecord.com/exports/v1/manifest.json

## Recurring format: beta drop day (~10 min, same day any beta ships)

Template:
> {Platform} {version} beta {n} is out — build {build}, {days} days after beta {n-1}.
>
> That's {faster/slower than / right on} the historical median for a {platform} .{x} cycle.
>
> Timeline: {version page URL}

Escalation per the campaign plan: during Sep 7–13 GA week, post the
forecast-vs-actual retrospective thread same-day.

## Setup-flow notes

- Sign up with `apps@bfosler.com` (or a dedicated alias), enable 2FA immediately (authenticator app, not SMS-only).
- Expect X to require phone verification during signup for new accounts.
- Skip the "follow 3 topics / 10 accounts" onboarding pressure — or follow Apple-dev
  adjacent accounts (release-notes watchers, Apple developer news) to seed the feed.
- Per the campaign plan, X is a tier-2 presence channel: ~10 min/post, don't expect it
  to carry the launch. Bluesky/Mastodon mirrors of the same posts are near-free reach.

## Expected cadence (from launch-campaign-2026-08.md)

- Week of Aug 3: create account, pin post, 3 first-week posts.
- Aug 10–16: quote-post the Show HN thread when it goes up.
- Ongoing: beta-drop-day posts, same-day.
- Sep 7–13: GA-week surge — forecast retrospective thread, same-day build-number posts.
