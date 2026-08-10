import { createHash, timingSafeEqual } from "node:crypto";

export interface ForecastShadowRunRequest {
  requestedAt: string;
  scheduledFor: string;
}

interface ForecastShadowHandlerOptions {
  runForecastShadow: (request: ForecastShadowRunRequest) => Promise<void>;
  getForecastShadowEnabled?: () => boolean;
  getCronSecret?: () => string | undefined;
  now?: () => Date;
}

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: responseHeaders });
}

function isAuthorized(authorization: string | null, secret: string): boolean {
  const supplied = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  if (!supplied || supplied.length > 4_096) return false;

  const suppliedDigest = createHash("sha256").update(supplied).digest();
  const expectedDigest = createHash("sha256").update(secret).digest();
  return timingSafeEqual(suppliedDigest, expectedDigest);
}

function canonicalInstant(value: Date): string | null {
  return Number.isFinite(value.getTime()) ? value.toISOString() : null;
}

type ForecastShadowFailureReason =
  | "disabled"
  | "configuration"
  | "clock"
  | "pipeline";

function logFailure(reason: ForecastShadowFailureReason): void {
  console.error("forecast-shadow-failure", reason);
}

export function createForecastShadowHandler({
  runForecastShadow,
  getForecastShadowEnabled = () =>
    process.env.FORECAST_SHADOW_ENABLED === "true",
  getCronSecret = () => process.env.CRON_SECRET,
  now = () => new Date(),
}: ForecastShadowHandlerOptions) {
  let runInProgress = false;

  return async function GET(request: Request): Promise<Response> {
    if (!getForecastShadowEnabled()) {
      logFailure("disabled");
      return json({ error: "Forecast generation is unavailable." }, 503);
    }

    const secret = getCronSecret()?.trim();
    if (!secret || secret.length < 24) {
      logFailure("configuration");
      return json({ error: "Forecast generation is unavailable." }, 503);
    }

    if (!isAuthorized(request.headers.get("authorization"), secret)) {
      return json({ error: "Unauthorized." }, 401);
    }

    const requestedAt = canonicalInstant(now());
    if (!requestedAt) {
      logFailure("clock");
      return json({ error: "Forecast generation is unavailable." }, 503);
    }
    if (runInProgress) {
      return json({ error: "Forecast generation is already running." }, 409);
    }

    runInProgress = true;
    try {
      await runForecastShadow({
        requestedAt,
        scheduledFor: requestedAt.slice(0, 10),
      });
      return json({ completed: true }, 200);
    } catch {
      logFailure("pipeline");
      return json({ error: "Forecast generation failed." }, 503);
    } finally {
      runInProgress = false;
    }
  };
}
