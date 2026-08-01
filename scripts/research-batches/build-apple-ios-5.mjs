import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const U = {
  consumer: "https://support.apple.com/en-us/102998",
  securityIndex: "https://support.apple.com/en-us/101444",
  security5: "https://support.apple.com/en-us/103815",
  security501: "https://support.apple.com/en-us/103595",
  security51: "https://support.apple.com/en-us/103596",
  security511: "https://support.apple.com/en-us/103597",
  newsroomPreview:
    "https://www.apple.com/newsroom/2011/06/06New-Version-of-iOS-Includes-Notification-Center-iMessage-Newsstand-Twitter-Integration-Among-200-New-Features/",
  newsroomCloud:
    "https://www.apple.com/newsroom/2011/10/04Apple-to-Launch-iCloud-on-October-12/",
  developer: "https://developer.apple.com/news/?id=06062011a",
  tls: "https://developer.apple.com/library/archive/technotes/tn2287/_index.html",
};

const sources = [
  {
    url: U.consumer,
    title: "About iOS 5",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-15T00:00:00.000Z",
    topics: ["iOS", "5", "consumer release notes"],
  },
  {
    url: U.securityIndex,
    title: "Apple security updates (2011 to 2012)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-08-10T00:00:00.000Z",
    topics: ["Apple software", "2011", "2012", "security release index"],
  },
  {
    url: U.security5,
    title: "About the security content of iOS 5 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-06T00:00:00.000Z",
    topics: ["iOS", "5.0", "security", "CVE"],
  },
  {
    url: U.security501,
    title: "About the security content of iOS 5.0.1 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-03T00:00:00.000Z",
    topics: ["iOS", "5.0.1", "security", "CVE"],
  },
  {
    url: U.security51,
    title: "About the security content of iOS 5.1 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-03T00:00:00.000Z",
    topics: ["iOS", "5.1", "security", "CVE"],
  },
  {
    url: U.security511,
    title: "About the security content of iOS 5.1.1 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    author: "Apple",
    publishedAt: "2023-11-03T00:00:00.000Z",
    topics: ["iOS", "5.1.1", "security", "CVE"],
  },
  {
    url: U.newsroomPreview,
    title:
      "New Version of iOS Includes Notification Center, iMessage, Newsstand, Twitter Integration Among 200 New Features",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-06-06T00:00:00.000Z",
    topics: ["iOS", "5.0", "features", "availability"],
  },
  {
    url: U.newsroomCloud,
    title: "Apple to Launch iCloud on October 12",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    author: "Apple",
    publishedAt: "2011-10-04T00:00:00.000Z",
    topics: ["iOS", "5.0", "iCloud", "public availability"],
  },
  {
    url: U.developer,
    title: "Download iOS 5 and iOS 5 SDK Beta Today",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2011-06-06T00:00:00.000Z",
    topics: ["iOS", "5.0", "SDK", "developer APIs"],
  },
  {
    url: U.tls,
    title: "iOS 5 and TLS 1.2 Interoperability Issues",
    publisher: "Apple Developer",
    sourceClass: "developerDocs",
    author: "Apple",
    publishedAt: "2011-10-14T00:00:00.000Z",
    topics: ["iOS", "5.0", "TLS 1.2", "networking"],
  },
];

const c = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});

const prose = (text, citations) => ({ text, citations });
const reviewedAt = "2026-07-30T04:59:01Z";
const review = () => ({ status: "approved", reviewedAt });
const provenanceStatus = "editoriallyVerified";

function version(releaseVersionId, blocks, citations) {
  return {
    releaseVersionId,
    authorship: "originalSynthesis",
    releaseNotesUrl: U.consumer,
    overview: {
      authorship: "originalSynthesis",
      blocks,
    },
    citations,
    provenanceStatus,
    editorialReview: review(),
  };
}

function change(
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  citations,
) {
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
      "Matched to Apple’s version-specific consumer notes, security advisory, announcement, or developer documentation for this release.",
    citations,
  };
}

function event(releaseVersionId, summary, citations, changes) {
  return {
    target: { releaseVersionId, routeAlias: "public" },
    authorship: "originalSynthesis",
    summary,
    citations,
    changes,
    provenanceStatus,
    editorialReview: review(),
    isIndexable: true,
  };
}

