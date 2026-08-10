import assert from "node:assert/strict";
import test from "node:test";

import { buildHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";
import {
  NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES,
  NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT,
  NEXT_EVENT_SIMPLE_BASELINE_VERSION,
  buildNextEligiblePrereleaseEventModel,
  buildNextEventSimpleBaseline,
  predictNextEligiblePrereleaseEvent,
  validateNextEligiblePrereleaseEventModel,
} from "../src/lib/next-eligible-prerelease-event";

function day(index: number): string { return new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10); }

type EndpointKind = "developer" | "public" | "rc";
type SourceEvent =
  | { id: string; releaseId: string; occurredOn: string; firstObservedAt: string; channel: "developerBeta" | "publicBeta" | "releaseCandidate"; sequence: number; availability: "available" }
  | { id: string; releaseId: string; occurredOn: string; firstObservedAt: string; channel: "goldenMaster" | "public"; availability: "available" };
function source(options: { count?: number; firstDeveloperEndpoints?: number; endpointPattern?: readonly EndpointKind[]; tie?: boolean; reverse?: boolean; platform?: string; activePlatform?: string; activeTail?: "gm" | "public" } = {}) {
  const count = options.count ?? 20;
  const firstDeveloperEndpoints = options.tie ? 4 : options.firstDeveloperEndpoints ?? 14;
  const ids = Array.from({ length: count }, (_, index) => `ios-${String(index).padStart(2, "0")}`);
  const releases: ({ id: string; lifecycle: "released"; publicReleaseDate: string; statusEffectiveOn: string; statusFirstObservedAt: string } | { id: string; lifecycle: "active" })[] = ids.map((id, index) => ({ id, lifecycle: "released" as const, publicReleaseDate: day(index * 16 + 10), statusEffectiveOn: day(index * 16 + 10), statusFirstObservedAt: `${day(index * 16 + 11)}T12:00:00.000Z` }));
  releases.push({ id: "active", lifecycle: "active" });
  const events: SourceEvent[] = ids.flatMap((id, index) => {
    const base = index * 16;
    const kind = options.endpointPattern?.[index] ?? (index < firstDeveloperEndpoints ? "developer" : "public");
    const endpoint = kind === "developer"
      ? { id: `${id}-dev-2`, releaseId: id, occurredOn: day(base + 4), firstObservedAt: `${day(base + 4)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 2, availability: "available" as const }
      : kind === "public"
        ? { id: `${id}-public-1`, releaseId: id, occurredOn: day(base + 4), firstObservedAt: `${day(base + 4)}T12:00:00.000Z`, channel: "publicBeta" as const, sequence: 1, availability: "available" as const }
        : { id: `${id}-rc-1`, releaseId: id, occurredOn: day(base + 4), firstObservedAt: `${day(base + 4)}T12:00:00.000Z`, channel: "releaseCandidate" as const, sequence: 1, availability: "available" as const };
    return [
      { id: `${id}-dev-1`, releaseId: id, occurredOn: day(base), firstObservedAt: `${day(base)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
      endpoint,
    ];
  });
  events.push({ id: "active-dev-1", releaseId: "active", occurredOn: day(count * 16), firstObservedAt: `${day(count * 16)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const });
  if (options.activeTail) events.push({ id: `active-${options.activeTail}`, releaseId: "active", occurredOn: day(count * 16 + 2), firstObservedAt: `${day(count * 16 + 2)}T12:00:00.000Z`, channel: options.activeTail === "gm" ? "goldenMaster" : "public", availability: "available" });
  const metadata = [...ids, "active"].map((id, index) => ({ releaseId: id, platformId: id === "active" ? options.activePlatform ?? options.platform ?? "ios" : options.platform ?? "ios", productFamilyId: "iphone", releaseClass: "major" as const, releasePosition: (index % 3) + 1, releaseCycleId: `${id}-cycle`, chronologyCoverage: { state: "complete" as const, sourceEvidenceIds: [`coverage-${id}`] }, sourceEvidenceIds: [`metadata-${id}`] }));
  return buildHistoricalAnalysisDataset({ adapterResult: adaptReleaseObservations({ asOfDate: "2025-12-31", issuedAt: "2025-12-31T12:00:00.000Z", releases: options.reverse ? [...releases].reverse() : releases, events: options.reverse ? [...events].reverse() : events, compatibilityMilestones: [] }), releaseMetadata: options.reverse ? [...metadata].reverse() : metadata });
}

function edgeCasesSource() {
  const releases: ({ id: string; lifecycle: "released"; publicReleaseDate: string; statusEffectiveOn: string; statusFirstObservedAt: string } | { id: string; lifecycle: "active" })[] = ["terminal", "public-terminal", "ambiguous", "ineligible-between"].map((id, index) => ({ id, lifecycle: "released" as const, publicReleaseDate: day(index * 20 + 10), statusEffectiveOn: day(index * 20 + 10), statusFirstObservedAt: `${day(index * 20 + 11)}T12:00:00.000Z` }));
  releases.push({ id: "active-ambiguous", lifecycle: "active" });
  const events = [
    { id: "terminal-dev", releaseId: "terminal", occurredOn: day(0), firstObservedAt: `${day(0)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
    { id: "terminal-gm", releaseId: "terminal", occurredOn: day(4), firstObservedAt: `${day(4)}T12:00:00.000Z`, channel: "goldenMaster" as const, availability: "available" as const },
    { id: "public-terminal-dev", releaseId: "public-terminal", occurredOn: day(20), firstObservedAt: `${day(20)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
    { id: "public-terminal-public", releaseId: "public-terminal", occurredOn: day(24), firstObservedAt: `${day(24)}T12:00:00.000Z`, channel: "public" as const, availability: "available" as const },
    { id: "ambiguous-dev", releaseId: "ambiguous", occurredOn: day(20), firstObservedAt: `${day(20)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
    { id: "ambiguous-public", releaseId: "ambiguous", occurredOn: day(20), firstObservedAt: `${day(20)}T12:00:00.000Z`, channel: "publicBeta" as const, sequence: 1, availability: "available" as const },
    { id: "active-ambiguous-dev", releaseId: "active-ambiguous", occurredOn: day(60), firstObservedAt: `${day(60)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
    { id: "active-ambiguous-public", releaseId: "active-ambiguous", occurredOn: day(60), firstObservedAt: `${day(60)}T12:00:00.000Z`, channel: "publicBeta" as const, sequence: 1, availability: "available" as const },
    { id: "between-dev-1", releaseId: "ineligible-between", occurredOn: day(60), firstObservedAt: `${day(60)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const },
    { id: "between-gm", releaseId: "ineligible-between", occurredOn: day(64), firstObservedAt: `${day(64)}T12:00:00.000Z`, channel: "goldenMaster" as const, availability: "available" as const },
    { id: "between-dev-2", releaseId: "ineligible-between", occurredOn: day(66), firstObservedAt: `${day(66)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 2, availability: "available" as const },
  ];
  const metadata = releases.map((release) => ({ releaseId: release.id, platformId: "ios", productFamilyId: "iphone", releaseClass: "major" as const, releasePosition: 1, releaseCycleId: `${release.id}-cycle`, chronologyCoverage: { state: "complete" as const, sourceEvidenceIds: [`coverage-${release.id}`] }, sourceEvidenceIds: [`metadata-${release.id}`] }));
  return buildHistoricalAnalysisDataset({ adapterResult: adaptReleaseObservations({ asOfDate: "2025-12-31", issuedAt: "2025-12-31T12:00:00.000Z", releases, events, compatibilityMilestones: [] }), releaseMetadata: metadata });
}

test("FR-011 is deterministic, prerelease-only, platform-bounded, and strictly calibrated", () => {
  const left = buildNextEligiblePrereleaseEventModel(source({ count: 24, firstDeveloperEndpoints: 24 }));
  const right = buildNextEligiblePrereleaseEventModel(source({ count: 24, firstDeveloperEndpoints: 24, reverse: true }));
  assert.deepEqual(left, right);
  assert.deepEqual(validateNextEligiblePrereleaseEventModel(left), []);
  assert.equal(NEXT_ELIGIBLE_PRERELEASE_EVENT_MINIMUM_EXAMPLES, 8);
  assert.ok(left.targets.every((target) => target.endpointStage.startsWith(`${target.endpointEligibleStage}:`)));
  const calibrated = left.forecasts.find((forecast) => forecast.intervals.some((interval) => interval.available));
  assert.ok(calibrated);
  if (calibrated) {
    assert.ok(calibrated.residualPool.residualTargetIds.length >= 8);
    const residuals = left.residualLedger.filter((row) => row.outerFoldId === calibrated.fold.foldId && row.included);
    assert.ok(residuals.every((row) => {
      const inner = left.forecasts.find((forecast) => forecast.fold.foldId === row.innerFoldId)!;
      return inner.fold.originOn < calibrated.fold.originOn && inner.target.endpointFirstObservedOn <= calibrated.fold.originOn && inner.target.platformId === calibrated.target.platformId;
    }));
  }
  assert.ok(left.forecasts.every((forecast) => forecast.fold.trainingTargetIds.every((id) => {
    const target = left.targets.find((row) => row.targetId === id)!;
    return target.originOn <= forecast.fold.originOn && target.endpointOccurredOn <= forecast.fold.originOn && target.endpointFirstObservedOn <= forecast.fold.originOn;
  })));
  const eight = left.forecasts.find((forecast) => forecast.intervals.every((interval) => interval.available && interval.residualCount === 8));
  assert.ok(eight);
  if (eight) {
    const [fifty, eighty] = eight.intervals;
    if (fifty?.available && eighty?.available) {
      assert.equal(fifty.rank, 5);
      assert.equal(eighty.rank, 8);
      assert.ok(fifty.lowerDays >= eighty.lowerDays && fifty.upperDays <= eighty.upperDays);
    }
  }
  const mixed = buildNextEligiblePrereleaseEventModel(source());
  const stageMiss = mixed.forecasts.find((forecast) => forecast.stage.available && forecast.timing.available && forecast.stage.predictedEligibleStage !== forecast.target.endpointEligibleStage);
  assert.ok(stageMiss);
  if (stageMiss) assert.equal(mixed.residualLedger.some((row) => row.included && row.innerTargetId === stageMiss.fold.heldoutTargetId), false);
  const active = predictNextEligiblePrereleaseEvent(left.sourceDataset, "active", left);
  assert.ok(active && active.stage.available && active.timing.available);
  if (active?.stage.available && active.timing.available) {
    assert.equal(active.stage.predictedEligibleStage, "developer-beta");
    assert.ok(active.timing.trainingTargetIds.every((id) => left.targets.find((target) => target.targetId === id)!.platformId === "ios"));
  }
  for (const activeTail of ["gm", "public"] as const) {
    const terminalDataset = source({ count: 24, firstDeveloperEndpoints: 24, activeTail });
    const terminalArtifact = buildNextEligiblePrereleaseEventModel(terminalDataset);
    assert.equal(predictNextEligiblePrereleaseEvent(terminalDataset, "active", terminalArtifact), null);
  }
});

test("FR-012 simple next-event baseline freezes pooled stage mode, predicted-stage median, and exact members", () => {
  const dataset = source({ count: 24, firstDeveloperEndpoints: 24 });
  const model = buildNextEligiblePrereleaseEventModel(dataset);
  const baseline = buildNextEventSimpleBaseline(dataset, "active", model);
  const reversedDataset = source({ count: 24, firstDeveloperEndpoints: 24, reverse: true });
  const reversed = buildNextEventSimpleBaseline(
    reversedDataset,
    "active",
    buildNextEligiblePrereleaseEventModel(reversedDataset),
  );
  assert.deepEqual(baseline, reversed);
  assert.ok(baseline?.availability === "available");
  if (baseline?.availability === "available") {
    assert.equal(baseline.baselineVersion, NEXT_EVENT_SIMPLE_BASELINE_VERSION);
    assert.equal(baseline.codeFingerprint, NEXT_EVENT_SIMPLE_BASELINE_CODE_FINGERPRINT);
    assert.equal(baseline.predictedEligibleStage, "developer-beta");
    assert.equal(baseline.pointDays, 4);
    assert.equal(baseline.stageCohort.trainingCount, 24);
    assert.equal(baseline.timingCohort.trainingCount, 24);
    assert.deepEqual(
      baseline.stageCohort.trainingTargetIds,
      [...baseline.stageCohort.trainingTargetIds].sort(),
    );
    assert.deepEqual(
      baseline.timingCohort.trainingTargetIds,
      model.targets.map((target) => target.targetId).sort(),
    );
  }

  const weakDataset = source({ count: 8, tie: true });
  const weak = buildNextEventSimpleBaseline(
    weakDataset,
    "active",
    buildNextEligiblePrereleaseEventModel(weakDataset),
  );
  assert.ok(weak?.availability === "unavailable");
  if (weak?.availability === "unavailable") assert.equal(weak.reason, "weak-stage-mode");

  const sparseDataset = source({ count: 7, firstDeveloperEndpoints: 7 });
  const sparse = buildNextEventSimpleBaseline(
    sparseDataset,
    "active",
    buildNextEligiblePrereleaseEventModel(sparseDataset),
  );
  assert.ok(sparse?.availability === "unavailable");
  if (sparse?.availability === "unavailable") assert.equal(sparse.reason, "minimum-training-examples");
});

test("FR-011 requires a unique 60 percent modal next stage and fails closed on terminal and same-day ambiguity", () => {
  const tieDataset = source({ count: 8, tie: true });
  const tie = predictNextEligiblePrereleaseEvent(tieDataset, "active", buildNextEligiblePrereleaseEventModel(tieDataset));
  assert.ok(tie && !tie.stage.available);
  if (tie && !tie.stage.available) assert.equal(tie.stage.reason, "nonunique-or-weak-mode");

  const fiveOfEight = source({ count: 8, endpointPattern: ["developer", "developer", "developer", "developer", "developer", "public", "public", "public"] });
  const five = predictNextEligiblePrereleaseEvent(fiveOfEight, "active", buildNextEligiblePrereleaseEventModel(fiveOfEight));
  assert.ok(five?.stage.available);
  if (five?.stage.available) assert.equal(five.stage.modalShare, 5 / 8);
  const fourOfEight = source({ count: 8, endpointPattern: ["developer", "developer", "developer", "developer", "public", "public", "rc", "rc"] });
  const four = predictNextEligiblePrereleaseEvent(fourOfEight, "active", buildNextEligiblePrereleaseEventModel(fourOfEight));
  assert.ok(four && !four.stage.available);
  if (four && !four.stage.available) assert.equal(four.stage.reason, "nonunique-or-weak-mode");
  const crossPlatform = source({ count: 12, platform: "macos", activePlatform: "ios" });
  const noCrossPlatform = predictNextEligiblePrereleaseEvent(crossPlatform, "active", buildNextEligiblePrereleaseEventModel(crossPlatform));
  assert.ok(noCrossPlatform && !noCrossPlatform.stage.available);

  const edge = buildNextEligiblePrereleaseEventModel(edgeCasesSource());
  assert.deepEqual(edge.exclusionLedger.map((entry) => [entry.releaseId, entry.reason]), [
    // The dataset builder reduces an ambiguous day to unknown coverage before
    // FR-011 sees it; this remains a deliberate no-forecast path.
    ["active-ambiguous", "chronology-incomplete"],
    ["active-ambiguous", "chronology-incomplete"],
    ["ambiguous", "chronology-incomplete"],
    ["ambiguous", "chronology-incomplete"],
    ["ineligible-between", "terminal-or-ineligible-next-event"],
    ["ineligible-between", "no-subsequent-event"],
    ["public-terminal", "terminal-or-ineligible-next-event"],
    ["terminal", "terminal-or-ineligible-next-event"],
  ]);
  assert.equal(edge.targets.length, 0);
  assert.equal(edge.exclusionLedger.find((entry) => entry.anchorEventId === "event:between-dev-1")?.reason, "terminal-or-ineligible-next-event");
  assert.equal(predictNextEligiblePrereleaseEvent(edge.sourceDataset, "active-ambiguous", edge), null);
  const forged = { ...edge, exclusionLedger: [] };
  assert.ok(validateNextEligiblePrereleaseEventModel(forged).length > 0);
});
