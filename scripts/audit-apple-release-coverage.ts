/**
 * Audits the archive against Apple's own published release history.
 *
 * Apple documents every release that shipped security content across a chain of
 * index pages. The current page only holds rows back to 2024-01-09; everything
 * older lives in era archives linked from it. Auditing against the current page
 * alone silently limits the check to the last two years, which is how a
 * 512-version gap went unnoticed until 2026-08-17.
 *
 * This command fetches the whole chain, normalizes Apple's naming, and reports:
 *   1. versions Apple documents that the archive does not hold
 *   2. versions whose recorded date disagrees with Apple's
 *   3. versions the archive holds that Apple's index does not mention (expected:
 *      releases that shipped without security content, plus pre-2011 history)
 *
 * It is read-only. It never writes to Sanity. Run it after a release day and
 * before any bulk ingest.
 *
 *   npx tsx scripts/audit-apple-release-coverage.ts
 *   npx tsx scripts/audit-apple-release-coverage.ts --json > audit.json
 *
 * Reads the dataset with SANITY_API_TOKEN from .env.local, which is read-only.
 */

import * as dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });

/** Apple's security index, current page first, then the era archive chain. */
const INDEX_PAGES = [
  "100100", // 2024-01-09 onward
  "121012", // 2022-2023
  "120989", // 2020-2021
  "103179", // 2018-2019
  "103178", // 2016-2017
  "103813", // 2015
  "101445", // 2014
  "100502", // 2013
  "101444", // 2011-2012
  "104188", // 2010
  "104189", // 2008-2009
  "104190", // 2005-2007
  "101682", // 2003-2005
];

const OS_PLATFORMS = ["iOS", "iPadOS", "macOS", "tvOS", "watchOS", "visionOS"] as const;
type Platform = (typeof OS_PLATFORMS)[number];

const MARKETING =
  "(?:Sequoia|Sonoma|Ventura|Monterey|Big Sur|Catalina|Mojave|High Sierra|Sierra|Tahoe|Golden Gate|El Capitan|Yosemite|Mavericks)";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface AppleRow {
  platform: Platform;
  version: string;
  date: string;
  advisoryUrl: string | null;
  rawRow: string;
}

function plainText(fragment: string): string {
  return fragment
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, " ")
    .trim();
}

function isoDate(value: string): string | null {
  const m = /^(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})$/.exec(value.trim());
  if (!m) return null;
  const month = MONTHS.indexOf(m[2].slice(0, 3));
  if (month < 0) return null;
  return `${m[3]}-${String(month + 1).padStart(2, "0")}-${String(Number(m[1])).padStart(2, "0")}`;
}

/** Apple writes an x.0 release as a bare major: "iOS 18" means 18.0. */
function normalizeVersion(value: string): string {
  return value.includes(".") ? value : `${value}.0`;
}

/**
 * Apple's combined-row naming is not always literal, and two cases must be
 * suppressed or the audit reports releases that never existed:
 *
 *  - iPadOS below 13. iPadOS branding began at 13.0 in 2019, but Apple
 *    retroactively applies its modern "iOS X and iPadOS X" template to older
 *    rows. "iOS 12.5.8 and iPadOS 12.5.8" describes one iOS 12 release.
 *  - A bare-major iPadOS half paired with a different iOS version, as in
 *    "iOS 16.1 and iPadOS 16". Here "iPadOS 16" names the series, not a 16.0
 *    release. iPadOS 16 shipped as 16.1; there was never a public 16.0.
 */
function suppressed(platform: Platform, rawVersion: string, rowText: string): boolean {
  if (platform !== "iPadOS") return false;
  if (Number(normalizeVersion(rawVersion).split(".")[0]) < 13) return true;
  if (!rawVersion.includes(".")) {
    const iosPart = new RegExp(`iOS\\s+(\\d+(?:\\.\\d+)*)`).exec(rowText);
    if (iosPart && normalizeVersion(iosPart[1]) !== normalizeVersion(rawVersion)) return true;
  }
  return false;
}

