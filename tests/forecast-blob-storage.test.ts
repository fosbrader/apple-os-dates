import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  BlobAccessError,
  BlobError,
  BlobPreconditionFailedError,
  BlobServiceNotAvailable,
} from "@vercel/blob";

import {
  FORECAST_ARTIFACT_MAX_BYTES,
  FORECAST_POINTER_MAX_BYTES,
  FORECAST_POINTER_PATH,
  activateForecastPointer,
  buildForecastArtifact,
  commitForecastArtifactTransition,
  commitReconciliationRoot,
  forecastArtifactPath,
  forecastPointerWithCandidate,
  initializeForecastPointer,
  rawArtifactDigest,
  reconciliationRootArtifactPath,
  rollbackForecastPointer,
  serializeForecastArtifact,
  serializeForecastPointer,
  type ForecastArtifactDraftV1,
} from "../src/lib/forecast-artifact-contracts";
import {
  FORECAST_BLOB_ARTIFACT_PREFIX,
  FORECAST_BLOB_SCORE_MAX_BYTES,
  ForecastBlobAuthorizationError,
  ForecastBlobConfigurationError,
  ForecastBlobImmutableCollisionError,
  ForecastBlobIntegrityError,
  ForecastBlobPathError,
  ForecastBlobRetryExhaustedError,
  ForecastBlobSizeError,
  ForecastBlobTimeoutError,
  createForecastBlobStorage,
  type ForecastBlobGetOptions,
  type ForecastBlobGetResult,
  type ForecastBlobListOptions,
  type ForecastBlobListPageResult,
  type ForecastBlobOperations,
  type ForecastBlobPutOptions,
  type ForecastBlobPutResult,
} from "../src/lib/forecast-blob-storage";

const encoder = new TextEncoder();
const productionEnvironment = {
  VERCEL_ENV: "production",
  FORECAST_BLOB_STORE_ID: "store_forecast_private_123",
} as const;
const testOidcToken = "oidc-test-token";

function sha(character: string): string {
  return character.repeat(64);
}

function artifactDraft(
  generatedAt = "2026-08-09T20:00:00.000Z",
): ForecastArtifactDraftV1 {
  return {
    generatedAt,
    runIdentity: {
      version: "forecast-run-identity/v1",
      pipeline: "daily-shadow",
      scheduledFor: "2026-08-09",
    },
    provenance: {
      sourceAsOfDate: "2026-08-09",
      sourceIssuedAt: "2026-08-09T19:55:00.000Z",
      sourceEvidenceIds: ["evidence-a"],
      historicalDataset: {
        version: "historical-analysis-dataset/v1",
        fingerprint: sha("1"),
      },
      evaluation: {
        version: "walk-forward-evaluation/v1",
        fingerprint: sha("2"),
      },
      publicReleaseModel: {
        version: "release-date-candidates/v1",
        fingerprint: sha("3"),
      },
      publicReleaseCalibration: {
        version: "release-date-interval-calibration/v1",
        fingerprint: sha("4"),
      },
      nextEventModel: {
        version: "next-eligible-prerelease-event/v1",
        fingerprint: sha("5"),
      },
      nextEventCalibration: {
        version: "next-eligible-prerelease-event/v1",
        fingerprint: sha("6"),
      },
      codeFingerprint: sha("7"),
    },
    targets: [],
    metrics: [],
    exclusions: [],
  };
}

function byteStream(bytes: Uint8Array): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes.slice());
      controller.close();
    },
  });
}

interface MemoryObject {
  bytes: Uint8Array;
  etag: string;
  uploadedAt: Date;
}

interface PutCall {
  pathname: string;
  bytes: Uint8Array;
  options: ForecastBlobPutOptions;
}

class MemoryForecastBlobOperations implements ForecastBlobOperations {
  readonly conditionalPutSemantics = "vercel-blob-if-match/v1" as const;
  readonly files = new Map<string, MemoryObject>();
  readonly getCalls: Array<{
    pathname: string;
    options: ForecastBlobGetOptions;
  }> = [];
  readonly putCalls: PutCall[] = [];
  readonly listCalls: ForecastBlobListOptions[] = [];
  readonly operationLog: string[] = [];
  readonly getErrors: unknown[] = [];
  readonly putErrorsBeforeWrite: unknown[] = [];
  readonly putErrorsAfterWrite: unknown[] = [];
  getOverride?: (
    pathname: string,
    options: ForecastBlobGetOptions,
  ) => Promise<ForecastBlobGetResult | null>;
  beforePut?: (call: PutCall, operations: this) => void;
  listResult: ForecastBlobListPageResult = { blobs: [], hasMore: false };
  listError: unknown;
  #etag = 0;

  set(
    pathname: string,
    bytes: Uint8Array,
    etag = this.nextEtag(),
  ): void {
    this.files.set(pathname, {
      bytes: bytes.slice(),
      etag,
      uploadedAt: new Date("2026-08-09T20:00:00.000Z"),
    });
  }

  nextEtag(): string {
    this.#etag += 1;
    return `etag-${this.#etag}`;
  }

  async get(
    pathname: string,
    options: ForecastBlobGetOptions,
  ): Promise<ForecastBlobGetResult | null> {
    this.getCalls.push({ pathname, options });
    this.operationLog.push(`get:${pathname}`);
    const queuedError = this.getErrors.shift();
    if (queuedError) throw queuedError;
    if (this.getOverride) return this.getOverride(pathname, options);
    const stored = this.files.get(pathname);
    if (!stored) return null;
    return {
      statusCode: 200,
      stream: byteStream(stored.bytes),
      blob: {
        pathname,
        size: stored.bytes.byteLength,
        etag: stored.etag,
      },
    };
  }

