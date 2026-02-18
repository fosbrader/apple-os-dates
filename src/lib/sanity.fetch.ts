import { client } from "@/sanity/client";
import type {
  Platform,
  ReleaseVersion,
  ReleaseVersionSummary,
} from "./types";
import {
  allPlatformsQuery,
  platformVersionsQuery,
  versionDetailQuery,
  activeBetasQuery,
  recentReleasesQuery,
  timelineDataQuery,
  analyticsDataQuery,
  platformTrainsQuery,
} from "./queries";

export async function getAllPlatforms(): Promise<Platform[]> {
  return client.fetch(allPlatformsQuery);
}

export async function getPlatformVersions(
  platform: string
): Promise<ReleaseVersionSummary[]> {
  return client.fetch(platformVersionsQuery, { platform });
}

export async function getVersionDetail(
  platform: string,
  version: string
): Promise<ReleaseVersion | null> {
  return client.fetch(versionDetailQuery, { platform, version });
}

export async function getActiveBetas(): Promise<ReleaseVersion[]> {
  return client.fetch(activeBetasQuery);
}

export async function getRecentReleases(): Promise<ReleaseVersionSummary[]> {
  return client.fetch(recentReleasesQuery);
}

export async function getTimelineData(): Promise<ReleaseVersion[]> {
  return client.fetch(timelineDataQuery);
}

export async function getAnalyticsData(): Promise<ReleaseVersion[]> {
  return client.fetch(analyticsDataQuery);
}

export async function getPlatformTrains(platform: string) {
  return client.fetch(platformTrainsQuery, { platform });
}
