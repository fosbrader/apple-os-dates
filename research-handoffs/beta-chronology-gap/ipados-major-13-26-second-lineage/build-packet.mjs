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
const evidenceDir = path.join(repoRoot, evidenceRelativeDir);
const batchId =
  "beta-chronology-gap-ipados-major-13-26-second-lineage";

const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const readJson = async (absolutePath) =>
  JSON.parse(await readFile(absolutePath, "utf8"));
const writeJson = async (filename, value) =>
  writeFile(
    path.join(here, filename),
    `${JSON.stringify(value, null, 2)}\n`,
  );
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const wordCount = (value) =>
  value.trim().split(/\s+/).filter(Boolean).length;
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
  {
    candidateId: "candidate:apple:ipados:14.0:public-beta-6",
    version: "14.0",
    releaseVersionId: "version-ipados-14-0",
    sequence: 6,
    appearanceDate: "2020-08-25",
    sourceId: "imore-ipados14-pb6-pb8",
    sourceClaimDate: "2020-08-25",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:14.0:public-beta-7",
    version: "14.0",
    releaseVersionId: "version-ipados-14-0",
    sequence: 7,
    appearanceDate: "2020-09-03",
    sourceId: "imore-ipados14-pb6-pb8",
    sourceClaimDate: "2020-09-03",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:14.0:public-beta-8",
    version: "14.0",
    releaseVersionId: "version-ipados-14-0",
    sequence: 8,
    appearanceDate: "2020-09-09",
    sourceId: "imore-ipados14-pb6-pb8",
    sourceClaimDate: "2020-09-09",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:15.0:public-beta-5",
    version: "15.0",
    releaseVersionId: "version-ipados-15-0",
    sequence: 5,
    appearanceDate: "2021-08-11",
    sourceId: "imore-ipados15-pb5-pb8",
    sourceClaimDate: "2021-08-11",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:15.0:public-beta-7",
    version: "15.0",
    releaseVersionId: "version-ipados-15-0",
    sequence: 7,
    appearanceDate: "2021-08-25",
    sourceId: "imore-ipados15-pb5-pb8",
    sourceClaimDate: "2021-08-25",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:15.0:public-beta-8",
    version: "15.0",
    releaseVersionId: "version-ipados-15-0",
    sequence: 8,
    appearanceDate: "2021-08-31",
    sourceId: "imore-ipados15-pb5-pb8",
    sourceClaimDate: "2021-08-31",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:16.0:public-beta-4",
    version: "16.0",
    releaseVersionId: "version-ipados-16-0",
    sequence: 4,
    appearanceDate: "2022-08-15",
    sourceId: "iphonetricks-ipados16-pb4",
    sourceClaimDate: "2022-08-15",
    dateAssessment: "directSameDate",
  },
  {
    candidateId: "candidate:apple:ipados:17.0:public-beta-6",
    version: "17.0",
    releaseVersionId: "version-ipados-17-0",
    sequence: 6,
    appearanceDate: "2023-08-29",
    sourceId: "osxd-ipados17-pb6",
    sourceClaimDate: "2023-08-30",
    dateAssessment: "followingDayReportOrdinalOnly",
  },
  {
    candidateId: "candidate:apple:ipados:18.0:public-beta-6",
    version: "18.0",
    releaseVersionId: "version-ipados-18-0",
    sequence: 6,
    appearanceDate: "2024-08-28",
    sourceId: "osxd-ipados18-pb6",
    sourceClaimDate: "2024-08-29",
    dateAssessment: "followingDayReportOrdinalOnly",
  },
];

