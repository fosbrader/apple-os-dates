import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";

const programDirectory =
  "research-handoffs/beta-chronology-gap";
const readJson = (relativePath) =>
  JSON.parse(readFileSync(relativePath, "utf8"));
const fail = (message) => {
  throw new Error(message);
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
    fail(
      `${packetName} does not authorize research-handoff aggregation.`,
    );
  }
  for (const flag of [
    "sanityMutationAllowed",
    "stableEventIdCreationAllowed",
    "pageBuildsAllowed",
    "publicationEligible",
    "deploymentAllowed",
  ]) {
    if (
      review.authorization?.[flag] !== false ||
      validation.authorization?.[flag] !== false
    ) {
      fail(
        `${packetName} review authorization flag ${flag} is not false.`,
      );
    }
  }
  if (
    "siteIntegrationAllowed" in review.authorization &&
    review.authorization.siteIntegrationAllowed !== false
  ) {
    fail(`${packetName} siteIntegrationAllowed flag is not false.`);
  }
  if (
    !String(validation.status).startsWith("passed") ||
    (validation.errors?.length ?? 0) !== 0
  ) {
    fail(
      `${packetName} final independent-review validation did not pass cleanly.`,
    );
  }
  const pageBuildCheck =
    review.checks?.pageBuildPerformed ??
    review.checks?.pageBuildsPerformed;
  if (
    review.checks?.sanityMutationPerformed !== false ||
    ![false, 0].includes(pageBuildCheck) ||
    review.checks?.publicationPerformed !== false ||
    review.checks?.deploymentPerformed !== false
  ) {
    fail(
      `${packetName} final review does not preserve the no-mutation/no-build/no-publication/no-deploy boundary.`,
    );
  }
};
const assertPinnedFile = (filePath, expectedSha256) => {
  const actualSha256 = createHash("sha256")
    .update(readFileSync(filePath))
    .digest("hex");
  if (actualSha256 !== expectedSha256) {
    fail(
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
      fail(
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
    fail(
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
      fail(
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
    fail(
      `${packetName} final integrity checks do not preserve the research-only boundary.`,
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
    fail(
      `${packetName} ${leftLabel}/${rightLabel} mismatch: ${leftOnly.length} only in ${leftLabel} and ${rightOnly.length} only in ${rightLabel}.`,
    );
  }
};
const buildReviewerSelectedEvidenceMap = ({
  packetName,
  review,
  approvedIds,
  sourcePath,
  locator,
}) =>
  new Map(
    review.candidateReviews
      .filter((candidateReview) =>
        approvedIds.has(candidateReview.candidateId),
      )
      .map((candidateReview) => {
        const acceptedBySourceId = new Map(
          candidateReview.acceptedEvidenceRefs.map((reference) => [
            reference.sourceId,
            reference,
          ]),
        );
        if (candidateReview.selectedEvidenceRefs.length < 2) {
          fail(
            `${packetName} approved candidate ${candidateReview.candidateId} has fewer than two reviewer-selected lineages.`,
          );
        }
        return [
          candidateReview.candidateId,
          candidateReview.selectedEvidenceRefs.map((reference) => {
            const accepted = acceptedBySourceId.get(
              reference.sourceId,
            );
            if (!accepted) {
              fail(
                `${packetName} selected evidence ${reference.sourceId} is not accepted for ${candidateReview.candidateId}.`,
              );
            }
            return {
              kind: "packetSource",
              packetPath: sourcePath,
              sourceId: reference.sourceId,
              locator,
              supports: [
                accepted.acceptedFor,
                accepted.reason,
                reference.reason,
              ]
                .filter(Boolean)
                .join(". "),
            };
          }),
        ];
      }),
  );

const coverage = readJson(`${programDirectory}/coverage-matrix.json`);
const iosPatchApplicabilityReviewPath =
  `${programDirectory}/ios-patch-applicability/independent-review.json`;
const iosPatchApplicabilityReview = readJson(
  iosPatchApplicabilityReviewPath,
);
const iosPatchApplicabilityReviewValidation = readJson(
  `${programDirectory}/ios-patch-applicability/independent-review-validation.json`,
);
const iosPatchApplicabilityReviewIntegrity = readJson(
  `${programDirectory}/ios-patch-applicability/independent-review-integrity.json`,
);
assertPinnedFile(
  `${programDirectory}/ios-patch-applicability/independent-review-integrity.json`,
  "9f8a6dd7fb666b9bf20d89891dde83ded7a467e83242848609a8d787a911e007",
);
assertResearchHandoffReviewAuthorization(
  "ios-patch-applicability",
  iosPatchApplicabilityReview,
  iosPatchApplicabilityReviewValidation,
);
const iosPatchApplicabilityPacketLocks = readJson(
  `${programDirectory}/ios-patch-applicability/packet-locks.json`,
);
const iosPatchApplicabilityRawEvidenceLocks = readJson(
  `${programDirectory}/ios-patch-applicability/raw-evidence-locks.json`,
);
assertPinnedFile(
  `${programDirectory}/ios-patch-applicability/packet-locks.json`,
  "23c6bac767883500103ecdb2108fb10ec49574f39119587da8a56835712aaa98",
);
assertPinnedArtifactSet(
  "ios-patch-applicability",
  "frozen-core",
  iosPatchApplicabilityReviewIntegrity.frozenCorePins,
);
assertPinnedArtifactSet(
  "ios-patch-applicability",
  "reviewer",
  iosPatchApplicabilityReviewIntegrity.reviewerArtifactPins,
);
assertResearchHandoffManifestEntries(
  "ios-patch-applicability",
  iosPatchApplicabilityPacketLocks,
);
if (
  Object.keys(iosPatchApplicabilityPacketLocks.locks).length !==
    iosPatchApplicabilityReview.lockedFileVerification
      .verifiedMaterialFileCount ||
  iosPatchApplicabilityRawEvidenceLocks.locks.length !==
    iosPatchApplicabilityReview.lockedFileVerification
      .rawEvidenceVerifiedCount
) {
  fail(
    "The iOS patch review no longer reconciles to its frozen lock manifests.",
  );
}
const iosPatchApplicabilityApprovedIds = new Set(
  iosPatchApplicabilityReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
assertSameIdSet(
  "ios-patch-applicability",
  "review-approved",
  iosPatchApplicabilityApprovedIds,
  "validation-approved",
  iosPatchApplicabilityReviewValidation.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const iosPatchApplicabilityEvidenceByCandidateId =
  buildReviewerSelectedEvidenceMap({
    packetName: "ios-patch-applicability",
    review: iosPatchApplicabilityReview,
    approvedIds: iosPatchApplicabilityApprovedIds,
    sourcePath:
      `${programDirectory}/ios-patch-applicability/sources.json`,
    locator:
      "Independent-review-selected passage proving the exact iOS version, displayed public-program ordinal, public audience, and America/Los_Angeles appearance date.",
  });
const watchosPointReviewPath =
  `${programDirectory}/watchos-point-7-26/independent-review.json`;
const watchosPointReview = readJson(watchosPointReviewPath);
const watchosPointReviewValidation = readJson(
  `${programDirectory}/watchos-point-7-26/independent-review-validation.json`,
);
const watchosPointReviewLocks = readJson(
  `${programDirectory}/watchos-point-7-26/independent-review-locks.json`,
);
assertPinnedFile(
  `${programDirectory}/watchos-point-7-26/independent-review-locks.json`,
  "527eaebfab30f2946548a219c579cdd3f7e7f021e2b184c6cac4434d47718e8a",
);
assertResearchHandoffReviewAuthorization(
  "watchos-point-7-26",
  watchosPointReview,
  watchosPointReviewValidation,
);
const watchosPointPacketLocks = readJson(
  `${programDirectory}/watchos-point-7-26/packet-locks.json`,
);
const watchosPointRawEvidenceLocks = readJson(
  `${programDirectory}/watchos-point-7-26/raw-evidence-locks.json`,
);
assertPinnedFile(
  watchosPointReviewLocks.upstreamFreeze.packetLocksPath,
  "73786d76a19e10345235d371d929585ae15c7dece7db0dc4b2b7a72d4506248f",
);
assertPinnedFile(
  watchosPointReviewLocks.upstreamFreeze.rawEvidenceLocksPath,
  watchosPointReviewLocks.upstreamFreeze.rawEvidenceLocksSha256,
);
assertPinnedArtifactSet(
  "watchos-point-7-26",
  "reviewer",
  watchosPointReviewLocks.locks,
);
assertResearchHandoffManifestEntries(
  "watchos-point-7-26",
  watchosPointPacketLocks,
);
if (
  watchosPointReviewLocks.upstreamFreeze.packetLocksSha256 !==
    "73786d76a19e10345235d371d929585ae15c7dece7db0dc4b2b7a72d4506248f" ||
  watchosPointReviewLocks.upstreamFreeze
    .allUpstreamLocksReproduced !== true
) {
  fail(
    "The watchOS point reviewer lock does not preserve its trusted upstream freeze.",
  );
}
if (
  Object.keys(watchosPointPacketLocks.locks).length !==
    watchosPointReview.lockedFileVerification.authoritativeLockCount ||
  watchosPointRawEvidenceLocks.locks.length !==
    watchosPointReview.lockedFileVerification.rawLockCount
) {
  fail(
    "The watchOS point review no longer reconciles to its frozen lock manifests.",
  );
}
const watchosPointApprovedIds = new Set(
  watchosPointReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
assertSameIdSet(
  "watchos-point-7-26",
  "review-approved",
  watchosPointApprovedIds,
  "validation-approved",
  watchosPointReviewValidation.finalPartition
    .chronologyApprovedCandidateIds,
);
const watchosPointEvidenceByCandidateId =
  buildReviewerSelectedEvidenceMap({
    packetName: "watchos-point-7-26",
    review: watchosPointReview,
    approvedIds: watchosPointApprovedIds,
    sourcePath:
      `${programDirectory}/watchos-point-7-26/sources.json`,
    locator:
      "Independent-review-selected frozen passage proving the exact watchOS version, displayed public-program ordinal, public audience, and America/Los_Angeles appearance date.",
  });
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
const tvosPointReviewPath =
  `${programDirectory}/tvos-point-11-26/independent-review.json`;
const tvosPointReview = readJson(tvosPointReviewPath);
const tvosPointReviewValidation = readJson(
  `${programDirectory}/tvos-point-11-26/independent-review-validation.json`,
);
const tvosPointReviewIntegrity = readJson(
  `${programDirectory}/tvos-point-11-26/independent-review-integrity.json`,
);
assertPinnedArtifactSet(
  "tvos-point-11-26",
  "frozen-core",
  tvosPointReviewIntegrity.frozenCorePins,
);
assertPinnedArtifactSet(
  "tvos-point-11-26",
  "reviewer",
  tvosPointReviewIntegrity.reviewerArtifactPins,
);
assertPinnedArtifactSet(
  "tvos-point-11-26",
  "packet-lock manifest",
  {
    packetLocks: {
      path:
        tvosPointReviewIntegrity.packetFreezeVerification
          .lockManifestPath,
      bytes:
        tvosPointReviewIntegrity.packetFreezeVerification
          .lockManifestBytes,
      sha256:
        tvosPointReviewIntegrity.packetFreezeVerification
          .lockManifestSha256,
    },
  },
);
assertResearchHandoffReviewAuthorization(
  "tvos-point-11-26",
  tvosPointReview,
  tvosPointReviewValidation,
);
assertResearchHandoffIntegrity(
  "tvos-point-11-26",
  tvosPointReviewIntegrity,
);
const tvosPointPacketLocks = readJson(
  `${programDirectory}/tvos-point-11-26/packet-locks.json`,
);
const tvosPointRawEvidenceLocks = readJson(
  `${programDirectory}/tvos-point-11-26/raw-evidence-locks.json`,
);
assertResearchHandoffManifestEntries(
  "tvos-point-11-26",
  tvosPointPacketLocks,
);
if (
  Object.keys(tvosPointPacketLocks.locks).length !==
    tvosPointReview.lockedFileVerification
      .packetLockCountVerified ||
  tvosPointRawEvidenceLocks.locks.length !==
    tvosPointReview.lockedFileVerification
      .rawEvidenceVerifiedCount ||
  tvosPointReviewValidation.frozenEvidence.failureCount !== 0 ||
  tvosPointReviewIntegrity.packetFreezeVerification
    .sha256FailureCount !== 0 ||
  tvosPointReviewIntegrity.rawAndSelectedEvidenceVerification
    .failureCount !== 0
) {
  fail(
    "The tvOS point review no longer reconciles to its frozen lock manifests.",
  );
}
const tvosPointApprovedIds = new Set(
  tvosPointReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const tvosPointEvidencePairIds = new Set(
  tvosPointReview.approvedEvidencePairs.map(
    (pair) => pair.candidateId,
  ),
);
assertSameIdSet(
  "tvos-point-11-26",
  "review-approved",
  tvosPointApprovedIds,
  "review-selected evidence pairs",
  tvosPointEvidencePairIds,
);
if (
  tvosPointApprovedIds.size !==
    tvosPointReviewValidation.partition.approvedCandidateCount ||
  tvosPointReview.approvedEvidencePairs.length !==
    tvosPointApprovedIds.size ||
  tvosPointReview.approvedEvidencePairs.some(
    (pair) => pair.selectedSourceIds.length !== 2,
  )
) {
  fail(
    "The tvOS point review does not preserve its exact 37-candidate/two-lineage evidence gate.",
  );
}
const tvosPointEvidenceByCandidateId = new Map(
  tvosPointReview.approvedEvidencePairs.map((pair) => [
    pair.candidateId,
    pair.selectedSourceIds.map((sourceId) => ({
      kind: "packetSource",
      packetPath:
        `${programDirectory}/tvos-point-11-26/sources.json`,
      sourceId,
      locator:
        "Final independent-review-selected frozen source proving the exact tvOS version, displayed public-program ordinal, public audience, and America/Los_Angeles appearance date.",
      supports:
        "One of exactly two independent publisher lineages selected by final review for this unchanged candidate identity.",
    })),
  ]),
);
const ios10PointPublicFollowupReviewPath =
  `${programDirectory}/ios10-point-public-followup/independent-review.json`;
const ios10PointPublicFollowupCandidateIds = new Set(
  readJson(ios10PointPublicFollowupReviewPath).candidateVerdict
    .chronologyApprovedAfterSupplement,
);
const iosMajor12To18FollowupReviewPath =
  `${programDirectory}/ios-major-12-18-followup/independent-review.json`;
const iosMajor12To18FollowupReview = readJson(
  iosMajor12To18FollowupReviewPath,
);
const iosMajor12To18FollowupCandidateIds = new Set(
  iosMajor12To18FollowupReview.candidateVerdict
    .chronologyApprovedAfterSupplement,
);
const iosMajor12To18FollowupEvidenceByCandidateId = new Map(
  readJson(
    `${programDirectory}/ios-major-12-18-followup/supplement.json`,
  ).mappings
    .filter(
      (mapping) =>
        mapping.originalRecordKind === "candidate" &&
        iosMajor12To18FollowupCandidateIds.has(
          mapping.originalRecordId,
        ),
    )
    .map((mapping) => [
      mapping.originalRecordId,
      mapping.evidenceRefs
        .filter(
          (reference) =>
            reference.kind === "parentPacketSource" ||
            reference.kind === "supplementSource",
        )
        .map((reference) => ({
          ...reference,
          kind: "packetSource",
        })),
    ]),
);
const iosIpadosPoint12To14ReviewPath =
  `${programDirectory}/ios-ipados-point-12-14/independent-review.json`;
const iosIpadosPoint12To14Review = readJson(
  iosIpadosPoint12To14ReviewPath,
);
const iosIpadosPoint12To14ApprovedIds = new Set(
  iosIpadosPoint12To14Review.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const iosIpadosPoint12To14EvidenceByCandidateId = new Map(
  iosIpadosPoint12To14Review.candidateReviews
    .filter((review) =>
      iosIpadosPoint12To14ApprovedIds.has(review.candidateId),
    )
    .map((review) => {
      const acceptedByKey = new Map(
        review.acceptedEvidenceRefs.map((reference) => [
          `${reference.packetPath}\u0000${reference.sourceId}`,
          reference,
        ]),
      );
      return [
        review.candidateId,
        review.selectedCorroboratingEvidenceRefs.map((reference) => {
          const accepted = acceptedByKey.get(
            `${reference.packetPath}\u0000${reference.sourceId}`,
          );
          if (!accepted) {
            throw new Error(
              `${review.candidateId} selected evidence ${reference.sourceId} is not accepted by its independent review.`,
            );
          }
          return {
            kind: "packetSource",
            packetPath: reference.packetPath,
            sourceId: reference.sourceId,
            locator:
              "Independent-review-selected source passage for the exact platform, version, displayed public ordinal, and Pacific appearance date.",
            supports: accepted.reason,
          };
        }),
      ];
    }),
);
const iosIpadosPoint12To14FollowupReviewPath =
  `${programDirectory}/ios-ipados-point-12-14-followup/independent-review.json`;
const iosIpadosPoint12To14FollowupReview = readJson(
  iosIpadosPoint12To14FollowupReviewPath,
);
const iosIpadosPoint12To14FollowupApprovedIds = new Set(
  iosIpadosPoint12To14FollowupReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const iosIpadosPoint12To14FollowupMappingByCandidateId = new Map(
  readJson(
    `${programDirectory}/ios-ipados-point-12-14-followup/mappings.json`,
  ).mappings.map((mapping) => [mapping.candidateId, mapping]),
);
const iosIpadosPoint12To14FollowupEvidenceByCandidateId = new Map(
  iosIpadosPoint12To14FollowupReview.candidateReviews
    .filter((review) =>
      iosIpadosPoint12To14FollowupApprovedIds.has(
        review.candidateId,
      ),
    )
    .map((review) => {
      const mapping =
        iosIpadosPoint12To14FollowupMappingByCandidateId.get(
          review.candidateId,
        );
      if (!mapping) {
        throw new Error(
          `${review.candidateId} has no iOS/iPadOS 12–14 follow-up mapping.`,
        );
      }
      const mappedEvidenceRefs = [
        ...mapping.retainedParentEvidenceRefs,
        ...mapping.supplementEvidenceRefs,
      ];
      const mappedBySourceId = new Map(
        mappedEvidenceRefs.map((reference) => [
          reference.sourceId,
          reference,
        ]),
      );
      if (mappedBySourceId.size !== mappedEvidenceRefs.length) {
        throw new Error(
          `${review.candidateId} has ambiguous source IDs in its follow-up mapping.`,
        );
      }
      const acceptedBySourceId = new Map(
        review.acceptedEvidenceRefs.map((reference) => [
          reference.sourceId,
          reference,
        ]),
      );
      return [
        review.candidateId,
        review.selectedEvidenceRefs.map((reference) => {
          const mapped = mappedBySourceId.get(reference.sourceId);
          const accepted = acceptedBySourceId.get(
            reference.sourceId,
          );
          if (!mapped || !accepted) {
            throw new Error(
              `${review.candidateId} selected evidence ${reference.sourceId} is not both mapped and accepted by its follow-up review.`,
            );
          }
          return {
            kind: "packetSource",
            packetPath: mapped.packetPath,
            sourceId: reference.sourceId,
            locator:
              "Independent-review-selected source passage for the exact platform, version, displayed public ordinal, and Pacific appearance date.",
            supports: accepted.reason,
          };
        }),
      ];
    }),
);
const iosIpadosPoint15To18ReviewPath =
  `${programDirectory}/ios-ipados-point-15-18/independent-review.json`;
const iosIpadosPoint15To18Review = readJson(
  iosIpadosPoint15To18ReviewPath,
);
if (
  iosIpadosPoint15To18Review.authorization
    .researchHandoffAggregationAllowed !== true
) {
  throw new Error(
    "The iOS/iPadOS 15–18 review does not authorize research-handoff aggregation.",
  );
}
const iosIpadosPoint15To18ApprovedIds = new Set(
  iosIpadosPoint15To18Review.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const iosIpadosPoint15To18EvidenceByCandidateId = new Map(
  iosIpadosPoint15To18Review.candidateReviews
    .filter((review) =>
      iosIpadosPoint15To18ApprovedIds.has(review.candidateId),
    )
    .map((review) => {
      const acceptedBySourceId = new Map(
        review.acceptedEvidenceRefs.map((reference) => [
          reference.sourceId,
          reference,
        ]),
      );
      return [
        review.candidateId,
        review.selectedEvidenceRefs.map((reference) => {
          const accepted = acceptedBySourceId.get(reference.sourceId);
          if (!accepted) {
            throw new Error(
              `${review.candidateId} selected evidence ${reference.sourceId} is not accepted by its independent review.`,
            );
          }
          return {
            kind: "packetSource",
            packetPath:
              `${programDirectory}/ios-ipados-point-15-18/sources.json`,
            sourceId: reference.sourceId,
            locator:
              "Independent-review-selected source passage for the exact platform, version, displayed public ordinal, and Pacific appearance date.",
            supports: accepted.reason,
          };
        }),
      ];
    }),
);
const macosPoint15To26ReviewPath =
  `${programDirectory}/macos-point-15-26/independent-review.json`;
const macosPoint15To26Review = readJson(
  macosPoint15To26ReviewPath,
);
const macosPoint15To26ApprovedIds = new Set(
  macosPoint15To26Review.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const macosPoint15To26EvidenceByCandidateId = new Map(
  macosPoint15To26Review.candidateReviews
    .filter((review) =>
      macosPoint15To26ApprovedIds.has(review.candidateId),
    )
    .map((review) => {
      const acceptedBySourceId = new Map(
        review.acceptedEvidenceRefs.map((reference) => [
          reference.sourceId,
          reference,
        ]),
      );
      return [
        review.candidateId,
        review.selectedEvidenceRefs.map((reference) => {
          const accepted = acceptedBySourceId.get(reference.sourceId);
          if (!accepted) {
            throw new Error(
              `${review.candidateId} selected evidence ${reference.sourceId} is not accepted by its independent review.`,
            );
          }
          return {
            kind: "packetSource",
            packetPath:
              `${programDirectory}/macos-point-15-26/sources.json`,
            sourceId: reference.sourceId,
            locator:
              "Independent-review-selected source passage for the exact macOS version, displayed public ordinal, and Pacific appearance date.",
            supports: `${accepted.acceptedFor}. ${accepted.reason}`,
          };
        }),
      ];
    }),
);
const macosPoint15To26FollowupReviewPath =
  `${programDirectory}/macos-point-15-26-followup/independent-review.json`;
const macosPoint15To26FollowupReview = readJson(
  macosPoint15To26FollowupReviewPath,
);
const macosPoint15To26FollowupApprovedIds = new Set(
  macosPoint15To26FollowupReview.candidateDisposition
    .chronologyApprovedCandidateIds,
);
const macosPoint15To26FollowupMappingByCandidateId = new Map(
  readJson(
    `${programDirectory}/macos-point-15-26-followup/mappings.json`,
  ).mappings.map((mapping) => [mapping.candidateId, mapping]),
);
const macosPoint15To26FollowupEvidenceByCandidateId = new Map(
  macosPoint15To26FollowupReview.candidateReviews
    .filter((review) =>
      macosPoint15To26FollowupApprovedIds.has(review.candidateId),
    )
    .map((review) => {
      const mapping =
        macosPoint15To26FollowupMappingByCandidateId.get(
          review.candidateId,
        );
      if (!mapping) {
        throw new Error(
          `${review.candidateId} has no macOS point follow-up mapping.`,
        );
      }
      const mappedEvidenceRefs = [
        ...mapping.retainedParentEvidenceRefs,
        ...mapping.supplementEvidenceRefs,
      ];
      const mappedBySourceId = new Map(
        mappedEvidenceRefs.map((reference) => [
          reference.sourceId,
          reference,
        ]),
      );
      if (mappedBySourceId.size !== mappedEvidenceRefs.length) {
        throw new Error(
          `${review.candidateId} has ambiguous source IDs in its macOS follow-up mapping.`,
        );
      }
      const acceptedBySourceId = new Map(
        review.acceptedEvidenceRefs.map((reference) => [
          reference.sourceId,
          reference,
        ]),
      );
      return [
        review.candidateId,
        review.selectedEvidenceRefs.map((reference) => {
          const mapped = mappedBySourceId.get(reference.sourceId);
          const accepted = acceptedBySourceId.get(
            reference.sourceId,
          );
          if (!mapped || !accepted) {
            throw new Error(
              `${review.candidateId} selected evidence ${reference.sourceId} is not both mapped and accepted by its macOS follow-up review.`,
            );
          }
          return {
            kind: "packetSource",
            packetPath: mapped.packetPath,
            sourceId: reference.sourceId,
            locator:
              "Independent-review-selected source passage for the exact macOS version, displayed public ordinal, and Pacific appearance date.",
            supports: `${accepted.acceptedFor}. ${accepted.reason}`,
          };
        }),
      ];
    }),
);
const productionReconciliationOverrideByCandidateId = new Map([
  ...[...iosPatchApplicabilityApprovedIds].map((candidateId) => [
    candidateId,
    {
      status: "confirmedMissing",
      queriedAt:
        iosPatchApplicabilityReview.productionRecheck.queriedAt,
      exactIdentityMatches: 0,
      matchBasis:
        "Final independent-review published/no-CDN query found zero exact route and full candidate identity matches.",
    },
  ]),
  ...[...watchosPointApprovedIds].map((candidateId) => [
    candidateId,
    {
      status: "confirmedMissing",
      queriedAt:
        watchosPointReview.productionRecheck.capturedAt,
      exactIdentityMatches: 0,
      matchBasis:
        "Final independent-review published/no-CDN query found zero exact route and full candidate identity matches.",
    },
  ]),
  ...[...tvosPointApprovedIds].map((candidateId) => [
    candidateId,
    {
      status: "confirmedMissing",
      queriedAt: tvosPointReview.productionRecheck.capturedAt,
      exactIdentityMatches: 0,
      matchBasis:
        "Final independent-review published/no-CDN query found zero exact route and full candidate identity matches.",
    },
  ]),
  ...[...iosMajor12To18FollowupCandidateIds].map((candidateId) => [
    candidateId,
    {
      status: "confirmedMissing",
      queriedAt:
        iosMajor12To18FollowupReview.productionRecheck.queriedAt,
      exactIdentityMatches: 0,
    },
  ]),
  ...iosIpadosPoint12To14Review.candidateReviews
    .filter((review) =>
      iosIpadosPoint12To14ApprovedIds.has(review.candidateId),
    )
    .map((review) => [
      review.candidateId,
      review.productionReconciliation,
    ]),
  ...[...iosIpadosPoint12To14FollowupApprovedIds].map(
    (candidateId) => [
      candidateId,
      {
        status: "confirmedMissing",
        queriedAt:
          iosIpadosPoint12To14FollowupReview.productionRecheck
            .queriedAt,
        exactIdentityMatches: 0,
      },
    ],
  ),
  ...[...iosIpadosPoint15To18ApprovedIds].map((candidateId) => [
    candidateId,
    {
      status: "confirmedMissing",
      queriedAt:
        iosIpadosPoint15To18Review.productionRecheck.queriedAt,
      exactIdentityMatches: 0,
    },
  ]),
  ...[...macosPoint15To26ApprovedIds].map((candidateId) => [
    candidateId,
    {
      status: "confirmedMissing",
      queriedAt: macosPoint15To26Review.productionRecheck.queriedAt,
      exactIdentityMatches: 0,
    },
  ]),
  ...[...macosPoint15To26FollowupApprovedIds].map(
    (candidateId) => [
      candidateId,
      {
        status: "confirmedMissing",
        queriedAt:
          macosPoint15To26FollowupReview.productionRecheck
            .queriedAt,
        exactIdentityMatches: 0,
      },
    ],
  ),
]);
const candidatePackets = [
  {
    packet: "candidate-register.json",
    path: `${programDirectory}/candidate-register.json`,
  },
  {
    packet: "ios9-point/candidates.json",
    path: `${programDirectory}/ios9-point/candidates.json`,
  },
  {
    packet: "ios9-10-major/candidates.json",
    path: `${programDirectory}/ios9-10-major/candidates.json`,
  },
  {
    packet: "ios10-point-public/candidates.json",
    path: `${programDirectory}/ios10-point-public/candidates.json`,
    excludedCandidateIds: ios10PointPublicFollowupCandidateIds,
  },
  {
    packet: "ios10-point-public-followup/candidates.json",
    path: `${programDirectory}/ios10-point-public-followup/candidates.json`,
  },
  {
    packet: "mobile26-public/candidates.json",
    path: `${programDirectory}/mobile26-public/candidates.json`,
  },
  {
    packet: "ios-major-12-18/candidates.json",
    path: `${programDirectory}/ios-major-12-18/candidates.json`,
  },
  {
    packet: "ios-major-12-18-followup/reviewed-candidates.json",
    path: `${programDirectory}/ios-major-12-18-followup/reviewed-candidates.json`,
  },
  {
    packet: "ios-ipados-point-12-14/candidates.json",
    path: `${programDirectory}/ios-ipados-point-12-14/candidates.json`,
  },
  {
    packet: "ios-ipados-point-15-18/candidates.json",
    path: `${programDirectory}/ios-ipados-point-15-18/candidates.json`,
  },
  {
    packet: "ios-patch-applicability/candidates.json",
    path: `${programDirectory}/ios-patch-applicability/candidates.json`,
  },
  {
    packet: "macos-2014-2019/candidates.json",
    path: `${programDirectory}/macos-2014-2019/candidates.json`,
  },
  {
    packet: "macos-major-11-26/candidates.json",
    path: `${programDirectory}/macos-major-11-26/candidates.json`,
  },
  {
    packet: "macos-point-15-26/candidates.json",
    path: `${programDirectory}/macos-point-15-26/candidates.json`,
  },
  {
    packet: "ipados-major-13-26/candidates.json",
    path: `${programDirectory}/ipados-major-13-26/candidates.json`,
  },
  {
    packet: "watchos-major-7-26/candidates.json",
    path: `${programDirectory}/watchos-major-7-26/candidates.json`,
  },
  {
    packet: "watchos-point-7-26/candidates.json",
    path: `${programDirectory}/watchos-point-7-26/candidates.json`,
  },
  {
    packet: "tvos-major-11-26/candidates.json",
    path: `${programDirectory}/tvos-major-11-26/candidates.json`,
  },
  {
    packet: "tvos-point-11-26/candidates.json",
    path: `${programDirectory}/tvos-point-11-26/candidates.json`,
  },
];
const reviewArtifactsByPacket = {
  "candidate-register.json": [
    `${programDirectory}/os27/review.json`,
  ],
  "ios9-point/candidates.json": [
    `${programDirectory}/ios9-point/review.json`,
    `${programDirectory}/ios9-point/corroboration-independent-review.json`,
  ],
  "ios9-10-major/candidates.json": [
    `${programDirectory}/ios9-10-major/review.json`,
  ],
  "ios10-point-public/candidates.json": [
    `${programDirectory}/ios10-point-public/independent-review.json`,
  ],
  "ios10-point-public-followup/candidates.json": [
    `${programDirectory}/ios10-point-public/independent-review.json`,
    ios10PointPublicFollowupReviewPath,
  ],
  "mobile26-public/candidates.json": [
    `${programDirectory}/mobile26-public/independent-review.json`,
  ],
  "ios-major-12-18/candidates.json": [
    `${programDirectory}/ios-major-12-18/independent-review.json`,
  ],
  "ios-major-12-18-followup/reviewed-candidates.json": [
    iosMajor12To18FollowupReviewPath,
  ],
  "ios-ipados-point-12-14/candidates.json": [
    iosIpadosPoint12To14ReviewPath,
  ],
  "ios-ipados-point-15-18/candidates.json": [
    iosIpadosPoint15To18ReviewPath,
  ],
  "ios-patch-applicability/candidates.json": [
    iosPatchApplicabilityReviewPath,
  ],
  "macos-2014-2019/candidates.json": [
    `${programDirectory}/macos-2014-2019/independent-review.json`,
  ],
  "macos-major-11-26/candidates.json": [
    `${programDirectory}/macos-major-11-26/independent-review.json`,
  ],
  "macos-point-15-26/candidates.json": [
    macosPoint15To26ReviewPath,
  ],
  "ipados-major-13-26/candidates.json": [
    `${programDirectory}/ipados-major-13-26/independent-review.json`,
  ],
  "watchos-major-7-26/candidates.json": [
    `${programDirectory}/watchos-major-7-26/independent-review.json`,
  ],
  "watchos-point-7-26/candidates.json": [
    watchosPointReviewPath,
  ],
  "tvos-major-11-26/candidates.json": [
    `${programDirectory}/tvos-major-11-26/independent-review.json`,
  ],
  "tvos-point-11-26/candidates.json": [
    tvosPointReviewPath,
  ],
};
const macosCatalinaPublicBeta5Id =
  "candidate:apple:macos:10.15:public-beta-5";
const ipadosSecondLineageCandidateIds = new Set(
  readJson(
    `${programDirectory}/ipados-major-13-26-second-lineage/independent-review.json`,
  ).candidateVerdict.chronologyApprovedAfterSupplement,
);
const ipadosSecondLineageEvidenceByCandidateId = new Map(
  readJson(
    `${programDirectory}/ipados-major-13-26-second-lineage/candidate-mapping.json`,
  ).mappings
    .filter((mapping) =>
      ipadosSecondLineageCandidateIds.has(mapping.candidateId),
    )
    .map((mapping) => [
      mapping.candidateId,
      [
        {
          kind: "packetSource",
          packetPath:
            `${programDirectory}/ipados-major-13-26/sources.json`,
          sourceId:
            mapping.parentPacket.existingExplicitOrdinalLineage
              .sourceId,
          locator:
            mapping.parentPacket.existingExplicitOrdinalLineage
              .locator,
          supports:
            "Parent-packet source explicitly supports the public ordinal and dated appearance.",
        },
        {
          kind: "packetSource",
          packetPath:
            `${programDirectory}/ipados-major-13-26-second-lineage/sources.json`,
          sourceId: mapping.supplementalEvidence.sourceId,
          locator: mapping.supplementalEvidence.locator,
          supports:
            "Independently supports the exact public ordinal and dated public-channel appearance.",
        },
      ],
    ]),
);
for (const mapping of readJson(
  `${programDirectory}/ipados-major-13-26-second-lineage/candidate-mapping.json`,
).mappings) {
  if (!ipadosSecondLineageCandidateIds.has(mapping.candidateId)) {
    continue;
  }
  productionReconciliationOverrideByCandidateId.set(
    mapping.candidateId,
    {
      status: "confirmedMissing",
      queriedAt: mapping.productionReconciliation.capturedAt,
      exactIdentityMatches:
        mapping.productionReconciliation.fullCandidateMatchCount,
    },
  );
}

const candidateById = new Map();
for (const packet of candidatePackets) {
  const document = readJson(packet.path);
  for (const candidate of document.candidates) {
    if (packet.excludedCandidateIds?.has(candidate.candidateId)) {
      continue;
    }
    if (candidateById.has(candidate.candidateId)) {
      fail(`Duplicate candidate ID ${candidate.candidateId}.`);
    }
    const adjudicatedEvidence =
      iosPatchApplicabilityEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      watchosPointEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      tvosPointEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      iosMajor12To18FollowupEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      ipadosSecondLineageEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      iosIpadosPoint12To14EvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      iosIpadosPoint12To14FollowupEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      iosIpadosPoint15To18EvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      macosPoint15To26EvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      macosPoint15To26FollowupEvidenceByCandidateId.get(
        candidate.candidateId,
      ) ??
      [];
    const hydratedCandidate =
      adjudicatedEvidence.length > 0 ||
      productionReconciliationOverrideByCandidateId.has(
        candidate.candidateId,
      )
        ? {
            ...candidate,
            evidenceRefs:
              adjudicatedEvidence.length > 0
                ? adjudicatedEvidence
                : candidate.evidenceRefs,
            productionReconciliation: {
              ...candidate.productionReconciliation,
              ...(productionReconciliationOverrideByCandidateId.get(
                candidate.candidateId,
              ) ?? {}),
            },
          }
        : candidate;
    candidateById.set(candidate.candidateId, {
      candidate: hydratedCandidate,
      packet: packet.packet,
      packetPath: packet.path,
    });
  }
}

const sourceLedgers = new Map();
const reviewDocuments = new Map();
const loadReviewDocument = (reviewArtifactPath) => {
  let document = reviewDocuments.get(reviewArtifactPath);
  if (!document) {
    document = readJson(reviewArtifactPath);
    reviewDocuments.set(reviewArtifactPath, document);
  }
  return document;
};
const findCandidateAdjudications = (
  value,
  candidateId,
  section = "$",
  findings = [],
) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      findCandidateAdjudications(
        item,
        candidateId,
        `${section}[${index}]`,
        findings,
      ),
    );
    return findings;
  }
  if (!value || typeof value !== "object") {
    return findings;
  }
  if (
    value.candidateId === candidateId ||
    (Array.isArray(value.candidateIds) &&
      value.candidateIds.includes(candidateId)) ||
    (Array.isArray(value.appliesToCandidateIds) &&
      value.appliesToCandidateIds.includes(candidateId))
  ) {
    findings.push({section, adjudication: value});
    return findings;
  }
  for (const [key, child] of Object.entries(value)) {
    findCandidateAdjudications(
      child,
      candidateId,
      `${section}.${key}`,
      findings,
    );
  }
  return findings;
};
const resolveEvidence = (candidate) =>
  candidate.evidenceRefs.map((reference) => {
    if (
      reference.kind !== "packetSource" ||
      !reference.packetPath ||
      !reference.sourceId
    ) {
      fail(
        `${candidate.candidateId} has an unresolved non-packet evidence reference.`,
      );
    }
    let ledger = sourceLedgers.get(reference.packetPath);
    if (!ledger) {
      const sourceDocument = readJson(reference.packetPath);
      ledger = new Map(
        sourceDocument.sources.map((source) => [
          source.sourceId,
          source,
        ]),
      );
      sourceLedgers.set(reference.packetPath, ledger);
    }
    const source = ledger.get(reference.sourceId);
    if (!source) {
      fail(
        `${candidate.candidateId} references missing source ${reference.sourceId} in ${reference.packetPath}.`,
      );
    }
    if (!source.canonicalUrl || !source.title || !source.publisher) {
      fail(
        `${candidate.candidateId} references incomplete source metadata for ${reference.sourceId}.`,
      );
    }
    const evidence = source.evidence ?? {};
    return {
      sourceKey: `${reference.packetPath}#${reference.sourceId}`,
      sourcePath: reference.packetPath,
      sourceId: reference.sourceId,
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
      evidenceCustody: evidence.rawPath
        ? {
            rawPath: evidence.rawPath,
            rawBytes: evidence.rawBytes,
            rawSha256: evidence.rawSha256,
            captureMethod: evidence.captureMethod,
          }
        : {
            rawPath: null,
            rawBytes: null,
            rawSha256: null,
            captureMethod: evidence.captureMethod ?? "web-only",
          },
    };
  });

const readyCoverageEntries = coverage.rows.flatMap((row) =>
  row.candidates
    .filter(
      (candidate) =>
        candidate.reviewState === "readyForChronologyReview",
    )
    .map((candidate) => ({
      ...candidate,
      platform: row.platform,
      platformId: row.platformId,
      version: row.version,
      releaseVersionId: row.releaseVersionId,
    })),
);
const expectedReadyCount =
  coverage.summary.structuredCandidateReadiness
    .readyForChronologyReview;
if (readyCoverageEntries.length !== expectedReadyCount) {
  fail(
    `Coverage exposes ${readyCoverageEntries.length} ready candidates; expected ${expectedReadyCount}.`,
  );
}
const readyCoverageCandidateIds = new Set(
  readyCoverageEntries.map((candidate) => candidate.candidateId),
);
for (const [packetName, approvedIds] of [
  ["ios-patch-applicability", iosPatchApplicabilityApprovedIds],
  ["watchos-point-7-26", watchosPointApprovedIds],
  ["tvos-point-11-26", tvosPointApprovedIds],
]) {
  const missingApprovedIds = [...approvedIds].filter(
    (candidateId) => !readyCoverageCandidateIds.has(candidateId),
  );
  if (missingApprovedIds.length > 0) {
    fail(
      `${packetName} has ${missingApprovedIds.length} review-approved candidates missing from ready coverage.`,
    );
  }
}

const handoffCandidates = readyCoverageEntries.map((coverageEntry) => {
  const record = candidateById.get(coverageEntry.candidateId);
  if (!record) {
    fail(
      `Coverage references unknown candidate ${coverageEntry.candidateId}.`,
    );
  }
  const {candidate, packet, packetPath} = record;
  if (packet !== coverageEntry.packet) {
    fail(
      `${candidate.candidateId} packet mismatch: ${packet} versus ${coverageEntry.packet}.`,
    );
  }
  if (
    candidate.productionReconciliation?.status !==
      "confirmedMissing" ||
    candidate.productionReconciliation?.exactIdentityMatches !== 0
  ) {
    fail(
      `${candidate.candidateId} is not a zero-match confirmed-missing identity.`,
    );
  }
  if (
    candidate.flags?.sanityMutationAllowed !== false ||
    candidate.flags?.publicationEligible !== false
  ) {
    fail(`${candidate.candidateId} has unsafe research flags.`);
  }
  const identity = candidate.proposedIdentity;
  if (
    identity.channel !== "publicBeta" ||
    identity.routeAlias !== coverageEntry.routeAlias ||
    identity.appearanceDate !== coverageEntry.appearanceDate ||
    identity.sequence !== coverageEntry.sequence
  ) {
    fail(`${candidate.candidateId} differs from the coverage matrix.`);
  }
  const reviewArtifactPaths = [
    ...(reviewArtifactsByPacket[packet] ?? []),
  ];
  if (candidate.candidateId === macosCatalinaPublicBeta5Id) {
    reviewArtifactPaths.push(
      `${programDirectory}/macos-2014-2019/independent-review-followup.json`,
    );
  }
  if (ipadosSecondLineageCandidateIds.has(candidate.candidateId)) {
    reviewArtifactPaths.push(
      `${programDirectory}/ipados-major-13-26-second-lineage/independent-review.json`,
    );
  }
  if (
    iosMajor12To18FollowupCandidateIds.has(candidate.candidateId)
  ) {
    reviewArtifactPaths.push(
      iosMajor12To18FollowupReviewPath,
    );
  }
  if (
    iosIpadosPoint12To14FollowupApprovedIds.has(
      candidate.candidateId,
    )
  ) {
    reviewArtifactPaths.push(
      iosIpadosPoint12To14FollowupReviewPath,
    );
  }
  if (
    macosPoint15To26FollowupApprovedIds.has(
      candidate.candidateId,
    )
  ) {
    reviewArtifactPaths.push(
      macosPoint15To26FollowupReviewPath,
    );
  }
  if (reviewArtifactPaths.length === 0) {
    fail(`${candidate.candidateId} has no review artifact.`);
  }
  const candidateAdjudications = reviewArtifactPaths.flatMap(
    (reviewArtifactPath) =>
      findCandidateAdjudications(
        loadReviewDocument(reviewArtifactPath),
        candidate.candidateId,
      ).map((adjudication) => ({
        reviewArtifactPath,
        ...adjudication,
      })),
  );
  const evidence = resolveEvidence(candidate);
  const independentPublisherFamilies = new Set(
    evidence
      .filter(
        (reference) =>
          reference.independentForCorroboration !== false,
      )
      .map((reference) => reference.publisherFamily),
  );
  if (independentPublisherFamilies.size < 2) {
    fail(
      `${candidate.candidateId} resolves to fewer than two independent publisher families.`,
    );
  }
  const hasOrdinalOrSequenceEvidence = evidence.some(
    (reference) =>
      reference.roles.includes("publicOrdinal") ||
      reference.roles.includes("sequence") ||
      /ordinal|public beta|first|second|third|fourth|fifth|sixth|seventh|eighth/i.test(
        reference.supports ?? "",
      ),
  );
  if (!hasOrdinalOrSequenceEvidence) {
    fail(
      `${candidate.candidateId} resolves to no public-ordinal or public-sequence evidence.`,
    );
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
    productionReconciliation: {
      status: candidate.productionReconciliation.status,
      queriedAt: candidate.productionReconciliation.queriedAt,
      exactIdentityMatches:
        candidate.productionReconciliation.exactIdentityMatches,
      matchBasis: candidate.productionReconciliation.matchBasis,
    },
    review: {
      state: "chronologyApproved",
      candidatePacketPath: packetPath,
      reviewArtifactPaths,
      candidateAdjudications,
      qualificationsMandatory: true,
      instruction:
        "Read every listed review artifact and preserve all candidate, cohort, date, source-claim, and modeling qualifications. Candidate adjudications are controlling: do not cite a source for any claim the review excludes or narrows.",
    },
    evidence,
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
    left.platform.localeCompare(right.platform) ||
    left.version.localeCompare(right.version, undefined, {
      numeric: true,
    }) ||
    left.proposedIdentity.appearanceDate.localeCompare(
      right.proposedIdentity.appearanceDate,
    ) ||
    left.proposedIdentity.sequence - right.proposedIdentity.sequence,
);

const countsByPlatform = Object.fromEntries(
  [...Map.groupBy(handoffCandidates, (item) => item.platform)].map(
    ([platform, candidates]) => [platform, candidates.length],
  ),
);
const representedVersionIds = new Set(
  handoffCandidates.map((candidate) => candidate.releaseVersionId),
);
const evidenceReferenceCount = handoffCandidates.reduce(
  (total, candidate) => total + candidate.evidence.length,
  0,
);
const uniqueSourceUrls = new Set(
  handoffCandidates.flatMap((candidate) =>
    candidate.evidence.map((evidence) => evidence.canonicalUrl),
  ),
);
const correctionEntries = coverage.rows.flatMap((row) =>
  row.candidates
    .filter(
      (candidate) =>
        candidate.reviewState ===
        "identityCorrectionPendingSeparateAuthorization",
    )
    .map((coverageCandidate) => {
      const record = candidateById.get(coverageCandidate.candidateId);
      if (!record) {
        fail(
          `Coverage references unknown correction ${coverageCandidate.candidateId}.`,
        );
      }
      const {candidate, packet} = record;
      if (
        candidate.flags?.sanityMutationAllowed !== false ||
        candidate.flags?.publicationEligible !== false
      ) {
        fail(`${candidate.candidateId} has unsafe correction flags.`);
      }
      return {
        candidateId: candidate.candidateId,
        packet,
        releaseVersionId: row.releaseVersionId,
        platform: row.platform,
        version: row.version,
        proposedIdentity: candidate.proposedIdentity,
        productionReconciliation:
          candidate.productionReconciliation,
        reviewArtifactPaths:
          reviewArtifactsByPacket[packet] ?? [],
        duplicateCreationForbidden: true,
        disposition:
          "Excluded from creation handoff; preserve the existing production identity and resolve only through a separately authorized correction.",
      };
    }),
);
const handoffCandidateIds = new Set(
  handoffCandidates.map((candidate) => candidate.candidateId),
);
const correctionCandidateIds = new Set(
  correctionEntries.map((candidate) => candidate.candidateId),
);
if (
  correctionCandidateIds.size !== correctionEntries.length ||
  correctionEntries.some((candidate) =>
    handoffCandidateIds.has(candidate.candidateId),
  )
) {
  fail(
    "Identity corrections must be unique and excluded from the creation handoff.",
  );
}
for (const superseded of coverage.excludedSupersededCandidates ?? []) {
  if (handoffCandidateIds.has(superseded.candidateId)) {
    fail(
      `Superseded candidate ${superseded.candidateId} entered the creation handoff.`,
    );
  }
  if (
    superseded.replacementCandidateId &&
    !handoffCandidateIds.has(superseded.replacementCandidateId)
  ) {
    fail(
      `Reviewed replacement ${superseded.replacementCandidateId} is missing from the creation handoff.`,
    );
  }
}
const excludedPublicBetaIdentities =
  coverage.reviewedExcludedPublicBetaIdentityRecords ?? [];
const handoffIdentityKeys = new Set(
  handoffCandidates.map((candidate) =>
    [
      candidate.releaseVersionId,
      candidate.proposedIdentity.channel,
      candidate.proposedIdentity.routeAlias,
    ].join("\u0000"),
  ),
);
for (const exclusion of excludedPublicBetaIdentities) {
  const identityKey = [
    exclusion.releaseVersionId,
    "publicBeta",
    exclusion.routeAlias,
  ].join("\u0000");
  if (
    exclusion.candidateCreationAllowed !== false ||
    exclusion.sanityMutationAllowed !== false ||
    exclusion.publicationEligible !== false ||
    handoffIdentityKeys.has(identityKey)
  ) {
    fail(
      `Reviewed do-not-create identity ${exclusion.recordId} is unsafe or entered the candidate handoff.`,
    );
  }
}
const reversiblePublicBetaIdentities =
  coverage.reviewedReversiblePublicBetaIdentityRecords ?? [];
const blockedPublicBetaIdentities =
  coverage.reviewedBlockedPublicBetaIdentityRecords ?? [];
const watchosBlockedPublicBetaIdentities =
  blockedPublicBetaIdentities.filter(
    (record) => record.platform === "watchOS",
  );
const tvosBlockedPublicBetaIdentities =
  blockedPublicBetaIdentities.filter(
    (record) => record.platform === "tvOS",
  );
assertSameIdSet(
  "watchos-point-7-26",
  "coverage reversible identities",
  reversiblePublicBetaIdentities.map((record) => record.recordId),
  "review reversible identities",
  watchosPointReview.notProposedReviews.map(
    (record) => record.findingId,
  ),
);
assertSameIdSet(
  "watchos-point-7-26",
  "coverage blocked identities",
  watchosBlockedPublicBetaIdentities.map(
    (record) => record.candidateId,
  ),
  "review blocked identities",
  watchosPointReview.candidateDisposition.blockedCandidateIds,
);
const tvosPointBlockedIds = [
  ...tvosPointReview.blockedAdjudication.newlyBlockedGroups,
  ...tvosPointReview.blockedAdjudication.preblockedGroups,
].flatMap((group) => group.candidateIds);
assertSameIdSet(
  "tvos-point-11-26",
  "coverage blocked identities",
  tvosBlockedPublicBetaIdentities.map(
    (record) => record.candidateId,
  ),
  "review blocked identities",
  tvosPointBlockedIds,
);
for (const identityRecord of [
  ...reversiblePublicBetaIdentities,
  ...blockedPublicBetaIdentities,
]) {
  const proposedIdentity =
    identityRecord.apparentIdentity ??
    identityRecord.proposedIdentity;
  const identityKey = [
    identityRecord.releaseVersionId,
    proposedIdentity.channel,
    proposedIdentity.routeAlias,
  ].join("\u0000");
  if (
    identityRecord.candidateCreationAllowed !== false ||
    identityRecord.sanityMutationAllowed !== false ||
    identityRecord.publicationEligible !== false ||
    handoffIdentityKeys.has(identityKey)
  ) {
    fail(
      `Reviewed reversible/blocked identity ${identityRecord.recordId ?? identityRecord.candidateId} is unsafe or entered the candidate handoff.`,
    );
  }
}
const reversiblePublicBetaFindings =
  coverage.reviewedReversiblePublicBetaFindingRecords ?? [];
assertSameIdSet(
  "tvos-point-11-26",
  "coverage reversible findings",
  reversiblePublicBetaFindings.map((record) => record.recordId),
  "review reversible findings",
  tvosPointReview.notProposedFindingAdjudication
    .reversibleFindingIds,
);
for (const finding of reversiblePublicBetaFindings) {
  if (
    finding.result !== "auditedNoPositiveButReversible" ||
    finding.candidateCreationAllowed !== false ||
    finding.historicalNoPublicBetaConclusionAllowed !== false ||
    finding.sanityMutationAllowed !== false ||
    finding.publicationEligible !== false
  ) {
    fail(
      `Reviewed reversible finding ${finding.recordId} is unsafe or was promoted beyond its final adjudication.`,
    );
  }
}
const reviewedApplicabilityFindings =
  coverage.reviewedPublicBetaApplicabilityRecords ?? [];
for (const finding of reviewedApplicabilityFindings) {
  if (
    (finding.candidateCreationAllowed !== false ||
      finding.sanityMutationAllowed !== false ||
      finding.publicationEligible !== false) &&
    [
      "evidenceBackedNotApplicable",
      "notEstablishedConflict",
      "auditedNoPositiveButReversible",
    ].includes(finding.result)
  ) {
    fail(
      `${finding.findingId} does not preserve its no-candidate applicability boundary.`,
    );
  }
}

const handoff = {
  formatVersion: 1,
  programId: coverage.programId,
  generatedAt: coverage.generatedAt,
  channelScope: ["publicBeta"],
  productionSnapshot: coverage.productionSnapshot,
  purpose:
    "Reviewed public-beta chronology-only handoff for later page-building and guarded mutation planning. This is not an executable Sanity manifest.",
  summary: {
    chronologyApprovedConfirmedMissingCandidateCount:
      handoffCandidates.length,
    representedVersionCount: representedVersionIds.size,
    candidatesByPlatform: countsByPlatform,
    evidenceReferenceCount,
    uniqueCanonicalSourceUrlCount: uniqueSourceUrls.size,
    identityCorrectionExcludedCount: correctionEntries.length,
    evidenceBackedExcludedPublicBetaIdentityCount:
      excludedPublicBetaIdentities.length,
    reversiblePublicBetaIdentityCount:
      reversiblePublicBetaIdentities.length,
    blockedPublicBetaIdentityCount:
      blockedPublicBetaIdentities.length,
    reversiblePublicBetaFindingCount:
      reversiblePublicBetaFindings.length,
    reviewedNoPublicBetaVersionCount:
      coverage.summary.versionCountWithReviewedNoPublicBeta,
    auditedNoPositiveButReversibleVersionCount:
      coverage.summary
        .versionCountAuditedNoPositiveButReversible,
    versionCountNotYetAudited:
      coverage.summary.versionCountNotYetAudited,
    evidenceOrModelingBlockedCandidateCount:
      coverage.summary.structuredCandidateReadiness
        .needsAdditionalEvidence,
    remainingVersionApplicabilityAuditCount:
      coverage.summary
        .versionCountStillNeedingApplicabilityAndSequenceAudit,
  },
  safety: {
    status: "researchHandoffOnly",
    containsExecutableMutationPlan: false,
    publicationEligible: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    pageBuildAllowed: false,
    deploymentAllowed: false,
  },
  requiredBeforeAnyMutationPlan: [
    "Obtain separate user authorization for production mutation.",
    "Rerun the exact published-production identity query for every candidate immediately before planning.",
    "Exclude any candidate whose identity has appeared or changed since the recorded snapshot.",
    "Read every listed independent-review artifact and preserve all mandatory qualifications.",
    "Honor every evidence-backed do-not-create identity and every reversible no-positive applicability finding; never turn absence of located evidence into a historical negative.",
    "Derive stableEventId and document IDs only inside the separately reviewed ingestion layer; never promote candidateId as a production ID.",
    "Resolve and deduplicate canonical sources without changing what each source is cited to prove.",
    "Keep chronology-only public-beta pages timeline-only unless separately researched release-note claims support substantive content.",
  ],
  excludedIdentityCorrections: correctionEntries,
  excludedPublicBetaIdentities,
  reversiblePublicBetaIdentities,
  reversiblePublicBetaFindings,
  blockedPublicBetaIdentities,
  reviewedApplicabilityFindings,
  candidates: handoffCandidates,
};

const outputPath = `${programDirectory}/reviewed-chronology-handoff.json`;
writeFileSync(outputPath, `${JSON.stringify(handoff, null, 2)}\n`);

console.log(
  JSON.stringify({
    outputPath: path.normalize(outputPath),
    candidateCount: handoffCandidates.length,
    representedVersionCount: representedVersionIds.size,
    evidenceReferenceCount,
    uniqueCanonicalSourceUrlCount: uniqueSourceUrls.size,
    identityCorrectionExcludedCount: correctionEntries.length,
    excludedPublicBetaIdentityCount:
      excludedPublicBetaIdentities.length,
    reversiblePublicBetaIdentityCount:
      reversiblePublicBetaIdentities.length,
    blockedPublicBetaIdentityCount:
      blockedPublicBetaIdentities.length,
    reversiblePublicBetaFindingCount:
      reversiblePublicBetaFindings.length,
  }),
);
