import type { Metadata } from "next";

const defaultSiteUrl = "https://www.versionrecord.com";

export const siteName = "Version Record";
export const siteDescription =
  "Independent, source-backed software release histories with beta timelines, builds, release notes, citations, and corrections. Apple is the first catalog.";
export const socialImagePath = "/og.png";
export const siteXHandle = "@versionrecordhq";
export const siteXUrl = "https://x.com/versionrecordhq";
export const socialImageAlt =
  "Version Record — a source-backed history of software releases";

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
const legacySiteOrigins = new Set([
  "https://art.bfosler.com",
]);

/**
 * Preview and *.vercel.app deployments intentionally point search metadata at
 * the one public host. The legacy-domain guard prevents a stale Vercel
 * environment value from undoing the Version Record migration.
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
  /**
   * Routes with a file-convention opengraph-image/twitter-image must not
   * stamp the static og.png: an explicit `images` value in the same
   * segment outranks the generated image, so those routes pass false.
   */
  socialImage?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  socialImage = true,
}: PageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const socialTitle = absoluteTitle ? title : `${title} | ${siteName}`;
  const socialImageUrl = absoluteUrl(socialImagePath);

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
      ...(socialImage
        ? {
            images: [
              {
                url: socialImageUrl,
                width: 1200,
                height: 630,
                type: "image/png",
                alt: socialImageAlt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: siteXHandle,
      title: socialTitle,
      description,
      ...(socialImage
        ? { images: [{ url: socialImageUrl, alt: socialImageAlt }] }
        : {}),
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
