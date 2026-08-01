import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-10-point-prerelease.json";
const ledgerName = "apple-ios-10-point-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T14:16:50Z";
const reviewedPlan = {
  planSha: "386f7801b851ce69ab2b09397184a4a1bb5e7db0c821118979fea9034930febf",
  sourceSnapshotSha:
    "94557b8dcf1b278e431af7e972b2f9295c8a450de1b0043e71903909cc0b2afa",
  planArtifactSha:
    "8bd4fa846cf5d02fd310cfefa89847a6b8ee90250128b4944a8f1162cd3b4b00",
  rollbackArtifactSha:
    "43ee8ad34fb62ca4f4d07dd4161056711bdecd6ef4f9f1d5b08510e24fdbb10d",
  creates: 76,
  sourceCreates: 27,
  changeCreates: 49,
  patches: 14,
  eventPatches: 10,
  sharedChangePatches: 4,
  unchanged: 2161,
  mutationPayloadBytes: 175_144,
  deterministicRuns: 3,
};
const publicOwnerSha =
  "91ca74fac29a411c5db4f28df1bbec744e6cf153316cff27abeff1e8297cdf5c";
const majorPrereleaseOwnerSha =
  "0bca32410fa5aa5bae7b149d10485209d70f543de7967fba053989b1df84bd19";
const majorPrereleaseBuilderSha =
  "f2b6c235e63f33f58db5bd092364a0b7ccf50c91fb51110668d7c7a768687a09";
const majorPrereleaseLedgerSha =
  "31063cd547fcee61e261a239d7db9e597a231f801928c2c224c07af9f2b219ec";

const U = {
  mr101Beta1:
    "https://www.macrumors.com/2016/09/21/ios-10-1-portrait-mode-for-iphone-7-plus/",
  iclarified101Beta1:
    "https://www.iclarified.com/57000/apple-seeds-first-beta-of-ios-101-to-developers-for-testing-download",
  nine101Beta2:
    "https://9to5mac.com/2016/10/04/new-ios-10-2-beta-2-features-changes-video/",
  idb101Beta2:
    "https://www.idownloadblog.com/2016/10/04/reduce-motion-imessage-10-1-b2/",
  idb101Beta4:
    "https://www.idownloadblog.com/2016/10/17/apple-seeds-ios-10-1-beta-4-to-developers-and-public-beta-testers/",
  nine101Beta5:
    "https://9to5mac.com/2016/10/19/apple-releases-ios-10-1-beta-5-with-portrait-camera-for-iphone-7-plus/",
  apple101Final:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-10.1/",
  mr102Beta1:
    "https://www.macrumors.com/2016/10/31/apple-seeds-ios-10-2-beta-1-to-developers/",
  nine102Beta1:
    "https://9to5mac.com/2016/11/01/whats-new-in-ios-10-2-beta-1-video/",
  mr102Beta2:
    "https://www.macrumors.com/2016/11/07/apple-seeds-ios-10-2-beta-2-to-developers/",
  mr102Beta3:
    "https://www.macrumors.com/2016/11/14/apple-seeds-ios-10-2-beta-3-to-developers/",
  idb102Beta3:
    "https://www.idownloadblog.com/2016/11/14/beta-3-ios-10-2-developers/",
  nine102Beta3Videos:
    "https://9to5mac.com/2016/11/14/rip-videos-tv-app-ios-10-beta-3/",
  idb102Beta4:
    "https://www.idownloadblog.com/2016/11/28/apple-releases-beta-4-of-ios-10-2-watchos-3-1-1-macos-sierra-10-12-2/",
  pdf102Beta5:
    "https://forums.macrumors.com/attachments/ios_10-2_beta_5_release_notes-pdf.675821/",
  pdf102Beta6:
    "https://forums.macrumors.com/attachments/ios_10-2_beta_6_release_notes-pdf.676343/",
  pdf102Beta7:
    "https://forums.macrumors.com/attachments/ios_10-2_beta_7_release_notes-pdf.676779/",
  apple102Final:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-10.2/",
  idb103Beta1:
    "https://www.idownloadblog.com/2017/01/24/apple-releases-first-beta-of-ios-10-3-to-developers/",
  mr103Beta1: "https://www.macrumors.com/2017/01/24/whats-new-in-ios-10-3/",
  pdf103Beta2:
    "https://forums.macrumors.com/attachments/ios_10-3_beta_2_release_notes-pdf.687234/",
  pdf103Beta3:
    "https://forums.macrumors.com/attachments/ios_10-3_beta_3_release_notes-pdf.689410/",
  pdf103Beta4:
    "https://forums.macrumors.com/attachments/ios_10-3_beta_4_release_notes-pdf.690300/",
  pdf103Beta5:
    "https://forums.macrumors.com/attachments/ios_10-3_beta_5_release_notes-pdf.691502/",
  pdf103Beta6:
    "https://forums.macrumors.com/attachments/ios_10-3_beta_6_release_notes-pdf.692121/",
  pdf103Beta7:
    "https://forums.macrumors.com/attachments/ios_10-3_beta_7_release_notes-pdf.692489/",
  apple103Final:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-iOSSDK-10.3/",
};

const source = (
  url,
  title,
  publisher,
  sourceClass,
  author,
  publishedAt,
  topics,
  archiveUrl,
) => ({
  url,
  title,
  publisher,
  sourceClass,
  ...(author ? { author } : {}),
  ...(publishedAt ? { publishedAt } : {}),
  ...(archiveUrl ? { archiveUrl } : {}),
  topics,
});

const mirroredApplePdf = (url, beta, publishedAt, archiveUrl) =>
  source(
    url,
    `${beta.startsWith("10.2") ? "iOS SDK" : "iOS"} Release Notes for iOS ${beta} (Apple-authored PDF mirror)`,
    "MacRumors Forums attachment archive",
    "archive",
    "Apple",
    publishedAt,
    [
      "iOS",
      beta,
      "Apple Developer release notes",
      "historical document mirror",
    ],
    archiveUrl,
  );

const sources = [
  source(
    U.mr101Beta1,
    "Apple's iOS 10.1 Beta Includes Promised Portrait Mode for iPhone 7 Plus Users",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2016-09-21T10:33:15-07:00",
    ["iOS 10.1", "Beta 1", "Portrait Camera", "release identity"],
  ),
  source(
    U.iclarified101Beta1,
    "Apple Seeds First Beta of iOS 10.1 to Developers for Testing [Download]",
    "iClarified",
    "archive",
    "Shalom Levytam",
    "2016-09-21T17:04:43+00:00",
    ["iOS 10.1", "Beta 1", "build identity", "developer-note excerpt"],
  ),
  source(
    U.nine101Beta2,
    "Hands-on: New iOS 10.1 beta 2 features + changes [Video]",
    "9to5Mac",
    "journalism",
    "Jeff Benjamin",
    "2016-10-04T19:40:11+00:00",
    ["iOS 10.1", "Beta 2", "Messages", "observed changes"],
  ),
  source(
    U.idb101Beta2,
    "You can reduce motion and keep iMessage effects in iOS 10.1 beta",
    "iDownloadBlog",
    "journalism",
    "Cody Lee",
    "2016-10-04T17:51:46+00:00",
    ["iOS 10.1", "Beta 1", "Beta 2", "Messages accessibility"],
  ),
  source(
    U.idb101Beta4,
    "Apple seeds iOS 10.1 beta 4 to developers and public beta testers",
    "iDownloadBlog",
    "journalism",
    "Sébastien Page",
    "2016-10-17T20:13:19+00:00",
    ["iOS 10.1", "Beta 4", "negative feature boundary"],
  ),
  source(
    U.nine101Beta5,
    "Apple releases iOS 10.1 beta 5 for iPhone 7 and iPhone 7 Plus, & macOS Sierra 10.12.1 beta 5",
    "9to5Mac",
    "journalism",
    "Greg Barbosa",
    "2016-10-19T16:51:16+00:00",
    ["iOS 10.1", "Beta 5", "release-note boundary"],
  ),
  source(
    U.apple101Final,
    "iOS 10.1 Release Notes",
    "Apple Developer Documentation Archive",
    "developerDocs",
    "Apple",
    undefined,
    ["iOS 10.1", "final SDK state", "archive boundary"],
  ),
  source(
    U.mr102Beta1,
    "Apple Seeds First Beta of iOS 10.2 to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2016-10-31T12:56:12-07:00",
    ["iOS 10.2", "Beta 1", "release identity", "observed changes"],
  ),
  source(
    U.nine102Beta1,
    "Here’s everything that’s new in iOS 10.2 beta 1 [Video]",
    "9to5Mac",
    "journalism",
    "Jeff Benjamin",
    "2016-11-01T21:53:05+00:00",
    ["iOS 10.2", "Beta 1", "observed changes"],
  ),
  source(
    U.mr102Beta2,
    "Apple Seeds Second Beta of iOS 10.2 to Developers",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2016-11-07T09:50:10-08:00",
    ["iOS 10.2", "Beta 2", "TV app", "SOS", "Music"],
  ),
  source(
    U.mr102Beta3,
    "Apple Seeds Third Beta of iOS 10.2 to Developers [Update: Public Beta Available]",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2016-11-14T09:52:08-08:00",
    ["iOS 10.2", "Beta 3", "Messages", "TV app", "SOS"],
  ),
  source(
    U.idb102Beta3,
    "Apple seeds third beta of iOS 10.2, macOS Sierra 10.12.2, and tvOS 10.1 to developers",
    "iDownloadBlog",
    "journalism",
    "Cody Lee",
    "2016-11-14T17:55:11+00:00",
    ["iOS 10.2", "Beta 3", "observed changes"],
  ),
  source(
    U.nine102Beta3Videos,
    "RIP Videos app as Apple replaces it with more capable TV in iOS 10 beta 3",
    "9to5Mac",
    "journalism",
    "Zac Hall",
    "2016-11-14T18:21:35+00:00",
    ["iOS 10.2", "Beta 3", "Videos", "TV app", "United States"],
  ),
  source(
    U.idb102Beta4,
    "Apple releases beta 4 of iOS 10.2, watchOS 3.1.1 & macOS Sierra 10.12.2 to developers",
    "iDownloadBlog",
    "journalism",
    "Christian Zibreg",
    "2016-11-28T18:57:40+00:00",
    ["iOS 10.2", "Beta 4", "negative feature boundary"],
  ),
  mirroredApplePdf(
    U.pdf102Beta5,
    "10.2 Beta 5",
    "2016-12-02T10:22:27-08:00",
    "https://forums.macrumors.com/threads/ios-10-2-beta-5-changes-bugs-and-fixes.2019207/",
  ),
  mirroredApplePdf(
    U.pdf102Beta6,
    "10.2 Beta 6",
    "2016-12-05T10:03:22-08:00",
    "https://forums.macrumors.com/threads/ios-10-2-beta-6-changes-bugs-and-fixes.2019785/",
  ),
  mirroredApplePdf(
    U.pdf102Beta7,
    "10.2 Beta 7",
    "2016-12-07T09:54:04-08:00",
    "https://forums.macrumors.com/threads/ios-10-2-beta-7-changes-bugs-and-fixes.2020220/",
  ),
  source(
    U.apple102Final,
    "iOS 10.2 Release Notes",
    "Apple Developer Documentation Archive",
    "developerDocs",
    "Apple",
    undefined,
    ["iOS 10.2", "final SDK state", "archive boundary"],
  ),
  source(
    U.idb103Beta1,
    "Apple releases iOS 10.3 beta 1 to developers with Find My AirPods & other new features",
    "iDownloadBlog",
    "journalism",
    "Christian Zibreg",
    "2017-01-24T21:06:45+00:00",
    ["iOS 10.3", "Beta 1", "release identity", "developer notes"],
  ),
  source(
    U.mr103Beta1,
    "What's New in iOS 10.3: Find My AirPods, APFS File System, New Apple ID Setting and More",
    "MacRumors",
    "journalism",
    "Juli Clover",
    "2017-01-24T14:57:09-08:00",
    ["iOS 10.3", "Beta 1", "observed changes"],
  ),
  mirroredApplePdf(
    U.pdf103Beta2,
    "10.3 beta 2",
    "2017-02-06T10:03:57-08:00",
    "https://forums.macrumors.com/threads/ios-10-3-developer-beta-2-changes-bug-fixes-enhacements-etc.2031354/",
  ),
  mirroredApplePdf(
    U.pdf103Beta3,
    "10.3 beta 3",
    "2017-02-20T10:00:40-08:00",
    "https://forums.macrumors.com/threads/ios-10-3-beta-3-bug-fixes-changes-etc.2033588/",
  ),
  mirroredApplePdf(
    U.pdf103Beta4,
    "10.3 beta 4",
    "2017-02-27T10:00:47-08:00",
    "https://forums.macrumors.com/threads/ios-10-3-developer-beta-4-changes-bug-fixes-enhacements-etc.2034640/",
  ),
  mirroredApplePdf(
    U.pdf103Beta5,
    "10.3 beta 5",
    "2017-03-08T09:58:25-08:00",
    "https://forums.macrumors.com/threads/ios-10-3-developer-beta-5-changes-bug-fixes-enhancements-etc.2036136/",
  ),
  mirroredApplePdf(
    U.pdf103Beta6,
    "10.3 beta 6",
    "2017-03-13T10:14:43-07:00",
    "https://forums.macrumors.com/threads/ios-10-3-beta-public-beta-6-bug-fixes-enhancements-etc.2036798/",
  ),
  mirroredApplePdf(
    U.pdf103Beta7,
    "10.3 beta 7",
    "2017-03-16T10:02:23-07:00",
    "https://forums.macrumors.com/threads/ios-10-3-beta-7-changes-bug-fixes-and-enhancements.2037301/",
  ),
  source(
    U.apple103Final,
    "iOS 10.3 Release Notes",
    "Apple Developer Documentation Archive",
    "developerDocs",
    "Apple",
    undefined,
    ["iOS 10.3", "final SDK state", "archive boundary"],
  ),
];

