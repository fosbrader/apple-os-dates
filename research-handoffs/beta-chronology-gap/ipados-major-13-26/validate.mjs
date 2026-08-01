import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ipados-major-13-26";
const relativePacketDir =
  "research-handoffs/beta-chronology-gap/ipados-major-13-26";
const errors = [];
const checks = {};

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
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
  candidatesDocument,
  conflictsDocument,
  productionSnapshot,
  review,
  candidateRegisterSchema,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("sources.json"),
  readJson("candidates.json"),
  readJson("conflicts.json"),
  readJson("production-snapshot.json"),
  readJson("review.json"),
  readJson("../proposed-event-candidate.schema.json"),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["candidates.json", candidatesDocument],
  ["conflicts.json", conflictsDocument],
  ["review.json", review],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}
checks.packetJsonParsed = 6;

const candidates = candidatesDocument.candidates;
const existingMatches = candidatesDocument.existingMatches;
const notProposed = candidatesDocument.notProposed;
const sources = sourcesDocument.sources;
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));

checks.candidateCount = candidates.length;
checks.existingMatchCount = existingMatches.length;
checks.notProposedCount = notProposed.length;
checks.sourceCount = sources.length;
checks.conflictCount = conflictsDocument.conflicts.length;

assert(candidates.length === 40, `Expected 40 candidates; found ${candidates.length}.`);
assert(
  existingMatches.length === 3,
  `Expected 3 exact existing matches; found ${existingMatches.length}.`,
);
assert(
  notProposed.length === 2,
  `Expected 2 not-proposed PB1 records; found ${notProposed.length}.`,
);
assert(sources.length === 65, `Expected 65 sources; found ${sources.length}.`);
assert(
  conflictsDocument.conflictCount === 7 &&
    conflictsDocument.conflicts.length === 7,
  "Conflict count is not the frozen value of 7.",
);

const expectedObservedByVersion = {
  "13.0": 7,
  "14.0": 7,
  "15.0": 7,
  "16.0": 4,
  "17.0": 6,
  "18.0": 6,
  "26.0": 6,
};
const expectedCandidatesByVersion = {
  "13.0": 7,
  "14.0": 7,
  "15.0": 7,
  "16.0": 3,
  "17.0": 5,
  "18.0": 6,
  "26.0": 5,
};
checks.observedByVersion = countBy(assignment.targets, (target) => target.version);
checks.candidatesByVersion = countBy(candidates, (candidate) => candidate.version);
checks.candidatesByEvidenceState = countBy(
  candidates,
  (candidate) => candidate.evidenceState,
);
checks.candidatesByIdentityStatus = countBy(
  candidates,
  (candidate) => candidate.identityStatus,
);
checks.candidatesByProductionStatus = countBy(
  candidates,
  (candidate) => candidate.productionReconciliation.status,
);

assert(
  assignment.observedAppearanceCount === 43 &&
    assignment.targets.length === 43,
  "assignment.json does not preserve 43 observed appearances.",
);
assert(
  sameJson(checks.observedByVersion, expectedObservedByVersion),
  `Observed version counts drifted: ${JSON.stringify(checks.observedByVersion)}.`,
);
assert(
  sameJson(checks.candidatesByVersion, expectedCandidatesByVersion),
  `Candidate version counts drifted: ${JSON.stringify(checks.candidatesByVersion)}.`,
);
assert(
  sameJson(checks.candidatesByEvidenceState, {corroborated: 40}),
  "Every candidate must remain corroborated.",
);
assert(
  sameJson(checks.candidatesByIdentityStatus, {
    confirmed: 39,
    conflict: 1,
  }),
  "Identity-state counts must remain 39 confirmed and 1 conflict.",
);
assert(
  sameJson(checks.candidatesByProductionStatus, {
    confirmedMissing: 39,
    existingIdentityConflict: 1,
  }),
  "Production states must remain 39 confirmed missing and 1 identity conflict.",
);

