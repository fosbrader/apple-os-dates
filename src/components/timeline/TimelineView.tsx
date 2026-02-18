"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Platform, ReleaseVersion } from "@/lib/types";
import { formatDate, getMilestoneType, daysBetween } from "@/lib/utils";

interface TimelineViewProps {
  data: ReleaseVersion[];
  platforms: Platform[];
}

interface VersionBar {
  id: string;
  platform: Platform;
  version: string;
  slug: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  milestoneCount: number;
  isActive: boolean;
  milestones: { label: string; date: string; type: string; pct: number }[];
}

type SortKey = "date" | "duration" | "betas" | "platform";
type GroupKey = "year" | "platform" | "none";

export function TimelineView({ data, platforms }: TimelineViewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [groupBy, setGroupBy] = useState<GroupKey>("year");
  const [showActive, setShowActive] = useState(true);
  const [showReleased, setShowReleased] = useState(true);

  const bars = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return data
      .filter((v) => v.milestones?.length > 0)
      .filter(
        (v) =>
          selectedPlatform === "all" ||
          v.releaseTrain.platform.slug.current === selectedPlatform
      )
      .filter((v) => {
        const isActive = !v.publicReleaseDate;
        if (isActive && !showActive) return false;
        if (!isActive && !showReleased) return false;
        return true;
      })
      .map((v): VersionBar => {
        const startDate = v.milestones[0].date;
        const endDate = v.publicReleaseDate || today;
        const durationDays = Math.max(1, daysBetween(startDate, endDate));

        const milestones = v.milestones.map((m) => ({
          label: m.label,
          date: m.date,
          type: getMilestoneType(m.label),
          pct: Math.max(
            0,
            Math.min(100, (daysBetween(startDate, m.date) / durationDays) * 100)
          ),
        }));

        return {
          id: v._id,
          platform: v.releaseTrain.platform,
          version: v.version,
          slug: v.releaseTrain.platform.slug.current,
          startDate,
          endDate,
          durationDays,
          milestoneCount: v.milestones.length,
          isActive: !v.publicReleaseDate,
          milestones,
        };
      });
  }, [data, selectedPlatform, showActive, showReleased]);

  const sorted = useMemo(() => {
    const s = [...bars];
    switch (sortBy) {
      case "date":
        s.sort((a, b) => b.startDate.localeCompare(a.startDate));
        break;
      case "duration":
        s.sort((a, b) => b.durationDays - a.durationDays);
        break;
      case "betas":
        s.sort((a, b) => b.milestoneCount - a.milestoneCount);
        break;
      case "platform":
        s.sort(
          (a, b) =>
            a.platform.sortOrder - b.platform.sortOrder ||
            b.startDate.localeCompare(a.startDate)
        );
        break;
    }
    return s;
  }, [bars, sortBy]);

  const grouped = useMemo(() => {
    if (groupBy === "none") return [{ key: "all", label: "All Versions", items: sorted }];

    const map = new Map<string, VersionBar[]>();
    for (const bar of sorted) {
      let key: string;
      if (groupBy === "year") {
        key = bar.startDate.slice(0, 4);
      } else {
        key = bar.platform.name;
      }
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(bar);
    }

    const entries = Array.from(map.entries()).map(([key, items]) => ({
      key,
      label: groupBy === "year" ? key : key,
      items,
    }));

    if (groupBy === "year") {
      entries.sort((a, b) => b.key.localeCompare(a.key));
    }

    return entries;
  }, [sorted, groupBy]);

  // Use 90th percentile as effective max so outliers don't crush everything
  const effectiveMax = useMemo(() => {
    if (bars.length === 0) return 1;
    const durations = bars.map((b) => b.durationDays).sort((a, b) => a - b);
    const p90Index = Math.floor(durations.length * 0.9);
    return Math.max(durations[p90Index], 30);
  }, [bars]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-label">Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg"
          >
            <option value="all">All</option>
            {platforms.map((p) => (
              <option key={p._id} value={p.slug.current}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-label">Sort</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-3 py-1.5 text-sm rounded-lg"
          >
            <option value="date">Most Recent</option>
            <option value="duration">Longest Cycle</option>
            <option value="betas">Most Betas</option>
            <option value="platform">By Platform</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-label">Group</label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupKey)}
            className="px-3 py-1.5 text-sm rounded-lg"
          >
            <option value="year">By Year</option>
            <option value="platform">By Platform</option>
            <option value="none">Ungrouped</option>
          </select>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showActive}
              onChange={(e) => setShowActive(e.target.checked)}
              className="accent-[var(--milestone-beta)]"
            />
            <span className="text-[var(--milestone-beta)]">Active</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showReleased}
              onChange={(e) => setShowReleased(e.target.checked)}
              className="accent-[var(--milestone-public)]"
            />
            <span className="text-[var(--milestone-public)]">Released</span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-px bg-[var(--border)] rounded-xl overflow-hidden">
        <div className="bg-[var(--bg)] text-center py-4 px-3">
          <div className="stat-value text-lg">{bars.length}</div>
          <div className="stat-label">Versions</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-4 px-3">
          <div className="stat-value text-lg">
            {bars.filter((b) => b.isActive).length}
          </div>
          <div className="stat-label">In Beta</div>
        </div>
        <div className="bg-[var(--bg)] text-center py-4 px-3">
          <div className="stat-value text-lg">
            {bars.length > 0
              ? Math.round(
                  bars.reduce((s, b) => s + b.durationDays, 0) / bars.length
                )
              : 0}
            d
          </div>
          <div className="stat-label">Avg. Cycle</div>
        </div>
      </div>

      {/* Timeline groups */}
      {grouped.map((group) => (
        <section key={group.key}>
          {groupBy !== "none" && (
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-subheading text-[var(--text-secondary)]">
                {group.label}
              </h2>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-label">{group.items.length} versions</span>
            </div>
          )}

          <div className="surface overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-36">Version</th>
                  <th className="hidden sm:table-cell w-24">Started</th>
                  <th className="hidden md:table-cell w-20 text-right">Days</th>
                  <th className="hidden sm:table-cell w-16 text-right">Betas</th>
                  <th>Cycle</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((bar) => (
                  <tr key={bar.id}>
                    <td>
                      <Link
                        href={`/${bar.slug}/${bar.version}`}
                        className="flex items-center gap-2 group"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: bar.platform.color }}
                        />
                        <span className="font-medium text-sm group-hover:text-[var(--accent)] transition-colors">
                          {bar.platform.name}
                        </span>
                        <span className="font-mono text-sm text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                          {bar.version}
                        </span>
                        {bar.isActive && (
                          <span className="badge badge-active text-[0.5rem] py-0 px-1.5">
                            ACTIVE
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="hidden sm:table-cell text-[var(--text-secondary)] text-xs">
                      {formatDate(bar.startDate)}
                    </td>
                    <td className="hidden md:table-cell text-right font-mono text-sm text-[var(--text-secondary)]">
                      {bar.durationDays}
                    </td>
                    <td className="hidden sm:table-cell text-right font-mono text-sm text-[var(--text-secondary)]">
                      {bar.milestoneCount}
                    </td>
                    <td>
                      <GanttBar bar={bar} effectiveMax={effectiveMax} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

function GanttBar({
  bar,
  effectiveMax,
}: {
  bar: VersionBar;
  effectiveMax: number;
}) {
  // Clamp ratio at 1.0 (outliers past p90 just fill the bar)
  const ratio = Math.min(bar.durationDays / effectiveMax, 1);
  // Square-root scale so short bars still have visual weight
  const widthPct = Math.max(6, Math.sqrt(ratio) * 100);

  return (
    <div
      className="relative h-7 flex items-center"
      title={`${bar.durationDays} days, ${bar.milestoneCount} milestones`}
    >
      {/* Background track */}
      <div className="absolute inset-y-0.5 left-0 right-0 rounded bg-[var(--bg-subtle)]" />

      {/* Duration bar */}
      <div
        className="relative h-6 rounded"
        style={{
          width: `${widthPct}%`,
          background: bar.isActive
            ? `linear-gradient(90deg, ${bar.platform.color}25, ${bar.platform.color}60)`
            : `linear-gradient(90deg, ${bar.platform.color}50, ${bar.platform.color}99)`,
          boxShadow: bar.durationDays > 30
            ? `0 0 12px ${bar.platform.color}20`
            : undefined,
        }}
      >
        {/* Milestone markers */}
        {bar.milestones.map((m, i) => {
          const isEnd = m.type === "public" || m.type === "gm";
          const isRC = m.type === "rc";
          return (
            <div
              key={i}
              className="absolute top-0 bottom-0"
              style={{
                left: `${m.pct}%`,
                width: isEnd ? "3px" : isRC ? "2px" : "1px",
                transform: "translateX(-50%)",
                background: isEnd
                  ? "var(--milestone-public)"
                  : isRC
                    ? "var(--milestone-rc)"
                    : "rgba(255,255,255,0.3)",
              }}
              title={`${m.label} — ${formatDate(m.date)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