const c = (url, context, locator, note) => ({
  url,
  locator: `${context} — ${locator}`,
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({
  authorship: "originalSynthesis",
  blocks,
});
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
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
const routeKey = (releaseVersionId, alias) => `${releaseVersionId}/${alias}`;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const publicPath = join(here, "apple-ios-10.json");
const majorPrereleasePath = join(here, "apple-ios-10-prerelease.json");
const majorPrereleaseBuilderPath = join(
  here,
  "build-apple-ios-10-prerelease.mjs",
);
const majorPrereleaseLedgerPath = join(here, "apple-ios-10-prerelease.md");
const publicRaw = readFileSync(publicPath);
const majorPrereleaseRaw = readFileSync(majorPrereleasePath);
assert.equal(
  sha256(publicRaw),
  publicOwnerSha,
  "The approved iOS 10 Public owner changed; re-audit shared definitions.",
);
assert.equal(
  sha256(majorPrereleaseRaw),
  majorPrereleaseOwnerSha,
  "The independently owned iOS 10.0 prerelease batch changed.",
);
assert.equal(
  sha256(readFileSync(majorPrereleaseBuilderPath)),
  majorPrereleaseBuilderSha,
  "The independently owned iOS 10.0 prerelease builder changed.",
);
assert.equal(
  sha256(readFileSync(majorPrereleaseLedgerPath)),
  majorPrereleaseLedgerSha,
  "The independently owned iOS 10.0 prerelease ledger changed.",
);
const publicBatch = JSON.parse(publicRaw);
const majorPrereleaseBatch = JSON.parse(majorPrereleaseRaw);
assert.deepEqual(
  (majorPrereleaseBatch.events || [])
    .map(
      (event) =>
        `${event.identity?.releaseVersionId || event.target?.releaseVersionId}/${event.identity?.routeAlias || event.target?.routeAlias}`,
    )
    .sort(),
  ["version-ios-10-0/beta-1", "version-ios-10-0/beta-3"],
  "The completed iOS 10.0 prerelease route owner drifted.",
);

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
      const prior = result.get(change.key);
      assert(
        !prior ||
          JSON.stringify(stableValue(prior)) ===
            JSON.stringify(stableValue(definition)),
        `${label} has definition drift for ${change.key}.`,
      );
      result.set(change.key, definition);
    }
  }
  return result;
};

const publicDefinitions = collectDefinitions(publicBatch, "apple-ios-10.json");
const definitions = new Map();
const sharedOwners = new Set();
const define = (suffix, title, canonicalSummary, category) => {
  const key = `apple-ios-10-point-prerelease-${suffix}`;
  const definition = { key, title, canonicalSummary, category };
  assert(!definitions.has(key), `Duplicate local definition ${key}.`);
  definitions.set(key, definition);
  return key;
};
const reusePublic = (key) => {
  const definition = publicDefinitions.get(key);
  assert(definition, `The approved Public owner lost ${key}.`);
  definitions.set(key, definition);
  sharedOwners.add(key);
  return key;
};

const K = {
  portrait: reusePublic("ios-10-1-portrait-camera-beta"),
  altimeter: define(
    "101-ipad-altimeter-pressure",
    "iPad altimeter pressure reporting",
    "Core Motion restored pressure readings on the iPad Air 2 plus the fourth-generation mini and Pro families.",
    "bugFix",
  ),
  reducedMotionMessages: define(
    "101-reduced-motion-message-effects",
    "Message effects with reduced motion",
    "A new accessibility control for Message effects was initially inactive, then worked in the second iOS 10.1 seed.",
    "enhancement",
  ),
  messageReplay: define(
    "101-message-effect-replay",
    "Message effect replay control",
    "Messages gained a replay control for running a received bubble or screen effect again.",
    "feature",
  ),
  imessageDrawer: define(
    "101-imessage-app-drawer",
    "Cleaner iMessage app drawer",
    "The iMessage app picker received a simpler drawer layout in the second seed.",
    "enhancement",
  ),
  emoji: reusePublic("ios-10-2-emoji-expansion"),
  cameraPreserve: define(
    "102-camera-preserve-settings",
    "Preserved Camera choices",
    "Camera settings could retain the last capture mode, filter selection, and Live Photo preference.",
    "feature",
  ),
  iphone7Wallpapers: define(
    "102-iphone7-wallpapers",
    "Additional iPhone 7 wallpapers",
    "Three promotional still backgrounds became selectable on iPhone 7 and iPhone 7 Plus.",
    "feature",
  ),
  celebrationEffect: define(
    "102-messages-celebration-effect",
    "Celebration screen effect",
    "Messages added a full-screen Celebration animation for iMessage conversations.",
    "feature",
  ),
  videosWidget: define(
    "102-videos-widget",
    "Videos resume widget",
    "A Videos widget surfaced saved movies and shows and opened selected content for playback.",
    "feature",
  ),
  musicSortingRatings: define(
    "102-music-sorting-ratings",
    "Music sorting and star ratings",
    "Music added in-app ordering choices for playlists and restored an optional song-rating control.",
    "enhancement",
  ),
  homeButtonSpeech: define(
    "102-home-button-speech-control",
    "Home-button speech behavior",
    "Accessibility settings could choose Siri, Voice Control, or neither for a sustained Home-button press.",
    "enhancement",
  ),
  notificationCenterState: define(
    "102-notification-center-position",
    "Remembered Notification Center position",
    "Notification Center reopened to the previously viewed panel and retained its scroll position.",
    "behavior",
  ),
  messagesContactPhotos: define(
    "102-messages-contact-photo-visibility",
    "Conversation contact-photo visibility",
    "The Messages contact-photo preference also governed the image shown above individual conversations.",
    "behavior",
  ),
  quickReplyDraft: define(
    "102-quick-reply-draft-continuity",
    "Quick Reply draft continuity",
    "Text started in a notification reply remained available after the full Messages app opened.",
    "bugFix",
  ),
  tvPreview: define(
    "102-tv-app-preview",
    "TV app preview",
    "The United States beta introduced an early TV app for finding and continuing supported video content.",
    "feature",
  ),
  emergencySos: define(
    "102-emergency-sos-beta-scope",
    "Emergency SOS beta scope",
    "Emergency SOS first appeared across a reported country list, then became limited to India in the following seed.",
    "feature",
  ),
  musicPlaybackControls: define(
    "102-music-playback-controls",
    "Larger Music playback controls",
    "Music made its shuffle and repeat controls more prominent within Now Playing.",
    "enhancement",
  ),
  tvProviderSettings: define(
    "102-tv-provider-settings",
    "TV Provider settings",
    "Settings gained a TV Provider area for the developing single-sign-on experience.",
    "feature",
  ),
  videosHidden: define(
    "102-videos-hidden-in-us",
    "Videos app hidden in the United States",
    "The third seed hid Videos by default for United States users as TV became its replacement.",
    "removal",
  ),
  loveEffect: define(
    "102-messages-love-effect",
    "Love screen effect",
    "Messages added a heart-themed full-screen effect during the third beta.",
    "feature",
  ),
  tvPlaybackSettings: define(
    "102-tv-playback-settings",
    "TV cellular and quality settings",
    "TV gained choices for cellular playback and stream quality while the application remained in preview.",
    "enhancement",
  ),
  tvIpodAvailability: define(
    "102-tv-ipod-touch-availability",
    "TV availability on iPod touch",
    "A TV app failure on iPod touch that could present an unavailable message was marked repaired.",
    "bugFix",
  ),
  tvSyncLibrary: define(
    "102-tv-itunes-sync-library",
    "TV library retention during iTunes sync",
    "Syncing through affected iTunes 12.5 releases stopped erasing content recorded in the TV library.",
    "bugFix",
  ),
  tvRestoreAfterDeletion: define(
    "102-tv-restore-after-deletion",
    "TV restoration after deletion",
    "The TV app could not be restored after a user removed it in this seed.",
    "knownIssue",
  ),
  assessmentClipboard: define(
    "102-assessment-universal-clipboard",
    "Universal Clipboard during assessments",
    "Automatic Assessment Configuration blocked Universal Clipboard while an assessment was active.",
    "behavior",
  ),
  spriteKitDeprecations: define(
    "102-spritekit-header-deprecations",
    "Missing SpriteKit deprecation markers",
    "Several deprecated SKNode attribute APIs lacked their intended annotations in the public header.",
    "knownIssue",
  ),
  findAirPods: reusePublic("ios-10-3-find-my-airpods"),
  apfsConversion: define(
    "103-apfs-conversion",
    "Apple File System conversion",
    "Installing the update migrated an existing device to APFS while retaining its stored data.",
    "behavior",
  ),
  reducedMotionWeb: define(
    "103-web-reduced-motion",
    "Reduced-motion styles for websites",
    "Safari exposed a media query that let sites respond to the user's motion-accessibility preference.",
    "developerApi",
  ),
  sha1Trust: define(
    "103-sha1-default-trust",
    "SHA-1 default-trust restriction",
    "Safari and WebKit rejected affected SHA-1 TLS certificates chaining to roots in the system trust store, with documented exceptions.",
    "security",
  ),
  appleIdSettings: define(
    "103-apple-id-settings",
    "Unified Apple ID settings",
    "Settings collected account, device, family, store, and iCloud information in a prominent Apple ID profile.",
    "enhancement",
  ),
  siriPaymentsRides: define(
    "103-sirikit-payments-rides",
    "SiriKit payment and ride tasks",
    "Participating apps could expose bill payment, payment-status, and future ride-scheduling tasks through Siri.",
    "developerApi",
  ),
  carPlayRecentsEv: define(
    "103-carplay-recents-ev",
    "CarPlay recents and EV stations",
    "CarPlay added shortcuts to recent apps and surfaced electric-vehicle charging locations in Maps.",
    "enhancement",
  ),
  mapsWeather: define(
    "103-maps-hourly-weather",
    "Hourly weather in Maps",
    "Pressing the Maps weather indicator with 3D Touch revealed an hourly forecast.",
    "feature",
  ),
  podcastsWidget: define(
    "103-podcasts-widget",
    "Podcasts widget",
    "Podcasts added a system widget without redesigning the main application.",
    "feature",
  ),
  icloudAnalytics: define(
    "103-icloud-analytics",
    "Optional iCloud analytics",
    "A new opt-in shared iCloud usage information through privacy-preserving analysis.",
    "feature",
  ),
  inAppRatings: reusePublic("ios-10-3-in-app-ratings-api"),
  homeKitSwitches: define(
    "103-homekit-programmable-switches",
    "Programmable HomeKit switches",
    "HomeKit broadened support for programmable switch accessories.",
    "enhancement",
  ),
  mailKeyboard: define(
    "103-mail-keyboard-refinements",
    "Mail and keyboard refinements",
    "Mail improved thread navigation, while Chinese and Japanese facemarks were reorganized for easier entry.",
    "enhancement",
  ),
  analyticsSetup: define(
    "103-icloud-analytics-setup",
    "iCloud Analytics setup gating",
    "Setup stopped presenting the iCloud Analytics step before the user had signed in.",
    "bugFix",
  ),
  backupUnavailableFiles: define(
    "103-nightly-backup-files",
    "Nightly backup file availability",
    "Nightly iCloud backups stopped failing because some source files were temporarily unavailable.",
    "bugFix",
  ),
  managedDocumentSync: define(
    "103-managed-document-sync",
    "Managed iCloud document sync",
    "Users on managed devices could no longer override the active iCloud Document Sync policy.",
    "bugFix",
  ),
  simulatorAppleId: define(
    "103-simulator-apple-id-settings",
    "Simulator Apple ID settings",
    "Simulator removed its older iCloud button and placed those controls in the Apple ID pane.",
    "enhancement",
  ),
  simulatorTodayCrash: define(
    "103-simulator-today-crash",
    "Simulator Today View stability",
    "Scrolling the Simulator's Today View stopped triggering a crash.",
    "bugFix",
  ),
  lanAssetCache: define(
    "103-lan-asset-cache",
    "LAN Asset Cache reliability",
    "LAN Asset Cache was listed as unreliable in Beta 2 and working normally in Beta 3.",
    "bugFix",
  ),
  lightningAdapters: define(
    "103-lightning-video-adapters",
    "Lightning video-adapter reliability",
    "Lightning video adapters were flagged as unreliable in Beta 2 and repaired in Beta 3.",
    "bugFix",
  ),
  remoteManagedUpdates: define(
    "103-remote-managed-updates",
    "Remote managed-device updates",
    "Updating managed devices from a remote server remained unfinished and potentially unreliable.",
    "knownIssue",
  ),
  sharedIpadSettings: define(
    "103-shared-ipad-settings",
    "Shared iPad settings restrictions",
    "Beta 2 exposed normally restricted settings on Shared iPad; Beta 4 marked the behavior corrected.",
    "bugFix",
  ),
  siriCarCommands: define(
    "103-sirikit-car-commands",
    "SiriKit car-command readiness",
    "New vehicle commands in SiriKit remained under development and could behave unpredictably.",
    "knownIssue",
  ),
  simulatorIcloudCrash: define(
    "103-simulator-icloud-drive-crash",
    "Simulator iCloud Drive sign-in crash",
    "Enabling iCloud Drive before iCloud sign-in could crash Settings in Beta 2 and was fixed in Beta 3.",
    "bugFix",
  ),
  findAirPodsReliability: define(
    "103-find-airpods-reliability",
    "Find My AirPods reliability",
    "AirPods location and sound actions moved from a most-recent-device limitation to expected operation in Beta 3.",
    "bugFix",
  ),
  openUrlConfirmation: define(
    "103-openurl-call-confirmation",
    "Confirmation for call URLs",
    "Opening telephone or FaceTime URL schemes from another app required confirmation before dialing.",
    "behavior",
  ),
};

