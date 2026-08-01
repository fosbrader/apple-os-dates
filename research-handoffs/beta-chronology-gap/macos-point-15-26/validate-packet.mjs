import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  batchId,
  candidates as researchedCandidates,
  conflicts,
  cycles,
  evidenceRoot,
  negativeFindings,
  packetPath,
  targetVersionIds,
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
const lockById = new Map(
  rawLocks.locks.map((item) => [item.sourceId, item]),
);
const expectedById = new Map(
  researchedCandidates.map((item) => [item.candidateId, item]),
);
const productionById = new Map(
  production.exactChecks.map((item) => [item.candidateId, item]),
);

checks.candidateCount = candidates.length;
checks.candidateCountByVersion = countBy(
  candidates,
  (item) => item.version,
);
checks.datedNotProposedCount = notProposed.length;
checks.undatedNegativeFindingCount = negativeFindings.filter(
  (item) => item.appearanceDate === null,
).length;
checks.sourceCapture = {
  attempted: sourcesDocument.attemptedSourceCount,
  captured: sources.length,
  reused: sourcesDocument.reusedSourceCount,
  fresh: sourcesDocument.freshSourceCount,
  failed: sourcesDocument.failedCaptureCount,
};
const rawDirectoryEntries = await readdir(
  path.join(repoRoot, evidenceRoot, "raw"),
  {withFileTypes: true},
);
checks.freezeContract = {
  expectedMaterialFileCount: 87,
  rawSourceFileCount: rawDirectoryEntries.filter((item) =>
    item.isFile(),
  ).length,
  rawEvidenceLockCount: rawLocks.locks.length,
  pendingIndependentReviewExcluded: true,
  packetLockSelfExcluded: true,
  unlockedResearchBuilderCount: 0,
};
checks.conflictCount = conflictsDocument.conflictCount;
checks.production = {
  capturedAt: production.capturedAt,
  perspective: production.perspective,
  useCdn: production.useCdn,
  exactIdentityCount: production.expectedIdentityCount,
  exactRouteMatches: production.productionCounts.exactRouteMatches,
  exactFullMatches: production.productionCounts.exactFullMatches,
  scopedPublicBetaEvents:
    production.productionCounts.scopedPublicBetaEvents,
};

assert(
  candidates.length === 40 &&
    candidateRegister.summary.proposedCandidateCount === 40 &&
    assignment.candidateCount === 40,
  "Expected exactly 40 proposed candidates.",
);
assert(
  sameJson(checks.candidateCountByVersion, {
    "15.1": 4,
    "15.2": 3,
    "15.3": 3,
    "15.4": 4,
    "15.5": 3,
    "15.6": 1,
    "26.1": 4,
    "26.2": 3,
    "26.3": 3,
    "26.4": 4,
    "26.5": 3,
    "26.6": 5,
  }),
  "Candidate counts by version drifted.",
);
assert(
  notProposed.length === 3 &&
    candidateRegister.summary.notProposedCount === 3,
  "Expected three dated not-proposed records.",
);
assert(
  negativeFindings.length === 5 &&
    fullSequenceAudit.undatedNegativeFindings.length === 2,
  "Expected five total negative findings, two intentionally undated.",
);
assert(
  sources.length === 65 &&
    sourceSpecs.length === 65 &&
    sourcesDocument.attemptedSourceCount === 65 &&
    sourcesDocument.failedCaptureCount === 0 &&
    fetchLog.failureCount === 0,
  "Expected 65 of 65 successful source captures.",
);
assert(
  rawLocks.sourceCount === 65 &&
    rawLocks.locks.length === 65 &&
    lockById.size === 65,
  "Raw evidence locks are incomplete or duplicated.",
);
assert(
  checks.freezeContract.expectedMaterialFileCount === 87 &&
    checks.freezeContract.rawSourceFileCount === 65 &&
    checks.freezeContract.rawEvidenceLockCount === 65 &&
    checks.freezeContract.pendingIndependentReviewExcluded === true &&
    checks.freezeContract.packetLockSelfExcluded === true &&
    checks.freezeContract.unlockedResearchBuilderCount === 0,
  "Freeze-contract counts or exclusions drifted.",
);
assert(
  conflictsDocument.conflictCount === 9 &&
    conflictsDocument.conflicts.length === 9 &&
    sameJson(
      conflictsDocument.conflicts.map((item) => item.conflictId),
      conflicts.map((item) => item.conflictId),
    ),
  "Conflict roster drifted from the nine researched conflicts.",
);
assert(
  fullSequenceAudit.cycleCount === 12 &&
    fullSequenceAudit.cycles.length === 12 &&
    fullSequenceAudit.proposedAppearanceCount === 40,
  "Full-sequence audit does not cover all 12 cycles and 40 appearances.",
);

