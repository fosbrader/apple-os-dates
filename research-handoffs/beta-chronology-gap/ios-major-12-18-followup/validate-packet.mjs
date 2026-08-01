#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const writeMode = process.argv.includes("--write");
const batchId = "beta-chronology-gap-ios-major-12-18-followup";

const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.resolve(repoRoot, relativePath), "utf8"));

const packetJson = (name) =>
  readJson(
    `research-handoffs/beta-chronology-gap/ios-major-12-18-followup/${name}`,
  );

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");

const errors = [];
const warnings = [];
const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const unique = (values) => new Set(values).size === values.length;
const countWords = (value) =>
  value.trim() ? value.trim().split(/\s+/u).length : 0;

const [
  assignment,
  fetchLog,
  sourcesLedger,
  rawLocks,
  sourceRoleCorrections,
  production,
  supplement,
  parentSourcesLedger,
] = await Promise.all([
  packetJson("assignment.json"),
  packetJson("fetch-log.json"),
  packetJson("sources.json"),
  packetJson("raw-evidence-locks.json"),
  packetJson("source-role-corrections.json"),
  packetJson("production-snapshot.json"),
  packetJson("supplement.json"),
  readJson(
    "research-handoffs/beta-chronology-gap/ios-major-12-18/sources.json",
  ),
]);

for (const value of [
  assignment,
  fetchLog,
  sourcesLedger,
  rawLocks,
  sourceRoleCorrections,
  production,
  supplement,
]) {
  assert(value.batchId === batchId, "Every packet JSON must use the batch ID.");
}

const targetIds = [
  ...assignment.targets.blockedCandidateIds,
  ...assignment.targets.blockedNotProposedRecordIds,
  ...assignment.targets.conflictedExistingMatchIds,
];
const mappingIds = supplement.mappings.map((entry) => entry.originalRecordId);

assert(targetIds.length === 12, "Assignment must contain exactly 12 target IDs.");
assert(unique(targetIds), "Assignment target IDs must be unique.");
assert(supplement.mappings.length === 12, "Supplement must have 12 mappings.");
assert(unique(mappingIds), "Supplement mapping IDs must be unique.");
assert(
  [...targetIds].sort().join("\n") === [...mappingIds].sort().join("\n"),
  "Supplement mappings must cover the assignment target IDs exactly.",
);

assert(
  supplement.mappings.filter((entry) => entry.originalRecordKind === "candidate")
    .length === 9,
  "Supplement must map nine blocked candidates.",
);
assert(
  supplement.mappings.filter(
    (entry) => entry.originalRecordKind === "notProposed",
  ).length === 2,
  "Supplement must map two blocked negative records.",
);
assert(
  supplement.mappings.filter(
    (entry) => entry.originalRecordKind === "existingMatch",
  ).length === 1,
  "Supplement must map one conflicted existing match.",
);
assert(
  supplement.summary.unchangedCandidateRecommendations === 7,
  "Seven unchanged candidate recommendations are required.",
);
assert(
  supplement.summary.correctedCandidateRecommendations === 2,
  "Two corrected candidate recommendations are required.",
);
assert(
  supplement.summary.notProposedReconsiderations === 2,
  "Two not-proposed reconsiderations are required.",
);
assert(
  supplement.summary.existingProductionCorrectionRecommendations === 1,
  "One existing-production correction recommendation is required.",
);

const sources = sourcesLedger.sources;
const sourceIds = sources.map((source) => source.sourceId);
const parentSourceIds = new Set(
  parentSourcesLedger.sources.map((source) => source.sourceId),
);
const supplementSourceIds = new Set(sourceIds);
const lockBySourceId = new Map(
  rawLocks.locks.map((lock) => [lock.sourceId, lock]),
);

