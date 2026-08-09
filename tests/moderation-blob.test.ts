import assert from "node:assert/strict";
import test from "node:test";
import {
  deleteExpiredSubmissionBlobs,
  getSubmissionById,
  hasPendingSubmissionBlobs,
  listSubmissionBlobs,
  listSubmissionQueue,
  placeSubmissionLegalHold,
  releaseSubmissionLegalHold,
  resolveSubmissionById,
  serializeSubmissionBlob,
  storeSubmissionBlob,
  submissionBlobPrefix,
  submissionCleanupDays,
  submissionLegalHoldPrefix,
  submissionRetentionDays,
  SubmissionBlobSizeError,
  SubmissionStateError,
  type SubmissionBlobItem,
  type SubmissionBlobOperations,
} from "../src/lib/moderation/blob";
import {
  validateSubmission,
  type ValidSubmission,
} from "../src/lib/moderation/submission";

const submission: ValidSubmission = {
  submissionType: "correction",
  platform: "iOS",
  version: "26.3 beta 4",
  summary: "A private summary from Jane Example",
  details:
    "The public record needs review against the attached first-party source.",
  pageUrl: "https://www.versionrecord.com/apple/ios/26.3/",
  sourceUrls: ["https://developer.apple.com/example"],
  publicCredit: "Jane Example",
  contactEmail: "jane.private@example.com",
  consentToContact: true,
  consentToPublicCredit: true,
  attestations: {
    publicEvidenceOnly: true,
    rightsToSubmit: true,
    noConfidentialInformation: true,
  },
  turnstileToken: "must-not-be-persisted",
};

const submissionId = "11111111-1111-4111-8111-111111111111";
const secondId = "22222222-2222-4222-8222-222222222222";
const thirdId = "33333333-3333-4333-8333-333333333333";
const submittedAt = new Date("2026-08-08T12:00:00.000Z");

function blobItem({
  id = submissionId,
  date = "2026/08/08",
  prefix = submissionBlobPrefix,
  uploadedAt = new Date("2026-08-08T12:00:00.000Z"),
  etag = `etag-${id}`,
}: {
  id?: string;
  date?: string;
  prefix?: string;
  uploadedAt?: Date;
  etag?: string;
} = {}): SubmissionBlobItem {
  return {
    pathname: `${prefix}${date}/${id}.json`,
    uploadedAt,
    etag,
  };
}

function operations(
  overrides: Partial<SubmissionBlobOperations> = {},
): SubmissionBlobOperations {
  return {
    async put() {
      throw new Error("Unexpected put");
    },
    async get() {
      throw new Error("Unexpected get");
    },
    async list() {
      return { blobs: [], hasMore: false };
    },
    async del() {
      throw new Error("Unexpected delete");
    },
    async rename() {
      throw new Error("Unexpected rename");
    },
    ...overrides,
  };
}

function listByPrefix(items: SubmissionBlobItem[]) {
  return async (options: Parameters<SubmissionBlobOperations["list"]>[0]) => ({
    blobs: items.filter((item) => item.pathname.startsWith(options.prefix)),
    hasMore: false,
  });
}

test("automatic cleanup has a buffer before the public retention limit", () => {
  assert.equal(submissionRetentionDays, 180);
  assert.equal(submissionCleanupDays, 175);
  assert.ok(submissionCleanupDays < submissionRetentionDays);
});

test("submission serialization keeps private data out of its pathname", () => {
  const serialized = serializeSubmissionBlob(submission, {
    id: submissionId,
    submittedAt,
  });
  assert.equal(
    serialized.pathname,
    `${submissionBlobPrefix}2026/08/08/${submissionId}.json`,
  );
  for (const privateValue of [
    submission.contactEmail,
    submission.publicCredit,
    submission.summary,
    submission.pageUrl,
  ]) {
    assert.equal(serialized.pathname.includes(privateValue as string), false);
  }

  const persisted = JSON.parse(serialized.body) as Record<string, unknown>;
  assert.deepEqual(persisted, serialized.record);
  assert.equal(persisted.schemaVersion, 1);
  assert.equal(persisted.status, "new");
  assert.equal(persisted.submittedAt, "2026-08-08T12:00:00.000Z");
  assert.equal(persisted.retentionDeleteAfter, "2027-02-04");
  assert.equal(persisted.contactEmail, submission.contactEmail);
  assert.equal("turnstileToken" in persisted, false);
});

test("submission serialization rejects identifiers that could alter the path", () => {
  assert.throws(
    () =>
      serializeSubmissionBlob(submission, {
        id: "../../public/submission",
        submittedAt,
      }),
    /must be UUIDs/,
  );
});

