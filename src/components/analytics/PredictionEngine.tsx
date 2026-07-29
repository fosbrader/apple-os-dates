"use client";

import { useMemo } from "react";
import {
  isActiveRelease,
  isReleasedRelease,
  type ReleaseVersion,
} from "@/lib/types";
import { computeAverageBetaInterval, formatDate } from "@/lib/utils";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { addDays, format } from "date-fns";

interface PredictionEngineProps {
  activeBetas: ReleaseVersion[];
  historicalData: ReleaseVersion[];
}

interface Prediction {
  version: ReleaseVersion;
  nextBetaDate: string;
  estimatedPublicDate: string;
  confidence: "high" | "medium" | "low";
}

const CONFIDENCE_STYLES = {
  high: { bg: "rgba(48, 209, 88, 0.12)", color: "var(--milestone-public)" },
  medium: { bg: "rgba(255, 159, 10, 0.12)", color: "var(--milestone-rc)" },
  low: { bg: "rgba(255, 59, 48, 0.12)", color: "#ff3b30" },
};

export function PredictionEngine({
  activeBetas,
  historicalData,
}: PredictionEngineProps) {
  const predictions = useMemo(() => {
    const completedIntervals = historicalData
      .filter(
        (v) =>
          isReleasedRelease(v) &&
          v.publicReleaseDate &&
          v.milestones?.length >= 3,
      )
      .map((v) => computeAverageBetaInterval(v.milestones))
      .filter((i): i is number => i !== null);

    const globalAvgInterval =
      completedIntervals.length > 0
        ? completedIntervals.reduce((a, b) => a + b, 0) / completedIntervals.length
        : 14;

    const majorCycleDays = historicalData
      .filter(
        (v) =>
          isReleasedRelease(v) &&
          v.version.endsWith(".0") &&
          v.publicReleaseDate &&
          v.milestones?.length >= 3,
      )
      .map((v) => {
        const first = new Date(v.milestones[0].date);
        const pub = new Date(v.publicReleaseDate!);
        return (pub.getTime() - first.getTime()) / 86400000;
      })
      .filter((d) => d > 0);

    const avgMajorCycle =
      majorCycleDays.length > 0
        ? majorCycleDays.reduce((a, b) => a + b, 0) / majorCycleDays.length
        : 98;

    const minorCycleDays = historicalData
      .filter(
        (v) =>
          isReleasedRelease(v) &&
          !v.version.endsWith(".0") &&
          v.publicReleaseDate &&
          v.milestones?.length >= 2,
      )
      .map((v) => {
        const first = new Date(v.milestones[0].date);
        const pub = new Date(v.publicReleaseDate!);
        return (pub.getTime() - first.getTime()) / 86400000;
      })
      .filter((d) => d > 0);

    const avgMinorCycle =
      minorCycleDays.length > 0
        ? minorCycleDays.reduce((a, b) => a + b, 0) / minorCycleDays.length
        : 42;

    return activeBetas.filter(isActiveRelease).map((beta): Prediction => {
      const lastMilestone = beta.milestones[beta.milestones.length - 1];
      const lastDate = new Date(lastMilestone.date);
      const localAvg = computeAverageBetaInterval(beta.milestones);
      const interval = localAvg || Math.round(globalAvgInterval);
      const nextDate = addDays(lastDate, interval);
      const nextBetaDate = format(nextDate, "yyyy-MM-dd");
      const isMajor = beta.version.endsWith(".0");
      const expectedCycle = isMajor ? avgMajorCycle : avgMinorCycle;
      const firstDate = new Date(beta.milestones[0].date);
      const estimatedPublicDate = format(addDays(firstDate, expectedCycle), "yyyy-MM-dd");
      const confidence: "high" | "medium" | "low" =
        beta.milestones.length >= 4 ? "high" : beta.milestones.length >= 2 ? "medium" : "low";
      return { version: beta, nextBetaDate, estimatedPublicDate, confidence };
    });
  }, [activeBetas, historicalData]);

  if (predictions.length === 0) {
    return <p className="text-[var(--text-tertiary)]">No active betas to predict.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {predictions.map((pred) => {
        const platform = pred.version.releaseTrain.platform;
        const style = CONFIDENCE_STYLES[pred.confidence];
        return (
          <div
            key={pred.version._id}
            className="card card-platform"
            style={{ "--platform-color": platform.color } as React.CSSProperties}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="badge badge-platform text-[0.625rem]"
                style={{ "--platform-color": platform.color } as React.CSSProperties}
              >
                {platform.name}
              </span>
              <span className="font-semibold font-mono">{pred.version.version}</span>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: style.bg, color: style.color }}
              >
                {pred.confidence}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-label mb-1">Next Beta (predicted)</p>
                <p className="text-sm font-medium font-mono">{formatDate(pred.nextBetaDate)}</p>
                <CountdownTimer targetDate={pred.nextBetaDate} label="Countdown" />
              </div>
              <div>
                <p className="text-label mb-1">Est. Public Release</p>
                <p className="text-sm font-medium font-mono">{formatDate(pred.estimatedPublicDate)}</p>
                <CountdownTimer targetDate={pred.estimatedPublicDate} label="Countdown" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
