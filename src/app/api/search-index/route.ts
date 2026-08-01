import { getResearchSearchIndex } from "@/lib/research/search";

export const revalidate = 300;

export async function GET(): Promise<Response> {
  try {
    const index = await getResearchSearchIndex();
    return new Response(JSON.stringify(index), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, noarchive",
      },
    });
  } catch (error) {
    console.error("Research search index failed", error);
    return Response.json(
      { error: "Search index is temporarily unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "60",
          "X-Content-Type-Options": "nosniff",
          "X-Robots-Tag": "noindex, noarchive",
        },
      },
    );
  }
}