const candidateIds = candidates.map((candidate) => candidate.candidateId);
const candidateIdentityKeys = candidates.map(
  (candidate) =>
    `${candidate.releaseVersionId}\u0000${candidate.proposedIdentity.channel}\u0000${candidate.proposedIdentity.routeAlias}`,
);
assert(
  new Set(candidateIds).size === candidates.length,
  "Candidate IDs are not unique.",
);
assert(
  new Set(candidateIdentityKeys).size === candidates.length,
  "Candidate identity keys are not unique.",
);
assert(
  new Set(sources.map((source) => source.sourceId)).size === sources.length,
  "Source IDs are not unique.",
);

const draft7Schema = JSON.parse(
  JSON.stringify(candidateRegisterSchema).replaceAll(
    "#/$defs/",
    "#/definitions/",
  ),
);
const candidateArraySchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  definitions: draft7Schema.$defs,
  type: "array",
  items: {$ref: "#/definitions/candidate"},
};
const ajv = new Ajv({allErrors: true, jsonPointers: true});
const validateCandidates = ajv.compile(candidateArraySchema);
checks.sharedCandidateSchemaValid = validateCandidates(candidates);
if (!checks.sharedCandidateSchemaValid) {
  for (const error of validateCandidates.errors ?? []) {
    errors.push(
      `Shared candidate schema ${error.dataPath || "/"} ${error.message}.`,
    );
  }
}

const assignmentByCandidateId = new Map(
  assignment.targets.map((target) => [target.candidateId, target]),
);
const productionCheckByKey = new Map(
  productionSnapshot.exactChecks.map((item) => [
    `${item.releaseVersionId}\u0000${item.channel}\u0000${item.routeAlias}`,
    item,
  ]),
);
let evidenceReferenceCount = 0;