const versions = [
  version(
    "version-ios-5-0",
    [
      prose(
        "iOS 5 reorganized daily interaction around Notification Center, iMessage, Newsstand, Reminders, system-level Twitter support, richer Camera and Photos tools, and broader Mail, Calendar, Game Center, keyboard, and accessibility features.",
        [
          c(
            U.consumer,
            "iOS 5 — Notifications through Accessibility improvements",
          ),
          c(
            U.newsroomPreview,
            "Notification Center, iMessage, Newsstand, Reminders, Twitter, Camera, Photos, Mail, Game Center, AirPlay, and split keyboard",
          ),
        ],
      ),
      prose(
        "The release also moved setup, software updating, and iTunes synchronization away from a required cable, integrated iCloud services, exposed more than 1,500 developer APIs, and delivered security work spanning credentials, certificate trust, TLS, documents, networking, Safari, and WebKit.",
        [
          c(
            U.consumer,
            "iOS 5 — PC Free, iCloud support, wireless sync, and developer APIs",
          ),
          c(U.newsroomCloud, "October 12 availability and iCloud services"),
          c(U.developer, "More than 1,500 APIs and principal SDK technologies"),
          c(U.security5, "iOS 5 Software Update security content"),
          c(U.securityIndex, "iOS 5 Software Update — 12 Oct 2011"),
        ],
      ),
    ],
    [
      c(U.consumer, "iOS 5"),
      c(U.newsroomCloud, "iOS 5 and iCloud availability on October 12"),
      c(U.newsroomPreview, "iOS 5 feature preview"),
      c(U.developer, "iOS 5 SDK"),
      c(U.security5, "iOS 5 Software Update"),
      c(U.securityIndex, "iOS 5 Software Update — 12 Oct 2011"),
    ],
  ),
  version(
    "version-ios-5-0-1",
    [
      prose(
        "iOS 5.0.1 addressed battery-life defects, brought multitasking gestures to the original iPad, repaired Documents in the Cloud behavior, and improved Australian English dictation recognition.",
        [c(U.consumer, "iOS 5.0.1")],
      ),
      prose(
        "Its security bulletin also records fixes for URL and DNS handling, malicious fonts, certificate trust, code-signing enforcement, and an iPad 2 Smart Cover passcode-bypass condition.",
        [
          c(U.security501, "iOS 5.0.1 Software Update security content"),
          c(U.securityIndex, "iOS 5.0.1 Software Update — 10 Nov 2011"),
        ],
      ),
    ],
    [
      c(U.consumer, "iOS 5.0.1"),
      c(U.security501, "iOS 5.0.1 Software Update"),
      c(U.securityIndex, "iOS 5.0.1 Software Update — 10 Nov 2011"),
    ],
  ),
  version(
    "version-ios-5-1",
    [
      prose(
        "iOS 5.1 added Japanese Siri support, Photo Stream deletion, more direct lock-screen Camera access, broader face highlighting, a redesigned iPad Camera app, new iTunes Match and iPad media controls, and targeted battery and call-audio repairs.",
        [c(U.consumer, "iOS 5.1")],
      ),
      prose(
        "Apple’s security bulletin documents additional protections for network requests, disk images, the application sandbox, DNS parsing, passcode lock, Safari Private Browsing, Siri on the lock screen, VPN configuration files, and WebKit.",
        [
          c(U.security51, "iOS 5.1 Software Update security content"),
          c(U.securityIndex, "iOS 5.1 Software Update — 07 Mar 2012"),
        ],
      ),
    ],
    [
      c(U.consumer, "iOS 5.1"),
      c(U.security51, "iOS 5.1 Software Update"),
      c(U.securityIndex, "iOS 5.1 Software Update — 07 Mar 2012"),
    ],
  ),
  version(
    "version-ios-5-1-1",
    [
      prose(
        "iOS 5.1.1 improved lock-screen HDR reliability, repaired cellular switching on the third-generation iPad, corrected AirPlay video playback, strengthened Safari bookmark and Reading List synchronization, and removed a misleading purchase alert.",
        [c(U.consumer, "iOS 5.1.1")],
      ),
      prose(
        "The accompanying advisory describes a Safari location-bar spoofing fix and WebKit corrections for cross-site scripting and memory corruption.",
        [
          c(U.security511, "iOS 5.1.1 Software Update security content"),
          c(U.securityIndex, "iOS 5.1.1 Software Update — 07 May 2012"),
        ],
      ),
    ],
    [
      c(U.consumer, "iOS 5.1.1"),
      c(U.security511, "iOS 5.1.1 Software Update"),
      c(U.securityIndex, "iOS 5.1.1 Software Update — 07 May 2012"),
    ],
  ),
];