test("submission writes use private immutable JSON options", async () => {
  let captured:
    | {
        pathname: string;
        body: string;
        options: Parameters<SubmissionBlobOperations["put"]>[2];
      }
    | undefined;
  const storage = operations({
    async put(pathname, body, options) {
      captured = { pathname, body, options };
    },
  });

  const result = await storeSubmissionBlob(submission, {
    operations: storage,
    id: submissionId,
    submittedAt,
  });

  assert.ok(captured);
  assert.equal(captured.pathname, result.pathname);
  assert.deepEqual(captured.options, {
    access: "private",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });
  assert.equal(
    (JSON.parse(captured.body) as { id: string }).id,
    submissionId,
  );
  assert.deepEqual(result, {
    id: submissionId,
    pathname: `${submissionBlobPrefix}2026/08/08/${submissionId}.json`,
    submittedAt: "2026-08-08T12:00:00.000Z",
    retentionDeleteAfter: "2027-02-04",
  });
});

test("submission writes reject canonicalized records above the private read limit", async () => {
  let putCalls = 0;
  const storage = operations({
    async put() {
      putCalls += 1;
    },
  });
  const unicodePath = "https://example.org/" + "漢".repeat(1_990);
  const rawSubmission = {
    submissionType: "correction",
    platform: "iOS",
    summary: "A valid summary",
    details: "A sufficiently long valid details field.",
    sourceUrls: [
      unicodePath,
      unicodePath + "a",
      unicodePath + "b",
      unicodePath + "c",
      unicodePath + "d",
    ],
    consentToContact: false,
    consentToPublicCredit: false,
    publicEvidenceOnly: true,
    rightsToSubmit: true,
    noConfidentialInformation: true,
  };
  assert.ok(
    new TextEncoder().encode(JSON.stringify(rawSubmission)).byteLength < 32_000,
  );
  const validation = validateSubmission(rawSubmission);
  assert.equal(validation.ok, true);
  if (!validation.ok) return;

  await assert.rejects(
    storeSubmissionBlob(validation.value, {
      operations: storage,
      id: submissionId,
      submittedAt,
    }),
    SubmissionBlobSizeError,
  );
  assert.equal(putCalls, 0);
});

test("submission listing follows cursors, filters the prefix, and deduplicates paths", async () => {
  const calls: Array<{ cursor?: string; limit: number; prefix: string }> = [];
  const first = blobItem();
  const second = blobItem({ id: secondId });
  const storage = operations({
    async list(options) {
      calls.push(options);
      if (!options.cursor) {
        return {
          blobs: [
            first,
            blobItem({
              id: thirdId,
              prefix: submissionLegalHoldPrefix,
            }),
          ],
          cursor: "page-two",
          hasMore: true,
        };
      }
      return { blobs: [first, second], hasMore: false };
    },
  });

  const results = await listSubmissionBlobs({
    operations: storage,
    pageSize: 25,
  });

  assert.deepEqual(results, [first, second]);
  assert.deepEqual(calls, [
    { prefix: submissionBlobPrefix, limit: 25 },
    { prefix: submissionBlobPrefix, limit: 25, cursor: "page-two" },
  ]);
});

test("pending checks stop on active records and include legal holds", async () => {
  const activeCalls: string[] = [];
  const activeStorage = operations({
    async list(options) {
      activeCalls.push(options.prefix);
      return {
        blobs: options.prefix === submissionBlobPrefix ? [blobItem()] : [],
        hasMore: false,
      };
    },
  });
  assert.equal(
    await hasPendingSubmissionBlobs({ operations: activeStorage }),
    true,
  );
  assert.deepEqual(activeCalls, [submissionBlobPrefix]);

  const heldCalls: string[] = [];
  const heldStorage = operations({
    async list(options) {
      heldCalls.push(options.prefix);
      return {
        blobs:
          options.prefix === submissionLegalHoldPrefix
            ? [blobItem({ prefix: submissionLegalHoldPrefix })]
            : [],
        hasMore: false,
      };
    },
  });
  assert.equal(
    await hasPendingSubmissionBlobs({ operations: heldStorage }),
    true,
  );
  assert.deepEqual(heldCalls, [
    submissionBlobPrefix,
    submissionLegalHoldPrefix,
  ]);
});

