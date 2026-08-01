import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const directory = dirname(fileURLToPath(import.meta.url));
const seedPath = join(directory, "..", "seed-data.json");
const launchManifestPath = join(
  directory,
  "..",
  "apple-launch-content-2026.json",
);
const jsonPath = join(directory, "apple-26-5-26-6-prerelease.json");
const ledgerPath = join(directory, "apple-26-5-26-6-prerelease.md");
const outputFile = "apple-26-5-26-6-prerelease.json";
const reviewedAt = "2026-07-30T06:44:12Z";

const IOS_NOTES =
  "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-26_6-release-notes";
const MACOS_NOTES =
  "https://developer.apple.com/documentation/macos-release-notes/macos-26_6-release-notes";
const TVOS_NOTES =
  "https://developer.apple.com/documentation/tvos-release-notes/tvos-26_6-release-notes";
const VISIONOS_NOTES =
  "https://developer.apple.com/documentation/visionos-release-notes/visionos-26_6-release-notes";
const WATCHOS_NOTES =
  "https://developer.apple.com/documentation/watchos-release-notes/watchos-26_6-release-notes";

const noteSources = [
  {
    url: IOS_NOTES,
    transportUrl:
      "https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-26_6-release-notes.json",
    title: "iOS & iPadOS 26.6 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    topics: ["iOS", "iPadOS", "26.6", "SDK"],
  },
  {
    url: MACOS_NOTES,
    transportUrl:
      "https://developer.apple.com/tutorials/data/documentation/macos-release-notes/macos-26_6-release-notes.json",
    title: "macOS Tahoe 26.6 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    topics: ["macOS", "26.6", "SDK"],
  },
  {
    url: TVOS_NOTES,
    transportUrl:
      "https://developer.apple.com/tutorials/data/documentation/tvos-release-notes/tvos-26_6-release-notes.json",
    title: "tvOS 26.6 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    topics: ["tvOS", "26.6", "SDK"],
  },
  {
    url: VISIONOS_NOTES,
    transportUrl:
      "https://developer.apple.com/tutorials/data/documentation/visionos-release-notes/visionos-26_6-release-notes.json",
    title: "visionOS 26.6 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    topics: ["visionOS", "26.6", "SDK"],
  },
  {
    url: WATCHOS_NOTES,
    transportUrl:
      "https://developer.apple.com/tutorials/data/documentation/watchos-release-notes/watchos-26_6-release-notes.json",
    title: "watchOS 26.6 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    topics: ["watchOS", "26.6", "SDK"],
  },
];

const platformRows = [
  {
    slug: "ios",
    platformId: "platform-ios",
    displayName: "iOS",
    releaseVersionId: "version-ios-26-6",
    noteUrl: IOS_NOTES,
    noteTitle: "iOS & iPadOS 26.6 RC Release Notes",
    scope:
      "HealthKit authorization and statistics, HDR screenshots in Messages, Object Capture, corrupted sticker data, and StoreKit test sessions",
    changeKeys: [
      "ios-26-6-health-blood-pressure-auth",
      "ios-26-6-health-weighted-average",
      "ios-26-6-messages-hdr-screenshots",
      "ios-26-6-stickers-sync-recovery",
      "ios-26-6-object-capture-storekit-simulator",
    ],
  },
  {
    slug: "ipados",
    platformId: "platform-ipados",
    displayName: "iPadOS",
    releaseVersionId: "version-ipados-26-6",
    noteUrl: IOS_NOTES,
    noteTitle: "iOS & iPadOS 26.6 RC Release Notes",
    scope:
      "HealthKit authorization and statistics, HDR screenshots in Messages, Object Capture, corrupted sticker data, and StoreKit test sessions",
    changeKeys: [
      "ipados-26-6-health-blood-pressure-auth",
      "ipados-26-6-health-weighted-average",
      "ipados-26-6-messages-hdr-screenshots",
      "ipados-26-6-stickers-sync-recovery",
      "ipados-26-6-object-capture-storekit-simulator",
    ],
  },
  {
    slug: "macos",
    platformId: "platform-macos",
    displayName: "macOS",
    releaseVersionId: "version-macos-26-6",
    noteUrl: MACOS_NOTES,
    noteTitle: "macOS Tahoe 26.6 RC Release Notes",
    scope:
      "the encrypted-HFS+ deprecation and fixes for compatibility notices, HealthKit statistics, and HDR screenshots in Messages",
    changeKeys: [
      "macos-26-6-corestorage-deprecation",
      "macos-26-6-intel-only-notice",
      "macos-26-6-health-weighted-average",
      "macos-26-6-messages-hdr-screenshots",
    ],
  },
  {
    slug: "tvos",
    platformId: "platform-tvos",
    displayName: "tvOS",
    releaseVersionId: "version-tvos-26-6",
    noteUrl: TVOS_NOTES,
    noteTitle: "tvOS 26.6 RC Release Notes",
    scope:
      "HealthKit temporally weighted statistics and StoreKit test-session connectivity in Simulator",
    changeKeys: [
      "tvos-26-6-health-weighted-average",
      "tvos-26-6-storekit-simulator-session",
    ],
  },
  {
    slug: "visionos",
    platformId: "platform-visionos",
    displayName: "visionOS",
    releaseVersionId: "version-visionos-26-6",
    noteUrl: VISIONOS_NOTES,
    noteTitle: "visionOS 26.6 RC Release Notes",
    scope:
      "HealthKit authorization and temporally weighted statistics plus StoreKit test-session connectivity in Simulator",
    changeKeys: [
      "visionos-26-6-health-blood-pressure-auth",
      "visionos-26-6-health-weighted-average",
      "visionos-26-6-storekit-simulator-session",
    ],
  },
  {
    slug: "watchos",
    platformId: "platform-watchos",
    displayName: "watchOS",
    releaseVersionId: "version-watchos-26-6",
    noteUrl: WATCHOS_NOTES,
    noteTitle: "watchOS 26.6 RC Release Notes",
    scope:
      "HealthKit authorization and temporally weighted statistics plus StoreKit test-session connectivity in Simulator",
    changeKeys: [
      "watchos-26-6-health-blood-pressure-auth",
      "watchos-26-6-health-weighted-average",
      "watchos-26-6-storekit-simulator-session",
    ],
  },
];

