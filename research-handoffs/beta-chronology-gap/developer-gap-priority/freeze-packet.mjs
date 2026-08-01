import {createHash} from "node:crypto";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-developer-gap-priority";
const packetPath =
  "research-handoffs/beta-chronology-gap/developer-gap-priority";
const evidencePath =
  "tmp/research-evidence/beta-chronology-gap/developer-gap-priority";
const lockPath = path.join(here, "packet-locks.json");

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const exists = async (filename) => {
  try {
    await access(filename);
    return true;
  } catch {
    return false;
  }
};
const sources = JSON.parse(
  await readFile(path.join(repoRoot, packetPath, "sources.json"), "utf8"),
).sources;

const packetFiles = [
  "assignment.json",
  "sources.json",
  "retained-source-reinspection.json",
  "candidates.json",
  "full-sequence-audit.json",
  "conflicts.json",
  "production-snapshot.json",
  "self-review.json",
  "report.md",
  "validation.json",
  "developer-candidate.schema.json",
  "fetch-sources.mjs",
  "query-production.ts",
  "build-packet.mjs",
  "validate.mjs",
  "freeze-packet.mjs",
].map((filename) => `${packetPath}/${filename}`);
const evidenceFiles = [
  `${evidencePath}/fetch-manifest.json`,
  `${evidencePath}/production-snapshot.json`,
  ...sources.flatMap((source) => [
    source.evidence.rawPath,
    source.evidence.selectedPath,
  ]),
];
const materialPaths = [
  ...new Set([
    ...packetFiles,
    ...evidenceFiles,
    "research-handoffs/beta-chronology-gap/developer-gap-priority-research-leads.md",
  ]),
].sort();

const locks = {};
for (const relativePath of materialPaths) {
  const bytes = await readFile(path.join(repoRoot, relativePath));
  locks[relativePath] = {
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  };
}

if (await exists(lockPath)) {
  const frozen = JSON.parse(await readFile(lockPath, "utf8"));
  const drift = [];
  for (const [relativePath, expected] of Object.entries(frozen.locks)) {
    const observed = locks[relativePath];
    if (
      !observed ||
      observed.bytes !== expected.bytes ||
      observed.sha256 !== expected.sha256
    ) {
      drift.push(relativePath);
    }
  }
  for (const relativePath of materialPaths) {
    if (!frozen.locks[relativePath]) drift.push(relativePath);
  }
  if (
    frozen.batchId !== batchId ||
    frozen.materialFileCount !== materialPaths.length ||
    Object.keys(frozen.locks).length !== materialPaths.length
  ) {
    drift.push("packet-lock-metadata");
  }
  console.log(
    JSON.stringify(
      {
        mode: "verify",
        status: drift.length === 0 ? "passed" : "failed",
        materialFileCount: materialPaths.length,
        drift: [...new Set(drift)].sort(),
      },
      null,
      2,
    ),
  );
  if (drift.length > 0) process.exit(1);
} else {
  const document = {
    formatVersion: 1,
    batchId,
    frozenAt: new Date().toISOString(),
    materialFileCount: materialPaths.length,
    locks,
    exclusions: {
      self: `${packetPath}/packet-locks.json`,
      reason:
        "The lock manifest cannot hash itself. freeze-packet.mjs is hashed and verifies the manifest without rewriting it.",
    },
    safety: {
      chronologyApprovalGranted: false,
      independentReviewRequired: true,
      sanityMutationAllowed: false,
      publicationAuthorized: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      deploymentPerformed: false,
    },
  };
  await writeFile(lockPath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        mode: "freeze",
        status: "passed",
        lockPath: `${packetPath}/packet-locks.json`,
        materialFileCount: materialPaths.length,
      },
      null,
      2,
    ),
  );
}
