import assert from "node:assert/strict";
import test from "node:test";

import { buildPublicHistoricalAnalysisReport } from "../src/lib/public-historical-analysis";
import {
  historicalAnalysisFixtureIssuedAt,
  historicalAnalysisReportFixture,
  historicalAnalysisSourceFixture,
} from "./fixtures/historical-analysis-report";

test("FR-016 derives the public report from a complete published source", () => {
  const report = buildPublicHistoricalAnalysisReport(
    historicalAnalysisSourceFixture(),
    historicalAnalysisFixtureIssuedAt,
  );

  assert.deepEqual(report, historicalAnalysisReportFixture());
  assert.doesNotMatch(
    JSON.stringify(report),
    /forecast|candidate|artifact|pointer|blob/i,
  );
  assert.deepEqual(
    buildPublicHistoricalAnalysisReport(
      historicalAnalysisSourceFixture(true),
      historicalAnalysisFixtureIssuedAt,
    ),
    report,
  );
});

test("FR-016 refuses an incomplete historical metadata cohort", () => {
  const source = historicalAnalysisSourceFixture();

  assert.throws(() =>
    buildPublicHistoricalAnalysisReport(
      { ...source, releaseMetadata: [] },
      historicalAnalysisFixtureIssuedAt,
    ),
  );
});
