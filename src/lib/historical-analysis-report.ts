import {
  historicalAnalysisFingerprint,
  stableSerializeHistoricalAnalysis,
} from "./historical-analysis-dataset";
import {
  WALK_FORWARD_BASELINES,
  WALK_FORWARD_EVALUATION_VERSION,
  WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES,
  validateWalkForwardEvaluation,
  type WalkForwardAggregateMetricV1,
  type WalkForwardBaseline,
  type WalkForwardEvaluationV1,
  type WalkForwardExclusionReason,
} from "./walk-forward-evaluation";

export const HISTORICAL_ANALYSIS_REPORT_VERSION =
  "historical-analysis-report/v1";
export const HISTORICAL_ANALYSIS_REPORT_MAX_BREAKDOWN_ROWS = 1_024;
export const HISTORICAL_ANALYSIS_REPORT_MAX_CANONICAL_BYTES = 524_288;

export type HistoricalAnalysisReportMetricGroup =
  "overall" | "family" | "stage" | "horizon";

export interface HistoricalAnalysisReportMetricV1 {
  baseline: WalkForwardBaseline;
  group: HistoricalAnalysisReportMetricGroup;
  key: string;
  score_count: number;
  reportable: boolean;
  unavailable_reason: "minimum-score-count" | null;
  mae_days: number | null;
  median_absolute_error_days: number | null;
  signed_bias_days: number | null;
  inclusive_coverage_50: number | null;
  inclusive_coverage_80: number | null;
}

export interface HistoricalAnalysisReportExclusionV1 {
  reason: WalkForwardExclusionReason;
  interval_count: number;
}

export interface HistoricalAnalysisReportV1 {
  report_version: typeof HISTORICAL_ANALYSIS_REPORT_VERSION;
  status: "available";
  provenance: {
    source_as_of_date: string;
    source_issued_at: string;
    historical_dataset_version: string;
    historical_dataset_fingerprint: string;
    walk_forward_evaluation_version: typeof WALK_FORWARD_EVALUATION_VERSION;
    walk_forward_evaluation_fingerprint: string;
    report_code_fingerprint: string;
  };
  cohort: {
    release_cycle_count: number;
    included_release_cycle_count: number;
    superseded_release_cycle_count: number;
    complete_chronology_cycle_count: number;
    unknown_chronology_cycle_count: number;
    eligible_interval_count: number;
    excluded_interval_count: number;
    scored_prediction_count: number;
  };
  exclusions: readonly HistoricalAnalysisReportExclusionV1[];
  overall_results: readonly HistoricalAnalysisReportMetricV1[];
  breakdowns: readonly HistoricalAnalysisReportMetricV1[];
  uncertainty: {
    minimum_training_outcomes: number;
    minimum_reportable_scores: number;
    empirical_intervals_included: boolean;
  };
  methodology: {
    design: "walk-forward";
    target_unit: "source-backed-stage-interval";
    training_cutoff: "known-at-origin";
    baselines: readonly {
      id: WalkForwardBaseline;
      estimator: "median";
      cohort_order: readonly string[];
    }[];
  };
  report_fingerprint: string;
}

export type HistoricalAnalysisReportValidationCode =
  | "invalid-input"
  | "unsupported-report-version"
  | "invalid-row"
  | "row-limit"
  | "invalid-fingerprint";

export interface HistoricalAnalysisReportValidationIssue {
  code: HistoricalAnalysisReportValidationCode;
  path: string;
  message: string;
}

export class HistoricalAnalysisReportError extends Error {
  constructor(
    public readonly issues: readonly HistoricalAnalysisReportValidationIssue[],
  ) {
    super(
      `Historical analysis report is invalid: ${issues[0]?.code ?? "unknown"}.`,
    );
    this.name = "HistoricalAnalysisReportError";
  }
}

const SHA_256 = /^[a-f0-9]{64}$/;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const UNSAFE_TEXT = /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/;
const encoder = new TextEncoder();
const metricGroupOrder: Record<HistoricalAnalysisReportMetricGroup, number> = {
  overall: 0,
  family: 1,
  stage: 2,
  horizon: 3,
};

