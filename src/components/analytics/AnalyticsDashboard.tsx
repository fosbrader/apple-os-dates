"use client";

import { useMemo } from "react";
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
}: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const versionStats: VersionStats[] = data
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
  }, [data]);

  return (
    <div className="space-y-10">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--border)] rounded-2xl overflow-hidden">
        {[
          { value: `${stats.avgCycleDays}d`, label: "Avg. Beta Cycle" },
          { value: stats.avgMilestones, label: "Avg. Releases" },
          { value: `${stats.avgInterval}d`, label: "Avg. Between Betas" },
          { value: stats.totalMilestones, label: "Total Releases" },
        ].map((s) => (
          <div key={s.label} className="bg-[var(--bg)] text-center py-6 px-4">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Records */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.longest && (
          <div className="card">
            <p className="text-label mb-2">Longest Beta Cycle</p>
            <div className="stat-value mb-1">{stats.longest.cycleDays}d</div>
            <p className="text-sm">
              <span style={{ color: stats.longest.platformColor }}>
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
              <span style={{ color: stats.shortest.platformColor }}>
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
            <p className="text-label mb-2">Most Releases</p>
            <div className="stat-value mb-1">
              {stats.mostBetas.milestoneCount}
            </div>
            <p className="text-sm">
              <span style={{ color: stats.mostBetas.platformColor }}>
                {stats.mostBetas.platform}
              </span>{" "}
              <span className="font-mono text-[var(--text-secondary)]">
                {stats.mostBetas.version}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <section>
        <h2 className="text-subheading mb-4">
          Beta Cycle Duration by Version
        </h2>
        <CycleLengthChart versions={stats.completedVersions} />
      </section>

      {/* Table */}
      <section>
        <h2 className="text-subheading mb-4">All Versions</h2>
        <div className="surface overflow-hidden overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Platform</th>
                <th className="text-right">Releases</th>
                <th className="text-right">Cycle (days)</th>
                <th className="text-right">Avg. Interval</th>
              </tr>
            </thead>
            <tbody>
              {stats.versionStats
                .sort(
                  (a, b) =>
                    (b.publicReleaseDate || "9999").localeCompare(
                      a.publicReleaseDate || "9999"
                    )
                )
                .slice(0, 50)
                .map((v, i) => (
                  <tr key={`${v.platform}-${v.version}-${i}`}>
                    <td className="font-mono font-medium">{v.version}</td>
                    <td>
                      <span style={{ color: v.platformColor }}>
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
      </section>
    </div>
  );
}
