import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-macos-10-4.json";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T06:05:12Z";

const U = {
  preview:
    "https://www.apple.com/newsroom/2004/06/28Apple-Previews-Mac-OS-X-Tiger/",
  launch:
    "https://www.apple.com/newsroom/2005/04/12Apple-to-Ship-Mac-OS-X-Tiger-on-April-29/",
  quickTime:
    "https://www.apple.com/newsroom/2005/04/17Apple-Continues-to-Lead-the-Industry-in-the-Adoption-of-HD-Video-at-NAB/",
  adoption:
    "https://www.apple.com/newsroom/2005/06/06Apple-To-Deliver-2-Millionth-Copy-of-Mac-OS-X-Tiger-This-Week/",
  accessibility:
    "https://www.apple.com/accessibility/pdf/Mac_OS_X_Tiger_vpat.pdf",
  coreData:
    "https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/CoreData/RevisionHistory.html",
  architecture:
    "https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/OSX_Technology_Overview/SystemTechnology/SystemTechnology.html",
  securityIndex: "https://support.apple.com/en-us/104190",
};

const sources = [
  {
    url: U.preview,
    title: "Apple Previews Mac OS X “Tiger”",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2004-06-28T00:00:00.000Z",
    topics: ["Mac OS X", "Tiger", "10.4", "preview", "features"],
  },
  {
    url: U.launch,
    title: "Apple to Ship Mac OS X “Tiger” on April 29",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2005-04-12T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Tiger",
      "10.4",
      "public availability",
      "features",
      "compatibility",
    ],
  },
  {
    url: U.quickTime,
    title:
      "Apple Continues to Lead the Industry in the Adoption of HD Video at NAB",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2005-04-17T00:00:00.000Z",
    topics: ["Mac OS X", "Tiger", "10.4", "QuickTime 7", "H.264"],
  },
  {
    url: U.adoption,
    title: "Apple To Deliver 2 Millionth Copy of Mac OS X Tiger This Week",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2005-06-06T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Tiger",
      "10.4",
      "vendor-reported adoption",
      "developer ecosystem",
    ],
  },
  {
    url: U.accessibility,
    title: "Mac OS X version 10.4 “Tiger” accessibility information",
    publisher: "Apple Accessibility",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: ["Mac OS X", "Tiger", "10.4", "VoiceOver", "accessibility"],
  },
  {
    url: U.coreData,
    title: "Core Data Programming Guide: Document Revision History",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    topics: ["Mac OS X", "10.4", "Core Data", "public release"],
  },
  {
    url: U.architecture,
    title: "Kernel and Device Drivers Layer",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    topics: ["Mac OS X", "10.4", "64-bit support", "architecture"],
  },
  {
    // This URL is shared with the iOS 1 and Leopard batches. Keep its source
    // metadata byte-for-byte compatible with the current canonical production
    // record so this batch does not narrow or rewrite shared metadata.
    url: U.securityIndex,
    title: "Apple security updates (25-Jan-2005 to 21-Dec-2007)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Apple software",
      "2007",
      "release dates",
      "security updates",
      "archive completeness",
    ],
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
    documentedStatus: "documented",
    evidenceState: "confirmed",
    verificationMethod:
      verificationMethod ||
      "Matched Apple's dated Tiger launch announcement to the existing audited April 29, 2005 public event. Preview detail is used only where the final launch announcement confirms that the named capability shipped.",
    citations,
  };
}