const routes = [
  {
    releaseVersionId: "version-ios-10-1",
    version: "10.1",
    alias: "beta-1",
    label: "Beta 1",
    date: "2016-09-21",
    sequence: 1,
    stableEventId: "version-ios-10-1:m-53f23b3e20be",
    identityCitation: c(
      U.iclarified101Beta1,
      "Release identity",
      "The build number is 14B55c",
    ),
  },
  {
    releaseVersionId: "version-ios-10-1",
    version: "10.1",
    alias: "beta-2",
    label: "Beta 2",
    date: "2016-10-04",
    sequence: 2,
    stableEventId: "version-ios-10-1:m-ca8bc420a603",
    identityCitation: c(
      U.nine101Beta2,
      "Release identity",
      "Apple released a new developer beta for iOS 10.1",
    ),
  },
  {
    releaseVersionId: "version-ios-10-2",
    version: "10.2",
    alias: "beta-1",
    label: "Beta 1",
    date: "2016-10-31",
    sequence: 1,
    stableEventId: "version-ios-10-2:m-535a456d1097",
    identityCitation: c(
      U.mr102Beta1,
      "Release identity",
      "Apple today seeded the first beta of an upcoming iOS 10 update to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-10-2",
    version: "10.2",
    alias: "beta-2",
    label: "Beta 2",
    date: "2016-11-07",
    sequence: 2,
    stableEventId: "version-ios-10-2:m-1abc72fd0d1b",
    identityCitation: c(
      U.mr102Beta2,
      "Release identity",
      "Apple today seeded the second beta of an upcoming iOS 10.2 update to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-10-2",
    version: "10.2",
    alias: "beta-3",
    label: "Beta 3",
    date: "2016-11-14",
    sequence: 3,
    stableEventId: "version-ios-10-2:m-ed33bef91340",
    identityCitation: c(
      U.mr102Beta3,
      "Release identity",
      "Apple today seeded the third beta of an upcoming iOS 10.2 update to developers",
    ),
  },
  {
    releaseVersionId: "version-ios-10-2",
    version: "10.2",
    alias: "beta-5",
    label: "Beta 5",
    date: "2016-12-02",
    sequence: 5,
    stableEventId: "version-ios-10-2:m-7dfcf07ef9a5",
    identityCitation: c(
      U.pdf102Beta5,
      "Document identity",
      "iOS SDK Release Notes for iOS 10.2 Beta 5",
    ),
  },
  {
    releaseVersionId: "version-ios-10-3",
    version: "10.3",
    alias: "beta-1",
    label: "Beta 1",
    date: "2017-01-24",
    sequence: 1,
    stableEventId: "version-ios-10-3:m-ec39a31c165f",
    identityCitation: c(
      U.idb103Beta1,
      "Release identity",
      "iOS 10.3 beta 1 (build 14E5230e)",
    ),
  },
  {
    releaseVersionId: "version-ios-10-3",
    version: "10.3",
    alias: "beta-2",
    label: "Beta 2",
    date: "2017-02-06",
    sequence: 2,
    stableEventId: "version-ios-10-3:m-12d7773b7d2e",
    identityCitation: c(
      U.pdf103Beta2,
      "Document identity",
      "iOS Release Notes for iOS 10.3 beta 2",
    ),
  },
  {
    releaseVersionId: "version-ios-10-3",
    version: "10.3",
    alias: "beta-3",
    label: "Beta 3",
    date: "2017-02-20",
    sequence: 3,
    stableEventId: "version-ios-10-3:m-b9bedfb63ad9",
    identityCitation: c(
      U.pdf103Beta3,
      "Document identity",
      "iOS Release Notes for iOS 10.3 beta 3",
    ),
  },
  {
    releaseVersionId: "version-ios-10-3",
    version: "10.3",
    alias: "beta-4",
    label: "Beta 4",
    date: "2017-02-27",
    sequence: 4,
    stableEventId: "version-ios-10-3:m-7b6fe56c8df5",
    identityCitation: c(
      U.pdf103Beta4,
      "Document identity",
      "iOS Release Notes for iOS 10.3 beta 4",
    ),
  },
];
const routeByKey = new Map(
  routes.map((route) => [routeKey(route.releaseVersionId, route.alias), route]),
);
assert.equal(routeByKey.size, routes.length, "Duplicate route definitions.");

const changesByRoute = new Map();
const add = ({
  releaseVersionId,
  alias,
  key,
  action,
  inheritance = "delta",
  summary,
  documentedStatus,
  evidenceState,
  verificationMethod,
  citations,
}) => {
  const definition = definitions.get(key);
  assert(definition, `Unknown definition ${key}.`);
  const target = routeKey(releaseVersionId, alias);
  assert(routeByKey.has(target), `Unknown route ${target}.`);
  const occurrence = {
    ...definition,
    action,
    inheritance,
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod,
    citations,
  };
  changesByRoute.set(target, [
    ...(changesByRoute.get(target) || []),
    occurrence,
  ]);
};

add({
  releaseVersionId: "version-ios-10-1",
  alias: "beta-1",
  key: K.portrait,
  action: "introduced",
  summary:
    "The initial seed exposed the depth-effect camera mode on iPhone 7 Plus and labeled the experience as a beta.",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  verificationMethod:
    "A release-day hands-on report and a separate seed record place the camera mode in Beta 1.",
  citations: [
    c(
      U.mr101Beta1,
      "Portrait appearance",
      "includes a new Portrait camera mode for iPhone 7 Plus users",
    ),
    c(
      U.iclarified101Beta1,
      "Seed identity",
      "first beta of iOS 10.1 to developers",
    ),
  ],
});
add({
  releaseVersionId: "version-ios-10-1",
  alias: "beta-1",
  key: K.altimeter,
  action: "fixed",
  summary:
    "Supported iPads once again exposed barometer readings through the Core Motion altimeter interface.",
  documentedStatus: "documented",
  evidenceState: "reported",
  verificationMethod:
    "The retained release-day developer-note excerpt identifies the exact supported devices.",
  citations: [
    c(
      U.iclarified101Beta1,
      "Fixed in this release",
      "Barometric pressure data from CMAltimeter is now reported",
    ),
  ],
});
add({
  releaseVersionId: "version-ios-10-1",
  alias: "beta-1",
  key: K.reducedMotionMessages,
  action: "knownIssue",
  summary:
    "An effect-autoplay switch appeared beside Reduce Motion, but contemporary testing found that it had no working behavior yet.",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  verificationMethod:
    "A later contemporary hands-on account explicitly describes the Beta 1 control and its inactive state.",
  citations: [
    c(
      U.idb101Beta2,
      "Beta 1 retrospective",
      "present in iOS 10.1 beta 1, but did not work properly",
    ),
  ],
});

add({
  releaseVersionId: "version-ios-10-1",
  alias: "beta-2",
  key: K.reducedMotionMessages,
  action: "fixed",
  summary:
    "The accessibility switch now let Message animations run while broader interface motion stayed reduced.",
  documentedStatus: "undocumented",
  evidenceState: "corroborated",
  verificationMethod:
    "Independent same-day hands-on reports agree that the previously inactive control worked in Beta 2.",
  citations: [
    c(
      U.nine101Beta2,
      "Observed Beta 2 change",
      "enjoy text effects while using the Reduced Motion accessibility option",
    ),
    c(
      U.idb101Beta2,
      "Observed Beta 2 behavior",
      "If Reduce Motion is on, and Auto-play is on, effects work as usual",
    ),
  ],
});
add({
  releaseVersionId: "version-ios-10-1",
  alias: "beta-2",
  key: K.messageReplay,
  action: "introduced",
  summary:
    "A received text effect could be run again from a new control beneath its message bubble.",
  documentedStatus: "undocumented",
  evidenceState: "corroborated",
  verificationMethod:
    "Both retained walkthroughs identify and explain the effect replay control.",
  citations: [
    c(
      U.nine101Beta2,
      "Observed Beta 2 change",
      "replay text effects using a handy Replay button",
    ),
    c(
      U.idb101Beta2,
      "Observed Beta 2 change",
      "new Replay button in the Messages app",
    ),
  ],
});
add({
  releaseVersionId: "version-ios-10-1",
  alias: "beta-2",
  key: K.imessageDrawer,
  action: "changed",
  summary:
    "The application picker inside Messages adopted a less cluttered drawer presentation.",
  documentedStatus: "undocumented",
  evidenceState: "reported",
  verificationMethod:
    "One contemporaneous hands-on article identifies the visual drawer revision.",
  citations: [
    c(
      U.nine101Beta2,
      "Observed Beta 2 change",
      "A cleaner App Drawer for iMessage apps",
    ),
  ],
});

const beta102One = [
  [
    K.emoji,
    "introduced",
    "The first seed brought the Unicode 9 expansion and refreshed artwork into the 10.2 test cycle.",
    "documented",
    "corroborated",
    [
      c(U.mr102Beta1, "Emoji", "Unicode 9 emoji are included in iOS 10.2"),
      c(U.nine102Beta1, "Emoji", "over 70 new Unicode 9 emoji"),
    ],
  ],
  [
    K.cameraPreserve,
    "introduced",
    "Camera preferences could retain capture mode, filter, and Live Photo state between sessions.",
    "undocumented",
    "corroborated",
    [
      c(
        U.mr102Beta1,
        "Camera settings",
        "saving your last known camera settings",
      ),
      c(
        U.nine102Beta1,
        "Camera settings",
        "preserve the last used Camera Mode, Photo Filter, or Live Photo setting",
      ),
    ],
  ],
  [
    K.iphone7Wallpapers,
    "introduced",
    "The iPhone 7 family received three still backgrounds derived from its launch artwork.",
    "undocumented",
    "corroborated",
    [
      c(U.mr102Beta1, "Wallpapers", "There are new wallpapers in iOS 10.2"),
      c(
        U.nine102Beta1,
        "Wallpapers",
        "three new wallpapers, which are based off of the original iMac candy shell colors",
      ),
    ],
  ],
  [
    K.celebrationEffect,
    "introduced",
    "An additional full-screen iMessage animation delivered a celebratory visual with supported haptics.",
    "undocumented",
    "reported",
    [
      c(
        U.nine102Beta1,
        "Messages",
        "new Celebration full screen effect in Messages",
      ),
    ],
  ],
  [
    K.videosWidget,
    "introduced",
    "The widget panel gained a Videos surface for resuming locally available movies and television programs.",
    "undocumented",
    "corroborated",
    [
      c(
        U.mr102Beta1,
        "Videos widget",
        "new widget available for the Videos app",
      ),
      c(
        U.nine102Beta1,
        "Videos widget",
        "new Videos app widget is now available",
      ),
    ],
  ],
  [
    K.musicSortingRatings,
    "changed",
    "Music restored optional song scores and added more ways to order playlists from inside the app.",
    "undocumented",
    "reported",
    [
      c(
        U.nine102Beta1,
        "Music ratings",
        "enable Star Ratings for the Music app",
      ),
      c(
        U.nine102Beta1,
        "Music sorting",
        "sort playlists by Type, Title, or Recently added",
      ),
    ],
  ],
  [
    K.homeButtonSpeech,
    "introduced",
    "A new accessibility panel controlled whether a prolonged Home-button press invoked Siri, Voice Control, or no speech interface.",
    "undocumented",
    "reported",
    [c(U.nine102Beta1, "Accessibility", "new Press and Hold to Speak section")],
  ],
  [
    K.notificationCenterState,
    "changed",
    "Returning to Notification Center preserved the panel and scrolling location that had last been open.",
    "undocumented",
    "reported",
    [
      c(
        U.nine102Beta1,
        "Notification Center",
        "remember the last place where your left off",
      ),
    ],
  ],
  [
    K.messagesContactPhotos,
    "changed",
    "Turning off contact pictures in Messages also hid the portrait above a conversation.",
    "undocumented",
    "reported",
    [
      c(
        U.nine102Beta1,
        "Messages",
        "photos that used to appear at the top of Message app conversation threads will be hidden",
      ),
    ],
  ],
  [
    K.quickReplyDraft,
    "fixed",
    "A partially written notification response survived the transition into the complete Messages interface.",
    "undocumented",
    "reported",
    [
      c(
        U.nine102Beta1,
        "Messages draft",
        "text is carried over to the full Messages app",
      ),
    ],
  ],
];
for (const [
  key,
  action,
  summary,
  documentedStatus,
  evidenceState,
  citations,
] of beta102One) {
  add({
    releaseVersionId: "version-ios-10-2",
    alias: "beta-1",
    key,
    action,
    summary,
    documentedStatus,
    evidenceState,
    verificationMethod:
      evidenceState === "corroborated"
        ? "Two contemporary hands-on reports independently place this change in Beta 1."
        : "The selected change appears in one detailed contemporary hands-on report.",
    citations,
  });
}

const beta102Two = [
  [
    K.tvPreview,
    "introduced",
    "United States testers received the early TV experience for discovery and supported cross-service viewing.",
    c(
      U.mr102Beta2,
      "TV app",
      "includes the TV app that was shown off at Apple's October 27 event",
    ),
  ],
  [
    K.emergencySos,
    "introduced",
    "Five quick presses of the side button could contact emergency services in the initially listed regions.",
    c(
      U.mr102Beta2,
      "Emergency SOS",
      "call emergency services when the power button on the iPhone is pressed five times",
    ),
  ],
  [
    K.musicPlaybackControls,
    "changed",
    "Now Playing presented shuffle and repeat as larger, more obvious controls.",
    c(U.mr102Beta2, "Music", "more prominent Shuffle and Repeat buttons"),
  ],
  [
    K.tvProviderSettings,
    "introduced",
    "The second seed exposed the Settings entry used by the developing provider sign-in workflow.",
    c(
      U.mr102Beta2,
      "Single sign-on",
      "Single-Sign On support for watching live TV via apps",
    ),
  ],
];
for (const [key, action, summary, citation] of beta102Two) {
  add({
    releaseVersionId: "version-ios-10-2",
    alias: "beta-2",
    key,
    action,
    summary,
    documentedStatus: "documented",
    evidenceState: "reported",
    verificationMethod:
      "A release-day report attributes the behavior to the second seed and, where indicated, to Apple's notes.",
    citations: [citation],
  });
}

const beta102Three = [
  [
    K.emergencySos,
    "changed",
    "The broader emergency-call preview disappeared, leaving the feature available only for India.",
    [
      c(
        U.mr102Beta3,
        "Emergency SOS",
        "eliminates the SOS feature that was introduced in the second iOS 10.2 beta",
      ),
      c(U.idb102Beta3, "Emergency SOS", "removed the SOS feature in beta 3"),
    ],
  ],
  [
    K.videosHidden,
    "removed",
    "For United States testers, TV became the default video application and Videos moved to optional reinstallation.",
    [
      c(
        U.mr102Beta3,
        "Videos replacement",
        "removes the Videos app in the United States",
      ),
      c(
        U.nine102Beta3Videos,
        "Videos replacement",
        "Videos will be hidden by default in the United States",
      ),
    ],
  ],
  [
    K.loveEffect,
    "introduced",
    "A heart-filled animation joined the full-screen effects available in Messages.",
    [
      c(U.mr102Beta3, "Messages", "new Send With Love Screen Effect"),
      c(
        U.idb102Beta3,
        "Beta 3 changes",
        "New features for TV app",
        "The iDownloadBlog report supports the same Beta 3 change set but does not independently list Love.",
      ),
    ],
  ],
  [
    K.tvPlaybackSettings,
    "introduced",
    "The TV settings page gained controls for cellular viewing and playback quality.",
    [
      c(U.mr102Beta3, "TV settings", "new TV app settings"),
      c(
        U.idb102Beta3,
        "TV settings",
        "choose whether to use cellular data for playback or not and the video quality",
      ),
    ],
  ],
];
for (const [key, action, summary, citations] of beta102Three) {
  add({
    releaseVersionId: "version-ios-10-2",
    alias: "beta-3",
    key,
    action,
    summary,
    documentedStatus: "undocumented",
    evidenceState: key === K.loveEffect ? "reported" : "corroborated",
    verificationMethod:
      key === K.loveEffect
        ? "The named effect is directly reported by one release-day article; the second citation establishes the Beta 3 change context only."
        : "Two contemporary reports agree on the Beta 3 behavior.",
    citations,
  });
}

const beta102Five = [
  [
    K.tvIpodAvailability,
    "fixed",
    "The TV application stopped failing at launch or reporting that its service was unavailable on iPod touch.",
    "documented",
    "Fixed in this Release; TV App",
    "The TV app should no longer crash or show",
  ],
  [
    K.tvSyncLibrary,
    "fixed",
    "Using the affected iTunes releases no longer removed items from the TV library during synchronization.",
    "documented",
    "Fixed in this Release; TV App",
    "should no longer delete TV app library content",
  ],
  [
    K.tvRestoreAfterDeletion,
    "knownIssue",
    "A deleted TV installation could not be brought back in this beta.",
    "documented",
    "Notes and Known Issues; TV App",
    "TV app cannot be restored after it is deleted",
  ],
  [
    K.assessmentClipboard,
    "changed",
    "Assessment sessions now prevented content transfer through Universal Clipboard.",
    "documented",
    "Notes and Known Issues; AAC",
    "prevents using the Universal Clipboard during an assessment",
  ],
  [
    K.spriteKitDeprecations,
    "knownIssue",
    "The public SpriteKit header omitted deprecation annotations for the listed SKNode attribute interfaces.",
    "documented",
    "Notes and Known Issues; SpriteKit",
    "deprecated, but missing the deprecation notice from the public header",
  ],
];
for (const [
  key,
  action,
  summary,
  documentedStatus,
  context,
  locator,
] of beta102Five) {
  add({
    releaseVersionId: "version-ios-10-2",
    alias: "beta-5",
    key,
    action,
    summary,
    documentedStatus,
    evidenceState: "corroborated",
    verificationMethod:
      "The action and scope come from an Apple-authored Beta 5 PDF preserved as a contemporaneous forum attachment.",
    citations: [c(U.pdf102Beta5, context, locator)],
  });
}

const beta103One = [
  [
    K.findAirPods,
    "introduced",
    "Find My iPhone could locate recently connected AirPods and trigger a progressively louder finding sound, subject to the seed's last-used-device limitation.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "Find My AirPods",
        "supports Location and Play Sound for AirPods",
      ),
      c(
        U.mr103Beta1,
        "Find My AirPods",
        "keeps track of the last known location where AirPods were connected",
      ),
    ],
  ],
  [
    K.apfsConversion,
    "changed",
    "Updating migrated the device storage format to APFS while retaining existing files; Apple advised making a backup first.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "File-system conversion",
        "update your device's file system to the new Apple File System",
      ),
      c(
        U.mr103Beta1,
        "File-system conversion",
        "file system will be updated to use Apple File System",
      ),
    ],
  ],
  [
    K.reducedMotionWeb,
    "introduced",
    "Web authors could provide alternate styles when the system indicated that a user preferred less motion.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "Web accessibility",
        "supports a new media query which lets web developers provide alternate page styles",
      ),
    ],
  ],
  [
    K.sha1Trust,
    "removed",
    "The browser stack stopped trusting affected SHA-1 server certificates under system roots while retaining the note's enterprise, user, and root-certificate exceptions.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "TLS trust",
        "removes support for SHA-1 signed certificates used for Transport Layer Security",
      ),
      c(
        U.apple103Final,
        "Final-state boundary",
        "removes support for SHA-1 signed certificates",
      ),
    ],
  ],
  [
    K.appleIdSettings,
    "changed",
    "A profile at the top of Settings consolidated account details, signed-in hardware, storage use, family controls, and store destinations.",
    "undocumented",
    [
      c(
        U.mr103Beta1,
        "Apple ID settings",
        "new Apple ID profile option that's displayed at the top of the Settings app",
      ),
      c(
        U.idb103Beta1,
        "Apple ID settings",
        "new user security section at the top with useful user information",
      ),
    ],
  ],
  [
    K.siriPaymentsRides,
    "changed",
    "The Siri extension model expanded to bill workflows, payment checks, and rides scheduled for later.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "SiriKit",
        "pay bills, check on the status of payments and schedule future rides",
      ),
      c(
        U.mr103Beta1,
        "SiriKit",
        "pay bills, check on the status of payments, and schedule future rides",
      ),
    ],
  ],
  [
    K.carPlayRecentsEv,
    "changed",
    "The vehicle interface offered direct access to recent applications and added charging points to its map data.",
    "undocumented",
    [
      c(U.idb103Beta1, "CarPlay", "shortcuts for launching recently used apps"),
      c(U.mr103Beta1, "CarPlay", "location of EV charging stations"),
    ],
  ],
  [
    K.mapsWeather,
    "introduced",
    "Using pressure input on the weather symbol opened a more detailed hourly outlook inside Maps.",
    "undocumented",
    [
      c(
        U.idb103Beta1,
        "Maps weather",
        "weather icon in the Maps app can be pressed with 3D Touch",
      ),
      c(
        U.mr103Beta1,
        "Maps weather",
        "3D Touch on the weather icon to see a weather forecast",
      ),
    ],
  ],
  [
    K.podcastsWidget,
    "introduced",
    "Podcasts joined the system's widget surfaces while keeping its existing in-app design.",
    "undocumented",
    [
      c(
        U.idb103Beta1,
        "Podcasts",
        "Podcasts app in iOS 10.3 beta 1 now has a widget",
      ),
    ],
  ],
  [
    K.icloudAnalytics,
    "introduced",
    "An optional analytics setting shared iCloud usage for product improvement under Apple's stated privacy protections.",
    "undocumented",
    [
      c(
        U.idb103Beta1,
        "iCloud Analytics",
        "new iCloud Analytics opt-in feature",
      ),
      c(U.mr103Beta1, "iCloud Analytics", "new Share iCloud Analytics section"),
    ],
  ],
  [
    K.inAppRatings,
    "introduced",
    "The seed exposed Apple's system interface for requesting a store rating without leaving the application.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "App ratings",
        "new way for developers to request app ratings",
      ),
      c(
        U.mr103Beta1,
        "App ratings",
        "Developers will be able to update the icons for their apps",
        "The detailed page supports the developer-change context; the rating implementation is described by iDownloadBlog.",
      ),
    ],
  ],
  [
    K.homeKitSwitches,
    "changed",
    "The HomeKit accessory model expanded to additional programmable switch behavior.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "HomeKit",
        "support for programmable switches has been expanded",
      ),
      c(U.mr103Beta1, "HomeKit", "support for programmable light switches"),
    ],
  ],
  [
    K.mailKeyboard,
    "changed",
    "Conversation navigation improved in Mail, and facemark placement changed on Chinese and Japanese keyboards.",
    "documented",
    [
      c(
        U.idb103Beta1,
        "Mail and keyboards",
        "Mail's Conversation View includes navigation improvements",
      ),
      c(
        U.idb103Beta1,
        "Mail and keyboards",
        "facemarks on the Chinese and Japanese keyboards have been moved",
      ),
    ],
  ],
];
for (const [key, action, summary, documentedStatus, citations] of beta103One) {
  add({
    releaseVersionId: "version-ios-10-3",
    alias: "beta-1",
    key,
    action,
    summary,
    documentedStatus,
    evidenceState: citations.length > 1 ? "corroborated" : "reported",
    verificationMethod:
      citations.length > 1
        ? "Two retained reports, or one report plus Apple's final SDK boundary, support the selected Beta 1 state."
        : "A detailed release-day report places the selected change in Beta 1.",
    citations,
  });
}
add({
  releaseVersionId: "version-ios-10-3",
  alias: "beta-1",
  key: K.findAirPodsReliability,
  action: "knownIssue",
  summary:
    "Location lookup and sound playback were limited to whichever iOS device had most recently used the AirPods.",
  documentedStatus: "documented",
  evidenceState: "reported",
  verificationMethod:
    "A retained release-day account reproduces Apple's first-seed limitation for the finding actions.",
  citations: [
    c(
      U.idb103Beta1,
      "Find My iPhone known issue",
      "Location and Play Sound currently work only from the iOS device that was most recently used with AirPods",
    ),
  ],
});
add({
  releaseVersionId: "version-ios-10-3",
  alias: "beta-1",
  key: K.siriCarCommands,
  action: "knownIssue",
  summary:
    "SiriKit's newly exposed vehicle-command support remained under development in the first seed.",
  documentedStatus: "documented",
  evidenceState: "reported",
  verificationMethod:
    "A retained release-day account identifies Apple's first-seed development warning for the vehicle commands.",
  citations: [
    c(
      U.idb103Beta1,
      "SiriKit known issue",
      "new SiriKit car commands are still in development",
    ),
  ],
});

