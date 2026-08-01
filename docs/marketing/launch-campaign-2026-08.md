# Version Record — $0 Launch Campaign (Aug 3 – Sep 13, 2026)

**Goal:** grow page views. **Budget:** $0, organic only. **Operator:** solo dev, ~3–5 hrs/week.
**Site:** https://www.versionrecord.com — independent, source-backed Apple OS release archive (410 versions, ~2,000 release events since 2001, verified builds, citations, public corrections ledger, beta-cycle forecasts, CC0 exports at `/exports/v1/`).

Today is 2026-07-31. Apple's fall cycle (iOS 27 RC → GA, new hardware) lands in September 2026 — the single biggest traffic window of the year for this niche. Everything below is sequenced to peak into that window, not before it.

All estimates in this doc are **assumptions**, marked as such. No fabricated metrics.

---

## 1. Positioning

**Core pitch:** *Version Record is the source-backed, independent ledger of Apple's release history — every date has a citation, every mistake has a public correction, and the raw data is free.*

One-liner per audience:

| Audience | One-line pitch |
|---|---|
| Apple enthusiasts / prosumers | "Every iOS, macOS, watchOS, tvOS, and visionOS release since 2001 — with the actual build numbers and sources, not just a blog's memory of them." |
| Developers | "Machine-readable Apple release history — CC0 JSON/CSV, no scraping, no API key, updated as builds ship." |
| Data journalists / OSINT researchers | "A citation-backed dataset of Apple's release cadence you can verify line by line, with a public corrections ledger instead of silent edits." |
| Tech journalists / bloggers (MacRumors, 9to5Mac, indie newsletters) | "When you need the exact date a build shipped or how a past beta cycle actually played out, this is the archive with the receipts." |

The differentiator that should show up in *every* pitch: **the corrections ledger**. Nobody else in this niche publishes their own mistakes. That's the trust wedge, and it's also the most quotable, most linkable page on the site.

---

## 2. Channel plan (ranked by expected impact-per-hour)

### Tier 1 — do these first

**1. Hacker News — Show HN**
- Effort: ~1 hr to write + a few hours monitoring the thread same-day.
- Why it ranks #1: HN's audience overlaps heavily with "developer" and "data/OSINT" personas, front-page HN traffic can be 10k–50k+ visits in a day (*assumption*, HN front-page traffic is highly variable and not guaranteed), and a good HN thread is a durable backlink + Google-indexed discussion page.
- Angle: lead with the CC0 data + the corrections ledger, *not* "I built a website." Show HN rewards tools/data, punishes generic launch posts.
- Risk: one shot — a flat launch gets buried and is hard to resubmit credibly. Time it for a Tuesday–Thursday, 7–9am Pacific, and post the corrections-ledger or exports angle, not a homepage screenshot.

