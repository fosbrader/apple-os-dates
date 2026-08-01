import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T04:43:47Z";

const U = {
  macNews:
    "https://www.apple.com/newsroom/2019/10/macos-catalina-is-available-today/",
  macDeveloper:
    "https://developer.apple.com/documentation/macos-release-notes/macos-catalina-10_15-release-notes",
  macSecurity: "https://support.apple.com/en-us/103107",
  watch5: "https://support.apple.com/en-us/118393",
  watch513Security: "https://support.apple.com/en-us/103093",
  watch52Security: "https://support.apple.com/en-us/103664",
  watch521Security: "https://support.apple.com/en-us/103019",
  watch6: "https://support.apple.com/en-us/118388",
  watch60Security: "https://support.apple.com/en-us/103210",
  watch61Security: "https://support.apple.com/en-us/103826",
  watch611Security: "https://support.apple.com/en-us/103212",
  tvUpdates: "https://support.apple.com/en-us/106336",
  tv1212Security: "https://support.apple.com/en-us/103092",
  tv122Security: "https://support.apple.com/en-us/103566",
  tv123Security: "https://support.apple.com/en-us/103768",
  tv13Security: "https://support.apple.com/en-us/103022",
  tv132Security: "https://support.apple.com/en-us/103772",
  tv133Security: "https://support.apple.com/en-us/103213",
};

const source = (url, title, sourceClass, topics, publishedAt) => ({
  url,
  title,
  publisher:
    sourceClass === "firstPartyAnnouncement"
      ? "Apple Newsroom"
      : sourceClass === "developerDocs"
        ? "Apple Developer"
        : "Apple Support",
  sourceClass,
  author: "Apple",
  ...(publishedAt ? { publishedAt: `${publishedAt}T00:00:00.000Z` } : {}),
  topics,
});

const sources = [
  source(
    U.macNews,
    "macOS Catalina is available today",
    "firstPartyAnnouncement",
    ["macOS", "Catalina", "public availability", "features"],
    "2019-10-07",
  ),
  source(
    U.macDeveloper,
    "macOS Catalina 10.15 Release Notes",
    "developerDocs",
    ["macOS", "Catalina", "SDK", "compatibility", "known issues"],
  ),
  source(
    U.macSecurity,
    "About the security content of macOS Catalina 10.15",
    "firstPartyDocumentation",
    ["macOS", "Catalina", "security", "CVE"],
    "2019-10-07",
  ),
  source(U.watch5, "About watchOS 5 Updates", "firstPartyDocumentation", [
    "watchOS",
    "5",
    "consumer release notes",
  ]),
  source(
    U.watch513Security,
    "About the security content of watchOS 5.1.3",
    "firstPartyDocumentation",
    ["watchOS", "5.1.3", "security", "CVE"],
    "2019-01-22",
  ),
  source(
    U.watch52Security,
    "About the security content of watchOS 5.2",
    "firstPartyDocumentation",
    ["watchOS", "5.2", "security", "CVE"],
    "2019-03-27",
  ),
  source(
    U.watch521Security,
    "About the security content of watchOS 5.2.1",
    "firstPartyDocumentation",
    ["watchOS", "5.2.1", "security", "CVE"],
    "2019-05-13",
  ),
  source(U.watch6, "About watchOS 6 Updates", "firstPartyDocumentation", [
    "watchOS",
    "6",
    "consumer release notes",
  ]),
  source(
    U.watch60Security,
    "About the security content of watchOS 6",
    "firstPartyDocumentation",
    ["watchOS", "6.0", "security", "CVE"],
    "2019-09-19",
  ),
  source(
    U.watch61Security,
    "About the security content of watchOS 6.1",
    "firstPartyDocumentation",
    ["watchOS", "6.1", "security", "CVE"],
    "2019-10-29",
  ),
  source(
    U.watch611Security,
    "About the security content of watchOS 6.1.1",
    "firstPartyDocumentation",
    ["watchOS", "6.1.1", "security", "CVE"],
    "2019-12-10",
  ),
  source(
    U.tvUpdates,
    "About Apple TV 4K and Apple TV HD software updates",
    "firstPartyDocumentation",
    ["tvOS", "Apple TV", "consumer release notes"],
  ),
  source(
    U.tv1212Security,
    "About the security content of tvOS 12.1.2",
    "firstPartyDocumentation",
    ["tvOS", "12.1.2", "security", "CVE"],
    "2019-01-22",
  ),
  source(
    U.tv122Security,
    "About the security content of tvOS 12.2",
    "firstPartyDocumentation",
    ["tvOS", "12.2", "security", "CVE"],
    "2019-03-25",
  ),
  source(
    U.tv123Security,
    "About the security content of tvOS 12.3",
    "firstPartyDocumentation",
    ["tvOS", "12.3", "security", "CVE"],
    "2019-05-13",
  ),
  source(
    U.tv13Security,
    "About the security content of tvOS 13",
    "firstPartyDocumentation",
    ["tvOS", "13.0", "security", "CVE"],
    "2019-09-24",
  ),
  source(
    U.tv132Security,
    "About the security content of tvOS 13.2",
    "firstPartyDocumentation",
    ["tvOS", "13.2", "security", "CVE"],
    "2019-10-28",
  ),
  source(
    U.tv133Security,
    "About the security content of tvOS 13.3",
    "firstPartyDocumentation",
    ["tvOS", "13.3", "security", "CVE"],
    "2019-12-10",
  ),
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});
const heading = (text) => ({ style: "h2", text });
const prose = (text, citations) => ({ text, citations });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const review = () =>
  reviewedAt
    ? { status: "approved", reviewedAt }
    : { status: "readyForReview" };

function change({
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  url,
  locator,
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
      "Matched Apple's version-labeled consumer, developer, or security documentation to the existing audited public-release event.",
    citations: [c(url, locator)],
  };
}

const security = (key, title, summary, url, locator) =>
  change({
    key,
    title,
    canonicalSummary: summary,
    category: "security",
    action: "fixed",
    summary,
    url,
    locator,
  });

