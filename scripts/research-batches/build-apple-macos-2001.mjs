import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const here = dirname(fileURLToPath(import.meta.url));
const outputName = "apple-macos-2001.json";
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T06:26:13Z";

const U = {
  announce100:
    "https://www.apple.com/newsroom/2001/01/09Apples-Mac-OS-X-to-Ship-on-March-24/",
  launch100:
    "https://www.apple.com/newsroom/2001/03/21Mac-OS-X-Hits-Stores-This-Weekend/",
  developers100:
    "https://www.apple.com/newsroom/2001/03/21More-than-10-000-Developers-Working-on-Mac-OS-X-Solutions/",
  laterUpdate100:
    "https://www.apple.com/newsroom/2001/05/01Apple-Releases-Mac-OS-X-Update-with-CD-Burning/",
  preview101:
    "https://www.apple.com/newsroom/2001/07/18Apple-Previews-Next-Version-of-Mac-OS-X/",
  launch101:
    "https://www.apple.com/newsroom/2001/09/25First-Major-Upgrade-to-Mac-OS-X-Hits-Stores-This-Weekend/",
  apps101:
    "https://www.apple.com/newsroom/2001/09/25More-than-1-400-Third-Party-Applications-Now-Available-for-Mac-OS-X-v10-1/",
  server101:
    "https://www.apple.com/newsroom/2001/09/25Major-Mac-OS-X-Server-v10-1-Update-Now-Available/",
  securityEarly: "https://support.apple.com/en-us/104191",
  tidbits101:
    "https://tidbits.com/2001/09/26/free-mac-os-x-10-1-upgrade-available-29-sep-01/",
};

const sources = [
  {
    url: U.announce100,
    title: "Apple’s Mac OS X to Ship on March 24",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-01-09T00:00:00.000Z",
    topics: ["Mac OS X", "10.0", "launch", "features", "requirements"],
  },
  {
    url: U.launch100,
    title: "Mac OS X Hits Stores This Weekend",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-03-21T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "10.0",
      "public availability",
      "features",
      "compatibility",
    ],
  },
  {
    url: U.developers100,
    title: "More than 10,000 Developers Working on Mac OS X Solutions",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-03-21T00:00:00.000Z",
    topics: ["Mac OS X", "10.0", "developer ecosystem", "launch context"],
  },
  {
    url: U.laterUpdate100,
    title: "Apple Releases Mac OS X Update with CD Burning",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-05-01T00:00:00.000Z",
    topics: ["Mac OS X", "10.0.2", "later update", "scope boundary"],
  },
  {
    url: U.preview101,
    title: "Apple Previews Next Version of Mac OS X",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-07-18T00:00:00.000Z",
    topics: ["Mac OS X", "10.1", "preview", "features"],
  },
  {
    url: U.launch101,
    title: "First Major Upgrade to Mac OS X Hits Stores This Weekend",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-09-25T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "10.1",
      "public announcement",
      "features",
      "availability",
    ],
  },
  {
    url: U.apps101,
    title:
      "More than 1,400 Third-Party Applications Now Available for Mac OS X v10.1",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-09-25T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "10.1",
      "application ecosystem",
      "device compatibility",
    ],
  },
  {
    url: U.server101,
    title: "Major Mac OS X Server v10.1 Update Now Available",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2001-09-25T00:00:00.000Z",
    topics: ["Mac OS X Server", "10.1", "separate product", "scope boundary"],
  },
  {
    url: U.securityEarly,
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
    url: U.tidbits101,
    title: "Free Mac OS X 10.1 Upgrade Available 29-Sep-01",
    publisher: "TidBITS",
    sourceClass: "journalism",
    author: "TidBITS Staff",
    publishedAt: "2001-09-26T00:00:00.000Z",
    topics: ["Mac OS X", "10.1", "retail availability", "Seybold distribution"],
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
  documentedStatus = "documented",
  evidenceState = "confirmed",
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
    documentedStatus,
    evidenceState,
    verificationMethod:
      verificationMethod ||
      "Matched retained Apple release documentation to the exact existing 2001 Mac OS X version and durable Public route; no point-release or preview-only behavior is inherited.",
    citations,
  };
}

