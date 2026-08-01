import {createHash} from "node:crypto";
import {readdir, readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  batchId,
  evidenceRoot,
  packetPath,
} from "./research-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const packetFiles = [
  "assignment.json",
  "build-packet.mjs",
  "candidates.json",
  "conflicts.json",
  "fetch-sources.mjs",
  "full-sequence-audit.json",
  "production-snapshot.json",
  "query-production.ts",
  "report.md",
  "research-data.mjs",
  "self-review.json",
  "source-specs.mjs",
  "sources.json",
  "validate-packet.mjs",
  "validation.json",
];
const mutableReviewArtifact = `${packetPath}/independent-review.json`;

const rawDirectory = path.join(repoRoot, evidenceRoot, "raw");
const rawFiles = (await readdir(rawDirectory))
  .filter((filename) => filename.endsWith(".html"))
  .sort()
  .map((filename) => path.posix.join(evidenceRoot, "raw", filename));
const evidenceFiles = [
  path.posix.join(evidenceRoot, "fetch-log.json"),
  ...rawFiles,
];
const paths = [
  ...packetFiles.map((filename) => path.posix.join(packetPath, filename)),
  ...evidenceFiles,
];

const files = [];
for (const relativePath of paths) {
  const absolutePath = path.join(repoRoot, relativePath);
  const details = await stat(absolutePath);
  if (!details.isFile()) {
    throw new Error(`Lock target is not a regular file: ${relativePath}`);
  }
  const bytes = await readFile(absolutePath);
  files.push({
    path: relativePath,
    category: relativePath.startsWith(evidenceRoot)
      ? relativePath.includes("/raw/")
        ? "rawEvidence"
        : "evidenceLedger"
      : relativePath.endsWith(".mjs") ||
          relativePath.endsWith(".ts")
        ? "researchMethod"
        : "researchArtifact",
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  });
}

const manifest = {
  formatVersion: 1,
  batchId,
  frozenAt:
    JSON.parse(
      await readFile(path.join(here, "production-snapshot.json"), "utf8"),
    ).capturedAt,
  algorithm: "sha256",
  safety:
    "These locks freeze research evidence and artifacts only. They do not authorize Sanity mutation, stable ID creation, publication, page builds, or deployment.",
  mutableReviewArtifact: {
    path: mutableReviewArtifact,
    excludedFromLocks: true,
    reason:
      "A different reviewer must be able to complete the pending independent-review artifact without invalidating the frozen researcher packet.",
  },
  summary: {
    fileCount: files.length,
    packetFileCount: files.filter(
      (entry) => entry.category !== "rawEvidence",
    ).length,
    rawEvidenceFileCount: files.filter(
      (entry) => entry.category === "rawEvidence",
    ).length,
    totalBytes: files.reduce((sum, entry) => sum + entry.bytes, 0),
  },
  files,
};
await writeFile(path.join(here, "packet-locks.json"), json(manifest));
console.log(
  JSON.stringify(
    {
      fileCount: manifest.summary.fileCount,
      packetFileCount: manifest.summary.packetFileCount,
      rawEvidenceFileCount: manifest.summary.rawEvidenceFileCount,
      totalBytes: manifest.summary.totalBytes,
      excludedMutableReviewArtifact: mutableReviewArtifact,
    },
    null,
    2,
  ),
);
