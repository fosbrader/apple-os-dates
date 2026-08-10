import assert from "node:assert/strict";
import test from "node:test";

import {
  FORECAST_POINTER_PATH,
  parseForecastArtifact,
  parseForecastPointer,
  type AtomicCasResult,
  type ForecastContractStorage,
  type ImmutablePutResult,
} from "../src/lib/forecast-artifact-contracts";
import {
  ForecastShadowPipelineError,
  buildForecastShadowArtifact,
  runForecastShadowPipeline,
} from "../src/lib/forecast-shadow-pipeline";
import type { PublishedHistoricalReleaseSource } from "../src/lib/historical-release-source";

function day(index: number): string {
  return new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10);
}

function source(options: { reverse?: boolean; activeTail?: "public" } = {}): PublishedHistoricalReleaseSource {
  const historicalIds = Array.from(
    { length: 24 },
    (_, index) => `history-${String(index).padStart(2, "0")}`,
  );
  const releases: PublishedHistoricalReleaseSource["releases"][number][] =
    historicalIds.map((id, index) => ({
      id,
      lifecycle: "released",
      publicReleaseDate: day(index * 16 + 10),
      statusEffectiveOn: day(index * 16 + 10),
      statusFirstObservedAt: `${day(index * 16 + 11)}T12:00:00.000Z`,
    }));
  releases.push({ id: "active", lifecycle: "active" });
  const events: PublishedHistoricalReleaseSource["events"][number][] =
    historicalIds.flatMap((id, index) => {
      const base = index * 16;
      return [
        {
          id: `${id}-dev-1`,
          releaseId: id,
          occurredOn: day(base),
          firstObservedAt: `${day(base)}T12:00:00.000Z`,
          channel: "developerBeta",
          sequence: 1,
          availability: "available",
        },
        {
          id: `${id}-dev-2`,
          releaseId: id,
          occurredOn: day(base + 4),
          firstObservedAt: `${day(base + 4)}T12:00:00.000Z`,
          channel: "developerBeta",
          sequence: 2,
          availability: "available",
        },
      ];
    });
  events.push({
    id: "active-dev-1",
    releaseId: "active",
    occurredOn: day(24 * 16),
    firstObservedAt: `${day(24 * 16)}T12:00:00.000Z`,
    channel: "developerBeta",
    sequence: 1,
    availability: "available",
  });
  if (options.activeTail === "public") {
    events.push({
      id: "active-public",
      releaseId: "active",
      occurredOn: day(24 * 16 + 2),
      firstObservedAt: `${day(24 * 16 + 2)}T12:00:00.000Z`,
      channel: "public",
      availability: "available",
    });
  }
  const releaseMetadata: PublishedHistoricalReleaseSource["releaseMetadata"] = [
    ...historicalIds,
    "active",
  ].map((releaseId, index) => ({
    releaseId,
    platformId: "ios",
    productFamilyId: "iphone",
    releaseClass: "major",
    releasePosition: (index % 3) + 1,
    releaseCycleId: `${releaseId}-cycle`,
    chronologyCoverage: {
      state: "complete",
      sourceEvidenceIds: [`coverage-${releaseId}`],
    },
    sourceEvidenceIds: [`metadata-${releaseId}`],
  }));
  return {
    releases: options.reverse ? [...releases].reverse() : releases,
    events: options.reverse ? [...events].reverse() : events,
    compatibilityMilestones: [],
    releaseMetadata: options.reverse
      ? [...releaseMetadata].reverse()
      : releaseMetadata,
  };
}

class MemoryStorage implements ForecastContractStorage {
  readonly atomicPointerCas = true;
  readonly files = new Map<string, Uint8Array>();
  failImmutable = false;
  blockActivation = false;

  async readExact(path: string): Promise<Uint8Array | null> {
    return this.files.get(path)?.slice() ?? null;
  }

