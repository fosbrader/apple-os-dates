import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

const out = path.resolve("scripts/research-batches/apple-ios-2.json");

const U = {
  securityIndex: "https://support.apple.com/en-us/104189",
  security20: "https://support.apple.com/en-us/104025",
  security21: "https://support.apple.com/en-us/104112",
  security22: "https://support.apple.com/en-us/104121",
  preview20:
    "https://www.apple.com/newsroom/2008/03/06Apple-Announces-iPhone-2-0-Software-Beta/",
  iphone3g:
    "https://www.apple.com/newsroom/2008/06/09Apple-Introduces-the-New-iPhone-3G/",
  ipod21:
    "https://www.apple.com/newsroom/2008/09/09Apple-Introduces-New-iPod-touch/",
  macrumors201:
    "https://www.macrumors.com/2008/08/04/apple-releases-iphone-firmware-2-0-1/",
  macrumors202:
    "https://www.macrumors.com/2008/08/18/iphone-firmware-2-0-2-released/",
  macrumors21:
    "https://www.macrumors.com/2008/09/12/iphone-2-1-firmware-now-available/",
  macrumors22:
    "https://www.macrumors.com/2008/11/21/apple-releases-iphone-2-2-firmware/",
  macrumors221:
    "https://www.macrumors.com/2009/01/27/apple-releases-iphone-2-2-1-firmware/",
};

const sources = [
  {
    url: U.securityIndex,
    title: "Apple security updates (15-Jan-2008 to 03-Dec-2009)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2008", "2009", "security release index"],
  },
  {
    url: U.security20,
    title: "About the security content of iPhone v2.0 and iPod touch v2.0",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPhone OS", "2.0", "security"],
  },
  {
    url: U.security21,
    title: "About the security content of iPhone v2.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPhone OS", "2.1", "security"],
  },
  {
    url: U.security22,
    title: "About the security content of iOS 2.2 and iOS for iPod touch 2.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPhone OS", "iOS", "2.2", "security"],
  },
  {
    url: U.preview20,
    title: "Apple Announces iPhone 2.0 Software Beta",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2008-03-06T00:00:00Z",
    topics: ["iPhone OS", "2.0", "App Store", "enterprise", "SDK"],
  },
  {
    url: U.iphone3g,
    title: "Apple Introduces the New iPhone 3G",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2008-06-09T00:00:00Z",
    topics: ["iPhone OS", "2.0", "features", "availability"],
  },
  {
    url: U.ipod21,
    title: "Apple Introduces New iPod touch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2008-09-09T00:00:00Z",
    topics: ["iPhone OS", "2.1", "Genius", "iPod touch"],
  },
  {
    url: U.macrumors201,
    title: "Apple Releases iPhone Firmware 2.0.1",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-08-04T23:48:00Z",
    topics: ["iPhone OS", "2.0.1", "release notice"],
  },
  {
    url: U.macrumors202,
    title: "iPhone Firmware 2.0.2 Released",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-08-18T21:34:00Z",
    topics: ["iPhone OS", "2.0.2", "release notice"],
  },
  {
    url: U.macrumors21,
    title: "iPhone 2.1 Firmware Now Available",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-09-12T13:11:00Z",
    topics: ["iPhone OS", "2.1", "release notice", "features", "fixes"],
  },
  {
    url: U.macrumors22,
    title:
      "Apple Releases iPhone 2.2 Firmware with Street View, Emoji and More",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-11-21T06:44:00Z",
    topics: ["iPhone OS", "2.2", "release notice", "features", "fixes"],
  },
  {
    url: U.macrumors221,
    title: "Apple Releases iPhone and iPod Touch 2.2.1 Firmware",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2009-01-27T18:38:00Z",
    topics: ["iPhone OS", "2.2.1", "release notice", "fixes"],
  },
];

const sourceClassByUrl = new Map(
  sources.map((source) => [source.url, source.sourceClass]),
);

const cite = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});

const block = (text, citations) => ({ text, citations });

const change = ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  citations,
  documentedStatus = "documented",
  evidenceState,
}) => {
  const resolvedEvidenceState =
    evidenceState ??
    (citations.every(
      (citation) => sourceClassByUrl.get(citation.url) === "journalism",
    )
      ? "reported"
      : "confirmed");

  return {
    key,
    title,
    canonicalSummary,
    category,
    action,
    inheritance: "delta",
    summary,
    documentedStatus,
    evidenceState: resolvedEvidenceState,
    verificationMethod:
      resolvedEvidenceState === "reported"
        ? "Matched a contemporaneous publisher's dated preservation of the displayed update notice to the existing audited public-release record; no stronger first-party consumer page survives in the reviewed source set."
        : "Matched a version-labeled Apple announcement, release index, or security advisory to the existing audited public-release record.",
    citations,
  };
};