const ios5Changes = [
  change(
    "ios-5-0-notification-center",
    "Notification Center",
    "Notification Center consolidated alerts and added noninterruptive banners plus lock-screen access.",
    "feature",
    "introduced",
    "A downward swipe opened a unified notification view, incoming alerts could appear briefly at the top of the screen, and lock-screen items could lead directly to their associated app.",
    [
      c(U.consumer, "iOS 5 — Notifications"),
      c(U.newsroomPreview, "Notification Center"),
    ],
  ),
  change(
    "ios-5-0-imessage",
    "iMessage",
    "iMessage added encrypted text, photo, and video conversations between devices running iOS 5.",
    "feature",
    "introduced",
    "The Messages app gained Wi-Fi and cellular conversations among iOS 5 devices, with group messaging, delivery and read receipts, and synchronization across a user’s devices.",
    [c(U.consumer, "iOS 5 — iMessage"), c(U.newsroomPreview, "iMessage")],
  ),
  change(
    "ios-5-0-newsstand",
    "Newsstand",
    "Newsstand organized periodical subscriptions and supported automatic background delivery of new issues.",
    "feature",
    "introduced",
    "Magazine and newspaper subscriptions received a dedicated Home Screen location that displayed current covers and could download newly available issues in the background.",
    [c(U.consumer, "iOS 5 — Newsstand"), c(U.newsroomPreview, "Newsstand")],
  ),
  change(
    "ios-5-0-reminders",
    "Reminders",
    "A new Reminders app managed tasks with synchronization and supported time- or location-based alerts.",
    "feature",
    "introduced",
    "Users could organize tasks, synchronize them with iCloud, iCal, or Outlook, and on supported iPhones trigger reminders when arriving at or leaving a location.",
    [c(U.consumer, "iOS 5 — Reminders"), c(U.newsroomPreview, "Reminders")],
  ),
  change(
    "ios-5-0-twitter-integration",
    "System Twitter integration",
    "A single system sign-in enabled direct posting from Apple apps and supplied integration APIs to developers.",
    "feature",
    "introduced",
    "Twitter credentials could be configured once in Settings and used from Camera, Photos, Maps, Safari, YouTube, and compatible third-party applications.",
    [
      c(U.consumer, "iOS 5 — Built-in support for Twitter"),
      c(U.newsroomPreview, "Twitter integration"),
      c(U.developer, "Twitter integration"),
    ],
  ),
  change(
    "ios-5-0-camera-controls",
    "Faster and more controllable Camera",
    "Camera gained lock-screen access, volume-button capture, composition aids, zoom, and focus or exposure locking.",
    "feature",
    "introduced",
    "Supported devices could open Camera from the lock screen, use Volume Up as a shutter, enable grid lines, pinch to zoom, move between preview and Camera Roll, and lock focus or exposure where supported.",
    [
      c(U.consumer, "iOS 5 — Camera improvements"),
      c(U.newsroomPreview, "Camera features"),
    ],
  ),
  change(
    "ios-5-0-photos-editing",
    "On-device Photos editing",
    "Photos added cropping, rotation, red-eye removal, one-tap enhancement, and album organization.",
    "feature",
    "introduced",
    "The built-in Photos app could perform common corrections and organize images into albums without requiring a separate desktop workflow.",
    [
      c(U.consumer, "iOS 5 — Photo improvements"),
      c(U.newsroomPreview, "Photos features"),
    ],
  ),
  change(
    "ios-5-0-mail-composition",
    "Expanded Mail composition and triage",
    "Mail added rich-text formatting, indentation, draggable recipients, flags, bulk state changes, custom sounds, and S/MIME.",
    "enhancement",
    "changed",
    "Users gained more control over message formatting and addressing, could flag or mark multiple messages together, choose mail alert sounds, and use S/MIME.",
    [c(U.consumer, "iOS 5 — Mail improvements")],
  ),
  change(
    "ios-5-0-calendar-views-attachments",
    "Calendar views and attachments",
    "Calendar added new device-specific views, faster event creation, and event-attachment access.",
    "enhancement",
    "changed",
    "The iPad received a year view, iPhone and iPod touch received a week view, tapping could create an event, and users could view or add event attachments.",
    [c(U.consumer, "iOS 5 — Calendar improvements")],
  ),
  change(
    "ios-5-0-game-center-discovery",
    "Game Center profiles and discovery",
    "Game Center expanded profiles, score comparisons, friend discovery, and game recommendations.",
    "enhancement",
    "changed",
    "Players could add profile photos, compare aggregate achievement scores, discover friends through recommendations and mutual connections, and receive customized game suggestions.",
    [
      c(U.consumer, "iOS 5 — Game Center improvements"),
      c(U.newsroomPreview, "Game Center"),
    ],
  ),
  change(
    "ios-5-0-ipad-airplay-gestures",
    "AirPlay Mirroring and iPad multitasking gestures",
    "Supported iPads gained screen mirroring and four- or five-finger navigation gestures.",
    "feature",
    "introduced",
    "iPad 2 and iPhone 4S could mirror through Apple TV, while iPad 2 added gestures to return Home, reveal multitasking, or switch among applications.",
    [
      c(U.consumer, "iOS 5 — AirPlay Mirroring and Multitasking Gestures"),
      c(U.newsroomPreview, "AirPlay Mirroring and iPad gestures"),
    ],
  ),
  change(
    "ios-5-0-pc-free-ota-wifi-sync",
    "PC-free setup, over-the-air updates, and Wi-Fi Sync",
    "Devices could be activated and maintained without tethering and could synchronize with iTunes over Wi-Fi.",
    "feature",
    "introduced",
    "Setup Assistant enabled on-device activation and configuration, software updates could arrive over the air, and purchased content could synchronize wirelessly with an iTunes library.",
    [
      c(
        U.consumer,
        "iOS 5 — Setup Assistant, software updates, and wireless sync",
      ),
      c(U.newsroomPreview, "PC Free and Wi-Fi Sync"),
    ],
  ),
  change(
    "ios-5-0-icloud-services",
    "iCloud integration",
    "iCloud connected purchases, photos, documents, backup, communications data, and device location across supported products.",
    "feature",
    "introduced",
    "The operating system integrated iTunes in the Cloud, Photo Stream, Documents in the Cloud, purchase history and automatic downloads, backup, Contacts, Calendar, Mail, and Find My iPhone.",
    [
      c(U.consumer, "iOS 5 — iCloud support"),
      c(U.newsroomCloud, "iCloud services and October 12 availability"),
    ],
  ),
  change(
    "ios-5-0-keyboard-input",
    "Keyboard and input improvements",
    "Keyboard updates added an iPad split layout, better correction and East Asian input, Emoji, a personal dictionary, and text shortcuts.",
    "enhancement",
    "changed",
    "The release expanded keyboard layouts and language behavior while allowing users to define shortcuts for frequently typed words or phrases.",
    [c(U.consumer, "iOS 5 — Keyboard improvements")],
  ),
  change(
    "ios-5-0-accessibility",
    "Broader accessibility controls",
    "Accessibility additions covered visual alerts, custom vibration, assistive input, spoken selections, and VoiceOver labeling.",
    "enhancement",
    "changed",
    "Supported iPhones could flash the LED or use custom vibration patterns for alerts, and the system added mobility-device input, Speak Selection, and custom element labels for VoiceOver.",
    [c(U.consumer, "iOS 5 — Accessibility improvements")],
  ),
  change(
    "ios-5-0-exchange-activesync",
    "Exchange ActiveSync workflow improvements",
    "Exchange accounts gained task synchronization, message-state controls, offline improvements, and GAL contact saving.",
    "enhancement",
    "changed",
    "Users could synchronize tasks wirelessly, flag or mark messages, work more effectively offline, and save new contacts from a Global Address List.",
    [c(U.consumer, "iOS 5 — Exchange ActiveSync improvements")],
  ),
  change(
    "ios-5-0-developer-apis",
    "More than 1,500 new developer APIs",
    "The iOS 5 SDK exposed more than 1,500 APIs supporting the release’s new platform capabilities.",
    "developerApi",
    "introduced",
    "Apple described an SDK expansion spanning iCloud storage, Notification Center, Newsstand, iMessage, Twitter integration, Game Center, and other platform technologies.",
    [
      c(U.consumer, "iOS 5 — More than 1,500 new developer APIs"),
      c(U.developer, "iOS 5 SDK and more than 1,500 new APIs"),
    ],
  ),
  change(
    "ios-5-0-credential-trust-tls-security",
    "Credential, certificate, and TLS hardening",
    "Security changes protected stored credentials, removed or constrained unsafe certificate trust, and added TLS 1.2.",
    "security",
    "fixed",
    "Apple stopped locally logging Apple ID and Wi-Fi credentials, distrusted DigiNotar certificates, restricted MD5-signed certificates, and added TLS 1.2 support.",
    [
      c(
        U.security5,
        "CFNetwork credential logging; Data Security certificate trust and TLS; Wi-Fi credential logging",
      ),
      c(U.tls, "Introduction — iOS 5 TLS 1.2 implementation"),
    ],
  ),
  change(
    "ios-5-0-content-and-web-security",
    "Content parsing and web-origin security",
    "The release corrected representative memory-safety, document-isolation, URL-spoofing, and cross-origin defects.",
    "security",
    "fixed",
    "Apple documented repairs across CoreFoundation, CoreGraphics, ImageIO, ICU, libxml, OfficeImport, Safari, and WebKit, including code-execution and cross-origin risks.",
    [
      c(
        U.security5,
        "CoreFoundation, CoreGraphics, ImageIO, ICU, libxml, OfficeImport, Safari, and WebKit",
      ),
    ],
  ),
];

