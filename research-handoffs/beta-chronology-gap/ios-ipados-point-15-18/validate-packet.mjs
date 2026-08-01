import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allObservedAppearances,
  batchId,
  evidenceRoot,
  sourceDateConflicts,
  targetVersionIds,
} from "./research-data.mjs";
import {
  sourceIdsForCandidate,
  sourceSpecsFor,
} from "./source-specs.mjs";

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
const countBy = (items, selector) => {
  const result = {};
  for (const item of items) {
    const key = selector(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b)),
  );
};
const exists = async (filename) => {
  try {
    await access(filename);
    return true;
  } catch {
    return false;
  }
};
const [
  assignment,
  sourcesDocument,
  rawLocks,
  register,
  conflicts,
  sequenceAudit,
  notProposed,
  production,
  identities,
  selfReview,
  schema,
  report,
  fetchLog,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("sources.json"),
  readJson("raw-evidence-locks.json"),
  readJson("candidates.json"),
  readJson("conflicts.json"),
  readJson("full-sequence-audit.json"),
  readJson("not-proposed.json"),
  readJson("production-snapshot.json"),
  readJson("researched-identities.json"),
  readJson("self-review.json"),
  readFile(path.join(here, "../proposed-event-candidate.schema.json"), "utf8").then(
    JSON.parse,
  ),
  readFile(path.join(here, "report.md"), "utf8"),
  readFile(
    path.join(repoRoot, evidenceRoot, "fetch-log.json"),
    "utf8",
  ).then(JSON.parse),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["raw-evidence-locks.json", rawLocks],
  ["conflicts.json", conflicts],
  ["full-sequence-audit.json", sequenceAudit],
  ["not-proposed.json", notProposed],
  ["production-snapshot.json", production],
  ["researched-identities.json", identities],
  ["self-review.json", selfReview],
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
const schemaValidator = ajv.compile(draft7Schema);
checks.sharedCandidateRegisterSchemaValid = schemaValidator(register);
if (!checks.sharedCandidateRegisterSchemaValid) {
  for (const error of schemaValidator.errors ?? []) {
    errors.push(
      `Shared schema ${error.dataPath || "/"} ${error.message}.`,
    );
  }
}

const candidates = register.candidates;
const sources = sourcesDocument.sources;
const sourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);
const lockById = new Map(
  rawLocks.locks.map((lock) => [lock.sourceId, lock]),
);
const expectedById = new Map(
  allObservedAppearances.map((item) => [item.candidateId, item]),
);
const productionById = new Map(
  production.exactChecks.map((item) => [item.candidateId, item]),
);
const sourceSpecs = sourceSpecsFor(allObservedAppearances);

checks.counts = {
  coverageRows: assignment.coverageMatrix.scopedRowCount,
  targetParents: assignment.productionScope.queriedParentCount,
  candidates: candidates.length,
  readyCandidates: candidates.filter(
    (item) => item.candidateStatus === "readyForChronologyReview",
  ).length,
  conflictedCandidates: candidates.filter(
    (item) => item.identityStatus === "conflict",
  ).length,
  cycles: sequenceAudit.cycleCount,
  notProposed: notProposed.recordCount,
  conflicts: conflicts.conflictCount,
  sources: sources.length,
  rawLocks: rawLocks.locks.length,
};
checks.candidateByPlatform = countBy(
  candidates,
  (item) => item.platform,
);
checks.candidateByStatus = countBy(
  candidates,
  (item) => item.candidateStatus,
);
checks.production = {
  capturedAt: production.capturedAt,
  perspective: production.perspective,
  useCdn: production.useCdn,
  totalReleaseEvents: production.productionCounts.totalReleaseEvents,
  scopedReleaseEvents: production.productionCounts.scopedReleaseEvents,
  scopedPublicBetaEvents:
    production.productionCounts.scopedPublicBetaEvents,
  exactRouteMatches: production.productionCounts.exactRouteMatches,
  exactFullMatches: production.productionCounts.exactFullMatches,
  missingParents: production.parentChecks.filter((item) => !item.exists).length,
};

