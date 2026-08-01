import Link from "next/link";
import type { ReleaseForecast, ForecastWindow } from "@/lib/forecasts";
import {
  isActiveRelease,
  isReleasedRelease,
  type ReleaseVersion,
} from "@/lib/types";
import {
  computeBetaCycleDays,
  computeAverageBetaInterval,
  daysBetween,
  formatDate,
} from "@/lib/utils";
import { releaseVersionPath } from "@/lib/release-routes";

interface VersionInsightsProps {
  version: ReleaseVersion;
  samePlatformVersions: ReleaseVersion[];
  samePositionVersions: ReleaseVersion[];
}

interface Insight {
  label: string;
  value: string;
  detail?: string;
  type?: "info" | "warning" | "success";
}

function forecastDateRange(window: ForecastWindow): string {
  if (window.earliestDate === window.latestDate) {
    return formatDate(window.earliestDate);
  }

  return `${formatDate(window.earliestDate)} – ${formatDate(window.latestDate)}`;
}

export function VersionForecastCard({
  forecast,
}: {
  forecast?: ReleaseForecast;
}) {
  const window =
    forecast?.status === "active"
      ? forecast.nextMilestoneWindow ?? forecast.publicReleaseWindow
      : null;

  if (!forecast || !window) {
    return null;
  }

  const isNextMilestoneForecast = Boolean(forecast.nextMilestoneWindow);

  return (
    <section
      className="surface version-forecast-card"
      aria-labelledby="version-forecast-heading"
    >
      <div className="version-forecast-card__heading">
        <div>
          <p className="text-label">Methodology-backed forecast</p>
          <h2 id="version-forecast-heading">
            {isNextMilestoneForecast
              ? forecast.nextMilestoneWindow?.likelyLabel
              : "Estimated public release"}
          </h2>
        </div>
        <span className="version-forecast-card__status">Independent estimate</span>
      </div>

      <p className="version-forecast-card__range">
        {forecastDateRange(window)}
      </p>

      <dl className="version-forecast-card__evidence">
        <div>
          <dt>Historical median</dt>
          <dd>{formatDate(window.medianDate)}</dd>
        </div>
        <div>
          <dt>Comparable cycles</dt>
          <dd>{window.sampleSize}</dd>
        </div>
        {forecast.nextMilestoneWindow && (
          <div>
            <dt>Label agreement</dt>
            <dd>{forecast.nextMilestoneWindow.labelAgreement}%</dd>
          </div>
        )}
      </dl>

      <p className="version-forecast-card__note">
        Calculated from comparable completed cycles. This is not an Apple
        announcement.
      </p>
      <p className="version-forecast-card__links">
        <Link href="/forecasts/">View all forecasts &rarr;</Link>
        <Link href="/methodology/">Read the methodology &rarr;</Link>
      </p>
    </section>
  );
}