const changes100 = [
  change({
    key: "macos-10-0-darwin-unix-foundation",
    title: "Darwin and BSD UNIX foundation",
    canonicalSummary:
      "The first public Mac OS X release established Darwin as an open-source UNIX-based foundation with BSD services and common internet-server technologies.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple described Darwin beneath the client system and identified bundled facilities including common shells, Perl, FTP, Apache, WebDAV, and XML technologies. These capabilities form the operating-system foundation rather than a claim that every service was enabled by default.",
    citations: [
      c(U.announce100, "Feature list and Darwin foundation paragraph"),
      c(
        U.launch100,
        "Darwin foundation; web-development tools; BSD UNIX services",
      ),
    ],
  }),
  change({
    key: "macos-10-0-protected-memory-preemptive-multitasking",
    title: "Protected memory and preemptive multitasking",
    canonicalSummary:
      "Mac OS X introduced protected memory and preemptive multitasking as core process-management behavior on the Mac.",
    category: "feature",
    action: "introduced",
    summary:
      "The new foundation isolated process memory and let the operating system schedule running work, replacing cooperative assumptions from the classic Mac system architecture.",
    citations: [
      c(U.announce100, "Darwin foundation architecture paragraph"),
      c(U.launch100, "Darwin foundation architecture paragraph"),
    ],
  }),
  change({
    key: "macos-10-0-symmetric-multiprocessing",
    title: "Symmetric multiprocessing",
    canonicalSummary:
      "Mac OS X added automatic use of both processors on supported dual-processor Power Mac G4 systems.",
    category: "enhancement",
    action: "introduced",
    summary:
      "Apple documented symmetric multiprocessing as part of the new system foundation and scoped the launch benefit to dual-processor Power Mac G4 hardware.",
    citations: [
      c(U.announce100, "Darwin foundation architecture paragraph"),
      c(U.launch100, "Feature list; symmetric multiprocessing"),
    ],
  }),
  change({
    key: "macos-10-0-quartz-pdf-graphics",
    title: "Quartz 2D and system PDF integration",
    canonicalSummary:
      "Mac OS X introduced the Quartz 2D graphics engine, using PDF as a display and document foundation.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Quartz supplied the new two-dimensional graphics path, broad font support, and operating-system PDF integration that let applications generate standard PDF documents.",
    citations: [
      c(U.announce100, "Feature list; Quartz and PDF"),
      c(U.launch100, "Quartz paragraph and PDF feature"),
    ],
  }),
  change({
    key: "macos-10-0-opengl-3d-graphics",
    title: "Integrated OpenGL graphics",
    canonicalSummary:
      "Mac OS X incorporated OpenGL as its system technology for accelerated 3D graphics and games.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The launch material identifies OpenGL as the new system's 3D graphics layer and part of the platform exposed to native applications.",
    citations: [
      c(U.announce100, "Feature list; OpenGL"),
      c(U.launch100, "Darwin and graphics architecture paragraph"),
    ],
  }),
  change({
    key: "macos-10-0-quicktime-5-integration",
    title: "Integrated QuickTime 5",
    canonicalSummary:
      "The initial Mac OS X package integrated QuickTime 5 for streaming audio and video.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple described this as the first shipping integration of QuickTime 5 into Mac OS X, including the QuickTime Player among its internet-facing applications.",
    citations: [
      c(U.announce100, "QuickTime feature and internet-application paragraphs"),
      c(U.launch100, "Feature list; QuickTime 5"),
    ],
  }),
  change({
    key: "macos-10-0-aqua-and-dock",
    title: "Aqua interface and Dock",
    canonicalSummary:
      "Mac OS X introduced Aqua and the Dock as a new interface and organization model for applications, documents, and windows.",
    category: "feature",
    action: "introduced",
    summary:
      "Aqua replaced the prior system's visual language, while the Dock provided a persistent place to organize and reach running applications, documents, and minimized document windows.",
    citations: [
      c(U.announce100, "Aqua and Dock paragraphs"),
      c(U.launch100, "Aqua and Dock paragraph"),
    ],
  }),
  change({
    key: "macos-10-0-classic-environment",
    title: "Classic application environment",
    canonicalSummary:
      "Mac OS X provided Classic, based on Mac OS 9.1, to run many existing Mac applications during the platform transition.",
    category: "compatibility",
    action: "introduced",
    summary:
      "The boxed package included Mac OS 9.1 for the Classic environment. Apple framed Classic as the compatibility path for existing software rather than native Mac OS X execution.",
    citations: [
      c(U.announce100, "Classic API and Mac OS 9.1 transition paragraphs"),
      c(U.launch100, "Pricing & Availability; Classic package content"),
    ],
  }),
  change({
    key: "macos-10-0-carbon-api",
    title: "Carbon application API",
    canonicalSummary:
      "Carbon supplied a transition API for adapted Mac applications to run natively with Mac OS X capabilities.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple distinguished Carbon applications from unmodified software running through Classic: Carbon was the migration path for revised Mac code using the new system.",
    citations: [c(U.announce100, "Feature list; Carbon API")],
  }),
  change({
    key: "macos-10-0-cocoa-api",
    title: "Cocoa application API",
    canonicalSummary:
      "Cocoa provided Mac OS X's object-oriented native application framework.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple positioned Cocoa as the advanced native framework for creating applications specifically around the new operating-system architecture.",
    citations: [c(U.announce100, "Feature list; Cocoa API")],
  }),
  change({
    key: "macos-10-0-java-2-runtime",
    title: "Built-in Java 2 runtime",
    canonicalSummary:
      "Mac OS X included the full Java 2 API and runtime as a built-in cross-platform application environment.",
    category: "developerApi",
    action: "introduced",
    summary:
      "The Java 2 client was part of the operating-system package rather than a separately characterized third-party runtime in the launch inventory.",
    citations: [
      c(U.announce100, "Feature list; Java 2 API"),
      c(U.launch100, "Feature list; Java 2 Standard Edition"),
    ],
  }),
  change({
    key: "macos-10-0-internet-application-suite",
    title: "Bundled internet application suite",
    canonicalSummary:
      "The initial release bundled Mail, Internet Explorer 5.1 Preview, QuickTime Player, and Sherlock as internet-oriented applications.",
    category: "feature",
    action: "introduced",
    summary:
      "Apple described Mail as compatible with common internet mail accounts and grouped the browser preview, media player, and Sherlock search utility into the shipping system's internet experience.",
    citations: [c(U.announce100, "Internet applications paragraph")],
  }),
  change({
    key: "macos-10-0-itools-idisk-integration",
    title: "iTools and iDisk integration",
    canonicalSummary:
      "Mac OS X integrated iTools account access and exposed iDisk storage through Finder and file dialogs.",
    category: "feature",
    action: "introduced",
    summary:
      "The integration connected the desktop to Apple's then-current internet services, including iDisk access and Mac.com IMAP mail.",
    citations: [
      c(U.announce100, "Internet Services and iDisk paragraph"),
      c(U.launch100, "Feature list; iTools integration"),
    ],
  }),
  change({
    key: "macos-10-0-dynamic-memory-management",
    title: "Dynamic application memory management",
    canonicalSummary:
      "Mac OS X dynamically allocated application memory instead of requiring users to assign fixed per-application memory sizes.",
    category: "feature",
    action: "introduced",
    summary:
      "Apple presented this as eliminating routine out-of-memory messages and the classic workflow of manually adjusting an application's memory allocation.",
    citations: [c(U.launch100, "Feature list; dynamic memory management")],
  }),
  change({
    key: "macos-10-0-portable-power-management",
    title: "Faster portable wake behavior",
    canonicalSummary:
      "Mac OS X introduced revised power management intended to wake supported PowerBook and iBook systems immediately from sleep.",
    category: "enhancement",
    action: "changed",
    summary:
      "The launch claim is retained as Apple's stated portable behavior, not as an independently benchmarked timing guarantee across every supported model.",
    citations: [c(U.launch100, "Feature list; advanced power management")],
  }),
  change({
    key: "macos-10-0-automatic-networking-pppoe",
    title: "Automatic networking and PPPoE controls",
    canonicalSummary:
      "Mac OS X added automatic connection selection and a consolidated interface for network and internet settings, including direct PPPoE support.",
    category: "feature",
    action: "introduced",
    summary:
      "The new networking model was designed to use available connections with less manual reconfiguration and to manage common network paths from one interface.",
    citations: [
      c(
        U.launch100,
        "Feature list; automatic networking and network interface",
      ),
    ],
  }),
  change({
    key: "macos-10-0-font-formats-and-management",
    title: "Expanded font formats and management",
    canonicalSummary:
      "Mac OS X directly supported TrueType, Type 1, and OpenType fonts and added system controls for organizing fonts.",
    category: "enhancement",
    action: "changed",
    summary:
      "The launch package also included a large font collection and multilingual type resources; this occurrence records the platform capability rather than reproducing the promotional font catalog.",
    citations: [
      c(U.launch100, "Feature list; font support and bundled fonts"),
      c(U.announce100, "Quartz and broad font support"),
    ],
  }),
  change({
    key: "macos-10-0-built-in-printer-support",
    title: "Built-in consumer printer support",
    canonicalSummary:
      "The initial release bundled support for selected printers from HP, Canon, and Epson.",
    category: "compatibility",
    action: "introduced",
    summary:
      "Apple identified those vendor families at launch but did not preserve a model-by-model compatibility matrix in the cited announcement.",
    citations: [c(U.launch100, "Feature list; printer support")],
  }),
  change({
    key: "macos-10-0-multiuser-access-controls",
    title: "Multi-user accounts and access privileges",
    canonicalSummary:
      "Mac OS X introduced an administered multi-user environment with per-user access privileges.",
    category: "feature",
    action: "introduced",
    summary:
      "The system used account boundaries and permissions to separate users and protect their documents on a shared Mac.",
    citations: [c(U.launch100, "Feature list; multi-user environment")],
  }),
  change({
    key: "macos-10-0-kerberos-network-security",
    title: "Kerberos and network-security foundation",
    canonicalSummary:
      "The initial release included file-system and network-security facilities, including Kerberos support.",
    category: "security",
    action: "introduced",
    summary:
      "This occurrence records a documented launch capability, not a claim that the initial 10.0 package repaired a specific vulnerability.",
    citations: [
      c(U.launch100, "Feature list; file-system and network security"),
    ],
  }),
  change({
    key: "macos-10-0-launch-package-and-hardware",
    title: "Retail package and supported-Mac baseline",
    canonicalSummary:
      "Mac OS X launched as a $129 US retail package requiring 128MB of memory and a listed generation of Apple G3 or G4 hardware.",
    category: "compatibility",
    action: "changed",
    summary:
      "The package carried seven languages on one CD and included Mac OS 9.1 plus developer tools. Apple's final launch notice covered iMac, iBook, Power Macintosh G3, Power Mac G4, Power Mac G4 Cube, and PowerBook models introduced after May 1998.",
    citations: [
      c(U.launch100, "Pricing & Availability and system requirements"),
      c(U.announce100, "January pricing and requirements"),
    ],
  }),
];

const securityVerification101 =
  "Confirmed against Apple's retained early-security chronology under the exact “Mac OS X 10.1” heading; later 10.1.x and separate October security-update entries are not inherited.";

