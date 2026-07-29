import type { ReleaseStatus } from "./apple-note-parser";

export interface ReleaseDataMilestone {
  label: string;
  date: string;
  note?: string;
  build?: string;
  channel?: string;
  deviceScope?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  isRevision: boolean;
}

export interface ReleaseDataVersion {
  platform: string;
  majorVersion: number;
  version: string;
  releaseStatus?: ReleaseStatus;
  milestones: ReleaseDataMilestone[];
  publicReleaseDate?: string;
  versionNote?: string;
  releaseNotesUrl?: string;
}

export interface ReleaseData {
  platforms: {
    name: string;
    slug: string;
    color: string;
    sortOrder: number;
  }[];
  releaseTrains: {
    platform: string;
    majorVersion: number;
    displayName: string;
    releaseYear: number;
  }[];
  releaseVersions: ReleaseDataVersion[];
}

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  severity: ValidationSeverity;
  code: string;
  path: string;
  message: string;
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

function normalized(value: string | undefined): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function effectiveStatus(version: ReleaseDataVersion): ReleaseStatus {
  return (
    version.releaseStatus ||
    (version.publicReleaseDate ? "released" : "active")
  );
}

function firstTrainYear(
  versions: ReleaseDataVersion[],
  platform: string,
  majorVersion: number,
): number | undefined {
  const candidates = versions.filter(
    (version) =>
      version.platform === platform &&
      version.majorVersion === majorVersion,
  );
  const publicDates = candidates
    .flatMap((version) =>
      version.publicReleaseDate ? [version.publicReleaseDate] : [],
    )
    .filter(isIsoDate)
    .sort();
  if (publicDates[0]) return Number(publicDates[0].slice(0, 4));

  const milestoneDates = candidates
    .flatMap((version) =>
      version.milestones.map((milestone) => milestone.date),
    )
    .filter(isIsoDate)
    .sort();
  return milestoneDates[0]
    ? Number(milestoneDates[0].slice(0, 4))
    : undefined;
}

