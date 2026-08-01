import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-mobile26-public";
const packetPath =
  "research-handoffs/beta-chronology-gap/mobile26-public";
const errors = [];
const warnings = [];
const checks = {};
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
const readJson = async (filename) =>
  JSON.parse(await readFile(path.join(here, filename), "utf8"));
const readRepoFile = (filename) =>
  readFile(path.join(repoRoot, filename));
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

const expectedCycles = {
  "26.1": [
    [1, "2025-09-24"],
    [2, "2025-10-07"],
    [3, "2025-10-14"],
    [4, "2025-10-20"],
  ],
  "26.2": [
    [1, "2025-11-06"],
    [2, "2025-11-18"],
  ],
  "26.3": [
    [1, "2025-12-17"],
    [2, "2026-01-13"],
    [3, "2026-01-27"],
  ],
  "26.4": [
    [1, "2026-02-17"],
    [2, "2026-03-05"],
    [3, "2026-03-09"],
  ],
  "26.5": [
    [1, "2026-04-03"],
    [2, "2026-04-14"],
    [3, "2026-04-21"],
    [4, "2026-04-27"],
  ],
  "26.6": [
    [1, "2026-05-28"],
    [2, "2026-06-16"],
    [3, "2026-06-30"],
    [4, "2026-07-07"],
    [5, "2026-07-13"],
  ],
};
const expectedNegative = {
  "26.1": [5, "2025-10-28"],
  "26.2": [3, "2025-12-03"],
  "26.3": [4, "2026-02-04"],
  "26.4": [4, "2026-03-18"],
  "26.5": [5, "2026-05-04"],
  "26.6": [6, "2026-07-20"],
};
const mandatoryConflicts = [
  "ipados-261-pb1-mislabeled-by-iculture",
  "mobile-262-public-developer-sequence-divergence",
  "mobile-264-iculture-omits-pb2-pb3",
  "mobile-264-false-feb24-pb2-report",
  "mobile-264-public-developer-numbering-divergence",
  "mobile-265-iculture-year-typos",
  "mobile-266-pb3-date-conflict",
  "same-day-channel-separation",
  "rc-is-not-public-beta",
];

const [
  assignment,
  sourcesDocument,
  candidateRegister,
  conflictsDocument,
  production,
  review,
  schema,
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
  ["conflicts.json", conflictsDocument],
  ["review.json", review],
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
      `Shared candidate-register schema ${error.dataPath || "/"} ${error.message}.`,
    );
  }
}

const candidates = candidateRegister.candidates;
const notProposed = candidateRegister.notProposed;
const sources = sourcesDocument.sources;
const sourceById = new Map(sources.map((item) => [item.sourceId, item]));
const candidateById = new Map(
  candidates.map((item) => [item.candidateId, item]),
);

checks.candidateCount = candidates.length;
checks.notProposedCount = notProposed.length;
checks.candidatesByPlatform = countBy(
  candidates,
  (item) => item.platform,
);
checks.candidatesByVersion = countBy(
  candidates,
  (item) => `${item.platform} ${item.version}`,
);
checks.candidatesByIdentityStatus = countBy(
  candidates,
  (item) => item.identityStatus,
);
checks.sourceCount = sources.length;
checks.attemptedSourceCount = sourcesDocument.attemptedSourceCount;
checks.failedCaptureCount = sourcesDocument.failedCaptureCount;
checks.conflictCount = conflictsDocument.conflictCount;

assert(candidates.length === 42, `Expected 42 candidates, found ${candidates.length}.`);
assert(
  sameJson(checks.candidatesByPlatform, {iOS: 21, iPadOS: 21}),
  `Platform counts drifted: ${JSON.stringify(checks.candidatesByPlatform)}.`,
);
assert(
  notProposed.length === 12,
  `Expected 12 negative next-ordinal records, found ${notProposed.length}.`,
);
assert(
  assignment.positiveSequence.length === 42,
  "Positive sequence table does not contain exactly 42 rows.",
);
assert(
  assignment.negativeSequence.length === 12,
  "Negative sequence table does not contain exactly 12 rows.",
);
assert(
  sources.length === 49 &&
    sourcesDocument.attemptedSourceCount === 52 &&
    sourcesDocument.failedCaptureCount === 3,
  "Source capture totals drifted from 49 captured / 52 attempted / 3 failed.",
);
assert(
  conflictsDocument.conflictCount === 9 &&
    conflictsDocument.conflicts.length === 9,
  "Conflict register does not contain the frozen nine records.",
);
assert(
  sameJson(
    conflictsDocument.conflicts.map((item) => item.conflictId),
    mandatoryConflicts,
  ),
  "Mandatory conflict/guardrail IDs or order drifted.",
);

