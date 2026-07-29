/**
 * Pure definitions for the launch-critical 2026 Apple OS release cycles.
 *
 * Both the local seed builder and the guarded Sanity backfill consume the
 * expanded records from this module so their dates, labels, and source URLs
 * cannot drift apart.
 */

export const appleDeveloperReleasesUrl =
  "https://developer.apple.com/news/releases/";

export const currentReleasePlatforms = [
  { slug: "ios", name: "iOS", archiveSuffix: "a" },
  { slug: "ipados", name: "iPadOS", archiveSuffix: "b" },
  { slug: "macos", name: "macOS", archiveSuffix: "c" },
  { slug: "tvos", name: "tvOS", archiveSuffix: "d" },
  { slug: "visionos", name: "visionOS", archiveSuffix: "e" },
  { slug: "watchos", name: "watchOS", archiveSuffix: "f" },
] as const;

export type CurrentReleasePlatform =
  (typeof currentReleasePlatforms)[number];
export type CurrentReleasePlatformSlug = CurrentReleasePlatform["slug"];
type PlatformValues = Partial<
  Record<CurrentReleasePlatformSlug, string>
>;

interface MilestoneDefinition {
  label: string;
  dates: string | PlatformValues;
  notes?: PlatformValues;
  directArchiveIds?: boolean;
  sourceIds?: PlatformValues;
  sourceUrl?: string;
}

interface CycleDefinition {
  version: "26.4" | "26.5" | "26.6" | "27.0";
  majorVersion: 26 | 27;
  milestones: MilestoneDefinition[];
}

export interface CurrentReleaseMilestone {
  key: string;
  label: string;
  date: string;
  note?: string;
  sourceUrl: string;
  sourceLabel: "Apple Developer";
  isRevision: boolean;
}

export interface CurrentReleaseVersion {
  platformSlug: CurrentReleasePlatformSlug;
  platform: CurrentReleasePlatform["name"];
  version: CycleDefinition["version"];
  majorVersion: CycleDefinition["majorVersion"];
  releaseStatus: "active" | "released";
  publicReleaseDate?: string;
  milestones: CurrentReleaseMilestone[];
}

export interface CurrentReleaseTrain {
  platformSlug: CurrentReleasePlatformSlug;
  platform: CurrentReleasePlatform["name"];
  majorVersion: 27;
  displayName: string;
  releaseYear: 2026;
}

const cycles: CycleDefinition[] = [
  {
    version: "26.4",
    majorVersion: 26,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-02-16",
        sourceUrl: "https://developer.apple.com/news/?id=xgkk9w83",
      },
      {
        label: "Beta 2",
        dates: "2026-02-23",
        directArchiveIds: true,
      },
      {
        label: "Beta 3",
        dates: {
          ios: "2026-03-02",
          ipados: "2026-03-02",
          macos: "2026-03-03",
          tvos: "2026-03-02",
          visionos: "2026-03-02",
          watchos: "2026-03-02",
        },
        directArchiveIds: true,
        sourceIds: { macos: "03032026a" },
      },
      {
        label: "Beta 3 v2",
        dates: {
          ios: "2026-03-05",
          ipados: "2026-03-05",
          watchos: "2026-03-05",
        },
        notes: {
          ios: "Build 23E5223k",
          ipados: "Build 23E5223k",
        },
        sourceIds: {
          ios: "03052026a",
          ipados: "03052026b",
          watchos: "03052026c",
        },
      },
      {
        label: "Beta 4",
        dates: "2026-03-09",
        directArchiveIds: true,
      },
      {
        label: "RC",
        dates: "2026-03-18",
        directArchiveIds: true,
      },
      {
        label: "Public",
        dates: "2026-03-24",
        directArchiveIds: true,
      },
    ],
  },
  {
    version: "26.5",
    majorVersion: 26,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-03-30",
        sourceUrl: "https://developer.apple.com/news/?id=z8vzrgzx",
      },
      {
        label: "Beta 1 v2",
        dates: {
          ios: "2026-04-03",
          ipados: "2026-04-03",
        },
        notes: {
          ios: "Build 23F5043k",
          ipados: "Build 23F5043k",
        },
        sourceIds: {
          ios: "04032026a",
          ipados: "04032026b",
        },
      },
      {
        label: "Beta 2",
        dates: "2026-04-13",
        directArchiveIds: true,
      },
      {
        label: "Beta 3",
        dates: "2026-04-20",
        directArchiveIds: true,
      },
      {
        label: "Beta 4",
        dates: "2026-04-27",
        directArchiveIds: true,
      },
      {
        label: "RC",
        dates: "2026-05-04",
        directArchiveIds: true,
      },
      {
        label: "RC 2",
        dates: {
          ios: "2026-05-08",
          ipados: "2026-05-08",
        },
        sourceIds: {
          ios: "05082026a",
          ipados: "05082026b",
        },
      },
      {
        label: "Public",
        dates: "2026-05-11",
        directArchiveIds: true,
      },
    ],
  },
  {
    version: "26.6",
    majorVersion: 26,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-05-26",
        sourceUrl: "https://developer.apple.com/news/?id=tu7pk9oy",
      },
      {
        label: "Beta 2",
        dates: "2026-06-15",
      },
      {
        label: "Beta 3",
        dates: "2026-06-29",
      },
      {
        label: "Beta 4",
        dates: "2026-07-06",
      },
      {
        label: "Beta 5",
        dates: "2026-07-13",
        sourceIds: {
          ios: "07132026c",
          ipados: "07132026d",
          macos: "07132026e",
          tvos: "07132026f",
          visionos: "07132026g",
          watchos: "07132026h",
        },
      },
      {
        label: "RC",
        dates: "2026-07-20",
        directArchiveIds: true,
      },
      {
        label: "Public",
        dates: "2026-07-27",
        directArchiveIds: true,
      },
    ],
  },
  {
    version: "27.0",
    majorVersion: 27,
    milestones: [
      {
        label: "Beta 1",
        dates: "2026-06-08",
        sourceIds: {
          ios: "06082026b",
          ipados: "06082026c",
          macos: "06082026d",
          tvos: "06082026e",
          visionos: "06082026f",
          watchos: "06082026g",
        },
      },
      {
        label: "Beta 2",
        dates: {
          ios: "2026-06-22",
          ipados: "2026-06-22",
          macos: "2026-06-22",
          tvos: "2026-06-22",
          visionos: "2026-06-22",
          watchos: "2026-06-23",
        },
      },
      { label: "Beta 3", dates: "2026-07-06" },
      {
        label: "Beta 3 v2",
        dates: {
          ipados: "2026-07-13",
          macos: "2026-07-13",
        },
        notes: {
          ipados:
            "Build 24A5380l; also released as Public Beta 1",
        },
        sourceIds: {
          ipados: "07132026a",
          macos: "07132026b",
        },
      },
      {
        label: "Public Beta 1",
        dates: {
          ios: "2026-07-13",
          ipados: "2026-07-13",
        },
        notes: {
          ipados: "Build 24A5380l",
        },
      },
      {
        label: "Beta 4",
        dates: "2026-07-20",
        sourceIds: {
          ios: "07202026g",
          ipados: "07202026h",
          macos: "07202026i",
          tvos: "07202026j",
          visionos: "07202026k",
          watchos: "07202026l",
        },
      },
    ],
  },
];

