import {getCliClient} from "sanity/cli";
import {writeFileSync} from "node:fs";

const targetVersionIds = [
  "version-ios-9-0",
  "version-ios-10-0",
];

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, targetEvents, publicBetaCount, allPublishedEventCount] =
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
        `count(*[
          _type == "releaseEvent" &&
          releaseVersion._ref in $targetVersionIds &&
          channel == "publicBeta"
        ])`,
        {targetVersionIds},
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const snapshot = {
    queriedAt: new Date().toISOString(),
    perspective: "published",
    targetVersionIds,
    allPublishedEventCount,
    publicBetaCount,
    versions,
    targetEvents,
  };
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
  if (process.argv.includes("--write")) {
    writeFileSync(
      "research-handoffs/beta-chronology-gap/ios9-10-major/production-snapshot.json",
      serialized,
    );
  }
  console.log(serialized);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
