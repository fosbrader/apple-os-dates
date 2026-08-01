#!/usr/bin/env node

import {readFileSync, writeFileSync} from "node:fs";

const packetDirectory =
  "research-handoffs/beta-chronology-gap/ios-major-12-18-followup";
const supplement = JSON.parse(
  readFileSync(`${packetDirectory}/supplement.json`, "utf8"),
);

const reviewedAt = "2026-07-31T05:55:14.425Z";
const unchangedCandidateIds = [
  "candidate:apple:ios:12.0:public-beta-1",
  "candidate:apple:ios:12.0:public-beta-2",
  "candidate:apple:ios:12.0:public-beta-3",
  "candidate:apple:ios:12.0:public-beta-4",
  "candidate:apple:ios:12.0:public-beta-5",
  "candidate:apple:ios:17.0:public-beta-6",
  "candidate:apple:ios:18.0:public-beta-5",
];
const correctedCreationSpecs = [
  {
    originalCandidateId:
      "candidate:apple:ios:14.0:public-beta-1",
    candidateId: "candidate:apple:ios:14.0:public-beta-2",
  },
  {
    originalCandidateId:
      "candidate:apple:ios:15.0:public-beta-2",
    candidateId: "candidate:apple:ios:15.0:public-beta-3",
  },
];
const mappingByOriginalId = new Map(
  supplement.mappings.map((mapping) => [
    mapping.originalRecordId,
    mapping,
  ]),
);

const requireMapping = (recordId) => {
  const mapping = mappingByOriginalId.get(recordId);
  if (!mapping) {
    throw new Error(`Missing supplement mapping for ${recordId}.`);
  }
  return mapping;
};

const unchangedCandidateReviews = unchangedCandidateIds.map(
  (candidateId) => {
    const mapping = requireMapping(candidateId);
    return {
      candidateId,
      appearanceDate: mapping.proposedIdentity.appearanceDate,
      disposition: "chronologyApprovedAfterSupplement",
      originalIdentityRetained: true,
      usableExactLineageCount:
        mapping.corroboration.exactVersionOrdinalDateLineages,
      publisherFamilies:
        mapping.corroboration.publisherFamilies,
      supplementalSourceIds: mapping.evidenceRefs
        .filter(({kind}) => kind === "supplementSource")
        .map(({sourceId}) => sourceId),
    };
  },
);

const supersededCandidateReviews = correctedCreationSpecs.map(
  ({originalCandidateId, candidateId}) => {
    const mapping = requireMapping(originalCandidateId);
    return {
      candidateId: originalCandidateId,
      appearanceDate: mapping.originalIdentity.appearanceDate,
      disposition: "supersededByCorrectedDisplayedIdentity",
      originalIdentityRetained: false,
      correctedCandidateId: candidateId,
      correctedIdentity: mapping.proposedIdentity,
      usableExactLineageCount:
        mapping.corroboration.exactVersionOrdinalDateLineages,
      publisherFamilies:
        mapping.corroboration.publisherFamilies,
      finding: mapping.rationale,
    };
  },
);

const correctedCreationCandidates = correctedCreationSpecs.map(
  ({originalCandidateId, candidateId}) => {
    const mapping = requireMapping(originalCandidateId);
    return {
      candidateId,
      supersedesCandidateId: originalCandidateId,
      originCohortId: "ios-major-12-18-followup",
      platform: mapping.platform,
      platformId: "platform-ios",
      version: mapping.version,
      releaseVersionId: mapping.releaseVersionId,
      proposedIdentity: mapping.proposedIdentity,
      ordinalBasis: "explicitDisplayedLabel",
      candidateStatus: "readyForChronologyReview",
      identityStatus: "correctedAndConfirmed",
      evidenceState: "corroborated",
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt: reviewedAt,
        matchBasis:
          "Fresh published no-CDN query found zero exact matches for the corrected displayed identity. Any existing event on the same date remains separately reconciled.",
        exactIdentityMatches: 0,
      },
      evidenceRefs: mapping.evidenceRefs.map((reference) => ({
        ...reference,
        locator:
          "Use only the exact claim described by supports and the controlling independent review.",
      })),
      buildEvidenceStatus: "absent",
      contentDisposition: "timelineOnly",
      blockers: [],
      review: {
        required: false,
        reviewer:
          "codex-independent-review-ios-major-12-18-followup",
        reviewedAt,
        notes:
          "Chronology-cleared only. The corrected identity supersedes the original candidate and does not authorize implementation.",
      },
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    };
  },
);