const sourceDefinitions = [
  {
    sourceId: "imore-ipados14-pb6-pb8",
    canonicalUrl:
      "https://www.imore.com/how-download-ipados-14-public-beta",
    title: "How to download iPadOS 14.7 public beta 5 to your iPad",
    publisher: "iMore",
    publisherFamily: "iMore",
    corporateFamily: "Future plc",
    author: "Joseph Keller",
    publishedAt: "2021-07-08T21:29:03+00:00",
    modifiedAt: "2021-07-08T21:29:03+00:00",
    sourceClass: "livingChronology",
    identificationText:
      "How to download iPadOS 14.7 public beta 5 to your iPad",
    metadataQualification:
      "The current article metadata and title describe its final rolling update; the retained 2020 entries are separately dated inside the living chronology.",
    claims: [
      {
        candidateId: "candidate:apple:ipados:14.0:public-beta-6",
        exactClaimToken: "iPadOS 14 public beta 6",
        claimedAppearanceDate: "2020-08-25",
        locator:
          "The h3 beginning “August 25, 2020:” contains the exact ordinal token; its immediately following paragraph repeats that token and identifies Public Beta Software Program members.",
        dateSupport: "directDatedHistoryHeading",
      },
      {
        candidateId: "candidate:apple:ipados:14.0:public-beta-7",
        exactClaimToken: "iPadOS 14 public beta 7",
        claimedAppearanceDate: "2020-09-03",
        locator:
          "The h3 beginning “September 3, 2020:” contains the exact ordinal token; its immediately following paragraph repeats that token and identifies Public Beta Software Program members.",
        dateSupport: "directDatedHistoryHeading",
      },
      {
        candidateId: "candidate:apple:ipados:14.0:public-beta-8",
        exactClaimToken: "iPadOS 14 public beta 8",
        claimedAppearanceDate: "2020-09-09",
        locator:
          "The h3 beginning “September 9, 2020:” contains the exact ordinal token; its immediately following paragraph repeats that token and identifies Public Beta Software Program members.",
        dateSupport: "directDatedHistoryHeading",
      },
    ],
  },
  {
    sourceId: "imore-ipados15-pb5-pb8",
    canonicalUrl:
      "https://www.imore.com/how-download-ipados-15-public-beta-your-ipad",
    title: "How to download iPadOS 15.6 public beta 3 to your iPad",
    publisher: "iMore",
    publisherFamily: "iMore",
    corporateFamily: "Future plc",
    author: "Christine Chan",
    publishedAt: "2022-06-15T21:27:07+00:00",
    modifiedAt: "2022-06-15T21:27:07+00:00",
    sourceClass: "livingChronology",
    identificationText:
      "How to download iPadOS 15.6 public beta 3 to your iPad",
    metadataQualification:
      "The current article metadata and title describe its final rolling update; the retained 2021 entries are separately dated inside the living chronology.",
    claims: [
      {
        candidateId: "candidate:apple:ipados:15.0:public-beta-5",
        exactClaimToken: "iPadOS 15 public beta 5",
        claimedAppearanceDate: "2021-08-11",
        locator:
          "The h3 beginning “August 11, 2021:” contains the exact ordinal token; its immediately following paragraph calls it the fifth public beta of iPadOS 15.",
        dateSupport: "directDatedHistoryHeading",
      },
      {
        candidateId: "candidate:apple:ipados:15.0:public-beta-7",
        exactClaimToken: "iPadOS 15 public beta 7",
        claimedAppearanceDate: "2021-08-25",
        locator:
          "The h3 beginning “August 25, 2021:” contains the exact ordinal token; its immediately following paragraph calls it the seventh public beta of iPadOS 15.",
        dateSupport: "directDatedHistoryHeading",
      },
      {
        candidateId: "candidate:apple:ipados:15.0:public-beta-8",
        exactClaimToken: "iPadOS 15 public beta 8",
        claimedAppearanceDate: "2021-08-31",
        locator:
          "The h3 beginning “August 31, 2021:” contains the exact ordinal token; its immediately following paragraph calls it the eighth public beta of iPadOS 15.",
        dateSupport: "directDatedHistoryHeading",
      },
    ],
  },
  {
    sourceId: "iphonetricks-ipados16-pb4",
    canonicalUrl:
      "https://www.iphonetricks.org/ios-16-public-beta-4-bugs-fixes-features/",
    archiveUrl:
      "https://web.archive.org/web/20220815223312id_/https://www.iphonetricks.org/ios-16-public-beta-4-bugs-fixes-features/",
    title: "iOS 16 Public Beta 4 Bugs, Fixes, Features [Live Support]",
    publisher: "iPhoneTricks",
    publisherFamily: "iPhoneTricks",
    corporateFamily: null,
    author: "Patricia",
    publishedAt: "2022-08-15T18:30:43-04:00",
    modifiedAt: "2022-08-15T18:30:43-04:00",
    sourceClass: "contemporaneousSecondaryArchived",
    identificationText:
      "iOS 16 Public Beta 4 Bugs, Fixes, Features [Live Support]",
    metadataQualification:
      "The live host currently has a certificate-name mismatch and returns 404 when verification is bypassed. The raw artifact is the Internet Archive capture made at 2022-08-15T22:33:12Z.",
    claims: [
      {
        candidateId: "candidate:apple:ipados:16.0:public-beta-4",
        exactClaimToken: "iPadOS 16 Public Beta 4",
        claimedAppearanceDate: "2022-08-15",
        locator:
          "The article’s terminal Related paragraph explicitly identifies the iPadOS ordinal and build 20A5349b; the article metadata supplies the August 15 publication date.",
        dateSupport: "sameDayArticleMetadata",
      },
    ],
  },
  {
    sourceId: "osxd-ipados17-pb6",
    canonicalUrl:
      "https://osxdaily.com/2023/08/30/ios-17-public-beta-6-released-for-download/",
    title: "iOS 17 Public Beta 6 Released for Download - OS X Daily",
    publisher: "OS X Daily",
    publisherFamily: "OS X Daily",
    corporateFamily: null,
    author: "Paul Horowitz",
    publishedAt: "2023-08-30T15:15:31+00:00",
    modifiedAt: null,
    sourceClass: "followingDaySecondaryReport",
    identificationText:
      "iOS 17 Public Beta 6 Released for Download - OS X Daily",
    metadataQualification:
      "The report was published August 30, one calendar day after the frozen August 29 appearance date. It corroborates the public ordinal but does not independently establish the earlier date.",
    claims: [
      {
        candidateId: "candidate:apple:ipados:17.0:public-beta-6",
        exactClaimToken: "iPadOS 17 public beta 6",
        claimedAppearanceDate: null,
        locator:
          "The lead paragraph explicitly attaches Public Beta 6 to iPadOS 17; the following download-section heading and step 3 repeat the identity.",
        dateSupport: "noneFollowingDayReport",
      },
    ],
  },
  {
    sourceId: "osxd-ipados18-pb6",
    canonicalUrl:
      "https://osxdaily.com/2024/08/29/public-beta-6-of-macos-sequoia-ios-18-ipados-18-available-now/",
    title:
      "Public Beta 6 of MacOS Sequoia, iOS 18, iPadOS 18, Available Now - OS X Daily",
    publisher: "OS X Daily",
    publisherFamily: "OS X Daily",
    corporateFamily: null,
    author: "Paul Horowitz",
    publishedAt: "2024-08-29T21:52:56+00:00",
    modifiedAt: null,
    sourceClass: "followingDaySecondaryReport",
    identificationText:
      "Public Beta 6 of MacOS Sequoia, iOS 18, iPadOS 18, Available Now - OS X Daily",
    metadataQualification:
      "The report was published August 29, one calendar day after the frozen August 28 appearance date. It corroborates the public ordinal but does not independently establish the earlier date.",
    claims: [
      {
        candidateId: "candidate:apple:ipados:18.0:public-beta-6",
        exactClaimToken: "iPadOS 18 public beta 6",
        claimedAppearanceDate: null,
        locator:
          "The lead paragraph explicitly attaches Public Beta 6 to iPadOS 18; the install-section heading and step 3 repeat the identity.",
        dateSupport: "noneFollowingDayReport",
        excludedTextQualification:
          "Do not use the next paragraph, which says “5th public beta” and is internally stale copy inconsistent with the headline, lead, install heading, and install step.",
      },
    ],
  },
];