export function VersionInsights({
  version,
  samePlatformVersions,
  samePositionVersions,
}: VersionInsightsProps) {
  const isActive = isActiveRelease(version);
  const isReleased = isReleasedRelease(version);
  const milestones = version.milestones;
  const cycleDays = computeBetaCycleDays(version);

  const insights: Insight[] = [];

  // --- Historical averages for same-position versions (e.g., all .0 releases) ---
  const suffix = version.version.includes(".")
    ? version.version.slice(version.version.indexOf("."))
    : ".0";
  const isMajor = suffix === ".0";

  if (samePositionVersions.length > 0) {
    const positionCycles = samePositionVersions
      .map(computeBetaCycleDays)
      .filter((d): d is number => d !== null);
    const positionBetaCounts = samePositionVersions.map(
      (v) => v.milestones.length
    );

    if (positionCycles.length > 0) {
      const avgCycle = Math.round(
        positionCycles.reduce((a, b) => a + b, 0) / positionCycles.length
      );
      const avgBetas = (
        positionBetaCounts.reduce((a, b) => a + b, 0) /
        positionBetaCounts.length
      ).toFixed(1);

      insights.push({
        label: `Historical avg for ${isMajor ? "major" : suffix} releases`,
        value: `${avgCycle} days, ${avgBetas} milestones`,
        detail: `Based on ${samePositionVersions.length} previous ${version.releaseTrain.platform.name} ${suffix} releases`,
        type: "info",
      });

      // Compare current cycle if active
      if (isActive && milestones.length > 0) {
        const daysSinceStart = daysBetween(
          milestones[0].date,
          new Date().toISOString().split("T")[0]
        );
        if (daysSinceStart > avgCycle) {
          insights.push({
            label: "Longer than average",
            value: `${daysSinceStart} days so far (avg: ${avgCycle}d)`,
            detail: `This beta cycle has been running ${daysSinceStart - avgCycle} days longer than the historical average`,
            type: "warning",
          });
        }
      }
    }
  }

  // --- "Last time a beta went this long" ---
  if (isActive && milestones.length >= 2) {
    const lastMilestone = milestones[milestones.length - 1];
    const daysSinceLastBeta = daysBetween(
      lastMilestone.date,
      new Date().toISOString().split("T")[0]
    );

    if (daysSinceLastBeta > 7) {
      // Find historical versions where a gap between betas was this long
      const longerGaps: { version: ReleaseVersion; gap: number; from: string; to: string }[] = [];
      for (const v of samePlatformVersions) {
        for (let i = 1; i < v.milestones.length; i++) {
          const gap = daysBetween(
            v.milestones[i - 1].date,
            v.milestones[i].date
          );
          if (gap >= daysSinceLastBeta) {
            longerGaps.push({
              version: v,
              gap,
              from: v.milestones[i - 1].label,
              to: v.milestones[i].label,
            });
          }
        }
      }

      if (longerGaps.length > 0) {
        // Find the most recent example
        const sorted = longerGaps.sort((a, b) =>
          (b.version.publicReleaseDate || "").localeCompare(
            a.version.publicReleaseDate || ""
          )
        );
        const example = sorted[0];
        insights.push({
          label: `${daysSinceLastBeta} days since last beta`,
          value: `Gaps this long have happened ${longerGaps.length} times`,
          detail: `Most recently: ${example.version.releaseTrain.platform.name} ${example.version.version} had a ${example.gap}-day gap (${example.from} → ${example.to})`,
          type: "info",
        });
      } else {
        insights.push({
          label: `${daysSinceLastBeta} days since last beta`,
          value: `Unusually long gap`,
          detail: `No previous ${version.releaseTrain.platform.name} version has had a gap this long between milestones`,
          type: "warning",
        });
      }
    }
  }

  // --- Pace comparison: at this point in the cycle, how many betas did others have? ---
  if (isActive && milestones.length > 0) {
    const daysSinceStart = daysBetween(
      milestones[0].date,
      new Date().toISOString().split("T")[0]
    );

    const comparisons: { name: string; betasAtDay: number }[] = [];
    for (const v of samePositionVersions.slice(0, 5)) {
      let count = 0;
      for (const m of v.milestones) {
        const mDay = daysBetween(v.milestones[0].date, m.date);
        if (mDay <= daysSinceStart) count++;
      }
      comparisons.push({
        name: `${v.releaseTrain.platform.name} ${v.version}`,
        betasAtDay: count,
      });
    }

    if (comparisons.length > 0) {
      const avgBetasAtDay =
        comparisons.reduce((s, c) => s + c.betasAtDay, 0) /
        comparisons.length;

      const paceDifference = milestones.length - avgBetasAtDay;
      const ahead = paceDifference > 0.05;
      const behind = paceDifference < -0.05;
      insights.push({
        label: `Pace at day ${daysSinceStart}`,
        value: `${milestones.length} milestones (avg: ${avgBetasAtDay.toFixed(1)})`,
        detail: ahead
          ? `Ahead of pace — previous ${suffix} releases averaged ${avgBetasAtDay.toFixed(1)} milestones at this point`
          : behind
            ? `Behind pace — previous ${suffix} releases averaged ${avgBetasAtDay.toFixed(1)} milestones at this point`
            : `In line with pace — previous ${suffix} releases averaged ${avgBetasAtDay.toFixed(1)} milestones at this point`,
        type: ahead ? "success" : behind ? "warning" : "info",
      });
    }
  }

  // --- For released versions: compare to historical ---
  if (isReleased && cycleDays !== null) {
    const allCycles = samePlatformVersions
      .map(computeBetaCycleDays)
      .filter((d): d is number => d !== null);

    if (allCycles.length > 2) {
      const avg = Math.round(
        allCycles.reduce((a, b) => a + b, 0) / allCycles.length
      );
      const diff = cycleDays - avg;
      insights.push({
        label: "Cycle vs. platform average",
        value: `${cycleDays}d (avg: ${avg}d)`,
        detail:
          diff > 0
            ? `${diff} days longer than the ${version.releaseTrain.platform.name} average`
            : diff < 0
              ? `${Math.abs(diff)} days shorter than the ${version.releaseTrain.platform.name} average`
              : `Exactly the platform average`,
        type: diff > 10 ? "warning" : diff < -10 ? "success" : "info",
      });
    }

    // Rank among all versions
    const sorted = allCycles.sort((a, b) => b - a);
    const rank = sorted.indexOf(cycleDays) + 1;
    if (rank > 0 && sorted.length > 3) {
      insights.push({
        label: "Duration ranking",
        value: `#${rank} of ${sorted.length}`,
        detail: `${rank <= 3 ? "One of the longest" : rank >= sorted.length - 2 ? "One of the shortest" : "Middle of the pack"} ${version.releaseTrain.platform.name} beta cycles`,
        type: "info",
      });
    }
  }

  // --- Longest gap in this version ---
  if (milestones.length >= 2) {
    let maxGap = 0;
    let maxGapFrom = "";
    let maxGapTo = "";
    for (let i = 1; i < milestones.length; i++) {
      const gap = daysBetween(milestones[i - 1].date, milestones[i].date);
      if (gap > maxGap) {
        maxGap = gap;
        maxGapFrom = milestones[i - 1].label;
        maxGapTo = milestones[i].label;
      }
    }
    if (maxGap > 7) {
      insights.push({
        label: "Longest gap in this cycle",
        value: `${maxGap} days`,
        detail: `Between ${maxGapFrom} and ${maxGapTo}`,
        type: "info",
      });
    }
  }

  // --- Historical comparison table for same-position versions ---
  const comparisonRows = samePositionVersions
    .filter((v) => isReleasedRelease(v) && v.publicReleaseDate)
    .sort((a, b) =>
      (b.publicReleaseDate || "").localeCompare(a.publicReleaseDate || "")
    )
    .slice(0, 6)
    .map((v) => ({
      name: `${v.releaseTrain.platform.name} ${v.version}`,
      slug: v.releaseTrain.platform.slug.current,
      version: v.version,
      cycle: computeBetaCycleDays(v),
      betas: v.milestones.length,
      avgInterval: computeAverageBetaInterval(v.milestones),
      year: v.publicReleaseDate?.slice(0, 4),
    }));
  if (insights.length === 0 && comparisonRows.length === 0) {
    return null;
  }

  const TYPE_STYLES = {
    info: { bg: "var(--accent-muted)", border: "var(--accent)", color: "var(--accent)" },
    warning: { bg: "rgba(255, 159, 10, 0.08)", border: "var(--milestone-rc)", color: "var(--milestone-rc)" },
    success: { bg: "rgba(48, 209, 88, 0.08)", border: "var(--milestone-public)", color: "var(--milestone-public)" },
  };

  return (
    <div className="space-y-6">
      {/* Insight tiles */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => {
            const style = TYPE_STYLES[insight.type || "info"];
            return (
              <div
                key={i}
                className="rounded-lg p-4"
                style={{
                  background: style.bg,
                  borderLeft: `3px solid ${style.border}`,
                }}
              >
                <p className="text-label mb-1">{insight.label}</p>
                <p
                  className="font-semibold font-mono text-sm"
                  style={{ color: style.color }}
                >
                  {insight.value}
                </p>
                {insight.detail && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {insight.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Historical comparison table */}
      {comparisonRows.length > 0 && (
        <div>
          <h3 className="text-label mb-3">
            Previous {suffix} releases ({version.releaseTrain.platform.name})
          </h3>
          <div
            className="surface horizontal-scroll horizontal-scroll--table horizontal-scroll--medium comparison-table overflow-x-auto"
            role="region"
            aria-label={`Scrollable comparison of previous ${version.releaseTrain.platform.name} releases`}
            tabIndex={0}
          >
            <table className="data-table min-w-[36rem]">
              <caption className="sr-only">
                Previous comparable {version.releaseTrain.platform.name}{" "}
                releases
              </caption>
              <thead>
                <tr>
                  <th scope="col">Version</th>
                  <th scope="col">Year</th>
                  <th scope="col" className="text-right">Cycle</th>
                  <th scope="col" className="text-right">Milestones</th>
                  <th scope="col" className="text-right">
                    Avg. Interval
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.name}>
                    <td
                      className="font-mono font-medium text-sm"
                      data-label="Version"
                    >
                      <Link
                        href={releaseVersionPath(row.slug, row.version)}
                        className="hover:text-[var(--accent)] hover:underline"
                      >
                        {row.name}
                      </Link>
                    </td>
                    <td
                      className="text-[var(--text-secondary)] text-sm"
                      data-label="Year"
                    >
                      {row.year}
                    </td>
                    <td
                      className="text-right font-mono text-sm text-[var(--text-secondary)]"
                      data-label="Cycle"
                    >
                      {row.cycle ? `${row.cycle}d` : "—"}
                    </td>
                    <td
                      className="text-right font-mono text-sm text-[var(--text-secondary)]"
                      data-label="Milestones"
                    >
                      {row.betas}
                    </td>
                    <td
                      className="text-right font-mono text-sm text-[var(--text-secondary)]"
                      data-label="Avg. interval"
                    >
                      {row.avgInterval ? `${row.avgInterval}d` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="horizontal-scroll__hint horizontal-scroll__hint--medium">
            <span aria-hidden="true">↔</span>
            Scroll horizontally to compare every historical field.
          </p>
        </div>
      )}
    </div>
  );
}
