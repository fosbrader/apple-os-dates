import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allObservedAppearances,
  batchId,
  candidates as expectedCandidates,
  evidenceRoot,
  modelGaps,
  negativeFindings,
  packetPath,
} from "./research-data.mjs";

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
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const readJson = async (filename) =>
  JSON.parse(await readFile(path.join(here, filename), "utf8"));
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
const sameJson = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);

const [
  assignment,
  sourcesDocument,
  candidateRegister,
  conflictsDocument,
  fullSequenceAudit,
  production,
  selfReview,
  independentReview,
  schema,
  report,
  fetchLog,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("sources.json"),
  readJson("candidates.json"),
  readJson("conflicts.json"),
  readJson("full-sequence-audit.json"),
  readJson("production-snapshot.json"),
  readJson("self-review.json"),
  readJson("independent-review.json"),
  readJson("../proposed-event-candidate.schema.json"),
  readFile(path.join(here, "report.md"), "utf8"),
  readFile(path.join(repoRoot, evidenceRoot, "fetch-log.json"), "utf8").then(
    JSON.parse,
  ),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["conflicts.json", conflictsDocument],
  ["full-sequence-audit.json", fullSequenceAudit],
  ["production-snapshot.json", production],
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
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const exactById = new Map(
  production.exactChecks.map((check) => [check.candidateId, check]),
);
const parentById = new Map(
  production.parentChecks.map((check) => [check.releaseVersionId, check]),
);
const expectedById = new Map(
  expectedCandidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const candidateById = new Map(
  candidates.map((candidate) => [candidate.candidateId, candidate]),
);

checks.counts = {
  observedAppearances: assignment.observedAppearanceCount,
  candidates: candidates.length,
  byPlatform: countBy(candidates, (candidate) => candidate.platform),
  exactExistingMatches: assignment.existingMatches.length,
  notProposed: notProposed.length,
  negativeFindings: assignment.negativeSequence.length,
  modelGaps: assignment.modelGaps.length,
  sources: sources.length,
  conflicts: conflictsDocument.conflicts.length,
};
assert(
  allObservedAppearances.length === 118 &&
    assignment.observedAppearanceCount === 118 &&
    assignment.positiveSequence.length === 118,
  "Expected exactly 118 modeled observed appearances.",
);
assert(
  expectedCandidates.length === 116 &&
    candidates.length === 116 &&
    candidateRegister.summary.proposedCandidateCount === 116,
  "Expected exactly 116 confirmed-missing candidates.",
);
assert(
  sameJson(countBy(candidates, (candidate) => candidate.platform), {
    iOS: 75,
    iPadOS: 41,
  }),
  "Expected 75 iOS and 41 iPadOS candidates.",
);
assert(
  candidateById.size === candidates.length &&
    expectedById.size === expectedCandidates.length,
  "Candidate IDs are not unique.",
);
assert(
  assignment.existingMatches.length === 2 &&
    production.productionCounts.exactFullMatches === 2,
  "Expected exactly two existing full matches.",
);
assert(
  sameJson(
    assignment.existingMatches.map((match) => match.candidateId).sort(),
    [
      "candidate:apple:ios:14.5:public-beta-3",
      "candidate:apple:ipados:14.5:public-beta-3",
    ],
  ),
  "Existing-match set drifted from the two 14.5 Public Beta 3 identities.",
);
assert(
  negativeFindings.length === 7 &&
    assignment.negativeSequence.length === 7,
  "Expected seven sequence-level negative findings.",
);
assert(
  notProposed.length === 7 &&
    candidateRegister.summary.notProposedCount === 7,
  "Expected seven schema-shaped not-proposed identity records.",
);
assert(
  modelGaps.length === 2 &&
    assignment.modelGaps.length === 2 &&
    fullSequenceAudit.establishedUnmodeledCycles.length === 2,
  "Expected exactly two iPadOS parent-model gaps.",
);
assert(
  sameJson(
    production.parentChecks
      .filter((check) => !check.exists)
      .map((check) => check.releaseVersionId)
      .sort(),
    ["version-ipados-14-7", "version-ipados-14-8"],
  ),
  "Production parent-model gap set drifted.",
);
assert(
  production.perspective === "published" &&
    production.useCdn === false,
  "Production snapshot must use published perspective and disable CDN.",
);
assert(
  production.productionCounts.totalReleaseEvents === 2068 &&
    production.productionCounts.scopedPublicBetaEvents === 2,
  "Production chronology counts drifted from the fresh snapshot.",
);

for (const expected of expectedCandidates) {
  const candidate = candidateById.get(expected.candidateId);
  assert(Boolean(candidate), `Missing candidate ${expected.candidateId}.`);
  if (!candidate) continue;
  assert(
    candidate.platform === expected.platform &&
      candidate.platformId === expected.platformId &&
      candidate.version === expected.version &&
      candidate.releaseVersionId === expected.releaseVersionId,
    `Candidate parent/platform fields drifted for ${expected.candidateId}.`,
  );
  assert(
    candidate.proposedIdentity.sequence === expected.sequence &&
      candidate.proposedIdentity.routeAlias === expected.routeAlias &&
      candidate.proposedIdentity.label === expected.label &&
      candidate.proposedIdentity.appearanceDate ===
        expected.appearanceDate,
    `Candidate identity drifted for ${expected.candidateId}.`,
  );
  const exact = exactById.get(expected.candidateId);
  assert(
    exact?.routeIdentityMatchCount === 0 &&
      exact?.fullCandidateMatchCount === 0,
    `Production no longer confirms ${expected.candidateId} as absent.`,
  );
  assert(
    parentById.get(expected.releaseVersionId)?.exists === true,
    `Parent releaseVersion missing for candidate ${expected.candidateId}.`,
  );
  const lineages = new Set();
  for (const ref of candidate.evidenceRefs) {
    const source = sourceById.get(ref.sourceId);
    assert(
      ref.kind === "packetSource" &&
        ref.packetPath === `${packetPath}/sources.json`,
      `Invalid evidence-ref scope for ${expected.candidateId}.`,
    );
    assert(
      Boolean(source),
      `Unknown source ${ref.sourceId} for ${expected.candidateId}.`,
    );
    if (source) lineages.add(source.lineage.publisherFamily);
  }
  assert(
    lineages.size >= 2,
    `${expected.candidateId} has fewer than two independent publisher families.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false &&
      candidate.review.required === true &&
      candidate.review.reviewer === null,
    `${expected.candidateId} is missing research-only safety/review flags.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      !Object.hasOwn(candidate, "build") &&
      !Object.hasOwn(candidate, "priorProposedStableEventId"),
    `${expected.candidateId} improperly proposes build or stable-ID data.`,
  );
}

const conflictCandidate =
  candidateById.get("candidate:apple:ios:12.4:public-beta-4");
assert(
  conflictCandidate?.identityStatus === "conflict" &&
    conflictCandidate?.proposedIdentity.appearanceDate === "2019-06-12",
  "iOS 12.4 Public Beta 4 must retain June 12 with conflict status.",
);

checks.sourceCapture = {
  attempted: sourcesDocument.attemptedSourceCount,
  captured: sources.length,
  reused: sourcesDocument.reusedSourceCount,
  sameDayLocal: sourcesDocument.sameDayLocalCaptureCount,
  archiveReplay: sourcesDocument.archiveReplayCount,
  freshHttp: sourcesDocument.freshHttpCaptureCount,
  failed: sourcesDocument.failedCaptureCount,
  publisherFamilies: new Set(
    sources.map((source) => source.lineage.publisherFamily),
  ).size,
};
assert(
  fetchLog.sourceCount === 122 &&
    fetchLog.successCount === 122 &&
    fetchLog.failureCount === 0 &&
    sources.length === 122 &&
    sourceById.size === 122,
  "Source capture must remain 122 attempted / 122 successful / 0 failed.",
);
assert(
  sourcesDocument.reusedSourceCount === 5 &&
    sourcesDocument.sameDayLocalCaptureCount === 20 &&
    sourcesDocument.archiveReplayCount === 4 &&
    sourcesDocument.freshHttpCaptureCount === 93,
  "Source capture-method totals drifted.",
);
for (const source of sources) {
  const absoluteRawPath = path.join(repoRoot, source.evidence.rawPath);
  const bytes = await readFile(absoluteRawPath);
  const details = await stat(absoluteRawPath);
  assert(
    details.size === source.evidence.rawBytes &&
      sha256(bytes) === source.evidence.rawSha256,
    `Raw evidence hash or byte count drifted for ${source.sourceId}.`,
  );
  assert(
    source.evidence.selectedText.wordCount <=
      source.evidence.selectedText.maxWords &&
      source.evidence.selectedText.maxWords === 20,
    `Bounded excerpt rule failed for ${source.sourceId}.`,
  );
  assert(
    source.lineage.independentForCorroboration === true,
    `Publisher lineage is not marked independent for ${source.sourceId}.`,
  );
}

assert(
  conflictsDocument.conflictCount === 13 &&
    conflictsDocument.conflicts.some(
      (conflict) =>
        conflict.conflictId === "ios-12-4-public-beta-4-date",
    ) &&
    conflictsDocument.conflicts.some(
      (conflict) =>
        conflict.conflictId === "ipados-14-7-parent-model-gap",
    ),
  "Conflict register count or required entries drifted.",
);
assert(
  fullSequenceAudit.summary.modeledObservedAppearanceCount === 118 &&
    fullSequenceAudit.summary.confirmedMissingCandidateCount === 116 &&
    fullSequenceAudit.summary.exactExistingMatchCount === 2 &&
    fullSequenceAudit.summary.establishedUnmodeledAppearanceCount === 4,
  "Full-sequence audit summary drifted.",
);
assert(
  fullSequenceAudit.modeledCycles.flatMap(
    (cycle) => cycle.appearances,
  ).length === 118,
  "Full-sequence audit does not enumerate all modeled appearances.",
);
assert(
  assignment.constraints.sanityMutationAllowed === false &&
    assignment.constraints.stableEventIdCreationAllowed === false &&
    assignment.constraints.publicationAuthorized === false &&
    candidateRegister.safety.sanityMutationAllowed === false &&
    candidateRegister.safety.stableEventIdCreationAllowed === false &&
    candidateRegister.safety.publicationAuthorized === false,
  "Research-only safety constraints are incomplete.",
);
assert(
  selfReview.status === "passedResearcherSelfCheck" &&
    independentReview.status === "pending" &&
    independentReview.reviewer === null &&
    independentReview.reviewedAt === null,
  "Independent review must remain explicitly pending.",
);
assert(
  report.includes("116") &&
    report.includes("75") &&
    report.includes("41") &&
    report.includes("No Sanity mutation"),
  "Reader report is missing required counts or safety language.",
);

checks.packetLocks = {status: "notCheckedUntilFreeze"};
try {
  const locks = await readJson("packet-locks.json");
  const lockByPath = new Map(
    locks.files.map((entry) => [entry.path, entry]),
  );
  let verified = 0;
  for (const entry of locks.files) {
    if (entry.path.endsWith("/packet-locks.json")) continue;
    const bytes = await readFile(path.join(repoRoot, entry.path));
    assert(
      bytes.byteLength === entry.bytes && sha256(bytes) === entry.sha256,
      `Frozen packet hash drifted for ${entry.path}.`,
    );
    verified += 1;
  }
  checks.packetLocks = {
    status: "checked",
    declaredFileCount: locks.files.length,
    verifiedFileCount: verified,
    uniquePathCount: lockByPath.size,
  };
} catch (error) {
  if (error?.code === "ENOENT") {
    warnings.push(
      "packet-locks.json is not present yet; run freeze-packet.mjs after validation.",
    );
  } else {
    errors.push(`Could not validate packet locks: ${error.message}`);
  }
}

const status = errors.length === 0 ? "passed" : "failed";
candidateRegister.validationStatus = {
  status,
  validatedAt: production.capturedAt,
  validator: `${packetPath}/validate-packet.mjs`,
  summaryPath: `${packetPath}/validation.json`,
};
const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: production.capturedAt,
  validator: `${packetPath}/validate-packet.mjs`,
  status,
  checks,
  errors,
  warnings,
  safetyConclusion:
    "Automated validation confirms packet integrity only. It does not authorize Sanity mutation, stable ID creation, publication, page builds, or deployment.",
  requiredNextStep:
    "Complete independent chronology review and separately authorize any implementation.",
};
await Promise.all([
  writeFile(path.join(here, "candidates.json"), json(candidateRegister)),
  writeFile(path.join(here, "validation.json"), json(validation)),
]);
console.log(
  JSON.stringify(
    {
      status,
      errorCount: errors.length,
      warningCount: warnings.length,
      counts: checks.counts,
      sourceCapture: checks.sourceCapture,
      packetLocks: checks.packetLocks,
    },
    null,
    2,
  ),
);
if (errors.length > 0) process.exitCode = 1;
