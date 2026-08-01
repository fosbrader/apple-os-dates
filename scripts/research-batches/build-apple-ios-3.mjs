import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

const out = path.resolve("scripts/research-batches/apple-ios-3.json");

const U = {
  security2009: "https://support.apple.com/en-us/104189",
  security2010: "https://support.apple.com/en-us/104188",
  security30: "https://support.apple.com/en-us/104138",
  security301: "https://support.apple.com/en-us/104140",
  security31: "https://support.apple.com/en-us/104146",
  security313: "https://support.apple.com/en-us/104157",
  preview30:
    "https://www.apple.com/newsroom/2009/03/17Apple-Previews-Developer-Beta-of-iPhone-OS-3-0/",
  iphone3gs:
    "https://www.apple.com/newsroom/2009/06/08Apple-Announces-the-New-iPhone-3GS-The-Fastest-Most-Powerful-iPhone-Yet/",
  ipod31:
    "https://www.apple.com/newsroom/2009/09/09Apple-Introduces-New-iPod-touch-Lineup/",
  itunes9: "https://www.apple.com/newsroom/2009/09/09Apple-Premieres-iTunes-9/",
  macrumors312:
    "https://www.macrumors.com/2009/10/08/apple-releases-iphone-os-3-1-2/",
  macworld313: "https://www.macworld.com/article/202388/iphone_313.html",
  ipad: "https://www.apple.com/newsroom/2010/03/05iPad-Available-in-US-on-April-3/",
};

const sources = [
  {
    url: U.security2009,
    title: "Apple security updates (15-Jan-2008 to 03-Dec-2009)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2008", "2009", "security release index"],
  },
  {
    url: U.security2010,
    title: "Apple security updates (2010)",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    topics: ["Apple software", "2010", "security release index"],
  },
  {
    url: U.security30,
    title: "About the security content of iOS 3.0 Software Update",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    publishedAt: "2009-06-17T00:00:00Z",
    topics: ["iOS", "iPhone OS", "3.0", "security"],
  },
  {
    url: U.security301,
    title: "About the security content of iOS 3.0.1",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    publishedAt: "2009-07-31T00:00:00Z",
    topics: ["iOS", "iPhone OS", "3.0.1", "security"],
  },
  {
    url: U.security31,
    title: "About the security content of iOS 3.1 and iOS 3.1.1 for iPod touch",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    publishedAt: "2009-09-09T00:00:00Z",
    topics: ["iOS", "iPhone OS", "3.1", "security"],
  },
  {
    url: U.security313,
    title:
      "About the security content of iOS 3.1.3 and iOS 3.1.3 for iPod touch",
    publisher: "Apple Support",
    sourceClass: "firstPartyDocumentation",
    publishedAt: "2010-02-02T00:00:00Z",
    topics: ["iOS", "iPhone OS", "3.1.3", "security"],
  },
  {
    url: U.preview30,
    title: "Apple Previews Developer Beta of iPhone OS 3.0",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2009-03-17T00:00:00Z",
    topics: ["iPhone OS", "3.0", "features", "developer APIs"],
  },
  {
    url: U.iphone3gs,
    title:
      "Apple Announces the New iPhone 3GS—The Fastest, Most Powerful iPhone Yet",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2009-06-08T00:00:00Z",
    topics: ["iPhone OS", "3.0", "availability", "features"],
  },
  {
    url: U.ipod31,
    title: "Apple Introduces New iPod touch Lineup",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2009-09-09T00:00:00Z",
    topics: ["iPhone OS", "3.1", "features", "availability"],
  },
  {
    url: U.itunes9,
    title: "Apple Premieres iTunes 9",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2009-09-09T00:00:00Z",
    topics: ["iPhone OS", "3.1", "syncing", "iTunes Store"],
  },
  {
    url: U.macrumors312,
    title: "Apple Releases iPhone OS 3.1.2",
    publisher: "MacRumors",
    sourceClass: "journalism",
    author: "Eric Slivka",
    publishedAt: "2009-10-08T17:22:00Z",
    topics: [
      "iPhone OS",
      "3.1.2",
      "release notes",
      "contemporaneous reporting",
    ],
  },
  {
    url: U.macworld313,
    title: "Apple releases iPhone software 3.1.3",
    publisher: "Macworld",
    sourceClass: "journalism",
    author: "Dan Moren",
    publishedAt: "2010-02-02T10:53:00Z",
    topics: [
      "iPhone OS",
      "3.1.3",
      "release notes",
      "contemporaneous reporting",
    ],
  },
  {
    url: U.ipad,
    title: "iPad Available in US on April 3",
    publisher: "Apple Newsroom",
    sourceClass: "firstPartyAnnouncement",
    publishedAt: "2010-03-05T00:00:00Z",
    topics: ["iPhone OS", "3.2", "iPad", "availability", "features"],
  },
];

