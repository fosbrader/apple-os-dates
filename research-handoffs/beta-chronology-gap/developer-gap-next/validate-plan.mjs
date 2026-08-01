import { createHash } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packetDirectory = path.dirname(fileURLToPath(import.meta.url));
const planPath = path.join(packetDirectory, "plan.json");
const validationPath = path.join(
  packetDirectory,
  "validation.json",
);
const planBytes = readFileSync(planPath);
const plan = JSON.parse(planBytes.toString("utf8"));
const errors = [];
const warnings = [];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

function countBy(values, key) {
  return Object.fromEntries(
    values.reduce((counts, value) => {
      const group = key(value);
      counts.set(group, (counts.get(group) || 0) + 1);
      return counts;
    }, new Map()),
  );
}

function equalCounts(actual, expected) {
  const keys = new Set([
    ...Object.keys(actual),
    ...Object.keys(expected),
  ]);

  return [...keys].every(
    (key) => actual[key] === expected[key],
  );
}

function releaseVersionIdSetSha256(targets) {
  return sha256(
    `${targets
      .map((target) => target.releaseVersionId)
      .sort()
      .join("\n")}\n`,
  );
}

const expectedWaveCounts = {
  "developer-modern-high-priority": 10,
  "developer-legacy-terminology-modeling": 14,
  "developer-ios-patch-1-4": 20,
  "developer-ios-patch-5-9": 22,
  "developer-ios-patch-10-13": 15,
  "developer-ios-patch-14-16": 16,
  "developer-ios-patch-17-26": 18,
};
const expectedPlatformCounts = {
  iOS: 105,
  iPadOS: 2,
  macOS: 6,
  watchOS: 2,
};
const expectedPriorityCounts = {
  highMajorOrPointRelease: 22,
  routinePatchApplicabilityCheck: 91,
  highestPublicBetaEvidence: 2,
};
const expectedCategoryCounts = {
  modernHighPriorityPointOrRelease: 10,
  legacyMajorPointTerminologyModeling: 14,
  iosPatchHotfixApplicability: 91,
};
const expectedPlannedIdSetSha256 =
  "10d9147a3e4970916b4e35726c61617fa55197d3f310f9ffbe94d120fd740e12";
const expectedPriorityParents = [
  "version-ios-9-2-1",
  "version-ios-10-2-1",
  "version-ios-10-3-2",
  "version-ios-10-3-3",
].sort();

check(plan.formatVersion === 1, "Unexpected plan formatVersion.");
check(
  plan.artifactType === "boundedResearchPlan",
  "Plan must remain a boundedResearchPlan.",
);
check(plan.waves.length === 7, "Expected exactly seven waves.");
check(
  plan.frozenInputs.coverageMatrix.coverageSummary
    .structuredCandidateCount === 855 &&
    plan.frozenInputs.coverageMatrix.coverageSummary
      .structuredCandidateReadiness
      .readyForChronologyReview === 666 &&
    Array.isArray(
      plan.frozenInputs.coverageMatrix
        .activeUnfrozenResearchWaves,
    ) &&
    plan.frozenInputs.coverageMatrix
      .activeUnfrozenResearchWaves.length === 0,
  "The plan is not pinned to the finalized 855/666, zero-active-wave coverage state.",
);

const waveIds = plan.waves.map((wave) => wave.waveId);
check(
  new Set(waveIds).size === waveIds.length,
  "Wave IDs are not unique.",
);
check(
  JSON.stringify(
    plan.waves.map((wave) => wave.order),
  ) === JSON.stringify([1, 2, 3, 4, 5, 6, 7]),
  "Wave order must be exactly 1 through 7.",
);

const targets = plan.waves.flatMap((wave) => wave.targets);
const targetIds = targets.map((target) => target.releaseVersionId);
const uniqueTargetIds = new Set(targetIds);
const sourceQueueIndexes = targets
  .map((target) => target.sourceQueueIndex)
  .sort((left, right) => left - right);
const expectedQueueIndexes = Array.from(
  { length: 115 },
  (_, index) => index + 1,
);

check(targets.length === 115, "Expected exactly 115 planned rows.");
check(
  uniqueTargetIds.size === 115,
  "Expected 115 unique planned releaseVersion IDs.",
);
check(
  JSON.stringify(sourceQueueIndexes) ===
    JSON.stringify(expectedQueueIndexes),
  "Frozen source queue indexes must cover 1 through 115 exactly once.",
);

for (const wave of plan.waves) {
  check(
    wave.targetCount === wave.targets.length,
    `${wave.waveId} targetCount does not match its targets.`,
  );
  check(
    wave.targetCount === expectedWaveCounts[wave.waveId],
    `${wave.waveId} has an unexpected count.`,
  );
  check(
    wave.releaseVersionIdSetSha256 ===
      releaseVersionIdSetSha256(wave.targets),
    `${wave.waveId} releaseVersion ID set hash does not reproduce.`,
  );
}

