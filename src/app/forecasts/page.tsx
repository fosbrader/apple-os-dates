import Link from "next/link";
import { ForecastViewEvent } from "@/components/analytics/AnalyticsEventTracker";
import { JsonLd, type JsonLdValue } from "@/components/seo/JsonLd";
import {
  buildReleaseForecasts,
  FORECAST_STALE_AFTER_DAYS,
  summarizeForecastAccuracy,
  type ForecastConfidence,
  type ReleaseForecast,
} from "@/lib/forecasts";
import { getAnalyticsData } from "@/lib/sanity.fetch";
import {
  absoluteUrl,
  createPageMetadata,
  latestDate,
} from "@/lib/site";
import { daysBetween, formatDate } from "@/lib/utils";

const forecastDescription =
  "Evidence-based Apple OS release windows derived from comparable historical beta cycles, with sample sizes, ranges, backtests, and explicit uncertainty.";

export const metadata = createPageMetadata({
  title: "Apple OS Beta Release Forecasts",
  description: forecastDescription,
  path: "/forecasts/",
});

export const revalidate = 3600;

const CONFIDENCE_LABELS: Record<ForecastConfidence, string> = {
  high: "Higher historical confidence",
  medium: "Moderate historical confidence",
  low: "Low historical confidence",
};

const CONFIDENCE_STYLES: Record<
  ForecastConfidence,
  React.CSSProperties
> = {
  high: {
    color: "var(--milestone-public)",
    background: "rgba(48, 209, 88, 0.1)",
  },
  medium: {
    color: "var(--milestone-rc)",
    background: "rgba(255, 159, 10, 0.1)",
  },
  low: {
    color: "var(--text-secondary)",
    background: "var(--bg-muted)",
  },
};

function DateRange({
  earliest,
  latest,
}: {
  earliest: string;
  latest: string;
}) {
  if (earliest === latest) {
    return <>{formatDate(earliest)}</>;
  }

  return (
    <>
      {formatDate(earliest)}–{formatDate(latest)}
    </>
  );
}

function ForecastRange({
  earliest,
  median,
  latest,
}: {
  earliest: string;
  median: string;
  latest: string;
}) {
  const rangeDays = Math.max(daysBetween(earliest, latest), 1);
  const medianOffset =
    earliest === latest
      ? 50
      : Math.max(
          0,
          Math.min(100, (daysBetween(earliest, median) / rangeDays) * 100),
        );

  return (
    <div
      className="forecast-range"
      role="img"
      aria-label={`Estimated public release window from ${formatDate(earliest)} to ${formatDate(latest)}, with a historical median of ${formatDate(median)}`}
    >
      <div className="forecast-range__heading">
        <p className="text-label">Estimated public release window</p>
        <strong>
          <DateRange earliest={earliest} latest={latest} />
        </strong>
      </div>
      <div className="forecast-range__plot" aria-hidden="true">
        <span className="forecast-range__band" />
        <span
          className="forecast-range__median"
          style={{ left: `${medianOffset}%` }}
        />
      </div>
      <div className="forecast-range__labels" aria-hidden="true">
        <span>{formatDate(earliest)}</span>
        <span>Median · {formatDate(median)}</span>
        <span>{formatDate(latest)}</span>
      </div>
    </div>
  );
}