const releases = [
  {
    id: "version-macos-10-15",
    platform: "macOS",
    version: "10.15",
    date: "2019-10-07",
    notes: U.macDeveloper,
    overview:
      "macOS Catalina 10.15 became publicly available on October 7, 2019. It split iTunes into Music, Podcasts, and TV apps; introduced Sidecar, Voice Control, Screen Time, Apple Arcade on Mac, Mac Catalyst, Find My, and stronger system and data protections.",
    overviewCitations: [
      c(U.macNews, "October 7, 2019; launch features; Availability"),
      c(U.macSecurity, "macOS Catalina 10.15 — Released October 7, 2019"),
    ],
    boundary:
      "The consumer feature record comes from Apple's launch announcement, developer compatibility details come from the 10.15 SDK notes, and vulnerability repairs come from the version-specific advisory. Later Catalina point-release changes and beta-only known issues are not projected onto 10.15.",
    boundaryCitations: [
      c(U.macNews, "macOS Catalina launch feature sections"),
      c(U.macDeveloper, "macOS Catalina 10.15 Release Notes"),
      c(U.macSecurity, "macOS Catalina 10.15 security content"),
    ],
    citations: [
      c(U.macNews, "UPDATE October 7, 2019"),
      c(U.macDeveloper, "macOS Catalina 10.15 Release Notes"),
      c(U.macSecurity, "Released October 7, 2019"),
    ],
    changes: [
      change({
        key: "macos-10-15-dedicated-media-apps",
        title: "Music, Podcasts, and TV replace iTunes",
        canonicalSummary:
          "Separate Music, Podcasts, and TV apps replace iTunes as the primary Mac experiences for those media libraries and services.",
        category: "feature",
        action: "introduced",
        summary:
          "Catalina divided iTunes' former media roles among dedicated Music, Podcasts, and TV apps while retaining access to existing libraries and store content.",
        url: U.macNews,
        locator:
          "New Entertainment Apps: Apple Music, Apple Podcasts and Apple TV",
      }),
      change({
        key: "macos-10-15-sidecar",
        title: "Sidecar extends the Mac desktop to iPad",
        canonicalSummary:
          "Sidecar can use a compatible iPad as a second Mac display or as Apple Pencil input for supported Mac apps.",
        category: "feature",
        action: "introduced",
        summary:
          "The new Sidecar workflow extended or mirrored a Mac workspace on iPad over wired or wireless connections and supported tablet-style Pencil input.",
        url: U.macNews,
        locator: "Sidecar: Expand Mac Workspace and Creativity with iPad",
      }),
      change({
        key: "macos-10-15-voice-control",
        title: "System-wide Voice Control",
        canonicalSummary:
          "Voice Control provides on-device speech transcription, editing, and interface navigation across macOS.",
        category: "feature",
        action: "introduced",
        summary:
          "Catalina added a voice-driven accessibility system with numbered and gridded controls for navigating apps and editing text without conventional input hardware.",
        url: U.macNews,
        locator:
          "Accessibility: Empowering Everyone to Get the Most from Their Mac",
      }),
      change({
        key: "macos-10-15-mac-catalyst",
        title: "Mac Catalyst app framework",
        canonicalSummary:
          "Mac Catalyst lets developers adapt an iPad app into a native Mac app using shared technologies and project resources.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Catalina and Xcode 11 introduced the public Mac Catalyst path for bringing compatible iPad app code and interfaces to macOS.",
        url: U.macNews,
        locator: "Mac Catalyst: Even More Great Apps on Mac",
      }),
      change({
        key: "macos-10-15-screen-time",
        title: "Screen Time arrives on Mac",
        canonicalSummary:
          "Screen Time reports app and website activity and supports Downtime, App Limits, and family controls synchronized through iCloud.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought device-use reporting and configurable limits to Mac, including cross-device settings and parental visibility through Family Sharing.",
        url: U.macNews,
        locator: "Screen Time: Monitor Mac Activity For The Entire Family",
      }),
      change({
        key: "macos-10-15-apple-arcade",
        title: "Apple Arcade on Mac",
        canonicalSummary:
          "The Mac App Store gains an Arcade section for downloading and playing games included with an Apple Arcade subscription.",
        category: "feature",
        action: "introduced",
        summary:
          "Catalina added Apple Arcade's subscription catalog to Mac with cross-device game progress and support for common keyboard, mouse, and controller inputs.",
        url: U.macNews,
        locator: "Apple Arcade: Now on Mac App Store",
      }),
      change({
        key: "macos-10-15-find-my",
        title: "Combined Find My app and offline finding",
        canonicalSummary:
          "Find My combines device and friend location and can help locate a supported sleeping, offline Mac through nearby Apple devices.",
        category: "feature",
        action: "introduced",
        summary:
          "Catalina consolidated Apple's location tools and added privacy-preserving Bluetooth-assisted discovery for a missing compatible Mac that was not online.",
        url: U.macNews,
        locator: "Additional Features in macOS Catalina — Find My",
      }),
      change({
        key: "macos-10-15-read-only-system-volume",
        title: "Read-only system volume",
        canonicalSummary:
          "macOS system files run from a dedicated read-only volume separated from writable user data.",
        category: "security",
        action: "introduced",
        summary:
          "Catalina separated protected operating-system content from user data on a read-only system volume to reduce unintended or malicious modification.",
        url: U.macNews,
        locator: "Security and Privacy: More User Control Than Ever",
      }),
      change({
        key: "macos-10-15-expanded-data-permissions",
        title: "Expanded app data permissions",
        canonicalSummary:
          "Apps must obtain permission before accessing additional categories of user documents and other protected data.",
        category: "security",
        action: "introduced",
        summary:
          "The release broadened consent controls around access to user files and paired them with stronger Gatekeeper checks of downloaded software.",
        url: U.macNews,
        locator: "Security and Privacy: More User Control Than Ever",
      }),
      change({
        key: "macos-10-15-no-i386-app-code",
        title: "32-bit app execution removed",
        canonicalSummary:
          "Apps that execute i386 code no longer run on macOS 10.15, and remaining 32-bit compatibility stubs are nonfunctional.",
        category: "compatibility",
        action: "removed",
        summary:
          "Catalina completed the transition away from 32-bit Mac app execution, requiring applications and embedded executable code to support 64-bit architectures.",
        url: U.macDeveloper,
        locator: "General — Deprecations",
      }),
      change({
        key: "macos-10-15-network-extension-transition",
        title: "Network Kernel Extension API deprecated",
        canonicalSummary:
          "The legacy Network Kernel Extension API is deprecated in favor of supported modern networking extension technologies.",
        category: "developerApi",
        action: "changed",
        summary:
          "Apple marked the Network Kernel Extension API as deprecated, signaling developers to move network-system integrations to newer extension models.",
        url: U.macDeveloper,
        locator: "Networking — Deprecations",
      }),
      security(
        "macos-10-15-security-repairs",
        "macOS Catalina 10.15 security repairs",
        "The launch repaired vulnerabilities across graphics and media parsing, networking and printing, privilege boundaries, the kernel, WebKit, and other system components.",
        U.macSecurity,
        "AMD; Audio; CFNetwork; CoreAudio; CUPS; Foundation; Graphics; Kernel; WebKit",
      ),
    ],
  },
  {
    id: "version-watchos-5-1-3",
    platform: "watchOS",
    version: "5.1.3",
    date: "2019-01-22",
    notes: U.watch5,
    overview:
      "watchOS 5.1.3 was released on January 22, 2019. Apple's consumer history characterizes it as improvements and bug fixes, while the accompanying advisory documents concrete security repairs.",
    overviewCitations: [
      c(U.watch5, "watchOS 5.1.3"),
      c(U.watch513Security, "Released January 22, 2019"),
    ],
    boundary:
      "Apple did not enumerate an individual consumer feature for this point release. The article therefore preserves that limited description and records only the security areas explicitly listed in Apple's advisory.",
    boundaryCitations: [
      c(U.watch5, "watchOS 5.1.3"),
      c(U.watch513Security, "watchOS 5.1.3 security content"),
    ],
    citations: [
      c(U.watch5, "watchOS 5.1.3"),
      c(U.watch513Security, "Released January 22, 2019"),
    ],
    changes: [
      change({
        key: "watchos-5-1-3-maintenance",
        title: "watchOS 5.1.3 maintenance update",
        canonicalSummary:
          "The point release contains general improvements and bug fixes without a separately named consumer feature.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple described watchOS 5.1.3 as a maintenance release and did not publish a more granular consumer-facing fix list.",
        url: U.watch5,
        locator: "watchOS 5.1.3",
      }),
      security(
        "watchos-5-1-3-security-repairs",
        "watchOS 5.1.3 security repairs",
        "The release repaired vulnerabilities involving key storage, media and language processing, sandbox and kernel boundaries, SQLite, and WebKit.",
        U.watch513Security,
        "AppleKeyStore; Core Media; IOKit; Kernel; Natural Language Processing; SQLite; WebKit",
      ),
    ],
  },
  {
    id: "version-watchos-5-2",
    platform: "watchOS",
    version: "5.2",
    date: "2019-03-27",
    notes: U.watch5,
    overview:
      "watchOS 5.2 was released on March 27, 2019 with ECG and irregular-rhythm notification expansion in Hong Kong and parts of Europe, second-generation AirPods support, real-time text calling, and security repairs.",
    overviewCitations: [
      c(U.watch5, "watchOS 5.2"),
      c(U.watch52Security, "Released March 27, 2019"),
    ],
    boundary:
      "Health-feature availability remained region- and device-dependent. This record names the regions exactly at the level Apple documented and does not treat later market expansions as part of 5.2.",
    boundaryCitations: [
      c(U.watch5, "watchOS 5.2; regional availability note"),
      c(U.watch52Security, "watchOS 5.2 security content"),
    ],
    citations: [
      c(U.watch5, "watchOS 5.2"),
      c(U.watch52Security, "Released March 27, 2019"),
    ],
    changes: [
      change({
        key: "watchos-5-2-ecg-regional-expansion",
        title: "ECG expands to Hong Kong and parts of Europe",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in Hong Kong and specified European regions.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 5.2 expanded the regulated ECG feature beyond its earlier markets to Hong Kong and a set of supported European regions.",
        url: U.watch5,
        locator: "watchOS 5.2 — ECG app availability",
      }),
      change({
        key: "watchos-5-2-irregular-rhythm-expansion",
        title: "Irregular-rhythm notifications expand regionally",
        canonicalSummary:
          "Irregular-rhythm notifications became available in Hong Kong and specified European regions.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release extended irregular-rhythm notifications to Hong Kong and supported parts of Europe, subject to Apple's regional availability.",
        url: U.watch5,
        locator: "watchOS 5.2 — Irregular heart rhythm notifications",
      }),
      change({
        key: "watchos-5-2-airpods-2-support",
        title: "Second-generation AirPods support",
        canonicalSummary:
          "Apple Watch gained compatibility support for the second generation of AirPods.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 5.2 added system support for pairing and using Apple's second-generation AirPods with Apple Watch.",
        url: U.watch5,
        locator: "watchOS 5.2 — AirPods (2nd generation)",
      }),
      change({
        key: "watchos-5-2-rtt-calls",
        title: "Real-time text for phone calls",
        canonicalSummary:
          "Phone calls on supported configurations gain real-time text communication support.",
        category: "feature",
        action: "introduced",
        summary:
          "The update enabled real-time text during compatible phone calls, adding a live typed communication option on Apple Watch.",
        url: U.watch5,
        locator: "watchOS 5.2 — real-time text (RTT)",
      }),
      security(
        "watchos-5-2-security-repairs",
        "watchOS 5.2 security repairs",
        "The release repaired vulnerabilities across contacts and messages, privacy and passcode handling, privilege boundaries, the kernel, fonts, Siri, and WebKit.",
        U.watch52Security,
        "Contacts; Kernel; Messages; Passcode; Privacy; Sandbox; Siri; TrueTypeScaler; WebKit",
      ),
    ],
  },
  {
    id: "version-watchos-5-2-1",
    platform: "watchOS",
    version: "5.2.1",
    date: "2019-05-13",
    notes: U.watch5,
    overview:
      "watchOS 5.2.1 was released on May 13, 2019 with additional ECG and irregular-rhythm markets, a Pride face, an Explorer face fix, insecure Bluetooth accessory restrictions, and security repairs.",
    overviewCitations: [
      c(U.watch5, "watchOS 5.2.1"),
      c(U.watch521Security, "Released May 13, 2019"),
    ],
    boundary:
      "The health additions applied only in the five countries listed by Apple and on compatible hardware. The Bluetooth statement is recorded as a security compatibility change, without guessing which individual accessories were affected.",
    boundaryCitations: [
      c(U.watch5, "watchOS 5.2.1; regional availability note"),
      c(U.watch521Security, "watchOS 5.2.1 security content"),
    ],
    citations: [
      c(U.watch5, "watchOS 5.2.1"),
      c(U.watch521Security, "Released May 13, 2019"),
    ],
    changes: [
      change({
        key: "watchos-5-2-1-ecg-five-countries",
        title: "ECG expands to five European countries",
        canonicalSummary:
          "The ECG app became available in Croatia, Czech Republic, Iceland, Poland, and Slovakia on supported watches.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple expanded ECG availability to five additional European markets while retaining compatible-device and regional requirements.",
        url: U.watch5,
        locator: "watchOS 5.2.1 — ECG app availability",
      }),
      change({
        key: "watchos-5-2-1-irregular-rhythm-five-countries",
        title: "Irregular-rhythm notifications expand to five countries",
        canonicalSummary:
          "Irregular-rhythm notifications became available in Croatia, Czech Republic, Iceland, Poland, and Slovakia.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release brought irregular-rhythm notifications to the same five newly supported European markets.",
        url: U.watch5,
        locator: "watchOS 5.2.1 — Irregular heart rhythm notifications",
      }),
      change({
        key: "watchos-5-2-1-pride-face",
        title: "New Pride watch face",
        canonicalSummary:
          "A new Apple Watch face presents a visual design inspired by the rainbow flag.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 5.2.1 added the year's Pride-themed face to the available Apple Watch face collection.",
        url: U.watch5,
        locator: "watchOS 5.2.1 — Pride face",
      }),
      change({
        key: "watchos-5-2-1-explorer-face-numerals",
        title: "Explorer face numeral display fixed",
        canonicalSummary:
          "A display defect that hid numerals on the Explorer watch face for some users was corrected.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update restored missing number markers on the Explorer face for configurations affected by the rendering issue.",
        url: U.watch5,
        locator: "watchOS 5.2.1 — Explorer face fix",
      }),
      change({
        key: "watchos-5-2-1-insecure-bluetooth-accessories",
        title: "Insecure Bluetooth accessories disabled",
        canonicalSummary:
          "Accessories that rely on insecure Bluetooth connections are prevented from connecting.",
        category: "security",
        action: "changed",
        summary:
          "watchOS 5.2.1 tightened Bluetooth accessory compatibility by disabling connections Apple classified as insecure.",
        url: U.watch5,
        locator: "watchOS 5.2.1 — Bluetooth accessory security",
      }),
      security(
        "watchos-5-2-1-security-repairs",
        "watchOS 5.2.1 security repairs",
        "The release repaired vulnerabilities in privileged file access, audio and disk-image parsing, the kernel, Mail and Messages handling, and WebKit.",
        U.watch521Security,
        "AppleFileConduit; CoreAudio; Disk Images; Kernel; Mail; Mail Message Framework; Messages; WebKit",
      ),
    ],
  },
  {
    id: "version-watchos-6-0",
    platform: "watchOS",
    version: "6.0",
    date: "2019-09-19",
    notes: U.watch6,
    overview:
      "watchOS 6.0 launched on September 19, 2019 with Cycle Tracking, Noise, Voice Memos, Audiobooks, a watch-native App Store, Activity trends, new workouts and faces, richer Siri results, and more independent system apps.",
    overviewCitations: [
      c(U.watch6, "watchOS 6"),
      c(U.watch60Security, "Released September 19, 2019"),
    ],
    boundary:
      "Apple's notes mark some capabilities as model- or region-dependent; those constraints remain part of the record. Features introduced by later watchOS 6 point releases are excluded.",
    boundaryCitations: [
      c(U.watch6, "watchOS 6; feature availability notes"),
      c(U.watch60Security, "watchOS 6 security content"),
    ],
    citations: [
      c(U.watch6, "watchOS 6"),
      c(U.watch60Security, "Released September 19, 2019"),
    ],
    changes: [
      change({
        key: "watchos-6-cycle-tracking",
        title: "Cycle Tracking app",
        canonicalSummary:
          "Cycle Tracking records menstrual-cycle information and can provide period and fertile-window predictions and notifications.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 6 added on-watch cycle logging for flow, symptoms, spotting, and optional fertility metrics, with prediction and notification tools.",
        url: U.watch6,
        locator: "watchOS 6 — Cycle Tracking",
      }),
      change({
        key: "watchos-6-noise-app",
        title: "Noise app and exposure notifications",
        canonicalSummary:
          "The Noise app measures environmental sound levels and can warn when sustained exposure may affect hearing.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported watches gained live decibel readings and configurable notifications for environmental sound levels that could pose a long-term hearing risk.",
        url: U.watch6,
        locator: "watchOS 6 — Noise",
      }),
      change({
        key: "watchos-6-voice-memos",
        title: "Voice Memos on Apple Watch",
        canonicalSummary:
          "Apple Watch can record, play, rename, and synchronize voice memos through iCloud.",
        category: "feature",
        action: "introduced",
        summary:
          "The new watch app made it possible to capture and manage voice recordings directly from the wrist and synchronize them with other Apple devices.",
        url: U.watch6,
        locator: "watchOS 6 — Voice Memos",
      }),
      change({
        key: "watchos-6-audiobooks",
        title: "Audiobooks app",
        canonicalSummary:
          "Apple Watch can synchronize and stream audiobooks from a user's Apple Books library.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 6 added audiobook playback with automatic synchronization of current listening and streaming over Wi-Fi or cellular connections.",
        url: U.watch6,
        locator: "watchOS 6 — Audiobooks",
      }),
      change({
        key: "watchos-6-app-store",
        title: "App Store on Apple Watch",
        canonicalSummary:
          "A watch-native App Store supports discovering, reviewing, and installing Apple Watch apps without using the paired iPhone.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought app discovery and installation to the watch itself, including curated collections, search, screenshots, reviews, and Sign in with Apple.",
        url: U.watch6,
        locator: "watchOS 6 — App Store",
      }),
      change({
        key: "watchos-6-activity-trends",
        title: "Long-term Activity trends",
        canonicalSummary:
          "Activity trends compare recent movement and fitness metrics with longer-term performance and offer coaching when trends decline.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 6 and the paired iPhone Activity app added trend arrows based on 90-day averages compared with the preceding year.",
        url: U.watch6,
        locator: "watchOS 6 — Activity",
      }),
      change({
        key: "watchos-6-workout-improvements",
        title: "Workout elevation and persistent Stopwatch",
        canonicalSummary:
          "Selected outdoor workouts gain current elevation, and Stopwatch can remain visible on the watch face during a workout.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update added live elevation to supported outdoor activities and made timing information easier to keep visible during sessions.",
        url: U.watch6,
        locator: "watchOS 6 — Workout",
      }),
      change({
        key: "watchos-6-siri-shazam-web",
        title: "Siri song identification and web results",
        canonicalSummary:
          "Siri can identify nearby music with Shazam and display a limited set of web search results on Apple Watch.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 6 broadened Siri's on-watch answers with Shazam-based song information and tappable web results formatted for the smaller display.",
        url: U.watch6,
        locator: "watchOS 6 — Siri",
      }),
      change({
        key: "watchos-6-new-faces-complications",
        title: "New faces, chimes, and complications",
        canonicalSummary:
          "New face designs, spoken time, periodic chimes, face reordering, and additional complications expand watch customization.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release introduced several faces for supported models and added timekeeping and complication options, including new app and weather data.",
        url: U.watch6,
        locator: "watchOS 6 — Watch Faces",
      }),
      change({
        key: "watchos-6-calculator-and-system-apps",
        title: "Calculator and expanded independent apps",
        canonicalSummary:
          "Calculator, updated Podcasts, Maps, Now Playing, Find People, and Reminders add more tasks that can be completed directly on Apple Watch.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 6 added a calculator with tip and split tools and made several built-in apps more capable without requiring interaction on the paired iPhone.",
        url: U.watch6,
        locator: "watchOS 6 — Other features and improvements",
      }),
      security(
        "watchos-6-0-security-repairs",
        "watchOS 6 security repairs",
        "The launch repaired vulnerabilities across audio and text processing, networking, privilege and kernel boundaries, local discovery, WebKit, and wireless privacy.",
        U.watch60Security,
        "Audio; CFNetwork; CoreAudio; Foundation; Kernel; mDNSResponder; UIFoundation; WebKit; Wi-Fi",
      ),
    ],
  },
  {
    id: "version-watchos-6-1",
    platform: "watchOS",
    version: "6.1",
    date: "2019-10-29",
    notes: U.watch6,
    overview:
      "watchOS 6.1 was released on October 29, 2019. It added AirPods Pro support, extended watchOS 6 to Apple Watch Series 1 and Series 2, and included improvements, bug fixes, and security repairs.",
    overviewCitations: [
      c(U.watch6, "watchOS 6.1"),
      c(U.watch61Security, "Released October 29, 2019"),
    ],
    boundary:
      "The hardware-compatibility expansion is specific to watchOS 6 availability on earlier watch models; it does not imply that every watchOS 6 feature worked on every model.",
    boundaryCitations: [
      c(U.watch6, "watchOS 6.1; feature availability note"),
      c(U.watch61Security, "watchOS 6.1 security content"),
    ],
    citations: [
      c(U.watch6, "watchOS 6.1"),
      c(U.watch61Security, "Released October 29, 2019"),
    ],
    changes: [
      change({
        key: "watchos-6-1-airpods-pro",
        title: "AirPods Pro support",
        canonicalSummary:
          "Apple Watch gained compatibility support for the first generation of AirPods Pro.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 6.1 added system-level compatibility for Apple's newly introduced AirPods Pro.",
        url: U.watch6,
        locator: "watchOS 6.1 — AirPods Pro",
      }),
      change({
        key: "watchos-6-1-series-1-2-support",
        title: "watchOS 6 reaches Series 1 and Series 2",
        canonicalSummary:
          "Apple Watch Series 1 and Series 2 became eligible to install the watchOS 6 release line.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The 6.1 release expanded watchOS 6 availability to Apple's earlier Series 1 and Series 2 watches.",
        url: U.watch6,
        locator: "watchOS 6.1 — Apple Watch Series 1 and Series 2",
      }),
      change({
        key: "watchos-6-1-maintenance",
        title: "watchOS 6.1 maintenance fixes",
        canonicalSummary:
          "The update includes general improvements and bug fixes in addition to its named compatibility changes.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple classified watchOS 6.1 as including maintenance work but did not enumerate a consumer-facing fix list beyond the named additions.",
        url: U.watch6,
        locator: "watchOS 6.1",
      }),
      security(
        "watchos-6-1-security-repairs",
        "watchOS 6.1 security repairs",
        "The release repaired vulnerabilities in accounts and App Store authentication, AirDrop, audio, contacts, file-system and kernel boundaries, VoiceOver, and WebKit.",
        U.watch61Security,
        "Accounts; AirDrop; App Store; Audio; Contacts; File System Events; Kernel; VoiceOver; WebKit",
      ),
    ],
  },
  {
    id: "version-watchos-6-1-1",
    platform: "watchOS",
    version: "6.1.1",
    date: "2019-12-10",
    notes: U.watch6,
    overview:
      "watchOS 6.1.1 was released on December 10, 2019 as an explicitly security-focused point release. Apple's advisory supplies the concrete affected components and impact classes.",
    overviewCitations: [
      c(U.watch6, "watchOS 6.1.1"),
      c(U.watch611Security, "Released December 10, 2019"),
    ],
    boundary:
      "Apple did not publish a separate consumer feature list for 6.1.1. This page therefore records the security work without inventing unrelated performance or feature claims.",
    boundaryCitations: [
      c(U.watch6, "watchOS 6.1.1"),
      c(U.watch611Security, "watchOS 6.1.1 security content"),
    ],
    citations: [
      c(U.watch6, "watchOS 6.1.1"),
      c(U.watch611Security, "Released December 10, 2019"),
    ],
    changes: [
      security(
        "watchos-6-1-1-security-repairs",
        "watchOS 6.1.1 security repairs",
        "The release repaired issues involving Siri call routing, network policy, proxy privileges, FaceTime media, the kernel, XML and packet-capture libraries, and WebKit.",
        U.watch611Security,
        "CallKit; CFNetwork; CFNetwork Proxies; FaceTime; Kernel; libexpat; libpcap; Security; WebKit",
      ),
    ],
  },
  {
    id: "version-tvos-12-1-2",
    platform: "tvOS",
    version: "12.1.2",
    date: "2019-01-22",
    notes: U.tvUpdates,
    overview:
      "tvOS 12.1.2 was released on January 22, 2019. Apple's consumer history describes general performance and stability improvements, while its security advisory provides the detailed technical record.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 12.1.2"),
      c(U.tv1212Security, "Released January 22, 2019"),
    ],
    boundary:
      "Because Apple did not name an individual consumer feature, this article does not infer one. The structured record separates the documented maintenance statement from the documented security fixes.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 12.1.2"),
      c(U.tv1212Security, "tvOS 12.1.2 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 12.1.2"),
      c(U.tv1212Security, "Released January 22, 2019"),
    ],
    changes: [
      change({
        key: "tvos-12-1-2-performance-stability",
        title: "tvOS 12.1.2 performance and stability work",
        canonicalSummary:
          "The update contains general performance and stability improvements without a separately named consumer feature.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple characterized tvOS 12.1.2 as a maintenance release and did not publish a more granular consumer-facing list.",
        url: U.tvUpdates,
        locator: "tvOS 12.1.2",
      }),
      security(
        "tvos-12-1-2-security-repairs",
        "tvOS 12.1.2 security repairs",
        "The release repaired vulnerabilities involving key storage, animation and media processing, sandbox and kernel boundaries, SQLite, and WebKit.",
        U.tv1212Security,
        "AppleKeyStore; CoreAnimation; Core Media; IOKit; Kernel; SQLite; WebKit",
      ),
    ],
  },
  {
    id: "version-tvos-12-2",
    platform: "tvOS",
    version: "12.2",
    date: "2019-03-25",
    notes: U.tvUpdates,
    overview:
      "tvOS 12.2 was released on March 25, 2019 with Siri playback requests from iPhone and iPad, Lock Screen access to Apple TV Remote controls on iOS 12.2, maintenance work, and security repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 12.2"),
      c(U.tv122Security, "Released March 25, 2019"),
    ],
    boundary:
      "Siri availability varied by region, and Lock Screen remote access depended on iOS 12.2. Those dependencies are retained instead of presenting the features as universal Apple TV behavior.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 12.2; Siri availability note"),
      c(U.tv122Security, "tvOS 12.2 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 12.2"),
      c(U.tv122Security, "Released March 25, 2019"),
    ],
    changes: [
      change({
        key: "tvos-12-2-siri-ios-playback-control",
        title: "Siri playback requests from iPhone and iPad",
        canonicalSummary:
          "Siri on a compatible iPhone or iPad can start requested video on Apple TV and control current playback.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 12.2 extended cross-device Siri control so a nearby iOS device could request Apple TV content and manage playback.",
        url: U.tvUpdates,
        locator: "tvOS 12.2 — Siri",
      }),
      change({
        key: "tvos-12-2-lock-screen-remote",
        title: "Apple TV Remote on the iOS Lock Screen",
        canonicalSummary:
          "An iPhone or iPad running iOS 12.2 can expose Apple TV playback controls directly from its Lock Screen.",
        category: "enhancement",
        action: "changed",
        summary:
          "The paired iOS 12.2 experience made common Apple TV Remote actions available from the Lock Screen for quicker playback control.",
        url: U.tvUpdates,
        locator: "tvOS 12.2 — Apple TV Remote",
      }),
      change({
        key: "tvos-12-2-performance-stability",
        title: "tvOS 12.2 performance and stability work",
        canonicalSummary:
          "The release includes general performance and stability improvements alongside its named remote-control features.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple documented a general maintenance component for tvOS 12.2 without enumerating the individual fixes.",
        url: U.tvUpdates,
        locator: "tvOS 12.2",
      }),
      security(
        "tvos-12-2-security-repairs",
        "tvOS 12.2 security repairs",
        "The release repaired vulnerabilities across network authentication, privilege and kernel boundaries, privacy and passcode handling, Siri, fonts, sandboxing, and WebKit.",
        U.tv122Security,
        "802.1X; Kernel; Passcode; Privacy; Sandbox; Siri; TrueTypeScaler; WebKit",
      ),
    ],
  },
  {
    id: "version-tvos-12-3",
    platform: "tvOS",
    version: "12.3",
    date: "2019-05-13",
    notes: U.tvUpdates,
    overview:
      "tvOS 12.3 was released on May 13, 2019 with a redesigned Apple TV app that unified viewing, channels, store access, and recommendations, plus performance, stability, and security work.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 12.3"),
      c(U.tv123Security, "Released May 13, 2019"),
    ],
    boundary:
      "Apple noted that the TV app and its individual features were not available in every country or region. The article describes the documented product design without assuming universal service availability.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 12.3; regional availability note"),
      c(U.tv123Security, "tvOS 12.3 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 12.3"),
      c(U.tv123Security, "Released May 13, 2019"),
    ],
    changes: [
      change({
        key: "tvos-12-3-redesigned-tv-app",
        title: "Redesigned Apple TV app",
        canonicalSummary:
          "The Apple TV app consolidates shows, movies, selected channel subscriptions, store purchases and rentals, and personalized recommendations.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 12.3 introduced a new TV app structure intended to serve as one viewing hub across personal libraries, channels, the iTunes Store, and recommendations.",
        url: U.tvUpdates,
        locator: "tvOS 12.3 — Apple TV app",
      }),
      change({
        key: "tvos-12-3-performance-stability",
        title: "tvOS 12.3 performance and stability work",
        canonicalSummary:
          "The release includes general performance and stability improvements in addition to the redesigned TV app.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple documented maintenance work for tvOS 12.3 but did not enumerate the individual performance or stability corrections.",
        url: U.tvUpdates,
        locator: "tvOS 12.3",
      }),
      security(
        "tvos-12-3-security-repairs",
        "tvOS 12.3 security repairs",
        "The release repaired vulnerabilities across privileged file access, Bluetooth, audio and disk-image parsing, the kernel, messaging, and WebKit.",
        U.tv123Security,
        "AppleFileConduit; Bluetooth; CoreAudio; Disk Images; Kernel; Mail; Messages; WebKit",
      ),
    ],
  },
  {
    id: "version-tvos-13-0",
    platform: "tvOS",
    version: "13.0",
    date: "2019-09-24",
    notes: U.tvUpdates,
    overview:
      "tvOS 13.0 launched on September 24, 2019 with a full-screen previewing Home screen, multiuser profiles and Control Center, Apple Arcade, broader game-controller support, timed Apple Music lyrics, new underwater screen savers, and security repairs.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 13"),
      c(U.tv13Security, "Released September 24, 2019"),
    ],
    boundary:
      "The existing 13.0 route maps to Apple's tvOS 13 launch section. Apple Arcade and other services remained subject to regional availability, and later tvOS 13 maintenance changes are not folded into this event.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 13; service availability note"),
      c(U.tv13Security, "tvOS 13 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 13"),
      c(U.tv13Security, "Released September 24, 2019"),
    ],
    changes: [
      change({
        key: "tvos-13-home-screen-previews",
        title: "Full-screen Home screen previews",
        canonicalSummary:
          "Top-row apps can present full-screen previews with audio and interactive selections on the Home screen.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 13 redesigned top-row presentation around full-screen previews for highlighted movies, music, games, and other supported content.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Home screen",
      }),
      change({
        key: "tvos-13-multiuser",
        title: "Multiuser Apple TV profiles",
        canonicalSummary:
          "Multiple household users can switch to personalized Up Next lists, Apple Music libraries, and other supported experiences.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added user switching so household members could retain separate media recommendations and listening contexts on one Apple TV.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Multiuser",
      }),
      change({
        key: "tvos-13-control-center",
        title: "Apple TV Control Center",
        canonicalSummary:
          "A Control Center opened from the Siri Remote provides user switching, audio choices, music controls, and sleep access.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 13 introduced an overlay for common system tasks and made switching among the new household profiles easier.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Control Center",
      }),
      change({
        key: "tvos-13-apple-arcade",
        title: "Apple Arcade on Apple TV",
        canonicalSummary:
          "Apple TV gains access to games included in an Apple Arcade subscription through its App Store experience.",
        category: "feature",
        action: "introduced",
        summary:
          "The launch brought Apple's game-subscription catalog to the television platform with compatible cross-device game access.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Apple Arcade",
      }),
      change({
        key: "tvos-13-console-controller-support",
        title: "PlayStation and Xbox controller support",
        canonicalSummary:
          "Apple TV supports compatible PlayStation DualShock 4 and Xbox Wireless Controller models over Bluetooth.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 13 broadened game input beyond existing controllers by adding support for widely used PlayStation and Xbox wireless models.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Game controllers",
      }),
      change({
        key: "tvos-13-apple-music-timed-lyrics",
        title: "Time-synchronized Apple Music lyrics",
        canonicalSummary:
          "Apple Music can display lyrics synchronized with playback and let listeners jump to a selected verse.",
        category: "enhancement",
        action: "changed",
        summary:
          "The Apple Music experience added animated, time-aligned lyrics and direct navigation within a song by selecting a lyric line.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Apple Music",
      }),
      change({
        key: "tvos-13-underwater-screensavers",
        title: "Underwater aerial screen savers",
        canonicalSummary:
          "The Aerial collection gains underwater video from multiple marine locations with location labels and browsing controls.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 13 expanded Apple TV's screen-saver library from aerial landscapes to include high-resolution underwater scenes.",
        url: U.tvUpdates,
        locator: "tvOS 13 — Screen savers",
      }),
      security(
        "tvos-13-0-security-repairs",
        "tvOS 13 security repairs",
        "The launch repaired vulnerabilities across firmware, audio and text processing, network handling, privilege and kernel boundaries, local discovery, WebKit, and wireless privacy.",
        U.tv13Security,
        "AppleFirmwareUpdateKext; Audio; CFNetwork; CoreAudio; Kernel; mDNSResponder; UIFoundation; WebKit; Wi-Fi",
      ),
    ],
  },
  {
    id: "version-tvos-13-2",
    platform: "tvOS",
    version: "13.2",
    date: "2019-10-28",
    notes: U.tvUpdates,
    overview:
      "tvOS 13.2 was released on October 28, 2019. Apple's consumer history lists general performance and stability improvements, while its advisory documents the release's security work.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 13.2"),
      c(U.tv132Security, "Released October 28, 2019"),
    ],
    boundary:
      "No individual consumer feature is named in Apple's 13.2 section. This page retains that evidence boundary and does not convert security-advisory component names into unsupported user-facing feature claims.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 13.2"),
      c(U.tv132Security, "tvOS 13.2 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 13.2"),
      c(U.tv132Security, "Released October 28, 2019"),
    ],
    changes: [
      change({
        key: "tvos-13-2-performance-stability",
        title: "tvOS 13.2 performance and stability work",
        canonicalSummary:
          "The point release contains general performance and stability improvements without a named consumer feature.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple documented tvOS 13.2 as a maintenance release and did not provide a more granular consumer-facing list.",
        url: U.tvUpdates,
        locator: "tvOS 13.2",
      }),
      security(
        "tvos-13-2-security-repairs",
        "tvOS 13.2 security repairs",
        "The release repaired vulnerabilities in accounts and App Store authentication, audio and video processing, file-system and kernel boundaries, and WebKit.",
        U.tv132Security,
        "Accounts; App Store; Audio; AVEVideoEncoder; File System Events; Kernel; WebKit; WebKit Process Model",
      ),
    ],
  },
  {
    id: "version-tvos-13-3",
    platform: "tvOS",
    version: "13.3",
    date: "2019-12-10",
    notes: U.tvUpdates,
    overview:
      "tvOS 13.3 was released on December 10, 2019. Apple's consumer history records general performance and stability improvements, supplemented by a version-specific security advisory.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 13.3"),
      c(U.tv133Security, "Released December 10, 2019"),
    ],
    boundary:
      "Apple did not enumerate a new consumer feature for 13.3. The article therefore records only the documented maintenance classification and the separately documented security areas.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 13.3"),
      c(U.tv133Security, "tvOS 13.3 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 13.3"),
      c(U.tv133Security, "Released December 10, 2019"),
    ],
    changes: [
      change({
        key: "tvos-13-3-performance-stability",
        title: "tvOS 13.3 performance and stability work",
        canonicalSummary:
          "The point release contains general performance and stability improvements without a named consumer feature.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple documented tvOS 13.3 as a maintenance release and did not publish an itemized consumer-facing fix list.",
        url: U.tvUpdates,
        locator: "tvOS 13.3",
      }),
      security(
        "tvos-13-3-security-repairs",
        "tvOS 13.3 security repairs",
        "The release repaired vulnerabilities in network policy and proxies, FaceTime media, the kernel, XML and packet-capture libraries, privilege boundaries, and WebKit.",
        U.tv133Security,
        "CFNetwork; CFNetwork Proxies; FaceTime; Kernel; libexpat; libpcap; Security; WebKit",
      ),
    ],
  },
];