assert(fetchLog.sourceCount === 13, "Fetch log must declare 13 sources.");
assert(fetchLog.successCount === 13, "All 13 source fetches must succeed.");
assert(fetchLog.failureCount === 0, "Source fetch failure count must be zero.");
assert(sourcesLedger.sourceCount === 13, "Source ledger count must be 13.");
assert(sourcesLedger.rawSourceCount === 13, "Raw source count must be 13.");
assert(sources.length === 13, "Source ledger must contain 13 sources.");
assert(unique(sourceIds), "Supplement source IDs must be unique.");
assert(rawLocks.sourceCount === 13, "Raw lock source count must be 13.");
assert(rawLocks.locks.length === 13, "Raw locks must contain 13 entries.");
assert(
  unique(rawLocks.locks.map((lock) => lock.sourceId)),
  "Raw lock source IDs must be unique.",
);
assert(
  [...sourceIds].sort().join("\n") ===
    rawLocks.locks
      .map((lock) => lock.sourceId)
      .sort()
      .join("\n"),
  "Raw locks must cover every supplement source exactly.",
);
assert(
  fetchLog.results.filter(
    (result) => result.captureMethod === "verified-local-reuse",
  ).length === 4,
  "Exactly four sources must be verified local reuse.",
);
assert(
  fetchLog.results.filter((result) => result.captureMethod === "http-html")
    .length === 9,
  "Exactly nine sources must be fresh HTTP captures.",
);

let verifiedRawBytes = 0;
let selectedExcerptCount = 0;
for (const source of sources) {
  const rawPath = path.resolve(repoRoot, source.evidence.rawPath);
  let raw;
  try {
    raw = await readFile(rawPath);
  } catch (error) {
    errors.push(`Unable to read raw evidence for ${source.sourceId}: ${error}`);
    continue;
  }
  verifiedRawBytes += raw.byteLength;
  assert(
    raw.byteLength === source.evidence.rawBytes,
    `Raw byte count mismatch for ${source.sourceId}.`,
  );
  assert(
    sha256(raw) === source.evidence.rawSha256,
    `Raw SHA-256 mismatch for ${source.sourceId}.`,
  );
  const lock = lockBySourceId.get(source.sourceId);
  assert(Boolean(lock), `Missing raw lock for ${source.sourceId}.`);
  if (lock) {
    assert(
      lock.rawPath === source.evidence.rawPath,
      `Raw lock path mismatch for ${source.sourceId}.`,
    );
    assert(
      lock.rawBytes === source.evidence.rawBytes,
      `Raw lock byte count mismatch for ${source.sourceId}.`,
    );
    assert(
      lock.rawSha256 === source.evidence.rawSha256,
      `Raw lock hash mismatch for ${source.sourceId}.`,
    );
  }
  const selected = source.evidence.selectedText;
  const actualWords = countWords(selected.text);
  selectedExcerptCount += 1;
  assert(actualWords <= 20, `Excerpt exceeds 20 words for ${source.sourceId}.`);
  assert(
    actualWords === selected.wordCount,
    `Excerpt word count mismatch for ${source.sourceId}.`,
  );
  assert(
    selected.maxWords === 20,
    `Excerpt maximum must be 20 words for ${source.sourceId}.`,
  );
  assert(
    sha256(selected.text) === selected.sha256,
    `Excerpt SHA-256 mismatch for ${source.sourceId}.`,
  );
  assert(
    raw.toString("utf8").includes(selected.text),
    `Selected excerpt is not present in retained raw evidence for ${source.sourceId}.`,
  );
  assert(
    source.lineage.independentForCorroboration === true,
    `Source lineage must declare independence for ${source.sourceId}.`,
  );
  assert(
    source.roles.includes("publicOrdinal") &&
      source.roles.includes("appearanceDate") &&
      source.roles.includes("channelIdentity"),
    `Exact source roles are incomplete for ${source.sourceId}.`,
  );
}

