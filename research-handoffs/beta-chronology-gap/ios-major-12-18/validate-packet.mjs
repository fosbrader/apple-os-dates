import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const Ajv = require("ajv");
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ios-major-12-18";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios-major-12-18";
const errors = [];
const warnings = [];
const checks = {};
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
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

const expectedCycles = {
  "12.0": [
    [1, "2018-06-25"],
    [2, "2018-07-05"],
    [3, "2018-07-18"],
    [4, "2018-07-31"],
    [5, "2018-08-06"],
    [6, "2018-08-15"],
    [7, "2018-08-20"],
    [8, "2018-08-23"],
    [9, "2018-08-27"],
    [10, "2018-08-31"],
  ],
  "13.0": [
    [1, "2019-06-24"],
    [2, "2019-07-08"],
    [3, "2019-07-18"],
    [4, "2019-07-30"],
    [5, "2019-08-08"],
    [6, "2019-08-15"],
    [7, "2019-08-21"],
  ],
  "14.0": [
    [1, "2020-07-09"],
    [3, "2020-07-23"],
    [4, "2020-08-06"],
    [5, "2020-08-19"],
    [6, "2020-08-25"],
    [7, "2020-09-03"],
    [8, "2020-09-09"],
  ],
  "15.0": [
    [1, "2021-06-30"],
    [2, "2021-07-16"],
    [4, "2021-07-28"],
    [5, "2021-08-11"],
    [6, "2021-08-18"],
    [7, "2021-08-25"],
    [8, "2021-08-31"],
  ],
  "16.0": [
    [1, "2022-07-11"],
    [2, "2022-07-28"],
    [3, "2022-08-09"],
    [4, "2022-08-15"],
    [5, "2022-08-24"],
    [6, "2022-08-29"],
  ],
  "17.0": [
    [1, "2023-07-12"],
    [2, "2023-07-31"],
    [3, "2023-08-09"],
    [4, "2023-08-16"],
    [5, "2023-08-22"],
    [6, "2023-08-29"],
  ],
  "18.0": [
    [1, "2024-07-15"],
    [2, "2024-07-29"],
    [3, "2024-08-06"],
    [4, "2024-08-12"],
    [5, "2024-08-20"],
    [6, "2024-08-28"],
  ],
};
const exactExistingKeys = new Set(["15.0:1", "16.0:1", "17.0:1"]);
const expectedTerminal = {
  "12.0": [11, "2018-09-12", "goldenMaster"],
  "13.0": [8, "2019-09-10", "goldenMaster"],
  "14.0": [9, "2020-09-15", "goldenMaster"],
  "15.0": [9, "2021-09-14", "releaseCandidate"],
  "16.0": [7, "2022-09-07", "releaseCandidate"],
  "17.0": [7, "2023-09-12", "releaseCandidate"],
  "18.0": [7, "2024-09-09", "releaseCandidate"],
};
const expectedConflictIds = [
  "ios14-public-numbering-transition",
  "ios14-false-july22-public-beta-2",
  "ios14-public-beta-4-date",
  "ios15-public-numbering-transition",
  "ios15-build-aligned-alternate-early-labels",
  "ios12-public-beta-6-calendar-date",
  "ios12-developer-beta-7-withdrawal",
  "ios16-rolling-source-errors",
  "ios17-public-beta-4-article-date",
  "ios18-public-beta-5-calendar-date",
  "ios-paired-developer-revisions-not-public-respins",
  "ios-ipados-cross-packet-numbering-not-reused",
  "ios-same-day-channel-separation",
  "ios-gm-rc-not-next-public-beta",
];

const [
  assignment,
  sourcesDocument,
  rawLocks,
  candidateRegister,
  conflictsDocument,
  production,
  selfReview,
  schema,
  report,
] = await Promise.all([
  readJson("assignment.json"),
  readJson("sources.json"),
  readJson("raw-evidence-locks.json"),
  readJson("candidates.json"),
  readJson("conflicts.json"),
  readJson("production-snapshot.json"),
  readJson("self-review.json"),
  readJson("../proposed-event-candidate.schema.json"),
  readFile(path.join(here, "report.md"), "utf8"),
]);

