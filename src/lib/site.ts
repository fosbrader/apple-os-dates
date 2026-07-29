import type { Metadata } from "next";

const defaultSiteUrl = "https://www.betacadence.com";

export const siteName = "Beta Cadence";
export const siteDescription =
  "Track Apple OS beta cycles, release candidates, public release dates, and history-based forecasts for iOS, iPadOS, macOS, watchOS, tvOS, and visionOS.";
export const socialImagePath = "/social-preview-v2.png";
export const socialImageAlt =
  "Beta Cadence — Apple OS beta and release date index";

function normalizeBasePath(value: string | undefined): string {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function normalizeSiteUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const candidate = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";

    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export const basePath = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH
);

const configuredSiteUrl = normalizeSiteUrl(
  process.env.CANONICAL_SITE_URL
);
const configuredSiteOrigin = configuredSiteUrl
  ? new URL(configuredSiteUrl).origin
  : null;
const legacySiteOrigins = new Set(["https://art.bfosler.com"]);

/**
 * Preview and *.vercel.app deployments intentionally point search metadata at
 * the one public host. The legacy-domain guard prevents a stale Vercel
 * environment value from undoing the Beta Cadence migration.
 */
export const siteUrl =
  configuredSiteUrl &&
  configuredSiteOrigin &&
  !legacySiteOrigins.has(configuredSiteOrigin)
    ? configuredSiteUrl
    : defaultSiteUrl;

const parsedSiteUrl = new URL(siteUrl);

export const siteOrigin = parsedSiteUrl.origin;
export const siteHost = parsedSiteUrl.host;

export function withBasePath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export function absoluteUrl(path = "/"): string {
  return new URL(withBasePath(path), `${siteOrigin}/`).toString();
}

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  const socialImage = absoluteUrl(socialImagePath);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: socialImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: socialImage, alt: socialImageAlt }],
    },
  };
}

export function latestDate(
  values: Array<string | null | undefined>
): string | undefined {
  let latestValue: string | undefined;
  let latestTime = Number.NEGATIVE_INFINITY;

  for (const value of values) {
    if (!value) continue;

    const timestamp = Date.parse(value);
    if (!Number.isNaN(timestamp) && timestamp > latestTime) {
      latestTime = timestamp;
      latestValue = value;
    }
  }

  return latestValue;
}
