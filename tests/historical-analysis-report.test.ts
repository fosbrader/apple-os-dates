import assert from "node:assert/strict";
import test from "node:test";

import {
  HISTORICAL_ANALYSIS_REPORT_MAX_BREAKDOWN_ROWS,
  HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
  HISTORICAL_ANALYSIS_REPORT_VERSION,
  validateHistoricalAnalysisReport,
} from "../src/lib/historical-analysis-report";
import { historicalAnalysisFingerprint } from "../src/lib/historical-analysis-dataset";
import {
  historicalAnalysisEvaluationFixture,
  historicalAnalysisReportFixture,
} from "./fixtures/historical-analysis-report";

test("FR-016 builds a deterministic, validated historical report", () => {
  const evaluation = historicalAnalysisEvaluationFixture();
  const report = historicalAnalysisReportFixture();

  assert.deepEqual(validateHistoricalAnalysisReport(report), []);
  assert.equal(report.report_version, HISTORICAL_ANALYSIS_REPORT_VERSION);
  assert.equal(report.status, "available");
  assert.equal(
    report.cohort.eligible_interval_count,
    evaluation.targets.length,
  );
  assert.equal(
    report.cohort.excluded_interval_count,
    evaluation.exclusionLedger.filter((row) => !row.included).length,
  );
  assert.equal(report.cohort.scored_prediction_count, evaluation.scores.length);
  assert.equal(report.overall_results.length, 2);
  assert.ok(report.overall_results.every((metric) => metric.reportable));
  assert.ok(
    report.overall_results.every(
      (metric) => metric.inclusive_coverage_50 !== null,
    ),
  );
  assert.equal(
    report.overall_results.reduce(
      (count, metric) => count + metric.score_count,
      0,
    ),
    report.cohort.scored_prediction_count,
  );
  assert.equal(report.provenance.source_as_of_date, "2026-08-10");
  assert.equal(report.uncertainty.empirical_intervals_included, true);
  assert.deepEqual(historicalAnalysisReportFixture(true), report);
});

test("FR-016 report validation rejects forged values, duplicate rows, and overflow", () => {
  const report = historicalAnalysisReportFixture();
  const forgedMetric = {
    ...report,
    overall_results: report.overall_results.map((metric, index) =>
      index === 0 ? { ...metric, mae_days: 999 } : metric,
    ),
  };
  const duplicateOverall = {
    ...report,
    overall_results: [report.overall_results[0]!, report.overall_results[0]!],
  };
  const overflow = {
    ...report,
    breakdowns: Array.from(
      { length: HISTORICAL_ANALYSIS_REPORT_MAX_BREAKDOWN_ROWS + 1 },
      () => report.breakdowns[0] ?? report.overall_results[0]!,
    ),
  };
  const underSampledCore = {
    ...report,
    cohort: { ...report.cohort, scored_prediction_count: 2 },
    overall_results: report.overall_results.map((metric) => ({
      ...metric,
      score_count: 1,
    })),
  };
  const {
    report_fingerprint: ignoredFingerprint,
    ...underSampledWithoutFingerprint
  } = underSampledCore;
  void ignoredFingerprint;
  const underSampled = {
    ...underSampledWithoutFingerprint,
    report_fingerprint: historicalAnalysisFingerprint({
      core: underSampledWithoutFingerprint,
      codeFingerprint: HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
    }),
  };

  assert.ok(validateHistoricalAnalysisReport(forgedMetric).length > 0);
  assert.ok(validateHistoricalAnalysisReport(duplicateOverall).length > 0);
  assert.ok(validateHistoricalAnalysisReport(underSampled).length > 0);
  assert.ok(
    validateHistoricalAnalysisReport(overflow).some(
      (issue) => issue.code === "row-limit",
    ),
  );
});
