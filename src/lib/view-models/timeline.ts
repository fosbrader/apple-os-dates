import {
  getReleaseStatus,
  type Platform,
  type ReleaseStatus,
  type ReleaseVersion,
} from "@/lib/types";
import { daysBetween } from "@/lib/utils";
import {
  collectViewModelPlatforms,
  type ViewModelPlatform,
} from "./platforms";

/**
 * A milestone marker carries only the label and date the timeline renders.
 * The tuple form and the omitted bar-relative offset are deliberate: the offset
 * is recoverable from the owning bar, and there are roughly five markers per
 * bar, so object keys would dominate the serialized page.
 */
export type TimelineMarker = [label: string, date: string];

export interface TimelineBar {
  id: string;
  version: string;
  platformSlug: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  milestoneCount: number;
  releaseStatus: ReleaseStatus;
  milestones: TimelineMarker[];
}

export interface TimelineViewModel {
  bars: TimelineBar[];
  platforms: ViewModelPlatform[];
}

export function buildTimelineViewModel(
  versions: ReleaseVersion[],
  platforms: Platform[],
  today = new Date().toISOString().split("T")[0],
): TimelineViewModel {
  const bars = versions
    .filter((version) => version.milestones?.length > 0)
    .map((version): TimelineBar => {
      const releaseStatus = getReleaseStatus(version);
      const startDate = version.milestones[0].date;
      const lastMilestoneDate =
        version.milestones[version.milestones.length - 1].date;
      const endDate =
        releaseStatus === "active"
          ? today
          : releaseStatus === "released"
            ? version.publicReleaseDate || lastMilestoneDate
            : lastMilestoneDate;

      return {
        id: version._id,
        version: version.version,
        platformSlug: version.releaseTrain.platform.slug.current,
        startDate,
        endDate,
        durationDays: Math.max(1, daysBetween(startDate, endDate)),
        milestoneCount: version.milestones.length,
        releaseStatus,
        milestones: version.milestones.map((milestone) => [
          milestone.label,
          milestone.date,
        ]),
      };
    });

  return {
    bars,
    platforms: collectViewModelPlatforms(platforms, versions),
  };
}
