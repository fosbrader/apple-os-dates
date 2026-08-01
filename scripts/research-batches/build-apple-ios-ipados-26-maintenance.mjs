import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const outputPath = join(directory, "apple-ios-ipados-26-maintenance.json");

const IOS_NOTES = "https://support.apple.com/en-us/123075";
const IPADOS_NOTES = "https://support.apple.com/en-us/123074";
const SECURITY_2601 = "https://support.apple.com/en-us/125326";
const SECURITY_261 = "https://support.apple.com/en-us/125632";
const SECURITY_262 = "https://support.apple.com/en-us/125884";
const SECURITY_263 = "https://support.apple.com/en-us/126346";
const AIR_TAG =
  "https://www.apple.com/newsroom/2026/01/apple-introduces-new-airtag-with-expanded-range-and-improved-findability/";

const sources = [
  {
    url: IOS_NOTES,
    title: "About iOS 26 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "26", "consumer release notes"],
  },
  {
    url: IPADOS_NOTES,
    title: "About iPadOS 26 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPadOS", "26", "consumer release notes"],
  },
  {
    url: SECURITY_2601,
    title: "About the security content of iOS 26.0.1 and iPadOS 26.0.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    publishedAt: "2025-09-29T00:00:00Z",
    topics: ["iOS", "iPadOS", "26.0.1", "security"],
  },
  {
    url: SECURITY_261,
    title: "About the security content of iOS 26.1 and iPadOS 26.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "iPadOS", "26.1", "security"],
  },
  {
    url: SECURITY_262,
    title: "About the security content of iOS 26.2 and iPadOS 26.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "iPadOS", "26.2", "security"],
  },
  {
    url: SECURITY_263,
    title: "About the security content of iOS 26.3 and iPadOS 26.3",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "iPadOS", "26.3", "security"],
  },
  {
    url: AIR_TAG,
    title:
      "Apple introduces new AirTag with expanded range and improved findability",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2026-01-26T00:00:00Z",
    topics: ["AirTag", "iOS", "iPadOS", "26.2.1"],
  },
];

function cite(url, locator, note) {
  return {
    url,
    ...(locator ? { locator } : {}),
    ...(note ? { note } : {}),
  };
}

function article(paragraphs) {
  return {
    authorship: "originalSynthesis",
    blocks: paragraphs.map(({ text, citations }) => ({
      text,
      citations,
    })),
  };
}

function reviewable() {
  return {
    provenanceStatus: "editoriallyVerified",
    editorialReview: {
      status: "approved",
      reviewedAt: "2026-07-30T04:12:05Z",
    },
  };
}

function version({ id, releaseNotesUrl, paragraphs, citations }) {
  return {
    releaseVersionId: id,
    authorship: "originalSynthesis",
    releaseNotesUrl,
    overview: article(paragraphs),
    citations,
    ...reviewable(),
  };
}

function change({
  key,
  title,
  summary,
  category = "enhancement",
  action = "changed",
  citations,
}) {
  return {
    key,
    title,
    canonicalSummary: summary,
    category,
    action,
    inheritance: "delta",
    summary,
    documentedStatus: "documented",
    evidenceState: "confirmed",
    citations,
  };
}

function event({ id, summary, citations, changes }) {
  return {
    target: {
      releaseVersionId: id,
      routeAlias: "public",
    },
    authorship: "originalSynthesis",
    summary,
    citations,
    changes,
    ...reviewable(),
    isIndexable: true,
  };
}

const ios2601 = cite(IOS_NOTES, "iOS 26.0.1");
const sec2601 = cite(
  SECURITY_2601,
  "iOS 26.0.1 and iPadOS 26.0.1; FontParser; CVE-2025-43400",
);
const ios261 = cite(IOS_NOTES, "iOS 26.1");
const ipad261 = cite(IPADOS_NOTES, "iPadOS 26.1");
const sec261 = cite(
  SECURITY_261,
  "iOS 26.1 and iPadOS 26.1; released November 3, 2025",
);
const ios262 = cite(IOS_NOTES, "iOS 26.2");
const ipad262 = cite(IPADOS_NOTES, "iPadOS 26.2");
const sec262 = cite(
  SECURITY_262,
  "iOS 26.2 and iPadOS 26.2; released December 12, 2025",
);
const ios2621 = cite(IOS_NOTES, "iOS 26.2.1");
const airTag = cite(AIR_TAG, "January 26, 2026; software requirements");
const ios263 = cite(IOS_NOTES, "iOS 26.3");
const ipad263 = cite(IPADOS_NOTES, "iPadOS 26.3");
const sec263 = cite(
  SECURITY_263,
  "iOS 26.3 and iPadOS 26.3; released February 11, 2026",
);

