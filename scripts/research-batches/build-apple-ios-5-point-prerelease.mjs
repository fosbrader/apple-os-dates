import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-5-point-prerelease.json";
const ledgerName = "apple-ios-5-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T13:22:09Z";
const completedPrereleaseSha =
  "f045f59eb1f8d159cb9c24892821d43e4050e57c3e0b516c238cb0d006bcde66";

const verification = {
  researchBatches: 73,
  globalChangeKeys: 4_214,
  focusedTests: 19,
  fullTests: 131,
  htmlLocatorAssertions: 88,
  pdfLocatorAssertions: 38,
  maximumLocatorWords: 16,
  copyrightFields: 151,
  maximumEditorialOverlapWords: 5,
  independentSourcesFetched: 15,
  independentRawExact: 9,
  independentSelectedTextAvailable: 13,
  independentNormalizedExact: 12,
  independentMarkerMatches: 14,
  independentEvidenceReproduced: 15,
};

const dryRun = {
  creates: 35,
  patches: 9,
  unchanged: 2_131,
  eventCreates: 5,
  sourceCreates: 14,
  changeCreates: 16,
  mutationPayloadBytes: 88_309,
  planSha: "3424cdf842efcb532a0ff1931541bc0c9c3ba7f858fd37a57c8eb2d87831fc23",
  planArtifactSha:
    "2fdf9270704c150d7a9d70e19eea2618fc825665a550d49d800831a3ea3f4fab",
  rollbackArtifactSha:
    "217fd55027e485f534632ba5a685b64f50cf994e9722cfbb186189b98d4eea60",
  patchBoundary:
    "nine existing approved change documents receive citation unions plus refreshed approved-review timestamps; all semantic definitions remain unchanged, and there are zero source, version, event, or build patches",
};
const publicationRecord = {
  transactionId: "F0eE6eK5XyVXtlnaoycGEX",
  receiptSha:
    "ea1165b5bb47762c4ecda93efbb5051e071f5295bb261a4c8b65d6e095bac058",
  zeroPlanSha:
    "95f67c223eeeaa329e42b8669c814df4f248ffdfb07c378529cfcd141a4523b4",
  zeroPlanArtifactSha:
    "33c5a108227a0e873312e5fc9513fd95bc6d390869e84541d77dc4d0496b9f7f",
  zeroRollbackArtifactSha:
    "9e7fb02147b39f6097b57d4c36906e0535cba34725bdc7a9ac3b02e211b679b6",
  zeroUnchanged: 2_175,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 2_032,
    fullAppearances: 479,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 630,
  },
};

const U = {
  apple501Beta1: "https://developer.apple.com/news/?id=11032011a",
  mr501Beta1:
    "https://www.macrumors.com/2011/11/02/apple-posts-ios-5-0-1-beta-for-developers/",
  nine501Beta2: "https://9to5mac.com/2011/11/04/apple-seeds-ios-5-beta-2/",
  mr501Beta2:
    "https://www.macrumors.com/2011/11/04/apple-seeds-ios-5-0-1-beta-2-to-developers/",
  macstories501Beta2:
    "https://www.macstories.net/news/apple-releases-ios-5-0-1-beta-2/",
  apple501Public: "https://developer.apple.com/news/?id=11102011a",
  mr51Beta1:
    "https://www.macrumors.com/2011/11/28/apple-begins-seeding-of-ios-5-1-beta-xcode-4-3-to-developers/",
  pdf51Beta1: "https://iszene.com/uploads/9ul0quu9psp8mp6ewa3.pdf",
  mr51Beta2:
    "https://www.macrumors.com/2011/12/12/apple-seeds-ios-5-1-beta-2-to-developers-enables-photo-stream-photo-deletion/",
  cult51Beta2:
    "https://www.cultofmac.com/news/apple-releases-ios-5-1-beta-2-to-developers",
  mr51Beta3:
    "https://www.macrumors.com/2012/01/09/apple-seeds-ios-5-1-beta-3-to-developers/",
  apple51BetaBoundary: "https://developer.apple.com/news/?id=02162012b",
  mr51InternalGm:
    "https://www.macrumors.com/2012/03/06/testing-on-ios-5-1-golden-master-reportedly-complete-ahead-of-ipad-3-launch/",
  imore51NoGm: "https://www.imore.com/ios-5-1-review",
  appleSupport: "https://support.apple.com/en-us/102998",
};

const publicPath = join(here, "apple-ios-5.json");
const completedPrereleasePath = join(here, "apple-ios-5-prerelease.json");
const publicBatch = JSON.parse(readFileSync(publicPath, "utf8"));
const completedPrereleaseRaw = readFileSync(completedPrereleasePath);
if (
  createHash("sha256").update(completedPrereleaseRaw).digest("hex") !==
  completedPrereleaseSha
) {
  throw new Error(
    "The completed iOS 5.0 prerelease archive changed; preserve and re-audit it before building this separate point-release batch.",
  );
}
const completedPrereleaseBatch = JSON.parse(completedPrereleaseRaw);
const appleSupportSource = publicBatch.sources.find(
  (source) => source.url === U.appleSupport,
);
if (!appleSupportSource) {
  throw new Error("The approved iOS 5 batch lost its Apple Support source.");
}

const sources = [
  {
    url: U.apple501Beta1,
    title: "New File Attribute for Managing Data Backups",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2011-11-03T00:00:00.000Z",
    topics: [
      "iOS",
      "5.0.1",
      "Beta 1",
      "developer availability",
      "storage retention",
    ],
  },
  {
    url: U.mr501Beta1,
    title:
      "Apple Seeds iOS 5.0.1 Beta: Multitasking Gestures for iPad 1, Battery Life Improvements",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2011-11-02T21:38:37.000Z",
    topics: ["iOS", "5.0.1", "Beta 1", "release identity", "release notes"],
  },
  {
    url: U.nine501Beta2,
    title: "Apple Issues iOS 5.0.1 Beta 2",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "9to5 Staff",
    publishedAt: "2011-11-04T17:50:26.000Z",
    topics: [
      "iOS",
      "5.0.1",
      "Beta 1",
      "Beta 2",
      "Smart Cover",
      "changelog boundary",
    ],
  },
  {
    url: U.mr501Beta2,
    title: "Apple Seeds iOS 5.0.1 Beta 2 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-11-04T17:49:19.000Z",
    topics: ["iOS", "5.0.1", "Beta 2", "release identity"],
  },
  {
    url: U.macstories501Beta2,
    title: "Apple Releases iOS 5.0.1 Beta 2",
    publisher: "MacStories",
    sourceClass: "journalism",
    author: "Chris Herbert",
    publishedAt: "2011-11-05T00:00:21.000Z",
    topics: ["iOS", "5.0.1", "Beta 2", "activation", "scope boundary"],
  },
  {
    url: U.apple501Public,
    title: "iOS 5.0.1 Now Available to Customers",
    publisher: "Apple Developer",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-11-10T00:00:00.000Z",
    topics: ["iOS", "5.0.1", "Public", "release boundary"],
  },
  {
    url: U.mr51Beta1,
    title: "Apple Begins Seeding of iOS 5.1 Beta, Xcode 4.3 to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2011-11-28T23:45:56.000Z",
    topics: ["iOS", "5.1", "Beta 1", "release identity"],
  },
  {
    url: U.pdf51Beta1,
    title: "iOS SDK Release Notes for iOS 5.1 Beta 1 (preserved PDF)",
    publisher: "iSzene document mirror",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2011-11-29T08:25:14.000Z",
    topics: [
      "iOS",
      "5.1",
      "Beta 1",
      "Apple Developer release notes",
      "historical PDF",
    ],
  },
  {
    url: U.mr51Beta2,
    title:
      "Apple Seeds iOS 5.1 Beta 2 to Developers, Enables Photo Stream Photo Deletion",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Jordan Golson",
    publishedAt: "2011-12-12T19:01:34.000Z",
    topics: [
      "iOS",
      "5.1",
      "Beta 2",
      "release identity",
      "Photo Stream",
      "build ambiguity",
    ],
  },
  {
    url: U.cult51Beta2,
    title: "Apple Releases iOS 5.1 Beta 2 to Developers",
    publisher: "Cult of Mac",
    sourceClass: "journalism",
    author: "John Brownlee",
    publishedAt: "2011-12-12T19:16:28.000Z",
    topics: [
      "iOS",
      "5.1",
      "Beta 2",
      "Apple Developer release-note reproduction",
    ],
  },
  {
    url: U.mr51Beta3,
    title:
      "Apple Seeds iOS 5.1 Beta 3 to Developers, Restores 'Enable 3G' Toggle",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2012-01-09T18:38:03.000Z",
    topics: [
      "iOS",
      "5.1",
      "Beta 3",
      "release identity",
      "backup exclusion",
      "3G control",
      "build ambiguity",
    ],
  },
  {
    url: U.apple51BetaBoundary,
    title: "Xcode 4.3 Now Available on the Mac App Store",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2012-02-16T00:00:00.000Z",
    topics: ["iOS", "5.1", "Beta", "cycle boundary", "Xcode"],
  },
  {
    url: U.mr51InternalGm,
    title:
      "Testing on iOS 5.1 Golden Master Reportedly Complete Ahead of iPad 3 Launch",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2012-03-06T19:53:35.000Z",
    topics: ["iOS", "5.1", "internal GM", "carrier testing", "cycle boundary"],
  },
  {
    url: U.imore51NoGm,
    title: "iOS 5.1 for iPhone and iPad Walkthrough",
    publisher: "iMore",
    sourceClass: "journalism",
    author: "Rene Ritchie",
    publishedAt: "2012-03-11T05:45:17.000Z",
    topics: ["iOS", "5.1", "Public", "developer GM boundary"],
  },
  appleSupportSource,
];