  async put(
    pathname: string,
    body: Uint8Array,
    options: ForecastBlobPutOptions,
  ): Promise<ForecastBlobPutResult> {
    const call = { pathname, bytes: body.slice(), options: { ...options } };
    this.putCalls.push(call);
    this.operationLog.push(`put:${pathname}`);
    const queuedBeforeError = this.putErrorsBeforeWrite.shift();
    if (queuedBeforeError) throw queuedBeforeError;
    this.beforePut?.(call, this);
    const current = this.files.get(pathname);
    if (!options.allowOverwrite && current) {
      throw new BlobPreconditionFailedError();
    }
    if (
      options.allowOverwrite &&
      (!current || current.etag !== options.ifMatch)
    ) {
      throw new BlobPreconditionFailedError();
    }
    const etag = this.nextEtag();
    this.set(pathname, body, etag);
    const queuedAfterError = this.putErrorsAfterWrite.shift();
    if (queuedAfterError) throw queuedAfterError;
    return { pathname, etag };
  }

  async list(
    options: ForecastBlobListOptions,
  ): Promise<ForecastBlobListPageResult> {
    this.listCalls.push({ ...options });
    this.operationLog.push("list:artifacts");
    if (this.listError) throw this.listError;
    return this.listResult;
  }
}

function storage(
  operations = new MemoryForecastBlobOperations(),
  options: {
    maxAttempts?: number;
    baseDelayMs?: number;
    requestTimeoutMs?: number;
    operationDeadlineMs?: number;
    wait?: (delayMs: number) => Promise<void>;
    now?: () => number;
    oidcTokenProvider?: () => Promise<string>;
    reconciliationRootValidator?: (
      bytes: Uint8Array,
      expectedArtifactId: string,
    ) => boolean;
  } = {},
) {
  const {
    oidcTokenProvider = async () => testOidcToken,
    reconciliationRootValidator,
    ...retry
  } = options;
  return createForecastBlobStorage({
    env: productionEnvironment,
    operations,
    oidcTokenProvider,
    reconciliationRootValidator,
    retry,
  });
}

test("FR-013 fails closed outside Production or without the dedicated OIDC configuration", () => {
  for (const env of [
    {},
    {
      VERCEL_ENV: "preview",
      FORECAST_BLOB_STORE_ID: "store_forecast_private_123",
    },
    {
      VERCEL_ENV: "production",
      BLOB_STORE_ID: "store_wrong_global",
    },
    {
      VERCEL_ENV: "production",
      FORECAST_BLOB_STORE_ID: "https://public.example/store",
    },
  ]) {
    assert.throws(
      () =>
        createForecastBlobStorage({
          env,
          operations: new MemoryForecastBlobOperations(),
        }),
      ForecastBlobConfigurationError,
    );
  }

  assert.throws(
    () =>
      createForecastBlobStorage({
        env: productionEnvironment,
        operations: {
          ...new MemoryForecastBlobOperations(),
          conditionalPutSemantics: "not-atomic",
        } as unknown as ForecastBlobOperations,
      }),
    /proven Vercel ifMatch/,
  );
  assert.throws(
    () => storage(new MemoryForecastBlobOperations(), { maxAttempts: 4 }),
    /1-3 attempts/,
  );
});

test("FR-013 resolves rotating request-context OIDC for every SDK request", async () => {
  const operations = new MemoryForecastBlobOperations();
  const issuedTokens: string[] = [];
  const adapter = storage(operations, {
    oidcTokenProvider: async () => {
      const token = `oidc-rotating-token-${issuedTokens.length + 1}`;
      issuedTokens.push(token);
      return token;
    },
  });

  await adapter.readExact(FORECAST_POINTER_PATH);
  await adapter.listForecastArtifacts({ limit: 1 });
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  await adapter.compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: null, generation: 0 },
    encoder.encode(serializeForecastPointer(initial)),
  );

  assert.deepEqual(issuedTokens, [
    "oidc-rotating-token-1",
    "oidc-rotating-token-2",
    "oidc-rotating-token-3",
    "oidc-rotating-token-4",
  ]);
  assert.equal(operations.getCalls[0]?.options.oidcToken, issuedTokens[0]);
  assert.equal(operations.listCalls[0]?.oidcToken, issuedTokens[1]);
  assert.equal(operations.getCalls[1]?.options.oidcToken, issuedTokens[2]);
  assert.equal(operations.putCalls[0]?.options.oidcToken, issuedTokens[3]);
  for (const options of [
    ...operations.getCalls.map((call) => call.options),
    ...operations.listCalls,
    ...operations.putCalls.map((call) => call.options),
  ]) {
    assert.equal(
      options.storeId,
      productionEnvironment.FORECAST_BLOB_STORE_ID,
    );
    assert.equal("token" in options, false);
    assert.ok(options.abortSignal instanceof AbortSignal);
  }
});

test("FR-013 fails before the SDK when dynamic OIDC is unavailable", async () => {
  const operations = new MemoryForecastBlobOperations();
  const adapter = createForecastBlobStorage({
    env: {
      ...productionEnvironment,
      BLOB_READ_WRITE_TOKEN: "must-never-be-a-fallback",
    },
    operations,
    oidcTokenProvider: async () => {
      throw new Error("sensitive-provider-detail");
    },
  });
  await assert.rejects(
    adapter.readForecastPointer(),
    (error: unknown) =>
      error instanceof ForecastBlobAuthorizationError &&
      !error.message.includes("sensitive-provider-detail") &&
      !("cause" in error),
  );
  assert.equal(operations.getCalls.length, 0);
});

