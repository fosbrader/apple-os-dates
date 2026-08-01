import {getCliClient} from "sanity/cli";

const targetVersionIds = [
  "version-macos-10-9-3",
  "version-macos-10-10",
  "version-macos-10-11",
  "version-macos-10-12",
  "version-macos-10-13",
  "version-macos-10-14",
  "version-macos-10-15",
];

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, macOSPublicBetaCount, allPublishedEventCount] =
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
        `count(*[_type == "releaseEvent" && platform->name == "macOS" && channel == "publicBeta"])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  console.log(
    JSON.stringify(
      {
        queriedAt: new Date().toISOString(),
        perspective: "published",
        targetVersionIds,
        allPublishedEventCount,
        macOSPublicBetaCount,
        versions,
        targetEvents,
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
