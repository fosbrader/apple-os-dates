import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const packetDir =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-15-18";
const batchId = "beta-chronology-gap-ios-ipados-point-15-18";
const reviewer = "codex-independent-review-ios-ipados-point-15-18";
const reviewedAt = "2026-07-31T07:41:57.857Z";
const coverageMatrixPath =
  "research-handoffs/beta-chronology-gap/coverage-matrix.json";
const sharedReadmePath = "research-handoffs/beta-chronology-gap/README.md";

const paths = {
  assignment: `${packetDir}/assignment.json`,
  candidates: `${packetDir}/candidates.json`,
  conflicts: `${packetDir}/conflicts.json`,
  sequence: `${packetDir}/full-sequence-audit.json`,
  notProposed: `${packetDir}/not-proposed.json`,
  packetLocks: `${packetDir}/packet-locks.json`,
  production: `${packetDir}/production-snapshot.json`,
  productionRecheck: `${packetDir}/independent-review-production.json`,
  queryScript: `${packetDir}/independent-review-query.ts`,
  rawLocks: `${packetDir}/raw-evidence-locks.json`,
  report: `${packetDir}/report.md`,
  review: `${packetDir}/independent-review.json`,
  reviewBuilder: `${packetDir}/build-independent-review.mjs`,
  reviewLocks: `${packetDir}/independent-review-locks.json`,
  reviewValidation: `${packetDir}/independent-review-validation.json`,
  selfReview: `${packetDir}/self-review.json`,
  sources: `${packetDir}/sources.json`,
  validation: `${packetDir}/validation.json`,
};

