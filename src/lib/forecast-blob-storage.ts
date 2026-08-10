import {
  BlobAccessError,
  BlobClientTokenExpiredError,
  BlobError,
  BlobPreconditionFailedError,
  BlobRequestAbortedError,
  BlobServiceNotAvailable,
  BlobServiceRateLimited,
  BlobStoreNotFoundError,
  BlobStoreSuspendedError,
  BlobUnknownError,
  get,
  list,
  put,
} from "@vercel/blob";
import { getVercelOidcToken } from "@vercel/oidc";

import {
  FORECAST_ARTIFACT_MAX_BYTES,
  FORECAST_POINTER_MAX_BYTES,
  FORECAST_POINTER_PATH,
  commitForecastArtifactTransition,
  forecastArtifactPath,
  parseForecastArtifact,
  parseForecastPointer,
  rawArtifactDigest,
  reconciliationRootArtifactPath,
  serializeForecastArtifact,
  validateForecastPointerTransition,
  type AtomicCasResult,
  type ForecastArtifactV1,
  type ForecastContractStorage,
  type ForecastPointerV1,
  type ImmutablePutResult,
  type ReconciliationRootValidator,
} from "./forecast-artifact-contracts";

export const FORECAST_BLOB_STORE_ID_ENV = "FORECAST_BLOB_STORE_ID";
export const FORECAST_BLOB_ARTIFACT_PREFIX = "forecast/artifacts/";
export const FORECAST_BLOB_RECONCILIATION_PREFIX = "forecast/reconciliation/";
export const FORECAST_BLOB_SCORE_PREFIX = "forecast/scores/";
export const FORECAST_BLOB_MAX_ATTEMPTS = 3;
export const FORECAST_BLOB_LIST_MAX_ITEMS = 100;
export const FORECAST_BLOB_SCORE_MAX_BYTES = 65_536;
export const FORECAST_BLOB_REQUEST_TIMEOUT_MS = 8_000;
export const FORECAST_BLOB_OPERATION_DEADLINE_MS = 45_000;

const jsonCacheSeconds = 60;
const sha256Pattern = /^[a-f0-9]{64}$/;
const storeIdPattern = /^(?:store_)?[A-Za-z0-9][A-Za-z0-9_-]{2,127}$/;
const artifactPathPattern =
  /^forecast\/artifacts\/([a-f0-9]{64})\.json$/;
const reconciliationPathPattern =
  /^forecast\/reconciliation\/([a-f0-9]{64})\.json$/;
const scorePathPattern = /^forecast\/scores\/([a-f0-9]{64})\.json$/;

export interface ForecastBlobEnvironment {
  [name: string]: string | undefined;
  VERCEL_ENV?: string;
  FORECAST_BLOB_STORE_ID?: string;
}

export interface ForecastBlobConfiguration {
  storeId: string;
}

export interface ForecastBlobGetOptions {
  access: "private";
  useCache: false;
  storeId: string;
  oidcToken: string;
  abortSignal: AbortSignal;
}

export interface ForecastBlobPutOptions {
  access: "private";
  addRandomSuffix: false;
  allowOverwrite: boolean;
  cacheControlMaxAge: number;
  contentType: "application/json";
  maximumSizeInBytes: number;
  storeId: string;
  oidcToken: string;
  abortSignal: AbortSignal;
  ifMatch?: string;
}

export interface ForecastBlobListOptions {
  prefix: typeof FORECAST_BLOB_ARTIFACT_PREFIX;
  limit: number;
  cursor?: string;
  storeId: string;
  oidcToken: string;
  abortSignal: AbortSignal;
}

export type ForecastBlobGetResult =
  | {
      statusCode: 200;
      stream: ReadableStream<Uint8Array>;
      blob: {
        pathname: string;
        size: number;
        etag: string;
      };
    }
  | {
      statusCode: 304;
      stream: null;
      blob: {
        pathname: string;
        size: null;
        etag: string;
      };
    };

export interface ForecastBlobPutResult {
  pathname: string;
  etag: string;
}

export interface ForecastBlobListItem {
  pathname: string;
  size: number;
  uploadedAt: Date | string;
  etag: string;
}

export interface ForecastBlobListPageResult {
  blobs: readonly ForecastBlobListItem[];
  cursor?: string;
  hasMore: boolean;
}

/**
 * The injected operations must preserve Vercel Blob 2.7 conditional-put
 * semantics. The marker prevents a test or future adapter from silently
 * advertising atomic pointer CAS while implementing read-then-write only.
 */
export interface ForecastBlobOperations {
  readonly conditionalPutSemantics: "vercel-blob-if-match/v1";
  get(
    pathname: string,
    options: ForecastBlobGetOptions,
  ): Promise<ForecastBlobGetResult | null>;
  put(
    pathname: string,
    body: Uint8Array,
    options: ForecastBlobPutOptions,
  ): Promise<ForecastBlobPutResult>;
  list(options: ForecastBlobListOptions): Promise<ForecastBlobListPageResult>;
}

export interface ForecastBlobRetryPolicy {
  maxAttempts?: number;
  baseDelayMs?: number;
  requestTimeoutMs?: number;
  operationDeadlineMs?: number;
  wait?: (delayMs: number) => Promise<void>;
  now?: () => number;
}

export type ForecastBlobOidcTokenProvider = () => Promise<string>;

