import type { TurnstileConfig } from "@/lib/moderation/config";
import { SubmissionBlobSizeError } from "@/lib/moderation/blob";
import type { RateLimitResult } from "@/lib/moderation/rate-limit";
import {
  validateSubmission,
  type ValidSubmission,
} from "@/lib/moderation/submission";
import type { verifyTurnstile } from "@/lib/moderation/turnstile";
import { siteOrigin } from "@/lib/site";

const maximumBodyBytes = 32_000;
const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

interface SubmissionHandlerOptions {
  storeSubmission: (submission: ValidSubmission) => Promise<unknown>;
  checkBot: () => Promise<{ isBot: boolean }>;
  getTurnstileConfiguration: () => TurnstileConfig | null;
  verifyChallenge: typeof verifyTurnstile;
  checkRateLimit: (headers: Headers) => RateLimitResult;
}

function json(body: unknown, status: number, additionalHeaders?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      ...responseHeaders,
      ...additionalHeaders,
    },
  });
}

export function isPermittedSubmissionOrigin(
  request: Request,
  {
    canonicalOrigin = siteOrigin,
    vercelEnvironment = process.env.VERCEL_ENV,
    deploymentHost = process.env.VERCEL_URL,
  }: {
    canonicalOrigin?: string;
    vercelEnvironment?: string;
    deploymentHost?: string;
  } = {},
): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const accepted = new Set<string>([canonicalOrigin]);
  if (vercelEnvironment !== "production") {
    try {
      accepted.add(new URL(request.url).origin);
    } catch {
      // A malformed request URL must not broaden the accepted origins.
    }

    const normalizedDeploymentHost = deploymentHost?.trim();
    if (normalizedDeploymentHost) {
      try {
        accepted.add(
          new URL(`https://${normalizedDeploymentHost}`).origin,
        );
      } catch {
        // A malformed deployment host must not broaden the accepted origins.
      }
    }
  }

  return accepted.has(parsedOrigin.origin);
}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    throw new TypeError("unsupported-content-type");
  }

  const declaredLengthHeader = request.headers.get("content-length");
  const declaredLength = Number(declaredLengthHeader);
  if (
    declaredLengthHeader !== null &&
    Number.isFinite(declaredLength) &&
    declaredLength > maximumBodyBytes
  ) {
    throw new RangeError("body-too-large");
  }

  if (!request.body) return JSON.parse("") as unknown;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteLength = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      byteLength += value.byteLength;
      if (byteLength > maximumBodyBytes) {
        await reader.cancel("body-too-large").catch(() => undefined);
        throw new RangeError("body-too-large");
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  return JSON.parse(text) as unknown;
}

export function createSubmissionHandler({
  storeSubmission,
  checkBot,
  getTurnstileConfiguration,
  verifyChallenge,
  checkRateLimit,
}: SubmissionHandlerOptions) {
  return async function POST(request: Request): Promise<Response> {
    if (!isPermittedSubmissionOrigin(request)) {
      return json({ error: "Request origin was not accepted." }, 403);
    }

    let input: unknown;
    try {
      input = await readJsonBody(request);
    } catch (error) {
      if (error instanceof RangeError) {
        return json({ error: "Submission is too large." }, 413);
      }
      if (error instanceof TypeError) {
        return json({ error: "Send the submission as JSON." }, 415);
      }
      return json({ error: "Send a valid JSON submission." }, 400);
    }

    if (
      input &&
      typeof input === "object" &&
      !Array.isArray(input) &&
      typeof (input as Record<string, unknown>).website === "string" &&
      (input as Record<string, string>).website.trim()
    ) {
      return json({ accepted: true }, 202);
    }

    const rateLimit = checkRateLimit(request.headers);
    if (!rateLimit.allowed) {
      return json(
        { error: "Too many submissions. Please try again later." },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    const validation = validateSubmission(input);
    if (!validation.ok) {
      return json(
        {
          error: "Check the highlighted submission fields.",
          fields: validation.errors,
        },
        400,
      );
    }

    try {
      if ((await checkBot()).isBot) {
        return json({ error: "The request could not be verified." }, 403);
      }
    } catch (error) {
      console.error(
        "Submission bot verification failed",
        error instanceof Error ? error.name : "UnknownError",
      );
      return json(
        { error: "Private submission intake is temporarily unavailable." },
        503,
        { "Retry-After": "300" },
      );
    }

    try {
      const turnstile = getTurnstileConfiguration();
      if (
        turnstile &&
        !(await verifyChallenge({
          secretKey: turnstile.secretKey,
          token: validation.value.turnstileToken ?? "",
          expectedHostname: new URL(
            request.headers.get("origin") as string,
          ).hostname,
        }))
      ) {
        return json(
          { error: "The anti-abuse check could not be verified." },
          400,
        );
      }

      await storeSubmission(validation.value);
      return json({ accepted: true }, 202);
    } catch (error) {
      if (error instanceof SubmissionBlobSizeError) {
        return json({ error: "Submission is too large." }, 413);
      }
      console.error(
        "Private submission intake failed",
        error instanceof Error ? error.name : "UnknownError",
      );
      return json(
        { error: "Private submission intake is temporarily unavailable." },
        503,
        { "Retry-After": "300" },
      );
    }
  };
}
