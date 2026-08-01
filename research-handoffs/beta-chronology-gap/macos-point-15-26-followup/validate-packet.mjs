#!/usr/bin/env node

import {createHash} from "node:crypto";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const parentDir = path.resolve(packetDir, "..", "macos-point-15-26");
const batchId = "beta-chronology-gap-macos-point-15-26-followup";
const writeMode = process.argv.includes("--write");
const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, "utf8"));
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const words = (value) =>
  value.trim() ? value.trim().split(/\s+/u).length : 0;
const unique = (values) => new Set(values).size === values.length;

const errors = [];
const warnings = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const [
  assignment,
  fetchLog,
  sourcesLedger,
  rawLocks,
  production,
  mappingsLedger,
  conflicts,
  selfReview,
  report,
  parentCandidatesBytes,
  parentReviewBytes,
  parentPacketLocksBytes,
  parentRawLocksBytes,
  parentSourcesBytes,
] = await Promise.all([
  readJson(path.join(packetDir, "assignment.json")),
  readJson(path.join(packetDir, "fetch-log.json")),
  readJson(path.join(packetDir, "sources.json")),
  readJson(path.join(packetDir, "raw-evidence-locks.json")),
  readJson(path.join(packetDir, "production-snapshot.json")),
  readJson(path.join(packetDir, "mappings.json")),
  readJson(path.join(packetDir, "conflicts.json")),
  readJson(path.join(packetDir, "self-review.json")),
  readFile(path.join(packetDir, "report.md"), "utf8"),
  readFile(path.join(parentDir, "candidates.json")),
  readFile(path.join(parentDir, "independent-review.json")),
  readFile(path.join(parentDir, "packet-locks.json")),
  readFile(path.join(parentDir, "raw-evidence-locks.json")),
  readFile(path.join(parentDir, "sources.json")),
]);
const parentCandidatesLedger = JSON.parse(parentCandidatesBytes);
const parentReview = JSON.parse(parentReviewBytes);
const parentPacketLocks = JSON.parse(parentPacketLocksBytes);
const parentRawLocks = JSON.parse(parentRawLocksBytes);
const parentSourcesLedger = JSON.parse(parentSourcesBytes);

for (const artifact of [
  assignment,
  fetchLog,
  sourcesLedger,
  rawLocks,
  production,
  mappingsLedger,
  conflicts,
  selfReview,
]) {
  assert(
    artifact.batchId === batchId,
    "Every supplement JSON artifact must use the supplement batch ID.",
  );
}

const targetIds = assignment.targets.blockedCandidateIds;
const parentBlockedIds =
  parentReview.candidateDisposition.blockedCandidateIds;
assert(targetIds.length === 8, "Assignment must contain exactly 8 targets.");
assert(unique(targetIds), "Assignment target IDs must be unique.");
assert(
  [...targetIds].sort().join("\n") ===
    [...parentBlockedIds].sort().join("\n"),
  "Assignment targets must exactly equal all frozen parent blockers.",
);
assert(
  assignment.parentPacket.mustRemainUnchanged === true,
  "Frozen parent packet must remain immutable.",
);
const dependencyActuals = {
  candidates: parentCandidatesBytes,
  independentReview: parentReviewBytes,
  packetLocks: parentPacketLocksBytes,
  rawEvidenceLocks: parentRawLocksBytes,
};
for (const [key, bytes] of Object.entries(dependencyActuals)) {
  const declaration = assignment.parentPacket.dependencies[key];
  assert(Boolean(declaration), `Missing parent dependency pin: ${key}.`);
  assert(
    declaration?.bytes === bytes.byteLength,
    `Parent dependency byte count changed: ${key}.`,
  );
  assert(
    declaration?.sha256 === sha256(bytes),
    `Parent dependency SHA-256 changed: ${key}.`,
  );
}

let verifiedParentPacketBytes = 0;
let parentPacketLockFailures = 0;
for (const [relativePath, lock] of Object.entries(parentPacketLocks.locks)) {
  try {
    const bytes = await readFile(path.resolve(repoRoot, relativePath));
    verifiedParentPacketBytes += bytes.byteLength;
    if (
      bytes.byteLength !== lock.bytes ||
      sha256(bytes) !== lock.sha256
    ) {
      parentPacketLockFailures += 1;
      errors.push(`Frozen parent packet lock failed: ${relativePath}.`);
    }
  } catch (error) {
    parentPacketLockFailures += 1;
    errors.push(`Frozen parent packet material unreadable: ${relativePath}.`);
  }
}
assert(
  Object.keys(parentPacketLocks.locks).length ===
    parentPacketLocks.materialFileCount,
  "Frozen parent material count does not match its lock ledger.",
);