const beta103Two = [
  [
    K.analyticsSetup,
    "fixed",
    "The setup flow no longer reached the analytics choice before an iCloud account had been authenticated.",
    "Fixed in this Release; iCloud Analytics",
    "should no longer reach the iCloud Analytics page",
  ],
  [
    K.backupUnavailableFiles,
    "fixed",
    "Nightly cloud backups stopped returning the documented error about unavailable files.",
    "Fixed in this Release; iCloud Backup",
    "Nightly backups should no longer fail",
  ],
  [
    K.managedDocumentSync,
    "fixed",
    "A managed-device user could no longer change the enforced iCloud document-sync setting.",
    "Fixed in this Release; Managed and Shared Devices",
    "users should no longer be able to override the current iCloud Document Sync setting",
  ],
  [
    K.simulatorAppleId,
    "changed",
    "The Simulator retired its legacy iCloud button in favor of controls within the new account pane.",
    "Fixed in this Release; Xcode Simulator",
    "legacy iCloud button in Settings has been removed",
  ],
  [
    K.simulatorTodayCrash,
    "fixed",
    "Scrolling through Today View in the Simulator no longer terminated the process.",
    "Fixed in this Release; Xcode Simulator",
    "Scrolling in the Today View should no longer crash",
  ],
  [
    K.lanAssetCache,
    "knownIssue",
    "Local network asset caching remained unreliable in this seed.",
    "Notes and Known Issues; LAN Asset Cache",
    "functionality may not work as expected in this beta",
  ],
  [
    K.lightningAdapters,
    "knownIssue",
    "Video output through Lightning adapters could still fail or behave unpredictably.",
    "Notes and Known Issues; Lightning Video Adapters",
    "video adapters may not work as expected in this beta",
  ],
  [
    K.remoteManagedUpdates,
    "knownIssue",
    "Server-driven updates for managed devices remained unfinished and potentially unreliable.",
    "Notes and Known Issues; Managed and Shared Devices",
    "ability to update devices from a remote server is in development",
  ],
  [
    K.sharedIpadSettings,
    "regression",
    "Shared iPad users could alter controls that are normally unavailable in that mode.",
    "Notes and Known Issues; Managed and Shared Devices",
    "Shared iPad allows users to toggle settings that are usually unavailable",
  ],
  [
    K.siriCarCommands,
    "knownIssue",
    "The new vehicle commands exposed through SiriKit were not yet considered complete.",
    "Notes and Known Issues; SiriKit",
    "new SiriKit car commands are still in development",
  ],
  [
    K.findAirPodsReliability,
    "knownIssue",
    "AirPods finding actions still depended on the last iOS device to connect to them.",
    "Notes and Known Issues; Find My iPhone",
    "Location and Play Sound currently work only from the iOS device most recently used with your AirPods",
  ],
  [
    K.simulatorIcloudCrash,
    "knownIssue",
    "Turning on iCloud Drive in Simulator before account sign-in could crash Settings.",
    "Notes and Known Issues; Xcode Simulator",
    "before the user is signed into iCloud can cause Settings to crash",
  ],
];
for (const [key, action, summary, context, locator] of beta103Two) {
  add({
    releaseVersionId: "version-ios-10-3",
    alias: "beta-2",
    key,
    action,
    inheritance:
      key === K.siriCarCommands || key === K.findAirPodsReliability
        ? "cumulative"
        : "delta",
    summary,
    documentedStatus: "documented",
    evidenceState: "corroborated",
    verificationMethod:
      "The status and scope come from the Apple-authored Beta 2 PDF preserved as a contemporaneous attachment.",
    citations: [c(U.pdf103Beta2, context, locator)],
  });
}

