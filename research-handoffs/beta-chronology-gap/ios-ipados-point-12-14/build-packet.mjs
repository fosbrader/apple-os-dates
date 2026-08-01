import {createHash} from "node:crypto";
import {copyFile, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allObservedAppearances,
  batchId,
  candidates as researchedCandidates,
  cohortId,
  evidenceRoot,
  modelGaps,
  negativeFindings,
  packetPath,
  platformSpecs,
  researchCutoff,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const packetSourcesPath = `${packetPath}/sources.json`;
const generatedAt = (
  JSON.parse(
    await readFile(
      path.join(repoRoot, evidenceRoot, "production-snapshot.json"),
      "utf8",
    ),
  )
).capturedAt;
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const countBy = (items, selector) => {
  const counts = {};
  for (const item of items) {
    const key = selector(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) =>
      left.localeCompare(right),
    ),
  );
};
const decodeHtml = (value) =>
  value
    .replaceAll(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replaceAll(/&#([0-9]+);/g, (_, number) =>
      String.fromCodePoint(Number.parseInt(number, 10)),
    )
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
const firstMatch = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return null;
};
const boundedHeadlineFragment = (title) => {
  const words = title.split(/\s+/).filter(Boolean).slice(0, 20);
  const text = words.join(" ");
  return {
    type: "verbatimHeadlineFragment",
    text,
    wordCount: words.length,
    maxWords: 20,
    sha256: sha256(text),
    purpose:
      "Bounded source-identification excerpt only; chronology findings are original synthesis.",
  };
};
const versionSlug = (version) => version.replaceAll(".", "-");
const exactMacRumorsId = ({version, sequence}) =>
  version.startsWith("12.")
    ? `mr-ios-${versionSlug(version)}-pb${sequence}`
    : `mr-${versionSlug(version)}-pb${sequence}`;
const iCultureId = (version) => `iculture-ios-${versionSlug(version)}`;

const sourceIdsFor = (item) => {
  const {platform, version, sequence} = item;

  if (platform === "iOS" && version.startsWith("12.")) {
    if (version === "12.4" && sequence === 4) {
      return ["gh-ios-12-4-pb4", "forbes-ios-12-4-pb4"];
    }
    if (version === "12.4" && sequence === 5) {
      return ["iculture-ios-12-4", "gh-ios-12-4-pb5"];
    }
    if (version === "12.4" && sequence === 6) {
      return ["iculture-ios-12-4", "gh-ios-12-4-pb6"];
    }
    return [iCultureId(version), exactMacRumorsId(item)];
  }

  if (version.startsWith("13.")) {
    if (version === "13.3" && sequence === 3) {
      return [
        "iculture-ios-13-3",
        "shiftdelete-ios-ipados-13-3-pb3",
      ];
    }
    if (version === "13.7") {
      return ["mr-13-7-pb1", "corriente-13-7-pb1"];
    }
    if (version === "13.1" && platform === "iOS") {
      return [`mr-13-1-pb${sequence}`, "imore-ios13-history"];
    }
    if (version === "13.1" && platform === "iPadOS") {
      const secondLineage = {
        1: "imore-ipados13-history",
        2: "9to5mac-13-1-pb2",
        3: "itopnews-13-1-pb3",
        4: "osxd-13-1-pb4",
      }[sequence];
      return [`mr-13-1-pb${sequence}`, secondLineage];
    }
    return [exactMacRumorsId(item), iCultureId(version)];
  }

  if (platform === "iOS" && version === "14.7") {
    if (sequence === 1) {
      return ["mr-14-7-pb1", "imore-ios14-history"];
    }
    return ["imore-ios14-history", "iculture-ios-14-7"];
  }

  if (version === "14.3" && sequence === 3) {
    return ["mr-14-3-pb3", "osxd-ios-ipados-14-3-pb3"];
  }
  if (version === "14.6" && sequence === 2) {
    return ["iculture-ios-14-6", "osxd-ios-ipados-14-6-pb2"];
  }

  if (platform === "iOS") {
    if (version === "14.3" && sequence === 2) {
      return ["mr-14-3-pb2", "imore-ios14-history"];
    }
    return [exactMacRumorsId(item), iCultureId(version)];
  }

  if (platform === "iPadOS") {
    if (version === "14.2") {
      return [exactMacRumorsId(item), "imore-ipados14-history"];
    }
    if (version === "14.3" && sequence <= 2) {
      return [exactMacRumorsId(item), "imore-ipados14-history"];
    }
    if (version === "14.4" && sequence === 1) {
      return ["mr-14-4-pb1", "imore-ipados14-history"];
    }
    if (version === "14.4" && sequence === 2) {
      return ["mr-14-4-pb2", "purudo-ios-ipados-14-4-pb2"];
    }
    if (version === "14.5" && sequence === 1) {
      return ["mr-14-5-pb1", "imore-ipados14-history"];
    }
    if (version === "14.5" && sequence === 5) {
      return ["mr-14-5-pb5", "itopnews-ios-ipados-14-5-pb5"];
    }
    if (version === "14.5" && sequence === 6) {
      return ["mr-14-5-pb6", "osxd-ios-ipados-14-5-pb6"];
    }
    return [exactMacRumorsId(item), iCultureId(version)];
  }

  throw new Error(
    `No evidence routing for ${platform} ${version} PB${sequence}`,
  );
};

