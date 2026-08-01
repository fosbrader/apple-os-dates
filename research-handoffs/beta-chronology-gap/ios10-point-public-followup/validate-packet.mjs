import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ios10-point-public-followup";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public-followup";
const parentPacketPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public";
const errors = [];
const checks = {};

const absolute = (relativePath) => path.join(repoRoot, relativePath);
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const readJson = async (relativePath) =>
  JSON.parse(await readFile(absolute(relativePath), "utf8"));
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};

const [
  assignment,
  sourcesDocument,
  reinspection,
  candidatesDocument,
  conflictsDocument,
  production,
  selfReview,
  parentSourcesDocument,
  parentReview,
  sharedSchema,
] = await Promise.all([
  readJson(`${packetPath}/assignment.json`),
  readJson(`${packetPath}/sources.json`),
  readJson(`${packetPath}/retained-source-reinspection.json`),
  readJson(`${packetPath}/candidates.json`),
  readJson(`${packetPath}/conflicts.json`),
  readJson(`${packetPath}/production-snapshot.json`),
  readJson(`${packetPath}/self-review.json`),
  readJson(`${parentPacketPath}/sources.json`),
  readJson(`${parentPacketPath}/independent-review.json`),
  readJson(
    "research-handoffs/beta-chronology-gap/proposed-event-candidate.schema.json",
  ),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["retained-source-reinspection.json", reinspection],
  ["conflicts.json", conflictsDocument],
  ["production-snapshot.json", production],
  ["self-review.json", selfReview],
]) {
  assert(
    document.batchId === batchId,
    `${filename} has unexpected batchId ${document.batchId}.`,
  );
}

assert(
  candidatesDocument.programId === "apple-beta-chronology-gap",
  "Candidate register has unexpected programId.",
);
assert(
  candidatesDocument.cohorts.length === 1 &&
    candidatesDocument.cohorts[0].cohortId ===
      "ios10-point-public-followup",
  "Candidate register has unexpected cohort.",
);

const candidates = candidatesDocument.candidates;
const sources = sourcesDocument.sources;
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const parentSourceById = new Map(
  parentSourcesDocument.sources.map((source) => [source.sourceId, source]),
);

checks.candidateCount = candidates.length;
checks.newSourceCount = sources.length;
checks.retainedSourceReinspectionCount = reinspection.sources.length;
checks.conflictCount = conflictsDocument.conflicts.length;

assert(
  assignment.targetCount === 2 && assignment.targets.length === 2,
  "Assignment does not contain exactly two targets.",
);
assert(candidates.length === 2, "Expected exactly two candidates.");
assert(sources.length === 9, "Expected exactly nine new sources.");
assert(
  reinspection.sources.length === 7,
  "Expected exactly seven retained-source reinspections.",
);
assert(
  conflictsDocument.conflictCount === 5 &&
    conflictsDocument.conflicts.length === 5,
  "Expected exactly five preserved conflicts/qualifications.",
);
assert(
  new Set(candidates.map((candidate) => candidate.candidateId)).size === 2,
  "Candidate IDs are not unique.",
);
assert(
  new Set(sources.map((source) => source.sourceId)).size === 9,
  "New source IDs are not unique.",
);

