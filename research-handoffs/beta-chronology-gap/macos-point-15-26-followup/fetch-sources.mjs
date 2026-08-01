#!/usr/bin/env node

import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {sourceSpecs} from "./source-specs.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const batchId = "beta-chronology-gap-macos-point-15-26-followup";
const rawRoot = path.join(
  repoRoot,
  "tmp/research-evidence/beta-chronology-gap/macos-point-15-26-followup/raw",
);
const force = process.argv.includes("--force");

await mkdir(rawRoot, {recursive: true});

const results = [];
for (const spec of sourceSpecs) {
  const extension = spec.mediaType === "application/json" ? "json" : "html";
  const outputPath = path.join(rawRoot, `${spec.rawId}.${extension}`);
  let existing = false;
  try {
    await readFile(outputPath);
    existing = true;
  } catch {
    existing = false;
  }
  if (existing && !force) {
    throw new Error(
      `Refusing to overwrite existing evidence: ${outputPath}. Use --force only before the packet is frozen.`,
    );
  }

  const response = await fetch(spec.url, {
    redirect: "follow",
    headers: {
      "user-agent":
        "VersionRecord chronology research/1.0 (+https://www.versionrecord.com)",
      accept:
        spec.mediaType === "application/json"
          ? "application/json"
          : "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) {
    throw new Error(`${spec.rawId}: HTTP ${response.status} ${response.url}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
  results.push({
    ...spec,
    status: response.status,
    finalUrl: response.url,
    rawPath: path.relative(repoRoot, outputPath),
    rawBytes: bytes.byteLength,
  });
}

const fetchedAt = new Date().toISOString();
const fetchLog = {
  formatVersion: 1,
  batchId,
  fetchedAt,
  sourceArtifactCount: results.length,
  successCount: results.length,
  failureCount: 0,
  results,
  safety: {
    readOnlyHttpRequests: true,
    sanityMutationPerformed: false,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
};
await writeFile(
  path.join(packetDir, "fetch-log.json"),
  `${JSON.stringify(fetchLog, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      fetchedAt,
      sourceArtifactCount: results.length,
      rawRoot: path.relative(repoRoot, rawRoot),
    },
    null,
    2,
  ),
);
