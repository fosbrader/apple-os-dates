"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatDate, getMilestoneType, daysBetween } from "@/lib/utils";
import { sendAnalyticsEvent } from "@/lib/analytics";
import { releaseVersionPath } from "@/lib/release-routes";
import type {
  TimelineBar,
  TimelineViewModel,
} from "@/lib/view-models/timeline";
import {
  indexPlatformsBySlug,
  resolvePlatform,
  type ViewModelPlatform,
} from "@/lib/view-models/platforms";

type SortKey = "date" | "duration" | "betas" | "platform";
type GroupKey = "year" | "platform" | "none";

const timelineDataUrl = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/timeline/data/`;

function isTimelineViewModel(value: unknown): value is TimelineViewModel {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<TimelineViewModel>;
  return Array.isArray(candidate.bars) && Array.isArray(candidate.platforms);
}

export function TimelineView() {
  const [timeline, setTimeline] = useState<TimelineViewModel | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTimeline() {
      try {
        const response = await fetch(timelineDataUrl, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Timeline request failed with ${response.status}`);
        }

        const payload: unknown = await response.json();
        if (!isTimelineViewModel(payload)) {
          throw new Error("Timeline response has an unexpected shape");
        }

        setTimeline(payload);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Timeline data request failed", error);
          setHasError(true);
        }
      }
    }

    void loadTimeline();

    return () => controller.abort();
  }, []);

  if (hasError) {
    return (
      <div className="content-notice" role="alert">
        <h2>Interactive timeline is temporarily unavailable</h2>
        <p className="content-notice__body">
          The release archive remains available from the{" "}
          <Link href="/apple/">Apple catalog</Link>.
        </p>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="content-notice" role="status" aria-live="polite">
        <h2>Loading the full release timeline…</h2>
        <p className="content-notice__body">
          The archive summary and platform links remain available while the
          interactive comparison loads.
        </p>
      </div>
    );
  }

  return <TimelineDataView {...timeline} />;
}

function MobileTimelineCard({
  bar,
  platform,
}: {
  bar: TimelineBar;
  platform: ViewModelPlatform;
}) {
  const isActive = bar.releaseStatus === "active";

  return (
    <Link
      href={releaseVersionPath(bar.platformSlug, bar.version)}
      className="mobile-timeline-card"
    >
      <span className="mobile-timeline-card__header">
        <span className="mobile-timeline-card__identity">
          <i aria-hidden="true" style={{ background: platform.color }} />
          <strong>{platform.name}</strong>
          <span className="font-mono">{bar.version}</span>
        </span>
        <span
          className={
            isActive ? "badge badge-active" : "mobile-timeline-card__status"
          }
        >
          {bar.releaseStatus === "active"
            ? "Active"
            : bar.releaseStatus === "released"
              ? "Released"
              : "Superseded"}
        </span>
      </span>
      <dl className="mobile-timeline-card__metrics">
        <div>
          <dt>Started</dt>
          <dd>{formatDate(bar.startDate)}</dd>
        </div>
        <div>
          <dt>
            {bar.releaseStatus === "active"
              ? "Through"
              : bar.releaseStatus === "released"
                ? "Public"
                : "Last seed"}
          </dt>
          <dd>{isActive ? "Today" : formatDate(bar.endDate)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd className="font-mono">{bar.durationDays} days</dd>
        </div>
        <div>
          <dt>Milestones</dt>
          <dd className="font-mono">{bar.milestoneCount}</dd>
        </div>
      </dl>
    </Link>
  );
}

function TimelineTableRow({
  bar,
  platform,
  effectiveMax,
}: {
  bar: TimelineBar;
  platform: ViewModelPlatform;
  effectiveMax: number;
}) {
  return (
    <tr>
      <td>
        <Link
          href={releaseVersionPath(bar.platformSlug, bar.version)}
          className="flex items-center gap-2 group"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: platform.color }}
          />
          <span className="font-medium text-sm group-hover:text-[var(--accent)] transition-colors">
            {platform.name}
          </span>
          <span className="font-mono text-sm text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
            {bar.version}
          </span>
          {bar.releaseStatus === "active" && (
            <span className="badge badge-active text-[0.5rem] py-0 px-1.5">
              ACTIVE
            </span>
          )}
          {bar.releaseStatus === "superseded" && (
            <span className="font-mono text-[0.5rem] uppercase tracking-wide text-[var(--text-tertiary)]">
              SUPERSEDED
            </span>
          )}
        </Link>
      </td>
      <td className="text-[var(--text-secondary)] text-xs">
        {formatDate(bar.startDate)}
      </td>
      <td className="text-right font-mono text-sm text-[var(--text-secondary)]">
        {bar.durationDays}
      </td>
      <td className="text-right font-mono text-sm text-[var(--text-secondary)]">
        {bar.milestoneCount}
      </td>
      <td>
        <GanttBar
          bar={bar}
          platformColor={platform.color}
          effectiveMax={effectiveMax}
        />
      </td>
    </tr>
  );
}

