import { del, get, list, put, rename } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import {
  validateSubmission,
  type ValidSubmission,
} from "./submission";

export const submissionBlobPrefix = "moderation/submissions/";
export const submissionLegalHoldPrefix = "moderation/legal-holds/";
export const submissionRetentionDays = 180;
export const submissionCleanupDays = 175;

const dayMilliseconds = 24 * 60 * 60 * 1_000;
const maximumListPageSize = 1_000;
const maximumSubmissionBlobBytes = 64 * 1_024;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const submissionPathPattern =
  /^moderation\/(submissions|legal-holds)\/(\d{4})\/(\d{2})\/(\d{2})\/([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.json$/i;

export interface StoredSubmission {
  schemaVersion: 1;
  id: string;
  status: "new";
  submittedAt: string;
  retentionDeleteAfter: string;
  kind: ValidSubmission["submissionType"];
  platform: string;
  version?: string;
  summary: string;
  details: string;
  pageUrl?: string;
  sourceUrls: string[];
  publicCredit?: string;
  contactEmail?: string;
  consentToContact: boolean;
  consentToPublicCredit: boolean;
  attestations: ValidSubmission["attestations"];
}

export interface SubmissionBlobItem {
  pathname: string;
  uploadedAt: Date | string;
  etag: string;
}

export class SubmissionBlobSizeError extends Error {
  constructor() {
    super("The private submission exceeds the storage size limit.");
    this.name = "SubmissionBlobSizeError";
  }
}

interface SubmissionBlobPutOptions {
  access: "private";
  addRandomSuffix: false;
  cacheControlMaxAge: number;
  contentType: "application/json";
}

interface SubmissionBlobGetOptions {
  access: "private";
  useCache: false;
}

interface SubmissionBlobGetResult {
  body: string;
  etag: string;
  pathname: string;
  size: number;
  uploadedAt: Date | string;
}

interface SubmissionBlobDeleteOptions {
  ifMatch?: string;
}

interface SubmissionBlobRenameOptions extends SubmissionBlobPutOptions {
  allowOverwrite: false;
  ifMatch?: string;
}

interface SubmissionBlobListOptions {
  prefix: string;
  limit: number;
  cursor?: string;
}

interface SubmissionBlobListPage {
  blobs: readonly SubmissionBlobItem[];
  cursor?: string;
  hasMore: boolean;
}

/**
 * Small adapter surface that keeps storage and retention behavior testable
 * without contacting Vercel. Route code normally uses the default operations.
 */
export interface SubmissionBlobOperations {
  put(
    pathname: string,
    body: string,
    options: SubmissionBlobPutOptions,
  ): Promise<unknown>;
  get(
    pathname: string,
    options: SubmissionBlobGetOptions,
  ): Promise<SubmissionBlobGetResult | null>;
  list(options: SubmissionBlobListOptions): Promise<SubmissionBlobListPage>;
  del(
    pathnames: string | readonly string[],
    options?: SubmissionBlobDeleteOptions,
  ): Promise<void>;
  rename(
    fromPathname: string,
    toPathname: string,
    options: SubmissionBlobRenameOptions,
  ): Promise<void>;
}

const vercelBlobOperations: SubmissionBlobOperations = {
  async put(pathname, body, options) {
    await put(pathname, body, options);
  },
  async get(pathname, options) {
    const result = await get(pathname, options);
    if (!result) return null;
    if (result.statusCode !== 200 || !result.stream) {
      throw new Error("The private submission could not be read.");
    }
    if (result.blob.size > maximumSubmissionBlobBytes) {
      throw new Error("The private submission exceeds the size limit.");
    }
    const body = await new Response(result.stream).text();
    if (new TextEncoder().encode(body).byteLength > maximumSubmissionBlobBytes) {
      throw new Error("The private submission exceeds the size limit.");
    }
    return {
      body,
      etag: result.blob.etag,
      pathname: result.blob.pathname,
      size: result.blob.size,
      uploadedAt: result.blob.uploadedAt,
    };
  },
  async list(options) {
    const page = await list(options);
    return {
      blobs: page.blobs.map((blob) => ({
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
        etag: blob.etag,
      })),
      cursor: page.cursor,
      hasMore: page.hasMore,
    };
  },
  async del(pathnames, options) {
    await del(
      typeof pathnames === "string" ? pathnames : [...pathnames],
      options,
    );
  },
  async rename(fromPathname, toPathname, options) {
    await rename(fromPathname, toPathname, options);
  },
};

function validDate(value: Date, label: string): Date {
  if (!Number.isFinite(value.getTime())) {
    throw new TypeError(`${label} must be a valid date.`);
  }
  return value;
}

function retentionDate(submittedAt: Date): string {
  const date = new Date(submittedAt);
  date.setUTCDate(date.getUTCDate() + submissionRetentionDays);
  return date.toISOString().slice(0, 10);
}

function checkedSubmissionId(id: string): string {
  const normalized = id.trim().toLowerCase();
  if (!uuidPattern.test(normalized)) {
    throw new TypeError("Submission IDs must be UUIDs.");
  }
  return normalized;
}

function privatePath(
  id: string,
  submittedAt: Date,
  prefix = submissionBlobPrefix,
): string {
  const normalizedId = checkedSubmissionId(id);
  const [year, month, day] = submittedAt.toISOString().slice(0, 10).split("-");
  return `${prefix}${year}/${month}/${day}/${normalizedId}.json`;
}

interface SubmissionPathIdentity {
  date: string;
  id: string;
  legalHold: boolean;
}

function submissionPathIdentity(pathname: string): SubmissionPathIdentity {
  const match = submissionPathPattern.exec(pathname);
  if (!match) {
    throw new Error("A private submission has an invalid storage path.");
  }

  const [, location, year, month, day, id] = match;
  const date = `${year}-${month}-${day}`;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (
    !Number.isFinite(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("A private submission has an invalid storage date.");
  }

  return {
    date,
    id: checkedSubmissionId(id),
    legalHold: location === "legal-holds",
  };
}

function heldPath(pathname: string): string {
  const identity = submissionPathIdentity(pathname);
  if (identity.legalHold) return pathname;
  return pathname.replace(submissionBlobPrefix, submissionLegalHoldPrefix);
}

function activePath(pathname: string): string {
  const identity = submissionPathIdentity(pathname);
  if (!identity.legalHold) return pathname;
  return pathname.replace(submissionLegalHoldPrefix, submissionBlobPrefix);
}

export function serializeSubmissionBlob(
  submission: ValidSubmission,
  {
    id = randomUUID(),
    submittedAt = new Date(),
  }: { id?: string; submittedAt?: Date } = {},
): { pathname: string; body: string; record: StoredSubmission } {
  const normalizedSubmittedAt = validDate(
    new Date(submittedAt),
    "Submission time",
  );
  const record: StoredSubmission = {
    schemaVersion: 1,
    id,
    status: "new",
    submittedAt: normalizedSubmittedAt.toISOString(),
    retentionDeleteAfter: retentionDate(normalizedSubmittedAt),
    kind: submission.submissionType,
    platform: submission.platform,
    ...(submission.version ? { version: submission.version } : {}),
    summary: submission.summary,
    details: submission.details,
    ...(submission.pageUrl ? { pageUrl: submission.pageUrl } : {}),
    sourceUrls: [...submission.sourceUrls],
    ...(submission.publicCredit
      ? { publicCredit: submission.publicCredit }
      : {}),
    ...(submission.contactEmail
      ? { contactEmail: submission.contactEmail }
      : {}),
    consentToContact: submission.consentToContact,
    consentToPublicCredit: submission.consentToPublicCredit,
    attestations: { ...submission.attestations },
  };

  const body = JSON.stringify(record);
  if (new TextEncoder().encode(body).byteLength > maximumSubmissionBlobBytes) {
    throw new SubmissionBlobSizeError();
  }

  return {
    pathname: privatePath(id, normalizedSubmittedAt),
    body,
    record,
  };
}

export async function storeSubmissionBlob(
  submission: ValidSubmission,
  {
    operations = vercelBlobOperations,
    id,
    submittedAt,
  }: {
    operations?: SubmissionBlobOperations;
    id?: string;
    submittedAt?: Date;
  } = {},
): Promise<Pick<
  StoredSubmission,
  "id" | "submittedAt" | "retentionDeleteAfter"
> & { pathname: string }> {
  const serialized = serializeSubmissionBlob(submission, { id, submittedAt });

  await operations.put(serialized.pathname, serialized.body, {
    access: "private",
    addRandomSuffix: false,
    cacheControlMaxAge: 60,
    contentType: "application/json",
  });

  return {
    id: serialized.record.id,
    pathname: serialized.pathname,
    submittedAt: serialized.record.submittedAt,
    retentionDeleteAfter: serialized.record.retentionDeleteAfter,
  };
}

function checkedPageSize(pageSize: number): number {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError("Blob list page size must be a positive integer.");
  }
  return Math.min(pageSize, maximumListPageSize);
}

function nextCursor(
  page: SubmissionBlobListPage,
  previousCursor: string | undefined,
  seenCursors: Set<string>,
): string | undefined {
  if (!page.hasMore) return undefined;
  if (
    !page.cursor ||
    page.cursor === previousCursor ||
    seenCursors.has(page.cursor)
  ) {
    throw new Error("Vercel Blob pagination did not advance.");
  }
  seenCursors.add(page.cursor);
  return page.cursor;
}

async function listBlobsAtPrefix({
  operations = vercelBlobOperations,
  pageSize = maximumListPageSize,
  prefix,
}: {
  operations?: SubmissionBlobOperations;
  pageSize?: number;
  prefix: string;
}): Promise<SubmissionBlobItem[]> {
  const limit = checkedPageSize(pageSize);
  const blobs = new Map<string, SubmissionBlobItem>();
  const seenCursors = new Set<string>();
  let cursor: string | undefined;

  do {
    const page = await operations.list({
      prefix,
      limit,
      ...(cursor ? { cursor } : {}),
    });
    for (const blob of page.blobs) {
      if (blob.pathname.startsWith(prefix)) {
        blobs.set(blob.pathname, blob);
      }
    }
    cursor = nextCursor(page, cursor, seenCursors);
  } while (cursor);

  return [...blobs.values()];
}

export async function listSubmissionBlobs({
  operations = vercelBlobOperations,
  pageSize = maximumListPageSize,
}: {
  operations?: SubmissionBlobOperations;
  pageSize?: number;
} = {}): Promise<SubmissionBlobItem[]> {
  return listBlobsAtPrefix({
    operations,
    pageSize,
    prefix: submissionBlobPrefix,
  });
}

async function listHeldSubmissionBlobs({
  operations = vercelBlobOperations,
  pageSize = maximumListPageSize,
}: {
  operations?: SubmissionBlobOperations;
  pageSize?: number;
} = {}): Promise<SubmissionBlobItem[]> {
  return listBlobsAtPrefix({
    operations,
    pageSize,
    prefix: submissionLegalHoldPrefix,
  });
}

export interface SubmissionQueueItem {
  id: string;
  submittedOn: string;
  storageUpdatedAt: string;
  legalHold: boolean;
}

interface LocatedSubmissionBlob extends SubmissionBlobItem {
  identity: SubmissionPathIdentity;
}

async function listLocatedSubmissionBlobs({
  operations = vercelBlobOperations,
  pageSize = maximumListPageSize,
}: {
  operations?: SubmissionBlobOperations;
  pageSize?: number;
} = {}): Promise<LocatedSubmissionBlob[]> {
  const [active, held] = await Promise.all([
    listSubmissionBlobs({ operations, pageSize }),
    listHeldSubmissionBlobs({ operations, pageSize }),
  ]);
  const located = [...active, ...held].map((blob) => ({
    ...blob,
    identity: submissionPathIdentity(blob.pathname),
  }));

  const identities = new Set<string>();
  for (const blob of located) {
    if (identities.has(blob.identity.id)) {
      throw new Error("A private submission ID exists in more than one state.");
    }
    identities.add(blob.identity.id);
  }
  return located;
}

export async function listSubmissionQueue({
  operations = vercelBlobOperations,
  pageSize = maximumListPageSize,
}: {
  operations?: SubmissionBlobOperations;
  pageSize?: number;
} = {}): Promise<SubmissionQueueItem[]> {
  const blobs = await listLocatedSubmissionBlobs({ operations, pageSize });
  return blobs
    .map((blob) => ({
      id: blob.identity.id,
      submittedOn: blob.identity.date,
      storageUpdatedAt: uploadedAt(blob).toISOString(),
      legalHold: blob.identity.legalHold,
    }))
    .sort(
      (left, right) =>
        left.submittedOn.localeCompare(right.submittedOn) ||
        left.id.localeCompare(right.id),
    );
}

export class SubmissionNotFoundError extends Error {
  constructor(id: string) {
    super(`Submission ${id} was not found.`);
    this.name = "SubmissionNotFoundError";
  }
}

export class SubmissionStateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubmissionStateError";
  }
}

