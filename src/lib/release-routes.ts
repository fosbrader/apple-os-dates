import type { BetaMilestone } from "./types";
import {
  APPLE_VENDOR,
  vendorPlatformPath,
} from "./vendors";

export const APPLE_VENDOR_SLUG = APPLE_VENDOR.slug;

export function encodeSegment(value: string): string {
  return encodeURIComponent(value);
}

export function applePlatformPath(platform: string): string {
  return vendorPlatformPath(APPLE_VENDOR.slug, platform);
}

function appendLeafSegment(parent: string, value: string): string {
  const encoded = encodeSegment(value);
  const separator = parent.endsWith("/") ? "" : "/";

  // Next.js treats a final segment containing a period as file-like and
  // canonicalizes it without a trailing slash, even when trailingSlash is on.
  return `${parent}${separator}${encoded}${encoded.includes(".") ? "" : "/"}`;
}

export function releaseFamilyPath(
  platform: string,
  majorVersion: string | number,
): string {
  return `${applePlatformPath(platform)}${encodeSegment(String(majorVersion))}/`;
}

export function releaseVersionPath(
  platform: string,
  version: string,
): string {
  return appendLeafSegment(applePlatformPath(platform), version);
}

export function releaseBuildPath(
  platform: string,
  version: string,
  buildNumber: string,
): string {
  const versionPath = releaseVersionPath(platform, version).replace(
    /\/$/,
    "",
  );
  return appendLeafSegment(
    `${versionPath}/build/`,
    normalizeBuildSlug(buildNumber),
  );
}

export function releaseEventPath(
  platform: string,
  version: string,
  eventSlug: string,
): string {
  const versionPath = releaseVersionPath(platform, version).replace(
    /\/$/,
    "",
  );
  return appendLeafSegment(`${versionPath}/`, eventSlug);
}

export function normalizeBuildSlug(buildNumber: string): string {
  return buildNumber.trim().toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
}

export function releaseMajor(version: string): number | null {
  const match = version.trim().match(/^(\d+)/);
  if (!match) return null;

  const major = Number.parseInt(match[1], 10);
  return Number.isFinite(major) ? major : null;
}

export function eventLabelSlug(label: string): string {
  return label
    .normalize("NFKD")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "release-event";
}

/**
 * Legacy milestone labels are not guaranteed to be unique. Keep the readable
 * label when possible and add the date only for collisions.
 */
export function legacyEventAliases(
  milestones: BetaMilestone[],
): Map<string, BetaMilestone> {
  const labelCounts = new Map<string, number>();
  const aliases = new Map<string, BetaMilestone>();

  for (const milestone of milestones) {
    const base = eventLabelSlug(milestone.label);
    labelCounts.set(base, (labelCounts.get(base) || 0) + 1);
  }

  for (const milestone of milestones) {
    const base = eventLabelSlug(milestone.label);
    const alias =
      (labelCounts.get(base) || 0) > 1
        ? `${base}-${milestone.date}`
        : base;
    aliases.set(alias, milestone);
  }

  return aliases;
}
