import { googlePublisherId } from "@/lib/ads";

const googleSellerAuthorityId = "f08c47fec0942fa0";

export function GET() {
  if (!googlePublisherId) {
    return new Response("Ad seller authorization is not configured.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  return new Response(
    `google.com, ${googlePublisherId}, DIRECT, ${googleSellerAuthorityId}\n`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
