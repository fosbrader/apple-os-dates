import { performance } from "node:perf_hooks";

import {
  buildForecastRuntimeCohortSelection,
  buildHistoricalAnalysisDatasetFromPublishedSource,
  forecastRuntimeCohortSelectionBytes,
  projectPublishedHistoricalReleaseSourceForRuntimeCohort,
  validateForecastRuntimeCohortSelection,
} from "../src/lib/forecast-runtime-cohort";
import { validateHistoricalAnalysisDataset } from "../src/lib/historical-analysis-dataset";
import type { PublishedHistoricalReleaseSource } from "../src/lib/historical-release-source";

const platforms = ["ios", "ipados", "macos", "tvos", "visionos", "watchos"];
const asOfDate = "2026-08-09";
const issuedAt = "2026-08-09T12:43:00.000Z";

function day(index: number): string {
  return new Date(Date.UTC(2020, 0, 1 + index)).toISOString().slice(0, 10);
}

function benchmarkSource(): PublishedHistoricalReleaseSource {
  const releases: PublishedHistoricalReleaseSource["releases"][number][] = [];
  const events: PublishedHistoricalReleaseSource["events"][number][] = [];
  const releaseMetadata: PublishedHistoricalReleaseSource["releaseMetadata"][number][] = [];
  let globalIndex = 0;
  for (const platformId of platforms) {
    for (let historyIndex = 0; historyIndex < 12; historyIndex += 1) {
      const releaseId = `${platformId}-history-${String(historyIndex).padStart(2, "0")}`;
      const baseDay = globalIndex * 20;
      const outcomeDay = day(baseDay + 11);
      releases.push({
        id: releaseId,
        lifecycle: "released",
        publicReleaseDate: outcomeDay,
        statusEffectiveOn: outcomeDay,
        statusFirstObservedAt: `${outcomeDay}T12:00:00.000Z`,
      });
      for (let eventIndex = 0; eventIndex < 10; eventIndex += 1) {
        const occurredOn = day(baseDay + eventIndex);
        events.push({
          id: `${releaseId}-developer-${eventIndex + 1}`,
          releaseId,
          occurredOn,
          firstObservedAt: `${occurredOn}T10:00:00.000Z`,
          channel: "developerBeta",
          sequence: eventIndex + 1,
          availability: "available",
        });
      }
      releaseMetadata.push({
        releaseId,
        platformId,
        productFamilyId: `${platformId}-family`,
        releaseClass: "major",
        releasePosition: historyIndex + 1,
        releaseCycleId: `${releaseId}-cycle`,
        chronologyCoverage: {
          state: "complete",
          sourceEvidenceIds: [`coverage:${releaseId}`],
        },
        sourceEvidenceIds: [`metadata:${releaseId}`],
      });
      globalIndex += 1;
    }
    for (let activeIndex = 0; activeIndex < 2; activeIndex += 1) {
      const releaseId = `${platformId}-active-${activeIndex}`;
      const occurredOn = day(1_900 + globalIndex);
      releases.push({ id: releaseId, lifecycle: "active" });
      events.push({
        id: `${releaseId}-developer-1`,
        releaseId,
        occurredOn,
        firstObservedAt: `${occurredOn}T10:00:00.000Z`,
        channel: "developerBeta",
        sequence: 1,
        availability: "available",
      });
      releaseMetadata.push({
        releaseId,
        platformId,
        productFamilyId: `${platformId}-family`,
        releaseClass: "major",
        releasePosition: 13 + activeIndex,
        releaseCycleId: `${releaseId}-cycle`,
        chronologyCoverage: {
          state: "complete",
          sourceEvidenceIds: [`coverage:${releaseId}`],
        },
        sourceEvidenceIds: [`metadata:${releaseId}`],
      });
      globalIndex += 1;
    }
  }
  return { releases, events, compatibilityMilestones: [], releaseMetadata };
}

function elapsed(startedAt: number): number {
  return Number((performance.now() - startedAt).toFixed(3));
}

const source = benchmarkSource();
let startedAt = performance.now();
const fullDataset = buildHistoricalAnalysisDatasetFromPublishedSource(source, {
  asOfDate,
  issuedAt,
});
const fullDatasetMs = elapsed(startedAt);

startedAt = performance.now();
const selection = buildForecastRuntimeCohortSelection(fullDataset, source);
const selectionMs = elapsed(startedAt);

startedAt = performance.now();
const projection = projectPublishedHistoricalReleaseSourceForRuntimeCohort(
  source,
  selection,
);
const projectionMs = elapsed(startedAt);

startedAt = performance.now();
const projectedDataset = buildHistoricalAnalysisDatasetFromPublishedSource(
  projection,
  { asOfDate, issuedAt },
);
const projectedDatasetMs = elapsed(startedAt);

const selectionIssues = validateForecastRuntimeCohortSelection(selection);
const projectedDatasetIssues = validateHistoricalAnalysisDataset(projectedDataset);
if (selectionIssues.length > 0 || projectedDatasetIssues.length > 0) {
  throw new Error("Capacity benchmark generated an invalid artifact or projection.");
}

process.stdout.write(
  `${JSON.stringify(
    {
      benchmark: "forecast-runtime-cohort/v1",
      note: "Elapsed times are observational only; this script has no wall-clock pass/fail threshold.",
      input: {
        releases: source.releases.length,
        rawEvents: source.events.length,
        activePlatforms: platforms.length,
        activeReleases: 12,
      },
      selection: {
        releases: selection.selectedReleaseIds.length,
        observations: selection.selectedObservationCount,
        artifactBytes: forecastRuntimeCohortSelectionBytes(selection),
        exclusions: selection.exclusions.length,
      },
      projection: {
        releases: projection.releases.length,
        rawEvents: projection.events.length,
        datasetEvents: projectedDataset.canonicalEvents.length,
      },
      elapsedMs: {
        fullDataset: fullDatasetMs,
        selection: selectionMs,
        projection: projectionMs,
        projectedDataset: projectedDatasetMs,
      },
    },
    null,
    2,
  )}\n`,
);
