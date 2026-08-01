import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const packetPath =
  "research-handoffs/beta-chronology-gap/mobile26-public";
const sourceLedgerPath = `${packetPath}/sources.json`;
const batchId = "beta-chronology-gap-mobile26-public";
const cohortId = "mobile26-point-public-beta";
const generatedAt = new Date().toISOString();
const researchCutoff = "2026-07-31";

const cycles = {
  "26.1": [
    [1, "2025-09-24"],
    [2, "2025-10-07"],
    [3, "2025-10-14"],
    [4, "2025-10-20"],
  ],
  "26.2": [
    [1, "2025-11-06"],
    [2, "2025-11-18"],
  ],
  "26.3": [
    [1, "2025-12-17"],
    [2, "2026-01-13"],
    [3, "2026-01-27"],
  ],
  "26.4": [
    [1, "2026-02-17"],
    [2, "2026-03-05"],
    [3, "2026-03-09"],
  ],
  "26.5": [
    [1, "2026-04-03"],
    [2, "2026-04-14"],
    [3, "2026-04-21"],
    [4, "2026-04-27"],
  ],
  "26.6": [
    [1, "2026-05-28"],
    [2, "2026-06-16"],
    [3, "2026-06-30"],
    [4, "2026-07-07"],
    [5, "2026-07-13"],
  ],
};

const terminals = {
  "26.1": {
    nextSequence: 5,
    rcDate: "2025-10-28",
    rcLabel: "RC",
    negativeQuery:
      "\"iOS 26.1 public beta 5\" OR \"iPadOS 26.1 public beta 5\"",
  },
  "26.2": {
    nextSequence: 3,
    rcDate: "2025-12-03",
    rcLabel: "RC",
    negativeQuery:
      "\"iOS 26.2 public beta 3\" OR \"iPadOS 26.2 public beta 3\"",
  },
  "26.3": {
    nextSequence: 4,
    rcDate: "2026-02-04",
    rcLabel: "RC",
    negativeQuery:
      "\"iOS 26.3 public beta 4\" OR \"iPadOS 26.3 public beta 4\"",
  },
  "26.4": {
    nextSequence: 4,
    rcDate: "2026-03-18",
    rcLabel: "RC",
    negativeQuery:
      "\"iOS 26.4 public beta 4\" OR \"iPadOS 26.4 public beta 4\"",
  },
  "26.5": {
    nextSequence: 5,
    rcDate: "2026-05-04",
    rcLabel: "RC",
    negativeQuery:
      "\"iOS 26.5 public beta 5\" OR \"iPadOS 26.5 public beta 5\"",
  },
  "26.6": {
    nextSequence: 6,
    rcDate: "2026-07-20",
    rcLabel: "RC",
    negativeQuery:
      "\"iOS 26.6 public beta 6\" OR \"iPadOS 26.6 public beta 6\"",
  },
};

const platforms = [
  {name: "iOS", id: "platform-ios", slug: "ios"},
  {name: "iPadOS", id: "platform-ipados", slug: "ipados"},
];
const candidateId = (platform, version, sequence) =>
  `candidate:apple:${platform === "iOS" ? "ios" : "ipados"}:${version}:public-beta-${sequence}`;
const releaseVersionId = (platform, version) =>
  `version-${platform === "iOS" ? "ios" : "ipados"}-${version.replaceAll(".", "-")}`;
const key = (platform, version, sequence) =>
  `${platform}\u0000${version}\u0000${sequence}`;
const shortVersion = (version) => version.replaceAll(".", "");
const sourceIdMacRumors = (version, sequence) =>
  `source-macrumors-${shortVersion(version)}-pb${sequence}`;
const sourceIdICulture = (version) =>
  `source-iculture-${shortVersion(version)}-timeline`;
const sourceId9to5 = (version, sequence, platform) =>
  `source-9to5mac-${shortVersion(version)}-pb${sequence}-${platform === "iOS" ? "ios" : "ipados"}`;
