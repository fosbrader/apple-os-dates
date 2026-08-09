import {
  SubmissionNotFoundError,
  SubmissionStateError,
  type StoredSubmission,
  type SubmissionQueueItem,
} from "@/lib/moderation/blob";
import { isAuthorizedCron as isAuthorizedBearer } from "@/lib/moderation/feeds";
import type { RateLimitResult } from "@/lib/moderation/rate-limit";
import {
  containsUnsafeSubmissionCharacters,
  submissionKinds,
} from "@/lib/moderation/submission";

export const maximumOperatorRequestBytes = 2_048;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, noarchive",
};

type OperatorAction =
  | { action: "list" }
  | { action: "get"; id: string }
  | {
      action: "hold" | "release-hold" | "resolve";
      id: string;
      confirm: string;
    };

interface SubmissionOperatorHandlerOptions {
  listSubmissions: () => Promise<SubmissionQueueItem[]>;
  getSubmission: (id: string) => Promise<{
    record: StoredSubmission;
    metadata: SubmissionQueueItem;
  }>;
  holdSubmission: (
    id: string,
  ) => Promise<{ id: string; changed: boolean; legalHold: true }>;
  releaseSubmissionHold: (
    id: string,
  ) => Promise<{ id: string; changed: boolean; legalHold: false }>;
  resolveSubmission: (
    id: string,
  ) => Promise<{ id: string; resolved: true }>;
  getOperatorSecret?: () => string | undefined;
  getVercelEnvironment?: () => string | undefined;
  checkRateLimit?: (headers: Headers) => RateLimitResult;
}

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

function plainRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null
    ? (value as Record<string, unknown>)
    : null;
}

function hasExactKeys(
  record: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  const actual = Object.keys(record).sort();
  const required = [...expected].sort();
  return (
    actual.length === required.length &&
    actual.every((key, index) => key === required[index])
  );
}

function canonicalUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

function operatorAction(value: unknown): OperatorAction | null {
  const record = plainRecord(value);
  if (!record || typeof record.action !== "string") return null;

  if (record.action === "list") {
    return hasExactKeys(record, ["action"]) ? { action: "list" } : null;
  }

  if (record.action === "get") {
    return hasExactKeys(record, ["action", "id"]) &&
      canonicalUuid(record.id)
      ? { action: "get", id: record.id }
      : null;
  }

  if (
    record.action === "hold" ||
    record.action === "release-hold" ||
    record.action === "resolve"
  ) {
    if (
      !hasExactKeys(record, ["action", "id", "confirm"]) ||
      !canonicalUuid(record.id) ||
      record.confirm !== record.id
    ) {
      return null;
    }
    return {
      action: record.action,
      id: record.id,
      confirm: record.id,
    };
  }

  return null;
}