const changeDefinitions = {
  "ios-26-6-health-blood-pressure-auth": {
    title: "Blood-pressure HealthKit authorization fix",
    canonicalSummary:
      "HealthKit now displays the authorization screen correctly when applications request supported blood-pressure data types.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC notes say the authorization sheet now appears for applications requesting the documented systolic or diastolic blood-pressure quantity types.",
  },
  "ios-26-6-health-weighted-average": {
    title: "Overlapping-sample HealthKit average fix",
    canonicalSummary:
      "Temporally weighted statistics no longer overstate discrete quantity averages in the documented overlapping-sample case.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected erroneously high temporally weighted averages for discrete quantities when samples overlap in time.",
  },
  "ios-26-6-messages-hdr-screenshots": {
    title: "HDR screenshot delivery in Messages",
    canonicalSummary:
      "HDR screenshots no longer become garbled in the documented Messages sending workflow.",
    category: "bugFix",
    action: "fixed",
    locator: "Messages — Resolved Issues",
    occurrenceSummary:
      "The RC notes identify a fix for HDR screenshots becoming garbled when sent through Messages.",
  },
  "ios-26-6-stickers-sync-recovery": {
    title: "Synced sticker recovery",
    canonicalSummary:
      "The system can recover from the documented corruption affecting stickers synchronized between devices.",
    category: "bugFix",
    action: "fixed",
    locator: "Stickers — Resolved Issues",
    occurrenceSummary:
      "The RC corrected a corruption state that could hide existing stickers, prevent new stickers, and propagate through iCloud sync.",
  },
  "ios-26-6-object-capture-storekit-simulator": {
    title: "Object Capture and StoreKit Simulator fixes",
    canonicalSummary:
      "Capture reconstruction reliability and StoreKit test-session connectivity in Simulator were corrected.",
    category: "bugFix",
    action: "fixed",
    locator: "Object Capture and StoreKit",
    occurrenceSummary:
      "The RC notes separately identify failed Object Capture reconstruction and StoreKit test sessions that could not connect from Simulator.",
  },
  "ipados-26-6-health-blood-pressure-auth": {
    title: "Blood-pressure HealthKit authorization fix",
    canonicalSummary:
      "HealthKit now displays the authorization screen correctly when applications request supported blood-pressure data types.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC notes say the authorization sheet now appears for applications requesting the documented systolic or diastolic blood-pressure quantity types.",
  },
  "ipados-26-6-health-weighted-average": {
    title: "Overlapping-sample HealthKit average fix",
    canonicalSummary:
      "Temporally weighted statistics no longer overstate discrete quantity averages in the documented overlapping-sample case.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected erroneously high temporally weighted averages for discrete quantities when samples overlap in time.",
  },
  "ipados-26-6-messages-hdr-screenshots": {
    title: "HDR screenshot delivery in Messages",
    canonicalSummary:
      "HDR screenshots no longer become garbled in the documented Messages sending workflow.",
    category: "bugFix",
    action: "fixed",
    locator: "Messages — Resolved Issues",
    occurrenceSummary:
      "The RC notes identify a fix for HDR screenshots becoming garbled when sent through Messages.",
  },
  "ipados-26-6-stickers-sync-recovery": {
    title: "Synced sticker recovery",
    canonicalSummary:
      "The system can recover from the documented corruption affecting stickers synchronized between devices.",
    category: "bugFix",
    action: "fixed",
    locator: "Stickers — Resolved Issues",
    occurrenceSummary:
      "The RC corrected a corruption state that could hide existing stickers, prevent new stickers, and propagate through iCloud sync.",
  },
  "ipados-26-6-object-capture-storekit-simulator": {
    title: "Object Capture and StoreKit Simulator fixes",
    canonicalSummary:
      "Capture reconstruction reliability and StoreKit test-session connectivity in Simulator were corrected.",
    category: "bugFix",
    action: "fixed",
    locator: "Object Capture and StoreKit",
    occurrenceSummary:
      "The RC notes separately identify failed Object Capture reconstruction and StoreKit test sessions that could not connect from Simulator.",
  },
  "macos-26-6-corestorage-deprecation": {
    title: "Encrypted HFS+ CoreStorage deprecation",
    canonicalSummary:
      "Encrypted HFS+ volumes backed by CoreStorage are deprecated, with support scheduled to end in macOS 28 in favor of encrypted APFS.",
    category: "removal",
    action: "changed",
    locator: "CoreStorage — Deprecations",
    occurrenceSummary:
      "The RC notes deprecate encrypted HFS+ through CoreStorage, identify macOS 28 as the planned support boundary, and direct external backups toward encrypted APFS.",
  },
  "macos-26-6-intel-only-notice": {
    title: "False Intel-only compatibility notice fix",
    canonicalSummary:
      "Compatibility notifications no longer misidentify a host application as Intel-only merely because a plug-in loader imports x86 code.",
    category: "bugFix",
    action: "fixed",
    locator: "Ecosystem — Resolved Issues",
    occurrenceSummary:
      "The RC corrected compatibility notices that blamed a host application when a system plug-in loader was the component loading x86 code.",
  },
  "macos-26-6-health-weighted-average": {
    title: "Overlapping-sample HealthKit average fix",
    canonicalSummary:
      "Temporally weighted statistics no longer overstate discrete quantity averages in the documented overlapping-sample case.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected erroneously high temporally weighted averages for discrete quantities when samples overlap in time.",
  },
  "macos-26-6-messages-hdr-screenshots": {
    title: "HDR screenshot delivery in Messages",
    canonicalSummary:
      "HDR screenshots no longer become garbled in the documented Messages sending workflow.",
    category: "bugFix",
    action: "fixed",
    locator: "Messages — Resolved Issues",
    occurrenceSummary:
      "The RC notes identify a fix for HDR screenshots becoming garbled when sent through Messages.",
  },
  "tvos-26-6-health-weighted-average": {
    title: "Overlapping-sample HealthKit average fix",
    canonicalSummary:
      "Temporally weighted statistics no longer overstate discrete quantity averages in the documented overlapping-sample case.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected erroneously high temporally weighted averages for discrete quantities when samples overlap in time.",
  },
  "tvos-26-6-storekit-simulator-session": {
    title: "StoreKit Simulator session connection fix",
    canonicalSummary:
      "StoreKit test sessions can connect to the test environment correctly when run in Simulator.",
    category: "bugFix",
    action: "fixed",
    locator: "StoreKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected StoreKit test sessions that failed because they could not connect to the test environment from Simulator.",
  },
  "visionos-26-6-health-blood-pressure-auth": {
    title: "Blood-pressure HealthKit authorization fix",
    canonicalSummary:
      "HealthKit now displays the authorization screen correctly when applications request supported blood-pressure data types.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC notes say the authorization sheet now appears for applications requesting the documented systolic or diastolic blood-pressure quantity types.",
  },
  "visionos-26-6-health-weighted-average": {
    title: "Overlapping-sample HealthKit average fix",
    canonicalSummary:
      "Temporally weighted statistics no longer overstate discrete quantity averages in the documented overlapping-sample case.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected erroneously high temporally weighted averages for discrete quantities when samples overlap in time.",
  },
  "visionos-26-6-storekit-simulator-session": {
    title: "StoreKit Simulator session connection fix",
    canonicalSummary:
      "StoreKit test sessions can connect to the test environment correctly when run in Simulator.",
    category: "bugFix",
    action: "fixed",
    locator: "StoreKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected StoreKit test sessions that failed because they could not connect to the test environment from Simulator.",
  },
  "watchos-26-6-health-blood-pressure-auth": {
    title: "Blood-pressure HealthKit authorization fix",
    canonicalSummary:
      "HealthKit now displays the authorization screen correctly when applications request supported blood-pressure data types.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC notes say the authorization sheet now appears for applications requesting the documented systolic or diastolic blood-pressure quantity types.",
  },
  "watchos-26-6-health-weighted-average": {
    title: "Overlapping-sample HealthKit average fix",
    canonicalSummary:
      "Temporally weighted statistics no longer overstate discrete quantity averages in the documented overlapping-sample case.",
    category: "bugFix",
    action: "fixed",
    locator: "HealthKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected erroneously high temporally weighted averages for discrete quantities when samples overlap in time.",
  },
  "watchos-26-6-storekit-simulator-session": {
    title: "StoreKit Simulator session connection fix",
    canonicalSummary:
      "StoreKit test sessions can connect to the test environment correctly when run in Simulator.",
    category: "bugFix",
    action: "fixed",
    locator: "StoreKit — Resolved Issues",
    occurrenceSummary:
      "The RC corrected StoreKit test sessions that failed because they could not connect to the test environment from Simulator.",
  },
};

