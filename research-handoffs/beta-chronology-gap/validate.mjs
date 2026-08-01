import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../..");
const errors = [];
const checks = {};

function repoPath(path) {
  return resolve(repoRoot, path);
}

function parseJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`JSON parse failed for ${relative(repoRoot, path)}: ${error.message}`);
    return null;
  }
}

function listJsonFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) files.push(...listJsonFiles(path));
    else if (entry.endsWith(".json")) files.push(path);
  }
  return files;
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const value = key(item);
    counts[value] = (counts[value] || 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function assert(condition, message) {
  if (!condition) errors.push(message);
  return condition;
}

const jsonFiles = listJsonFiles(here);
for (const path of jsonFiles) parseJson(path);
checks.jsonFilesParsed = jsonFiles.length;

const registerPath = resolve(here, "candidate-register.json");
const schemaPath = resolve(here, "proposed-event-candidate.schema.json");
const sourcesPath = resolve(here, "sources.json");
const eligibilityPath = resolve(here, "eligibility-matrix.json");
const register = parseJson(registerPath);
const schema = parseJson(schemaPath);
const foundationSources = parseJson(sourcesPath);
const eligibility = parseJson(eligibilityPath);

if (!register || !schema || !foundationSources || !eligibility) {
  process.stdout.write(
    `${JSON.stringify({ status: "failed", checks, errors }, null, 2)}\n`,
  );
  process.exitCode = 1;
} else {
  // Ajv 6 is already available in this repository. Convert the schema's
  // 2020-12 $defs spelling to the equivalent draft-07 definitions spelling
  // solely for validation; the committed schema remains draft 2020-12.
  const ajvSchema = JSON.parse(
    JSON.stringify(schema).replaceAll("#/$defs/", "#/definitions/"),
  );
  ajvSchema.$schema = "http://json-schema.org/draft-07/schema#";
  ajvSchema.definitions = ajvSchema.$defs;
  delete ajvSchema.$defs;
  const ajv = new Ajv({ allErrors: true, jsonPointers: true });
  const validate = ajv.compile(ajvSchema);
  const schemaValid = validate(register);
  checks.candidateRegisterSchemaValid = schemaValid;
  if (!schemaValid) {
    for (const error of validate.errors || []) {
      errors.push(`Schema ${error.dataPath || "/"} ${error.message}`);
    }
  }

  const candidateIds = register.candidates.map((candidate) => candidate.candidateId);
  const candidateKeys = register.candidates.map(
    (candidate) =>
      `${candidate.releaseVersionId}\u0000${candidate.proposedIdentity.channel}\u0000${candidate.proposedIdentity.routeAlias}`,
  );
  checks.proposedCandidateCount = register.candidates.length;
  checks.notProposedCount = register.notProposed.length;
  checks.candidateIdsUnique =
    new Set(candidateIds).size === candidateIds.length;
  checks.candidateIdentityKeysUnique =
    new Set(candidateKeys).size === candidateKeys.length;
  assert(checks.candidateIdsUnique, "Candidate IDs are not unique.");
  assert(
    checks.candidateIdentityKeysUnique,
    "Candidate releaseVersion/channel/route identities are not unique.",
  );
  assert(
    register.summary.proposedCandidateCount === register.candidates.length,
    "summary.proposedCandidateCount does not match candidates length.",
  );
  assert(
    register.summary.notProposedCount === register.notProposed.length,
    "summary.notProposedCount does not match notProposed length.",
  );
  assert(
    sameJson(
      register.summary.byStatus,
      countBy(register.candidates, (candidate) => candidate.candidateStatus),
    ),
    "summary.byStatus does not match candidate statuses.",
  );
  assert(
    sameJson(
      register.summary.byPlatform,
      countBy(register.candidates, (candidate) => candidate.platform),
    ),
    "summary.byPlatform does not match candidate platforms.",
  );

  const cohortIds = new Set(register.cohorts.map((cohort) => cohort.cohortId));
  for (const cohort of register.cohorts) {
    const actual = register.candidates.filter(
      (candidate) => candidate.originCohortId === cohort.cohortId,
    ).length;
    assert(
      actual === cohort.candidateCount,
      `Cohort ${cohort.cohortId} declares ${cohort.candidateCount} candidates but has ${actual}.`,
    );
    for (const path of cohort.sourcePaths) {
      assert(existsSync(repoPath(path)), `Missing cohort source path: ${path}`);
    }
  }
  for (const candidate of register.candidates) {
    assert(
      cohortIds.has(candidate.originCohortId),
      `Candidate ${candidate.candidateId} has unknown cohort ${candidate.originCohortId}.`,
    );
    assert(
      candidate.flags.sanityMutationAllowed === false &&
        candidate.flags.publicationEligible === false,
      `Candidate ${candidate.candidateId} has an unsafe flag.`,
    );
  }
  for (const record of register.notProposed) {
    assert(
      cohortIds.has(record.originCohortId),
      `Not-proposed record ${record.recordId} has unknown cohort ${record.originCohortId}.`,
    );
    assert(
      record.flags.sanityMutationAllowed === false &&
        record.flags.publicationEligible === false,
      `Not-proposed record ${record.recordId} has an unsafe flag.`,
    );
  }
  assert(
    register.safety.sanityMutationAllowed === false &&
      register.safety.publicationAuthorized === false &&
      register.safety.stableEventIdCreationAllowed === false,
    "Register safety flags are not all false.",
  );

  const foundationSourceIds = new Set(
    foundationSources.sources.map((source) => source.id),
  );
  assert(
    foundationSourceIds.size === foundationSources.sources.length,
    "Foundation source IDs are not unique.",
  );
  const packetSourceCache = new Map();
  function packetSourceIds(path) {
    if (packetSourceCache.has(path)) return packetSourceCache.get(path);
    const absolute = repoPath(path);
    if (!existsSync(absolute)) {
      errors.push(`Missing packet source ledger: ${path}`);
      const empty = new Set();
      packetSourceCache.set(path, empty);
      return empty;
    }
    const packet = parseJson(absolute);
    const ids = new Set((packet?.sources || []).map((source) => source.sourceId));
    if (ids.size !== (packet?.sources || []).length) {
      errors.push(`Packet source IDs are not unique: ${path}`);
    }
    packetSourceCache.set(path, ids);
    return ids;
  }
  function validateEvidenceRef(owner, evidenceRef) {
    if (evidenceRef.kind === "foundationSource") {
      assert(
        foundationSourceIds.has(evidenceRef.sourceId),
        `${owner} references missing foundation source ${evidenceRef.sourceId}.`,
      );
    } else if (evidenceRef.kind === "packetSource") {
      const ids = packetSourceIds(evidenceRef.packetPath);
      assert(
        ids.has(evidenceRef.sourceId),
        `${owner} references missing packet source ${evidenceRef.sourceId} in ${evidenceRef.packetPath}.`,
      );
    } else if (evidenceRef.kind === "localEvidence") {
      assert(
        existsSync(repoPath(evidenceRef.localPath)),
        `${owner} references missing local evidence ${evidenceRef.localPath}.`,
      );
    }
  }
  for (const candidate of register.candidates) {
    for (const evidenceRef of candidate.evidenceRefs) {
      validateEvidenceRef(candidate.candidateId, evidenceRef);
    }
    if (candidate.upstreamPacket) {
      assert(
        existsSync(repoPath(candidate.upstreamPacket)),
        `${candidate.candidateId} has missing upstream packet ${candidate.upstreamPacket}.`,
      );
    }
  }
  for (const record of register.notProposed) {
    for (const evidenceRef of record.evidenceRefs) {
      validateEvidenceRef(record.recordId, evidenceRef);
    }
  }
  checks.foundationSourceCount = foundationSourceIds.size;
  checks.packetSourceLedgersResolved = packetSourceCache.size;

  const eligibilitySourceRefs = [];
  for (const platform of eligibility.platforms) {
    for (const channel of ["developerBeta", "publicBeta"]) {
      eligibilitySourceRefs.push(
        ...(platform[channel].anchorSourceIds || []),
      );
      eligibilitySourceRefs.push(
        ...(platform[channel].separateHistoricalBoundary?.anchorSourceIds || []),
      );
    }
  }
  for (const observation of eligibility.futureCatalogObservations) {
    eligibilitySourceRefs.push(...(observation.sourceIds || []));
  }
  for (const sourceId of eligibilitySourceRefs) {
    assert(
      foundationSourceIds.has(sourceId),
      `Eligibility matrix references missing foundation source ${sourceId}.`,
    );
  }
  checks.eligibilitySourceReferences = eligibilitySourceRefs.length;

  for (const wave of register.nextEvidenceWaves) {
    for (const path of wave.artifactPaths) {
      assert(existsSync(repoPath(path)), `Missing next-wave artifact path: ${path}`);
    }
  }

  const reusablePath =
    "research-handoffs/beta-chronology-gap/reusable-ios8-ios11/findings.json";
  const reusable = parseJson(repoPath(reusablePath));
  const reusableRootCandidates = register.candidates.filter(
    (candidate) =>
      candidate.originCohortId === "ios8-ledger-only" ||
      candidate.originCohortId === "ios11-prior-manifest",
  );
  const reusableById = new Map(
    (reusable?.candidates || []).map((candidate) => [
      candidate.candidateId,
      candidate,
    ]),
  );
  assert(
    reusableRootCandidates.length === 33 && reusableById.size === 33,
    "Reusable packet/root register does not close exactly 33 candidates.",
  );
  for (const candidate of reusableRootCandidates) {
    const packetCandidate = reusableById.get(candidate.candidateId);
    assert(
      packetCandidate && sameJson(candidate, packetCandidate),
      `Reusable packet drift for ${candidate.candidateId}.`,
    );
  }
  checks.reusableCandidatesExact = reusableRootCandidates.length;

  const os27CandidatesPath =
    "research-handoffs/beta-chronology-gap/os27/candidates.json";
  const os27ReviewPath =
    "research-handoffs/beta-chronology-gap/os27/review.json";
  const os27 = parseJson(repoPath(os27CandidatesPath));
  const os27Review = parseJson(repoPath(os27ReviewPath));
  const os27RootCandidates = register.candidates.filter(
    (candidate) => candidate.originCohortId === "os27-public-beta",
  );
  const upstreamIdentityKeys = new Set(
    (os27?.candidates || []).map(
      (candidate) =>
        `${candidate.releaseVersionId}\u0000${candidate.channel}\u0000${candidate.routeAlias}\u0000${candidate.appearanceDate}`,
    ),
  );
  for (const candidate of os27RootCandidates) {
    const key = `${candidate.releaseVersionId}\u0000${candidate.proposedIdentity.channel}\u0000${candidate.proposedIdentity.routeAlias}\u0000${candidate.proposedIdentity.appearanceDate}`;
    assert(upstreamIdentityKeys.has(key), `OS 27 packet drift for ${candidate.candidateId}.`);
    assert(
      candidate.candidateStatus === "readyForChronologyReview",
      `Reviewed OS 27 candidate ${candidate.candidateId} is not readyForChronologyReview.`,
    );
  }
  assert(
    os27RootCandidates.length === 6 &&
      upstreamIdentityKeys.size === 6 &&
      os27Review?.verdict === "pass" &&
      os27Review?.candidateVerdict?.readyForChronologyReview?.length === 6,
    "OS 27 packet/review does not close exactly six reviewed candidates.",
  );
  assert(
    register.notProposed.length === 2 &&
      (os27?.notProposed || []).length === 2 &&
      os27Review?.candidateVerdict?.notProposed?.length === 2,
    "visionOS do-not-create records do not close exactly two reviewed exclusions.",
  );
  checks.os27CandidatesExact = os27RootCandidates.length;
  checks.os27NotProposedExact = register.notProposed.length;

  assert(
    register.candidates.length === 39 &&
      register.summary.byStatus.needsEvidenceReview === 33 &&
      register.summary.byStatus.readyForChronologyReview === 6,
    "Final program count must be 39 proposed: 33 needsEvidenceReview and 6 readyForChronologyReview.",
  );
  checks.finalProgramCounts = {
    proposed: register.candidates.length,
    needsEvidenceReview: register.summary.byStatus.needsEvidenceReview,
    readyForChronologyReview:
      register.summary.byStatus.readyForChronologyReview,
    notProposed: register.notProposed.length,
  };

  const validatedAt =
    register.validationStatus.validatedAt || new Date().toISOString();
  const result = {
    status: errors.length === 0 ? "passed" : "failed",
    validatedAt,
    validator:
      "research-handoffs/beta-chronology-gap/validate.mjs",
    checks,
    errors,
    safety: {
      sanityMutationPerformed: false,
      publicationAuthorized: false
    }
  };
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (errors.length > 0) process.exitCode = 1;
}