const c = (url, context, locator, note) => ({
  url,
  locator: `${context} — ${locator}`,
  ...(note ? { note } : {}),
});
const review = () => ({ status: "approved", reviewedAt });
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({
  authorship: "originalSynthesis",
  blocks,
});
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};
const definitionValue = (change) => ({
  key: change.key,
  title: change.title,
  canonicalSummary: change.canonicalSummary,
  category: change.category,
});
const collectDefinitions = (batch, label) => {
  const result = new Map();
  for (const owner of [
    ...(batch.versions || []),
    ...(batch.events || []),
    ...(batch.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const definition = definitionValue(change);
      const previous = result.get(change.key);
      if (
        previous &&
        JSON.stringify(stableValue(previous)) !==
          JSON.stringify(stableValue(definition))
      ) {
        throw new Error(`${label} has definition drift for ${change.key}.`);
      }
      result.set(change.key, definition);
    }
  }
  return result;
};

const publicDefinitions = collectDefinitions(publicBatch, "apple-ios-5.json");
const completedPrereleaseDefinitions = collectDefinitions(
  completedPrereleaseBatch,
  "apple-ios-5-prerelease.json",
);
const definitions = new Map();
const sharedOwners = new Map();
const define = (key, title, canonicalSummary, category) => {
  if (!key.startsWith("ios5-point-prerelease-")) {
    throw new Error(`New point-release key lacks the cohort prefix: ${key}.`);
  }
  const definition = { key, title, canonicalSummary, category };
  const previous = definitions.get(key);
  if (
    previous &&
    JSON.stringify(stableValue(previous)) !==
      JSON.stringify(stableValue(definition))
  ) {
    throw new Error(`Local definition drifted for ${key}.`);
  }
  definitions.set(key, definition);
  return key;
};
const reuse = (key, ownerPath, ownerDefinitions) => {
  const definition = ownerDefinitions.get(key);
  if (!definition) {
    throw new Error(`Missing shared definition ${key} in ${ownerPath}.`);
  }
  const previous = definitions.get(key);
  if (
    previous &&
    JSON.stringify(stableValue(previous)) !==
      JSON.stringify(stableValue(definition))
  ) {
    throw new Error(`Shared definition drifted locally for ${key}.`);
  }
  definitions.set(key, definition);
  sharedOwners.set(key, ownerPath);
  return key;
};
const reusePublic = (key) => reuse(key, publicPath, publicDefinitions);
const reuseCompletedPrerelease = (key) =>
  reuse(key, completedPrereleasePath, completedPrereleaseDefinitions);

const K = {
  battery: reusePublic("ios-5-0-1-battery-life"),
  ipadGestures: reusePublic("ios-5-0-1-original-ipad-gestures"),
  documentsCloud: reusePublic("ios-5-0-1-documents-cloud"),
  australianDictation: reusePublic("ios-5-0-1-australian-dictation"),
  smartCover: reusePublic("ios-5-0-1-smart-cover-passcode"),
  mobileBackupRetention: define(
    "ios5-point-prerelease-mobilebackup-retention",
    "Low-storage file retention attribute",
    "Developers gained a file attribute for identifying content that should survive automatic cleanup during storage pressure.",
    "developerApi",
  ),
  activationFailures: define(
    "ios5-point-prerelease-activation-failures",
    "Beta activation failures",
    "The second iOS 5.0.1 seed addressed activation failures reported against the preceding seed.",
    "bugFix",
  ),
  dnsPeerToPeer: define(
    "ios5-point-prerelease-dns-peer-to-peer-default",
    "Peer-to-peer service-discovery defaults",
    "DNS service-discovery calls stopped including peer-to-peer interfaces unless an application requested them explicitly.",
    "behavior",
  ),
  gameCenterProfileMedia: define(
    "ios5-point-prerelease-game-center-profile-media",
    "Game Center profile-media loading",
    "Game Center integrations could fail to display application icons and user profile images.",
    "bugFix",
  ),
  iCloudProvisioning: define(
    "ios5-point-prerelease-icloud-provisioning-profile",
    "iCloud provisioning-profile enablement",
    "Provisioning profiles needed explicit iCloud enablement before an application could use cloud storage.",
    "developerApi",
  ),
  metadataSort: reuseCompletedPrerelease(
    "ios5-prerelease-nsmetadataquery-sort",
  ),
  protectedCloudData: reuseCompletedPrerelease(
    "ios5-prerelease-protected-cloud-data",
  ),
  cloudFilenameCase: reuseCompletedPrerelease(
    "ios5-prerelease-cloud-filename-case",
  ),
  moviePlayerPreparation: define(
    "ios5-point-prerelease-movie-player-preparation",
    "Movie-player preparation timing",
    "New movie-player instances no longer prepared themselves for playback automatically during initialization.",
    "behavior",
  ),
  shakeShuffleFreeze: define(
    "ios5-point-prerelease-shake-shuffle-freeze",
    "Shake to Shuffle playback freeze",
    "Invoking Shake to Shuffle could freeze Music and halt playback in this seed.",
    "knownIssue",
  ),
  newsstandDeleteCrash: define(
    "ios5-point-prerelease-newsstand-current-issue-delete",
    "Deleting the active Newsstand issue",
    "Removing the Newsstand issue currently open for reading could terminate the application.",
    "bugFix",
  ),
  xcodeDocsOrganizer: define(
    "ios5-point-prerelease-xcode-documentation-organizer",
    "Xcode documentation-organizer text entry",
    "Typing into fields in Xcode's documentation organizer could trigger an exception.",
    "bugFix",
  ),
  uninstallDevtools: define(
    "ios5-point-prerelease-uninstall-devtools-running-xcode",
    "Developer-tools removal while Xcode runs",
    "Running the developer-tools removal script while Xcode remained open could delete unrelated files or packages.",
    "bugFix",
  ),
  linkConditionerLaunch: define(
    "ios5-point-prerelease-network-link-conditioner-launch",
    "Network Link Conditioner service launch",
    "The network-conditioning service could fail to start after installation until the computer restarted.",
    "bugFix",
  ),
  photoStreamDelete: reusePublic("ios-5-1-photo-stream-delete"),
  setupAssistantLoop: define(
    "ios5-point-prerelease-setup-assistant-loop",
    "Setup Assistant reappearance loop",
    "Setup Assistant could reopen at its Wi-Fi or completion screen immediately after initial setup.",
    "knownIssue",
  ),
  lockCameraShortcut: define(
    "ios5-point-prerelease-lock-camera-shortcut",
    "Lock-screen camera shortcut state",
    "The camera shortcut could disappear after a Home-button double press until the device restarted.",
    "knownIssue",
  ),
  xcodeSingleBundle: define(
    "ios5-point-prerelease-xcode-single-application-bundle",
    "Single-bundle Xcode preview",
    "The Xcode 4.3 preview consolidated its developer tools inside Xcode.app for direct installation.",
    "developerApi",
  ),
  backupExclusionApi: define(
    "ios5-point-prerelease-nsurl-backup-exclusion",
    "Backup-exclusion resource key",
    "Developers gained an NSURL resource key for keeping selected files and directories out of device backups.",
    "developerApi",
  ),
  enable3gToggle: define(
    "ios5-point-prerelease-enable-3g-toggle",
    "Enable 3G cellular control",
    "The third beta restored a Settings control for disabling 3G data on supported devices.",
    "behavior",
  ),
};

const routes = [
  {
    releaseVersionId: "version-ios-5-0-1",
    version: "5.0.1",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2011-11-02",
    sequence: 1,
    stableEventId: "event:apple:ios:5.0.1:beta-1",
    identityCitation: c(
      U.mr501Beta1,
      "Release identity",
      "Apple just released iOS 5.0.1 beta to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-5-0-1",
    version: "5.0.1",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2011-11-04",
    sequence: 2,
    stableEventId: "event:apple:ios:5.0.1:beta-2",
    identityCitation: c(
      U.mr501Beta2,
      "Release identity",
      "Apple has already pushed out a second version for testing",
    ),
  },
  {
    releaseVersionId: "version-ios-5-1",
    version: "5.1",
    alias: "beta-1",
    label: "Beta 1",
    channel: "developerBeta",
    date: "2011-11-28",
    sequence: 1,
    stableEventId: "event:apple:ios:5.1:beta-1",
    identityCitation: c(
      U.mr51Beta1,
      "Release identity",
      "Apple has seeded developers with the first version of iOS 5.1 Beta",
    ),
  },
  {
    releaseVersionId: "version-ios-5-1",
    version: "5.1",
    alias: "beta-2",
    label: "Beta 2",
    channel: "developerBeta",
    date: "2011-12-12",
    sequence: 2,
    stableEventId: "event:apple:ios:5.1:beta-2",
    identityCitation: c(
      U.mr51Beta2,
      "Release identity",
      "Apple has released iOS 5.1 Beta 2 to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-5-1",
    version: "5.1",
    alias: "beta-3",
    label: "Beta 3",
    channel: "developerBeta",
    date: "2012-01-09",
    sequence: 3,
    stableEventId: "event:apple:ios:5.1:beta-3",
    identityCitation: c(
      U.mr51Beta3,
      "Release identity",
      "Apple today seeded iOS 5.1 Beta 3 to developers",
    ),
  },
];
const routeKey = (releaseVersionId, alias) => `${releaseVersionId}/${alias}`;
const routeByKey = new Map(
  routes.map((route) => [routeKey(route.releaseVersionId, route.alias), route]),
);

const occurrenceRows = [];
const add = (
  releaseVersionId,
  alias,
  key,
  action,
  documentedStatus,
  evidenceState,
  citations,
  summary,
  verificationMethod,
  { inheritance = "delta" } = {},
) => {
  occurrenceRows.push({
    releaseVersionId,
    alias,
    key,
    action,
    documentedStatus,
    evidenceState,
    citations,
    summary,
    verificationMethod,
    inheritance,
  });
};
const addCumulative = (...args) =>
  add(...args, {
    inheritance: "cumulative",
  });

add(
  "version-ios-5-0-1",
  "beta-1",
  K.battery,
  "fixed",
  "documented",
  "corroborated",
  [c(U.mr501Beta1, "Release-note item", "Fixes bugs affecting battery life")],
  "The first seed associated the maintenance update with repairs for unspecified battery-life defects.",
  "A contemporaneous release-day report retained the short maintenance-note item; this occurrence does not infer the underlying defects.",
);
add(
  "version-ios-5-0-1",
  "beta-1",
  K.ipadGestures,
  "introduced",
  "documented",
  "corroborated",
  [
    c(
      U.mr501Beta1,
      "Release-note item",
      "Adds Multitasking Gestures for original iPad",
    ),
  ],
  "The first maintenance beta exposed the multitasking gesture set on the original iPad.",
  "The release-day report preserves a discrete developer-note item for the original iPad.",
);
add(
  "version-ios-5-0-1",
  "beta-1",
  K.documentsCloud,
  "fixed",
  "documented",
  "corroborated",
  [
    c(
      U.mr501Beta1,
      "Release-note item",
      "Resolves bugs with Documents in the Cloud",
    ),
  ],
  "The seed carried general repairs for Apple's cloud-document workflow without naming individual failures.",
  "The retained report supports the bounded maintenance category but not a more detailed defect list.",
);
add(
  "version-ios-5-0-1",
  "beta-1",
  K.australianDictation,
  "changed",
  "documented",
  "corroborated",
  [
    c(
      U.mr501Beta1,
      "Release-note item",
      "Improves voice recognition for Australian users using dictation",
    ),
  ],
  "The beta described a recognition improvement for Australian English dictation users.",
  "The occurrence is limited to the audience and capability named in contemporaneous release coverage.",
);
add(
  "version-ios-5-0-1",
  "beta-1",
  K.smartCover,
  "fixed",
  "partiallyDocumented",
  "corroborated",
  [
    c(
      U.nine501Beta2,
      "Beta 1 retrospective",
      "fixed the Smart Cover security flaw",
    ),
    c(
      U.mr501Beta1,
      "Developer-note category",
      "Contains security improvements",
    ),
  ],
  "Release-day notes only named security work broadly; later coverage of Beta 2 identified the Smart Cover lock-screen repair in its Beta 1 recap.",
  "The specific repair is supported by a contemporaneous retrospective and bounded by the original seed's general security category.",
);
add(
  "version-ios-5-0-1",
  "beta-1",
  K.mobileBackupRetention,
  "introduced",
  "documented",
  "confirmed",
  [
    c(
      U.apple501Beta1,
      "Developer API",
      "new way for developers to specify files that should remain on device",
    ),
  ],
  "Apple exposed a developer mechanism for protecting designated offline content from low-storage cleanup.",
  "A surviving Apple Developer entry directly describes the file-retention capability.",
);
add(
  "version-ios-5-0-1",
  "beta-2",
  K.activationFailures,
  "fixed",
  "undocumented",
  "reported",
  [c(U.macstories501Beta2, "Observed repair", "failed activations")],
  "Contemporaneous reporting attributed the second seed to activation problems seen with the first beta.",
  "The report says the earlier seed apparently had activation defects; no public changelog was available, so this remains reported rather than confirmed.",
);

add(
  "version-ios-5-1",
  "beta-1",
  K.dnsPeerToPeer,
  "changed",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "Networking",
      "NSNetService class and CFNetService APIs do not include P2P interfaces by default",
    ),
  ],
  "Service-discovery APIs required explicit peer-to-peer inclusion instead of searching those interfaces automatically.",
  "The byte-verified Apple-authored PDF states the revised default and names the affected API families.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.gameCenterProfileMedia,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "Game Center",
      "App Icons and Profile Photos are not loading in apps using Game Center",
    ),
  ],
  "Applications using Game Center could show neither their icons nor players' profile images.",
  "The preserved Apple-authored notes list the rendering failure as current Beta 1 state.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.iCloudProvisioning,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "iCloud Storage",
      "Provisioning profiles must be enabled for iCloud",
    ),
  ],
  "Using iCloud storage depended on a provisioning profile that had been enabled for the service.",
  "The retained Apple-authored document states the provisioning prerequisite.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.metadataSort,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "iCloud Storage",
      "setSortDescriptors: method of NSMetadataQuery is not supported",
    ),
  ],
  "The first 5.1 seed continued to lack sort-descriptor support in metadata queries.",
  "The API limitation is explicitly present in the byte-verified developer document.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.protectedCloudData,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "iCloud Storage",
      "files that are protected via Data Protection cannot be used with iCloud Storage APIs",
    ),
  ],
  "Cloud-document storage remained incompatible with files guarded by Data Protection.",
  "The Apple-authored PDF directly records the incompatibility for this milestone.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.cloudFilenameCase,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "iCloud Storage",
      "File names are case-insensitive in Mac OS X but case-sensitive in iOS",
    ),
  ],
  "Different filename case rules across Mac and iOS still created a cloud-document interoperability risk.",
  "The preserved developer notes contrast the two platforms' filename behavior.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.moviePlayerPreparation,
  "changed",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "Media Player",
      "movie player is not automatically prepared to play upon creation",
    ),
  ],
  "Applications needed to prepare a newly created movie player before starting playback.",
  "The retained Apple-authored release notes describe this preparation behavior.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.shakeShuffleFreeze,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "Music",
      "Using shake-to-shuffle causes Music app to freeze and playback to stop",
    ),
  ],
  "The gesture-based shuffle action could lock the Music application and interrupt audio.",
  "The issue appears as a current limitation in the verified PDF.",
);
add(
  "version-ios-5-1",
  "beta-1",
  K.newsstandDeleteCrash,
  "fixed",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "Newsstand",
      "Deleting an issue that was marked as the currently reading issue could cause a crash",
    ),
  ],
  "The seed repaired a crash triggered by deleting the Newsstand issue selected for reading.",
  "The Apple-authored artifact explicitly marks this Newsstand condition as fixed.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.xcodeDocsOrganizer,
  "knownIssue",
  "documented",
  "confirmed",
  [c(U.pdf51Beta1, "Xcode", "documentation organizer causes an exception")],
  "Entering text in Xcode's documentation organizer could raise an exception.",
  "The Beta 1 PDF records the organizer failure as a current developer-tools issue.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.uninstallDevtools,
  "knownIssue",
  "documented",
  "confirmed",
  [c(U.pdf51Beta1, "Xcode", "mistakenly removes files and packages")],
  "The removal script risked deleting files beyond its target when Xcode was still running.",
  "The exact script hazard is present in the byte-verified Apple-authored document.",
);
addCumulative(
  "version-ios-5-1",
  "beta-1",
  K.linkConditionerLaunch,
  "knownIssue",
  "documented",
  "confirmed",
  [
    c(
      U.pdf51Beta1,
      "Xcode",
      "Network Link Conditioner daemon cannot be launched",
    ),
  ],
  "After installation, the network-conditioning service could remain unavailable until a restart.",
  "The preserved Beta 1 notes identify the launch failure and its restart workaround.",
);