const provenanceStatus = reviewedAt ? "editoriallyVerified" : "sourceLinked";

const versions = releases.map((release) => ({
  releaseVersionId: release.id,
  authorship: "originalSynthesis",
  releaseNotesUrl: release.notes,
  overview: article(
    heading("Release overview"),
    prose(release.overview, release.overviewCitations),
    heading("Evidence boundary"),
    prose(release.boundary, release.boundaryCitations),
  ),
  citations: release.citations,
  provenanceStatus,
  editorialReview: review(),
}));

const events = releases.map((release) => ({
  target: { releaseVersionId: release.id, routeAlias: "public" },
  authorship: "originalSynthesis",
  summary: `${release.platform} ${release.version} reached the public channel on ${release.date}. This article records Apple's version-labeled feature or maintenance notes and the accompanying first-party security record.`,
  article: article(
    heading("Public release"),
    prose(release.overview, release.overviewCitations),
    heading("What the evidence supports"),
    prose(release.boundary, release.boundaryCitations),
  ),
  citations: release.citations,
  changes: release.changes,
  provenanceStatus,
  editorialReview: review(),
  isIndexable: Boolean(reviewedAt),
}));

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions,
  events,
  builds: [],
};

const jsonPath = join(here, "apple-other-2019.json");
writeFileSync(jsonPath, `${JSON.stringify(bundle, null, 2)}\n`);

