import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:35:52Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/103813",
  macNews:
    "https://www.apple.com/newsroom/2015/09/29OS-X-El-Capitan-Available-as-a-Free-Update-Tomorrow/",
  macSecurity: "https://support.apple.com/en-us/103562",
  watchLaunch:
    "https://www.apple.com/newsroom/2015/03/09Apple-Watch-Available-in-Nine-Countries-on-April-24/",
  watchNotes: "https://support.apple.com/en-us/106617",
  watch2Preview:
    "https://www.apple.com/newsroom/2015/06/08Apple-Previews-New-Apple-Watch-Software/",
  watch2Planned:
    "https://www.apple.com/newsroom/2015/09/09Apple-Introduces-watchOS-2-with-Native-Apps-and-New-Gold-Rose-Gold-Aluminum-Apple-Watch-Sport-Models/",
  watch2Security: "https://support.apple.com/en-us/103306",
  watch21Security: "https://support.apple.com/en-us/103565",
  tvLaunch:
    "https://www.apple.com/newsroom/2015/09/09Apple-Brings-Innovation-Back-to-Television-with-The-All-New-Apple-TV/",
  tvShipping:
    "https://www.apple.com/newsroom/2015/10/27Apple-Reports-Record-Fourth-Quarter-Results/",
  tv90Sdk:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-tvOSSDK-9.0/",
  tv91Sdk:
    "https://developer.apple.com/library/archive/releasenotes/General/RN-tvOSSDK-9.1/",
  tv91Security: "https://support.apple.com/en-us/103509",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (2015)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-06T00:00:00.000Z",
    topics: ["Apple software", "2015", "release dates", "security updates"],
  },
  {
    url: U.macNews,
    title: "OS X El Capitan Available as a Free Update Tomorrow",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-09-29T00:00:00.000Z",
    topics: ["OS X", "El Capitan", "10.11", "availability", "features"],
  },
  {
    url: U.macSecurity,
    title: "About the security content of OS X El Capitan v10.11",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-03T00:00:00.000Z",
    topics: ["OS X", "El Capitan", "10.11", "security", "CVE"],
  },
  {
    url: U.watchLaunch,
    title: "Apple Watch Available in Nine Countries on April 24",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-03-09T00:00:00.000Z",
    topics: [
      "Apple Watch",
      "launch software",
      "hardware availability",
      "features",
    ],
  },
  {
    url: U.watchNotes,
    title: "Download watchOS 2.0 - 2.2.2 Information",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2024-03-08T00:00:00.000Z",
    topics: ["watchOS", "2.0", "2.1", "consumer release notes"],
  },
  {
    url: U.watch2Preview,
    title: "Apple Previews New Apple Watch Software",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-06-08T00:00:00.000Z",
    topics: ["watchOS", "2.0", "features", "WatchKit", "developer APIs"],
  },
  {
    url: U.watch2Planned,
    title:
      "Apple Introduces watchOS 2 with Native Apps and New Gold & Rose Gold Aluminum Apple Watch Sport Models",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-09-09T00:00:00.000Z",
    topics: ["watchOS", "2.0", "planned availability", "date anomaly"],
  },
  {
    url: U.watch2Security,
    title: "About the security content of watchOS 2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-12-06T00:00:00.000Z",
    topics: ["watchOS", "2.0", "security", "CVE"],
  },
  {
    url: U.watch21Security,
    title: "About the security content of watchOS 2.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-03T00:00:00.000Z",
    topics: ["watchOS", "2.1", "security", "CVE"],
  },
  {
    url: U.tvLaunch,
    title: "Apple Brings Innovation Back to Television with The All-New Apple TV",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-09-09T00:00:00.000Z",
    topics: ["tvOS", "9.0", "Apple TV", "launch", "features"],
  },
  {
    url: U.tvShipping,
    title: "Apple Reports Record Fourth Quarter Results",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2015-10-27T00:00:00.000Z",
    topics: ["Apple TV", "shipping", "hardware availability"],
  },
  {
    url: U.tv90Sdk,
    title: "tvOS SDK Release Notes for tvOS 9.0",
    publisher: "Apple Developer Documentation Archive",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2015-10-21T00:00:00.000Z",
    topics: ["tvOS", "9.0", "SDK", "developer APIs"],
  },
  {
    url: U.tv91Sdk,
    title: "tvOS SDK Release Notes for tvOS 9.1",
    publisher: "Apple Developer Documentation Archive",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2015-12-08T00:00:00.000Z",
    topics: ["tvOS", "9.1", "SDK", "developer APIs"],
  },
  {
    url: U.tv91Security,
    title: "About the security content of tvOS 9.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-03T00:00:00.000Z",
    topics: ["tvOS", "9.1", "security", "CVE"],
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
      "Matched Apple's version-specific consumer notes, launch material, SDK documentation, or security advisory to the existing audited public-release event.",
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
    id: "version-macos-10-11",
    releaseNotesUrl: U.macNews,
    overview:
      "OS X El Capitan 10.11 became publicly available on September 30, 2015. The release refined window management, Spotlight, Safari, Mail, Photos, Notes, international input, and system performance while establishing a broad new security baseline.",
    overviewCitations: [
      c(U.macNews, "September 30 availability; feature sections"),
      c(U.macSecurity, "OS X El Capitan v10.11 security content"),
      c(U.securityIndex, "OS X El Capitan 10.11 — 30 Sep 2015"),
    ],
    boundary:
      "This article covers the initial 10.11 launch only. It does not project changes from 10.11.1 or 10.11.2 backward, and performance or compatibility statements retain Apple's device, workload, and feature-availability qualifications.",
    boundaryCitations: [
      c(U.macNews, "Pricing & Availability; performance-testing footnote"),
      c(
        U.securityIndex,
        "OS X El Capitan 10.11, 10.11.1, and 10.11.2 entries",
      ),
    ],
    pageCitations: [
      c(U.macNews, "September 29 announcement; September 30 availability"),
      c(U.macSecurity, "OS X El Capitan v10.11 security content"),
      c(U.securityIndex, "OS X El Capitan 10.11 — 30 Sep 2015"),
    ],
    summary:
      "OS X El Capitan 10.11 reached the public channel on September 30, 2015 with windowing, search, app, graphics, language, compatibility, and security changes.",
    publicText:
      "Apple made OS X El Capitan available from the Mac App Store as a free update on September 30, 2015. Apple's dated security index carries the same public date.",
    publicCitations: [
      c(U.macNews, "Pricing & Availability"),
      c(U.securityIndex, "OS X El Capitan 10.11 — 30 Sep 2015"),
    ],
    scopeText:
      "The structured entries synthesize Apple's launch announcement and version-specific security record. They exclude beta-only behavior, later El Capitan point releases, and unverified performance generalizations.",
    scopeCitations: [
      c(U.macNews, "Refinements through Pricing & Availability"),
      c(U.macSecurity, "OS X El Capitan v10.11 security content"),
    ],
    changes: [
      change({
        key: "macos-10-11-mission-control-spaces",
        title: "Streamlined Mission Control and Spaces creation",
        canonicalSummary:
          "Mission Control arranged open windows in one layer and let users create a new Space by dragging a window to the top of the display.",
        category: "enhancement",
        action: "changed",
        summary:
          "El Capitan revised the overview workspace to reduce window overlap and made it more direct to separate crowded work into another desktop.",
        citations: [c(U.macNews, "Refinements to the Mac Experience")],
      }),
      change({
        key: "macos-10-11-split-view",
        title: "Split View",
        canonicalSummary:
          "Split View automatically placed two app windows side by side in a full-screen workspace.",
        category: "feature",
        action: "introduced",
        summary:
          "The new windowing mode gave two applications a shared, distraction-limited full-screen layout without manual sizing.",
        citations: [c(U.macNews, "Split View")],
      }),
      change({
        key: "macos-10-11-spotlight-live-information",
        title: "Live information in Spotlight",
        canonicalSummary:
          "Spotlight added stocks, weather, sports scores, schedules, standings, and athlete information.",
        category: "enhancement",
        action: "changed",
        summary:
          "System search expanded beyond local content to show several categories of current reference information directly in its results.",
        citations: [c(U.macNews, "Spotlight")],
      }),
      change({
        key: "macos-10-11-spotlight-natural-language",
        title: "Natural-language Spotlight queries",
        canonicalSummary:
          "Spotlight could locate files from conversational descriptions and gained a movable, resizable results window.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could describe a document by sender, date, or recent work context and adjust the search panel to accommodate more results.",
        citations: [c(U.macNews, "Spotlight natural-language search")],
      }),
      change({
        key: "macos-10-11-safari-pinned-sites",
        title: "Pinned Sites in Safari",
        canonicalSummary:
          "Safari added persistent Pinned Sites for keeping frequently used websites open and active.",
        category: "feature",
        action: "introduced",
        summary:
          "The browser gained a compact, durable place for sites that users wanted to keep readily available between browsing sessions.",
        citations: [c(U.macNews, "Built-in apps — Safari")],
      }),
      change({
        key: "macos-10-11-safari-tab-audio",
        title: "Tab audio muting in Safari",
        canonicalSummary:
          "Safari added a control for finding and silencing audio playing from a browser tab.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could stop unwanted browser audio without first locating and interacting with the media element inside the page.",
        citations: [c(U.macNews, "Built-in apps — Safari")],
      }),
      change({
        key: "macos-10-11-mail-smart-suggestions",
        title: "Mail Smart Suggestions",
        canonicalSummary:
          "Mail recognized names and events in messages and offered to add them to Contacts or Calendar.",
        category: "feature",
        action: "introduced",
        summary:
          "The mail client turned contact and event details in message text into one-step additions to the corresponding built-in apps.",
        citations: [c(U.macNews, "Built-in apps — Mail")],
      }),
      change({
        key: "macos-10-11-mail-gestures-full-screen",
        title: "Mail swipe and full-screen composition improvements",
        canonicalSummary:
          "Mail added an iOS-style delete gesture and supported working with multiple messages while in full screen.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release aligned message triage with familiar swipe behavior and made full-screen email composition less restrictive.",
        citations: [c(U.macNews, "Built-in apps — Mail")],
      }),
      change({
        key: "macos-10-11-photos-organization-extensions",
        title: "Photos organization and editing extensions",
        canonicalSummary:
          "Photos added location editing, batch description changes, album sorting, and third-party editing extensions.",
        category: "enhancement",
        action: "changed",
        summary:
          "The library gained stronger metadata and sorting controls while allowing compatible external editors to participate in the Photos workflow.",
        citations: [c(U.macNews, "Built-in apps — Photos")],
      }),
      change({
        key: "macos-10-11-notes-rich-content",
        title: "Rich content, checklists, and attachment browsing in Notes",
        canonicalSummary:
          "Notes accepted files and shared content, added checklists, and introduced a dedicated attachment browser.",
        category: "enhancement",
        action: "changed",
        summary:
          "A note could contain photos, PDFs, videos, web links, map locations, and task lists, with attachments collected into a searchable visual view.",
        citations: [c(U.macNews, "Built-in apps — Notes")],
      }),
      change({
        key: "macos-10-11-notes-icloud-sync",
        title: "Cross-device Notes synchronization",
        canonicalSummary:
          "iCloud synchronized the revised Notes content and checklist state across supported Apple devices.",
        category: "enhancement",
        action: "changed",
        summary:
          "Notes created or edited on one device could be continued elsewhere, including updates to checklist completion.",
        citations: [c(U.macNews, "Notes and iCloud")],
      }),
      change({
        key: "macos-10-11-metal",
        title: "Metal graphics technology on Mac",
        canonicalSummary:
          "El Capitan brought Metal to Mac for accelerated system graphics, games, and professional applications.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Apple integrated its lower-overhead graphics technology with Core Animation and Core Graphics and exposed it to supported games and professional software.",
        citations: [c(U.macNews, "Improvements to System Performance — Metal")],
      }),
      change({
        key: "macos-10-11-east-asian-input",
        title: "Chinese and Japanese text improvements",
        canonicalSummary:
          "El Capitan added a new Chinese system font, smarter Chinese input, improved Japanese conversion, and four Japanese typefaces.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release expanded typography and input assistance for Traditional and Simplified Chinese and reduced manual confirmation during Japanese text conversion.",
        citations: [
          c(U.macNews, "Enhanced international language support"),
        ],
      }),
      change({
        key: "macos-10-11-hardware-compatibility",
        title: "2009-and-later Mac compatibility baseline",
        canonicalSummary:
          "Apple stated that El Capitan supported all Macs introduced in 2009 or later plus selected 2007 and 2008 models.",
        category: "compatibility",
        action: "changed",
        summary:
          "The launch announcement defined a broad hardware eligibility range while noting that individual features were not available on every device.",
        citations: [c(U.macNews, "Pricing & Availability; footnote")],
      }),
      securityChange({
        key: "macos-10-11-network-trust-security",
        title: "Networking, certificate, and cryptography repairs",
        canonicalSummary:
          "El Capitan repaired issues involving cookies, proxies, HSTS, TLS, certificate validation, cryptographic operations, and network protocols.",
        summary:
          "Apple's advisory records stronger validation and state handling across secure transport, private browsing, credential, proxy, and network data paths.",
        url: U.macSecurity,
        locator:
          "AirScan; Certificate Trust Policy; CFNetwork Cookies through SSL; CoreCrypto; Heimdal; Multipeer Connectivity",
      }),
      securityChange({
        key: "macos-10-11-kernel-driver-security",
        title: "Kernel, driver, firmware, and privilege repairs",
        canonicalSummary:
          "El Capitan addressed code execution, privilege, memory disclosure, and denial-of-service risks in the kernel, drivers, EFI, installers, and system utilities.",
        summary:
          "The documented repairs span memory handling, entitlement checks, pointer exposure, firmware-update boundaries, privileged executables, and local attack surfaces.",
        url: U.macSecurity,
        locator:
          "Dev Tools through Kernel; Install Framework Legacy; graphics, HID, storage, SMB, and NetworkExtension entries",
      }),
      securityChange({
        key: "macos-10-11-content-app-security",
        title: "Content parsing and built-in app security repairs",
        canonicalSummary:
          "El Capitan repaired vulnerabilities in fonts, media, disk images, Notes, Mail, Terminal, databases, scripting runtimes, and other bundled components.",
        summary:
          "Apple's record includes input-validation, memory-safety, privacy, code-signing, and information-disclosure fixes across documents, communications, web-adjacent content, and system tools.",
        url: U.macSecurity,
        locator:
          "Audio; CoreText; Disk Images; Finder; Mail; Notes; OpenSSH; OpenSSL; Ruby; SQLite; Terminal; Time Machine",
      }),
    ],
  }),
  release({
    id: "version-watchos-1-0",
    releaseNotesUrl: U.watchLaunch,
    overview:
      "The local catalog treats watchOS 1.0 as the launch software that accompanied the original Apple Watch on April 24, 2015. Its documented scope established wrist-first navigation, communication, health and fitness, payments, directions, glanceable information, and companion-app experiences.",
    overviewCitations: [
      c(U.watchLaunch, "April 24 availability; feature sections"),
    ],
    boundary:
      "Apple's launch material describes Apple Watch as an integrated hardware-and-software product and does not label this baseline as a separate watchOS 1.0 download. Apple's 2015 security index begins watch software coverage with Watch OS 1.0.1 on May 19, so no security repair is inferred for the April 24 baseline.",
    boundaryCitations: [
      c(U.watchLaunch, "Integrated hardware and software; availability"),
      c(U.securityIndex, "Watch OS 1.0.1 — 19 May 2015"),
    ],
    pageCitations: [
      c(U.watchLaunch, "April 24 availability; Apple Watch feature sections"),
      c(U.securityIndex, "Watch OS 1.0.1 — 19 May 2015"),
    ],
    summary:
      "The audited watchOS 1.0 public route records the original Apple Watch launch on April 24, 2015 and its documented navigation, communication, fitness, service, app, and compatibility baseline.",
    publicText:
      "Apple made the original Apple Watch available on April 24, 2015 with its initial software preinstalled. This route represents that integrated product launch, not a separately delivered software update.",
    publicCitations: [
      c(U.watchLaunch, "April 24 availability; Pricing & Availability"),
    ],
    scopeText:
      "The structured entries cover software-visible capabilities in Apple's launch announcement. Hardware mechanisms are named only where they define an interaction or sensing boundary, and later Watch OS 1.0.1 repairs are excluded.",
    scopeCitations: [
      c(U.watchLaunch, "Digital Crown through app ecosystem"),
      c(U.securityIndex, "Watch OS 1.0.1 — 19 May 2015"),
    ],
    changes: [
      change({
        key: "watchos-1-0-digital-crown",
        title: "Digital Crown navigation",
        canonicalSummary:
          "The Digital Crown provided scrolling, zooming, and navigation without covering the display.",
        category: "feature",
        action: "introduced",
        summary:
          "The initial Apple Watch interface used a physical crown as a primary software control for precise movement through compact on-screen content.",
        citations: [c(U.watchLaunch, "Digital Crown")],
      }),
      change({
        key: "watchos-1-0-force-touch-taptic",
        title: "Force Touch controls and Taptic alerts",
        canonicalSummary:
          "The launch interface distinguished taps from presses and paired software notifications with discrete wrist taps.",
        category: "feature",
        action: "introduced",
        summary:
          "Pressure-sensitive controls exposed contextual actions while the Taptic Engine provided a private physical notification channel.",
        citations: [c(U.watchLaunch, "Force Touch and Taptic Engine")],
      }),
      change({
        key: "watchos-1-0-faces-complications",
        title: "Customizable watch faces and complications",
        canonicalSummary:
          "Apple Watch launched with multiple face styles and configurable complications for time-adjacent information.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could select analog, modular, or animated presentations and attach details such as calendar events, activity, or sunrise and sunset.",
        citations: [
          c(U.watchLaunch, "Incredibly Accurate & Customizable Timepiece"),
        ],
      }),
      change({
        key: "watchos-1-0-glances",
        title: "Glances",
        canonicalSummary:
          "A swipe from the watch face opened concise views of selected information.",
        category: "feature",
        action: "introduced",
        summary:
          "The launch software created a quick-access layer for details such as weather, location, and currently playing music.",
        citations: [c(U.watchLaunch, "Glances")],
      }),
      change({
        key: "watchos-1-0-calls-messages-mail",
        title: "Calls, messages, and email from the wrist",
        canonicalSummary:
          "Apple Watch could send messages, read email, and answer calls relayed through its paired iPhone.",
        category: "feature",
        action: "introduced",
        summary:
          "Core communication functions moved to the wrist while remaining dependent on the companion iPhone relationship.",
        citations: [
          c(U.watchLaunch, "Intimate & Immediate Communication Device"),
        ],
      }),
      change({
        key: "watchos-1-0-digital-touch",
        title: "Digital Touch",
        canonicalSummary:
          "Digital Touch let users send a sketch, a tap, or the rhythm of a heartbeat.",
        category: "feature",
        action: "introduced",
        summary:
          "The launch software added lightweight, wrist-native messages built around drawing, haptics, and sensor-derived heartbeat data.",
        citations: [c(U.watchLaunch, "Digital Touch")],
      }),
      change({
        key: "watchos-1-0-pay-passes-siri-maps",
        title: "Apple Pay, passes, and Siri directions",
        canonicalSummary:
          "Apple Watch supported Apple Pay transactions, Passbook boarding passes, and Siri requests for Maps directions.",
        category: "feature",
        action: "introduced",
        summary:
          "The launch software connected the wrist interface to payment, travel-pass, voice-assistant, and navigation workflows, subject to service availability.",
        citations: [c(U.watchLaunch, "Apple Pay, Passbook, Siri, and Maps")],
      }),
      change({
        key: "watchos-1-0-activity-rings",
        title: "Activity rings",
        canonicalSummary:
          "The Activity app visualized active calories, brisk activity, and standing behavior with three daily rings.",
        category: "feature",
        action: "introduced",
        summary:
          "The system established Move, Exercise, and Stand-style progress as the central summary of everyday movement.",
        citations: [
          c(U.watchLaunch, "Groundbreaking Health & Fitness Companion"),
        ],
      }),
      change({
        key: "watchos-1-0-workout",
        title: "Workout tracking",
        canonicalSummary:
          "The Workout app recorded detailed metrics for activities such as walking, running, and cycling.",
        category: "feature",
        action: "introduced",
        summary:
          "Dedicated exercise sessions gained an on-watch tracking mode distinct from the all-day Activity summary.",
        citations: [c(U.watchLaunch, "Workout app")],
      }),
      change({
        key: "watchos-1-0-sensor-fusion",
        title: "Watch and iPhone sensor fusion",
        canonicalSummary:
          "Activity and workout calculations combined the watch accelerometer and heart-rate sensor with GPS and Wi-Fi information from iPhone.",
        category: "behavior",
        action: "introduced",
        summary:
          "The launch system selected between on-watch and paired-phone sensors to build movement history and personalized activity goals.",
        citations: [c(U.watchLaunch, "Activity sensors and iPhone history")],
      }),
      change({
        key: "watchos-1-0-companion-apps",
        title: "Companion-style third-party apps",
        canonicalSummary:
          "Third-party Apple Watch experiences extended iPhone apps and were discovered through the Apple Watch app on iOS 8.2.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The first app model placed core app ownership on iPhone while presenting wrist-specific interactions and an Apple Watch App Store browser in the companion app.",
        citations: [c(U.watchLaunch, "Developer apps and Apple Watch app")],
      }),
      change({
        key: "watchos-1-0-iphone-compatibility",
        title: "iPhone 5 and iOS 8.2 requirement",
        canonicalSummary:
          "Original Apple Watch required an iPhone 5 or later running iOS 8.2 or later.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The launch software did not operate as an independent platform; setup and core services depended on a supported paired iPhone.",
        citations: [c(U.watchLaunch, "Requirements")],
      }),
    ],
  }),
  release({
    id: "version-watchos-2-0",
    releaseNotesUrl: U.watchNotes,
    overview:
      "watchOS 2.0 reached the public channel on September 21, 2015. It expanded watch faces, timekeeping, communications, maps, music, Wallet, fitness, localization, security, and developer access while moving third-party app execution onto Apple Watch.",
    overviewCitations: [
      c(U.watchNotes, "watchOS 2.0"),
      c(U.watch2Preview, "watchOS 2 feature and WatchKit sections"),
      c(U.watch2Security, "watchOS 2 security content"),
      c(U.securityIndex, "watchOS 2 — 21 Sep 2015"),
    ],
    boundary:
      "Apple announced September 16 as the planned availability date on September 9, but its surviving dated security record places the actual public release on September 21. This page uses the audited September 21 date and treats the earlier announcement only as a superseded plan.",
    boundaryCitations: [
      c(U.watch2Planned, "Planned September 16 availability"),
      c(U.securityIndex, "watchOS 2 — 21 Sep 2015"),
    ],
    pageCitations: [
      c(U.watchNotes, "watchOS 2.0"),
      c(U.watch2Preview, "watchOS 2 preview"),
      c(U.watch2Planned, "Planned September 16 availability"),
      c(U.watch2Security, "watchOS 2 security content"),
      c(U.securityIndex, "watchOS 2 — 21 Sep 2015"),
    ],
    summary:
      "watchOS 2.0 reached the public channel on September 21, 2015 with major timekeeping, app, communication, fitness, service, localization, developer, and security changes.",
    publicText:
      "Apple's security-update index dates watchOS 2 to September 21, 2015. The September 9 announcement's September 16 date was a pre-release plan and is not used as the public event date.",
    publicCitations: [
      c(U.securityIndex, "watchOS 2 — 21 Sep 2015"),
      c(U.watch2Planned, "Planned September 16 availability"),
    ],
    scopeText:
      "The structured entries follow Apple's retained watchOS 2.0 consumer section, launch preview, and matching advisory. They exclude 2.0.1 fixes, beta behavior, and hardware or service availability not supported in every region.",
    scopeCitations: [
      c(U.watchNotes, "watchOS 2.0 through watchOS 2.0.1"),
      c(U.watch2Preview, "Availability and regional qualifications"),
      c(U.watch2Security, "watchOS 2 security content"),
    ],
    changes: [
      change({
        key: "watchos-2-0-new-faces-live-photos",
        title: "Time-Lapse, Photo, Photo Album, and Live Photo faces",
        canonicalSummary:
          "watchOS 2 added location time-lapses and personal photo faces, including Live Photo display.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could choose animated city imagery or rotate through their own photos when raising the wrist.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — New watch faces"),
          c(U.watch2Preview, "New Apple Watch Features"),
        ],
      }),
      change({
        key: "watchos-2-0-time-travel",
        title: "Time Travel",
        canonicalSummary:
          "Turning the Digital Crown could move complication information backward or forward in time.",
        category: "feature",
        action: "introduced",
        summary:
          "The watch face became a temporal browser for upcoming events, recent headlines, weather, and supported third-party information.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Time Travel"),
          c(U.watch2Preview, "Time Travel"),
        ],
      }),
      change({
        key: "watchos-2-0-nightstand-customization",
        title: "Nightstand Mode and expanded face colors",
        canonicalSummary:
          "watchOS 2 added a bedside alarm display plus additional face colors and a multicolor Modular face.",
        category: "feature",
        action: "introduced",
        summary:
          "Charging Apple Watch on its side exposed a clock and alarm interface, while face customization gained a wider color palette.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Nightstand Mode and colors"),
          c(U.watch2Preview, "Nightstand Mode"),
        ],
      }),
      change({
        key: "watchos-2-0-third-party-complications",
        title: "Third-party complications",
        canonicalSummary:
          "Third-party apps could place timely information directly on supported watch faces.",
        category: "developerApi",
        action: "introduced",
        summary:
          "ClockKit opened the complication surface to app data, reducing the need to launch an app for short, frequently changing information.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — third-party complications"),
          c(U.watch2Preview, "WatchKit and ClockKit"),
        ],
      }),
      change({
        key: "watchos-2-0-siri-expansion",
        title: "Expanded Siri actions",
        canonicalSummary:
          "Siri could start workouts, provide transit directions, open Glances, support HomeKit control, and assist with calls or email.",
        category: "enhancement",
        action: "changed",
        summary:
          "The assistant gained more watch-specific commands and additional regional availability.",
        citations: [c(U.watchNotes, "watchOS 2.0 — Siri improvements")],
      }),
      change({
        key: "watchos-2-0-activity-workout",
        title: "Activity and Workout expansion",
        canonicalSummary:
          "Third-party workouts could contribute to Activity rings, while sharing, achievements, summaries, notification controls, and automatic saving expanded.",
        category: "enhancement",
        action: "changed",
        summary:
          "Fitness data from supported apps joined system goals and the Activity app gained richer review, sharing, and completion workflows.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Activity and Workout improvements"),
          c(U.watch2Preview, "Third-party fitness workouts"),
        ],
      }),
      change({
        key: "watchos-2-0-wallet-apple-pay",
        title: "Wallet and Apple Pay expansion",
        canonicalSummary:
          "watchOS 2 added Discover support, merchant rewards, store cards, and direct pass additions from watch apps.",
        category: "enhancement",
        action: "changed",
        summary:
          "The payment and pass system broadened supported card types and let compatible apps place passes into Wallet from the watch.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Apple Pay and Wallet"),
          c(U.watch2Preview, "Merchant rewards and store cards"),
        ],
      }),
      change({
        key: "watchos-2-0-friends-digital-touch",
        title: "Friends groups and richer Digital Touch",
        canonicalSummary:
          "Users could manage more than twelve friends in named groups and send multicolor sketches or additional animated emoji.",
        category: "enhancement",
        action: "changed",
        summary:
          "The contacts and wrist-messaging surfaces became more scalable and offered broader visual expression.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Friends and Digital Touch"),
          c(U.watch2Preview, "Mail, Friends, and Digital Touch"),
        ],
      }),
      change({
        key: "watchos-2-0-maps-transit",
        title: "Transit information in Maps",
        canonicalSummary:
          "Maps added transit lines, stations, route steps, and departure information in supported cities.",
        category: "feature",
        action: "introduced",
        summary:
          "Public-transport navigation became available on the wrist with regional limits retained from Apple's launch documentation.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Maps improvements"),
          c(U.watch2Preview, "Transit in Maps and city qualification"),
        ],
      }),
      change({
        key: "watchos-2-0-music-controls",
        title: "Beats 1 and Quick Play",
        canonicalSummary:
          "The Music app added one-tap access to Beats 1 and a Quick Play path for Apple Music selections.",
        category: "enhancement",
        action: "changed",
        summary:
          "watchOS made live radio and personalized music playback more direct from the wrist.",
        citations: [c(U.watchNotes, "watchOS 2.0 — Music improvements")],
      }),
      change({
        key: "watchos-2-0-communications",
        title: "Email replies, FaceTime Audio, and Wi-Fi calling",
        canonicalSummary:
          "watchOS 2 added richer email replies, FaceTime Audio calling, and carrier-dependent Wi-Fi calling without a nearby iPhone.",
        category: "enhancement",
        action: "changed",
        summary:
          "Communication workflows gained dictation, emoji, and smart-reply options plus broader voice calling when supported by the network and carrier.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — email, FaceTime, and Wi-Fi calling"),
        ],
      }),
      change({
        key: "watchos-2-0-activation-lock",
        title: "Activation Lock",
        canonicalSummary:
          "Activation Lock required the owner's Apple ID and password before Apple Watch could be reactivated.",
        category: "security",
        action: "introduced",
        summary:
          "The release added an ownership barrier intended to deter reuse after a watch was lost, stolen, erased, or reset.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Activation Lock"),
          c(U.watch2Preview, "Activation Lock"),
        ],
      }),
      change({
        key: "watchos-2-0-native-sdk",
        title: "Native WatchKit app execution",
        canonicalSummary:
          "WatchKit extensions could run on Apple Watch instead of executing primarily on the paired iPhone.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The new native SDK reduced dependence on round trips to iPhone and supported faster, more capable third-party watch apps.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — Native SDK"),
          c(U.watch2Preview, "WatchKit for watchOS 2"),
        ],
      }),
      change({
        key: "watchos-2-0-hardware-media-network-apis",
        title: "Watch hardware, media, and networking APIs",
        canonicalSummary:
          "Developers gained access to motion and heart-rate sensors, audio, haptics, the Digital Crown, video, known Wi-Fi networking, complications, and workout integration.",
        category: "developerApi",
        action: "introduced",
        summary:
          "watchOS 2 exposed substantially more of the device to native apps while keeping individual capabilities subject to API and usage constraints.",
        citations: [
          c(U.watchNotes, "watchOS 2.0 — New developer capabilities"),
          c(U.watch2Preview, "WatchKit hardware and software APIs"),
        ],
      }),
      change({
        key: "watchos-2-0-language-expansion",
        title: "Expanded interface, dictation, and smart-reply languages",
        canonicalSummary:
          "watchOS 2 added system languages and numerous regional dictation and smart-reply variants.",
        category: "enhancement",
        action: "changed",
        summary:
          "The release broadened localized interface coverage and speech or canned-response support across Europe and Asia-Pacific regions.",
        citations: [c(U.watchNotes, "watchOS 2.0 — language support")],
      }),
      securityChange({
        key: "watchos-2-0-payment-network-trust-security",
        title: "Payment, networking, trust, and cryptography repairs",
        canonicalSummary:
          "watchOS 2 repaired issues involving Apple Pay transaction history, TLS validation, proxy and cookie handling, certificates, and RSA operations.",
        summary:
          "Apple's advisory documents stronger privacy, authentication, transport, and cryptographic boundaries across payment and network services.",
        url: U.watch2Security,
        locator:
          "Apple Pay; Certificate Trust Policy; CFNetwork; CoreCrypto",
      }),
      securityChange({
        key: "watchos-2-0-kernel-code-security",
        title: "Kernel, code-signing, and system privilege repairs",
        canonicalSummary:
          "watchOS 2 addressed memory corruption, information disclosure, entitlement, code-signing, and denial-of-service risks in the kernel and low-level services.",
        summary:
          "The documented fixes strengthened executable validation, privileged component boundaries, kernel memory handling, storage, graphics, and input subsystems.",
        url: U.watch2Security,
        locator:
          "Dev Tools through IOMobileFrameBuffer; IOStorageFamily; Kernel; libpthread; PluginKit",
      }),
      securityChange({
        key: "watchos-2-0-content-library-security",
        title: "Content parsing and bundled library repairs",
        canonicalSummary:
          "watchOS 2 repaired vulnerabilities in audio, fonts, text detection, disk images, ICU, SQLite, archives, and HTML cleanup.",
        summary:
          "Apple's advisory records memory-safety, bounds-checking, validation, and library-version updates across several data-processing surfaces.",
        url: U.watch2Security,
        locator:
          "Audio; CoreText; Data Detectors Engine; Disk Images; ICU; removefile; SQLite; tidy",
      }),
    ],
  }),
  release({
    id: "version-watchos-2-1",
    releaseNotesUrl: U.watchNotes,
    overview:
      "watchOS 2.1 was released on December 8, 2015 with substantial language and bidirectional-interface expansion, calendar additions, targeted fixes for complications, Power Reserve, third-party apps, and language switching, plus version-specific security repairs.",
    overviewCitations: [
      c(U.watchNotes, "watchOS 2.1"),
      c(U.watch21Security, "watchOS 2.1 security content"),
      c(U.securityIndex, "watchOS 2.1 — 8 Dec 2015"),
    ],
    boundary:
      "This page follows only the watchOS 2.1 section of Apple's cumulative 2.x history. It does not import 2.0.1 fixes or later 2.2 additions, and it treats the current security page as a living advisory that may contain later edits.",
    boundaryCitations: [
      c(U.watchNotes, "watchOS 2.0.1 through watchOS 2.2"),
      c(U.watch21Security, "watchOS 2.1; later entry-update note"),
    ],
    pageCitations: [
      c(U.watchNotes, "watchOS 2.1"),
      c(U.watch21Security, "watchOS 2.1 security content"),
      c(U.securityIndex, "watchOS 2.1 — 8 Dec 2015"),
    ],
    summary:
      "watchOS 2.1 reached the public channel on December 8, 2015 with language, bidirectional layout, calendar, complication, app, stability, and security changes.",
    publicText:
      "Apple's security-update index dates watchOS 2.1 to December 8, 2015. The retained consumer history provides the matching ordinary feature and fix list.",
    publicCitations: [
      c(U.securityIndex, "watchOS 2.1 — 8 Dec 2015"),
      c(U.watchNotes, "watchOS 2.1"),
    ],
    scopeText:
      "The structured entries preserve Apple's named symptoms and language qualifications. Security summaries group documented attack surfaces without turning component names into unsupported user-facing behavior.",
    scopeCitations: [
      c(U.watchNotes, "watchOS 2.1"),
      c(U.watch21Security, "watchOS 2.1 security content"),
    ],
    changes: [
      change({
        key: "watchos-2-1-system-languages",
        title: "Eight additional system languages",
        canonicalSummary:
          "watchOS added Arabic, Czech, Greek, Hebrew, Hungarian, Malay, European Portuguese, and Vietnamese as system languages.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update substantially broadened the set of languages available for the watch interface itself.",
        citations: [c(U.watchNotes, "watchOS 2.1 — system language")],
      }),
      change({
        key: "watchos-2-1-rtl-calendars-numerals",
        title: "Right-to-left layout, numeral choices, and calendar complications",
        canonicalSummary:
          "watchOS 2.1 added a right-to-left interface, Latin or Hindi numeral selection for Arabic, and Islamic and Hebrew calendar complications.",
        category: "feature",
        action: "introduced",
        summary:
          "The localized interface extended beyond translation to writing direction, number presentation, and culturally relevant date display.",
        citations: [
          c(U.watchNotes, "watchOS 2.1 — RTL, numerals, and calendars"),
        ],
      }),
      change({
        key: "watchos-2-1-siri-dictation-languages",
        title: "Expanded Siri and dictation languages",
        canonicalSummary:
          "Siri and dictation added Arabic variants, while dictation expanded to additional English and European or Asian languages.",
        category: "enhancement",
        action: "changed",
        summary:
          "Speech interaction coverage grew for users in Saudi Arabia, the United Arab Emirates, Malaysia, and several newly localized markets.",
        citations: [c(U.watchNotes, "watchOS 2.1 — Siri and dictation")],
      }),
      change({
        key: "watchos-2-1-calendar-complication-fix",
        title: "Calendar complication refresh fix",
        canonicalSummary:
          "The update fixed a condition that could stop events from updating in the Calendar complication.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Calendar information on the watch face was made more reliable when underlying event data changed.",
        citations: [c(U.watchNotes, "watchOS 2.1 — Calendar complication")],
      }),
      change({
        key: "watchos-2-1-power-reserve-time-fix",
        title: "Power Reserve time display fix",
        canonicalSummary:
          "watchOS 2.1 fixed a condition that could prevent the time from appearing in Power Reserve mode.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The low-power fallback was corrected so its essential clock display would remain available.",
        citations: [c(U.watchNotes, "watchOS 2.1 — Power Reserve")],
      }),
      change({
        key: "watchos-2-1-third-party-app-fixes",
        title: "Third-party launch and icon fixes",
        canonicalSummary:
          "The update addressed failures to launch third-party apps and incorrect third-party app icon display.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Installed app access and visual identification were made more reliable across the launcher and execution path.",
        citations: [c(U.watchNotes, "watchOS 2.1 — third-party apps")],
      }),
      change({
        key: "watchos-2-1-language-change-stability",
        title: "System-language change stability",
        canonicalSummary:
          "watchOS 2.1 fixed instability that could occur when changing the system language.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The update hardened a setup and personalization path that became more important as language support expanded.",
        citations: [c(U.watchNotes, "watchOS 2.1 — language stability")],
      }),
      securityChange({
        key: "watchos-2-1-sandbox-access-security",
        title: "Sandbox and application-access repairs",
        canonicalSummary:
          "watchOS 2.1 repaired sandbox, access-control, trust-cache, and application-launch validation issues.",
        summary:
          "Apple's advisory documents stronger revocation behavior, privilege separation, access control, and validation around apps and system services.",
        url: U.watch21Security,
        locator:
          "AppSandbox; dyld; LaunchServices; MobileStorageMounter; Sandbox",
      }),
      securityChange({
        key: "watchos-2-1-content-parsing-security",
        title: "Media, font, image, archive, and graphics repairs",
        canonicalSummary:
          "watchOS 2.1 repaired memory-safety and validation problems across compressed data, fonts, media, images, archives, graphics, and libraries.",
        summary:
          "The documented changes reduced code-execution and disclosure risks from malformed content processed by multiple platform components.",
        url: U.watch21Security,
        locator:
          "Compression; CoreGraphics; CoreMedia Playback; FontParser; ImageIO; libarchive; libc; OpenGL",
      }),
      securityChange({
        key: "watchos-2-1-kernel-io-security",
        title: "Kernel and I/O security repairs",
        canonicalSummary:
          "watchOS 2.1 addressed memory corruption, denial-of-service, validation, and privilege risks in the kernel and hardware-facing services.",
        summary:
          "Apple's advisory records fixes across power, human-interface, storage, graphics, and kernel message-processing paths.",
        url: U.watch21Security,
        locator:
          "GasGauge; IOHIDFamily; IOKit SCSI; Kernel; mDNSResponder",
      }),
      securityChange({
        key: "watchos-2-1-tls-certificate-security",
        title: "TLS, certificate, revocation, and keychain repairs",
        canonicalSummary:
          "watchOS 2.1 repaired SSL handshake, ASN.1 certificate parsing, revocation checking, and keychain access-control issues.",
        summary:
          "The release strengthened transport and identity validation against remote crashes, code execution, incorrect trust decisions, and unauthorized credential access.",
        url: U.watch21Security,
        locator: "Security entries",
      }),
    ],
  }),
  release({
    id: "version-tvos-9-0",
    releaseNotesUrl: U.tvLaunch,
    overview:
      "The local catalog treats tvOS 9.0 as the launch software for the fourth-generation Apple TV in late October 2015. The platform introduced an app-based television interface, Siri and touch-first remote interaction, a dedicated App Store, and an iOS-derived SDK for television apps and games.",
    overviewCitations: [
      c(U.tvLaunch, "tvOS, App Store, Siri Remote, and SDK sections"),
      c(U.tv90Sdk, "Introduction; Notes and Known Issues"),
      c(U.tvShipping, "All-new Apple TV begins shipping this week"),
    ],
    boundary:
      "Apple announced end-of-October hardware availability and said on October 27 that the new Apple TV would begin shipping that week. The local audited software route is October 29; this page does not claim that date was a separate over-the-air update or an exact universal retail date, and Apple's 2015 security index contains no tvOS 9.0 entry.",
    boundaryCitations: [
      c(U.tvLaunch, "Pricing & Availability"),
      c(U.tvShipping, "All-new Apple TV begins shipping this week"),
      c(U.securityIndex, "2015 list; tvOS 9.1 is the first tvOS entry"),
    ],
    pageCitations: [
      c(U.tvLaunch, "All-new Apple TV and tvOS announcement"),
      c(U.tv90Sdk, "tvOS SDK 9.0"),
      c(U.tvShipping, "All-new Apple TV shipping week"),
      c(U.securityIndex, "tvOS 9.1 — 8 Dec 2015"),
    ],
    summary:
      "The audited tvOS 9.0 public route records the late-October 2015 launch baseline for fourth-generation Apple TV, including its app, Siri, remote, graphics, game, setup, and developer-platform changes.",
    publicText:
      "Apple positioned tvOS as software on the all-new Apple TV, announced hardware availability for the end of October, and confirmed on October 27 that shipping would begin that week. The audited route date is October 29.",
    publicCitations: [
      c(U.tvLaunch, "Pricing & Availability"),
      c(U.tvShipping, "All-new Apple TV begins shipping this week"),
    ],
    scopeText:
      "The structured entries cover software-visible launch capabilities and final tvOS SDK 9.0 notes. Hardware details appear only where they define input or app capability, and no security repair set is inferred for this launch baseline.",
    scopeCitations: [
      c(U.tvLaunch, "Siri Remote through tvOS SDK"),
      c(U.tv90Sdk, "Introduction; Metal; Parallax Images; Setup"),
      c(U.securityIndex, "2015 security-update list"),
    ],
    changes: [
      change({
        key: "tvos-9-0-app-store-platform",
        title: "App-based television and Apple TV App Store",
        canonicalSummary:
          "tvOS introduced downloadable television apps and games through a dedicated Apple TV App Store.",
        category: "feature",
        action: "introduced",
        summary:
          "The fourth-generation product moved Apple TV beyond a fixed channel set by making third-party software a primary part of the home-screen experience.",
        citations: [c(U.tvLaunch, "App Store and tvOS")],
      }),
      change({
        key: "tvos-9-0-siri-remote-touch",
        title: "Touch-first Siri Remote navigation",
        canonicalSummary:
          "The Siri Remote used a glass touch surface for fine or sweeping selection, scrolling, and navigation.",
        category: "feature",
        action: "introduced",
        summary:
          "tvOS paired its interface with a remote input model designed around gestures rather than only directional buttons.",
        citations: [c(U.tvLaunch, "Siri Remote touch surface")],
      }),
      change({
        key: "tvos-9-0-remote-motion-games",
        title: "Remote motion input for apps and games",
        canonicalSummary:
          "Developers could use the Siri Remote touch surface, accelerometer, and gyroscope in interactive software.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The launch platform exposed multiple remote sensors so games and apps could interpret movement as well as touch.",
        citations: [c(U.tvLaunch, "Siri Remote accelerometer and gyroscope")],
      }),
      change({
        key: "tvos-9-0-siri-cross-provider-search",
        title: "Cross-provider Siri search",
        canonicalSummary:
          "Siri could search movies and television by several attributes across iTunes and participating video apps.",
        category: "feature",
        action: "introduced",
        summary:
          "Voice queries could use title, genre, cast, crew, rating, or popularity and return viewing options from multiple supported providers.",
        citations: [c(U.tvLaunch, "Siri search")],
      }),
      change({
        key: "tvos-9-0-siri-playback-navigation",
        title: "Siri playback, navigation, and information controls",
        canonicalSummary:
          "Siri provided playback control, on-screen navigation, and quick access to sports, stocks, and weather.",
        category: "feature",
        action: "introduced",
        summary:
          "The voice interface extended beyond discovery into controlling content and retrieving concise reference information, subject to regional limits.",
        citations: [
          c(U.tvLaunch, "Siri playback, navigation, and information"),
        ],
      }),
      change({
        key: "tvos-9-0-ios-derived-sdk",
        title: "Dedicated tvOS SDK",
        canonicalSummary:
          "Apple introduced a distinct tvOS SDK derived from familiar iOS frameworks and delivered with Xcode tools and Instruments.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Developers gained a television-specific platform while retaining many technologies and workflows from iOS development.",
        citations: [
          c(U.tvLaunch, "tvOS SDK"),
          c(U.tv90Sdk, "Introduction"),
        ],
      }),
      change({
        key: "tvos-9-0-metal-game-center",
        title: "Metal and Game Center on tvOS",
        canonicalSummary:
          "tvOS launched with Metal graphics and Game Center support for games and social play.",
        category: "developerApi",
        action: "introduced",
        summary:
          "The new platform brought Apple graphics and game-service technologies to television apps on the A8-based hardware.",
        citations: [c(U.tvLaunch, "Metal and Game Center")],
      }),
      change({
        key: "tvos-9-0-bitcode-framework-requirements",
        title: "tvOS-specific frameworks and required bitcode",
        canonicalSummary:
          "All app libraries and frameworks had to be built for tvOS, and app bundles were required to include bitcode.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The SDK established a distinct binary target and packaging requirement rather than accepting unmodified iOS framework builds.",
        citations: [c(U.tv90Sdk, "Introduction")],
      }),
      change({
        key: "tvos-9-0-metal-feature-set",
        title: "tvOS-specific Metal feature set",
        canonicalSummary:
          "Metal development on tvOS required the television-platform GPU feature-set identifier.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Graphics code had to select the tvOS GPU family rather than assuming an iOS or macOS Metal capability profile.",
        citations: [c(U.tv90Sdk, "Metal — Note")],
      }),
      change({
        key: "tvos-9-0-parallax-image-tooling",
        title: "Layered parallax image tooling",
        canonicalSummary:
          "The final SDK improved the performance, size, and accuracy of layered LCR images used by tvOS.",
        category: "developerApi",
        action: "changed",
        summary:
          "Apple directed developers to regenerate parallax assets with the final tooling so focused artwork would use the improved representation.",
        citations: [c(U.tv90Sdk, "Parallax Images — Note")],
      }),
      change({
        key: "tvos-9-0-tap-to-setup-compatibility",
        title: "Tap To Setup required iOS 9.1 or later",
        canonicalSummary:
          "The Tap To Setup path depended on a nearby device running iOS 9.1 or later.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Apple documented an explicit companion-device software floor for the streamlined initial setup workflow.",
        citations: [c(U.tv90Sdk, "Setup — Note")],
      }),
      change({
        key: "tvos-9-0-fourth-generation-boundary",
        title: "Fourth-generation Apple TV launch boundary",
        canonicalSummary:
          "tvOS 9.0 was delivered as the software platform of the all-new fourth-generation Apple TV rather than to earlier Apple TV models.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The launch software was tied to the new hardware, Siri Remote, App Store, and A8 platform described in Apple's announcement.",
        citations: [
          c(U.tvLaunch, "All-new Apple TV hardware and tvOS"),
          c(U.tvShipping, "All-new Apple TV begins shipping this week"),
        ],
      }),
    ],
  }),
  release({
    id: "version-tvos-9-1",
    releaseNotesUrl: U.tv91Sdk,
    overview:
      "tvOS 9.1 was released on December 8, 2015 for fourth-generation Apple TV. Apple's surviving first-party record is technical rather than consumer-facing, documenting networking and UIKit behavior together with broad application-integrity, content-processing, kernel, transport, credential, graphics, and web security repairs.",
    overviewCitations: [
      c(U.tv91Sdk, "Introduction; Networking; UIKit"),
      c(U.tv91Security, "tvOS 9.1 security content"),
      c(U.securityIndex, "tvOS 9.1 — 8 Dec 2015"),
    ],
    boundary:
      "Apple's current consumer Apple TV update history begins at tvOS 11, and no retained version-labeled consumer narrative for 9.1 was found. This page therefore does not assert remembered user-facing additions such as media-service or remote-app changes without a surviving first-party version source.",
    boundaryCitations: [
      c(U.tv91Sdk, "tvOS SDK Release Notes for tvOS 9.1"),
      c(U.tv91Security, "tvOS 9.1 security content"),
    ],
    pageCitations: [
      c(U.tv91Sdk, "tvOS SDK Release Notes for tvOS 9.1"),
      c(U.tv91Security, "tvOS 9.1 security content"),
      c(U.securityIndex, "tvOS 9.1 — 8 Dec 2015"),
    ],
    summary:
      "tvOS 9.1 reached the public channel on December 8, 2015 with documented networking and UIKit behavior changes plus extensive security repairs for fourth-generation Apple TV.",
    publicText:
      "Apple's security-update index dates tvOS 9.1 to December 8, 2015 and limits availability to fourth-generation Apple TV. The archived SDK notes carry the same December 8 update date.",
    publicCitations: [
      c(U.securityIndex, "tvOS 9.1 — 8 Dec 2015"),
      c(U.tv91Sdk, "Updated: 2015-12-08"),
    ],
    scopeText:
      "The structured entries include only positive technical notes from the final SDK record and grouped repairs from the matching advisory. SDK known issues are not presented as shipped improvements, and unsupported consumer-feature claims are excluded.",
    scopeCitations: [
      c(U.tv91Sdk, "Notes and Known Issues — Networking and UIKit notes"),
      c(U.tv91Security, "tvOS 9.1 security content"),
    ],
    changes: [
      change({
        key: "tvos-9-1-ecn-default",
        title: "Explicit Congestion Notification enabled by default",
        canonicalSummary:
          "tvOS 9.1 enabled Explicit Congestion Notification by default on Ethernet and Wi-Fi.",
        category: "behavior",
        action: "changed",
        summary:
          "The networking stack began using ECN by default to help reduce network delay and packet loss on compatible paths.",
        citations: [c(U.tv91Sdk, "Networking — Notes")],
      }),
      change({
        key: "tvos-9-1-nat64-synthesis",
        title: "NAT64 address synthesis",
        canonicalSummary:
          "The getaddrinfo networking API gained the ability to synthesize NAT64 IPv6 addresses from IPv4 literals.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Apps gained a system path for adapting literal IPv4 destinations when operating on IPv6-only networks that provide NAT64.",
        citations: [c(U.tv91Sdk, "Networking — Notes")],
      }),
      change({
        key: "tvos-9-1-focus-scroll-run-loop",
        title: "Focus-driven scroll run-loop behavior",
        canonicalSummary:
          "Focus-triggered scroll-view movement switched the run loop into tracking mode until scrolling completed.",
        category: "developerApi",
        action: "changed",
        summary:
          "UIKit aligned focus-driven scrolling with tracking-mode behavior, changing the execution context observed by app code during the animation.",
        citations: [c(U.tv91Sdk, "UIKit — Note")],
      }),
      securityChange({
        key: "tvos-9-1-app-integrity-security",
        title: "Application integrity and code-loading repairs",
        canonicalSummary:
          "tvOS 9.1 repaired access-control, dynamic-loader, trust-cache, and system-privilege weaknesses affecting application integrity.",
        summary:
          "Apple's advisory documents stronger validation of executable segments, access-control structures, and trusted code-loading state.",
        url: U.tv91Security,
        locator:
          "AppleMobileFileIntegrity; dyld; MobileStorageMounter",
      }),
      securityChange({
        key: "tvos-9-1-content-parsing-security",
        title: "Media, font, image, archive, and compression repairs",
        canonicalSummary:
          "tvOS 9.1 repaired memory-safety and validation problems in compressed data, fonts, media, disk images, images, archives, XML, and system libraries.",
        summary:
          "Malformed content attack surfaces received input-validation, initialization, bounds-checking, and memory-handling improvements.",
        url: U.tv91Security,
        locator:
          "Compression; CoreGraphics; CoreMedia Playback; Disk Images; ImageIO; libarchive; libc; libxml2",
      }),
      securityChange({
        key: "tvos-9-1-kernel-io-security",
        title: "Kernel, input, graphics, and I/O repairs",
        canonicalSummary:
          "tvOS 9.1 addressed code execution, privilege, and denial-of-service risks in the kernel and hardware-facing services.",
        summary:
          "The version-specific advisory records memory-handling and validation fixes across IOAcceleratorFamily, IOHIDFamily, IOKit SCSI, and kernel message or memory paths.",
        url: U.tv91Security,
        locator:
          "IOAcceleratorFamily; IOHIDFamily; IOKit SCSI; Kernel",
      }),
      securityChange({
        key: "tvos-9-1-transport-credential-security",
        title: "TLS, certificate, and keychain repairs",
        canonicalSummary:
          "tvOS 9.1 repaired SSL handshake, ASN.1 certificate parsing, and keychain access-control vulnerabilities.",
        summary:
          "The security changes reduced remote code-execution or crash risk and strengthened protection against unauthorized credential access.",
        url: U.tv91Security,
        locator: "Security entries",
      }),
      securityChange({
        key: "tvos-9-1-web-graphics-security",
        title: "WebKit and OpenGL repairs",
        canonicalSummary:
          "tvOS 9.1 repaired multiple memory-corruption vulnerabilities in WebKit and OpenGL processing.",
        summary:
          "Apple's advisory documents improved memory handling for malformed web or graphics content that could otherwise enable code execution.",
        url: U.tv91Security,
        locator: "OpenGL; WebKit",
      }),
    ],
  }),
];