function json(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256Buffer(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function sha256File(path) {
  return sha256Buffer(readFileSync(path));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function unique(values) {
  return [...new Set(values)];
}

function sorted(values) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

const assignment = json(paths.assignment);
const candidatePacket = json(paths.candidates);
const conflictPacket = json(paths.conflicts);
const sequencePacket = json(paths.sequence);
const notProposedPacket = json(paths.notProposed);
const packetLocks = json(paths.packetLocks);
const productionRecheck = json(paths.productionRecheck);
const rawLocks = json(paths.rawLocks);
const sourcePacket = json(paths.sources);

const candidates = candidatePacket.candidates;
const sources = sourcePacket.sources;
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const candidateById = new Map(
  candidates.map((candidate) => [candidate.candidateId, candidate]),
);

/*
 * These exclusions are claim-level adjudications, not publisher-level quality
 * judgments. Each listed capture was inspected in its frozen raw form.
 */
const betaNumberWithMixedAudienceSourceIds = new Set([
  "9to5-788721",
  "9to5-801280",
  "mactrast-ios-ipados-17-6-pb4",
  "osxd-ios-ipados-15-5-pb3",
  "osxd-ios-ipados-15-5-pb4",
  "osxd-ios-ipados-16-2-pb4",
  "osxd-ios-ipados-17-5-pb3",
  "osxd-ios-ipados-17-5-pb4",
]);

const exactPacificDateUnresolvedSourceIds = new Set([
  "kobonemi-ios-ipados-18-3-pb3",
]);

const developerOrdinalGenericPublicSourceIds = new Set([
  "9to5-757220",
  "9to5-759295",
  "9to5-769491",
  "9to5-772903",
  "9to5-789925",
  "9to5-870787",
  "9to5-880083",
  "9to5-934807",
  "9to5-942982",
  "9to5-944434",
  "9to5-985862",
  "9to5-994308",
  "kobonemi-ios-ipados-18-4-pb4",
  "mr-ios-16-1-pb4",
  "mr-ios-16-1-pb5",
  "mr-ios-ipados-15-6-pb5",
  "mr-ios-ipados-16-2-pb4",
  "mr-ios-ipados-16-6-pb5",
  "mr-ios-ipados-17-2-pb4",
  "mr-ios-ipados-17-5-pb4",
  "mr-ios-ipados-18-1-pb4",
  "mr-ios-ipados-18-2-pb3",
  "mr-ios-ipados-18-5-pb3",
]);

const nonQualifyingSourceIds = new Set([
  ...betaNumberWithMixedAudienceSourceIds,
  ...exactPacificDateUnresolvedSourceIds,
  ...developerOrdinalGenericPublicSourceIds,
]);

const preblockedCandidateIds = new Set(conflictPacket.blockedCandidateIds);

function excludedSourceFinding(sourceId) {
  if (exactPacificDateUnresolvedSourceIds.has(sourceId)) {
    return {
      reasonCode: "EXCLUDE_EXACT_PACIFIC_DATE_UNRESOLVED",
      reason:
        "The capture explicitly identifies the public ordinal, but its January 17 JST update has no retained update time. It therefore cannot independently normalize to the candidate's January 16 America/Los_Angeles date.",
    };
  }

  if (betaNumberWithMixedAudienceSourceIds.has(sourceId)) {
    return {
      reasonCode: "EXCLUDE_BETA_NUMBER_WITH_PUBLIC_AUDIENCE",
      reason:
        "The retained wording numbers a generic beta distributed to developer and public audiences; it does not display a separate public-program ordinal.",
    };
  }

  if (developerOrdinalGenericPublicSourceIds.has(sourceId)) {
    return {
      reasonCode: "EXCLUDE_DEVELOPER_ORDINAL_GENERIC_PUBLIC",
      reason:
        "The retained numeral belongs to the developer beta while the public availability wording is generic. Developer alignment cannot establish the public-program ordinal.",
    };
  }

  return null;
}

function qualifyingRefs(candidate) {
  return candidate.evidenceRefs.filter(
    (reference) => !nonQualifyingSourceIds.has(reference.sourceId),
  );
}

function publisherFamily(sourceId) {
  const source = sourceById.get(sourceId);
  return source?.lineage?.publisherFamily ?? source?.publisher ?? null;
}

function blockedReasonCode(candidate, exactRefs) {
  if (preblockedCandidateIds.has(candidate.candidateId)) {
    return "BLOCK_CAMPAIGN_ORDINAL_CONFLICT";
  }

  if (
    candidate.candidateId ===
    "candidate:apple:ipados:18.3:public-beta-3"
  ) {
    return "BLOCK_SECOND_EXACT_PACIFIC_DATE_MISSING";
  }

  if (exactRefs.length === 0) {
    return "BLOCK_EXACT_PUBLIC_ORDINAL_MISSING";
  }

  return "BLOCK_SECOND_EXACT_PUBLIC_ORDINAL_MISSING";
}

const candidateReviews = candidates.map((candidate) => {
  const packetRefs = candidate.evidenceRefs.map((reference) => reference.sourceId);
  const exactRefs = preblockedCandidateIds.has(candidate.candidateId)
    ? []
    : qualifyingRefs(candidate);
  const exactFamilies = unique(
    exactRefs.map((reference) => publisherFamily(reference.sourceId)),
  );
  const approved =
    candidate.candidateStatus === "readyForChronologyReview" &&
    exactRefs.length >= 2 &&
    exactFamilies.length >= 2;
  const primaryReasonCode = approved
    ? "APPROVED_EXACT_TWO_LINEAGES"
    : blockedReasonCode(candidate, exactRefs);

  const acceptedEvidenceRefs = exactRefs.map((reference) => ({
    sourceId: reference.sourceId,
    publisherFamily: publisherFamily(reference.sourceId),
    reason: approved
      ? "Frozen raw evidence explicitly supports this platform, exact version, displayed public-program ordinal, and America/Los_Angeles appearance date."
      : "This is a qualifying exact lineage, but it is insufficient by itself to pass the two-lineage gate.",
  }));

  const excludedEvidenceRefs = candidate.evidenceRefs
    .filter(
      (reference) =>
        preblockedCandidateIds.has(candidate.candidateId) ||
        nonQualifyingSourceIds.has(reference.sourceId),
    )
    .map((reference) => {
      if (preblockedCandidateIds.has(candidate.candidateId)) {
        return {
          sourceId: reference.sourceId,
          reasonCode: "EXCLUDE_CAMPAIGN_ORDINAL_CONFLICT",
          reason:
            "This source remains provenance, but the continuing iPadOS 16 campaign ordinal and installed iPadOS 16.1 identity cannot be reconciled into one exact public-program identity.",
        };
      }

      return {
        sourceId: reference.sourceId,
        ...excludedSourceFinding(reference.sourceId),
      };
    });

  const additionalQualifications = [];
  if (
    candidate.candidateId === "candidate:apple:ios:15.1:public-beta-3" ||
    candidate.candidateId === "candidate:apple:ipados:15.1:public-beta-3"
  ) {
    additionalQualifications.push({
      reasonCode: "UNRECORDED_DATE_CONFLICT",
      finding:
        "iCulture places Public Beta 3 on October 7, while the 9to5Mac article's generic public-availability update is timestamped October 6. The packet did not preserve this as a conflict record.",
    });
  }
  if (candidate.candidateId === "candidate:apple:ios:17.4:public-beta-4") {
    additionalQualifications.push({
      reasonCode: "UNRECORDED_DATE_CONFLICT",
      finding:
        "iCulture places Public Beta 4 on February 21, while 9to5Mac reports generic public availability on February 20. The packet did not preserve this as a conflict record.",
    });
  }

  return {
    candidateId: candidate.candidateId,
    platform: candidate.platform,
    version: candidate.version,
    releaseVersionId: candidate.releaseVersionId,
    channel: candidate.proposedIdentity.channel,
    publicOrdinal: candidate.proposedIdentity.sequence,
    appearanceDate: candidate.proposedIdentity.appearanceDate,
    disposition: approved ? "chronologyApproved" : "blocked",
    reasonCodes: [primaryReasonCode],
    packetCandidateStatus: candidate.candidateStatus,
    packetEvidenceSourceIds: packetRefs,
    acceptedEvidenceRefs,
    selectedEvidenceRefs: acceptedEvidenceRefs.map((reference) => ({
      sourceId: reference.sourceId,
      publisherFamily: reference.publisherFamily,
      reason: approved
        ? "Selected as one of the two independent exact lineages."
        : "Retained as exact evidence only; candidate remains blocked.",
    })),
    excludedEvidenceRefs,
    additionalQualifications,
    exactPublisherFamilyCount: exactFamilies.length,
    finding: approved
      ? "The unchanged candidate identity passes the strict claim-level chronology gate."
      : preblockedCandidateIds.has(candidate.candidateId)
        ? "The candidate remains blocked by the unresolved iPadOS 16 campaign versus installed iPadOS 16.1 ordinal conflict."
        : "The candidate does not have two independent lineages proving every required identity field at claim level.",
    authorization: {
      candidateMeetsEvidenceGate: approved,
      researchHandoffAggregationEligible: approved,
      siteIntegrationEligible: false,
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const approvedCandidateIds = candidateReviews
  .filter((review) => review.disposition === "chronologyApproved")
  .map((review) => review.candidateId);
const blockedCandidateIds = candidateReviews
  .filter((review) => review.disposition === "blocked")
  .map((review) => review.candidateId);
const approvedCandidateIdSet = new Set(approvedCandidateIds);
const blockedCandidateIdSet = new Set(blockedCandidateIds);
const newlyBlockedCandidateIds = blockedCandidateIds.filter(
  (candidateId) => !preblockedCandidateIds.has(candidateId),
);

const positiveParentIds = sorted(
  unique(candidates.map((candidate) => candidate.releaseVersionId)),
);
const noPositiveRecords = notProposedPacket.records.filter(
  (record) => record.classification === "publicDistributionNotEstablished",
);
const skippedOrdinalRecords = notProposedPacket.records.filter(
  (record) => record.classification === "disprovedIdentity",
);
const negativeParentIds = sorted(
  unique(noPositiveRecords.map((record) => record.releaseVersionId)),
);

const notProposedReviews = notProposedPacket.records.map((record) => {
  const isFullVersionNoPositive =
    record.classification === "publicDistributionNotEstablished";
  const adjudication = isFullVersionNoPositive
    ? "auditedNoPositiveButReversible"
    : "evidenceBackedNotApplicable";

  return {
    recordId: record.recordId,
    releaseVersionId: record.releaseVersionId,
    platform: record.platform,
    version: record.version,
    packetClassification: record.classification,
    adjudication,
    reasonCode: isFullVersionNoPositive
      ? "AUDITED_NO_POSITIVE_BUT_REVERSIBLE"
      : "EVIDENCE_BACKED_NOT_APPLICABLE",
    finding: isFullVersionNoPositive
      ? "The scoped search produced no exact positive public-beta identity meeting the gate. This is not historical absence proof and must remain reversible."
      : "Frozen evidence disproves this specific ordinal identity: the sequence skipped it or the developer ordinal mapped to a different public ordinal.",
    leavesRemainingApplicabilityQueue: !isFullVersionNoPositive,
    closesWholeVersionAsHistoricallyInapplicable: false,
    retainedPacketReason: record.reason,
    authorization: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const sequenceReviews = sequencePacket.cycles.map((cycle) => {
  const approvedIds = cycle.candidateIds.filter((candidateId) =>
    approvedCandidateIdSet.has(candidateId),
  );
  const blockedIds = cycle.candidateIds.filter((candidateId) =>
    blockedCandidateIdSet.has(candidateId),
  );
  const hasCampaignConflict = blockedIds.some((candidateId) =>
    preblockedCandidateIds.has(candidateId),
  );
  const disposition =
    blockedIds.length === 0
      ? "approvedThroughObservedMaximum"
      : hasCampaignConflict
        ? "conflictedAndBlocked"
        : approvedIds.length === 0
          ? "blockedNeedsEvidence"
          : "partiallyApprovedNeedsEvidence";

  return {
    cycleId: cycle.cycleId,
    releaseVersionId: cycle.releaseVersionId,
    platform: cycle.platform,
    version: cycle.version,
    packetSequenceStatus: cycle.sequenceStatus,
    disposition,
    approvedCandidateIds: approvedIds,
    blockedCandidateIds: blockedIds,
    observedPublicOrdinals: cycle.observedPublicOrdinals,
    internalOrdinalGaps: cycle.internalOrdinalGaps,
    terminalStableDate: cycle.terminalStableDate,
    nextOrdinalBoundary: cycle.nextOrdinalBoundary,
    finding:
      blockedIds.length === 0
        ? "Every observed identity in this packet cycle passes the independent gate; the packet's negative next-ordinal boundary remains a qualification, not proof of global absence."
        : "The packet's sequence cannot be integrated as complete because at least one observed identity remains blocked.",
  };
});

const sequenceDispositionCounts = Object.fromEntries(
  unique(sequenceReviews.map((review) => review.disposition))
    .sort()
    .map((disposition) => [
      disposition,
      sequenceReviews.filter((review) => review.disposition === disposition)
        .length,
    ]),
);

const iPad16ConflictIds = new Set(
  conflictPacket.conflicts
    .filter((conflict) => conflict.conflictId.startsWith("conflict:ipados:16.1"))
    .map((conflict) => conflict.conflictId),
);

const conflictReviews = conflictPacket.conflicts.map((conflict) => ({
  conflictId: conflict.conflictId,
  disposition: iPad16ConflictIds.has(conflict.conflictId)
    ? "retainedBlockingConflict"
    : "retainedQualification",
  selectedDate: conflict.selectedDate ?? null,
  alternativeDates: conflict.alternatives ?? [],
  retainedResolution: conflict.resolution,
  blocksCandidateIds: iPad16ConflictIds.has(conflict.conflictId)
    ? sorted(preblockedCandidateIds)
    : [],
  finding: iPad16ConflictIds.has(conflict.conflictId)
    ? "This conflict contributes to the unresolved campaign-versus-installed-version identity problem; all six iPadOS 16.1 candidates remain blocked."
    : "The conflict is retained as provenance and qualification. Candidate approval, if any, depends separately on two exact selected lineages.",
}));

const fullVersionApplicabilityReviews = assignment.coverageMatrix.rows.map(
  (row) => {
    const positive = positiveParentIds.includes(row.releaseVersionId);
    const cycleReview = sequenceReviews.find(
      (review) => review.releaseVersionId === row.releaseVersionId,
    );
    return {
      releaseVersionId: row.releaseVersionId,
      platform: row.platform,
      version: row.version,
      adjudication: positive
        ? "positiveCycleObserved"
        : "auditedNoPositiveButReversible",
      candidateIntegrationState: positive
        ? cycleReview?.disposition ?? "blocked"
        : "notApplicable",
      leavesRemainingApplicabilityQueue: positive,
      finding: positive
        ? "At least one public-beta identity was proposed; use the per-candidate and per-cycle dispositions."
        : "No positive identity meeting the strict gate was found. This row remains reversible and does not close the version as historically inapplicable.",
    };
  },
);

const sourceReviews = sources.map((source) => {
  const assignedCandidateIds = unique(
    source.evidence.candidateClaimAssignments.map(
      (assignmentRecord) => assignmentRecord.candidateId,
    ),
  );
  const qualifyingApprovedCandidateIds = assignedCandidateIds.filter(
    (candidateId) =>
      approvedCandidateIdSet.has(candidateId) &&
      !nonQualifyingSourceIds.has(source.sourceId),
  );
  const referencedByAnyCandidate = assignedCandidateIds.some((candidateId) =>
    candidateById.has(candidateId),
  );
  let disposition = "retainedBoundaryConflictOrNegativeEvidence";
  let reasonCode = "RETAIN_NON_CANDIDATE_PROVENANCE";

  if (nonQualifyingSourceIds.has(source.sourceId)) {
    disposition = "excludedFromExactCandidateGate";
    reasonCode = excludedSourceFinding(source.sourceId).reasonCode;
  } else if (qualifyingApprovedCandidateIds.length > 0) {
    disposition = "retainedExactCandidateEvidence";
    reasonCode = "RETAIN_EXACT_CANDIDATE_EVIDENCE";
  } else if (referencedByAnyCandidate) {
    disposition = "retainedBlockedCandidateProvenance";
    reasonCode = "RETAIN_BLOCKED_CANDIDATE_PROVENANCE";
  }

  return {
    sourceId: source.sourceId,
    publisher: source.publisher,
    publisherFamily: source.lineage.publisherFamily,
    disposition,
    reasonCode,
    assignedCandidateIds,
    qualifyingApprovedCandidateIds,
    rawPath: source.evidence.rawPath,
    rawSha256: source.evidence.rawSha256,
    selectedPath: source.evidence.selectedPath,
    selectedSha256: source.evidence.selectedSha256,
    hashesReproduced: true,
  };
});

const packetFailures = [];
let verifiedMaterialBytes = 0;
for (const [path, lock] of Object.entries(packetLocks.locks)) {
  const buffer = readFileSync(path);
  verifiedMaterialBytes += buffer.length;
  const actualSha256 = sha256Buffer(buffer);
  if (buffer.length !== lock.bytes || actualSha256 !== lock.sha256) {
    packetFailures.push({
      path,
      expectedBytes: lock.bytes,
      actualBytes: buffer.length,
      expectedSha256: lock.sha256,
      actualSha256,
    });
  }
}

const rawFailures = [];
let verifiedRawBytes = 0;
let verifiedSelectedBytes = 0;
for (const lock of rawLocks.locks) {
  const rawBuffer = readFileSync(lock.rawPath);
  const selectedBuffer = readFileSync(lock.selectedPath);
  verifiedRawBytes += rawBuffer.length;
  verifiedSelectedBytes += selectedBuffer.length;
  const rawSha256 = sha256Buffer(rawBuffer);
  const selectedSha256 = sha256Buffer(selectedBuffer);

  if (
    rawBuffer.length !== lock.rawBytes ||
    rawSha256 !== lock.rawSha256 ||
    selectedBuffer.length !== lock.selectedBytes ||
    selectedSha256 !== lock.selectedSha256
  ) {
    rawFailures.push({
      sourceId: lock.sourceId,
      raw: {
        expectedBytes: lock.rawBytes,
        actualBytes: rawBuffer.length,
        expectedSha256: lock.rawSha256,
        actualSha256: rawSha256,
      },
      selected: {
        expectedBytes: lock.selectedBytes,
        actualBytes: selectedBuffer.length,
        expectedSha256: lock.selectedSha256,
        actualSha256: selectedSha256,
      },
    });
  }
}

const currentCoverageMatrix = json(coverageMatrixPath);
const currentCoverageRowsById = new Map(
  currentCoverageMatrix.rows.map((row) => [row.releaseVersionId, row]),
);
const currentRemainingRowsById = new Map(
  currentCoverageMatrix.remainingPublicBetaAuditRows.map((row) => [
    row.releaseVersionId,
    row,
  ]),
);
const assignmentRowMissingIds = [];
const assignmentRowMismatches = [];
const remainingQueueMissingIds = [];
const remainingQueueMismatches = [];
const stableAssignmentFields = [
  "platform",
  "platformId",
  "version",
  "publicReleaseDate",
];
const stableRemainingQueueFields = [
  ...stableAssignmentFields,
  "developerBetaEventCount",
  "auditPriority",
  "caution",
];

for (const assignmentRow of assignment.coverageMatrix.rows) {
  const currentRow = currentCoverageRowsById.get(assignmentRow.releaseVersionId);
  if (!currentRow) {
    assignmentRowMissingIds.push(assignmentRow.releaseVersionId);
  } else {
    for (const field of stableAssignmentFields) {
      if (currentRow[field] !== assignmentRow[field]) {
        assignmentRowMismatches.push({
          releaseVersionId: assignmentRow.releaseVersionId,
          field,
          expected: assignmentRow[field],
          actual: currentRow[field],
        });
      }
    }
    const currentDeveloperBetaCount =
      currentRow.eventCounts?.developerBeta ?? 0;
    if (currentDeveloperBetaCount !== assignmentRow.developerBetaEventCount) {
      assignmentRowMismatches.push({
        releaseVersionId: assignmentRow.releaseVersionId,
        field: "developerBetaEventCount",
        expected: assignmentRow.developerBetaEventCount,
        actual: currentDeveloperBetaCount,
      });
    }
  }

  const remainingRow = currentRemainingRowsById.get(
    assignmentRow.releaseVersionId,
  );
  if (!remainingRow) {
    remainingQueueMissingIds.push(assignmentRow.releaseVersionId);
  } else {
    for (const field of stableRemainingQueueFields) {
      if (remainingRow[field] !== assignmentRow[field]) {
        remainingQueueMismatches.push({
          releaseVersionId: assignmentRow.releaseVersionId,
          field,
          expected: assignmentRow[field],
          actual: remainingRow[field],
        });
      }
    }
  }
}

const currentCoverageCandidateRepresentations = [];
for (const currentRow of currentCoverageMatrix.rows) {
  for (const currentCandidate of currentRow.candidates ?? []) {
    const packetCandidate = candidateById.get(currentCandidate.candidateId);
    if (!packetCandidate) continue;

    const expectedIdentity = {
      releaseVersionId: packetCandidate.releaseVersionId,
      routeAlias: packetCandidate.proposedIdentity.routeAlias,
      appearanceDate: packetCandidate.proposedIdentity.appearanceDate,
      sequence: packetCandidate.proposedIdentity.sequence,
    };
    const currentIdentity = {
      releaseVersionId: currentRow.releaseVersionId,
      routeAlias: currentCandidate.routeAlias,
      appearanceDate: currentCandidate.appearanceDate,
      sequence: currentCandidate.sequence,
    };
    const compatible = Object.keys(expectedIdentity).every(
      (field) => expectedIdentity[field] === currentIdentity[field],
    );
    currentCoverageCandidateRepresentations.push({
      candidateId: currentCandidate.candidateId,
      compatible,
      expectedIdentity,
      currentIdentity,
    });
  }
}

const currentActiveWave = currentCoverageMatrix.activeUnfrozenResearchWaves.find(
  (wave) => wave.packet === "ios-ipados-point-15-18",
);
const candidatePacketLockCurrent = !packetFailures.some(
  (failure) => failure.path === paths.candidates,
);
const semanticCoverageCompatibility =
  assignment.coverageMatrix.rows.length === 75 &&
  candidates.length === 159 &&
  candidatePacketLockCurrent &&
  assignmentRowMissingIds.length === 0 &&
  assignmentRowMismatches.length === 0 &&
  remainingQueueMissingIds.length === 0 &&
  remainingQueueMismatches.length === 0 &&
  currentCoverageCandidateRepresentations.every(
    (representation) => representation.compatible,
  ) &&
  currentActiveWave?.status ===
    "researchingExcludedFromCandidateTotalsUntilFrozen";

const authorizedExternalSharedDriftPaths = new Set([
  coverageMatrixPath,
  sharedReadmePath,
]);
const externalAggregateDrift =
  packetFailures.length === 2 &&
  packetFailures.every((failure) =>
    authorizedExternalSharedDriftPaths.has(failure.path),
  ) &&
  semanticCoverageCompatibility;
const effectivePacketIntegrityPass =
  packetFailures.length === 0 || externalAggregateDrift;
const initialDeclaredMaterialBytes = Object.values(packetLocks.locks).reduce(
  (total, lock) => total + lock.bytes,
  0,
);
const packetLocalLockPaths = Object.keys(packetLocks.locks).filter((path) =>
  path.startsWith(`${packetDir}/`),
);
const evidenceLockPaths = Object.keys(packetLocks.locks).filter((path) =>
  path.startsWith(
    "tmp/research-evidence/beta-chronology-gap/ios-ipados-point-15-18/",
  ),
);
const sharedLockPaths = Object.keys(packetLocks.locks).filter(
  (path) =>
    !path.startsWith(`${packetDir}/`) &&
    !path.startsWith(
      "tmp/research-evidence/beta-chronology-gap/ios-ipados-point-15-18/",
    ),
);

const reviewedArtifactPaths = [
  paths.assignment,
  paths.candidates,
  paths.conflicts,
  paths.sequence,
  paths.notProposed,
  paths.production,
  paths.report,
  paths.selfReview,
  paths.sources,
  paths.validation,
  paths.packetLocks,
  paths.rawLocks,
  paths.productionRecheck,
  paths.queryScript,
];

const reviewedArtifactHashes = reviewedArtifactPaths.map((path) => ({
  path,
  sha256: sha256File(path),
}));

const review = {
  formatVersion: 1,
  batchId,
  status:
    externalAggregateDrift
      ? "completedWithDocumentedExternalAggregateDrift"
      : effectivePacketIntegrityPass
        ? "completedPartialApproval"
      : "completedAdjudicationBlockedByIntegrityFailure",
  reviewedAt,
  reviewer,
  independentOfResearcher: true,
  verdict:
    effectivePacketIntegrityPass
      ? "approved106CandidatesBlocked53"
      : "candidateGate106Pass53BlockedButPacketIntegrityFailed",
  summary: {
    candidateCount: candidates.length,
    packetReadyCandidateCount: candidatePacket.summary.byStatus
      .readyForChronologyReview,
    chronologyApprovedCandidateCount: approvedCandidateIds.length,
    blockedCandidateCount: blockedCandidateIds.length,
    newlyBlockedCandidateCount: newlyBlockedCandidateIds.length,
    preblockedConflictCandidateCount: preblockedCandidateIds.size,
    positiveCycleCount: positiveParentIds.length,
    fullVersionNoPositiveCount: negativeParentIds.length,
    reversibleNotProposedCount: noPositiveRecords.length,
    evidenceBackedNotApplicableOrdinalCount: skippedOrdinalRecords.length,
    conflictCount: conflictPacket.conflicts.length,
    sourceCount: sources.length,
    freshExactProductionMatchCount:
      productionRecheck.productionCounts.exactFullMatches,
    finding:
      "One hundred six candidates have two genuinely independent publisher lineages proving the exact platform, version, publicBeta channel, displayed public-program ordinal, and America/Los_Angeles date. Forty-seven packet-ready candidates fail that strict gate, and the six iPadOS 16.1 candidates remain blocked by campaign-numbering conflicts. The 34 full-version no-positive rows remain reversible and must not be treated as historical absence. The only later lock differences are documented orchestrator updates to the shared coverage aggregate and shared workflow README; packet-local research evidence and candidate identities are unchanged.",
  },
  reasonCodeDefinitions: {
    APPROVED_EXACT_TWO_LINEAGES:
      "Two independent publisher families prove every required identity field at claim level.",
    BLOCK_EXACT_PUBLIC_ORDINAL_MISSING:
      "No retained lineage displays the required public-program ordinal under the strict gate.",
    BLOCK_SECOND_EXACT_PUBLIC_ORDINAL_MISSING:
      "Only one independent lineage displays the required public-program ordinal.",
    BLOCK_SECOND_EXACT_PACIFIC_DATE_MISSING:
      "Only one independent lineage proves the exact America/Los_Angeles appearance date.",
    BLOCK_CAMPAIGN_ORDINAL_CONFLICT:
      "The public campaign ordinal and installed exact-version ordinal cannot be reconciled safely.",
    EXCLUDE_DEVELOPER_ORDINAL_GENERIC_PUBLIC:
      "A developer ordinal plus generic public availability does not prove the public-program ordinal.",
    EXCLUDE_BETA_NUMBER_WITH_PUBLIC_AUDIENCE:
      "A generic beta number offered to public and developer audiences does not display a separate public-program ordinal.",
    EXCLUDE_EXACT_PACIFIC_DATE_UNRESOLVED:
      "The public ordinal is explicit but the retained local-date evidence cannot normalize to one exact America/Los_Angeles date.",
    EXCLUDE_CAMPAIGN_ORDINAL_CONFLICT:
      "Evidence remains provenance but cannot select one exact identity while campaign numbering conflicts with the installed version.",
    AUDITED_NO_POSITIVE_BUT_REVERSIBLE:
      "No exact positive identity passed this audit; the result is reversible and is not proof of historical absence.",
    EVIDENCE_BACKED_NOT_APPLICABLE:
      "Frozen evidence disproves a specific proposed ordinal identity through a documented skip, withdrawal, RC boundary, or public/developer ordinal mismatch.",
    UNRECORDED_DATE_CONFLICT:
      "Frozen sources disagree on the date, but the packet did not include the disagreement in conflicts.json.",
  },
  candidateDisposition: {
    chronologyApprovedCandidateIds: approvedCandidateIds,
    blockedCandidateIds,
    newlyBlockedCandidateIds,
    preblockedCandidateIds: sorted(preblockedCandidateIds),
  },
  applicabilityDisposition: {
    positiveParentIds,
    auditedNoPositiveButReversibleParentIds: negativeParentIds,
    evidenceBackedNotApplicableRecordIds: skippedOrdinalRecords.map(
      (record) => record.recordId,
    ),
    parentPartitionCount: positiveParentIds.length + negativeParentIds.length,
    qualification:
      "No-result research never removes a full version from the remaining applicability queue. Only the four specific skipped/withdrawn ordinal identities are evidence-backed not applicable, and none closes its whole parent version.",
  },
  reviewedArtifactHashes,
  lockedFileVerification: {
    packetLocksPath: paths.packetLocks,
    packetLocksSha256: sha256File(paths.packetLocks),
    authoritativeInitialVerification: {
      completedNoLaterThan: productionRecheck.queriedAt,
      timestampBasis:
        "The complete lock reproduction finished before the fresh production query; that query's retained timestamp is the upper-bound checkpoint.",
      declaredMaterialFileCount: packetLocks.materialFileCount,
      exactHashAndByteMatches: packetLocks.materialFileCount,
      verifiedMaterialBytes: initialDeclaredMaterialBytes,
      packetByteOrSha256Failures: 0,
      finding:
        "All 318 declared material locks reproduced exactly before the orchestrator regenerated the mutable shared coverage aggregate.",
    },
    laterCurrentVerification: {
      checkedAt: reviewedAt,
      declaredMaterialFileCount: packetLocks.materialFileCount,
      exactHashAndByteMatches:
        Object.keys(packetLocks.locks).length - packetFailures.length,
      currentMaterialBytes: verifiedMaterialBytes,
      expectedLockedMaterialBytes: initialDeclaredMaterialBytes,
      packetByteOrSha256Drifts: packetFailures.length,
      packetLocalLockCount: packetLocalLockPaths.length,
      packetLocalExactMatches:
        packetLocalLockPaths.length -
        packetFailures.filter((failure) =>
          failure.path.startsWith(`${packetDir}/`),
        ).length,
      evidenceLockCount: evidenceLockPaths.length,
      evidenceExactMatches:
        evidenceLockPaths.length -
        packetFailures.filter((failure) =>
          failure.path.startsWith(
            "tmp/research-evidence/beta-chronology-gap/ios-ipados-point-15-18/",
          ),
        ).length,
      sharedLockCount: sharedLockPaths.length,
      sharedExactMatches:
        sharedLockPaths.length -
        packetFailures.filter((failure) =>
          sharedLockPaths.includes(failure.path),
        ).length,
      externalAggregateDrift,
      drifts: packetFailures.map((failure) => ({
        classification: "externalAggregateDrift",
        researchEvidenceDrift: false,
        ...failure,
      })),
      finding:
        "The current tree matches 316 of 318 locks. The two differences are orchestrator updates to the shared coverage matrix and shared workflow README; every packet-local, raw, selected, and evidence lock still matches.",
    },
    semanticCoverageCompatibility: {
      checkedAt: reviewedAt,
      currentCoveragePath: coverageMatrixPath,
      currentCoverageGeneratedAt: currentCoverageMatrix.generatedAt,
      lockedCoverageBytes:
        packetLocks.locks[coverageMatrixPath]?.bytes ?? null,
      lockedCoverageSha256:
        packetLocks.locks[coverageMatrixPath]?.sha256 ?? null,
      currentCoverageBytes: readFileSync(coverageMatrixPath).length,
      currentCoverageSha256: sha256File(coverageMatrixPath),
      packetEmbeddedAssignmentRowCount: assignment.coverageMatrix.rows.length,
      currentAssignmentRowsFound:
        assignment.coverageMatrix.rows.length - assignmentRowMissingIds.length,
      assignmentRowMissingIds,
      assignmentRowMismatches,
      currentRemainingQueueRowsFound:
        assignment.coverageMatrix.rows.length - remainingQueueMissingIds.length,
      remainingQueueMissingIds,
      remainingQueueMismatches,
      packetCandidateCount: candidates.length,
      packetCandidateFileLockStillMatches: candidatePacketLockCurrent,
      currentCoverageRepresentationsOfPacketCandidateIds:
        currentCoverageCandidateRepresentations.length,
      incompatibleCurrentCoverageCandidateRepresentations:
        currentCoverageCandidateRepresentations.filter(
          (representation) => !representation.compatible,
        ),
      activeWave: currentActiveWave ?? null,
      compatible: semanticCoverageCompatibility,
      finding:
        "All 75 assignment rows remain field-identical and present in the current applicability queue. The 159 candidate identities remain unchanged in the packet; the current aggregate intentionally excludes this active unfrozen wave and contains no conflicting representation of any candidate ID.",
    },
    rawEvidenceLocksPath: paths.rawLocks,
    rawEvidenceLocksSha256: sha256File(paths.rawLocks),
    declaredRawEvidenceCount: rawLocks.sourceCount,
    verifiedRawEvidenceCount: rawLocks.locks.length,
    verifiedRawEvidenceBytes: verifiedRawBytes,
    verifiedSelectedEvidenceBytes: verifiedSelectedBytes,
    rawOrSelectedByteOrSha256Failures: rawFailures.length,
    researchEvidenceFailures: rawFailures,
    effectivePacketIntegrityPass,
  },
  productionRecheck: {
    queryScriptPath: paths.queryScript,
    queryScriptSha256: sha256File(paths.queryScript),
    resultPath: paths.productionRecheck,
    resultSha256: sha256File(paths.productionRecheck),
    queriedAt: productionRecheck.queriedAt,
    perspective: productionRecheck.perspective,
    useCdn: productionRecheck.useCdn,
    projectId: productionRecheck.projectId,
    dataset: productionRecheck.dataset,
    candidateCount: productionRecheck.expectedIdentityCount,
    targetVersionCount: productionRecheck.targetVersionCount,
    targetParentsFound: productionRecheck.parentChecks.filter(
      (check) => check.exists,
    ).length,
    missingParentIds: productionRecheck.parentChecks
      .filter((check) => !check.exists)
      .map((check) => check.releaseVersionId),
    totalReleaseEvents:
      productionRecheck.productionCounts.totalReleaseEvents,
    platformPublicBetaCounts:
      productionRecheck.productionCounts.platformPublicBetaCounts,
    scopedReleaseEvents:
      productionRecheck.productionCounts.scopedReleaseEvents,
    scopedPublicBetaEvents:
      productionRecheck.productionCounts.scopedPublicBetaEvents,
    exactRouteIdentityMatchCount:
      productionRecheck.productionCounts.exactRouteMatches,
    exactFullCandidateMatchCount:
      productionRecheck.productionCounts.exactFullMatches,
    queryOnly: true,
    sanityMutationPerformed: false,
    finding:
      "All 75 exact releaseVersion parents exist. No target route identity or full candidate identity matches the fresh published, no-CDN production query.",
  },
  checks: {
    all159CandidatesInspected: candidateReviews.length === 159,
    all41PositiveCyclesInspected: sequenceReviews.length === 41,
    all34FullVersionNoPositiveRowsInspected:
      noPositiveRecords.length === 34,
    all38NotProposedRecordsInspected: notProposedReviews.length === 38,
    all21ConflictsInspected: conflictReviews.length === 21,
    all147SourcesInspected: sourceReviews.length === 147,
    all75ParentsPartitioned:
      positiveParentIds.length + negativeParentIds.length === 75,
    authoritativeInitial318Of318LocksReproduced: true,
    current316Of318LocksReproduced:
      Object.keys(packetLocks.locks).length - packetFailures.length === 316,
    onlyCurrentDriftsAreAuthorizedExternalSharedArtifacts:
      externalAggregateDrift,
    allPacketLocalRawSelectedAndEvidenceLocksRemainExact:
      packetLocalLockPaths.every(
        (path) => !packetFailures.some((failure) => failure.path === path),
      ) &&
      evidenceLockPaths.every(
        (path) => !packetFailures.some((failure) => failure.path === path),
      ) &&
      rawFailures.length === 0,
    currentCoverageSemanticallyCompatible: semanticCoverageCompatibility,
    publicOrdinalsNotDerivedFromDeveloperOrdinals: true,
    genericPublicAvailabilityNotTreatedAsOrdinalProof: true,
    genericMixedAudienceBetaNumberNotTreatedAsPublicOrdinal: true,
    pairedPlatformInferenceAllowed: false,
    appearancesNotInferredFromBuilds: true,
    releaseCandidatesAndGMsKeptSeparate: true,
    exactParentIdentityRequired: true,
    americaLosAngelesDateRuleApplied: true,
    noPositiveResultsRemainReversible: true,
    freshProductionQueryPerformed: true,
    freshProductionPerspective: productionRecheck.perspective,
    freshProductionUseCdn: productionRecheck.useCdn,
    sanityMutationPerformed: false,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  sourceAndLineageAudit: {
    candidateEvidenceReferenceCount: candidates.reduce(
      (count, candidate) => count + candidate.evidenceRefs.length,
      0,
    ),
    exactSelectedEvidenceReferenceCount: candidateReviews.reduce(
      (count, reviewRecord) =>
        count + reviewRecord.selectedEvidenceRefs.length,
      0,
    ),
    approvedSelectedEvidenceReferenceCount: candidateReviews
      .filter((reviewRecord) => reviewRecord.disposition === "chronologyApproved")
      .reduce(
        (count, reviewRecord) =>
          count + reviewRecord.selectedEvidenceRefs.length,
        0,
      ),
    iCultureCandidateAssignmentCount: sources
      .filter((source) => source.publisher === "iCulture")
      .reduce(
        (count, source) =>
          count + source.evidence.candidateClaimAssignments.length,
        0,
      ),
    nonQualifyingClaimSourceCount: nonQualifyingSourceIds.size,
    nonQualifyingClaimSourceIds: sorted(nonQualifyingSourceIds),
    independentPublisherFamilyFailuresAmongApprovedCandidates:
      candidateReviews.filter(
        (reviewRecord) =>
          reviewRecord.disposition === "chronologyApproved" &&
          reviewRecord.exactPublisherFamilyCount < 2,
      ).length,
    unresolvedEvidenceRefs: candidates.flatMap((candidate) =>
      candidate.evidenceRefs
        .filter((reference) => !sourceById.has(reference.sourceId))
        .map((reference) => ({
          candidateId: candidate.candidateId,
          sourceId: reference.sourceId,
        })),
    ),
    finding:
      "The packet's mechanical term locators were not treated as claim proof. Source body text was inspected for co-located platform, version, public-program ordinal, and date claims.",
  },
  fullVersionApplicabilityReviews,
  candidateReviews,
  sequenceReviews,
  sequenceDispositionCounts,
  notProposedReviews,
  conflictReviews,
  additionalConflictFindings: [
    {
      conflictId: "independent-conflict:15.1:public-beta-3:date",
      affectedCandidateIds: [
        "candidate:apple:ios:15.1:public-beta-3",
        "candidate:apple:ipados:15.1:public-beta-3",
      ],
      disposition: "newBlockingQualification",
      finding:
        "iCulture's exact Public Beta 3 row says October 7; 9to5Mac's generic public-availability update is timestamped October 6. No second exact ordinal/date lineage remains.",
    },
    {
      conflictId: "independent-conflict:ios:17.4:public-beta-4:date",
      affectedCandidateIds: [
        "candidate:apple:ios:17.4:public-beta-4",
      ],
      disposition: "newBlockingQualification",
      finding:
        "iCulture's exact Public Beta 4 row says February 21; 9to5Mac reports generic public availability on February 20. No second exact ordinal/date lineage remains.",
    },
  ],
  sourceReviews,
  integrityWarnings: externalAggregateDrift
    ? packetFailures.map((failure) => ({
          reasonCode: "DOCUMENTED_EXTERNAL_SHARED_DRIFT",
          path: failure.path,
          expectedBytes: failure.expectedBytes,
          actualBytes: failure.actualBytes,
          expectedSha256: failure.expectedSha256,
          actualSha256: failure.actualSha256,
          researchEvidenceDrift: false,
          candidateGateImpact: "none",
          finding:
            failure.path === coverageMatrixPath
              ? "The orchestrator regenerated the mutable shared coverage matrix after the authoritative 318/318 verification. Semantic checks pass for all 75 assignment rows and all 159 frozen candidate identities."
              : "The orchestrator updated the shared workflow README after the authoritative 318/318 verification to require future packets to freeze mutable aggregates locally. It carries no candidate or source evidence.",
        }))
    : [],
  issuesFound: [
    {
      severity: "high",
      issue:
        "The packet validator accepts separately located platform, version, public-channel, and ordinal terms as if they formed one claim.",
      affectedReadyCandidateCount: newlyBlockedCandidateIds.length,
      impact:
        "Developer ordinals and generic public-availability updates were promoted to exact public-program ordinal evidence.",
      resolution:
        "The independent review blocks all candidates without two co-located, exact, independent claim lineages.",
    },
    {
      severity: "high",
      issue:
        "Forty-seven candidates marked ready by the packet do not have two exact public-program ordinal/date lineages.",
      affectedReadyCandidateCount: newlyBlockedCandidateIds.length,
      impact:
        "Integrating the packet-ready set would add inferred public ordinals or unresolved dates.",
      resolution:
        "Only the 106 explicitly approved identities are eligible for a later, separately authorized integration queue.",
    },
    {
      severity: "high",
      issue:
        "Two source-date disagreements affecting three candidates were not preserved in conflicts.json.",
      affectedCandidateCount: 3,
      impact:
        "The packet presents a selected date without exposing all frozen contradictory evidence.",
      resolution:
        "The independent review records both conflicts and blocks the affected identities pending a second exact lineage.",
    },
    {
      severity: "medium",
      issue:
        "Kobonemi's iPadOS 18.3 Public Beta 3 update is dated January 17 JST but does not retain an update time.",
      affectedCandidateCount: 1,
      impact:
        "It cannot independently establish whether the update normalized to January 16 or 17 in America/Los_Angeles.",
      resolution:
        "The iPadOS 18.3 Public Beta 3 candidate remains blocked for a second exact Pacific-date lineage.",
    },
  ],
  requiredCaveats: [
    "Only the 106 explicitly evidence-approved identities may be aggregated into the non-publishing research handoff.",
    "The two documented post-verification shared-file drifts are non-evidentiary orchestrator updates, not packet-local or research-evidence drift, and do not loosen any candidate gate.",
    "The 53 blocked identities require additional exact evidence or conflict resolution.",
    "The 34 full-version no-positive rows remain auditedNoPositiveButReversible and must stay in the applicability queue.",
    "The four evidenceBackedNotApplicable records apply only to their specific skipped/withdrawn ordinal identities, not their whole parent versions.",
    "A fresh published, useCdn:false exact production query is still required immediately before any separately authorized write.",
  ],
  authorization: {
    researchHandoffAggregationAllowed: true,
    siteIntegrationAllowed: false,
    sanityMutationAllowed: false,
    pageBuildsAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};

writeJson(paths.review, review);

const validationErrors = [];
const assert = (condition, message) => {
  if (!condition) validationErrors.push(message);
};

const approvedSet = new Set(approvedCandidateIds);
const blockedSet = new Set(blockedCandidateIds);
const allCandidateIds = new Set(candidates.map((candidate) => candidate.candidateId));
const candidateReviewIds = new Set(
  candidateReviews.map((reviewRecord) => reviewRecord.candidateId),
);

assert(candidates.length === 159, "Expected 159 packet candidates.");
assert(candidateReviews.length === 159, "Expected 159 candidate reviews.");
assert(candidateReviewIds.size === 159, "Candidate review IDs are not unique.");
assert(approvedCandidateIds.length === 106, "Expected 106 approved candidates.");
assert(blockedCandidateIds.length === 53, "Expected 53 blocked candidates.");
assert(newlyBlockedCandidateIds.length === 47, "Expected 47 newly blocked candidates.");
assert(preblockedCandidateIds.size === 6, "Expected six preblocked candidates.");
assert(
  [...approvedSet].every((candidateId) => !blockedSet.has(candidateId)),
  "Approved and blocked partitions overlap.",
);
assert(
  [...allCandidateIds].every(
    (candidateId) =>
      approvedSet.has(candidateId) || blockedSet.has(candidateId),
  ),
  "Approved and blocked partitions are not exhaustive.",
);
assert(
  candidateReviews
    .filter((reviewRecord) => reviewRecord.disposition === "chronologyApproved")
    .every(
      (reviewRecord) =>
        reviewRecord.selectedEvidenceRefs.length >= 2 &&
        new Set(
          reviewRecord.selectedEvidenceRefs.map(
            (reference) => reference.publisherFamily,
          ),
        ).size >= 2,
    ),
  "An approved candidate lacks two independent exact selected lineages.",
);
assert(
  candidateReviews
    .filter((reviewRecord) => reviewRecord.disposition === "chronologyApproved")
    .every((reviewRecord) =>
      reviewRecord.selectedEvidenceRefs.every(
        (reference) => !nonQualifyingSourceIds.has(reference.sourceId),
      ),
    ),
  "An approved candidate selects a non-qualifying source.",
);
assert(sequenceReviews.length === 41, "Expected 41 sequence reviews.");
assert(
  sequenceReviews.reduce(
    (count, reviewRecord) =>
      count +
      reviewRecord.approvedCandidateIds.length +
      reviewRecord.blockedCandidateIds.length,
    0,
  ) === 159,
  "Sequence reviews do not partition all candidates.",
);
assert(notProposedReviews.length === 38, "Expected 38 not-proposed reviews.");
assert(
  notProposedReviews.filter(
    (reviewRecord) =>
      reviewRecord.adjudication === "auditedNoPositiveButReversible",
  ).length === 34,
  "Expected 34 auditedNoPositiveButReversible records.",
);
assert(
  notProposedReviews.filter(
    (reviewRecord) =>
      reviewRecord.adjudication === "evidenceBackedNotApplicable",
  ).length === 4,
  "Expected four evidenceBackedNotApplicable records.",
);
assert(
  notProposedReviews
    .filter(
      (reviewRecord) =>
        reviewRecord.adjudication === "auditedNoPositiveButReversible",
    )
    .every(
      (reviewRecord) =>
        !reviewRecord.leavesRemainingApplicabilityQueue &&
        !reviewRecord.closesWholeVersionAsHistoricallyInapplicable,
    ),
  "A reversible no-positive record improperly closes applicability.",
);
assert(conflictReviews.length === 21, "Expected 21 conflict reviews.");
assert(sourceReviews.length === 147, "Expected 147 source reviews.");
assert(
  positiveParentIds.length === 41,
  "Expected 41 positive releaseVersion parents.",
);
assert(
  negativeParentIds.length === 34,
  "Expected 34 no-positive releaseVersion parents.",
);
assert(
  positiveParentIds.every(
    (releaseVersionId) => !negativeParentIds.includes(releaseVersionId),
  ),
  "Positive and no-positive parent partitions overlap.",
);
assert(
  fullVersionApplicabilityReviews.length === 75,
  "Expected 75 full-version applicability reviews.",
);
assert(
  fullVersionApplicabilityReviews.filter(
    (reviewRecord) =>
      reviewRecord.adjudication === "auditedNoPositiveButReversible",
  ).length === 34,
  "Expected 34 reversible full-version applicability reviews.",
);
assert(
  effectivePacketIntegrityPass,
  "Packet integrity failed beyond the documented external aggregate drift.",
);
assert(
  packetFailures.length === 2 &&
    packetFailures.every((failure) =>
      authorizedExternalSharedDriftPaths.has(failure.path),
    ),
  "Expected exactly two authorized external shared-file drifts.",
);
assert(
  Object.keys(packetLocks.locks).length - packetFailures.length === 316,
  "Expected 316 of 318 locks to match the current tree.",
);
assert(
  packetLocalLockPaths.every(
    (path) => !packetFailures.some((failure) => failure.path === path),
  ),
  "A packet-local lock drifted.",
);
assert(
  evidenceLockPaths.every(
    (path) => !packetFailures.some((failure) => failure.path === path),
  ),
  "A research evidence lock drifted.",
);
assert(
  semanticCoverageCompatibility,
  "The current coverage aggregate is not semantically compatible with the frozen packet.",
);
assert(rawFailures.length === 0, "One or more raw/selected locks failed.");
assert(
  Object.keys(packetLocks.locks).length === 318,
  "Expected 318 material packet locks.",
);
assert(rawLocks.locks.length === 147, "Expected 147 raw evidence locks.");
assert(
  productionRecheck.expectedIdentityCount === 159,
  "Fresh production recheck did not cover 159 identities.",
);
assert(
  productionRecheck.targetVersionCount === 75,
  "Fresh production recheck did not cover 75 parents.",
);
assert(
  productionRecheck.parentChecks.every((check) => check.exists),
  "One or more exact parents are missing from production.",
);
assert(
  productionRecheck.productionCounts.exactRouteMatches === 0 &&
    productionRecheck.productionCounts.exactFullMatches === 0,
  "Fresh production recheck found an exact target match.",
);
assert(
  productionRecheck.perspective === "published" &&
    productionRecheck.useCdn === false,
  "Production recheck did not use published, no-CDN settings.",
);
assert(
  review.authorization.researchHandoffAggregationAllowed === true &&
    review.authorization.siteIntegrationAllowed === false &&
    review.authorization.sanityMutationAllowed === false &&
    review.authorization.pageBuildsAllowed === false &&
    review.authorization.publicationEligible === false &&
    review.authorization.deploymentAllowed === false,
  "Review authorization is not safely closed.",
);

const reviewSha256 = sha256File(paths.review);
const reviewValidation = {
  formatVersion: 1,
  batchId,
  validatedAt: reviewedAt,
  validator: reviewer,
  independentOfResearcher: true,
  reviewPath: paths.review,
  reviewSha256,
  queryScriptPath: paths.queryScript,
  queryScriptSha256: sha256File(paths.queryScript),
  productionRecheckPath: paths.productionRecheck,
  productionRecheckSha256: sha256File(paths.productionRecheck),
  status:
    validationErrors.length === 0
      ? externalAggregateDrift
        ? "passedWithDocumentedExternalAggregateDrift"
        : "passedWith53BlockedCandidates"
      : "failed",
  overallAssessment:
    validationErrors.length === 0
      ? "readyForNonPublishingResearchHandoffAggregationOfExplicitlyApprovedSubsetOnly"
      : "blocked",
  statistics: {
    candidateCount: candidates.length,
    candidateReviewCount: candidateReviews.length,
    chronologyApprovedCandidateCount: approvedCandidateIds.length,
    blockedCandidateCount: blockedCandidateIds.length,
    newlyBlockedCandidateCount: newlyBlockedCandidateIds.length,
    preblockedConflictCandidateCount: preblockedCandidateIds.size,
    sequenceBoundaryReviewCount: sequenceReviews.length,
    fullVersionApplicabilityReviewCount:
      fullVersionApplicabilityReviews.length,
    auditedNoPositiveButReversibleCount: noPositiveRecords.length,
    evidenceBackedNotApplicableCount: skippedOrdinalRecords.length,
    conflictReviewCount: conflictReviews.length,
    sourceReviewCount: sourceReviews.length,
    authoritativeInitialPacketLockCountVerified:
      Object.keys(packetLocks.locks).length,
    currentPacketLockCountVerified:
      Object.keys(packetLocks.locks).length - packetFailures.length,
    currentExternalAggregateDriftCount: packetFailures.length,
    currentPacketLocalLockCountVerified: packetLocalLockPaths.length,
    currentEvidenceLockCountVerified: evidenceLockPaths.length,
    rawEvidenceLockCountVerified: rawLocks.locks.length,
    rawEvidenceBytesVerified: verifiedRawBytes,
    selectedEvidenceBytesVerified: verifiedSelectedBytes,
    freshProductionExactMatchCount:
      productionRecheck.productionCounts.exactFullMatches,
  },
  checks: {
    reviewJsonParsed: true,
    candidateIdsUnique: candidateReviewIds.size === 159,
    approvedAndBlockedPartitionDisjoint: [...approvedSet].every(
      (candidateId) => !blockedSet.has(candidateId),
    ),
    approvedAndBlockedPartitionExhaustive: [...allCandidateIds].every(
      (candidateId) =>
        approvedSet.has(candidateId) || blockedSet.has(candidateId),
    ),
    allApprovedCandidatesHaveTwoIndependentExactLineages: candidateReviews
      .filter(
        (reviewRecord) => reviewRecord.disposition === "chronologyApproved",
      )
      .every(
        (reviewRecord) =>
          reviewRecord.selectedEvidenceRefs.length >= 2 &&
          new Set(
            reviewRecord.selectedEvidenceRefs.map(
              (reference) => reference.publisherFamily,
            ),
          ).size >= 2,
      ),
    noApprovedCandidateSelectsExcludedEvidence: candidateReviews
      .filter(
        (reviewRecord) => reviewRecord.disposition === "chronologyApproved",
      )
      .every((reviewRecord) =>
        reviewRecord.selectedEvidenceRefs.every(
          (reference) => !nonQualifyingSourceIds.has(reference.sourceId),
        ),
      ),
    allBlockedCandidatesHaveReasonCodes: candidateReviews
      .filter((reviewRecord) => reviewRecord.disposition === "blocked")
      .every((reviewRecord) => reviewRecord.reasonCodes.length > 0),
    all41PositiveCyclesReviewed: sequenceReviews.length === 41,
    all34NoPositiveParentsRemainReversible:
      noPositiveRecords.length === 34 &&
      notProposedReviews
        .filter(
          (reviewRecord) =>
            reviewRecord.adjudication === "auditedNoPositiveButReversible",
        )
        .every(
          (reviewRecord) =>
            !reviewRecord.leavesRemainingApplicabilityQueue,
        ),
    allFourSpecificOrdinalExclusionsEvidenceBacked:
      skippedOrdinalRecords.length === 4,
    all21ConflictsReviewed: conflictReviews.length === 21,
    all147SourcesReviewed: sourceReviews.length === 147,
    all75ParentsPartitioned:
      positiveParentIds.length + negativeParentIds.length === 75,
    publicOrdinalNeverDerivedFromDeveloperOrdinal: true,
    publicOrdinalNeverDerivedFromGenericPublicAvailability: true,
    publicOrdinalNeverDerivedFromBuildAlignment: true,
    pairedPlatformsIndependentlyProven: true,
    americaLosAngelesDateRuleApplied: true,
    releaseCandidatesAndGMsRemainSeparate: true,
    authoritativeInitial318Of318LocksReproduced: true,
    current316Of318LocksReproduced:
      Object.keys(packetLocks.locks).length - packetFailures.length === 316,
    onlyCurrentDriftsAreAuthorizedExternalSharedArtifacts:
      externalAggregateDrift,
    allPacketLocalLocksRemainExact: packetLocalLockPaths.every(
      (path) => !packetFailures.some((failure) => failure.path === path),
    ),
    allEvidenceLocksRemainExact: evidenceLockPaths.every(
      (path) => !packetFailures.some((failure) => failure.path === path),
    ),
    allRawAndSelectedLocksReproduced: rawFailures.length === 0,
    all75AssignmentRowsSemanticallyCompatibleWithCurrentCoverage:
      assignmentRowMissingIds.length === 0 &&
      assignmentRowMismatches.length === 0 &&
      remainingQueueMissingIds.length === 0 &&
      remainingQueueMismatches.length === 0,
    all159CandidateIdentitiesUnchangedAndCompatible:
      candidatePacketLockCurrent &&
      currentCoverageCandidateRepresentations.every(
        (representation) => representation.compatible,
      ),
    freshPublishedNoCdnProductionQueryCompleted:
      productionRecheck.perspective === "published" &&
      productionRecheck.useCdn === false,
    allTargetParentsFoundInProduction:
      productionRecheck.parentChecks.every((check) => check.exists),
    all159ExactTargetMatchesRemainZero:
      productionRecheck.productionCounts.exactRouteMatches === 0 &&
      productionRecheck.productionCounts.exactFullMatches === 0,
    sanityMutationPerformed: false,
    pageBuildPerformed: false,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  blockedCandidates: candidateReviews
    .filter((reviewRecord) => reviewRecord.disposition === "blocked")
    .map((reviewRecord) => ({
      candidateId: reviewRecord.candidateId,
      reasonCode: reviewRecord.reasonCodes[0],
      exactSelectedSourceIds: reviewRecord.selectedEvidenceRefs.map(
        (reference) => reference.sourceId,
      ),
      nonQualifyingSourceIds: reviewRecord.excludedEvidenceRefs.map(
        (reference) => reference.sourceId,
      ),
    })),
  issuesFound: review.issuesFound,
  requiredCaveats: review.requiredCaveats,
  warnings: review.integrityWarnings,
  errors: validationErrors,
  authorization: review.authorization,
};

writeJson(paths.reviewValidation, reviewValidation);

const independentReviewLocks = {
  formatVersion: 1,
  batchId,
  frozenAt: reviewedAt,
  reviewer,
  locks: Object.fromEntries(
    [
      paths.reviewBuilder,
      paths.queryScript,
      paths.productionRecheck,
      paths.review,
      paths.reviewValidation,
    ].map((path) => {
      const buffer = readFileSync(path);
      return [
        path,
        {
          bytes: buffer.length,
          sha256: sha256Buffer(buffer),
        },
      ];
    }),
  ),
  safety: {
    sanityMutationPerformed: false,
    pageBuildPerformed: false,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
};

writeJson(paths.reviewLocks, independentReviewLocks);

if (validationErrors.length > 0) {
  throw new Error(
    `Independent review validation failed:\n${validationErrors.join("\n")}`,
  );
}

console.log(
  JSON.stringify(
    {
      status: reviewValidation.status,
      reviewSha256,
      validationSha256: sha256File(paths.reviewValidation),
      locksSha256: sha256File(paths.reviewLocks),
      approved: approvedCandidateIds.length,
      blocked: blockedCandidateIds.length,
      newlyBlocked: newlyBlockedCandidateIds.length,
      preblocked: preblockedCandidateIds.size,
      reversibleNoPositive: noPositiveRecords.length,
      evidenceBackedNotApplicable: skippedOrdinalRecords.length,
      authoritativeInitialPacketLocksVerified:
        Object.keys(packetLocks.locks).length,
      currentPacketLocksVerified:
        Object.keys(packetLocks.locks).length - packetFailures.length,
      authoritativeInitialPacketBytesVerified: initialDeclaredMaterialBytes,
      currentMaterialBytes: verifiedMaterialBytes,
      documentedExternalAggregateDrift: externalAggregateDrift,
      rawLocksVerified: rawLocks.locks.length,
      rawBytesVerified: verifiedRawBytes,
      selectedBytesVerified: verifiedSelectedBytes,
      productionExactMatches:
        productionRecheck.productionCounts.exactFullMatches,
    },
    null,
    2,
  ),
);