async function findSubmissionBlobById(
  id: string,
  operations: SubmissionBlobOperations,
): Promise<LocatedSubmissionBlob> {
  const normalizedId = checkedSubmissionId(id);
  const blobs = await listLocatedSubmissionBlobs({ operations });
  const blob = blobs.find((item) => item.identity.id === normalizedId);
  if (!blob) throw new SubmissionNotFoundError(normalizedId);
  return blob;
}

function storedSubmission(body: string, pathname: string): StoredSubmission {
  if (new TextEncoder().encode(body).byteLength > maximumSubmissionBlobBytes) {
    throw new Error("The private submission exceeds the size limit.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error("The private submission is not valid JSON.");
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(parsed))
  ) {
    throw new Error("The private submission has an invalid record shape.");
  }

  const record = parsed as Record<string, unknown>;
  const identity = submissionPathIdentity(pathname);
  if (
    record.schemaVersion !== 1 ||
    record.status !== "new" ||
    typeof record.id !== "string" ||
    checkedSubmissionId(record.id) !== identity.id ||
    typeof record.submittedAt !== "string" ||
    typeof record.retentionDeleteAfter !== "string"
  ) {
    throw new Error("The private submission has invalid core fields.");
  }

  const submittedAt = validDate(
    new Date(record.submittedAt),
    "Stored submission time",
  );
  if (
    submittedAt.toISOString() !== record.submittedAt ||
    submittedAt.toISOString().slice(0, 10) !== identity.date
  ) {
    throw new Error("The private submission date does not match its path.");
  }
  if (record.retentionDeleteAfter !== retentionDate(submittedAt)) {
    throw new Error("The private submission has an invalid retention date.");
  }

  const attestations =
    record.attestations &&
    typeof record.attestations === "object" &&
    !Array.isArray(record.attestations)
      ? (record.attestations as Record<string, unknown>)
      : {};
  const validation = validateSubmission({
    submissionType: record.kind,
    platform: record.platform,
    version: record.version,
    summary: record.summary,
    details: record.details,
    pageUrl: record.pageUrl,
    sourceUrls: record.sourceUrls,
    publicCredit: record.publicCredit,
    contactEmail: record.contactEmail,
    consentToContact: record.consentToContact,
    consentToPublicCredit: record.consentToPublicCredit,
    publicEvidenceOnly: attestations.publicEvidenceOnly,
    rightsToSubmit: attestations.rightsToSubmit,
    noConfidentialInformation: attestations.noConfidentialInformation,
  });
  if (!validation.ok) {
    throw new Error("The private submission has invalid content fields.");
  }

  const submission = validation.value;
  const sourceUrls = record.sourceUrls;
  if (
    record.kind !== submission.submissionType ||
    record.platform !== submission.platform ||
    record.version !== submission.version ||
    record.summary !== submission.summary ||
    record.details !== submission.details ||
    record.pageUrl !== submission.pageUrl ||
    !Array.isArray(sourceUrls) ||
    sourceUrls.length !== submission.sourceUrls.length ||
    sourceUrls.some((url, index) => url !== submission.sourceUrls[index]) ||
    record.publicCredit !== submission.publicCredit ||
    record.contactEmail !== submission.contactEmail ||
    record.consentToContact !== submission.consentToContact ||
    record.consentToPublicCredit !== submission.consentToPublicCredit
  ) {
    throw new Error("The private submission is not normalized.");
  }

  return {
    schemaVersion: 1,
    id: identity.id,
    status: "new",
    submittedAt: record.submittedAt,
    retentionDeleteAfter: record.retentionDeleteAfter,
    kind: submission.submissionType,
    platform: submission.platform,
    ...(submission.version ? { version: submission.version } : {}),
    summary: submission.summary,
    details: submission.details,
    ...(submission.pageUrl ? { pageUrl: submission.pageUrl } : {}),
    sourceUrls: [...submission.sourceUrls],
    ...(submission.publicCredit
      ? { publicCredit: submission.publicCredit }
      : {}),
    ...(submission.contactEmail
      ? { contactEmail: submission.contactEmail }
      : {}),
    consentToContact: submission.consentToContact,
    consentToPublicCredit: submission.consentToPublicCredit,
    attestations: { ...submission.attestations },
  };
}

