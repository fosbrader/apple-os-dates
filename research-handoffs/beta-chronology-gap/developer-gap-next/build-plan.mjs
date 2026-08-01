import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packetDirectory = path.dirname(fileURLToPath(import.meta.url));
const programDirectory = path.resolve(packetDirectory, "..");

const inputPaths = {
  coverageMatrix: path.join(programDirectory, "coverage-matrix.json"),
  priorityAssignment: path.join(
    programDirectory,
    "developer-gap-priority",
    "assignment.json",
  ),
  priorityCandidates: path.join(
    programDirectory,
    "developer-gap-priority",
    "candidates.json",
  ),
  priorityIndependentReview: path.join(
    programDirectory,
    "developer-gap-priority",
    "independent-review.json",
  ),
  priorityPacketLocks: path.join(
    programDirectory,
    "developer-gap-priority",
    "packet-locks.json",
  ),
};

const expectedHashes = {
  coverageMatrix:
    "011c7f59be5191ac567ead01c704a5ee506a9aeb59bd630c104a2afb8114ced8",
  priorityAssignment:
    "7d70fd59f3cdbbab05a6ff782555f007897be97e0fbd7d89110c22e3b1ebfa2b",
  priorityCandidates:
    "c9a9706b9f776cedf08ff07784ef046df7a4e1227bd73bd5815a180f412c842b",
  priorityIndependentReview:
    "30cf5fb6465db7f9e8ea2db5e2414582136bc0a88a89362717e81c89ad6ec315",
  priorityPacketLocks:
    "ed353c8f3db5e3a0fa7cb110aa9585c6c7a6473d60353391a10ab5fb44b60df0",
};

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function readPinnedJson(name) {
  const bytes = readFileSync(inputPaths[name]);
  const actualHash = sha256(bytes);

  assert.equal(
    actualHash,
    expectedHashes[name],
    `${name} drifted from the input reviewed for this plan`,
  );

  return {
    data: JSON.parse(bytes.toString("utf8")),
    bytes: bytes.length,
    sha256: actualHash,
  };
}

const coverageInput = readPinnedJson("coverageMatrix");
const priorityAssignmentInput = readPinnedJson("priorityAssignment");
const priorityCandidatesInput = readPinnedJson("priorityCandidates");
const priorityReviewInput = readPinnedJson("priorityIndependentReview");
const priorityLocksInput = readPinnedJson("priorityPacketLocks");

const coverage = coverageInput.data;
const priorityAssignment = priorityAssignmentInput.data;
const priorityCandidates = priorityCandidatesInput.data;
const priorityReview = priorityReviewInput.data;

const remainingRows = coverage.remainingDeveloperBetaAuditRows;
assert.equal(remainingRows.length, 115);
assert.equal(coverage.summary.structuredCandidateCount, 855);
assert.equal(
  coverage.summary.structuredCandidateReadiness
    .readyForChronologyReview,
  666,
);
assert.deepEqual(coverage.activeUnfrozenResearchWaves, []);

const priorityParentIds = new Set(
  priorityCandidates.candidates.map(
    (candidate) => candidate.releaseVersionId,
  ),
);
assert.equal(priorityParentIds.size, 4);
assert.equal(priorityCandidates.candidates.length, 17);
assert.equal(
  priorityReview.summary.chronologyApprovedCandidateCount,
  17,
);

const remainingIds = new Set(
  remainingRows.map((row) => row.releaseVersionId),
);
assert.equal(remainingIds.size, 115);
assert.deepEqual(
  [...priorityParentIds].filter((id) => remainingIds.has(id)),
  [],
);

function versionMajor(row) {
  return Number.parseInt(row.version.split(".")[0], 10);
}

function chronological(left, right) {
  return (
    left.publicReleaseDate.localeCompare(right.publicReleaseDate) ||
    left.platform.localeCompare(right.platform) ||
    left.version.localeCompare(right.version, undefined, {
      numeric: true,
    })
  );
}

function isApplicabilityPatch(row) {
  return row.auditPriority === "routinePatchApplicabilityCheck";
}

function releaseVersionIdSetSha256(rows) {
  const normalized = rows
    .map((row) => row.releaseVersionId)
    .sort()
    .join("\n");

  return sha256(`${normalized}\n`);
}