const expectedIdentity = new Map();
for (const platform of ["iOS", "iPadOS"]) {
  for (const [version, appearances] of Object.entries(expectedCycles)) {
    for (const [sequence, date] of appearances) {
      expectedIdentity.set(
        `${platform}\u0000${version}\u0000${sequence}`,
        date,
      );
    }
  }
}
assert(
  new Set(candidates.map((item) => item.candidateId)).size === 42,
  "Candidate IDs are not unique.",
);
assert(
  new Set(
    candidates.map(
      (item) =>
        `${item.releaseVersionId}\u0000${item.proposedIdentity.channel}\u0000${item.proposedIdentity.routeAlias}`,
    ),
  ).size === 42,
  "Candidate production identity keys are not unique.",
);
for (const candidate of candidates) {
  const identityKey = `${candidate.platform}\u0000${candidate.version}\u0000${candidate.proposedIdentity.sequence}`;
  assert(
    expectedIdentity.get(identityKey) ===
      candidate.proposedIdentity.appearanceDate,
    `${candidate.candidateId} has unexpected sequence/date.`,
  );
  assert(
    candidate.proposedIdentity.channel === "publicBeta" &&
      candidate.proposedIdentity.routeAlias ===
        `public-beta-${candidate.proposedIdentity.sequence}` &&
      candidate.proposedIdentity.isRevision === false,
    `${candidate.candidateId} has a malformed public identity.`,
  );
  assert(
    candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.productionReconciliation.exactIdentityMatches === 0,
    `${candidate.candidateId} is not reconciled as exactly missing.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      !Object.hasOwn(candidate, "build") &&
      !Object.hasOwn(candidate, "priorProposedStableEventId"),
    `${candidate.candidateId} improperly includes build or stable-ID material.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
    `${candidate.candidateId} has unsafe flags.`,
  );
  assert(
    candidate.review.required === true &&
      candidate.review.reviewer === null &&
      candidate.review.reviewedAt === null,
    `${candidate.candidateId} was self-approved or marked reviewed.`,
  );
  const lineages = new Set();
  for (const ref of candidate.evidenceRefs) {
    const source = sourceById.get(ref.sourceId);
    assert(
      Boolean(source),
      `${candidate.candidateId} references missing source ${ref.sourceId}.`,
    );
    if (!source) continue;
    assert(
      source.candidateIds.includes(candidate.candidateId),
      `${ref.sourceId} does not list ${candidate.candidateId}.`,
    );
    assert(
      source.platformsNamed.includes(candidate.platform),
      `${ref.sourceId} does not explicitly name ${candidate.platform}.`,
    );
    assert(
      ref.locator === source.evidence.locator,
      `${candidate.candidateId} locator drifted for ${ref.sourceId}.`,
    );
    if (source.lineage.independentForCorroboration) {
      lineages.add(source.lineage.publisherFamily);
    }
  }
  assert(
    lineages.size >= 2,
    `${candidate.candidateId} has only ${lineages.size} captured independent publisher lineage(s).`,
  );
}
checks.candidatesWithTwoIndependentPublisherLineages = candidates.filter(
  (candidate) =>
    new Set(
      candidate.evidenceRefs
        .map((ref) => sourceById.get(ref.sourceId))
        .filter((source) => source?.lineage.independentForCorroboration)
        .map((source) => source.lineage.publisherFamily),
    ).size >= 2,
).length;

for (const platform of ["iOS", "iPadOS"]) {
  for (const [version, [nextSequence, rcDate]] of Object.entries(
    expectedNegative,
  )) {
    const row = assignment.negativeSequence.find(
      (item) =>
        item.platform === platform &&
        item.version === version &&
        item.searchedSequence === nextSequence,
    );
    assert(Boolean(row), `Missing negative sequence row for ${platform} ${version}.`);
    if (row) {
      assert(
        row.terminalBoundary.channel === "releaseCandidate" &&
          row.terminalBoundary.appearanceDate === rcDate &&
          row.disposition === "notProposed",
        `Negative boundary drifted for ${platform} ${version}.`,
      );
    }
    const recordId = `not-proposed:apple:${platform === "iOS" ? "ios" : "ipados"}:${version}:public-beta-${nextSequence}`;
    const record = notProposed.find((item) => item.recordId === recordId);
    assert(Boolean(record), `Missing notProposed record ${recordId}.`);
    if (record) {
      assert(
        record.classification === "disprovedIdentity" &&
          record.apparentIdentity.appearanceDate === rcDate &&
          record.review.reviewer === null &&
          record.flags.sanityMutationAllowed === false &&
          record.flags.publicationEligible === false,
        `${recordId} has unsafe or incorrect negative classification.`,
      );
    }
  }
}

assert(
  production.parentChecks.length === 12 &&
    production.parentChecks.every(
      (item) => item.exactParentMatchCount === 1,
    ),
  "Production parent reconciliation is not exactly 12 of 12.",
);
assert(
  production.exactChecks.length === 42 &&
    production.exactChecks.every(
      (item) =>
        item.exactIdentityMatchCount === 0 &&
        item.routeAliasMatchCount === 0 &&
        item.channelSequenceDateMatchCount === 0,
    ),
  "One or more proposed identities now collide with production.",
);
assert(
  production.productionCounts.scopedPublicBetaEvents === 0,
  "Scoped production unexpectedly contains publicBeta events.",
);
checks.productionCapturedAt = production.capturedAt;
checks.productionParentsExact = 12;
checks.productionTargetsConfirmedMissing = 42;