const expectedSeed = {
  "iOS 26.5":
    "Beta 1@2026-03-30|Beta 1 v2@2026-04-03*|Beta 2@2026-04-13|Beta 3@2026-04-20|Beta 4@2026-04-27|RC@2026-05-04|RC 2@2026-05-08|Public@2026-05-11",
  "iOS 26.6":
    "Beta 1@2026-05-26|Beta 2@2026-06-15|Beta 3@2026-06-29|Beta 4@2026-07-06|Beta 5@2026-07-13|RC@2026-07-20|Public@2026-07-27",
  "iPadOS 26.5":
    "Beta 1@2026-03-30|Beta 1 v2@2026-04-03*|Beta 2@2026-04-13|Beta 3@2026-04-20|Beta 4@2026-04-27|RC@2026-05-04|RC 2@2026-05-08|Public@2026-05-11",
  "iPadOS 26.6":
    "Beta 1@2026-05-26|Beta 2@2026-06-15|Beta 3@2026-06-29|Beta 4@2026-07-06|Beta 5@2026-07-13|RC@2026-07-20|Public@2026-07-27",
  "macOS 26.5":
    "Beta 1@2026-03-30|Beta 2@2026-04-13|Beta 3@2026-04-20|Beta 4@2026-04-27|RC@2026-05-04|Public@2026-05-11",
  "macOS 26.6":
    "Beta 1@2026-05-26|Beta 2@2026-06-15|Beta 3@2026-06-29|Beta 4@2026-07-06|Beta 5@2026-07-13|RC@2026-07-20|Public@2026-07-27",
  "tvOS 26.5":
    "Beta 1@2026-03-30|Beta 2@2026-04-13|Beta 3@2026-04-20|Beta 4@2026-04-27|RC@2026-05-04|Public@2026-05-11",
  "tvOS 26.6":
    "Beta 1@2026-05-26|Beta 2@2026-06-15|Beta 3@2026-06-29|Beta 4@2026-07-06|Beta 5@2026-07-13|RC@2026-07-20|Public@2026-07-27",
  "visionOS 26.5":
    "Beta 1@2026-03-30|Beta 2@2026-04-13|Beta 3@2026-04-20|Beta 4@2026-04-27|RC@2026-05-04|Public@2026-05-11",
  "visionOS 26.6":
    "Beta 1@2026-05-26|Beta 2@2026-06-15|Beta 3@2026-06-29|Beta 4@2026-07-06|Beta 5@2026-07-13|RC@2026-07-20|Public@2026-07-27",
  "watchOS 26.5":
    "Beta 1@2026-03-30|Beta 2@2026-04-13|Beta 3@2026-04-20|Beta 4@2026-04-27|RC@2026-05-04|Public@2026-05-11",
  "watchOS 26.6":
    "Beta 1@2026-05-26|Beta 2@2026-06-15|Beta 3@2026-06-29|Beta 4@2026-07-06|Beta 5@2026-07-13|RC@2026-07-20|Public@2026-07-27",
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function signature(milestones) {
  return milestones
    .map(
      (milestone) =>
        `${milestone.label}@${milestone.date}${milestone.isRevision ? "*" : ""}`,
    )
    .join("|");
}

function idForSeedVersion(version) {
  return `version-${version.platform.toLowerCase()}-${version.version.replaceAll(".", "-")}`;
}

function citation(url, locator) {
  return {
    url,
    ...(locator ? { locator } : {}),
  };
}

function article(blocks) {
  return {
    authorship: "originalSynthesis",
    blocks,
  };
}

function heading(text) {
  return { style: "h2", text };
}

function paragraph(text, citations) {
  return { text, citations };
}

function selectedChange(key, noteUrl) {
  const definition = changeDefinitions[key];
  assert(definition, `Missing local definition for ${key}.`);
  return {
    key,
    title: definition.title,
    canonicalSummary: definition.canonicalSummary,
    category: definition.category,
    action: definition.action,
    inheritance: "delta",
    summary: definition.occurrenceSummary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched the canonical Apple Developer note whose title and SDK overview identify the exact 26.6 RC. No earlier beta or public-only source is inherited.",
    citations: [citation(noteUrl, definition.locator)],
  };
}

function eventFor(platform) {
  const noteCitation = citation(
    platform.noteUrl,
    `${platform.noteTitle}; RC overview and enumerated sections`,
  );
  return {
    target: {
      releaseVersionId: platform.releaseVersionId,
      routeAlias: "rc",
    },
    authorship: "originalSynthesis",
    summary: `Apple's ${platform.displayName} 26.6 RC-specific developer note documents ${platform.scope}, without assigning public-only, build-specific, or earlier-beta material to this route.`,
    article: article([
      heading("Release candidate documentation"),
      paragraph(
        `Apple's canonical developer page identifies itself as ${platform.noteTitle}. This article attaches only the changes enumerated on that RC-labeled page to the existing RC route.`,
        [noteCitation],
      ),
      heading("Documented RC delta"),
      paragraph(
        `The canonical developer note still identifies itself as ${platform.noteTitle} and limits the structured inventory here to ${platform.scope}. Each occurrence below comes from an item Apple places on that RC page.`,
        [noteCitation],
      ),
      heading("Evidence boundary"),
      paragraph(
        "No cumulative public support note, public security advisory, earlier beta snapshot, undocumented behavior, build number, release date, or cross-platform assumption is projected onto this event. The current RC-titled developer note supports the enumerated changes, but it does not provide durable historical artifact metadata.",
        [noteCitation],
      ),
    ]),
    citations: [noteCitation],
    changes: platform.changeKeys.map((key) =>
      selectedChange(key, platform.noteUrl),
    ),
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
}

function collectCitations(value, output = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectCitations(item, output);
    return output;
  }
  if (!value || typeof value !== "object") return output;
  if (
    typeof value.url === "string" &&
    Object.keys(value).every((key) => ["url", "locator", "note"].includes(key))
  ) {
    output.push(value);
    return output;
  }
  for (const item of Object.values(value)) collectCitations(item, output);
  return output;
}

const seed = JSON.parse(await readFile(seedPath, "utf8"));
const launchManifest = JSON.parse(await readFile(launchManifestPath, "utf8"));
const platformNames = new Set([
  "iOS",
  "iPadOS",
  "macOS",
  "tvOS",
  "visionOS",
  "watchOS",
]);
const seedVersions = seed.releaseVersions
  .filter(
    (version) =>
      platformNames.has(version.platform) &&
      ["26.5", "26.6"].includes(version.version),
  )
  .sort(
    (left, right) =>
      left.platform.localeCompare(right.platform) ||
      left.version.localeCompare(right.version),
  );

assert(seedVersions.length === 12, "Expected exactly 12 seed versions.");
assert(
  Object.keys(expectedSeed).length === seedVersions.length,
  "Expected-seed table length drifted.",
);
for (const version of seedVersions) {
  const key = `${version.platform} ${version.version}`;
  assert(expectedSeed[key], `Unexpected seed record ${key}.`);
  assert(
    signature(version.milestones) === expectedSeed[key],
    `${key} milestone closure changed.`,
  );
  assert(
    version.publicReleaseDate ===
      (version.version === "26.5" ? "2026-05-11" : "2026-07-27"),
    `${key} public date changed.`,
  );
}

const seedMilestones = seedVersions.flatMap((version) =>
  version.milestones.map((milestone) => ({
    releaseVersionId: idForSeedVersion(version),
    platform: version.platform,
    version: version.version,
    ...milestone,
  })),
);
const publicMilestones = seedMilestones.filter(
  (milestone) => milestone.label === "Public",
);
const prereleaseMilestones = seedMilestones.filter(
  (milestone) => milestone.label !== "Public",
);
const publicBetaMilestones = prereleaseMilestones.filter((milestone) =>
  milestone.label.toLowerCase().includes("public beta"),
);
const selectedRouteKeys = new Set(
  platformRows.map((platform) => `${platform.releaseVersionId}/rc`),
);
const selectedMilestones = prereleaseMilestones.filter(
  (milestone) =>
    milestone.version === "26.6" &&
    milestone.label === "RC" &&
    selectedRouteKeys.has(`${milestone.releaseVersionId}/rc`),
);
const unsupportedMilestones = prereleaseMilestones.filter(
  (milestone) =>
    !(
      milestone.version === "26.6" &&
      milestone.label === "RC" &&
      selectedRouteKeys.has(`${milestone.releaseVersionId}/rc`)
    ),
);

assert(seedMilestones.length === 82, "Expected 82 total seed milestones.");
assert(publicMilestones.length === 12, "Expected 12 public milestones.");
assert(
  prereleaseMilestones.length === 70,
  "Expected 70 prerelease milestones.",
);
assert(
  publicBetaMilestones.length === 0,
  "A Public Beta route appeared and needs explicit research.",
);
assert(
  selectedMilestones.length === 6,
  "Expected exactly six supported RC milestones.",
);
assert(
  unsupportedMilestones.length === 64,
  "Expected exactly 64 unsupported prerelease milestones.",
);
assert(
  unsupportedMilestones.filter((milestone) => milestone.version === "26.5")
    .length === 34,
  "Expected 34 unsupported 26.5 prerelease milestones.",
);
assert(
  unsupportedMilestones.filter((milestone) => milestone.version === "26.6")
    .length === 30,
  "Expected 30 unsupported 26.6 beta milestones.",
);

const launchVersionIds = new Set(
  (launchManifest.versions || []).map((version) => version.releaseVersionId),
);
for (const version of seedVersions) {
  assert(
    launchVersionIds.has(idForSeedVersion(version)),
    `${idForSeedVersion(version)} is not owned by the approved launch manifest.`,
  );
}

const launchPublicEvents = (launchManifest.events || []).filter((event) => {
  const legacySourceId = event.target?.legacySourceId || "";
  return (
    /^version-(ios|ipados|macos|tvos|visionos|watchos)-26-[56]:m[67]$/.test(
      legacySourceId,
    ) &&
    event.editorialReview?.status === "approved" &&
    event.provenanceStatus === "editoriallyVerified" &&
    event.isIndexable === true
  );
});
assert(
  launchPublicEvents.length === 12,
  "Expected 12 approved full public routes in the launch manifest.",
);
for (const event of launchPublicEvents) {
  assert(
    !event.target.legacySourceId.endsWith(":m5"),
    `Selected RC route overlaps ${event.target.legacySourceId}.`,
  );
}

const approvedChanges = new Map();
for (const event of launchManifest.events || []) {
  for (const change of event.changes || []) {
    const definition = {
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    };
    const prior = approvedChanges.get(change.key);
    assert(
      !prior || JSON.stringify(prior) === JSON.stringify(definition),
      `Approved launch change ${change.key} has conflicting definitions.`,
    );
    approvedChanges.set(change.key, definition);
  }
}
for (const [key, definition] of Object.entries(changeDefinitions)) {
  const approved = approvedChanges.get(key);
  assert(approved, `${key} is not an approved reusable change definition.`);
  assert(
    JSON.stringify(approved) ===
      JSON.stringify({
        title: definition.title,
        canonicalSummary: definition.canonicalSummary,
        category: definition.category,
      }),
    `${key} drifted from its approved reusable definition.`,
  );
}

const sources = noteSources;
const events = platformRows.map(eventFor);
const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt: "2026-07-30",
  sources,
  versions: [],
  events,
  builds: [],
};

