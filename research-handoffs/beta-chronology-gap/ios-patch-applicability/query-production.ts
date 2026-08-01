import {getCliClient} from "sanity/cli";
import {mkdir, writeFile} from "node:fs/promises";
import {
  batchId,
  evidenceRoot,
  observedPublicBetas,
  packetPath,
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

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({perspective: "published", useCdn: false});

  const [versions, targetEvents, iosPublicBetaCount, totalReleaseEvents] =
    await Promise.all([
      client.fetch(
        `*[_type == "releaseVersion" && _id in $targetVersionIds] | order(_id asc) {
          _id, version, releaseStatus, publicReleaseDate,
          "platform": releaseTrain->platform->name,
          "train": releaseTrain->displayName
        }`,
        {targetVersionIds},
      ),
      client.fetch(
        `*[_type == "releaseEvent" && releaseVersion._ref in $targetVersionIds]
          | order(releaseVersion->version asc, appearanceDate asc, sequence asc) {
            _id, stableEventId, "releaseVersionId": releaseVersion._ref,
            "platform": platform->name, "version": releaseVersion->version,
            label, "routeAlias": routeAlias.current, channel, appearanceDate,
            sequence, isRevision, availabilityState
          }`,
        {targetVersionIds},
      ),
      client.fetch(
        `count(*[_type == "releaseEvent" && platform->name == "iOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const events = targetEvents as ProductionEvent[];
  const exactChecks = observedPublicBetas.map((identity) => {
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
      releaseVersionId: identity.releaseVersionId,
      routeAlias: identity.routeAlias,
      label: identity.label,
      sequence: identity.sequence,
      appearanceDate: identity.appearanceDate,
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
    queryScript: `${packetPath}/query-production.ts`,
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    observedAppearanceCount: observedPublicBetas.length,
    productionCounts: {
      totalReleaseEvents,
      iosPublicBetaCount,
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
    versions,
    parentChecks,
    scopedEvents: events,
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
      stableEventIdsCreated: 0,
      pageBuildsPerformed: 0,
      publicationPerformed: false,
      deploymentPerformed: false,
    },
  };
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
  await mkdir(evidenceRoot, {recursive: true});
  await writeFile(`${evidenceRoot}/production-snapshot.json`, serialized);
  await writeFile(`${packetPath}/production-snapshot.json`, serialized);
  console.log(
    JSON.stringify(
      {
        packetPath: `${packetPath}/production-snapshot.json`,
        evidencePath: `${evidenceRoot}/production-snapshot.json`,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        missingParents: parentChecks
          .filter((check) => !check.exists)
          .map((check) => check.releaseVersionId),
        matchedCandidateIds: exactChecks
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

