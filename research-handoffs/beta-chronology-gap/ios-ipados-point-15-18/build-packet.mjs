import {createHash} from "node:crypto";
import {copyFile, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allObservedAppearances,
  batchId,
  cohortId,
  evidenceRoot,
  explicitNegativeFindings,
  packetPath,
  platformSpecs,
  researchCutoff,
  sourceDateConflicts,
  targetVersionIds,
} from "./research-data.mjs";
import {
  sourceIdsForCandidate,
  sourceSpecsFor,
} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const absolute = (relativePath) => path.join(repoRoot, relativePath);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const writeJson = (filename, value) =>
  writeFile(path.join(here, filename), json(value));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const countBy = (items, selector) => {
  const result = {};
  for (const item of items) {
    const key = selector(item);
    result[key] = (result[key] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b)),
  );
};

const coveragePath =
  "research-handoffs/beta-chronology-gap/coverage-matrix.json";
const schemaPath =
  "research-handoffs/beta-chronology-gap/proposed-event-candidate.schema.json";
const [fetchLog, production, coverageBytes] = await Promise.all([
  readFile(absolute(`${evidenceRoot}/fetch-log.json`), "utf8").then(JSON.parse),
  readFile(
    absolute(`${evidenceRoot}/production-snapshot.json`),
    "utf8",
  ).then(JSON.parse),
  readFile(absolute(coveragePath)),
]);
const coverage = JSON.parse(coverageBytes);
const sourceSpecs = sourceSpecsFor(allObservedAppearances);
const sourceSpecById = new Map(
  sourceSpecs.map((source) => [source.sourceId, source]),
);

assert(fetchLog.failureCount === 0, "Source capture failures remain.");
assert(
  fetchLog.sourceCount === sourceSpecs.length &&
    fetchLog.results.length === sourceSpecs.length,
  "Source capture roster drifted from source specs.",
);
assert(
  production.perspective === "published" && production.useCdn === false,
  "Production snapshot must be published and no-CDN.",
);
assert(
  production.observedAppearanceCount === allObservedAppearances.length &&
    production.exactChecks.length === allObservedAppearances.length,
  "Production snapshot does not cover every researched identity.",
);
assert(
  production.parentChecks.length === targetVersionIds.length &&
    production.parentChecks.every((item) => item.exists),
  "A scoped releaseVersion parent is missing.",
);
assert(
  production.exactChecks.every(
    (item) =>
      item.routeIdentityMatchCount === 0 &&
      item.fullCandidateMatchCount === 0,
  ),
  "A researched identity now overlaps production.",
);

const scopedCoverageRows = coverage.remainingPublicBetaAuditRows.filter(
  (row) => {
    const major = Number(row.version.split(".")[0]);
    return (
      ["iOS", "iPadOS"].includes(row.platform) &&
      major >= 15 &&
      major <= 18
    );
  },
);
assert(scopedCoverageRows.length === 75, "Expected 75 scoped coverage rows.");
assert(
  new Set(scopedCoverageRows.map((row) => row.releaseVersionId)).size === 75,
  "Scoped coverage rows contain duplicate parents.",
);
assert(
  scopedCoverageRows.every((row) =>
    targetVersionIds.includes(row.releaseVersionId),
  ),
  "Scoped coverage row is absent from the production parent query.",
);