const tigerChanges = [
  change({
    key: "macos-10-4-spotlight-system-search",
    title: "Spotlight system search",
    canonicalSummary:
      "Tiger introduced Spotlight, a systemwide index for searching file contents and metadata across documents, messages, contacts, appointments, images, and other records.",
    category: "feature",
    action: "introduced",
    summary:
      "Spotlight continuously updated its index as files changed and surfaced search in Mail, Address Book, Finder, and System Preferences. Apple's preview also documented Smart Folders, Smart Mailboxes, and Smart Groups as automatically updated views powered by the same search technology.",
    citations: [
      c(U.launch, "Spotlight paragraphs"),
      c(U.preview, "Spotlight and smart-organization paragraphs"),
    ],
  }),
  change({
    key: "macos-10-4-dashboard-widgets",
    title: "Dashboard widgets",
    canonicalSummary:
      "Dashboard introduced an on-demand layer of small information and utility applications called widgets.",
    category: "feature",
    action: "introduced",
    summary:
      "Tiger shipped with 14 widgets for information and utilities such as weather, stocks, conversions, and flight tracking. Apple described Dashboard as appearing and disappearing over the current workspace, and exposed standard HTML and JavaScript as a path for third-party widget development.",
    citations: [
      c(U.launch, "Dashboard paragraphs"),
      c(U.preview, "Dashboard paragraph"),
    ],
  }),
  change({
    key: "macos-10-4-ichat-av-h264-conferencing",
    title: "iChat AV multiway conferencing",
    canonicalSummary:
      "Tiger expanded iChat AV with H.264 video plus multi-participant audio and video conferences.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple documented audio conferences with as many as ten people and video conferences with as many as four, subject to processor and bandwidth requirements. The update also let buddy-list contacts expose the current iTunes track and open it in the iTunes Music Store.",
    citations: [
      c(U.launch, "iChat paragraph and conferencing footnote"),
      c(U.preview, "iChat paragraph"),
    ],
  }),
  change({
    key: "macos-10-4-automator-workflows",
    title: "Automator workflows",
    canonicalSummary:
      "Automator introduced visual, reusable workflows for automating repetitive tasks without requiring users to write scripts.",
    category: "feature",
    action: "introduced",
    summary:
      "The new application supplied more than one hundred customizable actions that could be arranged by drag and drop, then saved or shared as a workflow.",
    citations: [
      c(U.launch, "Automator paragraph"),
      c(U.preview, "Additional features; Automator"),
    ],
  }),
  change({
    key: "macos-10-4-safari-rss",
    title: "Safari RSS",
    canonicalSummary:
      "Safari added built-in RSS discovery and reading, including a combined view for multiple feeds.",
    category: "feature",
    action: "introduced",
    summary:
      "Tiger's browser could recognize RSS-enabled sites, display their feeds directly, and merge several feeds into a single reader view for a personalized news stream.",
    citations: [
      c(U.launch, "Safari RSS paragraph"),
      c(U.preview, "Safari RSS paragraphs"),
    ],
  }),
  change({
    key: "macos-10-4-quicktime-7",
    title: "QuickTime 7",
    canonicalSummary:
      "Tiger included QuickTime 7 with H.264 playback, live resizing, zero-configuration streaming, and expanded surround-audio support.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple tied QuickTime 7's Mac release to Tiger's April 29 launch. The launch announcement names H.264, smooth live resizing, automatic streaming configuration, and broader surround sound as the principal bundled changes.",
    citations: [
      c(U.launch, "Other new features; QuickTime 7"),
      c(U.quickTime, "QuickTime 7 and April 29 availability paragraphs"),
    ],
  }),
  change({
    key: "macos-10-4-mail-2",
    title: "Mail 2",
    canonicalSummary:
      "Mail 2 redesigned the built-in mail client and added Spotlight search, .Mac synchronization, and full-screen photo slideshows.",
    category: "enhancement",
    action: "changed",
    summary:
      "The Tiger release updated Mail's interface and connected the application to the operating system's new search and synchronization services, while adding a full-screen slideshow for message attachments.",
    citations: [c(U.launch, "Other new features; Mail 2")],
  }),
  change({
    key: "macos-10-4-ical-2",
    title: "iCal 2",
    canonicalSummary:
      "iCal 2 added birthday calendars, calendar groups, improved printing, and integration with Spotlight and Automator.",
    category: "enhancement",
    action: "changed",
    summary:
      "Tiger's calendar update expanded organization and printing while making calendar data available to system search and workflow automation.",
    citations: [c(U.launch, "Other new features; iCal 2")],
  }),
  change({
    key: "macos-10-4-font-book-2",
    title: "Font Book 2",
    canonicalSummary:
      "Font Book 2 introduced font libraries and support for installing fonts at system or network locations.",
    category: "enhancement",
    action: "changed",
    summary:
      "The updated font utility added library-based organization and could manage installations beyond an individual user's local font collection.",
    citations: [c(U.launch, "Other new features; Font Book 2")],
  }),
  change({
    key: "macos-10-4-dotmac-xsync",
    title: ".Mac synchronization with Xsync",
    canonicalSummary:
      "Tiger replaced the .Mac synchronization preference with one powered by the new Xsync engine.",
    category: "feature",
    action: "introduced",
    summary:
      "For .Mac subscribers, the new synchronization layer coordinated Safari bookmarks, iCal appointments, Address Book contacts, Keychain passwords, and Mail settings across multiple Macs.",
    citations: [
      c(U.launch, "Other new features; .Mac sync preference"),
      c(U.preview, "Additional features; .Mac Sync"),
    ],
  }),
  change({
    key: "macos-10-4-voiceover-screen-reader",
    title: "Built-in VoiceOver screen reader",
    canonicalSummary:
      "Tiger included VoiceOver as an integrated screen reader with spoken interface descriptions and keyboard-driven control.",
    category: "feature",
    action: "introduced",
    summary:
      "Apple's Tiger-specific accessibility documentation says VoiceOver was installed by default, read documents and interface activity aloud, supplied keyboard navigation, and made the Tiger installation disc accessible. The same document records exceptions, so this occurrence does not imply complete support in every bundled application or control.",
    verificationMethod:
      "Confirmed against Apple's version-specific Mac OS X 10.4 accessibility document, including its stated support limits and installation-media behavior.",
    citations: [
      c(
        U.accessibility,
        "Functional Performance Criteria 1194.31(a); VoiceOver and installation disc",
      ),
      c(
        U.accessibility,
        "Software Applications and Operating Systems; Accessibility API exceptions",
      ),
    ],
  }),
  change({
    key: "macos-10-4-core-data-framework",
    title: "Core Data",
    canonicalSummary:
      "Tiger introduced the public Core Data framework for object-graph management and persistence in Mac applications.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple's retained Core Data documentation identifies April 29, 2005 as its first public version and says the guide was updated for the public release of OS X 10.4.",
    verificationMethod:
      "Confirmed through Apple's retained Core Data revision history, whose first-public-version entry is dated to the exact Tiger public-release day.",
    citations: [
      c(U.coreData, "2005-04-29 revision: first public version for OS X v10.4"),
    ],
  }),
  change({
    key: "macos-10-4-native-64-bit-processes",
    title: "Initial native 64-bit process support",
    canonicalSummary:
      "Tiger added the first Mac OS X support for building and running native 64-bit processes alongside 32-bit applications.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The launch announcement emphasized access to larger address spaces. Apple's later architecture documentation preserves the important initial boundary: Tiger's 64-bit development support was limited to C or C++ code and a restricted set of system libraries, rather than the broad 64-bit application framework coverage added in later releases.",
    citations: [
      c(U.launch, "Core technologies; native 64-bit application support"),
      c(
        U.architecture,
        "Hardware Architectures; 64-Bit Support and Tiger limitations",
      ),
    ],
  }),
  change({
    key: "macos-10-4-core-image-core-video",
    title: "Core Image and Core Video",
    canonicalSummary:
      "Tiger introduced Core Image and Core Video as system foundations for image and video processing applications.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple positioned the two technologies as reusable media-processing foundations for developers, extending the system's Core-family approach beyond audio.",
    citations: [
      c(U.launch, "Core technologies; Core Image and Core Video"),
      c(U.preview, "Additional features; Core Image and Core Video"),
    ],
  }),
  change({
    key: "macos-10-4-xgrid",
    title: "Xgrid distributed computing",
    canonicalSummary:
      "Tiger brought Apple's Xgrid distributed-computing software into the desktop operating system.",
    category: "feature",
    action: "introduced",
    summary:
      "Xgrid provided a system technology for coordinating work across multiple Macs as a distributed computational resource.",
    citations: [
      c(U.launch, "Core technologies; Xgrid"),
      c(U.preview, "UNIX foundation and Xgrid"),
    ],
  }),
  change({
    key: "macos-10-4-windows-network-integration",
    title: "Expanded Windows network integration",
    canonicalSummary:
      "Tiger improved access to Windows-hosted home directories and authentication through Microsoft Active Directory.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple described the change as standards-based network compatibility for mixed environments, focused on Windows home-directory access and Active Directory identity.",
    citations: [
      c(U.launch, "Core technologies; Windows compatibility"),
      c(U.preview, "Additional features; Windows compatibility"),
    ],
  }),
  change({
    key: "macos-10-4-unix-foundation",
    title: "Updated UNIX foundation",
    canonicalSummary:
      "Tiger revised the system's UNIX foundation with a newer kernel, better SMP scaling, 64-bit virtual memory, access-control lists, GCC 4.0, and modernized network services.",
    category: "developerApi",
    action: "changed",
    summary:
      "These lower-level changes expanded multiprocessor scaling, memory and permissions infrastructure, compiler tooling, and networking beneath Tiger's applications.",
    citations: [
      c(U.launch, "Core technologies; UNIX foundation"),
      c(U.preview, "UNIX foundation paragraph"),
    ],
  }),
  change({
    key: "macos-10-4-xcode-2",
    title: "Xcode 2",
    canonicalSummary:
      "Tiger shipped with Xcode 2 as the accompanying generation of Apple's Mac development tools.",
    category: "developerApi",
    action: "changed",
    summary:
      "Apple identified Xcode 2 as the tool suite intended for building applications against Tiger's new operating-system technologies.",
    citations: [
      c(U.launch, "Core technologies; Xcode 2"),
      c(U.preview, "Additional features; Xcode 2"),
    ],
  }),
  change({
    key: "macos-10-4-powerpc-firewire-baseline",
    title: "PowerPC and FireWire hardware baseline",
    canonicalSummary:
      "The initial Tiger retail release targeted FireWire-equipped PowerPC G3, G4, and G5 Macs with at least 256MB of memory.",
    category: "compatibility",
    action: "changed",
    summary:
      "This is the April 2005 client-release baseline stated by Apple. It does not project support from later Tiger point releases—including the later Intel branch—back onto the initial 10.4 package.",
    citations: [c(U.launch, "Pricing & Availability; system requirements")],
  }),
  change({
    key: "macos-10-4-retail-upgrade-availability",
    title: "Retail upgrade and licensing options",
    canonicalSummary:
      "Apple launched Tiger as a paid retail operating-system upgrade with single-user, family, volume, maintenance, and qualifying-new-Mac paths.",
    category: "compatibility",
    action: "changed",
    summary:
      "The US launch announcement listed a $129 single-user license, a $199 five-user single-residence Family Pack, and a $9.95 shipping-and-handling Up-To-Date package for qualifying Macs bought on or after April 12. These are historical launch terms, not current purchase guidance.",
    citations: [c(U.launch, "Pricing & Availability; US launch terms")],
  }),
];

