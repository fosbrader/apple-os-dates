import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-developer-gap-priority";
const packetPath =
  "research-handoffs/beta-chronology-gap/developer-gap-priority";
const evidencePath =
  "tmp/research-evidence/beta-chronology-gap/developer-gap-priority";
const errors = [];
const checks = {};

const absolute = (relativePath) => path.join(repoRoot, relativePath);
const readJson = async (relativePath) =>
  JSON.parse(await readFile(absolute(relativePath), "utf8"));
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
const hasForbiddenKey = (value, forbidden) => {
  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenKey(item, forbidden));
  }
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(
    ([key, child]) =>
      forbidden.has(key) || hasForbiddenKey(child, forbidden),
  );
};

const [
  assignment,
  sourcesDocument,
  reinspection,
  candidatesDocument,
  sequenceDocument,
  conflictsDocument,
  production,
  selfReview,
  schema,
  fetchManifest,
  report,
  queryScript,
] = await Promise.all([
  readJson(`${packetPath}/assignment.json`),
  readJson(`${packetPath}/sources.json`),
  readJson(`${packetPath}/retained-source-reinspection.json`),
  readJson(`${packetPath}/candidates.json`),
  readJson(`${packetPath}/full-sequence-audit.json`),
  readJson(`${packetPath}/conflicts.json`),
  readJson(`${packetPath}/production-snapshot.json`),
  readJson(`${packetPath}/self-review.json`),
  readJson(`${packetPath}/developer-candidate.schema.json`),
  readJson(`${evidencePath}/fetch-manifest.json`),
  readFile(absolute(`${packetPath}/report.md`), "utf8"),
  readFile(absolute(`${packetPath}/query-production.ts`), "utf8"),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["retained-source-reinspection.json", reinspection],
  ["candidates.json", candidatesDocument],
  ["full-sequence-audit.json", sequenceDocument],
  ["conflicts.json", conflictsDocument],
  ["production-snapshot.json", production],
  ["self-review.json", selfReview],
  ["fetch-manifest.json", fetchManifest],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}

const candidates = candidatesDocument.candidates;
const sources = sourcesDocument.sources;
const sourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);
const expectedCycles = {
  "9.2.1": {
    count: 2,
    dates: ["2015-12-16", "2016-01-04"],
    next: 3,
  },
  "10.2.1": {
    count: 4,
    dates: ["2016-12-14", "2016-12-20", "2017-01-09", "2017-01-12"],
    next: 5,
  },
  "10.3.2": {
    count: 5,
    dates: [
      "2017-03-28",
      "2017-04-10",
      "2017-04-17",
      "2017-04-24",
      "2017-04-27",
    ],
    next: 6,
  },
  "10.3.3": {
    count: 6,
    dates: [
      "2017-05-16",
      "2017-05-30",
      "2017-06-13",
      "2017-06-22",
      "2017-06-28",
      "2017-07-05",
    ],
    next: 7,
  },
};

checks.candidateCount = candidates.length;
checks.sourceCount = sources.length;
checks.retainedSourceReinspectionCount = reinspection.sources.length;
checks.newSourceCount = fetchManifest.sources.length;
checks.sequenceAuditCount = sequenceDocument.audits.length;
checks.conflictCount = conflictsDocument.conflicts.length;

assert(
  assignment.targetCount === 17 &&
    assignment.targets.length === 17 &&
    candidates.length === 17,
  "Expected exactly seventeen assigned candidates.",
);
assert(
  sourcesDocument.sourceCount === 42 && sources.length === 42,
  "Expected exactly forty-two sources.",
);
assert(
  reinspection.sourceCount === 28 &&
    reinspection.sources.length === 28,
  "Expected exactly twenty-eight retained-source reinspections.",
);
assert(
  fetchManifest.sourceCount === 14 &&
    fetchManifest.sources.length === 14 &&
    fetchManifest.allExpectedMarkersFound === true,
  "Expected fourteen fully identified new captures.",
);
assert(
  conflictsDocument.conflictCount === 2 &&
    conflictsDocument.conflicts.length === 2,
  "Expected exactly two preserved conflicts.",
);
assert(
  new Set(candidates.map((candidate) => candidate.candidateId)).size ===
    candidates.length,
  "Candidate IDs are not unique.",
);
assert(
  new Set(sources.map((source) => source.sourceId)).size ===
    sources.length,
  "Source IDs are not unique.",
);

