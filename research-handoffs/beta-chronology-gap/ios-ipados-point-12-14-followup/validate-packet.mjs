#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const parentDir = path.resolve(packetDir, "..", "ios-ipados-point-12-14");
const batchId = "beta-chronology-gap-ios-ipados-point-12-14-followup";
const writeMode = process.argv.includes("--write");

const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, "utf8"));
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const unique = (values) => new Set(values).size === values.length;
const words = (value) =>
  value.trim() ? value.trim().split(/\s+/u).length : 0;
const stableJson = (value) => JSON.stringify(value);

const errors = [];
const warnings = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const [
  assignment,
  fetchLog,
  sourceLedger,
  rawLocks,
  production,
  mappingsLedger,
  conflicts,
  selfReview,
  parentReview,
  parentCandidates,
  parentSources,
  parentValidationBytes,
  parentPacketLocksBytes,
  parentReviewBytes,
] = await Promise.all([
  readJson(path.join(packetDir, "assignment.json")),
  readJson(path.join(packetDir, "fetch-log.json")),
  readJson(path.join(packetDir, "sources.json")),
  readJson(path.join(packetDir, "raw-evidence-locks.json")),
  readJson(path.join(packetDir, "production-snapshot.json")),
  readJson(path.join(packetDir, "mappings.json")),
  readJson(path.join(packetDir, "conflicts.json")),
  readJson(path.join(packetDir, "self-review.json")),
  readJson(path.join(parentDir, "independent-review.json")),
  readJson(path.join(parentDir, "candidates.json")),
  readJson(path.join(parentDir, "sources.json")),
  readFile(path.join(parentDir, "validation.json")),
  readFile(path.join(parentDir, "packet-locks.json")),
  readFile(path.join(parentDir, "independent-review.json")),
]);

for (const artifact of [
  assignment,
  fetchLog,
  sourceLedger,
  rawLocks,
  production,
  mappingsLedger,
  conflicts,
  selfReview,
]) {
  assert(
    artifact.batchId === batchId,
    "Every follow-up JSON artifact must use the follow-up batch ID.",
  );
}

const parentBlockedIds =
  parentReview.candidateDisposition.blockedCandidateIds;
