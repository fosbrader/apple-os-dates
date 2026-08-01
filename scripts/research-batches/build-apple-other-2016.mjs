import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:26:52Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/103178",
  macNews:
    "https://www.apple.com/newsroom/2016/09/macos-sierra-now-available-as-a-free-update/",
  macSecurity: "https://support.apple.com/en-us/103424",
  watch2: "https://support.apple.com/en-us/106617",
  watch3: "https://support.apple.com/en-us/106644",
  watch311News:
    "https://www.apple.com/newsroom/2016/12/apple-adds-hundreds-of-new-and-redesigned-emoji-in-ios-102/",
  watch22Security: "https://support.apple.com/en-us/103523",
  watch221Security: "https://support.apple.com/en-us/103524",
  watch222Security: "https://support.apple.com/en-us/103527",
  watch3Security: "https://support.apple.com/en-us/103800",
  watch31Security: "https://support.apple.com/en-us/103529",
  tv10Preview:
    "https://www.apple.com/newsroom/2016/06/apple-tv-gets-new-siri-capabilities-and-single-sign-on/",
  tv101News:
    "https://www.apple.com/newsroom/2016/10/apple-unveils-new-tv-app-for-apple-tv-iphone-and-ipad.html",
  tv92Security: "https://support.apple.com/en-us/103408",
  tv921Security: "https://support.apple.com/en-us/103414",
  tv922Security: "https://support.apple.com/en-us/103418",
  tv10Security: "https://support.apple.com/en-us/103071",
  tv101Security: "https://support.apple.com/en-us/103435",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2016 to 2017)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["Apple software", "2016", "release dates", "security updates"],
  },
  {
    url: U.macNews,
    title: "macOS Sierra now available as a free update",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2016-09-20T00:00:00.000Z",
    topics: ["macOS", "Sierra", "10.12", "availability", "features"],
  },
  {
    url: U.macSecurity,
    title: "About the security content of macOS Sierra 10.12",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-09-20T00:00:00.000Z",
    topics: ["macOS", "Sierra", "10.12", "security", "CVE"],
  },
  {
    url: U.watch2,
    title: "Download watchOS 2.0 - 2.2.2 Information",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "2", "consumer release notes"],
  },
  {
    url: U.watch3,
    title: "About watchOS 3 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "3", "consumer release notes"],
  },
  {
    url: U.watch311News,
    title: "Apple adds hundreds of new and redesigned emoji in iOS 10.2",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2016-12-12T00:00:00.000Z",
    topics: ["watchOS", "3.1.1", "emoji", "availability"],
  },
  {
    url: U.watch22Security,
    title: "About the security content of watchOS 2.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "2.2", "security", "CVE"],
  },
  {
    url: U.watch221Security,
    title: "About the security content of watchOS 2.2.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "2.2.1", "security", "CVE"],
  },
  {
    url: U.watch222Security,
    title: "About the security content of watchOS 2.2.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-07-18T00:00:00.000Z",
    topics: ["watchOS", "2.2.2", "security", "CVE"],
  },
  {
    url: U.watch3Security,
    title: "About the security content of watchOS 3",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-09-13T00:00:00.000Z",
    topics: ["watchOS", "3", "security", "CVE"],
  },
  {
    url: U.watch31Security,
    title: "About the security content of watchOS 3.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-10-24T00:00:00.000Z",
    topics: ["watchOS", "3.1", "security", "CVE"],
  },
  {
    url: U.tv10Preview,
    title:
      "Powerful new Siri capabilities and single sign-on are coming to Apple TV",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2016-06-13T00:00:00.000Z",
    topics: ["tvOS", "10", "Apple TV", "features", "developer APIs"],
  },
  {
    url: U.tv101News,
    title: "Apple unveils new TV app for Apple TV, iPhone and iPad",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2016-10-27T00:00:00.000Z",
    topics: ["tvOS", "10.1", "TV app", "single sign-on"],
  },
  {
    url: U.tv92Security,
    title: "About the security content of tvOS 9.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["tvOS", "9.2", "security", "CVE"],
  },
  {
    url: U.tv921Security,
    title: "About the security content of tvOS 9.2.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["tvOS", "9.2.1", "security", "CVE"],
  },
  {
    url: U.tv922Security,
    title: "About the security content of tvOS 9.2.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-07-18T00:00:00.000Z",
    topics: ["tvOS", "9.2.2", "security", "CVE"],
  },
  {
    url: U.tv10Security,
    title: "About the security content of tvOS 10",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-09-13T00:00:00.000Z",
    topics: ["tvOS", "10", "security", "CVE"],
  },
  {
    url: U.tv101Security,
    title: "About the security content of tvOS 10.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2016-12-12T00:00:00.000Z",
    topics: ["tvOS", "10.1", "security", "CVE"],
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

function entry({
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
      "Matched Apple's version-specific release notes, dated announcement, or security advisory to the existing audited public-release event.",
    citations,
  };
}

function securityEntry({
  key,
  title,
  canonicalSummary,
  summary,
  url,
  locator,
}) {
  return entry({
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
      provenanceStatus: "editoriallyVerified",
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
      provenanceStatus: "editoriallyVerified",
      editorialReview: review(),
      isIndexable: true,
    },
  };
}

const records = [
  release({
    id: "version-macos-10-12",
    releaseNotesUrl: U.macNews,
    overview:
      "macOS Sierra 10.12 launched on September 20, 2016 with Siri on Mac, cross-device clipboard and file workflows, Apple Watch-based unlocking, Apple Pay on the web, major Photos and Messages changes, broader window and video controls, storage management, an updated Apple Music experience, and a new security baseline.",
    overviewCitations: [
      c(U.macNews, "September 20, 2016; Availability; feature sections"),
      c(U.macSecurity, "Released September 20, 2016"),
    ],
    boundary:
      "This page describes only the existing macOS 10.12 launch route. It does not project additions or fixes from 10.12.1 or 10.12.2 backward, and it retains Apple's original device, region, language, authentication, and service qualifications.",
    boundaryCitations: [
      c(U.macNews, "Availability; feature qualifications"),
      c(U.securityIndex, "macOS Sierra 10.12 through macOS Sierra 10.12.2"),
    ],
    pageCitations: [
      c(U.macNews, "September 20, 2016; Availability"),
      c(U.macSecurity, "Released September 20, 2016"),
    ],
    summary:
      "macOS Sierra 10.12 reached the public channel on September 20, 2016 with voice assistance, continuity, identity, payments, media, productivity, storage, compatibility, and security changes.",
    publicText:
      "Apple made macOS Sierra available as a free Mac App Store update on September 20, 2016. The companion security advisory carries the same release date.",
    publicCitations: [
      c(U.macNews, "September 20, 2016; Availability"),
      c(U.macSecurity, "Released September 20, 2016"),
    ],
    scopeText:
      "The structured entries synthesize Apple's launch announcement and detailed security advisory. They do not include later Sierra point-release work, inferred build numbers, or undocumented behavior.",
    scopeCitations: [
      c(U.macNews, "Siri through Availability"),
      c(U.macSecurity, "macOS Sierra 10.12 security content"),
    ],
    changes: [
      entry({
        key: "macos-10-12-siri-on-mac",
        title: "Siri on Mac",
        canonicalSummary:
          "Sierra brought Siri to Mac with desktop-specific search, communication, settings, result-pinning, and drag-and-drop workflows.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could ask Siri to send messages or email, locate documents and photos, retrieve information, change settings, and place results into documents or the Today view.",
        citations: [c(U.macNews, "Siri Comes to Mac; Siri on the Mac")],
      }),
      entry({
        key: "macos-10-12-universal-clipboard",
        title: "Universal Clipboard",
        canonicalSummary:
          "Universal Clipboard let users copy content on one Apple device and paste it into an app on another.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added a continuity workflow for moving copied content between nearby supported Apple devices without a separate transfer step.",
        citations: [c(U.macNews, "Universal Clipboard")],
      }),
      entry({
        key: "macos-10-12-icloud-desktop-documents",
        title: "iCloud Desktop and Documents",
        canonicalSummary:
          "Desktop and Documents files could be stored in iCloud and accessed from iPhone and iPad.",
        category: "feature",
        action: "introduced",
        summary:
          "Sierra expanded iCloud Drive into the Mac's two common file locations so their contents could follow a user across supported devices.",
        citations: [c(U.macNews, "iCloud Desktop and Documents")],
      }),
      entry({
        key: "macos-10-12-auto-unlock",
        title: "Auto Unlock with Apple Watch",
        canonicalSummary:
          "An authenticated Apple Watch could automatically unlock a nearby Mac.",
        category: "feature",
        action: "introduced",
        summary:
          "Sierra linked Mac sign-in with a supported, authenticated Apple Watch to reduce manual password entry.",
        citations: [c(U.macNews, "Auto Unlock")],
      }),
      entry({
        key: "macos-10-12-apple-pay-web",
        title: "Apple Pay on the web",
        canonicalSummary:
          "Safari checkout flows could invoke Apple Pay and complete authentication on a supported iPhone or Apple Watch.",
        category: "feature",
        action: "introduced",
        summary:
          "Participating websites gained an Apple Pay path that handed purchase authorization to a nearby supported device while keeping card details from merchants.",
        citations: [c(U.macNews, "Apple Pay on the web")],
      }),
      entry({
        key: "macos-10-12-photos-memories-search-editing",
        title: "Photos Memories, visual search, and Brilliance",
        canonicalSummary:
          "Photos added automatic Memories, content-aware search, and a Brilliance editing control.",
        category: "enhancement",
        action: "changed",
        summary:
          "The app could assemble occasion-based collections, identify people, objects, and scenes for search, and rebalance dark areas and highlights with a new editing tool.",
        citations: [c(U.macNews, "Photos; Memories; Brilliance")],
      }),
      entry({
        key: "macos-10-12-messages-rich-content",
        title: "Richer Messages conversations",
        canonicalSummary:
          "Messages gained link previews, inline video, Tapback reactions, and larger emoji.",
        category: "enhancement",
        action: "changed",
        summary:
          "Sierra made linked content playable in place and added lightweight reactions and more prominent emoji presentation.",
        citations: [c(U.macNews, "Other great new features — Messages")],
      }),
      entry({
        key: "macos-10-12-tabs-across-apps",
        title: "Tabs across multiwindow apps",
        canonicalSummary:
          "Tabs expanded beyond the browser to Apple and third-party apps that supported multiple windows.",
        category: "feature",
        action: "introduced",
        summary:
          "Maps, Mail, iWork apps, TextEdit, and compatible third-party software could consolidate related windows into a tabbed interface.",
        citations: [c(U.macNews, "Other great new features — Tabs")],
      }),
      entry({
        key: "macos-10-12-picture-in-picture",
        title: "Picture in Picture video",
        canonicalSummary:
          "Safari and iTunes video could float in a resizable, corner-pinned window above the desktop.",
        category: "feature",
        action: "introduced",
        summary:
          "The system added a persistent small-player workflow for watching supported video while working in other applications.",
        citations: [
          c(U.macNews, "Other great new features — Picture in Picture"),
        ],
      }),
      entry({
        key: "macos-10-12-optimized-storage",
        title: "Optimized Storage",
        canonicalSummary:
          "Optimized Storage moved infrequently used items to the cloud and surfaced opportunities to remove unneeded local files.",
        category: "feature",
        action: "introduced",
        summary:
          "Sierra added system storage-management tools intended to reclaim local capacity when a Mac began running low on space.",
        citations: [
          c(U.macNews, "Other great new features — Optimized Storage"),
        ],
      }),
      entry({
        key: "macos-10-12-apple-music-redesign",
        title: "Updated Apple Music in iTunes",
        canonicalSummary:
          "Apple Music in iTunes was redesigned to simplify discovery, exclusives, and new releases.",
        category: "enhancement",
        action: "changed",
        summary:
          "The music service's Mac interface received a clearer discovery-oriented presentation within iTunes.",
        citations: [c(U.macNews, "Other great new features — Apple Music")],
      }),
      entry({
        key: "macos-10-12-hardware-compatibility",
        title: "Late-2009-and-newer Mac baseline",
        canonicalSummary:
          "Apple stated that Sierra supported Mac models introduced from late 2009 onward.",
        category: "compatibility",
        action: "changed",
        summary:
          "The launch announcement defined the broad hardware generation boundary for the free update while noting that individual features could vary.",
        citations: [c(U.macNews, "Availability")],
      }),
      securityEntry({
        key: "macos-10-12-security-baseline",
        title: "Sierra 10.12 security repairs",
        canonicalSummary:
          "The initial Sierra release repaired vulnerabilities across web services, drivers, networking, graphics, files, identity, the kernel, cryptography, privacy, and system utilities.",
        summary:
          "Apple's advisory records a broad platform security baseline, including memory-safety, privilege, information-disclosure, validation, and code-execution remediations.",
        url: U.macSecurity,
        locator:
          "apache through WebKit security content; Released September 20, 2016",
      }),
    ],
  }),
  release({
    id: "version-watchos-2-2",
    releaseNotesUrl: U.watch2,
    overview:
      "watchOS 2.2 was released on March 21, 2016 with multi-watch pairing, Maps Nearby, expanded system, dictation, and Siri languages, more frequent stationary background heart-rate measurements, general maintenance, and security repairs.",
    overviewCitations: [
      c(U.watch2, "watchOS 2.2"),
      c(U.securityIndex, "watchOS 2.2 — 21 Mar 2016"),
      c(U.watch22Security, "watchOS 2.2 security content"),
    ],
    boundary:
      "Apple's consumer history names six concrete additions and otherwise refers only to additional improvements and bug fixes. This page keeps the unnamed maintenance work generic and does not import 2.2.1 or 2.2.2 fixes.",
    boundaryCitations: [
      c(U.watch2, "watchOS 2.2 through watchOS 2.2.2"),
      c(U.watch22Security, "watchOS 2.2 security content"),
    ],
    pageCitations: [
      c(U.watch2, "watchOS 2.2"),
      c(U.securityIndex, "watchOS 2.2 — 21 Mar 2016"),
      c(U.watch22Security, "watchOS 2.2 security content"),
    ],
    summary:
      "watchOS 2.2 reached the public channel on March 21, 2016 with pairing, maps, localization, Siri, health-sampling, maintenance, and security changes.",
    publicText:
      "Apple's security-update index dates watchOS 2.2 to March 21, 2016. Its consumer history documents the release's user-facing additions and general maintenance.",
    publicCitations: [
      c(U.securityIndex, "watchOS 2.2 — 21 Mar 2016"),
      c(U.watch2, "watchOS 2.2"),
    ],
    scopeText:
      "The structured entries follow Apple's six named consumer bullets, retain the generic maintenance label without inventing symptoms, and summarize the matching advisory separately.",
    scopeCitations: [
      c(U.watch2, "watchOS 2.2"),
      c(U.watch22Security, "watchOS 2.2 security content"),
    ],
    changes: [
      entry({
        key: "watchos-2-2-multiple-watch-pairing",
        title: "Multiple watches paired to one iPhone",
        canonicalSummary:
          "One iPhone could pair with and support multiple Apple Watches.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 2.2 expanded the companion relationship so a user could manage more than one watch from the same supported iPhone.",
        citations: [c(U.watch2, "watchOS 2.2 — multiple Apple Watches")],
      }),
      entry({
        key: "watchos-2-2-maps-nearby",
        title: "Nearby categories in Maps",
        canonicalSummary:
          "Maps added a Nearby browser for categories such as food and shopping.",
        category: "feature",
        action: "introduced",
        summary:
          "The update gave users a category-based way to discover places around their current location from the watch.",
        citations: [c(U.watch2, "watchOS 2.2 — Nearby in Maps")],
      }),
      entry({
        key: "watchos-2-2-system-languages",
        title: "Additional system languages",
        canonicalSummary:
          "Catalan, Croatian, Slovak, Romanian, and Ukrainian became available as watchOS system languages.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded the localized watch interface to five additional languages.",
        citations: [c(U.watch2, "watchOS 2.2 — system language")],
      }),
      entry({
        key: "watchos-2-2-dictation-languages",
        title: "Expanded dictation languages",
        canonicalSummary:
          "Dictation added Catalan, Croatian, Slovak, Romanian, Ukrainian, and three regional English variants.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS broadened speech input to the newly supported system languages plus English for Saudi Arabia, the United Arab Emirates, and Indonesia.",
        citations: [c(U.watch2, "watchOS 2.2 — dictation")],
      }),
      entry({
        key: "watchos-2-2-siri-languages",
        title: "Malay, Finnish, and Hebrew Siri support",
        canonicalSummary:
          "Siri on Apple Watch added Malay, Finnish, and Hebrew.",
        category: "enhancement",
        action: "changed",
        summary:
          "The voice assistant's language coverage expanded to three additional languages.",
        citations: [c(U.watch2, "watchOS 2.2 — Siri")],
      }),
      entry({
        key: "watchos-2-2-stationary-heart-rate-sampling",
        title: "More frequent stationary heart-rate measurements",
        canonicalSummary:
          "Background heart-rate measurements occurred more frequently while the wearer was stationary.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update adjusted background sampling frequency for periods when the wearer was not moving.",
        citations: [c(U.watch2, "watchOS 2.2 — background heart rate")],
      }),
      entry({
        key: "watchos-2-2-general-maintenance",
        title: "Additional improvements and bug fixes",
        canonicalSummary:
          "Apple documented further improvements and bug fixes without naming individual behaviors.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The retained consumer record confirms ordinary maintenance but does not support a more specific subsystem or symptom claim.",
        citations: [c(U.watch2, "watchOS 2.2 — introductory description")],
      }),
      securityEntry({
        key: "watchos-2-2-security-repairs",
        title: "watchOS 2.2 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities across disk images, fonts, networking, input, the kernel, XML, Messages, certificates, logging, WebKit, and Wi-Fi.",
        summary:
          "Apple's advisory documents memory-safety, code-signing, certificate, message-attachment, privilege, denial-of-service, and network attack-surface fixes.",
        url: U.watch22Security,
        locator: "Disk Images through Wi-Fi security content",
      }),
    ],
  }),
  release({
    id: "version-watchos-2-2-1",
    releaseNotesUrl: U.watch2,
    overview:
      "watchOS 2.2.1 was released on May 16, 2016 as a bug-fix and security update.",
    overviewCitations: [
      c(U.watch2, "watchOS 2.2.1"),
      c(U.securityIndex, "watchOS 2.2.1 — 16 May 2016"),
      c(U.watch221Security, "watchOS 2.2.1 security content"),
    ],
    boundary:
      "Apple's consumer note does not enumerate any ordinary fix for 2.2.1. This page preserves that limit and uses the detailed advisory only for its documented security work.",
    boundaryCitations: [
      c(U.watch2, "watchOS 2.2.1"),
      c(U.watch221Security, "watchOS 2.2.1 security content"),
    ],
    pageCitations: [
      c(U.watch2, "watchOS 2.2.1"),
      c(U.securityIndex, "watchOS 2.2.1 — 16 May 2016"),
      c(U.watch221Security, "watchOS 2.2.1 security content"),
    ],
    summary:
      "watchOS 2.2.1 reached the public channel on May 16, 2016 with documented bug fixes and a broad security repair set.",
    publicText:
      "Apple's security-update index dates watchOS 2.2.1 to May 16, 2016, while the consumer history characterizes it only as bug fixes and security updates.",
    publicCitations: [
      c(U.securityIndex, "watchOS 2.2.1 — 16 May 2016"),
      c(U.watch2, "watchOS 2.2.1"),
    ],
    scopeText:
      "No unnamed ordinary fix is converted into a specific claim. The security entry is limited to the components and remediation classes in Apple's version-specific advisory.",
    scopeCitations: [
      c(U.watch2, "watchOS 2.2.1"),
      c(U.watch221Security, "watchOS 2.2.1 security content"),
    ],
    changes: [
      entry({
        key: "watchos-2-2-1-bug-fixes",
        title: "General bug fixes",
        canonicalSummary:
          "Apple documented watchOS 2.2.1 as containing bug fixes without enumerating them.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The consumer history confirms maintenance but provides no evidence for a named affected feature or corrected symptom.",
        citations: [c(U.watch2, "watchOS 2.2.1")],
      }),
      securityEntry({
        key: "watchos-2-2-1-security-repairs",
        title: "watchOS 2.2.1 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in cryptography, diagnostics, disk images, graphics, input, the kernel, libraries, maps, and OpenGL.",
        summary:
          "Apple's advisory records information-disclosure, memory-safety, privilege, validation, networking, and code-execution remediations.",
        url: U.watch221Security,
        locator: "CommonCrypto through OpenGL security content",
      }),
    ],
  }),
  release({
    id: "version-watchos-2-2-2",
    releaseNotesUrl: U.watch2,
    overview:
      "watchOS 2.2.2 was released on July 18, 2016 as a bug-fix and security update.",
    overviewCitations: [
      c(U.watch2, "watchOS 2.2.2"),
      c(U.watch222Security, "Released July 18, 2016"),
    ],
    boundary:
      "Apple's consumer note does not enumerate any ordinary fix for 2.2.2. The page keeps maintenance generic and does not infer behavior from component names in the security advisory.",
    boundaryCitations: [
      c(U.watch2, "watchOS 2.2.2"),
      c(U.watch222Security, "watchOS 2.2.2 security content"),
    ],
    pageCitations: [
      c(U.watch2, "watchOS 2.2.2"),
      c(U.watch222Security, "Released July 18, 2016"),
    ],
    summary:
      "watchOS 2.2.2 reached the public channel on July 18, 2016 with documented bug fixes and version-specific security repairs.",
    publicText:
      "Apple released watchOS 2.2.2 on July 18, 2016. Its consumer history gives only the broad labels of bug fixes and security updates.",
    publicCitations: [
      c(U.watch222Security, "Released July 18, 2016"),
      c(U.watch2, "watchOS 2.2.2"),
    ],
    scopeText:
      "The matching advisory supplies concrete security scope. No undocumented ordinary fix, user-interface change, or build number is inferred.",
    scopeCitations: [
      c(U.watch2, "watchOS 2.2.2"),
      c(U.watch222Security, "watchOS 2.2.2 security content"),
    ],
    changes: [
      entry({
        key: "watchos-2-2-2-bug-fixes",
        title: "General bug fixes",
        canonicalSummary:
          "Apple documented watchOS 2.2.2 as containing bug fixes without enumerating them.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The consumer record confirms maintenance but does not identify a feature, subsystem, or corrected symptom.",
        citations: [c(U.watch2, "watchOS 2.2.2")],
      }),
      securityEntry({
        key: "watchos-2-2-2-security-repairs",
        title: "watchOS 2.2.2 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in graphics, images, input, the kernel, system libraries, and sandbox profiles.",
        summary:
          "Apple's advisory documents memory-safety, privilege, information-disclosure, denial-of-service, authentication, and sandbox-hardening fixes.",
        url: U.watch222Security,
        locator: "CoreGraphics through Sandbox Profiles security content",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-0",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.0 was released on September 13, 2016 with a Dock and faster app access, revised navigation and faces, Activity sharing, expanded workouts and wheelchair support, Breathe, richer communication, Emergency SOS, Home, additional built-in apps and controls, third-party Apple Pay, new Siri languages, and a broad security baseline.",
    overviewCitations: [
      c(
        U.watch3,
        "watchOS 3.0 — Performance and Navigation through Other improvements",
      ),
      c(U.watch3Security, "Released September 13, 2016"),
    ],
    boundary:
      "Apple's retained watchOS 3.0 section begins with an introductory sentence that repeats the watchOS 2.2 pairing, Maps, and language description. This page does not reuse that apparent archival mismatch and instead follows the detailed, version-labeled watchOS 3.0 sections beneath it.",
    boundaryCitations: [
      c(
        U.watch3,
        "watchOS 3.0 introductory sentence; Performance and Navigation through Other improvements",
      ),
      c(U.watch2, "watchOS 2.2 matching introductory description"),
    ],
    pageCitations: [
      c(
        U.watch3,
        "watchOS 3.0 — Performance and Navigation through Other improvements",
      ),
      c(U.watch3Security, "Released September 13, 2016"),
    ],
    summary:
      "watchOS 3.0 reached the public channel on September 13, 2016 with performance, navigation, faces, health, fitness, accessibility, communication, safety, home, app, payment, localization, and security changes.",
    publicText:
      "Apple's dedicated advisory dates watchOS 3 to September 13, 2016. The consumer history supplies detailed sections for the public release's user-facing scope.",
    publicCitations: [
      c(U.watch3Security, "Released September 13, 2016"),
      c(U.watch3, "watchOS 3.0"),
    ],
    scopeText:
      "The structured entries use the detailed watchOS 3.0 subsections and the matching security advisory. They exclude the repeated 2.2-style introductory sentence, later watchOS 3 point-release fixes, and beta-only behavior.",
    scopeCitations: [
      c(U.watch3, "watchOS 3.0 detailed subsections"),
      c(U.watch3Security, "watchOS 3 security content"),
    ],
    changes: [
      entry({
        key: "watchos-3-0-dock-fast-app-access",
        title: "Dock and faster favorite-app access",
        canonicalSummary:
          "The side button opened a Dock of up to ten apps, Now Playing, or the most recent app, with refreshed information ready on launch.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 3 reorganized app switching around a persistent Dock intended to make selected apps available more quickly.",
        citations: [c(U.watch3, "watchOS 3.0 — Performance and Navigation")],
      }),
      entry({
        key: "watchos-3-0-face-switching-control-center",
        title: "Face switching and Control Center",
        canonicalSummary:
          "Edge-to-edge swipes switched watch faces, while an upward swipe opened key settings in Control Center.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release revised core navigation gestures for moving among faces and reaching common system controls.",
        citations: [c(U.watch3, "watchOS 3.0 — Performance and Navigation")],
      }),
      entry({
        key: "watchos-3-0-faces-complications-gallery",
        title: "New faces, complications, and Face Gallery",
        canonicalSummary:
          "Minnie Mouse, Activity, and Numerals faces joined expanded complication support and an iPhone Face Gallery.",
        category: "feature",
        action: "introduced",
        summary:
          "Users gained new face designs, more placement options for complications, and a companion-app interface for discovering and customizing faces and third-party complications.",
        citations: [c(U.watch3, "watchOS 3.0 — Watch faces")],
      }),
      entry({
        key: "watchos-3-0-activity-sharing",
        title: "Activity sharing and comparisons",
        canonicalSummary:
          "Activity rings and progress could be shared, ranked, viewed over time, and answered with tailored encouragement.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 3 added social comparison and notification workflows around rings, goals, workouts, and achievements.",
        citations: [c(U.watch3, "watchOS 3.0 — Activity")],
      }),
      entry({
        key: "watchos-3-0-workout-controls-metrics-routes",
        title: "Expanded Workout controls, metrics, and routes",
        canonicalSummary:
          "Workout gained Quick Start, multiple metrics, segment gestures, named Other workouts, run auto-pause, Siri controls, and outdoor route maps.",
        category: "enhancement",
        action: "changed",
        summary:
          "The workout experience became faster to start, more configurable during exercise, and richer in its recorded outdoor context.",
        citations: [c(U.watch3, "watchOS 3.0 — Workout")],
      }),
      entry({
        key: "watchos-3-0-wheelchair-activity",
        title: "Wheelchair-optimized Activity and workouts",
        canonicalSummary:
          "Activity accounting, reminders, and pace workouts were adapted for wheelchair users.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added wheelchair-specific ring logic, push accounting, Time to Roll, and outdoor pace workouts.",
        citations: [c(U.watch3, "watchOS 3.0 — Wheelchair use")],
      }),
      entry({
        key: "watchos-3-0-breathe",
        title: "Breathe app",
        canonicalSummary:
          "A new Breathe app guided timed breathing sessions with visual and haptic cues, configurable pacing, reminders, and summaries.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 3 introduced a dedicated guided-breathing experience with session controls, completion heart rate, reminders, and weekly reporting.",
        citations: [c(U.watch3, "watchOS 3.0 — Breathe")],
      }),
      entry({
        key: "watchos-3-0-expressive-messages",
        title: "Expressive Messages",
        canonicalSummary:
          "Messages added full-screen effects, Tapback, animated handwritten notes, stickers, and invisible ink.",
        category: "feature",
        action: "introduced",
        summary:
          "The watch gained a broader set of visual and quick-reaction communication tools aligned with the 2016 Messages redesign.",
        citations: [
          c(U.watch3, "watchOS 3.0 — Communication — Expressive Messaging"),
        ],
      }),
      entry({
        key: "watchos-3-0-scribble-replies-emoji",
        title: "Scribble, notification replies, and expanded emoji",
        canonicalSummary:
          "Scribble converted handwriting to text, notification replies gained more response modes, and the emoji set expanded.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could write short text on the display, choose predicted interpretations with the Digital Crown, respond through additional message types, and use newly added emoji.",
        citations: [
          c(
            U.watch3,
            "watchOS 3.0 — Communication — Scribble and reply options",
          ),
        ],
      }),
      entry({
        key: "watchos-3-0-emergency-sos",
        title: "Emergency SOS",
        canonicalSummary:
          "Holding the side button could call local emergency services, notify contacts, share location, and display Medical ID.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 3 added an emergency workflow that adapted the service number to the current location and surfaced configured health and contact information.",
        citations: [c(U.watch3, "watchOS 3.0 — Emergency SOS")],
      }),
      entry({
        key: "watchos-3-0-home-app",
        title: "Home app and HomeKit controls",
        canonicalSummary:
          "A new Home app controlled accessories and scenes, including remote access and supported IP-camera views.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple Watch became a direct interface for favorite HomeKit devices, grouped scenes, remote control through a home hub, and camera notifications.",
        citations: [c(U.watch3, "watchOS 3.0 — Home")],
      }),
      entry({
        key: "watchos-3-0-reminders-find-my-friends",
        title: "Reminders and Find My Friends apps",
        canonicalSummary:
          "Reminders and Find My Friends arrived as built-in watch apps.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added wrist-based access to scheduled lists and the shared locations of friends and family.",
        citations: [c(U.watch3, "watchOS 3.0 — Other improvements")],
      }),
      entry({
        key: "watchos-3-0-apple-pay-third-party-apps",
        title: "Apple Pay inside third-party apps",
        canonicalSummary:
          "Third-party watch apps could accept payments through Apple Pay.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 3 extended Apple Pay beyond Apple's own transaction surfaces into supported App Store experiences.",
        citations: [
          c(U.watch3, "watchOS 3.0 — Other improvements — Apple Pay"),
        ],
      }),
      entry({
        key: "watchos-3-0-calendar-facetime-settings-camera",
        title: "Calendar, FaceTime, Settings, and Camera controls",
        canonicalSummary:
          "Calendar editing, FaceTime Audio, companion Settings search, and expanded remote camera controls arrived together.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update broadened everyday system actions available from the watch or its iPhone companion, including calendar management and flash, Live Photos, HDR, zoom, burst, and camera selection.",
        citations: [c(U.watch3, "watchOS 3.0 — Other improvements")],
      }),
      entry({
        key: "watchos-3-0-siri-languages",
        title: "Additional Siri language support",
        canonicalSummary:
          "Siri added Spanish for Chile, Cantonese for mainland China, and English for Ireland and South Africa.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded Siri's regional language coverage on Apple Watch.",
        citations: [c(U.watch3, "watchOS 3.0 — Other improvements — Siri")],
      }),
      securityEntry({
        key: "watchos-3-0-security-baseline",
        title: "watchOS 3 security repairs",
        canonicalSummary:
          "The major release repaired vulnerabilities across audio, networking, cryptography, fonts, location data, graphics, the kernel, XML, code signing, WebKit, and Wi-Fi policy.",
        summary:
          "Apple's advisory records memory-safety, information-disclosure, privilege, denial-of-service, validation, sandbox, and code-execution remediations.",
        url: U.watch3Security,
        locator:
          "Audio through Wi-Fi Manager security content; Released September 13, 2016",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-1",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.1 was released on October 24, 2016 with Messages effect controls, fixes for duplicate Timer notifications, Series 2 charging, Activity rings, and third-party Force Touch options, plus security repairs.",
    overviewCitations: [
      c(U.watch3, "watchOS 3.1"),
      c(U.watch31Security, "Released October 24, 2016"),
    ],
    boundary:
      "This page uses only Apple's six version-labeled 3.1 consumer bullets and the matching advisory. It does not import the seven fixes or emoji update documented for 3.1.1.",
    boundaryCitations: [
      c(U.watch3, "watchOS 3.1 through watchOS 3.1.1"),
      c(U.watch31Security, "watchOS 3.1 security content"),
    ],
    pageCitations: [
      c(U.watch3, "watchOS 3.1"),
      c(U.watch31Security, "Released October 24, 2016"),
    ],
    summary:
      "watchOS 3.1 reached the public channel on October 24, 2016 with messaging accessibility refinements, four targeted bug fixes, and security repairs.",
    publicText:
      "Apple released watchOS 3.1 on October 24, 2016. Its consumer history lists six ordinary changes, and the companion advisory documents the security set.",
    publicCitations: [
      c(U.watch31Security, "Released October 24, 2016"),
      c(U.watch3, "watchOS 3.1"),
    ],
    scopeText:
      "Messages changes are grouped as one coherent entry; each of the four unrelated corrected behaviors remains separate. Later 3.1.1 work is excluded.",
    scopeCitations: [
      c(U.watch3, "watchOS 3.1"),
      c(U.watch31Security, "watchOS 3.1 security content"),
    ],
    changes: [
      entry({
        key: "watchos-3-1-messages-effects-controls",
        title: "Messages effect replay and Reduce Motion support",
        canonicalSummary:
          "Users could replay bubble and full-screen effects, and effects could play while Reduce Motion was enabled.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update made expressive Messages content repeatable and compatible with the system's reduced-motion preference.",
        citations: [c(U.watch3, "watchOS 3.1 — Messages effects")],
      }),
      entry({
        key: "watchos-3-1-timer-duplicate-notification-fix",
        title: "Duplicate Timer notification fix",
        canonicalSummary:
          "A defect that could deliver a completed Timer notification twice was corrected.",
        category: "bugFix",
        action: "fixed",
        summary:
          "watchOS 3.1 addressed duplicate completion alerts from the Timer.",
        citations: [c(U.watch3, "watchOS 3.1 — Timer")],
      }),
      entry({
        key: "watchos-3-1-series-2-charging-fix",
        title: "Apple Watch Series 2 charging fix",
        canonicalSummary:
          "An issue that could prevent Apple Watch Series 2 from charging fully was resolved.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update targeted incomplete charging behavior on Series 2 hardware.",
        citations: [c(U.watch3, "watchOS 3.1 — Apple Watch Series 2 charging")],
      }),
      entry({
        key: "watchos-3-1-activity-rings-face-fix",
        title: "Activity rings disappearance fix",
        canonicalSummary:
          "An issue that could make Activity rings disappear from the watch face was resolved.",
        category: "bugFix",
        action: "fixed",
        summary:
          "watchOS 3.1 corrected missing Activity-ring visuals on affected faces.",
        citations: [c(U.watch3, "watchOS 3.1 — Activity rings")],
      }),
      entry({
        key: "watchos-3-1-third-party-force-touch-fix",
        title: "Third-party Force Touch options fix",
        canonicalSummary:
          "Force Touch options that failed to appear in some third-party apps were restored.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The release corrected a menu-availability problem affecting certain App Store apps.",
        citations: [c(U.watch3, "watchOS 3.1 — Force Touch")],
      }),
      securityEntry({
        key: "watchos-3-1-security-repairs",
        title: "watchOS 3.1 security repairs",
        canonicalSummary:
          "The update repaired code-signing, image and font parsing, kernel, archive, privileged-service, and sandbox vulnerabilities.",
        summary:
          "Apple's advisory documents validation, memory-safety, privilege, information-disclosure, file-overwrite, and sandbox-hardening fixes.",
        url: U.watch31Security,
        locator:
          "AppleMobileFileIntegrity through Sandbox Profiles security content",
      }),
    ],
  }),
  release({
    id: "version-watchos-3-1-1",
    releaseNotesUrl: U.watch3,
    overview:
      "watchOS 3.1.1 appeared on December 12, 2016 with the season's expanded emoji set and seven named fixes covering contacts, notification replies, Stocks, Activity faces, analog dials, Maps, and Calendar.",
    overviewCitations: [
      c(U.watch311News, "Update December 12, 2016; watchOS 3.1.1 emoji"),
      c(U.watch3, "watchOS 3.1.1"),
    ],
    boundary:
      "Apple's current 2016 security-update index omits watchOS 3.1.1, and no dedicated version-specific advisory was found. The page therefore relies on Apple's dated Newsroom item for public appearance and its retained consumer history for ordinary changes, without asserting a security repair set or explaining the index omission.",
    boundaryCitations: [
      c(U.watch311News, "Update December 12, 2016; watchOS 3.1.1"),
      c(U.watch3, "watchOS 3.1.1"),
      c(U.securityIndex, "December 2016 entries — watchOS 3.1.1 absent"),
    ],
    pageCitations: [
      c(U.watch311News, "Update December 12, 2016; watchOS 3.1.1"),
      c(U.watch3, "watchOS 3.1.1"),
    ],
    summary:
      "watchOS 3.1.1 appeared publicly on December 12, 2016 with expanded emoji and seven documented bug fixes; Apple's retained security index provides no version-specific entry.",
    publicText:
      "Apple's December 12 Newsroom update identifies watchOS 3.1.1 as the Apple Watch release carrying the new emoji, while Apple's consumer history preserves the version's seven named fixes.",
    publicCitations: [
      c(U.watch311News, "Update December 12, 2016; watchOS 3.1.1"),
      c(U.watch3, "watchOS 3.1.1"),
    ],
    scopeText:
      "The structured changes cover the Newsroom-documented emoji update and each consumer-note fix. No security claim, withdrawal explanation, or build number is inferred from the gap in Apple's security index.",
    scopeCitations: [
      c(U.watch311News, "watchOS 3.1.1 emoji"),
      c(U.watch3, "watchOS 3.1.1"),
      c(U.securityIndex, "December 2016 entries"),
    ],
    changes: [
      entry({
        key: "watchos-3-1-1-expanded-emoji",
        title: "Expanded and redesigned emoji",
        canonicalSummary:
          "watchOS 3.1.1 brought the expanded and redesigned emoji set to Apple Watch.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple's dated Newsroom item identifies watchOS 3.1.1 as the watch release for the new cross-device emoji collection.",
        citations: [c(U.watch311News, "watchOS 3.1.1 emoji")],
      }),
      entry({
        key: "watchos-3-1-1-contact-names-fix",
        title: "Contact names in Messages and notifications",
        canonicalSummary:
          "A problem that could hide contact names in Messages and notifications was fixed.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update restored contact-name presentation in affected messaging and notification contexts.",
        citations: [c(U.watch3, "watchOS 3.1.1 — contact names")],
      }),
      entry({
        key: "watchos-3-1-1-notification-response-fix",
        title: "Notification response fix",
        canonicalSummary:
          "An issue that could interfere with responding to notifications was corrected.",
        category: "bugFix",
        action: "fixed",
        summary:
          "watchOS 3.1.1 addressed failures in the interactive notification-response path.",
        citations: [c(U.watch3, "watchOS 3.1.1 — respond to notifications")],
      }),
      entry({
        key: "watchos-3-1-1-stocks-complication-fix",
        title: "Stocks complication update fix",
        canonicalSummary:
          "A Stocks complication that could stop updating on the watch face was repaired.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The release corrected stale market information in the affected complication.",
        citations: [c(U.watch3, "watchOS 3.1.1 — Stocks complication")],
      }),
      entry({
        key: "watchos-3-1-1-activity-face-rings-fix",
        title: "Activity-face rings display fix",
        canonicalSummary:
          "Activity rings that could fail to appear on Activity watch faces were restored.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update targeted missing ring visuals specifically on the Activity face family.",
        citations: [c(U.watch3, "watchOS 3.1.1 — Activity rings")],
      }),
      entry({
        key: "watchos-3-1-1-analog-dials-fix",
        title: "Analog dials after temperature-unit changes",
        canonicalSummary:
          "Analog watch-face dials no longer disappeared after changing the Weather temperature unit.",
        category: "bugFix",
        action: "fixed",
        summary:
          "watchOS 3.1.1 corrected a face-rendering problem triggered by switching the temperature unit.",
        citations: [c(U.watch3, "watchOS 3.1.1 — analog watch face")],
      }),
      entry({
        key: "watchos-3-1-1-maps-navigation-exit-fix",
        title: "Maps navigation exit fix",
        canonicalSummary:
          "Maps no longer remained launched after navigation had ended.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update corrected the Maps app's lifecycle after completing a route.",
        citations: [c(U.watch3, "watchOS 3.1.1 — Maps")],
      }),
      entry({
        key: "watchos-3-1-1-calendar-month-date-fix",
        title: "Calendar month-view date fix",
        canonicalSummary:
          "An incorrect date in Calendar's month view was corrected.",
        category: "bugFix",
        action: "fixed",
        summary:
          "watchOS 3.1.1 repaired date presentation in the monthly calendar interface.",
        citations: [c(U.watch3, "watchOS 3.1.1 — Calendar month view")],
      }),
    ],
  }),
  release({
    id: "version-tvos-9-2",
    releaseNotesUrl: U.tv92Security,
    overview:
      "tvOS 9.2 was released on March 21, 2016. Apple's retained first-party record for this archive consists of the dated security index and a detailed version-specific security advisory.",
    overviewCitations: [
      c(U.securityIndex, "tvOS 9.2 — 21 Mar 2016"),
      c(U.tv92Security, "tvOS 9.2 security content"),
    ],
    boundary:
      "Apple's current Apple TV consumer-update history begins at tvOS 11, and no retained first-party consumer notes for tvOS 9.2 were found. This page therefore does not reproduce user-interface features commonly attributed to 9.2 by secondary sources.",
    boundaryCitations: [
      c(U.tv92Security, "tvOS 9.2 security content"),
      c(U.securityIndex, "tvOS 9.2 — 21 Mar 2016"),
    ],
    pageCitations: [
      c(U.securityIndex, "tvOS 9.2 — 21 Mar 2016"),
      c(U.tv92Security, "tvOS 9.2 security content"),
    ],
    summary:
      "tvOS 9.2 reached the public channel on March 21, 2016; Apple's retained evidence supports its chronology and security repairs but not a first-party consumer feature inventory.",
    publicText:
      "Apple's security-update index dates tvOS 9.2 to March 21, 2016. Its dedicated advisory documents the release's security content for the fourth-generation Apple TV.",
    publicCitations: [
      c(U.securityIndex, "tvOS 9.2 — 21 Mar 2016"),
      c(U.tv92Security, "tvOS 9.2"),
    ],
    scopeText:
      "Only the version-specific security set is structured as a change. No generic maintenance, consumer feature, undocumented behavior, or build number is inferred from missing first-party notes.",
    scopeCitations: [
      c(U.tv92Security, "tvOS 9.2 security content"),
      c(U.securityIndex, "tvOS 9.2 — 21 Mar 2016"),
    ],
    changes: [
      securityEntry({
        key: "tvos-9-2-security-repairs",
        title: "tvOS 9.2 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in fonts, HTTP/2, input, the kernel, XML, certificates, WebKit, and Wi-Fi.",
        summary:
          "Apple's advisory records memory-safety, code-signing, certificate, privilege, denial-of-service, web-processing, and network-position attack remediations.",
        url: U.tv92Security,
        locator: "FontParser through Wi-Fi security content",
      }),
    ],
  }),
  release({
    id: "version-tvos-9-2-1",
    releaseNotesUrl: U.tv921Security,
    overview:
      "tvOS 9.2.1 was released on May 16, 2016. Apple's retained first-party record supports the date and a detailed security repair set, but no consumer feature or ordinary-fix inventory.",
    overviewCitations: [
      c(U.securityIndex, "tvOS 9.2.1 — 16 May 2016"),
      c(U.tv921Security, "tvOS 9.2.1 security content"),
    ],
    boundary:
      "Because Apple's current consumer-update history does not retain tvOS 9.2.1 notes, this page avoids assigning a broad bug-fix label or any specific user-facing behavior that the first-party archive does not support.",
    boundaryCitations: [
      c(U.securityIndex, "tvOS 9.2.1 — 16 May 2016"),
      c(U.tv921Security, "tvOS 9.2.1 security content"),
    ],
    pageCitations: [
      c(U.securityIndex, "tvOS 9.2.1 — 16 May 2016"),
      c(U.tv921Security, "tvOS 9.2.1 security content"),
    ],
    summary:
      "tvOS 9.2.1 reached the public channel on May 16, 2016 with a version-specific security update; retained Apple sources do not enumerate ordinary changes.",
    publicText:
      "Apple's security-update index dates tvOS 9.2.1 to May 16, 2016, and the matching advisory identifies the affected platform as the fourth-generation Apple TV.",
    publicCitations: [
      c(U.securityIndex, "tvOS 9.2.1 — 16 May 2016"),
      c(U.tv921Security, "tvOS 9.2.1"),
    ],
    scopeText:
      "The structured change summarizes only Apple's security advisory. No consumer feature, unnamed maintenance claim, undocumented behavior, or build number is added.",
    scopeCitations: [
      c(U.tv921Security, "tvOS 9.2.1 security content"),
      c(U.securityIndex, "tvOS 9.2.1 — 16 May 2016"),
    ],
    changes: [
      securityEntry({
        key: "tvos-9-2-1-security-repairs",
        title: "tvOS 9.2.1 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in networking, cryptography, diagnostics, disk images, graphics, input, the kernel, libraries, OpenGL, and WebKit.",
        summary:
          "Apple's advisory documents information-disclosure, memory-safety, privilege, validation, denial-of-service, and code-execution fixes.",
        url: U.tv921Security,
        locator: "CFNetwork Proxies through WebKit Canvas security content",
      }),
    ],
  }),
  release({
    id: "version-tvos-9-2-2",
    releaseNotesUrl: U.tv922Security,
    overview:
      "tvOS 9.2.2 was released on July 18, 2016 with a detailed security repair set; Apple's retained archive provides no first-party consumer feature or ordinary-maintenance list for the version.",
    overviewCitations: [
      c(U.tv922Security, "Released July 18, 2016"),
      c(U.securityIndex, "tvOS 9.2.2 — 18 Jul 2016"),
    ],
    boundary:
      "The current Apple TV consumer-update history begins at tvOS 11. This page therefore limits 9.2.2 to explicitly dated chronology and security content instead of filling the gap from secondary release summaries.",
    boundaryCitations: [
      c(U.tv922Security, "tvOS 9.2.2 security content"),
      c(U.securityIndex, "tvOS 9.2.2 — 18 Jul 2016"),
    ],
    pageCitations: [
      c(U.tv922Security, "Released July 18, 2016"),
      c(U.securityIndex, "tvOS 9.2.2 — 18 Jul 2016"),
    ],
    summary:
      "tvOS 9.2.2 reached the public channel on July 18, 2016 with version-specific security repairs; no retained first-party consumer change list was found.",
    publicText:
      "Apple's dedicated advisory and retained security index both date tvOS 9.2.2 to July 18, 2016.",
    publicCitations: [
      c(U.tv922Security, "Released July 18, 2016"),
      c(U.securityIndex, "tvOS 9.2.2 — 18 Jul 2016"),
    ],
    scopeText:
      "The page structures the advisory's security set and leaves ordinary behavior unspecified. No secondary-source feature, generic bug-fix claim, or build identifier is inferred.",
    scopeCitations: [
      c(U.tv922Security, "tvOS 9.2.2 security content"),
      c(U.securityIndex, "tvOS 9.2.2 — 18 Jul 2016"),
    ],
    changes: [
      securityEntry({
        key: "tvos-9-2-2-security-repairs",
        title: "tvOS 9.2.2 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities in network credentials and proxies, graphics and images, input, the kernel, XML, sandbox profiles, and WebKit.",
        summary:
          "Apple's advisory records credential-protection, memory-safety, privilege, information-disclosure, denial-of-service, sandbox, and web-processing fixes.",
        url: U.tv922Security,
        locator:
          "CFNetwork Credentials through WebKit Page Loading security content",
      }),
    ],
  }),
  release({
    id: "version-tvos-10-0",
    releaseNotesUrl: U.tv10Preview,
    overview:
      "tvOS 10.0 was released on September 13, 2016. Apple's launch-season package described expanded Siri and HomeKit control, new developer media and home APIs, app badges and controller support, redesigned Music, Photos Memories, a dark appearance, automatic universal-app downloads, nearby iOS keyboard entry, and a new security baseline.",
    overviewCitations: [
      c(U.tv10Security, "Released September 13, 2016"),
      c(
        U.tv10Preview,
        "New Siri Features & Functionality; new tvOS APIs; Additional Apple TV Features and Updates",
      ),
    ],
    boundary:
      "Apple's June source is a preview of the fall tvOS package and says features were subject to change. YouTube search was separately timed for June, the Apple TV Remote was a separate iOS app, Siri live tune-in was explicitly dated to October 27, and single sign-on was later dated to December; none is assigned to tvOS 10.0 here.",
    boundaryCitations: [
      c(
        U.tv10Preview,
        "YouTube search timing; Single Sign-on; Apple TV Remote app; Availability",
      ),
      c(
        U.tv101News,
        "Siri Live Tune-In — Available today; TV App and Single Sign-On — Available in December",
      ),
    ],
    pageCitations: [
      c(U.tv10Security, "Released September 13, 2016"),
      c(U.tv10Preview, "new tvOS feature package; Availability"),
    ],
    summary:
      "tvOS 10.0 reached the public channel on September 13, 2016 with Apple's documented fall tvOS feature package and version-specific security repairs, subject to the preview's explicit delivery qualifications.",
    publicText:
      "Apple's dedicated advisory dates tvOS 10 to September 13, 2016. The earlier Newsroom preview describes the user and developer feature package Apple associated with the fall tvOS software update.",
    publicCitations: [
      c(U.tv10Security, "Released September 13, 2016"),
      c(U.tv10Preview, "Availability"),
    ],
    scopeText:
      "The structured entries include only features presented as part of the fall tvOS package and keep the preview qualification visible. Separately timed YouTube search, the standalone Remote app, October Siri live tune-in, and December single sign-on are excluded from 10.0.",
    scopeCitations: [
      c(
        U.tv10Preview,
        "New Siri Features & Functionality through Availability",
      ),
      c(U.tv101News, "TV App and Single Sign-On — Available in December"),
      c(U.tv10Security, "tvOS 10 security content"),
    ],
    changes: [
      entry({
        key: "tvos-10-0-siri-topic-search",
        title: "Siri topic search for movies",
        canonicalSummary:
          "Siri could search for movies by a requested topic or theme.",
        category: "feature",
        action: "introduced",
        summary:
          "The new tvOS package expanded voice discovery beyond titles and people to broader concepts such as genres, subjects, or eras.",
        citations: [
          c(U.tv10Preview, "New Siri Features — Topic search for movies"),
        ],
      }),
      entry({
        key: "tvos-10-0-siri-homekit-control",
        title: "HomeKit accessory control through Siri",
        canonicalSummary:
          "Siri on Apple TV could control HomeKit accessories, while Apple TV continued to support remote access and automation.",
        category: "feature",
        action: "introduced",
        summary:
          "The television became another voice-control surface for supported lights, thermostats, and other home accessories.",
        citations: [
          c(U.tv10Preview, "New Siri Features — Manage HomeKit accessories"),
        ],
      }),
      entry({
        key: "tvos-10-0-replaykit",
        title: "ReplayKit recording and broadcasting",
        canonicalSummary:
          "ReplayKit enabled tvOS apps to support recording and live broadcasting.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Developers gained a system framework for capturing and broadcasting supported app experiences.",
        citations: [c(U.tv10Preview, "New tvOS APIs — ReplayKit")],
      }),
      entry({
        key: "tvos-10-0-photokit-homekit-apis",
        title: "PhotoKit and HomeKit app APIs",
        canonicalSummary:
          "tvOS apps gained PhotoKit access to iCloud photo collections and HomeKit APIs for accessory-control experiences.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The SDK broadened third-party app integration with users' cloud photo libraries and compatible home devices.",
        citations: [c(U.tv10Preview, "New tvOS APIs — PhotoKit; HomeKit")],
      }),
      entry({
        key: "tvos-10-0-app-badges-game-controllers",
        title: "App badges and expanded game-controller support",
        canonicalSummary:
          "Home-screen app badges and Game Center support for as many as four controllers joined the tvOS developer toolkit.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Apps could signal new content on the Home screen, while games gained broader simultaneous controller support.",
        citations: [
          c(U.tv10Preview, "New tvOS APIs — app badging; Game Center"),
        ],
      }),
      entry({
        key: "tvos-10-0-apple-music-redesign",
        title: "Redesigned Apple Music",
        canonicalSummary:
          "Apple Music adopted redesigned Library, For You, Browse, and Radio tabs plus a dedicated Search tab.",
        category: "enhancement",
        action: "changed",
        summary:
          "The television music interface was reorganized for clearer navigation and discovery.",
        citations: [
          c(U.tv10Preview, "Additional Apple TV Features — Apple Music"),
        ],
      }),
      entry({
        key: "tvos-10-0-photos-memories",
        title: "Photos Memories",
        canonicalSummary:
          "The Photos app could display Memories assembled from a user's photo library.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple TV gained a large-screen view of automatically organized personal photo and video collections.",
        citations: [c(U.tv10Preview, "Additional Apple TV Features — Photos")],
      }),
      entry({
        key: "tvos-10-0-dark-appearance",
        title: "Dark appearance",
        canonicalSummary:
          "Users could select a darker Apple TV background appearance.",
        category: "feature",
        action: "introduced",
        summary:
          "The interface added a dark visual option intended for home theaters and low-light rooms.",
        citations: [
          c(U.tv10Preview, "Additional Apple TV Features — dark background"),
        ],
      }),
      entry({
        key: "tvos-10-0-universal-app-auto-download",
        title: "Automatic universal-app downloads",
        canonicalSummary:
          "Eligible universal apps added on iOS could download automatically and appear on Apple TV.",
        category: "feature",
        action: "introduced",
        summary:
          "The release reduced separate App Store setup for apps that offered both iOS and tvOS versions.",
        citations: [
          c(U.tv10Preview, "Additional Apple TV Features — Universal apps"),
        ],
      }),
      entry({
        key: "tvos-10-0-nearby-ios-keyboard",
        title: "Nearby iOS keyboard entry",
        canonicalSummary:
          "A keyboard could appear on a nearby iOS device signed into the same iCloud account when Apple TV requested text.",
        category: "feature",
        action: "introduced",
        summary:
          "The new tvOS package offered a companion-device text-entry path in place of relying solely on the television interface.",
        citations: [
          c(U.tv10Preview, "Additional Apple TV Features — keyboard"),
        ],
      }),
      securityEntry({
        key: "tvos-10-0-security-baseline",
        title: "tvOS 10 security repairs",
        canonicalSummary:
          "The major release repaired vulnerabilities in audio, networking, cryptography, fonts, graphics, the kernel, XML, code signing, and WebKit.",
        summary:
          "Apple's advisory documents memory-safety, information-disclosure, privilege, denial-of-service, validation, and code-execution remediations.",
        url: U.tv10Security,
        locator:
          "Audio through WebKit security content; Released September 13, 2016",
      }),
    ],
  }),
  release({
    id: "version-tvos-10-1",
    releaseNotesUrl: U.tv101News,
    overview:
      "tvOS 10.1 was released on December 12, 2016 with the new TV app, Watch Now and Up Next, curated recommendations, Library and Store destinations, cross-device viewing continuity, US single sign-on for participating pay-TV providers, and a broad security update.",
    overviewCitations: [
      c(U.tv101News, "TV app features; TV App and Single Sign-On availability"),
      c(U.tv101Security, "Released December 12, 2016"),
    ],
    boundary:
      "Apple announced the TV app and single sign-on as December software updates for fourth-generation Apple TV customers in the United States and qualified both by participating apps, services, regions, and languages. Siri live tune-in was marked available on October 27, so it is not attributed to the later 10.1 release.",
    boundaryCitations: [
      c(U.tv101News, "Pricing and Availability"),
      c(U.tv101News, "Siri Live Tune-In — Available today"),
    ],
    pageCitations: [
      c(U.tv101News, "TV App and Single Sign-On — Available in December"),
      c(U.tv101Security, "Released December 12, 2016"),
    ],
    summary:
      "tvOS 10.1 reached the public channel on December 12, 2016 with a unified TV discovery and continuity experience, participating-provider single sign-on in the United States, and version-specific security repairs.",
    publicText:
      "Apple's advisory dates tvOS 10.1 to December 12, 2016. Its October announcement schedules the TV app and single sign-on for free December software updates on the fourth-generation Apple TV in the United States.",
    publicCitations: [
      c(U.tv101Security, "Released December 12, 2016"),
      c(U.tv101News, "Pricing and Availability"),
    ],
    scopeText:
      "The structured entries follow Apple's named TV app destinations, synchronization behavior, and single-sign-on description, retaining all availability qualifications. The separately earlier live-tune-in launch is excluded.",
    scopeCitations: [
      c(U.tv101News, "Key features; Single Sign-On; Pricing and Availability"),
      c(U.tv101Security, "tvOS 10.1 security content"),
    ],
    changes: [
      entry({
        key: "tvos-10-1-tv-app",
        title: "Unified TV app",
        canonicalSummary:
          "A new TV app brought shows and movies from iTunes and participating apps into one discovery and access experience.",
        category: "feature",
        action: "introduced",
        summary:
          "The update created a common television hub for finding and returning to video across supported content providers.",
        citations: [c(U.tv101News, "TV app introduction")],
      }),
      entry({
        key: "tvos-10-1-watch-now-up-next",
        title: "Watch Now and Up Next",
        canonicalSummary:
          "Watch Now surfaced available viewing, while Up Next ordered in-progress and newly available episodes for continuation.",
        category: "feature",
        action: "introduced",
        summary:
          "The TV app added a queue-oriented home for resuming rentals, purchases, shows, and episodes from participating sources.",
        citations: [c(U.tv101News, "Key features — Watch Now; Up Next")],
      }),
      entry({
        key: "tvos-10-1-recommended",
        title: "Curated Recommended collections",
        canonicalSummary:
          "Recommended offered curated and trending programs organized into collections, categories, and genres.",
        category: "feature",
        action: "introduced",
        summary:
          "The TV app paired viewing history and available catalogs with an editorial discovery destination.",
        citations: [c(U.tv101News, "Key features — Recommended")],
      }),
      entry({
        key: "tvos-10-1-library-store",
        title: "Library and Store destinations",
        canonicalSummary:
          "Library collected rented and purchased iTunes video, while Store highlighted new services, subscriptions, and iTunes releases.",
        category: "feature",
        action: "introduced",
        summary:
          "The TV app separated owned or rented content from a marketplace for additional participating video sources.",
        citations: [c(U.tv101News, "Key features — Library; Store")],
      }),
      entry({
        key: "tvos-10-1-cross-device-sync",
        title: "Cross-device viewing continuity",
        canonicalSummary:
          "The TV app stayed synchronized across Apple TV, iPhone, and iPad so viewing could continue on another device.",
        category: "feature",
        action: "introduced",
        summary:
          "The update linked playback state across supported Apple devices using the new TV experience.",
        citations: [c(U.tv101News, "TV app stays in sync")],
      }),
      entry({
        key: "tvos-10-1-single-sign-on",
        title: "Single sign-on for participating pay-TV apps",
        canonicalSummary:
          "US subscribers to participating television providers could authenticate once for supported pay-TV apps.",
        category: "feature",
        action: "introduced",
        summary:
          "The December update reduced repeated provider logins across eligible channel apps, subject to provider and app participation.",
        citations: [
          c(
            U.tv101News,
            "Single Sign-On for Pay-TV Apps; Pricing and Availability",
          ),
        ],
      }),
      securityEntry({
        key: "tvos-10-1-security-repairs",
        title: "tvOS 10.1 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities across media, text and images, drivers, the kernel, archives, certificates, privileged services, profiles, and WebKit.",
        summary:
          "Apple's advisory records memory-safety, privilege, information-disclosure, denial-of-service, validation, trust, and code-execution remediations.",
        url: U.tv101Security,
        locator:
          "Audio through WebKit security content; Released December 12, 2016",
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

const json = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync(join(here, "apple-other-2016.json"), json);
const jsonSha = createHash("sha256").update(json).digest("hex");

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
const citationReferenceCount = (value) => {
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + citationReferenceCount(item), 0);
  }
  if (!value || typeof value !== "object") return 0;
  return Object.entries(value).reduce(
    (sum, [key, item]) =>
      sum +
      (key === "citations" && Array.isArray(item)
        ? item.length
        : citationReferenceCount(item)),
    0,
  );
};

const md = `# Apple 2016 non-iPhone research batch

## Result

\`apple-other-2016.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2016. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.12 | 1 | ${platformChangeCount("macos")} |
| watchOS | 2.2, 2.2.1, 2.2.2, 3.0, 3.1, 3.1.1 | 6 | ${platformChangeCount("watchos")} |
| tvOS | 9.2, 9.2.1, 9.2.2, 10.0, 10.1 | 5 | ${platformChangeCount("tvos")} |
| **Total** | **12 version articles** | **${events.length}** | **${eventChanges}** |

The 12 versions contain 73 existing local timeline milestones: 12 public appearances and 61 beta, release-candidate, golden-master, and related non-public milestones. This bundle enriches only the 12 durable public routes through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 24 version/event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- All public events are indexable after editorial approval.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included.
- No beta note or later cumulative change is projected backward.
- No build record is included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. Eleven of the 12 local public dates are confirmed by Apple's dated security index or a version-specific security advisory.
2. watchOS 3.1.1 is absent from Apple's retained 2016 security-update index, but Apple published the version's consumer notes and a December 12 Newsroom item that names watchOS 3.1.1 as the Apple Watch software carrying the new emoji. The existing December 12 local date is therefore retained, while no version-specific security claim is made.
3. Apple's current Apple TV consumer-update history begins at tvOS 11. The tvOS 9.2, 9.2.1, and 9.2.2 pages are therefore limited to release chronology and their retained version-specific security advisories.
4. Apple's retained watchOS 3.0 consumer section opens with a sentence that repeats the watchOS 2.2 pairing, Maps, and language description. The batch excludes that apparent archival mismatch and uses the detailed, version-labeled watchOS 3.0 subsections.
5. Apple's June tvOS preview associated features with the new tvOS package but separately timed YouTube search, the Apple TV Remote app, and single sign-on. Apple's October announcement also marks Siri live tune-in available on October 27. Those separately delivered items are not assigned to tvOS 10.0; single sign-on is attached to 10.1 using Apple's December-availability announcement, while live tune-in remains outside either version delta.
6. The existing-record-only catalog omits Apple-documented 2016 releases including tvOS 9.1.1 and 10.0.1, plus macOS Sierra 10.12.1 and 10.12.2. This batch does not create missing releaseVersion records.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### Cross-platform chronology

- <${U.securityIndex}> — Apple's retained 2016 release-date index and the basis for identifying missing local point releases

### macOS

- <${U.macNews}> — dated Sierra availability, launch features, qualifications, and hardware baseline
- <${U.macSecurity}> — detailed Sierra 10.12 security content and release date

### watchOS

- <${U.watch2}> — watchOS 2 consumer update notes
- <${U.watch3}> — watchOS 3 consumer update notes
- <${U.watch311News}> — dated watchOS 3.1.1 emoji availability
- <${U.watch22Security}>
- <${U.watch221Security}>
- <${U.watch222Security}>
- <${U.watch3Security}>
- <${U.watch31Security}>

### tvOS

- <${U.tv10Preview}> — the new-tvOS feature package, developer APIs, timing language, and feature qualifications
- <${U.tv101News}> — December TV app and single-sign-on availability
- <${U.tv92Security}>
- <${U.tv921Security}>
- <${U.tv922Security}>
- <${U.tv10Security}>
- <${U.tv101Security}>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section, dated announcement, and advisory or index release line.

## Known gaps

1. The four Apple-documented 2016 point releases absent from the scoped local macOS/watchOS/tvOS catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. Apple does not retain consumer release-note pages for tvOS 9.2 through 9.2.2, so this batch does not reproduce commonly reported user-interface additions from secondary sources.
3. Apple's retained security index omits watchOS 3.1.1. The consumer history and dated Newsroom item support the release and its ordinary changes, but no dedicated advisory was found and no security change is inferred.
4. Apple's retained watchOS 3.0 introductory sentence appears to repeat 2.2 material. It is treated as an archival source defect rather than as a watchOS 3 change.
5. The tvOS 10 launch-season feature source is a preview that says features were subject to change. The batch includes only the package's clearly described fall tvOS features and excludes items with separate timing or delivery paths.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. The 61 non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
8. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for the release, not proof that every advisory entry appeared on launch day.
9. Feature availability remains subject to Apple's original hardware, country, language, service, subscription, and participating-app qualifications.

## Validation

- Research-batch validation passed with ${versions.length} versions, ${events.length} public events, ${eventChanges} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed: 12 eligible local versions, 73 milestones, 12 public appearances, 61 non-public milestones, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON byte-for-byte.
- Reviewed production plan: 91 creates, 26 revision-guarded patches, and 2,071 unchanged documents.
- Creates: 15 source documents and 76 change documents; zero version, event, or build creates. The plan included 12 version patches, 12 existing durable public-event patches, and 2 source metadata patches.
- Mutation payload: 204,206 bytes, reported as 5.2% of the guarded limit.
- Applied production plan SHA: \`dc6f6d359a3c2468ebc5394776ab68ae3402282bf854a27525eb759baafa1332\`.
- Production transaction \`eOgq1Ovu5XNUv1qNFUcxN1\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`${jsonSha}\`.
- Post-apply zero-residual plan SHA: \`a20813c0f570504a9539d3cc6399f2c36cf24b160e8d574143163e57a6cf9fef\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.12\`, \`/apple/watchos/3.1.1\`, and \`/apple/tvos/10.1\`.
`;

writeFileSync(join(here, "apple-other-2016.md"), md);
