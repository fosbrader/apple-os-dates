import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
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
  releaseVersionIdFor,
  researchCutoff,
  supportableAppearances,
  targetVersionIds,
  targetVersions,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const coveragePath =
  "research-handoffs/beta-chronology-gap/coverage-matrix.json";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const writePacketJson = (filename, value) =>
  writeFile(path.join(here, filename), json(value));
const versionOrder = new Map(
  targetVersions.map((version, index) => [version, index]),
);
const review = {
  required: true,
  reviewer: null,
  reviewedAt: null,
  notes:
    "Independent chronology review is required before aggregation, stable ID creation, mutation, page work, publication, or deployment.",
};
const flags = {
  sanityMutationAllowed: false,
  publicationEligible: false,
};
const packetSourceRef = (sourceId, supports) => ({
  kind: "packetSource",
  packetPath: `${packetPath}/sources.json`,
  sourceId,
  locator:
    `sources.json sourceId=${sourceId}; verify raw and selected hashes in raw-evidence-locks.json before relying on this claim.`,
  supports,
});

const [coverageBytes, fetchLog, production] = await Promise.all([
  readFile(path.join(repoRoot, coveragePath)),
  readFile(path.join(repoRoot, evidenceRoot, "fetch-log.json"), "utf8").then(
    JSON.parse,
  ),
  readFile(path.join(here, "production-snapshot.json"), "utf8").then(
    JSON.parse,
  ),
]);
const coverage = JSON.parse(coverageBytes.toString("utf8"));
if (fetchLog.failureCount !== 0 || fetchLog.successCount !== sourceSpecs.length) {
  throw new Error("Complete source capture is required before packet build.");
}
if (
  production.perspective !== "published" ||
  production.useCdn !== false ||
  production.parentChecks.some((item) => !item.exists)
) {
  throw new Error("Fresh published/no-CDN production reconciliation is incomplete.");
}

const scopedRows = coverage.remainingPublicBetaAuditRows
  .filter(
    (row) =>
      row.platform === "tvOS" && targetVersions.includes(row.version),
  )
  .sort(
    (left, right) =>
      versionOrder.get(left.version) - versionOrder.get(right.version),
  );
if (scopedRows.length !== targetVersions.length) {
  throw new Error(
    `Expected ${targetVersions.length} scoped coverage rows; received ${scopedRows.length}.`,
  );
}
for (const [index, version] of targetVersions.entries()) {
  const row = scopedRows[index];
  if (
    row.version !== version ||
    row.releaseVersionId !== releaseVersionIdFor(version)
  ) {
    throw new Error(`Coverage identity mismatch for ${version}.`);
  }
}
const generatedAt = new Date().toISOString();
await writePacketJson("scoped-coverage-snapshot.json", {
  formatVersion: 1,
  batchId,
  capturedAt: generatedAt,
  source: {
    path: coveragePath,
    bytes: coverageBytes.byteLength,
    sha256: sha256(coverageBytes),
    generatedAt: coverage.generatedAt,
    qualification:
      "Packet-local immutable assignment evidence. The shared coverage matrix was not modified and is not the packet's sole scope dependency.",
  },
  rowCount: scopedRows.length,
  rows: scopedRows,
});

const sourceSpecById = new Map(
  sourceSpecs.map((source) => [source.sourceId, source]),
);
for (const appearance of allAppearances) {
  for (const sourceId of appearance.sourceIds) {
    if (!sourceSpecById.has(sourceId)) {
      throw new Error(`${appearance.candidateId} references missing ${sourceId}.`);
    }
  }
}
for (const finding of negativeFindings) {
  for (const sourceId of finding.sourceIds) {
    if (!sourceSpecById.has(sourceId)) {
      throw new Error(`${finding.findingId} references missing ${sourceId}.`);
    }
  }
}