export function TimelineDataView({ bars, platforms }: TimelineViewModel) {
  const platformsBySlug = useMemo(
    () => indexPlatformsBySlug(platforms),
    [platforms]
  );
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [groupBy, setGroupBy] = useState<GroupKey>("year");
  const [showActive, setShowActive] = useState(true);
  const [showReleased, setShowReleased] = useState(true);
  const [showSuperseded, setShowSuperseded] = useState(true);

  const visibleBars = useMemo(
    () =>
      bars
        .filter(
          (bar) =>
            selectedPlatform === "all" || bar.platformSlug === selectedPlatform
        )
        .filter((bar) => {
          if (bar.releaseStatus === "active" && !showActive) return false;
          if (bar.releaseStatus === "released" && !showReleased) return false;
          if (bar.releaseStatus === "superseded" && !showSuperseded)
            return false;
          return true;
        }),
    [bars, selectedPlatform, showActive, showReleased, showSuperseded]
  );

  const sorted = useMemo(() => {
    const s = [...visibleBars];
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
            resolvePlatform(platformsBySlug, a.platformSlug).sortOrder -
              resolvePlatform(platformsBySlug, b.platformSlug).sortOrder ||
            b.startDate.localeCompare(a.startDate)
        );
        break;
    }
    return s;
  }, [visibleBars, sortBy, platformsBySlug]);

  const grouped = useMemo(() => {
    if (groupBy === "none") return [{ key: "all", label: "All Versions", items: sorted }];

    const map = new Map<string, TimelineBar[]>();
    for (const bar of sorted) {
      let key: string;
      if (groupBy === "year") {
        key = bar.startDate.slice(0, 4);
      } else {
        key = resolvePlatform(platformsBySlug, bar.platformSlug).name;
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
  }, [sorted, groupBy, platformsBySlug]);

  // Use 90th percentile as effective max so outliers don't crush everything
  const effectiveMax = useMemo(() => {
    if (visibleBars.length === 0) return 1;
    const durations = visibleBars
      .map((bar) => bar.durationDays)
      .sort((a, b) => a - b);
    const p90Index = Math.floor(durations.length * 0.9);
    return Math.max(durations[p90Index], 30);
  }, [visibleBars]);
  const completedBars = visibleBars.filter(
    (bar) => bar.releaseStatus === "released",
  );
  const averageCompletedCycle =
    completedBars.length > 0
      ? `${Math.round(
          completedBars.reduce(
            (sum, bar) => sum + bar.durationDays,
            0,
          ) / completedBars.length,
        )}d`
      : "—";

  return (
    <div className="space-y-6">
      <div className="filter-bar">
        <div className="filter-control">
          <label className="text-label" htmlFor="timeline-platform">
            Platform
          </label>
          <select
            id="timeline-platform"
            value={selectedPlatform}
            onChange={(event) => {
              const platform = event.target.value;
              setSelectedPlatform(platform);
              sendAnalyticsEvent("platform_filter", { platform });
            }}
            className="filter-control__input"
          >
            <option value="all">All</option>
            {platforms.map((platform) => (
              <option key={platform.slug} value={platform.slug}>
                {platform.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label className="text-label" htmlFor="timeline-sort">
            Sort
          </label>
          <select
            id="timeline-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="filter-control__input"
          >
            <option value="date">Most Recent</option>
            <option value="duration">Longest Cycle</option>
            <option value="betas">Most Milestones</option>
            <option value="platform">By Platform</option>
          </select>
        </div>
        <div className="filter-control">
          <label className="text-label" htmlFor="timeline-group">
            Group
          </label>
          <select
            id="timeline-group"
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupKey)}
            className="filter-control__input"
          >
            <option value="year">By Year</option>
            <option value="platform">By Platform</option>
            <option value="none">Ungrouped</option>
          </select>
        </div>
        <fieldset className="filter-toggles">
          <legend className="sr-only">Release status</legend>
          <label>
            <input
              type="checkbox"
              checked={showActive}
              onChange={(e) => setShowActive(e.target.checked)}
              className="accent-[var(--milestone-beta)]"
            />
            <span>Active</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showReleased}
              onChange={(e) => setShowReleased(e.target.checked)}
              className="accent-[var(--milestone-public)]"
            />
            <span>Released</span>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showSuperseded}
              onChange={(e) => setShowSuperseded(e.target.checked)}
              className="accent-[var(--text-tertiary)]"
            />
            <span>Superseded</span>
          </label>
        </fieldset>
      </div>

      <div className="timeline-legend" aria-label="Milestone legend">
        <span>
          <i className="timeline-legend__mark timeline-legend__mark--beta" />
          Beta
        </span>
        <span>
          <i className="timeline-legend__mark timeline-legend__mark--rc" />
          Release candidate
        </span>
        <span>
          <i className="timeline-legend__mark timeline-legend__mark--public" />
          Public
        </span>
      </div>

      <dl className="metric-rail metric-rail--three" aria-label="Timeline summary">
        <div className="metric-rail__item">
          <dt className="stat-label">Versions</dt>
          <dd className="stat-value text-lg">{visibleBars.length}</dd>
        </div>
        <div className="metric-rail__item">
          <dt className="stat-label">Active cycles</dt>
          <dd className="stat-value text-lg">
            {visibleBars.filter((bar) => bar.releaseStatus === "active").length}
          </dd>
        </div>
        <div className="metric-rail__item">
          <dt className="stat-label">Avg. completed cycle</dt>
          <dd className="stat-value text-lg">{averageCompletedCycle}</dd>
        </div>
      </dl>

      {/* Timeline groups */}
      {grouped.map((group, groupIndex) => (
        <section key={group.key}>
          {groupBy !== "none" && (
            <div className="desktop-timeline-group-heading flex items-center gap-3 mb-3">
              <h2 className="text-subheading text-[var(--text-secondary)]">
                {group.label}
              </h2>
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-label">
                {group.items.length} versions
              </span>
            </div>
          )}

          <details
            className="mobile-timeline-group"
            open={
              groupIndex === 0 ||
              group.items.some((item) => item.releaseStatus === "active")
            }
          >
            <summary>
              <span>{groupBy === "none" ? "All versions" : group.label}</span>
              <small>{group.items.length} versions</small>
            </summary>
            <div
              className="mobile-timeline-list"
              aria-label={`Release timeline for ${group.label}`}
            >
              {group.items.slice(0, 8).map((bar) => (
                <MobileTimelineCard
                  key={bar.id}
                  bar={bar}
                  platform={resolvePlatform(platformsBySlug, bar.platformSlug)}
                />
              ))}
              {group.items.length > 8 && (
                <details className="mobile-timeline-list__more">
                  <summary>
                    Show {group.items.length - 8} more versions
                  </summary>
                  <div>
                    {group.items.slice(8).map((bar) => (
                      <MobileTimelineCard
                        key={bar.id}
                        bar={bar}
                        platform={resolvePlatform(
                          platformsBySlug,
                          bar.platformSlug
                        )}
                      />
                    ))}
                  </div>
                </details>
              )}
            </div>
          </details>

          <div className="desktop-timeline-table">
            <div
              className="surface horizontal-scroll horizontal-scroll--table horizontal-scroll--wide overflow-x-auto"
              role="region"
              aria-label={`Scrollable release timeline for ${group.label}`}
              tabIndex={0}
            >
              <table className="data-table timeline-table">
                <caption className="sr-only">
                  Release cycle durations and recorded milestones for{" "}
                  {group.label}
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-36">Version</th>
                    <th scope="col" className="w-24">Started</th>
                    <th scope="col" className="w-20 text-right">Days</th>
                    <th scope="col" className="w-20 text-right">Milestones</th>
                    <th scope="col">Relative cycle</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((bar) => (
                    <TimelineTableRow
                      key={bar.id}
                      bar={bar}
                      platform={resolvePlatform(
                        platformsBySlug,
                        bar.platformSlug
                      )}
                      effectiveMax={effectiveMax}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <p className="horizontal-scroll__hint horizontal-scroll__hint--wide">
              <span aria-hidden="true">↔</span>
              Scroll horizontally to compare every cycle field.
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}

function GanttBar({
  bar,
  platformColor,
  effectiveMax,
}: {
  bar: TimelineBar;
  platformColor: string;
  effectiveMax: number;
}) {
  // Clamp ratio at 1.0 (outliers past p90 just fill the bar)
  const ratio = Math.min(bar.durationDays / effectiveMax, 1);
  // Square-root scale so short bars still have visual weight
  const widthPct = Math.max(6, Math.sqrt(ratio) * 100);
  const markers = bar.milestones.map(([label, date]) => ({
    label,
    date,
    type: getMilestoneType(label),
    pct: Math.max(
      0,
      Math.min(
        100,
        (daysBetween(bar.startDate, date) / bar.durationDays) * 100
      )
    ),
  }));

  return (
    <div
      className="relative h-7 flex items-center"
      title={`${bar.durationDays} days, ${bar.milestoneCount} milestones`}
      role="img"
      aria-label={`${bar.durationDays} day cycle with ${bar.milestoneCount} milestones: ${bar.milestones
        .map(([label, date]) => `${label} on ${formatDate(date)}`)
        .join(", ")}`}
    >
      {/* Background track */}
      <div className="absolute inset-y-0.5 left-0 right-0 bg-[var(--bg-subtle)]" />

      {/* Duration bar */}
      <div
        className="relative h-6"
        style={{
          width: `${widthPct}%`,
          background: `color-mix(in srgb, ${platformColor} ${
            bar.releaseStatus === "active" ? 18 : 34
          }%, transparent)`,
          borderLeft: `2px solid ${platformColor}`,
        }}
      >
        {/* Milestone markers */}
        {markers.map((m, i) => {
          const isEnd = m.type === "public" || m.type === "gm";
          const isRC = m.type === "rc";
          return (
            <div
              key={i}
              aria-hidden="true"
              className="absolute top-0 bottom-0"
              style={{
                left: `${m.pct}%`,
                width: isEnd ? "3px" : isRC ? "2px" : "1px",
                transform: "translateX(-50%)",
                background: isEnd
                  ? "var(--milestone-public)"
                  : isRC
                    ? "var(--milestone-rc)"
                    : "var(--text-tertiary)",
              }}
              title={`${m.label} — ${formatDate(m.date)}`}
            />
          );
        })}
      </div>
    </div>
  );
}
