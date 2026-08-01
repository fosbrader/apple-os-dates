import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-os-27-prerelease.json";
const ledgerName = "apple-os-27-prerelease.md";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T07:28:01Z";

const U = {
  developerReleases: "https://developer.apple.com/news/releases/",
  releasesBeta2Archive:
    "https://web.archive.org/web/20260622193409/https://developer.apple.com/news/releases/",
  releasesWatchBeta2Archive:
    "https://web.archive.org/web/20260624173559/https://developer.apple.com/news/releases/",
  releasesBeta3Archive:
    "https://web.archive.org/web/20260707070803/https://developer.apple.com/news/releases/",
  iosBeta1: "https://developer.apple.com/news/releases/?id=06082026b",
  ipadosBeta1: "https://developer.apple.com/news/releases/?id=06082026c",
  macosBeta1: "https://developer.apple.com/news/releases/?id=06082026d",
  tvosBeta1: "https://developer.apple.com/news/releases/?id=06082026e",
  visionosBeta1: "https://developer.apple.com/news/releases/?id=06082026f",
  watchosBeta1: "https://developer.apple.com/news/releases/?id=06082026g",
  ipadosBeta3v2: "https://developer.apple.com/news/releases/?id=07132026a",
  macosBeta3v2: "https://developer.apple.com/news/releases/?id=07132026b",
  installBeta: "https://developer.apple.com/support/install-beta",
  announcement:
    "https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more/",
  iosNotes:
    "https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes",
  iosNotesBeta1:
    "https://web.archive.org/web/20260608214924/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes",
  iosNotesBeta1Transport:
    "https://web.archive.org/web/20260608214924id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json",
  iosNotesBeta2:
    "https://web.archive.org/web/20260627125300/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes",
  iosNotesBeta2Transport:
    "https://web.archive.org/web/20260627125300id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json",
  iosNotesBeta3:
    "https://web.archive.org/web/20260707041111/https://developer.apple.com/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes",
  iosNotesBeta3Transport:
    "https://web.archive.org/web/20260707041111id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json",
  macosNotes:
    "https://developer.apple.com/documentation/macos-release-notes/macos-27-release-notes",
  tvosNotes:
    "https://developer.apple.com/documentation/tvos-release-notes/tvos-27-release-notes",
  visionosNotes:
    "https://developer.apple.com/documentation/visionos-release-notes/visionos-27-release-notes",
  watchosNotes:
    "https://developer.apple.com/documentation/watchos-release-notes/watchos-27-release-notes",
  macrumorsBeta2: "https://www.macrumors.com/guide/ios-27-features/",
  nineToFiveBeta2:
    "https://9to5mac.com/2026/06/22/heres-whats-new-with-ios-27-beta-2/",
  macrumorsBeta3:
    "https://www.macrumors.com/2026/07/06/ios-27-beta-3-features/",
  nineToFiveBeta3:
    "https://9to5mac.com/2026/07/06/heres-whats-new-with-ios-27-beta-3/",
  nineToFiveMacWallpaper:
    "https://9to5mac.com/2026/07/06/macos-27-golden-gate-adds-these-new-wallpapers-and-screen-savers-to-your-mac/",
  pixelsMacWallpaper:
    "https://512pixels.net/2026/07/golden-gate-bridge-wallpaper/",
  nineToFiveWatchBeta3:
    "https://9to5mac.com/2026/07/06/watchos-27-beta-3-includes-upgraded-siri-ai-experience-and-dedicated-siri-app/",
  t3WatchBeta3:
    "https://www.t3.com/tech/smartwatches/watchos-27-beta-3-siri-ai-features",
  reissueCoverage:
    "https://appleinsider.com/articles/26/07/13/ipados-27-macos-27-beta-3-get-a-version-2-update-as-public-betas-drop",
  publicBeta:
    "https://www.macrumors.com/how-to/install-ios-27-public-beta-iphone-ipad/",
};