add(
  "version-ios-5-1",
  "beta-2",
  K.gameCenterProfileMedia,
  "fixed",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "GameKit FIXED",
      "App icons and profile photos are not loading in apps using Game Center",
    ),
  ],
  "The second seed marked the missing Game Center icons and profile pictures as repaired.",
  "A contemporaneous transcript preserves an explicit FIXED marker; the raw-page audit verifies the marker inventory.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.photoStreamDelete,
  "introduced",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "iCloud Photo Stream NEW",
      "Photos taken using iOS 5.1 can be deleted from Photo Stream",
    ),
    c(
      U.mr51Beta2,
      "Release coverage",
      "addition of a much-requested feature related to the management of photos in the Photo Stream",
    ),
  ],
  "Photo Stream gained on-device deletion, with removals propagating to other devices on the same beta.",
  "The discrete NEW marker and independent release coverage agree on the Photo Stream management addition.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.setupAssistantLoop,
  "knownIssue",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "Setup Assistant NEW",
      "Immediately after completing the Setup Assistant, it may re-appear",
    ),
  ],
  "Setup Assistant could return to its Wi-Fi or completion step just after setup had finished.",
  "The retained developer-note transcript labels the loop NEW, and the audit checks that status marker in the article body.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.lockCameraShortcut,
  "knownIssue",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "SpringBoard Lock Screen NEW",
      "double-clicking the home button will no longer bring up the camera button",
    ),
  ],
  "A lock-screen state could suppress the camera control after a Home-button double press.",
  "The milestone transcript carries an explicit NEW marker and a restart workaround for this state.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.xcodeSingleBundle,
  "introduced",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "Xcode Developer Tools NEW",
      "distributed as a single application bundle, Xcode.app",
    ),
  ],
  "The Xcode preview packaged its tools together inside the application instead of relying on a separate installer.",
  "The retained notes mark the packaging model NEW for the preview release.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.xcodeDocsOrganizer,
  "fixed",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "Xcode FIXED",
      "documentation organizer causes an exception",
    ),
  ],
  "Beta 2 marked the documentation-organizer exception from the preceding seed as repaired.",
  "The transcript preserves an explicit FIXED marker that closes the Beta 1 state.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.uninstallDevtools,
  "fixed",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "Xcode FIXED",
      "script mistakenly removes files and packages",
    ),
  ],
  "The second beta marked the removal script's overbroad deletion behavior as fixed.",
  "A FIXED entry in the retained transcript matches the script issue recorded in Beta 1.",
);
add(
  "version-ios-5-1",
  "beta-2",
  K.linkConditionerLaunch,
  "fixed",
  "documented",
  "corroborated",
  [
    c(
      U.cult51Beta2,
      "Xcode FIXED",
      "Network Link Conditioner daemon cannot be launched",
    ),
  ],
  "The network-conditioning service's post-install launch failure was marked repaired in Beta 2.",
  "The retained transcript explicitly closes the same daemon condition documented for Beta 1.",
);