const releaseOrder = [
  "version-macos-10-11",
  "version-watchos-1-0",
  "version-watchos-2-0",
  "version-watchos-2-1",
  "version-tvos-9-0",
  "version-tvos-9-1",
];
records.sort(
  (left, right) =>
    releaseOrder.indexOf(left.version.releaseVersionId) -
    releaseOrder.indexOf(right.version.releaseVersionId),
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const platformSlug = {
  macOS: "macos",
  watchOS: "watchos",
  tvOS: "tvos",
};
const eligibleSeedRecords = seed.releaseVersions
  .filter(
    (item) =>
      platformSlug[item.platform] &&
      item.publicReleaseDate?.startsWith("2015-"),
  )
  .map((item) => ({
    ...item,
    id: `version-${platformSlug[item.platform]}-${item.version.replaceAll(".", "-")}`,
  }))
  .sort((left, right) => left.id.localeCompare(right.id));
const expectedIds = [...releaseOrder].sort();
const actualIds = eligibleSeedRecords.map((item) => item.id);
assert(
  JSON.stringify(actualIds) === JSON.stringify(expectedIds),
  `2015 seed closure changed: expected ${expectedIds.join(", ")}, received ${actualIds.join(", ")}.`,
);
for (const item of eligibleSeedRecords) {
  const publicMilestones = item.milestones.filter(
    (milestone) => milestone.label === "Public",
  );
  assert(
    publicMilestones.length === 1 &&
      publicMilestones[0].date === item.publicReleaseDate,
    `${item.id} does not have one same-date Public milestone.`,
  );
}
const milestoneCount = eligibleSeedRecords.reduce(
  (sum, item) => sum + item.milestones.length,
  0,
);
const publicMilestoneCount = eligibleSeedRecords.reduce(
  (sum, item) =>
    sum +
    item.milestones.filter((milestone) => milestone.label === "Public").length,
  0,
);
assert(milestoneCount === 18, `Expected 18 milestones, found ${milestoneCount}.`);
assert(
  publicMilestoneCount === 6,
  `Expected 6 public milestones, found ${publicMilestoneCount}.`,
);

const versions = records.map((record) => record.version);
const events = records.map((record) => record.event);
const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions,
  events,
  builds: [],
};
const jsonText = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync(join(here, "apple-other-2015.json"), jsonText);

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

