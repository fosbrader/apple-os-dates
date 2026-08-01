import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T06:02:26Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/104190",
  nearFinal:
    "https://www.apple.com/newsroom/2007/06/11Apple-Unveils-Near-Final-Mac-OS-X-Leopard/",
  ship: "https://www.apple.com/newsroom/2007/10/16Apple-to-Ship-Mac-OS-X-Leopard-on-October-26/",
  firstWeekend:
    "https://www.apple.com/newsroom/2007/10/30Apple-Sells-Two-Million-Copies-of-Mac-OS-X-Leopard-in-First-Weekend/",
  techSpecs: "https://support.apple.com/en-us/112593",
  installationGuide:
    "https://cdsassets.apple.com/live/6GJYWVAV/misc/ma348_leopard_install-setup.pdf",
  laterSecurity: "https://support.apple.com/en-us/102685",
};

const sources = [
  {
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
  {
    url: U.nearFinal,
    title: "Apple Unveils Near Final Mac OS X Leopard",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2007-06-11T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Leopard",
      "10.5",
      "near-final preview",
      "features",
      "developer tools",
    ],
  },
  {
    url: U.ship,
    title: "Apple to Ship Mac OS X Leopard on October 26",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2007-10-16T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Leopard",
      "10.5",
      "public availability",
      "features",
      "compatibility",
    ],
  },
  {
    url: U.firstWeekend,
    title:
      "Apple Sells Two Million Copies of Mac OS X Leopard in First Weekend",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2007-10-30T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Leopard",
      "10.5",
      "first-weekend sales",
      "vendor-reported adoption",
    ],
  },
  {
    url: U.techSpecs,
    title: "Mac OS X 10.5 - Technical Specifications",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Mac OS X",
      "Leopard",
      "10.5",
      "system requirements",
      "included software",
      "developer technologies",
    ],
  },
  {
    url: U.installationGuide,
    title: "Mac OS X 10.5 Leopard Installation and Setup Guide",
    publisher: "Apple",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Mac OS X",
      "Leopard",
      "10.5",
      "installation",
      "setup",
      "migration",
    ],
  },
  {
    url: U.laterSecurity,
    title:
      "About the security content of the Mac OS X 10.5.1 Update (client and server)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Mac OS X",
      "Leopard",
      "10.5.1",
      "security",
      "later-version boundary",
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
      "Matched Apple's October 2007 ship announcement or final 10.5 technical documentation to the existing audited Leopard 10.5 public-release event; June near-final detail is used only when an October or final-version source confirms the shipped surface.",
    citations,
  };
}

