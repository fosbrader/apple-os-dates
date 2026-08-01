import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../");
const batchId = "beta-chronology-gap-ios10-point-public";
const cohortId = "ios10-point-public-beta";
const packetPath =
  "research-handoffs/beta-chronology-gap/ios10-point-public";
const sourceLedgerPath = `${packetPath}/sources.json`;
const researchCutoff = "2026-07-30";
const generatedAt = new Date().toISOString();

const cycles = {
  "10.1": [
    [1, "2016-09-22"],
    [2, "2016-10-05"],
    [3, "2016-10-10"],
    [4, "2016-10-17"],
    [5, "2016-10-19"],
  ],
  "10.2": [
    [1, "2016-11-01"],
    [2, "2016-11-08"],
    [3, "2016-11-15"],
    [4, "2016-11-28"],
    [5, "2016-12-02"],
    [6, "2016-12-05"],
    [7, "2016-12-07"],
  ],
  "10.2.1": [
    [1, "2016-12-15"],
    [2, "2016-12-21"],
    [3, "2017-01-09"],
    [4, "2017-01-12"],
  ],
  "10.3": [
    [1, "2017-01-26"],
    [2, "2017-02-07"],
    [3, "2017-02-21"],
    [4, "2017-02-28"],
    [5, "2017-03-08"],
    [6, "2017-03-13"],
    [7, "2017-03-16"],
  ],
  "10.3.2": [
    [1, "2017-03-29"],
    [2, "2017-04-11"],
    [3, "2017-04-18"],
    [4, "2017-04-24"],
    [5, "2017-04-27"],
  ],
  "10.3.3": [
    [1, "2017-05-17"],
    [2, "2017-05-30"],
    [3, "2017-06-13"],
    [4, "2017-06-22"],
    [5, "2017-06-28"],
    [6, "2017-07-05"],
  ],
};

