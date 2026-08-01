import {getCliClient} from "sanity/cli";
import {readFile, writeFile} from "node:fs/promises";

type Candidate = {
  candidateId: string;
  releaseVersionId: string;
  proposedIdentity: {
    channel: string;
    routeAlias: string;
    appearanceDate: string;
    sequence: number;
  };
  pairedDeveloperRoute?: {
    releaseVersionId: string;
    routeAlias: string;
  };
};

type ReleaseEvent = {
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
  builds?: Array<{_id: string; build?: string; buildType?: string}>;
};

async function run(): Promise<void> {
  const candidateDocument = JSON.parse(
    await readFile(
      "research-handoffs/beta-chronology-gap/ios9-point/candidates.json",
      "utf8",
    ),
  ) as {batchId: string; candidates: Candidate[]};
  const candidates = candidateDocument.candidates;
  const targetVersionIds = [
    ...new Set(candidates.map((candidate) => candidate.releaseVersionId)),
  ];

  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, iosPublicBetaCount, allPublishedEventCount] =
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
            availabilityState,
            "builds": builds[]->{
              _id,
              build,
              buildType
            }
          }`,
        {targetVersionIds},
      ),
      client.fetch(
        `count(*[_type == "releaseEvent" && platform->name == "iOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const typedEvents = targetEvents as ReleaseEvent[];
  const exactChecks = candidates.map((candidate) => {
    const identity = candidate.proposedIdentity;
    const matches = typedEvents.filter(
      (event) =>
        event.releaseVersionId === candidate.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    return {
      candidateId: candidate.candidateId,
      releaseVersionId: candidate.releaseVersionId,
      channel: identity.channel,
      routeAlias: identity.routeAlias,
      expectedAppearanceDate: identity.appearanceDate,
      expectedSequence: identity.sequence,
      exactIdentityMatches: matches.length,
      exactDateMatches: matches.filter(
        (event) => event.appearanceDate === identity.appearanceDate,
      ).length,
      matches,
    };
  });

  const developerRouteChecks = candidates.map((candidate) => {
    const route = candidate.pairedDeveloperRoute;
    const matches = route
      ? typedEvents.filter(
          (event) =>
            event.releaseVersionId === route.releaseVersionId &&
            event.channel === "developerBeta" &&
            event.routeAlias === route.routeAlias,
        )
      : [];
    return {
      candidateId: candidate.candidateId,
      releaseVersionId: route?.releaseVersionId ?? null,
      channel: route ? "developerBeta" : null,
      routeAlias: route?.routeAlias ?? null,
      exactIdentityMatches: matches.length,
      matches,
    };
  });

  const snapshot = {
    formatVersion: 1,
    batchId: candidateDocument.batchId,
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    expectedIdentityCount: candidates.length,
    productionCounts: {
      totalReleaseEvents: allPublishedEventCount,
      iosPublicBetaEventsAllVersions: iosPublicBetaCount,
      scopedReleaseEvents: typedEvents.length,
      scopedPublicBetaEvents: typedEvents.filter(
        (event) => event.channel === "publicBeta",
      ).length,
    },
    versions,
    scopedEvents: typedEvents,
    scopedPublicBetaEvents: typedEvents.filter(
      (event) => event.channel === "publicBeta",
    ),
    exactChecks,
    developerRouteChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
    },
  };
  const outputPath =
    "research-handoffs/beta-chronology-gap/ios9-point/production-snapshot.json";
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        exactMatches: exactChecks.filter(
          (check) => check.exactIdentityMatches > 0,
        ),
        missingDeveloperRoutes: developerRouteChecks.filter(
          (check) => check.exactIdentityMatches === 0,
        ),
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