const ios501Changes = [
  change(
    "ios-5-0-1-battery-life",
    "Battery-life repairs",
    "The update corrected unspecified defects that affected battery life.",
    "bugFix",
    "fixed",
    "Apple’s consumer note identifies battery-life bug fixes without attributing a single battery symptom or device-specific cause.",
    [c(U.consumer, "iOS 5.0.1 — battery life")],
  ),
  change(
    "ios-5-0-1-original-ipad-gestures",
    "Multitasking gestures for the original iPad",
    "The original iPad gained the multitasking gestures introduced for iPad 2 in iOS 5.",
    "feature",
    "introduced",
    "iOS 5.0.1 extended the documented multitasking gesture feature to the first-generation iPad.",
    [c(U.consumer, "iOS 5.0.1 — Multitasking Gestures")],
  ),
  change(
    "ios-5-0-1-documents-cloud",
    "Documents in the Cloud repairs",
    "The update resolved unspecified defects affecting Documents in the Cloud.",
    "bugFix",
    "fixed",
    "Apple records a Documents in the Cloud repair but does not itemize the affected applications or failure modes.",
    [c(U.consumer, "iOS 5.0.1 — Documents in the Cloud")],
  ),
  change(
    "ios-5-0-1-australian-dictation",
    "Australian dictation recognition",
    "Voice recognition improved for Australian users who used dictation.",
    "enhancement",
    "changed",
    "The dictation system received a language-region-specific recognition improvement for Australian users.",
    [c(U.consumer, "iOS 5.0.1 — Australian dictation")],
  ),
  change(
    "ios-5-0-1-url-dns-routing-security",
    "URL and DNS routing validation",
    "CFNetwork and libinfo were corrected to avoid routing crafted URLs or hostnames to unintended servers.",
    "security",
    "fixed",
    "Apple fixed URL and DNS lookup defects that could disclose sensitive information by resolving or navigating to an incorrect server.",
    [c(U.security501, "CFNetwork — CVE-2011-3246; libinfo — CVE-2011-3441")],
  ),
  change(
    "ios-5-0-1-font-processing-security",
    "FreeType font-processing hardening",
    "CoreGraphics corrected FreeType memory-corruption defects reachable through crafted fonts.",
    "security",
    "fixed",
    "The update addressed multiple font-processing memory-corruption issues, including cases Apple said could enable arbitrary code execution.",
    [c(U.security501, "CoreGraphics — CVE-2011-3439")],
  ),
  change(
    "ios-5-0-1-digicert-malaysia-trust",
    "DigiCert Malaysia trust restriction",
    "Default trust settings stopped trusting DigiCert Malaysia certificates associated with weak intermediates.",
    "security",
    "fixed",
    "Apple changed certificate trust after weak intermediate certificates could not be revoked, reducing interception risk for affected certificate chains.",
    [c(U.security501, "Data Security — DigiCert Malaysia certificates")],
  ),
  change(
    "ios-5-0-1-code-signing-enforcement",
    "Code-signing enforcement",
    "The kernel corrected mmap flag validation that could allow unsigned code to execute.",
    "security",
    "fixed",
    "A kernel logic error in validation of mmap flag combinations was repaired to prevent bypassing code-signing checks.",
    [c(U.security501, "Kernel — CVE-2011-3442")],
  ),
  change(
    "ios-5-0-1-smart-cover-passcode",
    "iPad 2 Smart Cover passcode protection",
    "The update closed a locked-state Smart Cover sequence that exposed limited data without a passcode.",
    "security",
    "fixed",
    "Apple corrected an iPad 2 condition in which opening a Smart Cover during power-off confirmation could bypass the normal passcode prompt and expose some data.",
    [c(U.security501, "Passcode Lock — CVE-2011-3440")],
  ),
];

