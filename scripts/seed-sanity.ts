/**
 * Seeds the Sanity Content Lake with parsed Apple Notes data.
 *
 * Usage: npx tsx scripts/seed-sanity.ts
 *
 * Requires .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
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

  console.log(`Seeding ${data.platforms.length} platforms, ${data.releaseTrains.length} trains, ${data.releaseVersions.length} versions...`);

  // Delete existing documents first
  console.log("Clearing existing data...");
  const existing = await client.fetch(`*[_type in ["platform", "releaseTrain", "releaseVersion"]]._id`);
  if (existing.length > 0) {
    let tx = client.transaction();
    for (const id of existing) {
      tx = tx.delete(id);
    }
    await tx.commit();
    console.log(`  Deleted ${existing.length} existing documents`);
  }

  // 1. Create platforms
  console.log("Creating platforms...");
  let tx = client.transaction();
  for (const p of data.platforms) {
    const id = makeId("platform", p.slug);
    tx = tx.createOrReplace({
      _id: id,
      _type: "platform",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      color: p.color,
      sortOrder: p.sortOrder,
    });
  }
  await tx.commit();
  console.log(`  Created ${data.platforms.length} platforms`);

  // 2. Create release trains
  console.log("Creating release trains...");
  tx = client.transaction();
  for (const t of data.releaseTrains) {
    const id = makeId("train", t.platform, String(t.majorVersion));
    const platformId = makeId("platform", t.platform.toLowerCase());
    tx = tx.createOrReplace({
      _id: id,
      _type: "releaseTrain",
      platform: { _type: "reference", _ref: platformId },
      majorVersion: t.majorVersion,
      displayName: t.displayName,
      releaseYear: t.releaseYear,
    });
  }
  await tx.commit();
  console.log(`  Created ${data.releaseTrains.length} release trains`);

  // 3. Create release versions (batch in groups of 50 to avoid request size limits)
  console.log("Creating release versions...");
  const BATCH_SIZE = 50;
  let created = 0;

  for (let i = 0; i < data.releaseVersions.length; i += BATCH_SIZE) {
    const batch = data.releaseVersions.slice(i, i + BATCH_SIZE);
    tx = client.transaction();

    for (const v of batch) {
      const id = makeId("version", v.platform, v.version);
      const trainId = makeId("train", v.platform, String(v.majorVersion));

      tx = tx.createOrReplace({
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
          isRevision: m.isRevision,
        })),
      });
    }

    await tx.commit();
    created += batch.length;
    console.log(`  Created ${created}/${data.releaseVersions.length} versions`);
  }

  console.log("\nSeed complete!");

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