const parentSourceById = new Map(
  parentSourcesLedger.sources.map((source) => [source.sourceId, source]),
);
let verifiedParentRawBytes = 0;
let parentRawLockFailures = 0;
for (const lock of parentRawLocks.locks) {
  try {
    const bytes = await readFile(path.resolve(repoRoot, lock.rawPath));
    verifiedParentRawBytes += bytes.byteLength;
    const source = parentSourceById.get(lock.sourceId);
    if (
      bytes.byteLength !== lock.rawBytes ||
      sha256(bytes) !== lock.rawSha256 ||
      source?.evidence.rawSha256 !== lock.rawSha256 ||
      source?.evidence.rawBytes !== lock.rawBytes ||
      source?.evidence.selectedText.sha256 !== lock.selectedTextSha256 ||
      sha256(source?.evidence.selectedText.text ?? "") !==
        lock.selectedTextSha256
    ) {
      parentRawLockFailures += 1;
      errors.push(`Frozen parent raw lock failed: ${lock.sourceId}.`);
    }
  } catch {
    parentRawLockFailures += 1;
    errors.push(`Frozen parent raw material unreadable: ${lock.sourceId}.`);
  }
}
assert(
  parentRawLocks.locks.length === parentRawLocks.sourceCount,
  "Frozen parent raw-source count does not match its lock ledger.",
);

assert(
  fetchLog.sourceArtifactCount === 15 &&
    fetchLog.successCount === 15 &&
    fetchLog.failureCount === 0,
  "Exactly 15 successful source-artifact captures are required.",
);
assert(
  sourcesLedger.sourceCount === 8 &&
    sourcesLedger.rawArtifactCount === 15,
  "Source ledger must declare 8 publisher pages and 15 raw artifacts.",
);
assert(
  sourcesLedger.publisherFamilyCount === 2,
  "Supplement source ledger must contain two publisher families.",
);
assert(
  rawLocks.rawArtifactCount === 15 &&
    rawLocks.locks.length === 15,
  "Raw evidence ledger must lock all 15 artifacts.",
);
assert(
  unique(rawLocks.locks.map((lock) => lock.rawId)),
  "Raw artifact IDs must be unique.",
);

const rawById = new Map(
  rawLocks.locks.map((lock) => [lock.rawId, lock]),
);
const fetchById = new Map(
  fetchLog.results.map((result) => [result.rawId, result]),
);
let verifiedSupplementRawBytes = 0;
for (const lock of rawLocks.locks) {
  const fetchRecord = fetchById.get(lock.rawId);
  assert(Boolean(fetchRecord), `No fetch record for ${lock.rawId}.`);
  try {
    const bytes = await readFile(path.resolve(repoRoot, lock.rawPath));
    verifiedSupplementRawBytes += bytes.byteLength;
    assert(
      bytes.byteLength === lock.rawBytes,
      `Raw byte mismatch for ${lock.rawId}.`,
    );
    assert(
      sha256(bytes) === lock.rawSha256,
      `Raw SHA-256 mismatch for ${lock.rawId}.`,
    );
    assert(
      fetchRecord?.rawPath === lock.rawPath &&
        fetchRecord?.rawBytes === lock.rawBytes,
      `Fetch/lock mismatch for ${lock.rawId}.`,
    );
  } catch (error) {
    errors.push(`Unable to verify ${lock.rawId}: ${error}`);
  }
}
assert(
  verifiedSupplementRawBytes === rawLocks.totalBytes,
  "Verified supplement byte total does not match the raw lock ledger.",
);

