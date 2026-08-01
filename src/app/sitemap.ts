import type { MetadataRoute } from "next";
import {
  getAllBuildRoutes,
  getAllEventRoutes,
  getAllPlatforms,
  getAllVersionRoutes,
} from "@/lib/sanity.fetch";
import type { ReleaseVersionRoute } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";
import {
  applePlatformPath,
  releaseBuildPath,
  releaseEventPath,
  releaseFamilyPath,
  releaseMajor,
  releaseVersionPath,
} from "@/lib/release-routes";

function toDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function newerDate(
  current: Date | undefined,
  candidate: Date | undefined
): Date | undefined {
  if (!candidate || (current && current >= candidate)) {
    return current;
  }

  return candidate;
}

function versionRouteKey(route: ReleaseVersionRoute): string {
  return `${route.platform}/${route.version}`;
}

function uniqueVersionRoutes(
  routes: ReleaseVersionRoute[]
): ReleaseVersionRoute[] {
  const unique = new Map<string, ReleaseVersionRoute>();

  for (const route of routes) {
    const key = versionRouteKey(route);
    const existing = unique.get(key);
    const existingDate = toDate(existing?.updatedAt);
    const candidateDate = toDate(route.updatedAt);

    if (
      !existing ||
      (!existingDate && candidateDate) ||
      (existingDate && candidateDate && candidateDate > existingDate)
    ) {
      unique.set(key, route);
    }
  }

  return Array.from(unique.values());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    platforms,
    fetchedVersionRoutes,
    buildRoutes,
    eventRoutes,
  ] = await Promise.all([
    getAllPlatforms(),
    getAllVersionRoutes(),
    getAllBuildRoutes(),
    getAllEventRoutes(),
  ]);
  const versionRoutes = uniqueVersionRoutes(fetchedVersionRoutes).sort(
    (left, right) =>
      left.platform.localeCompare(right.platform) ||
      right.version.localeCompare(left.version, undefined, { numeric: true })
  );
  const platformLastModified = new Map<string, Date>();
  let siteLastModified: Date | undefined;

  for (const route of versionRoutes) {
    const updatedAt = toDate(route.updatedAt);
    siteLastModified = newerDate(siteLastModified, updatedAt);

    const currentPlatformDate = platformLastModified.get(route.platform);
    const nextPlatformDate = newerDate(currentPlatformDate, updatedAt);

    if (nextPlatformDate) {
      platformLastModified.set(route.platform, nextPlatformDate);
    }
  }
  for (const route of [...buildRoutes, ...eventRoutes]) {
    siteLastModified = newerDate(
      siteLastModified,
      toDate(route.updatedAt),
    );
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/apple/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/search/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/timeline/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/forecasts/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/analytics/"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/corrections/"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/exports/"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/about/"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: absoluteUrl("/methodology/"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/sources/"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacy/"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: absoluteUrl("/contact/"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/submit/"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const platformEntries: MetadataRoute.Sitemap = platforms.map((platform) => {
    const slug = platform.slug.current;

    return {
      url: absoluteUrl(applePlatformPath(slug)),
      lastModified: platformLastModified.get(slug),
      changeFrequency: "daily",
      priority: 0.9,
    };
  });

  const versionEntries: MetadataRoute.Sitemap = versionRoutes.map((route) => ({
    url: absoluteUrl(releaseVersionPath(route.platform, route.version)),
    lastModified: toDate(route.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const familyMap = new Map<
    string,
    { platform: string; major: number; updatedAt?: string }
  >();
  for (const route of versionRoutes) {
    const major = releaseMajor(route.version);
    if (major === null) continue;
    const key = `${route.platform}:${major}`;
    const existing = familyMap.get(key);
    if (
      !existing ||
      (route.updatedAt ?? "") > (existing.updatedAt ?? "")
    ) {
      familyMap.set(key, {
        platform: route.platform,
        major,
        updatedAt: route.updatedAt,
      });
    }
  }
  const familyEntries: MetadataRoute.Sitemap = Array.from(
    familyMap.values(),
  ).map((family) => ({
    url: absoluteUrl(
      releaseFamilyPath(family.platform, family.major),
    ),
    lastModified: toDate(family.updatedAt),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const buildEntries: MetadataRoute.Sitemap = buildRoutes
    .filter((route) => route.indexEligible)
    .map((route) => ({
      url: absoluteUrl(
        releaseBuildPath(
          route.platform,
          route.version,
          route.build,
        ),
      ),
      lastModified: toDate(route.updatedAt),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  const eventEntries: MetadataRoute.Sitemap = eventRoutes
    .filter((route) => route.indexEligible)
    .map((route) => ({
      url: absoluteUrl(
        releaseEventPath(
          route.platform,
          route.version,
          route.event,
        ),
      ),
      lastModified: toDate(route.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [
    ...staticEntries,
    ...platformEntries,
    ...familyEntries,
    ...versionEntries,
    ...buildEntries,
    ...eventEntries,
  ];
}
