import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";

const U = {
  macNews:
    "https://www.apple.com/newsroom/2021/10/macos-monterey-is-now-available/",
  macDeveloper:
    "https://developer.apple.com/documentation/macos-release-notes/macos-12_0_1-release-notes",
  macEnterprise: "https://support.apple.com/en-us/103271",
  macSecurity: "https://support.apple.com/en-us/103236",
  watch7: "https://support.apple.com/en-us/118391",
  watch8: "https://support.apple.com/en-us/118389",
  watchNews:
    "https://www.apple.com/newsroom/2021/09/watchos-8-is-available-today/",
  watch73Security: "https://support.apple.com/en-us/103054",
  watch74Security: "https://support.apple.com/en-us/119598",
  watch75Security: "https://support.apple.com/en-us/103135",
  watch76Security: "https://support.apple.com/en-us/102763",
  watch8Security: "https://support.apple.com/en-us/103156",
  watch81Security: "https://support.apple.com/en-us/103165",
  watch83Security: "https://support.apple.com/en-us/102761",
  tvUpdates: "https://support.apple.com/en-us/106336",
  tv144Security: "https://support.apple.com/en-us/103055",
  tv145Security: "https://support.apple.com/en-us/103064",
  tv146Security: "https://support.apple.com/en-us/103134",
  tv147Security: "https://support.apple.com/en-us/102884",
  tv15Security: "https://support.apple.com/en-us/103153",
  tv151Security: "https://support.apple.com/en-us/103167",
  tv152Security: "https://support.apple.com/en-us/102885",
};

const datedSecuritySources = [
  [
    U.macSecurity,
    "About the security content of macOS Monterey 12.0.1",
    "2021-10-25",
    ["macOS", "Monterey"],
  ],
  [
    U.watch73Security,
    "About the security content of watchOS 7.3",
    "2021-01-26",
    ["watchOS", "7.3"],
  ],
  [
    U.watch74Security,
    "About the security content of watchOS 7.4",
    "2021-04-26",
    ["watchOS", "7.4"],
  ],
  [
    U.watch75Security,
    "About the security content of watchOS 7.5",
    "2021-05-24",
    ["watchOS", "7.5"],
  ],
  [
    U.watch76Security,
    "About the security content of watchOS 7.6",
    "2021-07-19",
    ["watchOS", "7.6"],
  ],
  [
    U.watch8Security,
    "About the security content of watchOS 8",
    "2021-09-20",
    ["watchOS", "8"],
  ],
  [
    U.watch81Security,
    "About the security content of watchOS 8.1",
    "2021-10-25",
    ["watchOS", "8.1"],
  ],
  [
    U.watch83Security,
    "About the security content of watchOS 8.3",
    "2021-12-13",
    ["watchOS", "8.3"],
  ],
  [
    U.tv144Security,
    "About the security content of tvOS 14.4",
    "2021-01-26",
    ["tvOS", "14.4"],
  ],
  [
    U.tv145Security,
    "About the security content of tvOS 14.5",
    "2021-04-26",
    ["tvOS", "14.5"],
  ],
  [
    U.tv146Security,
    "About the security content of tvOS 14.6",
    "2021-05-24",
    ["tvOS", "14.6"],
  ],
  [
    U.tv147Security,
    "About the security content of tvOS 14.7",
    "2021-07-19",
    ["tvOS", "14.7"],
  ],
  [
    U.tv15Security,
    "About the security content of tvOS 15",
    "2021-09-20",
    ["tvOS", "15"],
  ],
  [
    U.tv151Security,
    "About the security content of tvOS 15.1",
    "2021-10-25",
    ["tvOS", "15.1"],
  ],
  [
    U.tv152Security,
    "About the security content of tvOS 15.2",
    "2021-12-13",
    ["tvOS", "15.2"],
  ],
];