const draft7Definitions = JSON.parse(
  JSON.stringify(schema.$defs).replaceAll("#/$defs/", "#/definitions/"),
);
const candidateArraySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: draft7Definitions,
  type: "array",
  items: {$ref: "#/definitions/candidate"},
};
const ajv = new Ajv({
  allErrors: true,
  jsonPointers: true,
  format: "full",
});
const validateCandidates = ajv.compile(candidateArraySchema);
checks.packetLocalDeveloperSchemaValid = validateCandidates(candidates);
if (!checks.packetLocalDeveloperSchemaValid) {
  for (const error of validateCandidates.errors ?? []) {
    errors.push(
      `Developer candidate schema ${error.dataPath || "/"} ${error.message}.`,
    );
  }
}
assert(
  schema.$defs.candidate.properties.proposedIdentity.properties.channel
    .const === "developerBeta" &&
    schema.$defs.candidate.properties.proposedIdentity.properties.routeAlias
      .pattern === "^beta-[1-9][0-9]*$",
  "Packet-local schema does not hard-code developerBeta and beta-N routes.",
);

for (const [version, expected] of Object.entries(expectedCycles)) {
  const cycleCandidates = candidates
    .filter((candidate) => candidate.version === version)
    .sort(
      (left, right) =>
        left.proposedIdentity.sequence -
        right.proposedIdentity.sequence,
    );
  assert(
    cycleCandidates.length === expected.count,
    `${version} has unexpected candidate count.`,
  );
  for (const [index, candidate] of cycleCandidates.entries()) {
    const sequence = index + 1;
    const identity = candidate.proposedIdentity;
    assert(
      candidate.candidateId ===
        `candidate:apple:ios:${version}:beta-${sequence}` &&
        candidate.releaseVersionId ===
          `version-ios-${version.replaceAll(".", "-")}` &&
        candidate.platform === "iOS" &&
        candidate.platformId === "platform-ios" &&
        candidate.originCohortId === "developer-gap-priority",
      `${candidate.candidateId} has invalid scope identity.`,
    );
    assert(
      identity.label === `Beta ${sequence}` &&
        identity.routeAlias === `beta-${sequence}` &&
        identity.channel === "developerBeta" &&
        identity.appearanceDate === expected.dates[index] &&
        identity.sequence === sequence &&
        identity.isRevision === false &&
        identity.availabilityState === "available" &&
        identity.closesReleaseCycle === false,
      `${candidate.candidateId} has invalid proposed identity.`,
    );
    assert(
      candidate.ordinalBasis === "explicit" &&
        candidate.candidateStatus === "needsEvidenceReview" &&
        candidate.identityStatus === "confirmed" &&
        candidate.evidenceState === "corroborated" &&
        candidate.buildEvidenceStatus === "absent" &&
        candidate.contentDisposition === "timelineOnly",
      `${candidate.candidateId} overstates or changes research status.`,
    );
    assert(
      candidate.productionReconciliation.status ===
        "confirmedMissing" &&
        candidate.productionReconciliation.queriedAt ===
          production.capturedAt &&
        candidate.productionReconciliation.exactIdentityMatches === 0,
      `${candidate.candidateId} has invalid production reconciliation.`,
    );
    assert(
      candidate.review.required === true &&
        candidate.review.reviewer === null &&
        candidate.review.reviewedAt === null &&
        candidate.flags.sanityMutationAllowed === false &&
        candidate.flags.publicationEligible === false &&
        candidate.flags.stableEventIdCreationAllowed === false,
      `${candidate.candidateId} is not safely pending independent review.`,
    );
    const publisherFamilies = new Set();
    for (const ref of candidate.evidenceRefs) {
      const source = sourceById.get(ref.sourceId);
      assert(
        ref.kind === "packetSource" &&
          ref.packetPath === `${packetPath}/sources.json` &&
          Boolean(source),
        `${candidate.candidateId} has unresolved source ${ref.sourceId}.`,
      );
      if (source?.lineage.independentForCorroboration) {
        publisherFamilies.add(source.lineage.publisherFamily);
      }
    }
    assert(
      publisherFamilies.size >= 2,
      `${candidate.candidateId} lacks two independent publisher families.`,
    );
  }
}
checks.everyCandidateHasTwoPublisherLineages = errors.every(
  (error) => !error.includes("publisher families"),
);

