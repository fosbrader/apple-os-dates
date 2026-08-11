import assert from "node:assert/strict";
import test from "node:test";

import { assessForecastSourceReadiness } from "../src/lib/forecast-source-readiness";
import {
  historicalAnalysisFixtureIssuedAt,
  historicalAnalysisSourceFixture,
} from "./fixtures/historical-analysis-report";

test("forecast source readiness reports a complete analytical cohort", () => {
  const source = historicalAnalysisSourceFixture();
  const report = assessForecastSourceReadiness(
    source,
    historicalAnalysisFixtureIssuedAt,
  );

  assert.equal(report.readinessVersion, "forecast-source-readiness/v1");
  assert.equal(report.historicalAnalysis.status, "ready");
  assert.equal(report.source.canonicalBytes > 0, true);
  assert.equal(
    report.source.capacities.find(({ name }) => name === "events")?.count,
    source.events.length,
  );
  assert.equal(
    report.source.capacities.find(({ name }) => name === "observations")?.count,
    source.events.length + source.compatibilityMilestones.length,
  );
});

test("forecast source readiness blocks incomplete or invalid metadata", () => {
  const missingMetadata = historicalAnalysisSourceFixture();
  const missingReport = assessForecastSourceReadiness(
    { ...missingMetadata, releaseMetadata: [] },
    historicalAnalysisFixtureIssuedAt,
  );
  assert.deepEqual(missingReport.historicalAnalysis, {
    status: "blocked",
    reason: "metadata-coverage-incomplete",
    missingMetadataCount: missingMetadata.releases.length,
    unexpectedMetadataCount: 0,
    duplicateMetadataCount: 0,
    inputIssueCount: missingMetadata.releases.length,
  });

  const invalidMetadata = historicalAnalysisSourceFixture();
  const firstMetadata = invalidMetadata.releaseMetadata[0]!;
  const invalidReport = assessForecastSourceReadiness(
    {
      ...invalidMetadata,
      releaseMetadata: [
        ...invalidMetadata.releaseMetadata,
        { ...firstMetadata },
      ],
    },
    historicalAnalysisFixtureIssuedAt,
  );
  assert.equal(invalidReport.historicalAnalysis.status, "blocked");
  assert.equal(
    invalidReport.historicalAnalysis.reason,
    "metadata-coverage-incomplete",
  );
  assert.equal(invalidReport.historicalAnalysis.duplicateMetadataCount, 1);
  assert.equal(invalidReport.historicalAnalysis.inputIssueCount > 0, true);
});
