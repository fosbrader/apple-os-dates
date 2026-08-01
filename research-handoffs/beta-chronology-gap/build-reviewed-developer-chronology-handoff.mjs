import {readFileSync, writeFileSync} from "node:fs";

const programDirectory =
  "research-handoffs/beta-chronology-gap";
const packetDirectory = `${programDirectory}/developer-gap-priority`;
const candidatePath = `${packetDirectory}/candidates.json`;
const sourcePath = `${packetDirectory}/sources.json`;
const reviewPath = `${packetDirectory}/independent-review.json`;
const inventoryPath = `${programDirectory}/version-inventory-snapshot.json`;
const outputPath =
  `${programDirectory}/reviewed-developer-chronology-handoff.json`;

const readJson = (filePath) =>
  JSON.parse(readFileSync(filePath, "utf8"));
const fail = (message) => {
  throw new Error(message);
};

const candidateDocument = readJson(candidatePath);
const sourceDocument = readJson(sourcePath);
const review = readJson(reviewPath);
const inventory = readJson(inventoryPath);

const candidates = candidateDocument.candidates;
const candidateById = new Map(
  candidates.map((candidate) => [candidate.candidateId, candidate]),
);
if (candidateById.size !== candidates.length) {
  fail("Developer candidate IDs are not unique.");
}

const approvedIds = new Set(
  review.candidateVerdict.chronologyApproved,
);
const blockedIds = new Set(review.candidateVerdict.blocked);
const adjudicatedIds = new Set([...approvedIds, ...blockedIds]);
if (
  approvedIds.size + blockedIds.size !== adjudicatedIds.size ||
  adjudicatedIds.size !== candidates.length
) {
  fail(
    "The independent review does not uniquely adjudicate every developer candidate.",
  );
}
for (const candidateId of adjudicatedIds) {
  if (!candidateById.has(candidateId)) {
    fail(`The independent review references unknown ${candidateId}.`);
  }
}

const authorization = review.authorization;
if (
  authorization.publicationEligible !== false ||
  authorization.sanityMutationAllowed !== false ||
  authorization.stableEventIdCreationAllowed !== false ||
  authorization.productionIdAllocationAllowed !== false ||
  authorization.pageBuildAllowed !== false ||
  authorization.deploymentAllowed !== false
) {
  fail("The independent review contains an unsafe authorization flag.");
}
if (
  review.productionRecheck?.expectedIdentityCount !==
    candidates.length ||
  review.productionRecheck?.zeroExactRouteCheckCount !==
    candidates.length ||
  review.productionRecheck
    ?.zeroExactVersionChannelOrdinalDateCheckCount !==
    candidates.length ||
  review.productionRecheck?.nonzeroExactRouteChecks?.length !== 0 ||
  review.productionRecheck
    ?.nonzeroExactVersionChannelOrdinalDateChecks?.length !== 0
) {
  fail(
    "The independent production recheck is incomplete or found an overlap.",
  );
}

const productionIdentityKeys = new Set(
  inventory.versions.flatMap((version) =>
    version.events.map((event) =>
      [
        version._id,
        event.channel,
        event.routeAlias,
      ].join("\u0000"),
    ),
  ),
);
const candidateIdentityKeys = candidates.map((candidate) =>
  [
    candidate.releaseVersionId,
    candidate.proposedIdentity.channel,
    candidate.proposedIdentity.routeAlias,
  ].join("\u0000"),
);
if (new Set(candidateIdentityKeys).size !== candidateIdentityKeys.length) {
  fail("Developer candidate identity keys are not unique.");
}
const snapshotOverlaps = candidateIdentityKeys.filter((identityKey) =>
  productionIdentityKeys.has(identityKey),
);
if (snapshotOverlaps.length > 0) {
  fail(
    `The inventory snapshot contains ${snapshotOverlaps.length} developer candidate overlap(s).`,
  );
}

const sourceById = new Map(
  sourceDocument.sources.map((source) => [
    source.sourceId,
    source,
  ]),
);
if (sourceById.size !== sourceDocument.sources.length) {
  fail("Developer source IDs are not unique.");
}

const candidateReviewById = new Map();
for (const candidateReview of review.candidateReviews) {
  if (candidateReviewById.has(candidateReview.candidateId)) {
    fail(
      `Duplicate independent review for ${candidateReview.candidateId}.`,
    );
  }
  candidateReviewById.set(
    candidateReview.candidateId,
    candidateReview,
  );
}
if (candidateReviewById.size !== candidates.length) {
  fail("Every developer candidate must have one independent review.");
}

