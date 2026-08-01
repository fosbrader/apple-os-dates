import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

const out = path.resolve("scripts/research-batches/apple-ios-1.json");
const reviewedAt = "2026-07-30T05:55:48Z";

const U = {
  iphoneLaunch:
    "https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/",
  iphonePremiere:
    "https://www.apple.com/newsroom/2007/06/28iPhone-Premieres-This-Friday-Night-at-Apple-Retail-Stores/",
  webApps:
    "https://www.apple.com/newsroom/2007/06/11iPhone-to-Support-Third-Party-Web-2-0-Applications/",
  youtube:
    "https://www.apple.com/newsroom/2007/06/20YouTube-Live-on-Apple-TV-Today-Coming-to-iPhone-on-June-29/",
  securityIndex2007: "https://support.apple.com/en-us/104190",
  security101: "https://support.apple.com/en-us/102579",
  macrumors102:
    "https://www.macrumors.com/2007/08/21/apple-releases-iphone-1-0-2-update/",
  ipodLaunch:
    "https://www.apple.com/newsroom/2007/09/05Apple-Unveils-iPod-touch/",
  ipodRetail:
    "https://techcrunch.com/2007/09/14/lookin-for-some-ipod-touch-best-buy-just-got-them/",
  wifiStore:
    "https://www.apple.com/newsroom/2007/09/05Apple-Unveils-the-iTunes-Wi-Fi-Music-Store/",
  security111: "https://support.apple.com/en-us/101680",
  macrumors111:
    "https://www.macrumors.com/2007/09/27/apple-releases-iphone-1-1-1-update/",
  security112: "https://support.apple.com/en-us/102687",
  macworld112: "https://www.macworld.com/article/188116/iphoneupdate-5.html",
  macrumors112:
    "https://www.macrumors.com/2007/11/12/iphone-1-1-2-firmware-officially-released-in-u-s/",
  securityIndex2008: "https://support.apple.com/en-us/104189",
  update113:
    "https://www.apple.com/newsroom/2008/01/15Apple-Enhances-Revolutionary-iPhone-with-Software-Update/",
  ipodUpdate113:
    "https://www.apple.com/newsroom/2008/01/15Apple-Announces-Major-Software-Upgrade-for-iPod-touch/",
  archivedSecurity113:
    "https://web.archive.org/web/20080117062508/http://docs.info.apple.com/article.html?artnum=307302",
  appleInsider114:
    "https://appleinsider.com/articles/08/02/26/apple_releases_iphone_software_version_1_1_4",
  macrumors115:
    "https://www.macrumors.com/2008/07/15/apple-releases-ipod-touch-1-1-5-firmware/",
};

const sources = [
  {
    url: U.iphoneLaunch,
    title: "Apple Reinvents the Phone with iPhone",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2007-01-09T00:00:00Z",
    topics: ["iPhone", "1.0", "launch", "features"],
  },
  {
    url: U.iphonePremiere,
    title: "iPhone Premieres This Friday Night at Apple Retail Stores",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2007-06-28T00:00:00Z",
    topics: ["iPhone", "1.0", "availability"],
  },
  {
    url: U.webApps,
    title: "iPhone to Support Third-Party Web 2.0 Applications",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2007-06-11T00:00:00Z",
    topics: ["iPhone", "1.0", "web applications", "developers"],
  },
  {
    url: U.youtube,
    title: "YouTube Live on Apple TV Today; Coming to iPhone on June 29",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2007-06-20T00:00:00Z",
    topics: ["iPhone", "1.0", "YouTube", "video"],
  },
  {
    url: U.securityIndex2007,
    title: "Apple security updates (25-Jan-2005 to 21-Dec-2007)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2007", "security release index"],
  },
  {
    url: U.security101,
    title: "About the security content of iPhone v1.0.1 Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPhone", "1.0.1", "security"],
  },
  {
    url: U.macrumors102,
    title: "Apple Releases iPhone 1.0.2 Update",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2007-08-21T21:56:00Z",
    topics: ["iPhone", "1.0.2", "release notice"],
  },
  {
    url: U.ipodLaunch,
    title: "Apple Unveils iPod touch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2007-09-05T00:00:00Z",
    topics: ["iPod touch", "1.1", "launch", "features"],
  },
  {
    url: U.ipodRetail,
    title: "Lookin’ For Some (iPod) Touch? Best Buy Just Got Them",
    publisher: "TechCrunch",
    sourceClass: "journalism",
    author: "Contributor",
    publishedAt: "2007-09-15T01:33:42Z",
    topics: ["iPod touch", "1.1", "retail availability"],
  },
  {
    url: U.wifiStore,
    title: "Apple Unveils the iTunes Wi-Fi Music Store",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2007-09-05T00:00:00Z",
    topics: ["iPhone", "iPod touch", "1.1", "1.1.1", "iTunes Store"],
  },
  {
    url: U.security111,
    title: "About the security content of the iPhone 1.1.1 Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPhone", "1.1.1", "security"],
  },
  {
    url: U.macrumors111,
    title: "Apple Releases iPhone 1.1.1 Update",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2007-09-27T17:59:00Z",
    topics: ["iPhone", "1.1.1", "release notes", "features"],
  },
  {
    url: U.security112,
    title:
      "About the security content of iPhone v1.1.2 and iPod touch v1.1.2 Updates",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["iPhone", "iPod touch", "1.1.2", "security"],
  },
  {
    url: U.macworld112,
    title: "Apple releases iPhone update 1.1.2",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Jim Dalrymple and Robert McMillan",
    publishedAt: "2007-11-12T00:00:00Z",
    topics: ["iPhone", "1.1.2", "release notes", "international support"],
  },
  {
    url: U.macrumors112,
    title: "iPhone/iPod touch 1.1.2 Firmware Officially Released in U.S.",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2007-11-12T22:22:00Z",
    topics: ["iPhone", "iPod touch", "1.1.2", "release notice"],
  },
  {
    url: U.securityIndex2008,
    title: "Apple security updates (15-Jan-2008 to 03-Dec-2009)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2008", "2009", "security release index"],
  },
  {
    url: U.update113,
    title: "Apple Enhances Revolutionary iPhone with Software Update",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2008-01-15T00:00:00Z",
    topics: ["iPhone", "1.1.3", "features", "availability"],
  },
  {
    url: U.ipodUpdate113,
    title: "Apple Announces Major Software Upgrade for iPod touch",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2008-01-15T00:00:00Z",
    topics: ["iPod touch", "1.1.3", "applications", "features"],
  },
  {
    url: U.archivedSecurity113,
    title:
      "Archived Apple Support: About the security content of iPhone v1.1.3 and iPod touch v1.1.3",
    publisher: "Apple Support via Internet Archive",
    sourceClass: "archive",
    publishedAt: "2008-01-15T00:00:00Z",
    topics: ["iPhone", "iPod touch", "1.1.3", "security", "archive"],
  },
  {
    url: U.appleInsider114,
    title: "Apple releases software v1.1.4 for iPhone and iPod touch",
    publisher: "AppleInsider",
    sourceClass: "journalism",
    author: "AppleInsider Staff",
    publishedAt: "2008-02-26T18:00:00Z",
    topics: ["iPhone", "iPod touch", "1.1.4", "release notice"],
  },
  {
    url: U.macrumors115,
    title: "Apple Releases iPod Touch 1.1.5 Firmware",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Arnold Kim",
    publishedAt: "2008-07-15T16:28:00Z",
    topics: ["iPod touch", "1.1.5", "release notice"],
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
  verificationMethod,
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
  ...(verificationMethod ? { verificationMethod } : {}),
  citations,
});

