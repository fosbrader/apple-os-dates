import assert from "node:assert/strict";
import test from "node:test";

import { buildHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";
import {
  RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH,
  buildReleaseDateCandidates,
  predictReleaseDateForAnchor,
  roundReleaseDatePointDays,
  validateReleaseDateCandidates,
} from "../src/lib/release-date-candidates";

function day(index: number): string {
  return new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10);
}

interface Cycle {
  id: string;
  anchorDay: number;
  publicDay?: number;
  observedDay?: number;
  platform?: string;
  family?: string;
  releaseClass?: "major" | "minor" | "patch";
  position?: number;
  channel?: "developerBeta" | "publicBeta" | "goldenMaster";
  coverage?: "complete" | "unknown";
  superseded?: boolean;
}

function source(cycles: readonly Cycle[], reverse = false) {
  const asOf = "2025-12-31";
  const releases = cycles.map((cycle) => cycle.superseded
    ? { id: cycle.id, lifecycle: "superseded" as const, statusEffectiveOn: day(cycle.anchorDay), statusFirstObservedAt: `${day(cycle.anchorDay)}T12:00:00.000Z` }
    : cycle.publicDay === undefined
      ? { id: cycle.id, lifecycle: "active" as const }
      : { id: cycle.id, lifecycle: "released" as const, publicReleaseDate: day(cycle.publicDay), statusEffectiveOn: day(cycle.publicDay), statusFirstObservedAt: `${day(cycle.observedDay ?? cycle.publicDay)}T12:00:00.000Z` });
  const events = cycles.map((cycle) => ({
    id: `${cycle.id}-anchor`, releaseId: cycle.id, occurredOn: day(cycle.anchorDay), firstObservedAt: `${day(cycle.anchorDay)}T12:00:00.000Z`,
    channel: cycle.channel ?? "developerBeta", ...(cycle.channel === "goldenMaster" ? {} : { sequence: 1 }), availability: "available" as const,
  }));
  const metadata = cycles.map((cycle, index) => ({
    releaseId: cycle.id, platformId: cycle.platform ?? "ios", productFamilyId: cycle.family ?? "iphone",
    releaseClass: cycle.releaseClass ?? "major", releasePosition: cycle.position ?? index + 1, releaseCycleId: `${cycle.id}-cycle`,
    chronologyCoverage: cycle.coverage === "unknown"
      ? { state: "unknown" as const, reason: "source-coverage-incomplete" as const, sourceEvidenceIds: [`coverage-${cycle.id}`] }
      : { state: "complete" as const, sourceEvidenceIds: [`coverage-${cycle.id}`] },
    sourceEvidenceIds: [`metadata-${cycle.id}`],
  }));
  return buildHistoricalAnalysisDataset({ adapterResult: adaptReleaseObservations({
    asOfDate: asOf, issuedAt: `${asOf}T12:00:00.000Z`, releases: reverse ? [...releases].reverse() : releases,
    events: reverse ? [...events].reverse() : events, compatibilityMilestones: [],
  }), releaseMetadata: reverse ? [...metadata].reverse() : metadata });
}

function history(count = 12): Cycle[] {
  return Array.from({ length: count }, (_, index) => ({ id: `history-${String(index + 1).padStart(2, "0")}`, anchorDay: index * 12, publicDay: index * 12 + 10, observedDay: index * 12 + 11, position: (index % 3) + 1 }));
}

test("FR-009 uses only source-linked public outcomes and has no cross-platform rescue", () => {
  const dataset = source([
    ...history(8),
    { id: "active", anchorDay: 120, position: 1 },
    ...Array.from({ length: 20 }, (_, index) => ({ id: `mac-${index}`, anchorDay: index * 4, publicDay: index * 4 + 3, observedDay: index * 4 + 4, platform: "macos", family: "mac", position: 1 })),
    { id: "gm-only", anchorDay: 140, publicDay: 150, channel: "goldenMaster" },
  ]);
  const artifact = buildReleaseDateCandidates(dataset);
  assert.deepEqual(validateReleaseDateCandidates(artifact), []);
  const active = predictReleaseDateForAnchor(dataset, "event:active-anchor", artifact)!;
  assert.equal(active.candidates.find((row) => row.candidateId === "platform-stage-median")?.available, true);
  assert.ok(active.candidates.every((row) => row.trainingTargetIds.every((id) => artifact.targets.find((target) => target.targetId === id)!.platformId === "ios")));
  assert.ok(artifact.targets.every((target) => target.publicOutcomeEvidenceId.includes("release:")));
  assert.equal(roundReleaseDatePointDays(10.5), 11);
  assert.equal(RELEASE_DATE_HIERARCHICAL_PRIOR_STRENGTH, 4);
});