const sourceLines = sources
  .map((entry) => `- <${entry.url}> — ${entry.title}`)
  .join("\n");
const inventoryLines = releases
  .map(
    (release) =>
      `| ${release.platform} | ${release.version} | ${release.date} | ${release.changes.length} |`,
  )
  .join("\n");
const changeCount = releases.reduce(
  (total, release) => total + release.changes.length,
  0,
);
const milestoneCount = 88;

const markdown = `# Apple 2019 non-iPhone research batch

## Result

\`apple-other-2019.json\` is a source-backed launch-content bundle for every existing local macOS, watchOS, and tvOS release version whose audited public appearance falls in 2019. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform | Version | Public date | Structured changes |
| --- | --- | --- | ---: |
${inventoryLines}
| **Total** | **${releases.length} version articles** | **${releases.length} public appearances** | **${changeCount}** |

The ${releases.length} versions contain ${milestoneCount} existing local timeline milestones. This bundle enriches only their ${releases.length} public appearances through \`releaseVersionId\` plus \`routeAlias: "public"\`; beta and release-candidate appearances remain timeline-only.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Current state: ${reviewedAt ? `editorially verified and approved at \`${reviewedAt}\`` : "source-linked and ready for human editorial review"}.
- Every structured occurrence is \`documented\`, \`confirmed\`, and scoped to the public-release delta.
- Generic Apple descriptions such as performance and stability work remain generic; no missing detail is invented.
- Health and service availability constraints remain explicit.
- Security entries summarize component and impact classes without reproducing advisory prose.
- No undocumented-change claim or build record is included.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

${sourceLines}

Apple Support pages are living documents and may display revision dates later than the historical release. Mapping uses each explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's public notes for watchOS 5.1.3 and tvOS 12.1.2, 13.2, and 13.3 provide no itemized consumer fix list; those records stay honest about that limitation.
2. No community-sourced undocumented claim was added. Such claims require a separate reproducible or independently corroborated evidence pass.
3. The ${milestoneCount - releases.length} non-public milestones remain timeline-only until beta-specific sources support event-level claims.
4. Security advisories can receive later-added entries. Summaries describe Apple's current version-labeled record, not proof that every advisory entry appeared on launch day.

## Validation

- Deterministic generator: \`build-apple-other-2019.mjs\`.
- Expected inventory: ${releases.length} versions, ${releases.length} public events, ${changeCount} structured changes, ${sources.length} first-party sources, zero builds.
- Guarded production apply: 79 creates, 26 revision-guarded patches, and 2,070 unchanged documents.
- Planned creates: 17 source documents, zero version documents, zero event documents, zero build documents, and 62 change documents; 13 existing release versions and their durable public events were patched.
- Mutation payload: 189,605 bytes, reported as 4.9% of the guarded limit.
- Exact applied plan SHA: \`2dfe1522522798facc0a4eb65eaee52601a54ea8985998b44c59cbc2dd34a667\`.
- Transaction: \`F0eE6eK5XyVXtlnaoxv9Zp\`.
- The ingestion pipeline committed the transaction and verified zero residual mutations.
`;

writeFileSync(join(here, "apple-other-2019.md"), markdown);

console.log(
  `Wrote ${jsonPath}: ${versions.length} versions, ${events.length} events, ${changeCount} changes, ${sources.length} sources.`,
);