test("FR-013 uses explicit private OIDC/store options and no arbitrary storage path", async () => {
  const operations = new MemoryForecastBlobOperations();
  const adapter = storage(operations);
  const artifact = buildForecastArtifact(artifactDraft());
  const artifactBytes = encoder.encode(serializeForecastArtifact(artifact));
  const artifactPath = forecastArtifactPath(artifact.artifactId);

  assert.deepEqual(await adapter.putImmutable(artifactPath, artifactBytes), {
    status: "created",
  });
  assert.deepEqual(await adapter.readForecastArtifact(artifact.artifactId), artifact);
  const pointer = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  assert.equal(
    (
      await adapter.compareAndSwapPointer(
        FORECAST_POINTER_PATH,
        { fingerprint: null, generation: 0 },
        encoder.encode(serializeForecastPointer(pointer)),
      )
    ).status,
    "applied",
  );
  await adapter.listForecastArtifacts();

  for (const call of operations.getCalls) {
    assert.equal(call.options.access, "private");
    assert.equal(call.options.useCache, false);
    assert.equal(
      call.options.storeId,
      productionEnvironment.FORECAST_BLOB_STORE_ID,
    );
    assert.equal(call.options.oidcToken, testOidcToken);
    assert.ok(call.options.abortSignal instanceof AbortSignal);
    assert.equal("token" in call.options, false);
  }
  for (const call of operations.putCalls) {
    assert.equal(call.options.access, "private");
    assert.equal(call.options.addRandomSuffix, false);
    assert.equal(call.options.contentType, "application/json");
    assert.equal(call.options.cacheControlMaxAge, 60);
    assert.equal(
      call.options.storeId,
      productionEnvironment.FORECAST_BLOB_STORE_ID,
    );
    assert.equal(
      call.options.oidcToken,
      testOidcToken,
    );
    assert.ok(call.options.abortSignal instanceof AbortSignal);
    assert.equal("token" in call.options, false);
  }
  assert.equal(operations.listCalls.length, 1);
  assert.equal(operations.listCalls[0]?.prefix, FORECAST_BLOB_ARTIFACT_PREFIX);
  assert.equal(operations.listCalls[0]?.limit, 100);
  assert.equal(
    operations.listCalls[0]?.storeId,
    productionEnvironment.FORECAST_BLOB_STORE_ID,
  );
  assert.equal(operations.listCalls[0]?.oidcToken, testOidcToken);
  assert.ok(operations.listCalls[0]?.abortSignal instanceof AbortSignal);
  await assert.rejects(
    adapter.readExact("moderation/submissions/private.json"),
    ForecastBlobPathError,
  );
});

test("FR-013 does not retry unauthorized access and emits an actionable error", async () => {
  const operations = new MemoryForecastBlobOperations();
  operations.getErrors.push(new BlobAccessError());
  const waits: number[] = [];
  const adapter = storage(operations, {
    wait: async (delayMs) => {
      waits.push(delayMs);
    },
  });

  await assert.rejects(
    adapter.readForecastPointer(),
    (error: unknown) =>
      error instanceof ForecastBlobAuthorizationError &&
      error.message.includes("FORECAST_BLOB_STORE_ID"),
  );
  assert.equal(operations.getCalls.length, 1);
  assert.equal(waits.length, 0);

  const writeOperations = new MemoryForecastBlobOperations();
  writeOperations.putErrorsBeforeWrite.push(new BlobAccessError());
  const artifact = buildForecastArtifact(artifactDraft());
  await assert.rejects(
    storage(writeOperations, {
      wait: async (delayMs) => {
        waits.push(delayMs);
      },
    }).putImmutable(
      forecastArtifactPath(artifact.artifactId),
      encoder.encode(serializeForecastArtifact(artifact)),
    ),
    ForecastBlobAuthorizationError,
  );
  assert.equal(writeOperations.putCalls.length, 1);
  assert.equal(writeOperations.getCalls.length, 0);
  assert.equal(waits.length, 0);

  const transitionOperations = new MemoryForecastBlobOperations();
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  transitionOperations.set(
    FORECAST_POINTER_PATH,
    encoder.encode(serializeForecastPointer(initial)),
  );
  transitionOperations.putErrorsBeforeWrite.push(new BlobAccessError());
  await assert.rejects(
    storage(transitionOperations).updatePointerWithRetry((previous) => {
      assert.ok(previous);
      return {
        next: forecastPointerWithCandidate(
          previous,
          artifact.artifactId,
          "2026-08-09T20:02:00.000Z",
        ),
        artifact,
      };
    }),
    ForecastBlobAuthorizationError,
  );
  assert.equal(transitionOperations.putCalls.length, 1);
});

