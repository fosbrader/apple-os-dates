import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allAppearances,
  applicability as expectedApplicability,
  batchId,
  blockedAppearances,
  conflicts as expectedConflicts,
  cycles,
  evidenceRoot,
  negativeFindings as expectedNegativeFindings,
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
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const readJson = async (filename) =>
  JSON.parse(await readFile(path.join(here, filename), "utf8"));
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
  scopedCoverage,
  sourcesDocument,
  rawLocks,
  queryLog,
  applicability,
  negatives,
  conflicts,
  production,
  register,
  selfReview,
  reviewStatus,
  schema,
  fetchLog,
  report,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("scoped-coverage-snapshot.json"),
  readJson("sources.json"),
  readJson("raw-evidence-locks.json"),
  readJson("source-query-log.json"),
  readJson("applicability-audit.json"),
  readJson("negative-findings.json"),
  readJson("conflicts.json"),
  readJson("production-snapshot.json"),
  readJson("candidates.json"),
  readJson("self-review.json"),
  readJson("review-status.json"),
  readFile(
    path.join(here, "../proposed-event-candidate.schema.json"),
    "utf8",
  ).then(JSON.parse),
  readFile(
    path.join(repoRoot, evidenceRoot, "fetch-log.json"),
    "utf8",
  ).then(JSON.parse),
  readFile(path.join(here, "report.md"), "utf8"),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["scoped-coverage-snapshot.json", scopedCoverage],
  ["sources.json", sourcesDocument],
  ["raw-evidence-locks.json", rawLocks],
  ["source-query-log.json", queryLog],
  ["applicability-audit.json", applicability],
  ["negative-findings.json", negatives],
  ["conflicts.json", conflicts],
  ["production-snapshot.json", production],
  ["self-review.json", selfReview],
  ["review-status.json", reviewStatus],
  ["fetch-log.json", fetchLog],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}

checks.scope = {
  targetParentCount: targetVersions.length,
  assignmentParentCount: assignment.parentCount,
  coverageRowCount: scopedCoverage.rowCount,
  productionParentChecks: production.parentChecks.length,
};
assert(
  targetVersions.length === 32 &&
    assignment.parentCount === 32 &&
    scopedCoverage.rowCount === 32 &&
    scopedCoverage.rows.length === 32,
  "Expected exactly 32 packet-local tvOS parent rows.",
);
assert(
  JSON.stringify(assignment.targetVersions) === JSON.stringify(targetVersions) &&
    JSON.stringify(assignment.targetVersionIds) ===
      JSON.stringify(targetVersionIds) &&
    JSON.stringify(scopedCoverage.rows.map(({version}) => version)) ===
      JSON.stringify(targetVersions),
  "Exact parent scope or order drifted.",
);
assert(
  scopedCoverage.rows.every(
    (row, index) =>
      row.platform === "tvOS" &&
      row.platformId === "platform-tvos" &&
      row.releaseVersionId === targetVersionIds[index] &&
      row.auditStage === "initialApplicabilityAndSequenceAudit" &&
      row.caution.includes("not proof"),
  ),
  "One or more scoped rows lost identity or audit-caution fields.",
);
const coverageBytes = await readFile(
  path.join(repoRoot, scopedCoverage.source.path),
);
checks.coverage = {
  sourceBytes: coverageBytes.byteLength,
  sourceSha256: sha256(coverageBytes),
  expectedBytes: scopedCoverage.source.bytes,
  expectedSha256: scopedCoverage.source.sha256,
};
assert(
  coverageBytes.byteLength === scopedCoverage.source.bytes &&
    sha256(coverageBytes) === scopedCoverage.source.sha256,
  "Packet-local coverage capture does not match its recorded source hash.",
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
};
assert(
  production.perspective === "published" && production.useCdn === false,
  "Production snapshot must use published perspective and useCdn:false.",
);
assert(
  production.parentChecks.length === 32 &&
    production.parentChecks.every(({exists}) => exists) &&
    JSON.stringify(production.targetVersionIds) ===
      JSON.stringify(targetVersionIds),
  "All 32 exact production parents must exist.",
);
assert(
  production.observedAppearanceCount === allAppearances.length &&
    production.exactChecks.length === allAppearances.length &&
    production.productionCounts.scopedPublicBetaEvents === 0 &&
    production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0 &&
    production.exactChecks.every(
      ({routeIdentityMatchCount, fullCandidateMatchCount}) =>
        routeIdentityMatchCount === 0 && fullCandidateMatchCount === 0,
    ),
  "Researched public identities must remain absent from production.",
);
assert(
  production.safety.queryOnly === true &&
    production.safety.sanityMutationPerformed === false &&
    production.safety.stableEventIdsCreated === 0 &&
    production.safety.pageBuildsPerformed === 0 &&
    production.safety.publicationPerformed === false &&
    production.safety.deploymentPerformed === false,
  "Production safety flags are not closed.",
);