const [fetchLog, production] = await Promise.all([
  readFile(path.join(repoRoot, evidenceRoot, "fetch-log.json"), "utf8").then(
    JSON.parse,
  ),
  readFile(
    path.join(repoRoot, evidenceRoot, "production-snapshot.json"),
    "utf8",
  ).then(JSON.parse),
]);
if (fetchLog.failureCount !== 0) {
  throw new Error("Cannot build a packet while source captures have failures.");
}
if (production.perspective !== "published" || production.useCdn !== false) {
  throw new Error("Production reconciliation must be published and no-CDN.");
}
await copyFile(
  path.join(repoRoot, evidenceRoot, "production-snapshot.json"),
  path.join(here, "production-snapshot.json"),
);

const specById = new Map(sourceSpecs.map((source) => [source.sourceId, source]));
const sources = [];
for (const capture of fetchLog.results) {
  const source = specById.get(capture.sourceId);
  if (!source) throw new Error(`Missing source spec for ${capture.sourceId}`);
  const rawPath = path.posix.join(
    evidenceRoot,
    "raw",
    capture.filename,
  );
  const bytes = await readFile(path.join(repoRoot, rawPath));
  if (sha256(bytes) !== capture.sha256) {
    throw new Error(`Raw evidence hash drift for ${capture.sourceId}`);
  }
  const html = bytes.toString("utf8");
  const title =
    firstMatch(html, [
      /<title[^>]*>([\s\S]*?)<\/title>/i,
      /"headline"\s*:\s*"([^"]+)"/i,
    ]) ?? capture.sourceId;
  const publishedAt = firstMatch(html, [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /name=["']date["'][^>]+content=["']([^"']+)["']/i,
  ]);
  const author = firstMatch(html, [
    /"author"\s*:\s*\{[^{}]{0,1600}?"name"\s*:\s*"([^"]+)"/i,
    /"author"\s*:\s*"([^"]+)"/i,
  ]);
  sources.push({
    sourceId: source.sourceId,
    canonicalUrl: source.canonicalUrl,
    finalUrl: capture.finalUrl,
    title,
    publisher: source.publisher,
    author,
    publishedAt,
    publishedDateObserved: publishedAt?.slice(0, 10) ?? null,
    accessedAt: researchCutoff,
    status: source.archiveUrl ? "archivedReplay" : "active",
    sourceClass: source.sourceClass,
    roles: source.roles,
    supportNote: source.note,
    evidence: {
      rawPath,
      rawBytes: bytes.byteLength,
      rawSha256: capture.sha256,
      captureMethod: capture.captureMethod,
      locator:
        "Headline, publication metadata, and the article passages naming the platform, version, public ordinal, and release date.",
      selectedText: boundedHeadlineFragment(title),
    },
    lineage: {
      publisherFamily: source.publisher,
      independentForCorroboration: true,
      note:
        "Multiple pages from one publisher count as one evidence lineage.",
    },
    provenance: {
      ...(capture.reusedFrom
        ? {reusedFrom: capture.reusedFrom}
        : {}),
      ...(capture.capturedFrom
        ? {capturedFrom: capture.capturedFrom}
        : {}),
      ...(source.archiveUrl
        ? {
            archiveUrl: source.archiveUrl,
            archiveCapturedAt: source.archiveCapturedAt,
            originalUrl: source.canonicalUrl,
          }
        : {}),
    },
  });
}
sources.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));

const evidenceRefs = (sourceIds, subject) =>
  sourceIds.map((sourceId) => {
    if (!sourceById.has(sourceId)) {
      throw new Error(`Unknown packet source ${sourceId} for ${subject}`);
    }
    return {
      kind: "packetSource",
      packetPath: packetSourcesPath,
      sourceId,
      locator:
        `Retained page passage or cycle row for ${subject}; apply any source-specific qualification in conflicts.json.`,
      supports:
        `${sourceById.get(sourceId).publisher} evidence for ${subject}'s public availability, explicit ordinal, and/or Pacific calendar date.`,
    };
  });