assert(
  new Set(candidates.map((item) => item.candidateId)).size === 40,
  "Candidate IDs are not unique.",
);
assert(
  new Set(
    candidates.map(
      (item) =>
        `${item.releaseVersionId}:${item.proposedIdentity.channel}:${item.proposedIdentity.routeAlias}`,
    ),
  ).size === 40,
  "Candidate route identities are not unique.",
);
for (const candidate of candidates) {
  const expected = expectedById.get(candidate.candidateId);
  assert(expected, `${candidate.candidateId} is outside research scope.`);
  if (!expected) continue;
  const identity = candidate.proposedIdentity;
  assert(
    candidate.platform === "macOS" &&
      candidate.platformId === "platform-macos" &&
      candidate.version === expected.version &&
      candidate.releaseVersionId === expected.releaseVersionId,
    `${candidate.candidateId} has malformed parent identity.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.routeAlias === expected.routeAlias &&
      identity.label === expected.label &&
      identity.sequence === expected.sequence &&
      identity.appearanceDate === expected.appearanceDate &&
      identity.isRevision === false &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has malformed proposed identity.`,
  );
  assert(
    candidate.ordinalBasis === "explicit" &&
      candidate.candidateStatus === "needsEvidenceReview" &&
      candidate.identityStatus === expected.identityStatus &&
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
  const families = new Set(
    candidate.evidenceRefs
      .map((ref) => sourceById.get(ref.sourceId))
      .filter((source) => source?.lineage.independentForCorroboration)
      .map((source) => source.lineage.publisherFamily),
  );
  assert(
    families.size >= 2,
    `${candidate.candidateId} has only ${families.size} publisher lineage(s).`,
  );
  const productionCheck = productionById.get(candidate.candidateId);
  assert(
    productionCheck?.routeIdentityMatchCount === 0 &&
      productionCheck?.fullCandidateMatchCount === 0,
    `${candidate.candidateId} no longer has exact production absence proof.`,
  );
}

const datedNegativeIds = new Set(
  negativeFindings
    .filter((item) => item.appearanceDate !== null)
    .map((item) => item.recordId),
);
assert(
  new Set(notProposed.map((item) => item.recordId)).size === 3 &&
    notProposed.every((item) => datedNegativeIds.has(item.recordId)),
  "Dated not-proposed record set drifted.",
);
for (const item of notProposed) {
  assert(
    item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false,
    `${item.recordId} has unsafe flags.`,
  );
  assert(
    item.evidenceRefs.every((ref) => sourceById.has(ref.sourceId)),
    `${item.recordId} references unknown source evidence.`,
  );
}
assert(
  !notProposed.some(
    (item) =>
      item.recordId ===
        "not-proposed:apple:macos:15.6:public-beta-1" ||
      item.recordId ===
        "not-proposed:apple:macos:15.6:public-beta-2",
  ),
  "Undated macOS 15.6 findings were incorrectly assigned schema identities.",
);

assert(
  production.perspective === "published" &&
    production.useCdn === false &&
    production.expectedIdentityCount === 40 &&
    production.exactChecks.length === 40 &&
    production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0 &&
    production.productionCounts.scopedPublicBetaEvents === 0,
  "Production reconciliation is stale, incomplete, or contains a match.",
);
assert(
  production.parentChecks.length === 12 &&
    production.parentChecks.every((item) => item.exists) &&
    sameJson(
      production.parentChecks.map((item) => item.releaseVersionId),
      targetVersionIds,
    ),
  "Exact parent reconciliation failed.",
);
assert(
  identitiesDocument.identityCount === 40 &&
    identitiesDocument.identities.length === 40 &&
    sameJson(
      identitiesDocument.identities.map((item) => item.candidateId),
      researchedCandidates.map((item) => item.candidateId),
    ),
  "Production-query identity input drifted.",
);

const sourceSpecIds = new Set(sourceSpecs.map((item) => item.sourceId));
assert(
  new Set(sources.map((item) => item.sourceId)).size === 65 &&
    sources.every((item) => sourceSpecIds.has(item.sourceId)),
  "Packet source roster differs from source specifications.",
);
for (const source of sources) {
  const lock = lockById.get(source.sourceId);
  assert(lock, `${source.sourceId} has no raw evidence lock.`);
  try {
    const rawPath = path.join(repoRoot, source.evidence.rawPath);
    const raw = await readFile(rawPath);
    const rawStat = await stat(rawPath);
    assert(
      raw.byteLength === source.evidence.rawBytes &&
        rawStat.size === source.evidence.rawBytes &&
        sha256(raw) === source.evidence.rawSha256 &&
        lock?.rawSha256 === source.evidence.rawSha256 &&
        lock?.rawBytes === source.evidence.rawBytes,
      `${source.sourceId} raw evidence hash or byte count drifted.`,
    );
    assert(
      sha256(source.evidence.selectedText.text) ===
        source.evidence.selectedText.sha256 &&
        source.evidence.selectedText.wordCount <= 20,
      `${source.sourceId} bounded source identification drifted.`,
    );
  } catch (error) {
    errors.push(
      `${source.sourceId} raw evidence could not be verified: ${error instanceof Error ? error.message : String(error)}.`,
    );
  }
}

for (const conflict of conflictsDocument.conflicts) {
  assert(
    conflict.sourceIds.every((sourceId) => sourceById.has(sourceId)),
    `${conflict.conflictId} references unknown source evidence.`,
  );
}
for (const cycle of fullSequenceAudit.cycles) {
  assert(
    cycle.parentExists === true &&
      cycle.releaseVersionId ===
        `version-macos-${cycle.version.replaceAll(".", "-")}`,
    `${cycle.version} full-cycle parent coverage failed.`,
  );
  const expectedCycle = cycles.find(
    (item) => item.version === cycle.version,
  );
  assert(
    expectedCycle &&
      cycle.displayedPublicAppearances.length ===
        expectedCycle.appearances.length,
    `${cycle.version} public sequence coverage drifted.`,
  );
}

assert(
  assignment.safety.sanityMutationAllowed === false &&
    assignment.safety.publicationAuthorized === false &&
    candidateRegister.safety.sanityMutationAllowed === false &&
    candidateRegister.safety.publicationAuthorized === false &&
    selfReview.independentOfResearcher === false &&
    independentReview.status === "pending" &&
    independentReview.reviewer === null,
  "Research/review safety state is incorrect.",
);
assert(
  report.includes("40 displayed macOS public-beta appearances") &&
    report.includes("zero") &&
    report.includes("independent chronology review pending") &&
    report.includes("date not established") &&
    report.includes("87 material files") &&
    report.includes("65 raw source captures") &&
    report.includes("There is no unlocked research builder"),
  "Reader-facing report is missing a required outcome or guardrail.",
);

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator: `${packetPath}/validate-packet.mjs`,
  status: errors.length === 0 ? "passed" : "failed",
  errorCount: errors.length,
  warningCount: warnings.length,
  checks,
  errors,
  warnings,
  authorization: {
    independentChronologyReviewComplete: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    pageWorkAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};
await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);
console.log(JSON.stringify(validation, null, 2));
if (errors.length > 0) process.exit(1);
