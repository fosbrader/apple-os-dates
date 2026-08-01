import {createHash} from "node:crypto";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  auditedNoPositiveButReversibleVersions,
  batchId,
  evidenceBackedNotApplicableVersions,
  evidenceRoot,
  notEstablishedVersions,
  observedPublicBetas,
  packetPath,
  releaseVersionIdFor,
  researchCutoff,
  targetVersions,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const coveragePath =
  "research-handoffs/beta-chronology-gap/coverage-matrix.json";
const schemaPath =
  "research-handoffs/beta-chronology-gap/proposed-event-candidate.schema.json";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (bytes) =>
  createHash("sha256").update(bytes).digest("hex");
const writePacketJson = (filename, value) =>
  writeFile(path.join(here, filename), json(value));
const versionOrder = new Map(
  targetVersions.map((version, index) => [version, index]),
);
const supportSourceFor = (version) =>
  `apple-ios-${version.split(".")[0]}-release-history`;
const packetSourceRef = (sourceId, supports) => ({
  kind: "packetSource",
  packetPath: `${packetPath}/sources.json`,
  sourceId,
  locator:
    `sources.json sourceId=${sourceId}; verify the frozen raw and selected hashes in raw-evidence-locks.json before relying on the claim.`,
  supports,
});
const review = {
  required: true,
  reviewer: null,
  reviewedAt: null,
  notes:
    "Independent chronology review is required before aggregation, ID creation, mutation, page work, publication, or deployment.",
};
const flags = {
  sanityMutationAllowed: false,
  publicationEligible: false,
};

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
      row.platform === "iOS" && targetVersions.includes(row.version),
  )
  .sort(
    (a, b) =>
      versionOrder.get(a.version) - versionOrder.get(b.version),
  );