function valueForPlatform(
  value: string | PlatformValues | undefined,
  platform: CurrentReleasePlatformSlug,
): string | undefined {
  return typeof value === "string" ? value : value?.[platform];
}

function archiveId(date: string, suffix: string): string {
  const [year, month, day] = date.split("-");
  return `${month}${day}${year}${suffix}`;
}

function milestoneSource(
  milestone: MilestoneDefinition,
  platform: CurrentReleasePlatform,
  date: string,
): string {
  const explicitSourceId = milestone.sourceIds?.[platform.slug];
  if (explicitSourceId) {
    return `${appleDeveloperReleasesUrl}?id=${explicitSourceId}`;
  }

  if (milestone.sourceUrl) {
    return milestone.sourceUrl;
  }

  if (milestone.directArchiveIds) {
    return `${appleDeveloperReleasesUrl}?id=${archiveId(
      date,
      platform.archiveSuffix,
    )}`;
  }

  return appleDeveloperReleasesUrl;
}

export function buildCurrentReleaseVersions(): CurrentReleaseVersion[] {
  return cycles.flatMap((cycle) =>
    currentReleasePlatforms.map((platform) => {
      const milestones = cycle.milestones.flatMap<CurrentReleaseMilestone>(
        (milestone, index) => {
          const date = valueForPlatform(milestone.dates, platform.slug);
          if (!date) return [];
          const note = milestone.notes?.[platform.slug];

          return [
            {
              key: `m${index}`,
              label: milestone.label,
              date,
              ...(note ? { note } : {}),
              sourceUrl: milestoneSource(milestone, platform, date),
              sourceLabel: "Apple Developer",
              isRevision: /\bv\d+\b/i.test(milestone.label),
            },
          ];
        },
      );
      const publicReleaseDate = milestones.find(
        (milestone) => milestone.label === "Public",
      )?.date;

      return {
        platformSlug: platform.slug,
        platform: platform.name,
        version: cycle.version,
        majorVersion: cycle.majorVersion,
        releaseStatus: publicReleaseDate ? "released" : "active",
        ...(publicReleaseDate ? { publicReleaseDate } : {}),
        milestones,
      };
    }),
  );
}

export function buildCurrentReleaseTrains(): CurrentReleaseTrain[] {
  return currentReleasePlatforms.map((platform) => ({
    platformSlug: platform.slug,
    platform: platform.name,
    majorVersion: 27,
    displayName: `${platform.name} 27`,
    releaseYear: 2026,
  }));
}