test("FR-013 classifies real private-get BlobError and TypeError shapes", async () => {
  const unauthorized = new MemoryForecastBlobOperations();
  unauthorized.getErrors.push(
    new BlobError("Failed to fetch blob: 403 Forbidden"),
  );
  await assert.rejects(
    storage(unauthorized).readForecastPointer(),
    ForecastBlobAuthorizationError,
  );
  assert.equal(unauthorized.getCalls.length, 1);

  const wrongEnvironment = new MemoryForecastBlobOperations();
  wrongEnvironment.getErrors.push(
    new BlobError(
      "OIDC is enabled for this project, but not for this token's environment.",
    ),
  );
  await assert.rejects(
    storage(wrongEnvironment).readForecastPointer(),
    ForecastBlobAuthorizationError,
  );
  assert.equal(wrongEnvironment.getCalls.length, 1);

  const service = new MemoryForecastBlobOperations();
  service.getErrors.push(
    new BlobError("Failed to fetch blob: 503 Service Unavailable"),
    new BlobError("Failed to fetch blob: 503 Service Unavailable"),
    new BlobError("Failed to fetch blob: 503 Service Unavailable"),
  );
  await assert.rejects(
    storage(service, { baseDelayMs: 0 }).readForecastPointer(),
    ForecastBlobRetryExhaustedError,
  );
  assert.equal(service.getCalls.length, 3);

  const network = new MemoryForecastBlobOperations();
  network.getErrors.push(
    new TypeError("fetch failed", { cause: { code: "ECONNRESET" } }),
    new TypeError("fetch failed", { cause: { code: "ECONNRESET" } }),
  );
  await storage(network, { baseDelayMs: 0 }).readForecastPointer();
  assert.equal(network.getCalls.length, 3);

  const programmer = new MemoryForecastBlobOperations();
  programmer.getErrors.push(new TypeError("Invalid URL"));
  await assert.rejects(
    storage(programmer).readForecastPointer(),
    /Invalid URL/,
  );
  assert.equal(programmer.getCalls.length, 1);
});

test("FR-013 aborts one hung SDK request inside the 45-second adapter budget", async () => {
  const operations = new MemoryForecastBlobOperations();
  operations.getOverride = async () =>
    new Promise<ForecastBlobGetResult | null>(() => undefined);
  await assert.rejects(
    storage(operations, {
      requestTimeoutMs: 5,
      operationDeadlineMs: 20,
    }).readForecastPointer(),
    ForecastBlobTimeoutError,
  );
  assert.equal(operations.getCalls.length, 1);
  assert.equal(operations.getCalls[0]?.options.abortSignal.aborted, true);
});

test("FR-013 shares one cumulative deadline across adapter requests", async () => {
  const operations = new MemoryForecastBlobOperations();
  let now = 1_000;
  const adapter = storage(operations, {
    requestTimeoutMs: 5,
    operationDeadlineMs: 20,
    now: () => now,
  });
  await adapter.readExact(FORECAST_POINTER_PATH);
  now = 1_021;
  await assert.rejects(
    adapter.readExact(FORECAST_POINTER_PATH),
    ForecastBlobTimeoutError,
  );
  assert.equal(operations.getCalls.length, 1);
});

test("FR-013 immutable writes are idempotent, collision-safe, and recover an ambiguous success", async () => {
  const artifact = buildForecastArtifact(artifactDraft());
  const bytes = encoder.encode(serializeForecastArtifact(artifact));
  const pathname = forecastArtifactPath(artifact.artifactId);

  const operations = new MemoryForecastBlobOperations();
  const adapter = storage(operations);
  assert.deepEqual(await adapter.putImmutable(pathname, bytes), {
    status: "created",
  });
  assert.deepEqual(await adapter.putImmutable(pathname, bytes), {
    status: "exists",
  });
  assert.deepEqual(operations.files.get(pathname)?.bytes, bytes);

  const collision = new MemoryForecastBlobOperations();
  collision.set(pathname, encoder.encode("different immutable bytes"));
  await assert.rejects(
    storage(collision).putImmutable(pathname, bytes),
    ForecastBlobImmutableCollisionError,
  );
  assert.deepEqual(
    collision.files.get(pathname)?.bytes,
    encoder.encode("different immutable bytes"),
  );

  const ambiguous = new MemoryForecastBlobOperations();
  ambiguous.putErrorsAfterWrite.push(new BlobServiceNotAvailable());
  assert.deepEqual(await storage(ambiguous).putImmutable(pathname, bytes), {
    status: "created",
  });
  assert.deepEqual(ambiguous.files.get(pathname)?.bytes, bytes);

  const invalidPathArtifact = buildForecastArtifact(
    artifactDraft("2026-08-09T20:00:01.000Z"),
  );
  await assert.rejects(
    adapter.putImmutable(
      pathname,
      encoder.encode(serializeForecastArtifact(invalidPathArtifact)),
    ),
    ForecastBlobIntegrityError,
  );
});

test("FR-013 snapshots immutable input before asynchronous credential resolution", async () => {
  const artifact = buildForecastArtifact(artifactDraft());
  // Buffer.slice() is a shared view, so this also proves that the adapter
  // creates an owned Uint8Array instead of calling the input's slice method.
  const input = Buffer.from(encoder.encode(serializeForecastArtifact(artifact)));
  const original = Uint8Array.from(input);
  const pathname = forecastArtifactPath(artifact.artifactId);
  const operations = new MemoryForecastBlobOperations();
  let releaseCredential!: (token: string) => void;
  let markCredentialStarted!: () => void;
  const credentialStarted = new Promise<void>((resolve) => {
    markCredentialStarted = resolve;
  });
  const credential = new Promise<string>((resolve) => {
    releaseCredential = resolve;
  });
  const adapter = storage(operations, {
    oidcTokenProvider: async () => {
      markCredentialStarted();
      return credential;
    },
  });

  const pending = adapter.putImmutable(pathname, input);
  await credentialStarted;
  input[0] = "[".charCodeAt(0);
  releaseCredential(testOidcToken);

  assert.deepEqual(await pending, { status: "created" });
  assert.notDeepEqual(input, original);
  assert.deepEqual(operations.files.get(pathname)?.bytes, original);
});