const sources = [
  {
    url: U.releasesBeta2Archive,
    title: "Apple Developer Releases — June 22, 2026 capture",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2026-06-22T19:34:09.000Z",
    topics: ["OS 27", "Beta 2", "build numbers", "release dates"],
  },
  {
    url: U.releasesWatchBeta2Archive,
    title: "Apple Developer Releases — June 24, 2026 capture",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2026-06-24T17:35:59.000Z",
    topics: ["watchOS", "27.0", "Beta 2", "build number", "release date"],
  },
  {
    url: U.releasesBeta3Archive,
    title: "Apple Developer Releases — July 7, 2026 capture",
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt: "2026-07-07T07:08:03.000Z",
    topics: ["OS 27", "Beta 3", "build numbers", "release dates"],
  },
  ...[
    [U.iosBeta1, "iOS 27.0 beta (24A5355q)", "iOS"],
    [U.ipadosBeta1, "iPadOS 27.0 beta (24A5355q)", "iPadOS"],
    [U.macosBeta1, "macOS 27.0 beta (26A5353q)", "macOS"],
    [U.tvosBeta1, "tvOS 27.0 beta (24J5289o)", "tvOS"],
    [U.visionosBeta1, "visionOS 27.0 beta (24M5291p)", "visionOS"],
    [U.watchosBeta1, "watchOS 27.0 beta (24R5289n)", "watchOS"],
  ].map(([url, title, platform]) => ({
    url,
    title,
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2026-06-08T00:00:00.000Z",
    topics: [platform, "27.0", "Beta 1", "build number"],
  })),
  {
    url: U.ipadosBeta3v2,
    title: "iPadOS 27.0 beta 3 v.2 (24A5380l)",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2026-07-13T00:00:00.000Z",
    topics: ["iPadOS", "27.0", "Beta 3 v2", "build number"],
  },
  {
    url: U.macosBeta3v2,
    title: "macOS 27.0 beta 3 v.2 (26A5378n)",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2026-07-13T00:00:00.000Z",
    topics: ["macOS", "27.0", "Beta 3 v2", "build number"],
  },
  {
    url: U.installBeta,
    title: "Installing and using Apple beta software",
    publisher: "Apple Developer",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["beta software", "backup", "release notes", "Feedback Assistant"],
  },
  {
    url: U.announcement,
    title:
      "Apple unveils next generation of Apple Intelligence, Siri AI, and more",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2026-06-08T00:00:00.000Z",
    topics: ["WWDC26", "OS 27", "developer testing", "availability"],
  },
  ...[
    [U.macosNotes, "macOS 27 Golden Gate Release Notes", "macOS"],
    [U.tvosNotes, "tvOS 27 Release Notes", "tvOS"],
    [U.visionosNotes, "visionOS 27 Release Notes", "visionOS"],
    [U.watchosNotes, "watchOS 27 Release Notes", "watchOS"],
  ].map(([url, title, ...platforms]) => ({
    url,
    title: `${title} (living beta document)`,
    publisher: "Apple Developer Documentation",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [...platforms, "27.0", "release notes", "living document"],
  })),
  ...[
    [
      U.iosNotesBeta1,
      U.iosNotesBeta1Transport,
      "iOS & iPadOS 27 Beta Release Notes",
      "2026-06-08T21:49:24.000Z",
      "Beta 1",
    ],
    [
      U.iosNotesBeta2,
      U.iosNotesBeta2Transport,
      "iOS & iPadOS 27 Beta 2 Release Notes",
      "2026-06-27T12:53:00.000Z",
      "Beta 2",
    ],
    [
      U.iosNotesBeta3,
      U.iosNotesBeta3Transport,
      "iOS & iPadOS 27 Beta 3 Release Notes",
      "2026-07-07T04:11:11.000Z",
      "Beta 3",
    ],
  ].map(([url, transportUrl, title, publishedAt, beta]) => ({
    url,
    transportUrl,
    title: `${title} (preserved snapshot)`,
    publisher: "Apple Developer via Internet Archive",
    sourceClass: "archive",
    author: "Apple",
    publishedAt,
    topics: ["iOS", "iPadOS", "27.0", beta, "historical release notes"],
  })),
  {
    url: U.macrumorsBeta2,
    title: "Everything New in iOS 27 Beta 2",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2026-06-22T00:00:00.000Z",
    topics: ["iOS", "iPadOS", "27.0", "Beta 2", "observed changes"],
  },
  {
    url: U.nineToFiveBeta2,
    title: "Here's what's new with iOS 27 beta 2",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Zac Hall",
    publishedAt: "2026-06-22T00:00:00.000Z",
    topics: ["iOS", "iPadOS", "27.0", "Beta 2", "observed changes"],
  },
  {
    url: U.macrumorsBeta3,
    title: "Everything New in iOS 27 Beta 3",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Juli Clover",
    publishedAt: "2026-07-06T00:00:00.000Z",
    topics: ["iOS", "27.0", "Beta 3", "observed changes"],
  },
  {
    url: U.nineToFiveBeta3,
    title: "Here's what's new with iOS 27 beta 3",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Zac Hall",
    publishedAt: "2026-07-06T00:00:00.000Z",
    topics: ["iOS", "27.0", "Beta 3", "observed changes"],
  },
  {
    url: U.nineToFiveMacWallpaper,
    title:
      "macOS 27 Golden Gate adds these new wallpapers and screen savers to your Mac",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Zac Hall",
    publishedAt: "2026-07-06T00:00:00.000Z",
    topics: ["macOS", "27.0", "Beta 3", "wallpaper", "screen saver"],
  },
  {
    url: U.pixelsMacWallpaper,
    title: "Golden Gate Bridge Wallpaper Added to macOS 27 Developer Beta 3",
    publisher: "512 Pixels",
    sourceClass: "journalism",
    author: "Stephen Hackett",
    publishedAt: "2026-07-06T00:00:00.000Z",
    topics: ["macOS", "27.0", "Beta 3", "wallpaper"],
  },
  {
    url: U.nineToFiveWatchBeta3,
    title:
      "watchOS 27 beta 3 includes upgraded Siri AI experience and dedicated Siri app",
    publisher: "9to5Mac",
    sourceClass: "journalism",
    author: "Zac Hall",
    publishedAt: "2026-07-06T00:00:00.000Z",
    topics: ["watchOS", "27.0", "Beta 3", "Siri"],
  },
  {
    url: U.t3WatchBeta3,
    title:
      "Apple just made Siri on the Apple Watch much more useful — and finally fixed one of its oldest frustrations",
    publisher: "T3",
    sourceClass: "journalism",
    author: "Matt Kollat",
    topics: ["watchOS", "27.0", "Beta 3", "Siri"],
  },
  {
    url: U.reissueCoverage,
    title:
      "iPadOS 27 and macOS 27 beta 3 get a version 2 update as public betas drop",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "Wesley Hilliard",
    publishedAt: "2026-07-13T00:00:00.000Z",
    topics: ["iPadOS", "macOS", "27.0", "Beta 3 v2", "public beta"],
  },
  {
    url: U.publicBeta,
    title: "How to Install iOS 27 Public Beta on Your iPhone",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Tim Hardwick",
    publishedAt: "2026-07-13T00:00:00.000Z",
    topics: ["iOS", "iPadOS", "27.0", "Public Beta 1"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () => ({ status: "approved", reviewedAt });

function change({
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary = canonicalSummary,
  citations,
  documentedStatus = "documented",
  evidenceState = "confirmed",
  verificationMethod,
}) {
  return {
    key,
    title,
    canonicalSummary,
    category,
    action,
    inheritance: "delta",
    summary,
    documentedStatus,
    evidenceState,
    ...(verificationMethod ? { verificationMethod } : {}),
    citations,
  };
}

const observedCorroborated = ({
  key,
  title,
  canonicalSummary,
  category,
  action = "changed",
  citations,
  summary = canonicalSummary,
}) =>
  change({
    key,
    title,
    canonicalSummary,
    category,
    action,
    summary,
    citations,
    documentedStatus: "undocumented",
    evidenceState: "corroborated",
    verificationMethod:
      "Matched two independent contemporaneous publications describing the same milestone-specific behavior; Apple’s living developer notes do not enumerate this interface delta.",
  });

const archivedAppleChange = ({ beta, locator, verificationMethod, ...input }) =>
  change({
    ...input,
    citations: [
      c(
        beta === "beta-1"
          ? U.iosNotesBeta1
          : beta === "beta-2"
            ? U.iosNotesBeta2
            : U.iosNotesBeta3,
        locator,
      ),
    ],
    verificationMethod:
      verificationMethod ||
      (beta === "beta-1"
        ? "Selected as a representative initial capability or compatibility boundary from Apple’s first preserved Beta 1 DocC state; the baseline is intentionally not exhaustive."
        : `Matched the component, status heading, and retained issue ID in Apple’s preserved ${beta.replace("-", " ")} DocC state against the immediately preceding captured state.`),
  });

const platforms = [
  {
    name: "iOS",
    slug: "ios",
    platformId: "platform-ios",
    versionId: "version-ios-27-0",
    notes: U.iosNotes,
    beta1Source: U.iosBeta1,
    events: [
      ["beta-1", "Beta 1", "2026-06-08", "24A5355q"],
      ["beta-2", "Beta 2", "2026-06-22", "24A5370h"],
      ["beta-3", "Beta 3", "2026-07-06", "24A5380h"],
      ["public-beta-1", "Public Beta 1", "2026-07-13", "24A5380h"],
    ],
  },
  {
    name: "iPadOS",
    slug: "ipados",
    platformId: "platform-ipados",
    versionId: "version-ipados-27-0",
    notes: U.iosNotes,
    beta1Source: U.ipadosBeta1,
    events: [
      ["beta-1", "Beta 1", "2026-06-08", "24A5355q"],
      ["beta-2", "Beta 2", "2026-06-22", "24A5370h"],
      ["beta-3", "Beta 3", "2026-07-06", "24A5380h"],
      ["beta-3-v2", "Beta 3 v2", "2026-07-13", "24A5380l"],
      ["public-beta-1", "Public Beta 1", "2026-07-13", "24A5380l"],
    ],
  },
  {
    name: "macOS",
    slug: "macos",
    platformId: "platform-macos",
    versionId: "version-macos-27-0",
    notes: U.macosNotes,
    beta1Source: U.macosBeta1,
    events: [
      ["beta-1", "Beta 1", "2026-06-08", "26A5353q"],
      ["beta-2", "Beta 2", "2026-06-22", "26A5368g"],
      ["beta-3", "Beta 3", "2026-07-06", "26A5378j"],
      ["beta-3-v2", "Beta 3 v2", "2026-07-13", "26A5378n"],
    ],
  },
  {
    name: "tvOS",
    slug: "tvos",
    platformId: "platform-tvos",
    versionId: "version-tvos-27-0",
    notes: U.tvosNotes,
    beta1Source: U.tvosBeta1,
    events: [
      ["beta-1", "Beta 1", "2026-06-08", "24J5289o"],
      ["beta-2", "Beta 2", "2026-06-22", "24J5305f"],
      ["beta-3", "Beta 3", "2026-07-06", "24J5315i"],
    ],
  },
  {
    name: "visionOS",
    slug: "visionos",
    platformId: "platform-visionos",
    versionId: "version-visionos-27-0",
    notes: U.visionosNotes,
    beta1Source: U.visionosBeta1,
    events: [
      ["beta-1", "Beta 1", "2026-06-08", "24M5291p"],
      ["beta-2", "Beta 2", "2026-06-22", "24M5306i"],
      ["beta-3", "Beta 3", "2026-07-06", "24M5316k"],
    ],
  },
  {
    name: "watchOS",
    slug: "watchos",
    platformId: "platform-watchos",
    versionId: "version-watchos-27-0",
    notes: U.watchosNotes,
    beta1Source: U.watchosBeta1,
    events: [
      ["beta-1", "Beta 1", "2026-06-08", "24R5289n"],
      ["beta-2", "Beta 2", "2026-06-23", "24R5305g"],
      ["beta-3", "Beta 3", "2026-07-06", "24R5315i"],
    ],
  },
].map((platform) => ({
  ...platform,
  events: platform.events.map(([alias, label, date, build]) => ({
    alias,
    label,
    date,
    build,
  })),
}));

const platformBySlug = new Map(
  platforms.map((platform) => [platform.slug, platform]),
);

function sourceForEvent(platform, event) {
  if (event.alias === "beta-1") return platform.beta1Source;
  if (event.alias === "beta-2") {
    return platform.slug === "watchos"
      ? U.releasesWatchBeta2Archive
      : U.releasesBeta2Archive;
  }
  if (event.alias === "beta-3") return U.releasesBeta3Archive;
  if (event.alias === "beta-3-v2") {
    return platform.slug === "ipados" ? U.ipadosBeta3v2 : U.macosBeta3v2;
  }
  if (event.alias === "public-beta-1") return U.publicBeta;
  throw new Error(
    `No durable release source for ${platform.slug}/${event.alias}.`,
  );
}

const extras = new Map();
const addExtras = (slug, alias, values) =>
  extras.set(`${slug}/${alias}`, values);
const appendExtras = (slug, alias, values) => {
  const key = `${slug}/${alias}`;
  extras.set(key, [...(extras.get(key) || []), ...values]);
};

addExtras("ios", "beta-2", [
  change({
    key: "ios-27-beta2-airpods-max-firmware-beta-updates",
    title: "AirPods Max 2 beta firmware updates",
    canonicalSummary:
      "iOS 27 Beta 2 restored support for installing AirPods Max 2 beta firmware after Beta 1 could not perform the update.",
    category: "compatibility",
    action: "fixed",
    citations: [
      c(
        U.iosNotesBeta2,
        "AirPods Max 2 — Known Issues; Beta 1 limitation and Beta 2 support; 178280323",
      ),
    ],
    verificationMethod:
      "Matched issue 178280323 in Apple’s preserved Beta 2 state; the note explicitly distinguishes unsupported Beta 1 firmware updates from supported Beta 2 updates.",
  }),
  observedCorroborated({
    key: "ios-27-beta2-write-with-siri-keyboard-entry",
    title: "Write with Siri keyboard entry",
    canonicalSummary:
      "A Write with Siri entry appeared above the software keyboard, making the tool reachable without first selecting text.",
    category: "enhancement",
    citations: [
      c(U.macrumorsBeta2, "Write with Siri"),
      c(U.nineToFiveBeta2, "iOS 27 beta 2 — What’s new"),
    ],
  }),
  observedCorroborated({
    key: "ios-27-beta2-home-apple-tv-updates",
    title: "Remote Apple TV updates in Home",
    canonicalSummary:
      "The Home app added a control for remotely starting software updates on a supported Apple TV.",
    category: "feature",
    action: "introduced",
    citations: [
      c(U.macrumorsBeta2, "Apple TV"),
      c(U.nineToFiveBeta2, "iOS 27 beta 2 — Home app"),
    ],
  }),
  observedCorroborated({
    key: "ios-27-beta2-rcs-inline-replies-reactions",
    title: "RCS inline replies and media reactions",
    canonicalSummary:
      "Messages added inline replies for RCS conversations and displayed reactions on shared images and video more directly.",
    category: "enhancement",
    citations: [
      c(U.macrumorsBeta2, "RCS"),
      c(U.nineToFiveBeta2, "iOS 27 beta 2 — RCS"),
    ],
  }),
  change({
    key: "ios-27-beta2-homekit-accessory-responsiveness",
    title: "Home accessory responsiveness after OS 27 installation",
    canonicalSummary:
      "One publication reported that Beta 2 corrected Home accessories that became unresponsive after installing the initial iOS 27 and tvOS 27 betas.",
    category: "bugFix",
    action: "fixed",
    citations: [c(U.macrumorsBeta2, "HomeKit Accessories")],
    documentedStatus: "undocumented",
    evidenceState: "reported",
    verificationMethod:
      "Retained as a single-source contemporaneous report; Apple’s living developer notes do not enumerate this consumer Home behavior.",
  }),
]);

addExtras("ipados", "beta-2", [
  observedCorroborated({
    key: "ipados-27-beta2-write-with-siri-keyboard-entry",
    title: "Write with Siri keyboard entry",
    canonicalSummary:
      "A Write with Siri entry appeared on the iPad software keyboard, making the tool reachable without first selecting text.",
    category: "enhancement",
    citations: [
      c(U.macrumorsBeta2, "Write with Siri; related iPadOS coverage"),
      c(U.nineToFiveBeta2, "iOS 27 beta 2 — iPhone and iPad software keyboard"),
    ],
  }),
]);

addExtras("macos", "beta-2", [
  change({
    key: "macos-27-beta2-airpods-max-firmware-beta-updates",
    title: "AirPods Max 2 beta firmware updates",
    canonicalSummary:
      "macOS 27 Beta 2 restored support for installing AirPods Max 2 beta firmware after Beta 1 could not perform the update.",
    category: "compatibility",
    action: "fixed",
    citations: [
      c(U.macosNotes, "AirPods Max 2 — Beta 1 limitation and Beta 2 support"),
    ],
    verificationMethod:
      "Used the living Apple developer note only because it explicitly names both Beta 1 and Beta 2.",
  }),
  change({
    key: "macos-27-beta2-usdkit-compressed-mesh-incompatibility",
    title: "USDKit compressed-mesh beta incompatibility",
    canonicalSummary:
      "USDKit meshes compressed by Beta 1 and Beta 2 tools were not mutually decodable across the two beta generations.",
    category: "compatibility",
    action: "changed",
    citations: [
      c(U.macosNotes, "USDKit — Beta 1 and Beta 2 compressed meshes"),
    ],
    verificationMethod:
      "Used the exact cross-beta compatibility warning in Apple’s living macOS 27 developer notes.",
  }),
]);

addExtras("tvos", "beta-2", [
  change({
    key: "tvos-27-beta2-homekit-accessory-responsiveness",
    title: "Home accessory responsiveness after OS 27 installation",
    canonicalSummary:
      "One publication reported that Beta 2 corrected Home accessories that became unresponsive after installing the initial iOS 27 and tvOS 27 betas.",
    category: "bugFix",
    action: "fixed",
    citations: [c(U.macrumorsBeta2, "HomeKit Accessories")],
    documentedStatus: "undocumented",
    evidenceState: "reported",
    verificationMethod:
      "Retained as a single-source contemporaneous report explicitly naming tvOS 27; Apple’s living tvOS notes do not enumerate the consumer Home behavior.",
  }),
]);

addExtras("watchos", "beta-2", [
  change({
    key: "watchos-27-beta2-verizon-calling-text-to-911-regression",
    title: "Verizon calling and Text-to-911 regression",
    canonicalSummary:
      "Upgrading to or clean-installing watchOS 27 Beta 2 could break incoming and outgoing Verizon calls and Text-to-911.",
    category: "regression",
    action: "regression",
    citations: [
      c(
        U.watchosNotes,
        "Cellular — Beta 2 Verizon calling and Text-to-911 issue",
      ),
    ],
    verificationMethod:
      "Apple’s later living note explicitly identifies watchOS 27 Beta 2 as the affected build; the later resolution is not projected backward.",
  }),
  change({
    key: "watchos-27-beta2-foundation-models-import-regression",
    title: "Foundation Models import regression",
    canonicalSummary:
      "The Foundation Models framework could not be imported when building a watchOS target with Xcode 27 Beta 2.",
    category: "regression",
    action: "regression",
    citations: [
      c(U.watchosNotes, "Foundation Models — Xcode 27 Beta 2 import failure"),
    ],
    verificationMethod:
      "Apple’s later living note explicitly identifies Xcode 27 Beta 2 as the affected toolchain; the later resolution is not assigned to this event.",
  }),
]);

addExtras("ios", "beta-3", [
  observedCorroborated({
    key: "ios-27-beta3-siri-voice-pace-expressivity",
    title: "Siri voice pace and expressivity controls",
    canonicalSummary:
      "Previously inactive Siri voice pace and expressivity controls became usable on the supported iPhone models reported for Beta 3.",
    category: "feature",
    action: "introduced",
    citations: [
      c(U.macrumorsBeta3, "Siri Voice"),
      c(U.nineToFiveBeta3, "iOS 27 beta 3 — What’s new"),
    ],
  }),
  observedCorroborated({
    key: "ios-27-beta3-reminders-icon",
    title: "Updated Reminders icon",
    canonicalSummary:
      "Reminders received a revised icon using hollow, colored list bullets.",
    category: "enhancement",
    citations: [
      c(U.macrumorsBeta3, "Reminders"),
      c(U.nineToFiveBeta3, "iOS 27 beta 3 — Reminders"),
    ],
  }),
  observedCorroborated({
    key: "ios-27-beta3-shortcuts-starting-editor",
    title: "Shortcuts starting-editor choice",
    canonicalSummary:
      "Shortcuts added a choice between beginning with natural-language description and opening the manual action editor.",
    category: "enhancement",
    citations: [
      c(U.macrumorsBeta3, "Shortcuts"),
      c(U.nineToFiveBeta3, "iOS 27 beta 3 — Shortcuts"),
    ],
  }),
  observedCorroborated({
    key: "ios-27-beta3-control-center-cellular-status",
    title: "Cellular status while connected to Wi-Fi",
    canonicalSummary:
      "Control Center began showing cellular signal and network type while the iPhone remained connected to Wi-Fi.",
    category: "enhancement",
    citations: [
      c(U.macrumorsBeta3, "Control Center"),
      c(U.nineToFiveBeta3, "iOS 27 beta 3 — Control Center"),
    ],
  }),
]);

addExtras("macos", "beta-3", [
  observedCorroborated({
    key: "macos-27-beta3-golden-gate-wallpapers-screen-savers",
    title: "Golden Gate wallpapers and screen savers",
    canonicalSummary:
      "Beta 3 added two Golden Gate Bridge visual options that could be used as wallpapers and motion screen savers.",
    category: "feature",
    action: "introduced",
    citations: [
      c(U.nineToFiveMacWallpaper, "Beta 3 wallpaper and screen saver options"),
      c(U.pixelsMacWallpaper, "Developer Beta 3 wallpaper"),
    ],
  }),
]);

const iosIpadosBeta1Baseline = [
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-localized-background-assets",
    title: "Localized Background Assets packs",
    canonicalSummary:
      "Background Assets could deliver language-specific asset packs according to the user’s preferred languages, reducing unnecessary app storage.",
    category: "developerApi",
    action: "introduced",
    locator: "Background Assets — New Features; 163944365",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-advanced-dictation-model",
    title: "Advanced Dictation on-device model",
    canonicalSummary:
      "An optional on-device Dictation model became available for developer testing to improve recognition accuracy.",
    category: "enhancement",
    action: "introduced",
    locator: "Dictation — New Features; 178444388",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-playstation-access-controller",
    title: "PlayStation Access controller support",
    canonicalSummary:
      "iPhone and iPad gained PlayStation Access controller support, including custom input profiles saved on the Apple device.",
    category: "compatibility",
    action: "introduced",
    locator: "Game Controller — New Features; 168071382",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-healthkit-menopause-samples",
    title: "HealthKit menopause sample types",
    canonicalSummary:
      "HealthKit added read/write sample types for menopausal state and bleeding after menopause under Reproductive Health.",
    category: "developerApi",
    action: "introduced",
    locator: "HealthKit — New Features; 178532053",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-home-video-intelligence",
    title: "Home video descriptions and search",
    canonicalSummary:
      "When enabled, Apple Intelligence for Home could process HomeKit Secure Video recordings on-device and through Private Cloud Compute for descriptions and search.",
    category: "feature",
    action: "introduced",
    locator: "HomeKit — New Features; 178858470",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-media-sharing-extensions",
    title: "System media-sharing extensions",
    canonicalSummary:
      "New frameworks let developers add media-sharing protocols as system extensions and gave media apps a common API for using them.",
    category: "developerApi",
    action: "introduced",
    locator: "Media Sharing Extensions — New Features; 168722808",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-metrickit-reporting",
    title: "Swift-first MetricKit reporting",
    canonicalSummary:
      "MetricKit added Swift-first asynchronous reports, state-aware diagnostics, memory-termination diagnostics, and application-level Metal frame-rate metrics.",
    category: "developerApi",
    action: "introduced",
    locator:
      "MetricKit — New Features; 96078210, 159889985, 159890067, 159890165, 164439529",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-managed-network-tls",
    title: "Stricter TLS for managed system services",
    canonicalSummary:
      "Selected management, enrollment, app-installation, and software-update processes began requiring TLS 1.2 or later with App Transport Security-compatible ciphers and certificates.",
    category: "security",
    action: "changed",
    locator: "Network Security — New Features; 176055825",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-on-demand-resources-deprecation",
    title: "On Demand Resources deprecated",
    canonicalSummary:
      "Apple deprecated On Demand Resources and NSBundleResourceRequest in favor of Background Assets.",
    category: "removal",
    action: "removed",
    locator: "On Demand Resources — Deprecations; 170066290",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-launch-screen-requirement",
    title: "Launch screen required for SDK 27 apps",
    canonicalSummary:
      "iOS and iPadOS apps built with the 27 SDK were required to declare a launch screen before App Store submission support began.",
    category: "compatibility",
    action: "changed",
    locator: "UIKit — New Features; 168247372",
  }),
  archivedAppleChange({
    beta: "beta-1",
    key: "ios-ipados-27-beta1-scene-lifecycle-requirement",
    title: "Scene-based lifecycle required",
    canonicalSummary:
      "Apps linked with the latest SDK had to adopt the scene-based lifecycle or they would fail to launch.",
    category: "compatibility",
    action: "changed",
    locator: "UIKit — Deprecations; 141837548",
  }),
];
appendExtras("ios", "beta-1", iosIpadosBeta1Baseline);
appendExtras("ipados", "beta-1", iosIpadosBeta1Baseline);

const iosIpadosBeta2Changes = [
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-notes-attributed-name",
    title: "Attributed note names in App Intents",
    canonicalSummary:
      "The Notes create and update schemas accepted an AttributedString name parameter.",
    category: "developerApi",
    action: "introduced",
    locator: "App Intents — New Features; 173431080",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-calendar-delete-schema-rename",
    title: "Calendar delete-event schema rename",
    canonicalSummary:
      "The calendar.deleteEvents App Intents schema was renamed to calendar.deleteEvent.",
    category: "compatibility",
    action: "changed",
    locator: "App Intents — Deprecations; 176751155",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-coreai-metal-validation",
    title: "Core AI with Metal API Validation",
    canonicalSummary:
      "Core AI models could execute while Metal API Validation was enabled.",
    category: "bugFix",
    action: "fixed",
    locator:
      "Core AI — Known Issues to Resolved Issues; 177991751 status transition",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-channel-sounding-results",
    title: "Channel Sounding ranging results",
    canonicalSummary:
      "Core Bluetooth and Nearby Interaction began returning Channel Sounding ranging results.",
    category: "bugFix",
    action: "fixed",
    locator:
      "Core Bluetooth and Nearby Interaction — Known Issues to Resolved Issues; 178333845 and 178073051",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-foundation-models-profile-fixes",
    title: "Foundation Models profile and Generable fixes",
    canonicalSummary:
      "Apple fixed an enum Generable warning, transcript-truncation runtime errors, and Profile onPrompt callbacks that could be skipped.",
    category: "bugFix",
    action: "fixed",
    locator:
      "Foundation Models — Known Issues to Resolved Issues; 177899620, 177901494, 177902488",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-healthkit-training-zones",
    title: "HealthKit heart-rate and cycling-power zones",
    canonicalSummary:
      "HealthKit added support for heart-rate zones and cycling-power zones.",
    category: "developerApi",
    action: "introduced",
    locator: "HealthKit — New Features; 135746152",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-metal-edge-sampling",
    title: "Metal clamp-to-edge sampling",
    canonicalSummary:
      "Apple fixed Metal sampling that could incorrectly clamp edge-addressed texture results to zero.",
    category: "bugFix",
    action: "fixed",
    locator:
      "Metal — Known Issues to Resolved Issues; 172520325 status transition",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-swiftdata-query-deadlock",
    title: "SwiftData Query background-save deadlock",
    canonicalSummary:
      "SwiftData no longer deadlocked a Query when a background actor saved its ModelContext while scheduling ModelActor tasks.",
    category: "bugFix",
    action: "fixed",
    locator:
      "SwiftData — Known Issues to Resolved Issues; 178113288 status transition",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-swiftui-document-model",
    title: "SwiftUI document protocol model",
    canonicalSummary:
      "SwiftUI introduced a combined Document protocol for read/write documents and deprecated FileDocument in favor of ReadableDocument or Document.",
    category: "developerApi",
    action: "changed",
    locator: "SwiftUI — New Features and Deprecations; 177458781 and 178776840",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-trust-insights",
    title: "Trust Insights framework",
    canonicalSummary:
      "Apps with the required entitlement could use the TrustInsights framework to request network-backed trust results.",
    category: "developerApi",
    action: "introduced",
    locator: "Trust Insights — New Features; 154949256",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-frame-interpolation-dimensions",
    title: "VideoToolbox frame interpolation dimensions",
    canonicalSummary:
      "Low-latency frame interpolation accepted arbitrary source dimensions up to 1080p.",
    category: "developerApi",
    action: "introduced",
    locator: "VideoToolbox — New Features; 179040806",
  }),
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-ipados-27-beta2-screen-time-child-restrictions",
    title: "Screen Time child-account restrictions",
    canonicalSummary:
      "Configured Screen Time restrictions could fail to apply to child accounts.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Screen Time — Known Issues; 175437403",
  }),
];
appendExtras("ios", "beta-2", [
  ...iosIpadosBeta2Changes,
  archivedAppleChange({
    beta: "beta-2",
    key: "ios-27-beta2-coreai-neural-engine",
    title: "Core AI Neural Engine changes",
    canonicalSummary:
      "Core AI improved large-model loading and process-level memory attribution on the Neural Engine while restricting background access.",
    category: "developerApi",
    action: "changed",
    locator: "Core AI — New Features; 174796039",
  }),
]);
appendExtras("ipados", "beta-2", iosIpadosBeta2Changes);

