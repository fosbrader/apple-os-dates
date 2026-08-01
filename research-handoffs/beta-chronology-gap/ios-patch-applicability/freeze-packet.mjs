import {createHash} from "node:crypto";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {batchId, evidenceRoot, packetPath} from "./research-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const lockPath = path.join(here, "packet-locks.json");
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const exists = async (filename) => {
  try {
    await access(filename);
    return true;
  } catch {
    return false;
  }
};

const validation = JSON.parse(
  await readFile(path.join(here, "validation.json"), "utf8"),
);
if (validation.status !== "passed" || validation.errorCount !== 0) {
  throw new Error("A passing validation.json is required before freeze.");
}
if (await exists(path.join(here, "independent-review.json"))) {
  throw new Error(
    "The researcher must not freeze a self-authored independent-review.json.",
  );
}
const fetchLogPath = `${evidenceRoot}/fetch-log.json`;
const fetchLog = JSON.parse(
  await readFile(path.join(repoRoot, fetchLogPath), "utf8"),
);
if (
  fetchLog.failureCount !== 0 ||
  fetchLog.successCount !== 21 ||
  fetchLog.results.length !== 21
) {
  throw new Error("Expected a complete 21-source fetch log before freeze.");
}

const packetFiles = [
  "assignment.json",
  "scoped-coverage-snapshot.json",
  "source-query-log.json",
  "sources.json",
  "raw-evidence-locks.json",
  "production-snapshot.json",
  "applicability-audit.json",
  "conflicts.json",
  "candidates.json",
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
const evidenceFiles = [
  fetchLogPath,
  `${evidenceRoot}/production-snapshot.json`,
  ...fetchLog.results.flatMap((capture) => [
    `${evidenceRoot}/raw/${capture.rawFilename}`,
    `${evidenceRoot}/selected/${capture.selectedFilename}`,
  ]),
];
const materialPaths = [...packetFiles, ...evidenceFiles];
if (new Set(materialPaths).size !== materialPaths.length) {
  throw new Error("Material freeze paths must be unique.");
}

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
  const result = {
    mode: "verify",
    status: drift.length === 0 ? "passed" : "failed",
    materialFileCount: materialPaths.length,
    packetFileCount: packetFiles.length,
    evidenceFileCount: evidenceFiles.length,
    drift: [...new Set(drift)],
  };
  console.log(JSON.stringify(result, null, 2));
  if (drift.length > 0) process.exit(1);
} else {
  const document = {
    formatVersion: 1,
    batchId,
    frozenAt: new Date().toISOString(),
    materialFileCount: materialPaths.length,
    packetFileCount: packetFiles.length,
    evidenceFileCount: evidenceFiles.length,
    locks,
    exclusions: {
      self: `${packetPath}/packet-locks.json`,
      independentReview: `${packetPath}/independent-review.json`,
      sharedMutableAggregates:
        "Shared coverage/register/aggregate files are intentionally excluded. The exact 27 assignment rows are frozen in scoped-coverage-snapshot.json.",
      reason:
        "The lock manifest cannot hash itself. Independent review is pending and must be authored separately.",
    },
    safety: {
      independentChronologyReviewComplete: false,
      chronologyApprovalGranted: false,
      sanityMutationAllowed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationAuthorized: false,
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
        packetFileCount: packetFiles.length,
        evidenceFileCount: evidenceFiles.length,
      },
      null,
      2,
    ),
  );
}

