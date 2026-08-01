import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packetDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(packetDir, "../../..");
const batchId = "beta-chronology-gap-watchos-major-7-26";
const expectedCounts = {
  "7.0": 5,
  "8.0": 6,
  "9.0": 5,
  "10.0": 6,
  "11.0": 5,
  "26.0": 6,
};
const requiredFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "review.json",
  "validation.json",
];

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const loadJson = async (path) => JSON.parse(await readFile(path, "utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

const documents = Object.fromEntries(
  await Promise.all(
    requiredFiles.map(async (name) => [
      name,
      await loadJson(resolve(packetDir, name)),
    ]),
  ),
);

const assignment = documents["assignment.json"];
const sourcesDocument = documents["sources.json"];
const candidatesDocument = documents["candidates.json"];
const conflictsDocument = documents["conflicts.json"];
const review = documents["review.json"];
const validation = documents["validation.json"];
const sources = sourcesDocument.sources;
const candidates = candidatesDocument.candidates;
const conflicts = conflictsDocument.conflicts;

for (const [name, document] of Object.entries(documents)) {
  assert(document.batchId === batchId, `${name}: batchId mismatch`);
}

assert(assignment.targetCount === 33, "assignment targetCount must be 33");
assert(assignment.targets.length === 33, "assignment must contain 33 targets");
assert(candidatesDocument.candidateCount === 33, "candidateCount must be 33");
assert(candidates.length === 33, "candidates must contain 33 entries");
assert(sourcesDocument.sourceCount === 49, "sourceCount must be 49");
assert(sources.length === 49, "sources must contain 49 entries");
assert(conflictsDocument.conflictCount === 9, "conflictCount must be 9");
assert(conflicts.length === 9, "conflicts must contain 9 entries");

const candidateIds = candidates.map(({ candidateId }) => candidateId);
const sourceIds = sources.map(({ sourceId }) => sourceId);
assert(
  new Set(candidateIds).size === candidateIds.length,
  "candidateIds must be unique",
);
assert(
  new Set(sourceIds).size === sourceIds.length,
  "sourceIds must be unique",
);
const sourceIdSet = new Set(sourceIds);

const actualCounts = Object.fromEntries(
  Object.keys(expectedCounts).map((version) => [
    version,
    candidates.filter((candidate) => candidate.version === version).length,
  ]),
);
assert(
  JSON.stringify(actualCounts) === JSON.stringify(expectedCounts),
  `cycle counts differ: ${JSON.stringify(actualCounts)}`,
);

for (const candidate of candidates) {
  const identity = candidate.proposedIdentity;
  assert(
    Object.hasOwn(expectedCounts, candidate.version),
    `${candidate.candidateId}: out-of-scope version`,
  );
  assert(
    identity.channel === "publicBeta",
    `${candidate.candidateId}: channel must be publicBeta`,
  );
  assert(
    candidate.candidateStatus === "needsEvidenceReview",
    `${candidate.candidateId}: candidate must remain review-gated`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent",
    `${candidate.candidateId}: build evidence must remain absent`,
  );
  assert(
    candidate.flags?.sanityMutationAllowed === false,
    `${candidate.candidateId}: Sanity mutation must be disallowed`,
  );
  assert(
    candidate.flags?.publicationEligible === false,
    `${candidate.candidateId}: publication must be disallowed`,
  );
  assert(
    candidate.productionReconciliation?.exactIdentityMatches === 0,
    `${candidate.candidateId}: production must have zero exact matches`,
  );
  assert(
    Array.isArray(candidate.evidenceRefs) && candidate.evidenceRefs.length >= 2,
    `${candidate.candidateId}: needs at least two retained evidence references`,
  );
  for (const evidenceRef of candidate.evidenceRefs ?? []) {
    assert(
      sourceIdSet.has(evidenceRef.sourceId),
      `${candidate.candidateId}: unresolved source ${evidenceRef.sourceId}`,
    );
  }
}

assert(
  !candidates.some(
    ({ version, proposedIdentity }) =>
      version === "8.0" &&
      (proposedIdentity.sequence === 5 ||
        proposedIdentity.appearanceDate === "2021-08-12"),
  ),
  "watchOS 8 August 12/Public Beta 5 must not be proposed",
);
assert(
  conflicts.some(
    ({ conflictId, decision }) =>
      conflictId === "watchos8-august12-retrospective-row" &&
      decision?.disposition === "doNotProposePublicBeta5",
  ),
  "watchOS 8 August 12 exclusion conflict is missing",
);

const captureManifestPath = resolve(
  repoRoot,
  "tmp/research-evidence/beta-chronology-gap/watchos-major-7-26/fetch-manifest.json",
);
const captureManifest = await loadJson(captureManifestPath);
assert(
  captureManifest.successfulCaptureCount === 49,
  "capture manifest must report 49 successful captures",
);
assert(
  captureManifest.failedCaptureCount === 0,
  "capture manifest must report zero failed captures",
);
const captureBySourceId = new Map(
  captureManifest.sources.map((capture) => [capture.sourceId, capture]),
);

for (const source of sources) {
  const capture = captureBySourceId.get(source.sourceId);
  assert(Boolean(capture), `${source.sourceId}: capture manifest row missing`);
  if (!capture) continue;
  const rawBytes = await readFile(resolve(repoRoot, source.evidence.rawPath));
  assert(
    rawBytes.length === source.evidence.rawBytes,
    `${source.sourceId}: raw byte count differs`,
  );
  assert(
    sha256(rawBytes) === source.evidence.rawSha256,
    `${source.sourceId}: raw SHA-256 differs`,
  );
  assert(
    capture.rawSha256 === source.evidence.rawSha256,
    `${source.sourceId}: source/capture SHA-256 differs`,
  );
}

const productionSnapshot = await loadJson(
  resolve(
    repoRoot,
    "tmp/research-evidence/beta-chronology-gap/watchos-major-7-26/production-snapshot.json",
  ),
);
assert(
  productionSnapshot.perspective === "published",
  "production snapshot must use published perspective",
);
assert(
  productionSnapshot.useCdn === false,
  "production snapshot must bypass the CDN",
);
assert(
  productionSnapshot.productionCounts.watchOSPublicBetaEventsAllVersions === 0,
  "production snapshot must contain zero watchOS publicBeta events",
);
const exactCheckKey = ({ releaseVersionId, channel, routeAlias }) =>
  `${releaseVersionId}|${channel}|${routeAlias}`;
const exactChecks = new Map(
  productionSnapshot.exactChecks.map((check) => [exactCheckKey(check), check]),
);
for (const candidate of candidates) {
  const check = exactChecks.get(
    exactCheckKey({
      releaseVersionId: candidate.releaseVersionId,
      channel: candidate.proposedIdentity.channel,
      routeAlias: candidate.proposedIdentity.routeAlias,
    }),
  );
  assert(Boolean(check), `${candidate.candidateId}: exact production check missing`);
  assert(
    check?.matchCount === 0,
    `${candidate.candidateId}: exact production check found a match`,
  );
}

for (const [name, lock] of Object.entries(validation.fileLocks)) {
  const bytes = await readFile(resolve(packetDir, name));
  assert(bytes.length === lock.bytes, `${name}: locked byte count differs`);
  assert(sha256(bytes) === lock.sha256, `${name}: locked SHA-256 differs`);
}

assert(
  review.independentOfResearcher === false &&
    review.verdict === "pendingIndependentReview",
  "review must remain explicitly pending and non-independent",
);
assert(
  review.authorization?.chronologyApprovedCandidateCount === 0 &&
    review.authorization?.publicationEligible === false &&
    review.authorization?.sanityMutationAllowed === false &&
    review.authorization?.deploymentAllowed === false,
  "review authorization must prohibit publication, mutation, and deployment",
);

const result = {
  batchId,
  status: failures.length === 0 ? "passed" : "failed",
  checks: {
    candidates: candidates.length,
    sources: sources.length,
    conflicts: conflicts.length,
    rawCapturesRehashed: sources.length,
    candidateProductionChecksReconciled: candidates.length,
    independentReviewComplete: false,
  },
  failures,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (failures.length > 0) process.exitCode = 1;
