import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";

const U = {
  macNews: "https://www.apple.com/newsroom/2020/11/macos-big-sur-is-here/",
  macDeveloper:
    "https://developer.apple.com/documentation/macos-release-notes/macos-big-sur-11_0_1-release-notes",
  macSecurity: "https://support.apple.com/en-us/102846",
  watch6: "https://support.apple.com/en-us/118388",
  watch7: "https://support.apple.com/en-us/118391",
  watch7Availability:
    "https://www.apple.com/newsroom/2020/09/apple-watch-series-6-delivers-breakthrough-wellness-and-fitness-capabilities/",
  watch612Security: "https://support.apple.com/en-us/103220",
  watch62Security: "https://support.apple.com/en-us/103829",
  watch7Security: "https://support.apple.com/en-us/103118",
  watch71Security: "https://support.apple.com/en-us/103039",
  watch72Security: "https://support.apple.com/en-us/102760",
  tvUpdates: "https://support.apple.com/en-us/106336",
  tv1331Security: "https://support.apple.com/en-us/103219",
  tv134Security: "https://support.apple.com/en-us/103827",
  tv1345Security: "https://support.apple.com/en-us/102845",
  tv14Security: "https://support.apple.com/en-us/103117",
  tv142Security: "https://support.apple.com/en-us/103040",
  tv143Security: "https://support.apple.com/en-us/102881",
};

const datedSecuritySources = [
  [
    U.macSecurity,
    "About the security content of macOS Big Sur 11.0.1",
    "2020-11-12",
    ["macOS", "Big Sur", "11.0.1"],
  ],
  [
    U.watch612Security,
    "About the security content of watchOS 6.1.2",
    "2020-01-28",
    ["watchOS", "6.1.2"],
  ],
  [
    U.watch62Security,
    "About the security content of watchOS 6.2",
    "2020-03-24",
    ["watchOS", "6.2"],
  ],
  [
    U.watch7Security,
    "About the security content of watchOS 7.0",
    "2020-09-16",
    ["watchOS", "7.0"],
  ],
  [
    U.watch71Security,
    "About the security content of watchOS 7.1",
    "2020-11-05",
    ["watchOS", "7.1"],
  ],
  [
    U.watch72Security,
    "About the security content of watchOS 7.2",
    "2020-12-14",
    ["watchOS", "7.2"],
  ],
  [
    U.tv1331Security,
    "About the security content of tvOS 13.3.1",
    "2020-01-28",
    ["tvOS", "13.3.1"],
  ],
  [
    U.tv134Security,
    "About the security content of tvOS 13.4",
    "2020-03-24",
    ["tvOS", "13.4"],
  ],
  [
    U.tv1345Security,
    "About the security content of tvOS 13.4.5",
    "2020-05-26",
    ["tvOS", "13.4.5"],
  ],
  [
    U.tv14Security,
    "About the security content of tvOS 14.0",
    "2020-09-16",
    ["tvOS", "14.0"],
  ],
  [
    U.tv142Security,
    "About the security content of tvOS 14.2",
    "2020-11-05",
    ["tvOS", "14.2"],
  ],
  [
    U.tv143Security,
    "About the security content of tvOS 14.3",
    "2020-12-14",
    ["tvOS", "14.3"],
  ],
];

