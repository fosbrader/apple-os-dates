import {writeFileSync} from "node:fs";
import {getCliClient} from "sanity/cli";

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const result = await client.fetch(`
    {
      "queriedAt": now(),
      "perspective": "published",
      "versions": *[_type == "releaseVersion"] | order(
        releaseTrain->platform->sortOrder asc,
        version asc
      ) {
        _id,
        version,
        releaseStatus,
        publicReleaseDate,
        "platformId": releaseTrain->platform->_id,
        "platform": releaseTrain->platform->name,
        "train": releaseTrain->displayName,
        "majorVersion": releaseTrain->majorVersion,
        "events": *[
          _type == "releaseEvent" &&
          releaseVersion._ref == ^._id
        ] | order(appearanceDate asc, sequence asc) {
          _id,
          stableEventId,
          label,
          "routeAlias": routeAlias.current,
          channel,
          appearanceDate,
          sequence,
          isRevision,
          availabilityState
        }
      },
      "releaseVersionCount": count(*[_type == "releaseVersion"]),
      "releaseEventCount": count(*[_type == "releaseEvent"]),
      "publicBetaEventCount": count(*[
        _type == "releaseEvent" &&
        channel == "publicBeta"
      ])
    }
  `);

  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv.includes("--write")) {
    writeFileSync(
      "research-handoffs/beta-chronology-gap/version-inventory-snapshot.json",
      serialized,
    );
  }
  console.log(
    JSON.stringify({
      queriedAt: result.queriedAt,
      releaseVersionCount: result.releaseVersionCount,
      releaseEventCount: result.releaseEventCount,
      publicBetaEventCount: result.publicBetaEventCount,
    }),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