assert(
  new Set(sources.map((item) => item.sourceId)).size === sources.length,
  "Source IDs are not unique.",
);
assert(
  new Set(sources.map((item) => item.canonicalUrl)).size === sources.length,
  "Canonical source URLs are not unique.",
);
let evidenceFileCount = 0;
const evidenceDigestRows = [];
for (const source of sources) {
  for (const [pathKey, hashKey] of [
    ["rawPath", "rawSha256"],
    ["selectedPath", "selectedTextSha256"],
  ]) {
    const relativePath = source.evidence[pathKey];
    const bytes = await readRepoFile(relativePath);
    await stat(path.join(repoRoot, relativePath));
    const actualHash = sha256(bytes);
    assert(
      actualHash === source.evidence[hashKey],
      `${source.sourceId} ${pathKey} hash mismatch.`,
    );
    evidenceFileCount += 1;
    evidenceDigestRows.push(`${relativePath}\u0000${actualHash}`);
  }
  assert(
    source.evidence.locator.length >= 40,
    `${source.sourceId} has an unbounded or underspecified locator.`,
  );
}
checks.evidenceFileCount = evidenceFileCount;
checks.rawEvidenceFiles = sources.length;
checks.selectedEvidenceFiles = sources.length;
checks.evidenceAggregateSha256 = sha256(
  evidenceDigestRows.sort().join("\n"),
);

assert(
  review.independentOfResearcher === false &&
    review.verdict === "pendingIndependentReview" &&
    review.independentReview.required === true &&
    review.independentReview.reviewer === null &&
    review.independentReview.reviewedAt === null &&
    review.independentReview.verdict === null &&
    review.independentReview.chronologyApprovedCandidateCount === 0,
  "Review document improperly claims independent review or approval.",
);
assert(
  review.authorization.sanityMutationAllowed === false &&
    review.authorization.publicationEligible === false &&
    review.authorization.deploymentAllowed === false,
  "Review authorization flags are unsafe.",
);
assert(
  candidateRegister.safety.sanityMutationAllowed === false &&
    candidateRegister.safety.publicationAuthorized === false &&
    candidateRegister.safety.stableEventIdCreationAllowed === false,
  "Candidate register safety flags are unsafe.",
);

const candidateText = await readFile(
  path.join(here, "candidates.json"),
  "utf8",
);
assert(
  !candidateText.includes('"stableEventId"') &&
    !candidateText.includes('"build":'),
  "Candidate register contains stableEventId or build payloads.",
);

const coreFiles = [
  "assignment.json",
  "sources.json",
  "candidates.json",
  "conflicts.json",
  "production-snapshot.json",
  "review.json",
  "report.md",
  "query-production.ts",
  "fetch-sources.mjs",
  "build-packet.mjs",
  "validate-packet.mjs",
];
const artifactHashes = {};
for (const filename of coreFiles) {
  const bytes = await readFile(path.join(here, filename));
  artifactHashes[`${packetPath}/${filename}`] = {
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  };
}
const schemaBytes = await readFile(
  path.join(here, "../proposed-event-candidate.schema.json"),
);
artifactHashes[
  "research-handoffs/beta-chronology-gap/proposed-event-candidate.schema.json"
] = {
  bytes: schemaBytes.byteLength,
  sha256: sha256(schemaBytes),
};

const validatedAt = new Date().toISOString();
const manifest = {
  formatVersion: 1,
  batchId,
  frozenAt: validatedAt,
  hashAlgorithm: "SHA-256",
  artifactCount: Object.keys(artifactHashes).length,
  artifactHashes,
  evidenceFileCount,
  evidenceAggregateSha256: checks.evidenceAggregateSha256,
  captureSummary: {
    attempted: sourcesDocument.attemptedSourceCount,
    captured: sourcesDocument.sourceCount,
    failed: sourcesDocument.failedCaptureCount,
    failedSourcesAreCandidateEvidence: false,
  },
  reviewState: "pendingIndependentChronologyReview",
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    pageBuildAllowed: false,
    deploymentAllowed: false,
  },
};
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
await writeFile(path.join(here, "packet-manifest.json"), manifestText);
const manifestHash = sha256(manifestText);

checks.noSanityMutation = true;
checks.noStableEventIds = true;
checks.noBuildClaims = true;
checks.noPageBuild = true;
checks.noDeployment = true;
checks.independentReviewPending = true;

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt,
  validator: `${packetPath}/validate-packet.mjs`,
  status: errors.length === 0 ? "passed" : "failed",
  checks,
  warnings,
  errors,
  packetManifest: {
    path: `${packetPath}/packet-manifest.json`,
    bytes: Buffer.byteLength(manifestText),
    sha256: manifestHash,
  },
  conclusion:
    errors.length === 0
      ? "Researcher packet validation passed. This is not independent chronology approval and grants no Sanity, publication, stable-ID, page-build, or deployment authority."
      : "Packet validation failed. Do not submit for independent chronology review.",
};
await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);

console.log(JSON.stringify(validation, null, 2));
if (errors.length > 0) process.exit(1);