const beta103Three = [
  [
    K.findAirPodsReliability,
    "fixed",
    "The location and audible-finding actions were marked as operating normally instead of being limited to the most recently paired device.",
    "Fixed in this Release; Find My iPhone",
    "Location and Play Sound should now work as expected",
  ],
  [
    K.lanAssetCache,
    "fixed",
    "The third seed marked local asset caching as operational again.",
    "Fixed in this Release; LAN Asset Cache",
    "functionality should now work as expected",
  ],
  [
    K.lightningAdapters,
    "fixed",
    "The Lightning video-output problem listed in Beta 2 was marked repaired.",
    "Fixed in this Release; Lightning Video Adapters",
    "video adapters should now work as expected",
  ],
  [
    K.simulatorIcloudCrash,
    "fixed",
    "The pre-sign-in iCloud Drive path no longer crashed the Simulator's Settings application.",
    "Fixed in this Release; Xcode Simulator",
    "should no longer cause Settings to crash",
  ],
  [
    K.openUrlConfirmation,
    "changed",
    "Third-party requests to telephone or FaceTime URL schemes now displayed a confirmation step before a call began.",
    "Notes and Known Issues; openURL",
    "requires user confirmation before dialing",
  ],
];
for (const [key, action, summary, context, locator] of beta103Three) {
  add({
    releaseVersionId: "version-ios-10-3",
    alias: "beta-3",
    key,
    action,
    summary,
    documentedStatus: "documented",
    evidenceState: "corroborated",
    verificationMethod:
      "The action is selected from the Apple-authored Beta 3 PDF and compared with the preceding preserved state.",
    citations: [c(U.pdf103Beta3, context, locator)],
  });
}

add({
  releaseVersionId: "version-ios-10-3",
  alias: "beta-4",
  key: K.sharedIpadSettings,
  action: "fixed",
  summary:
    "The Shared iPad controls that had escaped their normal restrictions were marked as working correctly.",
  documentedStatus: "documented",
  evidenceState: "corroborated",
  verificationMethod:
    "The Apple-authored Beta 4 PDF adds this fixed line and removes the corresponding Beta 2 known issue.",
  citations: [
    c(
      U.pdf103Beta4,
      "Fixed in this Release; Managed and Shared Devices",
      "Shared iPad settings should now work as expected",
    ),
  ],
});