const iosIpadosBeta3Changes = [
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-background-inference-entitlement",
    title: "Background Neural Engine entitlement",
    canonicalSummary:
      "Core AI documented a dedicated entitlement for Neural Engine inference during continued-processing background tasks.",
    category: "developerApi",
    action: "introduced",
    locator:
      "Core AI — Known Issues to New Features; 179282606 status transition",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-language-model-existential",
    title: "LanguageModel existential compiler support",
    canonicalSummary:
      "Passing an existential LanguageModel to the model modifier no longer caused a compiler error.",
    category: "bugFix",
    action: "fixed",
    locator:
      "Foundation Models — Known Issues to Resolved Issues; 178545978 status transition",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-healthkit-history-scope",
    title: "Limited or full HealthKit history access",
    canonicalSummary:
      "HealthKit’s updated permission flow let users grant an app limited history or full history.",
    category: "feature",
    action: "introduced",
    locator: "HealthKit — New Features; 172310874",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-recently-deleted-files",
    title: "Recently Deleted file removal",
    canonicalSummary:
      "Deleting files from Recently Deleted could fail or take substantially longer than expected.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Files — Known Issues; 179787658",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-critical-alert-default",
    title: "Critical Alerts enabled automatically",
    canonicalSummary:
      "Critical Alerts could be enabled automatically for an app when the app requested notification permission.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Notifications — Known Issues; 179179362",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-shortcuts-use-model-output",
    title: "Shortcuts on-device model output",
    canonicalSummary:
      "The Shortcuts Use Model action could fail for some output types when configured for on-device execution.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Shortcuts — Known Issues; 181071784",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-storekit-upgrade-expiration",
    title: "StoreKit upgraded-subscription expiration",
    canonicalSummary:
      "StoreKit Testing stopped immediately marking upgraded-subscription transactions as expired.",
    category: "bugFix",
    action: "fixed",
    locator:
      "StoreKit Testing in Xcode — Known Issues to Resolved Issues; 178441109 status transition",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-swiftui-alert-backdeployment",
    title: "SwiftUI item-or-error dialogs back-deployed",
    canonicalSummary:
      "SwiftUI’s data-item and error-object alert and confirmation-dialog modifiers became available to projects targeting earlier OS releases.",
    category: "developerApi",
    action: "changed",
    locator: "SwiftUI — New Features; 179388848",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-swiftui-document-concurrency",
    title: "SwiftUI document concurrency annotations",
    canonicalSummary:
      "SwiftUI corrected document reader/writer concurrency and main-actor isolation for document factories and URLDocumentConfiguration.",
    category: "developerApi",
    action: "fixed",
    locator: "SwiftUI — Resolved Issues; 180302015, 180302065, 180302075",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-system-stat-conflict",
    title: "Swift System stat method conflicts",
    canonicalSummary:
      "Swift System fixed source conflicts between custom unqualified stat calls and the new FilePath or FileDescriptor stat methods.",
    category: "bugFix",
    action: "fixed",
    locator:
      "System — Known Issues to Resolved Issues; 177911316 status transition",
  }),
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-ipados-27-beta3-navigation-bar-minimization",
    title: "Navigation bar minimization API",
    canonicalSummary:
      "UIKit added UINavigationItem.navigationBarMinimization as the replacement control for navigation-bar minimization behavior.",
    category: "developerApi",
    action: "introduced",
    locator: "UIKit — New Features; 177953926",
  }),
];
appendExtras("ios", "beta-3", [
  ...iosIpadosBeta3Changes,
  archivedAppleChange({
    beta: "beta-3",
    key: "ios-27-beta3-blurred-status-bar",
    title: "Blurred foreground status bar",
    canonicalSummary:
      "The iPhone status bar could appear blurred while an app was in the foreground.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Status Bar — Known Issues; 179470940",
  }),
]);
appendExtras("ipados", "beta-3", [
  ...iosIpadosBeta3Changes,
  archivedAppleChange({
    beta: "beta-3",
    key: "ipados-27-beta3-siri-camera-waveform",
    title: "Siri requests while Camera is open",
    canonicalSummary:
      "On specified older iPad Air, iPad mini, and iPad Pro models, the Siri waveform could animate incorrectly and Hey Siri requests could fail while Camera was open.",
    category: "knownIssue",
    action: "knownIssue",
    locator: "Siri — Known Issues; 180751246",
  }),
]);