  async putImmutable(
    path: string,
    bytes: Uint8Array,
  ): Promise<ImmutablePutResult> {
    if (this.failImmutable) throw new Error("immutable write failed");
    const existing = this.files.get(path);
    if (existing) return { status: "exists" };
    this.files.set(path, bytes.slice());
    return { status: "created" };
  }

  async compareAndSwapPointer(
    path: typeof FORECAST_POINTER_PATH,
    expected: { fingerprint: string | null; generation: number },
    nextBytes: Uint8Array,
  ): Promise<AtomicCasResult> {
    const currentBytes = this.files.get(path);
    const current = currentBytes ? parseForecastPointer(currentBytes) : null;
    const observedPreviousFingerprint = current?.pointerFingerprint ?? null;
    const observedPreviousGeneration = current?.generation ?? 0;
    const next = parseForecastPointer(nextBytes);
    if (
      this.blockActivation &&
      next.transition === "activate-shadow"
    ) {
      return {
        status: "mismatch",
        atomic: true,
        observedPreviousFingerprint,
        observedPreviousGeneration,
      };
    }
    if (
      observedPreviousFingerprint !== expected.fingerprint ||
      observedPreviousGeneration !== expected.generation
    ) {
      return {
        status: "mismatch",
        atomic: true,
        observedPreviousFingerprint,
        observedPreviousGeneration,
      };
    }
    this.files.set(path, nextBytes.slice());
    return {
      status: "applied",
      atomic: true,
      observedPreviousFingerprint,
      observedPreviousGeneration,
    };
  }
}

const request = {
  requestedAt: "2026-08-09T12:43:00.000Z",
  scheduledFor: "2026-08-09",
};

test("FR-014 builds deterministic exact-estimator public and next-event targets", () => {
  const first = buildForecastShadowArtifact(request, source());
  const reversed = buildForecastShadowArtifact(request, source({ reverse: true }));

  assert.deepEqual(first, reversed);
  assert.equal(first.targets.length, 2);
  assert.ok(first.targets.every((target) => target.availability === "available"));
  const publicTarget = first.targets.find(
    (target) => target.targetKind === "public-release",
  );
  const nextTarget = first.targets.find(
    (target) => target.targetKind === "next-eligible-prerelease-event",
  );
  assert.ok(publicTarget?.availability === "available");
  assert.ok(nextTarget?.availability === "available");
  if (publicTarget?.availability === "available") {
    assert.ok(
      ["platform-stage-median", "hierarchical-platform-cadence"].includes(
        publicTarget.prediction.pointEstimator,
      ),
    );
    assert.equal(publicTarget.anchorEventId, "event:active-dev-1");
  }
  if (nextTarget?.availability === "available") {
    assert.equal(
      nextTarget.prediction.pointEstimator,
      "next-event-timing-median",
    );
    assert.equal(nextTarget.predictedEligibleStage, "developer-beta");
  }
  assert.ok(first.provenance.sourceEvidenceIds.length > 24);
  assert.ok(
    first.targets.every((target) =>
      target.sourceEvidenceIds.every((id) =>
        first.provenance.sourceEvidenceIds.includes(id),
      ),
    ),
  );
});

test("FR-014 activates once and a same-day rerun performs no fetch or write", async () => {
  const storage = new MemoryStorage();
  let fetches = 0;
  const dependencies = {
    storage,
    fetchPublishedSource: async () => {
      fetches += 1;
      return source();
    },
  };

  const first = await runForecastShadowPipeline(request, dependencies);
  assert.equal(first.status, "activated");
  assert.equal(fetches, 1);
  const pointer = parseForecastPointer(storage.files.get(FORECAST_POINTER_PATH)!);
  assert.equal(pointer.activeArtifactId, first.artifactId);
  assert.equal(pointer.candidateArtifactId, null);
  const active = parseForecastArtifact(
    storage.files.get(`forecast/artifacts/${first.artifactId}.json`)! ,
  );
  assert.equal(active.runKey, first.runKey);

  const rerun = await runForecastShadowPipeline(request, dependencies);
  assert.equal(rerun.status, "already-active");
  assert.equal(rerun.artifactId, first.artifactId);
  assert.equal(fetches, 1);
});

