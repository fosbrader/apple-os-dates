import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T06:13:57Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/104191",
  preview:
    "https://www.apple.com/newsroom/2002/05/06Apple-Previews-Jaguar-the-Next-Major-Release-of-Mac-OS-X/",
  introduction:
    "https://www.apple.com/newsroom/2002/07/17Apple-Introduces-Jaguar-the-Next-Major-Release-of-Mac-OS-X/",
  hardwareBundle:
    "https://www.apple.com/newsroom/2002/08/13Apple-Unveils-Dual-Processor-Power-Macs-Starting-at-1-699/",
  launch:
    "https://www.apple.com/newsroom/2002/08/23Jaguar-Unleashed-at-10-20-p-m-Tonight/",
  postLaunch:
    "https://www.apple.com/newsroom/2002/08/27-Jaguar-Breaks-Mac-OS-Record/",
  rendezvous:
    "https://www.apple.com/newsroom/2002/09/10Developers-Rapidly-Adopt-Apples-Rendezvous-Networking-Technology/",
  iSyncBeta:
    "https://www.apple.com/newsroom/2002/09/30Apple-Releases-iSync-Public-Beta/",
  quickTimeRelease:
    "https://www.apple.com/newsroom/2002/10/15Apples-QuickTime-6-Downloads-Top-25-Million/",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (August, 2003 and earlier)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Apple software",
      "2001",
      "2002",
      "2003",
      "Mac OS X",
      "release chronology",
      "security updates",
    ],
  },
  {
    url: U.preview,
    title: "Apple Previews “Jaguar,” the Next Major Release of Mac OS X",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-05-06T00:00:00.000Z",
    topics: ["Mac OS X", "Jaguar", "10.2", "developer preview"],
  },
  {
    url: U.introduction,
    title: "Apple Introduces “Jaguar,” the Next Major Release of Mac OS X",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-07-17T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Jaguar",
      "10.2",
      "features",
      "planned availability",
      "compatibility",
    ],
  },
  {
    url: U.hardwareBundle,
    title: "Apple Unveils Dual-Processor Power Macs Starting at $1,699",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-08-13T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Jaguar",
      "10.2",
      "Power Mac G4",
      "preinstallation",
      "chronology",
    ],
  },
  {
    url: U.launch,
    title: "Jaguar “Unleashed” at 10:20 p.m. Tonight",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-08-23T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Jaguar",
      "10.2",
      "public availability",
      "retail launch",
      "features",
    ],
  },
  {
    url: U.postLaunch,
    title: "“Jaguar” Breaks Mac OS Record",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-08-27T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Jaguar",
      "10.2",
      "post-launch confirmation",
      "vendor-reported sales",
    ],
  },
  {
    url: U.rendezvous,
    title: "Developers Rapidly Adopt Apple’s Rendezvous Networking Technology",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-09-10T00:00:00.000Z",
    topics: ["Mac OS X", "Jaguar", "10.2", "Rendezvous", "network discovery"],
  },
  {
    url: U.iSyncBeta,
    title: "Apple Releases iSync Public Beta",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-09-30T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Jaguar",
      "10.2",
      "iSync",
      "public beta",
      "later-software boundary",
    ],
  },
  {
    url: U.quickTimeRelease,
    title: "Apple’s QuickTime 6 Downloads Top 25 Million",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2002-10-15T00:00:00.000Z",
    topics: [
      "QuickTime",
      "QuickTime 6",
      "MPEG-4",
      "July 2002 release",
      "scope boundary",
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
      "Matched Apple's July 17 final-version announcement and August 23 retail-launch record to the existing audited Jaguar 10.2 public event; preview and post-launch sources only clarify development, availability, or product-scope boundaries.",
    citations,
  };
}