test("FR-013 initializes and updates the pointer with real no-overwrite and ETag CAS options", async () => {
  const operations = new MemoryForecastBlobOperations();
  const adapter = storage(operations);
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const initialBytes = encoder.encode(serializeForecastPointer(initial));
  const initialized = await adapter.compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: null, generation: 0 },
    initialBytes,
  );
  assert.deepEqual(initialized, {
    status: "applied",
    atomic: true,
    observedPreviousFingerprint: null,
    observedPreviousGeneration: 0,
  });
  assert.equal(operations.putCalls[0]?.options.allowOverwrite, false);
  assert.equal(operations.putCalls[0]?.options.ifMatch, undefined);

  const artifact = buildForecastArtifact(artifactDraft());
  const next = forecastPointerWithCandidate(
    initial,
    artifact.artifactId,
    "2026-08-09T20:02:00.000Z",
  );
  await adapter.putImmutable(
    forecastArtifactPath(artifact.artifactId),
    encoder.encode(serializeForecastArtifact(artifact)),
  );
  const oldEtag = operations.files.get(FORECAST_POINTER_PATH)?.etag;
  const updated = await adapter.compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: initial.pointerFingerprint, generation: initial.generation },
    encoder.encode(serializeForecastPointer(next)),
  );
  assert.equal(updated.status, "applied");
  assert.equal(operations.putCalls[2]?.options.allowOverwrite, true);
  assert.equal(operations.putCalls[2]?.options.ifMatch, oldEtag);
  assert.deepEqual((await adapter.readForecastPointer())?.pointer, next);
});

test("FR-013 snapshots pointer input before an asynchronous current-pointer read", async () => {
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const input = encoder.encode(serializeForecastPointer(initial));
  const original = input.slice();
  const operations = new MemoryForecastBlobOperations();
  let releaseRead!: () => void;
  let markReadStarted!: () => void;
  const readStarted = new Promise<void>((resolve) => {
    markReadStarted = resolve;
  });
  operations.getOverride = async () => {
    markReadStarted();
    await new Promise<void>((resolve) => {
      releaseRead = resolve;
    });
    return null;
  };

  const pending = storage(operations).compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: null, generation: 0 },
    input,
  );
  await readStarted;
  input[0] = "[".charCodeAt(0);
  releaseRead();

  assert.equal((await pending).status, "applied");
  assert.notDeepEqual(input, original);
  assert.deepEqual(operations.files.get(FORECAST_POINTER_PATH)?.bytes, original);
});

test("FR-013 accepts equivalent initialization and rejects stale-ETag races", async () => {
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const initialBytes = encoder.encode(serializeForecastPointer(initial));

  const initializeRace = new MemoryForecastBlobOperations();
  initializeRace.beforePut = (call, memory) => {
    if (!memory.files.has(call.pathname)) {
      memory.set(call.pathname, initialBytes, "winner-etag");
    }
  };
  const lostInitialization = await storage(
    initializeRace,
  ).compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: null, generation: 0 },
    initialBytes,
  );
  assert.deepEqual(lostInitialization, {
    status: "applied",
    atomic: true,
    observedPreviousFingerprint: null,
    observedPreviousGeneration: 0,
  });

  const artifact = buildForecastArtifact(artifactDraft());
  const next = forecastPointerWithCandidate(
    initial,
    artifact.artifactId,
    "2026-08-09T20:02:00.000Z",
  );
  const staleEtag = new MemoryForecastBlobOperations();
  staleEtag.set(FORECAST_POINTER_PATH, initialBytes, "etag-before-aba");
  staleEtag.set(
    forecastArtifactPath(artifact.artifactId),
    encoder.encode(serializeForecastArtifact(artifact)),
  );
  staleEtag.beforePut = (call, memory) => {
    if (call.options.ifMatch === "etag-before-aba") {
      // The semantic bytes return to A, but the object ETag records A-B-A.
      memory.set(call.pathname, initialBytes, "etag-after-aba");
    }
  };
  const stale = await storage(staleEtag).compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: initial.pointerFingerprint, generation: 1 },
    encoder.encode(serializeForecastPointer(next)),
  );
  assert.deepEqual(stale, {
    status: "mismatch",
    atomic: true,
    observedPreviousFingerprint: initial.pointerFingerprint,
    observedPreviousGeneration: 1,
  });
  assert.deepEqual(
    staleEtag.files.get(FORECAST_POINTER_PATH)?.bytes,
    initialBytes,
  );
});

test("FR-013 recovers ambiguous pointer success without blindly retrying a write", async () => {
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const bytes = encoder.encode(serializeForecastPointer(initial));
  const ambiguous = new MemoryForecastBlobOperations();
  ambiguous.putErrorsAfterWrite.push(new BlobServiceNotAvailable());
  const recovered = await storage(ambiguous).compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: null, generation: 0 },
    bytes,
  );
  assert.equal(recovered.status, "applied");
  assert.deepEqual(ambiguous.files.get(FORECAST_POINTER_PATH)?.bytes, bytes);

  const lostPreconditionResponse = new MemoryForecastBlobOperations();
  lostPreconditionResponse.putErrorsAfterWrite.push(
    new BlobPreconditionFailedError(),
  );
  const recoveredPrecondition = await storage(
    lostPreconditionResponse,
  ).compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    { fingerprint: null, generation: 0 },
    bytes,
  );
  assert.equal(recoveredPrecondition.status, "applied");
  assert.deepEqual(
    lostPreconditionResponse.files.get(FORECAST_POINTER_PATH)?.bytes,
    bytes,
  );

  const exhausted = new MemoryForecastBlobOperations();
  exhausted.putErrorsBeforeWrite.push(new BlobServiceNotAvailable());
  const waits: number[] = [];
  await assert.rejects(
    storage(exhausted, {
      baseDelayMs: 10,
      wait: async (delayMs) => {
        waits.push(delayMs);
      },
    }).compareAndSwapPointer(
      FORECAST_POINTER_PATH,
      { fingerprint: null, generation: 0 },
      bytes,
    ),
    BlobServiceNotAvailable,
  );
  assert.equal(exhausted.putCalls.length, 1);
  assert.deepEqual(waits, []);
  assert.equal(exhausted.files.has(FORECAST_POINTER_PATH), false);
});

