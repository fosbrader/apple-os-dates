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
  isRevision: boolean;
}

export interface ReleaseVersion {
  _id: string;
  releaseTrain: ReleaseTrain;
  version: string;
  releaseNotesUrl?: string;
  keyFeatures?: {
    title: string;
    description?: string;
    category?: string;
  }[];
  publicReleaseDate?: string;
  versionNote?: string;
  milestones: BetaMilestone[];
}

export interface ReleaseVersionSummary {
  _id: string;
  version: string;
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
