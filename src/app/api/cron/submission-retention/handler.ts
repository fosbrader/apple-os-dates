import { isAuthorizedCron } from "@/lib/moderation/feeds";

interface SubmissionRetentionHandlerOptions {
  deleteExpiredSubmissions: () => Promise<unknown>;
  getCronSecret?: () => string | undefined;
}

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: responseHeaders,
  });
}

export function createSubmissionRetentionHandler({
  deleteExpiredSubmissions,
  getCronSecret = () => process.env.CRON_SECRET,
}: SubmissionRetentionHandlerOptions) {
  return async function GET(request: Request): Promise<Response> {
    const secret = getCronSecret()?.trim();
    if (!secret || secret.length < 24) {
      console.error("Submission retention is not configured");
      return json({ error: "Submission retention is unavailable." }, 503);
    }

    if (!isAuthorizedCron(request.headers.get("authorization"), secret)) {
      return json({ error: "Unauthorized." }, 401);
    }

    try {
      await deleteExpiredSubmissions();
      return json({ completed: true }, 200);
    } catch (error) {
      console.error(
        "Submission retention failed",
        error instanceof Error ? error.name : "UnknownError",
      );
      return json({ error: "Submission retention failed." }, 503);
    }
  };
}
