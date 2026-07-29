export type ReleaseStatus = "active" | "released" | "superseded";

export interface ParsedMilestone {
  label: string;
  date: string;
  note?: string;
  isRevision: boolean;
}

export interface ParsedVersion {
  platform: string;
  majorVersion: number;
  version: string;
  releaseStatus: ReleaseStatus;
  milestones: ParsedMilestone[];
  publicReleaseDate?: string;
  versionNote?: string;
  releaseNotesUrl?: string;
}

export interface ParserDiagnostic {
  line: number;
  text: string;
  reason:
    | "non-os-program"
    | "source-attribution"
    | "unclassified-line";
}

export interface ParsedSeedData {
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
  releaseVersions: ParsedVersion[];
}

interface HeaderTarget {
  platform: string;
  version: string;
  majorVersion: number;
}

interface ParsedMilestoneLine {
  milestone: ParsedMilestone;
  isPublicRelease: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  iOS: "#007AFF",
  iPadOS: "#5856D6",
  macOS: "#FF9500",
  watchOS: "#FF3B30",
  tvOS: "#34C759",
  visionOS: "#6E5494",
};

const PLATFORM_ORDER: Record<string, number> = {
  iOS: 1,
  iPadOS: 2,
  macOS: 3,
  watchOS: 4,
  tvOS: 5,
  visionOS: 6,
};

const VERSION_HEADER =
  /^(?:iOS|iPadOS|macOS|watchOS|tvOS|visionOS)(?:\/(?:iOS|iPadOS|macOS|watchOS|tvOS|visionOS))*\s+\d+(?:\.\d+)*(?:\s*,\s*(?:iOS|iPadOS|macOS|watchOS|tvOS|visionOS)(?:\/(?:iOS|iPadOS|macOS|watchOS|tvOS|visionOS))*\s+\d+(?:\.\d+)*)*$/i;

function normalizeVersion(version: string): string {
  return version.includes(".") ? version : `${version}.0`;
}

export function parseDate(dateText: string): string {
  const parts = dateText.trim().split("/");
  if (parts.length !== 3) return "";

  const month = Number.parseInt(parts[0], 10);
  const day = Number.parseInt(parts[1], 10);
  let year = Number.parseInt(parts[2], 10);

  if (
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(year)
  ) {
    return "";
  }

  if (year < 100) {
    year = year >= 50 ? 1900 + year : 2000 + year;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function normalizeMilestoneLabel(label: string): string {
  return label
    .replace(/[‘’]/g, "'")
    .replace(/'/g, "")
    .replace(/^Pubic$/i, "Public")
    .replace(/^Pay Cash Beta$/i, "Apple Pay Cash Beta")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseMilestoneLine(
  rawLine: string,
): ParsedMilestoneLine | null {
  const line = rawLine.trim();
  if (!line) return null;

  const match = line.match(
    /^(.+?)\s*:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:(?:[—–-]\s*)(.+)|\(([^)]+)\))?\s*$/,
  );
  if (!match) return null;

  let label = normalizeMilestoneLabel(match[1]);
  let note = (match[3] || match[4])?.trim();
  const date = parseDate(match[2]);
  if (!date) return null;

  const parenthetical = label.match(/\(([^)]+)\)/);
  if (parenthetical) {
    note = note
      ? `${parenthetical[1]} — ${note}`
      : parenthetical[1];
    label = label.replace(/\s*\([^)]+\)/, "").trim();
  }

  const recognized =
    /^(?:(?:\d+(?:\.\d+)+\s+)?Beta\s+\d+(?:\s*v\d+)?|Beta\s+\d+\s+Update|RC(?:\s+\d+)?|Public|Public Beta(?:\s+\d+)?|GM|Apple Pay Cash Beta)$/i;
  if (!recognized.test(label)) return null;

  return {
    milestone: {
      label,
      date,
      ...(note ? { note } : {}),
      isRevision: /v\d+\b|\bupdate\b/i.test(label),
    },
    isPublicRelease: /^(?:Public|GM)$/i.test(label),
  };
}

export function extractHeaderTargets(header: string): HeaderTarget[] {
  return header.split(",").flatMap((part) => {
    const match = part
      .trim()
      .match(/^(.+?)\s+(\d+(?:\.\d+)*)$/);
    if (!match) return [];

    const version = normalizeVersion(match[2]);
    const majorVersion = Number.parseInt(version.split(".")[0], 10);

    return match[1].split("/").map((platform) => ({
      platform: platform.trim(),
      version,
      majorVersion,
    }));
  });
}

function releaseNoteSource(
  sources: Map<string, string>,
  platform: string,
  majorVersion: number,
): string | undefined {
  return sources.get(`${platform}:${majorVersion}`);
}

function inferredReleaseStatus(
  publicReleaseDate: string | undefined,
  versionNote: string | undefined,
): ReleaseStatus {
  if (versionNote?.toLowerCase().includes("superseded")) {
    return "superseded";
  }
  return publicReleaseDate ? "released" : "active";
}

