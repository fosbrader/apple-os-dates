import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, readdir, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allAppearances,
  applicability,
  batchId,
  blockedAppearances,
  conflicts,
  cycles,
  evidenceRoot,
  negativeFindings,
  packetPath,
  supportableAppearances,
  targetVersionIds,
  targetVersions,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const errors = [];
const warnings = [];
const checks = {};
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const readJson = async (filename) =>
  JSON.parse(await readFile(path.join(here, filename), "utf8"));
const sameJson = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);
const countBy = (items, selector) => {
  const counts = {};
  for (const item of items) {
    const key = selector(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );
};
const identityFor = (appearance) => ({
  candidateId:
    `candidate:apple:watchos:${appearance.version}:public-beta-${appearance.sequence}`,
  releaseVersionId: appearance.releaseVersionId,
  routeAlias: `public-beta-${appearance.sequence}`,
  label: `Public Beta ${appearance.sequence}`,
  sequence: appearance.sequence,
  appearanceDate: appearance.appearanceDate,
});

const [
  assignment,
  sourcesDocument,
  rawLocks,
  candidateRegister,
  conflictsDocument,
  fullSequenceAudit,
  production,
  identitiesDocument,
  selfReview,
  independentReview,
  schema,
  report,
  fetchLog,
  queryScript,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("sources.json"),
  readJson("raw-evidence-locks.json"),
  readJson("candidates.json"),
  readJson("conflicts.json"),
  readJson("full-sequence-audit.json"),
  readJson("production-snapshot.json"),
  readJson("researched-identities.json"),
  readJson("self-review.json"),
  readJson("independent-review.json"),
  readJson("../proposed-event-candidate.schema.json"),
  readFile(path.join(here, "report.md"), "utf8"),
  readFile(
    path.join(repoRoot, evidenceRoot, "fetch-log.json"),
    "utf8",
  ).then(JSON.parse),
  readFile(path.join(here, "query-production.ts"), "utf8"),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["raw-evidence-locks.json", rawLocks],
  ["conflicts.json", conflictsDocument],
  ["full-sequence-audit.json", fullSequenceAudit],
  ["production-snapshot.json", production],
  ["researched-identities.json", identitiesDocument],
  ["self-review.json", selfReview],
  ["independent-review.json", independentReview],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}

const draft7Schema = JSON.parse(
  JSON.stringify(schema).replaceAll("#/$defs/", "#/definitions/"),
);
draft7Schema.$schema = "http://json-schema.org/draft-07/schema#";
draft7Schema.definitions = draft7Schema.$defs;
delete draft7Schema.$defs;
const ajv = new Ajv({allErrors: true, jsonPointers: true});
const validateRegister = ajv.compile(draft7Schema);
checks.sharedCandidateRegisterSchemaValid =
  validateRegister(candidateRegister);
if (!checks.sharedCandidateRegisterSchemaValid) {
  for (const error of validateRegister.errors ?? []) {
    errors.push(
      `Shared schema ${error.dataPath || "/"} ${error.message}.`,
    );
  }
}

const candidates = candidateRegister.candidates;
const notProposed = candidateRegister.notProposed;
const sources = sourcesDocument.sources;
const sourceById = new Map(
  sources.map((item) => [item.sourceId, item]),
);
const specById = new Map(
  sourceSpecs.map((item) => [item.sourceId, item]),
);
const lockById = new Map(
  rawLocks.locks.map((item) => [item.sourceId, item]),
);
const expectedSupportableById = new Map(
  supportableAppearances.map((item) => [
    identityFor(item).candidateId,
    item,
  ]),
);
const expectedBlockedIds = new Set(
  blockedAppearances.map((item) => identityFor(item).candidateId),
);
const productionById = new Map(
  production.exactChecks.map((item) => [item.candidateId, item]),
);
const identityById = new Map(
  identitiesDocument.identities.map((item) => [item.candidateId, item]),
);
const rawDirectoryEntries = await readdir(
  path.join(repoRoot, evidenceRoot, "raw"),
  {withFileTypes: true},
);

checks.counts = {
  targetParentCount: targetVersions.length,
  researchedIdentityCount: identitiesDocument.identityCount,
  supportableCandidateCount: candidates.length,
  blockedIdentityCount: identitiesDocument.blockedCount,
  negativeFindingCount: fullSequenceAudit.negativeFindingCount,
  datedNotProposedCount: notProposed.length,
  conflictCount: conflictsDocument.conflictCount,
  sourceCount: sources.length,
};
checks.candidateCountByVersion = countBy(
  candidates,
  (item) => item.version,
);
checks.sourceCapture = {
  attempted: sourcesDocument.attemptedSourceCount,
  captured: sources.length,
  reused: sourcesDocument.reusedSourceCount,
  directHtml: sourcesDocument.freshHtmlSourceCount,
  searchIndexExtracts: sourcesDocument.searchIndexExtractCount,
  failed: sourcesDocument.failedCaptureCount,
};
checks.production = {
  capturedAt: production.capturedAt,
  perspective: production.perspective,
  useCdn: production.useCdn,
  exactIdentityCount: production.expectedIdentityCount,
  exactRouteMatches: production.productionCounts.exactRouteMatches,
  exactFullMatches: production.productionCounts.exactFullMatches,
  scopedPublicBetaEvents:
    production.productionCounts.scopedPublicBetaEvents,
  allWatchOSPublicBetaEvents:
    production.productionCounts.watchOSPublicBetaEventsAllVersions,
};
checks.freezeContract = {
  expectedMaterialFileCount: 122,
  rawSourceFileCount: rawDirectoryEntries.filter((item) =>
    item.isFile(),
  ).length,
  rawEvidenceLockCount: rawLocks.locks.length,
  sharedCoverageMatrixExcluded: true,
  pendingIndependentReviewExcluded: true,
  packetLockSelfExcluded: true,
};

assert(
  targetVersions.length === 16 &&
    targetVersionIds.length === 16 &&
    new Set(targetVersionIds).size === 16,
  "Expected exactly 16 unique scoped parents.",
);
assert(
  assignment.scopedApplicabilityRows.length === 16 &&
    applicability.length === 16 &&
    assignment.scopedApplicabilityRows.every(
      (item) => item.status === "applicableWithEstablishedAppearances",
    ),
  "All 16 packet-local applicability rows must be applicableWithEstablishedAppearances.",
);
assert(
  sameJson(
    assignment.scopedApplicabilityRows.map((item) => item.releaseVersionId),
    targetVersionIds,
  ),
  "Embedded applicability rows drifted from exact target parent IDs.",
);
assert(
  assignment.sharedAggregateDependency.coverageMatrixReadAtBuildTime ===
      false &&
    assignment.sharedAggregateDependency.coverageMatrixLocked === false,
  "The packet must not depend on or lock the mutable shared coverage matrix.",
);
assert(
  allAppearances.length === 55 &&
    supportableAppearances.length === 46 &&
    blockedAppearances.length === 9 &&
    negativeFindings.length === 8,
  "Research partition drifted from 55 = 46 supportable + 9 blocked and eight separate negative findings.",
);
assert(
  identitiesDocument.identityCount === 55 &&
    identitiesDocument.supportableCount === 46 &&
    identitiesDocument.blockedCount === 9 &&
    identitiesDocument.identities.length === 55 &&
    identityById.size === 55,
  "researched-identities.json partition is incomplete or duplicated.",
);
assert(
  candidates.length === 46 &&
    candidateRegister.summary.proposedCandidateCount === 46 &&
    assignment.counts.supportableCandidateCount === 46,
  "Expected exactly 46 admitted research candidates.",
);
assert(
  sameJson(checks.candidateCountByVersion, {
    "26.4": 2,
    "26.5": 3,
    "26.6": 3,
    "7.1": 2,
    "7.2": 1,
    "7.3": 1,
    "7.4": 6,
    "7.5": 3,
    "7.6": 4,
    "8.1": 2,
    "8.3": 3,
    "8.4": 2,
    "8.5": 3,
    "8.6": 2,
    "8.7": 5,
    "9.1": 4,
  }),
  "Candidate counts by version drifted.",
);
assert(
  notProposed.length === 7 &&
    candidateRegister.summary.notProposedCount === 7 &&
    negativeFindings.filter((item) => item.date === null).length === 1,
  "Expected seven dated not-proposed rows and one undated negative finding.",
);
assert(
  conflicts.length === 8 &&
    conflictsDocument.conflictCount === 8 &&
    conflictsDocument.qualificationCount === 3 &&
    conflictsDocument.blockingConflictCount === 5,
  "Conflict partition drifted from three qualifications and five blocking conflicts.",
);
assert(
  fullSequenceAudit.cycleCount === 16 &&
    fullSequenceAudit.cycles.length === 16 &&
    fullSequenceAudit.researchedAppearanceCount === 55 &&
    fullSequenceAudit.supportableAppearanceCount === 46 &&
    fullSequenceAudit.blockedAppearanceCount === 9 &&
    fullSequenceAudit.negativeFindingCount === 8,
  "Full sequence audit counts are incomplete.",
);

assert(
  sources.length === 100 &&
    sourceSpecs.length === 100 &&
    sourceById.size === 100 &&
    sourcesDocument.attemptedSourceCount === 100 &&
    sourcesDocument.failedCaptureCount === 0 &&
    fetchLog.sourceCount === 100 &&
    fetchLog.successCount === 100 &&
    fetchLog.failureCount === 0,
  "Expected 100 of 100 successful source captures.",
);
assert(
  sourcesDocument.reusedSourceCount === 3 &&
    sourcesDocument.freshHtmlSourceCount === 95 &&
    sourcesDocument.searchIndexExtractCount === 2,
  "Source capture-method partition drifted.",
);
assert(
  rawLocks.sourceCount === 100 &&
    rawLocks.locks.length === 100 &&
    lockById.size === 100 &&
    checks.freezeContract.rawSourceFileCount === 100,
  "Raw evidence locks or raw source file count are incomplete.",
);
assert(
  sameJson(
    sources
      .filter(
        (item) =>
          item.evidence.captureMethod === "search-index-extract",
      )
      .map((item) => item.sourceId)
      .sort(),
    ["ontop-83-pb1", "ontop-84-pb1"],
  ),
  "Only the two explicitly documented ONTOP gateway failures may use search-index extracts.",
);

for (const source of sources) {
  const spec = specById.get(source.sourceId);
  const lock = lockById.get(source.sourceId);
  assert(spec, `${source.sourceId} is absent from source specs.`);
  assert(lock, `${source.sourceId} is absent from raw locks.`);
  if (!lock) continue;
  const bytes = await readFile(path.join(repoRoot, lock.rawPath));
  assert(
    bytes.byteLength === lock.rawBytes &&
      sha256(bytes) === lock.rawSha256 &&
      lock.rawSha256 === source.evidence.rawSha256 &&
      lock.rawBytes === source.evidence.rawBytes,
    `${source.sourceId} raw capture hash or byte count drifted.`,
  );
  assert(
    source.canonicalUrl === spec.canonicalUrl &&
      source.publisher === spec.publisher &&
      sameJson(source.roles, spec.roles),
    `${source.sourceId} metadata drifted from source specs.`,
  );
}

assert(
  new Set(candidates.map((item) => item.candidateId)).size === 46,
  "Candidate IDs are not unique.",
);
assert(
  new Set(
    candidates.map(
      (item) =>
        `${item.releaseVersionId}:${item.proposedIdentity.channel}:${item.proposedIdentity.routeAlias}`,
    ),
  ).size === 46,
  "Candidate route identities are not unique.",
);
assert(
  !candidates.some((item) => expectedBlockedIds.has(item.candidateId)),
  "A blocked identity was admitted as a candidate.",
);
for (const candidate of candidates) {
  const expected = expectedSupportableById.get(candidate.candidateId);
  assert(expected, `${candidate.candidateId} is outside supportable research.`);
  if (!expected) continue;
  const identity = candidate.proposedIdentity;
  assert(
    candidate.platform === "watchOS" &&
      candidate.platformId === "platform-watchos" &&
      candidate.version === expected.version &&
      candidate.releaseVersionId === expected.releaseVersionId,
    `${candidate.candidateId} has malformed parent identity.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.routeAlias === `public-beta-${expected.sequence}` &&
      identity.label === `Public Beta ${expected.sequence}` &&
      identity.sequence === expected.sequence &&
      identity.appearanceDate === expected.appearanceDate &&
      identity.isRevision === false &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has malformed proposed identity.`,
  );
  assert(
    candidate.ordinalBasis === "explicit" &&
      candidate.candidateStatus === "needsEvidenceReview" &&
      candidate.identityStatus === "confirmed" &&
      candidate.evidenceState === "corroborated",
    `${candidate.candidateId} has unexpected evidence or review state.`,
  );
  assert(
    candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.productionReconciliation.exactIdentityMatches === 0,
    `${candidate.candidateId} lacks confirmed-missing reconciliation.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      !Object.hasOwn(candidate, "build") &&
      !Object.hasOwn(candidate, "pairedDeveloperRoute") &&
      !Object.hasOwn(candidate, "priorProposedStableEventId"),
    `${candidate.candidateId} improperly includes build or stable-ID material.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
    `${candidate.candidateId} has unsafe flags.`,
  );
  const refIds = candidate.evidenceRefs.map((ref) => ref.sourceId);
  assert(
    sameJson(refIds, expected.sourceIds),
    `${candidate.candidateId} evidence references drifted.`,
  );
  const affirmativeFamilies = new Set(
    refIds
      .filter((sourceId) => {
        const roles = specById.get(sourceId)?.roles ?? [];
        return (
          roles.includes("publicAvailability") &&
          roles.includes("publicOrdinal")
        );
      })
      .map((sourceId) => sourceById.get(sourceId)?.publisher),
  );
  assert(
    affirmativeFamilies.size >= 2,
    `${candidate.candidateId} has only ${affirmativeFamilies.size} affirmative publisher lineage(s).`,
  );
  const productionCheck = productionById.get(candidate.candidateId);
  assert(
    productionCheck?.routeIdentityMatchCount === 0 &&
      productionCheck?.fullCandidateMatchCount === 0,
    `${candidate.candidateId} no longer has exact production absence proof.`,
  );
}

for (const identity of identitiesDocument.identities) {
  const expected = allAppearances.find(
    (item) => identityFor(item).candidateId === identity.candidateId,
  );
  assert(expected, `${identity.candidateId} is outside researched identities.`);
  if (!expected) continue;
  assert(
    identity.researchDecision === expected.decision &&
      identity.identityStatus === expected.identityStatus &&
      sameJson(identity.sourceIds, expected.sourceIds),
    `${identity.candidateId} research decision or evidence drifted.`,
  );
  if (expected.decision === "blocked") {
    assert(
      identity.productionReconciliation.status ===
        "plausibleInsufficientEvidence",
      `${identity.candidateId} blocked identity has unsafe production disposition.`,
    );
  }
}

const datedNegativeIds = new Set(
  negativeFindings
    .filter((item) => item.date !== null)
    .map(
      (item) =>
        `not-proposed:apple:watchos:${item.version}:public-beta-${item.sequence}`,
    ),
);
assert(
  new Set(notProposed.map((item) => item.recordId)).size === 7 &&
    notProposed.every((item) => datedNegativeIds.has(item.recordId)),
  "Dated not-proposed roster drifted.",
);
for (const item of notProposed) {
  assert(
    item.classification === "publicDistributionNotEstablished" &&
      item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false,
    `${item.recordId} has an unsafe or unexpected negative disposition.`,
  );
  assert(
    item.evidenceRefs.every((ref) => sourceById.has(ref.sourceId)),
    `${item.recordId} references unknown evidence.`,
  );
}

assert(
  production.perspective === "published" &&
    production.useCdn === false &&
    production.expectedIdentityCount === 55 &&
    production.parentChecks.length === 16 &&
    production.parentChecks.every((item) => item.exists) &&
    production.productionCounts.watchOSPublicBetaEventsAllVersions === 0 &&
    production.productionCounts.scopedPublicBetaEvents === 0 &&
    production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0,
  "Fresh production reconciliation is incomplete or no longer empty.",
);
assert(
  production.safety.queryOnly === true &&
    production.safety.sanityMutationPerformed === false &&
    !/\.(?:create|createIfNotExists|createOrReplace|patch|delete|transaction|mutate)\s*\(/.test(
      queryScript,
    ),
  "Production script is not demonstrably query-only.",
);

assert(
  selfReview.independentOfResearcher === false &&
    selfReview.verdict ===
      "researcherSelfCheckPassedPendingIndependentReview" &&
    selfReview.checks.sharedCoverageMatrixMutated === false &&
    selfReview.checks.blockedIdentityCountAdmittedAsCandidate === 0 &&
    selfReview.authorization.sanityMutationAllowed === false &&
    selfReview.authorization.publicationEligible === false,
  "Researcher self-review has an unsafe or misleading state.",
);
assert(
  independentReview.status === "pending" &&
    independentReview.reviewer === null &&
    independentReview.reviewedAt === null &&
    independentReview.independentOfResearcher === null &&
    independentReview.authorization.sanityMutationAllowed === false &&
    independentReview.authorization.publicationEligible === false,
  "Independent review must remain pending and unauthorized.",
);
assert(
  report.includes("46 supportable candidates") &&
    report.includes("9 blocked identities") &&
    report.includes("8 separate negative or unestablished") &&
    report.includes("100") &&
    report.includes("coverage-matrix.json"),
  "Reader-facing report omits required partition or freeze qualifications.",
);
assert(
  checks.freezeContract.expectedMaterialFileCount === 122 &&
    checks.freezeContract.rawSourceFileCount === 100 &&
    checks.freezeContract.rawEvidenceLockCount === 100 &&
    checks.freezeContract.sharedCoverageMatrixExcluded === true &&
    checks.freezeContract.pendingIndependentReviewExcluded === true &&
    checks.freezeContract.packetLockSelfExcluded === true,
  "Freeze-contract counts or exclusions drifted.",
);

warnings.push(
  "Independent chronology review remains pending; this validation grants no Sanity mutation or publication authority.",
);
warnings.push(
  "Two legacy ONTOP sources use explicitly labeled bounded search-index extracts after direct origin HTTP 522 failures; an independent reviewer must inspect that qualification.",
);

checks.safety = {
  sanityMutationPerformed: false,
  stableEventIdsCreated: 0,
  pageBuildsPerformed: 0,
  publicationPerformed: false,
  deploymentPerformed: false,
  sharedCoverageMatrixMutated: false,
  independentReviewComplete: false,
};
const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: production.capturedAt,
  status: errors.length === 0 ? "passed" : "failed",
  errors,
  warnings,
  checks,
  safety: {
    validationAuthorizesMutation: false,
    validationAuthorizesPublication: false,
  },
};
await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);
console.log(JSON.stringify(validation, null, 2));
if (errors.length > 0) process.exit(1);
