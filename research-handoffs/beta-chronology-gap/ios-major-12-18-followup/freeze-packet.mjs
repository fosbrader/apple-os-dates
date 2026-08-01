#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const lockPath = path.join(packetDir, "packet-locks.json");
const writeMode = process.argv.includes("--write");
const batchId = "beta-chronology-gap-ios-major-12-18-followup";

const localPacketFiles = [
  "assignment.json",
  "build-packet.mjs",
  "fetch-sources.mjs",
  "fetch-log.json",
  "sources.json",
  "raw-evidence-locks.json",
  "source-role-corrections.json",
  "production-snapshot.json",
  "query-production.ts",
  "supplement.json",
  "report.md",
  "validate-packet.mjs",
  "validation.json",
  "freeze-packet.mjs",
].map(
  (name) =>
    `research-handoffs/beta-chronology-gap/ios-major-12-18-followup/${name}`,
);

const sources = JSON.parse(
  await readFile(path.join(packetDir, "sources.json"), "utf8"),
).sources;
const rawEvidenceFiles = sources.map((source) => source.evidence.rawPath);
const externalDependencies = [
  "research-handoffs/beta-chronology-gap/ios-major-12-18/validation.json",
  "research-handoffs/beta-chronology-gap/ios-major-12-18/packet-locks.json",
  "research-handoffs/beta-chronology-gap/ios-major-12-18/independent-review.json",
];

const materialPaths = [
  ...localPacketFiles,
  ...rawEvidenceFiles,
  ...externalDependencies,
];

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const buildLocks = async () => {
  const locks = [];
  for (const relativePath of materialPaths) {
    const bytes = await readFile(path.resolve(repoRoot, relativePath));
    locks.push({
      path: relativePath,
      kind: externalDependencies.includes(relativePath)
        ? "frozenParentDependency"
        : rawEvidenceFiles.includes(relativePath)
          ? "rawEvidence"
          : "packetArtifact",
      bytes: bytes.byteLength,
      sha256: sha256(bytes),
    });
  }
  return locks;
};

let lockExists = true;
try {
  await access(lockPath);
} catch {
  lockExists = false;
}

if (!lockExists && !writeMode) {
  throw new Error("packet-locks.json does not exist; rerun with --write.");
}

if (!lockExists) {
  const locks = await buildLocks();
  const payload = {
    formatVersion: 1,
    batchId,
    frozenAt: new Date().toISOString(),
    algorithm: "sha256",
    materialFileCount: locks.length,
    packetArtifactCount: locks.filter(
      (lock) => lock.kind === "packetArtifact",
    ).length,
    rawEvidenceCount: locks.filter((lock) => lock.kind === "rawEvidence").length,
    frozenParentDependencyCount: locks.filter(
      (lock) => lock.kind === "frozenParentDependency",
    ).length,
    note:
      "The independent reviewer may add independent-review.json later; that future reviewer artifact is intentionally outside this researcher-created lock.",
    locks,
  };
  await writeFile(lockPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

const declared = JSON.parse(await readFile(lockPath, "utf8"));
const failures = [];
let verifiedBytes = 0;
for (const lock of declared.locks) {
  let bytes;
  try {
    bytes = await readFile(path.resolve(repoRoot, lock.path));
  } catch (error) {
    failures.push({ path: lock.path, reason: `read failed: ${error}` });
    continue;
  }
  verifiedBytes += bytes.byteLength;
  if (bytes.byteLength !== lock.bytes) {
    failures.push({
      path: lock.path,
      reason: `bytes ${bytes.byteLength} != ${lock.bytes}`,
    });
  }
  const actualHash = sha256(bytes);
  if (actualHash !== lock.sha256) {
    failures.push({
      path: lock.path,
      reason: `sha256 ${actualHash} != ${lock.sha256}`,
    });
  }
}

const result = {
  batchId,
  frozen: failures.length === 0,
  declaredMaterialFileCount: declared.materialFileCount,
  verifiedMaterialFileCount: declared.locks.length - failures.length,
  verifiedBytes,
  failureCount: failures.length,
  failures,
  packetLocksPath:
    "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/packet-locks.json",
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