const nonPatchRows = remainingRows
  .filter((row) => !isApplicabilityPatch(row))
  .sort(chronological);
const patchRows = remainingRows
  .filter(isApplicabilityPatch)
  .sort(chronological);

const modernHighPriorityRows = nonPatchRows.filter(
  (row) => row.publicReleaseDate >= "2020-01-01",
);
const legacyTerminologyRows = nonPatchRows.filter(
  (row) => row.publicReleaseDate < "2020-01-01",
);

function patchEra(minimumMajor, maximumMajor) {
  return patchRows.filter((row) => {
    const major = versionMajor(row);
    return major >= minimumMajor && major <= maximumMajor;
  });
}

function freezeTarget(row) {
  const sourceQueueIndex =
    remainingRows.findIndex(
      (candidate) =>
        candidate.releaseVersionId === row.releaseVersionId,
    ) + 1;

  return {
    releaseVersionId: row.releaseVersionId,
    platform: row.platform,
    platformId: row.platformId,
    version: row.version,
    sourceQueueIndex,
    currentInventory: {
      inventoryQueriedAt: coverage.productionSnapshot.queriedAt,
      publicReleaseDate: row.publicReleaseDate,
      releaseStatus: row.releaseStatus,
      productionDeveloperBetaEventCount: 0,
      productionDeveloperBetaEventCountBasis:
        "Membership in coverage-matrix.developerBetaAuditRows, whose rows are modeled versions with zero production developerBeta events.",
      productionPublicBetaEventCount:
        row.productionPublicBetaEventCount,
      structuredPublicBetaCandidateCount:
        row.structuredPublicBetaCandidateCount,
      structuredDeveloperBetaCandidateCount:
        row.structuredDeveloperBetaCandidateCount,
      structuredDeveloperBetaCandidates:
        row.structuredDeveloperBetaCandidates,
      auditPriority: row.auditPriority,
      caution: row.caution,
    },
  };
}

function wave({
  waveId,
  order,
  title,
  category,
  selectionRuleAtFreeze,
  objective,
  modelingFocus,
  rows,
}) {
  return {
    waveId,
    order,
    title,
    category,
    selectionRuleAtFreeze,
    objective,
    modelingFocus,
    targetCount: rows.length,
    releaseVersionIdSetSha256: releaseVersionIdSetSha256(rows),
    targets: rows.map(freezeTarget),
  };
}