export async function getSubmissionById(
  id: string,
  {
    operations = vercelBlobOperations,
  }: { operations?: SubmissionBlobOperations } = {},
): Promise<{
  record: StoredSubmission;
  metadata: SubmissionQueueItem;
}> {
  const blob = await findSubmissionBlobById(id, operations);
  const result = await operations.get(blob.pathname, {
    access: "private",
    useCache: false,
  });
  if (!result) throw new SubmissionNotFoundError(blob.identity.id);
  if (result.pathname !== blob.pathname) {
    throw new Error("The private submission read returned a different path.");
  }
  if (result.size > maximumSubmissionBlobBytes) {
    throw new Error("The private submission exceeds the size limit.");
  }

  return {
    record: storedSubmission(result.body, result.pathname),
    metadata: {
      id: blob.identity.id,
      submittedOn: blob.identity.date,
      storageUpdatedAt: uploadedAt(result).toISOString(),
      legalHold: blob.identity.legalHold,
    },
  };
}

const renameOptions: SubmissionBlobRenameOptions = {
  access: "private",
  addRandomSuffix: false,
  allowOverwrite: false,
  cacheControlMaxAge: 60,
  contentType: "application/json",
};

export async function placeSubmissionLegalHold(
  id: string,
  {
    operations = vercelBlobOperations,
  }: { operations?: SubmissionBlobOperations } = {},
): Promise<{ id: string; changed: boolean; legalHold: true }> {
  const blob = await findSubmissionBlobById(id, operations);
  if (blob.identity.legalHold) {
    return { id: blob.identity.id, changed: false, legalHold: true };
  }
  await operations.rename(blob.pathname, heldPath(blob.pathname), renameOptions);
  return { id: blob.identity.id, changed: true, legalHold: true };
}