function archivedNotesForEvent(platform, event) {
  if (!["ios", "ipados"].includes(platform.slug)) return platform.notes;
  if (event.alias === "beta-1") return U.iosNotesBeta1;
  if (event.alias === "beta-2") return U.iosNotesBeta2;
  if (event.alias === "beta-3") return U.iosNotesBeta3;
  return U.iosNotes;
}

function uniqueCitations(citations) {
  return [
    ...new Map(
      citations.map((citation) => [
        `${citation.url}|${citation.locator || ""}|${citation.note || ""}`,
        citation,
      ]),
    ).values(),
  ];
}

function milestoneNarrative(platform, event, eventChanges) {
  const archivedMobile =
    ["ios", "ipados"].includes(platform.slug) &&
    ["beta-1", "beta-2", "beta-3"].includes(event.alias);
  if (archivedMobile && event.alias === "beta-1") {
    return {
      text: `Apple’s first preserved iOS and iPadOS 27 developer-note state contains 203 itemized entries. This page selects ${eventChanges.length} representative initial capabilities and compatibility boundaries; it is a baseline, not a claim that every version-wide preview feature first appeared here.`,
      citations: [
        c(
          U.iosNotesBeta1,
          "Beta 1 snapshot; representative component and issue-ID baseline",
        ),
      ],
    };
  }
  if (archivedMobile && event.alias === "beta-2") {
    const documented = eventChanges.filter((item) =>
      item.citations.some((citation) => citation.url === U.iosNotesBeta2),
    ).length;
    return {
      text: `The preserved Beta 2 state contains 236 entries versus 203 in Beta 1. Issue-ID and status comparison supports ${documented} Apple-documented additions or resolutions on this ${platform.name} route; independently observed interface changes remain separately labeled corroborated or reported.`,
      citations: [
        c(U.iosNotesBeta1, "Beta 1 comparison state; 203 items"),
        c(
          U.iosNotesBeta2,
          "Beta 2 comparison state; 236 items; added and status-transition issue IDs",
        ),
      ],
    };
  }
  if (archivedMobile && event.alias === "beta-3") {
    const documented = eventChanges.filter((item) =>
      item.citations.some((citation) => citation.url === U.iosNotesBeta3),
    ).length;
    return {
      text: `The preserved Beta 3 state contains 251 entries versus 236 in Beta 2. Issue-ID and status comparison supports ${documented} Apple-documented additions or resolutions on this ${platform.name} route; later edits captured on July 17 are not assigned to Beta 3 v2 because the shared document still identifies itself only as Beta 3.`,
      citations: [
        c(U.iosNotesBeta2, "Beta 2 comparison state; 236 items"),
        c(
          U.iosNotesBeta3,
          "Beta 3 comparison state; 251 items; added and status-transition issue IDs",
        ),
      ],
    };
  }
  if (event.alias === "beta-3-v2") {
    return {
      text: `Apple’s release index confirms a revised ${platform.name} Beta 3 build on July 13. No retained source itemizes a revision-specific fix, and the July 17 iOS/iPadOS document still labels itself Beta 3 rather than Beta 3 v2, so this page records the new build without inventing a payload.`,
      citations: [
        c(
          sourceForEvent(platform, event),
          `${platform.name} 27.0 Beta 3 v.2; build ${event.build}`,
        ),
        c(U.reissueCoverage, "No version 2-specific release-note entry"),
      ],
    };
  }
  if (event.alias === "public-beta-1") {
    return {
      text: `Public Beta 1 widened access beyond the developer channel. Contemporaneous reporting describes the retained developer-build relationship, but no first-party record establishes a public-only payload, so Beta 3 changes are not duplicated here.`,
      citations: [
        c(U.publicBeta, "First public beta availability"),
        c(
          U.reissueCoverage,
          "Reported public-beta day and developer-build relationship",
        ),
      ],
    };
  }
  if (platform.slug === "visionos" && event.alias === "beta-2") {
    return {
      text: `Apple’s visionOS notes explicitly say that gaze activation for the Siri orb was enabled in Beta 2. The first-appearance fact remains in the narrative while the reusable capability stays represented once in the already-approved cumulative Beta 4 content.`,
      citations: [
        c(U.visionosNotes, "Siri — gaze activation enabled in Beta 2"),
      ],
    };
  }
  if (platform.slug === "watchos" && event.alias === "beta-3") {
    return {
      text: `Two contemporaneous publications identify Beta 3 as the first watchOS seed to expose the upgraded Siri experience and standalone Siri app after the first two seeds lacked them. That chronology remains in prose because the approved Beta 4 manifest already owns the reusable Siri capability.`,
      citations: [
        c(U.nineToFiveWatchBeta3, "Beta 3 first appearance"),
        c(U.t3WatchBeta3, "watchOS 27 Beta 3 Siri availability"),
      ],
    };
  }
  if (event.alias === "beta-1" && eventChanges.length === 0) {
    return {
      text: `This was the first ${platform.name} 27 developer seed. Apple’s WWDC announcement opened the OS 27 preview for developer testing that day, but no version-wide preview claim is converted into a Beta 1 structured delta without milestone-specific support.`,
      citations: [
        c(U.announcement, "Availability — developer testing starting June 8"),
        c(platform.notes, "Milestone-specific evidence audit"),
      ],
    };
  }
  if (eventChanges.length === 0) {
    return {
      text: `Apple’s release index establishes this build. The retained developer notes do not support a route-specific behavior delta for this seed, so later cumulative notes are not projected backward.`,
      citations: [
        c(
          sourceForEvent(platform, event),
          `${platform.name} 27.0 ${event.label}; build ${event.build}`,
        ),
        c(platform.notes, "Milestone-specific evidence audit"),
      ],
    };
  }
  return {
    text: `The structured inventory contains ${eventChanges.length} milestone-specific ${eventChanges.length === 1 ? "delta" : "deltas"}. Apple-documented items are confirmed; interface observations absent from first-party notes remain corroborated or reported according to their independent source count.`,
    citations: uniqueCitations(
      eventChanges.flatMap((item) => item.citations || []),
    ),
  };
}