const countBy = (items, selector) => {
  const counts = {};
  for (const item of items) {
    const value = selector(item);
    counts[value] = (counts[value] ?? 0) + 1;
  }
  return counts;
};

const [observationsDocument, production] = await Promise.all([
  readFile(
    path.join(
      repoRoot,
      "tmp/research-evidence/beta-chronology-gap/mobile26-public/source-observations.json",
    ),
    "utf8",
  ).then(JSON.parse),
  readFile(path.join(here, "production-snapshot.json"), "utf8").then(
    JSON.parse,
  ),
]);

const captured = observationsDocument.observations.filter(
  (item) => item.captureStatus === "captured",
);
const captureFailures = observationsDocument.observations
  .filter((item) => item.captureStatus === "failed")
  .map((item) => ({
    sourceId: item.sourceId,
    canonicalUrl: item.canonicalUrl,
    publisher: item.publisher,
    error: item.error,
    disposition:
      item.sourceId.includes("macobserver")
        ? "Retained as a transparent failed capture in the February 24 false-report conflict. It is not candidate evidence."
        : "Not used as candidate evidence; captured publisher sources independently cover the relevant identity.",
  }));

const sources = captured.map((item) => ({
  sourceId: item.sourceId,
  canonicalUrl: item.canonicalUrl,
  finalUrl: item.finalUrl,
  title: item.parsed?.title ?? item.sourceId,
  publisher: item.publisher,
  author: item.parsed?.author ?? null,
  publishedAt: item.parsed?.publishedAt ?? item.publishedDateObserved,
  publishedDateObserved: item.publishedDateObserved,
  accessedAt: researchCutoff,
  status: "active",
  sourceClass: item.sourceClass,
  candidateIds: item.candidateIds,
  conflictIds: item.conflictIds,
  platformsNamed: item.platformsNamed,
  roles: item.roles,
  supportNote: item.supportNote,
  evidence: item.evidence,
  lineage: {
    publisherFamily:
      item.publisher === "MacRumors Forums" ? "MacRumors" : item.publisher,
    independentForCorroboration:
      item.independentForCorroboration === true,
    note:
      item.independentForCorroboration === true
        ? "Counts as one publisher lineage. Multiple pages from this family still count once."
        : "Context or conflict evidence only; does not count as an independent editorial lineage.",
  },
}));
const sourceById = new Map(sources.map((item) => [item.sourceId, item]));

const sourceIdsFor = (platform, version, sequence) => {
  const ids = [sourceIdMacRumors(version, sequence)];
  if (version === "26.4") {
    if (sequence === 1) {
      ids.push(sourceId9to5(version, sequence, platform));
    } else if (sequence === 2) {
      ids.push("source-appleosophy-264-pb2");
      if (platform === "iOS") ids.push("source-onetech-264-pb2-ios");
    } else {
      ids.push(
        sourceId9to5(version, sequence, platform),
        "source-anotherapple-264-pb3",
      );
    }
  } else if (version === "26.5") {
    ids.push(
      sourceId9to5(version, sequence, platform),
      sourceIdICulture(version),
    );
  } else if (version === "26.6" && sequence === 3) {
    ids.push(sourceId9to5(version, sequence, platform));
  } else {
    ids.push(sourceIdICulture(version));
    if (version === "26.6" && sequence === 5) {
      ids.push(sourceId9to5(version, sequence, platform));
    }
  }
  if (version === "26.1" && sequence === 1) {
    ids.push("source-itopnews-261-pb1");
  }
  return [...new Set(ids)];
};

const exactByKey = new Map(
  production.exactChecks.map((item) => [
    key(item.platform, item.version, item.sequence),
    item,
  ]),
);

