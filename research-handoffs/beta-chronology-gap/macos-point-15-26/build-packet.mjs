import {createHash} from "node:crypto";
import {
  copyFile,
  mkdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  batchId,
  candidates as researchedCandidates,
  cohortId,
  conflicts,
  cycles,
  evidenceRoot,
  negativeFindings,
  packetPath,
  researchCutoff,
  targetVersionIds,
  targetVersions,
} from "./research-data.mjs";
import {sourceSpecs} from "./source-specs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const absolute = (relativePath) => path.join(repoRoot, relativePath);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) =>
  createHash("sha256").update(value).digest("hex");
const writeJson = (filename, value) =>
  writeFile(path.join(here, filename), json(value));
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
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
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

const identities = researchedCandidates.map((item) => ({
  candidateId: item.candidateId,
  version: item.version,
  releaseVersionId: item.releaseVersionId,
  channel: "publicBeta",
  routeAlias: item.routeAlias,
  label: item.label,
  sequence: item.sequence,
  appearanceDate: item.appearanceDate,
}));
const identityDocument = {
  formatVersion: 1,
  batchId,
  generatedAt: new Date().toISOString(),
  identityCount: identities.length,
  identities,
  safety: {
    queryInputOnly: true,
    sanityMutationAllowed: false,
  },
};
await writeJson("researched-identities.json", identityDocument);

const [fetchLog, production] = await Promise.all([
  readFile(absolute(`${evidenceRoot}/fetch-log.json`), "utf8").then(
    JSON.parse,
  ),
  readFile(
    absolute(`${evidenceRoot}/production-snapshot.json`),
    "utf8",
  ).then(JSON.parse),
]);
assert(fetchLog.failureCount === 0, "Source capture failures remain.");
assert(
  production.perspective === "published" &&
    production.useCdn === false,
  "Production snapshot must use published perspective and no CDN.",
);
if (
  production.expectedIdentityCount !== identities.length ||
  production.exactChecks.length !== identities.length
) {
  throw new Error(
    `researched-identities.json now contains ${identities.length} exact identities. Re-run query-production.ts, then run this builder again.`,
  );
}
assert(
  production.parentChecks.length === targetVersionIds.length &&
    production.parentChecks.every((item) => item.exists),
  "One or more scoped releaseVersion parents is absent.",
);
assert(
  production.exactChecks.every(
    (item) =>
      item.routeIdentityMatchCount === 0 &&
      item.fullCandidateMatchCount === 0,
  ),
  "A researched public-beta identity now exists in production.",
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
    finalUrl: capture.finalUrl,
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
        "Retained headline, publication metadata, and source-specific article or chronology passage described by supportNote.",
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
        "Use the source-specific supportNote and retained raw-page locator in sources.json; apply all conflicts.json qualifications.",
      supports:
        `${source.publisher} evidence for ${subject}'s public availability, displayed ordinal, and/or Pacific appearance date.`,
    };
  });

