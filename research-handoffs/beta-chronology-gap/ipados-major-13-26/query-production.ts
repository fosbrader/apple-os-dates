import {getCliClient} from "sanity/cli";
import {mkdir, writeFile} from "node:fs/promises";

const cycleOrdinals: Record<string, number[]> = {
  "13.0": [1, 2, 3, 4, 5, 6, 7],
  "14.0": [2, 3, 4, 5, 6, 7, 8],
  "15.0": [2, 3, 4, 5, 6, 7, 8],
  "16.0": [1, 2, 3, 4],
  "17.0": [1, 2, 3, 4, 5, 6],
  "18.0": [1, 2, 3, 4, 5, 6],
  "26.0": [1, 2, 3, 4, 5, 6],
};

const expectedIdentities = Object.entries(cycleOrdinals).flatMap(
  ([version, ordinals]) =>
    ordinals.map((sequence) => ({
      version,
      releaseVersionId: `version-ipados-${version.replaceAll(".", "-")}`,
      channel: "publicBeta",
      routeAlias: `public-beta-${sequence}`,
      label: `Public Beta ${sequence}`,
      sequence,
    })),
);
const targetVersionIds = Object.keys(cycleOrdinals).map(
  (version) => `version-ipados-${version.replaceAll(".", "-")}`,
);

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, iPadOSPublicBetaCount, allPublishedEventCount] =
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
        `count(*[_type == "releaseEvent" && platform->name == "iPadOS" && channel == "publicBeta"])`,
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

  const snapshot = {
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    projectId: client.config().projectId,
    dataset: client.config().dataset,
    targetVersionIds,
    expectedIdentityCount: expectedIdentities.length,
    productionCounts: {
      totalReleaseEvents: allPublishedEventCount,
      iPadOSPublicBetaEventsAllVersions: iPadOSPublicBetaCount,
      scopedReleaseEvents: targetEvents.length,
      scopedPublicBetaEvents: targetEvents.filter(
        (event: {channel: string}) => event.channel === "publicBeta",
      ).length,
    },
    versions,
    scopedPublicBetaEvents: targetEvents.filter(
      (event: {channel: string}) => event.channel === "publicBeta",
    ),
    exactChecks,
    safety: {
      queryOnly: true,
      sanityMutationPerformed: false,
    },
  };
  const outputPath =
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26/production-snapshot.json";
  await mkdir(
    "tmp/research-evidence/beta-chronology-gap/ipados-major-13-26",
    {recursive: true},
  );
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        outputPath,
        capturedAt: snapshot.capturedAt,
        productionCounts: snapshot.productionCounts,
        scopedPublicBetaEvents: targetEvents.filter(
          (event: {channel: string}) => event.channel === "publicBeta",
        ),
        exactChecks: exactChecks.filter(
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
