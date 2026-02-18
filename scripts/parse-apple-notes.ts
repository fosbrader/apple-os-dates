/**
 * Parses the original-apple-note file and outputs structured JSON
 * matching the Sanity schema structure.
 *
 * Usage: npx tsx scripts/parse-apple-notes.ts > scripts/seed-data.json
 */

import * as fs from "fs";
import * as path from "path";

interface Milestone {
  label: string;
  date: string; // YYYY-MM-DD
  note?: string;
  isRevision: boolean;
}

interface Version {
  platform: string;
  majorVersion: number;
  version: string;
  milestones: Milestone[];
  publicReleaseDate?: string;
  versionNote?: string;
  releaseNotesUrl?: string;
}

function parseDate(dateStr: string): string {
  // Format: M/D/YY or M/DD/YY
  const parts = dateStr.trim().split("/");
  if (parts.length !== 3) return "";

  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);

  // Convert 2-digit year to 4-digit
  if (year < 100) {
    year = year >= 50 ? 1900 + year : 2000 + year;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseMilestoneLine(
  line: string
): { milestone: Milestone; isPublic: boolean } | null {
  line = line.trim();
  if (!line || line.startsWith("**") || line.startsWith("#")) return null;
  if (line.startsWith("Source:")) return null;
  if (line.startsWith("iOS ") && line.includes("full cycle")) return null;

  // Match patterns like:
  // "Beta 1: 6/10/24"
  // "Beta 1 v2: 6/13/25 — Public Beta Release"
  // "RC: 9/9/24"
  // "RC 2: 12/9/24"
  // "Public: 9/16/24"
  // "GM: 9/15/20"
  // "Public Beta: 7/12/23"
  // "Beta 2 (X only): 11/3/17"
  // "Beta '2': 12/19/18"

  const match = line.match(
    /^((?:Beta|RC|Public|Pubic|GM|Pay Cash Beta)[\s']*\d*(?:\s*v\d+)?(?:\s*\([^)]+\))?(?:\s*\d*)?)\s*:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:[—–-]\s*(.+)|\(([^)]+)\))?$/i
  );

  if (!match) {
    // Try alternate format: "Beta 2 Update: 6/30/21"
    const altMatch = line.match(
      /^(Beta\s+\d+\s+Update)\s*:\s*(\d{1,2}\/\d{1,2}\/\d{2,4})(?:\s*[—–-]\s*(.+))?$/i
    );
    if (!altMatch) return null;

    const date = parseDate(altMatch[2]);
    if (!date) return null;

    return {
      milestone: {
        label: altMatch[1].trim(),
        date,
        note: altMatch[3]?.trim(),
        isRevision: true,
      },
      isPublic: false,
    };
  }

  let label = match[1].trim();
  const date = parseDate(match[2]);
  const noteRaw = (match[3] || match[4])?.trim();

  if (!date) return null;

  const isPublic =
    label.toLowerCase() === "public" || label.toLowerCase() === "pubic" || label.toLowerCase() === "gm";
  const isRevision = /v\d+/i.test(label) || /update/i.test(label);

  // Normalize "Pubic" typo to "Public"
  if (label.toLowerCase() === "pubic") label = "Public";

  // Clean up label: remove parenthetical device notes into note field
  let note = noteRaw;
  const parenMatch = label.match(/\(([^)]+)\)/);
  if (parenMatch) {
    note = note
      ? `${parenMatch[1]} — ${note}`
      : parenMatch[1];
    label = label.replace(/\s*\([^)]+\)/, "").trim();
  }

  // Clean up Beta '2' style
  label = label.replace(/'/g, "");

  return {
    milestone: {
      label,
      date,
      note,
      isRevision,
    },
    isPublic,
  };
}

function extractPlatforms(header: string): string[] {
  header = header.trim();

  // "iOS/iPadOS 26.3" → ["iOS", "iPadOS"]
  // "iOS 12.4" → ["iOS"]
  // "iOS/iPadOS 13.0, watchOS 6" → ["iOS", "iPadOS", "watchOS"]
  const platforms: string[] = [];

  // Split by comma for multi-platform entries
  const parts = header.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    // Remove version number
    const withoutVersion = trimmed.replace(/\s+\d+(\.\d+)*$/, "").trim();
    // Split by /
    const subPlatforms = withoutVersion.split("/");
    for (const p of subPlatforms) {
      const clean = p.trim();
      if (clean) platforms.push(clean);
    }
  }

  return platforms;
}

function extractVersion(header: string): string {
  // "iOS/iPadOS 26.3" → "26.3"
  // "iOS 12" → "12.0"
  // "iOS/iPadOS 13.0, watchOS 6" → "13.0"
  const match = header.match(/(\d+(?:\.\d+)*)/);
  if (!match) return "0.0";

  const version = match[1];
  return version.includes(".") ? version : `${version}.0`;
}

function extractMajorVersion(version: string): number {
  return parseInt(version.split(".")[0], 10);
}

function parse(content: string): Version[] {
  const lines = content.split("\n");
  const versions: Version[] = [];

  let currentHeader = "";
  let currentMilestones: Milestone[] = [];
  let currentPublicDate: string | undefined;
  let currentNote: string | undefined;
  let currentReleaseNotesUrl: string | undefined;

  function flushVersion() {
    if (!currentHeader || currentMilestones.length === 0) {
      currentHeader = "";
      currentMilestones = [];
      currentPublicDate = undefined;
      currentNote = undefined;
      currentReleaseNotesUrl = undefined;
      return;
    }

    const platforms = extractPlatforms(currentHeader);
    const version = extractVersion(currentHeader);
    const majorVersion = extractMajorVersion(version);

    for (const platform of platforms) {
      versions.push({
        platform,
        majorVersion,
        version,
        milestones: [...currentMilestones],
        publicReleaseDate: currentPublicDate,
        versionNote: currentNote,
        releaseNotesUrl: currentReleaseNotesUrl,
      });
    }

    currentHeader = "";
    currentMilestones = [];
    currentPublicDate = undefined;
    currentNote = undefined;
    currentReleaseNotesUrl = undefined;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines, title, tags
    if (!line) continue;
    if (line === "Apple Beta Release Dates") continue;
    if (line.startsWith("#Apple")) continue;

    // Separator lines
    if (/^[—–-]{3,}$/.test(line)) {
      flushVersion();
      continue;
    }

    // Release notes URLs
    if (
      line.startsWith("iOS ") &&
      line.includes("full cycle release notes:")
    ) {
      const urlMatch = line.match(/(https?:\/\/\S+)/);
      if (urlMatch) currentReleaseNotesUrl = urlMatch[1];
      continue;
    }

    // Source line
    if (line.startsWith("Source:")) continue;

    // Skip Shortcuts lines
    if (line.startsWith("** Shortcuts")) continue;

    // Version header: starts with "iOS", "iPadOS", "macOS", etc.
    if (
      /^(?:iOS|iPadOS|macOS|watchOS|tvOS|visionOS)/i.test(line) &&
      !line.includes("Beta") &&
      !line.includes("RC") &&
      !line.includes("Public") &&
      !line.includes("GM") &&
      !line.includes("full cycle")
    ) {
      flushVersion();
      currentHeader = line;
      continue;
    }

    // Milestone lines
    const parsed = parseMilestoneLine(line);
    if (parsed) {
      if (parsed.isPublic) {
        currentPublicDate = parsed.milestone.date;
        // Also add it as a milestone
        currentMilestones.push(parsed.milestone);
      } else {
        currentMilestones.push(parsed.milestone);
      }

      // Check for version notes in the milestone note
      if (
        parsed.milestone.note &&
        !parsed.isPublic &&
        currentMilestones.length === 1
      ) {
        // First milestone note becomes version note if notable
        const noteMap: Record<string, boolean> = {
          "Apple Intelligence Release": true,
        };
        if (noteMap[parsed.milestone.note]) {
          currentNote = parsed.milestone.note;
        }
      }
    }
  }

  // Flush the last version
  flushVersion();

  return versions;
}

// Build the structured output
interface SeedData {
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
  releaseVersions: Version[];
}

const PLATFORM_COLORS: Record<string, string> = {
  iOS: "#007AFF",
  iPadOS: "#5856D6",
  macOS: "#FF9500",
  watchOS: "#FF3B30",
  tvOS: "#5AC8FA",
  visionOS: "#AF52DE",
};

const PLATFORM_ORDER: Record<string, number> = {
  iOS: 1,
  iPadOS: 2,
  macOS: 3,
  watchOS: 4,
  tvOS: 5,
  visionOS: 6,
};

function buildSeedData(versions: Version[]): SeedData {
  const platformSet = new Set<string>();
  const trainSet = new Map<
    string,
    { platform: string; majorVersion: number; releaseYear: number }
  >();

  for (const v of versions) {
    platformSet.add(v.platform);

    const trainKey = `${v.platform}-${v.majorVersion}`;
    if (!trainSet.has(trainKey)) {
      // Determine release year from public release date or first milestone
      const firstDate =
        v.publicReleaseDate || v.milestones[0]?.date || "2020-01-01";
      const year = parseInt(firstDate.split("-")[0], 10);
      trainSet.set(trainKey, {
        platform: v.platform,
        majorVersion: v.majorVersion,
        releaseYear: year,
      });
    }
  }

  const platforms = Array.from(platformSet).map((name) => ({
    name,
    slug: name.toLowerCase(),
    color: PLATFORM_COLORS[name] || "#86868B",
    sortOrder: PLATFORM_ORDER[name] || 99,
  }));

  const releaseTrains = Array.from(trainSet.values()).map((t) => ({
    platform: t.platform,
    majorVersion: t.majorVersion,
    displayName: `${t.platform} ${t.majorVersion}`,
    releaseYear: t.releaseYear,
  }));

  return {
    platforms: platforms.sort((a, b) => a.sortOrder - b.sortOrder),
    releaseTrains: releaseTrains.sort(
      (a, b) => b.majorVersion - a.majorVersion || a.platform.localeCompare(b.platform)
    ),
    releaseVersions: versions,
  };
}

// Main
const filePath = path.join(__dirname, "..", "original-apple-note");
const content = fs.readFileSync(filePath, "utf-8");
const versions = parse(content);
const seedData = buildSeedData(versions);

console.log(JSON.stringify(seedData, null, 2));

// Print summary to stderr
const totalMilestones = versions.reduce(
  (sum, v) => sum + v.milestones.length,
  0
);
console.error(`\nParsed:`);
console.error(`  ${seedData.platforms.length} platforms`);
console.error(`  ${seedData.releaseTrains.length} release trains`);
console.error(`  ${versions.length} release versions`);
console.error(`  ${totalMilestones} milestones`);
