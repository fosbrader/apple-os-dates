import type { NextConfig } from "next";

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePath =
  configuredBasePath === "/" ? "" : configuredBasePath.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  basePath,
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "apple-os-dates.vercel.app",
          },
        ],
        destination: "https://www.betacadence.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