let evidenceReferenceCount = 0;
for (const mapping of supplement.mappings) {
  assert(
    mapping.independentReviewRequired === true,
    `Independent review must remain required for ${mapping.originalRecordId}.`,
  );
  assert(
    mapping.implementationAuthorized === false,
    `Implementation must remain unauthorized for ${mapping.originalRecordId}.`,
  );
  assert(
    mapping.corroboration.exactVersionOrdinalDateLineages >= 2,
    `At least two exact lineages are required for ${mapping.originalRecordId}.`,
  );
  assert(
    mapping.corroboration.independentPublisherFamilies === true,
    `Independent publisher families must be explicit for ${mapping.originalRecordId}.`,
  );
  assert(
    unique(mapping.corroboration.publisherFamilies) &&
      mapping.corroboration.publisherFamilies.length >= 2,
    `At least two unique publisher families are required for ${mapping.originalRecordId}.`,
  );
  for (const evidenceRef of mapping.evidenceRefs) {
    evidenceReferenceCount += 1;
    if (evidenceRef.kind === "supplementSource") {
      assert(
        supplementSourceIds.has(evidenceRef.sourceId),
        `Unresolved supplement source ${evidenceRef.sourceId} for ${mapping.originalRecordId}.`,
      );
    } else if (evidenceRef.kind === "parentPacketSource") {
      assert(
        parentSourceIds.has(evidenceRef.sourceId),
        `Unresolved parent source ${evidenceRef.sourceId} for ${mapping.originalRecordId}.`,
      );
    } else {
      errors.push(
        `Unknown evidence reference kind ${evidenceRef.kind} for ${mapping.originalRecordId}.`,
      );
    }
  }
}

const byRecordId = new Map(
  supplement.mappings.map((entry) => [entry.originalRecordId, entry]),
);
const assertIdentity = (recordId, expected) => {
  const actual = byRecordId.get(recordId)?.proposedIdentity;
  assert(Boolean(actual), `Missing proposed identity for ${recordId}.`);
  if (!actual) return;
  for (const [key, value] of Object.entries(expected)) {
    assert(
      actual[key] === value,
      `Corrected identity ${key} mismatch for ${recordId}.`,
    );
  }
};

assertIdentity("candidate:apple:ios:14.0:public-beta-1", {
  label: "Public Beta 2",
  routeAlias: "public-beta-2",
  sequence: 2,
  appearanceDate: "2020-07-09",
});
assertIdentity("candidate:apple:ios:15.0:public-beta-2", {
  label: "Public Beta 3",
  routeAlias: "public-beta-3",
  sequence: 3,
  appearanceDate: "2021-07-16",
});
assertIdentity("not-proposed:apple:ios:14.0:public-beta-2", {
  label: "Public Beta 2",
  routeAlias: "public-beta-2",
  sequence: 2,
  appearanceDate: "2020-07-09",
});
assertIdentity("not-proposed:apple:ios:15.0:public-beta-3", {
  label: "Public Beta 3",
  routeAlias: "public-beta-3",
  sequence: 3,
  appearanceDate: "2021-07-16",
});
assertIdentity("existing-match:apple:ios:15.0:public-beta-1", {
  label: "Public Beta 2",
  routeAlias: "public-beta-2",
  sequence: 2,
  appearanceDate: "2021-06-30",
});

const existingCorrection = byRecordId.get(
  "existing-match:apple:ios:15.0:public-beta-1",
);
assert(
  existingCorrection.productionReconciliation.duplicateCreationForbidden ===
    true,
  "The iOS 15 production identity correction must forbid duplicate creation.",
);
assert(
  existingCorrection.productionReconciliation.currentProductionEventId ===
    "release-event-50da2e4e5ec3bdd8fa582ce1",
  "The iOS 15 correction must retain the freshly queried production event ID.",
);

const exactCheckById = new Map(
  production.exactChecks.map((check) => [check.targetId, check]),
);
const expectedCheckIds = [
  "ios12-pb1",
  "ios12-pb2",
  "ios12-pb3",
  "ios12-pb4",
  "ios12-pb5",
  "ios14-original-pb1-july9",
  "ios14-corrected-pb2-july9",
  "ios14-alleged-pb2-july22",
  "ios15-production-pb1-june30",
  "ios15-corrected-pb2-june30",
  "ios15-original-pb2-july16",
  "ios15-corrected-pb3-july16",
  "ios17-pb6",
  "ios18-pb5",
];
assert(production.perspective === "published", "Production must use published.");
assert(production.useCdn === false, "Production query must bypass the CDN.");
assert(production.versions.length === 5, "Exactly five parents must resolve.");
assert(
  unique(production.versions.map((version) => version._id)),
  "Release-version parents must be unique.",
);
assert(
  production.exactChecks.length === 14,
  "Production snapshot must contain 14 exact checks.",
);
assert(
  [...expectedCheckIds].sort().join("\n") ===
    [...exactCheckById.keys()].sort().join("\n"),
  "Production exact checks must cover the expected target identities.",
);
for (const checkId of expectedCheckIds) {
  const check = exactCheckById.get(checkId);
  if (!check) continue;
  const expectedExact = checkId === "ios15-production-pb1-june30" ? 1 : 0;
  assert(
    check.exactIdentityMatchCount === expectedExact,
    `Unexpected production exact-match count for ${checkId}.`,
  );
}
assert(
  exactCheckById.get("ios15-corrected-pb2-june30")?.dateMatchCount === 1,
  "Corrected iOS 15 PB2 must reconcile to the one same-date production event.",
);
assert(
  production.safety.readOnly === true &&
    production.safety.sanityMutationPerformed === false,
  "Production snapshot must be explicitly read-only and mutation-free.",
);

