import {getCliClient} from "sanity/cli";
import {writeFileSync} from "node:fs";

type Target = {
  releaseVersionId: string;
  version: string;
  sequence: number;
  appearanceDate: string;
  routeAlias: string;
};

const cycleDates: Record<string, string[]> = {
  "10.1": [
    "2016-09-22",
    "2016-10-05",
    "2016-10-10",
    "2016-10-17",
    "2016-10-19",
  ],
  "10.2": [
    "2016-11-01",
    "2016-11-08",
    "2016-11-15",
    "2016-11-28",
    "2016-12-02",
    "2016-12-05",
    "2016-12-07",
  ],
  "10.2.1": [
    "2016-12-15",
    "2016-12-21",
    "2017-01-09",
    "2017-01-12",
  ],
  "10.3": [
    "2017-01-26",
    "2017-02-07",
    "2017-02-21",
    "2017-02-28",
    "2017-03-08",
    "2017-03-13",
    "2017-03-16",
  ],
  "10.3.2": [
    "2017-03-29",
    "2017-04-11",
    "2017-04-18",
    "2017-04-24",
    "2017-04-27",
  ],
  "10.3.3": [
    "2017-05-17",
    "2017-05-30",
    "2017-06-13",
    "2017-06-22",
    "2017-06-28",
    "2017-07-05",
  ],
};

const versionId = (version: string) =>
  `version-ios-${version.replaceAll(".", "-")}`;

const targets: Target[] = Object.entries(cycleDates).flatMap(
  ([version, dates]) =>
    dates.map((appearanceDate, index) => ({
      releaseVersionId: versionId(version),
      version,
      sequence: index + 1,
      appearanceDate,
      routeAlias: `public-beta-${index + 1}`,
    })),
);

const targetVersionIds = Object.keys(cycleDates).map(versionId);

async function run(): Promise<void> {
  const client = getCliClient({
    apiVersion: "2024-01-01",
    useCdn: false,
  }).withConfig({
    perspective: "published",
    useCdn: false,
  });

  const [versions, events, iosPublicBetaCount, totalEventCount] =
    await Promise.all([
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
          platform->name == "iOS" &&
          channel == "publicBeta"
        ])`,
      ),
      client.fetch(`count(*[_type == "releaseEvent"])`),
    ]);

  const typedEvents = events as Array<Record<string, unknown>>;
  const exactChecks = targets.map((target) => {
    const routeMatches = typedEvents.filter(
      (event) =>
        event.releaseVersionId === target.releaseVersionId &&
        event.channel === "publicBeta" &&
        event.routeAlias === target.routeAlias,
    );
    const identityMatches = routeMatches.filter(
      (event) =>
        event.sequence === target.sequence &&
        event.appearanceDate === target.appearanceDate,
    );
    const channelSequenceDateMatches = typedEvents.filter(
      (event) =>
        event.releaseVersionId === target.releaseVersionId &&
        event.channel === "publicBeta" &&
        event.sequence === target.sequence &&
        event.appearanceDate === target.appearanceDate,
    );

    return {
      ...target,
      channel: "publicBeta",
      exactIdentityMatchCount: identityMatches.length,
      exactIdentityMatchingEventIds: identityMatches.map((event) => event._id),
      routeAliasMatchCount: routeMatches.length,
      routeAliasMatchingEventIds: routeMatches.map((event) => event._id),
      channelSequenceDateMatchCount: channelSequenceDateMatches.length,
      channelSequenceDateMatchingEventIds: channelSequenceDateMatches.map(
        (event) => event._id,
      ),
    };
  });

  const developerBetaAudit = targetVersionIds.map((releaseVersionId) => {
    const developerEvents = typedEvents.filter(
      (event) =>
        event.releaseVersionId === releaseVersionId &&
        event.channel === "developerBeta",
    );
    const version =
      Object.entries(cycleDates).find(
        ([candidateVersion]) =>
          versionId(candidateVersion) === releaseVersionId,
      )?.[0] ?? null;
    return {
      releaseVersionId,
      version,
      developerBetaEventCount: developerEvents.length,
      developerBetaEventIds: developerEvents.map((event) => event._id),
      auditGap: developerEvents.length === 0,
    };
  });

  const result = {
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    targetVersionIds,
    productionCounts: {
      totalReleaseEvents: totalEventCount,
      iosPublicBetaEventsAllVersions: iosPublicBetaCount,
      scopedReleaseEvents: typedEvents.length,
      scopedPublicBetaEvents: typedEvents.filter(
        (event) => event.channel === "publicBeta",
      ).length,
      scopedDeveloperBetaEvents: typedEvents.filter(
        (event) => event.channel === "developerBeta",
      ).length,
    },
    versions,
    events,
    exactChecks,
    developerBetaAudit,
  };

  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv.includes("--write")) {
    writeFileSync(
      "research-handoffs/beta-chronology-gap/ios10-point-public/production-snapshot.json",
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