function ForecastCard({ forecast }: { forecast: ReleaseForecast }) {
  const platform = forecast.release.releaseTrain.platform;
  const versionHref = `/${platform.slug.current}/${encodeURIComponent(
    forecast.release.version,
  )}`;
  const isPaused =
    forecast.status === "paused-stale" ||
    forecast.status === "paused-window-passed";
  const window = forecast.publicReleaseWindow;

  return (
    <article
      className="card card-platform forecast-card space-y-5"
      style={{ "--platform-color": platform.color } as React.CSSProperties}
    >
      {window && forecast.confidence ? (
        <ForecastViewEvent
          platform={platform.name}
          version={forecast.release.version}
          confidence={forecast.confidence}
          sampleSize={window.sampleSize}
        />
      ) : null}
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="badge badge-platform"
              style={
                { "--platform-color": platform.color } as React.CSSProperties
              }
            >
              {platform.name}
            </span>
            <Link
              href={versionHref}
              className="font-mono text-lg font-semibold hover:text-[var(--accent)]"
            >
              {forecast.release.version}
            </Link>
          </div>
          {forecast.latestMilestone && (
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              Latest recorded milestone:{" "}
              <span className="text-[var(--text-secondary)]">
                {forecast.latestMilestone.label} on{" "}
                {formatDate(forecast.latestMilestone.date)}
              </span>
            </p>
          )}
        </div>

        {forecast.confidence && (
          <span
            className="ml-auto rounded-full px-2.5 py-1 text-xs font-medium"
            style={CONFIDENCE_STYLES[forecast.confidence]}
          >
            {CONFIDENCE_LABELS[forecast.confidence]}
          </span>
        )}
        {forecast.confidenceReason && (
          <p className="w-full text-xs leading-5 text-[var(--text-tertiary)]">
            Evidence note: {forecast.confidenceReason}
          </p>
        )}
      </header>

      <div
        className={`forecast-status ${
          forecast.status === "active"
            ? "forecast-status--active"
            : "forecast-status--paused"
        }`}
      >
        <p className="text-sm font-semibold">
          {forecast.status === "active"
            ? "Forecast active"
            : forecast.status === "insufficient-history"
              ? "Not enough evidence"
              : "Forecast paused"}
        </p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          {forecast.statusMessage}
        </p>
      </div>

      {window && forecast.status === "active" && (
        <div className="space-y-3">
          <ForecastRange
            earliest={window.earliestDate}
            median={window.medianDate}
            latest={window.latestDate}
          />

          {forecast.nextMilestoneWindow && (
            <div className="surface p-4">
              <p className="text-label">
                Estimated next milestone window
              </p>
              <p className="mt-1 font-mono text-base font-semibold">
                <DateRange
                  earliest={forecast.nextMilestoneWindow.earliestDate}
                  latest={forecast.nextMilestoneWindow.latestDate}
                />
              </p>
              <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                Most often {forecast.nextMilestoneWindow.likelyLabel} (
                {forecast.nextMilestoneWindow.labelAgreement}% of comparable
                cycles; n={forecast.nextMilestoneWindow.sampleSize})
              </p>
            </div>
          )}
        </div>
      )}

      {window && isPaused && (
        <div className="surface p-4">
          <p className="text-label">Elapsed historical window</p>
          <p className="mt-1 font-mono text-sm text-[var(--text-secondary)]">
            <DateRange
              earliest={window.earliestDate}
              latest={window.latestDate}
            />
          </p>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            This is shown for transparency, not as an upcoming prediction.
          </p>
        </div>
      )}

      {forecast.cohort && (
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--border)] pt-4 md:grid-cols-2">
          <div>
            <p className="text-label">Comparable cohort</p>
            <p className="mt-1 text-sm">{forecast.cohort.label}</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              {forecast.cohort.sampleVersions.length} cycles:{" "}
              {forecast.cohort.sampleVersions.map((sampleVersion, index) => (
                <span key={sampleVersion}>
                  {index > 0 ? ", " : ""}
                  <Link
                    href={`/${platform.slug.current}/${encodeURIComponent(sampleVersion)}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] hover:underline"
                  >
                    {sampleVersion}
                  </Link>
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className="text-label">Range definition</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              25th–75th percentile of observed days from{" "}
              {forecast.stageLabel ?? "the matched milestone"} to public
              release.
            </p>
          </div>
        </div>
      )}

      {forecast.backtest && (
        <div className="text-xs text-[var(--text-tertiary)]">
          Prior-only backtest for this platform and release class:{" "}
          <span className="text-[var(--text-secondary)]">
            {forecast.backtest.medianAbsoluteErrorDays}-day median error;{" "}
            {forecast.backtest.withinRangePercent}% inside the historical
            range across {forecast.backtest.sampleSize} tests.
          </span>
        </div>
      )}
    </article>
  );
}

export default async function ForecastsPage() {
  const releases = await getAnalyticsData();
  const asOf = new Date();
  const asOfDate = asOf.toISOString().slice(0, 10);
  const forecasts = buildReleaseForecasts(releases, asOf);
  const accuracy = summarizeForecastAccuracy(forecasts);
  const activeCount = forecasts.filter(
    (forecast) => forecast.status === "active"
  ).length;
  const pausedCount = forecasts.filter(
    (forecast) =>
      forecast.status === "paused-stale" ||
      forecast.status === "paused-window-passed"
  ).length;
  const canonical = absoluteUrl("/forecasts/");
  const dateModified = latestDate(
    releases.map((release) => release.updatedAt)
  );
  const structuredData: JsonLdValue = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: "Apple OS Beta Release Forecasts",
        description: forecastDescription,
        dateModified,
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        mainEntity: { "@id": `${canonical}#forecast-dataset` },
      },
      {
        "@type": "Dataset",
        "@id": `${canonical}#forecast-dataset`,
        url: canonical,
        name: "History-Based Apple OS Release Forecasts",
        description:
          "Descriptive date ranges calculated from comparable historical Apple OS beta cycles. Estimates are independent and are not Apple announcements.",
        dateModified,
        isAccessibleForFree: true,
        isPartOf: { "@id": `${absoluteUrl("/")}#release-dataset` },
        isBasedOn: { "@id": `${absoluteUrl("/")}#release-dataset` },
        creator: { "@id": `${absoluteUrl("/")}#organization` },
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
        measurementTechnique:
          "Prior milestone to public release intervals summarized with medians and 25th–75th percentile ranges.",
        variableMeasured: [
          "Days from milestone to public release",
          "Historical median date",
          "Historical interquartile date range",
          "Rolling backtest error",
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd id="forecast-structured-data" data={structuredData} />
      <div className="space-y-16">
        <header
          className="page-intro animate-in"
          style={{ "--delay": 0 } as React.CSSProperties}
        >
          <div>
            <p className="section-kicker">Release forecasts</p>
            <h1 className="text-heading">
              Apple OS beta release forecasts
            </h1>
          </div>
          <div>
            <p className="page-intro__description">
              History-based public-release and next-milestone ranges, with the
              comparison cohort, sample size, spread, confidence, and stale-data
              safeguards kept visible.
            </p>
            <span className="page-intro__meta">
              Calculated <time dateTime={asOfDate}>{formatDate(asOfDate)}</time>{" "}
              · Refreshes after Sanity updates
            </span>
          </div>
        </header>

        <dl
          className="metric-rail animate-in"
          style={{ "--delay": 1 } as React.CSSProperties}
          aria-label="Forecast status"
        >
          {[
            { value: forecasts.length, label: "Tracked Cycles" },
            { value: activeCount, label: "Active Forecasts" },
            { value: pausedCount, label: "Paused / Stale" },
            {
              value: accuracy ? `${accuracy.medianAbsoluteErrorDays}d` : "—",
              label: "Backtest Median Error",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="metric-rail__item"
              data-index={String(index + 1).padStart(2, "0")}
            >
              <dt className="stat-label">{stat.label}</dt>
              <dd className="stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>

        {accuracy && (
          <section
            className="surface p-5 animate-in"
            style={{ "--delay": 2 } as React.CSSProperties}
            aria-labelledby="backtest-heading"
          >
            <h2 id="backtest-heading" className="text-subheading">
              Historical backtest
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              In {accuracy.sampleSize} rolling tests, each release was estimated
              using only cycles already public at that point—never later data.
              The median absolute error was{" "}
              <strong className="text-[var(--text)]">
                {accuracy.medianAbsoluteErrorDays} days
              </strong>
              , and the actual date fell inside the historical 25th–75th
              percentile window in{" "}
              <strong className="text-[var(--text)]">
                {accuracy.withinRangePercent}%
              </strong>{" "}
              of tests. Historical performance is not a promise of future
              accuracy.
            </p>
          </section>
        )}

        {forecasts.length > 0 ? (
          <section className="space-y-5" aria-labelledby="release-forecasts">
            <div className="section-heading">
              <div>
                <p className="section-kicker">Current cycles</p>
                <h2 id="release-forecasts">Active forecasts</h2>
              </div>
              <p>
                Forecasts pause automatically when the latest recorded
                milestone is more than {FORECAST_STALE_AFTER_DAYS} days old or
                the entire historical window has elapsed.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {forecasts.map((forecast) => (
                <ForecastCard
                  key={forecast.release._id}
                  forecast={forecast}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="surface p-6 text-center">
            <h2 className="text-subheading">No active beta cycles</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Forecasts will appear when an unreleased version with a dated
              milestone is added in Sanity.
            </p>
          </section>
        )}

        <aside className="surface p-5" aria-labelledby="forecast-caveats">
          <h2 id="forecast-caveats" className="text-subheading">
            How to read these estimates
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
            <li>
              The displayed range contains the middle 50% of comparable
              historical observations. It is descriptive—not a calibrated
              probability or statistical confidence interval.
            </li>
            <li>
              Same-platform, same-position cycles are preferred. A broader
              major/minor/patch cohort is clearly labeled when fewer than three
              exact-position examples exist.
            </li>
            <li>
              Apple can change a schedule for quality, security, holidays, or
              product timing. This independent site has no inside information.
            </li>
          </ul>
          <p className="mt-4 text-sm">
            <Link
              href="/methodology/"
              className="text-[var(--accent)] hover:underline"
            >
              Read the complete methodology and editorial policy &rarr;
            </Link>
          </p>
        </aside>
      </div>
    </>
  );
}