const versions = [
  version({
    id: "version-ios-26-0-1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      {
        text: "iOS 26.0.1 was the first public maintenance update after iOS 26. Apple documented connectivity failures on the iPhone 17 family, a cellular-registration problem affecting a small number of devices, and unexpected image artifacts under some lighting conditions.",
        citations: [ios2601],
      },
      {
        text: "The release also corrected blank custom-tinted icons and a VoiceOver state failure. Its security advisory identifies a separate FontParser bounds issue that could corrupt process memory when a device handled a malicious font.",
        citations: [ios2601, sec2601],
      },
    ],
    citations: [ios2601, sec2601],
  }),
  version({
    id: "version-ios-26-1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      {
        text: "iOS 26.1 added a higher-opacity tinted Liquid Glass appearance, expanded AirPods Live Translation language support, and refined Apple Music playback with track-swipe navigation and AutoMix over AirPlay.",
        citations: [ios261],
      },
      {
        text: "Local capture gained microphone gain and save-location controls, Fitness added manual workout logging, and Apple revised Camera access, low-bandwidth FaceTime audio, and default child-safety settings. A broad security advisory accompanied the update.",
        citations: [ios261, sec261],
      },
    ],
    citations: [ios261, sec261],
  }),
  version({
    id: "version-ipados-26-1",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      {
        text: "iPadOS 26.1 added Slide Over as a resizable windowing option and added microphone-gain and file-location controls for local capture. It also offered a more opaque tinted treatment for Liquid Glass.",
        citations: [ipad261],
      },
      {
        text: "Apple Music gained navigation and AirPlay refinements, while Camera access, low-bandwidth FaceTime audio, child-safety defaults, and the Apple Vision Pro app rounded out the documented feature set. Apple separately published a platform-spanning security advisory.",
        citations: [ipad261, sec261],
      },
    ],
    citations: [ipad261, sec261],
  }),
  version({
    id: "version-ios-26-2",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      {
        text: "iOS 26.2 expanded Apple Music, Podcasts, and Games, including offline lyrics, generated podcast chapters, mentioned-show links, game-library filters, live challenge banners, and improved support for connected controllers.",
        citations: [ios262],
      },
      {
        text: "The release also added AirDrop verification codes, urgent Reminder alarms, enhanced U.S. safety alerts, Lock Screen appearance controls, and additions across News, Home, Accessibility, and Freeform. Apple documented two user-facing fixes and a substantial security update.",
        citations: [ios262, sec262],
      },
    ],
    citations: [ios262, sec262],
  }),
  version({
    id: "version-ipados-26-2",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      {
        text: "iPadOS 26.2 extended the new windowing system with drag gestures for tiling apps and placing a window into Slide Over. Apple Music, Podcasts, Games, and controller support received the same release-specific additions documented for the iPad.",
        citations: [ipad262],
      },
      {
        text: "AirDrop codes, Reminder alarms, Lock Screen opacity, News navigation, Home accessory enrollment, alert flashing, and Freeform tables made up the wider enhancement set. Apple also documented two fixes and a broad security release.",
        citations: [ipad262, sec262],
      },
    ],
    citations: [ipad262, sec262],
  }),
  version({
    id: "version-ios-26-2-1",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      {
        text: "iOS 26.2.1 was a focused compatibility update released alongside the second-generation AirTag. Apple’s release note identifies support for the new accessory together with unspecified bug fixes.",
        citations: [ios2621, airTag],
      },
      {
        text: "Apple’s AirTag announcement documents the new model’s expanded finding range, louder speaker, and compatibility requirement of iOS 26 or later. The software note does not enumerate additional 26.2.1 changes, so none are inferred here.",
        citations: [airTag, ios2621],
      },
    ],
    citations: [ios2621, airTag],
  }),
  version({
    id: "version-ios-26-3",
    releaseNotesUrl: IOS_NOTES,
    paragraphs: [
      {
        text: "iOS 26.3 was a maintenance and security release. Apple’s consumer note does not itemize feature or bug-fix changes, so the version record does not invent a user-facing feature list.",
        citations: [ios263],
      },
      {
        text: "The security advisory supplies the concrete technical record across locked-device privacy, sensitive-data access, media processing, kernel and network protections, sandboxing, system services, and WebKit. One dyld entry is carefully limited to Apple’s statement about attacks against versions before iOS 26.",
        citations: [sec263],
      },
    ],
    citations: [ios263, sec263],
  }),
  version({
    id: "version-ipados-26-3",
    releaseNotesUrl: IPADOS_NOTES,
    paragraphs: [
      {
        text: "iPadOS 26.3 was a maintenance and security release. Apple’s consumer note provides no itemized feature or bug-fix list, so this article stays within the documented evidence.",
        citations: [ipad263],
      },
      {
        text: "Apple’s shared advisory records fixes affecting locked-device privacy, sensitive-data access, media and image processing, the kernel, sandbox boundaries, system frameworks, and WebKit on supported iPads.",
        citations: [sec263],
      },
    ],
    citations: [ipad263, sec263],
  }),
];