const sourceById = new Map(
  sourcesLedger.sources.map((source) => [source.sourceId, source]),
);
assert(
  unique(sourcesLedger.sources.map((source) => source.sourceId)),
  "Supplement source IDs must be unique.",
);
for (const source of sourcesLedger.sources) {
  assert(
    targetIds.includes(source.candidateId),
    `Source targets an out-of-scope candidate: ${source.sourceId}.`,
  );
  assert(
    source.roles.includes("platformApplicability") &&
      source.roles.includes("versionIdentity") &&
      source.roles.includes("publicBetaChannel") &&
      source.roles.includes("displayedPublicOrdinal") &&
      source.roles.includes("appearanceDate"),
    `Source roles are incomplete for ${source.sourceId}.`,
  );
  assert(
    source.lineage.independentForCorroboration === true,
    `Source lineage not eligible for corroboration: ${source.sourceId}.`,
  );
  const selected = source.evidence.selectedText;
  assert(
    selected.wordCount === words(selected.text) &&
      selected.wordCount <= 20 &&
      selected.maxWords === 20,
    `Bounded selected-text rule failed for ${source.sourceId}.`,
  );
  assert(
    selected.sha256 === sha256(selected.text),
    `Selected-text hash failed for ${source.sourceId}.`,
  );
  let foundSelectedText = false;
  for (const rawRef of source.evidence.rawArtifacts) {
    const lock = rawById.get(rawRef.rawId);
    assert(Boolean(lock), `Source raw ref unresolved: ${rawRef.rawId}.`);
    assert(
      rawRef.rawPath === lock?.rawPath &&
        rawRef.rawBytes === lock?.rawBytes &&
        rawRef.rawSha256 === lock?.rawSha256,
      `Source raw ref lock mismatch: ${rawRef.rawId}.`,
    );
    const rawText = await readFile(
      path.resolve(repoRoot, rawRef.rawPath),
      "utf8",
    );
    if (rawText.includes(selected.text)) foundSelectedText = true;
  }
  assert(
    foundSelectedText,
    `Selected text absent from retained raw artifacts: ${source.sourceId}.`,
  );
  if (source.publisher === "Monomaniac Garage") {
    assert(
      source.evidence.rawArtifacts.length === 2 &&
        source.evidence.rawArtifacts.some(
          (artifact) => artifact.mediaType === "text/html",
        ) &&
        source.evidence.rawArtifacts.some(
          (artifact) =>
            artifact.captureKind === "publisherWordPressApiRecord",
        ),
      `Monomaniac HTML/API capture pair incomplete: ${source.sourceId}.`,
    );
  }
}

assert(
  production.perspective === "published" &&
    production.useCdn === false,
  "Production query must be published and useCdn:false.",
);
assert(
  production.targetCandidateCount === 8 &&
    production.targetVersionIds.length === 7 &&
    production.parentChecks.length === 7 &&
    production.parentChecks.every((check) => check.exists),
  "Fresh production query must prove all seven parents exist.",
);
assert(
  production.exactChecks.length === 8 &&
    production.exactChecks.every(
      (check) =>
        check.routeIdentityMatchCount === 0 &&
        check.fullCandidateMatchCount === 0,
    ) &&
    production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0,
  "Fresh production query must prove every exact identity is absent.",
);
assert(
  production.safety.queryOnly === true &&
    production.safety.sanityMutationPerformed === false,
  "Production snapshot must remain query-only.",
);

