import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";

const U = {
  macNews:
    "https://www.apple.com/newsroom/2018/09/macos-mojave-is-available-today/",
  macDeveloper:
    "https://developer.apple.com/documentation/macos-release-notes/macos-mojave-10_14-release-notes",
  macSecurity: "https://support.apple.com/en-us/103758",
  watch4: "https://support.apple.com/en-us/111739",
  watch5: "https://support.apple.com/en-us/118393",
  watch5Preview:
    "https://www.apple.com/newsroom/2018/06/watchos-5-adds-powerful-activity-and-communications-features-to-apple-watch/",
  watch512News:
    "https://www.apple.com/newsroom/2018/12/ecg-app-and-irregular-heart-rhythm-notification-available-today-on-apple-watch/",
  watch422Security: "https://support.apple.com/en-us/103686",
  watch43Security: "https://support.apple.com/en-us/103079",
  watch431Security: "https://support.apple.com/en-us/103084",
  watch5Security: "https://support.apple.com/en-us/103696",
  watch51Security: "https://support.apple.com/en-us/103812",
  watch512Security: "https://support.apple.com/en-us/103705",
  tvUpdates: "https://support.apple.com/en-us/106336",
  tv1125Security: "https://support.apple.com/en-us/103684",
  tv113Security: "https://support.apple.com/en-us/103081",
  tv114Security: "https://support.apple.com/en-us/103083",
  tv12Security: "https://support.apple.com/en-us/103569",
  tv121Security: "https://support.apple.com/en-us/103561",
  tv1211Security: "https://support.apple.com/en-us/103570",
};

const datedSecuritySources = [
  [
    U.macSecurity,
    "About the security content of macOS Mojave 10.14",
    "2018-09-24",
    ["macOS", "Mojave", "10.14"],
  ],
  [
    U.watch422Security,
    "About the security content of watchOS 4.2.2",
    "2018-01-23",
    ["watchOS", "4.2.2"],
  ],
  [
    U.watch43Security,
    "About the security content of watchOS 4.3",
    "2018-03-29",
    ["watchOS", "4.3"],
  ],
  [
    U.watch431Security,
    "About the security content of watchOS 4.3.1",
    "2018-05-29",
    ["watchOS", "4.3.1"],
  ],
  [
    U.watch5Security,
    "About the security content of watchOS 5",
    "2018-09-17",
    ["watchOS", "5"],
  ],
  [
    U.watch51Security,
    "About the security content of watchOS 5.1",
    "2018-10-30",
    ["watchOS", "5.1"],
  ],
  [
    U.watch512Security,
    "About the security content of watchOS 5.1.2",
    "2018-12-06",
    ["watchOS", "5.1.2"],
  ],
  [
    U.tv1125Security,
    "About the security content of tvOS 11.2.5",
    "2018-01-23",
    ["tvOS", "11.2.5"],
  ],
  [
    U.tv113Security,
    "About the security content of tvOS 11.3",
    "2018-03-29",
    ["tvOS", "11.3"],
  ],
  [
    U.tv114Security,
    "About the security content of tvOS 11.4",
    "2018-05-29",
    ["tvOS", "11.4"],
  ],
  [
    U.tv12Security,
    "About the security content of tvOS 12",
    "2018-09-17",
    ["tvOS", "12"],
  ],
  [
    U.tv121Security,
    "About the security content of tvOS 12.1",
    "2018-10-30",
    ["tvOS", "12.1"],
  ],
  [
    U.tv1211Security,
    "About the security content of tvOS 12.1.1",
    "2018-12-05",
    ["tvOS", "12.1.1"],
  ],
];

