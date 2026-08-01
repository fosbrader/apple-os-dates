import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ios10-point-public";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public";
const errors = [];
const checks = {};

const expectedDates = {
  "10.1": [
    "2016-09-22",
    "2016-10-05",
    "2016-10-10",
    "2016-10-17",
    "2016-10-19",
  ],
  "10.2": [
    "2016-11-01",
    "2016-11-08",
    "2016-11-15",
    "2016-11-28",
    "2016-12-02",
    "2016-12-05",
    "2016-12-07",
  ],
  "10.2.1": [
    "2016-12-15",
    "2016-12-21",
    "2017-01-09",
    "2017-01-12",
  ],
  "10.3": [
    "2017-01-26",
    "2017-02-07",
    "2017-02-21",
    "2017-02-28",
    "2017-03-08",
    "2017-03-13",
    "2017-03-16",
  ],
  "10.3.2": [
    "2017-03-29",
    "2017-04-11",
    "2017-04-18",
    "2017-04-24",
    "2017-04-27",
  ],
  "10.3.3": [
    "2017-05-17",
    "2017-05-30",
    "2017-06-13",
    "2017-06-22",
    "2017-06-28",
    "2017-07-05",
  ],
};

const expectedCounts = {
  "10.1": 5,
  "10.2": 7,
  "10.2.1": 4,
  "10.3": 7,
  "10.3.2": 5,
  "10.3.3": 6,
};

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
const readJson = async (filename) =>
  JSON.parse(await readFile(path.join(here, filename), "utf8"));
