import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T05:59:50Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/104189",
  developerPreview:
    "https://www.apple.com/newsroom/2008/06/09Apple-Previews-Mac-OS-X-Snow-Leopard-to-Developers/",
  juneUnveiling:
    "https://www.apple.com/newsroom/2009/06/08Apple-Unveils-Mac-OS-X-Snow-Leopard/",
  launch:
    "https://www.apple.com/newsroom/2009/08/24Apple-to-Ship-Mac-OS-X-Snow-Leopard-on-August-28/",
  technicalSpecifications: "https://support.apple.com/en-us/112591",
  accessibilityVpat:
    "https://www.apple.com/accessibility/pdf/Mac_OS_X_10.6_Snow_Leopard_VPAT.pdf",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (15-Jan-2008 to 03-Dec-2009)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Apple software",
      "2008",
      "2009",
      "release chronology",
      "security updates",
    ],
  },
  {
    url: U.developerPreview,
    title: "Apple Previews Mac OS X Snow Leopard to Developers",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2008-06-09T00:00:00.000Z",
    topics: ["Mac OS X", "Snow Leopard", "10.6", "developer preview"],
  },
  {
    url: U.juneUnveiling,
    title: "Apple Unveils Mac OS X Snow Leopard",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2009-06-08T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Snow Leopard",
      "10.6",
      "planned availability",
      "features",
      "accessibility",
    ],
  },
  {
    url: U.launch,
    title: "Apple to Ship Mac OS X Snow Leopard on August 28",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2009-08-24T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Snow Leopard",
      "10.6",
      "public availability",
      "features",
      "pricing",
    ],
  },
  {
    url: U.technicalSpecifications,
    title: "Mac OS X v10.6 Snow Leopard - Technical Specifications",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Mac OS X",
      "Snow Leopard",
      "10.6",
      "technical specifications",
      "system requirements",
    ],
  },
  {
    url: U.accessibilityVpat,
    title: "Mac OS X version 10.6 Snow Leopard VPAT (8-2009)",
    publisher: "Apple Accessibility",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Mac OS X",
      "Snow Leopard",
      "10.6",
      "accessibility",
      "VoiceOver",
      "Multi-Touch",
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
      "Matched Apple's dated Snow Leopard public-launch announcement or contemporaneous 10.6 documentation to the existing audited public event; earlier material is retained only when a launch-era source confirms the shipped behavior or explains a superseded pre-release claim.",
    citations,
  };
}

