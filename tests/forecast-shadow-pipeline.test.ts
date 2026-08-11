import assert from "node:assert/strict";
import test from "node:test";

import {
  FORECAST_POINTER_PATH,
  commitReconciliationRoot,
  forecastPointerWithCandidate,
  parseForecastArtifact,
  parseForecastPointer,
  rawArtifactDigest,
  reconciliationRootArtifactPath,
  serializeForecastArtifact,
  serializeForecastPointer,
  type AtomicCasResult,
  type ForecastContractStorage,
  type ImmutablePutResult,
} from "../src/lib/forecast-artifact-contracts";
import {
  ForecastShadowPipelineError,
  buildForecastShadowArtifact,
  runForecastShadowPipeline,
} from "../src/lib/forecast-shadow-pipeline";
import { stableSerializeHistoricalAnalysis } from "../src/lib/historical-analysis-dataset";
import {
  FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_EVENTS,
  FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS,
  FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES,
  FORECAST_SHADOW_MAX_SOURCE_RELEASES,
  FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES,
  type PublishedForecastShadowSource,
} from "../src/lib/historical-release-source";

const encoder = new TextEncoder();

function day(index: number): string {
  return new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10);
}

function source(options: { reverse?: boolean; activeTail?: "public" } = {}): PublishedForecastShadowSource {
  const historicalIds = Array.from(
    { length: 24 },
    (_, index) => `history-${String(index).padStart(2, "0")}`,
  );
  const releases: PublishedForecastShadowSource["releases"][number][] =
    historicalIds.map((id, index) => ({
      id,
      lifecycle: "released",
      publicReleaseDate: day(index * 16 + 10),
      statusEffectiveOn: day(index * 16 + 10),
      statusFirstObservedAt: `${day(index * 16 + 11)}T12:00:00.000Z`,
    }));
  releases.push({ id: "active", lifecycle: "active" });
  const events: PublishedForecastShadowSource["events"][number][] =
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
          legacySourceId: `${id}-legacy-dev-1`,
        },
        {
          id: `${id}-dev-2`,
          releaseId: id,
          occurredOn: day(base + 4),
          firstObservedAt: `${day(base + 4)}T12:00:00.000Z`,
          channel: "developerBeta",
          sequence: 2,
          availability: "available",
          legacySourceId: `${id}-legacy-dev-2`,
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
    legacySourceId: "active-legacy-dev-1",
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
  const releaseMetadata: PublishedForecastShadowSource["releaseMetadata"] = [
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
  const compatibilityMilestones: PublishedForecastShadowSource["compatibilityMilestones"][number][] =
    historicalIds.flatMap((id, index) => {
      const base = index * 16;
      return [
        {
          id: `${id}-legacy-dev-1`,
          releaseId: id,
          occurredOn: day(base),
          displayLabel: "Beta 1",
          firstObservedAt: `${day(base)}T12:00:00.000Z`,
          channel: "developerBeta" as const,
          sequence: 1,
          availability: "available" as const,
        },
        {
          id: `${id}-legacy-dev-2`,
          releaseId: id,
          occurredOn: day(base + 4),
          displayLabel: "Beta 2",
          firstObservedAt: `${day(base + 4)}T12:00:00.000Z`,
          channel: "developerBeta" as const,
          sequence: 2,
          availability: "available" as const,
        },
      ];
    });
  compatibilityMilestones.push({
    id: "active-legacy-dev-1",
    releaseId: "active",
    occurredOn: day(24 * 16),
    displayLabel: "Beta 1",
    firstObservedAt: `${day(24 * 16)}T12:00:00.000Z`,
    channel: "developerBeta",
    sequence: 1,
    availability: "available",
  });
  const legacyForecastReleases: PublishedForecastShadowSource["legacyForecastReleases"] = [
    ...historicalIds.map((id, index) => ({
      id,
      version: `${index + 1}.0`,
      lifecycle: "released" as const,
      publicReleaseDate: day(index * 16 + 10),
      platform: { id: "ios", name: "iOS", slug: "ios", sortOrder: 1 },
    })),
    {
      id: "active",
      version: "27.0",
      lifecycle: "active" as const,
      platform: { id: "ios", name: "iOS", slug: "ios", sortOrder: 1 },
    },
  ];
  const legacyForecastMilestones: PublishedForecastShadowSource["legacyForecastMilestones"] = [
    ...historicalIds.flatMap((id, index) => {
      const base = index * 16;
      return [
        { id: `${id}-legacy-dev-1`, releaseId: id, label: "Beta 1", occurredOn: day(base) },
        { id: `${id}-legacy-dev-2`, releaseId: id, label: "Beta 2", occurredOn: day(base + 4) },
      ];
    }),
    { id: "active-legacy-dev-1", releaseId: "active", label: "Beta 1", occurredOn: day(24 * 16) },
  ];
  return {
    releases: options.reverse ? [...releases].reverse() : releases,
    events: options.reverse ? [...events].reverse() : events,
    compatibilityMilestones: options.reverse
      ? [...compatibilityMilestones].reverse()
      : compatibilityMilestones,
    releaseMetadata: options.reverse
      ? [...releaseMetadata].reverse()
      : releaseMetadata,
    legacyForecastReleases: options.reverse
      ? [...legacyForecastReleases].reverse()
      : legacyForecastReleases,
    legacyForecastMilestones: options.reverse
      ? [...legacyForecastMilestones].reverse()
      : legacyForecastMilestones,
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
  requestedAt: "2026-08-09T08:43:00.000Z",
  scheduledFor: "2026-08-09",
};

function storeArtifact(
  storage: MemoryStorage,
  artifact: ReturnType<typeof buildForecastShadowArtifact>,
): void {
  storage.files.set(
    `forecast/artifacts/${artifact.artifactId}.json`,
    encoder.encode(serializeForecastArtifact(artifact)),
  );
}

function storePointer(
  storage: MemoryStorage,
  pointer: ReturnType<typeof parseForecastPointer>,
): void {
  storage.files.set(
    FORECAST_POINTER_PATH,
    encoder.encode(serializeForecastPointer(pointer)),
  );
}

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
    assert.equal(publicTarget.productFamilyId, "iphone");
    assert.deepEqual(
      publicTarget.benchmarks.map((benchmark) => benchmark.benchmarkId),
      ["selected-private-model", "current-public-heuristic", "simple-baseline"],
    );
    assert.equal(publicTarget.benchmarks[0]!.availability, "available");
    assert.equal(
      publicTarget.benchmarks[0]!.calibrationFingerprint,
      publicTarget.calibrationFingerprint,
    );
    assert.equal(
      publicTarget.benchmarks[1]!.sourceFingerprint,
      first.provenance.currentPublicHeuristic.sourceFingerprint,
    );
    assert.equal(publicTarget.benchmarks[2]!.availability, "available");
  }
  if (nextTarget?.availability === "available") {
    assert.equal(
      nextTarget.prediction.pointEstimator,
      "next-event-timing-median",
    );
    assert.equal(nextTarget.predictedEligibleStage, "developer-beta");
    assert.deepEqual(
      nextTarget.cohort.modelTrainingCohorts.map((cohort) => cohort.role),
      ["stage-training", "timing-training"],
    );
    assert.equal(nextTarget.benchmarks[0]!.availability, "available");
    assert.deepEqual(nextTarget.benchmarks[1], {
      benchmarkVersion: "forecast-origin-benchmark/v1",
      benchmarkId: "current-public-heuristic",
      modelVersion: "current-public-heuristic/v1",
      sourceFingerprint: first.provenance.currentPublicHeuristic.sourceFingerprint,
      modelFingerprint: first.provenance.currentPublicHeuristic.modelFingerprint,
      calibrationFingerprint: null,
      cohorts: [],
      availability: "unavailable",
      reason: "incomparable-target-definition",
    });
    assert.equal(nextTarget.benchmarks[2]!.availability, "available");
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

test("FR-012 snapshots an available current public heuristic only after exact anchor proof", () => {
  const originDay = day(24 * 16 + 2);
  const artifact = buildForecastShadowArtifact(
    {
      requestedAt: `${originDay}T08:43:00.000Z`,
      scheduledFor: originDay,
    },
    source(),
  );
  const target = artifact.targets.find(
    (candidate) => candidate.targetKind === "public-release",
  );
  assert.ok(target);
  const current = target?.benchmarks[1];
  assert.ok(current?.availability === "available");
  if (current?.availability === "available") {
    assert.equal(current.prediction.targetKind, "public-release");
    assert.equal(current.cohorts.length, 1);
    assert.equal(current.cohorts[0]!.binding, "inline");
    assert.equal(current.cohorts[0]!.memberCount, 12);
  }

  const unlinked = source();
  unlinked.legacyForecastMilestones = unlinked.legacyForecastMilestones.filter(
    (milestone) => milestone.releaseId !== "active",
  );
  assert.throws(
    () =>
      buildForecastShadowArtifact(
        {
          requestedAt: `${originDay}T08:43:00.000Z`,
          scheduledFor: originDay,
        },
        unlinked,
      ),
    ForecastShadowPipelineError,
  );

  const wrongPlatform = source();
  wrongPlatform.legacyForecastReleases = wrongPlatform.legacyForecastReleases.map(
    (release) =>
      release.id === "history-00"
        ? { ...release, platform: { ...release.platform, id: "ipados" } }
        : release,
  );
  assert.throws(
    () =>
      buildForecastShadowArtifact(
        {
          requestedAt: `${originDay}T08:43:00.000Z`,
          scheduledFor: originDay,
        },
        wrongPlatform,
      ),
    ForecastShadowPipelineError,
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

test("FR-014 enforces its operational artifact budget below the hard contract cap", () => {
  const oversized = source();
  oversized.releaseMetadata = oversized.releaseMetadata.map((entry, index) => ({
    ...entry,
    sourceEvidenceIds: Array.from(
      { length: FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS },
      (_, evidenceIndex) =>
        `evidence-${String(index).padStart(3, "0")}-${String(evidenceIndex).padStart(3, "0")}-${"x".repeat(72)}`,
    ),
  }));
  assert.throws(
    () => buildForecastShadowArtifact(request, oversized),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "artifact-too-large",
  );
});

test("FR-014 rejects an unbounded source collection before model execution", () => {
  const unbounded = {
    ...source(),
    releases: Array.from(
      { length: FORECAST_SHADOW_MAX_SOURCE_RELEASES + 1 },
      (_, index) => ({ id: `active-${index}`, lifecycle: "active" as const }),
    ),
  };
  assert.throws(
    () => buildForecastShadowArtifact(request, unbounded),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );
});

test("FR-014 rejects raw observation instants later than the exact request instant", () => {
  const futureInstant = "2026-08-09T23:59:00.000Z";
  const variants: PublishedForecastShadowSource[] = [];

  const releaseVariant = source();
  releaseVariant.releases = releaseVariant.releases.map((release, index) =>
    index === 0
      ? { ...release, statusFirstObservedAt: futureInstant }
      : release,
  );
  variants.push(releaseVariant);

  const eventVariant = source();
  eventVariant.events = eventVariant.events.map((event, index) =>
    index === 0 ? { ...event, firstObservedAt: futureInstant } : event,
  );
  variants.push(eventVariant);

  const milestoneVariant = source();
  milestoneVariant.compatibilityMilestones = [
    {
      id: "future-milestone",
      releaseId: "active",
      occurredOn: day(24 * 16),
      displayLabel: "Beta 1",
      channel: "developerBeta",
      firstObservedAt: futureInstant,
    },
  ];
  variants.push(milestoneVariant);

  for (const variant of variants) {
    assert.throws(
      () => buildForecastShadowArtifact(request, variant),
      (error: unknown) =>
        error instanceof ForecastShadowPipelineError &&
        error.code === "invalid-source",
    );
  }
});

test("FR-014 rejects malformed provided observation instants", () => {
  const malformedInstant = "2026-08-09T08:42:00Z";
  const variants: PublishedForecastShadowSource[] = [];

  const releaseVariant = source();
  releaseVariant.releases = releaseVariant.releases.map((release, index) =>
    index === 0
      ? { ...release, statusFirstObservedAt: malformedInstant }
      : release,
  );
  variants.push(releaseVariant);

  const eventVariant = source();
  eventVariant.events = eventVariant.events.map((event, index) =>
    index === 0 ? { ...event, firstObservedAt: malformedInstant } : event,
  );
  variants.push(eventVariant);

  const milestoneVariant = source();
  milestoneVariant.compatibilityMilestones = [
    {
      id: "malformed-milestone",
      releaseId: "active",
      occurredOn: day(24 * 16),
      displayLabel: "Beta 1",
      channel: "developerBeta",
      firstObservedAt: malformedInstant,
    },
  ];
  variants.push(milestoneVariant);

  for (const variant of variants) {
    assert.throws(
      () => buildForecastShadowArtifact(request, variant),
      (error: unknown) =>
        error instanceof ForecastShadowPipelineError &&
        error.code === "invalid-source",
    );
  }
});

test("FR-012 rejects malformed legacy comparator rows and excludes future legacy facts", () => {
  const malformed = source();
  malformed.legacyForecastReleases = malformed.legacyForecastReleases.map(
    (release, index) => index === 0 ? { ...release, surprise: true } : release,
  );
  assert.throws(
    () => buildForecastShadowArtifact(request, malformed),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );

  const mismatched = source();
  mismatched.legacyForecastMilestones =
    mismatched.legacyForecastMilestones.map((milestone, index) =>
      index === 0 ? { ...milestone, occurredOn: day(2) } : milestone,
    );
  assert.throws(
    () => buildForecastShadowArtifact(request, mismatched),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );

  const mismatchedLabel = source();
  mismatchedLabel.legacyForecastMilestones =
    mismatchedLabel.legacyForecastMilestones.map((milestone, index) =>
      index === 0 ? { ...milestone, label: "Release Candidate 1" } : milestone,
    );
  assert.throws(
    () => buildForecastShadowArtifact(request, mismatchedLabel),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );

  const duplicateMilestone = source();
  duplicateMilestone.legacyForecastMilestones = [
    ...duplicateMilestone.legacyForecastMilestones,
    duplicateMilestone.legacyForecastMilestones[0]!,
  ];
  assert.throws(
    () => buildForecastShadowArtifact(request, duplicateMilestone),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );

  const baseline = buildForecastShadowArtifact(request, source());
  const future = source();
  future.compatibilityMilestones = [
    ...future.compatibilityMilestones,
    {
      id: "active-future-dev-2",
      releaseId: "active",
      occurredOn: "2027-01-01",
      displayLabel: "Beta 2",
      channel: "developerBeta",
      sequence: 2,
      availability: "available",
    },
  ];
  future.legacyForecastMilestones = [
    ...future.legacyForecastMilestones,
    {
      id: "active-future-dev-2",
      releaseId: "active",
      label: "Beta 2",
      occurredOn: "2027-01-01",
    },
  ];
  const withFuture = buildForecastShadowArtifact(request, future);
  assert.equal(
    withFuture.provenance.currentPublicHeuristic.sourceFingerprint,
    baseline.provenance.currentPublicHeuristic.sourceFingerprint,
  );
});

test("FR-014 bounds source strings and evidence arrays", () => {
  const longString = source();
  longString.releases = longString.releases.map((release, index) =>
    index === 0
      ? { ...release, id: "x".repeat(FORECAST_SHADOW_MAX_SOURCE_STRING_BYTES + 1) }
      : release,
  );
  assert.throws(
    () => buildForecastShadowArtifact(request, longString),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );

  const excessEvidence = source();
  excessEvidence.releaseMetadata = excessEvidence.releaseMetadata.map(
    (metadata, index) =>
      index === 0
        ? {
            ...metadata,
            sourceEvidenceIds: Array.from(
              { length: FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_IDS + 1 },
              (_, evidenceIndex) => `evidence-${evidenceIndex}`,
            ),
          }
        : metadata,
  );
  assert.throws(
    () => buildForecastShadowArtifact(request, excessEvidence),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );

  const longEvidence = source();
  longEvidence.releaseMetadata = longEvidence.releaseMetadata.map(
    (metadata, index) =>
      index === 0
        ? {
            ...metadata,
            sourceEvidenceIds: [
              "x".repeat(FORECAST_SHADOW_MAX_SOURCE_EVIDENCE_ID_BYTES + 1),
            ],
          }
        : metadata,
  );
  assert.throws(
    () => buildForecastShadowArtifact(request, longEvidence),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );
});

test("FR-014 rejects a source above its canonical byte cap", () => {
  const oversized = source();
  const padding = "x".repeat(470);
  oversized.events = Array.from(
    { length: FORECAST_SHADOW_MAX_SOURCE_EVENTS },
    (_, index) => ({
      id: `event-${index}-${padding}`,
      stableEventId: `stable-${index}-${padding}`,
      releaseId: "active",
      occurredOn: day(24 * 16),
      firstObservedAt: `${day(24 * 16)}T12:00:00.000Z`,
      channel: "developerBeta" as const,
      revisionOfId: `revision-${index}-${padding}`,
      replacesEventId: `replaces-${index}-${padding}`,
      replacedByEventId: `replaced-by-${index}-${padding}`,
      legacySourceId: `legacy-${index}-${padding}`,
    }),
  );
  assert.ok(
    encoder.encode(stableSerializeHistoricalAnalysis(oversized)).byteLength >
      FORECAST_SHADOW_MAX_SOURCE_CANONICAL_BYTES,
  );
  assert.throws(
    () => buildForecastShadowArtifact(request, oversized),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-source",
  );
});

test("FR-014 validates a same-day candidate before returning the active artifact", async () => {
  const storage = new MemoryStorage();
  let fetches = 0;
  const dependencies = {
    storage,
    fetchPublishedSource: async () => {
      fetches += 1;
      return source();
    },
  };
  await runForecastShadowPipeline(request, dependencies);
  const activePointer = parseForecastPointer(
    storage.files.get(FORECAST_POINTER_PATH)!,
  );
  const futureCandidate = buildForecastShadowArtifact(
    {
      requestedAt: "2026-08-09T23:59:00.000Z",
      scheduledFor: request.scheduledFor,
    },
    source(),
  );
  storeArtifact(storage, futureCandidate);
  storePointer(
    storage,
    forecastPointerWithCandidate(
      activePointer,
      futureCandidate.artifactId,
      "2026-08-09T08:44:00.000Z",
    ),
  );

  await assert.rejects(
    () => runForecastShadowPipeline(request, dependencies),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-storage",
  );
  assert.equal(fetches, 1);
});

test("FR-014 validates rollback references before a same-day return", async () => {
  const storage = new MemoryStorage();
  let fetches = 0;
  const dependencies = {
    storage,
    fetchPublishedSource: async () => {
      fetches += 1;
      return source();
    },
  };
  await runForecastShadowPipeline(request, dependencies);
  const nextRequest = {
    requestedAt: "2026-08-10T08:43:00.000Z",
    scheduledFor: "2026-08-10",
  };
  await runForecastShadowPipeline(nextRequest, dependencies);
  const pointer = parseForecastPointer(
    storage.files.get(FORECAST_POINTER_PATH)!,
  );
  assert.ok(pointer.rollbackArtifactId);
  storage.files.delete(
    `forecast/artifacts/${pointer.rollbackArtifactId}.json`,
  );

  await assert.rejects(
    () => runForecastShadowPipeline(nextRequest, dependencies),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-storage",
  );
  assert.equal(fetches, 2);
});

test("FR-014 validates reconciliation roots before a same-day return", async () => {
  const storage = new MemoryStorage();
  let fetches = 0;
  const fetchPublishedSource = async () => {
    fetches += 1;
    return source();
  };
  await runForecastShadowPipeline(request, { storage, fetchPublishedSource });
  const activePointer = parseForecastPointer(
    storage.files.get(FORECAST_POINTER_PATH)!,
  );
  const rootBytes = encoder.encode('{"rootVersion":"test/v1"}');
  const rootId = rawArtifactDigest(rootBytes);
  storage.files.set(reconciliationRootArtifactPath(rootId), rootBytes);
  storePointer(
    storage,
    commitReconciliationRoot(
      activePointer,
      rootId,
      "2026-08-09T08:44:00.000Z",
    ),
  );

  await assert.rejects(
    () =>
      runForecastShadowPipeline(request, { storage, fetchPublishedSource }),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-storage",
  );
  assert.equal(fetches, 1);

  const valid = await runForecastShadowPipeline(request, {
    storage,
    fetchPublishedSource,
    validateReconciliationRoot: (bytes, expectedId) =>
      rawArtifactDigest(bytes) === expectedId,
  });
  assert.equal(valid.status, "already-active");
  assert.equal(fetches, 1);

  storage.files.set(
    reconciliationRootArtifactPath(rootId),
    encoder.encode('{"rootVersion":"corrupt"}'),
  );
  await assert.rejects(
    () =>
      runForecastShadowPipeline(request, {
        storage,
        fetchPublishedSource,
        validateReconciliationRoot: () => true,
      }),
    (error: unknown) =>
      error instanceof ForecastShadowPipelineError &&
      error.code === "invalid-storage",
  );
  assert.equal(fetches, 1);
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