test("FR-013 retry helper rejects dangling candidates before pointer mutation", async () => {
  const operations = new MemoryForecastBlobOperations();
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const initialBytes = encoder.encode(serializeForecastPointer(initial));
  operations.set(FORECAST_POINTER_PATH, initialBytes);

  await assert.rejects(
    storage(operations).updatePointerWithRetry((previous) => {
      assert.ok(previous);
      return {
        next: forecastPointerWithCandidate(
          previous,
          sha("d"),
          "2026-08-09T20:02:00.000Z",
        ),
      };
    }),
    /missing-artifact/,
  );
  assert.deepEqual(
    operations.files.get(FORECAST_POINTER_PATH)?.bytes,
    initialBytes,
  );
  assert.equal(
    operations.putCalls.filter(
      (call) => call.pathname === FORECAST_POINTER_PATH,
    ).length,
    0,
  );

  await assert.rejects(
    storage(operations).compareAndSwapPointer(
      FORECAST_POINTER_PATH,
      {
        fingerprint: initial.pointerFingerprint,
        generation: initial.generation,
      },
      encoder.encode(
        serializeForecastPointer(
          forecastPointerWithCandidate(
            initial,
            sha("e"),
            "2026-08-09T20:03:00.000Z",
          ),
        ),
      ),
    ),
    /missing immutable artifact/,
  );
  assert.deepEqual(
    operations.files.get(FORECAST_POINTER_PATH)?.bytes,
    initialBytes,
  );
});

test("FR-013 requires an exact typed reconciliation validator before CAS", async () => {
  const operations = new MemoryForecastBlobOperations();
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const initialBytes = encoder.encode(serializeForecastPointer(initial));
  operations.set(FORECAST_POINTER_PATH, initialBytes);
  const rootBytes = encoder.encode(
    '{"indexVersion":"reconciliation-index/v1"}',
  );
  const rootId = rawArtifactDigest(rootBytes);
  operations.set(reconciliationRootArtifactPath(rootId), rootBytes);
  const rooted = commitReconciliationRoot(
    initial,
    rootId,
    "2026-08-09T20:02:00.000Z",
  );

  await assert.rejects(
    storage(operations).compareAndSwapPointer(
      FORECAST_POINTER_PATH,
      {
        fingerprint: initial.pointerFingerprint,
        generation: initial.generation,
      },
      encoder.encode(serializeForecastPointer(rooted)),
    ),
    /invalid reconciliation root/,
  );
  assert.deepEqual(
    operations.files.get(FORECAST_POINTER_PATH)?.bytes,
    initialBytes,
  );

  const committed = await storage(operations, {
    reconciliationRootValidator: (bytes, expectedArtifactId) =>
      rawArtifactDigest(bytes) === expectedArtifactId &&
      new TextDecoder().decode(bytes) ===
        '{"indexVersion":"reconciliation-index/v1"}',
  }).compareAndSwapPointer(
    FORECAST_POINTER_PATH,
    {
      fingerprint: initial.pointerFingerprint,
      generation: initial.generation,
    },
    encoder.encode(serializeForecastPointer(rooted)),
  );
  assert.equal(committed.status, "applied");
});

test("FR-013 rebuilds after bounded CAS conflicts and preserves state on exhaustion", async () => {
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const initialBytes = encoder.encode(serializeForecastPointer(initial));
  const artifact = buildForecastArtifact(artifactDraft());
  const operations = new MemoryForecastBlobOperations();
  operations.set(FORECAST_POINTER_PATH, initialBytes, "etag-start");
  let conflicts = 0;
  operations.beforePut = (call, memory) => {
    if (call.pathname === FORECAST_POINTER_PATH && conflicts < 2) {
      conflicts += 1;
      memory.set(call.pathname, initialBytes, `etag-conflict-${conflicts}`);
    }
  };
  const waits: number[] = [];
  const result = await storage(operations, {
    baseDelayMs: 5,
    wait: async (delayMs) => {
      waits.push(delayMs);
    },
  }).updatePointerWithRetry((previous, attempt) => {
    assert.ok(previous);
    return {
      next: forecastPointerWithCandidate(
        previous,
        artifact.artifactId,
        `2026-08-09T20:0${attempt + 1}:00.000Z`,
      ),
      artifact,
    };
  });
  assert.equal(result.status, "applied");
  assert.equal(result.attempts, 3);
  assert.deepEqual(waits, [5, 10]);
  assert.equal(
    operations.putCalls.filter(
      (call) => call.pathname === FORECAST_POINTER_PATH,
    ).length,
    3,
  );

  const alwaysConflict = new MemoryForecastBlobOperations();
  alwaysConflict.set(FORECAST_POINTER_PATH, initialBytes, "etag-initial");
  alwaysConflict.beforePut = (call, memory) => {
    if (call.pathname === FORECAST_POINTER_PATH) {
      memory.set(call.pathname, initialBytes, memory.nextEtag());
    }
  };
  const conflictResult = await storage(alwaysConflict, {
    baseDelayMs: 0,
    wait: async () => undefined,
  }).updatePointerWithRetry((previous, attempt) => {
    assert.ok(previous);
    return {
      next: forecastPointerWithCandidate(
        previous,
        artifact.artifactId,
        `2026-08-09T20:1${attempt}:00.000Z`,
      ),
      artifact,
    };
  });
  assert.equal(conflictResult.status, "conflict");
  assert.equal(conflictResult.attempts, 3);
  assert.deepEqual(
    alwaysConflict.files.get(FORECAST_POINTER_PATH)?.bytes,
    initialBytes,
  );
});