const ios15ExistingMapping = requireMapping(
  "existing-match:apple:ios:15.0:public-beta-1",
);
const productionCorrectionCandidate = {
  candidateId:
    "correction:apple:ios:15.0:public-beta-1-to-public-beta-2",
  supersedesExistingMatchId:
    "existing-match:apple:ios:15.0:public-beta-1",
  originCohortId: "ios-major-12-18-followup",
  platform: "iOS",
  platformId: "platform-ios",
  version: "15.0",
  releaseVersionId: "version-ios-15-0",
  proposedIdentity: ios15ExistingMapping.proposedIdentity,
  ordinalBasis: "explicitDisplayedLabel",
  candidateStatus:
    "identityCorrectionPendingSeparateAuthorization",
  identityStatus: "productionIdentityCorrectionConfirmed",
  evidenceState: "corroborated",
  productionReconciliation: {
    status: "existingIdentityCorrection",
    queriedAt: reviewedAt,
    matchBasis:
      "Fresh published no-CDN query found one June 30 public-beta event under the superseded Public Beta 1 identity and zero exact matches under the corrected Public Beta 2 identity.",
    exactIdentityMatches: 1,
    currentProductionEventId:
      "release-event-50da2e4e5ec3bdd8fa582ce1",
    duplicateCreationForbidden: true,
  },
  evidenceRefs: ios15ExistingMapping.evidenceRefs.map(
    (reference) => ({
      ...reference,
      locator:
        "Use only the exact claim described by supports and the controlling independent review.",
    }),
  ),
  buildEvidenceStatus: "absent",
  contentDisposition: "timelineOnly",
  blockers: [
    "This is an in-place production identity correction, not a creation candidate.",
    "Separate correction authorization and a fresh exact production recheck are required.",
  ],
  review: {
    required: false,
    reviewer:
      "codex-independent-review-ios-major-12-18-followup",
    reviewedAt,
    notes:
      "Chronology-cleared correction only. Preserve the existing production document/event identity and never create a duplicate.",
  },
  flags: {
    sanityMutationAllowed: false,
    publicationEligible: false,
  },
};