assert(bundle.versions.length === 0, "Version overlays are out of scope.");
assert(bundle.events.length === 6, "Expected exactly six event overlays.");
assert(bundle.builds.length === 0, "Build pages are out of scope.");
const occurrences = bundle.events.flatMap((event) => event.changes);
assert(occurrences.length === 22, "Expected 22 RC change occurrences.");
assert(
  new Set(occurrences.map((change) => change.key)).size === 22,
  "Expected 22 platform-scoped change keys.",
);
for (const event of bundle.events) {
  assert(
    JSON.stringify(Object.keys(event.target).sort()) ===
      JSON.stringify(["releaseVersionId", "routeAlias"]),
    "Event selector contains a non-durable field.",
  );
  assert(event.target.routeAlias === "rc", "Only RC routes may be emitted.");
  assert(
    event.provenanceStatus === "editoriallyVerified" &&
      event.editorialReview.status === "approved" &&
      event.editorialReview.reviewedAt === reviewedAt &&
      event.isIndexable === true,
    "Every event must remain editorially verified, approved, and indexable.",
  );
  assert(event.changes.length > 0, "Every emitted event needs a delta.");
  for (const change of event.changes) {
    assert(change.inheritance === "delta", `${change.key} is not a delta.`);
    assert(
      change.documentedStatus === "documented" &&
        change.evidenceState === "confirmed",
      `${change.key} has an unexpected evidence state.`,
    );
  }
}

