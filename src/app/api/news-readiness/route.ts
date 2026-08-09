import { articlePublishingFeatureVersion } from "@/lib/article";

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const previewConfigured = Boolean(
    process.env.SANITY_API_READ_TOKEN?.trim() &&
      process.env.ARTICLE_PREVIEW_SECRET?.trim() &&
      process.env.ARTICLE_PREVIEW_SECRET.trim().length >= 32,
  );

  return Response.json(
    {
      featureVersion: articlePublishingFeatureVersion,
      production: process.env.VERCEL_ENV === "production",
      previewConfigured,
    },
    {
      headers: {
        "cache-control": "private, no-store, max-age=0",
        "x-content-type-options": "nosniff",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    },
  );
}