const review = { status: "approved", reviewedAt };

const releases = [
  {
    version: "1.0",
    releaseNotesUrl: U.iphoneLaunch,
    summary:
      "The first public iPhone software release combined phone, widescreen media, and desktop-style internet functions behind a Multi-Touch interface, establishing the application model and interaction patterns that began Apple’s mobile software history.",
    blocks: [
      block(
        "Apple’s original iPhone software centered a finger-driven Multi-Touch interface instead of a fixed hardware keyboard. It combined calling, Visual Voicemail, SMS, calendar and contact synchronization, a camera and photo library, and widescreen music and video playback with Cover Flow.",
        [
          cite(
            U.iphoneLaunch,
            "Mobile phone, widescreen iPod, Multi-Touch, messaging, calendar, camera, and media sections",
          ),
        ],
      ),
      block(
        "Its internet layer included rich HTML Mail, Safari over Wi-Fi or EDGE, Google Maps, a dedicated YouTube client, and access to third-party services through standards-based web applications rather than native third-party installation. Apple’s retail announcement fixes the US public launch to June 29, 2007.",
        [
          cite(
            U.iphoneLaunch,
            "Internet communications and advanced sensors sections",
          ),
          cite(U.youtube, "iPhone availability and YouTube application"),
          cite(U.webApps, "Web 2.0 application model"),
          cite(U.iphonePremiere, "June 29 retail availability"),
        ],
      ),
    ],
    citations: [
      cite(U.iphoneLaunch, "Original iPhone software feature overview"),
      cite(U.iphonePremiere, "June 29, 2007 public availability"),
      cite(U.youtube, "Built-in YouTube application at launch"),
      cite(U.webApps, "Third-party web-application support at launch"),
    ],
    changes: [
      change({
        key: "ios-1-0-multitouch-interface",
        title: "Multi-Touch software interface",
        canonicalSummary:
          "The first release introduced a finger-operated Multi-Touch interface built around tapping, flicking, pinching, and context-specific software controls.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple treated the large touch display and software-defined controls as the common interaction layer across phone, media, and internet applications.",
        citations: [
          cite(U.iphoneLaunch, "Introduction and Multi-Touch interface"),
          cite(U.iphonePremiere, "Multi-Touch gestures at public launch"),
        ],
      }),
      change({
        key: "ios-1-0-phone-contacts-conference",
        title: "Integrated calling and contacts",
        canonicalSummary:
          "The software connected contact lists, favorites, call history, and multi-party calling in one touch-driven Phone application.",
        category: "feature",
        action: "introduced",
        summary:
          "Contacts could synchronize from a computer or supported internet service, while favorites and conference-call controls shortened common calling workflows.",
        citations: [cite(U.iphoneLaunch, "Revolutionary Mobile Phone section")],
      }),
      change({
        key: "ios-1-0-visual-voicemail",
        title: "Visual Voicemail",
        canonicalSummary:
          "Visual Voicemail presented messages as a selectable list so callers could choose playback order without traversing earlier messages.",
        category: "feature",
        action: "introduced",
        summary:
          "The feature depended on participating carrier support and was introduced as part of the original Phone experience.",
        citations: [
          cite(U.iphoneLaunch, "Visual Voicemail"),
          cite(U.iphonePremiere, "Phone feature overview"),
        ],
      }),
      change({
        key: "ios-1-0-sms-keyboard",
        title: "SMS and predictive software keyboard",
        canonicalSummary:
          "The release paired threaded SMS sessions with a full on-screen QWERTY keyboard that predicted and corrected typing.",
        category: "feature",
        action: "introduced",
        summary:
          "The keyboard appeared when needed instead of occupying permanent hardware space, establishing a reusable text-entry surface across applications.",
        citations: [
          cite(U.iphoneLaunch, "SMS application and software keyboard"),
        ],
      }),
      change({
        key: "ios-1-0-calendar-contact-sync",
        title: "Calendar and personal-data synchronization",
        canonicalSummary:
          "The original software synchronized calendars, contacts, mail settings, bookmarks, and media with a Mac or PC through iTunes.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple described computer synchronization as the setup and data-transfer model for the first iPhone generation.",
        citations: [
          cite(
            U.iphoneLaunch,
            "Contacts, calendar, Safari bookmarks, and iTunes synchronization",
          ),
          cite(U.iphonePremiere, "PC and Mac compatibility"),
        ],
      }),
      change({
        key: "ios-1-0-camera-photos",
        title: "Camera and touch-based photo library",
        canonicalSummary:
          "The release integrated camera capture with a photo library supporting flick navigation, landscape viewing, wallpaper selection, and email sharing.",
        category: "feature",
        action: "introduced",
        summary:
          "The software also synchronized photo collections from a computer and used device rotation to adapt presentation.",
        citations: [
          cite(U.iphoneLaunch, "Camera, photo management, and sensors"),
        ],
      }),
      change({
        key: "ios-1-0-widescreen-ipod-cover-flow",
        title: "Widescreen iPod and Cover Flow",
        canonicalSummary:
          "The built-in iPod experience combined touch navigation, landscape Cover Flow, and playback of synchronized music, podcasts, television, and movies.",
        category: "feature",
        action: "introduced",
        summary:
          "Media controls changed with context, and rotating the device exposed album artwork browsing in Cover Flow.",
        citations: [cite(U.iphoneLaunch, "Widescreen iPod and media sections")],
      }),
      change({
        key: "ios-1-0-html-mail",
        title: "Rich HTML Mail",
        canonicalSummary:
          "Mail displayed formatted messages with images and supported common POP3 and IMAP services, including background retrieval.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple also promoted simplified setup for supported services and push delivery through Yahoo Mail.",
        citations: [
          cite(U.iphoneLaunch, "Internet Communications Device — Mail"),
        ],
      }),
      change({
        key: "ios-1-0-mobile-safari",
        title: "Mobile Safari",
        canonicalSummary:
          "Safari brought full-page web rendering, touch zoom, integrated search, and bookmark synchronization to the original iPhone.",
        category: "feature",
        action: "introduced",
        summary:
          "Browsing operated over Wi-Fi or EDGE and presented desktop-layout pages through touch navigation.",
        citations: [
          cite(U.iphoneLaunch, "Internet Communications Device — Safari"),
        ],
      }),
      change({
        key: "ios-1-0-google-maps",
        title: "Google Maps",
        canonicalSummary:
          "The first release included maps, satellite imagery, traffic information, directions, and local search in a touch-oriented Maps application.",
        category: "feature",
        action: "introduced",
        summary:
          "This initial implementation predated the automatic positioning enhancements that arrived in version 1.1.3.",
        citations: [
          cite(U.iphoneLaunch, "Internet Communications Device — Maps"),
        ],
      }),
      change({
        key: "ios-1-0-sensor-aware-interface",
        title: "Sensor-aware interface behavior",
        canonicalSummary:
          "System software used the accelerometer, proximity sensor, and ambient-light sensor to rotate content, suppress accidental touches, and adjust brightness.",
        category: "behavior",
        action: "introduced",
        summary:
          "These behaviors were tied to the original iPhone hardware and should not be read as general support for later device families.",
        citations: [cite(U.iphoneLaunch, "Advanced Sensors section")],
      }),
      change({
        key: "ios-1-0-youtube-application",
        title: "Built-in YouTube application",
        canonicalSummary:
          "The shipping release included an Apple-designed YouTube client for browsing, searching, and streaming H.264 video over Wi-Fi or EDGE.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple announced the application specifically for the June 29 launch software and described the catalog as expanding during 2007.",
        citations: [
          cite(
            U.youtube,
            "iPhone YouTube application and June 29 availability",
          ),
        ],
      }),
      change({
        key: "ios-1-0-third-party-web-apps",
        title: "Standards-based third-party web applications",
        canonicalSummary:
          "Apple’s initial third-party application path used browser-delivered software built with web standards instead of installable native packages.",
        category: "developerApi",
        action: "introduced",
        summary:
          "Apple said web applications could invoke supported iPhone services such as calls, email, and map locations while remaining hosted and updated on the developer’s server.",
        citations: [
          cite(U.webApps, "Web 2.0 application model and supported services"),
        ],
      }),
    ],
  },
  {
    version: "1.0.1",
    releaseNotesUrl: U.security101,
    summary:
      "iPhone software 1.0.1 was the platform’s first public maintenance update, correcting five documented Safari, WebCore, and WebKit security weaknesses.",
    blocks: [
      block(
        "Apple’s first iPhone update focused on web-content security. It corrected cross-site access through redirected windows, unsafe regular-expression processing, injected XMLHttpRequest headers, deceptive internationalized domain names, and memory corruption while rendering framesets.",
        [cite(U.security101, "iPhone v1.0.1 security content")],
      ),
      block(
        "Apple distributed the package only through iTunes and identified the resulting version as 1.0.1. Its historical security index dates the release to July 31, 2007; no broader consumer feature list survives in Apple’s bulletin.",
        [
          cite(U.security101, "Installation note and version verification"),
          cite(U.securityIndex2007, "iPhone v1.0.1 Update — 31 July 2007"),
        ],
      ),
    ],
    citations: [
      cite(U.security101, "Complete iPhone v1.0.1 security bulletin"),
      cite(U.securityIndex2007, "iPhone v1.0.1 release date"),
    ],
    changes: [
      change({
        key: "ios-1-0-1-safari-window-access",
        title: "Safari redirected-window access control",
        canonicalSummary:
          "Safari corrected a race condition that could let script on one page read or modify a redirected page outside its domain.",
        category: "security",
        action: "fixed",
        summary:
          "The correction tightened access to window properties during page updates and HTTP redirection.",
        citations: [cite(U.security101, "Safari — CVE-2007-2400")],
      }),
      change({
        key: "ios-1-0-1-regex-validation",
        title: "JavaScript regular-expression validation",
        canonicalSummary:
          "The update added validation around regular expressions to prevent heap buffer overflows in the JavaScript engine’s PCRE library.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented malicious web content as a route to a crash or arbitrary code execution.",
        citations: [cite(U.security101, "Safari — CVE-2007-3944")],
      }),
      change({
        key: "ios-1-0-1-xmlhttprequest-headers",
        title: "XMLHttpRequest header validation",
        canonicalSummary:
          "WebCore began validating serialized XMLHttpRequest header parameters to prevent cross-site request injection.",
        category: "security",
        action: "fixed",
        summary:
          "The weakness could be triggered by a malicious page crafting invalid HTTP request headers.",
        citations: [cite(U.security101, "WebCore — CVE-2007-2401")],
      }),
      change({
        key: "ios-1-0-1-idn-domain-validation",
        title: "Internationalized domain-name validation",
        canonicalSummary:
          "WebKit improved domain-name validity checks to reduce spoofing with visually similar Unicode characters.",
        category: "security",
        action: "fixed",
        summary:
          "Apple described the issue as a way for a malicious site to resemble a legitimate domain in Safari.",
        citations: [cite(U.security101, "WebKit — CVE-2007-3742")],
      }),
      change({
        key: "ios-1-0-1-frameset-memory-safety",
        title: "Frameset rendering memory safety",
        canonicalSummary:
          "The release corrected an invalid type conversion in frameset rendering that could corrupt memory.",
        category: "security",
        action: "fixed",
        summary:
          "A maliciously constructed page could otherwise terminate the browser or execute arbitrary code.",
        citations: [cite(U.security101, "WebKit — CVE-2007-2399")],
      }),
    ],
  },
  {
    version: "1.0.2",
    releaseNotesUrl: U.macrumors102,
    summary:
      "iPhone software 1.0.2 was a narrowly documented maintenance release whose surviving public description identifies bug fixes but no individual corrected component.",
    blocks: [
      block(
        "A contemporaneous MacRumors report records Apple releasing iPhone update 1.0.2 through iTunes on August 21, 2007. The update’s published description was limited to bug fixes, with no itemized list.",
        [cite(U.macrumors102, "Release date, distribution, and description")],
      ),
      block(
        "Because Apple’s surviving 2007 security chronology jumps from 1.0.1 to 1.1.1, this article does not infer a security advisory or convert early user observations into confirmed changes.",
        [
          cite(
            U.securityIndex2007,
            "2007 iPhone entries: 1.0.1, 1.1.1, and 1.1.2",
          ),
          cite(U.macrumors102, "Early reports and lack of noted features"),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors102, "August 21 release and generic bug-fix notice"),
      cite(U.securityIndex2007, "2007 iPhone security chronology"),
    ],
    changes: [
      change({
        key: "ios-1-0-2-generic-maintenance",
        title: "General bug-fix maintenance",
        canonicalSummary:
          "The update delivered unspecified bug fixes without a surviving component-level changelog.",
        category: "bugFix",
        action: "fixed",
        summary:
          "No individual behavior is assigned to this occurrence because the preserved public description is generic.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        verificationMethod:
          "A contemporaneous release report preserves Apple’s generic update description; component-level claims were deliberately excluded.",
        citations: [
          cite(U.macrumors102, "Complete published update description"),
        ],
      }),
    ],
  },
  {
    version: "1.1",
    releaseNotesUrl: U.ipodLaunch,
    summary:
      "Version 1.1 was the initial software release for the first-generation iPod touch, adapting Apple’s Multi-Touch media and internet environment to a Wi-Fi device without iPhone telephony.",
    blocks: [
      block(
        "Apple introduced iPod touch with a Multi-Touch interface, widescreen music and video playback, Cover Flow, photos, Safari, YouTube, and the iTunes Wi-Fi Music Store. Wi-Fi networking supplied its internet connection; this 1.1 branch was not an iPhone update.",
        [
          cite(U.ipodLaunch, "iPod touch feature overview"),
          cite(U.wifiStore, "iTunes Wi-Fi Music Store device support"),
        ],
      ),
      block(
        "Apple’s announcement said the device would arrive later in September rather than naming a day. A contemporaneous TechCrunch report documents retail stock appearing on September 14, which matches the local Public milestone; that exact date therefore rests on observed availability, not a surviving Apple release-day statement.",
        [
          cite(U.ipodLaunch, "Pricing and availability"),
          cite(U.ipodRetail, "September 14 retail availability"),
        ],
      ),
    ],
    citations: [
      cite(U.ipodLaunch, "Initial iPod touch software and availability window"),
      cite(U.ipodRetail, "Observed September 14 retail availability"),
      cite(U.wifiStore, "iTunes Wi-Fi Music Store capabilities"),
    ],
    changes: [
      change({
        key: "ios-1-1-ipod-touch-platform",
        title: "Initial iPod touch software",
        canonicalSummary:
          "Version 1.1 brought Apple’s Multi-Touch mobile software environment to the first-generation iPod touch.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The device shared interaction and media concepts with iPhone while omitting cellular calling and relying on Wi-Fi for network functions.",
        citations: [
          cite(U.ipodLaunch, "Initial iPod touch introduction"),
          cite(U.ipodRetail, "Retail availability on September 14"),
        ],
      }),
      change({
        key: "ios-1-1-itunes-wifi-store",
        title: "iTunes Wi-Fi Music Store on iPod touch",
        canonicalSummary:
          "The initial iPod touch software let users browse, preview, purchase, and download music directly over Wi-Fi.",
        category: "feature",
        action: "introduced",
        summary:
          "Purchased music synchronized back to the computer’s iTunes library on the next connection.",
        citations: [
          cite(U.ipodLaunch, "iTunes Wi-Fi Music Store"),
          cite(U.wifiStore, "Wireless purchase and synchronization behavior"),
        ],
      }),
      change({
        key: "ios-1-1-ipod-touch-safari-youtube",
        title: "Safari and YouTube over Wi-Fi",
        canonicalSummary:
          "iPod touch launched with Safari web browsing and a dedicated YouTube application using its built-in Wi-Fi connection.",
        category: "feature",
        action: "introduced",
        summary:
          "Safari included integrated search and touch zoom, while YouTube exposed browsing and search for available video.",
        citations: [cite(U.ipodLaunch, "Safari and YouTube applications")],
      }),
      change({
        key: "ios-1-1-ipod-touch-media-cover-flow",
        title: "Widescreen media and Cover Flow",
        canonicalSummary:
          "The software presented music, television, movies, photos, and album artwork through a widescreen touch interface with Cover Flow.",
        category: "feature",
        action: "introduced",
        summary:
          "Rotating the device changed supported media and browser views to landscape orientation.",
        citations: [
          cite(U.ipodLaunch, "Widescreen display, media, and Cover Flow"),
        ],
      }),
      change({
        key: "ios-1-1-ipod-touch-orientation-brightness",
        title: "Orientation and ambient-light behavior",
        canonicalSummary:
          "iPod touch software used its accelerometer for landscape presentation and its ambient-light sensor for automatic display brightness.",
        category: "behavior",
        action: "introduced",
        summary:
          "The behavior applied to the first-generation iPod touch hardware and supported Photos, Safari, and Cover Flow presentation.",
        citations: [
          cite(U.ipodLaunch, "Accelerometer and ambient-light sensor"),
        ],
      }),
    ],
  },
  {
    version: "1.1.1",
    releaseNotesUrl: U.security111,
    summary:
      "Version 1.1.1 brought the iTunes Wi-Fi Music Store and a broad set of interaction refinements to iPhone while repairing Bluetooth, Mail, telephone-link, and Safari security weaknesses.",
    blocks: [
      block(
        "The consumer update added direct Wi-Fi music purchases plus refinements to volume, Home-button shortcuts, keyboard punctuation, attachment rotation, Stocks and Weather ordering, Bluetooth headset status, TV output, roaming controls, passcode timing, and alert volume. Apple announced the store in advance; a contemporaneous report preserves the wider feature list shown on Apple’s update site.",
        [
          cite(U.wifiStore, "iPhone and iPod touch store announcement"),
          cite(U.macrumors111, "Preserved September 2007 feature list"),
        ],
      ),
      block(
        "Apple’s security bulletin documents protections against malformed Bluetooth packets, untrusted mail servers, unsafe telephone links, and several cross-origin or scripting failures in Safari. Apple’s historical index and the contemporaneous release report both date the update to September 27, 2007.",
        [
          cite(U.security111, "Complete iPhone v1.1.1 security content"),
          cite(U.securityIndex2007, "iPhone 1.1.1 Update — 27 September 2007"),
          cite(U.macrumors111, "September 27 release"),
        ],
      ),
    ],
    citations: [
      cite(U.wifiStore, "iTunes Wi-Fi Music Store announcement"),
      cite(U.macrumors111, "Release date and preserved feature list"),
      cite(U.security111, "Complete security bulletin"),
      cite(U.securityIndex2007, "Release chronology"),
    ],
    changes: [
      change({
        key: "ios-1-1-1-itunes-wifi-store",
        title: "iTunes Wi-Fi Music Store on iPhone",
        canonicalSummary:
          "The update added browsing, previewing, purchasing, and downloading iTunes music directly over Wi-Fi.",
        category: "feature",
        action: "introduced",
        summary:
          "Songs obtained on the phone synchronized back to the computer’s iTunes library.",
        citations: [
          cite(U.wifiStore, "iPhone store support and synchronization"),
          cite(U.macrumors111, "iTunes Wi-Fi Music Store feature"),
        ],
      }),
      change({
        key: "ios-1-1-1-call-audio-volume",
        title: "Receiver and speakerphone volume",
        canonicalSummary:
          "The update increased the available volume for the phone receiver and speakerphone.",
        category: "enhancement",
        action: "changed",
        summary:
          "The surviving consumer list presents this as a general audio-level improvement rather than a hardware-specific repair.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [
          cite(U.macrumors111, "Louder speakerphone and receiver volume"),
        ],
      }),
      change({
        key: "ios-1-1-1-home-double-click",
        title: "Home-button double-click shortcut",
        canonicalSummary:
          "A double press of the Home button could open phone favorites or music controls.",
        category: "feature",
        action: "introduced",
        summary:
          "The shortcut provided quicker access to a user-selected high-frequency destination.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [cite(U.macrumors111, "Home button double-click shortcut")],
      }),
      change({
        key: "ios-1-1-1-double-space-period",
        title: "Double-space punctuation shortcut",
        canonicalSummary:
          "The software keyboard gained an optional double-space shortcut that inserted a period followed by a space.",
        category: "enhancement",
        action: "introduced",
        summary:
          "The feature shortened sentence punctuation on the touch keyboard and could be controlled from settings.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [cite(U.macrumors111, "Space-bar double-tap shortcut")],
      }),
      change({
        key: "ios-1-1-1-mail-attachment-orientation",
        title: "Mail attachment rotation",
        canonicalSummary:
          "Mail attachments could be viewed in both portrait and landscape orientation.",
        category: "enhancement",
        action: "introduced",
        summary:
          "The change extended orientation-aware viewing beyond the original attachment presentation.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [
          cite(U.macrumors111, "Portrait and landscape Mail attachments"),
        ],
      }),
      change({
        key: "ios-1-1-1-stocks-weather-ordering",
        title: "Reordering in Stocks and Weather",
        canonicalSummary:
          "Users could reorder tracked stocks and saved cities in their respective applications.",
        category: "enhancement",
        action: "introduced",
        summary:
          "The update made the order of these user-maintained lists customizable.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [cite(U.macrumors111, "Stocks and Weather reordering")],
      }),
      change({
        key: "ios-1-1-1-headset-battery-status",
        title: "Apple Bluetooth Headset battery status",
        canonicalSummary:
          "The status bar could display the remaining battery level of Apple’s paired Bluetooth Headset.",
        category: "feature",
        action: "introduced",
        summary:
          "The indicator was accessory-specific and should not be generalized to all Bluetooth headsets.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [
          cite(U.macrumors111, "Apple Bluetooth Headset battery status"),
        ],
      }),
      change({
        key: "ios-1-1-1-tv-output",
        title: "Television output",
        canonicalSummary:
          "Version 1.1.1 added support for sending compatible iPhone media to an external television.",
        category: "compatibility",
        action: "introduced",
        summary:
          "The preserved feature list identifies TV output but does not enumerate supported cables or media formats.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [cite(U.macrumors111, "TV Out support")],
      }),
      change({
        key: "ios-1-1-1-data-roaming-toggle",
        title: "International data-roaming control",
        canonicalSummary:
          "A setting was added to disable EDGE or GPRS data use while roaming internationally.",
        category: "feature",
        action: "introduced",
        summary:
          "The control let travelers avoid unintended cellular-data use outside their home network.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [cite(U.macrumors111, "EDGE/GPRS roaming preference")],
      }),
      change({
        key: "ios-1-1-1-passcode-alert-settings",
        title: "Passcode timing and alert-volume settings",
        canonicalSummary:
          "The update expanded passcode-lock timing choices and added control over alert volume.",
        category: "enhancement",
        action: "introduced",
        summary:
          "These were user-facing configuration additions, separate from the security defects fixed in the same release.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        citations: [
          cite(U.macrumors111, "Passcode intervals and alert volume"),
        ],
      }),
      change({
        key: "ios-1-1-1-bluetooth-sdp-validation",
        title: "Bluetooth service-discovery validation",
        canonicalSummary:
          "The Bluetooth server added validation for crafted service-discovery packets that could crash software or execute code.",
        category: "security",
        action: "fixed",
        summary:
          "Apple limited the attack condition to an adversary within Bluetooth range while Bluetooth was enabled.",
        citations: [cite(U.security111, "Bluetooth — CVE-2007-3753")],
      }),
      change({
        key: "ios-1-1-1-mail-server-identity",
        title: "Mail server identity warnings",
        canonicalSummary:
          "Mail began warning when an SSL mail server’s identity changed or could not be trusted.",
        category: "security",
        action: "fixed",
        summary:
          "The correction reduced credential and information exposure to an interceptor on an untrusted network.",
        citations: [cite(U.security111, "Mail — CVE-2007-3754")],
      }),
      change({
        key: "ios-1-1-1-telephone-link-confirmation",
        title: "Telephone-link confirmation",
        canonicalSummary:
          "Mail and Safari tightened confirmation for telephone links so displayed and dialed numbers matched and calls were not placed unintentionally.",
        category: "security",
        action: "fixed",
        summary:
          "Apple documented separate Mail and Safari weaknesses and addressed both within the update.",
        citations: [
          cite(U.security111, "Mail — CVE-2007-3755"),
          cite(U.security111, "Safari — CVE-2007-3757"),
        ],
      }),
      change({
        key: "ios-1-1-1-safari-cross-origin-controls",
        title: "Safari cross-origin frame controls",
        canonicalSummary:
          "Safari strengthened cross-domain URL access, window-property controls, frame-source handling, and event association.",
        category: "security",
        action: "fixed",
        summary:
          "The grouped corrections covered URL disclosure and multiple cross-site scripting paths involving windows and frames.",
        citations: [
          cite(U.security111, "Safari — CVE-2007-3756"),
          cite(U.security111, "Safari — CVE-2007-3758"),
          cite(U.security111, "Safari — CVE-2007-3760"),
          cite(U.security111, "Safari — CVE-2007-3761"),
        ],
      }),
      change({
        key: "ios-1-1-1-javascript-preference",
        title: "Immediate JavaScript preference enforcement",
        canonicalSummary:
          "Safari applied a changed JavaScript preference before loading subsequent pages instead of waiting for an application restart.",
        category: "security",
        action: "fixed",
        summary:
          "This prevented the interface from indicating that scripting was disabled while it remained active.",
        citations: [cite(U.security111, "Safari — CVE-2007-3759")],
      }),
      change({
        key: "ios-1-1-1-http-https-frame-isolation",
        title: "HTTP and HTTPS frame isolation",
        canonicalSummary:
          "Safari restricted script access between insecure and secure frames served from the same domain.",
        category: "security",
        action: "fixed",
        summary:
          "The previous behavior could let HTTP content manipulate documents delivered over HTTPS.",
        citations: [cite(U.security111, "Safari — CVE-2007-4671")],
      }),
    ],
  },
  {
    version: "1.1.2",
    releaseNotesUrl: U.security112,
    summary:
      "Version 1.1.2 expanded international language and keyboard support, adjusted device information and ringtone organization, and closed the TIFF image vulnerability used by contemporary jailbreak tools.",
    blocks: [
      block(
        "Apple’s surviving security bulletin confirms a November 12 release for iPhone and iPod touch and documents stricter validation of TIFF images. Contemporary Macworld and MacRumors reports agree that the consumer update also brought French, German, Italian, and UK-oriented language or keyboard options.",
        [
          cite(
            U.security112,
            "Version, affected products, and TIFF correction",
          ),
          cite(U.securityIndex2007, "iPhone 1.1.2 — 12 November 2007"),
          cite(U.macworld112, "Languages and keyboard layouts"),
          cite(U.macrumors112, "International keyboards"),
        ],
      ),
      block(
        "Macworld additionally observed an iPhone battery indicator in iTunes and separate Custom and Standard ringtone groupings. Those two items are recorded as secondary-source observations rather than official Apple changelog claims; jailbreak consequences and unauthorized-tool instructions are outside this archive’s release-note scope.",
        [
          cite(U.macworld112, "Battery display and ringtone organization"),
          cite(U.macrumors112, "Official US availability"),
        ],
      ),
    ],
    citations: [
      cite(U.security112, "Complete 1.1.2 security bulletin"),
      cite(U.securityIndex2007, "November 12 release chronology"),
      cite(U.macworld112, "Consumer changes and Apple’s generic wording"),
      cite(U.macrumors112, "US iTunes availability and observed changes"),
    ],
    changes: [
      change({
        key: "ios-1-1-2-international-language-keyboards",
        title: "International languages and keyboards",
        canonicalSummary:
          "The update added French, German, and Italian interface options plus UK English and European keyboard layouts.",
        category: "compatibility",
        action: "introduced",
        summary:
          "Two contemporaneous reports independently identify the international options while Apple’s surviving security bulletin confirms the release itself.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "corroborated",
        citations: [
          cite(U.macworld112, "International language and keyboard options"),
          cite(U.macrumors112, "International keyboards"),
        ],
      }),
      change({
        key: "ios-1-1-2-itunes-battery-indicator",
        title: "iPhone battery level in iTunes",
        canonicalSummary:
          "When connected to a computer, iTunes displayed the iPhone’s battery charge beside the device.",
        category: "enhancement",
        action: "introduced",
        summary:
          "This is preserved as a contemporaneous Macworld observation because Apple’s surviving bulletin covers only security content.",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Contemporaneous product reporting documented the visible UI change; no stable first-party consumer changelog was located.",
        citations: [
          cite(U.macworld112, "iPhone battery charge shown in iTunes"),
        ],
      }),
      change({
        key: "ios-1-1-2-ringtone-categories",
        title: "Standard and custom ringtone categories",
        canonicalSummary:
          "The ringtone list separated built-in tones from user-added or application-provided custom tones.",
        category: "enhancement",
        action: "changed",
        summary:
          "The categorization is a contemporaneous observed change rather than an item from Apple’s surviving security document.",
        documentedStatus: "undocumented",
        evidenceState: "reported",
        verificationMethod:
          "Contemporaneous product reporting documented the visible organization change; no stable first-party consumer changelog was located.",
        citations: [
          cite(U.macworld112, "Standard and Custom ringtone sections"),
        ],
      }),
      change({
        key: "ios-1-1-2-tiff-validation",
        title: "TIFF image validation",
        canonicalSummary:
          "ImageIO added validation for malformed TIFF images that could trigger buffer overflows, crashes, or arbitrary code execution.",
        category: "security",
        action: "fixed",
        summary:
          "Apple’s bulletin identifies four CVEs in the bundled TIFF library and applies the correction to both iPhone and iPod touch.",
        citations: [
          cite(
            U.security112,
            "ImageIO — CVE-2006-3459, CVE-2006-3461, CVE-2006-3462, and CVE-2006-3465",
          ),
        ],
      }),
    ],
  },
  {
    version: "1.1.3",
    releaseNotesUrl: U.update113,
    summary:
      "Version 1.1.3 substantially expanded Maps, Home-screen customization, messaging, and movie playback, added five core applications to eligible iPod touch devices, and repaired three documented security flaws.",
    blocks: [
      block(
        "On iPhone, Apple added automatic positioning from nearby Wi-Fi networks and cellular towers, a hybrid map view, Web Clips, reorderable icons and multiple Home screens, group SMS, and support for transferred iTunes Movie Rentals with chapter, language, and subtitle controls.",
        [
          cite(
            U.update113,
            "Maps, Web Clips, Home screen, SMS, and movie sections",
          ),
        ],
      ),
      block(
        "For iPod touch, Apple sold an upgrade that also added Mail, Maps, Stocks, Weather, and Notes; newly manufactured units included it. An archived Apple security bulletin documents validation for crafted URLs, stronger Passcode Lock state checks on iPhone, and stricter cross-frame navigation in Safari. Apple’s security index and both announcements date the release to January 15, 2008.",
        [
          cite(
            U.ipodUpdate113,
            "iPod touch applications, features, and pricing",
          ),
          cite(
            U.archivedSecurity113,
            "Foundation, Passcode Lock, and Safari security content",
          ),
          cite(
            U.securityIndex2008,
            "iPhone v1.1.3 and iPod touch v1.1.3 — 15 January 2008",
          ),
        ],
      ),
    ],
    citations: [
      cite(U.update113, "iPhone 1.1.3 features and availability"),
      cite(U.ipodUpdate113, "iPod touch 1.1.3 upgrade"),
      cite(U.archivedSecurity113, "Archived Apple security bulletin"),
      cite(U.securityIndex2008, "January 15 release chronology"),
    ],
    changes: [
      change({
        key: "ios-1-1-3-maps-positioning",
        title: "Automatic Maps positioning",
        canonicalSummary:
          "Maps could estimate the current location using nearby Wi-Fi access points and, on iPhone, cellular towers.",
        category: "feature",
        action: "introduced",
        summary:
          "The estimated position could seed directions or nearby-place searches; Apple cautioned that availability and precision varied by location.",
        citations: [
          cite(U.update113, "Automatic Maps location"),
          cite(U.ipodUpdate113, "Wi-Fi positioning on iPod touch"),
        ],
      }),
      change({
        key: "ios-1-1-3-hybrid-map-view",
        title: "Hybrid Maps view",
        canonicalSummary:
          "Maps gained a hybrid presentation that overlaid street and place labels on satellite imagery.",
        category: "feature",
        action: "introduced",
        summary:
          "The view combined information from the existing map and satellite modes in one display.",
        citations: [
          cite(U.update113, "Hybrid map view"),
          cite(U.ipodUpdate113, "Map, satellite, and hybrid views"),
        ],
      }),
      change({
        key: "ios-1-1-3-web-clips-home-screens",
        title: "Web Clips and customizable Home screens",
        canonicalSummary:
          "Users could save website locations as Home-screen icons, reorder icons, and create as many as nine Home-screen pages.",
        category: "feature",
        action: "introduced",
        summary:
          "A Web Clip could preserve the zoomed location within a page, turning frequently visited sites into launchable shortcuts.",
        citations: [
          cite(U.update113, "Web Clips and customizable Home screen"),
          cite(U.ipodUpdate113, "Web Clips and Home-screen customization"),
        ],
      }),
      change({
        key: "ios-1-1-3-group-sms",
        title: "Group SMS conversations",
        canonicalSummary:
          "Messages could send one SMS to multiple recipients and retain the group history for later reuse.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple described the stored thread as a shortcut for sending another message to the same group.",
        citations: [
          cite(U.update113, "Multiple-recipient SMS and group history"),
        ],
      }),
      change({
        key: "ios-1-1-3-movie-rentals-playback",
        title: "iTunes Movie Rentals playback",
        canonicalSummary:
          "The update played movie rentals transferred from a computer and added chapter navigation, alternate audio, and subtitle controls where available.",
        category: "feature",
        action: "introduced",
        summary:
          "Movie-rental availability was region-limited at launch, while the playback controls depended on the transferred title’s content.",
        citations: [
          cite(U.update113, "Movie Rentals and playback controls"),
          cite(U.ipodUpdate113, "Movie Rentals on iPod touch"),
        ],
      }),
      change({
        key: "ios-1-1-3-ipod-touch-core-apps",
        title: "Mail, Maps, Stocks, Weather, and Notes on iPod touch",
        canonicalSummary:
          "The iPod touch software upgrade added five Apple applications that had not shipped with early units.",
        category: "feature",
        action: "introduced",
        summary:
          "Existing owners purchased the package, while newly manufactured iPod touch units included the applications.",
        citations: [
          cite(U.ipodUpdate113, "Five added applications and upgrade terms"),
        ],
      }),
      change({
        key: "ios-1-1-3-ipod-touch-mail",
        title: "Rich Mail on iPod touch",
        canonicalSummary:
          "The iPod touch version of Mail supported formatted messages, background retrieval, and common POP3 and IMAP services.",
        category: "feature",
        action: "introduced",
        summary:
          "Apple specifically documented setup for Gmail, Yahoo Mail, .Mac Mail, and other standards-based services.",
        citations: [cite(U.ipodUpdate113, "Mail application")],
      }),
      change({
        key: "ios-1-1-3-foundation-url-validation",
        title: "Foundation URL validation",
        canonicalSummary:
          "The system added validation for crafted URLs that could corrupt memory and terminate an application or execute code.",
        category: "security",
        action: "fixed",
        summary:
          "Apple’s archived bulletin lists the issue as affecting earlier iPhone and iPod touch software through version 1.1.2.",
        citations: [cite(U.archivedSecurity113, "Foundation — CVE-2008-0035")],
      }),
      change({
        key: "ios-1-1-3-passcode-lock-state",
        title: "Passcode Lock state validation",
        canonicalSummary:
          "The iPhone update tightened emergency-call state checks to prevent physical-access bypass of Passcode Lock.",
        category: "security",
        action: "fixed",
        summary:
          "The issue was iPhone-specific because the bypass involved emergency calling from the locked device.",
        citations: [
          cite(U.archivedSecurity113, "Passcode Lock — CVE-2008-0034"),
        ],
      }),
      change({
        key: "ios-1-1-3-safari-frame-navigation",
        title: "Safari frame-navigation policy",
        canonicalSummary:
          "Safari adopted stricter subframe navigation rules to prevent cross-site scripting and disclosure of sensitive information.",
        category: "security",
        action: "fixed",
        summary:
          "The weakness allowed one page to navigate subframes belonging to another page.",
        citations: [cite(U.archivedSecurity113, "Safari — CVE-2007-5858")],
      }),
    ],
  },
  {
    version: "1.1.4",
    releaseNotesUrl: U.appleInsider114,
    summary:
      "Version 1.1.4 was a minimally documented iPhone and iPod touch maintenance release whose preserved official description names bug fixes without itemizing them.",
    blocks: [
      block(
        "AppleInsider’s contemporaneous release report says Apple shipped version 1.1.4 for iPhone and iPod touch on February 26, 2008 and that the associated notes contained only a generic bug-fix description.",
        [
          cite(
            U.appleInsider114,
            "Release date, products, and update description",
          ),
        ],
      ),
      block(
        "Apple’s 2008 security chronology does not list a separate 1.1.4 advisory. Consequently, this article records one broad maintenance occurrence and excludes early reports about messaging order, camera behavior, Bluetooth, unofficial applications, and speculative SDK support.",
        [
          cite(
            U.securityIndex2008,
            "2008 chronology between iPhone 1.1.3 and iPhone 2.0",
          ),
          cite(U.appleInsider114, "Complete preserved release description"),
        ],
      ),
    ],
    citations: [
      cite(U.appleInsider114, "February 26 release and generic bug-fix notes"),
      cite(U.securityIndex2008, "No separate 1.1.4 security advisory"),
    ],
    changes: [
      change({
        key: "ios-1-1-4-generic-maintenance",
        title: "General bug-fix maintenance",
        canonicalSummary:
          "The update delivered unspecified corrections for iPhone and iPod touch without a component-level public changelog.",
        category: "bugFix",
        action: "fixed",
        summary:
          "The record remains intentionally broad because the preserved official description did not identify individual fixes.",
        documentedStatus: "partiallyDocumented",
        evidenceState: "reported",
        verificationMethod:
          "A contemporaneous publication preserved Apple’s terse release-note wording; uncorroborated component claims were excluded.",
        citations: [
          cite(U.appleInsider114, "Complete release-note description"),
        ],
      }),
    ],
  },
  {
    version: "1.1.5",
    releaseNotesUrl: U.macrumors115,
    summary:
      "Version 1.1.5 was an iPod touch-only maintenance path for owners who remained on the 1.x software line instead of purchasing the newly released 2.0 upgrade.",
    blocks: [
      block(
        "A contemporaneous MacRumors report records Apple quietly making iPod touch firmware 1.1.5 available through iTunes on July 15, 2008. It was a no-cost path from 1.1.4 for owners who chose not to buy the 2.0 software upgrade.",
        [cite(U.macrumors115, "Release date, device scope, and upgrade path")],
      ),
      block(
        "No surviving Apple consumer changelog or security advisory itemizes the package. The same report says early users saw no new features and only suggested possible speed or stability improvements, so those tentative observations are not converted into structured release facts.",
        [
          cite(U.macrumors115, "Early reports and lack of visible features"),
          cite(
            U.securityIndex2008,
            "2008 chronology around iPhone 2.0; no 1.1.5 entry",
          ),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors115, "July 15 iPod touch release and 1.x upgrade path"),
      cite(U.securityIndex2008, "No separate 1.1.5 security advisory"),
    ],
    changes: [
      change({
        key: "ios-1-1-5-ipod-touch-maintenance-path",
        title: "iPod touch 1.x maintenance path",
        canonicalSummary:
          "The release provided a free iPod touch update path for owners remaining on version 1.x after the paid 2.0 upgrade appeared.",
        category: "compatibility",
        action: "changed",
        summary:
          "No specific feature, bug, or security correction is asserted because the surviving report describes only the package’s availability and positioning.",
        documentedStatus: "unknown",
        evidenceState: "reported",
        verificationMethod:
          "A contemporaneous report documents the release and upgrade path; tentative performance observations were deliberately excluded.",
        citations: [cite(U.macrumors115, "Free 1.1.4-to-1.1.5 update path")],
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
