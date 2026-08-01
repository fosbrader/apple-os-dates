#!/usr/bin/env node

import {createHash} from "node:crypto";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const lockPath = path.join(packetDir, "packet-locks.json");
const writeMode = process.argv.includes("--write");
const batchId = "beta-chronology-gap-macos-point-15-26-followup";
const packetPrefix =
  "research-handoffs/beta-chronology-gap/macos-point-15-26-followup";

const localPacketFiles = [
  "assignment.json",
  "source-specs.mjs",
  "fetch-sources.mjs",
  "fetch-log.json",
  "build-packet.mjs",
  "sources.json",
  "raw-evidence-locks.json",
  "query-production.ts",
  "production-snapshot.json",
  "mappings.json",
  "conflicts.json",
  "self-review.json",
  "report.md",
  "validate-packet.mjs",
  "validation.json",
  "freeze-packet.mjs",
].map((name) => `${packetPrefix}/${name}`);
const sources = JSON.parse(
  await readFile(path.join(packetDir, "sources.json"), "utf8"),
).sources;
const rawEvidenceFiles = [
  ...new Set(
    sources.flatMap((source) =>
      source.evidence.rawArtifacts.map((artifact) => artifact.rawPath),
    ),
  ),
].sort();
const externalDependencies = [
  "research-handoffs/beta-chronology-gap/macos-point-15-26/candidates.json",
  "research-handoffs/beta-chronology-gap/macos-point-15-26/independent-review.json",
  "research-handoffs/beta-chronology-gap/macos-point-15-26/packet-locks.json",
  "research-handoffs/beta-chronology-gap/macos-point-15-26/raw-evidence-locks.json",
];
const materialPaths = [
  ...localPacketFiles,
  ...rawEvidenceFiles,
  ...externalDependencies,
];
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

let lockExists = true;
try {
  await access(lockPath);
} catch {
  lockExists = false;
}
if (!lockExists && !writeMode) {
  throw new Error("packet-locks.json does not exist; rerun with --write.");
}
if (lockExists && writeMode) {
  throw new Error(
    "packet-locks.json already exists; refusing to overwrite a frozen packet.",
  );
}

if (!lockExists) {
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
  const payload = {
    formatVersion: 1,
    batchId,
    frozenAt: new Date().toISOString(),
    algorithm: "sha256",
    materialFileCount: locks.length,
    packetArtifactCount: locks.filter(
      (lock) => lock.kind === "packetArtifact",
    ).length,
    rawEvidenceCount: locks.filter(
      (lock) => lock.kind === "rawEvidence",
    ).length,
    frozenParentDependencyCount: locks.filter(
      (lock) => lock.kind === "frozenParentDependency",
    ).length,
    independentReview: {
      status: "pending",
      lockedByResearcher: false,
      note:
        "A different reviewer may add independent-review.json later. That future artifact is intentionally outside this researcher-created lock.",
    },
    locks,
    safety: {
      sanityMutationPerformed: false,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
  };
  await writeFile(lockPath, `${JSON.stringify(payload, null, 2)}\n`);
}

const declared = JSON.parse(await readFile(lockPath, "utf8"));
const failures = [];
let verifiedBytes = 0;
for (const lock of declared.locks) {
  try {
    const bytes = await readFile(path.resolve(repoRoot, lock.path));
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
  } catch (error) {
    failures.push({
      path: lock.path,
      reason: `read failed: ${error}`,
    });
  }
}
const result = {
  batchId,
  frozen: failures.length === 0,
  declaredMaterialFileCount: declared.materialFileCount,
  verifiedMaterialFileCount: declared.locks.length - failures.length,
  packetArtifactCount: declared.packetArtifactCount,
  rawEvidenceCount: declared.rawEvidenceCount,
  frozenParentDependencyCount: declared.frozenParentDependencyCount,
  verifiedBytes,
  failureCount: failures.length,
  failures,
  independentReview: declared.independentReview,
  packetLocksPath: `${packetPrefix}/packet-locks.json`,
};
console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