const ios51Changes = [
  change(
    "ios-5-1-siri-japanese",
    "Japanese Siri support",
    "Siri added Japanese language support, subject to Apple’s initial availability qualification.",
    "feature",
    "introduced",
    "The voice assistant expanded to Japanese, with Apple warning that availability could be limited during the initial rollout.",
    [c(U.consumer, "iOS 5.1 — Japanese language support for Siri")],
  ),
  change(
    "ios-5-1-photo-stream-delete",
    "Photo Stream deletion",
    "Users could delete photos directly from Photo Stream.",
    "feature",
    "introduced",
    "Photo Stream gained an explicit deletion capability for removing individual images.",
    [c(U.consumer, "iOS 5.1 — Photo Stream deletion")],
  ),
  change(
    "ios-5-1-camera-experience",
    "Camera access, face detection, and iPad redesign",
    "Camera became persistently accessible from supported lock screens, highlighted every detected face, and gained a redesigned iPad interface.",
    "enhancement",
    "changed",
    "The lock-screen Camera shortcut was made continuously visible on listed devices, face detection highlighted all recognized faces, and the iPad Camera app received a new design.",
    [c(U.consumer, "iOS 5.1 — Camera improvements")],
  ),
  change(
    "ios-5-1-itunes-match-genius",
    "Genius for iTunes Match",
    "iTunes Match subscribers gained Genius Mixes and Genius playlists.",
    "feature",
    "introduced",
    "The Music experience exposed Genius-created mixes and playlists to users with an iTunes Match subscription.",
    [c(U.consumer, "iOS 5.1 — Genius for iTunes Match subscribers")],
  ),
  change(
    "ios-5-1-ipad-media-controls",
    "iPad media audio and podcast controls",
    "iPad media playback gained clearer audio tuning plus podcast speed and rewind controls.",
    "enhancement",
    "changed",
    "Apple optimized TV-show and movie audio for greater clarity and volume and added podcast playback-speed control with a 30-second rewind.",
    [c(U.consumer, "iOS 5.1 — iPad media and podcast controls")],
  ),
  change(
    "ios-5-1-att-network-indicator",
    "AT&T network indicator",
    "The update changed the network indicator shown for AT&T service.",
    "behavior",
    "changed",
    "Apple records an updated AT&T network indicator without describing any underlying radio or throughput change.",
    [c(U.consumer, "iOS 5.1 — Updated AT&T network indicator")],
  ),
  change(
    "ios-5-1-battery-life",
    "Battery-life repairs",
    "The update corrected unspecified defects that affected battery life.",
    "bugFix",
    "fixed",
    "Apple lists battery-life bug fixes but does not assign them to a particular device, subsystem, or reproducible symptom.",
    [c(U.consumer, "iOS 5.1 — battery life")],
  ),
  change(
    "ios-5-1-outgoing-call-audio",
    "Outgoing-call audio reliability",
    "The update fixed an intermittent loss of audio during outgoing calls.",
    "bugFix",
    "fixed",
    "Apple corrected a condition that could occasionally cause audio to drop while placing an outgoing call.",
    [c(U.consumer, "iOS 5.1 — outgoing call audio")],
  ),
  change(
    "ios-5-1-cfnetwork-request-headers",
    "CFNetwork request-header privacy",
    "CFNetwork stopped sending unintended request headers when handling malformed URLs.",
    "security",
    "fixed",
    "Apple repaired malformed-URL handling that could cause unexpected headers to be sent to a server and disclose sensitive information.",
    [c(U.security51, "CFNetwork — CVE-2012-0641")],
  ),
  change(
    "ios-5-1-hfs-disk-images",
    "HFS disk-image validation",
    "HFS catalog parsing was hardened against an integer underflow in crafted disk images.",
    "security",
    "fixed",
    "The update corrected an underflow that Apple said could cause shutdown or arbitrary code execution when a malicious disk image was mounted.",
    [c(U.security51, "HFS — CVE-2012-0642")],
  ),
  change(
    "ios-5-1-kernel-sandbox",
    "Kernel sandbox enforcement",
    "The kernel corrected debug-system-call handling that could bypass application sandbox restrictions.",
    "security",
    "fixed",
    "Apple fixed a logic error that could let a malicious program execute code in another program with the same user privileges.",
    [c(U.security51, "Kernel — CVE-2012-0643")],
  ),
  change(
    "ios-5-1-dns-record-parsing",
    "DNS resource-record parsing",
    "libresolv corrected an integer overflow in DNS resource-record handling.",
    "security",
    "fixed",
    "The parser was hardened against crafted DNS data that could terminate an application or corrupt heap memory and enable code execution.",
    [c(U.security51, "libresolv — CVE-2011-3453")],
  ),
  change(
    "ios-5-1-passcode-lock",
    "Passcode Lock gesture handling",
    "The lock screen corrected a race condition involving slide-to-dial gestures.",
    "security",
    "fixed",
    "Apple addressed a physical-access sequence that could bypass Passcode Lock through competing slide-to-dial actions.",
    [c(U.security51, "Passcode Lock — CVE-2012-0644")],
  ),
  change(
    "ios-5-1-private-browsing-history",
    "Safari Private Browsing history",
    "Safari stopped recording certain script-driven visits while Private Browsing was active.",
    "security",
    "fixed",
    "Visits produced through the pushState or replaceState JavaScript methods were prevented from appearing in browser history during a private session.",
    [c(U.security51, "Safari — CVE-2012-0585")],
  ),
  change(
    "ios-5-1-siri-lock-screen-mail",
    "Siri lock-screen Mail restriction",
    "Siri no longer forwarded the active Mail message while invoked from a locked device.",
    "security",
    "fixed",
    "The lock-screen policy was tightened so a voice command could not send a frontmost email message to an arbitrary recipient without unlocking.",
    [c(U.security51, "Siri — CVE-2012-0645")],
  ),
  change(
    "ios-5-1-vpn-configuration",
    "VPN configuration-file validation",
    "VPN configuration parsing was hardened against a format-string vulnerability.",
    "security",
    "fixed",
    "Apple repaired racoon configuration-file handling that could allow crafted system configuration data to run code with system privileges.",
    [c(U.security51, "VPN — CVE-2012-0646")],
  ),
  change(
    "ios-5-1-webkit-security",
    "WebKit origin and memory safety",
    "WebKit corrected cookie disclosure, cross-origin scripting, drag-and-drop, and memory-corruption defects.",
    "security",
    "fixed",
    "The advisory groups fixes for cross-origin isolation and a broad set of memory-safety flaws, including cases capable of script injection, data disclosure, or arbitrary code execution.",
    [
      c(
        U.security51,
        "WebKit — CVE-2011-3887, CVE-2012-0590, CVE-2011-3881 through CVE-2012-0635",
      ),
    ],
  ),
];

