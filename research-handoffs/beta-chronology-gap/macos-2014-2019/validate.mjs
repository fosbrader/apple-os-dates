import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

const batchId = "beta-chronology-gap-macos-2014-2019";
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const relativeBatchDir =
  "research-handoffs/beta-chronology-gap/macos-2014-2019";
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
  independentReview,
  candidateRegisterSchema,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("sources.json"),
  readJson("candidates.json"),
  readJson("conflicts.json"),
  readJson("production-snapshot.json"),
  readJson("review.json"),
  readJson("independent-review.json"),
  readJson("../proposed-event-candidate.schema.json"),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["candidates.json", candidatesDocument],
  ["conflicts.json", conflictsDocument],
  ["production-snapshot.json", productionSnapshot],
  ["review.json", review],
  ["independent-review.json", independentReview],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}
checks.packetJsonParsed = 7;

const candidates = candidatesDocument.candidates;
const notProposed = candidatesDocument.notProposed;
const sources = sourcesDocument.sources;
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const candidateIds = candidates.map((candidate) => candidate.candidateId);
const identityKeys = candidates.map(
  (candidate) =>
    `${candidate.releaseVersionId}\u0000${candidate.proposedIdentity.channel}\u0000${candidate.proposedIdentity.routeAlias}`,
);

checks.candidateCount = candidates.length;
checks.notProposedCount = notProposed.length;
checks.sourceCount = sources.length;
checks.conflictCount = conflictsDocument.conflicts.length;
assert(candidates.length === 45, `Expected 45 candidates; found ${candidates.length}.`);
assert(notProposed.length === 3, `Expected 3 not-proposed records; found ${notProposed.length}.`);
assert(sources.length === 83, `Expected 83 sources; found ${sources.length}.`);
assert(
  conflictsDocument.conflictCount === conflictsDocument.conflicts.length &&
    conflictsDocument.conflicts.length === 9,
  "Conflict count is not the corrected frozen value of 9.",
);
assert(
  new Set(candidateIds).size === candidateIds.length,
  "Candidate IDs are not unique.",
);
assert(
  new Set(identityKeys).size === identityKeys.length,
  "Candidate releaseVersion/channel/route identities are not unique.",
);
assert(
  new Set(sources.map((source) => source.sourceId)).size === sources.length,
  "Source IDs are not unique.",
);

const expectedByVersion = {
  "10.10": 6,
  "10.11": 5,
  "10.12": 7,
  "10.13": 8,
  "10.14": 10,
  "10.15": 9,
};
const actualByVersion = countBy(candidates, (candidate) => candidate.version);
checks.candidatesByVersion = actualByVersion;
checks.candidatesByEvidenceState = countBy(
  candidates,
  (candidate) => candidate.evidenceState,
);
checks.candidatesByIdentityStatus = countBy(
  candidates,
  (candidate) => candidate.identityStatus,
);
assert(
  sameJson(actualByVersion, expectedByVersion),
  `Version counts drifted: ${JSON.stringify(actualByVersion)}.`,
);
assert(
  sameJson(candidatesDocument.summary.byVersion, expectedByVersion),
  "candidates.json summary.byVersion does not match the frozen version counts.",
);
assert(
  candidatesDocument.candidateCount === 45 &&
    candidatesDocument.summary.modelableAppearanceCandidateCount === 45,
  "Candidate summary does not preserve the frozen total of 45.",
);
assert(
  sameJson(checks.candidatesByEvidenceState, {
    corroborated: 39,
    reported: 6,
  }),
  "Evidence-state counts must remain 39 corroborated and 6 reported.",
);
assert(
  sameJson(checks.candidatesByIdentityStatus, {
    confirmed: 38,
    conflict: 1,
    unverified: 6,
  }),
  "Identity-state counts must remain 38 confirmed, 1 conflict, and 6 unverified.",
);
assert(
  candidatesDocument.summary.exceptionalHistoricalAppearanceCount === 2 &&
    candidatesDocument.summary.excludedApparentAppearanceCount === 1 &&
    candidatesDocument.summary.buildsIncluded === 0 &&
    candidatesDocument.summary.substantiveChangeClaimsIncluded === 0,
  "Candidate summary changed an exception, exclusion, build, or content-claim count.",
);

// Validate the candidate objects against the shared foundation's candidate
// definition without pretending this packet is the global candidate register.
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
    errors.push(`Shared candidate schema ${error.dataPath || "/"} ${error.message}.`);
  }
}

