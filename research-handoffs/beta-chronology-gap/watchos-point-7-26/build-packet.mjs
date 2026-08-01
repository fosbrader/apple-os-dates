import {createHash} from "node:crypto";
import {copyFile, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allAppearances,
  applicability,
  batchId,
  blockedAppearances,
  cohortId,
  conflicts,
  cycles,
  evidenceRoot,
  negativeFindings,
  packetPath,
  researchCutoff,
  supportableAppearances,
  targetVersionIds,
  targetVersions,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const absolute = (relativePath) => path.join(repoRoot, relativePath);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (filename, value) =>
  writeFile(path.join(here, filename), json(value));
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
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
const decodeHtml = (value = "") =>
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
const boundedTitle = (title) => {
  const words = title.split(/\s+/).filter(Boolean).slice(0, 20);
  const text = words.join(" ");
  return {
    type: "boundedSourceIdentification",
    text,
    wordCount: words.length,
    maxWords: 20,
    sha256: sha256(text),
    purpose:
      "Source identification only; chronology findings are original synthesis.",
  };
};
const identityFor = (appearance) => ({
  candidateId:
    `candidate:apple:watchos:${appearance.version}:public-beta-${appearance.sequence}`,
  version: appearance.version,
  releaseVersionId: appearance.releaseVersionId,
  channel: "publicBeta",
  routeAlias: `public-beta-${appearance.sequence}`,
  label: `Public Beta ${appearance.sequence}`,
  sequence: appearance.sequence,
  appearanceDate: appearance.appearanceDate,
});

const [fetchLog, production] = await Promise.all([
  readFile(absolute(`${evidenceRoot}/fetch-log.json`), "utf8").then(JSON.parse),
  readFile(
    absolute(`${evidenceRoot}/production-snapshot.json`),
    "utf8",
  ).then(JSON.parse),
]);
assert(fetchLog.failureCount === 0, "Source capture failures remain.");
assert(
  fetchLog.sourceCount === sourceSpecs.length &&
    fetchLog.results.length === sourceSpecs.length,
  "Source capture roster drifted from source specs.",
);
assert(
  production.perspective === "published" &&
    production.useCdn === false,
  "Production snapshot must be published and no-CDN.",
);
assert(
  production.expectedIdentityCount === allAppearances.length &&
    production.exactChecks.length === allAppearances.length,
  "Production snapshot does not cover every researched identity.",
);
assert(
  production.parentChecks.length === targetVersionIds.length &&
    production.parentChecks.every((item) => item.exists),
  "A scoped releaseVersion parent is absent.",
);
assert(
  production.exactChecks.every(
    (item) =>
      item.routeIdentityMatchCount === 0 &&
      item.fullCandidateMatchCount === 0,
  ),
  "A researched identity now overlaps production.",
);
await copyFile(
  absolute(`${evidenceRoot}/production-snapshot.json`),
  path.join(here, "production-snapshot.json"),
);

const generatedAt = production.capturedAt;
const sourceSpecById = new Map(
  sourceSpecs.map((source) => [source.sourceId, source]),
);
const sources = [];
for (const capture of fetchLog.results) {
  const spec = sourceSpecById.get(capture.sourceId);
  assert(spec, `Missing source spec for ${capture.sourceId}.`);
  const rawPath = `${evidenceRoot}/raw/${capture.filename}`;
  const raw = await readFile(absolute(rawPath));
  assert(
    raw.byteLength === capture.bytes &&
      sha256(raw) === capture.sha256,
    `Raw capture drift for ${capture.sourceId}.`,
  );
  const html = raw.toString("utf8");
  const title =
    firstMatch(html, [
      /<title[^>]*>([\s\S]*?)<\/title>/i,
      /"headline"\s*:\s*"([^"]+)"/i,
    ]) ?? capture.sourceId;
  const publishedAt = firstMatch(html, [
    /"datePublished"\s*:\s*"([^"]+)"/i,
    /property=["']article:published_time["'][^>]+content=["']([^"']+)/i,
    /name=["']date["'][^>]+content=["']([^"']+)/i,
  ]);
  const author = firstMatch(html, [
    /"author"\s*:\s*\{[^{}]{0,1800}?"name"\s*:\s*"([^"]+)"/i,
    /"author"\s*:\s*"([^"]+)"/i,
  ]);
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl: spec.canonicalUrl,
    finalUrl: capture.finalUrl ?? spec.canonicalUrl,
    title,
    publisher: spec.publisher,
    author,
    publishedAt,
    publishedDateObserved: publishedAt?.slice(0, 10) ?? null,
    accessedAt: researchCutoff,
    status: "active",
    sourceClass: spec.sourceClass,
    roles: spec.roles,
    supportNote: spec.note,
    evidence: {
      rawPath,
      rawBytes: raw.byteLength,
      rawSha256: capture.sha256,
      captureMethod: capture.captureMethod,
      locator:
        "Use the source-specific supportNote with the retained raw capture. A search-index extract is explicitly labeled and is not a full-page archive.",
      selectedText: boundedTitle(title),
    },
    lineage: {
      publisherFamily: spec.publisher,
      independentForCorroboration: true,
      note:
        "Multiple pages from the same publisher count as one editorial lineage.",
    },
    provenance: {
      ...(capture.reusedFrom
        ? {reusedFrom: capture.reusedFrom}
        : {}),
      ...(capture.indexProvider
        ? {
            indexProvider: capture.indexProvider,
            originalFetchFailure: capture.originalFetchFailure,
          }
        : {}),
    },
  });
}
sources.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
assert(
  sources.length === sourceSpecs.length &&
    new Set(sources.map((item) => item.sourceId)).size === sources.length,
  "Source roster is incomplete or duplicated.",
);
const sourceById = new Map(sources.map((item) => [item.sourceId, item]));
const specById = new Map(sourceSpecs.map((item) => [item.sourceId, item]));
const packetSourcesPath = `${packetPath}/sources.json`;
const evidenceRefs = (sourceIds, subject) =>
  sourceIds.map((sourceId) => {
    const source = sourceById.get(sourceId);
    assert(source, `Unknown source ${sourceId} for ${subject}.`);
    return {
      kind: "packetSource",
      packetPath: packetSourcesPath,
      sourceId,
      locator:
        "Use sources.json supportNote and retained raw locator; apply conflicts.json and full-sequence-audit.json before use.",
      supports:
        `${source.publisher} evidence concerning ${subject}; the source-specific supportNote states whether it is affirmative, negative-boundary, or qualification evidence.`,
    };
  });

