import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const draft = await draftMode();
  draft.disable();

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.headers.set(
    "cache-control",
    "private, no-store, max-age=0",
  );
  response.headers.set("x-robots-tag", "noindex, nofollow, noarchive");
  return response;
}