const sourceIdsByKey = {
  "10.1:1": [
    "source-ios101-pb1-9to5mac",
    "source-ios101-pb1-idb",
  ],
  "10.1:2": [
    "source-ios101-pb2-macrumors",
    "source-ios101-pb2-idevice",
  ],
  "10.1:3": [
    "source-ios101-pb3-macrumors",
    "source-ios101-pb3-macerkopf",
    "source-ios101-pb3-9to5mac",
    "source-ios101-pb3-idevice",
  ],
  "10.1:4": [
    "source-ios101-pb4-idb",
    "source-ios101-pb4-cultofmac",
  ],
  "10.1:5": [
    "source-ios101-pb5-macrumors",
    "source-ios101-pb5-iculture",
  ],
  "10.2:1": [
    "source-ios102-pb1-macrumors",
    "source-ios102-pb1-9to5mac",
  ],
  "10.2:2": [
    "source-ios102-pb2-macrumors",
    "source-ios102-pb2-idb",
  ],
  "10.2:3": [
    "source-ios102-pb3-idevice",
    "source-ios102-pb3-iphonefaq",
    "source-ios102-pb3-thinkapple",
    "source-ios102-pb3-macrumors-update",
  ],
  "10.2:4": [
    "source-ios102-pb4-macrumors",
    "source-ios102-pb4-macerkopf",
  ],
  "10.2:5": [
    "source-ios102-pb5-macrumors",
    "source-ios102-pb5-appleinsider",
  ],
  "10.2:6": [
    "source-ios102-pb6-9to5mac",
    "source-ios102-pb6-venturebeat",
  ],
  "10.2:7": [
    "source-ios102-pb7-9to5mac",
    "source-ios102-pb7-mobilesyrup",
  ],
  "10.2.1:1": [
    "source-ios1021-pb1-macrumors",
    "source-ios1021-pb1-idb",
  ],
  "10.2.1:2": [
    "source-ios1021-pb2-macrumors",
    "source-ios1021-pb2-appleinsider",
  ],
  "10.2.1:3": [
    "source-ios1021-pb3-macrumors",
    "source-ios1021-pb3-idevicecentral-video",
    "source-ios1021-pb3-osxdaily",
  ],
  "10.2.1:4": [
    "source-ios1021-pb4-macrumors",
    "source-ios1021-pb4-appleinsider",
  ],
  "10.3:1": [
    "source-ios103-pb1-macrumors",
    "source-ios103-pb1-9to5mac",
  ],
  "10.3:2": [
    "source-ios103-pb2-macrumors",
    "source-ios103-pb2-9to5mac",
  ],
  "10.3:3": [
    "source-ios103-pb3-macrumors",
    "source-ios103-pb3-9to5mac",
  ],
  "10.3:4": [
    "source-ios103-pb4-redmondpie",
    "source-ios103-pb4-idevice",
    "source-ios103-pb4-macrumors-update",
  ],
  "10.3:5": [
    "source-ios103-pb5-macrumors",
    "source-ios103-pb5-idevice",
  ],
  "10.3:6": [
    "source-ios103-pb6-macrumors",
    "source-ios103-pb6-idevice",
  ],
  "10.3:7": [
    "source-ios103-pb7-macrumors",
    "source-ios103-pb7-appleinsider",
  ],
  "10.3.2:1": [
    "source-ios1032-pb1-macrumors",
    "source-ios1032-pb1-appleinsider",
  ],
  "10.3.2:2": [
    "source-ios1032-pb2-macrumors",
    "source-ios1032-pb2-appleinsider",
  ],
  "10.3.2:3": [
    "source-ios1032-pb3-9to5mac",
    "source-ios1032-pb3-idevice",
    "source-ios1032-pb3-macrumors-update",
  ],
  "10.3.2:4": [
    "source-ios1032-pb4-macrumors",
    "source-ios1032-pb4-idevice",
  ],
  "10.3.2:5": [
    "source-ios1032-pb5-macrumors",
    "source-ios1032-pb5-macerkopf",
  ],
  "10.3.3:1": [
    "source-ios1033-pb1-macrumors",
    "source-ios1033-pb1-9to5mac",
  ],
  "10.3.3:2": [
    "source-ios1033-pb2-macrumors",
    "source-ios1033-pb2-9to5mac",
  ],
  "10.3.3:3": [
    "source-ios1033-pb3-macrumors",
    "source-ios1033-pb3-macerkopf",
    "source-ios1033-pb3-zollotech-video",
  ],
  "10.3.3:4": [
    "source-ios1033-pb4-macrumors",
    "source-ios1033-pb4-geekygadgets",
    "source-ios1033-pb4-zollotech-video",
  ],
  "10.3.3:5": [
    "source-ios1033-pb5-macrumors",
    "source-ios1033-pb5-idevice",
  ],
  "10.3.3:6": [
    "source-ios1033-pb6-macrumors",
    "source-ios1033-pb6-macobserver",
  ],
};

const correctedLeadDates = {
  "10.2:3": {
    supplied: "2016-11-14",
    proposed: "2016-11-15",
    conflictId: "ios102-public-beta-3-date",
  },
  "10.3:4": {
    supplied: "2017-02-27",
    proposed: "2017-02-28",
    conflictId: "ios103-public-beta-4-date",
  },
  "10.3.2:3": {
    supplied: "2017-04-17",
    proposed: "2017-04-18",
    conflictId: "ios1032-public-beta-3-date",
  },
};

const qualificationByKey = {
  "10.1:5":
    "The retained sources limit this seed to iPhone 7 and iPhone 7 Plus. Any eventual event page must display that device-applicability qualification.",
  "10.3.2:1":
    "The initial seed lacked 32-bit-device binaries, including iPhone 5, iPhone 5c, and iPad 4. Any eventual event page must display that applicability qualification.",
};

const releaseVersionIdFor = (version) =>
  `version-ios-${version.replaceAll(".", "-")}`;
