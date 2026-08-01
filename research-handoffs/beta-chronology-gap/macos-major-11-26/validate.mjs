import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-macos-major-11-26";
const relativePacketDir =
  "research-handoffs/beta-chronology-gap/macos-major-11-26";
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
const report = await readFile(path.join(here, "report.md"), "utf8");

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
const exceptionalAppearances = candidatesDocument.exceptionalAppearances;
const notProposed = candidatesDocument.notProposed;
const sourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);

checks.candidateCount = candidates.length;
checks.sourceCount = sources.length;
checks.exceptionalAppearanceCount = exceptionalAppearances.length;
checks.notProposedCount = notProposed.length;
checks.conflictCount = conflictsDocument.conflicts.length;

assert(candidates.length === 41, `Expected 41 candidates; found ${candidates.length}.`);
assert(sources.length === 65, `Expected 65 source records; found ${sources.length}.`);
assert(
  exceptionalAppearances.length === 2,
  `Expected 2 exceptional appearances; found ${exceptionalAppearances.length}.`,
);
assert(
  notProposed.length === 4,
  `Expected 4 not-proposed records; found ${notProposed.length}.`,
);
assert(
  conflictsDocument.conflictCount === 9 &&
    conflictsDocument.conflicts.length === 9,
  "Conflict count is not the frozen value of 9.",
);
assert(
  candidatesDocument.existingMatches.length === 0,
  "No exact existing production matches should be present.",
);

const expectedByVersion = {
  "11.0": 6,
  "12.0": 9,
  "13.0": 9,
  "14.0": 5,
  "15.0": 6,
  "26.0": 6,
};
const expectedDates = new Map([
  ["11.0:1", "2020-08-06"],
  ["11.0:2", "2020-08-20"],
  ["11.0:3", "2020-09-08"],
  ["11.0:4", "2020-09-22"],
  ["11.0:5", "2020-09-30"],
  ["11.0:6", "2020-10-15"],
  ["12.0:1", "2021-07-01"],
  ["12.0:2", "2021-07-16"],
  ["12.0:4", "2021-07-28"],
  ["12.0:5", "2021-08-12"],
  ["12.0:6", "2021-08-31"],
  ["12.0:7", "2021-09-22"],
  ["12.0:8", "2021-09-29"],
  ["12.0:9", "2021-10-07"],
  ["12.0:10", "2021-10-13"],
  ["13.0:1", "2022-07-11"],
  ["13.0:2", "2022-07-28"],
  ["13.0:3", "2022-08-09"],
  ["13.0:4", "2022-08-26"],
  ["13.0:5", "2022-09-09"],
  ["13.0:6", "2022-09-21"],
  ["13.0:7", "2022-09-28"],
  ["13.0:8", "2022-10-05"],
  ["13.0:9", "2022-10-11"],
  ["14.0:1", "2023-07-12"],
  ["14.0:2", "2023-07-31"],
  ["14.0:3", "2023-08-09"],
  ["14.0:4", "2023-08-22"],
  ["14.0:5", "2023-08-30"],
  ["15.0:1", "2024-07-15"],
  ["15.0:2", "2024-07-24"],
  ["15.0:3", "2024-08-06"],
  ["15.0:4", "2024-08-12"],
  ["15.0:5", "2024-08-20"],
  ["15.0:6", "2024-08-28"],
  ["26.0:1", "2025-07-21"],
  ["26.0:2", "2025-08-07"],
  ["26.0:3", "2025-08-14"],
  ["26.0:4", "2025-08-18"],
  ["26.0:5", "2025-08-25"],
  ["26.0:6", "2025-09-02"],
]);
const keyFor = (version, sequence) => `${version}:${sequence}`;

checks.candidatesByVersion = countBy(candidates, (candidate) => candidate.version);
checks.candidatesByIdentityStatus = countBy(
  candidates,
  (candidate) => candidate.identityStatus,
);
checks.candidatesByEvidenceState = countBy(
  candidates,
  (candidate) => candidate.evidenceState,
);
checks.candidatesByProductionStatus = countBy(
  candidates,
  (candidate) => candidate.productionReconciliation.status,
);