function eventSummary(platform, event, changeCount) {
  if (event.alias === "public-beta-1") {
    return `${platform.name} 27 Public Beta 1 opened on July 13, 2026; contemporaneous coverage reports build ${event.build}, and this page does not duplicate Beta 3 release notes.`;
  }
  if (event.alias === "beta-3-v2") {
    return `Apple issued ${platform.name} 27 Beta 3 v2 as build ${event.build} on July 13, 2026; no retained source itemizes a revision-only payload.`;
  }
  if (changeCount === 0) {
    return `Apple published ${platform.name} 27 ${event.label} as build ${event.build} on ${event.date}; the page preserves the exact build identity and marks the absence of a source-supported route-specific delta.`;
  }
  return `Apple published ${platform.name} 27 ${event.label} as build ${event.build} on ${event.date}; the page preserves ${changeCount} source-supported milestone ${changeCount === 1 ? "delta" : "deltas"} while keeping build and channel administration in prose.`;
}

const events = platforms.flatMap((platform) =>
  platform.events
    .map((event) => {
      const eventChanges = extras.get(`${platform.slug}/${event.alias}`) || [];
      const milestone = milestoneNarrative(platform, event, eventChanges);
      const source = sourceForEvent(platform, event);
      const notesSource = archivedNotesForEvent(platform, event);
      const identityCitations =
        event.alias === "public-beta-1"
          ? [
              c(U.publicBeta, "First public beta availability"),
              c(
                U.reissueCoverage,
                "Reported developer-build relationship on public-beta day",
              ),
            ]
          : [
              c(
                source,
                `${platform.name} 27.0 ${event.label}; build ${event.build}`,
              ),
            ];
      const channelText =
        event.alias === "public-beta-1"
          ? `This is a public-beta channel event, not a public release. The exact developer-build linkage is reported rather than first-party-confirmed, and Apple’s guidance treats beta software as prerelease software.`
          : event.alias === "beta-3-v2"
            ? `This remains a developer-beta event. It is separate because Apple published a new build number, not because the retained evidence establishes a particular fix or feature.`
            : `This is a developer beta, not a public release. Apple recommends backing up before installation, reading the exact release notes, and reporting issues through Feedback Assistant.`;
      const archivedMobile =
        ["ios", "ipados"].includes(platform.slug) &&
        ["beta-1", "beta-2", "beta-3"].includes(event.alias);
      const boundaryText = archivedMobile
        ? `This page cites the human-readable preserved Apple page and uses the matching raw DocC capture only for issue-ID/status comparison. The structured inventory is representative for Beta 1 and delta-based for Beta 2 and Beta 3; no July 17 edit is assigned to the iPadOS revision.`
        : event.alias === "public-beta-1"
          ? `The public-beta sources establish availability but only report the retained developer-build relationship. They do not establish a public-only feature payload, and the approved Beta 4 route remains outside this batch.`
          : event.alias === "beta-3-v2"
            ? `No source itemizes a revision-only payload. The page therefore preserves the build replacement and evidence gap without copying Beta 3 notes.`
            : `The ${platform.name} developer-notes page is a living document. It is used only where a note explicitly identifies this beta or an exact cross-beta relationship; later cumulative content is not assigned backward.`;

      return {
        target: {
          releaseVersionId: platform.versionId,
          routeAlias: event.alias,
        },
        authorship: "originalSynthesis",
        summary: eventSummary(platform, event, eventChanges.length),
        article: article(
          heading("Release identity"),
          prose(
            `${platform.name} 27 ${event.label} appeared on ${event.date}. ${
              event.alias === "public-beta-1"
                ? `Contemporaneous coverage reports build ${event.build} for this channel; that linkage is not promoted to a first-party-confirmed fact.`
                : `Apple associates build ${event.build} with the seed; the identifier is scoped to ${platform.name} even where another platform used the same alphanumeric build.`
            }`,
            identityCitations,
          ),
          heading("What changed at this milestone"),
          prose(milestone.text, milestone.citations),
          heading("Channel and device scope"),
          prose(channelText, [
            c(U.installBeta, "Back up; release notes; Feedback Assistant"),
            ...(event.alias === "public-beta-1"
              ? [c(U.publicBeta, "Apple Beta Software Program enrollment")]
              : []),
          ]),
          heading("Evidence boundary"),
          prose(boundaryText, [
            c(notesSource, `${event.label} evidence boundary`),
            ...(event.alias === "public-beta-1"
              ? [
                  c(
                    U.reissueCoverage,
                    "Reported public-beta build relationship",
                  ),
                ]
              : []),
          ]),
        ),
        citations: uniqueCitations([
          ...identityCitations,
          c(notesSource, `${event.label} evidence audit`),
          ...eventChanges.flatMap((item) => item.citations || []),
        ]),
        changes: eventChanges,
        provenanceStatus: "editoriallyVerified",
        editorialReview: review(),
        isIndexable: true,
      };
    })
    .filter((event) => event.changes.length > 0),
);

