import {getCliClient} from "sanity/cli";
import {mkdir, writeFile} from "node:fs/promises";

const batchId = "beta-chronology-gap-developer-gap-priority";
const cycleOrdinals: Record<string, number[]> = {
  "9.2.1": [1, 2],
  "10.2.1": [1, 2, 3, 4],
  "10.3.2": [1, 2, 3, 4, 5],
  "10.3.3": [1, 2, 3, 4, 5, 6],
};

const expectedIdentities = Object.entries(cycleOrdinals).flatMap(
  ([version, ordinals]) =>
    ordinals.map((sequence) => ({
      version,
      releaseVersionId: `version-ios-${version.replaceAll(".", "-")}`,
      channel: "developerBeta",
      routeAlias: `beta-${sequence}`,
      label: `Beta ${sequence}`,
      sequence,
    })),
);
const targetVersionIds = Object.keys(cycleOrdinals).map(
  (version) => `version-ios-${version.replaceAll(".", "-")}`,
);

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [
    versions,
    targetEvents,
    iosDeveloperBetaCount,
    allPublishedEventCount,
  ] = await Promise.all([
    client.fetch(
      `*[_type == "releaseVersion" && _id in $targetVersionIds] | order(version asc) {
        _id,
        version,
        releaseStatus,
        publicReleaseDate,
        "platformId": releaseTrain->platform->_id,
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
      `count(*[_type == "releaseEvent" && platform->name == "iOS" && channel == "developerBeta"])`,
    ),
    client.fetch(`count(*[_type == "releaseEvent"])`),
  ]);

  const exactChecks = expectedIdentities.map((identity) => {
    const matches = targetEvents.filter(
      (event: {
        releaseVersionId: string;
        channel: string;
        routeAlias: string;
      }) =>
        event.releaseVersionId === identity.releaseVersionId &&
        event.channel === identity.channel &&
        event.routeAlias === identity.routeAlias,
    );
    return {
      ...identity,
      exactIdentityMatches: matches.length,
      matches,
    };
  });

  const scopedDeveloperBetaEvents = targetEvents.filter(
    (event: {channel: string}) => event.channel === "developerBeta",
  );
  const snapshot = {
    batchId,
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    expectedIdentityCount: expectedIdentities.length,
    productionCounts: {
      totalReleaseEvents: allPublishedEventCount,
      iosDeveloperBetaEventsAllVersions: iosDeveloperBetaCount,
      scopedReleaseEvents: targetEvents.length,
      scopedDeveloperBetaEvents: scopedDeveloperBetaEvents.length,
      exactIdentityMatches: exactChecks.reduce(
        (sum, check) => sum + check.exactIdentityMatches,
        0,
      ),
    },
    versions,
    scopedReleaseEvents: targetEvents,
    scopedDeveloperBetaEvents,
    exactChecks,
    safety: {
      queryOnly: true,
      perspective: "published",
      sanityMutationPerformed: false,
      stableIdsAllocated: false,
    },
  };
  const outputPath =
    "tmp/research-evidence/beta-chronology-gap/developer-gap-priority/production-snapshot.json";
  await mkdir(
    "tmp/research-evidence/beta-chronology-gap/developer-gap-priority",
    {recursive: true},
  );
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        presentExactIdentities: exactChecks.filter(
          (check) => check.exactIdentityMatches > 0,
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