const selectedBySourceId = new Map();
const sources = [];
const rawLocks = [];
for (const capture of fetchLog.results) {
  const spec = sourceSpecById.get(capture.sourceId);
  assert(spec, `Missing source spec ${capture.sourceId}.`);
  const rawPath = `${evidenceRoot}/raw/${capture.rawFilename}`;
  const selectedPath =
    `${evidenceRoot}/selected/${capture.selectedFilename}`;
  const [raw, selectedBytes] = await Promise.all([
    readFile(absolute(rawPath)),
    readFile(absolute(selectedPath)),
  ]);
  assert(
    raw.byteLength === capture.rawBytes &&
      sha256(raw) === capture.rawSha256,
    `Raw evidence drift for ${capture.sourceId}.`,
  );
  assert(
    selectedBytes.byteLength === capture.selectedBytes &&
      sha256(selectedBytes) === capture.selectedSha256,
    `Selected evidence drift for ${capture.sourceId}.`,
  );
  const selected = JSON.parse(selectedBytes);
  selectedBySourceId.set(capture.sourceId, selected);
  sources.push({
    sourceId: capture.sourceId,
    canonicalUrl: capture.canonicalUrl,
    finalUrl: capture.finalUrl,
    title: selected.title,
    publisher: capture.publisher,
    publishedAt: selected.publishedAt,
    modifiedAt: selected.modifiedAt,
    accessedAt: researchCutoff,
    sourceClass: spec.sourceClass,
    roles: spec.roles,
    supportNote: spec.note,
    lineage: {
      publisherFamily: capture.publisher,
      independentForCorroboration: spec.lineageIndependent,
      note:
        "Pages from one publisher count as one editorial lineage; a syndication or citation relationship must not be counted twice.",
    },
    evidence: {
      rawPath,
      rawBytes: capture.rawBytes,
      rawSha256: capture.rawSha256,
      selectedPath,
      selectedBytes: capture.selectedBytes,
      selectedSha256: capture.selectedSha256,
      captureMethod: capture.captureMethod,
      locatorHints: selected.locatorHints,
      candidateClaimAssignments: selected.candidateClaimAssignments,
      copyrightHandling: selected.copyrightHandling,
    },
  });
  rawLocks.push({
    sourceId: capture.sourceId,
    rawPath,
    rawBytes: capture.rawBytes,
    rawSha256: capture.rawSha256,
    selectedPath,
    selectedBytes: capture.selectedBytes,
    selectedSha256: capture.selectedSha256,
  });
}
sources.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
rawLocks.sort((a, b) => a.sourceId.localeCompare(b.sourceId));
const sourceById = new Map(sources.map((source) => [source.sourceId, source]));
const exactByCandidateId = new Map(
  production.exactChecks.map((item) => [item.candidateId, item]),
);
const packetSourcesPath = `${packetPath}/sources.json`;
const evidenceRefs = (item) =>
  sourceIdsForCandidate(item).map((sourceId) => {
    const source = sourceById.get(sourceId);
    assert(source, `Unknown source ${sourceId} for ${item.candidateId}.`);
    return {
      kind: "packetSource",
      packetPath: packetSourcesPath,
      sourceId,
      locator:
        `sources.json sourceId=${sourceId}, evidence.candidateClaimAssignments candidateId=${item.candidateId}; apply conflicts.json before use.`,
      supports:
        `${source.publisher} evidence concerning ${item.platform} ${item.version} Public Beta ${item.sequence}, its public audience, ordinal, and/or Pacific appearance date.`,
    };
  });

const locatorComplete = (assignment) =>
  Boolean(
    assignment?.locators?.platform &&
      assignment.locators.version &&
      assignment.locators.publicChannel &&
      assignment.locators.publicOrdinal,
  );
const candidateEvidenceAudit = (item) => {
  const assignments = sourceIdsForCandidate(item).map((sourceId) => ({
    sourceId,
    publisher: sourceById.get(sourceId)?.publisher,
    assignment: selectedBySourceId
      .get(sourceId)
      ?.candidateClaimAssignments?.find(
        (claim) => claim.candidateId === item.candidateId,
      ),
  }));
  const complete = assignments.filter((entry) =>
    locatorComplete(entry.assignment),
  );
  return {
    assignments,
    completeAssignmentCount: complete.length,
    completePublisherLineageCount: new Set(
      complete.map((entry) => entry.publisher),
    ).size,
  };
};
const isIpad161Conflict = (item) =>
  item.platform === "iPadOS" && item.version === "16.1";

