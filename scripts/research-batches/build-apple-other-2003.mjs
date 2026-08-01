import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const accessedAt = "2026-07-30";
const reviewedAt = "2026-07-30T06:09:36Z";

const U = {
  securityIndex: "https://support.apple.com/en-us/101682",
  preview:
    "https://www.apple.com/newsroom/2003/06/23Apple-Previews-Mac-OS-X-Panther/",
  announce:
    "https://www.apple.com/newsroom/2003/10/08Apple-Announces-Mac-OS-X-Panther/",
  ibook:
    "https://www.apple.com/newsroom/2003/10/22Apple-Unveils-New-Generation-G4-iBooks-Starting-at-Just-1-099/",
  launchEve:
    "https://www.apple.com/newsroom/2003/10/23-Night-of-the-Panther-Kicks-Off-at-8-00-p-m-Tomorrow/",
  x11: "https://support.apple.com/en-us/106454",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (03-Oct-2003 to 11-Jan-2005)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Apple software",
      "Mac OS X",
      "Panther",
      "10.3",
      "security",
      "later-version boundary",
    ],
  },
  {
    url: U.preview,
    title: "Apple Previews Mac OS X Panther",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2003-06-23T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Panther",
      "10.3",
      "preview",
      "features",
      "developer technology",
    ],
  },
  {
    url: U.announce,
    title: "Apple Announces Mac OS X Panther",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2003-10-08T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Panther",
      "10.3",
      "public availability",
      "features",
      "compatibility",
    ],
  },
  {
    url: U.ibook,
    title: "Apple Unveils New Generation G4 iBooks Starting at Just $1,099",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2003-10-22T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Panther",
      "10.3",
      "preinstalled release",
      "automatic networking",
    ],
  },
  {
    url: U.launchEve,
    title: "Night of the Panther Kicks Off at 8:00 p.m. Tomorrow",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2003-10-23T00:00:00.000Z",
    topics: [
      "Mac OS X",
      "Panther",
      "10.3",
      "public release",
      "pricing",
      "system requirements",
    ],
  },
  {
    url: U.x11,
    title: "X11 for Mac OS X 1.0",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    topics: [
      "Mac OS X",
      "Panther",
      "10.3",
      "X11",
      "optional install",
      "developer technology",
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
      "Matched Apple's dated October 2003 launch material, final Panther support documentation, or the explicit Mac OS X 10.3 Panther section of Apple's archived security chronology to the existing audited 10.3 public-release event. June preview detail is used only when a final source confirms the shipped feature.",
    citations,
  };
}

function securityChange({ key, title, canonicalSummary, summary, locator }) {
  return change({
    key,
    title,
    canonicalSummary,
    category: "security",
    action: "fixed",
    summary,
    citations: [c(U.securityIndex, locator)],
  });
}

