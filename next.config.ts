import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";
import { createSiteBuildMetadata } from "./src/lib/site-version";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePath =
  configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");
const siteBuildMetadata = createSiteBuildMetadata();
const applePlatforms = [
  "ios",
  "ipados",
  "macos",
  "watchos",
  "tvos",
  "visionos",
];
const legacyHosts = [
  "apple-os-dates.vercel.app",
];
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/**
 * Canonical URLs are bimodal: leaf segments containing a period (version
 * numbers, build slugs) have no trailing slash, everything else does. A
 * destination with the wrong shape triggers a second trailing-slash
 * normalization redirect, so each legacy source gets two rules: a
 * dotted-leaf rule first, then a slash-appending catch-all.
 */
function legacyPlatformRedirects(
  platform: string,
  destinationPrefix: string,
  has?: Array<{ type: "host"; value: string }>,
) {
  return [
    {
      source: `/${platform}/:path*/:leaf([^/]+\\.[^/]+)`,
      ...(has ? { has } : {}),
      destination: `${destinationPrefix}/apple/${platform}/:path*/:leaf`,
      permanent: true,
    },
    {
      source: `/${platform}/:path*`,
      ...(has ? { has } : {}),
      destination: `${destinationPrefix}/apple/${platform}/:path*/`,
      permanent: true,
    },
  ];
}

const nextConfig: NextConfig = {
  basePath,
  poweredByHeader: false,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_SITE_VERSION: siteBuildMetadata.version,
    NEXT_PUBLIC_SITE_UPDATED_AT: siteBuildMetadata.updatedAt,
  },
  // The OG image routes read the vendored fonts at runtime; make sure
  // serverless output tracing bundles them.
  outputFileTracingIncludes: {
    "/**": ["./src/assets/fonts/*.woff"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      ...legacyHosts.flatMap((host) =>
        applePlatforms.flatMap((platform) =>
          legacyPlatformRedirects(
            platform,
            "https://www.versionrecord.com",
            [{ type: "host" as const, value: host }],
          ),
        ),
      ),
      ...legacyHosts.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.versionrecord.com/:path*",
        permanent: true,
      })),
      ...applePlatforms.flatMap((platform) =>
        legacyPlatformRedirects(platform, ""),
      ),
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withBotId(nextConfig);