const articleSpecs = new Map([
  [
    "version-ios-10-1/beta-1",
    [
      prose(
        "Contemporary records date the first iOS 10.1 developer seed to September 21, 2016 and identify build 14B55c. Build identity is retained only as context; no device-specific artifact is available for a durable build document.",
        [
          c(
            U.iclarified101Beta1,
            "Release identity",
            "first beta of iOS 10.1 to developers",
          ),
          c(U.iclarified101Beta1, "Build identity", "build number is 14B55c"),
        ],
      ),
      prose(
        "This page records the Portrait preview, restored iPad altimeter readings, and the initially inactive accessibility switch for Message effects. Apple's later 10.1 archive is used only to confirm the final SDK boundary.",
        [
          c(
            U.mr101Beta1,
            "Portrait",
            "new Portrait camera mode for iPhone 7 Plus users",
          ),
          c(
            U.iclarified101Beta1,
            "Altimeter",
            "Barometric pressure data from CMAltimeter is now reported",
          ),
          c(U.idb101Beta2, "Inactive Beta 1 switch", "did not work properly"),
          c(
            U.apple101Final,
            "Final boundary",
            "iOS SDK Release Notes for iOS 10.1",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-1/beta-2",
    [
      prose(
        "Apple's second 10.1 developer seed arrived October 4. Same-day walkthroughs isolate three Message changes: working effects under Reduce Motion, a replay action, and a simplified iMessage application drawer.",
        [
          c(
            U.nine101Beta2,
            "Release context",
            "new developer beta for iOS 10.1",
          ),
          c(U.idb101Beta2, "Effects behavior", "effects work as usual"),
        ],
      ),
      prose(
        "Beta 3 is not assigned a duplicate effect change because same-day Beta 2 reporting already demonstrates the working behavior and later retrospectives disagree about its first seed. Beta 4 reported no outward addition, while Beta 5's notes identified no newly fixed item.",
        [
          c(
            U.nine101Beta2,
            "Beta 2 behavior",
            "ability to enjoy text effects while using the Reduced Motion accessibility option",
          ),
          c(
            U.idb101Beta4,
            "Beta 4 boundary",
            "does not, however, appear to contain any outward-facing user features",
          ),
          c(
            U.nine101Beta5,
            "Beta 5 boundary",
            "release notes for beta 5, once again don't note any new fixes",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-2/beta-1",
    [
      prose(
        "The first iOS 10.2 developer seed appeared on October 31. The retained reports identify a broad collection of visible additions rather than relying on the later public changelog to backdate them.",
        [
          c(
            U.mr102Beta1,
            "Release identity",
            "seeded the first beta of an upcoming iOS 10 update to developers",
          ),
          c(
            U.nine102Beta1,
            "Beta availability",
            "update is now available to iOS developers",
          ),
        ],
      ),
      prose(
        "Selected records cover emoji, Camera persistence, wallpapers, a Celebration effect, a Videos widget, Music organization, Home-button speech behavior, Notification Center state, Messages contact pictures, and reply-draft continuity. Apple's final SDK page is a persistence boundary, not evidence that every item first appeared publicly.",
        [
          c(U.mr102Beta1, "Feature overview", "What's new in iOS 10.2"),
          c(
            U.nine102Beta1,
            "Hands-on inventory",
            "14 of the new features and changes",
          ),
          c(
            U.apple102Final,
            "Final boundary",
            "iOS SDK Release Notes for iOS 10.2",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-2/beta-2",
    [
      prose(
        "The November 7 seed introduced the TV preview and Emergency SOS testing while revising Music's playback controls and exposing the television-provider sign-in surface.",
        [
          c(
            U.mr102Beta2,
            "Release identity",
            "seeded the second beta of an upcoming iOS 10.2 update to developers",
          ),
          c(U.mr102Beta2, "Beta 2 changes", "What's new in iOS 10.2 beta 2"),
        ],
      ),
      prose(
        "These records retain the preview's United States and regional qualifications. The TV definition is intentionally narrower than the finished application's Public record because Apple still described the beta application as incomplete.",
        [
          c(
            U.mr102Beta2,
            "TV preview",
            "TV app that was shown off at Apple's October 27 event",
          ),
          c(
            U.mr102Beta2,
            "SOS countries",
            "SOS works in Australia, Belgium, Brazil, Canada",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-2/beta-3",
    [
      prose(
        "The third seed arrived November 14 and reversed part of the previous test state: Emergency SOS was withdrawn outside India and Videos became hidden by default for United States users.",
        [
          c(
            U.mr102Beta3,
            "Release identity",
            "seeded the third beta of an upcoming iOS 10.2 update to developers",
          ),
          c(U.idb102Beta3, "SOS removal", "SOS feature removed"),
          c(
            U.nine102Beta3Videos,
            "Videos replacement",
            "Videos will be hidden by default in the United States",
          ),
        ],
      ),
      prose(
        "Messages also gained the Love animation, and the still-developing TV application added cellular and quality preferences. Removal, introduction, and enhancement remain separate actions rather than being flattened into a generic update.",
        [
          c(U.mr102Beta3, "Messages", "Send With Love Screen Effect"),
          c(
            U.idb102Beta3,
            "TV settings",
            "choose whether to use cellular data for playback",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-2/beta-5",
    [
      prose(
        "The first retained Apple-authored late-cycle PDF is labeled Beta 5. It marks two TV defects fixed and lists three additional release-note states selected here with their original known-versus-changed semantics.",
        [
          c(
            U.pdf102Beta5,
            "Document identity",
            "iOS SDK Release Notes for iOS 10.2 Beta 5",
          ),
          c(U.pdf102Beta5, "Fixed section", "Fixed in this Release"),
          c(U.pdf102Beta5, "Known section", "Notes and Known Issues"),
        ],
      ),
      prose(
        "Beta 4 reporting says no new feature entered that seed. The Beta 6 and Beta 7 PDFs repeat the Beta 5 note body after beta-number normalization, so they are documented as no new note delta rather than as releases with no software changes.",
        [
          c(
            U.idb102Beta4,
            "Beta 4 boundary",
            "no new features have been introduced in the latest betas",
          ),
          c(
            U.pdf102Beta6,
            "Repeated note set",
            "iOS SDK Release Notes for iOS 10.2 Beta 6",
          ),
          c(
            U.pdf102Beta7,
            "Repeated note set",
            "iOS SDK Release Notes for iOS 10.2 Beta 7",
          ),
          c(
            U.apple102Final,
            "Final boundary",
            "iOS SDK Release Notes for iOS 10.2",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-3/beta-1",
    [
      prose(
        "The iOS 10.3 cycle opened January 24 with build 14E5230e. Two detailed reports establish the first-seed changes; Apple's final SDK archive only corroborates items that survived to release.",
        [
          c(
            U.idb103Beta1,
            "Release identity",
            "iOS 10.3 beta 1 (build 14E5230e)",
          ),
          c(
            U.mr103Beta1,
            "Beta context",
            "Released to developers this morning",
          ),
          c(
            U.apple103Final,
            "Final boundary",
            "iOS SDK Release Notes for iOS 10.3",
          ),
        ],
      ),
      prose(
        "The selected record spans AirPods finding, APFS migration, web accessibility, certificate trust, account settings, SiriKit, CarPlay, Maps, Podcasts, analytics, ratings, HomeKit, Mail, and keyboards. The first seed also records explicit limits on which paired device could run AirPods finding actions and on the readiness of SiriKit's vehicle commands.",
        [
          c(
            U.idb103Beta1,
            "Feature inventory",
            "The release includes a new Find My AirPods feature and other enhancements",
          ),
          c(
            U.mr103Beta1,
            "Feature inventory",
            "update also includes many other smaller changes and feature tweaks",
          ),
          c(
            U.idb103Beta1,
            "AirPods limitation",
            "Location and Play Sound currently work only from the iOS device that was most recently used with AirPods",
          ),
          c(
            U.idb103Beta1,
            "SiriKit limitation",
            "new SiriKit car commands are still in development",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-3/beta-2",
    [
      prose(
        "The preserved Beta 2 PDF provides direct Apple-authored status labels. Five selected items sit under the fixed heading, while seven remain explicit known or unfinished states. The AirPods and SiriKit limitations are cumulative because both were already documented in Beta 1.",
        [
          c(
            U.pdf103Beta2,
            "Document identity",
            "iOS Release Notes for iOS 10.3 beta 2",
          ),
          c(U.pdf103Beta2, "Status headings", "Fixed in this Release"),
          c(U.pdf103Beta2, "Status headings", "Notes and Known Issues"),
          c(
            U.pdf103Beta2,
            "Repeated AirPods limitation",
            "Location and Play Sound currently work only from the iOS device most recently used with your AirPods",
          ),
          c(
            U.pdf103Beta2,
            "Repeated SiriKit limitation",
            "new SiriKit car commands are still in development",
          ),
        ],
      ),
      prose(
        "The archive preserves one internal inconsistency: its diagnostics paragraph still names Beta 1. The event identity follows the PDF cover and route date, and no claim relies on that stale paragraph.",
        [
          c(U.pdf103Beta2, "Cover identity", "for iOS 10.3 beta 2"),
          c(
            U.pdf103Beta2,
            "Internal stale label",
            "By default, iOS 10.3 beta 1 automatically sends",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-3/beta-3",
    [
      prose(
        "Beta 3 changes four Beta 2 problem states to fixed and adds a call-confirmation behavior for applications opening telephone or FaceTime URL schemes.",
        [
          c(
            U.pdf103Beta3,
            "Document identity",
            "iOS Release Notes for iOS 10.3 beta 3",
          ),
          c(
            U.pdf103Beta3,
            "Find My repair",
            "Location and Play Sound should now work as expected",
          ),
          c(
            U.pdf103Beta3,
            "Call confirmation",
            "requires user confirmation before dialing",
          ),
        ],
      ),
      prose(
        "Repeated fixes from Beta 2 remain owned by that earlier route. This page models only transitions newly visible when the two preserved Apple documents are compared.",
        [
          c(
            U.pdf103Beta2,
            "Prior known state",
            "LAN Asset Cache functionality may not work as expected",
          ),
          c(
            U.pdf103Beta3,
            "Changed state",
            "LAN Asset Cache functionality should now work as expected",
          ),
        ],
      ),
    ],
  ],
  [
    "version-ios-10-3/beta-4",
    [
      prose(
        "The Beta 4 PDF adds one new fixed line: Shared iPad settings now behave as intended. The matching Beta 2 known issue is therefore represented as a regression-to-fix progression.",
        [
          c(
            U.pdf103Beta4,
            "Document identity",
            "iOS Release Notes for iOS 10.3 beta 4",
          ),
          c(
            U.pdf103Beta4,
            "Shared iPad repair",
            "Shared iPad settings should now work as expected",
          ),
        ],
      ),
      prose(
        "Apple-authored Beta 5, Beta 6, and Beta 7 PDFs retain the same substantive note body after identity normalization. Those milestones are evidence-backed as distributions, but this candidate does not invent fresh change records for them.",
        [
          c(
            U.pdf103Beta5,
            "Repeated note set",
            "iOS Release Notes for iOS 10.3 beta 5",
          ),
          c(
            U.pdf103Beta6,
            "Repeated note set",
            "iOS Release Notes for iOS 10.3 beta 6",
          ),
          c(
            U.pdf103Beta7,
            "Repeated note set",
            "iOS Release Notes for iOS 10.3 beta 7",
          ),
          c(
            U.apple103Final,
            "Final boundary",
            "iOS SDK Release Notes for iOS 10.3",
          ),
        ],
      ),
    ],
  ],
]);

const events = routes.map((route) => {
  const key = routeKey(route.releaseVersionId, route.alias);
  const changes = changesByRoute.get(key) || [];
  const paragraphs = articleSpecs.get(key);
  assert(paragraphs && changes.length > 0, `${key} lacks content.`);
  const routeArticle = article(
    heading("Release identity and boundary"),
    paragraphs[0],
    heading("Selected release-note state"),
    ...paragraphs.slice(1),
  );
  const articleCitations = routeArticle.blocks.flatMap(
    (block) => block.citations || [],
  );
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
      channel: "developerBeta",
      appearanceDate: route.date,
      sequence: route.sequence,
      isRevision: false,
      closesReleaseCycle: false,
      availabilityState: "available",
    },
    authorship: "originalSynthesis",
    summary: `iOS ${route.version} ${route.label} is represented by ${changes.length} source-linked release-note records for the ${route.date} developer milestone; unsupported build documents and duplicate note states remain excluded.`,
    article: routeArticle,
    citations: uniqueCitations([
      route.identityCitation,
      ...articleCitations,
      ...changes.flatMap((change) => change.citations),
    ]),
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: { status: "approved", reviewedAt },
    isIndexable: true,
  };
});

const bundle = {
  formatVersion: 1,
  generatedAt: "2026-07-30T00:00:00.000Z",
  accessedAt,
  target: {
    projectId: "lh3yswzu",
    dataset: "production",
  },
  sources,
  versions: [],
  events,
  builds: [],
};

const expectedSeedInventory = [
  [
    "10.0",
    "2016-09-13",
    [
      ["Beta 1", "2016-06-13", false, undefined],
      ["Beta 2", "2016-07-05", false, undefined],
      ["Beta 3", "2016-07-18", false, undefined],
      ["Beta 4", "2016-08-01", false, undefined],
      ["Beta 5", "2016-08-09", false, undefined],
      ["Beta 6", "2016-08-15", false, undefined],
      ["Beta 7", "2016-08-19", false, undefined],
      ["Beta 8", "2016-08-26", false, undefined],
      ["GM", "2016-09-07", false, "iOS 10.0.1 build 14A403"],
      ["Public", "2016-09-13", false, "iOS 10.0.1 build 14A403"],
    ],
  ],
  [
    "10.1",
    "2016-10-24",
    [
      ["Beta 1", "2016-09-21", false, undefined],
      ["Beta 2", "2016-10-04", false, undefined],
      ["Beta 3", "2016-10-10", false, undefined],
      ["Beta 4", "2016-10-17", false, "7/7+ Only"],
      ["Beta 5", "2016-10-19", false, undefined],
      ["Public", "2016-10-24", false, undefined],
    ],
  ],
  [
    "10.2",
    "2016-12-12",
    [
      ["Beta 1", "2016-10-31", false, undefined],
      ["Beta 2", "2016-11-07", false, undefined],
      ["Beta 3", "2016-11-14", false, undefined],
      ["Beta 4", "2016-11-28", false, undefined],
      ["Beta 5", "2016-12-02", false, undefined],
      ["Beta 6", "2016-12-05", false, undefined],
      ["Beta 7", "2016-12-07", false, undefined],
      ["Public", "2016-12-12", false, undefined],
    ],
  ],
  ["10.2.1", "2017-01-23", [["Public", "2017-01-23", false, undefined]]],
  [
    "10.3",
    "2017-03-27",
    [
      ["Beta 1", "2017-01-24", false, undefined],
      ["Beta 2", "2017-02-06", false, undefined],
      ["Beta 3", "2017-02-20", false, undefined],
      ["Beta 4", "2017-02-27", false, undefined],
      ["Beta 5", "2017-03-08", false, undefined],
      ["Beta 6", "2017-03-13", false, undefined],
      ["Beta 7", "2017-03-16", false, undefined],
      ["Public", "2017-03-27", false, undefined],
    ],
  ],
  ["10.3.1", "2017-04-03", [["Public", "2017-04-03", false, undefined]]],
  ["10.3.2", "2017-05-15", [["Public", "2017-05-15", false, undefined]]],
  ["10.3.3", "2017-07-19", [["Public", "2017-07-19", false, undefined]]],
];
const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter(
    (version) => version.platform === "iOS" && version.majorVersion === 10,
  )
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
assert.deepEqual(
  stableValue(seedInventory),
  stableValue(expectedSeedInventory),
  "The exact local iOS 10 seed inventory changed; re-audit this cohort.",
);

const expectedCounts = new Map([
  ["version-ios-10-1/beta-1", 3],
  ["version-ios-10-1/beta-2", 3],
  ["version-ios-10-2/beta-1", 10],
  ["version-ios-10-2/beta-2", 4],
  ["version-ios-10-2/beta-3", 4],
  ["version-ios-10-2/beta-5", 5],
  ["version-ios-10-3/beta-1", 15],
  ["version-ios-10-3/beta-2", 12],
  ["version-ios-10-3/beta-3", 5],
  ["version-ios-10-3/beta-4", 1],
]);
assert.equal(bundle.versions.length, 0);
assert.equal(bundle.builds.length, 0);
assert.equal(events.length, expectedCounts.size);
for (const event of events) {
  const key = routeKey(
    event.identity.releaseVersionId,
    event.identity.routeAlias,
  );
  const expectedRoute = routeByKey.get(key);
  assert(expectedRoute, `${key} route definition`);
  assert.equal(event.changes.length, expectedCounts.get(key), `${key} count`);
  assert.deepEqual(
    event.target,
    {
      releaseVersionId: expectedRoute.releaseVersionId,
      routeAlias: expectedRoute.alias,
    },
    `${key} exact target`,
  );
  assert.equal(event.identity.platformId, "platform-ios");
  assert.equal(event.identity.stableEventId, expectedRoute.stableEventId);
  assert.equal(event.identity.label, expectedRoute.label);
  assert.equal(event.identity.appearanceDate, expectedRoute.date);
  assert.equal(event.identity.sequence, expectedRoute.sequence);
  assert.equal(event.identity.channel, "developerBeta");
  assert.equal(event.identity.isRevision, false);
  assert.equal(event.identity.closesReleaseCycle, false);
  assert.equal(event.identity.availabilityState, "available");
  assert.equal(event.authorship, "originalSynthesis");
  assert.equal(event.article.authorship, "originalSynthesis");
  assert.equal(event.provenanceStatus, "editoriallyVerified");
  assert.equal(event.editorialReview.status, "approved");
  assert.equal(event.editorialReview.reviewedAt, reviewedAt);
  assert.equal(event.isIndexable, true);
  assert.notEqual(event.identity.routeAlias, "public");
}
assert.equal(
  events.reduce((total, event) => total + event.changes.length, 0),
  62,
  "Occurrence closure changed.",
);
assert(
  events
    .flatMap((event) => event.changes)
    .every((change) => change.evidenceState !== "confirmed"),
  "A mirrored or reported prerelease claim was promoted to confirmed.",
);
const occurrenceHistoryByKey = new Map();
for (const event of events) {
  const route = routeKey(
    event.identity.releaseVersionId,
    event.identity.routeAlias,
  );
  for (const change of event.changes) {
    occurrenceHistoryByKey.set(change.key, [
      ...(occurrenceHistoryByKey.get(change.key) || []),
      `${route}:${change.action}:${change.inheritance}`,
    ]);
  }
}
const expectedRecurringHistories = new Map([
  [
    K.reducedMotionMessages,
    [
      "version-ios-10-1/beta-1:knownIssue:delta",
      "version-ios-10-1/beta-2:fixed:delta",
    ],
  ],
  [
    K.emergencySos,
    [
      "version-ios-10-2/beta-2:introduced:delta",
      "version-ios-10-2/beta-3:changed:delta",
    ],
  ],
  [
    K.lanAssetCache,
    [
      "version-ios-10-3/beta-2:knownIssue:delta",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
  [
    K.lightningAdapters,
    [
      "version-ios-10-3/beta-2:knownIssue:delta",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
  [
    K.sharedIpadSettings,
    [
      "version-ios-10-3/beta-2:regression:delta",
      "version-ios-10-3/beta-4:fixed:delta",
    ],
  ],
  [
    K.simulatorIcloudCrash,
    [
      "version-ios-10-3/beta-2:knownIssue:delta",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
  [
    K.siriCarCommands,
    [
      "version-ios-10-3/beta-1:knownIssue:delta",
      "version-ios-10-3/beta-2:knownIssue:cumulative",
    ],
  ],
  [
    K.findAirPodsReliability,
    [
      "version-ios-10-3/beta-1:knownIssue:delta",
      "version-ios-10-3/beta-2:knownIssue:cumulative",
      "version-ios-10-3/beta-3:fixed:delta",
    ],
  ],
]);
assert.deepEqual(
  new Set(
    [...occurrenceHistoryByKey]
      .filter(([, history]) => history.length > 1)
      .map(([key]) => key),
  ),
  new Set(expectedRecurringHistories.keys()),
  "Recurring change-key closure changed.",
);
for (const [key, history] of expectedRecurringHistories) {
  assert.deepEqual(occurrenceHistoryByKey.get(key), history, `${key} history`);
}
assert.deepEqual(
  events
    .flatMap((event) => event.changes)
    .filter((change) => change.inheritance === "cumulative")
    .map((change) => change.key)
    .sort(),
  [K.findAirPodsReliability, K.siriCarCommands].sort(),
  "Cumulative-state allowlist changed.",
);

for (const version of expectedSeedInventory) {
  const releaseVersionId = `version-ios-${version[0].replaceAll(".", "-")}`;
  const owners = publicBatch.events.filter(
    (event) =>
      event.target?.releaseVersionId === releaseVersionId &&
      event.target?.routeAlias === "public",
  );
  assert.equal(owners.length, 1, `Public owner count for ${releaseVersionId}`);
  assert.equal(owners[0].editorialReview?.status, "approved");
  assert.equal(owners[0].provenanceStatus, "editoriallyVerified");
  assert.equal(owners[0].isIndexable, true);
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
  const prior = localDefinitions.get(change.key);
  assert(!prior || prior === definition, `Definition drift for ${change.key}.`);
  localDefinitions.set(change.key, definition);
}
assert.equal(localDefinitions.size, definitions.size);
assert.equal(sharedOwners.size, 4);
assert(
  [...localDefinitions.keys()].every(
    (key) =>
      sharedOwners.has(key) || key.startsWith("apple-ios-10-point-prerelease-"),
  ),
  "A new key lacks the cohort namespace.",
);

const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherRoutes = new Map();
const otherStableIds = new Map();
const otherDefinitions = new Map();
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
    if (stableEventId) otherStableIds.set(stableEventId, file);
  }
}
for (const [key, definition] of localDefinitions) {
  const collisions = otherDefinitions.get(key) || [];
  if (sharedOwners.has(key)) {
    assert(
      collisions.some(
        (collision) =>
          collision.file === publicPath && collision.definition === definition,
      ),
      `Shared owner drift for ${key}.`,
    );
    assert(
      collisions.every((collision) => collision.definition === definition),
      `Conflicting shared definition for ${key}.`,
    );
  } else {
    assert.equal(collisions.length, 0, `New key collision for ${key}.`);
  }
}
for (const route of routes) {
  const key = routeKey(route.releaseVersionId, route.alias);
  assert(!otherRoutes.has(key), `Existing batch owns ${key}.`);
  assert(
    !otherStableIds.has(route.stableEventId),
    `Existing batch owns ${route.stableEventId}.`,
  );
}

const citationUrls = new Set();
const collectCitationUrls = (value) => {
  if (Array.isArray(value)) {
    value.forEach(collectCitationUrls);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      item.forEach((citation) => citationUrls.add(citation.url));
    } else {
      collectCitationUrls(item);
    }
  }
};
collectCitationUrls(bundle);
const sourceUrls = new Set(sources.map((item) => item.url));
assert.equal(sourceUrls.size, sources.length, "Duplicate source URL.");
assert.deepEqual(
  [...citationUrls].sort(),
  [...sourceUrls].sort(),
  "Declared/use source closure failed.",
);

const outputPath = join(here, outputName);
const json = await prettier.format(JSON.stringify(bundle), {
  filepath: outputPath,
});
writeFileSync(outputPath, json);
const jsonSha = sha256(json);
const researchJsonFiles = readdirSync(here)
  .filter((name) => name.endsWith(".json"))
  .sort();
const globalResearchDefinitionKeys = new Set();
for (const name of researchJsonFiles) {
  const candidate = JSON.parse(readFileSync(join(here, name), "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const change of owner.changes || []) {
      globalResearchDefinitionKeys.add(change.key);
    }
  }
}
const occurrenceCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
const citationCount = (() => {
  let total = 0;
  const walk = (value) => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const [key, item] of Object.entries(value)) {
      if (key === "citations" && Array.isArray(item)) total += item.length;
      else walk(item);
    }
  };
  walk(bundle);
  return total;
})();
const routeRows = events
  .map(
    (event) =>
      `| iOS ${routes.find((route) => route.stableEventId === event.identity.stableEventId).version} | ${event.identity.label} | \`${event.identity.routeAlias}\` | ${event.identity.appearanceDate} | ${event.changes.length} |`,
  )
  .join("\n");
const sourceRows = sources
  .map(
    (item) =>
      `- [${item.title}](${item.url}) — ${item.publisher}; ${item.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple iOS 10 point-release prerelease archive batch

## Result

\`${outputName}\` is the independently reviewed, source-backed launch bundle
for selected iOS 10.1, 10.2, and 10.3 developer-beta pages. It does not modify
the separately owned iOS 10.0 prerelease or Public-release batches.

- ${events.length} approved event pages, all reviewed at \`${reviewedAt}\`
- ${occurrenceCount} milestone occurrences across ${localDefinitions.size}
  stable definitions
- ${sources.length} declared and used sources with ${citationCount} citation
  references
- four exact Public-definition reuses
- zero version overlays, build documents, or Public patches; all ten event
  overlays share the exact approval timestamp and are indexable

## Exact route closure

| Release | Milestone | Route alias | Appearance | Records |
| ------- | --------- | ----------- | ---------- | ------: |
${routeRows}

## Evidence method

1. Contemporary reports establish Beta 1 and other observed user-facing
   changes where no Apple prerelease document remains publicly retrievable.
2. Apple-authored PDFs preserved as contemporaneous forum attachments provide
   exact fixed, changed, and known-issue states for iOS 10.2 Beta 5 and iOS
   10.3 Betas 2 through 4.
3. The attachment page is retained as each PDF source's archive URL; the source
   is credited to Apple and never relabeled as MacRumors-authored release
   notes.
4. Current Apple Developer archive pages establish only final SDK boundaries.
   They do not manufacture an earlier beta appearance.
5. All build numbers remain citation context because no device-specific Apple
   artifact set was retained.
6. Fifteen publisher article timestamps and nine attachment-thread first-post
   timestamps are retained exactly. The three Apple archive pages expose only a
   date field, so the candidate does not invent a timestamp for them.

## Exact omissions and negative evidence

- iOS 10.1 Beta 3 is not assigned duplicate Message-effects content:
  same-day Beta 2 hands-on evidence already shows the working behavior, while a
  later Beta 4 article retrospectively assigns it to Beta 3.
- iOS 10.1 Beta 4 reporting found no outward-facing addition, and Beta 5's
  release notes listed no new fix. These are absence-of-new-note boundaries,
  not claims that the software binaries were unchanged.
- iOS 10.2 Beta 4 reporting says no new feature was introduced.
- The Apple-authored iOS 10.2 Beta 5, Beta 6, and Beta 7 PDFs have the same
  substantive note body after beta-number normalization. Beta 5 owns that
  state; the later routes are not padded with duplicate occurrences.
- The Apple-authored iOS 10.3 Beta 4 through Beta 7 PDFs likewise normalize to
  the same substantive note body. Beta 4 owns its newly fixed Shared iPad
  transition.
- The local catalog has no prerelease milestones for iOS 10.2.1, 10.3.1,
  10.3.2, or 10.3.3. This batch does not invent them.
- A contemporaneous iOS 10.1 forum post links Apple's original gated PDF, but
  the current Apple URL returns an authentication page and the named
  third-party mirror now returns a parked-domain response. Neither is treated
  as surviving note evidence.
- The raw directory also contains four explicitly excluded artifacts: two
  Cloudflare challenge responses, an exploratory Beta 1 forum discussion with
  no matching note attachment, and a derived Swift extraction result. Their
  bytes and hashes remain audited, but none is a cited source.

## Copyright and attribution controls

- Reader-facing titles, summaries, occurrences, and articles are original
  synthesis.
- Every factual record has claim-level citations with bounded locators.
- No article body, screenshot, transcript, or long quotation is committed.
- The executable audit pins exact raw source states, checks each locator,
  verifies PDF semantics, and enforces a maximum five-word contiguous overlap
  for reader-facing prose.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceRows}

## Closure guards

- Exact comparison against all eight local iOS 10 seed records and every
  milestone
- SHA-256 guards on the approved Public owner plus the independent iOS 10.0
  prerelease builder, JSON, and ledger
- Exact 10-route identity, date, channel, and occurrence-count allowlist
- Exact eight-key recurrence histories and a two-key cumulative-state allowlist
- Batch namespace \`apple-ios-10-point-prerelease-\`
- Collision scan across every other checked-in research-batch JSON
- ${occurrenceCount} occurrences resolve to exactly ${localDefinitions.size}
  definitions, including four unchanged Public-owner definitions
- Complete unique source declaration/use closure
- No version, build, or Public-route mutation; exact approval and indexability
  assertions on every event; the generator itself has no apply or deployment
  path
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Superseded prior production dry plan

Before the current editorial corrections, a production comparison was run
twice without \`--apply\`; both historical passes returned plan digest
\`f493f24a229b781a7369161f3e2746435cba381476ea4d7bd1982600cef1ece2\`.
The retained plan and rollback artifacts are audited offline below, but this
digest is stale because the candidate's source metadata, articles, and
occurrence histories have since changed. It must not be applied.

- The historical plan declared 76 creates: 27 source documents and 49 new,
  cohort-namespaced release-change definitions.
- It declared 14 revision-guarded patches: ten existing legacy release-event
  documents and four citation-only patches to the exact reused Public-owner
  change definitions.
- It declared zero version, event, or build creates; zero version patches; and
  2,089 unchanged documents.
- Its historical mutation payload was 165,796 bytes, or 4.3% of the guarded
  limit.
- source snapshot digest:
  \`caf57fbf8ddbf199f9487ca4278d61303b6f1bb6ddc2df8642a144869575b382\`
- plan artifact: 368,693 bytes; raw SHA-256
  \`d0f8e3fc18d8399487b6956d009fefdfd23322182219abd828a8db375dfa3bda\`
- rollback snapshot: 18,554 bytes; raw SHA-256
  \`34c7a3adc849c879ae1ae4af80bde538accd6c2ce32d5bb5f342f1ac70f319ea\`;
  rollback digest
  \`b6c620bab92200da7caf6b9ba65f7efa28b558c8fd39cfb05e41321d6091fec3\`
- rollback coverage: all 76 proposed created IDs plus exact restoration copies
  for ten release events and four shared release changes

Offline inspection confirms that the old event patches contained only article,
change-occurrence, citation, summary, provenance, and review-state fields; the
old shared-change patches contained only citations. Their rollback artifact
covers every historical create and patch target. That historical plan was never
applied and predates the final editorial approval, corrected PDF locator, and
copyright recheck recorded in this ledger.

## Reviewed replacement production plan

The final approved bundle was compared with production
${reviewedPlan.deterministicRuns} times without \`--apply\`. Every pass
reproduced plan \`${reviewedPlan.planSha}\` against source snapshot
\`${reviewedPlan.sourceSnapshotSha}\`; no Sanity data changed.

- reviewed plan artifact SHA-256:
  \`${reviewedPlan.planArtifactSha}\`
- rollback artifact SHA-256:
  \`${reviewedPlan.rollbackArtifactSha}\`
- ${reviewedPlan.creates} creates:
  ${reviewedPlan.sourceCreates} sources and
  ${reviewedPlan.changeCreates} cohort-namespaced change definitions
- ${reviewedPlan.patches} revision-guarded patches:
  ${reviewedPlan.eventPatches} exact legacy event overlays and
  ${reviewedPlan.sharedChangePatches} citation-and-review-only shared-definition
  patches
- ${reviewedPlan.unchanged.toLocaleString("en-US")} unchanged documents; zero
  version, event, or build creates and zero version patches
- ${reviewedPlan.mutationPayloadBytes.toLocaleString("en-US")}-byte mutation
  payload
- exact offline audit: all 27 sources, 53 definitions, 10 routes, 62
  occurrences, prior shared citations, revision guards, creates, restores, and
  rollback targets match the approved bundle

Publication is intentionally pending explicit user approval. This reviewed
plan has not been applied, no receipt exists, and the ten routes remain in
their prior production state.

## Verification

- independent editorial review: all ${events.length} events are approved at
  \`${reviewedAt}\`, indexable, and marked \`editoriallyVerified\`
- deterministic JSON SHA-256:
  \`${jsonSha}\`
- evidence audit: 18 cited HTML states, nine Apple-authored PDFs, nine
  attachment-page provenance states, ten negative-access artifacts, and four
  explicit exclusions; 50 files and 6,872,144 total audited bytes
- retained evidence: 46 files and 6,513,889 bytes; excluded evidence: four
  files and 358,255 bytes
- one separately derived 612×792 PDF render is hash-pinned at 26,540 bytes and
  is not counted as source evidence
- PDF audit: 45 physical pages, 33 exact PDF locator assertions, three
  equivalent iOS 10.2 late-cycle documents, and four equivalent iOS 10.3
  late-cycle documents
- source-custody audit: 24 exact publication-timestamp assertions and three
  Apple archive sources intentionally left without invented timestamps
- claim audit: ${citationCount} exact final-phrase citation assertions across
  all ${sources.length} declared sources
- recurrence audit: eight exact multi-route histories and two cumulative
  occurrences
- copyright audit: ${occurrenceCount} occurrences and 298 reader-facing fields;
  maximum contiguous source overlap of five words
- global research validation: ${researchJsonFiles.length} batches and
  ${globalResearchDefinitionKeys.size.toLocaleString("en-US")} globally
  consistent change keys
- focused ingestion/manifest tests: 19 passed
- complete direct Node test harness: 131 passed
- focused ESLint and Prettier checks: passed

## Reproduction

\`\`\`sh
node scripts/research-batches/build-apple-ios-10-point-prerelease.mjs
node scripts/research-batches/apple-ios-10-point-prerelease-audit.mjs /path/to/evidence
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-10-point-prerelease.mjs scripts/research-batches/apple-ios-10-point-prerelease-audit.mjs
npx prettier --check scripts/research-batches/build-apple-ios-10-point-prerelease.mjs scripts/research-batches/apple-ios-10-point-prerelease-audit.mjs scripts/research-batches/apple-ios-10-point-prerelease.json scripts/research-batches/apple-ios-10-point-prerelease.md
node --import tsx --test tests/*.test.ts
\`\`\`

The reproduction list above covers the deterministic local evidence and content
audit. Production planning and publication are recorded separately only after
their exact artifacts have been reviewed.
`;

const formattedMd = await prettier.format(md, {
  filepath: join(here, ledgerName),
});
writeFileSync(join(here, ledgerName), formattedMd);

console.log(
  `${outputName}: ${events.length} events, ${occurrenceCount} occurrences, ${sources.length} sources, SHA-256 ${jsonSha}`,
);
