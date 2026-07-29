"use client";

import type { BetaMilestone } from "@/lib/types";
import { daysBetween, formatDate, getMilestoneType } from "@/lib/utils";

interface MilestoneTimelineProps {
  milestones: BetaMilestone[];
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  if (!milestones?.length) {
    return (
      <p className="text-[var(--text-tertiary)]">No milestones recorded.</p>
    );
  }

  return (
    <ol className="milestone-ledger">
      {milestones.map((milestone, index) => {
        const type = getMilestoneType(milestone.label);
        const previous = index > 0 ? milestones[index - 1] : null;
        const interval = previous
          ? daysBetween(previous.date, milestone.date)
          : null;

        return (
          <li
            key={milestone._key || index}
            className="milestone-ledger__item animate-in"
            style={{ "--delay": index } as React.CSSProperties}
          >
            <div className="milestone-ledger__rail" aria-hidden="true">
              <span
                className={`milestone-ledger__mark milestone-ledger__mark--${type}`}
              />
            </div>

            <div className="milestone-ledger__content">
              <div className="milestone-ledger__heading">
                <div>
                  <span className="milestone-ledger__type">
                    {type === "public" || type === "gm"
                      ? "Public milestone"
                      : type === "rc"
                        ? "Release candidate"
                        : "Beta milestone"}
                  </span>
                  <h3>
                    {milestone.label}
                    {milestone.isRevision && (
                      <span className="milestone-ledger__revision">
                        Revision
                      </span>
                    )}
                  </h3>
                </div>
                <time dateTime={milestone.date}>
                  {formatDate(milestone.date)}
                </time>
              </div>

              {(milestone.note || milestone.sourceUrl || interval !== null) && (
                <div className="milestone-ledger__meta">
                  {interval !== null && (
                    <span>
                      +{interval} {interval === 1 ? "day" : "days"}
                    </span>
                  )}
                  {milestone.note && <p>{milestone.note}</p>}
                  {milestone.sourceUrl && (
                    <a
                      href={milestone.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {milestone.sourceLabel || "Source"}
                      <span aria-hidden="true"> ↗</span>
                      <span className="sr-only"> (opens in a new window)</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
