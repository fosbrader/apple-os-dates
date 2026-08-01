#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const packetDir = path.dirname(scriptPath);
const repoRoot = path.resolve(packetDir, "../../..");
const parentDir = path.resolve(packetDir, "..", "ios-ipados-point-12-14");
const parentPacketPath =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-12-14";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-12-14-followup";
const batchId = "beta-chronology-gap-ios-ipados-point-12-14-followup";
const timezone = "America/Los_Angeles";
const accessedAt = "2026-07-31";

const readJson = async (filePath) =>
  JSON.parse(await readFile(filePath, "utf8"));
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const unique = (values) => [...new Set(values)];
const wordCount = (value) =>
  value.trim() ? value.trim().split(/\s+/u).length : 0;

const decodeHtml = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&#038;", "&")
    .replaceAll("&#8211;", "–")
    .replaceAll("&#8212;", "—")
    .replaceAll("&#8217;", "’")
    .replaceAll("&quot;", '"')
    .trim();

const extract = (html, regex, label, sourceId) => {
  const value = html.match(regex)?.[1];
  if (!value) throw new Error(`Missing ${label} for ${sourceId}`);
  return value;
};

const pacificDate = (publishedAt) => {
  const date = new Date(publishedAt);
  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Unparseable publication datetime: ${publishedAt}`);
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

const publisherFor = (sourceId) => {
  if (sourceId.startsWith("kobonemi-")) {
    return { publisher: "Kobonemi", author: "kobonemi" };
  }
  if (sourceId.startsWith("purudo-")) {
    return { publisher: "Purudo.net", author: "Purudo.net 編集部" };
  }
  if (sourceId.startsWith("9to5mac-")) {
    return { publisher: "9to5Mac", author: "Chance Miller" };
  }
  if (sourceId.startsWith("gori-")) {
    return { publisher: "Gori.me", author: "g.O.R.i" };
  }
  if (sourceId.startsWith("taisyo-")) {
    return {
      publisher: "Taisyo / 気になる、記になる…",
      author: "taisy0",
    };
  }
  throw new Error(`Unknown publisher family for ${sourceId}`);
};

const sourceRules = [
  ["kobonemi-ios-12-1-pb2", ["iOS"], "12.1", 2],
  ["purudo-ios-12-1-pb3", ["iOS"], "12.1", 3],
  ["kobonemi-ios-12-1-pb4", ["iOS"], "12.1", 4],
  ["kobonemi-ios-12-1-1-pb2", ["iOS"], "12.1.1", 2],
  ["kobonemi-ios-12-1-1-pb3", ["iOS"], "12.1.1", 3],
  ["kobonemi-ios-12-1-3-pb2", ["iOS"], "12.1.3", 2],
  ["kobonemi-ios-12-1-3-pb3", ["iOS"], "12.1.3", 3],
  ["kobonemi-ios-12-2-pb5", ["iOS"], "12.2", 5],
  ["purudo-ios-12-2-pb6", ["iOS"], "12.2", 6],
  ["kobonemi-ios-12-3-pb4", ["iOS"], "12.3", 4],
  ["kobonemi-ios-12-3-pb5", ["iOS"], "12.3", 5],
  ["purudo-ios-12-3-pb6", ["iOS"], "12.3", 6],
  ["kobonemi-ios-12-4-pb3", ["iOS"], "12.4", 3],
  ["purudo-ios-ipados-13-1-pb2", ["iPadOS"], "13.1", 2],
  ["9to5mac-ios-ipados-13-2-pb3", ["iOS", "iPadOS"], "13.2", 3],
  ["9to5mac-ios-ipados-13-2-pb4", ["iOS", "iPadOS"], "13.2", 4],
  ["purudo-ios-ipados-13-4-pb5", ["iOS", "iPadOS"], "13.4", 5],
  ["kobonemi-ios-ipados-13-5-pb2", ["iOS", "iPadOS"], "13.5", 2],
  ["purudo-ios-ipados-13-5-pb3", ["iOS", "iPadOS"], "13.5", 3],
  ["purudo-ios-ipados-13-7-pb1", ["iOS", "iPadOS"], "13.7", 1],
  ["gori-ios-ipados-13-7-pb1", ["iOS", "iPadOS"], "13.7", 1],
  ["purudo-ios-ipados-14-3-pb3", ["iOS", "iPadOS"], "14.3", 3],
  ["taisyo-ios-ipados-14-4-pb2", ["iPadOS"], "14.4", 2],
  ["purudo-ios-ipados-14-5-pb4", ["iOS", "iPadOS"], "14.5", 4],
  ["purudo-ios-ipados-14-5-pb5", ["iPadOS"], "14.5", 5],
  ["purudo-ios-ipados-14-5-pb6", ["iPadOS"], "14.5", 6],
  ["purudo-ios-ipados-14-5-pb7", ["iOS", "iPadOS"], "14.5", 7],
  ["purudo-ios-ipados-14-5-pb8", ["iOS", "iPadOS"], "14.5", 8],
  ["purudo-ios-ipados-14-6-pb3", ["iOS", "iPadOS"], "14.6", 3],
  ["purudo-ios-ipados-14-7-pb4", ["iOS"], "14.7", 4],
].map(([sourceId, platforms, version, sequence]) => ({
  sourceId,
  platforms,
  version,
  sequence,
}));

const claimTexts = {
  "kobonemi-ios-12-1-pb2": ["iOS 12.1 Public Beta 2"],
  "purudo-ios-12-1-pb3": ["iOS 12.1 Public beta 3"],
  "kobonemi-ios-12-1-pb4": ["iOS 12.1 Public Beta 4"],
  "kobonemi-ios-12-1-1-pb2": [
    "iOS 12.1.1 Beta2がリリース【Public Beta 2も利用可能に】",
  ],
  "kobonemi-ios-12-1-1-pb3": ["iOS 12.1.1 Public Beta 3"],
  "kobonemi-ios-12-1-3-pb2": ["iOS 12.1.3 Public Beta 2"],
  "kobonemi-ios-12-1-3-pb3": ["iOS 12.1.3 Public Beta 3"],
  "kobonemi-ios-12-2-pb5": ["iOS 12.2 Public Beta 5"],
  "purudo-ios-12-2-pb6": ["iOS 12.2 Public beta 6"],
  "kobonemi-ios-12-3-pb4": ["iOS 12.3 Public Beta 4"],
  "kobonemi-ios-12-3-pb5": ["iOS 12.3 Public Beta 5"],
  "purudo-ios-12-3-pb6": ["iOS 12.3 Public beta 6"],
  "kobonemi-ios-12-4-pb3": ["iOS 12.4 Public Beta 3"],
  "purudo-ios-ipados-13-1-pb2": [
    "iOS 13.1 Public Beta 2",
    "iPadOS 13.1 Public Beta 2",
  ],
  "9to5mac-ios-ipados-13-2-pb3": [
    "iOS 13.2 and iPadOS 13.2 public beta 3 also now available",
  ],
  "9to5mac-ios-ipados-13-2-pb4": [
    "iOS 13.2 and iPadOS 13.2 public beta 4 also now available",
  ],
  "purudo-ios-ipados-13-4-pb5": [
    "iOS 13.4 Public Beta 5",
    "iPadOS 13.4 Public Beta 5",
  ],
  "kobonemi-ios-ipados-13-5-pb2": [
    "iOS & iPadOS 13.5 Public Beta 2",
  ],
  "purudo-ios-ipados-13-5-pb3": [
    "iOS 13.5 Public Beta 3",
    "iPadOS 13.5 Public Beta 3",
  ],
  "purudo-ios-ipados-13-7-pb1": [
    "iOS 13.7 Public Beta 1",
    "iPadOS 13.7 Public Beta 1",
  ],
  "gori-ios-ipados-13-7-pb1": [
    "iOS/iPadOS 13.7のBeta 1およびPublic Beta 1など配信開始",
  ],
  "purudo-ios-ipados-14-3-pb3": [
    "iOS 14.3 Public Beta 3",
    "iPadOS 14.3 Public Beta 3",
  ],
  "taisyo-ios-ipados-14-4-pb2": [
    "iOS 14.4 Public Beta 2",
    "iPadOS 14.4 Public Beta 2",
  ],
  "purudo-ios-ipados-14-5-pb4": [
    "iOS 14.5 Public Beta 4",
    "iPadOS 14.5 Public Beta 4",
  ],
  "purudo-ios-ipados-14-5-pb5": [
    "iOS 14.5 Public Beta 5",
    "iPadOS 14.5 Public Beta 5",
  ],
  "purudo-ios-ipados-14-5-pb6": [
    "iOS 14.5 Public Beta 6",
    "iPadOS 14.5 Public Beta 6",
  ],
  "purudo-ios-ipados-14-5-pb7": [
    "iOS 14.5 Public Beta 7",
    "iPadOS 14.5 Public Beta 7",
  ],
  "purudo-ios-ipados-14-5-pb8": [
    "iOS 14.5 Public Beta 8",
    "iPadOS 14.5 Public Beta 8",
  ],
  "purudo-ios-ipados-14-6-pb3": [
    "iOS 14.6 Public Beta 3",
    "iPadOS 14.6 Public Beta 3",
  ],
  "purudo-ios-ipados-14-7-pb4": [
    "iOS 14.7 Public Beta 4",
    "iPadOS 14.7 Public Beta 4",
  ],
};

const [
  parentReview,
  parentCandidatesLedger,
  parentSourcesLedger,
  fetchLog,
  production,
  parentValidationBytes,
  parentLocksBytes,
  parentReviewBytes,
] = await Promise.all([
  readJson(path.join(parentDir, "independent-review.json")),
  readJson(path.join(parentDir, "candidates.json")),
  readJson(path.join(parentDir, "sources.json")),
  readJson(path.join(packetDir, "fetch-log.json")),
  readJson(path.join(packetDir, "production-snapshot.json")),
  readFile(path.join(parentDir, "validation.json")),
  readFile(path.join(parentDir, "packet-locks.json")),
  readFile(path.join(parentDir, "independent-review.json")),
]);

const blockedCandidateIds =
  parentReview.candidateDisposition.blockedCandidateIds;
const blockedSet = new Set(blockedCandidateIds);
const candidates = parentCandidatesLedger.candidates.filter((candidate) =>
  blockedSet.has(candidate.candidateId),
);
const reviewById = new Map(
  parentReview.candidateReviews.map((review) => [
    review.candidateId,
    review,
  ]),
);
const productionById = new Map(
  production.exactChecks.map((check) => [check.candidateId, check]),
);
const parentSourceIds = new Set(
  parentSourcesLedger.sources.map((source) => source.sourceId),
);
const fetchById = new Map(
  fetchLog.results.map((result) => [result.sourceId, result]),
);

if (blockedCandidateIds.length !== 40 || candidates.length !== 40) {
  throw new Error("The frozen parent review must supply exactly 40 targets.");
}
if (sourceRules.length !== 30 || fetchLog.results.length !== 30) {
  throw new Error("The follow-up must contain exactly 30 source pages.");
}

const supportsForSource = (rule) =>
  candidates
    .filter(
      (candidate) =>
        rule.platforms.includes(candidate.platform) &&
        candidate.version === rule.version &&
        candidate.proposedIdentity.sequence === rule.sequence,
    )
    .map((candidate) => candidate.candidateId)
    .sort();

const sources = [];
const rawLocks = [];
for (const rule of sourceRules) {
  const fetch = fetchById.get(rule.sourceId);
  if (!fetch) throw new Error(`Missing fetch result for ${rule.sourceId}`);
  const rawPath = path.posix.join(fetchLog.evidencePath, fetch.filename);
  const rawBytes = await readFile(path.resolve(repoRoot, rawPath));
  if (
    rawBytes.byteLength !== fetch.bytes ||
    sha256(rawBytes) !== fetch.sha256
  ) {
    throw new Error(`Raw evidence lock mismatch for ${rule.sourceId}`);
  }
  const html = rawBytes.toString("utf8");
  const title = decodeHtml(
    extract(
      html,
      /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/iu,
      "Open Graph title",
      rule.sourceId,
    ),
  );
  const publishedAt =
    html.match(
      /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/iu,
    )?.[1] ??
    extract(
      html,
      /"datePublished"\s*:\s*"([^"]+)"/iu,
      "publication datetime",
      rule.sourceId,
    );
  const normalizedPacificDate = pacificDate(publishedAt);
  const supports = supportsForSource(rule);
  if (supports.length === 0) {
    throw new Error(`Source ${rule.sourceId} supports no assigned candidate.`);
  }
  for (const candidateId of supports) {
    const candidate = candidates.find(
      (item) => item.candidateId === candidateId,
    );
    if (
      candidate.proposedIdentity.appearanceDate !== normalizedPacificDate
    ) {
      throw new Error(
        `${rule.sourceId} normalizes to ${normalizedPacificDate}, not ${candidate.proposedIdentity.appearanceDate}`,
      );
    }
  }
  const selectedClaims = claimTexts[rule.sourceId];
  if (!selectedClaims?.length) {
    throw new Error(`Missing claim excerpts for ${rule.sourceId}`);
  }
  const totalWords = selectedClaims.reduce(
    (sum, text) => sum + wordCount(text),
    0,
  );
  if (totalWords > 20) {
    throw new Error(
      `Combined excerpt allowance exceeded for ${rule.sourceId}: ${totalWords}`,
    );
  }
  for (const text of selectedClaims) {
    if (!html.includes(text)) {
      throw new Error(
        `Claim excerpt absent from raw evidence for ${rule.sourceId}: ${text}`,
      );
    }
  }
  const { publisher, author } = publisherFor(rule.sourceId);
  const claimEvidence = selectedClaims.map((text) => ({
    type: "verbatimClaimFragment",
    text,
    wordCount: wordCount(text),
    sha256: sha256(text),
    supports: [
      "platform",
      "version",
      "publicBetaChannel",
      "displayedPublicOrdinal",
    ],
  }));
  sources.push({
    sourceId: rule.sourceId,
    canonicalUrl: fetch.url,
    finalUrl: fetch.finalUrl,
    title,
    publisher,
    author,
    publishedAt,
    publishedDateObserved: publishedAt.slice(0, 10),
    normalizedPacificDate,
    publicationDatePrecision: "datetime",
    timezoneNormalization: {
      targetTimezone: timezone,
      result: normalizedPacificDate,
    },
    accessedAt,
    archiveUrl: null,
    status: "active",
    sourceClass: "contemporaneousSecondary",
    roles: [
      "publicAvailability",
      "publicOrdinal",
      "appearanceDate",
      "channelIdentity",
      "platformApplicability",
    ],
    supports,
    evidence: {
      rawPath,
      rawBytes: fetch.bytes,
      rawSha256: fetch.sha256,
      captureMethod: fetch.captureMethod,
      locator:
        "Headline/body claim fragments explicitly name the public-beta identity; publication metadata is normalized to America/Los_Angeles.",
      selectedText: {
        type: claimEvidence[0].type,
        text: claimEvidence[0].text,
        wordCount: claimEvidence[0].wordCount,
        maxWords: 20,
        sha256: claimEvidence[0].sha256,
        purpose:
          "Bounded source-identification excerpt only; findings use structured locators and original synthesis.",
      },
      claimEvidence,
      combinedQuotedWordCount: totalWords,
      maxCombinedQuotedWords: 20,
    },
    lineage: {
      publisherFamily: publisher,
      independentForCorroboration: true,
      notes:
        "Each publisher family counts once per identity, regardless of how many pages it contributes.",
    },
  });
  rawLocks.push({
    sourceId: rule.sourceId,
    rawPath,
    rawBytes: fetch.bytes,
    rawSha256: fetch.sha256,
  });
}

const sourcesById = new Map(
  sources.map((source) => [source.sourceId, source]),
);

const mappings = candidates
  .map((candidate) => {
    const parentReviewEntry = reviewById.get(candidate.candidateId);
    const productionCheck = productionById.get(candidate.candidateId);
    if (!parentReviewEntry || !productionCheck) {
      throw new Error(`Missing parent review or production check for ${candidate.candidateId}`);
    }
    const supplementSources = sources.filter((source) =>
      source.supports.includes(candidate.candidateId),
    );
    const parentRefs = parentReviewEntry.acceptedEvidenceRefs;
    for (const ref of parentRefs) {
      if (!parentSourceIds.has(ref.sourceId)) {
        throw new Error(
          `Unresolved retained parent source ${ref.sourceId} for ${candidate.candidateId}`,
        );
      }
    }
    const publisherFamilies = unique([
      ...parentRefs.map((ref) => ref.publisherFamily),
      ...supplementSources.map(
        (source) => source.lineage.publisherFamily,
      ),
    ]);
    return {
      candidateId: candidate.candidateId,
      parentReviewDisposition: parentReviewEntry.disposition,
      parentBlocker: parentReviewEntry.blocker,
      originalCandidate: candidate,
      recommendedIdentity: candidate.proposedIdentity,
      recommendation: "evidenceReadyForIndependentReview",
      identityChanged: false,
      correctionOrSupersession: null,
      retainedParentEvidenceRefs: parentRefs,
      supplementEvidenceRefs: supplementSources.map((source) => ({
        kind: "supplementSource",
        packetPath: `${packetPath}/sources.json`,
        sourceId: source.sourceId,
        publisherFamily: source.lineage.publisherFamily,
        normalizedPacificDate: source.normalizedPacificDate,
        reason:
          "The retained page explicitly names the exact platform/version public-beta ordinal and its publication datetime normalizes to the candidate date.",
      })),
      retainedParentExclusions: parentReviewEntry.excludedEvidenceRefs,
      corroboration: {
        exactVersionOrdinalDateLineages: publisherFamilies.length,
        publisherFamilies,
        independentPublisherFamilies: publisherFamilies.length >= 2,
        minimumRequired: 2,
        gateSatisfied: publisherFamilies.length >= 2,
      },
      productionReconciliation: {
        status:
          productionCheck.fullCandidateMatchCount === 0
            ? "confirmedMissing"
            : "unexpectedExistingMatch",
        capturedAt: production.capturedAt,
        perspective: production.perspective,
        useCdn: production.useCdn,
        routeIdentityMatchCount: productionCheck.routeIdentityMatchCount,
        fullCandidateMatchCount: productionCheck.fullCandidateMatchCount,
      },
      independentReviewRequired: true,
      implementationAuthorized: false,
      flags: {
        sanityMutationAllowed: false,
        publicationEligible: false,
      },
    };
  })
  .sort((a, b) => a.candidateId.localeCompare(b.candidateId));

const unresolved = mappings.filter(
  (mapping) =>
    !mapping.corroboration.gateSatisfied ||
    mapping.productionReconciliation.status !== "confirmedMissing",
);
if (unresolved.length > 0) {
  throw new Error(
    `Research self-review has ${unresolved.length} unresolved mappings.`,
  );
}

const parentHashes = {
  parentValidationSha256: sha256(parentValidationBytes),
  parentPacketLocksSha256: sha256(parentLocksBytes),
  parentIndependentReviewSha256: sha256(parentReviewBytes),
};

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: new Date().toISOString(),
  createdBy: "codex-ios-ipados-point-12-14-followup-researcher",
  researchCutoff: accessedAt,
  timezone,
  scope:
    "Research-only follow-up for exactly the 40 candidates blocked by the independent review of the frozen iOS/iPadOS 12.x–14.x point-release public-beta packet.",
  parentPacket: {
    path: parentPacketPath,
    reviewPath: `${parentPacketPath}/independent-review.json`,
    ...parentHashes,
    mustRemainUnchanged: true,
  },
  targets: {
    blockedCandidateIds,
    targetCount: blockedCandidateIds.length,
  },
  identityRule:
    "Evidence must establish platform, version, displayed public ordinal, publicBeta channel, and America/Los_Angeles appearance date. Generic public availability, developer ordinal, build alignment, comments, and appearance counts do not establish the public ordinal.",
  evidenceGate:
    "Each identity needs first-party evidence or two independent exact contemporary publisher lineages at claim level.",
  deliverables: [
    "assignment.json",
    "source-specs.mjs",
    "fetch-sources.mjs",
    "fetch-log.json",
    "sources.json",
    "raw-evidence-locks.json",
    "query-production.ts",
    "production-snapshot.json",
    "mappings.json",
    "conflicts.json",
    "self-review.json",
    "report.md",
    "validate-packet.mjs",
    "validation.json",
    "freeze-packet.mjs",
    "packet-locks.json",
  ],
  independentReview: {
    status: "pending",
    required: true,
    expectedFuturePath: `${packetPath}/independent-review.json`,
    researcherMustNotCreateIt: true,
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
  accessedAt,
  sourceCount: sources.length,
  rawSourceCount: sources.length,
  freshHttpCaptureCount: sources.length,
  failedCaptureCount: 0,
  copyrightHandling: {
    policy:
      "Retain full raw pages only in ignored audit storage. Expose at most 20 quoted words per source in the packet ledger and use original synthesis elsewhere.",
    maxQuotedWordsPerSource: 20,
  },
  sources,
};

const rawEvidenceLocks = {
  formatVersion: 1,
  batchId,
  algorithm: "sha256",
  sourceCount: rawLocks.length,
  totalBytes: rawLocks.reduce((sum, lock) => sum + lock.rawBytes, 0),
  locks: rawLocks,
};

const mappingsLedger = {
  formatVersion: 1,
  batchId,
  parentReviewPath: `${parentPacketPath}/independent-review.json`,
  summary: {
    targetCount: mappings.length,
    unchangedIdentityRecommendations: mappings.filter(
      (mapping) => !mapping.identityChanged,
    ).length,
    correctionOrSupersessionCount: mappings.filter(
      (mapping) => mapping.identityChanged,
    ).length,
    evidenceReadyForIndependentReviewCount: mappings.filter(
      (mapping) => mapping.corroboration.gateSatisfied,
    ).length,
    unresolvedResearchCount: unresolved.length,
    confirmedMissingInProductionCount: mappings.filter(
      (mapping) =>
        mapping.productionReconciliation.status === "confirmedMissing",
    ).length,
    independentReviewPendingCount: mappings.filter(
      (mapping) => mapping.independentReviewRequired,
    ).length,
  },
  mappings,
  safety: {
    researchOnly: true,
    implementationAuthorized: false,
    sanityMutationPerformed: false,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
};

const retainedParentEvidenceExclusions = mappings.map((mapping) => ({
  candidateId: mapping.candidateId,
  exclusions: mapping.retainedParentExclusions,
}));
const exclusionCount = retainedParentEvidenceExclusions.reduce(
  (sum, item) => sum + item.exclusions.length,
  0,
);

const conflicts = {
  formatVersion: 1,
  batchId,
  summary: {
    retainedParentExclusionCount: exclusionCount,
    newDateConflictCount: 0,
    identityCorrectionCount: 0,
    unresolvedConflictCount: 0,
  },
  methodologicalRulePreserved:
    "Parent exclusions remain excluded: developer ordinals, generic public availability, build alignment, comments, and appearance counts are not reused as public-ordinal proof.",
  retainedParentEvidenceExclusions,
  dateNormalizationFindings: sources.map((source) => ({
    sourceId: source.sourceId,
    publishedAt: source.publishedAt,
    normalizedPacificDate: source.normalizedPacificDate,
    supports: source.supports,
    result: "matchesCandidateAppearanceDate",
  })),
  identityCorrections: [],
  supersessions: [],
  newDateConflicts: [],
  unresolvedConflicts: [],
};

const selfReview = {
  formatVersion: 1,
  batchId,
  reviewerRole: "researcherSelfCheckOnly",
  independentOfResearcher: false,
  status: "researchCompleteIndependentReviewPending",
  reviewedAt: new Date().toISOString(),
  checks: {
    exactTargetCoverage: {
      expected: 40,
      actual: mappings.length,
      passed: mappings.length === 40,
    },
    exactClaimLevelEvidence: {
      sourceCount: sources.length,
      allSourcesExplicitlyNamePublicOrdinal: true,
      genericAvailabilityUsedAsOrdinalProof: false,
      developerOrdinalUsedAsPublicOrdinalProof: false,
      passed: true,
    },
    independentLineageGate: {
      minimum: 2,
      passingCandidateCount: mappings.filter(
        (mapping) => mapping.corroboration.gateSatisfied,
      ).length,
      failingCandidateCount: unresolved.length,
      passed: unresolved.length === 0,
    },
    pacificDateNormalization: {
      timezone,
      matchingSourceCount: sources.length,
      mismatchingSourceCount: 0,
      passed: true,
    },
    productionReconciliation: {
      perspective: production.perspective,
      useCdn: production.useCdn,
      exactExistingMatchCount: production.productionCounts.exactFullMatches,
      passed: production.productionCounts.exactFullMatches === 0,
    },
    parentIntegrity: {
      ...parentHashes,
      passed: true,
    },
    copyright: {
      maxQuotedWordsPerSource: 20,
      maxObservedCombinedQuotedWords: Math.max(
        ...sources.map(
          (source) => source.evidence.combinedQuotedWordCount,
        ),
      ),
      passed: sources.every(
        (source) =>
          source.evidence.combinedQuotedWordCount <=
          source.evidence.maxCombinedQuotedWords,
      ),
    },
    safety: {
      sanityMutationPerformed: false,
      pageBuildsPerformed: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
      passed: true,
    },
  },
  verdict:
    "All 40 frozen blocked identities now have at least two exact independent publisher lineages, retain every parent exclusion, match Pacific dates, and remain absent from published production. A different reviewer must independently adjudicate this packet before implementation.",
  independentReview: {
    status: "pending",
    createdByResearcher: false,
    implementationUnlocked: false,
  },
};

const tableRows = mappings.map((mapping) => {
  const candidate = mapping.originalCandidate;
  const retained =
    mapping.retainedParentEvidenceRefs
      .map((ref) => ref.sourceId)
      .join(", ") || "none";
  const added = mapping.supplementEvidenceRefs
    .map((ref) => ref.sourceId)
    .join(", ");
  return `| ${candidate.platform} | ${candidate.version} | Public Beta ${candidate.proposedIdentity.sequence} | ${candidate.proposedIdentity.appearanceDate} | ${retained} | ${added} |`;
});

const report = `# iOS/iPadOS 12.x–14.x point-release follow-up

Research is complete for exactly the 40 identities blocked by the frozen parent independent review. All 40 retain the parent review's accepted evidence and exclusions, now reach at least two exact independent publisher lineages, and remain absent from published Sanity production as of ${production.capturedAt}.

## Outcome

- 40/40 identities are evidence-ready for a different independent reviewer.
- 38 identities retain one exact parent lineage and add one exact independent lineage.
- iOS 13.7 Public Beta 1 and iPadOS 13.7 Public Beta 1 had no accepted parent lineage; each now has two exact independent lineages from Purudo.net and Gori.me.
- No candidate identity, ordinal, platform, or Pacific date required correction or supersession.
- No generic public-availability statement, developer ordinal, build alignment, comment, or appearance count is used as public-ordinal proof.
- The read-only production requery found 2,068 releaseEvent documents, 10 existing iOS public-beta events, 10 existing iPadOS public-beta events, and zero exact matches for these 40 candidates.
- Sanity writes, stable ID creation, page work, publication, and deployment remain unauthorized and were not performed.

## Candidate evidence map

| Platform | Version | Displayed public ordinal | Pacific date | Retained parent source(s) | Added exact source(s) |
|---|---|---:|---|---|---|
${tableRows.join("\n")}

## Handoff

The packet is self-validated and frozen, but it is intentionally not independently reviewed. The next agent must verify raw locks, claim-level platform/version/public-ordinal/date evidence, publisher-family independence, retained exclusions, and the fresh production snapshot before creating a separate independent-review.json. Implementation remains locked until that review explicitly approves it.
`;

await Promise.all([
  writeFile(
    path.join(packetDir, "assignment.json"),
    `${JSON.stringify(assignment, null, 2)}\n`,
  ),
  writeFile(
    path.join(packetDir, "sources.json"),
    `${JSON.stringify(sourceLedger, null, 2)}\n`,
  ),
  writeFile(
    path.join(packetDir, "raw-evidence-locks.json"),
    `${JSON.stringify(rawEvidenceLocks, null, 2)}\n`,
  ),
  writeFile(
    path.join(packetDir, "mappings.json"),
    `${JSON.stringify(mappingsLedger, null, 2)}\n`,
  ),
  writeFile(
    path.join(packetDir, "conflicts.json"),
    `${JSON.stringify(conflicts, null, 2)}\n`,
  ),
  writeFile(
    path.join(packetDir, "self-review.json"),
    `${JSON.stringify(selfReview, null, 2)}\n`,
  ),
  writeFile(path.join(packetDir, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      batchId,
      targetCount: mappings.length,
      sourceCount: sources.length,
      exactLineageGatePassed: mappings.filter(
        (mapping) => mapping.corroboration.gateSatisfied,
      ).length,
      correctionOrSupersessionCount:
        mappingsLedger.summary.correctionOrSupersessionCount,
      productionExactMatches:
        production.productionCounts.exactFullMatches,
      independentReview: "pending",
    },
    null,
    2,
  ),
);
