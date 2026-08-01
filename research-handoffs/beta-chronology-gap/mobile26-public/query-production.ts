import {writeFileSync} from "node:fs";
import {getCliClient} from "sanity/cli";

type PlatformTarget = {
  platform: "iOS" | "iPadOS";
  platformId: "platform-ios" | "platform-ipados";
  version: string;
  releaseVersionId: string;
  sequence: number;
  appearanceDate: string;
  routeAlias: string;
};

const cycles: Record<string, Array<[number, string]>> = {
  "26.1": [
    [1, "2025-09-24"],
    [2, "2025-10-07"],
    [3, "2025-10-14"],
    [4, "2025-10-20"],
  ],
  "26.2": [
    [1, "2025-11-06"],
    [2, "2025-11-18"],
  ],
  "26.3": [
    [1, "2025-12-17"],
    [2, "2026-01-13"],
    [3, "2026-01-27"],
  ],
  "26.4": [
    [1, "2026-02-17"],
    [2, "2026-03-05"],
    [3, "2026-03-09"],
  ],
  "26.5": [
    [1, "2026-04-03"],
    [2, "2026-04-14"],
    [3, "2026-04-21"],
    [4, "2026-04-27"],
  ],
  "26.6": [
    [1, "2026-05-28"],
    [2, "2026-06-16"],
    [3, "2026-06-30"],
    [4, "2026-07-07"],
    [5, "2026-07-13"],
  ],
};

const platformSpecs = [
  {
    platform: "iOS" as const,
    platformId: "platform-ios" as const,
    slug: "ios",
  },
  {
    platform: "iPadOS" as const,
    platformId: "platform-ipados" as const,
    slug: "ipados",
  },
];

const targets: PlatformTarget[] = platformSpecs.flatMap((platform) =>
  Object.entries(cycles).flatMap(([version, appearances]) =>
    appearances.map(([sequence, appearanceDate]) => ({
      platform: platform.platform,
      platformId: platform.platformId,
      version,
      releaseVersionId: `version-${platform.slug}-${version.replaceAll(".", "-")}`,
      sequence,
      appearanceDate,
      routeAlias: `public-beta-${sequence}`,
    })),
  ),
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

  const [versions, events, platformCounts, totalEventCount] = await Promise.all([
    client.fetch(
      `*[_type == "releaseVersion" && _id in $targetVersionIds]
        | order(releaseTrain->platform->name asc, version asc) {
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
        | order(platform->name asc, releaseVersion->version asc, appearanceDate asc, sequence asc) {
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
      `{
        "iosPublicBetaEventsAllVersions": count(*[
          _type == "releaseEvent" &&
          platform->name == "iOS" &&
          channel == "publicBeta"
        ]),
        "ipadosPublicBetaEventsAllVersions": count(*[
          _type == "releaseEvent" &&
          platform->name == "iPadOS" &&
          channel == "publicBeta"
        ])
      }`,
    ),
    client.fetch(`count(*[_type == "releaseEvent"])`),
  ]);

  const typedVersions = versions as Array<Record<string, unknown>>;
  const typedEvents = events as Array<Record<string, unknown>>;

  const parentChecks = targets
    .filter(
      (target, index, all) =>
        all.findIndex(
          (candidate) =>
            candidate.releaseVersionId === target.releaseVersionId,
        ) === index,
    )
    .map((target) => {
      const matches = typedVersions.filter(
        (version) => version._id === target.releaseVersionId,
      );
      return {
        platform: target.platform,
        platformId: target.platformId,
        version: target.version,
        releaseVersionId: target.releaseVersionId,
        exactParentMatchCount: matches.length,
        matchingParents: matches,
      };
    });

  const exactChecks = targets.map((target) => {
    const scoped = typedEvents.filter(
      (event) =>
        event.releaseVersionId === target.releaseVersionId &&
        event.channel === "publicBeta",
    );
    const routeMatches = scoped.filter(
      (event) => event.routeAlias === target.routeAlias,
    );
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
      publicBetaEventCount: scoped.filter(
        (event) => event.channel === "publicBeta",
      ).length,
      developerBetaEventCount: scoped.filter(
        (event) => event.channel === "developerBeta",
      ).length,
      releaseCandidateEventCount: scoped.filter(
        (event) => event.channel === "releaseCandidate",
      ).length,
      publicReleaseEventCount: scoped.filter(
        (event) => event.channel === "public",
      ).length,
    };
  });

  const result = {
    capturedAt: new Date().toISOString(),
    perspective: "published",
    useCdn: false,
    targetVersionIds,
    productionCounts: {
      totalReleaseEvents: totalEventCount,
      ...platformCounts,
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
      "research-handoffs/beta-chronology-gap/mobile26-public/production-snapshot.json",
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