const parentCandidatesPath = path.join(
  repoRoot,
  parentRelativeDir,
  "candidates.json",
);
const parentReviewPath = path.join(
  repoRoot,
  parentRelativeDir,
  "independent-review.json",
);
const [
  parentCandidatesBytes,
  parentReviewBytes,
  parentCandidatesDocument,
  parentReview,
  fetchManifest,
  productionBytes,
] = await Promise.all([
  readFile(parentCandidatesPath),
  readFile(parentReviewPath),
  readJson(parentCandidatesPath),
  readJson(parentReviewPath),
  readJson(path.join(evidenceDir, "fetch-manifest.json")),
  readFile(path.join(evidenceDir, "production-snapshot.json")),
]);
const productionSnapshot = JSON.parse(productionBytes);
const createdAt = productionSnapshot.capturedAt;

assert(
  parentReview.independentOfResearcher === true,
  "The parent review is not marked independent.",
);
assert(
  parentReview.verdict ===
    "partialPassWithNineBlockedCandidatesAndOneProductionCorrection",
  "Unexpected parent review verdict.",
);
const blockedIds = parentReview.candidateVerdict.blocked;
assert(
  JSON.stringify(blockedIds) ===
    JSON.stringify(expected.map((item) => item.candidateId)),
  "The frozen blocked-candidate list differs from the supplemental scope.",
);
assert(fetchManifest.sourceCount === 5, "Expected five fetched sources.");
assert(
  productionSnapshot.expectedIdentityCount === 9,
  "Expected nine production identity checks.",
);