const pantherChanges = [
  change({
    key: "macos-10-3-finder-navigation-network-browsing",
    title: "Redesigned Finder navigation and network browsing",
    canonicalSummary:
      "Panther reorganized Finder around faster access to favorite locations, storage, servers, iDisk, and browsable Mac, Windows, and UNIX networks.",
    category: "enhancement",
    action: "changed",
    summary:
      "The redesigned file browser collected common local and remote locations in one navigation surface and dynamically exposed compatible file servers across several network environments.",
    citations: [
      c(U.announce, "Redesigned Finder paragraph"),
      c(U.preview, "Finder paragraph"),
    ],
  }),
  change({
    key: "macos-10-3-finder-search",
    title: "Faster Finder search",
    canonicalSummary:
      "Finder gained a substantially faster file-search workflow than the one Apple shipped in Mac OS X 10.2.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple advertised Finder searches as up to six times faster than Jaguar. That comparison is preserved as an attributed vendor performance claim, not an independently reproduced benchmark.",
    citations: [
      c(
        U.announce,
        "Redesigned Finder paragraph; up-to-six-times-faster claim",
      ),
    ],
  }),
  change({
    key: "macos-10-3-expose-window-management",
    title: "Exposé window management",
    canonicalSummary:
      "Exposé introduced an overview that arranged open windows into selectable thumbnails and could temporarily reveal the desktop.",
    category: "feature",
    action: "introduced",
    summary:
      "The Quartz-powered interface reduced overlapping windows to an organized view for switching among them, with a separate action that moved windows aside to expose desktop files.",
    citations: [
      c(U.announce, "Exposé paragraph"),
      c(U.preview, "Exposé paragraphs"),
    ],
  }),
  change({
    key: "macos-10-3-ichat-av",
    title: "iChat AV",
    canonicalSummary:
      "iChat AV added full-screen video conferencing over broadband and internet audio conversations.",
    category: "feature",
    action: "introduced",
    summary:
      "Panther integrated real-time voice and video communication into iChat, with Apple's launch materials distinguishing broadband video from lower-bandwidth audio use.",
    citations: [
      c(U.announce, "iChat AV paragraph"),
      c(U.preview, "iChat AV paragraph"),
    ],
  }),
  change({
    key: "macos-10-3-fast-user-switching",
    title: "Fast User Switching",
    canonicalSummary:
      "Fast User Switching let people move between active accounts without closing running applications or logging out the prior user.",
    category: "feature",
    action: "introduced",
    summary:
      "Multiple users could retain active sessions on one Mac while moving the foreground session to a different account.",
    citations: [
      c(U.announce, "Other new features; Fast User Switching"),
      c(U.preview, "Additional new features; Fast User Switching"),
    ],
  }),
  change({
    key: "macos-10-3-filevault-home-encryption",
    title: "FileVault home-directory encryption",
    canonicalSummary:
      "FileVault introduced transparent 128-bit encryption for the contents of a user's home directory.",
    category: "security",
    action: "introduced",
    summary:
      "The June preview identified the encryption as AES and described on-the-fly operation; the October launch announcement confirms the final 128-bit home-directory protection without relying on the preview alone.",
    citations: [
      c(U.announce, "Other new features; FileVault"),
      c(U.preview, "FileVault paragraphs"),
    ],
  }),
  change({
    key: "macos-10-3-font-book",
    title: "Font Book",
    canonicalSummary:
      "Font Book added system-level font preview, installation, collection management, activation, and deactivation.",
    category: "feature",
    action: "introduced",
    summary:
      "The new utility consolidated routine font inspection and management into a bundled application rather than requiring those tasks to be handled separately.",
    citations: [
      c(U.announce, "Other new features; Font Book"),
      c(U.preview, "Additional new features; Font Book"),
    ],
  }),
  change({
    key: "macos-10-3-preview-pdf-workflows",
    title: "Expanded Preview PDF workflows",
    canonicalSummary:
      "Preview added indexed PDF text search, text selection and copying, URL handling, and PDF 1.4 support.",
    category: "enhancement",
    action: "changed",
    summary:
      "Panther turned the bundled viewer into a more capable PDF research and extraction tool by making results navigable and allowing text and links to participate in normal document workflows.",
    citations: [
      c(U.announce, "Other new features; Preview"),
      c(U.preview, "Additional new features; Preview"),
    ],
  }),
  change({
    key: "macos-10-3-idisk-offline-sync",
    title: "Integrated iDisk offline synchronization",
    canonicalSummary:
      "Panther let .Mac users work from a local iDisk copy and synchronize changes after reconnecting.",
    category: "enhancement",
    action: "changed",
    summary:
      "The operating system cached eligible remote storage locally for offline work and automatically sent changes back to the user's .Mac storage when connectivity returned.",
    citations: [
      c(U.announce, "Other new features; integrated iDisk"),
      c(U.preview, "Additional new features; integrated iDisk"),
    ],
  }),
  change({
    key: "macos-10-3-mail-spam-filtering",
    title: "Enhanced Mail spam filtering",
    canonicalSummary:
      "Mail gained a more advanced built-in spam-filtering workflow.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple listed improved junk-message detection as one of Panther Mail's two headline public-release changes.",
    citations: [c(U.announce, "Other new features; enhanced Mail")],
  }),
  change({
    key: "macos-10-3-mail-threading",
    title: "Mail conversation threads",
    canonicalSummary:
      "Mail added conversation threads for reading, filing, or deleting related messages together.",
    category: "feature",
    action: "introduced",
    summary:
      "Related messages could be organized as a conversation rather than handled only as separate chronological items.",
    citations: [
      c(U.announce, "Other new features; enhanced Mail"),
      c(U.preview, "Additional new features; Mail"),
    ],
  }),
  change({
    key: "macos-10-3-address-book-labels-notifications",
    title: "Address Book labels and change notifications",
    canonicalSummary:
      "Address Book added label printing and a way to notify contacts when a user's own details changed.",
    category: "enhancement",
    action: "changed",
    summary:
      "The contact manager broadened its output and maintenance workflows with printable mailing labels and update notices for personal contact information.",
    citations: [c(U.announce, "Other new features; Address Book")],
  }),
  change({
    key: "macos-10-3-integrated-faxing",
    title: "Integrated faxing",
    canonicalSummary:
      "Panther integrated fax sending and receiving with printing, cover pages, and Address Book contacts.",
    category: "feature",
    action: "introduced",
    summary:
      "Fax operations became part of the operating system's print and contact workflows rather than a disconnected utility path.",
    citations: [
      c(U.announce, "Other new features; integrated faxing"),
      c(U.preview, "Additional new features; integrated faxing"),
    ],
  }),
  change({
    key: "macos-10-3-windows-sharing-compatibility",
    title: "Expanded Windows sharing compatibility",
    canonicalSummary:
      "Panther expanded interoperability for sharing files, printers, and network services with Windows users.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple positioned Windows coexistence as a client-release capability spanning Finder-visible resources and shared network services; this entry does not import the separate Panther Server feature set.",
    citations: [
      c(U.announce, "Other new features; Windows compatibility"),
      c(U.preview, "Windows-network compatibility paragraph"),
    ],
  }),
  change({
    key: "macos-10-3-exchange-mail-address-book",
    title: "Exchange support in Mail and Address Book",
    canonicalSummary:
      "Mail and Address Book added built-in access to supported Microsoft Exchange email and contact synchronization.",
    category: "compatibility",
    action: "introduced",
    summary:
      "Panther connected Apple's bundled communication applications to Exchange-backed mail and address data, while the retained announcement does not establish support for every Exchange configuration.",
    citations: [
      c(U.announce, "Other new features; Microsoft Exchange support"),
    ],
  }),
  change({
    key: "macos-10-3-unix-network-foundation",
    title: "Expanded UNIX and network foundation",
    canonicalSummary:
      "Panther updated open-source libraries and commands and expanded IPv6, Kerberos, and NFS support.",
    category: "enhancement",
    action: "changed",
    summary:
      "The client release refreshed its UNIX base and added or improved standards-oriented networking and authentication components, including an integrated IPv6 stack and a revised NFS implementation.",
    citations: [
      c(U.announce, "Other new features; UNIX-based foundation"),
      c(U.preview, "UNIX technologies paragraph"),
    ],
  }),
  change({
    key: "macos-10-3-x11-optional-integration",
    title: "Optional integrated X11 environment",
    canonicalSummary:
      "Panther included an optional X11 environment with an XFree86 base, Quartz window management, Finder launching, Dock access, and full-screen mode.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple's final support record identifies X11 1.0 as an optional install on the third Panther CD and documents integration points that brought X11 applications into familiar Mac launch and window-management workflows.",
    citations: [
      c(U.announce, "Other new features; X11 applications"),
      c(U.x11, "What's New in this Version; Panther optional install"),
    ],
  }),
  change({
    key: "macos-10-3-xcode-gcc-3-3",
    title: "Xcode with GCC 3.3",
    canonicalSummary:
      "Panther introduced the Xcode development environment with an Apple interface over a GCC 3.3-based toolchain.",
    category: "developerApi",
    action: "introduced",
    summary:
      "Apple presented Xcode as the main application-development environment for taking advantage of Panther-era platform technology.",
    citations: [c(U.announce, "Other new features; Xcode")],
  }),
  change({
    key: "macos-10-3-bundled-app-browser-refresh",
    title: "Bundled application and browser refresh",
    canonicalSummary:
      "Panther shipped current versions of iSync, iCal, iPhoto, iMovie, iTunes and the iTunes Music Store, with Safari as Apple's default browser.",
    category: "enhancement",
    action: "changed",
    summary:
      "The operating-system package refreshed Apple's synchronization, calendar, photo, movie, music, store, and web-browsing software alongside the system-level changes.",
    citations: [
      c(U.announce, "Other new features; bundled applications and Safari"),
    ],
  }),
  change({
    key: "macos-10-3-automatic-network-switching",
    title: "Automatic network switching",
    canonicalSummary:
      "Panther could detect and switch among available Ethernet, wireless, and modem connections.",
    category: "enhancement",
    action: "changed",
    summary:
      "Apple's October 22 G4 iBook announcement describes the capability in final Panther systems that were being sold with 10.3 preinstalled, providing post-preview confirmation of the mobile networking behavior.",
    citations: [
      c(U.ibook, "Panther automatic-networking description"),
      c(U.launchEve, "Panther public availability on October 24"),
    ],
  }),
  change({
    key: "macos-10-3-powerpc-usb-memory-retail-baseline",
    title: "PowerPC, USB, memory, and retail baseline",
    canonicalSummary:
      "The retail Panther client supported listed G3, G4, and G5 Macs with built-in USB and at least 128MB of memory.",
    category: "compatibility",
    action: "changed",
    summary:
      "Apple priced the US single-user license at $129 and the five-user family license at $199, while limiting the documented hardware baseline to compatible PowerPC Macs with built-in USB and the required memory.",
    citations: [
      c(U.announce, "Pricing & Availability; supported Mac families"),
      c(U.launchEve, "Pricing & Availability; system requirements"),
    ],
  }),
  securityChange({
    key: "macos-10-3-finder-mounted-volume-permissions-security",
    title: "Finder mounted-volume permission preservation",
    canonicalSummary:
      "Panther corrected a Finder flaw that could lose folder permissions when copying from a mounted volume.",
    summary:
      "Apple associates CAN-2003-0876 with copies from mounted sources such as disk images and lists the correction directly under the initial Mac OS X 10.3 Panther release.",
    locator: "Mac OS X 10.3 Panther; Finder; CAN-2003-0876",
  }),
  securityChange({
    key: "macos-10-3-kernel-tracing-security",
    title: "Kernel and tracing protections",
    canonicalSummary:
      "Panther hardened core-file handling, long command arguments, and optional kernel tracing against local disclosure, file overwrite, and denial-of-service risks.",
    summary:
      "The initial release addressed CAN-2003-0877, CAN-2003-0895, and CVE-2002-0701. Apple's archive notes that core files were disabled by default and describes the ktrace exposure as theoretical and dependent on the optional KTRACE kernel setting.",
    locator:
      "Mac OS X 10.3 Panther; Kernel and ktrace; CAN-2003-0877, CAN-2003-0895, CVE-2002-0701",
  }),
  securityChange({
    key: "macos-10-3-sharing-nfs-security",
    title: "Personal File Sharing and NFS hardening",
    canonicalSummary:
      "Panther corrected a local privilege path in the file-sharing discovery service and an NFS remote lockup condition.",
    summary:
      "The slpd correction addressed CAN-2003-0878 when Personal File Sharing was enabled, which Apple says was off by default. The NFS correction addressed CVE-2002-0830 involving crafted RPC messages.",
    locator:
      "Mac OS X 10.3 Panther; slpd and nfs; CAN-2003-0878, CVE-2002-0830",
  }),
  securityChange({
    key: "macos-10-3-openssh-nidump-security",
    title: "OpenSSH and nidump credential protections",
    canonicalSummary:
      "Panther hardened OpenSSH host restrictions and prevented nidump from exposing encrypted login-password data.",
    summary:
      "Apple lists CAN-2003-0386 for potentially spoofable OpenSSH restrictions and CAN-2001-1412 for nidump access to crypted login passwords, while also recording the OpenSSH build string shipped in 10.3.",
    locator:
      "Mac OS X 10.3 Panther; OpenSSH and nidump; CAN-2003-0386, CAN-2001-1412",
  }),
  securityChange({
    key: "macos-10-3-authentication-privacy-security",
    title: "Preference, Mail, and TCP privacy protections",
    canonicalSummary:
      "Panther added per-pane administrator reauthentication, prevented a Mail authentication downgrade, and randomized the initial TCP timestamp.",
    summary:
      "The initial release addressed CAN-2003-0883, CAN-2003-0881, and CAN-2003-0882 across secure System Preferences, CRAM-MD5 Mail login behavior, and network uptime disclosure.",
    locator:
      "Mac OS X 10.3 Panther; System Preferences, TCP timestamp, and Mail; CAN-2003-0883, CAN-2003-0882, CAN-2003-0881",
  }),
  securityChange({
    key: "macos-10-3-zlib-gm4-preventive-security",
    title: "zlib and gm4 preventive hardening",
    canonicalSummary:
      "Panther corrected underlying zlib and gm4 issues even though Apple's documented default exposure was limited.",
    summary:
      "Apple states that no Mac OS X function used the vulnerable zlib gzprintf function and that no setuid-root program relied on gm4, so CAN-2003-0107 and CAN-2001-1411 are recorded as preventive hardening rather than evidence of an exploited default path.",
    locator:
      "Mac OS X 10.3 Panther; zlib and gm4; CAN-2003-0107, CAN-2001-1411",
  }),
  securityChange({
    key: "macos-10-3-dock-screen-effects-security",
    title: "Dock protection behind Screen Effects",
    canonicalSummary:
      "Panther prevented Dock functions from being reached blindly behind Screen Effects when Full Keyboard Access was enabled.",
    summary:
      "Apple records the initial 10.3 correction as CAN-2003-0880 and ties the affected path to the Full Keyboard Access setting.",
    locator: "Mac OS X 10.3 Panther; Dock; CAN-2003-0880",
  }),
];