checks.sources = {
  specs: sourceSpecs.length,
  ledger: sourcesDocument.sources.length,
  rawLocks: rawLocks.locks.length,
  fetchSuccesses: fetchLog.successCount,
  fetchFailures: fetchLog.failureCount,
};
assert(
  sourcesDocument.sources.length === sourceSpecs.length &&
    rawLocks.locks.length === sourceSpecs.length &&
    fetchLog.sourceCount === sourceSpecs.length &&
    fetchLog.successCount === sourceSpecs.length &&
    fetchLog.failureCount === 0,
  "Frozen source capture set is incomplete.",
);
const sourceById = new Map(
  sourcesDocument.sources.map((source) => [source.sourceId, source]),
);
const sourceSpecById = new Map(
  sourceSpecs.map((source) => [source.sourceId, source]),
);
const rawLockById = new Map(
  rawLocks.locks.map((lock) => [lock.sourceId, lock]),
);
for (const spec of sourceSpecs) {
  const source = sourceById.get(spec.sourceId);
  const lock = rawLockById.get(spec.sourceId);
  assert(Boolean(source && lock), `Missing source/lock for ${spec.sourceId}.`);
  if (!source || !lock) continue;
  const [rawBytes, selectedBytes] = await Promise.all([
    readFile(path.join(repoRoot, lock.rawPath)),
    readFile(path.join(repoRoot, lock.selectedPath)),
  ]);
  assert(
    rawBytes.byteLength === lock.rawBytes &&
      sha256(rawBytes) === lock.rawSha256 &&
      selectedBytes.byteLength === lock.selectedBytes &&
      sha256(selectedBytes) === lock.selectedSha256,
    `Evidence hash mismatch for ${spec.sourceId}.`,
  );
  assert(
    source.evidence.rawSha256 === lock.rawSha256 &&
      source.evidence.selectedSha256 === lock.selectedSha256 &&
      source.publisherFamily === spec.publisher,
    `Ledger/lock/lineage mismatch for ${spec.sourceId}.`,
  );
  const selected = JSON.parse(selectedBytes.toString("utf8"));
  assert(
    selected.sourceId === spec.sourceId &&
      Array.isArray(selected.excerpts) &&
      selected.excerpts.length === source.evidence.excerptCount,
    `Selected evidence metadata is incomplete for ${spec.sourceId}.`,
  );
}

