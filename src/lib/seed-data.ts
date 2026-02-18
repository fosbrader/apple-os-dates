import seedDataJson from "../../scripts/seed-data.json";
import type {
  Platform,
  ReleaseVersion,
  ReleaseVersionSummary,
  ReleaseTrain,
} from "./types";

interface SeedPlatform {
  name: string;
  slug: string;
  color: string;
  sortOrder: number;
}

interface SeedTrain {
  platform: string;
  majorVersion: number;
  displayName: string;
  releaseYear: number;
}

interface SeedMilestone {
  label: string;
  date: string;
  note?: string;
  isRevision: boolean;
}

interface SeedVersion {
  platform: string;
  majorVersion: number;
  version: string;
  milestones: SeedMilestone[];
  publicReleaseDate?: string;
  versionNote?: string;
  releaseNotesUrl?: string;
}

interface SeedData {
  platforms: SeedPlatform[];
  releaseTrains: SeedTrain[];
  releaseVersions: SeedVersion[];
}

const data = seedDataJson as SeedData;

function toPlatform(sp: SeedPlatform): Platform {
  return {
    _id: `platform-${sp.slug}`,
    name: sp.name,
    slug: { current: sp.slug },
    color: sp.color,
    sortOrder: sp.sortOrder,
  };
}

function toReleaseTrain(st: SeedTrain, platforms: Platform[]): ReleaseTrain {
  const platform = platforms.find(
    (p) => p.name === st.platform
  )!;
  return {
    _id: `train-${st.platform.toLowerCase()}-${st.majorVersion}`,
    platform,
    majorVersion: st.majorVersion,
    displayName: st.displayName,
    releaseYear: st.releaseYear,
  };
}

function toReleaseVersion(
  sv: SeedVersion,
  trains: ReleaseTrain[]
): ReleaseVersion {
  const train = trains.find(
    (t) =>
      t.platform.name === sv.platform && t.majorVersion === sv.majorVersion
  )!;
  return {
    _id: `version-${sv.platform.toLowerCase()}-${sv.version}`,
    releaseTrain: train,
    version: sv.version,
    releaseNotesUrl: sv.releaseNotesUrl,
    publicReleaseDate: sv.publicReleaseDate,
    versionNote: sv.versionNote,
    milestones: sv.milestones.map((m, i) => ({
      _key: `m-${i}`,
      label: m.label,
      date: m.date,
      note: m.note,
      isRevision: m.isRevision,
    })),
  };
}

function toVersionSummary(rv: ReleaseVersion): ReleaseVersionSummary {
  return {
    _id: rv._id,
    version: rv.version,
    publicReleaseDate: rv.publicReleaseDate,
    versionNote: rv.versionNote,
    milestoneCount: rv.milestones.length,
    firstBetaDate: rv.milestones[0]?.date,
    lastMilestoneDate: rv.milestones[rv.milestones.length - 1]?.date,
    releaseTrain: {
      _id: rv.releaseTrain._id,
      displayName: rv.releaseTrain.displayName,
      majorVersion: rv.releaseTrain.majorVersion,
      platform: rv.releaseTrain.platform,
    },
  };
}

// Pre-compute all data
const platforms = data.platforms.map(toPlatform);
const trains = data.releaseTrains.map((t) => toReleaseTrain(t, platforms));
const versions = data.releaseVersions.map((v) => toReleaseVersion(v, trains));

// Exported query functions (mirroring sanity.fetch.ts interface)
export function getAllPlatforms(): Platform[] {
  return platforms;
}

export function getPlatformVersions(
  platformSlug: string
): ReleaseVersionSummary[] {
  return versions
    .filter((v) => v.releaseTrain.platform.slug.current === platformSlug)
    .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))
    .map(toVersionSummary);
}

export function getVersionDetail(
  platformSlug: string,
  version: string
): ReleaseVersion | null {
  return (
    versions.find(
      (v) =>
        v.releaseTrain.platform.slug.current === platformSlug &&
        v.version === version
    ) || null
  );
}

export function getActiveBetas(): ReleaseVersion[] {
  return versions
    .filter((v) => !v.publicReleaseDate)
    .sort(
      (a, b) =>
        a.releaseTrain.platform.sortOrder - b.releaseTrain.platform.sortOrder
    );
}

export function getRecentReleases(): ReleaseVersionSummary[] {
  return versions
    .filter((v) => v.publicReleaseDate)
    .sort((a, b) =>
      (b.publicReleaseDate || "").localeCompare(a.publicReleaseDate || "")
    )
    .slice(0, 10)
    .map(toVersionSummary);
}

export function getTimelineData(): ReleaseVersion[] {
  return versions.sort(
    (a, b) =>
      a.releaseTrain.platform.sortOrder - b.releaseTrain.platform.sortOrder ||
      b.version.localeCompare(a.version, undefined, { numeric: true })
  );
}

export function getAnalyticsData(): ReleaseVersion[] {
  return versions;
}

/**
 * Get historical comparison data for a given version.
 * Returns all completed versions from the same platform,
 * plus cross-platform versions with the same minor suffix (.0, .1, etc.)
 */
export function getHistoricalContext(
  platformSlug: string,
  version: string
): {
  samePlatformVersions: ReleaseVersion[];
  samePositionVersions: ReleaseVersion[];
  allCompleted: ReleaseVersion[];
} {
  const completed = versions.filter(
    (v) => v.publicReleaseDate && v.milestones?.length >= 2
  );

  const samePlatformVersions = completed.filter(
    (v) => v.releaseTrain.platform.slug.current === platformSlug
  );

  // Extract the minor suffix: "26.3" → ".3", "26.0" → ".0"
  const dotIdx = version.indexOf(".");
  const suffix = dotIdx >= 0 ? version.slice(dotIdx) : ".0";

  const samePositionVersions = completed.filter(
    (v) =>
      v.releaseTrain.platform.slug.current === platformSlug &&
      v.version.endsWith(suffix) &&
      v.version !== version
  );

  return { samePlatformVersions, samePositionVersions, allCompleted: completed };
}
