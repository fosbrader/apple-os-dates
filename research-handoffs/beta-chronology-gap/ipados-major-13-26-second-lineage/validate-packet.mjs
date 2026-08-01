import {createHash} from "node:crypto";
import {readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const relativePacketDir =
  "research-handoffs/beta-chronology-gap/ipados-major-13-26-second-lineage";
const parentRelativeDir =
  "research-handoffs/beta-chronology-gap/ipados-major-13-26";
const evidenceRelativeDir =
  "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26-second-lineage";
const batchId =
  "beta-chronology-gap-ipados-major-13-26-second-lineage";
const errors = [];
const checks = {};

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) errors.push(message);
  return condition;
};
const readJson = async (absolutePath) =>
  JSON.parse(await readFile(absolutePath, "utf8"));
const sameJson = (left, right) =>
  JSON.stringify(left) === JSON.stringify(right);
const normalizedHtmlText = (html) =>
  html
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replaceAll(/&#([0-9]+);/g, (_, number) =>
      String.fromCodePoint(Number.parseInt(number, 10)),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();

const expected = [
  ["candidate:apple:ipados:14.0:public-beta-6", "14.0", 6, "2020-08-25"],
  ["candidate:apple:ipados:14.0:public-beta-7", "14.0", 7, "2020-09-03"],
  ["candidate:apple:ipados:14.0:public-beta-8", "14.0", 8, "2020-09-09"],
  ["candidate:apple:ipados:15.0:public-beta-5", "15.0", 5, "2021-08-11"],
  ["candidate:apple:ipados:15.0:public-beta-7", "15.0", 7, "2021-08-25"],
  ["candidate:apple:ipados:15.0:public-beta-8", "15.0", 8, "2021-08-31"],
  ["candidate:apple:ipados:16.0:public-beta-4", "16.0", 4, "2022-08-15"],
  ["candidate:apple:ipados:17.0:public-beta-6", "17.0", 6, "2023-08-29"],
  ["candidate:apple:ipados:18.0:public-beta-6", "18.0", 6, "2024-08-28"],
].map(([candidateId, version, sequence, appearanceDate]) => ({
  candidateId,
  version,
  sequence,
  appearanceDate,
  releaseVersionId: `version-ipados-${version.replaceAll(".", "-")}`,
}));
const expectedIds = expected.map((item) => item.candidateId);

let assignment;
let sourcesDocument;
let mappingDocument;
let conflictsDocument;
let productionSnapshot;
let selfReview;
let parentCandidatesDocument;
let parentReview;
let report;
try {
  [
    assignment,
    sourcesDocument,
    mappingDocument,
    conflictsDocument,
    productionSnapshot,
    selfReview,
    parentCandidatesDocument,
    parentReview,
    report,
  ] = await Promise.all([
    readJson(path.join(here, "assignment.json")),
    readJson(path.join(here, "sources.json")),
    readJson(path.join(here, "candidate-mapping.json")),
    readJson(path.join(here, "conflicts.json")),
    readJson(path.join(here, "production-snapshot.json")),
    readJson(path.join(here, "self-review.json")),
    readJson(path.join(repoRoot, parentRelativeDir, "candidates.json")),
    readJson(
      path.join(repoRoot, parentRelativeDir, "independent-review.json"),
    ),
    readFile(path.join(here, "report.md"), "utf8"),
  ]);
  checks.packetDocumentsParsed = 9;
} catch (error) {
  errors.push(`Unable to parse packet input: ${error.message}`);
}

if (assignment) {
  for (const [filename, document] of [
    ["assignment.json", assignment],
    ["sources.json", sourcesDocument],
    ["candidate-mapping.json", mappingDocument],
    ["conflicts.json", conflictsDocument],
    ["production-snapshot.json", productionSnapshot],
    ["self-review.json", selfReview],
  ]) {
    assert(
      document?.batchId === batchId,
      `${filename} has an unexpected batchId.`,
    );
  }
  checks.batchIdsVerified = 6;

  const parentCandidatesBytes = await readFile(
    path.join(repoRoot, parentRelativeDir, "candidates.json"),
  );
  const parentReviewBytes = await readFile(
    path.join(repoRoot, parentRelativeDir, "independent-review.json"),
  );
  assert(
    assignment.parentPacket.candidates.bytes ===
      parentCandidatesBytes.byteLength &&
      assignment.parentPacket.candidates.sha256 ===
        sha256(parentCandidatesBytes),
    "The frozen parent candidates file differs from assignment.json.",
  );
  assert(
    assignment.parentPacket.independentReview.bytes ===
      parentReviewBytes.byteLength &&
      assignment.parentPacket.independentReview.sha256 ===
        sha256(parentReviewBytes),
    "The frozen parent independent review differs from assignment.json.",
  );
  assert(
    assignment.parentPacket.mutationPolicy.startsWith("Read-only") &&
      assignment.constraints.noParentPacketEdits === true,
    "The parent-packet read-only boundary was weakened.",
  );
  checks.parentFilesHashVerified = 2;

  assert(
    parentReview.independentOfResearcher === true &&
      parentReview.verdict ===
        "partialPassWithNineBlockedCandidatesAndOneProductionCorrection",
    "The parent review is not the expected frozen independent review.",
  );
  assert(
    sameJson(parentReview.candidateVerdict.blocked, expectedIds),
    "The parent blocked list no longer matches the nine-candidate scope.",
  );
  assert(
    sameJson(assignment.scope.candidateIds, expectedIds) &&
      assignment.scope.candidateCount === 9,
    "assignment.json does not preserve the exact nine-candidate scope.",
  );
  checks.parentBlockedScopeVerified = expectedIds.length;

  const parentById = new Map(
    parentCandidatesDocument.candidates.map((candidate) => [
      candidate.candidateId,
      candidate,
    ]),
  );
  const parentBlockedById = new Map(
    parentReview.blockedCandidateReviews.map((review) => [
      review.candidateId,
      review,
    ]),
  );
  const mappingById = new Map(
    mappingDocument.mappings.map((mapping) => [
      mapping.candidateId,
      mapping,
    ]),
  );
  assert(
    mappingDocument.mappingCount === 9 &&
      mappingDocument.mappings.length === 9 &&
      mappingById.size === 9,
    "candidate-mapping.json must contain nine unique mappings.",
  );
  assert(
    sameJson(
      mappingDocument.mappings.map((mapping) => mapping.candidateId),
      expectedIds,
    ),
    "Candidate mapping order or membership drifted.",
  );

  let frozenIdentitiesVerified = 0;
  let supplementalMappingsVerified = 0;
  let directSameDateCount = 0;
  let followingDayCount = 0;
  for (const item of expected) {
    const parent = parentById.get(item.candidateId);
    const blockedReview = parentBlockedById.get(item.candidateId);
    const mapping = mappingById.get(item.candidateId);
    const identity = mapping?.parentPacket.frozenIdentity;
    assert(Boolean(parent), `Missing parent candidate ${item.candidateId}.`);
    assert(
      Boolean(blockedReview),
      `Missing parent blocked review ${item.candidateId}.`,
    );
    assert(Boolean(mapping), `Missing mapping ${item.candidateId}.`);
    if (!parent || !mapping) continue;
    assert(
      identity.version === item.version &&
        identity.releaseVersionId === item.releaseVersionId &&
        identity.sequence === item.sequence &&
        identity.appearanceDate === item.appearanceDate &&
        identity.label === `Public Beta ${item.sequence}` &&
        identity.routeAlias === `public-beta-${item.sequence}` &&
        identity.channel === "publicBeta",
      `Frozen identity drift in ${item.candidateId}.`,
    );
    assert(
      sameJson(identity, {
        platform: parent.platform,
        platformId: parent.platformId,
        version: parent.version,
        releaseVersionId: parent.releaseVersionId,
        ...parent.proposedIdentity,
      }),
      `${item.candidateId} does not exactly map the parent identity.`,
    );
    frozenIdentitiesVerified += 1;
    assert(
      mapping.parentPacket.existingExplicitOrdinalLineage.publisherFamily ===
        "iCulture" &&
        mapping.supplementalEvidence.publisherFamily !== "iCulture" &&
        mapping.supplementalEvidence
          .independentFromExistingExplicitOrdinalLineage === true &&
        mapping.supplementalEvidence.publicAudienceExplicit === true &&
        mapping.supplementalEvidence.publicOrdinalExplicit === true &&
        mapping.supplementDisposition.evidenceStatus ===
          "secondExplicitOrdinalLineageLocated" &&
        mapping.supplementDisposition.reviewStatus ===
          "readyForIndependentReReview" &&
        mapping.supplementDisposition
          .chronologyApprovedBySupplementResearcher === false,
      `${item.candidateId} has an invalid second-lineage disposition.`,
    );
    assert(
      mapping.supplementDisposition.publicationEligible === false &&
        mapping.supplementDisposition.sanityMutationAllowed === false &&
        mapping.supplementDisposition.productionIdCreationAllowed === false,
      `${item.candidateId} has unsafe authorization flags.`,
    );
    if (mapping.dateAssessment.status === "directSameDate") {
      directSameDateCount += 1;
      assert(
        mapping.dateAssessment.supplementalSourceDate ===
          item.appearanceDate &&
          mapping.dateAssessment.requiredQualification === null,
        `${item.candidateId} has an invalid direct-date assessment.`,
      );
    } else if (
      mapping.dateAssessment.status === "followingDayReportOrdinalOnly"
    ) {
      followingDayCount += 1;
      const dayDelta =
        (Date.parse(`${mapping.dateAssessment.supplementalSourceDate}T12:00:00Z`) -
          Date.parse(`${item.appearanceDate}T12:00:00Z`)) /
        86_400_000;
      assert(
        dayDelta === 1 &&
          mapping.dateAssessment.requiredQualification.includes(
            item.appearanceDate,
          ) &&
          mapping.dateAssessment.requiredQualification.includes(
            mapping.dateAssessment.supplementalSourceDate,
          ) &&
          mapping.dateAssessment.requiredQualification.includes(
            "do not create a second event",
          ),
        `${item.candidateId} does not preserve the following-day qualification.`,
      );
    } else {
      errors.push(
        `${item.candidateId} has unknown date status ${mapping.dateAssessment.status}.`,
      );
    }
    supplementalMappingsVerified += 1;
  }
  checks.frozenIdentitiesVerified = frozenIdentitiesVerified;
  checks.supplementalMappingsVerified = supplementalMappingsVerified;
  checks.directSameDateMappings = directSameDateCount;
  checks.followingDayOrdinalOnlyMappings = followingDayCount;
  assert(
    directSameDateCount === 7 && followingDayCount === 2,
    "Expected seven same-date mappings and two following-day ordinal-only mappings.",
  );

  const sources = sourcesDocument.sources;
  const sourceById = new Map(
    sources.map((source) => [source.sourceId, source]),
  );
  assert(
    sourcesDocument.sourceCount === 5 &&
      sourcesDocument.rawSourceCount === 5 &&
      sources.length === 5 &&
      sourceById.size === 5,
    "sources.json must contain five unique sources.",
  );
  let rawSourcesVerified = 0;
  let selectedTextsVerified = 0;
  let claimLocatorsVerified = 0;
  for (const source of sources) {
    assert(
      source.lineage.publisherFamily !== "iCulture" &&
        source.lineage.independentFromParentExplicitOrdinalPublisherFamily ===
          "iCulture" &&
        source.lineage.independentForCandidateCorroboration === true,
      `${source.sourceId} has an invalid lineage declaration.`,
    );
    const rawAbsolute = path.join(repoRoot, source.evidence.rawPath);
    const selected =
      source.evidence.selectedIdentificationText;
    const selectedAbsolute = path.join(repoRoot, selected.path);
    const [rawBytes, selectedBytes] = await Promise.all([
      readFile(rawAbsolute),
      readFile(selectedAbsolute),
    ]);
    assert(
      rawBytes.byteLength === source.evidence.rawBytes &&
        sha256(rawBytes) === source.evidence.rawSha256,
      `${source.sourceId} raw evidence hash mismatch.`,
    );
    assert(
      selectedBytes.byteLength === selected.bytes &&
        sha256(selectedBytes) === selected.sha256 &&
        selectedBytes.toString("utf8") === `${selected.text}\n` &&
        selected.type === "verbatimHeadlineFragment" &&
        selected.wordCount > 0 &&
        selected.wordCount <= 20 &&
        selected.maxWords === 20 &&
        source.title.startsWith(selected.text),
      `${source.sourceId} bounded identification text is invalid.`,
    );
    rawSourcesVerified += 1;
    selectedTextsVerified += 1;
    const rawText = normalizedHtmlText(rawBytes.toString("utf8"));
    for (const locator of source.evidence.claimLocators) {
      const expectedItem = expected.find(
        (item) => item.candidateId === locator.candidateId,
      );
      const mapping = mappingById.get(locator.candidateId);
      assert(
        Boolean(expectedItem) &&
          mapping?.supplementalEvidence.sourceId === source.sourceId,
        `${source.sourceId} has an unmapped locator ${locator.candidateId}.`,
      );
      if (!expectedItem) continue;
      const expectedToken =
        `iPadOS ${expectedItem.version.split(".")[0]} public beta ${expectedItem.sequence}`;
      assert(
        locator.exactClaimToken.toLowerCase() ===
          expectedToken.toLowerCase() &&
          rawText
            .toLowerCase()
            .includes(locator.exactClaimToken.toLowerCase()) &&
          locator.locator.length > 30,
        `${source.sourceId} does not preserve an exact ordinal token for ${locator.candidateId}.`,
      );
      claimLocatorsVerified += 1;
    }
  }
  checks.rawSourcesVerified = rawSourcesVerified;
  checks.boundedIdentificationTextsVerified =
    selectedTextsVerified;
  checks.exactClaimLocatorsVerified = claimLocatorsVerified;
  assert(
    rawSourcesVerified === 5 &&
      selectedTextsVerified === 5 &&
      claimLocatorsVerified === 9,
    "Source evidence verification counts are incomplete.",
  );

  const archivedSource = sourceById.get("iphonetricks-ipados16-pb4");
  assert(
    archivedSource.status === "liveUnavailableArchivedCapture" &&
      archivedSource.evidence.captureMethod ===
        "internet-archive-id-replay-html" &&
      archivedSource.archiveUrl.includes("20220815223312id_") &&
      archivedSource.evidence.archiveCapture.captureTimestamp ===
        "2022-08-15T22:33:12Z",
    "The iPhoneTricks archived-source qualification is incomplete.",
  );
  checks.archivedSourceQualificationVerified = true;

  assert(
    productionSnapshot.perspective === "published" &&
      productionSnapshot.useCdn === false &&
      productionSnapshot.expectedIdentityCount === 9 &&
      productionSnapshot.exactChecks.length === 9 &&
      productionSnapshot.safety.queryOnly === true &&
      productionSnapshot.safety.sanityMutationPerformed === false &&
      productionSnapshot.safety.productionIdsCreated === false &&
      productionSnapshot.safety.deploymentPerformed === false,
    "The production snapshot is not a nine-identity read-only query.",
  );
  let productionChecksVerified = 0;
  for (const check of productionSnapshot.exactChecks) {
    const mapping = mappingById.get(check.candidateId);
    assert(
      Boolean(mapping) &&
        check.routeIdentityMatchCount === 0 &&
        check.sequenceDateMatchCount === 0 &&
        check.fullCandidateMatchCount === 0 &&
        check.routeIdentityMatches.length === 0 &&
        check.sequenceDateMatches.length === 0 &&
        check.fullCandidateMatches.length === 0 &&
        mapping.productionReconciliation.capturedAt ===
          productionSnapshot.capturedAt &&
        mapping.productionReconciliation.status ===
          "confirmedMissingAtSupplementCheck",
      `${check.candidateId} has an unexpected production match or stale mapping.`,
    );
    productionChecksVerified += 1;
  }
  checks.productionExactIdentitiesVerified =
    productionChecksVerified;
  assert(
    productionSnapshot.productionCounts.routeIdentityMatches === 0 &&
      productionSnapshot.productionCounts.fullCandidateMatches === 0,
    "The production snapshot contains a target match.",
  );

  assert(
    conflictsDocument.conflictCount === 6 &&
      conflictsDocument.conflicts.length === 6 &&
      conflictsDocument.unresolvedQualificationCount === 3,
    "Conflict counts drifted.",
  );
  const conflictById = new Map(
    conflictsDocument.conflicts.map((conflict) => [
      conflict.conflictId,
      conflict,
    ]),
  );
  const lag17 = conflictById.get(
    "qualification:ipados17-pb6-reporting-lag",
  );
  const lag18 = conflictById.get(
    "qualification:ipados18-pb6-reporting-lag",
  );
  const stale18 = conflictById.get(
    "qualification:ipados18-pb6-osxd-stale-pb5-copy",
  );
  assert(
    lag17?.frozenAppearanceDate === "2023-08-29" &&
      lag17?.supplementalPublicationDate === "2023-08-30" &&
      lag17?.unresolved === true,
    "The August 29/August 30 iPadOS 17 qualification is missing.",
  );
  assert(
    lag18?.frozenAppearanceDate === "2024-08-28" &&
      lag18?.supplementalPublicationDate === "2024-08-29" &&
      lag18?.unresolved === true,
    "The August 28/August 29 iPadOS 18 qualification is missing.",
  );
  assert(
    stale18?.type === "internalSourceOrdinalConflict" &&
      stale18?.finding.includes("5th public beta") &&
      stale18?.resolution.includes("Public Beta 6") &&
      stale18?.unresolved === true,
    "The OS X Daily PB5/PB6 internal conflict is missing.",
  );
  checks.mandatoryQualificationsVerified = 3;

  assert(
    report.includes("2023-08-29") &&
      report.includes("2023-08-30") &&
      report.includes("2024-08-28") &&
      report.includes("2024-08-29") &&
      report.includes("stale sentence") &&
      report.includes("No production mutation was performed"),
    "report.md omits a required qualification or safety statement.",
  );
  checks.reportQualificationsVerified = true;

  assert(
    selfReview.independentOfResearcher === false &&
      selfReview.verdict ===
        "passedMechanicalSelfCheckPendingIndependentReview" &&
      selfReview.summary.chronologyApprovedCandidateCount === 0 &&
      selfReview.summary.readyForIndependentReReviewCount === 9 &&
      selfReview.authorization.independentChronologyReviewComplete ===
        false &&
      selfReview.authorization.chronologyApprovalGranted === false &&
      selfReview.authorization.sanityMutationAllowed === false &&
      selfReview.authorization.productionIdCreationAllowed === false &&
      selfReview.authorization.publicationEligible === false &&
      selfReview.authorization.deploymentAllowed === false,
    "self-review.json incorrectly claims independence, approval, or mutation authority.",
  );
  assert(
    assignment.constraints.noIndependentSelfApproval === true &&
      assignment.constraints.noProductionIdCreation === true &&
      assignment.constraints.noSanityWrites === true &&
      assignment.constraints.noDeployment === true &&
      assignment.constraints.productionQueryReadOnly === true,
    "assignment.json safety constraints were weakened.",
  );
  checks.safetyBoundaryVerified = true;
}

const lockedFiles = [
  "assignment.json",
  "sources.json",
  "candidate-mapping.json",
  "conflicts.json",
  "production-snapshot.json",
  "report.md",
  "self-review.json",
  "fetch-sources.mjs",
  "build-packet.mjs",
  "query-production.ts",
  "validate-packet.mjs",
];
const fileLocks = [];
for (const filename of lockedFiles) {
  const bytes = await readFile(path.join(here, filename));
  fileLocks.push({
    path: `${relativePacketDir}/${filename}`,
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  });
}
checks.packetFilesLocked = fileLocks.length;

const evidenceFiles = [
  "fetch-manifest.json",
  "production-snapshot.json",
  ...sourcesDocument.sources.flatMap((source) => [
    path.basename(source.evidence.rawPath),
    path.basename(source.evidence.selectedIdentificationText.path),
  ]),
];
const uniqueEvidenceFiles = [...new Set(evidenceFiles)].sort();
const evidenceLocks = [];
for (const filename of uniqueEvidenceFiles) {
  const absolutePath = path.join(
    repoRoot,
    evidenceRelativeDir,
    filename,
  );
  const bytes = await readFile(absolutePath);
  const fileStat = await stat(absolutePath);
  evidenceLocks.push({
    path: `${evidenceRelativeDir}/${filename}`,
    bytes: fileStat.size,
    sha256: sha256(bytes),
  });
}
checks.evidenceFilesLocked = evidenceLocks.length;

const parentLocks = [
  assignment.parentPacket.candidates,
  assignment.parentPacket.independentReview,
];
checks.parentFilesLocked = parentLocks.length;

const validation = {
  formatVersion: 1,
  batchId,
  validatedAt: new Date().toISOString(),
  status:
    errors.length === 0
      ? "passedSelfCheckPendingIndependentReview"
      : "failed",
  independentReviewComplete: false,
  chronologyApprovalGranted: false,
  checks,
  counts: {
    candidatesMapped: mappingDocument?.mappings.length ?? 0,
    supplementalSources: sourcesDocument?.sources.length ?? 0,
    rawSourcesVerified: checks.rawSourcesVerified ?? 0,
    exactClaimLocators: checks.exactClaimLocatorsVerified ?? 0,
    directSameDateMappings: checks.directSameDateMappings ?? 0,
    followingDayOrdinalOnlyMappings:
      checks.followingDayOrdinalOnlyMappings ?? 0,
    productionTargetMatches:
      productionSnapshot?.productionCounts.fullCandidateMatches ?? null,
    conflicts: conflictsDocument?.conflicts.length ?? 0,
  },
  blockers: [
    "An independent chronology reviewer has not reviewed this supplement.",
    "The 2023-08-30 and 2024-08-29 OS X Daily pages corroborate the PB6 ordinals, not the frozen prior-day appearance dates.",
    "The iPadOS 18 OS X Daily page contains an internal stale PB5 sentence that the independent reviewer must assess.",
    "No Sanity mutation, production ID creation, publication, or deployment is authorized by this packet.",
  ],
  parentLocks,
  fileLocks,
  evidenceLocks,
  safety: {
    parentPacketModified: false,
    sanityMutationPerformed: false,
    sanityMutationAllowed: false,
    productionIdsCreated: false,
    productionIdCreationAllowed: false,
    publicationEligible: false,
    deploymentPerformed: false,
    deploymentAllowed: false,
  },
  errors,
};

await writeFile(
  path.join(here, "validation.json"),
  `${JSON.stringify(validation, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      status: validation.status,
      counts: validation.counts,
      packetFileLocks: fileLocks.length,
      evidenceLocks: evidenceLocks.length,
      errors,
    },
    null,
    2,
  ),
);

if (errors.length > 0) process.exitCode = 1;