export interface CreateForecastBlobStorageOptions {
  env?: ForecastBlobEnvironment;
  operations?: ForecastBlobOperations;
  oidcTokenProvider?: ForecastBlobOidcTokenProvider;
  reconciliationRootValidator?: ReconciliationRootValidator;
  retry?: ForecastBlobRetryPolicy;
}

export interface ForecastBlobArtifactListItem extends ForecastBlobListItem {
  artifactId: string;
}

export interface ForecastBlobArtifactListPage {
  artifacts: readonly ForecastBlobArtifactListItem[];
  cursor?: string;
  hasMore: boolean;
}

export interface ForecastBlobPointerSnapshot {
  pointer: ForecastPointerV1;
  etag: string;
}

export type ForecastBlobPointerUpdateResult =
  | {
      status: "applied";
      pointer: ForecastPointerV1;
      attempts: number;
    }
  | {
      status: "conflict";
      attempts: number;
      observedPreviousFingerprint: string | null;
      observedPreviousGeneration: number;
    };

export interface ForecastBlobStorage extends ForecastContractStorage {
  readForecastPointer(): Promise<ForecastBlobPointerSnapshot | null>;
  readForecastArtifact(artifactId: string): Promise<ForecastArtifactV1 | null>;
  readRollbackArtifact(): Promise<
    | { pointer: ForecastPointerV1; artifact: ForecastArtifactV1 }
    | null
  >;
  listForecastArtifacts(options?: {
    limit?: number;
    cursor?: string;
  }): Promise<ForecastBlobArtifactListPage>;
  updatePointerWithRetry(
    buildNext: (
      previous: ForecastPointerV1 | null,
      attempt: number,
    ) => {
      next: ForecastPointerV1;
      artifact?: ForecastArtifactV1;
    },
  ): Promise<ForecastBlobPointerUpdateResult>;
}

export class ForecastBlobConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForecastBlobConfigurationError";
  }
}

export class ForecastBlobAuthorizationError extends Error {
  constructor() {
    super(
      "Forecast Blob access failed. Verify Production OIDC access and FORECAST_BLOB_STORE_ID for the dedicated private store.",
    );
    this.name = "ForecastBlobAuthorizationError";
  }
}

export class ForecastBlobTimeoutError extends Error {
  constructor() {
    super("Forecast Blob storage exceeded its bounded runtime budget.");
    this.name = "ForecastBlobTimeoutError";
  }
}

export class ForecastBlobPathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForecastBlobPathError";
  }
}

export class ForecastBlobSizeError extends Error {
  constructor(pathname: string, maximumBytes: number) {
    super(
      `Forecast Blob object ${pathname} exceeds its ${maximumBytes}-byte limit.`,
    );
    this.name = "ForecastBlobSizeError";
  }
}

export class ForecastBlobIntegrityError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ForecastBlobIntegrityError";
  }
}

export class ForecastBlobImmutableCollisionError extends Error {
  constructor(pathname: string) {
    super(
      `Immutable forecast path ${pathname} already contains different bytes.`,
    );
    this.name = "ForecastBlobImmutableCollisionError";
  }
}

export class ForecastBlobRetryExhaustedError extends Error {
  constructor(operation: string, attempts: number) {
    super(
      `Forecast Blob ${operation} did not complete after ${attempts} bounded attempt${attempts === 1 ? "" : "s"}.`,
    );
    this.name = "ForecastBlobRetryExhaustedError";
  }
}

interface CheckedPath {
  kind: "artifact" | "pointer" | "reconciliation" | "score";
  maximumBytes: number;
  digest: string | null;
}

interface StoredObject {
  bytes: Uint8Array;
  etag: string;
}

interface CheckedRetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  requestTimeoutMs: number;
  operationDeadlineMs: number;
  wait: (delayMs: number) => Promise<void>;
  now: () => number;
}

interface BoundedRequest {
  signal: AbortSignal;
  finish: () => void;
}

const vercelForecastBlobOperations: ForecastBlobOperations = {
  conditionalPutSemantics: "vercel-blob-if-match/v1",
  async get(pathname, options) {
    const result = await get(pathname, options);
    if (!result) return null;
    if (result.statusCode === 304) {
      return {
        statusCode: 304,
        stream: null,
        blob: {
          pathname: result.blob.pathname,
          size: null,
          etag: result.blob.etag,
        },
      };
    }
    return {
      statusCode: 200,
      stream: result.stream,
      blob: {
        pathname: result.blob.pathname,
        size: result.blob.size,
        etag: result.blob.etag,
      },
    };
  },
  async put(pathname, body, options) {
    const result = await put(pathname, Buffer.from(body), options);
    return { pathname: result.pathname, etag: result.etag };
  },
  async list(options) {
    const result = await list(options);
    return {
      blobs: result.blobs.map((blob) => ({
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        etag: blob.etag,
      })),
      cursor: result.cursor,
      hasMore: result.hasMore,
    };
  },
};