export function parseAppleNote(content: string): {
  versions: ParsedVersion[];
  diagnostics: ParserDiagnostic[];
} {
  const lines = content.split(/\r?\n/);
  const versions: ParsedVersion[] = [];
  const diagnostics: ParserDiagnostic[] = [];
  const releaseNoteSources = new Map<string, string>();

  let currentHeader = "";
  let currentMilestones: ParsedMilestone[] = [];
  let currentPublicDate: string | undefined;
  let currentNote: string | undefined;
  let currentStatus: ReleaseStatus | undefined;

  function resetCurrent() {
    currentHeader = "";
    currentMilestones = [];
    currentPublicDate = undefined;
    currentNote = undefined;
    currentStatus = undefined;
  }

  function flushVersion() {
    if (!currentHeader || currentMilestones.length === 0) {
      resetCurrent();
      return;
    }

    for (const target of extractHeaderTargets(currentHeader)) {
      const releaseNotesUrl = releaseNoteSource(
        releaseNoteSources,
        target.platform,
        target.majorVersion,
      );
      versions.push({
        platform: target.platform,
        majorVersion: target.majorVersion,
        version: target.version,
        releaseStatus:
          currentStatus ||
          inferredReleaseStatus(currentPublicDate, currentNote),
        milestones: currentMilestones.map((milestone) => ({ ...milestone })),
        ...(currentPublicDate
          ? { publicReleaseDate: currentPublicDate }
          : {}),
        ...(currentNote ? { versionNote: currentNote } : {}),
        ...(releaseNotesUrl ? { releaseNotesUrl } : {}),
      });
    }

    resetCurrent();
  }

  for (let index = 0; index < lines.length; index += 1) {
    const lineNumber = index + 1;
    const line = lines[index].trim();

    if (
      !line ||
      line === "Apple Beta Release Dates" ||
      line.startsWith("#Apple")
    ) {
      continue;
    }

    if (/^[—–-]{3,}$/.test(line)) {
      flushVersion();
      continue;
    }

    const releaseNotesMatch = line.match(
      /^(iOS|iPadOS|macOS|watchOS|tvOS|visionOS)\s+(\d+)\s+full cycle release notes:\s*(https:\/\/\S+)$/i,
    );
    if (releaseNotesMatch) {
      releaseNoteSources.set(
        `${releaseNotesMatch[1]}:${releaseNotesMatch[2]}`,
        releaseNotesMatch[3],
      );
      continue;
    }

    if (line.startsWith("Source:")) {
      diagnostics.push({
        line: lineNumber,
        text: line,
        reason: "source-attribution",
      });
      continue;
    }

    if (line.startsWith("** Shortcuts")) {
      diagnostics.push({
        line: lineNumber,
        text: line,
        reason: "non-os-program",
      });
      continue;
    }

    if (VERSION_HEADER.test(line)) {
      flushVersion();
      currentHeader = line;
      continue;
    }

    const statusMatch = line.match(
      /^Status:\s*(Active|Released|Superseded)(?:\s*[—–-]\s*(.+))?$/i,
    );
    if (statusMatch) {
      currentStatus =
        statusMatch[1].toLowerCase() as ReleaseStatus;
      if (statusMatch[2]) currentNote = statusMatch[2].trim();
      continue;
    }

    const parsed = parseMilestoneLine(line);
    if (parsed) {
      if (parsed.milestone.label === "Apple Pay Cash Beta") {
        diagnostics.push({
          line: lineNumber,
          text: line,
          reason: "non-os-program",
        });
        continue;
      }

      currentMilestones.push(parsed.milestone);
      if (parsed.isPublicRelease) {
        currentPublicDate = parsed.milestone.date;
      }

      if (
        currentMilestones.length === 1 &&
        parsed.milestone.note?.startsWith(
          "Apple Intelligence Release",
        )
      ) {
        currentNote = "Apple Intelligence Release";
      }
      continue;
    }

    diagnostics.push({
      line: lineNumber,
      text: line,
      reason: "unclassified-line",
    });
  }

  flushVersion();
  return { versions, diagnostics };
}

function releaseYearForTrain(
  versions: ParsedVersion[],
  platform: string,
  majorVersion: number,
): number {
  const candidates = versions.filter(
    (version) =>
      version.platform === platform &&
      version.majorVersion === majorVersion,
  );
  const initial = candidates.find(
    (version) => version.version === `${majorVersion}.0`,
  );
  const initialDate =
    initial?.publicReleaseDate || initial?.milestones[0]?.date;
  if (initialDate) return Number.parseInt(initialDate.slice(0, 4), 10);

  const allDates = candidates
    .flatMap((version) => [
      ...(version.publicReleaseDate ? [version.publicReleaseDate] : []),
      ...version.milestones.map((milestone) => milestone.date),
    ])
    .sort();
  return allDates.length
    ? Number.parseInt(allDates[0].slice(0, 4), 10)
    : 2020;
}

export function buildParsedSeedData(
  versions: ParsedVersion[],
): ParsedSeedData {
  const platformNames = [...new Set(versions.map((version) => version.platform))];
  const trainKeys = [
    ...new Set(
      versions.map(
        (version) => `${version.platform}:${version.majorVersion}`,
      ),
    ),
  ];

  return {
    platforms: platformNames
      .map((name) => ({
        name,
        slug: name.toLowerCase(),
        color: PLATFORM_COLORS[name] || "#86868B",
        sortOrder: PLATFORM_ORDER[name] || 99,
      }))
      .sort((left, right) => left.sortOrder - right.sortOrder),
    releaseTrains: trainKeys
      .map((key) => {
        const separator = key.lastIndexOf(":");
        const platform = key.slice(0, separator);
        const majorVersion = Number.parseInt(
          key.slice(separator + 1),
          10,
        );
        return {
          platform,
          majorVersion,
          displayName: `${platform} ${majorVersion}`,
          releaseYear: releaseYearForTrain(
            versions,
            platform,
            majorVersion,
          ),
        };
      })
      .sort(
        (left, right) =>
          (PLATFORM_ORDER[left.platform] || 99) -
            (PLATFORM_ORDER[right.platform] || 99) ||
          right.majorVersion - left.majorVersion,
      ),
    releaseVersions: versions,
  };
}