test("FR-014 resumes an interrupted candidate without rebuilding source", async () => {
  const storage = new MemoryStorage();
  storage.blockActivation = true;
  let fetches = 0;
  const dependencies = {
    storage,
    fetchPublishedSource: async () => {
      fetches += 1;
      return source();
    },
  };

  await assert.rejects(
    () => runForecastShadowPipeline(request, dependencies),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "transition-conflict",
  );
  const interrupted = parseForecastPointer(
    storage.files.get(FORECAST_POINTER_PATH)!,
  );
  assert.ok(interrupted.candidateArtifactId);
  assert.equal(interrupted.activeArtifactId, null);
  assert.equal(fetches, 1);

  storage.blockActivation = false;
  const resumed = await runForecastShadowPipeline(request, dependencies);
  assert.equal(resumed.status, "activated");
  assert.equal(resumed.artifactId, interrupted.candidateArtifactId);
  assert.equal(fetches, 1);
});

test("FR-014 resolves cross-instance overlap with one active artifact", async () => {
  const storage = new MemoryStorage();
  let fetches = 0;
  const dependencies = {
    storage,
    fetchPublishedSource: async () => {
      fetches += 1;
      await Promise.resolve();
      return source();
    },
  };

  const results = await Promise.all([
    runForecastShadowPipeline(request, dependencies),
    runForecastShadowPipeline(request, dependencies),
  ]);
  const pointer = parseForecastPointer(storage.files.get(FORECAST_POINTER_PATH)!);
  assert.ok(pointer.activeArtifactId);
  assert.equal(pointer.candidateArtifactId, null);
  assert.ok(results.some((result) => result.status === "activated"));
  assert.ok(results.every((result) => result.artifactId === pointer.activeArtifactId));
  assert.ok(fetches >= 1 && fetches <= 2);
});

test("FR-014 failures preserve the prior active artifact and pointer", async () => {
  const storage = new MemoryStorage();
  const dependencies = {
    storage,
    fetchPublishedSource: async () => source(),
  };
  const first = await runForecastShadowPipeline(request, dependencies);
  const pointerBefore = storage.files.get(FORECAST_POINTER_PATH)!.slice();
  storage.failImmutable = true;

  await assert.rejects(
    () =>
      runForecastShadowPipeline(
        {
          requestedAt: "2026-08-10T12:43:00.000Z",
          scheduledFor: "2026-08-10",
        },
        dependencies,
      ),
    ForecastShadowPipelineError,
  );
  assert.deepEqual(storage.files.get(FORECAST_POINTER_PATH), pointerBefore);
  const pointer = parseForecastPointer(pointerBefore);
  assert.equal(pointer.activeArtifactId, first.artifactId);
  assert.ok(storage.files.has(`forecast/artifacts/${first.artifactId}.json`));
});

test("FR-014 never skips a later public event to reuse an earlier beta", () => {
  const artifact = buildForecastShadowArtifact(request, source({ activeTail: "public" }));
  assert.equal(artifact.targets.length, 0);
  assert.deepEqual(
    artifact.exclusions.map((exclusion) => exclusion.reason),
    ["terminal-or-ineligible-latest-event", "public-release-already-observed"],
  );
  assert.ok(
    artifact.exclusions.every(
      (exclusion) => exclusion.targetId === null,
    ),
  );
});

test("FR-014 rejects mismatched run identity before reading source or storage", async () => {
  const storage = new MemoryStorage();
  let fetches = 0;
  await assert.rejects(
    () =>
      runForecastShadowPipeline(
        {
          requestedAt: "2026-08-10T00:00:00.000Z",
          scheduledFor: "2026-08-09",
        },
        {
          storage,
          fetchPublishedSource: async () => {
            fetches += 1;
            return source();
          },
        },
      ),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-request",
  );
  assert.equal(fetches, 0);
  assert.equal(storage.files.size, 0);
});