const review = {
  formatVersion: 1,
  batchId: supplement.batchId,
  reviewedAt,
  reviewer:
    "codex-independent-review-ios-major-12-18-followup",
  independentOfResearcher: true,
  verdict:
    "approvedSevenUnchangedTwoCorrectedCreationsAndOneProductionCorrection",
  summary: {
    supplementMappingCount: supplement.mappings.length,
    unchangedCandidateCount: unchangedCandidateIds.length,
    chronologyApprovedUnchangedCandidateCount:
      unchangedCandidateIds.length,
    supersededOriginalCandidateCount:
      correctedCreationSpecs.length,
    chronologyApprovedCorrectedCreationCount:
      correctedCreationCandidates.length,
    notProposedRecordCount: 2,
    withdrawnBroadNegativeCount: 2,
    productionIdentityCorrectionCount: 1,
    unresolvedSupplementRecordCount: 0,
    finding:
      "All seven evidence-only candidate gaps are now independently corroborated. Direct Software Update wording corrects the first iOS 14 public appearance to Public Beta 2, and two independent contemporary lineages establish the first two iOS 15 public appearances as Public Beta 2 and Public Beta 3. The existing iOS 15 June 30 record must be corrected in place, never duplicated.",
  },
  lockedFileVerification: {
    packetLocksPath:
      "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/packet-locks.json",
    declaredMaterialFileCount: 30,
    verifiedMaterialFileCount: 30,
    verifiedBytes: 4819548,
    byteFailures: 0,
    sha256Failures: 0,
    allPacketArtifactHashesReproduced: true,
  },
  rawEvidenceVerification: {
    rawEvidenceLocksPath:
      "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/raw-evidence-locks.json",
    declaredSourceCount: 13,
    verifiedSourceCount: 13,
    uniqueRawEvidencePaths: 13,
    verifiedRawBytes: 4570912,
    rawByteFailures: 0,
    rawSha256Failures: 0,
    selectedTextSha256Failures: 0,
    allRawAndSelectedEvidenceHashesReproduced: true,
  },
  checks: {
    packetJsonParsed: true,
    mappingRecordIdsUnique: true,
    sourceIdsUnique: true,
    allTwelveMappingsInspected: true,
    allThirteenRetainedRawSourcesInspected: true,
    allTenSourceRoleCorrectionsInspected: true,
    parentReviewQualificationsReapplied: true,
    publicOrdinalsNotDerivedFromDeveloperOrdinals: true,
    appearanceOrderNotTreatedAsDisplayedOrdinal: true,
    localCalendarDatesNormalizedToAmericaLosAngeles: true,
    freshProductionQueryPerformed: true,
    freshProductionQueryUsedCdn: false,
    freshProductionPerspectivePublished: true,
    freshExactParents: 5,
    freshExactExistingMatches: 1,
    freshCorrectedCreationMatches: 0,
    sanityMutationPerformed: false,
    productionIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  productionRecheck: {
    queriedAt: reviewedAt,
    perspective: "published",
    useCdn: false,
    totalReleaseEvents: 2068,
    iosPublicBetaEventsAllVersions: 10,
    scopedReleaseEvents: 61,
    scopedPublicBetaEvents: 2,
    exactParentMatchCount: 5,
    exactUnchangedCandidateMatchCount: 0,
    exactCorrectedCreationMatchCount: 0,
    existingProductionIdentity: {
      releaseVersionId: "version-ios-15-0",
      routeAlias: "public-beta-1",
      appearanceDate: "2021-06-30",
      eventId: "release-event-50da2e4e5ec3bdd8fa582ce1",
      exactMatchCount: 1,
    },
    finding:
      "Production remains unchanged: all missing identities are absent, and the single June 30 iOS 15 public event still carries the superseded Public Beta 1 identity.",
  },
  sourceReferenceAndLineageAudit: {
    mappingsWithTwoExactIndependentLineages: 12,
    mappingsWithFewerThanTwoExactIndependentLineages: 0,
    finding:
      "Every positive identity uses two independent publisher families at the exact version, public ordinal, and Pacific-date grain. Generic developer-title numerals remain availability-only and are not counted as public-ordinal evidence.",
  },
  sourceLocatorFindings: [
    {
      findingId: "ios12-early-public-beta-second-lineages",
      severity: "resolved",
      affectedCandidateIds: unchangedCandidateIds.slice(0, 5),
      sourceIds: [
        "appleinsider-ios12-pb1",
        "appleinsider-ios12-pb2",
        "appleinsider-ios12-pb3",
        "9to5mac-ios12-pb4",
        "iphonecanada-ios12-pb5",
      ],
      finding:
        "Five contemporary supplement pages explicitly identify Public Betas 1 through 5 on June 25, July 5, July 18, July 31, and August 6, 2018. They supply the exact second lineages absent from the frozen parent packet.",
    },
    {
      findingId: "ios14-opening-device-facing-public-beta-2",
      severity: "identityCorrection",
      affectedCandidateIds: [
        "candidate:apple:ios:14.0:public-beta-1",
        "candidate:apple:ios:14.0:public-beta-2",
      ],
      sourceIds: [
        "iphonecanada-ios14-pb2",
        "koc-ios14-pb2",
      ],
      finding:
        "Two independent July 9 installation walkthroughs state that Software Update displayed iOS 14 Public Beta 2. First-public-appearance wording is not the displayed ordinal.",
    },
    {
      findingId: "ios15-opening-displayed-label-sequence",
      severity: "productionCorrectionAndCandidateCorrection",
      affectedCandidateIds: [
        "candidate:apple:ios:15.0:public-beta-2",
        "candidate:apple:ios:15.0:public-beta-3",
      ],
      sourceIds: [
        "forbes-ios15-pb2",
        "iphonecanada-ios15-pb2",
        "forbes-ios15-pb3",
        "wccftech-ios15-pb3",
      ],
      finding:
        "Independent contemporary sources explicitly label the June 30 payload Public Beta 2 and the July 16 payload Public Beta 3. The June 30 production event must retain its document identity while its label, route alias, and sequence are separately corrected.",
    },
    {
      findingId: "ios17-and-ios18-late-cycle-second-lineages",
      severity: "resolved",
      affectedCandidateIds: [
        "candidate:apple:ios:17.0:public-beta-6",
        "candidate:apple:ios:18.0:public-beta-5",
      ],
      sourceIds: [
        "appleinsider-ios17-pb6",
        "9to5mac-ios18-pb5",
      ],
      finding:
        "AppleInsider explicitly establishes iOS 17 Public Beta 6 on August 29, 2023, and 9to5Mac explicitly establishes iOS 18 Public Beta 5 on August 20, 2024.",
    },
  ],
  mandatoryQualifications: [
    {
      qualificationId:
        "ios14-public-beta-2-first-public-appearance",
      appliesToCandidateIds: [
        "candidate:apple:ios:14.0:public-beta-2",
      ],
      requirement:
        "Use Public Beta 2 on 2020-07-09. Explain that this was the first public appearance but the Software Update label was Public Beta 2. Do not synthesize Public Beta 1.",
    },
    {
      qualificationId:
        "ios15-public-beta-2-production-correction",
      appliesToExistingMatchIds: [
        "existing-match:apple:ios:15.0:public-beta-1",
      ],
      requirement:
        "Correct the existing June 30 event in place from Public Beta 1 to Public Beta 2 only after separate authorization and a fresh exact recheck. Preserve its event/document identity and never create a duplicate.",
    },
    {
      qualificationId:
        "ios15-public-beta-3-second-public-appearance",
      appliesToCandidateIds: [
        "candidate:apple:ios:15.0:public-beta-3",
      ],
      requirement:
        "Use Public Beta 3 on 2021-07-16. Explain that it was the second public appearance; appearance count is not the displayed ordinal.",
    },
    {
      qualificationId: "ios18-public-beta-5-pacific-date",
      appliesToCandidateIds: [
        "candidate:apple:ios:18.0:public-beta-5",
      ],
      requirement:
        "Use 2024-08-20 America/Los_Angeles from iCulture and 9to5Mac. OS X Daily's August 21 report remains a later report, not the appearance date.",
    },
  ],
  candidateReviews: [
    ...unchangedCandidateReviews,
    ...supersededCandidateReviews,
  ],
  correctedCreationCandidates,
  productionCorrectionCandidates: [
    productionCorrectionCandidate,
  ],
  candidateVerdict: {
    chronologyApprovedAfterSupplement: unchangedCandidateIds,
    chronologyApprovedCorrectedCreations:
      correctedCreationCandidates.map(({candidateId}) => candidateId),
    supersededOriginalCandidates: correctedCreationSpecs.map(
      ({originalCandidateId}) => originalCandidateId,
    ),
    unresolved: [],
  },
  notProposedReviews: [
    {
      recordId:
        "not-proposed:apple:ios:14.0:public-beta-2",
      disposition:
        "withdrawBroadNegativeRetainDateSpecificJuly22Boundary",
      correctedCandidateId:
        "candidate:apple:ios:14.0:public-beta-2",
      finding:
        "Public Beta 2 existed on July 9. No separate Public Beta 2 distribution is established for July 22; Public Beta 3 followed on July 23.",
    },
    {
      recordId:
        "not-proposed:apple:ios:15.0:public-beta-3",
      disposition: "withdrawNegativeIdentity",
      correctedCandidateId:
        "candidate:apple:ios:15.0:public-beta-3",
      finding:
        "Two independent contemporary sources explicitly establish Public Beta 3 on July 16.",
    },
  ],
  existingMatchReviews: [
    {
      matchId:
        "existing-match:apple:ios:15.0:public-beta-1",
      appearanceDate: "2021-06-30",
      disposition:
        "productionIdentityCorrectionRequired",
      currentEventId:
        "release-event-50da2e4e5ec3bdd8fa582ce1",
      currentIdentity: {
        label: "Public Beta 1",
        routeAlias: "public-beta-1",
        sequence: 1,
      },
      correctedIdentity: {
        label: "Public Beta 2",
        routeAlias: "public-beta-2",
        sequence: 2,
      },
      duplicateCreationForbidden: true,
    },
  ],
  authorization: {
    chronologyApprovedUnchangedCandidateCount:
      unchangedCandidateIds.length,
    chronologyApprovedCorrectedCreationCount:
      correctedCreationCandidates.length,
    chronologyApprovalScope:
      "Public-beta identity, public ordinal, channel, and Pacific appearance date only, subject to every mandatory qualification.",
    publicationEligible: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    productionIdAllocationAllowed: false,
    pageBuildAllowed: false,
    deploymentAllowed: false,
  },
  requiredNextGate: {
    supersededOriginalCandidatesMustNotBePromoted: true,
    broadNegativeClaimsMustBeWithdrawn: true,
    productionCorrectionRequiresSeparateAuthorization: true,
    correctedCreationCandidatesRequireSeparateImplementationAuthorization:
      true,
    notes:
      "This review creates no Sanity IDs, performs no writes, authorizes no page builds, and does not authorize publication or deployment.",
  },
};

writeFileSync(
  `${packetDirectory}/independent-review.json`,
  `${JSON.stringify(review, null, 2)}\n`,
);

const normalizeEvidenceRef = (reference) => ({
  ...reference,
  kind: "packetSource",
});
const reviewedCandidates = {
  formatVersion: 1,
  batchId: supplement.batchId,
  generatedAt: reviewedAt,
  purpose:
    "Independently reviewed corrected-identity records derived from the frozen supplement. This is a guarded research artifact, not an executable mutation manifest.",
  candidates: [
    ...correctedCreationCandidates.map((candidate) => ({
      ...candidate,
      evidenceRefs: candidate.evidenceRefs.map(
        normalizeEvidenceRef,
      ),
    })),
    {
      ...productionCorrectionCandidate,
      evidenceRefs:
        productionCorrectionCandidate.evidenceRefs.map(
          normalizeEvidenceRef,
        ),
    },
  ],
  safety: {
    publicationEligible: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    pageBuildAllowed: false,
    deploymentAllowed: false,
  },
};
writeFileSync(
  `${packetDirectory}/reviewed-candidates.json`,
  `${JSON.stringify(reviewedCandidates, null, 2)}\n`,
);

console.log(
  JSON.stringify({
    outputPath: `${packetDirectory}/independent-review.json`,
    approvedUnchanged:
      review.candidateVerdict.chronologyApprovedAfterSupplement
        .length,
    correctedCreations:
      review.candidateVerdict.chronologyApprovedCorrectedCreations
        .length,
    supersededOriginals:
      review.candidateVerdict.supersededOriginalCandidates.length,
    productionCorrections:
      review.existingMatchReviews.length,
    reviewedCandidateRecordCount:
      reviewedCandidates.candidates.length,
    unresolved:
      review.candidateVerdict.unresolved.length,
  }),
);
