import { isAuthorizedCron as isAuthorizedBearer } from "@/lib/moderation/feeds";
import type { RateLimitResult } from "@/lib/moderation/rate-limit";

interface SubmissionStatusHandlerOptions {
  hasPendingSubmissions: () => Promise<boolean>;
  getMonitorSecret?: () => string | undefined;
  checkRateLimit?: (headers: Headers) => RateLimitResult;
}

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

function json(
  body: unknown,
  status: number,
  additionalHeaders?: HeadersInit,
): Response {
  return Response.json(body, {
    status,
    headers: {
      ...responseHeaders,
      ...additionalHeaders,
    },
  });
}

export function createSubmissionStatusHandler({
  hasPendingSubmissions,
  getMonitorSecret = () => process.env.SUBMISSION_MONITOR_SECRET,
  checkRateLimit = () => ({ allowed: true, retryAfterSeconds: 0 }),
}: SubmissionStatusHandlerOptions) {
  return async function GET(request: Request): Promise<Response> {
    const secret = getMonitorSecret()?.trim();
    if (!secret || secret.length < 24) {
      console.error("Submission monitoring is not configured");
      return json({ error: "Submission monitoring is unavailable." }, 503);
    }

    const rateLimit = checkRateLimit(request.headers);
    if (!rateLimit.allowed) {
      return json(
        { error: "Too many status requests." },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    if (!isAuthorizedBearer(request.headers.get("authorization"), secret)) {
      return json({ error: "Unauthorized." }, 401);
    }

    try {
      const pending = await hasPendingSubmissions();
      return json({ pending }, 200);
    } catch (error) {
      console.error(
        "Submission monitoring failed",
        error instanceof Error ? error.name : "UnknownError",
      );
      return json({ error: "Submission monitoring is unavailable." }, 503);
    }
  };
}