const sources = [
  {
    url: U.macNews,
    title: "macOS Big Sur is here",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2020-11-12T00:00:00.000Z",
    topics: ["macOS", "Big Sur", "public availability", "features"],
  },
  {
    url: U.macDeveloper,
    title: "macOS Big Sur 11.0.1 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    topics: ["macOS", "Big Sur", "11.0.1", "developer release notes"],
  },
  {
    url: U.watch6,
    title: "About watchOS 6 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "6", "consumer release notes"],
  },
  {
    url: U.watch7,
    title: "About watchOS 7 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "7", "consumer release notes"],
  },
  {
    url: U.watch7Availability,
    title:
      "Apple Watch Series 6 delivers breakthrough wellness and fitness capabilities",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2020-09-15T00:00:00.000Z",
    topics: ["watchOS", "7", "public availability"],
  },
  {
    url: U.tvUpdates,
    title: "About Apple TV 4K and Apple TV HD software updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["tvOS", "Apple TV", "consumer release notes"],
  },
  ...datedSecuritySources.map(([url, title, date, topics]) => ({
    url,
    title,
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: `${date}T00:00:00.000Z`,
    topics: [...topics, "security", "CVE"],
  })),
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const reviewedAt = "2026-07-30T04:46:40Z";
const review = () => ({ status: "approved", reviewedAt });
const provenanceStatus = "editoriallyVerified";

function change({
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  citations,
}) {
  return {
    key,
    title,
    canonicalSummary,
    category,
    action,
    inheritance: "delta",
    summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      "Matched Apple's version-specific release notes, availability statement, or security advisory to the existing audited public-release event.",
    citations,
  };
}

function securityChange({
  key,
  title,
  canonicalSummary,
  summary,
  url,
  locator,
}) {
  return change({
    key,
    title,
    canonicalSummary,
    category: "security",
    action: "fixed",
    summary,
    citations: [c(url, locator)],
  });
}

function release({
  id,
  releaseNotesUrl,
  overview,
  overviewCitations,
  boundary,
  boundaryCitations,
  pageCitations,
  summary,
  publicText,
  publicCitations,
  scopeText,
  scopeCitations,
  changes,
}) {
  return {
    version: {
      releaseVersionId: id,
      authorship: "originalSynthesis",
      releaseNotesUrl,
      overview: article(
        heading("Release overview"),
        prose(overview, overviewCitations),
        heading("Evidence boundary"),
        prose(boundary, boundaryCitations),
      ),
      citations: pageCitations,
      provenanceStatus,
      editorialReview: review(),
    },
    event: {
      target: { releaseVersionId: id, routeAlias: "public" },
      authorship: "originalSynthesis",
      summary,
      article: article(
        heading("Public release"),
        prose(publicText, publicCitations),
        heading("Documented scope"),
        prose(scopeText, scopeCitations),
      ),
      citations: pageCitations,
      changes,
      provenanceStatus,
      editorialReview: review(),
      isIndexable: true,
    },
  };
}

const records = [
  release({
    id: "version-macos-11-0",
    releaseNotesUrl: U.macDeveloper,
    overview:
      "The existing local macOS 11.0 record represents the November 12, 2020 public launch of macOS Big Sur. Apple shipped and documented that release as 11.0.1, pairing a redesigned interface with major Safari, Messages, Maps, privacy, Apple-silicon, and developer-platform changes.",
    overviewCitations: [
      c(U.macNews, "UPDATE November 12, 2020; Availability"),
      c(U.macDeveloper, "macOS Big Sur 11.0.1 Release Notes"),
      c(U.macSecurity, "macOS Big Sur 11.0.1 — Released November 12, 2020"),
    ],
    boundary:
      "This bundle preserves the audited local 11.0 route instead of creating or renaming a release record. Apple's launch story says App Store privacy summaries were coming later in 2020, so they are not attributed to the launch event; security claims use the 11.0.1 advisory.",
    boundaryCitations: [
      c(U.macNews, "Privacy — feature marked coming later this year"),
      c(U.macDeveloper, "macOS Big Sur 11.0.1 Release Notes"),
      c(U.macSecurity, "macOS Big Sur 11.0.1"),
    ],
    pageCitations: [
      c(U.macNews, "November 12, 2020; Availability"),
      c(U.macDeveloper, "macOS Big Sur 11.0.1 Release Notes"),
      c(U.macSecurity, "Released November 12, 2020"),
    ],
    summary:
      "The existing macOS 11.0 route reached its audited public appearance on November 12, 2020, corresponding to Apple's Big Sur 11.0.1 launch documentation and its design, app, platform, and security record.",
    publicText:
      "Apple made macOS Big Sur available on November 12, 2020. The local route uses 11.0 while Apple's release notes and security advisory label the shipped version 11.0.1, so the discrepancy is disclosed rather than normalized away.",
    publicCitations: [
      c(U.macNews, "UPDATE November 12, 2020; Availability"),
      c(U.macDeveloper, "macOS Big Sur 11.0.1 Release Notes"),
      c(U.macSecurity, "Released November 12, 2020"),
    ],
    scopeText:
      "The first-party launch record supports interface, browser, communication, mapping, Apple-silicon compatibility, development, and security changes. It does not support assigning the later App Store privacy-label rollout to this public appearance.",
    scopeCitations: [
      c(
        U.macNews,
        "Refreshed Design; Safari; Messages; Maps; Developers; Privacy",
      ),
      c(U.macDeveloper, "macOS Big Sur 11.0.1 Release Notes"),
      c(U.macSecurity, "macOS Big Sur 11.0.1 security content"),
    ],
    changes: [
      change({
        key: "macos-11-redesign-control-notification-centers",
        title: "Redesigned interface, Control Center, and Notification Center",
        canonicalSummary:
          "Big Sur introduced a more spacious visual system, a menu-bar Control Center, interactive notifications, and redesigned widgets.",
        category: "enhancement",
        action: "changed",
        summary:
          "The system refresh updated windows, controls, icons, and app chrome while centralizing common settings and richer glanceable information.",
        citations: [c(U.macNews, "Refreshed Design: Focused and Familiar")],
      }),
      change({
        key: "macos-11-safari-tabs-start-page-translation",
        title: "Safari tabs, start page, and translation",
        canonicalSummary:
          "Safari gained denser tabs with previews, a customizable start page, built-in web translation, and improved extension discovery.",
        category: "enhancement",
        action: "changed",
        summary:
          "Big Sur reorganized Safari browsing around clearer tab identification, a personalized landing page, page translation, and Mac App Store extension discovery.",
        citations: [
          c(U.macNews, "Safari: Faster, More Personal, and More Private"),
        ],
      }),
      change({
        key: "macos-11-safari-privacy-report-password-monitoring",
        title: "Safari privacy and password protections",
        canonicalSummary:
          "Safari added tracker reporting, compromised-password monitoring, and per-site extension access controls.",
        category: "security",
        action: "introduced",
        summary:
          "The browser exposed blocked-tracker information, privately checked saved credentials against breach data, and let users restrict extension access by site and time.",
        citations: [
          c(
            U.macNews,
            "Safari Privacy Report; password monitoring; extensions",
          ),
        ],
      }),
      change({
        key: "macos-11-messages-pins-search-expression",
        title: "Messages pins, search, effects, and Memoji",
        canonicalSummary:
          "Messages added pinned conversations, reorganized search, message effects, Memoji creation, and an updated media picker.",
        category: "enhancement",
        action: "changed",
        summary:
          "The Mac messaging client gained faster access to important threads and more expressive tools aligned with Messages on Apple's other platforms.",
        citations: [
          c(
            U.macNews,
            "Messages: An Even More Engaging, Expressive Experience",
          ),
        ],
      }),
      change({
        key: "macos-11-messages-inline-replies-mentions",
        title: "Messages inline replies and mentions",
        canonicalSummary:
          "Group conversations gained threaded replies, mentions, mention-only notification controls, and custom group images.",
        category: "enhancement",
        action: "changed",
        summary:
          "Big Sur made busy group chats easier to follow by tying replies to individual messages and directing attention to named participants.",
        citations: [c(U.macNews, "Messages — group messaging features")],
      }),
      change({
        key: "macos-11-maps-guides-look-around-indoor",
        title: "Maps Guides, Look Around, and indoor maps",
        canonicalSummary:
          "The redesigned Maps app added curated and custom Guides, Look Around imagery, and detailed indoor maps for supported locations.",
        category: "enhancement",
        action: "changed",
        summary:
          "Big Sur expanded discovery and place context on Mac with shareable collections, immersive street views, and venue interiors.",
        citations: [c(U.macNews, "Maps: Discover the Next Adventure")],
      }),
      change({
        key: "macos-11-maps-cycling-ev-routing",
        title: "Cycling and electric-vehicle route planning",
        canonicalSummary:
          "Maps can plan supported bicycle and electric-vehicle trips on Mac and send them to iPhone.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added route planning that accounted for cycling conditions and electric-vehicle needs before handing navigation to a mobile device.",
        citations: [c(U.macNews, "Maps — cycling and electric vehicle trips")],
      }),
      change({
        key: "macos-11-apple-silicon-universal-rosetta",
        title: "Apple silicon, Universal apps, and Rosetta 2",
        canonicalSummary:
          "Big Sur supports M1 Macs, Universal binaries spanning Intel and Apple silicon, and Rosetta 2 translation for compatible Intel apps.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The operating system supplied the platform transition layer for native Apple-silicon software and continued use of many unconverted Intel applications.",
        citations: [
          c(U.macNews, "Developers: Bringing More Apps Than Ever to the Mac"),
        ],
      }),
      change({
        key: "macos-11-ios-ipados-apps-on-mac",
        title: "iPhone and iPad apps on Apple-silicon Macs",
        canonicalSummary:
          "Developers can make compatible iPhone and iPad apps available on Macs using Apple silicon.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Big Sur expanded the Mac app catalog by allowing eligible mobile applications to run directly on the new architecture.",
        citations: [c(U.macNews, "Developers — iPhone and iPad apps on Mac")],
      }),
      change({
        key: "macos-11-catalyst-swiftui-development",
        title: "Mac Catalyst and SwiftUI development updates",
        canonicalSummary:
          "Catalyst apps inherit the Big Sur design and gain interface controls, while SwiftUI expands shared-code and Mac-customization support.",
        category: "developerApi",
        action: "changed",
        summary:
          "Apple updated its cross-platform frameworks so developers could adapt interfaces to Mac conventions and share more implementation across platforms.",
        citations: [c(U.macNews, "Developers — Mac Catalyst and SwiftUI")],
      }),
      change({
        key: "macos-11-kernel-runtime-platform-changes",
        title: "Kernel and runtime platform changes",
        canonicalSummary:
          "The release changed system-library delivery, kernel-extension requirements, process event APIs, and supported argument lengths.",
        category: "developerApi",
        action: "changed",
        summary:
          "Apple's developer notes document a built-in dynamic-linker cache, stricter extension loading, longer argument support, and expanded kevent exit-status observation.",
        citations: [
          c(
            U.macDeveloper,
            "Kernel — New Features; Known Issues; Deprecations",
          ),
        ],
      }),
      securityChange({
        key: "macos-11-0-1-security-baseline",
        title: "Big Sur 11.0.1 security repairs",
        canonicalSummary:
          "The public Big Sur build repaired vulnerabilities across drivers, media and font parsing, files and privileges, the kernel, networking, privacy boundaries, and WebKit.",
        summary:
          "Apple's detailed advisory records a broad initial security baseline for Big Sur, including issues in graphics, audio, Finder, images, the kernel, Sandbox, SQLite, and web processing.",
        url: U.macSecurity,
        locator:
          "AMD; Audio; CoreGraphics; Finder; FontParser; ImageIO; Kernel; Sandbox; SQLite; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-6-1-2",
    releaseNotesUrl: U.watch6,
    overview:
      "watchOS 6.1.2 was released on January 28, 2020 as an important security update. Apple's consumer notes name no feature or ordinary bug fix for this version.",
    overviewCitations: [
      c(U.watch6, "watchOS 6.1.2"),
      c(U.watch612Security, "Released January 28, 2020"),
    ],
    boundary:
      "The version-specific advisory is the substantive first-party record, covering document, audio, file, image, graphics, USB, kernel, XML, interprocess communication, and Wi-Fi components. No undocumented change is inferred.",
    boundaryCitations: [
      c(
        U.watch612Security,
        "AnnotationKit; Audio; files; ImageIO; IOAcceleratorFamily; IOUSBDeviceFamily; Kernel; libxml2; libxpc; wifivelocityd",
      ),
      c(U.watch6, "watchOS 6.1.2"),
    ],
    pageCitations: [
      c(U.watch6, "watchOS 6.1.2"),
      c(U.watch612Security, "Released January 28, 2020"),
    ],
    summary:
      "watchOS 6.1.2 reached the public channel on January 28, 2020 as a security-only consumer update with repairs spanning parsers, file access, graphics, USB, the kernel, and system services.",
    publicText:
      "Apple released watchOS 6.1.2 on January 28, 2020. The consumer update page characterizes it as an important security update recommended for all users and does not enumerate a user-facing feature.",
    publicCitations: [
      c(U.watch6, "watchOS 6.1.2"),
      c(U.watch612Security, "Released January 28, 2020"),
    ],
    scopeText:
      "The advisory documents the release's concrete changes across multiple privileged and parsing surfaces. Because Apple publishes no broader consumer list, this entry contains one structured security occurrence and no speculative maintenance detail.",
    scopeCitations: [
      c(
        U.watch612Security,
        "AnnotationKit; Audio; files; ImageIO; IOAcceleratorFamily; IOUSBDeviceFamily; Kernel; libxml2; libxpc; wifivelocityd",
      ),
      c(U.watch6, "watchOS 6.1.2"),
    ],
    changes: [
      securityChange({
        key: "watchos-6-1-2-security-repairs",
        title: "watchOS 6.1.2 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in document and media parsing, file access, graphics and USB drivers, the kernel, XML, IPC, and Wi-Fi services.",
        summary:
          "Apple's advisory records fixes across AnnotationKit, Audio, files, ImageIO, IOAcceleratorFamily, IOUSBDeviceFamily, the kernel, libxml2, libxpc, and wifivelocityd.",
        url: U.watch612Security,
        locator:
          "AnnotationKit; Audio; files; ImageIO; IOAcceleratorFamily; IOUSBDeviceFamily; Kernel; libxml2; libxpc; wifivelocityd",
      }),
    ],
  }),
  release({
    id: "version-watchos-6-2",
    releaseNotesUrl: U.watch6,
    overview:
      "watchOS 6.2 was released on March 24, 2020 with in-app purchases for watch apps, a music connectivity correction, ECG and irregular-rhythm expansion to three countries, and security fixes.",
    overviewCitations: [
      c(U.watch6, "watchOS 6.2"),
      c(U.watch62Security, "Released March 24, 2020"),
    ],
    boundary:
      "Regional health features remain subject to compatible hardware and local availability. The security advisory adds documented repairs across sandboxing, entitlements, privacy, image handling, the kernel, messages, and WebKit; no undocumented claims are added.",
    boundaryCitations: [
      c(U.watch6, "watchOS 6.2"),
      c(
        U.watch62Security,
        "Accounts; ActionKit; AppleMobileFileIntegrity; Icons; Image Processing; Kernel; Messages; Sandbox; WebKit",
      ),
    ],
    pageCitations: [
      c(U.watch6, "watchOS 6.2"),
      c(U.watch62Security, "Released March 24, 2020"),
    ],
    summary:
      "watchOS 6.2 reached the public channel on March 24, 2020 with watch-app purchases, a playback fix, expanded regulated heart features, and a version-specific security repair set.",
    publicText:
      "Apple released watchOS 6.2 on March 24, 2020. Its consumer notes identify four changes spanning watch-app commerce, connectivity-related music playback, and ECG and irregular-rhythm availability.",
    publicCitations: [
      c(U.watch6, "watchOS 6.2"),
      c(U.watch62Security, "Released March 24, 2020"),
    ],
    scopeText:
      "The matching advisory documents additional security work in accounts, private frameworks, entitlements, image processing, the kernel, messaging, Sandbox, and WebKit. The archive does not project later 6.2 point-release changes backward.",
    scopeCitations: [
      c(U.watch6, "watchOS 6.2 through watchOS 6.2.9"),
      c(
        U.watch62Security,
        "Accounts; ActionKit; AppleMobileFileIntegrity; Image Processing; Kernel; Messages; Sandbox; WebKit",
      ),
    ],
    changes: [
      change({
        key: "watchos-6-2-in-app-purchases",
        title: "In-app purchases for Apple Watch apps",
        canonicalSummary:
          "Apple Watch apps can offer purchases from within the watch app experience.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 6.2 expanded standalone watch-app commerce by enabling supported in-app transactions.",
        citations: [c(U.watch6, "watchOS 6.2 — in-app purchases")],
      }),
      change({
        key: "watchos-6-2-wifi-bluetooth-playback-fix",
        title: "Wi-Fi to Bluetooth music-playback correction",
        canonicalSummary:
          "The update corrected music playback that could pause when connectivity changed from Wi-Fi to Bluetooth.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple repaired a handoff-related playback interruption triggered by switching the watch's active connection type.",
        citations: [c(U.watch6, "watchOS 6.2 — music playback fix")],
      }),
      change({
        key: "watchos-6-2-ecg-chile-new-zealand-turkiye",
        title: "ECG availability in Chile, New Zealand, and Türkiye",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in Chile, New Zealand, and Türkiye.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple expanded the regulated ECG app to compatible watches in three additional markets.",
        citations: [c(U.watch6, "watchOS 6.2 — ECG app availability")],
      }),
      change({
        key: "watchos-6-2-irregular-rhythm-chile-new-zealand-turkiye",
        title:
          "Irregular-rhythm notifications in Chile, New Zealand, and Türkiye",
        canonicalSummary:
          "Irregular-rhythm notifications became available in Chile, New Zealand, and Türkiye.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The update extended irregular-rhythm notification support to the same three markets.",
        citations: [
          c(U.watch6, "watchOS 6.2 — irregular heart rhythm notifications"),
        ],
      }),
      securityChange({
        key: "watchos-6-2-security-repairs",
        title: "watchOS 6.2 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving sandboxing, entitlements, permissions, images, input, the kernel, XML, messages, and web content.",
        summary:
          "Apple's advisory documents fixes across Accounts, ActionKit, AppleMobileFileIntegrity, CoreFoundation, Icons, Image Processing, IOHIDFamily, the kernel, libxml2, Messages, Sandbox, and WebKit.",
        url: U.watch62Security,
        locator:
          "Accounts; ActionKit; AppleMobileFileIntegrity; CoreFoundation; Icons; Image Processing; IOHIDFamily; Kernel; libxml2; Messages; Sandbox; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-7-0",
    releaseNotesUrl: U.watch7,
    overview:
      "watchOS 7.0 launched publicly on September 16, 2020 with shareable watch faces, sleep tracking, handwashing detection, Family Setup, new fitness and health tools, richer communication and navigation, and a broad security baseline.",
    overviewCitations: [
      c(U.watch7Availability, "watchOS 7 available September 16"),
      c(U.watch7, "watchOS 7"),
      c(U.watch7Security, "Released September 16, 2020"),
    ],
    boundary:
      "The page attributes only features Apple lists under the watchOS 7 launch section. Changes first documented in 7.0.1 or later are not moved into 7.0, and regional or hardware restrictions remain part of each claim.",
    boundaryCitations: [
      c(U.watch7, "watchOS 7 through watchOS 7.2"),
      c(U.watch7Security, "watchOS 7.0 security content"),
    ],
    pageCitations: [
      c(U.watch7Availability, "Pricing and Availability — watchOS 7"),
      c(U.watch7, "watchOS 7"),
      c(U.watch7Security, "Released September 16, 2020"),
    ],
    summary:
      "watchOS 7.0 reached the public channel on September 16, 2020 with face sharing, sleep and handwashing tools, Family Setup, fitness, health, communication, navigation, and security changes.",
    publicText:
      "Apple made watchOS 7 available on September 16, 2020 for Apple Watch Series 3 and later paired with a compatible iPhone. The launch notes span personalization, health, family use, fitness, communication, navigation, and system utilities.",
    publicCitations: [
      c(U.watch7Availability, "watchOS 7 available September 16"),
      c(U.watch7, "watchOS 7"),
      c(U.watch7Security, "Released September 16, 2020"),
    ],
    scopeText:
      "The structured occurrences below group related launch-note bullets without copying Apple's prose. The security occurrence summarizes the version-specific advisory; later point-release fixes and unsupported undocumented observations are excluded.",
    scopeCitations: [
      c(
        U.watch7,
        "Watch Faces; Sleep; Handwashing; Family Setup; Memoji; Maps; Siri; Other features and improvements",
      ),
      c(U.watch7Security, "watchOS 7.0 security content"),
    ],
    changes: [
      change({
        key: "watchos-7-faces-sharing-discovery",
        title: "New faces, face sharing, and discovery",
        canonicalSummary:
          "watchOS 7 added multiple faces and complications and let users share and discover configured faces through messages, links, apps, and the web.",
        category: "enhancement",
        action: "changed",
        summary:
          "The launch expanded face design choices and turned configured faces into portable items that could be shared or installed from curated sources.",
        citations: [c(U.watch7, "watchOS 7 — Watch Faces")],
      }),
      change({
        key: "watchos-7-sleep-tracking",
        title: "Sleep tracking and schedules",
        canonicalSummary:
          "A Sleep app tracks sleep and wake states, supports goals and schedules, reduces bedtime distractions, and provides charging reminders.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 7 introduced an overnight workflow for setting sleep goals, preparing for bed, detecting sleep, waking, and monitoring charging readiness.",
        citations: [c(U.watch7, "watchOS 7 — Sleep")],
      }),
      change({
        key: "watchos-7-handwashing-detection",
        title: "Automatic handwashing detection",
        canonicalSummary:
          "Supported watches can detect handwashing, run a 20-second timer, prompt the wearer to continue, and optionally remind them after arriving home.",
        category: "feature",
        action: "introduced",
        summary:
          "Motion and microphone signals were combined to recognize washing activity and encourage the recommended duration, with history visible in Health.",
        citations: [c(U.watch7, "watchOS 7 — Handwashing")],
      }),
      change({
        key: "watchos-7-family-setup-schooltime",
        title: "Family Setup and Schooltime",
        canonicalSummary:
          "A compatible iPhone can configure cellular watches for family members without their own iPhone, with communication, activity, location, and Schooltime controls.",
        category: "feature",
        action: "introduced",
        summary:
          "Family Setup extended Apple Watch to supported dependents while giving organizers tools for contacts, schedules, location notices, activity, and restricted school hours.",
        citations: [
          c(U.watch7, "watchOS 7 — Family Setup"),
          c(U.watch7Availability, "Family Setup requirements and availability"),
        ],
      }),
      change({
        key: "watchos-7-memoji-app-face",
        title: "Memoji app and watch face",
        canonicalSummary:
          "Apple Watch gained a Memoji editor, new customization choices, sticker messaging, and a Memoji watch face.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought Memoji creation and editing to the wrist and integrated the results into Messages and face personalization.",
        citations: [c(U.watch7, "watchOS 7 — Memoji")],
      }),
      change({
        key: "watchos-7-maps-cycling-directions",
        title: "Cycling directions in Maps",
        canonicalSummary:
          "Maps added supported bicycle routes that account for bike infrastructure, elevation, street conditions, and useful stops.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 7 introduced wrist-based cycling navigation in selected cities, including route context tailored to riders.",
        citations: [c(U.watch7, "watchOS 7 — Maps")],
      }),
      change({
        key: "watchos-7-siri-translation-dictation",
        title: "Siri translation, on-device dictation, and announcements",
        canonicalSummary:
          "Siri added phrase translation, supported on-device dictation, and Announce Messages on compatible configurations.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update expanded wrist-based language help and message access while moving supported dictation processing onto the watch.",
        citations: [c(U.watch7, "watchOS 7 — Siri")],
      }),
      change({
        key: "watchos-7-workouts-activity-goals",
        title: "New workouts and adjustable Activity goals",
        canonicalSummary:
          "Workout added Dance, Functional Strength Training, Core Training, and Cooldown algorithms, while Activity goals became separately adjustable.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 7 broadened movement tracking and let users customize exercise and stand or roll targets in addition to the Move goal.",
        citations: [c(U.watch7, "watchOS 7 — Other features and improvements")],
      }),
      change({
        key: "watchos-7-health-mobility-ecg-regions",
        title: "Health metrics and heart-feature availability",
        canonicalSummary:
          "Health gained new mobility measurements and a checklist, while ECG and irregular-rhythm notifications expanded to six additional regions.",
        category: "enhancement",
        action: "changed",
        summary:
          "The launch added low-range cardio and mobility context in Health, centralized safety setup, and broadened regulated heart-feature access.",
        citations: [c(U.watch7, "watchOS 7 — Other features and improvements")],
      }),
      change({
        key: "watchos-7-messages-shortcuts",
        title: "Messages threads and Shortcuts",
        canonicalSummary:
          "Messages added group conversations and inline replies, while a Shortcuts app and face complication exposed existing automations.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 7 made group communication easier to follow and provided direct wrist access to supported personal automations.",
        citations: [c(U.watch7, "watchOS 7 — Other features and improvements")],
      }),
      change({
        key: "watchos-7-wallet-media-utilities",
        title: "Wallet, media, and utility updates",
        canonicalSummary:
          "The launch added compatible digital car keys, redesigned Wallet, media search and download views, and more Always On interactions.",
        category: "enhancement",
        action: "changed",
        summary:
          "Related system updates expanded what users could access without waking the display and improved management of keys, audio, weather, and time information.",
        citations: [c(U.watch7, "watchOS 7 — Other features and improvements")],
      }),
      securityChange({
        key: "watchos-7-0-security-repairs",
        title: "watchOS 7.0 security repairs",
        canonicalSummary:
          "The launch repaired vulnerabilities in media and font parsing, drivers, HomeKit, the kernel, privacy boundaries, databases, and web content.",
        summary:
          "Apple's advisory documents fixes across Audio, CoreAudio, CoreCapture, CoreText, Disk Images, FontParser, HomeKit, ImageIO, the kernel, Sandbox, SQLite, and WebKit.",
        url: U.watch7Security,
        locator:
          "Audio; CoreAudio; CoreCapture; CoreText; Disk Images; FontParser; HomeKit; ImageIO; Kernel; Sandbox; SQLite; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-7-1",
    releaseNotesUrl: U.watch7,
    overview:
      "watchOS 7.1 was released on November 5, 2020 with headphone-level warnings, ECG and irregular-rhythm availability in South Korea and Russia, two user-facing fixes, and security repairs.",
    overviewCitations: [
      c(U.watch7, "watchOS 7.1"),
      c(U.watch71Security, "Released November 5, 2020"),
    ],
    boundary:
      "The security advisory adds fixes across audio, font and image processing, privileges, the kernel, XML, logging, WebKit, and XNU. Apple flags reported exploitation for selected font and kernel issues; this page does not infer further undocumented behavior.",
    boundaryCitations: [
      c(
        U.watch71Security,
        "Audio; FontParser; ImageIO; Kernel; libxml2; Logging; WebKit; XNU",
      ),
      c(U.watch7, "watchOS 7.1"),
    ],
    pageCitations: [
      c(U.watch7, "watchOS 7.1"),
      c(U.watch71Security, "Released November 5, 2020"),
    ],
    summary:
      "watchOS 7.1 reached the public channel on November 5, 2020 with hearing notifications, regional heart-feature support, Mac-unlock and display corrections, and security repairs.",
    publicText:
      "Apple released watchOS 7.1 on November 5, 2020. Its consumer notes identify five discrete changes involving hearing exposure, ECG and irregular-rhythm regions, Auto Unlock, and the Series 6 display.",
    publicCitations: [
      c(U.watch7, "watchOS 7.1"),
      c(U.watch71Security, "Released November 5, 2020"),
    ],
    scopeText:
      "The companion advisory supplies the broader security record and notes exploit reports for some repaired vulnerabilities. The archive keeps those documented security facts separate from the consumer feature and fix list.",
    scopeCitations: [
      c(U.watch7, "watchOS 7.1"),
      c(U.watch71Security, "FontParser; Kernel; security content"),
    ],
    changes: [
      change({
        key: "watchos-7-1-headphone-audio-level-notifications",
        title: "Headphone audio-level notifications",
        canonicalSummary:
          "Apple Watch can notify the wearer when headphone listening levels may affect hearing.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 7.1 added a hearing-health warning based on potentially harmful headphone audio exposure.",
        citations: [c(U.watch7, "watchOS 7.1 — headphone audio level")],
      }),
      change({
        key: "watchos-7-1-ecg-korea-russia",
        title: "ECG availability in South Korea and Russia",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in the Republic of Korea and Russia.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple expanded regulated ECG support to compatible watches in South Korea and Russia.",
        citations: [c(U.watch7, "watchOS 7.1 — ECG app availability")],
      }),
      change({
        key: "watchos-7-1-irregular-rhythm-korea-russia",
        title: "Irregular-rhythm notifications in South Korea and Russia",
        canonicalSummary:
          "Irregular-rhythm notifications became available in the Republic of Korea and Russia.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release extended irregular-rhythm notification support to the same two countries.",
        citations: [
          c(U.watch7, "watchOS 7.1 — irregular heart rhythm notifications"),
        ],
      }),
      change({
        key: "watchos-7-1-mac-auto-unlock-fix",
        title: "Mac Auto Unlock correction",
        canonicalSummary:
          "The update corrected a condition that prevented some users from unlocking a Mac with Apple Watch.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple repaired an interoperability failure in the watch-assisted Mac unlock workflow.",
        citations: [c(U.watch7, "watchOS 7.1 — unlock Mac fix")],
      }),
      change({
        key: "watchos-7-1-series-6-wrist-raise-fix",
        title: "Series 6 wrist-raise display correction",
        canonicalSummary:
          "The release corrected a dark screen on wrist raise for some Apple Watch Series 6 users.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple addressed a display-wake failure affecting a subset of Series 6 watches.",
        citations: [c(U.watch7, "watchOS 7.1 — wrist raise fix")],
      }),
      securityChange({
        key: "watchos-7-1-security-repairs",
        title: "watchOS 7.1 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in audio, font and image parsing, crash and file handling, drivers, the kernel, logging, XML, WebKit, and XNU.",
        summary:
          "Apple's advisory records a broad repair set and says exploit reports existed for selected FontParser and kernel vulnerabilities.",
        url: U.watch71Security,
        locator:
          "Audio; CoreAudio; FontParser; Foundation; ImageIO; IOAcceleratorFamily; Kernel; libxml2; Logging; WebKit; XNU",
      }),
    ],
  }),
  release({
    id: "version-watchos-7-2",
    releaseNotesUrl: U.watch7,
    overview:
      "watchOS 7.2 was released on December 14, 2020 with Apple Fitness+, low-cardio-fitness health tools, expanded ECG behavior and availability, braille support, additional Family Setup regions, performance work, and security repairs.",
    overviewCitations: [
      c(U.watch7, "watchOS 7.2"),
      c(U.watch72Security, "Released December 14, 2020"),
    ],
    boundary:
      "Fitness+ and regulated health features were region-dependent, and some features required supported watch models. The archive records those qualifications and uses Apple's advisory for the separate security occurrence.",
    boundaryCitations: [
      c(U.watch7, "watchOS 7.2 — availability qualifications"),
      c(U.watch72Security, "watchOS 7.2 security content"),
    ],
    pageCitations: [
      c(U.watch7, "watchOS 7.2"),
      c(U.watch72Security, "Released December 14, 2020"),
    ],
    summary:
      "watchOS 7.2 reached the public channel on December 14, 2020 with Fitness+, cardio-fitness tools, ECG changes, braille and Family Setup expansion, performance work, and security repairs.",
    publicText:
      "Apple released watchOS 7.2 on December 14, 2020. The update's consumer record centers on Fitness+, cardio-fitness notifications and review, ECG behavior and regional support, braille displays, and Family Setup expansion.",
    publicCitations: [
      c(U.watch7, "watchOS 7.2"),
      c(U.watch72Security, "Released December 14, 2020"),
    ],
    scopeText:
      "Apple also identifies performance improvements and publishes a security advisory covering audio, fonts, images, authentication policy, WebRTC, and Wi-Fi. No later or undocumented changes are attributed to this event.",
    scopeCitations: [
      c(U.watch7, "watchOS 7.2 — performance improvements"),
      c(
        U.watch72Security,
        "Audio; CoreAudio; FontParser; ImageIO; Security; WebRTC; Wi-Fi",
      ),
    ],
    changes: [
      change({
        key: "watchos-7-2-apple-fitness-plus",
        title: "Apple Fitness+",
        canonicalSummary:
          "Apple Watch powers a subscription workout experience with metrics displayed alongside studio-style sessions on supported Apple devices.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 7.2 launched Fitness+ across ten workout categories in its initial six supported countries.",
        citations: [c(U.watch7, "watchOS 7.2 — Apple Fitness+")],
      }),
      change({
        key: "watchos-7-2-low-cardio-fitness",
        title: "Low cardio-fitness notifications and review",
        canonicalSummary:
          "Apple Watch can notify users about low cardio fitness and Health can contextualize the level by age and sex.",
        category: "feature",
        action: "introduced",
        summary:
          "The update expanded cardio-fitness monitoring beyond high-performance ranges and exposed contextual review in the iPhone Health app.",
        citations: [c(U.watch7, "watchOS 7.2 — cardio fitness notifications")],
      }),
      change({
        key: "watchos-7-2-ecg-high-heart-rate-classification",
        title: "ECG classification above 100 BPM",
        canonicalSummary:
          "The ECG app can classify atrial fibrillation at heart rates above 100 beats per minute in most supported regions.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple broadened the heart-rate range in which the ECG app could return an atrial-fibrillation classification.",
        citations: [c(U.watch7, "watchOS 7.2 — ECG classification")],
      }),
      change({
        key: "watchos-7-2-ecg-taiwan",
        title: "ECG availability in Taiwan",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in Taiwan.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 7.2 expanded regulated ECG app availability to Taiwan.",
        citations: [c(U.watch7, "watchOS 7.2 — ECG app in Taiwan")],
      }),
      change({
        key: "watchos-7-2-braille-display-support",
        title: "Braille display support with VoiceOver",
        canonicalSummary:
          "VoiceOver gained support for compatible braille displays.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release expanded Apple Watch accessibility by enabling supported external braille-display use with VoiceOver.",
        citations: [c(U.watch7, "watchOS 7.2 — braille displays")],
      }),
      change({
        key: "watchos-7-2-family-setup-regions",
        title: "Family Setup in four additional countries",
        canonicalSummary:
          "Family Setup expanded to Bahrain, Canada, Norway, and Spain on supported cellular watches.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple broadened Family Setup availability to four additional markets, retaining its cellular model requirements.",
        citations: [c(U.watch7, "watchOS 7.2 — Family Setup")],
      }),
      change({
        key: "watchos-7-2-performance-improvements",
        title: "Performance improvements",
        canonicalSummary:
          "The update includes additional performance improvements beyond its named features.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple's consumer record identifies a general performance component without publishing a more granular breakdown.",
        citations: [c(U.watch7, "watchOS 7.2 — performance improvements")],
      }),
      securityChange({
        key: "watchos-7-2-security-repairs",
        title: "watchOS 7.2 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in audio, font and image parsing, authentication policy, real-time communications, and Wi-Fi.",
        summary:
          "Apple's advisory documents fixes across Audio, CoreAudio, FontParser, ImageIO, Security, WebRTC, and Wi-Fi.",
        url: U.watch72Security,
        locator:
          "Audio; CoreAudio; FontParser; ImageIO; Security; WebRTC; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-tvos-13-3-1",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 13.3.1 was released on January 28, 2020. Apple's consumer update history describes only general performance and stability work, while the version-specific advisory supplies the detailed security record.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 13.3.1"),
      c(U.tv1331Security, "Released January 28, 2020"),
    ],
    boundary:
      "Apple names no individual consumer feature or ordinary fix for this version. The archive therefore records the published maintenance description and security surfaces without inventing a more granular change list.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 13.3.1"),
      c(
        U.tv1331Security,
        "Audio; files; ImageIO; Kernel; libxml2; libxpc; WebKit; wifivelocityd",
      ),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 13.3.1"),
      c(U.tv1331Security, "Released January 28, 2020"),
    ],
    summary:
      "tvOS 13.3.1 reached the public channel on January 28, 2020 as a general performance and stability update with security repairs across media, files, drivers, the kernel, services, and WebKit.",
    publicText:
      "Apple released tvOS 13.3.1 on January 28, 2020. The cumulative consumer page identifies general performance and stability improvements but provides no named feature or narrower maintenance item.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 13.3.1"),
      c(U.tv1331Security, "Released January 28, 2020"),
    ],
    scopeText:
      "The security advisory is the detailed first-party source, documenting repairs across audio, files, image processing, graphics and USB drivers, the kernel, XML, IPC, web content, and Wi-Fi services.",
    scopeCitations: [
      c(
        U.tv1331Security,
        "Audio; files; ImageIO; IOAcceleratorFamily; IOUSBDeviceFamily; Kernel; libxml2; libxpc; WebKit; wifivelocityd",
      ),
      c(U.tvUpdates, "tvOS 13.3.1"),
    ],
    changes: [
      change({
        key: "tvos-13-3-1-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple's consumer notes do not provide a more granular performance or stability breakdown for tvOS 13.3.1.",
        citations: [c(U.tvUpdates, "tvOS 13.3.1")],
      }),
      securityChange({
        key: "tvos-13-3-1-security-repairs",
        title: "tvOS 13.3.1 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in audio and image parsing, file access, graphics and USB drivers, the kernel, XML, IPC, WebKit, and Wi-Fi services.",
        summary:
          "Apple's advisory records fixes across Audio, files, ImageIO, IOAcceleratorFamily, IOUSBDeviceFamily, the kernel, libxml2, libxpc, WebKit, and wifivelocityd.",
        url: U.tv1331Security,
        locator:
          "Audio; files; ImageIO; IOAcceleratorFamily; IOUSBDeviceFamily; Kernel; libxml2; libxpc; WebKit; wifivelocityd",
      }),
    ],
  }),
  release({
    id: "version-tvos-13-4",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 13.4 was released on March 24, 2020. Apple's consumer page lists general performance and stability improvements, and its security advisory documents the version's specific system repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 13.4"),
      c(U.tv134Security, "Released March 24, 2020"),
    ],
    boundary:
      "No named consumer-facing feature appears in Apple's 13.4 section. This page preserves that limitation and does not substitute beta notes, community observations, or later 13.4 point-release behavior.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 13.4 through tvOS 13.4.8"),
      c(U.tv134Security, "tvOS 13.4 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 13.4"),
      c(U.tv134Security, "Released March 24, 2020"),
    ],
    summary:
      "tvOS 13.4 reached the public channel on March 24, 2020 as a general performance and stability update with security work across sandboxing, permissions, parsers, the kernel, messaging, and WebKit.",
    publicText:
      "Apple released tvOS 13.4 on March 24, 2020. The consumer update history offers only a general performance and stability description for the public version.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 13.4"),
      c(U.tv134Security, "Released March 24, 2020"),
    ],
    scopeText:
      "Apple's advisory supplies the substantive technical record, including repairs to sandbox and entitlement boundaries, image and input processing, the kernel, XML, messages, and WebKit. No undocumented claim is added.",
    scopeCitations: [
      c(
        U.tv134Security,
        "Accounts; ActionKit; AppleMobileFileIntegrity; CoreFoundation; Icons; Image Processing; IOHIDFamily; Kernel; libxml2; Messages; Sandbox; WebKit",
      ),
      c(U.tvUpdates, "tvOS 13.4"),
    ],
    changes: [
      change({
        key: "tvos-13-4-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple publishes no narrower consumer feature or ordinary-fix description for tvOS 13.4.",
        citations: [c(U.tvUpdates, "tvOS 13.4")],
      }),
      securityChange({
        key: "tvos-13-4-security-repairs",
        title: "tvOS 13.4 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving sandboxing, entitlements, permissions, images, input, the kernel, XML, messages, and web content.",
        summary:
          "Apple's advisory documents fixes across Accounts, ActionKit, AppleMobileFileIntegrity, CoreFoundation, Icons, Image Processing, IOHIDFamily, the kernel, libxml2, Messages, Sandbox, and WebKit.",
        url: U.tv134Security,
        locator:
          "Accounts; ActionKit; AppleMobileFileIntegrity; CoreFoundation; Icons; Image Processing; IOHIDFamily; Kernel; libxml2; Messages; Sandbox; WebKit",
      }),
    ],
  }),
  release({
    id: "version-tvos-13-4-5",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "The existing local tvOS 13.4.5 record has an audited public appearance dated May 20, 2020. Apple's cumulative consumer page confirms the version but gives no date, while Apple's security advisory labels tvOS 13.4.5 as released May 26, creating an unresolved six-day source conflict.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 13.4.5"),
      c(
        U.tv1345Security,
        "tvOS 13.4.5 — Released May 26, 2020",
        "Conflicts with the existing local public milestone dated May 20, 2020.",
      ),
    ],
    boundary:
      "This bundle preserves the audited local route and event target instead of rewriting chronology. It explicitly records the first-party date disagreement, uses Apple's advisory for the security content, and makes no claim that resolves which date should be canonical.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 13.4.5"),
      c(
        U.tv1345Security,
        "Released May 26, 2020",
        "The local audited milestone remains May 20, 2020 pending a separate chronology correction.",
      ),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 13.4.5"),
      c(
        U.tv1345Security,
        "Released May 26, 2020",
        "Date conflict disclosed; no local chronology mutation.",
      ),
    ],
    summary:
      "The existing tvOS 13.4.5 public route is locally dated May 20, 2020, while Apple's security advisory says May 26; the release contains general maintenance and documented security repairs.",
    publicText:
      "The local timeline treats May 20, 2020 as tvOS 13.4.5's public appearance. Apple's undated cumulative update section confirms the version and says it contained general performance and stability work, but the security advisory assigns a May 26 release date.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 13.4.5"),
      c(
        U.tv1345Security,
        "Released May 26, 2020",
        "First-party date differs from the local public milestone.",
      ),
    ],
    scopeText:
      "The discrepancy remains an explicit editorial issue rather than being silently reconciled. Apple's advisory still supports the structured security occurrence across accounts, privileges, media and font parsing, the kernel, networking, files, databases, and WebKit.",
    scopeCitations: [
      c(
        U.tv1345Security,
        "Accounts; AppleMobileFileIntegrity; Audio; CoreText; FontParser; ImageIO; IPSec; Kernel; libxpc; rsync; Security; SQLite; WebKit; WebRTC",
      ),
      c(U.tvUpdates, "tvOS 13.4.5"),
    ],
    changes: [
      change({
        key: "tvos-13-4-5-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple provides no more specific consumer-facing breakdown for tvOS 13.4.5; the separate date conflict is retained in page provenance.",
        citations: [c(U.tvUpdates, "tvOS 13.4.5")],
      }),
      securityChange({
        key: "tvos-13-4-5-security-repairs",
        title: "tvOS 13.4.5 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across accounts, privileges, audio, fonts and images, networking, the kernel, files, databases, and web components.",
        summary:
          "Apple's advisory documents fixes across Accounts, AppleMobileFileIntegrity, Audio, CoreText, FontParser, ImageIO, IPSec, the kernel, libxpc, rsync, Security, SQLite, System Preferences, WebKit, and WebRTC.",
        url: U.tv1345Security,
        locator:
          "Accounts; AppleMobileFileIntegrity; Audio; CoreText; FontParser; ImageIO; IPSec; Kernel; libxpc; rsync; Security; SQLite; System Preferences; WebKit; WebRTC",
      }),
    ],
  }),
  release({
    id: "version-tvos-14-0",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 14.0 launched publicly on September 16, 2020 with shared wireless audio, broader Picture in Picture, Home camera and doorbell integration, per-user gaming, controller customization, screen-saver controls, 4K AirPlay, and security repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14"),
      c(U.tv14Security, "Released September 16, 2020"),
    ],
    boundary:
      "Apple's cumulative page labels the launch section tvOS 14 while the existing route uses 14.0. Later 14.x features such as HomePod home theater and Fitness+ are not projected backward into the launch.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 14 through tvOS 14.3"),
      c(U.tv14Security, "tvOS 14.0 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 14"),
      c(U.tv14Security, "Released September 16, 2020"),
    ],
    summary:
      "tvOS 14.0 reached the public channel on September 16, 2020 with shared audio, Picture in Picture, Home integration, multiuser gaming, controller, aerial, AirPlay, and security changes.",
    publicText:
      "Apple released tvOS 14.0 on September 16, 2020. Its launch notes cover private shared listening, video multitasking, smart-home views, individualized gaming, expanded controllers, aerial controls, and higher-resolution photo streaming.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 14"),
      c(U.tv14Security, "Released September 16, 2020"),
    ],
    scopeText:
      "The version-specific advisory adds the security baseline across media, fonts and images, system boundaries, the kernel, databases, WebKit, and Wi-Fi. This article stays within the launch section and does not infer undocumented changes.",
    scopeCitations: [
      c(
        U.tv14Security,
        "Assets; Audio; CoreAudio; FontParser; HomeKit; ImageIO; Kernel; Sandbox; SQLite; WebKit; Wi-Fi",
      ),
      c(U.tvUpdates, "tvOS 14 through tvOS 14.3"),
    ],
    changes: [
      change({
        key: "tvos-14-shared-audio",
        title: "Shared wireless audio",
        canonicalSummary:
          "Apple TV 4K can send audio to two compatible AirPods or Beats sets with separate volume controls.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 14 enabled two listeners to use supported wireless headphones during the same viewing session without using room speakers.",
        citations: [c(U.tvUpdates, "tvOS 14 — Share audio")],
      }),
      change({
        key: "tvos-14-picture-in-picture-apps",
        title: "Broader Picture in Picture",
        canonicalSummary:
          "Supported third-party apps can continue video in a movable Picture in Picture window over other Apple TV activity.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded video multitasking beyond Apple's own playback surfaces to compatible outside apps.",
        citations: [c(U.tvUpdates, "tvOS 14 — Picture in Picture")],
      }),
      change({
        key: "tvos-14-home-doorbells-cameras",
        title: "Home doorbell, camera, and scene controls",
        canonicalSummary:
          "Apple TV can show compatible doorbell notifications and camera feeds and expose Home scenes through Control Center.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 14 brought more smart-home context onto the television, including visitor views and direct Home control.",
        citations: [c(U.tvUpdates, "tvOS 14 — Home")],
      }),
      change({
        key: "tvos-14-multiuser-gaming",
        title: "Multiuser gaming",
        canonicalSummary:
          "Switching users can expose each person's Apple Arcade progress, achievements, friends, and Continue Playing list.",
        category: "feature",
        action: "introduced",
        summary:
          "The update extended multiuser profiles into games so household members could resume their own Arcade state.",
        citations: [c(U.tvUpdates, "tvOS 14 — Multiuser for gaming")],
      }),
      change({
        key: "tvos-14-controller-expansion-mapping",
        title: "Expanded game controllers and button mapping",
        canonicalSummary:
          "Apple TV added support for Xbox Elite Series 2 and Xbox Adaptive controllers and allowed custom controller mappings.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 14 broadened supported gaming hardware and let users remap controls from Settings.",
        citations: [c(U.tvUpdates, "tvOS 14 — Game controllers")],
      }),
      change({
        key: "tvos-14-aerial-category-controls",
        title: "Aerial screen-saver category controls",
        canonicalSummary:
          "Users can choose which space, aerial, and underwater location categories participate in screen-saver rotation.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release added preference controls over the kinds of Aerial scenes Apple TV cycles through.",
        citations: [c(U.tvUpdates, "tvOS 14 — Screen savers")],
      }),
      change({
        key: "tvos-14-airplay-photos-4k",
        title: "4K Photos streaming over AirPlay",
        canonicalSummary:
          "Supported iPhone Photos content can stream over AirPlay to Apple TV 4K at 4K resolution.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 14 increased the supported resolution for compatible photo and video sharing from iPhone through AirPlay.",
        citations: [c(U.tvUpdates, "tvOS 14 — AirPlay")],
      }),
      securityChange({
        key: "tvos-14-0-security-repairs",
        title: "tvOS 14.0 security repairs",
        canonicalSummary:
          "The launch repaired vulnerabilities in media and font parsing, trusted assets, HomeKit, the kernel, privacy boundaries, databases, web content, and Wi-Fi.",
        summary:
          "Apple's advisory documents fixes across Assets, Audio, CoreAudio, CoreText, Disk Images, FontParser, HomeKit, ImageIO, the kernel, Sandbox, SQLite, WebKit, and Wi-Fi.",
        url: U.tv14Security,
        locator:
          "Assets; Audio; CoreAudio; CoreText; Disk Images; FontParser; HomeKit; ImageIO; Kernel; Sandbox; SQLite; WebKit; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-tvos-14-2",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 14.2 was released on November 5, 2020 with HomePod home-theater audio, Apple One subscription access, and security repairs across media, fonts, images, privileges, the kernel, XML, and WebKit.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14.2"),
      c(U.tv142Security, "Released November 5, 2020"),
    ],
    boundary:
      "Apple's Apple One note marked Fitness+ as coming later in 2020, so this page records subscription-plan access but does not attribute Fitness+ itself to tvOS 14.2. That feature is assigned to 14.3 in Apple's update history.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 14.2 — Apple One"),
      c(U.tvUpdates, "tvOS 14.3 — Apple Fitness+"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 14.2"),
      c(U.tv142Security, "Released November 5, 2020"),
    ],
    summary:
      "tvOS 14.2 reached the public channel on November 5, 2020 with HomePod home-theater audio, Apple One subscription management, and a version-specific security repair set.",
    publicText:
      "Apple released tvOS 14.2 on November 5, 2020. Its two named consumer additions connected HomePod to Apple TV 4K for home-theater audio and exposed Apple One plans through account subscription settings.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 14.2"),
      c(U.tv142Security, "Released November 5, 2020"),
    ],
    scopeText:
      "The security advisory documents additional repairs in audio, fonts, images, crash and file handling, graphics, the kernel, XML, logging, WebKit, and XNU. Fitness+ remains outside this version's occurrence list.",
    scopeCitations: [
      c(
        U.tv142Security,
        "Audio; CoreAudio; CoreText; FontParser; ImageIO; IOAcceleratorFamily; Kernel; libxml2; Logging; WebKit; XNU",
      ),
      c(U.tvUpdates, "tvOS 14.2; tvOS 14.3"),
    ],
    changes: [
      change({
        key: "tvos-14-2-homepod-home-theater",
        title: "HomePod home-theater audio",
        canonicalSummary:
          "HomePod can pair with Apple TV 4K for stereo, surround, and Dolby Atmos playback, with a second HomePod supporting true stereo.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 14.2 added a persistent home-theater role for original HomePod speakers connected to Apple TV 4K.",
        citations: [c(U.tvUpdates, "tvOS 14.2 — HomePod home theater")],
      }),
      change({
        key: "tvos-14-2-apple-one",
        title: "Apple One subscriptions",
        canonicalSummary:
          "Apple TV account settings can access Apple One bundles and share eligible plans with family members.",
        category: "feature",
        action: "introduced",
        summary:
          "The update integrated Apple's multi-service subscription bundles into the Apple TV account experience.",
        citations: [c(U.tvUpdates, "tvOS 14.2 — Apple One")],
      }),
      securityChange({
        key: "tvos-14-2-security-repairs",
        title: "tvOS 14.2 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in media, font and image parsing, files and privileges, graphics, the kernel, XML, logging, WebKit, and XNU.",
        summary:
          "Apple's advisory records fixes across Audio, CoreAudio, CoreText, Crash Reporter, FontParser, Foundation, ImageIO, IOAcceleratorFamily, the kernel, libxml2, Logging, Model I/O, WebKit, and XNU.",
        url: U.tv142Security,
        locator:
          "Audio; CoreAudio; CoreText; Crash Reporter; FontParser; Foundation; ImageIO; IOAcceleratorFamily; Kernel; libxml2; Logging; Model I/O; WebKit; XNU",
      }),
    ],
  }),
  release({
    id: "version-tvos-14-3",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 14.3 was released on December 14, 2020 with a dedicated Apple TV+ tab, Apple Fitness+, Apple One integration, and security repairs across audio, fonts, images, model processing, web storage, WebRTC, and Wi-Fi.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14.3"),
      c(U.tv143Security, "Released December 14, 2020"),
    ],
    boundary:
      "Apple notes that its TV app, Fitness+, and Apple One availability varied by country or region. The page retains those qualifications and does not import features from later tvOS releases.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 14.3 — availability footnotes"),
      c(U.tv143Security, "tvOS 14.3 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 14.3"),
      c(U.tv143Security, "Released December 14, 2020"),
    ],
    summary:
      "tvOS 14.3 reached the public channel on December 14, 2020 with a dedicated Apple TV+ destination, Apple Fitness+, Apple One access, and version-specific security repairs.",
    publicText:
      "Apple released tvOS 14.3 on December 14, 2020. The consumer notes identify three service-oriented additions: a dedicated Apple TV+ tab, Fitness+ workouts powered by Apple Watch, and Apple One subscription access.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 14.3"),
      c(U.tv143Security, "Released December 14, 2020"),
    ],
    scopeText:
      "The companion advisory documents additional security work in audio, fonts, images, model processing, web storage, WebRTC, and Wi-Fi. Feature availability remained region-dependent, and no undocumented changes are claimed.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 14.3 — availability footnotes"),
      c(
        U.tv143Security,
        "Audio; CoreAudio; FontParser; ImageIO; Model I/O; WebKit Storage; WebRTC; Wi-Fi",
      ),
    ],
    changes: [
      change({
        key: "tvos-14-3-apple-tv-plus-tab",
        title: "Dedicated Apple TV+ tab",
        canonicalSummary:
          "The Apple TV app gained a dedicated tab for discovering and watching Apple Originals.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 14.3 separated Apple TV+ discovery into its own app destination in supported regions.",
        citations: [c(U.tvUpdates, "tvOS 14.3 — Apple TV app")],
      }),
      change({
        key: "tvos-14-3-apple-fitness-plus",
        title: "Apple Fitness+",
        canonicalSummary:
          "Apple TV can present studio-style Fitness+ workouts whose live activity metrics are supplied by Apple Watch.",
        category: "feature",
        action: "introduced",
        summary:
          "The update brought Apple's subscription workout video experience to the largest supported screen, with weekly sessions and Watch integration.",
        citations: [c(U.tvUpdates, "tvOS 14.3 — Apple Fitness+")],
      }),
      change({
        key: "tvos-14-3-apple-one",
        title: "Apple One subscription access",
        canonicalSummary:
          "Apple TV settings can access Apple One bundles that combine eligible Apple services.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 14.3 continued the service-bundle integration and listed Fitness+ among eligible Apple One offerings where available.",
        citations: [c(U.tvUpdates, "tvOS 14.3 — Apple One")],
      }),
      securityChange({
        key: "tvos-14-3-security-repairs",
        title: "tvOS 14.3 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in audio, font and image parsing, model files, web storage, real-time communications, and Wi-Fi.",
        summary:
          "Apple's advisory documents fixes across Audio, CoreAudio, FontParser, ImageIO, Model I/O, WebKit Storage, WebRTC, and Wi-Fi.",
        url: U.tv143Security,
        locator:
          "Audio; CoreAudio; FontParser; ImageIO; Model I/O; WebKit Storage; WebRTC; Wi-Fi",
      }),
    ],
  }),
];