assert(
  sourceRoleCorrections.correctionCount === 10 &&
    sourceRoleCorrections.corrections.length === 10,
  "Exactly ten parent source-role corrections are required.",
);
assert(
  unique(
    sourceRoleCorrections.corrections.map(
      (correction) => correction.correctionId,
    ),
  ),
  "Source-role correction IDs must be unique.",
);

for (const [key, expected] of [
  ["sanityMutationAllowed", false],
  ["stableEventIdCreationAllowed", false],
  ["pageWorkAllowed", false],
  ["publicationAuthorized", false],
  ["deploymentAuthorized", false],
  ["researcherPerformedIndependentReview", false],
]) {
  assert(
    supplement.safety[key] === expected,
    `Supplement safety.${key} must be ${expected}.`,
  );
}

const parentFiles = [
  [
    "validation.json",
    assignment.parentPacket.parentValidationSha256,
  ],
  [
    "packet-locks.json",
    assignment.parentPacket.parentPacketLocksSha256,
  ],
  [
    "independent-review.json",
    assignment.parentPacket.parentIndependentReviewSha256,
  ],
];
for (const [filename, expectedHash] of parentFiles) {
  const bytes = await readFile(
    path.resolve(
      repoRoot,
      `research-handoffs/beta-chronology-gap/ios-major-12-18/${filename}`,
    ),
  );
  assert(
    sha256(bytes) === expectedHash,
    `Frozen parent ${filename} changed after follow-up assignment.`,
  );
}

const result = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  valid: errors.length === 0,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings,
  checks: {
    assignmentTargetCount: targetIds.length,
    supplementMappingCount: supplement.mappings.length,
    unchangedCandidateRecommendationCount:
      supplement.summary.unchangedCandidateRecommendations,
    correctedCandidateRecommendationCount:
      supplement.summary.correctedCandidateRecommendations,
    notProposedReconsiderationCount:
      supplement.summary.notProposedReconsiderations,
    existingProductionCorrectionRecommendationCount:
      supplement.summary.existingProductionCorrectionRecommendations,
    sourceCount: sources.length,
    verifiedRawSourceCount: sources.length,
    verifiedRawBytes,
    selectedExcerptCount,
    selectedExcerptsAtOrBelowTwentyWords: errors.every(
      (error) => !error.includes("Excerpt"),
    ),
    freshCaptureCount: 9,
    verifiedReuseCount: 4,
    evidenceReferenceCount,
    sourceRoleCorrectionCount: sourceRoleCorrections.corrections.length,
    releaseVersionParentCount: production.versions.length,
    productionExactCheckCount: production.exactChecks.length,
    productionExactExistingMatchCount: production.exactChecks.reduce(
      (sum, check) => sum + check.exactIdentityMatchCount,
      0,
    ),
    freshProductionPerspective: production.perspective,
    freshProductionUseCdn: production.useCdn,
    freshProductionReadOnly: production.safety.readOnly,
    frozenParentDependencyCount: parentFiles.length,
    sanityMutationPerformed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
    independentReviewPerformedByResearcher: false,
  },
  nextGate:
    "A different agent must independently review the frozen supplement before any separately authorized implementation.",
};

if (writeMode) {
  await writeFile(
    path.join(packetDir, "validation.json"),
    `${JSON.stringify(result, null, 2)}\n`,
    "utf8",
  );
}

console.log(JSON.stringify(result, null, 2));
if (!result.valid) process.exitCode = 1;