function checkedRetryPolicy(
  policy: ForecastBlobRetryPolicy = {},
): CheckedRetryPolicy {
  const maxAttempts = policy.maxAttempts ?? FORECAST_BLOB_MAX_ATTEMPTS;
  const baseDelayMs = policy.baseDelayMs ?? 25;
  const requestTimeoutMs =
    policy.requestTimeoutMs ?? FORECAST_BLOB_REQUEST_TIMEOUT_MS;
  const operationDeadlineMs =
    policy.operationDeadlineMs ?? FORECAST_BLOB_OPERATION_DEADLINE_MS;
  if (
    !Number.isSafeInteger(maxAttempts) ||
    maxAttempts < 1 ||
    maxAttempts > FORECAST_BLOB_MAX_ATTEMPTS
  ) {
    throw new ForecastBlobConfigurationError(
      `Forecast Blob retries must use 1-${FORECAST_BLOB_MAX_ATTEMPTS} attempts.`,
    );
  }
  if (
    !Number.isSafeInteger(baseDelayMs) ||
    baseDelayMs < 0 ||
    baseDelayMs > 1_000
  ) {
    throw new ForecastBlobConfigurationError(
      "Forecast Blob retry delay must be an integer from 0 through 1000 ms.",
    );
  }
  if (
    !Number.isSafeInteger(requestTimeoutMs) ||
    requestTimeoutMs < 1 ||
    requestTimeoutMs > FORECAST_BLOB_REQUEST_TIMEOUT_MS
  ) {
    throw new ForecastBlobConfigurationError(
      `Forecast Blob request timeout must be an integer from 1 through ${FORECAST_BLOB_REQUEST_TIMEOUT_MS} ms.`,
    );
  }
  if (
    !Number.isSafeInteger(operationDeadlineMs) ||
    operationDeadlineMs < requestTimeoutMs ||
    operationDeadlineMs > FORECAST_BLOB_OPERATION_DEADLINE_MS
  ) {
    throw new ForecastBlobConfigurationError(
      `Forecast Blob operation deadline must be between the request timeout and ${FORECAST_BLOB_OPERATION_DEADLINE_MS} ms.`,
    );
  }
  return {
    maxAttempts,
    baseDelayMs,
    requestTimeoutMs,
    operationDeadlineMs,
    now: policy.now ?? Date.now,
    wait:
      policy.wait ??
      ((delayMs) =>
        new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        })),
  };
}

export function resolveForecastBlobConfiguration(
  env: ForecastBlobEnvironment = process.env as ForecastBlobEnvironment,
): ForecastBlobConfiguration {
  if (env.VERCEL_ENV !== "production") {
    throw new ForecastBlobConfigurationError(
      "Forecast Blob storage is available only when VERCEL_ENV=production.",
    );
  }

  const storeId = env.FORECAST_BLOB_STORE_ID;
  if (
    typeof storeId !== "string" ||
    storeId !== storeId.trim() ||
    !storeIdPattern.test(storeId)
  ) {
    throw new ForecastBlobConfigurationError(
      "Set FORECAST_BLOB_STORE_ID to the dedicated private forecast store ID.",
    );
  }

  return { storeId };
}

function checkedPath(pathname: string): CheckedPath {
  if (pathname === FORECAST_POINTER_PATH) {
    return {
      kind: "pointer",
      maximumBytes: FORECAST_POINTER_MAX_BYTES,
      digest: null,
    };
  }
  const artifact = artifactPathPattern.exec(pathname);
  if (artifact) {
    return {
      kind: "artifact",
      maximumBytes: FORECAST_ARTIFACT_MAX_BYTES,
      digest: artifact[1]!,
    };
  }
  const reconciliation = reconciliationPathPattern.exec(pathname);
  if (reconciliation) {
    return {
      kind: "reconciliation",
      maximumBytes: FORECAST_ARTIFACT_MAX_BYTES,
      digest: reconciliation[1]!,
    };
  }
  const score = scorePathPattern.exec(pathname);
  if (score) {
    return {
      kind: "score",
      maximumBytes: FORECAST_BLOB_SCORE_MAX_BYTES,
      digest: score[1]!,
    };
  }
  throw new ForecastBlobPathError(
    "Forecast Blob access requires an exact digest path or the fixed private pointer path.",
  );
}

function checkedImmutableBytes(
  pathname: string,
  checked: CheckedPath,
  bytes: Uint8Array,
): void {
  if (checked.kind === "pointer") {
    throw new ForecastBlobPathError(
      "The mutable forecast pointer cannot use immutable object storage.",
    );
  }
  if (bytes.byteLength > checked.maximumBytes) {
    throw new ForecastBlobSizeError(pathname, checked.maximumBytes);
  }
  if (checked.kind === "artifact") {
    let artifact: ForecastArtifactV1;
    try {
      artifact = parseForecastArtifact(bytes);
    } catch (cause) {
      throw new ForecastBlobIntegrityError(
        "Immutable forecast artifact bytes are not canonical forecast-artifact/v1 JSON.",
        { cause },
      );
    }
    if (
      artifact.artifactId !== checked.digest ||
      forecastArtifactPath(artifact.artifactId) !== pathname ||
      serializeForecastArtifact(artifact) !== new TextDecoder().decode(bytes)
    ) {
      throw new ForecastBlobIntegrityError(
        "Immutable forecast artifact bytes do not match their content identity path.",
      );
    }
    return;
  }
  if (rawArtifactDigest(bytes) !== checked.digest) {
    throw new ForecastBlobIntegrityError(
      "Immutable forecast bytes do not match their SHA-256 path.",
    );
  }
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  return (
    left.byteLength === right.byteLength &&
    left.every((byte, index) => byte === right[index])
  );
}

