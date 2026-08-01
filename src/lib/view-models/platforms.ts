import type { Platform, ReleaseVersion } from "@/lib/types";

/**
 * Platform presentation data, sent once per page instead of being repeated on
 * every version row. Rows reference it by slug.
 */
export interface ViewModelPlatform {
  slug: string;
  name: string;
  color: string;
  sortOrder: number;
}

function toViewModelPlatform(platform: Platform): ViewModelPlatform {
  return {
    slug: platform.slug.current,
    name: platform.name,
    color: platform.color,
    sortOrder: platform.sortOrder,
  };
}

/**
 * The platform list drives the filter control, so it stays complete even when a
 * platform has no versions. Any platform reachable only through a version is
 * appended so rows can never reference a missing entry.
 */
export function collectViewModelPlatforms(
  platforms: Platform[],
  versions: ReleaseVersion[],
): ViewModelPlatform[] {
  const bySlug = new Map<string, ViewModelPlatform>();

  for (const platform of platforms) {
    bySlug.set(platform.slug.current, toViewModelPlatform(platform));
  }
  for (const version of versions) {
    const platform = version.releaseTrain.platform;
    if (!bySlug.has(platform.slug.current)) {
      bySlug.set(platform.slug.current, toViewModelPlatform(platform));
    }
  }

  return Array.from(bySlug.values());
}

export function indexPlatformsBySlug(
  platforms: ViewModelPlatform[],
): Map<string, ViewModelPlatform> {
  return new Map(platforms.map((platform) => [platform.slug, platform]));
}

/**
 * The view models guarantee every referenced platform is present; the fallback
 * only keeps an unexpected slug renderable instead of throwing.
 */
export function resolvePlatform(
  platformsBySlug: Map<string, ViewModelPlatform>,
  slug: string,
): ViewModelPlatform {
  return (
    platformsBySlug.get(slug) ?? {
      slug,
      name: slug,
      color: "var(--text-tertiary)",
      sortOrder: Number.MAX_SAFE_INTEGER,
    }
  );
}