const snowLeopardChanges = [
  change({
    key: "macos-10-6-finder-responsiveness",
    title: "Finder responsiveness refinements",
    canonicalSummary:
      "Snow Leopard included Finder refinements that Apple described as making the file manager more responsive.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple presented Finder responsiveness as part of the release's system-wide refinement program. The claim remains attributed to Apple rather than being treated as an independent performance measurement.",
    citations: [c(U.launch, "Launch refinements; responsive Finder")],
  }),
  change({
    key: "macos-10-6-mail-performance",
    title: "Mail loading performance",
    canonicalSummary:
      "Apple said Snow Leopard's Mail could load messages up to twice as fast as Mail on Mac OS X 10.5.8 in its August 2009 prerelease testing.",
    category: "enhancement",
    action: "changed",
    summary:
      "The public announcement reported an up-to-two-times message-loading result from Apple's own prerelease comparison. Hardware, network, file size, data set, and other variables were explicitly identified as factors, so this is a vendor benchmark rather than a universal result.",
    citations: [
      c(U.launch, "Launch refinements and first performance-testing footnote"),
      c(
        U.juneUnveiling,
        "June Mail performance figures",
        "The June figures were pre-release claims and are retained only as superseded context; the August launch statement controls.",
      ),
    ],
  }),
  change({
    key: "macos-10-6-time-machine-initial-backup",
    title: "Faster initial Time Machine backup",
    canonicalSummary:
      "Apple said Snow Leopard could make Time Machine's initial backup up to 80 percent faster in its August 2009 prerelease testing.",
    category: "enhancement",
    action: "changed",
    summary:
      "The launch material raised Apple's earlier pre-release estimate and reported an up-to-80-percent improvement for the first backup. It remains a qualified Apple test result, and Time Machine still required a separate drive or Time Capsule.",
    citations: [
      c(U.launch, "Launch refinements and first performance-testing footnote"),
      c(
        U.juneUnveiling,
        "June up-to-50-percent Time Machine claim",
        "Included only to document the figure superseded by the final announcement.",
      ),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements; Time Machine",
      ),
    ],
  }),
  change({
    key: "macos-10-6-dock-expose",
    title: "Exposé integration in the Dock",
    canonicalSummary:
      "Snow Leopard integrated Exposé window controls into the Dock.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release connected window overview behavior to Dock interactions, making Exposé part of an existing application-launching and switching surface.",
    citations: [c(U.launch, "Launch refinements; Dock and Exposé")],
  }),
  change({
    key: "macos-10-6-quicktime-x-player",
    title: "QuickTime X player",
    canonicalSummary:
      "Snow Leopard introduced QuickTime X with a redesigned player for viewing, recording, trimming, and sharing video.",
    category: "feature",
    action: "introduced",
    summary:
      "QuickTime X consolidated common playback and lightweight creation tasks in a redesigned application. Movie capture depended on a compatible built-in or external camera, and hardware-accelerated H.264 playback required an NVIDIA 9400M graphics processor.",
    citations: [
      c(U.launch, "Launch refinements; QuickTime X"),
      c(
        U.technicalSpecifications,
        "QuickTime X movie capture and H.264 hardware-acceleration requirements",
      ),
    ],
  }),
  change({
    key: "macos-10-6-safari-64-bit-performance",
    title: "64-bit Safari 4",
    canonicalSummary:
      "Snow Leopard shipped a 64-bit Safari 4 that Apple said was up to 50 percent faster than the 32-bit build in its August 2009 SunSpider testing.",
    category: "enhancement",
    action: "changed",
    summary:
      "Safari moved into the release's 64-bit system-application set. Apple's speed figure compared prerelease 64-bit and 32-bit Safari 4 with SunSpider and was explicitly subject to system, network, and other variables.",
    citations: [
      c(U.launch, "Safari refinement and second performance-testing footnote"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements; 64-bit support",
      ),
    ],
  }),
  change({
    key: "macos-10-6-safari-plugin-crash-resilience",
    title: "Safari plug-in crash resilience",
    canonicalSummary:
      "Apple described Snow Leopard's Safari 4 as resistant to crashes caused by plug-ins.",
    category: "enhancement",
    action: "changed",
    summary:
      "The browser was designed so a failing plug-in was less likely to take down the full Safari application. Apple's launch page confirms the resilience goal but does not supply a reproducible failure-rate comparison.",
    citations: [c(U.launch, "Launch refinements; Safari plug-in resilience")],
  }),
  change({
    key: "macos-10-6-install-footprint",
    title: "Smaller installed footprint",
    canonicalSummary:
      "Apple said Snow Leopard was half the size of the prior release and could free up to 7 GB after installation.",
    category: "enhancement",
    action: "changed",
    summary:
      "The public launch statement used an up-to-7-GB space-recovery figure. A June announcement had said up to 6 GB, so the later public figure controls and neither number is presented as guaranteed on every Mac.",
    citations: [
      c(U.launch, "Installed-size and up-to-7-GB statement"),
      c(
        U.juneUnveiling,
        "June up-to-6-GB statement",
        "Included only as a superseded pre-release figure.",
      ),
    ],
  }),
  change({
    key: "macos-10-6-system-apps-64-bit",
    title: "64-bit system applications",
    canonicalSummary:
      "Snow Leopard moved Finder, Mail, iCal, iChat, and Safari to 64-bit system applications.",
    category: "behavior",
    action: "changed",
    summary:
      "Several high-use built-in applications shipped as 64-bit software for the first time in Apple's OS X line. This claim is limited to the applications Apple named and does not imply that every included application was 64-bit.",
    citations: [c(U.launch, "64-bit system-application list")],
  }),
  change({
    key: "macos-10-6-64-bit-platform-compatibility",
    title: "64-bit platform support with 32-bit app compatibility",
    canonicalSummary:
      "Snow Leopard expanded 64-bit processor support while retaining compatibility with 32-bit applications.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple positioned the 64-bit work as a way to use larger memory configurations and improve platform performance and security without requiring existing 32-bit applications to disappear. Actual 64-bit support required a Mac with a 64-bit processor.",
    citations: [
      c(U.launch, "64-bit processor support and 32-bit app compatibility"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements; 64-bit support",
      ),
    ],
  }),
  change({
    key: "macos-10-6-grand-central-dispatch",
    title: "Grand Central Dispatch",
    canonicalSummary:
      "Snow Leopard introduced Grand Central Dispatch as a developer technology for using multicore processors.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Grand Central Dispatch supplied a system-level programming model intended to help software distribute work across multiple processor cores. Apple listed a multicore processor as a requirement for the technology.",
    citations: [
      c(U.launch, "Core technologies; Grand Central Dispatch"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements and key technologies; Grand Central Dispatch",
      ),
      c(
        U.developerPreview,
        "2008 code-named Grand Central preview",
        "Used only to document the technology's pre-launch development trail.",
      ),
    ],
  }),
  change({
    key: "macos-10-6-opencl",
    title: "OpenCL general-purpose GPU computing",
    canonicalSummary:
      "Snow Leopard introduced OpenCL so developers could use supported graphics processors for computing beyond graphics rendering.",
    category: "developerApi",
    action: "introduced",
    summary:
      "OpenCL exposed a C-based, open-standard approach to general-purpose GPU work. Support was hardware-specific at launch: Apple's retained specification names a finite set of NVIDIA and ATI graphics processors rather than every Snow Leopard-compatible Mac.",
    citations: [
      c(U.launch, "Core technologies; OpenCL"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements and key technologies; OpenCL",
      ),
      c(
        U.developerPreview,
        "2008 OpenCL preview",
        "Used only as development context for the launch-confirmed technology.",
      ),
    ],
  }),
  change({
    key: "macos-10-6-exchange-mail",
    title: "Built-in Exchange email support",
    canonicalSummary:
      "Snow Leopard added Microsoft Exchange Server 2007 email support to Mail.",
    category: "feature",
    action: "introduced",
    summary:
      "Mail could send and receive Exchange email without a separate desktop client. Apple's technical specification required Exchange Server 2007 Service Pack 1 Update Rollup 4, with Autodiscovery enabled for automatic setup.",
    citations: [
      c(U.launch, "Exchange support; Mail"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements; Exchange Support",
      ),
    ],
  }),
  change({
    key: "macos-10-6-exchange-calendar",
    title: "Exchange meeting support in iCal",
    canonicalSummary:
      "Snow Leopard added Exchange Server 2007 meeting invitations to iCal.",
    category: "feature",
    action: "introduced",
    summary:
      "The built-in calendar could create and respond to Exchange meeting invitations. The same Exchange server and Autodiscovery limitations documented for the release applied to this integration.",
    citations: [
      c(U.launch, "Exchange support; iCal and meeting invitations"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements; Exchange Support",
      ),
    ],
  }),
  change({
    key: "macos-10-6-exchange-contacts",
    title: "Exchange directory support in Address Book",
    canonicalSummary:
      "Snow Leopard added Exchange Server 2007 contacts and global address lists to Address Book.",
    category: "feature",
    action: "introduced",
    summary:
      "Address Book could search and manage Exchange contacts, including access to the organization's global address list, within the built-in Mac contact application.",
    citations: [
      c(U.launch, "Exchange support; Address Book and global address lists"),
      c(
        U.technicalSpecifications,
        "Feature-specific requirements; Exchange Support",
      ),
    ],
  }),
  change({
    key: "macos-10-6-exchange-spotlight-quick-look",
    title: "Exchange data in Spotlight and Quick Look",
    canonicalSummary:
      "Snow Leopard made supported Exchange information available to Spotlight search and Quick Look previews.",
    category: "enhancement",
    action: "changed",
    summary:
      "Exchange integration extended beyond the three client applications into OS X search and preview surfaces, allowing supported server-backed information to participate in established system workflows.",
    citations: [
      c(U.launch, "Exchange support; Spotlight and Quick Look integration"),
    ],
  }),
  change({
    key: "macos-10-6-voiceover-multitouch-navigation",
    title: "VoiceOver navigation with a Multi-Touch trackpad",
    canonicalSummary:
      "Snow Leopard integrated VoiceOver with compatible Multi-Touch trackpads for finger-based navigation of windows and the desktop.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple's June unveiling identified trackpad navigation as a new Snow Leopard accessibility capability. Its August 2009 accessibility record confirms VoiceOver as the built-in screen reader and documents flick, drag, pinch, and tap input on Macs equipped with a Multi-Touch trackpad.",
    citations: [
      c(U.juneUnveiling, "Accessibility features; VoiceOver and Multi-Touch"),
      c(
        U.accessibilityVpat,
        "Pages 1–2 and 9–10; VoiceOver and Multi-Touch gesture support",
      ),
    ],
  }),
  change({
    key: "macos-10-6-intel-installation-baseline",
    title: "Intel-only installation baseline",
    canonicalSummary:
      "Snow Leopard required an Intel-based Mac, 1 GB of memory, 5 GB of available storage, and a DVD drive for installation.",
    category: "compatibility",
    action: "changed",
    summary:
      "The release's retained technical specification establishes the minimum computer, memory, storage, and installation-media requirements. Individual features imposed additional hardware, peripheral, network, or server requirements.",
    citations: [
      c(U.launch, "Pricing & Availability; Intel and memory baseline"),
      c(U.technicalSpecifications, "General requirements"),
    ],
  }),
  change({
    key: "macos-10-6-leopard-tiger-upgrade-path",
    title: "Leopard and Tiger upgrade paths",
    canonicalSummary:
      "Apple sold Snow Leopard as a direct upgrade for Leopard users, while Intel Mac users on Tiger were directed to a Mac Box Set bundle.",
    category: "compatibility",
    action: "changed",
    summary:
      "The initial release used retail and authorized-reseller distribution with online preorders and installation media, not a modern over-the-air rollout. Leopard users could buy Snow Leopard alone; eligible Tiger users were offered a bundle that also contained iLife '09 and iWork '09.",
    citations: [
      c(U.launch, "Pricing & Availability; Leopard and Tiger upgrade paths"),
      c(U.technicalSpecifications, "What's in the Box; installation DVD"),
    ],
  }),
];

