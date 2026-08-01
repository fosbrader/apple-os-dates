"use client";

import { useMemo, useState } from "react";
import { CycleLengthChart } from "./CycleLengthChart";
import type { AnalyticsVersionStat } from "@/lib/view-models/analytics";
import {
  indexPlatformsBySlug,
  resolvePlatform,
  type ViewModelPlatform,
} from "@/lib/view-models/platforms";

interface AnalyticsDashboardProps {
  versions: AnalyticsVersionStat[];
  platforms: ViewModelPlatform[];
}

export function AnalyticsDashboard({
  versions,
  platforms,
}: AnalyticsDashboardProps) {
  const platformsBySlug = useMemo(
    () => indexPlatformsBySlug(platforms),
    [platforms],
  );
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const stats = useMemo(() => {
    const versionStats =
      selectedPlatform === "all"
        ? versions
        : versions.filter(
            (version) => version.platformSlug === selectedPlatform,
          );

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
  }, [versions, selectedPlatform]);
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
  const chartVersions = useMemo(
    () =>
      stats.completedVersions.map((version) => {
        const platform = resolvePlatform(
          platformsBySlug,
          version.platformSlug,
        );

        return {
          platform: platform.name,
          platformColor: platform.color,
          version: version.version,
          cycleDays: version.cycleDays,
          publicReleaseDate: version.publicReleaseDate,
        };
      }),
    [stats.completedVersions, platformsBySlug],
  );

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
              <option key={platform.slug} value={platform.slug}>
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
          <CycleRecordCard
            label="Longest Beta Cycle"
            value={`${stats.longest.cycleDays}d`}
            record={stats.longest}
            platform={resolvePlatform(
              platformsBySlug,
              stats.longest.platformSlug,
            )}
          />
        )}
        {stats.shortest && (
          <CycleRecordCard
            label="Shortest Beta Cycle"
            value={`${stats.shortest.cycleDays}d`}
            record={stats.shortest}
            platform={resolvePlatform(
              platformsBySlug,
              stats.shortest.platformSlug,
            )}
          />
        )}
        {stats.mostBetas && (
          <CycleRecordCard
            label="Most Milestones"
            value={stats.mostBetas.milestoneCount}
            record={stats.mostBetas}
            platform={resolvePlatform(
              platformsBySlug,
              stats.mostBetas.platformSlug,
            )}
          />
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
        <CycleLengthChart versions={chartVersions} />
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
                key={`${version.platformSlug}-${version.version}-${index}`}
                version={version}
                platform={resolvePlatform(
                  platformsBySlug,
                  version.platformSlug,
                )}
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
                    key={`${version.platformSlug}-${version.version}-${index + 24}`}
                    version={version}
                    platform={resolvePlatform(
                      platformsBySlug,
                      version.platformSlug,
                    )}
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
                  <tr key={`${v.platformSlug}-${v.version}-${i}`}>
                    <td className="font-mono font-medium">{v.version}</td>
                    <td>
                      <PlatformLabel
                        platform={resolvePlatform(
                          platformsBySlug,
                          v.platformSlug,
                        )}
                      />
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

function PlatformLabel({ platform }: { platform: ViewModelPlatform }) {
  return (
    <span
      className="platform-label"
      style={
        { "--platform-color": platform.color } as React.CSSProperties
      }
    >
      <i aria-hidden="true" />
      {platform.name}
    </span>
  );
}

function CycleRecordCard({
  label,
  value,
  record,
  platform,
}: {
  label: string;
  value: string | number;
  record: AnalyticsVersionStat;
  platform: ViewModelPlatform;
}) {
  return (
    <div className="card">
      <p className="text-label mb-2">{label}</p>
      <div className="stat-value mb-1">{value}</div>
      <p className="text-sm">
        <PlatformLabel platform={platform} />{" "}
        <span className="font-mono text-[var(--text-secondary)]">
          {record.version}
        </span>
      </p>
    </div>
  );
}

function AnalyticsVersionCard({
  version,
  platform,
}: {
  version: AnalyticsVersionStat;
  platform: ViewModelPlatform;
}) {
  return (
    <article className="mobile-analytics-card">
      <header className="mobile-analytics-card__header">
        <PlatformLabel platform={platform} />
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