const waves = [
  wave({
    waveId: "developer-modern-high-priority",
    order: 1,
    title: "Modern high-priority point and compatibility-release gaps",
    category: "modernHighPriorityPointOrRelease",
    selectionRuleAtFreeze:
      "Remaining non-routine developer audit rows with publicReleaseDate on or after 2020-01-01.",
    objective:
      "Audit full developer-channel sequences for modern point or compatibility releases, prioritizing the two rows that already have strong public-beta evidence.",
    modelingFocus:
      "Keep developer and public appearances separate; determine whether each apparent point cycle had its own developer sequence or inherited a differently labeled cycle.",
    rows: modernHighPriorityRows,
  }),
  wave({
    waveId: "developer-legacy-terminology-modeling",
    order: 2,
    title: "Legacy major and point terminology/modeling gaps",
    category: "legacyMajorPointTerminologyModeling",
    selectionRuleAtFreeze:
      "Remaining non-routine developer audit rows with publicReleaseDate before 2020-01-01.",
    objective:
      "Determine applicability before proposing events for early iPhone OS, Mac OS X, and watchOS cycles whose historical distribution terminology may not map cleanly to developerBeta.",
    modelingFocus:
      "Treat Developer Preview, seed, GM, RC, AppleSeed, internal, SDK-only, and device-firmware references as distinct or unresolved unless evidence explicitly establishes a developer beta appearance.",
    rows: legacyTerminologyRows,
  }),
  wave({
    waveId: "developer-ios-patch-1-4",
    order: 3,
    title: "iOS patch/hotfix applicability — iPhone OS/iOS 1 through 4",
    category: "iosPatchHotfixApplicability",
    selectionRuleAtFreeze:
      "Remaining routine patch applicability rows on iOS whose version major is 1 through 4.",
    objective:
      "Audit early patch and hotfix releases without assuming the later numbered developer-beta model applied.",
    modelingFocus:
      "Resolve pre-modern terminology and distinguish SDK/device preview material from an exact OS developer beta.",
    rows: patchEra(1, 4),
  }),
  wave({
    waveId: "developer-ios-patch-5-9",
    order: 4,
    title: "iOS patch/hotfix applicability — iOS 5 through 9",
    category: "iosPatchHotfixApplicability",
    selectionRuleAtFreeze:
      "Remaining routine patch applicability rows on iOS whose version major is 5 through 9.",
    objective:
      "Audit patch releases across the transition into Apple’s modern public beta era while preserving channel-specific numbering.",
    modelingFocus:
      "Do not treat a public beta, carrier seed, or generic prerelease report as proof of a developer beta.",
    rows: patchEra(5, 9),
  }),
  wave({
    waveId: "developer-ios-patch-10-13",
    order: 5,
    title: "iOS patch/hotfix applicability — iOS 10 through 13",
    category: "iosPatchHotfixApplicability",
    selectionRuleAtFreeze:
      "Remaining routine patch applicability rows on iOS whose version major is 10 through 13.",
    objective:
      "Audit patch cycles adjacent to the four already reviewed priority parents without duplicating their 17 approved candidate identities.",
    modelingFocus:
      "Reconstruct every applicable sequence from Beta 1 through the last supported ordinal and test the next ordinal before closing the cycle.",
    rows: patchEra(10, 13),
  }),
  wave({
    waveId: "developer-ios-patch-14-16",
    order: 6,
    title: "iOS patch/hotfix applicability — iOS 14 through 16",
    category: "iosPatchHotfixApplicability",
    selectionRuleAtFreeze:
      "Remaining routine patch applicability rows on iOS whose version major is 14 through 16.",
    objective:
      "Audit modern patch and security-fix releases that may have shipped without an external prerelease cycle.",
    modelingFocus:
      "A same-day or matching-build public seed cannot establish a developer appearance; preserve separate dates and audiences.",
    rows: patchEra(14, 16),
  }),
  wave({
    waveId: "developer-ios-patch-17-26",
    order: 7,
    title: "iOS patch/hotfix applicability — iOS 17 through 26",
    category: "iosPatchHotfixApplicability",
    selectionRuleAtFreeze:
      "Remaining routine patch applicability rows on iOS whose version major is 17 through 26.",
    objective:
      "Audit the newest patch and hotfix releases using current source formats while treating the frozen inventory, not a regenerated aggregate, as the assignment.",
    modelingFocus:
      "Check rapid replacements, withdrawals, revised seeds, device-limited releases, and stable-only hotfixes without inferring a beta from chronology proximity.",
    rows: patchEra(17, 26),
  }),
];

const priorityCandidateSnapshot = priorityAssignment.targets.map(
  (target) => ({
    candidateId: target.candidateId,
    releaseVersionId: target.releaseVersionId,
    platform: "iOS",
    version: target.version,
    channel: "developerBeta",
    routeAlias: target.routeAlias,
    appearanceDate: target.appearanceDate,
    chronologyDisposition:
      priorityReview.candidateVerdict.chronologyApprovedWithQualification.includes(
        target.candidateId,
      )
        ? "chronologyApprovedWithQualification"
        : "chronologyApproved",
  }),
);