assert(
  sameJson(checks.candidatesByVersion, expectedByVersion),
  `Version counts drifted: ${JSON.stringify(checks.candidatesByVersion)}.`,
);
assert(
  sameJson(checks.candidatesByIdentityStatus, {
    confirmed: 33,
    conflict: 8,
  }),
  `Identity-status counts drifted: ${JSON.stringify(checks.candidatesByIdentityStatus)}.`,
);
assert(
  sameJson(checks.candidatesByEvidenceState, {corroborated: 41}),
  "Every candidate must remain corroborated.",
);
assert(
  sameJson(checks.candidatesByProductionStatus, {confirmedMissing: 41}),
  "Every candidate must remain confirmedMissing in production.",
);
assert(
  assignment.numberedTargetCount === 41 &&
    assignment.exceptionalAppearanceCount === 2 &&
    assignment.observedAppearanceCount === 43 &&
    assignment.numberedTargets.length === 41 &&
    assignment.exceptionalAppearances.length === 2,
  "Assignment appearance counts drifted from 41 routes plus 2 returns.",
);

const candidateIds = candidates.map((candidate) => candidate.candidateId);
const identityKeys = candidates.map(
  (candidate) =>
    `${candidate.releaseVersionId}\u0000${candidate.proposedIdentity.channel}\u0000${candidate.proposedIdentity.routeAlias}`,
);
assert(
  new Set(candidateIds).size === candidates.length,
  "Candidate IDs are not unique.",
);
assert(
  new Set(identityKeys).size === candidates.length,
  "Proposed production identity keys are not unique.",
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

const assignmentById = new Map(
  assignment.numberedTargets.map((target) => [target.candidateId, target]),
);
const productionCheckByKey = new Map(
  productionSnapshot.exactChecks.map((check) => [
    keyFor(check.version, check.sequence),
    check,
  ]),
);
let evidenceReferenceCount = 0;

for (const candidate of candidates) {
  const identity = candidate.proposedIdentity;
  const key = keyFor(candidate.version, identity.sequence);
  const expectedDate = expectedDates.get(key);
  const expectedRoute = `public-beta-${identity.sequence}`;
  const expectedLabel = `Public Beta ${identity.sequence}`;
  const target = assignmentById.get(candidate.candidateId);
  const productionCheck = productionCheckByKey.get(key);

  assert(Boolean(expectedDate), `${candidate.candidateId} is outside the frozen route set.`);
  assert(
    identity.appearanceDate === expectedDate,
    `${candidate.candidateId} date drifted from ${expectedDate}.`,
  );
  assert(
    candidate.platform === "macOS" &&
      candidate.platformId === "platform-macos" &&
      candidate.originCohortId === "macos-major-11-26-public-beta",
    `${candidate.candidateId} has an unexpected platform or cohort.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.routeAlias === expectedRoute &&
      identity.label === expectedLabel &&
      identity.isRevision === false &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has an invalid proposed identity.`,
  );
  const shouldBeReplaced =
    key === "13.0:5" || key === "26.0:1";
  assert(
    identity.availabilityState ===
      (shouldBeReplaced ? "replaced" : "available"),
    `${candidate.candidateId} has an unexpected availability state.`,
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
    `${candidate.candidateId} is not frozen for independent evidence review.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      !Object.hasOwn(candidate, "build"),
    `${candidate.candidateId} improperly includes build evidence.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
    `${candidate.candidateId} has unsafe authorization flags.`,
  );
  assert(
    candidate.productionReconciliation.queriedAt ===
      productionSnapshot.capturedAt &&
      candidate.productionReconciliation.exactIdentityMatches === 0 &&
      productionCheck?.exactIdentityMatches === 0,
    `${candidate.candidateId} does not match the read-only production snapshot.`,
  );
  assert(
    target?.appearanceDate === identity.appearanceDate &&
      target?.displayedLabel === identity.label &&
      target?.routeAlias === identity.routeAlias &&
      target?.availabilityState === identity.availabilityState,
    `${candidate.candidateId} differs from assignment.json.`,
  );

  const independentFamilies = new Set();
  const contemporaryFamilies = new Set();
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
      if (source.sourceClass.startsWith("contemporaneous")) {
        contemporaryFamilies.add(source.lineage.publisherFamily);
      }
    }
  }
  assert(
    independentFamilies.size >= 2,
    `${candidate.candidateId} has fewer than two independent publisher families.`,
  );
  assert(
    contemporaryFamilies.size >= 2,
    `${candidate.candidateId} has fewer than two contemporary publisher families.`,
  );
}
checks.evidenceReferencesResolved = evidenceReferenceCount;
checks.assignmentTargetsResolved = candidates.filter((candidate) =>
  assignmentById.has(candidate.candidateId),
).length;