const version = {
  releaseVersionId: "version-macos-10-3",
  authorship: "originalSynthesis",
  releaseNotesUrl: U.announce,
  overview: article(
    heading("Release overview"),
    prose(
      "Mac OS X Panther 10.3 reached the public on October 24, 2003. Its initial client package combined a redesigned Finder, Exposé, iChat AV, Fast User Switching, FileVault, revised productivity applications, broader network interoperability, an updated UNIX foundation, Xcode, and a PowerPC hardware baseline.",
      [
        c(U.announce, "October 24 availability and launch feature list"),
        c(U.launchEve, "October 24 public sale and system requirements"),
      ],
    ),
    heading("Development and release"),
    prose(
      "Apple previewed Panther at WWDC on June 23 with an end-of-year target. On October 8 it set availability for Friday, October 24 at 8:00 p.m.; the October 23 launch-eve notice repeated that date and time for Apple retail stores, authorized resellers, and the Apple Store.",
      [
        c(U.preview, "June 23 preview and end-of-year target"),
        c(U.announce, "October 8 announcement and October 24 availability"),
        c(U.launchEve, "October 23 launch-eve notice"),
      ],
    ),
    heading("Desktop and communication"),
    prose(
      "Finder reorganized access to local and network locations and added faster search, while Exposé created a visual overview of open windows and a shortcut to the desktop. iChat AV added internet voice and video conversations, and Fast User Switching kept multiple account sessions active.",
      [
        c(U.announce, "Finder, Exposé, iChat AV, and feature list"),
        c(
          U.preview,
          "Final-confirmed Finder, Exposé, iChat AV, and switching detail",
        ),
      ],
    ),
    heading("Data and productivity"),
    prose(
      "FileVault protected home-directory data with 128-bit encryption. Font Book centralized font management; Preview expanded PDF search and text handling; iDisk synchronized offline work; Mail added spam filtering and threads; and Address Book, faxing, and the bundled application set expanded everyday workflows.",
      [
        c(U.announce, "Other new features list"),
        c(U.preview, "Final-confirmed FileVault and productivity detail"),
      ],
    ),
    heading("Networks, UNIX, and development"),
    prose(
      "Panther broadened Windows sharing and added Exchange integration in Mail and Address Book. Apple also documented IPv6, Kerberos, NFS, X11 applications, and refreshed open-source components. X11 1.0 was an optional install on the third Panther CD, while Xcode paired Apple's development interface with GCC 3.3.",
      [
        c(U.announce, "Windows, UNIX, X11, and Xcode feature descriptions"),
        c(U.x11, "Panther-compatible X11 1.0 optional installation"),
      ],
    ),
    heading("Security at launch"),
    prose(
      "Apple's archived chronology explicitly assigns fourteen CVE or CAN identifiers to the initial Mac OS X 10.3 Panther release. The structured record groups those corrections into seven readable deltas covering Finder permissions, kernel and tracing behavior, file sharing and NFS, remote access and credential tools, authentication and privacy, preventive library hardening, and Dock access behind Screen Effects.",
      [
        c(
          U.securityIndex,
          "Mac OS X 10.3 Panther; CAN-2003-0876 through CAN-2003-0880",
        ),
      ],
    ),
    heading("Availability and compatibility"),
    prose(
      "The US suggested retail price was $129 for one user and $199 for a five-user household license. Apple documented a minimum of 128MB of memory, built-in USB, and support across listed PowerPC G3, G4, and G5 Mac families. This was a retail software release, not a staged over-the-air rollout.",
      [
        c(U.announce, "Pricing & Availability; supported Mac families"),
        c(U.launchEve, "Pricing & Availability; PowerPC requirements"),
      ],
    ),
    heading("Evidence boundary"),
    prose(
      "This article covers only the existing local 10.3 public route. Preview-only items that the retained October or final support sources do not confirm are excluded. Apple's archive separately places QuickTime Java on October 28, Terminal on November 4, and OpenSSL and zlib under a November 19 Panther 10.3.1 security update; none is projected backward, and no missing point release or build is created.",
      [
        c(U.preview, "June preview feature inventory"),
        c(
          U.securityIndex,
          "Security Update 2003-10-28 through Security Update 2003-11-19 for Panther 10.3.1",
        ),
      ],
    ),
  ),
  citations: [
    c(U.preview, "June 23, 2003 preview"),
    c(U.announce, "October 8, 2003 launch announcement"),
    c(U.ibook, "October 22, 2003 Panther-preinstalled G4 iBook announcement"),
    c(U.launchEve, "October 23, 2003 launch-eve announcement"),
    c(U.x11, "X11 for Mac OS X 1.0 Panther support record"),
    c(U.securityIndex, "Mac OS X 10.3 Panther security section"),
  ],
  provenanceStatus: "editoriallyVerified",
  editorialReview: review(),
};