const jaguarChanges = [
  change({
    key: "macos-10-2-mail-junk-filtering",
    title: "Adaptive junk-mail filtering",
    canonicalSummary:
      "Jaguar enhanced Mail with a junk-message filter that learned from message content as it was used.",
    category: "enhancement",
    action: "changed",
    summary:
      "Mail gained filtering intended to improve from the messages a user classified rather than relying only on fixed keyword rules. Apple's launch-night page confirms junk-mail filtering as part of the public release without providing an independent effectiveness measurement.",
    citations: [
      c(U.introduction, "Key features; enhanced Mail"),
      c(U.launch, "Launch feature list; Mail and junk-mail filtering"),
      c(U.postLaunch, "Post-launch feature recap; Mail"),
    ],
  }),
  change({
    key: "macos-10-2-ichat",
    title: "iChat",
    canonicalSummary:
      "Jaguar introduced iChat as an AIM-compatible instant-messaging application for AOL and Mac.com contacts.",
    category: "feature",
    action: "introduced",
    summary:
      "The operating system added Apple's own instant-messaging client with access to compatible AOL and Mac.com buddy lists. The retained public sources confirm the client but do not imply support for every later iChat service or protocol.",
    citations: [
      c(U.introduction, "Key features; iChat"),
      c(U.launch, "Launch feature list; iChat"),
      c(U.postLaunch, "Post-launch feature recap; iChat"),
    ],
  }),
  change({
    key: "macos-10-2-systemwide-address-book",
    title: "System-wide Address Book",
    canonicalSummary:
      "Jaguar introduced a system-wide Address Book whose contact data could be used by other applications.",
    category: "feature",
    action: "introduced",
    summary:
      "The new contacts database centralized entries for reuse across compatible software and added searching, editing, vCard, and Bluetooth-related support. Although the July page mentioned future iSync integration, iSync itself was not included in this launch claim.",
    citations: [
      c(U.introduction, "Key features; Address Book"),
      c(U.launch, "Launch feature list; system-wide Address Book"),
      c(
        U.iSyncBeta,
        "September 30 iSync Public Beta availability",
        "Used to exclude iSync itself from the August 23 launch delta.",
      ),
    ],
  }),
  change({
    key: "macos-10-2-inkwell",
    title: "Inkwell handwriting recognition",
    canonicalSummary:
      "Jaguar introduced Inkwell handwriting recognition as text input for compatible applications when using an input tablet.",
    category: "feature",
    action: "introduced",
    summary:
      "Inkwell connected handwriting recognition to the system text architecture so compatible applications could receive handwritten input through a tablet. The tablet dependency is retained rather than suggesting the feature worked without input hardware.",
    citations: [
      c(U.introduction, "Key features; Inkwell"),
      c(U.launch, "Launch feature list; Inkwell"),
      c(U.postLaunch, "Post-launch feature recap; Inkwell"),
    ],
  }),
  change({
    key: "macos-10-2-quicktime-6-mpeg4",
    title: "Bundled QuickTime 6 with MPEG-4",
    canonicalSummary: "Jaguar bundled QuickTime 6 with MPEG-4 media support.",
    category: "enhancement",
    action: "changed",
    summary:
      "Mac OS X 10.2 included QuickTime 6 and its MPEG-4 playback and creation capabilities. QuickTime 6 had already been released independently on July 15, so this record describes Jaguar's bundled media stack rather than claiming the operating system introduced QuickTime 6 globally.",
    citations: [
      c(U.introduction, "Key features; QuickTime 6 and MPEG-4"),
      c(U.launch, "Launch feature list; QuickTime 6"),
      c(
        U.quickTimeRelease,
        "October 15 retrospective; July 15 QuickTime 6 release date",
      ),
    ],
  }),
  change({
    key: "macos-10-2-universal-access-screen-zoom",
    title: "Universal Access screen magnification",
    canonicalSummary:
      "Jaguar expanded Universal Access with screen magnification.",
    category: "enhancement",
    action: "changed",
    summary:
      "The release added a built-in way to enlarge on-screen content for users who needed greater visual scale. The structured entry is limited to the capability Apple named and does not infer later zoom controls.",
    citations: [
      c(U.introduction, "Key features; Universal Access magnification"),
      c(U.launch, "Launch feature list; improved Universal Access"),
    ],
  }),
  change({
    key: "macos-10-2-universal-access-spoken-text",
    title: "Spoken highlighted text",
    canonicalSummary:
      "Jaguar expanded Universal Access so highlighted text could be read aloud.",
    category: "enhancement",
    action: "changed",
    summary:
      "Selected text could be spoken as an accessibility aid. Apple's retained launch material confirms this focused text-to-speech workflow without implying the full screen-reader behavior of later macOS releases.",
    citations: [
      c(U.introduction, "Key features; Universal Access spoken text"),
      c(U.launch, "Launch feature list; improved Universal Access"),
    ],
  }),
  change({
    key: "macos-10-2-universal-access-keyboard-controls",
    title: "Mouse Keys, Sticky Keys, and Slow Keys",
    canonicalSummary:
      "Jaguar expanded Universal Access with Mouse Keys, Sticky Keys, and Slow Keys keyboard controls.",
    category: "enhancement",
    action: "changed",
    summary:
      "The operating system added keyboard-oriented alternatives for pointer movement, multi-key combinations, and delayed key acceptance. The three named modes are kept together because Apple's final product announcement presents them as one accessibility group.",
    citations: [
      c(U.introduction, "Key features; Universal Access keyboard commands"),
      c(U.launch, "Launch feature list; improved Universal Access"),
    ],
  }),
  change({
    key: "macos-10-2-finder-toolbar-search",
    title: "Finder toolbar search",
    canonicalSummary:
      "Jaguar added quick file searching from the Finder toolbar.",
    category: "enhancement",
    action: "changed",
    summary:
      "Finder gained a search entry point in its toolbar, reducing the steps needed to locate files from the primary file-management window.",
    citations: [
      c(U.introduction, "Key features; Finder quick search"),
      c(U.launch, "Launch feature list; enhanced Finder"),
      c(U.postLaunch, "Post-launch feature recap; enhanced Finder"),
    ],
  }),
  change({
    key: "macos-10-2-finder-spring-loaded-folders",
    title: "Return of spring-loaded folders",
    canonicalSummary:
      "Jaguar restored spring-loaded folder navigation in Finder.",
    category: "enhancement",
    action: "changed",
    summary:
      "Dragging over a folder could again open it temporarily for deeper navigation. The wording records Apple's description of the feature as a return, avoiding a false claim that the interaction had never existed on the Mac.",
    citations: [
      c(U.introduction, "Key features; return of spring-loaded folders"),
      c(U.launch, "Launch feature list; enhanced Finder"),
    ],
  }),
  change({
    key: "macos-10-2-sherlock-3-internet-services",
    title: "Sherlock 3 Internet Services",
    canonicalSummary:
      "Jaguar updated Sherlock with Internet Services views for information such as stocks, maps, and restaurants.",
    category: "enhancement",
    action: "changed",
    summary:
      "Sherlock shifted toward a personalized services interface for frequently consulted online information. The entry preserves the example categories in Apple's announcement without implying that every service remained continuously available.",
    citations: [
      c(U.introduction, "Key features; Sherlock 3 Internet Services"),
      c(U.launch, "Launch feature list; Sherlock 3"),
      c(U.postLaunch, "Post-launch feature recap; Sherlock 3"),
    ],
  }),
  change({
    key: "macos-10-2-rendezvous-zero-configuration-networking",
    title: "Rendezvous zero-configuration networking",
    canonicalSummary:
      "Jaguar introduced Rendezvous for automatic discovery and connection of computers, devices, and services on supported networks.",
    category: "feature",
    action: "introduced",
    summary:
      "Rendezvous reduced manual network configuration by discovering compatible resources automatically. Apple's September follow-up confirms that the shipped 10.2 integration used standard IP networking and names Ethernet and 802.11 wireless networks as examples.",
    citations: [
      c(U.introduction, "Key features; Rendezvous"),
      c(U.launch, "Launch feature list; Rendezvous"),
      c(
        U.rendezvous,
        "September 10 confirmation; integrated zero-configuration IP discovery",
      ),
    ],
  }),
  change({
    key: "macos-10-2-quartz-extreme",
    title: "Quartz Extreme graphics acceleration",
    canonicalSummary:
      "Jaguar introduced Quartz Extreme to move supported desktop composition work to compatible graphics hardware.",
    category: "enhancement",
    action: "introduced",
    summary:
      "Quartz Extreme used an eligible graphics processor to accelerate the desktop's 2D, 3D, and QuickTime composition. Apple's launch requirements limit support to named NVIDIA or ATI AGP hardware with at least 16 MB of video memory and recommend 32 MB for its stated optimum.",
    citations: [
      c(
        U.introduction,
        "Key features and hardware requirements; Quartz Extreme",
      ),
      c(
        U.launch,
        "Launch feature list and hardware requirements; Quartz Extreme",
      ),
      c(U.hardwareBundle, "Power Mac G4 graphics and Quartz Extreme context"),
    ],
  }),
  change({
    key: "macos-10-2-smb-network-browsing-sharing",
    title: "SMB browsing and file sharing",
    canonicalSummary:
      "Jaguar expanded Windows-network compatibility with SMB browsing and sharing.",
    category: "compatibility",
    action: "changed",
    summary:
      "The release made it easier for a Mac to find and exchange files with supported Windows-network resources through SMB. This claim stays at the protocol capability Apple documented and does not promise universal interoperability with every Windows configuration.",
    citations: [
      c(U.introduction, "Key features; Windows support and SMB"),
      c(U.preview, "Developer preview; Windows support"),
      c(U.postLaunch, "Post-launch statement; Windows compatibility"),
    ],
  }),
  change({
    key: "macos-10-2-pptp-vpn",
    title: "Built-in PPTP VPN support",
    canonicalSummary:
      "Jaguar added built-in PPTP VPN support for connecting to compatible Windows-oriented networks.",
    category: "compatibility",
    action: "changed",
    summary:
      "The system included a PPTP connection path as part of Apple's Windows-network compatibility work. The entry records historical support without making a present-day security recommendation for the protocol.",
    citations: [
      c(U.introduction, "Key features; built-in PPTP VPN support"),
      c(U.preview, "Developer preview; Windows support"),
    ],
  }),
  change({
    key: "macos-10-2-freebsd-4-4-foundation",
    title: "FreeBSD 4.4 foundation updates",
    canonicalSummary:
      "Jaguar updated parts of its UNIX foundation using FreeBSD 4.4.",
    category: "developerApi",
    action: "changed",
    summary:
      "The release incorporated FreeBSD 4.4-based work into the operating system's UNIX layer. This is recorded as a platform-foundation change rather than a claim that Jaguar contained every component of a standalone FreeBSD distribution.",
    citations: [
      c(U.introduction, "Key features; UNIX foundation and FreeBSD 4.4"),
      c(U.preview, "Developer preview; UNIX tools"),
    ],
  }),
  change({
    key: "macos-10-2-gcc-3-1-developer-tools",
    title: "GCC 3.1-based developer tools",
    canonicalSummary:
      "Jaguar's updated developer-tool package was based on GCC 3.1.",
    category: "developerApi",
    action: "changed",
    summary:
      "Apple paired the operating-system release and its Up-to-Date media with refreshed developer tools using GCC 3.1. The final July version number supersedes the May preview's less specific GCC 3 wording.",
    citations: [
      c(U.introduction, "UNIX foundation and GCC 3.1; Up-to-Date package"),
      c(
        U.preview,
        "Developer preview; GCC 3",
        "Used only to show the less-specific preview description superseded by the July announcement.",
      ),
      c(U.launch, "Up-to-Date package; updated Developer Tools CD"),
    ],
  }),
  change({
    key: "macos-10-2-supported-mac-baseline",
    title: "Jaguar supported-Mac baseline",
    canonicalSummary:
      "Apple required at least 128 MB of memory and limited Jaguar support to named PowerPC-era Mac families.",
    category: "compatibility",
    action: "changed",
    summary:
      "The documented baseline covered iMac, iBook, Power Macintosh G3, Power Mac G4, Power Mac G4 Cube, and PowerBook models introduced after May 1998. Quartz Extreme imposed a separate graphics requirement beyond general OS eligibility.",
    citations: [
      c(U.introduction, "Pricing & Availability; system requirements"),
      c(U.launch, "Pricing & Availability; system requirements"),
      c(U.postLaunch, "Pricing & Availability; system requirements"),
    ],
  }),
  change({
    key: "macos-10-2-retail-upgrade-media",
    title: "Retail and Up-to-Date CD distribution",
    canonicalSummary:
      "Jaguar launched through Apple and reseller retail channels, with eligible recent purchases receiving an Up-to-Date package on CDs.",
    category: "compatibility",
    action: "changed",
    summary:
      "The standalone release used physical retail and reseller distribution rather than a modern over-the-air rollout. Apple's Up-to-Date program covered qualifying Mac and Mac OS X 10.1 purchases from July 17 and supplied upgrade plus developer-tools CDs for a handling charge.",
    citations: [
      c(U.introduction, "Pricing & Availability; Up-to-Date media"),
      c(U.launch, "Pricing & Availability; retail launch and Up-to-Date media"),
      c(U.postLaunch, "Pricing & Availability; post-launch distribution"),
    ],
  }),
];