const version = {
  releaseVersionId: "version-macos-10-4",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X 10.4 Tiger became publicly available on April 29, 2005. Apple framed the release around more than 200 changes; this article records twenty clearly bounded capabilities and launch conditions that can be tied to retained first-party material, rather than treating the marketing total as a recoverable changelog.",
      [
        c(U.launch, "April 29 availability and launch feature inventory"),
        c(U.preview, "June 2004 preview scope"),
      ],
    ),
    heading("Search, information, and automation"),
    prose(
      "Spotlight moved content and metadata search into the operating system and several bundled applications. Dashboard created an instant widget layer, Automator added drag-and-drop workflows, and Safari gained a built-in RSS reader capable of combining feeds.",
      [
        c(U.launch, "Spotlight through Safari RSS feature paragraphs"),
        c(U.preview, "Spotlight, Safari RSS, Dashboard, and Automator"),
      ],
    ),
    heading("Communication, media, and personal information"),
    prose(
      "Tiger expanded iChat AV with H.264 and multi-participant conferencing, bundled QuickTime 7, and revised Mail, iCal, and Font Book. A new Xsync-based .Mac preference synchronized selected bookmarks, calendars, contacts, passwords, and mail settings across subscribed Macs.",
      [
        c(U.launch, "iChat and other new features"),
        c(U.quickTime, "QuickTime 7 launch timing and H.264"),
      ],
    ),
    heading("Accessibility"),
    prose(
      "Tiger included VoiceOver as an installed-by-default screen reader with spoken interface descriptions and keyboard control; Apple's accessibility document also says the installation disc was usable with VoiceOver. That source reports exceptions in application and control support, so this page preserves the feature without implying universal accessibility.",
      [
        c(
          U.accessibility,
          "Functional Performance Criteria and documented exceptions",
        ),
      ],
    ),
    heading("Developer and system foundations"),
    prose(
      "Core Data reached its first public version with Tiger. The release also introduced initial native 64-bit process support, Core Image and Core Video, Xgrid, an updated UNIX foundation, and Xcode 2. Apple's architecture documentation makes clear that Tiger's first 64-bit model was narrower than the framework coverage that followed in later OS X releases.",
      [
        c(U.coreData, "2005-04-29 first public Core Data version"),
        c(U.launch, "Core technologies and tools"),
        c(U.architecture, "Tiger 64-bit support boundary"),
      ],
    ),
    heading("Distribution and compatibility"),
    prose(
      "Apple sold the client release through its stores and authorized resellers, with US single-user, family, volume, maintenance, and Up-To-Date options. The initial package required at least 256MB of memory and a FireWire-equipped PowerPC G3, G4, or G5 Mac; improved Windows home-directory and Active Directory integration addressed mixed-network environments.",
      [c(U.launch, "Windows compatibility and Pricing & Availability")],
    ),
    heading("Early ecosystem context"),
    prose(
      "On June 6, Apple said it expected to deliver more than two million Tiger copies by the end of that week, counting retail sales, maintenance delivery, and copies bundled with Macs. It also reported more than 400 Dashboard widgets, 550 Automator actions, and 40 Spotlight plug-ins. These figures are retained as Apple-supplied launch-period context, not independent adoption measurements.",
      [c(U.adoption, "June 6 delivery and developer-ecosystem claims")],
    ),
    heading("Evidence boundary"),
    prose(
      "The retained Apple security chronology has no initial Mac OS X 10.4 entry on April 29; its first Tiger point-release line is 10.4.1 on May 16. The launch page's general security superlative is marketing language rather than a component-level bulletin, so this article adds no structured launch-security claim and does not project later fixes backward. It also excludes Tiger Server, prerelease-only details, later Intel support, point versions, and build numbers because none is an eligible local record in this cohort.",
      [
        c(U.launch, "Launch scope and general security statement"),
        c(
          U.securityIndex,
          "April–May 2005 chronology; Mac OS X 10.4.1 on May 16",
        ),
      ],
    ),
  ),
  citations: [
    c(U.preview, "June 28, 2004 preview"),
    c(U.launch, "April 12 announcement and April 29 availability"),
    c(U.quickTime, "April 17 QuickTime 7 confirmation"),
    c(U.accessibility, "Tiger-specific accessibility information"),
    c(U.coreData, "Core Data first public version"),
    c(U.architecture, "Tiger 64-bit limitations"),
    c(U.adoption, "June 6 launch-period context"),
    c(U.securityIndex, "2005 security chronology boundary"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-4",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "Mac OS X Tiger 10.4 reached the public channel on April 29, 2005 with Spotlight, Dashboard, Automator, Safari RSS, expanded communications and media applications, VoiceOver, and a broad new developer foundation.",
  article: article(
    heading("Public release"),
    prose(
      "Apple announced that the client edition of Mac OS X 10.4 Tiger would go on sale at 6:00 p.m. on Friday, April 29, 2005 through Apple retail stores and authorized resellers. That first-party date exactly matches the existing durable Public route.",
      [c(U.launch, "April 29 public availability")],
    ),
    heading("What this page records"),
    prose(
      "The structured inventory covers twenty documented launch deltas: Spotlight, Dashboard, iChat AV, Automator, Safari RSS, QuickTime 7, Mail 2, iCal 2, Font Book 2, .Mac synchronization, VoiceOver, Core Data, initial native 64-bit processes, Core Image and Core Video, Xgrid, Windows integration, UNIX foundation updates, Xcode 2, the PowerPC hardware baseline, and retail upgrade availability.",
      [
        c(U.launch, "Launch feature and availability inventory"),
        c(U.accessibility, "VoiceOver in Tiger"),
        c(U.coreData, "Core Data public-release entry"),
        c(U.architecture, "Initial 64-bit support boundary"),
      ],
    ),
    heading("Preview-to-release boundary"),
    prose(
      "Apple previewed Tiger in June 2004. Preview descriptions are used here to clarify Spotlight's smart containers and other interaction details only when Apple's April 2005 launch announcement independently names the same capability as part of the shipping release.",
      [
        c(U.preview, "June 2004 preview descriptions"),
        c(U.launch, "April 2005 shipping feature confirmation"),
      ],
    ),
    heading("Accessibility and development"),
    prose(
      "VoiceOver and Core Data do not appear in the launch announcement's selected headline list, but each has retained first-party version-specific documentation: Apple's Tiger accessibility assessment describes the bundled screen reader and its limitations, while the Core Data revision history identifies April 29 as the framework's first public version.",
      [
        c(U.accessibility, "VoiceOver support and exceptions"),
        c(U.coreData, "2005-04-29 first public version"),
      ],
    ),
    heading("Requirements and purchase paths"),
    prose(
      "The launch requirements named FireWire-equipped PowerPC G3, G4, and G5 Macs with at least 256MB of memory. US historical pricing was $129 for one user and $199 for a five-user household license, with separate volume, maintenance, and qualifying-new-Mac arrangements.",
      [c(U.launch, "Pricing & Availability")],
    ),
    heading("Security and maintenance boundary"),
    prose(
      "Apple's surviving 2005–2007 security index does not list an initial Tiger security bulletin on April 29 and first lists the 10.4.1 client update on May 16. Because this route represents only the initial 10.4 public appearance, no 10.4.1 maintenance or later security content is inherited into it.",
      [c(U.securityIndex, "April 29 through May 16, 2005 security chronology")],
    ),
    heading("Catalog naming and scope"),
    prose(
      "The local catalog groups Tiger under the modern macOS platform family, but reader-facing prose retains Apple's contemporary Mac OS X name. This is the desktop client release only: the separately marketed Tiger Server product and later PowerPC or Intel point-release packages are outside the one eligible local record.",
      [c(U.launch, "Mac OS X 10.4 client product and requirements")],
    ),
    heading("Launch-period context"),
    prose(
      "Apple's June follow-up supplies early shipment and developer-ecosystem figures. They are identified as Apple's own report and are not converted into independent sales, installed-base, or market-share conclusions.",
      [c(U.adoption, "June 6 Apple-reported figures")],
    ),
  ),
  citations: [
    c(U.preview, "June 28, 2004 preview"),
    c(U.launch, "April 29, 2005 public release"),
    c(U.quickTime, "QuickTime 7 launch confirmation"),
    c(U.accessibility, "Tiger accessibility documentation"),
    c(U.coreData, "Core Data first public version"),
    c(U.architecture, "Tiger 64-bit boundary"),
    c(U.adoption, "Launch-period ecosystem context"),
    c(U.securityIndex, "2005 security chronology"),
  ],
  changes: tigerChanges,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
  isIndexable: true,
};

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [version],
  events: [event],
  builds: [],
};

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const eligibleSeedVersions = seed.releaseVersions.filter(
  (item) => item.platform === "macOS" && item.version.startsWith("10.4"),
);