export async function releaseSubmissionLegalHold(
  id: string,
  {
    operations = vercelBlobOperations,
  }: { operations?: SubmissionBlobOperations } = {},
): Promise<{ id: string; changed: boolean; legalHold: false }> {
  const blob = await findSubmissionBlobById(id, operations);
  if (!blob.identity.legalHold) {
    return { id: blob.identity.id, changed: false, legalHold: false };
  }
  await operations.rename(blob.pathname, activePath(blob.pathname), renameOptions);
  return { id: blob.identity.id, changed: true, legalHold: false };
}

export async function resolveSubmissionById(
  id: string,
  {
    operations = vercelBlobOperations,
  }: { operations?: SubmissionBlobOperations } = {},
): Promise<{ id: string; resolved: true }> {
  const blob = await findSubmissionBlobById(id, operations);
  if (blob.identity.legalHold) {
    throw new SubmissionStateError(
      `Submission ${blob.identity.id} has a legal hold. Release the hold before resolution.`,
    );
  }
  await operations.del(blob.pathname, { ifMatch: blob.etag });
  return { id: blob.identity.id, resolved: true };
}

export async function hasPendingSubmissionBlobs({
  operations = vercelBlobOperations,
}: {
  operations?: SubmissionBlobOperations;
} = {}): Promise<boolean> {
  async function hasBlobAtPrefix(prefix: string): Promise<boolean> {
    const seenCursors = new Set<string>();
    let cursor: string | undefined;

    do {
      const page = await operations.list({
        prefix,
        limit: 1,
        ...(cursor ? { cursor } : {}),
      });
      if (page.blobs.some((blob) => blob.pathname.startsWith(prefix))) {
        return true;
      }
      cursor = nextCursor(page, cursor, seenCursors);
    } while (cursor);

    return false;
  }

  if (await hasBlobAtPrefix(submissionBlobPrefix)) return true;
  return hasBlobAtPrefix(submissionLegalHoldPrefix);
}