const plan = {
  formatVersion: 1,
  programId: "apple-developer-beta-gap-next",
  artifactType: "boundedResearchPlan",
  createdAt: "2026-07-31T09:13:39Z",
  createdBy: "codex-planning-agent",
  authority: {
    planningOnly: true,
    webResearchPerformed: false,
    productionQueryPerformed: false,
    sanityReadPerformed: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    productionIdAllocationAllowed: false,
    pageBuildAllowed: false,
    publicationAllowed: false,
    deploymentAllowed: false,
  },
  frozenInputs: {
    coverageMatrix: {
      path:
        "research-handoffs/beta-chronology-gap/coverage-matrix.json",
      bytes: coverageInput.bytes,
      sha256: coverageInput.sha256,
      formatVersion: coverage.formatVersion,
      programId: coverage.programId,
      generatedAt: coverage.generatedAt,
      productionSnapshot: coverage.productionSnapshot,
      coverageSummary: coverage.summary,
      activeUnfrozenResearchWaves:
        coverage.activeUnfrozenResearchWaves,
      developerBetaInventoryByPlatform:
        coverage.developerBetaInventoryByPlatform,
      developerBetaInventorySummary:
        coverage.summary.developerBetaInventory,
    },
    separatePriorityPacket: {
      packetPath:
        "research-handoffs/beta-chronology-gap/developer-gap-priority/",
      assignment: {
        bytes: priorityAssignmentInput.bytes,
        sha256: priorityAssignmentInput.sha256,
      },
      candidates: {
        bytes: priorityCandidatesInput.bytes,
        sha256: priorityCandidatesInput.sha256,
      },
      independentReview: {
        bytes: priorityReviewInput.bytes,
        sha256: priorityReviewInput.sha256,
        verdict: priorityReview.verdict,
      },
      packetLocks: {
        bytes: priorityLocksInput.bytes,
        sha256: priorityLocksInput.sha256,
      },
      parentVersionCount: priorityParentIds.size,
      candidateIdentityCount: priorityCandidateSnapshot.length,
      chronologyApprovedCandidateCount:
        priorityReview.summary.chronologyApprovedCandidateCount,
      publicationEligible:
        priorityReview.authorization.publicationEligible,
      candidates: priorityCandidateSnapshot,
      requiredNextGate: priorityReview.requiredNextGate,
      relationshipToThisPlan:
        "The four parent versions and 17 chronology-approved identities are represented only in the separate frozen packet. They are excluded from all seven waves and do not consume any of the 115 remaining version-level rows.",
    },
  },
  queueReconciliation: {
    versionCountWithoutProductionDeveloperBeta: 119,
    versionRowsRepresentedBySeparatePriorityCandidates: 4,
    separateChronologyApprovedCandidateIdentityCount: 17,
    remainingVersionLevelApplicabilityRows: 115,
    plannedVersionLevelApplicabilityRows: 115,
    uniquePlannedReleaseVersionIds: 115,
    plannedReleaseVersionIdSetSha256:
      releaseVersionIdSetSha256(remainingRows),
    equation:
      "119 version-level applicability rows = 4 version rows represented by the separate 17-candidate developer-gap-priority packet + 115 version rows in this plan.",
    candidateCountWarning:
      "The 17 approved candidates are event identities spanning four version parents; they must not be added to the 115 version-row denominator.",
  },
  waveSummary: waves.map((item) => ({
    waveId: item.waveId,
    order: item.order,
    category: item.category,
    targetCount: item.targetCount,
  })),
  plannedCategoryCounts: {
    modernHighPriorityPointOrRelease: modernHighPriorityRows.length,
    legacyMajorPointTerminologyModeling:
      legacyTerminologyRows.length,
    iosPatchHotfixApplicability: patchRows.length,
  },
  executionPolicy: {
    assignmentImmutability:
      "Each wave must copy its targets from this packet-local plan. A later coverage-matrix regeneration may inform a reconciliation note but must never silently add, remove, or retarget a row in an active wave.",
    disjointOwnership:
      "One releaseVersionId belongs to exactly one wave. Cross-wave evidence may be referenced, but another wave must not independently propose the same developer-channel identity.",
    perWaveStopCondition:
      "A wave stops at a frozen research packet with positive candidates, conflicts, and explicit reversible negative/applicability findings. It stops before stable IDs, Sanity writes, page work, publication, or deployment.",
    recommendedOrder:
      "Run waves in numeric order unless separate researchers can preserve disjoint ownership. Modern high-priority work comes first; legacy modeling must settle terminology before event proposals; patch waves remain applicability audits.",
  },
  researchRules: {
    applicabilityPrinciple:
      "A queue row is not a missing-event claim. Many patch or hotfix releases may correctly have had no external developer prerelease.",
    exactDeveloperIdentityRequiredFields: [
      "releaseVersionId",
      "platform",
      "version label at appearance when it differs from the parent",
      "developerBeta channel",
      "publisher-displayed developer label",
      "explicit ordinal/sequence when numbered",
      "normalized route alias",
      "appearance date",
      "availability state",
      "revision/withdrawal/replacement status",
    ],
    evidenceThreshold:
      "An exact identity needs a direct first-party artifact or at least two genuinely independent contemporary publisher lineages that, together without inference, establish platform, version, developer audience, displayed label/ordinal, and appearance date. Syndication, mirrors, copied release tables, and multiple captures of one publisher are one lineage.",
    audienceRule:
      "A generic beta, seed, prerelease, SDK, firmware, or software-update reference does not establish the developer audience. Never infer developerBeta from publicBeta, a shared build, a same-day appearance, or a later aggregate count.",
    ordinalRule:
      "Use an ordinal only when the source explicitly numbers the developer sequence or an unbroken, independently evidenced sequence establishes it without borrowing public numbering. Reconstruct Beta 1 through the last supported ordinal, identify gaps/duplicates/respins, and test the next ordinal against the stable-release boundary.",
    dateRule:
      "appearanceDate is the calendar date the developer appearance became available. A page publication timestamp is usable only when the source says availability occurred that date. If a later report explicitly says the developer seed shipped the prior day, retain the prior date with that qualification; preserve timezone or date conflicts instead of normalizing silently.",
    buildRule:
      "An appearance and a build are separate facts. Record a build only when evidence directly ties that build number to the exact developer appearance. Do not infer it from another channel, a stable release, a filename, an unsupported table, chronology proximity, or matching labels. An absent build never blocks a timeline-only identity.",
    lifecycleRule:
      "Record withdrawals, replacements, pauses, returns, revised seeds, and same-ordinal respins as observed. Do not collapse them into one available event or increment an ordinal merely to make the sequence consecutive.",
    aggregateRule:
      "Aggregate beta counts may bound a sequence but cannot create an exact ordinal, date, audience, or channel and cannot override stronger direct identity evidence.",
    terminologyBoundaries: [
      {
        term: "Developer Beta",
        developerBetaDisposition:
          "Eligible only when the evidence establishes distribution to Apple’s developer audience and supports the exact identity fields.",
      },
      {
        term: "Developer Preview",
        developerBetaDisposition:
          "Do not relabel automatically. Preserve the historical term and return a terminology/modeling conflict or a separately scoped `other`-channel proposal unless evidence explicitly equates that appearance with a developer beta.",
      },
      {
        term: "Release Candidate",
        developerBetaDisposition:
          "Use `releaseCandidate`, never `developerBeta`, even when distributed through the developer portal or to developers.",
      },
      {
        term: "Golden Master / GM seed",
        developerBetaDisposition:
          "Use `goldenMaster`, never `developerBeta`, unless a separate numbered developer-beta appearance is independently evidenced.",
      },
      {
        term: "Internal / employee / carrier / leaked seed",
        developerBetaDisposition:
          "Not a public developer-program appearance. Do not create a developerBeta candidate; preserve as excluded or unresolved internal evidence.",
      },
      {
        term: "AppleSeed",
        developerBetaDisposition:
          "Invitation-only AppleSeed, AppleSeed for IT, partner, or managed-distribution evidence is not automatically developerBeta. Require explicit evidence of the registered developer audience; otherwise preserve the program name and keep it outside this channel.",
      },
      {
        term: "Public Beta",
        developerBetaDisposition:
          "Use `publicBeta` as a separate event. Never import its date, ordinal, or audience into a developer identity.",
      },
    ],
    negativeAndReversibleSemantics: {
      noResultRule:
        "No search result is not proof that no developer beta existed.",
      requiredNegativeRecord:
        "For every row without a positive candidate, record the exact queries, sources/archives checked, date boundary, terminology variants, full-cycle/next-ordinal test, and limitations.",
      evidenceBackedNotApplicable:
        "Use only when affirmative evidence establishes that this developer channel did not apply to the cycle. Otherwise use a reversible `noPositiveSourceLocated` or `plausibleInsufficientEvidence` disposition.",
      reversibility:
        "Negative and not-proposed findings never reserve an event identity or forbid later evidence. A later packet may supersede them only by citing the frozen earlier finding, presenting stronger evidence, repeating reconciliation and both independent review stages, and preserving the change history.",
      nextOrdinal:
        "A tested next ordinal with no positive source is a do-not-create boundary for the current cutoff, not timeless proof of absence.",
    },
    sourceCustody:
      "Retain canonical metadata, precise locators, accessed dates, publisher lineage, archive/local evidence pointers, byte counts and SHA-256 locks. Commit only facts and short locators; keep raw copyrighted pages in the ignored evidence area.",
  },
  productionReconciliationGate: {
    timing:
      "After candidate identities are assembled and again immediately before any separately authorized mutation.",
    clientRequirements: {
      perspective: "published",
      useCdn: false,
      draftsAllowed: false,
      queryOnly: true,
    },
    requiredChecks: [
      "Confirm every frozen releaseVersion parent still exists and capture its current inventory.",
      "Query every exact {releaseVersionId, channel: developerBeta, routeAlias} identity.",
      "Also query {releaseVersionId, channel, sequence, appearanceDate} to detect an alias mismatch or duplicate identity.",
      "Inventory all scoped release events so a GM, RC, other-channel seed, withdrawal, replacement, or same-ordinal respin is not overlooked.",
      "Stop on an exact existing match, likely identity conflict, missing parent, draft collision, duplicate, or changed target facts; record the conflict instead of overwriting.",
    ],
    allowedStates: [
      "exactExistingMatch",
      "existingIdentityConflict",
      "confirmedMissing",
      "plausibleInsufficientEvidence",
      "evidenceBackedNotApplicable",
    ],
    currentPlanStatement:
      "This planning artifact performed no Sanity or production query. Its inventory is the frozen checked-in snapshot only.",
  },
  reviewGates: {
    researcherSelfReview:
      "Required for completeness and conflicts but does not count as either independent stage.",
    stageOneIndependentEvidenceAndChronologyReview: {
      independence:
        "Reviewer must be different from the researcher.",
      requiredChecks: [
        "Reproduce packet and evidence locks.",
        "Inspect every cited locator and publisher lineage.",
        "Verify exact version, developer audience, label, ordinal, date, availability state, and any directly supported build.",
        "Reconstruct full sequence continuity, missing/duplicate ordinals, respins, withdrawals, replacements, and the next-ordinal boundary.",
        "Adjudicate or block every material conflict and preserve source-role qualifications.",
      ],
      authority:
        "May chronology-approve or block packet-local candidates only; cannot allocate stable IDs, mutate Sanity, build pages, publish, or deploy.",
    },
    stageTwoIndependentIntegrationAndFreshnessReview: {
      independence:
        "Reviewer must be different from both the researcher and Stage One reviewer. If that separation is unavailable, the gate remains incomplete.",
      requiredChecks: [
        "Reproduce the frozen plan membership and candidate uniqueness across all completed developer-gap waves.",
        "Repeat a fresh published, useCdn:false production reconciliation for every exact identity and parent.",
        "Check overlap with the separate 17-candidate priority packet and any newer reviewed packet.",
        "Verify that terminology dispositions, negative semantics, conflicts, and mandatory qualifications survived Stage One unchanged.",
        "Confirm all mutation/page/publication/deployment flags remain false and identify the separate owner authorization still required.",
      ],
      authority:
        "May certify a read-only integration handoff only. It does not authorize Sanity mutation, stable IDs, page builds, publication, or deployment.",
    },
    postReviewAuthority:
      "Even two passed independent stages require a new, explicit owner-authorized implementation plan and fresh reconciliation before any mutation or publication.",
  },
  requiredPerWaveDeliverables: [
    "assignment.json with an exact copy of this wave’s frozen targets",
    "sources.json plus raw/selected evidence locks",
    "candidates.json for positive exact developerBeta identities",
    "full-sequence-audit.json with continuity and next-ordinal tests",
    "negative-findings.json for no-positive or applicability dispositions",
    "conflicts.json with terminology, identity, date, audience, ordinal, and build conflicts",
    "production-snapshot.json from a fresh published/useCdn:false read-only reconciliation",
    "self-review.json",
    "stage-one-independent-review.json",
    "stage-two-integration-review.json or an explicit pending marker",
    "validation.json, packet-locks.json, and a concise report.md",
  ],
  waves,
  safety: {
    immutableVersionAssignment: true,
    candidateIdsOnlyDuringResearch: true,
    noStableEventIds: true,
    noSanityMutation: true,
    noPageBuilds: true,
    noPublication: true,
    noDeployment: true,
    noSharedAggregateEdits: true,
    noAutomaticFollowOnAction: true,
  },
};

const output = `${JSON.stringify(plan, null, 2)}\n`;
const outputPath = path.join(packetDirectory, "plan.json");

if (process.argv.includes("--write")) {
  writeFileSync(outputPath, output);
  console.log(`Wrote ${outputPath}`);
} else {
  process.stdout.write(output);
}