const targetIds = assignment.targets.blockedCandidateIds;
const targetSet = new Set(targetIds);
const parentCandidateById = new Map(
  parentCandidates.candidates.map((candidate) => [
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
const parentSourceIds = new Set(
  parentSources.sources.map((source) => source.sourceId),
);

assert(targetIds.length === 40, "Assignment must contain exactly 40 targets.");
assert(unique(targetIds), "Assignment target IDs must be unique.");
assert(
  [...targetIds].sort().join("\n") ===
    [...parentBlockedIds].sort().join("\n"),
  "Assignment targets must exactly equal the frozen parent blocked IDs.",
);
assert(
  assignment.parentPacket.parentValidationSha256 ===
    sha256(parentValidationBytes),
  "Frozen parent validation hash changed.",
);
assert(
  assignment.parentPacket.parentPacketLocksSha256 ===
    sha256(parentPacketLocksBytes),
  "Frozen parent packet-lock hash changed.",
);
assert(
  assignment.parentPacket.parentIndependentReviewSha256 ===
    sha256(parentReviewBytes),
  "Frozen parent independent-review hash changed.",
);
assert(
  assignment.parentPacket.mustRemainUnchanged === true,
  "Parent packet must remain immutable.",
);

assert(fetchLog.sourceCount === 30, "Fetch log must declare 30 sources.");
assert(fetchLog.successCount === 30, "All 30 source captures must succeed.");
assert(fetchLog.failureCount === 0, "Source capture failures must be zero.");
assert(sourceLedger.sourceCount === 30, "Source ledger count must be 30.");
assert(
  sourceLedger.rawSourceCount === 30,
  "Raw source ledger count must be 30.",
);
assert(
  sourceLedger.failedCaptureCount === 0,
  "Source ledger capture failures must be zero.",
);
assert(rawLocks.sourceCount === 30, "Raw lock count must be 30.");
assert(rawLocks.locks.length === 30, "Raw locks must contain 30 entries.");

const sources = sourceLedger.sources;
const sourceIds = sources.map((source) => source.sourceId);
const sourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);
const lockBySourceId = new Map(
  rawLocks.locks.map((lock) => [lock.sourceId, lock]),
);
assert(sources.length === 30, "Source ledger must contain 30 sources.");
assert(unique(sourceIds), "Supplement source IDs must be unique.");
assert(
  unique(rawLocks.locks.map((lock) => lock.sourceId)),
  "Raw lock source IDs must be unique.",
);
assert(
  [...sourceIds].sort().join("\n") ===
    rawLocks.locks
      .map((lock) => lock.sourceId)
      .sort()
      .join("\n"),
  "Raw locks must cover every supplement source exactly.",
);

let verifiedRawBytes = 0;
let claimExcerptCount = 0;
let maxCombinedQuotedWords = 0;
for (const source of sources) {
  let raw;
  try {
    raw = await readFile(path.resolve(repoRoot, source.evidence.rawPath));
  } catch (error) {
    errors.push(`Unable to read raw evidence for ${source.sourceId}: ${error}`);
    continue;
  }
  verifiedRawBytes += raw.byteLength;
  const rawText = raw.toString("utf8");
  const lock = lockBySourceId.get(source.sourceId);
  assert(Boolean(lock), `Missing raw lock for ${source.sourceId}.`);
  assert(
    raw.byteLength === source.evidence.rawBytes &&
      raw.byteLength === lock?.rawBytes,
    `Raw byte mismatch for ${source.sourceId}.`,
  );
  assert(
    sha256(raw) === source.evidence.rawSha256 &&
      sha256(raw) === lock?.rawSha256,
    `Raw SHA-256 mismatch for ${source.sourceId}.`,
  );
  assert(
    lock?.rawPath === source.evidence.rawPath,
    `Raw path mismatch for ${source.sourceId}.`,
  );
  assert(
    source.roles.includes("publicOrdinal") &&
      source.roles.includes("appearanceDate") &&
      source.roles.includes("channelIdentity") &&
      source.roles.includes("platformApplicability"),
    `Exact source roles are incomplete for ${source.sourceId}.`,
  );
  assert(
    source.lineage.independentForCorroboration === true,
    `Publisher lineage is not marked independent for ${source.sourceId}.`,
  );
  assert(
    source.supports.length > 0 &&
      source.supports.every((candidateId) => targetSet.has(candidateId)),
    `Source support targets are invalid for ${source.sourceId}.`,
  );
  const claimEvidence = source.evidence.claimEvidence ?? [];
  assert(
    claimEvidence.length > 0,
    `Claim-level excerpts are missing for ${source.sourceId}.`,
  );
  let combinedWords = 0;
  for (const claim of claimEvidence) {
    claimExcerptCount += 1;
    const actualWords = words(claim.text);
    combinedWords += actualWords;
    assert(
      actualWords === claim.wordCount,
      `Claim word count mismatch for ${source.sourceId}.`,
    );
    assert(
      sha256(claim.text) === claim.sha256,
      `Claim hash mismatch for ${source.sourceId}.`,
    );
    assert(
      rawText.includes(claim.text),
      `Claim excerpt absent from retained raw evidence for ${source.sourceId}.`,
    );
    assert(
      claim.supports.includes("publicBetaChannel") &&
        claim.supports.includes("displayedPublicOrdinal"),
      `Claim roles do not explicitly cover public ordinal for ${source.sourceId}.`,
    );
  }
  maxCombinedQuotedWords = Math.max(maxCombinedQuotedWords, combinedWords);
  assert(
    combinedWords === source.evidence.combinedQuotedWordCount,
    `Combined quote word count mismatch for ${source.sourceId}.`,
  );
  assert(
    combinedWords <= 20 &&
      source.evidence.maxCombinedQuotedWords === 20,
    `Copyright excerpt limit exceeded for ${source.sourceId}.`,
  );
  assert(
    rawText.includes(source.evidence.selectedText.text),
    `Selected excerpt absent from retained raw evidence for ${source.sourceId}.`,
  );
}
assert(
  verifiedRawBytes === rawLocks.totalBytes,
  "Verified raw byte total does not match raw locks.",
);

const mappings = mappingsLedger.mappings;
const mappingIds = mappings.map((mapping) => mapping.candidateId);
assert(mappings.length === 40, "Mappings must contain 40 candidates.");
assert(unique(mappingIds), "Mapping candidate IDs must be unique.");
assert(
  [...mappingIds].sort().join("\n") === [...targetIds].sort().join("\n"),
  "Mappings must cover the assignment targets exactly.",
);

let evidenceReferenceCount = 0;
let retainedExclusionCount = 0;
for (const mapping of mappings) {
  const parentCandidate = parentCandidateById.get(mapping.candidateId);
  const parentReviewEntry = parentReviewById.get(mapping.candidateId);
  assert(Boolean(parentCandidate), `Missing parent candidate ${mapping.candidateId}.`);
  assert(
    Boolean(parentReviewEntry),
    `Missing parent review ${mapping.candidateId}.`,
  );
  if (!parentCandidate || !parentReviewEntry) continue;
  assert(
    mapping.parentReviewDisposition ===
      "blockedInsufficientExactClaimLevelEvidence",
    `Parent disposition was not retained for ${mapping.candidateId}.`,
  );
  assert(
    stableJson(mapping.originalCandidate) === stableJson(parentCandidate),
    `Frozen parent candidate changed in mapping ${mapping.candidateId}.`,
  );
  assert(
    stableJson(mapping.recommendedIdentity) ===
      stableJson(parentCandidate.proposedIdentity),
    `Recommended identity changed without correction mapping for ${mapping.candidateId}.`,
  );
  assert(
    mapping.identityChanged === false &&
      mapping.correctionOrSupersession === null,
    `Unexpected identity correction for ${mapping.candidateId}.`,
  );
  assert(
    stableJson(mapping.retainedParentEvidenceRefs) ===
      stableJson(parentReviewEntry.acceptedEvidenceRefs),
    `Accepted parent evidence was not retained exactly for ${mapping.candidateId}.`,
  );
  assert(
    stableJson(mapping.retainedParentExclusions) ===
      stableJson(parentReviewEntry.excludedEvidenceRefs),
    `Parent evidence exclusions were not retained exactly for ${mapping.candidateId}.`,
  );
  retainedExclusionCount += mapping.retainedParentExclusions.length;
  for (const ref of mapping.retainedParentEvidenceRefs) {
    evidenceReferenceCount += 1;
    assert(
      parentSourceIds.has(ref.sourceId),
      `Unresolved parent source ${ref.sourceId} for ${mapping.candidateId}.`,
    );
  }
  assert(
    mapping.supplementEvidenceRefs.length >= 1,
    `No supplement evidence for ${mapping.candidateId}.`,
  );
  for (const ref of mapping.supplementEvidenceRefs) {
    evidenceReferenceCount += 1;
    const source = sourceById.get(ref.sourceId);
    assert(
      Boolean(source),
      `Unresolved supplement source ${ref.sourceId} for ${mapping.candidateId}.`,
    );
    if (!source) continue;
    assert(
      source.supports.includes(mapping.candidateId),
      `Supplement source ${ref.sourceId} does not support ${mapping.candidateId}.`,
    );
    assert(
      source.normalizedPacificDate ===
        mapping.recommendedIdentity.appearanceDate,
      `Pacific date mismatch for ${ref.sourceId} and ${mapping.candidateId}.`,
    );
  }
  const families = mapping.corroboration.publisherFamilies;
  assert(
    mapping.corroboration.exactVersionOrdinalDateLineages >= 2 &&
      mapping.corroboration.gateSatisfied === true,
    `Two-lineage gate failed for ${mapping.candidateId}.`,
  );
  assert(
    unique(families) && families.length >= 2,
    `Publisher families are not independent for ${mapping.candidateId}.`,
  );
  assert(
    mapping.productionReconciliation.status === "confirmedMissing" &&
      mapping.productionReconciliation.routeIdentityMatchCount === 0 &&
      mapping.productionReconciliation.fullCandidateMatchCount === 0,
    `Production reconciliation failed for ${mapping.candidateId}.`,
  );
  assert(
    mapping.independentReviewRequired === true &&
      mapping.implementationAuthorized === false,
    `Research safety lock is incomplete for ${mapping.candidateId}.`,
  );
}

assert(
  mappingsLedger.summary.evidenceReadyForIndependentReviewCount === 40 &&
    mappingsLedger.summary.unresolvedResearchCount === 0 &&
    mappingsLedger.summary.correctionOrSupersessionCount === 0 &&
    mappingsLedger.summary.confirmedMissingInProductionCount === 40 &&
    mappingsLedger.summary.independentReviewPendingCount === 40,
  "Mapping summary does not reflect 40 evidence-ready unchanged missing identities.",
);

assert(
  production.perspective === "published" &&
    production.useCdn === false,
  "Production snapshot must use published perspective without CDN.",
);
assert(
  production.candidateCount === 40 &&
    production.exactChecks.length === 40,
  "Production snapshot must cover 40 candidates.",
);
assert(
  production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0,
  "Production snapshot contains an unexpected target match.",
);
assert(
  production.parentChecks.every((check) => check.exists),
  "A target releaseVersion parent is missing from production.",
);
assert(
  production.safety.queryOnly === true &&
    production.safety.sanityMutationPerformed === false,
  "Production query safety declaration failed.",
);

assert(
  conflicts.summary.retainedParentExclusionCount ===
    retainedExclusionCount,
  "Conflict ledger did not retain every parent exclusion.",
);
assert(
  conflicts.summary.newDateConflictCount === 0 &&
    conflicts.summary.identityCorrectionCount === 0 &&
    conflicts.summary.unresolvedConflictCount === 0,
  "Conflict ledger contains an unexpected unresolved finding.",
);
assert(
  conflicts.dateNormalizationFindings.length === 30 &&
    conflicts.dateNormalizationFindings.every(
      (finding) => finding.result === "matchesCandidateAppearanceDate",
    ),
  "Date-normalization findings are incomplete.",
);
assert(
  selfReview.status === "researchCompleteIndependentReviewPending" &&
    selfReview.independentReview.status === "pending" &&
    selfReview.independentReview.createdByResearcher === false &&
    selfReview.independentReview.implementationUnlocked === false,
  "Independent review must remain pending and locked.",
);
assert(
  selfReview.checks.exactClaimLevelEvidence
    .genericAvailabilityUsedAsOrdinalProof === false &&
    selfReview.checks.exactClaimLevelEvidence
      .developerOrdinalUsedAsPublicOrdinalProof === false,
  "Researcher self-check improperly relies on generic/developer evidence.",
);
assert(
  assignment.constraints.noSanityWrites === true &&
    mappingsLedger.safety.sanityMutationPerformed === false &&
    mappingsLedger.safety.pageBuildsPerformed === 0 &&
    mappingsLedger.safety.publicationPerformed === false &&
    mappingsLedger.safety.deploymentPerformed === false,
  "Research-only safety boundary failed.",
);

let independentReviewExists = true;
try {
  await access(path.join(packetDir, "independent-review.json"));
} catch {
  independentReviewExists = false;
}
assert(
  independentReviewExists === false,
  "Researcher must not create independent-review.json.",
);

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator:
    "research-handoffs/beta-chronology-gap/ios-ipados-point-12-14-followup/validate-packet.mjs",
  status: errors.length === 0 ? "passed" : "failed",
  errors,
  warnings,
  checks: {
    exactParentTargetSet: errors.every(
      (error) => !error.includes("Assignment target"),
    ),
    sourceAndRawLockIntegrity: errors.every(
      (error) =>
        !error.includes("Raw ") &&
        !error.includes("source") &&
        !error.includes("Claim"),
    ),
    claimLevelPublicOrdinalEvidence: sources.every(
      (source) =>
        source.roles.includes("publicOrdinal") &&
        source.evidence.claimEvidence.length > 0,
    ),
    minimumTwoIndependentLineages: mappings.every(
      (mapping) => mapping.corroboration.gateSatisfied,
    ),
    exactProductionAbsence:
      production.productionCounts.exactFullMatches === 0,
    parentExclusionsPreserved:
      conflicts.summary.retainedParentExclusionCount ===
      retainedExclusionCount,
    independentReviewPending: !independentReviewExists,
    researchOnlySafety:
      mappingsLedger.safety.sanityMutationPerformed === false,
  },
  statistics: {
    targetCount: targetIds.length,
    mappingCount: mappings.length,
    supportableCandidateCount: mappings.filter(
      (mapping) => mapping.corroboration.gateSatisfied,
    ).length,
    stillBlockedByResearchCount: mappings.filter(
      (mapping) => !mapping.corroboration.gateSatisfied,
    ).length,
    sourceCount: sources.length,
    publisherFamilyCount: new Set(
      sources.map((source) => source.lineage.publisherFamily),
    ).size,
    rawEvidenceCount: rawLocks.locks.length,
    verifiedRawBytes,
    claimExcerptCount,
    maxCombinedQuotedWords,
    evidenceReferenceCount,
    retainedParentExclusionCount: retainedExclusionCount,
    productionExactMatchCount:
      production.productionCounts.exactFullMatches,
    correctionOrSupersessionCount:
      mappingsLedger.summary.correctionOrSupersessionCount,
  },
  independentReview: {
    status: "pending",
    implementationUnlocked: false,
  },
};

if (writeMode) {
  await writeFile(
    path.join(packetDir, "validation.json"),
    `${JSON.stringify(validation, null, 2)}\n`,
  );
}

console.log(JSON.stringify(validation, null, 2));
if (errors.length > 0) process.exitCode = 1;
