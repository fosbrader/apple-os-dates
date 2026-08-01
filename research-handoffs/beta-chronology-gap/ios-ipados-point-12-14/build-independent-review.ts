import {getCliClient} from "sanity/cli";
import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {
  allObservedAppearances,
  batchId,
  targetVersionIds,
} from "./research-data.mjs";

type ProductionEvent = {
  _id: string;
  stableEventId?: string;
  releaseVersionId: string;
  platform?: string;
  version?: string;
  label?: string;
  routeAlias?: string;
  channel?: string;
  appearanceDate?: string;
  sequence?: number;
  isRevision?: boolean;
  availabilityState?: string;
};

type PacketCandidate = {
  candidateId: string;
  platform: "iOS" | "iPadOS";
  version: string;
  releaseVersionId: string;
  proposedIdentity: {
    appearanceDate: string;
    sequence: number;
  };
  evidenceRefs: Array<{sourceId: string}>;
};

type PacketSource = {
  sourceId: string;
  publisher: string;
  lineage: {
    publisherFamily: string;
  };
};

const here = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(here, "../../..");
const writeReview = process.argv.includes("--write-review");
const packetSourcePath =
  "research-handoffs/beta-chronology-gap/ios-ipados-point-12-14/sources.json";

const candidatePacket = JSON.parse(
  readFileSync(path.join(here, "candidates.json"), "utf8"),
) as {candidates: PacketCandidate[]};
const sourcePacket = JSON.parse(
  readFileSync(path.join(here, "sources.json"), "utf8"),
) as {sources: PacketSource[]};
const sourceById = new Map(
  sourcePacket.sources.map((source) => [source.sourceId, source]),
);

const exactEvidenceByCandidateId = new Map<string, string[]>();

function candidateId(
  platform: "iOS" | "iPadOS",
  version: string,
  sequence: number,
) {
  return `candidate:apple:${platform === "iOS" ? "ios" : "ipados"}:${version}:public-beta-${sequence}`;
}

function addExactEvidence(
  platform: "iOS" | "iPadOS",
  version: string,
  sequences: number[],
  sourceId: string,
) {
  if (!sourceById.has(sourceId)) {
    throw new Error(`Unknown sourceId in exact-evidence map: ${sourceId}`);
  }
  for (const sequence of sequences) {
    const id = candidateId(platform, version, sequence);
    const current = exactEvidenceByCandidateId.get(id) ?? [];
    if (!current.includes(sourceId)) current.push(sourceId);
    exactEvidenceByCandidateId.set(id, current);
  }
}

// iCulture rolling timelines. Only rows that explicitly name the platform,
// public ordinal, and the candidate's America/Los_Angeles date are admitted.
for (const [platform, version, sequences, sourceId] of [
  ["iOS", "12.1", [1, 2, 3, 4, 5], "iculture-ios-12-1"],
  ["iOS", "12.1.1", [1], "iculture-ios-12-1-1"],
  ["iOS", "12.1.2", [1], "iculture-ios-12-1-2"],
  ["iOS", "12.1.3", [2, 3, 4], "iculture-ios-12-1-3"],
  ["iOS", "12.2", [1, 2, 3, 4, 5, 6], "iculture-ios-12-2"],
  ["iOS", "12.3", [1, 2, 3, 5, 6], "iculture-ios-12-3"],
  ["iOS", "12.4", [2, 3, 5, 6, 7], "iculture-ios-12-4"],
  ["iOS", "13.1", [1, 2, 3, 4], "iculture-ios-13-1"],
  ["iOS", "13.2", [1, 2, 3, 4], "iculture-ios-13-2"],
  ["iPadOS", "13.2", [1, 2, 3, 4], "iculture-ios-13-2"],
  ["iOS", "13.3", [1, 2, 3, 4], "iculture-ios-13-3"],
  ["iPadOS", "13.3", [1, 2, 3, 4], "iculture-ios-13-3"],
  ["iOS", "13.4", [1, 2, 3, 4, 5], "iculture-ios-13-4"],
  ["iPadOS", "13.4", [1, 2, 3, 4, 5], "iculture-ios-13-4"],
  ["iOS", "13.5", [2, 3], "iculture-ios-13-5"],
  ["iPadOS", "13.5", [2, 3], "iculture-ios-13-5"],
  ["iOS", "13.6", [2, 3], "iculture-ios-13-6"],
  ["iPadOS", "13.6", [2, 3], "iculture-ios-13-6"],
  ["iOS", "14.2", [1, 2, 3, 4], "iculture-ios-14-2"],
  ["iOS", "14.3", [1], "iculture-ios-14-3"],
  ["iOS", "14.4", [1, 2], "iculture-ios-14-4"],
  ["iOS", "14.5", [1, 2, 3, 4, 5, 6, 7, 8], "iculture-ios-14-5"],
  ["iPadOS", "14.5", [1, 2, 3, 4, 7, 8], "iculture-ios-14-5"],
  ["iOS", "14.6", [1, 2, 3], "iculture-ios-14-6"],
  ["iPadOS", "14.6", [1, 2, 3], "iculture-ios-14-6"],
  ["iOS", "14.7", [1, 3], "iculture-ios-14-7"],
] as const) {
  addExactEvidence(platform, version, [...sequences], sourceId);
}