for (const [filename, document] of [
  ["assignment.json", assignment],
  ["sources.json", sourcesDocument],
  ["raw-evidence-locks.json", rawLocks],
  ["conflicts.json", conflictsDocument],
  ["self-review.json", selfReview],
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
const locks = rawLocks.locks;
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const lockById = new Map(locks.map((lock) => [lock.sourceId, lock]));
const expectedAppearances = Object.entries(expectedCycles).flatMap(
  ([version, rows]) =>
    rows.map(([sequence, date]) => ({
      key: `${version}:${sequence}`,
      version,
      sequence,
      date,
    })),
);
const expectedMissing = expectedAppearances.filter(
  (item) => !exactExistingKeys.has(item.key),
);

checks.observedAppearanceCount = assignment.observedAppearanceCount;
checks.candidateCount = candidates.length;
checks.exactExistingMatchCount = assignment.existingMatches.length;
checks.notProposedCount = notProposed.length;
checks.candidatesByVersion = countBy(candidates, (item) => item.version);
checks.sources = {
  attempted: sourcesDocument.attemptedSourceCount,
  captured: sources.length,
  reused: sourcesDocument.reusedSourceCount,
  fresh: sourcesDocument.freshSourceCount,
  failed: sourcesDocument.failedCaptureCount,
};
checks.conflictCount = conflictsDocument.conflictCount;

assert(
  expectedAppearances.length === 49 &&
    assignment.observedAppearanceCount === 49 &&
    assignment.positiveSequence.length === 49,
  "Expected exactly 49 observed public appearances.",
);
assert(
  candidates.length === 46 &&
    candidateRegister.summary.proposedCandidateCount === 46,
  `Expected 46 confirmed-missing candidates, found ${candidates.length}.`,
);
assert(
  assignment.existingMatches.length === 3,
  "Expected three exact existing matches.",
);
assert(
  notProposed.length === 9 &&
    candidateRegister.summary.notProposedCount === 9 &&
    assignment.negativeSequence.length === 9,
  "Expected nine negative records: two numbering skips plus seven terminal next ordinals.",
);
assert(
  sources.length === 66 &&
    sourcesDocument.attemptedSourceCount === 66 &&
    sourcesDocument.reusedSourceCount === 49 &&
    sourcesDocument.freshSourceCount === 17 &&
    sourcesDocument.failedCaptureCount === 0,
  "Source totals drifted from 66 captured / 49 verified reuse / 17 fresh / 0 failed.",
);
assert(
  rawLocks.sourceCount === 66 &&
    locks.length === 66 &&
    lockById.size === 66,
  "Raw evidence lock count or uniqueness drifted.",
);
assert(
  conflictsDocument.conflictCount === 14 &&
    sameJson(
      conflictsDocument.conflicts.map((item) => item.conflictId),
      expectedConflictIds,
    ),
  "Conflict register IDs, order, or count drifted.",
);

const candidateKeySet = new Set(
  candidates.map(
    (candidate) =>
      `${candidate.version}:${candidate.proposedIdentity.sequence}`,
  ),
);
assert(
  candidateKeySet.size === 46,
  "Candidate version/ordinal keys are not unique.",
);
assert(
  new Set(candidates.map((candidate) => candidate.candidateId)).size === 46,
  "Candidate IDs are not unique.",
);
for (const expected of expectedMissing) {
  assert(
    candidateKeySet.has(expected.key),
    `Missing expected candidate ${expected.key}.`,
  );
}
for (const existingKey of exactExistingKeys) {
  assert(
    !candidateKeySet.has(existingKey),
    `Exact existing identity ${existingKey} was incorrectly proposed.`,
  );
}
assert(
  !candidateKeySet.has("14.0:2") && !candidateKeySet.has("15.0:3"),
  "Skipped iOS 14 PB2 or iOS 15 PB3 was incorrectly proposed.",
);

for (const candidate of candidates) {
  const expected = expectedMissing.find(
    (item) =>
      item.version === candidate.version &&
      item.sequence === candidate.proposedIdentity.sequence,
  );
  assert(expected, `${candidate.candidateId} is outside expected chronology.`);
  if (expected) {
    assert(
      candidate.proposedIdentity.appearanceDate === expected.date,
      `${candidate.candidateId} has unexpected appearance date.`,
    );
  }
  assert(
    candidate.platform === "iOS" &&
      candidate.platformId === "platform-ios" &&
      candidate.releaseVersionId ===
        `version-ios-${candidate.version.replaceAll(".", "-")}`,
    `${candidate.candidateId} has malformed platform/parent identity.`,
  );
  assert(
    candidate.proposedIdentity.channel === "publicBeta" &&
      candidate.proposedIdentity.routeAlias ===
        `public-beta-${candidate.proposedIdentity.sequence}` &&
      candidate.proposedIdentity.label ===
        `Public Beta ${candidate.proposedIdentity.sequence}` &&
      candidate.proposedIdentity.isRevision === false,
    `${candidate.candidateId} has malformed public identity.`,
  );
  assert(
    candidate.ordinalBasis === "explicit" &&
      candidate.identityStatus === "confirmed" &&
      candidate.evidenceState === "corroborated",
    `${candidate.candidateId} is not an explicit corroborated identity.`,
  );
  assert(
    candidate.productionReconciliation.status === "confirmedMissing" &&
      candidate.productionReconciliation.exactIdentityMatches === 0,
    `${candidate.candidateId} is not reconciled as exactly missing.`,
  );
  assert(
    candidate.buildEvidenceStatus === "absent" &&
      !Object.hasOwn(candidate, "build") &&
      !Object.hasOwn(candidate, "priorProposedStableEventId") &&
      !Object.hasOwn(candidate, "pairedDeveloperRoute"),
    `${candidate.candidateId} improperly includes build, stable-ID, or paired-developer identity material.`,
  );
  assert(
    candidate.flags.sanityMutationAllowed === false &&
      candidate.flags.publicationEligible === false,
    `${candidate.candidateId} has unsafe flags.`,
  );
  const referencedSources = candidate.evidenceRefs
    .filter((ref) => ref.kind === "packetSource")
    .map((ref) => sourceById.get(ref.sourceId));
  assert(
    referencedSources.every(Boolean),
    `${candidate.candidateId} references a missing source.`,
  );
  const independentFamilies = new Set(
    referencedSources
      .filter((source) => source?.lineage.independentForCorroboration)
      .map((source) => source.lineage.publisherFamily),
  );
  assert(
    independentFamilies.size >= 2,
    `${candidate.candidateId} has only ${independentFamilies.size} independent publisher lineage(s).`,
  );
}

for (const appearance of assignment.positiveSequence) {
  const expected = expectedAppearances.find(
    (item) =>
      item.version === appearance.version &&
      item.sequence === appearance.sequence,
  );
  assert(
    expected?.date === appearance.appearanceDate,
    `Assignment chronology drift for ${appearance.key}.`,
  );
  assert(
    appearance.sourceIds.length >= 2,
    `${appearance.key} has fewer than two source IDs.`,
  );
}

for (const match of assignment.existingMatches) {
  const key = `${match.version}:${match.sequence}`;
  assert(
    exactExistingKeys.has(key) &&
      match.productionReconciliation.status === "exactExistingMatch" &&
      match.productionReconciliation.exactIdentityMatches === 1 &&
      match.disposition === "retainExistingNoMutationProposed",
    `${key} is not a preserved exact existing match.`,
  );
  assert(
    match.productionEvent?.channel === "publicBeta" &&
      match.productionEvent?.routeAlias === `public-beta-${match.sequence}` &&
      match.productionEvent?.appearanceDate === match.appearanceDate,
    `${key} existing production event does not match the researched identity.`,
  );
}

const expectedNegativeIds = new Set([
  "not-proposed:apple:ios:14.0:public-beta-2",
  "not-proposed:apple:ios:15.0:public-beta-3",
  ...Object.entries(expectedTerminal).map(
    ([version, [sequence]]) =>
      `not-proposed:apple:ios:${version}:public-beta-${sequence}`,
  ),
]);
assert(
  new Set(notProposed.map((item) => item.recordId)).size === 9 &&
    notProposed.every((item) => expectedNegativeIds.has(item.recordId)),
  "Negative record IDs are incomplete or unexpected.",
);
for (const item of notProposed) {
  assert(
    item.classification === "disprovedIdentity" &&
      item.flags.sanityMutationAllowed === false &&
      item.flags.publicationEligible === false,
    `${item.recordId} has unsafe or unexpected negative classification.`,
  );
}
for (const [version, [sequence, date, channel]] of Object.entries(
  expectedTerminal,
)) {
  const negative = notProposed.find(
    (item) =>
      item.releaseVersionId ===
        `version-ios-${version.replaceAll(".", "-")}` &&
      item.apparentIdentity.sequence === sequence,
  );
  assert(
    negative?.apparentIdentity.appearanceDate === date,
    `${version} terminal negative boundary drifted.`,
  );
  assert(
    production.events.some(
      (event) =>
        event.releaseVersionId ===
          `version-ios-${version.replaceAll(".", "-")}` &&
        event.appearanceDate === date &&
        event.channel === channel,
    ),
    `${version} production snapshot does not contain ${channel} on ${date}.`,
  );
}

assert(
  production.parentChecks.length === 7 &&
    production.parentChecks.every(
      (item) => item.exactParentMatchCount === 1,
    ),
  "Production parent reconciliation failed.",
);
assert(
  production.exactChecks.length === 49,
  "Production snapshot does not contain 49 exact target checks.",
);
const productionExactMatches = production.exactChecks.filter(
  (item) => item.exactIdentityMatchCount === 1,
);
assert(
  productionExactMatches.length === 3 &&
    productionExactMatches.every((item) =>
      exactExistingKeys.has(`${item.version}:${item.sequence}`),
    ),
  "Production exact-match set differs from iOS 15/16/17 PB1.",
);
assert(
  production.exactChecks.every((item) =>
    exactExistingKeys.has(`${item.version}:${item.sequence}`)
      ? item.exactIdentityMatchCount === 1
      : item.exactIdentityMatchCount === 0,
  ),
  "A candidate target unexpectedly matches production or an existing target is absent.",
);
assert(
  production.productionCounts.scopedPublicBetaEvents === 3,
  "Scoped production publicBeta count drifted from three.",
);

for (const source of sources) {
  const lock = lockById.get(source.sourceId);
  assert(lock, `${source.sourceId} has no raw evidence lock.`);
  const absolutePath = path.join(repoRoot, source.evidence.rawPath);
  let bytes;
  try {
    bytes = await readFile(absolutePath);
    const fileStat = await stat(absolutePath);
    assert(
      fileStat.size === source.evidence.rawBytes,
      `${source.sourceId} raw byte count drifted.`,
    );
    assert(
      sha256(bytes) === source.evidence.rawSha256 &&
        lock?.rawSha256 === source.evidence.rawSha256 &&
        lock?.rawBytes === source.evidence.rawBytes,
      `${source.sourceId} raw evidence hash drifted.`,
    );
    assert(
      /\bios(?:\s|&nbsp;|&#xA0;|&#160;)*1[2-8]\b/i.test(
        bytes.toString("utf8"),
      ),
      `${source.sourceId} raw page does not retain an explicit iOS 12–18 platform claim.`,
    );
  } catch (error) {
    errors.push(
      `${source.sourceId} raw evidence cannot be read: ${
        error instanceof Error ? error.message : String(error)
      }.`,
    );
  }
  assert(
    source.evidence.selectedText.wordCount <= 20 &&
      sha256(source.evidence.selectedText.text) ===
        source.evidence.selectedText.sha256 &&
      lock?.selectedTextSha256 ===
        source.evidence.selectedText.sha256,
    `${source.sourceId} bounded selected-text lock is invalid.`,
  );
  assert(
    source.lineage.independentForCorroboration === true,
    `${source.sourceId} is unexpectedly non-independent.`,
  );
  if (source.reuseVerification) {
    const priorPath = path.join(
      repoRoot,
      source.reuseVerification.rawPath,
    );
    try {
      const priorBytes = await readFile(priorPath);
      assert(
        sha256(priorBytes) === source.reuseVerification.expectedSha256 &&
          source.reuseVerification.expectedSha256 ===
            source.evidence.rawSha256,
        `${source.sourceId} prior-packet reuse hash does not match.`,
      );
      assert(
        source.reuseVerification.platformVerification.includes(
          "explicit iOS",
        ),
        `${source.sourceId} lacks a platform-specific reuse statement.`,
      );
    } catch (error) {
      errors.push(
        `${source.sourceId} prior reuse evidence cannot be read: ${
          error instanceof Error ? error.message : String(error)
        }.`,
      );
    }
  }
}

assert(
  selfReview.independentOfResearcher === false &&
    selfReview.independentReview.required === true &&
    selfReview.independentReview.reviewer === null &&
    selfReview.authorization.sanityMutationAllowed === false &&
    selfReview.authorization.publicationEligible === false &&
    selfReview.authorization.deploymentAllowed === false,
  "Self-review improperly claims independence or authority.",
);
assert(
  selfReview.checks.stableEventIdsCreated === 0 &&
    selfReview.checks.sanityMutationPerformed === false &&
    selfReview.checks.pageWorkPerformed === false &&
    selfReview.checks.publicationPerformed === false &&
    selfReview.checks.deploymentPerformed === false,
  "Self-review reports an out-of-scope mutation.",
);
assert(
  candidateRegister.safety.sanityMutationAllowed === false &&
    candidateRegister.safety.publicationAuthorized === false &&
    candidateRegister.safety.stableEventIdCreationAllowed === false &&
    candidateRegister.validationStatus.status === "passed",
  "Candidate register safety or validation state is invalid.",
);
for (const requiredPhrase of [
  "49 actual iOS public-beta appearances",
  "46 confirmed-missing identities",
  "iOS 14: PB1, then PB3–PB8",
  "iOS 15: PB1, PB2, then PB4–PB8",
  "Developer Beta 7 was pulled",
  "independent chronology review pending",
]) {
  assert(
    report.includes(requiredPhrase),
    `report.md is missing required phrase: ${requiredPhrase}`,
  );
}

const result = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  validator: `${packetPath}/validate-packet.mjs`,
  status: errors.length === 0 ? "passed" : "failed",
  errorCount: errors.length,
  warningCount: warnings.length,
  checks,
  errors,
  warnings,
  authorization: {
    independentChronologyReviewComplete: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    pageWorkAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};
await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exitCode = 1;
