import { client } from "@/sanity/client";
import type {
  ChangeOccurrence,
  HistoricalContext,
  Platform,
  PublishedCorrection,
  ReleaseBuild,
  ReleaseBuildRoute,
  ReleaseEvent,
  ReleaseEventRoute,
  ReleaseVersion,
  ReleaseVersionRoute,
  ReleaseVersionSummary,
} from "./types";
import {
  milestonesForVersion,
  versionWithReleaseEvents,
} from "./release-events";
import {
  allVersionRoutesQuery,
  allBuildRoutesQuery,
  allEventRoutesQuery,
  allPlatformsQuery,
  activeBetasQuery,
  analyticsDataQuery,
  completedVersionsQuery,
  platformTrainsQuery,
  platformVersionsQuery,
  recentReleasesQuery,
  releaseBuildDetailQuery,
  releaseEventDetailQuery,
  releaseEventsForVersionsQuery,
  publishedCorrectionsQuery,
  timelineDataQuery,
  versionChangesQuery,
  versionDetailQuery,
  versionEventsQuery,
} from "./queries";

const fetchOptions = {
  next: { revalidate: 60 },
} as const;

interface VersionScopedReleaseEvent extends ReleaseEvent {
  releaseVersionId: string;
}

export interface VersionChangeTargets {
  eventTargets: Array<{
    _id: string;
    label: string;
    date: string;
    slug?: { current: string };
    changes?: ChangeOccurrence[];
  }>;
  buildTargets: Array<{
    _id: string;
    buildNumber: string;
    slug?: { current: string };
    changes?: ChangeOccurrence[];
  }>;
}

async function getEventsByVersionId(
  versionIds: string[],
): Promise<Map<string, ReleaseEvent[]>> {
  const grouped = new Map<string, ReleaseEvent[]>();
  if (versionIds.length === 0) return grouped;

  const events = await client.fetch<VersionScopedReleaseEvent[]>(
    releaseEventsForVersionsQuery,
    { releaseVersionIds: versionIds },
    fetchOptions,
  );

  for (const event of events) {
    const current = grouped.get(event.releaseVersionId) ?? [];
    current.push(event);
    grouped.set(event.releaseVersionId, current);
  }

  return grouped;
}

async function normalizeVersionsWithEvents<
  T extends ReleaseVersion,
>(versions: T[]): Promise<T[]> {
  const eventsByVersion = await getEventsByVersionId(
    versions.map((version) => version._id),
  );

  return versions.map((version) =>
    versionWithReleaseEvents(
      version,
      eventsByVersion.get(version._id),
    ),
  );
}

async function normalizeSummariesWithEvents(
  versions: ReleaseVersionSummary[],
): Promise<ReleaseVersionSummary[]> {
  const eventsByVersion = await getEventsByVersionId(
    versions.map((version) => version._id),
  );

  return versions.map((version) => {
    const events = eventsByVersion.get(version._id);
    const milestones = milestonesForVersion(
      version,
      events,
    );
    const updatedAt = [
      version.updatedAt,
      ...(events ?? []).map((event) => event.updatedAt),
    ]
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);

    return {
      ...version,
      ...(updatedAt ? { updatedAt } : {}),
      milestones,
      milestoneCount: milestones.length,
      firstBetaDate: milestones[0]?.date,
      lastMilestoneDate: milestones[milestones.length - 1]?.date,
    };
  });
}

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

  const normalized = await normalizeSummariesWithEvents(versions);
  return normalized.sort(compareVersionsDescending);
}

export async function getVersionDetail(
  platform: string,
  version: string
): Promise<ReleaseVersion | null> {
  const [detail, events] = await Promise.all([
    client.fetch<ReleaseVersion | null>(
      versionDetailQuery,
      { platform, version },
      fetchOptions,
    ),
    getVersionEvents(platform, version),
  ]);

  return detail ? versionWithReleaseEvents(detail, events) : null;
}

export async function getVersionEvents(
  platform: string,
  version: string,
): Promise<ReleaseEvent[]> {
  return client.fetch(
    versionEventsQuery,
    { platform, version },
    fetchOptions,
  );
}

