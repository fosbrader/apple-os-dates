import {getCliClient} from "sanity/cli";
import {mkdir, writeFile} from "node:fs/promises";
import {
  allAppearances,
  batchId,
  evidenceRoot,
  targetVersionIds,
  targetVersions,
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

const identityFor = (appearance: (typeof allAppearances)[number]) => ({
  candidateId:
    `candidate:apple:watchos:${appearance.version}:public-beta-${appearance.sequence}`,
  version: appearance.version,
  releaseVersionId: appearance.releaseVersionId,
  channel: "publicBeta" as const,
  routeAlias: `public-beta-${appearance.sequence}`,
  label: `Public Beta ${appearance.sequence}`,
  sequence: appearance.sequence,
  appearanceDate: appearance.appearanceDate,
  researchDecision: appearance.decision,
});

async function run(): Promise<void> {
  const expectedIdentities = allAppearances.map(identityFor);
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, watchOSPublicBetaCount, totalReleaseEvents] =
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
        `count(*[_type == "releaseEvent" && platform->name == "watchOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const events = targetEvents as ProductionEvent[];
  const exactChecks = expectedIdentities.map((identity) => {
    const routeIdentityMatches = events.filter(
      (event) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    const fullCandidateMatches = routeIdentityMatches.filter(
      (event) =>
        event.label === identity.label &&
        event.sequence === identity.sequence &&
        event.appearanceDate === identity.appearanceDate,
    );
    return {
      ...identity,
      routeIdentityMatchCount: routeIdentityMatches.length,
      fullCandidateMatchCount: fullCandidateMatches.length,
      routeIdentityMatches,
      fullCandidateMatches,
    };
  });
  const versionById = new Map(
    (versions as Array<{_id: string}>).map((version) => [version._id, version]),
  );
  const parentChecks = targetVersionIds.map((releaseVersionId) => ({
    releaseVersionId,
    exists: versionById.has(releaseVersionId),
    document: versionById.get(releaseVersionId) ?? null,
  }));

  const snapshot = {
    formatVersion: 1,
    batchId,
    capturedAt: new Date().toISOString(),
    queryScript:
      "research-handoffs/beta-chronology-gap/watchos-point-7-26/query-production.ts",
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersions,
    targetVersionIds,
    expectedIdentityCount: expectedIdentities.length,
    productionCounts: {
      totalReleaseEvents,
      watchOSPublicBetaEventsAllVersions: watchOSPublicBetaCount,
      scopedReleaseEvents: events.length,
      scopedPublicBetaEvents: events.filter(
        (event) => event.channel === "publicBeta",
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
    scopedEvents: events,
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      deploymentPerformed: false,
    },
  };
  await mkdir(evidenceRoot, {recursive: true});
  const outputPath = `${evidenceRoot}/production-snapshot.json`;
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        expectedIdentityCount: snapshot.expectedIdentityCount,
        productionCounts: snapshot.productionCounts,
        missingParents: parentChecks
          .filter((check) => !check.exists)
          .map((check) => check.releaseVersionId),
        matchedIdentities: exactChecks
          .filter((check) => check.routeIdentityMatchCount > 0)
          .map((check) => check.candidateId),
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
