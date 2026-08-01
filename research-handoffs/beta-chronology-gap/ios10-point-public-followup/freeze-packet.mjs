import {createHash} from "node:crypto";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ios10-point-public-followup";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public-followup";
const evidencePath =
  "tmp/research-evidence/beta-chronology-gap/ios10-point-public-followup";
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

const packetFiles = [
  "assignment.json",
  "sources.json",
  "retained-source-reinspection.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "self-review.json",
  "report.md",
  "validation.json",
  "fetch-sources.mjs",
  "query-production.ts",
  "build-packet.mjs",
  "validate-packet.mjs",
  "freeze-packet.mjs",
].map((filename) => `${packetPath}/${filename}`);

const evidenceFiles = [
  `${evidencePath}/fetch-manifest.json`,
  ...[
    "followup-ios102-pb3-macrumors-status-1302",
    "followup-ios102-pb3-macrumors-revision-1129",
    "followup-ios102-pb3-macrumors-revision-1455",
    "followup-ios102-pb3-neowin",
    "followup-ios102-pb3-redmondpie",
    "followup-ios102-pb3-geekygadgets",
    "followup-ios102-pb3-taisy0",
    "followup-ios1021-pb3-kobonemi",
    "followup-ios1021-pb3-taisy0",
  ].flatMap((sourceId) => [
    `${evidencePath}/raw/${sourceId}.raw.html`,
    `${evidencePath}/selected/${sourceId}.selected.txt`,
  ]),
];

const materialPaths = [
  ...packetFiles,
  ...evidenceFiles,
  "research-handoffs/beta-chronology-gap/proposed-event-candidate.schema.json",
];
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
        drift,
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
        "The lock manifest cannot hash itself. freeze-packet.mjs is hashed and verifies this manifest without rewriting it.",
    },
    safety: {
      chronologyApprovalGranted: false,
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