const sources = [
  {
    url: U.macNews,
    title: "macOS Monterey is now available",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2021-10-25T00:00:00.000Z",
    topics: ["macOS", "Monterey", "public availability", "features"],
  },
  {
    url: U.macDeveloper,
    title: "macOS Monterey 12.0.1 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    topics: ["macOS", "Monterey", "developer release notes"],
  },
  {
    url: U.macEnterprise,
    title: "What's new for enterprise in macOS Monterey",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["macOS", "Monterey", "enterprise", "device management"],
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
    url: U.watch8,
    title: "About watchOS 8 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "8", "consumer release notes"],
  },
  {
    url: U.watchNews,
    title: "watchOS 8 is available today",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2021-09-20T00:00:00.000Z",
    topics: ["watchOS", "8", "public availability", "features"],
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
const reviewedAt = "2026-07-30T04:31:06Z";
const review = () => ({ status: "approved", reviewedAt });

function version({
  releaseVersionId,
  releaseNotesUrl,
  overviewText,
  overviewCitations,
  boundaryText,
  boundaryCitations,
  citations,
}) {
  return {
    releaseVersionId,
    authorship: "originalSynthesis",
    releaseNotesUrl,
    overview: article(
      heading("Release overview"),
      prose(overviewText, overviewCitations),
      heading("Evidence boundary"),
      prose(boundaryText, boundaryCitations),
    ),
    citations,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
  };
}

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
      "Matched Apple's version-specific release notes or security advisory to the existing audited public-release event.",
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

function event(releaseVersionId, summary, eventArticle, citations, changes) {
  return {
    target: { releaseVersionId, routeAlias: "public" },
    authorship: "originalSynthesis",
    summary,
    article: eventArticle,
    citations,
    changes,
    provenanceStatus: "editoriallyVerified",
    editorialReview: review(),
    isIndexable: true,
  };
}

const versions = [
  version({
    releaseVersionId: "version-macos-12-0",
    releaseNotesUrl: U.macDeveloper,
    overviewText:
      "The existing local macOS 12.0 record represents the public launch of macOS Monterey on October 25, 2021. Apple shipped and documented that public release as macOS 12.0.1, with FaceTime audio and video improvements, AirPlay to Mac, Live Text and Visual Look Up, Focus, richer Notes and Safari organization, and Shortcuts.",
    overviewCitations: [
      c(U.macNews, "October 25, 2021; launch features; Availability"),
      c(U.macSecurity, "macOS Monterey 12.0.1 — Released October 25, 2021"),
    ],
    boundaryText:
      "This bundle preserves the audited local 12.0 route instead of creating or renaming a version record. Apple's launch article marked SharePlay and Universal Control as later arrivals, so neither is attributed to this public event. Enterprise and security details are taken from Apple's 12.0.1-labeled records.",
    boundaryCitations: [
      c(U.macNews, "Features marked coming later this fall"),
      c(U.macDeveloper, "macOS Monterey 12.0.1 Release Notes"),
      c(U.macEnterprise, "macOS Monterey 12.0.1"),
    ],
    citations: [
      c(U.macNews, "UPDATE October 25, 2021"),
      c(U.macDeveloper, "macOS Monterey 12.0.1 Release Notes"),
      c(U.macEnterprise, "macOS Monterey 12.0.1"),
      c(U.macSecurity, "Released October 25, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-7-3",
    releaseNotesUrl: U.watch7,
    overviewText:
      "watchOS 7.3 was released on January 26, 2021. Apple documented the Unity face, Time to Walk for Fitness+ subscribers, ECG and irregular-rhythm notification expansion, and a fix for Control Center and Notification Center becoming unresponsive with Zoom enabled.",
    overviewCitations: [
      c(U.watch7, "watchOS 7.3"),
      c(U.watch73Security, "Released January 26, 2021"),
    ],
    boundaryText:
      "The accompanying advisory records additional security repairs across storage, media parsing, the kernel, WebKit, and WebRTC. This article does not project changes from later watchOS 7 updates or add undocumented claims.",
    boundaryCitations: [
      c(U.watch73Security, "APFS; CoreAudio; ImageIO; Kernel; WebKit; WebRTC"),
      c(U.watch7, "watchOS 7.3"),
    ],
    citations: [
      c(U.watch7, "watchOS 7.3"),
      c(U.watch73Security, "Released January 26, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-7-4",
    releaseNotesUrl: U.watch7,
    overviewText:
      "watchOS 7.4 was released on April 26, 2021. It enabled Apple Watch-assisted iPhone unlocking while wearing a face mask, Bluetooth device-type classification, Fitness+ playback over AirPlay 2, and ECG and irregular-rhythm notification availability in Australia and Vietnam.",
    overviewCitations: [
      c(U.watch7, "watchOS 7.4"),
      c(U.watch74Security, "Released April 26, 2021"),
    ],
    boundaryText:
      "Apple's security advisory adds documented repairs across code-signature checks, audio and image parsing, the kernel, WebKit, WebKit Storage, and Wi-Fi. No beta-only or undocumented behavior is attributed to the public release.",
    boundaryCitations: [
      c(
        U.watch74Security,
        "AppleMobileFileIntegrity; Audio; ImageIO; Kernel; WebKit; WebKit Storage; Wi-Fi",
      ),
      c(U.watch7, "watchOS 7.4"),
    ],
    citations: [
      c(U.watch7, "watchOS 7.4"),
      c(U.watch74Security, "Released April 26, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-7-5",
    releaseNotesUrl: U.watch7,
    overviewText:
      "watchOS 7.5 was released on May 24, 2021. The update added access to subscription content in Podcasts, Apple Card Family expense and spending controls, and ECG plus irregular-rhythm notification support in Malaysia and Peru.",
    overviewCitations: [
      c(U.watch7, "watchOS 7.5"),
      c(U.watch75Security, "Released May 24, 2021"),
    ],
    boundaryText:
      "Apple separately documented security fixes across audio, font and image parsing, privilege boundaries, certificate handling, and WebKit. The available first-party record supports no additional undocumented-change occurrence.",
    boundaryCitations: [
      c(
        U.watch75Security,
        "Audio; CoreText; FontParser; ImageIO; Kernel; Security; WebKit",
      ),
      c(U.watch7, "watchOS 7.5"),
    ],
    citations: [
      c(U.watch7, "watchOS 7.5"),
      c(U.watch75Security, "Released May 24, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-7-6",
    releaseNotesUrl: U.watch7,
    overviewText:
      "watchOS 7.6 was released on July 19, 2021. Its named consumer changes expanded both the ECG app and irregular-rhythm notifications to 30 additional regions on supported Apple Watch models.",
    overviewCitations: [
      c(U.watch7, "watchOS 7.6"),
      c(U.watch76Security, "Released July 19, 2021"),
    ],
    boundaryText:
      "The security advisory provides the rest of the concrete version record, including fixes in shortcuts, privacy controls, audio and image handling, code signing, the kernel, networking, and WebKit. No broader feature slate is inferred.",
    boundaryCitations: [
      c(
        U.watch76Security,
        "ActionKit; App Store; Audio; ImageIO; Identity Service; Kernel; Networking; WebKit",
      ),
      c(U.watch7, "watchOS 7.6"),
    ],
    citations: [
      c(U.watch7, "watchOS 7.6"),
      c(U.watch76Security, "Released July 19, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-8-0",
    releaseNotesUrl: U.watch8,
    overviewText:
      "watchOS 8.0 launched publicly on September 20, 2021 with Portraits and World Time faces, redesigned Home and Photos apps, expanded Wallet keys, new cycling and workout behavior, Mindfulness, sleeping respiratory rate, Find My apps, Focus, multiple timers, and AssistiveTouch.",
    overviewCitations: [
      c(U.watchNews, "September 20, 2021; launch features"),
      c(U.watch8, "watchOS 8"),
      c(U.watch8Security, "Released September 20, 2021"),
    ],
    boundaryText:
      "This page attributes only features Apple documented as present at the watchOS 8 launch. Later watchOS 8 point-release additions, staged regional availability, and community observations are not projected backward onto 8.0.",
    boundaryCitations: [
      c(U.watch8, "watchOS 8 through watchOS 8.3"),
      c(U.watchNews, "watchOS 8 is available today"),
    ],
    citations: [
      c(U.watchNews, "UPDATE September 20, 2021"),
      c(U.watch8, "watchOS 8"),
      c(U.watch8Security, "Released September 20, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-8-1",
    releaseNotesUrl: U.watch8,
    overviewText:
      "watchOS 8.1 was released on October 25, 2021. It improved fall detection during workouts, added verifiable vaccination cards to Wallet, enabled group Fitness+ workouts through SharePlay, and fixed inaccurate Always On time display for some users.",
    overviewCitations: [
      c(U.watch8, "watchOS 8.1"),
      c(U.watch81Security, "Released October 25, 2021"),
    ],
    boundaryText:
      "Apple's advisory documents additional fixes in audio and document parsing, privacy boundaries, iCloud, the kernel, secure text entry, and WebKit. The archive does not infer an undocumented or beta-specific list.",
    boundaryCitations: [
      c(
        U.watch81Security,
        "Audio; CoreGraphics; FileProvider; iCloud; Kernel; UIKit; WebKit",
      ),
      c(U.watch8, "watchOS 8.1"),
    ],
    citations: [
      c(U.watch8, "watchOS 8.1"),
      c(U.watch81Security, "Released October 25, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-watchos-8-3",
    releaseNotesUrl: U.watch8,
    overviewText:
      "watchOS 8.3 was released on December 13, 2021. Apple documented support for the Apple Music Voice Plan, App Privacy Report recording of data and sensor access, and a fix for notifications interrupting Mindfulness sessions.",
    overviewCitations: [
      c(U.watch8, "watchOS 8.3"),
      c(U.watch83Security, "Released December 13, 2021"),
    ],
    boundaryText:
      "The version-specific security advisory adds fixes across audio, proxies, image and font handling, contacts and game data, the kernel, Sandbox, privacy controls, and WebKit. No additional consumer or undocumented changes are claimed.",
    boundaryCitations: [
      c(
        U.watch83Security,
        "Audio; CFNetwork Proxies; ImageIO; Kernel; Sandbox; TCC; WebKit",
      ),
      c(U.watch8, "watchOS 8.3"),
    ],
    citations: [
      c(U.watch8, "watchOS 8.3"),
      c(U.watch83Security, "Released December 13, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-14-4",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 14.4 was released on January 26, 2021. Apple's consumer update history describes it only as a general performance and stability release rather than naming a new feature.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14.4"),
      c(U.tv144Security, "Released January 26, 2021"),
    ],
    boundaryText:
      "The substantive technical record is Apple's security advisory, which covers file systems, media and image parsing, privilege boundaries, the kernel, WebKit, and WebRTC. No more specific consumer or undocumented change is asserted.",
    boundaryCitations: [
      c(
        U.tv144Security,
        "APFS; CoreAudio; CoreMedia; ImageIO; Kernel; WebKit; WebRTC",
      ),
      c(U.tvUpdates, "tvOS 14.4"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 14.4"),
      c(U.tv144Security, "Released January 26, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-14-5",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 14.5 was released on April 26, 2021. It supported the second-generation Siri Remote, iPhone-based television color calibration, additional Siri languages, Type to Siri, automatic app offloading, and current PlayStation and Xbox controllers.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14.5"),
      c(U.tv145Security, "Released April 26, 2021"),
    ],
    boundaryText:
      "Apple's advisory separately records fixes across code-signature validation, privileged files, audio and image processing, the kernel, WebKit, and WebKit Storage. This article stays within version-labeled first-party documentation.",
    boundaryCitations: [
      c(
        U.tv145Security,
        "AppleMobileFileIntegrity; Assets; Audio; ImageIO; Kernel; WebKit; WebKit Storage",
      ),
      c(U.tvUpdates, "tvOS 14.5"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 14.5"),
      c(U.tv145Security, "Released April 26, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-14-6",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 14.6 was released on May 24, 2021. Apple lists general performance and stability improvements but does not enumerate a named consumer-facing feature for this version.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14.6"),
      c(U.tv146Security, "Released May 24, 2021"),
    ],
    boundaryText:
      "The version-specific advisory supplies the concrete detail, documenting fixes across audio, fonts and images, privilege and certificate boundaries, the kernel, WebKit, and networking. No undocumented occurrence is added.",
    boundaryCitations: [
      c(
        U.tv146Security,
        "Audio; CoreText; FontParser; ImageIO; Kernel; Security; WebKit",
      ),
      c(U.tvUpdates, "tvOS 14.6"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 14.6"),
      c(U.tv146Security, "Released May 24, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-14-7",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 14.7 was released on July 19, 2021. Apple's consumer update record classifies it as general performance and stability work without naming an individual feature.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 14.7"),
      c(U.tv147Security, "Released July 19, 2021"),
    ],
    boundaryText:
      "Apple's security advisory is the detailed source for this release, covering privacy, audio and image handling, code signing, the kernel, networking, and WebKit. The archive does not infer a missing consumer feature list.",
    boundaryCitations: [
      c(
        U.tv147Security,
        "App Store; Audio; ImageIO; Identity Service; Kernel; Networking; WebKit",
      ),
      c(U.tvUpdates, "tvOS 14.7"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 14.7"),
      c(U.tv147Security, "Released July 19, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-15-0",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 15.0 launched publicly on September 20, 2021 with household recommendations and Shared with You, additional Siri languages, Spatial Audio, HomePod mini speaker and voice controls, combined HomeKit camera viewing, biometric sign-in assistance, and new screen savers.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 15"),
      c(U.tv15Security, "Released September 20, 2021"),
    ],
    boundaryText:
      "This page maps Apple's tvOS 15-labeled launch section to the existing local 15.0 route. SharePlay is excluded because Apple's update history assigns it to tvOS 15.1, and no later point-release or undocumented claim is projected backward.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 15; tvOS 15.1"),
      c(U.tv15Security, "tvOS 15 security content"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 15"),
      c(U.tv15Security, "Released September 20, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-15-1",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 15.1 was released on October 25, 2021. Its named feature was SharePlay, which synchronized Apple TV viewing while participants continued a FaceTime conversation from an iPhone or iPad.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 15.1"),
      c(U.tv151Security, "Released October 25, 2021"),
    ],
    boundaryText:
      "Apple also describes general performance and stability work and documents fixes across media and document processing, privacy boundaries, iCloud, the kernel, secure text entry, and WebKit. No undocumented-change list is inferred.",
    boundaryCitations: [
      c(U.tvUpdates, "tvOS 15.1"),
      c(
        U.tv151Security,
        "Audio; CoreGraphics; FileProvider; iCloud; Kernel; UIKit; WebKit",
      ),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 15.1"),
      c(U.tv151Security, "Released October 25, 2021"),
    ],
  }),
  version({
    releaseVersionId: "version-tvos-15-2",
    releaseNotesUrl: U.tvUpdates,
    overviewText:
      "tvOS 15.2 was released on December 13, 2021. It introduced a redesigned Photos Memories experience, a Store tab in the Apple TV app, Apple Music Voice Plan support, additional Siri languages, and new aerial screen savers.",
    overviewCitations: [
      c(U.tvUpdates, "tvOS 15.2"),
      c(U.tv152Security, "Released December 13, 2021"),
    ],
    boundaryText:
      "The version-specific advisory adds security fixes across audio, proxies, image and font handling, the kernel, Sandbox, privacy controls, and WebKit. The archive stays within Apple's 15.2 section and includes no inferred undocumented behavior.",
    boundaryCitations: [
      c(
        U.tv152Security,
        "Audio; CFNetwork Proxies; ImageIO; Kernel; Sandbox; TCC; WebKit",
      ),
      c(U.tvUpdates, "tvOS 15.2"),
    ],
    citations: [
      c(U.tvUpdates, "tvOS 15.2"),
      c(U.tv152Security, "Released December 13, 2021"),
    ],
  }),
];

const events = [
  event(
    "version-macos-12-0",
    "The existing macOS 12.0 route reached its audited public appearance on October 25, 2021, corresponding to Apple's Monterey 12.0.1 launch documentation and its initial feature, enterprise, and security record.",
    article(
      heading("Public release"),
      prose(
        "Apple made macOS Monterey available on October 25, 2021. The local archive calls this release 12.0, while Apple's public release notes and security advisory identify the shipped version as 12.0.1; the route is preserved here so enrichment does not rewrite audited timeline identity.",
        [
          c(U.macNews, "UPDATE October 25, 2021; Availability"),
          c(U.macDeveloper, "macOS Monterey 12.0.1 Release Notes"),
          c(U.macSecurity, "macOS Monterey 12.0.1 — Released October 25, 2021"),
        ],
      ),
      heading("Documented launch scope"),
      prose(
        "The launch combined communication, cross-device media, text recognition, focus controls, note and browser organization, automation, sharing, enterprise-management, and security changes. Apple's launch article described SharePlay and Universal Control as later arrivals, so this public event does not claim either feature.",
        [
          c(
            U.macNews,
            "FaceTime; AirPlay to Mac; Live Text; Focus; Notes; Safari; Shortcuts; Shared with You",
          ),
          c(U.macNews, "Features marked coming later this fall"),
          c(U.macEnterprise, "macOS Monterey 12.0.1"),
          c(U.macSecurity, "macOS Monterey 12.0.1 security content"),
        ],
      ),
    ),
    [
      c(U.macNews, "October 25, 2021; Availability"),
      c(U.macDeveloper, "macOS Monterey 12.0.1 Release Notes"),
      c(U.macEnterprise, "macOS Monterey 12.0.1"),
      c(U.macSecurity, "Released October 25, 2021"),
    ],
    [
      change({
        key: "macos-12-facetime-audio-video",
        title: "FaceTime audio and video improvements",
        canonicalSummary:
          "FaceTime added spatialized group-call audio, voice-isolation and wide-spectrum microphone modes, Portrait mode, and a grid view.",
        category: "enhancement",
        action: "changed",
        summary:
          "Monterey expanded FaceTime call presentation and sound controls, including spatial audio placement, microphone processing options, background blur, and a uniform participant grid.",
        citations: [c(U.macNews, "FaceTime audio and video features")],
      }),
      change({
        key: "macos-12-airplay-to-mac",
        title: "AirPlay to Mac",
        canonicalSummary:
          "Supported Macs can receive, play, and present compatible AirPlay content from another Apple device.",
        category: "feature",
        action: "introduced",
        summary:
          "The release turned supported Mac displays and speakers into AirPlay destinations for content sent from an iPhone, iPad, or another Mac.",
        citations: [
          c(U.macNews, "Work Across Apple Devices with AirPlay to Mac"),
        ],
      }),
      change({
        key: "macos-12-live-text-visual-look-up",
        title: "Live Text and Visual Look Up",
        canonicalSummary:
          "Photos can expose recognized text for selection and actions, while Visual Look Up identifies supported subjects and landmarks.",
        category: "feature",
        action: "introduced",
        summary:
          "Monterey added system-level recognition for text inside images and contextual identification for selected visual subjects, making photographed information actionable.",
        citations: [c(U.macNews, "Live Text and Visual Look Up")],
      }),
      change({
        key: "macos-12-focus",
        title: "Focus modes across devices",
        canonicalSummary:
          "Focus filters notifications by activity and can synchronize its state across a user's Apple devices.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could define activity-specific notification boundaries, share an unavailable status in supported conversations, and carry the selected Focus across devices.",
        citations: [c(U.macNews, "Stay Focused with Focus")],
      }),
      change({
        key: "macos-12-notes-quick-note-tags",
        title: "Quick Note, tags, and Notes collaboration",
        canonicalSummary:
          "Notes gained a systemwide Quick Note surface, user-defined tags and browsers, and new collaboration visibility.",
        category: "enhancement",
        action: "changed",
        summary:
          "Monterey made it possible to capture a linked note from other apps, organize notes with tags, and see participant activity and mentions in shared notes.",
        citations: [
          c(U.macNews, "More Ways to Organize and Collaborate in Notes"),
        ],
      }),
      change({
        key: "macos-12-safari-tab-groups-privacy",
        title: "Safari Tab Groups and privacy protections",
        canonicalSummary:
          "Safari added synchronized Tab Groups and strengthened protections against trackers learning a user's IP address.",
        category: "enhancement",
        action: "changed",
        summary:
          "Tab Groups let users save and synchronize themed sets of pages, while updated tracking prevention reduced the identifying information available to known trackers.",
        citations: [
          c(U.macNews, "A Redesigned Browsing Experience with Safari"),
        ],
      }),
      change({
        key: "macos-12-shortcuts",
        title: "Shortcuts on Mac",
        canonicalSummary:
          "The Shortcuts app brought gallery-based and custom multi-step automation to Mac while retaining Automator import support.",
        category: "feature",
        action: "introduced",
        summary:
          "Monterey introduced the Shortcuts automation model on Mac, with system integrations, sharing, and a migration path for supported Automator workflows.",
        citations: [c(U.macNews, "Shortcuts Comes to Mac")],
      }),
      change({
        key: "macos-12-shared-with-you",
        title: "Shared with You",
        canonicalSummary:
          "Supported apps surface photos, articles, and other content that contacts shared through Messages.",
        category: "feature",
        action: "introduced",
        summary:
          "Shared with You connected Messages conversations to dedicated content areas in apps such as Photos, Safari, Apple News, Podcasts, and Apple TV.",
        citations: [
          c(U.macNews, "Shared with You Makes It Easy to Enjoy Content"),
        ],
      }),
      change({
        key: "macos-12-enterprise-erase-update-controls",
        title: "Enterprise erase and update-management controls",
        canonicalSummary:
          "Managed deployments gained Erase All Content and Settings plus expanded operating-system update deferral and enforcement controls.",
        category: "enhancement",
        action: "changed",
        summary:
          "Monterey added a local erase workflow on supported Macs and broadened MDM controls for update timing, user countdowns, extensions, enrollment, and firewall logging.",
        citations: [
          c(
            U.macEnterprise,
            "macOS Monterey 12.0.1 — Device Management; Bug fixes and other improvements",
          ),
        ],
      }),
      securityChange({
        key: "macos-12-0-1-security-baseline",
        title: "Monterey 12.0.1 security repairs",
        canonicalSummary:
          "The public Monterey build repaired vulnerabilities across system services, drivers, the kernel, media handling, privacy boundaries, networking, and WebKit.",
        summary:
          "Apple's advisory documents the initial Monterey security baseline, including fixes that addressed memory safety, privilege, disclosure, validation, and web-content risks.",
        url: U.macSecurity,
        locator: "macOS Monterey 12.0.1 security content",
      }),
    ],
  ),
  event(
    "version-watchos-7-3",
    "watchOS 7.3 reached the public channel on January 26, 2021 with a commemorative watch face, a guided walking experience, expanded heart-health availability, a Zoom-related fix, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 7.3 on January 26, 2021. Its consumer notes identify additions across watch-face design, Fitness+ audio, ECG and irregular-rhythm availability, plus a correction for Control Center and Notification Center when Zoom was enabled.",
        [
          c(U.watch7, "watchOS 7.3"),
          c(U.watch73Security, "Released January 26, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "The companion advisory documents additional repairs in APFS, audio and image processing, the kernel, WebKit, and WebRTC. This entry does not infer beta-only behavior or a separate undocumented-change list.",
        [
          c(
            U.watch73Security,
            "APFS; CoreAudio; ImageIO; Kernel; WebKit; WebRTC",
          ),
          c(U.watch7, "watchOS 7.3"),
        ],
      ),
    ),
    [
      c(U.watch7, "watchOS 7.3"),
      c(U.watch73Security, "Released January 26, 2021"),
    ],
    [
      change({
        key: "watchos-7-3-unity-face",
        title: "Unity watch face",
        canonicalSummary:
          "A Unity watch face inspired by the Pan-African flag changes its forms as the wearer moves.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 7.3 added the Unity face, whose changing shapes and color treatment were designed to recognize Black history and culture.",
        citations: [c(U.watch7, "watchOS 7.3 — Unity watch face")],
      }),
      change({
        key: "watchos-7-3-time-to-walk",
        title: "Time to Walk",
        canonicalSummary:
          "Fitness+ subscribers can play narrated walking episodes from guests while recording an outdoor walk.",
        category: "feature",
        action: "introduced",
        summary:
          "The Workout app gained Time to Walk, pairing guest stories and audio with a guided walking session for Apple Fitness+ subscribers.",
        citations: [c(U.watch7, "watchOS 7.3 — Time to Walk")],
      }),
      change({
        key: "watchos-7-3-ecg-regions",
        title: "ECG availability in four additional regions",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in Japan, Mayotte, the Philippines, and Thailand.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple expanded the regulated ECG app to four additional markets, subject to supported hardware and local availability.",
        citations: [c(U.watch7, "watchOS 7.3 — ECG app availability")],
      }),
      change({
        key: "watchos-7-3-irregular-rhythm-regions",
        title: "Irregular-rhythm notifications in five additional regions",
        canonicalSummary:
          "Irregular-rhythm notifications expanded to Japan, Mayotte, the Philippines, Taiwan, and Thailand.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The update extended irregular-rhythm notification availability to five additional markets where the feature had received support.",
        citations: [
          c(U.watch7, "watchOS 7.3 — Irregular heart rhythm notifications"),
        ],
      }),
      change({
        key: "watchos-7-3-zoom-control-center-fix",
        title: "Zoom navigation reliability",
        canonicalSummary:
          "The update corrected a condition that could stop Control Center and Notification Center from responding when Zoom was active.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple repaired an accessibility-related interaction failure affecting the two system overlays while display Zoom was enabled.",
        citations: [c(U.watch7, "watchOS 7.3 — Zoom fix")],
      }),
      securityChange({
        key: "watchos-7-3-security-repairs",
        title: "watchOS 7.3 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in storage, media parsing, the kernel, web rendering, and real-time communication components.",
        summary:
          "Apple's advisory records fixes across APFS, CoreAudio, ImageIO, the kernel, WebKit, and WebRTC, including a kernel issue Apple said may have been actively exploited.",
        url: U.watch73Security,
        locator: "APFS; CoreAudio; ImageIO; Kernel; WebKit; WebRTC",
      }),
    ],
  ),
  event(
    "version-watchos-7-4",
    "watchOS 7.4 reached the public channel on April 26, 2021 with mask-assisted iPhone unlocking, audio-device classification, Fitness+ AirPlay, health-feature expansion, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 7.4 on April 26, 2021. The update connected Apple Watch to iPhone authentication while wearing a mask, expanded audio and Fitness+ behavior, and added ECG and irregular-rhythm availability in two countries.",
        [
          c(U.watch7, "watchOS 7.4"),
          c(U.watch74Security, "Released April 26, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "Apple's advisory adds repairs across code validation, audio and image processing, the kernel, WebKit, browser storage, and Wi-Fi. No undocumented occurrence is added to the first-party public-release record.",
        [
          c(
            U.watch74Security,
            "AppleMobileFileIntegrity; Audio; ImageIO; Kernel; WebKit; WebKit Storage; Wi-Fi",
          ),
          c(U.watch7, "watchOS 7.4"),
        ],
      ),
    ),
    [
      c(U.watch7, "watchOS 7.4"),
      c(U.watch74Security, "Released April 26, 2021"),
    ],
    [
      change({
        key: "watchos-7-4-unlock-iphone-mask",
        title: "Unlock iPhone while wearing a mask",
        canonicalSummary:
          "An authenticated Apple Watch can help unlock a paired iPhone when Face ID detects that the wearer has a face covering.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added a proximity-based Apple Watch confirmation path for unlocking a Face ID-equipped iPhone while the user wore a mask.",
        citations: [
          c(U.watch7, "watchOS 7.4 — Unlock iPhone with Apple Watch"),
        ],
      }),
      change({
        key: "watchos-7-4-bluetooth-device-type",
        title: "Bluetooth device-type classification",
        canonicalSummary:
          "Settings can classify connected Bluetooth devices so headphone audio measurements are interpreted more accurately.",
        category: "enhancement",
        action: "changed",
        summary:
          "Users gained a device-type control for Bluetooth accessories, allowing headphone exposure reporting to distinguish relevant audio devices.",
        citations: [c(U.watch7, "watchOS 7.4 — Bluetooth device type")],
      }),
      change({
        key: "watchos-7-4-fitness-plus-airplay",
        title: "Fitness+ over AirPlay 2",
        canonicalSummary:
          "Apple Fitness+ audio and video can be sent to compatible AirPlay 2 televisions and other devices.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 7.4 enabled Fitness+ subscribers to play workouts through supported AirPlay 2 destinations beyond the existing Apple-device screens.",
        citations: [c(U.watch7, "watchOS 7.4 — AirPlay 2 for Apple Fitness+")],
      }),
      change({
        key: "watchos-7-4-ecg-australia-vietnam",
        title: "ECG availability in Australia and Vietnam",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in Australia and Vietnam.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple expanded ECG app availability to Australia and Vietnam on supported watches, subject to the feature's regulatory requirements.",
        citations: [c(U.watch7, "watchOS 7.4 — ECG app availability")],
      }),
      change({
        key: "watchos-7-4-irregular-rhythm-australia-vietnam",
        title: "Irregular-rhythm notifications in Australia and Vietnam",
        canonicalSummary:
          "Irregular-rhythm notifications became available in Australia and Vietnam.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The update expanded Apple Watch irregular-rhythm notification availability to users in Australia and Vietnam.",
        citations: [
          c(U.watch7, "watchOS 7.4 — Irregular heart rhythm notifications"),
        ],
      }),
      securityChange({
        key: "watchos-7-4-security-repairs",
        title: "watchOS 7.4 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in code validation, audio and image handling, the kernel, web rendering and storage, and Wi-Fi.",
        summary:
          "Apple's advisory documents repairs across AppleMobileFileIntegrity, Audio, ImageIO, the kernel, WebKit, WebKit Storage, and Wi-Fi.",
        url: U.watch74Security,
        locator:
          "AppleMobileFileIntegrity; Audio; ImageIO; Kernel; WebKit; WebKit Storage; Wi-Fi",
      }),
    ],
  ),
  event(
    "version-watchos-7-5",
    "watchOS 7.5 reached the public channel on May 24, 2021 with subscription podcasts, Apple Card Family controls, expanded heart-health availability, and a version-specific security repair set.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 7.5 on May 24, 2021. Its named consumer changes covered paid podcast content, shared Apple Card administration, and expansion of ECG and irregular-rhythm notifications to Malaysia and Peru.",
        [
          c(U.watch7, "watchOS 7.5"),
          c(U.watch75Security, "Released May 24, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "Apple separately documented fixes in audio, font and image parsing, the kernel, launch services, certificate validation, and WebKit. The source set supports no additional undocumented-change occurrence.",
        [
          c(
            U.watch75Security,
            "Audio; CoreText; FontParser; ImageIO; Kernel; LaunchServices; Security; WebKit",
          ),
          c(U.watch7, "watchOS 7.5"),
        ],
      ),
    ),
    [c(U.watch7, "watchOS 7.5"), c(U.watch75Security, "Released May 24, 2021")],
    [
      change({
        key: "watchos-7-5-podcast-subscriptions",
        title: "Podcast subscription content",
        canonicalSummary:
          "The Podcasts app can play subscriber-only programming from supported shows and channels.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 7.5 added access to paid subscription content offered through Apple's Podcasts channels and individual shows.",
        citations: [c(U.watch7, "watchOS 7.5 — Podcasts subscription content")],
      }),
      change({
        key: "watchos-7-5-apple-card-family",
        title: "Apple Card Family controls",
        canonicalSummary:
          "Apple Card owners can share an account, track combined spending, and manage spending controls and limits for participants.",
        category: "feature",
        action: "introduced",
        summary:
          "The update added Apple Card Family support on Apple Watch for shared-account spending visibility and participant controls.",
        citations: [c(U.watch7, "watchOS 7.5 — Apple Card Family")],
      }),
      change({
        key: "watchos-7-5-ecg-malaysia-peru",
        title: "ECG availability in Malaysia and Peru",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in Malaysia and Peru.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple expanded the regulated ECG app to supported watches in Malaysia and Peru.",
        citations: [c(U.watch7, "watchOS 7.5 — ECG app availability")],
      }),
      change({
        key: "watchos-7-5-irregular-rhythm-malaysia-peru",
        title: "Irregular-rhythm notifications in Malaysia and Peru",
        canonicalSummary:
          "Irregular-rhythm notifications became available in Malaysia and Peru.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release extended Apple Watch irregular-rhythm notification availability to Malaysia and Peru.",
        citations: [
          c(U.watch7, "watchOS 7.5 — Irregular heart rhythm notifications"),
        ],
      }),
      securityChange({
        key: "watchos-7-5-security-repairs",
        title: "watchOS 7.5 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across audio, font and image processing, the kernel, app-launch permissions, certificates, and web content.",
        summary:
          "Apple's advisory records fixes in Audio, Core Services, CoreText, FontParser, ImageIO, the kernel, LaunchServices, Security, and WebKit.",
        url: U.watch75Security,
        locator:
          "Audio; Core Services; CoreText; FontParser; ImageIO; Kernel; LaunchServices; Security; WebKit",
      }),
    ],
  ),
  event(
    "version-watchos-7-6",
    "watchOS 7.6 reached the public channel on July 19, 2021 with ECG and irregular-rhythm notifications expanded to 30 additional regions and a broad set of security corrections.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 7.6 on July 19, 2021. Its consumer notes name two regional expansions: the ECG app and irregular-rhythm notifications each reached 30 additional markets.",
        [
          c(U.watch7, "watchOS 7.6"),
          c(U.watch76Security, "Released July 19, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "The companion advisory documents repairs in shortcuts, store privacy, audio, fonts and images, identity services, the kernel, networking, privacy controls, and WebKit. No wider feature set is inferred from the narrow consumer note.",
        [
          c(
            U.watch76Security,
            "ActionKit; App Store; Audio; CoreAudio; FontParser; ImageIO; Identity Service; Kernel; Networking; TCC; WebKit",
          ),
          c(U.watch7, "watchOS 7.6"),
        ],
      ),
    ),
    [
      c(U.watch7, "watchOS 7.6"),
      c(U.watch76Security, "Released July 19, 2021"),
    ],
    [
      change({
        key: "watchos-7-6-ecg-regional-expansion",
        title: "ECG expanded to 30 additional regions",
        canonicalSummary:
          "The ECG app became available on supported Apple Watch models in 30 more regions.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 7.6 substantially broadened the ECG app's supported-market footprint, subject to compatible hardware and regional clearance.",
        citations: [c(U.watch7, "watchOS 7.6 — ECG app availability")],
      }),
      change({
        key: "watchos-7-6-irregular-rhythm-regional-expansion",
        title:
          "Irregular-rhythm notifications expanded to 30 additional regions",
        canonicalSummary:
          "Irregular-rhythm notifications became available in 30 more regions.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release expanded Apple Watch irregular-rhythm notifications to 30 additional markets.",
        citations: [
          c(U.watch7, "watchOS 7.6 — Irregular heart rhythm notifications"),
        ],
      }),
      securityChange({
        key: "watchos-7-6-security-repairs",
        title: "watchOS 7.6 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across automation, privacy, media parsing, identity services, the kernel, networking, and WebKit.",
        summary:
          "Apple's advisory documents fixes in ActionKit, App Store privacy, Audio, CoreAudio, FontParser, ImageIO, Identity Service, the kernel, Networking, TCC, and WebKit.",
        url: U.watch76Security,
        locator:
          "ActionKit; App Store; Audio; CoreAudio; FontParser; ImageIO; Identity Service; Kernel; Networking; TCC; WebKit",
      }),
    ],
  ),
  event(
    "version-watchos-8-0",
    "watchOS 8.0 reached the public channel on September 20, 2021 with new faces, Home and Wallet capabilities, activity and wellness tools, communication updates, device finding, accessibility, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple made watchOS 8 available on September 20, 2021. The launch included Portraits and World Time faces, redesigned Home and Photos experiences, expanded Wallet keys, cycling and workout additions, Mindfulness, sleep respiratory rate, richer messaging, Find My apps, Focus, timers, and AssistiveTouch.",
        [
          c(U.watchNews, "UPDATE September 20, 2021; launch features"),
          c(U.watch8, "watchOS 8"),
          c(U.watch8Security, "Released September 20, 2021"),
        ],
      ),
      heading("Release boundary"),
      prose(
        "This record describes features Apple assigned to the watchOS 8 launch and the security fixes in its launch advisory. It does not move later watchOS 8 point-release features into 8.0 or treat staged regional availability as universal.",
        [
          c(U.watch8, "watchOS 8 through watchOS 8.3"),
          c(U.watch8Security, "watchOS 8 security content"),
        ],
      ),
    ),
    [
      c(U.watchNews, "September 20, 2021; Availability"),
      c(U.watch8, "watchOS 8"),
      c(U.watch8Security, "Released September 20, 2021"),
    ],
    [
      change({
        key: "watchos-8-portraits-world-time-faces",
        title: "Portraits and World Time faces",
        canonicalSummary:
          "Portraits layers the time around portrait-photo subjects, while World Time shows time across 24 zones.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 8 added a depth-aware Portraits face using compatible iPhone photos and a World Time face built around global time-zone context.",
        citations: [
          c(U.watch8, "watchOS 8 — Watch Faces"),
          c(U.watchNews, "New Portraits Watch Face and Photos Features"),
        ],
      }),
      change({
        key: "watchos-8-home-redesign",
        title: "Redesigned Home app",
        canonicalSummary:
          "Home reorganizes accessories by context, surfaces device status, and provides quicker access to scenes, rooms, cameras, and intercom.",
        category: "enhancement",
        action: "changed",
        summary:
          "The updated Home app emphasized timely accessory controls, room navigation, camera viewing, doorbell context, and Intercom communication from the wrist.",
        citations: [
          c(U.watch8, "watchOS 8 — Home"),
          c(U.watchNews, "More Access with Wallet and a Redesigned Home App"),
        ],
      }),
      change({
        key: "watchos-8-wallet-keys",
        title: "Additional digital keys in Wallet",
        canonicalSummary:
          "Wallet supports compatible home, hotel, office, and car keys, with Ultra Wideband behavior on supported watches.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 8 broadened Wallet beyond payments and transit by adding supported access credentials for homes, workplaces, hotels, and vehicles.",
        citations: [
          c(U.watch8, "watchOS 8 — Wallet"),
          c(U.watchNews, "More Access with Wallet and a Redesigned Home App"),
        ],
      }),
      change({
        key: "watchos-8-workouts-cycling",
        title: "Tai Chi, Pilates, and cycling updates",
        canonicalSummary:
          "Workout added Tai Chi and Pilates, while cycling gained automatic detection, reminders, fall detection, and improved e-bike calorie estimates.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded workout types and made outdoor cycling sessions easier to start and safer to track, including spoken progress and specialized e-bike calculations.",
        citations: [
          c(U.watch8, "watchOS 8 — Fitness+ and Workout"),
          c(U.watchNews, "New Ways to Stay Fit and Healthy"),
        ],
      }),
      change({
        key: "watchos-8-fitness-plus-expansion",
        title: "Fitness+ Pilates, meditation, and playback updates",
        canonicalSummary:
          "Fitness+ added Pilates and guided meditation and supported picture-in-picture and additional filtering and playback options.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple expanded Fitness+ with new session formats and improved discovery and viewing, including picture-in-picture and stop/resume controls on compatible devices.",
        citations: [c(U.watch8, "watchOS 8 — Fitness+")],
      }),
      change({
        key: "watchos-8-mindfulness-reflect",
        title: "Mindfulness and Reflect",
        canonicalSummary:
          "The renamed Mindfulness app added guided Reflect sessions and refreshed Breathe visuals and tips.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 8 evolved Breathe into Mindfulness, adding short prompts for reflection alongside updated breathing-session presentation.",
        citations: [
          c(U.watch8, "watchOS 8 — Mindfulness"),
          c(U.watchNews, "A New Approach to Mindfulness"),
        ],
      }),
      change({
        key: "watchos-8-sleep-respiratory-rate",
        title: "Sleeping respiratory rate",
        canonicalSummary:
          "Apple Watch can estimate breaths per minute during sleep and surface the measurement and trends in Health.",
        category: "feature",
        action: "introduced",
        summary:
          "The update added overnight respiratory-rate measurement using the watch accelerometer, with results and trend context available in the iPhone Health app.",
        citations: [
          c(U.watch8, "watchOS 8 — Sleep"),
          c(U.watchNews, "Sleeping Respiratory Rate"),
        ],
      }),
      change({
        key: "watchos-8-messages-photos-sharing",
        title: "Richer Messages and Photos sharing",
        canonicalSummary:
          "Messages combines dictation, Scribble, and emoji in one composition flow, while Photos adds redesigned browsing and direct sharing.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 8 made mixed-input message editing more flexible and expanded photo discovery and sharing, including Memories and Featured Photos synchronization.",
        citations: [
          c(U.watch8, "watchOS 8 — Messages; Photos"),
          c(
            U.watchNews,
            "New Portraits Watch Face and Photos Features; Messages",
          ),
        ],
      }),
      change({
        key: "watchos-8-find-devices-items",
        title: "Find Devices, Find Items, and separation alerts",
        canonicalSummary:
          "Dedicated apps locate Apple devices and Find My network items, with supported alerts when a device is left behind.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought separate Find Devices and Find Items experiences to Apple Watch and added proximity-based notifications for selected devices.",
        citations: [c(U.watch8, "watchOS 8 — Find My")],
      }),
      change({
        key: "watchos-8-focus-contacts-timers-assistivetouch",
        title: "Focus, Contacts, multiple timers, and AssistiveTouch",
        canonicalSummary:
          "System utilities gained synchronized Focus, a Contacts app, multiple named timers, and one-handed gesture control on supported watches.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 8 combined productivity and accessibility additions: device-aware Focus, direct contact access, concurrent timer management, and AssistiveTouch hand gestures.",
        citations: [
          c(U.watch8, "watchOS 8 — Focus; Contacts; Timers; AssistiveTouch"),
        ],
      }),
      securityChange({
        key: "watchos-8-security-repairs",
        title: "watchOS 8 security repairs",
        canonicalSummary:
          "The launch repaired vulnerabilities across accessories, networking, media and font parsing, FaceTime, the kernel, Sandbox, WebKit, and Wi-Fi.",
        summary:
          "Apple's launch advisory documents fixes in Accessory Manager, bootp, CoreAudio, graphics, images and fonts, FaceTime, Foundation, the kernel, Sandbox, WebKit, and Wi-Fi.",
        url: U.watch8Security,
        locator:
          "Accessory Manager; bootp; CoreAudio; FaceTime; Foundation; Kernel; Sandbox; WebKit; Wi-Fi",
      }),
    ],
  ),
  event(
    "version-watchos-8-1",
    "watchOS 8.1 reached the public channel on October 25, 2021 with workout fall-detection refinements, verifiable vaccination cards, group Fitness+ through SharePlay, a display fix, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 8.1 on October 25, 2021. The consumer record names changes to workout fall detection, COVID-19 vaccination credentials in Wallet, synchronized group Fitness+ sessions, and the Always On display.",
        [
          c(U.watch8, "watchOS 8.1"),
          c(U.watch81Security, "Released October 25, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "The companion advisory adds fixes in audio and document processing, storage, iCloud, the kernel, secure text entry, and WebKit. This page contains no inferred beta-only or undocumented changes.",
        [
          c(
            U.watch81Security,
            "Audio; ColorSync; CoreAudio; CoreGraphics; FileProvider; iCloud; Kernel; UIKit; WebKit",
          ),
          c(U.watch8, "watchOS 8.1"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.1"),
      c(U.watch81Security, "Released October 25, 2021"),
    ],
    [
      change({
        key: "watchos-8-1-workout-fall-detection",
        title: "Workout fall detection refinements",
        canonicalSummary:
          "Fall detection uses updated algorithms during workouts and can be enabled only for workout activity.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 8.1 refined fall detection for workouts and added a setting that limits automatic fall detection to workout sessions.",
        citations: [c(U.watch8, "watchOS 8.1 — Fall Detection")],
      }),
      change({
        key: "watchos-8-1-vaccination-cards",
        title: "Verifiable vaccination cards in Wallet",
        canonicalSummary:
          "Supported COVID-19 vaccination records can be presented as verifiable cards from Apple Wallet.",
        category: "feature",
        action: "introduced",
        summary:
          "The update added a standards-based Wallet presentation for supported vaccination credentials stored on the user's devices.",
        citations: [c(U.watch8, "watchOS 8.1 — Vaccination card support")],
      }),
      change({
        key: "watchos-8-1-fitness-plus-shareplay",
        title: "Group Fitness+ workouts with SharePlay",
        canonicalSummary:
          "Up to 32 participants can synchronize a Fitness+ workout or meditation during a FaceTime call.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 8.1 connected Fitness+ to SharePlay so a FaceTime group could follow the same supported workout or meditation together.",
        citations: [c(U.watch8, "watchOS 8.1 — Fitness+ SharePlay")],
      }),
      change({
        key: "watchos-8-1-always-on-time-fix",
        title: "Always On time-display correction",
        canonicalSummary:
          "The release corrected inaccurate time display for some users when the Always On screen was dimmed.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple repaired a condition in which the displayed time could be wrong for affected Apple Watch Series 5 and later users with Always On enabled.",
        citations: [c(U.watch8, "watchOS 8.1 — Always On display fix")],
      }),
      securityChange({
        key: "watchos-8-1-security-repairs",
        title: "watchOS 8.1 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in media and document processing, cloud and file services, the kernel, text entry, and web content.",
        summary:
          "Apple's advisory records fixes across audio, ColorSync, CoreGraphics, FileProvider, Game Center, iCloud, the kernel, UIKit, and WebKit.",
        url: U.watch81Security,
        locator:
          "Audio; ColorSync; CoreAudio; CoreGraphics; FileProvider; Game Center; iCloud; Kernel; UIKit; WebKit",
      }),
    ],
  ),
  event(
    "version-watchos-8-3",
    "watchOS 8.3 reached the public channel on December 13, 2021 with Apple Music Voice Plan support, App Privacy Report data collection, a Mindfulness notification fix, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 8.3 on December 13, 2021. Its named consumer changes added the Apple Music Voice Plan, contributed app and sensor-access activity to App Privacy Report, and corrected interruptions during Mindfulness sessions.",
        [
          c(U.watch8, "watchOS 8.3"),
          c(U.watch83Security, "Released December 13, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "The security advisory documents further repairs in audio, network proxies, images and fonts, crash reporting, game and message data, the kernel, Sandbox, privacy controls, and WebKit. No undocumented-change list is claimed.",
        [
          c(
            U.watch83Security,
            "Audio; CFNetwork Proxies; ColorSync; CoreAudio; Crash Reporter; Game Center; ImageIO; Kernel; Messages; Sandbox; TCC; WebKit",
          ),
          c(U.watch8, "watchOS 8.3"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.3"),
      c(U.watch83Security, "Released December 13, 2021"),
    ],
    [
      change({
        key: "watchos-8-3-apple-music-voice-plan",
        title: "Apple Music Voice Plan",
        canonicalSummary:
          "Apple Watch can access the Siri-controlled Apple Music Voice Plan subscription tier.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 8.3 added support for Apple's voice-directed Apple Music subscription option on Apple Watch.",
        citations: [c(U.watch8, "watchOS 8.3 — Apple Music Voice Plan")],
      }),
      change({
        key: "watchos-8-3-app-privacy-report-data",
        title: "App Privacy Report activity",
        canonicalSummary:
          "Apps can contribute records of data access and sensor access to App Privacy Report.",
        category: "security",
        action: "introduced",
        summary:
          "The update enabled watchOS app activity involving data and sensors to appear in the user's App Privacy Report.",
        citations: [c(U.watch8, "watchOS 8.3 — App Privacy Report")],
      }),
      change({
        key: "watchos-8-3-mindfulness-notification-fix",
        title: "Mindfulness notification interruption fix",
        canonicalSummary:
          "Notifications no longer interrupt Mindfulness sessions for affected users.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple corrected a condition in which incoming notifications could break the intended focus of an active Mindfulness session.",
        citations: [c(U.watch8, "watchOS 8.3 — Mindfulness notification fix")],
      }),
      securityChange({
        key: "watchos-8-3-security-repairs",
        title: "watchOS 8.3 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across audio, proxies, media parsing, crash and app data, the kernel, Sandbox, privacy controls, and WebKit.",
        summary:
          "Apple's advisory documents fixes in Audio, CFNetwork Proxies, ColorSync, CoreAudio, Crash Reporter, Game Center, ImageIO, the kernel, Messages, Sandbox, SQLite, TCC, and WebKit.",
        url: U.watch83Security,
        locator:
          "Audio; CFNetwork Proxies; ColorSync; CoreAudio; Crash Reporter; Game Center; ImageIO; Kernel; Messages; Sandbox; SQLite; TCC; WebKit",
      }),
    ],
  ),
  event(
    "version-tvos-14-4",
    "tvOS 14.4 reached the public channel on January 26, 2021 as a general performance and stability update with a separately documented security repair set.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 14.4 on January 26, 2021. Its consumer update history does not enumerate a named feature and describes the release only in terms of general performance and stability improvements.",
        [
          c(U.tvUpdates, "tvOS 14.4"),
          c(U.tv144Security, "Released January 26, 2021"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "The version-specific advisory supplies the detailed technical record, covering storage, audio, media and image processing, the kernel, WebKit, and WebRTC. This article does not invent a more specific consumer-facing change list.",
        [
          c(
            U.tv144Security,
            "APFS; CoreAudio; CoreMedia; ImageIO; Kernel; WebKit; WebRTC",
          ),
          c(U.tvUpdates, "tvOS 14.4"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 14.4"),
      c(U.tv144Security, "Released January 26, 2021"),
    ],
    [
      change({
        key: "tvos-14-4-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple's consumer note gives no narrower feature or fix breakdown for tvOS 14.4 beyond general performance and stability work.",
        citations: [c(U.tvUpdates, "tvOS 14.4")],
      }),
      securityChange({
        key: "tvos-14-4-security-repairs",
        title: "tvOS 14.4 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in file systems, audio and media parsing, the kernel, web rendering, and real-time communications.",
        summary:
          "Apple's advisory documents fixes in APFS, CoreAudio, CoreMedia, ImageIO, the kernel, WebKit, and WebRTC.",
        url: U.tv144Security,
        locator: "APFS; CoreAudio; CoreMedia; ImageIO; Kernel; WebKit; WebRTC",
      }),
    ],
  ),
  event(
    "version-tvos-14-5",
    "tvOS 14.5 reached the public channel on April 26, 2021 with second-generation Siri Remote support, display calibration, language and accessibility additions, app offloading, controller compatibility, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 14.5 on April 26, 2021. The update supported the redesigned Siri Remote, added iPhone-assisted color balancing, broadened Siri and typed-command options, automated unused-app storage recovery, and recognized newer PlayStation and Xbox controllers.",
        [
          c(U.tvUpdates, "tvOS 14.5"),
          c(U.tv145Security, "Released April 26, 2021"),
        ],
      ),
      heading("Security record"),
      prose(
        "The companion advisory documents fixes in code-signature checks, protected asset access, audio and image processing, the kernel, WebKit, browser storage, and related components. No undocumented behavior is added.",
        [
          c(
            U.tv145Security,
            "AppleMobileFileIntegrity; Assets; Audio; ImageIO; Kernel; WebKit; WebKit Storage",
          ),
          c(U.tvUpdates, "tvOS 14.5"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 14.5"),
      c(U.tv145Security, "Released April 26, 2021"),
    ],
    [
      change({
        key: "tvos-14-5-second-generation-siri-remote",
        title: "Second-generation Siri Remote support",
        canonicalSummary:
          "Apple TV supports the redesigned Siri Remote introduced with the 2021 Apple TV 4K.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 14.5 added system support for the second-generation Siri Remote and its revised navigation and control layout.",
        citations: [c(U.tvUpdates, "tvOS 14.5 — Siri Remote")],
      }),
      change({
        key: "tvos-14-5-color-balance",
        title: "iPhone-assisted television color balance",
        canonicalSummary:
          "A compatible iPhone can measure a television's color output and derive an Apple TV display adjustment.",
        category: "feature",
        action: "introduced",
        summary:
          "The update introduced a calibration workflow that used an iPhone's sensors to evaluate and adjust Apple TV video output without changing the television's settings.",
        citations: [c(U.tvUpdates, "tvOS 14.5 — Color balance")],
      }),
      change({
        key: "tvos-14-5-siri-language-expansion",
        title: "Additional Siri languages",
        canonicalSummary:
          "Siri support expanded to German in Austria, English in Ireland and New Zealand, and additional regional voices.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 14.5 broadened the set of localized Siri language and voice options available on supported Apple TV configurations.",
        citations: [c(U.tvUpdates, "tvOS 14.5 — Siri")],
      }),
      change({
        key: "tvos-14-5-type-to-siri",
        title: "Type to Siri",
        canonicalSummary:
          "An accessibility setting allows Siri requests to be entered with an onscreen keyboard instead of spoken.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added a typed alternative for issuing Siri requests on Apple TV, improving access when voice input was unsuitable.",
        citations: [c(U.tvUpdates, "tvOS 14.5 — Type to Siri")],
      }),
      change({
        key: "tvos-14-5-offload-unused-apps",
        title: "Offload unused apps",
        canonicalSummary:
          "Apple TV can automatically remove infrequently used app binaries while preserving their documents and data.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 14.5 added an automatic storage-management option that reclaimed app space while retaining data for a later reinstall.",
        citations: [c(U.tvUpdates, "tvOS 14.5 — Home Screen")],
      }),
      change({
        key: "tvos-14-5-dualsense-xbox-controller-support",
        title: "DualSense and current Xbox controller support",
        canonicalSummary:
          "Apple TV can pair with PlayStation 5 DualSense and Xbox Series X or S wireless controllers.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The update expanded game-controller pairing to Sony's DualSense and Microsoft's Xbox Series generation of wireless controllers.",
        citations: [c(U.tvUpdates, "tvOS 14.5 — Game controllers")],
      }),
      securityChange({
        key: "tvos-14-5-security-repairs",
        title: "tvOS 14.5 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving code validation, protected assets, media and image processing, the kernel, web content, and web storage.",
        summary:
          "Apple's advisory records fixes across AppleMobileFileIntegrity, Assets, Audio, CFNetwork, CoreAudio, ImageIO, the kernel, WebKit, WebKit Storage, and Wi-Fi.",
        url: U.tv145Security,
        locator:
          "AppleMobileFileIntegrity; Assets; Audio; CFNetwork; CoreAudio; ImageIO; Kernel; WebKit; WebKit Storage; Wi-Fi",
      }),
    ],
  ),
  event(
    "version-tvos-14-6",
    "tvOS 14.6 reached the public channel on May 24, 2021 as a general performance and stability update backed by a detailed Apple security advisory.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 14.6 on May 24, 2021. Its consumer update history provides no named feature list and characterizes the version as general performance and stability work.",
        [
          c(U.tvUpdates, "tvOS 14.6"),
          c(U.tv146Security, "Released May 24, 2021"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "Apple's security advisory supplies the concrete version record, with fixes across audio, font and image parsing, privilege boundaries, certificates, the kernel, networking, and WebKit. No additional consumer or undocumented change is asserted.",
        [
          c(
            U.tv146Security,
            "Audio; CoreText; FontParser; ImageIO; Kernel; Security; WebKit",
          ),
          c(U.tvUpdates, "tvOS 14.6"),
        ],
      ),
    ),
    [c(U.tvUpdates, "tvOS 14.6"), c(U.tv146Security, "Released May 24, 2021")],
    [
      change({
        key: "tvos-14-6-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple does not publish a more granular consumer feature or fix description for tvOS 14.6.",
        citations: [c(U.tvUpdates, "tvOS 14.6")],
      }),
      securityChange({
        key: "tvos-14-6-security-repairs",
        title: "tvOS 14.6 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in audio, font and image handling, system privileges, certificates, the kernel, networking, and web content.",
        summary:
          "Apple's advisory documents fixes in Audio, Core Services, CoreText, FontParser, ImageIO, the kernel, LaunchServices, Security, WebKit, and Wi-Fi.",
        url: U.tv146Security,
        locator:
          "Audio; Core Services; CoreText; FontParser; ImageIO; Kernel; LaunchServices; Security; WebKit; Wi-Fi",
      }),
    ],
  ),
  event(
    "version-tvos-14-7",
    "tvOS 14.7 reached the public channel on July 19, 2021 as a general performance and stability update with security fixes spanning privacy, media, identity, kernel, network, and web components.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 14.7 on July 19, 2021. The consumer update record names no individual feature and limits its description to general performance and stability improvements.",
        [
          c(U.tvUpdates, "tvOS 14.7"),
          c(U.tv147Security, "Released July 19, 2021"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "The security advisory provides the detailed record, covering app-store privacy, audio and image processing, identity services, the kernel, networking, and WebKit. The absence of named consumer details is retained as a source gap.",
        [
          c(
            U.tv147Security,
            "App Store; Audio; ImageIO; Identity Service; Kernel; Networking; WebKit",
          ),
          c(U.tvUpdates, "tvOS 14.7"),
        ],
      ),
    ),
    [c(U.tvUpdates, "tvOS 14.7"), c(U.tv147Security, "Released July 19, 2021")],
    [
      change({
        key: "tvos-14-7-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple does not enumerate a more specific consumer feature or correction for tvOS 14.7.",
        citations: [c(U.tvUpdates, "tvOS 14.7")],
      }),
      securityChange({
        key: "tvos-14-7-security-repairs",
        title: "tvOS 14.7 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities affecting privacy, media and image handling, identity services, the kernel, networking, and WebKit.",
        summary:
          "Apple's advisory documents fixes in App Store privacy, Audio, CoreAudio, FontParser, ImageIO, Identity Service, the kernel, Networking, TCC, and WebKit.",
        url: U.tv147Security,
        locator:
          "App Store; Audio; CoreAudio; FontParser; ImageIO; Identity Service; Kernel; Networking; TCC; WebKit",
      }),
    ],
  ),
  event(
    "version-tvos-15-0",
    "tvOS 15.0 reached the public channel on September 20, 2021 with household recommendations, shared-content discovery, language and audio additions, Home integrations, assisted sign-in, new screen savers, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15 on September 20, 2021, corresponding to the existing local 15.0 route. Its launch features covered personalized household viewing, shared-content discovery, Siri languages, Spatial Audio, HomePod and HomeKit integration, iPhone-assisted authentication, and aerial screen savers.",
        [
          c(U.tvUpdates, "tvOS 15"),
          c(U.tv15Security, "Released September 20, 2021"),
        ],
      ),
      heading("Release boundary"),
      prose(
        "The security advisory records additional system repairs for the launch. SharePlay is not attributed to 15.0 because Apple's cumulative update page places that feature in tvOS 15.1, and later point-release changes are not projected backward.",
        [
          c(U.tvUpdates, "tvOS 15; tvOS 15.1"),
          c(U.tv15Security, "tvOS 15 security content"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15"),
      c(U.tv15Security, "Released September 20, 2021"),
    ],
    [
      change({
        key: "tvos-15-household-recommendations-shared-with-you",
        title: "Household recommendations and Shared with You",
        canonicalSummary:
          "Apple TV adds a multi-person For All of You row and surfaces compatible shows and movies shared through Messages.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 15 combined recommendations for a selected household group and added a Shared with You destination for video links received in Messages.",
        citations: [
          c(U.tvUpdates, "tvOS 15 — For All of You; Shared with You"),
        ],
      }),
      change({
        key: "tvos-15-siri-language-expansion",
        title: "Additional Siri languages and regions",
        canonicalSummary:
          "Siri expanded to Cantonese in Hong Kong, English in India, Italian in Italy, and Mandarin in Taiwan.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release broadened Apple TV Siri support with four additional language-and-region combinations.",
        citations: [c(U.tvUpdates, "tvOS 15 — Siri")],
      }),
      change({
        key: "tvos-15-spatial-audio-airpods",
        title: "Spatial Audio with compatible AirPods",
        canonicalSummary:
          "AirPods Pro and AirPods Max can provide dynamic-head-tracked Spatial Audio during compatible Apple TV playback.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 15 added a private listening mode that anchored supported surround presentation to the television as the listener moved.",
        citations: [c(U.tvUpdates, "tvOS 15 — Spatial audio")],
      }),
      change({
        key: "tvos-15-homepod-mini-speaker-controls",
        title: "HomePod mini default speaker and Siri controls",
        canonicalSummary:
          "HomePod mini can serve as an Apple TV 4K default speaker, and supported HomePod voice requests can control Apple TV playback.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update deepened Apple TV and HomePod integration by supporting persistent HomePod mini audio output and hands-free playback commands.",
        citations: [c(U.tvUpdates, "tvOS 15 — HomePod controls")],
      }),
      change({
        key: "tvos-15-homekit-camera-grid",
        title: "Multiple HomeKit camera views",
        canonicalSummary:
          "Apple TV can display all compatible HomeKit cameras together and expose nearby accessory controls.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 15 expanded the television's Home view from individual feeds to a combined camera overview with contextual accessory access.",
        citations: [c(U.tvUpdates, "tvOS 15 — HomeKit cameras")],
      }),
      change({
        key: "tvos-15-iphone-assisted-sign-in",
        title: "Face ID and Touch ID assisted sign-in",
        canonicalSummary:
          "A nearby iPhone or iPad can use Face ID or Touch ID to authorize supported Apple TV purchases and sign-ins.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release extended mobile-device authentication to compatible Apple TV prompts, reducing remote-based credential entry.",
        citations: [c(U.tvUpdates, "tvOS 15 — Sign in with Apple ID")],
      }),
      change({
        key: "tvos-15-grand-canyon-patagonia-yosemite-screensavers",
        title: "New landscape screen savers",
        canonicalSummary:
          "Aerial screen savers added views of the Grand Canyon, Patagonia, and Yosemite.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 15 expanded the Apple TV aerial collection with new scenery from three landscape destinations.",
        citations: [c(U.tvUpdates, "tvOS 15 — Screen savers")],
      }),
      securityChange({
        key: "tvos-15-security-repairs",
        title: "tvOS 15 security repairs",
        canonicalSummary:
          "The launch repaired vulnerabilities across accessory and network services, media and font processing, FaceTime, the kernel, Sandbox, WebKit, and Wi-Fi.",
        summary:
          "Apple's launch advisory documents fixes in Accessory Manager, bootp, CoreAudio, graphics, images and fonts, FaceTime, Foundation, the kernel, Sandbox, WebKit, and Wi-Fi.",
        url: U.tv15Security,
        locator:
          "Accessory Manager; bootp; CoreAudio; FaceTime; Foundation; Kernel; Sandbox; WebKit; Wi-Fi",
      }),
    ],
  ),
  event(
    "version-tvos-15-1",
    "tvOS 15.1 reached the public channel on October 25, 2021 with SharePlay, general performance and stability work, and a version-specific security repair set.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15.1 on October 25, 2021. Its named feature was SharePlay, which synchronized supported Apple TV viewing while participants remained connected through FaceTime on an iPhone or iPad.",
        [
          c(U.tvUpdates, "tvOS 15.1"),
          c(U.tv151Security, "Released October 25, 2021"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "Apple also lists general performance and stability work and documents security fixes in media and document processing, file and cloud services, the kernel, secure text entry, and WebKit. No undocumented changes are inferred.",
        [
          c(U.tvUpdates, "tvOS 15.1"),
          c(
            U.tv151Security,
            "Audio; CoreGraphics; FileProvider; iCloud; Kernel; UIKit; WebKit",
          ),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15.1"),
      c(U.tv151Security, "Released October 25, 2021"),
    ],
    [
      change({
        key: "tvos-15-1-shareplay",
        title: "SharePlay",
        canonicalSummary:
          "Apple TV can play supported synchronized video while a FaceTime conversation continues on an iPhone or iPad.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 15.1 brought shared playback controls and synchronized compatible viewing to FaceTime sessions through SharePlay.",
        citations: [c(U.tvUpdates, "tvOS 15.1 — SharePlay")],
      }),
      change({
        key: "tvos-15-1-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "The update also contains general work intended to improve Apple TV performance and stability.",
        category: "enhancement",
        action: "changed",
        summary:
          "Alongside SharePlay, Apple's consumer note identifies a general performance and stability maintenance component.",
        citations: [c(U.tvUpdates, "tvOS 15.1")],
      }),
      securityChange({
        key: "tvos-15-1-security-repairs",
        title: "tvOS 15.1 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in media and document parsing, files and cloud services, the kernel, text entry, and WebKit.",
        summary:
          "Apple's advisory records fixes across Audio, ColorSync, CoreAudio, CoreGraphics, FileProvider, Game Center, iCloud, the kernel, UIKit, and WebKit.",
        url: U.tv151Security,
        locator:
          "Audio; ColorSync; CoreAudio; CoreGraphics; FileProvider; Game Center; iCloud; Kernel; UIKit; WebKit",
      }),
    ],
  ),
  event(
    "version-tvos-15-2",
    "tvOS 15.2 reached the public channel on December 13, 2021 with redesigned Photos Memories, a Store tab, Apple Music Voice Plan support, language and screen-saver additions, maintenance work, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15.2 on December 13, 2021. The update redesigned Photos Memories, added an Apple TV app Store tab, supported the Apple Music Voice Plan, broadened Siri languages, and expanded the aerial screen-saver collection.",
        [
          c(U.tvUpdates, "tvOS 15.2"),
          c(U.tv152Security, "Released December 13, 2021"),
        ],
      ),
      heading("Security and maintenance"),
      prose(
        "Apple also identifies general performance and stability work. The matching advisory documents repairs in audio, proxies, images and fonts, the kernel, Sandbox, privacy controls, and WebKit; no undocumented behavior is added.",
        [
          c(U.tvUpdates, "tvOS 15.2"),
          c(
            U.tv152Security,
            "Audio; CFNetwork Proxies; ImageIO; Kernel; Sandbox; TCC; WebKit",
          ),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15.2"),
      c(U.tv152Security, "Released December 13, 2021"),
    ],
    [
      change({
        key: "tvos-15-2-photos-memories-redesign",
        title: "Redesigned Photos Memories",
        canonicalSummary:
          "Photos Memories gained a new interface, animations, transitions, and personalized Apple Music accompaniment.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 15.2 refreshed the television Memories experience with updated presentation and music selected to fit the user's photo collection.",
        citations: [c(U.tvUpdates, "tvOS 15.2 — Photos")],
      }),
      change({
        key: "tvos-15-2-apple-tv-store-tab",
        title: "Store tab in the Apple TV app",
        canonicalSummary:
          "The Apple TV app gained a dedicated place to browse, buy, and rent films and television programs.",
        category: "feature",
        action: "introduced",
        summary:
          "The release consolidated transactional video discovery into a Store tab within the Apple TV app.",
        citations: [c(U.tvUpdates, "tvOS 15.2 — Apple TV app")],
      }),
      change({
        key: "tvos-15-2-apple-music-voice-plan",
        title: "Apple Music Voice Plan",
        canonicalSummary:
          "Apple TV supports the Siri-controlled Apple Music Voice Plan subscription tier.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 15.2 added playback support for Apple's voice-directed Apple Music subscription option.",
        citations: [c(U.tvUpdates, "tvOS 15.2 — Apple Music Voice Plan")],
      }),
      change({
        key: "tvos-15-2-siri-language-expansion",
        title: "Additional Siri languages",
        canonicalSummary:
          "Siri expanded to Dutch and French in Belgium, Russian in Russia, and French, German, and Italian in Switzerland.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The update broadened localized Siri support across Belgium, Russia, and Switzerland.",
        citations: [c(U.tvUpdates, "tvOS 15.2 — Siri")],
      }),
      change({
        key: "tvos-15-2-iceland-scotland-screensavers-maintenance",
        title: "New aerials and general maintenance",
        canonicalSummary:
          "The aerial collection added Iceland and Scotland views, alongside general performance and stability improvements.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 15.2 expanded the screen-saver rotation with two destinations and included a general maintenance component in Apple's consumer notes.",
        citations: [
          c(U.tvUpdates, "tvOS 15.2 — Screen savers; General updates"),
        ],
      }),
      securityChange({
        key: "tvos-15-2-security-repairs",
        title: "tvOS 15.2 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across audio, network proxies, media parsing, the kernel, Sandbox, privacy controls, and WebKit.",
        summary:
          "Apple's advisory documents fixes in Audio, CFNetwork Proxies, ColorSync, CoreAudio, ImageIO, the kernel, Sandbox, SQLite, TCC, WebKit, and related components.",
        url: U.tv152Security,
        locator:
          "Audio; CFNetwork Proxies; ColorSync; CoreAudio; ImageIO; Kernel; Sandbox; SQLite; TCC; WebKit",
      }),
    ],
  ),
];

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
  join(here, "apple-other-2021.json"),
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

const md = `# Apple 2021 non-iPhone research batch

## Result

\`apple-other-2021.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2021. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 12.0 | 1 | ${platformChangeCount("macos")} |
| watchOS | 7.3, 7.4, 7.5, 7.6, 8.0, 8.1, 8.3 | 7 | ${platformChangeCount("watchos")} |
| tvOS | 14.4, 14.5, 14.6, 14.7, 15.0, 15.1, 15.2 | 7 | ${platformChangeCount("tvos")} |
| **Total** | **15 version articles** | **${events.length}** | **${eventChanges}** |

The 15 versions contain 104 existing local timeline milestones: 15 public appearances and 89 beta, release-candidate, and related non-public milestones. This bundle enriches only the 15 public appearances through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 30 version/event records are \`editoriallyVerified\` plus \`approved\`
  after review at \`${reviewedAt}\`.
- All public events are indexable.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included.
- No beta notes or later cumulative changes are projected backward.
- No build records are included; no build number is inferred.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory boundary

The existing local \`version-macos-12-0\` route represents the October 25, 2021 Monterey launch. Apple publicly shipped and documents that release as macOS Monterey 12.0.1. This bundle preserves the audited local route and explicitly cites Apple's 12.0.1 release notes and advisory; it does not create or rename a release-version record.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### macOS

- <${U.macNews}> — dated Monterey availability and launch features
- <${U.macDeveloper}> — macOS Monterey 12.0.1 developer notes
- <${U.macEnterprise}> — Monterey 12.0.1 enterprise changes
- <${U.macSecurity}> — Monterey 12.0.1 security content and release date

### watchOS

- <${U.watch7}> — watchOS 7 update notes
- <${U.watch8}> — watchOS 8 update notes
- <${U.watchNews}> — dated watchOS 8 launch article
- <${U.watch73Security}>
- <${U.watch74Security}>
- <${U.watch75Security}>
- <${U.watch76Security}>
- <${U.watch8Security}>
- <${U.watch81Security}>
- <${U.watch83Security}>

### tvOS

- <${U.tvUpdates}> — Apple TV software-update notes
- <${U.tv144Security}>
- <${U.tv145Security}>
- <${U.tv146Security}>
- <${U.tv147Security}>
- <${U.tv15Security}>
- <${U.tv151Security}>
- <${U.tv152Security}>

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses the explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's consumer notes for tvOS 14.4, 14.6, and 14.7 do not enumerate named feature changes. Those entries state the limitation and use the version-specific security advisory for substantive detail.
2. The local macOS route/version-label mismatch is preserved rather than silently rewritten.
3. No community-sourced undocumented claim was added; this bounded cohort requires a separate reproducible or independently corroborated evidence pass.
4. The 89 non-public milestones remain timeline-only records until beta-specific sources support event-level claims.
5. Security advisories can receive later-added entries. Summaries describe Apple's current documented record for the release, not proof that every advisory entry appeared on launch day.

## Validation

- Research-batch validation passed with 15 versions, 15 public events, 80 globally consistent change keys, 22 sources, and 279 citation references for this file.
- Inventory closure passed: 15 eligible local versions, 104 milestones, 15 public appearances, 89 non-public milestones, 22 of 22 declared sources cited, and zero build records.
- Focused launch-ingestion and research-tool tests passed: 16 of 16.
- ESLint passed for the deterministic generator.
- Guarded production apply: 100 creates, 30 revision-guarded patches, and 2,069 unchanged documents.
- Planned creates: 20 source documents, zero event documents, zero build documents, and 80 change documents; the plan includes 15 version patches. Existing durable public events are updated through the revision-guarded patch set.
- Mutation payload: 238,050 bytes, reported as 6.1% of the guarded limit.
- Exact applied plan SHA:
  \`8193ac155ca47c8cb1ef061a4f4ff69ae4ca38f44f051fcd9271b78b8ba9a675\`.
- Transaction: \`eOgq1Ovu5XNUv1qNFUYgGt\`.
- The ingestion pipeline committed the transaction and verified zero residual
  mutations.
`;

writeFileSync(join(here, "apple-other-2021.md"), md);
