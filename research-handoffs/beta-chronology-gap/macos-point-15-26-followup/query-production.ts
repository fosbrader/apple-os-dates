import {getCliClient} from "sanity/cli";
import {readFile, writeFile} from "node:fs/promises";

const batchId = "beta-chronology-gap-macos-point-15-26-followup";
const packetDir =
  "research-handoffs/beta-chronology-gap/macos-point-15-26-followup";
const parentDir =
  "research-handoffs/beta-chronology-gap/macos-point-15-26";

type Candidate = {
  candidateId: string;
  version: string;
  releaseVersionId: string;
  proposedIdentity: {
    label: string;
    routeAlias: string;
    channel: "publicBeta";
    appearanceDate: string;
    sequence: number;
  };
};

async function readJson(path: string): Promise<any> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function run(): Promise<void> {
  const [parentReview, parentCandidatesLedger] = await Promise.all([
    readJson(`${parentDir}/independent-review.json`),
    readJson(`${parentDir}/candidates.json`),
  ]);
  const blockedIds = new Set<string>(
    parentReview.candidateDisposition.blockedCandidateIds,
  );
  const targets: Candidate[] = parentCandidatesLedger.candidates.filter(
    (candidate: Candidate) => blockedIds.has(candidate.candidateId),
  );
  if (targets.length !== 8) {
    throw new Error(`Expected 8 frozen parent targets, found ${targets.length}.`);
  }

  const targetVersionIds = [
    ...new Set(targets.map((target) => target.releaseVersionId)),
  ].sort();
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, macOSPublicBetaCount, totalReleaseEventCount] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds] | order(version asc) {
          _id,
          version,
          releaseStatus,
          publicReleaseDate,
          "platform": releaseTrain->platform->name,
          "train": releaseTrain->displayName
        }`,
        {targetVersionIds},
      ),
      client.fetch(
        `*[_type == "releaseEvent" && releaseVersion._ref in $targetVersionIds]
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
        {targetVersionIds},
      ),
      client.fetch(
        `count(*[_type == "releaseEvent" && platform->name == "macOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: versions.some(
      (version: {_id: string}) => version._id === releaseVersionId,
    ),
    document:
      versions.find(
        (version: {_id: string}) => version._id === releaseVersionId,
      ) ?? null,
  }));
  const exactChecks = targets.map((candidate) => {
    const expected = {
      candidateId: candidate.candidateId,
      version: candidate.version,
      releaseVersionId: candidate.releaseVersionId,
      ...candidate.proposedIdentity,
    };
    const routeIdentityMatches = targetEvents.filter(
      (event: {
        releaseVersionId: string;
        channel: string;
        routeAlias: string;
      }) =>
        event.releaseVersionId === expected.releaseVersionId &&
        event.channel === expected.channel &&
        event.routeAlias === expected.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event: {
        label: string;
        sequence: number;
        appearanceDate: string;
      }) =>
        event.label === expected.label &&
        event.sequence === expected.sequence &&
        event.appearanceDate === expected.appearanceDate,
    );
    return {
      ...expected,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatches,
      fullCandidateMatches,
    };
  });

  const snapshot = {
    formatVersion: 1,
    batchId,
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetCandidateCount: targets.length,
    targetVersionIds,
    productionCounts: {
      totalReleaseEvents: totalReleaseEventCount,
      macOSPublicBetaEventsAllVersions: macOSPublicBetaCount,
      scopedReleaseEvents: targetEvents.length,
      scopedPublicBetaEvents: targetEvents.filter(
        (event: {channel: string}) => event.channel === "publicBeta",
      ).length,
      exactRouteMatches: exactChecks.reduce(
        (sum, check) => sum + check.routeIdentityMatchCount,
        0,
      ),
      exactFullMatches: exactChecks.reduce(
        (sum, check) => sum + check.fullCandidateMatchCount,
        0,
      ),
    },
    parentChecks,
    versions,
    scopedEvents: targetEvents,
    exactChecks,
    queryScript: `${packetDir}/query-production.ts`,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
  };
  await writeFile(
    `${packetDir}/production-snapshot.json`,
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  console.log(
    JSON.stringify(
      {
        capturedAt: snapshot.capturedAt,
        targetCandidateCount: snapshot.targetCandidateCount,
        targetParentCount: snapshot.parentChecks.length,
        missingParents: snapshot.parentChecks
          .filter((check) => !check.exists)
          .map((check) => check.releaseVersionId),
        productionCounts: snapshot.productionCounts,
      },
      null,
      2,
    ),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