const countBy = (items, selector) => {
  const result = {};
  for (const item of items) {
    const key = selector(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(result).sort(([left], [right]) =>
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
  production,
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
const sources = sourcesDocument.sources;
const failures = sourcesDocument.captureFailures;
const sourceById = new Map(sources.map((item) => [item.sourceId, item]));
const candidateById = new Map(
  candidates.map((item) => [item.candidateId, item]),
);

checks.candidateCount = candidates.length;
checks.sourceCount = sources.length;
checks.attemptedSourceCount = sourcesDocument.attemptedSourceCount;
checks.failedCaptureCount = failures.length;
checks.conflictCount = conflictsDocument.conflicts.length;

assert(candidates.length === 34, `Expected 34 candidates, found ${candidates.length}.`);
assert(sources.length === 77, `Expected 77 captured sources, found ${sources.length}.`);
assert(
  sourcesDocument.attemptedSourceCount === 83,
  `Expected 83 attempted sources, found ${sourcesDocument.attemptedSourceCount}.`,
);
assert(failures.length === 6, `Expected 6 capture failures, found ${failures.length}.`);
assert(
  conflictsDocument.conflictCount === 6 &&
    conflictsDocument.conflicts.length === 6,
  "Conflict count is not the frozen value of 6.",
);

checks.candidatesByVersion = countBy(candidates, (item) => item.version);
checks.candidatesByEvidenceState = countBy(
  candidates,
  (item) => item.evidenceState,
);
checks.candidatesByIdentityStatus = countBy(
  candidates,
  (item) => item.identityStatus,
);
checks.candidatesByProductionStatus = countBy(
  candidates,
  (item) => item.productionReconciliation.status,
);

assert(
  sameJson(checks.candidatesByVersion, expectedCounts),
  `Version counts drifted: ${JSON.stringify(checks.candidatesByVersion)}.`,
);
assert(
  sameJson(checks.candidatesByEvidenceState, {
    corroborated: 33,
    reported: 1,
  }),
  `Evidence-state counts drifted: ${JSON.stringify(checks.candidatesByEvidenceState)}.`,
);
assert(
  sameJson(checks.candidatesByIdentityStatus, {
    confirmed: 33,
    unverified: 1,
  }),
  `Identity-state counts drifted: ${JSON.stringify(checks.candidatesByIdentityStatus)}.`,
);
assert(
  sameJson(checks.candidatesByProductionStatus, {confirmedMissing: 34}),
  `Production-state counts drifted: ${JSON.stringify(checks.candidatesByProductionStatus)}.`,
);

assert(
  assignment.targetCount === 34 && assignment.targets.length === 34,
  "assignment.json does not preserve exactly 34 targets.",
);
assert(
  new Set(candidates.map((item) => item.candidateId)).size ===
    candidates.length,
  "Candidate IDs are not unique.",
);
assert(
  new Set(
    candidates.map(
      (item) =>
        `${item.releaseVersionId}\u0000${item.proposedIdentity.channel}\u0000${item.proposedIdentity.routeAlias}`,
    ),
  ).size === candidates.length,
  "Candidate production identity keys are not unique.",
);
assert(
  new Set(sources.map((item) => item.sourceId)).size === sources.length,
  "Source IDs are not unique.",
);
assert(
  failures.every((item) => !sourceById.has(item.sourceId)),
  "A failed capture appears in the retained source ledger.",
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

const targetById = new Map(
  assignment.targets.map((item) => [item.candidateId, item]),
);
const exactCheckByKey = new Map(
  production.exactChecks.map((item) => [
    `${item.releaseVersionId}\u0000${item.channel}\u0000${item.routeAlias}`,
    item,
  ]),
);
const productionDeveloperRouteKeys = new Set(
  production.events
    .filter((item) => item.channel === "developerBeta")
    .map((item) => `${item.releaseVersionId}\u0000${item.routeAlias}`),
);
const editorialLineagesByCandidate = {};
let evidenceReferenceCount = 0;

for (const candidate of candidates) {
  const target = targetById.get(candidate.candidateId);
  const identity = candidate.proposedIdentity;
  const expectedLabel = `Public Beta ${identity.sequence}`;
  const expectedRoute = `public-beta-${identity.sequence}`;
  const productionKey =
    `${candidate.releaseVersionId}\u0000${identity.channel}\u0000${identity.routeAlias}`;
  const exactCheck = exactCheckByKey.get(productionKey);
  const expectedDate =
    expectedDates[candidate.version]?.[identity.sequence - 1];

  assert(Boolean(target), `${candidate.candidateId} is absent from assignment.json.`);
  assert(
    candidate.platform === "iOS" &&
      candidate.platformId === "platform-ios" &&
      candidate.originCohortId === "ios10-point-public-beta",
    `${candidate.candidateId} has an unexpected platform or cohort.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.label === expectedLabel &&
      identity.routeAlias === expectedRoute &&
      identity.appearanceDate === expectedDate &&
      identity.isRevision === false &&
      identity.availabilityState === "available" &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has an invalid or drifted public-beta identity.`,
  );
  assert(
    target?.appearanceDate === identity.appearanceDate &&
      target?.displayedLabel === identity.label &&
      target?.routeAlias === identity.routeAlias,
    `${candidate.candidateId} differs from its assignment target.`,
  );
  assert(
    candidate.ordinalBasis === "explicit",
    `${candidate.candidateId} does not retain an explicit ordinal.`,
  );
  assert(
    candidate.candidateStatus === "needsEvidenceReview" &&
      candidate.review.required === true &&
      candidate.review.reviewer === null &&
      candidate.review.reviewedAt === null,
    `${candidate.candidateId} is not frozen pending independent review.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
    `${candidate.candidateId} has unsafe authorization flags.`,
  );
  assert(
    candidate.productionReconciliation.queriedAt === production.capturedAt &&
      candidate.productionReconciliation.exactIdentityMatches === 0 &&
      exactCheck?.exactIdentityMatchCount === 0 &&
      exactCheck?.routeAliasMatchCount === 0 &&
      exactCheck?.channelSequenceDateMatchCount === 0,
    `${candidate.candidateId} does not reconcile to zero production matches.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      candidate.build === undefined &&
      candidate.contentDisposition === "timelineOnly",
    `${candidate.candidateId} includes an unsupported build or content claim.`,
  );

  const editorialFamilies = new Set();
  for (const ref of candidate.evidenceRefs) {
    evidenceReferenceCount += 1;
    assert(
      ref.kind === "packetSource" &&
        ref.packetPath === `${packetPath}/sources.json`,
      `${candidate.candidateId} has a misrouted evidence reference.`,
    );
    const source = sourceById.get(ref.sourceId);
    assert(
      Boolean(source),
      `${candidate.candidateId} references missing source ${ref.sourceId}.`,
    );
    if (
      source?.sourceClass === "journalism" &&
      source.lineage.independentForCorroboration
    ) {
      editorialFamilies.add(source.lineage.publisherFamily);
    }
  }
  editorialLineagesByCandidate[candidate.candidateId] =
    editorialFamilies.size;

  if (
    candidate.candidateId ===
    "candidate:apple:ios:10.2.1:public-beta-3"
  ) {
    assert(
      editorialFamilies.size === 1 &&
        candidate.evidenceState === "reported" &&
        candidate.identityStatus === "unverified",
      "iOS 10.2.1 Public Beta 3 no longer preserves its one-editorial-lineage exception.",
    );
  } else {
    assert(
      editorialFamilies.size >= 2 &&
        candidate.evidenceState === "corroborated" &&
        candidate.identityStatus === "confirmed",
      `${candidate.candidateId} lacks two independent editorial lineages or has an overstated/understated evidence state.`,
    );
  }

  if (["10.1", "10.2", "10.3"].includes(candidate.version)) {
    assert(
      candidate.pairedDeveloperRoute?.routeAlias ===
        `beta-${identity.sequence}` &&
        productionDeveloperRouteKeys.has(
          `${candidate.releaseVersionId}\u0000${candidate.pairedDeveloperRoute.routeAlias}`,
        ),
      `${candidate.candidateId} does not resolve to its production developer route.`,
    );
  } else {
    assert(
      candidate.pairedDeveloperRoute === null,
      `${candidate.candidateId} invents a paired developer route despite the release-level audit gap.`,
    );
  }
}
checks.assignmentTargetsResolved = candidates.filter((item) =>
  targetById.has(item.candidateId),
).length;
checks.evidenceReferencesResolved = evidenceReferenceCount;
checks.editorialLineagesByCandidate = editorialLineagesByCandidate;

for (const [version, dates] of Object.entries(expectedDates)) {
  const observed = candidates
    .filter((item) => item.version === version)
    .sort(
      (left, right) =>
        left.proposedIdentity.sequence - right.proposedIdentity.sequence,
    )
    .map((item) => item.proposedIdentity.appearanceDate);
  assert(
    sameJson(observed, dates),
    `${version} date list drifted: ${JSON.stringify(observed)}.`,
  );
}
checks.correctedLeadDates = {
  "candidate:apple:ios:10.2:public-beta-3":
    candidateById.get("candidate:apple:ios:10.2:public-beta-3")
      ?.proposedIdentity.appearanceDate,
  "candidate:apple:ios:10.3:public-beta-4":
    candidateById.get("candidate:apple:ios:10.3:public-beta-4")
      ?.proposedIdentity.appearanceDate,
  "candidate:apple:ios:10.3.2:public-beta-3":
    candidateById.get("candidate:apple:ios:10.3.2:public-beta-3")
      ?.proposedIdentity.appearanceDate,
};
assert(
  sameJson(checks.correctedLeadDates, {
    "candidate:apple:ios:10.2:public-beta-3": "2016-11-15",
    "candidate:apple:ios:10.3:public-beta-4": "2017-02-28",
    "candidate:apple:ios:10.3.2:public-beta-3": "2017-04-18",
  }),
  "Corrected lead dates drifted.",
);

checks.productionCounts = production.productionCounts;
assert(
  production.productionCounts.totalReleaseEvents === 2068 &&
    production.productionCounts.scopedReleaseEvents === 25 &&
    production.productionCounts.scopedPublicBetaEvents === 0 &&
    production.productionCounts.scopedDeveloperBetaEvents === 19 &&
    production.exactChecks.length === 34,
  "Production snapshot counts do not match the frozen reconciliation.",
);
const observedDeveloperGaps = production.developerBetaAudit
  .filter((item) => item.auditGap)
  .map((item) => item.version)
  .sort();
checks.developerBetaAuditGaps = observedDeveloperGaps;
assert(
  sameJson(observedDeveloperGaps, ["10.2.1", "10.3.2", "10.3.3"]),
  `Developer audit gaps drifted: ${JSON.stringify(observedDeveloperGaps)}.`,
);
assert(
  sameJson(
    candidatesDocument.developerBetaAuditGaps
      .map((item) => item.version)
      .sort(),
    observedDeveloperGaps,
  ),
  "Candidate document developer-audit gaps do not match production.",
);

let rawEvidenceArtifactsReproduced = 0;
let selectedEvidenceArtifactsReproduced = 0;
for (const source of sources) {
  const rawPath = path.join(repoRoot, source.evidence.rawPath);
  const selectedPath = path.join(repoRoot, source.evidence.selectedPath);
  try {
    const [raw, selected, rawStat, selectedStat] = await Promise.all([
      readFile(rawPath),
      readFile(selectedPath),
      stat(rawPath),
      stat(selectedPath),
    ]);
    rawEvidenceArtifactsReproduced += 1;
    selectedEvidenceArtifactsReproduced += 1;
    assert(
      rawStat.size === source.evidence.rawBytes &&
        sha256(raw) === source.evidence.rawSha256,
      `${source.sourceId} raw evidence hash or byte count failed.`,
    );
    assert(
      selectedStat.size === source.evidence.selectedTextBytes &&
        sha256(selected) === source.evidence.selectedTextSha256,
      `${source.sourceId} selected evidence hash or byte count failed.`,
    );
  } catch (error) {
    errors.push(
      `${source.sourceId} evidence could not be reproduced: ${
        error instanceof Error ? error.message : String(error)
      }.`,
    );
  }
}
checks.rawEvidenceArtifactsReproduced = rawEvidenceArtifactsReproduced;
checks.selectedEvidenceArtifactsReproduced =
  selectedEvidenceArtifactsReproduced;
checks.evidenceHashesReproduced =
  rawEvidenceArtifactsReproduced === sources.length &&
  selectedEvidenceArtifactsReproduced === sources.length &&
  !errors.some((item) => item.includes("evidence hash"));

assert(
  assignment.safety.sanityMutationAllowed === false &&
    assignment.safety.publicationAuthorized === false &&
    assignment.safety.stableEventIdCreationAllowed === false &&
    assignment.safety.deploymentAllowed === false,
  "Assignment safety lock is not intact.",
);
assert(
  review.independentOfResearcher === false &&
    review.verdict === "pendingIndependentReview" &&
    review.authorization.chronologyApprovedCandidateCount === 0 &&
    review.authorization.publicationEligible === false &&
    review.authorization.sanityMutationAllowed === false &&
    review.authorization.stableEventIdCreationAllowed === false &&
    review.authorization.deploymentAllowed === false,
  "Review file overstates independence or authorization.",
);
checks.sanityWritesPerformed = 0;
checks.deploymentsPerformed = 0;
checks.buildClaimsIncluded = candidates.filter(
  (item) => item.build !== undefined,
).length;
checks.substantiveChangeClaimsIncluded =
  candidatesDocument.summary.substantiveChangeClaimsIncluded;
checks.independentEvidenceReviewComplete = false;

const lockFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "report.md",
  "production-snapshot.json",
];
const fileLocks = {};
for (const filename of lockFiles) {
  const bytes = await readFile(path.join(here, filename));
  fileLocks[filename] = {
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  };
}

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator: "codex-scope-beta-gap-program-self-check",
  status:
    errors.length === 0
      ? "passedSelfCheckPendingIndependentReview"
      : "failed",
  checks,
  errors,
  fileLocks,
  limitations: [
    "The researcher performed this mechanical self-check; it is not an independent chronology review.",
    "iOS 10.2.1 Public Beta 3 remains below the two-editorial-lineage threshold.",
    "Three public appearance dates are proposed corrections to supplied developer-article dates and require independent adjudication.",
    "Developer-beta chronology gaps for iOS 10.2.1, 10.3.2, and 10.3.3 are reported but intentionally not researched or proposed here.",
  ],
};

await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      status: validation.status,
      errorCount: errors.length,
      candidateCount: checks.candidateCount,
      sourceCount: checks.sourceCount,
      evidenceReferencesResolved: checks.evidenceReferencesResolved,
      evidenceArtifactsReproduced:
        checks.rawEvidenceArtifactsReproduced,
      sharedCandidateSchemaValid: checks.sharedCandidateSchemaValid,
      developerBetaAuditGaps: checks.developerBetaAuditGaps,
    },
    null,
    2,
  ),
);

if (errors.length > 0) process.exitCode = 1;
