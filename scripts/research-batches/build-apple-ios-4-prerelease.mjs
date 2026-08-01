import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-ios-4-prerelease.json";
const ledgerName = "apple-ios-4-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T12:29:13Z";

const U = {
  beta1Apple:
    "https://www.apple.com/newsroom/2010/04/08Apple-Previews-iPhone-OS-4/",
  beta1Developer: "https://developer.apple.com/news/?id=04092010a",
  beta1Api:
    "https://www.macrumors.com/2010/04/08/apple-releases-iphone-sdk-4-beta-to-developers/",
  beta2Identity:
    "https://www.macrumors.com/2010/04/20/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers/",
  beta2Notes:
    "https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-2-and-sdk-to-developers.901243/page-2",
  beta3Notes:
    "https://forum.donanimhaber.com/apple-iphone-os-4-0-in-3-beta-surumunu-ve-sdk-i-yayinladi-g--39542933",
  beta3Identity:
    "https://techcrunch.com/2010/05/04/iphone-os-4-beta-3-released-to-developers/",
  beta3Withdrawal: "https://www.macworld.com/article/205244/iphoneos4.html",
  beta3Features:
    "https://www.macrumors.com/2010/05/04/latest-iphone-os-4-beta-gains-orientation-lock-and-ipod-controls-in-multitasking-interface/",
  beta3FeaturesSecond:
    "https://www.engadget.com/2010-05-04-iphone-os-4-beta-3-adds-orientation-lock-ipod-controls-to-multi.html",
  beta4Identity:
    "https://www.macrumors.com/2010/05/18/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers/",
  beta4Notes:
    "https://forums.macrumors.com/threads/apple-releases-iphone-os-4-beta-4-and-sdk-to-developers.918718/page-2",
  beta4Features:
    "https://www.pcworld.com/article/512877/iphone_os_4_beta_4_new_features_breakdown.html",
  beta4FeaturesSecond:
    "https://gizmodo.com/heres-whats-new-in-iphone-os-4-0-beta-4-5542143",
  gmIdentity:
    "https://www.macrumors.com/2010/06/07/ios-4-0-golden-master-and-itunes-9-2-seeded-to-developers/",
  gmCompatibility:
    "https://www.engadget.com/2010-06-07-ios-4-gold-build-now-available-to-iphone-developer-program-membe.html/",
  gmNaming:
    "https://www.macrumors.com/2010/06/07/iphone-os-4-becomes-ios-4-available-june-21-for-free/",
  gmNamingSecond:
    "https://www.engadget.com/2010-06-07-iphone-os-4-renamed-ios-gets-1500-new-features.html",
  publicBoundary:
    "https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/",
};