const sourceUrls = new Set(sources.map((source) => source.url));
assert(sourceUrls.size === sources.length, "Source URLs must be unique.");
const citations = collectCitations({ events });
for (const item of citations) {
  assert(sourceUrls.has(item.url), `Undeclared citation source ${item.url}.`);
}
for (const url of sourceUrls) {
  assert(
    citations.some((item) => item.url === url),
    `Declared source is unused: ${url}.`,
  );
}

const files = (await readdir(directory))
  .filter((file) => file.endsWith(".json") && file !== outputFile)
  .sort();
const targetOwners = new Map();
const researchChangeDefinitions = new Map();
for (const file of files) {
  const other = JSON.parse(await readFile(join(directory, file), "utf8"));
  for (const event of other.events || []) {
    if (event.target?.releaseVersionId && event.target?.routeAlias) {
      targetOwners.set(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
        file,
      );
    }
    for (const change of event.changes || []) {
      const definition = JSON.stringify({
        title: change.title,
        canonicalSummary: change.canonicalSummary,
        category: change.category,
      });
      const prior = researchChangeDefinitions.get(change.key);
      assert(
        !prior || prior.definition === definition,
        `${change.key} conflicts between ${prior?.file} and ${file}.`,
      );
      researchChangeDefinitions.set(change.key, { file, definition });
    }
  }
}
for (const event of bundle.events) {
  const target = `${event.target.releaseVersionId}/${event.target.routeAlias}`;
  assert(
    !targetOwners.has(target),
    `${target} is already owned by ${targetOwners.get(target)}.`,
  );
  for (const change of event.changes) {
    const prior = researchChangeDefinitions.get(change.key);
    if (!prior) continue;
    assert(
      prior.definition ===
        JSON.stringify({
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        }),
      `${change.key} conflicts with ${prior.file}.`,
    );
  }
}