const exactCheckById = new Map(
  production.exactChecks.map((check) => [check.candidateId, check]),
);
const parentById = new Map(
  production.parentChecks.map((check) => [check.releaseVersionId, check]),
);
const candidateRecords = researchedCandidates.map((item) => {
  const exact = exactCheckById.get(item.candidateId);
  const parent = parentById.get(item.releaseVersionId);
  if (!exact || exact.fullCandidateMatchCount !== 0) {
    throw new Error(`Candidate no longer missing: ${item.candidateId}`);
  }
  if (!parent?.exists) {
    throw new Error(`Candidate parent missing: ${item.releaseVersionId}`);
  }
  const subject = `${item.platform} ${item.version} Public Beta ${item.sequence}`;
  const sourceIds = sourceIdsFor(item);
  const lineages = new Set(
    sourceIds.map((sourceId) => sourceById.get(sourceId)?.publisher),
  );
  if (lineages.size < 2) {
    throw new Error(`Insufficient source independence for ${item.candidateId}`);
  }
  const hasDateConflict =
    item.platform === "iOS" &&
    item.version === "12.4" &&
    item.sequence === 4;
  return {
    candidateId: item.candidateId,
    originCohortId: cohortId,
    platform: item.platform,
    platformId: item.platformId,
    version: item.version,
    releaseVersionId: item.releaseVersionId,
    proposedIdentity: {
      label: item.label,
      routeAlias: item.routeAlias,
      channel: "publicBeta",
      appearanceDate: item.appearanceDate,
      sequence: item.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    ordinalBasis: "explicit",
    candidateStatus: "needsEvidenceReview",
    identityStatus: hasDateConflict ? "conflict" : "confirmed",
    evidenceState: "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published no-CDN query found zero exact matches on parent, publicBeta channel, route alias, label, sequence, and appearance date; the parent releaseVersion exists.",
      exactIdentityMatches: 0,
    },
    evidenceRefs: evidenceRefs(sourceIds, subject),
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: [
      ...(hasDateConflict
        ? [
            "A June 11/June 12 source-date conflict is resolved provisionally to June 12 but still requires independent review.",
          ]
        : []),
      "Independent chronology review is still pending.",
    ],
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "A different reviewer must verify platform applicability, public ordinal, Pacific date, source independence, and conflict handling before any separately authorized implementation.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const notProposedSpecs = [
  {
    platform: "iOS",
    slug: "ios",
    platformId: "platform-ios",
    version: "12.1.3",
    sequence: 1,
    appearanceDate: "2018-12-11",
    classification: "disprovedIdentity",
    reason:
      "The December 11 public appearance was labeled iOS 12.1.2 Public Beta 1. The branch was subsequently renamed; the first exact 12.1.3 public label was Public Beta 2.",
    sourceIds: ["mr-ios-12-1-2-pb1", "iculture-ios-12-1-3"],
    reversalEvidence:
      "A contemporary first-party or independent same-day artifact explicitly labeling a separate iOS 12.1.3 Public Beta 1 distribution.",
  },
  ...["iOS", "iPadOS"].flatMap((platform) => {
    const slug = platform === "iOS" ? "ios" : "ipados";
    const platformId =
      platform === "iOS" ? "platform-ios" : "platform-ipados";
    return [
      {
        platform,
        slug,
        platformId,
        version: "13.5",
        sequence: 1,
        appearanceDate: "2020-04-16",
        classification: "disprovedIdentity",
        reason:
          "The first public seed was explicitly labeled 13.4.5 Public Beta 1. Apple renamed the branch to 13.5 before the next public appearance, Public Beta 2.",
        sourceIds: ["iculture-ios-13-5", "mr-13-5-pb2"],
        reversalEvidence:
          "A contemporary artifact proving a distinct exact-label 13.5 Public Beta 1 distribution after the rename.",
      },
      {
        platform,
        slug,
        platformId,
        version: "13.6",
        sequence: 1,
        appearanceDate: "2020-06-01",
        classification: "disprovedIdentity",
        reason:
          "The first public seed was explicitly labeled 13.5.5 Public Beta 1. Apple renamed the branch to 13.6 before the next public appearance, Public Beta 2.",
        sourceIds: ["iculture-ios-13-6", "mr-13-6-pb2"],
        reversalEvidence:
          "A contemporary artifact proving a distinct exact-label 13.6 Public Beta 1 distribution after the rename.",
      },
    ];
  }),
  ...["iOS", "iPadOS"].map((platform) => ({
    platform,
    slug: platform === "iOS" ? "ios" : "ipados",
    platformId:
      platform === "iOS" ? "platform-ios" : "platform-ipados",
    version: "14.7",
    sequence: 2,
    appearanceDate: "2021-06-02",
    classification: "publicDistributionNotEstablished",
    reason:
      "Beta 2 was developer-only. Public-program histories jump from Public Beta 1 to Public Beta 3 after SIM-failure reports, so a Public Beta 2 event must not be inferred.",
    sourceIds: [
      "mr-14-7-dev2",
      "imore-ios14-history",
      "iculture-ios-14-7",
    ],
    reversalEvidence:
      "A first-party public-program artifact or independent tester capture proving a Public Beta 2 distribution.",
  })),
];
const notProposed = notProposedSpecs.map((item) => {
  const subject = `${item.platform} ${item.version} Public Beta ${item.sequence}`;
  return {
    recordId: `not-proposed:apple:${item.slug}:${item.version}:public-beta-${item.sequence}`,
    originCohortId: cohortId,
    platform: item.platform,
    platformId: item.platformId,
    releaseVersionId: `version-${item.slug}-${versionSlug(item.version)}`,
    apparentIdentity: {
      label: `Public Beta ${item.sequence}`,
      routeAlias: `public-beta-${item.sequence}`,
      channel: "publicBeta",
      appearanceDate: item.appearanceDate,
      sequence: item.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: item.classification,
    reason: item.reason,
    evidenceRefs: evidenceRefs(item.sourceIds, subject),
    reversalEvidence: item.reversalEvidence,
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Negative identity finding remains research-only until independently reviewed.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const existingMatches = allObservedAppearances
  .filter((item) => item.productionExisting)
  .map((item) => {
    const check = exactCheckById.get(item.candidateId);
    return {
      candidateId: item.candidateId,
      platform: item.platform,
      version: item.version,
      releaseVersionId: item.releaseVersionId,
      routeAlias: item.routeAlias,
      appearanceDate: item.appearanceDate,
      exactMatchCount: check.fullCandidateMatchCount,
      existingDocumentIds: check.fullCandidateMatches.map(
        (match) => match._id,
      ),
      disposition: "exactExistingMatchExcludedFromCandidates",
    };
  });

const positiveSequence = allObservedAppearances.map((item) => ({
  key: `${item.platform}:${item.version}:${item.sequence}`,
  candidateId: item.candidateId,
  platform: item.platform,
  platformId: item.platformId,
  version: item.version,
  releaseVersionId: item.releaseVersionId,
  channel: "publicBeta",
  routeAlias: item.routeAlias,
  label: item.label,
  sequence: item.sequence,
  appearanceDate: item.appearanceDate,
  productionDisposition: item.productionExisting
    ? "exactExistingMatch"
    : "confirmedMissingCandidate",
  sourceIds: sourceIdsFor(item),
}));

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-ios-ipados-point-12-14-research",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scope:
    "Research-only audit of public-beta appearances for modeled iOS point releases 12.1–14.8 and iPadOS point releases 13.1–14.8, including explicit skips, legacy labels, production matches, and missing parent models.",
  calendarNormalization:
    "appearanceDate uses the America/Los_Angeles calendar date. Later European, Japanese, or UTC publication dates are preserved as qualifications, not additional appearances.",
  identityRule:
    "Public ordinals follow explicit public-program labeling. They are not inferred from developer ordinals or appearance order; renamed branches and deliberately withheld public seeds remain explicit negative findings.",
  observedAppearanceCount: allObservedAppearances.length,
  candidateCount: candidateRecords.length,
  exactExistingMatchCount: existingMatches.length,
  positiveSequence,
  existingMatches,
  negativeSequence: negativeFindings,
  modelGaps,
  evidenceRequirements: {
    minimumIndependentPublisherFamiliesPerCandidate: 2,
    candidateIdentityFields: [
      "platform",
      "version",
      "public channel",
      "public ordinal",
      "Pacific appearance date",
    ],
    primarySourcesPreferred:
      "Apple artifacts are preferred when retained, but contemporary independent reporting is accepted where historical first-party pages no longer expose seed-level chronology.",
  },
  constraints: {
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    publicationAuthorized: false,
    buildResearchInScope: false,
    independentReviewRequired: true,
  },
  productionReconciliation: {
    capturedAt: production.capturedAt,
    perspective: production.perspective,
    useCdn: production.useCdn,
    totalReleaseEvents: production.productionCounts.totalReleaseEvents,
    platformPublicBetaCounts:
      production.productionCounts.platformPublicBetaCounts,
    scopedPublicBetaEvents:
      production.productionCounts.scopedPublicBetaEvents,
    exactFullMatches: production.productionCounts.exactFullMatches,
    missingParentReleaseVersions: production.parentChecks
      .filter((check) => !check.exists)
      .map((check) => check.releaseVersionId),
    snapshotPath: `${packetPath}/production-snapshot.json`,
  },
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  attemptedSourceCount: fetchLog.sourceCount,
  sourceCount: sources.length,
  reusedSourceCount: fetchLog.results.filter(
    (result) => result.captureMethod === "verified-local-reuse",
  ).length,
  sameDayLocalCaptureCount: fetchLog.results.filter(
    (result) => result.captureMethod === "same-day-local-capture",
  ).length,
  archiveReplayCount: fetchLog.results.filter(
    (result) => result.captureMethod === "internet-archive-replay",
  ).length,
  freshHttpCaptureCount: fetchLog.results.filter(
    (result) => result.captureMethod === "http-html",
  ).length,
  failedCaptureCount: fetchLog.failureCount,
  captureFailures: fetchLog.results.filter(
    (result) => result.status === "failed",
  ),
  copyrightHandling:
    "The packet stores source metadata, hashes, claim locators, and at most twenty words of source-identification text. Raw pages are retained only as internal evidence; no article body is republished.",
  sources,
};

const candidateRegister = {
  formatVersion: "1.0",
  programId: "apple-beta-chronology-gap",
  generatedAt,
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    note:
      "Research-only proposed identities. Passing validation does not authorize CMS mutation, stable ID creation, publication, or deployment.",
  },
  summary: {
    proposedCandidateCount: candidateRecords.length,
    notProposedCount: notProposed.length,
    byStatus: countBy(candidateRecords, (item) => item.candidateStatus),
    byPlatform: countBy(candidateRecords, (item) => item.platform),
    importantQualification:
      "116 modeled identities are corroborated and absent from production, but all remain blocked on independent chronology review. Four additional iPadOS 14.7 public appearances are research-established but cannot become event candidates because the parent releaseVersion is missing.",
  },
  cohorts: [
    {
      cohortId,
      description:
        "Apple iOS 12.1–14.8 and iPadOS 13.1–14.8 point-release public-beta chronology.",
      candidateCount: candidateRecords.length,
      sourcePaths: [
        `${packetPath}/assignment.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/full-sequence-audit.json`,
        `${packetPath}/conflicts.json`,
        `${packetPath}/production-snapshot.json`,
      ],
      supersessionRule:
        "A later independently reviewed packet may supersede a candidate only by candidateId and must preserve an explicit audit trail for date, ordinal, platform, or parent-model changes.",
    },
  ],
  candidates: candidateRecords,
  notProposed,
  nextEvidenceWaves: [
    {
      waveId: "ios-ipados-point-12-14-independent-review",
      scope:
        "Independently review all 118 modeled appearances, 116 missing candidates, two exact existing matches, seven explicit not-proposed identities, all chronology conflicts, and the two iPadOS parent-model gaps.",
      artifactPaths: [
        `${packetPath}/independent-review.json`,
        `${packetPath}/report.md`,
        `${packetPath}/validation.json`,
      ],
      estimatedCandidateCount: candidateRecords.length,
      countStatus: "confirmed",
      requiredNextStep:
        "Assign a reviewer who did not perform this research. Any Sanity implementation requires separate authorization after review.",
    },
  ],
  validationStatus: {
    status: "pending",
    validatedAt: null,
    validator: `${packetPath}/validate-packet.mjs`,
    summaryPath: `${packetPath}/validation.json`,
  },
};

const conflicts = [
  {
    conflictId: "ios-12-4-public-beta-4-date",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 12.4 Public Beta 4: June 11 versus June 12",
    sourceIds: [
      "iculture-ios-12-4",
      "mr-ios-12-4-dev4",
      "gh-ios-12-4-pb4",
      "forbes-ios-12-4-pb4",
    ],
    finding:
      "June 11 was the developer seed. Independent same-cycle Gadget Hacks and Forbes reports explicitly place the public seed on June 12; the iCulture row displays June 11.",
    proposedResolution:
      "Use 2019-06-12 for the public candidate while preserving the disagreement and requiring independent review.",
  },
  {
    conflictId: "ios-12-4-no-public-beta-1",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "iOS 12.4 begins at Public Beta 2",
    sourceIds: ["gh-ios-12-4-pb2", "iculture-ios-12-4"],
    finding:
      "Contemporary reporting explicitly says Public Beta 1 was not released.",
    proposedResolution:
      "Retain PB2 as the first public appearance and do not synthesize PB1.",
  },
  {
    conflictId: "ios-12-1-3-rename",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "iOS 12.1.2 Public Beta 1 became the 12.1.3 branch",
    sourceIds: ["mr-ios-12-1-2-pb1", "iculture-ios-12-1-3"],
    finding:
      "The first appearance carried the 12.1.2 label; the first exact 12.1.3 public label was PB2.",
    proposedResolution:
      "Do not relabel the earlier seed as an exact 12.1.3 PB1 event.",
  },
  {
    conflictId: "ios-ipados-13-5-legacy-label",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "13.4.5 Public Beta 1 was renamed into the 13.5 branch",
    sourceIds: ["iculture-ios-13-5", "mr-13-5-pb2"],
    finding:
      "The branch began under the 13.4.5 label; exact 13.5 public numbering starts at PB2.",
    proposedResolution:
      "Preserve the legacy label and do not invent exact-label 13.5 PB1 events.",
  },
  {
    conflictId: "ios-ipados-13-6-legacy-label",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "13.5.5 Public Beta 1 was renamed into the 13.6 branch",
    sourceIds: ["iculture-ios-13-6", "mr-13-6-pb2"],
    finding:
      "The branch began under the 13.5.5 label; exact 13.6 public numbering starts at PB2.",
    proposedResolution:
      "Preserve the legacy label and do not invent exact-label 13.6 PB1 events.",
  },
  {
    conflictId: "ios-ipados-14-1-no-beta-cycle",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "iOS/iPadOS 14.1 had no public-beta cycle",
    sourceIds: [
      "9to5mac-ios-ipados-14-1-skipped",
      "mr-ios-ipados-14-1-gm-only",
    ],
    finding:
      "Contemporary reporting says beta testing skipped straight to 14.2; 14.1 appears as GM/final only.",
    proposedResolution:
      "Create no 14.1 public-beta candidates.",
  },
  {
    conflictId: "ios-ipados-14-7-public-beta-2-withheld",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "14.7 Public Beta 2 was withheld",
    sourceIds: [
      "mr-14-7-dev2",
      "imore-ios14-history",
      "iculture-ios-14-7",
    ],
    finding:
      "Developer Beta 2 shipped, but public histories jump from PB1 to PB3 after reported SIM failures.",
    proposedResolution:
      "Retain the explicit ordinal gap; do not infer PB2 from the developer event.",
  },
  {
    conflictId: "ios-ipados-14-8-released-without-beta",
    severity: "material",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "iOS/iPadOS 14.8 had no beta testing",
    sourceIds: [
      "9to5mac-ios-ipados-14-8-no-beta",
      "mr-ios-ipados-14-8-final",
    ],
    finding:
      "Contemporary final-release coverage explicitly reports that 14.8 was not beta tested.",
    proposedResolution:
      "Create no 14.8 public-beta candidates.",
  },
  {
    conflictId: "ios-ipados-local-calendar-rollovers",
    severity: "qualification",
    status: "normalizedPendingIndependentReview",
    subject: "European and Japanese publication dates can be one day later",
    sourceIds: [
      "iculture-ios-12-1-1",
      "iculture-ios-12-3",
      "iculture-ios-13-7",
      "iculture-ios-14-3",
      "iculture-ios-14-7",
      "purudo-ios-ipados-14-4-pb2",
    ],
    finding:
      "Several rolling pages display the local next-day date for a Pacific-time Apple release.",
    proposedResolution:
      "Normalize appearanceDate to America/Los_Angeles and preserve local dates as source qualifications.",
  },
  {
    conflictId: "ios-ipados-14-6-public-beta-3-date",
    severity: "qualification",
    status: "resolvedForResearchPendingIndependentReview",
    subject: "14.6 Public Beta 3: May 10 versus May 11",
    sourceIds: [
      "imore-ios14-history",
      "imore-ipados14-history",
      "iculture-ios-14-6",
      "mr-14-6-pb3",
    ],
    finding:
      "The iMore rolling pages show May 11, while multiple contemporary sources and Pacific publication timing support May 10.",
    proposedResolution:
      "Use 2021-05-10 and retain the rolling-page discrepancy.",
  },
  {
    conflictId: "ios-ipados-14-5-existing-public-beta-3",
    severity: "guardrail",
    status: "productionReconciled",
    subject: "14.5 Public Beta 3 already exists for both platforms",
    sourceIds: ["mr-14-5-pb3", "iculture-ios-14-5"],
    finding:
      "Fresh production reconciliation found exact existing iOS and iPadOS PB3 events.",
    proposedResolution:
      "Exclude both identities from the candidate set; do not duplicate them.",
  },
  {
    conflictId: "ipados-14-7-parent-model-gap",
    severity: "material",
    status: "blockedByDataModel",
    subject: "iPadOS 14.7 chronology exists but its parent releaseVersion does not",
    sourceIds: ["imore-ios14-history", "iculture-ios-14-7"],
    finding:
      "PB1, PB3, PB4, and PB5 are established for iPadOS 14.7, but production has no version-ipados-14-7 parent.",
    proposedResolution:
      "Record the sequence in full-sequence-audit.json but create no event candidates until the parent model is separately reviewed and authorized.",
  },
  {
    conflictId: "ipados-14-8-parent-model-gap",
    severity: "material",
    status: "blockedByDataModel",
    subject: "iPadOS 14.8 final release exists historically but its parent releaseVersion does not",
    sourceIds: [
      "9to5mac-ios-ipados-14-8-no-beta",
      "mr-ios-ipados-14-8-final",
    ],
    finding:
      "The historical final release and no-beta boundary are established, while production lacks version-ipados-14-8.",
    proposedResolution:
      "Handle the parent releaseVersion gap separately; no public-beta event is proposed.",
  },
];
const conflictsDocument = {
  formatVersion: 1,
  batchId,
  reviewState: "pendingIndependentReview",
  conflictCount: conflicts.length,
  conflicts,
};

const fullSequenceAudit = {
  formatVersion: 1,
  batchId,
  generatedAt,
  calendarNormalization:
    "America/Los_Angeles calendar date for Apple availability.",
  summary: {
    modeledObservedAppearanceCount: allObservedAppearances.length,
    exactExistingMatchCount: existingMatches.length,
    confirmedMissingCandidateCount: candidateRecords.length,
    establishedUnmodeledAppearanceCount: modelGaps.reduce(
      (sum, gap) => sum + gap.observedPublicSequence.length,
      0,
    ),
    negativeFindingCount: negativeFindings.length,
    modelGapCount: modelGaps.length,
  },
  modeledCycles: platformSpecs.flatMap((platform) =>
    platform.cycles.map((cycle) => ({
      platform: platform.platform,
      platformId: platform.platformId,
      version: cycle.version,
      releaseVersionId: `version-${platform.slug}-${versionSlug(cycle.version)}`,
      appearances: cycle.appearances.map((appearance) => ({
        label: `Public Beta ${appearance.sequence}`,
        routeAlias: `public-beta-${appearance.sequence}`,
        sequence: appearance.sequence,
        appearanceDate: appearance.appearanceDate,
        disposition: appearance.productionExisting
          ? "exactExistingMatch"
          : "confirmedMissingCandidate",
      })),
      terminalBoundary:
        parentById.get(
          `version-${platform.slug}-${versionSlug(cycle.version)}`,
        )?.document?.publicReleaseDate
          ? {
              type: "publicRelease",
              appearanceDate:
                parentById.get(
                  `version-${platform.slug}-${versionSlug(cycle.version)}`,
                ).document.publicReleaseDate,
              note:
                "No later public-beta ordinal is inferred across the terminal public-release boundary.",
            }
          : null,
    })),
  ),
  exactExistingMatches: existingMatches,
  establishedUnmodeledCycles: modelGaps,
  negativeFindings,
  guardrails: [
    "Do not infer public ordinals from developer ordinals.",
    "Do not rewrite legacy 13.4.5 or 13.5.5 labels as exact later-version labels.",
    "Do not create a next public-beta ordinal from a GM, RC, or final release.",
    "Do not create iPadOS 14.7 events until its parent releaseVersion is independently resolved.",
    "Do not create public-beta events for 14.1 or 14.8.",
  ],
};

const selfReview = {
  formatVersion: 1,
  batchId,
  reviewer: "codex-ios-ipados-point-12-14-research",
  reviewedAt: generatedAt,
  status: "passedResearcherSelfCheck",
  checks: {
    allModeledAppearancesAudited: true,
    everyCandidateHasTwoIndependentPublisherFamilies: true,
    allCandidateParentsExist: true,
    allCandidatesAbsentFromProduction: true,
    exactExistingMatchesExcluded: true,
    publicOrdinalsNotInferredFromDeveloperOrdinals: true,
    localCalendarRolloversDocumented: true,
    legacyLabelsPreserved: true,
    modelGapsSeparatedFromCandidates: true,
    sourceCaptureFailures: 0,
    sanityMutationPerformed: false,
  },
  limitations: [
    "This is a researcher self-check, not the required independent chronology review.",
    "Build numbers were intentionally not researched or proposed.",
    "The iOS 12.4 Public Beta 4 date conflict remains visible and must be independently adjudicated.",
  ],
};
const independentReview = {
  formatVersion: 1,
  batchId,
  status: "pending",
  reviewer: null,
  reviewedAt: null,
  decision: null,
  requiredChecks: [
    "Reinspect every candidate's two independent publisher lineages.",
    "Verify explicit public ordinal and America/Los_Angeles appearance date.",
    "Adjudicate all conflicts, especially iOS 12.4 Public Beta 4.",
    "Confirm production reconciliation has not drifted.",
    "Confirm iPadOS 14.7/14.8 parent-model gaps remain separate from event creation.",
  ],
  note:
    "No candidate is publication-eligible and no CMS write is authorized until a different reviewer records a decision.",
};

const report = `# iOS/iPadOS point-release public-beta chronology, 12–14

Research cutoff: ${researchCutoff}. Production snapshot: ${production.capturedAt}, published perspective, CDN disabled.

## Outcome

- ${allObservedAppearances.length} modeled public-beta appearances were established.
- ${candidateRecords.length} are corroborated, have existing parents, and are absent from production: ${countBy(candidateRecords, (item) => item.platform).iOS} iOS and ${countBy(candidateRecords, (item) => item.platform).iPadOS} iPadOS.
- ${existingMatches.length} exact events already exist: iOS 14.5 Public Beta 3 and iPadOS 14.5 Public Beta 3. They were excluded from candidates.
- ${modelGaps[0].observedPublicSequence.length} additional iPadOS 14.7 appearances are historically established but not proposed because \`version-ipados-14-7\` is missing.
- iOS/iPadOS 14.1 had no public-beta cycle, and 14.8 was released without beta testing.
- All candidates remain blocked on independent review. No Sanity mutation, stable ID creation, page build, or deployment occurred.

## Material chronology rules

Public ordinals use explicit public-program labels, never developer-beta numbering or appearance order. Pacific calendar dates are canonical; next-day European or Japanese dates are retained as qualifications. Legacy labels remain legacy labels: 13.4.5 PB1 is not silently rewritten as 13.5 PB1, and 13.5.5 PB1 is not silently rewritten as 13.6 PB1.

The principal unresolved review item is iOS 12.4 Public Beta 4. Gadget Hacks and Forbes independently place the public seed on June 12, one day after the June 11 developer seed; iCulture displays June 11. The candidate provisionally uses June 12 and carries \`identityStatus: conflict\`.

## Candidate counts

| Platform | Candidates | Existing exact matches | Parent-model-blocked appearances |
| --- | ---: | ---: | ---: |
| iOS | 75 | 1 | 0 |
| iPadOS | 41 | 1 | 4 |
| Total | 116 | 2 | 4 |

## Evidence and copyright handling

The source ledger contains ${sources.length} successful captures from ${new Set(sources.map((source) => source.publisher)).size} publisher families. Each candidate cites at least two independent publisher families. Packet excerpts are bounded to twenty headline words; source bodies are not republished. Raw captures are internal audit evidence with SHA-256 hashes.

## Handoff

Start with \`assignment.json\`, inspect candidate-level refs in \`candidates.json\`, adjudicate \`conflicts.json\`, and verify sequence boundaries in \`full-sequence-audit.json\`. Record the independent decision in \`independent-review.json\`. Passing automated validation alone does not authorize implementation.
`;

await Promise.all([
  writeFile(path.join(here, "assignment.json"), json(assignment)),
  writeFile(path.join(here, "sources.json"), json(sourcesDocument)),
  writeFile(path.join(here, "candidates.json"), json(candidateRegister)),
  writeFile(path.join(here, "conflicts.json"), json(conflictsDocument)),
  writeFile(
    path.join(here, "full-sequence-audit.json"),
    json(fullSequenceAudit),
  ),
  writeFile(path.join(here, "self-review.json"), json(selfReview)),
  writeFile(
    path.join(here, "independent-review.json"),
    json(independentReview),
  ),
  writeFile(path.join(here, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      observedAppearances: allObservedAppearances.length,
      candidates: candidateRecords.length,
      candidatesByPlatform: countBy(
        candidateRecords,
        (item) => item.platform,
      ),
      exactExistingMatches: existingMatches.length,
      notProposed: notProposed.length,
      modelGaps: modelGaps.length,
      sources: sources.length,
      conflicts: conflicts.length,
    },
    null,
    2,
  ),
);