const calculatedIdSetSha256 =
  releaseVersionIdSetSha256(targets);
check(
  calculatedIdSetSha256 === expectedPlannedIdSetSha256,
  "The exact 115-ID assignment set differs from the reviewed set.",
);
check(
  plan.queueReconciliation.plannedReleaseVersionIdSetSha256 ===
    calculatedIdSetSha256,
  "The plan-level releaseVersion ID set hash does not reproduce.",
);

const platformCounts = countBy(
  targets,
  (target) => target.platform,
);
const priorityCounts = countBy(
  targets,
  (target) => target.currentInventory.auditPriority,
);
const categoryCounts = Object.fromEntries(
  Object.keys(expectedCategoryCounts).map((category) => [
    category,
    plan.waves
      .filter((wave) => wave.category === category)
      .reduce((count, wave) => count + wave.targetCount, 0),
  ]),
);

check(
  equalCounts(platformCounts, expectedPlatformCounts),
  "Platform counts do not reconcile.",
);
check(
  equalCounts(priorityCounts, expectedPriorityCounts),
  "Audit-priority counts do not reconcile.",
);
check(
  equalCounts(categoryCounts, expectedCategoryCounts),
  "Category counts do not reconcile.",
);
check(
  equalCounts(
    plan.plannedCategoryCounts,
    expectedCategoryCounts,
  ),
  "Declared category counts do not reconcile.",
);

const modernWave = plan.waves.find(
  (wave) => wave.waveId === "developer-modern-high-priority",
);
const legacyWave = plan.waves.find(
  (wave) =>
    wave.waveId === "developer-legacy-terminology-modeling",
);
check(
  modernWave.targets.every(
    (target) =>
      target.currentInventory.publicReleaseDate >= "2020-01-01" &&
      target.currentInventory.auditPriority !==
        "routinePatchApplicabilityCheck",
  ),
  "Modern wave contains a row outside its frozen selection rule.",
);
check(
  legacyWave.targets.every(
    (target) =>
      target.currentInventory.publicReleaseDate < "2020-01-01" &&
      target.currentInventory.auditPriority !==
        "routinePatchApplicabilityCheck",
  ),
  "Legacy wave contains a row outside its frozen selection rule.",
);

const patchRanges = {
  "developer-ios-patch-1-4": [1, 4],
  "developer-ios-patch-5-9": [5, 9],
  "developer-ios-patch-10-13": [10, 13],
  "developer-ios-patch-14-16": [14, 16],
  "developer-ios-patch-17-26": [17, 26],
};
for (const [waveId, [minimumMajor, maximumMajor]] of Object.entries(
  patchRanges,
)) {
  const wave = plan.waves.find((item) => item.waveId === waveId);
  check(
    wave.targets.every((target) => {
      const parts = target.version.split(".");
      const major = Number.parseInt(parts[0], 10);
      return (
        target.platform === "iOS" &&
        parts.length === 3 &&
        target.currentInventory.auditPriority ===
          "routinePatchApplicabilityCheck" &&
        major >= minimumMajor &&
        major <= maximumMajor
      );
    }),
    `${waveId} contains a target outside its iOS patch range.`,
  );
}

for (const target of targets) {
  check(
    target.currentInventory.productionDeveloperBetaEventCount ===
      0,
    `${target.releaseVersionId} does not freeze a zero production developer-beta count.`,
  );
  check(
    target.currentInventory
      .structuredDeveloperBetaCandidateCount === 0,
    `${target.releaseVersionId} overlaps a structured developer candidate.`,
  );
  check(
    Array.isArray(
      target.currentInventory
        .structuredDeveloperBetaCandidates,
    ) &&
      target.currentInventory
        .structuredDeveloperBetaCandidates.length === 0,
    `${target.releaseVersionId} has unexpected structured developer candidates.`,
  );
}

const separatePacket =
  plan.frozenInputs.separatePriorityPacket;
const separateCandidateIds = separatePacket.candidates.map(
  (candidate) => candidate.candidateId,
);
const separateParentIds = [
  ...new Set(
    separatePacket.candidates.map(
      (candidate) => candidate.releaseVersionId,
    ),
  ),
].sort();
check(
  separatePacket.candidateIdentityCount === 17 &&
    separateCandidateIds.length === 17 &&
    new Set(separateCandidateIds).size === 17,
  "Separate priority packet must account for 17 unique candidates.",
);
check(
  separatePacket.chronologyApprovedCandidateCount === 17,
  "Separate priority packet must retain 17 chronology approvals.",
);
check(
  separatePacket.parentVersionCount === 4 &&
    JSON.stringify(separateParentIds) ===
      JSON.stringify(expectedPriorityParents),
  "Separate priority packet must account for the expected four parents.",
);
check(
  separateParentIds.every((id) => !uniqueTargetIds.has(id)),
  "A separate priority parent overlaps the 115-row plan.",
);
check(
  separatePacket.candidates.every(
    (candidate) => candidate.channel === "developerBeta",
  ),
  "Separate priority packet contains a non-developer candidate.",
);

