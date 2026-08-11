import Link from "next/link";

import type {
  HistoricalAnalysisReportMetricV1,
  HistoricalAnalysisReportV1,
} from "@/lib/historical-analysis-report";
import { publicApiHistoricalAnalysisPath } from "@/lib/public-api/types";

const baselineLabels: Record<
  HistoricalAnalysisReportMetricV1["baseline"],
  string
> = {
  "platform-stage-median": "Platform and stage median",
  "seasonal-median": "Seasonal median",
};

const exclusionLabels: Record<
  HistoricalAnalysisReportV1["exclusions"][number]["reason"],
  string
> = {
  "invalid-or-unavailable-interval": "No usable interval date",
  "missing-anchor": "Missing start event",
  "missing-endpoint": "Missing end event",
  "endpoint-not-after-origin": "End event was not later than the start",
  "unknown-horizon": "Interval did not fit a reporting range",
};

function countLabel(value: number, singular: string, plural = `${singular}s`) {
  return `${value.toLocaleString("en-US")} ${value === 1 ? singular : plural}`;
}

function NumberValue({
  value,
  suffix = "",
  signed = false,
}: {
  value: number | null;
  suffix?: string;
  signed?: boolean;
}) {
  if (value === null) {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">Not available</span>
      </>
    );
  }

  const prefix = signed && value > 0 ? "+" : "";
  return <>{`${prefix}${value.toFixed(1)}${suffix}`}</>;
}

function PercentValue({ value }: { value: number | null }) {
  return <NumberValue value={value === null ? null : value * 100} suffix="%" />;
}

function Availability({
  metric,
}: {
  metric: HistoricalAnalysisReportMetricV1;
}) {
  if (metric.reportable) {
    return (
      <span className="font-medium text-[var(--milestone-public)]">
        Available
      </span>
    );
  }

  return (
    <span className="text-[var(--text-secondary)]">
      Not enough scores ({metric.score_count.toLocaleString("en-US")})
    </span>
  );
}