function getBlobHttpStatus(error: unknown): number | null {
  if (!(error instanceof BlobError)) return null;
  const match = /Failed to fetch blob: (\d{3})(?:\s|$)/.exec(error.message);
  if (!match) return null;
  const status = Number(match[1]);
  return Number.isInteger(status) ? status : null;
}

function isAuthorizationFailure(error: unknown): boolean {
  if (
    error instanceof BlobAccessError ||
    error instanceof BlobClientTokenExpiredError ||
    error instanceof BlobStoreNotFoundError ||
    error instanceof BlobStoreSuspendedError
  ) {
    return true;
  }
  const name = error instanceof Error ? error.name : "";
  const status = getBlobHttpStatus(error);
  const oidcEnvironmentDenied =
    error instanceof BlobError &&
    error.message.startsWith("Vercel Blob: OIDC is enabled") &&
    error.message.endsWith("environment.");
  return (
    name === "BlobOidcEnvironmentNotAllowedError" ||
    oidcEnvironmentDenied ||
    status === 401 ||
    status === 403
  );
}

function isNetworkTypeError(error: unknown): boolean {
  if (!(error instanceof TypeError)) return false;
  const networkMessages = new Set([
    "fetch failed",
    "terminated",
    "Failed to fetch",
    "NetworkError when attempting to fetch resource.",
    "Network request failed",
  ]);
  if (networkMessages.has(error.message)) return true;
  const cause = error.cause;
  if (!cause || typeof cause !== "object" || !("code" in cause)) return false;
  return new Set([
    "ECONNRESET",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "ENETUNREACH",
    "ENOTFOUND",
    "EAI_AGAIN",
    "ETIMEDOUT",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_BODY_TIMEOUT",
    "UND_ERR_SOCKET",
  ]).has(String(cause.code));
}

function isTransientBlobFailure(error: unknown): boolean {
  const status = getBlobHttpStatus(error);
  return (
    error instanceof BlobServiceNotAvailable ||
    error instanceof BlobServiceRateLimited ||
    error instanceof BlobUnknownError ||
    isNetworkTypeError(error) ||
    status === 408 ||
    status === 425 ||
    status === 429 ||
    (status !== null && status >= 500 && status <= 599)
  );
}

function actionableError(error: unknown, signal?: AbortSignal): unknown {
  if (
    signal?.aborted ||
    error instanceof BlobRequestAbortedError ||
    (error instanceof DOMException && error.name === "AbortError")
  ) {
    return new ForecastBlobTimeoutError();
  }
  return isAuthorizationFailure(error)
    ? new ForecastBlobAuthorizationError()
    : error;
}

function awaitWithSignal<T>(
  value: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  if (signal.aborted) return Promise.reject(new ForecastBlobTimeoutError());
  return new Promise<T>((resolve, reject) => {
    const aborted = () => {
      reject(new ForecastBlobTimeoutError());
    };
    signal.addEventListener("abort", aborted, { once: true });
    value.then(
      (result) => {
        signal.removeEventListener("abort", aborted);
        resolve(result);
      },
      (error: unknown) => {
        signal.removeEventListener("abort", aborted);
        reject(error);
      },
    );
  });
}

function observedPointer(pointer: ForecastPointerV1 | null): {
  observedPreviousFingerprint: string | null;
  observedPreviousGeneration: number;
} {
  return {
    observedPreviousFingerprint: pointer?.pointerFingerprint ?? null,
    observedPreviousGeneration: pointer?.generation ?? 0,
  };
}

function expectedMatches(
  pointer: ForecastPointerV1 | null,
  expected: { fingerprint: string | null; generation: number },
): boolean {
  const observed = observedPointer(pointer);
  return (
    observed.observedPreviousFingerprint === expected.fingerprint &&
    observed.observedPreviousGeneration === expected.generation
  );
}

async function readBoundedStream(
  pathname: string,
  stream: ReadableStream<Uint8Array>,
  declaredSize: number,
  maximumBytes: number,
  signal: AbortSignal,
): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const result = await awaitWithSignal(reader.read(), signal);
      if (result.done) break;
      if (!(result.value instanceof Uint8Array)) {
        throw new ForecastBlobIntegrityError(
          `Forecast Blob object ${pathname} returned a non-byte stream.`,
        );
      }
      byteLength += result.value.byteLength;
      if (byteLength > maximumBytes) {
        await reader.cancel().catch(() => undefined);
        throw new ForecastBlobSizeError(pathname, maximumBytes);
      }
      chunks.push(result.value);
    }
  } catch (error) {
    await reader.cancel().catch(() => undefined);
    throw error;
  } finally {
    reader.releaseLock();
  }

  if (byteLength !== declaredSize) {
    throw new ForecastBlobIntegrityError(
      `Forecast Blob object ${pathname} size does not match its metadata.`,
    );
  }

  const bytes = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

/**
 * Production-only adapter for the dedicated private forecast Blob store.
 * It intentionally has no moderation dependency and no arbitrary-prefix list.
 */
class VercelForecastBlobStorage implements ForecastBlobStorage {
  readonly atomicPointerCas = true;
  readonly #configuration: ForecastBlobConfiguration;
  readonly #operations: ForecastBlobOperations;
  readonly #oidcTokenProvider: ForecastBlobOidcTokenProvider;
  readonly #reconciliationRootValidator?: ReconciliationRootValidator;
  readonly #retry: CheckedRetryPolicy;
  readonly #deadlineAt: number;