const draft7Schema = JSON.parse(
  JSON.stringify(sharedSchema).replaceAll("#/$defs/", "#/definitions/"),
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

const expectedCandidates = {
  "candidate:apple:ios:10.2:public-beta-3": {
    version: "10.2",
    releaseVersionId: "version-ios-10-2",
    appearanceDate: "2016-11-14",
    identityStatus: "conflict",
    requiredPublisherFamilies: [
      "MacRumors",
      "気になる、記になる…",
      "ThinkApple",
    ],
  },
  "candidate:apple:ios:10.2.1:public-beta-3": {
    version: "10.2.1",
    releaseVersionId: "version-ios-10-2-1",
    appearanceDate: "2017-01-09",
    identityStatus: "confirmed",
    requiredPublisherFamilies: ["MacRumors", "気になる、記になる…"],
  },
};

const exactCheckByVariant = new Map(
  production.exactChecks.map((check) => [
    `${check.candidateId}\u0000${check.variantId}`,
    check,
  ]),
);

for (const candidate of candidates) {
  const expected = expectedCandidates[candidate.candidateId];
  assert(Boolean(expected), `Unexpected candidate ${candidate.candidateId}.`);
  if (!expected) continue;

  const identity = candidate.proposedIdentity;
  assert(
    candidate.platform === "iOS" &&
      candidate.platformId === "platform-ios" &&
      candidate.originCohortId === "ios10-point-public-followup" &&
      candidate.version === expected.version &&
      candidate.releaseVersionId === expected.releaseVersionId,
    `${candidate.candidateId} has unexpected scope identity.`,
  );
  assert(
    identity.label === "Public Beta 3" &&
      identity.routeAlias === "public-beta-3" &&
      identity.channel === "publicBeta" &&
      identity.sequence === 3 &&
      identity.appearanceDate === expected.appearanceDate &&
      identity.isRevision === false &&
      identity.availabilityState === "available" &&
      identity.closesReleaseCycle === false,
    `${candidate.candidateId} has an invalid proposed identity.`,
  );
  assert(
    candidate.ordinalBasis === "explicit" &&
      candidate.candidateStatus === "needsEvidenceReview" &&
      candidate.identityStatus === expected.identityStatus &&
      candidate.evidenceState === "corroborated",
    `${candidate.candidateId} overstates, understates, or changes its research state.`,
  );
  assert(
    candidate.review.required === true &&
      candidate.review.reviewer === null &&
      candidate.review.reviewedAt === null,
    `${candidate.candidateId} is not pending a different independent reviewer.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false &&
      candidate.buildEvidenceStatus === "absent" &&
      candidate.build === undefined &&
      candidate.contentDisposition === "timelineOnly",
    `${candidate.candidateId} contains unsafe flags or unsupported content/build claims.`,
  );
  assert(
    candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.productionReconciliation.queriedAt ===
        production.capturedAt &&
      candidate.productionReconciliation.exactIdentityMatches === 0,
    `${candidate.candidateId} has invalid production reconciliation.`,
  );

  const families = new Set();
  for (const ref of candidate.evidenceRefs) {
    const source =
      ref.packetPath === `${packetPath}/sources.json`
        ? sourceById.get(ref.sourceId)
        : ref.packetPath === `${parentPacketPath}/sources.json`
          ? parentSourceById.get(ref.sourceId)
          : undefined;
    assert(
      ref.kind === "packetSource" && Boolean(source),
      `${candidate.candidateId} has unresolved evidence ${ref.sourceId}.`,
    );
    if (source?.lineage?.independentForCorroboration) {
      families.add(source.lineage.publisherFamily);
    }
  }
  for (const family of expected.requiredPublisherFamilies) {
    assert(
      families.has(family),
      `${candidate.candidateId} is missing publisher family ${family}.`,
    );
  }
  assert(
    families.size >= 2,
    `${candidate.candidateId} lacks two independent editorial publisher families.`,
  );
}

assert(
  production.perspective === "published" &&
    production.useCdn === false &&
    production.productionCounts.scopedPublicBetaEvents === 0,
  "Production query was not a fresh published/no-CDN zero-public-beta snapshot.",
);
assert(
  production.exactChecks.length === 3 &&
    production.exactChecks.every(
      (check) =>
        check.routeIdentityMatchCount === 0 &&
        check.sequenceDateMatchCount === 0 &&
        check.fullCandidateMatchCount === 0,
    ),
  "A queried identity variant has a production match.",
);
assert(
  exactCheckByVariant.has(
    "candidate:apple:ios:10.2:public-beta-3\u0000corrected-pacific-date",
  ) &&
    exactCheckByVariant.has(
      "candidate:apple:ios:10.2:public-beta-3\u0000frozen-parent-date",
    ) &&
    exactCheckByVariant.has(
      "candidate:apple:ios:10.2.1:public-beta-3\u0000frozen-parent-date",
    ),
  "Production snapshot does not include all three required identity variants.",
);
checks.production = {
  capturedAt: production.capturedAt,
  perspective: production.perspective,
  useCdn: production.useCdn,
  exactVariantCount: production.exactChecks.length,
  exactMatches: 0,
  scopedPublicBetaEvents:
    production.productionCounts.scopedPublicBetaEvents,
};

let rawArtifactCount = 0;
let selectedArtifactCount = 0;
for (const source of sources) {
  const [raw, selected] = await Promise.all([
    readFile(absolute(source.evidence.rawPath)),
    readFile(absolute(source.evidence.selectedPath)),
  ]);
  assert(
    raw.byteLength === source.evidence.rawBytes &&
      sha256(raw) === source.evidence.rawSha256,
    `New raw evidence mismatch for ${source.sourceId}.`,
  );
  assert(
    selected.byteLength === source.evidence.selectedTextBytes &&
      sha256(selected) === source.evidence.selectedTextSha256,
    `New selected evidence mismatch for ${source.sourceId}.`,
  );
  const excerptLine = selected
    .toString("utf8")
    .split("\n")
    .find((line) => line.startsWith("Bounded identification excerpt: "));
  const excerpt = excerptLine?.replace(
    "Bounded identification excerpt: ",
    "",
  );
  assert(Boolean(excerpt), `Missing bounded excerpt for ${source.sourceId}.`);
  assert(
    (excerpt?.trim().split(/\s+/).length ?? 100) <= 20,
    `Identification excerpt exceeds 20 whitespace-delimited words for ${source.sourceId}.`,
  );
  rawArtifactCount += 1;
  selectedArtifactCount += 1;
}
checks.newRawArtifactsReproduced = rawArtifactCount;
checks.newSelectedArtifactsReproduced = selectedArtifactCount;

for (const source of reinspection.sources) {
  const parentRecord = parentSourceById.get(source.sourceId);
  assert(Boolean(parentRecord), `Reinspected source ${source.sourceId} missing.`);
  const [raw, selected] = await Promise.all([
    readFile(absolute(source.parentRawPath)),
    readFile(absolute(source.parentSelectedPath)),
  ]);
  assert(
    raw.byteLength === source.parentRawBytes &&
      sha256(raw) === source.parentRawSha256 &&
      source.parentRawHashVerified === true,
    `Reinspected raw evidence mismatch for ${source.sourceId}.`,
  );
  assert(
    selected.byteLength === source.parentSelectedTextBytes &&
      sha256(selected) === source.parentSelectedTextSha256 &&
      source.parentSelectedHashVerified === true,
    `Reinspected selected evidence mismatch for ${source.sourceId}.`,
  );
}
checks.retainedRawArtifactsReproduced = reinspection.sources.length;
checks.retainedSelectedArtifactsReproduced = reinspection.sources.length;

for (const [filename, expected] of Object.entries(
  parentReview.reviewedPacketLocks,
)) {
  const bytes = await readFile(absolute(`${parentPacketPath}/${filename}`));
  assert(
    bytes.byteLength === expected.bytes &&
      sha256(bytes) === expected.sha256,
    `Frozen parent packet drifted at ${filename}.`,
  );
  const reinspectedLock = reinspection.verifiedParentPacketLocks[filename];
  assert(
    reinspectedLock?.bytes === expected.bytes &&
      reinspectedLock?.sha256 === expected.sha256,
    `Reinspection lock disagrees for ${filename}.`,
  );
}
checks.parentPacketLocksReproduced = Object.keys(
  parentReview.reviewedPacketLocks,
).length;

const conflictById = new Map(
  conflictsDocument.conflicts.map((conflict) => [
    conflict.conflictId,
    conflict,
  ]),
);
assert(
  conflictById.get("ios102-public-beta-3-first-appearance-date")
    ?.researchDisposition?.proposedDate === "2016-11-14",
  "Date conflict does not preserve the November 14 research proposal.",
);
assert(
  conflictById.get("ios102-public-beta-3-first-appearance-date")
    ?.requiredHandling?.includes("Neowin"),
  "Date conflict does not require preservation of the Neowin position.",
);
assert(
  conflictById.has("ios102-public-beta-3-cross-zone-calendar-dates") &&
    conflictById.has("ios102-public-beta-3-redmondpie-metadata") &&
    conflictById.has("ios1021-public-beta-3-editorial-lineage-gap") &&
    conflictById.has(
      "ios1021-public-beta-3-kobonemi-internal-ordinals",
    ),
  "One or more mandatory source/date qualifications is missing.",
);

const expectedPacificDates = {
  "followup-ios102-pb3-macrumors-status-1302": "2016-11-14",
  "followup-ios102-pb3-neowin": "2016-11-15",
  "followup-ios102-pb3-redmondpie": "2016-11-14",
  "followup-ios102-pb3-geekygadgets": "2016-11-15",
  "followup-ios102-pb3-taisy0": "2016-11-14",
  "followup-ios1021-pb3-kobonemi": "2017-01-09",
  "followup-ios1021-pb3-taisy0": "2017-01-09",
};
for (const [sourceId, expectedDate] of Object.entries(
  expectedPacificDates,
)) {
  const source = sourceById.get(sourceId);
  const normalized =
    source?.timezoneAnalysis?.normalizedDate ??
    source?.timezoneAnalysis?.normalizedDateForBoth;
  assert(
    normalized === expectedDate,
    `${sourceId} has unexpected Pacific normalization ${normalized}.`,
  );
}
checks.timezoneNormalizationsVerified = Object.keys(
  expectedPacificDates,
).length;

assert(
  candidatesDocument.safety.sanityMutationAllowed === false &&
    candidatesDocument.safety.publicationAuthorized === false &&
    candidatesDocument.safety.stableEventIdCreationAllowed === false &&
    selfReview.independentOfResearcher === false &&
    selfReview.authorization.chronologyApprovedCandidateCount === 0 &&
    selfReview.authorization.sanityMutationAllowed === false &&
    selfReview.authorization.publicationEligible === false &&
    production.safety.sanityMutationPerformed === false &&
    production.safety.stableEventIdsCreated === 0 &&
    production.safety.pageBuildsPerformed === 0 &&
    production.safety.deploymentPerformed === false,
  "Packet contains an unsafe approval, mutation, page-build, or deployment state.",
);
checks.safety = {
  chronologyApprovedCandidateCount: 0,
  publicationEligible: false,
  sanityMutationAllowed: false,
  stableEventIdsCreated: 0,
  pageBuildsPerformed: 0,
  deploymentPerformed: false,
};

const lockFilenames = [
  "assignment.json",
  "sources.json",
  "retained-source-reinspection.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "self-review.json",
  "report.md",
  "fetch-sources.mjs",
  "query-production.ts",
  "build-packet.mjs",
  "validate-packet.mjs",
];
const validatedPacketLocks = {};
for (const filename of lockFilenames) {
  const bytes = await readFile(path.join(here, filename));
  validatedPacketLocks[filename] = {
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  };
}

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator: `${packetPath}/validate-packet.mjs`,
  status: errors.length === 0 ? "passed" : "failed",
  errorCount: errors.length,
  errors,
  checks,
  validatedPacketLocks,
  note:
    "A passing packet validation is a structural/evidence self-check only. It does not constitute independent chronology review, publication approval, or Sanity write authorization.",
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
      validationPath: `${packetPath}/validation.json`,
      checks,
    },
    null,
    2,
  ),
);

if (errors.length > 0) process.exit(1);
