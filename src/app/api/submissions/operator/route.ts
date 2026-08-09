import {
  getSubmissionById,
  listSubmissionQueue,
  placeSubmissionLegalHold,
  releaseSubmissionLegalHold,
  resolveSubmissionById,
} from "@/lib/moderation/blob";
import {
  SlidingWindowRateLimiter,
  submissionRateLimitKey,
} from "@/lib/moderation/rate-limit";
import { createSubmissionOperatorHandler } from "./handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const limiter = new SlidingWindowRateLimiter(60, 15 * 60 * 1_000);

export const POST = createSubmissionOperatorHandler({
  listSubmissions: () => listSubmissionQueue(),
  getSubmission: (id) => getSubmissionById(id),
  holdSubmission: (id) => placeSubmissionLegalHold(id),
  releaseSubmissionHold: (id) => releaseSubmissionLegalHold(id),
  resolveSubmission: (id) => resolveSubmissionById(id),
  checkRateLimit: (headers) =>
    limiter.check(submissionRateLimitKey(headers)),
});
