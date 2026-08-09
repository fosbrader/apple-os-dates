import assert from "node:assert/strict";
import test from "node:test";
import {
  createSubmissionOperatorHandler,
  maximumOperatorRequestBytes,
} from "../src/app/api/submissions/operator/handler";
import {
  SubmissionNotFoundError,
  SubmissionStateError,
  type StoredSubmission,
  type SubmissionQueueItem,
} from "../src/lib/moderation/blob";

const operatorSecret = "operator-secret-at-least-24-characters";
const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const alternateId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const metadata: SubmissionQueueItem = {
  id,
  submittedOn: "2026-08-08",
  storageUpdatedAt: "2026-08-08T20:40:00.000Z",
  legalHold: false,
};

const record: StoredSubmission = {
  schemaVersion: 1,
  id,
  status: "new",
  submittedAt: "2026-08-08T20:40:00.000Z",
  retentionDeleteAfter: "2027-02-04",
  kind: "correction",
  platform: "iOS",
  version: "26.0",
  summary: "A documented correction",
  details: "The submitted correction contains enough detail for review.",
  pageUrl: "https://www.versionrecord.com/apple/ios/26.0",
  sourceUrls: ["https://support.apple.com/example"],
  publicCredit: "Example contributor",
  contactEmail: "contributor@example.com",
  consentToContact: true,
  consentToPublicCredit: true,
  attestations: {
    publicEvidenceOnly: true,
    rightsToSubmit: true,
    noConfidentialInformation: true,
  },
};

function operatorRequest(
  body: string,
  {
    secret = operatorSecret,
    contentType = "application/json",
    contentLength,
  }: {
    secret?: string;
    contentType?: string;
    contentLength?: string;
  } = {},
): Request {
  const headers = new Headers({
    Authorization: `Bearer ${secret}`,
    "Content-Type": contentType,
  });
  if (contentLength !== undefined) headers.set("Content-Length", contentLength);
  return new Request(
    "https://www.versionrecord.com/api/submissions/operator/",
    { method: "POST", headers, body },
  );
}

function handler(
  overrides: Partial<
    Parameters<typeof createSubmissionOperatorHandler>[0]
  > = {},
) {
  return createSubmissionOperatorHandler({
    listSubmissions: async () => [metadata],
    getSubmission: async () => ({ record, metadata }),
    holdSubmission: async (submissionId) => ({
      id: submissionId,
      changed: true,
      legalHold: true,
    }),
    releaseSubmissionHold: async (submissionId) => ({
      id: submissionId,
      changed: true,
      legalHold: false,
    }),
    resolveSubmission: async (submissionId) => ({
      id: submissionId,
      resolved: true,
    }),
    getOperatorSecret: () => operatorSecret,
    getVercelEnvironment: () => "production",
    ...overrides,
  });
}

test("operator route fails closed outside configured Production", async () => {
  let calls = 0;
  const listSubmissions = async () => {
    calls += 1;
    return [metadata];
  };

  for (const overrides of [
    { getVercelEnvironment: () => "preview" },
    { getVercelEnvironment: () => "development" },
    { getOperatorSecret: () => undefined },
    { getOperatorSecret: () => "short" },
  ]) {
    const response = await handler({ listSubmissions, ...overrides })(
      operatorRequest("not-json"),
    );
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error: "Submission moderation is unavailable.",
    });
  }
  assert.equal(calls, 0);
});

test("operator route authenticates before reading or dispatching", async () => {
  let calls = 0;
  const configured = handler({
    listSubmissions: async () => {
      calls += 1;
      return [metadata];
    },
  });

  for (const authorization of [
    undefined,
    "Basic credentials",
    "bearer wrong",
    "Bearer wrong-secret",
    `Bearer ${"x".repeat(4_097)}`,
  ]) {
    const headers = new Headers({ "Content-Type": "application/json" });
    if (authorization) headers.set("Authorization", authorization);
    const response = await configured(
      new Request(
        "https://www.versionrecord.com/api/submissions/operator/",
        { method: "POST", headers, body: "not-json" },
      ),
    );
    assert.equal(response.status, 401);
  }
  assert.equal(calls, 0);
});

test("operator route rate limits before dispatch", async () => {
  let calls = 0;
  const response = await handler({
    listSubmissions: async () => {
      calls += 1;
      return [metadata];
    },
    checkRateLimit: () => ({ allowed: false, retryAfterSeconds: 75 }),
  })(operatorRequest(JSON.stringify({ action: "list" })));

  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "75");
  assert.equal(calls, 0);
});

test("operator route enforces JSON and declared or streamed body bounds", async () => {
  const unsupported = await handler()(
    operatorRequest(JSON.stringify({ action: "list" }), {
      contentType: "text/plain",
    }),
  );
  assert.equal(unsupported.status, 415);

  const declared = await handler()(
    operatorRequest("{}", {
      contentLength: String(maximumOperatorRequestBytes + 1),
    }),
  );
  assert.equal(declared.status, 413);

  const streamed = await handler()(
    operatorRequest("x".repeat(maximumOperatorRequestBytes + 1)),
  );
  assert.equal(streamed.status, 413);

  const malformed = await handler()(operatorRequest("{"));
  assert.equal(malformed.status, 400);
});

