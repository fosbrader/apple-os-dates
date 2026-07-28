import { client } from "@/sanity/client";
import type {
  HistoricalContext,
  Platform,
  ReleaseVersion,
  ReleaseVersionRoute,
  ReleaseVersionSummary,
} from "./types";
import {
  allVersionRoutesQuery,
  allPlatformsQuery,
  activeBetasQuery,
  analyticsDataQuery,
  completedVersionsQuery,
  platformTrainsQuery,
  platformVersionsQuery,
  recentReleasesQuery,
  timelineDataQuery,
  versionDetailQuery,
} from "./queries";

const fetchOptions = {
  next: { revalidate: 60 },
} as const;

function compareVersionsDescending(
  left: Pick<ReleaseVersion, "version">,
  right: Pick<ReleaseVersion, "version">
) {
  return right.version.localeCompare(left.version, undefined, {
    numeric: true,
  });
}

export async function getAllPlatforms(): Promise<Platform[]> {
  return client.fetch(allPlatformsQuery, {}, fetchOptions);
}

export async function getPlatformVersions(
  platform: string
): Promise<ReleaseVersionSummary[]> {
  const versions = await client.fetch<ReleaseVersionSummary[]>(
    platformVersionsQuery,
    { platform },
    fetchOptions
  );

  return versions.sort(compareVersionsDescending);
}

export async function getVersionDetail(
  platform: string,
  version: string
): Promise<ReleaseVersion | null> {
  return client.fetch(
    versionDetailQuery,
    { platform, version },
    fetchOptions
  );
}

export async function getActiveBetas(): Promise<ReleaseVersion[]> {
  return client.fetch(activeBetasQuery, {}, fetchOptions);
}

export async function getRecentReleases(): Promise<ReleaseVersionSummary[]> {
  return client.fetch(recentReleasesQuery, {}, fetchOptions);
}

export async function getTimelineData(): Promise<ReleaseVersion[]> {
  const versions = await client.fetch<ReleaseVersion[]>(
    timelineDataQuery,
    {},
    fetchOptions
  );

  return versions.sort(
    (left, right) =>
      left.releaseTrain.platform.sortOrder -
        right.releaseTrain.platform.sortOrder ||
      compareVersionsDescending(left, right)
  );
}

export async function getAnalyticsData(): Promise<ReleaseVersion[]> {
  return client.fetch(analyticsDataQuery, {}, fetchOptions);
}

export async function getPlatformTrains(platform: string) {
  return client.fetch(platformTrainsQuery, { platform }, fetchOptions);
}

export async function getAllVersionRoutes(): Promise<ReleaseVersionRoute[]> {
  return client.fetch(allVersionRoutesQuery, {}, fetchOptions);
}

/**
 * Build the historical cohorts used by the version-detail insights.
 * "Same position" intentionally means the same platform and minor suffix,
 * matching the historical behavior of the JSON-backed implementation.
 */
export async function getHistoricalContext(
  platform: string,
  version: string
): Promise<HistoricalContext> {
  const completed = await client.fetch<ReleaseVersion[]>(
    completedVersionsQuery,
    { platform, version },
    fetchOptions
  );
  const dotIndex = version.indexOf(".");
  const suffix = dotIndex >= 0 ? version.slice(dotIndex) : ".0";
  const samePositionVersions = completed.filter(
    (release) => release.version.endsWith(suffix)
  );

  return {
    samePlatformVersions: completed,
    samePositionVersions,
  };
}