const ios511Changes = [
  change(
    "ios-5-1-1-lock-screen-hdr",
    "Lock-screen HDR reliability",
    "HDR capture became more reliable when Camera was opened from the lock-screen shortcut.",
    "bugFix",
    "fixed",
    "Apple improved use of the HDR option specifically for photos taken after entering Camera through the lock screen.",
    [c(U.consumer, "iOS 5.1.1 — HDR and Lock Screen shortcut")],
  ),
  change(
    "ios-5-1-1-ipad-cellular-switching",
    "Third-generation iPad cellular switching",
    "The update fixed defects that could prevent the third-generation iPad from changing between 2G and 3G service.",
    "bugFix",
    "fixed",
    "Apple addressed cellular-mode switching failures on the device it described at the time as the new iPad.",
    [c(U.consumer, "iOS 5.1.1 — new iPad 2G and 3G switching")],
  ),
  change(
    "ios-5-1-1-airplay-video",
    "AirPlay video playback",
    "The update corrected defects affecting AirPlay video playback in some conditions.",
    "bugFix",
    "fixed",
    "Apple records an AirPlay video reliability repair without identifying the affected content type or receiving hardware.",
    [c(U.consumer, "iOS 5.1.1 — AirPlay video playback")],
  ),
  change(
    "ios-5-1-1-safari-sync",
    "Safari bookmarks and Reading List sync",
    "Synchronization reliability improved for Safari bookmarks and Reading List.",
    "bugFix",
    "fixed",
    "The update addressed reliability of keeping bookmark and Reading List data synchronized.",
    [c(U.consumer, "iOS 5.1.1 — Safari bookmarks and Reading List")],
  ),
  change(
    "ios-5-1-1-purchase-alert",
    "Post-purchase alert accuracy",
    "A misleading unable-to-purchase alert was removed from successful purchase flows.",
    "bugFix",
    "fixed",
    "Apple fixed a condition in which the system could report that a purchase failed even though it had completed successfully.",
    [c(U.consumer, "iOS 5.1.1 — Unable to purchase alert")],
  ),
  change(
    "ios-5-1-1-safari-url-spoofing",
    "Safari location-bar integrity",
    "Safari improved URL handling to prevent a crafted site from spoofing the address shown in the location bar.",
    "security",
    "fixed",
    "The browser corrected an address-display weakness that could make a malicious page appear to belong to a legitimate domain.",
    [c(U.security511, "Safari — CVE-2012-0674")],
  ),
  change(
    "ios-5-1-1-webkit-xss",
    "WebKit cross-site scripting protection",
    "WebKit corrected multiple cross-site scripting vulnerabilities.",
    "security",
    "fixed",
    "Apple addressed two documented WebKit conditions in which malicious web content could cross site boundaries and execute script.",
    [c(U.security511, "WebKit — CVE-2011-3046 and CVE-2011-3056")],
  ),
  change(
    "ios-5-1-1-webkit-memory",
    "WebKit memory safety",
    "WebKit corrected a memory-corruption flaw reachable through malicious web content.",
    "security",
    "fixed",
    "The browser engine fixed a memory-safety issue Apple said could terminate an application or allow arbitrary code execution.",
    [c(U.security511, "WebKit — CVE-2012-0672")],
  ),
];

