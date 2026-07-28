import type { MetadataRoute } from "next";
import { absoluteUrl, basePath, siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: basePath ? `${basePath}/` : "/",
      disallow: `${basePath}/studio/`,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteOrigin,
  };
}
