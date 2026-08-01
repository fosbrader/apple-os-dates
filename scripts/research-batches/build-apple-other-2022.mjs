import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-29";

const U = {
  macNews:
    "https://www.apple.com/newsroom/2022/10/macos-ventura-is-now-available/",
  macDeveloper:
    "https://developer.apple.com/documentation/macos-release-notes/macos-13-release-notes",
  macEnterprise: "https://support.apple.com/en-us/101570",
  macSecurity: "https://support.apple.com/en-us/102853",
  watch8: "https://support.apple.com/en-us/118389",
  watch9: "https://support.apple.com/en-us/117792",
  watchNews:
    "https://www.apple.com/newsroom/2022/09/watchOS-9-is-available-today/",
  watch84Security: "https://support.apple.com/en-us/103177",
  watch85Security: "https://support.apple.com/en-us/102762",
  watch86Security: "https://support.apple.com/en-us/102759",
  watch87Security: "https://support.apple.com/en-us/102879",
  watch9Security: "https://support.apple.com/en-us/102824",
  watch91Security: "https://support.apple.com/en-us/102740",
  tvUpdates: "https://support.apple.com/en-us/106336",
  tv153Security: "https://support.apple.com/en-us/103175",
  tv154Security: "https://support.apple.com/en-us/102886",
  tv155Security: "https://support.apple.com/en-us/102877",
  tv156Security: "https://support.apple.com/en-us/102878",
  tv16Security: "https://support.apple.com/en-us/102834",
  tv161Security: "https://support.apple.com/en-us/102835",
};

const sources = [
  {
    url: U.macNews,
    title: "macOS Ventura is now available",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2022-10-24T00:00:00.000Z",
    topics: ["macOS", "Ventura", "public availability", "features"],
  },
  {
    url: U.macDeveloper,
    title: "macOS Ventura 13 Release Notes",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    topics: ["macOS", "Ventura", "developer release notes"],
  },
  {
    url: U.macEnterprise,
    title: "What's new for enterprise in macOS Ventura",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["macOS", "Ventura", "enterprise", "device management"],
  },
  {
    url: U.macSecurity,
    title: "About the security content of macOS Ventura 13",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2022-10-24T00:00:00.000Z",
    topics: ["macOS", "Ventura", "security", "CVE"],
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
    url: U.watch9,
    title: "About watchOS 9 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["watchOS", "9", "consumer release notes"],
  },
  {
    url: U.watchNews,
    title: "watchOS 9 is available today",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2022-09-12T00:00:00.000Z",
    topics: ["watchOS", "9", "public availability", "features"],
  },
  ...[
    [
      U.watch84Security,
      "About the security content of watchOS 8.4",
      "2022-01-26",
    ],
    [
      U.watch85Security,
      "About the security content of watchOS 8.5",
      "2022-03-14",
    ],
    [
      U.watch86Security,
      "About the security content of watchOS 8.6",
      "2022-05-16",
    ],
    [
      U.watch87Security,
      "About the security content of watchOS 8.7",
      "2022-07-20",
    ],
    [U.watch9Security, "About the security content of watchOS 9", "2022-09-12"],
    [
      U.watch91Security,
      "About the security content of watchOS 9.1",
      "2022-10-24",
    ],
  ].map(([url, title, date]) => ({
    url,
    title,
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: `${date}T00:00:00.000Z`,
    topics: ["watchOS", "security", "CVE"],
  })),
  {
    url: U.tvUpdates,
    title: "About Apple TV 4K and Apple TV HD software updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["tvOS", "Apple TV", "consumer release notes"],
  },
  ...[
    [U.tv153Security, "About the security content of tvOS 15.3", "2022-01-26"],
    [U.tv154Security, "About the security content of tvOS 15.4", "2022-03-14"],
    [U.tv155Security, "About the security content of tvOS 15.5", "2022-05-16"],
    [U.tv156Security, "About the security content of tvOS 15.6", "2022-07-20"],
    [U.tv16Security, "About the security content of tvOS 16", "2022-09-12"],
    [U.tv161Security, "About the security content of tvOS 16.1", "2022-10-24"],
  ].map(([url, title, date]) => ({
    url,
    title,
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: `${date}T00:00:00.000Z`,
    topics: ["tvOS", "Apple TV", "security", "CVE"],
  })),
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});

const prose = (text, citations) => ({ text, citations });
const heading = (text) => ({ style: "h2", text });
const article = (...blocks) => ({ authorship: "originalSynthesis", blocks });
const reviewedAt = "2026-07-30T04:16:06Z";
const review = () => ({ status: "approved", reviewedAt });