const sources = [
  {
    url: U.macNews,
    title: "macOS Mojave is available today",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2018-09-24T00:00:00.000Z",
    topics: ["macOS", "Mojave", "10.14", "availability", "features"],
  },
  {
    url: U.macDeveloper,
    title: "macOS Mojave 10.14 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    topics: ["macOS", "Mojave", "10.14", "developer release notes"],
  },
  {
    url: U.watch4,
    title: "About watchOS 4 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "4", "consumer release notes"],
  },
  {
    url: U.watch5,
    title: "About watchOS 5 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "5", "consumer release notes"],
  },
  {
    url: U.watch5Preview,
    title:
      "watchOS 5 adds powerful activity and communications features to Apple Watch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2018-06-04T00:00:00.000Z",
    topics: ["watchOS", "5", "features", "compatibility"],
  },
  {
    url: U.watch512News,
    title:
      "ECG app and irregular heart rhythm notification available today on Apple Watch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2018-12-06T00:00:00.000Z",
    topics: ["watchOS", "5.1.2", "ECG", "heart rhythm", "availability"],
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
const reviewedAt = "2026-07-30T05:03:57Z";
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
      "Matched Apple's version-specific release notes, availability statement, developer notes, or security advisory to the existing audited public-release event.",
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
    id: "version-macos-10-14",
    releaseNotesUrl: U.macDeveloper,
    overview:
      "macOS Mojave 10.14 launched on September 24, 2018 with Dark Mode, desktop organization, expanded Finder and capture tools, Continuity Camera, four iOS-derived apps, a redesigned Mac App Store, stronger Safari privacy, developer-platform changes, and a broad security baseline.",
    overviewCitations: [
      c(U.macNews, "Update September 24, 2018; Availability"),
      c(U.macDeveloper, "macOS Mojave 10.14 Release Notes"),
      c(U.macSecurity, "Released September 24, 2018"),
    ],
    boundary:
      "Apple's developer notes say Group FaceTime was removed from the initial Mojave release and would arrive later, so it is excluded here. This page covers only the existing 10.14 route and does not project changes from later 10.14 point releases backward.",
    boundaryCitations: [
      c(
        U.macDeveloper,
        "FaceTime and Messages — Group FaceTime removed from initial release",
      ),
      c(U.macSecurity, "macOS Mojave 10.14 security content"),
    ],
    pageCitations: [
      c(U.macNews, "September 24, 2018; Availability"),
      c(U.macDeveloper, "macOS Mojave 10.14 Release Notes"),
      c(U.macSecurity, "Released September 24, 2018"),
    ],
    summary:
      "macOS Mojave 10.14 reached the public channel on September 24, 2018 with interface, desktop, Finder, capture, cross-device, app, store, privacy, developer, compatibility, and security changes.",
    publicText:
      "Apple made macOS Mojave available as a free software update on September 24, 2018. Its launch announcement identifies compatible Macs and presents the release as a combined interface, productivity, app, privacy, and platform update.",
    publicCitations: [
      c(U.macNews, "Update September 24, 2018; Availability"),
      c(U.macSecurity, "Released September 24, 2018"),
    ],
    scopeText:
      "The structured entries synthesize Apple's launch story, developer release notes, and security advisory. They omit Group FaceTime because Apple explicitly deferred it and do not infer undocumented behavior or later point-release changes.",
    scopeCitations: [
      c(U.macNews, "Dark Mode through Additional Features"),
      c(
        U.macDeveloper,
        "FaceTime and Messages; 32-bit Deprecation; Core ML; eGPU; Privacy",
      ),
      c(U.macSecurity, "macOS Mojave 10.14 security content"),
    ],
    changes: [
      change({
        key: "macos-10-14-dark-mode",
        title: "Systemwide Dark Mode",
        canonicalSummary:
          "Mojave introduced a dark system appearance across the desktop and built-in apps, with an interface developers could adopt.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added a user-selectable dark color scheme spanning core Mac apps and exposed matching appearance support to third-party applications.",
        citations: [c(U.macNews, "Dark Mode: A Dramatic New Look for Mac")],
      }),
      change({
        key: "macos-10-14-dynamic-desktop-stacks",
        title: "Dynamic Desktop and desktop Stacks",
        canonicalSummary:
          "Time-shifting desktop imagery and automatic file Stacks changed how the desktop looked and organized clutter.",
        category: "feature",
        action: "introduced",
        summary:
          "Mojave could vary selected wallpaper with local time and group desktop files by type, date, or tags for faster cleanup and retrieval.",
        citations: [c(U.macNews, "Stacks; Dynamic Desktop")],
      }),
      change({
        key: "macos-10-14-finder-gallery-quick-actions",
        title: "Finder Gallery View, metadata, and Quick Actions",
        canonicalSummary:
          "Finder gained a visual Gallery View, richer metadata previews, contextual Quick Actions, and editing tools in Quick Look.",
        category: "enhancement",
        action: "changed",
        summary:
          "The file browser added media-oriented navigation and common editing or automation actions without requiring users to open a separate app.",
        citations: [c(U.macNews, "Finder: Do More Than Ever Before")],
      }),
      change({
        key: "macos-10-14-screenshot-utility",
        title: "Unified screenshot and screen-recording controls",
        canonicalSummary:
          "A new Screenshot interface combined still capture, screen recording, timers, and save-location controls.",
        category: "feature",
        action: "introduced",
        summary:
          "Mojave consolidated capture workflows behind an onscreen control strip and added built-in video recording of the Mac display.",
        citations: [c(U.macNews, "Screenshots: Now a Snap")],
      }),
      change({
        key: "macos-10-14-continuity-camera",
        title: "Continuity Camera",
        canonicalSummary:
          "Supported Mac apps can request a nearby iPhone photo or document scan and receive the result directly.",
        category: "feature",
        action: "introduced",
        summary:
          "The release linked supported Mac document workflows with an iPhone camera, reducing the steps needed to import a new image or scan.",
        citations: [
          c(
            U.macNews,
            "Continuity Camera: Seamless Integration Across Mac and iPhone",
          ),
        ],
      }),
      change({
        key: "macos-10-14-news-stocks-voice-memos-home",
        title: "News, Stocks, Voice Memos, and Home apps",
        canonicalSummary:
          "News, Stocks, Voice Memos, and Home arrived on Mac with appropriate iCloud and HomeKit integration.",
        category: "feature",
        action: "introduced",
        summary:
          "Mojave brought four familiar Apple apps to the Mac for news and market tracking, synced recordings, and smart-home control.",
        citations: [
          c(U.macNews, "New Apps: News, Stocks, Voice Memos and Home"),
        ],
      }),
      change({
        key: "macos-10-14-mac-app-store-redesign",
        title: "Redesigned Mac App Store",
        canonicalSummary:
          "The Mac App Store gained editorial stories, curated collections, video, and task-oriented discovery sections.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple rebuilt store discovery around a Discover destination and Create, Work, Play, and Develop sections supported by editorial material.",
        citations: [
          c(U.macNews, "New Mac App Store: Discover More Great Mac Apps"),
        ],
      }),
      change({
        key: "macos-10-14-safari-privacy-passwords",
        title: "Safari tracking, fingerprinting, and password protections",
        canonicalSummary:
          "Safari limited social-widget tracking and browser fingerprinting while generating strong passwords and flagging reused credentials.",
        category: "security",
        action: "introduced",
        summary:
          "The browser added protections against passive cross-site identification and improved password creation, storage, and reuse awareness.",
        citations: [c(U.macNews, "Safari: Surf the Web With Better Safety")],
      }),
      change({
        key: "macos-10-14-safari-mail-siri-localization",
        title: "Safari, Mail, Siri, and language refinements",
        canonicalSummary:
          "Mojave added optional favicons in Safari tabs, an emoji menu in Mail, HomeKit control through Siri, and additional system languages and input improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "A group of smaller launch additions improved tab recognition, email composition, voice control of home accessories, and localization.",
        citations: [c(U.macNews, "Additional Features")],
      }),
      change({
        key: "macos-10-14-app-data-automation-privacy",
        title: "Expanded app-data and automation consent",
        canonicalSummary:
          "Mojave tightened access to protected application data and required approval when one app sent Apple events to another.",
        category: "security",
        action: "changed",
        summary:
          "The platform expanded privacy boundaries around protected storage and cross-application automation, requiring explicit system authorization.",
        citations: [
          c(
            U.macDeveloper,
            "Privacy — Application Data; Apple event user approval",
          ),
        ],
      }),
      change({
        key: "macos-10-14-32-bit-compatibility-alerts",
        title: "32-bit compatibility alerts and inventory",
        canonicalSummary:
          "Launching a 32-bit process triggered a warning, and System Information identified legacy software for migration planning.",
        category: "compatibility",
        action: "changed",
        summary:
          "Mojave made the transition away from 32-bit software more visible while retaining selected compatibility services for the release.",
        citations: [c(U.macDeveloper, "32-bit Deprecation")],
      }),
      change({
        key: "macos-10-14-core-ml-model-capabilities",
        title: "Core ML model and prediction updates",
        canonicalSummary:
          "Core ML added quantized and custom models, flexible input shapes, batch prediction, and support for Create ML model types.",
        category: "developerApi",
        action: "changed",
        summary:
          "The machine-learning framework broadened deployable model formats and prediction workflows for applications built with the 10.14 SDK.",
        citations: [c(U.macDeveloper, "Core ML — New Features")],
      }),
      change({
        key: "macos-10-14-egpu-and-api-transition",
        title: "External GPU preference and API transitions",
        canonicalSummary:
          "Apps could prefer an external GPU for windows on directly connected displays, while OpenGL, OpenCL, Ink, and older file APIs moved further into deprecation.",
        category: "developerApi",
        action: "changed",
        summary:
          "Mojave expanded eGPU selection and signaled migration toward Metal and modern file or input APIs without removing the deprecated graphics frameworks in this release.",
        citations: [
          c(
            U.macDeveloper,
            "eGPU — New Features; Open GL and Open CL; General — Deprecations",
          ),
        ],
      }),
      securityChange({
        key: "macos-10-14-security-baseline",
        title: "Mojave 10.14 security repairs",
        canonicalSummary:
          "The initial Mojave release repaired vulnerabilities across identity, networking, graphics, files, firmware, the kernel, privacy boundaries, text processing, and system services.",
        summary:
          "Apple's detailed advisory records a broad security baseline spanning App Store identity, firewall and sandbox controls, drivers, firmware, privileged services, the kernel, cryptography, and input processing.",
        url: U.macSecurity,
        locator:
          "App Store; Application Firewall; Auto Unlock; CoreFoundation; DiskArbitration; Firmware; IOKit; Kernel; LibreSSL; Security; Spotlight; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-watchos-4-2-2",
    releaseNotesUrl: U.watch4,
    overview:
      "watchOS 4.2.2 was released on January 23, 2018 as a maintenance update with a version-specific security repair set.",
    overviewCitations: [
      c(U.watch4, "watchOS 4.2.2"),
      c(U.watch422Security, "Released January 23, 2018"),
    ],
    boundary:
      "Apple's consumer note gives no named feature or individual ordinary fix beyond improvements and bug fixes. The page therefore keeps maintenance generic and uses the security advisory for concrete technical scope.",
    boundaryCitations: [
      c(U.watch4, "watchOS 4.2.2"),
      c(
        U.watch422Security,
        "Audio; Core Bluetooth; Graphics Driver; Kernel; LinkPresentation; QuartzCore; Security; WebKit",
      ),
    ],
    pageCitations: [
      c(U.watch4, "watchOS 4.2.2"),
      c(U.watch422Security, "Released January 23, 2018"),
    ],
    summary:
      "watchOS 4.2.2 reached the public channel on January 23, 2018 with documented maintenance work and security repairs across media, wireless, graphics, kernel, certificate, message, and web surfaces.",
    publicText:
      "Apple released watchOS 4.2.2 on January 23, 2018. Its consumer history describes improvements and bug fixes but does not enumerate them.",
    publicCitations: [
      c(U.watch4, "watchOS 4.2.2"),
      c(U.watch422Security, "Released January 23, 2018"),
    ],
    scopeText:
      "The matching advisory provides the specific evidence for security work. No unnamed maintenance item is converted into a more precise claim.",
    scopeCitations: [
      c(U.watch4, "watchOS 4.2.2"),
      c(U.watch422Security, "Audio through WebKit security content"),
    ],
    changes: [
      change({
        key: "watchos-4-2-2-maintenance",
        title: "General improvements and bug fixes",
        canonicalSummary:
          "Apple characterized watchOS 4.2.2 as an update containing improvements and bug fixes.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer record confirms maintenance work but does not name an affected feature or corrected behavior.",
        citations: [c(U.watch4, "watchOS 4.2.2")],
      }),
      securityChange({
        key: "watchos-4-2-2-security-repairs",
        title: "watchOS 4.2.2 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in audio, Bluetooth, graphics, the kernel, message previews, certificates, and web processing.",
        summary:
          "Apple's advisory documents memory-safety, information-disclosure, certificate-validation, denial-of-service, and code-execution fixes across system components.",
        url: U.watch422Security,
        locator:
          "Audio; Core Bluetooth; Graphics Driver; Kernel; LinkPresentation; QuartzCore; Security; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-4-3",
    releaseNotesUrl: U.watch4,
    overview:
      "watchOS 4.3 was released on March 29, 2018 with HomePod and iPhone music controls, flexible Nightstand orientation, Siri-face updates, Activity and Siri fixes, and security repairs.",
    overviewCitations: [
      c(U.watch4, "watchOS 4.3"),
      c(U.watch43Security, "Released March 29, 2018"),
    ],
    boundary:
      "The six named consumer changes are kept distinct from the advisory's security work. Regional qualifications remain attached, and no 4.3.1 or 4.3.2 change is projected backward.",
    boundaryCitations: [
      c(U.watch4, "watchOS 4.3"),
      c(U.watch43Security, "watchOS 4.3 security content"),
    ],
    pageCitations: [
      c(U.watch4, "watchOS 4.3"),
      c(U.watch43Security, "Released March 29, 2018"),
    ],
    summary:
      "watchOS 4.3 reached the public channel on March 29, 2018 with expanded music and Nightstand controls, richer Siri-face information, two targeted corrections, and a broad security update.",
    publicText:
      "Apple released watchOS 4.3 on March 29, 2018. Its update history names six user-facing additions or fixes, while the companion advisory documents the security set.",
    publicCitations: [
      c(U.watch4, "watchOS 4.3"),
      c(U.watch43Security, "Released March 29, 2018"),
    ],
    scopeText:
      "The page limits itself to Apple's version-labeled 4.3 bullets and advisory. It does not treat the later 4.3.1 startup fix as part of this release.",
    scopeCitations: [
      c(U.watch4, "watchOS 4.3 through watchOS 4.3.1"),
      c(U.watch43Security, "watchOS 4.3 security content"),
    ],
    changes: [
      change({
        key: "watchos-4-3-homepod-controls",
        title: "HomePod playback controls",
        canonicalSummary:
          "Apple Watch gained controls for HomePod playback and volume.",
        category: "feature",
        action: "introduced",
        summary:
          "The update let a watch act as a compact controller for audio playing on HomePod.",
        citations: [c(U.watch4, "watchOS 4.3 — HomePod")],
      }),
      change({
        key: "watchos-4-3-iphone-music-controls",
        title: "Restored iPhone music controls",
        canonicalSummary:
          "watchOS 4.3 restored the ability to control music playing on the paired iPhone.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The release returned an earlier remote-control path for iPhone music playback.",
        citations: [c(U.watch4, "watchOS 4.3 — music on iPhone")],
      }),
      change({
        key: "watchos-4-3-nightstand-orientation",
        title: "Nightstand mode in either orientation",
        canonicalSummary:
          "Nightstand charging mode became usable with the watch placed in either orientation.",
        category: "enhancement",
        action: "changed",
        summary:
          "The bedside display no longer depended on one fixed charging orientation.",
        citations: [c(U.watch4, "watchOS 4.3 — Nightstand")],
      }),
      change({
        key: "watchos-4-3-siri-face-activity-music",
        title: "Siri face Activity and music updates",
        canonicalSummary:
          "The Siri watch face added Activity-ring progress and notices about newly added Apple Music mix songs.",
        category: "enhancement",
        action: "changed",
        summary:
          "The predictive face surfaced more personal fitness progress and music-library updates.",
        citations: [c(U.watch4, "watchOS 4.3 — Siri watch face")],
      }),
      change({
        key: "watchos-4-3-activity-achievement-fix",
        title: "Activity achievement correction",
        canonicalSummary:
          "The update fixed Activity achievements that could be awarded incorrectly.",
        category: "bugFix",
        action: "fixed",
        summary:
          "watchOS 4.3 corrected erroneous award state for affected users.",
        citations: [c(U.watch4, "watchOS 4.3 — Activity achievements")],
      }),
      change({
        key: "watchos-4-3-siri-audio-command-fix",
        title: "Siri music-command audio fix",
        canonicalSummary:
          "The release fixed Siri music commands that failed with some audio devices.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple addressed a compatibility failure between voice-directed playback and certain audio outputs.",
        citations: [c(U.watch4, "watchOS 4.3 — Siri music commands")],
      }),
      securityChange({
        key: "watchos-4-3-security-repairs",
        title: "watchOS 4.3 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving privileges, text, file events, the kernel, XML, networking, configuration profiles, and WebKit.",
        summary:
          "Apple's advisory records race-condition, memory-safety, information-disclosure, spoofing, profile-cleanup, and cross-origin fixes.",
        url: U.watch43Security,
        locator:
          "CoreFoundation; CoreText; File System Events; Kernel; libxml2; LinkPresentation; NSURLSession; Quick Look; Security; System Preferences; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-4-3-1",
    releaseNotesUrl: U.watch4,
    overview:
      "watchOS 4.3.1 was released on May 29, 2018 with a startup-logo correction and a substantial security repair set.",
    overviewCitations: [
      c(U.watch4, "watchOS 4.3.1"),
      c(U.watch431Security, "Released May 29, 2018"),
    ],
    boundary:
      "Apple names one ordinary fix for this version. Other detail comes only from the matching advisory, and later 4.3.2 maintenance is not attributed to 4.3.1.",
    boundaryCitations: [
      c(U.watch4, "watchOS 4.3.1 through watchOS 4.3.2"),
      c(U.watch431Security, "watchOS 4.3.1 security content"),
    ],
    pageCitations: [
      c(U.watch4, "watchOS 4.3.1"),
      c(U.watch431Security, "Released May 29, 2018"),
    ],
    summary:
      "watchOS 4.3.1 reached the public channel on May 29, 2018 with a fix for watches that could remain at the startup logo and security repairs across wireless, parsing, messaging, identity, kernel, and web surfaces.",
    publicText:
      "Apple released watchOS 4.3.1 on May 29, 2018. The consumer history identifies a startup issue affecting some users as the version's named ordinary correction.",
    publicCitations: [
      c(U.watch4, "watchOS 4.3.1"),
      c(U.watch431Security, "Released May 29, 2018"),
    ],
    scopeText:
      "The advisory documents the broader technical repair set. The page does not infer the prevalence or cause of the startup condition.",
    scopeCitations: [
      c(U.watch4, "watchOS 4.3.1"),
      c(U.watch431Security, "Bluetooth through WebKit security content"),
    ],
    changes: [
      change({
        key: "watchos-4-3-1-startup-logo-fix",
        title: "Startup-logo hang correction",
        canonicalSummary:
          "watchOS 4.3.1 fixed a condition that could leave some watches at the Apple logo during startup.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update addressed an intermittent boot path that prevented affected devices from progressing beyond the startup screen.",
        citations: [c(U.watch4, "watchOS 4.3.1")],
      }),
      securityChange({
        key: "watchos-4-3-1-security-repairs",
        title: "watchOS 4.3.1 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities across Bluetooth, graphics and font parsing, crash reporting, the kernel, messaging, identifiers, Keychain state, text, and WebKit.",
        summary:
          "Apple's advisory records interception, privilege, code-execution, spoofing, impersonation, denial-of-service, identifier-exposure, and web-processing fixes.",
        url: U.watch431Security,
        locator:
          "Bluetooth; CoreGraphics; Crash Reporter; FontParser; Kernel; libxpc; LinkPresentation; Messages; Security; UIKit; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-5-0",
    releaseNotesUrl: U.watch5,
    overview:
      "watchOS 5.0 launched on September 17, 2018 with Activity competitions, automatic workout detection, new workout and running tools, Podcasts, Walkie-Talkie, new faces, a more capable Siri face, notification controls, health alerts, system utilities, and security repairs.",
    overviewCitations: [
      c(U.watch5, "watchOS 5"),
      c(U.watch5Preview, "watchOS 5 feature preview and compatibility"),
      c(U.watch5Security, "Released September 17, 2018"),
    ],
    boundary:
      "Apple limited watchOS 5 to Series 1 and later and noted regional variation. The consumer history separates 5.0.1 and later updates, so their fixes are not included in the 5.0 launch record.",
    boundaryCitations: [
      c(U.watch5Preview, "Availability and compatibility footnotes"),
      c(U.watch5, "watchOS 5 through watchOS 5.0.1"),
    ],
    pageCitations: [
      c(U.watch5, "watchOS 5"),
      c(U.watch5Preview, "watchOS 5 preview"),
      c(U.watch5Security, "Released September 17, 2018"),
    ],
    summary:
      "watchOS 5.0 reached the public channel on September 17, 2018 with major fitness, communication, audio, face, Siri, notification, health, utility, compatibility, and security changes.",
    publicText:
      "Apple released watchOS 5 on September 17, 2018 for Apple Watch Series 1 and later. The launch expanded fitness tracking and competition, wrist-based communication and audio, proactive information, notifications, health monitoring, and everyday controls.",
    publicCitations: [
      c(U.watch5Security, "Released September 17, 2018"),
      c(U.watch5Preview, "Availability; feature overview"),
      c(U.watch5, "watchOS 5"),
    ],
    scopeText:
      "The structured entries group closely related bullets from Apple's version-labeled watchOS 5 section and summarize its dedicated security advisory. They do not include later 5.0.1 fixes or Series 4 ECG functionality, which Apple activated in 5.1.2.",
    scopeCitations: [
      c(U.watch5, "watchOS 5 through watchOS 5.1.2"),
      c(U.watch512News, "ECG availability December 6, 2018"),
      c(U.watch5Security, "watchOS 5 security content"),
    ],
    changes: [
      change({
        key: "watchos-5-activity-competitions",
        title: "Seven-day Activity competitions",
        canonicalSummary:
          "Activity Sharing friends can compete for seven days using ring-based points, progress notices, and awards.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 5 added head-to-head competitions with daily scoring, coaching-style notifications, and an end-of-challenge award.",
        citations: [c(U.watch5, "watchOS 5 — Activity")],
      }),
      change({
        key: "watchos-5-workout-detection-yoga-hiking",
        title: "Automatic workout detection, Yoga, and Hiking",
        canonicalSummary:
          "Workout can prompt to begin or end supported sessions with retroactive credit and added dedicated Yoga and Hiking types.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update reduced missed workout logging and expanded the activity models available for tracking two additional exercise types.",
        citations: [c(U.watch5, "watchOS 5 — Workout")],
      }),
      change({
        key: "watchos-5-running-pace-cadence-rolling",
        title: "Running pace, cadence, and rolling-distance metrics",
        canonicalSummary:
          "Outdoor runs gained target-pace alerts, while runs could report cadence and pace across the immediately preceding mile or kilometer.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 5 gave runners more immediate feedback about target pace, step rate, and current-distance performance.",
        citations: [c(U.watch5, "watchOS 5 — Workout running metrics")],
      }),
      change({
        key: "watchos-5-apple-podcasts",
        title: "Apple Podcasts on Apple Watch",
        canonicalSummary:
          "Apple Watch gained subscribed-show syncing, automatic episode refresh, Siri streaming, and a Podcasts complication.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought Apple's podcast catalog to the wrist for local Bluetooth listening or supported Wi-Fi and cellular streaming.",
        citations: [c(U.watch5, "watchOS 5 — Apple Podcasts")],
      }),
      change({
        key: "watchos-5-walkie-talkie",
        title: "Walkie-Talkie",
        canonicalSummary:
          "Walkie-Talkie introduced one-to-one push-to-talk conversations over Wi-Fi or cellular with availability controls and distinct feedback.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple added a lightweight voice channel between compatible Apple Watch users, designed around press-to-speak exchanges.",
        citations: [c(U.watch5, "watchOS 5 — Walkie-Talkie")],
      }),
      change({
        key: "watchos-5-faces-and-complications",
        title: "Breathe, motion, Memories, and new complications",
        canonicalSummary:
          "watchOS 5 added a Breathe face, three motion-face families, a Memories option for Photos, and Podcasts and Walkie-Talkie complications.",
        category: "enhancement",
        action: "changed",
        summary:
          "The face collection expanded with animated and photo-driven choices plus direct entry points for two new apps.",
        citations: [c(U.watch5, "watchOS 5 — Watch Faces")],
      }),
      change({
        key: "watchos-5-siri-face-raise-to-speak-shortcuts",
        title: "Siri face, Raise to Speak, and Shortcuts",
        canonicalSummary:
          "The Siri face became more proactive and accepted third-party shortcuts, while Raise to Speak and custom Shortcut phrases expanded voice access.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 5 surfaced richer contextual cards and reduced the steps needed to make supported Siri requests from the wrist.",
        citations: [c(U.watch5, "watchOS 5 — Siri")],
      }),
      change({
        key: "watchos-5-notification-and-dnd-controls",
        title: "Grouped notifications and contextual Do Not Disturb",
        canonicalSummary:
          "Notifications were grouped by app and gained quiet-delivery controls, while Do Not Disturb could end by time, location, or calendar event.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update made alerts easier to triage and allowed temporary interruption controls to expire automatically.",
        citations: [c(U.watch5, "watchOS 5 — Notifications")],
      }),
      change({
        key: "watchos-5-low-heart-rate-alerts",
        title: "Low heart-rate notifications",
        canonicalSummary:
          "Users could opt to receive a notification when heart rate remained below a chosen threshold during an inactive period.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 5 extended passive heart monitoring beyond high-rate alerts with a configurable low-rate condition.",
        citations: [c(U.watch5, "watchOS 5 — Heart Rate")],
      }),
      change({
        key: "watchos-5-web-weather-and-app-utilities",
        title: "Web previews, weather metrics, and app utilities",
        canonicalSummary:
          "Mail and Messages links could show watch-optimized web content, while Weather, Stocks, and World Clock gained additional data and management tools.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded information available directly on the watch, including UV, wind, and air-quality data in supported regions.",
        citations: [c(U.watch5, "watchOS 5 — Other features and improvements")],
      }),
      change({
        key: "watchos-5-wifi-control-center-system-tools",
        title: "Wi-Fi, Control Center, and system-management tools",
        canonicalSummary:
          "Users could choose Wi-Fi networks, rearrange Control Center, schedule overnight updates, answer FaceTime video calls as audio, and use Hindi as a system language.",
        category: "enhancement",
        action: "changed",
        summary:
          "A collection of system changes improved connectivity control, customization, update timing, call handling, and language support.",
        citations: [c(U.watch5, "watchOS 5 — Other features and improvements")],
      }),
      securityChange({
        key: "watchos-5-security-baseline",
        title: "watchOS 5 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across networking, text, files, authentication, input, drivers, the kernel, stores, cryptography, privacy, and WebKit.",
        summary:
          "Apple's advisory documents a broad initial security baseline including memory-safety, privilege, sandbox, spoofing, disclosure, and cross-origin fixes.",
        url: U.watch5Security,
        locator:
          "CFNetwork; CoreFoundation; CoreText; dyld; Heimdal; IOHIDFamily; IOKit; iTunes Store; Kernel; Security; WebKit",
      }),
    ],
  }),
  release({
    id: "version-watchos-5-1",
    releaseNotesUrl: U.watch51Security,
    overview:
      "Apple's dedicated security advisory records watchOS 5.1 as released on October 30, 2018 with fixes across cryptography, strings, networking, the kernel, mail, VPN behavior, Safari Reader, certificates, web processing, and Wi-Fi.",
    overviewCitations: [c(U.watch51Security, "Released October 30, 2018")],
    boundary:
      "Apple's current watchOS 5 consumer update history has no 5.1 section and instead proceeds from 5.0.1 to 5.1.1. Because the security advisory independently confirms 5.1, this page preserves the existing route but makes no unsupported feature or ordinary-fix claim.",
    boundaryCitations: [
      c(U.watch5, "watchOS 5.0.1 through watchOS 5.1.1"),
      c(U.watch51Security, "watchOS 5.1"),
    ],
    pageCitations: [
      c(U.watch5, "watchOS 5 update index"),
      c(U.watch51Security, "Released October 30, 2018"),
    ],
    summary:
      "watchOS 5.1 reached the public channel on October 30, 2018 according to Apple's version-specific security advisory; Apple's current consumer history supplies no retained 5.1 feature or maintenance note.",
    publicText:
      "Apple's security record dates watchOS 5.1 to October 30, 2018. The living consumer update page omits a 5.1 section, so this archive distinguishes the confirmed release from the absent consumer narrative.",
    publicCitations: [
      c(U.watch51Security, "Released October 30, 2018"),
      c(U.watch5, "watchOS 5.0.1 through watchOS 5.1.1"),
    ],
    scopeText:
      "Only security work enumerated in Apple's advisory is structured below. The page does not borrow 5.1.1 notes or infer why Apple's current consumer history omits 5.1.",
    scopeCitations: [
      c(U.watch51Security, "watchOS 5.1 security content"),
      c(U.watch5, "watchOS 5.1.1"),
    ],
    changes: [
      securityChange({
        key: "watchos-5-1-security-repairs",
        title: "watchOS 5.1 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in cryptography, string parsing, IPsec, the kernel, mail, VPN DNS handling, Safari Reader, S/MIME, WebKit, and Wi-Fi.",
        summary:
          "Apple's advisory records memory-safety, privilege, information-disclosure, denial-of-service, DNS-leak, cross-site-scripting, and wireless fixes.",
        url: U.watch51Security,
        locator:
          "CoreCrypto; ICU; IPSec; Kernel; Mail; NetworkExtension; Safari Reader; Security; WebKit; Wi-Fi",
      }),
    ],
  }),
  release({
    id: "version-watchos-5-1-2",
    releaseNotesUrl: U.watch5,
    overview:
      "watchOS 5.1.2 was released on December 6, 2018 with the ECG app and irregular-rhythm notifications in supported United States territories, Wallet, Activity, complication and Walkie-Talkie improvements, and security repairs.",
    overviewCitations: [
      c(U.watch5, "watchOS 5.1.2"),
      c(U.watch512News, "Update December 6, 2018"),
      c(U.watch512Security, "Released December 6, 2018"),
    ],
    boundary:
      "The ECG app required Apple Watch Series 4 and regulated regional availability; irregular-rhythm notifications also had regional limits. The page preserves those qualifications and does not present either feature as diagnosis or medical advice.",
    boundaryCitations: [
      c(U.watch5, "watchOS 5.1.2 — regional qualifications"),
      c(U.watch512News, "Availability and medical-feature qualifications"),
    ],
    pageCitations: [
      c(U.watch5, "watchOS 5.1.2"),
      c(U.watch512News, "December 6, 2018"),
      c(U.watch512Security, "Released December 6, 2018"),
    ],
    summary:
      "watchOS 5.1.2 reached the public channel on December 6, 2018 with regulated heart features, pass access, competition feedback, new complications, Walkie-Talkie controls, and security repairs.",
    publicText:
      "Apple released watchOS 5.1.2 on December 6, 2018. The update activated ECG and irregular-rhythm capabilities for supported hardware and regions and added several everyday interface refinements.",
    publicCitations: [
      c(U.watch512News, "Update December 6, 2018"),
      c(U.watch5, "watchOS 5.1.2"),
      c(U.watch512Security, "Released December 6, 2018"),
    ],
    scopeText:
      "Health claims are limited to Apple's described recording, classification, storage, sharing, and notification behavior. The page does not infer clinical outcomes and keeps hardware and regional restrictions visible.",
    scopeCitations: [
      c(U.watch512News, "ECG app; irregular heart rhythm notification"),
      c(U.watch5, "watchOS 5.1.2"),
      c(U.watch512Security, "watchOS 5.1.2 security content"),
    ],
    changes: [
      change({
        key: "watchos-5-1-2-ecg-record-classify-export",
        title: "ECG recording, classification, and export",
        canonicalSummary:
          "On supported Series 4 watches, the ECG app could record a single-lead-style electrocardiogram, classify supported rhythms, and save a shareable PDF in Health.",
        category: "feature",
        action: "introduced",
        summary:
          "The release enabled a regulated wrist recording workflow with result storage and clinician-sharing tools in supported United States regions.",
        citations: [
          c(U.watch5, "watchOS 5.1.2 — ECG app"),
          c(U.watch512News, "ECG App"),
        ],
      }),
      change({
        key: "watchos-5-1-2-irregular-rhythm-notifications",
        title: "Irregular-rhythm notifications",
        canonicalSummary:
          "Supported watches could alert users when background analysis detected a rhythm pattern that might be consistent with atrial fibrillation.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple activated an opt-in background heart-rhythm notification in supported United States regions, subject to the stated eligibility limits.",
        citations: [
          c(U.watch5, "watchOS 5.1.2 — irregular heart rhythm alert"),
          c(U.watch512News, "Irregular Heart Rhythm Notification"),
        ],
      }),
      change({
        key: "watchos-5-1-2-wallet-contactless-pass-access",
        title: "Contactless Wallet pass access",
        canonicalSummary:
          "Supported tickets, coupons, and rewards cards could open directly when the watch was tapped to a contactless reader.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update shortened access to eligible Wallet passes during a contactless interaction.",
        citations: [c(U.watch5, "watchOS 5.1.2 — Wallet")],
      }),
      change({
        key: "watchos-5-1-2-activity-maximum-point-feedback",
        title: "Activity competition maximum-point feedback",
        canonicalSummary:
          "Activity competitions gained notifications and animated celebrations for reaching the daily maximum score.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update made a top-scoring competition day more visible with immediate feedback and celebration.",
        citations: [c(U.watch5, "watchOS 5.1.2 — Activity competition")],
      }),
      change({
        key: "watchos-5-1-2-infograph-complications",
        title: "Additional Infograph complications",
        canonicalSummary:
          "Infograph faces gained complications for Mail, Maps, Messages, Find My Friends, Home, News, Phone, and Remote.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple expanded the data and shortcuts that Series 4 Infograph layouts could place on the face.",
        citations: [c(U.watch5, "watchOS 5.1.2 — Infograph complications")],
      }),
      change({
        key: "watchos-5-1-2-walkie-talkie-control-center",
        title: "Walkie-Talkie availability in Control Center",
        canonicalSummary:
          "Walkie-Talkie availability could be managed directly from Control Center.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release exposed the service's availability state in a faster system-level control.",
        citations: [c(U.watch5, "watchOS 5.1.2 — Walkie-Talkie")],
      }),
      securityChange({
        key: "watchos-5-1-2-security-repairs",
        title: "watchOS 5.1.2 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in wireless networking, disk images, the kernel, link previews, configuration profiles, and WebKit.",
        summary:
          "Apple's advisory documents privilege, code-execution, information-disclosure, denial-of-service, spoofing, certificate-validation, and web-processing fixes.",
        url: U.watch512Security,
        locator:
          "Airport; Disk Images; Kernel; LinkPresentation; Profiles; WebKit",
      }),
    ],
  }),
  release({
    id: "version-tvos-11-2-5",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 11.2.5 was released on January 23, 2018 with general performance and stability work plus security repairs across media, wireless, graphics, the kernel, certificates, and web processing.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 11.2.5"),
      c(U.tv1125Security, "Released January 23, 2018"),
    ],
    boundary:
      "Apple's consumer history names no individual feature or ordinary fix for 11.2.5. The page keeps that maintenance description generic and uses the advisory only for documented security scope.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 11.2.5"),
      c(U.tv1125Security, "tvOS 11.2.5 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 11.2.5"),
      c(U.tv1125Security, "Released January 23, 2018"),
    ],
    summary:
      "tvOS 11.2.5 reached the public channel on January 23, 2018 with general performance and stability improvements and version-specific security repairs.",
    publicText:
      "Apple released tvOS 11.2.5 on January 23, 2018. Its living consumer history characterizes the release only as general performance and stability maintenance.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 11.2.5"),
      c(U.tv1125Security, "Released January 23, 2018"),
    ],
    scopeText:
      "Concrete technical detail comes from the security advisory. No unnamed maintenance item is promoted into a more specific feature or fix.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 11.2.5"),
      c(U.tv1125Security, "Audio through WebKit Page Loading security content"),
    ],
    changes: [
      change({
        key: "tvos-11-2-5-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple documented tvOS 11.2.5 as containing general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer record confirms maintenance work but does not identify an affected subsystem or symptom.",
        citations: [c(U.tvUpdates, "tvOS 11.2.5")],
      }),
      securityChange({
        key: "tvos-11-2-5-security-repairs",
        title: "tvOS 11.2.5 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in audio, Bluetooth, graphics, the kernel, certificates, QuartzCore, and WebKit.",
        summary:
          "Apple's advisory records memory-safety, information-disclosure, certificate-validation, and code-execution fixes across the Apple TV system stack.",
        url: U.tv1125Security,
        locator:
          "Audio; Core Bluetooth; Graphics Driver; Kernel; QuartzCore; Security; WebKit; WebKit Page Loading",
      }),
    ],
  }),
  release({
    id: "version-tvos-11-3",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 11.3 was released on March 29, 2018 with Apple TV app expansion, Brazilian Portuguese Siri, original-frame-rate playback on Apple TV HD, and security repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 11.3"),
      c(U.tv113Security, "Released March 29, 2018"),
    ],
    boundary:
      "Apple's consumer notes list three named additions and retain geographic and device qualifications. The page does not import capabilities from 11.4 or infer broader availability.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 11.3; regional Siri footnote"),
      c(U.tv113Security, "tvOS 11.3 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 11.3"),
      c(U.tv113Security, "Released March 29, 2018"),
    ],
    summary:
      "tvOS 11.3 reached the public channel on March 29, 2018 with regional app and Siri expansion, frame-rate matching on Apple TV HD, and a broad security repair set.",
    publicText:
      "Apple released tvOS 11.3 on March 29, 2018. Its consumer history identifies three user-facing changes spanning content discovery, language support, and video playback.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 11.3"),
      c(U.tv113Security, "Released March 29, 2018"),
    ],
    scopeText:
      "The update's feature claims remain limited to Brazil, Mexico, Brazilian Portuguese, and Apple TV HD where Apple specifies them. The advisory supplies the separate security record.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 11.3"),
      c(U.tv113Security, "tvOS 11.3 security content"),
    ],
    changes: [
      change({
        key: "tvos-11-3-tv-app-brazil-mexico",
        title: "Apple TV app in Brazil and Mexico",
        canonicalSummary:
          "The Apple TV app became available in Brazil and Mexico.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 11.3 expanded Apple's unified TV discovery experience to two additional markets.",
        citations: [c(U.tvUpdates, "tvOS 11.3 — Apple TV App")],
      }),
      change({
        key: "tvos-11-3-siri-brazilian-portuguese",
        title: "Siri support for Brazilian Portuguese",
        canonicalSummary:
          "Siri on Apple TV added Portuguese-language understanding in Brazil.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The update expanded regional voice search and control with Brazilian Portuguese support.",
        citations: [c(U.tvUpdates, "tvOS 11.3 — Siri")],
      }),
      change({
        key: "tvos-11-3-hd-original-frame-rate",
        title: "Original frame-rate playback on Apple TV HD",
        canonicalSummary:
          "Apple TV HD gained the option to play supported video at its original frame rate.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 11.3 extended frame-rate matching behavior to Apple's HD model for supported content and displays.",
        citations: [c(U.tvUpdates, "tvOS 11.3 — Video playback")],
      }),
      securityChange({
        key: "tvos-11-3-security-repairs",
        title: "tvOS 11.3 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving privileges, text, file events, the kernel, XML, networking, configuration profiles, and WebKit.",
        summary:
          "Apple's advisory records race-condition, memory-safety, disclosure, spoofing, profile-cleanup, cross-origin, and code-execution fixes.",
        url: U.tv113Security,
        locator:
          "CoreFoundation; CoreText; File System Events; Kernel; libxml2; NSURLSession; Quick Look; Security; System Preferences; WebKit",
      }),
    ],
  }),
  release({
    id: "version-tvos-11-4",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 11.4 was released on May 29, 2018 with AirPlay 2 multiroom audio, general performance and stability improvements, and security repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 11.4"),
      c(U.tv114Security, "Released May 29, 2018"),
    ],
    boundary:
      "Apple names AirPlay 2 as the release's single consumer feature and leaves other maintenance unspecified. The page does not infer additional behavior from the general improvement label.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 11.4"),
      c(U.tv114Security, "tvOS 11.4 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 11.4"),
      c(U.tv114Security, "Released May 29, 2018"),
    ],
    summary:
      "tvOS 11.4 reached the public channel on May 29, 2018 with AirPlay 2 multiroom audio, general maintenance, and version-specific security repairs.",
    publicText:
      "Apple released tvOS 11.4 on May 29, 2018. Its consumer history highlights AirPlay 2 and separately describes general performance and stability work.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 11.4"),
      c(U.tv114Security, "Released May 29, 2018"),
    ],
    scopeText:
      "AirPlay 2 is represented as an ecosystem audio capability across compatible Apple TV, HomePod, and third-party speakers. Security claims remain tied to Apple's advisory.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 11.4 — AirPlay 2"),
      c(U.tv114Security, "tvOS 11.4 security content"),
    ],
    changes: [
      change({
        key: "tvos-11-4-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple documented tvOS 11.4 as including general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer history confirms maintenance alongside AirPlay 2 but does not enumerate its individual changes.",
        citations: [c(U.tvUpdates, "tvOS 11.4")],
      }),
      change({
        key: "tvos-11-4-airplay-2-multiroom",
        title: "AirPlay 2 multiroom audio",
        canonicalSummary:
          "Apple TV joined AirPlay 2 multiroom playback with HomePod and other compatible speakers, supporting synchronized or different audio by room.",
        category: "feature",
        action: "introduced",
        summary:
          "The update made compatible Apple TV hardware part of a coordinated home-audio system controlled through AirPlay 2.",
        citations: [c(U.tvUpdates, "tvOS 11.4 — AirPlay 2")],
      }),
      securityChange({
        key: "tvos-11-4-security-repairs",
        title: "tvOS 11.4 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in Bluetooth, crash reporting, fonts, the kernel, IPC, messages, identifiers, text, and WebKit.",
        summary:
          "Apple's advisory documents interception, privilege, code-execution, spoofing, impersonation, disclosure, denial-of-service, and web-processing fixes.",
        url: U.tv114Security,
        locator:
          "Bluetooth; Crash Reporter; FontParser; Kernel; libxpc; LinkPresentation; Messages; Security; UIKit; WebKit",
      }),
    ],
  }),
  release({
    id: "version-tvos-12-0",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 12.0 launched on September 17, 2018 with Dolby Atmos on Apple TV 4K, new space-based Aerials and location details, iOS password autofill, Siri-assisted device finding, and a broad security baseline.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 12"),
      c(U.tv12Security, "Released September 17, 2018"),
    ],
    boundary:
      "Dolby Atmos required Apple TV 4K and compatible audio equipment, while iOS password autofill depended on iOS 12. The page retains those dependencies and does not include 12.0.1 maintenance.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 12; tvOS 12.0.1"),
      c(U.tv12Security, "tvOS 12 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 12"),
      c(U.tv12Security, "Released September 17, 2018"),
    ],
    summary:
      "tvOS 12.0 reached the public channel on September 17, 2018 with spatial audio, expanded Aerials, cross-device password entry, device-finding help, and security repairs.",
    publicText:
      "Apple released tvOS 12 on September 17, 2018. The consumer history presents four launch features spanning home-theater audio, screen savers, sign-in convenience, and Siri-assisted device location.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 12"),
      c(U.tv12Security, "Released September 17, 2018"),
    ],
    scopeText:
      "The feature entries reflect Apple's current version-labeled tvOS 12 history, and the security entry summarizes the matching advisory. Hardware, software, and service prerequisites remain part of the claims.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 12"),
      c(U.tv12Security, "tvOS 12 security content"),
    ],
    changes: [
      change({
        key: "tvos-12-dolby-atmos",
        title: "Dolby Atmos on Apple TV 4K",
        canonicalSummary:
          "Apple TV 4K gained Dolby Atmos output for compatible content and sound systems.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 12 expanded supported home-theater audio with height-aware surround playback on compatible equipment.",
        citations: [c(U.tvUpdates, "tvOS 12 — Dolby Atmos")],
      }),
      change({
        key: "tvos-12-space-aerials-location-controls",
        title: "Space Aerials and location controls",
        canonicalSummary:
          "Aerial screen savers added views captured from space plus controls for showing a location and switching scenes.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded the Aerial collection beyond Earth-level footage and made scene context easier to inspect.",
        citations: [c(U.tvUpdates, "tvOS 12 — Aerial screen savers")],
      }),
      change({
        key: "tvos-12-ios-password-autofill",
        title: "Password autofill from iOS 12 devices",
        canonicalSummary:
          "Saved passwords on an iOS 12 device could be used to sign in to apps on Apple TV.",
        category: "feature",
        action: "introduced",
        summary:
          "The update reduced remote-based text entry by handing eligible app credentials from a nearby Apple mobile device to Apple TV.",
        citations: [c(U.tvUpdates, "tvOS 12 — Autofill passwords")],
      }),
      change({
        key: "tvos-12-siri-find-my-iphone-sound",
        title: "Find My iPhone sound through Siri",
        canonicalSummary:
          "Siri on Apple TV could request a sound on a device enrolled in Find My iPhone.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 12 turned the television interface into another voice entry point for locating supported Apple devices nearby.",
        citations: [c(U.tvUpdates, "tvOS 12 — Find My iPhone")],
      }),
      securityChange({
        key: "tvos-12-security-baseline",
        title: "tvOS 12 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across identity, Bluetooth, networking, text, files, authentication, drivers, the kernel, stores, cryptography, and WebKit.",
        summary:
          "Apple's advisory records a broad security baseline including memory-safety, privilege, sandbox, spoofing, disclosure, cross-origin, and code-execution fixes.",
        url: U.tv12Security,
        locator:
          "Auto Unlock; Bluetooth; CFNetwork; CoreFoundation; CoreText; dyld; Heimdal; IOHIDFamily; IOKit; iTunes Store; Kernel; Security; WebKit",
      }),
    ],
  }),
  release({
    id: "version-tvos-12-1",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 12.1 was released on October 30, 2018 with general performance and stability improvements plus security repairs in cryptography, string processing, IPsec, the kernel, mail, VPN handling, WebKit, and Wi-Fi.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 12.1"),
      c(U.tv121Security, "Released October 30, 2018"),
    ],
    boundary:
      "Apple's consumer history names no individual ordinary change for 12.1. The archive keeps maintenance generic and uses the advisory only for its enumerated security work.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 12.1"),
      c(U.tv121Security, "tvOS 12.1 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 12.1"),
      c(U.tv121Security, "Released October 30, 2018"),
    ],
    summary:
      "tvOS 12.1 reached the public channel on October 30, 2018 with general performance and stability improvements and version-specific security repairs.",
    publicText:
      "Apple released tvOS 12.1 on October 30, 2018. Its consumer history gives only a general performance and stability description.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 12.1"),
      c(U.tv121Security, "Released October 30, 2018"),
    ],
    scopeText:
      "The security advisory supplies the concrete subsystem and remediation evidence. No undocumented feature or bug fix is inferred from the generic maintenance label.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 12.1"),
      c(
        U.tv121Security,
        "CoreCrypto; ICU; IPSec; Kernel; Mail; NetworkExtension; WebKit; WiFi",
      ),
    ],
    changes: [
      change({
        key: "tvos-12-1-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple documented tvOS 12.1 as containing general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer record confirms maintenance but does not name a specific app, subsystem, or corrected symptom.",
        citations: [c(U.tvUpdates, "tvOS 12.1")],
      }),
      securityChange({
        key: "tvos-12-1-security-repairs",
        title: "tvOS 12.1 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in cryptography, string processing, IPsec, the kernel, mail, VPN DNS handling, WebKit, and Wi-Fi.",
        summary:
          "Apple's advisory documents memory-safety, privilege, information-disclosure, denial-of-service, DNS-leak, web-processing, and wireless fixes.",
        url: U.tv121Security,
        locator:
          "CoreCrypto; ICU; IPSec; Kernel; Mail; NetworkExtension; WebKit; WiFi",
      }),
    ],
  }),
  release({
    id: "version-tvos-12-1-1",
    releaseNotesUrl: U.tvUpdates,
    overview:
      "tvOS 12.1.1 was released on December 5, 2018 with general performance and stability improvements plus security repairs across wireless, disk images, the kernel, configuration profiles, and WebKit.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 12.1.1"),
      c(U.tv1211Security, "Released December 5, 2018"),
    ],
    boundary:
      "Apple's consumer history names no individual ordinary change for 12.1.1. The page preserves that limit and does not import changes from 12.1.2 or later.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 12.1.1 through tvOS 12.1.2"),
      c(U.tv1211Security, "tvOS 12.1.1 security content"),
    ],
    pageCitations: [
      c(U.tvUpdates, "tvOS 12.1.1"),
      c(U.tv1211Security, "Released December 5, 2018"),
    ],
    summary:
      "tvOS 12.1.1 reached the public channel on December 5, 2018 with general performance and stability improvements and version-specific security repairs.",
    publicText:
      "Apple released tvOS 12.1.1 on December 5, 2018. Its consumer history characterizes the release only as general performance and stability maintenance.",
    publicCitations: [
      c(U.tvUpdates, "tvOS 12.1.1"),
      c(U.tv1211Security, "Released December 5, 2018"),
    ],
    scopeText:
      "The matching advisory supplies the concrete security scope. No unnamed maintenance item is converted into a more specific claim.",
    scopeCitations: [
      c(U.tvUpdates, "tvOS 12.1.1"),
      c(U.tv1211Security, "Airport; Disk Images; Kernel; Profiles; WebKit"),
    ],
    changes: [
      change({
        key: "tvos-12-1-1-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple documented tvOS 12.1.1 as containing general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer record confirms maintenance but does not identify an affected subsystem or symptom.",
        citations: [c(U.tvUpdates, "tvOS 12.1.1")],
      }),
      securityChange({
        key: "tvos-12-1-1-security-repairs",
        title: "tvOS 12.1.1 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in wireless networking, disk images, the kernel, configuration profiles, and WebKit.",
        summary:
          "Apple's advisory records privilege, code-execution, information-disclosure, denial-of-service, certificate-validation, and web-processing fixes.",
        url: U.tv1211Security,
        locator: "Airport; Disk Images; Kernel; Profiles; WebKit",
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
  join(here, "apple-other-2018.json"),
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

const md = `# Apple 2018 non-iPhone research batch

## Result

\`apple-other-2018.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2018. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.14 | 1 | ${platformChangeCount("macos")} |
| watchOS | 4.2.2, 4.3, 4.3.1, 5.0, 5.1, 5.1.2 | 6 | ${platformChangeCount("watchos")} |
| tvOS | 11.2.5, 11.3, 11.4, 12.0, 12.1, 12.1.1 | 6 | ${platformChangeCount("tvos")} |
| **Total** | **13 version articles** | **${events.length}** | **${eventChanges}** |

The 13 versions contain 96 existing local timeline milestones: 13 public appearances and 83 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 13 durable public routes through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 26 version/event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- All public events are indexable after editorial approval.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. All 13 local public dates match the explicitly dated release line in Apple's corresponding security advisory.
2. Apple's current watchOS 5 consumer history has no 5.1 section, moving from 5.0.1 to 5.1.1, while Apple's dedicated watchOS 5.1 security advisory confirms an October 30, 2018 release. The local 5.1 route is retained with security-only structured content and an explicit evidence boundary.
3. The existing-record-only catalog omits Apple-documented 2018 point releases: macOS 10.14.1 and 10.14.2; watchOS 4.2.3, 4.3.2, 5.0.1, and 5.1.1; and tvOS 11.2.6, 11.4.1, and 12.0.1. This batch does not create those missing releaseVersion records.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### macOS

- <${U.macNews}> — dated Mojave public availability and launch features
- <${U.macDeveloper}> — Mojave 10.14 developer changes, deprecations, known issues, and the explicit Group FaceTime deferral
- <${U.macSecurity}> — detailed Mojave 10.14 security content and release date

### watchOS

- <${U.watch4}> — watchOS 4 consumer update notes
- <${U.watch5}> — watchOS 5 consumer update notes, including the retained-history gap around 5.1
- <${U.watch5Preview}> — first-party watchOS 5 feature and compatibility framing
- <${U.watch512News}> — dated ECG and irregular-rhythm feature availability
- <${U.watch422Security}>
- <${U.watch43Security}>
- <${U.watch431Security}>
- <${U.watch5Security}>
- <${U.watch51Security}>
- <${U.watch512Security}>

### tvOS

- <${U.tvUpdates}> — Apple TV software-update notes
- <${U.tv1125Security}>
- <${U.tv113Security}>
- <${U.tv114Security}>
- <${U.tv12Security}>
- <${U.tv121Security}>
- <${U.tv1211Security}>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section and advisory release line.

## Known gaps

1. The nine Apple-documented 2018 point releases absent from the local catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. Apple's current consumer history gives no retained feature or ordinary-maintenance narrative for watchOS 5.1. The dedicated advisory confirms the release and security changes but does not explain the consumer-page omission; this batch does not infer a reason.
3. Apple's consumer notes enumerate no specific ordinary change for watchOS 4.2.2 or tvOS 11.2.5, 12.1, and 12.1.1 beyond broad maintenance descriptions.
4. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
5. The 83 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
6. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for the release, not proof that every advisory entry appeared on launch day.
7. Apple's developer notes explicitly defer Group FaceTime beyond the initial Mojave release, so it is excluded from the 10.14 launch record.
8. ECG and irregular-rhythm claims retain Apple's hardware, regional, and regulatory qualifications and are presented as historical product capabilities, not medical guidance.

## Validation

- Research-batch validation passed with 13 versions, 13 public events, 63 globally consistent change keys, 20 sources, and 234 citation references for this file.
- Inventory closure passed: 13 eligible local versions, 96 milestones, 13 public appearances, 83 non-public milestones, 20 of 20 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON byte-for-byte.
- Reviewed production plan: 81 creates, 26 revision-guarded patches, and 2,071 unchanged documents.
- Creates: 18 source documents and 63 change documents; zero version, event, or build creates. The plan included 13 version patches and 13 existing durable public-event patches.
- Mutation payload: 195,819 bytes, reported as 5.0% of the guarded limit.
- Applied production plan SHA: \`27830f41e366d996f8fa89ca6c4433c021c6c2cea5e6266273682da2c05b9f3c\`.
- Production transaction \`eOgq1Ovu5XNUv1qNFUbFZ1\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`52f9e9289f9e028b029ca2149a75f907d939aaf9f31ff62d7d5bfe0e3608300e\`.
- Post-apply zero-residual plan SHA: \`e97ea0661ba2b9e61cac367dc36c849f14c0a334c1698636f49f7bc32a0d88d7\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.14\`, \`/apple/watchos/5.1.2\`, and \`/apple/tvos/12.1.1\`.
`;

writeFileSync(join(here, "apple-other-2018.md"), md);