const buildMap = new Map();
for (const platform of platforms) {
  for (const event of platform.events) {
    const identity = `${platform.versionId}/${event.build}`;
    if (!buildMap.has(identity)) {
      buildMap.set(identity, {
        releaseVersionId: platform.versionId,
        platformId: platform.platformId,
        platformName: platform.name,
        buildNumber: event.build,
        eventTargets: [],
        labels: [],
        citations: [],
        contextNotes: [],
        hasReportedPublicLink: false,
      });
    }
    const item = buildMap.get(identity);
    item.eventTargets.push({
      releaseVersionId: platform.versionId,
      routeAlias: event.alias,
    });
    item.labels.push(event.label);
    if (event.alias === "public-beta-1") {
      item.hasReportedPublicLink = true;
      item.citations.push(
        c(U.reissueCoverage, "Public-beta build relationship"),
        c(U.publicBeta, "Public Beta 1 availability"),
      );
    } else {
      item.citations.push(
        c(
          sourceForEvent(platform, event),
          `${platform.name} 27.0 ${event.label}; build ${event.build}`,
        ),
      );
    }
    if (event.alias === "beta-1") {
      item.contextNotes.push(
        "Apple’s WWDC announcement places the first developer-testing availability on the same date.",
      );
      item.citations.push(
        c(U.announcement, "Developer testing availability on June 8"),
      );
    }
    if (platform.slug === "visionos" && event.alias === "beta-2") {
      item.contextNotes.push(
        "Apple’s living notes date gaze activation for the Siri orb to Beta 2; the cumulative capability remains owned by the approved Beta 4 content.",
      );
      item.citations.push(
        c(U.visionosNotes, "Siri — gaze activation enabled in Beta 2"),
      );
    }
    if (platform.slug === "watchos" && event.alias === "beta-3") {
      item.contextNotes.push(
        "Two contemporaneous reports place the upgraded Siri experience and standalone Siri app in Beta 3; the cumulative capability remains owned by the approved Beta 4 content.",
      );
      item.citations.push(
        c(U.nineToFiveWatchBeta3, "Beta 3 first appearance"),
        c(U.t3WatchBeta3, "watchOS 27 Beta 3 Siri availability"),
      );
    }
  }
}

const builds = [...buildMap.values()].map((item) => {
  const labels = [...new Set(item.labels)];
  const linkedMilestones = labels.join(" and ");
  const citations = [
    ...new Map(
      item.citations.map((citation) => [
        `${citation.url}|${citation.locator || ""}`,
        citation,
      ]),
    ).values(),
  ];
  return {
    releaseVersionId: item.releaseVersionId,
    platformId: item.platformId,
    buildNumber: item.buildNumber,
    eventTargets: item.eventTargets,
    authorship: "originalSynthesis",
    summary: `${item.platformName} 27 build ${item.buildNumber} is linked to the exact existing ${linkedMilestones} ${labels.length === 1 ? "event" : "events"}; the build record does not imply a public release.${
      item.hasReportedPublicLink
        ? " Its public-beta linkage is reported by contemporaneous coverage rather than first-party-confirmed."
        : ""
    }${item.contextNotes.length > 0 ? ` ${item.contextNotes.join(" ")}` : ""}`,
    article: article(
      heading("Build identity"),
      prose(
        `The retained release evidence identifies ${item.buildNumber} as a ${item.platformName} 27 prerelease build associated with ${linkedMilestones}. The identifier is platform-scoped even when another operating system uses the same characters.`,
        citations,
      ),
      heading("Milestone relationship"),
      prose(
        `This single build record links the existing ${linkedMilestones} ${labels.length === 1 ? "route" : "routes"} without duplicating a build document. ${
          item.hasReportedPublicLink
            ? "The public-beta relationship is attributed to contemporaneous reporting and is not presented as a first-party-confirmed payload."
            : "The cited Apple release entry establishes the build and developer-beta milestone; it does not establish a public release."
        }`,
        citations,
      ),
      ...(item.contextNotes.length > 0
        ? [
            heading("Research boundary"),
            prose(item.contextNotes.join(" "), citations),
          ]
        : []),
    ),
    citations,
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
  builds,
};

const expectedSeedInventory = [
  {
    platform: "iOS",
    milestones: [
      ["Beta 1", "2026-06-08", false, undefined, U.iosBeta1, "Apple Developer"],
      [
        "Beta 2",
        "2026-06-22",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3",
        "2026-07-06",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Public Beta 1",
        "2026-07-13",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 4",
        "2026-07-20",
        false,
        undefined,
        "https://developer.apple.com/news/releases/?id=07202026g",
        "Apple Developer",
      ],
    ],
  },
  {
    platform: "iPadOS",
    milestones: [
      [
        "Beta 1",
        "2026-06-08",
        false,
        undefined,
        U.ipadosBeta1,
        "Apple Developer",
      ],
      [
        "Beta 2",
        "2026-06-22",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3",
        "2026-07-06",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3 v2",
        "2026-07-13",
        true,
        "Build 24A5380l; also released as Public Beta 1",
        U.ipadosBeta3v2,
        "Apple Developer",
      ],
      [
        "Public Beta 1",
        "2026-07-13",
        false,
        "Build 24A5380l",
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 4",
        "2026-07-20",
        false,
        undefined,
        "https://developer.apple.com/news/releases/?id=07202026h",
        "Apple Developer",
      ],
    ],
  },
  {
    platform: "macOS",
    milestones: [
      [
        "Beta 1",
        "2026-06-08",
        false,
        undefined,
        U.macosBeta1,
        "Apple Developer",
      ],
      [
        "Beta 2",
        "2026-06-22",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3",
        "2026-07-06",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3 v2",
        "2026-07-13",
        true,
        undefined,
        U.macosBeta3v2,
        "Apple Developer",
      ],
      [
        "Beta 4",
        "2026-07-20",
        false,
        undefined,
        "https://developer.apple.com/news/releases/?id=07202026i",
        "Apple Developer",
      ],
    ],
  },
  {
    platform: "tvOS",
    milestones: [
      [
        "Beta 1",
        "2026-06-08",
        false,
        undefined,
        U.tvosBeta1,
        "Apple Developer",
      ],
      [
        "Beta 2",
        "2026-06-22",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3",
        "2026-07-06",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 4",
        "2026-07-20",
        false,
        undefined,
        "https://developer.apple.com/news/releases/?id=07202026j",
        "Apple Developer",
      ],
    ],
  },
  {
    platform: "visionOS",
    milestones: [
      [
        "Beta 1",
        "2026-06-08",
        false,
        undefined,
        U.visionosBeta1,
        "Apple Developer",
      ],
      [
        "Beta 2",
        "2026-06-22",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3",
        "2026-07-06",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 4",
        "2026-07-20",
        false,
        undefined,
        "https://developer.apple.com/news/releases/?id=07202026k",
        "Apple Developer",
      ],
    ],
  },
  {
    platform: "watchOS",
    milestones: [
      [
        "Beta 1",
        "2026-06-08",
        false,
        undefined,
        U.watchosBeta1,
        "Apple Developer",
      ],
      [
        "Beta 2",
        "2026-06-23",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 3",
        "2026-07-06",
        false,
        undefined,
        U.developerReleases,
        "Apple Developer",
      ],
      [
        "Beta 4",
        "2026-07-20",
        false,
        undefined,
        "https://developer.apple.com/news/releases/?id=07202026l",
        "Apple Developer",
      ],
    ],
  },
];

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const seedInventory = seed.releaseVersions
  .filter(
    (version) =>
      version.version === "27.0" &&
      platformBySlug.has(version.platform.toLowerCase()),
  )
  .map((version) => ({
    platform: version.platform,
    majorVersion: version.majorVersion,
    publicReleaseDate: version.publicReleaseDate,
    versionNote: version.versionNote,
    milestones: version.milestones.map((milestone) => [
      milestone.label,
      milestone.date,
      milestone.isRevision,
      milestone.note,
      milestone.sourceUrl,
      milestone.sourceLabel,
    ]),
  }))
  .sort((left, right) => left.platform.localeCompare(right.platform));
const normalizedExpectedSeed = expectedSeedInventory
  .map((item) => ({
    ...item,
    majorVersion: 27,
    publicReleaseDate: undefined,
    versionNote: undefined,
  }))
  .sort((left, right) => left.platform.localeCompare(right.platform));

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, stableValue(item)]),
  );
};

if (
  JSON.stringify(stableValue(seedInventory)) !==
  JSON.stringify(stableValue(normalizedExpectedSeed))
) {
  throw new Error(
    "The exact local Apple OS 27 seed inventory changed; re-audit the cohort before regenerating.",
  );
}

const expectedRoutes = new Set(
  platforms.flatMap((platform) =>
    platform.events.map((event) => `${platform.versionId}/${event.alias}`),
  ),
);
const expectedEventRoutes = new Set([
  "version-ios-27-0/beta-1",
  "version-ios-27-0/beta-2",
  "version-ios-27-0/beta-3",
  "version-ipados-27-0/beta-1",
  "version-ipados-27-0/beta-2",
  "version-ipados-27-0/beta-3",
  "version-macos-27-0/beta-2",
  "version-macos-27-0/beta-3",
  "version-tvos-27-0/beta-2",
  "version-watchos-27-0/beta-2",
]);
const actualRoutes = events.map(
  (event) => `${event.target.releaseVersionId}/${event.target.routeAlias}`,
);
const expectedBuilds = new Set([
  "version-ios-27-0/24A5355q",
  "version-ios-27-0/24A5370h",
  "version-ios-27-0/24A5380h",
  "version-ipados-27-0/24A5355q",
  "version-ipados-27-0/24A5370h",
  "version-ipados-27-0/24A5380h",
  "version-ipados-27-0/24A5380l",
  "version-macos-27-0/26A5353q",
  "version-macos-27-0/26A5368g",
  "version-macos-27-0/26A5378j",
  "version-macos-27-0/26A5378n",
  "version-tvos-27-0/24J5289o",
  "version-tvos-27-0/24J5305f",
  "version-tvos-27-0/24J5315i",
  "version-visionos-27-0/24M5291p",
  "version-visionos-27-0/24M5306i",
  "version-visionos-27-0/24M5316k",
  "version-watchos-27-0/24R5289n",
  "version-watchos-27-0/24R5305g",
  "version-watchos-27-0/24R5315i",
]);
const actualBuilds = builds.map(
  (build) => `${build.releaseVersionId}/${build.buildNumber}`,
);
const changeCount = events.reduce(
  (total, releaseEvent) => total + releaseEvent.changes.length,
  0,
);