const parentCandidateById = new Map(
  parentCandidatesDocument.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const blockedReviewById = new Map(
  parentReview.blockedCandidateReviews.map((review) => [
    review.candidateId,
    review,
  ]),
);
const productionById = new Map(
  productionSnapshot.exactChecks.map((check) => [
    check.candidateId,
    check,
  ]),
);
const fetchById = new Map(
  fetchManifest.sources.map((source) => [source.sourceId, source]),
);

for (const item of expected) {
  const parent = parentCandidateById.get(item.candidateId);
  assert(parent, `Missing parent candidate ${item.candidateId}.`);
  assert(
    parent.version === item.version &&
      parent.releaseVersionId === item.releaseVersionId &&
      parent.proposedIdentity.sequence === item.sequence &&
      parent.proposedIdentity.appearanceDate === item.appearanceDate &&
      parent.proposedIdentity.channel === "publicBeta" &&
      parent.proposedIdentity.routeAlias === `public-beta-${item.sequence}` &&
      parent.proposedIdentity.label === `Public Beta ${item.sequence}`,
    `Frozen identity drift for ${item.candidateId}.`,
  );
  assert(
    blockedReviewById.has(item.candidateId),
    `Missing parent blocked review for ${item.candidateId}.`,
  );
}

const sources = [];
for (const definition of sourceDefinitions) {
  const capture = fetchById.get(definition.sourceId);
  assert(capture, `Missing capture ${definition.sourceId}.`);
  const rawPath = path.join(evidenceDir, capture.filename);
  const rawBytes = await readFile(rawPath);
  const rawStat = await stat(rawPath);
  assert(
    rawStat.size === capture.rawBytes &&
      sha256(rawBytes) === capture.rawSha256,
    `Raw hash mismatch for ${definition.sourceId}.`,
  );
  const text = normalizedHtmlText(rawBytes.toString("utf8"));
  for (const claim of definition.claims) {
    assert(
      text.toLowerCase().includes(claim.exactClaimToken.toLowerCase()),
      `${definition.sourceId} is missing ${claim.exactClaimToken}.`,
    );
    if (claim.claimedAppearanceDate) {
      const dateText = new Date(
        `${claim.claimedAppearanceDate}T12:00:00Z`,
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
      assert(
        text.includes(dateText),
        `${definition.sourceId} is missing date text ${dateText}.`,
      );
    }
  }
  const selectedWords = wordCount(definition.identificationText);
  assert(
    selectedWords > 0 && selectedWords <= 20,
    `${definition.sourceId} identification text exceeds 20 words.`,
  );
  assert(
    definition.title.startsWith(definition.identificationText),
    `${definition.sourceId} identification text is not a title prefix.`,
  );
  const selectedFilename = `${definition.sourceId}.identification.txt`;
  const selectedBytes = Buffer.from(`${definition.identificationText}\n`);
  await writeFile(path.join(evidenceDir, selectedFilename), selectedBytes);

  sources.push({
    sourceId: definition.sourceId,
    canonicalUrl: definition.canonicalUrl,
    retrievalUrl: capture.retrievalUrl,
    finalUrl: capture.finalUrl,
    archiveUrl: definition.archiveUrl ?? null,
    title: definition.title,
    publisher: definition.publisher,
    author: definition.author,
    publishedAt: definition.publishedAt,
    modifiedAt: definition.modifiedAt,
    accessedAt: capture.capturedAt,
    status:
      definition.archiveUrl == null
        ? "activeDirectCapture"
        : "liveUnavailableArchivedCapture",
    sourceClass: definition.sourceClass,
    roles: [
      "publicAudience",
      "publicOrdinal",
      "channelIdentity",
      ...(definition.claims.every(
        (claim) => claim.dateSupport !== "noneFollowingDayReport",
      )
        ? ["appearanceDate"]
        : ["followingDayOrdinalCorroboration"]),
    ],
    metadataQualification: definition.metadataQualification,
    evidence: {
      rawPath: path.posix.join(evidenceRelativeDir, capture.filename),
      rawBytes: capture.rawBytes,
      rawSha256: capture.rawSha256,
      captureMethod:
        definition.archiveUrl == null
          ? "direct-http-html"
          : "internet-archive-id-replay-html",
      httpStatus: capture.httpStatus,
      contentType: capture.contentType,
      sslVerifyResult: capture.sslVerifyResult,
      archiveCapture: capture.archive,
      selectedIdentificationText: {
        type: "verbatimHeadlineFragment",
        text: definition.identificationText,
        wordCount: selectedWords,
        maxWords: 20,
        path: path.posix.join(evidenceRelativeDir, selectedFilename),
        bytes: selectedBytes.byteLength,
        sha256: sha256(selectedBytes),
        purpose:
          "Bounded source identification only; candidate facts are mapped by exact-token locators against the hashed raw page.",
      },
      claimLocators: definition.claims,
    },
    lineage: {
      publisherFamily: definition.publisherFamily,
      corporateFamily: definition.corporateFamily,
      independentFromParentExplicitOrdinalPublisherFamily: "iCulture",
      independentForCandidateCorroboration: true,
      qualification:
        "Independence is candidate-level editorial lineage independence from iCulture, the sole explicit public-ordinal lineage identified by the frozen parent review. It does not imply that this publisher family appears nowhere else in the larger parent packet.",
    },
  });
}

const sourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);
const mappings = expected.map((item) => {
  const parent = parentCandidateById.get(item.candidateId);
  const blockedReview = blockedReviewById.get(item.candidateId);
  const source = sourceById.get(item.sourceId);
  const claim = source.evidence.claimLocators.find(
    (locator) => locator.candidateId === item.candidateId,
  );
  const production = productionById.get(item.candidateId);
  assert(claim, `Missing supplemental claim for ${item.candidateId}.`);
  assert(production, `Missing production check for ${item.candidateId}.`);
  const iCultureRef = parent.evidenceRefs.find((ref) =>
    ref.sourceId.startsWith("iculture-"),
  );
  assert(iCultureRef, `Missing iCulture parent ref for ${item.candidateId}.`);

  return {
    candidateId: item.candidateId,
    parentPacket: {
      candidatesPath: `${parentRelativeDir}/candidates.json`,
      independentReviewPath: `${parentRelativeDir}/independent-review.json`,
      frozenIdentity: {
        platform: parent.platform,
        platformId: parent.platformId,
        version: parent.version,
        releaseVersionId: parent.releaseVersionId,
        ...parent.proposedIdentity,
      },
      blockedFinding: blockedReview.finding,
      blocker: blockedReview.blockers[0],
      existingExplicitOrdinalLineage: {
        sourceId: iCultureRef.sourceId,
        publisherFamily: "iCulture",
        locator: iCultureRef.locator,
      },
    },
    supplementalEvidence: {
      sourceId: source.sourceId,
      publisherFamily: source.lineage.publisherFamily,
      corporateFamily: source.lineage.corporateFamily,
      independentFromExistingExplicitOrdinalLineage: true,
      exactClaimToken: claim.exactClaimToken,
      locator: claim.locator,
      publicAudienceExplicit: true,
      publicOrdinalExplicit: true,
      appearanceDateSupport: claim.dateSupport,
    },
    dateAssessment: {
      frozenCandidateDate: item.appearanceDate,
      supplementalSourceDate: item.sourceClaimDate,
      status: item.dateAssessment,
      requiredQualification:
        item.dateAssessment === "followingDayReportOrdinalOnly"
          ? `${source.publisher} published on ${item.sourceClaimDate}, one calendar day after the frozen ${item.appearanceDate} appearance date. Use this source for the explicit public ordinal only; preserve the parent evidence for the appearance date and do not create a second event.`
          : null,
    },
    productionReconciliation: {
      capturedAt: productionSnapshot.capturedAt,
      perspective: productionSnapshot.perspective,
      routeIdentityMatchCount: production.routeIdentityMatchCount,
      sequenceDateMatchCount: production.sequenceDateMatchCount,
      fullCandidateMatchCount: production.fullCandidateMatchCount,
      status:
        production.routeIdentityMatchCount === 0 &&
        production.fullCandidateMatchCount === 0
          ? "confirmedMissingAtSupplementCheck"
          : "productionMatchRequiresReconciliation",
    },
    supplementDisposition: {
      evidenceStatus: "secondExplicitOrdinalLineageLocated",
      reviewStatus: "readyForIndependentReReview",
      chronologyApprovedBySupplementResearcher: false,
      publicationEligible: false,
      sanityMutationAllowed: false,
      productionIdCreationAllowed: false,
    },
  };
});

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt,
  packetKind: "supplementalSecondLineageEvidence",
  objective:
    "Supply a second explicit public-ordinal publisher lineage for the nine candidates blocked by the frozen independent review, without altering or superseding the parent packet.",
  parentPacket: {
    path: parentRelativeDir,
    candidates: {
      path: `${parentRelativeDir}/candidates.json`,
      bytes: parentCandidatesBytes.byteLength,
      sha256: sha256(parentCandidatesBytes),
    },
    independentReview: {
      path: `${parentRelativeDir}/independent-review.json`,
      bytes: parentReviewBytes.byteLength,
      sha256: sha256(parentReviewBytes),
      verdict: parentReview.verdict,
      independentOfResearcher: parentReview.independentOfResearcher,
    },
    mutationPolicy:
      "Read-only. This supplement maps to frozen parent candidates and does not amend parent candidates, sources, conflicts, review, or validation.",
  },
  scope: {
    candidateCount: expected.length,
    sourceCount: sourceDefinitions.length,
    candidateIds: expected.map((item) => item.candidateId),
    platforms: ["iPadOS"],
    versions: ["14.0", "15.0", "16.0", "17.0", "18.0"],
  },
  datePolicy: {
    historicalCalendar: "America/Los_Angeles",
    sourcePublicationDateIsNotAutomaticallyAppearanceDate: true,
    explicitQualificationsRequired: [
      "iPadOS 17.0 Public Beta 6: frozen appearance 2023-08-29; OS X Daily report 2023-08-30.",
      "iPadOS 18.0 Public Beta 6: frozen appearance 2024-08-28; OS X Daily report 2024-08-29.",
    ],
  },
  constraints: {
    noParentPacketEdits: true,
    noIndependentSelfApproval: true,
    noProductionIdCreation: true,
    noSanityWrites: true,
    noDeployment: true,
    productionQueryReadOnly: true,
    boundedIdentificationTextMaximumWords: 20,
    rawEvidenceHashesRequired: true,
  },
  deliverables: [
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
    "validation.json",
  ],
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: fetchManifest.capturedAt,
  sourceCount: sources.length,
  rawSourceCount: sources.length,
  copyrightHandling: {
    rawCaptures:
      "Local evidentiary artifacts only; do not republish full source pages.",
    selectedText:
      "Only a bounded headline fragment of at most 20 words is copied for source identification.",
    claimLocators:
      "Locators identify exact factual tokens and structural positions; they are not article reproductions.",
    downstreamUse:
      "Paraphrase findings, link and credit sources, and preserve source-specific qualifications.",
  },
  sources,
};

