import assert from "node:assert/strict";
import test from "node:test";

import { buildHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";
import { adaptReleaseObservations } from "../src/lib/release-observation-adapter";
import { buildReleaseDateCandidates } from "../src/lib/release-date-candidates";
import {
  RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS,
  buildReleaseDateIntervalCalibration,
  calibrateActiveReleaseDateForecast,
  releaseDateResolvedCohortPathId,
  validateReleaseDateIntervalCalibration,
} from "../src/lib/release-date-interval-calibration";

function day(index: number): string { return new Date(Date.UTC(2024, 0, 1 + index)).toISOString().slice(0, 10); }
function addDays(date: string, days: number): string { return new Date(Date.parse(`${date}T00:00:00.000Z`) + days * 86_400_000).toISOString().slice(0, 10); }
interface FixtureRow { id: string; anchorDay: number; publicDay?: number; observedDay?: number; family?: string; releaseClass?: "major" | "minor" | "patch"; position?: number; }
function source(rows: readonly FixtureRow[], reverse = false, asOfDate = "2036-12-31") {
  const releases = rows.map((row) => row.publicDay === undefined ? { id: row.id, lifecycle: "active" as const } : { id: row.id, lifecycle: "released" as const, publicReleaseDate: day(row.publicDay), statusEffectiveOn: day(row.publicDay), statusFirstObservedAt: `${day(row.observedDay ?? row.publicDay + 1)}T12:00:00.000Z` });
  const events = rows.map((row) => ({ id: `${row.id}-beta`, releaseId: row.id, occurredOn: day(row.anchorDay), firstObservedAt: `${day(row.anchorDay)}T12:00:00.000Z`, channel: "developerBeta" as const, sequence: 1, availability: "available" as const }));
  const metadata = rows.map((row, index) => ({ releaseId: row.id, platformId: "ios", productFamilyId: row.family ?? "iphone", releaseClass: row.releaseClass ?? "major" as const, releasePosition: row.position ?? (index % 3) + 1, releaseCycleId: `${row.id}-cycle`, chronologyCoverage: { state: "complete" as const, sourceEvidenceIds: [`coverage-${row.id}`] }, sourceEvidenceIds: [`metadata-${row.id}`] }));
  return buildHistoricalAnalysisDataset({ adapterResult: adaptReleaseObservations({ asOfDate, issuedAt: `${asOfDate}T12:00:00.000Z`, releases: reverse ? [...releases].reverse() : releases, events: reverse ? [...events].reverse() : events, compatibilityMilestones: [] }), releaseMetadata: reverse ? [...metadata].reverse() : metadata });
}
function dataset(count = 50, reverse = false) {
  const rows: FixtureRow[] = Array.from({ length: count }, (_, index) => ({ id: `ios-${String(index).padStart(2, "0")}`, anchorDay: index * 12, publicDay: index * 12 + 8 + (index % 3), observedDay: index * 12 + 11 }));
  rows.push({ id: "active", anchorDay: count * 12, publicDay: undefined as number | undefined, observedDay: undefined as number | undefined });
  return source(rows, reverse);
}
function conditionedDataset(includeNovelFallbacks = false) {
  const families = ["iphone", "ipad"] as const;
  const classes = ["major", "minor"] as const;
  const positions = [1, 2] as const;
  const rows: FixtureRow[] = Array.from({ length: 104 }, (_, index) => {
    const familyIndex = index % 2;
    const classIndex = Math.floor(index / 2) % 2;
    const positionIndex = Math.floor(index / 4) % 2;
    const intervalDays = 5 + familyIndex * 12 + classIndex * 4 + positionIndex * 2;
    const anchorDay = index * 32;
    return { id: `conditioned-${String(index).padStart(3, "0")}`, anchorDay, publicDay: anchorDay + intervalDays, observedDay: anchorDay + intervalDays + 1, family: families[familyIndex], releaseClass: classes[classIndex], position: positions[positionIndex] };
  });
  if (includeNovelFallbacks) {
    const anchorDay = rows.length * 32;
    rows.push({ id: "novel-a", anchorDay, publicDay: anchorDay + 11, observedDay: anchorDay + 12, family: "novel-a", releaseClass: "major", position: 1 });
    rows.push({ id: "novel-b", anchorDay: anchorDay + 32, publicDay: anchorDay + 43, observedDay: anchorDay + 44, family: "novel-b", releaseClass: "major", position: 1 });
  }
  return source(rows);
}

test("FR-010 calibrates only prior selected walk-forward residuals and is deterministic", () => {
  const candidates = buildReleaseDateCandidates(dataset());
  const left = buildReleaseDateIntervalCalibration(candidates);
  const right = buildReleaseDateIntervalCalibration(buildReleaseDateCandidates(dataset(50, true)));
  assert.deepEqual(validateReleaseDateIntervalCalibration(left), []);
  assert.deepEqual(left, right);
  const available = left.calibratedFolds.find((fold) => fold.residualPool.exactCount === 8 && fold.residualPool.selectedPool === "exact")!;
  assert.ok(available);
  assert.ok(available.residualPool.selectedResiduals.length >= RELEASE_DATE_INTERVAL_MINIMUM_RESIDUALS);
  assert.ok(available.residualPool.selectedResiduals.every((row) => row.innerOriginOn < available.originOn && row.outcomeFirstObservedOn <= available.originOn && row.innerTargetId !== available.targetId));
  const fifty = available.intervals[0]!;
  const eighty = available.intervals[1]!;
  assert.equal(fifty.available, true);
  assert.equal(eighty.available, true);
  if (fifty.available && eighty.available) {
    assert.ok(fifty.lowerDays >= eighty.lowerDays && fifty.upperDays <= eighty.upperDays);
    assert.ok(fifty.lowerDays <= fifty.pointDays && fifty.upperDays >= fifty.pointDays);
    assert.equal(fifty.residualCount, 8);
    assert.equal(fifty.rank, 5);
    assert.equal(eighty.rank, 8);
  }
});

test("hierarchical exact pools bind matched family, class, and numeric position values", () => {
  const calibration = buildReleaseDateIntervalCalibration(buildReleaseDateCandidates(conditionedDataset()));
  const fold = [...calibration.calibratedFolds].reverse().find((row) => row.candidateId === "hierarchical-platform-cadence" && row.residualPool.selectedPool === "exact" && row.residualPool.platformCount > row.residualPool.exactCount)!;
  assert.ok(fold);
  assert.ok(fold.residualPool.selectedResiduals.every((residual) => residual.productFamilyId === fold.productFamilyId && residual.releaseClass === fold.releaseClass && residual.releasePosition === fold.releasePosition));
  const otherPlatformPoolRows = calibration.residualLedger.filter((row): row is Extract<(typeof calibration.residualLedger)[number], { included: true }> => row.outerFoldId === fold.foldId && row.included && row.poolMembership === "platform");
  assert.ok(otherPlatformPoolRows.some((row) => row.productFamilyId !== fold.productFamilyId && row.releaseClass === fold.releaseClass && row.releasePosition === fold.releasePosition));
  assert.ok(otherPlatformPoolRows.some((row) => row.productFamilyId === fold.productFamilyId && row.releaseClass !== fold.releaseClass && row.releasePosition === fold.releasePosition));
  assert.ok(otherPlatformPoolRows.some((row) => row.productFamilyId === fold.productFamilyId && row.releaseClass === fold.releaseClass && row.releasePosition !== fold.releasePosition));
});

test("hierarchical fallback path records fallback without inventing the absent child value", () => {
  const candidates = buildReleaseDateCandidates(conditionedDataset(true));
  const identities = ["novel-a", "novel-b"].map((releaseId) => {
    const target = candidates.targets.find((row) => row.releaseId === releaseId)!;
    const forecast = candidates.forecasts.find((row) => row.fold.heldoutTargetId === target.targetId)!;
    const prediction = forecast.candidates.find((row) => row.candidateId === "hierarchical-platform-cadence" && row.available)!;
    assert.equal(prediction.available, true);
    if (!prediction.available) throw new Error("Expected hierarchical prediction.");
    assert.equal(prediction.explanation.tiers?.find((tier) => tier.tier === "product-family")?.fallback, true);
    return releaseDateResolvedCohortPathId(prediction, target);
  });
  assert.equal(identities[0], identities[1]);
  assert.match(identities[0]!, /"resolution":"fallback"/);
  assert.doesNotMatch(identities[0]!, /novel-a|novel-b/);
  const matchedTarget = [...candidates.targets].reverse().find((row) => row.productFamilyId === "iphone" && row.releaseClass === "major" && row.releasePosition === 1)!;
  const matchedForecast = candidates.forecasts.find((row) => row.fold.heldoutTargetId === matchedTarget.targetId)!;
  const matchedPrediction = matchedForecast.candidates.find((row) => row.candidateId === "hierarchical-platform-cadence" && row.available)!;
  if (!matchedPrediction.available) throw new Error("Expected matched hierarchical prediction.");
  assert.notEqual(identities[0], releaseDateResolvedCohortPathId(matchedPrediction, { ...matchedTarget, productFamilyId: "novel-a" }));
});

test("fractional numeric bounds are retained while calendar bounds round outward once", () => {
  const calibration = buildReleaseDateIntervalCalibration(buildReleaseDateCandidates(dataset()));
  const fold = calibration.calibratedFolds.find((row) => row.intervals.some((current) => current.available && current.residualCount === 8 && (!Number.isInteger(current.lowerDays) || !Number.isInteger(current.upperDays))))!;
  assert.ok(fold);
  const current = fold.intervals.find((row) => row.available && row.level === 0.5)!;
  const eighty = fold.intervals.find((row) => row.available && row.level === 0.8)!;
  assert.equal(current.available, true);
  assert.equal(eighty.available, true);
  if (!current.available || !eighty.available) throw new Error("Expected fractional intervals.");
  assert.equal(current.residualCount, 8);
  assert.equal(current.rank, 5);
  assert.equal(eighty.rank, 8);
  assert.equal(current.quantileResidualDays, fold.residualPool.selectedResiduals[4]!.residualDays);
  assert.equal(eighty.quantileResidualDays, fold.residualPool.selectedResiduals[7]!.residualDays);
  assert.equal(current.calendarDates.lower, addDays(fold.anchorOccurredOn, Math.floor(current.lowerDays)));
  assert.equal(current.calendarDates.point, addDays(fold.anchorOccurredOn, Math.floor(current.pointDays + 0.5)));
  assert.equal(current.calendarDates.upper, addDays(fold.anchorOccurredOn, Math.ceil(current.upperDays)));
  assert.equal(current.lowerDays, current.pointDays - current.quantileResidualDays);
  assert.equal(current.upperDays, current.pointDays + current.quantileResidualDays);
});

test("FR-010 fails closed for malformed and derived-field tampering and keeps active input identity strict", () => {
  const source = dataset();
  const candidates = buildReleaseDateCandidates(source);
  const calibration = buildReleaseDateIntervalCalibration(candidates);
  const first = calibration.calibratedFolds.find((fold) => fold.intervals.some((interval) => interval.available))!;
  const forged = { ...calibration, calibratedFolds: calibration.calibratedFolds.map((fold) => fold.foldId === first.foldId ? { ...fold, pointDays: fold.pointDays + 1 } : fold) };
  const tamperInterval = (patch: Record<string, unknown>) => ({ ...calibration, calibratedFolds: calibration.calibratedFolds.map((fold) => fold.foldId !== first.foldId ? fold : { ...fold, intervals: fold.intervals.map((current) => current.available && current.level === 0.5 ? { ...current, ...patch } : current) }) });
  const availableInterval = first.intervals.find((current) => current.available)!;
  if (!availableInterval.available) throw new Error("Expected an available interval.");
  const tamperedResidual = { ...calibration, calibratedFolds: calibration.calibratedFolds.map((fold) => fold.foldId !== first.foldId ? fold : { ...fold, residualPool: { ...fold.residualPool, selectedResiduals: fold.residualPool.selectedResiduals.map((row, index) => index ? row : { ...row, residualDays: row.residualDays + 1 }) } }) };
  const tamperedPool = { ...calibration, calibratedFolds: calibration.calibratedFolds.map((fold) => fold.foldId !== first.foldId ? fold : { ...fold, residualPool: { ...fold.residualPool, exactCount: fold.residualPool.exactCount + 1 } }) };
  const tamperedDate = tamperInterval({ calendarDates: { ...availableInterval.calendarDates, lower: addDays(availableInterval.calendarDates.lower, 1) } });
  const tamperedCoverage = { ...calibration, intervalScores: calibration.intervalScores.map((score, index) => index ? score : { ...score, covered: !score.covered }) };
  const tamperedMetric = { ...calibration, metrics: { ...calibration.metrics, overall: calibration.metrics.overall.map((metric, index) => index || !metric.reportable ? metric : { ...metric, coverage: metric.coverage === 1 ? 0 : 1 }) } };
  const tamperedUpstream = { ...calibration, candidates: { ...calibration.candidates, fingerprints: { ...calibration.candidates.fingerprints, resultFingerprint: "0".repeat(64) } } };
  for (const value of [forged, tamperedResidual, tamperedPool, tamperInterval({ rank: 1 }), tamperInterval({ quantileResidualDays: availableInterval.quantileResidualDays + 1 }), tamperInterval({ lowerDays: availableInterval.pointDays + 1 }), tamperedDate, tamperedCoverage, tamperedMetric, tamperedUpstream, { ...calibration, fingerprints: { ...calibration.fingerprints, resultFingerprint: "0".repeat(64) } }, null, 3, []]) assert.ok(validateReleaseDateIntervalCalibration(value).length > 0);
  const active = calibrateActiveReleaseDateForecast(source, "event:active-beta", candidates, calibration);
  assert.ok(active);
  const matchingHistorical = calibration.calibratedFolds.find((fold) => fold.candidateId === active?.candidateId && fold.cohortPathId === active.cohortPathId);
  assert.ok(matchingHistorical);
  assert.equal(calibrateActiveReleaseDateForecast(source, "event:active-beta", { ...candidates, fingerprints: { ...candidates.fingerprints, resultFingerprint: "0".repeat(64) } }, calibration), null);
});