async function fetchIndexPages(): Promise<AppleRow[]> {
  const rows = new Map<string, AppleRow>();
  for (const page of INDEX_PAGES) {
    const url = `https://support.apple.com/en-us/${page}`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) {
      console.error(`  WARN ${page}: HTTP ${response.status}`);
      continue;
    }
    const html = await response.text();
    let found = 0;
    for (const [, tr] of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
      const cells = [...tr.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((m) => m[1]);
      if (cells.length < 3) continue;
      const name = plainText(cells[0]);
      const date = isoDate(plainText(cells[cells.length - 1]));
      if (!date) continue;
      if (/\(\s*[a-z]\s*\)/.test(name)) continue; // Rapid Security Response
      let href = /href="([^"]+)"/.exec(cells[0])?.[1] ?? null;
      if (href?.startsWith("/")) href = `https://support.apple.com${href}`;
      if (href?.startsWith("http://")) href = href.replace(/^http:/, "https:");

      const pattern = new RegExp(
        `\\b(${OS_PLATFORMS.join("|")})\\b(?:\\s+${MARKETING})?\\s+(\\d+(?:\\.\\d+){0,3})`,
        "g",
      );
      for (const [, platform, version] of name.matchAll(pattern)) {
        const p = platform as Platform;
        if (suppressed(p, version, name)) continue;
        const normalized = normalizeVersion(version);
        const key = `${p}|${normalized}`;
        found += 1;
        const existing = rows.get(key);
        // Apple re-lists a version when availability expands. Keep the earliest
        // date and remember that the row was seen more than once.
        if (!existing || date < existing.date) {
          rows.set(key, { platform: p, version: normalized, date, advisoryUrl: href, rawRow: name.slice(0, 160) });
        }
      }
    }
    console.error(`  ${page}: ${found} OS entries`);
  }
  return [...rows.values()];
}

async function main(): Promise<void> {
  const asJson = process.argv.includes("--json");
  console.error("Fetching Apple security index chain...");
  const apple = await fetchIndexPages();
  console.error(`Apple documents ${apple.length} distinct (platform, version) pairs.\n`);

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    perspective: "published",
  });

  const archive: {
    version: string;
    publicReleaseDate: string | null;
    releaseStatus: string | null;
    platform: string;
  }[] = await client.fetch(
    `*[_type=="releaseVersion"]{version, publicReleaseDate, releaseStatus, "platform": releaseTrain->platform->name}`,
  );
  const byKey = new Map(archive.map((v) => [`${v.platform}|${normalizeVersion(v.version)}`, v]));

  const missing: AppleRow[] = [];
  const dateMismatch: { key: string; archive: string | null; apple: string; status: string | null }[] = [];
  for (const row of apple) {
    const key = `${row.platform}|${row.version}`;
    const held = byKey.get(key);
    if (!held) {
      missing.push(row);
      continue;
    }
    // A version Apple lists but the archive marks superseded with no public date
    // is a deliberate editorial position, not a mismatch.
    if (held.publicReleaseDate === null && held.releaseStatus === "superseded") continue;
    if (held.publicReleaseDate !== row.date) {
      dateMismatch.push({ key, archive: held.publicReleaseDate, apple: row.date, status: held.releaseStatus });
    }
  }
  const appleKeys = new Set(apple.map((r) => `${r.platform}|${r.version}`));
  const archiveOnly = archive.filter((v) => !appleKeys.has(`${v.platform}|${normalizeVersion(v.version)}`));

  if (asJson) {
    console.log(JSON.stringify({ appleCount: apple.length, archiveCount: archive.length, missing, dateMismatch, archiveOnlyCount: archiveOnly.length }, null, 2));
  } else {
    console.log(`Apple documented versions : ${apple.length}`);
    console.log(`Archive versions          : ${archive.length}`);
    console.log(`\nMISSING FROM ARCHIVE      : ${missing.length}`);
    for (const m of missing) console.log(`   ${m.platform} ${m.version}  ${m.date}  ${m.advisoryUrl ?? "(no advisory)"}`);
    console.log(`\nDATE DISAGREEMENTS        : ${dateMismatch.length}`);
    for (const d of dateMismatch) console.log(`   ${d.key.padEnd(20)} archive=${d.archive ?? "null"} apple=${d.apple} status=${d.status}`);
    console.log(`\nIn archive, not on Apple's index: ${archiveOnly.length} (expected: releases with no security content, and pre-2011 history)`);
  }

  // Non-zero exit on a real coverage gap makes this usable as a CI assertion.
  process.exitCode = missing.length > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(2);
});