const candidateMappingDocument = {
  formatVersion: 1,
  batchId,
  parentBatchId: parentCandidatesDocument.batchId,
  mappingCount: mappings.length,
  summary: {
    secondExplicitOrdinalLineageLocated: mappings.filter(
      (mapping) =>
        mapping.supplementDisposition.evidenceStatus ===
        "secondExplicitOrdinalLineageLocated",
    ).length,
    directSameDateSupport: mappings.filter(
      (mapping) => mapping.dateAssessment.status === "directSameDate",
    ).length,
    followingDayOrdinalOnly: mappings.filter(
      (mapping) =>
        mapping.dateAssessment.status ===
        "followingDayReportOrdinalOnly",
    ).length,
    exactProductionMatches: mappings.reduce(
      (sum, mapping) =>
        sum + mapping.productionReconciliation.fullCandidateMatchCount,
      0,
    ),
    chronologyApprovedBySupplementResearcher: 0,
  },
  mappings,
};

const conflicts = [
  {
    conflictId: "qualification:imore14-living-chronology-metadata",
    candidates: expected
      .filter((item) => item.version === "14.0")
      .map((item) => item.candidateId),
    type: "livingChronologyMetadataLaterThanEntries",
    finding:
      "The live iMore page title and JSON-LD describe its 2021 final rolling update, while the relevant entries are dated 2020 inside the article.",
    resolution:
      "Use the dated h3 entries and following paragraphs for the exact ordinals and dates; do not treat the page-level 2021 publication metadata as any candidate appearance date.",
    unresolved: false,
  },
  {
    conflictId: "qualification:imore15-living-chronology-metadata",
    candidates: expected
      .filter((item) => item.version === "15.0")
      .map((item) => item.candidateId),
    type: "livingChronologyMetadataLaterThanEntries",
    finding:
      "The live iMore page title and JSON-LD describe its 2022 final rolling update, while the relevant entries are dated 2021 inside the article.",
    resolution:
      "Use the dated h3 entries and following paragraphs for the exact ordinals and dates; do not treat the page-level 2022 publication metadata as any candidate appearance date.",
    unresolved: false,
  },
  {
    conflictId: "qualification:iphonetricks-live-host-unavailable",
    candidates: ["candidate:apple:ipados:16.0:public-beta-4"],
    type: "liveAccessFailureArchivedEvidence",
    finding:
      "The live iPhoneTricks host currently presents a certificate-name mismatch, and the unverified target returns HTTP 404.",
    resolution:
      "Use the raw Internet Archive identity replay captured at 2022-08-15T22:33:12Z. Preserve the canonical publisher URL, archive URL, raw hash, and access qualification together.",
    unresolved: false,
  },
  {
    conflictId: "qualification:ipados17-pb6-reporting-lag",
    candidates: ["candidate:apple:ipados:17.0:public-beta-6"],
    type: "followingDayPublication",
    frozenAppearanceDate: "2023-08-29",
    supplementalPublicationDate: "2023-08-30",
    finding:
      "OS X Daily explicitly identifies iPadOS 17 Public Beta 6 but published on August 30 and does not state an August 29 appearance date.",
    resolution:
      "Use OS X Daily only as the second explicit public-ordinal lineage. Preserve August 29 from the frozen parent evidence and treat August 30 as reporting lag, not a second event.",
    unresolved: true,
    reviewerAction:
      "Independent review must carry this qualification into any approval.",
  },
  {
    conflictId: "qualification:ipados18-pb6-reporting-lag",
    candidates: ["candidate:apple:ipados:18.0:public-beta-6"],
    type: "followingDayPublication",
    frozenAppearanceDate: "2024-08-28",
    supplementalPublicationDate: "2024-08-29",
    finding:
      "OS X Daily explicitly identifies iPadOS 18 Public Beta 6 but published on August 29 and does not state an August 28 appearance date.",
    resolution:
      "Use OS X Daily only as the second explicit public-ordinal lineage. Preserve August 28 from the frozen parent evidence and treat August 29 as reporting lag, not a second event.",
    unresolved: true,
    reviewerAction:
      "Independent review must carry this qualification into any approval.",
  },
  {
    conflictId: "qualification:ipados18-pb6-osxd-stale-pb5-copy",
    candidates: ["candidate:apple:ipados:18.0:public-beta-6"],
    type: "internalSourceOrdinalConflict",
    finding:
      "The OS X Daily headline, lead, install heading, and install step identify Public Beta 6, but the next paragraph says “5th public beta,” apparently stale copy from the prior article.",
    resolution:
      "Use only the consistent Public Beta 6 headline/lead/install locators. Exclude the stale Public Beta 5 paragraph and require the independent reviewer to assess the source with this contradiction visible.",
    unresolved: true,
    reviewerAction:
      "Confirm that the repeated PB6 locators are sufficient despite the isolated stale PB5 paragraph.",
  },
];

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  conflictCount: conflicts.length,
  unresolvedQualificationCount: conflicts.filter(
    (conflict) => conflict.unresolved,
  ).length,
  conflicts,
};

