"use client";

import type { BetaMilestone } from "@/lib/types";
import { formatDate, getMilestoneType } from "@/lib/utils";

interface MilestoneTimelineProps {
  milestones: BetaMilestone[];
}

const TYPE_COLORS = {
  beta: "var(--milestone-beta)",
  rc: "var(--milestone-rc)",
  public: "var(--milestone-public)",
  gm: "var(--milestone-public)",
};

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (!milestones?.length) {
    return (
      <p className="text-[var(--text-tertiary)]">No releases recorded.</p>
    );
  }

  return (
    <div className="relative pl-8">
      {/* Vertical connector line */}
      <div className="absolute left-[9px] top-3 bottom-3 w-px bg-[var(--border)]" />

      {milestones.map((m, i) => {
        const type = getMilestoneType(m.label);
        const color = TYPE_COLORS[type] || TYPE_COLORS.beta;
        const isFilled = type === "public" || type === "gm";

        return (
          <div
            key={m._key || i}
            className="relative flex items-start gap-4 py-2.5 animate-in"
            style={{ "--delay": i } as React.CSSProperties}
          >
            {/* Dot */}
            <div
              className="absolute left-[-23px] top-[13px] w-[18px] h-[18px] rounded-full border-2 shrink-0 z-10"
              style={{
                borderColor: color,
                background: isFilled ? color : "var(--bg)",
              }}
            />

            {/* Content */}
            <div className="flex-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span
                className="font-semibold text-sm"
                style={{ color }}
              >
                {m.label}
                {m.isRevision && (
                  <span className="text-[var(--text-tertiary)] text-xs font-normal ml-1">
                    (rev)
                  </span>
                )}
              </span>
              <span className="font-mono text-sm text-[var(--text-secondary)]">
                {formatDate(m.date)}
              </span>
              {m.note && (
                <span className="text-xs text-[var(--text-tertiary)] italic">
                  {m.note}
                </span>
              )}
              {m.sourceUrl && (
                <a
                  href={m.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  {m.sourceLabel || "Source"} &rarr;
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