  constructor(
    configuration: ForecastBlobConfiguration,
    operations: ForecastBlobOperations = vercelForecastBlobOperations,
    oidcTokenProvider: ForecastBlobOidcTokenProvider = () =>
      getVercelOidcToken({ expirationBufferMs: 5_000 }),
    reconciliationRootValidator?: ReconciliationRootValidator,
    retry: ForecastBlobRetryPolicy = {},
  ) {
    if (operations.conditionalPutSemantics !== "vercel-blob-if-match/v1") {
      throw new ForecastBlobConfigurationError(
        "Forecast pointer storage requires proven Vercel ifMatch conditional-put semantics.",
      );
    }
    this.#configuration = Object.freeze({ ...configuration });
    this.#operations = operations;
    this.#oidcTokenProvider = oidcTokenProvider;
    this.#reconciliationRootValidator = reconciliationRootValidator;
    this.#retry = checkedRetryPolicy(retry);
    this.#deadlineAt =
      this.#retry.now() + this.#retry.operationDeadlineMs;
  }

  #beginRequest(): BoundedRequest {
    const remainingMs = this.#deadlineAt - this.#retry.now();
    if (remainingMs <= 0) throw new ForecastBlobTimeoutError();
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      Math.min(this.#retry.requestTimeoutMs, remainingMs),
    );
    return {
      signal: controller.signal,
      finish: () => clearTimeout(timeout),
    };
  }

  async #oidcToken(signal: AbortSignal): Promise<string> {
    let token: string;
    try {
      token = await awaitWithSignal(this.#oidcTokenProvider(), signal);
    } catch (error) {
      if (error instanceof ForecastBlobTimeoutError) throw error;
      throw new ForecastBlobAuthorizationError();
    }
    if (
      typeof token !== "string" ||
      token !== token.trim() ||
      token.length < 8
    ) {
      throw new ForecastBlobAuthorizationError();
    }
    return token;
  }

  async #getOptions(
    signal: AbortSignal,
  ): Promise<ForecastBlobGetOptions> {
    return {
      access: "private",
      useCache: false,
      storeId: this.#configuration.storeId,
      oidcToken: await this.#oidcToken(signal),
      abortSignal: signal,
    };
  }

  async #putOptions(
    maximumSizeInBytes: number,
    conditional:
      | { allowOverwrite: false }
      | { allowOverwrite: true; ifMatch: string },
    signal: AbortSignal,
  ): Promise<ForecastBlobPutOptions> {
    return {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: conditional.allowOverwrite,
      cacheControlMaxAge: jsonCacheSeconds,
      contentType: "application/json",
      maximumSizeInBytes,
      storeId: this.#configuration.storeId,
      oidcToken: await this.#oidcToken(signal),
      abortSignal: signal,
      ...(conditional.allowOverwrite ? { ifMatch: conditional.ifMatch } : {}),
    };
  }

  async #delay(attempt: number): Promise<void> {
    const delayMs = Math.min(
      1_000,
      this.#retry.baseDelayMs * 2 ** Math.max(0, attempt - 1),
    );
    const request = this.#beginRequest();
    try {
      await awaitWithSignal(this.#retry.wait(delayMs), request.signal);
    } finally {
      request.finish();
    }
  }

  async #readOnce(pathname: string): Promise<StoredObject | null> {
    const descriptor = checkedPath(pathname);
    const request = this.#beginRequest();
    let result: ForecastBlobGetResult | null;
    try {
      const options = await this.#getOptions(request.signal);
      result = await awaitWithSignal(
        this.#operations.get(pathname, options),
        request.signal,
      );
      if (!result) return null;
      if (result.statusCode !== 200 || !result.stream) {
        throw new ForecastBlobIntegrityError(
          `Forecast Blob object ${pathname} returned an unexpected conditional response.`,
        );
      }
      if (
        result.blob.pathname !== pathname ||
        typeof result.blob.etag !== "string" ||
        result.blob.etag.length === 0 ||
        !Number.isSafeInteger(result.blob.size) ||
        result.blob.size < 0
      ) {
        throw new ForecastBlobIntegrityError(
          `Forecast Blob object ${pathname} returned invalid metadata.`,
        );
      }
      if (result.blob.size > descriptor.maximumBytes) {
        await result.stream.cancel().catch(() => undefined);
        throw new ForecastBlobSizeError(pathname, descriptor.maximumBytes);
      }
      const bytes = await readBoundedStream(
        pathname,
        result.stream,
        result.blob.size,
        descriptor.maximumBytes,
        request.signal,
      );
      return { bytes, etag: result.blob.etag };
    } catch (error) {
      throw actionableError(error, request.signal);
    } finally {
      request.finish();
    }
  }

  async #readWithRetry(pathname: string): Promise<StoredObject | null> {
    for (let attempt = 1; attempt <= this.#retry.maxAttempts; attempt += 1) {
      try {
        return await this.#readOnce(pathname);
      } catch (error) {
        if (!isTransientBlobFailure(error)) throw error;
        if (attempt < this.#retry.maxAttempts) await this.#delay(attempt);
      }
    }
    throw new ForecastBlobRetryExhaustedError(
      "read",
      this.#retry.maxAttempts,
    );
  }

  async #putOnce(
    pathname: string,
    bytes: Uint8Array,
    maximumSizeInBytes: number,
    conditional:
      | { allowOverwrite: false }
      | { allowOverwrite: true; ifMatch: string },
  ): Promise<void> {
    const request = this.#beginRequest();
    let result: ForecastBlobPutResult;
    try {
      const options = await this.#putOptions(
        maximumSizeInBytes,
        conditional,
        request.signal,
      );
      result = await awaitWithSignal(
        this.#operations.put(pathname, bytes, options),
        request.signal,
      );
    } catch (error) {
      throw actionableError(error, request.signal);
    } finally {
      request.finish();
    }
    if (
      result.pathname !== pathname ||
      typeof result.etag !== "string" ||
      result.etag.length === 0
    ) {
      throw new ForecastBlobIntegrityError(
        `Forecast Blob write for ${pathname} returned invalid metadata.`,
      );
    }
  }

  async #readPointerOnce(): Promise<
    (StoredObject & { pointer: ForecastPointerV1 }) | null
  > {
    const stored = await this.#readOnce(FORECAST_POINTER_PATH);
    if (!stored) return null;
    try {
      return { ...stored, pointer: parseForecastPointer(stored.bytes) };
    } catch (cause) {
      throw new ForecastBlobIntegrityError(
        "The stored private forecast pointer is not canonical forecast-pointer/v1 JSON.",
        { cause },
      );
    }
  }

  async #validatePointerReferences(next: ForecastPointerV1): Promise<void> {
    const artifactIds = [
      ...new Set(
        [
          next.candidateArtifactId,
          next.activeArtifactId,
          next.rollbackArtifactId,
        ].filter((artifactId): artifactId is string => artifactId !== null),
      ),
    ].sort();
    const artifacts: ForecastArtifactV1[] = [];
    for (const artifactId of artifactIds) {
      const artifact = await this.readForecastArtifact(artifactId);
      if (!artifact) {
        throw new ForecastBlobIntegrityError(
          "Forecast pointer references a missing immutable artifact.",
        );
      }
      artifacts.push(artifact);
    }
    const first = artifacts[0];
    for (const artifact of artifacts.slice(1)) {
      if (
        !first ||
        artifact.artifactVersion !== first.artifactVersion ||
        artifact.mode !== first.mode ||
        artifact.provenance.historicalDataset.version !==
          first.provenance.historicalDataset.version ||
        artifact.provenance.evaluation.version !==
          first.provenance.evaluation.version ||
        artifact.provenance.publicReleaseModel.version !==
          first.provenance.publicReleaseModel.version ||
        artifact.provenance.publicReleaseCalibration.version !==
          first.provenance.publicReleaseCalibration.version ||
        artifact.provenance.nextEventModel.version !==
          first.provenance.nextEventModel.version ||
        artifact.provenance.nextEventCalibration.version !==
          first.provenance.nextEventCalibration.version
      ) {
        throw new ForecastBlobIntegrityError(
          "Forecast pointer references incompatible immutable artifacts.",
        );
      }
    }

    const rootId = next.reconciliationRootArtifactId;
    if (rootId) {
      const rootBytes = await this.readExact(
        reconciliationRootArtifactPath(rootId),
      );
      if (
        !rootBytes ||
        rawArtifactDigest(rootBytes) !== rootId ||
        !this.#reconciliationRootValidator?.(rootBytes, rootId)
      ) {
        throw new ForecastBlobIntegrityError(
          "Forecast pointer references an invalid reconciliation root.",
        );
      }
    }
  }

  async readExact(pathname: string): Promise<Uint8Array | null> {
    const stored = await this.#readWithRetry(pathname);
    return stored?.bytes.slice() ?? null;
  }

  async putImmutable(
    pathname: string,
    bytes: Uint8Array,
  ): Promise<ImmutablePutResult> {
    const descriptor = checkedPath(pathname);
    checkedImmutableBytes(pathname, descriptor, bytes);

    try {
      await this.#putOnce(pathname, bytes, descriptor.maximumBytes, {
        allowOverwrite: false,
      });
      return { status: "created" };
    } catch (error) {
      if (error instanceof ForecastBlobAuthorizationError) throw error;
      const precondition = error instanceof BlobPreconditionFailedError;
      let existing: StoredObject | null;
      try {
        existing = await this.#readOnce(pathname);
      } catch {
        throw error;
      }
      if (existing && bytesEqual(existing.bytes, bytes)) {
        return { status: precondition ? "exists" : "created" };
      }
      if (existing || precondition) {
        throw new ForecastBlobImmutableCollisionError(pathname);
      }
      throw error;
    }
  }

  async compareAndSwapPointer(
    pathname: typeof FORECAST_POINTER_PATH,
    expected: { fingerprint: string | null; generation: number },
    nextBytes: Uint8Array,
  ): Promise<AtomicCasResult> {
    if (pathname !== FORECAST_POINTER_PATH) {
      throw new ForecastBlobPathError(
        "Forecast pointer CAS requires the fixed private pointer path.",
      );
    }
    if (
      !Number.isSafeInteger(expected.generation) ||
      expected.generation < 0 ||
      (expected.generation === 0) !== (expected.fingerprint === null) ||
      (expected.fingerprint !== null &&
        !sha256Pattern.test(expected.fingerprint))
    ) {
      throw new ForecastBlobIntegrityError(
        "Forecast pointer CAS requires an exact generation and fingerprint pair.",
      );
    }
    if (nextBytes.byteLength > FORECAST_POINTER_MAX_BYTES) {
      throw new ForecastBlobSizeError(pathname, FORECAST_POINTER_MAX_BYTES);
    }

    let next: ForecastPointerV1;
    try {
      next = parseForecastPointer(nextBytes);
    } catch (cause) {
      throw new ForecastBlobIntegrityError(
        "Forecast pointer CAS requires canonical forecast-pointer/v1 bytes.",
        { cause },
      );
    }

    const current = await this.#readPointerOnce();
    if (!expectedMatches(current?.pointer ?? null, expected)) {
      return {
        status: "mismatch",
        atomic: true,
        ...observedPointer(current?.pointer ?? null),
      };
    }
    if (
      validateForecastPointerTransition(current?.pointer ?? null, next).length >
      0
    ) {
      throw new ForecastBlobIntegrityError(
        "Forecast pointer CAS rejected an invalid state transition.",
      );
    }
    await this.#validatePointerReferences(next);

    try {
      await this.#putOnce(
        pathname,
        nextBytes,
        FORECAST_POINTER_MAX_BYTES,
        current
          ? {
              allowOverwrite: true,
              ifMatch: current.etag,
            }
          : { allowOverwrite: false },
      );
      return {
        status: "applied",
        atomic: true,
        ...observedPointer(current?.pointer ?? null),
      };
    } catch (error) {
      if (error instanceof ForecastBlobAuthorizationError) throw error;

      if (error instanceof BlobPreconditionFailedError) {
        const raced = await this.#readPointerOnce();
        if (raced && bytesEqual(raced.bytes, nextBytes)) {
          return {
            status: "applied",
            atomic: true,
            ...observedPointer(current?.pointer ?? null),
          };
        }
        return {
          status: "mismatch",
          atomic: true,
          ...observedPointer(raced?.pointer ?? null),
        };
      }

      let recovered: (StoredObject & { pointer: ForecastPointerV1 }) | null;
      try {
        recovered = await this.#readPointerOnce();
      } catch {
        throw error;
      }
      if (recovered && bytesEqual(recovered.bytes, nextBytes)) {
        return {
          status: "applied",
          atomic: true,
          ...observedPointer(current?.pointer ?? null),
        };
      }
      if (!expectedMatches(recovered?.pointer ?? null, expected)) {
        return {
          status: "mismatch",
          atomic: true,
          ...observedPointer(recovered?.pointer ?? null),
        };
      }
      // A transport or service failure can be ambiguous, so one exact read
      // recovers a committed value. It is never a reason to reissue a mutable
      // write. Only updatePointerWithRetry rebuilds after a proven CAS race.
      throw error;
    }
  }

  async readForecastPointer(): Promise<ForecastBlobPointerSnapshot | null> {
    const stored = await this.#readWithRetry(FORECAST_POINTER_PATH);
    if (!stored) return null;
    let pointer: ForecastPointerV1;
    try {
      pointer = parseForecastPointer(stored.bytes);
    } catch (cause) {
      throw new ForecastBlobIntegrityError(
        "The stored private forecast pointer is not canonical forecast-pointer/v1 JSON.",
        { cause },
      );
    }
    return { pointer, etag: stored.etag };
  }

  async readForecastArtifact(
    artifactId: string,
  ): Promise<ForecastArtifactV1 | null> {
    const pathname = forecastArtifactPath(artifactId);
    const bytes = await this.readExact(pathname);
    if (!bytes) return null;
    let artifact: ForecastArtifactV1;
    try {
      artifact = parseForecastArtifact(bytes);
    } catch (cause) {
      throw new ForecastBlobIntegrityError(
        `Stored forecast artifact ${artifactId} is not canonical forecast-artifact/v1 JSON.`,
        { cause },
      );
    }
    if (artifact.artifactId !== artifactId) {
      throw new ForecastBlobIntegrityError(
        `Stored forecast artifact ${artifactId} does not match its digest path.`,
      );
    }
    return artifact;
  }

  async readRollbackArtifact(): Promise<
    | { pointer: ForecastPointerV1; artifact: ForecastArtifactV1 }
    | null
  > {
    const snapshot = await this.readForecastPointer();
    const rollbackArtifactId = snapshot?.pointer.rollbackArtifactId;
    if (!snapshot || !rollbackArtifactId) return null;
    const artifact = await this.readForecastArtifact(rollbackArtifactId);
    if (!artifact) {
      throw new ForecastBlobIntegrityError(
        `Rollback artifact ${rollbackArtifactId} is missing from private forecast storage.`,
      );
    }
    return { pointer: snapshot.pointer, artifact };
  }

  async listForecastArtifacts({
    limit = FORECAST_BLOB_LIST_MAX_ITEMS,
    cursor,
  }: {
    limit?: number;
    cursor?: string;
  } = {}): Promise<ForecastBlobArtifactListPage> {
    if (
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > FORECAST_BLOB_LIST_MAX_ITEMS
    ) {
      throw new RangeError(
        `Forecast artifact list limit must be 1-${FORECAST_BLOB_LIST_MAX_ITEMS}.`,
      );
    }
    if (
      cursor !== undefined &&
      (cursor.length === 0 || cursor.length > 1_024)
    ) {
      throw new RangeError("Forecast artifact list cursor is invalid.");
    }

    for (let attempt = 1; attempt <= this.#retry.maxAttempts; attempt += 1) {
      const request = this.#beginRequest();
      let retry = false;
      try {
        const oidcToken = await this.#oidcToken(request.signal);
        const page = await awaitWithSignal(
          this.#operations.list({
            prefix: FORECAST_BLOB_ARTIFACT_PREFIX,
            limit,
            ...(cursor === undefined ? {} : { cursor }),
            storeId: this.#configuration.storeId,
            oidcToken,
            abortSignal: request.signal,
          }),
          request.signal,
        );
        if (page.blobs.length > limit) {
          throw new ForecastBlobIntegrityError(
            "Forecast Blob list returned more objects than requested.",
          );
        }
        const artifacts = page.blobs.map((blob) => {
          const match = artifactPathPattern.exec(blob.pathname);
          if (
            !match ||
            !Number.isSafeInteger(blob.size) ||
            blob.size < 0 ||
            blob.size > FORECAST_ARTIFACT_MAX_BYTES ||
            typeof blob.etag !== "string" ||
            blob.etag.length === 0
          ) {
            throw new ForecastBlobIntegrityError(
              "Forecast Blob list returned an invalid artifact entry.",
            );
          }
          return { ...blob, artifactId: match[1]! };
        });
        if (page.hasMore && !page.cursor) {
          throw new ForecastBlobIntegrityError(
            "Forecast Blob pagination did not return a cursor.",
          );
        }
        return {
          artifacts,
          cursor: page.cursor,
          hasMore: page.hasMore,
        };
      } catch (rawError) {
        const error = actionableError(rawError, request.signal);
        if (!isTransientBlobFailure(error)) throw error;
        retry = true;
      } finally {
        request.finish();
      }
      if (retry && attempt < this.#retry.maxAttempts) {
        await this.#delay(attempt);
      }
    }
    throw new ForecastBlobRetryExhaustedError(
      "artifact list",
      this.#retry.maxAttempts,
    );
  }

  /**
   * Rebuild a fully validated FR-012 commit after a real CAS race. Every
   * attempt uses the immutable-first contract helper, including exact reads
   * of candidate, active, rollback, and reconciliation references.
   */
  async updatePointerWithRetry(
    buildNext: (
      previous: ForecastPointerV1 | null,
      attempt: number,
    ) => {
      next: ForecastPointerV1;
      artifact?: ForecastArtifactV1;
    },
  ): Promise<ForecastBlobPointerUpdateResult> {
    let lastObserved = {
      observedPreviousFingerprint: null as string | null,
      observedPreviousGeneration: 0,
    };
    for (let attempt = 1; attempt <= this.#retry.maxAttempts; attempt += 1) {
      const snapshot = await this.readForecastPointer();
      const previous = snapshot?.pointer ?? null;
      const proposal = buildNext(previous, attempt);
      let contractStorageFailure: unknown;
      const captureFailure = async <Result>(
        operation: () => Promise<Result>,
      ): Promise<Result> => {
        try {
          return await operation();
        } catch (error) {
          contractStorageFailure = error;
          throw error;
        }
      };
      const guardedStorage: ForecastContractStorage = {
        atomicPointerCas: this.atomicPointerCas,
        readExact: (path) => captureFailure(() => this.readExact(path)),
        putImmutable: (path, bytes) =>
          captureFailure(() => this.putImmutable(path, bytes)),
        compareAndSwapPointer: (path, expected, nextBytes) =>
          captureFailure(() =>
            this.compareAndSwapPointer(path, expected, nextBytes),
          ),
      };
      const result = await commitForecastArtifactTransition({
        storage: guardedStorage,
        previous,
        next: proposal.next,
        ...(proposal.artifact === undefined
          ? {}
          : { artifact: proposal.artifact }),
        ...(this.#reconciliationRootValidator === undefined
          ? {}
          : {
              validateReconciliationRoot:
                this.#reconciliationRootValidator,
            }),
      });
      if (result.committed) {
        return {
          status: "applied",
          pointer: result.pointer,
          attempts: attempt,
        };
      }
      if (result.reason === "storage-failure" && contractStorageFailure) {
        throw contractStorageFailure;
      }
      if (result.reason !== "stale-cas") {
        throw new ForecastBlobIntegrityError(
          `Forecast pointer commit failed FR-012 validation (${result.reason}).`,
        );
      }
      const observed = await this.readForecastPointer();
      lastObserved = observedPointer(observed?.pointer ?? null);
      if (attempt < this.#retry.maxAttempts) await this.#delay(attempt);
    }
    return {
      status: "conflict",
      attempts: this.#retry.maxAttempts,
      ...lastObserved,
    };
  }
}

export function createForecastBlobStorage(
  options: CreateForecastBlobStorageOptions = {},
): ForecastBlobStorage {
  return new VercelForecastBlobStorage(
    resolveForecastBlobConfiguration(options.env),
    options.operations,
    options.oidcTokenProvider,
    options.reconciliationRootValidator,
    options.retry,
  );
}
