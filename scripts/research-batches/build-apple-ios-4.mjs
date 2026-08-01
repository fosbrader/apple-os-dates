import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

const out = path.resolve("scripts/research-batches/apple-ios-4.json");

const U = {
  security2010: "https://support.apple.com/en-us/104188",
  security2011: "https://support.apple.com/en-us/101444",
  security40: "https://support.apple.com/en-us/104167",
  security402: "https://support.apple.com/en-us/103586",
  security41: "https://support.apple.com/en-us/103587",
  security42: "https://support.apple.com/en-us/103588",
  security43: "https://support.apple.com/en-us/103764",
  security432: "https://support.apple.com/en-us/103590",
  security434: "https://support.apple.com/en-us/103591",
  security435: "https://support.apple.com/en-us/103594",
  preview40:
    "https://www.apple.com/newsroom/2010/04/08Apple-Previews-iPhone-OS-4/",
  iphone4: "https://www.apple.com/newsroom/2010/06/07Apple-Presents-iPhone-4/",
  signalLetter:
    "https://www.apple.com/newsroom/2010/07/02Letter-from-Apple-Regarding-iPhone-4/",
  ipod41:
    "https://www.apple.com/newsroom/2010/09/01Apple-Introduces-New-iPod-touch/",
  newsroom42:
    "https://www.apple.com/newsroom/2010/11/22Apples-iOS-4-2-Available-Today-for-iPad-iPhone-iPod-touch/",
  newsroom43:
    "https://www.apple.com/newsroom/2011/03/02Apple-Introduces-iOS-4-3/",
  location:
    "https://www.apple.com/newsroom/2011/04/27Apple-Q-A-on-Location-Data/",
  macrumors431:
    "https://www.macrumors.com/2011/03/25/apple-releases-ios-4-3-1/",
};

const sources = [
  {
    url: U.security2010,
    title: "Apple security updates (2010)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2010", "security release index"],
  },
  {
    url: U.security2011,
    title: "Apple security updates (2011 to 2012)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2011", "2012", "security release index"],
  },
  {
    url: U.security40,
    title: "About the security content of iOS 4",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.0", "security"],
  },
  {
    url: U.security402,
    title:
      "About the security content of the iOS 4.0.2 Update for iPhone and iPod touch",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.0.2", "security"],
  },
  {
    url: U.security41,
    title: "About the security content of iOS 4.1 for iPhone and iPod touch",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.1", "security"],
  },
  {
    url: U.security42,
    title: "About the security content of iOS 4.2",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.2", "4.2.1", "security"],
  },
  {
    url: U.security43,
    title: "About the security content of iOS 4.3",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.3", "security"],
  },
  {
    url: U.security432,
    title: "About the security content of iOS 4.3.2 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.3.2", "security"],
  },
  {
    url: U.security434,
    title: "About the security content of iOS 4.3.4 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.3.4", "security"],
  },
  {
    url: U.security435,
    title: "About the security content of iOS 4.3.5 Software Update for iPhone",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iOS", "4.3.5", "security"],
  },
  {
    url: U.preview40,
    title: "Apple Previews iPhone OS 4",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2010-04-08T00:00:00Z",
    topics: ["iOS", "4.0", "features", "developer preview"],
  },
  {
    url: U.iphone4,
    title: "Apple Presents iPhone 4",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2010-06-07T00:00:00Z",
    topics: ["iOS", "4.0", "availability", "features"],
  },
  {
    url: U.signalLetter,
    title: "Letter from Apple Regarding iPhone 4",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2010-07-02T00:00:00Z",
    topics: ["iOS", "4.0.1", "signal display", "source-boundary context"],
  },
  {
    url: U.ipod41,
    title: "Apple Introduces New iPod touch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2010-09-01T00:00:00Z",
    topics: ["iOS", "4.1", "Game Center", "availability"],
  },
  {
    url: U.newsroom42,
    title: "Apple’s iOS 4.2 Available Today for iPad, iPhone & iPod touch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2010-11-22T00:00:00Z",
    topics: ["iOS", "4.2", "4.2.1", "features", "availability"],
  },
  {
    url: U.newsroom43,
    title: "Apple Introduces iOS 4.3",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2011-03-02T00:00:00Z",
    topics: ["iOS", "4.3", "features", "planned availability"],
  },
  {
    url: U.location,
    title: "Apple Q&A on Location Data",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2011-04-27T00:00:00Z",
    topics: [
      "iOS",
      "4.3.3",
      "location cache",
      "privacy",
      "source-boundary context",
    ],
  },
  {
    url: U.macrumors431,
    title: "Apple Releases iOS 4.3.1",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2011-03-25T17:14:00Z",
    topics: ["iOS", "4.3.1", "release notes", "contemporaneous reporting"],
  },
];

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
  evidenceState = "confirmed",
}) => ({
  key,
  title,
  canonicalSummary,
  category,
  action,
  inheritance: "delta",
  summary,
  documentedStatus,
  evidenceState,
  citations,
});

const reviewedAt = "2026-07-30T05:16:29Z";
const review = { status: "approved", reviewedAt };
const provenanceStatus = "editoriallyVerified";