add(
  "version-ios-5-1",
  "beta-3",
  K.backupExclusionApi,
  "introduced",
  "documented",
  "corroborated",
  [
    c(
      U.mr51Beta3,
      "Release-note API",
      "add the NSURLIsExcludedFromBackupKey attribute to prevent the corresponding file from being backed up",
    ),
  ],
  "The third beta introduced a resource property for omitting selected application content from backup.",
  "Contemporaneous coverage quotes the newly posted developer note and names the exact NSURL key; no build identity is imported.",
);
add(
  "version-ios-5-1",
  "beta-3",
  K.enable3gToggle,
  "changed",
  "undocumented",
  "reported",
  [
    c(
      U.mr51Beta3,
      "Observed setting",
      "new build restores the toggle that allows users to turn off 3G cellular data access",
    ),
  ],
  "Testers reported that the cellular settings once again offered a control for disabling 3G data.",
  "The report attributes the observation to forum participants and notes that full release notes were not yet posted, so the occurrence remains reported.",
);

const occurrence = (row) => {
  const definition = definitions.get(row.key);
  if (!definition) throw new Error(`Missing definition for ${row.key}.`);
  return {
    ...definition,
    action: row.action,
    inheritance: row.inheritance,
    summary: row.summary,
    documentedStatus: row.documentedStatus,
    evidenceState: row.evidenceState,
    verificationMethod: row.verificationMethod,
    citations: row.citations,
  };
};
const changesByRoute = new Map();
for (const row of occurrenceRows) {
  const key = routeKey(row.releaseVersionId, row.alias);
  if (!routeByKey.has(key))
    throw new Error(`Occurrence targets unknown ${key}.`);
  changesByRoute.set(key, [
    ...(changesByRoute.get(key) || []),
    occurrence(row),
  ]);
}