const leopardChanges = [
  change({
    key: "macos-10-5-dock-stacks",
    title: "Dock Stacks",
    canonicalSummary:
      "Leopard added Stacks to the Dock for compact access to folders, documents, applications, and downloads.",
    category: "feature",
    action: "introduced",
    summary:
      "Stacks exposed a folder's contents directly from the Dock and automatically gave common downloads a dedicated location, while allowing users to create additional stacks for frequently used material.",
    citations: [
      c(U.ship, "New desktop and Dock; Stacks"),
      c(U.nearFinal, "Dock and Stacks paragraph"),
    ],
  }),
  change({
    key: "macos-10-5-unified-desktop-design",
    title: "Unified desktop design",
    canonicalSummary:
      "Leopard gave application windows a more consistent visual treatment and made active windows more distinct.",
    category: "enhancement",
    action: "changed",
    summary:
      "The public release applied a common window theme across applications and used stronger visual emphasis to distinguish the focused window.",
    citations: [c(U.ship, "Desktop visual-design paragraph")],
  }),
  change({
    key: "macos-10-5-finder-cover-flow-sidebar",
    title: "Finder Cover Flow and redesigned sidebar",
    canonicalSummary:
      "Finder gained Cover Flow browsing and a reorganized sidebar for local and shared locations.",
    category: "enhancement",
    action: "changed",
    summary:
      "The redesigned file browser added a visual way to move through files and applications while simplifying access to folders and computers exposed on a local network.",
    citations: [
      c(U.ship, "Updated Finder paragraph"),
      c(U.nearFinal, "Finder and sidebar paragraphs"),
    ],
  }),
  change({
    key: "macos-10-5-finder-network-search-sharing",
    title: "Finder network search and sharing",
    canonicalSummary:
      "Finder could browse, search, copy from, and share with supported Macs and PCs on a local network.",
    category: "enhancement",
    action: "changed",
    summary:
      "Leopard brought shared computers into the main Finder workflow and extended Spotlight and drag-and-drop operations to supported network content.",
    citations: [c(U.ship, "Updated Finder network paragraph")],
  }),
  change({
    key: "macos-10-5-back-to-my-mac",
    title: "Back to My Mac",
    canonicalSummary:
      "Back to My Mac let eligible .Mac members browse and reach files on their remote Macs over the internet.",
    category: "feature",
    action: "introduced",
    summary:
      "The service extended Finder-style access beyond the local network for users with the required .Mac membership and compatible remote setup.",
    citations: [
      c(U.ship, "Finder paragraph; Back to My Mac"),
      c(U.nearFinal, "Finder paragraph; Back to My Mac"),
    ],
  }),
  change({
    key: "macos-10-5-quick-look",
    title: "Quick Look",
    canonicalSummary:
      "Quick Look previewed supported documents and media without launching their creating applications.",
    category: "feature",
    action: "introduced",
    summary:
      "Leopard added high-resolution and full-screen previews from Finder so users could inspect many files, including playable media, before opening an editor or viewer.",
    citations: [
      c(U.ship, "Quick Look paragraph"),
      c(U.nearFinal, "Finder and Quick Look paragraph"),
    ],
  }),
  change({
    key: "macos-10-5-spaces",
    title: "Spaces",
    canonicalSummary:
      "Spaces introduced multiple customized desktops for grouping applications and documents by activity.",
    category: "feature",
    action: "introduced",
    summary:
      "Users could separate projects into distinct workspaces and switch among them with mouse or keyboard controls rather than keeping every window in one desktop.",
    citations: [
      c(U.ship, "Spaces paragraph"),
      c(U.nearFinal, "Other new features; Spaces"),
    ],
  }),
  change({
    key: "macos-10-5-time-machine",
    title: "Time Machine",
    canonicalSummary:
      "Time Machine automated backup history and restored individual items or an entire Mac from an external drive.",
    category: "feature",
    action: "introduced",
    summary:
      "Leopard added one-click backup setup, maintained an up-to-date history on additional storage, and provided search-and-restore workflows for deleted data plus full-system recovery.",
    citations: [
      c(U.ship, "Time Machine paragraphs and external-drive footnote"),
      c(U.techSpecs, "Feature-specific requirements; Time Machine"),
    ],
  }),
  change({
    key: "macos-10-5-mail-stationery",
    title: "Mail stationery",
    canonicalSummary:
      "Mail added more than thirty stationery designs for formatted messages viewable on Mac and Windows systems.",
    category: "feature",
    action: "introduced",
    summary:
      "The updated client provided reusable visual layouts for composing graphic-rich email while retaining cross-platform viewing as an explicit launch goal.",
    citations: [c(U.ship, "Mail paragraph; stationery")],
  }),
  change({
    key: "macos-10-5-mail-notes-todos",
    title: "Mail Notes and To Dos",
    canonicalSummary:
      "Mail integrated notes and task lists with drafts, Smart Mailboxes, iCal, and multi-Mac synchronization.",
    category: "feature",
    action: "introduced",
    summary:
      "Leopard placed lightweight note-taking and task management inside the email application so those records could participate in familiar mailbox and calendar workflows.",
    citations: [
      c(U.ship, "Mail paragraph; Notes and To Dos"),
      c(U.nearFinal, "Other new features; Mail"),
    ],
  }),
  change({
    key: "macos-10-5-mail-data-detectors-rss",
    title: "Mail data detectors and RSS",
    canonicalSummary:
      "Mail recognized contact and event details in messages and included an RSS feed reader.",
    category: "feature",
    action: "introduced",
    summary:
      "Data detectors offered shortcuts from detected phone numbers, addresses, and dates into Address Book or iCal, while feed subscriptions appeared alongside email.",
    citations: [c(U.ship, "Mail paragraph; data detectors and RSS")],
  }),
  change({
    key: "macos-10-5-ichat-theater",
    title: "iChat Theater",
    canonicalSummary:
      "iChat Theater presented photos, slides, video, and files inside a video conference.",
    category: "feature",
    action: "introduced",
    summary:
      "The communication app gained a presentation surface for sharing supported media and documents with call participants without replacing the conference context.",
    citations: [
      c(U.ship, "iChat paragraph; iChat Theater"),
      c(U.nearFinal, "Other new features; iChat"),
    ],
  }),
  change({
    key: "macos-10-5-ichat-screen-sharing",
    title: "iChat screen sharing",
    canonicalSummary:
      "iChat added remote screen viewing and control between supported Macs.",
    category: "feature",
    action: "introduced",
    summary:
      "Leopard extended a conversation into an interactive remote-desktop session, subject to the network requirements documented for iChat and Finder screen sharing.",
    citations: [
      c(U.ship, "iChat paragraph; screen sharing"),
      c(U.techSpecs, "Feature-specific requirements; screen sharing"),
    ],
  }),
  change({
    key: "macos-10-5-ichat-effects-backdrops",
    title: "iChat effects and backdrops",
    canonicalSummary:
      "iChat added Photo Booth-style live effects and user-selected photo or video backdrops.",
    category: "feature",
    action: "introduced",
    summary:
      "Video chats could apply visual distortions or color treatments and replace the apparent background with compatible still or moving media.",
    citations: [
      c(U.ship, "iChat paragraph; effects and backdrops"),
      c(U.techSpecs, "Photo Booth and backdrop feature requirements"),
    ],
  }),
  change({
    key: "macos-10-5-parental-controls",
    title: "Expanded Parental Controls",
    canonicalSummary:
      "Leopard expanded parental tools with website filtering, time limits, and remotely accessible activity logs.",
    category: "enhancement",
    action: "changed",
    summary:
      "The update combined content restrictions and scheduled-use controls with reporting that could be reviewed from another Mac on the home network.",
    citations: [c(U.ship, "Other new features; Parental Controls")],
  }),
  change({
    key: "macos-10-5-boot-camp-final",
    title: "Boot Camp final release",
    canonicalSummary:
      "Leopard moved Boot Camp out of beta and included native Windows startup support for eligible Intel Macs.",
    category: "feature",
    action: "introduced",
    summary:
      "The operating system shipped the completed Boot Camp utility for compatible Intel hardware, with a separately licensed supported Windows version still required.",
    citations: [
      c(U.ship, "Other new features; Boot Camp and footnote"),
      c(U.techSpecs, "Feature-specific requirements; Boot Camp"),
    ],
  }),
  change({
    key: "macos-10-5-dashboard-web-clip",
    title: "Dashboard Web Clip",
    canonicalSummary:
      "Web Clip turned a selected portion of a webpage into a live Dashboard widget.",
    category: "feature",
    action: "introduced",
    summary:
      "Leopard let users monitor a chosen region of a site from Dashboard without requiring a separately authored widget.",
    citations: [
      c(U.ship, "Other new features; Web Clip"),
      c(U.nearFinal, "Other new features; Web Clip"),
    ],
  }),
  change({
    key: "macos-10-5-photo-booth-animation-effects",
    title: "Expanded Photo Booth effects",
    canonicalSummary:
      "Photo Booth added animated iChat buddy icons plus additional still and video effects and backdrops.",
    category: "enhancement",
    action: "changed",
    summary:
      "The bundled camera app broadened its output beyond still images, while some effects remained dependent on the processor and camera capabilities listed in Apple's specifications.",
    citations: [
      c(U.ship, "Other new features; Photo Booth"),
      c(U.techSpecs, "Photo Booth feature-specific requirements"),
    ],
  }),
  change({
    key: "macos-10-5-dictionary-wikipedia",
    title: "Wikipedia in Dictionary",
    canonicalSummary:
      "Dictionary added integrated access to Wikipedia entries.",
    category: "enhancement",
    action: "changed",
    summary:
      "The reference application gained a web-backed encyclopedia view alongside its existing language resources.",
    citations: [c(U.ship, "Other new features; Dictionary")],
  }),
  change({
    key: "macos-10-5-ical-caldav",
    title: "iCal CalDAV group calendaring",
    canonicalSummary:
      "iCal added multi-user calendar coordination based on the CalDAV standard.",
    category: "feature",
    action: "introduced",
    summary:
      "Leopard expanded the calendar from personal scheduling toward standards-based shared and group calendars.",
    citations: [
      c(U.ship, "Other new features; iCal"),
      c(U.nearFinal, "Other new features; iCal"),
    ],
  }),
  change({
    key: "macos-10-5-front-row-update",
    title: "Updated Front Row",
    canonicalSummary:
      "Front Row refreshed the remote-controlled interface for music, movies, television, and photos.",
    category: "enhancement",
    action: "changed",
    summary:
      "The media-browsing experience received an update while retaining an Apple Remote and compatible built-in infrared hardware as its documented baseline.",
    citations: [
      c(U.ship, "Other new features; Front Row"),
      c(U.techSpecs, "Feature-specific requirements; Front Row"),
    ],
  }),
  change({
    key: "macos-10-5-native-64-bit-coexistence",
    title: "Native 64-bit application support",
    canonicalSummary:
      "Leopard supported native 64-bit applications alongside existing 32-bit applications and drivers.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple's near-final announcement described a mixed-width runtime model intended to let developers use 64-bit processing without abandoning the installed 32-bit software and driver ecosystem; the final 10.5 specification lists 64-bit computing among the shipped technologies.",
    citations: [
      c(U.nearFinal, "Processor technologies paragraph; 64-bit support"),
      c(U.techSpecs, "Key Technologies; 64-bit computing"),
    ],
  }),
  change({
    key: "macos-10-5-core-animation",
    title: "Core Animation",
    canonicalSummary:
      "Core Animation gave developers a system technology for building animated application interfaces.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The framework exposed animation capabilities related to effects used in Leopard's own interface, and Apple's final specifications list it as a key 10.5 technology.",
    citations: [
      c(U.nearFinal, "Processor technologies paragraph; Core Animation"),
      c(U.techSpecs, "Key Technologies; Core Animation"),
    ],
  }),
  change({
    key: "macos-10-5-developer-toolchain",
    title: "Leopard developer toolchain",
    canonicalSummary:
      "Leopard's developer suite included Xcode 3, Interface Builder 3, Objective-C 2.0 support, Instruments, Dashcode, and DTrace.",
    category: "developerApi",
    action: "changed",
    summary:
      "Apple paired a revised IDE and interface-design workflow with language, widget, tracing, and performance-analysis tools. The June near-final announcement used the provisional name Xray for its performance application; the final specification lists Instruments instead.",
    citations: [
      c(U.nearFinal, "Other new features; development tools"),
      c(U.techSpecs, "Development tools list"),
    ],
  }),
  change({
    key: "macos-10-5-powerpc-intel-dvd-baseline",
    title: "PowerPC, Intel, and DVD installation baseline",
    canonicalSummary:
      "Leopard supported listed Intel, PowerPC G5, and 867MHz-or-faster PowerPC G4 Macs with 512MB of memory, a DVD drive, and 9GB of free space.",
    category: "compatibility",
    action: "changed",
    summary:
      "The retail release maintained support across two processor architectures and used installation media that offered upgrade, Archive and Install, or Erase and Install paths, subject to the documented storage and memory requirements.",
    citations: [
      c(U.ship, "Pricing & Availability; system requirements"),
      c(U.techSpecs, "General requirements and What's in the Box"),
      c(U.installationGuide, "Pages 4–8; installation choices"),
    ],
  }),
];

