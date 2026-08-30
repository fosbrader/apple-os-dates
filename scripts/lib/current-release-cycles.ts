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
  sourceUrls?: PlatformValues;
  sourceLabel?: string;
  sourceLabels?: PlatformValues;
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
  sourceLabel: string;
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
          macos: "2026-07-13",
          tvos: "2026-07-13",
          watchos: "2026-07-13",
        },
        notes: {
          ios: "Build 24A5380h",
          ipados: "Build 24A5380l",
          macos: "Build 26A5378n",
          tvos: "Build 24J5315i",
          watchos: "Build 24R5315i",
        },
        sourceUrls: {
          ios: "https://www.macrumors.com/2026/07/13/apple-seeds-ios-27-public-beta-1/",
          ipados: "https://www.macrumors.com/2026/07/13/apple-seeds-ios-27-public-beta-1/",
          macos: "https://www.macrumors.com/2026/07/13/macos-golden-gate-public-beta/",
          tvos: "https://www.macrumors.com/2026/07/13/watchos-27-public-beta/",
          watchos: "https://www.macrumors.com/2026/07/13/watchos-27-public-beta/",
        },
        sourceLabel: "MacRumors",
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
      {
        label: "Public Beta 2",
        dates: {
          ios: "2026-07-22",
          ipados: "2026-07-22",
          macos: "2026-07-22",
          tvos: "2026-07-22",
          watchos: "2026-07-22",
        },
        notes: {
          ios: "Build 24A5390f",
          ipados: "Build 24A5390f",
          macos: "Build 26A5388g",
          tvos: "Build 24J5325d",
          watchos: "Build 24R5325h",
        },
        sourceUrls: {
          ios: "https://www.macrumors.com/2026/07/22/apple-seeds-ios-27-public-beta-2/",
          ipados: "https://www.macrumors.com/2026/07/22/apple-seeds-ios-27-public-beta-2/",
          macos: "https://9to5mac.com/2026/07/22/macos-27-public-beta-2-now-available-heres-how-to-install-it/",
          tvos: "https://www.macrumors.com/2026/07/22/watchos-27-public-beta-2/",
          watchos: "https://www.macrumors.com/2026/07/22/watchos-27-public-beta-2/",
        },
        sourceLabels: {
          ios: "MacRumors",
          ipados: "MacRumors",
          macos: "9to5Mac",
          tvos: "MacRumors",
          watchos: "MacRumors",
        },
      },
      { label: "Beta 5", dates: "2026-08-10" },
      {
        label: "Public Beta 3",
        dates: {
          ios: "2026-08-11",
          ipados: "2026-08-11",
          macos: "2026-08-11",
          tvos: "2026-08-11",
          watchos: "2026-08-11",
        },
        notes: {
          ios: "Build 24A5408d",
          ipados: "Build 24A5408d",
          macos: "Build 26A5406e",
          tvos: "Build 24J5346a",
          watchos: "Build 24R5347a",
        },
        sourceUrls: {
          ios: "https://www.macrumors.com/2026/08/11/apple-releases-ios-27-public-beta-3/",
          ipados: "https://www.macrumors.com/2026/08/11/apple-releases-ios-27-public-beta-3/",
          macos: "https://9to5mac.com/2026/08/11/apple-rolls-out-macos-27-golden-gate-public-beta-3-heres-how-to-install-it/",
          tvos: "https://www.macrumors.com/2026/08/11/apple-releases-watchos-27-b3/",
          watchos: "https://www.macrumors.com/2026/08/11/apple-releases-watchos-27-b3/",
        },
        sourceLabels: {
          ios: "MacRumors",
          ipados: "MacRumors",
          macos: "9to5Mac",
          tvos: "MacRumors",
          watchos: "MacRumors",
        },
      },
      { label: "Beta 6", dates: "2026-08-17" },
      {
        label: "Public Beta 4",
        dates: {
          ios: "2026-08-17",
          ipados: "2026-08-17",
          macos: "2026-08-17",
          tvos: "2026-08-17",
          watchos: "2026-08-18",
        },
        notes: {
          ios: "Build 24A5418b",
          ipados: "Build 24A5418b",
          macos: "Build 26A5416a; replaced August 18",
          tvos: "Build 24J5353b",
          watchos: "Build 24R5353a",
        },
        sourceUrls: {
          ios: "https://www.macrumors.com/2026/08/17/apple-ios-27-public-beta-4/",
          ipados: "https://www.macrumors.com/2026/08/17/apple-ios-27-public-beta-4/",
          macos: "https://www.macrumors.com/2026/08/17/apple-ios-27-public-beta-4/",
          tvos: "https://www.macrumors.com/2026/08/17/apple-ios-27-public-beta-4/",
          watchos: "https://9to5mac.com/2026/08/18/apple-releases-public-beta-4-for-ios-27-macos-27-ipados-27-tvos-27/?extended-comments=1",
        },
        sourceLabels: {
          ios: "MacRumors",
          ipados: "MacRumors",
          macos: "MacRumors",
          tvos: "MacRumors",
          watchos: "9to5Mac",
        },
      },
      {
        label: "Public Beta 4 v2",
        dates: { macos: "2026-08-18" },
        notes: { macos: "Build 26A5416b; replaced build 26A5416a" },
        sourceUrl:
          "https://9to5mac.com/2026/08/18/apple-releases-public-beta-4-for-ios-27-macos-27-ipados-27-tvos-27/?extended-comments=1",
        sourceLabel: "9to5Mac",
      },
      {
        label: "Beta 7",
        dates: "2026-08-24",
        notes: {
          ios: "Build 24A5424a",
          ipados: "Build 24A5424a",
          macos: "Build 26A5421a",
          tvos: "Build 24J5358a",
          visionos: "Build 24M5359a",
          watchos: "Build 24R5358a",
        },
      },
      {
        label: "Public Beta 5",
        dates: {
          ios: "2026-08-24",
          ipados: "2026-08-24",
          macos: "2026-08-24",
          tvos: "2026-08-24",
          watchos: "2026-08-25",
        },
        notes: {
          ios: "Build 24A5424a",
          ipados: "Build 24A5424a",
          macos: "Build 26A5421a",
          tvos: "Build 24J5358a",
          watchos: "Build 24R5358a",
        },
        sourceUrls: {
          ios: "https://9to5mac.com/2026/08/24/new-public-betas-now-available-for-ios-27-ipados-27-macos-27-golden-gate-more/",
          ipados: "https://9to5mac.com/2026/08/24/new-public-betas-now-available-for-ios-27-ipados-27-macos-27-golden-gate-more/",
          macos: "https://9to5mac.com/2026/08/24/new-public-betas-now-available-for-ios-27-ipados-27-macos-27-golden-gate-more/",
          tvos: "https://9to5mac.com/2026/08/24/new-public-betas-now-available-for-ios-27-ipados-27-macos-27-golden-gate-more/",
          watchos: "https://www.macobserver.com/news/apple-releases-watchos-27-public-beta-5-for-apple-watch-users/",
        },
        sourceLabels: {
          ios: "9to5Mac",
          ipados: "9to5Mac",
          macos: "9to5Mac",
          tvos: "9to5Mac",
          watchos: "The Mac Observer",
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
  const platformSourceUrl = milestone.sourceUrls?.[platform.slug];
  if (platformSourceUrl) {
    return platformSourceUrl;
  }

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

function milestoneSourceLabel(
  milestone: MilestoneDefinition,
  platform: CurrentReleasePlatform,
): string {
  return (
    milestone.sourceLabels?.[platform.slug] ||
    milestone.sourceLabel ||
    "Apple Developer"
  );
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
              sourceLabel: milestoneSourceLabel(milestone, platform),
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