const mappings = mappingsLedger.mappings;
const mappingById = new Map(
  mappings.map((mapping) => [mapping.candidateId, mapping]),
);
const parentCandidateById = new Map(
  parentCandidatesLedger.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const parentReviewById = new Map(
  parentReview.candidateReviews.map((review) => [
    review.candidateId,
    review,
  ]),
);
assert(
  mappings.length === 8 &&
    mappingsLedger.mappingCount === 8 &&
    unique(mappings.map((mapping) => mapping.candidateId)),
  "Mappings must partition exactly eight unique parent candidates.",
);
assert(
  [...mappingById.keys()].sort().join("\n") ===
    [...targetIds].sort().join("\n"),
  "Mappings must cover all and only the frozen parent blockers.",
);
const readyMappings = mappings.filter(
  (mapping) =>
    mapping.researchDisposition ===
    "evidenceReadyPendingIndependentReview",
);
const blockedMappings = mappings.filter(
  (mapping) => mapping.researchDisposition === "remainsBlocked",
);
assert(
  readyMappings.length === 6 &&
    mappingsLedger.evidenceReadyCount === 6,
  "Research disposition must contain exactly six evidence-ready candidates.",
);
assert(
  blockedMappings.length === 2 &&
    mappingsLedger.remainsBlockedCount === 2,
  "Research disposition must contain exactly two blocked candidates.",
);
assert(
  mappingsLedger.identityCorrectionCount === 0,
  "The supplement must propose no candidate identity corrections.",
);
for (const mapping of mappings) {
  const parentCandidate = parentCandidateById.get(mapping.candidateId);
  const parentCandidateReview = parentReviewById.get(mapping.candidateId);
  const expectedIdentity = {
    candidateId: parentCandidate.candidateId,
    platform: parentCandidate.platform,
    platformId: parentCandidate.platformId,
    version: parentCandidate.version,
    releaseVersionId: parentCandidate.releaseVersionId,
    proposedIdentity: parentCandidate.proposedIdentity,
  };
  assert(
    mapping.identityPreservedUnchanged === true &&
      JSON.stringify(mapping.identity) === JSON.stringify(expectedIdentity),
    `Frozen candidate identity changed: ${mapping.candidateId}.`,
  );
  assert(
    mapping.parentCandidateRecordSha256 ===
      sha256(`${JSON.stringify(parentCandidate)}\n`) &&
      mapping.identityFingerprintSha256 ===
        sha256(JSON.stringify(expectedIdentity)),
    `Candidate fingerprint failed: ${mapping.candidateId}.`,
  );
  assert(
    parentCandidateReview?.disposition === "blocked",
    `Target was not blocked by the frozen independent review: ${mapping.candidateId}.`,
  );
  assert(
    mapping.productionReconciliation.parentExists === true &&
      mapping.productionReconciliation.exactRouteIdentityMatchCount === 0 &&
      mapping.productionReconciliation.exactFullCandidateMatchCount === 0,
    `Production reconciliation failed: ${mapping.candidateId}.`,
  );
  assert(
    mapping.independentReview.status === "pending" &&
      mapping.independentReview.required === true,
    `Independent review must remain pending: ${mapping.candidateId}.`,
  );
  assert(
    mapping.flags.sanityMutationAllowed === false &&
      mapping.flags.stableEventIdCreationAllowed === false &&
      mapping.flags.publicationEligible === false &&
      mapping.flags.pageWorkAllowed === false &&
      mapping.flags.deploymentAllowed === false,
    `Safety flags are not all false: ${mapping.candidateId}.`,
  );
  for (const reference of [
    ...mapping.retainedParentEvidenceRefs,
    ...mapping.supplementEvidenceRefs,
  ]) {
    if (reference.kind === "frozenParentSource") {
      const parentSource = parentSourceById.get(reference.sourceId);
      assert(
        Boolean(parentSource) &&
          reference.rawSha256 === parentSource.evidence.rawSha256,
        `Frozen parent evidence ref failed: ${reference.sourceId}.`,
      );
    } else {
      const supplementSource = sourceById.get(reference.sourceId);
      assert(
        Boolean(supplementSource) &&
          supplementSource.candidateId === mapping.candidateId &&
          reference.selectedTextSha256 ===
            supplementSource.evidence.selectedText.sha256,
        `Supplement evidence ref failed: ${reference.sourceId}.`,
      );
    }
  }
}
for (const mapping of readyMappings) {
  assert(
    mapping.selectedEvidenceRefs.length === 2 &&
      mapping.exactIndependentPublisherLineageCount === 2 &&
      new Set(
        mapping.selectedEvidenceRefs.map(
          (reference) => reference.publisherFamily,
        ),
      ).size === 2,
    `Ready candidate lacks two independent selected lineages: ${mapping.candidateId}.`,
  );
  const supplement = sourceById.get(
    mapping.supplementEvidenceRefs[0].sourceId,
  );
  assert(
    supplement.appearanceDatePacific ===
      mapping.identity.proposedIdentity.appearanceDate,
    `Ready supplement date disagrees with candidate: ${mapping.candidateId}.`,
  );
  const ordinal = mapping.identity.proposedIdentity.sequence;
  assert(
    supplement.evidence.selectedText.text.includes(
      `Public Beta ${ordinal}`,
    ),
    `Ready supplement does not display exact public ordinal: ${mapping.candidateId}.`,
  );
  assert(
    supplement.evidence.selectedText.text.includes(
      mapping.identity.version,
    ),
    `Ready supplement does not display exact version: ${mapping.candidateId}.`,
  );
}
for (const mapping of blockedMappings) {
  assert(
    mapping.selectedEvidenceRefs.length === 0 &&
      mapping.blocker.length > 0,
    `Blocked mapping must retain an explicit blocker: ${mapping.candidateId}.`,
  );
}
assert(
  blockedMappings
    .map((mapping) => mapping.candidateId)
    .sort()
    .join("\n") ===
    [
      "candidate:apple:macos:15.3:public-beta-3",
      "candidate:apple:macos:15.5:public-beta-3",
    ].join("\n"),
  "Unexpected blocked partition.",
);

assert(
  conflicts.conflictCount === 5 &&
    conflicts.resolvedConflictCount === 3 &&
    conflicts.unresolvedConflictCount === 2 &&
    conflicts.conflicts.length === 5,
  "Conflict ledger must preserve the 3-resolved/2-unresolved partition.",
);
assert(
  conflicts.conflicts
    .filter((conflict) => conflict.status === "unresolved")
    .map((conflict) => conflict.candidateId)
    .sort()
    .join("\n") ===
    blockedMappings
      .map((mapping) => mapping.candidateId)
      .sort()
      .join("\n"),
  "Unresolved conflicts must equal the still-blocked candidates.",
);
assert(
  assignment.independentReview.status === "pending" &&
    assignment.independentReview.researcherMustNotCreateIt === true,
  "Independent review must remain pending and outside researcher scope.",
);
assert(
  assignment.constraints.noSanityWrites === true &&
    assignment.constraints.noStableEventIdCreation === true &&
    assignment.constraints.noPageWork === true &&
    assignment.constraints.noPublication === true &&
    assignment.constraints.noDeployment === true,
  "Assignment safety constraints must all remain active.",
);
assert(
  selfReview.independentOfResearcher === false &&
    selfReview.status ===
      "researchCompleteIndependentReviewPending" &&
    Object.values(selfReview.checks).every(
      (value) => value === true || value === 0 || value === false,
    ),
  "Researcher self-review is malformed.",
);
assert(
  selfReview.checks.sanityMutationPerformed === false &&
    selfReview.checks.publicationPerformed === false &&
    selfReview.checks.deploymentPerformed === false,
  "Self-review safety claims failed.",
);
assert(
  report.includes("6 now have two independent exact publisher lineages") &&
    report.includes("2 remain blocked") &&
    report.includes("No Sanity mutation"),
  "Human-readable report is missing material disposition or safety language.",
);

let packetLocksExist = true;
try {
  await access(path.join(packetDir, "packet-locks.json"));
} catch {
  packetLocksExist = false;
}
let supplementFreezeVerification = {
  status: "pending",
  declaredMaterialFileCount: 0,
  verifiedMaterialFileCount: 0,
  verifiedBytes: 0,
  failureCount: 0,
};
if (packetLocksExist) {
  const packetLocks = await readJson(path.join(packetDir, "packet-locks.json"));
  let verifiedBytes = 0;
  const freezeFailures = [];
  for (const lock of packetLocks.locks) {
    try {
      const bytes = await readFile(path.resolve(repoRoot, lock.path));
      verifiedBytes += bytes.byteLength;
      if (
        bytes.byteLength !== lock.bytes ||
        sha256(bytes) !== lock.sha256
      ) {
        freezeFailures.push(lock.path);
      }
    } catch {
      freezeFailures.push(lock.path);
    }
  }
  supplementFreezeVerification = {
    status: freezeFailures.length === 0 ? "verified" : "failed",
    declaredMaterialFileCount: packetLocks.materialFileCount,
    verifiedMaterialFileCount:
      packetLocks.locks.length - freezeFailures.length,
    verifiedBytes,
    failureCount: freezeFailures.length,
    failures: freezeFailures,
  };
  assert(
    freezeFailures.length === 0,
    "Frozen supplement packet-lock verification failed.",
  );
}

const result = {
  formatVersion: 1,
  batchId,
  status: errors.length === 0 ? "pass" : "fail",
  validatedAgainstProductionCapturedAt: production.capturedAt,
  errors,
  warnings,
  metrics: {
    targetCount: targetIds.length,
    evidenceReadyCount: readyMappings.length,
    remainsBlockedCount: blockedMappings.length,
    identityCorrectionCount: mappingsLedger.identityCorrectionCount,
    sourcePageCount: sourcesLedger.sourceCount,
    rawArtifactCount: rawLocks.rawArtifactCount,
    supplementPublisherFamilyCount: sourcesLedger.publisherFamilyCount,
    verifiedSupplementRawBytes,
    productionParentCount: production.parentChecks.length,
    productionExactRouteMatchCount:
      production.productionCounts.exactRouteMatches,
    productionExactFullMatchCount:
      production.productionCounts.exactFullMatches,
    parentPacketDeclaredMaterialFileCount:
      parentPacketLocks.materialFileCount,
    parentPacketVerifiedMaterialFileCount:
      parentPacketLocks.materialFileCount - parentPacketLockFailures,
    parentPacketLockFailures,
    verifiedParentPacketBytes,
    parentRawDeclaredLockCount: parentRawLocks.sourceCount,
    parentRawVerifiedLockCount:
      parentRawLocks.sourceCount - parentRawLockFailures,
    parentRawLockFailures,
    verifiedParentRawBytes,
  },
  parentDependencyPins: assignment.parentPacket.dependencies,
  supplementFreezeVerification,
  safety: {
    sanityMutationPerformed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
    independentReviewCreatedByResearcher: false,
  },
};

if (writeMode) {
  await writeFile(
    path.join(packetDir, "validation.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
}
console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exitCode = 1;