export function validateReleaseData(data: ReleaseData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const trainKeys = new Set<string>();

  for (const [index, train] of data.releaseTrains.entries()) {
    const path = `releaseTrains[${index}]`;
    const key = `${train.platform}|${train.majorVersion}`;
    if (trainKeys.has(key)) {
      issues.push({
        severity: "error",
        code: "duplicate-train",
        path,
        message: `Duplicate release train ${key}.`,
      });
    }
    trainKeys.add(key);

    const expectedYear = firstTrainYear(
      data.releaseVersions,
      train.platform,
      train.majorVersion,
    );
    if (expectedYear !== undefined && train.releaseYear !== expectedYear) {
      issues.push({
        severity: "error",
        code: "release-year-mismatch",
        path: `${path}.releaseYear`,
        message: `${key} uses ${train.releaseYear}; earliest release evidence is ${expectedYear}.`,
      });
    }
  }

  const versionKeys = new Set<string>();
  for (const [versionIndex, version] of data.releaseVersions.entries()) {
    const path = `releaseVersions[${versionIndex}]`;
    const key = `${version.platform}|${version.version}`;
    const trainKey = `${version.platform}|${version.majorVersion}`;

    if (versionKeys.has(key)) {
      issues.push({
        severity: "error",
        code: "duplicate-version",
        path,
        message: `Duplicate platform/version record ${key}.`,
      });
    }
    versionKeys.add(key);

    if (!trainKeys.has(trainKey)) {
      issues.push({
        severity: "error",
        code: "missing-train",
        path: `${path}.majorVersion`,
        message: `${key} has no matching ${trainKey} release train.`,
      });
    }

    const versionMajor = Number.parseInt(version.version.split(".")[0], 10);
    if (versionMajor !== version.majorVersion) {
      issues.push({
        severity: "error",
        code: "major-version-mismatch",
        path: `${path}.majorVersion`,
        message: `${key} declares majorVersion ${version.majorVersion}.`,
      });
    }

    if (!version.milestones.length) {
      issues.push({
        severity: "error",
        code: "empty-milestones",
        path: `${path}.milestones`,
        message: `${key} has no milestones.`,
      });
    }

    const milestoneIdentities = new Set<string>();
    let previousDate = "";
    for (const [milestoneIndex, milestone] of version.milestones.entries()) {
      const milestonePath = `${path}.milestones[${milestoneIndex}]`;
      if (!isIsoDate(milestone.date)) {
        issues.push({
          severity: "error",
          code: "invalid-date",
          path: `${milestonePath}.date`,
          message: `${key} ${milestone.label} has invalid date ${milestone.date}.`,
        });
      } else if (previousDate && milestone.date < previousDate) {
        issues.push({
          severity: "error",
          code: "milestone-order",
          path: milestonePath,
          message: `${key} ${milestone.label} is out of chronological order.`,
        });
      }
      previousDate = milestone.date;

      const identity = [
        normalized(milestone.label),
        milestone.date,
        normalized(milestone.build),
        normalized(milestone.note),
      ].join("|");
      if (milestoneIdentities.has(identity)) {
        issues.push({
          severity: "error",
          code: "duplicate-milestone",
          path: milestonePath,
          message: `${key} repeats ${milestone.label} on ${milestone.date}.`,
        });
      }
      milestoneIdentities.add(identity);

      const requiresRevision =
        /^Beta\b.*v\d+\b/i.test(milestone.label) ||
        /\bupdate\b/i.test(milestone.label);
      const forbidsRevision =
        /^Beta\s+\d+$/i.test(milestone.label) ||
        /^(?:Public(?: Beta(?: \d+)?)?|GM)$/i.test(milestone.label);
      if (
        (requiresRevision && !milestone.isRevision) ||
        (forbidsRevision && milestone.isRevision)
      ) {
        issues.push({
          severity: "error",
          code: "revision-flag-mismatch",
          path: `${milestonePath}.isRevision`,
          message: `${key} ${milestone.label} has an inconsistent isRevision flag.`,
        });
      }

      if (Boolean(milestone.sourceUrl) !== Boolean(milestone.sourceLabel)) {
        issues.push({
          severity: "error",
          code: "source-pair-mismatch",
          path: milestonePath,
          message: `${key} ${milestone.label} must pair sourceUrl with sourceLabel.`,
        });
      }
      if (
        milestone.sourceUrl &&
        !/^https:\/\/\S+$/i.test(milestone.sourceUrl)
      ) {
        issues.push({
          severity: "error",
          code: "invalid-source-url",
          path: `${milestonePath}.sourceUrl`,
          message: `${key} ${milestone.label} uses a non-HTTPS source URL.`,
        });
      }
    }

    if (
      version.releaseNotesUrl &&
      !/^https:\/\/\S+$/i.test(version.releaseNotesUrl)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-release-notes-url",
        path: `${path}.releaseNotesUrl`,
        message: `${key} uses a non-HTTPS release-notes URL.`,
      });
    }

    const publicMilestones = version.milestones.filter(
      (milestone) => normalized(milestone.label) === "public",
    );
    const gmMilestones = version.milestones.filter(
      (milestone) => normalized(milestone.label) === "gm",
    );
    if (publicMilestones.length > 1) {
      issues.push({
        severity: "error",
        code: "multiple-public-milestones",
        path: `${path}.milestones`,
        message: `${key} has more than one Public milestone.`,
      });
    }

    const expectedPublicDate =
      publicMilestones[0]?.date || gmMilestones[0]?.date;
    if (
      version.publicReleaseDate &&
      !isIsoDate(version.publicReleaseDate)
    ) {
      issues.push({
        severity: "error",
        code: "invalid-public-date",
        path: `${path}.publicReleaseDate`,
        message: `${key} has invalid publicReleaseDate ${version.publicReleaseDate}.`,
      });
    }
    if (
      (version.publicReleaseDate || undefined) !==
      (expectedPublicDate || undefined)
    ) {
      issues.push({
        severity: "error",
        code: "public-date-mismatch",
        path: `${path}.publicReleaseDate`,
        message: `${key} publicReleaseDate must match its Public milestone, or GM only when Public is absent.`,
      });
    }

    const status = effectiveStatus(version);
    if (status === "released" && !version.publicReleaseDate) {
      issues.push({
        severity: "error",
        code: "released-without-public-date",
        path: `${path}.releaseStatus`,
        message: `${key} is Released but has no public release date.`,
      });
    }
    if (status !== "released" && version.publicReleaseDate) {
      issues.push({
        severity: "error",
        code: "unreleased-with-public-date",
        path: `${path}.releaseStatus`,
        message: `${key} is ${status} but has a public release date.`,
      });
    }
  }

  return issues;
}

export function assertValidReleaseData(data: ReleaseData): void {
  const issues = validateReleaseData(data);
  const errors = issues.filter((issue) => issue.severity === "error");
  if (!errors.length) return;

  throw new Error(
    [
      `Release data validation failed with ${errors.length} error(s):`,
      ...errors.map(
        (issue) => `- [${issue.code}] ${issue.path}: ${issue.message}`,
      ),
    ].join("\n"),
  );
}