// iMore rolling histories. Date-conflicting and omitted rows are deliberately
// absent (iOS 12.3 PB3, 14.6 PB3, and several iPadOS rows).
for (const [platform, version, sequences, sourceId] of [
  ["iOS", "12.1", [1, 5], "imore-ios12-history"],
  ["iOS", "12.1.1", [1, 2, 3], "imore-ios12-history"],
  ["iOS", "12.1.2", [1], "imore-ios12-history"],
  ["iOS", "12.1.3", [4], "imore-ios12-history"],
  ["iOS", "12.2", [1, 2, 3, 4], "imore-ios12-history"],
  ["iOS", "12.3", [1, 2, 4], "imore-ios12-history"],
  ["iOS", "13.1", [1, 2, 3, 4], "imore-ios13-history"],
  ["iOS", "13.2", [1, 2], "imore-ios13-history"],
  ["iOS", "13.3", [1, 2], "imore-ios13-history"],
  ["iOS", "13.4", [1, 2, 3, 4], "imore-ios13-history"],
  ["iOS", "13.6", [2, 3], "imore-ios13-history"],
  ["iPadOS", "13.1", [1], "imore-ipados13-history"],
  ["iPadOS", "13.2", [1, 2], "imore-ipados13-history"],
  ["iPadOS", "13.3", [1, 2], "imore-ipados13-history"],
  ["iPadOS", "13.4", [1, 2, 3, 4], "imore-ipados13-history"],
  ["iPadOS", "13.6", [2, 3], "imore-ipados13-history"],
  ["iOS", "14.2", [1, 2, 3, 4], "imore-ios14-history"],
  ["iOS", "14.3", [1, 2], "imore-ios14-history"],
  ["iOS", "14.4", [1], "imore-ios14-history"],
  ["iOS", "14.5", [1], "imore-ios14-history"],
  ["iOS", "14.6", [1], "imore-ios14-history"],
  ["iOS", "14.7", [1, 3, 4, 5], "imore-ios14-history"],
  ["iPadOS", "14.2", [1, 2, 3, 4], "imore-ipados14-history"],
  ["iPadOS", "14.3", [1, 2], "imore-ipados14-history"],
  ["iPadOS", "14.4", [1], "imore-ipados14-history"],
  ["iPadOS", "14.5", [1], "imore-ipados14-history"],
  ["iPadOS", "14.6", [1], "imore-ipados14-history"],
] as const) {
  addExactEvidence(platform, version, [...sequences], sourceId);
}

// MacRumors pages admitted here explicitly connect the numeral to a public
// beta. Developer-title numerals with a generic public-availability update are
// intentionally excluded.
for (const [platform, version, sequences, sourcePrefix] of [
  ["iOS", "12.1", [1], "mr-ios-12-1-pb"],
  ["iOS", "12.1.1", [1], "mr-ios-12-1-1-pb"],
  ["iOS", "12.1.2", [1], "mr-ios-12-1-2-pb"],
  ["iOS", "12.1.3", [4], "mr-ios-12-1-3-pb"],
  ["iOS", "12.2", [1, 2, 3], "mr-ios-12-2-pb"],
  ["iOS", "12.3", [1, 2, 3], "mr-ios-12-3-pb"],
  ["iOS", "12.4", [7], "mr-ios-12-4-pb"],
] as const) {
  for (const sequence of sequences) {
    addExactEvidence(platform, version, [sequence], `${sourcePrefix}${sequence}`);
  }
}

for (const [version, sequences, sourcePrefix] of [
  ["13.1", [1, 3, 4], "mr-13-1-pb"],
  ["13.3", [1, 4], "mr-13-3-pb"],
  ["13.4", [1, 2], "mr-13-4-pb"],
  ["14.2", [1, 2, 3, 4], "mr-14-2-pb"],
  ["14.3", [1, 2], "mr-14-3-pb"],
  ["14.4", [1], "mr-14-4-pb"],
  ["14.5", [1, 2, 3], "mr-14-5-pb"],
  ["14.6", [1], "mr-14-6-pb"],
] as const) {
  for (const platform of ["iOS", "iPadOS"] as const) {
    for (const sequence of sequences) {
      addExactEvidence(platform, version, [sequence], `${sourcePrefix}${sequence}`);
    }
  }
}
for (const platform of ["iOS", "iPadOS"] as const) {
  addExactEvidence(platform, "14.7", [1], "mr-14-7-pb1");
}
addExactEvidence("iOS", "14.7", [5], "mr-14-7-pb5");

