import { createClient, type SanityClient } from "@sanity/client";
import { randomUUID } from "node:crypto";
import type { ModerationConfig } from "./config";
import type { ValidSubmission } from "./submission";
import {
  buildIngestCandidate,
  type FeedSourceRecord,
  type ParsedFeedItem,
} from "./feeds";

const apiVersion = "2024-01-01";

export function createModerationClient(
  configuration: ModerationConfig,
): SanityClient {
  return createClient({
    projectId: configuration.projectId,
    dataset: configuration.dataset,
    token: configuration.token,
    apiVersion,
    useCdn: false,
  });
}

function retentionDate(submittedAt: Date): string {
  const date = new Date(submittedAt);
  date.setUTCDate(date.getUTCDate() + 180);
  return date.toISOString().slice(0, 10);
}

function targetDocumentType(
  pageUrl: string | undefined,
  version: string | undefined,
) {
  if (!pageUrl) return version ? "releaseVersion" : "unknown";
  const parts = new URL(pageUrl).pathname.split("/").filter(Boolean);
  if (parts.includes("build")) return "releaseBuild";
  if (parts[0] === "apple" && parts.length === 3) {
    return "releaseVersion";
  }
  if (parts[0] === "apple" && parts.length >= 4) {
    return "releaseEvent";
  }
  return "sitePage";
}

export function buildSubmissionDocument(
  submission: ValidSubmission,
  submittedAt = new Date(),
) {
  const targetLabel = [
    submission.platform,
    submission.version,
  ].filter(Boolean).join(" ");

  return {
    _id: `submission.${randomUUID()}`,
    _type: "submission" as const,
    kind: submission.submissionType,
    submittedAt: submittedAt.toISOString(),
    summary: submission.summary,
    details: submission.details,
    evidenceUrls: submission.sourceUrls,
    targetDocumentType: targetDocumentType(
      submission.pageUrl,
      submission.version,
    ),
    targetLabel,
    ...(submission.pageUrl ? { targetUrl: submission.pageUrl } : {}),
    ...(submission.contactEmail
      ? { submitterEmail: submission.contactEmail }
      : {}),
    ...(submission.publicCredit
      ? { requestedPublicCredit: submission.publicCredit }
      : {}),
    consentToPublicCredit: submission.consentToPublicCredit,
    attestations: submission.attestations,
    status: "new" as const,
    retentionDeleteAfter: retentionDate(submittedAt),
  };
}

export async function createSubmission(
  client: SanityClient,
  submission: ValidSubmission,
): Promise<void> {
  await client.create(buildSubmissionDocument(submission));
}

export async function getEnabledFeedSources(
  client: SanityClient,
): Promise<FeedSourceRecord[]> {
  return client.fetch<FeedSourceRecord[]>(
    `*[
      _type == "feedSource" &&
      !(_id in path("drafts.**")) &&
      enabled == true
    ] | order(coalesce(lastCheckedAt, "1970-01-01T00:00:00Z") asc, _id asc)[0...6] {
      _id,
      name,
      publisher,
      feedUrl,
      feedKind
    }`,
    {},
    { perspective: "raw" },
  );
}

export async function createNewFeedCandidates(
  client: SanityClient,
  source: FeedSourceRecord,
  items: ParsedFeedItem[],
  discoveredAt = new Date().toISOString(),
): Promise<number> {
  const candidates = items
    .slice(0, 15)
    .map((item) => buildIngestCandidate(source, item, discoveredAt));
  if (candidates.length === 0) return 0;

  const existingUrls = new Set(
    await client.fetch<string[]>(
      `*[
        _type == "ingestCandidate" &&
        canonicalUrl in $urls
      ].canonicalUrl`,
      { urls: candidates.map((candidate) => candidate.canonicalUrl) },
      { perspective: "raw" },
    ),
  );
  const newCandidates = candidates.filter(
    (candidate) => !existingUrls.has(candidate.canonicalUrl),
  );
  if (newCandidates.length === 0) return 0;

  const transaction = client.transaction();
  for (const candidate of newCandidates) {
    transaction.createIfNotExists(candidate);
  }
  await transaction.commit();

  return newCandidates.length;
}

export async function recordFeedCheck(
  client: SanityClient,
  sourceId: string,
  checkedAt: string,
  error?: string,
): Promise<void> {
  const patch = client
    .patch(sourceId.replace(/^drafts\./, ""))
    .set({
      lastCheckedAt: checkedAt,
    });
  if (error) {
    patch.set({ lastError: error.slice(0, 3_000) });
  } else {
    patch.unset(["lastError"]);
  }
  await patch.commit();
}
