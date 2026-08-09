import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { verifyArticlePreviewToken } from "@/lib/article-preview";

export const dynamic = "force-dynamic";

function privateResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: {
      "cache-control": "private, no-store, max-age=0",
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const previewSecret = process.env.ARTICLE_PREVIEW_SECRET?.trim();
  const readToken = process.env.SANITY_API_READ_TOKEN?.trim();
  if (!previewSecret || !readToken) {
    return privateResponse("Article preview is not configured.", 503);
  }

  const requestUrl = new URL(request.url);
  const signedToken = requestUrl.searchParams.get("token")?.trim();
  if (!signedToken) {
    return privateResponse("A signed preview token is required.", 401);
  }

  const payload = verifyArticlePreviewToken({
    token: signedToken,
    secret: previewSecret,
  });
  if (!payload) {
    return privateResponse("The preview link is invalid or expired.", 401);
  }

  const draft = await draftMode();
  draft.enable();

  const destination = new URL(
    `/news/${encodeURIComponent(payload.slug)}/`,
    requestUrl.origin,
  );
  const response = NextResponse.redirect(destination, 303);
  response.headers.set(
    "cache-control",
    "private, no-store, max-age=0",
  );
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  return response;
}
