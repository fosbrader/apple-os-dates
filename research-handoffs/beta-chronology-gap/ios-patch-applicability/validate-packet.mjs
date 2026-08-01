import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {access, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  auditedNoPositiveButReversibleVersions,
  batchId,
  evidenceRoot,
  evidenceBackedNotApplicableVersions,
  notEstablishedVersions,
  observedPublicBetas,
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
const pacificDate = (value) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));

const [
  assignment,
  scopedCoverage,
  sourcesDocument,
  rawLocks,
  queryLog,
  applicability,
  conflicts,
  production,
  register,
  selfReview,
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
  readJson("conflicts.json"),
  readJson("production-snapshot.json"),
  readJson("candidates.json"),
  readJson("self-review.json"),
  readFile(
    path.join(
      here,
      "../proposed-event-candidate.schema.json",
    ),
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
  ["conflicts.json", conflicts],
  ["production-snapshot.json", production],
  ["self-review.json", selfReview],
  ["fetch-log.json", fetchLog],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}

const coverageBytes = await readFile(
  path.join(repoRoot, scopedCoverage.source.path),
);
checks.coverage = {
  rowCount: scopedCoverage.rowCount,
  sourceBytes: coverageBytes.byteLength,
  sourceSha256: sha256(coverageBytes),
  expectedSourceBytes: scopedCoverage.source.bytes,
  expectedSourceSha256: scopedCoverage.source.sha256,
};
assert(
  scopedCoverage.rowCount === 27 &&
    scopedCoverage.rows.length === 27 &&
    assignment.parentCount === 27,
  "Expected exactly 27 packet-local scoped coverage rows.",
);
assert(
  coverageBytes.byteLength === scopedCoverage.source.bytes &&
    sha256(coverageBytes) === scopedCoverage.source.sha256,
  "Shared source and packet-local coverage capture disagree at validation time.",
);
assert(
  JSON.stringify(scopedCoverage.rows.map((row) => row.version)) ===
    JSON.stringify(targetVersions),
  "Scoped coverage version order/identity drifted.",
);
assert(
  scopedCoverage.rows.every(
    (row, index) =>
      row.platform === "iOS" &&
      row.platformId === "platform-ios" &&
      row.releaseVersionId === targetVersionIds[index] &&
      row.auditStage === "initialApplicabilityAndSequenceAudit" &&
      row.caution.includes("not proof"),
  ),
  "One or more scoped coverage rows lost identity or caution fields.",
);

checks.production = {
  capturedAt: production.capturedAt,
  perspective: production.perspective,
  useCdn: production.useCdn,
  parentChecks: production.parentChecks.length,
  missingParents: production.parentChecks.filter((item) => !item.exists)
    .length,
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
  production.parentChecks.length === 27 &&
    production.parentChecks.every((item) => item.exists),
  "All 27 exact production parents must exist.",
);
assert(
  production.targetVersionIds.length === 27 &&
    JSON.stringify(production.targetVersionIds) ===
      JSON.stringify(targetVersionIds),
  "Production target scope drifted.",
);
assert(
  production.productionCounts.scopedPublicBetaEvents === 0 &&
    production.productionCounts.exactRouteMatches === 0 &&
    production.productionCounts.exactFullMatches === 0,
  "Proposed identities must remain absent from production.",
);
assert(
  production.exactChecks.length === 3 &&
    production.exactChecks.every(
      (item) =>
        item.routeIdentityMatchCount === 0 &&
        item.fullCandidateMatchCount === 0,
    ),
  "Expected three absent exact production checks.",
);
assert(
  production.safety.queryOnly === true &&
    production.safety.sanityMutationPerformed === false &&
    production.safety.stableEventIdsCreated === 0 &&
    production.safety.pageBuildsPerformed === 0 &&
    production.safety.publicationPerformed === false &&
    production.safety.deploymentPerformed === false,
  "Production snapshot safety flags are not closed.",
);

checks.sources = {
  specs: sourceSpecs.length,
  ledger: sourcesDocument.sources.length,
  rawLocks: rawLocks.locks.length,
  fetchSuccesses: fetchLog.successCount,
  fetchFailures: fetchLog.failureCount,
};
assert(
  sourceSpecs.length === 21 &&
    sourcesDocument.sources.length === 21 &&
    rawLocks.locks.length === 21 &&
    fetchLog.sourceCount === 21 &&
    fetchLog.successCount === 21 &&
    fetchLog.failureCount === 0,
  "Expected 21 complete frozen source captures.",
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
      source.evidence.selectedSha256 === lock.selectedSha256,
    `Ledger/lock mismatch for ${spec.sourceId}.`,
  );
  const selected = JSON.parse(selectedBytes.toString("utf8"));
  assert(
    selected.sourceId === spec.sourceId &&
      selected.locators.length === spec.requiredNeedles.length &&
      spec.requiredNeedles.every((needle) =>
        selected.locators.some(
          (locator) =>
            locator.needle === needle &&
            locator.firstCharacterOffset >= 0 &&
            locator.occurrenceCount >= 1 &&
            locator.context
              .toLocaleLowerCase("en-US")
              .includes(needle.toLocaleLowerCase("en-US")),
        ),
      ),
    `Selected locators are incomplete for ${spec.sourceId}.`,
  );
}