const changes101 = [
  change({
    key: "macos-10-1-systemwide-performance",
    title: "Systemwide performance work",
    canonicalSummary:
      "Mac OS X 10.1 substantially revised launch, menu, window, copying, startup, login, Classic, OpenGL, and Java performance.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple reported applications launching two to three times faster, menus and window resizing up to five times faster, and file copies up to twice as fast in its own testing. Those multipliers remain explicitly vendor-reported rather than independent benchmarks.",
    citations: [
      c(U.launch101, "Systemwide performance paragraph"),
      c(U.preview101, "Performance paragraphs"),
    ],
  }),
  change({
    key: "macos-10-1-movable-dock",
    title: "Movable Dock",
    canonicalSummary:
      "Version 10.1 let users position the Dock on the left, bottom, or right.",
    category: "enhancement",
    action: "changed",
    summary:
      "The update responded to a frequently requested customization by allowing the Dock to move from the bottom edge to either side of the screen.",
    citations: [
      c(U.launch101, "Aqua interface paragraph"),
      c(U.preview101, "Enhanced Aqua interface paragraph"),
    ],
  }),
  change({
    key: "macos-10-1-menu-bar-status-controls",
    title: "Menu-bar system status controls",
    canonicalSummary:
      "Version 10.1 added menu-bar controls for volume, displays, date and time, internet connections, AirPort, battery, and related status.",
    category: "feature",
    action: "introduced",
    summary:
      "The new status items provided quicker access to frequently used system settings and live connection or power information.",
    citations: [
      c(U.launch101, "System status icons paragraph"),
      c(U.preview101, "Enhanced Aqua interface paragraph"),
    ],
  }),
  change({
    key: "macos-10-1-file-extension-management",
    title: "Automatic file-extension management",
    canonicalSummary:
      "Version 10.1 added operating-system handling intended to simplify sending, receiving, opening, and reading files by extension.",
    category: "behavior",
    action: "introduced",
    summary:
      "Apple described the feature as automated file-extension management across common file workflows without publishing a format-by-format behavior table.",
    citations: [c(U.launch101, "System status and file-extension paragraph")],
  }),
  change({
    key: "macos-10-1-optical-disc-burning",
    title: "Finder CD and DVD data burning",
    canonicalSummary:
      "Version 10.1 added Finder-based data CD burning and DVD-R data-disc burning on compatible SuperDrive Macs.",
    category: "feature",
    action: "introduced",
    summary:
      "The public release brought optical-data writing into Finder. DVD-R support remained hardware-dependent; music-CD support was associated with iTunes.",
    citations: [
      c(U.launch101, "Digital Hub paragraph and DVD-R feature"),
      c(U.preview101, "Digital Hub and Finder burning descriptions"),
    ],
  }),
  change({
    key: "macos-10-1-dvd-playback",
    title: "Built-in DVD movie playback",
    canonicalSummary:
      "Version 10.1 introduced a redesigned DVD Player for supported Macs.",
    category: "feature",
    action: "introduced",
    summary:
      "Apple scoped playback to systems with a DVD-ROM drive and AGP graphics and described a simplified player interface.",
    citations: [c(U.launch101, "DVD Player feature and Digital Hub paragraph")],
  }),
  change({
    key: "macos-10-1-image-capture",
    title: "Image Capture",
    canonicalSummary:
      "Version 10.1 introduced Image Capture for transferring and enhancing photos from supported digital cameras.",
    category: "feature",
    action: "introduced",
    summary:
      "The bundled application automated camera photo downloads, while Apple separately described broader out-of-box support for consumer camera models.",
    citations: [
      c(U.launch101, "Image Capture paragraph"),
      c(U.apps101, "Nikon and Canon camera-support statements"),
    ],
  }),
  change({
    key: "macos-10-1-itunes-imovie-installation",
    title: "iTunes and iMovie included in installation",
    canonicalSummary:
      "Version 10.1 moved iTunes and iMovie 2 into the operating-system installation instead of requiring separate downloads.",
    category: "enhancement",
    action: "changed",
    summary:
      "The packaging change made Apple's music-management and movie-editing applications part of the standard installation path.",
    citations: [
      c(U.launch101, "Image Capture and bundled applications paragraph"),
    ],
  }),
  change({
    key: "macos-10-1-smb-cifs-client",
    title: "Integrated SMB/CIFS client",
    canonicalSummary:
      "Version 10.1 added a built-in SMB/CIFS client for Windows file-network access.",
    category: "compatibility",
    action: "introduced",
    summary:
      "Apple presented SMB/CIFS support as the main change making the Mac a direct participant on Windows networks.",
    citations: [
      c(U.launch101, "Windows network paragraph"),
      c(U.preview101, "Network integration feature"),
    ],
  }),
  change({
    key: "macos-10-1-multiprotocol-file-networking",
    title: "Expanded multiprotocol file networking",
    canonicalSummary:
      "Version 10.1 supported AFP over TCP/IP, AFP over AppleTalk, SMB/CIFS, NFS, and WebDAV network access.",
    category: "compatibility",
    action: "changed",
    summary:
      "The protocol set broadened client connectivity across Mac, Windows, Linux, UNIX, AppleShare, and web-based storage environments.",
    citations: [
      c(U.launch101, "Network protocol paragraph"),
      c(U.preview101, "Network integration feature"),
    ],
  }),
  change({
    key: "macos-10-1-idisk-webdav",
    title: "WebDAV-based iDisk",
    canonicalSummary:
      "Version 10.1 moved iDisk access to WebDAV for better standards-based and firewall-compatible connectivity.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple described the revision as more efficient and better able to remain connected from school, business, and corporate-firewall environments.",
    citations: [
      c(U.launch101, "Additional features; iDisk"),
      c(U.preview101, "iDisk feature"),
    ],
  }),
  change({
    key: "macos-10-1-printing-compatibility",
    title: "Expanded printer setup and drivers",
    canonicalSummary:
      "Version 10.1 expanded consumer and PostScript printer support and automated setup for common inkjet models.",
    category: "compatibility",
    action: "changed",
    summary:
      "The package added drivers from HP, Canon, and Epson plus PPD files for more than 200 PostScript printers from HP, Lexmark, and Xerox.",
    citations: [c(U.launch101, "Additional features; printing")],
  }),
  change({
    key: "macos-10-1-opengl-geforce3",
    title: "Updated OpenGL and GeForce3 support",
    canonicalSummary:
      "Version 10.1 updated OpenGL for higher 3D performance and added full NVIDIA GeForce3 support.",
    category: "enhancement",
    action: "changed",
    summary:
      "The change revised the system's 3D software path and explicitly supported the then-current GeForce3 hardware.",
    citations: [
      c(U.launch101, "Additional features; OpenGL"),
      c(U.preview101, "3D graphics feature"),
    ],
  }),
  change({
    key: "macos-10-1-colorsync-4",
    title: "ColorSync 4.0",
    canonicalSummary:
      "Version 10.1 included ColorSync 4.0 with ICC color management and a simplified interface.",
    category: "enhancement",
    action: "changed",
    summary:
      "The update advanced the system color-management layer for publishing and imaging workflows.",
    citations: [c(U.launch101, "Additional features; ColorSync 4.0")],
  }),
  change({
    key: "macos-10-1-audio-architecture",
    title: "Revised high-resolution audio architecture",
    canonicalSummary:
      "Version 10.1 added a system audio architecture supporting 32-bit, 96-kHz audio, multiple channels, low-latency work, and built-in MIDI.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple documented these capabilities as an operating-system audio foundation rather than a guarantee that every application or device used the maximum format.",
    citations: [c(U.launch101, "Additional features; audio architecture")],
  }),
  change({
    key: "macos-10-1-applescript-soap-xml",
    title: "AppleScript, SOAP, and XML scripting",
    canonicalSummary:
      "Version 10.1 improved AppleScript throughout the system and added support for internet scripting with SOAP and XML.",
    category: "developerApi",
    action: "changed",
    summary:
      "The update connected desktop automation to web-service technologies while strengthening AppleScript integration across the operating system.",
    citations: [
      c(U.launch101, "Additional features; AppleScript and internet scripting"),
      c(U.preview101, "AppleScript, SOAP, and XML feature"),
    ],
  }),
  change({
    key: "macos-10-1-upgrade-distribution",
    title: "Free and paid CD upgrade paths",
    canonicalSummary:
      "Apple distributed version 10.1 through a paid Up-To-Date CD package, a temporary free in-store kit for existing owners, and a full retail package for new customers.",
    category: "compatibility",
    action: "changed",
    summary:
      "The September 25 announcement scheduled broad store availability for September 29. Existing owners could obtain a $19.95 shipped kit or, while supplies lasted, a free retail kit through October 31; the full US retail product remained $129.",
    citations: [
      c(U.launch101, "Pricing & Availability"),
      c(U.tidbits101, "September 29 CD distribution paths"),
    ],
  }),
  change({
    key: "macos-10-1-hardware-baseline",
    title: "Version 10.1 supported-Mac baseline",
    canonicalSummary:
      "Version 10.1 required 128MB of memory and supported Apple's listed G3 and G4 Mac families.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple named iMac, iBook, Power Macintosh G3, Power Mac G4, Power Mac G4 Cube, and PowerBook models introduced after May 1998.",
    citations: [
      c(U.launch101, "System requirements"),
      c(U.preview101, "Availability & Requirements"),
    ],
  }),
  change({
    key: "macos-10-1-crontab-file-disclosure",
    title: "crontab local-file disclosure",
    canonicalSummary:
      "Version 10.1 corrected a crontab weakness that could let local users read files with valid crontab syntax.",
    category: "security",
    action: "fixed",
    summary:
      "Apple tied the correction to the FreeBSD crontab advisory and described the attacker boundary as another local user.",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; crontab")],
  }),
  change({
    key: "macos-10-1-fetchmail-input-safety",
    title: "fetchmail input and memory safety",
    canonicalSummary:
      "Version 10.1 incorporated corrections for fetchmail buffer overflow, oversized-header, and SSL memory-overwrite issues.",
    category: "security",
    action: "fixed",
    summary:
      "Apple grouped three upstream fetchmail issues under the initial 10.1 security content; this occurrence keeps them together at their shared component boundary.",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; fetchmail")],
  }),
  change({
    key: "macos-10-1-firewall-tcp-sequence-hardening",
    title: "Firewall and TCP sequence hardening",
    canonicalSummary:
      "Version 10.1 corrected ipfw handling of crafted ECE-flagged packets and strengthened TCP initial-sequence-number generation.",
    category: "security",
    action: "fixed",
    summary:
      "The two network-stack corrections addressed a remotely constructed firewall attack condition and insufficient randomness in connection sequence numbers.",
    verificationMethod: securityVerification101,
    citations: [
      c(U.securityEarly, "Mac OS X 10.1; ipfw"),
      c(U.securityEarly, "Mac OS X 10.1; TCP Initial Sequence Numbers"),
    ],
  }),
  change({
    key: "macos-10-1-java-applet-isolation",
    title: "Java applet proxy and clipboard isolation",
    canonicalSummary:
      "Version 10.1 prevented untrusted Java applets from monitoring HTTP proxy traffic or accessing the system clipboard without authorization.",
    category: "security",
    action: "fixed",
    summary:
      "Apple's chronology identifies separate proxy-observation and clipboard-access boundaries under the initial release.",
    verificationMethod: securityVerification101,
    citations: [
      c(U.securityEarly, "Mac OS X 10.1; java"),
      c(U.securityEarly, "Mac OS X 10.1; system clipboard / J2SE"),
    ],
  }),
  change({
    key: "macos-10-1-open-syscall-io-authorization",
    title: "open() system-call authorization",
    canonicalSummary:
      "Version 10.1 corrected an open() system-call weakness that could permit unauthorized I/O against another user's file.",
    category: "security",
    action: "fixed",
    summary:
      "The documented boundary is local cross-user access rather than remote code execution.",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; open() syscall")],
  }),
  change({
    key: "macos-10-1-openssl-0-9-6b",
    title: "OpenSSL 0.9.6b security maintenance",
    canonicalSummary:
      "Version 10.1 updated OpenSSL to 0.9.6b with multiple upstream corrections.",
    category: "security",
    action: "fixed",
    summary:
      "Apple's retained chronology confirms the updated version but does not enumerate the individual OpenSSL issues on the page, so this occurrence stays at package level.",
    documentedStatus: "partiallyDocumented",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; OpenSSL")],
  }),
  change({
    key: "macos-10-1-procmail-signal-handling",
    title: "procmail signal handling",
    canonicalSummary:
      "Version 10.1 corrected unsafe signal handling in procmail.",
    category: "security",
    action: "fixed",
    summary:
      "Apple identifies the upstream advisory and the component boundary without making a broader Mail application claim.",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; procmail")],
  }),
  change({
    key: "macos-10-1-rwhod-timed-denial-of-service",
    title: "rwhod and timed denial-of-service handling",
    canonicalSummary:
      "Version 10.1 corrected remotely triggerable crash conditions in the rwhod and timed daemons.",
    category: "security",
    action: "fixed",
    summary:
      "Apple described both issues as remote denial-of-service conditions against clients of the affected network daemons.",
    verificationMethod: securityVerification101,
    citations: [
      c(U.securityEarly, "Mac OS X 10.1; rwhod"),
      c(U.securityEarly, "Mac OS X 10.1; timed"),
    ],
  }),
  change({
    key: "macos-10-1-telnetd-code-execution",
    title: "telnetd remote code execution",
    canonicalSummary:
      "Version 10.1 corrected a telnetd weakness that could let a remote user execute code as the daemon's account.",
    category: "security",
    action: "fixed",
    summary:
      "The occurrence preserves the service-account privilege boundary stated by Apple and does not imply the service was enabled by default.",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; telnetd")],
  }),
  change({
    key: "macos-10-1-tcpdump-input-safety",
    title: "tcpdump packet-input safety",
    canonicalSummary:
      "Version 10.1 corrected packet input that could crash tcpdump and might permit arbitrary code execution.",
    category: "security",
    action: "fixed",
    summary:
      "Apple described a remote packet source affecting the local capture process and preserved possible code execution as a qualified outcome.",
    verificationMethod: securityVerification101,
    citations: [c(U.securityEarly, "Mac OS X 10.1; tcpdump")],
  }),
  change({
    key: "macos-10-1-local-utility-safety",
    title: "setlocale, sort, and tcsh utility safety",
    canonicalSummary:
      "Version 10.1 corrected local utility flaws involving locale expansion, sort crashes, and shell-redirection file overwrite.",
    category: "security",
    action: "fixed",
    summary:
      "Apple's chronology describes potential exploitation through setlocale string overflows, disruption of administration tools through sort, and an unprivileged-user overwrite condition in tcsh. The shell operator is not repeated because the retained entry's title and explanation use inconsistent notation.",
    verificationMethod: securityVerification101,
    citations: [
      c(U.securityEarly, "Mac OS X 10.1; setlocale() string overflow"),
      c(U.securityEarly, "Mac OS X 10.1; sort"),
      c(U.securityEarly, "Mac OS X 10.1; tcsh operator"),
    ],
  }),
];