const cite = (url, locator, note) => ({
  url,
  ...(locator ? { locator } : {}),
  ...(note ? { note } : {}),
});

const block = (text, citations) => ({ text, citations });

function change(
  key,
  title,
  canonicalSummary,
  category,
  action,
  summary,
  citations,
  evidenceState = "confirmed",
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
    evidenceState,
    verificationMethod:
      evidenceState === "reported"
        ? "Matched the contemporaneous publisher's dated preservation of the update notice to the existing audited public-release record; no stronger first-party feature page survives in the reviewed source set."
        : "Matched a version-labeled Apple announcement, release index, or security advisory to the existing audited public-release record.",
    citations,
  };
}

const releases = [
  {
    version: "3.0",
    releaseNotesUrl: U.iphone3gs,
    summary:
      "The public iPhone OS 3.0 release introduced systemwide editing, MMS on supported service, Spotlight, landscape input, Voice Memos, MobileMe device recovery, expanded media downloads, major developer APIs, and a broad security baseline.",
    blocks: [
      block(
        "Apple released iPhone OS 3.0 on June 17, 2009. Its user-facing scope included cut, copy and paste; MMS where supported; Spotlight and in-app search; landscape keyboards; Voice Memos; Find My iPhone and Remote Wipe through MobileMe; and broader direct media downloads.",
        [
          cite(U.iphone3gs, "iPhone OS 3.0 features; Pricing & Availability"),
          cite(U.security2009, "iOS 3.0 Software Update — 17 June 2009"),
        ],
      ),
      block(
        "The developer release added more than one thousand APIs spanning purchases, peer connections, accessories, maps, and push notifications. Apple’s separate security advisory documents repairs across graphics, media, messaging, networking, configuration, Safari, and WebKit. Hardware, carrier, and service qualifications in Apple’s announcement remain part of this historical record.",
        [
          cite(U.preview30, "SDK APIs and principal user features"),
          cite(U.security30, "iOS 3.0 Software Update security content"),
          cite(U.iphone3gs, "MMS and MobileMe qualifications"),
        ],
      ),
    ],
    citations: [
      cite(U.iphone3gs, "iPhone OS 3.0 features; June 17 availability"),
      cite(U.preview30, "SDK APIs and user features"),
      cite(U.security30, "iOS 3.0 Software Update security content"),
      cite(U.security2009, "iOS 3.0 Software Update — 17 June 2009"),
    ],
    changes: [
      change(
        "ios-3-0-editing",
        "Cut, copy, and paste",
        "The release added text and content transfer within an app and across compatible applications.",
        "feature",
        "introduced",
        "Users gained cut, copy, and paste operations that Apple described as working within or across applications.",
        [cite(U.iphone3gs, "iPhone OS 3.0 feature list")],
      ),
      change(
        "ios-3-0-mms",
        "MMS in Messages",
        "Supported iPhone models and carriers gained multimedia messaging for photos, contacts, audio, and locations.",
        "feature",
        "introduced",
        "Apple added MMS to Messages on supported iPhone hardware and service, while explicitly noting carrier and regional limits.",
        [
          cite(U.preview30, "MMS"),
          cite(U.iphone3gs, "iPhone OS 3.0 features; MMS qualification"),
        ],
      ),
      change(
        "ios-3-0-spotlight-search",
        "Spotlight and expanded app search",
        "A system search surface and broader in-app search made locally stored information easier to find.",
        "feature",
        "introduced",
        "Spotlight searched across key applications, while Mail, iPod, and Notes received their own expanded search capabilities.",
        [
          cite(U.preview30, "Search and Spotlight"),
          cite(U.iphone3gs, "iPhone OS 3.0 feature list"),
        ],
      ),
      change(
        "ios-3-0-landscape-input",
        "Landscape keyboards",
        "Several built-in text applications gained a wider keyboard when the device was rotated.",
        "enhancement",
        "changed",
        "Mail, Messages, Notes, and Safari could present landscape-oriented text input on supported devices.",
        [
          cite(U.preview30, "Landscape view"),
          cite(U.iphone3gs, "iPhone OS 3.0 feature list"),
        ],
      ),
      change(
        "ios-3-0-voice-memos",
        "Voice Memos",
        "A built-in application added recording and sharing of spoken audio.",
        "feature",
        "introduced",
        "The new Voice Memos app recorded audio and supported sending recordings from the device.",
        [
          cite(U.preview30, "Voice Memo app"),
          cite(U.iphone3gs, "iPhone OS 3.0 feature list"),
        ],
      ),
      change(
        "ios-3-0-mobileme-device-recovery",
        "Find My iPhone and Remote Wipe",
        "MobileMe subscribers gained location, message, sound, and remote-erasure controls for a missing iPhone.",
        "feature",
        "introduced",
        "Apple connected iPhone OS 3.0 with MobileMe so a user could locate a device, display a message, play a sound, or erase its contents remotely; a MobileMe subscription was required.",
        [cite(U.iphone3gs, "Find My iPhone; Pricing & Availability")],
      ),
      change(
        "ios-3-0-direct-media-downloads",
        "Expanded direct media downloads",
        "The device could obtain additional video, audio-program, and education content directly from Apple services.",
        "enhancement",
        "changed",
        "Apple expanded on-device iTunes access to movies, television, audio programs, and iTunes U material.",
        [cite(U.iphone3gs, "New iTunes features")],
      ),
      change(
        "ios-3-0-commerce-peer-accessory-apis",
        "Commerce, peer, and accessory APIs",
        "Developers gained interfaces for in-app purchases, nearby peer connections, and communication with hardware accessories.",
        "developerApi",
        "introduced",
        "The 3.0 SDK added in-app purchases, Bluetooth-based peer connections, and an application interface for supported accessories.",
        [cite(U.preview30, "New SDK APIs")],
      ),
      change(
        "ios-3-0-maps-push-apis",
        "Maps and push-notification APIs",
        "Applications gained map integration and a system delivery path for alerts while not running.",
        "developerApi",
        "introduced",
        "Apple added a Maps API for tiles, location, annotations, and geocoding plus the Apple Push Notification service for sound, text, and badge alerts.",
        [cite(U.preview30, "Maps API and Push Notifications")],
      ),
      change(
        "ios-3-0-calendar-stocks-expansion",
        "Calendar and Stocks expansion",
        "Built-in calendar and market-data applications gained broader service integration and information views.",
        "enhancement",
        "changed",
        "Calendar added CalDAV and shared-calendar support, while Stocks added news, more trading metrics, and a landscape chart view.",
        [cite(U.preview30, "Calendar and Stocks")],
      ),
      change(
        "ios-3-0-graphics-document-security",
        "Graphics and document parser hardening",
        "Image, PDF, font, and video parsers received memory-safety and validation corrections.",
        "security",
        "fixed",
        "Apple repaired multiple crafted-content paths in CoreGraphics, ImageIO, FreeType, and MPEG-4 processing that could terminate software, reset a device, disclose data, or execute code.",
        [cite(U.security30, "CoreGraphics, ImageIO, and MPEG-4 Video Codec")],
      ),
      change(
        "ios-3-0-mail-exchange-profile-security",
        "Mail, Exchange, and profile protections",
        "The update strengthened remote-content privacy, certificate handling, call confirmation, and configuration-policy enforcement.",
        "security",
        "fixed",
        "Apple added control over remote image loading, corrected certificate-exception and call-confirmation behavior, and prevented a profile from weakening an Exchange passcode policy.",
        [cite(U.security30, "Exchange, Mail, and Profiles")],
      ),
      change(
        "ios-3-0-network-telephony-security",
        "Networking and telephony resilience",
        "Network services received denial-of-service and remote-reset protections.",
        "security",
        "fixed",
        "Apple updated the IPsec library and corrected handling of crafted network requests that could exhaust resources or reset a device.",
        [cite(U.security30, "IPSec and Telephony")],
      ),
      change(
        "ios-3-0-safari-web-isolation",
        "Safari history and web-isolation protections",
        "Safari and WebKit tightened history clearing, frame isolation, cross-origin access, and script boundaries.",
        "security",
        "fixed",
        "The update synchronized search-history removal with Safari history clearing and repaired clickjacking, cross-site scripting, cross-origin image, redirect, object, and frame-handling weaknesses.",
        [cite(U.security30, "Safari and WebKit")],
      ),
      change(
        "ios-3-0-webkit-memory-privacy",
        "WebKit memory and privacy protections",
        "The browser engine received memory-safety, resource-consumption, randomization, and information-disclosure corrections.",
        "security",
        "fixed",
        "Apple documented fixes for crafted web content that could execute code, crash or reset software, track a session, or expose information across origins.",
        [cite(U.security30, "WebKit")],
      ),
    ],
  },
  {
    version: "3.0.1",
    releaseNotesUrl: U.security301,
    summary:
      "The public iPhone OS 3.0.1 update was a focused CoreTelephony security release correcting malicious SMS message handling.",
    blocks: [
      block(
        "Apple’s archived security index dates iPhone OS 3.0.1 to July 31, 2009. The corresponding advisory identifies one documented change: safer decoding of SMS messages in CoreTelephony.",
        [
          cite(U.security2009, "iOS 3.0.1 — 31 July 2009"),
          cite(U.security301, "CoreTelephony — CVE-2009-2204"),
        ],
      ),
      block(
        "Apple said a crafted SMS could previously interrupt service or execute code. This article does not infer unrelated maintenance changes, feature additions, or an undocumented build record.",
        [cite(U.security301, "CoreTelephony — CVE-2009-2204")],
      ),
    ],
    citations: [
      cite(U.security2009, "iOS 3.0.1 — 31 July 2009"),
      cite(U.security301, "iOS 3.0.1 security content"),
    ],
    changes: [
      change(
        "ios-3-0-1-sms-decoding",
        "SMS decoding memory safety",
        "CoreTelephony improved error handling while decoding crafted SMS messages.",
        "security",
        "fixed",
        "The focused update corrected a memory-corruption flaw that Apple said could cause a service interruption or arbitrary code execution when a malicious SMS arrived.",
        [cite(U.security301, "CoreTelephony — CVE-2009-2204")],
      ),
    ],
  },
  {
    version: "3.1",
    releaseNotesUrl: U.security31,
    summary:
      "The public iPhone OS 3.1 release expanded iTunes organization, syncing, recommendations, ringtones, MobileMe controls, and anti-phishing behavior while repairing audio, enterprise, mail, recovery, telephony, password, and web security defects.",
    blocks: [
      block(
        "Apple’s dated records place iPhone OS 3.1 on September 9, 2009. Apple’s launch material ties it to home-screen organization in iTunes, more selective media and photo syncing, Genius Mixes and Genius for Apps, direct ringtone purchases, MobileMe remote lock, and anti-phishing protection.",
        [
          cite(U.security2009, "iOS 3.1 — 09 September 2009"),
          cite(U.itunes9, "Improved syncing and iPhone Store ringtones"),
          cite(U.ipod31, "iPhone 3.1 features and update availability"),
        ],
      ),
      block(
        "The matching security advisory covers crafted audio, Exchange passcode policy, deleted mail in Spotlight, recovery-mode access, SMS resilience, password display, credential leakage, cross-site scripting, code execution, and deceptive internationalized URLs. Claims specific to iPod touch are not generalized to every iPhone.",
        [
          cite(U.security31, "iOS 3.1 security content"),
          cite(U.ipod31, "iPod touch product and pricing qualifications"),
        ],
      ),
    ],
    citations: [
      cite(U.security2009, "iOS 3.1 — 09 September 2009"),
      cite(U.itunes9, "iPhone OS 3.1 integration"),
      cite(U.ipod31, "iPhone 3.1 features"),
      cite(U.security31, "iOS 3.1 security content"),
    ],
    changes: [
      change(
        "ios-3-1-itunes-app-layout",
        "Home-screen app organization in iTunes",
        "Users could arrange application icons on a computer and synchronize that layout to the device.",
        "enhancement",
        "changed",
        "iTunes 9 could organize an iPhone home-screen app layout and reproduce the arrangement during synchronization.",
        [cite(U.itunes9, "Improved syncing with iPhone OS 3.1")],
      ),
      change(
        "ios-3-1-selective-media-photo-sync",
        "More selective media and photo syncing",
        "Synchronization controls expanded to artist, genre, Events, and Faces groupings.",
        "enhancement",
        "changed",
        "Apple added music selection by artist and genre plus photo selection by Events and Faces, alongside broader media-sync improvements.",
        [cite(U.itunes9, "Improved syncing with iPhone OS 3.1")],
      ),
      change(
        "ios-3-1-genius-mixes",
        "Genius Mixes",
        "Automatically generated continuous mixes grouped compatible songs from a user's library.",
        "feature",
        "introduced",
        "Genius Mixes could generate up to twelve ongoing mixes based on Apple’s analysis of submitted music libraries.",
        [cite(U.itunes9, "Genius Mixes"), cite(U.ipod31, "Genius Mixes")],
      ),
      change(
        "ios-3-1-genius-for-apps",
        "Genius for Apps",
        "The App Store added personalized application recommendations.",
        "feature",
        "introduced",
        "Apple listed Genius for Apps among the user-facing benefits available with the 3.1 update.",
        [cite(U.ipod31, "3.1 software update features")],
      ),
      change(
        "ios-3-1-ringtone-store",
        "Precut ringtone purchases",
        "The on-device iTunes Store added a catalog of ready-to-use ringtones.",
        "feature",
        "introduced",
        "The iPhone store offered more than twenty thousand precut ringtones for individual purchase at launch.",
        [cite(U.itunes9, "iTunes Store on iPhone")],
      ),
      change(
        "ios-3-1-mobileme-lock-phishing",
        "MobileMe remote lock and anti-phishing",
        "The update expanded remote device control and browser protection against deceptive sites.",
        "security",
        "changed",
        "Apple identified MobileMe remote lock and anti-phishing behavior as part of the 3.1 software, with service and device applicability preserved.",
        [cite(U.ipod31, "iPhone 3.1 software features")],
      ),
      change(
        "ios-3-1-coreaudio-memory-safety",
        "CoreAudio memory safety",
        "Audio parsing added bounds checks for crafted AAC and MP3 files.",
        "security",
        "fixed",
        "Apple corrected a heap overflow that could terminate an application or execute code when a malicious audio file was opened.",
        [cite(U.security31, "CoreAudio — CVE-2009-2206")],
      ),
      change(
        "ios-3-1-exchange-passcode-timeout",
        "Exchange passcode timeout enforcement",
        "Device passcode choices could no longer exceed an Exchange administrator's inactivity limit.",
        "security",
        "fixed",
        "The update aligned the user's Require Passcode options with the server-defined maximum inactivity timeout.",
        [cite(U.security31, "Exchange Support — CVE-2009-2794")],
      ),
      change(
        "ios-3-1-deleted-mail-spotlight",
        "Deleted Mail exclusion from Spotlight",
        "Deleted messages stopped appearing through device search.",
        "security",
        "fixed",
        "Apple prevented Spotlight from exposing email that had already been deleted from Mail folders.",
        [cite(U.security31, "MobileMail — CVE-2009-2207")],
      ),
      change(
        "ios-3-1-recovery-mode-boundary",
        "Recovery Mode passcode boundary",
        "Recovery command parsing was hardened against physical-access data extraction.",
        "security",
        "fixed",
        "Apple repaired a heap overflow that could let someone with physical access bypass a passcode and reach user data.",
        [cite(U.security31, "Recovery Mode — CVE-2009-2795")],
      ),
      change(
        "ios-3-1-sms-arrival-resilience",
        "SMS arrival resilience",
        "Telephony handling of crafted SMS arrival notifications was corrected.",
        "security",
        "fixed",
        "The update fixed a null-pointer condition through which a malicious SMS could interrupt service.",
        [cite(U.security31, "Telephony — CVE-2009-2815")],
      ),
      change(
        "ios-3-1-password-undo-privacy",
        "Password undo privacy",
        "Undoing character deletion no longer briefly revealed password text.",
        "security",
        "fixed",
        "Apple stopped a deleted password character from becoming visible again when the deletion was undone.",
        [cite(U.security31, "UIKit — CVE-2009-2796")],
      ),
      change(
        "ios-3-1-web-credential-url-protection",
        "Web credential and deceptive-URL protections",
        "Safari reduced credential leakage through referrers and made look-alike internationalized domains more apparent.",
        "security",
        "fixed",
        "WebKit stopped placing URL credentials in referral headers and rendered known look-alike domain characters in Punycode.",
        [cite(U.security31, "WebKit — CVE-2009-2797 and CVE-2009-2199")],
      ),
      change(
        "ios-3-1-webkit-script-memory-safety",
        "WebKit script and memory safety",
        "The browser engine corrected cross-site scripting and crafted-content memory corruption.",
        "security",
        "fixed",
        "Apple repaired parent/top object handling and numeric character-reference processing that could cross security origins, terminate an app, or execute code.",
        [cite(U.security31, "WebKit — CVE-2009-1724 and CVE-2009-1725")],
      ),
    ],
  },
  {
    version: "3.1.2",
    summary:
      "The public iPhone OS 3.1.2 update addressed wake-from-sleep reliability, cellular service interruption, and crashes during video streaming according to a contemporaneous preservation of the displayed update notes.",
    blocks: [
      block(
        "MacRumors reported the public release of iPhone OS 3.1.2 on October 8, 2009 and preserved three items from the update notice: wake-from-sleep failures, cellular service interruptions that could persist until restart, and occasional crashes during video streaming.",
        [cite(U.macrumors312, "Release date and displayed update notes")],
      ),
      block(
        "No surviving first-party Apple feature page or dated security-index entry for 3.1.2 was found in the reviewed source set. The local audited date is retained and the three ordinary fixes are labeled as contemporaneous journalism rather than first-party confirmation; no security or undocumented-change claim is inferred.",
        [
          cite(
            U.macrumors312,
            "October 8, 2009 report and update-note transcription",
          ),
          cite(
            U.security2009,
            "Archived 2009 index; no iOS 3.1.2 entry",
            "Used only to bound what Apple's retained security index does not document.",
          ),
        ],
      ),
    ],
    citations: [
      cite(U.macrumors312, "October 8, 2009 release and update notes"),
      cite(
        U.security2009,
        "Archived 2009 index; no iOS 3.1.2 entry",
        "Absence is not treated as proof that no security work occurred.",
      ),
    ],
    changes: [
      change(
        "ios-3-1-2-wake-from-sleep",
        "Wake-from-sleep reliability",
        "The maintenance update addressed a sporadic failure to wake an iPhone from sleep.",
        "bugFix",
        "fixed",
        "A contemporaneous report preserving the update notice says 3.1.2 corrected an intermittent case where an iPhone would not wake.",
        [cite(U.macrumors312, "Displayed update notes — wake from sleep")],
        "reported",
      ),
      change(
        "ios-3-1-2-cellular-service",
        "Cellular service continuity",
        "The maintenance update addressed a cellular interruption that could require a restart.",
        "bugFix",
        "fixed",
        "The preserved update notice describes an intermittent loss of cellular service that could persist until the device restarted.",
        [
          cite(
            U.macrumors312,
            "Displayed update notes — cellular network services",
          ),
        ],
        "reported",
      ),
      change(
        "ios-3-1-2-video-stream-crash",
        "Video-streaming crash",
        "The update corrected an occasional crash during streamed video playback.",
        "bugFix",
        "fixed",
        "The third listed maintenance item addressed a crash that could occur while video was streaming.",
        [cite(U.macrumors312, "Displayed update notes — video streaming")],
        "reported",
      ),
    ],
  },
  {
    version: "3.1.3",
    releaseNotesUrl: U.security313,
    summary:
      "The public iPhone OS 3.1.3 update combined three contemporaneously preserved maintenance fixes with Apple-confirmed CoreAudio, ImageIO, Recovery Mode, and WebKit security repairs.",
    blocks: [
      block(
        "Apple’s archived index and advisory place iPhone OS 3.1.3 on February 2, 2010. A same-day Macworld report preserves ordinary fixes for iPhone 3GS battery-level accuracy, third-party application launch failures, and crashes involving the Japanese Kana keyboard.",
        [
          cite(U.security2010, "iOS 3.1.3 — 02 February 2010"),
          cite(U.security313, "iOS 3.1.3 security content"),
          cite(U.macworld313, "Same-day report and ordinary fixes"),
        ],
      ),
      block(
        "Apple’s primary advisory separately confirms five security items across crafted audio, TIFF images, recovery-mode USB handling, FTP directory parsing, and remote media loading in HTML mail. The ordinary changes remain attributed to contemporaneous journalism because they are absent from Apple’s retained advisory.",
        [
          cite(U.security313, "CoreAudio through WebKit"),
          cite(U.macworld313, "Maintenance-note preservation"),
        ],
      ),
    ],
    citations: [
      cite(U.security2010, "iOS 3.1.3 — 02 February 2010"),
      cite(U.security313, "iOS 3.1.3 security content"),
      cite(U.macworld313, "February 2, 2010 release and maintenance notes"),
    ],
    changes: [
      change(
        "ios-3-1-3-battery-level-accuracy",
        "iPhone 3GS battery-level accuracy",
        "The maintenance release improved reported battery-level accuracy on iPhone 3GS.",
        "bugFix",
        "fixed",
        "Macworld's same-day preservation of the update notes identifies more accurate battery reporting on iPhone 3GS.",
        [cite(U.macworld313, "Ordinary fixes — battery level")],
        "reported",
      ),
      change(
        "ios-3-1-3-third-party-app-launch",
        "Third-party application launch reliability",
        "The update addressed cases where third-party applications would not start.",
        "bugFix",
        "fixed",
        "The contemporaneous release report lists a correction for third-party programs that sometimes failed to launch.",
        [cite(U.macworld313, "Ordinary fixes — third-party programs")],
        "reported",
      ),
      change(
        "ios-3-1-3-kana-keyboard-crash",
        "Japanese Kana keyboard crash",
        "The update corrected an application crash associated with Japanese Kana input.",
        "bugFix",
        "fixed",
        "The preserved maintenance notes identify a crash that could occur while using the Japanese Kana keyboard.",
        [cite(U.macworld313, "Ordinary fixes — Japanese Kana keyboard")],
        "reported",
      ),
      change(
        "ios-3-1-3-media-parser-security",
        "CoreAudio and ImageIO parser safety",
        "Audio and image frameworks added bounds checks for crafted MP4 and TIFF content.",
        "security",
        "fixed",
        "Apple fixed a CoreAudio buffer overflow and an ImageIO buffer underflow that could terminate an app or execute code.",
        [
          cite(
            U.security313,
            "CoreAudio — CVE-2010-0036; ImageIO — CVE-2009-2285",
          ),
        ],
      ),
      change(
        "ios-3-1-3-recovery-usb-boundary",
        "Recovery Mode USB boundary",
        "Recovery Mode improved handling of a crafted USB control message.",
        "security",
        "fixed",
        "Apple repaired memory corruption that could otherwise let someone with physical access bypass a passcode and reach user data.",
        [cite(U.security313, "Recovery Mode — CVE-2010-0038")],
      ),
      change(
        "ios-3-1-3-webkit-ftp-parsing",
        "WebKit FTP directory parsing",
        "The browser engine improved validation of FTP directory listings.",
        "security",
        "fixed",
        "Apple corrected multiple FTP parsing weaknesses that could disclose information, terminate an app, or execute code.",
        [cite(U.security313, "WebKit — CVE-2009-3384")],
      ),
      change(
        "ios-3-1-3-mail-remote-media-privacy",
        "Mail remote media privacy",
        "WebKit began issuing resource callbacks for HTML media elements so Mail's remote-loading choice could be honored.",
        "security",
        "fixed",
        "The fix stopped remote audio or video in an HTML email from bypassing the setting that disabled remote image loading and signaling that a message had been read.",
        [cite(U.security313, "WebKit — CVE-2009-2841")],
      ),
    ],
  },
  {
    version: "3.2",
    releaseNotesUrl: U.ipad,
    summary:
      "The public iPhone OS 3.2 release was the original iPad software, adapting Multi-Touch applications, web, mail, photos, video, books, stores, and content synchronization to the tablet's larger display.",
    blocks: [
      block(
        "The local iOS 3.2 route represents the original iPad software that reached customers with the Wi-Fi iPad on April 3, 2010. Apple’s launch material describes a larger-screen Multi-Touch experience for web browsing, mail, photos, HD video, music, games, and ebooks.",
        [cite(U.ipad, "April 3 availability; principal iPad experiences")],
      ),
      block(
        "Apple also documented twelve built-in apps redesigned for iPad, compatibility with almost all then-current iPhone and iPod touch apps, a wireless App Store, iBooks and the iBookstore, expanded iTunes media access, and computer synchronization. The reviewed Apple security indexes do not list an initial 3.2 advisory, so this page makes no version-specific security claim.",
        [
          cite(U.ipad, "Apps, App Store, iBooks, iTunes, and availability"),
          cite(
            U.security2010,
            "2010 index; no initial iOS 3.2 security entry",
            "Used only as an evidence boundary, not proof that no security work occurred.",
          ),
        ],
      ),
    ],
    citations: [
      cite(U.ipad, "April 3 availability and launch features"),
      cite(
        U.security2010,
        "2010 index; no initial iOS 3.2 security entry",
        "The absence of an advisory is not a claim that the release had no security changes.",
      ),
    ],
    changes: [
      change(
        "ios-3-2-ipad-multitouch-web",
        "iPad Multi-Touch web experience",
        "The software adapted direct-touch web browsing to the iPad's larger display.",
        "feature",
        "introduced",
        "Apple described a larger, more interactive Safari experience designed around the original iPad display and Multi-Touch interface.",
        [cite(U.ipad, "Multi-Touch web browsing")],
      ),
      change(
        "ios-3-2-ipad-mail-keyboard",
        "Large-screen Mail and soft keyboard",
        "Mail used the larger display and an almost full-size software keyboard.",
        "feature",
        "introduced",
        "The original iPad software presented email and composition controls around the tablet display and its larger on-screen keyboard.",
        [cite(U.ipad, "Mail and soft keyboard")],
      ),
      change(
        "ios-3-2-ipad-photo-workflow",
        "iPad photo import, albums, and slideshows",
        "The tablet software supported computer or camera imports, album organization, and touch-driven slideshows.",
        "feature",
        "introduced",
        "Apple documented photo import from a Mac, PC, or digital camera together with album views and slideshow presentation.",
        [cite(U.ipad, "Photo import, albums, and slideshows")],
      ),
      change(
        "ios-3-2-ipad-hd-media",
        "iPad HD video playback",
        "The original iPad software emphasized larger-screen playback for movies, television, and YouTube.",
        "feature",
        "introduced",
        "Apple presented movies, TV shows, and YouTube video in HD as part of the launch software's media experience.",
        [cite(U.ipad, "Video and YouTube")],
      ),
      change(
        "ios-3-2-ibooks-store",
        "iBooks and iBookstore",
        "The iPad launch introduced Apple's ebook reader and integrated bookstore.",
        "feature",
        "introduced",
        "The free iBooks app supported browsing, buying, and reading books from the new US iBookstore, with regional availability explicitly limited at launch.",
        [cite(U.ipad, "iBooks, iBookstore, and availability")],
      ),
      change(
        "ios-3-2-ipad-native-apps",
        "iPad-designed built-in applications",
        "Apple redesigned a set of built-in applications for the tablet's display and interaction model.",
        "feature",
        "introduced",
        "Apple said the iPad included twelve applications designed specifically for the device rather than merely scaling the phone layout.",
        [cite(U.ipad, "Twelve apps designed for iPad")],
      ),
      change(
        "ios-3-2-iphone-app-compatibility",
        "Compatibility with existing iPhone applications",
        "The iPad could run most existing App Store applications made for iPhone and iPod touch.",
        "compatibility",
        "introduced",
        "Apple said almost all of the more than 150,000 existing apps could run on iPad, including applications a user had already purchased.",
        [cite(U.ipad, "App compatibility")],
      ),
      change(
        "ios-3-2-ipad-stores-sync",
        "Wireless stores and iTunes synchronization",
        "The iPad combined wireless app and media storefronts with later synchronization to a computer library.",
        "feature",
        "introduced",
        "Users could browse and download apps wirelessly, access iTunes music, television, and movie catalogs, and synchronize downloaded apps and content with iTunes on a computer.",
        [cite(U.ipad, "App Store, iTunes Store, and synchronization")],
      ),
    ],
  },
];

const idFor = (version) => `version-ios-${version.replaceAll(".", "-")}`;
const reviewedAt = "2026-07-30T05:18:42Z";
const review = { status: "approved", reviewedAt };
const provenanceStatus = "editoriallyVerified";

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