async function readJsonBody(request: Request): Promise<unknown> {
  const declaredLengthHeader = request.headers.get("content-length");
  if (declaredLengthHeader !== null) {
    const declaredLength = Number(declaredLengthHeader);
    if (
      Number.isFinite(declaredLength) &&
      declaredLength > maximumOperatorRequestBytes
    ) {
      throw new RangeError("body-too-large");
    }
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
      if (byteLength > maximumOperatorRequestBytes) {
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

function validIsoDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}

function safeQueueItem(item: SubmissionQueueItem): SubmissionQueueItem {
  if (
    !canonicalUuid(item.id) ||
    !datePattern.test(item.submittedOn) ||
    !validIsoDate(item.storageUpdatedAt) ||
    typeof item.legalHold !== "boolean"
  ) {
    throw new Error("invalid-queue-record");
  }
  return {
    id: item.id,
    submittedOn: item.submittedOn,
    storageUpdatedAt: item.storageUpdatedAt,
    legalHold: item.legalHold,
  };
}

function optionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function safeStoredSubmission(record: StoredSubmission): StoredSubmission {
  if (
    record.schemaVersion !== 1 ||
    record.status !== "new" ||
    !canonicalUuid(record.id) ||
    !validIsoDate(record.submittedAt) ||
    !datePattern.test(record.retentionDeleteAfter) ||
    !submissionKinds.includes(record.kind) ||
    typeof record.platform !== "string" ||
    !optionalString(record.version) ||
    typeof record.summary !== "string" ||
    typeof record.details !== "string" ||
    !optionalString(record.pageUrl) ||
    !Array.isArray(record.sourceUrls) ||
    !record.sourceUrls.every((url) => typeof url === "string") ||
    !optionalString(record.publicCredit) ||
    !optionalString(record.contactEmail) ||
    typeof record.consentToContact !== "boolean" ||
    typeof record.consentToPublicCredit !== "boolean" ||
    !plainRecord(record.attestations) ||
    record.attestations.publicEvidenceOnly !== true ||
    record.attestations.rightsToSubmit !== true ||
    record.attestations.noConfidentialInformation !== true
  ) {
    throw new Error("invalid-private-record");
  }

  const projectedText = [
    record.platform,
    record.version,
    record.summary,
    record.details,
    record.pageUrl,
    ...record.sourceUrls,
    record.publicCredit,
    record.contactEmail,
  ].filter((value): value is string => typeof value === "string");
  if (projectedText.some(containsUnsafeSubmissionCharacters)) {
    throw new Error("invalid-private-record");
  }

  return {
    schemaVersion: 1,
    id: record.id,
    status: "new",
    submittedAt: record.submittedAt,
    retentionDeleteAfter: record.retentionDeleteAfter,
    kind: record.kind,
    platform: record.platform,
    ...(record.version !== undefined ? { version: record.version } : {}),
    summary: record.summary,
    details: record.details,
    ...(record.pageUrl !== undefined ? { pageUrl: record.pageUrl } : {}),
    sourceUrls: [...record.sourceUrls],
    ...(record.publicCredit !== undefined
      ? { publicCredit: record.publicCredit }
      : {}),
    ...(record.contactEmail !== undefined
      ? { contactEmail: record.contactEmail }
      : {}),
    consentToContact: record.consentToContact,
    consentToPublicCredit: record.consentToPublicCredit,
    attestations: {
      publicEvidenceOnly: true,
      rightsToSubmit: true,
      noConfidentialInformation: true,
    },
  };
}

function safeHoldResult(
  id: string,
  result: { id: string; changed: boolean; legalHold: boolean },
  legalHold: boolean,
) {
  if (
    result.id !== id ||
    !canonicalUuid(result.id) ||
    typeof result.changed !== "boolean" ||
    result.legalHold !== legalHold
  ) {
    throw new Error("invalid-mutation-result");
  }
  return {
    id: result.id,
    changed: result.changed,
    legalHold,
  };
}

function safeResolveResult(
  id: string,
  result: { id: string; resolved: boolean },
) {
  if (result.id !== id || !canonicalUuid(result.id) || result.resolved !== true) {
    throw new Error("invalid-mutation-result");
  }
  return { id: result.id, resolved: true };
}

export function createSubmissionOperatorHandler({
  listSubmissions,
  getSubmission,
  holdSubmission,
  releaseSubmissionHold,
  resolveSubmission,
  getOperatorSecret = () => process.env.SUBMISSION_OPERATOR_SECRET,
  getVercelEnvironment = () => process.env.VERCEL_ENV,
  checkRateLimit = () => ({ allowed: true, retryAfterSeconds: 0 }),
}: SubmissionOperatorHandlerOptions) {
  return async function POST(request: Request): Promise<Response> {
    const secret = getOperatorSecret()?.trim();
    if (getVercelEnvironment() !== "production" || !secret || secret.length < 24) {
      return json({ error: "Submission moderation is unavailable." }, 503);
    }

    const rateLimit = checkRateLimit(request.headers);
    if (!rateLimit.allowed) {
      return json(
        { error: "Too many operator requests." },
        429,
        { "Retry-After": String(rateLimit.retryAfterSeconds) },
      );
    }

    if (!isAuthorizedBearer(request.headers.get("authorization"), secret)) {
      return json({ error: "Unauthorized." }, 401);
    }

    const contentType = request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase();
    if (contentType !== "application/json") {
      return json({ error: "Invalid operator request." }, 415);
    }

    let input: unknown;
    try {
      input = await readJsonBody(request);
    } catch (error) {
      return json(
        { error: "Invalid operator request." },
        error instanceof RangeError ? 413 : 400,
      );
    }

    const action = operatorAction(input);
    if (!action) {
      return json({ error: "Invalid operator request." }, 400);
    }

    try {
      if (action.action === "list") {
        const items = (await listSubmissions()).map(safeQueueItem);
        return json({ items }, 200);
      }

      if (action.action === "get") {
        const result = await getSubmission(action.id);
        const record = safeStoredSubmission(result.record);
        const metadata = safeQueueItem(result.metadata);
        if (record.id !== action.id || metadata.id !== action.id) {
          throw new Error("invalid-private-record-identity");
        }
        return json(
          {
            record,
            metadata,
          },
          200,
        );
      }

      if (action.action === "hold") {
        const result = await holdSubmission(action.id);
        return json(safeHoldResult(action.id, result, true), 200);
      }

      if (action.action === "release-hold") {
        const result = await releaseSubmissionHold(action.id);
        return json(safeHoldResult(action.id, result, false), 200);
      }

      const result = await resolveSubmission(action.id);
      return json(safeResolveResult(action.id, result), 200);
    } catch (error) {
      if (error instanceof SubmissionNotFoundError) {
        return json({ error: "Submission was not found." }, 404);
      }
      if (error instanceof SubmissionStateError) {
        return json(
          { error: "Submission state did not permit that action." },
          409,
        );
      }
      console.error("Submission operator action failed");
      return json({ error: "Submission moderation is unavailable." }, 503);
    }
  };
}
