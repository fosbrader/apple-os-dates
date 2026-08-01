#!/usr/bin/env node

import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const parentDir = path.resolve(packetDir, "..", "macos-point-15-26");
const packetPath =
  "research-handoffs/beta-chronology-gap/macos-point-15-26-followup";
const parentPath =
  "research-handoffs/beta-chronology-gap/macos-point-15-26";
const batchId = "beta-chronology-gap-macos-point-15-26-followup";
const timezone = "America/Los_Angeles";
const researchCutoff = "2026-07-31";

const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, "utf8"));
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const words = (value) =>
  value.trim() ? value.trim().split(/\s+/u).length : 0;
const decodeHtml = (value) =>
  value
    .replaceAll("&#8211;", "–")
    .replaceAll("&#8212;", "—")
    .replaceAll("&#8217;", "’")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .trim();
const pacificDate = (publishedAt) => {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Unparseable publisher datetime: ${publishedAt}`);
  }
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};
const writeJson = (name, value) =>
  writeFile(
    path.join(packetDir, name),
    `${JSON.stringify(value, null, 2)}\n`,
  );

const [
  parentCandidatesBytes,
  parentReviewBytes,
  parentPacketLocksBytes,
  parentRawLocksBytes,
  parentSourcesBytes,
  fetchLog,
  production,
] = await Promise.all([
  readFile(path.join(parentDir, "candidates.json")),
  readFile(path.join(parentDir, "independent-review.json")),
  readFile(path.join(parentDir, "packet-locks.json")),
  readFile(path.join(parentDir, "raw-evidence-locks.json")),
  readFile(path.join(parentDir, "sources.json")),
  readJson(path.join(packetDir, "fetch-log.json")),
  readJson(path.join(packetDir, "production-snapshot.json")),
]);
const parentCandidatesLedger = JSON.parse(parentCandidatesBytes);
const parentReview = JSON.parse(parentReviewBytes);
const parentSourcesLedger = JSON.parse(parentSourcesBytes);
const parentSourceById = new Map(
  parentSourcesLedger.sources.map((source) => [source.sourceId, source]),
);
const parentCandidateById = new Map(
  parentCandidatesLedger.candidates.map((candidate) => [
    candidate.candidateId,
    candidate,
  ]),
);
const blockedIds =
  parentReview.candidateDisposition.blockedCandidateIds;

if (blockedIds.length !== 8) {
  throw new Error(`Expected 8 parent-review blockers, found ${blockedIds.length}.`);
}
if (
  fetchLog.sourceArtifactCount !== 15 ||
  fetchLog.successCount !== 15 ||
  fetchLog.failureCount !== 0
) {
  throw new Error("The supplement requires 15 successful raw captures.");
}
if (
  production.targetCandidateCount !== 8 ||
  production.parentChecks.some((check) => !check.exists) ||
  production.productionCounts.exactRouteMatches !== 0 ||
  production.productionCounts.exactFullMatches !== 0
) {
  throw new Error("Fresh production reconciliation does not prove full absence.");
}

const fetchById = new Map(
  fetchLog.results.map((result) => [result.rawId, result]),
);
const rawArtifacts = [];
for (const result of fetchLog.results) {
  const raw = await readFile(path.resolve(repoRoot, result.rawPath));
  if (raw.byteLength !== result.rawBytes) {
    throw new Error(`Raw byte count changed for ${result.rawId}.`);
  }
  rawArtifacts.push({
    rawId: result.rawId,
    candidateId: result.candidateId,
    publisher: result.publisher,
    publisherFamily: result.publisherFamily,
    canonicalUrl: result.url,
    finalUrl: result.finalUrl,
    mediaType: result.mediaType,
    captureKind: result.captureKind,
    capturedAt: fetchLog.fetchedAt,
    rawPath: result.rawPath,
    rawBytes: raw.byteLength,
    rawSha256: sha256(raw),
  });
}
const rawById = new Map(
  rawArtifacts.map((artifact) => [artifact.rawId, artifact]),
);

const sourceDefinitions = [
  {
    sourceId: "monomaniac-151-pb3-followup",
    candidateId: "candidate:apple:macos:15.1:public-beta-3",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-151-pb3-html",
    apiRawId: "monomaniac-151-pb3-api",
    expectedPostId: 53035,
    expectedTitle: "macOS 15.1 Sequoia Public Beta 3 (24B5070a)",
    expectedPacificDate: "2024-10-07",
  },
  {
    sourceId: "monomaniac-153-pb3-followup",
    candidateId: "candidate:apple:macos:15.3:public-beta-3",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-153-pb3-html",
    apiRawId: "monomaniac-153-pb3-api",
    expectedPostId: 53933,
    expectedTitle: "macOS 15.3 Sequoia Public Beta 3 (24D5055b)",
    expectedPacificDate: "2025-01-16",
  },
  {
    sourceId: "macerkopf-154-pb1-followup",
    candidateId: "candidate:apple:macos:15.4:public-beta-1",
    publisher: "Macerkopf",
    publisherFamily: "Macerkopf",
    htmlRawId: "macerkopf-154-pb1-html",
    expectedTitle:
      "Public Betas sind da: iOS 18.4, iPadOS 18.4 und macOS 15.4",
    claimText:
      "Apple gibt Public Beta 1 zu iOS 18.4, iPadOS 18.4 und macOS 15.4 frei",
    expectedPublishedAt: "2025-02-24T18:38:01+00:00",
    expectedPacificDate: "2025-02-24",
  },
  {
    sourceId: "monomaniac-154-pb4-followup",
    candidateId: "candidate:apple:macos:15.4:public-beta-4",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-154-pb4-html",
    apiRawId: "monomaniac-154-pb4-api",
    expectedPostId: 54366,
    expectedTitle: "macOS Sequoia 15.4 Public Beta 4 (24E5238a)",
    expectedPacificDate: "2025-03-17",
  },
  {
    sourceId: "monomaniac-155-pb3-metadata-followup",
    candidateId: "candidate:apple:macos:15.5:public-beta-3",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-155-pb3-html",
    apiRawId: "monomaniac-155-pb3-api",
    expectedPostId: 54767,
    expectedTitle: "macOS Sequoia 15.5 Public Beta 3 (24F5068b)",
    expectedPacificDate: "2025-04-29",
  },
  {
    sourceId: "monomaniac-264-pb4-followup",
    candidateId: "candidate:apple:macos:26.4:public-beta-4",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-264-pb4-html",
    apiRawId: "monomaniac-264-pb4-api",
    expectedPostId: 58779,
    expectedTitle: "macOS Tahoe 26.4 Public Beta 4 (25E5233c)",
    expectedPacificDate: "2026-03-09",
  },
  {
    sourceId: "monomaniac-265-pb3-followup",
    candidateId: "candidate:apple:macos:26.5:public-beta-3",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-265-pb3-html",
    apiRawId: "monomaniac-265-pb3-api",
    expectedPostId: 59442,
    expectedTitle: "macOS Tahoe 26.5 Public Beta 3 (25F5068a)",
    expectedPacificDate: "2026-04-27",
  },
  {
    sourceId: "monomaniac-266-pb3-followup",
    candidateId: "candidate:apple:macos:26.6:public-beta-3",
    publisher: "Monomaniac Garage",
    publisherFamily: "Monomaniac Garage",
    htmlRawId: "monomaniac-266-pb3-html",
    apiRawId: "monomaniac-266-pb3-api",
    expectedPostId: 60130,
    expectedTitle: "macOS Tahoe 26.6 Public Beta 3 (25G5052e)",
    expectedPacificDate: "2026-06-30",
  },
];

const sources = [];
for (const definition of sourceDefinitions) {
  const htmlArtifact = rawById.get(definition.htmlRawId);
  if (!htmlArtifact) {
    throw new Error(`Missing HTML capture ${definition.htmlRawId}.`);
  }
  const html = await readFile(
    path.resolve(repoRoot, htmlArtifact.rawPath),
    "utf8",
  );

  let publishedAt;
  let title;
  let canonicalUrl;
  let rawRefs;
  let metadataProof;
  if (definition.apiRawId) {
    const apiArtifact = rawById.get(definition.apiRawId);
    if (!apiArtifact) {
      throw new Error(`Missing API capture ${definition.apiRawId}.`);
    }
    const apiRaw = await readFile(
      path.resolve(repoRoot, apiArtifact.rawPath),
      "utf8",
    );
    const post = JSON.parse(apiRaw);
    if (post.id !== definition.expectedPostId) {
      throw new Error(`Unexpected publisher post ID for ${definition.sourceId}.`);
    }
    title = decodeHtml(post.title.rendered);
    publishedAt = `${post.date_gmt}Z`;
    canonicalUrl = post.link;
    rawRefs = [htmlArtifact, apiArtifact];
    metadataProof = {
      publisherPostId: post.id,
      publisherLocalDatetime: post.date,
      publisherGmtDatetime: post.date_gmt,
      gmtInterpretedAsUtc: publishedAt,
      pacificDate: pacificDate(publishedAt),
    };
    if (!apiRaw.includes(definition.expectedTitle)) {
      throw new Error(`Exact title absent from API record: ${definition.sourceId}.`);
    }
  } else {
    const publishedMatch = html.match(
      /article:published_time"\s+content="([^"]+)"/u,
    );
    if (!publishedMatch) {
      throw new Error(`Publisher datetime absent for ${definition.sourceId}.`);
    }
    publishedAt = publishedMatch[1];
    title = definition.expectedTitle;
    canonicalUrl = htmlArtifact.finalUrl;
    rawRefs = [htmlArtifact];
    metadataProof = {
      embeddedMetadataField: "article:published_time",
      publisherDatetime: publishedAt,
      pacificDate: pacificDate(publishedAt),
    };
  }

  if (title !== definition.expectedTitle) {
    throw new Error(
      `Unexpected exact title for ${definition.sourceId}: ${title}`,
    );
  }
  if (pacificDate(publishedAt) !== definition.expectedPacificDate) {
    throw new Error(`Pacific-date mismatch for ${definition.sourceId}.`);
  }
  const claimText = definition.claimText ?? title;
  if (
    !html.includes(claimText) &&
    !(definition.apiRawId &&
      (
        await readFile(
          path.resolve(repoRoot, rawById.get(definition.apiRawId).rawPath),
          "utf8",
        )
      ).includes(claimText))
  ) {
    throw new Error(`Selected claim absent for ${definition.sourceId}.`);
  }
  if (words(claimText) > 20) {
    throw new Error(`Selected claim exceeds 20 words for ${definition.sourceId}.`);
  }

  sources.push({
    sourceId: definition.sourceId,
    candidateId: definition.candidateId,
    canonicalUrl,
    title,
    publisher: definition.publisher,
    publisherFamily: definition.publisherFamily,
    sourceClass: "contemporaneousSecondary",
    accessedAt: researchCutoff,
    publishedAt,
    appearanceDatePacific: definition.expectedPacificDate,
    roles: [
      "platformApplicability",
      "versionIdentity",
      "publicBetaChannel",
      "displayedPublicOrdinal",
      "appearanceDate",
    ],
    claimFinding:
      definition.candidateId ===
      "candidate:apple:macos:15.5:public-beta-3"
        ? "The publisher independently displays Public Beta 3, but its public GMT metadata normalizes to April 29 Pacific, not the parent candidate's proposed April 28 date."
        : "The title or heading explicitly displays the exact macOS version and Public Beta ordinal; public publisher metadata normalizes to the stated America/Los_Angeles appearance date.",
    evidence: {
      rawArtifacts: rawRefs.map((artifact) => ({
        rawId: artifact.rawId,
        rawPath: artifact.rawPath,
        rawBytes: artifact.rawBytes,
        rawSha256: artifact.rawSha256,
        mediaType: artifact.mediaType,
        captureKind: artifact.captureKind,
      })),
      metadataProof,
      selectedText: {
        text: claimText,
        wordCount: words(claimText),
        maxWords: 20,
        sha256: sha256(claimText),
        supports: [
          "platformApplicability",
          "versionIdentity",
          "publicBetaChannel",
          "displayedPublicOrdinal",
        ],
      },
    },
    lineage: {
      independentForCorroboration: true,
      note:
        "The HTML page and WordPress API record are two artifacts from one editorial lineage and count only once.",
    },
  });
}

const newSourceById = new Map(
  sources.map((source) => [source.sourceId, source]),
);
const readyDefinitions = [
  [
    "candidate:apple:macos:15.1:public-beta-3",
    "9to5-151-cycle",
    "monomaniac-151-pb3-followup",
  ],
  [
    "candidate:apple:macos:15.4:public-beta-1",
    "mr-154-pb1",
    "macerkopf-154-pb1-followup",
  ],
  [
    "candidate:apple:macos:15.4:public-beta-4",
    "9to5-154-cycle",
    "monomaniac-154-pb4-followup",
  ],
  [
    "candidate:apple:macos:26.4:public-beta-4",
    "9to5-264-pb4",
    "monomaniac-264-pb4-followup",
  ],
  [
    "candidate:apple:macos:26.5:public-beta-3",
    "9to5-265-pb3",
    "monomaniac-265-pb3-followup",
  ],
  [
    "candidate:apple:macos:26.6:public-beta-3",
    "mr-266-pb3",
    "monomaniac-266-pb3-followup",
  ],
];
const readyById = new Map(
  readyDefinitions.map(([candidateId, parentSourceId, supplementSourceId]) => [
    candidateId,
    {parentSourceId, supplementSourceId},
  ]),
);
const productionById = new Map(
  production.exactChecks.map((check) => [check.candidateId, check]),
);

const parentEvidenceRef = (sourceId, selectedFor) => {
  const source = parentSourceById.get(sourceId);
  if (!source) throw new Error(`Unknown frozen parent source ${sourceId}.`);
  return {
    kind: "frozenParentSource",
    sourceId,
    packetPath: `${parentPath}/sources.json`,
    publisher: source.publisher,
    publisherFamily: source.lineage.publisherFamily,
    canonicalUrl: source.canonicalUrl,
    rawPath: source.evidence.rawPath,
    rawSha256: source.evidence.rawSha256,
    selectedFor,
  };
};
const supplementEvidenceRef = (sourceId, selectedFor) => {
  const source = newSourceById.get(sourceId);
  if (!source) throw new Error(`Unknown supplement source ${sourceId}.`);
  return {
    kind: "supplementSource",
    sourceId,
    packetPath: `${packetPath}/sources.json`,
    publisher: source.publisher,
    publisherFamily: source.publisherFamily,
    canonicalUrl: source.canonicalUrl,
    publishedAt: source.publishedAt,
    appearanceDatePacific: source.appearanceDatePacific,
    selectedTextSha256: source.evidence.selectedText.sha256,
    selectedFor,
  };
};

const mappings = blockedIds.map((candidateId) => {
  const candidate = parentCandidateById.get(candidateId);
  if (!candidate) throw new Error(`Missing parent candidate ${candidateId}.`);
  const exactCheck = productionById.get(candidateId);
  if (
    !exactCheck ||
    exactCheck.routeIdentityMatchCount !== 0 ||
    exactCheck.fullCandidateMatchCount !== 0
  ) {
    throw new Error(`Production absence not established for ${candidateId}.`);
  }
  const identity = {
    candidateId,
    platform: candidate.platform,
    platformId: candidate.platformId,
    version: candidate.version,
    releaseVersionId: candidate.releaseVersionId,
    proposedIdentity: candidate.proposedIdentity,
  };
  const ready = readyById.get(candidateId);
  const base = {
    candidateId,
    identity,
    identityPreservedUnchanged: true,
    parentCandidateRecordSha256: sha256(
      `${JSON.stringify(candidate)}\n`,
    ),
    identityFingerprintSha256: sha256(JSON.stringify(identity)),
    parentReviewDisposition: "blocked",
    productionReconciliation: {
      queriedAt: production.capturedAt,
      perspective: production.perspective,
      useCdn: production.useCdn,
      parentExists: production.parentChecks.some(
        (check) =>
          check.releaseVersionId === candidate.releaseVersionId && check.exists,
      ),
      exactRouteIdentityMatchCount: exactCheck.routeIdentityMatchCount,
      exactFullCandidateMatchCount: exactCheck.fullCandidateMatchCount,
      result: "confirmedMissing",
    },
    flags: {
      sanityMutationAllowed: false,
      stableEventIdCreationAllowed: false,
      publicationEligible: false,
      pageWorkAllowed: false,
      deploymentAllowed: false,
    },
    independentReview: {
      status: "pending",
      required: true,
    },
  };
  if (ready) {
    const parentRef = parentEvidenceRef(
      ready.parentSourceId,
      "First exact publisher lineage for the complete submitted identity.",
    );
    const supplementRef = supplementEvidenceRef(
      ready.supplementSourceId,
      "Second independent exact publisher lineage for the complete submitted identity.",
    );
    if (
      parentRef.publisherFamily === supplementRef.publisherFamily
    ) {
      throw new Error(`Non-independent selected lineages for ${candidateId}.`);
    }
    return {
      ...base,
      researchDisposition: "evidenceReadyPendingIndependentReview",
      retainedParentEvidenceRefs: [parentRef],
      supplementEvidenceRefs: [supplementRef],
      selectedEvidenceRefs: [parentRef, supplementRef],
      exactIndependentPublisherLineageCount: 2,
      finding:
        "Two independent publisher lineages each establish the exact macOS version, displayed Public Beta ordinal, public channel, and proposed Pacific appearance date.",
    };
  }

  if (
    candidateId === "candidate:apple:macos:15.3:public-beta-3"
  ) {
    return {
      ...base,
      researchDisposition: "remainsBlocked",
      retainedParentEvidenceRefs: [
        parentEvidenceRef(
          "9to5-153-cycle",
          "Public availability and date only; excluded from displayed-public-ordinal proof.",
        ),
      ],
      supplementEvidenceRefs: [
        supplementEvidenceRef(
          "monomaniac-153-pb3-followup",
          "One exact publisher lineage for the complete submitted identity.",
        ),
      ],
      selectedEvidenceRefs: [],
      exactIndependentPublisherLineageCount: 1,
      blocker:
        "Only Monomaniac independently displays Public Beta 3 with a publisher timestamp normalizing to January 16 Pacific. The retained 9to5Mac and OS X Daily material uses a developer ordinal or generic beta-program availability, so a second exact lineage is still absent.",
    };
  }

  return {
    ...base,
    researchDisposition: "remainsBlocked",
    retainedParentEvidenceRefs: [
      parentEvidenceRef(
        "9to5-155-cycle",
        "April 28 public availability and date only; excluded from Public Beta 3 ordinal proof.",
      ),
      parentEvidenceRef(
        "monomaniac-155-pb3",
        "Public Beta 3 ordinal, but the parent capture lacked publisher time and cannot establish April 28.",
      ),
      parentEvidenceRef(
        "iculture-155-cycle",
        "Conflict evidence: labels the April 28 appearance Public Beta 4.",
      ),
    ],
    supplementEvidenceRefs: [
      supplementEvidenceRef(
        "monomaniac-155-pb3-metadata-followup",
        "Publisher metadata resolves the exact Public Beta 3 article to April 29 Pacific, conflicting with the proposed April 28 date.",
      ),
    ],
    selectedEvidenceRefs: [],
    exactIndependentPublisherLineageCount: 0,
    blocker:
      "No two independent lineages establish the proposed April 28 Public Beta 3 identity. Monomaniac's public API timestamp normalizes to April 29 Pacific, while April 28 reports are generic or label that appearance Public Beta 4.",
  };
});

const readyIds = mappings
  .filter(
    (mapping) =>
      mapping.researchDisposition ===
      "evidenceReadyPendingIndependentReview",
  )
  .map((mapping) => mapping.candidateId);
const stillBlockedIds = mappings
  .filter((mapping) => mapping.researchDisposition === "remainsBlocked")
  .map((mapping) => mapping.candidateId);
if (readyIds.length !== 6 || stillBlockedIds.length !== 2) {
  throw new Error("Expected a 6-ready / 2-blocked research disposition.");
}

const parentDependencies = {
  candidates: {
    path: `${parentPath}/candidates.json`,
    bytes: parentCandidatesBytes.byteLength,
    sha256: sha256(parentCandidatesBytes),
  },
  independentReview: {
    path: `${parentPath}/independent-review.json`,
    bytes: parentReviewBytes.byteLength,
    sha256: sha256(parentReviewBytes),
  },
  packetLocks: {
    path: `${parentPath}/packet-locks.json`,
    bytes: parentPacketLocksBytes.byteLength,
    sha256: sha256(parentPacketLocksBytes),
  },
  rawEvidenceLocks: {
    path: `${parentPath}/raw-evidence-locks.json`,
    bytes: parentRawLocksBytes.byteLength,
    sha256: sha256(parentRawLocksBytes),
  },
};

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: fetchLog.fetchedAt,
  createdBy: "codex-macos-point-15-26-followup-researcher",
  researchCutoff,
  timezone,
  scope:
    "Research-only supplement for exactly the eight candidates blocked by the frozen macOS 15.x–26.x point-release independent review.",
  parentPacket: {
    path: parentPath,
    mustRemainUnchanged: true,
    dependencies: parentDependencies,
  },
  targets: {
    blockedCandidateIds: blockedIds,
    targetCount: blockedIds.length,
  },
  identityRule:
    "Each evidence-ready identity requires two independent publisher lineages that each establish exact macOS version, displayed public ordinal, publicBeta channel, and America/Los_Angeles appearance date. Developer ordinals, build alignment, generic public access, comments, and appearance counts are insufficient.",
  outcome: {
    evidenceReadyPendingIndependentReviewIds: readyIds,
    evidenceReadyCount: readyIds.length,
    remainsBlockedIds: stillBlockedIds,
    remainsBlockedCount: stillBlockedIds.length,
    identityCorrectionsProposed: 0,
  },
  independentReview: {
    status: "pending",
    required: true,
    researcherMustNotCreateIt: true,
    expectedFuturePath: `${packetPath}/independent-review.json`,
  },
  constraints: {
    noParentPacketEdits: true,
    noIndependentReviewByResearcher: true,
    noSanityWrites: true,
    noStableEventIdCreation: true,
    noPageWork: true,
    noPublication: true,
    noDeployment: true,
  },
};

const sourceLedger = {
  formatVersion: 1,
  batchId,
  generatedAt: fetchLog.fetchedAt,
  researchCutoff,
  sourceCount: sources.length,
  rawArtifactCount: rawArtifacts.length,
  publisherFamilyCount: new Set(
    sources.map((source) => source.publisherFamily),
  ).size,
  sources,
  copyrightHandling: {
    storesFullRawPagesForPrivateAuditOnly: true,
    selectedClaimMaxWordsPerPublisherPage: 20,
    republishesArticleBodies: false,
    synthesisRequiredForPublicUse: true,
  },
};
const rawEvidenceLocks = {
  formatVersion: 1,
  batchId,
  generatedAt: fetchLog.fetchedAt,
  rawArtifactCount: rawArtifacts.length,
  totalBytes: rawArtifacts.reduce(
    (sum, artifact) => sum + artifact.rawBytes,
    0,
  ),
  locks: rawArtifacts,
  selectedTextLocks: sources.map((source) => ({
    sourceId: source.sourceId,
    selectedTextSha256: source.evidence.selectedText.sha256,
    selectedTextWordCount: source.evidence.selectedText.wordCount,
  })),
  safety: {
    sanityMutationPerformed: false,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
};
const mappingsLedger = {
  formatVersion: 1,
  batchId,
  generatedAt: fetchLog.fetchedAt,
  mappingCount: mappings.length,
  evidenceReadyCount: readyIds.length,
  remainsBlockedCount: stillBlockedIds.length,
  identityCorrectionCount: 0,
  mappings,
};
const conflicts = {
  formatVersion: 1,
  batchId,
  generatedAt: fetchLog.fetchedAt,
  conflictCount: 5,
  unresolvedConflictCount: 2,
  resolvedConflictCount: 3,
  conflicts: [
    {
      candidateId: "candidate:apple:macos:15.1:public-beta-3",
      status: "resolvedForProposedIdentityPendingIndependentReview",
      issue: "The parent iCulture chronology gives October 8.",
      resolution:
        "The existing 9to5Mac record and newly retained Monomaniac publisher record independently display Public Beta 3 and both normalize to October 7 Pacific. The iCulture one-day conflict remains disclosed but is not selected.",
    },
    {
      candidateId: "candidate:apple:macos:15.3:public-beta-3",
      status: "unresolved",
      issue: "Only one lineage displays the exact public ordinal and date.",
      resolution:
        "Monomaniac establishes the exact identity; the other retained sources are developer-ordinal or generic beta-program reports and remain excluded.",
    },
    {
      candidateId: "candidate:apple:macos:15.5:public-beta-3",
      status: "unresolved",
      issue:
        "The proposed April 28 identity conflicts both on date and ordinal.",
      resolution:
        "Monomaniac's public API metadata normalizes to April 29 Pacific for Public Beta 3. April 28 sources are generic public updates or label the appearance Public Beta 4. No correction is proposed without two exact agreeing lineages.",
    },
    {
      candidateId: "candidate:apple:macos:26.5:public-beta-3",
      status: "resolvedForProposedIdentityPendingIndependentReview",
      issue: "The parent iCulture chronology shifts the row to Public Beta 4.",
      resolution:
        "9to5Mac and Monomaniac independently display Public Beta 3 and both establish April 27 Pacific. The conflicting iCulture row remains disclosed but is not selected.",
    },
    {
      candidateId: "candidate:apple:macos:26.6:public-beta-3",
      status: "resolvedForProposedIdentityPendingIndependentReview",
      issue: "The parent iCulture chronology uses the June 29 developer-seed day.",
      resolution:
        "MacRumors and Monomaniac independently display Public Beta 3 and both establish June 30 Pacific. The conflated June 29 row remains disclosed but is not selected.",
    },
  ],
};
const selfReview = {
  formatVersion: 1,
  batchId,
  reviewedAt: fetchLog.fetchedAt,
  reviewer: "codex-macos-point-15-26-followup-researcher-self-review",
  independentOfResearcher: false,
  status: "researchCompleteIndependentReviewPending",
  checks: {
    allEightFrozenParentBlockersMapped: mappings.length === 8,
    allCandidateIdentitiesPreservedUnchanged: mappings.every(
      (mapping) => mapping.identityPreservedUnchanged,
    ),
    parentCandidatesReviewAndLocksPinned: true,
    rawHtmlCapturedForEverySupplementSource: sources.every((source) =>
      source.evidence.rawArtifacts.some(
        (artifact) => artifact.mediaType === "text/html",
      ),
    ),
    publicPublisherApiCapturedForEveryMonomaniacSource: sources
      .filter((source) => source.publisher === "Monomaniac Garage")
      .every((source) =>
        source.evidence.rawArtifacts.some(
          (artifact) =>
            artifact.captureKind === "publisherWordPressApiRecord",
        ),
      ),
    allRawArtifactsSha256Locked: rawArtifacts.length === 15,
    selectedClaimsAtMostTwentyWords: sources.every(
      (source) => source.evidence.selectedText.wordCount <= 20,
    ),
    readyCandidatesHaveTwoIndependentExactLineages: mappings
      .filter(
        (mapping) =>
          mapping.researchDisposition ===
          "evidenceReadyPendingIndependentReview",
      )
      .every(
        (mapping) =>
          mapping.selectedEvidenceRefs.length === 2 &&
          new Set(
            mapping.selectedEvidenceRefs.map(
              (reference) => reference.publisherFamily,
            ),
          ).size === 2,
      ),
    genericPublicAvailabilityNeverUsedAsOrdinalProof: true,
    developerOrdinalNeverUsedAsPublicOrdinalProof: true,
    publicDatesNormalizedToAmericaLosAngeles: true,
    freshPublishedNoCdnProductionQueryPerformed: true,
    exactProductionRoutesAbsent: true,
    exactFullCandidatesAbsent: true,
    allSevenParentsPresent: true,
    identityCorrectionsProposed: 0,
    independentReviewPending: true,
    sanityMutationPerformed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  disposition: {
    evidenceReadyPendingIndependentReviewIds: readyIds,
    remainsBlockedIds: stillBlockedIds,
  },
};

const report = `# macOS 15.x–26.x point-public-beta follow-up research

Status: research complete; independent review pending.

This frozen supplement covers exactly the eight candidates blocked by the independent review of \`${parentPath}\`. It does not modify the parent packet or production.

## Result

- 8 blocked parent candidates mapped without changing any submitted identity.
- 6 now have two independent exact publisher lineages and are evidence-ready for a different reviewer.
- 2 remain blocked: macOS 15.3 Public Beta 3 has only one exact public-ordinal lineage; macOS 15.5 Public Beta 3 has an unresolved April 28/29 date and Public Beta 3/4 ordinal conflict.
- 8 publisher pages retained as 15 raw artifacts: HTML for every page plus the public WordPress API record for every Monomaniac page.
- 7/7 release-version parents exist in a fresh published, \`useCdn: false\` production query.
- 0 exact route matches and 0 exact full-candidate matches exist in production.
- 0 candidate identity corrections proposed.

## Evidence-ready candidates

${readyIds.map((candidateId) => `- ${candidateId}`).join("\n")}

## Still blocked

${stillBlockedIds.map((candidateId) => `- ${candidateId}`).join("\n")}

## Research controls

The two-lineage gate is claim-level: each selected lineage must independently establish macOS, the exact version, the displayed Public Beta ordinal, and the Pacific appearance date. A developer-beta number plus generic public availability is not public-ordinal evidence. Multiple raw artifacts from one publisher count as one lineage.

Full raw pages are stored only for private verification. The source ledger retains bounded claim text of at most 20 words per publisher page; public-facing use must synthesize the facts and credit/link the publisher rather than reproducing article prose.

No Sanity mutation, stable event ID creation, page build, publication, or deployment was performed. A researcher self-review is included, but \`independent-review.json\` is intentionally absent and must be produced by someone other than this packet's researcher.
`;

await Promise.all([
  writeJson("assignment.json", assignment),
  writeJson("sources.json", sourceLedger),
  writeJson("raw-evidence-locks.json", rawEvidenceLocks),
  writeJson("mappings.json", mappingsLedger),
  writeJson("conflicts.json", conflicts),
  writeJson("self-review.json", selfReview),
  writeFile(path.join(packetDir, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      batchId,
      targetCount: mappings.length,
      evidenceReadyCount: readyIds.length,
      remainsBlockedCount: stillBlockedIds.length,
      supplementSourceCount: sources.length,
      rawArtifactCount: rawArtifacts.length,
      productionCapturedAt: production.capturedAt,
      productionExactRouteMatches:
        production.productionCounts.exactRouteMatches,
      productionExactFullMatches:
        production.productionCounts.exactFullMatches,
    },
    null,
    2,
  ),
);
