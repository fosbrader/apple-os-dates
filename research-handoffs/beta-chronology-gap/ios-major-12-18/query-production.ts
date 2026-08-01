import {writeFileSync} from "node:fs";
import {getCliClient} from "sanity/cli";

type Target = {
  platform: "iOS";
  platformId: "platform-ios";
  version: string;
  releaseVersionId: string;
  sequence: number;
  appearanceDate: string;
  routeAlias: string;
};

const cycles: Record<string, Array<[number, string]>> = {
  "12.0": [
    [1, "2018-06-25"],
    [2, "2018-07-05"],
    [3, "2018-07-18"],
    [4, "2018-07-31"],
    [5, "2018-08-06"],
    [6, "2018-08-15"],
    [7, "2018-08-20"],
    [8, "2018-08-23"],
    [9, "2018-08-27"],
    [10, "2018-08-31"],
  ],
  "13.0": [
    [1, "2019-06-24"],
    [2, "2019-07-08"],
    [3, "2019-07-18"],
    [4, "2019-07-30"],
    [5, "2019-08-08"],
    [6, "2019-08-15"],
    [7, "2019-08-21"],
  ],
  "14.0": [
    [1, "2020-07-09"],
    [3, "2020-07-23"],
    [4, "2020-08-06"],
    [5, "2020-08-19"],
    [6, "2020-08-25"],
    [7, "2020-09-03"],
    [8, "2020-09-09"],
  ],
  "15.0": [
    [1, "2021-06-30"],
    [2, "2021-07-16"],
    [4, "2021-07-28"],
    [5, "2021-08-11"],
    [6, "2021-08-18"],
    [7, "2021-08-25"],
    [8, "2021-08-31"],
  ],
  "16.0": [
    [1, "2022-07-11"],
    [2, "2022-07-28"],
    [3, "2022-08-09"],
    [4, "2022-08-15"],
    [5, "2022-08-24"],
    [6, "2022-08-29"],
  ],
  "17.0": [
    [1, "2023-07-12"],
    [2, "2023-07-31"],
    [3, "2023-08-09"],
    [4, "2023-08-16"],
    [5, "2023-08-22"],
    [6, "2023-08-29"],
  ],
  "18.0": [
    [1, "2024-07-15"],
    [2, "2024-07-29"],
    [3, "2024-08-06"],
    [4, "2024-08-12"],
    [5, "2024-08-20"],
    [6, "2024-08-28"],
  ],
};

const targets: Target[] = Object.entries(cycles).flatMap(
  ([version, appearances]) =>
    appearances.map(([sequence, appearanceDate]) => ({
      platform: "iOS",
      platformId: "platform-ios",
      version,
      releaseVersionId: `version-ios-${version.replaceAll(".", "-")}`,
      sequence,
      appearanceDate,
      routeAlias: `public-beta-${sequence}`,
    })),
);
const targetVersionIds = [...new Set(targets.map((item) => item.releaseVersionId))];

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, events, counts] = await Promise.all([
    client.fetch(
      `*[_type == "releaseVersion" && _id in $targetVersionIds]
        | order(version asc) {
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
          "platformId": platform._ref,
          "platform": platform->name,
          "version": releaseVersion->version,
          label,
          "routeAlias": routeAlias.current,
          channel,
          appearanceDate,
          sequence,
          isRevision,
          availabilityState,
          "builds": builds[]->{_id, build, buildType}
        }`,
      {targetVersionIds},
    ),
    client.fetch(
      `{
        "totalReleaseEvents": count(*[_type == "releaseEvent"]),
        "iosPublicBetaEventsAllVersions": count(*[
          _type == "releaseEvent" &&
          platform->name == "iOS" &&
          channel == "publicBeta"
        ])
      }`,
    ),
  ]);

  const typedVersions = versions as Array<Record<string, unknown>>;
  const typedEvents = events as Array<Record<string, unknown>>;
  const parentChecks = targetVersionIds.map((releaseVersionId) => {
    const matches = typedVersions.filter((version) => version._id === releaseVersionId);
    return {releaseVersionId, exactParentMatchCount: matches.length, matchingParents: matches};
  });
  const exactChecks = targets.map((target) => {
    const scoped = typedEvents.filter(
      (event) =>
        event.releaseVersionId === target.releaseVersionId &&
        event.channel === "publicBeta",
    );
    const routeMatches = scoped.filter((event) => event.routeAlias === target.routeAlias);
    const exactMatches = routeMatches.filter(
      (event) =>
        event.sequence === target.sequence &&
        event.appearanceDate === target.appearanceDate,
    );
    const channelSequenceDateMatches = scoped.filter(
      (event) =>
        event.sequence === target.sequence &&
        event.appearanceDate === target.appearanceDate,
    );
    return {
      ...target,
      channel: "publicBeta",
      exactIdentityMatchCount: exactMatches.length,
      exactIdentityMatchingEventIds: exactMatches.map((event) => event._id),
      routeAliasMatchCount: routeMatches.length,
      routeAliasMatchingEventIds: routeMatches.map((event) => event._id),
      channelSequenceDateMatchCount: channelSequenceDateMatches.length,
      channelSequenceDateMatchingEventIds: channelSequenceDateMatches.map(
        (event) => event._id,
      ),
    };
  });
  const scopedCycles = targetVersionIds.map((releaseVersionId) => {
    const scoped = typedEvents.filter(
      (event) => event.releaseVersionId === releaseVersionId,
    );
    return {
      releaseVersionId,
      publicBetaEventCount: scoped.filter((event) => event.channel === "publicBeta").length,
      developerBetaEventCount: scoped.filter(
        (event) => event.channel === "developerBeta",
      ).length,
      releaseCandidateEventCount: scoped.filter(
        (event) => event.channel === "releaseCandidate",
      ).length,
      publicReleaseEventCount: scoped.filter((event) => event.channel === "public").length,
    };
  });

  const result = {
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    targetVersionIds,
    productionCounts: {
      ...(counts as Record<string, unknown>),
      scopedReleaseEvents: typedEvents.length,
      scopedPublicBetaEvents: typedEvents.filter(
        (event) => event.channel === "publicBeta",
      ).length,
      scopedDeveloperBetaEvents: typedEvents.filter(
        (event) => event.channel === "developerBeta",
      ).length,
    },
    versions: typedVersions,
    events: typedEvents,
    parentChecks,
    exactChecks,
    scopedCycles,
  };

  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv.includes("--write")) {
    writeFileSync(
      "research-handoffs/beta-chronology-gap/ios-major-12-18/production-snapshot.json",
      serialized,
      "utf8",
    );
  }
  console.log(serialized);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