test("operator listing returns only safe metadata and legal-hold state", async () => {
  const storage = operations({
    list: listByPrefix([
      blobItem(),
      blobItem({
        id: secondId,
        prefix: submissionLegalHoldPrefix,
        uploadedAt: new Date("2026-08-09T09:30:00.000Z"),
      }),
    ]),
  });

  const queue = await listSubmissionQueue({ operations: storage });
  assert.deepEqual(queue, [
    {
      id: submissionId,
      submittedOn: "2026-08-08",
      storageUpdatedAt: "2026-08-08T12:00:00.000Z",
      legalHold: false,
    },
    {
      id: secondId,
      submittedOn: "2026-08-08",
      storageUpdatedAt: "2026-08-09T09:30:00.000Z",
      legalHold: true,
    },
  ]);
  const output = JSON.stringify(queue);
  assert.doesNotMatch(output, /Jane|private@example|developer\.apple/);
  assert.deepEqual(Object.keys(queue[0]), [
    "id",
    "submittedOn",
    "storageUpdatedAt",
    "legalHold",
  ]);
});

test("private retrieval requires an exact UUID and validates the stored record", async () => {
  const serialized = serializeSubmissionBlob(submission, {
    id: submissionId,
    submittedAt,
  });
  const storedBodyWithExtraFields = JSON.stringify({
    ...(JSON.parse(serialized.body) as Record<string, unknown>),
    internalReviewNotes: "must-not-cross-the-storage-boundary",
    turnstileToken: "must-not-be-returned",
  });
  let listCalls = 0;
  let requestedPath: string | undefined;
  const storage = operations({
    async list(options) {
      listCalls += 1;
      return {
        blobs:
          options.prefix === submissionBlobPrefix ? [blobItem()] : [],
        hasMore: false,
      };
    },
    async get(pathname, options) {
      requestedPath = pathname;
      assert.deepEqual(options, { access: "private", useCache: false });
      return {
        body: storedBodyWithExtraFields,
        etag: "etag-current",
        pathname,
        size: new TextEncoder().encode(storedBodyWithExtraFields).byteLength,
        uploadedAt: submittedAt,
      };
    },
  });

  const result = await getSubmissionById(submissionId, {
    operations: storage,
  });
  assert.equal(requestedPath, serialized.pathname);
  assert.equal(result.record.contactEmail, submission.contactEmail);
  assert.deepEqual(result.record, serialized.record);
  assert.equal("internalReviewNotes" in result.record, false);
  assert.equal("turnstileToken" in result.record, false);
  assert.deepEqual(result.metadata, {
    id: submissionId,
    submittedOn: "2026-08-08",
    storageUpdatedAt: "2026-08-08T12:00:00.000Z",
    legalHold: false,
  });

  await assert.rejects(
    getSubmissionById("../../private", { operations: storage }),
    /must be UUIDs/,
  );
  assert.equal(listCalls, 2);
});

test("legal hold moves only the exact UUID between private state prefixes", async () => {
  const active = blobItem();
  let renameCall:
    | {
        from: string;
        to: string;
        options: Parameters<SubmissionBlobOperations["rename"]>[2];
      }
    | undefined;
  const holdStorage = operations({
    list: listByPrefix([active]),
    async rename(from, to, options) {
      renameCall = { from, to, options };
    },
  });

  assert.deepEqual(
    await placeSubmissionLegalHold(submissionId, {
      operations: holdStorage,
    }),
    { id: submissionId, changed: true, legalHold: true },
  );
  assert.deepEqual(renameCall, {
    from: active.pathname,
    to: `${submissionLegalHoldPrefix}2026/08/08/${submissionId}.json`,
    options: {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 60,
      contentType: "application/json",
    },
  });

  const held = blobItem({ prefix: submissionLegalHoldPrefix });
  const releaseStorage = operations({
    list: listByPrefix([held]),
    async rename(from, to, options) {
      renameCall = { from, to, options };
    },
  });
  assert.deepEqual(
    await releaseSubmissionLegalHold(submissionId, {
      operations: releaseStorage,
    }),
    { id: submissionId, changed: true, legalHold: false },
  );
  assert.equal(renameCall?.from, held.pathname);
  assert.equal(renameCall?.to, active.pathname);

  const heldNoWrite = operations({ list: listByPrefix([held]) });
  assert.deepEqual(
    await placeSubmissionLegalHold(submissionId, {
      operations: heldNoWrite,
    }),
    { id: submissionId, changed: false, legalHold: true },
  );
});