assert(
  production.perspective === "published" &&
    production.useCdn === false &&
    production.versions.length === 4 &&
    production.productionCounts.scopedDeveloperBetaEvents === 0 &&
    production.productionCounts.exactIdentityMatches === 0 &&
    production.exactChecks.length === 17 &&
    production.exactChecks.every(
      (check) => check.exactIdentityMatches === 0,
    ) &&
    production.safety.queryOnly === true &&
    production.safety.sanityMutationPerformed === false &&
    production.safety.stableIdsAllocated === false,
  "Production snapshot is not the required read-only zero-match result.",
);
checks.production = {
  capturedAt: production.capturedAt,
  perspective: production.perspective,
  useCdn: production.useCdn,
  releaseVersionParents: production.versions.length,
  scopedDeveloperBetaEvents:
    production.productionCounts.scopedDeveloperBetaEvents,
  exactIdentityChecks: production.exactChecks.length,
  exactIdentityMatches: production.productionCounts.exactIdentityMatches,
};

let reproducedRaw = 0;
let reproducedSelected = 0;
for (const source of sources) {
  const [raw, selected] = await Promise.all([
    readFile(absolute(source.evidence.rawPath)),
    readFile(absolute(source.evidence.selectedPath)),
  ]);
  assert(
    raw.byteLength === source.evidence.rawBytes &&
      sha256(raw) === source.evidence.rawSha256,
    `Raw evidence mismatch for ${source.sourceId}.`,
  );
  assert(
    selected.byteLength === source.evidence.selectedTextBytes &&
      sha256(selected) === source.evidence.selectedTextSha256,
    `Selected evidence mismatch for ${source.sourceId}.`,
  );
  const locatorMarkers =
    source.evidence.locatorMarkers ??
    (source.evidence.locatorMarker
      ? [source.evidence.locatorMarker]
      : []);
  assert(
    locatorMarkers.length > 0,
    `${source.sourceId} has no explicit locator markers.`,
  );
  const combined = `${raw.toString("utf8")}\n${selected.toString("utf8")}`
    .toLocaleLowerCase();
  for (const marker of locatorMarkers) {
    assert(
      combined.includes(marker.toLocaleLowerCase()),
      `Locator marker missing for ${source.sourceId}: ${marker}.`,
    );
  }
  reproducedRaw += 1;
  reproducedSelected += 1;
}
checks.rawArtifactsReproduced = reproducedRaw;
checks.selectedArtifactsReproduced = reproducedSelected;

for (const item of reinspection.sources) {
  const raw = await readFile(absolute(item.rawPath));
  assert(
    item.rawHashMatch === true &&
      raw.byteLength === item.observedRawBytes &&
      sha256(raw) === item.observedRawSha256 &&
      item.observedRawBytes === item.expectedRawBytes &&
      item.observedRawSha256 === item.expectedRawSha256 &&
      item.locatorFound === true,
    `Retained-source reinspection mismatch for ${item.sourceId}.`,
  );
  const selected = await readFile(absolute(item.selectedPath));
  assert(
    selected.byteLength === item.selectedTextBytes ||
      selected.byteLength === item.observedSelectedTextBytes,
    `Retained selected byte count mismatch for ${item.sourceId}.`,
  );
  if (item.expectedSelectedTextSha256) {
    assert(
      item.selectedHashMatch === true &&
        sha256(selected) === item.expectedSelectedTextSha256,
      `Retained selected hash mismatch for ${item.sourceId}.`,
    );
  } else {
    assert(
      sha256(selected) === item.selectedTextSha256,
      `Derived retained selected hash mismatch for ${item.sourceId}.`,
    );
  }
}
checks.retainedReinspectionsReproduced = reinspection.sources.length;