if (
  bundle.versions.length !== 0 ||
  events.length !== 10 ||
  builds.length !== 20 ||
  changeCount !== 87 ||
  new Set(actualRoutes).size !== expectedEventRoutes.size ||
  actualRoutes.some((identity) => !expectedEventRoutes.has(identity)) ||
  actualRoutes.some((identity) => identity.endsWith("/beta-4")) ||
  events.some(
    (event) =>
      Object.keys(event.target).sort().join(",") !==
        "releaseVersionId,routeAlias" ||
      event.provenanceStatus !== "editoriallyVerified" ||
      event.editorialReview.status !== "approved" ||
      event.editorialReview.reviewedAt !== reviewedAt ||
      event.isIndexable !== true ||
      event.changes.some((change) =>
        /seed-identity|testflight-sdk-submissions/.test(change.key),
      ),
  ) ||
  new Set(actualBuilds).size !== expectedBuilds.size ||
  actualBuilds.some((identity) => !expectedBuilds.has(identity)) ||
  builds.some(
    (build) =>
      build.provenanceStatus !== "editoriallyVerified" ||
      build.editorialReview.status !== "approved" ||
      build.editorialReview.reviewedAt !== reviewedAt ||
      build.isIndexable !== true ||
      build.authorship !== "originalSynthesis" ||
      !build.article ||
      build.eventTargets.some(
        (target) =>
          Object.keys(target).sort().join(",") !==
            "releaseVersionId,routeAlias" ||
          !expectedRoutes.has(
            `${target.releaseVersionId}/${target.routeAlias}`,
          ) ||
          target.routeAlias === "beta-4",
      ),
  )
) {
  throw new Error("The expected Apple OS 27 prerelease bundle closure failed.");
}

const localChangeDefinitions = new Map();
for (const item of events.flatMap((event) => event.changes)) {
  const definition = JSON.stringify(stableValue(item));
  const previous = localChangeDefinitions.get(item.key);
  if (previous && previous !== definition) {
    throw new Error(`Apple OS 27 change definition drifted for ${item.key}.`);
  }
  localChangeDefinitions.set(item.key, definition);
}
const uniqueLocalChangeKeys = [...localChangeDefinitions.keys()];
if (uniqueLocalChangeKeys.length !== 53) {
  throw new Error(
    `Expected 53 stable Apple OS 27 change definitions; found ${uniqueLocalChangeKeys.length}.`,
  );
}

const otherChangeKeys = new Map();
const collisionFiles = [
  ...readdirSync(here)
    .filter((name) => name.endsWith(".json") && name !== outputName)
    .map((name) => join(here, name)),
  join(here, "..", "apple-launch-content-2026.json"),
];
for (const file of collisionFiles) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const owner of [
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const item of owner.changes || []) {
      if (!otherChangeKeys.has(item.key)) {
        otherChangeKeys.set(item.key, file);
      }
    }
  }
}
const collisions = uniqueLocalChangeKeys.filter((key) =>
  otherChangeKeys.has(key),
);
if (collisions.length > 0) {
  throw new Error(
    `Apple OS 27 prerelease change keys collide with existing content: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
}

const launchManifest = JSON.parse(
  readFileSync(join(here, "..", "apple-launch-content-2026.json"), "utf8"),
);
const launch27Targets = (launchManifest.events || [])
  .map((event) => event.target || {})
  .filter((target) =>
    Object.values(target).some(
      (value) =>
        typeof value === "string" &&
        /^version-(?:ios|ipados|macos|tvos|visionos|watchos)-27-0(?::|$)/.test(
          value,
        ),
    ),
  );
const expectedLaunchLegacyTargets = new Set([
  "version-ios-27-0:m4",
  "version-ipados-27-0:m4",
  "version-macos-27-0:m4",
  "version-tvos-27-0:m4",
  "version-visionos-27-0:m4",
  "version-watchos-27-0:m4",
]);
if (
  launch27Targets.length !== 6 ||
  launch27Targets.some(
    (target) =>
      Object.keys(target).length !== 1 ||
      !expectedLaunchLegacyTargets.has(target.legacySourceId),
  )
) {
  throw new Error(
    "The approved launch manifest’s Apple OS 27 event ownership changed; re-audit overlap before regenerating.",
  );
}

for (const file of collisionFiles.filter(
  (file) => file !== join(here, "..", "apple-launch-content-2026.json"),
)) {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  for (const event of candidate.events || []) {
    if (
      event.target?.releaseVersionId &&
      event.target?.routeAlias &&
      expectedRoutes.has(
        `${event.target.releaseVersionId}/${event.target.routeAlias}`,
      )
    ) {
      throw new Error(
        `An existing research batch already owns ${event.target.releaseVersionId}/${event.target.routeAlias}: ${file}`,
      );
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
const generatorSha = createHash("sha256")
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest("hex");

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

const routeRows = platforms
  .flatMap((platform) =>
    platform.events.map((event) => {
      const releaseEvent = events.find(
        (item) =>
          item.target.releaseVersionId === platform.versionId &&
          item.target.routeAlias === event.alias,
      );
      return `| ${platform.name} | ${event.label} | ${event.date} | \`${event.build}\` | ${releaseEvent ? "event overlay" : "build only; evidence gap"} | ${releaseEvent?.changes.length || 0} |`;
    }),
  )
  .join("\n");

const sourceLedger = sources
  .map(
    (source) =>
      `- [${source.title}](${source.url}) — ${source.publisher}; ${source.sourceClass}.`,
  )
  .join("\n");