const candidateIdFor = (version, sequence) =>
  `candidate:apple:ios:${version}:public-beta-${sequence}`;
const identityKey = (version, sequence) => `${version}:${sequence}`;
const countBy = (items, selector) => {
  const counts = {};
  for (const item of items) {
    const key = selector(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const observationsDocument = JSON.parse(
  await readFile(
    path.join(
      repoRoot,
      "tmp/research-evidence/beta-chronology-gap/ios10-point-public/source-observations.json",
    ),
    "utf8",
  ),
);
const production = JSON.parse(
  await readFile(path.join(here, "production-snapshot.json"), "utf8"),
);

const capturedObservations = observationsDocument.observations.filter(
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
      "Not used as candidate evidence. An independently captured alternate source covers every affected identity.",
  }));

const sources = capturedObservations.map((item) => {
  const publishedAt =
    item.parsed?.publishedAt ?? item.publishedDateObserved ?? null;
  return {
    sourceId: item.sourceId,
    canonicalUrl: item.canonicalUrl,
    finalUrl: item.finalUrl,
    title: item.parsed?.title ?? item.title ?? item.sourceId,
    publisher: item.publisher,
    author: item.parsed?.author ?? item.author ?? null,
    publishedAt,
    publishedDateObserved: item.publishedDateObserved,
    publicationDatePrecision:
      publishedAt && publishedAt.length > 10 ? "datetime" : "date",
    accessedAt: researchCutoff,
    archiveUrl: null,
    status: "active",
    sourceClass: item.sourceClass,
    roles: item.roles,
    supportNote: item.supportNote,
    evidence: item.evidence,
    lineage: {
      publisherFamily: item.publisher,
      independentForCorroboration:
        item.independentForCorroboration === true,
      notes:
        item.sourceClass === "contemporaneousVideoWitness"
          ? "Independent first-hand video witness. It does not count as a second editorial publisher lineage."
          : "Direct contemporary publisher page retained locally. Multiple URLs from one publisher count as one editorial lineage.",
    },
  };
});
const sourceById = new Map(sources.map((item) => [item.sourceId, item]));

const exactCheckByKey = new Map(
  production.exactChecks.map((item) => [
    identityKey(item.version, item.sequence),
    item,
  ]),
);
const developerAuditByVersion = new Map(
  production.developerBetaAudit.map((item) => [item.version, item]),
);

const targets = Object.entries(cycles).flatMap(([version, appearances]) =>
  appearances.map(([sequence, appearanceDate]) => ({
    candidateId: candidateIdFor(version, sequence),
    platform: "iOS",
    platformId: "platform-ios",
    version,
    releaseVersionId: releaseVersionIdFor(version),
    displayedLabel: `Public Beta ${sequence}`,
    routeAlias: `public-beta-${sequence}`,
    channel: "publicBeta",
    sequence,
    appearanceDate,
  })),
);

const candidates = targets.map((target) => {
  const key = identityKey(target.version, target.sequence);
  const exactCheck = exactCheckByKey.get(key);
  if (!exactCheck) throw new Error(`Missing production check for ${key}.`);
  const ids = sourceIdsByKey[key];
  if (!ids?.length) throw new Error(`Missing evidence source map for ${key}.`);
  const evidenceRefs = ids.map((sourceId) => {
    const source = sourceById.get(sourceId);
    if (!source) {
      throw new Error(`Candidate ${key} references uncaptured ${sourceId}.`);
    }
    return {
      kind: "packetSource",
      packetPath: sourceLedgerPath,
      sourceId,
      locator: source.evidence.locator,
      supports: source.supportNote,
    };
  });
  const weakEvidence = key === "10.2.1:3";
  const developerAudit = developerAuditByVersion.get(target.version);
  const blockers = ["Independent chronology review is still required."];
  if (weakEvidence) {
    blockers.push(
      "Only one retained editorial publisher explicitly reports this public appearance; the independent corroboration is a contemporaneous first-hand video witness. Obtain a second editorial lineage before approval.",
    );
  }
  if (correctedLeadDates[key]) {
    const correction = correctedLeadDates[key];
    blockers.push(
      `The supplied lead date ${correction.supplied} is the developer-article date; this packet proposes ${correction.proposed} for the public appearance. Independent review must adjudicate ${correction.conflictId}.`,
    );
  }
  if (qualificationByKey[key]) blockers.push(qualificationByKey[key]);
  return {
    candidateId: target.candidateId,
    originCohortId: cohortId,
    platform: target.platform,
    platformId: target.platformId,
    version: target.version,
    releaseVersionId: target.releaseVersionId,
    proposedIdentity: {
      label: target.displayedLabel,
      routeAlias: target.routeAlias,
      channel: target.channel,
      appearanceDate: target.appearanceDate,
      sequence: target.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    ordinalBasis: "explicit",
    candidateStatus: "needsEvidenceReview",
    identityStatus: weakEvidence ? "unverified" : "confirmed",
    evidenceState: weakEvidence ? "reported" : "corroborated",
    productionReconciliation: {
      status: "confirmedMissing",
      queriedAt: production.capturedAt,
      matchBasis:
        "Published production was queried by releaseVersionId, publicBeta channel, routeAlias, sequence, and appearanceDate; no exact identity, alias, or channel-sequence-date match was found.",
      exactIdentityMatches: exactCheck.exactIdentityMatchCount,
    },
    evidenceRefs,
    pairedDeveloperRoute:
      developerAudit?.developerBetaEventCount > 0
        ? {
            releaseVersionId: target.releaseVersionId,
            routeAlias: `beta-${target.sequence}`,
            relationship:
              "Production contains the same-numbered developerBeta route. This is chronology context only and does not assert build or payload equivalence.",
          }
        : null,
    buildEvidenceStatus: "absent",
    contentDisposition: "timelineOnly",
    blockers,
    review: {
      required: true,
      reviewer: null,
      reviewedAt: null,
      notes:
        "Research packet self-check only. A reviewer independent of the researcher must verify the cited locators and adjudicate any listed conflict before a write is separately authorized.",
    },
    flags: {
      sanityMutationAllowed: false,
      publicationEligible: false,
    },
  };
});

const developerAuditGaps = production.developerBetaAudit
  .filter((item) => item.auditGap)
  .map((item) => ({
    platform: "iOS",
    version: item.version,
    releaseVersionId: item.releaseVersionId,
    productionDeveloperBetaEventCount: item.developerBetaEventCount,
    classification: "developerChronologyAuditGap",
    requiredNextStep:
      "Open a separate developer-beta research assignment. Do not manufacture developer candidates from this public-beta packet.",
  }));

const assignment = {
  formatVersion: 1,
  batchId,
  createdAt: generatedAt,
  createdBy: "codex-scope-beta-gap-program",
  vendor: {name: "Apple", slug: "apple"},
  researchCutoff,
  scopeRule:
    "Research iOS 10 point-cycle public-beta appearances for 10.1, 10.2, 10.2.1, 10.3, 10.3.2, and 10.3.3. Preserve explicit public ordinals, distinguish public availability from developer article dates, and exclude builds, substantive release-note content, developer-only candidates, GM/RC, and final public releases.",
  targetCount: targets.length,
  cycles: Object.entries(cycles).map(([version, appearances]) => {
    const audit = developerAuditByVersion.get(version);
    return {
      version,
      releaseVersionId: releaseVersionIdFor(version),
      targetCount: appearances.length,
      productionPublicBetaCount: 0,
      productionDeveloperBetaCount: audit?.developerBetaEventCount ?? 0,
      developerAuditGap: audit?.auditGap ?? true,
    };
  }),
  targets,
  suppliedLeadCorrections: Object.entries(correctedLeadDates).map(
    ([key, item]) => ({
      candidateId: candidateIdFor(
        key.split(":")[0],
        Number(key.split(":")[1]),
      ),
      suppliedAppearanceDate: item.supplied,
      proposedAppearanceDate: item.proposed,
      conflictId: item.conflictId,
    }),
  ),
  evidenceRequirements: {
    preferredEditorialPublisherLineages: 2,
    publicOrdinalMustBeExplicit: true,
    developerOrdinalInferenceAllowed: false,
    developerArticleDateMayStandInForPublicAppearance: false,
    buildInferenceAllowed: false,
    copyrightHandling:
      "Publish metadata, citations, hashes, pinpoint locators, and original synthesis. Retained source captures are research evidence, not reusable article copy.",
  },
  safety: {
    sanityMutationAllowed: false,
    publicationAuthorized: false,
    stableEventIdCreationAllowed: false,
    deploymentAllowed: false,
  },
  productionSnapshot: `${packetPath}/production-snapshot.json`,
};

const sourcesDocument = {
  formatVersion: 1,
  batchId,
  accessedAt: researchCutoff,
  capturedAt: observationsDocument.capturedAt,
  sourceCount: sources.length,
  attemptedSourceCount: observationsDocument.sourceCount,
  failedCaptureCount: captureFailures.length,
  sources,
  captureFailures,
};

const candidatesDocument = {
  formatVersion: 1,
  batchId,
  generatedAt,
  researchCutoff,
  candidateCount: candidates.length,
  summary: {
    byVersion: countBy(candidates, (item) => item.version),
    byEvidenceState: countBy(candidates, (item) => item.evidenceState),
    byIdentityStatus: countBy(candidates, (item) => item.identityStatus),
    byProductionStatus: countBy(
      candidates,
      (item) => item.productionReconciliation.status,
    ),
    correctedLeadDateCount: Object.keys(correctedLeadDates).length,
    deviceApplicabilityQualificationCount: Object.keys(
      qualificationByKey,
    ).length,
    buildsIncluded: 0,
    substantiveChangeClaimsIncluded: 0,
    importantQualification:
      "Thirty-three candidates retain at least two independent contemporary editorial lineages. iOS 10.2.1 Public Beta 3 has one explicit editorial report plus an independent contemporary first-hand video witness and remains reported/unverified pending a second editorial lineage.",
  },
  candidates,
  existingMatches: [],
  notProposed: [],
  developerBetaAuditGaps: developerAuditGaps,
};

const conflicts = [
  {
    conflictId: "ios102-public-beta-3-date",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 10.2 Public Beta 3 appearance date",
    candidateIds: [candidateIdFor("10.2", 3)],
    positions: [
      {
        position: "2016-11-14",
        sources: ["source-ios102-pb3-macrumors-update"],
        summary:
          "The MacRumors page carries the original developer-article date and a later public-availability update with no independent update timestamp.",
      },
      {
        position: "2016-11-15",
        sources: [
          "source-ios102-pb3-idevice",
          "source-ios102-pb3-iphonefaq",
          "source-ios102-pb3-thinkapple",
        ],
        summary:
          "Standalone public-facing reports identify the third public beta on November 15. The iPhone FAQ article has obvious body version-number typos, so only its correctly titled chronology and timestamp are used.",
      },
    ],
    decision: {
      disposition: "propose2016-11-15",
      confidence: "high",
      rationale:
        "The November 14 timestamp belongs to a developer article whose public update is untimestamped; multiple standalone public reports are dated November 15.",
    },
    requiredHandling:
      "Do not collapse the public appearance onto the developer article date. Recheck the preserved locators during independent review.",
  },
  {
    conflictId: "ios103-public-beta-4-date",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 10.3 Public Beta 4 appearance date",
    candidateIds: [candidateIdFor("10.3", 4)],
    positions: [
      {
        position: "2017-02-27",
        sources: ["source-ios103-pb4-macrumors-update"],
        summary:
          "The MacRumors page carries the original developer-article date and an untimestamped public-availability update.",
      },
      {
        position: "2017-02-28",
        sources: [
          "source-ios103-pb4-redmondpie",
          "source-ios103-pb4-idevice",
        ],
        summary:
          "Two standalone contemporary publishers report the public seed on February 28; Redmond Pie explicitly distinguishes it from the prior day's developer seed.",
      },
    ],
    decision: {
      disposition: "propose2017-02-28",
      confidence: "high",
      rationale:
        "Public-specific reporting dates the availability one day after the developer seed.",
    },
    requiredHandling:
      "Preserve February 27 as the paired developer appearance, not the public appearance.",
  },
  {
    conflictId: "ios1032-public-beta-3-date",
    severity: "material",
    status: "proposedResolutionPendingIndependentReview",
    subject: "iOS 10.3.2 Public Beta 3 appearance date",
    candidateIds: [candidateIdFor("10.3.2", 3)],
    positions: [
      {
        position: "2017-04-17",
        sources: ["source-ios1032-pb3-macrumors-update"],
        summary:
          "The MacRumors page carries the original developer-article date and an untimestamped public-availability update.",
      },
      {
        position: "2017-04-18",
        sources: [
          "source-ios1032-pb3-9to5mac",
          "source-ios1032-pb3-idevice",
        ],
        summary:
          "Two standalone contemporary publishers report the third public beta on April 18; 9to5Mac explicitly distinguishes it from the prior day's developer seed.",
      },
    ],
    decision: {
      disposition: "propose2017-04-18",
      confidence: "high",
      rationale:
        "Public-specific reporting dates the availability one day after the developer seed.",
    },
    requiredHandling:
      "Preserve April 17 as the paired developer appearance, not the public appearance.",
  },
  {
    conflictId: "ios1021-public-beta-3-editorial-lineage-gap",
    severity: "material",
    status: "unresolved",
    subject: "iOS 10.2.1 Public Beta 3 corroboration threshold",
    candidateIds: [candidateIdFor("10.2.1", 3)],
    positions: [
      {
        position: "explicitEditorialReport",
        sources: ["source-ios1021-pb3-macrumors"],
        summary:
          "MacRumors explicitly states that the third public beta was available.",
      },
      {
        position: "independentWitnessAndAmbiguousContext",
        sources: [
          "source-ios1021-pb3-idevicecentral-video",
          "source-ios1021-pb3-osxdaily",
        ],
        summary:
          "The first-hand video page independently contains a Public Beta 3 description and January 9 upload timestamp. OS X Daily covers beta 3 and says public versions typically follow, but does not independently state that the public seed was already available.",
      },
    ],
    decision: {
      disposition: "retainReportedUnverified",
      confidence: "medium",
      rationale:
        "The identity is directly reported and independently witnessed, but the packet deliberately does not relabel that as two-editorial-lineage corroboration.",
    },
    requiredHandling:
      "Find a second independent contemporary editorial publisher before chronology approval.",
  },
  {
    conflictId: "ios101-public-beta-5-device-scope",
    severity: "nonMaterial",
    status: "qualificationRequired",
    subject: "iOS 10.1 Public Beta 5 device applicability",
    candidateIds: [candidateIdFor("10.1", 5)],
    sources: [
      "source-ios101-pb5-macrumors",
      "source-ios101-pb5-iculture",
    ],
    finding:
      "Both retained sources identify a fifth public seed limited to iPhone 7 and iPhone 7 Plus.",
    requiredHandling:
      "Display the device limitation on any eventual event page; do not imply this seed was offered to every iOS 10-capable device.",
  },
  {
    conflictId: "ios1032-public-beta-1-device-scope",
    severity: "nonMaterial",
    status: "qualificationRequired",
    subject: "iOS 10.3.2 Public Beta 1 32-bit-device omission",
    candidateIds: [candidateIdFor("10.3.2", 1)],
    sources: [
      "source-ios1032-pb1-macrumors",
      "source-ios1032-pb1-appleinsider",
    ],
    finding:
      "The first public seed lacked 32-bit binaries, affecting devices including iPhone 5, iPhone 5c, and iPad 4.",
    requiredHandling:
      "Display the initial 32-bit-device omission on any eventual event page.",
  },
];

const conflictsDocument = {
  formatVersion: 1,
  batchId,
  conflictCount: conflicts.length,
  conflicts,
  developerBetaAuditGaps: developerAuditGaps,
  captureFailures,
  exclusions: [
    {
      identity: "Developer-beta candidates for 10.2.1, 10.3.2, and 10.3.3",
      reason:
        "Production has zero developerBeta events for those releaseVersion documents, but developer research was explicitly outside this assignment.",
    },
    {
      identity: "Build numbers and substantive release-note claims",
      reason:
        "This packet freezes chronology identities only. It does not infer shared payloads or research article content.",
    },
  ],
  reviewState: "pendingIndependentChronologyReview",
};

const corroboratedCandidateIds = candidates
  .filter((item) => item.evidenceState === "corroborated")
  .map((item) => item.candidateId);
const reportedCandidateIds = candidates
  .filter((item) => item.evidenceState === "reported")
  .map((item) => item.candidateId);

const review = {
  formatVersion: 1,
  batchId,
  preparedAt: generatedAt,
  reviewer: "codex-scope-beta-gap-program-self-check",
  independentOfResearcher: false,
  verdict: "pendingIndependentReview",
  candidateVerdict: {
    corroboratedPendingIndependentReview: corroboratedCandidateIds,
    needsSecondEditorialPublisherLineage: reportedCandidateIds,
    dateCorrectionNeedsAdjudication: Object.keys(correctedLeadDates).map(
      (key) =>
        candidateIdFor(
          key.split(":")[0],
          Number(key.split(":")[1]),
        ),
    ),
    applicabilityQualificationRequired: Object.keys(
      qualificationByKey,
    ).map((key) =>
      candidateIdFor(
        key.split(":")[0],
        Number(key.split(":")[1]),
      ),
    ),
  },
  checks: {
    exactProductionSnapshotReviewed: true,
    publicAndDeveloperChannelsSeparated: true,
    suppliedDeveloperArticleDatesCorrected: 3,
    explicitPublicOrdinals: candidates.length,
    inferredPublicOrdinals: 0,
    buildClaimsIncluded: 0,
    substantiveChangeClaimsIncluded: 0,
    sanityMutationPerformed: false,
    deploymentPerformed: false,
  },
  authorization: {
    chronologyApprovedCandidateCount: 0,
    publicationEligible: false,
    sanityMutationAllowed: false,
    stableEventIdCreationAllowed: false,
    deploymentAllowed: false,
  },
};

const cycleRows = Object.entries(cycles)
  .map(([version, appearances]) => {
    const dates = appearances.map(([, date]) => date).join(", ");
    const devAudit = developerAuditByVersion.get(version);
    return `| ${version} | ${appearances.length} | ${dates} | ${devAudit?.developerBetaEventCount ?? 0}${devAudit?.auditGap ? " — audit gap" : ""} |`;
  })
  .join("\n");

const report = `# iOS 10 point-release public-beta chronology packet

## Outcome

This research-only packet freezes 34 proposed public-beta identities across iOS 10.1, 10.2, 10.2.1, 10.3, 10.3.2, and 10.3.3. Published production contains zero publicBeta events in these six releaseVersion documents, and every exact candidate identity is absent.

Thirty-three candidates have at least two independent contemporary editorial publisher lineages and are marked \`corroborated\`. iOS 10.2.1 Public Beta 3 has one explicit editorial report plus an independent contemporary first-hand video witness; it remains \`reported\` / \`unverified\` until a second editorial lineage is found. No candidate is approved for publication or Sanity mutation.

## Frozen chronology

| Version | Candidate count | Proposed public appearance dates | Production developer betas |
| --- | ---: | --- | ---: |
${cycleRows}

All ordinals are explicit in retained source evidence. None was inferred from a developer sequence or build.

## Corrections to the supplied leads

| Candidate | Supplied lead | Packet proposal | Reason |
| --- | --- | --- | --- |
| iOS 10.2 Public Beta 3 | 2016-11-14 | 2016-11-15 | November 14 is the original developer-article date; its public update is untimestamped. Multiple standalone public reports are dated November 15. |
| iOS 10.3 Public Beta 4 | 2017-02-27 | 2017-02-28 | February 27 is the developer seed. Two standalone public reports place the public seed on February 28. |
| iOS 10.3.2 Public Beta 3 | 2017-04-17 | 2017-04-18 | April 17 is the developer seed. Two standalone public reports place the public seed on April 18. |

These are proposed resolutions, not silent rewrites. The competing evidence and required reviewer handling are preserved in \`conflicts.json\`.

## Applicability qualifications

- iOS 10.1 Public Beta 5 was limited to iPhone 7 and iPhone 7 Plus.
- iOS 10.3.2 Public Beta 1 initially lacked 32-bit-device binaries, including iPhone 5, iPhone 5c, and iPad 4.

Any eventual page must show those limitations rather than presenting each seed as universally available across the release's nominal device set.

## Production reconciliation and developer-audit boundary

The read-only production snapshot was captured at ${production.capturedAt} with the published perspective and CDN disabled. It found:

- ${production.productionCounts.totalReleaseEvents} total releaseEvent documents;
- ${production.productionCounts.scopedReleaseEvents} events in the six scoped releaseVersion documents;
- ${production.productionCounts.scopedPublicBetaEvents} scoped publicBeta events;
- ${production.productionCounts.scopedDeveloperBetaEvents} scoped developerBeta events; and
- zero exact, alias, or channel-sequence-date matches for all 34 candidates.

Production contains no developerBeta events for iOS 10.2.1, 10.3.2, or 10.3.3. Those are separate developer-chronology audit gaps. This public-beta assignment does not propose developer events for them.

## Evidence capture

The source pass attempted ${observationsDocument.sourceCount} contemporary URLs and captured ${sources.length}. Six failed direct capture: five Neowin pages returned HTTP 403 and one iPhoneTricks page has a currently unusable host/certificate path. None of those six is used as candidate evidence; independently captured alternates cover every affected candidate.

Each retained source record includes canonical URL, publisher metadata, source class, pinpoint locator, raw and selected-text paths, byte counts, and SHA-256 hashes. Source pages are evidence, not article copy: future public writing must paraphrase, cite every sourced claim, and use only short quotations when genuinely necessary.

## Review gates

Before any separately authorized Sanity write:

1. An independent reviewer must reproduce hashes and inspect every candidate locator.
2. The reviewer must adjudicate the three corrected date conflicts.
3. iOS 10.2.1 Public Beta 3 needs a second independent contemporary editorial publisher, or an explicit exception decision.
4. The two device-applicability qualifications must be preserved in any downstream model or page.
5. Production must be queried again immediately before mutation.

This packet contains no Sanity mutation, stableEventId creation, deployment, build assertion, or substantive release-note claim.
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
    `${JSON.stringify(candidatesDocument, null, 2)}\n`,
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
      batchId,
      candidateCount: candidates.length,
      sourceCount: sources.length,
      failedCaptureCount: captureFailures.length,
      conflictCount: conflicts.length,
      evidenceState: countBy(candidates, (item) => item.evidenceState),
      developerBetaAuditGaps: developerAuditGaps.map(
        (item) => item.version,
      ),
    },
    null,
    2,
  ),
);