const reconciliation = plan.queueReconciliation;
check(
  reconciliation.versionCountWithoutProductionDeveloperBeta ===
    119 &&
    reconciliation.versionRowsRepresentedBySeparatePriorityCandidates ===
      4 &&
    reconciliation.remainingVersionLevelApplicabilityRows === 115 &&
    reconciliation.plannedVersionLevelApplicabilityRows === 115 &&
    4 + 115 === 119,
  "The 119 = 4 + 115 version-row reconciliation failed.",
);
check(
  reconciliation.separateChronologyApprovedCandidateIdentityCount ===
    17,
  "The separate 17-event identity count is not accounted for.",
);

const authority = plan.authority;
check(
  authority.planningOnly === true &&
    authority.webResearchPerformed === false &&
    authority.productionQueryPerformed === false &&
    authority.sanityReadPerformed === false &&
    authority.sanityMutationAllowed === false &&
    authority.stableEventIdCreationAllowed === false &&
    authority.productionIdAllocationAllowed === false &&
    authority.pageBuildAllowed === false &&
    authority.publicationAllowed === false &&
    authority.deploymentAllowed === false,
  "Plan authority expanded beyond local planning.",
);
check(
  plan.productionReconciliationGate.clientRequirements
    .perspective === "published" &&
    plan.productionReconciliationGate.clientRequirements.useCdn ===
      false &&
    plan.productionReconciliationGate.clientRequirements.queryOnly ===
      true,
  "Fresh production reconciliation requirements are incomplete.",
);
check(
  Boolean(
    plan.reviewGates
      .stageOneIndependentEvidenceAndChronologyReview,
  ) &&
    Boolean(
      plan.reviewGates
        .stageTwoIndependentIntegrationAndFreshnessReview,
    ),
  "Both independent review stages must be present.",
);
check(
  plan.safety.noSanityMutation === true &&
    plan.safety.noStableEventIds === true &&
    plan.safety.noPageBuilds === true &&
    plan.safety.noPublication === true &&
    plan.safety.noDeployment === true &&
    plan.safety.noSharedAggregateEdits === true,
  "Plan safety flags are incomplete.",
);

const validation = {
  formatVersion: 1,
  artifactType: "developerGapPlanValidation",
  validatedAt: new Date().toISOString(),
  validatorInputScope:
    "Packet-local plan.json only; no shared aggregate, web, Sanity, or production query was read.",
  plan: {
    path:
      "research-handoffs/beta-chronology-gap/developer-gap-next/plan.json",
    bytes: planBytes.length,
    sha256: sha256(planBytes),
    plannedReleaseVersionIdSetSha256:
      calculatedIdSetSha256,
  },
  counts: {
    waveCount: plan.waves.length,
    plannedRowCount: targets.length,
    uniqueReleaseVersionIdCount: uniqueTargetIds.size,
    waveCounts: Object.fromEntries(
      plan.waves.map((wave) => [
        wave.waveId,
        wave.targetCount,
      ]),
    ),
    categoryCounts,
    platformCounts,
    priorityCounts,
    separatePriorityPacket: {
      parentVersionCount: separateParentIds.length,
      chronologyApprovedCandidateIdentityCount:
        separateCandidateIds.length,
      overlapWithPlannedRows: separateParentIds.filter((id) =>
        uniqueTargetIds.has(id),
      ).length,
    },
    versionRowReconciliation: {
      totalWithoutProductionDeveloperBeta: 119,
      representedBySeparatePriorityPacket: 4,
      remainingAndPlanned: targets.length,
    },
  },
  checks: {
    exact115RowPartition: errors.length === 0,
    disjointWaveMembership: uniqueTargetIds.size === targets.length,
    exactReviewedIdSet:
      calculatedIdSetSha256 === expectedPlannedIdSetSha256,
    separate17CandidatePacketAccountedFor:
      separateCandidateIds.length === 17 &&
      separateParentIds.length === 4,
    noAuthorityExpansion:
      authority.planningOnly === true &&
      authority.sanityMutationAllowed === false,
    twoIndependentReviewStagesRequired: Boolean(
      plan.reviewGates
        .stageOneIndependentEvidenceAndChronologyReview &&
        plan.reviewGates
          .stageTwoIndependentIntegrationAndFreshnessReview,
    ),
  },
  errors,
  warnings,
  valid: errors.length === 0,
};

const output = `${JSON.stringify(validation, null, 2)}\n`;

if (process.argv.includes("--write")) {
  writeFileSync(validationPath, output);
  console.log(`Wrote ${validationPath}`);
}

process.stdout.write(output);
if (errors.length > 0) process.exitCode = 1;
