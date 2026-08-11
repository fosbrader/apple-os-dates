import { buildHistoricalAnalysisDataset } from "../../src/lib/historical-analysis-dataset";
import { buildHistoricalAnalysisReport } from "../../src/lib/historical-analysis-report";
import type { PublishedHistoricalReleaseSource } from "../../src/lib/historical-release-source";
import { adaptReleaseObservations } from "../../src/lib/release-observation-adapter";
import {
  DEFAULT_WALK_FORWARD_EVALUATION_CONFIG,
  buildWalkForwardEvaluation,
} from "../../src/lib/walk-forward-evaluation";

export const historicalAnalysisFixtureIssuedAt = "2026-08-10T12:00:00.000Z";

const cycleCount = 20;

function day(offset: number): string {
  return new Date(Date.UTC(2024, 0, 1 + offset)).toISOString().slice(0, 10);
}

/** A complete, source-shaped cohort with enough outcomes for both baselines. */
export function historicalAnalysisSourceFixture(
  reverse = false,
): PublishedHistoricalReleaseSource {
  const releases = Array.from({ length: cycleCount }, (_, index) => ({
    id: `release.ios.fixture-${index + 1}`,
    lifecycle: "active" as const,
  }));
  const events = Array.from({ length: cycleCount }, (_, index) => {
    const releaseId = `release.ios.fixture-${index + 1}`;
    const anchorOn = day(index * 14);
    const endpointOn = day(index * 14 + 6);
    return [
      {
        id: `event.ios.fixture-${index + 1}.developer-beta-1`,
        stableEventId: `ios-fixture-${index + 1}-developer-beta-1`,
        releaseId,
        occurredOn: anchorOn,
        firstObservedAt: `${anchorOn}T12:00:00.000Z`,
        channel: "developerBeta" as const,
        sequence: 1,
        availability: "available" as const,
      },
      {
        id: `event.ios.fixture-${index + 1}.public-beta-1`,
        stableEventId: `ios-fixture-${index + 1}-public-beta-1`,
        releaseId,
        occurredOn: endpointOn,
        firstObservedAt: `${endpointOn}T12:00:00.000Z`,
        channel: "publicBeta" as const,
        sequence: 1,
        availability: "available" as const,
      },
    ];
  }).flat();
  const releaseMetadata = Array.from({ length: cycleCount }, (_, index) => ({
    releaseId: `release.ios.fixture-${index + 1}`,
    platformId: "ios",
    productFamilyId: "iphone-os",
    releaseClass: "major" as const,
    releasePosition: index + 1,
    releaseCycleId: `ios-fixture-cycle-${index + 1}`,
    chronologyCoverage: {
      state: "complete" as const,
      sourceEvidenceIds: [`evidence:fixture:${index + 1}:coverage`],
    },
    sourceEvidenceIds: [`evidence:fixture:${index + 1}:metadata`],
  }));

  return {
    releases: reverse ? [...releases].reverse() : releases,
    events: reverse ? [...events].reverse() : events,
    compatibilityMilestones: [],
    releaseMetadata: reverse ? [...releaseMetadata].reverse() : releaseMetadata,
  };
}

export function historicalAnalysisEvaluationFixture(reverse = false) {
  const source = historicalAnalysisSourceFixture(reverse);
  const dataset = buildHistoricalAnalysisDataset({
    adapterResult: adaptReleaseObservations({
      asOfDate: historicalAnalysisFixtureIssuedAt.slice(0, 10),
      issuedAt: historicalAnalysisFixtureIssuedAt,
      releases: source.releases,
      events: source.events,
      compatibilityMilestones: source.compatibilityMilestones,
    }),
    releaseMetadata: source.releaseMetadata,
  });

  return buildWalkForwardEvaluation(dataset, {
    ...DEFAULT_WALK_FORWARD_EVALUATION_CONFIG,
    includeEmpiricalIntervals: true,
  });
}

export function historicalAnalysisReportFixture(reverse = false) {
  return buildHistoricalAnalysisReport(
    historicalAnalysisEvaluationFixture(reverse),
  );
}
