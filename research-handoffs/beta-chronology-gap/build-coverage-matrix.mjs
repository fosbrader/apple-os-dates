import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";

import inventory from "./version-inventory-snapshot.json" with {
  type: "json",
};
import foundation from "./candidate-register.json" with {
  type: "json",
};
import ios9Point from "./ios9-point/candidates.json" with {
  type: "json",
};
import ios9PointReview from "./ios9-point/review.json" with {
  type: "json",
};
import ios9PointCorroborationReview from "./ios9-point/corroboration-independent-review.json" with {
  type: "json",
};
import ios9And10Major from "./ios9-10-major/candidates.json" with {
  type: "json",
};
import ios9And10MajorReview from "./ios9-10-major/review.json" with {
  type: "json",
};
import ios10PointPublic from "./ios10-point-public/candidates.json" with {
  type: "json",
};
import ios10PointPublicIndependentReview from "./ios10-point-public/independent-review.json" with {
  type: "json",
};
import ios10PointPublicFollowup from "./ios10-point-public-followup/candidates.json" with {
  type: "json",
};
import ios10PointPublicFollowupIndependentReview from "./ios10-point-public-followup/independent-review.json" with {
  type: "json",
};
import mobile26Public from "./mobile26-public/candidates.json" with {
  type: "json",
};
import mobile26PublicIndependentReview from "./mobile26-public/independent-review.json" with {
  type: "json",
};
import iosMajor12To18 from "./ios-major-12-18/candidates.json" with {
  type: "json",
};
import iosMajor12To18IndependentReview from "./ios-major-12-18/independent-review.json" with {
  type: "json",
};
import iosMajor12To18FollowupReview from "./ios-major-12-18-followup/independent-review.json" with {
  type: "json",
};
import iosMajor12To18FollowupCandidates from "./ios-major-12-18-followup/reviewed-candidates.json" with {
  type: "json",
};
import iosIpadosPoint12To14 from "./ios-ipados-point-12-14/candidates.json" with {
  type: "json",
};
import iosIpadosPoint12To14IndependentReview from "./ios-ipados-point-12-14/independent-review.json" with {
  type: "json",
};
import iosIpadosPoint12To14FollowupIndependentReview from "./ios-ipados-point-12-14-followup/independent-review.json" with {
  type: "json",
};
import iosIpadosPoint15To18 from "./ios-ipados-point-15-18/candidates.json" with {
  type: "json",
};
import iosIpadosPoint15To18NotProposed from "./ios-ipados-point-15-18/not-proposed.json" with {
  type: "json",
};
import iosIpadosPoint15To18IndependentReview from "./ios-ipados-point-15-18/independent-review.json" with {
  type: "json",
};
import iosPatchApplicability from "./ios-patch-applicability/candidates.json" with {
  type: "json",
};
import iosPatchApplicabilityAudit from "./ios-patch-applicability/applicability-audit.json" with {
  type: "json",
};
import iosPatchApplicabilityIndependentReview from "./ios-patch-applicability/independent-review.json" with {
  type: "json",
};
import iosPatchApplicabilityIndependentReviewValidation from "./ios-patch-applicability/independent-review-validation.json" with {
  type: "json",
};
import iosPatchApplicabilityIndependentReviewIntegrity from "./ios-patch-applicability/independent-review-integrity.json" with {
  type: "json",
};
import iosPatchApplicabilityPacketLocks from "./ios-patch-applicability/packet-locks.json" with {
  type: "json",
};
import iosPatchApplicabilityRawEvidenceLocks from "./ios-patch-applicability/raw-evidence-locks.json" with {
  type: "json",
};
import macos2014To2019 from "./macos-2014-2019/candidates.json" with {
  type: "json",
};
import macos2014To2019IndependentReview from "./macos-2014-2019/independent-review.json" with {
  type: "json",
};
import macos2014To2019IndependentReviewFollowup from "./macos-2014-2019/independent-review-followup.json" with {
  type: "json",
};
import macosMajor11To26 from "./macos-major-11-26/candidates.json" with {
  type: "json",
};
import macosMajor11To26IndependentReview from "./macos-major-11-26/independent-review.json" with {
  type: "json",
};
import macosPoint15To26 from "./macos-point-15-26/candidates.json" with {
  type: "json",
};
import macosPoint15To26IndependentReview from "./macos-point-15-26/independent-review.json" with {
  type: "json",
};
import macosPoint15To26FollowupIndependentReview from "./macos-point-15-26-followup/independent-review.json" with {
  type: "json",
};
import ipadosMajor from "./ipados-major-13-26/candidates.json" with {
  type: "json",
};
import ipadosMajorIndependentReview from "./ipados-major-13-26/independent-review.json" with {
  type: "json",
};
import ipadosMajorSecondLineageIndependentReview from "./ipados-major-13-26-second-lineage/independent-review.json" with {
  type: "json",
};
import watchosMajor from "./watchos-major-7-26/candidates.json" with {
  type: "json",
};
import watchosMajorIndependentReview from "./watchos-major-7-26/independent-review.json" with {
  type: "json",
};
import watchosPoint from "./watchos-point-7-26/candidates.json" with {
  type: "json",
};
import watchosPointResearchedIdentities from "./watchos-point-7-26/researched-identities.json" with {
  type: "json",
};
import watchosPointIndependentReview from "./watchos-point-7-26/independent-review.json" with {
  type: "json",
};
import watchosPointIndependentReviewValidation from "./watchos-point-7-26/independent-review-validation.json" with {
  type: "json",
};
import watchosPointIndependentReviewLocks from "./watchos-point-7-26/independent-review-locks.json" with {
  type: "json",
};
import watchosPointPacketLocks from "./watchos-point-7-26/packet-locks.json" with {
  type: "json",
};
import watchosPointRawEvidenceLocks from "./watchos-point-7-26/raw-evidence-locks.json" with {
  type: "json",
};
import tvosMajor from "./tvos-major-11-26/candidates.json" with {
  type: "json",
};
import tvosMajorIndependentReview from "./tvos-major-11-26/independent-review.json" with {
  type: "json",
};
import tvosPoint from "./tvos-point-11-26/candidates.json" with {
  type: "json",
};
import tvosPointApplicabilityAudit from "./tvos-point-11-26/applicability-audit.json" with {
  type: "json",
};
import tvosPointNegativeFindings from "./tvos-point-11-26/negative-findings.json" with {
  type: "json",
};
import tvosPointIndependentReview from "./tvos-point-11-26/independent-review.json" with {
  type: "json",
};
import tvosPointIndependentReviewValidation from "./tvos-point-11-26/independent-review-validation.json" with {
  type: "json",
};
import tvosPointIndependentReviewIntegrity from "./tvos-point-11-26/independent-review-integrity.json" with {
  type: "json",
};
import tvosPointPacketLocks from "./tvos-point-11-26/packet-locks.json" with {
  type: "json",
};
import tvosPointRawEvidenceLocks from "./tvos-point-11-26/raw-evidence-locks.json" with {
  type: "json",
};
import developerGapPriority from "./developer-gap-priority/candidates.json" with {
  type: "json",
};
import developerGapPriorityIndependentReview from "./developer-gap-priority/independent-review.json" with {
  type: "json",
};

const outputDirectory = "research-handoffs/beta-chronology-gap";
const boundaries = {
  iOS: {
    minimumVersion: "8.3",
    platformId: "platform-ios",
    basis: "Recurring iOS public-beta program began with iOS 8.3.",
  },
  iPadOS: {
    minimumVersion: "13.0",
    platformId: "platform-ipados",
    basis: "Separately named iPadOS public beta began with iPadOS 13.",
  },
  macOS: {
    minimumVersion: "10.9.3",
    platformId: "platform-macos",
    basis: "Recurring open OS X seed program began with OS X 10.9.3.",
  },
  watchOS: {
    minimumVersion: "7.0",
    platformId: "platform-watchos",
    basis: "Apple identified watchOS 7 as the first watchOS public beta.",
  },
  tvOS: {
    minimumVersion: "11.0",
    platformId: "platform-tvos",
    basis: "The first tvOS public beta appeared in the tvOS 11 cycle.",
  },
};

