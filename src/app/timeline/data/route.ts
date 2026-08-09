import { NextResponse } from "next/server";
import { getTimelinePageData } from "@/lib/timeline";

export const revalidate = 300;

/**
 * The interactive archive loads separately from the crawlable timeline page.
 * This prevents every timeline marker from being serialized into the initial
 * HTML document while keeping the exact same public data available to users.
 */
export async function GET() {
  const { timeline } = await getTimelinePageData();

  return NextResponse.json(timeline, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