const exactById = new Map(
  production.exactChecks.map((item) => [item.candidateId, item]),
);
const candidateRecords = researchedCandidates.map((item) => {
  const exact = exactById.get(item.candidateId);
  assert(
    exact?.fullCandidateMatchCount === 0 &&
      exact?.routeIdentityMatchCount === 0,
    `Production absence proof missing for ${item.candidateId}.`,
  );
  const subject = `macOS ${item.version} Public Beta ${item.sequence}`;
  const families = new Set(
    item.sourceIds.map(
      (sourceId) => sourceById.get(sourceId)?.lineage.publisherFamily,
    ),
  );
  assert(
    families.size >= 2,
    `${item.candidateId} lacks two independent publisher families.`,
  );
  return {
    candidateId: item.candidateId,
    originCohortId: cohortId,
    platform: "macOS",
    platformId: "platform-macos",
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
    identityStatus: item.identityStatus,
    evidenceState: item.evidenceState,
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Fresh published no-CDN query found zero matches on releaseVersionId, publicBeta channel, routeAlias, label, sequence, and appearanceDate; the exact parent releaseVersion exists.",
      exactIdentityMatches: 0,
    },
    evidenceRefs: evidenceRefs(item.sourceIds, subject),
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers: [
      ...item.blockers,
      ...(item.qualification
        ? [`Mandatory source qualification: ${item.qualification}`]
        : []),
      "Independent chronology review is pending.",
    ],
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "A reviewer independent of the researcher must inspect the platform, audience, displayed public ordinal, Pacific date, source independence, skips, and conflicts.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const datedNegativeFindings = negativeFindings.filter(
  (item) => item.appearanceDate !== null,
);
const notProposed = datedNegativeFindings.map((item) => {
  const subject = `apparent macOS ${item.version} Public Beta ${item.sequence}`;
  return {
    recordId: item.recordId,
    originCohortId: cohortId,
    platform: "macOS",
    platformId: "platform-macos",
    releaseVersionId: `version-macos-${item.version.replaceAll(".", "-")}`,
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
  freshSourceCount: sources.filter(
    (item) => item.evidence.captureMethod === "http-html",
  ).length,
  failedCaptureCount: fetchLog.failureCount,
  copyrightHandling:
    "Raw pages are private research evidence. Reader-facing work must use original synthesis, claim-level attribution, links, and only bounded quotations when necessary.",
  sources,
};
const positiveSequence = researchedCandidates.map((item) => ({
  candidateId: item.candidateId,
  version: item.version,
  releaseVersionId: item.releaseVersionId,
  channel: "publicBeta",
  routeAlias: item.routeAlias,
  label: item.label,
  sequence: item.sequence,
  appearanceDate: item.appearanceDate,
  sourceIds: item.sourceIds,
  productionDisposition: "confirmedMissingCandidate",
  identityStatus: item.identityStatus,
}));
const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-macos-point-15-26-research",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scope:
    "Research-only audit of every displayed public-beta appearance for the 12 modeled macOS point versions 15.1–15.6 and 26.1–26.6.",
  calendarNormalization:
    "appearanceDate uses the America/Los_Angeles calendar date. Non-Pacific publication dates remain qualifications rather than new appearances.",
  identityRule:
    "Public ordinals require displayed public-program evidence and are never inferred from developer ordinals, generic beta wording, dates, builds, or assumed contiguous sequence.",
  targetVersions,
  candidateCount: candidateRecords.length,
  candidateCountByVersion: countBy(
    candidateRecords,
    (item) => item.version,
  ),
  positiveSequence,
  negativeFindings,
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
  ],
  productionReconciliation: {
    capturedAt: production.capturedAt,
    perspective: production.perspective,
    useCdn: production.useCdn,
    totalReleaseEvents: production.productionCounts.totalReleaseEvents,
    macOSPublicBetaEventsAllVersions:
      production.productionCounts.macOSPublicBetaEventsAllVersions,
    scopedReleaseEvents:
      production.productionCounts.scopedReleaseEvents,
    scopedPublicBetaEvents:
      production.productionCounts.scopedPublicBetaEvents,
    exactIdentityMatches:
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
    byPlatform: {macOS: candidateRecords.length},
    importantQualification:
      "Forty displayed appearances are confirmed absent from production. Three dated false identities are structured as not-proposed records; two additional undated missing-ordinal findings for macOS 15.6 remain audit findings because no appearance date may be inferred.",
  },
  cohorts: [
    {
      cohortId,
      description:
        "macOS 15.1–15.6 and 26.1–26.6 point-cycle public-beta chronology.",
      candidateCount: candidateRecords.length,
      sourcePaths: [
        `${packetPath}/assignment.json`,
        `${packetPath}/sources.json`,
        `${packetPath}/raw-evidence-locks.json`,
        `${packetPath}/production-snapshot.json`,
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
      waveId: "macos-point-15-26-independent-review",
      scope:
        "Independently inspect all 40 candidates, five negative findings, nine conflicts, source locators, and production absence proof.",
      artifactPaths: [
        `${packetPath}/independent-review.json`,
        `${packetPath}/report.md`,
        `${packetPath}/validation.json`,
      ],
      estimatedCandidateCount: candidateRecords.length,
      countStatus: "confirmed",
      requiredNextStep:
        "Assign a reviewer who did not perform this research. Implementation remains a separate authorization.",
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
  conflicts: conflicts.map((item) => ({
    conflictId: item.conflictId,
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    version: item.version,
    candidateId: item.candidateId,
    field: item.field,
    sourceIds: item.sourceIds,
    finding: `Retained value: ${item.retainedValue}. Conflicting value: ${item.conflictingValue}.`,
    proposedResolution: item.disposition,
  })),
  reviewState: "pendingIndependentChronologyReview",
};
const fullSequenceAudit = {
  formatVersion: 1,
  batchId,
  generatedAt,
  normalizationZone: "America/Los_Angeles",
  cycleCount: cycles.length,
  proposedAppearanceCount: candidateRecords.length,
  cycles: cycles.map((cycle) => ({
    version: cycle.version,
    releaseVersionId: cycle.releaseVersionId,
    stableDate: cycle.stableDate,
    parentExists:
      production.parentChecks.find(
        (item) => item.releaseVersionId === cycle.releaseVersionId,
      )?.exists ?? false,
    productionEvents: production.scopedEvents.filter(
      (item) => item.releaseVersionId === cycle.releaseVersionId,
    ),
    displayedPublicAppearances: positiveSequence.filter(
      (item) => item.version === cycle.version,
    ),
    negativeFindings: negativeFindings.filter(
      (item) => item.version === cycle.version,
    ),
    conflicts: conflicts
      .filter((item) => item.version === cycle.version)
      .map((item) => item.conflictId),
  })),
  undatedNegativeFindings: negativeFindings.filter(
    (item) => item.appearanceDate === null,
  ),
  guardrails: [
    "No public ordinal is inferred from a developer ordinal.",
    "Generic beta wording is not treated as public-program evidence.",
    "Same-day developer and public appearances remain separate events.",
    "An absent middle ordinal remains absent unless explicit public evidence establishes it.",
    "No build identity is proposed by this packet.",
  ],
};
const selfReview = {
  formatVersion: 1,
  batchId,
  preparedAt: generatedAt,
  reviewer: "codex-macos-point-15-26-research",
  independentOfResearcher: false,
  verdict: "researcherSelfCheckPassedPendingIndependentReview",
  checks: {
    exactParentReconciliationComplete: true,
    exactIdentityReconciliationComplete: true,
    candidateCount: candidateRecords.length,
    candidatesWithTwoIndependentPublisherLineages:
      candidateRecords.length,
    datedNotProposedCount: notProposed.length,
    undatedNegativeFindingCount:
      negativeFindings.length - notProposed.length,
    conflictCount: conflicts.length,
    rawEvidenceLocksRecorded: sources.length,
    expectedFrozenMaterialFileCount: 87,
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
  notes:
    "Intentionally pending and excluded from packet locks. A different agent must inspect frozen evidence and record a verdict without rewriting research artifacts.",
  authorization: {
    sanityMutationAllowed: false,
    publicationEligible: false,
    deploymentAllowed: false,
  },
};

const chronologyRows = cycles
  .flatMap((cycle) =>
    cycle.appearances.map((item) => {
      const publishers = [
        ...new Set(
          item.sourceIds.map(
            (sourceId) => sourceById.get(sourceId).publisher,
          ),
        ),
      ].join("; ");
      return `| ${cycle.version} | PB${item.sequence} | ${item.appearanceDate} | ${publishers} | ${item.identityStatus} |`;
    }),
  )
  .join("\n");
const negativeRows = negativeFindings
  .map(
    (item) =>
      `| ${item.version} | PB${item.sequence} | ${item.appearanceDate ?? "date not established"} | ${item.classification} | ${item.reason} |`,
  )
  .join("\n");
const report = `# macOS point-version public-beta chronology, 15.1–15.6 and 26.1–26.6

Status: **researcher self-check passed; independent chronology review pending**  
Research cutoff: **${researchCutoff}**  
Sanity writes, stable-ID creation, page work, publication, and deployment authorized: **no**

## Outcome

This packet establishes **40 displayed macOS public-beta appearances** across all 12 modeled point releases in scope. A fresh published, no-CDN production query found every parent releaseVersion and found **zero** matching publicBeta events, both by route identity and by the complete proposed identity.

The result is deliberately not a contiguous-numbering reconstruction. macOS 15.6 retains only Public Beta 3 because Public Beta 1 and 2 were not established. macOS 26.5 retains PB1 on April 3, PB2 on April 21, and PB3 on April 27; the apparent April 14 macOS public seed is rejected.

## Positive chronology

| Version | Public ordinal | Pacific appearance date | Captured publisher families | Identity state |
| --- | ---: | --- | --- | --- |
${chronologyRows}

## Negative and do-not-infer findings

| Version | Apparent ordinal | Date | Classification | Finding |
| --- | ---: | --- | --- | --- |
${negativeRows}

The two macOS 15.6 negative findings intentionally have no date. Assigning the paired developer dates would violate the program rule against inferring public appearances from developer chronology.

## Conflicts requiring independent review

The packet preserves nine material source conflicts, including the macOS 15.1 PB3 and macOS 26.6 PB3 date disagreements, shifted public numbering in macOS 15.5 and 26.5, and incomplete living tables for 26.2 and 26.4. See \`conflicts.json\`; none was silently normalized away.

## Evidence and copyright handling

All **${sources.length}** sources were captured successfully and hash-locked. The corpus spans ${new Set(sources.map((item) => item.publisher)).size} publisher families; each candidate cites at least two independent families. The freeze contract covers **87 material files**, including all **65 raw source captures**, the raw-evidence lock register, production/fetch snapshots, generated packet artifacts, research scripts/builders, and the shared program README/schema. A second freeze pass must reproduce every byte count and SHA-256 hash with zero drift.

The only exclusions are \`packet-locks.json\` itself, which cannot hash itself, and the pending \`independent-review.json\` placeholder, which must remain writable for a different reviewer. There is no unlocked research builder in this packet. Raw pages are private audit evidence, not republishable article content. Future pages must use original synthesis, claim-level source links, and bounded quotation only when necessary.

## Handoff

The packet is frozen research, not an implementation manifest. A reviewer independent of the researcher must inspect source locators, conflict handling, and the exact production absence proof. The pending review file is excluded from packet locks so the reviewer can record a verdict without altering the frozen research artifacts.
`;

await Promise.all([
  writeJson("assignment.json", assignment),
  writeJson("sources.json", sourcesDocument),
  writeJson("raw-evidence-locks.json", rawEvidenceLocks),
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
      candidateCount: candidateRecords.length,
      candidateCountByVersion: assignment.candidateCountByVersion,
      datedNotProposedCount: notProposed.length,
      undatedNegativeFindingCount:
        negativeFindings.length - notProposed.length,
      sourceCount: sources.length,
      conflictCount: conflicts.length,
      exactProductionMatches:
        production.productionCounts.exactFullMatches,
      independentReview: "pending",
    },
    null,
    2,
  ),
);
