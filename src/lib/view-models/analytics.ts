import type { Platform, ReleaseVersion } from "@/lib/types";
import {
  computeAverageBetaInterval,
  computeBetaCycleDays,
} from "@/lib/utils";
import {
  collectViewModelPlatforms,
  type ViewModelPlatform,
} from "./platforms";

/**
 * Everything the analytics dashboard renders is derived from milestone dates,
 * never from the milestones themselves, so the cycle math is resolved here and
 * the milestone arrays never reach the client.
 */
export interface AnalyticsVersionStat {
  platformSlug: string;
  version: string;
  milestoneCount: number;
  cycleDays: number | null;
  avgInterval: number | null;
  publicReleaseDate?: string;
}

export interface AnalyticsViewModel {
  versions: AnalyticsVersionStat[];
  platforms: ViewModelPlatform[];
}

export function buildAnalyticsViewModel(
  versions: ReleaseVersion[],
  platforms: Platform[],
): AnalyticsViewModel {
  return {
    versions: versions
      .filter((version) => version.milestones?.length > 0)
      .map((version) => ({
        platformSlug: version.releaseTrain.platform.slug.current,
        version: version.version,
        milestoneCount: version.milestones.length,
        cycleDays: computeBetaCycleDays(version),
        avgInterval: computeAverageBetaInterval(version.milestones),
        publicReleaseDate: version.publicReleaseDate,
      })),
    platforms: collectViewModelPlatforms(platforms, versions),
  };
}