const articleForRoute = (route, changes) => {
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );
  if (route.releaseVersionId === "version-ios-5-0-1") {
    if (route.alias === "beta-1") {
      return article(
        heading("Opening the maintenance cycle"),
        prose(
          "Contemporaneous release coverage places the first 5.0.1 developer seed on November 2, 2011. The surviving Apple Developer entry displays November 3, so this page keeps the release-day identity and records the one-day source mismatch.",
          [
            c(
              U.mr501Beta1,
              "Release date",
              "Wednesday November 2, 2011 2:38 pm PDT",
            ),
            c(U.apple501Beta1, "Apple page date", "November 3, 2011"),
          ],
        ),
        heading("Selected milestone records"),
        prose(
          "Six source-linked records describe the seed's maintenance scope: four broad reliability or usability items, one security repair identified in a contemporary recap, and one first-party storage-management API.",
          changeCitations,
        ),
        heading("Public boundary"),
        prose(
          "Apple announced worldwide availability for 5.0.1 on November 10. That existing Public event remains separately owned and is not patched by this batch.",
          [
            c(
              U.apple501Public,
              "Public boundary",
              "iOS 5.0.1 is now available to iOS users worldwide",
            ),
          ],
        ),
      );
    }
    return article(
      heading("Second developer seed"),
      prose(
        "A release-day report identifies the second iOS 5.0.1 beta on November 4, two days after the opening seed.",
        [
          c(
            U.mr501Beta2,
            "Release date",
            "Friday November 4, 2011 10:49 am PDT",
          ),
        ],
      ),
      heading("Narrow evidence boundary"),
      prose(
        "No public changelog was available at the time. One contemporaneous account connected Beta 2 to activation failures in the prior build and reported no broader visible delta, so only that repair is structured here.",
        [
          c(
            U.nine501Beta2,
            "Changelog boundary",
            "Changelog is not available yet",
          ),
          c(
            U.macstories501Beta2,
            "Reported limited scope",
            "Beyond these bug fixes, it doesn’t appear that iOS 5.0.1 beta 2 contains anything more",
          ),
          ...changeCitations,
        ],
      ),
      heading("End of the beta interval"),
      prose(
        "The first-party Public notice followed on November 10. This archive batch adds no intermediate route and makes no build-number claim.",
        [c(U.apple501Public, "Public notice date", "November 10, 2011")],
      ),
    );
  }

  if (route.alias === "beta-1") {
    return article(
      heading("First iOS 5.1 developer seed"),
      prose(
        "Contemporaneous reporting identifies the first 5.1 beta on November 28, 2011. A preserved three-page Apple-authored PDF provides the detailed milestone state.",
        [
          c(
            U.mr51Beta1,
            "Release date",
            "Monday November 28, 2011 3:45 pm PST",
          ),
          c(
            U.pdf51Beta1,
            "Artifact title",
            "iOS SDK Release Notes for iOS 5.1 beta 1",
          ),
        ],
      ),
      heading("Selected developer-note state"),
      prose(
        "Twelve records capture API behavior, current limitations, and one explicit Newsstand repair. Ten unmarked or explicitly older states are labeled cumulative context; the peer-to-peer default and marked Newsstand repair remain milestone deltas. Three cumulative records concern the accompanying Xcode and developer-tools environment, so they are retained as host-tool context rather than on-device iOS behavior. This is a selected view rather than a transcription of the full document.",
        changeCitations,
      ),
      heading("Preservation and authorship"),
      prose(
        "The linked PDF is a third-party preservation copy of Apple developer material. This page uses new prose, retains technical names only for identification, and stays non-indexable until editorial review.",
        [
          c(
            U.pdf51Beta1,
            "Document heading",
            "iOS SDK Release Notes for iOS 5.1 beta 1",
          ),
        ],
      ),
    );
  }

  if (route.alias === "beta-2") {
    return article(
      heading("Second iOS 5.1 developer seed"),
      prose(
        "Release coverage dates Beta 2 to December 12, 2011. The selected records follow the explicit NEW and FIXED markers retained in a contemporaneous reproduction of Apple's developer notes.",
        [
          c(
            U.mr51Beta2,
            "Release date",
            "Monday December 12, 2011 11:01 am PST",
          ),
          ...changeCitations,
        ],
      ),
      heading("Eight milestone deltas"),
      prose(
        "The page records four additions or current issues and four fixes. Four entries concern the accompanying Xcode developer-tool bundle—one packaging change and three repairs—and are retained as host-tool context rather than on-device iOS behavior. Repeated, unmarked material is excluded instead of being presented as newly changed.",
        changeCitations,
      ),
      heading("Conflicting build evidence"),
      prose(
        "Two contemporaneous pages disagree on the final character of Beta 2's build string: the Beta 2 article shows a c suffix, while the later Beta 3 article refers back to an a suffix. This batch therefore creates no build document.",
        [
          c(U.mr51Beta2, "Beta 2 report", "build number of 9B5127c"),
          c(
            U.mr51Beta3,
            "Beta 3 retrospective",
            "previous Build 9B5127a released ad iOS 5.1 Beta 2 on December 12",
          ),
        ],
      ),
    );
  }

  return article(
    heading("Third iOS 5.1 developer seed"),
    prose(
      "Beta 3 appeared on January 9, 2012. The structured delta is limited to a documented backup-exclusion API and a separately reported return of the 3G control.",
      [
        c(U.mr51Beta3, "Release date", "Monday January 9, 2012 10:38 am PST"),
        ...changeCitations,
      ],
    ),
    heading("Why the route sequence stops here"),
    prose(
      "Apple still directed 5.1 developers to beta tooling on February 16. March reporting described partner testing of an internal Gold Master, while a post-release walkthrough says Apple did not provide developers a final test build before the March 7 Public release. Those facts do not establish a developer GM route.",
      [
        c(
          U.apple51BetaBoundary,
          "February developer state",
          "continue to use Xcode 4.3 Developer Preview with iOS 5.1 SDK beta",
        ),
        c(
          U.mr51InternalGm,
          "Internal distribution",
          "three different partners who are testing the Gold Master",
        ),
        c(
          U.imore51NoGm,
          "Developer GM boundary",
          "Apple didn't release any final build for developers to test against",
        ),
        c(U.imore51NoGm, "Public date", "March 7, 2012"),
      ],
    ),
    heading("No inferred 5.1.1 beta"),
    prose(
      "Apple's consumer archive separately lists 5.1 and 5.1.1, but it does not identify a prerelease seed. Because no exact 5.1.1 beta identity was recovered, this batch creates none.",
      [c(U.appleSupport, "Consumer archive heading", "iOS 5.1.1")],
    ),
  );
};

const events = routes.map((route) => {
  const key = routeKey(route.releaseVersionId, route.alias);
  const changes = changesByRoute.get(key) || [];
  return {
    target: {
      releaseVersionId: route.releaseVersionId,
      routeAlias: route.alias,
    },
    identity: {
      releaseVersionId: route.releaseVersionId,
      platformId: "platform-ios",
      stableEventId: route.stableEventId,
      label: route.label,
      routeAlias: route.alias,
      channel: route.channel,
      appearanceDate: route.date,
      sequence: route.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `iOS ${route.version} ${route.label} is represented by ${changes.length} editorially reviewed, source-backed records from the ${route.date} milestone; unsupported routes and builds are excluded, while cumulative context is labeled explicitly.`,
    article: articleForRoute(route, changes),
    citations: uniqueCitations([
      route.identityCitation,
      ...changes.flatMap((change) => change.citations),
    ]),
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  };
});

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [],
  events,
  builds: [],
};

const expectedSeedInventory = [
  ["5.0", "2011-10-12", [["Public", "2011-10-12", false, undefined]]],
  ["5.0.1", "2011-11-10", [["Public", "2011-11-10", false, undefined]]],
  ["5.1", "2012-03-07", [["Public", "2012-03-07", false, undefined]]],
  ["5.1.1", "2012-05-07", [["Public", "2012-05-07", false, undefined]]],
];
const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.majorVersion === 5)
  .map((version) => [
    version.version,
    version.publicReleaseDate,
    version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  ]);
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iOS 5 seed inventory changed; re-audit this point-release cohort.",
  );
}

const expectedCounts = new Map([
  ["version-ios-5-0-1/beta-1", 6],
  ["version-ios-5-0-1/beta-2", 1],
  ["version-ios-5-1/beta-1", 12],
  ["version-ios-5-1/beta-2", 8],
  ["version-ios-5-1/beta-3", 2],
]);
if (
  bundle.versions.length !== 0 ||
  bundle.builds.length !== 0 ||
  events.length !== expectedCounts.size ||
  events.some((event) => {
    const key = routeKey(
      event.identity.releaseVersionId,
      event.identity.routeAlias,
    );
    const route = routeByKey.get(key);
    return (
      !route ||
      event.target.releaseVersionId !== route.releaseVersionId ||
      event.target.routeAlias !== route.alias ||
      event.identity.stableEventId !== route.stableEventId ||
      event.identity.label !== route.label ||
      event.identity.channel !== route.channel ||
      event.identity.appearanceDate !== route.date ||
      event.identity.sequence !== route.sequence ||
      event.identity.closesReleaseCycle !== false ||
      event.changes.length !== expectedCounts.get(key) ||
      event.authorship !== "originalSynthesis" ||
      event.article.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.some(
        (change) =>
          !["delta", "cumulative"].includes(change.inheritance) ||
          !["reported", "corroborated", "confirmed"].includes(
            change.evidenceState,
          ),
      )
    );
  })
) {
  throw new Error("The expected iOS 5 point-release route closure failed.");
}