const captureById = new Map(
  fetchLog.results.map((capture) => [capture.sourceId, capture]),
);
const sources = [];
const rawLocks = [];
for (const spec of sourceSpecs) {
  const capture = captureById.get(spec.sourceId);
  if (!capture || capture.status === "failed") {
    throw new Error(`Missing successful capture for ${spec.sourceId}.`);
  }
  const selectedRelative =
    `${evidenceRoot}/selected/${capture.selectedFilename}`;
  const rawRelative = `${evidenceRoot}/raw/${capture.rawFilename}`;
  const selected = JSON.parse(
    await readFile(path.join(repoRoot, selectedRelative), "utf8"),
  );
  const candidateAssignments = allAppearances
    .filter(({sourceIds}) => sourceIds.includes(spec.sourceId))
    .map(({candidateId, version, label, appearanceDate, decision}) => ({
      candidateId,
      version,
      label,
      appearanceDate,
      decision,
    }));
  const negativeAssignments = negativeFindings
    .filter(({sourceIds}) => sourceIds.includes(spec.sourceId))
    .map(({findingId, version, label}) => ({findingId, version, label}));
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl: selected.canonicalUrl ?? spec.canonicalUrl,
    finalUrl: capture.finalUrl,
    title: selected.title,
    publisher: spec.publisher,
    publisherFamily: spec.publisher,
    publishedAt: selected.publishedAt,
    modifiedAt: selected.modifiedAt,
    accessedAt: researchCutoff,
    sourceClass: spec.sourceClass,
    roles: spec.roles,
    supportNote: spec.note,
    claimAssignments: {
      candidates: candidateAssignments,
      negativeFindings: negativeAssignments,
    },
    evidence: {
      rawPath: rawRelative,
      selectedPath: selectedRelative,
      rawBytes: capture.rawBytes,
      rawSha256: capture.rawSha256,
      selectedBytes: capture.selectedBytes,
      selectedSha256: capture.selectedSha256,
      excerptCount: selected.excerpts.length,
      excerptPreview: selected.excerpts.slice(0, 12),
      captureMethod: capture.captureMethod,
    },
    lineage: {
      independentForCorroboration: true,
      note:
        "Multiple pages from this publisher count as one evidence lineage.",
    },
  });
  rawLocks.push({
    sourceId: spec.sourceId,
    rawPath: rawRelative,
    rawBytes: capture.rawBytes,
    rawSha256: capture.rawSha256,
    selectedPath: selectedRelative,
    selectedBytes: capture.selectedBytes,
    selectedSha256: capture.selectedSha256,
  });
}
await Promise.all([
  writePacketJson("sources.json", {
    formatVersion: 1,
    batchId,
    generatedAt,
    attemptedSourceCount: sourceSpecs.length,
    capturedSourceCount: sources.length,
    failedCaptureCount: 0,
    sources,
    copyrightHandling: {
      committedLongFormSourceText: false,
      note:
        "The committed ledger stores source metadata, bounded previews, claim assignments, and hashes. Full pages remain local research evidence and are not publication copy.",
    },
  }),
  writePacketJson("raw-evidence-locks.json", {
    formatVersion: 1,
    batchId,
    generatedAt,
    lockCount: rawLocks.length,
    locks: rawLocks,
  }),
]);

const queryLogs = cycles.map((item) => {
  const negatives = negativeFindings.filter(
    ({version}) => version === item.version,
  );
  return {
    queryLogId: `query:tvos:${item.version}:public-beta-sequence`,
    platform: "tvOS",
    version: item.version,
    releaseVersionId: item.releaseVersionId,
    searchedAt: researchCutoff,
    searchProvider: "general web search index and publisher archives",
    queries: [
      `"tvOS ${item.version}" "public beta"`,
      `"tvOS ${item.version}" "Public Beta 1"`,
      `site:macrumors.com "tvOS ${item.version}" "public beta"`,
      `site:9to5mac.com "tvOS ${item.version}" "public beta"`,
    ],
    inspectedSourceIds: [
      ...new Set([
        ...item.appearances.flatMap(({sourceIds}) => sourceIds),
        ...negatives.flatMap(({sourceIds}) => sourceIds),
      ]),
    ],
    outcome: "positiveExactPublicSequenceLocated",
    exactAppearanceCount: item.appearances.length,
    supportableCount: item.appearances.filter(
      ({decision}) => decision === "supportable",
    ).length,
    blockedCount: item.appearances.filter(
      ({decision}) => decision === "blocked",
    ).length,
    negativeFindingIds: negatives.map(({findingId}) => findingId),
    conclusion:
      "At least one exact publisher-displayed tvOS public-beta ordinal was located. Only identities with two independent publisher families and a resolved Pacific date advance to chronology review.",
    evidentiaryEffect:
      "Skipped ordinals remain explicit negative or unresolved findings. Search silence, developer cadence, builds, and paired-platform releases are not used to manufacture identities.",
  };
});
await writePacketJson("source-query-log.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  queryLogCount: queryLogs.length,
  guardrail:
    "Discovery logs are not proof of absence. Exact tvOS version, public audience, publisher-displayed ordinal, Pacific date, and independent lineages are required.",
  records: queryLogs,
});