checks.queryLog = {
  recordCount: queryLog.records.length,
  reversibleNoPositiveRecords: queryLog.records.filter(
    (item) =>
      item.outcome === "noPositiveExactPublicIdentityLocatedInScopedSearch",
  ).length,
};
assert(
  queryLog.queryLogCount === 27 && queryLog.records.length === 27,
  "Expected one query-log record for each scoped parent.",
);
assert(
  queryLog.guardrail.includes("not proof of absence") &&
    queryLog.records.every(
      (item) =>
        item.queries.length >= 3 &&
        item.stableBoundarySourceId &&
        item.evidentiaryEffect,
    ),
  "Source-query logs are missing reproducibility or absence guardrails.",
);

checks.applicability = {
  parentCount: applicability.parentCount,
  classificationCounts: applicability.classificationCounts,
};
assert(
  applicability.parentCount === 27 &&
    applicability.rows.length === 27 &&
    applicability.classificationCounts.positiveCandidatesEstablished === 1 &&
    applicability.classificationCounts.evidenceBackedNotApplicable === 1 &&
    applicability.classificationCounts.notEstablished === 1 &&
    applicability.classificationCounts.auditedNoPositiveButReversible === 24,
  "Applicability partition must be 1 positive, 1 not-applicable, 1 not-established, and 24 reversible.",
);
assert(
  applicability.rows.find((item) => item.version === "13.3.1")
    ?.candidateIds.length === 3 &&
    applicability.rows.find((item) => item.version === "14.8")
      ?.classification === "evidenceBackedNotApplicable" &&
    applicability.rows.find((item) => item.version === "8.4.1")
      ?.classification === "notEstablished",
  "Key applicability dispositions drifted.",
);
assert(
  JSON.stringify(
    applicability.rows
      .filter(
        (item) =>
          item.classification === "auditedNoPositiveButReversible",
      )
      .map((item) => item.version),
  ) === JSON.stringify(auditedNoPositiveButReversibleVersions),
  "Reversible applicability version set drifted.",
);
assert(
  evidenceBackedNotApplicableVersions.length === 1 &&
    notEstablishedVersions.length === 1,
  "Static applicability exception sets drifted.",
);