assert(
  sequenceDocument.cycleCount === 4 &&
    sequenceDocument.positiveIdentityCount === 17 &&
    sequenceDocument.negativeNextOrdinalTestCount === 4 &&
    sequenceDocument.skippedOrdinalCount === 0 &&
    sequenceDocument.withdrawalOrRespinCount === 0,
  "Full-sequence summary has unexpected counts.",
);
for (const audit of sequenceDocument.audits) {
  const expected = expectedCycles[audit.version];
  assert(Boolean(expected), `Unexpected sequence audit ${audit.version}.`);
  if (!expected) continue;
  assert(
    audit.observedDeveloperSequence.length === expected.count &&
      audit.observedDeveloperSequence.every(
        (identity, index) =>
          identity.sequence === index + 1 &&
          identity.routeAlias === `beta-${index + 1}` &&
          identity.appearanceDate === expected.dates[index] &&
          identity.publisherFamilies.length >= 2,
      ),
    `${audit.version} positive sequence is incomplete.`,
  );
  assert(
    audit.continuityChecks.firstOrdinal === 1 &&
      audit.continuityChecks.lastObservedOrdinal === expected.count &&
      audit.continuityChecks.missingOrdinalsWithinObservedRange.length ===
        0 &&
      audit.continuityChecks.duplicateOrdinals.length === 0 &&
      audit.continuityChecks.withdrawalOrRespinsObserved === false,
    `${audit.version} continuity audit is invalid.`,
  );
  assert(
    audit.negativeLaterOrdinalAudit.testedSequence === expected.next &&
      audit.negativeLaterOrdinalAudit.testedRouteAlias ===
        `beta-${expected.next}` &&
      audit.negativeLaterOrdinalAudit.searchResult ===
        "noPositiveContemporarySourceLocated" &&
      audit.negativeLaterOrdinalAudit.exactSearchQueries.length >= 2 &&
      audit.negativeLaterOrdinalAudit.closureSourceIds.length >= 1,
    `${audit.version} negative next-ordinal audit is incomplete.`,
  );
  for (const sourceId of audit.negativeLaterOrdinalAudit
    .closureSourceIds) {
    assert(
      sourceById.has(sourceId),
      `${audit.version} closure source ${sourceId} is unresolved.`,
    );
  }
}
checks.fullSequenceAndNegativeEvidenceValid = errors.every(
  (error) =>
    !error.includes("sequence") &&
    !error.includes("continuity") &&
    !error.includes("next-ordinal") &&
    !error.includes("closure source"),
);

const conflictIds = new Set(
  conflictsDocument.conflicts.map((conflict) => conflict.conflictId),
);
assert(
  conflictIds.has("conflict-ios921-cross-channel-aggregate-three") &&
    conflictIds.has("conflict-ios1032-final-four-versus-beta-five"),
  "Required conflicts were not preserved.",
);
for (const conflict of conflictsDocument.conflicts) {
  for (const position of conflict.sourcePositions) {
    assert(
      sourceById.has(position.sourceId),
      `${conflict.conflictId} has unresolved position source.`,
    );
  }
  for (const sourceId of conflict.directIdentityEvidence) {
    assert(
      sourceById.has(sourceId),
      `${conflict.conflictId} has unresolved direct evidence.`,
    );
  }
  assert(
    conflict.requiresReviewerAttention === true,
    `${conflict.conflictId} suppresses reviewer attention.`,
  );
}
checks.conflictsPreserved = conflictsDocument.conflicts.length;

assert(
  assignment.safety.productionQueriesReadOnly === true &&
    assignment.safety.sanityMutationAllowed === false &&
    assignment.safety.publicationAuthorized === false &&
    assignment.safety.stableEventIdCreationAllowed === false &&
    assignment.safety.independentReviewRequired === true &&
    candidatesDocument.safety.researchOnly === true &&
    candidatesDocument.safety.mutationAuthorized === false &&
    candidatesDocument.safety.stableIdsAllocated === 0 &&
    candidatesDocument.safety.publicationAuthorized === false &&
    selfReview.outcome === "readyForIndependentChronologyReview" &&
    selfReview.independentReview.required === true &&
    selfReview.independentReview.reviewer === null,
  "Packet safety or independent-review boundary is invalid.",
);
assert(
  !hasForbiddenKey(candidatesDocument, new Set(["stableEventId", "_id"])),
  "Candidate packet contains a stable ID or document ID.",
);
assert(
  !queryScript.includes(".create(") &&
    !queryScript.includes(".patch(") &&
    !queryScript.includes(".delete(") &&
    !queryScript.includes(".transaction(") &&
    queryScript.includes("client.fetch("),
  "Production query script is not fetch-only.",
);
assert(
  report.includes("17 exact missing") &&
    report.includes("No stable IDs were allocated") &&
    report.includes("does not self-approve"),
  "Report omits result or safety boundary.",
);
checks.safetyBoundaryValid = errors.every(
  (error) =>
    !error.includes("safety") &&
    !error.includes("stable ID") &&
    !error.includes("fetch-only") &&
    !error.includes("Report omits"),
);

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  status: errors.length === 0 ? "passed" : "failed",
  errorCount: errors.length,
  errors,
  checks,
  safety: {
    chronologyApprovalGranted: false,
    independentReviewRequired: true,
    sanityMutationPerformed: false,
    stableEventIdsCreated: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
};
await writeFile(
  absolute(`${packetPath}/validation.json`),
  `${JSON.stringify(validation, null, 2)}\n`,
);
console.log(JSON.stringify(validation, null, 2));
if (errors.length > 0) process.exit(1);