const cumulativeOccurrences = events
  .flatMap((event) =>
    event.changes.map((change) => ({
      route: routeKey(
        event.identity.releaseVersionId,
        event.identity.routeAlias,
      ),
      change,
    })),
  )
  .filter(({ change }) => change.inheritance === "cumulative")
  .map(({ route, change }) => `${route}:${change.key}`)
  .sort();
const expectedCumulativeOccurrences = [
  "version-ios-5-1/beta-1:ios5-point-prerelease-game-center-profile-media",
  "version-ios-5-1/beta-1:ios5-point-prerelease-icloud-provisioning-profile",
  "version-ios-5-1/beta-1:ios5-prerelease-nsmetadataquery-sort",
  "version-ios-5-1/beta-1:ios5-prerelease-protected-cloud-data",
  "version-ios-5-1/beta-1:ios5-prerelease-cloud-filename-case",
  "version-ios-5-1/beta-1:ios5-point-prerelease-movie-player-preparation",
  "version-ios-5-1/beta-1:ios5-point-prerelease-shake-shuffle-freeze",
  "version-ios-5-1/beta-1:ios5-point-prerelease-xcode-documentation-organizer",
  "version-ios-5-1/beta-1:ios5-point-prerelease-uninstall-devtools-running-xcode",
  "version-ios-5-1/beta-1:ios5-point-prerelease-network-link-conditioner-launch",
].sort();
if (
  JSON.stringify(cumulativeOccurrences) !==
  JSON.stringify(expectedCumulativeOccurrences)
) {
  throw new Error("The reviewed iOS 5.1 Beta 1 context inventory changed.");
}

const histories = new Map();
for (const event of events) {
  for (const change of event.changes) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.releaseVersionId}/${event.identity.routeAlias}:${change.action}:${change.inheritance}`,
    ]);
  }
}
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
const expectedTransitionHistories = new Map([
  [
    "ios5-point-prerelease-game-center-profile-media",
    [
      "version-ios-5-1/beta-1:knownIssue:cumulative",
      "version-ios-5-1/beta-2:fixed:delta",
    ],
  ],
  [
    "ios5-point-prerelease-xcode-documentation-organizer",
    [
      "version-ios-5-1/beta-1:knownIssue:cumulative",
      "version-ios-5-1/beta-2:fixed:delta",
    ],
  ],
  [
    "ios5-point-prerelease-uninstall-devtools-running-xcode",
    [
      "version-ios-5-1/beta-1:knownIssue:cumulative",
      "version-ios-5-1/beta-2:fixed:delta",
    ],
  ],
  [
    "ios5-point-prerelease-network-link-conditioner-launch",
    [
      "version-ios-5-1/beta-1:knownIssue:cumulative",
      "version-ios-5-1/beta-2:fixed:delta",
    ],
  ],
]);
if (
  repeatedHistories.length !== expectedTransitionHistories.size ||
  repeatedHistories.some(
    ([key, history]) =>
      JSON.stringify(history) !==
      JSON.stringify(expectedTransitionHistories.get(key)),
  )
) {
  throw new Error("The reviewed iOS 5.1 transition inventory changed.");
}

const hostToolOccurrences = events
  .flatMap((event) =>
    event.changes.map((change) => ({
      route: routeKey(
        event.identity.releaseVersionId,
        event.identity.routeAlias,
      ),
      change,
    })),
  )
  .filter(({ change }) =>
    [
      K.xcodeDocsOrganizer,
      K.uninstallDevtools,
      K.linkConditionerLaunch,
      K.xcodeSingleBundle,
    ].includes(change.key),
  )
  .map(
    ({ route, change }) =>
      `${route}:${change.key}:${change.action}:${change.inheritance}`,
  )
  .sort();
const expectedHostToolOccurrences = [
  "version-ios-5-1/beta-1:ios5-point-prerelease-network-link-conditioner-launch:knownIssue:cumulative",
  "version-ios-5-1/beta-1:ios5-point-prerelease-uninstall-devtools-running-xcode:knownIssue:cumulative",
  "version-ios-5-1/beta-1:ios5-point-prerelease-xcode-documentation-organizer:knownIssue:cumulative",
  "version-ios-5-1/beta-2:ios5-point-prerelease-network-link-conditioner-launch:fixed:delta",
  "version-ios-5-1/beta-2:ios5-point-prerelease-uninstall-devtools-running-xcode:fixed:delta",
  "version-ios-5-1/beta-2:ios5-point-prerelease-xcode-documentation-organizer:fixed:delta",
  "version-ios-5-1/beta-2:ios5-point-prerelease-xcode-single-application-bundle:introduced:delta",
].sort();
if (
  JSON.stringify(hostToolOccurrences) !==
  JSON.stringify(expectedHostToolOccurrences)
) {
  throw new Error("The reviewed Xcode host-tool context inventory changed.");
}
if (
  events.some(
    (event) =>
      event.identity.routeAlias === "public" ||
      event.identity.routeAlias === "gm" ||
      event.identity.releaseVersionId === "version-ios-5-1-1",
  )
) {
  throw new Error("A forbidden Public, GM, or iOS 5.1.1 route entered.");
}

for (const releaseVersionId of [
  "version-ios-5-0-1",
  "version-ios-5-1",
  "version-ios-5-1-1",
]) {
  const owners = (publicBatch.events || []).filter(
    (event) =>
      event.target?.releaseVersionId === releaseVersionId &&
      event.target?.routeAlias === "public",
  );
  if (
    owners.length !== 1 ||
    owners[0].editorialReview?.status !== "approved" ||
    owners[0].provenanceStatus !== "editoriallyVerified" ||
    owners[0].isIndexable !== true
  ) {
    throw new Error(
      `The approved Public owner changed for ${releaseVersionId}.`,
    );
  }
}

const localDefinitions = new Map();
for (const change of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(
    stableValue({
      title: change.title,
      canonicalSummary: change.canonicalSummary,
      category: change.category,
    }),
  );
  const previous = localDefinitions.get(change.key);
  if (previous && previous !== definition) {
    throw new Error(`Local definition drifted for ${change.key}.`);
  }
  localDefinitions.set(change.key, definition);
}
if (
  localDefinitions.size !== 25 ||
  sharedOwners.size !== 9 ||
  [...localDefinitions.keys()].some(
    (key) =>
      !sharedOwners.has(key) && !key.startsWith("ios5-point-prerelease-"),
  )
) {
  throw new Error("Canonical key ownership closure changed.");
}

const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherDefinitions = new Map();
const otherRoutes = new Map();
const otherStableEventIds = new Map();
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      const definition = JSON.stringify(
        stableValue({
          title: change.title,
          canonicalSummary: change.canonicalSummary,
          category: change.category,
        }),
      );
      otherDefinitions.set(change.key, [
        ...(otherDefinitions.get(change.key) || []),
        { definition, file },
      ]);
    }
  }
  for (const event of candidate.events || []) {
    const releaseVersionId =
      event.identity?.releaseVersionId || event.target?.releaseVersionId;
    const alias = event.identity?.routeAlias || event.target?.routeAlias;
    const stableEventId =
      event.identity?.stableEventId || event.target?.stableEventId;
    if (releaseVersionId && alias) {
      otherRoutes.set(routeKey(releaseVersionId, alias), file);
    }
    if (stableEventId) otherStableEventIds.set(stableEventId, file);
  }
}
for (const [key, definition] of localDefinitions) {
  const collisions = otherDefinitions.get(key) || [];
  const expectedOwner = sharedOwners.get(key);
  if (!expectedOwner && collisions.length > 0) {
    throw new Error(
      `New point-release key collides with existing content: ${key}.`,
    );
  }
  if (
    expectedOwner &&
    (!collisions.some(
      (collision) =>
        collision.file === expectedOwner && collision.definition === definition,
    ) ||
      collisions.some((collision) => collision.definition !== definition))
  ) {
    throw new Error(`Shared definition ownership drifted for ${key}.`);
  }
}
for (const route of routes) {
  const key = routeKey(route.releaseVersionId, route.alias);
  if (otherRoutes.has(key)) {
    throw new Error(
      `An existing research batch already owns ${key} (${otherRoutes.get(key)}).`,
    );
  }
  if (otherStableEventIds.has(route.stableEventId)) {
    throw new Error(
      `An existing research batch already owns ${route.stableEventId}.`,
    );
  }
}

const citationUrls = new Set();
const collectCitationUrls = (value) => {
  if (Array.isArray(value)) {
    for (const item of value) collectCitationUrls(item);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      for (const citation of item) citationUrls.add(citation.url);
    } else {
      collectCitationUrls(item);
    }
  }
};
collectCitationUrls(bundle);
const sourceUrls = new Set(sources.map((source) => source.url));
const missingSources = [...citationUrls].filter((url) => !sourceUrls.has(url));
const unusedSources = sources.filter((source) => !citationUrls.has(source.url));
if (
  sourceUrls.size !== sources.length ||
  missingSources.length > 0 ||
  unusedSources.length > 0
) {
  throw new Error(
    `Citation closure failed. Unique sources ${sourceUrls.size}/${sources.length}; missing ${missingSources.join(", ")}; unused ${unusedSources
      .map((source) => source.url)
      .join(", ")}.`,
  );
}

const outputPath = join(here, outputName);
const json = await prettier.format(JSON.stringify(bundle), {
  filepath: outputPath,
});
writeFileSync(outputPath, json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const citationReferenceCount = (value) => {
  if (Array.isArray(value)) {
    return value.reduce(
      (total, item) => total + citationReferenceCount(item),
      0,
    );
  }
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce(
    (total, [key, item]) =>
      total +
      (key === "citations" && Array.isArray(item)
        ? item.length
        : citationReferenceCount(item)),
    0,
  );
};
const citationCount = citationReferenceCount(bundle);
const changeCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
const routeRows = events
  .map(
    (event) =>
      `| iOS ${routes.find((route) => route.stableEventId === event.identity.stableEventId).version} ${event.identity.label} | \`${event.target.releaseVersionId}/${event.identity.routeAlias}\` | ${event.identity.appearanceDate} | ${event.changes.length} | ${event.changes.filter((change) => change.action === "fixed").length} | ${event.changes.filter((change) => change.action === "knownIssue").length} |`,
  )
  .join("\n");
