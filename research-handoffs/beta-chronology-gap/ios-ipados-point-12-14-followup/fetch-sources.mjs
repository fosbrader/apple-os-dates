#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceSpecs } from "./source-specs.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const batchId = "beta-chronology-gap-ios-ipados-point-12-14-followup";
const evidencePath =
  "tmp/research-evidence/beta-chronology-gap/ios-ipados-point-12-14-followup/raw";
const evidenceDir = path.resolve(repoRoot, evidencePath);
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

await mkdir(evidenceDir, { recursive: true });

const results = [];
for (const spec of sourceSpecs) {
  const response = await fetch(spec.url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; VersionRecordResearch/1.0; +https://www.versionrecord.com)",
      accept: "text/html,application/xhtml+xml",
    },
  });
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!response.ok || bytes.byteLength < 500) {
    throw new Error(
      `${spec.sourceId}: HTTP ${response.status}, ${bytes.byteLength} bytes`,
    );
  }
  const filename = `${spec.sourceId}.html`;
  await writeFile(path.join(evidenceDir, filename), bytes);
  results.push({
    sourceId: spec.sourceId,
    url: spec.url,
    finalUrl: response.url,
    status: response.status,
    filename,
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
    captureMethod: "http-html",
  });
  console.log(`${spec.sourceId}: ${response.status} ${bytes.byteLength}`);
}

const payload = {
  formatVersion: 1,
  batchId,
  fetchedAt: new Date().toISOString(),
  evidencePath,
  sourceCount: sourceSpecs.length,
  successCount: results.length,
  failureCount: sourceSpecs.length - results.length,
  results,
};

await writeFile(
  path.join(packetDir, "fetch-log.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
  "utf8",
);