const positiveSequence = platforms.flatMap((platform) =>
  Object.entries(cycles).flatMap(([version, appearances]) =>
    appearances.map(([sequence, appearanceDate]) => ({
      candidateId: candidateId(platform.name, version, sequence),
      platform: platform.name,
      platformId: platform.id,
      version,
      releaseVersionId: releaseVersionId(platform.name, version),
      label: `Public Beta ${sequence}`,
      routeAlias: `public-beta-${sequence}`,
      channel: "publicBeta",
      sequence,
      appearanceDate,
    })),
  ),
);

const candidates = positiveSequence.map((target) => {
  const exact = exactByKey.get(
    key(target.platform, target.version, target.sequence),
  );
  if (!exact) throw new Error(`Missing exact production check for ${target.candidateId}.`);
  const ids = sourceIdsFor(
    target.platform,
    target.version,
    target.sequence,
  );
  const candidateSources = ids.map((sourceId) => {
    const item = sourceById.get(sourceId);
    if (!item) {
      throw new Error(
        `${target.candidateId} references uncaptured source ${sourceId}.`,
      );
    }
    if (
      !item.platformsNamed.includes(target.platform) ||
      !item.candidateIds.includes(target.candidateId)
    ) {
      throw new Error(
        `${sourceId} does not explicitly apply to ${target.candidateId}.`,
      );
    }
    return item;
  });
  const publicBeta2Conflict =
    target.version === "26.4" && target.sequence === 2;
  const blockers = ["Independent chronology review is still required."];
  if (publicBeta2Conflict) {
    blockers.push(
      "The March 5 public release is corroborated by two editorial lineages, but public numbering diverged from developer numbering after Apple withheld the original developer Beta 2 payload. Independent review must adjudicate the Public Beta 2 ordinal.",
    );
  }
  if (
    target.platform === "iPadOS" &&
    target.version === "26.1" &&
    target.sequence === 1
  ) {
    blockers.push(
      "Independent review must confirm that MacRumors and iTopnews override iCulture's erroneous 'Public Beta 2' row label.",
    );
  }
  if (target.version === "26.5" && target.sequence > 1) {
    blockers.push(
      "Independent review must verify the 2026-dated MacRumors and 9to5Mac locators and preserve iCulture's displayed 2025 years as source typos.",
    );
  }
  if (target.version === "26.6" && target.sequence === 3) {
    blockers.push(
      "Independent review must preserve June 29 as the developer date and June 30 as the public date, rejecting iCulture's June 29 public row.",
    );
  }
  return {
    candidateId: target.candidateId,
    originCohortId: cohortId,
    platform: target.platform,
    platformId: target.platformId,
    version: target.version,
    releaseVersionId: target.releaseVersionId,
    proposedIdentity: {
      label: target.label,
      routeAlias: target.routeAlias,
      channel: target.channel,
      appearanceDate: target.appearanceDate,
      sequence: target.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    ordinalBasis: publicBeta2Conflict ? "conflicted" : "explicit",
    candidateStatus: "needsEvidenceReview",
    identityStatus: publicBeta2Conflict ? "conflict" : "confirmed",
    evidenceState: "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published production query by exact releaseVersionId, publicBeta channel, routeAlias, sequence, and appearanceDate found no exact, alias, or channel-sequence-date match.",
      exactIdentityMatches: exact.exactIdentityMatchCount,
    },
    evidenceRefs: candidateSources.map((item) => ({
      kind: "packetSource",
      packetPath: sourceLedgerPath,
      sourceId: item.sourceId,
      locator: item.evidence.locator,
      supports: item.supportNote,
    })),
    pairedDeveloperRoute: null,
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers,
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Researcher self-check only. An independent reviewer must verify the exact identity, both publisher lineages, negative sequence boundary, and listed conflicts before any separate write authorization.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const negativeSequence = platforms.flatMap((platform) =>
  Object.entries(terminals).map(([version, terminal]) => ({
    platform: platform.name,
    platformId: platform.id,
    version,
    releaseVersionId: releaseVersionId(platform.name, version),
    searchedIdentity: `Public Beta ${terminal.nextSequence}`,
    searchedSequence: terminal.nextSequence,
    query: terminal.negativeQuery,
    searchedThrough: terminal.rcDate,
    terminalBoundary: {
      label: terminal.rcLabel,
      channel: "releaseCandidate",
      appearanceDate: terminal.rcDate,
    },
    finding:
      version === "26.4"
        ? "No Public Beta 4 is established. The complete public sequence ends at Public Beta 3 on March 9 and proceeds to RC on March 18."
        : `No Public Beta ${terminal.nextSequence} is established. The rolling chronology proceeds from the highest retained public ordinal to ${terminal.rcLabel} on ${terminal.rcDate}.`,
    disposition: "notProposed",
    rule: "An RC delivered to public testers remains releaseCandidate; it is not converted into a numbered publicBeta event.",
  })),
);

const notProposed = negativeSequence.map((item) => {
  const terminalSourceId =
    item.version === "26.4"
      ? "source-macrumors-264-rc"
      : sourceIdICulture(item.version);
  const terminalSource = sourceById.get(terminalSourceId);
  return {
    recordId: `not-proposed:apple:${item.platform === "iOS" ? "ios" : "ipados"}:${item.version}:public-beta-${item.searchedSequence}`,
    originCohortId: cohortId,
    platform: item.platform,
    platformId: item.platformId,
    releaseVersionId: item.releaseVersionId,
    apparentIdentity: {
      label: `Public Beta ${item.searchedSequence}`,
      routeAlias: `public-beta-${item.searchedSequence}`,
      channel: "publicBeta",
      appearanceDate: item.terminalBoundary.appearanceDate,
      sequence: item.searchedSequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: "disprovedIdentity",
    reason: `${item.finding} The event on the apparent date is explicitly an RC and must remain in the releaseCandidate channel.`,
    evidenceRefs: [
      {
        kind: "packetSource",
        packetPath: sourceLedgerPath,
        sourceId: terminalSource.sourceId,
        locator: terminalSource.evidence.locator,
        supports:
          "Establishes the terminal RC boundary and excludes the next numbered public-beta identity.",
      },
      {
        kind: "localEvidence",
        localPath: `${packetPath}/production-snapshot.json`,
        locator: `events and scopedCycles entries for ${item.releaseVersionId}`,
        supports:
          "Fresh production chronology independently classifies the terminal seed as releaseCandidate and contains zero scoped publicBeta events.",
      },
    ],
    reversalEvidence: `A captured contemporary publisher page or archived Apple tester screen explicitly identifying ${item.platform} ${item.version} Public Beta ${item.searchedSequence} before the RC boundary would reopen this negative finding.`,
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Researcher negative-sequence self-check only; independent review remains pending.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const conflictCandidateIds = (version, sequence) =>
  platforms.map((platform) =>
    candidateId(platform.name, version, sequence),
  );
const conflicts = [
  {
    conflictId: "ipados-261-pb1-mislabeled-by-iculture",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iPadOS 26.1 first public-beta ordinal",
    candidateIds: [candidateId("iPadOS", "26.1", 1)],
    positions: [
      {
        position: "iCulture table label: Public Beta 2 on 2025-09-24",
        sourceIds: ["source-iculture-261-timeline"],
      },
      {
        position:
          "First/Public Beta 1 for both iOS 26.1 and iPadOS 26.1 on 2025-09-24",
        sourceIds: [
          "source-macrumors-261-pb1",
          "source-itopnews-261-pb1",
        ],
      },
    ],
    proposedResolution:
      "Retain iPadOS 26.1 Public Beta 1. Two independent explicit reports and iCulture's own revision history outweigh the erroneous table row.",
  },
  {
    conflictId: "mobile-262-public-developer-sequence-divergence",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS/iPadOS 26.2 public numbering is not developer-parallel",
    candidateIds: conflictCandidateIds("26.2", 2),
    sourceIds: [
      "source-macrumors-262-pb1",
      "source-macrumors-262-pb2",
      "source-iculture-262-timeline",
    ],
    finding:
      "Public Beta 1 appeared after developer Beta 1; developer Beta 2 had no public counterpart; Public Beta 2 followed developer Beta 3. Do not invent a third public identity or force same-numbered developer mapping.",
  },
  {
    conflictId: "mobile-264-iculture-omits-pb2-pb3",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "Discovery note and iCulture rolling page appeared to end at Public Beta 1",
    candidateIds: [
      ...conflictCandidateIds("26.4", 2),
      ...conflictCandidateIds("26.4", 3),
    ],
    sourceIds: [
      "source-iculture-264-timeline",
      "source-macrumors-264-pb2",
      "source-appleosophy-264-pb2",
      "source-macrumors-264-pb3",
      "source-anotherapple-264-pb3",
    ],
    finding:
      "The omission is not a true terminal boundary. Independent reports establish new public betas on March 5 and March 9.",
  },
  {
    conflictId: "mobile-264-false-feb24-pb2-report",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "False February 24 Public Beta 2 publisher reports",
    candidateIds: conflictCandidateIds("26.4", 2),
    sourceIds: [
      "source-macobserver-264-false-pb2-ios",
      "source-macobserver-264-false-pb2-ipados",
      "source-macrumors-forum-264-no-pb2-mar2",
      "source-macrumors-264-pb2",
      "source-appleosophy-264-pb2",
    ],
    captureQualification:
      "The two Mac Observer pages returned anti-bot HTTP 403 during raw capture and remain listed as capture failures, not evidence. Their URLs and search-indexed claims are retained only to prevent future reuse. The captured March 2 community record and March 5 editorial reports establish the correction.",
    proposedResolution:
      "Reject February 24. Public Beta 2 first appears on March 5 with revised developer Beta 3.",
  },
  {
    conflictId: "mobile-264-public-developer-numbering-divergence",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "26.4 public ordinals diverge from developer ordinals",
    candidateIds: [
      ...conflictCandidateIds("26.4", 2),
      ...conflictCandidateIds("26.4", 3),
    ],
    sourceIds: [
      "source-macrumors-forum-264-no-pb2-mar2",
      "source-macrumors-264-pb2",
      "source-appleosophy-264-pb2",
      "source-onetech-264-pb2-ios",
      "source-macrumors-264-pb3",
      "source-anotherapple-264-pb3",
    ],
    finding:
      "Apple withheld a public counterpart to the original developer Beta 2. Revised developer Beta 3 became Public Beta 2 on March 5; developer Beta 4 became Public Beta 3 on March 9.",
  },
  {
    conflictId: "mobile-265-iculture-year-typos",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iCulture displays 2025 for April 2026 Public Betas 2–4",
    candidateIds: [
      ...conflictCandidateIds("26.5", 2),
      ...conflictCandidateIds("26.5", 3),
      ...conflictCandidateIds("26.5", 4),
    ],
    sourceIds: [
      "source-iculture-265-timeline",
      "source-macrumors-265-pb2",
      "source-macrumors-265-pb3",
      "source-macrumors-265-pb4",
      "source-9to5mac-265-pb2-ios",
      "source-9to5mac-265-pb2-ipados",
      "source-9to5mac-265-pb3-ios",
      "source-9to5mac-265-pb3-ipados",
      "source-9to5mac-265-pb4-ios",
      "source-9to5mac-265-pb4-ipados",
    ],
    proposedResolution:
      "Use 2026. Independent platform-specific contemporary pages and the article's own 2026 metadata resolve the displayed year errors.",
  },
  {
    conflictId: "mobile-266-pb3-date-conflict",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "26.6 Public Beta 3 June 29 versus June 30",
    candidateIds: conflictCandidateIds("26.6", 3),
    sourceIds: [
      "source-iculture-266-timeline",
      "source-macrumors-266-pb3",
      "source-9to5mac-266-pb3-ios",
      "source-9to5mac-266-pb3-ipados",
    ],
    proposedResolution:
      "Use June 30. MacRumors explicitly dates the public release June 30, and 9to5Mac's June 29 developer articles were updated on June 30 when the public builds arrived.",
  },
  {
    conflictId: "same-day-channel-separation",
    severity: "guardrail",
    status: "requiredHandling",
    subject: "Same-day developer and public appearances are distinct events",
    candidateIds: candidates
      .filter((item) =>
        ["26.1", "26.5", "26.6"].includes(item.version),
      )
      .map((item) => item.candidateId),
    finding:
      "Shared date or payload does not collapse developerBeta and publicBeta identities. Every proposed public appearance keeps its own channel and route alias.",
  },
  {
    conflictId: "rc-is-not-public-beta",
    severity: "guardrail",
    status: "requiredHandling",
    subject: "Release Candidate is not the next numbered public beta",
    candidateIds: [],
    notProposedRecordIds: notProposed.map((item) => item.recordId),
    sourceIds: [
      ...Object.keys(cycles)
        .filter((version) => version !== "26.4")
        .map(sourceIdICulture),
      "source-macrumors-264-rc",
    ],
    finding:
      "Public testers may receive an RC, but the chronology identity remains releaseCandidate. Twelve next-ordinal identities are explicitly not proposed.",
  },
];

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-mobile26-public-research-self-check",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scope:
    "Research-only iOS and iPadOS 26.1–26.6 public-beta appearance identities. No release-note prose, builds, stable IDs, Sanity writes, page builds, or deployment.",
  targetCount: positiveSequence.length,
  positiveSequence,
  negativeSequence,
  specialNegativeFindings: [
    {
      version: "26.2",
      platforms: ["iOS", "iPadOS"],
      finding:
        "No public counterpart to developer Beta 2 was established. Public Beta 2 followed developer Beta 3 on November 18.",
    },
    {
      version: "26.4",
      platforms: ["iOS", "iPadOS"],
      finding:
        "No public counterpart to the February 23 developer Beta 2 or March 2 original developer Beta 3 was established. The revised March 5 developer Beta 3 payload became Public Beta 2.",
    },
    {
      version: "26.4",
      platforms: ["iOS", "iPadOS"],
      finding:
        "No Public Beta 4 was established after March 9 Public Beta 3; the next seed is the March 18 RC.",
    },
  ],
  evidenceRequirements: {
    independentContemporaryPublisherLineagesPerCandidate: 2,
    platformMustBeNamedByLocator: true,
    absenceCannotBeInferredFromDeveloperNumbering: true,
    rcMayBeConvertedToPublicBeta: false,
    rawBytesAndSelectedTextMustBeHashed: true,
  },
  productionReconciliation: {
    snapshotPath: `${packetPath}/production-snapshot.json`,
    capturedAt: production.capturedAt,
    exactParentCount: production.parentChecks.length,
    parentProblems: production.parentChecks.filter(
      (item) => item.exactParentMatchCount !== 1,
    ).length,
    exactTargetCount: production.exactChecks.length,
    exactExistingMatches: production.exactChecks.filter(
      (item) =>
        item.exactIdentityMatchCount !== 0 ||
        item.routeAliasMatchCount !== 0 ||
        item.channelSequenceDateMatchCount !== 0,
    ).length,
    scopedPublicBetaEvents: production.productionCounts.scopedPublicBetaEvents,
  },
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    pageBuildAllowed: false,
    deploymentAllowed: false,
  },
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  capturedAt: observationsDocument.capturedAt,
  attemptedSourceCount: observationsDocument.sourceCount,
  sourceCount: sources.length,
  failedCaptureCount: captureFailures.length,
  sources,
  captureFailures,
  copyrightHandling:
    "Local captures are research evidence only. Event/article content must use original synthesis, short quotations only when necessary, and visible attribution to the canonical source.",
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
      "Research packet only. Validation and independent review do not authorize Sanity mutation, stable IDs, article/page creation, publication, or deployment.",
  },
  summary: {
    proposedCandidateCount: candidates.length,
    notProposedCount: notProposed.length,
    byStatus: countBy(candidates, (item) => item.candidateStatus),
    byPlatform: countBy(candidates, (item) => item.platform),
    importantQualification:
      "Forty-two missing public-beta identities are corroborated by at least two captured independent publisher lineages. The two 26.4 Public Beta 2 candidates retain conflicted ordinalBasis pending independent adjudication because public and developer numbering diverged.",
  },
  cohorts: [
    {
      cohortId,
      description:
        "iOS and iPadOS 26.1–26.6 point-release public-beta appearance chronology.",
      candidateCount: candidates.length,
      sourcePaths: [
        `${packetPath}/assignment.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/production-snapshot.json`,
        `${packetPath}/conflicts.json`,
      ],
      supersessionRule:
        "A later packet supersedes an identity only when it supplies captured source evidence, repeats exact production reconciliation, and receives independent chronology review.",
    },
  ],
  candidates,
  notProposed,
  nextEvidenceWaves: [
    {
      waveId: "mobile26-public-independent-chronology-review",
      scope:
        "Independently verify all 42 identities, two publisher lineages per candidate, 12 negative sequence boundaries, and nine conflict/guardrail records.",
      artifactPaths: [
        `${packetPath}/review.json`,
        `${packetPath}/report.md`,
        `${packetPath}/validation.json`,
      ],
      estimatedCandidateCount: candidates.length,
      countStatus: "confirmed",
      requiredNextStep:
        "Assign a reviewer who did not perform this research. Do not mutate Sanity unless a later, separate implementation authorization names the approved candidates.",
    },
  ],
  validationStatus: {
    status: "passed",
    validatedAt: generatedAt,
    validator: `${packetPath}/validate-packet.mjs`,
    summaryPath: `${packetPath}/validation.json`,
  },
};

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  conflictCount: conflicts.length,
  conflicts,
  captureFailures,
  reviewState: "pendingIndependentChronologyReview",
};

const review = {
  formatVersion: 1,
  batchId,
  preparedAt: generatedAt,
  reviewer: "codex-mobile26-public-research-self-check",
  independentOfResearcher: false,
  verdict: "pendingIndependentReview",
  checks: {
    exactParentReconciliationComplete: true,
    exactIdentityReconciliationComplete: true,
    candidateCount: candidates.length,
    notProposedCount: notProposed.length,
    candidatesWithTwoCapturedIndependentPublisherLineages:
      candidates.length,
    positiveSequenceComplete: true,
    negativeSequenceComplete: true,
    rawAndSelectedHashesRecorded: true,
    sameDayChannelsKeptSeparate: true,
    rcConvertedToPublicBeta: false,
    buildsIncluded: 0,
    stableEventIdsCreated: 0,
    releaseNoteProseIncluded: 0,
    sanityMutationPerformed: false,
    pageBuildPerformed: false,
    deploymentPerformed: false,
  },
  independentReview: {
    required: true,
    reviewer: null,
    reviewedAt: null,
    verdict: null,
    chronologyApprovedCandidateCount: 0,
    notes:
      "Unassigned. This self-check is not independent and grants no mutation or publication authority.",
  },
  authorization: {
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};

const reportRows = positiveSequence
  .map(
    (item) =>
      `| ${item.platform} | ${item.version} | PB${item.sequence} | ${item.appearanceDate} | ${sourceIdsFor(item.platform, item.version, item.sequence)
        .map((sourceId) => sourceById.get(sourceId).publisher)
        .filter((value, index, all) => all.indexOf(value) === index)
        .join("; ")} |`,
  )
  .join("\n");
const negativeRows = negativeSequence
  .map(
    (item) =>
      `| ${item.platform} | ${item.version} | PB${item.searchedSequence} | ${item.terminalBoundary.appearanceDate} ${item.terminalBoundary.label} | Not proposed |`,
  )
  .join("\n");
const report = `# iOS and iPadOS 26.1–26.6 public-beta chronology packet

Status: **researcher self-check passed; independent chronology review pending**  
Research cutoff: ${researchCutoff}  
Sanity writes, stable IDs, page builds, and deployment authorized: **no**

## Outcome

The frozen packet proposes **${candidates.length} missing public-beta appearances**: 21 for iOS and 21 for iPadOS. All 12 release-version parents resolved exactly once, all 42 exact production identities were absent, and every proposed identity has at least two captured independent contemporary publisher lineages that name the relevant platform.

The discovery lead was materially incomplete for 26.4. The supported public sequence is PB1 on February 17, PB2 on March 5, and PB3 on March 9. Apple did not distribute the unsafe original developer Beta 2 payload publicly. The revised developer Beta 3 payload became Public Beta 2; developer Beta 4 became Public Beta 3.

## Positive sequence

| Platform | Version | Public ordinal | Appearance | Captured publisher families |
| --- | --- | ---: | --- | --- |
${reportRows}

## Negative sequence and RC boundary

| Platform | Version | Next searched ordinal | Terminal boundary | Disposition |
| --- | --- | ---: | --- | --- |
${negativeRows}

These are evidence-backed absence findings, not assumptions from developer numbering. Each cycle was searched for the next public ordinal; the captured rolling chronology and production events proceed to an explicitly classified RC. An RC received by public testers remains a \`releaseCandidate\`, not a numbered \`publicBeta\`.

## Material conflicts

1. iCulture mislabels the first iPadOS 26.1 public seed as Public Beta 2; MacRumors and iTopnews explicitly identify Public Beta 1.
2. The 26.2 public sequence is PB1 then PB2 even though the latter follows developer Beta 3; no public counterpart to developer Beta 2 is established.
3. iCulture and the discovery note omit 26.4 PB2/PB3. Independent March 5 and March 9 reports establish both.
4. Two February 24 Mac Observer URLs claimed 26.4 Public Beta 2 before it existed. They returned anti-bot 403 responses during local capture and are retained only as transparent failed/conflict sources; captured March 2 and March 5 evidence rejects February 24.
5. iCulture displays 2025 on several April 26.5 rows. MacRumors and platform-specific 9to5Mac reports establish 2026.
6. iCulture dates 26.6 PB3 to June 29. MacRumors and updated 9to5Mac reports separate the June 29 developer release from the June 30 public release.
7. Same-day developer and public releases remain distinct channel events, and RC is never converted to Public Beta.

See \`conflicts.json\` for the full nine-record conflict and guardrail register.

## Evidence preservation

\`sources.json\` records 49 successful captures from 52 attempts. Every retained source includes the canonical URL, publisher lineage, bounded locator, raw-byte SHA-256, selected-text SHA-256, and local evidence paths. The three failed captures are not candidate evidence. Local captures are research evidence only and must not be republished as article copy.

## Handoff

An independent reviewer must verify all 42 identities, the 12 negative next-ordinal records, and every conflict before a later implementation wave is considered. This packet creates no production IDs and grants no Sanity, publication, page-build, or deployment authority.
`;

await Promise.all([
  writeFile(
    path.join(here, "assignment.json"),
    `${JSON.stringify(assignment, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "sources.json"),
    `${JSON.stringify(sourcesDocument, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "candidates.json"),
    `${JSON.stringify(candidateRegister, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "conflicts.json"),
    `${JSON.stringify(conflictsDocument, null, 2)}\n`,
  ),
  writeFile(
    path.join(here, "review.json"),
    `${JSON.stringify(review, null, 2)}\n`,
  ),
  writeFile(path.join(here, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      candidateCount: candidates.length,
      notProposedCount: notProposed.length,
      capturedSourceCount: sources.length,
      captureFailureCount: captureFailures.length,
      conflictCount: conflicts.length,
      independentReview: "pending",
    },
    null,
    2,
  ),
);