const version100 = {
  releaseVersionId: "version-macos-10-0",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch100,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X 10.0 became publicly available in stores on March 24, 2001. The release established Apple's new desktop operating-system line around a Darwin UNIX foundation, protected process behavior, Quartz graphics, Aqua, native and transitional application frameworks, and internet-oriented services.",
      [
        c(U.announce100, "January announcement and March 24 date"),
        c(U.launch100, "March 24 worldwide retail availability"),
      ],
    ),
    heading("System architecture"),
    prose(
      "Darwin supplied the open-source UNIX base, with protected memory, preemptive multitasking, and symmetric multiprocessing on supported dual-processor Macs. Quartz, OpenGL, QuickTime, Java 2, BSD services, and web technologies formed the major graphics, media, runtime, and server-facing layers.",
      [
        c(U.announce100, "Architecture and feature inventory"),
        c(U.launch100, "Architecture and extended feature inventory"),
      ],
    ),
    heading("Interface and application transition"),
    prose(
      "Aqua and the Dock introduced a different interaction and visual model. Apple paired that break with three application paths: Classic for much existing software through Mac OS 9.1, Carbon for adapted Mac applications, and Cocoa for software written around the new native object-oriented framework.",
      [
        c(U.announce100, "Aqua, Dock, Classic, Carbon, and Cocoa"),
        c(U.launch100, "Aqua and boxed Classic content"),
      ],
    ),
    heading("Internet, media, and services"),
    prose(
      "The shipping system included Mail, Internet Explorer 5.1 Preview, QuickTime Player, and Sherlock, plus iTools and iDisk integration. QuickTime 5 was part of the operating system, while Apple offered iMovie 2, iTunes, and an AppleWorks preview as separate March 24 downloads rather than representing them here as bundled 10.0 changes.",
      [
        c(U.announce100, "Internet applications and services"),
        c(U.launch100, "QuickTime and separate Apple application downloads"),
      ],
    ),
    heading("Memory, power, and networking"),
    prose(
      "Dynamic memory allocation removed manual per-application sizing, portable power management revised wake behavior, and automatic networking reduced connection reconfiguration. A unified network interface included direct support for PPPoE-based DSL services.",
      [c(U.launch100, "Dynamic memory through network-management features")],
    ),
    heading("Fonts, printing, accounts, and security"),
    prose(
      "The launch package supported TrueType, Type 1, and OpenType fonts, included a substantial font collection, and bundled printer support for selected HP, Canon, and Epson devices. Multi-user privileges and Kerberos-backed file and network security were documented as launch capabilities; they are not presented as individual vulnerability fixes.",
      [
        c(U.launch100, "Fonts, printers, multi-user, and security features"),
        c(U.announce100, "Quartz font support"),
      ],
    ),
    heading("Package and hardware"),
    prose(
      "The US retail price was $129. One CD carried seven languages, and the box also included Mac OS 9.1 and developer tools. Apple's final launch baseline required 128MB of memory and listed supported G3 and G4 Mac families, including PowerBooks introduced after May 1998.",
      [c(U.launch100, "Pricing & Availability and requirements")],
    ),
    heading("Beta, maintenance, and security boundary"),
    prose(
      "Apple's September 2000 Public Beta informed changes to the Dock, Desktop, Finder, and networking, but it is not an eligible local route in this batch. Apple's later May announcement identifies CD burning as part of 10.0.2, and the retained early-security chronology first names OpenSSH in 10.0.1 and FTP or NTP corrections in 10.0.2. None of those point-release changes is projected backward into the March 24 package.",
      [
        c(U.announce100, "Public Beta feedback boundary"),
        c(U.laterUpdate100, "10.0.2 and earlier 10.0 update boundary"),
        c(U.securityEarly, "Mac OS X 10.0.1 and 10.0.2 entries"),
      ],
    ),
    heading("Launch ecosystem context"),
    prose(
      "Apple reported more than 350 Mac OS X applications shipping immediately before launch and more than 10,000 developer organizations working on the platform. These are vendor-supplied ecosystem figures, not independent measures of application completeness or active use.",
      [c(U.developers100, "March 21 developer-ecosystem claims")],
    ),
  ),
  citations: [
    c(U.announce100, "January 9 announcement"),
    c(U.launch100, "March 24 public launch"),
    c(U.developers100, "Launch ecosystem context"),
    c(U.laterUpdate100, "Later 10.0.2 boundary"),
    c(U.securityEarly, "Initial-versus-point security boundary"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event100 = {
  target: {
    releaseVersionId: "version-macos-10-0",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "The first public Mac OS X release reached worldwide retail on March 24, 2001 with a Darwin UNIX base, Aqua and the Dock, Quartz, Classic/Carbon/Cocoa transition paths, and a new internet-oriented desktop foundation.",
  article: article(
    heading("Public release"),
    prose(
      "Apple's January announcement and final March launch notice both name March 24, 2001. The later notice says customers could buy Mac OS X in retail stores worldwide that Saturday, precisely matching the existing Public route.",
      [
        c(U.announce100, "March 24 shipping date"),
        c(U.launch100, "March 24 worldwide retail availability"),
      ],
    ),
    heading("What this page records"),
    prose(
      `The structured inventory contains ${changes100.length} documented launch deltas across architecture, interface, application compatibility, internet services, memory, power, networking, fonts, printing, account controls, security facilities, and the retail hardware baseline.`,
      [
        c(U.announce100, "Launch feature inventory"),
        c(U.launch100, "Extended launch inventory"),
      ],
    ),
    heading("Platform transition"),
    prose(
      "The release was both a new native platform and a migration system. Classic used the included Mac OS 9.1 environment for much existing software, Carbon gave revised Mac applications a native bridge, and Cocoa represented the new object-oriented path.",
      [
        c(U.announce100, "Classic, Carbon, and Cocoa"),
        c(U.launch100, "Mac OS 9.1 package content"),
      ],
    ),
    heading("Release package"),
    prose(
      "The $129 US package carried seven languages on one CD and included Mac OS 9.1 and developer tools. The requirements named 128MB of memory and Apple's specified G3 and G4 systems.",
      [c(U.launch100, "Pricing & Availability and requirements")],
    ),
    heading("Public Beta and point-release boundary"),
    prose(
      "The Public Beta preceded this route in September 2000 but is absent from the local seed and is not created here. CD burning, update-delivered stability work, OpenSSH, FTP, and NTP changes belong to later 10.0.x packages and remain excluded.",
      [
        c(U.announce100, "Public Beta history"),
        c(U.laterUpdate100, "10.0.2 update scope"),
        c(U.securityEarly, "10.0.1 and 10.0.2 security entries"),
      ],
    ),
    heading("Naming boundary"),
    prose(
      "The local record carries the retrospective version note “Cheetah,” but the retained 2001 Apple launch material calls the product Mac OS X without that nickname. The article therefore uses the period public name and does not attribute the catalog note to Apple's launch marketing.",
      [c(U.announce100, "Period product naming")],
    ),
    heading("Reporting boundary"),
    prose(
      "Apple's launch-period application and developer counts are retained only as the company's own report. This page does not infer adoption, software quality, or completeness from those figures.",
      [c(U.developers100, "Apple-reported application and developer counts")],
    ),
  ),
  citations: [
    c(U.announce100, "January 9 announcement"),
    c(U.launch100, "March 24 public launch"),
    c(U.developers100, "Launch ecosystem context"),
    c(U.laterUpdate100, "Later update boundary"),
    c(U.securityEarly, "Early security chronology"),
  ],
  changes: changes100,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
  isIndexable: true,
};

const version101 = {
  releaseVersionId: "version-macos-10-1",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.launch101,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X 10.1 was Apple's first major Mac OS X upgrade. The local Public route is dated September 25, 2001, when Apple announced the finished release at Seybold; Apple's announcement scheduled broad retail and free in-store upgrade distribution for Saturday, September 29, while contemporaneous reporting records upgrade CDs at Apple's conference booth that week.",
      [
        c(
          U.launch101,
          "September 25 announcement and September 29 retail date",
        ),
        c(U.tidbits101, "Seybold booth and September 29 distribution"),
      ],
    ),
    heading("Performance and Aqua"),
    prose(
      "The release concentrated on responsiveness across launches, menus, windows, copying, startup, login, Classic, OpenGL, and Java. Aqua gained a Dock that could sit on three screen edges, system status controls in the menu bar, and automatic file-extension management.",
      [
        c(U.launch101, "Performance and Aqua paragraphs"),
        c(U.preview101, "Final-confirmed performance and interface details"),
      ],
    ),
    heading("Digital media"),
    prose(
      "Finder gained data CD and supported DVD-R burning, DVD Player added movie playback on compatible hardware, and iTunes plus iMovie 2 moved into the installation. The system audio architecture added high-resolution, multichannel, low-latency, and MIDI capabilities.",
      [
        c(U.launch101, "Digital Hub, DVD, bundled applications, and audio"),
        c(U.preview101, "Final-confirmed Digital Hub details"),
      ],
    ),
    heading("Imaging and peripherals"),
    prose(
      "Image Capture automated photo transfer from supported cameras. Printing gained more vendor drivers, automatic inkjet setup, and a large PostScript PPD set; OpenGL was updated with GeForce3 support, and ColorSync 4.0 revised ICC color management.",
      [
        c(U.launch101, "Image Capture, printing, OpenGL, and ColorSync"),
        c(U.apps101, "Camera ecosystem context"),
      ],
    ),
    heading("Networking and scripting"),
    prose(
      "An integrated SMB/CIFS client joined AFP, NFS, and WebDAV access, making Windows file networking a first-class client scenario. iDisk moved to WebDAV, and AppleScript improvements added SOAP and XML internet-scripting support.",
      [
        c(U.launch101, "Networking, iDisk, and scripting"),
        c(U.preview101, "Final-confirmed network and scripting details"),
      ],
    ),
    heading("Security content"),
    prose(
      "Apple's retained early-security chronology places a substantial set of corrections under the exact Mac OS X 10.1 heading. They cover crontab, fetchmail, ipfw and TCP sequence generation, Java applet isolation, the open system call, OpenSSL, procmail, rwhod, setlocale, sort, tcpdump, tcsh, telnetd, and timed. The structured records group closely related component boundaries without projecting later 10.1.x or October security-update content backward.",
      [c(U.securityEarly, "Mac OS X 10.1 security entry")],
    ),
    heading("Availability and hardware"),
    prose(
      "Apple offered existing owners a shipped $19.95 Up-To-Date kit and a temporary free retail kit, while new customers could buy the $129 US full product. Broad retail availability began September 29. The supported-hardware list required 128MB of memory and named Apple's then-current G3 and G4 Mac families.",
      [
        c(U.launch101, "Pricing & Availability and requirements"),
        c(U.tidbits101, "CD-only upgrade and September 29 availability"),
      ],
    ),
    heading("Application ecosystem"),
    prose(
      "On September 25 Apple reported more than 1,400 native applications available for 10.1 and highlighted support from major software and peripheral vendors. Those figures and endorsements are launch context supplied by Apple and its partners, not an independent compatibility audit.",
      [c(U.apps101, "September 25 application-ecosystem announcement")],
    ),
    heading("Preview, server, and maintenance boundary"),
    prose(
      "Apple previewed 10.1 in July, but the local catalog has no prerelease route for this version; preview text is used only where the September announcement confirms the shipped capability. Mac OS X Server 10.1 was a separate product, and later client point releases or the October 19 security update are not attached to this initial Public event.",
      [
        c(U.preview101, "July preview scope"),
        c(U.launch101, "September client-release scope"),
        c(U.server101, "September 25 separate Server 10.1 announcement"),
        c(
          U.securityEarly,
          "Mac OS X 10.1 versus later 10.1 security-update entries",
        ),
      ],
    ),
  ),
  citations: [
    c(U.preview101, "July 18 preview"),
    c(U.launch101, "September 25 announcement and September 29 retail date"),
    c(U.apps101, "Application and device ecosystem"),
    c(U.server101, "Separate Server 10.1 boundary"),
    c(U.securityEarly, "Initial 10.1 security content"),
    c(U.tidbits101, "Contemporaneous distribution detail"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event101 = {
  target: {
    releaseVersionId: "version-macos-10-1",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "The catalog anchors Mac OS X 10.1 to Apple's September 25, 2001 announcement and limited conference-week distribution; broad retail and free store pickup began September 29, bringing major performance, interface, media, networking, peripheral, scripting, and security changes.",
  article: article(
    heading("Public appearance and retail availability"),
    prose(
      "Apple announced the finished 10.1 client upgrade on September 25 at Seybold and dated its companion application announcement the same day. The release announcement says stores would begin broad distribution on September 29; TidBITS reported that Seybold attendees could obtain the free upgrade at Apple's booth during the conference. The existing September 25 Public route is retained with this availability split disclosed.",
      [
        c(
          U.launch101,
          "September 25 announcement and September 29 availability",
        ),
        c(U.apps101, "September 25 finished-release context"),
        c(U.tidbits101, "Seybold booth distribution and September 29"),
      ],
    ),
    heading("What this page records"),
    prose(
      `The ${changes101.length} structured changes cover performance, Aqua, digital media, cameras, bundled applications, network protocols, printing, graphics, color, audio, scripting, distribution, hardware, and the security corrections Apple places under the initial 10.1 heading.`,
      [
        c(U.launch101, "Public release feature inventory"),
        c(U.securityEarly, "Mac OS X 10.1 security entry"),
      ],
    ),
    heading("From preview to release"),
    prose(
      "Apple's July preview supplied early interaction detail, but no separate prerelease event is created because the seed contains only Public. Every preview-derived feature used here is independently named by the September shipping announcement.",
      [
        c(U.preview101, "July preview"),
        c(U.launch101, "September final feature confirmation"),
      ],
    ),
    heading("Upgrade distribution"),
    prose(
      "The 10.1 upgrade was too large for Apple's ordinary Software Update delivery at the time and was distributed on CD. Existing owners had paid mail-order and temporary free pickup options; new customers could buy the full retail package.",
      [
        c(U.launch101, "Upgrade package contents and pricing"),
        c(U.tidbits101, "CD-only distribution explanation"),
      ],
    ),
    heading("Security boundary"),
    prose(
      "The security inventory is limited to entries Apple lists under Mac OS X 10.1 itself. The October 19 privilege update, Internet Explorer 5.1.1, and 10.1.3 through 10.1.5 belong to later packages and are not inherited.",
      [
        c(
          U.securityEarly,
          "Mac OS X 10.1 and adjacent later security headings",
        ),
      ],
    ),
    heading("Client and server boundary"),
    prose(
      "This page covers the desktop client. Apple's separately announced Mac OS X Server 10.1 included server-specific storage, NetBoot, directory, database, web, and streaming changes that do not belong on this route.",
      [
        c(U.launch101, "Client product scope"),
        c(
          U.server101,
          "Separate Server 10.1 availability and server-only feature inventory",
        ),
      ],
    ),
    heading("Naming boundary"),
    prose(
      "The local record carries the retrospective version note “Puma,” but the retained public Apple material calls the product Mac OS X version 10.1. Reader-facing copy uses that period name and does not present the catalog note as launch branding.",
      [c(U.launch101, "Period product naming")],
    ),
    heading("Evidence boundary"),
    prose(
      "Apple's benchmark multipliers, application count, and partner statements are vendor-supplied. They are kept as attributed launch context and are not converted into independent performance, compatibility, or adoption conclusions.",
      [
        c(U.launch101, "Apple performance testing"),
        c(U.apps101, "Application and partner statements"),
      ],
    ),
  ),
  citations: [
    c(U.preview101, "July preview"),
    c(U.launch101, "September client announcement"),
    c(U.apps101, "September application ecosystem"),
    c(U.server101, "Separate Server 10.1 boundary"),
    c(U.securityEarly, "Initial 10.1 security content"),
    c(U.tidbits101, "Contemporaneous distribution detail"),
  ],
  changes: changes101,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
  isIndexable: true,
};

const bundle = {
  formatVersion: 1,
  target: { projectId: "lh3yswzu", dataset: "production" },
  accessedAt,
  sources,
  versions: [version100, version101],
  events: [event100, event101],
  builds: [],
};

const seed = JSON.parse(
  readFileSync(join(here, "..", "seed-data.json"), "utf8"),
);
const eligibleSeedVersions = seed.releaseVersions
  .filter(
    (item) =>
      item.platform === "macOS" && item.publicReleaseDate?.startsWith("2001-"),
  )
  .sort((left, right) => left.version.localeCompare(right.version));

const expectedSeed = [
  {
    version: "10.0",
    majorVersion: 10,
    publicReleaseDate: "2001-03-24",
    versionNote: "Cheetah",
  },
  {
    version: "10.1",
    majorVersion: 10,
    publicReleaseDate: "2001-09-25",
    versionNote: "Puma",
  },
];

if (
  eligibleSeedVersions.length !== expectedSeed.length ||
  eligibleSeedVersions.some((item, index) => {
    const expected = expectedSeed[index];
    return (
      item.version !== expected.version ||
      item.majorVersion !== expected.majorVersion ||
      item.publicReleaseDate !== expected.publicReleaseDate ||
      item.versionNote !== expected.versionNote ||
      item.milestones.length !== 1 ||
      item.milestones[0].label !== "Public" ||
      item.milestones[0].date !== expected.publicReleaseDate ||
      item.milestones[0].isRevision !== false
    );
  })
) {
  throw new Error(
    "The local 2001 Mac OS X seed inventory changed; re-audit this cohort before regenerating.",
  );
}

const expectedVersionIds = new Set([
  "version-macos-10-0",
  "version-macos-10-1",
]);
if (
  bundle.versions.length !== 2 ||
  bundle.events.length !== 2 ||
  bundle.builds.length !== 0 ||
  bundle.events.reduce(
    (sum, releaseEvent) => sum + releaseEvent.changes.length,
    0,
  ) !== 50 ||
  bundle.versions.some(
    (item) => !expectedVersionIds.has(item.releaseVersionId),
  ) ||
  bundle.events.some(
    (item) =>
      Object.keys(item.target).length !== 2 ||
      !expectedVersionIds.has(item.target.releaseVersionId) ||
      item.target.routeAlias !== "public",
  )
) {
  throw new Error("The expected 2001 Mac OS X bundle closure no longer holds.");
}

const localChangeKeys = bundle.events.flatMap((item) =>
  item.changes.map((occurrence) => occurrence.key),
);
if (new Set(localChangeKeys).size !== localChangeKeys.length) {
  throw new Error(
    "The 2001 Mac OS X bundle contains duplicate local change keys.",
  );
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
      if (!otherChangeKeys.has(item.key)) {
        otherChangeKeys.set(item.key, file);
      }
    }
  }
}
const collisions = localChangeKeys.filter((key) => otherChangeKeys.has(key));
if (collisions.length > 0) {
  throw new Error(
    `2001 Mac OS X change keys collide with existing batches: ${collisions
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

const categoryCounts = bundle.events
  .flatMap((item) => item.changes)
  .reduce((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    return counts;
  }, {});

const md = `# Apple 2001 Mac OS X public-release research batch

## Result

\`${outputName}\` enriches every existing local Mac OS X Public release in calendar year 2001: versions 10.0 and 10.1. Both articles are copyright-safe original synthesis grounded primarily in retained Apple material.

- 2 of 2 eligible local versions have source-linked overview articles.
- 2 of 2 same-date Public routes have release-specific summaries and articles.
- 50 structured change occurrences are attached to those Public routes: ${categoryCounts.feature} features, ${categoryCounts.enhancement} enhancements, ${categoryCounts.developerApi} developer-platform changes, ${categoryCounts.compatibility} compatibility or distribution changes, ${categoryCounts.security} security changes, and ${categoryCounts.behavior} behavior change.
- ${sources.length} sources are declared and used: 8 retained Apple Newsroom announcements, 1 Apple Support security chronology, and 1 contemporaneous TidBITS report.
- The citation audit counts ${citationCount} claim-level or page-level references.
- Both selectors contain only \`releaseVersionId\` plus \`routeAlias: "public"\`.
- All four overlays are \`editoriallyVerified\` and \`approved\` as of
  \`${reviewedAt}\`; both events are indexable.
- No prerelease route, point version, server record, build, or missing identity
  is created.

## Exact local closure

| Existing record | Local version note | Seed milestones | Seed Public date | Structured changes | Event article blocks |
| --- | --- | ---: | --- | ---: | ---: |
| \`version-macos-10-0\` | Cheetah | 1 | 2001-03-24 | ${changes100.length} | ${event100.article.blocks.length} |
| \`version-macos-10-1\` | Puma | 1 | 2001-09-25 | ${changes101.length} | ${event101.article.blocks.length} |
| **Total** | | **2** | | **50** | **${event100.article.blocks.length + event101.article.blocks.length}** |

These are the only local \`macOS\` records whose \`publicReleaseDate\` falls in 2001. Each has exactly one non-revision Public milestone matching its local date. No existing research batch owned either deterministic version ID or any \`macos-10-0-*\` / \`macos-10-1-*\` change key when this generator was created.

## Timeline, naming, and evidence audit

Fifteen points require explicit editorial awareness:

1. The local platform family is the modern \`macOS\` label. Apple's 2001 sources call the product Mac OS X, which is retained throughout reader-facing prose.
2. The local version notes are “Cheetah” and “Puma.” The retained Apple public-release material does not use those nicknames, so the articles do not present them as 2001 launch branding.
3. Version 10.0's March 24 date has direct first-party support from both Apple's January announcement and final March launch notice.
4. Version 10.1 has a genuine availability split. Apple announced the finished client release on September 25 and scheduled broad retail and free store pickup for September 29. TidBITS documents free upgrade CDs at Apple's Seybold booth during the conference. The audited September 25 route is preserved, but it is not described as the start of universal retail availability.
5. The Mac OS X Public Beta shipped in September 2000 and informed 10.0, but it is absent from the seed and no prerelease record is created.
6. Apple's July 10.1 preview is used only where the September release announcement confirms the same shipped feature. No preview event or preview-only claim is added.
7. Apple's May 1 announcement identifies music-CD burning and stability work as 10.0.2. Those changes do not belong to initial 10.0 and are explicitly excluded.
8. Apple's retained security chronology has no initial 10.0 correction block. It first names OpenSSH under 10.0.1 and FTP/NTP fixes under 10.0.2. The 10.0 Kerberos occurrence is a launch security capability, not a vulnerability repair.
9. The same Apple chronology has an exact initial \`Mac OS X 10.1\` heading. Initial security changes are synthesized only from that block; the October 19 update, Internet Explorer 5.1.1, and later 10.1.x headings remain outside the event.
10. Closely related security items are grouped at coherent boundaries: fetchmail input flaws, Java applet isolation, network-stack hardening, daemon denial of service, and local utility safety. Individual conditions and severity remain visible.
11. The retained tcsh security entry uses inconsistent redirection-operator notation between its label and explanation. The synthesis records the file-overwrite boundary without choosing one operator.
12. Mac OS X Server 10.1 was separately announced on September 25. Its server-only storage, NetBoot, directory, database, web, and streaming changes are excluded.
13. Publicly circulated build numbers are not first-party release identities in this cohort and no build record is created.
14. Historical US pricing, package contents, and hardware requirements are time-bounded launch facts, not current purchase or compatibility advice.
15. Apple-supplied application counts, developer counts, benchmark multipliers, and partner statements are labeled vendor-reported and are not converted into independent adoption, quality, or compatibility conclusions.

## Release-change inventory

| Version | Reader-facing scope |
| --- | --- |
| 10.0 | Darwin and BSD UNIX; protected memory and preemptive multitasking; symmetric multiprocessing; Quartz/PDF; OpenGL; QuickTime 5; Aqua and Dock; Classic, Carbon, Cocoa, and Java 2; bundled internet apps; iTools/iDisk; dynamic memory; portable power; automatic networking/PPPoE; fonts; printers; multi-user controls; Kerberos security; retail package and hardware |
| 10.1 | Systemwide performance; movable Dock; status controls; file-extension handling; optical-disc burning and DVD playback; Image Capture; bundled iTunes/iMovie; SMB and multiprotocol networking; WebDAV iDisk; printing; OpenGL/GeForce3; ColorSync; audio; AppleScript/SOAP/XML; CD upgrade paths; hardware; 11 grouped first-party security corrections |

## Verified source set

All nine URLs resolved to the named page during research on ${accessedAt}.

### Mac OS X 10.0

- [Apple’s Mac OS X to Ship on March 24](${U.announce100})
- [Mac OS X Hits Stores This Weekend](${U.launch100})
- [More than 10,000 Developers Working on Mac OS X Solutions](${U.developers100})
- [Apple Releases Mac OS X Update with CD Burning](${U.laterUpdate100}) — used only to enforce the 10.0.2 boundary

### Mac OS X 10.1

- [Apple Previews Next Version of Mac OS X](${U.preview101})
- [First Major Upgrade to Mac OS X Hits Stores This Weekend](${U.launch101})
- [More than 1,400 Third-Party Applications Now Available for Mac OS X v10.1](${U.apps101})
- [Major Mac OS X Server v10.1 Update Now Available](${U.server101}) — used only to enforce the client/server boundary
- [Apple security updates (August, 2003 and earlier)](${U.securityEarly})
- [Free Mac OS X 10.1 Upgrade Available 29-Sep-01](${U.tidbits101})

TidBITS is classified as journalism and is used only to clarify physical CD distribution and Seybold access. It is not substituted for Apple's feature or security documentation.

## Editorial and copyright method

All page summaries, article paragraphs, canonical summaries, and occurrence descriptions are newly written. Citations carry exact feature, section, component, date, or chronology locators rather than copying source paragraphs.

Historical product, framework, protocol, and application names are used nominatively. Press-release superlatives, trademark symbols, partner endorsements, lengthy quotations, and boilerplate are excluded. Vendor benchmarks and ecosystem totals are paraphrased and attributed.

Related upstream security fixes are combined only where they share an intelligible component or threat boundary. The source's conditions remain visible: local-user access for crontab and open(), untrusted applets for Java isolation, remote packets for tcpdump and firewall handling, service-account execution for telnetd, and denial of service for rwhod or timed.

## Evidence limits

- Apple's retained 10.0 launch pages are detailed feature announcements, not a conventional itemized release-note document.
- No initial 10.0 component-level security correction is asserted.
- Version 10.1's September 25 seed date is not represented as the broad retail date; that date was September 29 in Apple's own announcement.
- Security descriptions rely on Apple's retained chronology because several linked 2001 upstream advisories are no longer reliably available. The manifest cites Apple's surviving summaries rather than inventing missing advisory detail.
- OpenSSL 0.9.6b remains \`partiallyDocumented\` because Apple's page says it contains multiple fixes without enumerating them.
- No undocumented or community-only behavior is added merely to increase coverage.
- Public Beta, 10.0.x, 10.1.x, server-only content, and builds are intentionally absent.

## Validation

- JSON parsing and launch-content schema validation passed. The repository validator accepted all 40 concurrent research batches and 2,092 globally consistent change keys.
- Seed comparison: 2 exact 2001 versions, 2 version overlays, and 2 Public-event overlays, with no missing or extra identities.
- Target check: both event selectors contain only \`releaseVersionId\` and \`routeAlias: "public"\`.
- Citation closure: every citation URL has one source declaration and every declared source is used.
- Change identity: all 50 local keys are unique and did not collide with the existing batch corpus during generation.
- Review state: all four overlays are \`editoriallyVerified\` and \`approved\`
  as of \`${reviewedAt}\`; both events have \`isIndexable: true\`.
- Deterministic bundle SHA-256: \`${jsonSha}\`.
- A second generator run reproduced the JSON byte for byte at the same SHA-256.
- Focused launch-content ingestion and manifest tests passed 19 of 19.
- ESLint passed for the generator, and Prettier passed for the generator, JSON, and ledger.
- The approved production dry run reported 59 creates, 4
  revision-guarded patches, and 2,081 unchanged documents. Creates were
  exactly 9 sources and 50 release changes; no version, event, or build
  document was created.
- The four guarded patches target the two existing Public events and two
  existing version records. Event patches set only article body, changes,
  citations, editorial review, indexing state, provenance status, and
  summary. Version patches set only citations, editorial review, overview,
  provenance status, and release-notes URL. No field is unset and no document
  is deleted.
- Approved production plan SHA-256:
  \`58e0b8284369500b3cf300ae9f0d486891f91c8b97293a791512e85c4e9542b6\`;
  mutation payload: 156,427 bytes (4.0% of the guarded limit).
- Serialized plan artifact SHA-256:
  \`03d181b378ec03ef02f5764c7ec35a8fd127b623d8bfbcffefd1720cc41ab278\`;
  rollback artifact SHA-256:
  \`e5a2bf8b1996ad55ccd8f6ee59c19753f4aef788ab598c25a8d1465c8f98030a\`.
- Production apply committed and zero-residual verified in transaction
  \`tt1fSB5HY9GAB0YLyyAr3z\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,144 unchanged
  documents. Its plan SHA is
  \`19555536e3f76a93fe879e847077590107ceb03bb80c72a56e9359bf6c2abeed\`.
- The representative local routes \`/apple/macos/10.0\` and
  \`/apple/macos/10.1\` returned HTTP 200 with full articles, references, and
  indexable metadata. Their \`/public\` aliases returned the expected canonical
  redirects.
- Root and independent editorial review approved the copyright-safe synthesis,
  evidence boundaries, chronology disclosures, provenance, and indexing state
  at \`${reviewedAt}\`.

## Human approval checklist

- [x] Accept period-public Mac OS X naming while retaining the local nickname fields only as catalog metadata.
- [x] Accept the September 25 announcement/limited-access versus September 29 broad-retail distinction for 10.1.
- [x] Accept the explicit exclusion of Public Beta, point releases, server content, and builds.
- [x] Accept 10.0's security capability without inferring initial vulnerability repairs.
- [x] Accept the 10.1 security grouping and the package-level OpenSSL evidence limit.
- [x] Make both events indexable after source and editorial review.

## Reproduction

\`\`\`bash
node scripts/research-batches/build-apple-macos-2001.mjs
npm run research:validate
node --import tsx --test tests/launch-content-ingestion.test.ts tests/launch-content-manifest.test.ts
npx eslint scripts/research-batches/build-apple-macos-2001.mjs
npx prettier --check scripts/research-batches/build-apple-macos-2001.mjs scripts/research-batches/apple-macos-2001.json scripts/research-batches/apple-macos-2001.md
npx sanity exec scripts/ingest-launch-content.ts --with-user-token -- --content scripts/research-batches/apple-macos-2001.json
\`\`\`

The final command is a dry run only. The exact reviewed production apply is
recorded in the validation receipt after it is committed; the generator never
performs that apply itself.
`;

const notesPath = join(here, "apple-macos-2001.md");
writeFileSync(
  notesPath,
  await prettier.format(md, {
    filepath: notesPath,
  }),
);
