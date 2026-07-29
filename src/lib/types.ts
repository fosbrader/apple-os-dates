export interface Platform {
  _id: string;
  name: string;
  slug: { current: string };
  color: string;
  sortOrder: number;
}

export interface ReleaseTrain {
  _id: string;
  platform: Platform;
  majorVersion: number;
  displayName: string;
  releaseYear: number;
}

export interface BetaMilestone {
  _key: string;
  label: string;
  date: string;
  note?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  isRevision: boolean;
}

export type ReleaseStatus = "active" | "released" | "superseded";

export interface ReleaseLifecycle {
  releaseStatus?: ReleaseStatus;
  publicReleaseDate?: string;
}

/**
 * Older Sanity documents predate the explicit lifecycle field. Preserve their
 * historical behavior while allowing never-shipped cycles to opt out of both
 * the active and released states.
 */
export function getReleaseStatus(
  release: ReleaseLifecycle,
): ReleaseStatus {
  if (release.releaseStatus) return release.releaseStatus;
  return release.publicReleaseDate ? "released" : "active";
}

export function isActiveRelease(release: ReleaseLifecycle): boolean {
  return getReleaseStatus(release) === "active";
}

export function isReleasedRelease(release: ReleaseLifecycle): boolean {
  return getReleaseStatus(release) === "released";
}

export function isSupersededRelease(release: ReleaseLifecycle): boolean {
  return getReleaseStatus(release) === "superseded";
}

export interface ReleaseVersion {
  _id: string;
  updatedAt?: string;
  releaseTrain: ReleaseTrain;
  version: string;
  releaseNotesUrl?: string;
  keyFeatures?: {
    title: string;
    description?: string;
    category?: string;
  }[];
  releaseStatus?: ReleaseStatus;
  publicReleaseDate?: string;
  versionNote?: string;
  milestones: BetaMilestone[];
}

export interface ReleaseVersionSummary {
  _id: string;
  updatedAt?: string;
  version: string;
  releaseStatus?: ReleaseStatus;
  publicReleaseDate?: string;
  versionNote?: string;
  milestoneCount: number;
  firstBetaDate?: string;
  lastMilestoneDate?: string;
  releaseTrain: {
    _id: string;
    displayName: string;
    majorVersion: number;
    platform: Platform;
  };
}

export interface ReleaseVersionRoute {
  platform: string;
  version: string;
  updatedAt?: string;
}

export interface HistoricalContext {
  samePlatformVersions: ReleaseVersion[];
  samePositionVersions: ReleaseVersion[];
}