assert(
  assignment.coverageMatrix.scopedRowCount === 75 &&
    assignment.coverageMatrix.positiveCycleRowCount === 41 &&
    assignment.coverageMatrix.noPositiveCandidateRowCount === 34,
  "Coverage assignment must contain 75 rows: 41 positive and 34 no-positive.",
);
const coverageBytes = await readFile(
  path.join(repoRoot, assignment.coverageMatrix.path),
);
assert(
  coverageBytes.byteLength === assignment.coverageMatrix.bytes &&
    sha256(coverageBytes) === assignment.coverageMatrix.sha256,
  "Coverage-matrix source hash drifted.",
);
assert(
  assignment.productionScope.queriedParentCount === 75 &&
    targetVersionIds.length === 75,
  "Expected 75 exact parent checks.",
);
assert(
  candidates.length === 159 &&
    register.summary.proposedCandidateCount === 159 &&
    expectedById.size === 159 &&
    identities.identityCount === 159,
  "Expected exactly 159 researched candidates/identities.",
);
assert(
  checks.counts.readyCandidates === 153 &&
    checks.counts.conflictedCandidates === 6 &&
    checks.candidateByStatus.readyForChronologyReview === 153 &&
    checks.candidateByStatus.needsEvidenceReview === 6,
  "Expected 153 gate-passed and six blocked-conflict candidates.",
);
assert(
  checks.candidateByPlatform.iOS === 81 &&
    checks.candidateByPlatform.iPadOS === 78,
  "Expected 81 iOS and 78 iPadOS observations.",
);
assert(
  sequenceAudit.cycleCount === 41 &&
    sequenceAudit.cycles.length === 41 &&
    sequenceAudit.proposedAppearanceCount === 159 &&
    sequenceAudit.noPositiveAuditRowCount === 34,
  "Full-sequence audit counts drifted.",
);
assert(
  notProposed.recordCount === 38 &&
    notProposed.records.length === 38 &&
    notProposed.noPositiveCoverageRowCount === 34 &&
    notProposed.skippedOrdinalRecordCount === 4,
  "Expected 38 reversible not-proposed records.",
);
assert(
  conflicts.conflictCount === 21 &&
    conflicts.conflicts.length === 21 &&
    sourceDateConflicts.length === 21 &&
    conflicts.blockedCandidateIds.length === 6,
  "Expected 21 conflicts and six blocked candidate IDs.",
);
assert(
  sources.length === 147 &&
    sourceSpecs.length === 147 &&
    sourcesDocument.attemptedSourceCount === 147 &&
    sourcesDocument.capturedSourceCount === 147 &&
    sourcesDocument.failedCaptureCount === 0 &&
    fetchLog.sourceCount === 147 &&
    fetchLog.successCount === 147 &&
    fetchLog.failureCount === 0,
  "Expected 147 of 147 successful source captures.",
);
assert(
  rawLocks.sourceCount === 147 &&
    rawLocks.locks.length === 147 &&
    sourceById.size === 147 &&
    lockById.size === 147,
  "Source roster or evidence lock register is incomplete/duplicated.",
);
assert(
  production.perspective === "published" &&
    production.useCdn === false &&
    production.productionCounts.totalReleaseEvents === 2068 &&
    production.productionCounts.scopedReleaseEvents === 301 &&
    production.productionCounts.scopedPublicBetaEvents === 0 &&
    production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0 &&
    production.parentChecks.length === 75 &&
    production.parentChecks.every((item) => item.exists),
  "Fresh production reconciliation no longer matches the frozen absence proof.",
);

const completeLocator = (assignment) =>
  Boolean(
    assignment?.locators?.platform &&
      assignment.locators.version &&
      assignment.locators.publicChannel &&
      assignment.locators.publicOrdinal,
  );
let readyExactGatePassCount = 0;
let conflictCandidateCount = 0;
for (const candidate of candidates) {
  const expected = expectedById.get(candidate.candidateId);
  assert(expected, `${candidate.candidateId} is outside research scope.`);
  if (!expected) continue;
  const identity = candidate.proposedIdentity;
  assert(
    candidate.platform === expected.platform &&
      candidate.platformId === expected.platformId &&
      candidate.version === expected.version &&
      candidate.releaseVersionId === expected.releaseVersionId,
    `${candidate.candidateId} parent identity drifted.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.label === expected.label &&
      identity.routeAlias === expected.routeAlias &&
      identity.sequence === expected.sequence &&
      identity.appearanceDate === expected.appearanceDate &&
      identity.isRevision === false &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} proposed identity drifted.`,
  );
  assert(
    candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.productionReconciliation.exactIdentityMatches === 0,
    `${candidate.candidateId} lacks confirmed-missing production reconciliation.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false &&
      candidate.review.required === true,
    `${candidate.candidateId} has unsafe flags or bypasses review.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      !Object.hasOwn(candidate, "build") &&
      !Object.hasOwn(candidate, "priorProposedStableEventId") &&
      !Object.hasOwn(candidate, "pairedDeveloperRoute"),
    `${candidate.candidateId} improperly includes build, stable-ID, or paired-developer material.`,
  );
  const expectedSourceIds = sourceIdsForCandidate(expected);
  const observedSourceIds = candidate.evidenceRefs.map(
    (ref) => ref.sourceId,
  );
  assert(
    JSON.stringify(observedSourceIds) === JSON.stringify(expectedSourceIds),
    `${candidate.candidateId} evidence refs drifted.`,
  );
  const completeSources = expectedSourceIds
    .map((sourceId) => sourceById.get(sourceId))
    .filter(Boolean)
    .filter((source) =>
      completeLocator(
        source.evidence.candidateClaimAssignments.find(
          (claim) => claim.candidateId === candidate.candidateId,
        ),
      ),
    );
  const completeFamilies = new Set(
    completeSources.map((source) => source.lineage.publisherFamily),
  );
  if (candidate.candidateStatus === "readyForChronologyReview") {
    assert(
      candidate.ordinalBasis === "explicit" &&
        candidate.identityStatus === "confirmed" &&
        candidate.evidenceState === "corroborated",
      `${candidate.candidateId} has malformed ready evidence state.`,
    );
    assert(
      completeFamilies.size >= 2,
      `${candidate.candidateId} lacks two exact selected-evidence publisher lineages.`,
    );
    if (completeFamilies.size >= 2) readyExactGatePassCount += 1;
  } else {
    conflictCandidateCount += 1;
    assert(
      candidate.platform === "iPadOS" &&
        candidate.version === "16.1" &&
        candidate.ordinalBasis === "conflicted" &&
        candidate.identityStatus === "conflict" &&
        candidate.blockers.length >= 2,
      `${candidate.candidateId} is not a properly isolated iPadOS 16.1 conflict.`,
    );
  }
  const productionCheck = productionById.get(candidate.candidateId);
  assert(
    productionCheck?.routeIdentityMatchCount === 0 &&
      productionCheck?.fullCandidateMatchCount === 0,
    `${candidate.candidateId} production absence proof drifted.`,
  );
}
checks.selectedEvidenceGate = {
  readyCandidateCount: 153,
  readyCandidatePassCount: readyExactGatePassCount,
  explicitlyBlockedConflictCount: conflictCandidateCount,
  pairedPlatformInferenceCount: 0,
  developerOrdinalInferenceCount: 0,
};
assert(
  readyExactGatePassCount === 153 && conflictCandidateCount === 6,
  "Selected-evidence gate did not produce 153 pass / six explicit conflicts.",
);