const REPORT_CODE_MANIFEST = {
  version: HISTORICAL_ANALYSIS_REPORT_VERSION,
  algorithm:
    "validated-walk-forward-aggregates;minimum-reportable-score-threshold;explicit-cohort-and-exclusions;no-shadow-artifacts;sha256-stable-json",
  evaluationVersion: WALK_FORWARD_EVALUATION_VERSION,
  minimumTrainingOutcomes: WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES,
  maximumBreakdownRows: HISTORICAL_ANALYSIS_REPORT_MAX_BREAKDOWN_ROWS,
  maximumCanonicalBytes: HISTORICAL_ANALYSIS_REPORT_MAX_CANONICAL_BYTES,
} as const;

export const HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT =
  historicalAnalysisFingerprint(REPORT_CODE_MANIFEST);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isText(value: unknown, maximumLength = 512): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maximumLength &&
    !UNSAFE_TEXT.test(value)
  );
}

function isDay(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DAY.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function isInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString() === value;
}

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isCoverage(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 1;
}

function exactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
  path: string,
  issues: HistoricalAnalysisReportValidationIssue[],
): void {
  const expected = new Set(keys);
  for (const key of Object.keys(value)) {
    if (!expected.has(key)) {
      issues.push({
        code: "invalid-row",
        path: `${path}.${key}`,
        message: "The report contains an unknown field.",
      });
    }
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) {
      issues.push({
        code: "invalid-row",
        path: `${path}.${key}`,
        message: "The report is missing a required field.",
      });
    }
  }
}

function reportMethodology(): HistoricalAnalysisReportV1["methodology"] {
  return {
    design: "walk-forward",
    target_unit: "source-backed-stage-interval",
    training_cutoff: "known-at-origin",
    baselines: [
      {
        id: "platform-stage-median",
        estimator: "median",
        cohort_order: ["same-platform-stage", "same-platform-pooled"],
      },
      {
        id: "seasonal-median",
        estimator: "median",
        cohort_order: [
          "same-platform-seasonal-stage",
          "same-platform-stage",
          "same-platform-pooled",
        ],
      },
    ],
  };
}

function metricKey(metric: HistoricalAnalysisReportMetricV1): string {
  return `${metric.baseline}\u0000${metricGroupOrder[metric.group]}\u0000${metric.key}`;
}

function metricDimension(metric: WalkForwardAggregateMetricV1): string {
  if (metric.group === "overall") return "overall";
  if (metric.group === "family") return metric.familyId ?? "";
  if (metric.group === "stage") return metric.stage ?? "";
  if (metric.group === "horizon") return metric.horizonId ?? "";
  return "";
}

function publicMetric(
  metric: WalkForwardAggregateMetricV1,
): HistoricalAnalysisReportMetricV1 {
  return {
    baseline: metric.baseline,
    group: metric.group as HistoricalAnalysisReportMetricGroup,
    key: metricDimension(metric),
    score_count: metric.scoreCount,
    reportable: metric.reportable,
    unavailable_reason: metric.reportable
      ? null
      : (metric.reason ?? "minimum-score-count"),
    mae_days: metric.maeDays,
    median_absolute_error_days: metric.medianAbsoluteErrorDays,
    signed_bias_days: metric.signedBiasDays,
    inclusive_coverage_50: metric.inclusiveCoverage50,
    inclusive_coverage_80: metric.inclusiveCoverage80,
  };
}

function countExclusions(
  evaluation: WalkForwardEvaluationV1,
): HistoricalAnalysisReportExclusionV1[] {
  const counts = new Map<WalkForwardExclusionReason, number>();
  for (const row of evaluation.exclusionLedger) {
    if (row.included || !row.reason) continue;
    counts.set(row.reason, (counts.get(row.reason) ?? 0) + 1);
  }
  return [...counts]
    .map(([reason, interval_count]) => ({ reason, interval_count }))
    .sort((left, right) => compareText(left.reason, right.reason));
}