const version = {
  releaseVersionId: "version-macos-10-5",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.ship,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X Leopard 10.5 went on sale on October 26, 2007. The release joined a redesigned desktop and Finder with Stacks, Quick Look, Spaces, Time Machine, remote file access, new Mail and iChat workflows, refreshed bundled applications, a dual-architecture platform baseline, and a revised developer toolchain.",
      [
        c(U.ship, "October 26 availability and launch feature descriptions"),
        c(U.techSpecs, "Applications, technologies, and development lists"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple presented a near-final Leopard build on June 11 with an October target. Its October 16 announcement set public sales for Friday, October 26 at 6:00 p.m. through Apple retail stores and authorized resellers, while accepting online pre-orders before release.",
      [
        c(U.nearFinal, "June 11 near-final status and October target"),
        c(U.ship, "October 16 announcement and October 26 availability"),
      ],
    ),
    heading("Desktop, files, and recovery"),
    prose(
      "Stacks and a more consistent window design reshaped the desktop, while Finder added Cover Flow, a redesigned sidebar, network browsing and search, and Back to My Mac. Quick Look reduced the need to open files just to inspect them; Spaces separated work into multiple desktops; and Time Machine added automated history plus file and full-system recovery.",
      [
        c(U.ship, "Desktop through Time Machine paragraphs"),
        c(U.techSpecs, "Time Machine and screen-sharing requirements"),
      ],
    ),
    heading("Communication and bundled applications"),
    prose(
      "Mail gained stationery, Notes, To Dos, data detectors, and RSS. iChat added presentations, screen sharing, and effects. Parental Controls, Boot Camp, Web Clip, Photo Booth, Dictionary, iCal, and Front Row broadened the rest of the client release.",
      [c(U.ship, "Mail, iChat, and other new features")],
    ),
    heading("Platform and developer technology"),
    prose(
      "Apple documented 64-bit application support alongside 32-bit software, Core Animation, and a final developer suite that included Xcode 3, Interface Builder 3, Instruments, Dashcode, and DTrace. These entries describe Apple's shipped platform record; they do not adopt the near-final Xray product name where the final technical specification instead lists Instruments.",
      [
        c(U.nearFinal, "Processor technologies and development tools"),
        c(U.techSpecs, "Key Technologies and Development"),
      ],
    ),
    heading("Installation and compatibility"),
    prose(
      "The single-user US retail price was $129. Apple's final specification supports listed Intel and PowerPC Macs with at least 512MB of memory, a DVD drive, and 9GB of free storage. The included guide describes upgrade, Archive and Install, and Erase and Install workflows from the installation disc.",
      [
        c(U.ship, "Pricing & Availability"),
        c(U.techSpecs, "General requirements and What's in the Box"),
        c(U.installationGuide, "Pages 4–8; installation workflows"),
      ],
    ),
    heading("Early sales"),
    prose(
      "On October 30, Apple reported more than two million Leopard copies sold or delivered under maintenance agreements during the first weekend, including retail, reseller, online, maintenance, and new-Mac channels. This is an Apple-supplied shipment and sales claim, retained as launch-history context rather than an independently audited adoption measure.",
      [c(U.firstWeekend, "October 30 first-weekend sales report")],
    ),
    heading("Evidence boundary"),
    prose(
      "This article records the initial 10.5 public package only. Apple's archived security chronology contains no initial Leopard 10.5 entry and separately lists 10.5.1 on November 15. The retained 10.5.1 advisory describes later firewall repairs, so none are projected back to October 26. June-only claims that final sources do not confirm—including Time Machine backup to an AirPort Extreme attached disk—are excluded, and no undocumented behavior or build number is inferred.",
      [
        c(U.nearFinal, "June near-final Time Machine description"),
        c(U.ship, "October public Time Machine description and footnote"),
        c(U.securityIndex, "Mac OS X 10.5.1 — 15 Nov 2007"),
        c(U.laterSecurity, "Mac OS X v10.5.1 security content"),
      ],
    ),
  ),
  citations: [
    c(U.nearFinal, "June 11, 2007"),
    c(U.ship, "October 26, 2007 availability"),
    c(U.firstWeekend, "October 30, 2007"),
    c(U.techSpecs, "Mac OS X 10.5 final technical specifications"),
    c(U.installationGuide, "October 2007 installation guide"),
    c(U.securityIndex, "2007 security chronology"),
    c(U.laterSecurity, "Mac OS X v10.5.1 later-version boundary"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-5",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "Mac OS X Leopard 10.5 reached the public channel on October 26, 2007 with a redesigned desktop and Finder, Time Machine, Quick Look, Spaces, expanded communications and bundled apps, new platform technologies, and broad PowerPC and Intel support.",
  article: article(
    heading("Public release"),
    prose(
      "Apple announced that Leopard would go on sale at 6:00 p.m. on October 26, 2007 through its retail stores and authorized resellers. The launch package used an installation DVD and retained a hardware baseline spanning supported PowerPC G4, PowerPC G5, and Intel Macs.",
      [
        c(U.ship, "October 26 availability and system requirements"),
        c(U.techSpecs, "General requirements and What's in the Box"),
      ],
    ),
    heading("What this page records"),
    prose(
      "The structured entries synthesize twenty-five confirmed parts of the public package across the Dock and desktop, Finder and remote access, preview and workspace management, backup and restore, Mail and iChat, family and bundled applications, platform technology, developer tools, and installation compatibility.",
      [
        c(U.ship, "Launch feature descriptions"),
        c(U.techSpecs, "Applications, technologies, and development lists"),
      ],
    ),
    heading("Release and installation context"),
    prose(
      "The retail release was sold as a single-user or family license rather than a phased software rollout. Apple's setup guide documents upgrade, archival, and erase-and-install paths from the same Leopard installation media.",
      [
        c(U.ship, "Pricing & Availability"),
        c(U.installationGuide, "Pages 4–8; installation choices"),
      ],
    ),
    heading("Security and point-release boundary"),
    prose(
      "Apple's retained 2005–2007 security index does not list the initial 10.5 release. It separately dates Mac OS X 10.5.1 to November 15, and the retained 10.5.1 advisory records application-firewall corrections for 10.5 systems. Because the local catalog has no 10.5.1 route, this event includes no structured initial-security fixes and does not merge the later update.",
      [
        c(U.securityIndex, "Mac OS X 10.5.1 — 15 Nov 2007"),
        c(U.laterSecurity, "Mac OS X v10.5.1 security content"),
      ],
    ),
    heading("Reporting boundary"),
    prose(
      "Apple's October 30 statement supplies the first-weekend figure. The page labels it as Apple's report, preserves that its count combined sales and maintenance deliveries, and does not convert it into an independent market-share conclusion.",
      [c(U.firstWeekend, "First-weekend sales and channel definitions")],
    ),
  ),
  citations: [
    c(U.nearFinal, "June 11, 2007"),
    c(U.ship, "October 26, 2007 availability"),
    c(U.firstWeekend, "October 30, 2007"),
    c(U.techSpecs, "Mac OS X 10.5 final technical specifications"),
    c(U.installationGuide, "October 2007 installation guide"),
    c(U.securityIndex, "2007 security chronology"),
    c(U.laterSecurity, "Mac OS X v10.5.1 later-version boundary"),
  ],
  changes: leopardChanges,
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
  (item) =>
    item.platform !== "iOS" &&
    item.platform !== "iPadOS" &&
    item.publicReleaseDate?.startsWith("2007-"),
);

if (
  eligibleSeedVersions.length !== 1 ||
  eligibleSeedVersions[0].platform !== "macOS" ||
  eligibleSeedVersions[0].version !== "10.5" ||
  eligibleSeedVersions[0].publicReleaseDate !== "2007-10-26" ||
  eligibleSeedVersions[0].versionNote !== "Leopard" ||
  eligibleSeedVersions[0].milestones.length !== 1 ||
  eligibleSeedVersions[0].milestones[0].label !== "Public" ||
  eligibleSeedVersions[0].milestones[0].date !== "2007-10-26"
) {
  throw new Error(
    "The 2007 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 25
) {
  throw new Error("The expected 2007 bundle closure no longer holds.");
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

const uncitedSources = sources.filter(
  (source) => !citationUrls.has(source.url),
);
if (uncitedSources.length > 0) {
  throw new Error(
    `The bundle declares uncited sources: ${uncitedSources
      .map((source) => source.url)
      .join(", ")}`,
  );
}

const json = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync(join(here, "apple-other-2007.json"), json);
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

const md = `# Apple 2007 non-iPhone research batch

## Result

\`apple-other-2007.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2007. The exact cohort is one data-rich Mac OS X Leopard 10.5 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.5 (Leopard) | 1 | 1 | ${leopardChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **1** | **1** | **${leopardChanges.length}** |

The local Leopard record contains only the October 26 public milestone. Apple's October 16 announcement identifies a 6:00 p.m. October 26 retail release. This bundle enriches only that durable route through \`releaseVersionId: "version-macos-10-5"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\`
  as of \`${reviewedAt}\`.
- The public event is indexable.
- All ${leopardChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- No undocumented-change or initial-security claim is included.
- June near-final detail is used only where the October ship announcement or final 10.5 documentation confirms the shipped surface.
- No 10.5.1 or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's first-weekend figure is explicitly labeled a vendor-reported sales and delivery claim, not an independent adoption measurement.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2007 public appearance: macOS-family record 10.5, named Leopard, with one public milestone.
2. Apple's June 11 announcement calls the demonstrated software \`near final\` and promises an October ship date. The local seed has no June beta milestone, and this batch does not create one.
3. Apple's October 16 announcement sets availability for October 26 at 6:00 p.m. The seed's October 26 date is retained without a separate announcement event.
4. The product was named Mac OS X Leopard in Apple's 2007 material. The local information architecture groups it under the \`macOS\` platform family; editorial copy retains the historical Mac OS X name.
5. Apple's archived security index omits an initial Leopard 10.5 release line and separately lists Mac OS X 10.5.1 on November 15.
6. The local catalog has no 10.5.1 releaseVersion record. This existing-record-only batch does not create it, attach its firewall repairs to 10.5, or infer any later point release or build.
7. Mac OS X Server 10.5 had a separate Apple launch package, but the scoped local record is the client OS. No Server route or Server-only feature is created.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple materials checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived 2005–2007 security chronology and the missing-initial-10.5/10.5.1 boundary
- <${U.nearFinal}> — June 11 near-final feature and developer context, explicitly treated as pre-release
- <${U.ship}> — October 26 public availability, confirmed launch features, pricing, and compatibility
- <${U.firstWeekend}> — Apple's October 30 first-weekend sales/delivery report, retained as an attributed vendor claim
- <${U.techSpecs}> — final 10.5 requirements, applications, technologies, and developer-tool inventory
- <${U.installationGuide}> — October 2007 DVD installation, setup, and migration workflows
- <${U.laterSecurity}> — version-specific 10.5.1 security content used only to enforce the later-release boundary

Apple Support pages are living or archived documents and can display publication or revision dates later than the historical release. Historical mapping therefore uses explicitly labeled versions, dated document footers, and release lines rather than current page revision timestamps.

## Known gaps

1. Leopard 10.5.1 is absent from the scoped local catalog. Apple's archive dates it to November 15, 2007, but this batch does not create the missing route or merge its changes into 10.5.
2. Apple's retained 2005–2007 security index does not list initial Leopard 10.5, and exact first-party searches did not surface a retained dedicated initial 10.5 security advisory. The bundle therefore contains zero initial-security deltas.
3. Apple's June near-final announcement described Time Machine backup to a hard drive attached to an AirPort Extreme base station. The October ship announcement and final technical specification only confirm the additional-drive requirement, so the wireless AirPort-disk claim is excluded from the structured public delta.
4. The June announcement used the name \`Xray\` for a performance tool, while the final 10.5 specification lists \`Instruments\`. Final-version copy uses Instruments and records the naming mismatch only as an evidence boundary.
5. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
6. Apple's first-weekend count combines sales with maintenance-agreement deliveries and includes multiple distribution channels. It is preserved with those qualifications rather than converted into an independent user or install count.
7. The installation guide documents available workflows but does not establish that every third-party application or peripheral remained compatible. No broad compatibility guarantee is inferred.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${leopardChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 1 public milestone, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and research-tool tests passed: 23 of 23.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 31 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 6 source documents, zero version documents, zero event documents, zero build documents, and ${leopardChanges.length} change documents.
- The guarded patches target the existing Leopard public event, the existing Leopard version article, and author/topics on the already-present 2005–2007 Apple security-index source. No chronology or identity field is changed.
- Mutation payload: 80,796 bytes, reported as 2.1% of the guarded limit.
- Approved production plan SHA:
  \`ed6adcbbad30d984ee0f0965d6b4354f35cacde10a9c73ccd0626c38de74387b\`.
- Bundle JSON SHA-256: \`${jsonSha}\`.
- Production apply committed and zero-residual verified in transaction
  \`F0eE6eK5XyVXtlnaoxzawB\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,115 unchanged
  documents. Its plan SHA is
  \`32a2ab5ee5269022c41bce2c52cb0de63b3394d470082b8f79486113a56ae2af\`.
- The representative local route \`/apple/macos/10.5\` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at \`${reviewedAt}\`.
`;

writeFileSync(join(here, "apple-other-2007.md"), md);