test("FR-013 validates an exact rollback artifact without listing or mutable labels", async () => {
  const first = buildForecastArtifact(artifactDraft());
  const second = buildForecastArtifact(
    artifactDraft("2026-08-09T20:00:01.000Z"),
  );
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  const candidateA = forecastPointerWithCandidate(
    initial,
    first.artifactId,
    "2026-08-09T20:02:00.000Z",
  );
  const activeA = activateForecastPointer(
    candidateA,
    "2026-08-09T20:03:00.000Z",
  );
  const candidateB = forecastPointerWithCandidate(
    activeA,
    second.artifactId,
    "2026-08-09T20:04:00.000Z",
  );
  const activeB = activateForecastPointer(
    candidateB,
    "2026-08-09T20:05:00.000Z",
  );
  const rolledBack = rollbackForecastPointer(
    activeB,
    "2026-08-09T20:06:00.000Z",
  );
  assert.equal(rolledBack.activeArtifactId, first.artifactId);

  const operations = new MemoryForecastBlobOperations();
  operations.set(
    FORECAST_POINTER_PATH,
    encoder.encode(serializeForecastPointer(activeB)),
  );
  operations.set(
    forecastArtifactPath(first.artifactId),
    encoder.encode(serializeForecastArtifact(first)),
  );
  operations.set(
    forecastArtifactPath(second.artifactId),
    encoder.encode(serializeForecastArtifact(second)),
  );
  const rollback = await storage(operations).readRollbackArtifact();
  assert.equal(rollback?.artifact.artifactId, first.artifactId);
  assert.equal(operations.listCalls.length, 0);
  assert.deepEqual(
    operations.getCalls.map((call) => call.pathname),
    [FORECAST_POINTER_PATH, forecastArtifactPath(first.artifactId)],
  );

  operations.files.delete(forecastArtifactPath(first.artifactId));
  await assert.rejects(
    storage(operations).readRollbackArtifact(),
    /Rollback artifact .* is missing/,
  );

  const rollbackCas = new MemoryForecastBlobOperations();
  rollbackCas.set(
    FORECAST_POINTER_PATH,
    encoder.encode(serializeForecastPointer(activeB)),
  );
  rollbackCas.set(
    forecastArtifactPath(first.artifactId),
    encoder.encode(serializeForecastArtifact(first)),
  );
  rollbackCas.set(
    forecastArtifactPath(second.artifactId),
    encoder.encode(serializeForecastArtifact(second)),
  );
  const rollbackResult = await storage(rollbackCas).updatePointerWithRetry(
    (previous) => {
      assert.ok(previous);
      return {
        next: rollbackForecastPointer(
          previous,
          "2026-08-09T20:06:00.000Z",
        ),
      };
    },
  );
  assert.equal(rollbackResult.status, "applied");
  const rollbackReadIndex = rollbackCas.operationLog.indexOf(
    `get:${forecastArtifactPath(first.artifactId)}`,
  );
  const rollbackPutIndex = rollbackCas.operationLog.indexOf(
    `put:${FORECAST_POINTER_PATH}`,
  );
  assert.ok(rollbackReadIndex >= 0);
  assert.ok(rollbackPutIndex > rollbackReadIndex);
  assert.equal(rollbackCas.listCalls.length, 0);

  const missingRollback = new MemoryForecastBlobOperations();
  missingRollback.set(
    FORECAST_POINTER_PATH,
    encoder.encode(serializeForecastPointer(activeB)),
  );
  await assert.rejects(
    storage(missingRollback).updatePointerWithRetry((previous) => {
      assert.ok(previous);
      return {
        next: rollbackForecastPointer(
          previous,
          "2026-08-09T20:06:00.000Z",
        ),
      };
    }),
    /missing-artifact/,
  );
  assert.equal(missingRollback.putCalls.length, 0);
});

test("FR-013 bounds transient read and constrained-list retries", async () => {
  const readOperations = new MemoryForecastBlobOperations();
  readOperations.getErrors.push(
    new BlobServiceNotAvailable(),
    new BlobServiceNotAvailable(),
    new BlobServiceNotAvailable(),
  );
  const readWaits: number[] = [];
  await assert.rejects(
    storage(readOperations, {
      baseDelayMs: 2,
      wait: async (delayMs) => {
        readWaits.push(delayMs);
      },
    }).readExact(FORECAST_POINTER_PATH),
    ForecastBlobRetryExhaustedError,
  );
  assert.equal(readOperations.getCalls.length, 3);
  assert.deepEqual(readWaits, [2, 4]);

  const listOperations = new MemoryForecastBlobOperations();
  listOperations.listError = new BlobServiceNotAvailable();
  const listWaits: number[] = [];
  await assert.rejects(
    storage(listOperations, {
      baseDelayMs: 3,
      wait: async (delayMs) => {
        listWaits.push(delayMs);
      },
    }).listForecastArtifacts(),
    ForecastBlobRetryExhaustedError,
  );
  assert.equal(listOperations.listCalls.length, 3);
  assert.deepEqual(listWaits, [3, 6]);
});