function OverallResultsTable({
  metrics,
}: {
  metrics: HistoricalAnalysisReportV1["overall_results"];
}) {
  return (
    <div
      className="surface horizontal-scroll horizontal-scroll--table overflow-hidden overflow-x-auto"
      role="region"
      aria-label="Historical-analysis overall results table"
      tabIndex={0}
    >
      <table className="data-table min-w-[52rem]">
        <caption className="sr-only">
          Overall historical timing results for the two median baselines.
        </caption>
        <thead>
          <tr>
            <th scope="col">Baseline</th>
            <th scope="col" className="text-right">
              Scores
            </th>
            <th scope="col" className="text-right">
              Mean absolute error
            </th>
            <th scope="col" className="text-right">
              Median absolute error
            </th>
            <th scope="col" className="text-right">
              Bias
            </th>
            <th scope="col" className="text-right">
              80% coverage
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.baseline}>
              <th scope="row" className="font-medium">
                {baselineLabels[metric.baseline]}
              </th>
              <td className="text-right font-mono tabular-nums">
                {metric.score_count.toLocaleString("en-US")}
              </td>
              <td className="text-right font-mono tabular-nums">
                <NumberValue value={metric.mae_days} suffix=" days" />
              </td>
              <td className="text-right font-mono tabular-nums">
                <NumberValue
                  value={metric.median_absolute_error_days}
                  suffix=" days"
                />
              </td>
              <td className="text-right font-mono tabular-nums">
                <NumberValue
                  value={metric.signed_bias_days}
                  suffix=" days"
                  signed
                />
              </td>
              <td className="text-right font-mono tabular-nums">
                <PercentValue value={metric.inclusive_coverage_80} />
              </td>
              <td>
                <Availability metric={metric} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnavailableReport() {
  return (
    <div className="surface p-5 sm:p-6" role="status">
      <h3 className="text-xl font-semibold">
        Historical analysis is not available
      </h3>
      <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">
        This section appears only when the complete source record passes every
        history check. Please try again later.
      </p>
      <Link
        href="/methodology/"
        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
      >
        Read the release-record method
      </Link>
    </div>
  );
}

function AvailableReport({ report }: { report: HistoricalAnalysisReportV1 }) {
  return (
    <div className="space-y-8">
      <div className="surface p-5 sm:p-6">
        <p className="max-w-3xl text-[var(--text-secondary)]">
          Each test starts with the facts known on that date. It compares two
          median baselines with the later recorded interval. It does not create
          a current release forecast.
        </p>
        <dl
          className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Historical-analysis cohort summary"
        >
          {[
            {
              label: "Included release cycles",
              value: countLabel(
                report.cohort.included_release_cycle_count,
                "cycle",
              ),
            },
            {
              label: "Eligible intervals",
              value: countLabel(
                report.cohort.eligible_interval_count,
                "interval",
              ),
            },
            {
              label: "Scored predictions",
              value: countLabel(
                report.cohort.scored_prediction_count,
                "prediction",
              ),
            },
            {
              label: "Excluded intervals",
              value: countLabel(
                report.cohort.excluded_interval_count,
                "interval",
              ),
            },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--bg-elevated)] p-4">
              <dt className="text-label">{item.label}</dt>
              <dd className="mt-2 font-mono text-xl font-semibold tabular-nums">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section aria-labelledby="historical-analysis-results">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Results</p>
            <h3 id="historical-analysis-results">Overall timing accuracy</h3>
          </div>
          <p>
            Lower error is better. Coverage shows how often the final date was
            inside the reported 80% interval.
          </p>
        </div>
        <OverallResultsTable metrics={report.overall_results} />
        <p className="horizontal-scroll__hint">
          <span aria-hidden="true">↔</span>
          Scroll horizontally to read every result column.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section
          className="surface p-5"
          aria-labelledby="historical-analysis-cohort"
        >
          <p className="section-kicker">Cohort</p>
          <h3
            id="historical-analysis-cohort"
            className="mt-2 text-2xl font-semibold"
          >
            Included and excluded intervals
          </h3>
          <p className="mt-3 text-[var(--text-secondary)]">
            The report uses only release cycles with complete chronology. It
            leaves out a date when it cannot prove the interval.
          </p>
          {report.exclusions.length > 0 ? (
            <ul className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {report.exclusions.map((exclusion) => (
                <li
                  key={exclusion.reason}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <span>{exclusionLabels[exclusion.reason]}</span>
                  <span className="font-mono tabular-nums text-[var(--text-secondary)]">
                    {countLabel(exclusion.interval_count, "interval")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-[var(--text-secondary)]">
              No intervals were excluded.
            </p>
          )}
        </section>

        <section
          className="surface p-5"
          aria-labelledby="historical-analysis-uncertainty"
        >
          <p className="section-kicker">Uncertainty</p>
          <h3
            id="historical-analysis-uncertainty"
            className="mt-2 text-2xl font-semibold"
          >
            Minimum sample rules
          </h3>
          <p className="mt-3 text-[var(--text-secondary)]">
            A result becomes available after at least{" "}
            {countLabel(report.uncertainty.minimum_reportable_scores, "score")}.{" "}
            {report.uncertainty.empirical_intervals_included
              ? "The report also measures 50% and 80% empirical intervals."
              : "This report does not include empirical intervals."}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <div className="border border-[var(--border)] p-3">
              <dt className="text-label">Reportable after</dt>
              <dd className="mt-2 font-mono text-lg font-semibold tabular-nums">
                {report.uncertainty.minimum_reportable_scores}
              </dd>
            </div>
            <div className="border border-[var(--border)] p-3">
              <dt className="text-label">Breakdown rows</dt>
              <dd className="mt-2 font-mono text-lg font-semibold tabular-nums">
                {report.breakdowns.length.toLocaleString("en-US")}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <details className="surface p-5">
        <summary className="cursor-pointer text-lg font-semibold">
          Source and method details
        </summary>
        <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-label">Source date</dt>
            <dd className="mt-1 font-mono tabular-nums">
              {report.provenance.source_as_of_date}
            </dd>
          </div>
          <div>
            <dt className="text-label">Source snapshot</dt>
            <dd className="mt-1 break-all font-mono text-xs tabular-nums">
              {report.provenance.source_issued_at}
            </dd>
          </div>
          <div>
            <dt className="text-label">Training rule</dt>
            <dd className="mt-1">Use facts known at each test start.</dd>
          </div>
          <div>
            <dt className="text-label">Report fingerprint</dt>
            <dd className="mt-1 break-all font-mono text-xs tabular-nums">
              {report.report_fingerprint}
            </dd>
          </div>
        </dl>
      </details>
    </div>
  );
}

/** Server-rendered summary of the validated public historical analysis. */
export function HistoricalAnalysisReport({
  report,
}: {
  report: HistoricalAnalysisReportV1 | null;
}) {
  return (
    <section
      id="historical-analysis"
      className="border-t border-[var(--border)] pt-12 sm:pt-16"
      aria-labelledby="historical-analysis-title"
    >
      <header className="section-heading">
        <div>
          <p className="section-kicker">Validated history</p>
          <h2 id="historical-analysis-title">Historical timing analysis</h2>
        </div>
        <p>
          Read the measured historical results. Use the API for the complete
          report and every breakdown.
        </p>
      </header>
      <div className="mb-7 flex flex-wrap gap-3">
        <a
          href={publicApiHistoricalAnalysisPath()}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] underline underline-offset-4"
        >
          Open historical-analysis API
        </a>
        <Link
          href="/api/#historical-analysis"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--text-secondary)] underline underline-offset-4"
        >
          Read API details
        </Link>
      </div>
      {report ? <AvailableReport report={report} /> : <UnavailableReport />}
    </section>
  );
}