const rawJson = `${JSON.stringify(bundle, null, 2)}\n`;
const formattedJson = await prettier.format(rawJson, {
  parser: "json",
  printWidth: 100,
});
const jsonSha = sha256(formattedJson);

const seedRows = seedVersions
  .map((version) => {
    const prereleaseCount = version.milestones.filter(
      (milestone) => milestone.label !== "Public",
    ).length;
    const selectedCount =
      version.version === "26.6" &&
      version.milestones.some((milestone) => milestone.label === "RC")
        ? 1
        : 0;
    return `| ${version.platform} | ${version.version} | ${version.milestones.length} | ${prereleaseCount} | ${selectedCount} | ${prereleaseCount - selectedCount} |`;
  })
  .join("\n");

const selectedRows = platformRows
  .map(
    (platform) =>
      `| ${platform.displayName} | \`${platform.releaseVersionId}/rc\` | ${platform.changeKeys.length} |`,
  )
  .join("\n");

const markdown = `# Apple 26.5–26.6 prerelease RC research batch

## Result

\`apple-26-5-26-6-prerelease.json\` enriches only the six existing 26.6 Release Candidate routes whose current first-party Apple Developer notes still identify the RC and enumerate its changes.

- The exact seed contains 12 versions, 82 milestones, 12 Public routes, and 70 beta/RC routes.
- There are no Public Beta milestones in the 26.5 or 26.6 seed.
- 6 RC routes have durable release-specific evidence and are included.
- 64 prerelease routes remain intentionally unsupported: all 34 routes from 26.5 and the 30 pre-RC beta routes from 26.6.
- The six event overlays contain 22 confirmed, documented, platform-scoped delta occurrences.
- 5 first-party Apple sources are used: the canonical RC release-note pages (iOS and iPadOS share one page).
- No version overlay, Public route, build page, new identity, public support note, security advisory, or apply operation is included.
- Root editorial review approved the six RC articles and their indexing state at \`${reviewedAt}\`.

## Exact seed closure

| Platform | Version | Seed milestones | Beta/RC routes | Selected | Unsupported |
| --- | ---: | ---: | ---: | ---: | ---: |
${seedRows}
| **Total** | | **82** | **70** | **6** | **64** |

Every seed signature is asserted by label, date, order, and revision flag. iOS and iPadOS 26.5 each include the April 3 Beta 1 v2 revision and May 8 RC 2. The other four 26.5 platforms do not. All six 26.6 tracks include five developer betas and one RC before Public.

Production inspection found all 70 prerelease routes as source-linked drafts with zero article text and \`isIndexable: false\`. The six selected RC routes become \`editoriallyVerified\`, approved, and indexable after review; the other 64 remain unchanged. The 12 Public routes are already approved and indexable; their version and Public-event content is owned by the approved launch manifest and is excluded here.

## Selected route inventory

| Platform | Durable selector | RC deltas |
| --- | --- | ---: |
${selectedRows}
| **Total** | | **22** |

The current canonical developer pages explicitly use “RC” in both their titles and SDK overview, which establishes the event-specific evidence boundary for the 22 enumerated items. They do not durably establish the historical RC date or build number, so those facts are excluded from this batch.

## Unsupported-route audit

### Version 26.5

Apple's current canonical 26.5 developer pages are final cumulative release notes. Apple does not retain a durable, independently resolving per-seed note snapshot on those canonical pages. Timeline metadata alone does not establish when a feature, fix, known issue, or removal entered the cycle.

Accordingly, no 26.5 item is copied backward to Beta 1, Beta 1 v2, Beta 2, Beta 3, Beta 4, RC, or RC 2. The April 3 iOS/iPadOS revised build is recorded by the timeline but Apple does not publicly state its corrective delta, so this batch does not invent one.

### Version 26.6 before RC

The current 26.6 pages identify the Release Candidate, not Beta 1 through Beta 5. Search indexes and mutable category pages showed earlier beta titles during research, but they are not durable primary snapshots suitable for claim-level publication. The 30 developer-beta routes therefore remain timeline-only.

### Public Beta

No Public Beta route exists in the audited seed or production cohort. No event is created to fill that absence.

## Delta and reuse method

The RC items reuse the exact approved release-change identities already defined for the corresponding Public pages, but only when Apple's RC-titled developer note independently contains the same item. Public-only Spotlight preparation, enterprise fixes, general security language, and maintenance summaries are excluded.

The resulting RC inventory is:

- iOS and iPadOS: HealthKit authorization and overlapping-sample statistics, Messages HDR screenshots, sticker-data recovery, and the grouped Object Capture / StoreKit Simulator corrections.
- macOS: encrypted-HFS+ CoreStorage deprecation, false Intel-only notices, overlapping-sample HealthKit statistics, and Messages HDR screenshots.
- tvOS: overlapping-sample HealthKit statistics and StoreKit Simulator session connectivity.
- visionOS and watchOS: HealthKit authorization, overlapping-sample statistics, and StoreKit Simulator session connectivity.

Every occurrence uses \`inheritance: "delta"\`, \`documentedStatus: "documented"\`, and \`evidenceState: "confirmed"\`. No cumulative public item is inherited.

## Artifact-metadata boundary

The event articles intentionally make no claim about the historical RC build numbers or release dates. During closure review, the six dated Apple News URLs initially considered for this purpose were found to be mutable category views that no longer expose the asserted July 20 RC entries. They were removed as sources and are not cited.

This remains deliberately an event-page-only batch, so \`builds\` is empty. A later build-metadata cohort would require durable first-party evidence independently proving the exact RC artifacts; this batch does not infer them from the timeline, mutable Apple News category pages, or later Public build records.

## Sources and copyright method

All summaries, article paragraphs, and occurrence descriptions are new synthesis. Apple issue identifiers, build numbers, platform names, framework names, and API identifiers are factual nominative references. The manifest does not copy Apple paragraphs, developer-note lists, marketing language, or trademark boilerplate.

DocC JSON URLs are declared only as \`transportUrl\` research metadata. Reader-facing citations use the human-readable Apple Developer pages. Each claim has a section-level locator.

The Apple Developer pages are mutable. This batch records their state as accessed on 2026-07-30: each 26.6 page still identified the Release Candidate. A later title change must not be treated as evidence for earlier betas.

## Validation

- JSON parsing and launch-content schema validation passed. The repository validator accepted every concurrent research batch and all globally consistent change keys at the final validation checkpoint; this batch contributes 46 citations.
- Seed closure: 12 exact versions, 82 exact milestones, 70 beta/RC routes, 12 Public routes, and no Public Beta route.
- Ownership closure: 6 new durable RC selectors, no overlap with another research batch, and no overlap with the approved Public routes.
- Change closure: 22 unique platform-scoped keys exactly match their approved reusable definitions.
- Citation closure: every citation URL has one declared source and every declared source is used.
- Review state: all 6 events are \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and indexable.
- Deterministic bundle SHA-256: \`${jsonSha}\`.
- A second generator run reproduced the JSON byte for byte at the same SHA-256.
- Focused launch-content ingestion and manifest tests passed 19 of 19.
- ESLint passed for the generator, and Prettier passed for the generator, JSON, and ledger.
- The reviewed production dry run reported 0 creates, 28 revision-guarded patches, and 2,081 unchanged documents. No source, version, event, build, or change document was created.
- Six patches enriched the exact existing RC events with article body, changes, citations, approval state, indexing state, and summary. Twenty-two release-change patches recorded the same editorial review timestamp; one of those also added the independent RC developer-note citation to the existing approved macOS Messages HDR change.
- No version, Public event, build, or other route was patched. No field was unset and no document was deleted.
- Reviewed production plan SHA-256: \`d1eff761fb0f90b55b7fa941f25614ae542c2c88487585ca3f77be12b24c0da2\`; mutation payload: 47,054 bytes (1.2% of the guarded limit).
- Serialized plan artifact SHA-256: \`a58475785d2d82b2de6b00eb980361d1434fc62d70188b33b4124db1411984e6\`; rollback artifact SHA-256: \`6852d31118ab3deac3c5ce42d10c41837611af375e5d59d3bef3cc9cfd4ac347\`.
- The exact reviewed plan committed as Sanity transaction \`tt1fSB5HY9GAB0YLyyFYZs\`; receipt SHA-256: \`6d2934c104cf269132566fe7cbe3f54d22336d837f2575eaff4b181689973903\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,109 unchanged documents with zero-plan SHA \`bf2d29ea07045ba55fa5590ff8c270145e69bd819c2bbe0d4fe8deb91fb261be\`.
- All six local routes returned HTTP 200 with article copy, structured changes, references, and \`index, follow\`.

## Human approval checklist

- [x] Accepted the evidence-based omission of all 26.5 prerelease pages.
- [x] Accepted the omission of 26.6 Beta 1–5 because no durable per-beta primary snapshot remains.
- [x] Accepted the six RC-titled developer-note pages as exact 26.6 RC evidence.
- [x] Accepted reuse of approved change identities only where the RC page independently repeats the item.
- [x] Approved the six substantive RC events for indexing at \`${reviewedAt}\`.

## Reproduction

\`\`\`bash
node scripts/research-batches/build-apple-26-5-26-6-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-26-5-26-6-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-26-5-26-6-prerelease.mjs scripts/research-batches/apple-26-5-26-6-prerelease.json scripts/research-batches/apple-26-5-26-6-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-26-5-26-6-prerelease.json
\`\`\`

The final command is a dry run only. Do not add \`--apply\` or any approval flags in this research pass.
`;

const formattedMarkdown = await prettier.format(markdown, {
  parser: "markdown",
  printWidth: 100,
  proseWrap: "preserve",
});

await writeFile(jsonPath, formattedJson);
await writeFile(ledgerPath, formattedMarkdown);