const compareVersions = (left, right) => {
  const leftParts = left.split(".").map(Number);
  const rightParts = right.split(".").map(Number);
  for (
    let index = 0;
    index < Math.max(leftParts.length, rightParts.length);
    index += 1
  ) {
    const difference =
      (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
};
const assertCandidatePartition = (
  packetName,
  candidates,
  dispositions,
) => {
  const seen = new Set();
  for (const disposition of dispositions) {
    for (const candidateId of disposition) {
      if (seen.has(candidateId)) {
        throw new Error(
          `${packetName} assigns ${candidateId} to multiple review states.`,
        );
      }
      seen.add(candidateId);
    }
  }
  const candidateIds = new Set(
    candidates.map((candidate) => candidate.candidateId),
  );
  const missing = [...candidateIds].filter(
    (candidateId) => !seen.has(candidateId),
  );
  const unknown = [...seen].filter(
    (candidateId) => !candidateIds.has(candidateId),
  );
  if (missing.length > 0 || unknown.length > 0) {
    throw new Error(
      `${packetName} review partition mismatch: ${missing.length} missing and ${unknown.length} unknown candidate IDs.`,
    );
  }
};
const assertSameIdSet = (
  packetName,
  leftLabel,
  leftIds,
  rightLabel,
  rightIds,
) => {
  const left = new Set(leftIds);
  const right = new Set(rightIds);
  const leftOnly = [...left].filter((candidateId) => !right.has(candidateId));
  const rightOnly = [...right].filter((candidateId) => !left.has(candidateId));
  if (leftOnly.length > 0 || rightOnly.length > 0) {
    throw new Error(
      `${packetName} ${leftLabel}/${rightLabel} mismatch: ${leftOnly.length} only in ${leftLabel} and ${rightOnly.length} only in ${rightLabel}.`,
    );
  }
};
const assertResearchHandoffReviewAuthorization = (
  packetName,
  review,
  validation,
) => {
  if (
    review.authorization?.researchHandoffAggregationAllowed !== true ||
    validation.authorization?.researchHandoffAggregationAllowed !== true
  ) {
    throw new Error(
      `${packetName} does not authorize research-handoff aggregation.`,
    );
  }
  const requiredFalseAuthorizationFlags = [
    "sanityMutationAllowed",
    "stableEventIdCreationAllowed",
    "pageBuildsAllowed",
    "publicationEligible",
    "deploymentAllowed",
  ];
  for (const flag of requiredFalseAuthorizationFlags) {
    if (
      review.authorization?.[flag] !== false ||
      validation.authorization?.[flag] !== false
    ) {
      throw new Error(
        `${packetName} review authorization flag ${flag} is not false.`,
      );
    }
  }
  if (
    "siteIntegrationAllowed" in review.authorization &&
    review.authorization.siteIntegrationAllowed !== false
  ) {
    throw new Error(
      `${packetName} siteIntegrationAllowed flag is not false.`,
    );
  }
  if (
    !String(validation.status).startsWith("passed") ||
    (validation.errors?.length ?? 0) !== 0
  ) {
    throw new Error(
      `${packetName} final independent-review validation did not pass cleanly.`,
    );
  }
  const mutationCheck = review.checks?.sanityMutationPerformed;
  const pageBuildCheck =
    review.checks?.pageBuildPerformed ??
    review.checks?.pageBuildsPerformed;
  if (
    mutationCheck !== false ||
    ![false, 0].includes(pageBuildCheck) ||
    review.checks?.publicationPerformed !== false ||
    review.checks?.deploymentPerformed !== false
  ) {
    throw new Error(
      `${packetName} final review does not preserve the no-mutation/no-build/no-publication/no-deploy boundary.`,
    );
  }
};
const assertPinnedFile = (filePath, expectedSha256) => {
  const actualSha256 = createHash("sha256")
    .update(readFileSync(filePath))
    .digest("hex");
  if (actualSha256 !== expectedSha256) {
    throw new Error(
      `${filePath} no longer matches its immutable final-review pin.`,
    );
  }
};
const assertPinnedArtifactSet = (
  packetName,
  pinSetName,
  pins,
) => {
  for (const [entryPath, entryPin] of Object.entries(pins)) {
    const pin = {
      ...entryPin,
      path: entryPin.path ?? entryPath,
    };
    const contents = readFileSync(pin.path);
    const actualSha256 = createHash("sha256")
      .update(contents)
      .digest("hex");
    if (
      contents.byteLength !== pin.bytes ||
      actualSha256 !== pin.sha256
    ) {
      throw new Error(
        `${packetName} current ${pinSetName} artifact ${pin.path} no longer matches its immutable byte/hash pin.`,
      );
    }
  }
};
const assertResearchHandoffManifestEntries = (
  packetName,
  manifest,
) => {
  const researchPins = Object.fromEntries(
    Object.entries(manifest.locks).filter(([filePath]) =>
      filePath.startsWith("research-handoffs/"),
    ),
  );
  assertPinnedArtifactSet(
    packetName,
    "research-handoff manifest",
    researchPins,
  );
};
const assertResearchHandoffIntegrity = (
  packetName,
  integrity,
) => {
  if (
    integrity.status !== "verified" ||
    integrity.authorization?.researchHandoffAggregationAllowed !==
      true
  ) {
    throw new Error(
      `${packetName} final integrity artifact does not authorize research-handoff aggregation.`,
    );
  }
  for (const flag of [
    "siteIntegrationAllowed",
    "sanityMutationAllowed",
    "stableEventIdCreationAllowed",
    "pageBuildsAllowed",
    "publicationEligible",
    "deploymentAllowed",
  ]) {
    if (integrity.authorization?.[flag] !== false) {
      throw new Error(
        `${packetName} integrity authorization flag ${flag} is not false.`,
      );
    }
  }
  if (
    integrity.safety?.sharedAggregatesModified !== false ||
    integrity.safety?.sanityMutationPerformed !== false ||
    integrity.safety?.stableEventIdsCreated !== 0 ||
    integrity.safety?.pageBuildsPerformed !== 0 ||
    integrity.safety?.publicationPerformed !== false ||
    integrity.safety?.deploymentPerformed !== false ||
    Object.values(integrity.postWriteChecks ?? {}).some(
      (value) => value !== true,
    )
  ) {
    throw new Error(
      `${packetName} final integrity checks do not preserve the research-only boundary.`,
    );
  }
};

const readyIos9PointIds = new Set(
  [
    ...ios9PointReview.candidateVerdict.readyForChronologyReview,
    ...ios9PointCorroborationReview.candidateVerdict
      .chronologyApprovedAfterCorroboration,
  ],
);
const secondLineageIos9PointIds = new Set(
  ios9PointReview.candidateVerdict.needsSecondPublisherLineage.filter(
    (candidateId) => !readyIos9PointIds.has(candidateId),
  ),
);
const approvedIos9And10MajorIds = new Set(
  ios9And10MajorReview.candidateVerdict.chronologyApproved,
);
const approvedIos10PointPublicFollowupIds = new Set(
  ios10PointPublicFollowupIndependentReview.candidateVerdict
    .chronologyApprovedAfterSupplement,
);
const approvedIos10PointPublicIds = new Set([
  ...ios10PointPublicIndependentReview.candidateVerdict
    .confirmedMissingCreationCandidates,
  ...approvedIos10PointPublicFollowupIds,
]);
const blockedIos10PointPublicIds = new Set(
  ios10PointPublicIndependentReview.candidateVerdict.blocked.filter(
    (candidateId) =>
      !approvedIos10PointPublicFollowupIds.has(candidateId),
  ),
);
const ios10PointPublicFollowupById = new Map(
  ios10PointPublicFollowup.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const approvedMobile26PublicIds = new Set(
  mobile26PublicIndependentReview.candidateVerdict
    .chronologyApproved,
);
const blockedMobile26PublicIds = new Set(
  mobile26PublicIndependentReview.candidateVerdict.blocked,
);
const approvedIosMajor12To18Ids = new Set([
  ...iosMajor12To18IndependentReview.candidateVerdict
    .chronologyApproved,
  ...iosMajor12To18FollowupReview.candidateVerdict
    .chronologyApprovedAfterSupplement,
]);
const supersededIosMajor12To18Ids = new Set(
  iosMajor12To18FollowupReview.candidateVerdict
    .supersededOriginalCandidates,
);
const blockedIosMajor12To18Ids = new Set(
  iosMajor12To18IndependentReview.candidateVerdict.blocked.filter(
    (candidateId) =>
      !approvedIosMajor12To18Ids.has(candidateId) &&
      !supersededIosMajor12To18Ids.has(candidateId),
  ),
);
const parentApprovedIosIpadosPoint12To14Ids = new Set(
  iosIpadosPoint12To14IndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const followupApprovedIosIpadosPoint12To14Ids = new Set(
  iosIpadosPoint12To14FollowupIndependentReview
    .candidateDisposition.chronologyApprovedCandidateIds,
);
const approvedIosIpadosPoint12To14Ids = new Set([
  ...parentApprovedIosIpadosPoint12To14Ids,
  ...followupApprovedIosIpadosPoint12To14Ids,
]);
const blockedIosIpadosPoint12To14Ids = new Set(
  iosIpadosPoint12To14IndependentReview.candidateDisposition
    .blockedCandidateIds.filter(
      (candidateId) =>
        !followupApprovedIosIpadosPoint12To14Ids.has(candidateId),
    ),
);
const iosIpados14Point1NegativeReview =
  iosIpadosPoint12To14IndependentReview.negativeFindingReviews.find(
    (finding) =>
      finding.findingId ===
      "negative:ios-ipados:14.1:any-public-beta",
  );
if (
  iosIpados14Point1NegativeReview?.disposition !==
  "approvedAfterPacketSupplement"
) {
  throw new Error(
    "The iOS/iPadOS 14.1 full-version negative is not independently approved.",
  );
}
if (
  iosIpadosPoint15To18IndependentReview.authorization
    .researchHandoffAggregationAllowed !== true
) {
  throw new Error(
    "The iOS/iPadOS 15–18 review does not authorize research-handoff aggregation.",
  );
}
const approvedIosIpadosPoint15To18Ids = new Set(
  iosIpadosPoint15To18IndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const blockedIosIpadosPoint15To18Ids = new Set(
  iosIpadosPoint15To18IndependentReview.candidateDisposition
    .blockedCandidateIds,
);
const iosIpadosPoint15To18NotProposedById = new Map(
  iosIpadosPoint15To18NotProposed.records.map((record) => [
    record.recordId,
    record,
  ]),
);
assertPinnedFile(
  "research-handoffs/beta-chronology-gap/ios-patch-applicability/independent-review-integrity.json",
  "9f8a6dd7fb666b9bf20d89891dde83ded7a467e83242848609a8d787a911e007",
);
assertPinnedFile(
  "research-handoffs/beta-chronology-gap/ios-patch-applicability/packet-locks.json",
  "23c6bac767883500103ecdb2108fb10ec49574f39119587da8a56835712aaa98",
);
assertPinnedArtifactSet(
  "ios-patch-applicability",
  "frozen-core",
  iosPatchApplicabilityIndependentReviewIntegrity.frozenCorePins,
);
assertPinnedArtifactSet(
  "ios-patch-applicability",
  "reviewer",
  iosPatchApplicabilityIndependentReviewIntegrity.reviewerArtifactPins,
);
assertResearchHandoffManifestEntries(
  "ios-patch-applicability",
  iosPatchApplicabilityPacketLocks,
);
assertResearchHandoffReviewAuthorization(
  "ios-patch-applicability",
  iosPatchApplicabilityIndependentReview,
  iosPatchApplicabilityIndependentReviewValidation,
);
if (
  iosPatchApplicabilityPacketLocks.materialFileCount !==
    iosPatchApplicabilityIndependentReview.lockedFileVerification
      .verifiedMaterialFileCount ||
  iosPatchApplicabilityRawEvidenceLocks.locks.length !==
    iosPatchApplicabilityIndependentReview.lockedFileVerification
      .rawEvidenceVerifiedCount
) {
  throw new Error(
    "The iOS patch final review does not reconcile to its frozen packet and raw-evidence lock counts.",
  );
}
const approvedIosPatchApplicabilityIds = new Set(
  iosPatchApplicabilityIndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const blockedIosPatchApplicabilityIds = new Set(
  iosPatchApplicabilityIndependentReview.candidateDisposition
    .blockedCandidateIds,
);
assertCandidatePartition(
  "ios-patch-applicability",
  iosPatchApplicability.candidates,
  [
    approvedIosPatchApplicabilityIds,
    blockedIosPatchApplicabilityIds,
  ],
);
assertSameIdSet(
  "ios-patch-applicability",
  "review-approved",
  approvedIosPatchApplicabilityIds,
  "validation-approved",
  iosPatchApplicabilityIndependentReviewValidation
    .candidateDisposition.chronologyApprovedCandidateIds,
);
const iosPatchApplicabilityAuditByVersionId = new Map(
  iosPatchApplicabilityAudit.rows.map((row) => [
    row.releaseVersionId,
    row,
  ]),
);
const iosPatchSpecialReviewByVersionId = new Map(
  iosPatchApplicabilityIndependentReview.specialApplicabilityReviews.map(
    (review) => [review.releaseVersionId, review],
  ),
);
const iosPatchReviewedApplicabilityRecords = [
  ...iosPatchApplicabilityIndependentReview.applicabilityDisposition
    .evidenceBackedNotApplicableVersionIds,
  ...iosPatchApplicabilityIndependentReview.applicabilityDisposition
    .notEstablishedConflictVersionIds,
  ...iosPatchApplicabilityIndependentReview.applicabilityDisposition
    .auditedNoPositiveButReversibleVersionIds,
].map((releaseVersionId) => {
  const audit =
    iosPatchApplicabilityAuditByVersionId.get(releaseVersionId);
  if (!audit) {
    throw new Error(
      `${releaseVersionId} lacks its iOS patch applicability-audit row.`,
    );
  }
  const specialReview =
    iosPatchSpecialReviewByVersionId.get(releaseVersionId) ?? null;
  const result =
    specialReview?.researchClassification ??
    "auditedNoPositiveButReversible";
  if (
    ![
      "evidenceBackedNotApplicable",
      "notEstablished",
      "auditedNoPositiveButReversible",
    ].includes(result)
  ) {
    throw new Error(
      `${releaseVersionId} has unsupported iOS patch applicability result ${result}.`,
    );
  }
  return {
    releaseVersionId,
    platform: audit.platform,
    version: audit.version,
    findingId: audit.auditId,
    result:
      result === "notEstablished"
        ? "notEstablishedConflict"
        : result,
    reasonCode: specialReview?.reasonCode ?? null,
    packetPath: "ios-patch-applicability/applicability-audit.json",
    reviewArtifactPath:
      "ios-patch-applicability/independent-review.json",
    qualification:
      specialReview?.finding ??
      specialReview?.historicalConclusion ??
      audit.conclusion,
    reversalEvidence: audit.reversalEvidence,
    evidenceRefs: audit.evidenceRefs,
    candidateCreationAllowed: false,
    sanityMutationAllowed: false,
    publicationEligible: false,
  };
});

assertPinnedFile(
  "research-handoffs/beta-chronology-gap/watchos-point-7-26/independent-review-locks.json",
  "527eaebfab30f2946548a219c579cdd3f7e7f021e2b184c6cac4434d47718e8a",
);
assertPinnedFile(
  watchosPointIndependentReviewLocks.upstreamFreeze.packetLocksPath,
  "73786d76a19e10345235d371d929585ae15c7dece7db0dc4b2b7a72d4506248f",
);
assertPinnedFile(
  watchosPointIndependentReviewLocks.upstreamFreeze
    .rawEvidenceLocksPath,
  watchosPointIndependentReviewLocks.upstreamFreeze
    .rawEvidenceLocksSha256,
);
assertPinnedArtifactSet(
  "watchos-point-7-26",
  "reviewer",
  watchosPointIndependentReviewLocks.locks,
);
assertResearchHandoffManifestEntries(
  "watchos-point-7-26",
  watchosPointPacketLocks,
);
if (
  watchosPointIndependentReviewLocks.upstreamFreeze
    .packetLocksSha256 !==
    "73786d76a19e10345235d371d929585ae15c7dece7db0dc4b2b7a72d4506248f" ||
  watchosPointIndependentReviewLocks.upstreamFreeze
    .allUpstreamLocksReproduced !== true
) {
  throw new Error(
    "The watchOS point reviewer lock does not preserve its trusted upstream freeze.",
  );
}
assertResearchHandoffReviewAuthorization(
  "watchos-point-7-26",
  watchosPointIndependentReview,
  watchosPointIndependentReviewValidation,
);
if (
  Object.keys(watchosPointPacketLocks.locks).length !==
    watchosPointIndependentReview.lockedFileVerification
      .authoritativeLockCount ||
  watchosPointRawEvidenceLocks.locks.length !==
    watchosPointIndependentReview.lockedFileVerification
      .rawLockCount
) {
  throw new Error(
    "The watchOS point final review does not reconcile to its frozen packet and raw-evidence lock counts.",
  );
}
const approvedWatchosPointIds = new Set(
  watchosPointIndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const blockedWatchosPointIds = new Set(
  watchosPointIndependentReview.candidateDisposition
    .blockedCandidateIds,
);
assertCandidatePartition(
  "watchos-point-7-26 researched identities",
  watchosPointResearchedIdentities.identities,
  [approvedWatchosPointIds, blockedWatchosPointIds],
);
const watchosPointPacketCandidateIds = new Set(
  watchosPoint.candidates.map((candidate) => candidate.candidateId),
);
const blockedWatchosPointPacketCandidateIds = new Set(
  [...blockedWatchosPointIds].filter((candidateId) =>
    watchosPointPacketCandidateIds.has(candidateId),
  ),
);
assertCandidatePartition(
  "watchos-point-7-26 candidate records",
  watchosPoint.candidates,
  [approvedWatchosPointIds, blockedWatchosPointPacketCandidateIds],
);
assertSameIdSet(
  "watchos-point-7-26",
  "review-approved",
  approvedWatchosPointIds,
  "validation-approved",
  watchosPointIndependentReviewValidation.finalPartition
    .chronologyApprovedCandidateIds,
);
assertSameIdSet(
  "watchos-point-7-26",
  "review-blocked",
  blockedWatchosPointIds,
  "validation-blocked",
  watchosPointIndependentReviewValidation.finalPartition
    .blockedCandidateIds,
);
assertSameIdSet(
  "watchos-point-7-26",
  "review-approved",
  approvedWatchosPointIds,
  "authorized chronology scope",
  watchosPointIndependentReview.authorization
    .researchHandoffAggregationScope.chronologyCandidateIds,
);
assertSameIdSet(
  "watchos-point-7-26",
  "review-blocked",
  blockedWatchosPointIds,
  "authorized blocked exclusions",
  watchosPointIndependentReview.authorization
    .researchHandoffAggregationScope.blockedCandidateIdsExcluded,
);
const watchosPointCandidateById = new Map(
  watchosPoint.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const watchosPointResearchedIdentityById = new Map(
  watchosPointResearchedIdentities.identities.map((identity) => [
    identity.candidateId,
    identity,
  ]),
);
const watchosPointNoPositiveApplicabilityRecords =
  watchosPointIndependentReview.sequenceReviews
    .filter(
      (review) =>
        review.disposition ===
        "applicableNoPositiveButReversible",
    )
    .map((review) => ({
      releaseVersionId: review.releaseVersionId,
      platform: "watchOS",
      version: review.version,
      findingId: `applicability:watchos:${review.version}:public-beta`,
      result: "auditedNoPositiveButReversible",
      packetPath: "watchos-point-7-26/full-sequence-audit.json",
      reviewArtifactPath:
        "watchos-point-7-26/independent-review.json",
      qualification: review.finding,
      approvedCandidateIds: review.approvedCandidateIds,
      blockedCandidateIds: review.blockedCandidateIds,
      reversibleNotProposedFindingIds:
        review.reversibleNotProposedFindingIds,
      reversalEvidence:
        "Reopen when two independent contemporary lineages or stronger first-party evidence establish an exact watchOS public-program ordinal and Pacific appearance date.",
      candidateCreationAllowed: false,
      sanityMutationAllowed: false,
      publicationEligible: false,
    }));
const watchosPointSequenceReviewByVersion = new Map(
  watchosPointIndependentReview.sequenceReviews.map((review) => [
    review.version,
    review,
  ]),
);
assertSameIdSet(
  "watchos-point-7-26",
  "reviewed no-positive versions",
  watchosPointNoPositiveApplicabilityRecords.map(
    (record) => record.version,
  ),
  "applicability disposition",
  watchosPointIndependentReview.applicabilityDisposition
    .noPositiveButReversibleVersions,
);
const reviewedWatchosReversiblePublicBetaIdentityRecords =
  watchosPointIndependentReview.notProposedReviews.map((review) => {
    const sequenceReview = watchosPointSequenceReviewByVersion.get(
      review.version,
    );
    if (!sequenceReview) {
      throw new Error(
        `${review.findingId} lacks its watchOS sequence review.`,
      );
    }
    return {
      recordId: review.findingId,
      releaseVersionId: sequenceReview.releaseVersionId,
      platform: "watchOS",
      version: review.version,
      apparentIdentity: {
        label: `Public Beta ${review.publicOrdinal}`,
        routeAlias: `public-beta-${review.publicOrdinal}`,
        channel: "publicBeta",
        appearanceDate: review.appearanceDate,
        sequence: review.publicOrdinal,
      },
      result: "auditedNoPositiveButReversible",
      packetClassification: review.packetClassification,
      reasonCode: review.reasonCode,
      finding: review.finding,
      sourceRefs: review.sourceIds.map((sourceId) => ({
        kind: "packetSource",
        packetPath:
          "research-handoffs/beta-chronology-gap/watchos-point-7-26/sources.json",
        sourceId,
      })),
      packetPath: "watchos-point-7-26/full-sequence-audit.json",
      reviewArtifactPath:
        "watchos-point-7-26/independent-review.json",
      candidateCreationAllowed: false,
      sanityMutationAllowed: false,
      publicationEligible: false,
    };
  });
assertSameIdSet(
  "watchos-point-7-26",
  "reviewed reversible identities",
  reviewedWatchosReversiblePublicBetaIdentityRecords.map(
    (record) => record.recordId,
  ),
  "authorized reversible identity scope",
  watchosPointIndependentReview.authorization
    .researchHandoffAggregationScope.reversibleNotProposedFindingIds,
);
const reviewedWatchosBlockedPublicBetaIdentityRecords =
  watchosPointIndependentReview.candidateReviews
    .filter((review) => review.disposition === "blocked")
    .map((review) => {
      const packetCandidate =
        watchosPointCandidateById.get(review.candidateId) ?? null;
      const researchedIdentity = watchosPointResearchedIdentityById.get(
        review.candidateId,
      );
      if (!researchedIdentity) {
        throw new Error(
          `${review.candidateId} lacks its reviewed watchOS researched identity.`,
        );
      }
      const candidateKey = [
        "watchOS",
        review.version,
        "publicBeta",
        review.publicOrdinal,
        review.appearanceDate,
      ].join("|");
      return {
        candidateId: review.candidateId,
        releaseVersionId: review.releaseVersionId,
        platform: review.platform,
        version: review.version,
        proposedIdentity: {
          label: review.label,
          routeAlias: review.routeAlias,
          channel: review.channel,
          appearanceDate: review.appearanceDate,
          sequence: review.publicOrdinal,
        },
        result: "needsAdditionalEvidence",
        recordKind: packetCandidate
          ? "candidateRecord"
          : "preblockedResearchedIdentity",
        reasonCodes: review.reasonCodes,
        finding: review.finding,
        packetEvidenceSourceIds: review.packetEvidenceSourceIds,
        additionalFrozenEvidenceSourceIds:
          review.additionalFrozenEvidenceSourceIds,
        acceptedEvidenceRefs: review.acceptedEvidenceRefs,
        selectedEvidenceRefs: review.selectedEvidenceRefs,
        excludedEvidenceRefs: review.excludedEvidenceRefs,
        additionalQualifications: review.additionalQualifications,
        packetBlockers: researchedIdentity.blockers,
        conflictFindings: [
          ...watchosPointIndependentReview.conflictReviews.filter(
            (conflict) => conflict.candidateKey === candidateKey,
          ),
          ...watchosPointIndependentReview.additionalConflictFindings.filter(
            (conflict) =>
              conflict.candidateId === review.candidateId,
          ),
        ],
        packetPath: packetCandidate
          ? "watchos-point-7-26/candidates.json"
          : "watchos-point-7-26/researched-identities.json",
        reviewArtifactPath:
          "watchos-point-7-26/independent-review.json",
        candidateCreationAllowed: false,
        sanityMutationAllowed: false,
        publicationEligible: false,
      };
    });
assertSameIdSet(
  "watchos-point-7-26",
  "blocked identity ledger",
  reviewedWatchosBlockedPublicBetaIdentityRecords.map(
    (record) => record.candidateId,
  ),
  "review-blocked",
  blockedWatchosPointIds,
);

const tvosPointFinalPins = {
  "research-handoffs/beta-chronology-gap/tvos-point-11-26/independent-review.json":
    "25a8c92c5180d751bdeb540843341647466531973e2bcda32476e31efa2ad023",
  "research-handoffs/beta-chronology-gap/tvos-point-11-26/independent-review-query.ts":
    "0cb831c301a2674ce0e9d52013f4cd017fd8e2c8fea6fb73f32ceda625f35228",
  "research-handoffs/beta-chronology-gap/tvos-point-11-26/independent-review-production-snapshot.json":
    "0113b4d61e9a9d10d28e335df87302faa9c99563002db6f4d2429c4170417933",
  "research-handoffs/beta-chronology-gap/tvos-point-11-26/independent-review-validation.json":
    "9718e38610706a73231a1e5b2318715751bac86eb0a6358e4a437a882b2dcab3",
  "research-handoffs/beta-chronology-gap/tvos-point-11-26/independent-review-integrity.json":
    "5fc45ed7c893cdc7bc7d7cd0332981583f8d456bb634afcb7a5367c9f986d855",
};
for (const [filePath, expectedSha256] of Object.entries(
  tvosPointFinalPins,
)) {
  assertPinnedFile(filePath, expectedSha256);
}
assertPinnedArtifactSet(
  "tvos-point-11-26",
  "frozen-core",
  tvosPointIndependentReviewIntegrity.frozenCorePins,
);
assertPinnedArtifactSet(
  "tvos-point-11-26",
  "reviewer",
  tvosPointIndependentReviewIntegrity.reviewerArtifactPins,
);
assertPinnedArtifactSet(
  "tvos-point-11-26",
  "packet-lock manifest",
  {
    packetLocks: {
      path:
        tvosPointIndependentReviewIntegrity
          .packetFreezeVerification.lockManifestPath,
      bytes:
        tvosPointIndependentReviewIntegrity
          .packetFreezeVerification.lockManifestBytes,
      sha256:
        tvosPointIndependentReviewIntegrity
          .packetFreezeVerification.lockManifestSha256,
    },
  },
);
assertResearchHandoffManifestEntries(
  "tvos-point-11-26",
  tvosPointPacketLocks,
);
assertResearchHandoffReviewAuthorization(
  "tvos-point-11-26",
  tvosPointIndependentReview,
  tvosPointIndependentReviewValidation,
);
assertResearchHandoffIntegrity(
  "tvos-point-11-26",
  tvosPointIndependentReviewIntegrity,
);
if (
  Object.keys(tvosPointPacketLocks.locks).length !==
    tvosPointIndependentReview.lockedFileVerification
      .packetLockCountVerified ||
  tvosPointRawEvidenceLocks.locks.length !==
    tvosPointIndependentReview.lockedFileVerification
      .rawEvidenceVerifiedCount ||
  tvosPointIndependentReviewValidation.frozenEvidence
    .failureCount !== 0 ||
  tvosPointIndependentReviewIntegrity.packetFreezeVerification
    .sha256FailureCount !== 0 ||
  tvosPointIndependentReviewIntegrity.rawAndSelectedEvidenceVerification
    .failureCount !== 0
) {
  throw new Error(
    "The tvOS point final review does not reconcile to its frozen packet and evidence locks.",
  );
}
const approvedTvosPointIds = new Set(
  tvosPointIndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const newlyBlockedTvosPointAssignments =
  tvosPointIndependentReview.blockedAdjudication.newlyBlockedGroups
    .flatMap((group) => group.candidateIds);
const preblockedTvosPointAssignments =
  tvosPointIndependentReview.blockedAdjudication.preblockedGroups
    .flatMap((group) => group.candidateIds);
const newlyBlockedTvosPointIds = new Set(
  newlyBlockedTvosPointAssignments,
);
const preblockedTvosPointIds = new Set(
  preblockedTvosPointAssignments,
);
const blockedTvosPointIds = new Set([
  ...newlyBlockedTvosPointIds,
  ...preblockedTvosPointIds,
]);
const tvosPointCandidateIdForNotProposed = (record) =>
  record.recordId.replace("not-proposed:", "candidate:");
const tvosPointPreblockedResearchIdentities =
  tvosPoint.notProposed.map((record) => ({
    ...record,
    candidateId: tvosPointCandidateIdForNotProposed(record),
  }));
assertCandidatePartition(
  "tvos-point-11-26 candidate records",
  tvosPoint.candidates,
  [approvedTvosPointIds, newlyBlockedTvosPointIds],
);
assertCandidatePartition(
  "tvos-point-11-26 researched identities",
  [
    ...tvosPoint.candidates,
    ...tvosPointPreblockedResearchIdentities,
  ],
  [approvedTvosPointIds, blockedTvosPointIds],
);
assertSameIdSet(
  "tvos-point-11-26",
  "review-approved",
  approvedTvosPointIds,
  "authorized chronology scope",
  tvosPointIndependentReview.authorization
    .researchHandoffAggregationScope.chronologyCandidateIds,
);
if (
  newlyBlockedTvosPointAssignments.length !==
    newlyBlockedTvosPointIds.size ||
  preblockedTvosPointAssignments.length !==
    preblockedTvosPointIds.size ||
  approvedTvosPointIds.size !==
    tvosPointIndependentReviewValidation.partition
      .approvedCandidateCount ||
  newlyBlockedTvosPointIds.size !==
    tvosPointIndependentReviewValidation.partition
      .newlyBlockedCandidateCount ||
  preblockedTvosPointIds.size !==
    tvosPointIndependentReviewValidation.partition
      .preblockedCandidateCount ||
  blockedTvosPointIds.size !==
    tvosPointIndependentReviewValidation.partition
      .blockedCandidateCount
) {
  throw new Error(
    "The tvOS point review and final validation candidate partitions differ.",
  );
}
const tvosPointCandidateById = new Map(
  tvosPoint.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const tvosPointPreblockedById = new Map(
  tvosPointPreblockedResearchIdentities.map((record) => [
    record.candidateId,
    record,
  ]),
);
const tvosPointBlockedGroupById = new Map(
  [
    ...tvosPointIndependentReview.blockedAdjudication
      .newlyBlockedGroups,
    ...tvosPointIndependentReview.blockedAdjudication
      .preblockedGroups,
  ].flatMap((group) =>
    group.candidateIds.map((candidateId) => [candidateId, group]),
  ),
);
if (tvosPointBlockedGroupById.size !== blockedTvosPointIds.size) {
  throw new Error(
    "The tvOS point blocked adjudication assigns an identity more than once or omits one.",
  );
}
const tvosPointApplicabilityAuditByVersionId = new Map(
  tvosPointApplicabilityAudit.rows.map((row) => [
    row.releaseVersionId,
    row,
  ]),
);
const tvosPointNoPositiveApplicabilityRecords =
  tvosPointIndependentReview.applicabilityDisposition
    .publicBetaApplicableNoPositiveButReversibleVersionIds.map(
      (releaseVersionId) => {
        const audit =
          tvosPointApplicabilityAuditByVersionId.get(
            releaseVersionId,
          );
        if (!audit) {
          throw new Error(
            `${releaseVersionId} lacks its reviewed tvOS applicability row.`,
          );
        }
        return {
          releaseVersionId,
          platform: audit.platform,
          version: audit.version,
          findingId: `applicability:tvos:${audit.version}:public-beta`,
          result: "auditedNoPositiveButReversible",
          packetPath:
            "tvos-point-11-26/applicability-audit.json",
          reviewArtifactPath:
            "tvos-point-11-26/independent-review.json",
          qualification:
            "The parent remains inside the tvOS public-beta program boundary, but independent review approved no exact appearance under the strict two-lineage gate. This remains reversible and is not a historical absence finding.",
          packetConclusion: audit.conclusion,
          blockedAppearanceCount: audit.blockedCount,
          negativeFindingIds: audit.negativeFindingIds,
          reversalEvidence:
            "Reopen when two independent contemporary publisher lineages or stronger first-party evidence establish an exact tvOS public-program ordinal and America/Los_Angeles appearance date.",
          candidateCreationAllowed: false,
          sanityMutationAllowed: false,
          publicationEligible: false,
        };
      },
    );
const tvosPointNegativeFindingById = new Map(
  tvosPointNegativeFindings.findings.map((finding) => [
    finding.findingId,
    finding,
  ]),
);
if (
  tvosPointNegativeFindingById.size !==
    tvosPointNegativeFindings.findings.length ||
  tvosPointNegativeFindingById.size !== 15
) {
  throw new Error(
    "The tvOS point negative-finding ledger is not the exact 15-record immutable set.",
  );
}
const reviewedReversiblePublicBetaFindingRecords =
  tvosPointIndependentReview.notProposedFindingAdjudication
    .reversibleFindingIds.map((findingId) => {
      const finding = tvosPointNegativeFindingById.get(findingId);
      const audit = finding
        ? tvosPointApplicabilityAudit.rows.find(
            (row) => row.version === finding.version,
          )
        : null;
      if (!finding || !audit) {
        throw new Error(
          `${findingId} lacks its frozen tvOS negative-finding or applicability record.`,
        );
      }
      return {
        recordId: finding.findingId,
        releaseVersionId: audit.releaseVersionId,
        platform: "tvOS",
        version: finding.version,
        label: finding.label,
        result: "auditedNoPositiveButReversible",
        reasonCode:
          tvosPointIndependentReview
            .notProposedFindingAdjudication.reasonCode,
        finding: finding.finding,
        effect: finding.effect,
        sourceRefs: finding.sourceIds.map((sourceId) => ({
          kind: "packetSource",
          packetPath:
            "research-handoffs/beta-chronology-gap/tvos-point-11-26/sources.json",
          sourceId,
        })),
        packetPath: "tvos-point-11-26/negative-findings.json",
        reviewArtifactPath:
          "tvos-point-11-26/independent-review.json",
        candidateCreationAllowed: false,
        historicalNoPublicBetaConclusionAllowed: false,
        sanityMutationAllowed: false,
        publicationEligible: false,
      };
    });
assertSameIdSet(
  "tvos-point-11-26",
  "reviewed reversible findings",
  reviewedReversiblePublicBetaFindingRecords.map(
    (record) => record.recordId,
  ),
  "authorized reversible finding scope",
  tvosPointIndependentReview.authorization
    .researchHandoffAggregationScope.reversibleNotProposedFindingIds,
);
const reviewedTvosBlockedPublicBetaIdentityRecords = [
  ...blockedTvosPointIds,
].map((candidateId) => {
  const packetCandidate =
    tvosPointCandidateById.get(candidateId) ?? null;
  const preblockedRecord =
    tvosPointPreblockedById.get(candidateId) ?? null;
  const packetRecord = packetCandidate ?? preblockedRecord;
  const blockedGroup = tvosPointBlockedGroupById.get(candidateId);
  if (!packetRecord || !blockedGroup) {
    throw new Error(
      `${candidateId} lacks its tvOS blocked packet record or review group.`,
    );
  }
  const applicabilityAudit =
    tvosPointApplicabilityAuditByVersionId.get(
      packetRecord.releaseVersionId,
    );
  if (!applicabilityAudit) {
    throw new Error(
      `${candidateId} lacks its tvOS applicability parent.`,
    );
  }
  const proposedIdentity =
    packetRecord.proposedIdentity ?? packetRecord.apparentIdentity;
  return {
    candidateId,
    releaseVersionId: packetRecord.releaseVersionId,
    platform: packetRecord.platform,
    version: packetRecord.version ?? applicabilityAudit.version,
    proposedIdentity,
    result: "needsAdditionalEvidence",
    recordKind: packetCandidate
      ? "candidateRecord"
      : "preblockedResearchedIdentity",
    reasonCodes: [blockedGroup.reasonCode],
    finding:
      blockedGroup.qualification ??
      preblockedRecord?.reason ??
      "Independent review did not find two exact independent publisher lineages for every required identity field.",
    evidenceRefs: packetRecord.evidenceRefs,
    packetBlockers:
      preblockedRecord?.reason ??
      blockedGroup.qualification ??
      null,
    conflictFindings: [
      ...tvosPointIndependentReview.packetConflictReviews.filter(
        (conflict) => conflict.candidateId === candidateId,
      ),
      ...tvosPointIndependentReview.additionalConflictFindings.filter(
        (conflict) => conflict.candidateId === candidateId,
      ),
    ],
    packetPath: "tvos-point-11-26/candidates.json",
    reviewArtifactPath:
      "tvos-point-11-26/independent-review.json",
    candidateCreationAllowed: false,
    sanityMutationAllowed: false,
    publicationEligible: false,
  };
});
assertSameIdSet(
  "tvos-point-11-26",
  "blocked identity ledger",
  reviewedTvosBlockedPublicBetaIdentityRecords.map(
    (record) => record.candidateId,
  ),
  "review-blocked",
  blockedTvosPointIds,
);
const reviewedReversiblePublicBetaIdentityRecords = [
  ...reviewedWatchosReversiblePublicBetaIdentityRecords,
];
const reviewedBlockedPublicBetaIdentityRecords = [
  ...reviewedWatchosBlockedPublicBetaIdentityRecords,
  ...reviewedTvosBlockedPublicBetaIdentityRecords,
];
const auditedNoPositivePublicBetaApplicabilityRecords =
  iosIpadosPoint15To18IndependentReview.fullVersionApplicabilityReviews
    .filter(
      (review) =>
        review.adjudication ===
        "auditedNoPositiveButReversible",
    )
    .map((review) => {
      const notProposedReview =
        iosIpadosPoint15To18IndependentReview.notProposedReviews.find(
          (record) =>
            record.releaseVersionId === review.releaseVersionId &&
            record.adjudication ===
              "auditedNoPositiveButReversible",
        );
      const packetRecord = notProposedReview
        ? iosIpadosPoint15To18NotProposedById.get(
            notProposedReview.recordId,
          )
        : null;
      if (!notProposedReview || !packetRecord) {
        throw new Error(
          `${review.releaseVersionId} lacks its reviewed no-positive packet record.`,
        );
      }
      return {
        releaseVersionId: review.releaseVersionId,
        platform: review.platform,
        version: review.version,
        findingId: notProposedReview.recordId,
        result: "auditedNoPositiveButReversible",
        packetPath: "ios-ipados-point-15-18/not-proposed.json",
        reviewArtifactPath:
          "ios-ipados-point-15-18/independent-review.json",
        qualification: notProposedReview.finding,
        reversalEvidence: packetRecord.reversalEvidence,
        candidateCreationAllowed: false,
        sanityMutationAllowed: false,
        publicationEligible: false,
      };
    });
const reviewedExcludedPublicBetaIdentityRecords =
  iosIpadosPoint15To18IndependentReview.notProposedReviews
    .filter(
      (review) =>
        review.adjudication ===
        "evidenceBackedNotApplicable",
    )
    .map((review) => {
      const packetRecord =
        iosIpadosPoint15To18NotProposedById.get(review.recordId);
      if (!packetRecord?.apparentRouteAlias) {
        throw new Error(
          `${review.recordId} lacks its packet-local route identity.`,
        );
      }
      return {
        recordId: review.recordId,
        releaseVersionId: review.releaseVersionId,
        platform: review.platform,
        version: review.version,
        routeAlias: packetRecord.apparentRouteAlias,
        result: "evidenceBackedNotApplicable",
        reasonCode: review.reasonCode,
        finding: review.finding,
        retainedPacketReason: review.retainedPacketReason,
        packetPath: "ios-ipados-point-15-18/not-proposed.json",
        reviewArtifactPath:
          "ios-ipados-point-15-18/independent-review.json",
        candidateCreationAllowed: false,
        sanityMutationAllowed: false,
        publicationEligible: false,
      };
    });
const reviewedPublicBetaApplicabilityRecords = [
  {
    releaseVersionId: "version-ios-14-1",
    platform: "iOS",
    version: "14.1",
    findingId:
      "negative:ios-ipados:14.1:any-public-beta",
    result: "evidenceBackedNotApplicable",
    packetPath:
      "ios-ipados-point-12-14/full-sequence-audit.json",
    reviewArtifactPath:
      "ios-ipados-point-12-14/independent-review.json",
    qualification:
      "Contemporary cycle histories support an RC/final-only cycle with no public-beta program.",
    candidateCreationAllowed: false,
    sanityMutationAllowed: false,
    publicationEligible: false,
  },
  {
    releaseVersionId: "version-ipados-14-1",
    platform: "iPadOS",
    version: "14.1",
    findingId:
      "negative:ios-ipados:14.1:any-public-beta",
    result: "evidenceBackedNotApplicable",
    packetPath:
      "ios-ipados-point-12-14/full-sequence-audit.json",
    reviewArtifactPath:
      "ios-ipados-point-12-14/independent-review.json",
    qualification:
      "Contemporary cycle histories support an RC/final-only cycle with no public-beta program.",
    candidateCreationAllowed: false,
    sanityMutationAllowed: false,
    publicationEligible: false,
  },
  ...auditedNoPositivePublicBetaApplicabilityRecords,
  ...iosPatchReviewedApplicabilityRecords,
  ...watchosPointNoPositiveApplicabilityRecords,
  ...tvosPointNoPositiveApplicabilityRecords,
];
const duplicateReviewedApplicabilityVersionIds =
  reviewedPublicBetaApplicabilityRecords
    .map((record) => record.releaseVersionId)
    .filter(
      (releaseVersionId, index, values) =>
        values.indexOf(releaseVersionId) !== index,
    );
if (duplicateReviewedApplicabilityVersionIds.length > 0) {
  throw new Error(
    `Duplicate reviewed applicability versions: ${[
      ...new Set(duplicateReviewedApplicabilityVersionIds),
    ].join(", ")}`,
  );
}
const reviewedPublicBetaApplicabilityByReleaseVersionId = new Map(
  reviewedPublicBetaApplicabilityRecords.map((record) => [
    record.releaseVersionId,
    record,
  ]),
);
assertCandidatePartition(
  "ios-major-12-18",
  iosMajor12To18.candidates,
  [
    approvedIosMajor12To18Ids,
    blockedIosMajor12To18Ids,
    supersededIosMajor12To18Ids,
  ],
);
assertCandidatePartition(
  "ios-ipados-point-12-14-followup",
  iosIpadosPoint12To14.candidates.filter((candidate) =>
    iosIpadosPoint12To14IndependentReview.candidateDisposition
      .blockedCandidateIds.includes(candidate.candidateId),
  ),
  [
    followupApprovedIosIpadosPoint12To14Ids,
    new Set(
      iosIpadosPoint12To14FollowupIndependentReview
        .candidateDisposition.blockedCandidateIds,
    ),
  ],
);
assertCandidatePartition(
  "ios-ipados-point-12-14",
  iosIpadosPoint12To14.candidates,
  [
    approvedIosIpadosPoint12To14Ids,
    blockedIosIpadosPoint12To14Ids,
  ],
);
assertCandidatePartition(
  "ios-ipados-point-15-18",
  iosIpadosPoint15To18.candidates,
  [
    approvedIosIpadosPoint15To18Ids,
    blockedIosIpadosPoint15To18Ids,
  ],
);
const approvedMacos2014To2019Ids = new Set(
  [
    ...macos2014To2019IndependentReview.candidateVerdict
      .chronologyApproved,
    ...macos2014To2019IndependentReviewFollowup.candidateVerdict
      .chronologyApproved,
  ],
);
const correctionRequiredMacos2014To2019Ids = new Set(
  macos2014To2019IndependentReview.candidateVerdict
    .requiresCandidateCorrection,
);
const approvedMacosMajor11To26Ids = new Set([
  ...macosMajor11To26IndependentReview.candidateVerdict
    .chronologyApproved,
  ...macosMajor11To26IndependentReview.candidateVerdict
    .chronologyApprovedWithQualification,
]);
const blockedMacosMajor11To26Ids = new Set(
  macosMajor11To26IndependentReview.candidateVerdict.blocked,
);
const parentApprovedMacosPoint15To26Ids = new Set(
  macosPoint15To26IndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const followupApprovedMacosPoint15To26Ids = new Set(
  macosPoint15To26FollowupIndependentReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const approvedMacosPoint15To26Ids = new Set([
  ...parentApprovedMacosPoint15To26Ids,
  ...followupApprovedMacosPoint15To26Ids,
]);
const blockedMacosPoint15To26Ids = new Set(
  macosPoint15To26IndependentReview.candidateDisposition
    .blockedCandidateIds.filter(
      (candidateId) =>
        !followupApprovedMacosPoint15To26Ids.has(candidateId),
    ),
);
assertCandidatePartition(
  "macos-point-15-26-followup",
  macosPoint15To26.candidates.filter((candidate) =>
    macosPoint15To26IndependentReview.candidateDisposition
      .blockedCandidateIds.includes(candidate.candidateId),
  ),
  [
    followupApprovedMacosPoint15To26Ids,
    new Set(
      macosPoint15To26FollowupIndependentReview
        .candidateDisposition.blockedCandidateIds,
    ),
  ],
);
assertCandidatePartition(
  "macos-point-15-26",
  macosPoint15To26.candidates,
  [approvedMacosPoint15To26Ids, blockedMacosPoint15To26Ids],
);
const approvedWatchosMajorIds = new Set(
  watchosMajorIndependentReview.candidateVerdict.chronologyApproved,
);
const blockedWatchosMajorIds = new Set(
  watchosMajorIndependentReview.candidateVerdict.blocked,
);
const approvedIpadosMajorCreationIds = new Set(
  [
    ...ipadosMajorIndependentReview.candidateVerdict
      .confirmedMissingCreationCandidates,
    ...ipadosMajorSecondLineageIndependentReview.candidateVerdict
      .chronologyApprovedAfterSupplement,
  ],
);
const correctionIpadosMajorIds = new Set(
  ipadosMajorIndependentReview.candidateVerdict
    .productionIdentityCorrectionRequired,
);
const blockedIpadosMajorIds = new Set(
  ipadosMajorIndependentReview.candidateVerdict.blocked.filter(
    (candidateId) =>
      !approvedIpadosMajorCreationIds.has(candidateId),
  ),
);
const approvedTvosMajorIds = new Set([
  ...tvosMajorIndependentReview.candidateVerdict.approved,
  ...tvosMajorIndependentReview.candidateVerdict.qualified,
]);
const blockedTvosMajorIds = new Set(
  tvosMajorIndependentReview.candidateVerdict.blocked,
);
const approvedDeveloperGapPriorityIds = new Set(
  developerGapPriorityIndependentReview.candidateVerdict
    .chronologyApproved,
);
const blockedDeveloperGapPriorityIds = new Set(
  developerGapPriorityIndependentReview.candidateVerdict.blocked,
);
const supersededCandidateRecords = iosMajor12To18.candidates
  .filter((candidate) =>
    supersededIosMajor12To18Ids.has(candidate.candidateId),
  )
  .map((candidate) => {
    const replacement =
      iosMajor12To18FollowupCandidates.candidates.find(
        (followupCandidate) =>
          followupCandidate.supersedesCandidateId ===
          candidate.candidateId,
      );
    return {
      candidateId: candidate.candidateId,
      packet: "ios-major-12-18/candidates.json",
      releaseVersionId: candidate.releaseVersionId,
      platform: candidate.platform,
      version: candidate.version,
      supersededIdentity: candidate.proposedIdentity,
      replacementCandidateId: replacement?.candidateId ?? null,
      disposition:
        "Excluded from active candidate totals and every creation handoff because independent review corrected the displayed public-beta identity.",
    };
  });

const candidateRecords = [
  ...foundation.candidates.map((candidate) => ({
    candidate,
    packet: "candidate-register.json",
    reviewState:
      candidate.candidateStatus === "readyForChronologyReview"
        ? "readyForChronologyReview"
        : "needsAdditionalEvidence",
  })),
  ...ios9Point.candidates.map((candidate) => ({
    candidate,
    packet: "ios9-point/candidates.json",
    reviewState: readyIos9PointIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : secondLineageIos9PointIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...ios9And10Major.candidates.map((candidate) => ({
    candidate,
    packet: "ios9-10-major/candidates.json",
    reviewState: approvedIos9And10MajorIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : "reviewStateUnresolved",
  })),
  ...ios10PointPublic.candidates.map((parentCandidate) => {
    const candidate =
      ios10PointPublicFollowupById.get(parentCandidate.candidateId) ??
      parentCandidate;
    return {
      candidate,
      packet: approvedIos10PointPublicFollowupIds.has(
        candidate.candidateId,
      )
        ? "ios10-point-public-followup/candidates.json"
        : "ios10-point-public/candidates.json",
      reviewState: approvedIos10PointPublicIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedIos10PointPublicIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
    };
  }),
  ...mobile26Public.candidates.map((candidate) => ({
    candidate,
    packet: "mobile26-public/candidates.json",
    reviewState: approvedMobile26PublicIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedMobile26PublicIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...iosMajor12To18.candidates
    .filter(
      (candidate) =>
        !supersededIosMajor12To18Ids.has(candidate.candidateId),
    )
    .map((candidate) => ({
      candidate,
      packet: "ios-major-12-18/candidates.json",
      reviewState: approvedIosMajor12To18Ids.has(candidate.candidateId)
        ? "readyForChronologyReview"
        : blockedIosMajor12To18Ids.has(candidate.candidateId)
          ? "needsAdditionalEvidence"
          : "reviewStateUnresolved",
    })),
  ...iosMajor12To18FollowupCandidates.candidates.map((candidate) => ({
    candidate,
    packet: "ios-major-12-18-followup/reviewed-candidates.json",
    reviewState:
      candidate.candidateStatus === "readyForChronologyReview"
        ? "readyForChronologyReview"
        : candidate.candidateStatus ===
            "identityCorrectionPendingSeparateAuthorization"
          ? "identityCorrectionPendingSeparateAuthorization"
          : "reviewStateUnresolved",
  })),
  ...iosIpadosPoint12To14.candidates.map((candidate) => ({
    candidate,
    packet: "ios-ipados-point-12-14/candidates.json",
    reviewState: approvedIosIpadosPoint12To14Ids.has(
      candidate.candidateId,
    )
      ? "readyForChronologyReview"
      : blockedIosIpadosPoint12To14Ids.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...iosIpadosPoint15To18.candidates.map((candidate) => ({
    candidate,
    packet: "ios-ipados-point-15-18/candidates.json",
    reviewState: approvedIosIpadosPoint15To18Ids.has(
      candidate.candidateId,
    )
      ? "readyForChronologyReview"
      : blockedIosIpadosPoint15To18Ids.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...iosPatchApplicability.candidates.map((candidate) => ({
    candidate,
    packet: "ios-patch-applicability/candidates.json",
    reviewState: approvedIosPatchApplicabilityIds.has(
      candidate.candidateId,
    )
      ? "readyForChronologyReview"
      : blockedIosPatchApplicabilityIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...macos2014To2019.candidates.map((candidate) => ({
    candidate,
    packet: "macos-2014-2019/candidates.json",
    reviewState: approvedMacos2014To2019Ids.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : correctionRequiredMacos2014To2019Ids.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : candidate.evidenceState === "corroborated" &&
            candidate.identityStatus === "confirmed"
          ? "corroboratedPendingIndependentReview"
          : "needsAdditionalEvidence",
  })),
  ...macosMajor11To26.candidates.map((candidate) => ({
    candidate,
    packet: "macos-major-11-26/candidates.json",
    reviewState: approvedMacosMajor11To26Ids.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedMacosMajor11To26Ids.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...macosPoint15To26.candidates.map((candidate) => ({
    candidate,
    packet: "macos-point-15-26/candidates.json",
    reviewState: approvedMacosPoint15To26Ids.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedMacosPoint15To26Ids.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...ipadosMajor.candidates.map((candidate) => ({
    candidate,
    packet: "ipados-major-13-26/candidates.json",
    reviewState: approvedIpadosMajorCreationIds.has(
      candidate.candidateId,
    )
      ? "readyForChronologyReview"
      : correctionIpadosMajorIds.has(candidate.candidateId)
        ? "identityCorrectionPendingSeparateAuthorization"
        : blockedIpadosMajorIds.has(candidate.candidateId)
          ? "needsAdditionalEvidence"
          : "reviewStateUnresolved",
  })),
  ...watchosMajor.candidates.map((candidate) => ({
    candidate,
    packet: "watchos-major-7-26/candidates.json",
    reviewState: approvedWatchosMajorIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedWatchosMajorIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : candidate.reviewDisposition ===
            "readyForIndependentChronologyReview"
          ? "corroboratedPendingIndependentReview"
          : "needsAdditionalEvidence",
  })),
  ...watchosPoint.candidates.map((candidate) => ({
    candidate,
    packet: "watchos-point-7-26/candidates.json",
    reviewState: approvedWatchosPointIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedWatchosPointIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...tvosMajor.candidates.map((candidate) => ({
    candidate,
    packet: "tvos-major-11-26/candidates.json",
    reviewState: approvedTvosMajorIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : blockedTvosMajorIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
  ...tvosPoint.candidates.map((candidate) => ({
    candidate,
    packet: "tvos-point-11-26/candidates.json",
    reviewState: approvedTvosPointIds.has(candidate.candidateId)
      ? "readyForChronologyReview"
      : newlyBlockedTvosPointIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  })),
];
const developerCandidateRecords =
  developerGapPriority.candidates.map((candidate) => ({
    candidate,
    packet: "developer-gap-priority/candidates.json",
    reviewState: approvedDeveloperGapPriorityIds.has(
      candidate.candidateId,
    )
      ? "readyForChronologyReview"
      : blockedDeveloperGapPriorityIds.has(candidate.candidateId)
        ? "needsAdditionalEvidence"
        : "reviewStateUnresolved",
  }));
const allCandidateRecords = [
  ...candidateRecords,
  ...developerCandidateRecords,
];

const duplicateCandidateIds = allCandidateRecords
  .map(({candidate}) => candidate.candidateId)
  .filter(
    (candidateId, index, values) =>
      values.indexOf(candidateId) !== index,
  );
if (duplicateCandidateIds.length > 0) {
  throw new Error(
    `Duplicate candidate IDs: ${[...new Set(duplicateCandidateIds)].join(", ")}`,
  );
}
const candidateIdentityKeys = allCandidateRecords.map(({candidate}) =>
  [
    candidate.releaseVersionId,
    candidate.proposedIdentity.channel,
    candidate.proposedIdentity.routeAlias,
  ].join("\u0000"),
);
const duplicateCandidateIdentityKeys = candidateIdentityKeys.filter(
  (identityKey, index, values) =>
    values.indexOf(identityKey) !== index,
);
if (duplicateCandidateIdentityKeys.length > 0) {
  throw new Error(
    `Duplicate candidate identities: ${[
      ...new Set(duplicateCandidateIdentityKeys),
    ].join(", ")}`,
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
const productionOverlaps = candidateIdentityKeys.filter((identityKey) =>
  productionIdentityKeys.has(identityKey),
);
if (productionOverlaps.length > 0) {
  throw new Error(
    `Candidate identities already exist in production: ${[
      ...new Set(productionOverlaps),
    ].join(", ")}`,
  );
}
const unsafeCandidates = allCandidateRecords
  .filter(
    ({candidate}) =>
      candidate.flags?.sanityMutationAllowed !== false ||
      candidate.flags?.publicationEligible !== false,
  )
  .map(({candidate}) => candidate.candidateId);
if (unsafeCandidates.length > 0) {
  throw new Error(
    `Candidate safety flags are not false: ${unsafeCandidates.join(", ")}`,
  );
}

const candidatesByVersion = Map.groupBy(
  candidateRecords,
  ({candidate}) => candidate.releaseVersionId,
);
const developerCandidatesByVersion = Map.groupBy(
  developerCandidateRecords,
  ({candidate}) => candidate.releaseVersionId,
);
const eligibleVersions = inventory.versions.filter((version) => {
  const boundary = boundaries[version.platform];
  return (
    boundary &&
    compareVersions(version.version, boundary.minimumVersion) >= 0
  );
});

const rows = eligibleVersions.map((version) => {
  const productionPublicBetaEvents = version.events.filter(
    (event) => event.channel === "publicBeta",
  );
  const packetCandidates = candidatesByVersion.get(version._id) ?? [];
  const reviewedApplicability =
    reviewedPublicBetaApplicabilityByReleaseVersionId.get(
      version._id,
    ) ?? null;
  const reviewedReversibleIdentities =
    reviewedReversiblePublicBetaIdentityRecords.filter(
      (record) => record.releaseVersionId === version._id,
    );
  const reviewedBlockedIdentities =
    reviewedBlockedPublicBetaIdentityRecords.filter(
      (record) => record.releaseVersionId === version._id,
    );
  const reviewedReversibleFindings =
    reviewedReversiblePublicBetaFindingRecords.filter(
      (record) => record.releaseVersionId === version._id,
    );
  const eventCounts = Object.fromEntries(
    [...Map.groupBy(version.events, (event) => event.channel)].map(
      ([channel, events]) => [channel, events.length],
    ),
  );

  let researchState = "notYetAuditedForPublicBetaApplicability";
  const readyCandidateCount = packetCandidates.filter(
    ({reviewState}) => reviewState === "readyForChronologyReview",
  ).length;
  if (
    reviewedApplicability?.result ===
    "evidenceBackedNotApplicable"
  ) {
    researchState = "evidenceBackedNoPublicBeta";
  } else if (
    reviewedApplicability?.result ===
    "auditedNoPositiveButReversible"
  ) {
    researchState = "auditedNoPositiveButReversible";
  } else if (
    reviewedApplicability?.result ===
    "notEstablishedConflict"
  ) {
    researchState = "notEstablishedConflict";
  } else if (packetCandidates.length > 0) {
    researchState = packetCandidates.every(
      ({reviewState}) => reviewState === "readyForChronologyReview",
    )
      ? "allCurrentCandidatesReadyForChronologyReview"
      : packetCandidates.some(
            ({reviewState}) =>
              reviewState === "readyForChronologyReview",
          )
        ? "mixedCandidateReviewState"
        : "candidatePacketOpen";
  } else if (productionPublicBetaEvents.length > 0) {
    researchState = "productionSampleNeedsFullSequenceAudit";
  }

  return {
    platform: version.platform,
    platformId: version.platformId,
    version: version.version,
    releaseVersionId: version._id,
    releaseStatus: version.releaseStatus,
    publicReleaseDate: version.publicReleaseDate,
    publicEligibilityBoundary: boundaries[version.platform].minimumVersion,
    eventCounts,
    productionPublicBetaEvents: productionPublicBetaEvents.map((event) => ({
      label: event.label,
      routeAlias: event.routeAlias,
      appearanceDate: event.appearanceDate,
      sequence: event.sequence,
    })),
    candidateCount: packetCandidates.length,
    candidates: packetCandidates.map(({candidate, packet, reviewState}) => ({
      candidateId: candidate.candidateId,
      routeAlias: candidate.proposedIdentity.routeAlias,
      appearanceDate: candidate.proposedIdentity.appearanceDate,
      sequence: candidate.proposedIdentity.sequence,
      reviewState,
      packet,
    })),
    reviewedApplicability,
    reviewedReversibleIdentities,
    reviewedReversibleFindings,
    reviewedBlockedIdentities,
    readyCandidateCount,
    researchState,
  };
});
for (const record of reviewedPublicBetaApplicabilityRecords) {
  const row = rows.find(
    (candidateRow) =>
      candidateRow.releaseVersionId === record.releaseVersionId,
  );
  if (
    !row ||
    row.platform !== record.platform ||
    row.version !== record.version ||
    row.productionPublicBetaEvents.length !== 0 ||
    row.readyCandidateCount !== 0 ||
    (record.result === "evidenceBackedNotApplicable" &&
      row.candidateCount !== 0)
  ) {
    throw new Error(
      `${record.releaseVersionId} is not an eligible zero-production/zero-approved-candidate version that can receive its reviewed applicability finding.`,
    );
  }
}

const developerBetaInventoryByPlatform = Object.fromEntries(
  [
    ...Map.groupBy(
      inventory.versions,
      (version) => version.platform,
    ),
  ].map(([platform, platformVersions]) => {
    const developerBetaEventCount = platformVersions.reduce(
      (total, version) =>
        total +
        version.events.filter(
          (event) => event.channel === "developerBeta",
        ).length,
      0,
    );
    const versionsWithDeveloperBeta = platformVersions.filter((version) =>
      version.events.some(
        (event) => event.channel === "developerBeta",
      ),
    ).length;
    return [
      platform,
      {
        modeledVersionCount: platformVersions.length,
        versionsWithDeveloperBeta,
        versionsWithoutDeveloperBeta:
          platformVersions.length - versionsWithDeveloperBeta,
        developerBetaEventCount,
      },
    ];
  }),
);
const developerBetaEventCount = Object.values(
  developerBetaInventoryByPlatform,
).reduce(
  (total, platform) => total + platform.developerBetaEventCount,
  0,
);
const versionCountWithDeveloperBeta = Object.values(
  developerBetaInventoryByPlatform,
).reduce(
  (total, platform) => total + platform.versionsWithDeveloperBeta,
  0,
);

const byPlatform = Object.fromEntries(
  [...Map.groupBy(rows, (row) => row.platform)].map(
    ([platform, platformRows]) => [
      platform,
      {
        eligibleModeledVersionCount: platformRows.length,
        versionsWithProductionPublicBeta:
          platformRows.filter(
            (row) => row.productionPublicBetaEvents.length > 0,
          ).length,
        productionPublicBetaEventCount: platformRows.reduce(
          (total, row) =>
            total + row.productionPublicBetaEvents.length,
          0,
        ),
        versionsWithStructuredCandidates:
          platformRows.filter((row) => row.candidateCount > 0).length,
        versionsWithReviewedNoPublicBeta:
          platformRows.filter(
            (row) =>
              row.reviewedApplicability?.result ===
              "evidenceBackedNotApplicable",
          ).length,
        versionsWithAuditedNoPositiveButReversible:
          platformRows.filter(
            (row) =>
              row.reviewedApplicability?.result ===
              "auditedNoPositiveButReversible",
          ).length,
        versionsWithNotEstablishedConflict:
          platformRows.filter(
            (row) =>
              row.reviewedApplicability?.result ===
              "notEstablishedConflict",
          ).length,
        structuredCandidateCount: platformRows.reduce(
          (total, row) => total + row.candidateCount,
          0,
        ),
        versionsWithNeitherProductionEventNorCandidate:
          platformRows.filter(
            (row) =>
              row.productionPublicBetaEvents.length === 0 &&
              row.candidateCount === 0 &&
              row.reviewedApplicability?.result !==
                "evidenceBackedNotApplicable",
          ).length,
      },
    ],
  ),
);

const readinessCounts = Object.fromEntries(
  [
    ...Map.groupBy(
      candidateRecords,
      ({reviewState}) => reviewState,
    ),
  ].map(([state, candidates]) => [state, candidates.length]),
);
const versionsRepresented = rows.filter(
  (row) =>
    row.productionPublicBetaEvents.length > 0 || row.candidateCount > 0,
);
const representedVersionIds = new Set(
  versionsRepresented.map((row) => row.releaseVersionId),
);
const remainingPublicBetaAuditRows = rows
  .filter(
    (row) =>
      row.productionPublicBetaEvents.length === 0 &&
      row.readyCandidateCount === 0 &&
      row.reviewedApplicability?.result !==
        "evidenceBackedNotApplicable" &&
      (row.candidateCount === 0 ||
        [
          "auditedNoPositiveButReversible",
          "notEstablishedConflict",
        ].includes(row.reviewedApplicability?.result)),
  )
  .map((row) => {
    const hasDeveloperBetaSequence =
      (row.eventCounts.developerBeta ?? 0) > 0;
    const isMajorOrPointVersion = row.version.split(".").length <= 2;
    return {
      platform: row.platform,
      platformId: row.platformId,
      version: row.version,
      releaseVersionId: row.releaseVersionId,
      publicReleaseDate: row.publicReleaseDate,
      developerBetaEventCount: row.eventCounts.developerBeta ?? 0,
      auditStage:
        row.reviewedApplicability?.result ===
        "auditedNoPositiveButReversible"
          ? "followupAfterAuditedNoPositive"
          : row.reviewedApplicability?.result ===
              "notEstablishedConflict"
            ? "followupAfterNotEstablishedConflict"
          : "initialApplicabilityAndSequenceAudit",
      priorAudit: row.reviewedApplicability,
      auditPriority: hasDeveloperBetaSequence
        ? "highestDeveloperSequenceExists"
        : isMajorOrPointVersion
          ? "highMajorOrPointRelease"
          : "routinePatchApplicabilityCheck",
      caution:
        row.reviewedApplicability?.result ===
        "auditedNoPositiveButReversible"
          ? "Prior research found no exact positive identity meeting the gate, but that is not proof of historical absence; the row remains reversible and open."
          : row.reviewedApplicability?.result ===
              "notEstablishedConflict"
            ? "Prior research found conflicting applicability evidence. The row remains open, and neither event creation nor a historical no-public-beta conclusion is authorized."
          : "This is an audit priority, not proof that a public beta existed.",
    };
  });
const reviewedNoPublicBetaRecords =
  reviewedPublicBetaApplicabilityRecords.filter(
    (record) => record.result === "evidenceBackedNotApplicable",
  );
const auditedNoPositiveButReversibleRecords =
  reviewedPublicBetaApplicabilityRecords.filter(
    (record) =>
      record.result === "auditedNoPositiveButReversible",
  );
const notEstablishedConflictRecords =
  reviewedPublicBetaApplicabilityRecords.filter(
    (record) => record.result === "notEstablishedConflict",
  );
const auditedByProductionCandidateOrNegativeVersionIds = new Set([
  ...representedVersionIds,
  ...reviewedNoPublicBetaRecords.map(
    (record) => record.releaseVersionId,
  ),
]);
const touchedByProductionCandidateOrApplicabilityReviewVersionIds =
  new Set([
    ...representedVersionIds,
    ...reviewedPublicBetaApplicabilityRecords.map(
      (record) => record.releaseVersionId,
    ),
  ]);
const initialPublicBetaAuditRows =
  remainingPublicBetaAuditRows.filter(
    (row) =>
      row.auditStage === "initialApplicabilityAndSequenceAudit",
  );
const remainingPublicBetaAuditPriorityCounts = Object.fromEntries(
  [
    ...Map.groupBy(
      remainingPublicBetaAuditRows,
      (row) => row.auditPriority,
    ),
  ].map(([priority, auditRows]) => [priority, auditRows.length]),
);
const developerBetaAuditRows = inventory.versions
  .filter(
    (version) =>
      !version.events.some(
        (event) => event.channel === "developerBeta",
      ),
  )
  .map((version) => {
    const publicBetaRow = rows.find(
      (row) => row.releaseVersionId === version._id,
    );
    const packetCandidates =
      developerCandidatesByVersion.get(version._id) ?? [];
    const productionPublicBetaEventCount =
      publicBetaRow?.productionPublicBetaEvents.length ?? 0;
    const structuredPublicBetaCandidateCount =
      publicBetaRow?.candidateCount ?? 0;
    const hasPublicBetaEvidence =
      productionPublicBetaEventCount > 0 ||
      structuredPublicBetaCandidateCount > 0;
    const isMajorOrPointVersion = version.version.split(".").length <= 2;

    return {
      platform: version.platform,
      platformId: version.platformId,
      version: version.version,
      releaseVersionId: version._id,
      publicReleaseDate: version.publicReleaseDate,
      releaseStatus: version.releaseStatus,
      productionPublicBetaEventCount,
      structuredPublicBetaCandidateCount,
      structuredDeveloperBetaCandidateCount:
        packetCandidates.length,
      structuredDeveloperBetaCandidates: packetCandidates.map(
        ({candidate, packet, reviewState}) => ({
          candidateId: candidate.candidateId,
          routeAlias: candidate.proposedIdentity.routeAlias,
          appearanceDate:
            candidate.proposedIdentity.appearanceDate,
          sequence: candidate.proposedIdentity.sequence,
          reviewState,
          packet,
        }),
      ),
      auditPriority: hasPublicBetaEvidence
        ? "highestPublicBetaEvidence"
        : isMajorOrPointVersion
          ? "highMajorOrPointRelease"
          : "routinePatchApplicabilityCheck",
      caution:
        "This is an audit signal, not proof that a developer beta existed.",
    };
  });
const remainingDeveloperBetaAuditRows = developerBetaAuditRows.filter(
  (row) =>
    !row.structuredDeveloperBetaCandidates.some(
      (candidate) =>
        candidate.reviewState === "readyForChronologyReview",
    ),
);
const developerBetaAuditPriorityCounts = Object.fromEntries(
  [
    ...Map.groupBy(
      remainingDeveloperBetaAuditRows,
      (row) => row.auditPriority,
    ),
  ].map(([priority, auditRows]) => [priority, auditRows.length]),
);
const developerCandidateReadinessCounts = Object.fromEntries(
  [
    ...Map.groupBy(
      developerCandidateRecords,
      ({reviewState}) => reviewState,
    ),
  ].map(([state, candidates]) => [state, candidates.length]),
);
const developerCandidateVersionCount =
  developerCandidatesByVersion.size;

const matrix = {
  formatVersion: 1,
  programId: "apple-beta-chronology-gap",
  generatedAt: new Date().toISOString(),
  productionSnapshot: {
    queriedAt: inventory.queriedAt,
    releaseVersionCount: inventory.releaseVersionCount,
    releaseEventCount: inventory.releaseEventCount,
    publicBetaEventCount: inventory.publicBetaEventCount,
  },
  scope: {
    modeledPlatformsWithEstablishedPublicPrograms:
      Object.keys(boundaries),
    boundaries,
    visionOS:
      "Excluded from eligible counts because public-beta eligibility remains unresolved.",
    knownParentGaps: [
      {
        platform: "macOS",
        version: "10.9.3",
        expectedReleaseVersionId: "version-macos-10-9-3",
        finding:
          "OS X 10.9.3 is the established recurring-program boundary, but production has no releaseVersion document for it.",
      },
      {
        platform: "iPadOS",
        version: "14.7",
        expectedReleaseVersionId: "version-ipados-14-7",
        finding:
          "Research establishes four public appearances, but production has no releaseVersion parent. Preserve this as a modeling gap; do not create orphan events.",
      },
      {
        platform: "iPadOS",
        version: "14.8",
        expectedReleaseVersionId: "version-ipados-14-8",
        finding:
          "The final release is established but production has no releaseVersion parent. The combined no-beta claim remains evidence-blocked and must not be treated as a closed negative.",
      },
    ],
  },
  summary: {
    eligibleModeledVersionCount: rows.length,
    versionCountWithProductionPublicBeta: rows.filter(
      (row) => row.productionPublicBetaEvents.length > 0,
    ).length,
    productionPublicBetaEventCount: inventory.publicBetaEventCount,
    versionCountWithStructuredCandidates: rows.filter(
      (row) => row.candidateCount > 0,
    ).length,
    structuredCandidateCount: candidateRecords.length,
    structuredCandidateReadiness: readinessCounts,
    versionCountRepresentedByProductionOrCandidate:
      versionsRepresented.length,
    versionCountWithReviewedNoPublicBeta:
      reviewedNoPublicBetaRecords.length,
    versionCountAuditedNoPositiveButReversible:
      auditedNoPositiveButReversibleRecords.length,
    versionCountWithNotEstablishedConflict:
      notEstablishedConflictRecords.length,
    versionCountAuditedByProductionCandidateOrNegative:
      auditedByProductionCandidateOrNegativeVersionIds.size,
    versionCountTouchedByProductionCandidateOrApplicabilityReview:
      touchedByProductionCandidateOrApplicabilityReviewVersionIds.size,
    versionCountNotYetAudited:
      initialPublicBetaAuditRows.length,
    versionCountStillNeedingApplicabilityAndSequenceAudit:
      remainingPublicBetaAuditRows.length,
    remainingPublicBetaAuditPriorityCounts,
    developerBetaInventory: {
      developerBetaEventCount,
      versionCountWithDeveloperBeta,
      versionCountWithoutDeveloperBeta:
        inventory.releaseVersionCount - versionCountWithDeveloperBeta,
      structuredCandidateCount:
        developerCandidateRecords.length,
      structuredCandidateReadiness:
        developerCandidateReadinessCounts,
      versionCountWithStructuredCandidates:
        developerCandidateVersionCount,
      versionCountStillNeedingApplicabilityAndSequenceAudit:
        remainingDeveloperBetaAuditRows.length,
      auditPriorityCounts: developerBetaAuditPriorityCounts,
      caution:
        "A version without a developer-beta event may correctly have been an unseeded hotfix. This is an applicability audit queue, not a missing-event count.",
    },
    publicationEligibleCandidateCount: 0,
    caution:
      "A version that has no represented public beta may correctly have had none. The remaining count is an audit queue, not a count of events to create.",
  },
  byPlatform,
  remainingPublicBetaAuditRows,
  reviewedPublicBetaApplicabilityRecords,
  reviewedExcludedPublicBetaIdentityRecords,
  reviewedReversiblePublicBetaIdentityRecords,
  reviewedReversiblePublicBetaFindingRecords,
  reviewedBlockedPublicBetaIdentityRecords,
  developerBetaInventoryByPlatform,
  developerBetaAuditRows,
  remainingDeveloperBetaAuditRows,
  activeUnfrozenResearchWaves: [],
  excludedSupersededCandidates: supersededCandidateRecords,
  integrity: {
    candidateIdsUnique: true,
    candidateIdentityKeysUnique: true,
    exactProductionIdentityOverlapCount: 0,
    unsafeCandidateFlagCount: 0,
    publicBetaStructuredCandidateCount:
      candidateRecords.length,
    developerBetaStructuredCandidateCount:
      developerCandidateRecords.length,
    reviewedExcludedPublicBetaIdentityCount:
      reviewedExcludedPublicBetaIdentityRecords.length,
    reviewedReversiblePublicBetaIdentityCount:
      reviewedReversiblePublicBetaIdentityRecords.length,
    reviewedReversiblePublicBetaFindingCount:
      reviewedReversiblePublicBetaFindingRecords.length,
    reviewedBlockedPublicBetaIdentityCount:
      reviewedBlockedPublicBetaIdentityRecords.length,
  },
  rows,
  safety: {
    productionMutationAllowed: false,
    sanityWriteAllowed: false,
    deploymentAllowed: false,
  },
};

writeFileSync(
  `${outputDirectory}/coverage-matrix.json`,
  `${JSON.stringify(matrix, null, 2)}\n`,
);

const markdown = `# Public-beta research coverage matrix

Generated from the read-only production snapshot at ${inventory.queriedAt}.

## Current counted scope

- ${rows.length} existing release-version documents fall within an established public-beta program boundary.
- Production contains ${inventory.publicBetaEventCount} public-beta events across ${matrix.summary.versionCountWithProductionPublicBeta} versions.
- ${candidateRecords.length} active public-beta identity records are currently structured across ${matrix.summary.versionCountWithStructuredCandidates} versions, including ${readinessCounts.identityCorrectionPendingSeparateAuthorization ?? 0} correction-only records.
- ${supersededCandidateRecords.length} incorrect candidate identities are retained only in the exclusion ledger and cannot enter a creation handoff.
- ${reviewedNoPublicBetaRecords.length} modeled versions have an independently reviewed, evidence-backed finding that no public beta applied.
- ${auditedNoPositiveButReversibleRecords.length} modeled versions were audited without locating an exact positive identity, but remain reversible and open rather than being called historical negatives.
- ${notEstablishedConflictRecords.length} modeled version has conflicting applicability evidence and remains open without either an event-creation or historical-negative conclusion.
- ${reviewedWatchosReversiblePublicBetaIdentityRecords.length} exact watchOS identities remain independently reviewed, reversible no-positive findings.
- ${reviewedWatchosBlockedPublicBetaIdentityRecords.length} exact watchOS researched identities remain reviewer-blocked.
- ${reviewedReversiblePublicBetaFindingRecords.length} tvOS sequence findings remain independently reviewed and reversible; none is a historical negative.
- ${reviewedTvosBlockedPublicBetaIdentityRecords.length} exact tvOS researched identities remain reviewer-blocked.
- Only packet candidate records contribute to candidate readiness totals; preblocked researched identities remain in the blocked ledgers without inflating candidate counts.
- ${initialPublicBetaAuditRows.length} modeled versions have not yet received their initial applicability and sequence audit.
- ${matrix.summary.versionCountStillNeedingApplicabilityAndSequenceAudit} modeled versions remain open across the initial and follow-up audit queues.
- Those open counts are research queues, not claims that every version had a public beta.
- Zero candidates are publication-authorized.

| Remaining public-beta audit priority | Versions |
| --- | ---: |
${[
  "highestDeveloperSequenceExists",
  "highMajorOrPointRelease",
  "routinePatchApplicabilityCheck",
]
  .map(
    (priority) =>
      `| ${priority} | ${remainingPublicBetaAuditPriorityCounts[priority] ?? 0} |`,
  )
  .join("\n")}

## Structured candidate readiness

| State | Candidates |
| --- | ---: |
${Object.entries(readinessCounts)
  .map(([state, count]) => `| ${state} | ${count} |`)
  .join("\n")}

## Developer-beta production inventory

- Production contains ${developerBetaEventCount} developer-beta events across ${versionCountWithDeveloperBeta} of ${inventory.releaseVersionCount} modeled versions.
- ${inventory.releaseVersionCount - versionCountWithDeveloperBeta} versions have no production developer-beta event.
- ${developerCandidateRecords.length} confirmed-missing developer appearances are structured across ${developerCandidateVersionCount} of those versions; ${developerCandidateReadinessCounts.readyForChronologyReview ?? 0} passed independent chronology review.
- ${remainingDeveloperBetaAuditRows.length} versions still require an applicability and sequence audit before anyone calls them gaps.
- Hotfix and emergency releases often correctly have no prerelease seed.
- ${developerBetaAuditPriorityCounts.highestPublicBetaEvidence ?? 0} remaining version${(developerBetaAuditPriorityCounts.highestPublicBetaEvidence ?? 0) === 1 ? "" : "s"} with no developer-beta event already has production or structured public-beta evidence and therefore receives the highest audit priority.

| Developer candidate readiness | Candidates |
| --- | ---: |
${Object.entries(developerCandidateReadinessCounts)
  .map(([state, count]) => `| ${state} | ${count} |`)
  .join("\n")}

| Platform | Modeled versions | Versions with developer beta | Developer-beta events | Versions without developer beta |
| --- | ---: | ---: | ---: | ---: |
${Object.entries(developerBetaInventoryByPlatform)
  .map(
    ([platform, counts]) =>
      `| ${platform} | ${counts.modeledVersionCount} | ${counts.versionsWithDeveloperBeta} | ${counts.developerBetaEventCount} | ${counts.versionsWithoutDeveloperBeta} |`,
  )
  .join("\n")}

| Developer-beta audit priority | Versions |
| --- | ---: |
${[
  "highestPublicBetaEvidence",
  "highMajorOrPointRelease",
  "routinePatchApplicabilityCheck",
]
  .map(
    (priority) =>
      `| ${priority} | ${developerBetaAuditPriorityCounts[priority] ?? 0} |`,
  )
  .join("\n")}

## Platform inventory

| Platform | Eligible modeled versions | Versions with production PB | Production PB events | Versions with candidates | Candidates | Reviewed no-PB | Audited no-positive, reversible | Not established/conflicted | Open without event/candidate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
${Object.entries(byPlatform)
  .map(
    ([platform, counts]) =>
      `| ${platform} | ${counts.eligibleModeledVersionCount} | ${counts.versionsWithProductionPublicBeta} | ${counts.productionPublicBetaEventCount} | ${counts.versionsWithStructuredCandidates} | ${counts.structuredCandidateCount} | ${counts.versionsWithReviewedNoPublicBeta} | ${counts.versionsWithAuditedNoPositiveButReversible} | ${counts.versionsWithNotEstablishedConflict} | ${counts.versionsWithNeitherProductionEventNorCandidate} |`,
  )
  .join("\n")}

## Important boundaries

- visionOS is outside the eligible count because a public distribution program remains unestablished.
- OS X 10.9.3 is the recurring Mac public-program boundary, but the production corpus has no 10.9.3 release-version parent.
- iPadOS 14.7 and 14.8 also lack production release-version parents. Four researched iPadOS 14.7 public appearances remain model-blocked; the iPadOS 14.8 no-beta claim remains evidence-blocked.
- Existing isolated production events do not prove sequence completeness. For example, a lone Public Beta 3 requires the earlier and later ordinals to be audited.
- Independent review cleared all 27 iOS 9 point-release candidates after the second publisher lineages were captured.
- Independent review cleared all 34 iOS 10 point-release candidates after a two-identity evidence supplement.
- Independent review cleared all 46 active iOS 12–18 major-cycle creation identities after supplemental research. Two incorrect originals are excluded as superseded, and the existing iOS 15 June 30 appearance remains isolated for a separately authorized Public Beta 1-to-2 correction.
- Independent review cleared 113 of 116 iOS/iPadOS 12–14 point-release candidates after the exact-lineage supplement; three ordinal conflicts remain blocked.
- Independent review cleared 106 of 159 iOS/iPadOS 15–18 point-release candidates and blocked 53. Thirty-four no-positive full-version audits remain reversible; four specifically skipped or withdrawn ordinal identities are retained as evidence-backed do-not-create records.
- Independent review cleared all three iOS 13.3.1 patch-cycle public identities, closed iOS 14.8 as evidence-backed not applicable, preserved iOS 8.4.1 as conflicted/not established, and retained the other 24 patch parents as reversible no-positive audits.
- Independent review cleared 30 of 33 watchOS candidates, 38 of 45 macOS 2014–2019 candidates after the Catalina date correction, and 37 of 60 tvOS candidates.
- Independent review cleared 25 of 55 researched watchOS point-cycle identities. Thirty exact identities remain blocked, eight identity-specific no-positive findings remain reversible, and five parents with no approved appearance remain open rather than being described as historical absence.
- Independent review cleared 37 of 116 researched tvOS point-cycle identities. Seventy-nine exact identities remain blocked, all 15 skipped or negative sequence findings remain reversible, and 12 parents with no approved appearance remain open rather than being described as historical absence.
- Independent review cleared 36 of 41 macOS 11–26 major-cycle candidates; five ordinal/date or same-label lifecycle identities remain blocked.
- Independent review cleared 38 of 40 macOS 15.1–15.6 and 26.1–26.6 point-release candidates after the exact-lineage supplement; macOS 15.3 Public Beta 3 and 15.5 Public Beta 3 remain blocked.
- The iPadOS major-cycle review cleared all 39 confirmed-missing creation candidates after the nine-candidate second-lineage supplement; one additional chronology-approved identity remains isolated as a production correction.
- Independent review cleared all 17 developer-beta candidates across iOS 9.2.1, 10.2.1, 10.3.2, and 10.3.3 while preserving two aggregate-count reporting conflicts.
- Remaining blockers are preserved rather than inferred from paired developer ordinals or appearance order.

No Sanity write or deployment is authorized by this matrix.
`;
writeFileSync(`${outputDirectory}/coverage-matrix.md`, markdown);

console.log(
  JSON.stringify({
    eligibleModeledVersions: rows.length,
    structuredCandidates: candidateRecords.length,
    readinessCounts,
    representedVersions: versionsRepresented.length,
    remainingAuditQueue:
      remainingPublicBetaAuditRows.length,
    developerStructuredCandidates:
      developerCandidateRecords.length,
    developerCandidateReadiness:
      developerCandidateReadinessCounts,
    remainingDeveloperAuditQueue:
      remainingDeveloperBetaAuditRows.length,
  }),
);