test("FR-013 caps metadata and streamed bytes and constrains artifact listing", async () => {
  const operations = new MemoryForecastBlobOperations();
  operations.set(
    FORECAST_POINTER_PATH,
    new Uint8Array(FORECAST_POINTER_MAX_BYTES + 1),
  );
  await assert.rejects(
    storage(operations).readExact(FORECAST_POINTER_PATH),
    ForecastBlobSizeError,
  );

  const streamed = new MemoryForecastBlobOperations();
  streamed.getOverride = async (pathname) => ({
    statusCode: 200,
    stream: byteStream(new Uint8Array(FORECAST_POINTER_MAX_BYTES + 1)),
    blob: { pathname, size: 1, etag: "lying-etag" },
  });
  await assert.rejects(
    storage(streamed).readExact(FORECAST_POINTER_PATH),
    ForecastBlobSizeError,
  );

  const artifact = buildForecastArtifact(artifactDraft());
  const pathname = forecastArtifactPath(artifact.artifactId);
  const listing = new MemoryForecastBlobOperations();
  listing.listResult = {
    blobs: [
      {
        pathname,
        size: encoder.encode(serializeForecastArtifact(artifact)).byteLength,
        uploadedAt: new Date("2026-08-09T20:00:00.000Z"),
        etag: "artifact-etag",
      },
    ],
    cursor: "next-page",
    hasMore: true,
  };
  assert.deepEqual(await storage(listing).listForecastArtifacts({ limit: 1 }), {
    artifacts: [
      {
        artifactId: artifact.artifactId,
        pathname,
        size: encoder.encode(serializeForecastArtifact(artifact)).byteLength,
        uploadedAt: new Date("2026-08-09T20:00:00.000Z"),
        etag: "artifact-etag",
      },
    ],
    cursor: "next-page",
    hasMore: true,
  });
  await assert.rejects(
    storage(listing).listForecastArtifacts({ limit: 101 }),
    RangeError,
  );
  listing.listResult = {
    blobs: [
      {
        pathname: `forecast/artifacts/${sha("a")}.json/extra`,
        size: 1,
        uploadedAt: new Date(),
        etag: "bad-path",
      },
    ],
    hasMore: false,
  };
  await assert.rejects(
    storage(listing).listForecastArtifacts(),
    ForecastBlobIntegrityError,
  );

  const tooLargeArtifactBytes = new Uint8Array(
    FORECAST_ARTIFACT_MAX_BYTES + 1,
  );
  await assert.rejects(
    storage(new MemoryForecastBlobOperations()).putImmutable(
      pathname,
      tooLargeArtifactBytes,
    ),
    ForecastBlobSizeError,
  );

  const scoreOperations = new MemoryForecastBlobOperations();
  const scoreAdapter = storage(scoreOperations);
  const scoreBytes = encoder.encode(
    '{"scoreVersion":"forecast-score/v1"}',
  );
  const scorePath = `forecast/scores/${rawArtifactDigest(scoreBytes)}.json`;
  assert.deepEqual(await scoreAdapter.putImmutable(scorePath, scoreBytes), {
    status: "created",
  });
  assert.deepEqual(await scoreAdapter.readExact(scorePath), scoreBytes);
  await assert.rejects(
    scoreAdapter.putImmutable(`forecast/scores/${sha("f")}.json`, scoreBytes),
    /SHA-256 path/,
  );
  const oversizedScore = new Uint8Array(FORECAST_BLOB_SCORE_MAX_BYTES + 1);
  await assert.rejects(
    scoreAdapter.putImmutable(
      `forecast/scores/${rawArtifactDigest(oversizedScore)}.json`,
      oversizedScore,
    ),
    ForecastBlobSizeError,
  );
  assert.equal(scoreOperations.listCalls.length, 0);
});

test("FR-013 implements ForecastContractStorage with artifact-before-pointer ordering", async () => {
  const operations = new MemoryForecastBlobOperations();
  const adapter = storage(operations);
  const initial = initializeForecastPointer("2026-08-09T20:01:00.000Z");
  assert.equal(
    (
      await commitForecastArtifactTransition({
        storage: adapter,
        previous: null,
        next: initial,
      })
    ).committed,
    true,
  );
  operations.operationLog.length = 0;
  const artifact = buildForecastArtifact(artifactDraft());
  const candidate = forecastPointerWithCandidate(
    initial,
    artifact.artifactId,
    "2026-08-09T20:02:00.000Z",
  );
  assert.equal(
    (
      await commitForecastArtifactTransition({
        storage: adapter,
        previous: initial,
        next: candidate,
        artifact,
      })
    ).committed,
    true,
  );
  const artifactPut = operations.operationLog.indexOf(
    `put:${forecastArtifactPath(artifact.artifactId)}`,
  );
  const pointerPut = operations.operationLog.indexOf(
    `put:${FORECAST_POINTER_PATH}`,
  );
  assert.ok(artifactPut >= 0);
  assert.ok(pointerPut > artifactPut);
});

test("FR-013 forecast storage has no moderation adapter import", () => {
  const source = readFileSync(
    new URL("../src/lib/forecast-blob-storage.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(source, /from\s+["'][^"']*moderation/);
  assert.doesNotMatch(source, /process\.env\.BLOB_/);
});