function reportCore(
  evaluation: WalkForwardEvaluationV1,
): Omit<HistoricalAnalysisReportV1, "report_fingerprint"> {
  const cycles = evaluation.sourceDataset.releaseCycles;
  const includedCycles = cycles.filter((cycle) => cycle.included);
  const metrics = evaluation.aggregateMetrics
    .filter((metric) => metric.group !== "family-stage-horizon")
    .map(publicMetric)
    .sort((left, right) => compareText(metricKey(left), metricKey(right)));
  const overall_results = metrics.filter(
    (metric) => metric.group === "overall",
  );
  const breakdowns = metrics.filter((metric) => metric.group !== "overall");
  if (
    overall_results.length !== WALK_FORWARD_BASELINES.length ||
    breakdowns.length > HISTORICAL_ANALYSIS_REPORT_MAX_BREAKDOWN_ROWS
  ) {
    throw new HistoricalAnalysisReportError([
      {
        code: "row-limit",
        path: "breakdowns",
        message: "The public report exceeds its fixed metric-row limit.",
      },
    ]);
  }

  return {
    report_version: HISTORICAL_ANALYSIS_REPORT_VERSION,
    status: "available" as const,
    provenance: {
      source_as_of_date: evaluation.sourceDataset.provenance.sourceAsOfDate,
      source_issued_at: evaluation.sourceDataset.provenance.sourceIssuedAt,
      historical_dataset_version: evaluation.sourceDataset.datasetVersion,
      historical_dataset_fingerprint:
        evaluation.sourceDataset.fingerprints.datasetFingerprint,
      walk_forward_evaluation_version: evaluation.evaluationVersion,
      walk_forward_evaluation_fingerprint:
        evaluation.fingerprints.evaluationFingerprint,
      report_code_fingerprint: HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
    },
    cohort: {
      release_cycle_count: cycles.length,
      included_release_cycle_count: includedCycles.length,
      superseded_release_cycle_count: cycles.length - includedCycles.length,
      complete_chronology_cycle_count: includedCycles.filter(
        (cycle) => cycle.chronologyCoverage.state === "complete",
      ).length,
      unknown_chronology_cycle_count: includedCycles.filter(
        (cycle) => cycle.chronologyCoverage.state === "unknown",
      ).length,
      eligible_interval_count: evaluation.targets.length,
      excluded_interval_count: evaluation.exclusionLedger.filter(
        (row) => !row.included,
      ).length,
      scored_prediction_count: evaluation.scores.length,
    },
    exclusions: countExclusions(evaluation),
    overall_results,
    breakdowns,
    uncertainty: {
      minimum_training_outcomes: WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES,
      minimum_reportable_scores: WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES,
      empirical_intervals_included:
        evaluation.config.includeEmpiricalIntervals === true,
    },
    methodology: reportMethodology(),
  };
}

function validateMetric(
  value: unknown,
  path: string,
  expectedGroup: "overall" | "breakdown",
  issues: HistoricalAnalysisReportValidationIssue[],
): value is HistoricalAnalysisReportMetricV1 {
  if (!isRecord(value)) {
    issues.push({
      code: "invalid-row",
      path,
      message: "A metric row is required.",
    });
    return false;
  }
  exactKeys(
    value,
    [
      "baseline",
      "group",
      "key",
      "score_count",
      "reportable",
      "unavailable_reason",
      "mae_days",
      "median_absolute_error_days",
      "signed_bias_days",
      "inclusive_coverage_50",
      "inclusive_coverage_80",
    ],
    path,
    issues,
  );
  const baselineValid = WALK_FORWARD_BASELINES.includes(
    value.baseline as WalkForwardBaseline,
  );
  const groupValid = ["overall", "family", "stage", "horizon"].includes(
    value.group as string,
  );
  const expectedGroupValid =
    expectedGroup === "overall"
      ? value.group === "overall" && value.key === "overall"
      : value.group !== "overall";
  const nullableNumbers = [
    value.mae_days,
    value.median_absolute_error_days,
    value.signed_bias_days,
  ];
  const coverages = [value.inclusive_coverage_50, value.inclusive_coverage_80];
  const reportableValid =
    value.reportable === true
      ? isCount(value.score_count) &&
        value.score_count >= WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES &&
        value.unavailable_reason === null &&
        nullableNumbers.every(isFiniteNumber) &&
        coverages.every((entry) => entry === null || isCoverage(entry))
      : value.reportable === false &&
        isCount(value.score_count) &&
        value.score_count < WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES &&
        value.unavailable_reason === "minimum-score-count" &&
        nullableNumbers.every((entry) => entry === null) &&
        coverages.every((entry) => entry === null);
  if (
    !baselineValid ||
    !groupValid ||
    !expectedGroupValid ||
    !isText(value.key) ||
    !isCount(value.score_count) ||
    !reportableValid
  ) {
    issues.push({
      code: "invalid-row",
      path,
      message: "The metric row is malformed or has inconsistent availability.",
    });
    return false;
  }
  return true;
}