const assignmentTargetById = new Map(
  assignment.numberedTargets.map((target) => [target.candidateId, target]),
);
assert(
  assignment.numberedTargetCount === 45 &&
    assignment.numberedTargets.length === 45,
  "assignment.json does not contain exactly 45 numbered targets.",
);
assert(
  assignment.exceptionalAppearanceCount === 2 &&
    assignment.exceptionalAppearances.length === 2,
  "assignment.json does not preserve both exceptional historical appearances.",
);

for (const candidate of candidates) {
  const identity = candidate.proposedIdentity;
  const expectedLabel = `Public Beta ${identity.sequence}`;
  const expectedRoute = `public-beta-${identity.sequence}`;
  const target = assignmentTargetById.get(candidate.candidateId);
  assert(Boolean(target), `${candidate.candidateId} is missing from assignment.json.`);
  assert(
    candidate.platform === "macOS" &&
      candidate.platformId === "platform-macos" &&
      candidate.originCohortId === "macos-2014-2019-major-public-beta",
    `${candidate.candidateId} has an unexpected platform or cohort.`,
  );
  assert(
    identity.channel === "publicBeta" &&
      identity.label === expectedLabel &&
      identity.routeAlias === expectedRoute &&
      identity.isRevision === false &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has an invalid numbered public-beta identity.`,
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
    `${candidate.candidateId} has an unsafe authorization flag.`,
  );
  assert(
    candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.productionReconciliation.exactIdentityMatches === 0 &&
      candidate.productionReconciliation.queriedAt ===
        productionSnapshot.queriedAt,
    `${candidate.candidateId} does not match the frozen production reconciliation.`,
  );
  assert(
    target?.channel === identity.channel &&
      target?.routeAlias === identity.routeAlias &&
      target?.displayedLabel === identity.label &&
      target?.expectedAppearanceDate === identity.appearanceDate &&
      target?.expectedSequence === identity.sequence,
    `${candidate.candidateId} differs from its assignment target.`,
  );

  const independentFamilies = new Set();
  for (const ref of candidate.evidenceRefs) {
    assert(
      ref.kind === "packetSource" &&
        ref.packetPath === `${relativeBatchDir}/sources.json`,
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
  if (candidate.evidenceState === "corroborated") {
    assert(
      independentFamilies.size >= 2,
      `${candidate.candidateId} is corroborated by fewer than two independent publisher families.`,
    );
  }
}

const catalinaPb5Id =
  "candidate:apple:macos:10.15:public-beta-5";
const catalinaPb5 = candidates.find(
  (candidate) => candidate.candidateId === catalinaPb5Id,
);
const catalinaPb5Target = assignmentTargetById.get(catalinaPb5Id);
const catalinaPb5MacRumors = sourceById.get(
  "source-mr-macos-10-15-pb5",
);
const catalinaLivingChronology = sourceById.get(
  "source-iculture-catalina",
);
const catalinaPb5Conflict = conflictsDocument.conflicts.find(
  (conflict) =>
    conflict.conflictId === "catalina-public-beta-5-pacific-date",
);
assert(
  catalinaPb5?.proposedIdentity.appearanceDate === "2019-08-19" &&
    catalinaPb5Target?.expectedAppearanceDate === "2019-08-19",
  "Catalina Public Beta 5 was not corrected to 2019-08-19 in both candidate and assignment.",
);
assert(
  catalinaPb5MacRumors?.evidence.locator.includes("August 19") &&
    catalinaPb5MacRumors?.evidence.locator.includes("10:23 a.m. PDT") &&
    catalinaLivingChronology?.evidence.locator.includes(
      "August 20 at 08:32 CEST",
    ) &&
    catalinaLivingChronology?.evidence.locator.includes(
      "August 19 at 23:32 PDT",
    ),
  "Catalina Public Beta 5 source locators do not preserve the Pacific-date correction basis.",
);
assert(
  catalinaPb5Conflict?.decision.includes("2019-08-19") &&
    catalinaPb5Conflict?.sourceIds.includes(
      "source-mr-macos-10-15-pb5",
    ) &&
    catalinaPb5Conflict?.sourceIds.includes("source-iculture-catalina"),
  "Catalina Public Beta 5 correction conflict is missing or incomplete.",
);
checks.catalinaPublicBeta5CorrectionVerified = true;

checks.assignmentTargetsResolved = candidates.filter((candidate) =>
  assignmentTargetById.has(candidate.candidateId),
).length;
checks.evidenceReferencesResolved = candidates.reduce(
  (total, candidate) =>
    total +
    candidate.evidenceRefs.filter((ref) => sourceById.has(ref.sourceId)).length,
  0,
);

const notProposedById = new Map(
  notProposed.map((record) => [record.recordId, record]),
);
const originRecordId =
  "not-proposed:apple:macos:10.9.3:os-x-beta-seed-program";
const replacementRecordId =
  "not-proposed:apple:macos:10.11:public-beta-5-replacement-appearance";
const gmRecordId =
  "not-proposed:apple:macos:10.15:apparent-public-beta-10-gm";
for (const recordId of [originRecordId, replacementRecordId, gmRecordId]) {
  assert(notProposedById.has(recordId), `Missing not-proposed record ${recordId}.`);
}
for (const record of notProposed) {
  assert(
    record.flags.sanityMutationAllowed === false &&
      record.flags.publicationEligible === false,
    `${record.recordId} has an unsafe authorization flag.`,
  );
  for (const sourceId of record.evidenceRefs) {
    assert(
      sourceById.has(sourceId),
      `${record.recordId} references missing source ${sourceId}.`,
    );
  }
}
assert(
  !candidates.some((candidate) => candidate.version === "10.9.3"),
  "The unnumbered 10.9.3 Beta Seed appearance was incorrectly made a numbered candidate.",
);
assert(
  !candidates.some(
    (candidate) =>
      candidate.version === "10.15" &&
      candidate.proposedIdentity.sequence === 10,
  ),
  "Catalina's GM was incorrectly made Public Beta 10.",
);
const elCapPb5 = candidates.find(
  (candidate) =>
    candidate.version === "10.11" &&
    candidate.proposedIdentity.sequence === 5,
);
assert(
  elCapPb5?.proposedIdentity.availabilityState === "replaced" &&
    elCapPb5?.identityStatus === "conflict" &&
    elCapPb5?.ordinalBasis === "conflicted",
  "El Capitan Public Beta 5 does not preserve the withdrawal/replacement conflict.",
);
assert(
  assignment.explicitExclusion.recordId === gmRecordId,
  "assignment.json does not preserve the Catalina GM exclusion.",
);
checks.exceptionRecordsPreserved = 3;

assert(
  productionSnapshot.perspective === "published" &&
    productionSnapshot.allPublishedEventCount === 2068 &&
    productionSnapshot.macOSPublicBetaCount === 0 &&
    productionSnapshot.exactCandidateMatchCount === 0,
  "Production snapshot counts or perspective drifted.",
);
assert(
  productionSnapshot.safety.readOnly === true &&
    productionSnapshot.safety.sanityMutationPerformed === false,
  "Production snapshot no longer records a read-only query.",
);
assert(
  sameJson(productionSnapshot.missingReleaseVersionIds, [
    "version-macos-10-9-3",
  ]),
  "The frozen production snapshot must preserve the missing 10.9.3 parent.",
);
assert(
  productionSnapshot.existingReleaseVersionIds.length === 6 &&
    productionSnapshot.existingReleaseVersionIds.every((id) =>
      productionSnapshot.targetVersionIds.includes(id),
    ),
  "The frozen production releaseVersion reconciliation changed.",
);
checks.productionSnapshotReadOnly = true;

assert(
  review.independentOfResearcher === false &&
    review.verdict === "selfCheckPassedPendingIndependentReview",
  "review.json incorrectly claims an independent review.",
);
assert(
  review.independentReviewArtifact?.path ===
    `${relativeBatchDir}/independent-review.json` &&
    review.independentReviewArtifact?.verdict ===
      "partialPassWithRequiredCorrection" &&
    review.independentReviewArtifact?.requiredCorrectionApplied
      ?.candidateId === catalinaPb5Id &&
    review.independentReviewArtifact?.requiredCorrectionApplied
      ?.appearanceDate === "2019-08-19" &&
    review.independentReviewArtifact?.remainingIndependentReviewBlockers ===
      7,
  "review.json does not record the applied independent-review correction and seven remaining blockers.",
);
assert(
  independentReview.independentOfResearcher === true &&
    independentReview.verdict === "partialPassWithRequiredCorrection" &&
    independentReview.chronologyApprovedCandidateCount === 37 &&
    independentReview.candidateVerdict.requiresCandidateCorrection.includes(
      catalinaPb5Id,
    ) &&
    independentReview.decisions.some(
      (decision) =>
        decision.candidateId === catalinaPb5Id &&
        decision.requiredCorrection?.appearanceDate === "2019-08-19",
    ),
  "independent-review.json no longer contains the correction directive used by this re-freeze.",
);
const independentReviewBytes = await readFile(
  path.join(here, "independent-review.json"),
);
assert(
  sha256(independentReviewBytes) ===
    "f06cf803e2add0db6227005a2fee2fae97bd3abd5f5d47b980edb3863cd63e59",
  "independent-review.json changed while applying the required correction.",
);
checks.independentReviewArtifactPreserved = true;
assert(
  review.candidateVerdict.readyForIndependentChronologyReview.length === 38 &&
    review.candidateVerdict.needsAdditionalEvidenceOrModeling.length === 7,
  "Review buckets must remain 38 ready for independent review and 7 needing evidence/modeling.",
);
assert(
  review.authorization.independentChronologyReviewComplete === false &&
    review.authorization.publicationEligible === false &&
    review.authorization.sanityMutationAllowed === false &&
    review.authorization.deploymentAllowed === false,
  "review.json has an unsafe authorization flag.",
);
assert(
  review.checks.sanityMutationPerformed === false,
  "review.json claims a Sanity mutation occurred.",
);
checks.independentReviewStillRequired = true;

let rawSourceCount = 0;
let webOnlySourceCount = 0;
for (const source of sources) {
  assert(
    typeof source.canonicalUrl === "string" && source.canonicalUrl.length > 0,
    `${source.sourceId} has no canonical URL.`,
  );
  assert(
    typeof source.title === "string" && source.title.length > 0,
    `${source.sourceId} has no title.`,
  );
  const evidence = source.evidence;
  const rawFields = [evidence.rawPath, evidence.rawBytes, evidence.rawSha256];
  const hasRaw = rawFields.every((value) => value !== null);
  const hasNoRaw = rawFields.every((value) => value === null);
  assert(
    hasRaw || hasNoRaw,
    `${source.sourceId} has a partially populated raw-evidence triplet.`,
  );
  if (hasRaw) {
    rawSourceCount += 1;
    const bytes = await readFile(path.join(repoRoot, evidence.rawPath));
    assert(
      bytes.byteLength === evidence.rawBytes,
      `${source.sourceId} raw byte count changed.`,
    );
    assert(
      sha256(bytes) === evidence.rawSha256,
      `${source.sourceId} raw SHA-256 changed.`,
    );
  } else {
    webOnlySourceCount += 1;
    assert(
      evidence.captureMethod.includes("web") ||
        evidence.captureMethod.includes("browser"),
      `${source.sourceId} lacks raw evidence without a rendered-web capture note.`,
    );
  }
}
checks.rawSourceFilesVerified = rawSourceCount;
checks.webOnlySourcesVerified = webOnlySourceCount;
assert(
  rawSourceCount === 77 && webOnlySourceCount === 6,
  `Expected 77 raw sources and 6 web-only sources; found ${rawSourceCount} and ${webOnlySourceCount}.`,
);
assert(
  sourcesDocument.sourceCount === sources.length,
  "sources.json sourceCount does not match its source ledger.",
);

const lockedFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "review.json",
  "independent-review.json",
  "report.md",
  "build-packet.mjs",
  "query-production.ts",
];
const fileLocks = [];
for (const filename of lockedFiles) {
  const absolutePath = path.join(here, filename);
  const bytes = await readFile(absolutePath);
  fileLocks.push({
    path: `${relativeBatchDir}/${filename}`,
    bytes: (await stat(absolutePath)).size,
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
    candidates: candidates.length,
    notProposed: notProposed.length,
    sources: sources.length,
    rawSources: rawSourceCount,
    webOnlySources: webOnlySourceCount,
    conflicts: conflictsDocument.conflicts.length,
    independentChronologyApproved: 37,
    independentCorrectionApplied: 1,
    readyForIndependentChronologyReview:
      review.candidateVerdict.readyForIndependentChronologyReview.length,
    needsAdditionalEvidenceOrModeling:
      review.candidateVerdict.needsAdditionalEvidenceOrModeling.length,
  },
  blockers: [
    "The independent review is partial: 37 candidates were approved, its Catalina Public Beta 5 correction is now applied, and seven candidates remain blocked by evidence or modeling issues.",
    "OS X 10.9.3 has an unnumbered public Beta Seed identity and no production releaseVersion parent.",
    "El Capitan Public Beta 5 was withdrawn and reappeared under the same displayed identity, with an August 19/20 source-date conflict.",
    "Six late-cycle candidates remain reported pending stronger independent editorial corroboration.",
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
process.stdout.write(`${JSON.stringify(validation, null, 2)}\n`);
if (errors.length > 0) process.exitCode = 1;