for (const source of sources) {
  const lock = lockById.get(source.sourceId);
  assert(lock, `Missing evidence lock for ${source.sourceId}.`);
  if (!lock) continue;
  const [raw, selected] = await Promise.all([
    readFile(path.join(repoRoot, lock.rawPath)),
    readFile(path.join(repoRoot, lock.selectedPath)),
  ]);
  assert(
    raw.byteLength === lock.rawBytes &&
      sha256(raw) === lock.rawSha256 &&
      selected.byteLength === lock.selectedBytes &&
      sha256(selected) === lock.selectedSha256,
    `Evidence drift for ${source.sourceId}.`,
  );
}
assert(
  notProposed.records.every(
    (item) =>
      item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false &&
      item.sourceIds.length >= 1 &&
      item.sourceIds.every((sourceId) => sourceById.has(sourceId)),
  ),
  "A not-proposed record is unsafe or references unknown evidence.",
);
assert(
  assignment.safety.sanityMutationAllowed === false &&
    assignment.safety.stableEventIdsCreated === 0 &&
    assignment.safety.pageBuildsPerformed === 0 &&
    assignment.safety.publicationAuthorized === false &&
    assignment.safety.deploymentPerformed === false &&
    production.safety.sanityMutationPerformed === false,
  "Safety contract was violated.",
);
assert(
  selfReview.checks.independentReviewPerformed === false &&
    !(await exists(path.join(here, "independent-review.json"))),
  "This researcher must not author an independent-review artifact.",
);
assert(
  report.includes("153") &&
    report.includes("six") &&
    report.includes("147") &&
    report.includes("2068") &&
    report.includes("no Sanity document"),
  "Report omits a required outcome or safety disclosure.",
);

warnings.push(
  "Six iPadOS 16.1 observations are intentionally blocked conflicts; they are not part of the 153-candidate exact-evidence pass set.",
);
warnings.push(
  "The 34 no-positive coverage rows are reversible non-proposals, not proof that public testing was impossible.",
);

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  status: errors.length === 0 ? "passed" : "failed",
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings,
  checks,
  hashes: {
    assignmentSha256: sha256(
      await readFile(path.join(here, "assignment.json")),
    ),
    candidatesSha256: sha256(
      await readFile(path.join(here, "candidates.json")),
    ),
    sourcesSha256: sha256(
      await readFile(path.join(here, "sources.json")),
    ),
    productionSnapshotSha256: sha256(
      await readFile(path.join(here, "production-snapshot.json")),
    ),
    rawEvidenceLocksSha256: sha256(
      await readFile(path.join(here, "raw-evidence-locks.json")),
    ),
  },
  safety: {
    independentReviewComplete: false,
    chronologyApprovalGranted: false,
    sanityMutationAllowed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationAuthorized: false,
    deploymentPerformed: false,
  },
};
await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);
console.log(
  JSON.stringify(
    {
      status: validation.status,
      errorCount: validation.errorCount,
      warningCount: validation.warningCount,
      counts: checks.counts,
      selectedEvidenceGate: checks.selectedEvidenceGate,
      production: checks.production,
      hashes: validation.hashes,
    },
    null,
    2,
  ),
);
if (errors.length > 0) process.exit(1);