const events = [
  event({
    id: "version-ios-26-0-1",
    summary:
      "The public iOS 26.0.1 update corrected early connectivity, cellular, camera, icon, and VoiceOver problems and included one documented FontParser security fix.",
    citations: [ios2601, sec2601],
    changes: [
      change({
        key: "ios-26-0-1-wireless-disconnects",
        title: "iPhone 17-family Wi-Fi and Bluetooth stability",
        summary:
          "Apple corrected occasional Wi-Fi and Bluetooth disconnections on the iPhone 17, iPhone Air, and iPhone 17 Pro families.",
        category: "bugFix",
        action: "fixed",
        citations: [ios2601],
      }),
      change({
        key: "ios-26-0-1-cellular-registration",
        title: "Post-update cellular registration",
        summary:
          "The update fixed a condition that left a small number of iPhones unable to connect to a cellular network after moving to iOS 26.",
        category: "bugFix",
        action: "fixed",
        citations: [ios2601],
      }),
      change({
        key: "ios-26-0-1-camera-artifacts",
        title: "Lighting-related camera artifacts",
        summary:
          "Apple addressed unexpected artifacts in photos taken under some lighting conditions on the iPhone 17, iPhone Air, and iPhone 17 Pro families.",
        category: "bugFix",
        action: "fixed",
        citations: [ios2601],
      }),
      change({
        key: "ios-26-0-1-custom-tint-icons",
        title: "Blank custom-tinted app icons",
        summary:
          "The release corrected app icons that could appear blank after a user applied a custom tint.",
        category: "bugFix",
        action: "fixed",
        citations: [ios2601],
      }),
      change({
        key: "ios-26-0-1-voiceover-state",
        title: "VoiceOver availability after updating",
        summary:
          "Apple fixed a post-update state in which VoiceOver could become disabled for some users.",
        category: "bugFix",
        action: "fixed",
        citations: [ios2601],
      }),
      change({
        key: "ios-26-0-1-fontparser-cve-2025-43400",
        title: "FontParser bounds protection",
        summary:
          "Apple fixed CVE-2025-43400, an out-of-bounds write reachable through a malicious font that could terminate an app or corrupt process memory.",
        category: "security",
        action: "fixed",
        citations: [sec2601],
      }),
    ],
  }),
  event({
    id: "version-ios-26-1",
    summary:
      "The public iOS 26.1 release added appearance, translation, media, capture, fitness, camera, communications, child-safety, and security improvements.",
    citations: [ios261, sec261],
    changes: [
      change({
        key: "ios-26-1-liquid-glass-tint",
        title: "Tinted Liquid Glass appearance",
        summary:
          "A new setting let users choose a higher-opacity tinted Liquid Glass treatment instead of the default clear appearance.",
        citations: [ios261],
      }),
      change({
        key: "ios-26-1-airpods-live-translation-languages",
        title: "Additional AirPods Live Translation languages",
        summary:
          "Live Translation with compatible AirPods expanded to Chinese, Japanese, Korean, and Italian language support.",
        category: "compatibility",
        citations: [ios261],
      }),
      change({
        key: "ios-26-1-apple-music-playback-controls",
        title: "Apple Music navigation and AutoMix over AirPlay",
        summary:
          "Apple Music added MiniPlayer swipe navigation between tracks and extended AutoMix playback to AirPlay.",
        citations: [ios261],
      }),
      change({
        key: "ios-26-1-local-capture-controls",
        title: "Local capture gain and file-location controls",
        summary:
          "Local capture added gain control for external USB microphones and let users choose where captured files were saved.",
        citations: [ios261],
      }),
      change({
        key: "ios-26-1-fitness-camera-controls",
        title: "Manual workouts and Lock Screen camera control",
        summary:
          "The Fitness app gained direct manual workout logging, and Camera settings added control over the Lock Screen swipe gesture.",
        citations: [ios261],
      }),
      change({
        key: "ios-26-1-facetime-child-safety",
        title: "Low-bandwidth FaceTime and child-safety defaults",
        summary:
          "Apple improved FaceTime audio under limited bandwidth and enabled Communication Safety and adult-site filtering by default for existing child accounts in the documented age range.",
        citations: [ios261],
      }),
      change({
        key: "ios-ipados-26-1-security-hardening",
        title: "iOS and iPadOS 26.1 security hardening",
        summary:
          "Apple documented a broad security set covering privacy, sandbox boundaries, protected data, locked-device exposure, media handling, system services, and WebKit.",
        category: "security",
        action: "fixed",
        citations: [sec261],
      }),
    ],
  }),
  event({
    id: "version-ipados-26-1",
    summary:
      "The public iPadOS 26.1 release added Slide Over, expanded local capture, added appearance and media controls, and shipped platform security repairs.",
    citations: [ipad261, sec261],
    changes: [
      change({
        key: "ipados-26-1-slide-over-windowing",
        title: "Resizable Slide Over windowing",
        summary:
          "Slide Over became a resizable, always-available window that could be moved offscreen when it was not needed.",
        category: "feature",
        action: "introduced",
        citations: [ipad261],
      }),
      change({
        key: "ipados-26-1-local-capture-controls",
        title: "Local capture gain and file-location controls",
        summary:
          "Local capture added gain control for external USB microphones and let users choose where captured files were saved.",
        citations: [ipad261],
      }),
      change({
        key: "ipados-26-1-liquid-glass-tint",
        title: "Tinted Liquid Glass appearance",
        summary:
          "A new setting let users choose a higher-opacity tinted Liquid Glass treatment instead of the default clear appearance.",
        citations: [ipad261],
      }),
      change({
        key: "ipados-26-1-apple-music-playback-controls",
        title: "Apple Music navigation and AutoMix over AirPlay",
        summary:
          "Apple Music added MiniPlayer swipe navigation between tracks and extended AutoMix playback to AirPlay.",
        citations: [ipad261],
      }),
      change({
        key: "ipados-26-1-camera-facetime-safety-vision",
        title: "Camera, FaceTime, safety, and Vision Pro app updates",
        summary:
          "The release added a Lock Screen camera-gesture setting, improved low-bandwidth FaceTime audio, enabled documented child-safety defaults, and brought Apple’s Vision Pro app to iPad.",
        citations: [ipad261],
      }),
      change({
        key: "ios-ipados-26-1-security-hardening",
        title: "iOS and iPadOS 26.1 security hardening",
        summary:
          "Apple documented a broad security set covering privacy, sandbox boundaries, protected data, locked-device exposure, media handling, system services, and WebKit.",
        category: "security",
        action: "fixed",
        citations: [sec261],
      }),
    ],
  }),
  event({
    id: "version-ios-26-2",
    summary:
      "The public iOS 26.2 release expanded Music, Podcasts, Games, AirDrop, Reminders, safety alerts, home and accessibility tools, and security protections.",
    citations: [ios262, sec262],
    changes: [
      change({
        key: "ios-26-2-apple-music-offline-lyrics",
        title: "Apple Music favorites and offline lyrics",
        summary:
          "Apple Music surfaced Favorite Songs in Top Picks and made lyrics available offline for downloaded music.",
        citations: [ios262],
      }),
      change({
        key: "ios-26-2-podcast-navigation-links",
        title: "Generated podcast chapters and mentioned-show links",
        summary:
          "Podcasts added automatically generated chapter navigation and direct links to other shows mentioned in an episode.",
        citations: [ios262],
      }),
      change({
        key: "ios-26-2-games-library-controller-support",
        title: "Games filters, challenge banners, and controllers",
        summary:
          "Games added library filters and live challenge-leader banners while improving compatibility with connected controllers.",
        citations: [ios262],
      }),
      change({
        key: "ios-26-2-lock-screen-safety-reminders",
        title: "Lock Screen opacity, safety alerts, and Reminder alarms",
        summary:
          "The release added another Lock Screen time-opacity control, richer U.S. threat alerts, and alarms with snooze and Live Activity support for urgent Reminders.",
        citations: [ios262],
      }),
      change({
        key: "ios-26-2-airdrop-verification-codes",
        title: "AirDrop verification codes for unknown contacts",
        summary:
          "AirDrop could require a receiver-displayed code before completing a transfer with an unknown contact.",
        category: "security",
        action: "introduced",
        citations: [ios262],
      }),
      change({
        key: "ios-26-2-news-home-accessibility-freeform",
        title: "News, Home, Accessibility, and Freeform additions",
        summary:
          "Apple added News section links, multipack Home accessory pairing, screen-flash alerts, and structured tables in Freeform.",
        citations: [ios262],
      }),
      change({
        key: "ios-26-2-music-enterprise-state-fixes",
        title: "Music availability and managed-setting fixes",
        summary:
          "Apple fixed delayed playback for newly released pre-order albums and a Privacy and Security setting that could incorrectly appear enterprise-managed.",
        category: "bugFix",
        action: "fixed",
        citations: [ios262],
      }),
      change({
        key: "ios-ipados-26-2-security-hardening",
        title: "iOS and iPadOS 26.2 security hardening",
        summary:
          "Apple’s advisory records repairs across payment permissions, backup handling, caller identity, file access, media parsing, privacy boundaries, and WebKit.",
        category: "security",
        action: "fixed",
        citations: [sec262],
      }),
    ],
  }),
  event({
    id: "version-ipados-26-2",
    summary:
      "The public iPadOS 26.2 release expanded multitasking gestures, media and game apps, AirDrop verification, productivity tools, and platform security.",
    citations: [ipad262, sec262],
    changes: [
      change({
        key: "ipados-26-2-multitasking-drag-gestures",
        title: "Drag gestures for tiled and Slide Over windows",
        summary:
          "Users could drag an app from the Dock to tile its window or place it into Slide Over.",
        citations: [ipad262],
      }),
      change({
        key: "ipados-26-2-apple-music-offline-lyrics",
        title: "Apple Music favorites and offline lyrics",
        summary:
          "Apple Music surfaced Favorite Songs in Top Picks and made lyrics available offline for downloaded music.",
        citations: [ipad262],
      }),
      change({
        key: "ipados-26-2-podcast-navigation-links",
        title: "Generated podcast chapters and mentioned-show links",
        summary:
          "Podcasts added automatically generated chapter navigation and direct links to other shows mentioned in an episode.",
        citations: [ipad262],
      }),
      change({
        key: "ipados-26-2-games-library-controller-support",
        title: "Games filters, challenge banners, and controllers",
        summary:
          "Games added library filters and live challenge-leader banners while improving compatibility with connected controllers.",
        citations: [ipad262],
      }),
      change({
        key: "ipados-26-2-airdrop-reminders-productivity",
        title: "AirDrop codes, Reminder alarms, and productivity additions",
        summary:
          "The release added AirDrop verification codes, alarms for urgent Reminders, News navigation, Home multipack pairing, screen-flash alerts, and Freeform tables.",
        citations: [ipad262],
      }),
      change({
        key: "ipados-26-2-music-enterprise-state-fixes",
        title: "Music availability and managed-setting fixes",
        summary:
          "Apple fixed delayed playback for newly released pre-order albums and a Privacy and Security setting that could incorrectly appear enterprise-managed.",
        category: "bugFix",
        action: "fixed",
        citations: [ipad262],
      }),
      change({
        key: "ios-ipados-26-2-security-hardening",
        title: "iOS and iPadOS 26.2 security hardening",
        summary:
          "Apple’s advisory records repairs across payment permissions, backup handling, caller identity, file access, media parsing, privacy boundaries, and WebKit.",
        category: "security",
        action: "fixed",
        citations: [sec262],
      }),
    ],
  }),
  event({
    id: "version-ios-26-2-1",
    summary:
      "The public iOS 26.2.1 release added compatibility with the second-generation AirTag and included unspecified bug fixes without a separate itemized list.",
    citations: [ios2621, airTag],
    changes: [
      change({
        key: "ios-26-2-1-airtag-second-generation",
        title: "Second-generation AirTag support",
        summary:
          "iOS 26.2.1 added support for Apple’s second-generation AirTag, whose launch documentation describes expanded finding range and a louder speaker.",
        category: "compatibility",
        action: "introduced",
        citations: [ios2621, airTag],
      }),
    ],
  }),
  event({
    id: "version-ios-26-3",
    summary:
      "The public iOS 26.3 release was a security-heavy maintenance update with no itemized consumer feature list and a wide first-party advisory.",
    citations: [ios263, sec263],
    changes: [
      change({
        key: "ios-ipados-26-3-locked-device-privacy",
        title: "Locked-device privacy protections",
        summary:
          "Apple corrected multiple paths that could expose sensitive information to someone with physical access to a locked device.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-data-sandbox-privacy",
        title: "Sensitive-data, permission, and sandbox hardening",
        summary:
          "The advisory documents fixes for inappropriate data access, privacy-preference bypasses, app enumeration, and sandbox escape paths.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-media-memory-processing",
        title: "Media and image-processing hardening",
        summary:
          "Apple improved bounds and memory handling across audio, image, and other content-processing components.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-kernel-network-protections",
        title: "Kernel, privilege, and network protections",
        summary:
          "The release addressed kernel stability, root-privilege, and privileged-network interception issues documented for supported devices.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-webkit-hardening",
        title: "WebKit stability and tracking protections",
        summary:
          "Apple documented WebKit fixes for denial of service, process crashes, and tracking through Safari web extensions.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-26-3-dyld-targeted-attack-context",
        title: "dyld memory-corruption fix with qualified attack context",
        summary:
          "Apple fixed CVE-2026-20700 and said the underlying report concerned an extremely sophisticated attack against specific targeted individuals on versions before iOS 26; this entry does not claim exploitation of iOS 26.3.",
        category: "security",
        action: "fixed",
        citations: [
          cite(
            SECURITY_263,
            "dyld — CVE-2026-20700; Apple’s qualified exploitation statement",
          ),
        ],
      }),
    ],
  }),
  event({
    id: "version-ipados-26-3",
    summary:
      "The public iPadOS 26.3 release was a security-heavy maintenance update with no itemized consumer feature list and a wide shared advisory.",
    citations: [ipad263, sec263],
    changes: [
      change({
        key: "ios-ipados-26-3-locked-device-privacy",
        title: "Locked-device privacy protections",
        summary:
          "Apple corrected multiple paths that could expose sensitive information to someone with physical access to a locked device.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-data-sandbox-privacy",
        title: "Sensitive-data, permission, and sandbox hardening",
        summary:
          "The advisory documents fixes for inappropriate data access, privacy-preference bypasses, app enumeration, and sandbox escape paths.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-media-memory-processing",
        title: "Media and image-processing hardening",
        summary:
          "Apple improved bounds and memory handling across audio, image, and other content-processing components.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-kernel-network-protections",
        title: "Kernel, privilege, and network protections",
        summary:
          "The release addressed kernel stability, root-privilege, and privileged-network interception issues documented for supported devices.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
      change({
        key: "ios-ipados-26-3-webkit-hardening",
        title: "WebKit stability and tracking protections",
        summary:
          "Apple documented WebKit fixes for denial of service, process crashes, and tracking through Safari web extensions.",
        category: "security",
        action: "fixed",
        citations: [sec263],
      }),
    ],
  }),
];

const bundle = {
  formatVersion: 1,
  target: {
    projectId: "lh3yswzu",
    dataset: "production",
  },
  accessedAt: "2026-07-29",
  sources,
  versions,
  events,
  builds: [],
};

writeFileSync(outputPath, `${JSON.stringify(bundle, null, 2)}\n`);
console.log(
  `Wrote ${versions.length} versions, ${events.length} events, ${events.reduce(
    (sum, item) => sum + item.changes.length,
    0,
  )} changes, and ${sources.length} sources to ${outputPath}.`,
);