checks.conflicts = {
  conflictCount: conflicts.conflictCount,
  blockedVersions: conflicts.blockedVersions,
};
assert(
  conflicts.conflictCount === 2 &&
    conflicts.conflicts.length === 2 &&
    conflicts.blockedVersions.length === 1 &&
    conflicts.blockedVersions[0] === "8.4.1" &&
    conflicts.resolution.includes("notEstablished"),
  "Expected two preserved iOS 8.4.1 conflicts.",
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
  register.candidates.length === 3 &&
    register.summary.proposedCandidateCount === 3 &&
    register.summary.byStatus.readyForChronologyReview === 3 &&
    register.summary.byPlatform.iOS === 3,
  "Expected exactly three iOS candidates.",
);
assert(
  register.candidates.every(
    (candidate, index) =>
      candidate.candidateId === observedPublicBetas[index].candidateId &&
      candidate.proposedIdentity.label === observedPublicBetas[index].label &&
      candidate.proposedIdentity.routeAlias ===
        observedPublicBetas[index].routeAlias &&
      candidate.proposedIdentity.sequence ===
        observedPublicBetas[index].sequence &&
      candidate.proposedIdentity.appearanceDate ===
        observedPublicBetas[index].appearanceDate &&
      candidate.ordinalBasis === "explicit" &&
      candidate.identityStatus === "confirmed" &&
      candidate.evidenceState === "corroborated" &&
      candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.evidenceRefs.length === 2 &&
      candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
  ),
  "Candidate identity, evidence, or safety gate drifted.",
);
for (const candidate of register.candidates) {
  const families = new Set(
    candidate.evidenceRefs.map(
      (ref) => sourceSpecById.get(ref.sourceId)?.publisherFamily,
    ),
  );
  assert(
    families.size === 2 && !families.has(undefined),
    `${candidate.candidateId} lacks two independent publisher families.`,
  );
}
const candidateSources = {
  "candidate:apple:ios:13.3.1:public-beta-1": [
    "bgr-ios-13-3-1-pb1",
    "cultofmac-ios-13-3-1-pb1",
  ],
  "candidate:apple:ios:13.3.1:public-beta-2": [
    "9to5mac-ios-13-3-1-pb2",
    "forbes-ios-13-3-1-pb2",
  ],
  "candidate:apple:ios:13.3.1:public-beta-3": [
    "9to5mac-ios-13-3-1-pb3",
    "kobonemi-ios-13-3-1-pb3",
  ],
};
for (const candidate of register.candidates) {
  for (const sourceId of candidateSources[candidate.candidateId]) {
    const selected = JSON.parse(
      await readFile(
        path.join(
          repoRoot,
          rawLockById.get(sourceId).selectedPath,
        ),
        "utf8",
      ),
    );
    assert(
      selected.publishedAt,
      `${sourceId} lacks retained publication metadata.`,
    );
    if (selected.publishedAt) {
      assert(
        pacificDate(selected.publishedAt) ===
          candidate.proposedIdentity.appearanceDate,
        `${sourceId} does not normalize to ${candidate.proposedIdentity.appearanceDate} in America/Los_Angeles.`,
      );
    }
  }
}

assert(
  selfReview.status === "passed" &&
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
  !(await exists(path.join(here, "independent-review.json"))),
  "Researcher packet must not contain independent-review.json.",
);
for (const phrase of [
  "Three proposed identities",
  "Evidence-backed not applicable",
  "Not established because evidence conflicts",
  "Audited with no positive identity located",
  "separate reviewer",
]) {
  assert(report.includes(phrase), `report.md is missing '${phrase}'.`);
}

const validatedAt = new Date().toISOString();
const status = errors.length === 0 ? "passed" : "failed";
if (status === "passed") {
  register.validationStatus = {
    status: "passed",
    validatedAt,
    validator:
      "research-handoffs/beta-chronology-gap/ios-patch-applicability/validate-packet.mjs",
    summaryPath:
      "research-handoffs/beta-chronology-gap/ios-patch-applicability/validation.json",
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
const finalStatus = errors.length === 0 ? "passed" : "failed";
const validation = {
  formatVersion: 1,
  batchId,
  validatedAt,
  status: finalStatus,
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
      "research-handoffs/beta-chronology-gap/ios-patch-applicability/independent-review.json",
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
if (finalStatus !== "passed") process.exit(1);