for (const candidate of candidates) {
  const identity = candidate.proposedIdentity;
  const target = assignmentByCandidateId.get(candidate.candidateId);
  const expectedLabel = `Public Beta ${identity.sequence}`;
  const expectedRoute = `public-beta-${identity.sequence}`;
  const productionKey = `${candidate.releaseVersionId}\u0000${identity.channel}\u0000${identity.routeAlias}`;
  const productionCheck = productionCheckByKey.get(productionKey);

  assert(Boolean(target), `${candidate.candidateId} is missing from assignment.json.`);
  assert(
    candidate.platform === "iPadOS" &&
      candidate.platformId === "platform-ipados" &&
      candidate.originCohortId === "ipados-major-13-26-public-beta",
    `${candidate.candidateId} has an unexpected platform or cohort.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.label === expectedLabel &&
      identity.routeAlias === expectedRoute &&
      identity.isRevision === false &&
      identity.availabilityState === "available" &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has an invalid public-beta identity.`,
  );
  assert(
    candidate.ordinalBasis === "explicit",
    `${candidate.candidateId} does not preserve an explicit public ordinal.`,
  );
  assert(
    candidate.candidateStatus === "needsEvidenceReview" &&
      candidate.review.required === true &&
      candidate.review.reviewer === null &&
      candidate.review.reviewedAt === null,
    `${candidate.candidateId} is not frozen at needsEvidenceReview.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
    `${candidate.candidateId} has unsafe authorization flags.`,
  );
  assert(
    candidate.productionReconciliation.queriedAt ===
      productionSnapshot.capturedAt &&
      candidate.productionReconciliation.exactIdentityMatches === 0,
    `${candidate.candidateId} does not match the production snapshot timestamp/count.`,
  );
  assert(
    productionCheck?.exactIdentityMatches === 0,
    `${candidate.candidateId} has an unexpected exact production match.`,
  );
  assert(
    target?.appearanceDate === identity.appearanceDate &&
      target?.displayedLabel === identity.label &&
      target?.routeAlias === identity.routeAlias,
    `${candidate.candidateId} differs from its assignment target.`,
  );

  const independentFamilies = new Set();
  for (const ref of candidate.evidenceRefs) {
    evidenceReferenceCount += 1;
    assert(
      ref.kind === "packetSource" &&
        ref.packetPath === `${relativePacketDir}/sources.json`,
      `${candidate.candidateId} has a non-packet or misrouted evidence reference.`,
    );
    const source = sourceById.get(ref.sourceId);
    assert(
      Boolean(source),
      `${candidate.candidateId} references missing source ${ref.sourceId}.`,
    );
    if (source?.lineage.independentForCorroboration) {
      independentFamilies.add(source.lineage.publisherFamily);
    }
  }
  assert(
    independentFamilies.size >= 2,
    `${candidate.candidateId} has fewer than two independent publisher lineages.`,
  );
}
checks.assignmentTargetsResolved = candidates.filter((candidate) =>
  assignmentByCandidateId.has(candidate.candidateId),
).length;
checks.evidenceReferencesResolved = evidenceReferenceCount;

const expectedExisting = new Map([
  ["16.0:1", "release-event-775a335cb87a0b39127c37ff"],
  ["17.0:1", "release-event-c8241d69688a968737a8187e"],
  ["26.0:1", "release-event-d7351bf59b922af10f620144"],
]);
for (const match of existingMatches) {
  const key = `${match.version}:${match.sequence}`;
  const productionKey = `${match.releaseVersionId}\u0000${match.channel}\u0000${match.routeAlias}`;
  const productionCheck = productionCheckByKey.get(productionKey);
  assert(
    expectedExisting.get(key) === match.productionEvent._id,
    `${match.matchId} does not resolve to the frozen production event.`,
  );
  assert(
    match.productionReconciliation.status === "exactExistingMatch" &&
      match.productionReconciliation.exactIdentityMatches === 1 &&
      match.productionReconciliation.queriedAt ===
        productionSnapshot.capturedAt &&
      productionCheck?.exactIdentityMatches === 1,
    `${match.matchId} is not an exact existing match.`,
  );
  assert(
    match.flags.sanityMutationAllowed === false &&
      match.flags.publicationEligible === false,
    `${match.matchId} has unsafe authorization flags.`,
  );
}
checks.existingMatchesVerified = existingMatches.length;

const candidateKeySet = new Set(
  candidates.map(
    (candidate) =>
      `${candidate.version}:${candidate.proposedIdentity.sequence}`,
  ),
);
assert(
  !candidateKeySet.has("14.0:1") && !candidateKeySet.has("15.0:1"),
  "A disproved 14.0 or 15.0 PB1 became a candidate.",
);
assert(
  candidateKeySet.has("14.0:2") && candidateKeySet.has("15.0:2"),
  "A displayed opening PB2 identity is missing.",
);
const notProposedById = new Map(
  notProposed.map((record) => [record.recordId, record]),
);
assert(
  notProposedById.has("not-proposed:apple:ipados:14.0:public-beta-1") &&
    notProposedById.has("not-proposed:apple:ipados:15.0:public-beta-1"),
  "Both disproved PB1 records must remain explicit.",
);
const iPad15Pb1 = notProposedById.get(
  "not-proposed:apple:ipados:15.0:public-beta-1",
);
assert(
  iPad15Pb1?.productionConflict?.eventId ===
    "release-event-01d7714ed4d28b61aeb41bf0" &&
    iPad15Pb1?.productionConflict?.stableEventId ===
      "version-ipados-15-0:m-96d41d5554c6",
  "The iPadOS 15 production PB1 conflict is not pinned to the frozen event.",
);
for (const record of notProposed) {
  assert(
    record.classification === "disprovedIdentity" &&
      record.flags.sanityMutationAllowed === false &&
      record.flags.publicationEligible === false,
    `${record.recordId} has an unsafe or unexpected disposition.`,
  );
  for (const ref of record.evidenceRefs) {
    assert(
      sourceById.has(ref.sourceId),
      `${record.recordId} references missing source ${ref.sourceId}.`,
    );
  }
}
checks.exceptionRecordsVerified = notProposed.length;

assert(
  productionSnapshot.perspective === "published" &&
    productionSnapshot.useCdn === false &&
    productionSnapshot.safety.queryOnly === true &&
    productionSnapshot.safety.sanityMutationPerformed === false,
  "Production snapshot is not the frozen read-only published query.",
);
assert(
  productionSnapshot.productionCounts.totalReleaseEvents === 2068 &&
    productionSnapshot.productionCounts.iPadOSPublicBetaEventsAllVersions ===
      10 &&
    productionSnapshot.productionCounts.scopedReleaseEvents === 78 &&
    productionSnapshot.productionCounts.scopedPublicBetaEvents === 4,
  "Production snapshot counts drifted.",
);
assert(
  productionSnapshot.expectedIdentityCount === 43 &&
    productionSnapshot.exactChecks.length === 43,
  "Production exact-check set does not cover all 43 appearances.",
);
const rawProductionSnapshot = await readFile(
  path.join(
    repoRoot,
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26/production-snapshot.json",
  ),
);
const packetProductionSnapshot = await readFile(
  path.join(here, "production-snapshot.json"),
);
assert(
  rawProductionSnapshot.equals(packetProductionSnapshot),
  "Packet production-snapshot.json is not byte-identical to the read-only capture.",
);
checks.productionSnapshotReadOnlyAndExact = true;

let rawSourcesVerified = 0;
let selectedTextVerified = 0;
for (const source of sources) {
  const rawPath = path.join(repoRoot, source.evidence.rawPath);
  const bytes = await readFile(rawPath);
  const fileStat = await stat(rawPath);
  assert(fileStat.isFile(), `${source.sourceId} raw evidence is not a file.`);
  assert(
    bytes.byteLength === source.evidence.rawBytes,
    `${source.sourceId} raw byte count drifted.`,
  );
  assert(
    sha256(bytes) === source.evidence.rawSha256,
    `${source.sourceId} raw SHA-256 drifted.`,
  );
  const selected = source.evidence.selectedText;
  assert(
    selected.type === "verbatimHeadlineFragment" &&
      selected.wordCount > 0 &&
      selected.wordCount <= 20 &&
      selected.maxWords === 20 &&
      source.title.startsWith(selected.text),
    `${source.sourceId} does not contain valid bounded selected text.`,
  );
  rawSourcesVerified += 1;
  selectedTextVerified += 1;
}
checks.rawSourcesVerified = rawSourcesVerified;
checks.boundedSelectedTextVerified = selectedTextVerified;

assert(
  assignment.constraints.noSanityWrites === true &&
    assignment.constraints.noDeployment === true &&
    assignment.constraints.noStableEventIdCreation === true &&
    review.authorization.sanityMutationAllowed === false &&
    review.authorization.publicationEligible === false &&
    review.authorization.deploymentAllowed === false,
  "Packet safety boundary was weakened.",
);
checks.safetyBoundaryVerified = true;
checks.independentReviewStillRequired =
  review.authorization.independentChronologyReviewComplete === false;

const lockedFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "review.json",
  "report.md",
  "build-packet.mjs",
  "query-production.ts",
];
const fileLocks = [];
for (const filename of lockedFiles) {
  const bytes = await readFile(path.join(here, filename));
  fileLocks.push({
    path: `${relativePacketDir}/${filename}`,
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  });
}
checks.packetFilesLocked = fileLocks.length;

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  status:
    errors.length === 0
      ? "passedSelfCheckPendingIndependentReview"
      : "failed",
  independentReviewComplete: false,
  checks,
  counts: {
    observedAppearances: assignment.targets.length,
    candidates: candidates.length,
    exactExistingMatches: existingMatches.length,
    notProposed: notProposed.length,
    sources: sources.length,
    rawSources: rawSourcesVerified,
    conflicts: conflictsDocument.conflicts.length,
    confirmedMissingCandidates:
      checks.candidatesByProductionStatus.confirmedMissing ?? 0,
    productionIdentityConflictCandidates:
      checks.candidatesByProductionStatus.existingIdentityConflict ?? 0,
  },
  blockers: [
    "Independent chronology review has not been completed.",
    "The June 30, 2021 iPadOS 15 production event is stored as PB1 while evidence supports PB2; no duplicate or correction is authorized.",
  ],
  fileLocks,
  safety: {
    sanityMutationPerformed: false,
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
  errors,
};

await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      status: validation.status,
      counts: validation.counts,
      checks,
      errors,
    },
    null,
    2,
  ),
);

if (errors.length > 0) process.exitCode = 1;
