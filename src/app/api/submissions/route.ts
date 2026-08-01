import {
  getModerationConfig,
  getTurnstileConfig,
  ModerationConfigurationError,
} from "@/lib/moderation/config";
import {
  SlidingWindowRateLimiter,
  submissionRateLimitKey,
} from "@/lib/moderation/rate-limit";
import {
  createModerationClient,
  createSubmission,
} from "@/lib/moderation/sanity";
import { validateSubmission } from "@/lib/moderation/submission";
import { verifyTurnstile } from "@/lib/moderation/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maximumBodyBytes = 32_000;
const limiter = new SlidingWindowRateLimiter(5, 15 * 60 * 1_000);
const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

function json(body: unknown, status: number, additionalHeaders?: HeadersInit) {
  return Response.json(body, {
    status,
    headers: {
      ...responseHeaders,
      ...additionalHeaders,
    },
  });
}

function isPermittedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const accepted = new Set<string>();
  const canonical = process.env.CANONICAL_SITE_URL;
  if (canonical) {
    try {
      accepted.add(new URL(canonical).origin);
    } catch {
      // A malformed canonical URL should not broaden the accepted origins.
    }
  }
  if (process.env.NODE_ENV !== "production") {
    accepted.add(new URL(request.url).origin);
  }
  return accepted.has(parsedOrigin.origin);
}

async function readJsonBody(request: Request): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.toLowerCase();
  if (!contentType?.startsWith("application/json")) {
    throw new TypeError("unsupported-content-type");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maximumBodyBytes
  ) {
    throw new RangeError("body-too-large");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maximumBodyBytes) {
    throw new RangeError("body-too-large");
  }
  return JSON.parse(text) as unknown;
}

export async function POST(request: Request): Promise<Response> {
  if (!isPermittedOrigin(request)) {
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

  const rateLimit = limiter.check(submissionRateLimitKey(request.headers));
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
    const moderation = getModerationConfig();
    const turnstile = getTurnstileConfig();
    if (
      turnstile &&
      !(await verifyTurnstile({
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

    const client = createModerationClient(moderation);
    await createSubmission(client, validation.value);
    return json({ accepted: true }, 202);
  } catch (error) {
    const configurationProblem =
      error instanceof ModerationConfigurationError;
    console.error(
      configurationProblem
        ? "Private submission intake is not configured"
        : "Private submission intake failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return json(
      { error: "Private submission intake is temporarily unavailable." },
      503,
      { "Retry-After": "300" },
    );
  }
}