const releases = [
  {
    version: "4.0",
    releaseNotesUrl: U.preview40,
    summary:
      "The public iOS 4 release introduced multitasking services, folders, a reorganized Mail experience, iBooks, expanded enterprise controls, iAd, and a broad security repair set.",
    blocks: [
      block(
        "iOS 4 established several interaction patterns that would persist across later releases: eligible devices gained third-party multitasking services and fast app switching, users could group apps into folders, and Mail added a unified inbox, quick account switching, threaded conversations, and compatible-app attachment handling.",
        [
          cite(U.preview40, "Multitasking, Folders, and Mail"),
          cite(U.iphone4, "iOS 4 features and June 21 availability"),
        ],
      ),
      block(
        "The release also brought iBooks to iPhone and iPod touch, introduced iAd, and expanded enterprise deployment, management, data protection, passcode, Exchange, and VPN capabilities. Apple’s security bulletin separately records repairs across privacy boundaries, device locking, media parsers, Safari, and WebKit.",
        [
          cite(U.preview40, "iBooks, iAd, and enterprise features"),
          cite(U.security40, "iOS 4 security content"),
          cite(U.security2010, "iOS 4 — 21 June 2010"),
        ],
      ),
    ],
    citations: [
      cite(U.preview40, "Principal iPhone OS 4 features"),
      cite(U.iphone4, "iOS 4 features and June 21 availability"),
      cite(U.security40, "iOS 4 security content"),
      cite(U.security2010, "iOS 4 — 21 June 2010"),
    ],
    changes: [
      change({
        key: "ios-4-0-multitasking-services",
        title: "Third-party multitasking services",
        canonicalSummary:
          "Eligible devices gained fast app switching and system services for selected background work.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple exposed seven multitasking services, including background audio and VoIP handling, while describing battery life and foreground performance as design constraints; hardware eligibility varied.",
        citations: [
          cite(U.preview40, "Multitasking services and device qualification"),
          cite(U.iphone4, "iOS 4 multitasking"),
        ],
      }),
      change({
        key: "ios-4-0-folders-home-screen",
        title: "Folders and home-screen customization",
        canonicalSummary:
          "Users could organize apps into named folders and choose wallpaper for the home and lock screens.",
        category: "feature",
        action: "introduced",
        summary:
          "Dragging one app onto another created an automatically named, editable folder, while wallpaper selection expanded from the lock screen to the home screen.",
        citations: [
          cite(U.preview40, "Folders"),
          cite(U.iphone4, "Folders and wallpaper"),
        ],
      }),
      change({
        key: "ios-4-0-mail-unified-threaded",
        title: "Unified and threaded Mail",
        canonicalSummary:
          "Mail added a unified inbox, fast inbox switching, conversation threads, and compatible-app attachment opening.",
        category: "enhancement",
        action: "changed",
        summary:
          "Multiple accounts could be viewed together or switched quickly, related messages could be grouped by conversation, and attachments could open in supporting App Store apps.",
        citations: [cite(U.preview40, "Mail")],
      }),
      change({
        key: "ios-4-0-ibooks-iphone",
        title: "iBooks on iPhone and iPod touch",
        canonicalSummary:
          "Apple extended its ebook reader and store to iPhone and iPod touch with synchronized reading state and PDF support.",
        category: "feature",
        action: "introduced",
        summary:
          "The free iBooks app synchronized reading position, bookmarks, highlights, and notes for the same book and could store and display PDFs.",
        citations: [
          cite(U.preview40, "iBooks"),
          cite(U.iphone4, "iBooks and PDF support"),
        ],
      }),
      change({
        key: "ios-4-0-enterprise-management-protection",
        title: "Expanded enterprise management and protection",
        canonicalSummary:
          "iOS 4 added mobile-device management integration, wireless in-house app distribution, stronger data protection, and broader enterprise compatibility.",
        category: "enhancement",
        action: "changed",
        summary:
          "Administrators gained remote configuration, query, lock, and wipe integration; enterprises could distribute internal apps wirelessly; and the release added passcode-based protection, complex passcodes, multiple Exchange accounts, Exchange 2010, and forthcoming SSL VPN support.",
        citations: [
          cite(U.preview40, "Enterprise features and Data Protection"),
        ],
      }),
      change({
        key: "ios-4-0-iad-platform",
        title: "iAd application advertising platform",
        canonicalSummary:
          "iOS 4 introduced an in-app advertising platform designed to present interactive media without moving users into Safari.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Developers could embed iAd placements whose interactive or video presentation remained inside the host app, with Apple responsible for serving the advertisements.",
        citations: [cite(U.preview40, "iAd")],
      }),
      change({
        key: "ios-4-0-sandbox-photo-location-boundary",
        title: "Photo-library location privacy boundary",
        canonicalSummary:
          "The application sandbox stopped apps from directly reading the photo library to infer visited locations without authorization.",
        category: "security",
        action: "fixed",
        summary:
          "Apple changed sandbox access so an application could not bypass location permission by directly examining geotagged photo-library data.",
        citations: [cite(U.security40, "Application Sandbox — CVE-2010-1751")],
      }),
      change({
        key: "ios-4-0-find-my-iphone-disabled-services",
        title: "Find My iPhone disabled-service enforcement",
        canonicalSummary:
          "Disabling Find My iPhone also disabled remote wipe and remote message display for that service.",
        category: "security",
        action: "fixed",
        summary:
          "The prior state could leave destructive remote actions available to someone with the MobileMe password even when device location was disabled; the update aligned those controls.",
        citations: [cite(U.security40, "Find My iPhone — CVE-2010-1776")],
      }),
      change({
        key: "ios-4-0-passcode-lock-state-pairing",
        title: "Passcode lock-state protections",
        canonicalSummary:
          "The release tightened remote-lock passcode handling and computer-pairing checks around locked or recently booted devices.",
        category: "security",
        action: "fixed",
        summary:
          "Apple corrected a remote-lock state that could leave a passcode pre-entered and a short boot-time race that could permit computer pairing after an earlier unlocked shutdown.",
        citations: [
          cite(U.security40, "Passcode Lock — CVE-2010-1754 and CVE-2010-1775"),
        ],
      }),
      change({
        key: "ios-4-0-image-parser-memory-safety",
        title: "Image parser memory safety",
        canonicalSummary:
          "ImageIO received validation and memory-safety repairs for BMP, TIFF, JPEG, and other crafted image input.",
        category: "security",
        action: "fixed",
        summary:
          "The bulletin documents both possible memory disclosure and potential code execution when processing malicious image files; the release added initialization, validation, memory handling, and bounds checks.",
        citations: [cite(U.security40, "ImageIO entries")],
      }),
      change({
        key: "ios-4-0-safari-cookie-url-trust",
        title: "Safari cookie and URL trust cues",
        canonicalSummary:
          "Safari applied cookie preferences immediately and improved warnings or displayed URLs around potentially deceptive navigation.",
        category: "security",
        action: "fixed",
        summary:
          "The changes enforced updated cookie settings without waiting for restart, warned before visiting URLs containing embedded credentials, and corrected the address shown with certificate warnings after redirects.",
        citations: [cite(U.security40, "Safari entries")],
      }),
      change({
        key: "ios-4-0-webkit-origin-memory-safety",
        title: "WebKit origin and memory-safety repairs",
        canonicalSummary:
          "WebKit fixed cross-origin data boundaries, cross-site scripting paths, information disclosure, and multiple memory-corruption conditions.",
        category: "security",
        action: "fixed",
        summary:
          "Apple’s bulletin describes a large browser repair set spanning cross-origin requests, malformed and encoded content, redirects, DOM and layout operations, and crafted pages that could terminate the browser or execute code.",
        citations: [cite(U.security40, "WebKit entries")],
      }),
    ],
  },
  {
    version: "4.0.1",
    summary:
      "The surviving Apple record establishes iOS 4.0.1 as the predecessor to iOS 4.0.2 and separately describes a planned signal-bar formula correction, but it does not explicitly connect that correction to the 4.0.1 package.",
    blocks: [
      block(
        "Apple announced in early July that its signal-strength display formula could show too many bars. It planned a free software update using a revised calculation and larger lower bars, without changing the underlying radio signal.",
        [
          cite(
            U.signalLetter,
            "Signal-bar finding and planned software update",
          ),
        ],
      ),
      block(
        "Apple’s later iOS 4.0.2 advisory names iOS 4.0.1 as an affected predecessor, confirming that the version existed. Neither reviewed page names iOS 4.0.1 as the delivery vehicle for the earlier plan, and Apple’s 2010 security index does not list a 4.0.1 security release, so the linkage remains explicitly partial.",
        [
          cite(U.security402, "Available for range through iOS 4.0.1"),
          cite(U.security2010, "2010 security release index"),
        ],
      ),
    ],
    citations: [
      cite(U.signalLetter, "Planned signal-display software correction"),
      cite(U.security402, "Available for range through iOS 4.0.1"),
      cite(U.security2010, "2010 security release index"),
    ],
    changes: [
      change({
        key: "ios-4-0-1-signal-bars-source-linkage",
        title: "Signal-bar display correction with incomplete version linkage",
        canonicalSummary:
          "Apple documented a planned correction to the formula and sizing used for signal bars, while the surviving first-party pages do not explicitly name iOS 4.0.1 as its delivery vehicle.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The intended change was to make displayed bars better reflect existing signal strength and enlarge the lower three bars. Attaching it to this route is marked partially documented because Apple’s statement predates the package and omits its version number.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "corroborated",
        citations: [
          cite(U.signalLetter, "Planned signal-display software correction"),
          cite(
            U.security402,
            "iOS 4.0.1 identified as prior installed version",
          ),
        ],
      }),
    ],
  },
  {
    version: "4.0.2",
    releaseNotesUrl: U.security402,
    summary:
      "iOS 4.0.2 was a focused security update that repaired a crafted-PDF font vulnerability and an IOSurface privilege-escalation path.",
    blocks: [
      block(
        "Apple’s dedicated advisory identifies two corrections in iOS 4.0.2. One added bounds checking to FreeType’s handling of embedded CFF font instructions, where a malicious PDF could execute code.",
        [cite(U.security402, "FreeType — CVE-2010-1797")],
      ),
      block(
        "The second correction tightened IOSurface property validation to prevent code already running as the user from exploiting an integer overflow to gain system privileges. Apple’s 2010 index dates the release to August 11, 2010.",
        [
          cite(U.security402, "IOSurface — CVE-2010-2973"),
          cite(U.security2010, "iOS 4.0.2 — 11 Aug 2010"),
        ],
      ),
    ],
    citations: [
      cite(U.security402, "iOS 4.0.2 security content"),
      cite(U.security2010, "iOS 4.0.2 — 11 Aug 2010"),
    ],
    changes: [
      change({
        key: "ios-4-0-2-pdf-freetype-bounds",
        title: "Crafted PDF font bounds checking",
        canonicalSummary:
          "FreeType added bounds checks for CFF font instructions embedded in PDF documents.",
        category: "security",
        action: "fixed",
        summary:
          "The flaw could allow arbitrary code execution when viewing a malicious PDF containing a crafted embedded font.",
        citations: [cite(U.security402, "FreeType — CVE-2010-1797")],
      }),
      change({
        key: "ios-4-0-2-iosurface-privilege-boundary",
        title: "IOSurface privilege boundary",
        canonicalSummary:
          "IOSurface property handling gained bounds checks for an integer overflow that could enable system privileges.",
        category: "security",
        action: "fixed",
        summary:
          "Apple described the prerequisite as malicious code already running with user privileges; the corrected validation prevented that code from escalating through IOSurface.",
        citations: [cite(U.security402, "IOSurface — CVE-2010-2973")],
      }),
    ],
  },
  {
    version: "4.1",
    releaseNotesUrl: U.security41,
    summary:
      "iOS 4.1 introduced Game Center to the public release line, expanded FaceTime support on the new iPod touch, and delivered security fixes for accessibility, FaceTime trust, image parsing, and WebKit.",
    blocks: [
      block(
        "The public release brought Game Center’s friend challenges, automatic matchmaking, achievements, leaderboards, and game discovery to supported devices. On the new iPod touch, iOS 4.1 also underpinned FaceTime video calling alongside multitasking and folders.",
        [
          cite(U.ipod41, "Game Center, FaceTime, and September 8 update"),
          cite(U.security2010, "iOS 4.1 — 8 Sept 2010"),
        ],
      ),
      block(
        "Apple’s security bulletin documents a VoiceOver correction for location-service indicators, stronger certificate handling for FaceTime calls, safer TIFF and GIF parsing, and numerous WebKit memory-safety fixes. These entries are representative rather than a one-record-per-CVE transcription.",
        [cite(U.security41, "iOS 4.1 security content")],
      ),
    ],
    citations: [
      cite(U.ipod41, "iOS 4.1 features and September 8 availability"),
      cite(U.security41, "iOS 4.1 security content"),
      cite(U.security2010, "iOS 4.1 — 8 Sept 2010"),
    ],
    changes: [
      change({
        key: "ios-4-1-game-center",
        title: "Game Center social gaming network",
        canonicalSummary:
          "Game Center added friend challenges, matchmaking, achievements, leaderboards, and game discovery.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported games could connect players with friends or automatically selected opponents while surfacing scores, achievements, and games played by friends.",
        citations: [cite(U.ipod41, "Game Center")],
      }),
      change({
        key: "ios-4-1-ipod-touch-facetime",
        title: "FaceTime support on the new iPod touch",
        canonicalSummary:
          "iOS 4.1 enabled FaceTime video calls on the camera-equipped fourth-generation iPod touch.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The new iPod touch could place Wi-Fi FaceTime calls to another compatible iPod touch or iPhone 4 and switch between front and rear cameras.",
        citations: [cite(U.ipod41, "FaceTime on iPod touch")],
      }),
      change({
        key: "ios-4-1-voiceover-location-indicator",
        title: "VoiceOver announcement for location use",
        canonicalSummary:
          "VoiceOver began announcing the settings indicator for apps that had recently requested location.",
        category: "security",
        action: "fixed",
        summary:
          "The change made the location-services status cue available to VoiceOver users instead of leaving it visual-only.",
        citations: [cite(U.security41, "Accessibility — CVE-2010-1809")],
      }),
      change({
        key: "ios-4-1-facetime-certificate-validation",
        title: "FaceTime certificate validation",
        canonicalSummary:
          "FaceTime improved its handling of invalid certificates to resist call redirection by a privileged network attacker.",
        category: "security",
        action: "fixed",
        summary:
          "Apple tied the issue to an attacker in a privileged network position and addressed it through stricter certificate handling.",
        citations: [cite(U.security41, "FaceTime — CVE-2010-1810")],
      }),
      change({
        key: "ios-4-1-imageio-tiff-gif",
        title: "TIFF and GIF parser memory safety",
        canonicalSummary:
          "ImageIO corrected memory-corruption conditions in TIFF and GIF processing.",
        category: "security",
        action: "fixed",
        summary:
          "Crafted images could terminate an application or execute code; the release improved image handling and bounds checks.",
        citations: [
          cite(U.security41, "ImageIO — CVE-2010-1811 and CVE-2010-1817"),
        ],
      }),
      change({
        key: "ios-4-1-webkit-svg-text-memory",
        title: "WebKit SVG and text-node safety",
        canonicalSummary:
          "WebKit added validation, type checking, and memory handling for multiple crafted SVG and text-node cases.",
        category: "security",
        action: "fixed",
        summary:
          "The repaired use-after-free, invalid-state, and memory-corruption conditions could otherwise terminate the browser or permit code execution on a malicious page.",
        citations: [cite(U.security41, "WebKit entries")],
      }),
    ],
  },
  {
    version: "4.2.1",
    releaseNotesUrl: U.newsroom42,
    summary:
      "The local 4.2.1 route corresponds to Apple’s November 22 public package, which contemporaneous Apple pages call iOS 4.2; it unified the iPad with iOS 4 features and added AirPlay, AirPrint, free Find My device access for qualifying hardware, and extensive security repairs.",
    blocks: [
      block(
        "Apple’s announcement describes the November 22 package as iOS 4.2, while the local catalog and Apple’s later 4.3 advisory identify the installed predecessor as 4.2.1. The update brought multitasking, folders, unified Mail, and Game Center to iPad and introduced AirPlay and AirPrint across supported devices.",
        [
          cite(U.newsroom42, "November 22 availability and principal features"),
          cite(U.security42, "iOS 4.2 security content"),
          cite(U.security43, "Available for range through iOS 4.2.1"),
        ],
      ),
      block(
        "The release also made Find My iPhone, iPad, or iPod touch free on qualifying devices and expanded Safari search, enterprise management, accessibility, and language coverage on iPad. Apple’s bulletin records protections for configuration profiles, fonts and images, ad-triggered calls, networking, passcode state, credentials, and WebKit.",
        [
          cite(U.newsroom42, "Find My device and other iPad features"),
          cite(U.security42, "iOS 4.2 security content"),
          cite(U.security2010, "iOS 4.2 — 22 Nov 2010"),
        ],
      ),
    ],
    citations: [
      cite(U.newsroom42, "iOS 4.2 — 22 Nov 2010"),
      cite(U.security42, "iOS 4.2 security content"),
      cite(U.security43, "Available for range through iOS 4.2.1"),
      cite(U.security2010, "iOS 4.2 — 22 Nov 2010"),
    ],
    changes: [
      change({
        key: "ios-4-2-1-ipad-ios4-features",
        title: "iOS 4 feature set on iPad",
        canonicalSummary:
          "iPad gained multitasking, folders, unified and threaded Mail, and Game Center.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The November update brought the principal interaction and organization features from iOS 4.0 and 4.1 onto supported iPad hardware.",
        citations: [cite(U.newsroom42, "iPad features")],
      }),
      change({
        key: "ios-4-2-1-airplay",
        title: "AirPlay media streaming",
        canonicalSummary:
          "AirPlay streamed music, video, and photos from iOS devices to compatible Apple TV or audio targets.",
        category: "feature",
        action: "introduced",
        summary:
          "Supported devices could send media wirelessly to Apple TV, AirPort Express-connected audio systems, or compatible speakers.",
        citations: [cite(U.newsroom42, "AirPlay")],
      }),
      change({
        key: "ios-4-2-1-airprint",
        title: "Driverless AirPrint",
        canonicalSummary:
          "AirPrint enabled direct Wi-Fi printing to supported printers without installing device drivers.",
        category: "feature",
        action: "introduced",
        summary:
          "Users could print documents or photos directly from a supported iPad, iPhone, or iPod touch to an AirPrint-capable printer.",
        citations: [cite(U.newsroom42, "AirPrint")],
      }),
      change({
        key: "ios-4-2-1-find-my-device-free",
        title: "Free Find My device access on qualifying hardware",
        canonicalSummary:
          "Find My iPhone, iPad, or iPod touch became available without a MobileMe subscription on the documented newer devices.",
        category: "enhancement",
        action: "changed",
        summary:
          "The service could locate a missing device, show a message, play a sound, remotely lock it, or erase its data; Apple limited the free offer to specified hardware.",
        citations: [cite(U.newsroom42, "Find My iPhone and hardware footnote")],
      }),
      change({
        key: "ios-4-2-1-safari-enterprise-language",
        title: "Safari, enterprise, accessibility, and language expansion",
        canonicalSummary:
          "The iPad update added in-page Safari search, stronger enterprise integration, accessibility improvements, and 25 additional languages.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple also documented direct TV episode rentals on iPad alongside new device-management and regional support.",
        citations: [cite(U.newsroom42, "Other new iPad features")],
      }),
      change({
        key: "ios-4-2-1-profile-signature-validation",
        title: "Configuration-profile signature validation",
        canonicalSummary:
          "The profile installer improved signature validation so a crafted profile could not appear valid.",
        category: "security",
        action: "fixed",
        summary:
          "The correction reduced the risk of misleading a user into installing a malicious configuration profile presented with an invalid trust cue.",
        citations: [
          cite(U.security42, "Configuration Profiles — CVE-2010-3827"),
        ],
      }),
      change({
        key: "ios-4-2-1-font-image-parser-safety",
        title: "Font and image parser updates",
        canonicalSummary:
          "CoreGraphics, FreeType, ImageIO, and related libraries received updates for crafted fonts and images.",
        category: "security",
        action: "fixed",
        summary:
          "Apple updated FreeType and libpng and added bounds checking for font processing, addressing issues whose most serious outcomes included code execution.",
        citations: [
          cite(U.security42, "CoreGraphics, FreeType, and ImageIO entries"),
        ],
      }),
      change({
        key: "ios-4-2-1-iad-call-confirmation",
        title: "Confirmation before calls from iAd links",
        canonicalSummary:
          "iAd content required user confirmation before a link could initiate a telephone call.",
        category: "security",
        action: "fixed",
        summary:
          "The change prevented injected ad content from automatically invoking a call URL when an attacker controlled a privileged network position.",
        citations: [cite(U.security42, "iAd Content Display — CVE-2010-3828")],
      }),
      change({
        key: "ios-4-2-1-mail-dns-prefetch-privacy",
        title: "Mail remote-content privacy",
        canonicalSummary:
          "Mail stopped DNS prefetching for linked content when remote image loading was disabled.",
        category: "security",
        action: "fixed",
        summary:
          "The prior behavior could reveal that an HTML email had been viewed through an otherwise unexpected request to a remote server.",
        citations: [cite(U.security42, "Mail — DNS prefetching entry")],
      }),
      change({
        key: "ios-4-2-1-network-passcode-protection",
        title: "Network and passcode-state protections",
        canonicalSummary:
          "The release hardened packet handling, packet-filter rules, and the emergency-call lock-state transition.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented a remote shutdown path in multicast packet handling, a local privilege path in packet-filter rules, and a physical-access race around an emergency call.",
        citations: [
          cite(
            U.security42,
            "Networking and Passcode Lock — CVE-2010-1843, CVE-2010-3830, and CVE-2010-4012",
          ),
        ],
      }),
      change({
        key: "ios-4-2-1-webkit-memory-safety",
        title: "WebKit memory-safety repairs",
        canonicalSummary:
          "WebKit corrected multiple crafted-page memory errors, including CSS, SVG, focus, and object-lifetime cases.",
        category: "security",
        action: "fixed",
        summary:
          "The bulletin groups many browser-engine defects whose most serious documented outcome was arbitrary code execution after visiting a malicious site.",
        citations: [cite(U.security42, "WebKit entries")],
      }),
    ],
  },
  {
    version: "4.3",
    releaseNotesUrl: U.newsroom43,
    summary:
      "iOS 4.3 added the Nitro JavaScript engine to Safari, iTunes Home Sharing, broader AirPlay, Personal Hotspot, an iPad side-switch option, and security repairs spanning media, networking, Safari, WebKit, and Wi-Fi.",
    blocks: [
      block(
        "The feature release accelerated Safari JavaScript with Nitro, streamed a local Mac or PC iTunes library through Home Sharing, expanded AirPlay to more app, website, Photos, and iTunes content, and added Personal Hotspot for eligible iPhone 4 plans. It also let iPad owners assign the side switch to rotation lock or mute.",
        [cite(U.newsroom43, "Principal iOS 4.3 features")],
      ),
      block(
        "Apple’s security advisory records fixes for crafted fonts and images, XML parsing, IPv6 address privacy, Safari cookie and URL-handler behavior, WebKit memory safety, and Wi-Fi frame validation. The local March 9 date agrees with Apple’s security index but precedes the March 11 date originally announced by Newsroom.",
        [
          cite(U.security43, "iOS 4.3 security content"),
          cite(U.security2011, "iOS 4.3 — 9 Mar 2011"),
          cite(U.newsroom43, "Originally announced March 11 availability"),
        ],
      ),
    ],
    citations: [
      cite(
        U.newsroom43,
        "iOS 4.3 features and originally planned availability",
      ),
      cite(U.security43, "iOS 4.3 security content"),
      cite(U.security2011, "iOS 4.3 — 9 Mar 2011"),
    ],
    changes: [
      change({
        key: "ios-4-3-safari-nitro",
        title: "Nitro JavaScript engine in Safari",
        canonicalSummary:
          "Mobile Safari adopted Nitro just-in-time compilation for faster JavaScript execution.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple described the engine as more than doubling JavaScript execution performance compared with the preceding implementation.",
        citations: [cite(U.newsroom43, "Safari and Nitro")],
      }),
      change({
        key: "ios-4-3-itunes-home-sharing",
        title: "iTunes Home Sharing",
        canonicalSummary:
          "iOS devices could stream music, movies, and television from a shared iTunes library over local Wi-Fi.",
        category: "feature",
        action: "introduced",
        summary:
          "Home Sharing exposed a Mac or PC iTunes library to a supported iPad, iPhone, or iPod touch without first downloading or syncing the selected media.",
        citations: [cite(U.newsroom43, "iTunes Home Sharing")],
      }),
      change({
        key: "ios-4-3-airplay-expansion",
        title: "Expanded AirPlay video sources",
        canonicalSummary:
          "AirPlay added video from third-party apps and websites, Photos videos, and iTunes previews.",
        category: "enhancement",
        action: "changed",
        summary:
          "Apple also added slideshow transitions when presenting photos through Apple TV.",
        citations: [cite(U.newsroom43, "AirPlay enhancements")],
      }),
      change({
        key: "ios-4-3-personal-hotspot",
        title: "Personal Hotspot",
        canonicalSummary:
          "Eligible iPhone 4 users could share cellular data with nearby Wi-Fi, Bluetooth, and USB devices.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple documented support for up to five combined connections, password protection, a connected-device indicator, and automatic idle shutdown; carrier plan support was required.",
        citations: [
          cite(U.newsroom43, "Personal Hotspot and carrier-plan footnote"),
        ],
      }),
      change({
        key: "ios-4-3-ipad-side-switch-choice",
        title: "Configurable iPad side switch",
        canonicalSummary:
          "iPad users could choose whether the hardware side switch controlled rotation lock or mute.",
        category: "behavior",
        action: "changed",
        summary:
          "The setting restored user choice between the two behaviors instead of assigning a single fixed function.",
        citations: [cite(U.newsroom43, "iPad side-switch option")],
      }),
      change({
        key: "ios-4-3-font-image-xml-safety",
        title: "Font, image, and XML parser safety",
        canonicalSummary:
          "The release updated FreeType and repaired TIFF and XPath memory-safety defects.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented crafted font, TIFF, and XML inputs that could terminate applications or execute code, depending on the parser and defect.",
        citations: [
          cite(U.security43, "CoreGraphics, ImageIO, and libxml entries"),
        ],
      }),
      change({
        key: "ios-4-3-ipv6-address-privacy",
        title: "Temporary IPv6 source addresses",
        canonicalSummary:
          "Outgoing IPv6 connections began using temporary randomized addresses instead of an address embedding the device MAC.",
        category: "security",
        action: "fixed",
        summary:
          "The networking change reduced a server’s ability to recognize the same device across connections through SLAAC address structure.",
        citations: [cite(U.security43, "Networking — IPv6 SLAAC entry")],
      }),
      change({
        key: "ios-4-3-safari-url-cookie-recovery",
        title: "Safari URL-handler and cookie recovery",
        canonicalSummary:
          "Safari improved recovery from repeated external-app launches and made cookie clearing effective while the browser was running.",
        category: "security",
        action: "fixed",
        summary:
          "The changes stopped a crafted page from trapping Safari in repeated URL-handler launches and ensured that clearing cookies in Settings took effect.",
        citations: [cite(U.security43, "Safari entries")],
      }),
      change({
        key: "ios-4-3-webkit-memory-origin",
        title: "WebKit memory and origin protections",
        canonicalSummary:
          "WebKit fixed numerous memory-corruption, credential-forwarding, cross-origin style, and cache-poisoning defects.",
        category: "security",
        action: "fixed",
        summary:
          "The bulletin documents potential code execution from crafted pages as well as narrower cross-site information and resource-integrity failures.",
        citations: [cite(U.security43, "WebKit entries")],
      }),
      change({
        key: "ios-4-3-wifi-frame-validation",
        title: "Wi-Fi frame bounds checking",
        canonicalSummary:
          "Wi-Fi frame processing added bounds checks for a condition that could reset a device.",
        category: "security",
        action: "fixed",
        summary:
          "Apple scoped the attack to another system on the same Wi-Fi network sending crafted frames.",
        citations: [cite(U.security43, "Wi-Fi — CVE-2011-0162")],
      }),
    ],
  },
  {
    version: "4.3.1",
    summary:
      "iOS 4.3.1 was a maintenance release addressing an iPod touch graphics glitch, cellular activation and connection problems, Digital AV Adapter flicker, and enterprise web-service authentication.",
    blocks: [
      block(
        "Contemporaneous reporting preserved four items from the iOS 4.3.1 update notice: a sporadic graphics problem on the fourth-generation iPod touch, activation and connectivity trouble on certain cellular networks, image flicker with the Apple Digital AV Adapter on some televisions, and authentication failures involving some enterprise web services.",
        [
          cite(
            U.macrumors431,
            "Contemporaneous reproduction of the four-item update notice",
          ),
        ],
      ),
      block(
        "The same report dates the public release to March 25, 2011. Apple’s surviving first-party security corpus independently establishes iOS 4.3.1 as the predecessor covered by the iOS 4.3.2 advisory, but Apple’s archived security index does not preserve a separate 4.3.1 entry. The structured notes therefore rely on the cited contemporary report rather than presenting that material as a surviving Apple web page.",
        [
          cite(U.macrumors431, "Published March 25, 2011"),
          cite(U.security432, "Available for range through iOS 4.3.1"),
          cite(U.security2011, "2011 security release chronology"),
        ],
      ),
    ],
    citations: [
      cite(
        U.macrumors431,
        "Contemporaneous reproduction of the iOS 4.3.1 update notice",
      ),
      cite(U.security432, "Available for range through iOS 4.3.1"),
      cite(U.security2011, "2011 security release chronology"),
    ],
    changes: [
      change({
        key: "ios-4-3-1-ipod-touch-graphics",
        title: "iPod touch graphics stability",
        canonicalSummary:
          "The update corrected an intermittent graphics glitch on the fourth-generation iPod touch.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The preserved update notice scopes the graphics correction to occasional behavior on the fourth-generation iPod touch.",
        citations: [
          cite(U.macrumors431, "Fourth-generation iPod touch graphics item"),
        ],
      }),
      change({
        key: "ios-4-3-1-cellular-activation-connectivity",
        title: "Cellular activation and connectivity",
        canonicalSummary:
          "The update addressed activation and connection problems on certain cellular networks.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The source does not identify affected carriers or devices, so the structured claim retains the original limited scope.",
        citations: [
          cite(U.macrumors431, "Cellular activation and connection item"),
        ],
      }),
      change({
        key: "ios-4-3-1-digital-av-flicker",
        title: "Digital AV Adapter image stability",
        canonicalSummary:
          "The update corrected image flicker when an Apple Digital AV Adapter was used with some televisions.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The preserved notice describes a display-output correction and limits it to some television configurations.",
        citations: [
          cite(U.macrumors431, "Apple Digital AV Adapter flicker item"),
        ],
      }),
      change({
        key: "ios-4-3-1-enterprise-web-authentication",
        title: "Enterprise web-service authentication",
        canonicalSummary:
          "The update resolved an authentication problem involving some enterprise web services.",
        category: "bugFix",
        action: "fixed",
        summary:
          "No particular service or protocol is named in the surviving report, so the entry does not infer a narrower technical cause.",
        citations: [
          cite(U.macrumors431, "Enterprise web-service authentication item"),
        ],
      }),
    ],
  },
  {
    version: "4.3.2",
    releaseNotesUrl: U.security432,
    summary:
      "iOS 4.3.2 blacklisted fraudulently issued certificates and repaired address disclosure, QuickLook document parsing, and WebKit memory-safety defects.",
    blocks: [
      block(
        "The trust-policy change rejected a set of fraudulently issued SSL certificates that could otherwise support interception of credentials or other sensitive information by an attacker in a privileged network position.",
        [cite(U.security432, "Certificate Trust Policy")],
      ),
      block(
        "The update also stopped an XPath function from exposing heap addresses, corrected a QuickLook memory-corruption issue in Microsoft Office file handling, and fixed two WebKit flaws involving node sets and text-node lifetime. Apple’s index dates the package to April 14, 2011.",
        [
          cite(U.security432, "libxslt, QuickLook, and WebKit entries"),
          cite(U.security2011, "iOS 4.3.2 — 14 Apr 2011"),
        ],
      ),
    ],
    citations: [
      cite(U.security432, "iOS 4.3.2 security content"),
      cite(U.security2011, "iOS 4.3.2 — 14 Apr 2011"),
    ],
    changes: [
      change({
        key: "ios-4-3-2-comodo-certificate-block",
        title: "Fraudulent certificate blocklist",
        canonicalSummary:
          "The trust policy rejected fraudulently issued SSL certificates associated with a Comodo affiliate.",
        category: "security",
        action: "fixed",
        summary:
          "This reduced the ability of a privileged network attacker to redirect connections and intercept credentials or other sensitive data using those certificates.",
        citations: [cite(U.security432, "Certificate Trust Policy")],
      }),
      change({
        key: "ios-4-3-2-libxslt-heap-address",
        title: "libxslt heap-address disclosure",
        canonicalSummary:
          "libxslt stopped deriving XPath generate-id output directly from a heap-buffer address.",
        category: "security",
        action: "fixed",
        summary:
          "The old behavior could disclose heap addresses to a malicious page and help bypass address-space randomization.",
        citations: [cite(U.security432, "libxslt — CVE-2011-0195")],
      }),
      change({
        key: "ios-4-3-2-quicklook-office-files",
        title: "QuickLook Office-file memory safety",
        canonicalSummary:
          "QuickLook corrected memory corruption while processing crafted Microsoft Office files.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented unexpected application termination or arbitrary code execution as possible outcomes.",
        citations: [cite(U.security432, "QuickLook — CVE-2011-1417")],
      }),
      change({
        key: "ios-4-3-2-webkit-nodeset-overflow",
        title: "WebKit nodeset integer overflow",
        canonicalSummary:
          "WebKit corrected an integer overflow in nodeset handling.",
        category: "security",
        action: "fixed",
        summary:
          "A malicious page could use the defect to terminate an application or execute code.",
        citations: [cite(U.security432, "WebKit — CVE-2011-1290")],
      }),
      change({
        key: "ios-4-3-2-webkit-text-node-lifetime",
        title: "WebKit text-node lifetime",
        canonicalSummary:
          "WebKit repaired a use-after-free condition in text-node handling.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented browser termination or arbitrary code execution after visiting a crafted website.",
        citations: [cite(U.security432, "WebKit — CVE-2011-1344")],
      }),
    ],
  },
  {
    version: "4.3.3",
    summary:
      "A contemporaneous Apple statement announced a forthcoming location-cache privacy update, and the next security advisory confirms iOS 4.3.3 as an installed predecessor; the surviving first-party statement does not explicitly name 4.3.3, so the linkage is marked partial.",
    blocks: [
      block(
        "On April 27 Apple said an upcoming iOS update would reduce the cached Wi-Fi-hotspot and cell-tower database, stop backing it up, and delete it when Location Services was disabled. Apple characterized the oversized cache and continued updates after disabling Location Services as bugs.",
        [cite(U.location, "Questions 3, 4, 6, and 7; Software Update")],
      ),
      block(
        "The later iOS 4.3.4 advisory explicitly lists systems through iOS 4.3.3, confirming the version existed before July. Neither source names the promised privacy update as 4.3.3 or verifies the local May 4 date, so this batch records the two-source boundary only as partially documented context rather than as an unqualified delivery claim.",
        [
          cite(U.security434, "Available for range through iOS 4.3.3"),
          cite(U.security2011, "2011 security release chronology"),
        ],
      ),
    ],
    citations: [
      cite(U.location, "Software Update"),
      cite(U.security434, "Available for range through iOS 4.3.3"),
      cite(U.security2011, "2011 security release chronology"),
    ],
    changes: [
      change({
        key: "ios-4-3-3-location-cache-source-linkage",
        title:
          "Location-cache privacy maintenance with incomplete version linkage",
        canonicalSummary:
          "Apple announced an imminent update to shorten, stop backing up, and conditionally delete the location-assistance cache, but its surviving statement does not identify the package as iOS 4.3.3.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The intended corrections addressed excessive cache retention and continued cache updates after Location Services was disabled. This occurrence remains partially documented because the first-party pages establish the plan and the 4.3.3 predecessor boundary, not explicit delivery in this named release.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "corroborated",
        citations: [
          cite(U.location, "Software Update"),
          cite(
            U.security434,
            "iOS 4.3.3 identified as prior installed version",
          ),
        ],
      }),
    ],
  },
  {
    version: "4.3.4",
    releaseNotesUrl: U.security434,
    summary:
      "iOS 4.3.4 closed two crafted-PDF font vulnerabilities and a framebuffer privilege-escalation path.",
    blocks: [
      block(
        "Two CoreGraphics corrections addressed FreeType handling of TrueType and Type 1 fonts inside malicious PDF files. Apple documented application termination or arbitrary code execution as possible outcomes.",
        [cite(U.security434, "CoreGraphics — CVE-2010-3855 and CVE-2011-0226")],
      ),
      block(
        "The update also corrected an invalid type conversion in IOMobileFrameBuffer queueing primitives that could allow code already running as the user to gain system privileges. Apple’s index dates the release to July 15, 2011.",
        [
          cite(U.security434, "IOMobileFrameBuffer — CVE-2011-0227"),
          cite(U.security2011, "iOS 4.3.4 — 15 July 2011"),
        ],
      ),
    ],
    citations: [
      cite(U.security434, "iOS 4.3.4 security content"),
      cite(U.security2011, "iOS 4.3.4 — 15 July 2011"),
    ],
    changes: [
      change({
        key: "ios-4-3-4-pdf-truetype-overflow",
        title: "TrueType PDF font overflow",
        canonicalSummary:
          "FreeType corrected a buffer overflow while processing TrueType fonts in crafted PDFs.",
        category: "security",
        action: "fixed",
        summary:
          "Opening a malicious PDF could otherwise terminate an application or execute arbitrary code.",
        citations: [cite(U.security434, "CoreGraphics — CVE-2010-3855")],
      }),
      change({
        key: "ios-4-3-4-pdf-type1-signedness",
        title: "Type 1 PDF font signedness",
        canonicalSummary:
          "FreeType corrected a signedness issue while processing Type 1 fonts in crafted PDFs.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented unexpected termination or arbitrary code execution from a malicious PDF.",
        citations: [cite(U.security434, "CoreGraphics — CVE-2011-0226")],
      }),
      change({
        key: "ios-4-3-4-framebuffer-privilege-boundary",
        title: "IOMobileFrameBuffer privilege boundary",
        canonicalSummary:
          "IOMobileFrameBuffer corrected an invalid type conversion in queueing primitives.",
        category: "security",
        action: "fixed",
        summary:
          "The defect could allow malicious code already running as the user to gain system privileges.",
        citations: [cite(U.security434, "IOMobileFrameBuffer — CVE-2011-0227")],
      }),
    ],
  },
  {
    version: "4.3.5",
    releaseNotesUrl: U.security435,
    summary:
      "iOS 4.3.5 was a focused certificate-validation security update for SSL/TLS and other X.509 trust decisions.",
    blocks: [
      block(
        "Apple corrected certificate-chain validation for X.509 certificates. The prior behavior could let an attacker in a privileged network position capture or alter data in SSL/TLS sessions and could permit other certificate-validation attacks.",
        [cite(U.security435, "Data Security — CVE-2011-0228")],
      ),
      block(
        "The package improved validation of X.509 certificate chains and appears in Apple’s archived security index on July 25, 2011.",
        [
          cite(U.security435, "Data Security — CVE-2011-0228"),
          cite(U.security2011, "iOS 4.3.5 — 25 July 2011"),
        ],
      ),
    ],
    citations: [
      cite(U.security435, "iOS 4.3.5 security content"),
      cite(U.security2011, "iOS 4.3.5 — 25 July 2011"),
    ],
    changes: [
      change({
        key: "ios-4-3-5-x509-chain-validation",
        title: "X.509 certificate-chain validation",
        canonicalSummary:
          "The update improved validation of X.509 certificate chains used in SSL/TLS and related trust decisions.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented possible capture or modification of protected-session data by an attacker with a privileged network position.",
        citations: [cite(U.security435, "Data Security — CVE-2011-0228")],
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
  provenanceStatus,
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
  provenanceStatus,
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
