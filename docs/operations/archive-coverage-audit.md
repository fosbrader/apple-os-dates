# Auditing archive coverage against Apple

`npm run audit:apple-coverage` compares every release Apple documents against
what the archive holds, and exits non-zero if anything is missing. Run it after a
release day and before any bulk ingest.

## Why the audit exists

On 2026-08-17 the archive held 419 versions. Apple documented 871. The gap had
gone unnoticed because the obvious check is against
<https://support.apple.com/en-us/100100>, and **that page only holds rows back to
2024-01-09**. Everything older lives in an era chain of archive pages linked from
it. Auditing the current page alone silently limits the check to two years and
reports a healthy archive.

The chain, oldest last:

| Page | Era | Page | Era |
| --- | --- | --- | --- |
| `100100` | 2024-01-09 onward | `101445` | 2014 |
| `121012` | 2022-2023 | `100502` | 2013 |
| `120989` | 2020-2021 | `101444` | 2011-2012 |
| `103179` | 2018-2019 | `104188` | 2010 |
| `103178` | 2016-2017 | `104189` | 2008-2009 |
| `103813` | 2015 | `104190` | 2005-2007 |
|  |  | `101682` | 2003-2005 |

The four oldest pages yield zero OS rows: they predate iOS and cover Mac OS X,
QuickTime, and Safari, which this archive does not track.

## Naming traps the parser has to handle

Every one of these produced a false positive before it was handled. If you write
another tool against these pages, handle them all.

1. **A bare major means x.0.** Apple writes "iOS 18", "macOS Sequoia 15",
   "visionOS 2". The archive stores `18.0`, `15.0`, `2.0`. Normalize both sides.
2. **Combined rows.** "iOS 17.7.3 and iPadOS 17.7.3" is two releases. Taking only
   the first platform match undercounts iPadOS by roughly seventy versions.
3. **Marketing names.** "macOS Sonoma 14.7.1", "macOS Ventura 13.7". Strip them
   before matching the number.
4. **Non-OS rows.** Safari, Xcode, iTunes, iCloud for Windows, Pages, Keynote,
   Beats and AirPods firmware, and Rapid Security Responses such as
   "iOS 16.5.1 (a)". All out of scope.
5. **iPadOS below 13 is not real.** iPadOS branding began at 13.0 in 2019, but
   Apple retroactively applies the combined template to older rows. The row
   "iOS 12.5.8 and iPadOS 12.5.8" describes one iOS 12 release. Creating a
   `train-ipados-12` to satisfy it would be a data-model regression.
6. **A bare-major iPadOS half paired with a different iOS version names a
   series, not a release.** "iOS 16.1 and iPadOS 16" dated 2022-10-24 does not
   mean iPadOS 16.0 shipped. iPadOS 16 shipped *as* 16.1; there was never a
   public 16.0, which is why the archive holds `version-ipados-16-0` as
   `superseded` with no public date. The audit skips a version the archive marks
   superseded with a null date, because that is a deliberate editorial position.
7. **A version can be listed twice.** Apple re-lists a release when availability
   expands to more devices. iOS 18.7.7 appears on both 2026-03-24 and
   2026-04-01; its advisory says "Released March 24, 2026" and notes availability
   was enabled for more devices on April 1. The audit keeps the earliest date.
   **Check the advisory before trusting either row**, because the reverse case
   exists: iOS 17.0.2 is listed alone on 2023-09-21 and as
   "iOS 17.0.2 and iPadOS 17.0.2" on 2023-09-26.

## What Apple's index can and cannot tell you

It is authoritative for **public release dates** and it links the per-release
advisory. It carries **no build numbers at all**, and neither do the advisories.
It also lists only releases that shipped security content, so it is a lower bound
on Apple's release history, not a complete list.

For build numbers, see [`adding-a-release.md`](./adding-a-release.md) and note
that `developer.apple.com/news/releases/` is a rolling feed that drops entries
within days. Its 2026-08-10 OS entries were already gone by 2026-08-17.

## Open items the audit currently reports

Three versions carry a date that disagrees with Apple's index. All three predate
the 2026-08-17 backfill and each needs individual research rather than a bulk
edit, because the archive's stored date may well be the better one.

| Version | Archive | Apple index | Note |
| --- | --- | --- | --- |
| iOS 17.0.2 | 2023-09-26 | 2023-09-21 | Apple lists it twice. The 09-21 row is iOS-only (iPhone 15); the 09-26 row is the combined iOS and iPadOS release. |
| iOS 16.0.1 | 2022-09-14 | 2022-09-15 | 09-14 was iPhone 14 launch day. The archive's citation points at "About iOS 16 Updates", which carries no date, so the stored date is currently unsupported by its own source. |
| iOS 7.0.3 | 2013-10-23 | 2013-10-22 | Same problem: cited to "About iOS 7 Updates", a page with no dates. |

For the latter two the fix is the same either way: attach a source that actually
carries a date. Resolve them through the corrections ledger rather than a silent
patch, since both are currently public.