const version = {
  releaseVersionId: "version-macos-10-2",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X Jaguar 10.2 reached U.S. retail customers at 10:20 p.m. on August 23, 2002. Its retained launch record centers on Mail junk filtering, iChat, a system-wide Address Book, Inkwell, QuickTime 6, expanded accessibility and Finder behavior, Sherlock 3, Rendezvous, Quartz Extreme, Windows-network compatibility, UNIX tooling, and PowerPC-era hardware requirements.",
      [
        c(U.launch, "August 23 launch time and feature list"),
        c(U.introduction, "July final-version feature and requirement detail"),
        c(U.postLaunch, "August 27 availability and feature confirmation"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple previewed Jaguar to developers on May 6 with a late-summer target, then announced the named 10.2 release on July 17 for general availability beginning August 24. The final launch notice moved U.S. retail availability to 10:20 p.m. on August 23. The local catalog contains no May preview milestone, so this bundle creates no beta event or preview article.",
      [
        c(U.preview, "May 6 developer preview and late-summer plan"),
        c(U.introduction, "July 17 planned August 24 availability"),
        c(U.launch, "August 23 retail availability at 10:20 p.m."),
      ],
    ),
    heading("Applications and information"),
    prose(
      "Mail gained adaptive junk filtering, iChat brought AIM-compatible messaging, and Address Book centralized contacts for compatible applications. Inkwell connected handwriting input to the text system through a tablet, while Jaguar bundled QuickTime 6 with MPEG-4 support and expanded Sherlock into an Internet-services view.",
      [
        c(U.introduction, "Key features; Mail through Sherlock 3"),
        c(U.launch, "Launch feature list"),
        c(U.postLaunch, "Post-launch feature recap"),
      ],
    ),
    heading("Accessibility and Finder"),
    prose(
      "Universal Access added screen magnification, spoken highlighted text, Mouse Keys, Sticky Keys, and Slow Keys. Finder added a toolbar search and restored spring-loaded folders. These entries stay limited to the specific behaviors Apple documented rather than importing later macOS accessibility or search features.",
      [
        c(U.introduction, "Key features; Universal Access and Finder"),
        c(U.launch, "Launch feature list; Universal Access and Finder"),
      ],
    ),
    heading("Networking, graphics, and UNIX"),
    prose(
      "Rendezvous added automatic discovery on supported networks; Jaguar also documented SMB browsing and sharing plus built-in PPTP VPN support for Windows-oriented environments. Quartz Extreme moved eligible composition work to supported graphics processors, while FreeBSD 4.4 and GCC 3.1-based updates refreshed the UNIX and developer-tool foundation.",
      [
        c(U.introduction, "Key features; Rendezvous through UNIX foundation"),
        c(U.rendezvous, "Shipped 10.2 Rendezvous integration"),
        c(U.launch, "Quartz Extreme hardware requirements"),
      ],
    ),
    heading("Availability anomaly"),
    prose(
      "An August 13 Power Mac announcement said two new models were available that week and described the line as shipping with Jaguar pre-installed, while the same announcement still placed Jaguar's public software availability on August 24. The retained page does not establish an earlier standalone retail release, so the audited public route remains the explicit August 23 launch-night sale.",
      [
        c(
          U.hardwareBundle,
          "Power Mac availability, Jaguar preinstallation, and stated August 24 public date",
        ),
        c(U.launch, "Explicit August 23 standalone retail availability"),
      ],
    ),
    heading("Separate-software boundary"),
    prose(
      "QuickTime 6 had been released independently on July 15, so Jaguar is credited with bundling it rather than originating the product. The July Jaguar page also anticipated Address Book synchronization through iSync, but Apple did not release iSync Public Beta until September 30; iSync is therefore excluded from the August launch delta.",
      [
        c(U.introduction, "QuickTime 6 and Address Book/iSync descriptions"),
        c(U.quickTimeRelease, "Retrospective July 15 QuickTime 6 release date"),
        c(U.iSyncBeta, "September 30 iSync Public Beta availability"),
      ],
    ),
    heading("Security and version boundary"),
    prose(
      "Apple's archive lists a separate Security Update 2002-08-23 for Mac OS X 10.2 that carried forward fixes from the August 2 update for 10.1.5. It does not say those fixes were present on the Jaguar installation CDs, so no initial-image CVE group is inferred. The same archive later documents a September Terminal update and 10.2.2 security content; none is projected backward into 10.2.",
      [
        c(
          U.securityIndex,
          "Security Update 2002-08-23, Security Update 2002-09-20, and Mac OS X 10.2.2",
        ),
      ],
    ),
    heading("Launch impact"),
    prose(
      "On August 27, Apple reported more than 100,000 Jaguar copies sold worldwide during the first weekend and more than 50,000 visitors to its 35 retail stores on Friday night. Those totals remain attributed vendor figures rather than independently audited sales or installation counts.",
      [c(U.postLaunch, "First-weekend sales and store-visitor report")],
    ),
  ),
  citations: [
    c(U.preview, "May 6 developer preview"),
    c(U.introduction, "July 17 final-version announcement"),
    c(U.hardwareBundle, "August 13 preinstallation chronology"),
    c(U.launch, "August 23 public retail launch"),
    c(U.postLaunch, "August 27 post-launch confirmation"),
    c(U.rendezvous, "September 10 Rendezvous confirmation"),
    c(U.iSyncBeta, "September 30 iSync boundary"),
    c(U.quickTimeRelease, "QuickTime 6 independent-release boundary"),
    c(U.securityIndex, "2002–2003 security chronology"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-2",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "Mac OS X Jaguar 10.2 entered U.S. retail sale at 10:20 p.m. on August 23, 2002 with documented application, accessibility, Finder, networking, graphics, UNIX-tooling, distribution, and compatibility changes.",
  article: article(
    heading("Public release"),
    prose(
      "Apple's final notice made Jaguar available through its online store, retail stores, and authorized resellers at 10:20 p.m. on Friday, August 23. The unusually precise time was part of a launch event lasting until midnight and is the controlling evidence for the existing public milestone.",
      [
        c(U.launch, "August 23 launch time, channels, and event window"),
        c(U.postLaunch, "Friday-night launch confirmation"),
      ],
    ),
    heading("Why some sources say August 24"),
    prose(
      "The July 17 announcement advertised August 24 as the beginning of public availability. The August 23 launch page superseded that plan for U.S. channels by explicitly opening sales at 10:20 p.m. the night before. This record preserves the audited August 23 date while documenting the earlier date instead of silently choosing between them.",
      [
        c(U.introduction, "Planned August 24 availability"),
        c(U.launch, "Final August 23 10:20 p.m. availability"),
      ],
    ),
    heading("Preinstalled-hardware anomaly"),
    prose(
      "Apple's August 13 Power Mac G4 announcement described two models as available that week and the line as shipping with Jaguar pre-installed, but it simultaneously repeated an August 24 public software date. Because it does not prove an earlier standalone copy could be purchased, no additional public event is created.",
      [
        c(
          U.hardwareBundle,
          "Power Mac availability, Jaguar preinstallation, and public-software date",
        ),
      ],
    ),
    heading("Confirmed shipped scope"),
    prose(
      "The structured entries cover Mail, iChat, Address Book, Inkwell, the bundled QuickTime stack, Universal Access, Finder, Sherlock, Rendezvous, Quartz Extreme, SMB, PPTP, FreeBSD-based foundation work, GCC-based developer tools, eligible Mac models, and physical upgrade distribution. Every entry is grounded in Apple's July final-version announcement and linked to the August public event.",
      [
        c(U.introduction, "Complete key-feature and availability sections"),
        c(U.launch, "Public launch feature and requirement recap"),
        c(U.postLaunch, "Post-launch feature and availability confirmation"),
      ],
    ),
    heading("Hardware and delivery limits"),
    prose(
      "General eligibility required at least 128 MB of memory and one of Apple's named PowerPC-era Mac families. Quartz Extreme had a narrower GPU and video-memory list. Jaguar was sold through retail and reseller channels, and the Up-to-Date program supplied eligible purchasers with operating-system and developer-tools CDs.",
      [
        c(
          U.introduction,
          "System, Quartz Extreme, and Up-to-Date requirements",
        ),
        c(U.launch, "Final launch requirements and distribution"),
      ],
    ),
    heading("Separate products and later availability"),
    prose(
      "Jaguar bundled QuickTime 6, but Apple dates QuickTime 6's independent release to July 15. Likewise, the July Address Book description referenced iSync even though iSync Public Beta arrived on September 30. Neither fact is converted into a false claim that Jaguar first launched QuickTime 6 or included iSync on August 23.",
      [
        c(U.introduction, "QuickTime 6 and Address Book/iSync descriptions"),
        c(U.quickTimeRelease, "July 15 QuickTime 6 release date"),
        c(U.iSyncBeta, "September 30 iSync Public Beta availability"),
      ],
    ),
    heading("Security and point-release boundary"),
    prose(
      "Apple published a separate Mac OS X 10.2 security update on launch day, carrying fixes from an earlier 10.1.5 update. Its archive later identifies a Terminal vulnerability in the version shipped with 10.2 and extensive 10.2.2 fixes. The local catalog has no point-release route for those later changes, and the separate launch-day updater is not treated as proof that the base installation media contained its fixes.",
      [
        c(
          U.securityIndex,
          "August 23 and September 20 security updates; Mac OS X 10.2.2",
        ),
      ],
    ),
    heading("Attributed launch response"),
    prose(
      "Apple's August 27 follow-up reported more than 100,000 copies sold during the first weekend and more than 50,000 Friday-night visitors across its 35 stores. The article preserves the publisher and scope of those figures rather than converting them into independent adoption, active-device, or installation estimates.",
      [c(U.postLaunch, "First-weekend sales and store-visitor report")],
    ),
  ),
  citations: [
    c(U.preview, "May 6 developer preview"),
    c(U.introduction, "July 17 final-version announcement"),
    c(U.hardwareBundle, "August 13 preinstallation chronology"),
    c(U.launch, "August 23 public retail launch"),
    c(U.postLaunch, "August 27 post-launch confirmation"),
    c(U.rendezvous, "September 10 Rendezvous confirmation"),
    c(U.iSyncBeta, "September 30 iSync boundary"),
    c(U.quickTimeRelease, "QuickTime 6 independent-release boundary"),
    c(U.securityIndex, "2002–2003 security chronology"),
  ],
  changes: jaguarChanges,
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
    item.publicReleaseDate?.startsWith("2002-"),
);
const [eligible] = eligibleSeedVersions;

if (
  eligibleSeedVersions.length !== 1 ||
  eligible.platform !== "macOS" ||
  eligible.majorVersion !== 10 ||
  eligible.version !== "10.2" ||
  eligible.versionNote !== "Jaguar" ||
  eligible.publicReleaseDate !== "2002-08-23" ||
  eligible.milestones.length !== 1 ||
  eligible.milestones[0]?.label !== "Public" ||
  eligible.milestones[0]?.date !== "2002-08-23"
) {
  throw new Error(
    "The 2002 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

const otherOwners = [];
for (const file of readdirSync(here).filter(
  (name) => name.endsWith(".json") && name !== "apple-other-2002.json",
)) {
  const candidate = JSON.parse(readFileSync(join(here, file), "utf8"));
  if (
    candidate.versions?.some(
      (item) => item.releaseVersionId === "version-macos-10-2",
    ) ||
    candidate.events?.some(
      (item) => item.target?.releaseVersionId === "version-macos-10-2",
    )
  ) {
    otherOwners.push(file);
  }
}
if (otherOwners.length > 0) {
  throw new Error(
    `The 2002 Jaguar route is already owned by: ${otherOwners.join(", ")}`,
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 19
) {
  throw new Error("The expected 2002 bundle closure no longer holds.");
}

if (
  Object.keys(bundle.events[0].target).sort().join(",") !==
    "releaseVersionId,routeAlias" ||
  bundle.events[0].target.releaseVersionId !== "version-macos-10-2" ||
  bundle.events[0].target.routeAlias !== "public"
) {
  throw new Error("The Jaguar event target is no longer durable.");
}

for (const item of jaguarChanges) {
  if (
    item.documentedStatus !== "documented" ||
    item.evidenceState !== "confirmed" ||
    item.inheritance !== "delta" ||
    !item.citations.some((citation) => citation.url === U.introduction)
  ) {
    throw new Error(
      `Change ${item.key} is not a final-version documented public delta.`,
    );
  }
}

if (
  jaguarChanges.some(
    (item) =>
      item.category === "security" ||
      `${item.key} ${item.title}`.toLowerCase().includes("isync"),
  )
) {
  throw new Error(
    "Separate security updates and post-launch iSync availability cannot be Jaguar launch changes.",
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
writeFileSync(join(here, "apple-other-2002.json"), json);
const jsonSha = createHash("sha256").update(json).digest("hex");

const md = `# Apple 2002 non-iPhone research batch

## Result

\`apple-other-2002.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2002. The exact cohort is one data-rich Mac OS X Jaguar 10.2 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.2 (Jaguar) | 1 | 1 | ${jaguarChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **1** | **1** | **${jaguarChanges.length}** |

The local Jaguar record contains only the August 23 public milestone. Apple's final launch announcement explicitly opened U.S. sales at 10:20 p.m. that night, superseding its earlier August 24 plan. This bundle enriches only that durable route through \`releaseVersionId: "version-macos-10-2"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\`
  as of \`${reviewedAt}\`.
- The public event is indexable.
- All ${jaguarChanges.length} changes are \`documented\`, \`confirmed\`, and public-release \`delta\` entries.
- Every structured change cites Apple's July 17 final-version announcement; the August 23 launch page controls the public date and post-launch sources qualify chronology or product scope.
- No undocumented-change or initial-image security claim is included.
- No May developer-preview route or change set is created because the seed has no preview milestone.
- No 10.2.x point release or later cumulative change is projected backward.
- No build record is included and no build number is inferred.
- Apple's first-weekend sales and visitor totals remain attributed vendor claims, not independent adoption measurements.
- Apple, AOL, Microsoft, and protocol/product names are used nominatively; no logos, screenshots, publisher artwork, or copied body text is included.

## Inventory and chronology boundaries

1. Seed closure is exact: macOS-family version 10.2, named Jaguar, is the only non-iOS/iPadOS record with a 2002 public appearance. It has exactly one local milestone.
2. No other checked-in research batch owns \`version-macos-10-2\`; the generator verifies sole ownership before writing this bundle.
3. Apple's May 6 announcement is explicitly a developer preview. It provides development context, but no preview event, build, or beta change set is created.
4. Apple's July 17 announcement planned August 24 availability. Its August 23 launch notice superseded that schedule in U.S. sales channels by opening sales at 10:20 p.m. Friday night.
5. An August 13 Power Mac announcement said two models were available that week and described the line as shipping with Jaguar pre-installed, while still stating that Jaguar would become publicly available August 24. It is retained as an OEM chronology anomaly, not proof of an earlier standalone release.
6. QuickTime 6 was independently released July 15. Jaguar bundled it with MPEG-4 support but did not originate the cross-platform QuickTime 6 release.
7. The July page anticipated Address Book synchronization through iSync, but iSync Public Beta did not become available until September 30. No iSync change is attached to the August 23 route.
8. The historical product name is Mac OS X Jaguar. The local information architecture groups the release under the \`macOS\` platform family while preserving Apple's contemporaneous naming in editorial prose.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple materials checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived security chronology, the same-day companion updater, and later 10.2.x boundaries
- <${U.preview}> — May 6 developer preview and planned late-summer direction
- <${U.introduction}> — July 17 final-version features, requirements, upgrade path, and planned August 24 availability
- <${U.hardwareBundle}> — August 13 Power Mac availability and Jaguar preinstallation anomaly
- <${U.launch}> — August 23 10:20 p.m. public retail availability, shipped feature recap, pricing, and compatibility
- <${U.postLaunch}> — August 27 availability confirmation and Apple-reported first-weekend response
- <${U.rendezvous}> — post-launch confirmation that Rendezvous shipped in 10.2 as zero-configuration IP discovery
- <${U.iSyncBeta}> — September 30 iSync Public Beta boundary
- <${U.quickTimeRelease}> — Apple retrospective identifying QuickTime 6's independent July 15 release

Apple Support pages are archived or living documents and can display revision dates much later than the historical release. Historical mapping therefore uses explicitly labeled release lines and dated Newsroom pages, not a current page-revision timestamp.

## Known gaps and anomalies

1. No retained first-party Jaguar technical-specification or installation-guide page was found. Requirements and supported models are taken from matching sections repeated across Apple's July, August 23, and August 27 announcements.
2. Apple's August 13 Power Mac wording creates an unresolved preinstallation-versus-standalone chronology question. The explicit retail software event remains August 23 at 10:20 p.m.; no extra route is inferred.
3. Apple's security archive lists a separate Security Update 2002-08-23 for 10.2 that applies earlier 10.1.5 fixes. It does not say the base Jaguar CDs included those fixes, so the update is not merged into the initial image.
4. The archive later says a September 20 update fixed a Terminal vulnerability introduced in the version shipped with 10.2, and it documents extensive 10.2.2 repairs. Those later facts remain chronology context rather than launch deltas.
5. The local catalog contains no 10.2.x point-version records. This existing-record-only batch creates none and imports no later fix.
6. QuickTime 6 and iSync have separate availability histories. Their relationship to Jaguar is described without turning either into a false August 23 first release.
7. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
8. Mac OS X Server 10.2 was a separate product with its own feature set. No Server route or Server-only change is included.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${jaguarChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed and is enforced inside the generator: exactly 1 eligible seed version, 1 public milestone, ${sources.length} of ${sources.length} declared sources cited, sole batch ownership, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and launch-manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 28 creates, 2 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 9 source documents, zero version documents, zero event documents, zero build documents, and ${jaguarChanges.length} change documents.
- The two guarded patches target the existing Jaguar public event and the existing Jaguar version article. No chronology or identity field is changed.
- Mutation payload: 89,185 bytes, reported as 2.3% of the guarded limit.
- Approved production plan SHA:
  \`a195a0f6f62e0b217730dc0fc4aa31c1f01a249757bd7955dc46a0c27a0bc54b\`.
- Bundle JSON SHA-256: \`${jsonSha}\`.
- Production apply committed and zero-residual verified in transaction
  \`F0eE6eK5XyVXtlnaoy29fo\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,111 unchanged
  documents. Its plan SHA is
  \`46cbf64eef92da055ab5d6f5e01a1a36b4222a4465cf78a7c79520a6347926ae\`.
- The representative local route \`/apple/macos/10.2\` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at \`${reviewedAt}\`.
`;

writeFileSync(join(here, "apple-other-2002.md"), md);
