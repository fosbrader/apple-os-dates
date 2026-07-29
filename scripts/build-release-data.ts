/**
 * Builds the local canonical seed artifact without discarding detailed
 * iOS/iPadOS histories.
 *
 * Dry run:
 *   npm run data:build:check
 *
 * Write the reviewed result:
 *   npm run data:build
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  buildParsedSeedData,
  parseAppleNote,
  type ParsedVersion,
} from "./lib/apple-note-parser";
import {
  assertValidReleaseData,
  type ReleaseData,
  type ReleaseDataMilestone,
  type ReleaseDataVersion,
} from "./lib/release-data-validation";
import {
  buildCurrentReleaseTrains,
  buildCurrentReleaseVersions,
} from "./lib/current-release-cycles";

const scriptsDirectory = __dirname;
const rootDirectory = path.join(scriptsDirectory, "..");
const seedPath = path.join(scriptsDirectory, "seed-data.json");
const notePath = path.join(rootDirectory, "original-apple-note");
const writeChanges = process.argv.includes("--write");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function keyForVersion(
  version: Pick<ReleaseDataVersion, "platform" | "version">,
): string {
  return `${version.platform}|${version.version}`;
}

function normalized(value: string | undefined): string {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function mergeMilestones(
  existing: ReleaseDataMilestone[] | undefined,
  desired: ParsedVersion["milestones"],
): ReleaseDataMilestone[] {
  const existingByIdentity = new Map(
    (existing || []).map((milestone) => [
      `${normalized(milestone.label)}|${milestone.date}`,
      milestone,
    ]),
  );

  return desired.map((milestone) => {
    const current = existingByIdentity.get(
      `${normalized(milestone.label)}|${milestone.date}`,
    );
    return {
      ...(current || {}),
      ...milestone,
    };
  });
}

function mergeParsedVersion(
  parsed: ParsedVersion,
  existing: ReleaseDataVersion | undefined,
): ReleaseDataVersion {
  return {
    ...(existing || {}),
    ...parsed,
    publicReleaseDate: parsed.publicReleaseDate,
    releaseNotesUrl:
      parsed.releaseNotesUrl || existing?.releaseNotesUrl,
    milestones: mergeMilestones(existing?.milestones, parsed.milestones),
  };
}

function compareVersions(
  left: ReleaseDataVersion,
  right: ReleaseDataVersion,
): number {
  // Keep the established seed layout stable so a rebuild produces a
  // reviewable chronology diff instead of moving every historical record.
  // The mixed version direction reflects the existing hand-maintained file.
  const seedPlatformOrder = new Map([
    ["iPadOS", 1],
    ["macOS", 2],
    ["iOS", 3],
    ["watchOS", 4],
    ["tvOS", 5],
    ["visionOS", 6],
  ]);
  const platformDifference =
    (seedPlatformOrder.get(left.platform) || 99) -
    (seedPlatformOrder.get(right.platform) || 99);
  if (platformDifference) return platformDifference;

  const versionDifference = left.version.localeCompare(
    right.version,
    undefined,
    { numeric: true },
  );
  return ["iPadOS", "macOS", "visionOS"].includes(left.platform)
    ? -versionDifference
    : versionDifference;
}

function build(): ReleaseData {
  const existing = readJson<ReleaseData>(seedPath);
  const iOSSupplement = readJson<ReleaseDataVersion[]>(
    path.join(scriptsDirectory, "ios-all-versions.json"),
  );
  const parsed = parseAppleNote(fs.readFileSync(notePath, "utf8"));
  const unclassified = parsed.diagnostics.filter(
    (diagnostic) => diagnostic.reason === "unclassified-line",
  );
  if (unclassified.length) {
    throw new Error(
      `The source note has ${unclassified.length} unclassified line(s).`,
    );
  }

  const audited = parsed.versions.filter((version) =>
    ["iOS", "iPadOS"].includes(version.platform),
  );
  const parsedSeed = buildParsedSeedData(audited);
  const versionMap = new Map<string, ReleaseDataVersion>();
  for (const version of existing.releaseVersions) {
    if (!["iOS", "iPadOS"].includes(version.platform)) {
      versionMap.set(keyForVersion(version), version);
    }
  }
  for (const version of iOSSupplement) {
    versionMap.set(keyForVersion(version), {
      ...version,
      releaseStatus:
        version.releaseStatus ||
        (version.publicReleaseDate ? "released" : "active"),
    });
  }
  for (const release of buildCurrentReleaseVersions()) {
    const key = keyForVersion(release);
    const current = versionMap.get(key);
    const next: ReleaseDataVersion = {
      ...(current || {}),
      platform: release.platform,
      majorVersion: release.majorVersion,
      version: release.version,
      releaseStatus: release.releaseStatus,
      milestones: release.milestones.map((milestone) => ({
        label: milestone.label,
        date: milestone.date,
        ...(milestone.note ? { note: milestone.note } : {}),
        sourceUrl: milestone.sourceUrl,
        sourceLabel: milestone.sourceLabel,
        isRevision: milestone.isRevision,
      })),
    };
    delete next.publicReleaseDate;
    if (release.publicReleaseDate) {
      next.publicReleaseDate = release.publicReleaseDate;
    }
    versionMap.set(key, next);
  }
  for (const version of audited) {
    const key = keyForVersion(version);
    versionMap.set(
      key,
      mergeParsedVersion(version, versionMap.get(key)),
    );
  }

  const trainMap = new Map(
    existing.releaseTrains.map((train) => [
      `${train.platform}|${train.majorVersion}`,
      train,
    ]),
  );
  for (const train of parsedSeed.releaseTrains) {
    trainMap.set(`${train.platform}|${train.majorVersion}`, train);
  }
  for (const train of buildCurrentReleaseTrains()) {
    const key = `${train.platform}|${train.majorVersion}`;
    if (!trainMap.has(key)) {
      trainMap.set(key, {
        platform: train.platform,
        majorVersion: train.majorVersion,
        displayName: train.displayName,
        releaseYear: train.releaseYear,
      });
    }
  }

  const platforms = [...existing.platforms].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const platformOrder = new Map(
    platforms.map((platform) => [platform.name, platform.sortOrder]),
  );
  const releaseVersions = [...versionMap.values()].sort(compareVersions);
  const releaseTrains = [...trainMap.values()].sort(
    (left, right) =>
      (platformOrder.get(left.platform) || 99) -
        (platformOrder.get(right.platform) || 99) ||
      right.majorVersion - left.majorVersion,
  );

  const result: ReleaseData = {
    platforms,
    releaseTrains,
    releaseVersions,
  };
  assertValidReleaseData(result);
  return result;
}

const result = build();
const serialized = `${JSON.stringify(result, null, 2)}\n`;
const current = fs.readFileSync(seedPath, "utf8");
const changed = current !== serialized;

console.log(
  `${changed ? "CHANGE" : "OK"}: ${result.releaseVersions.length} versions and ${result.releaseVersions.reduce((sum, version) => sum + version.milestones.length, 0)} milestones.`,
);

if (!changed) process.exit(0);
if (!writeChanges) {
  console.error(
    "seed-data.json differs from the verified build. Run npm run data:build to update it.",
  );
  process.exit(1);
}

fs.writeFileSync(seedPath, serialized);
console.log(`Wrote ${seedPath}.`);
