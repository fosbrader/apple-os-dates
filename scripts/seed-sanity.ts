/**
 * Idempotently imports parsed Apple Notes data into the Sanity Content Lake.
 *
 * Missing documents represented in seed-data.json are created at stable,
 * canonical IDs. Existing documents (including edits made in Studio) and
 * documents created only in Sanity are never overwritten or deleted.
 *
 * Usage: npm run sanity:seed
 *
 * Uses the authenticated Sanity CLI user by default. For non-interactive
 * automation, it can also be run directly with SANITY_API_TOKEN in .env.local.
 */

import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

throw new Error(
  "Retired: this seed omits audited lifecycle/provenance fields and uses unstable positional milestone keys. Use the audited history reconciler for chronology checks and migration:events:plan for the event/build migration.",
);

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;
const runningViaSanityExec = Boolean(process.env.SANITY_BASE_PATH);

if (!projectId || (!runningViaSanityExec && !token)) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, or run with an authenticated Sanity CLI user / SANITY_API_TOKEN"
  );
  process.exit(1);
}

const client = runningViaSanityExec
  ? getCliClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: false,
    })
  : createClient({
      projectId,
      dataset,
      token,
      apiVersion: "2024-01-01",
      useCdn: false,
    });

interface SeedMilestone {
  label: string;
  date: string;
  note?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  isRevision: boolean;
}

interface SeedVersion {
  platform: string;
  majorVersion: number;
  version: string;
  milestones: SeedMilestone[];
  publicReleaseDate?: string;
  versionNote?: string;
  releaseNotesUrl?: string;
}

interface SeedData {
  platforms: { name: string; slug: string; color: string; sortOrder: number }[];
  releaseTrains: { platform: string; majorVersion: number; displayName: string; releaseYear: number }[];
  releaseVersions: SeedVersion[];
}

function makeId(type: string, ...parts: (string | number)[]): string {
  return `${type}-${parts.map(p => String(p).toLowerCase().replace(/[^a-z0-9]/g, "-")).join("-")}`;
}

async function seed() {
  const seedPath = path.join(__dirname, "seed-data.json");
  const data: SeedData = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

  console.log(
    `Seeding up to ${data.platforms.length} platforms, ${data.releaseTrains.length} trains, and ${data.releaseVersions.length} versions...`
  );
  console.log("Existing and CMS-only documents will be preserved.");

  // 1. Create missing platforms at canonical IDs.
  console.log("Seeding platforms...");
  let tx = client.transaction();
  for (const p of data.platforms) {
    const id = makeId("platform", p.slug);
    tx = tx.createIfNotExists({
      _id: id,
      _type: "platform",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      color: p.color,
      sortOrder: p.sortOrder,
    });
  }
  await tx.commit();
  console.log(`  Checked ${data.platforms.length} platforms`);

  // 2. Create missing release trains at canonical IDs.
  console.log("Seeding release trains...");
  tx = client.transaction();
  for (const t of data.releaseTrains) {
    const id = makeId("train", t.platform, String(t.majorVersion));
    const platformId = makeId("platform", t.platform.toLowerCase());
    tx = tx.createIfNotExists({
      _id: id,
      _type: "releaseTrain",
      platform: { _type: "reference", _ref: platformId },
      majorVersion: t.majorVersion,
      displayName: t.displayName,
      releaseYear: t.releaseYear,
    });
  }
  await tx.commit();
  console.log(`  Checked ${data.releaseTrains.length} release trains`);

  // 3. Create missing release versions in batches to avoid request-size limits.
  console.log("Seeding release versions...");
  const BATCH_SIZE = 50;
  let checked = 0;

  for (let i = 0; i < data.releaseVersions.length; i += BATCH_SIZE) {
    const batch = data.releaseVersions.slice(i, i + BATCH_SIZE);
    tx = client.transaction();

    for (const v of batch) {
      const id = makeId("version", v.platform, v.version);
      const trainId = makeId("train", v.platform, String(v.majorVersion));

      tx = tx.createIfNotExists({
        _id: id,
        _type: "releaseVersion",
        releaseTrain: { _type: "reference", _ref: trainId },
        version: v.version,
        releaseNotesUrl: v.releaseNotesUrl || undefined,
        publicReleaseDate: v.publicReleaseDate || undefined,
        versionNote: v.versionNote || undefined,
        milestones: v.milestones.map((m, idx) => ({
          _type: "betaMilestone",
          _key: `m${idx}`,
          label: m.label,
          date: m.date,
          note: m.note || undefined,
          sourceUrl: m.sourceUrl || undefined,
          sourceLabel: m.sourceLabel || undefined,
          isRevision: m.isRevision,
        })),
      });
    }

    await tx.commit();
    checked += batch.length;
    console.log(
      `  Checked ${checked}/${data.releaseVersions.length} versions`
    );
  }

  console.log("\nImport complete!");

  // Verify
  const counts = await client.fetch(`{
    "platforms": count(*[_type == "platform"]),
    "trains": count(*[_type == "releaseTrain"]),
    "versions": count(*[_type == "releaseVersion"])
  }`);
  console.log("Verification:", counts);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