function citationReferenceCount(value) {
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + citationReferenceCount(item), 0);
  }
  if (!value || typeof value !== "object") return 0;

  return Object.entries(value).reduce((sum, [key, item]) => {
    if (key === "citations" && Array.isArray(item)) return sum + item.length;
    return sum + citationReferenceCount(item);
  }, 0);
}

function citedSourceUrls(value, urls = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) citedSourceUrls(item, urls);
    return urls;
  }
  if (!value || typeof value !== "object") return urls;

  for (const [key, item] of Object.entries(value)) {
    if (key === "citations" && Array.isArray(item)) {
      for (const citation of item) urls.add(citation.url);
    } else {
      citedSourceUrls(item, urls);
    }
  }
  return urls;
}

const citedUrls = citedSourceUrls(bundle);
const unusedSources = sources.filter((source) => !citedUrls.has(source.url));
assert(
  unusedSources.length === 0,
  `Declared sources are unused: ${unusedSources.map((source) => source.url).join(", ")}.`,
);

const citationReferences = citationReferenceCount(bundle);
const bundleSha = createHash("sha256").update(jsonText).digest("hex");

const md = `# Apple 2015 non-iPhone research batch

## Result

\`apple-other-2015.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in calendar 2015. It contains original synthesis with claim-level citations and no copied release-note prose.

## Exact local coverage

| Platform family | Existing versions covered | Public appearances | Structured changes |
| --- | --- | ---: | ---: |
| macOS | 10.11 | 1 | ${platformChangeCount("macos")} |
| watchOS | 1.0, 2.0, 2.1 | 3 | ${platformChangeCount("watchos")} |
| tvOS | 9.0, 9.1 | 2 | ${platformChangeCount("tvos")} |
| **Total** | **6 version articles** | **${events.length}** | **${eventChanges}** |

The six versions contain ${milestoneCount} existing local timeline milestones: ${publicMilestoneCount} public appearances and ${milestoneCount - publicMilestoneCount} beta, golden-master, and other non-public milestones. This bundle enriches only the six durable public routes through \`releaseVersionId\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- All 12 version/event records are \`editoriallyVerified\` and \`approved\` as of ${reviewedAt}.
- All public events are indexable after editorial approval.
- Every change is \`documented\`, \`confirmed\`, and a public-release \`delta\`.
- No undocumented-change claim is included.
- No beta note or later cumulative change is projected backward.
- No build record is included; no build number is inferred.
- Security changes summarize attack surfaces and remediation classes without reproducing advisory prose.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory, date, and hardware boundaries

1. Seed closure is exact: macOS 10.11; watchOS 1.0, 2.0, and 2.1; and tvOS 9.0 and 9.1 are the only existing non-iOS/iPadOS records with audited public dates in 2015.
2. The watchOS 1.0 route uses April 24 because the local audit maps the preinstalled launch software to original Apple Watch availability. Apple's launch material describes an integrated hardware-and-software product rather than a separately downloadable 1.0 update.
3. Apple's 2015 security index starts watch software coverage at Watch OS 1.0.1 on May 19. The bundle therefore makes no security-repair claim for watchOS 1.0.
4. Apple announced September 16 as the planned watchOS 2 date. Its surviving dated security record places the actual release on September 21, matching the audited seed; September 16 is documented only as a superseded plan.
5. The tvOS 9.0 route uses the seed's October 29 software date. Apple announced the new Apple TV for the end of October and said on October 27 that shipping would begin that week, but did not publish a retained page proving October 29 as a separate OTA or universal retail date.
6. tvOS 9.0 is therefore represented as the preinstalled launch platform for fourth-generation Apple TV. Apple's 2015 security index begins tvOS coverage with 9.1, so no 9.0 security repair set is inferred.
7. The existing-record-only catalog omits Apple-documented 2015 version identities including Watch OS 1.0.1, watchOS 2.0.1, OS X 10.11.1, and OS X 10.11.2. This bundle creates none of them.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple pages checked on ${accessedAt}.

### Cross-platform chronology

- <${U.securityIndex}> — Apple's dated 2015 security-release index, including actual dates and locally absent point releases

### macOS

- <${U.macNews}> — El Capitan availability, features, compatibility, and performance qualifications
- <${U.macSecurity}> — detailed El Capitan 10.11 security content

### watchOS

- <${U.watchLaunch}> — original Apple Watch availability and launch software-visible capabilities
- <${U.watchNotes}> — retained watchOS 2.0 and 2.1 consumer notes
- <${U.watch2Preview}> — watchOS 2 feature and WatchKit context
- <${U.watch2Planned}> — the superseded September 16 availability plan
- <${U.watch2Security}> — watchOS 2 security content
- <${U.watch21Security}> — watchOS 2.1 security content

### tvOS

- <${U.tvLaunch}> — all-new Apple TV, tvOS, Siri Remote, App Store, and SDK launch context
- <${U.tvShipping}> — Apple's October 27 statement that the new Apple TV would begin shipping that week
- <${U.tv90Sdk}> — archived final tvOS 9.0 SDK notes
- <${U.tv91Sdk}> — archived final tvOS 9.1 SDK notes
- <${U.tv91Security}> — tvOS 9.1 security content

Apple Support pages are living documents and may show revision dates later than the historical release. Mapping uses each explicitly labeled version section and the dated security index; archived SDK documents retain their original update dates.

## Known gaps

1. The four named Apple-documented 2015 point-version identities absent from the local catalog remain out of scope until a separate inventory expansion creates durable version and event records.
2. No retained Apple security record was found for the watchOS 1.0 or tvOS 9.0 launch baselines, so neither page claims a security delta.
3. No retained version-labeled Apple consumer narrative was found for tvOS 9.1. Its page intentionally stays limited to final SDK notes and the security advisory rather than repeating user features remembered from third-party histories.
4. The ${milestoneCount - publicMilestoneCount} non-public milestones remain timeline-only records until beta-specific first-party sources support event-level claims.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. Security advisories can receive later-added entries. Summaries describe Apple's currently published record for a release, not proof that every advisory entry appeared on launch day.
7. Hardware mechanisms are included only when they define software interaction, sensing, setup, or compatibility boundaries; hardware colors, capacities, pricing, and industrial-design claims are excluded.

## Validation

- Research-batch validation passed with ${versions.length} versions, ${events.length} public events, ${eventChanges} globally consistent change keys, ${sources.length} sources, and ${citationReferences} citation references for this file.
- Inventory closure passed and is enforced inside the generator: six eligible local versions, ${milestoneCount} milestones, ${publicMilestoneCount} public appearances, ${milestoneCount - publicMilestoneCount} non-public milestones, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Reviewed production plan: 90 creates, 14 revision-guarded patches, and 2,076 unchanged documents.
- Creates: 12 source documents and 78 change documents; zero version, event, or build creates. The plan included six version patches, six existing durable public-event patches, and two source metadata patches.
- Mutation payload: 186,206 bytes, reported as 4.8% of the guarded limit.
- Applied production plan SHA: \`4f6d06e4446a0daf7623618857986a4131d5a8190c166680dd306be64117a90e\`.
- Production transaction \`F0eE6eK5XyVXtlnaoxy5kW\` committed successfully and the guarded apply completed with zero residual mutations.
- Approved bundle JSON SHA-256: \`${bundleSha}\`.
- Post-apply zero-residual plan SHA: \`c7461db5c74beb5a0462bcb5fdd1a7dd5c918a7bcbc860fe0fe20172892d90bd\`.
- Local smoke checks returned HTTP 200 and rendered sourced editorial content for \`/apple/macos/10.11\`, \`/apple/watchos/1.0\`, and \`/apple/tvos/9.1\`.
`;

writeFileSync(join(here, "apple-other-2015.md"), md);