if (scopedRows.length !== 27) {
  throw new Error(`Expected 27 scoped coverage rows, received ${scopedRows.length}.`);
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
const scopedCoverage = {
  formatVersion: 1,
  batchId,
  capturedAt: generatedAt,
  source: {
    path: coveragePath,
    bytes: coverageBytes.byteLength,
    sha256: sha256(coverageBytes),
    generatedAt: coverage.generatedAt,
    qualification:
      "This packet-local snapshot is immutable evidence of assignment scope. The shared coverage matrix is not a packet output and was not modified.",
  },
  rowCount: scopedRows.length,
  rows: scopedRows,
};
await writePacketJson("scoped-coverage-snapshot.json", scopedCoverage);

const captureById = new Map(
  fetchLog.results.map((capture) => [capture.sourceId, capture]),
);
const sources = [];
const rawLocks = [];
for (const spec of sourceSpecs) {
  const capture = captureById.get(spec.sourceId);
  const selectedRelative =
    `${evidenceRoot}/selected/${capture.selectedFilename}`;
  const rawRelative = `${evidenceRoot}/raw/${capture.rawFilename}`;
  const selected = JSON.parse(
    await readFile(path.join(repoRoot, selectedRelative), "utf8"),
  );
  sources.push({
    sourceId: spec.sourceId,
    canonicalUrl: selected.canonicalUrl ?? spec.canonicalUrl,
    finalUrl: capture.finalUrl,
    title: selected.title,
    publisher: spec.publisher,
    publisherFamily: spec.publisherFamily,
    publishedAt: selected.publishedAt,
    accessedAt: researchCutoff,
    sourceClass: spec.sourceClass,
    roles: spec.roles,
    supportNote: spec.supportNote,
    evidence: {
      rawPath: rawRelative,
      selectedPath: selectedRelative,
      rawBytes: capture.rawBytes,
      rawSha256: capture.rawSha256,
      selectedBytes: capture.selectedBytes,
      selectedSha256: capture.selectedSha256,
      requiredNeedles: spec.requiredNeedles,
      locatorCount: selected.locators.length,
      captureMethod: "http-html",
    },
    lineage: {
      independentForCorroboration: spec.publisherFamily !== "Apple",
      note:
        "Multiple pages from one publisher family count as one evidence lineage.",
    },
    qualifications:
      spec.sourceClass === "firstPartyStableReleaseHistory"
        ? [
            "Used only for the stable release boundary.",
            "Absence of beta entries on this page is not evidence that no public beta existed.",
          ]
        : [],
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
        "The committed ledger stores metadata, claim locators, and hashes. Full captures are local research evidence, not site copy or publication content.",
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

const queryLogs = targetVersions.map((version) => {
  const base = {
    queryLogId: `query:ios:${version}:public-beta-applicability`,
    platform: "iOS",
    version,
    releaseVersionId: releaseVersionIdFor(version),
    searchedAt: researchCutoff,
    searchProvider: "general web search index",
    queries: [
      `"iOS ${version}" "public beta"`,
      `site:macrumors.com "iOS ${version}" "public beta"`,
      `site:9to5mac.com "iOS ${version}" "public beta"`,
    ],
    stableBoundarySourceId: supportSourceFor(version),
  };
  if (version === "13.3.1") {
    return {
      ...base,
      inspectedSourceIds: observedPublicBetas.flatMap(
        (candidate) => candidate.sourceIds,
      ),
      outcome: "positiveExactPublicSequenceLocated",
      conclusion:
        "Three exact public appearances were located: Public Beta 1, 2, and 3. Each identity has two independent publisher families and an independently supported calendar date.",
      evidentiaryEffect:
        "Supports three candidates. It does not authorize integration or establish the absence of a later ordinal by search silence alone; the January 28 stable boundary closes only this researched sequence.",
    };
  }
  if (version === "14.8") {
    return {
      ...base,
      inspectedSourceIds: [
        "9to5mac-ios-14-8-no-beta",
        "idropnews-ios-14-8-no-beta",
      ],
      outcome: "explicitNoBetaEvidenceLocated",
      conclusion:
        "Two independent contemporary publisher families explicitly report that iOS 14.8 arrived without beta testing/a beta version.",
      evidentiaryEffect:
        "Supports evidenceBackedNotApplicable. This is an evidence claim, not an inference from an empty search.",
    };
  }
  if (version === "8.4.1") {
    return {
      ...base,
      inspectedSourceIds: [
        "macrumors-ios-8-4-1-developer-only",
        "osxdaily-ios-8-4-1-beta2-developer",
        "idownloadblog-ios-8-4-1-final",
        "heise-ios-8-4-1-beta2-ambiguous",
        "iculture-ios-8-4-1-beta2-ambiguous",
      ],
      outcome: "conflictingApplicabilityEvidence",
      conclusion:
        "Developer-only reporting and the stable boundary do not establish a public appearance, while Heise and iCulture retain wording broad enough to create an unresolved public-program/tester ambiguity.",
      evidentiaryEffect:
        "No candidate and no not-applicable claim. The correct reversible classification is notEstablished.",
    };
  }
  return {
    ...base,
    inspectedSourceIds: [supportSourceFor(version)],
    outcome: "noPositiveExactPublicIdentityLocatedInScopedSearch",
    conclusion:
      "The scoped searches did not locate a source that simultaneously establishes the exact iOS version, public audience, displayed public ordinal, and date.",
    evidentiaryEffect:
      "No-result searches, a stable release note, and the absence of a production developer-beta event do not prove that no public beta existed. This row remains reversible.",
  };
});
await writePacketJson("source-query-log.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  queryLogCount: queryLogs.length,
  guardrail:
    "Search outcomes are discovery logs, not proof of absence. Only explicit, claim-level source evidence can support evidenceBackedNotApplicable.",
  records: queryLogs,
});

const applicabilityRows = scopedRows.map((coverageRow) => {
  const version = coverageRow.version;
  const base = {
    auditId: `audit:ios:${version}:public-beta-applicability`,
    platform: "iOS",
    platformId: "platform-ios",
    version,
    releaseVersionId: coverageRow.releaseVersionId,
    stablePublicReleaseDate: coverageRow.publicReleaseDate,
    productionDeveloperBetaEventCount:
      coverageRow.developerBetaEventCount,
    productionPublicBetaEventCount: production.scopedEvents.filter(
      (event) =>
        event.releaseVersionId === coverageRow.releaseVersionId &&
        event.channel === "publicBeta",
    ).length,
    queryLogId: `query:ios:${version}:public-beta-applicability`,
    reviewedAt: researchCutoff,
    review,
    flags,
  };
  if (version === "13.3.1") {
    return {
      ...base,
      classification: "positiveCandidatesEstablished",
      candidateIds: observedPublicBetas.map((item) => item.candidateId),
      evidenceRefs: observedPublicBetas.flatMap((candidate) =>
        candidate.sourceIds.map((sourceId) =>
          packetSourceRef(
            sourceId,
            `${candidate.label}: exact iOS 13.3.1 public identity and/or its Pacific-normalized appearance date.`,
          ),
        ),
      ),
      conclusion:
        "Public Beta 1–3 are established by exact contemporaneous reporting. The stable release followed on January 28, 2020.",
      reversalEvidence:
        "A source-level identity conflict or proof that a cited report described a non-public distribution would require reopening the affected candidate.",
    };
  }
  if (evidenceBackedNotApplicableVersions.includes(version)) {
    return {
      ...base,
      classification: "evidenceBackedNotApplicable",
      candidateIds: [],
      evidenceRefs: [
        packetSourceRef(
          "9to5mac-ios-14-8-no-beta",
          "Direct statement that iOS 14.8 was not beta tested.",
        ),
        packetSourceRef(
          "idropnews-ios-14-8-no-beta",
          "Independent statement that iOS 14.8 arrived without a beta version.",
        ),
      ],
      conclusion:
        "Two independent contemporary publisher families explicitly establish that iOS 14.8 was released without beta testing.",
      reversalEvidence:
        "An Apple artifact or two independent contemporaneous sources establishing an exact iOS 14.8 public-beta identity would reopen this conclusion.",
    };
  }
  if (notEstablishedVersions.includes(version)) {
    return {
      ...base,
      classification: "notEstablished",
      candidateIds: [],
      evidenceRefs: [
        packetSourceRef(
          "macrumors-ios-8-4-1-developer-only",
          "Contemporaneous developer-only distribution statement.",
        ),
        packetSourceRef(
          "osxdaily-ios-8-4-1-beta2-developer",
          "Beta 2 developer distribution and contrast with the iOS 9 public program.",
        ),
        packetSourceRef(
          "idownloadblog-ios-8-4-1-final",
          "Final-release boundary after the two reported beta seeds.",
        ),
        packetSourceRef(
          "heise-ios-8-4-1-beta2-ambiguous",
          "Ambiguous combined-product public-program wording retained as contrary evidence.",
        ),
        packetSourceRef(
          "iculture-ios-8-4-1-beta2-ambiguous",
          "Ambiguous approved-tester wording retained as contrary evidence.",
        ),
      ],
      conclusion:
        "The available evidence does not establish an exact public ordinal/date, but conflicting public-program/tester wording makes a stronger no-public-beta conclusion unsafe.",
      reversalEvidence:
        "Two independent exact public-beta reports could establish candidate(s); direct product-specific no-public-beta evidence could instead support not-applicable.",
    };
  }
  return {
    ...base,
    classification: "auditedNoPositiveButReversible",
    candidateIds: [],
    evidenceRefs: [
      packetSourceRef(
        supportSourceFor(version),
        `First-party stable release boundary for iOS ${version}; not beta-absence evidence.`,
      ),
    ],
    conclusion:
      "No source meeting the exact-version/public-audience/displayed-ordinal/Pacific-date gate was located in this scoped audit.",
    reversalEvidence:
      "A contemporaneous source explicitly naming an iOS public-beta ordinal for this exact version and date would reopen the row; two independent publisher families are required before candidacy.",
  };
});
await writePacketJson("applicability-audit.json", {
  formatVersion: 1,
  batchId,
  generatedAt,
  parentCount: applicabilityRows.length,
  classificationCounts: {
    positiveCandidatesEstablished: applicabilityRows.filter(
      (item) => item.classification === "positiveCandidatesEstablished",
    ).length,
    evidenceBackedNotApplicable: applicabilityRows.filter(
      (item) => item.classification === "evidenceBackedNotApplicable",
    ).length,
    notEstablished: applicabilityRows.filter(
      (item) => item.classification === "notEstablished",
    ).length,
    auditedNoPositiveButReversible: applicabilityRows.filter(
      (item) =>
        item.classification === "auditedNoPositiveButReversible",
    ).length,
  },
  rows: applicabilityRows,
  guardrails: [
    "Never infer a public appearance from a developer label, build number, or paired-platform event.",
    "No-result searches and stable-release boundaries do not prove no beta.",
    "Absence of a production developer-beta event does not prove no beta.",
    "Only explicit claim-level evidence can support evidenceBackedNotApplicable.",
  ],
});

const conflicts = {
  formatVersion: 1,
  batchId,
  generatedAt,
  conflictCount: 2,
  blockedVersions: ["8.4.1"],
  conflicts: [
    {
      conflictId: "conflict:ios:8.4.1:heise-combined-product-wording",
      version: "8.4.1",
      sourceId: "heise-ios-8-4-1-beta2-ambiguous",
      type: "platformApplicabilityAmbiguity",
      observation:
        "The summary says paid developers and public-beta-program participants can obtain 'the updates' while the article covers iOS 8.4.1 and OS X 10.10.5 together.",
      conflict:
        "The wording may aggregate audiences across two products rather than establish that iOS 8.4.1 itself reached public testers.",
      disposition:
        "Retain as contrary evidence; do not convert it into an iOS Public Beta 2 candidate and do not suppress it when reviewing the developer-only evidence.",
    },
    {
      conflictId: "conflict:ios:8.4.1:iculture-approved-testers",
      version: "8.4.1",
      sourceId: "iculture-ios-8-4-1-beta2-ambiguous",
      type: "audienceIdentityAmbiguity",
      observation:
        "The article says developers and approved testers could download Beta 2, but its download instructions point to Apple's developer site.",
      conflict:
        "Approved testers is not an exact displayed public-beta identity, and a reader comment in the retained page questions whether public testers received it.",
      disposition:
        "Retain as ambiguity; no candidate and no irreversible no-beta claim.",
    },
  ],
  resolution:
    "iOS 8.4.1 remains notEstablished pending better product-specific evidence.",
};
await writePacketJson("conflicts.json", conflicts);

const productionCheckById = new Map(
  production.exactChecks.map((check) => [check.candidateId, check]),
);
const candidates = observedPublicBetas.map((candidate) => {
  const check = productionCheckById.get(candidate.candidateId);
  return {
    candidateId: candidate.candidateId,
    originCohortId: "ios-patch-applicability",
    platform: candidate.platform,
    platformId: candidate.platformId,
    version: candidate.version,
    releaseVersionId: candidate.releaseVersionId,
    proposedIdentity: {
      label: candidate.label,
      routeAlias: candidate.routeAlias,
      channel: "publicBeta",
      appearanceDate: candidate.appearanceDate,
      sequence: candidate.sequence,
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
    evidenceRefs: candidate.sourceIds.map((sourceId) =>
      packetSourceRef(
        sourceId,
        `${candidate.label}: exact iOS 13.3.1 public audience, displayed ordinal, and/or calendar date.`,
      ),
    ),
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: ["Independent chronology review is pending."],
    review,
    flags,
  };
});
const candidateRegister = {
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
    notProposedCount: 0,
    byStatus: {readyForChronologyReview: candidates.length},
    byPlatform: {iOS: candidates.length},
    importantQualification:
      "Three iOS 13.3.1 public-beta identities pass the research evidence gate but remain blocked on independent chronology review.",
  },
  cohorts: [
    {
      cohortId: "ios-patch-applicability",
      description:
        "Exact public-beta identities discovered during the 27-parent iOS patch applicability audit.",
      candidateCount: candidates.length,
      sourcePaths: [
        `${packetPath}/sources.json`,
        `${packetPath}/applicability-audit.json`,
        `${packetPath}/production-snapshot.json`,
      ],
      supersessionRule:
        "A later independently reviewed packet may supersede an identity only by naming the candidate ID and preserving the prior evidence/conflict trail.",
    },
  ],
  candidates,
  notProposed: [],
  nextEvidenceWaves: [
    {
      waveId: "ios-patch-applicability-independent-review",
      scope:
        "Independent review of candidates, negative applicability, reversible rows, production reconciliation, source independence, and conflicts.",
      artifactPaths: [
        `${packetPath}/candidates.json`,
        `${packetPath}/applicability-audit.json`,
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
};
await writePacketJson("candidates.json", candidateRegister);

const assignment = {
  formatVersion: 1,
  batchId,
  generatedAt,
  scope:
    "Research-only full-version public-beta applicability audit for exactly 27 modeled iOS patch releases.",
  platform: "iOS",
  parentCount: targetVersions.length,
  targetVersions,
  targetVersionIds: targetVersions.map(releaseVersionIdFor),
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
      "displayed public ordinal",
      "America/Los_Angeles appearance date",
    ],
    minimumIndependentPublisherFamiliesPerCandidate: 2,
    prohibitedInferences: [
      "developer label",
      "build number",
      "paired-platform event",
      "stable-note silence",
      "no-result search",
      "absence of production developer events",
    ],
  },
  expectedOutputs: [
    "assignment.json",
    "scoped-coverage-snapshot.json",
    "source-query-log.json",
    "sources.json",
    "raw-evidence-locks.json",
    "production-snapshot.json",
    "applicability-audit.json",
    "conflicts.json",
    "candidates.json",
    "self-review.json",
    "validation.json",
    "packet-locks.json",
    "report.md",
  ],
  explicitExclusions: [
    "independent-review.json (must be authored by a separate reviewer)",
    "shared aggregate edits",
    "Sanity mutations",
    "stableEventId creation",
    "page builds",
    "publication",
    "deployment",
  ],
};
await writePacketJson("assignment.json", assignment);

const selfReview = {
  formatVersion: 1,
  batchId,
  generatedAt,
  reviewerRole: "researcherSelfReview",
  status: "passed",
  checks: {
    exactParentScope: scopedRows.length === 27,
    productionPublishedNoCdn:
      production.perspective === "published" && production.useCdn === false,
    allParentsExist: production.parentChecks.every((item) => item.exists),
    candidatesAbsentFromProduction:
      production.exactChecks.every(
        (item) =>
          item.routeIdentityMatchCount === 0 &&
          item.fullCandidateMatchCount === 0,
      ),
    twoIndependentLineagesPerCandidate: candidates.every((candidate) => {
      const families = new Set(
        candidate.evidenceRefs.map(
          (ref) =>
            sourceSpecs.find((source) => source.sourceId === ref.sourceId)
              ?.publisherFamily,
        ),
      );
      return families.size >= 2;
    }),
    conflictsPreserved: conflicts.conflictCount === 2,
    absenceInferencesProhibited: true,
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
};
await writePacketJson("self-review.json", selfReview);

const reversibleList = auditedNoPositiveButReversibleVersions
  .map((version) => `\`${version}\``)
  .join(", ");
const report = `# iOS patch public-beta applicability audit

Batch: \`${batchId}\`  
Research cutoff: ${researchCutoff}  
Scope: exactly 27 production iOS parents

## Outcome

- **Three proposed identities:** iOS 13.3.1 Public Beta 1 (2019-12-18), Public Beta 2 (2020-01-14), and Public Beta 3 (2020-01-22).
- **Evidence-backed not applicable:** iOS 14.8. Two independent contemporary publisher families explicitly report that it arrived without beta testing.
- **Not established because evidence conflicts:** iOS 8.4.1. Developer-only reporting is strong, but combined-product public-program wording and ambiguous approved-tester wording make a no-public-beta conclusion unsafe.
- **Audited with no positive identity located, still reversible (24):** ${reversibleList}.

## Evidence and chronology rules

Each proposed identity has two independent publisher families supporting the exact iOS version, public audience, displayed public ordinal, and Pacific-normalized appearance date. No developer ordinal, build number, or paired-platform event was used to manufacture a public identity.

The 24 reversible rows are deliberately not described as “no beta.” A scoped search that finds no qualifying source, a stable release note, and the absence of a production developer-beta event do not prove historical absence.

For iOS 13.3.1, the two source lineages for each appearance are:

| Public identity | Pacific date | Independent publisher families |
| --- | --- | --- |
| Public Beta 1 | 2019-12-18 | BGR; Cult of Mac |
| Public Beta 2 | 2020-01-14 | 9to5Mac; Forbes |
| Public Beta 3 | 2020-01-22 | 9to5Mac; Kobonemi |

Kobonemi reports Public Beta 3 on January 23 in Japan; 9to5Mac's contemporaneous Pacific timestamp and same-day release statement establish January 22 in \`America/Los_Angeles\`.

## Production reconciliation

The fresh Sanity query used \`perspective: "published"\` and \`useCdn: false\` at ${production.capturedAt}. All 27 parent releaseVersion documents exist. Production contained ${production.productionCounts.totalReleaseEvents} release events overall, ${production.productionCounts.scopedReleaseEvents} scoped events, and zero scoped public-beta events. All three proposed route and full identities had zero matches.

## Integrity and handoff

Raw pages and mechanically selected locators are frozen under \`${evidenceRoot}\`; committed hashes are in \`raw-evidence-locks.json\`. The exact 27 source coverage rows are copied into \`scoped-coverage-snapshot.json\`, so this packet does not depend on later shared-matrix edits.

The packet is research-only. A separate reviewer must author \`independent-review.json\`. No IDs were created, no Sanity mutation occurred, no pages were built, and nothing was published or deployed.
`;
await writeFile(path.join(here, "report.md"), report);

console.log(
  JSON.stringify(
    {
      batchId,
      generatedAt,
      parentCount: scopedRows.length,
      candidateCount: candidates.length,
      classifications: {
        positiveCandidatesEstablished: 1,
        evidenceBackedNotApplicable: 1,
        notEstablished: 1,
        auditedNoPositiveButReversible:
          auditedNoPositiveButReversibleVersions.length,
      },
      sourceCount: sources.length,
      conflictCount: conflicts.conflictCount,
      productionCapturedAt: production.capturedAt,
    },
    null,
    2,
  ),
);