const md = `# Apple OS 27 prerelease research batch

## Result

\`${outputName}\` publishes substantive overlays for 10 Apple OS 27 prerelease
routes and exact build records across the 22-route pre-Beta-4 audit scope.
Twelve route overlays are deliberately omitted where the retained evidence
does not support a substantive, non-duplicative structured delta. The six
approved Beta 4 routes and builds remain owned by
\`scripts/apple-launch-content-2026.json\`.

- ${events.length} source-backed event articles with at least one substantive
  behavior or API change
- 20 exact build overlays; shared developer/public build relationships are
  represented with multiple durable event targets rather than duplicate builds
- ${changeCount} structured behavior/API change occurrences across
  ${uniqueLocalChangeKeys.length} collision-checked definitions; seed identity
  and TestFlight administration are retained only in prose or removed
- ${sources.length} declared and used sources; ${citationCount} claim-level or
  page-level citation references
- 0 release-version overlays, 0 route creations, and 0 Beta 4 mutations
- every event and build is \`editoriallyVerified\`, approved at
  \`${reviewedAt}\`, and \`isIndexable: true\`

## Exact route audit closure

| Platform | Existing route | Date | Build | Batch treatment | Structured behavior/API deltas |
| --- | --- | --- | --- | --- | ---: |
${routeRows}

The local seed contains 28 Apple OS 27 milestones. This audit covers the 22
routes before Beta 4: iOS 4, iPadOS 5, macOS 4, tvOS 3, visionOS 3, and
watchOS 3. It publishes 10 event overlays and keeps build/channel evidence for
all 22 routes in 20 deduplicated build records. The remaining six milestones
are the already-approved Beta 4 routes.

## Research and attribution method

1. Apple’s individual Beta 1 and July 13 revision entries establish those
   developer-seed dates and builds directly. Human-readable Apple Releases
   captures from June 22, June 24, and July 7 establish every Beta 2 and Beta 3
   row; the mutable live category page is not used as durable exact-build
   evidence.
2. Human-readable Internet Archive copies of Apple’s iOS and iPadOS 27
   developer notes are public citation targets. Matching raw DocC JSON captures
   were used only to compare component headings, issue IDs, text, and status
   transitions.
3. Beta 1 is a representative baseline selected from 203 captured entries.
   Beta 2 and Beta 3 use adjacent-state diffs: 236 versus 203 items, then 251
   versus 236. An item is assigned to a later beta only when its issue ID was
   added or its status changed in that captured state.
4. A third-party interface observation is \`corroborated\` only when two
   independent contemporaneous publications describe the same behavior.
   Single-source Home behavior is retained as \`reported\` and
   \`undocumented\`.
5. Public Beta 1 is treated as a channel expansion. It does not inherit or
   duplicate developer Beta 3 feature notes, and its build linkage is described
   as reported rather than first-party-confirmed.
6. All prose is original synthesis. Product names are nominative references;
   no publisher paragraph, screenshot, trademark artwork, or marketing copy
   is reproduced.

## Archived iOS and iPadOS findings

- Beta 1: localized Background Assets, advanced on-device Dictation, PlayStation
  Access controller support, new HealthKit reproductive-health samples, Home
  video descriptions/search, media-sharing extensions, Swift-first MetricKit,
  stricter managed-service TLS, On Demand Resources deprecation, launch-screen
  requirements, and the scene-lifecycle requirement.
- Beta 2 additions: App Intents schema changes, HealthKit training zones,
  SwiftUI’s new document model, Trust Insights, and expanded VideoToolbox frame
  interpolation. Status transitions confirm Core AI, Channel Sounding,
  Foundation Models, Metal, SwiftData, and related fixes. iOS also retains the
  explicit AirPods Max 2 Beta 1-to-Beta 2 firmware-support boundary and
  contemporaneously observed interface changes.
- Beta 3 additions: background Neural Engine entitlement requirements,
  limited/full HealthKit history permissions, Shortcuts and notification known
  issues, SwiftUI/UIKit API changes, and platform-specific status-bar/Siri
  issues. Status transitions confirm Foundation Models, StoreKit Testing, and
  Swift System fixes. Contemporaneous iOS interface observations remain
  separately labeled corroborated.

## Preserved other-platform findings

- macOS Beta 2: AirPods Max 2 firmware-beta update support and an explicit
  USDKit compressed-mesh incompatibility between Beta 1 and Beta 2.
- tvOS Beta 2: a single-source report that Beta 2 corrected Home accessory
  responsiveness after the initial iOS/tvOS 27 installs.
- watchOS Beta 2: Apple-documented Verizon calling/Text-to-911 and Foundation
  Models import regressions tied explicitly to Beta 2.
- iOS Beta 3: corroborated Siri voice controls, Reminders icon, Shortcuts
  editor choice, and Control Center cellular-status observations.
- macOS Beta 3: corroborated Golden Gate wallpapers and motion screen savers.
- visionOS Beta 2 and watchOS Beta 3 preserve important first-appearance facts
  in narrative form without creating duplicate reusable changes already owned
  cumulatively by the approved Beta 4 launch content.

## Exact evidence gaps

1. The July 17 raw capture contains 263 items and still identifies itself as
   “iOS & iPadOS 27 Beta 3 Release Notes.” It postdates the July 13 iPadOS Beta
   3 v2 event, but it is a shared iOS/iPadOS document and does not name the
   revision. Its additions and resolutions are therefore not assigned to Beta
   3 v2.
2. No reliable route-specific behavior delta was established for macOS Beta 1,
   tvOS Beta 1 or Beta 3, visionOS Beta 1 or Beta 3, or watchOS Beta 1. Those
   six event overlays are omitted; their exact build records remain.
3. tvOS Beta 2’s Home fix has one contemporaneous source and remains
   \`reported\`, not corroborated.
4. Apple explicitly dates gaze-to-activate Siri to visionOS Beta 2, but the
   approved Beta 4 manifest already owns
   \`visionos-27-gaze-orb-activation\` as a cumulative change. This batch
   preserves the Beta 2 first-appearance fact in the cited build summary and
   ledger, omits the route overlay, and leaves structured ownership for
   editorial reconciliation.
5. Two publications place Siri AI and the standalone Siri app in watchOS Beta
   3 after absence from the first two seeds. The approved Beta 4 manifest
   already owns \`watchos-27-siri-ai\`; this batch preserves the chronology in
   the cited build summary and ledger while omitting the route overlay.
6. Apple publishes revised iPadOS and macOS Beta 3 build identities, but no
   retained source itemizes what changed in either v2 seed. Both event overlays
   are omitted; the build records do not speculate about bug or security fixes.
7. The iOS Public Beta 1 build relationship depends on contemporaneous
   reporting that the public beta retained the Beta 3 build. Build and event
   targeting explicitly label that linkage as reported.
8. No public-beta-only feature delta was found for iOS or iPadOS. The two
   public-beta event overlays are therefore omitted rather than copying
   developer Beta 3 notes; their channel/build relationships remain in the
   deduplicated build records.

## Raw snapshot audit ledger

Raw transport URLs are validation provenance only and are never used as public
citations:

| State | Capture timestamp | Items | Raw SHA-256 | Raw transport |
| --- | --- | ---: | --- | --- |
| Beta 1 | \`20260608214924\` | 203 | \`fc7dc28e89c9c9604df8c602cf0060d61bbcbaac276ed16e38f7c0cee6406569\` | [DocC JSON](${U.iosNotesBeta1Transport}) |
| Beta 2 | \`20260627125300\` | 236 | \`d453c67bcf14f31724a01adb45cda3c86cafa4806254070c75fc924b2143d75e\` | [DocC JSON](${U.iosNotesBeta2Transport}) |
| Beta 3 | \`20260707041111\` | 251 | \`14076acbf5648516cc88342412fb617642bfabcfce0bee4c9c2f6e0c9c393de9\` | [DocC JSON](${U.iosNotesBeta3Transport}) |
| July 17 audit only | \`20260717024434\` | 263 | \`ee08f78b8d42fbc03e861366971f53a5dcd37eb0e504661196cdb1632ddb1998\` | [DocC JSON](https://web.archive.org/web/20260717024434id_/https://developer.apple.com/tutorials/data/documentation/ios-ipados-release-notes/ios-ipados-27-release-notes.json) |

## Archived build-index evidence

The following reader-facing Apple Releases captures were downloaded and their
visible rows checked before citation:

| Capture timestamp | Verified rows |
| --- | --- |
| [\`20260622193409\`](${U.releasesBeta2Archive}) | iOS \`24A5370h\`, iPadOS \`24A5370h\`, macOS \`26A5368g\`, tvOS \`24J5305f\`, visionOS \`24M5306i\` |
| [\`20260624173559\`](${U.releasesWatchBeta2Archive}) | watchOS \`24R5305g\` |
| [\`20260707070803\`](${U.releasesBeta3Archive}) | iOS \`24A5380h\`, iPadOS \`24A5380h\`, macOS \`26A5378j\`, tvOS \`24J5315i\`, visionOS \`24M5316k\`, watchOS \`24R5315i\` |

## Source ledger

All sources were accessed on ${accessedAt}. Exact Beta 2/3 build claims cite
the verified archived Apple Releases pages above, while living developer-note
pages are limited to explicit cross-beta facts. Historical iOS/iPadOS claims
cite human-readable preserved Apple pages with component, status, and retained
issue-ID locators.

${sourceLedger}

## Closure guards

- Exact comparison against all six local 27.0 seed records, including every
  label, date, revision flag, and retained note
- Exact 22-route build-target allowlist, exact 10-event substantive allowlist,
  and explicit Beta 4 rejection
- Exact 20-build allowlist and event-target closure
- Hard-coded assertion that the launch manifest still owns exactly its six
  known OS 27 Beta 4 legacy targets
- Collision scan across every other research-batch JSON plus
  \`apple-launch-content-2026.json\`
- ${changeCount} structured change occurrences resolve to exactly
  ${uniqueLocalChangeKeys.length} stable local definitions
- Explicit rejection of every seed-identity and TestFlight-administration
  structured change key
- Full citation declaration/use closure
- Deterministic formatted JSON SHA-256: \`${jsonSha}\`

## Validation and reviewed production plan

The generator’s seed, route, build, protected-Beta-4, collision, review-state,
and citation guards pass before writing either artifact.

Verified on ${accessedAt}:

- \`npm run research:validate\`: this batch reports 10
  events, 87 change occurrences, 30 sources, and 375 citation references
- focused ingestion/manifest suite: 19 tests passed
- ESLint, Prettier check, and \`git diff --check\`: passed
- deterministic regeneration: SHA-256 remained \`${jsonSha}\`
- reviewed production dry run: 90 creates, 35 revision-guarded patches, and
  2,052 unchanged documents
- create split: 17 sources, 20 builds, and 53 stable change documents; no
  versions or events are created
- patch split: 10 substantive event-content/build patches, 12 build-link-only
  event patches for the explicit evidence-gap routes, and 13 source-metadata
  patches
- all 20 build creates contain cited original-synthesis articles
- mutation payload: 254,030 bytes (6.5% of the guarded limit)
- production plan SHA:
  \`3fd042f1348fd3afd3d004f500c1723fa974cafbc80f9066e8118f9b17c26f01\`

## Editorial approval and production receipt

The primary agent independently reviewed the exact route/build closure,
source ledger, archived Apple Releases captures, representative prose, and the
revision-guarded mutation plan. All 92 cited Apple issue identifiers were
checked against the corresponding raw archived DocC payloads with no misses.
The 20 build records contain short, cited original-synthesis articles and pass
the same substantive editorial gate as the 10 event records.

- Editorial approval recorded at \`${reviewedAt}\`
- Approved manifest SHA-256: \`${jsonSha}\`
- Generator SHA-256: \`${generatorSha}\`
- Applied production plan:
  \`3fd042f1348fd3afd3d004f500c1723fa974cafbc80f9066e8118f9b17c26f01\`
- Sanity transaction: \`tt1fSB5HY9GAB0YLyyK26i\`
- Post-apply zero-plan SHA:
  \`043a85d1ab99f05981077699935e73002f86955400c729a5d19f85d6f9a9bd86\`
  with 0 mutations and 2,177 unchanged documents
- Production coverage after apply: 410 of 410 versions have full articles;
  appearances are 1,979 total, including 304 full, 256 source-linked, and
  1,419 timeline-only records; 455 approved structured changes are published
- Local verification passed for all 10 event pages and all 20 build pages;
  every route rendered its full article and \`index, follow\` metadata. Five
  initially delayed iOS/macOS routes settled after the documented 60-second
  cache/CDN propagation lag.

Reproduce with:

\`\`\`sh
node scripts/research-batches/build-apple-os-27-prerelease.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-os-27-prerelease.mjs
npx prettier --check scripts/research-batches/build-apple-os-27-prerelease.mjs scripts/research-batches/apple-os-27-prerelease.json scripts/research-batches/apple-os-27-prerelease.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-os-27-prerelease.json
\`\`\`

The last command is intentionally a post-apply dry run and must reproduce the
zero residual plan recorded above. The cumulative Beta 4 ownership boundaries
remain deliberate and unchanged.
`;

const formattedMd = await prettier.format(md, { filepath: ledgerName });
writeFileSync(join(here, ledgerName), formattedMd);