**2. Reddit — r/apple, r/iOSBeta, r/MacOS, r/jailbreak (data threads), r/dataisbeautiful (for a viz), r/opendata**
- Effort: ~30 min/post, but rule compliance research is the real cost (done below).
- Why it ranks high: these communities actively want release-date info during beta weeks, and self-promotion is *tolerated when it's genuinely useful and not repeated*. Reddit rewards a specific, useful answer over a generic launch post.
- Honest rules read (verify before each post — subreddit rules change):
  - **r/apple** (large, general Apple sub): self-promotion is restricted under its self-promotion rule (commonly a "9:1" or moderator-approval model on many large subs); a direct "check out my site" post is likely to be removed. Best use: comment with a specific fact/link when someone asks "when did X ship" — not a standalone submission.
  - **r/iOSBeta**: smaller, beta-focused, more tolerant of tool/resource links **when framed as directly useful for beta trackers** (e.g., "beta X dropped — here's the cycle history for context"), but still check the sub's posted rules for self-promo before posting and don't post as your first-ever contribution to the sub.
  - **r/MacOS**, **r/jailbreak**: similar — read each sub's rules page live before posting; assume most disallow "my project" posts without prior participation, and that mod discretion varies week to week.
  - **r/opendata**, **r/datasets**: these subs exist specifically for "I made a dataset" posts — this is the best-fit, lowest-risk subreddit for the CC0 exports angle.
  - **r/dataisbeautiful**: requires an actual visualization (not a link to a data page) and has strict OC (original content) + sourcing rules in its posted guidelines — only use this if a chart is built specifically for it.
  - General rule across all of these: **participate genuinely before posting anything self-promotional**, never post the same link to multiple subs same-day (reads as spam to mods and to Reddit's spam filters), and always re-read each sub's current rules page immediately before posting since mod teams change policy without notice.

**3. GitHub — mirror the CC0 exports as a public repo**
- Effort: ~1–2 hrs one-time setup, ~15 min/release to sync.
- Why: developers discover data via GitHub search and topic tags (`apple`, `ios`, `dataset`, `opendata`) far more than via a website. A repo with a clean README, sample queries, and a link back to versionrecord.com is a durable, low-maintenance discovery surface and a natural backlink. Push `/exports/v1/*.json` + `/exports/v1/*.csv` on a schedule (manual or a simple script), with the README explaining license (CC0 for data, not editorial prose) and linking every field back to its source page.
- This also gives Show HN and the data-subreddit posts a stronger artifact to link to than a bare website URL.

**4. Product Hunt**
- Effort: ~2 hrs to prep assets + a day of light engagement.
- Why tier 1 but below HN/Reddit: PH traffic converts to page views less reliably than HN for a *data/reference* product (PH skews toward "tools I can try in one click"), but it's still free, indexes well, and gives a permanent listing/backlink. Launch on a Tuesday–Thursday for peak traffic (*assumption based on general PH community norms*).

### Tier 2 — steady, lower-effort-per-hour but compounding

**5. Mastodon (Fediverse) + Bluesky**
- Effort: ~10 min/post.
- Why: no algorithmic gatekeeping like X; hashtag/community discovery (`#Apple`, `#iOS`, `#macOS`, `#opendata`) surfaces posts to interested niche audiences over days, not just at post time. Good fit for "beta drop day" same-day posts (see §5 content engine).

**6. X (Twitter)**
- Effort: ~10 min/post.
- Why lower than Bluesky/Mastodon here: organic reach for non-followed accounts is weak without paid boosting, but the Apple-enthusiast and tech-journalist audience is still disproportionately there, so it's worth a presence, just don't expect it to carry the launch.

**7. MacRumors / 9to5Mac / iMore tip lines**
- Effort: ~15 min per pitch email.
- Why tier 2: a single pickup from a MacRumors or 9to5Mac forum thread or news mention can dwarf every other channel's traffic (*assumption* — no guaranteed pickup, editorial discretion is entirely theirs), but response rates on cold tips are low and it's not repeatable weekly. Best used at two specific moments: (a) the corrections-ledger launch angle ("a website is publicly tracking its own Apple release-date mistakes"), and (b) September GA day with the most accurate/complete build-number record available same-day.

**8. Dev newsletters (e.g., open-data / API-focused newsletters, Console.dev-style link roundups, Changelog Weekly-style)**
- Effort: ~10 min per submission form.
- Why: most accept free reader-submitted links; low individual yield but near-zero cost and each is a standing backlink. Submit the GitHub data-mirror repo, not just the homepage — these newsletters skew toward tools/data over general websites.

### Tier 3 — background, compounding, not time-boxed to launch week

**9. Wikipedia citations**
- Effort: ~20–30 min per edit, done carefully.
- Why: Apple OS version articles on Wikipedia (iOS version history, macOS version history, etc.) are heavily trafficked and already cite release-date sources. Version Record's individual build/event pages are legitimate citation targets *only* where they add value Wikipedia doesn't already have* (e.g., citing a corrections-ledger entry, or a specific verified build page with primary sourcing) — not a blanket link-drop, which gets reverted fast and can get a domain blacklisted. Do this slowly, page by page, only where the citation is substantively useful, and expect some edits to be reverted; that's normal for a new citation source and not a signal to stop, just to be more selective.
- This is a backlink/authority play with a long payoff horizon, not a page-view play — don't count on it for the 6-week window, but start it now since it compounds for years.

**10. Answering in relevant forums/Discords (MacRumors forums, Apple Developer forums where on-topic, iOS beta Discords)**
- Effort: opportunistic, a few minutes when a relevant question appears.
- Why: same logic as Reddit comments — answer with a fact + link only when it's the best answer to a real question. Never a first-touch self-promotion.

---

## 3. Six-week calendar (Aug 3 – Sep 13, 2026)

Apple's fall beta cadence is not fully predictable from here, but expect weekly-ish developer betas through August, a public beta mid-August, RC(s) in early-to-mid September, and GA + hardware event in September (*assumption based on typical recent-year Apple cadence — confirm against the forecasts page itself as betas land*).

**Week 1 — Aug 3–9: Soft launch / seed**
- Ship the GitHub CC0-export mirror repo (Tier 1 #3). This is the asset every other post links to.
- Post to r/opendata and r/datasets (lowest-risk, best-fit subs) with the dataset angle.
- One Mastodon + one Bluesky post introducing the corrections ledger.
- Fix nothing user-facing this week that isn't already planned — spend the time on copy, not code.

**Week 2 — Aug 10–16: Show HN**
- Post Show HN Tuesday–Thursday morning Pacific (see copy in §4). Monitor and respond to every comment for the first 4–6 hours.
- Same week: submit to 2–3 dev newsletters pointing at the GitHub repo.
- Do not also launch Product Hunt this week — stagger tier-1 channels so each gets full attention and a fresh audience (posting HN and PH the same week means neither gets a clean shot from the same crowd).

**Week 3 — Aug 17–23: Product Hunt + beta drumbeat begins**
- Launch Product Hunt (assuming a public beta has landed or is imminent — pair the launch with a live forecast-page hook: "here's when the next beta should land, and here's how we know").
- Start the recurring "beta drop day" content format (§5) for whatever beta ships this week.
- First MacRumors/9to5Mac tip pitch: the corrections-ledger angle.

**Week 4 — Aug 24–30: Content drumbeat + Reddit comment presence**
- Continue beta-drop-day posts as new betas ship.
- Begin genuine participation in r/iOSBeta and r/MacOS threads (answering, not posting) to build standing before any self-promotional post there.
- One Wikipedia citation pass (2–3 careful edits, only where clearly additive).

**Week 5 — Aug 31–Sep 6: RC watch + pre-GA positioning**
- As RC builds land, publish same-day event pages and post the RC-specific beta-drop content.
- Second MacRumors/9to5Mac tip pitch, timed to RC: "most complete build-number record of the RC cycle so far."
- Prep the September GA-day content in advance (templates ready, not written — dates aren't fixed yet).

**Week 6 — Sep 7–13: GA / hardware event surge**
- This is the peak window — GA release day and the hardware event both fall in or near this week most years (*assumption; confirm actual date once Apple announces it*).
- Same-day GA post across all channels: timeline update, "how this cycle compared to the forecast" post (uses the forecast-accuracy backtest data already on the forecasts page — a genuinely novel angle nobody else has).
- Third tip-line pitch: GA-day accuracy angle.
- If HN/PH launch went well in weeks 2–3, this is also the moment to consider a second, narrower Show HN post specifically about the forecast backtest results (HN tolerates a second post from the same maker if it's a genuinely distinct, data-driven story — don't reuse the week-2 pitch).

---

## 4. Ready-to-use launch copy

### Show HN

**Title:**
`Show HN: Version Record – a source-backed archive of every Apple OS release since 2001`

**First comment (post immediately after submitting, as the top-level comment):**

> Hi HN — I built Version Record, an independent archive of Apple OS release history: iOS, iPadOS, macOS, watchOS, tvOS, visionOS. Right now it covers 410 versions and about 2,000 release events back to 2001, with verified build numbers and citations on the events that have them.
>
> Two things I think are actually different from the usual "release history" pages:
>
> 1. **A public corrections ledger** (versionrecord.com/corrections/) — when I get a date, a build number, or a source wrong, it's logged there instead of silently edited. I'd rather be checkable than "authoritative."
> 2. **CC0 structured data exports** (versionrecord.com/exports/v1/) — JSON and CSV for releases, events, builds, changes, and citations. No API key, no scraping needed. I also mirror it on GitHub [repo link] if you'd rather pull from there.
>
> There's also a forecasting page that predicts upcoming beta release dates from historical cycle lengths, with its own accuracy backtest shown against past predictions — happy to talk about how that works if anyone's curious.
>
> It's a solo project, editorially independent, not affiliated with Apple. Feedback on data gaps, wrong dates, or anything that looks off is genuinely welcome — that's what the corrections page is for.

### Product Hunt

**Tagline (≤60 chars):** `Apple's release history, with the receipts`

**Description:**
> Version Record is an independent, source-backed archive of Apple OS releases — iOS, iPadOS, macOS, watchOS, tvOS, and visionOS — from 2001 to today. Every release event links to its sources. Every mistake we've made is logged in a public corrections ledger, not quietly fixed. And the underlying data — releases, events, builds, changes, citations — is free to use under CC0, as JSON or CSV.
>
> If you follow Apple betas, build tools on release data, or just want to know exactly when a build shipped and how we know, this is built for you. No login, no paywall, no ads.

### Three example posts tied to real product surfaces

**A. Forecasts page (Reddit r/iOSBeta or a beta-week Mastodon/Bluesky post):**
> iOS 27 beta history so far, and what the historical cycle data says about when the next one lands: versionrecord.com/forecasts/ — it's built from every past beta-to-beta gap since [cycle start], shown with sample size and a confidence label, not just a guess. There's also a backtest showing how close past forecasts actually landed.

**B. Corrections ledger (Show HN comment reuse / a standalone "trust" post on Bluesky or a dev newsletter submission):**
> Most "Apple release history" pages just quietly fix mistakes. We log ours: versionrecord.com/corrections/ — every material date, sourcing, or attribution correction, with what changed and why. If you spot something wrong, versionrecord.com/submit/ goes straight into that review queue.

**C. CC0 exports (r/opendata, r/datasets, dev newsletter submission, GitHub repo README pinned post):**
> Released: a CC0 dataset of Apple's OS release history — 410 versions, ~2,000 release events, verified builds, and citations, from 2001 to now. JSON + CSV, versioned manifest, no key required: versionrecord.com/exports/v1/ (also mirrored on GitHub: [repo link]). Built for anyone doing Apple-ecosystem research, timelines, or tooling.

---

## 5. Recurring content engine (low-effort, repeatable, keyed to Apple's beta cadence)

1. **"Beta drop day" post** — same day a new developer/public beta ships: one-line post ("iOS 27 beta N is out — build [X], [date]") linking the fresh event page, cross-posted to Mastodon/Bluesky/X. ~10 min. This is the single highest-frequency, lowest-effort format — do it every single beta.
2. **"How this cycle compares" mini-post** — every 2–3 betas, a short post comparing the current cycle's gap-between-betas to the historical median shown on the forecasts page. ~15 min. Directly showcases the forecast-accuracy differentiator.
3. **"What changed" build-note post** — when a beta has documented changes attached in the change library, a short "here's what's new, with sourcing" post linking the event page. ~15–20 min. Reinforces the "original synthesis + citations" editorial standard as a feature, not just a policy.
4. **Corrections-ledger recap** — monthly, only if there's actually something to report: "N corrections logged this month" with one example, reinforcing the trust angle. ~10 min. Skip the month if there's nothing substantive — don't manufacture corrections to have content.
5. **GA-day accuracy retrospective** — once per cycle (September, and again each spring for the next major cycle), the highest-effort format: "we forecast a window of [X–Y], GA landed on [date] — here's the backtest." ~30–45 min, but this is the single best asset for a tip-line pitch and a second HN/PH-style post, so it earns the extra time.

---

## 6. Measurement

Vercel Web Analytics is the only active analytics service (cookieless, privacy-minimized; Google Analytics and ads remain disabled per the README). It gives page views, top pages, referrers, and countries — no event funnels beyond what's wired into `sendAnalyticsEvent` in `src/lib/analytics.ts` (custom events like forecast-view are already instrumented; use those to see whether launch traffic is actually reaching the differentiator pages, not just the homepage).

**What to watch weekly:**
- Total page views (the campaign's stated goal metric).
- Referrer breakdown — confirms which channel (HN, Reddit, PH, a tip pickup) actually drove traffic, since self-reported "it went well" on a thread doesn't always convert to visits.
- Landing page distribution — specifically whether `/forecasts/`, `/corrections/`, and `/exports/` (or the exports landing page, if built per the SEO audit's M2 recommendation) are getting direct traffic, since those are the differentiator pages this campaign is built around.
- Return-visit signal (Vercel Web Analytics has limited session depth vs. GA, so treat this as directional, not precise).

**Success thresholds (label these as targets to calibrate against, not calibrated estimates — there's no traffic baseline yet):**

| Checkpoint | Threshold |
|---|---|
| Week 2 (post-Show HN) | A visible, referrer-attributable page-view spike on launch day at least several multiples of the site's pre-launch daily baseline, with `/corrections/` or `/exports/` visited by a meaningful share (not just the homepage) — confirms the differentiator angle, not just the URL, is what's landing. |
| Week 2 | At least one piece of unprompted external engagement (an HN comment thread with genuine discussion, a Reddit thread reply, or a newsletter pickup) — a proxy for whether the positioning is resonating, independent of raw traffic. |
| Week 6 (post-GA surge) | September page views measurably higher than August's baseline weeks, with the beta-drop-day and GA-retrospective posts identifiable as referrer sources — confirms the recurring content engine is working, not just the one-time launch spike. |
| Week 6 | At least one MacRumors/9to5Mac/newsletter pickup or citation across the six weeks — the highest-leverage, hardest-to-force channel; even one confirms the tip-line approach is viable to keep investing in. |

If week 2 shows traffic but no engagement on the differentiator pages, that's a signal to adjust the *pitch* (lean harder on corrections/exports in copy) before assuming the *channel* was wrong.
