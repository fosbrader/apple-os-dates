import {createHash} from "node:crypto";
import {access, readFile, readdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {batchId, evidenceRoot, packetPath} from "./research-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
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
const walk = async (relativeDirectory) => {
  const entries = await readdir(path.join(repoRoot, relativeDirectory), {
    withFileTypes: true,
  });
  const paths = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(
      relativeDirectory,
      entry.name,
    );
    if (entry.isDirectory()) {
      paths.push(...(await walk(relativePath)));
    } else if (entry.isFile()) {
      paths.push(relativePath);
    }
  }
  return paths.sort();
};
const assertUnique = (items) => {
  if (new Set(items).size !== items.length) {
    throw new Error("Material lock paths are not unique.");
  }
};

const packetFiles = [
  "assignment.json",
  "sources.json",
  "raw-evidence-locks.json",
  "candidates.json",
  "conflicts.json",
  "full-sequence-audit.json",
  "production-snapshot.json",
  "researched-identities.json",
  "self-review.json",
  "report.md",
  "validation.json",
  "research-data.mjs",
  "source-specs.mjs",
  "fetch-sources.mjs",
  "query-production.ts",
  "build-packet.mjs",
  "validate-packet.mjs",
  "freeze-packet.mjs",
].map((filename) => `${packetPath}/${filename}`);
const evidenceFiles = await walk(evidenceRoot);
const materialPaths = [
  ...packetFiles,
  ...evidenceFiles,
  "research-handoffs/beta-chronology-gap/README.md",
  "research-handoffs/beta-chronology-gap/proposed-event-candidate.schema.json",
];
assertUnique(materialPaths);

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
        drift: [...new Set(drift)],
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
      pendingIndependentReview:
        `${packetPath}/independent-review.json`,
      mutableSharedCoverageMatrix:
        "research-handoffs/beta-chronology-gap/coverage-matrix.json",
      reason:
        "The lock manifest cannot hash itself. The independent-review placeholder remains writable only for a different reviewer. The shared coverage matrix is a mutable aggregate and is neither a packet input nor a lock target; all 16 scoped applicability rows are embedded and locked in assignment.json.",
    },
    safety: {
      independentChronologyReviewComplete: false,
      chronologyApprovalGranted: false,
      sanityMutationAllowed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationAuthorized: false,
      deploymentPerformed: false,
      sharedCoverageMatrixMutated: false,
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