checks.chronology = {
  parentCount: cycles.length,
  exactAppearanceCount: allAppearances.length,
  supportableCount: supportableAppearances.length,
  blockedCount: blockedAppearances.length,
  negativeFindingCount: expectedNegativeFindings.length,
  conflictCount: expectedConflicts.length,
};
assert(
  cycles.length === 32 &&
    allAppearances.length === 116 &&
    supportableAppearances.length === 73 &&
    blockedAppearances.length === 43,
  "Expected 32 cycles partitioned into 73 supportable and 43 blocked exact appearances.",
);
assert(
  cycles.every(
    ({version, appearances}) =>
      appearances.length > 0 &&
      new Set(appearances.map(({sequence}) => sequence)).size ===
        appearances.length &&
      appearances.every(
        (item) =>
          item.version === version &&
          item.channel === "publicBeta" &&
          item.label === `Public Beta ${item.sequence}` &&
          item.routeAlias === `public-beta-${item.sequence}` &&
          /^\d{4}-\d{2}-\d{2}$/.test(item.appearanceDate) &&
          item.normalizedTimeZone === "America/Los_Angeles",
      ),
  ),
  "Cycle identities, ordinals, dates, or per-parent uniqueness drifted.",
);
for (const item of supportableAppearances) {
  const families = new Set(
    item.sourceIds.map((sourceId) => sourceSpecById.get(sourceId)?.publisher),
  );
  assert(
    families.size >= 2 && !families.has(undefined),
    `${item.candidateId} lacks two independent publisher families.`,
  );
  assert(
    item.blockers.length === 0,
    `${item.candidateId} is supportable but retains an evidence blocker.`,
  );
}
for (const item of blockedAppearances) {
  assert(
    item.blockers.length > 0,
    `${item.candidateId} is blocked without an explicit blocker.`,
  );
}
assert(
  applicability.parentCount === expectedApplicability.length &&
    applicability.rows.length === expectedApplicability.length &&
    applicability.exactAppearanceCount === allAppearances.length &&
    applicability.supportableAppearanceCount ===
      supportableAppearances.length &&
    applicability.blockedAppearanceCount === blockedAppearances.length,
  "Applicability audit counts drifted.",
);
assert(
  queryLog.queryLogCount === 32 &&
    queryLog.records.length === 32 &&
    queryLog.records.every(
      ({queries, inspectedSourceIds, evidentiaryEffect}) =>
        queries.length >= 4 &&
        inspectedSourceIds.length > 0 &&
        evidentiaryEffect.includes("not used"),
    ),
  "Query logs are incomplete or lost inference guardrails.",
);
assert(
  negatives.findingCount === expectedNegativeFindings.length &&
    negatives.findings.length === expectedNegativeFindings.length &&
    negatives.findings.every(
      ({findingId, sourceIds, finding, effect}) =>
        findingId &&
        sourceIds.length > 0 &&
        finding.length > 0 &&
        effect.length > 0 &&
        sourceIds.every((sourceId) => sourceById.has(sourceId)),
    ),
  "Negative/skipped ordinal findings are incomplete.",
);
assert(
  conflicts.conflictCount === expectedConflicts.length &&
    conflicts.conflicts.length === expectedConflicts.length &&
    conflicts.conflicts.every(
      ({conflictId, sourceIds, issue, resolution}) =>
        conflictId &&
        sourceIds.length >= 2 &&
        issue.length > 0 &&
        resolution.length > 0,
    ),
  "Conflict register is incomplete.",
);