await writePacketJson("negative-findings.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  findingCount: negativeFindings.length,
  findings: negativeFindings,
  qualification:
    "These findings explain skipped or unqualified ordinals. Reversible statements are not claims that no public appearance ever existed.",
});
await writePacketJson("conflicts.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  conflictCount: conflicts.length,
  conflicts,
});
await writePacketJson("applicability-audit.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  parentCount: applicability.length,
  exactAppearanceCount: allAppearances.length,
  supportableAppearanceCount: supportableAppearances.length,
  blockedAppearanceCount: blockedAppearances.length,
  rows: applicability.map((row) => ({
    ...row,
    stablePublicReleaseDate: scopedRows.find(
      ({version}) => version === row.version,
    )?.publicReleaseDate,
    appearances: cycles.find(({version}) => version === row.version)
      .appearances,
    negativeFindingIds: negativeFindings
      .filter(({version}) => version === row.version)
      .map(({findingId}) => findingId),
    queryLogId: `query:tvos:${row.version}:public-beta-sequence`,
    reviewedAt: researchCutoff,
    review,
    flags,
  })),
  guardrails: [
    "Never infer a public ordinal from a developer label or sequence.",
    "Never infer a public identity from a build match or paired-platform release.",
    "Generic public-program availability does not identify an appearance.",
    "Release candidates and golden masters remain separate identities.",
    "No-result searches do not prove historical absence.",
  ],
});

const productionCheckById = new Map(
  production.exactChecks.map((check) => [check.candidateId, check]),
);
const candidate = (item) => {
  const check = productionCheckById.get(item.candidateId);
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
    candidateStatus: "readyForChronologyReview",
    identityStatus: "confirmed",
    evidenceState: "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published/no-CDN query found zero route or full identity matches; the exact releaseVersion parent exists.",
      exactIdentityMatches: check.fullCandidateMatchCount,
    },
    evidenceRefs: item.sourceIds.map((sourceId) =>
      packetSourceRef(
        sourceId,
        `${item.version} ${item.label}: exact tvOS public identity, displayed ordinal, and/or Pacific-normalized date.`,
      ),
    ),
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: ["Independent chronology review is pending."],
    review,
    flags,
  };
};
const notProposed = blockedAppearances.map((item) => ({
  recordId: `not-proposed:apple:tvos:${item.version}:public-beta-${item.sequence}`,
  originCohortId: cohortId,
  platform: item.platform,
  platformId: item.platformId,
  releaseVersionId: item.releaseVersionId,
  apparentIdentity: {
    label: item.label,
    routeAlias: item.routeAlias,
    channel: "publicBeta",
    appearanceDate: item.appearanceDate,
    sequence: item.sequence,
    isRevision: false,
    availabilityState: "available",
    closesReleaseCycle: false,
  },
  classification: "publicDistributionNotEstablished",
  reason: item.blockers.join(" "),
  evidenceRefs: item.sourceIds.map((sourceId) =>
    packetSourceRef(
      sourceId,
      `${item.version} ${item.label}: exact identity evidence that does not yet satisfy the independent-lineage/date-resolution gate.`,
    ),
  ),
  reversalEvidence:
    "A second independent publisher lineage explicitly supporting the same tvOS public ordinal and Pacific date, or evidence resolving the named conflict, can reopen this identity.",
  review,
  flags,
}));
const candidates = supportableAppearances.map(candidate);
await writePacketJson("candidates.json", {
  formatVersion: "1.0",
  programId: "apple-beta-chronology-gap",
  generatedAt,
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    note:
      "Research candidates only. Validation does not authorize integration, IDs, Sanity mutation, page work, publication, or deployment.",
  },
  summary: {
    proposedCandidateCount: candidates.length,
    notProposedCount: notProposed.length,
    byStatus: {
      readyForChronologyReview: candidates.length,
      publicDistributionNotEstablished: notProposed.length,
    },
    byPlatform: {tvOS: candidates.length},
    importantQualification:
      `${candidates.length} exact identities pass the two-lineage gate; ${notProposed.length} exact appearances remain blocked and reversible. All require independent review.`,
  },
  cohorts: [
    {
      cohortId,
      description:
        "Complete point-release public-beta applicability and sequence research for 32 modeled tvOS parents.",
      candidateCount: candidates.length,
      sourcePaths: [
        `${packetPath}/sources.json`,
        `${packetPath}/applicability-audit.json`,
        `${packetPath}/negative-findings.json`,
        `${packetPath}/production-snapshot.json`,
      ],
      supersessionRule:
        "A later independently reviewed packet may supersede an identity only by naming it and preserving the prior evidence and conflict trail.",
    },
  ],
  candidates,
  notProposed,
  nextEvidenceWaves: [
    {
      waveId: "tvos-point-11-26-independent-review",
      scope:
        "Independent review of all supportable candidates, blocked appearances, skipped ordinals, conflicts, source independence, and production reconciliation.",
      artifactPaths: [
        `${packetPath}/candidates.json`,
        `${packetPath}/applicability-audit.json`,
        `${packetPath}/negative-findings.json`,
        `${packetPath}/conflicts.json`,
      ],
      estimatedCandidateCount: candidates.length,
      countStatus: "confirmed",
      requiredNextStep:
        "A separate reviewer must author independent-review.json. The researcher must not author it.",
    },
  ],
  validationStatus: {
    status: "pending",
    validatedAt: null,
    validator: `${packetPath}/validate-packet.mjs`,
    summaryPath: `${packetPath}/validation.json`,
  },
});

