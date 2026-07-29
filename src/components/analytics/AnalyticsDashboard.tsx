"use client";

import { useMemo, useState } from "react";
import type { Platform, ReleaseVersion } from "@/lib/types";
import {
  computeBetaCycleDays,
  computeAverageBetaInterval,
} from "@/lib/utils";
import { CycleLengthChart } from "./CycleLengthChart";

interface AnalyticsDashboardProps {
  data: ReleaseVersion[];
  platforms: Platform[];
}

interface VersionStats {
  platform: string;
  platformColor: string;
  version: string;
  majorVersion: number;
  milestoneCount: number;
  cycleDays: number | null;
  avgInterval: number | null;
  publicReleaseDate?: string;
}

export function AnalyticsDashboard({
  data,
  platforms,
}: AnalyticsDashboardProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const stats = useMemo(() => {
    const filteredData =
      selectedPlatform === "all"
        ? data
        : data.filter(
            (version) =>
              version.releaseTrain.platform.slug.current === selectedPlatform,
          );
    const versionStats: VersionStats[] = filteredData
      .filter((v) => v.milestones?.length > 0)
      .map((v) => ({
        platform: v.releaseTrain.platform.name,
        platformColor: v.releaseTrain.platform.color,
        version: v.version,
        majorVersion: v.releaseTrain.majorVersion,
        milestoneCount: v.milestones.length,
        cycleDays: computeBetaCycleDays(v),
        avgInterval: computeAverageBetaInterval(v.milestones),
        publicReleaseDate: v.publicReleaseDate,
      }));

    const completedVersions = versionStats.filter((v) => v.cycleDays !== null);

    const avgCycleDays =
      completedVersions.length > 0
        ? Math.round(
            completedVersions.reduce((sum, v) => sum + v.cycleDays!, 0) /
              completedVersions.length
          )
        : 0;

    const avgMilestones =
      versionStats.length > 0
        ? (
            versionStats.reduce((sum, v) => sum + v.milestoneCount, 0) /
            versionStats.length
          ).toFixed(1)
        : "0";

    const avgInterval =
      completedVersions.filter((v) => v.avgInterval !== null).length > 0
        ? Math.round(
            completedVersions
              .filter((v) => v.avgInterval !== null)
              .reduce((sum, v) => sum + v.avgInterval!, 0) /
              completedVersions.filter((v) => v.avgInterval !== null).length
          )
        : 0;

    const longest = completedVersions.reduce(
      (max, v) => (v.cycleDays! > (max?.cycleDays || 0) ? v : max),
      completedVersions[0]
    );
    const shortest = completedVersions.reduce(
      (min, v) => (v.cycleDays! < (min?.cycleDays || Infinity) ? v : min),
      completedVersions[0]
    );
    const mostBetas = versionStats.reduce(
      (max, v) => (v.milestoneCount > (max?.milestoneCount || 0) ? v : max),
      versionStats[0]
    );

    return {
      versionStats,
      completedVersions,
      avgCycleDays,
      avgMilestones,
      avgInterval,
      longest,
      shortest,
      mostBetas,
      totalMilestones: versionStats.reduce(
        (sum, v) => sum + v.milestoneCount,
        0
      ),
    };
  }, [data, selectedPlatform]);
  const sortedVersionStats = useMemo(
    () =>
      [...stats.versionStats].sort((a, b) =>
        (b.publicReleaseDate || "9999").localeCompare(
          a.publicReleaseDate || "9999",
        ),
      ),
    [stats.versionStats],
  );
  const initialMobileVersionStats = sortedVersionStats.slice(0, 24);
  const remainingMobileVersionStats = sortedVersionStats.slice(24);

  return (
    <div className="space-y-10">
      <div className="filter-bar">
        <div className="filter-control">
          <label className="text-label" htmlFor="analytics-platform">
            Platform
          </label>
          <select
            id="analytics-platform"
            value={selectedPlatform}
            onChange={(event) => setSelectedPlatform(event.target.value)}
            className="filter-control__input"
          >
            <option value="all">All platforms</option>
            {platforms.map((platform) => (
              <option key={platform._id} value={platform.slug.current}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
        <p className="ml-auto max-w-md text-xs text-[var(--text-tertiary)]">
          Summary metrics, records, chart, and version ledger update together.
        </p>
      </div>

      <dl className="metric-rail" aria-label="Release analytics summary">
        {[
          { value: `${stats.avgCycleDays}d`, label: "Avg. Beta Cycle" },
          { value: stats.avgMilestones, label: "Avg. Milestones" },
          { value: `${stats.avgInterval}d`, label: "Avg. Interval" },
          { value: stats.totalMilestones, label: "Total Milestones" },
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

      <div className="section-heading">
        <div>
          <p className="section-kicker">Selected view</p>
          <h2>Cycle records</h2>
        </div>
        <p>
          Longest and shortest completed beta cycles, plus the version with the
          most recorded milestones.
        </p>
      </div>
      <div className="analytics-records grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.longest && (
          <div className="card">
            <p className="text-label mb-2">Longest Beta Cycle</p>
            <div className="stat-value mb-1">{stats.longest.cycleDays}d</div>
            <p className="text-sm">
              <span
                className="platform-label"
                style={
                  {
                    "--platform-color": stats.longest.platformColor,
                  } as React.CSSProperties
                }
              >
                <i aria-hidden="true" />
                {stats.longest.platform}
              </span>{" "}
              <span className="font-mono text-[var(--text-secondary)]">
                {stats.longest.version}
              </span>
            </p>
          </div>
        )}
        {stats.shortest && (
          <div className="card">
            <p className="text-label mb-2">Shortest Beta Cycle</p>
            <div className="stat-value mb-1">{stats.shortest.cycleDays}d</div>
            <p className="text-sm">
              <span
                className="platform-label"
                style={
                  {
                    "--platform-color": stats.shortest.platformColor,
                  } as React.CSSProperties
                }
              >
                <i aria-hidden="true" />
                {stats.shortest.platform}
              </span>{" "}
              <span className="font-mono text-[var(--text-secondary)]">
                {stats.shortest.version}
              </span>
            </p>
          </div>
        )}
        {stats.mostBetas && (
          <div className="card">
            <p className="text-label mb-2">Most Milestones</p>
            <div className="stat-value mb-1">
              {stats.mostBetas.milestoneCount}
            </div>
            <p className="text-sm">
              <span
                className="platform-label"
                style={
                  {
                    "--platform-color": stats.mostBetas.platformColor,
                  } as React.CSSProperties
                }
              >
                <i aria-hidden="true" />
                {stats.mostBetas.platform}
              </span>{" "}
              <span className="font-mono text-[var(--text-secondary)]">
                {stats.mostBetas.version}
              </span>
            </p>
          </div>
        )}
      </div>

      <section>
        <div className="section-heading">
          <div>
            <p className="section-kicker">Duration series</p>
            <h2>Beta cycle duration</h2>
          </div>
          <p>
            Completed major-version cycles, with the average shown as a dashed
            reference line.
          </p>
        </div>
        <CycleLengthChart versions={stats.completedVersions} />
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="section-kicker">Version data</p>
            <h2>All indexed cycles</h2>
          </div>
          <p>
            Milestone totals, cycle duration, and average beta interval for
            every version in the selected view.
          </p>
        </div>

        <div
          className="mobile-analytics-list"
          aria-label="Release analytics for all versions in the selected platform view"
        >
          <div className="mobile-analytics-list__items">
            {initialMobileVersionStats.map((version, index) => (
              <AnalyticsVersionCard
                key={`${version.platform}-${version.version}-${index}`}
                version={version}
              />
            ))}
          </div>
          {remainingMobileVersionStats.length > 0 && (
            <details className="mobile-analytics-list__more">
              <summary>
                Show {remainingMobileVersionStats.length} older cycles
              </summary>
              <div className="mobile-analytics-list__items">
                {remainingMobileVersionStats.map((version, index) => (
                  <AnalyticsVersionCard
                    key={`${version.platform}-${version.version}-${index + 24}`}
                    version={version}
                  />
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="desktop-analytics-table">
          <div
            className="surface horizontal-scroll horizontal-scroll--table horizontal-scroll--medium overflow-hidden overflow-x-auto"
            role="region"
            aria-label="Scrollable release analytics table"
            tabIndex={0}
          >
            <table className="data-table min-w-[42rem]">
              <caption className="sr-only">
                Release analytics for all versions in the selected platform view
              </caption>
              <thead>
                <tr>
                  <th scope="col">Version</th>
                  <th scope="col">Platform</th>
                  <th scope="col" className="text-right">Milestones</th>
                  <th scope="col" className="text-right">Cycle (days)</th>
                  <th scope="col" className="text-right">Avg. Interval</th>
                </tr>
              </thead>
              <tbody>
                {sortedVersionStats.map((v, i) => (
                  <tr key={`${v.platform}-${v.version}-${i}`}>
                    <td className="font-mono font-medium">{v.version}</td>
                    <td>
                      <span
                        className="platform-label"
                        style={
                          {
                            "--platform-color": v.platformColor,
                          } as React.CSSProperties
                        }
                      >
                        <i aria-hidden="true" />
                        {v.platform}
                      </span>
                    </td>
                    <td className="text-right font-mono tabular-nums">
                      {v.milestoneCount}
                    </td>
                    <td className="text-right font-mono tabular-nums text-[var(--text-secondary)]">
                      {v.cycleDays ?? "—"}
                    </td>
                    <td className="text-right font-mono tabular-nums text-[var(--text-secondary)]">
                      {v.avgInterval ? `${v.avgInterval}d` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="horizontal-scroll__hint horizontal-scroll__hint--medium">
            <span aria-hidden="true">↔</span>
            Scroll horizontally to see every analytics field.
          </p>
        </div>
      </section>
    </div>
  );
}

function AnalyticsVersionCard({ version }: { version: VersionStats }) {
  return (
    <article className="mobile-analytics-card">
      <header className="mobile-analytics-card__header">
        <span
          className="platform-label"
          style={
            {
              "--platform-color": version.platformColor,
            } as React.CSSProperties
          }
        >
          <i aria-hidden="true" />
          {version.platform}
        </span>
        <strong className="font-mono">{version.version}</strong>
      </header>
      <dl className="mobile-analytics-card__metrics">
        <div>
          <dt>Milestones</dt>
          <dd className="font-mono">{version.milestoneCount}</dd>
        </div>
        <div>
          <dt>Cycle</dt>
          <dd className="font-mono">
            {version.cycleDays === null ? "—" : `${version.cycleDays} days`}
          </dd>
        </div>
        <div>
          <dt>Avg. interval</dt>
          <dd className="font-mono">
            {version.avgInterval ? `${version.avgInterval} days` : "—"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