const resolveEvidence = (candidate) => {
  const evidence = candidate.evidenceRefs.map((reference) => {
    if (
      reference.kind !== "packetSource" ||
      reference.packetPath !== sourcePath ||
      !reference.sourceId
    ) {
      fail(
        `${candidate.candidateId} has an unresolved or non-packet evidence reference.`,
      );
    }
    const source = sourceById.get(reference.sourceId);
    if (!source) {
      fail(
        `${candidate.candidateId} references missing ${reference.sourceId}.`,
      );
    }
    if (!source.canonicalUrl || !source.title || !source.publisher) {
      fail(
        `${candidate.candidateId} references incomplete source metadata for ${reference.sourceId}.`,
      );
    }
    return {
      sourceKey: `${sourcePath}#${source.sourceId}`,
      sourcePath,
      sourceId: source.sourceId,
      canonicalUrl: source.canonicalUrl,
      archiveUrl: source.archiveUrl ?? null,
      title: source.title,
      publisher: source.publisher,
      author: source.author ?? null,
      publishedAt: source.publishedAt ?? null,
      publishedDateObserved:
        source.publishedDateObserved ?? null,
      publicationDatePrecision:
        source.publicationDatePrecision ?? null,
      accessedAt: source.accessedAt ?? null,
      sourceClass: source.sourceClass,
      sourceStatus: source.status ?? null,
      publisherFamily:
        source.lineage?.publisherFamily ?? source.publisher,
      independentForCorroboration:
        source.lineage?.independentForCorroboration ?? null,
      roles: source.roles ?? [],
      locator: reference.locator,
      supports: reference.supports,
      evidenceCustody: {
        rawPath: source.evidence?.rawPath ?? null,
        rawBytes: source.evidence?.rawBytes ?? null,
        rawSha256: source.evidence?.rawSha256 ?? null,
        selectedPath: source.evidence?.selectedPath ?? null,
        selectedTextBytes:
          source.evidence?.selectedTextBytes ?? null,
        selectedTextSha256:
          source.evidence?.selectedTextSha256 ?? null,
        captureMethod:
          source.evidence?.captureMethod ?? "web-only",
      },
    };
  });
  const independentFamilies = new Set(
    evidence
      .filter(
        (reference) =>
          reference.independentForCorroboration !== false,
      )
      .map((reference) => reference.publisherFamily),
  );
  if (independentFamilies.size < 2) {
    fail(
      `${candidate.candidateId} resolves to fewer than two independent publisher families.`,
    );
  }
  return evidence;
};

const mandatoryQualificationsFor = (candidateId) =>
  (review.mandatoryQualifications ?? []).filter((qualification) =>
    qualification.candidateIds?.includes(candidateId),
  );

const handoffCandidates = candidates
  .filter((candidate) => approvedIds.has(candidate.candidateId))
  .map((candidate) => {
    const identity = candidate.proposedIdentity;
    if (
      identity.channel !== "developerBeta" ||
      candidate.productionReconciliation?.status !==
        "confirmedMissing" ||
      candidate.productionReconciliation?.exactIdentityMatches !== 0 ||
      candidate.flags?.sanityMutationAllowed !== false ||
      candidate.flags?.publicationEligible !== false ||
      candidate.flags?.stableEventIdCreationAllowed !== false
    ) {
      fail(`${candidate.candidateId} fails the developer handoff gate.`);
    }
    return {
      candidateId: candidate.candidateId,
      originCohortId: candidate.originCohortId,
      platform: candidate.platform,
      platformId: candidate.platformId,
      version: candidate.version,
      releaseVersionId: candidate.releaseVersionId,
      proposedIdentity: {
        label: identity.label,
        routeAlias: identity.routeAlias,
        channel: identity.channel,
        appearanceDate: identity.appearanceDate,
        sequence: identity.sequence,
        isRevision: identity.isRevision,
        availabilityState: identity.availabilityState,
        closesReleaseCycle: identity.closesReleaseCycle,
      },
      ordinalBasis: candidate.ordinalBasis,
      identityStatus: candidate.identityStatus,
      evidenceState: candidate.evidenceState,
      contentDisposition:
        candidate.contentDisposition ?? "timelineOnly",
      buildEvidenceStatus:
        candidate.buildEvidenceStatus ?? "absent",
      productionReconciliation: candidate.productionReconciliation,
      review: {
        state: "chronologyApproved",
        candidatePacketPath: candidatePath,
        reviewArtifactPath: reviewPath,
        candidateAdjudication: candidateReviewById.get(
          candidate.candidateId,
        ),
        mandatoryQualifications:
          mandatoryQualificationsFor(candidate.candidateId),
        qualificationsMandatory: true,
        instruction:
          "Use the candidate-specific adjudication and all matching mandatory qualifications as controlling. Do not infer channel, ordinal, or date from aggregate counts or a public-beta publication date.",
      },
      evidence: resolveEvidence(candidate),
      safety: {
        publicationEligible: false,
        sanityMutationAllowed: false,
        stableEventIdCreationAllowed: false,
        pageBuildAllowed: false,
        deploymentAllowed: false,
      },
    };
  });