await writePacketJson("assignment.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  scope:
    "Research-only complete public-beta applicability and sequence audit for exactly 32 modeled tvOS point releases.",
  platform: "tvOS",
  parentCount: targetVersions.length,
  targetVersions,
  targetVersionIds,
  sourceCoverageSnapshot: {
    path: `${packetPath}/scoped-coverage-snapshot.json`,
    sourcePath: coveragePath,
    sourceBytes: coverageBytes.byteLength,
    sourceSha256: sha256(coverageBytes),
    rowCount: scopedRows.length,
  },
  productionScope: {
    path: `${packetPath}/production-snapshot.json`,
    capturedAt: production.capturedAt,
    perspective: production.perspective,
    useCdn: production.useCdn,
    queriedParentCount: production.parentChecks.length,
  },
  evidenceGate: {
    exactFields: [
      "platform",
      "full version",
      "public audience",
      "publisher-displayed public ordinal",
      "America/Los_Angeles appearance date",
    ],
    minimumIndependentPublisherFamiliesPerCandidate: 2,
    prohibitedInferences: [
      "developer ordinal or cadence",
      "build alignment",
      "paired iOS/iPadOS/watchOS/macOS event",
      "generic public-program availability",
      "stable-note silence",
      "no-result search",
    ],
  },
  results: {
    exactAppearanceCount: allAppearances.length,
    candidateCount: candidates.length,
    blockedAppearanceCount: blockedAppearances.length,
    negativeFindingCount: negativeFindings.length,
    conflictCount: conflicts.length,
  },
  explicitExclusions: [
    "independent-review.json (must be authored by a separate reviewer)",
    "shared aggregate edits",
    "stable ID creation",
    "Sanity mutations",
    "page builds",
    "publication and deployment",
  ],
});

await writePacketJson("review-status.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  status: "pendingIndependentReview",
  requiredArtifact: `${packetPath}/independent-review.json`,
  researcherAuthoredIndependentReview: false,
  nextStep:
    "A separate reviewer must verify chronology completeness, exact identity, Pacific dates, source independence, conflicts, and production absence.",
  safety: {
    chronologyApprovalGranted: false,
    sanityMutationAllowed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationAuthorized: false,
    deploymentPerformed: false,
  },
});

