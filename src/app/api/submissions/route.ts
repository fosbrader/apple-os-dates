import { storeSubmissionBlob } from "@/lib/moderation/blob";
import { getTurnstileConfig } from "@/lib/moderation/config";
import { checkBotId } from "botid/server";
import {
  SlidingWindowRateLimiter,
  submissionRateLimitKey,
} from "@/lib/moderation/rate-limit";
import { verifyTurnstile } from "@/lib/moderation/turnstile";
import { createSubmissionHandler } from "./handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const limiter = new SlidingWindowRateLimiter(5, 15 * 60 * 1_000);
export const POST = createSubmissionHandler({
  storeSubmission: (submission) => storeSubmissionBlob(submission),
  checkBot: () =>
    checkBotId({
      advancedOptions: { checkLevel: "basic" },
    }),
  getTurnstileConfiguration: () => getTurnstileConfig(),
  verifyChallenge: verifyTurnstile,
  checkRateLimit: (headers) =>
    limiter.check(submissionRateLimitKey(headers)),
});