test("resolution conditionally deletes one exact unheld record", async () => {
  const active = blobItem({ etag: "etag-exact" });
  let deleted:
    | {
        pathname: string | readonly string[];
        options: Parameters<SubmissionBlobOperations["del"]>[1];
      }
    | undefined;
  const storage = operations({
    list: listByPrefix([active]),
    async del(pathname, options) {
      deleted = { pathname, options };
    },
  });
  assert.deepEqual(
    await resolveSubmissionById(submissionId, { operations: storage }),
    { id: submissionId, resolved: true },
  );
  assert.deepEqual(deleted, {
    pathname: active.pathname,
    options: { ifMatch: "etag-exact" },
  });

  const held = blobItem({ prefix: submissionLegalHoldPrefix });
  await assert.rejects(
    resolveSubmissionById(submissionId, {
      operations: operations({ list: listByPrefix([held]) }),
    }),
    SubmissionStateError,
  );
});

test("retention deletes only expired unheld records with ETag preconditions", async () => {
  const expiredOne = blobItem({
    id: submissionId,
    date: "2026/08/01",
    uploadedAt: new Date("2026-08-01T12:00:00.000Z"),
    etag: "etag-one",
  });
  const expiredTwo = blobItem({
    id: secondId,
    date: "2026/08/02",
    uploadedAt: new Date("2026-08-02T12:00:00.000Z"),
    etag: "etag-two",
  });
  const active = blobItem({
    id: thirdId,
    date: "2026/08/03",
    uploadedAt: new Date("2026-08-03T12:00:00.001Z"),
    etag: "etag-active",
  });
  const held = blobItem({
    id: "44444444-4444-4444-8444-444444444444",
    date: "2026/01/01",
    prefix: submissionLegalHoldPrefix,
    uploadedAt: new Date("2026-01-01T00:00:00.000Z"),
    etag: "etag-held",
  });
  const deleted: Array<{
    pathname: string | readonly string[];
    ifMatch?: string;
  }> = [];
  const storage = operations({
    async list() {
      return { blobs: [expiredOne, expiredTwo, active, held], hasMore: false };
    },
    async del(pathname, options) {
      deleted.push({ pathname, ifMatch: options?.ifMatch });
    },
  });

  const result = await deleteExpiredSubmissionBlobs({
    operations: storage,
    now: new Date("2026-08-08T12:00:00.000Z"),
    retentionDays: 5,
  });

  assert.deepEqual(result, {
    scanned: 3,
    deleted: 2,
    cutoff: "2026-08-03T12:00:00.000Z",
  });
  assert.deepEqual(deleted, [
    { pathname: expiredOne.pathname, ifMatch: "etag-one" },
    { pathname: expiredTwo.pathname, ifMatch: "etag-two" },
  ]);
  assert.equal(
    deleted.some((entry) => entry.pathname === held.pathname),
    false,
  );
});

test("a released hold cannot restart the original retention clock", async () => {
  const released = blobItem({
    date: "2026/01/01",
    uploadedAt: new Date("2026-08-01T00:00:00.000Z"),
    etag: "etag-after-release",
  });
  let deleted = false;
  const storage = operations({
    list: listByPrefix([released]),
    async del() {
      deleted = true;
    },
  });

  const result = await deleteExpiredSubmissionBlobs({
    operations: storage,
    now: new Date("2026-08-08T00:00:00.000Z"),
    retentionDays: 180,
  });
  assert.equal(result.deleted, 1);
  assert.equal(deleted, true);
});

test("retention cleanup is idempotent across repeated runs", async () => {
  const expired = blobItem({
    id: submissionId,
    date: "2026/01/01",
    uploadedAt: new Date("2026-01-01T00:00:00.000Z"),
  });
  const active = blobItem({
    id: secondId,
    date: "2026/08/01",
    uploadedAt: new Date("2026-08-01T00:00:00.000Z"),
  });
  const stored = new Map<string, SubmissionBlobItem>([
    [expired.pathname, expired],
    [active.pathname, active],
  ]);
  let deleteCalls = 0;
  const storage = operations({
    async list(options) {
      return {
        blobs: [...stored.values()].filter((item) =>
          item.pathname.startsWith(options.prefix),
        ),
        hasMore: false,
      };
    },
    async del(pathnames) {
      deleteCalls += 1;
      for (const pathname of
        typeof pathnames === "string" ? [pathnames] : pathnames) {
        stored.delete(pathname);
      }
    },
  });
  const options = {
    operations: storage,
    now: new Date("2026-08-08T00:00:00.000Z"),
    retentionDays: 180,
  };

  const first = await deleteExpiredSubmissionBlobs(options);
  const second = await deleteExpiredSubmissionBlobs(options);

  assert.equal(first.deleted, 1);
  assert.equal(second.deleted, 0);
  assert.equal(deleteCalls, 1);
  assert.deepEqual([...stored.keys()], [active.pathname]);
});