test("operator route rejects non-exact request shapes and identifiers", async () => {
  const invalidBodies = [
    null,
    [],
    {},
    { action: "unknown" },
    { action: "list", id },
    { action: "get" },
    { action: "get", id, extra: true },
    { action: "get", id: id.toUpperCase() },
    { action: "get", id: ` ${id}` },
    { action: "get", id: "11111111-1111-0111-8111-111111111111" },
    { action: "hold", id },
    { action: "hold", id, confirm: alternateId },
    { action: "resolve", id, confirm: id, extra: true },
  ];

  for (const body of invalidBodies) {
    const response = await handler()(operatorRequest(JSON.stringify(body)));
    assert.equal(response.status, 400, JSON.stringify(body));
    assert.deepEqual(await response.json(), {
      error: "Invalid operator request.",
    });
  }
});

test("operator list returns only allowlisted queue metadata", async () => {
  const unsafeMetadata = {
    ...metadata,
    pathname: "moderation/submissions/private.json",
    etag: "private-etag",
    contactEmail: "private@example.com",
  } as SubmissionQueueItem;
  const response = await handler({
    listSubmissions: async () => [unsafeMetadata],
  })(operatorRequest(JSON.stringify({ action: "list" })));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { items: [metadata] });
  assert.deepEqual(Object.keys(body.items[0]), [
    "id",
    "submittedOn",
    "storageUpdatedAt",
    "legalHold",
  ]);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, noarchive");
});

test("operator get returns an allowlisted private record without storage fields", async () => {
  const unsafeRecord = {
    ...record,
    pathname: "moderation/submissions/private.json",
    etag: "private-etag",
    operatorSecret,
  } as StoredSubmission;
  const unsafeMetadata = {
    ...metadata,
    pathname: "moderation/submissions/private.json",
  } as SubmissionQueueItem;
  const response = await handler({
    getSubmission: async () => ({
      record: unsafeRecord,
      metadata: unsafeMetadata,
    }),
  })(operatorRequest(JSON.stringify({ action: "get", id })));
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { record, metadata });
  assert.doesNotMatch(JSON.stringify(body), /pathname|etag|operatorSecret/);
});

test("operator get refuses a record that does not match the requested ID", async (context) => {
  context.mock.method(console, "error", () => undefined);
  const response = await handler({
    getSubmission: async () => ({
      record: { ...record, id: alternateId },
      metadata: { ...metadata, id: alternateId },
    }),
  })(operatorRequest(JSON.stringify({ action: "get", id })));

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: "Submission moderation is unavailable.",
  });
});

test("operator get refuses unsafe terminal text from private storage", async (context) => {
  context.mock.method(console, "error", () => undefined);
  const unsafeRecords: StoredSubmission[] = [
    { ...record, platform: `iOS\u009b31m` },
    { ...record, version: `26.0\u202e` },
    { ...record, summary: `${record.summary}\u2066` },
    { ...record, details: `${record.details}\u061c` },
    { ...record, details: `${record.details}\u2028` },
    { ...record, details: `${record.details}\u2029` },
    { ...record, pageUrl: `${record.pageUrl}\u200e` },
    { ...record, sourceUrls: [`${record.sourceUrls[0]}\u200f`] },
    { ...record, publicCredit: `${record.publicCredit}\u202d` },
    { ...record, contactEmail: `editor\u2069@example.com` },
  ];

  for (const unsafeRecord of unsafeRecords) {
    const response = await handler({
      getSubmission: async () => ({ record: unsafeRecord, metadata }),
    })(operatorRequest(JSON.stringify({ action: "get", id })));
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), {
      error: "Submission moderation is unavailable.",
    });
  }
});

test("operator route dispatches each mutation once with the confirmed ID", async () => {
  const calls: string[] = [];
  const configured = handler({
    holdSubmission: async (submissionId) => {
      calls.push(`hold:${submissionId}`);
      return { id: submissionId, changed: true, legalHold: true };
    },
    releaseSubmissionHold: async (submissionId) => {
      calls.push(`release-hold:${submissionId}`);
      return { id: submissionId, changed: true, legalHold: false };
    },
    resolveSubmission: async (submissionId) => {
      calls.push(`resolve:${submissionId}`);
      return { id: submissionId, resolved: true };
    },
  });

  for (const action of ["hold", "release-hold", "resolve"] as const) {
    const response = await configured(
      operatorRequest(JSON.stringify({ action, id, confirm: id })),
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.id, id);
    assert.equal(Object.hasOwn(body, "confirm"), false);
  }
  assert.deepEqual(calls, [`hold:${id}`, `release-hold:${id}`, `resolve:${id}`]);
});

test("operator errors redact identifiers, paths, contact data, and exceptions", async (context) => {
  const logs: string[] = [];
  context.mock.method(console, "error", (...values: unknown[]) => {
    logs.push(values.map(String).join(" "));
  });

  const notFound = await handler({
    getSubmission: async () => {
      throw new SubmissionNotFoundError(id);
    },
  })(operatorRequest(JSON.stringify({ action: "get", id })));
  const conflict = await handler({
    resolveSubmission: async () => {
      throw new SubmissionStateError(`Submission ${id} has a legal hold.`);
    },
  })(operatorRequest(JSON.stringify({ action: "resolve", id, confirm: id })));
  const unavailable = await handler({
    listSubmissions: async () => {
      throw new Error(
        "moderation/submissions/private@example.com/private-record.json",
      );
    },
  })(operatorRequest(JSON.stringify({ action: "list" })));

  assert.equal(notFound.status, 404);
  assert.equal(conflict.status, 409);
  assert.equal(unavailable.status, 503);
  const combined = `${await notFound.text()} ${await conflict.text()} ${await unavailable.text()} ${logs.join(" ")}`;
  assert.doesNotMatch(
    combined,
    /aaaaaaaa|moderation\/submissions|private@example|private-record/,
  );
  assert.deepEqual(logs, ["Submission operator action failed"]);
});
