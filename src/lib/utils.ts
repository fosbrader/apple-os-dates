import { format, formatDistanceToNow, differenceInDays, parseISO } from "date-fns";
import type { BetaMilestone, ReleaseVersion } from "./types";

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d");
}

export function timeAgo(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function daysBetween(date1: string, date2: string): number {
  return differenceInDays(parseISO(date2), parseISO(date1));
}

export function getMilestoneType(
  label: string
): "beta" | "rc" | "public" | "gm" {
  const lower = label.toLowerCase();
  if (lower === "public") return "public";
  if (lower === "gm") return "gm";
  if (lower.startsWith("rc")) return "rc";
  return "beta";
}

export function getMilestoneColor(label: string): string {
  const type = getMilestoneType(label);
  switch (type) {
    case "beta":
      return "var(--color-beta)";
    case "rc":
      return "var(--color-rc)";
    case "public":
    case "gm":
      return "var(--color-public)";
  }
}

export function computeBetaCycleDays(version: ReleaseVersion): number | null {
  if (!version.milestones?.length || !version.publicReleaseDate) return null;
  const firstBeta = version.milestones[0];
  if (getMilestoneType(firstBeta.label) !== "beta") return null;

  const duration = daysBetween(firstBeta.date, version.publicReleaseDate);
  return duration > 0 ? duration : null;
}

export function computeAverageBetaInterval(
  milestones: BetaMilestone[]
): number | null {
  if (milestones.length < 2) return null;
  let totalDays = 0;
  let count = 0;
  for (let i = 1; i < milestones.length; i++) {
    const days = daysBetween(milestones[i - 1].date, milestones[i].date);
    if (days > 0) {
      totalDays += days;
      count++;
    }
  }
  return count > 0 ? Math.round(totalDays / count) : null;
}

export function getPlatformColor(platformName: string): string {
  const colors: Record<string, string> = {
    iOS: "var(--color-ios)",
    iPadOS: "var(--color-ipados)",
    macOS: "var(--color-macos)",
    watchOS: "var(--color-watchos)",
    tvOS: "var(--color-tvos)",
    visionOS: "var(--color-visionos)",
  };
  return colors[platformName] || "var(--color-muted)";
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}
