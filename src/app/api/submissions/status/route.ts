import { hasPendingSubmissionBlobs } from "@/lib/moderation/blob";
import {
  SlidingWindowRateLimiter,
  submissionRateLimitKey,
} from "@/lib/moderation/rate-limit";
import { createSubmissionStatusHandler } from "./handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new SlidingWindowRateLimiter(20, 15 * 60 * 1_000);

export const GET = createSubmissionStatusHandler({
  hasPendingSubmissions: () => hasPendingSubmissionBlobs(),
  checkRateLimit: (headers) =>
    limiter.check(submissionRateLimitKey(headers)),
});