/** Validate a serialized public report without trusting caller-authored fields. */
export function validateHistoricalAnalysisReport(
  value: unknown,
): HistoricalAnalysisReportValidationIssue[] {
  try {
    if (!isRecord(value)) {
      return [
        {
          code: "invalid-input",
          path: "report",
          message: "The report must be an object.",
        },
      ];
    }
    const issues: HistoricalAnalysisReportValidationIssue[] = [];
    exactKeys(
      value,
      [
        "report_version",
        "status",
        "provenance",
        "cohort",
        "exclusions",
        "overall_results",
        "breakdowns",
        "uncertainty",
        "methodology",
        "report_fingerprint",
      ],
      "report",
      issues,
    );
    if (value.report_version !== HISTORICAL_ANALYSIS_REPORT_VERSION) {
      issues.push({
        code: "unsupported-report-version",
        path: "report_version",
        message: `Expected ${HISTORICAL_ANALYSIS_REPORT_VERSION}.`,
      });
    }
    if (value.status !== "available") {
      issues.push({
        code: "invalid-row",
        path: "status",
        message: "A serialized report must contain validated available data.",
      });
    }

    if (!isRecord(value.provenance)) {
      issues.push({
        code: "invalid-row",
        path: "provenance",
        message: "Report provenance is required.",
      });
    } else {
      exactKeys(
        value.provenance,
        [
          "source_as_of_date",
          "source_issued_at",
          "historical_dataset_version",
          "historical_dataset_fingerprint",
          "walk_forward_evaluation_version",
          "walk_forward_evaluation_fingerprint",
          "report_code_fingerprint",
        ],
        "provenance",
        issues,
      );
      if (
        !isDay(value.provenance.source_as_of_date) ||
        !isInstant(value.provenance.source_issued_at) ||
        (isDay(value.provenance.source_as_of_date) &&
          isInstant(value.provenance.source_issued_at) &&
          value.provenance.source_issued_at.slice(0, 10) !==
            value.provenance.source_as_of_date) ||
        !isText(value.provenance.historical_dataset_version) ||
        typeof value.provenance.historical_dataset_fingerprint !== "string" ||
        !SHA_256.test(value.provenance.historical_dataset_fingerprint) ||
        value.provenance.walk_forward_evaluation_version !==
          WALK_FORWARD_EVALUATION_VERSION ||
        typeof value.provenance.walk_forward_evaluation_fingerprint !==
          "string" ||
        !SHA_256.test(value.provenance.walk_forward_evaluation_fingerprint) ||
        value.provenance.report_code_fingerprint !==
          HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT
      ) {
        issues.push({
          code: "invalid-row",
          path: "provenance",
          message: "Report provenance is malformed or incompatible.",
        });
      }
    }

    const cohortKeys = [
      "release_cycle_count",
      "included_release_cycle_count",
      "superseded_release_cycle_count",
      "complete_chronology_cycle_count",
      "unknown_chronology_cycle_count",
      "eligible_interval_count",
      "excluded_interval_count",
      "scored_prediction_count",
    ] as const;
    if (!isRecord(value.cohort)) {
      issues.push({
        code: "invalid-row",
        path: "cohort",
        message: "Report cohort counts are required.",
      });
    } else {
      const cohort = value.cohort;
      exactKeys(cohort, cohortKeys, "cohort", issues);
      if (
        cohortKeys.some((key) => !isCount(cohort[key])) ||
        (isCount(cohort.release_cycle_count) &&
          isCount(cohort.included_release_cycle_count) &&
          isCount(cohort.superseded_release_cycle_count) &&
          cohort.release_cycle_count !==
            cohort.included_release_cycle_count +
              cohort.superseded_release_cycle_count) ||
        (isCount(cohort.included_release_cycle_count) &&
          isCount(cohort.complete_chronology_cycle_count) &&
          isCount(cohort.unknown_chronology_cycle_count) &&
          cohort.included_release_cycle_count !==
            cohort.complete_chronology_cycle_count +
              cohort.unknown_chronology_cycle_count)
      ) {
        issues.push({
          code: "invalid-row",
          path: "cohort",
          message: "Report cohort counts are invalid or inconsistent.",
        });
      }
    }

    if (!Array.isArray(value.exclusions)) {
      issues.push({
        code: "invalid-row",
        path: "exclusions",
        message: "The exclusion summary must be an array.",
      });
    } else {
      const allowedReasons = new Set<WalkForwardExclusionReason>([
        "invalid-or-unavailable-interval",
        "missing-anchor",
        "missing-endpoint",
        "endpoint-not-after-origin",
        "unknown-horizon",
      ]);
      const reasons = new Set<string>();
      let exclusionCount = 0;
      for (const [index, exclusion] of value.exclusions.entries()) {
        const path = `exclusions[${index}]`;
        if (!isRecord(exclusion)) {
          issues.push({
            code: "invalid-row",
            path,
            message: "An exclusion row is required.",
          });
          continue;
        }
        exactKeys(exclusion, ["reason", "interval_count"], path, issues);
        if (
          !allowedReasons.has(exclusion.reason as WalkForwardExclusionReason) ||
          reasons.has(exclusion.reason as string) ||
          !isCount(exclusion.interval_count) ||
          exclusion.interval_count === 0
        ) {
          issues.push({
            code: "invalid-row",
            path,
            message: "The exclusion row is malformed or duplicated.",
          });
          continue;
        }
        reasons.add(exclusion.reason as string);
        exclusionCount += exclusion.interval_count;
      }
      const sortedReasons = [...reasons].sort(compareText);
      if (
        stableSerializeHistoricalAnalysis([...reasons]) !==
          stableSerializeHistoricalAnalysis(sortedReasons) ||
        (isRecord(value.cohort) &&
          isCount(value.cohort.excluded_interval_count) &&
          exclusionCount !== value.cohort.excluded_interval_count)
      ) {
        issues.push({
          code: "invalid-row",
          path: "exclusions",
          message: "Exclusions must be sorted and match the cohort total.",
        });
      }
    }

    const metricArrays = [
      ["overall_results", value.overall_results, "overall"],
      ["breakdowns", value.breakdowns, "breakdown"],
    ] as const;
    const validOverallMetrics: HistoricalAnalysisReportMetricV1[] = [];
    const validBreakdownMetrics: HistoricalAnalysisReportMetricV1[] = [];
    for (const [name, rows, expected] of metricArrays) {
      if (!Array.isArray(rows)) {
        issues.push({
          code: "invalid-row",
          path: name,
          message: "Metric rows must be an array.",
        });
        continue;
      }
      if (
        name === "breakdowns" &&
        rows.length > HISTORICAL_ANALYSIS_REPORT_MAX_BREAKDOWN_ROWS
      ) {
        issues.push({
          code: "row-limit",
          path: name,
          message: "The report exceeds its metric-row limit.",
        });
      }
      for (const [index, row] of rows.entries()) {
        if (validateMetric(row, `${name}[${index}]`, expected, issues)) {
          (expected === "overall"
            ? validOverallMetrics
            : validBreakdownMetrics
          ).push(row);
        }
      }
    }
    const overallMetricKeys = validOverallMetrics.map(metricKey);
    const breakdownMetricKeys = validBreakdownMetrics.map(metricKey);
    const expectedOverallMetricKeys = WALK_FORWARD_BASELINES.map(
      (baseline) => `${baseline}\u0000${metricGroupOrder.overall}\u0000overall`,
    );
    if (
      !Array.isArray(value.overall_results) ||
      value.overall_results.length !== WALK_FORWARD_BASELINES.length ||
      stableSerializeHistoricalAnalysis(overallMetricKeys) !==
        stableSerializeHistoricalAnalysis(expectedOverallMetricKeys)
    ) {
      issues.push({
        code: "invalid-row",
        path: "overall_results",
        message: "Overall metric rows must be complete and ordered.",
      });
    }
    if (
      !Array.isArray(value.breakdowns) ||
      validBreakdownMetrics.length !== value.breakdowns.length ||
      new Set([...overallMetricKeys, ...breakdownMetricKeys]).size !==
        overallMetricKeys.length + breakdownMetricKeys.length ||
      stableSerializeHistoricalAnalysis(breakdownMetricKeys) !==
        stableSerializeHistoricalAnalysis(
          [...breakdownMetricKeys].sort(compareText),
        )
    ) {
      issues.push({
        code: "invalid-row",
        path: "breakdowns",
        message: "Breakdown metric rows must be unique and ordered.",
      });
    }
    if (
      isRecord(value.cohort) &&
      isCount(value.cohort.scored_prediction_count) &&
      Array.isArray(value.overall_results) &&
      value.overall_results
        .filter(isRecord)
        .reduce(
          (sum, metric) =>
            sum + (isCount(metric.score_count) ? metric.score_count : 0),
          0,
        ) !== value.cohort.scored_prediction_count
    ) {
      issues.push({
        code: "invalid-row",
        path: "cohort.scored_prediction_count",
        message: "The scored prediction count must match overall results.",
      });
    }

    if (!isRecord(value.uncertainty)) {
      issues.push({
        code: "invalid-row",
        path: "uncertainty",
        message: "Uncertainty rules are required.",
      });
    } else {
      exactKeys(
        value.uncertainty,
        [
          "minimum_training_outcomes",
          "minimum_reportable_scores",
          "empirical_intervals_included",
        ],
        "uncertainty",
        issues,
      );
      if (
        value.uncertainty.minimum_training_outcomes !==
          WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES ||
        value.uncertainty.minimum_reportable_scores !==
          WALK_FORWARD_MINIMUM_TRAINING_OUTCOMES ||
        typeof value.uncertainty.empirical_intervals_included !== "boolean"
      ) {
        issues.push({
          code: "invalid-row",
          path: "uncertainty",
          message: "Uncertainty thresholds must match the evaluator contract.",
        });
      }
    }

    if (
      stableSerializeHistoricalAnalysis(value.methodology) !==
      stableSerializeHistoricalAnalysis(reportMethodology())
    ) {
      issues.push({
        code: "invalid-row",
        path: "methodology",
        message: "The public methodology must match the fixed report contract.",
      });
    }

    const reportWithoutFingerprint = Object.fromEntries(
      Object.entries(value).filter(([key]) => key !== "report_fingerprint"),
    );
    if (
      typeof value.report_fingerprint !== "string" ||
      !SHA_256.test(value.report_fingerprint) ||
      value.report_fingerprint !==
        historicalAnalysisFingerprint({
          core: reportWithoutFingerprint,
          codeFingerprint: HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
        })
    ) {
      issues.push({
        code: "invalid-fingerprint",
        path: "report_fingerprint",
        message: "The report fingerprint does not bind the complete report.",
      });
    }
    if (
      encoder.encode(stableSerializeHistoricalAnalysis(value)).byteLength >
      HISTORICAL_ANALYSIS_REPORT_MAX_CANONICAL_BYTES
    ) {
      issues.push({
        code: "row-limit",
        path: "report",
        message: "The report exceeds its canonical byte limit.",
      });
    }
    return issues;
  } catch {
    return [
      {
        code: "invalid-input",
        path: "report",
        message: "The report could not be validated safely.",
      },
    ];
  }
}

/** Build one deterministic public report from a fully validated evaluation. */
export function buildHistoricalAnalysisReport(
  evaluation: WalkForwardEvaluationV1,
): HistoricalAnalysisReportV1 {
  if (validateWalkForwardEvaluation(evaluation).length > 0) {
    throw new HistoricalAnalysisReportError([
      {
        code: "invalid-input",
        path: "evaluation",
        message: "A validated walk-forward evaluation is required.",
      },
    ]);
  }
  const core = reportCore(evaluation);
  const report: HistoricalAnalysisReportV1 = {
    ...core,
    report_fingerprint: historicalAnalysisFingerprint({
      core,
      codeFingerprint: HISTORICAL_ANALYSIS_REPORT_CODE_FINGERPRINT,
    }),
  };
  const issues = validateHistoricalAnalysisReport(report);
  if (issues.length > 0) throw new HistoricalAnalysisReportError(issues);
  return report;
}