function version(releaseVersionId, releaseNotesUrl, overview, citations) {
  return {
    releaseVersionId,
    authorship: "originalSynthesis",
    releaseNotesUrl,
    overview,
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
  version(
    "version-macos-13-0",
    U.macDeveloper,
    article(
      heading("Release overview"),
      prose(
        "macOS Ventura 13.0 became publicly available on October 24, 2022. The release centered on Continuity Camera and FaceTime Handoff, Stage Manager, passkeys and Shared Tab Groups in Safari, expanded Mail and Messages workflows, and iCloud Shared Photo Library.",
        [
          c(
            U.macNews,
            "October 24, 2022; Continuity Camera; Stage Manager; Safari; Mail; Messages; Shared Photo Library",
          ),
        ],
      ),
      heading("Administration, development, and evidence boundary"),
      prose(
        "Apple also documented accessory approval on portable Apple-silicon Macs, Declarative Device Management, mandatory network access during managed setup, and Platform SSO. The archive attributes only public-release claims backed by these version-specific sources; it does not project cumulative Ventura updates or beta-only observations onto 13.0.",
        [
          c(U.macDeveloper, "Accessory Security — New Features"),
          c(U.macEnterprise, "macOS Ventura 13.0 — Device Management"),
        ],
      ),
    ),
    [
      c(U.macNews, "Availability — October 24, 2022"),
      c(U.macDeveloper, "macOS Ventura 13 Release Notes"),
      c(U.macEnterprise, "macOS Ventura 13.0"),
      c(U.macSecurity, "macOS Ventura 13 — Released October 24, 2022"),
    ],
  ),
  version(
    "version-watchos-8-4",
    U.watch8,
    article(
      heading("Release overview"),
      prose(
        "watchOS 8.4 was released on January 26, 2022. Apple's consumer note identifies a fix for some chargers that did not work as expected, while the accompanying advisory documents security work across ColorSync, Crash Reporter, iCloud, the kernel, WebKit, and WebKit Storage.",
        [
          c(U.watch8, "watchOS 8.4"),
          c(U.watch84Security, "watchOS 8.4 — Released January 26, 2022"),
        ],
      ),
      heading("Source boundary"),
      prose(
        "Apple did not publish a broader version-specific feature list for this maintenance release. This record therefore stays with the charger fix and the named security surfaces, and makes no undocumented-change or beta-stage claims.",
        [
          c(U.watch8, "watchOS 8.4"),
          c(U.watch84Security, "watchOS 8.4 security content"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.4"),
      c(U.watch84Security, "Released January 26, 2022"),
    ],
  ),
  version(
    "version-watchos-8-5",
    U.watch8,
    article(
      heading("Release overview"),
      prose(
        "watchOS 8.5 was released on March 14, 2022. It added Apple TV purchase authorization from Apple Watch, EU Digital COVID Certificate support for vaccination cards in Wallet, updated irregular-rhythm notifications in supported regions, and Fitness+ Audio Hints.",
        [
          c(U.watch8, "watchOS 8.5"),
          c(U.watch85Security, "watchOS 8.5 — Released March 14, 2022"),
        ],
      ),
      heading("Security and source boundary"),
      prose(
        "Apple's advisory also records fixes affecting document and image parsing, kernel privileges, privacy controls, Siri, and WebKit. The available first-party notes do not support a separate undocumented-change list, so this archive does not infer one.",
        [
          c(
            U.watch85Security,
            "Accelerate Framework; ImageIO; Kernel; LaunchServices; Siri; WebKit",
          ),
          c(U.watch8, "watchOS 8.5"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.5"),
      c(U.watch85Security, "Released March 14, 2022"),
    ],
  ),
  version(
    "version-watchos-8-6",
    U.watch8,
    article(
      heading("Release overview"),
      prose(
        "watchOS 8.6 was released on May 16, 2022. The consumer-facing additions were regional: Apple enabled the ECG app on supported Apple Watch models in Mexico and made irregular-rhythm notifications available there.",
        [
          c(U.watch8, "watchOS 8.6"),
          c(U.watch86Security, "watchOS 8.6 — Released May 16, 2022"),
        ],
      ),
      heading("Security and source boundary"),
      prose(
        "The security advisory covers AppleAVD, DriverKit, ImageIO, the kernel, signature validation, WebKit, and other components; Apple said one AppleAVD issue may have been actively exploited. No broader version-specific feature list is documented, so this entry stays within those regional and security claims.",
        [
          c(
            U.watch86Security,
            "AppleAVD; DriverKit; ImageIO; Kernel; Security; WebKit",
          ),
          c(U.watch8, "watchOS 8.6"),
        ],
      ),
    ),
    [c(U.watch8, "watchOS 8.6"), c(U.watch86Security, "Released May 16, 2022")],
  ),
  version(
    "version-watchos-8-7",
    U.watch8,
    article(
      heading("Release overview"),
      prose(
        "watchOS 8.7 was released on July 20, 2022. Apple characterized it as an improvements, bug-fixes, and security update rather than publishing named consumer features for the version.",
        [
          c(U.watch8, "watchOS 8.7"),
          c(U.watch87Security, "watchOS 8.7 — Released July 20, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "The substantive first-party detail is the security advisory, which names repairs in APFS, AppleAVD, AppleMobileFileIntegrity, the Apple Neural Engine, audio, the kernel, WebKit, and Wi-Fi. Because Apple provides no more specific consumer change list, the archive does not invent one.",
        [
          c(
            U.watch87Security,
            "APFS; AppleAVD; AppleMobileFileIntegrity; Apple Neural Engine; Audio; Kernel; WebKit; Wi-Fi",
          ),
          c(U.watch8, "watchOS 8.7"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.7"),
      c(U.watch87Security, "Released July 20, 2022"),
    ],
  ),
  version(
    "version-watchos-9-0",
    U.watch9,
    article(
      heading("Release overview"),
      prose(
        "watchOS 9.0 launched publicly on September 12, 2022. It introduced new and expanded watch faces, richer Workout and running tools, a redesigned Compass with Waypoints and Backtrack, sleep stages, medication tracking, AFib History, Apple Watch Mirroring, and Low Power Mode.",
        [
          c(
            U.watchNews,
            "September 12, 2022; New and Expanded Watch Faces; Workout; Compass; Sleep; AFib History; Medications",
          ),
          c(U.watch9, "watchOS 9"),
        ],
      ),
      heading("Release boundary"),
      prose(
        "This record excludes Race Route and automatic track detection because Apple's launch material marked them as coming later in the year. It also avoids projecting later watchOS 9 point-release changes or community reports backward onto the 9.0 public event.",
        [
          c(
            U.watchNews,
            "Updates for Runners — Race Route and Track running marked coming later this year",
          ),
          c(U.watch9, "watchOS 9.2"),
        ],
      ),
    ),
    [
      c(U.watchNews, "UPDATE September 12, 2022"),
      c(U.watch9, "watchOS 9"),
      c(U.watch9Security, "Released September 12, 2022"),
    ],
  ),
  version(
    "version-watchos-9-1",
    U.watch9,
    article(
      heading("Release overview"),
      prose(
        "watchOS 9.1 was released on October 24, 2022. It added a lower-sampling workout option for longer battery life on supported watches, allowed Music downloads away from the charger over Wi-Fi or cellular, and introduced Matter support.",
        [
          c(U.watch9, "watchOS 9.1"),
          c(U.watch91Security, "watchOS 9.1 — Released October 24, 2022"),
        ],
      ),
      heading("Fixes and source boundary"),
      prose(
        "Apple also documented corrections for Outdoor Run pace feedback, Weather estimates and time labels, Strength Training duration, and VoiceOver notification announcements, alongside security work across protected files, audio, certificates, the kernel, Safari, Sandbox, and WebKit. No undocumented claims are included.",
        [
          c(U.watch9, "watchOS 9.1 — bug fixes"),
          c(
            U.watch91Security,
            "AppleMobileFileIntegrity; Audio; CFNetwork; Kernel; Safari; Sandbox; WebKit",
          ),
        ],
      ),
    ),
    [
      c(U.watch9, "watchOS 9.1"),
      c(U.watch91Security, "Released October 24, 2022"),
    ],
  ),
  version(
    "version-tvos-15-3",
    U.tvUpdates,
    article(
      heading("Release overview"),
      prose(
        "tvOS 15.3 was released on January 26, 2022. Apple's consumer update history describes general performance and stability improvements, while the security advisory provides the concrete technical record for the release.",
        [
          c(U.tvUpdates, "tvOS 15.3"),
          c(U.tv153Security, "tvOS 15.3 — Released January 26, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "Apple lists fixes in ColorSync, Crash Reporter, iCloud, the kernel, Model I/O, WebKit, and WebKit Storage. No named consumer feature or independently verified undocumented change is attributed to 15.3 here.",
        [
          c(
            U.tv153Security,
            "ColorSync; Crash Reporter; iCloud; Kernel; Model I/O; WebKit; WebKit Storage",
          ),
          c(U.tvUpdates, "tvOS 15.3"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15.3"),
      c(U.tv153Security, "Released January 26, 2022"),
    ],
  ),
  version(
    "version-tvos-15-4",
    U.tvUpdates,
    article(
      heading("Release overview"),
      prose(
        "tvOS 15.4 was released on March 14, 2022. It added Apple Watch-assisted purchase approval, Picture in Picture for HomeKit camera feeds, and captive-portal Wi-Fi setup using an iPhone or iPad.",
        [
          c(U.tvUpdates, "tvOS 15.4"),
          c(U.tv154Security, "tvOS 15.4 — Released March 14, 2022"),
        ],
      ),
      heading("Security and source boundary"),
      prose(
        "The security advisory documents repairs in PDF and image parsing, graphics, the kernel, permissions, Sandbox, and WebKit. The article remains limited to Apple's version-labeled records and does not infer beta or undocumented behavior.",
        [
          c(
            U.tv154Security,
            "Accelerate Framework; ImageIO; IOGPUFamily; Kernel; Preferences; Sandbox; WebKit",
          ),
          c(U.tvUpdates, "tvOS 15.4"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15.4"),
      c(U.tv154Security, "Released March 14, 2022"),
    ],
  ),
  version(
    "version-tvos-15-5",
    U.tvUpdates,
    article(
      heading("Release overview"),
      prose(
        "tvOS 15.5 was released on May 16, 2022. Apple supplied no named consumer feature list, describing the update only as general performance and stability improvements.",
        [
          c(U.tvUpdates, "tvOS 15.5"),
          c(U.tv155Security, "tvOS 15.5 — Released May 16, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "The version-specific advisory records fixes in AppleAVD, AuthKit, video encoding, image handling, the kernel, code-signature validation, WebKit, and Wi-Fi; Apple said one AppleAVD issue may have been actively exploited. The archive adds no undocumented-change claims.",
        [
          c(
            U.tv155Security,
            "AppleAVD; AuthKit; AVEVideoEncoder; ImageIO; Kernel; Security; WebKit; Wi-Fi",
          ),
          c(U.tvUpdates, "tvOS 15.5"),
        ],
      ),
    ),
    [c(U.tvUpdates, "tvOS 15.5"), c(U.tv155Security, "Released May 16, 2022")],
  ),
  version(
    "version-tvos-15-6",
    U.tvUpdates,
    article(
      heading("Release overview"),
      prose(
        "tvOS 15.6 was released on July 20, 2022. Apple's consumer update history lists general performance and stability improvements without naming a new feature.",
        [
          c(U.tvUpdates, "tvOS 15.6"),
          c(U.tv156Security, "tvOS 15.6 — Released July 20, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "Apple's advisory supplies the detailed record: fixes span APFS, AppleAVD, authorization, audio and media processing, iCloud Photo Library, the kernel, software-update transport, WebKit, and Wi-Fi. No more specific consumer or undocumented change is asserted.",
        [
          c(
            U.tv156Security,
            "APFS; AppleAVD; AppleMobileFileIntegrity; Audio; CoreMedia; iCloud Photo Library; Kernel; Software Update; WebKit; Wi-Fi",
          ),
          c(U.tvUpdates, "tvOS 15.6"),
        ],
      ),
    ),
    [c(U.tvUpdates, "tvOS 15.6"), c(U.tv156Security, "Released July 20, 2022")],
  ),
  version(
    "version-tvos-16-0",
    U.tvUpdates,
    article(
      heading("Release overview"),
      prose(
        "tvOS 16.0 was released on September 12, 2022. It simplified Family Sharing profile setup, introduced Personalized Spatial Audio on supported hardware, enabled multiple onscreen-keyboard languages, expanded Siri languages, and added Hover Text and new VoiceOver voices.",
        [
          c(
            U.tvUpdates,
            "tvOS 16 — Multiuser; Spatial Audio; Keyboard; Siri; Accessibility",
          ),
          c(U.tv16Security, "tvOS 16 — Released September 12, 2022"),
        ],
      ),
      heading("Security and release boundary"),
      prose(
        "Apple also documented security fixes across image processing, GPU and kernel boundaries, notifications, Sandbox, WebKit, and Wi-Fi. This record is scoped to the 16.0 public appearance and does not treat features from later tvOS 16 updates as launch content.",
        [
          c(
            U.tv16Security,
            "ImageIO; Image Processing; GPU Drivers; Kernel; Notifications; Sandbox; WebKit; Wi-Fi",
          ),
          c(U.tvUpdates, "tvOS 16 through tvOS 16.6"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 16"),
      c(U.tv16Security, "Released September 12, 2022"),
    ],
  ),
  version(
    "version-tvos-16-1",
    U.tvUpdates,
    article(
      heading("Release overview"),
      prose(
        "tvOS 16.1 was released on October 24, 2022. It redesigned Siri, enabled hands-free requests through connected AirPods, brought iCloud Shared Photo Library to Apple TV, allowed Fitness+ workouts with only an iPhone, and added Matter support.",
        [
          c(U.tvUpdates, "tvOS 16.1 — Siri; Photos; Apple Fitness+; Home hub"),
          c(U.tv161Security, "tvOS 16.1 — Released October 24, 2022"),
        ],
      ),
      heading("Security and source boundary"),
      prose(
        "The release's security record includes protected-file, audio, certificate, kernel, model-processing, Sandbox, and WebKit fixes. This article confines claims to Apple's 16.1 section and advisory and includes no inferred undocumented changes.",
        [
          c(
            U.tv161Security,
            "AppleMobileFileIntegrity; Audio; CFNetwork; Kernel; Model I/O; Sandbox; WebKit",
          ),
          c(U.tvUpdates, "tvOS 16.1"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 16.1"),
      c(U.tv161Security, "Released October 24, 2022"),
    ],
  ),
];

const events = [
  event(
    "version-macos-13-0",
    "macOS Ventura 13.0 reached the public channel on October 24, 2022 with new continuity, window-management, browser, communication, photo-sharing, security, and managed-device capabilities.",
    article(
      heading("Public release"),
      prose(
        "Apple made macOS Ventura available on October 24, 2022. This page describes the audited public appearance of 13.0, not the earlier beta sequence or features first delivered by a later Ventura point release.",
        [
          c(U.macNews, "UPDATE October 24, 2022; Availability"),
          c(U.macSecurity, "macOS Ventura 13 — Released October 24, 2022"),
        ],
      ),
      heading("What changed"),
      prose(
        "The launch connected iPhone camera hardware to Mac workflows, added a new window organizer, expanded Safari, Mail, Messages, and shared photo libraries, introduced approval for new wired accessories on portable Apple-silicon Macs, and broadened enterprise management. Apple's security advisory separately records the release's system-level fixes.",
        [
          c(
            U.macNews,
            "Continuity Camera; Stage Manager; Safari; Mail; Messages; Shared Photo Library",
          ),
          c(U.macDeveloper, "Accessory Security — New Features"),
          c(U.macEnterprise, "macOS Ventura 13.0 — Device Management"),
          c(U.macSecurity, "macOS Ventura 13 security content"),
        ],
      ),
    ),
    [
      c(U.macNews, "October 24, 2022; Availability"),
      c(U.macDeveloper, "macOS Ventura 13 Release Notes"),
      c(U.macEnterprise, "macOS Ventura 13.0"),
      c(U.macSecurity, "Released October 24, 2022"),
    ],
    [
      change({
        key: "macos-13-continuity-camera-handoff",
        title: "Continuity Camera and FaceTime Handoff",
        canonicalSummary:
          "A nearby iPhone can serve as a Mac webcam, and active FaceTime calls can move between Apple devices.",
        category: "feature",
        action: "introduced",
        summary:
          "Ventura introduced automatic iPhone camera use with Center Stage, Portrait mode, Studio Light, and Desk View, plus call handoff between Mac, iPhone, and iPad.",
        citations: [c(U.macNews, "Continuity Camera Makes Mac More Personal")],
      }),
      change({
        key: "macos-13-stage-manager",
        title: "Stage Manager window organization",
        canonicalSummary:
          "Stage Manager keeps the active app centered while arranging recent apps and related windows at the side of the desktop.",
        category: "feature",
        action: "introduced",
        summary:
          "The new organizer automatically grouped and positioned open windows while preserving access to the desktop and familiar Mission Control and Spaces workflows.",
        citations: [
          c(
            U.macNews,
            "Stage Manager Automatically Organizes Apps and Windows",
          ),
        ],
      }),
      change({
        key: "macos-13-safari-passkeys-shared-tabs",
        title: "Safari passkeys and Shared Tab Groups",
        canonicalSummary:
          "Safari added phishing-resistant passkeys and shared browsing collections that participants can update together.",
        category: "feature",
        action: "introduced",
        summary:
          "Safari gained passkeys designed to replace passwords on supported services, along with Shared Tab Groups and group start pages for collaborative browsing.",
        citations: [
          c(U.macNews, "Passkeys and New Collaboration Tools in Safari"),
        ],
      }),
      change({
        key: "macos-13-mail-send-search-tools",
        title: "Mail scheduling, undo send, follow-up, and search",
        canonicalSummary:
          "Mail added controls for scheduled sending and brief send cancellation, follow-up prompts, reminders, and more context-aware search.",
        category: "enhancement",
        action: "changed",
        summary:
          "Ventura expanded Mail with send scheduling, a short undo-send window, follow-up and reminder workflows, and search that accounted for typos and related terms.",
        citations: [c(U.macNews, "Big Updates to Mail")],
      }),
      change({
        key: "macos-13-messages-edit-collaboration",
        title: "Messages editing, recovery, collaboration, and SharePlay",
        canonicalSummary:
          "Messages added editing and unsending, unread and recovery controls, shared-document collaboration, and SharePlay sessions.",
        category: "enhancement",
        action: "changed",
        summary:
          "Users could edit or unsend recent messages, recover deleted messages, mark threads unread, collaborate on shared files, and begin SharePlay from Messages.",
        citations: [c(U.macNews, "More Powerful Messages")],
      }),
      change({
        key: "macos-13-icloud-shared-photo-library",
        title: "iCloud Shared Photo Library",
        canonicalSummary:
          "A separate iCloud photo library lets up to six people contribute, edit, favorite, caption, and delete shared photos.",
        category: "feature",
        action: "introduced",
        summary:
          "Ventura added a shared library with participant controls and rule-based contribution options intended to keep selected family photos in one collaborative collection.",
        citations: [
          c(
            U.macNews,
            "iCloud Shared Photo Library Makes It Easier to Share Photos with Family",
          ),
        ],
      }),
      change({
        key: "macos-13-accessory-security",
        title: "Approval for new wired accessories",
        canonicalSummary:
          "Portable Apple-silicon Macs ask for approval before newly attached USB or Thunderbolt accessories can communicate through a direct USB-C connection.",
        category: "security",
        action: "introduced",
        summary:
          "The release added an accessory-approval policy for new direct USB and Thunderbolt connections on portable Apple-silicon Macs, with documented exceptions and management controls.",
        citations: [c(U.macDeveloper, "Accessory Security — New Features")],
      }),
      change({
        key: "macos-13-enterprise-management-sso",
        title: "Declarative management and Platform SSO",
        canonicalSummary:
          "Managed Macs gained declarative management across enrollment types, Platform SSO hooks, and additional setup, update, and restriction controls.",
        category: "enhancement",
        action: "changed",
        summary:
          "Ventura expanded enterprise administration with Declarative Device Management, required networking during managed setup, Platform SSO, asleep-update handling, and new restriction controls.",
        citations: [
          c(U.macEnterprise, "macOS Ventura 13.0 — Device Management"),
        ],
      }),
      change({
        key: "macos-13-security-baseline",
        title: "Ventura 13 security repairs",
        canonicalSummary:
          "The public release repaired vulnerabilities across file systems and parsers, the kernel, privacy boundaries, networking, WebKit, Wi-Fi, and other components.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory documents a broad security baseline for 13.0, including APFS, AppleAVD, Calendar, ColorSync, Finder, the kernel, PackageKit, Sandbox, WebKit, Wi-Fi, and zlib.",
        citations: [
          c(
            U.macSecurity,
            "APFS; AppleAVD; Calendar; ColorSync; Finder; Kernel; PackageKit; Sandbox; WebKit; Wi-Fi; zlib",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-watchos-8-4",
    "watchOS 8.4 reached the public channel on January 26, 2022 with a documented charging-compatibility fix and security repairs across system, cloud, and web-processing components.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 8.4 on January 26, 2022. The available version-specific consumer note is narrow: it names a fix for chargers that might not work as expected and otherwise points users to the security record.",
        [
          c(U.watch8, "watchOS 8.4"),
          c(U.watch84Security, "Released January 26, 2022"),
        ],
      ),
      heading("Evidence boundary"),
      prose(
        "Apple's advisory documents fixes in ColorSync, Crash Reporter, iCloud, the kernel, WebKit, and WebKit Storage. Because no broader feature list is published for 8.4, this article does not infer additional consumer or undocumented changes.",
        [
          c(
            U.watch84Security,
            "ColorSync; Crash Reporter; iCloud; Kernel; WebKit; WebKit Storage",
          ),
          c(U.watch8, "watchOS 8.4"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.4"),
      c(U.watch84Security, "Released January 26, 2022"),
    ],
    [
      change({
        key: "watchos-8-4-charger-compatibility",
        title: "Charging compatibility correction",
        canonicalSummary:
          "The update corrected a condition in which some chargers did not work with Apple Watch as expected.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple identifies charger compatibility as the sole named consumer-facing fix in the watchOS 8.4 update notes.",
        citations: [c(U.watch8, "watchOS 8.4")],
      }),
      change({
        key: "watchos-8-4-security-repairs",
        title: "watchOS 8.4 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving crafted files, elevated privileges, iCloud file access, kernel code execution, web content, and cross-site storage.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory records fixes across ColorSync, Crash Reporter, iCloud, the kernel, WebKit, and WebKit Storage for supported Apple Watch models.",
        citations: [
          c(
            U.watch84Security,
            "ColorSync; Crash Reporter; iCloud; Kernel; WebKit; WebKit Storage",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-watchos-8-5",
    "watchOS 8.5 reached the public channel on March 14, 2022 with Apple TV purchase approval, expanded health-document and notification support, Fitness+ accessibility guidance, and security fixes.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 8.5 on March 14, 2022. The update notes identify four user-facing changes across Apple TV authorization, Wallet health records, irregular-rhythm notifications, and Fitness+ accessibility.",
        [
          c(U.watch8, "watchOS 8.5"),
          c(U.watch85Security, "Released March 14, 2022"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "The companion advisory adds the security record for parsing, kernel, permissions, Siri, and WebKit issues. These first-party pages support the occurrences below; no separate undocumented-change claim is included.",
        [
          c(
            U.watch85Security,
            "Accelerate Framework; ImageIO; Kernel; LaunchServices; Siri; WebKit",
          ),
          c(U.watch8, "watchOS 8.5"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.5"),
      c(U.watch85Security, "Released March 14, 2022"),
    ],
    [
      change({
        key: "watchos-8-5-apple-tv-purchase-authorization",
        title: "Apple TV purchase authorization",
        canonicalSummary:
          "Apple Watch can authorize Apple TV purchases and subscriptions from the wearer's wrist.",
        category: "feature",
        action: "introduced",
        summary:
          "The update enabled Apple Watch to approve purchase and subscription prompts initiated on Apple TV.",
        citations: [c(U.watch8, "watchOS 8.5")],
      }),
      change({
        key: "watchos-8-5-eu-covid-certificate",
        title: "EU Digital COVID Certificate support in Wallet",
        canonicalSummary:
          "Vaccination cards stored in Wallet gained support for the EU Digital COVID Certificate format.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 8.5 expanded vaccination-card compatibility in Wallet to include the EU Digital COVID Certificate.",
        citations: [c(U.watch8, "watchOS 8.5")],
      }),
      change({
        key: "watchos-8-5-irregular-rhythm-identification",
        title: "Updated irregular-rhythm notifications",
        canonicalSummary:
          "Irregular-rhythm notifications were updated to improve identification of atrial fibrillation in supported regions.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple updated the irregular-rhythm notification system to improve AFib identification, with availability limited by region.",
        citations: [c(U.watch8, "watchOS 8.5")],
      }),
      change({
        key: "watchos-8-5-fitness-audio-hints",
        title: "Fitness+ Audio Hints",
        canonicalSummary:
          "Fitness+ gained audible descriptions of visually demonstrated workout movements.",
        category: "feature",
        action: "introduced",
        summary:
          "The release added Audio Hints to describe movements shown during Fitness+ workouts for users who benefit from spoken visual guidance.",
        citations: [c(U.watch8, "watchOS 8.5")],
      }),
      change({
        key: "watchos-8-5-security-repairs",
        title: "watchOS 8.5 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities in document and image handling, kernel and privacy boundaries, Siri, Sandbox, and WebKit.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory documents fixes spanning Accelerate and ImageIO parsing, kernel privileges, privacy restrictions, Siri lock-screen access, Sandbox, and multiple WebKit paths.",
        citations: [
          c(
            U.watch85Security,
            "Accelerate Framework; ImageIO; Kernel; LaunchServices; Siri; Sandbox; WebKit",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-watchos-8-6",
    "watchOS 8.6 reached the public channel on May 16, 2022 with ECG and irregular-rhythm notification availability in Mexico plus a substantial set of security corrections.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 8.6 on May 16, 2022. The two named consumer changes expanded regulated heart-health capabilities in Mexico on supported Apple Watch models.",
        [
          c(U.watch8, "watchOS 8.6"),
          c(U.watch86Security, "Released May 16, 2022"),
        ],
      ),
      heading("Security and evidence boundary"),
      prose(
        "Apple's advisory documents additional repairs across AppleAVD, image handling, drivers, the kernel, signature validation, WebKit, and Wi-Fi, including an AppleAVD issue that Apple said may have been actively exploited. No other consumer change is inferred.",
        [
          c(
            U.watch86Security,
            "AppleAVD; DriverKit; ImageIO; Kernel; Security; WebKit; Wi-Fi",
          ),
          c(U.watch8, "watchOS 8.6"),
        ],
      ),
    ),
    [c(U.watch8, "watchOS 8.6"), c(U.watch86Security, "Released May 16, 2022")],
    [
      change({
        key: "watchos-8-6-ecg-mexico",
        title: "ECG app availability in Mexico",
        canonicalSummary:
          "The ECG app became available in Mexico on Apple Watch Series 4 and later.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 8.6 expanded regional availability of the ECG app to supported Apple Watch models in Mexico.",
        citations: [c(U.watch8, "watchOS 8.6")],
      }),
      change({
        key: "watchos-8-6-irregular-rhythm-mexico",
        title: "Irregular-rhythm notifications in Mexico",
        canonicalSummary:
          "Irregular-rhythm notifications became available to eligible Apple Watch users in Mexico.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release enabled irregular-rhythm notification support in Mexico alongside the regional ECG expansion.",
        citations: [c(U.watch8, "watchOS 8.6")],
      }),
      change({
        key: "watchos-8-6-security-repairs",
        title: "watchOS 8.6 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities affecting media and image parsing, drivers, kernel execution, signature validation, WebKit, and Wi-Fi.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented a broad security update and said a patched AppleAVD out-of-bounds write issue may have been actively exploited.",
        citations: [
          c(
            U.watch86Security,
            "AppleAVD; DriverKit; ImageIO; Kernel; Security; WebKit; Wi-Fi",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-watchos-8-7",
    "watchOS 8.7 reached the public channel on July 20, 2022 as a maintenance release with general improvements, bug fixes, and detailed security repairs rather than named new features.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 8.7 on July 20, 2022. Its consumer note offers only a general improvements-and-bug-fixes description, so the update should not be presented as having a named feature slate.",
        [
          c(U.watch8, "watchOS 8.7"),
          c(U.watch87Security, "Released July 20, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "The version-specific advisory is the detailed record, naming APFS, AppleAVD, authorization, neural-engine, audio, kernel, WebKit, and Wi-Fi repairs. This archive explicitly leaves undocumented consumer behavior unclaimed.",
        [
          c(
            U.watch87Security,
            "APFS; AppleAVD; AppleMobileFileIntegrity; Apple Neural Engine; Audio; Kernel; WebKit; Wi-Fi",
          ),
          c(U.watch8, "watchOS 8.7"),
        ],
      ),
    ),
    [
      c(U.watch8, "watchOS 8.7"),
      c(U.watch87Security, "Released July 20, 2022"),
    ],
    [
      change({
        key: "watchos-8-7-general-maintenance",
        title: "General improvements and bug fixes",
        canonicalSummary:
          "Apple characterized watchOS 8.7 as including improvements and bug fixes without naming individual consumer fixes.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer release note records a general maintenance update but does not provide enough detail to split it into more specific occurrences.",
        citations: [c(U.watch8, "watchOS 8.7")],
      }),
      change({
        key: "watchos-8-7-security-repairs",
        title: "watchOS 8.7 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving storage, media and audio, privilege boundaries, the kernel, WebKit, and wireless networking.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory documents fixes across APFS, AppleAVD, AppleMobileFileIntegrity, the Apple Neural Engine, audio, CoreText, the kernel, WebKit, and Wi-Fi.",
        citations: [
          c(
            U.watch87Security,
            "APFS; AppleAVD; AppleMobileFileIntegrity; Apple Neural Engine; Audio; CoreText; Kernel; WebKit; Wi-Fi",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-watchos-9-0",
    "watchOS 9.0 reached the public channel on September 12, 2022 with new faces, expanded fitness and running metrics, redesigned navigation tools, sleep stages, health tracking, accessibility, and power controls.",
    article(
      heading("Public release"),
      prose(
        "Apple launched watchOS 9 on September 12, 2022. The public build introduced a broad set of visible changes spanning personalization, workouts, outdoor navigation, sleep, medication and heart-health tracking, accessibility, and battery management.",
        [
          c(
            U.watchNews,
            "UPDATE September 12, 2022; watchOS 9 is available today",
          ),
          c(U.watch9, "watchOS 9"),
          c(U.watch9Security, "Released September 12, 2022"),
        ],
      ),
      heading("Release boundary"),
      prose(
        "Apple's launch article marked Race Route and automatic track detection as later-in-the-year additions, so neither is assigned to 9.0 here. The listed changes are those documented as present at launch; later point-release fixes and unverified community observations remain outside this event.",
        [
          c(
            U.watchNews,
            "Updates for Runners — features marked coming later this year",
          ),
          c(U.watch9, "watchOS 9.2"),
        ],
      ),
    ),
    [
      c(U.watchNews, "September 12, 2022"),
      c(U.watch9, "watchOS 9"),
      c(U.watch9Security, "Released September 12, 2022"),
    ],
    [
      change({
        key: "watchos-9-watch-faces",
        title: "New and expanded watch faces",
        canonicalSummary:
          "watchOS 9 introduced Lunar, Playtime, Metropolitan, and a redesigned Astronomy face while expanding Nike faces and customization.",
        category: "feature",
        action: "introduced",
        summary:
          "The launch added four named faces, broadened access to Nike designs, and refreshed complications, colors, Portraits subjects, and Focus-linked face selection.",
        citations: [
          c(U.watchNews, "New and Expanded Watch Faces"),
          c(U.watch9, "watchOS 9 — Watch Faces"),
        ],
      }),
      change({
        key: "watchos-9-workout-running-metrics",
        title: "Expanded Workout and running metrics",
        canonicalSummary:
          "Workout gained heart-rate zones, custom intervals, metric alerts, multisport switching, running-form measurements, Pacer, and swimming refinements.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 9 substantially expanded training views and alerts, added structured workouts and multisport recognition, exposed running form and power data, and improved pool-swim tracking.",
        citations: [
          c(
            U.watchNews,
            "Workout App Updates; Updates for Runners; Swimming Enhancements",
          ),
          c(U.watch9, "watchOS 9 — Workout"),
        ],
      }),
      change({
        key: "watchos-9-compass-waypoints-backtrack",
        title: "Redesigned Compass, Waypoints, and Backtrack",
        canonicalSummary:
          "Compass gained layered bearing and location views, saved Waypoints, and a GPS-based Backtrack path for retracing a route.",
        category: "enhancement",
        action: "changed",
        summary:
          "The redesigned Compass exposed additional coordinates and elevation data, allowed points of interest to be marked, and could record a route for later retracing on supported models.",
        citations: [
          c(U.watchNews, "Redesigned Compass App"),
          c(U.watch9, "watchOS 9 — Compass"),
        ],
      }),
      change({
        key: "watchos-9-sleep-stages",
        title: "Sleep stage tracking",
        canonicalSummary:
          "Sleep tracking began estimating awake, REM, Core, and Deep stages and showing comparisons with heart and respiratory data.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 9 classified sleep into four states and surfaced detailed stage history and comparison charts through Apple Watch and the paired iPhone's Health app.",
        citations: [
          c(U.watchNews, "Sleep Insights"),
          c(U.watch9, "watchOS 9 — Sleep"),
        ],
      }),
      change({
        key: "watchos-9-medications",
        title: "Medication schedules, reminders, and logging",
        canonicalSummary:
          "A Medications app lets users maintain schedules, receive reminders, and log scheduled or as-needed medications from Apple Watch.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought medication schedule viewing, reminder delivery, and dose logging to the wrist, with the related list and health information managed across Watch and iPhone.",
        citations: [
          c(U.watchNews, "Medications"),
          c(U.watch9, "watchOS 9 — Medications"),
        ],
      }),
      change({
        key: "watchos-9-afib-history",
        title: "AFib History",
        canonicalSummary:
          "Eligible users diagnosed with atrial fibrillation can review weekly burden estimates, time patterns, lifestyle correlations, and an exportable report.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 9 added a regulated AFib History experience with weekly estimates and Health-app context for supported users, plus a PDF designed for sharing with a clinician.",
        citations: [
          c(U.watchNews, "First-of-Its-Kind AFib History"),
          c(U.watch9, "watchOS 9 — AFib History"),
        ],
      }),
      change({
        key: "watchos-9-accessibility-mirroring",
        title: "Apple Watch Mirroring and expanded accessibility controls",
        canonicalSummary:
          "A paired iPhone can remotely control Apple Watch through AirPlay, while Quick Actions and Bluetooth-keyboard support broaden interaction options.",
        category: "feature",
        action: "introduced",
        summary:
          "The accessibility update added remote Watch control from iPhone with assistive-technology support, expanded Quick Actions, and allowed Bluetooth keyboard pairing.",
        citations: [c(U.watch9, "watchOS 9 — Accessibility")],
      }),
      change({
        key: "watchos-9-low-power-mode",
        title: "Low Power Mode",
        canonicalSummary:
          "Low Power Mode extends battery life by retaining core watch functions while temporarily reducing selected background and display features.",
        category: "feature",
        action: "introduced",
        summary:
          "watchOS 9 introduced a power-saving mode that kept primary Watch capabilities active while disabling features such as the always-on display and some background health notifications.",
        citations: [c(U.watch9, "watchOS 9 — Other features and improvements")],
      }),
      change({
        key: "watchos-9-security-baseline",
        title: "watchOS 9 security repairs",
        canonicalSummary:
          "The major release repaired vulnerabilities across media and image handling, privacy, the kernel, notifications, Sandbox, Siri, WebKit, and Wi-Fi.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's launch advisory records broad security work and identifies one kernel issue and one WebKit issue that it said may have been actively exploited.",
        citations: [
          c(
            U.watch9Security,
            "Kernel; WebKit; Accelerate Framework; AppleAVD; Contacts; Notifications; Sandbox; Siri; Wi-Fi",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-watchos-9-1",
    "watchOS 9.1 reached the public channel on October 24, 2022 with an optional lower-sampling workout mode, off-charger music downloads, Matter support, targeted fitness, weather, and accessibility fixes, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released watchOS 9.1 on October 24, 2022. Its principal additions targeted endurance during selected workouts, music download flexibility, and smart-home interoperability.",
        [
          c(U.watch9, "watchOS 9.1"),
          c(U.watch91Security, "Released October 24, 2022"),
        ],
      ),
      heading("Corrections and evidence boundary"),
      prose(
        "The same notes identify fixes for running pace feedback, Weather data and labels, Strength Training duration, and VoiceOver announcements. The advisory supplies a separate security record; the archive does not add undocumented or beta-only behavior.",
        [
          c(U.watch9, "watchOS 9.1 — bug fixes"),
          c(U.watch91Security, "watchOS 9.1 security content"),
        ],
      ),
    ),
    [
      c(U.watch9, "watchOS 9.1"),
      c(U.watch91Security, "Released October 24, 2022"),
    ],
    [
      change({
        key: "watchos-9-1-workout-battery-sampling",
        title: "Extended workout battery option",
        canonicalSummary:
          "Supported Apple Watch models can reduce heart-rate and GPS sampling during Outdoor Walk, Run, and Hike workouts to extend battery life.",
        category: "enhancement",
        action: "introduced",
        summary:
          "The update added a lower-frequency sensor-sampling option for selected outdoor workouts on Apple Watch Series 8, Apple Watch SE (2nd generation), and Apple Watch Ultra.",
        citations: [c(U.watch9, "watchOS 9.1")],
      }),
      change({
        key: "watchos-9-1-off-charger-music-downloads",
        title: "Music downloads away from the charger",
        canonicalSummary:
          "Apple Watch can download music over Wi-Fi or cellular while it is not connected to a charger.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS 9.1 removed the charger requirement for Music downloads when a Wi-Fi or cellular connection is available.",
        citations: [c(U.watch9, "watchOS 9.1")],
      }),
      change({
        key: "watchos-9-1-matter",
        title: "Matter smart-home support",
        canonicalSummary:
          "The release added support for the Matter interoperability standard for compatible smart-home accessories.",
        category: "compatibility",
        action: "introduced",
        summary:
          "watchOS 9.1 enabled Matter so compatible accessories could participate in a cross-ecosystem smart-home standard.",
        citations: [c(U.watch9, "watchOS 9.1")],
      }),
      change({
        key: "watchos-9-1-running-pace-feedback-fix",
        title: "Outdoor Run average-pace feedback correction",
        canonicalSummary:
          "The update corrected inaccurate spoken average-pace feedback during Outdoor Run workouts.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple resolved a condition in which voice feedback could report the wrong average pace during an Outdoor Run.",
        citations: [c(U.watch9, "watchOS 9.1 — bug fixes")],
      }),
      change({
        key: "watchos-9-1-weather-display-fixes",
        title: "Weather estimate and time-label corrections",
        canonicalSummary:
          "Weather was corrected for rain-estimate mismatches with iPhone and hourly complications that could label afternoon times as morning.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The release addressed two documented Weather presentation errors involving current-location rain estimates and AM labels displayed during PM hours.",
        citations: [c(U.watch9, "watchOS 9.1 — bug fixes")],
      }),
      change({
        key: "watchos-9-1-strength-voiceover-fixes",
        title: "Strength Training and VoiceOver corrections",
        canonicalSummary:
          "The update fixed stalled Strength Training duration displays and missing VoiceOver app-name announcements for grouped notifications.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple corrected a workout-timer problem for some users and a VoiceOver sequence that could omit the app name before reading multiple notifications.",
        citations: [c(U.watch9, "watchOS 9.1 — bug fixes")],
      }),
      change({
        key: "watchos-9-1-security-repairs",
        title: "watchOS 9.1 security repairs",
        canonicalSummary:
          "The release repaired protected-file, audio, certificate, kernel, Safari, Sandbox, WebKit, and compression vulnerabilities.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory records fixes across AppleMobileFileIntegrity, audio parsing, CFNetwork certificate handling, the kernel, Safari, Sandbox, WebKit, and zlib.",
        citations: [
          c(
            U.watch91Security,
            "AppleMobileFileIntegrity; Audio; CFNetwork; Kernel; Safari; Sandbox; WebKit; zlib",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-tvos-15-3",
    "tvOS 15.3 reached the public channel on January 26, 2022 as a maintenance release with general performance and stability work plus documented security corrections.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15.3 on January 26, 2022. The consumer update history describes performance and stability improvements but does not name an individual feature or behavioral change.",
        [
          c(U.tvUpdates, "tvOS 15.3"),
          c(U.tv153Security, "Released January 26, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "The version-specific advisory gives the concrete record, listing fixes in ColorSync, Crash Reporter, iCloud, the kernel, Model I/O, WebKit, and WebKit Storage. No more specific consumer or undocumented occurrence is asserted.",
        [
          c(
            U.tv153Security,
            "ColorSync; Crash Reporter; iCloud; Kernel; Model I/O; WebKit; WebKit Storage",
          ),
          c(U.tvUpdates, "tvOS 15.3"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15.3"),
      c(U.tv153Security, "Released January 26, 2022"),
    ],
    [
      change({
        key: "tvos-15-3-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple characterized tvOS 15.3 as a general performance and stability update without enumerating individual consumer changes.",
        category: "enhancement",
        action: "changed",
        summary:
          "The first-party consumer note supports a maintenance classification but does not provide enough detail to divide the work into narrower occurrences.",
        citations: [c(U.tvUpdates, "tvOS 15.3")],
      }),
      change({
        key: "tvos-15-3-security-repairs",
        title: "tvOS 15.3 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving crafted content, elevated privileges, iCloud file access, kernel execution, and web storage.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documents fixes across ColorSync, Crash Reporter, iCloud, the kernel, Model I/O, WebKit, and WebKit Storage for Apple TV 4K and Apple TV HD.",
        citations: [
          c(
            U.tv153Security,
            "ColorSync; Crash Reporter; iCloud; Kernel; Model I/O; WebKit; WebKit Storage",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-tvos-15-4",
    "tvOS 15.4 reached the public channel on March 14, 2022 with Apple Watch-assisted purchases, HomeKit camera Picture in Picture, captive-portal Wi-Fi support, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15.4 on March 14, 2022. The update expanded authentication, home-camera viewing, and network onboarding in ways aimed at shared televisions and Apple TVs used away from home.",
        [
          c(U.tvUpdates, "tvOS 15.4"),
          c(U.tv154Security, "Released March 14, 2022"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "The associated advisory records security fixes in document and image parsing, graphics, the kernel, preferences, Sandbox, and WebKit. The archive stays within those version-labeled sources and includes no inferred undocumented behavior.",
        [
          c(
            U.tv154Security,
            "Accelerate Framework; ImageIO; IOGPUFamily; Kernel; Preferences; Sandbox; WebKit",
          ),
          c(U.tvUpdates, "tvOS 15.4"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 15.4"),
      c(U.tv154Security, "Released March 14, 2022"),
    ],
    [
      change({
        key: "tvos-15-4-watch-purchase-approval",
        title: "Apple Watch-assisted purchase approval",
        canonicalSummary:
          "An Apple Watch can help complete an Apple TV purchase when used with an iPhone or iPad.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 15.4 added a purchase flow that uses Apple Watch together with an iPhone or iPad to approve transactions on Apple TV.",
        citations: [c(U.tvUpdates, "tvOS 15.4 — Apple Watch")],
      }),
      change({
        key: "tvos-15-4-home-camera-picture-in-picture",
        title: "Home camera Picture in Picture",
        canonicalSummary:
          "A HomeKit camera feed can remain visible in a Picture in Picture window while other television content plays.",
        category: "feature",
        action: "introduced",
        summary:
          "The release allowed a compatible home-camera feed to stay onscreen in a small window without replacing the program being watched.",
        citations: [c(U.tvUpdates, "tvOS 15.4 — Home cameras")],
      }),
      change({
        key: "tvos-15-4-captive-portal-wifi",
        title: "Captive-portal Wi-Fi onboarding",
        canonicalSummary:
          "Apple TV can join hotel, dormitory, and similar Wi-Fi networks that require an additional sign-in step by using an iPhone or iPad.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 15.4 added assisted setup for captive networks, expanding where Apple TV could be connected outside a conventional home Wi-Fi environment.",
        citations: [
          c(U.tvUpdates, "tvOS 15.4 — Captive portal Wi-Fi networks"),
        ],
      }),
      change({
        key: "tvos-15-4-security-repairs",
        title: "tvOS 15.4 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities across PDF and image handling, graphics, kernel and permissions boundaries, Sandbox, and WebKit.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory documents fixes in Accelerate, ImageIO, IOGPUFamily, the kernel, LLVM, MediaRemote, Preferences, Sandbox, and WebKit.",
        citations: [
          c(
            U.tv154Security,
            "Accelerate Framework; ImageIO; IOGPUFamily; Kernel; LLVM; MediaRemote; Preferences; Sandbox; WebKit",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-tvos-15-5",
    "tvOS 15.5 reached the public channel on May 16, 2022 as a maintenance release with general performance and stability work and a broad version-specific security update.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15.5 on May 16, 2022. Its consumer update entry is intentionally nonspecific, recording general performance and stability improvements without naming a feature.",
        [
          c(U.tvUpdates, "tvOS 15.5"),
          c(U.tv155Security, "Released May 16, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "The advisory identifies fixes in AppleAVD, AuthKit, video and image processing, the kernel, signature validation, WebKit, and Wi-Fi; Apple said one AppleAVD issue may have been actively exploited. No undocumented consumer claim is added.",
        [
          c(
            U.tv155Security,
            "AppleAVD; AuthKit; AVEVideoEncoder; ImageIO; Kernel; Security; WebKit; Wi-Fi",
          ),
          c(U.tvUpdates, "tvOS 15.5"),
        ],
      ),
    ),
    [c(U.tvUpdates, "tvOS 15.5"), c(U.tv155Security, "Released May 16, 2022")],
    [
      change({
        key: "tvos-15-5-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple characterized tvOS 15.5 as a general performance and stability update without listing named consumer changes.",
        category: "enhancement",
        action: "changed",
        summary:
          "The consumer note establishes maintenance work but does not provide enough first-party detail to split it into narrower changes.",
        citations: [c(U.tvUpdates, "tvOS 15.5")],
      }),
      change({
        key: "tvos-15-5-security-repairs",
        title: "tvOS 15.5 security repairs",
        canonicalSummary:
          "The update repaired vulnerabilities affecting media and image processing, authentication, kernel and signature boundaries, WebKit, and Wi-Fi.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented a broad security update and said a patched AppleAVD out-of-bounds write issue may have been actively exploited.",
        citations: [
          c(
            U.tv155Security,
            "AppleAVD; AuthKit; AVEVideoEncoder; ImageIO; Kernel; Security; WebKit; Wi-Fi",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-tvos-15-6",
    "tvOS 15.6 reached the public channel on July 20, 2022 as a maintenance release with general performance and stability work plus extensive security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 15.6 on July 20, 2022. The consumer history names only general performance and stability improvements, so no discrete feature launch is attributed to this version.",
        [
          c(U.tvUpdates, "tvOS 15.6"),
          c(U.tv156Security, "Released July 20, 2022"),
        ],
      ),
      heading("Documented security and source gap"),
      prose(
        "Apple's advisory details repairs across storage, authorization, audio and media, iCloud Photo Library, the kernel, software-update transport, WebKit, and Wi-Fi. This archive leaves more specific consumer and undocumented changes unclaimed.",
        [
          c(
            U.tv156Security,
            "APFS; AppleMobileFileIntegrity; Audio; CoreMedia; iCloud Photo Library; Kernel; Software Update; WebKit; Wi-Fi",
          ),
          c(U.tvUpdates, "tvOS 15.6"),
        ],
      ),
    ),
    [c(U.tvUpdates, "tvOS 15.6"), c(U.tv156Security, "Released July 20, 2022")],
    [
      change({
        key: "tvos-15-6-performance-stability",
        title: "General performance and stability improvements",
        canonicalSummary:
          "Apple characterized tvOS 15.6 as a general performance and stability update without enumerating consumer features.",
        category: "enhancement",
        action: "changed",
        summary:
          "The first-party update history supports a maintenance classification but does not expose a more granular consumer change list.",
        citations: [c(U.tvUpdates, "tvOS 15.6")],
      }),
      change({
        key: "tvos-15-6-security-repairs",
        title: "tvOS 15.6 security repairs",
        canonicalSummary:
          "The release repaired vulnerabilities involving file systems, media, authorization, kernel execution, information disclosure, update transport, WebKit, and Wi-Fi.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documents fixes across APFS, AppleAVD, authorization, audio, CoreMedia, iCloud Photo Library, the kernel, Software Update, WebKit, and Wi-Fi.",
        citations: [
          c(
            U.tv156Security,
            "APFS; AppleAVD; AppleMobileFileIntegrity; Audio; CoreMedia; iCloud Photo Library; Kernel; Software Update; WebKit; Wi-Fi",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-tvos-16-0",
    "tvOS 16.0 reached the public channel on September 12, 2022 with easier multiuser setup, Personalized Spatial Audio, multilingual keyboards, new Siri languages, accessibility additions, and security fixes.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 16 on September 12, 2022. The launch focused on household personalization, audio tuned to an individual's profile, multilingual text entry, broader Siri language coverage, and accessibility.",
        [
          c(U.tvUpdates, "tvOS 16"),
          c(U.tv16Security, "Released September 12, 2022"),
        ],
      ),
      heading("Release boundary"),
      prose(
        "Apple also published a version-specific security advisory for the public build. This event excludes Shared Photo Library, Matter, iPhone-only Fitness+, and the redesigned Siri interface because Apple's update history places those changes in tvOS 16.1.",
        [
          c(U.tv16Security, "tvOS 16 security content"),
          c(U.tvUpdates, "tvOS 16.1"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 16"),
      c(U.tv16Security, "Released September 12, 2022"),
    ],
    [
      change({
        key: "tvos-16-multiuser-family-profiles",
        title: "Simpler Family Sharing profiles",
        canonicalSummary:
          "Apple TV made it easier to add Family Sharing members so each person could use an individual Up Next list and personalized recommendations.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 16 streamlined household profile setup and preserved separate viewing queues and television, movie, music, and app recommendations.",
        citations: [c(U.tvUpdates, "tvOS 16 — Multiuser")],
      }),
      change({
        key: "tvos-16-personalized-spatial-audio",
        title: "Personalized Spatial Audio",
        canonicalSummary:
          "Apple TV 4K can use a Spatial Audio profile created on iPhone to tune playback for supported AirPods models.",
        category: "feature",
        action: "introduced",
        summary:
          "The release brought personalized headphone spatialization to supported Apple TV 4K and AirPods combinations, using the primary user's matching Apple ID and iPhone-created profile.",
        citations: [c(U.tvUpdates, "tvOS 16 — Spatial Audio")],
      }),
      change({
        key: "tvos-16-multilingual-keyboard",
        title: "Multiple onscreen-keyboard languages",
        canonicalSummary:
          "The onscreen keyboard can switch among multiple configured languages while the user enters text.",
        category: "enhancement",
        action: "introduced",
        summary:
          "tvOS 16 allowed more than one keyboard language to be enabled and selected through a globe control during onscreen text entry.",
        citations: [c(U.tvUpdates, "tvOS 16 — Keyboard")],
      }),
      change({
        key: "tvos-16-siri-languages",
        title: "Additional Siri language support",
        canonicalSummary:
          "Siri gained Spanish support in Chile, Finnish in Finland, and English in South Africa.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The public release expanded Siri's regional language availability across Chile, Finland, and South Africa.",
        citations: [c(U.tvUpdates, "tvOS 16 — Siri")],
      }),
      change({
        key: "tvos-16-hover-text-voiceover-voices",
        title: "Hover Text and new VoiceOver voices",
        canonicalSummary:
          "Accessibility settings gained Hover Text for enlarged onscreen descriptions and additional VoiceOver voice choices.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS 16 added a magnified-description aid and broadened the speech voices available to VoiceOver users.",
        citations: [c(U.tvUpdates, "tvOS 16 — Accessibility")],
      }),
      change({
        key: "tvos-16-security-baseline",
        title: "tvOS 16 security repairs",
        canonicalSummary:
          "The major release repaired vulnerabilities across media and image processing, GPU and kernel boundaries, notifications, Sandbox, WebKit, and Wi-Fi.",
        category: "security",
        action: "fixed",
        summary:
          "Apple's advisory documents security work in Accelerate, AppleAVD, GPU Drivers, ImageIO, Image Processing, the kernel, Notifications, Sandbox, WebKit, and Wi-Fi.",
        citations: [
          c(
            U.tv16Security,
            "Accelerate Framework; AppleAVD; GPU Drivers; ImageIO; Image Processing; Kernel; Notifications; Sandbox; WebKit; Wi-Fi",
          ),
        ],
      }),
    ],
  ),
  event(
    "version-tvos-16-1",
    "tvOS 16.1 reached the public channel on October 24, 2022 with a redesigned Siri experience, AirPods hands-free control, Shared Photo Library, iPhone-based Fitness+, Matter, and security repairs.",
    article(
      heading("Public release"),
      prose(
        "Apple released tvOS 16.1 on October 24, 2022. The update expanded Apple TV's voice interface, family photo access, workout entry path, and smart-home interoperability.",
        [
          c(U.tvUpdates, "tvOS 16.1"),
          c(U.tv161Security, "Released October 24, 2022"),
        ],
      ),
      heading("Documented scope"),
      prose(
        "The associated advisory records protected-file, media, certificate, kernel, Sandbox, and WebKit repairs. All changes below come from Apple's 16.1-labeled material; no later tvOS 16 capability or undocumented report is projected onto this event.",
        [
          c(
            U.tv161Security,
            "AppleMobileFileIntegrity; Audio; CFNetwork; Kernel; Sandbox; WebKit",
          ),
          c(U.tvUpdates, "tvOS 16.1 through tvOS 16.6"),
        ],
      ),
    ),
    [
      c(U.tvUpdates, "tvOS 16.1"),
      c(U.tv161Security, "Released October 24, 2022"),
    ],
    [
      change({
        key: "tvos-16-1-siri-redesign-airpods",
        title: "Redesigned Siri and AirPods hands-free control",
        canonicalSummary:
          "Siri gained a new television interface, and connected AirPods can invoke it with a hands-free wake phrase.",
        category: "enhancement",
        action: "changed",
        summary:
          "tvOS 16.1 redesigned Siri's onscreen presentation for media and app requests and enabled voice-only invocation through connected AirPods.",
        citations: [c(U.tvUpdates, "tvOS 16.1 — Siri")],
      }),
      change({
        key: "tvos-16-1-shared-photo-library",
        title: "iCloud Shared Photo Library on Apple TV",
        canonicalSummary:
          "The Photos app can display an iCloud Shared Photo Library created on an iPhone, iPad, or Mac.",
        category: "feature",
        action: "introduced",
        summary:
          "The update brought shared family photo collections to the television after the library is configured on another supported Apple device.",
        citations: [c(U.tvUpdates, "tvOS 16.1 — Photos")],
      }),
      change({
        key: "tvos-16-1-fitness-plus-iphone",
        title: "Fitness+ workouts using iPhone",
        canonicalSummary:
          "Apple Fitness+ can run on Apple TV with an iPhone supplying activity tracking and estimated Move ring progress instead of an Apple Watch.",
        category: "compatibility",
        action: "introduced",
        summary:
          "tvOS 16.1 opened Fitness+ on Apple TV to iPhone users, showing coaching and timers onscreen while the phone provided estimated activity progress.",
        citations: [c(U.tvUpdates, "tvOS 16.1 — Apple Fitness+")],
      }),
      change({
        key: "tvos-16-1-matter",
        title: "Matter smart-home support",
        canonicalSummary:
          "Apple TV's home-hub role gained support for compatible accessories using the Matter interoperability standard.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The release added Matter support so a broader range of compatible smart-home products could work across ecosystems through the home hub.",
        citations: [c(U.tvUpdates, "tvOS 16.1 — Home hub")],
      }),
      change({
        key: "tvos-16-1-security-repairs",
        title: "tvOS 16.1 security repairs",
        canonicalSummary:
          "The update repaired protected-file, audio, certificate, kernel, model-processing, Sandbox, and WebKit vulnerabilities.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documents fixes across AppleMobileFileIntegrity, audio parsing, CFNetwork certificate validation, the kernel, Model I/O, Sandbox, and WebKit.",
        citations: [
          c(
            U.tv161Security,
            "AppleMobileFileIntegrity; Audio; CFNetwork; Kernel; Model I/O; Sandbox; WebKit",
          ),
        ],
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
  join(here, "apple-other-2022.json"),
  `${JSON.stringify(bundle, null, 2)}\n`,
);

const eventChanges = events.reduce(
  (sum, releaseEvent) => sum + releaseEvent.changes.length,
  0,
);
const md = `# Apple 2022 non-iPhone research batch

## Result

\`apple-other-2022.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2022. It contains original synthesis with claim-level citations and does not copy publisher prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 13.0 | 1 | ${events.filter((item) => item.target.releaseVersionId.startsWith("version-macos")).reduce((sum, item) => sum + item.changes.length, 0)} |
| watchOS | 8.4, 8.5, 8.6, 8.7, 9.0, 9.1 | 6 | ${events.filter((item) => item.target.releaseVersionId.startsWith("version-watchos")).reduce((sum, item) => sum + item.changes.length, 0)} |
| tvOS | 15.3, 15.4, 15.5, 15.6, 16.0, 16.1 | 6 | ${events.filter((item) => item.target.releaseVersionId.startsWith("version-tvos")).reduce((sum, item) => sum + item.changes.length, 0)} |
| **Total** | **13 version articles** | **${events.length}** | **${eventChanges}** |

The 13 versions contain 94 existing local timeline milestones: 13 public appearances and 81 beta, release-candidate, and related non-public milestones. This bundle enriches only the 13 public appearances, selected through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 26 version/event records are \`editoriallyVerified\` and carry the
  recorded approval timestamp \`${reviewedAt}\`.
- All public events are indexable after editorial approval.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included because this bounded first-party pass did not establish one with durable evidence.
- No beta notes or cumulative later-release claims are projected backward onto public releases.
- No build records are included; a complete first-party build ledger was outside this cohort.
- Security changes summarize affected surfaces and remediation classes without reproducing advisory prose.
- Apple names are used nominatively; the bundle contains no Apple artwork, logos, screenshots, or copied release-note body text.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### macOS

- <${U.macNews}> — dated public availability and launch features
- <${U.macDeveloper}> — version-specific developer notes and Accessory Security
- <${U.macEnterprise}> — Ventura 13.0 enterprise and device-management changes
- <${U.macSecurity}> — Ventura 13 security content and release date

### watchOS

- <${U.watch8}> — watchOS 8 consumer update notes
- <${U.watch9}> — watchOS 9 consumer update notes
- <${U.watchNews}> — dated watchOS 9 public-availability announcement
- <${U.watch84Security}>
- <${U.watch85Security}>
- <${U.watch86Security}>
- <${U.watch87Security}>
- <${U.watch9Security}>
- <${U.watch91Security}>

### tvOS

- <${U.tvUpdates}> — Apple TV software-update notes
- <${U.tv153Security}>
- <${U.tv154Security}>
- <${U.tv155Security}>
- <${U.tv156Security}>
- <${U.tv16Security}>
- <${U.tv161Security}>

Apple Support pages are living documents and may show page-level revision dates later than the historical release. Mapping uses the explicitly labeled version section and advisory release line.

## Known gaps

1. Apple's consumer notes for watchOS 8.7 and tvOS 15.3, 15.5, and 15.6 do not enumerate named feature changes. Those records say so directly and use the version-specific security advisory for substantive detail.
2. No community-sourced undocumented change met the evidence bar during this first-party cohort. Such claims should be added later only with reproducible verification or multiple independent durable sources.
3. The local dataset has no macOS 13.1 version document even though that release occurred in 2022. Per scope, this batch does not create missing version records.
4. The 81 non-public milestones remain timeline-only records until beta-specific sources can support event-level claims.
5. Security advisories can receive later-added entries. The summaries describe Apple's current documented record for each release, not proof that every advisory entry appeared on launch day.

## Validation

- JSON parse and launch-content bundle assertion: passed.
- Repository-wide research-batch validation: passed.
- Exact inventory reconciliation: passed for 13 existing version IDs, 13 public appearances, and 94 local milestones.
- Source-ledger closure: all 228 citation references resolve to the 20 declared sources, and all 20 sources are used.
- Editorial-state check: all 26 version/event records are
  \`editoriallyVerified\` plus \`approved\`; all 13 events are indexable.
- Change check: all ${eventChanges} keys are unique, and every occurrence is cited, documented, confirmed, and a public-release delta.
- Generator lint and whitespace checks: passed.
- Guarded production Sanity apply against \`lh3yswzu/production\`: passed.
  - 77 creates: 19 sources and ${eventChanges} release changes
  - 27 revision-guarded patches: 13 existing public events, 13 release
    versions, and metadata on one reused source
  - 0 event creates, 0 build creates, and 2,069 unchanged documents
  - 190,258-byte mutation payload, 4.9% of the guarded limit
  - Exact applied plan SHA:
    \`cc683141dd679ea68d2d15354aedef22d320baa5a7b6fab13fc310692ff957fa\`
  - Transaction: \`tt1fSB5HY9GAB0YLyxmSdQ\`
  - The ingestion pipeline committed the transaction and verified zero
    residual mutations.
`;

writeFileSync(join(here, "apple-other-2022.md"), md);