assert(
  !candidates.some(
    (candidate) =>
      candidate.version === "12.0" &&
      candidate.proposedIdentity.sequence === 3,
  ),
  "A fabricated macOS 12.0 Public Beta 3 candidate is present.",
);
assert(
  !candidates.some(
    (candidate) =>
      candidate.version === "14.0" &&
      candidate.proposedIdentity.sequence === 6,
  ),
  "A fabricated macOS 14.0 Public Beta 6 candidate is present.",
);

const exceptionalById = new Map(
  exceptionalAppearances.map((item) => [item.appearanceId, item]),
);
assert(
  exceptionalById.get(
    "exceptional:apple:macos:13.0:public-beta-5-return",
  )?.appearanceDate === "2022-09-10",
  "Ventura Public Beta 5 return is missing or misdated.",
);
assert(
  exceptionalById.get(
    "exceptional:apple:macos:26.0:public-beta-1-official-return",
  )?.appearanceDate === "2025-07-24",
  "Tahoe Public Beta 1 official return is missing or misdated.",
);
for (const appearance of exceptionalAppearances) {
  assert(
    candidateIds.includes(appearance.relationshipToCandidate),
    `${appearance.appearanceId} does not resolve to a candidate.`,
  );
  assert(
    appearance.evidenceRefs.every((sourceId) => sourceById.has(sourceId)),
    `${appearance.appearanceId} references an unknown source.`,
  );
}
assert(
  sameJson(
    assignment.exceptionalAppearances.map((item) => item.appearanceId),
    exceptionalAppearances.map((item) => item.appearanceId),
  ),
  "Assignment and candidate exceptional-appearance lists differ.",
);

const expectedNotProposedIds = [
  "not-proposed:apple:macos:12.0:public-beta-3-skipped",
  "not-proposed:apple:macos:13.0:public-beta-5-return",
  "not-proposed:apple:macos:14.0:apparent-public-beta-6",
  "not-proposed:apple:macos:26.0:public-beta-1-official-return",
];
assert(
  sameJson(
    notProposed.map((item) => item.recordId),
    expectedNotProposedIds,
  ),
  "Not-proposed record identities drifted.",
);
for (const item of notProposed) {
  assert(
    item.evidenceRefs.length >= 2 &&
      item.evidenceRefs.every((sourceId) => sourceById.has(sourceId)),
    `${item.recordId} lacks two resolved evidence references.`,
  );
  assert(
    item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false,
    `${item.recordId} has unsafe flags.`,
  );
}

let rawByteTotal = 0;
for (const source of sources) {
  assert(
    typeof source.canonicalUrl === "string" && source.canonicalUrl.length > 0,
    `${source.sourceId} lacks a canonical URL.`,
  );
  assert(
    source.lineage.independentForCorroboration === true &&
      source.lineage.publisherFamily.length > 0,
    `${source.sourceId} lacks publisher-lineage metadata.`,
  );
  assert(
    typeof source.evidence.locator === "string" &&
      source.evidence.locator.length > 30,
    `${source.sourceId} lacks a claim-specific locator.`,
  );
  const selected = source.evidence.selectedText;
  assert(
    selected.wordCount > 0 &&
      selected.wordCount <= selected.maxWords &&
      selected.maxWords === 20 &&
      selected.text.split(/\s+/).filter(Boolean).length === selected.wordCount,
    `${source.sourceId} has invalid bounded identification text.`,
  );
  const absoluteRawPath = path.join(repoRoot, source.evidence.rawPath);
  let raw;
  try {
    raw = await readFile(absoluteRawPath);
  } catch {
    errors.push(`${source.sourceId} raw evidence is missing at ${source.evidence.rawPath}.`);
    continue;
  }
  rawByteTotal += raw.byteLength;
  const rawStat = await stat(absoluteRawPath);
  assert(
    rawStat.isFile() &&
      raw.byteLength === source.evidence.rawBytes &&
      sha256(raw) === source.evidence.rawSha256,
    `${source.sourceId} raw byte count or SHA-256 does not match.`,
  );
}
checks.rawEvidenceBytesVerified = rawByteTotal;
checks.rawEvidenceFilesVerified = sources.length;