test("known-at-origin folds exclude self, future and late-observed public outcomes", () => {
  const dataset = source([
    ...history(10),
    { id: "late", anchorDay: 130, publicDay: 140, observedDay: 200 },
    { id: "heldout", anchorDay: 150, publicDay: 160, observedDay: 161 },
  ]);
  const artifact = buildReleaseDateCandidates(dataset);
  const heldout = artifact.targets.find((row) => row.releaseId === "heldout")!;
  const fold = artifact.folds.find((row) => row.heldoutTargetId === heldout.targetId)!;
  assert.equal(fold.trainingTargetIds.includes(heldout.targetId), false);
  assert.equal(fold.trainingTargetIds.some((id) => id.includes("late")), false);
  assert.ok(fold.trainingTargetIds.every((id) => {
    const row = artifact.targets.find((target) => target.targetId === id)!;
    return row.originOn <= fold.originOn && row.publicOccurredOn <= fold.originOn && row.publicFirstObservedOn <= fold.originOn;
  }));
});

test("held-out public outcome mutation cannot change its training or model point", () => {
  const common = [...history(10), { id: "heldout", anchorDay: 150, publicDay: 160, observedDay: 161 }];
  const first = buildReleaseDateCandidates(source(common));
  const second = buildReleaseDateCandidates(source(common.map((row) => row.id === "heldout" ? { ...row, publicDay: 170, observedDay: 171 } : row)));
  const firstTarget = first.targets.find((row) => row.releaseId === "heldout")!;
  const secondTarget = second.targets.find((row) => row.releaseId === "heldout")!;
  assert.deepEqual(first.folds.find((row) => row.heldoutTargetId === firstTarget.targetId), second.folds.find((row) => row.heldoutTargetId === secondTarget.targetId));
  for (const candidateId of ["platform-stage-median", "hierarchical-platform-cadence"] as const) {
    const a = first.predictions.find((row) => row.heldoutTargetId === firstTarget.targetId && row.candidateId === candidateId)!;
    const b = second.predictions.find((row) => row.heldoutTargetId === secondTarget.targetId && row.candidateId === candidateId)!;
    assert.equal(a.available, b.available);
    assert.equal(a.trainingTargetIds.join(","), b.trainingTargetIds.join(","));
    if (a.available && b.available) assert.equal(a.pointDays, b.pointDays);
  }
});

test("hierarchy applies strength four in family, class, numeric-position order and is deterministic", () => {
  const rows = [
    ...Array.from({ length: 8 }, (_, index) => ({ id: `root-${index}`, anchorDay: index * 10, publicDay: index * 10 + (index < 4 ? 8 : 12), observedDay: index * 10 + 13, family: index < 2 ? "target" : "other", releaseClass: index < 2 ? "minor" as const : "major" as const, position: index < 2 ? 2 : 1 })),
    { id: "active", anchorDay: 100, family: "target", releaseClass: "minor" as const, position: 2 },
  ];
  const left = buildReleaseDateCandidates(source(rows));
  const right = buildReleaseDateCandidates(source(rows, true));
  assert.deepEqual(left, right);
  const forecast = predictReleaseDateForAnchor(left.sourceDataset, "event:active-anchor", left)!;
  const hierarchy = forecast.candidates.find((row) => row.candidateId === "hierarchical-platform-cadence" && row.available)!;
  if (hierarchy.available) {
    const tiers = hierarchy.explanation.tiers!;
    assert.deepEqual(tiers.map((tier) => tier.tier), ["platform-stage", "product-family", "release-class", "release-position"]);
    const family = tiers[1]!;
    assert.equal(family.posteriorDays, (family.count * family.rawMedianDays! + 4 * tiers[0]!.posteriorDays) / (family.count + 4));
  }
});

test("exclusions, sparse nested comparison, malformed input, and tampering fail closed", () => {
  const dataset = source([
    ...history(8),
    { id: "same", anchorDay: 120, publicDay: 120, observedDay: 121 },
    { id: "unknown", anchorDay: 130, publicDay: 140, coverage: "unknown" },
    { id: "superseded", anchorDay: 150, publicDay: 160, superseded: true },
    { id: "active", anchorDay: 170 },
  ]);
  const artifact = buildReleaseDateCandidates(dataset);
  assert.deepEqual(
    artifact.exclusionLedger.filter((row) => ["same", "unknown"].includes(row.releaseId)).map((row) => [row.releaseId, row.reason]),
    [["same", "chronology-incomplete"], ["unknown", "chronology-incomplete"]],
  );
  assert.equal(artifact.targets.some((row) => row.releaseId === "superseded"), false);
  const forecast = predictReleaseDateForAnchor(dataset, "event:active-anchor", artifact)!;
  assert.equal(forecast.selection.status, "baseline-default-insufficient-comparison");
  const forged = { ...artifact, predictions: artifact.predictions.map((row, index) => index ? row : { ...row, trainingTargetIds: ["forged"] }) };
  for (const value of [forged, { ...artifact, fingerprints: { ...artifact.fingerprints, resultFingerprint: "0".repeat(64) } }, null, "bad"]) assert.ok(validateReleaseDateCandidates(value).length > 0);
});