const events = [
  event(
    "version-ios-5-0",
    "The public iOS 5 release introduced a broad communications, notification, cloud, media, productivity, device-independence, accessibility, developer-platform, and security update.",
    [
      c(U.consumer, "iOS 5"),
      c(U.newsroomCloud, "October 12 availability"),
      c(U.newsroomPreview, "Principal iOS 5 features"),
      c(U.security5, "iOS 5 Software Update"),
      c(U.securityIndex, "iOS 5 Software Update — 12 Oct 2011"),
    ],
    ios5Changes,
  ),
  event(
    "version-ios-5-0-1",
    "The public iOS 5.0.1 update combined four documented consumer improvements with targeted network, font, certificate, kernel, and lock-screen security repairs.",
    [
      c(U.consumer, "iOS 5.0.1"),
      c(U.security501, "iOS 5.0.1 Software Update"),
      c(U.securityIndex, "iOS 5.0.1 Software Update — 10 Nov 2011"),
    ],
    ios501Changes,
  ),
  event(
    "version-ios-5-1",
    "The public iOS 5.1 update expanded Siri, Camera, Photo Stream, media, and carrier presentation behavior while addressing battery, calling, lock-screen, networking, and web security defects.",
    [
      c(U.consumer, "iOS 5.1"),
      c(U.security51, "iOS 5.1 Software Update"),
      c(U.securityIndex, "iOS 5.1 Software Update — 07 Mar 2012"),
    ],
    ios51Changes,
  ),
  event(
    "version-ios-5-1-1",
    "The public iOS 5.1.1 update focused on HDR, cellular, AirPlay, Safari synchronization, and purchase-alert reliability plus Safari and WebKit security fixes.",
    [
      c(U.consumer, "iOS 5.1.1"),
      c(U.security511, "iOS 5.1.1 Software Update"),
      c(U.securityIndex, "iOS 5.1.1 Software Update — 07 May 2012"),
    ],
    ios511Changes,
  ),
];

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

writeFileSync(
  join(here, "apple-ios-5.json"),
  `${JSON.stringify(bundle, null, 2)}\n`,
);
