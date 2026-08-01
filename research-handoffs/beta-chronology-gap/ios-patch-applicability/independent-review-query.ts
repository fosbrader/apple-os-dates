import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { getCliClient } from "sanity/cli";

const packetDir =
  "research-handoffs/beta-chronology-gap/ios-patch-applicability";

type Candidate = {
  candidateId: string;
  releaseVersionId: string;
  proposedIdentity: {
    label: string;
    routeAlias: string;
    channel: "publicBeta";
    appearanceDate: string;
    sequence: number;
  };
};

const sha256 = (value: Buffer | string): string =>
  createHash("sha256").update(value).digest("hex");

async function run(): Promise<void> {
  const [assignmentBytes, candidatesBytes] = await Promise.all([
    readFile(`${packetDir}/assignment.json`),
    readFile(`${packetDir}/candidates.json`),
  ]);
  const assignment = JSON.parse(assignmentBytes.toString("utf8")) as {
    targetVersionIds: string[];
  };
  const candidatesLedger = JSON.parse(candidatesBytes.toString("utf8")) as {
    candidates: Candidate[];
  };
  const targetVersionIds = [...assignment.targetVersionIds].sort();
  const candidates = candidatesLedger.candidates;

  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, scopedEvents, totalReleaseEvents, iosPublicBetaEvents] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds]
          | order(_id asc) {
            _id,
            version,
            releaseStatus,
            publicReleaseDate,
            "platform": releaseTrain->platform->name,
            "train": releaseTrain->displayName
          }`,
        { targetVersionIds },
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
        { targetVersionIds },
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
      client.fetch(
        `count(*[
          _type == "releaseEvent" &&
          platform->name == "iOS" &&
          channel == "publicBeta"
        ])`,
      ),
    ]);

  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: versions.some(
      (version: { _id: string }) => version._id === releaseVersionId,
    ),
    document:
      versions.find(
        (version: { _id: string }) => version._id === releaseVersionId,
      ) ?? null,
  }));
  const exactChecks = candidates.map((candidate) => {
    const expected = {
      candidateId: candidate.candidateId,
      releaseVersionId: candidate.releaseVersionId,
      ...candidate.proposedIdentity,
    };
    const routeIdentityMatches = scopedEvents.filter(
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
      (event: { label: string; sequence: number; appearanceDate: string }) =>
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
    batchId: "ios-patch-applicability-2026-07-31",
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    reviewedAssignmentSha256: sha256(assignmentBytes),
    reviewedCandidatesSha256: sha256(candidatesBytes),
    targetVersionIds,
    candidateCount: candidates.length,
    parentChecks,
    versions,
    scopedEvents,
    exactChecks,
    productionCounts: {
      totalReleaseEvents,
      iosPublicBetaEventsAllVersions: iosPublicBetaEvents,
      scopedReleaseEvents: scopedEvents.length,
      scopedPublicBetaEvents: scopedEvents.filter(
        (event: { channel: string }) => event.channel === "publicBeta",
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
    queryScript: `${packetDir}/independent-review-query.ts`,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
  };

  await writeFile(
    `${packetDir}/independent-review-production-snapshot.json`,
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  console.log(
    JSON.stringify(
      {
        capturedAt: snapshot.capturedAt,
        candidateCount: snapshot.candidateCount,
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