const sources = [
  {
    url: U.beta1Apple,
    title: "Apple Previews iPhone OS 4",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2010-04-08T00:00:00.000Z",
    topics: [
      "iPhone OS 4",
      "Beta 1",
      "features",
      "enterprise",
      "release identity",
    ],
  },
  {
    url: U.beta1Developer,
    title: "Download the New iPhone SDK and iPhone OS 4 beta Today",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2010-04-09T00:00:00.000Z",
    topics: ["iPhone OS 4", "Beta 1", "SDK", "APIs", "release identity"],
  },
  {
    url: U.beta1Api,
    title: "Apple Releases iPhone SDK 4 Beta to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-04-08T12:16:51-07:00",
    topics: [
      "iPhone OS 4",
      "Beta 1",
      "developer APIs",
      "contemporaneous report",
    ],
  },
  {
    url: U.beta2Identity,
    title: "Apple Releases iPhone OS 4 Beta 2 and SDK to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-04-20T11:40:56-07:00",
    topics: ["iPhone OS 4", "Beta 2", "release identity"],
  },
  {
    url: U.beta2Notes,
    title: "iPhone OS 4 Beta 2 developer known-issues transcript",
    publisher: "MacRumors Forums",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2010-04-20T12:43:29-07:00",
    topics: [
      "iPhone OS 4",
      "Beta 2",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta3Notes,
    title: "iPhone SDK Release Notes for iPhone OS 4.0 Beta 3 transcript",
    publisher: "DonanımHaber Forum",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2010-05-04T22:21:29+03:00",
    topics: [
      "iPhone OS 4",
      "Beta 3",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta3Identity,
    title: "iPhone OS 4 Beta 3 released to developers",
    publisher: "TechCrunch",
    sourceClass: "journalism",
    author: "Greg Kumparak",
    publishedAt: "2010-05-04T18:57:07.000Z",
    topics: ["iPhone OS 4", "Beta 3", "release identity"],
  },
  {
    url: U.beta3Withdrawal,
    title: "iPhone OS 4.0 beta reveals latest Apple goodies",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "John Cox",
    publishedAt: "2010-05-05T06:33:00-07:00",
    topics: ["iPhone OS 4", "Beta 3", "temporary withdrawal", "SDK installer"],
  },
  {
    url: U.beta3Features,
    title:
      "Latest iPhone OS 4 Beta Gains Orientation Lock and iPod Controls in Multitasking Interface",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-05-04T12:16:54-07:00",
    topics: ["iPhone OS 4", "Beta 3", "orientation lock", "iPod controls"],
  },
  {
    url: U.beta3FeaturesSecond,
    title:
      "iPhone OS 4 beta 3 adds orientation lock, iPod controls to multitasking bar",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Chris Rawson",
    publishedAt: "2010-05-04T23:00:00.000Z",
    topics: ["iPhone OS 4", "Beta 3", "orientation lock", "iPod controls"],
  },
  {
    url: U.beta4Identity,
    title: "Apple Releases iPhone OS 4 Beta 4 and SDK to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2010-05-18T12:50:22-07:00",
    topics: ["iPhone OS 4", "Beta 4", "release identity"],
  },
  {
    url: U.beta4Notes,
    title: "iPhone OS 4 Beta 4 developer known-issues transcript",
    publisher: "MacRumors Forums",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2010-05-18T18:05:26-07:00",
    topics: [
      "iPhone OS 4",
      "Beta 4",
      "Apple Developer release notes",
      "historical transcript",
    ],
  },
  {
    url: U.beta4Features,
    title: "iPhone OS 4.0 Beta 4: New Features Breakdown",
    publisher: "PCWorld",
    sourceClass: "journalism",
    author: "Brennon Slattery",
    publishedAt: "2010-05-19T13:14:00-07:00",
    topics: ["iPhone OS 4", "Beta 4", "observed changes"],
  },
  {
    url: U.beta4FeaturesSecond,
    title: "Here’s What’s New In iPhone OS 4.0 Beta 4",
    publisher: "Gizmodo",
    sourceClass: "journalism",
    author: "Rosa Golijan",
    publishedAt: "2010-05-19T01:16:05.000Z",
    topics: ["iPhone OS 4", "Beta 4", "observed changes"],
  },
  {
    url: U.gmIdentity,
    title: "iOS 4.0 Golden Master and iTunes 9.2 Seeded to Developers",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2010-06-07T18:51:02-07:00",
    topics: ["iOS 4", "GM", "release identity", "iTunes 9.2"],
  },
  {
    url: U.gmCompatibility,
    title: "iOS 4 gold build now available to iPhone Developer Program members",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Chris Ziegler",
    publishedAt: "2010-06-08T00:36:00.000Z",
    topics: ["iOS 4", "GM", "installation", "iTunes 9.2"],
  },
  {
    url: U.gmNaming,
    title: "iPhone OS 4 Becomes iOS 4, Available June 21 for Free",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Marianne Schultz",
    publishedAt: "2010-06-07T11:08:56-07:00",
    topics: ["iOS 4", "GM", "product naming", "Bing"],
  },
  {
    url: U.gmNamingSecond,
    title: "iPhone OS 4 renamed iOS 4, launching June 21",
    publisher: "Engadget",
    sourceClass: "journalism",
    author: "Nilay Patel",
    publishedAt: "2010-06-07T17:26:00.000Z",
    topics: ["iOS 4", "GM", "product naming", "Bing"],
  },
  {
    url: U.publicBoundary,
    title: "Apple Presents iPhone 4",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2010-06-07T00:00:00.000Z",
    topics: ["iOS 4", "public release boundary", "June 21"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ style: "normal", text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });
const uniqueCitations = (citations) => [
  ...new Map(
    citations.map((citation) => [
      `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
      citation,
    ]),
  ).values(),
];

const r = ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  citations,
  inheritance = "delta",
  documentedStatus = "documented",
  evidenceState = "corroborated",
  occurrenceSummary,
  verificationMethod,
}) => ({
  key: `ios-4-0-${key}`,
  title,
  canonicalSummary,
  category,
  action,
  component,
  citations,
  inheritance,
  documentedStatus,
  evidenceState,
  occurrenceSummary,
  verificationMethod,
});

const applePreviewRecord = (
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  locator,
  urls = [U.beta1Apple],
) =>
  r({
    key: `beta1-${key}`,
    title,
    canonicalSummary,
    category,
    action,
    component,
    citations: urls.map((url) =>
      c(
        url,
        locator,
        url === U.beta1Apple
          ? "First-party preview of the Beta 1 state."
          : "Contemporaneous developer-facing context.",
      ),
    ),
    evidenceState: urls.includes(U.beta1Apple) ? "confirmed" : "corroborated",
    verificationMethod:
      "Matched the narrow capability statement in the byte-audited source and rewrote it as original synthesis.",
  });

const archivedRecord = ({
  route,
  key,
  stableKey,
  title,
  canonicalSummary,
  category,
  action,
  component,
  marker,
  transcriptUrl,
  identityUrl,
  inheritance = "delta",
  documentedStatus = "documented",
  occurrenceSummary,
}) =>
  r({
    key: stableKey || `${route}-${key}`,
    title,
    canonicalSummary,
    category,
    action,
    component,
    inheritance,
    documentedStatus,
    occurrenceSummary,
    citations: [
      c(
        transcriptUrl,
        `${component}; ${marker}`,
        "Apple-authored developer-note text preserved by the credited host; factual result rewritten in original language.",
      ),
      c(
        identityUrl,
        `${route.replace("beta", "Beta ")} release identity and timing`,
        "Contemporaneous milestone corroboration.",
      ),
    ],
    verificationMethod:
      "Matched the component and short status marker in the normalized, byte-hashed historical transcript. The host and Apple authorship are separately disclosed.",
  });

const reportedRecord = ({
  route,
  key,
  title,
  canonicalSummary,
  category,
  action,
  component,
  citations,
  evidenceState = "corroborated",
  documentedStatus = "undocumented",
  verificationMethod,
}) =>
  r({
    key: `${route}-${key}`,
    title,
    canonicalSummary,
    category,
    action,
    component,
    citations,
    documentedStatus,
    evidenceState,
    verificationMethod:
      verificationMethod ||
      "Reconciled the narrowly stated observation across the cited contemporaneous reports; no publisher wording is reproduced.",
  });

const beta1Changes = [
  applePreviewRecord(
    "multitasking-services",
    "Third-party applications gained multitasking services",
    "The first iPhone OS 4 beta exposed a defined set of background and fast-switching services to third-party applications.",
    "feature",
    "introduced",
    "Multitasking",
    "Multitasking; seven services",
    [U.beta1Apple, U.beta1Developer],
  ),
  applePreviewRecord(
    "folders",
    "Folders organized applications",
    "Users could group applications into automatically named and editable folders.",
    "feature",
    "introduced",
    "Home Screen",
    "Folders",
  ),
  applePreviewRecord(
    "mail",
    "Mail combined inboxes and conversations",
    "Mail added a unified inbox, faster account switching, threaded conversations, and compatible-app attachment handling.",
    "feature",
    "introduced",
    "Mail",
    "Unified Inbox and threaded messages",
  ),
  applePreviewRecord(
    "data-protection",
    "Passcode-backed data protection expanded",
    "Mail messages and attachments could use the device passcode as part of their at-rest protection.",
    "security",
    "introduced",
    "Enterprise",
    "Data Protection",
  ),
  applePreviewRecord(
    "mobile-device-management",
    "Mobile device management became extensible",
    "Enterprise administrators could integrate third-party servers with wireless configuration, query, lock, and wipe controls.",
    "feature",
    "introduced",
    "Enterprise",
    "Mobile Device Management",
  ),
  applePreviewRecord(
    "wireless-in-house-distribution",
    "Enterprises gained wireless in-house app distribution",
    "Organizations could securely host and wirelessly distribute internally developed applications.",
    "feature",
    "introduced",
    "Enterprise",
    "wireless app distribution",
  ),
  applePreviewRecord(
    "complex-passcodes",
    "Longer and more complex passcodes were supported",
    "The enterprise security controls added an option for longer, more complex device passcodes.",
    "security",
    "introduced",
    "Enterprise",
    "complex passcode",
  ),
  applePreviewRecord(
    "exchange",
    "Exchange account support broadened",
    "The beta supported multiple Exchange ActiveSync accounts and compatibility with Exchange Server 2010.",
    "compatibility",
    "changed",
    "Enterprise",
    "Exchange ActiveSync",
  ),
  applePreviewRecord(
    "ssl-vpn",
    "SSL VPN application support was announced",
    "The enterprise stack prepared for SSL VPN applications from supported network vendors.",
    "compatibility",
    "introduced",
    "Enterprise",
    "SSL VPN",
  ),
  applePreviewRecord(
    "iad",
    "iAd joined the application platform",
    "The beta introduced Apple’s in-application advertising platform and its developer integration path.",
    "developerApi",
    "introduced",
    "iAd",
    "iAd",
    [U.beta1Apple, U.beta1Developer],
  ),
  applePreviewRecord(
    "ibooks",
    "iBooks expanded to iPhone and iPod touch",
    "Apple’s ebook reader and store were announced for iPhone OS 4 devices.",
    "feature",
    "introduced",
    "iBooks",
    "iBooks",
  ),
  applePreviewRecord(
    "game-center-preview",
    "Game Center entered developer preview",
    "The social gaming preview exposed friend, invitation, matchmaking, achievement, and leaderboard services.",
    "developerApi",
    "introduced",
    "Game Center",
    "Game Center developer preview",
    [U.beta1Apple, U.beta1Developer],
  ),
  applePreviewRecord(
    "calendar-api",
    "Applications gained calendar access",
    "The SDK exposed calendar integration to third-party applications.",
    "developerApi",
    "introduced",
    "Calendar",
    "Calendar application API",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "in-app-sms",
    "Applications could present SMS composition",
    "The SDK added an in-application path for composing SMS messages.",
    "developerApi",
    "introduced",
    "Messaging",
    "in-app SMS",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "photo-library-api",
    "Applications gained Photos library access",
    "Third-party applications could work with photos and videos stored in the user’s library.",
    "developerApi",
    "introduced",
    "Photos",
    "Photos library access",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "video-control",
    "Video playback and capture controls expanded",
    "The SDK offered broader application control over video playback and capture.",
    "developerApi",
    "introduced",
    "Media",
    "video playback and capture",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "map-framework",
    "The map framework gained new capabilities",
    "The first beta expanded the mapping APIs available to applications.",
    "developerApi",
    "changed",
    "MapKit",
    "mapping improvements",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "quick-look",
    "Quick Look document previews reached applications",
    "Applications could use Quick Look functionality to preview supported documents.",
    "developerApi",
    "introduced",
    "Quick Look",
    "Quick Look functionality",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "accelerate",
    "Accelerate math routines joined the SDK",
    "The SDK exposed optimized vector, matrix, array, and linear-equation routines through Accelerate.",
    "developerApi",
    "introduced",
    "Accelerate",
    "Accelerate framework",
    [U.beta1Api, U.beta1Developer],
  ),
  applePreviewRecord(
    "attachment-apps",
    "Mail attachments could open in compatible applications",
    "Mail could hand supported attachments to compatible applications installed from the App Store.",
    "feature",
    "introduced",
    "Mail",
    "open email attachments",
  ),
];

const beta2Changes = [
  archivedRecord({
    route: "beta2",
    key: "itunes-folder-sync",
    title: "iTunes folder syncing could erase device folders",
    canonicalSummary:
      "Syncing with iTunes 9.1 could remove folders created on the device.",
    category: "knownIssue",
    action: "knownIssue",
    component: "iTunes",
    marker: "folders",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    inheritance: "cumulative",
  }),
  archivedRecord({
    route: "beta2",
    key: "llvm-compilers",
    title: "LLVM-based compilers became optional SDK choices",
    canonicalSummary:
      "The SDK offered LLVM-GCC and Clang-based LLVM as optional iPhone compilers.",
    category: "developerApi",
    action: "introduced",
    component: "Xcode",
    marker: "NEW; optional compiler",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "architecture-presets",
    title: "Xcode architecture presets changed",
    canonicalSummary:
      "The Standard and Optimized architecture presets adopted revised armv6 and armv7 defaults.",
    category: "compatibility",
    action: "changed",
    component: "Xcode",
    marker: "FIXED; Architectures presets",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "interface-builder-ipad-launch",
    title: "Interface Builder iPad launch entry was marked fixed",
    canonicalSummary:
      "The archived note labels the Simulator launch item FIXED even though its retained sentence still says the Interface Builder workflow is unsupported.",
    category: "compatibility",
    action: "changed",
    component: "Interface Builder",
    marker: "FIXED; launching iPad applications",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    occurrenceSummary:
      "Beta 2 preserves an internally inconsistent release-note entry: its status marker says FIXED while the issue sentence still describes the workflow as unsupported.",
  }),
  archivedRecord({
    route: "beta2",
    key: "address-book-thumbnails",
    title: "Address Book image thumbnails rendered correctly",
    canonicalSummary:
      "Person-view thumbnails no longer failed when image data was assigned before the displayed person.",
    category: "bugFix",
    action: "fixed",
    component: "AddressBook",
    marker: "FIXED; image thumbnails",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "custom-font-hang",
    title: "Custom font creation could hang",
    canonicalSummary:
      "Creating a font by name could hang when an application declared fonts through its property list.",
    category: "knownIssue",
    action: "knownIssue",
    component: "Core Graphics",
    marker: "UIAppFonts",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    inheritance: "cumulative",
  }),
  archivedRecord({
    route: "beta2",
    key: "gamekit-desired-players",
    title: "GameKit removed desiredPlayers",
    canonicalSummary:
      "The match-request API no longer exposed the desiredPlayers property.",
    category: "developerApi",
    action: "removed",
    component: "GameKit",
    marker: "NEW; desiredPlayers",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "gamekit-matchmaking",
    title: "GameKit matchmaking reliability improved",
    canonicalSummary:
      "The seed marked an intermittent matchmaking failure as fixed.",
    category: "bugFix",
    action: "fixed",
    component: "GameKit",
    marker: "FIXED; matchmaking",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "gamekit-preview-header",
    title: "The GameKit preview header was renamed",
    canonicalSummary:
      "The preview SDK replaced GameKitBeta.h with GameKitPreview.h.",
    category: "developerApi",
    action: "changed",
    component: "GameKit",
    marker: "NEW; GameKitPreview.h",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "mail-rfc-extensions",
    title: "Mail advertised additional RFC extensions",
    canonicalSummary:
      "Mail documented support for compression, search, chunking, MIME, status, and conditional-store extensions.",
    category: "compatibility",
    action: "changed",
    component: "Mail",
    marker: "RFC extensions",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    inheritance: "cumulative",
  }),
  archivedRecord({
    route: "beta2",
    key: "movie-audio-session",
    title: "Movie playback shared the application audio session",
    canonicalSummary:
      "Movie-player audio adopted the application’s audio session by default on newer system versions.",
    category: "developerApi",
    action: "changed",
    component: "MediaPlayer",
    marker: "application audio session",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    inheritance: "cumulative",
  }),
  archivedRecord({
    route: "beta2",
    key: "movie-fullscreen-output",
    title: "External movie fullscreen output was repaired",
    canonicalSummary:
      "Movie playback through UIScreen no longer lost expected output after entering fullscreen.",
    category: "bugFix",
    action: "fixed",
    component: "MediaPlayer",
    marker: "FIXED; UIScreen and fullscreen",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "find-my-iphone",
    title: "Find My iPhone remained unavailable",
    canonicalSummary:
      "The beta could not be located, messaged, locked, or wiped through the MobileMe web service.",
    category: "knownIssue",
    action: "knownIssue",
    component: "MobileMe",
    marker: "Find My iPhone",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    inheritance: "cumulative",
  }),
  archivedRecord({
    route: "beta2",
    key: "background-task-limit",
    title: "Background task completion time increased",
    canonicalSummary:
      "The documented completion window for a background task changed from five minutes to ten.",
    category: "developerApi",
    action: "changed",
    component: "Multitasking",
    marker: "NEW; time limit",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "simulator-touch-strip",
    title: "Simulator top-edge touch input was repaired",
    canonicalSummary:
      "The seed restored touch input along the simulator’s top edge.",
    category: "bugFix",
    action: "fixed",
    component: "Simulator",
    marker: "FIXED; unresponsive pixel area",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "document-open-in",
    stableKey: "document-open-in",
    title: "Document open-in selection",
    canonicalSummary:
      "Document interaction menus could fail to open the application selected by the user.",
    category: "bugFix",
    action: "knownIssue",
    component: "UIKit",
    marker: "presentOpenInMenu",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
    inheritance: "cumulative",
  }),
  archivedRecord({
    route: "beta2",
    key: "alert-text-field-layout",
    title: "Alert text-field layout handling changed",
    canonicalSummary:
      "Applications adding text fields to alerts needed to stop manually moving the alert view.",
    category: "developerApi",
    action: "changed",
    component: "UIKit",
    marker: "NEW; UIAlertView text field",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "image-picker-sizing",
    title: "Image picker sizing was repaired",
    canonicalSummary:
      "The image picker no longer drew selected imagery at an unexpected size.",
    category: "bugFix",
    action: "fixed",
    component: "UIKit ImagePicker",
    marker: "FIXED; expected size",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "password-cursor",
    title: "Password-field cursor rendering was repaired",
    canonicalSummary:
      "The password-entry cursor no longer blinked over the final character.",
    category: "bugFix",
    action: "fixed",
    component: "UIKit Text",
    marker: "FIXED; cursor",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
  archivedRecord({
    route: "beta2",
    key: "automation-simulator",
    title: "Simulator UI Automation targeting was repaired",
    canonicalSummary:
      "UI Automation no longer required manual accessibility preference changes before targeting the simulator.",
    category: "bugFix",
    action: "fixed",
    component: "UI Automation",
    marker: "FIXED; Simulator preferences",
    transcriptUrl: U.beta2Notes,
    identityUrl: U.beta2Identity,
  }),
];

const beta3Changes = [
  archivedRecord({
    route: "beta3",
    key: "beta1-erase-install",
    title: "Upgrades from Beta 1 required erase and restore",
    canonicalSummary:
      "A device moving from Beta 1 had to be erased, restored from backup, and assigned a new passcode.",
    category: "compatibility",
    action: "changed",
    component: "Upgrade",
    marker: "Important Note About Upgrading From Beta 1",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "backup-sdk-requirement",
    title: "Beta 3 backup and restore required its SDK",
    canonicalSummary:
      "Mac-based backup and restore workflows required the Beta 3 SDK to be installed after iTunes.",
    category: "compatibility",
    action: "changed",
    component: "Upgrade",
    marker: "Beta 3 SDK",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "avasset-reader-writer",
    title: "AVAssetReader and AVAssetWriter were removed",
    canonicalSummary:
      "The Beta 3 SDK removed the AVAssetReader and AVAssetWriter classes from AVFoundation.",
    category: "developerApi",
    action: "removed",
    component: "AVFoundation",
    marker: "Starting in Beta 3",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "llvm-simulator",
    stableKey: "llvm-simulator",
    title: "LLVM simulator targeting",
    canonicalSummary:
      "The optional LLVM compiler could require an additional flag when targeting the simulator.",
    category: "bugFix",
    action: "knownIssue",
    component: "Xcode",
    marker: "NEW; LLVM Compiler 1.5",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "camera-screenshots",
    title: "Camera and screenshot functionality was restored",
    canonicalSummary:
      "Photo capture, video capture, and screenshots were marked fixed in the Beta 3 state.",
    category: "bugFix",
    action: "fixed",
    component: "Camera",
    marker: "FIXED; photo/video and screen shots",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "gamekit-voice-echo",
    title: "GameKit voice-chat echo was repaired",
    canonicalSummary:
      "The seed marked the echo affecting GameKit voice chat as fixed.",
    category: "bugFix",
    action: "fixed",
    component: "Core Audio",
    marker: "FIXED; GameKit voice chat",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "local-notifications",
    title: "Local notifications fired on iPhone 3G",
    canonicalSummary:
      "Scheduled local notifications no longer failed to fire on iPhone 3G hardware.",
    category: "bugFix",
    action: "fixed",
    component: "UIKit",
    marker: "FIXED; iPhone 3G local notifications",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "document-open-in",
    stableKey: "document-open-in",
    title: "Document open-in selection",
    canonicalSummary:
      "Document interaction menus could fail to open the application selected by the user.",
    category: "bugFix",
    action: "fixed",
    component: "UIKit",
    marker: "FIXED; UIDocumentInteractionController",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "automation-template",
    stableKey: "automation-template",
    title: "Automation instrument template loading",
    canonicalSummary:
      "The Automation instrument or its template could fail to load without a manual configuration file.",
    category: "bugFix",
    action: "knownIssue",
    component: "UI Automation",
    marker: "NEW; Automation instrument",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "simulator-multiple-os-versions",
    title: "Simulator supported multiple OS versions",
    canonicalSummary:
      "A single universal binary could be simulated against both the iPhone OS 3.2 and 4.0 environments.",
    category: "developerApi",
    action: "introduced",
    component: "Simulator",
    marker: "multiple versions of iPhone OS",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  archivedRecord({
    route: "beta3",
    key: "simulator-nsurl-launch",
    stableKey: "simulator-nsurl-launch",
    title: "NSURL-based universal app simulator launch",
    canonicalSummary:
      "Applications built with the 4.0 SDK could fail to launch in the 3.2 simulator when using NSURL.",
    category: "bugFix",
    action: "knownIssue",
    component: "Simulator",
    marker: "_OBJC_CLASS_$_NSURL",
    transcriptUrl: U.beta3Notes,
    identityUrl: U.beta3Identity,
  }),
  reportedRecord({
    route: "beta3",
    key: "temporary-withdrawal",
    title: "The first Beta 3 posting was temporarily withdrawn",
    canonicalSummary:
      "Apple briefly removed the Beta 3 package after an SDK installation problem was reported.",
    category: "regression",
    action: "knownIssue",
    component: "Distribution",
    citations: [
      c(
        U.beta3Withdrawal,
        "temporary rescission; SDK installation process",
        "Contemporaneous report of the temporary withdrawal.",
      ),
      c(
        U.beta3Notes,
        "thread update; SDK installation problem",
        "The same-day archive records the withdrawal context.",
      ),
    ],
  }),
  reportedRecord({
    route: "beta3",
    key: "orientation-lock",
    title: "The app switcher gained an orientation lock",
    canonicalSummary:
      "A control beside the multitasking interface could lock the display orientation.",
    category: "feature",
    action: "introduced",
    component: "Multitasking interface",
    citations: [
      c(
        U.beta3Features,
        "orientation lock in multitasking interface",
        "Contemporaneous observed-change report.",
      ),
      c(
        U.beta3FeaturesSecond,
        "orientation lock",
        "Independent contemporaneous report.",
      ),
    ],
  }),
  reportedRecord({
    route: "beta3",
    key: "ipod-controls",
    title: "The app switcher gained iPod controls",
    canonicalSummary:
      "A secondary multitasking panel exposed playback, track navigation, and quick access to the iPod application.",
    category: "feature",
    action: "introduced",
    component: "Multitasking interface",
    citations: [
      c(
        U.beta3Features,
        "iPod controls",
        "Contemporaneous observed-change report.",
      ),
      c(
        U.beta3FeaturesSecond,
        "playback and track controls",
        "Independent contemporaneous report.",
      ),
    ],
  }),
];

const beta4Changes = [
  archivedRecord({
    route: "beta4",
    key: "llvm-simulator",
    stableKey: "llvm-simulator",
    title: "LLVM simulator targeting",
    canonicalSummary:
      "The optional LLVM compiler could require an additional flag when targeting the simulator.",
    category: "bugFix",
    action: "fixed",
    component: "Xcode",
    marker: "FIXED; LLVM Compiler 1.5",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "core-data-template-debugging",
    title: "Core Data template debugging was repaired",
    canonicalSummary:
      "Continuing after a breakpoint no longer crashed a simulator session created from the navigation Core Data template.",
    category: "bugFix",
    action: "fixed",
    component: "Xcode",
    marker: "FIXED; navigation core data template",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "simulator-nsurl-launch",
    stableKey: "simulator-nsurl-launch",
    title: "NSURL-based universal app simulator launch",
    canonicalSummary:
      "Applications built with the 4.0 SDK could fail to launch in the 3.2 simulator when using NSURL.",
    category: "bugFix",
    action: "fixed",
    component: "Core Foundation",
    marker: "FIXED; _OBJC_CLASS_$_NSURL",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "significant-location-changes",
    title: "Significant-change location updates were repaired",
    canonicalSummary:
      "Starting significant-location monitoring again delivered updates in the affected circumstances.",
    category: "bugFix",
    action: "fixed",
    component: "Core Location",
    marker: "FIXED; startMonitoringSignificantLocationChanges",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "background-alert-context",
    title: "Backgrounding preserved alerts and action sheets",
    canonicalSummary:
      "Applications linked for iPhone OS 4 no longer automatically canceled alerts and action sheets when entering the background.",
    category: "behavior",
    action: "changed",
    component: "Multitasking",
    marker: "preserve the user’s context",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "purchased-music-visibility",
    title: "Downloaded weekly promotional tracks reappeared",
    canonicalSummary:
      "Downloaded free-song promotions no longer disappeared from the Purchased playlist and search results after a database update.",
    category: "bugFix",
    action: "fixed",
    component: "Music Library",
    marker: "FIXED; free songs of the week",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "background-task-invalid-constant",
    title: "The invalid background-task constant was renamed",
    canonicalSummary:
      "UIKit replaced UIInvalidBackgroundTask with UIBackgroundTaskInvalid.",
    category: "developerApi",
    action: "changed",
    component: "UIKit",
    marker: "FIXED; UIBackgroundTaskInvalid",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "transition-animation-properties",
    title: "Transition blocks had an animation limitation",
    canonicalSummary:
      "Setting animatable properties inside a transition animation block could fail.",
    category: "knownIssue",
    action: "knownIssue",
    component: "UIKit",
    marker: "NEW; transition animation block",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "pattern-image-coordinates",
    title: "Pattern-image coordinate behavior changed",
    canonicalSummary:
      "Pattern images could appear upside down after their drawing coordinates were aligned with ordinary UIKit coordinates.",
    category: "developerApi",
    action: "changed",
    component: "UIKit",
    marker: "NEW; colorWithPatternImage",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  archivedRecord({
    route: "beta4",
    key: "automation-template",
    stableKey: "automation-template",
    title: "Automation instrument template loading",
    canonicalSummary:
      "The Automation instrument or its template could fail to load without a manual configuration file.",
    category: "bugFix",
    action: "fixed",
    component: "UI Automation",
    marker: "FIXED; Automation template",
    transcriptUrl: U.beta4Notes,
    identityUrl: U.beta4Identity,
  }),
  reportedRecord({
    route: "beta4",
    key: "utilities-folder",
    title: "The default layout grouped bundled apps",
    canonicalSummary:
      "The first-start Home Screen placed several bundled applications into a Utilities folder.",
    category: "behavior",
    action: "changed",
    component: "Home Screen",
    citations: [
      c(
        U.beta4Features,
        "Home Screen; utilities",
        "Contemporaneous observed-change report.",
      ),
      c(
        U.beta4FeaturesSecond,
        "default Home Screen; Utilities folder",
        "Independent contemporaneous report.",
      ),
    ],
  }),
  reportedRecord({
    route: "beta4",
    key: "default-wallpapers",
    title: "New default wallpapers appeared",
    canonicalSummary:
      "The beta added a built-in set of images intended for Home Screen backgrounds.",
    category: "enhancement",
    action: "introduced",
    component: "Home Screen",
    citations: [
      c(
        U.beta4Features,
        "Home Screen; wallpaper patterns",
        "Contemporaneous observed-change report.",
      ),
      c(
        U.beta4FeaturesSecond,
        "default wallpapers",
        "Independent contemporaneous report.",
      ),
    ],
  }),
  reportedRecord({
    route: "beta4",
    key: "group-messaging-toggle",
    title: "Messaging added a group-message toggle",
    canonicalSummary:
      "The messaging settings exposed a control for enabling or disabling group messages.",
    category: "feature",
    action: "introduced",
    component: "Messages",
    citations: [
      c(
        U.beta4Features,
        "Messaging; group messaging",
        "Contemporaneous observed-change report.",
      ),
      c(
        U.beta4FeaturesSecond,
        "group messages setting",
        "Independent contemporaneous report.",
      ),
    ],
  }),
  reportedRecord({
    route: "beta4",
    key: "photo-roll-orientation",
    title: "Photo Roll supported alternate orientations",
    canonicalSummary:
      "The Photos application could display the Photo Roll in more than one orientation.",
    category: "enhancement",
    action: "introduced",
    component: "Photos",
    citations: [
      c(
        U.beta4FeaturesSecond,
        "Photo Roll; different orientation",
        "Single contemporaneous observed-change report; retained as reported rather than corroborated.",
      ),
    ],
    evidenceState: "reported",
    verificationMethod:
      "Matched the narrow observation in the byte-audited article and retained reported evidence state because no independent second report was used.",
  }),
];

const gmChanges = [
  reportedRecord({
    route: "gm",
    key: "ios-name",
    title: "iPhone OS became iOS",
    canonicalSummary:
      "At the GM boundary, Apple’s mobile operating system adopted the iOS 4 product name.",
    category: "behavior",
    action: "changed",
    component: "Product identity",
    documentedStatus: "partiallyDocumented",
    citations: [
      c(U.gmNaming, "now known as iOS 4", "Contemporaneous naming report."),
      c(
        U.gmNamingSecond,
        "renamed to iOS",
        "Independent contemporaneous report tied to GM availability.",
      ),
      c(
        U.publicBoundary,
        "iOS 4 product name",
        "First-party confirmation of the resulting name and public boundary.",
      ),
    ],
  }),
  reportedRecord({
    route: "gm",
    key: "bing-search",
    title: "Bing became an additional search provider",
    canonicalSummary:
      "Safari’s search settings added Bing alongside the existing Google and Yahoo choices.",
    category: "feature",
    action: "introduced",
    component: "Safari",
    documentedStatus: "partiallyDocumented",
    citations: [
      c(U.gmNaming, "Bing search option", "Contemporaneous keynote report."),
      c(
        U.gmNamingSecond,
        "Bing search integration",
        "Independent contemporaneous report.",
      ),
    ],
  }),
  reportedRecord({
    route: "gm",
    key: "itunes-9-2-requirement",
    title: "GM installation required iTunes 9.2 beta",
    canonicalSummary:
      "Installing the GM depended on the contemporaneously seeded iTunes 9.2 beta.",
    category: "compatibility",
    action: "changed",
    component: "Installation",
    citations: [
      c(
        U.gmCompatibility,
        "installation requirement; iTunes 9.2 beta",
        "Contemporaneous hands-on installation report.",
      ),
      c(
        U.gmIdentity,
        "GM and iTunes 9.2 seeded together",
        "Independent confirmation that both candidates were seeded on the same date.",
      ),
    ],
  }),
];

const eventSpecs = [
  {
    alias: "beta-1",
    label: "Beta 1",
    date: "2010-04-08",
    sequence: 1,
    channel: "developerBeta",
    changes: beta1Changes,
    identitySources: [U.beta1Apple, U.beta1Developer],
    articleSources: [U.beta1Apple, U.beta1Developer, U.beta1Api],
    milestoneText:
      "Apple released the first iPhone OS 4 beta to registered developers on April 8, then published a developer notice the following day. The preview establishes the feature baseline; it does not imply that every API was publicly usable outside the prerelease program.",
    selectionText:
      "Twenty representative capabilities are retained from first-party feature and developer materials plus one contemporaneous API inventory. This is a first-document baseline, not a computed predecessor diff or an exhaustive copy of the more than 1,500 APIs Apple advertised.",
    gapText:
      "No complete public copy of the Beta 1 developer release-note document was located in this pass. General announcement claims are separated from the narrower API observations, and no build identifier is inferred.",
  },
  {
    alias: "beta-2",
    label: "Beta 2",
    date: "2010-04-20",
    sequence: 2,
    channel: "developerBeta",
    changes: beta2Changes,
    identitySources: [U.beta2Identity, U.beta2Notes],
    articleSources: [U.beta2Identity, U.beta2Notes],
    milestoneText:
      "Contemporaneous reporting places the second developer beta on April 20. A same-day forum post preserves Apple’s known-issues section, including its explicit NEW and FIXED markers and several unmarked current-state notes.",
    selectionText:
      "Fourteen explicit NEW or FIXED records are indexed as milestone deltas. Six unmarked entries are labeled cumulative so the page records the Beta 2 state without claiming that those conditions first appeared in this seed.",
    gapText:
      "The surviving copy is a participant-posted transcription of the known-issues section, not a first-party-hosted or complete release-note artifact. Workaround commands and long source prose are not republished.",
  },
  {
    alias: "beta-3",
    label: "Beta 3",
    date: "2010-05-04",
    sequence: 3,
    channel: "developerBeta",
    changes: beta3Changes,
    identitySources: [U.beta3Identity, U.beta3Notes, U.beta3Withdrawal],
    articleSources: [
      U.beta3Notes,
      U.beta3Identity,
      U.beta3Withdrawal,
      U.beta3Features,
      U.beta3FeaturesSecond,
    ],
    milestoneText:
      "Beta 3 appeared on May 4. The initial posting was briefly removed after an SDK installer problem and subsequently returned; the evidence supports one named Beta 3 milestone, not a separately named revision route.",
    selectionText:
      "Eleven entries come from Beta 3-specific upgrade, removal, new-issue, fixed, and simulator statements in the preserved Apple document. Three observed records cover the temporary withdrawal, the orientation lock, and the iPod controls with explicit non-Apple documentation labels.",
    gapText:
      "Cumulative FIXED lines already present in Beta 2 are not reassigned to Beta 3. A distinct reissue identity and build number are not created because the public evidence does not establish a separately named seed.",
  },
  {
    alias: "beta-4",
    label: "Beta 4",
    date: "2010-05-18",
    sequence: 4,
    channel: "developerBeta",
    changes: beta4Changes,
    identitySources: [U.beta4Identity, U.beta4Notes],
    articleSources: [
      U.beta4Identity,
      U.beta4Notes,
      U.beta4Features,
      U.beta4FeaturesSecond,
    ],
    milestoneText:
      "Apple’s fourth developer beta appeared on May 18. Its archived known-issues section can be compared with the Beta 3 transcript, while two contemporaneous reports preserve user-visible observations outside that developer text.",
    selectionText:
      "Ten developer records are limited to newly resolved, newly stated, or semantically changed Beta 4 entries. Four observed interface and settings changes are separately labeled undocumented; three have two reports and the Photo Roll orientation item remains reported from one source.",
    gapText:
      "Repeated cumulative FIXED lines are excluded when the Beta 3 transcript already carried the same state. Tethering and performance claims are also excluded because carrier availability and hardware context were not sufficiently bounded.",
  },
  {
    alias: "gm",
    label: "GM",
    date: "2010-06-07",
    sequence: 5,
    channel: "goldenMaster",
    changes: gmChanges,
    identitySources: [U.gmIdentity, U.gmCompatibility, U.gmNamingSecond],
    articleSources: [
      U.gmIdentity,
      U.gmCompatibility,
      U.gmNaming,
      U.gmNamingSecond,
      U.publicBoundary,
    ],
    milestoneText:
      "Apple seeded the Golden Master candidate on June 7, the same day the product adopted the iOS 4 name. Contemporary installation reporting ties the candidate to iTunes 9.2 beta, and Apple’s announcement fixes June 21 as the later public boundary.",
    selectionText:
      "Three narrowly supported boundary records are retained: the iOS naming transition, the addition of Bing as a search option, and the iTunes 9.2 beta installation dependency. They do not stand in for a missing GM release-note document.",
    gapText:
      "No complete inspectable GM-specific developer-note artifact was located. The page therefore remains deliberately small and exposes that limit instead of receiving synthetic fixes or a guessed build identity.",
  },
];

const occurrenceFor = (spec, item) => ({
  key: item.key,
  title: item.title,
  canonicalSummary: item.canonicalSummary,
  category: item.category,
  action: item.action,
  inheritance: item.inheritance,
  summary:
    item.occurrenceSummary ||
    (item.documentedStatus === "documented"
      ? `${spec.label} documents this ${item.component} capability, behavior, resolution, or limitation within the bounded evidence described for the route.`
      : `Contemporaneous reporting places this ${item.component} observation at ${spec.label}; it remains separately labeled because it is outside an Apple-hosted milestone note.`),
  documentedStatus: item.documentedStatus,
  evidenceState: item.evidenceState,
  verificationMethod: item.verificationMethod,
  citations: item.citations,
});

const eventArticle = (spec, changes) => {
  const identityCitations = spec.identitySources.map((url) =>
    c(url, `${spec.label} identity and timing`),
  );
  const articleCitations = spec.articleSources.map((url) =>
    c(url, `${spec.label} evidence boundary`),
  );
  const changeCitations = uniqueCitations(
    changes.flatMap((change) => change.citations),
  );
  return article(
    heading("Release milestone"),
    prose(spec.milestoneText, identityCitations),
    heading("What this page indexes"),
    prose(
      `${spec.label} has ${changes.length} structured records. Reader-facing titles and summaries are original synthesis, while short locators identify the evidence used for each factual statement.`,
      changeCitations,
    ),
    heading("Selection method"),
    prose(spec.selectionText, articleCitations),
    heading("Evidence gaps"),
    prose(spec.gapText, articleCitations),
  );
};

const events = eventSpecs.map((spec) => {
  const changes = spec.changes.map((item) => occurrenceFor(spec, item));
  const stableEventId = `event:apple:ios:4.0:${spec.alias}`;
  const citations = uniqueCitations([
    ...spec.identitySources.map((url) =>
      c(url, `${spec.label} identity and timing`),
    ),
    ...changes.flatMap((change) => change.citations),
  ]);
  return {
    target: {
      releaseVersionId: "version-ios-4-0",
      routeAlias: spec.alias,
    },
    identity: {
      releaseVersionId: "version-ios-4-0",
      platformId: "platform-ios",
      stableEventId,
      label: spec.label,
      routeAlias: spec.alias,
      channel: spec.channel,
      appearanceDate: spec.date,
      sequence: spec.sequence,
      isRevision: false,
      availabilityState: "available",
      closesReleaseCycle: false,
    },
    authorship: "originalSynthesis",
    summary: `${spec.label} is a sourced historical archive page with ${changes.length} structured records and an explicit account of the evidence limits that shape its coverage.`,
    article: eventArticle(spec, changes),
    citations,
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

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter((version) => version.platform === "iOS" && version.version === "4.0")
  .map((version) => ({
    platform: version.platform,
    majorVersion: version.majorVersion,
    version: version.version,
    releaseStatus: version.releaseStatus,
    publicReleaseDate: version.publicReleaseDate,
    milestones: version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
    ]),
  }));
const expectedSeedInventory = [
  {
    platform: "iOS",
    majorVersion: 4,
    version: "4.0",
    releaseStatus: "released",
    publicReleaseDate: "2010-06-21",
    milestones: [["Public", "2010-06-21", false, undefined]],
  },
];
if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(expectedSeedInventory))
) {
  throw new Error(
    "The exact local iOS 4.0 seed inventory changed; re-audit before regenerating.",
  );
}

const publicOwner = JSON.parse(
  readFileSync(join(here, "apple-ios-4.json"), "utf8"),
);
const publicEvents = (publicOwner.events || []).filter(
  (event) =>
    event.target?.releaseVersionId === "version-ios-4-0" &&
    event.target?.routeAlias === "public",
);
if (
  publicEvents.length !== 1 ||
  publicEvents[0].provenanceStatus !== "editoriallyVerified" ||
  publicEvents[0].editorialReview?.status !== "approved" ||
  publicEvents[0].isIndexable !== true
) {
  throw new Error(
    "The approved iOS 4.0 Public ownership boundary changed; stop before regenerating.",
  );
}

const expectedCounts = new Map([
  ["beta-1", 20],
  ["beta-2", 20],
  ["beta-3", 14],
  ["beta-4", 14],
  ["gm", 3],
]);
const expectedDates = new Map(
  eventSpecs.map((spec) => [spec.alias, spec.date]),
);
const expectedRoutes = new Set(
  [...expectedCounts.keys()].map((alias) => `version-ios-4-0/${alias}`),
);
const actualRoutes = events.map(
  (event) => `${event.target.releaseVersionId}/${event.target.routeAlias}`,
);
const changeCount = events.reduce(
  (total, event) => total + event.changes.length,
  0,
);
if (
  bundle.versions.length !== 0 ||
  bundle.builds.length !== 0 ||
  events.length !== expectedCounts.size ||
  changeCount !== 71 ||
  new Set(actualRoutes).size !== expectedRoutes.size ||
  actualRoutes.some((route) => !expectedRoutes.has(route)) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.identity.releaseVersionId !== event.target.releaseVersionId ||
      event.identity.routeAlias !== event.target.routeAlias ||
      event.identity.appearanceDate !==
        expectedDates.get(event.target.routeAlias) ||
      event.identity.platformId !== "platform-ios" ||
      event.identity.stableEventId !==
        `event:apple:ios:4.0:${event.target.routeAlias}` ||
      event.authorship !== "originalSynthesis" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.length !== expectedCounts.get(event.target.routeAlias),
  )
) {
  throw new Error("The expected iOS 4 prerelease bundle closure failed.");
}

const undocumented = events
  .flatMap((event) => event.changes)
  .filter((item) => item.documentedStatus === "undocumented")
  .map((item) => item.key)
  .sort();
const expectedUndocumented = [
  "ios-4-0-beta3-ipod-controls",
  "ios-4-0-beta3-orientation-lock",
  "ios-4-0-beta3-temporary-withdrawal",
  "ios-4-0-beta4-default-wallpapers",
  "ios-4-0-beta4-group-messaging-toggle",
  "ios-4-0-beta4-photo-roll-orientation",
  "ios-4-0-beta4-utilities-folder",
  "ios-4-0-gm-itunes-9-2-requirement",
].sort();
if (JSON.stringify(undocumented) !== JSON.stringify(expectedUndocumented)) {
  throw new Error("The undocumented-change allowlist drifted.");
}

const partial = events
  .flatMap((event) => event.changes)
  .filter((item) => item.documentedStatus === "partiallyDocumented")
  .map((item) => item.key)
  .sort();
if (
  JSON.stringify(partial) !==
  JSON.stringify(["ios-4-0-gm-bing-search", "ios-4-0-gm-ios-name"].sort())
) {
  throw new Error("The partially documented GM allowlist drifted.");
}

const localChangeDefinitions = new Map();
for (const occurrence of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(
    stableValue({
      title: occurrence.title,
      canonicalSummary: occurrence.canonicalSummary,
      category: occurrence.category,
    }),
  );
  const previous = localChangeDefinitions.get(occurrence.key);
  if (previous && previous !== definition) {
    throw new Error(
      `iOS 4 prerelease change definition drifted for ${occurrence.key}.`,
    );
  }
  localChangeDefinitions.set(occurrence.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 67) {
  throw new Error(
    `Expected 67 stable iOS 4 prerelease definitions; found ${uniqueLocalChangeKeys.length}.`,
  );
}

const histories = new Map();
for (const event of events) {
  for (const change of event.changes) {
    histories.set(change.key, [
      ...(histories.get(change.key) || []),
      `${event.identity.routeAlias}:${change.action}`,
    ]);
  }
}
const repeatedHistories = [...histories.entries()].filter(
  ([, history]) => history.length > 1,
);
const expectedTransitionHistories = new Map([
  ["ios-4-0-document-open-in", ["beta-2:knownIssue", "beta-3:fixed"]],
  ["ios-4-0-llvm-simulator", ["beta-3:knownIssue", "beta-4:fixed"]],
  ["ios-4-0-simulator-nsurl-launch", ["beta-3:knownIssue", "beta-4:fixed"]],
  ["ios-4-0-automation-template", ["beta-3:knownIssue", "beta-4:fixed"]],
]);
if (
  repeatedHistories.length !== expectedTransitionHistories.size ||
  repeatedHistories.some(
    ([key, history]) =>
      JSON.stringify(history) !==
      JSON.stringify(expectedTransitionHistories.get(key)),
  )
) {
  throw new Error("The reviewed iOS 4 transition inventory changed.");
}

const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
const otherChangeKeys = new Map();
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.versions || []),
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const item of owner.changes || []) {
      if (!otherChangeKeys.has(item.key)) otherChangeKeys.set(item.key, file);
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `iOS 4 prerelease change keys collide with existing content: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
}
for (const file of collisionFiles.filter(
  (file) => file !== join(here, "..", "apple-launch-content-2026.json"),
)) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const event of candidate.events || []) {
    const target =
      event.target?.releaseVersionId && event.target?.routeAlias
        ? `${event.target.releaseVersionId}/${event.target.routeAlias}`
        : undefined;
    if (target && expectedRoutes.has(target)) {
      throw new Error(`An existing research batch already owns ${target}.`);
    }
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
      continue;
    }
    collectCitationUrls(item);
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
    `Citation closure failed. Unique sources: ${sourceUrls.size}/${sources.length}; missing: ${missingSources.join(", ")}; unused: ${unusedSources
      .map((source) => source.url)
      .join(", ")}`,
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
const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");
const routeRows = eventSpecs
  .map(
    (spec) =>
      `| iOS | ${spec.label} | \`${spec.alias}\` | ${spec.date} | ${spec.changes.length} |`,
  )
  .join("\n");
const routeVerificationRows = eventSpecs
  .map(
    (spec) =>
      `| \`/apple/ios/4.0/${spec.alias}/\` | 200 | 4/4 | ${spec.changes.length}/${spec.changes.length} | yes | yes | no | index, follow |`,
  )
  .join("\n");

const copyrightAudit = {
  readerFacingFields: 329,
  maximumContiguousOverlapWords: 5,
  longestOverlapPhrase: "securely host and wirelessly distribute",
};

const validationRecord = {
  researchBatches: 73,
  globalChangeKeys: 4_266,
  focusedTests: 19,
  fullTests: 131,
  transcriptLocatorAssertions: 41,
  markerAlignmentAssertions: 29,
  repeatedTransitionHistories: 4,
  independentSourcesFetched: 19,
  independentRawExact: 7,
  independentNormalizedExact: 17,
  independentEvidenceReproduced: 19,
};

const dryPlanRecord = {
  status: "Applied and zero-residual verified on 2026-07-30",
  creates: 89,
  sourceCreates: 17,
  eventCreates: 5,
  changeCreates: 67,
  patches: 2,
  unchanged: 2_094,
  mutationPayloadBytes: 236_122,
  planSha: "c1a8b5a8aa13cfa065f4e81b770249332046c7ad1e73670ce5dcce109ae9bc8a",
  planArtifactSha:
    "1b23e7b8d0657b41fe7c87c286af40692fcc09ae0b51b1e2d0fbed5f8ef662ce",
  rollbackArtifactSha:
    "30aef00fb552199d41b65d05595064163eaf1b3f2bb080c5789335578668708a",
};

const publicationRecord = {
  transactionId: "eOgq1Ovu5XNUv1qNFVET79",
  receiptSha:
    "ef7ec4898c43624703ae9a76eedc81014b9459d467a74b5bb1c2930b925f7995",
  zeroPlanSha:
    "81a0bd31f6cfa604f7aaeeb4188ba887ab77031810483f682ad4b1f485546bd3",
  zeroPlanArtifactSha:
    "2cab193b6e9a23fd50e887de157c29e3d9ef36fbdb03613a2ce3734caf1a8bb3",
  zeroRollbackArtifactSha:
    "dc4d3f7e2b78e27508dde144ba47bbeafaaa83c36704bd8ad106a4a444e55289",
  zeroCreates: 0,
  zeroPatches: 0,
  zeroUnchanged: 2_185,
  zeroPayloadBytes: 16,
  coverage: {
    totalVersions: 410,
    fullVersions: 410,
    totalAppearances: 1_996,
    fullAppearances: 443,
    sourceLinkedAppearances: 256,
    timelineOnlyAppearances: 1_297,
    approvedStructuredAppearances: 594,
  },
};

const md = `# Apple iOS 4 prerelease archive batch

## Result

\`${outputName}\` is the editorially approved archive overlay for five
historically defensible iOS 4.0 prerelease routes absent from the local seed.

- ${events.length} identity-backed event creates and no release-version overlays
- ${changeCount} milestone occurrences across ${uniqueLocalChangeKeys.length}
  stable, collision-checked definitions
- ${sources.length} declared and used sources with ${citationCount} citation references
- zero builds, build-number claims, or Public-route changes
- every route is \`editoriallyVerified\`, approved at \`${reviewedAt}\`, and
  explicitly \`isIndexable: true\`

## Published route closure

| Platform | Milestone | New alias | Appearance date | Selected changes |
| --- | --- | --- | --- | ---: |
${routeRows}

The local seed contains only Public on 2010-06-21. Its existing route is
approved and indexable in \`apple-ios-4.json\`; this batch does not patch it.

## Evidence method

1. Beta 1 is backed by Apple’s launch-day announcement, the next-day Apple
   Developer notice, and a contemporaneous API inventory. Its 20 records are a
   representative first-document baseline rather than a predecessor diff.
2. Beta 2 uses a same-day copy of Apple’s known-issues section. Fourteen
   explicit NEW or FIXED entries are deltas; six unmarked current-state records
   are labeled \`cumulative\` so their first appearance is not overstated. One
   Interface Builder entry is presented as an internal source contradiction:
   the retained marker says FIXED while its sentence still calls the workflow
   unsupported.
3. Beta 3 uses a complete participant-posted copy of Apple’s May 3-dated
   document. Selection is restricted to seed-specific upgrade, removal,
   new-issue, fixed, and simulator statements. Independent reports add the
   temporary withdrawal and two user-visible controls.
4. Beta 4 is semantically compared with Beta 3. Ten newly resolved, newly
   stated, or changed developer entries survive; repeated cumulative lines do
   not. Four observed interface/settings records remain explicitly
   undocumented, including one single-source item at \`reported\` evidence.
5. GM has no recovered complete developer-note body. Three bounded records are
   supported by the naming announcement, independent GM reports, and the
   iTunes compatibility observation rather than synthetic release notes.

## Raw evidence audit

\`audit-ios4-prerelease.mjs\` verifies the exact ignored research downloads,
their byte counts and SHA-256 hashes, 18 normalized article/transcript hashes,
publication identity metadata, and a short probe for every selected fact
family.

| Evidence artifact | Raw bytes | Raw SHA-256 | Normalized text audit |
| --- | ---: | --- | --- |
| Apple Beta 1 Newsroom | 129,252 | \`2fd9f6fb5a58aca6140cd6081bf122ded5d66149a66630c2653c98685f6ba537\` | 6,575 bytes; \`fab107449b253b409e5f397e8320e57c8154ffa378f03a4bafa138a548096d85\` |
| Apple Beta 1 developer notice | 107,336 | \`b680a1148ed48ee3f280b0775b5f1350e9b14b25a3ae7a6149a480ad42666a49\` | 474 bytes; \`a54477bce23d5440dab43ed35e41a90003e0b09f88e3d7c08f98d826d73f01be\` |
| Beta 1 API report | 113,135 | \`3d55301761116226c85dfa593d889b6788f22bc6e772beb6f6be8bdced148d86\` | 1,355 bytes; \`02a881a212874ac2578a284e0a264f6903a29d0f97d332c29d316028d6db73e2\` |
| Beta 2 identity report | 112,791 | \`7d9dbedec9b125f255f55c2de501a74b193a3a2c39d2ca96ed1d3d097ae53d17\` | 1,178 bytes; \`bcd1255d37694f3ecbe5583fc7edd7788327c9bb889804a4f1bd0587f67e930d\` |
| Beta 2 known-issues transcript | 301,490 | \`f76396ba9d11ac657beb0f84a5cb8e3839f88b9ae584372c3f3203a41c976aa7\` | 4,417 bytes; \`55faac079578a5ef7b7ae22096b40b8993d90e2fdd2ad02485b7845550309e2c\` |
| Beta 3 developer-note transcript | 465,638 | \`2aec9b9d9d1d9e12d2027fca470ade03e9c000bb18b21c08217f79498cf21fd3\` | 10,227 bytes; \`00fb6ed2c007399078c93543e2379231693ad236c3700b893fddce1395bdf6ec\` |
| Beta 3 identity report | 222,652 | \`c5d130a93419f42e030638de65b3f9100226c7a9929e7f68dc071bd00d70296e\` | JSON-LD identity audit |
| Beta 3 withdrawal report | 199,358 | \`a5e2ef55e9c1bd2d3313577c0e85b1fe7da051a778e2bf9b203f6ffa664150ed\` | 2,762 bytes; \`57cc79558a1eb9c769ead009d9c8f3913061c73643e85469038a4216e9d1d2fe\` |
| Beta 3 feature report, MacRumors | 113,628 | \`935e908d9929ebabeb51ddf0a13b7266f321f3d9cee1a8412e204d120ac2bd27\` | 1,315 bytes; \`aae3f66e4dc4804b9a0d4912eba989d16f065a93cbb2407da51b2c63063f9ad2\` |
| Beta 3 feature report, Engadget | 60,004 | \`c9927c3692aecc4c6e5b756dd784d672b8cc22538aec1d26747924797e249316\` | 1,193 bytes; \`9f5bf758262d34f7bd99ccfbd1d4d4b2b391ef4d20c6f97fd8ba76e0f9b29338\` |
| Beta 4 identity report | 113,309 | \`89186c716a3514db91c4419ec680378ae8d6850036813bc650103b889e4f74c7\` | 1,351 bytes; \`39c7095c5f70280010cd6bcd66ead03fecda3a53cc8d866d52d7ae6875731e3b\` |
| Beta 4 known-issues transcript | 297,226 | \`e40b7642b3c30617901a487f67b9cfd63c8a381fff04ba92cfd17035d40596f0\` | 9,189 bytes; \`3e24ad90ed6e1c7285f6467108b350904075465c6de8e40c721e5eb9e9356cbb\` |
| Beta 4 feature report, PCWorld | 250,790 | \`a5772819538499251061c187d6268374577740e1a44429053f150e7d2378a774\` | 1,894 bytes; \`6fb84cbc26fb208dff606587279f107568669abb84fda51abf4adebe3005d8c0\` |
| Beta 4 feature report, Gizmodo | 214,805 | \`f74630ef6c0984bc4cfbf762b28581669cacfb73476ad3643306ca212139687f\` | 2,098 bytes; \`91d4ce01112994b9e1020a4112c5de6f15296c6531799c21d918064e29d55642\` |
| GM identity report | 111,894 | \`3ddffd6622354be3b8493e2b166f340fe01fb1e378d66f2ad0137c2c2756620b\` | 565 bytes; \`92cbb2c728b81e648f599be19b8424af1b55f3adf195a399787a00022cfca056\` |
| GM installation report | 58,314 | \`d752489c9012a5bcad5169b7004a8b7f5db33e09f446cc6d36a61a27bde037a3\` | 958 bytes; \`efb7c6eeaeacb77d9a0f5db84bec2b96681f9b6719c792850281059cd5a66de0\` |
| GM naming report, MacRumors | 112,220 | \`6feec295ff5002ff92602ae3815fa409b378ad974dc207030a14d94884a4b84c\` | 900 bytes; \`a94b8fe6dc9ba2d24950323e07d46c3135d075821a2ef983f2434dbf108523a5\` |
| GM naming report, Engadget | 62,436 | \`eb814da4f87b1bba5642ff965b471e63519fde678fd39cb6affff654413ef610\` | 1,742 bytes; \`cd63ee38ca53b0619f1fb146292d1a57b27cd1b548e221b0c2ffc1847048726d\` |
| Apple public-boundary announcement | 131,796 | \`d11f98321de46f691c329d8bb9b8abe90b28be49b8011e553e2189c8dc14832d\` | 8,779 bytes; \`ddf9b0b76318c28b3154b0dcf20ea406eccafd9df8a5f27cf9ed84b131fc701c\` |

The 19 raw files total 3,178,074 bytes. Publisher text remains only in the
ignored evidence directory and is not committed in the manifest.

An independent live re-fetch reached all
${validationRecord.independentSourcesFetched} sources. The complete response
bytes remained identical for ${validationRecord.independentRawExact}; the
selected normalized body remained identical for
${validationRecord.independentNormalizedExact}. The two dynamically rendered
exceptions reproduced their exact publication identity or retained fact
probes, so all ${validationRecord.independentEvidenceReproduced} evidence
boundaries were independently reproduced.

## Exact gaps and exclusions

- The local seed has no prerelease identities. All five candidates therefore
  carry complete deterministic event identities.
- No defensible Beta 5 milestone was found in the audited chronology. No route
  is created for one.
- Beta 3’s temporary removal and return do not establish a separately named
  revision; one Beta 3 route records the distribution incident.
- Beta 2 and Beta 4 are host-preserved known-issues sections, not complete
  first-party-hosted documents.
- No complete GM note body survives in the audited public material.
- No build number is inferred from screenshots, download labels, filenames, or
  publisher prose.
- Tethering, speed, and hardware-dependent claims are excluded from Beta 4.
- Public remains owned by the approved iOS 4 batch.

## Copyright and attribution controls

- Titles, canonical summaries, occurrence summaries, and article prose are
  original synthesis.
- Every factual record carries source citations and a short locator.
- Apple is credited as author of the two mirrored developer-note bodies, and
  each host is named so custody of the surviving copy is explicit.
- No transcript, screenshot, article body, or long quotation is committed.
- The independent phrase-similarity scan checked
  ${copyrightAudit.readerFacingFields} reader-facing fields against all 19
  retained raw artifacts. Its longest contiguous overlap was
  ${copyrightAudit.maximumContiguousOverlapWords} words:
  “${copyrightAudit.longestOverlapPhrase},” a short factual capability phrase.

## Source ledger

All declared sources were accessed on ${accessedAt}.

${sourceLedger}

## Closure guards

- Exact comparison against the local iOS 4.0 seed and its sole Public milestone
- Approved/indexable Public ownership assertion against \`apple-ios-4.json\`
- Exact five-route identity, date, and count allowlist
- Explicit no-Beta-5, no-build, no-version-overlay, and no-Public-patch boundary
- Collision scan across every other batch plus
  \`apple-launch-content-2026.json\`
- ${changeCount} occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- ${validationRecord.repeatedTransitionHistories} known-to-fixed histories
  retain one canonical definition across milestones
- ${validationRecord.transcriptLocatorAssertions} transcript locators and
  ${validationRecord.markerAlignmentAssertions} explicit NEW/FIXED markers
  align with their selected records
- Eight undocumented and two partially documented keys on exact allowlists
- Complete unique source declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Editorial approval and validation record

- Raw-evidence byte, hash, normalized-text, publication-identity, fact-family,
  and copyright audits passed
- independent live re-fetch: all
  ${validationRecord.independentSourcesFetched} sources available and all
  ${validationRecord.independentEvidenceReproduced} selected evidence
  boundaries reproduced
- Repository validation passed across ${validationRecord.researchBatches}
  batches and
  ${validationRecord.globalChangeKeys.toLocaleString("en-US")} globally
  consistent change keys
- ${validationRecord.focusedTests} focused ingestion/manifest tests and
  ${validationRecord.fullTests} full repository tests passed
- ESLint, Prettier, JavaScript syntax checks, and \`git diff --check\` passed

## Production dry plan

- Status: ${dryPlanRecord.status}
- ${dryPlanRecord.creates} creates:
  ${dryPlanRecord.sourceCreates} sources, ${dryPlanRecord.eventCreates} events,
  and ${dryPlanRecord.changeCreates} stable change documents
- ${dryPlanRecord.patches} revision-guarded source-metadata patches: the reused
  Apple Beta 1 announcement and Public-boundary announcement; no release,
  event, build, or change document is patched
- ${dryPlanRecord.unchanged.toLocaleString("en-US")} production documents
  remain unchanged
- Mutation payload:
  ${dryPlanRecord.mutationPayloadBytes.toLocaleString("en-US")} bytes
- Plan SHA: \`${dryPlanRecord.planSha}\`
- Plan artifact SHA-256: \`${dryPlanRecord.planArtifactSha}\`
- Rollback artifact SHA-256: \`${dryPlanRecord.rollbackArtifactSha}\`

Three consecutive production dry runs reproduced the same plan SHA, counts,
payload size, plan artifact, and rollback artifact.

## Publication receipt

- Sanity transaction: \`${publicationRecord.transactionId}\`
- applied plan SHA: \`${dryPlanRecord.planSha}\`
- receipt SHA-256: \`${publicationRecord.receiptSha}\`
- immediate post-publication zero plan:
  \`${publicationRecord.zeroPlanSha}\`;
  ${publicationRecord.zeroCreates} creates,
  ${publicationRecord.zeroPatches} patches,
  ${publicationRecord.zeroUnchanged.toLocaleString("en-US")} unchanged
  documents, and a ${publicationRecord.zeroPayloadBytes}-byte mutation payload
- zero-plan artifact SHA-256:
  \`${publicationRecord.zeroPlanArtifactSha}\`
- zero-plan rollback artifact SHA-256:
  \`${publicationRecord.zeroRollbackArtifactSha}\`

## Production coverage after publication

- ${publicationRecord.coverage.fullVersions} of
  ${publicationRecord.coverage.totalVersions} release versions have full
  version-level coverage
- ${publicationRecord.coverage.totalAppearances.toLocaleString("en-US")}
  appearances: ${publicationRecord.coverage.fullAppearances} full articles,
  ${publicationRecord.coverage.sourceLinkedAppearances} source-linked records,
  and
  ${publicationRecord.coverage.timelineOnlyAppearances.toLocaleString("en-US")}
  timeline-only records
- ${publicationRecord.coverage.approvedStructuredAppearances} appearances have
  approved structured changes

## Settled canonical route verification

Every published route was fetched independently from the running local site.
Each returned all four archival article sections, every expected structured
change title, References, its first cited source, and an \`index, follow\`
directive. No route returned placeholder copy or a \`noindex\` directive.

| Canonical route | HTTP | Article sections | Expected changes | References | First source | Placeholder | Robots |
| --- | ---: | ---: | ---: | --- | --- | --- | --- |
${routeVerificationRows}

No deployment was performed; domain and deployment work remains scheduled
separately.

## Reproduction

\`\`\`sh
node scripts/research-batches/audit-ios4-prerelease.mjs tmp/ios4-evidence
node scripts/research-batches/build-apple-ios-4-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-ios-4-prerelease.mjs scripts/research-batches/audit-ios4-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-ios-4-prerelease.mjs scripts/research-batches/audit-ios4-prerelease.mjs scripts/research-batches/apple-ios-4-prerelease.json scripts/research-batches/apple-ios-4-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-ios-4-prerelease.json
\`\`\`
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);

console.log(
  [
    `Wrote ${outputName}`,
    `Wrote ${ledgerName}`,
    `${events.length} events`,
    `${changeCount} changes`,
    `${sources.length} sources`,
    `${citationCount} citation references`,
    `JSON SHA-256 ${jsonSha}`,
  ].join("\n"),
);
