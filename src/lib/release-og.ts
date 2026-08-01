import {
  releaseOgDotKind,
  type ReleaseOgCycleDot,
  type ReleaseOgProps,
} from "@/lib/opengraph-image";
import {
  milestoneChannel,
  releaseEventChannelLabel,
} from "@/lib/release-events";
import {
  getReleaseStatus,
  type BetaMilestone,
  type ReleaseBuild,
  type ReleaseEvent,
  type ReleaseVersion,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";

/** Keeps the strip legible; first and last dots always survive sampling. */
const MAX_CYCLE_DOTS = 12;

function sampleDots(dots: ReleaseOgCycleDot[]): ReleaseOgCycleDot[] {
  if (dots.length <= MAX_CYCLE_DOTS) {
    return dots;
  }

  const kept: ReleaseOgCycleDot[] = [];
  for (let slot = 0; slot < MAX_CYCLE_DOTS; slot += 1) {
    const index = Math.round(
      (slot / (MAX_CYCLE_DOTS - 1)) * (dots.length - 1),
    );
    kept.push(dots[index]);
  }
  // Sampling must never drop the highlighted dot.
  const current = dots.find((dot) => dot.current);
  if (current && !kept.includes(current)) {
    kept[Math.floor(kept.length / 2)] = current;
  }
  return kept;
}

function milestoneCycle(
  milestones: BetaMilestone[],
  isCurrent?: (milestone: BetaMilestone) => boolean,
): ReleaseOgCycleDot[] {
  const sorted = [...milestones].sort((left, right) =>
    left.date.localeCompare(right.date),
  );

  return sampleDots(
    sorted.map((milestone) => ({
      label: `${milestone.label} · ${formatDate(milestone.date)}`,
      kind: releaseOgDotKind(
        milestoneChannel(milestone.channel ?? milestone.label),
      ),
      current: isCurrent?.(milestone) ?? false,
    })),
  );
}

export function versionOgProps(detail: ReleaseVersion): ReleaseOgProps {
  const milestones = detail.milestones ?? [];
  const status = getReleaseStatus(detail);
  const publicBuild = milestones.find(
    (milestone) =>
      milestone.build &&
      milestoneChannel(milestone.channel ?? milestone.label) === "public",
  )?.build;

  const statusLine =
    status === "released" && detail.publicReleaseDate
      ? `Released ${formatDate(detail.publicReleaseDate)}`
      : status === "superseded"
        ? "Superseded release"
        : "Beta cycle in progress";
  const detailParts = [
    publicBuild ? `BUILD ${publicBuild.toUpperCase()}` : null,
    `${milestones.length} RECORDED EVENT${milestones.length === 1 ? "" : "S"}`,
  ].filter(Boolean);

  return {
    platformName: detail.releaseTrain.platform.name,
    heroSuffix: detail.version,
    statusLine,
    detailLine: detailParts.join(" · "),
    cycle: milestoneCycle(milestones),
  };
}

export function eventOgProps(
  release: ReleaseVersion,
  event: ReleaseEvent,
): ReleaseOgProps {
  const buildNumber =
    event.build?.displayBuildNumber ?? event.build?.buildNumber;
  const detailParts = [
    buildNumber ? `BUILD ${buildNumber.toUpperCase()}` : null,
    event.availabilityState && event.availabilityState !== "available"
      ? event.availabilityState.toUpperCase()
      : getReleaseStatus(release) === "active"
        ? "CYCLE IN PROGRESS"
        : null,
  ].filter(Boolean);

  return {
    platformName: release.releaseTrain.platform.name,
    heroSuffix: `${release.version} ${event.label}`,
    statusLine: `${releaseEventChannelLabel(event.normalizedChannel)} · ${formatDate(event.date)}`,
    detailLine: detailParts.join(" · ") || "RECORDED APPEARANCE",
    cycle: milestoneCycle(
      release.milestones ?? [],
      (milestone) =>
        milestone.label === event.label &&
        milestone.date === event.date,
    ),
  };
}

export function buildOgProps(build: ReleaseBuild): ReleaseOgProps {
  const displayBuild =
    build.displayBuildNumber ?? build.buildNumber;
  const events = [...(build.events ?? [])].sort((left, right) =>
    left.date.localeCompare(right.date),
  );
  const channelLabels = Array.from(
    new Set(
      events.map((event) =>
        releaseEventChannelLabel(event.normalizedChannel),
      ),
    ),
  );

  return {
    platformName: build.platform.name,
    heroSuffix: `Build ${displayBuild}`,
    statusLine: `${build.platform.name} ${build.releaseVersion.version} · Verified build`,
    detailLine: channelLabels.length
      ? `APPEARED AS ${channelLabels.join(" AND ").toUpperCase()}`
      : "VERIFIED BUILD RECORD",
    cycle: sampleDots(
      events.map((event) => ({
        label: `${event.label} · ${formatDate(event.date)}`,
        kind: releaseOgDotKind(event.normalizedChannel),
        current: true,
      })),
    ),
  };
}