// Other retained contemporary sources with exact claim-level wording.
for (const [platform, version, sequence, sourceId] of [
  ["iOS", "12.4", 2, "gh-ios-12-4-pb2"],
  ["iOS", "12.4", 4, "gh-ios-12-4-pb4"],
  ["iOS", "12.4", 4, "forbes-ios-12-4-pb4"],
  ["iOS", "12.4", 5, "gh-ios-12-4-pb5"],
  ["iOS", "12.4", 6, "gh-ios-12-4-pb6"],
  ["iOS", "13.1", 1, "osxd-13-1-pb1"],
  ["iOS", "13.1", 2, "9to5mac-13-1-pb2"],
  ["iPadOS", "13.1", 2, "9to5mac-13-1-pb2"],
  ["iOS", "13.1", 3, "itopnews-13-1-pb3"],
  ["iPadOS", "13.1", 3, "itopnews-13-1-pb3"],
  ["iOS", "13.1", 4, "osxd-13-1-pb4"],
  ["iPadOS", "13.1", 4, "osxd-13-1-pb4"],
  ["iOS", "13.3", 3, "shiftdelete-ios-ipados-13-3-pb3"],
  ["iPadOS", "13.3", 3, "shiftdelete-ios-ipados-13-3-pb3"],
  ["iOS", "14.3", 3, "osxd-ios-ipados-14-3-pb3"],
  ["iPadOS", "14.3", 3, "osxd-ios-ipados-14-3-pb3"],
  ["iOS", "14.4", 2, "purudo-ios-ipados-14-4-pb2"],
  ["iPadOS", "14.4", 2, "purudo-ios-ipados-14-4-pb2"],
  ["iOS", "14.5", 5, "itopnews-ios-ipados-14-5-pb5"],
  ["iPadOS", "14.5", 5, "itopnews-ios-ipados-14-5-pb5"],
  ["iOS", "14.5", 6, "osxd-ios-ipados-14-5-pb6"],
  ["iPadOS", "14.5", 6, "osxd-ios-ipados-14-5-pb6"],
  ["iOS", "14.6", 2, "osxd-ios-ipados-14-6-pb2"],
  ["iPadOS", "14.6", 2, "osxd-ios-ipados-14-6-pb2"],
] as const) {
  addExactEvidence(platform, version, [sequence], sourceId);
}

const overclaimedCandidateMacRumorsSourceIds = [
  "mr-ios-12-1-pb2",
  "mr-ios-12-1-pb3",
  "mr-ios-12-1-pb4",
  "mr-ios-12-1-pb5",
  "mr-ios-12-1-1-pb2",
  "mr-ios-12-1-1-pb3",
  "mr-ios-12-1-3-pb2",
  "mr-ios-12-1-3-pb3",
  "mr-ios-12-2-pb4",
  "mr-ios-12-2-pb5",
  "mr-ios-12-2-pb6",
  "mr-ios-12-3-pb4",
  "mr-ios-12-3-pb5",
  "mr-ios-12-3-pb6",
  "mr-ios-12-4-pb2",
  "mr-ios-12-4-pb3",
  "mr-13-1-pb2",
  "mr-13-2-pb1",
  "mr-13-2-pb2",
  "mr-13-2-pb3",
  "mr-13-2-pb4",
  "mr-13-3-pb2",
  "mr-13-4-pb3",
  "mr-13-4-pb4",
  "mr-13-4-pb5",
  "mr-13-5-pb2",
  "mr-13-5-pb3",
  "mr-13-6-pb2",
  "mr-13-6-pb3",
  "mr-13-7-pb1",
  "mr-14-3-pb3",
  "mr-14-4-pb2",
  "mr-14-5-pb4",
  "mr-14-5-pb5",
  "mr-14-5-pb6",
  "mr-14-5-pb7",
  "mr-14-5-pb8",
  "mr-14-6-pb3",
];

const overclaimedRetainedMacRumorsSourceIds = [
  "mr-13-3-pb3",
  "mr-14-6-pb2",
  "mr-14-7-dev2",
  "mr-14-7-pb3",
  "mr-14-7-pb4",
  "mr-ios-12-4-dev4",
  "mr-ios-12-4-dev5",
  "mr-ios-12-4-dev6",
];

async function verifyPacketLocks() {
  const lockPath = path.join(here, "packet-locks.json");
  const lockBytes = await readFile(lockPath);
  const lock = JSON.parse(lockBytes.toString("utf8")) as {
    files: Array<{path: string; bytes: number; sha256: string}>;
  };
  const failures: Array<{
    path: string;
    expectedBytes: number;
    actualBytes: number;
    expectedSha256: string;
    actualSha256: string;
  }> = [];
  let verifiedBytes = 0;
  for (const entry of lock.files) {
    const bytes = await readFile(path.join(workspaceRoot, entry.path));
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    verifiedBytes += bytes.byteLength;
    if (bytes.byteLength !== entry.bytes || sha256 !== entry.sha256) {
      failures.push({
        path: entry.path,
        expectedBytes: entry.bytes,
        actualBytes: bytes.byteLength,
        expectedSha256: entry.sha256,
        actualSha256: sha256,
      });
    }
  }
  return {
    packetLocksPath: path.relative(workspaceRoot, lockPath),
    packetLocksSha256: createHash("sha256").update(lockBytes).digest("hex"),
    declaredMaterialFileCount: lock.files.length,
    verifiedMaterialFileCount: lock.files.length - failures.length,
    verifiedBytes,
    byteFailures: failures.filter(
      (failure) => failure.expectedBytes !== failure.actualBytes,
    ).length,
    sha256Failures: failures.filter(
      (failure) => failure.expectedSha256 !== failure.actualSha256,
    ).length,
    allPacketArtifactHashesReproduced: failures.length === 0,
    failures,
  };
}