const selfReview = {
  formatVersion: 1,
  batchId,
  reviewedAt: createdAt,
  reviewer: "supplement-research-agent-self-check",
  independentOfResearcher: false,
  verdict: "passedMechanicalSelfCheckPendingIndependentReview",
  summary: {
    mappedCandidateCount: mappings.length,
    sourceCount: sources.length,
    rawSourceHashCount: sources.length,
    explicitSupplementalPublicOrdinalCount: mappings.length,
    directSameDateSupportCount:
      candidateMappingDocument.summary.directSameDateSupport,
    followingDayOrdinalOnlyCount:
      candidateMappingDocument.summary.followingDayOrdinalOnly,
    readyForIndependentReReviewCount: mappings.length,
    chronologyApprovedCandidateCount: 0,
    productionIdentityMatchCount:
      candidateMappingDocument.summary.exactProductionMatches,
  },
  checks: {
    parentBlockedCandidateSetMatchedExactly: true,
    parentFilesReadOnlyAndHashed: true,
    rawEvidenceHashesVerified: true,
    boundedIdentificationTextVerified: true,
    exactClaimTokensFoundInRawEvidence: true,
    publisherLineageIndependentFromICulture: true,
    reportingLagQualificationsPreserved: true,
    osxdaily18InternalOrdinalConflictPreserved: true,
    productionQueryReadOnly: true,
    sanityMutationPerformed: false,
    productionIdsCreated: false,
    deploymentPerformed: false,
  },
  limitations: [
    "This is a self-check by the supplement researcher, not an independent chronology approval.",
    "OS X Daily’s August 30, 2023 and August 29, 2024 publication dates independently corroborate the PB6 ordinals, not the frozen prior-day appearance dates.",
    "The iPhoneTricks live URL is currently unavailable; the packet relies on a contemporaneous Internet Archive capture with a preserved hash.",
    "The iPadOS 18 OS X Daily article contains one stale PB5 sentence alongside multiple explicit PB6 locators.",
  ],
  authorization: {
    independentChronologyReviewComplete: false,
    chronologyApprovalGranted: false,
    sanityMutationAllowed: false,
    productionIdCreationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};

const rows = mappings
  .map((mapping) => {
    const identity = mapping.parentPacket.frozenIdentity;
    const source = sourceById.get(
      mapping.supplementalEvidence.sourceId,
    );
    const dateResult =
      mapping.dateAssessment.status === "directSameDate"
        ? "same dated entry"
        : `${mapping.dateAssessment.supplementalSourceDate} report; preserve ${mapping.dateAssessment.frozenCandidateDate}`;
    return `| ${identity.version} | ${identity.label} | ${identity.appearanceDate} | ${source.publisher} | ${dateResult} | 0 |`;
  })
  .join("\n");

const report = `# iPadOS major public-beta second-lineage supplement

This packet supplies candidate-level second publisher lineages for the nine identities that the frozen independent review left evidence-blocked. It does not modify or supersede the parent packet, approve chronology, create production IDs, write Sanity, publish content, or deploy the site.

## Outcome

- All 9 frozen candidate identities have a supplemental source that explicitly attaches the public-beta ordinal to iPadOS.
- Seven candidates have the same appearance date printed in the supplemental source.
- iPadOS 17.0 Public Beta 6 and iPadOS 18.0 Public Beta 6 use following-day OS X Daily reports for ordinal corroboration only. Their frozen August 29, 2023 and August 28, 2024 appearance dates remain dependent on the parent evidence.
- The fresh published-perspective production query found 0 route-identity matches and 0 full-candidate matches among these nine identities.
- Every candidate remains pending an independent chronology re-review.

## Candidate mapping

| Version | Identity | Frozen date | Supplemental publisher | Date handling | Exact production matches |
|---|---|---:|---|---|---:|
${rows}

## Source handling

iMore’s iPadOS 14 and iPadOS 15 pages are living chronologies. Their current titles and page-level metadata describe later rolling updates, so the packet locates the dated historical h3 entry and its following paragraph for each candidate.

The iPhoneTricks live host currently has a TLS hostname mismatch and returns 404 when verification is bypassed. The packet therefore preserves the contemporaneous Internet Archive replay from August 15, 2022, along with its archive URL, raw bytes, and SHA-256.

Only bounded title fragments are copied for source identification. The full raw pages are retained as local evidence and must not be republished. Downstream articles should paraphrase, link, credit, and preserve qualifications.

## Mandatory date qualifications

- iPadOS 17.0 Public Beta 6 remains dated **2023-08-29**. OS X Daily published its explicit PB6 report on **2023-08-30**. That is a following-day report, not a new appearance.
- iPadOS 18.0 Public Beta 6 remains dated **2024-08-28**. OS X Daily published its explicit PB6 report on **2024-08-29**. That is a following-day report, not a new appearance.

The iPadOS 18 OS X Daily page also contains one stale sentence saying “5th public beta.” The headline, lead, install heading, and install step consistently say PB6. The stale PB5 paragraph is excluded from support and remains visible as an internal-source conflict for independent review.

## Production reconciliation

The read-only Sanity query ran at ${productionSnapshot.capturedAt} with published perspective and CDN disabled. It observed:

- ${productionSnapshot.productionCounts.totalReleaseEvents} total published release events;
- ${productionSnapshot.productionCounts.iPadOSPublicBetaEventsAllVersions} iPadOS public-beta events across production;
- ${productionSnapshot.productionCounts.scopedReleaseEvents} events under the five scoped major versions;
- ${productionSnapshot.productionCounts.scopedPublicBetaEvents} scoped public-beta events;
- ${productionSnapshot.productionCounts.routeIdentityMatches} matches for the nine frozen route identities;
- ${productionSnapshot.productionCounts.fullCandidateMatches} full candidate matches.

This snapshot is evidence only. No production mutation was performed.

## Independent-review handoff

An independent reviewer should verify the hashes and locators, assess iMore’s living-chronology status, accept or reject the archived iPhoneTricks evidence, carry the two reporting-lag qualifications, and explicitly assess the internal PB5/PB6 conflict in the iPadOS 18 OS X Daily page. Only that reviewer may amend chronology approval. Any later Sanity mutation requires separate authorization and another immediate production check.
`;

await Promise.all([
  writeJson("assignment.json", assignment),
  writeJson("sources.json", sourcesDocument),
  writeJson("candidate-mapping.json", candidateMappingDocument),
  writeJson("conflicts.json", conflictsDocument),
  writeFile(path.join(here, "production-snapshot.json"), productionBytes),
  writeFile(path.join(here, "report.md"), report),
  writeJson("self-review.json", selfReview),
]);

console.log(
  JSON.stringify(
    {
      batchId,
      candidateCount: mappings.length,
      sourceCount: sources.length,
      conflicts: conflicts.length,
      productionMatches:
        candidateMappingDocument.summary.exactProductionMatches,
      status: selfReview.verdict,
    },
    null,
    2,
  ),
);