assert(
  productionSnapshot.projectId === "lh3yswzu" &&
    productionSnapshot.dataset === "production" &&
    productionSnapshot.perspective === "published" &&
    productionSnapshot.useCdn === false,
  "Production snapshot query context drifted.",
);
assert(
  productionSnapshot.safety.queryOnly === true &&
    productionSnapshot.safety.sanityMutationPerformed === false,
  "Production snapshot is not explicitly read-only.",
);
assert(
  productionSnapshot.expectedIdentityCount === 41 &&
    productionSnapshot.exactChecks.length === 41 &&
    productionSnapshot.exactChecks.every(
      (check) =>
        check.exactIdentityMatches === 0 && check.matches.length === 0,
    ),
  "Production exact checks do not preserve 41 zero-match identities.",
);
assert(
  productionSnapshot.versions.length === 6 &&
    productionSnapshot.versions.every(
      (version) =>
        version.platform === "macOS" &&
        expectedByVersion[version.version] !== undefined,
    ),
  "Production snapshot does not preserve all six releaseVersion parents.",
);
assert(
  productionSnapshot.productionCounts.macOSPublicBetaEventsAllVersions === 0 &&
    productionSnapshot.productionCounts.scopedPublicBetaEvents === 0 &&
    productionSnapshot.scopedPublicBetaEvents.length === 0,
  "Production snapshot unexpectedly contains macOS public-beta events.",
);
checks.productionExactChecks = productionSnapshot.exactChecks.length;

for (const document of [
  assignment,
  sourcesDocument,
  candidatesDocument,
  conflictsDocument,
]) {
  assert(
    document.safety.sanityMutationAllowed === false &&
      document.safety.publicationAuthorized === false &&
      document.safety.stableEventIdCreationAllowed === false,
    "A packet document has unsafe top-level authorization.",
  );
}
assert(
  review.independentOfResearcher === false &&
    review.verdict === "selfCheckPassedPendingIndependentReview" &&
    review.authorization.chronologyApproved === false &&
    review.authorization.sanityMutationAllowed === false &&
    review.authorization.publicationAuthorized === false &&
    review.authorization.stableEventIdCreationAllowed === false,
  "review.json improperly represents an independent approval or authorization.",
);
assert(
  report.includes("no mutation or publication is authorized") &&
    report.includes("41 unique numbered public-beta routes") &&
    report.includes("two additional same-label lifecycle reappearances") &&
    report.includes("No build is proposed") &&
    report.includes("independent human reviewer"),
  "report.md is missing required scope, safety, or review-boundary text.",
);

const forbiddenIdentityKeys = new Set([
  "stableEventId",
  "priorProposedStableEventId",
  "proposedStableEventId",
]);
const findForbiddenKeys = (value, trail = "$") => {
  const findings = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      findings.push(...findForbiddenKeys(item, `${trail}[${index}]`));
    });
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenIdentityKeys.has(key)) {
        findings.push(`${trail}.${key}`);
      }
      findings.push(...findForbiddenKeys(child, `${trail}.${key}`));
    }
  }
  return findings;
};
const forbiddenKeyFindings = findForbiddenKeys({
  assignment,
  sourcesDocument,
  candidatesDocument,
  conflictsDocument,
  review,
});
assert(
  forbiddenKeyFindings.length === 0,
  `Stable production ID fields are present: ${forbiddenKeyFindings.join(", ")}.`,
);
checks.stableProductionIdsCreated = 0;

const lockFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "report.md",
  "review.json",
  "query-production.ts",
  "build-packet.mjs",
  "validate.mjs",
];
const lockedArtifacts = [];
for (const filename of lockFiles) {
  const raw = await readFile(path.join(here, filename));
  lockedArtifacts.push({
    path: `${relativePacketDir}/${filename}`,
    bytes: raw.byteLength,
    sha256: sha256(raw),
  });
}
checks.lockedArtifactCount = lockedArtifacts.length;

const valid = errors.length === 0;
const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  status: valid
    ? "passedSelfCheckPendingIndependentReview"
    : "failed",
  valid,
  validator: `${relativePacketDir}/validate.mjs`,
  checks,
  errors,
  lockedArtifacts,
  reviewBoundary: {
    independentReviewPerformed: false,
    chronologyApproved: false,
    nextStep:
      "Independent human chronology review is required before any mutation proposal.",
  },
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    sanityMutationPerformed: false,
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
      valid,
      candidateCount: candidates.length,
      sourceCount: sources.length,
      exceptionalAppearanceCount: exceptionalAppearances.length,
      conflictCount: conflictsDocument.conflicts.length,
      errorCount: errors.length,
      errors,
    },
    null,
    2,
  ),
);

if (!valid) process.exitCode = 1;