const candidateRecords = allObservedAppearances.map((item) => {
  const productionCheck = exactByCandidateId.get(item.candidateId);
  assert(
    productionCheck?.routeIdentityMatchCount === 0 &&
      productionCheck?.fullCandidateMatchCount === 0,
    `Production absence proof missing for ${item.candidateId}.`,
  );
  const evidenceAudit = candidateEvidenceAudit(item);
  const conflicted = isIpad161Conflict(item);
  if (!conflicted) {
    assert(
      evidenceAudit.completePublisherLineageCount >= 2,
      `${item.candidateId} lacks two exact selected-evidence publisher lineages.`,
    );
  }
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
    ordinalBasis: conflicted ? "conflicted" : "explicit",
    candidateStatus: conflicted
      ? "needsEvidenceReview"
      : "readyForChronologyReview",
    identityStatus: conflicted ? "conflict" : "confirmed",
    evidenceState: conflicted ? "reported" : "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published/no-CDN query found zero route or full identity matches; the exact releaseVersion parent exists.",
      exactIdentityMatches: 0,
    },
    evidenceRefs: evidenceRefs(item),
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: conflicted
      ? [
          "The iPadOS 16 to 16.1 transition produced irreconcilable campaign and exact-version numbering in retained publishers.",
          "Do not create an event until an independent reviewer resolves platform-specific public ordinal and Pacific date from two exact publisher lineages.",
        ]
      : ["Independent chronology review is pending."],
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Review exact platform, public audience, displayed public ordinal, Pacific date, sequence completeness, source independence, and conflicts before integration.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const readyCandidates = candidateRecords.filter(
  (item) => item.candidateStatus === "readyForChronologyReview",
);
const conflictCandidates = candidateRecords.filter(
  (item) => item.identityStatus === "conflict",
);
assert(readyCandidates.length === 153, "Expected 153 gate-passed candidates.");
assert(conflictCandidates.length === 6, "Expected six iPadOS 16.1 conflicts.");

const officialStableSource = (version) =>
  `apple-ios${version.split(".")[0]}-updates`;
const negativeSourcesForRow = (row) => {
  if (row.version === "15.7") {
    return [
      "apple-security-ios-ipados-15-7",
      "appleinsider-ios-ipados-15-7-rc",
      "9to5-ios-15-7-beta1-label",
    ];
  }
  if (row.version === "16.7") {
    return [
      "apple-ios16-updates",
      "iclarified-ios-ipados-16-7-rc",
    ];
  }
  if (row.version === "17.7") {
    return [
      "apple-ios17-updates",
      "iclarified-ios-ipados-17-7-rc",
    ];
  }
  if (row.version === "18.7") {
    return [
      "apple-ios18-updates",
      "9to5-ios-18-7-public-label",
      "ipswdev-ios-ipados-18-7-rc",
    ];
  }
  return [officialStableSource(row.version)];
};
const positiveParentIds = new Set(
  platformSpecs.flatMap(({cycles, slug}) =>
    cycles.map(
      ({version}) => `version-${slug}-${version.replaceAll(".", "-")}`,
    ),
  ),
);
const noPositiveRows = scopedCoverageRows.filter(
  (row) => !positiveParentIds.has(row.releaseVersionId),
);
assert(noPositiveRows.length === 34, "Expected 34 no-positive audit rows.");
const noPositiveRecords = noPositiveRows.map((row) => ({
  recordId:
    `not-proposed:apple:${row.platform.toLowerCase()}:${row.version}:any-public-beta`,
  platform: row.platform,
  platformId: row.platformId,
  version: row.version,
  releaseVersionId: row.releaseVersionId,
  apparentRouteAlias: null,
  classification: "publicDistributionNotEstablished",
  result:
    ["15.7", "16.7", "17.7", "18.7"].includes(row.version)
      ? "evidenceBackedTerminalBoundaryWithoutNumberedPublicBeta"
      : "noPositivePublicBetaCandidateLocated",
  reason:
    ["15.7", "16.7", "17.7", "18.7"].includes(row.version)
      ? "Retained evidence establishes an RC/final terminal boundary or resolves a conflicting generic beta label; no separately numbered public-beta identity is proposed."
      : "This modeled patch was audited as an applicability check. No positive, exact public-beta identity meeting the evidence gate was located; absence from stable release notes alone is not proof that no beta existed.",
  sourceIds: negativeSourcesForRow(row),
  reversalEvidence:
    "Two independent, platform-specific sources explicitly establishing the exact public ordinal and Pacific availability date would reopen this finding.",
  flags: {sanityMutationAllowed: false, publicationEligible: false},
}));
const skippedOrdinalRecords = [
  ...["iOS", "iPadOS"].map((platform) => ({
    recordId:
      `not-proposed:apple:${platform.toLowerCase()}:17.3:public-beta-2`,
    platform,
    platformId:
      platform === "iOS" ? "platform-ios" : "platform-ipados",
    version: "17.3",
    releaseVersionId:
      `version-${platform.toLowerCase()}-17-3`,
    apparentRouteAlias: "public-beta-2",
    classification: "disprovedIdentity",
    result: "withdrawnDeveloperSeedNeverReachedPublicProgram",
    reason:
      "The corresponding developer beta was withdrawn. The retained public sequence explicitly jumps from Public Beta 1 to Public Beta 3.",
    sourceIds: [
      "9to5-926341",
      "mr-ios-ipados-17-3-beta2-withdrawn",
    ],
    reversalEvidence:
      "Two independent platform-specific sources explicitly showing an iOS/iPadOS 17.3 Public Beta 2 distribution would reopen this finding.",
    flags: {sanityMutationAllowed: false, publicationEligible: false},
  })),
  ...["iOS", "iPadOS"].map((platform) => ({
    recordId:
      `not-proposed:apple:${platform.toLowerCase()}:18.5:public-beta-4`,
    platform,
    platformId:
      platform === "iOS" ? "platform-ios" : "platform-ipados",
    version: "18.5",
    releaseVersionId:
      `version-${platform.toLowerCase()}-18-5`,
    apparentRouteAlias: "public-beta-4",
    classification: "disprovedIdentity",
    result: "developerOrdinalWasPublicBeta3",
    reason:
      "Developer Beta 4 mapped to Public Beta 3; the next public-program appearance was the release candidate.",
    sourceIds: [
      "mr-ios-ipados-18-5-pb3",
      "monomaniac-april-2025",
      "iculture-ios-18-5",
    ],
    reversalEvidence:
      "Two independent platform-specific sources explicitly showing an iOS/iPadOS 18.5 Public Beta 4 distribution would reopen this finding.",
    flags: {sanityMutationAllowed: false, publicationEligible: false},
  })),
];
const notProposedRecords = [
  ...noPositiveRecords,
  ...skippedOrdinalRecords,
];
assert(notProposedRecords.length === 38, "Expected 38 not-proposed records.");
assert(
  notProposedRecords.every((item) =>
    item.sourceIds.every((sourceId) => sourceById.has(sourceId)),
  ),
  "A not-proposed record references an unknown source.",
);

const cycles = platformSpecs.flatMap((platform) =>
  platform.cycles.map((cycle) => {
    const appearances = allObservedAppearances.filter(
      (item) =>
        item.platform === platform.platform &&
        item.version === cycle.version,
    );
    const ordinals = appearances.map((item) => item.sequence);
    const max = Math.max(...ordinals);
    const gaps = Array.from({length: max}, (_, index) => index + 1).filter(
      (ordinal) => !ordinals.includes(ordinal),
    );
    return {
      cycleId:
        `${platform.slug}:${cycle.version}:public-beta-sequence`,
      platform: platform.platform,
      version: cycle.version,
      releaseVersionId: appearances[0].releaseVersionId,
      candidateIds: appearances.map((item) => item.candidateId),
      observedPublicOrdinals: ordinals,
      observedAppearanceDates: appearances.map(
        (item) => item.appearanceDate,
      ),
      maxObservedPublicOrdinal: max,
      internalOrdinalGaps: gaps,
      terminalStableDate: cycle.terminalDate,
      nextOrdinalBoundary: {
        testedOrdinal: max + 1,
        proposed: false,
        result:
          cycle.version === "18.5"
            ? "Developer Beta 4 was Public Beta 3; RC followed."
            : "No exact next public ordinal was established before the terminal release boundary.",
      },
      sequenceStatus: isIpad161Conflict({
        platform: platform.platform,
        version: cycle.version,
      })
        ? "conflicted"
        : gaps.length
          ? "explicitSkipPreserved"
          : "completeThroughObservedMaximum",
    };
  }),
);
assert(cycles.length === 41, "Expected 41 positive public-beta cycles.");

const generatedAt = production.capturedAt;
const assignment = {
  formatVersion: 1,
  batchId,
  cohortId,
  generatedAt,
  researchCutoff,
  scope:
    "Research-only public-beta chronology audit for every remaining coverage-matrix iOS/iPadOS point-release row from 15.1 through 18.7; exact major cycles and 26.x are excluded.",
  coverageMatrix: {
    path: coveragePath,
    generatedAt: coverage.generatedAt,
    bytes: coverageBytes.byteLength,
    sha256: sha256(coverageBytes),
    scopedRowCount: scopedCoverageRows.length,
    positiveCycleRowCount: 41,
    noPositiveCandidateRowCount: noPositiveRows.length,
    rows: scopedCoverageRows,
  },
  productionScope: {
    queriedParentCount: targetVersionIds.length,
    missingParentCount: 0,
    missingParents: [],
    researchedIdentityCount: allObservedAppearances.length,
  },
  evidenceRules: {
    timezone: "America/Los_Angeles",
    pairedPlatformInferenceAllowed: false,
    developerOrdinalInferenceAllowed: false,
    readyCandidateGate:
      "Two independent publisher lineages with selected locators for exact platform, version, public channel, ordinal, and date; conflicts remain blocked.",
    rawAndSelectedEvidenceFrozen: true,
    conflictsPreserved: true,
    negativeNextOrdinalBoundaryRequired: true,
  },
  exclusions: [
    "Exact major cycles",
    "All 26.x cycles",
    "Production-existing identities",
    "Candidates represented by another packet",
    "Sanity writes, stable event IDs, page builds, publication, and deployment",
  ],
  expectedArtifacts: [
    "assignment.json",
    "sources.json",
    "raw-evidence-locks.json",
    "candidates.json",
    "conflicts.json",
    "full-sequence-audit.json",
    "not-proposed.json",
    "production-snapshot.json",
    "researched-identities.json",
    "self-review.json",
    "validation.json",
    "packet-locks.json",
    "report.md",
  ],
  safety: {
    researchOnly: true,
    sanityMutationAllowed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationAuthorized: false,
    deploymentPerformed: false,
  },
};
const sourcesDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  attemptedSourceCount: fetchLog.sourceCount,
  capturedSourceCount: sources.length,
  failedCaptureCount: fetchLog.failureCount,
  reusedSourceCount: sources.filter(
    (source) => source.evidence.captureMethod === "verified-local-reuse",
  ).length,
  freshSourceCount: sources.filter(
    (source) => source.evidence.captureMethod !== "verified-local-reuse",
  ).length,
  sources,
  copyrightPolicy: {
    bodyRepublished: false,
    handling:
      "The packet stores internal verification captures and claim-level metadata/locators. It does not republish article bodies. Downstream pages must paraphrase, link, and credit every source.",
  },
};
const rawEvidenceLocks = {
  formatVersion: 1,
  batchId,
  generatedAt,
  sourceCount: rawLocks.length,
  locks: rawLocks,
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
      "Research candidates only. Independent chronology review and explicit integration authorization are still required.",
  },
  summary: {
    proposedCandidateCount: candidateRecords.length,
    notProposedCount: 0,
    byStatus: countBy(candidateRecords, (item) => item.candidateStatus),
    byPlatform: countBy(candidateRecords, (item) => item.platform),
    importantQualification:
      "153 candidates pass the two-lineage selected-evidence gate; all six iPadOS 16.1 observations remain blocked conflicts because campaign and exact-version public numbering cannot be reconciled safely.",
  },
  cohorts: [
    {
      cohortId,
      description:
        "iOS and iPadOS point-release Public Beta appearances for major families 15 through 18.",
      candidateCount: candidateRecords.length,
      sourcePaths: [
        `${packetPath}/assignment.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/full-sequence-audit.json`,
        `${packetPath}/conflicts.json`,
        `${packetPath}/production-snapshot.json`,
      ],
      supersessionRule:
        "A later independently reviewed packet may supersede an identity only by explicitly naming this cohort and preserving its conflicts and evidence locks.",
    },
  ],
  candidates: candidateRecords,
  notProposed: [],
  nextEvidenceWaves: [
    {
      waveId: "resolve-ipados-16-1-public-numbering",
      scope:
        "Resolve six iPadOS 16.1 exact-version public ordinals and Pacific appearance dates without inheriting iPadOS 16 campaign or developer ordinals.",
      artifactPaths: [
        `${packetPath}/conflicts.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/full-sequence-audit.json`,
      ],
      estimatedCandidateCount: 6,
      countStatus: "confirmed",
      requiredNextStep:
        "An independent reviewer must locate two exact platform/version/public-ordinal/date lineages for each identity or reject/restate it.",
    },
  ],
  validationStatus: {
    status: "pending",
    validatedAt: null,
    validator: `${packetPath}/validate-packet.mjs`,
    summaryPath: `${packetPath}/validation.json`,
  },
};
const conflictDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  conflictCount: sourceDateConflicts.length,
  blockedCandidateIds: conflictCandidates.map((item) => item.candidateId),
  conflicts: sourceDateConflicts,
  safety: {
    conflictsResolvedBySilentNormalization: false,
    sanityMutationAllowed: false,
  },
};
const fullSequenceAudit = {
  formatVersion: 1,
  batchId,
  generatedAt,
  cycleCount: cycles.length,
  proposedAppearanceCount: candidateRecords.length,
  readyAppearanceCount: readyCandidates.length,
  conflictedAppearanceCount: conflictCandidates.length,
  cycles,
  noPositiveAuditRowCount: noPositiveRows.length,
  noPositiveAuditReleaseVersionIds: noPositiveRows.map(
    (row) => row.releaseVersionId,
  ),
  explicitNegativeFindings,
  negativeBoundaryRule:
    "No next ordinal is inferred from developer builds, shared payloads, a paired platform, or a later RC. A missing public identity remains not proposed unless exact public-distribution evidence is found.",
};
const notProposedDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  recordCount: notProposedRecords.length,
  noPositiveCoverageRowCount: noPositiveRecords.length,
  skippedOrdinalRecordCount: skippedOrdinalRecords.length,
  records: notProposedRecords,
  qualification:
    "These are reversible research dispositions, not claims that an event was impossible. Routine patch rows lack positive evidence; explicitly skipped identities have stronger negative boundary evidence.",
  safety: {
    sanityMutationAllowed: false,
    publicationEligible: false,
  },
};
const identityDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  identityCount: allObservedAppearances.length,
  identities: allObservedAppearances.map((item) => ({
    candidateId: item.candidateId,
    platform: item.platform,
    version: item.version,
    releaseVersionId: item.releaseVersionId,
    channel: "publicBeta",
    routeAlias: item.routeAlias,
    label: item.label,
    sequence: item.sequence,
    appearanceDate: item.appearanceDate,
  })),
  safety: {queryInputOnly: true, sanityMutationAllowed: false},
};
const selfReview = {
  formatVersion: 1,
  batchId,
  reviewedAt: generatedAt,
  reviewerRole: "researcher-self-review",
  disposition: {
    candidateCount: candidateRecords.length,
    readyForIndependentReviewCount: readyCandidates.length,
    blockedConflictCount: conflictCandidates.length,
    notProposedCount: notProposedRecords.length,
  },
  checks: {
    fullCoverageMatrixScopeReconciled: true,
    rawAndSelectedEvidenceHashed: true,
    readyCandidatesMeetTwoLineageSelectedLocatorGate: true,
    platformAndDeveloperOrdinalInferenceRejected: true,
    timezoneConflictsPreserved: true,
    withdrawalsAndNoEventFindingsPreserved: true,
    productionPublishedNoCdnRechecked: true,
    independentReviewPerformed: false,
  },
  note:
    "This self-review does not substitute for independent chronology review. No independent-review artifact is authored by this researcher.",
};
const report = `# iOS/iPadOS point-release Public Beta chronology, 15–18

Research cutoff: ${researchCutoff}

This research-only packet audits all ${scopedCoverageRows.length} remaining iOS/iPadOS point-release rows in the current coverage matrix from 15.1 through 18.7. It proposes ${candidateRecords.length} observed public-beta identities across ${cycles.length} positive cycles. ${readyCandidates.length} pass the two-independent-lineage selected-evidence gate; ${conflictCandidates.length} iPadOS 16.1 observations are retained as blocked conflicts rather than normalized into false certainty.

## Production reconciliation

The fresh Sanity query used the published perspective with \`useCdn: false\` at ${production.capturedAt}. It observed ${production.productionCounts.totalReleaseEvents} total release events, ${production.productionCounts.scopedReleaseEvents} events under the 75 scoped parents, zero scoped public-beta events, zero route matches, zero full identity matches, and zero missing parents.

## Evidence and sequence coverage

All ${sources.length} selected sources and their matching raw captures succeeded and are frozen with byte counts and SHA-256 hashes. The sequence audit covers all ${cycles.length} positive cycles, explicit ordinal skips, terminal stable boundaries, next-ordinal negatives, local-calendar normalization, withdrawn seeds, and conflicting labels. The separate not-proposed register contains ${notProposedRecords.length} reversible dispositions: ${noPositiveRecords.length} no-positive coverage rows and ${skippedOrdinalRecords.length} platform-specific skipped-ordinal identities.

## Mandatory qualification

iPadOS 16.1 crossed an unusual iPadOS 16 campaign-to-16.1 transition. Retained publishers disagree about whether the first 16.1 payload continued the iPadOS 16 public campaign and about later exact public ordinals. All six observations remain \`needsEvidenceReview\`; none is eligible for integration.

## Safety

This packet performs research only. It creates no Sanity document, stable event ID, release page, publication, or deployment. An independent reviewer must verify the exact platform, public audience, ordinal, Pacific date, source independence, sequence boundary, and conflicts before any integration proposal.
`;

await Promise.all([
  writeJson("assignment.json", assignment),
  writeJson("sources.json", sourcesDocument),
  writeJson("raw-evidence-locks.json", rawEvidenceLocks),
  writeJson("candidates.json", candidateRegister),
  writeJson("conflicts.json", conflictDocument),
  writeJson("full-sequence-audit.json", fullSequenceAudit),
  writeJson("not-proposed.json", notProposedDocument),
  writeJson("researched-identities.json", identityDocument),
  writeJson("self-review.json", selfReview),
  writeFile(path.join(here, "report.md"), report),
  copyFile(
    absolute(`${evidenceRoot}/production-snapshot.json`),
    path.join(here, "production-snapshot.json"),
  ),
]);

console.log(
  json({
    batchId,
    coverageRows: scopedCoverageRows.length,
    candidates: candidateRecords.length,
    readyCandidates: readyCandidates.length,
    conflictedCandidates: conflictCandidates.length,
    cycles: cycles.length,
    notProposed: notProposedRecords.length,
    conflicts: sourceDateConflicts.length,
    sources: sources.length,
    productionCapturedAt: production.capturedAt,
  }),
);
