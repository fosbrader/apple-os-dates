import type { MetadataRoute } from "next";
import {
  getAllPlatforms,
  getAllVersionRoutes,
} from "@/lib/sanity.fetch";
import type { ReleaseVersionRoute } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";

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

function pathSegment(value: string): string {
  return encodeURIComponent(value);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [platforms, fetchedVersionRoutes] = await Promise.all([
    getAllPlatforms(),
    getAllVersionRoutes(),
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

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/timeline/"),
      lastModified: siteLastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/analytics/"),
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const platformEntries: MetadataRoute.Sitemap = platforms.map((platform) => {
    const slug = platform.slug.current;

    return {
      url: absoluteUrl(`/${pathSegment(slug)}/`),
      lastModified: platformLastModified.get(slug),
      changeFrequency: "daily",
      priority: 0.9,
    };
  });

  const versionEntries: MetadataRoute.Sitemap = versionRoutes.map((route) => ({
    url: absoluteUrl(
      `/${pathSegment(route.platform)}/${pathSegment(route.version)}/`
    ),
    lastModified: toDate(route.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...platformEntries, ...versionEntries];
}
