import {getCliClient} from "sanity/cli";
import {readFile} from "node:fs/promises";

const packetPath =
  "research-handoffs/beta-chronology-gap/macos-point-15-26/candidates.json";

type Candidate = {
  candidateId: string;
  releaseVersionId: string;
  proposedIdentity: {
    channel: string;
    routeAlias: string;
    label: string;
    sequence: number;
    appearanceDate: string;
  };
};

async function run(): Promise<void> {
  const packet = JSON.parse(await readFile(packetPath, "utf8")) as {
    candidates: Candidate[];
  };
  const candidates = packet.candidates;
  const targetVersionIds = [...new Set(
    candidates.map((candidate) => candidate.releaseVersionId),
  )];

  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [parents, scopedEvents, totalReleaseEvents, macOSPublicBetaEvents] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds] {
          _id,
          version,
          releaseStatus,
          publicReleaseDate,
          "platform": releaseTrain->platform->name
        }`,
        {targetVersionIds},
      ),
      client.fetch(
        `*[_type == "releaseEvent" && releaseVersion._ref in $targetVersionIds] {
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
      client.fetch(`count(*[_type == "releaseEvent"])`),
      client.fetch(
        `count(*[
          _type == "releaseEvent" &&
          platform->name == "macOS" &&
          channel == "publicBeta"
        ])`,
      ),
    ]);

  const exactChecks = candidates.map((candidate) => {
    const identity = candidate.proposedIdentity;
    const routeMatches = scopedEvents.filter(
      (event: {
        releaseVersionId: string;
        channel: string;
        routeAlias: string;
      }) =>
        event.releaseVersionId === candidate.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const fullMatches = routeMatches.filter(
      (event: {
        label: string;
        sequence: number;
        appearanceDate: string;
      }) =>
        event.label === identity.label &&
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate,
    );
    return {
      candidateId: candidate.candidateId,
      releaseVersionId: candidate.releaseVersionId,
      routeAlias: identity.routeAlias,
      label: identity.label,
      sequence: identity.sequence,
      appearanceDate: identity.appearanceDate,
      routeIdentityMatchCount: routeMatches.length,
      fullCandidateMatchCount: fullMatches.length,
      routeIdentityMatchingEventIds: routeMatches.map(
        (event: {_id: string}) => event._id,
      ),
      fullCandidateMatchingEventIds: fullMatches.map(
        (event: {_id: string}) => event._id,
      ),
    };
  });

  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: parents.some(
      (parent: {_id: string}) => parent._id === releaseVersionId,
    ),
  }));

  console.log(JSON.stringify({
    queriedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    expectedIdentityCount: candidates.length,
    targetVersionCount: targetVersionIds.length,
    productionCounts: {
      totalReleaseEvents,
      macOSPublicBetaEventsAllVersions: macOSPublicBetaEvents,
      scopedReleaseEvents: scopedEvents.length,
      scopedPublicBetaEvents: scopedEvents.filter(
        (event: {channel: string}) => event.channel === "publicBeta",
      ).length,
      exactRouteMatches: exactChecks.reduce(
        (total, check) => total + check.routeIdentityMatchCount,
        0,
      ),
      exactFullMatches: exactChecks.reduce(
        (total, check) => total + check.fullCandidateMatchCount,
        0,
      ),
    },
    parentChecks,
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
    },
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