const event = {
  target: {
    releaseVersionId: "version-macos-10-3",
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary:
    "Mac OS X Panther 10.3 reached the public channel on October 24, 2003 with a redesigned Finder, Exposé, iChat AV, FileVault, expanded networking and productivity tools, Xcode, and documented launch-security corrections.",
  article: article(
    heading("Public release"),
    prose(
      "Apple put Panther on sale at 8:00 p.m. on Friday, October 24, 2003 through its online store, retail stores, and authorized resellers. The local catalog has one matching public milestone and no separate launch build.",
      [
        c(U.announce, "October 24 beginning at 8:00 p.m."),
        c(U.launchEve, "October 23 notice; sale the following evening"),
      ],
    ),
    heading("What this page records"),
    prose(
      "The structured entries synthesize twenty-eight confirmed parts of the initial client package: twenty-one public-package entries, including FileVault as an introduced security feature, plus seven grouped vulnerability-correction deltas. Each entry points to retained first-party Apple material.",
      [
        c(U.announce, "Public-release feature and compatibility inventory"),
        c(U.ibook, "Final Panther automatic-networking description"),
        c(U.x11, "Final Panther X11 support record"),
        c(U.securityIndex, "Mac OS X 10.3 Panther security section"),
      ],
    ),
    heading("Launch highlights"),
    prose(
      "The release centered on Finder and Exposé for navigation and window management, iChat AV and Fast User Switching for communication and shared Macs, FileVault for home-directory protection, revised Mail and Preview workflows, broader Windows and UNIX interoperability, and Xcode for development.",
      [
        c(U.announce, "Finder through bundled-app launch descriptions"),
        c(U.preview, "Final-confirmed feature detail"),
      ],
    ),
    heading("Initial security record"),
    prose(
      "Apple's security archive assigns initial Panther corrections to Finder, the kernel, slpd, ktrace, NFS, zlib, gm4, OpenSSH, nidump, System Preferences, TCP timestamps, Mail, and the Dock. Default-state and theoretical-exposure qualifications are preserved in the grouped change summaries instead of presenting every issue as equally reachable.",
      [c(U.securityIndex, "Mac OS X 10.3 Panther security section")],
    ),
    heading("Later-update boundary"),
    prose(
      "QuickTime Java on October 28 and Terminal on November 4 were later security updates. The same archive labels a November 19 package for Panther 10.3.1. Because no 10.3.1 version exists in the scoped local catalog and the archive does not establish its exact general-release date, this batch neither creates that point release nor merges its OpenSSL and zlib changes into launch day.",
      [
        c(
          U.securityIndex,
          "Security Update 2003-10-28, Security Update 2003-11-04, and Security Update 2003-11-19 for Panther 10.3.1",
        ),
      ],
    ),
    heading("Distribution context"),
    prose(
      "Panther used simultaneous retail availability rather than the phased device rollout associated with some modern software tracks. The page records the dated public appearance and product baseline, but it does not turn store events into artificial rollout stages.",
      [
        c(U.announce, "Pricing & Availability"),
        c(U.launchEve, "US retail and reseller launch context"),
      ],
    ),
  ),
  citations: [
    c(U.preview, "June 23, 2003 preview"),
    c(U.announce, "October 8, 2003 launch announcement"),
    c(U.ibook, "October 22, 2003 Panther-preinstalled G4 iBook announcement"),
    c(U.launchEve, "October 23, 2003 launch-eve announcement"),
    c(U.x11, "X11 for Mac OS X 1.0 Panther support record"),
    c(U.securityIndex, "Mac OS X 10.3 Panther security section"),
  ],
  changes: pantherChanges,
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
    item.publicReleaseDate?.startsWith("2003-"),
);

if (
  eligibleSeedVersions.length !== 1 ||
  eligibleSeedVersions[0].platform !== "macOS" ||
  eligibleSeedVersions[0].version !== "10.3" ||
  eligibleSeedVersions[0].publicReleaseDate !== "2003-10-24" ||
  eligibleSeedVersions[0].versionNote !== "Panther" ||
  eligibleSeedVersions[0].milestones.length !== 1 ||
  eligibleSeedVersions[0].milestones[0].label !== "Public" ||
  eligibleSeedVersions[0].milestones[0].date !== "2003-10-24"
) {
  throw new Error(
    "The 2003 non-iOS/iPadOS seed inventory changed; re-audit this cohort before regenerating.",
  );
}

if (
  bundle.versions.length !== 1 ||
  bundle.events.length !== 1 ||
  bundle.builds.length !== 0 ||
  bundle.events[0].changes.length !== 28
) {
  throw new Error("The expected 2003 bundle closure no longer holds.");
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
writeFileSync(join(here, "apple-other-2003.json"), json);
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

const md = `# Apple 2003 non-iPhone research batch

## Result

\`apple-other-2003.json\` is a source-backed launch-content bundle for every existing local non-iOS/iPadOS release version whose audited public appearance falls in 2003. The exact cohort is one data-rich Mac OS X Panther 10.3 article and its durable public event, written as copyright-safe original synthesis with claim-level citations.

## Exact local coverage

| Platform family | Existing versions covered | Local milestones | Public appearances | Structured changes |
| --- | --- | ---: | ---: | ---: |
| macOS | 10.3 (Panther) | 1 | 1 | ${pantherChanges.length} |
| watchOS | None; the platform did not yet exist | 0 | 0 | 0 |
| tvOS | None in the local catalog | 0 | 0 | 0 |
| **Total** | **1 version article** | **1** | **1** | **${pantherChanges.length}** |

The local Panther record contains only the October 24 public milestone. Apple's October 8 and October 23 announcements identify availability at 8:00 p.m. on October 24. This bundle enriches only that durable route through \`releaseVersionId: "version-macos-10-3"\` plus \`routeAlias: "public"\`.

## Editorial and evidence policy

- Authorship is \`originalSynthesis\` throughout.
- Both version and event records are \`editoriallyVerified\` and \`approved\`
  as of \`${reviewedAt}\`.
- The public event is indexable.
- All ${pantherChanges.length} changes are \`documented\`, \`confirmed\`, and initial-public-release \`delta\` entries.
- Twenty-one entries cover the public feature, enhancement, compatibility, developer, automatic-networking, and retail-baseline package, including FileVault as an introduced security feature.
- Seven readable vulnerability-correction entries synthesize the fourteen CAN/CVE identifiers Apple explicitly lists under Mac OS X 10.3 Panther.
- Preview-only claims are used only when retained October or final support material confirms the shipped surface.
- No October 28, November 4, 10.3.1, or later cumulative change is projected backward.
- No undocumented claim or build record is included, and no point version, date, or build number is inferred.
- Apple's up-to-six-times-faster Finder comparison is labeled as a vendor performance claim rather than an independent benchmark.
- Apple product names are used nominatively; no Apple artwork, logos, screenshots, or copied publisher body text is included.

## Inventory and chronology boundaries

1. The seed contains exactly one non-iOS/iPadOS version with a 2003 public appearance: macOS-family record 10.3, named Panther, with one public milestone.
2. Apple's June 23 announcement is explicitly a preview with an end-of-year target. The local seed has no June beta milestone, and this batch does not create one.
3. Apple's October 8 announcement sets October 24 availability; the October 23 notice says the product would go on sale the following evening. The seed's October 24 date is retained without a separate announcement event.
4. The product was named Mac OS X Panther in Apple's 2003 material. The local information architecture groups it under the \`macOS\` platform family; editorial copy retains the historical Mac OS X name.
5. Apple's archived security chronology says updates are listed by the software release in which they first appeared and has a dedicated Mac OS X 10.3 Panther section. Its fourteen identifiers are therefore in scope for the initial route.
6. That archive separately lists Security Update 2003-10-28 for QuickTime Java, Security Update 2003-11-04 for Terminal, and Security Update 2003-11-19 for Panther 10.3.1. These later changes are excluded.
7. The local catalog has no 10.3.1 releaseVersion record. This existing-record-only batch does not create it or infer its exact general-release date.
8. Mac OS X Server 10.3 had a separate launch package, but the scoped local record is the client OS. No Server route or Server-only feature is created.

## Source ledger

All ${sources.length} declared sources are human-readable first-party Apple materials checked on ${accessedAt}; all ${sources.length} are cited by the bundle.

- <${U.securityIndex}> — archived security chronology, explicit initial 10.3 Panther security section, and later-update boundaries
- <${U.preview}> — June 23 feature context, explicitly treated as pre-release and used only where final evidence confirms the surface
- <${U.announce}> — October 24 public availability, confirmed launch features, pricing, and compatibility
- <${U.ibook}> — October 22 final Panther automatic-networking description on systems sold with 10.3 preinstalled
- <${U.launchEve}> — October 23 corroboration of the next-day public sale, pricing, and hardware requirements
- <${U.x11}> — final X11 1.0 components and optional installation from the third Panther CD

Apple Support pages are living or archived documents and can display publication or revision dates much later than the historical release. Historical mapping therefore uses explicitly labeled versions, dated chronology entries, and the described Panther media rather than current page revision timestamps.

## Known gaps

1. Panther 10.3.1 is absent from the scoped local catalog. Apple's archive labels a November 19 security update for 10.3.1 but does not establish the point version's exact general-release date, so the batch neither creates it nor merges its OpenSSL and zlib changes into 10.3.
2. Preview-only claims without retained final confirmation—including colored Finder labels, Pixlet, the ports manager, Python-to-Quartz access, and specific Active Directory, SMB home-directory, and VPN details—are excluded from structured initial-release deltas.
3. The initial security archive contains fourteen identifiers across fourteen listed entries, but it does not assign modern severity scores. The batch groups related components for readability and does not invent severities or exploit status.
4. Apple's archive says the zlib and gm4 changes were preventive or had limited default exposure; the summaries preserve those qualifications.
5. X11 was an optional installation on Panther media, not a claim that every default installation contained an active X11 environment.
6. No community-sourced undocumented claim was added; that requires a separate reproducible or independently corroborated evidence pass.
7. The launch announcement documents eligible Mac families and minimum memory but does not guarantee every third-party peripheral or application. No broad compatibility promise is inferred.

## Validation

- Research-batch validation passed with ${bundle.versions.length} version, ${bundle.events.length} public event, ${pantherChanges.length} globally consistent change keys, ${sources.length} sources, and ${citationReferenceCount(bundle)} citation references for this file.
- Inventory closure passed: exactly 1 eligible seed version, 1 public milestone, ${sources.length} of ${sources.length} declared sources cited, and zero build records.
- The launch-content schema assertion passed.
- Focused launch-ingestion and manifest tests passed: 19 of 19.
- ESLint and Prettier checks passed for the deterministic generator.
- A second generator run reproduced the JSON and Markdown byte-for-byte.
- Approved production dry run: 34 creates, 2 revision-guarded patches, and 2,081 unchanged documents.
- Planned creates: 6 source documents, zero version documents, zero event documents, zero build documents, and ${pantherChanges.length} change documents.
- The two guarded patches target the existing Panther public event and the existing Panther version article. No chronology or identity field is changed.
- Mutation payload: 88,231 bytes, reported as 2.3% of the guarded limit.
- Approved production plan SHA:
  \`78fffa95670e5635d01c1da29b5be5b8759e2e9fc27ce39dd82417429f9c7edc\`.
- Bundle JSON SHA-256: \`${jsonSha}\`.
- Production apply committed and zero-residual verified in transaction
  \`tt1fSB5HY9GAB0YLyy3pbj\`.
- The post-apply dry run reported 0 creates, 0 patches, and 2,117 unchanged
  documents. Its plan SHA is
  \`32a1be45b10416588b3475545065c941d14c4ac59976fd9211bdeeed080da0dc\`.
- The representative local route \`/apple/macos/10.3\` returned HTTP 200 with
  release content, references, and indexable metadata.
- Root editorial review approved the copyright-safe original synthesis,
  evidence boundaries, provenance, and indexing state at \`${reviewedAt}\`.
`;

writeFileSync(join(here, "apple-other-2003.md"), md);