export function normalizeVersionChanges(
  result: VersionChangeTargets,
): ChangeOccurrence[] {
  const eventChanges = (result.eventTargets ?? []).flatMap((target) =>
    (target.changes ?? []).map((change, index) => ({
      ...change,
      _key: `${target._id}:${change._key || index}`,
      targetEvent: {
        _id: target._id,
        label: target.label,
        date: target.date,
        slug: target.slug,
      },
    })),
  );
  const buildChanges = (result.buildTargets ?? []).flatMap((target) =>
    (target.changes ?? []).map((change, index) => ({
      ...change,
      _key: `${target._id}:${change._key || index}`,
      targetBuild: {
        _id: target._id,
        buildNumber: target.buildNumber,
        displayBuildNumber: target.buildNumber,
        slug: target.slug,
      },
    })),
  );

  return [...eventChanges, ...buildChanges];
}

export async function getVersionChanges(
  platform: string,
  version: string,
): Promise<ChangeOccurrence[]> {
  const result = await client.fetch<VersionChangeTargets>(
    versionChangesQuery,
    { platform, version },
    fetchOptions,
  );
  return normalizeVersionChanges(result);
}

export async function getReleaseEventDetail(
  platform: string,
  version: string,
  event: string,
): Promise<ReleaseEvent | null> {
  return client.fetch(
    releaseEventDetailQuery,
    { platform, version, event },
    fetchOptions,
  );
}

export async function getReleaseBuildDetail(
  platform: string,
  version: string,
  build: string,
): Promise<ReleaseBuild | null> {
  return client.fetch(
    releaseBuildDetailQuery,
    { platform, version, build },
    fetchOptions,
  );
}

export async function getAllBuildRoutes(): Promise<ReleaseBuildRoute[]> {
  return client.fetch(allBuildRoutesQuery, {}, fetchOptions);
}

export async function getAllEventRoutes(): Promise<ReleaseEventRoute[]> {
  return client.fetch(allEventRoutesQuery, {}, fetchOptions);
}

export async function getPublishedCorrections(): Promise<
  PublishedCorrection[]
> {
  return client.fetch(publishedCorrectionsQuery, {}, fetchOptions);
}

export async function getActiveBetas(): Promise<ReleaseVersion[]> {
  const versions = await client.fetch<ReleaseVersion[]>(
    activeBetasQuery,
    {},
    fetchOptions,
  );
  return normalizeVersionsWithEvents(versions);
}

export async function getRecentReleases(): Promise<ReleaseVersionSummary[]> {
  const versions = await client.fetch<ReleaseVersionSummary[]>(
    recentReleasesQuery,
    {},
    fetchOptions,
  );
  return normalizeSummariesWithEvents(versions);
}

export async function getTimelineData(): Promise<ReleaseVersion[]> {
  const versions = await client.fetch<ReleaseVersion[]>(
    timelineDataQuery,
    {},
    fetchOptions
  );

  const normalized = await normalizeVersionsWithEvents(versions);
  return normalized.sort(
    (left, right) =>
      left.releaseTrain.platform.sortOrder -
        right.releaseTrain.platform.sortOrder ||
      compareVersionsDescending(left, right)
  );
}

export async function getAnalyticsData(): Promise<ReleaseVersion[]> {
  const versions = await client.fetch<ReleaseVersion[]>(
    analyticsDataQuery,
    {},
    fetchOptions,
  );
  return normalizeVersionsWithEvents(versions);
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
  const normalizedCompleted =
    await normalizeVersionsWithEvents(completed);
  const eligibleCompleted = normalizedCompleted.filter(
    (release) => release.milestones.length >= 2,
  );
  const dotIndex = version.indexOf(".");
  const suffix = dotIndex >= 0 ? version.slice(dotIndex) : ".0";
  const samePositionVersions = eligibleCompleted.filter(
    (release) => release.version.endsWith(suffix)
  );

  return {
    samePlatformVersions: eligibleCompleted,
    samePositionVersions,
  };
}