const version = {
  releaseVersionId: "version-macos-10-6",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X Snow Leopard 10.6 went on sale August 28, 2009. Instead of centering its public story on a long list of new end-user applications, Apple framed the release around refinements, 64-bit system work, multicore and GPU developer technologies, QuickTime X, built-in Exchange support, accessibility, and a smaller installation footprint.",
      [
        c(U.launch, "August 28 availability and launch overview"),
        c(U.juneUnveiling, "June product framing and accessibility overview"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple previewed Snow Leopard to developers on June 9, 2008 and said it was expected in about a year. A June 2009 unveiling then announced a September target. The August 24 launch announcement superseded that schedule and established August 28 as the public-sale date; the local milestone labeled Beta 1 is therefore treated as a developer preview, not a public release page.",
      [
        c(U.developerPreview, "June 9, 2008 developer preview"),
        c(U.juneUnveiling, "June 8, 2009 planned September availability"),
        c(U.launch, "August 24 announcement and August 28 sale date"),
      ],
    ),
    heading("Refinements and core technologies"),
    prose(
      "The retained launch record confirms Finder, Mail, Time Machine, Dock, QuickTime X, Safari, storage-footprint, and 64-bit changes. Grand Central Dispatch and OpenCL expanded the platform's multicore and supported-GPU programming models, but their actual use depended on compatible processors and graphics hardware.",
      [
        c(U.launch, "Launch refinements and core technologies"),
        c(
          U.technicalSpecifications,
          "Feature-specific requirements and key technologies",
        ),
      ],
    ),
    heading("Exchange integration"),
    prose(
      "Mail, iCal, and Address Book gained built-in Exchange Server 2007 workflows for email, meetings, contacts, and global address lists. Supported Exchange data could also participate in Spotlight and Quick Look. Apple's retained specification narrows compatibility to Exchange Server 2007 SP1 Update Rollup 4 and requires Autodiscovery for automatic setup.",
      [
        c(U.launch, "Exchange feature description"),
        c(
          U.technicalSpecifications,
          "Feature-specific requirements; Exchange Support",
        ),
      ],
    ),
    heading("Accessibility"),
    prose(
      "Apple's June unveiling described VoiceOver navigation through a compatible Multi-Touch trackpad as new in Snow Leopard. The August 2009 accessibility template confirms the 10.6 scope, VoiceOver's built-in role, and gesture input on supported trackpads. The June page also announced wireless and multiple braille-display support, but that more specific claim is retained as article context rather than a structured change because it is not repeated in the surviving August template.",
      [
        c(U.juneUnveiling, "Accessibility feature announcement"),
        c(
          U.accessibilityVpat,
          "Pages 1–2 and 9–10; 10.6 scope, VoiceOver, and gesture support",
        ),
      ],
    ),
    heading("Distribution and compatibility"),
    prose(
      "Snow Leopard was sold for installation from DVD through Apple retail, authorized resellers, and online preorder channels. Apple offered a direct Leopard upgrade and a separate Mac Box Set route for Intel-based Tiger systems. The general installation baseline was an Intel Mac, 1 GB of memory, 5 GB of free storage, and a DVD drive, with further requirements attached to individual features.",
      [
        c(U.launch, "Pricing & Availability"),
        c(
          U.technicalSpecifications,
          "General and feature-specific requirements",
        ),
      ],
    ),
    heading("Performance-claim boundary"),
    prose(
      "Mail, Time Machine, Safari, Finder, and disk-space statements are preserved as attributed Apple claims. The final August material supersedes June's different Mail, Time Machine, and space figures, and Apple's test footnotes warn that performance varies with hardware, network conditions, files, data sets, and other factors.",
      [
        c(U.juneUnveiling, "June performance and storage claims"),
        c(U.launch, "Final performance claims and test footnotes"),
      ],
    ),
    heading("Security and version boundary"),
    prose(
      "No launch CVE group is inferred. Apple's archived 2008–2009 security chronology does not list Snow Leopard 10.6 on August 28; its first retained Snow Leopard system entry is 10.6.1 on September 10, followed by 10.6.2 on November 2. Those point releases have no existing local version route in this cohort and their fixes are not projected backward.",
      [
        c(
          U.securityIndex,
          "2009 security table; 10.6.1 and 10.6.2 entries and absence of an August 28 entry",
        ),
      ],
    ),
  ),
  citations: [
    c(U.developerPreview, "June 9, 2008 developer preview"),
    c(U.juneUnveiling, "June 8, 2009 unveiling"),
    c(U.launch, "August 24 announcement and August 28 availability"),
    c(U.technicalSpecifications, "Snow Leopard technical specifications"),
    c(U.accessibilityVpat, "August 2009 Snow Leopard VPAT"),
    c(U.securityIndex, "2008–2009 security chronology"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-6",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "Mac OS X Snow Leopard 10.6 went on sale August 28, 2009 with documented system refinements, 64-bit and developer-platform work, QuickTime X, Exchange integration, accessibility improvements, and an Intel-only installation baseline.",
  article: article(
    heading("Public release"),
    prose(
      "Apple announced on August 24 that Mac OS X Snow Leopard 10.6 would go on sale Friday, August 28 through its retail stores and authorized resellers, with online preorders already open. That dated announcement controls this public event and replaces the June plan to ship in September.",
      [
        c(U.launch, "Public-sale date and distribution channels"),
        c(U.juneUnveiling, "Superseded September availability plan"),
      ],
    ),
    heading("Confirmed shipped scope"),
    prose(
      "The structured entries cover the retained launch record's Finder, Mail, Time Machine, Dock, QuickTime X, Safari, installed-size, 64-bit, Grand Central Dispatch, OpenCL, Exchange, VoiceOver trackpad, installation, and upgrade-path claims. Technical specifications supply hardware and service limits where the launch announcement is broad.",
      [
        c(U.launch, "Launch refinements through Pricing & Availability"),
        c(
          U.technicalSpecifications,
          "General requirements, feature-specific requirements, and key technologies",
        ),
        c(U.juneUnveiling, "VoiceOver and Multi-Touch announcement"),
        c(U.accessibilityVpat, "10.6 accessibility and gesture record"),
      ],
    ),
    heading("Developer preview versus public evidence"),
    prose(
      "The June 9, 2008 milestone is explicitly documented by Apple as a developer preview. Its planned technologies provide development context, but no article, build number, beta change set, or public availability is attached to that non-public milestone. Only claims confirmed again by launch-era sources appear as public structured changes.",
      [
        c(U.developerPreview, "Developer-preview framing and planned scope"),
        c(U.launch, "Final public scope and availability"),
        c(U.technicalSpecifications, "Retained 10.6 technical scope"),
      ],
    ),
    heading("Pre-release figures superseded"),
    prose(
      "Apple's June and August pages use different benchmark and storage numbers. The June page reported separate Mail loading and search figures, an up-to-50-percent initial Time Machine improvement, and up to 6 GB recovered after installation; the final announcement instead reported Mail loading up to twice as fast, Time Machine up to 80 percent faster, and up to 7 GB recovered. The public entries use the later figures and keep both sets identified as Apple-authored claims.",
      [
        c(U.juneUnveiling, "June performance and space figures"),
        c(U.launch, "Final performance and space figures"),
      ],
    ),
    heading("Hardware and service limits"),
    prose(
      "Installing the system required an Intel Mac, 1 GB of memory, 5 GB of free space, and a DVD drive. OpenCL, 64-bit operation, Grand Central Dispatch, QuickTime capture and acceleration, Time Machine, and Exchange each had additional requirements, so the existence of a release-level feature does not imply support on every eligible Mac or server environment.",
      [
        c(
          U.technicalSpecifications,
          "General requirements and feature-specific requirements",
        ),
      ],
    ),
    heading("Accessibility evidence boundary"),
    prose(
      "VoiceOver trackpad navigation is included because Apple's June announcement identifies the integration as new and its August 2009 10.6 accessibility record documents both VoiceOver and Multi-Touch gesture input on supported hardware. The announcement's separate wireless and multiple braille-display statements are not promoted into structured changes because the retained August template does not repeat those specific claims.",
      [
        c(U.juneUnveiling, "VoiceOver, Multi-Touch, and braille statements"),
        c(
          U.accessibilityVpat,
          "Pages 1–2 and 9–10; VoiceOver and supported trackpad gestures",
        ),
      ],
    ),
    heading("Version and security boundary"),
    prose(
      "This page represents 10.6 only. Apple's archived security index first lists 10.6.1 on September 10 and 10.6.2 on November 2, while listing no Snow Leopard launch security entry on August 28. Neither point version exists as a local releaseVersion route, so this bundle creates neither and imports no later fixes or build identity.",
      [c(U.securityIndex, "2009 security table; 10.6.1 and 10.6.2 chronology")],
    ),
  ),
  citations: [
    c(U.developerPreview, "June 9, 2008 developer preview"),
    c(U.juneUnveiling, "June 8, 2009 unveiling"),
    c(U.launch, "August 28 public-sale announcement"),
    c(U.technicalSpecifications, "Snow Leopard technical specifications"),
    c(U.accessibilityVpat, "August 2009 Snow Leopard VPAT"),
    c(U.securityIndex, "2008–2009 security chronology"),
  ],
  changes: snowLeopardChanges,
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
    item.publicReleaseDate?.startsWith("2009-"),
);
const [eligible] = eligibleSeedVersions;

if (
  eligibleSeedVersions.length !== 1 ||
  eligible.platform !== "macOS" ||
  eligible.majorVersion !== 10 ||
  eligible.version !== "10.6" ||
  eligible.versionNote !== "Snow Leopard" ||
  eligible.publicReleaseDate !== "2009-08-28" ||
  eligible.milestones.length !== 2 ||
  eligible.milestones[0]?.label !== "Beta 1" ||
  eligible.milestones[0]?.date !== "2008-06-09" ||
  eligible.milestones[1]?.label !== "Public" ||
  eligible.milestones[1]?.date !== "2009-08-28"
) {
  throw new Error(
    "The 2009 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

const otherOwners = [];
for (const file of readdirSync(here).filter(
  (name) => name.endsWith(".json") && name !== "apple-other-2009.json",
)) {
  const candidate = JSON.parse(readFileSync(join(here, file), "utf8"));
  if (
    candidate.versions?.some(
      (item) => item.releaseVersionId === "version-macos-10-6",
    ) ||
    candidate.events?.some(
      (item) => item.target?.releaseVersionId === "version-macos-10-6",
    )
  ) {
    otherOwners.push(file);
  }
}
if (otherOwners.length > 0) {
  throw new Error(
    `The 2009 Snow Leopard route is already owned by: ${otherOwners.join(", ")}`,
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 19
) {
  throw new Error("The expected 2009 bundle closure no longer holds.");
}

if (
  Object.keys(bundle.events[0].target).sort().join(",") !==
    "releaseVersionId,routeAlias" ||
  bundle.events[0].target.releaseVersionId !== "version-macos-10-6" ||
  bundle.events[0].target.routeAlias !== "public"
) {
  throw new Error("The Snow Leopard event target is no longer durable.");
}

for (const item of snowLeopardChanges) {
  const isAccessibilityClaim =
    item.key === "macos-10-6-voiceover-multitouch-navigation";
  const hasPublicEvidence = item.citations.some(
    (citation) =>
      citation.url === U.launch || citation.url === U.technicalSpecifications,
  );
  const hasAccessibilityEvidence =
    isAccessibilityClaim &&
    item.citations.some((citation) => citation.url === U.juneUnveiling) &&
    item.citations.some((citation) => citation.url === U.accessibilityVpat);
  if (
    item.documentedStatus !== "documented" ||
    item.evidenceState !== "confirmed" ||
    item.inheritance !== "delta" ||
    (!hasPublicEvidence && !hasAccessibilityEvidence)
  ) {
    throw new Error(
      `Change ${item.key} is not a launch-era documented public delta.`,
    );
  }
}

if (
  snowLeopardChanges.some((item) =>
    `${item.key} ${item.title}`.toLowerCase().includes("braille"),
  )
) {
  throw new Error(
    "The retained August VPAT does not repeat the June braille specifics, so they cannot be a structured launch change.",
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

const json = `${JSON.stringify(bundle, null, 2)}\n`;
writeFileSync(join(here, "apple-other-2009.json"), json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const md = `# Apple 2009 non-iPhone research batch

## Result

\`apple-other-2009.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2009. The exact cohort is one data-rich Mac OS X Snow Leopard 10.6 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.6 (Snow Leopard) | 2 | 1 | ${snowLeopardChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **2** | **1** | **${snowLeopardChanges.length}** |

The local Snow Leopard record contains a June 9, 2008 milestone labeled \`Beta 1\` and an August 28, 2009 public milestone. Apple's June 2008 announcement precisely describes the first date as a developer preview. This bundle enriches only the existing public route through \`releaseVersionId: "version-macos-10-6"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\`
  as of \`${reviewedAt}\`.
- The public event is indexable.
- All ${snowLeopardChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- Structured claims cite Apple's final public-launch announcement or contemporaneous 10.6 documentation. The VoiceOver trackpad entry is supported by Apple's June new-feature announcement plus its August 2009 10.6 accessibility record.
- No undocumented-change claim is included.
- No developer-preview article, beta change set, or preview build is created.
- No 10.6.1, 10.6.2, or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's performance and disk-space statements remain attributed vendor claims, not independent measurements.
- Apple and Microsoft product names are used nominatively; no logos, screenshots, publisher artwork, or copied body text is included.

## Inventory, preview, and chronology boundaries

1. Seed closure is exact: macOS-family version 10.6, named Snow Leopard, is the only non-iOS/iPadOS record with a 2009 public appearance. It has exactly two local milestones.
2. No other checked-in research batch owns \`version-macos-10-6\`; the generator verifies sole ownership before writing this bundle.
3. Apple's June 9, 2008 page is explicitly a developer preview. It documents the development trail but does not establish a beta build, beta release-notes page, or public event.
4. Apple's June 8, 2009 page planned a September release. The August 24 page supersedes that schedule and establishes August 28 as the public-sale date.
5. Snow Leopard launched through retail, authorized-reseller, and online-preorder channels with DVD installation media. The record does not mischaracterize this as a modern phased or over-the-air rollout.
6. The June and August pages state different Mail, Time Machine, and recovered-space figures. Structured changes use the final August values and preserve June's figures only as superseded context.
7. Apple's June page announced VoiceOver trackpad integration plus wireless and multiple braille-display support. The August 2009 VPAT supports the VoiceOver/gesture record but does not repeat the specific braille statements, so only the former becomes a structured change.
8. The historical product name is Mac OS X Snow Leopard. The local information architecture groups the release under the \`macOS\` platform family while preserving Apple's contemporaneous naming in editorial prose.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple materials checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived 2008–2009 security chronology and the later 10.6.1/10.6.2 boundary
- <${U.developerPreview}> — June 2008 developer preview and planned technical direction
- <${U.juneUnveiling}> — June 2009 planned availability, pre-release figures, and accessibility announcement
- <${U.launch}> — August 2009 public availability, shipped scope, distribution, compatibility, and final performance figures
- <${U.technicalSpecifications}> — retained 10.6 general, hardware, service, and feature-specific requirements
- <${U.accessibilityVpat}> — August 2009 10.6 accessibility record for VoiceOver and supported trackpad gestures

Apple Support pages are archived or living documents and can display revision dates much later than the historical release. Mapping therefore uses the explicitly labeled version and release lines plus dated Newsroom pages, not a current page-revision timestamp.

## Known gaps and anomalies

1. Apple's archived security index does not list Mac OS X 10.6 as an August 28 security release. It first lists 10.6.1 on September 10 and 10.6.2 on November 2.
2. No surviving first-party, launch-specific 10.6 CVE advisory was found, so no launch security-fix group is inferred.
3. The security index documents 10.6.1 and 10.6.2, but neither point version has an existing local \`releaseVersion\` route. This bundle creates neither and imports no later change.
4. Apple's launch performance figures come from prerelease vendor testing with stated variability. They remain qualified Apple claims rather than independent benchmarks or guarantees.
5. The general 10.6 installation baseline did not guarantee every feature. OpenCL, 64-bit support, GCD, QuickTime capture and acceleration, Time Machine, and Exchange each had narrower hardware, peripheral, storage, or server requirements.
6. Apple's June accessibility announcement says Snow Leopard introduced wireless Bluetooth braille-display support and multiple braille-display connections, but the retained August VPAT does not repeat those specifics. They remain attributed context, not a structured launch delta.
7. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
8. Mac OS X Server Snow Leopard went on sale the same day as a separate product. Its server-only features are excluded from this client 10.6 route.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${snowLeopardChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file. The full validator passed 37 batches with 1,995 globally consistent keys.
- Inventory closure passed and is enforced inside the generator: exactly 1 eligible seed version, 2 milestones, 1 public appearance, 1 non-public milestone, ${sources.length} of ${sources.length} declared sources cited, sole batch ownership, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 24 creates, 3 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 5 source documents, zero version documents, zero event documents, zero build documents, and ${snowLeopardChanges.length} change documents.
- The guarded patches target the existing Snow Leopard public event, the existing Snow Leopard version article, and author/topics on the already-present 2008–2009 security-index source. No chronology or identity field is changed.
- Mutation payload: 76,284 bytes, reported as 2.0% of the guarded limit.
- Approved production plan SHA:
  \`7d6dccc56765b16fdd862600de1c0d309246135f782b993753d627ae0673c349\`.
- Bundle JSON SHA-256: \`${jsonSha}\`.
- Production apply committed and zero-residual verified in transaction
  \`F0eE6eK5XyVXtlnaoxz88z\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,108 unchanged
  documents. Its plan SHA is
  \`f4f46e4c860a532d8a1f13613c3b5fd9ec57558ccede65dfd12ce03d2122c37f\`.
- The representative local route \`/apple/macos/10.6\` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at \`${reviewedAt}\`.
`;

writeFileSync(join(here, "apple-other-2009.md"), md);