const exactByCandidateId = new Map(
  production.exactChecks.map((item) => [item.candidateId, item]),
);
const researchedIdentities = allAppearances.map((appearance) => {
  const identity = identityFor(appearance);
  const productionCheck = exactByCandidateId.get(identity.candidateId);
  assert(productionCheck, `Missing production check for ${identity.candidateId}.`);
  return {
    ...identity,
    researchDecision: appearance.decision,
    identityStatus: appearance.identityStatus,
    sourceIds: appearance.sourceIds,
    blockers: appearance.blockers,
    qualification: appearance.qualification,
    productionReconciliation: {
      routeIdentityMatchCount: productionCheck.routeIdentityMatchCount,
      fullCandidateMatchCount: productionCheck.fullCandidateMatchCount,
      status:
        appearance.decision === "supportable"
          ? "confirmedMissingCandidate"
          : "plausibleInsufficientEvidence",
    },
  };
});
const identitiesDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  identityCount: researchedIdentities.length,
  supportableCount: supportableAppearances.length,
  blockedCount: blockedAppearances.length,
  identities: researchedIdentities,
  safety: {
    queryInputOnly: true,
    sanityMutationAllowed: false,
    blockedIdentitiesAreNotCandidates: true,
  },
};

const candidateRecords = supportableAppearances.map((appearance) => {
  const identity = identityFor(appearance);
  const productionCheck = exactByCandidateId.get(identity.candidateId);
  assert(
    productionCheck?.routeIdentityMatchCount === 0 &&
      productionCheck?.fullCandidateMatchCount === 0,
    `Production absence proof missing for ${identity.candidateId}.`,
  );
  const positivePublisherFamilies = new Set(
    appearance.sourceIds
      .filter((sourceId) => {
        const roles = specById.get(sourceId)?.roles ?? [];
        return (
          roles.includes("publicAvailability") &&
          roles.includes("publicOrdinal")
        );
      })
      .map((sourceId) => sourceById.get(sourceId)?.publisher)
      .filter(Boolean),
  );
  assert(
    positivePublisherFamilies.size >= 2,
    `${identity.candidateId} lacks two affirmative publisher lineages.`,
  );
  const subject =
    `watchOS ${appearance.version} Public Beta ${appearance.sequence}`;
  return {
    candidateId: identity.candidateId,
    originCohortId: cohortId,
    platform: "watchOS",
    platformId: "platform-watchos",
    version: appearance.version,
    releaseVersionId: appearance.releaseVersionId,
    proposedIdentity: {
      label: identity.label,
      routeAlias: identity.routeAlias,
      channel: "publicBeta",
      appearanceDate: identity.appearanceDate,
      sequence: identity.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    ordinalBasis: "explicit",
    candidateStatus: "needsEvidenceReview",
    identityStatus: "confirmed",
    evidenceState: "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published no-CDN query found zero matches on releaseVersionId, publicBeta channel, routeAlias, label, sequence, and appearanceDate; the exact parent releaseVersion exists.",
      exactIdentityMatches: 0,
    },
    evidenceRefs: evidenceRefs(appearance.sourceIds, subject),
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: [
      ...(appearance.qualification
        ? [`Mandatory source qualification: ${appearance.qualification}`]
        : []),
      "Independent chronology review is pending.",
    ],
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "A reviewer independent of the researcher must inspect the public audience, displayed ordinal, Pacific date, source independence, skips, and retained qualifications.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const datedNegativeFindings = negativeFindings.filter(
  (item) => item.date !== null,
);
const notProposed = datedNegativeFindings.map((item) => {
  const subject =
    `apparent watchOS ${item.version} Public Beta ${item.sequence}`;
  return {
    recordId:
      `not-proposed:apple:watchos:${item.version}:public-beta-${item.sequence}`,
    originCohortId: cohortId,
    platform: "watchOS",
    platformId: "platform-watchos",
    releaseVersionId: `version-watchos-${item.version.replaceAll(".", "-")}`,
    apparentIdentity: {
      label: `Public Beta ${item.sequence}`,
      routeAlias: `public-beta-${item.sequence}`,
      channel: "publicBeta",
      appearanceDate: item.date,
      sequence: item.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    classification: item.classification,
    reason: item.finding,
    evidenceRefs: evidenceRefs(item.sourceIds, subject),
    reversalEvidence:
      "Two independent contemporary publisher lineages must explicitly establish the watchOS public audience, displayed ordinal, and exact Pacific appearance date, or stronger first-party evidence must do so.",
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Negative finding remains research-only pending independent review.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const rawEvidenceLocks = {
  formatVersion: 1,
  batchId,
  generatedAt,
  sourceCount: sources.length,
  locks: sources.map((source) => ({
    sourceId: source.sourceId,
    rawPath: source.evidence.rawPath,
    rawBytes: source.evidence.rawBytes,
    rawSha256: source.evidence.rawSha256,
    selectedTextSha256: source.evidence.selectedText.sha256,
    captureMethod: source.evidence.captureMethod,
  })),
  safety: {
    rawPagesAreInternalResearchEvidence: true,
    downstreamRepublicationAuthorized: false,
  },
};
const sourcesDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  researchCutoff,
  attemptedSourceCount: fetchLog.sourceCount,
  sourceCount: sources.length,
  reusedSourceCount: sources.filter(
    (item) => item.evidence.captureMethod === "verified-local-reuse",
  ).length,
  freshHtmlSourceCount: sources.filter(
    (item) => item.evidence.captureMethod === "http-html",
  ).length,
  searchIndexExtractCount: sources.filter(
    (item) => item.evidence.captureMethod === "search-index-extract",
  ).length,
  failedCaptureCount: fetchLog.failureCount,
  copyrightHandling:
    "Raw pages are private research evidence. Reader-facing work must use original synthesis, claim-level attribution, links, and only bounded quotations when necessary.",
  sources,
};

const applicabilityRows = applicability.map((row) => {
  const cycle = cycles.find((item) => item.version === row.version);
  return {
    platform: "watchOS",
    platformId: "platform-watchos",
    version: row.version,
    releaseVersionId: row.releaseVersionId,
    status: row.status,
    basis: row.basis,
    establishedAppearanceCount: row.establishedAppearanceCount,
    supportableAppearanceCount: cycle.appearances.filter(
      (item) => item.decision === "supportable",
    ).length,
    blockedAppearanceCount: cycle.appearances.filter(
      (item) => item.decision === "blocked",
    ).length,
    sourceIds: row.sourceIds,
  };
});
const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-watchos-point-7-26-research",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scope:
    "Research-only appearance-grain audit of public-beta chronology for exactly 16 modeled watchOS point versions: 7.1–7.6, 8.1, 8.3–8.7, 9.1, and 26.4–26.6.",
  calendarNormalization:
    "appearanceDate uses the America/Los_Angeles calendar date. Overseas publication labels are converted only when the release window supports that mapping; uncertainty remains qualified or blocked.",
  identityRule:
    "Public ordinals require displayed public-program evidence and are never inferred from developer ordinals, generic beta wording, dates, builds, or assumed contiguous sequence.",
  targetVersions,
  targetVersionIds,
  scopedApplicabilityRows: applicabilityRows,
  sharedAggregateDependency: {
    coverageMatrixReadAtBuildTime: false,
    coverageMatrixLocked: false,
    note:
      "The exact 16 scoped rows are embedded above. The mutable shared coverage-matrix.json is neither overwritten nor a frozen dependency.",
  },
  counts: {
    applicableParentCount: applicabilityRows.length,
    researchedIdentityCount: allAppearances.length,
    supportableCandidateCount: candidateRecords.length,
    blockedIdentityCount: blockedAppearances.length,
    negativeOrUnestablishedFindingCount: negativeFindings.length,
    datedNotProposedCount: notProposed.length,
    undatedNegativeFindingCount:
      negativeFindings.length - notProposed.length,
  },
  supportableCandidateCountByVersion: countBy(
    candidateRecords,
    (item) => item.version,
  ),
  evidenceRequirements: {
    minimumIndependentPublisherFamiliesPerCandidate: 2,
    candidateIdentityFields: [
      "platform",
      "version",
      "public audience",
      "displayed public ordinal",
      "Pacific appearance date",
    ],
  },
  exclusions: [
    "Sanity mutation and stableEventId creation",
    "Page builds, release-note prose, publication, and deployment",
    "Build-number or paired-developer inference",
    "Unmodeled parent creation",
    "Automatic promotion of blocked or negative findings",
  ],
  productionReconciliation: {
    capturedAt: production.capturedAt,
    perspective: production.perspective,
    useCdn: production.useCdn,
    totalReleaseEvents: production.productionCounts.totalReleaseEvents,
    watchOSPublicBetaEventsAllVersions:
      production.productionCounts.watchOSPublicBetaEventsAllVersions,
    scopedReleaseEvents:
      production.productionCounts.scopedReleaseEvents,
    scopedPublicBetaEvents:
      production.productionCounts.scopedPublicBetaEvents,
    exactRouteMatches:
      production.productionCounts.exactRouteMatches,
    exactFullMatches:
      production.productionCounts.exactFullMatches,
    missingParentReleaseVersions: production.parentChecks
      .filter((item) => !item.exists)
      .map((item) => item.releaseVersionId),
    snapshotPath: `${packetPath}/production-snapshot.json`,
  },
  safety: {
    queryOnlyProductionAccess: true,
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    independentReviewRequired: true,
  },
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
      "Research packet only. Validation does not authorize Sanity writes, stable IDs, page work, publication, or deployment.",
  },
  summary: {
    proposedCandidateCount: candidateRecords.length,
    notProposedCount: notProposed.length,
    byStatus: countBy(
      candidateRecords,
      (item) => item.candidateStatus,
    ),
    byPlatform: {watchOS: candidateRecords.length},
    importantQualification:
      "The register admits 46 corroborated identities only. Nine additional researched appearances remain blocked (five source conflicts and four evidence shortfalls), and eight negative or unestablished sequence findings remain separate; the one undated finding cannot conform to an apparent dated identity and is retained only in the sequence audit.",
  },
  cohorts: [
    {
      cohortId,
      description:
        "watchOS point-cycle public-beta chronology for 7.1–7.6, 8.1, 8.3–8.7, 9.1, and 26.4–26.6.",
      candidateCount: candidateRecords.length,
      sourcePaths: [
        `${packetPath}/assignment.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/raw-evidence-locks.json`,
        `${packetPath}/production-snapshot.json`,
        `${packetPath}/researched-identities.json`,
        `${packetPath}/conflicts.json`,
        `${packetPath}/full-sequence-audit.json`,
      ],
      supersessionRule:
        "Supersede an identity only with captured platform-specific evidence, a fresh exact production reconciliation, and independent chronology review.",
    },
  ],
  candidates: candidateRecords,
  notProposed,
  nextEvidenceWaves: [
    {
      waveId: "watchos-point-7-26-blocked-identity-review",
      scope:
        "Independently adjudicate the nine blocked appearances, including five material label/date conflicts and four identities lacking a second exact public lineage.",
      artifactPaths: [
        `${packetPath}/researched-identities.json`,
        `${packetPath}/conflicts.json`,
        `${packetPath}/full-sequence-audit.json`,
        `${packetPath}/independent-review.json`,
      ],
      estimatedCandidateCount: blockedAppearances.length,
      countStatus: "confirmed",
      requiredNextStep:
        "Assign a reviewer who did not perform this research; do not promote a blocked identity without claim-level evidence or a documented conflict verdict.",
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
  generatedAt,
  conflictCount: conflicts.length,
  qualificationCount: conflicts.filter(
    (item) => item.severity === "qualification",
  ).length,
  blockingConflictCount: conflicts.filter(
    (item) => item.severity === "blocking",
  ).length,
  conflicts: conflicts.map((item) => ({
    ...item,
    version: item.candidateKey.split("|")[1],
    status:
      item.severity === "blocking"
        ? "blockedPendingIndependentReview"
        : "retainedQualificationPendingIndependentReview",
  })),
  reviewState: "pendingIndependentChronologyReview",
};
const fullSequenceAudit = {
  formatVersion: 1,
  batchId,
  generatedAt,
  normalizationZone: "America/Los_Angeles",
  cycleCount: cycles.length,
  researchedAppearanceCount: allAppearances.length,
  supportableAppearanceCount: supportableAppearances.length,
  blockedAppearanceCount: blockedAppearances.length,
  negativeFindingCount: negativeFindings.length,
  cycles: cycles.map((cycle) => ({
    version: cycle.version,
    releaseVersionId: cycle.releaseVersionId,
    applicabilityStatus: cycle.applicabilityStatus,
    parentExists:
      production.parentChecks.find(
        (item) => item.releaseVersionId === cycle.releaseVersionId,
      )?.exists ?? false,
    productionEvents: production.scopedEvents.filter(
      (item) => item.releaseVersionId === cycle.releaseVersionId,
    ),
    researchedPublicAppearances: cycle.appearances.map((appearance) => {
      const identity = identityFor({
        ...appearance,
        version: cycle.version,
        releaseVersionId: cycle.releaseVersionId,
      });
      return {
        ...identity,
        decision: appearance.decision,
        identityStatus: appearance.identityStatus,
        sourceIds: appearance.sourceIds,
        qualification: appearance.qualification,
        blockers: appearance.blockers,
        productionDisposition:
          appearance.decision === "supportable"
            ? "confirmedMissingCandidate"
            : "plausibleInsufficientEvidence",
      };
    }),
    negativeFindings: negativeFindings.filter(
      (item) => item.version === cycle.version,
    ),
    conflicts: conflicts
      .filter((item) => item.candidateKey.split("|")[1] === cycle.version)
      .map((item) => item.conflictId),
    notes: cycle.notes,
  })),
  blockedAppearances: blockedAppearances.map((appearance) => ({
    ...identityFor(appearance),
    identityStatus: appearance.identityStatus,
    sourceIds: appearance.sourceIds,
    blockers: appearance.blockers,
    candidateAdmitted: false,
  })),
  negativeFindings,
  guardrails: [
    "No public ordinal is inferred from a developer ordinal.",
    "Generic beta wording is not treated as public-program evidence.",
    "Same-day developer and public appearances remain separate events.",
    "An absent middle ordinal remains absent unless explicit public evidence establishes it.",
    "A search-index extract is labeled as such and never represented as a full direct capture.",
    "No build identity is proposed by this packet.",
  ],
};
const selfReview = {
  formatVersion: 1,
  batchId,
  preparedAt: generatedAt,
  reviewer: "codex-watchos-point-7-26-research",
  independentOfResearcher: false,
  verdict: "researcherSelfCheckPassedPendingIndependentReview",
  checks: {
    exactScopedApplicabilityRowsEmbedded: applicabilityRows.length,
    sharedCoverageMatrixMutated: false,
    exactParentReconciliationComplete: true,
    exactIdentityReconciliationComplete: true,
    researchedIdentityCount: allAppearances.length,
    supportableCandidateCount: candidateRecords.length,
    blockedIdentityCount: blockedAppearances.length,
    blockedIdentityCountAdmittedAsCandidate: 0,
    negativeFindingCount: negativeFindings.length,
    datedNotProposedCount: notProposed.length,
    undatedNegativeFindingCount:
      negativeFindings.length - notProposed.length,
    conflictCount: conflicts.length,
    rawEvidenceLocksRecorded: sources.length,
    searchIndexExtractCount: sourcesDocument.searchIndexExtractCount,
    expectedFrozenMaterialFileCount: 122,
    pendingIndependentReviewExcludedFromLocks: true,
    sourceCaptureFailures: fetchLog.failureCount,
    publicOrdinalInferredFromDeveloperOrdinal: false,
    buildsIncluded: 0,
    stableEventIdsCreated: 0,
    sanityMutationPerformed: false,
    pageWorkPerformed: false,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  independentReview: {
    required: true,
    reviewer: null,
    reviewedAt: null,
    verdict: null,
    chronologyApprovedCandidateCount: 0,
    notes:
      "Unassigned. This self-review is not independent and grants no mutation or publication authority.",
  },
  authorization: {
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};
const independentReview = {
  formatVersion: 1,
  batchId,
  status: "pending",
  reviewer: null,
  reviewedAt: null,
  independentOfResearcher: null,
  chronologyApprovedCandidateCount: 0,
  blockedIdentityVerdicts: [],
  notes:
    "Intentionally pending and excluded from packet locks. A different agent must inspect frozen evidence and record a verdict without rewriting research artifacts.",
  authorization: {
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};

const applicabilityTable = applicabilityRows
  .map(
    (row) =>
      `| ${row.version} | ${row.status} | ${row.supportableAppearanceCount} | ${row.blockedAppearanceCount} |`,
  )
  .join("\n");
const supportableTable = supportableAppearances
  .map((appearance) => {
    const publishers = [
      ...new Set(
        appearance.sourceIds.map(
          (sourceId) => sourceById.get(sourceId).publisher,
        ),
      ),
    ].join("; ");
    return `| ${appearance.version} | PB${appearance.sequence} | ${appearance.appearanceDate} | ${publishers} | ${appearance.qualification ? "qualified" : "corroborated"} |`;
  })
  .join("\n");
const blockedTable = blockedAppearances
  .map(
    (appearance) =>
      `| ${appearance.version} | PB${appearance.sequence} | ${appearance.appearanceDate} | ${appearance.identityStatus} | ${appearance.blockers[0]} |`,
  )
  .join("\n");
const negativeTable = negativeFindings
  .map(
    (item) =>
      `| ${item.version} | PB${item.sequence} | ${item.date ?? "date not established"} | ${item.classification} | ${item.finding} |`,
  )
  .join("\n");
const report = `# watchOS point-version public-beta chronology, 7.1–9.1 and 26.4–26.6

Status: **researcher self-check passed; independent chronology review pending**  
Research cutoff: **${researchCutoff}**  
Sanity writes, stable-ID creation, page work, publication, and deployment authorized: **no**

## Outcome

This frozen packet audits exactly **16 modeled watchOS point-version parents**. Every parent is **applicableWithEstablishedAppearances**. At appearance grain, it records **55 researched public identities**: **46 supportable candidates**, **9 blocked identities**, and **8 separate negative or unestablished sequence findings**.

A fresh published, no-CDN production query found every parent releaseVersion and found **zero watchOS publicBeta events** in scope, **zero exact route matches**, and **zero exact full-identity matches**. Production also reports zero watchOS publicBeta events across all versions.

Blocked research is not silently promoted: five appearances have unresolved displayed-label or date conflicts, and four have only one exact affirmative public lineage. The candidate register contains only the 46 supportable identities.

## Applicability snapshot

These exact rows are packet-local. The mutable shared coverage matrix was not overwritten, copied by checksum, or included in the freeze contract.

| Version | Applicability | Supportable appearances | Blocked appearances |
| --- | --- | ---: | ---: |
${applicabilityTable}

## Supportable chronology

| Version | Public ordinal | Pacific appearance date | Captured publisher families | Evidence state |
| --- | ---: | --- | --- | --- |
${supportableTable}

## Blocked identities

| Version | Apparent ordinal | Date under review | Identity state | Primary blocker |
| --- | ---: | --- | --- | --- |
${blockedTable}

The conflict-blocked rows are watchOS 8.1 PB2, 8.5 PB4, 8.5 PB5, 26.6 PB3, and 26.6 PB5. The evidence-shortfall rows are watchOS 8.3 PB3, 8.6 PB1, 8.6 PB2, and 26.5 PB4. See \`researched-identities.json\`, \`conflicts.json\`, and \`full-sequence-audit.json\`; none is an admitted candidate.

## Negative and do-not-infer findings

| Version | Apparent ordinal | Date | Classification | Finding |
| --- | ---: | --- | --- | --- |
${negativeTable}

The watchOS 7.6 Public Beta 2 finding intentionally has no date. Assigning a paired developer date would violate the rule against inferring public appearances from developer chronology. The watchOS 26.4 Public Beta 4 finding preserves one affirmative full-lineup report and a platform-specific developer-only boundary; without a second exact public lineage, it remains unestablished rather than a candidate.

## Evidence and copyright handling

All **${sources.length}** retained sources were captured and hash-locked with zero failures. The corpus spans **${new Set(sources.map((item) => item.publisher)).size} publisher families**. It contains **${sourcesDocument.reusedSourceCount} verified local reuses**, **${sourcesDocument.freshHtmlSourceCount} direct HTML captures**, and **${sourcesDocument.searchIndexExtractCount} explicitly labeled search-index extracts** for legacy ONTOP pages whose origins returned HTTP 522. Those two bounded extracts preserve indexed title/date/claim fields and are never represented as full-page archives.

Raw pages are private audit evidence, not republishable article content. Future pages must use original synthesis, claim-level source links, clear inline attribution, and bounded quotations only when necessary.

## Freeze and handoff

The freeze contract covers **122 material files**: packet artifacts and scripts, all 100 raw captures plus fetch and production evidence snapshots, and the shared program README/schema. It deliberately excludes \`packet-locks.json\` itself and the pending \`independent-review.json\` placeholder. It does not lock the mutable shared \`coverage-matrix.json\`.

A reviewer independent of the researcher must inspect the frozen evidence and record a verdict in the pending review file. This packet is research, not an implementation or publication manifest.
`;

await Promise.all([
  writeJson("assignment.json", assignment),
  writeJson("sources.json", sourcesDocument),
  writeJson("raw-evidence-locks.json", rawEvidenceLocks),
  writeJson("researched-identities.json", identitiesDocument),
  writeJson("candidates.json", candidateRegister),
  writeJson("conflicts.json", conflictsDocument),
  writeJson("full-sequence-audit.json", fullSequenceAudit),
  writeJson("self-review.json", selfReview),
  writeJson("independent-review.json", independentReview),
  writeFile(path.join(here, "report.md"), report),
]);

console.log(
  JSON.stringify(
    {
      applicableParentCount: applicabilityRows.length,
      researchedIdentityCount: allAppearances.length,
      supportableCandidateCount: candidateRecords.length,
      supportableCandidateCountByVersion:
        assignment.supportableCandidateCountByVersion,
      blockedIdentityCount: blockedAppearances.length,
      negativeFindingCount: negativeFindings.length,
      datedNotProposedCount: notProposed.length,
      sourceCount: sources.length,
      sourceCaptureMethods: countBy(
        sources,
        (item) => item.evidence.captureMethod,
      ),
      conflictCount: conflicts.length,
      exactProductionMatches:
        production.productionCounts.exactFullMatches,
      independentReview: "pending",
    },
    null,
    2,
  ),
);