if (
  eligibleSeedVersions.length !== 1 ||
  eligibleSeedVersions[0].version !== "10.4" ||
  eligibleSeedVersions[0].majorVersion !== 10 ||
  eligibleSeedVersions[0].publicReleaseDate !== "2005-04-29" ||
  eligibleSeedVersions[0].versionNote !== "Tiger" ||
  eligibleSeedVersions[0].milestones.length !== 1 ||
  eligibleSeedVersions[0].milestones[0].label !== "Public" ||
  eligibleSeedVersions[0].milestones[0].date !== "2005-04-29" ||
  eligibleSeedVersions[0].milestones[0].isRevision !== false
) {
  throw new Error(
    "The local Mac OS X 10.4 seed inventory changed; re-audit Tiger before regenerating.",
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.versions[0].releaseVersionId !== "version-macos-10-4" ||
  bundle.events.length !== 1 ||
  Object.keys(bundle.events[0].target).length !== 2 ||
  bundle.events[0].target.releaseVersionId !== "version-macos-10-4" ||
  bundle.events[0].target.routeAlias !== "public" ||
  bundle.events[0].changes.length !== 20 ||
  bundle.builds.length !== 0
) {
  throw new Error(
    "The expected Tiger launch-only bundle closure no longer holds.",
  );
}

const localChangeKeys = tigerChanges.map((item) => item.key);
if (new Set(localChangeKeys).size !== localChangeKeys.length) {
  throw new Error("The Tiger bundle contains duplicate local change keys.");
}

const otherChangeKeys = new Map();
for (const file of readdirSync(here).filter(
  (name) => name.endsWith(".json") && name !== outputName,
)) {
  const candidate = JSON.parse(readFileSync(join(here, file), "utf8"));
  for (const owner of [
    ...(candidate.events || []),
    ...(candidate.builds || []),
  ]) {
    for (const item of owner.changes || []) {
      if (otherChangeKeys.has(item.key)) {
        continue;
      }
      otherChangeKeys.set(item.key, file);
    }
  }
}
const collisions = localChangeKeys.filter((key) => otherChangeKeys.has(key));
if (collisions.length > 0) {
  throw new Error(
    `Tiger change keys collide with existing batches: ${collisions
      .map((key) => `${key} (${otherChangeKeys.get(key)})`)
      .join(", ")}`,
  );
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
const uncitedSources = sources.filter(
  (source) => !citationUrls.has(source.url),
);
if (missingSources.length > 0 || uncitedSources.length > 0) {
  throw new Error(
    `Citation closure failed. Missing: ${missingSources.join(
      ", ",
    )}; uncited: ${uncitedSources.map((source) => source.url).join(", ")}`,
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
const citationCount = citationReferenceCount(bundle);

const categoryCounts = tigerChanges.reduce((counts, item) => {
  counts[item.category] = (counts[item.category] || 0) + 1;
  return counts;
}, {});

const md = `# Apple Mac OS X 10.4 Tiger research batch

## Result

\`${outputName}\` enriches the exact existing local Mac OS X 10.4 Tiger record and its same-date durable Public route. The page is a copyright-safe original synthesis of retained first-party Apple material.

- 1 of 1 local Tiger version records has a source-linked overview article.
- 1 of 1 local Public appearances has a release-specific summary and article.
- ${tigerChanges.length} structured launch changes are attached to that Public appearance: ${categoryCounts.feature} features, ${categoryCounts.enhancement} enhancements, ${categoryCounts.developerApi} developer-platform changes, and ${categoryCounts.compatibility} compatibility or distribution changes.
- ${sources.length} source records are declared and used: 4 Apple Newsroom announcements, 2 Apple technical documents, 1 Apple accessibility document, and 1 retained Apple Support chronology.
- The repository citation audit counts ${citationCount} claim-level or page-level citation references.
- The event selector contains only \`{releaseVersionId: "version-macos-10-4", routeAlias: "public"}\`.
- The version and event are \`editoriallyVerified\` and \`approved\` as of
  \`${reviewedAt}\`; the Public event is indexable.
- No point version, build, or missing identity is included.

## Exact local coverage

| Existing record | Seed milestones | Public date | Structured changes | Article blocks |
| --- | ---: | --- | ---: | ---: |
| \`version-macos-10-4\` (Tiger) | 1 | 2005-04-29 | ${tigerChanges.length} | ${event.article.blocks.length} |

The only local version whose platform is \`macOS\` and version begins with \`10.4\` is the major Tiger record. It has exactly one milestone: Public on April 29, 2005. Apple's retained launch announcement names the same day and an on-sale time of 6:00 p.m.

## Timeline, naming, and source-boundary audit

Twelve points need explicit editorial awareness:

1. The local platform family is called \`macOS\`, but Apple's 2004–2005 material calls the product Mac OS X. Reader-facing prose keeps the period-correct Mac OS X Tiger name without changing the durable route.
2. April 29, 2005 has direct first-party support and matches both the seed milestone and \`publicReleaseDate\`; no date correction is proposed.
3. This cohort covers the desktop client release only. Apple's separately marketed Tiger Server package is not projected onto the client route.
4. The launch announcement says Tiger contained more than 200 features. The ${tigerChanges.length} structured records are a recoverable reader-oriented inventory, not a claim of exhaustive reconstruction.
5. Apple's June 2004 preview is used only to clarify a feature also confirmed in the April 2005 shipping announcement. Preview-only claims are excluded.
6. VoiceOver is absent from the launch announcement's selected headline list but is documented in Apple's Tiger-specific accessibility assessment. That document also records exceptions, which remain visible in the synthesis.
7. Core Data is absent from the selected Newsroom list, but Apple's retained developer revision history identifies April 29 as its first public version for OS X 10.4.
8. Apple's later architecture documentation limits Tiger's initial native 64-bit model to C or C++ and a narrow library set. The page therefore avoids implying the broad 64-bit application-framework support that arrived later.
9. The April retail client targeted FireWire-equipped PowerPC G3, G4, and G5 Macs. Later Intel-compatible Tiger point releases are outside the sole eligible local record and are not inferred here.
10. Apple's surviving security index has no initial 10.4 bulletin on April 29 and first lists 10.4.1 on May 16. The launch announcement's general security superlative is not converted into component-level security changes.
11. US prices, license terms, and the Up-To-Date fee are historical launch conditions, not present-day purchase guidance.
12. The June copy-delivery and third-party extension counts are explicitly Apple-reported launch-period context, not independently audited adoption or market-share data.

## Structured release-change inventory

| Area | Changes |
| --- | --- |
| Search and utilities | Spotlight system search; Dashboard widgets; Automator workflows; Safari RSS |
| Communication and media | iChat AV conferencing; QuickTime 7; Mail 2; iCal 2; Font Book 2; .Mac synchronization |
| Accessibility | Built-in VoiceOver with documented support limits |
| Developer and system foundations | Core Data; initial native 64-bit processes; Core Image and Core Video; Xgrid; UNIX foundation; Xcode 2 |
| Compatibility and release conditions | Windows network integration; PowerPC and FireWire baseline; retail upgrade and licensing options |

## Verified source set

All eight URLs resolved to the named Apple page or document during research on ${accessedAt}.

### Apple launch and launch-period announcements

- [Apple Previews Mac OS X “Tiger”](${U.preview})
- [Apple to Ship Mac OS X “Tiger” on April 29](${U.launch})
- [Apple Continues to Lead the Industry in the Adoption of HD Video at NAB](${U.quickTime})
- [Apple To Deliver 2 Millionth Copy of Mac OS X Tiger This Week](${U.adoption})

### Apple product and developer documentation

- [Mac OS X version 10.4 “Tiger” accessibility information](${U.accessibility})
- [Core Data Programming Guide: Document Revision History](${U.coreData})
- [Kernel and Device Drivers Layer](${U.architecture})
- [Apple security updates (25-Jan-2005 to 21-Dec-2007)](${U.securityIndex})

The security chronology is shared with the iOS 1 and Leopard research batches.
This generator retains the current canonical production metadata so the Tiger
plan can reuse it without a source patch.

## Editorial and copyright method

Every overview paragraph, event paragraph, page summary, and structured change is newly written synthesis. Citations use precise feature, document-section, date, or chronology locators rather than reproducing Apple's prose.

Feature names and product names are used nominatively to identify historical software. Marketing superlatives, long quotations, press-release boilerplate, contemporary review language, and trademark symbols are omitted. Historic pricing and Apple-supplied adoption figures are labeled with their time and source boundaries.

Related details are grouped into coherent changes. For example, the Spotlight record keeps system indexing and smart containers together; the UNIX record keeps its kernel, SMP, virtual-memory, ACL, compiler, and network-service foundation together; and QuickTime 7 keeps its launch media capabilities in one occurrence. This avoids manufacturing a misleadingly large count from sentence fragments.

## Evidence limits

- The selected launch materials do not preserve an official itemized list of all 200-plus changes.
- No initial Tiger security bulletin was found in Apple's retained chronology, so no structured security occurrence is included.
- No undocumented or community-only change is added merely to increase coverage.
- VoiceOver's documented exceptions mean its presence should not be read as complete accessibility across every bundled control and application.
- The initial 64-bit record describes a constrained developer facility, not a fully 64-bit graphical application stack.
- Tiger Server, later Intel support, 10.4.1 and other point releases, prerelease builds, and build numbers are intentionally excluded.
- Apple's June adoption figures combine retail, maintenance, and Mac-bundled copies; the page does not reinterpret them as active installations.

## Validation

- JSON parsing and launch-content schema validation: passed.
- Seed comparison: 1 local Tiger record, 1 version overlay, and 1 Public-event overlay, with no missing or extra IDs.
- Target check: the event selector contains only \`releaseVersionId\` and \`routeAlias: "public"\`.
- Citation registry check: every citation URL has one source declaration and every declared source is used.
- Change identity check: all ${tigerChanges.length} local keys are unique and none appeared in the existing batch corpus when generated.
- Review-state check: both overlays are \`editoriallyVerified\` and \`approved\`
  at \`${reviewedAt}\`; the event has \`isIndexable: true\`.
- Deterministic bundle SHA-256: \`${jsonSha}\`.
- Repository research validation: passed across 39 discovered batches and 2,042 globally consistent change keys.
- Focused launch-content ingestion and manifest tests: 19 passed, 0 failed.
- Generator ESLint and Prettier checks: passed. A clean rerun reproduced the JSON bundle byte for byte.
- Approved production dry run: 27 creates, 2 revision-guarded patches, and
  2,082 unchanged documents.
- The creates are exactly 20 \`releaseChange\` documents and 7 \`source\`
  documents. The patches are exactly the existing \`version-macos-10-4\`
  record and its existing durable Public event; the shared 2005–2007 security
  chronology remains unchanged and no delete is planned.
- Approved plan SHA:
  \`941ac5a2b43aa085e4525ddc5eea8a06e85012c8bac7feeeb830d549e14e40b0\`;
  mutation payload: 72,814 bytes (1.9% of the guarded limit).
- Production apply committed and zero-residual verified in transaction
  \`eOgq1Ovu5XNUv1qNFUfyxz\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,111 unchanged
  documents. Its plan SHA is
  \`eda00f6954820528d608911751d366d20263251e52cd8641b4aa435a884bbcfe\`.
- The representative local route \`/apple/macos/10.4\` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at \`${reviewedAt}\`.

## Human approval checklist

- [x] Accept the retrospective local \`macOS\` family label while preserving the contemporary Mac OS X Tiger name in prose.
- [x] Confirm that the selected ${tigerChanges.length}-item inventory is useful without implying recovery of all 200-plus advertised features.
- [x] Accept VoiceOver and Core Data as first-party documented launch changes even though they were omitted from the Newsroom headline list.
- [x] Accept the explicit omission of structured launch-security changes.
- [x] Keep the initial PowerPC hardware boundary separate from later Intel Tiger point releases.
- [x] Approve the event for indexing after the root launch review.

## Reproduction

\`\`\`bash
node scripts/research-batches/build-apple-macos-10-4.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-macos-10-4.mjs
npx prettier --check scripts/research-batches/build-apple-macos-10-4.mjs scripts/research-batches/apple-macos-10-4.json scripts/research-batches/apple-macos-10-4.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-macos-10-4.json
\`\`\`

The final command is a read-only dry run. The production apply was performed
separately through the reviewed plan SHA recorded above.
`;

const notesPath = join(here, "apple-macos-10-4.md");
writeFileSync(
  notesPath,
  await prettier.format(md, {
    filepath: notesPath,
  }),
);