const draft7Schema = JSON.parse(
  JSON.stringify(schema).replaceAll("#/$defs/", "#/definitions/"),
);
draft7Schema.$schema = "http://json-schema.org/draft-07/schema#";
draft7Schema.definitions = draft7Schema.$defs;
delete draft7Schema.$defs;
const ajv = new Ajv({allErrors: true, jsonPointers: true});
const schemaValidator = ajv.compile(draft7Schema);
checks.candidateSchemaValid = schemaValidator(register);
if (!checks.candidateSchemaValid) {
  for (const error of schemaValidator.errors ?? []) {
    errors.push(`Candidate schema ${error.dataPath || "/"} ${error.message}.`);
  }
}
assert(
  register.candidates.length === supportableAppearances.length &&
    register.notProposed.length === blockedAppearances.length &&
    register.summary.proposedCandidateCount ===
      supportableAppearances.length &&
    register.summary.notProposedCount === blockedAppearances.length,
  "Candidate/not-proposed partition drifted.",
);
const candidateById = new Map(
  register.candidates.map((item) => [item.candidateId, item]),
);
for (const expected of supportableAppearances) {
  const item = candidateById.get(expected.candidateId);
  assert(Boolean(item), `Missing supportable candidate ${expected.candidateId}.`);
  if (!item) continue;
  assert(
    item.proposedIdentity.label === expected.label &&
      item.proposedIdentity.routeAlias === expected.routeAlias &&
      item.proposedIdentity.sequence === expected.sequence &&
      item.proposedIdentity.appearanceDate === expected.appearanceDate &&
      item.ordinalBasis === "explicit" &&
      item.identityStatus === "confirmed" &&
      item.evidenceState === "corroborated" &&
      item.productionReconciliation.status === "confirmedMissing" &&
      item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false,
    `${expected.candidateId} identity or safety fields drifted.`,
  );
  const families = new Set(
    item.evidenceRefs.map(
      ({sourceId}) => sourceSpecById.get(sourceId)?.publisher,
    ),
  );
  assert(
    families.size >= 2 && !families.has(undefined),
    `${expected.candidateId} candidate record lacks two lineages.`,
  );
}
const notProposedById = new Map(
  register.notProposed.map((item) => [item.recordId, item]),
);
for (const expected of blockedAppearances) {
  const recordId =
    `not-proposed:apple:tvos:${expected.version}:public-beta-${expected.sequence}`;
  const item = notProposedById.get(recordId);
  assert(Boolean(item), `Missing blocked record ${recordId}.`);
  if (!item) continue;
  assert(
    item.classification === "publicDistributionNotEstablished" &&
      item.reason.length > 0 &&
      item.reversalEvidence.length > 0 &&
      item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false,
    `${recordId} lost its reversible blocked disposition.`,
  );
}

assert(
  selfReview.result.includes("passed") &&
    selfReview.checks.independentReviewAuthoredByResearcher === false &&
    selfReview.checks.sharedAggregatesUntouched === true &&
    selfReview.checks.mutationPerformed === false &&
    selfReview.checks.stableEventIdsCreated === 0 &&
    selfReview.checks.pageBuildsPerformed === 0 &&
    selfReview.checks.publicationPerformed === false &&
    selfReview.checks.deploymentPerformed === false,
  "Self-review safety checks are incomplete.",
);
assert(
  reviewStatus.status === "pendingIndependentReview" &&
    reviewStatus.researcherAuthoredIndependentReview === false &&
    reviewStatus.safety.chronologyApprovalGranted === false,
  "Pending independent-review marker is missing or unsafe.",
);
assert(
  !(await exists(path.join(here, "independent-review.json"))),
  "Researcher packet must not contain independent-review.json.",
);
for (const phrase of [
  "116 exact publisher-displayed appearances",
  "73 supportable candidates",
  "43 exact appearances remain blocked",
  "15 explicit skipped/unqualified-ordinal findings",
  "separate reviewer",
]) {
  assert(report.includes(phrase), `report.md is missing '${phrase}'.`);
}

const validatedAt = new Date().toISOString();
if (errors.length === 0) {
  register.validationStatus = {
    status: "passed",
    validatedAt,
    validator:
      "research-handoffs/beta-chronology-gap/tvos-point-11-26/validate-packet.mjs",
    summaryPath:
      "research-handoffs/beta-chronology-gap/tvos-point-11-26/validation.json",
  };
  const postUpdateValid = schemaValidator(register);
  if (!postUpdateValid) {
    for (const error of schemaValidator.errors ?? []) {
      errors.push(
        `Post-update candidate schema ${error.dataPath || "/"} ${error.message}.`,
      );
    }
  } else {
    await writeFile(
      path.join(here, "candidates.json"),
      `${JSON.stringify(register, null, 2)}\n`,
    );
  }
}
const status = errors.length === 0 ? "passed" : "failed";
const validation = {
  formatVersion: 1,
  batchId,
  validatedAt,
  status,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings,
  checks,
  independentReview: {
    required: true,
    complete: false,
    authoredByThisResearcher: false,
    requiredPath:
      "research-handoffs/beta-chronology-gap/tvos-point-11-26/independent-review.json",
  },
  safety: {
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
console.log(JSON.stringify(validation, null, 2));
if (status !== "passed") process.exit(1);