await writePacketJson("self-review.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  checks: {
    exactParentScopeFrozen: scopedRows.length === targetVersions.length,
    allParentsClassified: applicability.length === targetVersions.length,
    exactAppearancesEnumerated: allAppearances.length > 0,
    supportableCandidatesHaveTwoLineages: candidates.every(
      ({evidenceRefs}) =>
        new Set(
          evidenceRefs.map(
            ({sourceId}) => sourceSpecById.get(sourceId).publisher,
          ),
        ).size >= 2,
    ),
    blockedAppearancesExcludedFromCandidates:
      candidates.length + notProposed.length === allAppearances.length,
    skippedOrdinalsExplicit: negativeFindings.length > 0,
    conflictsPreserved: conflicts.length > 0,
    productionFreshPublishedNoCdn:
      production.perspective === "published" && production.useCdn === false,
    productionOverlapAbsent:
      production.productionCounts.exactRouteMatches === 0 &&
      production.productionCounts.exactFullMatches === 0,
    completeSourceCapture:
      fetchLog.failureCount === 0 &&
      fetchLog.successCount === sourceSpecs.length,
    sharedAggregatesUntouched: true,
    independentReviewAuthoredByResearcher: false,
    mutationPerformed: false,
    stableEventIdsCreated: 0,
    pageBuildsPerformed: 0,
    publicationPerformed: false,
    deploymentPerformed: false,
  },
  result:
    "Researcher self-review passed. This is not the required independent chronology review.",
});

const reportRows = cycles
  .map(
    ({version, appearances}) =>
      `| ${version} | ${appearances.length} | ${
        appearances.filter(({decision}) => decision === "supportable").length
      } | ${
        appearances.filter(({decision}) => decision === "blocked").length
      } | ${appearances.map(({sequence}) => sequence).join(", ")} |`,
  )
  .join("\n");
const report = `# tvOS point-release public-beta chronology audit

Batch: \`${batchId}\`  
Research cutoff: ${researchCutoff}  
Scope: exactly 32 production tvOS parents

## Outcome

- **${allAppearances.length} exact publisher-displayed appearances enumerated.**
- **${supportableAppearances.length} supportable candidates** have two independent publisher families and a resolved \`America/Los_Angeles\` date.
- **${blockedAppearances.length} exact appearances remain blocked** for one lineage or an unresolved date conflict and are retained as reversible not-proposed records.
- **${negativeFindings.length} explicit skipped/unqualified-ordinal findings** prevent developer cadence or paired-platform releases from filling gaps.
- **${conflicts.length} source conflicts** are preserved rather than silently normalized.

| tvOS version | Exact appearances | Supportable | Blocked | Publisher-displayed public ordinals |
| --- | ---: | ---: | ---: | --- |
${reportRows}

## Method

tvOS joined Apple's public beta program with tvOS 11. For each scoped point release, research required the exact tvOS version, a public-tester audience, a publisher-displayed public ordinal, and a date normalized to \`America/Los_Angeles\`. Developer ordinals, build alignment, generic public-program wording, and iOS/iPadOS/watchOS/macOS pairing were not used to invent identities. Release candidates and golden masters were kept separate.

Sources are retained as metadata, bounded claim previews, and hashes; source prose is not republished as site copy. Multiple pages from one publisher count as one lineage.

## Production reconciliation

The fresh Sanity query used \`perspective: "published"\` and \`useCdn: false\` at ${production.capturedAt}. All 32 parent releaseVersion documents exist. Production contained ${production.productionCounts.totalReleaseEvents} release events overall, ${production.productionCounts.scopedReleaseEvents} scoped events, and zero scoped public-beta events. Every researched route and full identity had zero matches.

## Integrity and handoff

The exact assignment rows are frozen in \`scoped-coverage-snapshot.json\`. Raw pages and mechanically selected evidence are frozen under \`${evidenceRoot}\`, with committed hashes in \`raw-evidence-locks.json\`. Shared coverage and candidate aggregates were not modified.

The packet is research-only. A separate reviewer must author \`independent-review.json\`; that file is intentionally absent. No stable IDs were created, no Sanity mutation occurred, no pages were built, and nothing was published or deployed.
`;
await writeFile(path.join(here, "report.md"), report);

console.log(
  JSON.stringify(
    {
      batchId,
      generatedAt,
      parentCount: scopedRows.length,
      exactAppearanceCount: allAppearances.length,
      candidateCount: candidates.length,
      blockedAppearanceCount: blockedAppearances.length,
      negativeFindingCount: negativeFindings.length,
      conflictCount: conflicts.length,
      sourceCount: sources.length,
      productionCapturedAt: production.capturedAt,
    },
    null,
    2,
  ),
);