handoffCandidates.sort(
  (left, right) =>
    left.version.localeCompare(right.version, undefined, {
      numeric: true,
    }) ||
    left.proposedIdentity.appearanceDate.localeCompare(
      right.proposedIdentity.appearanceDate,
    ) ||
    left.proposedIdentity.sequence - right.proposedIdentity.sequence,
);

const representedVersionIds = new Set(
  handoffCandidates.map((candidate) => candidate.releaseVersionId),
);
const evidenceReferenceCount = handoffCandidates.reduce(
  (total, candidate) => total + candidate.evidence.length,
  0,
);
const uniqueCanonicalSourceUrls = new Set(
  handoffCandidates.flatMap((candidate) =>
    candidate.evidence.map((evidence) => evidence.canonicalUrl),
  ),
);
const blockedCandidates = candidates
  .filter((candidate) => blockedIds.has(candidate.candidateId))
  .map((candidate) => ({
    candidateId: candidate.candidateId,
    releaseVersionId: candidate.releaseVersionId,
    platform: candidate.platform,
    version: candidate.version,
    routeAlias: candidate.proposedIdentity.routeAlias,
    disposition:
      "Excluded from the reviewed handoff pending additional evidence or modeling adjudication.",
    candidateAdjudication: candidateReviewById.get(
      candidate.candidateId,
    ),
  }));

const handoff = {
  formatVersion: 1,
  programId: "apple-beta-chronology-gap",
  generatedAt: new Date().toISOString(),
  channelScope: ["developerBeta"],
  productionSnapshot: review.productionRecheck,
  purpose:
    "Reviewed developer-beta chronology-only handoff for later page-building and guarded mutation planning. This is not an executable Sanity manifest.",
  summary: {
    chronologyApprovedConfirmedMissingCandidateCount:
      handoffCandidates.length,
    representedVersionCount: representedVersionIds.size,
    evidenceReferenceCount,
    uniqueCanonicalSourceUrlCount:
      uniqueCanonicalSourceUrls.size,
    blockedCandidateCount: blockedCandidates.length,
    mandatoryQualificationCount:
      review.mandatoryQualifications?.length ?? 0,
    conflictAdjudicationCount:
      review.conflictAdjudications?.length ?? 0,
  },
  safety: {
    status: "researchHandoffOnly",
    containsExecutableMutationPlan: false,
    publicationEligible: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    productionIdAllocationAllowed: false,
    pageBuildAllowed: false,
    deploymentAllowed: false,
  },
  requiredBeforeAnyMutationPlan: [
    "Obtain separate user authorization for production mutation.",
    "Rerun the exact published-production identity query for every candidate immediately before planning.",
    "Exclude any candidate whose identity has appeared or changed since the recorded snapshot.",
    "Preserve developer and public appearances as separate events even when they share a build or date.",
    "Read and preserve every candidate adjudication, mandatory qualification, sequence-boundary review, and conflict adjudication.",
    "Derive stableEventId and document IDs only inside the separately reviewed ingestion layer; never promote candidateId as a production ID.",
  ],
  packetWideReview: {
    independentReviewPath: reviewPath,
    sequenceBoundaryReviews:
      review.sequenceBoundaryReviews ?? [],
    conflictAdjudications:
      review.conflictAdjudications ?? [],
    mandatoryQualifications:
      review.mandatoryQualifications ?? [],
  },
  blockedCandidates,
  candidates: handoffCandidates,
};

writeFileSync(outputPath, `${JSON.stringify(handoff, null, 2)}\n`);

console.log(
  JSON.stringify({
    outputPath,
    candidateCount: handoffCandidates.length,
    representedVersionCount: representedVersionIds.size,
    evidenceReferenceCount,
    uniqueCanonicalSourceUrlCount:
      uniqueCanonicalSourceUrls.size,
    blockedCandidateCount: blockedCandidates.length,
  }),
);