const versions = records.map((item) => item.version);
const events = records.map((item) => item.event);

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions,
  events,
  builds: [],
};

writeFileSync(
  join(here, "apple-other-2020.json"),
  `${JSON.stringify(bundle, null, 2)}\n`,
);

const eventChanges = events.reduce(
  (sum, releaseEvent) => sum + releaseEvent.changes.length,
  0,
);
const platformChangeCount = (platform) =>
  events
    .filter((item) =>
      item.target.releaseVersionId.startsWith(`version-${platform}`),
    )
    .reduce((sum, item) => sum + item.changes.length, 0);

const md = `# Apple 2020 non-iPhone research batch

## Result

\`apple-other-2020.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2020. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 11.0 | 1 | ${platformChangeCount("macos")} |
| watchOS | 6.1.2, 6.2, 7.0, 7.1, 7.2 | 5 | ${platformChangeCount("watchos")} |
| tvOS | 13.3.1, 13.4, 13.4.5, 14.0, 14.2, 14.3 | 6 | ${platformChangeCount("tvos")} |
| **Total** | **12 version articles** | **${events.length}** | **${eventChanges}** |

The 12 versions contain 80 existing local timeline milestones: 12 public appearances and 68 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 12 durable public routes through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 24 version/event records are \`editoriallyVerified\` plus \`approved\` as of ${reviewedAt}.
- All public events are indexable after completed editorial review.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The existing local \`version-macos-11-0\` route represents the November 12, 2020 Big Sur launch. Apple shipped and documents that public release as macOS Big Sur 11.0.1. The route is preserved and the label mismatch is disclosed.
2. The existing local \`version-tvos-13-4-5\` public milestone is dated May 20, 2020. Apple's cumulative update page confirms the version without a date, while its security advisory says tvOS 13.4.5 was released May 26. This bundle preserves the local event target, records the six-day conflict, and does not decide a replacement date.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### macOS

- <${U.macNews}> — dated Big Sur public availability and launch features
- <${U.macDeveloper}> — macOS Big Sur 11.0.1 developer release notes
- <${U.macSecurity}> — detailed Big Sur 11.0.1 security content and release date

### watchOS

- <${U.watch6}> — watchOS 6 consumer update notes
- <${U.watch7}> — watchOS 7 consumer update notes
- <${U.watch7Availability}> — first-party September 16 watchOS 7 availability statement
- <${U.watch612Security}>
- <${U.watch62Security}>
- <${U.watch7Security}>
- <${U.watch71Security}>
- <${U.watch72Security}>

### tvOS

- <${U.tvUpdates}> — Apple TV software-update notes
- <${U.tv1331Security}>
- <${U.tv134Security}>
- <${U.tv1345Security}>
- <${U.tv14Security}>
- <${U.tv142Security}>
- <${U.tv143Security}>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses the explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's consumer notes for tvOS 13.3.1, 13.4, and 13.4.5 enumerate no named feature or ordinary fix beyond general performance and stability work. Their entries retain that limitation and use version-specific security advisories for technical detail.
2. The two label/date discrepancies above remain explicit review issues rather than silent data mutations.
3. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
4. The 68 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
5. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for the release, not proof that every advisory entry appeared on launch day.
6. Apple's Big Sur launch story said App Store privacy summaries were coming later in 2020, so this batch does not attribute that later rollout to the November 12 launch.
7. Apple's tvOS 14.2 note described Fitness+ as coming later in 2020; Fitness+ is therefore assigned to tvOS 14.3, where Apple's update history documents it.

## Validation

- Research-batch validation passed with 12 versions, 12 public events, 65 globally consistent change keys, 18 sources, and 220 citation references for this file.
- Inventory closure passed: 12 eligible local versions, 80 milestones, 12 public appearances, 68 non-public milestones, 18 of 18 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint passed for the deterministic generator.
- Reviewed production plan: 80 creates, 24 revision-guarded patches, and 2,073 unchanged documents.
- Planned creates: 15 source documents, zero version documents, zero event documents, zero build documents, and 65 change documents; the plan includes 12 version patches. Existing durable public events are updated through the revision-guarded patch set.
- Mutation payload: 194,055 bytes, reported as 5.0% of the guarded limit.
- Applied production plan SHA: \`e69686be4478db801c88447d9ece510a9b7ca3b46a7df3ac928d3421fe2bcc71\`.
- Guarded production transaction: \`tt1fSB5HY9GAB0YLyxrMCb\`.
- A post-apply read-only dry-run reported zero residual mutations.
`;

writeFileSync(join(here, "apple-other-2020.md"), md);
