import {
  getFeedIngestConfig,
  getModerationConfig,
  ModerationConfigurationError,
} from "@/lib/moderation/config";
import {
  fetchAllowlistedFeed,
  isAuthorizedCron,
  type FeedSourceRecord,
} from "@/lib/moderation/feeds";
import {
  createModerationClient,
  createNewFeedCandidates,
  getEnabledFeedSources,
  recordFeedCheck,
} from "@/lib/moderation/sanity";
import type { SanityClient } from "@sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

let runInProgress = false;

interface FeedResult {
  discovered: number;
  failed: boolean;
}

function response(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, noarchive",
    },
  });
}

function safeError(error: unknown): string {
  if (!(error instanceof Error)) return "Feed check failed.";
  return error.message
    .replace(/https?:\/\/\S+/gi, "[feed URL]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

async function ingestOneFeed(
  client: SanityClient,
  source: FeedSourceRecord,
  allowedHosts: ReadonlySet<string>,
): Promise<FeedResult> {
  const checkedAt = new Date().toISOString();
  try {
    const items = await fetchAllowlistedFeed({ source, allowedHosts });
    const discovered = await createNewFeedCandidates(
      client,
      source,
      items,
      checkedAt,
    );
    await recordFeedCheck(client, source._id, checkedAt);
    return { discovered, failed: false };
  } catch (error) {
    await recordFeedCheck(
      client,
      source._id,
      checkedAt,
      safeError(error),
    ).catch(() => undefined);
    return { discovered: 0, failed: true };
  }
}

export async function GET(request: Request): Promise<Response> {
  let feedConfiguration;
  try {
    feedConfiguration = getFeedIngestConfig();
  } catch (error) {
    console.error(
      "Private feed ingestion is not configured",
      error instanceof ModerationConfigurationError
        ? error.name
        : "UnknownError",
    );
    return response({ error: "Feed ingestion is unavailable." }, 503);
  }

  if (
    !isAuthorizedCron(
      request.headers.get("authorization"),
      feedConfiguration.cronSecret,
    )
  ) {
    return response({ error: "Unauthorized." }, 401);
  }

  let moderationConfiguration;
  try {
    moderationConfiguration = getModerationConfig();
  } catch (error) {
    console.error(
      "Private feed ingestion is not configured",
      error instanceof ModerationConfigurationError
        ? error.name
        : "UnknownError",
    );
    return response({ error: "Feed ingestion is unavailable." }, 503);
  }
  if (runInProgress) {
    return response({ error: "A feed check is already running." }, 409);
  }

  runInProgress = true;
  try {
    const client = createModerationClient(moderationConfiguration);
    const sources = await getEnabledFeedSources(client);
    const results: FeedResult[] = [];

    for (let index = 0; index < sources.length; index += 3) {
      const batch = sources.slice(index, index + 3);
      results.push(
        ...(await Promise.all(
          batch.map((source) =>
            ingestOneFeed(
              client,
              source,
              feedConfiguration.allowedHosts,
            ),
          ),
        )),
      );
    }

    return response({
      checked: sources.length,
      candidatesCreated: results.reduce(
        (total, result) => total + result.discovered,
        0,
      ),
      failed: results.filter((result) => result.failed).length,
      publicationBlocked: true,
    });
  } catch (error) {
    console.error(
      "Private feed ingestion failed",
      error instanceof Error ? error.name : "UnknownError",
    );
    return response({ error: "Feed ingestion failed." }, 503);
  } finally {
    runInProgress = false;
  }
}
