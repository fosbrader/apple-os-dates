import {writeFileSync} from "node:fs";
import {getCliClient} from "sanity/cli";

type Target = {
  targetId: string;
  releaseVersionId: string;
  version: string;
  routeAlias: string;
  sequence: number;
  appearanceDate: string;
  purpose: string;
};

const targets: Target[] = [
  ...[
    [1, "2018-06-25"],
    [2, "2018-07-05"],
    [3, "2018-07-18"],
    [4, "2018-07-31"],
    [5, "2018-08-06"],
  ].map(([sequence, appearanceDate]) => ({
    targetId: `ios12-pb${sequence}`,
    releaseVersionId: "version-ios-12-0",
    version: "12.0",
    routeAlias: `public-beta-${sequence}`,
    sequence: sequence as number,
    appearanceDate: appearanceDate as string,
    purpose: "unchanged blocked-candidate identity",
  })),
  {
    targetId: "ios14-original-pb1-july9",
    releaseVersionId: "version-ios-14-0",
    version: "14.0",
    routeAlias: "public-beta-1",
    sequence: 1,
    appearanceDate: "2020-07-09",
    purpose: "original blocked identity",
  },
  {
    targetId: "ios14-corrected-pb2-july9",
    releaseVersionId: "version-ios-14-0",
    version: "14.0",
    routeAlias: "public-beta-2",
    sequence: 2,
    appearanceDate: "2020-07-09",
    purpose: "device-facing corrected identity",
  },
  {
    targetId: "ios14-alleged-pb2-july22",
    releaseVersionId: "version-ios-14-0",
    version: "14.0",
    routeAlias: "public-beta-2",
    sequence: 2,
    appearanceDate: "2020-07-22",
    purpose: "date-specific negative identity",
  },
  {
    targetId: "ios15-production-pb1-june30",
    releaseVersionId: "version-ios-15-0",
    version: "15.0",
    routeAlias: "public-beta-1",
    sequence: 1,
    appearanceDate: "2021-06-30",
    purpose: "existing production identity",
  },
  {
    targetId: "ios15-corrected-pb2-june30",
    releaseVersionId: "version-ios-15-0",
    version: "15.0",
    routeAlias: "public-beta-2",
    sequence: 2,
    appearanceDate: "2021-06-30",
    purpose: "device-facing corrected identity",
  },
  {
    targetId: "ios15-original-pb2-july16",
    releaseVersionId: "version-ios-15-0",
    version: "15.0",
    routeAlias: "public-beta-2",
    sequence: 2,
    appearanceDate: "2021-07-16",
    purpose: "original blocked identity",
  },
  {
    targetId: "ios15-corrected-pb3-july16",
    releaseVersionId: "version-ios-15-0",
    version: "15.0",
    routeAlias: "public-beta-3",
    sequence: 3,
    appearanceDate: "2021-07-16",
    purpose: "device-facing corrected identity",
  },
  {
    targetId: "ios17-pb6",
    releaseVersionId: "version-ios-17-0",
    version: "17.0",
    routeAlias: "public-beta-6",
    sequence: 6,
    appearanceDate: "2023-08-29",
    purpose: "unchanged blocked-candidate identity",
  },
  {
    targetId: "ios18-pb5",
    releaseVersionId: "version-ios-18-0",
    version: "18.0",
    routeAlias: "public-beta-5",
    sequence: 5,
    appearanceDate: "2024-08-20",
    purpose: "unchanged blocked-candidate identity",
  },
];

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
    const dateMatches = scoped.filter(
      (event) => event.appearanceDate === target.appearanceDate,
    );
    return {
      ...target,
      channel: "publicBeta",
      exactIdentityMatchCount: exactMatches.length,
      exactIdentityMatchingEventIds: exactMatches.map((event) => event._id),
      routeAliasMatchCount: routeMatches.length,
      routeAliasMatchingEventIds: routeMatches.map((event) => event._id),
      dateMatchCount: dateMatches.length,
      dateMatchingEvents: dateMatches,
    };
  });

  const result = {
    formatVersion: 1,
    batchId: "beta-chronology-gap-ios-major-12-18-followup",
    capturedAt: new Date().toISOString(),
    queryScript:
      "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/query-production.ts",
    perspective: "published",
    useCdn: false,
    targetVersionIds,
    productionCounts: {
      ...(counts as Record<string, unknown>),
      scopedReleaseEvents: typedEvents.length,
      scopedPublicBetaEvents: typedEvents.filter(
        (event) => event.channel === "publicBeta",
      ).length,
    },
    versions: typedVersions,
    events: typedEvents,
    parentChecks,
    exactChecks,
    safety: {
      readOnly: true,
      sanityMutationPerformed: false,
    },
  };

  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (process.argv.includes("--write")) {
    writeFileSync(
      "research-handoffs/beta-chronology-gap/ios-major-12-18-followup/production-snapshot.json",
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