const routeVerificationRows = events
  .map((event) => {
    const [, , , version, alias] = event.identity.stableEventId.split(":");
    return `| \`/apple/ios/${version}/${alias}/\` | 200 | 3/3 | ${event.changes.length}/${event.changes.length} | yes | yes | no | index, follow |`;
  })
  .join("\n");
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 5 point-release prerelease archive batch

## Result

\`${outputName}\` is the approved archive batch for the iOS 5.0.1 and 5.1
prerelease cycles. It is isolated from the completed iOS 5.0 archive batch
and does not alter the hardcoded seed timeline or any existing Public event
record. Shared change-definition citation unions are disclosed separately in
the production plan below.

- ${events.length} identity-backed event creates and no release-version overlays
- ${changeCount} selected change occurrences across
  ${localDefinitions.size} canonical definitions
- ${sharedOwners.size} definitions reused byte-for-byte from their existing
  approved or completed owners; ${localDefinitions.size - sharedOwners.size}
  new definitions use the \`ios5-point-prerelease-\` namespace
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- zero builds, build guesses, seed edits, or Public event records
- every event is \`editoriallyVerified\`, \`approved\`, and
  \`isIndexable: true\`

## New historical route closure

| Milestone | New route | Appearance date | Selected changes | Fixed | Current known |
| --- | --- | --- | ---: | ---: | ---: |
${routeRows}

Only exact source-defensible identities are represented. The generator rejects
Public, GM, and every 5.1.1 prerelease route.

## Evidence method

1. iOS 5.0.1 Beta 1 uses contemporaneous release-day reporting for its
   November 2 identity and preserves the surviving Apple Developer page's
   November 3 display date as an explicit one-day ambiguity. Four maintenance
   items reuse approved Public definitions; a later contemporary recap
   identifies the Smart Cover repair, and Apple directly documents the storage
   retention API.
2. Beta 2 has no retained public changelog. Only an activation repair reported
   against the prior seed is structured, with \`reported\` evidence state and
   \`undocumented\` documentation status.
3. iOS 5.1 Beta 1 uses a three-page, Apple-authored PDF preserved by a document
   mirror. PDFKit checks its title, metadata date, pages, and every selected
   locator. Twelve records describe selected milestone state rather than a
   copied changelog. Three Xcode and developer-tools records are labeled as
   host-tool context rather than on-device iOS behavior.
4. Beta 2 uses eight explicit \`NEW\` or \`FIXED\` entries in a contemporaneous
   developer-note reproduction. The raw audit requires exactly four of each
   marker in the article body. Its four Xcode records remain explicitly scoped
   to the accompanying host toolchain.
5. Beta 3 is limited to a documented backup-exclusion API and a reported 3G
   setting observation. Later sources show continued beta tooling, internal
   partner GM testing, and no final developer build before Public.

## Raw-source audit ledger

The HTML and PDF bodies were downloaded on ${accessedAt} to a temporary,
uncommitted audit directory. Hashes cover the exact response bytes.

| Raw artifact | Bytes / pages | SHA-256 | Use |
| --- | ---: | --- | --- |
| Apple Developer 5.0.1 Beta 1 HTML | 106,041 | \`b063eaa5628be42315031ce3d46b99efda129266e7b434743814e3bda2ede5ec\` | Beta 1 API and date ambiguity |
| MacRumors 5.0.1 Beta 1 HTML | 123,486 | \`1078b75d13f6783a8ac4c8bd252f0815224c853538ddd2fd9d3010d69a090ad0\` | Beta 1 identity and maintenance items |
| 9to5Mac 5.0.1 Beta 2 HTML | 146,642 | \`a87cd740fba1409cbbc32eb1719fb730cbeddd196c00e1a127cc65fa318422f7\` | Smart Cover recap and no-changelog boundary |
| MacRumors 5.0.1 Beta 2 HTML | 129,309 | \`da125c56d0c432112027ee2511c56d298df40f5c771cc812cd843afb90bfb3e8\` | Beta 2 identity |
| MacStories 5.0.1 Beta 2 HTML | 43,121 | \`c58bf1792768f43d08665e6c67b76500865b8d09fcf20c014182084cb55a43d5\` | Activation report and scope boundary |
| Apple Developer 5.0.1 Public HTML | 105,974 | \`f14c8c0fed165becd8e07ec9684577ca9c69392be45c7ff1dadd06ad445df815\` | Public boundary |
| MacRumors 5.1 Beta 1 HTML | 123,935 | \`1997bc042703af9c2237f0054158f1e5c68e64d0d9b110217eb950d9dadd7a82\` | Beta 1 identity |
| Apple-authored 5.1 Beta 1 PDF mirror | 76,179 / 3 pages | \`75160cd989483602688931401a452898064d03bbbbdd4fbf99b67bfd2652b35e\` | Beta 1 developer notes |
| MacRumors 5.1 Beta 2 HTML | 124,416 | \`f676e78a8318e42872e17548a6722b25cedc29fff7824229c74068457ad25f8f\` | Beta 2 identity, Photo Stream, build ambiguity |
| Cult of Mac 5.1 Beta 2 HTML | 296,196 | \`98e912d8c92fbfcb83298e39c447edf88e36df68024fbe56c93433fa1d96719a\` | Beta 2 marker transcript |
| MacRumors 5.1 Beta 3 HTML | 129,987 | \`e3c2f37ccba06be3979c05f8fe7ffc34f34a90bbc1da9bc7e26e3ad89f72680b\` | Beta 3 identity, changes, build ambiguity |
| Apple Developer 5.1 beta-boundary HTML | 107,554 | \`87164502a0966d56eb00825555bda27b0fad1b8e910b552b5b93f6b6f7bde659\` | February beta state |
| MacRumors internal-GM HTML | 124,090 | \`ac31f2de3beea6d23e65e3d118461132440e8dadaede02adac5459349a6d75b8\` | Partner-only GM boundary |
| iMore Public walkthrough HTML | 1,094,911 | \`208c0865c36c514dc014327c2bda53298ef12ce6f3c5a908535b502d4583124a\` | No developer-final-build boundary |
| Apple Support iOS 5 HTML | 1,164,087 | \`5d61d349285f4629cb30e476c63cc2c0e3977ff2288694e8046aa4d784ee4a71\` | Consumer 5.1 / 5.1.1 boundary |

Raw evidence is not committed. The HTML audit verifies bytes, hashes, page
markers, every non-PDF citation locator, event counts, and copyright overlap.
The PDFKit audit separately validates the retained PDF and its citation
locators.

## Copyright and editorial method

Every event summary, heading, article paragraph, occurrence title, canonical
summary, occurrence summary, and verification method is scanned against each
retained source independently. The batch uses original synthesis and
retains product or API identifiers only where they are necessary to identify a
claim. The automated ceiling is five contiguous words.

Third-party reproductions are credited as preservation or journalism, never as
first-party hosting. The structured pages select claims and link to sources;
they do not republish source prose or full release-note lists.

## Exact evidence gaps

- The first iOS 5.0.1 seed appeared in release-day reporting on November 2,
  while Apple's surviving developer-news page displays November 3. The event
  uses November 2 and records the mismatch instead of silently blending dates.
- No public Beta 2 changelog for 5.0.1 was retained. The single structured
  repair remains reported and undocumented.
- The detailed 5.1 Beta 1 artifact is an Apple-authored PDF preserved by a
  third-party mirror, not a live first-party download.
- Two contemporaneous pages identify the 5.1 Beta 2 build with different final
  characters: \`9B5127c\` and \`9B5127a\`. No build document is created.
- No developer-distributed iOS 5.1 GM identity was recovered. Internal carrier
  and partner testing is not promoted into a public developer route.
- No exact iOS 5.1.1 prerelease identity was recovered. The batch creates no
  beta, GM, or inferred route for 5.1.1.
- The selections are not exhaustive copies of cumulative release notes.
  iOS 5.1 Beta 1 retains ten unmarked or explicitly older states as labeled
  cumulative context; only its defensible milestone changes remain deltas.

## Source ledger

All sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- exact comparison against the four local iOS 5 seed records
- immutable SHA check for the completed iOS 5.0 prerelease archive:
  \`${completedPrereleaseSha}\`
- exact five-event route, identity, date, channel, sequence, and count allowlist
- explicit rejection of Public, GM, and 5.1.1 prerelease events
- approved/indexable ownership checks for the existing 5.0.1, 5.1, and 5.1.1
  Public pages
- zero release-version overlays and zero builds
- route and stable-ID collision scan across all other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- strict owner and byte-equality guards for ${sharedOwners.size} shared
  definitions; every new key is collision-free and cohort-prefixed
- exact ten-record iOS 5.1 Beta 1 cumulative-context allowlist
- exact four-history Beta 1 known-issue to Beta 2 fix transition allowlist
- exact seven-occurrence Xcode host-tool context allowlist
- complete unique source declaration/use closure
- deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- provenance: \`editoriallyVerified\`
- editorial status: \`approved\`
- indexing: enabled
- reviewed at: \`${reviewedAt}\`
- independent substantive review: clean after cumulative-state,
  known-to-fixed-history, host-tool-scope, evidence-label, and source-custody
  corrections

- repository validation: ${verification.researchBatches || "pending"} batches;
  ${verification.globalChangeKeys || "pending"} globally consistent change keys
- focused ingestion/manifest tests:
  ${verification.focusedTests || "pending"}
- full repository suite: ${verification.fullTests || "pending"}
- HTML locator assertions: ${verification.htmlLocatorAssertions || "pending"}
- PDF locator assertions: ${verification.pdfLocatorAssertions || "pending"}
- longest citation-locator excerpt:
  ${verification.maximumLocatorWords || "pending"} words
- copyright scan:
  ${verification.copyrightFields || "pending"} reader-facing fields;
  maximum overlap ${verification.maximumEditorialOverlapWords || "pending"} words
- independent live re-fetch: all
  ${verification.independentSourcesFetched} declared sources available;
  ${verification.independentRawExact} raw artifacts matched byte-for-byte,
  ${verification.independentNormalizedExact} selected article boundaries
  matched exactly, ${verification.independentMarkerMatches} marker sets
  reproduced, and all ${verification.independentEvidenceReproduced} evidence
  boundaries passed

## Production dry plan

- status: applied and zero-residual verified on ${accessedAt}
- production dry plan: ${dryRun.creates || "pending"} creates,
  ${dryRun.patches || "pending"} patches,
  ${dryRun.unchanged || "pending"} unchanged
- create split: ${dryRun.eventCreates || "pending"} events,
  ${dryRun.sourceCreates || "pending"} sources,
  ${dryRun.changeCreates || "pending"} change documents
- patch boundary: ${dryRun.patchBoundary}
- mutation payload: ${dryRun.mutationPayloadBytes || "pending"} bytes
- production plan SHA: \`${dryRun.planSha}\`
- plan artifact SHA-256: \`${dryRun.planArtifactSha}\`
- rollback artifact SHA-256: \`${dryRun.rollbackArtifactSha}\`
- rollback coverage: all ${dryRun.creates} create IDs and all
  ${dryRun.patches} full restore documents
- three consecutive production dry runs reproduced the same plan SHA, counts,
  payload, plan artifact, and rollback artifact

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA: \`${dryRun.planSha}\`
- receipt SHA-256: \`${publicationRecord.receiptSha}\`
- immediate post-publication zero plan:
  \`${publicationRecord.zeroPlanSha}\`; zero creates, zero patches,
  ${publicationRecord.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a 16-byte mutation payload
- zero-plan artifact SHA-256:
  \`${publicationRecord.zeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publicationRecord.zeroRollbackArtifactSha}\`

## Production coverage after publication

- ${publicationRecord.coverage.fullVersions} of
  ${publicationRecord.coverage.totalVersions} release versions have full
  version-level coverage
- ${publicationRecord.coverage.totalAppearances.toLocaleString("en-US")}
  appearances:
  ${publicationRecord.coverage.fullAppearances} full articles,
  ${publicationRecord.coverage.sourceLinkedAppearances} source-linked records,
  and
  ${publicationRecord.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publicationRecord.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all three archival article sections, every expected structured
change title, References, its first cited source, and an \`index, follow\`
directive. No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-ios-5-point-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-5-point-prerelease.mjs scripts/research-batches/audit-ios5-point-prerelease-html-states.mjs
npx prettier --check scripts/research-batches/build-apple-ios-5-point-prerelease.mjs scripts/research-batches/apple-ios-5-point-prerelease.json scripts/research-batches/apple-ios-5-point-prerelease.md scripts/research-batches/audit-ios5-point-prerelease-html-states.mjs
node scripts/research-batches/audit-ios5-point-prerelease-html-states.mjs scripts/research-batches/apple-ios-5-point-prerelease.json /private/tmp/apple-ios5-point-prerelease.RdCHUu
osascript -l JavaScript scripts/research-batches/audit-ios5-point-prerelease-pdf-state.jxa scripts/research-batches/apple-ios-5-point-prerelease.json /private/tmp/apple-ios5-point-prerelease.RdCHUu
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-5-point-prerelease.json
\`\`\`
`;

const formattedMd = await prettier.format(md, {
  filepath: join(here, ledgerName),
});
writeFileSync(join(here, ledgerName), formattedMd);

console.log(
  JSON.stringify(
    {
      output: outputPath,
      ledger: join(here, ledgerName),
      events: events.length,
      changes: changeCount,
      changeKeys: localDefinitions.size,
      sharedCanonicalKeys: sharedOwners.size,
      sources: sources.length,
      citations: citationCount,
      sha256: jsonSha,
    },
    null,
    2,
  ),
);