const reviewedAt = "2026-07-30T05:31:12Z";
const review = { status: "approved", reviewedAt };

const releases = [
  {
    version: "2.0",
    releaseNotesUrl: U.iphone3g,
    summary:
      "The first public iPhone 2.0 release established native third-party applications and the App Store, added enterprise synchronization and management, expanded core apps, and repaired foundational browser and networking vulnerabilities.",
    blocks: [
      block(
        "Apple positioned iPhone 2.0 as both an application platform and an enterprise release. The software added the on-device App Store and native applications built with the iPhone SDK, Exchange ActiveSync push mail, contacts and calendars, remote wipe, Cisco IPsec VPN, WPA2 Enterprise, and managed configuration support.",
        [
          cite(
            U.preview20,
            "SDK, App Store, Exchange, and enterprise sections",
          ),
          cite(
            U.iphone3g,
            "iPhone 2.0 software, App Store, and enterprise features",
          ),
        ],
      ),
      block(
        "The consumer release also expanded Mail document handling and bulk actions, contact search, parental controls, image saving, the scientific calculator, MobileMe synchronization, and GPS-aware mapping on compatible hardware. Apple’s security bulletin separately documents protections for secure-proxy errors, malformed network packets, deceptive browser presentation, certificate handling, and several web-content memory failures. Apple dates public availability to July 11, 2008.",
        [
          cite(U.iphone3g, "Additional iPhone 2.0 features and availability"),
          cite(U.security20, "iPhone v2.0 security content"),
          cite(U.securityIndex, "iPhone 2.0 and iPod touch 2.0 — 11 July 2008"),
        ],
      ),
    ],
    citations: [
      cite(U.preview20, "iPhone 2.0 software overview"),
      cite(U.iphone3g, "iPhone 2.0 features and July 11 availability"),
      cite(U.security20, "iPhone v2.0 security content"),
      cite(U.securityIndex, "iPhone 2.0 and iPod touch 2.0 — 11 July 2008"),
    ],
    changes: [
      change({
        key: "ios-2-0-app-store-native-apps",
        title: "App Store and native third-party applications",
        canonicalSummary:
          "iPhone 2.0 added the App Store for discovering, purchasing, downloading, and updating native third-party applications.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple described wireless access over cellular and Wi-Fi, free and paid software, update notifications, and a launch footprint spanning 62 countries.",
        citations: [
          cite(U.preview20, "App Store distribution model"),
          cite(U.iphone3g, "App Store section"),
        ],
      }),
      change({
        key: "ios-2-0-native-sdk-platform",
        title: "Native iPhone SDK platform",
        canonicalSummary:
          "The release established Apple’s supported SDK and APIs for native iPhone and iPod touch applications.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Developers could build software using the device’s Multi-Touch interface, animation, accelerometer, and location capabilities and distribute it through the App Store.",
        citations: [
          cite(U.preview20, "iPhone SDK and Developer Program"),
          cite(U.iphone3g, "iPhone SDK application capabilities"),
        ],
      }),
      change({
        key: "ios-2-0-exchange-push-sync",
        title: "Exchange ActiveSync",
        canonicalSummary:
          "iPhone 2.0 added Exchange ActiveSync for push email and over-the-air contact and calendar synchronization.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple documented Exchange 2003 and 2007 support, global address lists, auto-discovery, password policies, and remote wipe.",
        citations: [
          cite(U.preview20, "Exchange ActiveSync and remote-wipe features"),
          cite(U.iphone3g, "Enterprise features"),
        ],
      }),
      change({
        key: "ios-2-0-enterprise-network-management",
        title: "Enterprise networking and configuration",
        canonicalSummary:
          "The release added Cisco IPsec VPN, WPA2 Enterprise with 802.1X, certificate authentication, and managed configuration delivery.",
        category: "enhancement",
        action: "introduced",
        summary:
          "Administrators could prepare password, VPN, certificate, and mail settings and deliver a configuration for authenticated installation.",
        citations: [
          cite(
            U.preview20,
            "Cisco IPsec VPN, WPA2 Enterprise, and configuration utility",
          ),
        ],
      }),
      change({
        key: "ios-2-0-mail-document-bulk-actions",
        title: "Mail documents and bulk actions",
        canonicalSummary:
          "Mail gained PowerPoint attachment viewing and the ability to move or delete multiple messages together.",
        category: "enhancement",
        action: "introduced",
        summary:
          "PowerPoint joined the existing Word and Excel attachment support, while bulk message actions reduced repetitive inbox work.",
        citations: [
          cite(U.preview20, "Mail attachment and bulk-message features"),
          cite(U.iphone3g, "Additional iPhone 2.0 features"),
        ],
      }),
      change({
        key: "ios-2-0-gps-aware-mapping",
        title: "GPS-aware real-time mapping",
        canonicalSummary:
          "iPhone 2.0 supported real-time mapping and progress tracking with GPS on compatible iPhone hardware.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The software capability was tied to the iPhone 3G’s built-in GPS; the source does not imply that earlier hardware acquired a GPS receiver.",
        citations: [
          cite(U.iphone3g, "GPS mapping and iPhone 3G hardware context"),
        ],
      }),
      change({
        key: "ios-2-0-contacts-calculator",
        title: "Contact search and scientific calculator",
        canonicalSummary:
          "The release added contact search and a scientific mode to Calculator.",
        category: "enhancement",
        action: "introduced",
        summary:
          "Apple listed both additions among the core iPhone 2.0 application improvements.",
        citations: [cite(U.iphone3g, "Additional iPhone 2.0 features")],
      }),
      change({
        key: "ios-2-0-parental-controls",
        title: "Parental control restrictions",
        canonicalSummary:
          "iPhone 2.0 added settings for restricting specified content.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple described the controls as a way to enable parental restrictions for selected content.",
        citations: [cite(U.iphone3g, "Additional iPhone 2.0 features")],
      }),
      change({
        key: "ios-2-0-save-web-mail-images",
        title: "Save images from the web and Mail",
        canonicalSummary:
          "Users could save images from webpages or email into the device photo library.",
        category: "feature",
        action: "introduced",
        summary:
          "Saved images could subsequently transfer back to a Mac or PC with the rest of the photo library.",
        citations: [cite(U.iphone3g, "Additional iPhone 2.0 features")],
      }),
      change({
        key: "ios-2-0-mobileme-push",
        title: "MobileMe push synchronization",
        canonicalSummary:
          "iPhone 2.0 supported MobileMe push delivery and synchronization for email, contacts, and calendars.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple described changes staying synchronized across iPhone, iPod touch, Mac, and PC, with direct photo posting to a MobileMe Gallery.",
        citations: [cite(U.iphone3g, "MobileMe section")],
      }),
      change({
        key: "ios-2-0-cfnetwork-proxy-errors",
        title: "Secure-proxy error handling",
        canonicalSummary:
          "CFNetwork stopped returning attacker-supplied content from an HTTPS proxy when handling a gateway error.",
        category: "security",
        action: "fixed",
        summary:
          "The correction prevented a malicious proxy from using a 502 error response to imitate a secure website.",
        citations: [cite(U.security20, "CFNetwork — CVE-2008-0050")],
      }),
      change({
        key: "ios-2-0-ipcomp-packet-reset",
        title: "IPComp packet failure handling",
        canonicalSummary:
          "The kernel began detecting a malformed IPComp packet condition that could unexpectedly reset a device.",
        category: "security",
        action: "fixed",
        summary:
          "Apple scoped the issue to crafted packets sent to systems configured for IPsec or IPv6.",
        citations: [cite(U.security20, "Kernel — CVE-2008-0177")],
      }),
      change({
        key: "ios-2-0-safari-origin-certificates",
        title: "Safari identity and certificate handling",
        canonicalSummary:
          "Safari hardened address-bar presentation and invalid-certificate prompts against deceptive sites.",
        category: "security",
        action: "fixed",
        summary:
          "The browser stopped rendering ideographic spaces in the address bar and no longer silently accepted a previously interrupted invalid-certificate prompt.",
        citations: [
          cite(U.security20, "Safari — CVE-2008-1588 and CVE-2008-1589"),
        ],
      }),
      change({
        key: "ios-2-0-safari-script-memory",
        title: "Safari and WebKit script memory safety",
        canonicalSummary:
          "The release corrected multiple JavaScript and style-processing memory errors that could terminate the browser or execute code.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented added array-index and regular-expression validation, bounds checks, and improved garbage collection and style-element handling.",
        citations: [
          cite(
            U.security20,
            "Safari and WebKit memory entries — CVE-2008-2303, CVE-2008-2307, CVE-2008-2317, CVE-2008-1590, and CVE-2008-1026",
          ),
        ],
      }),
      change({
        key: "ios-2-0-web-xml-origin",
        title: "Web content parsing and origin protections",
        canonicalSummary:
          "Safari and WebKit improved cross-site and XML-processing safeguards for crafted web content.",
        category: "security",
        action: "fixed",
        summary:
          "The bulletin covers byte-order-mark filtering, colon-containing host names, invalid UTF-8 XML memory consumption, and an XSLT memory-corruption defect.",
        citations: [
          cite(
            U.security20,
            "Safari and WebKit origin/XML entries — CVE-2006-2783, CVE-2007-6284, CVE-2008-1767, and CVE-2008-1025",
          ),
        ],
      }),
    ],
  },
  {
    version: "2.0.1",
    summary:
      "iPhone 2.0.1 was a maintenance release whose surviving contemporaneous update notice identifies bug fixes without itemizing the affected components.",
    blocks: [
      block(
        "Contemporaneous reporting records that Apple released iPhone software 2.0.1 through iTunes on August 4, 2008. The update description itself was limited to a generic bug-fix statement.",
        [
          cite(
            U.macrumors201,
            "August 4 release and Apple’s terse update description",
          ),
        ],
      ),
      block(
        "The same report separately labels faster backups and typing as early user claims rather than Apple’s published notes. This page therefore preserves only the documented maintenance scope and does not convert those observations into release changes.",
        [
          cite(
            U.macrumors201,
            "Distinction between Apple’s description and early claims",
          ),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors201, "August 4 release and update description"),
    ],
    changes: [
      change({
        key: "ios-2-0-1-general-bug-fixes",
        title: "General bug-fix maintenance",
        canonicalSummary:
          "Apple described iPhone 2.0.1 as containing bug fixes without publishing a component-level list.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The structured record remains deliberately generic because the preserved update notice does not assign narrower fixes to this release.",
        citations: [
          cite(U.macrumors201, "Apple’s reported update description"),
        ],
      }),
    ],
  },
  {
    version: "2.0.2",
    summary:
      "iPhone 2.0.2 was another terse maintenance update: the preserved Apple description says only that it contained bug fixes and does not confirm a specific 3G connectivity correction.",
    blocks: [
      block(
        "MacRumors reported the iPhone 2.0.2 release on August 18, 2008 and preserved Apple’s update description as a generic bug-fix notice. An iPod touch 2.0.2 package was also reported.",
        [
          cite(
            U.macrumors202,
            "August 18 release and Apple’s terse update description",
          ),
        ],
      ),
      block(
        "At launch, reporting explicitly said it was not yet known whether the package fixed the widely discussed 3G connectivity problem, and early reports had no consensus. This article does not turn that rumor into a documented release claim.",
        [
          cite(
            U.macrumors202,
            "3G connectivity uncertainty and early-report boundary",
          ),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors202, "August 18 release and update description"),
    ],
    changes: [
      change({
        key: "ios-2-0-2-general-bug-fixes",
        title: "General bug-fix maintenance",
        canonicalSummary:
          "Apple described iPhone 2.0.2 as containing bug fixes without publishing a component-level list.",
        category: "bugFix",
        action: "fixed",
        summary:
          "No specific cellular or application correction is assigned because the contemporaneous source says the 3G effect was unconfirmed.",
        citations: [
          cite(
            U.macrumors202,
            "Apple’s reported update description and 3G uncertainty",
          ),
        ],
      }),
    ],
  },
  {
    version: "2.1",
    releaseNotesUrl: U.security21,
    summary:
      "iPhone 2.1 combined call, battery, backup, mail, application, messaging, contact, signal, passcode, and Genius improvements with six documented security repairs.",
    blocks: [
      block(
        "The September 12 release focused on reliability after the 2.0 launch. Apple’s preserved changelog covered fewer call setup failures and drops, longer battery life for most users, much faster iTunes backups, more reliable POP and Exchange mail fetching, faster third-party app installation, and fewer hangs when many applications were installed.",
        [
          cite(
            U.macrumors21,
            "Apple-listed call, battery, backup, mail, and app changes",
          ),
          cite(U.securityIndex, "iPhone 2.1 — 12 September 2008"),
        ],
      ),
      block(
        "The update also improved texting and contact performance, refined the 3G signal display, added repeated message alerts, offered data erasure after ten failed passcode attempts, and introduced Genius playlist creation. Apple’s security bulletin separately records repaired application-sandbox isolation, font parsing, DNS and TCP protections, passcode enforcement, and WebKit document lifetime handling.",
        [
          cite(
            U.macrumors21,
            "Apple-listed messaging, contacts, signal, passcode, and Genius changes",
          ),
          cite(U.ipod21, "Genius playlists and 2.1 software"),
          cite(U.security21, "iPhone v2.1 security content"),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors21, "Apple-listed iPhone 2.1 changelog"),
      cite(U.ipod21, "Genius and 2.1 software"),
      cite(U.security21, "iPhone v2.1 security content"),
      cite(U.securityIndex, "iPhone 2.1 — 12 September 2008"),
    ],
    changes: [
      change({
        key: "ios-2-1-call-reliability",
        title: "Call setup and retention",
        canonicalSummary:
          "The update reduced call setup failures and dropped calls.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple’s consumer changelog identifies both connection setup and in-call reliability as improvement areas.",
        citations: [cite(U.macrumors21, "Call setup and call-drop item")],
      }),
      change({
        key: "ios-2-1-battery-life",
        title: "Battery life",
        canonicalSummary:
          "The update significantly improved battery life for most users.",
        category: "enhancement",
        action: "changed",
        summary:
          "The claim retains Apple’s qualification that the improvement applied to most users rather than promising a universal result.",
        citations: [cite(U.macrumors21, "Battery-life item")],
      }),
      change({
        key: "ios-2-1-itunes-backups",
        title: "Faster iTunes backups",
        canonicalSummary:
          "The update substantially reduced the time required to back up an iPhone to iTunes.",
        category: "enhancement",
        action: "changed",
        summary:
          "This is limited to backup duration; the source does not claim changes to backup contents or restore behavior.",
        citations: [cite(U.macrumors21, "iTunes backup-time item")],
      }),
      change({
        key: "ios-2-1-mail-fetch-reliability",
        title: "Mail fetching reliability",
        canonicalSummary:
          "The update improved email reliability, especially when fetching from POP and Exchange accounts.",
        category: "bugFix",
        action: "fixed",
        summary:
          "Apple singled out POP and Exchange retrieval while describing a broader reliability improvement.",
        citations: [cite(U.macrumors21, "Email reliability item")],
      }),
      change({
        key: "ios-2-1-third-party-app-stability",
        title: "Third-party app installation and stability",
        canonicalSummary:
          "Third-party applications installed faster, and systems with many installed apps were less prone to hangs and crashes.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The entry combines two adjacent application-management items from the preserved Apple changelog.",
        citations: [
          cite(U.macrumors21, "Third-party installation and stability items"),
        ],
      }),
      change({
        key: "ios-2-1-messaging-performance-alerts",
        title: "Messaging performance and repeat alerts",
        canonicalSummary:
          "Text messaging became more responsive and could repeat an unacknowledged incoming-message alert up to two additional times.",
        category: "enhancement",
        action: "changed",
        summary:
          "The update joined a performance correction with an optional reminder behavior for incoming text messages.",
        citations: [
          cite(U.macrumors21, "Text performance and repeat-alert items"),
        ],
      }),
      change({
        key: "ios-2-1-contact-performance",
        title: "Contact loading and search performance",
        canonicalSummary:
          "The Contacts experience loaded and searched entries faster.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple’s changelog covers both initial contact loading and subsequent search responsiveness.",
        citations: [cite(U.macrumors21, "Contacts performance item")],
      }),
      change({
        key: "ios-2-1-3g-signal-display",
        title: "3G signal display accuracy",
        canonicalSummary:
          "The update improved the accuracy of the displayed 3G signal strength.",
        category: "bugFix",
        action: "fixed",
        summary:
          "This entry concerns the on-screen indicator and does not infer a change in radio coverage or network capacity.",
        citations: [cite(U.macrumors21, "3G signal display item")],
      }),
      change({
        key: "ios-2-1-failed-passcode-erasure",
        title: "Erase after failed passcode attempts",
        canonicalSummary:
          "Users could configure the device to erase its data after ten unsuccessful passcode entries.",
        category: "security",
        action: "introduced",
        summary:
          "The consumer changelog documents the option as a new local data-protection control.",
        citations: [cite(U.macrumors21, "Ten-attempt data-erasure item")],
      }),
      change({
        key: "ios-2-1-genius-playlists",
        title: "On-device Genius playlists",
        canonicalSummary:
          "The release added creation, preview, refresh, and saving of Genius playlists on the device.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple’s iPod touch announcement corroborates that the 2.1 software added the Genius feature for building related-song playlists while mobile.",
        citations: [
          cite(U.macrumors21, "Genius playlist item"),
          cite(U.ipod21, "Genius feature and 2.1 update"),
        ],
      }),
      change({
        key: "ios-2-1-app-sandbox-isolation",
        title: "Third-party application sandbox isolation",
        canonicalSummary:
          "The application sandbox began properly enforcing file-access separation between third-party apps.",
        category: "security",
        action: "fixed",
        summary:
          "The earlier behavior could let one third-party application read files from another app’s sandbox and expose sensitive data.",
        citations: [cite(U.security21, "Application Sandbox — CVE-2008-3631")],
      }),
      change({
        key: "ios-2-1-freetype-font-safety",
        title: "FreeType font parsing",
        canonicalSummary:
          "The release incorporated FreeType security fixes for several crafted-font vulnerabilities.",
        category: "security",
        action: "fixed",
        summary:
          "Apple identified arbitrary code execution as the most serious possible result and updated from FreeType 2.3.5 with the 2.3.6 fixes.",
        citations: [cite(U.security21, "CoreGraphics — FreeType CVEs")],
      }),
      change({
        key: "ios-2-1-dns-cache-poisoning",
        title: "DNS cache-poisoning resilience",
        canonicalSummary:
          "mDNSResponder randomized source ports and transaction identifiers to resist forged DNS responses.",
        category: "security",
        action: "fixed",
        summary:
          "The change reduced the ability of a remote attacker to poison cached name-resolution information.",
        citations: [cite(U.security21, "mDNSResponder — CVE-2008-1447")],
      }),
      change({
        key: "ios-2-1-tcp-sequence-randomization",
        title: "TCP sequence randomization",
        canonicalSummary:
          "TCP initial sequence numbers changed from sequential generation to randomized values.",
        category: "security",
        action: "fixed",
        summary:
          "Predictable sequence values could otherwise assist spoofed connections or insertion of data into an existing connection.",
        citations: [cite(U.security21, "Networking — CVE-2008-3612")],
      }),
      change({
        key: "ios-2-1-emergency-call-passcode-bypass",
        title: "Emergency-call passcode enforcement",
        canonicalSummary:
          "The passcode screen no longer allowed application launch through a Home-button action during an emergency call.",
        category: "security",
        action: "fixed",
        summary:
          "Apple scoped the bypass to a person with physical access and noted that it did not affect versions before 2.0.",
        citations: [cite(U.security21, "Passcode Lock — CVE-2008-3633")],
      }),
      change({
        key: "ios-2-1-webkit-css-lifetime",
        title: "WebKit CSS document lifetime",
        canonicalSummary:
          "WebKit corrected a use-after-free condition involving CSS import statements.",
        category: "security",
        action: "fixed",
        summary:
          "A crafted site could previously terminate the application or execute code; Apple improved document-reference handling.",
        citations: [cite(U.security21, "WebKit — CVE-2008-3632")],
      }),
    ],
  },
  {
    version: "2.2",
    releaseNotesUrl: U.security22,
    summary:
      "iPhone 2.2 expanded Maps, added direct podcast downloads, refined Mail, Safari, calls, voicemail, Home-screen navigation, and keyboard settings, and delivered a broad security repair set.",
    blocks: [
      block(
        "The consumer changelog added Google Street View plus public-transit and walking directions, dropped-pin addresses, and location sharing in Maps. It also enabled podcast downloads through the iTunes application over Wi-Fi or cellular, repaired scheduled Mail fetching and wide HTML formatting, improved Safari stability, and continued work on call reliability and visual-voicemail audio.",
        [
          cite(
            U.macrumors22,
            "Maps, Mail, Safari, podcast, calling, and voicemail items",
          ),
        ],
      ),
      block(
        "Navigation and typing gained smaller controls: pressing Home from any Home screen returned to the first page, and Keyboard settings could disable automatic correction. Apple’s security bulletin records additional fixes across graphics and TIFF parsing, PPTP encryption, Office documents, passcode enforcement, locked-screen message privacy, Safari, and WebKit. The local November 21 date differs by one day from Apple’s archived security index, which lists November 20.",
        [
          cite(U.macrumors22, "Home button and keyboard setting items"),
          cite(U.security22, "iOS 2.2 security content"),
          cite(U.securityIndex, "iOS 2.2 — 20 November 2008"),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors22, "Preserved iPhone 2.2 consumer changelog"),
      cite(U.security22, "iOS 2.2 security content"),
      cite(U.securityIndex, "iOS 2.2 — 20 November 2008"),
    ],
    changes: [
      change({
        key: "ios-2-2-maps-expansion",
        title: "Street View, routing, and map sharing",
        canonicalSummary:
          "Maps added Google Street View, public-transit and walking directions, dropped-pin addresses, and location sharing by email.",
        category: "feature",
        action: "introduced",
        summary:
          "The preserved changelog groups these capabilities under Maps; contemporaneous reporting noted that Street View was not present on iPod touch.",
        citations: [cite(U.macrumors22, "Maps enhancements and device note")],
      }),
      change({
        key: "ios-2-2-mail-fetch-html",
        title: "Mail fetching and wide HTML formatting",
        canonicalSummary:
          "Mail corrected isolated scheduled-fetch problems and improved the presentation of wide HTML messages.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The two Mail items address background retrieval reliability and layout of messages wider than the display.",
        citations: [cite(U.macrumors22, "Mail enhancements")],
      }),
      change({
        key: "ios-2-2-safari-stability-performance",
        title: "Safari stability and performance",
        canonicalSummary:
          "The update improved Safari’s overall stability and performance.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple’s consumer description is general, so this occurrence does not assign the improvement to a specific browser subsystem.",
        citations: [cite(U.macrumors22, "Safari improvement item")],
      }),
      change({
        key: "ios-2-2-podcast-downloads",
        title: "Direct podcast downloads",
        canonicalSummary:
          "Audio and video podcasts became downloadable from the iTunes application over Wi-Fi or cellular connections.",
        category: "feature",
        action: "introduced",
        summary:
          "The feature removed the requirement to download every episode on a computer before synchronizing it to the device.",
        citations: [cite(U.macrumors22, "Podcast-download item")],
      }),
      change({
        key: "ios-2-2-call-reliability",
        title: "Further call reliability",
        canonicalSummary:
          "The update further reduced call setup failures and dropped calls.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The changelog repeats the reliability area addressed in 2.1 and assigns another improvement to 2.2.",
        citations: [cite(U.macrumors22, "Call reliability item")],
      }),
      change({
        key: "ios-2-2-visual-voicemail-audio",
        title: "Visual Voicemail audio quality",
        canonicalSummary:
          "The update improved the sound quality of Visual Voicemail messages.",
        category: "enhancement",
        action: "changed",
        summary:
          "The surviving notice does not identify a codec, network, or device qualification.",
        citations: [cite(U.macrumors22, "Visual Voicemail item")],
      }),
      change({
        key: "ios-2-2-home-screen-first-page",
        title: "Return to the first Home screen",
        canonicalSummary:
          "Pressing the Home button while viewing a Home-screen page returned to the first page.",
        category: "enhancement",
        action: "introduced",
        summary:
          "This provided a direct navigation shortcut from any secondary Home-screen page.",
        citations: [cite(U.macrumors22, "Home-button navigation item")],
      }),
      change({
        key: "ios-2-2-autocorrection-toggle",
        title: "Automatic-correction preference",
        canonicalSummary:
          "Keyboard settings gained a preference for enabling or disabling automatic correction.",
        category: "feature",
        action: "introduced",
        summary:
          "The new preference exposed control over a typing behavior that had previously operated without this user-facing switch.",
        citations: [cite(U.macrumors22, "Keyboard auto-correction item")],
      }),
      change({
        key: "ios-2-2-coregraphics-arguments",
        title: "CoreGraphics argument validation",
        canonicalSummary:
          "CoreGraphics added bounds checks for memory-corruption conditions reached through untrusted arguments.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented possible application termination or code execution when a browser or other app passed crafted input.",
        citations: [cite(U.security22, "CoreGraphics — CVE-2008-2321")],
      }),
      change({
        key: "ios-2-2-tiff-processing",
        title: "TIFF image processing",
        canonicalSummary:
          "ImageIO initialized memory, validated TIFF data, and limited allocations while opening crafted images.",
        category: "security",
        action: "fixed",
        summary:
          "The changes addressed both possible code execution from LZW-encoded images and device resets caused by memory exhaustion.",
        citations: [
          cite(U.security22, "ImageIO — CVE-2008-2327 and CVE-2008-1586"),
        ],
      }),
      change({
        key: "ios-2-2-pptp-encryption-preference",
        title: "PPTP VPN encryption preference",
        canonicalSummary:
          "PPTP VPN connections stopped reverting to a weaker encryption setting.",
        category: "security",
        action: "fixed",
        summary:
          "The networking fix ensured that the selected encryption preference was applied correctly.",
        citations: [cite(U.security22, "Networking — CVE-2008-4227")],
      }),
      change({
        key: "ios-2-2-office-excel-columns",
        title: "Excel column-index validation",
        canonicalSummary:
          "Office Viewer rejected negative column indices that could cause out-of-bounds access in crafted Excel files.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented potential application termination or arbitrary code execution from a malicious spreadsheet.",
        citations: [cite(U.security22, "Office Viewer — CVE-2008-4211")],
      }),
      change({
        key: "ios-2-2-emergency-number-restrictions",
        title: "Emergency-call number restrictions",
        canonicalSummary:
          "The locked-device emergency dialer restricted calls to a limited set of emergency numbers.",
        category: "security",
        action: "fixed",
        summary:
          "Previously, someone with physical access could place chargeable calls to arbitrary numbers from the emergency screen.",
        citations: [cite(U.security22, "Passcode Lock — CVE-2008-4228")],
      }),
      change({
        key: "ios-2-2-passcode-restore-state",
        title: "Passcode state after restore",
        canonicalSummary:
          "Restoring a device from backup no longer risked leaving Passcode Lock disabled.",
        category: "security",
        action: "fixed",
        summary:
          "Apple improved recognition of missing preferences to correct a race condition in settings restoration.",
        citations: [cite(U.security22, "Passcode Lock — CVE-2008-4229")],
      }),
      change({
        key: "ios-2-2-locked-sms-preview",
        title: "Locked-screen SMS privacy",
        canonicalSummary:
          "Incoming messages no longer revealed their full text on the emergency screen when SMS previews were disabled.",
        category: "security",
        action: "fixed",
        summary:
          "The corrected behavior displayed only a notification that a message had arrived.",
        citations: [cite(U.security22, "Passcode Lock — CVE-2008-4230")],
      }),
      change({
        key: "ios-2-2-safari-html-call-controls",
        title: "Safari HTML and call-approval controls",
        canonicalSummary:
          "Safari corrected HTML memory handling, iframe boundary enforcement, and approval-dialog behavior for phone links.",
        category: "security",
        action: "fixed",
        summary:
          "The grouped fixes covered code execution through crafted table elements, interface spoofing by overflowing frames, and calls initiated without sustained user approval.",
        citations: [
          cite(
            U.security22,
            "Safari — CVE-2008-4231, CVE-2008-4232, and CVE-2008-4233",
          ),
        ],
      }),
      change({
        key: "ios-2-2-webkit-form-cache",
        title: "WebKit form-data cache privacy",
        canonicalSummary:
          "WebKit properly cleared form data when a field disabled autocomplete.",
        category: "security",
        action: "fixed",
        summary:
          "The prior cache behavior could expose sensitive form contents to someone with physical access to an unlocked device.",
        citations: [cite(U.security22, "WebKit — CVE-2008-3644")],
      }),
    ],
  },
  {
    version: "2.2.1",
    summary:
      "iPhone 2.2.1 was a focused maintenance release that improved Safari stability and corrected Camera Roll display for certain images saved from Mail.",
    blocks: [
      block(
        "A contemporaneous MacRumors report dates the iPhone 2.2.1 release to January 27, 2009 and preserves two items from its update notice: a general Safari stability improvement and a correction for some Mail-saved images failing to display properly in Camera Roll.",
        [
          cite(
            U.macrumors221,
            "January 27 release and two-item iPhone update notice",
          ),
        ],
      ),
      block(
        "The report also notes a contemporaneous iPod touch package, but this batch targets only the existing iOS public route. Apple’s archived security index contains no separate 2.2.1 entry, so no security fix or build number is inferred.",
        [
          cite(U.macrumors221, "iPod touch package note"),
          cite(U.securityIndex, "2009 security chronology before iOS 3.0"),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors221, "January 27 release and update notice"),
      cite(U.securityIndex, "2009 security chronology before iOS 3.0"),
    ],
    changes: [
      change({
        key: "ios-2-2-1-safari-stability",
        title: "Safari stability",
        canonicalSummary: "The update improved Safari’s general stability.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The notice does not identify a narrower browser subsystem or failure mode.",
        citations: [cite(U.macrumors221, "Safari stability item")],
      }),
      change({
        key: "ios-2-2-1-mail-image-camera-roll",
        title: "Mail images in Camera Roll",
        canonicalSummary:
          "The update fixed a problem that prevented some images saved from Mail from displaying correctly in Camera Roll.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The preserved notice limits the correction to some saved images and does not specify a file format.",
        citations: [cite(U.macrumors221, "Mail image and Camera Roll item")],
      }),
    ],
  },
];

const idFor = (version) => `version-ios-${version.replaceAll(".", "-")}`;

const versions = releases.map((release) => ({
  releaseVersionId: idFor(release.version),
  authorship: "originalSynthesis",
  ...(release.releaseNotesUrl
    ? { releaseNotesUrl: release.releaseNotesUrl }
    : {}),
  overview: {
    authorship: "originalSynthesis",
    blocks: release.blocks,
  },
  citations: release.citations,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review,
}));

const events = releases.map((release) => ({
  target: {
    releaseVersionId: idFor(release.version),
    routeAlias: "public",
  },
  authorship: "originalSynthesis",
  summary: release.summary,
  article: {
    authorship: "originalSynthesis",
    blocks: release.blocks,
  },
  citations: release.citations,
  changes: release.changes,
  provenanceStatus: "editoriallyVerified",
  editorialReview: review,
  isIndexable: true,
}));

const bundle = {
  formatVersion: 1,
  target: {
    projectId: "lh3yswzu",
    dataset: "production",
  },
  accessedAt: "2026-07-30",
  sources,
  versions,
  events,
  builds: [],
};

fs.writeFileSync(
  out,
  await prettier.format(JSON.stringify(bundle), { filepath: out }),
);
console.log(
  `Wrote ${out}: ${sources.length} sources, ${versions.length} versions, ${events.length} events, ${events.reduce((sum, event) => sum + event.changes.length, 0)} changes`,
);