function uploadedAt(blob: SubmissionBlobItem): Date {
  return validDate(new Date(blob.uploadedAt), "Private submission upload time");
}

function retentionBasis(blob: SubmissionBlobItem): Date {
  const identity = submissionPathIdentity(blob.pathname);
  if (identity.legalHold) {
    throw new Error("Legal-hold submissions cannot enter automatic cleanup.");
  }
  if (!blob.etag) {
    throw new Error("A private submission is missing its concurrency tag.");
  }

  // A hold move changes Blob's upload timestamp. The date embedded when the
  // submission was first stored remains stable, so a released hold cannot
  // silently restart the retention clock. End-of-day avoids deleting earlier
  // than the original (unknown here) submission time.
  const pathDayEnd = new Date(`${identity.date}T23:59:59.999Z`);
  return new Date(
    Math.min(uploadedAt(blob).getTime(), pathDayEnd.getTime()),
  );
}

export async function deleteExpiredSubmissionBlobs({
  operations = vercelBlobOperations,
  now = new Date(),
  retentionDays = submissionCleanupDays,
  pageSize = maximumListPageSize,
}: {
  operations?: SubmissionBlobOperations;
  now?: Date;
  retentionDays?: number;
  pageSize?: number;
} = {}): Promise<{ scanned: number; deleted: number; cutoff: string }> {
  const normalizedNow = validDate(new Date(now), "Retention check time");
  if (!Number.isInteger(retentionDays) || retentionDays < 1) {
    throw new RangeError("Retention days must be a positive integer.");
  }
  const cutoff = new Date(
    normalizedNow.getTime() - retentionDays * dayMilliseconds,
  );
  const blobs = await listSubmissionBlobs({ operations, pageSize });
  const expired = blobs.filter(
    (blob) => retentionBasis(blob).getTime() <= cutoff.getTime(),
  );

  for (const blob of expired) {
    await operations.del(blob.pathname, { ifMatch: blob.etag });
  }

  return {
    scanned: blobs.length,
    deleted: expired.length,
    cutoff: cutoff.toISOString(),
  };
}