async function queryProduction() {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const allParentIds = [...new Set(targetVersionIds)];
  const [versions, targetEvents, platformPublicBetaCounts, totalReleaseEvents] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $allParentIds] | order(_id asc) {
          _id,
          version,
          releaseStatus,
          publicReleaseDate,
          "platform": releaseTrain->platform->name,
          "train": releaseTrain->displayName
        }`,
        {allParentIds},
      ),
      client.fetch(
        `*[_type == "releaseEvent" && releaseVersion._ref in $allParentIds]
          | order(releaseVersion->version asc, appearanceDate asc, sequence asc) {
            _id,
            stableEventId,
            "releaseVersionId": releaseVersion._ref,
            "platform": platform->name,
            "version": releaseVersion->version,
            label,
            "routeAlias": routeAlias.current,
            channel,
            appearanceDate,
            sequence,
            isRevision,
            availabilityState
          }`,
        {allParentIds},
      ),
      client.fetch(
        `{
          "iOS": count(*[_type == "releaseEvent" && platform->name == "iOS" && channel == "publicBeta"]),
          "iPadOS": count(*[_type == "releaseEvent" && platform->name == "iPadOS" && channel == "publicBeta"])
        }`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const events = targetEvents as ProductionEvent[];
  const exactChecks = allObservedAppearances.map((identity) => {
    const routeIdentityMatches = events.filter(
      (event) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === "publicBeta" &&
        event.routeAlias === identity.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event) =>
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate &&
        event.label === identity.label,
    );
    return {
      candidateId: identity.candidateId,
      expectedProductionExisting: Boolean(identity.productionExisting),
      releaseVersionId: identity.releaseVersionId,
      routeAlias: identity.routeAlias,
      label: identity.label,
      sequence: identity.sequence,
      appearanceDate: identity.appearanceDate,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatchingEventIds: routeIdentityMatches.map(
        (event) => event._id,
      ),
      fullCandidateMatchingEventIds: fullCandidateMatches.map(
        (event) => event._id,
      ),
    };
  });

  const versionById = new Map(
    (versions as Array<{_id: string}>).map((version) => [version._id, version]),
  );

  return {
    queriedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    totalReleaseEvents,
    platformPublicBetaCounts,
    scopedReleaseEventCount: events.length,
    scopedPublicBetaEventCount: events.filter(
      (event) => event.channel === "publicBeta",
    ).length,
    exactObservedIdentityCount: exactChecks.reduce(
      (sum, check) => sum + check.fullCandidateMatchCount,
      0,
    ),
    exactChecks,
    parentChecks: allParentIds.map((releaseVersionId) => ({
      releaseVersionId,
      exists: versionById.has(releaseVersionId),
      document: versionById.get(releaseVersionId) ?? null,
    })),
    scopedPublicBetaEvents: events.filter(
      (event) => event.channel === "publicBeta",
    ),
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
  };
}

function buildCandidateReviews(
  productionRecheck: Awaited<ReturnType<typeof queryProduction>>,
) {
  const productionCheckById = new Map(
    productionRecheck.exactChecks.map((check) => [check.candidateId, check]),
  );
  return candidatePacket.candidates.map((candidate) => {
    const originalSourceIds = candidate.evidenceRefs.map(
      (reference) => reference.sourceId,
    );
    const usableExactSourceIds =
      exactEvidenceByCandidateId.get(candidate.candidateId) ?? [];
    const originalUsableExactSourceIds = originalSourceIds.filter((sourceId) =>
      usableExactSourceIds.includes(sourceId),
    );
    const availableSupplementalSourceIds = usableExactSourceIds.filter(
      (sourceId) => !originalSourceIds.includes(sourceId),
    );
    const supplementalSourceIds =
      originalUsableExactSourceIds.length >= 2
        ? []
        : availableSupplementalSourceIds.slice(
            0,
            2 - originalUsableExactSourceIds.length,
          );
    const selectedExactSourceIds = [
      ...originalUsableExactSourceIds,
      ...supplementalSourceIds,
    ].slice(0, 2);
    const publisherFamilies = [
      ...new Set(
        selectedExactSourceIds.map(
          (sourceId) => sourceById.get(sourceId)!.lineage.publisherFamily,
        ),
      ),
    ];
    const approved =
      selectedExactSourceIds.length >= 2 && publisherFamilies.length >= 2;
    const acceptedEvidenceRefs = usableExactSourceIds.map((sourceId) => ({
      packetPath: packetSourcePath,
      sourceId,
      publisherFamily: sourceById.get(sourceId)!.lineage.publisherFamily,
      reason:
        "The retained source independently establishes the exact platform, version, public ordinal, and America/Los_Angeles date.",
    }));
    const excludedEvidenceRefs = originalSourceIds
      .filter((sourceId) => !usableExactSourceIds.includes(sourceId))
      .map((sourceId) => {
        let reason =
          "The retained source does not independently establish the full exact identity at platform, version, public ordinal, and Pacific-date grain.";
        if (overclaimedCandidateMacRumorsSourceIds.includes(sourceId)) {
          reason =
            "The numeral identifies a developer beta; a generic public-beta availability update does not prove the public ordinal.";
        } else if (sourceId === "corriente-13-7-pb1") {
          reason =
            "The source establishes an unnumbered public beta, not displayed ordinal Public Beta 1.";
        } else if (
          sourceId === "iculture-ios-12-1-1" ||
          sourceId === "iculture-ios-12-3" ||
          sourceId === "iculture-ios-14-7"
        ) {
          reason =
            "The relevant rolling-history row uses a next-day local calendar date and does not independently establish the candidate's prior America/Los_Angeles date.";
        }
        return {
          packetPath: packetSourcePath,
          sourceId,
          publisherFamily: sourceById.get(sourceId)!.lineage.publisherFamily,
          reason,
        };
      });
    const productionCheck = productionCheckById.get(candidate.candidateId);
    if (!productionCheck || productionCheck.fullCandidateMatchCount !== 0) {
      throw new Error(
        `Fresh production state drifted for candidate ${candidate.candidateId}`,
      );
    }
    return {
      candidateId: candidate.candidateId,
      platform: candidate.platform,
      version: candidate.version,
      releaseVersionId: candidate.releaseVersionId,
      sequence: candidate.proposedIdentity.sequence,
      appearanceDate: candidate.proposedIdentity.appearanceDate,
      disposition: approved
        ? supplementalSourceIds.length
          ? "chronologyApprovedAfterPacketSupplement"
          : "chronologyApprovedAsSubmitted"
        : "blockedInsufficientExactClaimLevelEvidence",
      usableExactLineageCount: new Set(
        usableExactSourceIds.map(
          (sourceId) => sourceById.get(sourceId)!.lineage.publisherFamily,
        ),
      ).size,
      selectedExactSourceIds,
      publisherFamilies,
      originalSourceIds,
      originalUsableExactSourceIds,
      supplementalSourceIds,
      acceptedEvidenceRefs,
      selectedCorroboratingEvidenceRefs: selectedExactSourceIds.map(
        (sourceId) => ({
          packetPath: packetSourcePath,
          sourceId,
        }),
      ),
      excludedEvidenceRefs,
      otherVerifiedExactSourceIds: usableExactSourceIds.filter(
        (sourceId) => !selectedExactSourceIds.includes(sourceId),
      ),
      blocker: approved
        ? null
        : "Fewer than two independent retained source lineages establish the exact platform, version, public ordinal, and America/Los_Angeles date.",
      productionReconciliation: {
        status: "confirmedMissing",
        queriedAt: productionRecheck.queriedAt,
        exactIdentityMatches: productionCheck.fullCandidateMatchCount,
      },
    };
  });
}

async function buildReview() {
  const [productionRecheck, lockedFileVerification] = await Promise.all([
    queryProduction(),
    verifyPacketLocks(),
  ]);
  if (!lockedFileVerification.allPacketArtifactHashesReproduced) {
    throw new Error("Frozen packet lock verification failed");
  }
  const candidateReviews = buildCandidateReviews(productionRecheck);
  const approvedCandidates = candidateReviews.filter((candidate) =>
    candidate.disposition.startsWith("chronologyApproved"),
  );
  const blockedCandidates = candidateReviews.filter(
    (candidate) =>
      candidate.disposition === "blockedInsufficientExactClaimLevelEvidence",
  );
  const supplementedCandidates = approvedCandidates.filter(
    (candidate) => candidate.supplementalSourceIds.length > 0,
  );
  const supplementMappings = supplementedCandidates.flatMap((candidate) =>
    candidate.supplementalSourceIds.map((sourceId) => ({
      candidateId: candidate.candidateId,
      packetPath: packetSourcePath,
      sourceId,
      publisherFamily: sourceById.get(sourceId)!.lineage.publisherFamily,
      purpose:
        "Supplies a missing exact claim-level lineage at platform, version, public ordinal, and Pacific-date grain.",
    })),
  );
  const affectedCandidateIds = candidatePacket.candidates
    .filter((candidate) =>
      candidate.evidenceRefs.some((reference) =>
        overclaimedCandidateMacRumorsSourceIds.includes(reference.sourceId),
      ),
    )
    .map((candidate) => candidate.candidateId);
  const existingChecks = productionRecheck.exactChecks.filter(
    (check) => check.expectedProductionExisting,
  );
  if (
    candidateReviews.length !== 116 ||
    approvedCandidates.length !== 76 ||
    blockedCandidates.length !== 40 ||
    existingChecks.length !== 2 ||
    existingChecks.some((check) => check.fullCandidateMatchCount !== 1)
  ) {
    throw new Error("Independent-review invariants failed");
  }

  return {
    formatVersion: 1,
    batchId,
    status: "completedPartialApproval",
    reviewedAt: productionRecheck.queriedAt,
    reviewer: "codex-independent-review-ios-ipados-point-12-14",
    independentOfResearcher: true,
    verdict:
      "approved76CandidatesBlocked40AndQualifiedNegativeAndModelGapClaims",
    summary: {
      candidateCount: candidateReviews.length,
      chronologyApprovedCandidateCount: approvedCandidates.length,
      chronologyApprovedAsSubmittedCount: approvedCandidates.filter(
        (candidate) =>
          candidate.disposition === "chronologyApprovedAsSubmitted",
      ).length,
      chronologyApprovedAfterSupplementCount: supplementedCandidates.length,
      blockedCandidateCount: blockedCandidates.length,
      supplementMappingCount: supplementMappings.length,
      exactExistingMatchCount: existingChecks.length,
      approvedNegativeFindingCount: 6,
      blockedNegativeFindingCount: 1,
      modelGapCount: 2,
      finding:
        "Seventy-six of 116 missing candidate identities have two exact independent retained lineages. Forty remain blocked because publisher-count validation admitted source records that did not independently prove the public ordinal and Pacific date.",
    },
    candidateDisposition: {
      chronologyApprovedCandidateIds: approvedCandidates.map(
        (candidate) => candidate.candidateId,
      ),
      blockedCandidateIds: blockedCandidates.map(
        (candidate) => candidate.candidateId,
      ),
    },
    lockedFileVerification,
    checks: {
      packetJsonParsed: true,
      allOneHundredSixteenCandidatesInspected: true,
      allOneHundredTwentyTwoRetainedSourceRecordsInspected: true,
      allThirteenConflictsAdjudicated: true,
      allSevenNegativeFindingsAdjudicated: true,
      bothExistingMatchesRechecked: true,
      bothModelGapsRechecked: true,
      publicOrdinalsNotDerivedFromDeveloperOrdinals: true,
      publisherFamilyCountNotTreatedAsClaimProof: true,
      localCalendarDatesNormalizedToAmericaLosAngeles: true,
      freshProductionQueryPerformed: true,
      freshProductionQueryUsedCdn: productionRecheck.useCdn,
      freshProductionPerspective: productionRecheck.perspective,
      sanityMutationPerformed: false,
      productionIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
    productionRecheck: {
      ...productionRecheck,
      finding:
        "Published production remains unchanged: the 116 proposed candidate identities are absent, the two iOS/iPadOS 14.5 Public Beta 3 identities remain exact existing matches, and version-ipados-14-7 plus version-ipados-14-8 remain absent.",
    },
    sourceReferenceAndLineageAudit: {
      candidateMappingsReviewed: candidateReviews.length,
      candidatesWithTwoExactIndependentLineages: approvedCandidates.length,
      candidatesWithFewerThanTwoExactIndependentLineages:
        blockedCandidates.length,
      overclaimedMacRumorsCandidateSourceCount:
        overclaimedCandidateMacRumorsSourceIds.length,
      overclaimedMacRumorsRetainedSourceCount:
        overclaimedRetainedMacRumorsSourceIds.length,
      affectedCandidateCount: affectedCandidateIds.length,
      finding:
        "A developer-beta numeral plus a generic public-beta availability update does not establish a public-beta ordinal. Exact lineage counts were recalculated from the retained claim text, not from the source ledger's declared roles.",
    },
    sourceLocatorFindings: [
      {
        findingId: "developer-numeral-generic-public-update-overclaim",
        severity: "material",
        affectedCandidateCount: affectedCandidateIds.length,
        affectedCandidateIds,
        sourceIds: overclaimedCandidateMacRumorsSourceIds,
        additionalRetainedSourceIds:
          overclaimedRetainedMacRumorsSourceIds,
        finding:
          "Thirty-eight candidate-linked and eight additional retained MacRumors records do not prove the asserted public ordinal. Their numeral identifies a developer seed, while the public update is generic or absent.",
      },
      {
        findingId: "unNumbered-ios-ipados-13-7-public-appearance",
        severity: "material",
        affectedCandidateIds: [
          "candidate:apple:ios:13.7:public-beta-1",
          "candidate:apple:ipados:13.7:public-beta-1",
        ],
        sourceIds: ["mr-13-7-pb1", "corriente-13-7-pb1"],
        finding:
          "CoRRiENTE establishes public availability but does not display ordinal 1; MacRumors supplies a developer ordinal plus a generic public update. Neither candidate has one exact ordinal lineage, let alone two.",
      },
      {
        findingId: "local-next-day-rows-not-pacific-date-lineages",
        severity: "qualification",
        sourceIds: [
          "iculture-ios-12-1-1",
          "iculture-ios-12-3",
          "iculture-ios-14-3",
          "iculture-ios-14-7",
        ],
        finding:
          "Rows displaying November 8/16, April 30, November 18/December 3, June 30, or July 9 are retained as local-calendar qualifications. They do not independently prove the prior America/Los_Angeles date.",
      },
      {
        findingId: "rolling-history-platform-row-omissions",
        severity: "material",
        sourceIds: [
          "iculture-ios-14-5",
          "iculture-ios-14-7",
          "imore-ipados14-history",
        ],
        finding:
          "iCulture omits explicit iPadOS 14.5 Public Beta 5/6 and iPadOS 14.7 Public Beta 5 rows, while iMore omits iPadOS 14.7 Public Beta 3. Generic same-build wording was not promoted into missing platform/public-ordinal claims.",
      },
      {
        findingId: "rolling-history-internal-copy-conflicts",
        severity: "qualification",
        sourceIds: [
          "imore-ios12-history",
          "imore-ios14-history",
          "imore-ipados14-history",
        ],
        finding:
          "The dated iMore update headings explicitly identify iOS 12.1 PB5 and the 14.7 public ordinals, but copied paragraphs contain obvious PB11/14.6 template errors. Only the exact dated headings are admitted. iOS 12.3 PB3's April 22 row and both 14.6 PB3 May 11 rows conflict with the reviewed Pacific dates and are excluded.",
      },
      {
        findingId: "retained-exact-supplements",
        severity: "resolved",
        supplementMappingCount: supplementMappings.length,
        mappings: supplementMappings,
        finding:
          "Retained packet sources not already referenced on a candidate were used only where their own text independently establishes the full exact identity.",
      },
    ],
    mandatoryQualifications: [
      {
        qualificationId: "blocked-candidates-remain-nonimplementable",
        appliesToCandidateIds: blockedCandidates.map(
          (candidate) => candidate.candidateId,
        ),
        requirement:
          "Do not create these forty events until a follow-up packet supplies a second exact independent lineage for each identity.",
      },
      {
        qualificationId: "ios-12-4-public-beta-4-date",
        appliesToCandidateIds: [
          "candidate:apple:ios:12.4:public-beta-4",
        ],
        requirement:
          "Use 2019-06-12. Gadget Hacks and Forbes explicitly place Public Beta 4 one day after the June 11 developer seed; preserve iCulture's June 11 disagreement as provenance.",
      },
      {
        qualificationId: "purudo-pacific-date-normalization",
        appliesToCandidateIds: [
          "candidate:apple:ios:14.4:public-beta-2",
          "candidate:apple:ipados:14.4:public-beta-2",
        ],
        requirement:
          "Purudo's January 14 Japanese date normalizes to January 13 in America/Los_Angeles. It is usable for iOS, but the iPadOS candidate still lacks a second exact lineage.",
      },
      {
        qualificationId: "ios-ipados-14-6-public-beta-3",
        appliesToCandidateIds: [
          "candidate:apple:ios:14.6:public-beta-3",
          "candidate:apple:ipados:14.6:public-beta-3",
        ],
        requirement:
          "Retain 2021-05-10 as the supported Pacific date, but do not implement either identity: iMore reports May 11 and MacRumors does not prove the public ordinal.",
      },
      {
        qualificationId: "existing-ios-ipados-14-5-public-beta-3",
        appliesToExistingCandidateIds: existingChecks.map(
          (check) => check.candidateId,
        ),
        requirement:
          "The two exact production events must remain excluded from creation. Never create duplicates.",
      },
      {
        qualificationId: "imore-dated-heading-only",
        appliesToCandidateIds: [
          "candidate:apple:ios:12.1:public-beta-5",
          "candidate:apple:ios:14.7:public-beta-3",
          "candidate:apple:ios:14.7:public-beta-4",
          "candidate:apple:ios:14.7:public-beta-5",
        ],
        requirement:
          "Use only the explicit dated iMore update headings as chronology evidence. Do not carry the copied PB11 or 14.6 paragraph text into records or citations; PB4 remains blocked despite its heading.",
      },
      {
        qualificationId: "ipados-14-7-parent-and-evidence-gap",
        appliesToExpectedParentId: "version-ipados-14-7",
        requirement:
          "The parent is still absent. PB1 and PB5 are exact at two-lineage grain; PB3 and PB4 are not. Any future parent or event work requires separate authorization and follow-up evidence.",
      },
      {
        qualificationId: "ipados-14-8-parent-and-negative-gap",
        appliesToExpectedParentId: "version-ipados-14-8",
        requirement:
          "The parent is still absent and the final release is historically established, but the combined iOS/iPadOS no-beta assertion lacks two exact platform-specific lineages.",
      },
    ],
    conflictReviews: [
      {
        conflictId: "ios-12-4-public-beta-4-date",
        disposition: "approvedProposedResolution",
        finding:
          "Use June 12 for the public event; June 11 is the developer seed. Gadget Hacks and Forbes are two exact independent public-date lineages.",
      },
      {
        conflictId: "ios-12-4-no-public-beta-1",
        disposition: "approvedNegativeFinding",
        finding:
          "Gadget Hacks explicitly states that no Public Beta 1 shipped, and the independent iCulture cycle begins at PB2.",
      },
      {
        conflictId: "ios-12-1-3-rename",
        disposition: "approvedNegativeFinding",
        finding:
          "Preserve the 12.1.2 PB1 label; do not synthesize 12.1.3 PB1.",
      },
      {
        conflictId: "ios-ipados-13-5-legacy-label",
        disposition: "approvedNegativeFinding",
        finding:
          "Preserve 13.4.5 PB1 as the legacy label; exact 13.5 public numbering begins at PB2.",
      },
      {
        conflictId: "ios-ipados-13-6-legacy-label",
        disposition: "approvedNegativeFinding",
        finding:
          "Preserve 13.5.5 PB1 as the legacy label; exact 13.6 public numbering begins at PB2.",
      },
      {
        conflictId: "ios-ipados-14-1-no-beta-cycle",
        disposition: "approvedNegativeFindingAfterSupplement",
        finding:
          "9to5Mac and the retained iMore public histories support the jump to 14.2, while MacRumors confines 14.1 GM availability to developers.",
      },
      {
        conflictId: "ios-ipados-14-7-public-beta-2-withheld",
        disposition: "approvedNegativeFinding",
        finding:
          "Independent public histories preserve the ordinal gap and the developer-only PB2 boundary. Do not synthesize a public PB2.",
      },
      {
        conflictId: "ios-ipados-14-8-released-without-beta",
        disposition: "blockedInsufficientExactNegativeEvidence",
        finding:
          "9to5Mac explicitly states that iOS 14.8 was not beta tested. MacRumors establishes the final iOS/iPadOS release but does not independently establish the no-beta claim, especially at iPadOS platform grain.",
      },
      {
        conflictId: "ios-ipados-local-calendar-rollovers",
        disposition: "approvedAsQualificationOnly",
        finding:
          "Pacific dates remain canonical; next-day local rows do not count as exact Pacific-date corroboration.",
      },
      {
        conflictId: "ios-ipados-14-6-public-beta-3-date",
        disposition: "dateUpheldCandidatesBlocked",
        finding:
          "May 10 is retained from Pacific-timed sources, but both candidates remain blocked because only iCulture proves the full public identity at that date.",
      },
      {
        conflictId: "ios-ipados-14-5-existing-public-beta-3",
        disposition: "existingMatchesRetained",
        finding:
          "Both exact production identities still exist once and remain excluded from creation.",
      },
      {
        conflictId: "ipados-14-7-parent-model-gap",
        disposition: "parentGapConfirmedChronologyPartiallyApproved",
        finding:
          "The parent is absent. PB1 and PB5 have two exact lineages; PB3 and PB4 do not.",
      },
      {
        conflictId: "ipados-14-8-parent-model-gap",
        disposition: "parentGapConfirmedNoBetaClaimBlocked",
        finding:
          "The parent remains absent and the final release is established, but the no-beta boundary requires another exact platform-specific lineage.",
      },
    ],
    negativeFindingReviews: [
      {
        findingId: "negative:ios:12.1.3:public-beta-1",
        disposition: "approved",
      },
      {
        findingId: "negative:ios:12.4:public-beta-1",
        disposition: "approved",
      },
      {
        findingId: "negative:ios-ipados:13.5:public-beta-1",
        disposition: "approved",
      },
      {
        findingId: "negative:ios-ipados:13.6:public-beta-1",
        disposition: "approved",
      },
      {
        findingId: "negative:ios-ipados:14.1:any-public-beta",
        disposition: "approvedAfterPacketSupplement",
        supplementalSourceIds: [
          "imore-ios14-history",
          "imore-ipados14-history",
        ],
      },
      {
        findingId: "negative:ios-ipados:14.7:public-beta-2",
        disposition: "approved",
      },
      {
        findingId: "negative:ios-ipados:14.8:any-beta",
        disposition: "blockedInsufficientExactNegativeEvidence",
      },
    ],
    existingMatchReviews: existingChecks.map((check) => ({
      candidateId: check.candidateId,
      disposition: "retainExactExistingMatchExcludeFromCreation",
      appearanceDate: check.appearanceDate,
      eventIds: check.fullCandidateMatchingEventIds,
      exactMatchCount: check.fullCandidateMatchCount,
    })),
    modelGapReviews: [
      {
        platform: "iPadOS",
        version: "14.7",
        expectedReleaseVersionId: "version-ipados-14-7",
        parentDisposition: "confirmedMissing",
        chronologyDisposition: "partiallyApproved",
        approvedAppearances: [
          {
            sequence: 1,
            appearanceDate: "2021-05-20",
            exactSourceIds: [
              "mr-14-7-pb1",
              "iculture-ios-14-7",
              "imore-ipados14-history",
            ],
          },
          {
            sequence: 5,
            appearanceDate: "2021-07-08",
            exactSourceIds: [
              "mr-14-7-pb5",
              "imore-ipados14-history",
            ],
          },
        ],
        blockedAppearances: [
          {
            sequence: 3,
            appearanceDate: "2021-06-15",
            usableExactSourceIds: ["iculture-ios-14-7"],
          },
          {
            sequence: 4,
            appearanceDate: "2021-06-29",
            usableExactSourceIds: ["imore-ipados14-history"],
          },
        ],
      },
      {
        platform: "iPadOS",
        version: "14.8",
        expectedReleaseVersionId: "version-ipados-14-8",
        parentDisposition: "confirmedMissing",
        finalReleaseDisposition: "historicallyEstablished",
        noBetaDisposition: "blockedInsufficientExactNegativeEvidence",
      },
    ],
    supplementMappings,
    candidateReviews,
    safety: {
      researchAndReviewOnly: true,
      sanityMutationAllowed: false,
      sanityMutationPerformed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationEligibleCandidateCount: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
      authorizationRequiredForAnyImplementation: true,
    },
  };
}

async function run() {
  const review = await buildReview();
  if (!writeReview) {
    console.log(
      `@@INDEPENDENT_REVIEW_START@@\n${JSON.stringify(
        review,
        null,
        2,
      )}\n@@INDEPENDENT_REVIEW_END@@`,
    );
    return;
  }
  const reviewPath = path.join(here, "independent-review.json");
  await writeFile(reviewPath, `${JSON.stringify(review, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(workspaceRoot, reviewPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
